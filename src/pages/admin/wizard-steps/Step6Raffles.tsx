import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dices, CalendarClock, Users, Trash2, Plus } from 'lucide-react';
import { useRaffle } from '@/hooks/useRaffle';

interface Step6Props {
  lotteryId: number;
}

interface RaffleForm {
  name: string;
  descriptionMd: string;
  raffleDatetime: string;
  includePreviousWinners: boolean;
}

const EMPTY_FORM: RaffleForm = {
  name: '',
  descriptionMd: '',
  raffleDatetime: '',
  includePreviousWinners: false,
};

export const Step6Raffles = ({ lotteryId }: Step6Props): JSX.Element => {
  const { raffles, loadByLottery, create, remove } = useRaffle();
  const [form, setForm] = useState<RaffleForm>(EMPTY_FORM);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void loadByLottery(lotteryId);
  }, [lotteryId, loadByLottery]);

  const canIncludeWinners = raffles.length >= 1;

  const handleAdd = async (): Promise<void> => {
    if (!form.name.trim()) {
      toast.error('Informe o nome do sorteio.');
      return;
    }
    if (!form.raffleDatetime) {
      toast.error('Escolha a data e hora do sorteio.');
      return;
    }
    setBusy(true);
    try {
      await create({
        lotteryId,
        name: form.name.trim(),
        descriptionMd: form.descriptionMd,
        raffleDatetime: new Date(form.raffleDatetime).toISOString(),
        includePreviousWinners: canIncludeWinners ? form.includePreviousWinners : false,
      });
      setForm(EMPTY_FORM);
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (raffleId: number, name: string): Promise<void> => {
    if (!window.confirm(`Remover o sorteio "${name}"?`)) return;
    await remove(raffleId);
  };

  const sortedRaffles = [...raffles].sort(
    (a, b) => new Date(a.raffleDatetime).getTime() - new Date(b.raffleDatetime).getTime(),
  );

  return (
    <div className="space-y-8">
      <section aria-labelledby="raffle-list-title">
        <h3
          id="raffle-list-title"
          className="mb-4 font-display text-lg text-fortuno-offwhite"
        >
          Sorteios cadastrados{' '}
          <span className="ml-1 text-sm text-fortuno-offwhite/55">
            ({sortedRaffles.length})
          </span>
        </h3>

        {sortedRaffles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-fortuno-offwhite/15 p-6 text-center text-sm text-fortuno-offwhite/60">
            Nenhum sorteio cadastrado. Adicione ao menos um sorteio para prosseguir.
          </div>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {sortedRaffles.map((raffle, idx) => (
              <li
                key={raffle.raffleId}
                className="flex flex-col gap-3 rounded-xl border border-fortuno-offwhite/10 bg-fortuno-offwhite/[0.03] p-4 transition hover:border-fortuno-gold-soft/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-fortuno-gold-soft">
                      #{idx + 1}
                    </span>
                    <p className="truncate font-display text-base text-fortuno-offwhite">
                      {raffle.name}
                    </p>
                  </div>
                  {raffle.includePreviousWinners && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-fortuno-gold-intense/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-fortuno-gold-soft">
                      <Users className="h-3 w-3" aria-hidden="true" />
                      + anteriores
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 rounded-md bg-fortuno-black/40 px-3 py-2 text-xs text-fortuno-offwhite/80">
                  <CalendarClock
                    className="h-4 w-4 text-fortuno-gold-soft"
                    aria-hidden="true"
                  />
                  <time dateTime={raffle.raffleDatetime}>
                    {new Date(raffle.raffleDatetime).toLocaleString('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </time>
                </div>

                <button
                  type="button"
                  onClick={() => void handleRemove(raffle.raffleId, raffle.name)}
                  className="inline-flex items-center justify-center gap-1 self-start rounded-md border border-red-500/40 px-2 py-1.5 text-xs text-red-300 transition hover:bg-red-500/10"
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
        aria-labelledby="raffle-form-title"
        className="rounded-2xl border border-fortuno-gold-soft/20 bg-fortuno-offwhite/[0.03] p-6"
      >
        <header className="mb-5 flex items-center gap-2">
          <Dices className="h-5 w-5 text-fortuno-gold-soft" aria-hidden="true" />
          <h3
            id="raffle-form-title"
            className="font-display text-lg text-fortuno-offwhite"
          >
            Novo sorteio
          </h3>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-fortuno-offwhite/70">
              Nome do sorteio
            </span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ex.: 1º Sorteio — Final de ano"
            />
            <span className="text-[11px] text-fortuno-offwhite/45">
              Título exibido aos participantes.
            </span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-fortuno-offwhite/70">
              Data e hora
            </span>
            <input
              type="datetime-local"
              value={form.raffleDatetime}
              onChange={(e) => setForm((f) => ({ ...f, raffleDatetime: e.target.value }))}
            />
            <span className="text-[11px] text-fortuno-offwhite/45">
              Quando o sorteio será realizado.
            </span>
          </label>

          <label className="md:col-span-2 flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-fortuno-offwhite/70">
              Descrição (opcional)
            </span>
            <textarea
              value={form.descriptionMd}
              onChange={(e) => setForm((f) => ({ ...f, descriptionMd: e.target.value }))}
              placeholder="Detalhes, mecânica, prêmios deste sorteio..."
              rows={3}
            />
            <span className="text-[11px] text-fortuno-offwhite/45">
              Aceita Markdown. Aparece na página do sorteio.
            </span>
          </label>

          <label
            className={`md:col-span-2 flex items-start gap-3 rounded-lg border border-fortuno-offwhite/10 p-3 ${
              canIncludeWinners ? '' : 'opacity-50'
            }`}
          >
            <input
              type="checkbox"
              checked={form.includePreviousWinners}
              onChange={(e) =>
                setForm((f) => ({ ...f, includePreviousWinners: e.target.checked }))
              }
              disabled={!canIncludeWinners}
              className="mt-0.5 h-4 w-4 accent-fortuno-gold-intense"
            />
            <span className="flex flex-col gap-0.5">
              <span className="flex items-center gap-2 text-sm font-medium text-fortuno-offwhite">
                <Users className="h-4 w-4 text-fortuno-gold-soft" aria-hidden="true" />
                Incluir ganhadores dos sorteios anteriores
              </span>
              <span className="text-[11px] text-fortuno-offwhite/45">
                {canIncludeWinners
                  ? 'Ganhadores anteriores concorrem novamente neste sorteio.'
                  : 'Disponível a partir do 2º sorteio cadastrado.'}
              </span>
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
            {busy ? 'Adicionando...' : 'Adicionar sorteio'}
          </button>
        </div>
      </section>
    </div>
  );
};
