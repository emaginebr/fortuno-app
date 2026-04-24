import { useTranslation } from 'react-i18next';
import { NumberType } from '@/types/enums';
import { formatComposed, formatInt64 } from '@/utils/numberFormat';

export interface TicketMiniCardProps {
  /**
   * Número em formato canônico string (alinhado a `pickedNumbers` do backend).
   * - Int64:    "42"
   * - Composed: "05-11-28-39-60"
   */
  number: string;
  lotteryName: string;
  /** Label textual da próxima data de sorteio — pode ser "Em breve". */
  nextRaffleLabel: string;
  kind: 'random' | 'manual';
  numberType: NumberType;
}

export const TicketMiniCard = (props: TicketMiniCardProps): JSX.Element => {
  const { t } = useTranslation();
  const { number, lotteryName, nextRaffleLabel, kind, numberType } = props;

  const formatted =
    numberType === NumberType.Int64
      ? formatInt64(Number(number))
      : formatComposed(number, numberType);

  const chipClass =
    kind === 'random'
      ? 'bg-fortuno-green-elegant/[0.08] border-fortuno-green-elegant/[0.18] text-fortuno-green-elegant'
      : 'bg-fortuno-gold-intense/15 border-fortuno-gold-intense/40 text-fortuno-gold-intense';

  return (
    <article className="relative pt-[22px] px-[18px] pb-[18px] bg-gradient-to-b from-white to-fortuno-offwhite/60 border-[1.5px] border-fortuno-gold-intense/35 rounded-[18px] shadow-paper text-center overflow-hidden">
      <div
        className="absolute top-0 inset-x-0 h-px bg-card-gold-bar"
        aria-hidden="true"
      />
      <div className="font-display italic font-extrabold text-[40px] leading-none bg-clip-text text-transparent bg-ticket-numeral tabular-nums mb-2.5">
        {formatted}
      </div>
      <p className="text-[11px] font-semibold text-fortuno-black/70 line-clamp-1">
        {lotteryName}
      </p>
      <p className="text-[10px] text-fortuno-black/50 tracking-[0.08em] uppercase mt-1.5">
        {nextRaffleLabel}
      </p>
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[9px] font-bold tracking-[0.10em] uppercase mt-2.5 ${chipClass}`}
      >
        {t(kind === 'random' ? 'checkout.success.chipRandom' : 'checkout.success.chipManual')}
      </span>
    </article>
  );
};
