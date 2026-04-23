import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Car, Gem, Ticket, CalendarClock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { LotteryInfo } from '@/types/lottery';
import { formatBRL } from '@/utils/currency';
import { GoldNumeral } from '@/components/common/GoldNumeral';

export interface LotteryCardPremiumProps {
  lottery: LotteryInfo;
  /**
   * Variante visual do card.
   * - `carousel` (default): comportamento original (home/carousel) — shadow-noir-card sobre fundo dark.
   * - `grid`: usa `shadow-card-on-paper` para ganhar contraste sobre light body (`/sorteios`).
   */
  variant?: 'carousel' | 'grid';
  /**
   * Quando `true`, exibe um chip pequeno com `CalendarClock` + data/hora
   * do próximo raffle (`lottery.raffles[0].raffleDatetime`).
   * Se não houver raffles, o chip simplesmente não é renderizado.
   */
  showCalendarChip?: boolean;
}

const iconForName = (name: string): LucideIcon => {
  if (/mega/i.test(name)) return Trophy;
  if (/garage|garagem|car|carro/i.test(name)) return Car;
  if (/diamante|gem|jewel|joia/i.test(name)) return Gem;
  return Ticket;
};

const daysUntil = (iso?: string): number | null => {
  if (!iso) return null;
  const target = new Date(iso).getTime();
  if (!Number.isFinite(target)) return null;
  const diff = target - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / 86_400_000);
};

const SHORT_DATETIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

const formatShortDateTime = (iso: string): string => {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return '';
  // Saída: "23 abr., 20:00" — o "às" fica implícito no separador visual do chip.
  return SHORT_DATETIME_FORMATTER.format(d).replace(',', ' ·');
};

const FallbackCover = ({ Icon }: { Icon: LucideIcon }): JSX.Element => (
  <>
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(500px 220px at 50% 100%, rgba(212,175,55,0.22), transparent 70%), linear-gradient(180deg, #0e3327, #081e18)',
      }}
    />
    <div className="absolute inset-0 grid place-items-center">
      <Icon
        className="w-16 h-16 text-fortuno-gold-soft"
        style={{ filter: 'drop-shadow(0 8px 20px rgba(212,175,55,0.4))' }}
        aria-hidden="true"
      />
    </div>
  </>
);

export const LotteryCardPremium = ({
  lottery,
  variant = 'carousel',
  showCalendarChip = false,
}: LotteryCardPremiumProps): JSX.Element => {
  const cover = lottery.images?.[0]?.imageUrl;
  const Icon = iconForName(lottery.name);
  const nextRaffle = lottery.raffles?.[0]?.raffleDatetime;
  const days = daysUntil(nextRaffle);
  const isUrgent = days !== null && days <= 7;

  const totalTickets = Math.max(
    0,
    (lottery.ticketNumEnd ?? 0) - (lottery.ticketNumIni ?? 0) + 1,
  );
  // MOCK: aguarda endpoint /lottery/{id}/ticketStats — ver MOCKS.md.
  const soldTickets = 0;
  const progressPct =
    totalTickets > 0 ? Math.min(100, Math.round((soldTickets / totalTickets) * 100)) : 0;
  const remaining = totalTickets - soldTickets;

  const editionNumber = String(lottery.lotteryId).padStart(3, '0');

  // Sombra conforme variante: em 'grid' rodamos sobre paper claro → usamos
  // card-on-paper (tokens novos de /sorteios). Em 'carousel' mantemos o
  // comportamento original (shadow-noir-card, herdado da home).
  const wrapperShadowClass =
    variant === 'grid'
      ? 'shadow-card-on-paper hover:shadow-card-on-paper-hover'
      : '';

  return (
    <article
      className={`lottery-card text-fortuno-offwhite group flex flex-col h-full ${wrapperShadowClass}`.trim()}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-[20px]">
        {cover ? (
          <img
            src={cover}
            alt={lottery.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <FallbackCover Icon={Icon} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute top-4 left-4 z-[3]">
          <span className="badge-live">
            <span className="dot" aria-hidden="true" />
            Aberto
          </span>
        </div>
        {days !== null && (
          <div className="absolute top-4 right-4 z-[3]">
            <span
              className={
                isUrgent
                  ? 'deadline-chip urgent inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.18em] font-semibold backdrop-blur-sm'
                  : 'deadline-chip inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.18em] font-semibold bg-black/55 border border-fortuno-gold-soft/32 text-fortuno-gold-soft backdrop-blur-sm'
              }
            >
              {isUrgent && <span className="pulse" aria-hidden="true" />}
              {days === 0 ? 'Encerra hoje' : `Encerra em ${days}d`}
            </span>
          </div>
        )}
      </div>

      <div className="relative p-6 flex-1 flex flex-col z-[3]">
        <div className="text-[10px] uppercase tracking-[0.24em] text-fortuno-offwhite/55 mb-1">
          Edição Nº {editionNumber}
        </div>
        <h3 className="font-display text-2xl text-fortuno-offwhite mb-3">{lottery.name}</h3>

        {showCalendarChip && nextRaffle && (
          <div className="mb-4 flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] uppercase tracking-[0.18em] bg-fortuno-gold-soft/10 border border-fortuno-gold-soft/30 text-fortuno-gold-soft">
              <CalendarClock className="w-3 h-3" aria-hidden="true" />
              {formatShortDateTime(nextRaffle)}
            </span>
          </div>
        )}

        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-[0.24em] text-fortuno-offwhite/55">
            Prêmio total
          </div>
          <GoldNumeral as="div" size="34px">
            {formatBRL(lottery.totalPrizeValue ?? 0)}
          </GoldNumeral>
        </div>

        {totalTickets > 0 && (
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs text-fortuno-offwhite/60 mb-2">
              <span>Bilhetes</span>
              <span>
                <span className="text-fortuno-gold-soft font-semibold">
                  {soldTickets.toLocaleString('pt-BR')}
                </span>{' '}
                / {totalTickets.toLocaleString('pt-BR')}
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
            <div className="mt-2 text-[11px] text-fortuno-offwhite/50">
              <span className="text-fortuno-gold-soft">
                {remaining.toLocaleString('pt-BR')} restantes
              </span>{' '}
              · bilhete a partir de {formatBRL(lottery.ticketPrice ?? 0)}
            </div>
          </div>
        )}

        <Link
          to={`/sorteios/${lottery.slug}`}
          className="cta-primary w-full justify-center mt-auto focus-visible:outline-none focus-visible:shadow-gold-focus"
          aria-label={`Comprar bilhetes do sorteio ${lottery.name}`}
        >
          <span>Compre já</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};
