import { useContext } from 'react';
import RaffleAwardContext, { type RaffleAwardContextType } from '@/Contexts/RaffleAwardContext';

export const useRaffleAward = (): RaffleAwardContextType => {
  const ctx = useContext(RaffleAwardContext);
  if (!ctx) throw new Error('useRaffleAward must be used within a RaffleAwardProvider');
  return ctx;
};
