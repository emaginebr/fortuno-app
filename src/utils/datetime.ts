const WEEKDAY_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
});

const TIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const SHORT_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
});

const capitalize = (s: string): string => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/**
 * Formata uma data ISO em formato extenso pt-BR.
 * Ex.: "Sábado, 17 de maio · 20h00"
 */
export const formatDateExtensive = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const datePart = WEEKDAY_FORMATTER.format(date);
  const timePart = TIME_FORMATTER.format(date).replace(':', 'h');
  return `${capitalize(datePart)} · ${timePart}`;
};

/**
 * Formata uma data ISO em formato curto pt-BR.
 * Ex.: "17 de mai"
 */
export const formatDateShort = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return SHORT_FORMATTER.format(date).replace('.', '');
};

/**
 * Retorna apenas o horário (HH:mm) de uma data ISO.
 */
export const formatTime = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return TIME_FORMATTER.format(date);
};
