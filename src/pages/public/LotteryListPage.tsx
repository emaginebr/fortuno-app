import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLottery } from '@/hooks/useLottery';
import { LotteryCardPremium } from '@/components/lottery/LotteryCardPremium';
import {
  LotteryListHeader,
  type LotteryListSort,
} from '@/components/lottery/LotteryListHeader';
import { LotteryCardSkeleton } from '@/components/lottery/LotteryCardSkeleton';
import { LotteryEmptyState } from '@/components/lottery/LotteryEmptyState';
import { Pagination } from '@/components/common/Pagination';
import type { LotteryInfo } from '@/types/lottery';

const PAGE_SIZE = 9; // 3x3 em desktop, 2 col tablet, 1 col mobile
const SKELETON_COUNT = 6; // exibidos durante o primeiro load

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const LotteryListPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { openLotteries, loading, loadOpen } = useLottery();
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<LotteryListSort>('prize-desc');

  useEffect(() => {
    void loadOpen();
  }, [loadOpen]);

  // Reset página ao 1 quando o tamanho da lista muda (primeiro load ou refresh).
  useEffect(() => {
    setCurrentPage(1);
  }, [openLotteries.length]);

  // Estatísticas do header — derivadas do array (sem rede extra).
  const stats = useMemo(
    () => ({
      total: openLotteries.length,
      prizeSum: openLotteries.reduce(
        (acc, lot) => acc + (lot.totalPrizeValue ?? 0),
        0,
      ),
    }),
    [openLotteries],
  );

  // Ordenação CLIENT-SIDE (placeholder — ver MOCKS.md para o server-side).
  const sorted = useMemo<LotteryInfo[]>(() => {
    const arr = [...openLotteries];
    if (sort === 'prize-desc') {
      arr.sort((a, b) => (b.totalPrizeValue ?? 0) - (a.totalPrizeValue ?? 0));
    } else if (sort === 'prize-asc') {
      arr.sort((a, b) => (a.totalPrizeValue ?? 0) - (b.totalPrizeValue ?? 0));
    } else if (sort === 'recent') {
      arr.sort((a, b) => {
        const aTs = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTs = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTs - aTs;
      });
    }
    return arr;
  }, [openLotteries, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  const pageSlice = useMemo<LotteryInfo[]>(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, currentPage]);

  const handlePageChange = (next: number): void => {
    setCurrentPage(next);
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  const handleSortChange = (next: LotteryListSort): void => {
    setSort(next);
    setCurrentPage(1);
  };

  const firstLoad = loading && openLotteries.length === 0;

  return (
    <div className="relative">
      <LotteryListHeader
        totalLotteries={stats.total}
        totalPrize={stats.prizeSum}
        shownCount={pageSlice.length}
        currentPage={currentPage}
        totalPages={totalPages}
        sort={sort}
        onSortChange={handleSortChange}
      />

      {firstLoad ? (
        <section
          aria-label={t('lotteryList.loadingAria')}
          className="mx-auto max-w-7xl px-6 pt-8 pb-12"
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <LotteryCardSkeleton key={i} />
            ))}
          </div>
        </section>
      ) : openLotteries.length === 0 ? (
        <section className="mx-auto max-w-7xl px-6 pt-8 pb-16">
          <LotteryEmptyState />
        </section>
      ) : (
        <>
          <section
            aria-label={t('lotteryList.gridAria')}
            className="mx-auto max-w-7xl px-6 pt-8 pb-12"
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageSlice.map((lottery) => (
                <LotteryCardPremium
                  key={lottery.lotteryId}
                  lottery={lottery}
                  variant="grid"
                  showCalendarChip
                />
              ))}
            </div>
          </section>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            ariaLabel={t('lotteryList.paginationAria')}
          />
        </>
      )}
    </div>
  );
};
