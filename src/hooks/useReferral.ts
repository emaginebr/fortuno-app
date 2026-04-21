import { useContext } from 'react';
import ReferralContext, { type ReferralContextType } from '@/Contexts/ReferralContext';

export const useReferral = (): ReferralContextType => {
  const ctx = useContext(ReferralContext);
  if (!ctx) throw new Error('useReferral must be used within a ReferralProvider');
  return ctx;
};
