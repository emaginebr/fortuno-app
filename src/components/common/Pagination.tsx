import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface PaginationProps {
  /** página atual, 1-indexed */
  currentPage: number;
  /** total de páginas (>= 1) */
  totalPages: number;
  /** handler chamado com a próxima página */
  onPageChange: (page: number) => void;
  /** aria-label do <nav> pai; default via i18n */
  ariaLabel?: string;
  /** sibling count para algoritmo de janela — default 1 */
  siblingCount?: number;
  className?: string;
}

type PageToken = number | 'ellipsis-left' | 'ellipsis-right';

/**
 * Algoritmo de janela com elipses.
 * - `total <= 7` (ou menor que `siblingCount * 2 + 5`) → mostra todas.
 * - Caso contrário, mostra `1`, a janela `page ± siblingCount`, `totalPages`
 *   e insere `…` nos buracos.
 */
const getPagesToShow = (
  page: number,
  totalPages: number,
  siblingCount = 1,
): PageToken[] => {
  const totalNumbers = siblingCount * 2 + 5;
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const tokens: PageToken[] = [1];
  if (showLeftEllipsis) tokens.push('ellipsis-left');
  for (let i = leftSibling; i <= rightSibling; i += 1) {
    if (i !== 1 && i !== totalPages) tokens.push(i);
  }
  if (showRightEllipsis) tokens.push('ellipsis-right');
  if (totalPages > 1) tokens.push(totalPages);
  return tokens;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  ariaLabel,
  siblingCount = 1,
  className = '',
}: PaginationProps): JSX.Element | null => {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const canPrev = safePage > 1;
  const canNext = safePage < totalPages;
  const tokens = getPagesToShow(safePage, totalPages, siblingCount);

  const go = (next: number): void => {
    if (next < 1 || next > totalPages || next === safePage) return;
    onPageChange(next);
  };

  return (
    <nav
      aria-label={ariaLabel ?? t('pagination.navAria')}
      className={`mx-auto max-w-7xl px-6 pt-4 pb-16 flex flex-col items-center gap-4 ${className}`.trim()}
    >
      {/* Desktop / tablet */}
      <div
        className="pagination-pill hidden sm:inline-flex"
        role="group"
        aria-label={t('pagination.groupAria')}
      >
        <button
          type="button"
          className="pagination-chip arrow"
          disabled={!canPrev}
          onClick={() => go(safePage - 1)}
          aria-label={t('pagination.previous')}
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          <span>{t('pagination.previous')}</span>
        </button>

        {tokens.map((token) => {
          if (token === 'ellipsis-left' || token === 'ellipsis-right') {
            return (
              <span
                key={token}
                aria-hidden="true"
                className="pagination-ellipsis"
              >
                …
              </span>
            );
          }

          const isActive = token === safePage;
          return (
            <button
              key={token}
              type="button"
              className="pagination-chip"
              onClick={() => go(token)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={
                isActive
                  ? t('pagination.currentAria', { page: token })
                  : t('pagination.goToAria', { page: token })
              }
            >
              {token}
            </button>
          );
        })}

        <button
          type="button"
          className="pagination-chip arrow"
          disabled={!canNext}
          onClick={() => go(safePage + 1)}
          aria-label={t('pagination.next')}
        >
          <span>{t('pagination.next')}</span>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile — Anterior + "Página X de Y" + Próxima */}
      <div className="sm:hidden flex items-center gap-3 flex-wrap justify-center">
        <button
          type="button"
          className="pagination-chip arrow"
          disabled={!canPrev}
          onClick={() => go(safePage - 1)}
          aria-label={t('pagination.previous')}
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>

        <div
          role="status"
          aria-live="polite"
          className="pagination-mobile"
        >
          {t('pagination.ofLabelPrefix')}{' '}
          <span className="current">{safePage}</span>{' '}
          {t('pagination.ofLabelMiddle')}{' '}
          <span className="current">{totalPages}</span>
        </div>

        <button
          type="button"
          className="pagination-chip arrow"
          disabled={!canNext}
          onClick={() => go(safePage + 1)}
          aria-label={t('pagination.next')}
        >
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};
