import { apiUrl, getHeaders, handleResponse } from './apiHelpers';
import type {
  LotteryComboInfo,
  LotteryComboInsertInfo,
  LotteryComboUpdateInfo,
} from '@/types/lotteryCombo';

export class LotteryComboService {
  public async listByLottery(lotteryId: number): Promise<LotteryComboInfo[]> {
    const res = await fetch(apiUrl(`/lottery-combos/lottery/${lotteryId}`), {
      method: 'GET',
      headers: getHeaders(false),
    });
    return handleResponse<LotteryComboInfo[]>(res);
  }

  public async create(payload: LotteryComboInsertInfo): Promise<LotteryComboInfo> {
    const res = await fetch(apiUrl('/lottery-combos'), {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    return handleResponse<LotteryComboInfo>(res);
  }

  public async update(payload: LotteryComboUpdateInfo): Promise<LotteryComboInfo> {
    const res = await fetch(apiUrl(`/lottery-combos/${payload.lotteryComboId}`), {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    return handleResponse<LotteryComboInfo>(res);
  }

  public async remove(lotteryComboId: number): Promise<void> {
    const res = await fetch(apiUrl(`/lottery-combos/${lotteryComboId}`), {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    await handleResponse<void>(res);
  }
}

export const lotteryComboService = new LotteryComboService();
