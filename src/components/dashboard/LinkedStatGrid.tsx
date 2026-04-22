import { useTranslation } from 'react-i18next';
import { LinkedStatCard } from './LinkedStatCard';

export interface LinkedStatGridProps {
  ticketsCount: number;
  lotteriesPlaying: number;
  referrals: number;
}

/**
 * Trio de stat cards linkáveis do dashboard. Cada card é um único `<Link>`
 * focável que navega para seu destino próprio.
 */
export const LinkedStatGrid = ({
  ticketsCount,
  lotteriesPlaying,
  referrals,
}: LinkedStatGridProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="dash-stats-title">
      <h2 id="dash-stats-title" className="sr-only">
        {t('dashboard.statsSectionTitle')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <LinkedStatCard
          number="01"
          icon="ticket"
          label={t('dashboard.statTicketsLabel')}
          value={ticketsCount}
          ctaLabel={t('dashboard.statTicketsCta')}
          to="/meus-numeros"
        />
        <LinkedStatCard
          number="02"
          icon="trophy"
          label={t('dashboard.statLotteriesLabel')}
          value={lotteriesPlaying}
          ctaLabel={t('dashboard.statLotteriesCta')}
          to="/meus-sorteios"
        />
        <LinkedStatCard
          number="03"
          icon="users"
          label={t('dashboard.statReferralsLabel')}
          value={referrals}
          ctaLabel={t('dashboard.statReferralsCta')}
          to="/meus-pontos"
        />
      </div>
    </section>
  );
};
