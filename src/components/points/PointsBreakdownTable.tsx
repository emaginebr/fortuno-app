import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import { iconForLotteryName } from '@/utils/lotteryIcon';
import type { ReferrerLotteryBreakdown } from '@/types/referral';

export interface PointsBreakdownTableProps {
  rows: ReferrerLotteryBreakdown[];
  onOpenDetail: (row: ReferrerLotteryBreakdown) => void;
  /** Override opcional do total do `tfoot`; default é a soma de `floor(row.toReceive)`. */
  totalPointsOverride?: number;
}

const pointsOf = (r: ReferrerLotteryBreakdown): number =>
  Math.max(0, Math.floor(r.toReceive));

export const PointsBreakdownTable = ({
  rows,
  onOpenDetail,
  totalPointsOverride,
}: PointsBreakdownTableProps): JSX.Element => {
  const { t } = useTranslation();
  const total =
    totalPointsOverride ?? rows.reduce((acc, r) => acc + pointsOf(r), 0);

  return (
    <div
      className="breakdown-card is-table"
      role="region"
      aria-label={t('myPoints.breakdown.titleStart') + ' ' + t('myPoints.breakdown.titleEnd')}
    >
      <table className="breakdown-table">
        <thead>
          <tr>
            <th scope="col">{t('myPoints.breakdown.thSorteio')}</th>
            <th scope="col" className="is-num">
              {t('myPoints.breakdown.thIndicacoes')}
            </th>
            <th scope="col" className="is-num">
              {t('myPoints.breakdown.thPontos')}
            </th>
            <th scope="col" className="is-action">
              <span className="sr-only">{t('myPoints.breakdown.thAcoes')}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const points = pointsOf(row);
            const Icon = iconForLotteryName(row.lotteryName);
            return (
              <tr
                key={row.lotteryId}
                aria-label={t('myPoints.breakdown.rowAria', {
                  name: row.lotteryName,
                  purchases: row.purchases,
                  points,
                })}
              >
                <td>
                  <div className="breakdown-row-name">
                    <span className="breakdown-row-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span>
                      <span className="name-text">{row.lotteryName}</span>
                    </span>
                  </div>
                </td>
                <td className="breakdown-num">{row.purchases.toLocaleString('pt-BR')}</td>
                <td>
                  <span className="breakdown-points">
                    {points.toLocaleString('pt-BR')}
                    <span className="breakdown-points-unit">pts</span>
                  </span>
                </td>
                <td className="breakdown-action">
                  <button
                    type="button"
                    className="breakdown-detail-btn"
                    onClick={() => onOpenDetail(row)}
                    aria-label={t('myPoints.breakdown.detailAria', {
                      name: row.lotteryName,
                    })}
                  >
                    {t('myPoints.breakdown.detail')}
                    <ArrowUpRight />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td className="label" colSpan={2}>
              {t('myPoints.breakdown.tfTotal')}
            </td>
            <td className="value" colSpan={2}>
              {total.toLocaleString('pt-BR')}
              <span
                className="breakdown-points-unit"
                style={{ WebkitTextFillColor: 'var(--fortuno-gold-intense)', fontStyle: 'normal' }}
              >
                {' '}
                pts
              </span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
