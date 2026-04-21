import { useContext } from 'react';
import TicketContext, { type TicketContextType } from '@/Contexts/TicketContext';

export const useTicket = (): TicketContextType => {
  const ctx = useContext(TicketContext);
  if (!ctx) throw new Error('useTicket must be used within a TicketProvider');
  return ctx;
};
