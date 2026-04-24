import { createContext, useCallback, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { lotteryService } from '@/Services/lotteryService';
import type {
  LotteryInfo,
  LotteryInsertInfo,
  LotteryUpdateInfo,
  LotteryCancelRequest,
} from '@/types/lottery';
import { ApiError, UnauthenticatedError } from '@/Services/apiHelpers';

/**
 * Sinaliza, para quem chamou `create`, o tipo de erro que aconteceu —
 * permite que a UI reaja especificamente a problemas de sessão NAuth
 * ou perfil incompleto (novos 400 vindos da migração Store Transparente).
 */
export type LotteryCreateErrorKind =
  | 'unauthenticated'
  | 'profile-incomplete'
  | 'generic';

export interface LotteryContextType {
  openLotteries: LotteryInfo[];
  currentLottery: LotteryInfo | null;
  myLotteries: LotteryInfo[];
  loading: boolean;
  error: string | null;
  /** Tipo do último erro de `create`, usado pela UI para decidir o próximo passo. */
  lastCreateErrorKind: LotteryCreateErrorKind | null;
  loadOpen: () => Promise<void>;
  loadById: (lotteryId: number) => Promise<LotteryInfo | null>;
  loadBySlug: (slug: string) => Promise<LotteryInfo | null>;
  loadMine: () => Promise<void>;
  create: (payload: LotteryInsertInfo) => Promise<LotteryInfo | null>;
  update: (payload: LotteryUpdateInfo) => Promise<LotteryInfo | null>;
  publish: (lotteryId: number) => Promise<boolean>;
  revertToDraft: (lotteryId: number) => Promise<boolean>;
  close: (lotteryId: number) => Promise<boolean>;
  cancel: (lotteryId: number, payload: LotteryCancelRequest) => Promise<boolean>;
  remove: (lotteryId: number) => Promise<boolean>;
  clearError: () => void;
}

const LotteryContext = createContext<LotteryContextType | undefined>(undefined);

export const LotteryProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [openLotteries, setOpenLotteries] = useState<LotteryInfo[]>([]);
  const [currentLottery, setCurrentLottery] = useState<LotteryInfo | null>(null);
  const [myLotteries, setMyLotteries] = useState<LotteryInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCreateErrorKind, setLastCreateErrorKind] =
    useState<LotteryCreateErrorKind | null>(null);

  const handleError = useCallback((err: unknown, fallback = 'Erro inesperado') => {
    if (err instanceof UnauthenticatedError) {
      toast.error('Sessão expirada. Faça login novamente.');
    } else if (err instanceof ApiError) {
      // Erros 400 de validação de faixa por NumberType (§7 da migração) chegam
      // como ApiError com mensagem principal + detalhes em `errors[]`. Exibimos
      // cada detalhe para o admin saber exatamente qual regra quebrou.
      toast.error(err.message);
      for (const detail of err.errors ?? []) {
        if (detail && detail !== err.message) toast.error(detail);
      }
    } else {
      toast.error(fallback);
    }
    setError(err instanceof Error ? err.message : fallback);
  }, []);

  const loadOpen = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const list = await lotteryService.listOpen();
      setOpenLotteries(list);
      setError(null);
    } catch (err) {
      handleError(err, 'Falha ao carregar sorteios em andamento.');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const loadById = useCallback(
    async (lotteryId: number): Promise<LotteryInfo | null> => {
      setLoading(true);
      try {
        const lottery = await lotteryService.getById(lotteryId);
        setCurrentLottery(lottery);
        setError(null);
        return lottery;
      } catch (err) {
        handleError(err, 'Falha ao carregar sorteio.');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const loadBySlug = useCallback(
    async (slug: string): Promise<LotteryInfo | null> => {
      setLoading(true);
      try {
        const lottery = await lotteryService.getBySlug(slug);
        setCurrentLottery(lottery);
        setError(null);
        return lottery;
      } catch (err) {
        handleError(err, 'Sorteio não encontrado.');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const loadMine = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const list = await lotteryService.listMine();
      setMyLotteries(list);
      setError(null);
    } catch (err) {
      handleError(err, 'Falha ao carregar meus sorteios.');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const create = useCallback(
    async (payload: LotteryInsertInfo): Promise<LotteryInfo | null> => {
      setLoading(true);
      setLastCreateErrorKind(null);
      try {
        const lottery = await lotteryService.create(payload);
        setCurrentLottery(lottery);
        setMyLotteries((prev) => [lottery, ...prev]);
        toast.success('Sorteio criado em rascunho.');
        return lottery;
      } catch (err) {
        // Novos erros 400 após a migração Store Transparente — ver
        // docs/FRONTEND_STORE_TRANSPARENT_MIGRATION.md §3.1.
        const allMessages =
          err instanceof ApiError
            ? [err.message, ...(err.errors ?? [])].join(' ').toLowerCase()
            : '';

        const isNauthSessionProblem =
          err instanceof UnauthenticatedError ||
          allMessages.includes('usuário autenticado não encontrado no nauth');

        const isProfileIncomplete = allMessages.includes(
          'usuário sem nome ou e-mail cadastrado',
        );

        if (isNauthSessionProblem) {
          setLastCreateErrorKind('unauthenticated');
          toast.error(
            'Sua sessão expirou ou está inválida. Faça login novamente para continuar.',
          );
          setError('unauthenticated');
        } else if (isProfileIncomplete) {
          setLastCreateErrorKind('profile-incomplete');
          toast.error(
            'Complete seu cadastro (nome e e-mail) antes de criar seu primeiro sorteio.',
          );
          setError('profile-incomplete');
        } else {
          setLastCreateErrorKind('generic');
          handleError(err, 'Falha ao criar sorteio.');
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const update = useCallback(
    async (payload: LotteryUpdateInfo): Promise<LotteryInfo | null> => {
      setLoading(true);
      try {
        const lottery = await lotteryService.update(payload);
        setCurrentLottery(lottery);
        setMyLotteries((prev) =>
          prev.map((l) => (l.lotteryId === lottery.lotteryId ? lottery : l)),
        );
        toast.success('Sorteio atualizado.');
        return lottery;
      } catch (err) {
        handleError(err, 'Falha ao atualizar sorteio.');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const publish = useCallback(
    async (lotteryId: number): Promise<boolean> => {
      try {
        await lotteryService.publish(lotteryId);
        toast.success('Sorteio publicado!');
        return true;
      } catch (err) {
        handleError(err, 'Falha ao publicar sorteio.');
        return false;
      }
    },
    [handleError],
  );

  const revertToDraft = useCallback(
    async (lotteryId: number): Promise<boolean> => {
      try {
        await lotteryService.revertToDraft(lotteryId);
        toast.success('Sorteio revertido para rascunho.');
        return true;
      } catch (err) {
        handleError(err, 'Falha ao reverter sorteio para rascunho.');
        return false;
      }
    },
    [handleError],
  );

  const closeFn = useCallback(
    async (lotteryId: number): Promise<boolean> => {
      try {
        await lotteryService.close(lotteryId);
        toast.success('Sorteio encerrado.');
        return true;
      } catch (err) {
        handleError(err, 'Falha ao encerrar sorteio.');
        return false;
      }
    },
    [handleError],
  );

  const cancel = useCallback(
    async (lotteryId: number, payload: LotteryCancelRequest): Promise<boolean> => {
      try {
        await lotteryService.cancel(lotteryId, payload);
        toast.success('Sorteio cancelado.');
        return true;
      } catch (err) {
        handleError(err, 'Falha ao cancelar sorteio.');
        return false;
      }
    },
    [handleError],
  );

  const remove = useCallback(
    async (lotteryId: number): Promise<boolean> => {
      setLoading(true);
      try {
        await lotteryService.remove(lotteryId);
        setMyLotteries((prev) => prev.filter((l) => l.lotteryId !== lotteryId));
        toast.success('Sorteio excluído.');
        return true;
      } catch (err) {
        handleError(err, 'Falha ao excluir sorteio.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const clearError = useCallback(() => setError(null), []);

  return (
    <LotteryContext.Provider
      value={{
        openLotteries,
        currentLottery,
        myLotteries,
        loading,
        error,
        lastCreateErrorKind,
        loadOpen,
        loadById,
        loadBySlug,
        loadMine,
        create,
        update,
        publish,
        revertToDraft,
        close: closeFn,
        cancel,
        remove,
        clearError,
      }}
    >
      {children}
    </LotteryContext.Provider>
  );
};

export default LotteryContext;
