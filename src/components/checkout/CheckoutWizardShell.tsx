import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCheckout } from '@/hooks/useCheckout';
import { useLottery } from '@/hooks/useLottery';
import { useLotteryCombo } from '@/hooks/useLotteryCombo';
import { useCheckoutWizard } from '@/hooks/useCheckoutWizard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { pickCombo } from '@/components/lottery/ComboSelector';
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
  const { lotteryId: lotteryParam } = useParams();
  const [searchParams] = useSearchParams();
  const checkout = useCheckout();
  const { currentLottery, loadById, loadBySlug } = useLottery();
  const { combos, loadByLottery: loadCombos } = useLotteryCombo();
  const wizard = useCheckoutWizard();
  const [resolvedId, setResolvedId] = useState<number | null>(null);

  // Carrega sorteio por id numérico ou slug.
  useEffect(() => {
    if (!lotteryParam) return;
    const asNumber = Number(lotteryParam);
    if (Number.isInteger(asNumber) && asNumber > 0 && /^\d+$/.test(lotteryParam)) {
      checkout.setLotteryId(asNumber);
      setResolvedId(asNumber);
      void loadById(asNumber);
      return;
    }
    void loadBySlug(lotteryParam).then((l) => {
      if (!l) return;
      checkout.setLotteryId(l.lotteryId);
      setResolvedId(l.lotteryId);
    });
  }, [lotteryParam, checkout, loadById, loadBySlug]);

  useEffect(() => {
    if (resolvedId !== null) void loadCombos(resolvedId);
  }, [resolvedId, loadCombos]);

  useEffect(() => {
    const qty = parsePositiveInt(searchParams.get('qty'));
    if (qty !== null) checkout.setQuantity(qty);
    const referral = searchParams.get('referral');
    if (referral) checkout.setReferralCode(referral);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Segurança: o combo é recalculado aqui a partir da quantidade atual e dos
  // combos reais do sorteio (retornados pela API). Nunca confiamos na URL.
  const lotteryCombos =
    combos.length > 0 ? combos : (currentLottery?.combos ?? []);
  const combo = pickCombo(checkout.quantity, lotteryCombos);
  const comboDiscountPercent = combo?.discountValue ?? 0;
  const comboName = combo?.name;

  if (!currentLottery || resolvedId === null || currentLottery.lotteryId !== resolvedId) {
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
