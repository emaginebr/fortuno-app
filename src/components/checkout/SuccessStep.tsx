import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Copy, MessageCircle, Ticket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useCheckout } from '@/hooks/useCheckout';
import { useLottery } from '@/hooks/useLottery';
import { TrustSeals } from '@/components/common/TrustSeals';
import { TicketMiniCard } from './TicketMiniCard';
import { TicketOrderMode } from '@/types/enums';

const MAX_VISIBLE = 9;

export const SuccessStep = (): JSX.Element => {
  const { t } = useTranslation();
  const checkout = useCheckout();
  const { currentLottery } = useLottery();
  const tickets = checkout.tickets ?? [];

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [confettiVisible, setConfettiVisible] = useState<boolean>(!reducedMotion);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent): void => setReducedMotion(e.matches);
    media.addEventListener?.('change', handler);
    return () => media.removeEventListener?.('change', handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const timeout = window.setTimeout(() => setConfettiVisible(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [reducedMotion]);

  const nextRaffleLabel = useMemo<string>(() => {
    // MOCK: aguarda lottery.nextRaffleDate real — usamos a próxima raffle com raffleDatetime futura.
    const raffles = currentLottery?.raffles ?? [];
    const upcoming = raffles
      .map((r) => r.raffleDatetime)
      .filter((d): d is string => typeof d === 'string')
      .map((d) => ({ iso: d, ts: new Date(d).getTime() }))
      .filter((x) => Number.isFinite(x.ts) && x.ts > Date.now())
      .sort((a, b) => a.ts - b.ts)[0];
    if (!upcoming) return t('checkout.success.raffleSoon');
    return new Date(upcoming.iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }, [currentLottery?.raffles, t]);

  const visibleTickets = tickets.slice(0, MAX_VISIBLE);
  const overflowCount = Math.max(0, tickets.length - MAX_VISIBLE);

  const handleShareWhatsApp = (): void => {
    const text = encodeURIComponent(
      t('checkout.success.shareText', { name: currentLottery?.name ?? 'Fortuno' }),
    );
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(window.location.origin + '/sorteios');
      toast.success(t('checkout.success.linkCopied'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleExit = (): void => {
    checkout.reset();
  };

  return (
    <section aria-labelledby="success-step-title" className="text-center">
      {!reducedMotion && confettiVisible ? (
        <div className="confetti-wrap" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="confetti-piece" />
          ))}
        </div>
      ) : null}

      <div className="ornament" aria-hidden="true">
        <span className="ornament-line" />
        <span className="ornament-diamond" />
        <span className="ornament-line" />
      </div>

      <p className="text-[10px] uppercase tracking-[0.28em] text-fortuno-gold-intense font-semibold">
        {t('checkout.success.eyebrow')}
      </p>
      <h2
        id="success-step-title"
        className="font-display italic font-extrabold text-4xl md:text-6xl leading-[0.95] mt-2 max-w-3xl mx-auto text-fortuno-black"
      >
        {t('checkout.success.title')}
      </h2>
      <p className="text-base text-fortuno-black/70 mt-4 max-w-xl mx-auto">
        {t('checkout.success.sub', { name: currentLottery?.name ?? '' })}
      </p>

      {visibleTickets.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {visibleTickets.map((ticket) => {
            const isManual =
              typeof ticket.ticketValue === 'string' && checkout.mode === TicketOrderMode.Manual;
            return (
              <TicketMiniCard
                key={ticket.ticketId}
                number={ticket.ticketNumber}
                lotteryName={currentLottery?.name ?? ''}
                nextRaffleLabel={nextRaffleLabel}
                kind={isManual ? 'manual' : 'random'}
                numberType={currentLottery?.numberType ?? 1}
              />
            );
          })}
          {overflowCount > 0 ? (
            <Link
              to="/meus-numeros"
              onClick={handleExit}
              className="flex flex-col items-center justify-center gap-2 rounded-[18px] border-[1.5px] border-dashed border-fortuno-gold-intense/50 bg-fortuno-gold-intense/[0.04] p-6 text-fortuno-gold-intense hover:bg-fortuno-gold-intense/[0.1] transition-colors focus-visible:outline-none focus-visible:shadow-gold-focus"
            >
              <Ticket className="w-6 h-6" aria-hidden="true" />
              <span className="text-sm font-bold">
                +{overflowCount} {t('checkout.success.more')}
              </span>
            </Link>
          ) : null}
        </div>
      ) : (
        <p className="mt-8 text-sm text-fortuno-black/50">{t('checkout.success.emptyTickets')}</p>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          to="/meus-numeros"
          onClick={handleExit}
          className="cta-gold focus-visible:outline-none focus-visible:shadow-gold-focus"
        >
          {t('checkout.success.ctaViewAll')}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
        <Link
          to="/sorteios"
          onClick={handleExit}
          className="cta-ghost-noir focus-visible:outline-none focus-visible:shadow-gold-focus"
        >
          {t('checkout.success.ctaBackToLotteries')}
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="cta-ghost-gold focus-visible:outline-none focus-visible:shadow-gold-focus"
        >
          <MessageCircle className="w-4 h-4" aria-hidden="true" />
          {t('checkout.success.shareWhatsapp')}
        </button>
        <button
          type="button"
          onClick={() => void handleCopyLink()}
          className="cta-ghost-gold focus-visible:outline-none focus-visible:shadow-gold-focus"
        >
          <Copy className="w-4 h-4" aria-hidden="true" />
          {t('checkout.success.copyLink')}
        </button>
      </div>

      <div className="mt-12 pt-8 border-t border-fortuno-gold-intense/15 flex justify-center">
        <TrustSeals variant="compact" />
      </div>
    </section>
  );
};
