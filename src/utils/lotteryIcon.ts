import { Trophy, Car, Gem, Ticket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Heurística compartilhada com `LotteryCardPremium` (home) para escolher
 * um ícone que represente o tema do sorteio a partir do nome.
 */
export const iconForLotteryName = (name: string): LucideIcon => {
  if (/mega/i.test(name)) return Trophy;
  if (/garage|garagem|car|carro|porsche|ferrari|lamborghini/i.test(name)) return Car;
  if (/diamante|gem|jewel|joia|diamond/i.test(name)) return Gem;
  return Ticket;
};
