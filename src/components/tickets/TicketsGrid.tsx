import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { TicketCardSkeleton } from './TicketCardSkeleton';

export interface TicketsGridProps {
  children: ReactNode;
  ariaLabel?: string;
}

/**
 * Grid responsivo de bilhetes (1 / 2 / 3 / 4 colunas).
 * Ver `.tickets-grid` em my-numbers.css para os breakpoints.
 */
export const TicketsGrid = ({
  children,
  ariaLabel,
}: TicketsGridProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <section
      aria-label={ariaLabel ?? t('myNumbers.gridAria')}
      className="tickets-grid"
    >
      {children}
    </section>
  );
};

export interface TicketsGridSkeletonProps {
  count?: number;
}

export const TicketsGridSkeleton = ({
  count = 6,
}: TicketsGridSkeletonProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <section
      aria-label={t('myNumbers.loadingAria')}
      aria-busy="true"
      className="tickets-grid"
    >
      {Array.from({ length: count }).map((_, i) => (
        <TicketCardSkeleton key={i} />
      ))}
    </section>
  );
};
