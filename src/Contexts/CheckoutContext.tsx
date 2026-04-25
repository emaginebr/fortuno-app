import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { TicketOrderMode, TicketOrderStatus } from '@/types/enums';
import type { TicketInfo, TicketQRCodeInfo } from '@/types/ticket';
import { ticketService } from '@/Services/ticketService';
import { ApiError } from '@/Services/apiHelpers';
import { toast } from 'sonner';

export type CheckoutStep = 'quantity' | 'auth' | 'numbers' | 'payment' | 'success';

export interface CheckoutState {
  lotteryId: number | null;
  quantity: number;
  mode: TicketOrderMode;
  /**
   * Números escolhidos pelo usuário, em formato string canônico:
   * - Int64:    "42"
   * - Composed: "05-11-28-39-60"
   * Alinhado com `TicketOrderRequest.pickedNumbers` do backend
   * (ver FRONTEND_TICKET_NUMBER_FORMAT_MIGRATION.md §4).
   */
  pickedNumbers: string[];
  referralCode?: string;
  currentStep: CheckoutStep;
  qrCode?: TicketQRCodeInfo | null;
  lastStatus?: TicketOrderStatus | null;
  tickets?: TicketInfo[];
}

export interface CheckoutContextType extends CheckoutState {
  setLotteryId: (id: number) => void;
  setQuantity: (q: number) => void;
  setMode: (m: TicketOrderMode) => void;
  setReferralCode: (code: string | undefined) => void;
  addPickedNumber: (n: string) => void;
  removePickedNumber: (n: string) => void;
  clearPickedNumbers: () => void;
  fillRandomRest: () => void;
  goToStep: (step: CheckoutStep) => void;
  startPayment: () => Promise<TicketQRCodeInfo | null>;
  setPaymentResult: (status: TicketOrderStatus, tickets?: TicketInfo[]) => void;
  reset: () => void;
}

const initialState: CheckoutState = {
  lotteryId: null,
  quantity: 1,
  mode: TicketOrderMode.Random,
  pickedNumbers: [],
  currentStep: 'quantity',
  qrCode: null,
  lastStatus: null,
  tickets: [],
};

const STORAGE_PREFIX = 'fortuno:checkout';

const loadPersisted = (lotteryId: number | null): Partial<CheckoutState> => {
  if (lotteryId === null) return {};
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}:${lotteryId}`);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<CheckoutState> & {
      pickedNumbers?: unknown;
    };
    // Migração: estado persistido no formato antigo usava number[]. Convertemos
    // em string[] ao carregar; Composed será revalidado/re-escolhido pelo user.
    if (Array.isArray(parsed.pickedNumbers)) {
      parsed.pickedNumbers = (parsed.pickedNumbers as unknown[])
        .map((n) => (typeof n === 'string' ? n : typeof n === 'number' ? String(n) : null))
        .filter((v): v is string => typeof v === 'string' && v.length > 0);
    }
    return parsed as Partial<CheckoutState>;
  } catch {
    return {};
  }
};

const persist = (state: CheckoutState): void => {
  if (state.lotteryId === null) return;
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}:${state.lotteryId}`, JSON.stringify(state));
  } catch {
    // Storage indisponível — ignorar
  }
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [state, setState] = useState<CheckoutState>(initialState);

  useEffect(() => {
    persist(state);
  }, [state]);

  const setLotteryId = useCallback((id: number): void => {
    setState((prev) => {
      if (prev.lotteryId === id) return prev;
      const persisted = loadPersisted(id);
      // Descarta estado persistido de compras anteriores já finalizadas para
      // que o fluxo recomece do zero em uma nova sessão.
      const persistedCompleted =
        persisted.lastStatus === TicketOrderStatus.Paid ||
        persisted.currentStep === 'success';
      if (persistedCompleted) {
        try {
          sessionStorage.removeItem(`${STORAGE_PREFIX}:${id}`);
        } catch {
          // ignore
        }
        return { ...initialState, lotteryId: id };
      }
      return { ...initialState, ...persisted, lotteryId: id };
    });
  }, []);

  const setQuantity = useCallback((q: number): void => {
    setState((prev) => ({ ...prev, quantity: Math.max(1, q) }));
  }, []);

  const setMode = useCallback((m: TicketOrderMode): void => {
    setState((prev) => ({ ...prev, mode: m }));
  }, []);

  const setReferralCode = useCallback((code: string | undefined): void => {
    setState((prev) => ({ ...prev, referralCode: code }));
  }, []);

  const addPickedNumber = useCallback((n: string): void => {
    setState((prev) => {
      if (prev.pickedNumbers.includes(n)) return prev;
      if (prev.pickedNumbers.length >= prev.quantity) return prev;
      return {
        ...prev,
        pickedNumbers: [...prev.pickedNumbers, n],
        mode: TicketOrderMode.Manual,
      };
    });
  }, []);

  const removePickedNumber = useCallback((n: string): void => {
    setState((prev) => ({
      ...prev,
      pickedNumbers: prev.pickedNumbers.filter((x) => x !== n),
    }));
  }, []);

  const clearPickedNumbers = useCallback((): void => {
    setState((prev) => ({ ...prev, pickedNumbers: [] }));
  }, []);

  const fillRandomRest = useCallback((): void => {
    // Frontend apenas marca o modo; o backend completa os números aleatoriamente
    // se enviarmos pickedNumbers.length < quantity.
    setState((prev) => ({ ...prev, mode: TicketOrderMode.Manual }));
    toast.info('O restante será sorteado automaticamente ao pagar.');
  }, []);

  const goToStep = useCallback((step: CheckoutStep): void => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const startPayment = useCallback(async (): Promise<TicketQRCodeInfo | null> => {
    if (!state.lotteryId) return null;
    // Backend não usa mais `mode`: completa automaticamente os bilhetes não
    // especificados em `pickedNumbers` até atingir `quantity`. Enviamos sempre
    // o que o usuário escolheu (subset 0..quantity).
    setState((prev) => ({ ...prev, qrCode: null, lastStatus: null, tickets: undefined }));
    const payload = {
      lotteryId: state.lotteryId,
      quantity: state.quantity,
      pickedNumbers:
        state.pickedNumbers.length > 0 ? state.pickedNumbers : undefined,
      referralCode: state.referralCode,
    };
    // eslint-disable-next-line no-console
    console.log('[checkout] createQrCode payload', payload);
    try {
      const qr = await ticketService.createQrCode(payload);
      setState((prev) => ({ ...prev, qrCode: qr, currentStep: 'payment' }));
      return qr;
    } catch (err) {
      // Novos erros 400 de validação de número (§11 da migração) chegam como
      // ApiError com `message` sumarizado e `errors[]` detalhado por número.
      // Mostramos a mensagem principal no topo + cada detalhe como toast
      // adicional para o usuário saber qual número precisa corrigir.
      if (err instanceof ApiError) {
        toast.error(err.message);
        for (const detail of err.errors ?? []) {
          if (detail && detail !== err.message) toast.error(detail);
        }
      } else {
        toast.error(err instanceof Error ? err.message : 'Falha ao gerar QR Code.');
      }
      return null;
    }
  }, [state.lotteryId, state.quantity, state.pickedNumbers, state.referralCode]);

  const setPaymentResult = useCallback(
    (status: TicketOrderStatus, tickets?: TicketInfo[]): void => {
      setState((prev) => {
        const paid = status === TicketOrderStatus.Paid;
        return {
          ...prev,
          lastStatus: status,
          tickets: tickets ?? prev.tickets,
          currentStep: paid ? 'success' : prev.currentStep,
          // Ao confirmar pagamento, limpa bilhetes escolhidos e reinicia o modo
          // para que uma próxima compra comece com carrinho zerado.
          pickedNumbers: paid ? [] : prev.pickedNumbers,
          mode: paid ? TicketOrderMode.Random : prev.mode,
        };
      });
    },
    [],
  );

  const reset = useCallback((): void => {
    if (state.lotteryId !== null) {
      try {
        sessionStorage.removeItem(`${STORAGE_PREFIX}:${state.lotteryId}`);
      } catch {
        // ignore
      }
    }
    setState(initialState);
  }, [state.lotteryId]);

  return (
    <CheckoutContext.Provider
      value={{
        ...state,
        setLotteryId,
        setQuantity,
        setMode,
        setReferralCode,
        addPickedNumber,
        removePickedNumber,
        clearPickedNumbers,
        fillRandomRest,
        goToStep,
        startPayment,
        setPaymentResult,
        reset,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export default CheckoutContext;
