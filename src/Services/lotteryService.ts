import { apiUrl, getHeaders, handleResponse } from './apiHelpers';
import type {
  LotteryInfo,
  LotteryInsertInfo,
  LotteryUpdateInfo,
  LotteryCancelRequest,
} from '@/types/lottery';
import { LotteryStatus } from '@/types/enums';

/**
 * Service de Lotteries — mapeia endpoints de contracts/api-endpoints.md#Lotteries.
 */
export class LotteryService {
  public async getById(lotteryId: number): Promise<LotteryInfo> {
    const res = await fetch(apiUrl(`/lotteries/${lotteryId}`), {
      method: 'GET',
      headers: getHeaders(false),
    });
    return handleResponse<LotteryInfo>(res);
  }

  public async getBySlug(slug: string): Promise<LotteryInfo> {
    const res = await fetch(apiUrl(`/lotteries/slug/${encodeURIComponent(slug)}`), {
      method: 'GET',
      headers: getHeaders(false),
    });
    return handleResponse<LotteryInfo>(res);
  }

  public async listByStore(storeId: number): Promise<LotteryInfo[]> {
    const res = await fetch(apiUrl(`/lotteries/store/${storeId}`), {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse<LotteryInfo[]>(res);
  }

  /**
   * MOCK: aguarda endpoint público `/lotteries/open`.
   * Enquanto isso, usa list-by-store + filtro client-side.
   * Ver MOCKS.md.
   */
  public async listOpen(): Promise<LotteryInfo[]> {
    const storeIdRaw = import.meta.env.VITE_FORTUNO_STORE_ID;
    const storeId = Number(storeIdRaw || 1);
    try {
      const list = await this.listByStore(storeId);
      return list.filter((l) => l.status === LotteryStatus.Open);
    } catch {
      // Sem auth ou endpoint público indisponível — retorna vazio para UI degradar bem.
      return [];
    }
  }

  public async create(payload: LotteryInsertInfo): Promise<LotteryInfo> {
    const res = await fetch(apiUrl('/lotteries'), {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    return handleResponse<LotteryInfo>(res);
  }

  public async update(payload: LotteryUpdateInfo): Promise<LotteryInfo> {
    const res = await fetch(apiUrl(`/lotteries/${payload.lotteryId}`), {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    return handleResponse<LotteryInfo>(res);
  }

  public async publish(lotteryId: number): Promise<void> {
    const res = await fetch(apiUrl(`/lotteries/${lotteryId}/publish`), {
      method: 'POST',
      headers: getHeaders(true),
    });
    await handleResponse<void>(res);
  }

  public async close(lotteryId: number): Promise<void> {
    const res = await fetch(apiUrl(`/lotteries/${lotteryId}/close`), {
      method: 'POST',
      headers: getHeaders(true),
    });
    await handleResponse<void>(res);
  }

  public async cancel(lotteryId: number, payload: LotteryCancelRequest): Promise<void> {
    const res = await fetch(apiUrl(`/lotteries/${lotteryId}/cancel`), {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    await handleResponse<void>(res);
  }
}

export const lotteryService = new LotteryService();
