export interface LotteryImageInfo {
  lotteryImageId: number;
  lotteryId: number;
  imageUrl: string;
  description: string;
  displayOrder: number;
  createdAt?: string;
}

export interface LotteryImageInsertInfo {
  lotteryId: number;
  imageBase64: string;
  description: string;
  displayOrder: number;
}

export interface LotteryImageUpdateInfo {
  lotteryImageId: number;
  description: string;
  displayOrder: number;
}
