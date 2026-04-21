import { useContext } from 'react';
import RaffleContext, { type RaffleContextType } from '@/Contexts/RaffleContext';

export const useRaffle = (): RaffleContextType => {
  const ctx = useContext(RaffleContext);
  if (!ctx) throw new Error('useRaffle must be used within a RaffleProvider');
  return ctx;
};
