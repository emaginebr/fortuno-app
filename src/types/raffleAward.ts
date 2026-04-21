export interface RaffleAwardInfo {
  raffleAwardId: number;
  raffleId: number;
  position: number;
  description: string;
}

export interface RaffleAwardInsertInfo {
  raffleId: number;
  position: number;
  description: string;
}

export interface RaffleAwardUpdateInfo extends RaffleAwardInsertInfo {
  raffleAwardId: number;
}
