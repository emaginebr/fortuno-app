import { useEffect, useMemo, useState } from 'react';
import { useRaffle } from '@/hooks/useRaffle';
import { useRaffleAward } from '@/hooks/useRaffleAward';

interface Step7Props {
  lotteryId: number;
}

export const Step7Awards = ({ lotteryId }: Step7Props): JSX.Element => {
  const { raffles, loadByLottery } = useRaffle();
  const { awards, loadByRaffle, create, remove } = useRaffleAward();
  const [selectedRaffle, setSelectedRaffle] = useState<number | ''>('');
  const [form, setForm] = useState({ position: 1, description: '' });

  useEffect(() => {
    void loadByLottery(lotteryId);
  }, [lotteryId, loadByLottery]);

  useEffect(() => {
    if (selectedRaffle) {
      void loadByRaffle(Number(selectedRaffle));
    }
  }, [selectedRaffle, loadByRaffle]);

  const ordered = useMemo(() => [...awards].sort((a, b) => a.position - b.position), [awards]);

  const handleAdd = async (): Promise<void> => {
    if (!selectedRaffle || !form.description.trim()) return;
    await create({
      raffleId: Number(selectedRaffle),
      position: form.position,
      description: form.description.trim(),
    });
    setForm({ position: form.position + 1, description: '' });
  };

  return (
    <div className="space-y-6">
      <label className="block">
        <span className="text-sm font-semibold">Sorteio</span>
        <select
          value={selectedRaffle}
          onChange={(e) => setSelectedRaffle(e.target.value ? Number(e.target.value) : '')}
          className="mt-1 w-full rounded-md border border-fortuno-black/20 px-3 py-2"
        >
          <option value="">Selecione um sorteio</option>
          {raffles.map((r) => (
            <option key={r.raffleId} value={r.raffleId}>
              {r.name} · {new Date(r.raffleDatetime).toLocaleDateString('pt-BR')}
            </option>
          ))}
        </select>
      </label>

      {selectedRaffle ? (
        <>
          <div className="grid gap-3 rounded-lg border border-dashed p-4 md:grid-cols-4">
            <input
              type="number"
              min="1"
              value={form.position}
              onChange={(e) =>
                setForm((f) => ({ ...f, position: Number(e.target.value) }))
              }
              placeholder="Posição"
              className="rounded-md border border-fortuno-black/20 px-3 py-2"
            />
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Descrição do prêmio"
              className="md:col-span-2 rounded-md border border-fortuno-black/20 px-3 py-2"
            />
            <button type="button" onClick={() => void handleAdd()} className="btn-primary">
              Adicionar
            </button>
          </div>

          <ul className="divide-y rounded-xl border bg-white">
            {ordered.map((award) => (
              <li
                key={award.raffleAwardId}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <p className="font-semibold">
                    {award.position}º · {award.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void remove(award.raffleAwardId)}
                  className="text-xs text-red-700"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
};
