import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, ArrowRight } from 'lucide-react';
import type { LotteryInfo } from '@/types/lottery';
import { formatBRL } from '@/utils/currency';
import { GoldNumeral } from '@/components/common/GoldNumeral';
import { CountdownClock } from '@/components/common/CountdownClock';
import { TrustSeals } from '@/components/common/TrustSeals';

export interface HeroFeaturedLotteryProps {
  /**
   * Sorteio em destaque já resolvido pela página.
   * Se undefined, renderiza o estado fallback "Próximos sorteios em breve".
   */
  featuredLottery: LotteryInfo | undefined;
}

// MOCK: aguarda campo `/images/hero-fallback.jpg` no diretório público.
// Documentado em MOCKS.md.
const FALLBACK_HERO_IMAGE = '/images/hero-fallback.jpg';
const SCARCITY_THRESHOLD = 0.8;

const EditorialEyebrow = ({
  centered = false,
  children,
}: {
  centered?: boolean;
  children: ReactNode;
}): JSX.Element => (
  <div
    className={`flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-fortuno-gold-soft ${
      centered ? 'justify-center' : ''
    }`}
  >
    <span className="h-px w-8 bg-fortuno-gold-soft" aria-hidden="true" />
    {children}
    {!centered && (
      <span
        className="h-px flex-1 max-w-[160px] bg-gradient-to-r from-fortuno-gold-soft/45 to-transparent"
        aria-hidden="true"
      />
    )}
    {centered && <span className="h-px w-8 bg-fortuno-gold-soft" aria-hidden="true" />}
  </div>
);

const HeroFallback = (): JSX.Element => (
  <section className="bg-noir-hero relative overflow-hidden">
    <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 md:py-32">
      <div className="hero-fallback">
        <EditorialEyebrow centered>Em preparação</EditorialEyebrow>
        <h2
          className="font-display text-fortuno-offwhite mt-4 leading-[1.05]"
          style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}
        >
          Próximos sorteios em{' '}
          <span className="italic text-fortuno-gold-soft">breve</span>.
        </h2>
        <p className="mt-4 text-fortuno-offwhite/70 max-w-md mx-auto">
          Estamos preparando a próxima edição. Cadastre-se para ser avisado quando os bilhetes
          abrirem.
        </p>
        <div className="mt-8 flex justify-center gap-3 flex-wrap">
          <Link
            to="/sorteios"
            className="cta-primary focus-visible:outline-none focus-visible:shadow-gold-focus"
          >
            <span>Ver todos os sorteios</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <a
            href="#como"
            className="cta-ghost focus-visible:outline-none focus-visible:shadow-gold-focus"
          >
            Como funciona
          </a>
        </div>
      </div>
    </div>
  </section>
);

export const HeroFeaturedLottery = ({
  featuredLottery,
}: HeroFeaturedLotteryProps): JSX.Element => {
  if (!featuredLottery) {
    return <HeroFallback />;
  }

  const imageUrl = featuredLottery.images?.[0]?.imageUrl ?? FALLBACK_HERO_IMAGE;
  const nextRaffleIso = featuredLottery.raffles?.[0]?.raffleDatetime;

  // Ticket math: totalTickets deriva do range cadastrado; soldTickets é MOCK.
  const totalTickets = Math.max(
    0,
    (featuredLottery.ticketNumEnd ?? 0) - (featuredLottery.ticketNumIni ?? 0) + 1,
  );
  // MOCK: aguarda endpoint /lottery/{id}/ticketStats — ver MOCKS.md.
  // Estimativa determinística para testar visualmente o scarcity hint.
  const soldTickets = totalTickets > 0 ? Math.floor(totalTickets * 0.87) : 0;
  const progressPct =
    totalTickets > 0 ? Math.min(100, Math.round((soldTickets / totalTickets) * 100)) : 0;
  const showScarcity = totalTickets > 0 && soldTickets / totalTickets >= SCARCITY_THRESHOLD;

  const formattedSold = soldTickets.toLocaleString('pt-BR');
  const formattedTotal = totalTickets.toLocaleString('pt-BR');
  const prizeText = formatBRL(featuredLottery.totalPrizeValue ?? 0);

  return (
    <section
      className="bg-noir-hero relative overflow-hidden"
      aria-labelledby="hero-featured-title"
    >
      <div className="hero-particles" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-12 md:pt-20 pb-20 md:pb-28">
        <div className="mb-6 md:mb-8">
          <EditorialEyebrow>Sorteio em destaque</EditorialEyebrow>
        </div>

        <div className="grid md:grid-cols-[1.7fr_1fr] gap-8 lg:gap-10 items-stretch">
          {/* Palco cinematográfico */}
          <figure className="hero-stage min-w-0 w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9]">
            <img
              className="hero-image"
              src={imageUrl}
              alt={`${featuredLottery.name} — prêmio do sorteio em destaque`}
              loading="eager"
              decoding="async"
            />
            <div className="stage-frame" aria-hidden="true" />

            <figcaption className="stage-caption">
              <span className="badge-live self-start">
                <span className="dot" aria-hidden="true" />
                Sorteio em destaque
              </span>
              <h2
                id="hero-featured-title"
                className="font-display text-fortuno-offwhite leading-[1.0]"
                style={{
                  fontSize: 'clamp(28px, 4.5vw, 56px)',
                  letterSpacing: '-0.02em',
                  textShadow: '0 6px 30px rgba(0,0,0,0.65)',
                }}
              >
                {featuredLottery.name}
              </h2>
            </figcaption>
          </figure>

          {/* Painel lateral de ação */}
          <aside className="hero-panel min-w-0 w-full flex flex-col">
            <div>
              <span className="text-[10px] uppercase tracking-[0.26em] text-fortuno-offwhite/55">
                Prêmio total
              </span>
              <GoldNumeral shimmer size="clamp(40px, 5.5vw, 64px)" as="div" className="mt-2">
                {prizeText}
              </GoldNumeral>
              <p className="mt-2 text-xs text-fortuno-offwhite/65 leading-relaxed">
                Auditado, pago via PIX, transferido em minutos.
              </p>
            </div>

            <div
              className="my-6 h-px bg-gradient-to-r from-transparent via-fortuno-gold-soft/35 to-transparent"
              aria-hidden="true"
            />

            {nextRaffleIso && <CountdownClock targetIso={nextRaffleIso} />}

            {totalTickets > 0 && (
              <div className="mt-7">
                <div className="flex items-end justify-between text-xs text-fortuno-offwhite/60 mb-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-fortuno-offwhite/55">
                      Bilhetes vendidos
                    </span>
                    <span className="text-fortuno-offwhite/85 font-semibold">
                      <span className="text-fortuno-gold-soft">{formattedSold}</span>{' '}
                      <span className="text-fortuno-offwhite/45">de {formattedTotal}</span>
                    </span>
                  </div>
                  <span className="font-display italic font-bold text-fortuno-gold-soft text-2xl leading-none">
                    {progressPct}%
                  </span>
                </div>
                <div
                  className="progress-rail"
                  role="progressbar"
                  aria-valuenow={progressPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${progressPct} por cento dos bilhetes vendidos`}
                >
                  <span style={{ width: `${progressPct}%` }} />
                </div>
                {showScarcity && (
                  <div className="mt-3 scarcity-hint">
                    <span className="pulse-dot" aria-hidden="true" />
                    Últimos bilhetes
                  </div>
                )}
              </div>
            )}

            <div className="mt-7 flex flex-col gap-3">
              <Link
                to={`/sorteios/${featuredLottery.slug}`}
                className="cta-primary justify-center w-full focus-visible:outline-none focus-visible:shadow-gold-focus"
                aria-label={`Comprar bilhetes do sorteio ${featuredLottery.name}`}
              >
                <Ticket className="w-4 h-4" aria-hidden="true" />
                <span>Compre já</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href="#como"
                className="cta-ghost justify-center w-full text-sm focus-visible:outline-none focus-visible:shadow-gold-focus"
                style={{
                  borderColor: 'rgba(212,175,55,0.45)',
                  color: 'var(--fortuno-gold-soft)',
                }}
              >
                Como funciona
              </a>
            </div>

            <TrustSeals variant="hero" className="mt-6" />
          </aside>
        </div>
      </div>
    </section>
  );
};
