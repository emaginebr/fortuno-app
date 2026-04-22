import { apiUrl, getHeaders, handleResponse, safeFetch } from './apiHelpers';
import type { LotteryCommissionsPanel } from '@/types/commission';

export class CommissionService {
  public async listByLottery(lotteryId: number): Promise<LotteryCommissionsPanel> {
    const res = await safeFetch(apiUrl(`/commissions/lottery/${lotteryId}`), {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse<LotteryCommissionsPanel>(res);
  }
}

export const commissionService = new CommissionService();
