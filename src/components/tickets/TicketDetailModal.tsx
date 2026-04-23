import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { ExternalLink, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Modal } from '@/components/common/Modal';
import type { TicketInfo } from '@/types/ticket';
import { TicketRefundState } from '@/types/enums';
import { TicketCardPremium } from './TicketCardPremium';

export interface TicketDetailModalProps {
  ticket: TicketInfo;
  lotteryName?: string;
  lotterySlug?: string;
  lotteryPrize?: string;
  drawDate?: string;
  lotteryClosed?: boolean;
  isWinner?: boolean;
  onClose: () => void;
}

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Modal de detalhes do bilhete.
 *
 * Reusa o primitivo Modal (overlay + focus trap). Renderiza o TicketCardPremium
 * ampliado, grade de detalhes com o nome do sorteio (único lugar onde ele aparece
 * para o usuário autenticado) e QR code com o identificador do bilhete.
 *
 * Download como imagem: `html2canvas` NÃO está no package.json — o botão fica
 * visualmente presente porém desabilitado, com tooltip "em breve". Registrado em
 * MOCKS.md como "MyNumbers — Download bilhete como imagem".
 */
export const TicketDetailModal = ({
  ticket,
  lotteryName,
  lotterySlug,
  lotteryPrize,
  drawDate,
  lotteryClosed,
  isWinner,
  onClose,
}: TicketDetailModalProps): JSX.Element => {
  const { t } = useTranslation();

  const statusLabel = ((): string => {
    if (isWinner) return t('myNumbers.status.winner');
    if (ticket.refundState === TicketRefundState.Refunded)
      return t('myNumbers.status.refunded');
    if (lotteryClosed) return t('myNumbers.status.closed');
    if (ticket.refundState === TicketRefundState.Pending)
      return t('myNumbers.status.pendingRefund');
    return t('myNumbers.status.open');
  })();

  const qrValue = `fortuno:ticket:${ticket.ticketId}:${ticket.lotteryId}:${ticket.ticketValue}`;

  return (
    <Modal onClose={onClose} ariaLabelledBy="ticket-detail-title">
      <header className="ticket-modal-header">
        <div>
          <span className="ticket-modal-eyebrow">
            {t('myNumbers.modal.eyebrow')}
          </span>
          <h3
            id="ticket-detail-title"
            className="font-display text-lg font-bold text-fortuno-black mt-1"
          >
            {t('myNumbers.modal.title')}
          </h3>
        </div>
        <button
          type="button"
          className="ticket-modal-close"
          onClick={onClose}
          aria-label={t('myNumbers.modal.closeAria')}
        >
          <X className="w-[17px] h-[17px]" aria-hidden="true" />
        </button>
      </header>

      <div className="ticket-modal-body">
        <TicketCardPremium
          ticket={ticket}
          drawDate={drawDate}
          lotteryClosed={lotteryClosed}
          isWinner={isWinner}
        />

        <div className="ticket-modal-divider" aria-hidden="true" />

        <dl className="ticket-modal-detail-list">
          {lotteryName ? (
            <div className="ticket-modal-detail-item">
              <dt className="detail-label">{t('myNumbers.modal.lotteryLabel')}</dt>
              <dd className="detail-value">{lotteryName}</dd>
            </div>
          ) : null}
          {lotteryPrize ? (
            <div className="ticket-modal-detail-item">
              <dt className="detail-label">{t('myNumbers.modal.prizeLabel')}</dt>
              <dd className="detail-value">{lotteryPrize}</dd>
            </div>
          ) : null}
          {drawDate ? (
            <div className="ticket-modal-detail-item">
              <dt className="detail-label">{t('myNumbers.modal.drawDateLabel')}</dt>
              <dd className="detail-value">{drawDate}</dd>
            </div>
          ) : null}
          <div className="ticket-modal-detail-item">
            <dt className="detail-label">{t('myNumbers.modal.statusLabel')}</dt>
            <dd className="detail-value">{statusLabel}</dd>
          </div>
          <div className="ticket-modal-detail-item">
            <dt className="detail-label">{t('myNumbers.modal.purchaseLabel')}</dt>
            <dd className="detail-value">{formatDate(ticket.createdAt)}</dd>
          </div>
          <div className="ticket-modal-detail-item">
            <dt className="detail-label">{t('myNumbers.modal.idLabel')}</dt>
            <dd className="detail-value">#FN-{ticket.ticketId}</dd>
          </div>
        </dl>

        <div className="ticket-modal-divider" aria-hidden="true" />

        <div className="flex items-center gap-4 flex-wrap">
          <div className="ticket-modal-qr">
            <QRCodeSVG
              value={qrValue}
              size={132}
              bgColor="#ffffff"
              fgColor="#0b0b0b"
              level="M"
              role="img"
            />
            <span className="ticket-modal-qr-caption">
              {t('myNumbers.modal.qrCaption')}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {/* MOCK: aguarda estratégia de download; html2canvas não instalado. */}
            <button
              type="button"
              className="my-numbers-cta-primary opacity-50 cursor-not-allowed"
              disabled
              title={t('myNumbers.modal.downloadUnavailable')}
              aria-disabled="true"
            >
              {t('myNumbers.modal.downloadCta')}
            </button>
            {lotterySlug ? (
              <Link
                to={`/sorteios/${lotterySlug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[color:rgba(19,68,54,0.25)] text-fortuno-green-elegant hover:border-fortuno-gold-intense hover:bg-[color:rgba(212,175,55,0.08)] font-semibold text-[12px]"
              >
                <ExternalLink className="w-[13px] h-[13px]" aria-hidden="true" />
                {t('myNumbers.modal.viewLotteryCta')}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
};
