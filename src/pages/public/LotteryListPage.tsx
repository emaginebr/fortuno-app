import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLottery } from '@/hooks/useLottery';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatBRL } from '@/utils/currency';

export const LotteryListPage = (): JSX.Element => {
  const { openLotteries, loading, loadOpen } = useLottery();

  useEffect(() => {
    void loadOpen();
  }, [loadOpen]);

  if (loading && openLotteries.length === 0) {
    return <LoadingSpinner label="Carregando sorteios..." />;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="font-display text-4xl text-fortuno-black">Sorteios em andamento</h1>
        <p className="mt-2 text-fortuno-black/70">
          Escolha uma das loterias abaixo e concorra a prêmios reais.
        </p>
      </header>

      {openLotteries.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-fortuno-black/60">
          Nenhum sorteio em andamento no momento. Volte em breve.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {openLotteries.map((lottery) => {
            const cover = lottery.images?.[0]?.imageUrl;
            return (
              <Link
                key={lottery.lotteryId}
                to={`/sorteios/${lottery.slug}`}
                className="group overflow-hidden rounded-xl border border-fortuno-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-video bg-fortuno-green-deep">
                  {cover ? (
                    <img src={cover} alt={lottery.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-fortuno-gold-soft">
                      <span className="font-display text-5xl">🎟</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="font-display text-xl text-fortuno-black">{lottery.name}</h2>
                  <p className="mt-2 text-sm text-fortuno-black/70">
                    Prêmio total:{' '}
                    <strong className="text-fortuno-gold-intense">
                      {formatBRL(lottery.totalPrizeValue)}
                    </strong>
                  </p>
                  <p className="mt-1 text-sm text-fortuno-black/70">
                    Bilhete a partir de{' '}
                    <strong>{formatBRL(lottery.ticketPrice)}</strong>
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 font-semibold text-fortuno-gold-intense group-hover:underline">
                    Ver sorteio →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};
