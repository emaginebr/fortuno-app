import { Ticket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export interface TicketEmptyStateProps {
  /** "no-tickets" = usuário ainda não comprou nenhum bilhete.
   *  "no-match"   = filtros atuais não retornaram resultados. */
  variant: 'no-tickets' | 'no-match';
  /** Chamado pelo link "Limpar filtros" na variante no-match. */
  onClearFilters?: () => void;
}

export const TicketEmptyState = ({
  variant,
  onClearFilters,
}: TicketEmptyStateProps): JSX.Element => {
  const { t } = useTranslation();

  if (variant === 'no-match') {
    return (
      <div className="empty-filtered" role="status">
        <h4>{t('myNumbers.empty.noMatchTitle')}</h4>
        <p>{t('myNumbers.empty.noMatchBody')}</p>
        {onClearFilters ? (
          <button type="button" onClick={onClearFilters}>
            {t('myNumbers.empty.noMatchClear')}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="empty-card" role="status">
      <div className="empty-card-icon" aria-hidden="true">
        <Ticket />
      </div>
      <h3>{t('myNumbers.empty.noTicketsTitle')}</h3>
      <p>{t('myNumbers.empty.noTicketsBody')}</p>
      <Link to="/sorteios" className="my-numbers-cta-primary">
        {t('myNumbers.empty.noTicketsCta')}
      </Link>
    </div>
  );
};
