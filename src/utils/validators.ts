import {
  validateEmail,
  validateCPF,
  validateCNPJ,
  validatePhone,
  validatePasswordStrength,
} from 'nauth-react';
import { NumberType, composedSize } from '@/types/enums';

export { validateEmail, validateCPF, validateCNPJ, validatePhone, validatePasswordStrength };

export interface NumberValidation {
  valid: boolean;
  reason?: string;
}

interface LotteryLike {
  numberType: NumberType;
  ticketNumIni: number;
  ticketNumEnd: number;
  numberValueMin: number;
  numberValueMax: number;
}

/**
 * Valida a entrada de número do usuário **antes** de enviar ao backend.
 * Faz checagens equivalentes às do `NumberCompositionService` do backend
 * (range, quantidade de componentes, duplicatas) — o backend continua sendo
 * a fonte de verdade e rejeita qualquer payload inválido via 400.
 *
 * Aceita `string | number` por compatibilidade com callers antigos, mas
 * o fluxo novo deve passar sempre string no formato canônico.
 */
export const validatePickedNumber = (
  raw: string | number,
  lottery: LotteryLike,
): NumberValidation => {
  if (lottery.numberType === NumberType.Int64) {
    const n = typeof raw === 'string' ? Number(raw.replace(/\D/g, '')) : raw;
    if (Number.isNaN(n)) {
      return { valid: false, reason: 'Informe um número inteiro válido.' };
    }
    if (n < lottery.ticketNumIni || n > lottery.ticketNumEnd) {
      return {
        valid: false,
        reason: `Número fora da faixa (${lottery.ticketNumIni}–${lottery.ticketNumEnd}).`,
      };
    }
    return { valid: true };
  }

  const size = composedSize(lottery.numberType);
  if (size === 0) {
    return { valid: false, reason: 'Tipo de número não suportado.' };
  }

  const parts = String(raw)
    .split(/[-\s,]+/)
    .map((p) => p.replace(/\D/g, ''))
    .filter(Boolean);

  if (parts.length !== size) {
    return {
      valid: false,
      reason: `Informe exatamente ${size} dezenas.`,
    };
  }

  const values = parts.map((p) => Number(p));
  if (values.some((v) => Number.isNaN(v))) {
    return { valid: false, reason: 'Informe apenas números.' };
  }
  if (new Set(values).size !== values.length) {
    return { valid: false, reason: 'Dezenas não podem se repetir.' };
  }
  if (values.some((v) => v < lottery.numberValueMin || v > lottery.numberValueMax)) {
    return {
      valid: false,
      reason: `Dezenas devem estar entre ${lottery.numberValueMin} e ${lottery.numberValueMax}.`,
    };
  }

  return { valid: true };
};
