import { describe, expect, it } from 'vitest';
import { NumberType } from '@/types/enums';
import {
  computePossibilities,
  formatComposed,
  formatInt64,
} from '../numberFormat';

describe('formatInt64', () => {
  it('formata com separador de milhar pt-BR', () => {
    expect(formatInt64(1234567)).toMatch(/1\.234\.567/);
    expect(formatInt64(0)).toBe('0');
  });
});

describe('formatComposed', () => {
  it('ordena ascendentemente dezenas de Composed6', () => {
    expect(formatComposed('60-05-11-39-28-07', NumberType.Composed6)).toBe(
      '05-07-11-28-39-60',
    );
  });

  it('padroniza dezenas com zero à esquerda', () => {
    expect(formatComposed('1-2-3', NumberType.Composed3)).toBe('01-02-03');
  });
});

describe('computePossibilities', () => {
  it('Int64 retorna end - ini + 1', () => {
    expect(computePossibilities(NumberType.Int64, 0, 0, 1, 1000)).toBe(1000);
  });

  it('Composed6 sobre 60 dezenas é C(60,6) = 50063860', () => {
    expect(computePossibilities(NumberType.Composed6, 1, 60)).toBe(50063860);
  });

  it('Composed3 sobre 10 dezenas é C(10,3) = 120', () => {
    expect(computePossibilities(NumberType.Composed3, 1, 10)).toBe(120);
  });

  it('retorna 0 quando pool < size', () => {
    expect(computePossibilities(NumberType.Composed6, 1, 3)).toBe(0);
  });
});
