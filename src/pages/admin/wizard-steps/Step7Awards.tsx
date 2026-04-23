import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { CalendarClock, Loader2, Medal, Plus, Trash2, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { useRaffle } from '@/hooks/useRaffle';
import { useRaffleAward } from '@/hooks/useRaffleAward';
import type { RaffleInfo } from '@/types/raffle';
import type { RaffleAwardInfo } from '@/types/raffleAward';

interface Step7Props {
  lotteryId: number;
}

const formatRaffleDate = (iso: string): string =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

const positionLabel = (position: number): string => {
  if (position === 1) return '1º lugar';
  if (position === 2) return '2º lugar';
  if (position === 3) return '3º lugar';
  return `${position}º lugar`;
};

interface AwardCardProps {
  award: RaffleAwardInfo;
  raffle: RaffleInfo | undefined;
  onRemove: (award: RaffleAwardInfo) => void;
  busy: boolean;
}

const AwardCard = ({ award, raffle, onRemove, busy }: AwardCardProps): JSX.Element => {
  const raffleName = raffle?.name ?? 'Sorteio';
  const raffleDate = raffle ? formatRaffleDate(raffle.raffleDatetime) : '—';
  return (
    <li
      className="flex flex-col gap-3 rounded-xl border border-fortuno-offwhite/10 bg-fortuno-offwhite/[0.03] p-4 transition hover:border-fortuno-gold-soft/40"
      aria-label={`Prêmio ${positionLabel(award.position)}, ${award.description}`}
    >
      <div className="flex items-start gap-3">
        <span
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fortuno-gold-intense/15 text-fortuno-gold-soft"
          aria-hidden="true"
        >
          <Medal className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-fortuno-gold-soft">
            {positionLabel(award.position)}
          </p>
          <p className="mt-0.5 text-sm font-semibold text-fortuno-offwhite line-clamp-3">
            {award.description}
          </p>
          <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-fortuno-offwhite/55">
            <CalendarClock className="h-3 w-3 text-fortuno-gold-soft" aria-hidden="true" />
            <span className="truncate">
              {raffleName} · {raffleDate}
            </span>
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(award)}
        disabled={busy}
        className="inline-flex items-center justify-center gap-1 self-start rounded-md border border-red-500/40 px-2 py-1.5 text-xs text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 className="h-3 w-3" aria-hidden="true" />
        Remover
      </button>
    </li>
  );
};

export const Step7Awards = ({ lotteryId }: Step7Props): JSX.Element => {
  const { raffles, loadByLottery } = useRaffle();
  const { awards, loading, loadByRaffles, create, remove } = useRaffleAward();

  const [raffleId, setRaffleId] = useState<number | ''>('');
  const [position, setPosition] = useState<number>(1);
  const [description, setDescription] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    void loadByLottery(lotteryId);
  }, [lotteryId, loadByLottery]);

  const rafflesForLottery = useMemo(
    () => raffles.filter((r) => r.lotteryId === lotteryId),
    [raffles, lotteryId],
  );

  const raffleIdsForLottery = useMemo(
    () => rafflesForLottery.map((r) => r.raffleId),
    [rafflesForLottery],
  );

  useEffect(() => {
    if (raffleIdsForLottery.length > 0) void loadByRaffles(raffleIdsForLottery);
  }, [raffleIdsForLottery, loadByRaffles]);

  useEffect(() => {
    if (raffleId === '' && raffleIdsForLottery.length > 0) {
      setRaffleId(raffleIdsForLottery[0]);
    }
  }, [raffleId, raffleIdsForLottery]);

  const rafflesById = useMemo(() => {
    const map = new Map<number, RaffleInfo>();
    raffles.forEach((r) => map.set(r.raffleId, r));
    return map;
  }, [raffles]);

  const sortedRafflesByDate = useMemo(
    () =>
      [...rafflesForLottery].sort(
        (a, b) =>
          new Date(a.raffleDatetime).getTime() - new Date(b.raffleDatetime).getTime(),
      ),
    [rafflesForLottery],
  );

  const awardsInLottery = useMemo(
    () => awards.filter((a) => rafflesById.has(a.raffleId)),
    [awards, rafflesById],
  );

  const orderedAwards = useMemo(
    () =>
      [...awardsInLottery].sort((a, b) => {
        const ra = rafflesById.get(a.raffleId);
        const rb = rafflesById.get(b.raffleId);
        const ta = ra ? new Date(ra.raffleDatetime).getTime() : 0;
        const tb = rb ? new Date(rb.raffleDatetime).getTime() : 0;
        if (ta !== tb) return ta - tb;
        return a.position - b.position;
      }),
    [awardsInLottery, rafflesById],
  );

  useEffect(() => {
    if (raffleId === '') return;
    const max = awardsInLottery
      .filter((a) => a.raffleId === raffleId)
      .reduce((acc, cur) => (cur.position > acc ? cur.position : acc), 0);
    setPosition(max + 1);
  }, [raffleId, awardsInLottery]);

  const noRaffles = raffleIdsForLottery.length === 0;
  const totalAwards = orderedAwards.length;
  const showLoadingSkeleton = loading && totalAwards === 0;

  const handleRemove = async (award: RaffleAwardInfo): Promise<void> => {
    if (
      !window.confirm(
        `Remover o prêmio "${award.description}" (${positionLabel(award.position)})?`,
      )
    )
      return;
    await remove(award.raffleAwardId);
  };

  const canSubmit =
    !noRaffles &&
    raffleId !== '' &&
    description.trim().length > 0 &&
    position >= 1 &&
    !submitting;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!canSubmit || typeof raffleId !== 'number') {
      if (raffleId === '') toast.error('Selecione o sorteio deste prêmio.');
      else if (description.trim().length === 0)
        toast.error('Informe a descrição do prêmio.');
      return;
    }
    setSubmitting(true);
    try {
      const created = await create({
        raffleId,
        position,
        description: description.trim(),
      });
      if (created !== null) setDescription('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <section aria-labelledby="award-list-title">
        <h3
          id="award-list-title"
          className="mb-4 font-display text-lg text-fortuno-offwhite"
        >
          Prêmios cadastrados{' '}
          <span className="ml-1 text-sm text-fortuno-offwhite/55">({totalAwards})</span>
        </h3>

        {showLoadingSkeleton ? (
          <div
            className="grid gap-3 md:grid-cols-2"
            aria-busy="true"
            aria-label="Carregando prêmios"
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-32 rounded-xl border border-fortuno-offwhite/10 bg-fortuno-offwhite/[0.03] animate-pulse motion-reduce:animate-none"
              />
            ))}
          </div>
        ) : noRaffles ? (
          <div className="rounded-xl border border-dashed border-fortuno-offwhite/15 p-6 text-center text-sm text-fortuno-offwhite/60">
            Cadastre ao menos um sorteio na etapa 6 antes de adicionar prêmios.
          </div>
        ) : totalAwards === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-fortuno-offwhite/15 p-8 text-center">
            <Trophy className="h-8 w-8 text-fortuno-gold-soft" aria-hidden="true" />
            <p className="font-display text-base text-fortuno-offwhite">
              Nenhum prêmio cadastrado ainda.
            </p>
            <p className="text-xs text-fortuno-offwhite/55">
              Use o formulário abaixo para começar.
            </p>
          </div>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {orderedAwards.map((award) => (
              <AwardCard
                key={award.raffleAwardId}
                award={award}
                raffle={rafflesById.get(award.raffleId)}
                onRemove={(a) => void handleRemove(a)}
                busy={submitting}
              />
            ))}
          </ul>
        )}
      </section>

      <section
        aria-labelledby="award-form-title"
        className="rounded-2xl border border-fortuno-gold-soft/20 bg-fortuno-offwhite/[0.03] p-6"
      >
        <header className="mb-5 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-fortuno-gold-soft" aria-hidden="true" />
          <h3
            id="award-form-title"
            className="font-display text-lg text-fortuno-offwhite"
          >
            Novo prêmio
          </h3>
        </header>

        {noRaffles ? (
          <p className="mb-4 rounded-md border border-[color:#8a5a2b]/35 bg-[color:#8a5a2b]/10 px-3 py-2 text-[12px] text-amber-200">
            Nenhum sorteio cadastrado — volte à etapa 6.
          </p>
        ) : null}

        <form onSubmit={(e) => void handleSubmit(e)} aria-label="Adicionar prêmio">
          <fieldset
            disabled={noRaffles || submitting}
            className="grid gap-4 md:grid-cols-6"
          >
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-fortuno-offwhite/70">
                Posição
              </span>
              <input
                type="number"
                min={1}
                value={position}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setPosition(Number.isFinite(v) && v >= 1 ? Math.floor(v) : 1);
                }}
              />
              <span className="text-[11px] text-fortuno-offwhite/45">
                Ordem (1º, 2º...).
              </span>
            </label>

            <label className="md:col-span-2 flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-fortuno-offwhite/70">
                Descrição do prêmio
              </span>
              <input
                type="text"
                maxLength={200}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex.: iPhone 15 Pro Max 256GB"
              />
              <span className="text-[11px] text-fortuno-offwhite/45">
                Detalhe do que o ganhador receberá.
              </span>
            </label>

            <label className="md:col-span-3 flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-fortuno-offwhite/70">
                Sorteio
              </span>
              <select
                value={raffleId === '' ? '' : String(raffleId)}
                onChange={(e) =>
                  setRaffleId(e.target.value ? Number(e.target.value) : '')
                }
              >
                {raffleId === '' ? (
                  <option value="">Selecione um sorteio</option>
                ) : null}
                {sortedRafflesByDate.map((r) => (
                  <option key={r.raffleId} value={r.raffleId}>
                    {r.name} · {formatRaffleDate(r.raffleDatetime)}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-fortuno-offwhite/45">
                O prêmio pertence a este sorteio.
              </span>
            </label>
          </fieldset>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 rounded-full bg-fortuno-gold-intense px-5 py-2.5 text-sm font-bold text-fortuno-black transition hover:bg-fortuno-gold-soft disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:shadow-gold-focus"
            >
              {submitting ? (
                <Loader2
                  className="h-4 w-4 animate-spin motion-reduce:animate-none"
                  aria-hidden="true"
                />
              ) : (
                <Plus className="h-4 w-4" aria-hidden="true" />
              )}
              {submitting ? 'Adicionando...' : 'Adicionar prêmio'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
