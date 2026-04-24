import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';

export interface PointsDisclaimerCardProps {
  note: string;
  className?: string;
}

export const PointsDisclaimerCard = ({
  note,
  className,
}: PointsDisclaimerCardProps): JSX.Element => {
  const { t } = useTranslation();
  const wrapperClass = ['disclaimer-ornament', className].filter(Boolean).join(' ');

  return (
    <section id="disclaimer" aria-labelledby="mp-disclaimer-title">
      <h2 id="mp-disclaimer-title" className="sr-only">
        {t('myPoints.disclaimer.eyebrow')}
      </h2>
      <div className={wrapperClass}>
        <span className="disclaimer-icon" aria-hidden="true">
          <Info />
        </span>
        <span className="disclaimer-eyebrow">
          {t('myPoints.disclaimer.eyebrow')}
        </span>
        <p className="disclaimer-text">{note}</p>
      </div>
    </section>
  );
};
