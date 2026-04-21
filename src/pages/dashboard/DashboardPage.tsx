import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from 'nauth-react';
import { useReferral } from '@/hooks/useReferral';
import { useTicket } from '@/hooks/useTicket';
import { useLottery } from '@/hooks/useLottery';
import { CopyableCode } from '@/components/common/CopyableCode';
import { formatBRL } from '@/utils/currency';

export const DashboardPage = (): JSX.Element => {
  const { user } = useUser();
  const { referralCode, panel, loadPanel } = useReferral();
  const { tickets, loadMine } = useTicket();
  const { myLotteries } = useLottery();

  useEffect(() => {
    void loadPanel();
    void loadMine();
  }, [loadPanel, loadMine]);

  const lotteryCount = useMemo(
    () => new Set(tickets.map((t) => t.lotteryId)).size,
    [tickets],
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="rounded-2xl bg-fortuno-green-deep p-8 text-fortuno-offwhite shadow-lg">
        <h1 className="font-display text-3xl">
          Olá{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
        </h1>
        <p className="mt-2 text-fortuno-offwhite/80">
          Que bom te ver por aqui. Aqui está seu painel Fortuno.
        </p>

        {referralCode ? (
          <div className="mt-6 max-w-xl">
            <p className="text-xs uppercase tracking-wider text-fortuno-gold-soft">
              Seu código de indicação
            </p>
            <div className="mt-2">
              <CopyableCode value={referralCode} />
            </div>
          </div>
        ) : null}
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <StatCard label="Bilhetes comprados" value={tickets.length} />
        <StatCard label="Loterias em que participa" value={lotteryCount} />
        <StatCard
          label="Total de indicações"
          value={panel?.totalPurchases ?? 0}
          footer={panel ? `${formatBRL(panel.totalToReceive)} a receber` : undefined}
        />
      </section>

      {myLotteries.length > 0 ? (
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-fortuno-black">Loterias que administro</h2>
            <Link to="/meus-sorteios/novo" className="btn-primary">
              Crie seu sorteio
            </Link>
          </div>
          <ul className="mt-4 divide-y rounded-xl border bg-white">
            {myLotteries.map((lottery) => (
              <li key={lottery.lotteryId} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">{lottery.name}</p>
                  <p className="text-xs text-fortuno-black/60">
                    Prêmio: {formatBRL(lottery.totalPrizeValue)}
                  </p>
                </div>
                <Link
                  to={`/meus-sorteios/${lottery.lotteryId}/editar`}
                  className="btn-secondary"
                >
                  Gerenciar
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="mt-10 rounded-xl border border-dashed p-8 text-center">
          <p className="text-fortuno-black/70">
            Você ainda não administra nenhuma loteria.
          </p>
          <Link to="/meus-sorteios/novo" className="btn-primary mt-4">
            Crie seu sorteio
          </Link>
        </section>
      )}

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <Link
          to="/meus-numeros"
          className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h3 className="font-display text-xl text-fortuno-gold-intense">Meus Números</h3>
          <p className="mt-1 text-sm text-fortuno-black/70">
            Veja todos os bilhetes que você comprou.
          </p>
        </Link>
        <Link
          to="/meus-pontos"
          className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h3 className="font-display text-xl text-fortuno-gold-intense">Meus Pontos</h3>
          <p className="mt-1 text-sm text-fortuno-black/70">
            Acompanhe suas indicações e comissões.
          </p>
        </Link>
      </section>
    </main>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  footer?: string;
}

const StatCard = ({ label, value, footer }: StatCardProps): JSX.Element => (
  <div className="rounded-xl bg-white p-6 shadow-sm">
    <p className="text-xs uppercase tracking-wider text-fortuno-black/60">{label}</p>
    <p className="mt-2 font-display text-4xl text-fortuno-gold-intense">
      {value.toLocaleString('pt-BR')}
    </p>
    {footer ? <p className="mt-2 text-xs text-fortuno-black/50">{footer}</p> : null}
  </div>
);
