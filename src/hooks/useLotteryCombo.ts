import { useContext } from 'react';
import LotteryComboContext, { type LotteryComboContextType } from '@/Contexts/LotteryComboContext';

export const useLotteryCombo = (): LotteryComboContextType => {
  const ctx = useContext(LotteryComboContext);
  if (!ctx) throw new Error('useLotteryCombo must be used within a LotteryComboProvider');
  return ctx;
};
