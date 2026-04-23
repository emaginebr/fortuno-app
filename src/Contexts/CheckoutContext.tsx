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
import { toast } from 'sonner';

export type CheckoutStep = 'quantity' | 'auth' | 'numbers' | 'payment' | 'success';

export interface CheckoutState {
  lotteryId: number | null;
  quantity: number;
  mode: TicketOrderMode;
  pickedNumbers: number[];
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
  addPickedNumber: (n: number) => void;
  removePickedNumber: (n: number) => void;
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
    return raw ? (JSON.parse(raw) as Partial<CheckoutState>) : {};
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

  const addPickedNumber = useCallback((n: number): void => {
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

  const removePickedNumber = useCallback((n: number): void => {
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
    // API exige pickedNumbers.length === quantity no modo Manual; caso contrário envia Random.
    const isManual =
      state.mode === TicketOrderMode.Manual &&
      state.pickedNumbers.length === state.quantity;
    // Descarta QR/status anteriores para forçar geração de um novo invoice a cada clique.
    setState((prev) => ({ ...prev, qrCode: null, lastStatus: null, tickets: null }));
    const payload = {
      lotteryId: state.lotteryId,
      quantity: state.quantity,
      mode: isManual ? TicketOrderMode.Manual : TicketOrderMode.Random,
      pickedNumbers: isManual ? state.pickedNumbers : undefined,
      referralCode: state.referralCode,
    };
    // eslint-disable-next-line no-console
    console.log('[checkout] createQrCode payload', payload);
    try {
      const qr = await ticketService.createQrCode(payload);
      setState((prev) => ({ ...prev, qrCode: qr, currentStep: 'payment' }));
      return qr;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Falha ao gerar QR Code.');
      return null;
    }
  }, [state.lotteryId, state.quantity, state.mode, state.pickedNumbers, state.referralCode]);

  const setPaymentResult = useCallback(
    (status: TicketOrderStatus, tickets?: TicketInfo[]): void => {
      setState((prev) => ({
        ...prev,
        lastStatus: status,
        tickets: tickets ?? prev.tickets,
        currentStep: status === TicketOrderStatus.Paid ? 'success' : prev.currentStep,
      }));
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
