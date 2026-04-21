import { useEffect, useState } from 'react';
import { useLotteryCombo } from '@/hooks/useLotteryCombo';

interface Step5Props {
  lotteryId: number;
}

export const Step5Combos = ({ lotteryId }: Step5Props): JSX.Element => {
  const { combos, loadByLottery, create, remove } = useLotteryCombo();
  const [form, setForm] = useState({
    name: '',
    quantityStart: 1,
    quantityEnd: 10,
    discountLabel: '10% OFF',
    discountValue: 10,
  });

  useEffect(() => {
    void loadByLottery(lotteryId);
  }, [lotteryId, loadByLottery]);

  const handleAdd = async (): Promise<void> => {
    if (!form.name.trim()) return;
    await create({ ...form, lotteryId });
    setForm({
      name: '',
      quantityStart: 1,
      quantityEnd: 10,
      discountLabel: '10% OFF',
      discountValue: 10,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-lg border border-dashed p-4 md:grid-cols-5">
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Nome do combo"
          className="rounded-md border border-fortuno-black/20 px-3 py-2"
        />
        <input
          type="number"
          min="1"
          value={form.quantityStart}
          onChange={(e) => setForm((f) => ({ ...f, quantityStart: Number(e.target.value) }))}
          placeholder="De"
          className="rounded-md border border-fortuno-black/20 px-3 py-2"
        />
        <input
          type="number"
          min="1"
          value={form.quantityEnd}
          onChange={(e) => setForm((f) => ({ ...f, quantityEnd: Number(e.target.value) }))}
          placeholder="Até"
          className="rounded-md border border-fortuno-black/20 px-3 py-2"
        />
        <input
          type="text"
          value={form.discountLabel}
          onChange={(e) => setForm((f) => ({ ...f, discountLabel: e.target.value }))}
          placeholder="Rótulo (10% OFF)"
          className="rounded-md border border-fortuno-black/20 px-3 py-2"
        />
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={form.discountValue}
          onChange={(e) => setForm((f) => ({ ...f, discountValue: Number(e.target.value) }))}
          placeholder="Valor % (10)"
          className="rounded-md border border-fortuno-black/20 px-3 py-2"
        />
        <button
          type="button"
          onClick={() => void handleAdd()}
          className="btn-primary md:col-span-5"
        >
          Adicionar combo
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {combos.map((combo) => (
          <div
            key={combo.lotteryComboId}
            className="rounded-xl border bg-white p-4 shadow-sm"
          >
            <p className="font-display text-lg">{combo.name}</p>
            <p className="text-sm text-fortuno-black/60">
              De {combo.quantityStart} a {combo.quantityEnd} bilhetes
            </p>
            <p className="mt-1 text-sm font-semibold text-fortuno-gold-intense">
              {combo.discountLabel}
            </p>
            <button
              type="button"
              onClick={() => void remove(combo.lotteryComboId)}
              className="mt-3 text-xs text-red-700"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
