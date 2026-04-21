export interface ReferrerCommission {
  ticketId: number;
  lotteryId: number;
  buyerName: string;
  amount: number;
  createdAt: string;
}

export interface LotteryCommissionsPanel {
  lotteryId: number;
  lotteryName?: string;
  totalCommission: number;
  commissions: ReferrerCommission[];
}
