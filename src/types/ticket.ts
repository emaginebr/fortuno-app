import type { TicketOrderMode, TicketOrderStatus, TicketRefundState } from './enums';

export interface TicketInfo {
  ticketId: number;
  lotteryId: number;
  userId: number;
  invoiceId: number;
  ticketNumber: number;
  ticketValue: string;
  refundState: TicketRefundState;
  createdAt: string;
}

export interface TicketOrderRequest {
  lotteryId: number;
  quantity: number;
  mode: TicketOrderMode;
  pickedNumbers?: number[];
  referralCode?: string;
}

export interface TicketQRCodeInfo {
  invoiceId: number;
  invoiceNumber: string;
  brCode: string;
  brCodeBase64: string;
  expiredAt: string;
}

export interface TicketQRCodeStatusInfo {
  status: TicketOrderStatus | null;
  invoiceId: number;
  invoiceNumber?: string;
  expiredAt?: string;
  brCode?: string;
  brCodeBase64?: string;
  tickets?: TicketInfo[];
}

export interface TicketSearchQuery {
  lotteryId?: number;
  number?: string;
  fromDate?: string;
  toDate?: string;
}
