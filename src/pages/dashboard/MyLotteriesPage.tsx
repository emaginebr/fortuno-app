import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLottery } from '@/hooks/useLottery';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { LOTTERY_STATUS_LABEL, LotteryStatus } from '@/types/enums';
import { formatBRL } from '@/utils/currency';

export const MyLotteriesPage = (): JSX.Element => {
  const { myLotteries, loading, loadByStore, publish, close, cancel } = useLottery();
  const [filter, setFilter] = useState<LotteryStatus | 'all'>('all');
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const storeId = Number(import.meta.env.VITE_FORTUNO_STORE_ID || 1);
    void loadByStore(storeId);
  }, [loadByStore]);

  const ordered = useMemo(() => {
    const sorted = [...myLotteries].sort((a, b) => {
      if (a.status === LotteryStatus.Open && b.status !== LotteryStatus.Open) return -1;
      if (b.status === LotteryStatus.Open && a.status !== LotteryStatus.Open) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    if (filter === 'all') return sorted;
    return sorted.filter((l) => l.status === filter);
  }, [myLotteries, filter]);

  if (loading && myLotteries.length === 0) return <LoadingSpinner label="Carregando seus sorteios..." />;

  const handleCancel = async (): Promise<void> => {
    if (!cancelId || cancelReason.trim().length < 10) return;
    setBusy(true);
    const ok = await cancel(cancelId, { reason: cancelReason.trim() });
    setBusy(false);
    if (ok) {
      setCancelId(null);
      setCancelReason('');
      const storeId = Number(import.meta.env.VITE_FORTUNO_STORE_ID || 1);
      await loadByStore(storeId);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-fortuno-black">Meus Sorteios</h1>
        <Link to="/meus-sorteios/novo" className="btn-primary">
          Novo sorteio
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(['all', LotteryStatus.Open, LotteryStatus.Draft, LotteryStatus.Closed, LotteryStatus.Cancelled] as const).map(
          (status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                filter === status
                  ? 'bg-fortuno-gold-intense text-fortuno-black'
                  : 'bg-white text-fortuno-black/70 hover:bg-fortuno-offwhite'
              }`}
            >
              {status === 'all' ? 'Todos' : LOTTERY_STATUS_LABEL[status]}
            </button>
          ),
        )}
      </div>

      {ordered.length === 0 ? (
        <p className="mt-12 text-center text-fortuno-black/60">Nenhum sorteio encontrado.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {ordered.map((lottery) => (
            <div
              key={lottery.lotteryId}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-white p-5 shadow-sm"
            >
              <div>
                <p className="font-display text-xl">{lottery.name}</p>
                <p className="text-sm text-fortuno-black/60">
                  Status:{' '}
                  <span className="font-semibold">
                    {LOTTERY_STATUS_LABEL[lottery.status]}
                  </span>{' '}
                  · Prêmio: <span>{formatBRL(lottery.totalPrizeValue)}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/meus-sorteios/${lottery.lotteryId}/editar`}
                  className="btn-secondary text-xs"
                >
                  Editar
                </Link>
                {lottery.status === LotteryStatus.Draft ? (
                  <button
                    type="button"
                    onClick={() => void publish(lottery.lotteryId).then(() => loadByStore(lottery.storeId))}
                    className="btn-primary text-xs"
                  >
                    Publicar
                  </button>
                ) : null}
                {lottery.status === LotteryStatus.Open ? (
                  <button
                    type="button"
                    onClick={() => void close(lottery.lotteryId).then(() => loadByStore(lottery.storeId))}
                    className="btn-secondary text-xs"
                  >
                    Encerrar
                  </button>
                ) : null}
                {[LotteryStatus.Open, LotteryStatus.Draft].includes(lottery.status) ? (
                  <button
                    type="button"
                    onClick={() => setCancelId(lottery.lotteryId)}
                    className="rounded-md border border-red-600 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                  >
                    Cancelar
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={cancelId !== null}
        title="Cancelar sorteio"
        message="Informe um motivo para o cancelamento. Essa ação não pode ser desfeita."
        confirmLabel="Cancelar sorteio"
        variant="danger"
        busy={busy}
        onCancel={() => {
          setCancelId(null);
          setCancelReason('');
        }}
        onConfirm={handleCancel}
      >
        <textarea
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Descreva o motivo (mínimo 10 caracteres)"
          className="w-full rounded-md border border-fortuno-black/20 p-3"
          rows={4}
        />
      </ConfirmModal>
    </main>
  );
};
