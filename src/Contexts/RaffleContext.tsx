import { createContext, useCallback, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { raffleService } from '@/Services/raffleService';
import type { RaffleInfo, RaffleInsertInfo } from '@/types/raffle';

export interface RaffleContextType {
  raffles: RaffleInfo[];
  currentRaffle: RaffleInfo | null;
  loading: boolean;
  error: string | null;
  loadByLottery: (lotteryId: number) => Promise<void>;
  loadById: (raffleId: number) => Promise<RaffleInfo | null>;
  create: (payload: RaffleInsertInfo) => Promise<RaffleInfo | null>;
  close: (raffleId: number) => Promise<boolean>;
  clearError: () => void;
}

const RaffleContext = createContext<RaffleContextType | undefined>(undefined);

export const RaffleProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [raffles, setRaffles] = useState<RaffleInfo[]>([]);
  const [currentRaffle, setCurrentRaffle] = useState<RaffleInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fail = useCallback((err: unknown, msg: string) => {
    toast.error(msg);
    setError(err instanceof Error ? err.message : msg);
  }, []);

  const loadByLottery = useCallback(
    async (lotteryId: number): Promise<void> => {
      setLoading(true);
      try {
        const list = await raffleService.listByLottery(lotteryId);
        setRaffles(
          [...list].sort(
            (a, b) => new Date(a.raffleDatetime).getTime() - new Date(b.raffleDatetime).getTime(),
          ),
        );
        setError(null);
      } catch (err) {
        fail(err, 'Falha ao carregar sorteios.');
      } finally {
        setLoading(false);
      }
    },
    [fail],
  );

  const loadById = useCallback(
    async (raffleId: number): Promise<RaffleInfo | null> => {
      try {
        const raffle = await raffleService.getById(raffleId);
        setCurrentRaffle(raffle);
        return raffle;
      } catch (err) {
        fail(err, 'Sorteio não encontrado.');
        return null;
      }
    },
    [fail],
  );

  const create = useCallback(
    async (payload: RaffleInsertInfo): Promise<RaffleInfo | null> => {
      try {
        const created = await raffleService.create(payload);
        setRaffles((prev) =>
          [...prev, created].sort(
            (a, b) => new Date(a.raffleDatetime).getTime() - new Date(b.raffleDatetime).getTime(),
          ),
        );
        toast.success('Sorteio adicionado.');
        return created;
      } catch (err) {
        fail(err, 'Falha ao adicionar sorteio.');
        return null;
      }
    },
    [fail],
  );

  const close = useCallback(
    async (raffleId: number): Promise<boolean> => {
      try {
        await raffleService.close(raffleId);
        toast.success('Sorteio encerrado.');
        return true;
      } catch (err) {
        fail(err, 'Falha ao encerrar sorteio.');
        return false;
      }
    },
    [fail],
  );

  const clearError = useCallback(() => setError(null), []);

  return (
    <RaffleContext.Provider
      value={{
        raffles,
        currentRaffle,
        loading,
        error,
        loadByLottery,
        loadById,
        create,
        close,
        clearError,
      }}
    >
      {children}
    </RaffleContext.Provider>
  );
};

export default RaffleContext;
