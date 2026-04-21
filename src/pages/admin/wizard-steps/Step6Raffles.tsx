import { useEffect, useState } from 'react';
import { useRaffle } from '@/hooks/useRaffle';

interface Step6Props {
  lotteryId: number;
}

export const Step6Raffles = ({ lotteryId }: Step6Props): JSX.Element => {
  const { raffles, loadByLottery, create } = useRaffle();
  const [form, setForm] = useState({
    name: '',
    descriptionMd: '',
    raffleDatetime: '',
    includePreviousWinners: false,
  });

  useEffect(() => {
    void loadByLottery(lotteryId);
  }, [lotteryId, loadByLottery]);

  const canIncludeWinners = raffles.length >= 1;

  const handleAdd = async (): Promise<void> => {
    if (!form.name.trim() || !form.raffleDatetime) return;
    await create({
      lotteryId,
      name: form.name.trim(),
      descriptionMd: form.descriptionMd,
      raffleDatetime: new Date(form.raffleDatetime).toISOString(),
      includePreviousWinners: canIncludeWinners ? form.includePreviousWinners : false,
    });
    setForm({
      name: '',
      descriptionMd: '',
      raffleDatetime: '',
      includePreviousWinners: false,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-lg border border-dashed p-4">
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Nome do sorteio"
          className="rounded-md border border-fortuno-black/20 px-3 py-2"
        />
        <textarea
          value={form.descriptionMd}
          onChange={(e) => setForm((f) => ({ ...f, descriptionMd: e.target.value }))}
          placeholder="Descrição (Markdown)"
          className="rounded-md border border-fortuno-black/20 px-3 py-2"
          rows={3}
        />
        <input
          type="datetime-local"
          value={form.raffleDatetime}
          onChange={(e) => setForm((f) => ({ ...f, raffleDatetime: e.target.value }))}
          className="rounded-md border border-fortuno-black/20 px-3 py-2"
        />
        <label className={`flex items-center gap-2 ${canIncludeWinners ? '' : 'opacity-40'}`}>
          <input
            type="checkbox"
            checked={form.includePreviousWinners}
            onChange={(e) =>
              setForm((f) => ({ ...f, includePreviousWinners: e.target.checked }))
            }
            disabled={!canIncludeWinners}
          />
          <span className="text-sm">
            Incluir ganhadores dos sorteios anteriores (disponível a partir do 2º sorteio)
          </span>
        </label>
        <button type="button" onClick={() => void handleAdd()} className="btn-primary">
          Adicionar sorteio
        </button>
      </div>

      {raffles.length === 0 ? (
        <p className="text-center text-fortuno-black/60">Nenhum sorteio cadastrado.</p>
      ) : (
        <ul className="divide-y rounded-xl border bg-white">
          {raffles.map((raffle) => (
            <li key={raffle.raffleId} className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">{raffle.name}</p>
                <p className="text-xs text-fortuno-black/60">
                  {new Date(raffle.raffleDatetime).toLocaleString('pt-BR')}
                </p>
              </div>
              {raffle.includePreviousWinners ? (
                <span className="rounded bg-fortuno-gold-intense/20 px-2 py-1 text-xs">
                  + ganhadores anteriores
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
