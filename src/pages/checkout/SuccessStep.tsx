import { Link } from 'react-router-dom';
import { useCheckout } from '@/hooks/useCheckout';
import { useLottery } from '@/hooks/useLottery';
import { TicketCard } from '@/components/tickets/TicketCard';

export const SuccessStep = (): JSX.Element => {
  const checkout = useCheckout();
  const { currentLottery } = useLottery();
  const tickets = checkout.tickets ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 text-center">
      <div className="text-6xl" aria-hidden="true">
        🎉
      </div>
      <h1 className="mt-4 font-display text-4xl text-fortuno-black">Parabéns!</h1>
      <p className="mt-2 text-fortuno-black/70">
        Seu pagamento foi confirmado. Boa sorte no sorteio!
      </p>

      {tickets.length > 0 ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.ticketId}
              ticket={ticket}
              lotteryName={currentLottery?.name}
            />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-fortuno-black/50">
          Seus bilhetes estarão disponíveis em "Meus Números" em instantes.
        </p>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link to="/meus-numeros" className="btn-primary">
          Ver em Meus Números
        </Link>
        <Link to="/" className="btn-secondary">
          Voltar à Home
        </Link>
      </div>
    </div>
  );
};
