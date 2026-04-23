import type { RaffleInfo } from '@/types/raffle';
import { RaffleCard } from './RaffleCard';

export interface RaffleTimelineProps {
  /** Já ordenados por data ascendente. */
  raffles: RaffleInfo[];
  /** Contagem real de prêmios por raffleId (awards são carregados separadamente). */
  awardsCountByRaffleId?: Record<number, number>;
  onOpenRaffle: (raffleId: number) => void;
}

export const RaffleTimeline = ({
  raffles,
  awardsCountByRaffleId,
  onOpenRaffle,
}: RaffleTimelineProps): JSX.Element => (
  <section aria-labelledby="raffles-title">
    <div className="flex items-baseline gap-3 flex-wrap mb-[18px]">
      <span className="text-[10px] font-semibold tracking-[0.26em] uppercase text-fortuno-gold-intense">
        Calendário
      </span>
      <h2
        id="raffles-title"
        className="font-display font-bold text-fortuno-black leading-[1.1] tracking-[-0.01em] text-[clamp(24px,2.6vw,32px)]"
      >
        Os{' '}
        <span className="italic text-fortuno-gold-intense">
          {raffles.length} {raffles.length === 1 ? 'sorteio' : 'sorteios'}
        </span>{' '}
        desta edição
      </h2>
      <span className="text-xs text-fortuno-black/55 ml-auto hidden md:block">
        Toque em um sorteio para ver os prêmios
      </span>
    </div>

    <ul className="flex flex-col gap-3" role="list">
      {raffles.map((raffle, idx) => (
        <li key={raffle.raffleId}>
          <RaffleCard
            index={idx + 1}
            raffle={raffle}
            awardsCount={awardsCountByRaffleId?.[raffle.raffleId]}
            onOpen={() => onOpenRaffle(raffle.raffleId)}
          />
        </li>
      ))}
    </ul>
  </section>
);
