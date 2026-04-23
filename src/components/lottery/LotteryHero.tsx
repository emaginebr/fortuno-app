import { Link } from 'react-router-dom';
import { ScrollText, ShieldCheck } from 'lucide-react';
import type { LotteryInfo } from '@/types/lottery';
import type { LotteryImageInfo } from '@/types/lotteryImage';
import { CountdownClock } from '@/components/common/CountdownClock';
import { formatBRL } from '@/utils/currency';

export interface LotteryHeroProps {
  lottery: LotteryInfo;
  images: LotteryImageInfo[];
  /** ISO 8601 do próximo raffle (sortedRaffles[0]?.raffleDatetime). */
  nextRaffleAt?: string;
  /** Se omitido, esconde a pílula Regulamento. */
  onOpenRules?: () => void;
  /** Se omitido, esconde a pílula Política de privacidade. */
  onOpenPrivacy?: () => void;
}

// MOCK: aguarda asset definitivo do time de design — registrado em MOCKS.md
// (entrada "Home — Imagem de fallback do hero").
const FALLBACK_IMAGE = '/images/hero-fallback.jpg';

export const LotteryHero = ({
  lottery,
  images,
  nextRaffleAt,
  onOpenRules,
  onOpenPrivacy,
}: LotteryHeroProps): JSX.Element => {
  const primaryImage = images[0];
  const imageUrl = primaryImage?.imageUrl ?? FALLBACK_IMAGE;
  const imageAlt =
    primaryImage?.description?.trim() ||
    `${lottery.name} — prêmio do sorteio em destaque`;

  return (
    <section
      className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 pt-8 md:pt-10 pb-8"
      aria-labelledby="lottery-title"
    >
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <span className="text-[10px] font-semibold tracking-[0.26em] uppercase text-fortuno-gold-intense">
          Sorteio aberto
        </span>
        <span className="text-fortuno-black/30">·</span>
        <Link
          to="/sorteios"
          className="text-[11px] uppercase tracking-[0.18em] text-fortuno-black/55 hover:text-fortuno-gold-intense transition-colors duration-noir-fast"
        >
          Voltar para a vitrine
        </Link>
      </div>

      <figure className="relative overflow-hidden rounded-[22px] border border-[color:var(--stage-compact-border)] bg-[color:var(--stage-compact-bg)] shadow-stage-compact aspect-[16/9] lg:aspect-[21/9] m-0">
        <img
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={imageUrl}
          alt={imageAlt}
          loading="eager"
          decoding="async"
        />
        <div
          className="absolute inset-0 bg-stage-compact-overlay pointer-events-none z-[1]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-stage-compact-grain [background-size:3px_3px] mix-blend-overlay opacity-[0.08] pointer-events-none z-[2]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-[10px] rounded-2xl border border-[color:var(--stage-compact-frame)] pointer-events-none z-[3]"
          aria-hidden="true"
        />

        {/* Top row: badge ABERTO + countdown */}
        <div className="absolute top-4 left-4 right-4 z-[4] flex justify-between items-start gap-3 flex-wrap">
          <span className="badge-live">
            <span className="dot" aria-hidden="true" />
            Aberto
          </span>
          {nextRaffleAt && (
            <CountdownClock
              targetIso={nextRaffleAt}
              compact
              label="Próximo sorteio em"
              className="ml-auto"
            />
          )}
        </div>

        {/* Caption: edição + nome + numeral + CTAs */}
        <figcaption className="absolute inset-x-0 bottom-0 z-[4] flex flex-col gap-3 p-[clamp(20px,4vw,40px)] [text-shadow:0_6px_30px_rgba(0,0,0,0.65)] text-fortuno-offwhite">
          <span className="text-[10px] uppercase tracking-[0.26em] text-fortuno-gold-soft/85 font-semibold">
            Edição Nº {String(lottery.lotteryId).padStart(3, '0')}
          </span>
          <h1
            id="lottery-title"
            className="font-display text-fortuno-offwhite leading-[1.05] mt-1 text-[clamp(28px,4.5vw,52px)] tracking-[-0.02em]"
          >
            {lottery.name}
          </h1>

          <div className="flex flex-wrap items-end gap-x-8 gap-y-3 mt-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.26em] text-fortuno-offwhite/75 font-semibold block mb-1">
                Prêmio total
              </span>
              <span className="font-display italic font-extrabold leading-[0.92] tracking-[-0.03em] bg-gradient-to-b from-fortuno-gold-soft via-fortuno-gold-intense to-fortuno-gold-intense/40 bg-clip-text text-transparent text-[clamp(40px,6vw,72px)] tabular-nums">
                {formatBRL(lottery.totalPrizeValue)}
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {onOpenRules && (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[color:var(--pill-outline-bg)] border border-[color:var(--pill-outline-border)] text-fortuno-gold-soft text-xs font-semibold tracking-wide backdrop-blur-md transition-all duration-noir-fast hover:bg-[color:var(--pill-outline-bg-hover)] hover:border-[color:var(--pill-outline-border-hover)] hover:-translate-y-px focus-visible:outline-none focus-visible:shadow-gold-focus min-h-[44px]"
                  aria-haspopup="dialog"
                  onClick={onOpenRules}
                >
                  <ScrollText className="w-3.5 h-3.5" aria-hidden="true" />
                  Regulamento
                </button>
              )}
              {onOpenPrivacy && (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[color:var(--pill-outline-bg)] border border-[color:var(--pill-outline-border)] text-fortuno-gold-soft text-xs font-semibold tracking-wide backdrop-blur-md transition-all duration-noir-fast hover:bg-[color:var(--pill-outline-bg-hover)] hover:border-[color:var(--pill-outline-border-hover)] hover:-translate-y-px focus-visible:outline-none focus-visible:shadow-gold-focus min-h-[44px]"
                  aria-haspopup="dialog"
                  onClick={onOpenPrivacy}
                >
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  Política de privacidade
                </button>
              )}
            </div>
          </div>
        </figcaption>
      </figure>
    </section>
  );
};
