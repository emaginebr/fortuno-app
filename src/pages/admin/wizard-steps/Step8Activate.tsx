import { useEffect } from 'react';
import {
  CheckCircle2,
  Ticket,
  Trophy,
  ImageIcon,
  Package,
  Dices,
  Percent,
  Rocket,
  AlertCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLottery } from '@/hooks/useLottery';
import { useRaffle } from '@/hooks/useRaffle';
import { useLotteryCombo } from '@/hooks/useLotteryCombo';
import { useLotteryImage } from '@/hooks/useLotteryImage';
import { LOTTERY_STATUS_LABEL, LotteryStatus } from '@/types/enums';
import { formatBRL } from '@/utils/currency';

interface Step8Props {
  lotteryId: number;
}

interface SummaryCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: 'default' | 'success' | 'warning';
}

const SummaryCard = ({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'default',
}: SummaryCardProps): JSX.Element => {
  const toneClasses =
    tone === 'success'
      ? 'border-emerald-400/40 bg-emerald-400/5'
      : tone === 'warning'
        ? 'border-amber-400/40 bg-amber-400/5'
        : 'border-fortuno-offwhite/10 bg-fortuno-offwhite/[0.03]';
  const iconTone =
    tone === 'success'
      ? 'text-emerald-300'
      : tone === 'warning'
        ? 'text-amber-300'
        : 'text-fortuno-gold-soft';
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 transition hover:border-fortuno-gold-soft/40 ${toneClasses}`}
    >
      <span
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fortuno-black/40"
        aria-hidden="true"
      >
        <Icon className={`h-5 w-5 ${iconTone}`} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-fortuno-offwhite/55">
          {label}
        </p>
        <p className="mt-0.5 truncate font-display text-lg text-fortuno-offwhite">{value}</p>
        {hint && (
          <p className="mt-0.5 text-[11px] text-fortuno-offwhite/45">{hint}</p>
        )}
      </div>
    </div>
  );
};

export const Step8Activate = ({ lotteryId }: Step8Props): JSX.Element => {
  const { currentLottery, loadById } = useLottery();
  const { raffles } = useRaffle();
  const { combos } = useLotteryCombo();
  const { images } = useLotteryImage();

  useEffect(() => {
    void loadById(lotteryId);
  }, [lotteryId, loadById]);

  if (!currentLottery) {
    return (
      <p className="text-sm text-fortuno-offwhite/70">Carregando resumo...</p>
    );
  }

  const checklist: { ok: boolean; label: string }[] = [
    { ok: images.length > 0, label: 'Pelo menos uma imagem cadastrada' },
    { ok: raffles.length > 0, label: 'Pelo menos um sorteio agendado' },
    { ok: !!currentLottery.descriptionMd?.trim(), label: 'Descrição preenchida' },
    { ok: !!currentLottery.rulesMd?.trim(), label: 'Regras preenchidas' },
  ];
  const allOk = checklist.every((c) => c.ok);
  const ticketRange =
    currentLottery.ticketMax > 0
      ? `${currentLottery.ticketMin} – ${currentLottery.ticketMax}`
      : `${currentLottery.ticketMin}+ (sem limite)`;
  const isDraft = currentLottery.status === LotteryStatus.Draft;

  return (
    <div className="space-y-8">
      <section
        aria-labelledby="status-title"
        className="rounded-2xl border border-fortuno-gold-soft/20 bg-fortuno-offwhite/[0.03] p-6"
      >
        <header className="mb-4 flex items-center gap-2">
          <Rocket className="h-5 w-5 text-fortuno-gold-soft" aria-hidden="true" />
          <h3
            id="status-title"
            className="font-display text-lg text-fortuno-offwhite"
          >
            Resumo final
          </h3>
        </header>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
              isDraft
                ? 'bg-amber-400/15 text-amber-200'
                : 'bg-emerald-400/15 text-emerald-200'
            }`}
          >
            {LOTTERY_STATUS_LABEL[currentLottery.status]}
          </span>
          <p className="text-sm text-fortuno-offwhite/70">
            <span className="font-display text-fortuno-offwhite">{currentLottery.name}</span>
            {currentLottery.slug && (
              <span className="text-fortuno-offwhite/45"> · {currentLottery.slug}</span>
            )}
          </p>
        </div>
      </section>

      <section aria-labelledby="overview-title">
        <h3
          id="overview-title"
          className="mb-4 font-display text-lg text-fortuno-offwhite"
        >
          Visão geral
        </h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <SummaryCard
            icon={Ticket}
            label="Valor do bilhete"
            value={formatBRL(currentLottery.ticketPrice)}
          />
          <SummaryCard
            icon={Trophy}
            label="Prêmio total"
            value={formatBRL(currentLottery.totalPrizeValue)}
          />
          <SummaryCard
            icon={Ticket}
            label="Bilhetes por compra"
            value={ticketRange}
          />
          <SummaryCard
            icon={Percent}
            label="Pontos por indicação"
            value={`${currentLottery.referralPercent}%`}
          />
          <SummaryCard
            icon={ImageIcon}
            label="Imagens"
            value={String(images.length)}
            tone={images.length > 0 ? 'success' : 'warning'}
            hint={images.length === 0 ? 'Adicione ao menos uma capa.' : undefined}
          />
          <SummaryCard
            icon={Package}
            label="Combos"
            value={String(combos.length)}
            hint={combos.length === 0 ? 'Opcional — impulsiona o ticket médio.' : undefined}
          />
          <SummaryCard
            icon={Dices}
            label="Sorteios agendados"
            value={String(raffles.length)}
            tone={raffles.length > 0 ? 'success' : 'warning'}
            hint={raffles.length === 0 ? 'Agende ao menos um sorteio.' : undefined}
          />
        </div>
      </section>

      <section aria-labelledby="checklist-title">
        <h3
          id="checklist-title"
          className="mb-4 font-display text-lg text-fortuno-offwhite"
        >
          Checklist de ativação
        </h3>
        <ul className="grid gap-2 rounded-xl border border-fortuno-offwhite/10 bg-fortuno-offwhite/[0.03] p-4">
          {checklist.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-2 text-sm text-fortuno-offwhite/85"
            >
              {item.ok ? (
                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-emerald-300"
                  aria-hidden="true"
                />
              ) : (
                <AlertCircle
                  className="h-4 w-4 shrink-0 text-amber-300"
                  aria-hidden="true"
                />
              )}
              <span className={item.ok ? '' : 'text-amber-100'}>{item.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <p
        className={`rounded-xl border p-4 text-sm ${
          allOk
            ? 'border-emerald-400/30 bg-emerald-400/5 text-emerald-100'
            : 'border-amber-400/30 bg-amber-400/5 text-amber-100'
        }`}
      >
        {allOk
          ? 'Tudo pronto! Ao ativar, o sorteio ficará visível no site público e começará a aceitar compras.'
          : 'Alguns itens ainda estão pendentes. Você pode ativar mesmo assim, mas revise o checklist acima antes de publicar.'}
      </p>
    </div>
  );
};
