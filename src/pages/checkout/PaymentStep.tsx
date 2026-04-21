import { useEffect, useState } from 'react';
import { useCheckout } from '@/hooks/useCheckout';
import { useQRCodePolling } from '@/hooks/useQRCodePolling';
import { ticketService } from '@/Services/ticketService';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { CopyableCode } from '@/components/common/CopyableCode';
import { CountdownTimer } from '@/components/common/CountdownTimer';
import { PiSimulatorButton } from '@/components/common/PiSimulatorButton';
import { TicketOrderStatus } from '@/types/enums';
import { toast } from 'sonner';

export const PaymentStep = (): JSX.Element => {
  const checkout = useCheckout();
  const [generating, setGenerating] = useState(false);
  const invoiceId = checkout.qrCode?.invoiceId ?? null;
  const polling = useQRCodePolling(invoiceId);

  useEffect(() => {
    if (checkout.qrCode || generating) return;
    setGenerating(true);
    void checkout.startPayment().finally(() => setGenerating(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (polling.status === TicketOrderStatus.Paid) {
      checkout.setPaymentResult(TicketOrderStatus.Paid, polling.tickets ?? []);
    } else if (
      polling.status === TicketOrderStatus.Expired ||
      polling.status === TicketOrderStatus.Cancelled ||
      polling.status === TicketOrderStatus.Overdue
    ) {
      toast.error('O pagamento não foi concluído. Tente novamente.');
      checkout.setPaymentResult(polling.status);
      checkout.goToStep('quantity');
    }
  }, [polling.status, polling.tickets, checkout]);

  if (generating || !checkout.qrCode) {
    return <LoadingSpinner label="Gerando QR Code..." size={64} />;
  }

  const qr = checkout.qrCode;

  return (
    <div className="relative mx-auto max-w-xl px-4 py-8">
      <h1 className="text-center font-display text-3xl text-fortuno-black">
        Pague com PIX para garantir seus bilhetes
      </h1>

      <div className="mt-6 flex flex-col items-center gap-4 rounded-xl border border-fortuno-black/10 bg-white p-6 shadow-sm">
        {qr.brCodeBase64 ? (
          <img
            src={
              qr.brCodeBase64.startsWith('data:')
                ? qr.brCodeBase64
                : `data:image/png;base64,${qr.brCodeBase64}`
            }
            alt="QR Code PIX"
            className="h-64 w-64 rounded-md border border-fortuno-black/10"
          />
        ) : (
          <div className="rounded-md bg-fortuno-offwhite p-6 font-mono text-xs">
            {qr.brCode}
          </div>
        )}

        <CopyableCode label="Código copia-e-cola" value={qr.brCode} />

        <div className="flex flex-col items-center gap-1 text-sm text-fortuno-black/70">
          <span>Expira em</span>
          <CountdownTimer expiresAt={qr.expiredAt} />
        </div>

        <p className="text-center text-xs text-fortuno-black/60">
          Cole o código no seu app do banco ou escaneie o QR Code acima.
          <br />
          Aguardando confirmação do pagamento...
        </p>

        {polling.status ? (
          <div className="text-xs text-fortuno-gold-intense">
            Status atual: {TicketOrderStatus[polling.status]}
          </div>
        ) : null}
      </div>

      <PiSimulatorButton
        onTrigger={() => {
          if (!invoiceId) return Promise.resolve();
          return ticketService.simulatePayment(invoiceId);
        }}
      />
    </div>
  );
};
