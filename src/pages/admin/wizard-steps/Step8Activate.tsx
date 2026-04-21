import { useEffect } from 'react';
import { useLottery } from '@/hooks/useLottery';
import { useRaffle } from '@/hooks/useRaffle';
import { useLotteryCombo } from '@/hooks/useLotteryCombo';
import { useLotteryImage } from '@/hooks/useLotteryImage';
import { LOTTERY_STATUS_LABEL } from '@/types/enums';
import { formatBRL } from '@/utils/currency';

interface Step8Props {
  lotteryId: number;
}

export const Step8Activate = ({ lotteryId }: Step8Props): JSX.Element => {
  const { currentLottery, loadById } = useLottery();
  const { raffles } = useRaffle();
  const { combos } = useLotteryCombo();
  const { images } = useLotteryImage();

  useEffect(() => {
    void loadById(lotteryId);
  }, [lotteryId, loadById]);

  if (!currentLottery) return <p>Carregando resumo...</p>;

  return (
    <div className="space-y-6">
      <h3 className="font-display text-xl text-fortuno-gold-intense">Resumo final</h3>

      <dl className="grid gap-4 md:grid-cols-2">
        <Summary label="Nome" value={currentLottery.name} />
        <Summary label="Status atual" value={LOTTERY_STATUS_LABEL[currentLottery.status]} />
        <Summary label="Valor do bilhete" value={formatBRL(currentLottery.ticketPrice)} />
        <Summary label="Prêmio total" value={formatBRL(currentLottery.totalPrizeValue)} />
        <Summary
          label="Intervalo de bilhetes"
          value={`${currentLottery.ticketMin} – ${currentLottery.ticketMax}`}
        />
        <Summary
          label="Comissão por indicação"
          value={`${currentLottery.referralPercent}%`}
        />
        <Summary label="Imagens" value={String(images.length)} />
        <Summary label="Combos" value={String(combos.length)} />
        <Summary label="Sorteios agendados" value={String(raffles.length)} />
      </dl>

      <p className="rounded-lg bg-fortuno-offwhite p-4 text-sm text-fortuno-black/70">
        Ao ativar, o sorteio ficará visível no site público e começará a aceitar compras.
      </p>
    </div>
  );
};

const Summary = ({ label, value }: { label: string; value: string }): JSX.Element => (
  <div className="rounded-lg border bg-white p-3">
    <dt className="text-xs uppercase tracking-wider text-fortuno-black/60">{label}</dt>
    <dd className="mt-1 font-semibold text-fortuno-black">{value}</dd>
  </div>
);
