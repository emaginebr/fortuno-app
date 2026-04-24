import { describe, expect, it } from 'vitest';
import { NumberType } from '@/types/enums';
import {
  componentCountFromNumberType,
  computePossibilities,
  formatComposed,
  formatInt64,
  normalizeTicketNumber,
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

describe('componentCountFromNumberType', () => {
  it('retorna 1 para Int64', () => {
    expect(componentCountFromNumberType(NumberType.Int64)).toBe(1);
  });

  it('retorna a quantidade de componentes esperada para Composed', () => {
    expect(componentCountFromNumberType(NumberType.Composed3)).toBe(3);
    expect(componentCountFromNumberType(NumberType.Composed6)).toBe(6);
    expect(componentCountFromNumberType(NumberType.Composed8)).toBe(8);
  });
});

describe('normalizeTicketNumber', () => {
  it('Int64 aceita decimal puro e retorna como-é', () => {
    expect(normalizeTicketNumber('42', 1)).toBe('42');
    expect(normalizeTicketNumber('  1000  ', 1)).toBe('1000');
  });

  it('Int64 rejeita input não-numérico', () => {
    expect(normalizeTicketNumber('abc', 1)).toBeNull();
    expect(normalizeTicketNumber('1-2', 1)).toBeNull();
  });

  it('Composed ordena componentes e aplica zero-pad', () => {
    expect(normalizeTicketNumber('60-39-05-28-11', 5)).toBe('05-11-28-39-60');
    expect(normalizeTicketNumber('5-11-28-39-60', 5)).toBe('05-11-28-39-60');
  });

  it('Composed rejeita quando algum componente está fora de [0..99]', () => {
    expect(normalizeTicketNumber('05-100-28', 3)).toBeNull();
    expect(normalizeTicketNumber('05-11-abc', 3)).toBeNull();
  });

  it('Composed rejeita quantidade de componentes incorreta', () => {
    expect(normalizeTicketNumber('05-11', 3)).toBeNull();
    expect(normalizeTicketNumber('05-11-28-39', 3)).toBeNull();
  });
});
