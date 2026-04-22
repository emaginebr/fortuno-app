/**
 * Fortuno — API helpers
 *
 * SINGLE SOURCE OF TRUTH para headers das chamadas à API Fortuno.
 * Todo service DEVE usar `getHeaders()` — garante SC-004
 * (X-Tenant-Id: fortuno em 100% das requisições autenticadas e públicas).
 */

export const API_BASE_URL: string = import.meta.env.VITE_API_URL;
const TENANT_ID: string = import.meta.env.VITE_FORTUNO_TENANT_ID ?? 'fortuno';

/**
 * Chave de storage usada pelo `nauth-react` para persistir a sessão.
 * A lib não expõe essa chave publicamente; o valor abaixo é o padrão
 * observado. Se mudar, ajustar aqui — mantendo como ÚNICO ponto de
 * leitura direto do localStorage no frontend Fortuno.
 */
const NAUTH_STORAGE_KEY = 'fortuno:nauth';

export class UnauthenticatedError extends Error {
  constructor(message = 'Usuário não autenticado') {
    super(message);
    this.name = 'UnauthenticatedError';
  }
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly errors: string[];

  constructor(message: string, status: number, errors: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

interface ApiResponseGeneric<T> {
  sucesso: boolean;
  mensagem: string | null;
  erros?: string[] | null;
  data?: T | null;
  /** Alguns endpoints retornam objetos flat sem wrapper — suportado em `handleResponse`. */
  [key: string]: unknown;
}

/**
 * Lê o token NAuth persistido pelo `NAuthProvider`.
 * Tenta várias chaves conhecidas para ser resiliente a mudanças da lib.
 */
export const readNAuthToken = (): string | null => {
  const candidates = [NAUTH_STORAGE_KEY, 'nauth-auth', 'nauth_session', 'auth:nauth'];
  for (const key of candidates) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      const token =
        (typeof parsed === 'string' && parsed) ||
        parsed?.token ||
        parsed?.accessToken ||
        parsed?.session?.token;
      if (typeof token === 'string' && token.length > 0) {
        return token;
      }
    } catch {
      // raw pode ser o próprio token (string)
      if (typeof raw === 'string' && raw.length > 0) return raw;
    }
  }
  return null;
};

/**
 * Headers canônicos para chamadas à API Fortuno.
 * SEMPRE injeta X-Tenant-Id. Quando authenticated=true, injeta Bearer do NAuth.
 */
export const getHeaders = (authenticated = false): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Tenant-Id': TENANT_ID,
  };

  if (authenticated) {
    const token = readNAuthToken();
    if (!token) {
      throw new UnauthenticatedError();
    }
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Wrapper fino em cima de `fetch` que converte erros de rede
 * (API desligada, CORS bloqueando, DNS falhando, timeout) em
 * `ApiError(status=0)` com mensagem amigável em PT-BR.
 *
 * TODO service DEVE usar `safeFetch` em vez de `fetch` — garante que
 * `TypeError: Failed to fetch` nunca vaze como exceção genérica,
 * o que faria `handleError` dos Contexts cair no fallback genérico.
 */
export const safeFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const method = (init?.method ?? 'GET').toUpperCase();
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  const startedAt = performance.now();
  console.log(`[api] → ${method} ${url}`);

  try {
    const res = await fetch(input, init);
    const elapsed = Math.round(performance.now() - startedAt);
    const tag = res.ok ? 'log' : 'warn';
    console[tag](`[api] ← ${res.status} ${method} ${url} (${elapsed}ms)`);
    return res;
  } catch (err) {
    const elapsed = Math.round(performance.now() - startedAt);
    console.error(`[api] ✕ ${method} ${url} (${elapsed}ms)`, err);

    if (err instanceof UnauthenticatedError || err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      'Servidor indisponível. Verifique sua conexão ou tente novamente mais tarde.',
      0,
      [err instanceof Error ? err.message : String(err)],
    );
  }
};

/**
 * Processa resposta HTTP da API Fortuno.
 * - Quando `sucesso=false`, lança ApiError com mensagens concatenadas.
 * - Quando payload não tem wrapper `ApiResponseGeneric`, retorna body como T.
 */
export const handleResponse = async <T>(res: Response): Promise<T> => {
  if (res.status === 401) {
    throw new UnauthenticatedError('Sessão expirada — faça login novamente.');
  }

  const text = await res.text();
  const body = text ? (JSON.parse(text) as ApiResponseGeneric<T> | T) : null;

  if (!res.ok) {
    const errs =
      body && typeof body === 'object' && 'erros' in body ? ((body as ApiResponseGeneric<T>).erros ?? []) : [];
    const msg =
      (body && typeof body === 'object' && 'mensagem' in body && (body as ApiResponseGeneric<T>).mensagem) ||
      `Erro HTTP ${res.status}`;
    throw new ApiError(msg as string, res.status, errs ?? []);
  }

  if (body && typeof body === 'object' && 'sucesso' in body) {
    const wrapped = body as ApiResponseGeneric<T>;
    if (!wrapped.sucesso) {
      throw new ApiError(
        wrapped.mensagem ?? 'Operação sem sucesso',
        res.status,
        wrapped.erros ?? [],
      );
    }
    return (wrapped.data ?? (wrapped as unknown as T)) as T;
  }

  return body as T;
};

/**
 * Monta URL absoluta da API Fortuno.
 */
export const apiUrl = (path: string): string => {
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
};
