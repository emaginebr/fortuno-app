import { apiUrl, getHeaders, handleResponse } from './apiHelpers';
import type {
  RaffleAwardInfo,
  RaffleAwardInsertInfo,
  RaffleAwardUpdateInfo,
} from '@/types/raffleAward';

export class RaffleAwardService {
  public async listByRaffle(raffleId: number): Promise<RaffleAwardInfo[]> {
    const res = await fetch(apiUrl(`/raffle-awards?raffleId=${raffleId}`), {
      method: 'GET',
      headers: getHeaders(false),
    });
    return handleResponse<RaffleAwardInfo[]>(res);
  }

  public async create(payload: RaffleAwardInsertInfo): Promise<RaffleAwardInfo> {
    const res = await fetch(apiUrl('/raffle-awards'), {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    return handleResponse<RaffleAwardInfo>(res);
  }

  public async update(payload: RaffleAwardUpdateInfo): Promise<RaffleAwardInfo> {
    const res = await fetch(apiUrl(`/raffle-awards/${payload.raffleAwardId}`), {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    return handleResponse<RaffleAwardInfo>(res);
  }

  public async remove(raffleAwardId: number): Promise<void> {
    const res = await fetch(apiUrl(`/raffle-awards/${raffleAwardId}`), {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    await handleResponse<void>(res);
  }
}

export const raffleAwardService = new RaffleAwardService();
