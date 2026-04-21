export interface LotteryImageInfo {
  lotteryImageId: number;
  lotteryId: number;
  imageUrl: string;
  description: string;
  order: number;
}

export interface LotteryImageInsertInfo {
  lotteryId: number;
  imageUrl: string;
  description: string;
  order: number;
}

export interface LotteryImageUpdateInfo extends LotteryImageInsertInfo {
  lotteryImageId: number;
}
