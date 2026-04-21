import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCheckout } from '@/hooks/useCheckout';
import { useLottery } from '@/hooks/useLottery';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { QuantityStep } from './QuantityStep';
import { AuthGateStep } from './AuthGateStep';
import { NumberSelectionStep } from './NumberSelectionStep';
import { PaymentStep } from './PaymentStep';
import { SuccessStep } from './SuccessStep';

export const CheckoutPage = (): JSX.Element => {
  const { lotteryId } = useParams();
  const checkout = useCheckout();
  const { currentLottery, loadById } = useLottery();

  useEffect(() => {
    const id = Number(lotteryId);
    if (Number.isNaN(id)) return;
    checkout.setLotteryId(id);
    void loadById(id);
  }, [lotteryId, checkout, loadById]);

  if (!currentLottery || currentLottery.lotteryId !== Number(lotteryId)) {
    return <LoadingSpinner label="Preparando sua compra..." />;
  }

  switch (checkout.currentStep) {
    case 'quantity':
      return <QuantityStep />;
    case 'auth':
      return <AuthGateStep />;
    case 'numbers':
      return <NumberSelectionStep />;
    case 'payment':
      return <PaymentStep />;
    case 'success':
      return <SuccessStep />;
    default:
      return <QuantityStep />;
  }
};
