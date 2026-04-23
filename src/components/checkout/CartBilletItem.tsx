import { Dices, Hash, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatBRL } from '@/utils/currency';
import { formatComposed } from '@/utils/numberFormat';
import { NumberType } from '@/types/enums';

export type CartBilletItemProps =
  | { kind: 'random'; count: number; unitPrice: number }
  | {
      kind: 'manual';
      number: number;
      unitPrice: number;
      numberType: NumberType;
      onRemove: () => void;
    };

const baseClass =
  'grid grid-cols-[auto_1fr_auto_auto] gap-3.5 items-center p-3.5 px-[18px] border rounded-[14px] transition-all duration-noir-base ease-noir-spring animate-billet-slide-in';

export const CartBilletItem = (props: CartBilletItemProps): JSX.Element => {
  const { t } = useTranslation();

  if (props.kind === 'random') {
    const subtotal = props.count * props.unitPrice;
    return (
      <div
        role="listitem"
        className={`${baseClass} bg-billet-row-random border-[color:var(--billet-row-border)]`}
      >
        <span className="w-11 h-11 rounded-xl grid place-items-center border border-fortuno-gold-intense/45 bg-billet-icon-random text-fortuno-gold-intense">
          <Dices className="w-5 h-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-fortuno-black leading-tight">
            {t('checkout.cart.randomTitle', { count: props.count })}
          </p>
          <p className="text-[11px] text-fortuno-black/50 mt-0.5">
            {t('checkout.cart.randomSub')}
          </p>
        </div>
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.1em] text-fortuno-black/55 tabular-nums"
          aria-hidden="true"
        >
          {props.count} × {formatBRL(props.unitPrice)}
        </span>
        <span className="text-sm font-bold text-fortuno-black tabular-nums pl-2">
          {formatBRL(subtotal)}
        </span>
      </div>
    );
  }

  const formatted =
    props.numberType === NumberType.Int64
      ? props.number.toLocaleString('pt-BR')
      : formatComposed(props.number, props.numberType);

  return (
    <div
      role="listitem"
      className={`${baseClass} bg-[color:var(--billet-row-bg)] border-[color:var(--billet-row-border)] border-l-[3px] border-l-fortuno-gold-intense`}
    >
      <span className="w-11 h-11 rounded-xl grid place-items-center border border-fortuno-gold-intense/45 bg-billet-icon-manual text-fortuno-black">
        <Hash className="w-5 h-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-fortuno-black leading-tight">
          {t('checkout.cart.manualTitle')}
        </p>
        <p className="text-[11px] text-fortuno-black/50 mt-0.5">
          {t('checkout.cart.manualSub')}
        </p>
      </div>
      <span className="font-display italic font-extrabold text-[20px] text-transparent bg-clip-text bg-ticket-numeral tabular-nums pl-2">
        {formatted}
      </span>
      <button
        type="button"
        onClick={props.onRemove}
        aria-label={t('checkout.cart.removeAria', { number: formatted })}
        className="w-[34px] h-[34px] rounded-[10px] border border-fortuno-black/12 bg-fortuno-black/[0.04] text-fortuno-black/55 grid place-items-center cursor-pointer transition-all duration-noir-fast hover:bg-[rgba(185,74,47,0.10)] hover:text-[color:var(--countdown-critical)] hover:border-[rgba(185,74,47,0.35)] focus-visible:outline-none focus-visible:shadow-gold-focus"
      >
        <Trash2 className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
};
