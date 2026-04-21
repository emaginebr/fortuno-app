/**
 * Fortuno — Enums de domínio
 * Espelha Fortuno.DTO/Enums do backend. Ver data-model.md#Enums.
 */

export enum LotteryStatus {
  Draft = 1,
  Open = 2,
  Closed = 3,
  Cancelled = 4,
}

export enum NumberType {
  Int64 = 1,
  Composed3 = 3,
  Composed4 = 4,
  Composed5 = 5,
  Composed6 = 6,
  Composed7 = 7,
  Composed8 = 8,
}

export enum TicketOrderMode {
  Random = 1,
  Manual = 2,
}

export enum TicketRefundState {
  None = 0,
  Pending = 1,
  Refunded = 2,
}

export enum TicketOrderStatus {
  Pending = 1,
  Sent = 2,
  Paid = 3,
  Overdue = 4,
  Cancelled = 5,
  Expired = 6,
}

export enum RaffleStatus {
  Scheduled = 1,
  InProgress = 2,
  Closed = 3,
  Cancelled = 4,
}

export const LOTTERY_STATUS_LABEL: Record<LotteryStatus, string> = {
  [LotteryStatus.Draft]: 'Rascunho',
  [LotteryStatus.Open]: 'Aberto',
  [LotteryStatus.Closed]: 'Encerrado',
  [LotteryStatus.Cancelled]: 'Cancelado',
};

export const NUMBER_TYPE_LABEL: Record<NumberType, string> = {
  [NumberType.Int64]: 'Inteiro (ex.: 000001 a 999999)',
  [NumberType.Composed3]: 'Composto de 3 dezenas',
  [NumberType.Composed4]: 'Composto de 4 dezenas',
  [NumberType.Composed5]: 'Composto de 5 dezenas',
  [NumberType.Composed6]: 'Composto de 6 dezenas',
  [NumberType.Composed7]: 'Composto de 7 dezenas',
  [NumberType.Composed8]: 'Composto de 8 dezenas',
};

export const composedSize = (type: NumberType): number => {
  switch (type) {
    case NumberType.Composed3:
      return 3;
    case NumberType.Composed4:
      return 4;
    case NumberType.Composed5:
      return 5;
    case NumberType.Composed6:
      return 6;
    case NumberType.Composed7:
      return 7;
    case NumberType.Composed8:
      return 8;
    default:
      return 0;
  }
};
