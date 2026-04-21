const BRL_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export const formatBRL = (value: number): string => BRL_FORMATTER.format(value);

export const formatPercent = (value: number, fractionDigits = 1): string =>
  `${value.toLocaleString('pt-BR', { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits })}%`;
