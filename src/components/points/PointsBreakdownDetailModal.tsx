import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, X } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { iconForLotteryName } from '@/utils/lotteryIcon';
import type { ReferrerLotteryBreakdown } from '@/types/referral';

export interface PointsBreakdownDetailModalProps {
  row: ReferrerLotteryBreakdown | null;
  onClose: () => void;
}

interface MockReferralItem {
  code: string;
  points: number;
}

const buildMockItems = (row: ReferrerLotteryBreakdown): MockReferralItem[] => {
  // MOCK: aguarda endpoint GET /referral/breakdown/{lotteryId}/details.
  // Distribuição simples: divide pontos totais entre as indicações do sorteio.
  const points = Math.max(0, Math.floor(row.toReceive));
  const count = Math.min(row.purchases, 5);
  if (count === 0) return [];
  const perItem = Math.max(1, Math.floor(points / count));
  return Array.from({ length: count }, (_, i) => ({
    code: `${row.lotteryId.toString(36).toUpperCase()}${i + 1}${String.fromCharCode(65 + ((row.lotteryId + i) % 26))}`,
    points: perItem,
  }));
};

export const PointsBreakdownDetailModal = ({
  row,
  onClose,
}: PointsBreakdownDetailModalProps): JSX.Element | null => {
  const { t } = useTranslation();
  const mockItems = useMemo<MockReferralItem[]>(
    () => (row ? buildMockItems(row) : []),
    [row],
  );

  if (!row) return null;

  const Icon = iconForLotteryName(row.lotteryName);
  const points = Math.max(0, Math.floor(row.toReceive));

  return (
    <Modal onClose={onClose} ariaLabelledBy="points-detail-title">
      <header className="mp-modal-header">
        <span className="mp-modal-icon-frame" aria-hidden="true">
          <Icon />
        </span>
        <div className="mp-modal-titleblock">
          <span className="mp-modal-eyebrow">{t('myPoints.detail.eyebrow')}</span>
          <h3 id="points-detail-title" className="mp-modal-title">
            {row.lotteryName}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mp-modal-close"
          aria-label={t('myPoints.detail.closeAria')}
        >
          <X />
        </button>
      </header>

      <div className="mp-modal-body">
        <div className="mp-detail-summary">
          <div className="summary-pill">
            <span className="pill-eyebrow">{t('myPoints.detail.summaryReferrals')}</span>
            <span className="pill-value">{row.purchases.toLocaleString('pt-BR')}</span>
          </div>
          <div className="summary-pill">
            <span className="pill-eyebrow">{t('myPoints.detail.summaryPoints')}</span>
            <span className="pill-value">{points.toLocaleString('pt-BR')}</span>
          </div>
          <div className="summary-pill">
            <span className="pill-eyebrow">{t('myPoints.detail.summaryLottery')}</span>
            <span className="pill-value">#{row.lotteryId}</span>
          </div>
        </div>

        <div className="mp-modal-divider" />

        <span className="mp-modal-eyebrow">{t('myPoints.detail.listTitle')}</span>
        <ul className="mp-detail-list">
          {mockItems.length > 0 ? (
            mockItems.map((item) => (
              <li key={item.code} className="mp-detail-item is-mock">
                <span className="avatar" aria-hidden="true">
                  {item.code.charAt(0)}
                </span>
                <div className="info">
                  <div className="title">{t('myPoints.detail.mockItemTitle')}</div>
                  <div className="sub">
                    {t('myPoints.detail.mockItemSub', { code: item.code })}
                  </div>
                </div>
                <div className="pts">
                  +{item.points.toLocaleString('pt-BR')} pts
                </div>
              </li>
            ))
          ) : (
            <li className="mp-detail-item is-mock">
              <div className="info">
                <div className="sub">{t('myPoints.detail.disclaimer')}</div>
              </div>
            </li>
          )}
        </ul>

        <div className="mp-detail-footer">
          <span className="text-[11px] text-fortuno-black/55 italic">
            {t('myPoints.detail.disclaimer')}
          </span>
          <Link to={`/sorteios/${row.lotteryId}`} className="mp-detail-link">
            {t('myPoints.detail.viewLottery')}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </Modal>
  );
};
