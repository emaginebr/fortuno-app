import type { TicketOrderMode, TicketOrderStatus, TicketRefundState } from './enums';

export interface TicketInfo {
  ticketId: number;
  lotteryId: number;
  userId: number;
  invoiceId: number;
  /**
   * Valor long canônico do backend. Usado internamente para chaves/ordenação.
   * Para exibição ao usuário, sempre preferir `ticketValue` (formato canônico
   * string — "42" para Int64, "05-11-28-39-60" para Composed).
   */
  ticketNumber: number;
  /**
   * Representação canônica exibível. Já vem ordenada + zero-padded do backend.
   * Único campo usado em UI para mostrar ou comparar o número do bilhete.
   */
  ticketValue: string;
  refundState: TicketRefundState;
  createdAt: string;
}

export interface TicketOrderRequest {
  lotteryId: number;
  quantity: number;
  mode: TicketOrderMode;
  /**
   * Números escolhidos pelo usuário em modo Manual.
   * Sempre em formato string canônico:
   * - Int64:    "42", "1000"
   * - Composed: "05-11-28-39-60" (pode ser enviado desordenado — backend normaliza).
   */
  pickedNumbers?: string[];
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
  /**
   * Filtro unificado por número do bilhete. Aceita Int64 ("42") ou Composed
   * ("05-11-28-39-60"). Backend normaliza a ordem dos componentes, então a UI
   * pode enviar o texto digitado pelo usuário diretamente. Substitui o antigo
   * par `number: long` + `ticketValue: string` do contrato v1.
   */
  number?: string;
  fromDate?: string;
  toDate?: string;
}

/**
 * Status da tentativa de reserva de número (POST /tickets/reserve-number).
 * 1 = Reserved, 2 = AlreadyPurchased, 3 = AlreadyReserved.
 */
export type NumberReservationStatus = 1 | 2 | 3;

export interface NumberReservationRequest {
  lotteryId: number;
  /**
   * Número em formato string canônico (idem `TicketOrderRequest.pickedNumbers`).
   * Composed pode ser enviado desordenado — backend normaliza.
   */
  ticketNumber: string;
}

export interface NumberReservationResult {
  success: boolean;
  status: NumberReservationStatus;
  message: string;
  lotteryId: number;
  /** Formato canônico (ordenado + zero-padded). Use direto para exibir/comparar. */
  ticketNumber: string;
  /** ISO. Presente apenas quando `success=true`. */
  expiresAt?: string | null;
}
