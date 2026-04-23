import { useMemo } from 'react';
import type { RaffleInfo } from '@/types/raffle';
import { PrizeCard, type PrizeCardData } from './PrizeCard';

export interface PrizesGridProps {
  /** Já ordenados por data ascendente. */
  raffles: RaffleInfo[];
  onOpenRaffle: (raffleId: number) => void;
}

export const PrizesGrid = ({
  raffles,
  onOpenRaffle,
}: PrizesGridProps): JSX.Element | null => {
  const flatPrizes: PrizeCardData[] = useMemo(
    () =>
      raffles.flatMap((r, raffleIdx) =>
        [...(r.awards ?? [])]
          .sort((a, b) => a.position - b.position)
          .map((award, i) => ({
            raffleId: r.raffleId,
            raffleName: r.name,
            raffleDate: r.raffleDatetime,
            position: award.position || raffleIdx * 100 + i + 1,
            description: award.description,
          })),
      ),
    [raffles],
  );

  if (flatPrizes.length === 0) return null;

  return (
    <section aria-labelledby="prizes-title">
      <div className="flex items-baseline gap-3 flex-wrap mb-[18px]">
        <span className="text-[10px] font-semibold tracking-[0.26em] uppercase text-fortuno-gold-intense">
          Premiação completa
        </span>
        <h2
          id="prizes-title"
          className="font-display font-bold text-fortuno-black leading-[1.1] tracking-[-0.01em] text-[clamp(24px,2.6vw,32px)]"
        >
          <span className="italic text-fortuno-gold-intense">
            {flatPrizes.length} {flatPrizes.length === 1 ? 'prêmio' : 'prêmios'}
          </span>{' '}
          · todos garantidos
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {flatPrizes.map((prize, i) => (
          <PrizeCard
            key={`${prize.raffleId}-${prize.position}-${i}`}
            prize={prize}
            onOpen={() => onOpenRaffle(prize.raffleId)}
          />
        ))}
      </div>
    </section>
  );
};
