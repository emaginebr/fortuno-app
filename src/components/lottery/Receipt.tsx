import { BadgePercent, Ticket } from 'lucide-react';
import { formatBRL } from '@/utils/currency';

export interface ReceiptProps {
  quantity: number;
  ticketPrice: number;
  subtotal: number;
  discount: number;
  total: number;
  comboName?: string;
}

export const Receipt = ({
  quantity,
  ticketPrice,
  subtotal,
  discount,
  total,
  comboName,
}: ReceiptProps): JSX.Element => (
  <div
    className="relative bg-[color:var(--receipt-bg)] border border-dashed border-[color:var(--receipt-border)] rounded-[14px] p-[20px_22px] shadow-receipt before:content-[''] before:absolute before:top-1/2 before:left-[-8px] before:-translate-y-1/2 before:w-3.5 before:h-3.5 before:rounded-full before:bg-dash-page before:border before:border-dashed before:border-[color:var(--receipt-border)] after:content-[''] after:absolute after:top-1/2 after:right-[-8px] after:-translate-y-1/2 after:w-3.5 after:h-3.5 after:rounded-full after:bg-dash-page after:border after:border-dashed after:border-[color:var(--receipt-border)]"
    aria-labelledby="receipt-title"
  >
    <div
      id="receipt-title"
      className="text-[10px] uppercase tracking-[0.26em] text-fortuno-gold-intense font-semibold mb-3"
    >
      Recibo da compra
    </div>

    <div className="flex items-center justify-between py-2.5 text-[13px] text-fortuno-black/[0.78]">
      <span className="inline-flex items-center gap-2">
        <Ticket className="w-3.5 h-3.5 text-fortuno-gold-intense" aria-hidden="true" />
        {quantity} {quantity === 1 ? 'bilhete' : 'bilhetes'} × {formatBRL(ticketPrice)}
      </span>
      <span className="font-semibold tabular-nums">{formatBRL(subtotal)}</span>
    </div>

    {discount > 0 && (
      <>
        <div
          className="h-px bg-receipt-divider [background-size:9px_1px] my-1.5"
          aria-hidden="true"
        />
        <div className="flex items-center justify-between py-2.5 text-[13px] text-fortuno-black/[0.78]">
          <span className="inline-flex items-center gap-2">
            <BadgePercent
              className="w-3.5 h-3.5 text-fortuno-gold-intense"
              aria-hidden="true"
            />
            Desconto
            {comboName ? ` · pacote ${comboName}` : ''}
          </span>
          <span className="text-fortuno-green-elegant font-semibold tabular-nums">
            − {formatBRL(discount)}
          </span>
        </div>
      </>
    )}

    <div className="h-px bg-gold-divider-soft my-3" aria-hidden="true" />

    <div className="flex items-center justify-between text-fortuno-black">
      <span className="text-[12px] uppercase tracking-[0.18em] font-semibold text-fortuno-black/55">
        Total
      </span>
      <span className="font-display italic font-bold text-2xl leading-none tracking-[-0.01em] tabular-nums">
        {formatBRL(total)}
      </span>
    </div>
  </div>
);
