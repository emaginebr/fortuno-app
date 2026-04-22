import { apiUrl, ApiError, getHeaders, handleResponse, safeFetch } from './apiHelpers';
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
    const res = await safeFetch(apiUrl(`/tickets/${ticketId}`), {
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
    const res = await safeFetch(apiUrl(`/tickets/mine${qs}`), {
      method: 'GET',
      headers: getHeaders(true),
    });
    const data = await handleResponse<TicketInfo[] | { items: TicketInfo[] }>(res);
    return Array.isArray(data) ? data : (data.items ?? []);
  }

  public async createQrCode(req: TicketOrderRequest): Promise<TicketQRCodeInfo> {
    const res = await safeFetch(apiUrl('/tickets/qrcode'), {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(req),
    });
    return handleResponse<TicketQRCodeInfo>(res);
  }

  public async getQrCodeStatus(invoiceId: number): Promise<TicketQRCodeStatusInfo> {
    const res = await safeFetch(apiUrl(`/tickets/qrcode/${invoiceId}/status`), {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse<TicketQRCodeStatusInfo>(res);
  }

  /**
   * MOCK: aguarda endpoint real do simulador PIX (ver MOCKS.md).
   * Tenta POST /tickets/qrcode/{invoiceId}/pay-simulate; se 404, apenas resolve silent.
   * Outras falhas (rede, 5xx, validação) são propagadas para o caller exibir toast.
   */
  public async simulatePayment(invoiceId: number): Promise<void> {
    const res = await safeFetch(apiUrl(`/tickets/qrcode/${invoiceId}/pay-simulate`), {
      method: 'POST',
      headers: getHeaders(true),
    });
    if (res.status === 404) {
      throw new ApiError('Simulador de pagamento indisponível neste ambiente.', 404, []);
    }
    await handleResponse<void>(res);
  }
}

export const ticketService = new TicketService();
