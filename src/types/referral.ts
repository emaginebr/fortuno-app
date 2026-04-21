export interface ReferrerLotteryBreakdown {
  lotteryId: number;
  lotteryName: string;
  purchases: number;
  toReceive: number;
}

export interface ReferrerEarningsPanel {
  referralCode: string;
  totalPurchases: number;
  totalToReceive: number;
  byLottery: ReferrerLotteryBreakdown[];
  note: string;
}

export interface ReferralCodeResponse {
  referralCode: string;
}
