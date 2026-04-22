import { useCallback, useState } from 'react';
import { useLottery } from '@/hooks/useLottery';

export interface UseMyLotteriesActionsResult {
  /** Flag true enquanto publish/close/cancel/delete em voo. */
  busy: boolean;
  /** ID da loteria sob confirmação de cancelamento (ou null). */
  cancelId: number | null;
  /** Texto do motivo de cancelamento no modal. */
  cancelReason: string;
  setCancelReason: (value: string) => void;
  /** ID da loteria sob confirmação de exclusão (ou null). */
  deleteId: number | null;
  /** Handler pronto para LotteryRow.onPublish. Recarrega myLotteries após sucesso. */
  handlePublish: (lotteryId: number) => Promise<void>;
  /** Handler pronto para LotteryRow.onRevertToDraft. Recarrega myLotteries após sucesso. */
  handleRevertToDraft: (lotteryId: number) => Promise<void>;
  /** Handler pronto para LotteryRow.onClose. Recarrega myLotteries após sucesso. */
  handleClose: (lotteryId: number) => Promise<void>;
  /** Handler pronto para LotteryRow.onCancel — apenas abre o modal. */
  openCancel: (lotteryId: number) => void;
  /** Fecha o modal e limpa o estado de motivo. */
  closeCancel: () => void;
  /** Confirma o cancelamento. Retorna true se enviado com sucesso. */
  confirmCancel: () => Promise<boolean>;
  /** Handler pronto para LotteryRow.onDelete — apenas abre o modal de exclusão. */
  openDelete: (lotteryId: number) => void;
  /** Fecha o modal de exclusão. */
  closeDelete: () => void;
  /** Confirma a exclusão. Retorna true se enviado com sucesso. */
  confirmDelete: () => Promise<boolean>;
}

/**
 * Hook utilitário compartilhado entre DashboardPage (preview) e MyLotteriesPage.
 * Encapsula:
 *  - chamadas `publish` / `close` / `cancel` via `useLottery`;
 *  - recarga de `loadByStore` após qualquer mutação bem-sucedida;
 *  - estado do `ConfirmModal` de cancelamento (id + motivo).
 *
 * @param storeId Identificador da loja a ser recarregada após mutações.
 */
export const useMyLotteriesActions = (storeId: number): UseMyLotteriesActionsResult => {
  const { publish, revertToDraft, close, cancel, remove, loadByStore } = useLottery();
  const [busy, setBusy] = useState(false);
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handlePublish = useCallback(
    async (lotteryId: number): Promise<void> => {
      setBusy(true);
      const ok = await publish(lotteryId);
      if (ok) await loadByStore(storeId);
      setBusy(false);
    },
    [publish, loadByStore, storeId],
  );

  const handleRevertToDraft = useCallback(
    async (lotteryId: number): Promise<void> => {
      setBusy(true);
      const ok = await revertToDraft(lotteryId);
      if (ok) await loadByStore(storeId);
      setBusy(false);
    },
    [revertToDraft, loadByStore, storeId],
  );

  const handleClose = useCallback(
    async (lotteryId: number): Promise<void> => {
      setBusy(true);
      const ok = await close(lotteryId);
      if (ok) await loadByStore(storeId);
      setBusy(false);
    },
    [close, loadByStore, storeId],
  );

  const openCancel = useCallback((lotteryId: number): void => {
    setCancelId(lotteryId);
    setCancelReason('');
  }, []);

  const closeCancel = useCallback((): void => {
    setCancelId(null);
    setCancelReason('');
  }, []);

  const confirmCancel = useCallback(async (): Promise<boolean> => {
    if (cancelId === null || cancelReason.trim().length < 10) return false;
    setBusy(true);
    const ok = await cancel(cancelId, { reason: cancelReason.trim() });
    setBusy(false);
    if (ok) {
      setCancelId(null);
      setCancelReason('');
      await loadByStore(storeId);
    }
    return ok;
  }, [cancel, cancelId, cancelReason, loadByStore, storeId]);

  const openDelete = useCallback((lotteryId: number): void => {
    setDeleteId(lotteryId);
  }, []);

  const closeDelete = useCallback((): void => {
    setDeleteId(null);
  }, []);

  const confirmDelete = useCallback(async (): Promise<boolean> => {
    if (deleteId === null) return false;
    setBusy(true);
    const ok = await remove(deleteId);
    setBusy(false);
    if (ok) {
      setDeleteId(null);
      await loadByStore(storeId);
    }
    return ok;
  }, [remove, deleteId, loadByStore, storeId]);

  return {
    busy,
    cancelId,
    cancelReason,
    setCancelReason,
    deleteId,
    handlePublish,
    handleRevertToDraft,
    handleClose,
    openCancel,
    closeCancel,
    confirmCancel,
    openDelete,
    closeDelete,
    confirmDelete,
  };
};
