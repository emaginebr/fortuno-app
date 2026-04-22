import { Link } from 'react-router-dom';
import { Clock, Ticket, ArrowRight } from 'lucide-react';
import { GoldNumeral } from '@/components/common/GoldNumeral';
import { TrustSeals } from '@/components/common/TrustSeals';

export interface FinalCtaProps {
  /** ISO 8601 do próximo sorteio. Se ausente, a eyebrow do countdown é oculta. */
  nextRaffleAt?: string;
}

const daysUntil = (iso?: string): number | null => {
  if (!iso) return null;
  const target = new Date(iso).getTime();
  if (!Number.isFinite(target)) return null;
  const diff = target - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / 86_400_000);
};

export const FinalCta = ({ nextRaffleAt }: FinalCtaProps): JSX.Element => {
  const days = daysUntil(nextRaffleAt);
  const eyebrowText =
    days === null
      ? null
      : days === 0
        ? 'Próximo sorteio hoje'
        : days === 1
          ? 'Próximo sorteio em 1 dia'
          : `Próximo sorteio em ${days} dias`;

  return (
    <section
      className="final-cta-wrap relative py-24 md:py-32"
      aria-labelledby="final-cta-title"
    >
      <div className="mx-auto max-w-5xl px-6 text-center relative z-10">
        {eyebrowText && (
          <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-fortuno-gold-soft mb-6">
            <Clock className="w-4 h-4" aria-hidden="true" />
            {eyebrowText}
          </span>
        )}

        <h2
          id="final-cta-title"
          className="font-display leading-[0.98]"
          style={{ fontSize: 'clamp(48px, 8vw, 104px)', letterSpacing: '-0.03em' }}
        >
          <span className="text-fortuno-offwhite">A próxima </span>
          <GoldNumeral shimmer size="inherit">
            sorte
          </GoldNumeral>
          <span className="text-fortuno-offwhite">
            <br />
            pode ser a{' '}
          </span>
          <span className="italic text-fortuno-gold-soft">sua.</span>
        </h2>

        <p className="mt-8 text-lg md:text-xl text-fortuno-offwhite/75 max-w-2xl mx-auto">
          Entre, escolha seu sorteio e garanta seus bilhetes em menos de 2 minutos.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            to="/sorteios"
            className="cta-primary focus-visible:outline-none focus-visible:shadow-gold-focus"
            style={{ padding: '18px 36px', fontSize: '17px' }}
          >
            <Ticket className="w-5 h-5" aria-hidden="true" />
            Garantir meus bilhetes
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
          <a
            href="#como"
            className="cta-ghost focus-visible:outline-none focus-visible:shadow-gold-focus"
            style={{ padding: '17px 32px', fontSize: '16px' }}
          >
            Como funciona
          </a>
        </div>

        <TrustSeals variant="compact" className="mt-14 max-w-xl mx-auto" />
      </div>
    </section>
  );
};
