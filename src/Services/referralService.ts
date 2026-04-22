import { apiUrl, getHeaders, handleResponse, safeFetch } from './apiHelpers';
import type { ReferralCodeResponse, ReferrerEarningsPanel } from '@/types/referral';

export class ReferralService {
  public async getMyCode(): Promise<ReferralCodeResponse> {
    const res = await safeFetch(apiUrl('/referrals/code/me'), {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse<ReferralCodeResponse>(res);
  }

  public async getEarningsPanel(): Promise<ReferrerEarningsPanel> {
    const res = await safeFetch(apiUrl('/referrals/me'), {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse<ReferrerEarningsPanel>(res);
  }
}

export const referralService = new ReferralService();
