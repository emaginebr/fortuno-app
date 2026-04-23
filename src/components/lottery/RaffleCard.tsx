import { ArrowUpRight, Calendar, Radio, Trophy } from 'lucide-react';
import type { RaffleInfo } from '@/types/raffle';
import { formatDateExtensive } from '@/utils/datetime';

export interface RaffleCardProps {
  /** 1-based, exibido no marker do raffle. */
  index: number;
  raffle: RaffleInfo;
  onOpen: () => void;
}

export const RaffleCard = ({
  index,
  raffle,
  onOpen,
}: RaffleCardProps): JSX.Element => {
  const awardsCount = raffle.awards?.length ?? 0;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-[18px] p-[18px_22px] bg-white border border-[color:var(--card-paper-border)] rounded-2xl shadow-paper w-full text-left transition-all duration-noir-base ease-noir-spring hover:-translate-y-0.5 hover:border-[color:var(--card-paper-border-hover)] hover:shadow-paper-hover focus-visible:outline-none focus-visible:shadow-paper-hover focus-visible:ring-[3px] focus-visible:ring-fortuno-gold-soft/55 before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-px before:bg-card-gold-bar before:opacity-70 min-h-[88px]"
    >
      <span
        className="relative w-14 h-14 rounded-full bg-[radial-gradient(120%_120%_at_30%_20%,rgba(212,175,55,0.95),rgba(184,150,63,0.55)_60%,rgba(7,32,26,0.55)_100%)] border-2 border-white/55 shadow-[0_0_0_1px_rgba(184,150,63,0.45),0_6px_14px_-4px_rgba(184,150,63,0.45),inset_0_1px_0_rgba(255,255,255,0.5)] grid place-items-center font-display italic font-extrabold text-lg text-fortuno-black tracking-[-0.01em]"
        aria-hidden="true"
      >
        {String(index).padStart(2, '0')}
      </span>

      <div className="min-w-0">
        <div className="font-display font-bold text-lg text-fortuno-black leading-tight tracking-[-0.01em]">
          {raffle.name}
        </div>
        <div className="flex flex-wrap gap-x-3.5 gap-y-1 text-xs text-fortuno-black/[0.62] mt-1.5 items-center">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-fortuno-gold-intense" aria-hidden="true" />
            {formatDateExtensive(raffle.raffleDatetime)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Trophy className="w-3 h-3 text-fortuno-gold-intense" aria-hidden="true" />
            {awardsCount} {awardsCount === 1 ? 'prêmio' : 'prêmios'}
          </span>
          {raffle.descriptionMd && (
            <span className="inline-flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-fortuno-gold-intense" aria-hidden="true" />
              Detalhes inclusos
            </span>
          )}
        </div>
      </div>

      <span
        className="hidden sm:grid w-9 h-9 rounded-full border border-fortuno-gold-intense/35 bg-fortuno-gold-intense/[0.08] place-items-center text-fortuno-gold-intense transition-all duration-noir-fast ease-noir-spring group-hover:bg-fortuno-gold-soft group-hover:text-fortuno-black group-hover:-rotate-45 shrink-0"
        aria-hidden="true"
      >
        <ArrowUpRight className="w-4 h-4" />
      </span>
    </button>
  );
};
