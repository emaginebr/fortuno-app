import { useTranslation } from 'react-i18next';
import { Share2, Users } from 'lucide-react';

export interface PointsEmptyStateProps {
  onShare: () => void;
  className?: string;
}

export const PointsEmptyState = ({
  onShare,
  className,
}: PointsEmptyStateProps): JSX.Element => {
  const { t } = useTranslation();
  const wrapperClass = ['mp-empty-card', className].filter(Boolean).join(' ');

  return (
    <section aria-labelledby="mp-empty-title">
      <div className={wrapperClass}>
        <div className="mp-empty-card-icon" aria-hidden="true">
          <Users />
        </div>
        <h3 id="mp-empty-title">{t('myPoints.empty.title')}</h3>
        <p>{t('myPoints.empty.description')}</p>
        <button
          type="button"
          onClick={onShare}
          className="mp-cta-primary"
          aria-label={t('myPoints.empty.cta')}
        >
          <Share2 className="w-[15px] h-[15px]" />
          {t('myPoints.empty.cta')}
        </button>
      </div>
    </section>
  );
};
