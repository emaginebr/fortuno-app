import { useEffect, useMemo, useState } from 'react';
import { useTicket } from '@/hooks/useTicket';
import { useLottery } from '@/hooks/useLottery';
import { TicketCard } from '@/components/tickets/TicketCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const PAGE_SIZE = 12;

export const MyNumbersPage = (): JSX.Element => {
  const { tickets, loading, loadMine } = useTicket();
  const { openLotteries, loadOpen } = useLottery();
  const [lotteryFilter, setLotteryFilter] = useState<number | ''>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    void loadMine();
    void loadOpen();
  }, [loadMine, loadOpen]);

  useEffect(() => {
    if (lotteryFilter) {
      void loadMine({ lotteryId: lotteryFilter });
    } else {
      void loadMine();
    }
  }, [lotteryFilter, loadMine]);

  const filtered = useMemo(() => {
    if (!search.trim()) return tickets;
    const q = search.trim().toLowerCase();
    return tickets.filter(
      (t) =>
        t.ticketValue.toLowerCase().includes(q) ||
        String(t.ticketNumber).includes(q),
    );
  }, [tickets, search]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const lotteryNameById = useMemo(() => {
    const map = new Map<number, string>();
    openLotteries.forEach((l) => map.set(l.lotteryId, l.name));
    return map;
  }, [openLotteries]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-3xl text-fortuno-black">Meus Números</h1>

      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-semibold" htmlFor="lottery-filter">
            Sorteio
          </label>
          <select
            id="lottery-filter"
            value={lotteryFilter}
            onChange={(e) =>
              setLotteryFilter(e.target.value ? Number(e.target.value) : '')
            }
            className="mt-1 w-full rounded-md border border-fortuno-black/20 px-3 py-2"
          >
            <option value="">Todos os sorteios</option>
            {openLotteries.map((l) => (
              <option key={l.lotteryId} value={l.lotteryId}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-semibold" htmlFor="number-search">
            Buscar número
          </label>
          <input
            id="number-search"
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Digite um número ou parte dele"
            className="mt-1 w-full rounded-md border border-fortuno-black/20 px-3 py-2"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Carregando seus bilhetes..." />
      ) : filtered.length === 0 ? (
        <p className="mt-10 text-center text-fortuno-black/60">
          Nenhum bilhete encontrado.
        </p>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginated.map((t) => (
              <TicketCard
                key={t.ticketId}
                ticket={t}
                lotteryName={lotteryNameById.get(t.lotteryId)}
              />
            ))}
          </div>

          {totalPages > 1 ? (
            <nav className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="px-3 text-sm">
                Página {page} de {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary disabled:opacity-40"
              >
                Próxima
              </button>
            </nav>
          ) : null}
        </>
      )}
    </main>
  );
};
