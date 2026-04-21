import { apiUrl, getHeaders, handleResponse } from './apiHelpers';
import type { LotteryCommissionsPanel } from '@/types/commission';

export class CommissionService {
  public async listByLottery(lotteryId: number): Promise<LotteryCommissionsPanel> {
    const res = await fetch(apiUrl(`/commissions/lottery/${lotteryId}`), {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse<LotteryCommissionsPanel>(res);
  }
}

export const commissionService = new CommissionService();
