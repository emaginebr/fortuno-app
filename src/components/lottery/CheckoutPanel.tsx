import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { ArrowRight, Lock, Ticket } from 'lucide-react';
import type { LotteryComboInfo } from '@/types/lotteryCombo';
import { formatBRL } from '@/utils/currency';
import { ComboPackCard, type ComboTier } from './ComboPackCard';
import { Receipt } from './Receipt';
import { computePrice, pickCombo } from './ComboSelector';

export interface CheckoutPanelProps {
  combos: LotteryComboInfo[];
  ticketPrice: number;
  minQty: number;
  /** 0 ou negativo → ilimitado. */
  maxQty: number;
  initialQuantity?: number;
  /** Bubble da quantidade selecionada para a página (sticky bar usa o mesmo state). */
  onChange: (quantity: number) => void;
  onBuy: () => void;
  className?: string;
}

const tierFor = (index: number, total: number): ComboTier => {
  if (total <= 1) return 'gold';
  if (index === 0) return 'bronze';
  if (index === 1) return 'silver';
  return 'gold';
};

export const CheckoutPanel = ({
  combos,
  ticketPrice,
  minQty,
  maxQty,
  initialQuantity,
  onChange,
  onBuy,
  className,
}: CheckoutPanelProps): JSX.Element => {
  const [quantity, setQuantity] = useState<number>(initialQuantity ?? minQty);

  const sortedCombos = useMemo(
    () => [...combos].sort((a, b) => a.quantityStart - b.quantityStart),
    [combos],
  );

  const currentCombo = pickCombo(quantity, sortedCombos);
  const pricing = computePrice(quantity, currentCombo, ticketPrice);

  const unlimited = maxQty <= 0;
  const effectiveMax = unlimited ? Number.MAX_SAFE_INTEGER : maxQty;
  const sliderMax = unlimited ? 500 : Math.min(maxQty, 500);

  const handleChange = (q: number): void => {
    const clamped = Math.max(minQty, Math.min(effectiveMax, Number.isFinite(q) ? q : minQty));
    setQuantity(clamped);
    onChange(clamped);
  };

  // Sincroniza com mudanças externas em initialQuantity (raras, mas seguras).
  useEffect(() => {
    if (initialQuantity != null && initialQuantity !== quantity) {
      const clamped = Math.max(minQty, Math.min(effectiveMax, initialQuantity));
      setQuantity(clamped);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuantity]);

  const wrapperClasses = ['relative', className ?? ''].filter(Boolean).join(' ');

  return (
    <aside className={wrapperClasses} aria-labelledby="checkout-title">
      <div className="relative bg-white border border-[color:var(--card-paper-border)] rounded-[22px] shadow-paper p-6 before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-px before:bg-card-gold-bar">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-[10px] font-semibold tracking-[0.26em] uppercase text-fortuno-gold-intense">
            Compre seus bilhetes
          </span>
        </div>
        <h2
          id="checkout-title"
          className="font-display text-fortuno-black text-[24px] leading-tight mb-1"
        >
          Escolha seu{' '}
          <span className="italic text-fortuno-gold-intense">passe</span>.
        </h2>
        <p className="text-[12px] text-fortuno-black/60 mb-5">
          Cada bilhete custa{' '}
          <strong className="text-fortuno-black">{formatBRL(ticketPrice)}</strong> · mín.{' '}
          {minQty} · máx. {maxQty > 0 ? maxQty : 'sem limite'} por compra.
        </p>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {sortedCombos.length === 0 ? (
              <div className="rounded-lg border border-dashed border-fortuno-black/15 p-5 text-center text-[13px] text-fortuno-black/60">
                Ainda não há pacotes cadastrados para este sorteio.
              </div>
            ) : (
              <div
                className="grid gap-3 sm:grid-cols-2"
                role="radiogroup"
                aria-label="Pacotes de bilhetes"
              >
                {sortedCombos.map((combo, i) => (
                  <ComboPackCard
                    key={combo.lotteryComboId}
                    combo={combo}
                    tier={tierFor(i, sortedCombos.length)}
                    active={currentCombo?.lotteryComboId === combo.lotteryComboId}
                    onSelect={() => handleChange(combo.quantityStart)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1 flex flex-col">
            <div className="grid grid-cols-[auto_1fr] gap-3.5 items-center p-4 bg-fortuno-gold-intense/[0.06] border border-fortuno-gold-intense/[0.18] rounded-[14px] mb-[18px]">
              <input
                type="number"
                inputMode="numeric"
                min={minQty}
                {...(unlimited ? {} : { max: maxQty })}
                value={quantity}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange(Number(e.target.value))
                }
                className="w-[88px] h-12 text-center font-display italic font-bold text-[22px] text-fortuno-black bg-white border-[1.5px] border-fortuno-gold-intense/35 rounded-[10px] tabular-nums focus-visible:outline-none focus-visible:border-fortuno-gold-intense focus-visible:ring-[3px] focus-visible:ring-fortuno-gold-soft/35"
                aria-label="Quantidade de bilhetes"
              />
              <input
                type="range"
                min={minQty}
                max={sliderMax}
                value={Math.min(quantity, sliderMax)}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange(Number(e.target.value))
                }
                className="qty-slider"
                aria-label="Ajuste a quantidade de bilhetes"
                aria-valuetext={`${quantity} ${quantity === 1 ? 'bilhete' : 'bilhetes'}${
                  currentCombo ? ` — pacote ${currentCombo.name} aplicado` : ''
                }`}
              />
            </div>

            <Receipt
              quantity={quantity}
              ticketPrice={ticketPrice}
              subtotal={pricing.subtotal}
              discount={pricing.discount}
              total={pricing.total}
              comboName={currentCombo?.name}
            />

            <button
              type="button"
              onClick={onBuy}
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 mt-5 rounded-full bg-[radial-gradient(120%_120%_at_30%_20%,var(--fortuno-gold-soft),var(--fortuno-gold-intense)_80%)] text-fortuno-black font-display italic font-extrabold text-[17px] tracking-[-0.01em] shadow-[0_12px_28px_-8px_rgba(212,175,55,0.55),0_1px_0_rgba(255,255,255,0.45)_inset] transition-all duration-noir-fast ease-noir-spring hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-[4px] focus-visible:ring-fortuno-gold-soft/55 min-h-[56px]"
            >
              <Ticket className="w-4 h-4" aria-hidden="true" />
              Comprar {quantity} {quantity === 1 ? 'bilhete' : 'bilhetes'}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <p className="text-center mt-3 text-[11px] text-fortuno-black/55 inline-flex items-center justify-center gap-1.5 w-full">
              <Lock className="w-3 h-3 text-fortuno-gold-intense" aria-hidden="true" />
              Pagamento via PIX criptografado · confirmação em segundos
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
