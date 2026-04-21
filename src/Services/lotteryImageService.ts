import { apiUrl, getHeaders, handleResponse } from './apiHelpers';
import type {
  LotteryImageInfo,
  LotteryImageInsertInfo,
  LotteryImageUpdateInfo,
} from '@/types/lotteryImage';

export class LotteryImageService {
  public async listByLottery(lotteryId: number): Promise<LotteryImageInfo[]> {
    const res = await fetch(apiUrl(`/lottery-images/lottery/${lotteryId}`), {
      method: 'GET',
      headers: getHeaders(false),
    });
    return handleResponse<LotteryImageInfo[]>(res);
  }

  public async create(payload: LotteryImageInsertInfo): Promise<LotteryImageInfo> {
    const res = await fetch(apiUrl('/lottery-images'), {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    return handleResponse<LotteryImageInfo>(res);
  }

  public async update(payload: LotteryImageUpdateInfo): Promise<LotteryImageInfo> {
    const res = await fetch(apiUrl(`/lottery-images/${payload.lotteryImageId}`), {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    return handleResponse<LotteryImageInfo>(res);
  }

  public async remove(lotteryImageId: number): Promise<void> {
    const res = await fetch(apiUrl(`/lottery-images/${lotteryImageId}`), {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    await handleResponse<void>(res);
  }
}

export const lotteryImageService = new LotteryImageService();
