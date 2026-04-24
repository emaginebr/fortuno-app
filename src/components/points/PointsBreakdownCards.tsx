import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import { iconForLotteryName } from '@/utils/lotteryIcon';
import type { ReferrerLotteryBreakdown } from '@/types/referral';

export interface PointsBreakdownCardsProps {
  rows: ReferrerLotteryBreakdown[];
  onOpenDetail: (row: ReferrerLotteryBreakdown) => void;
}

const pointsOf = (r: ReferrerLotteryBreakdown): number =>
  Math.max(0, Math.floor(r.toReceive));

export const PointsBreakdownCards = ({
  rows,
  onOpenDetail,
}: PointsBreakdownCardsProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="grid gap-3">
      {rows.map((row) => {
        const points = pointsOf(row);
        const Icon = iconForLotteryName(row.lotteryName);
        return (
          <article
            key={row.lotteryId}
            className="breakdown-mobile-card"
            aria-label={t('myPoints.breakdown.rowAria', {
              name: row.lotteryName,
              purchases: row.purchases,
              points,
            })}
          >
            <div className="row-icon" aria-hidden="true">
              <Icon />
            </div>
            <div className="row-info">
              <div className="row-name">{row.lotteryName}</div>
              <div className="row-purchases">
                {t('myPoints.breakdown.purchases', { count: row.purchases })}
              </div>
            </div>
            <div className="row-points">
              {points.toLocaleString('pt-BR')}
              <span className="row-points-unit">pts</span>
            </div>
            <button
              type="button"
              className="row-detail-btn"
              onClick={() => onOpenDetail(row)}
              aria-label={t('myPoints.breakdown.detailAria', { name: row.lotteryName })}
            >
              {t('myPoints.breakdown.detailMobile')}
              <ArrowUpRight />
            </button>
          </article>
        );
      })}
    </div>
  );
};
