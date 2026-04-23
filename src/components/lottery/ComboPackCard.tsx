import { Award, Check } from 'lucide-react';
import type { LotteryComboInfo } from '@/types/lotteryCombo';

export type ComboTier = 'bronze' | 'silver' | 'gold';

export interface ComboPackCardProps {
  combo: LotteryComboInfo;
  tier: ComboTier;
  active: boolean;
  onSelect: () => void;
}

const medalBackgroundByTier: Record<ComboTier, string> = {
  bronze:
    'bg-[radial-gradient(120%_120%_at_30%_20%,#d59a6a,#a96f3f_60%,#4d3017_100%)]',
  silver:
    'bg-[radial-gradient(120%_120%_at_30%_20%,#f0f0f0,#b8b8b8_60%,#5a5a5a_100%)]',
  gold:
    'bg-[radial-gradient(120%_120%_at_30%_20%,rgba(212,175,55,0.95),rgba(184,150,63,0.55)_60%,rgba(7,32,26,0.55)_100%)]',
};

export const ComboPackCard = ({
  combo,
  tier,
  active,
  onSelect,
}: ComboPackCardProps): JSX.Element => {
  const baseClasses = [
    'relative flex flex-col gap-3 p-[22px] bg-combo-card border-[1.5px] rounded-[18px] shadow-combo-card text-left',
    'transition-all duration-noir-base ease-noir-spring',
    'hover:-translate-y-0.5 hover:shadow-combo-card-hover',
    'focus-visible:outline-none focus-visible:shadow-combo-card-hover focus-visible:ring-[3px] focus-visible:ring-fortuno-gold-soft/55',
    'cursor-pointer overflow-hidden min-h-[112px]',
    active
      ? 'border-[color:var(--combo-card-border-active)] shadow-combo-card-hover animate-combo-ring-pulse'
      : 'border-[color:var(--combo-card-border)]',
  ].join(' ');

  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      className={baseClasses}
    >
      <span
        data-active={active}
        className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-fortuno-gold-soft text-fortuno-black grid place-items-center transition-all duration-noir-base ease-noir-spring opacity-0 scale-[0.6] data-[active=true]:opacity-100 data-[active=true]:scale-100"
        aria-hidden="true"
      >
        <Check className="w-3.5 h-3.5" />
      </span>

      <div className="flex items-center gap-3 pr-9">
        <span
          className={`inline-flex items-center justify-center w-9 h-9 rounded-full border-2 border-white/55 shadow-[0_0_0_1px_rgba(184,150,63,0.45),inset_0_1px_0_rgba(255,255,255,0.5)] text-fortuno-black ${medalBackgroundByTier[tier]}`}
          aria-hidden="true"
        >
          <Award className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <div className="font-display font-bold text-[17px] text-fortuno-black leading-tight tracking-[-0.01em] truncate">
            {combo.name}
          </div>
          <div className="text-[12px] text-fortuno-black/[0.62] mt-0.5">
            {combo.quantityEnd === 0
              ? `A partir de ${combo.quantityStart} bilhetes`
              : `De ${combo.quantityStart} a ${combo.quantityEnd} bilhetes`}
          </div>
        </div>
      </div>

      <span
        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-fortuno-black text-xs font-bold tracking-wide self-start shadow-[0_4px_10px_-4px_rgba(184,150,63,0.55)] ${
          active ? 'bg-fortuno-gold-soft' : 'bg-fortuno-gold-intense'
        }`}
      >
        {combo.discountLabel}
      </span>
    </button>
  );
};
