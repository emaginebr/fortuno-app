import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Package, Percent, Trash2, Plus } from 'lucide-react';
import { useLotteryCombo } from '@/hooks/useLotteryCombo';

interface Step5Props {
  lotteryId: number;
}

interface ComboForm {
  name: string;
  quantityStart: number;
  quantityEnd: number;
  discountLabel: string;
  discountValue: number;
}

const EMPTY_FORM: ComboForm = {
  name: '',
  quantityStart: 1,
  quantityEnd: 10,
  discountLabel: '10% OFF',
  discountValue: 10,
};

export const Step5Combos = ({ lotteryId }: Step5Props): JSX.Element => {
  const { combos, loadByLottery, create, remove } = useLotteryCombo();
  const [form, setForm] = useState<ComboForm>(EMPTY_FORM);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void loadByLottery(lotteryId);
  }, [lotteryId, loadByLottery]);

  const handleAdd = async (): Promise<void> => {
    if (!form.name.trim()) {
      toast.error('Informe um nome para o combo.');
      return;
    }
    if (form.quantityEnd !== 0 && form.quantityEnd < form.quantityStart) {
      toast.error('A faixa final deve ser maior ou igual à inicial (ou 0 para sem limite).');
      return;
    }
    setBusy(true);
    try {
      await create({ ...form, lotteryId });
      setForm(EMPTY_FORM);
    } finally {
      setBusy(false);
    }
  };

  const sortedCombos = [...combos].sort((a, b) => a.quantityStart - b.quantityStart);

  return (
    <div className="space-y-8">
      <section aria-labelledby="combo-list-title">
        <h3
          id="combo-list-title"
          className="mb-4 font-display text-lg text-fortuno-offwhite"
        >
          Combos cadastrados{' '}
          <span className="ml-1 text-sm text-fortuno-offwhite/55">({sortedCombos.length})</span>
        </h3>

        {sortedCombos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-fortuno-offwhite/15 p-6 text-center text-sm text-fortuno-offwhite/60">
            Nenhum combo cadastrado ainda. Combos ajudam a impulsionar o ticket médio.
          </div>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {sortedCombos.map((combo) => (
              <li
                key={combo.lotteryComboId}
                className="group relative flex flex-col gap-3 rounded-xl border border-fortuno-offwhite/10 bg-fortuno-offwhite/[0.03] p-4 transition hover:border-fortuno-gold-soft/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display text-base text-fortuno-offwhite">
                      {combo.name}
                    </p>
                    <p className="mt-0.5 text-xs text-fortuno-offwhite/55">
                      De {combo.quantityStart}{' '}
                      {combo.quantityEnd === 0
                        ? 'bilhete ou mais'
                        : `a ${combo.quantityEnd} bilhetes`}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-fortuno-gold-intense/15 px-2.5 py-1 text-xs font-bold text-fortuno-gold-soft">
                    <Percent className="h-3 w-3" aria-hidden="true" />
                    {combo.discountValue}%
                  </span>
                </div>

                <div className="rounded-md bg-fortuno-black/40 px-3 py-2 text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-fortuno-gold-intense">
                    {combo.discountLabel}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => void remove(combo.lotteryComboId)}
                  className="inline-flex items-center justify-center gap-1 rounded-md border border-red-500/40 px-2 py-1.5 text-xs text-red-300 transition hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" aria-hidden="true" />
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        aria-labelledby="combo-form-title"
        className="rounded-2xl border border-fortuno-gold-soft/20 bg-fortuno-offwhite/[0.03] p-6"
      >
        <header className="mb-5 flex items-center gap-2">
          <Package className="h-5 w-5 text-fortuno-gold-soft" aria-hidden="true" />
          <h3
            id="combo-form-title"
            className="font-display text-lg text-fortuno-offwhite"
          >
            Novo combo
          </h3>
        </header>

        <div className="grid gap-4 md:grid-cols-6">
          <label className="md:col-span-2 flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-fortuno-offwhite/70">
              Nome do combo
            </span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ex.: Pacote Família"
            />
            <span className="text-[11px] text-fortuno-offwhite/45">
              Nome amigável exibido ao comprador.
            </span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-fortuno-offwhite/70">
              Bilhetes — de
            </span>
            <input
              type="number"
              min={1}
              value={form.quantityStart}
              onChange={(e) =>
                setForm((f) => ({ ...f, quantityStart: Number(e.target.value) }))
              }
            />
            <span className="text-[11px] text-fortuno-offwhite/45">
              Quantidade mínima da faixa.
            </span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-fortuno-offwhite/70">
              Bilhetes — até
            </span>
            <input
              type="number"
              min={0}
              value={form.quantityEnd}
              onChange={(e) =>
                setForm((f) => ({ ...f, quantityEnd: Number(e.target.value) }))
              }
            />
            <span className="text-[11px] text-fortuno-offwhite/45">
              Quantidade máxima da faixa. Use <strong>0</strong> para sem limite.
            </span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-fortuno-offwhite/70">
              Rótulo do desconto
            </span>
            <input
              type="text"
              value={form.discountLabel}
              onChange={(e) => setForm((f) => ({ ...f, discountLabel: e.target.value }))}
              placeholder="10% OFF"
            />
            <span className="text-[11px] text-fortuno-offwhite/45">
              Texto exibido como selo.
            </span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-fortuno-offwhite/70">
              Desconto (%)
            </span>
            <input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={form.discountValue}
              onChange={(e) =>
                setForm((f) => ({ ...f, discountValue: Number(e.target.value) }))
              }
            />
            <span className="text-[11px] text-fortuno-offwhite/45">
              Percentual aplicado no total.
            </span>
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => void handleAdd()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-fortuno-gold-intense px-5 py-2.5 text-sm font-bold text-fortuno-black transition hover:bg-fortuno-gold-soft disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:shadow-gold-focus"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {busy ? 'Adicionando...' : 'Adicionar combo'}
          </button>
        </div>
      </section>
    </div>
  );
};
