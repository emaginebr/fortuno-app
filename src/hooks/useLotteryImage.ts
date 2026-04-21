import { useContext } from 'react';
import LotteryImageContext, { type LotteryImageContextType } from '@/Contexts/LotteryImageContext';

export const useLotteryImage = (): LotteryImageContextType => {
  const ctx = useContext(LotteryImageContext);
  if (!ctx) throw new Error('useLotteryImage must be used within a LotteryImageProvider');
  return ctx;
};
