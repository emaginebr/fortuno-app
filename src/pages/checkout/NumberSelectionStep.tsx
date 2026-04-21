import { useState } from 'react';
import { useCheckout } from '@/hooks/useCheckout';
import { useLottery } from '@/hooks/useLottery';
import { TicketOrderMode, NumberType, composedSize } from '@/types/enums';
import { validatePickedNumber } from '@/utils/validators';
import { formatComposed } from '@/utils/numberFormat';
import { toast } from 'sonner';

export const NumberSelectionStep = (): JSX.Element | null => {
  const checkout = useCheckout();
  const { currentLottery } = useLottery();
  const [wantsPick, setWantsPick] = useState<boolean | null>(null);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  if (!currentLottery) return null;

  const size = composedSize(currentLottery.numberType);
  const isComposed = currentLottery.numberType !== NumberType.Int64;

  const goPayment = (): void => {
    checkout.goToStep('payment');
  };

  const handleSkip = (): void => {
    checkout.clearPickedNumbers();
    checkout.setMode(TicketOrderMode.Random);
    goPayment();
  };

  const handleWantsManual = (): void => {
    setWantsPick(true);
    checkout.setMode(TicketOrderMode.Manual);
  };

  const handleAdd = async (): Promise<void> => {
    setBusy(true);
    try {
      const check = validatePickedNumber(input, currentLottery);
      if (!check.valid) {
        toast.error(check.reason ?? 'Número inválido.');
        return;
      }

      const normalized = isComposed
        ? Number(formatComposed(input, currentLottery.numberType).replace(/-/g, ''))
        : Number(input.replace(/\D/g, ''));

      if (checkout.pickedNumbers.includes(normalized)) {
        toast.error('Este número já está na sua lista.');
        return;
      }
      checkout.addPickedNumber(normalized);
      setInput('');
    } finally {
      setBusy(false);
    }
  };

  const renderChoice = (): JSX.Element => (
    <div className="space-y-4 text-center">
      <h2 className="font-display text-2xl text-fortuno-black">
        Deseja selecionar os números?
      </h2>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={handleWantsManual} className="btn-primary">
          Sim, quero escolher
        </button>
        <button type="button" onClick={handleSkip} className="btn-secondary">
          Não, aleatórios
        </button>
      </div>
    </div>
  );

  const renderPicker = (): JSX.Element => (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-fortuno-black">
        Escolha seus números ({checkout.pickedNumbers.length}/{checkout.quantity})
      </h2>

      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isComposed
              ? `${size} dezenas separadas por - (ex.: 05-11-28${size > 3 ? '-39-60' : ''})`
              : `Número entre ${currentLottery.ticketNumIni} e ${currentLottery.ticketNumEnd}`
          }
          className="flex-1 rounded-md border border-fortuno-black/20 px-3 py-2 focus:border-fortuno-gold-intense focus:outline-none"
          disabled={checkout.pickedNumbers.length >= checkout.quantity}
        />
        <button
          type="button"
          onClick={() => void handleAdd()}
          disabled={busy || !input || checkout.pickedNumbers.length >= checkout.quantity}
          className="btn-primary disabled:opacity-40"
        >
          Adicionar
        </button>
      </div>

      {checkout.pickedNumbers.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {checkout.pickedNumbers.map((n) => (
            <li key={n}>
              <button
                type="button"
                onClick={() => checkout.removePickedNumber(n)}
                className="inline-flex items-center gap-2 rounded-full border border-fortuno-gold-intense bg-fortuno-gold-intense/10 px-3 py-1 font-mono text-sm text-fortuno-black hover:bg-red-500/10 hover:text-red-700"
                aria-label={`Remover ${n}`}
              >
                {isComposed ? formatComposed(n, currentLottery.numberType) : n.toLocaleString('pt-BR')}
                <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-wrap justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            checkout.fillRandomRest();
            goPayment();
          }}
          className="btn-secondary"
        >
          Preencher o restante aleatoriamente
        </button>
        <button
          type="button"
          onClick={goPayment}
          disabled={checkout.pickedNumbers.length !== checkout.quantity}
          className="btn-primary disabled:opacity-40"
        >
          Pagar
        </button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {wantsPick === null ? renderChoice() : renderPicker()}
    </div>
  );
};
