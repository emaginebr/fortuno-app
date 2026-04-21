import type { RaffleStatus } from './enums';
import type { RaffleAwardInfo } from './raffleAward';

export interface RaffleInfo {
  raffleId: number;
  lotteryId: number;
  name: string;
  descriptionMd: string;
  raffleDatetime: string;
  includePreviousWinners: boolean;
  status: RaffleStatus;
  createdAt: string;
  updatedAt: string;
  awards: RaffleAwardInfo[];
}

export interface RaffleInsertInfo {
  lotteryId: number;
  name: string;
  descriptionMd: string;
  raffleDatetime: string;
  includePreviousWinners: boolean;
}

export interface RaffleUpdateInfo extends RaffleInsertInfo {
  raffleId: number;
}

export interface RaffleWinnersPreviewRequest {
  raffleId: number;
  notes?: string;
}

export interface RaffleWinnerPreviewRow {
  raffleAwardId: number;
  position: number;
  ticketId: number;
  ticketNumber: number;
  ticketValue: string;
  userName: string;
  userEmail: string;
}
