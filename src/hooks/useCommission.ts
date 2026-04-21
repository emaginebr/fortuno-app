import { useContext } from 'react';
import CommissionContext, { type CommissionContextType } from '@/Contexts/CommissionContext';

export const useCommission = (): CommissionContextType => {
  const ctx = useContext(CommissionContext);
  if (!ctx) throw new Error('useCommission must be used within a CommissionProvider');
  return ctx;
};
