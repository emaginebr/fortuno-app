import { useMemo } from 'react';
import { Ticket } from 'lucide-react';
import type { LotteryComboInfo } from '@/types/lotteryCombo';
import { formatBRL } from '@/utils/currency';
import { computePrice, pickCombo } from './ComboSelector';

export interface StickyBuyBarProps {
  quantity: number;
  ticketPrice: number;
  combos: LotteryComboInfo[];
  onBuy: () => void;
}

export const StickyBuyBar = ({
  quantity,
  ticketPrice,
  combos,
  onBuy,
}: StickyBuyBarProps): JSX.Element => {
  const sortedCombos = useMemo(
    () => [...combos].sort((a, b) => a.quantityStart - b.quantityStart),
    [combos],
  );
  const combo = pickCombo(quantity, sortedCombos);
  const { total } = computePrice(quantity, combo, ticketPrice);

  return (
    <div className="lg:hidden sticky bottom-0 z-30 bg-sticky-cta border-t border-[color:var(--sticky-cta-border)] backdrop-blur-md px-4 py-3 [padding-bottom:calc(env(safe-area-inset-bottom,12px)+12px)] shadow-[0_-10px_24px_-16px_rgba(10,42,32,0.25)]">
      <button
        type="button"
        onClick={onBuy}
        className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-[radial-gradient(120%_120%_at_30%_20%,var(--fortuno-gold-soft),var(--fortuno-gold-intense)_80%)] text-fortuno-black font-display italic font-extrabold text-[17px] tracking-[-0.01em] shadow-[0_12px_28px_-8px_rgba(212,175,55,0.55),0_1px_0_rgba(255,255,255,0.45)_inset] transition-all duration-noir-fast ease-noir-spring hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-[4px] focus-visible:ring-fortuno-gold-soft/55 min-h-[56px]"
      >
        <Ticket className="w-4 h-4" aria-hidden="true" />
        Comprar {quantity} {quantity === 1 ? 'bilhete' : 'bilhetes'} · {formatBRL(total)}
      </button>
    </div>
  );
};
