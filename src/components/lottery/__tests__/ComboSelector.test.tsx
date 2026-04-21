import { describe, expect, it } from 'vitest';
import { pickCombo, computePrice } from '../ComboSelector';
import type { LotteryComboInfo } from '@/types/lotteryCombo';

const combos: LotteryComboInfo[] = [
  {
    lotteryComboId: 2,
    lotteryId: 1,
    name: '10% OFF',
    quantityStart: 6,
    quantityEnd: 10,
    discountLabel: '10% de desconto',
    discountValue: 10,
  },
  {
    lotteryComboId: 3,
    lotteryId: 1,
    name: '20% OFF',
    quantityStart: 11,
    quantityEnd: 9999,
    discountLabel: '20% de desconto',
    discountValue: 20,
  },
];

describe('ComboSelector.pickCombo', () => {
  it('retorna null quando nenhuma faixa cobre a quantidade', () => {
    expect(pickCombo(3, combos)).toBeNull();
  });

  it('escolhe combo 10% para qty=8', () => {
    expect(pickCombo(8, combos)?.name).toBe('10% OFF');
  });

  it('escolhe combo 20% para qty=15', () => {
    expect(pickCombo(15, combos)?.name).toBe('20% OFF');
  });
});

describe('ComboSelector.computePrice', () => {
  it('sem combo, total = price * qty', () => {
    const { total, discount } = computePrice(3, null, 10);
    expect(total).toBe(30);
    expect(discount).toBe(0);
  });

  it('com combo 10%, desconta 10% do subtotal', () => {
    const combo = combos[0];
    const { subtotal, discount, total } = computePrice(8, combo, 10);
    expect(subtotal).toBe(80);
    expect(discount).toBe(8);
    expect(total).toBe(72);
  });

  it('com combo 20%, desconta 20% do subtotal', () => {
    const combo = combos[1];
    const { total } = computePrice(15, combo, 10);
    expect(total).toBe(120);
  });
});
