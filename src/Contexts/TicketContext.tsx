import { createContext, useCallback, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { ticketService } from '@/Services/ticketService';
import type {
  TicketInfo,
  TicketOrderRequest,
  TicketQRCodeInfo,
  TicketQRCodeStatusInfo,
  TicketSearchQuery,
} from '@/types/ticket';

export interface TicketPagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface TicketContextType {
  tickets: TicketInfo[];
  pagination: TicketPagination;
  loading: boolean;
  error: string | null;
  loadMine: (
    query?: TicketSearchQuery,
    page?: number,
    pageSize?: number,
  ) => Promise<void>;
  createQrCode: (req: TicketOrderRequest) => Promise<TicketQRCodeInfo | null>;
  getStatus: (invoiceId: number) => Promise<TicketQRCodeStatusInfo | null>;
  simulatePayment: (invoiceId: number) => Promise<void>;
  clearError: () => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [tickets, setTickets] = useState<TicketInfo[]>([]);
  const [pagination, setPagination] = useState<TicketPagination>({
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fail = useCallback((err: unknown, msg: string) => {
    toast.error(msg);
    setError(err instanceof Error ? err.message : msg);
  }, []);

  const loadMine = useCallback(
    async (
      query: TicketSearchQuery = {},
      page = 1,
      pageSize = 20,
    ): Promise<void> => {
      setLoading(true);
      try {
        const res = await ticketService.listMine(query, page, pageSize);
        setTickets(res.items);
        setPagination({
          page: res.page,
          pageSize: res.pageSize,
          totalCount: res.totalCount,
          totalPages: res.totalPages,
        });
        setError(null);
      } catch (err) {
        fail(err, 'Falha ao carregar seus bilhetes.');
      } finally {
        setLoading(false);
      }
    },
    [fail],
  );

  const createQrCode = useCallback(
    async (req: TicketOrderRequest): Promise<TicketQRCodeInfo | null> => {
      try {
        return await ticketService.createQrCode(req);
      } catch (err) {
        fail(err, 'Falha ao gerar QR Code de pagamento.');
        return null;
      }
    },
    [fail],
  );

  const getStatus = useCallback(
    async (invoiceId: number): Promise<TicketQRCodeStatusInfo | null> => {
      try {
        return await ticketService.getQrCodeStatus(invoiceId);
      } catch (err) {
        fail(err, 'Falha ao consultar status do pagamento.');
        return null;
      }
    },
    [fail],
  );

  const simulatePayment = useCallback(async (invoiceId: number): Promise<void> => {
    await ticketService.simulatePayment(invoiceId);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <TicketContext.Provider
      value={{
        tickets,
        pagination,
        loading,
        error,
        loadMine,
        createQrCode,
        getStatus,
        simulatePayment,
        clearError,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export default TicketContext;
