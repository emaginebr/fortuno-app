import { createContext, useCallback, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { raffleAwardService } from '@/Services/raffleAwardService';
import type {
  RaffleAwardInfo,
  RaffleAwardInsertInfo,
  RaffleAwardUpdateInfo,
} from '@/types/raffleAward';

export interface RaffleAwardContextType {
  awards: RaffleAwardInfo[];
  loading: boolean;
  error: string | null;
  loadByRaffle: (raffleId: number) => Promise<void>;
  create: (payload: RaffleAwardInsertInfo) => Promise<RaffleAwardInfo | null>;
  update: (payload: RaffleAwardUpdateInfo) => Promise<RaffleAwardInfo | null>;
  remove: (raffleAwardId: number) => Promise<boolean>;
  clearError: () => void;
}

const RaffleAwardContext = createContext<RaffleAwardContextType | undefined>(undefined);

export const RaffleAwardProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [awards, setAwards] = useState<RaffleAwardInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fail = useCallback((err: unknown, msg: string) => {
    toast.error(msg);
    setError(err instanceof Error ? err.message : msg);
  }, []);

  const loadByRaffle = useCallback(
    async (raffleId: number): Promise<void> => {
      setLoading(true);
      try {
        const list = await raffleAwardService.listByRaffle(raffleId);
        setAwards([...list].sort((a, b) => a.position - b.position));
        setError(null);
      } catch (err) {
        fail(err, 'Falha ao carregar prêmios.');
      } finally {
        setLoading(false);
      }
    },
    [fail],
  );

  const create = useCallback(
    async (payload: RaffleAwardInsertInfo): Promise<RaffleAwardInfo | null> => {
      try {
        const created = await raffleAwardService.create(payload);
        setAwards((prev) => [...prev, created].sort((a, b) => a.position - b.position));
        toast.success('Prêmio adicionado.');
        return created;
      } catch (err) {
        fail(err, 'Falha ao adicionar prêmio.');
        return null;
      }
    },
    [fail],
  );

  const update = useCallback(
    async (payload: RaffleAwardUpdateInfo): Promise<RaffleAwardInfo | null> => {
      try {
        const updated = await raffleAwardService.update(payload);
        setAwards((prev) =>
          prev
            .map((a) => (a.raffleAwardId === updated.raffleAwardId ? updated : a))
            .sort((a, b) => a.position - b.position),
        );
        return updated;
      } catch (err) {
        fail(err, 'Falha ao atualizar prêmio.');
        return null;
      }
    },
    [fail],
  );

  const remove = useCallback(
    async (raffleAwardId: number): Promise<boolean> => {
      try {
        await raffleAwardService.remove(raffleAwardId);
        setAwards((prev) => prev.filter((a) => a.raffleAwardId !== raffleAwardId));
        return true;
      } catch (err) {
        fail(err, 'Falha ao remover prêmio.');
        return false;
      }
    },
    [fail],
  );

  const clearError = useCallback(() => setError(null), []);

  return (
    <RaffleAwardContext.Provider
      value={{ awards, loading, error, loadByRaffle, create, update, remove, clearError }}
    >
      {children}
    </RaffleAwardContext.Provider>
  );
};

export default RaffleAwardContext;
