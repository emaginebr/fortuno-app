import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCheckout } from '@/hooks/useCheckout';
import { useLottery } from '@/hooks/useLottery';
import { useCheckoutWizard } from '@/hooks/useCheckoutWizard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { CheckoutStepper } from './CheckoutStepper';
import { RegisterStep } from './RegisterStep';
import { CartStep } from './CartStep';
import { PixStep } from './PixStep';
import { SuccessStep } from './SuccessStep';

/** Lê um inteiro positivo de query string, ou null. */
const parsePositiveInt = (raw: string | null): number | null => {
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
};

export const CheckoutWizardShell = (): JSX.Element => {
  const { t } = useTranslation();
  const { lotteryId } = useParams();
  const [searchParams] = useSearchParams();
  const checkout = useCheckout();
  const { currentLottery, loadById } = useLottery();
  const wizard = useCheckoutWizard();

  // Carrega sorteio + inicializa quantity/combo/referral a partir da URL.
  useEffect(() => {
    const id = Number(lotteryId);
    if (Number.isNaN(id)) return;
    checkout.setLotteryId(id);
    void loadById(id);
  }, [lotteryId, checkout, loadById]);

  useEffect(() => {
    const qty = parsePositiveInt(searchParams.get('qty'));
    if (qty !== null) checkout.setQuantity(qty);
    const referral = searchParams.get('referral');
    if (referral) checkout.setReferralCode(referral);
    // Não setamos combo no contexto (não existe setCombo); o param é lido
    // pelo próprio shell e repassado aos steps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const comboSlug = searchParams.get('combo') ?? undefined;

  // Combo discount lookup (client-side) a partir de `currentLottery.combos`.
  const combo = currentLottery?.combos?.find(
    (c) => `${c.lotteryComboId}` === comboSlug || c.name.toLowerCase() === comboSlug?.toLowerCase(),
  );
  const comboDiscountPercent = combo?.discountValue ?? 0;
  const comboName = combo?.name;

  if (!currentLottery || currentLottery.lotteryId !== Number(lotteryId)) {
    return <LoadingSpinner label={t('checkout.preparing')} />;
  }

  const renderStep = (): JSX.Element => {
    switch (wizard.currentStepId) {
      case 'register':
        return <RegisterStep wizard={wizard} />;
      case 'cart':
        return (
          <CartStep
            comboName={comboName}
            comboDiscountPercent={comboDiscountPercent}
          />
        );
      case 'pix':
        return <PixStep comboDiscountPercent={comboDiscountPercent} />;
      case 'success':
        return <SuccessStep />;
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-dash-page text-fortuno-black">
      <div className="mx-auto max-w-[1240px] px-4 md:px-6 py-6 md:py-8">
        <div className="paper-card overflow-hidden">
          <CheckoutStepper
            currentIndex={wizard.currentIndex}
            states={wizard.states}
            trackFill={wizard.trackFill}
            onGoToStep={wizard.goToStep}
            canGoTo={wizard.canGoTo}
          />
        </div>
        <section
          key={`${wizard.currentStepId}-${checkout.qrCode?.invoiceId ?? 'none'}`}
          role="region"
          aria-labelledby="step-title"
          className="paper-card mt-[-1px] rounded-t-none border-t-0 p-6 md:p-10 animate-step-slide-in"
        >
          {renderStep()}
        </section>
      </div>
    </main>
  );
};
