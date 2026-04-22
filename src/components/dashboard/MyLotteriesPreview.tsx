import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Plus } from 'lucide-react';
import type { LotteryInfo } from '@/types/lottery';
import { LotteryRow } from './LotteryRow';

export interface MyLotteriesPreviewProps {
  lotteries: LotteryInfo[];
  /** Máximo de linhas a mostrar no preview (default 3). */
  max?: number;
  className?: string;
  onPublish?: (id: number) => void | Promise<void>;
  onRevertToDraft?: (id: number) => void | Promise<void>;
  onClose?: (id: number) => void | Promise<void>;
  onCancel?: (id: number) => void | Promise<void>;
  onDelete?: (id: number) => void | Promise<void>;
  busy?: boolean;
}

/**
 * Seção "Loterias que você administra" — preview de até `max` itens + CTAs.
 * O caller é responsável por condicionar a renderização (este componente
 * NÃO exibe empty state). Se `lotteries.length === 0`, nada é renderizado.
 */
export const MyLotteriesPreview = ({
  lotteries,
  max = 3,
  className,
  onPublish,
  onRevertToDraft,
  onClose,
  onCancel,
  onDelete,
  busy,
}: MyLotteriesPreviewProps): JSX.Element | null => {
  const { t } = useTranslation();

  if (lotteries.length === 0) return null;

  const visible = lotteries.slice(0, max);
  const hasMore = lotteries.length > max;

  const wrapperClass = [className].filter(Boolean).join(' ');

  const ctaGhost = [
    'inline-flex items-center gap-1.5 px-[18px] py-2.5 rounded-full',
    'bg-transparent text-fortuno-green-elegant',
    'border border-fortuno-green-elegant/25 font-semibold text-[12px]',
    'transition-colors duration-noir-fast',
    'hover:bg-fortuno-gold-intense/10 hover:border-fortuno-gold-intense',
    'focus-visible:outline-none focus-visible:shadow-gold-focus',
    'min-h-[40px]',
  ].join(' ');

  const ctaPrimary = [
    'inline-flex items-center gap-2 px-5 py-2.5 rounded-full',
    'bg-fortuno-gold-intense text-fortuno-black font-bold text-[13px] tracking-wide',
    'shadow-[0_8px_22px_-6px_rgba(212,175,55,0.45),0_1px_0_rgba(255,255,255,0.35)_inset]',
    'transition-all duration-noir-fast',
    'hover:bg-fortuno-gold-soft hover:-translate-y-px',
    'focus-visible:outline-none focus-visible:shadow-gold-focus',
    'min-h-[40px]',
  ].join(' ');

  return (
    <section aria-labelledby="my-lotteries-title" className={wrapperClass}>
      <header className="flex items-start md:items-center justify-between gap-3 flex-col md:flex-row mb-4">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h2
            id="my-lotteries-title"
            className="font-display text-fortuno-black text-[clamp(20px,2.2vw,26px)] leading-tight"
          >
            {t('dashboard.myLotteriesTitlePrefix')}{' '}
            <span className="italic">{t('dashboard.myLotteriesTitleSuffix')}</span>
          </h2>
          <span className="text-xs text-fortuno-black/50">
            ·{' '}
            <strong className="font-semibold text-fortuno-black/80">
              {lotteries.length}
            </strong>{' '}
            {t('dashboard.myLotteriesCountSuffix')}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/meus-sorteios" className={ctaGhost}>
            {t('dashboard.myLotteriesViewAll')}
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
          <Link to="/meus-sorteios/novo" className={ctaPrimary}>
            <Plus className="w-4 h-4" aria-hidden="true" />
            {t('dashboard.myLotteriesNew')}
          </Link>
        </div>
      </header>

      <ul className="flex flex-col gap-2.5" role="list">
        {visible.map((lottery) => (
          <LotteryRow
            key={lottery.lotteryId}
            lottery={lottery}
            onPublish={onPublish}
            onRevertToDraft={onRevertToDraft}
            onClose={onClose}
            onCancel={onCancel}
            onDelete={onDelete}
            busy={busy}
          />
        ))}
      </ul>

      {hasMore && (
        <div className="mt-4 text-center md:text-right">
          <Link
            to="/meus-sorteios"
            className={[
              'inline-flex items-center gap-1.5 text-sm text-fortuno-gold-intense',
              'hover:text-fortuno-green-elegant font-semibold transition-colors',
              'focus-visible:outline-none focus-visible:shadow-gold-focus rounded-full px-2 py-1',
            ].join(' ')}
          >
            {t('dashboard.myLotteriesViewAllCount', { total: lotteries.length })}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  );
};
