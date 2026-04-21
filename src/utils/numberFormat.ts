import { NumberType, composedSize } from '@/types/enums';

/** Formata inteiro com separador de milhar pt-BR. */
export const formatInt64 = (n: number): string => n.toLocaleString('pt-BR');

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
