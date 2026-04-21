import { apiUrl, getHeaders, handleResponse } from './apiHelpers';
import type {
  TicketInfo,
  TicketOrderRequest,
  TicketQRCodeInfo,
  TicketQRCodeStatusInfo,
  TicketSearchQuery,
} from '@/types/ticket';

const buildQuery = (params: Record<string, string | number | undefined>): string => {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== '',
  );
  if (entries.length === 0) return '';
  return `?${entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&')}`;
};

export class TicketService {
  public async getById(ticketId: number): Promise<TicketInfo> {
    const res = await fetch(apiUrl(`/tickets/${ticketId}`), {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse<TicketInfo>(res);
  }

  public async listMine(query: TicketSearchQuery = {}): Promise<TicketInfo[]> {
    const qs = buildQuery({
      lotteryId: query.lotteryId,
      number: query.number,
      fromDate: query.fromDate,
      toDate: query.toDate,
    });
    const res = await fetch(apiUrl(`/tickets/mine${qs}`), {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse<TicketInfo[]>(res);
  }

  public async createQrCode(req: TicketOrderRequest): Promise<TicketQRCodeInfo> {
    const res = await fetch(apiUrl('/tickets/qrcode'), {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(req),
    });
    return handleResponse<TicketQRCodeInfo>(res);
  }

  public async getQrCodeStatus(invoiceId: number): Promise<TicketQRCodeStatusInfo> {
    const res = await fetch(apiUrl(`/tickets/qrcode/${invoiceId}/status`), {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse<TicketQRCodeStatusInfo>(res);
  }

  /**
   * MOCK: aguarda endpoint real do simulador PIX (ver MOCKS.md).
   * Tenta POST /tickets/qrcode/{invoiceId}/pay-simulate; se 404, apenas resolve silent.
   */
  public async simulatePayment(invoiceId: number): Promise<void> {
    try {
      const res = await fetch(apiUrl(`/tickets/qrcode/${invoiceId}/pay-simulate`), {
        method: 'POST',
        headers: getHeaders(true),
      });
      if (res.status === 404) return;
      await handleResponse<void>(res);
    } catch {
      // Silent — toast já foi disparado pelo caller
    }
  }
}

export const ticketService = new TicketService();
