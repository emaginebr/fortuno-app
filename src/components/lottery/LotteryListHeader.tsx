import { Trophy, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatBRL } from '@/utils/currency';

export type LotteryListSort = 'prize-desc' | 'prize-asc' | 'recent';

export interface LotteryListHeaderProps {
  totalLotteries: number;
  totalPrize: number;
  shownCount: number;
  currentPage: number;
  totalPages: number;
  sort: LotteryListSort;
  onSortChange: (next: LotteryListSort) => void;
}

export const LotteryListHeader = ({
  totalLotteries,
  totalPrize,
  shownCount,
  currentPage,
  totalPages,
  sort,
  onSortChange,
}: LotteryListHeaderProps): JSX.Element => {
  const { t } = useTranslation();

  const countLabel = t('lotteryList.subheadCount', { count: totalLotteries });

  return (
    <section
      aria-labelledby="list-title"
      className="mx-auto max-w-7xl px-6 pt-10 md:pt-16 pb-4"
    >
      {/* Ornamento art déco */}
      <div className="list-ornament mb-4" aria-hidden="true">
        <span className="diamond" />
      </div>

      <div className="text-center">
        <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase text-fortuno-gold-intense font-semibold mb-3">
          <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
          {t('lotteryList.eyebrow')}
        </span>

        <h1
          id="list-title"
          className="font-display font-bold leading-[1.05] tracking-[-0.02em] text-fortuno-black text-[clamp(34px,4.5vw,56px)]"
          aria-live="polite"
          aria-atomic="true"
        >
          {t('lotteryList.title')}
        </h1>

        <p className="text-fortuno-black/70 mt-3 text-base md:text-lg max-w-2xl mx-auto">
          <strong className="text-fortuno-green-elegant font-semibold">{countLabel}</strong>
          {' · '}
          {t('lotteryList.subheadPrize')}{' '}
          <strong className="text-fortuno-green-elegant font-semibold">
            {formatBRL(totalPrize)}
          </strong>
          {'. '}
          {t('lotteryList.subheadInvitation')}
        </p>

        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {t('lotteryList.pageAnnounce', {
            page: currentPage,
            total: totalPages,
            shown: shownCount,
          })}
        </span>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">
        <div className="text-sm text-fortuno-black/60">
          {t('lotteryList.showing')}{' '}
          <strong className="text-fortuno-green-elegant font-semibold">
            {t('lotteryList.showingCount', {
              shown: shownCount,
              total: totalLotteries,
            })}
          </strong>{' '}
          {t('lotteryList.showingTrailing')}
        </div>

        <label className="sort-chip cursor-pointer">
          <span className="label">{t('lotteryList.sortLabel')}</span>
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as LotteryListSort)}
            aria-label={t('lotteryList.sortAria')}
          >
            <option value="prize-desc">{t('lotteryList.sortPrizeDesc')}</option>
            <option value="prize-asc">{t('lotteryList.sortPrizeAsc')}</option>
            <option value="recent">{t('lotteryList.sortRecent')}</option>
          </select>
          <ChevronDown
            className="w-4 h-4 text-fortuno-gold-intense"
            aria-hidden="true"
          />
        </label>
      </div>
    </section>
  );
};
