import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ArrowRight, Check, Copy, Hash, Sparkles } from 'lucide-react';

interface ReferralVariantProps {
  variant: 'referral';
  code: string;
}

interface PointsVariantProps {
  variant: 'points';
  /** Inteiro de pontos acumulados. Fallback 0 enquanto o backend não expõe. */
  points: number;
  /**
   * Quando true, renderiza um span "Aqui" com aria-current="page" no lugar do
   * link "Extrato". Usado em /meus-pontos para evitar auto-loop de navegação.
   */
  currentPage?: boolean;
}

export type HeaderChipProps = ReferralVariantProps | PointsVariantProps;

const WRAPPER_CLASS = [
  'relative inline-flex items-center gap-2.5 pl-[14px] pr-2.5 py-2',
  'rounded-[14px] bg-chip-glass border backdrop-blur-md',
  'transition-colors duration-noir-base',
  'min-h-[56px] w-full lg:w-auto',
  'border-[color:var(--chip-glass-border)]',
  'hover:border-[color:var(--chip-glass-border-hover)]',
].join(' ');

const LEAD_CLASS = [
  'w-8 h-8 rounded-[10px] grid place-items-center shrink-0',
  'bg-[color:var(--chip-lead-bg)] border border-[color:var(--chip-lead-border)]',
  'text-fortuno-gold-soft',
].join(' ');

const LABEL_CLASS = [
  'block text-[9px] font-semibold tracking-[0.26em] uppercase leading-none',
  'text-fortuno-offwhite/65',
].join(' ');

const VALUE_CLASS = [
  'block font-display font-bold text-[22px] leading-[1.05]',
  'text-fortuno-gold-soft tabular-nums mt-[3px]',
  'truncate',
].join(' ');

/**
 * Chip glass unificado do header do dashboard.
 * - `variant="referral"`: mostra o código + botão copy (icon-only).
 * - `variant="points"`: mostra o saldo de pontos + CTA "Extrato" para /meus-pontos.
 */
export const HeaderChip = (props: HeaderChipProps): JSX.Element => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  if (props.variant === 'referral') {
    const { code } = props;

    const handleCopy = async (): Promise<void> => {
      try {
        await navigator.clipboard.writeText(code);
        toast.success(t('common.copied'));
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error(t('common.error'));
      }
    };

    const labelId = 'header-chip-referral-label';

    return (
      <div className={WRAPPER_CLASS} role="group" aria-labelledby={labelId}>
        <div className={LEAD_CLASS} aria-hidden="true">
          <Hash className="w-4 h-4" />
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <span id={labelId} className={LABEL_CLASS}>
            {t('dashboard.referralChipLabel')}
          </span>
          <span className={VALUE_CLASS} aria-live="polite">
            {code}
          </span>
        </div>

        <button
          type="button"
          onClick={() => void handleCopy()}
          className={[
            'inline-flex items-center justify-center w-8 h-8 rounded-full shrink-0',
            'bg-[color:var(--chip-action-bg)] border border-[color:var(--chip-action-border)]',
            'text-fortuno-gold-soft transition-all duration-noir-fast',
            'hover:bg-fortuno-gold-soft hover:text-fortuno-black hover:rotate-[8deg] hover:scale-110',
            'focus-visible:outline-none focus-visible:shadow-gold-focus',
          ].join(' ')}
          aria-label={t('dashboard.referralCopyAria', { code })}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 animate-check-bounce" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    );
  }

  // variant === 'points'
  const { points, currentPage = false } = props;
  const labelId = 'header-chip-points-label';
  const formatted = points.toLocaleString('pt-BR');

  return (
    <div className={WRAPPER_CLASS} role="group" aria-labelledby={labelId}>
      <div className={LEAD_CLASS} aria-hidden="true">
        <Sparkles className="w-4 h-4" />
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <span id={labelId} className={LABEL_CLASS}>
          {t('dashboard.pointsChipLabel')}
        </span>
        <span
          className={VALUE_CLASS}
          aria-label={t('dashboard.pointsAria', { value: formatted })}
        >
          {formatted}
          <span
            className={[
              'text-[11px] font-sans font-semibold tracking-[0.12em] uppercase',
              'text-fortuno-gold-intense/75 ml-1 not-italic',
            ].join(' ')}
          >
            pts
          </span>
        </span>
      </div>

      {currentPage ? (
        <span
          className={[
            'chip-action is-current',
            'inline-flex items-center gap-1 px-2.5 h-8 min-w-[44px] rounded-full shrink-0',
            'text-[11px] font-semibold tracking-wide',
          ].join(' ')}
          aria-current="page"
          aria-label={t('myPoints.chipCurrent')}
        >
          <Check className="w-3 h-3" />
          {t('myPoints.chipCurrentLabel')}
        </span>
      ) : (
        <Link
          to="/meus-pontos"
          className={[
            'inline-flex items-center gap-1 px-2.5 h-8 min-w-[44px] rounded-full shrink-0',
            'bg-[color:var(--chip-action-bg)] border border-[color:var(--chip-action-border)]',
            'text-fortuno-gold-soft text-[11px] font-semibold tracking-wide',
            'transition-all duration-noir-fast',
            'hover:bg-fortuno-gold-soft hover:text-fortuno-black hover:-translate-y-px',
            'focus-visible:outline-none focus-visible:shadow-gold-focus',
          ].join(' ')}
          aria-label={t('dashboard.pointsExtractAria')}
        >
          {t('dashboard.pointsExtract')}
          <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
};
