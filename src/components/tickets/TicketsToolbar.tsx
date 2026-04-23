import { type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpDown,
  Eraser,
  Hash,
  Search,
  Tag,
  Trophy,
  TicketPlus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LotteryInfo } from '@/types/lottery';

export type TicketsSort = 'newest' | 'oldest';
export type TicketsStatusFilter = 'all' | 'open' | 'closed' | 'refunded';

export interface TicketsToolbarProps {
  totalCount: number;
  openLotteries: LotteryInfo[];
  /** `null` = todos os sorteios. */
  lotteryFilter: number | null;
  search: string;
  sort: TicketsSort;
  statusFilter: TicketsStatusFilter;
  lotteryContextName?: string;
  hasActiveFilters: boolean;
  onLotteryChange: (id: number | null) => void;
  onSearchChange: (q: string) => void;
  onSortChange: (s: TicketsSort) => void;
  onStatusChange: (s: TicketsStatusFilter) => void;
  onClearFilters: () => void;
}

export const TicketsToolbar = ({
  totalCount,
  openLotteries,
  lotteryFilter,
  search,
  sort,
  statusFilter,
  lotteryContextName,
  hasActiveFilters,
  onLotteryChange,
  onSearchChange,
  onSortChange,
  onStatusChange,
  onClearFilters,
}: TicketsToolbarProps): JSX.Element => {
  const { t } = useTranslation();

  const handleLotteryChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const v = e.target.value;
    onLotteryChange(v === '' ? null : Number(v));
  };
  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    onStatusChange(e.target.value as TicketsStatusFilter);
  };
  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    onSortChange(e.target.value as TicketsSort);
  };

  return (
    <section aria-labelledby="my-numbers-title">
      <div className="tickets-toolbar">
        <div className="flex flex-col md:flex-row md:items-center items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="text-[10px] font-semibold tracking-[0.26em] uppercase text-fortuno-gold-intense">
              {t('myNumbers.eyebrow')}
            </span>
            <h2 id="my-numbers-title" className="toolbar-title mt-1">
              {t('myNumbers.titlePrefix')}{' '}
              <span className="italic">{t('myNumbers.titleEmphasis')}</span>
              <span className="toolbar-counter">
                {' · '}
                <strong>{totalCount}</strong>{' '}
                {totalCount === 1
                  ? t('myNumbers.counterSingular')
                  : t('myNumbers.counterPlural')}
              </span>
            </h2>
            {lotteryContextName ? (
              <span className="toolbar-lottery-context">
                <Trophy aria-hidden="true" />
                {t('myNumbers.lotteryContextPrefix')}{' '}
                <strong>{lotteryContextName}</strong>
              </span>
            ) : null}
          </div>

          <Link
            to="/sorteios"
            className="my-numbers-cta-primary self-start md:self-auto"
            aria-label={t('myNumbers.ctaAria')}
          >
            <TicketPlus aria-hidden="true" />
            {t('myNumbers.cta')}
          </Link>
        </div>

        <div className="filter-pills filter-pills-scroll mt-5">
          {/* Sorteio */}
          <label
            className={`filter-pill ${lotteryFilter !== null ? 'is-active' : ''}`}
          >
            <Trophy className="pill-icon" aria-hidden="true" />
            <span className="pill-label">{t('myNumbers.filters.lotteryLabel')}</span>
            <select
              className="pill-native-select"
              value={lotteryFilter ?? ''}
              onChange={handleLotteryChange}
              aria-label={t('myNumbers.filters.lotteryAria')}
            >
              <option value="">{t('myNumbers.filters.lotteryAll')}</option>
              {openLotteries.map((l) => (
                <option key={l.lotteryId} value={l.lotteryId}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>

          {/* Busca por número */}
          <label
            className={`filter-pill is-search ${search.trim() ? 'is-active' : ''}`}
          >
            <Hash className="pill-icon" aria-hidden="true" />
            <span className="pill-label sr-only">
              {t('myNumbers.filters.searchLabel')}
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('myNumbers.filters.searchPlaceholder')}
              aria-label={t('myNumbers.filters.searchAria')}
            />
            <span className="pill-search-btn" aria-hidden="true">
              <Search />
            </span>
          </label>

          {/* Status */}
          <label
            className={`filter-pill ${statusFilter !== 'all' ? 'is-active' : ''}`}
          >
            <Tag className="pill-icon" aria-hidden="true" />
            <span className="pill-label">{t('myNumbers.filters.statusLabel')}</span>
            <select
              className="pill-native-select"
              value={statusFilter}
              onChange={handleStatusChange}
              aria-label={t('myNumbers.filters.statusAria')}
            >
              <option value="all">{t('myNumbers.filters.statusAll')}</option>
              <option value="open">{t('myNumbers.status.open')}</option>
              <option value="closed">{t('myNumbers.status.closed')}</option>
              <option value="refunded">{t('myNumbers.status.refunded')}</option>
            </select>
          </label>

          {/* Ordenação */}
          <label className={`filter-pill ${sort !== 'newest' ? 'is-active' : ''}`}>
            <ArrowUpDown className="pill-icon" aria-hidden="true" />
            <span className="pill-label">{t('myNumbers.filters.sortLabel')}</span>
            <select
              className="pill-native-select"
              value={sort}
              onChange={handleSortChange}
              aria-label={t('myNumbers.filters.sortAria')}
            >
              <option value="newest">{t('myNumbers.filters.sortNewest')}</option>
              <option value="oldest">{t('myNumbers.filters.sortOldest')}</option>
            </select>
          </label>

          {hasActiveFilters ? (
            <button
              type="button"
              className="toolbar-clear-link"
              onClick={onClearFilters}
            >
              <Eraser aria-hidden="true" />
              {t('myNumbers.filters.clear')}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
};
