import { createContext, useCallback, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { commissionService } from '@/Services/commissionService';
import type { LotteryCommissionsPanel } from '@/types/commission';

export interface CommissionContextType {
  panel: LotteryCommissionsPanel | null;
  loading: boolean;
  error: string | null;
  loadByLottery: (lotteryId: number) => Promise<void>;
  clearError: () => void;
}

const CommissionContext = createContext<CommissionContextType | undefined>(undefined);

export const CommissionProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [panel, setPanel] = useState<LotteryCommissionsPanel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadByLottery = useCallback(async (lotteryId: number): Promise<void> => {
    setLoading(true);
    try {
      setPanel(await commissionService.listByLottery(lotteryId));
      setError(null);
    } catch (err) {
      toast.error('Falha ao carregar comissões.');
      setError(err instanceof Error ? err.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <CommissionContext.Provider value={{ panel, loading, error, loadByLottery, clearError }}>
      {children}
    </CommissionContext.Provider>
  );
};

export default CommissionContext;
