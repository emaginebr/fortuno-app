import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import {
  getHeaders,
  UnauthenticatedError,
  handleResponse,
  ApiError,
} from '../apiHelpers';

describe('apiHelpers.getHeaders', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('sempre injeta X-Tenant-Id em chamadas não autenticadas', () => {
    const headers = getHeaders(false) as Record<string, string>;
    expect(headers['X-Tenant-Id']).toBe('fortuno');
    expect(headers['Content-Type']).toBe('application/json');
    expect(headers.Authorization).toBeUndefined();
  });

  it('adiciona Authorization Bearer quando autenticado e token presente', () => {
    localStorage.setItem('fortuno:nauth', JSON.stringify({ token: 'abc.def.ghi' }));
    const headers = getHeaders(true) as Record<string, string>;
    expect(headers['X-Tenant-Id']).toBe('fortuno');
    expect(headers.Authorization).toBe('Bearer abc.def.ghi');
  });

  it('lança UnauthenticatedError quando authenticated=true sem token', () => {
    expect(() => getHeaders(true)).toThrow(UnauthenticatedError);
  });
});

describe('apiHelpers.handleResponse', () => {
  it('retorna data quando ApiResponseGeneric.sucesso=true', async () => {
    const fakeResponse = new Response(
      JSON.stringify({ sucesso: true, data: { x: 1 }, mensagem: null, erros: null }),
      { status: 200 },
    );
    const result = await handleResponse<{ x: number }>(fakeResponse);
    expect(result).toEqual({ x: 1 });
  });

  it('lança ApiError quando ApiResponseGeneric.sucesso=false', async () => {
    const fakeResponse = new Response(
      JSON.stringify({
        sucesso: false,
        mensagem: 'Erro de validação',
        erros: ['campo inválido'],
      }),
      { status: 200 },
    );
    await expect(handleResponse(fakeResponse)).rejects.toThrow(ApiError);
  });

  it('retorna body direto quando não há wrapper', async () => {
    const fakeResponse = new Response(
      JSON.stringify([{ id: 1 }, { id: 2 }]),
      { status: 200 },
    );
    const result = await handleResponse<Array<{ id: number }>>(fakeResponse);
    expect(result).toHaveLength(2);
  });

  it('lança UnauthenticatedError em 401', async () => {
    const fakeResponse = new Response(null, { status: 401 });
    await expect(handleResponse(fakeResponse)).rejects.toThrow(UnauthenticatedError);
  });
});

describe('SC-004 — X-Tenant-Id cobertura', () => {
  it('o header está sempre presente, autenticado ou não', () => {
    const publicHeaders = getHeaders(false) as Record<string, string>;
    expect(publicHeaders['X-Tenant-Id']).toBe('fortuno');

    localStorage.setItem('fortuno:nauth', JSON.stringify({ token: 'tok' }));
    const authHeaders = getHeaders(true) as Record<string, string>;
    expect(authHeaders['X-Tenant-Id']).toBe('fortuno');
  });
});

// Suppress ambient test globals warning
vi.fn();
