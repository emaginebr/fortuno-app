import { apiUrl, getHeaders, handleResponse } from './apiHelpers';
import type {
  RaffleInfo,
  RaffleInsertInfo,
  RaffleWinnerPreviewRow,
  RaffleWinnersPreviewRequest,
} from '@/types/raffle';

export class RaffleService {
  public async getById(raffleId: number): Promise<RaffleInfo> {
    const res = await fetch(apiUrl(`/raffles/${raffleId}`), {
      method: 'GET',
      headers: getHeaders(false),
    });
    return handleResponse<RaffleInfo>(res);
  }

  public async listByLottery(lotteryId: number): Promise<RaffleInfo[]> {
    const res = await fetch(apiUrl(`/raffles/lottery/${lotteryId}`), {
      method: 'GET',
      headers: getHeaders(false),
    });
    return handleResponse<RaffleInfo[]>(res);
  }

  public async create(payload: RaffleInsertInfo): Promise<RaffleInfo> {
    const res = await fetch(apiUrl('/raffles'), {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    return handleResponse<RaffleInfo>(res);
  }

  public async close(raffleId: number): Promise<void> {
    const res = await fetch(apiUrl(`/raffles/${raffleId}/close`), {
      method: 'POST',
      headers: getHeaders(true),
    });
    await handleResponse<void>(res);
  }

  public async previewWinners(
    raffleId: number,
    payload: RaffleWinnersPreviewRequest,
  ): Promise<RaffleWinnerPreviewRow[]> {
    const res = await fetch(apiUrl(`/raffles/${raffleId}/winners/preview`), {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    return handleResponse<RaffleWinnerPreviewRow[]>(res);
  }

  public async confirmWinners(
    raffleId: number,
    payload: RaffleWinnersPreviewRequest,
  ): Promise<void> {
    const res = await fetch(apiUrl(`/raffles/${raffleId}/winners/confirm`), {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    await handleResponse<void>(res);
  }
}

export const raffleService = new RaffleService();
