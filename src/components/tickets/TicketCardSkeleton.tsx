/**
 * Skeleton que replica a silhueta vertical do TicketCardPremium v2.
 * Shimmer via CSS; respeita `prefers-reduced-motion` globalmente.
 */
export const TicketCardSkeleton = (): JSX.Element => (
  <div
    className="ticket-skel motion-reduce:animate-none"
    role="status"
    aria-hidden="true"
  >
    <div className="ticket-skel-row">
      <span className="ticket-skel-block is-id" />
      <span className="ticket-skel-block is-status" />
    </div>
    <span className="ticket-skel-block is-numeral" />
    <div className="ticket-skel-row">
      <span className="ticket-skel-block is-meta-1" />
      <span className="ticket-skel-block is-meta-2" />
    </div>
  </div>
);
