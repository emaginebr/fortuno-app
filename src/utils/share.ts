/**
 * Helpers de compartilhamento do programa de indicação Fortuno.
 *
 * A URL de referência deriva de `import.meta.env.VITE_SITE_URL` (prefixo VITE_
 * obrigatório — vide CLAUDE.md). Fallback determinístico em produção:
 * `https://fortuno.com.br`.
 */

const RAW_SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://fortuno.com.br';

const SITE_URL = RAW_SITE_URL.replace(/\/$/, '');

export const getReferralLink = (code: string): string =>
  `${SITE_URL}/?ref=${encodeURIComponent(code)}`;

export const whatsappShareHref = (text: string): string =>
  `https://wa.me/?text=${encodeURIComponent(text)}`;

export const copyToClipboard = async (value: string): Promise<void> => {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    throw new Error('Clipboard API indisponível');
  }
  await navigator.clipboard.writeText(value);
};
