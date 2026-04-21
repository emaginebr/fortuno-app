import { useContext } from 'react';
import LotteryContext, { type LotteryContextType } from '@/Contexts/LotteryContext';

export const useLottery = (): LotteryContextType => {
  const ctx = useContext(LotteryContext);
  if (!ctx) {
    throw new Error('useLottery must be used within a LotteryProvider');
  }
  return ctx;
};
