import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';
import { useUser } from 'nauth-react';
import { useTicket } from '@/hooks/useTicket';
import { useLottery } from '@/hooks/useLottery';
import { useReferral } from '@/hooks/useReferral';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Pagination } from '@/components/common/Pagination';
import {
  TicketsToolbar,
  type TicketsSort,
  type TicketsStatusFilter,
} from '@/components/tickets/TicketsToolbar';
import { TicketsGrid, TicketsGridSkeleton } from '@/components/tickets/TicketsGrid';
import { TicketCardPremium } from '@/components/tickets/TicketCardPremium';
import { TicketEmptyState } from '@/components/tickets/TicketEmptyState';
import { TicketDetailModal } from '@/components/tickets/TicketDetailModal';
import { TicketRefundState, LotteryStatus } from '@/types/enums';
import type { LotteryInfo } from '@/types/lottery';
import type { TicketInfo } from '@/types/ticket';

const PAGE_SIZE = 12;

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const formatDrawDate = (iso: string | undefined): string | undefined => {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatPrize = (value: number | undefined): string | undefined => {
  if (value == null || value <= 0) return undefined;
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
};

const nextDrawDateFor = (lottery: LotteryInfo | undefined): string | undefined => {
  if (!lottery?.raffles?.length) return undefined;
  const now = Date.now();
  const upcoming = lottery.raffles
    .map((r) => ({ iso: r.raffleDatetime, ts: new Date(r.raffleDatetime).getTime() }))
    .filter((r) => !Number.isNaN(r.ts))
    .sort((a, b) => a.ts - b.ts);
  const future = upcoming.find((r) => r.ts >= now);
  return formatDrawDate((future ?? upcoming[0])?.iso);
};

export const MyNumbersPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { referralCode, panel, loadPanel } = useReferral();
  const { tickets, pagination, loading, loadMine } = useTicket();
  const { openLotteries, loadOpen } = useLottery();

  const [lotteryFilter, setLotteryFilter] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<TicketsSort>('newest');
  const [statusFilter, setStatusFilter] = useState<TicketsStatusFilter>('all');
  const [page, setPage] = useState(1);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  useEffect(() => {
    void loadPanel();
  }, [loadPanel]);

  useEffect(() => {
    void loadOpen();
  }, [loadOpen]);

  // Busca textual é debounced para reduzir chamadas consecutivas enquanto o
  // usuário digita. Envia para o backend via `number` (string unificada que
  // cobre Int64 "42" e Composed "05-11-28-39-60"). Backend normaliza ordem
  // dos componentes — UI pode mandar o que o usuário digitou.
  const [debouncedNumber, setDebouncedNumber] = useState('');
  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedNumber(search.trim()), 300);
    return () => window.clearTimeout(handle);
  }, [search]);

  // Reset página quando a query do servidor muda.
  useEffect(() => {
    setPage(1);
  }, [debouncedNumber]);

  useEffect(() => {
    const query: { lotteryId?: number; number?: string } = {};
    if (lotteryFilter != null) query.lotteryId = lotteryFilter;
    if (debouncedNumber.length > 0) query.number = debouncedNumber;
    void loadMine(
      Object.keys(query).length > 0 ? query : undefined,
      page,
      PAGE_SIZE,
    );
  }, [lotteryFilter, debouncedNumber, page, loadMine]);

  // MOCK: aguarda `panel.totalPoints` — ver MOCKS.md. Trunca totalToReceive p/ int.
  const totalPoints = Math.max(0, Math.floor(panel?.totalToReceive ?? 0));

  // Índices auxiliares por lotteryId a partir de openLotteries.
  const lotteryById = useMemo(() => {
    const m = new Map<number, LotteryInfo>();
    openLotteries.forEach((l) => m.set(l.lotteryId, l));
    return m;
  }, [openLotteries]);

  const filtered = useMemo<TicketInfo[]>(() => {
    let out = tickets;

    const q = search.trim().toLowerCase();
    if (q) {
      out = out.filter(
        (t0) =>
          t0.ticketValue.toLowerCase().includes(q) ||
          String(t0.ticketNumber).includes(q),
      );
    }

    if (statusFilter !== 'all') {
      out = out.filter((t0) => {
        const lottery = lotteryById.get(t0.lotteryId);
        const closed = lottery?.status === LotteryStatus.Closed;
        if (statusFilter === 'refunded')
          return t0.refundState === TicketRefundState.Refunded;
        if (statusFilter === 'closed')
          return closed && t0.refundState !== TicketRefundState.Refunded;
        // open
        return !closed && t0.refundState !== TicketRefundState.Refunded;
      });
    }

    const sorted = [...out].sort((a, b) => {
      const at = new Date(a.createdAt).getTime();
      const bt = new Date(b.createdAt).getTime();
      return sort === 'newest' ? bt - at : at - bt;
    });
    return sorted;
  }, [tickets, search, statusFilter, sort, lotteryById]);

  // Paginação é feita pela API — filtros/buscas/ordenação client-side operam
  // apenas sobre a página atual. Quando o usuário filtra por loteria, a API
  // recebe `lotteryId` e recalcula o total (totalPages reflete o filtro).
  const totalPages = Math.max(1, pagination.totalPages);
  const paginated = filtered;

  // Reset página ao trocar filtro server-side (lotteryId).
  useEffect(() => {
    setPage(1);
  }, [lotteryFilter]);

  const handlePageChange = (next: number): void => {
    setPage(next);
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  const hasActiveFilters =
    lotteryFilter !== null ||
    search.trim() !== '' ||
    sort !== 'newest' ||
    statusFilter !== 'all';

  const handleClearFilters = (): void => {
    setLotteryFilter(null);
    setSearch('');
    setSort('newest');
    setStatusFilter('all');
    setPage(1);
  };

  const lotteryContextName =
    lotteryFilter != null ? lotteryById.get(lotteryFilter)?.name : undefined;

  const selectedTicket = useMemo<TicketInfo | undefined>(
    () =>
      selectedTicketId != null
        ? tickets.find((tk) => tk.ticketId === selectedTicketId)
        : undefined,
    [selectedTicketId, tickets],
  );

  const selectedLottery = selectedTicket
    ? lotteryById.get(selectedTicket.lotteryId)
    : undefined;

  const isFirstLoad = loading && tickets.length === 0;

  return (
    <div className="min-h-screen bg-dash-page text-fortuno-black flex flex-col">
      <DashboardHeader
        user={user}
        referralCode={referralCode}
        totalPoints={totalPoints}
      />

      <main className="relative z-10 mx-auto max-w-7xl w-full px-6 py-8 md:py-10 flex-1">
        <TicketsToolbar
          totalCount={pagination.totalCount}
          openLotteries={openLotteries}
          lotteryFilter={lotteryFilter}
          search={search}
          sort={sort}
          statusFilter={statusFilter}
          lotteryContextName={lotteryContextName}
          hasActiveFilters={hasActiveFilters}
          onLotteryChange={setLotteryFilter}
          onSearchChange={setSearch}
          onSortChange={setSort}
          onStatusChange={setStatusFilter}
          onClearFilters={handleClearFilters}
        />

        <div className="mt-8">
          {isFirstLoad ? (
            <TicketsGridSkeleton count={6} />
          ) : filtered.length === 0 ? (
            <TicketEmptyState
              variant={hasActiveFilters ? 'no-match' : 'no-tickets'}
              onClearFilters={handleClearFilters}
            />
          ) : (
            <>
              <TicketsGrid>
                {paginated.map((tk, i) => {
                  const lottery = lotteryById.get(tk.lotteryId);
                  const drawDate = nextDrawDateFor(lottery);
                  const closed = lottery?.status === LotteryStatus.Closed;
                  return (
                    <TicketCardPremium
                      key={tk.ticketId}
                      ticket={tk}
                      drawDate={drawDate}
                      lotteryClosed={closed}
                      // MOCK: aguarda endpoint de vencedores por sorteio — ver MOCKS.md.
                      isWinner={false}
                      index={i}
                      onClick={() => setSelectedTicketId(tk.ticketId)}
                    />
                  );
                })}
              </TicketsGrid>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                ariaLabel={t('myNumbers.paginationAria')}
                className="mt-10"
              />

              <div className="mt-4 flex justify-center">
                <span className="trust-bar">
                  <ShieldCheck aria-hidden="true" />
                  {t('myNumbers.trustBar')}
                </span>
              </div>
            </>
          )}
        </div>
      </main>

      {selectedTicket ? (
        <TicketDetailModal
          ticket={selectedTicket}
          lotteryName={selectedLottery?.name}
          lotterySlug={selectedLottery?.slug}
          lotteryPrize={formatPrize(selectedLottery?.totalPrizeValue)}
          drawDate={nextDrawDateFor(selectedLottery)}
          lotteryClosed={selectedLottery?.status === LotteryStatus.Closed}
          isWinner={false}
          onClose={() => setSelectedTicketId(null)}
        />
      ) : null}
    </div>
  );
};
