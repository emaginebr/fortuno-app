import { CalendarCheck } from 'lucide-react';
import { formatDateShort } from '@/utils/datetime';

export interface PrizeCardData {
  raffleId: number;
  raffleName: string;
  raffleDate: string;
  position: number;
  description: string;
}

export interface PrizeCardProps {
  prize: PrizeCardData;
  onOpen: () => void;
}

export const PrizeCard = ({ prize, onOpen }: PrizeCardProps): JSX.Element => (
  <button
    type="button"
    onClick={onOpen}
    aria-haspopup="dialog"
    className="relative flex flex-col gap-3 p-[18px] bg-white border border-[color:var(--card-paper-border)] rounded-2xl shadow-paper w-full text-left min-h-[168px] transition-all duration-noir-base ease-noir-spring hover:-translate-y-0.5 hover:border-[color:var(--card-paper-border-hover)] hover:shadow-paper-hover focus-visible:outline-none focus-visible:shadow-paper-hover focus-visible:ring-[3px] focus-visible:ring-fortuno-gold-soft/55 before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-px before:bg-card-gold-bar before:opacity-70"
  >
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-prize-badge border border-[color:var(--prize-badge-border)] self-start font-display italic font-extrabold text-xs leading-none tracking-wide text-fortuno-green-deep">
      <span className="text-base bg-gradient-to-b from-fortuno-gold-soft to-fortuno-gold-intense bg-clip-text text-transparent">
        {prize.position}º
      </span>
      Lugar
    </span>

    <span className="text-sm leading-snug text-fortuno-black font-semibold flex-1">
      {prize.description}
    </span>

    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-fortuno-green-elegant/[0.06] border border-fortuno-green-elegant/[0.12] text-[10px] text-fortuno-green-elegant font-semibold tracking-wide self-start">
      <CalendarCheck className="w-3 h-3" aria-hidden="true" />
      {prize.raffleName} · {formatDateShort(prize.raffleDate)}
    </span>
  </button>
);
