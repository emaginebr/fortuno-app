import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Car, Gem, Ticket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { LotteryInfo } from '@/types/lottery';
import { formatBRL } from '@/utils/currency';
import { GoldNumeral } from '@/components/common/GoldNumeral';

export interface LotteryCardPremiumProps {
  lottery: LotteryInfo;
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

export const LotteryCardPremium = ({ lottery }: LotteryCardPremiumProps): JSX.Element => {
  const cover = lottery.images?.[0]?.imageUrl;
  const Icon = iconForName(lottery.name);
  const nextRaffle = lottery.raffles?.[0]?.raffleDatetime;
  const days = daysUntil(nextRaffle);

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

  return (
    <article className="lottery-card group flex flex-col h-full">
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
        <div className="absolute top-4 left-4">
          <span className="badge-live">
            <span className="dot" aria-hidden="true" />
            Aberto
          </span>
        </div>
        {days !== null && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.22em] bg-black/50 backdrop-blur-sm border border-fortuno-gold-soft/25 text-fortuno-gold-soft">
            {days === 0 ? 'Encerra hoje' : `Encerra em ${days}d`}
          </div>
        )}
      </div>

      <div className="relative p-6 flex-1 flex flex-col">
        <div className="text-[10px] uppercase tracking-[0.24em] text-fortuno-offwhite/55 mb-1">
          Edição Nº {editionNumber}
        </div>
        <h3 className="font-display text-2xl text-fortuno-offwhite mb-3">{lottery.name}</h3>

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
