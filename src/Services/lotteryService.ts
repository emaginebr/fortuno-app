import { apiUrl, getHeaders, handleResponse, safeFetch } from './apiHelpers';
import type {
  LotteryInfo,
  LotteryInsertInfo,
  LotteryUpdateInfo,
  LotteryCancelRequest,
} from '@/types/lottery';

/**
 * Service de Lotteries — mapeia endpoints de contracts/api-endpoints.md#Lotteries.
 */
export class LotteryService {
  public async getById(lotteryId: number): Promise<LotteryInfo> {
    const res = await safeFetch(apiUrl(`/lotteries/${lotteryId}`), {
      method: 'GET',
      headers: getHeaders(false),
    });
    return handleResponse<LotteryInfo>(res);
  }

  public async getBySlug(slug: string): Promise<LotteryInfo> {
    const res = await safeFetch(apiUrl(`/lotteries/slug/${encodeURIComponent(slug)}`), {
      method: 'GET',
      headers: getHeaders(false),
    });
    return handleResponse<LotteryInfo>(res);
  }

  public async listByStore(storeId: number): Promise<LotteryInfo[]> {
    const res = await safeFetch(apiUrl(`/lotteries/store/${storeId}`), {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse<LotteryInfo[]>(res);
  }

  public async listOpen(): Promise<LotteryInfo[]> {
    const res = await safeFetch(apiUrl('/lotteries/open'), {
      method: 'GET',
      headers: getHeaders(false),
    });
    return handleResponse<LotteryInfo[]>(res);
  }

  public async create(payload: LotteryInsertInfo): Promise<LotteryInfo> {
    const res = await safeFetch(apiUrl('/lotteries'), {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    return handleResponse<LotteryInfo>(res);
  }

  public async update(payload: LotteryUpdateInfo): Promise<LotteryInfo> {
    const res = await safeFetch(apiUrl(`/lotteries/${payload.lotteryId}`), {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    return handleResponse<LotteryInfo>(res);
  }

  public async publish(lotteryId: number): Promise<void> {
    const res = await safeFetch(apiUrl(`/lotteries/${lotteryId}/publish`), {
      method: 'POST',
      headers: getHeaders(true),
    });
    await handleResponse<void>(res);
  }

  public async revertToDraft(lotteryId: number): Promise<void> {
    const res = await safeFetch(apiUrl(`/lotteries/${lotteryId}/revert-to-draft`), {
      method: 'POST',
      headers: getHeaders(true),
    });
    await handleResponse<void>(res);
  }

  public async close(lotteryId: number): Promise<void> {
    const res = await safeFetch(apiUrl(`/lotteries/${lotteryId}/close`), {
      method: 'POST',
      headers: getHeaders(true),
    });
    await handleResponse<void>(res);
  }

  public async cancel(lotteryId: number, payload: LotteryCancelRequest): Promise<void> {
    const res = await safeFetch(apiUrl(`/lotteries/${lotteryId}/cancel`), {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    await handleResponse<void>(res);
  }

  public async remove(lotteryId: number): Promise<void> {
    const res = await safeFetch(apiUrl(`/lotteries/${lotteryId}`), {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    await handleResponse<void>(res);
  }
}

export const lotteryService = new LotteryService();
