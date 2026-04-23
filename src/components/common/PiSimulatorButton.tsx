import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface PiSimulatorButtonProps {
  onTrigger: () => Promise<void> | void;
}

export const PiSimulatorButton = ({ onTrigger }: PiSimulatorButtonProps): JSX.Element => {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);

  const handleClick = async (): Promise<void> => {
    if (busy) return;
    setBusy(true);
    toast.info(t('checkout.paymentSimulated'));
    try {
      await onTrigger();
    } catch {
      // toast de erro já é disparado pelo service — silenciar aqui
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      aria-label="Simular pagamento PIX (modo de desenvolvimento)"
      onClick={() => void handleClick()}
      className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full font-serif text-2xl font-bold text-fortuno-gold-intense opacity-10 transition hover:opacity-80 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-fortuno-gold-soft"
    >
      π
    </button>
  );
};
