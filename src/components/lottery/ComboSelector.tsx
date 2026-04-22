import { useMemo, useState, type ChangeEvent } from 'react';
import type { LotteryComboInfo } from '@/types/lotteryCombo';
import { formatBRL } from '@/utils/currency';

interface ComboSelectorProps {
  combos: LotteryComboInfo[];
  ticketPrice: number;
  minQty: number;
  maxQty: number;
  initialQuantity?: number;
  onChange?: (quantity: number, combo: LotteryComboInfo | null, total: number) => void;
}

export const pickCombo = (
  quantity: number,
  combos: LotteryComboInfo[],
): LotteryComboInfo | null =>
  combos.find(
    (c) => quantity >= c.quantityStart && (c.quantityEnd === 0 || quantity <= c.quantityEnd),
  ) ?? null;

export const computePrice = (
  quantity: number,
  combo: LotteryComboInfo | null,
  ticketPrice: number,
): { subtotal: number; discount: number; total: number } => {
  const subtotal = ticketPrice * quantity;
  if (!combo) return { subtotal, discount: 0, total: subtotal };
  const discount = (subtotal * combo.discountValue) / 100;
  return { subtotal, discount, total: subtotal - discount };
};

export const ComboSelector = ({
  combos,
  ticketPrice,
  minQty,
  maxQty,
  initialQuantity,
  onChange,
}: ComboSelectorProps): JSX.Element => {
  const [quantity, setQuantity] = useState<number>(initialQuantity ?? minQty);

  const sorted = useMemo(
    () => [...combos].sort((a, b) => a.quantityStart - b.quantityStart),
    [combos],
  );

  const currentCombo = pickCombo(quantity, sorted);
  const pricing = computePrice(quantity, currentCombo, ticketPrice);

  const unlimited = maxQty <= 0;
  const effectiveMax = unlimited ? Number.MAX_SAFE_INTEGER : maxQty;
  const sliderMax = unlimited ? 500 : Math.min(maxQty, 500);

  const handleChange = (q: number): void => {
    const clamped = Math.max(minQty, Math.min(effectiveMax, q));
    setQuantity(clamped);
    onChange?.(clamped, pickCombo(clamped, sorted), computePrice(clamped, pickCombo(clamped, sorted), ticketPrice).total);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {sorted.length === 0 ? (
          <div className="col-span-full rounded-lg border border-dashed p-6 text-center text-sm text-fortuno-black/60">
            Ainda não há combos cadastrados para este sorteio.
          </div>
        ) : (
          sorted.map((combo) => {
            const active = currentCombo?.lotteryComboId === combo.lotteryComboId;
            return (
              <button
                key={combo.lotteryComboId}
                type="button"
                onClick={() => handleChange(combo.quantityStart)}
                className={`flex flex-col items-start rounded-xl border-2 p-5 text-left transition ${
                  active
                    ? 'border-fortuno-gold-intense bg-fortuno-gold-intense/10 shadow-md'
                    : 'border-fortuno-black/10 bg-white hover:border-fortuno-gold-soft'
                }`}
              >
                <span className="font-display text-xl text-fortuno-black">{combo.name}</span>
                <span className="mt-1 text-sm text-fortuno-black/60">
                  {combo.quantityEnd === 0
                    ? `A partir de ${combo.quantityStart} bilhetes`
                    : `De ${combo.quantityStart} a ${combo.quantityEnd} bilhetes`}
                </span>
                <span className="mt-3 inline-flex items-center rounded-full bg-fortuno-gold-intense/15 px-3 py-1 text-sm font-semibold text-fortuno-black">
                  {combo.discountLabel}
                </span>
              </button>
            );
          })
        )}
      </div>

      <div className="rounded-xl border border-fortuno-black/10 bg-white p-5">
        <div className="flex flex-wrap items-center gap-4">
          <label htmlFor="quantity" className="text-sm font-semibold">
            Quantidade de bilhetes
          </label>
          <input
            id="quantity"
            type="number"
            inputMode="numeric"
            min={minQty}
            {...(unlimited ? {} : { max: maxQty })}
            value={quantity}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(Number(e.target.value))}
            className="w-24 rounded-md border border-fortuno-black/20 px-3 py-2 font-mono focus:border-fortuno-gold-intense focus:outline-none"
          />
          <input
            type="range"
            min={minQty}
            max={sliderMax}
            value={quantity}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(Number(e.target.value))}
            className="flex-1 accent-fortuno-gold-intense"
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-fortuno-black/60">Subtotal</div>
            <div className="font-semibold">{formatBRL(pricing.subtotal)}</div>
          </div>
          <div>
            <div className="text-fortuno-black/60">Desconto</div>
            <div className="font-semibold text-fortuno-green-elegant">
              - {formatBRL(pricing.discount)}
            </div>
          </div>
          <div>
            <div className="text-fortuno-black/60">Total</div>
            <div className="font-display text-xl text-fortuno-black">
              {formatBRL(pricing.total)}
            </div>
          </div>
        </div>
        {currentCombo ? (
          <p className="mt-3 text-xs text-fortuno-gold-intense">
            Pacote aplicado: <strong>{currentCombo.name}</strong> — {currentCombo.discountLabel}
          </p>
        ) : null}
      </div>
    </div>
  );
};
