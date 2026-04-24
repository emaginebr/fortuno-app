import type { LotteryStatus, NumberType } from './enums';
import type { LotteryImageInfo } from './lotteryImage';
import type { LotteryComboInfo } from './lotteryCombo';
import type { RaffleInfo } from './raffle';

export interface LotteryInfo {
  lotteryId: number;
  /** Interno — resolvido pelo backend a partir do usuário autenticado. NUNCA exibir/logar. */
  storeId: number;
  /** Interno — identificador de tenant no ProxyPay. NUNCA exibir/logar. */
  storeClientId?: string | null;
  name: string;
  slug: string;
  descriptionMd: string;
  rulesMd: string;
  privacyPolicyMd: string;
  ticketPrice: number;
  totalPrizeValue: number;
  ticketMin: number;
  ticketMax: number;
  ticketNumIni: number;
  ticketNumEnd: number;
  numberType: NumberType;
  numberValueMin: number;
  numberValueMax: number;
  referralPercent: number;
  status: LotteryStatus;
  createdAt: string;
  updatedAt: string;
  images: LotteryImageInfo[];
  combos: LotteryComboInfo[];
  raffles: RaffleInfo[];
}

export interface LotteryInsertInfo {
  name: string;
  descriptionMd: string;
  rulesMd: string;
  privacyPolicyMd: string;
  ticketPrice: number;
  totalPrizeValue: number;
  ticketMin: number;
  ticketMax: number;
  ticketNumIni: number;
  ticketNumEnd: number;
  numberType: NumberType;
  numberValueMin: number;
  numberValueMax: number;
  referralPercent: number;
}

export interface LotteryUpdateInfo extends LotteryInsertInfo {
  lotteryId: number;
}

export interface LotteryCancelRequest {
  reason: string;
}
