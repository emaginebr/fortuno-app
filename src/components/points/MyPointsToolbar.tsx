import { useTranslation } from 'react-i18next';
import { ArrowDownUp, CalendarRange, ChevronDown, Share2, Trophy } from 'lucide-react';
import type { ReferrerLotteryBreakdown } from '@/types/referral';

export type LotteryFilter = number | 'all';
export type PeriodFilter = 'all' | '30' | '90' | 'year';
export type SortOption = 'points' | 'purchases' | 'recent';

export interface MyPointsToolbarProps {
  totalPurchases: number;
  totalPoints: number;
  lotteries: ReferrerLotteryBreakdown[];
  lotteryFilter: LotteryFilter;
  periodFilter: PeriodFilter;
  sort: SortOption;
  onChangeLottery: (id: LotteryFilter) => void;
  onChangePeriod: (p: PeriodFilter) => void;
  onChangeSort: (s: SortOption) => void;
  onShare: () => void;
}

export const MyPointsToolbar = ({
  totalPurchases,
  totalPoints,
  lotteries,
  lotteryFilter,
  periodFilter,
  sort,
  onChangeLottery,
  onChangePeriod,
  onChangeSort,
  onShare,
}: MyPointsToolbarProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="my-points-title">
      <div className="points-toolbar">
        <div className="flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row">
          <div className="min-w-0">
            <span className="mp-eyebrow gold">{t('myPoints.eyebrow')}</span>
            <h2 id="my-points-title" className="toolbar-title mt-1">
              {t('myPoints.titleStart')}{' '}
              <span className="italic-gold">{t('myPoints.titleEnd')}</span>
              <span className="toolbar-counter">
                {' · '}
                <strong>{totalPurchases.toLocaleString('pt-BR')}</strong>{' '}
                {t('myPoints.referralsLabel')}
                {' · '}
                <strong>{totalPoints.toLocaleString('pt-BR')}</strong> pts
              </span>
            </h2>
            <p className="toolbar-subhead">
              {t('myPoints.subhead')} <em>{t('myPoints.subheadEm')}</em>{' '}
              {t('myPoints.subheadRest')}
            </p>
          </div>
          <button
            type="button"
            onClick={onShare}
            className="mp-cta-primary self-start lg:self-auto"
            aria-label={t('myPoints.shareCtaAria')}
          >
            <Share2 className="w-[15px] h-[15px]" />
            {t('myPoints.shareCta')}
          </button>
        </div>

        <div className="mp-filter-pills mp-filter-pills-scroll mt-5">
          <label
            className={
              lotteryFilter !== 'all' ? 'mp-filter-pill is-active' : 'mp-filter-pill'
            }
            htmlFor="mp-filter-lottery"
          >
            <Trophy className="pill-icon" />
            <span className="flex flex-col leading-tight">
              <span className="pill-label">{t('myPoints.filters.lottery')}</span>
              <select
                id="mp-filter-lottery"
                className="pill-native-select"
                value={String(lotteryFilter)}
                onChange={(e) =>
                  onChangeLottery(
                    e.target.value === 'all' ? 'all' : Number(e.target.value),
                  )
                }
                aria-label={t('myPoints.filters.lotteryAria')}
              >
                <option value="all">{t('myPoints.filters.allLotteries')}</option>
                {lotteries.map((l) => (
                  <option key={l.lotteryId} value={l.lotteryId}>
                    {l.lotteryName}
                  </option>
                ))}
              </select>
            </span>
            <ChevronDown className="pill-chevron" />
          </label>

          <label className="mp-filter-pill" htmlFor="mp-filter-period">
            <CalendarRange className="pill-icon" />
            <span className="flex flex-col leading-tight">
              <span className="pill-label">
                {t('myPoints.filters.period')}
                <span className="toolbar-mock-tag" title={t('myPoints.mockTooltip')}>
                  {t('myPoints.mockTag')}
                </span>
              </span>
              <select
                id="mp-filter-period"
                className="pill-native-select"
                value={periodFilter}
                onChange={(e) => onChangePeriod(e.target.value as PeriodFilter)}
                aria-label={t('myPoints.filters.periodAria')}
              >
                <option value="all">{t('myPoints.filters.periodAll')}</option>
                <option value="30">{t('myPoints.filters.period30')}</option>
                <option value="90">{t('myPoints.filters.period90')}</option>
                <option value="year">{t('myPoints.filters.periodYear')}</option>
              </select>
            </span>
            <ChevronDown className="pill-chevron" />
          </label>

          <label className="mp-filter-pill" htmlFor="mp-filter-sort">
            <ArrowDownUp className="pill-icon" />
            <span className="flex flex-col leading-tight">
              <span className="pill-label">{t('myPoints.filters.sort')}</span>
              <select
                id="mp-filter-sort"
                className="pill-native-select"
                value={sort}
                onChange={(e) => onChangeSort(e.target.value as SortOption)}
                aria-label={t('myPoints.filters.sortAria')}
              >
                <option value="points">{t('myPoints.filters.sortPoints')}</option>
                <option value="purchases">{t('myPoints.filters.sortPurchases')}</option>
                <option value="recent">{t('myPoints.filters.sortRecent')}</option>
              </select>
            </span>
            <ChevronDown className="pill-chevron" />
          </label>
        </div>
      </div>
    </section>
  );
};
