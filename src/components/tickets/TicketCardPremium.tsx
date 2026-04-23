import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CalendarClock,
  CheckCircle2,
  Crown,
  Hourglass,
  ShieldCheck,
  Undo2,
} from 'lucide-react';
import type { TicketInfo } from '@/types/ticket';
import { TicketRefundState } from '@/types/enums';

export type TicketVoucherState = 'gold' | 'green' | 'copper';

export interface TicketCardPremiumProps {
  ticket: TicketInfo;
  /** Data do sorteio já formatada (ex.: "12 mai 2026"). */
  drawDate?: string;
  /** Quando true, marca o ticket como vencedor (sobrescreve visual p/ ouro + coroa). */
  isWinner?: boolean;
  /** Quando true, aplica estado "green" (sorteio realizado) — derivado pela página. */
  lotteryClosed?: boolean;
  /** Usado para o stagger-in via --ticket-index. */
  index?: number;
  /** Quando presente, o card renderiza como <button> e dispara ao clicar/Enter/Space. */
  onClick?: () => void;
  /** Classe extra opcional. */
  className?: string;
}

/**
 * Classifica o comprimento do `ticketValue` para escolher o tamanho tipográfico
 * fluido via `data-length`.
 * - short  ≤ 5  chars
 * - medium 6-10 chars
 * - long   11-16 chars
 * - xlong  ≥ 17 chars
 */
export const voucherLengthClass = (
  value: string,
): 'short' | 'medium' | 'long' | 'xlong' => {
  const len = value.length;
  if (len <= 5) return 'short';
  if (len <= 10) return 'medium';
  if (len <= 16) return 'long';
  return 'xlong';
};

/**
 * Divide o `ticketValue` em dígitos + separadores "-" estilizados.
 */
const renderTicketValue = (value: string): ReactNode => {
  const parts = value.split('-');
  if (parts.length === 1) return value;
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <span key={`sep-${i}`} className="voucher-number-sep">
            -
          </span>,
          part,
        ],
  );
};

const computeState = (
  ticket: TicketInfo,
  lotteryClosed: boolean | undefined,
): TicketVoucherState => {
  if (ticket.refundState === TicketRefundState.Refunded) return 'copper';
  if (lotteryClosed) return 'green';
  return 'gold';
};

const formatPurchase = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const sealText = (
  state: TicketVoucherState,
  isWinner: boolean,
): { top: string; bottom: string } => {
  if (isWinner) return { top: 'Champ', bottom: new Date().getFullYear().toString() };
  if (state === 'green') return { top: 'Final', bottom: new Date().getFullYear().toString() };
  if (state === 'copper') return { top: 'Void', bottom: new Date().getFullYear().toString() };
  return { top: 'Auth', bottom: new Date().getFullYear().toString() };
};

/**
 * TicketCardPremium — voucher de cassino vintage (v2).
 *
 * Renderiza como <button> quando `onClick` está presente (para abrir o modal de detalhes),
 * senão como <article>. O número é o herói central, renderizado em Playfair italic
 * com tipografia fluida via container queries (`cqi`) + modifier `data-length`.
 */
export const TicketCardPremium = ({
  ticket,
  drawDate,
  isWinner = false,
  lotteryClosed,
  index = 0,
  onClick,
  className,
}: TicketCardPremiumProps): JSX.Element => {
  const { t } = useTranslation();

  const state = computeState(ticket, lotteryClosed);
  const isPendingRefund = ticket.refundState === TicketRefundState.Pending;
  const lengthClass = voucherLengthClass(ticket.ticketValue);

  // Label do status — pendingRefund tem precedência sobre "em jogo", winner sobre "sorteado".
  const statusLabel = ((): string => {
    if (isWinner) return t('myNumbers.status.winner');
    if (state === 'copper') return t('myNumbers.status.refunded');
    if (state === 'green') return t('myNumbers.status.closed');
    if (isPendingRefund) return t('myNumbers.status.pendingRefund');
    return t('myNumbers.status.open');
  })();

  const StatusIcon = ((): typeof CheckCircle2 | null => {
    if (isWinner) return Crown;
    if (state === 'copper') return Undo2;
    if (state === 'green') return CheckCircle2;
    if (isPendingRefund) return Hourglass;
    return null;
  })();

  const ariaLabel = drawDate
    ? t('myNumbers.ticketAria', {
        number: ticket.ticketValue,
        status: statusLabel,
        drawDate,
      })
    : t('myNumbers.ticketAriaNoDate', {
        number: ticket.ticketValue,
        status: statusLabel,
      });

  const seal = sealText(state, isWinner);

  const style = { '--ticket-index': index } as CSSProperties;

  const ticketChildren: ReactNode = (
    <>
      <div className="ticket-shimmer" aria-hidden="true" />
      <div className="ticket-inner">
        <span className="ticket-corner is-tl" aria-hidden="true" />
        <span className="ticket-corner is-tr" aria-hidden="true" />
        <span className="ticket-corner is-bl" aria-hidden="true" />
        <span className="ticket-corner is-br" aria-hidden="true" />
        <span className="ticket-hole is-left" aria-hidden="true" />
        <span className="ticket-hole is-right" aria-hidden="true" />

        <div className="ticket-head">
          <div className="ticket-head-left">
            <span className="ticket-eyebrow">{t('myNumbers.ticketEyebrow')}</span>
            <span className="ticket-eyebrow-sep" aria-hidden="true" />
            <span className="ticket-id">#FN-{ticket.ticketId}</span>
          </div>
          <span className="ticket-status">
            {StatusIcon ? (
              <StatusIcon aria-hidden="true" />
            ) : (
              <span className="dot" aria-hidden="true" />
            )}
            <span>{statusLabel}</span>
          </span>
        </div>

        <div className="voucher-number-band">
          <span
            className="voucher-number"
            data-length={lengthClass}
            aria-label={`Número ${ticket.ticketValue}`}
          >
            {renderTicketValue(ticket.ticketValue)}
          </span>
        </div>

        <div>
          {drawDate ? (
            <div className="ticket-meta" aria-hidden="true">
              <span className="meta-item">
                <CalendarClock aria-hidden="true" />
                {drawDate}
              </span>
            </div>
          ) : null}
          <div className="ticket-foot">
            <span className="ticket-purchase-date">
              {t('myNumbers.purchasePrefix')} · {formatPurchase(ticket.createdAt)}
            </span>
            <span className="ticket-foot-auth" aria-hidden="true">
              <ShieldCheck aria-hidden="true" />
              {t('myNumbers.authentic')}
            </span>
          </div>
        </div>

        <div className="ticket-seal" aria-hidden="true">
          <div className="ticket-seal-inner">
            <span className="ticket-seal-text">
              {seal.top}
              <strong>{seal.bottom}</strong>
            </span>
          </div>
        </div>
      </div>
    </>
  );

  const dataState = state;
  const dataWinner = isWinner ? 'true' : undefined;
  const mergedClassName = ['ticket', className].filter(Boolean).join(' ');

  if (onClick) {
    const handleKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>): void => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    };
    return (
      <button
        type="button"
        className={mergedClassName}
        data-state={dataState}
        data-winner={dataWinner}
        style={style}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
      >
        {ticketChildren}
      </button>
    );
  }

  return (
    <article
      className={mergedClassName}
      data-state={dataState}
      data-winner={dataWinner}
      style={style}
      aria-label={ariaLabel}
    >
      {ticketChildren}
    </article>
  );
};
