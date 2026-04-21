import { useAuth } from 'nauth-react';
import { useCheckout } from '@/hooks/useCheckout';
import { useLottery } from '@/hooks/useLottery';
import { formatBRL } from '@/utils/currency';

export const QuantityStep = (): JSX.Element | null => {
  const checkout = useCheckout();
  const { currentLottery } = useLottery();
  const { isAuthenticated } = useAuth();

  if (!currentLottery) return null;

  const handleNext = (): void => {
    if (!isAuthenticated) {
      checkout.goToStep('auth');
      return;
    }
    checkout.goToStep('numbers');
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="font-display text-3xl text-fortuno-black">Confirme sua compra</h1>
      <p className="mt-2 text-fortuno-black/70">
        Você está comprando{' '}
        <strong>
          {checkout.quantity} {checkout.quantity === 1 ? 'bilhete' : 'bilhetes'}
        </strong>{' '}
        da loteria <strong>{currentLottery.name}</strong>.
      </p>

      <div className="mt-6 rounded-xl border border-fortuno-black/10 bg-white p-5">
        <div className="flex justify-between text-sm">
          <span className="text-fortuno-black/60">Valor unitário</span>
          <span>{formatBRL(currentLottery.ticketPrice)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-fortuno-black/60">Quantidade</span>
          <span>{checkout.quantity}</span>
        </div>
        <div className="mt-2 flex justify-between border-t pt-3">
          <span className="font-semibold">Total</span>
          <span className="font-display text-xl text-fortuno-gold-intense">
            {formatBRL(currentLottery.ticketPrice * checkout.quantity)}
          </span>
        </div>
      </div>

      <button type="button" onClick={handleNext} className="btn-primary mt-6 w-full">
        Continuar
      </button>
    </div>
  );
};
