import { useContext } from 'react';
import CheckoutContext, { type CheckoutContextType } from '@/Contexts/CheckoutContext';

export const useCheckout = (): CheckoutContextType => {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within a CheckoutProvider');
  return ctx;
};
