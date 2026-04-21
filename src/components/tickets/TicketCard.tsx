import type { TicketInfo } from '@/types/ticket';

interface TicketCardProps {
  ticket: TicketInfo;
  lotteryName?: string;
  drawDate?: string;
}

export const TicketCard = ({ ticket, lotteryName, drawDate }: TicketCardProps): JSX.Element => {
  const displayValue = ticket.ticketValue || String(ticket.ticketNumber);

  return (
    <article className="relative overflow-hidden rounded-xl border-2 border-dashed border-fortuno-gold-soft bg-fortuno-offwhite p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between text-xs font-semibold uppercase tracking-wider text-fortuno-gold-intense">
        <span>Fortuno · Bilhete</span>
        <span>#{ticket.ticketId}</span>
      </div>

      {lotteryName ? (
        <h3 className="mt-2 line-clamp-1 font-display text-lg text-fortuno-black">
          {lotteryName}
        </h3>
      ) : null}

      <div className="mt-4 rounded-lg bg-white px-4 py-3 text-center">
        <div className="text-xs text-fortuno-black/60">Número da sorte</div>
        <div className="mt-1 font-mono text-3xl font-bold tracking-widest text-fortuno-black tabular-nums">
          {displayValue}
        </div>
      </div>

      <div className="mt-4 flex justify-between text-xs text-fortuno-black/70">
        <span>Compra: {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</span>
        {drawDate ? <span>Sorteio: {drawDate}</span> : null}
      </div>

      <div
        aria-hidden="true"
        className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white"
      />
      <div
        aria-hidden="true"
        className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white"
      />
    </article>
  );
};
