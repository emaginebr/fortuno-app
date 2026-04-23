import { useEffect, useRef, useState } from 'react';
import { TicketOrderStatus } from '@/types/enums';
import type { TicketInfo } from '@/types/ticket';
import { ticketService } from '@/Services/ticketService';

export interface UseQRCodePollingResult {
  status: TicketOrderStatus | null;
  tickets: TicketInfo[] | null;
  error: string | null;
  ended: boolean;
}

const BASE_INTERVAL = 3000;
const MAX_INTERVAL = 10000;

const TERMINAL_STATUSES = new Set<TicketOrderStatus>([
  TicketOrderStatus.Paid,
  TicketOrderStatus.Overdue,
  TicketOrderStatus.Cancelled,
  TicketOrderStatus.Expired,
]);

/**
 * Polling do status do invoice PIX.
 * - Intervalo base 3s, backoff exponencial até 10s.
 * - Pausa quando a aba está em background (Page Visibility).
 * - Cancela em unmount.
 * - Retorna tickets quando status = Paid.
 */
export const useQRCodePolling = (
  invoiceId: number | null | undefined,
): UseQRCodePollingResult => {
  const [status, setStatus] = useState<TicketOrderStatus | null>(null);
  const [tickets, setTickets] = useState<TicketInfo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ended, setEnded] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const currentDelayRef = useRef<number>(BASE_INTERVAL);

  useEffect(() => {
    if (!invoiceId) return;
    let cancelled = false;
    currentDelayRef.current = BASE_INTERVAL;
    setEnded(false);
    setStatus(null);
    setTickets(null);
    setError(null);

    const schedule = (): void => {
      if (cancelled) return;
      if (document.visibilityState === 'hidden') {
        // Aguarda voltar a ficar visível antes de re-agendar
        intervalRef.current = window.setTimeout(schedule, 2000) as unknown as number;
        return;
      }
      intervalRef.current = window.setTimeout(async () => {
        if (cancelled) return;
        try {
          const res = await ticketService.getQrCodeStatus(invoiceId);
          if (cancelled) return;
          setStatus(res.status ?? null);
          if (res.status === TicketOrderStatus.Paid) {
            setTickets(res.tickets ?? []);
            setEnded(true);
            return;
          }
          if (res.status && TERMINAL_STATUSES.has(res.status)) {
            setEnded(true);
            return;
          }
          // Backoff exponencial até o teto
          currentDelayRef.current = Math.min(
            Math.round(currentDelayRef.current * 1.5),
            MAX_INTERVAL,
          );
          schedule();
        } catch (err) {
          if (cancelled) return;
          // Erro do backend — suspende o polling e expõe a mensagem ao usuário.
          setError(err instanceof Error ? err.message : 'Erro ao consultar status.');
          setEnded(true);
        }
      }, currentDelayRef.current) as unknown as number;
    };

    schedule();

    const onVisibility = (): void => {
      if (document.visibilityState === 'visible' && !ended && !cancelled) {
        if (intervalRef.current) {
          window.clearTimeout(intervalRef.current);
        }
        currentDelayRef.current = BASE_INTERVAL;
        schedule();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      if (intervalRef.current) {
        window.clearTimeout(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [invoiceId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { status, tickets, error, ended };
};
