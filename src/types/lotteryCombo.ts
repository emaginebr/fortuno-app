export interface LotteryComboInfo {
  lotteryComboId: number;
  lotteryId: number;
  name: string;
  quantityStart: number;
  quantityEnd: number;
  discountLabel: string;
  discountValue: number;
}

export interface LotteryComboInsertInfo {
  lotteryId: number;
  name: string;
  quantityStart: number;
  quantityEnd: number;
  discountLabel: string;
  discountValue: number;
}

export interface LotteryComboUpdateInfo extends LotteryComboInsertInfo {
  lotteryComboId: number;
}
