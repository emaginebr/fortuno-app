import { useEffect } from 'react';
import { useReferral } from '@/hooks/useReferral';
import { CopyableCode } from '@/components/common/CopyableCode';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatBRL } from '@/utils/currency';

export const MyPointsPage = (): JSX.Element => {
  const { panel, loading, loadPanel } = useReferral();

  useEffect(() => {
    void loadPanel();
  }, [loadPanel]);

  if (loading && !panel) return <LoadingSpinner label="Carregando seus pontos..." />;
  if (!panel) return <p className="p-10 text-center">Nenhuma informação disponível.</p>;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl text-fortuno-black">Meus Pontos</h1>

      <section className="mt-6 rounded-xl bg-fortuno-green-deep p-6 text-fortuno-offwhite">
        <p className="text-xs uppercase tracking-wider text-fortuno-gold-soft">
          Seu código de indicação
        </p>
        <div className="mt-2">
          <CopyableCode value={panel.referralCode} />
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-fortuno-black/60">
            Total de indicações
          </p>
          <p className="mt-2 font-display text-4xl text-fortuno-gold-intense">
            {panel.totalPurchases.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-fortuno-black/60">
            Valor a receber
          </p>
          <p className="mt-2 font-display text-4xl text-fortuno-gold-intense">
            {formatBRL(panel.totalToReceive)}
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl text-fortuno-black">Detalhamento por sorteio</h2>
        <div className="mt-4 overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-fortuno-offwhite text-left">
              <tr>
                <th className="px-4 py-3">Sorteio</th>
                <th className="px-4 py-3 text-right">Indicações</th>
                <th className="px-4 py-3 text-right">A receber</th>
              </tr>
            </thead>
            <tbody>
              {panel.byLottery.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-fortuno-black/50" colSpan={3}>
                    Você ainda não tem indicações registradas.
                  </td>
                </tr>
              ) : (
                panel.byLottery.map((row) => (
                  <tr key={row.lotteryId} className="border-t">
                    <td className="px-4 py-3">{row.lotteryName}</td>
                    <td className="px-4 py-3 text-right">{row.purchases}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatBRL(row.toReceive)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-6 rounded-lg bg-fortuno-offwhite p-4 text-xs text-fortuno-black/60">
        {panel.note}
      </p>
    </main>
  );
};
