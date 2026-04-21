import { useMemo } from 'react';
import { getHeaders } from '@/Services/apiHelpers';

/**
 * Retorna os headers canônicos da API Fortuno (inclui X-Tenant-Id + Bearer).
 * Use em componentes que precisam chamar fetch em handlers pontuais.
 */
export const useTenantHeader = (authenticated = false): { headers: HeadersInit } => {
  return useMemo(() => ({ headers: getHeaders(authenticated) }), [authenticated]);
};
