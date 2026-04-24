import { NumberType, composedSize } from '@/types/enums';

/** Formata inteiro com separador de milhar pt-BR. */
export const formatInt64 = (n: number): string => n.toLocaleString('pt-BR');

/**
 * Quantidade de componentes esperados no formato canônico de cada NumberType.
 * Alinhado com `composedSize` mas contabiliza Int64 como 1 componente.
 *
 * Ver FRONTEND_TICKET_NUMBER_FORMAT_MIGRATION.md §10.
 */
export const componentCountFromNumberType = (type: NumberType): number => {
  if (type === NumberType.Int64) return 1;
  return composedSize(type);
};

/**
 * Normaliza o input do usuário no mesmo algoritmo do backend
 * (ver `Fortuno.Domain/Services/NumberCompositionService.cs`).
 *
 * - Int64     (componentCount=1): trim + valida dígitos; retorna decimal puro.
 * - Composed*: divide por `-`, valida cada componente em [0..99], ordena
 *   ascendente, re-emite com zero-pad de 2 dígitos ("05-11-28-39-60").
 *
 * Retorna `null` quando o input é inválido — útil para preview/UX antes de
 * enviar ao servidor. O backend continua sendo a fonte de verdade.
 */
export const normalizeTicketNumber = (
  input: string,
  componentCount: number,
): string | null => {
  const text = input.trim();
  if (componentCount === 1) {
    return /^\d+$/.test(text) ? text : null;
  }
  const parts = text.split('-');
  if (parts.length !== componentCount) return null;
  const nums = parts.map((p) => Number(p));
  if (nums.some((n) => !Number.isInteger(n) || n < 0 || n > 99)) return null;
  nums.sort((a, b) => a - b);
  return nums.map((n) => String(n).padStart(2, '0')).join('-');
};

/**
 * Formata um número composto (ex.: Composed6) em string canônica
 * com pares de 2 dígitos ordenados ascendentemente, separados por `-`.
 *
 * O backend já persiste `ticketValue` nessa forma. Esta função é usada
 * para exibir entradas manuais do usuário e para normalizar listas.
 */
export const formatComposed = (value: string | number, type: NumberType): string => {
  const size = composedSize(type);
  if (size === 0) return String(value);

  let parts: string[];
  if (typeof value === 'string') {
    // Quando há separadores, cada token é uma dezena
    if (/[^0-9]/.test(value.trim())) {
      parts = value
        .split(/[^0-9]+/)
        .filter(Boolean)
        .map((p) => p.padStart(2, '0'));
    } else {
      const raw = value;
      parts = [];
      for (let i = 0; i < raw.length; i += 2) {
        parts.push(raw.slice(i, i + 2).padStart(2, '0'));
      }
    }
  } else {
    const raw = String(value).padStart(size * 2, '0');
    parts = [];
    for (let i = 0; i < raw.length; i += 2) {
      parts.push(raw.slice(i, i + 2).padStart(2, '0'));
    }
  }

  while (parts.length < size) {
    parts.push('00');
  }

  return parts.slice(0, size).sort().join('-');
};

/** Coeficiente binomial C(n, k) com overflow-safe usando BigInt. */
const binomial = (n: number, k: number): number => {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  const kAdj = Math.min(k, n - k);
  let num = 1n;
  let den = 1n;
  for (let i = 0; i < kAdj; i++) {
    num *= BigInt(n - i);
    den *= BigInt(i + 1);
  }
  return Number(num / den);
};

/**
 * Total de bilhetes possíveis conforme o tipo de numeração.
 * - Int64: end - ini + 1
 * - Composed*: C(max - min + 1, size)
 */
export const computePossibilities = (
  type: NumberType,
  min: number,
  max: number,
  ticketIni?: number,
  ticketEnd?: number,
): number => {
  if (type === NumberType.Int64) {
    const ini = ticketIni ?? 0;
    const end = ticketEnd ?? 0;
    if (end < ini) return 0;
    return end - ini + 1;
  }

  const size = composedSize(type);
  const pool = max - min + 1;
  if (pool < size || size === 0) return 0;
  return binomial(pool, size);
};

/** Exemplos curtos de números válidos para exibir como preview no wizard. */
export const generateExamples = (
  type: NumberType,
  min: number,
  max: number,
  ticketIni?: number,
  ticketEnd?: number,
  count = 3,
): string[] => {
  if (type === NumberType.Int64) {
    const ini = ticketIni ?? 0;
    const end = ticketEnd ?? 0;
    if (end < ini) return [];
    const step = Math.max(1, Math.floor((end - ini + 1) / count));
    return Array.from({ length: count }, (_, i) => formatInt64(ini + i * step));
  }

  const size = composedSize(type);
  const examples: string[] = [];
  for (let e = 0; e < count; e++) {
    const nums = new Set<number>();
    let v = min + e;
    while (nums.size < size && v <= max) {
      nums.add(v);
      v += 1;
    }
    examples.push(
      [...nums]
        .sort((a, b) => a - b)
        .map((n) => String(n).padStart(2, '0'))
        .join('-'),
    );
  }
  return examples;
};
