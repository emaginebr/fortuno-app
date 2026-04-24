import { useMemo, useState } from 'react';
import { Info, Loader2, Plus, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCheckout } from '@/hooks/useCheckout';
import { useLottery } from '@/hooks/useLottery';
import { useLotteryImage } from '@/hooks/useLotteryImage';
import { Receipt } from '@/components/lottery/Receipt';
import { TrustSeals } from '@/components/common/TrustSeals';
import { CartBilletItem } from './CartBilletItem';
import { CheckoutPrizeThumb } from './CheckoutPrizeThumb';
import { ChooseNumberModal } from './ChooseNumberModal';

interface CartStepProps {
  /** Nome do combo ativo (opcional, vindo de query `?combo=`). */
  comboName?: string;
  /** Percentual de desconto 0..1 (opcional — calculado client-side). */
  comboDiscountPercent?: number;
}

export const CartStep = ({ comboName, comboDiscountPercent = 0 }: CartStepProps): JSX.Element | null => {
  const { t } = useTranslation();
  const checkout = useCheckout();
  const { currentLottery } = useLottery();
  const { images } = useLotteryImage();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!currentLottery) return null;

  // A API de /lotteries/{id} não traz imagens inline — montamos um lottery
  // enriquecido para o CheckoutPrizeThumb renderizar a capa.
  const lotteryWithImages =
    images.length > 0 ? { ...currentLottery, images } : currentLottery;

  const quantity = checkout.quantity;
  const picked = checkout.pickedNumbers;
  const random = Math.max(0, quantity - picked.length);
  const unitPrice = currentLottery.ticketPrice;
  const subtotal = unitPrice * quantity;
  // comboDiscountPercent chega como inteiro (ex.: 20 = 20%); normalizamos aqui.
  const discountRate =
    comboDiscountPercent > 1 ? comboDiscountPercent / 100 : comboDiscountPercent;
  const discount = Math.max(0, subtotal * discountRate);
  const total = Math.max(0, subtotal - discount);

  const handleConfirm = async (): Promise<void> => {
    setSubmitting(true);
    try {
      await checkout.startPayment();
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdd = (n: string): void => {
    checkout.addPickedNumber(n);
  };

  const canAddMore = picked.length < quantity;

  const summaryCount = useMemo(
    () => t('checkout.cart.ticketsSummary', { current: picked.length + random, total: quantity }),
    [picked.length, random, quantity, t],
  );

  return (
    <section aria-labelledby="cart-step-title">
      <div className="grid lg:grid-cols-[1.55fr_1fr] gap-8">
        {/* ESQUERDA */}
        <div>
          <header className="mb-5 flex items-baseline justify-between gap-3 flex-wrap">
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-fortuno-gold-intense font-semibold">
                {t('checkout.cart.eyebrow')}
              </p>
              <h2
                id="cart-step-title"
                className="font-display italic font-bold text-3xl md:text-4xl text-fortuno-black mt-1"
              >
                {t('checkout.cart.title')}
              </h2>
            </div>
            <p
              className="text-xs text-fortuno-black/55 tabular-nums"
              aria-live="polite"
              dangerouslySetInnerHTML={{ __html: summaryCount }}
            />
          </header>

          <div role="list" aria-label={t('checkout.cart.listAria')} className="space-y-3">
            {random > 0 ? (
              <CartBilletItem kind="random" count={random} unitPrice={unitPrice} />
            ) : null}
            {picked.map((n) => (
              <CartBilletItem
                key={n}
                kind="manual"
                number={n}
                unitPrice={unitPrice}
                numberType={currentLottery.numberType}
                onRemove={() => checkout.removePickedNumber(n)}
              />
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              disabled={!canAddMore}
              className="cta-ghost-gold focus-visible:outline-none focus-visible:shadow-gold-focus"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              {t('checkout.cart.chooseNumberCta')}
            </button>
            <p className="text-[11px] text-fortuno-black/55 inline-flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-fortuno-gold-intense" aria-hidden="true" />
              {t('checkout.cart.chooseHint')}
            </p>
          </div>
        </div>

        {/* DIREITA */}
        <aside className="lg:sticky lg:top-[88px] lg:self-start space-y-5">
          <CheckoutPrizeThumb lottery={lotteryWithImages} />
          <Receipt
            quantity={quantity}
            ticketPrice={unitPrice}
            subtotal={subtotal}
            discount={discount}
            total={total}
            comboName={comboName}
          />
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={quantity < 1 || submitting}
            aria-busy={submitting}
            className="cta-gold w-full text-[17px] min-h-[56px] focus-visible:outline-none focus-visible:shadow-gold-focus disabled:cursor-not-allowed disabled:opacity-75"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            ) : (
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            )}
            {submitting ? t('checkout.cart.confirmingCta', { defaultValue: 'Gerando QR Code...' }) : t('checkout.cart.confirmCta')}
          </button>
          <TrustSeals variant="compact" />
        </aside>
      </div>

      <ChooseNumberModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleAdd}
        lottery={currentLottery}
        alreadyPicked={picked}
      />
    </section>
  );
};
