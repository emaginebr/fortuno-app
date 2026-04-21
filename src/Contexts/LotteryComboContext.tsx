import { createContext, useCallback, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { lotteryComboService } from '@/Services/lotteryComboService';
import type {
  LotteryComboInfo,
  LotteryComboInsertInfo,
  LotteryComboUpdateInfo,
} from '@/types/lotteryCombo';

export interface LotteryComboContextType {
  combos: LotteryComboInfo[];
  loading: boolean;
  error: string | null;
  loadByLottery: (lotteryId: number) => Promise<void>;
  create: (payload: LotteryComboInsertInfo) => Promise<LotteryComboInfo | null>;
  update: (payload: LotteryComboUpdateInfo) => Promise<LotteryComboInfo | null>;
  remove: (lotteryComboId: number) => Promise<boolean>;
  clearError: () => void;
}

const LotteryComboContext = createContext<LotteryComboContextType | undefined>(undefined);

export const LotteryComboProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [combos, setCombos] = useState<LotteryComboInfo[]>([]);
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
        setCombos(await lotteryComboService.listByLottery(lotteryId));
        setError(null);
      } catch (err) {
        fail(err, 'Falha ao carregar combos.');
      } finally {
        setLoading(false);
      }
    },
    [fail],
  );

  const create = useCallback(
    async (payload: LotteryComboInsertInfo): Promise<LotteryComboInfo | null> => {
      try {
        const created = await lotteryComboService.create(payload);
        setCombos((prev) => [...prev, created].sort((a, b) => a.quantityStart - b.quantityStart));
        toast.success('Combo criado.');
        return created;
      } catch (err) {
        fail(err, 'Falha ao criar combo.');
        return null;
      }
    },
    [fail],
  );

  const update = useCallback(
    async (payload: LotteryComboUpdateInfo): Promise<LotteryComboInfo | null> => {
      try {
        const updated = await lotteryComboService.update(payload);
        setCombos((prev) =>
          prev.map((c) => (c.lotteryComboId === updated.lotteryComboId ? updated : c)),
        );
        toast.success('Combo atualizado.');
        return updated;
      } catch (err) {
        fail(err, 'Falha ao atualizar combo.');
        return null;
      }
    },
    [fail],
  );

  const remove = useCallback(
    async (lotteryComboId: number): Promise<boolean> => {
      try {
        await lotteryComboService.remove(lotteryComboId);
        setCombos((prev) => prev.filter((c) => c.lotteryComboId !== lotteryComboId));
        toast.success('Combo removido.');
        return true;
      } catch (err) {
        fail(err, 'Falha ao remover combo.');
        return false;
      }
    },
    [fail],
  );

  const clearError = useCallback(() => setError(null), []);

  return (
    <LotteryComboContext.Provider
      value={{ combos, loading, error, loadByLottery, create, update, remove, clearError }}
    >
      {children}
    </LotteryComboContext.Provider>
  );
};

export default LotteryComboContext;
