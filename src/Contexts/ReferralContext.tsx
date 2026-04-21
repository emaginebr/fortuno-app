import { createContext, useCallback, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { referralService } from '@/Services/referralService';
import type { ReferrerEarningsPanel } from '@/types/referral';

export interface ReferralContextType {
  referralCode: string | null;
  panel: ReferrerEarningsPanel | null;
  loading: boolean;
  error: string | null;
  loadMyCode: () => Promise<void>;
  loadPanel: () => Promise<void>;
  clearError: () => void;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export const ReferralProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [panel, setPanel] = useState<ReferrerEarningsPanel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fail = useCallback((err: unknown, msg: string) => {
    toast.error(msg);
    setError(err instanceof Error ? err.message : msg);
  }, []);

  const loadMyCode = useCallback(async (): Promise<void> => {
    try {
      const r = await referralService.getMyCode();
      setReferralCode(r.referralCode);
    } catch (err) {
      fail(err, 'Falha ao carregar código de indicação.');
    }
  }, [fail]);

  const loadPanel = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const p = await referralService.getEarningsPanel();
      setPanel(p);
      setReferralCode(p.referralCode);
      setError(null);
    } catch (err) {
      fail(err, 'Falha ao carregar seus pontos.');
    } finally {
      setLoading(false);
    }
  }, [fail]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <ReferralContext.Provider
      value={{ referralCode, panel, loading, error, loadMyCode, loadPanel, clearError }}
    >
      {children}
    </ReferralContext.Provider>
  );
};

export default ReferralContext;
