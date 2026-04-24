import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useCheckout } from '@/hooks/useCheckout';
import { useLottery } from '@/hooks/useLottery';
import { useQRCodePolling } from '@/hooks/useQRCodePolling';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { CopyableCode } from '@/components/common/CopyableCode';
import { PiSimulatorButton } from '@/components/common/PiSimulatorButton';
import { GoldNumeral } from '@/components/common/GoldNumeral';
import { TicketOrderStatus } from '@/types/enums';
import { formatBRL } from '@/utils/currency';

interface PixStepProps {
  comboDiscountPercent?: number;
}

const msToMMSS = (ms: number): string => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const mm = String(Math.floor(total / 60)).padStart(2, '0');
  const ss = String(total % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};

export const PixStep = ({ comboDiscountPercent = 0 }: PixStepProps): JSX.Element => {
  const { t } = useTranslation();
  const checkout = useCheckout();
  const { currentLottery } = useLottery();
  const invoiceId = checkout.qrCode?.invoiceId ?? null;
  const polling = useQRCodePolling(invoiceId);

  // Polling side-effects
  useEffect(() => {
    if (polling.status === TicketOrderStatus.Paid) {
      checkout.setPaymentResult(TicketOrderStatus.Paid, polling.tickets ?? []);
    } else if (
      polling.status === TicketOrderStatus.Expired ||
      polling.status === TicketOrderStatus.Cancelled ||
      polling.status === TicketOrderStatus.Overdue
    ) {
      toast.error(t('checkout.pix.paymentFailed'));
      checkout.setPaymentResult(polling.status);
      checkout.goToStep('numbers');
    }
  }, [polling.status, polling.tickets, checkout, t]);

  // Countdown do QR — expiresAt vem do backend (qrCode.expiredAt).
  // MOCK: se o backend não informar expiresAt válido, aplicamos 15 min a partir de now.
  const expiresMs = useMemo<number>(() => {
    const fromApi = checkout.qrCode?.expiredAt
      ? new Date(checkout.qrCode.expiredAt).getTime()
      : NaN;
    if (Number.isFinite(fromApi)) return fromApi;
    // MOCK: aguarda expiresAt real em qrCode — fallback de 15min.
    return Date.now() + 15 * 60 * 1000;
  }, [checkout.qrCode?.expiredAt]);

  const [nowMs, setNowMs] = useState(() => Date.now());
  const [criticalAnnounced, setCriticalAnnounced] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remainingMs = Math.max(0, expiresMs - nowMs);
  const expired = remainingMs <= 0;
  const critical = remainingMs > 0 && remainingMs <= 2 * 60 * 1000;

  useEffect(() => {
    if (critical && !criticalAnnounced) {
      setCriticalAnnounced(true);
    }
  }, [critical, criticalAnnounced]);

  if (!checkout.qrCode) {
    return <LoadingSpinner label={t('checkout.pix.generating')} size={64} />;
  }

  const qr = checkout.qrCode;
  const quantity = checkout.quantity;
  const unitPrice = currentLottery?.ticketPrice ?? 0;
  const subtotal = unitPrice * quantity;
  const discountRate =
    comboDiscountPercent > 1 ? comboDiscountPercent / 100 : comboDiscountPercent;
  const total = subtotal * (1 - discountRate);

  return (
    <section aria-labelledby="pix-step-title" className="max-w-5xl mx-auto">
      <header className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.26em] text-fortuno-gold-intense font-semibold">
          {t('checkout.pix.eyebrow')}
        </p>
        <h2
          id="pix-step-title"
          className="font-display italic font-bold text-3xl md:text-4xl text-fortuno-black mt-1"
        >
          {t('checkout.pix.title')}
        </h2>
      </header>

      {polling.error ? (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-400/40 bg-red-50 px-5 py-4 text-sm text-red-800"
        >
          <p className="font-semibold">Verificação de pagamento interrompida</p>
          <p className="mt-1 text-[13px] text-red-700">{polling.error}</p>
        </div>
      ) : null}

      <div className="grid lg:grid-cols-[auto_1fr] gap-8 lg:gap-12 items-start">
        {/* QR CARD */}
        <div className="mx-auto lg:mx-0 bg-[color:var(--qr-card-bg)] border-[1.5px] border-[color:var(--qr-card-border)] rounded-3xl p-5 shadow-qr-card">
          {qr.brCodeBase64 ? (
            <img
              src={
                qr.brCodeBase64.startsWith('data:')
                  ? qr.brCodeBase64
                  : `data:image/png;base64,${qr.brCodeBase64}`
              }
              alt={t('checkout.pix.qrAlt')}
              className="block w-[260px] h-[260px] md:w-[320px] md:h-[320px] rounded-md"
            />
          ) : (
            <div className="w-[260px] h-[260px] md:w-[320px] md:h-[320px] rounded-md bg-fortuno-offwhite grid place-items-center p-4 text-center font-mono text-xs text-fortuno-black/70 break-all">
              {qr.brCode}
            </div>
          )}
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-fortuno-black/55 text-center">
            {t('checkout.pix.qrHint')}
          </p>
        </div>

        {/* INSTRUÇÕES */}
        <div className="space-y-6">
          {/* Status pill + valor */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fortuno-gold-intense/10 border border-fortuno-gold-intense/30 text-xs font-bold uppercase tracking-[0.14em] text-fortuno-gold-intense"
              role="status"
              aria-live="polite"
            >
              <span className="pix-live-dot" aria-hidden="true" />
              {t('checkout.pix.waiting')}
            </span>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.22em] text-fortuno-black/55 font-semibold">
                {t('checkout.pix.total')}
              </p>
              <GoldNumeral size="clamp(36px, 6vw, 56px)" className="!block leading-none">
                {formatBRL(total)}
              </GoldNumeral>
            </div>
          </div>

          {/* Instruções numeradas */}
          <ol className="space-y-3">
            {[1, 2, 3].map((n) => (
              <li key={n} className="flex items-start gap-3">
                <span className="font-display italic font-extrabold text-xl text-fortuno-gold-intense leading-none mt-0.5 w-7 text-center tabular-nums">
                  {n}
                </span>
                <p className="text-sm text-fortuno-black/80 leading-relaxed">
                  {t(`checkout.pix.step${n}`)}
                </p>
              </li>
            ))}
          </ol>

          <CopyableCode
            value={qr.brCode}
            label={t('checkout.pix.copyLabel')}
            className="font-mono text-xs tracking-[0.02em] text-fortuno-black bg-[color:var(--copy-code-bg)] border border-dashed border-[color:var(--copy-code-border)] rounded-xl p-3 pr-4 break-all leading-relaxed relative flex items-center gap-2"
          />

          {/* Countdown */}
          <div
            className={`flex items-center gap-4 p-4 rounded-2xl border ${
              critical || expired
                ? 'bg-[color:var(--countdown-critical-bg)] border-[color:var(--countdown-critical-border)]'
                : 'bg-fortuno-offwhite/60 border-fortuno-gold-intense/25'
            }`}
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-fortuno-black/55 font-semibold">
                {expired ? t('checkout.pix.expired') : t('checkout.pix.expiresIn')}
              </p>
              <time
                dateTime={new Date(expiresMs).toISOString()}
                aria-live={critical ? 'assertive' : 'polite'}
                aria-atomic="true"
                className={`font-display italic font-bold text-3xl leading-none tabular-nums ${
                  critical || expired
                    ? 'text-[color:var(--countdown-critical)] animate-countdown-blink'
                    : 'text-fortuno-black'
                }`}
              >
                {msToMMSS(remainingMs)}
              </time>
              {critical && !expired ? (
                <span className="sr-only">{t('checkout.pix.criticalSr')}</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <PiSimulatorButton
        onTrigger={async () => {
          if (!invoiceId) return;
          await fetch(
            `https://proxypay.online/api/payment/simulate-payment/${invoiceId}`,
            { method: 'POST', headers: { 'x-tenant-id': 'fortuno' } },
          );
        }}
      />
    </section>
  );
};
