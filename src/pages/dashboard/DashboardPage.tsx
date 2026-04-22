import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from 'nauth-react';
import { useReferral } from '@/hooks/useReferral';
import { useTicket } from '@/hooks/useTicket';
import { useLottery } from '@/hooks/useLottery';
import { useMyLotteriesActions } from '@/hooks/useMyLotteriesActions';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { LinkedStatGrid } from '@/components/dashboard/LinkedStatGrid';
import { MyLotteriesPreview } from '@/components/dashboard/MyLotteriesPreview';
import { ConfirmModal } from '@/components/common/ConfirmModal';

export const DashboardPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { referralCode, panel, loadPanel } = useReferral();
  const { tickets, loadMine } = useTicket();
  const { myLotteries, loadByStore } = useLottery();

  const storeId = Number(import.meta.env.VITE_FORTUNO_STORE_ID || 1);

  const {
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
  } = useMyLotteriesActions(storeId);

  useEffect(() => {
    void loadPanel();
    void loadMine();
    void loadByStore(storeId);
  }, [loadPanel, loadMine, loadByStore, storeId]);

  const lotteryCount = useMemo(
    () => new Set(tickets.map((ticket) => ticket.lotteryId)).size,
    [tickets],
  );

  // MOCK: aguarda `panel.totalPoints` no backend — ver MOCKS.md.
  // Enquanto o backend não expõe o campo inteiro, truncamos `totalToReceive`
  // (BRL) para um saldo determinístico >= 0. Valor semântico: saldo em pts.
  const totalPoints = Math.max(0, Math.floor(panel?.totalToReceive ?? 0));

  return (
    <div className="min-h-screen bg-dash-page text-fortuno-black flex flex-col">
      <DashboardHeader
        user={user}
        referralCode={referralCode}
        totalPoints={totalPoints}
      />

      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 py-8 md:py-10 flex-1">
        <LinkedStatGrid
          ticketsCount={tickets.length}
          lotteriesPlaying={lotteryCount}
          referrals={panel?.totalPurchases ?? 0}
        />

        {myLotteries.length > 0 && (
          <MyLotteriesPreview
            lotteries={myLotteries}
            max={3}
            className="mt-8 md:mt-10"
            onPublish={handlePublish}
            onRevertToDraft={handleRevertToDraft}
            onClose={handleClose}
            onCancel={openCancel}
            onDelete={openDelete}
            busy={busy}
          />
        )}
      </div>

      <ConfirmModal
        open={cancelId !== null}
        title={t('dashboard.cancelLotteryTitle')}
        message={t('dashboard.cancelLotteryMessage')}
        confirmLabel={t('dashboard.cancelLotteryConfirm')}
        variant="danger"
        busy={busy}
        onCancel={closeCancel}
        onConfirm={() => {
          void confirmCancel();
        }}
      >
        <textarea
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder={t('dashboard.cancelLotteryReasonPlaceholder')}
          className="w-full rounded-md border border-fortuno-black/20 p-3 focus-visible:outline-none focus-visible:shadow-gold-focus"
          rows={4}
        />
      </ConfirmModal>

      <ConfirmModal
        open={deleteId !== null}
        title={t('dashboard.deleteLotteryTitle')}
        message={t('dashboard.deleteLotteryMessage')}
        confirmLabel={t('dashboard.deleteLotteryConfirm')}
        variant="danger"
        busy={busy}
        onCancel={closeDelete}
        onConfirm={() => {
          void confirmDelete();
        }}
      />
    </div>
  );
};
