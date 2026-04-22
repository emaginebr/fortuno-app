import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Sparkles } from 'lucide-react';
import { useUser } from 'nauth-react';
import { useLottery } from '@/hooks/useLottery';
import { useReferral } from '@/hooks/useReferral';
import { useMyLotteriesActions } from '@/hooks/useMyLotteriesActions';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { LotteryRow } from '@/components/dashboard/LotteryRow';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { LOTTERY_STATUS_LABEL, LotteryStatus } from '@/types/enums';

type StatusFilter = LotteryStatus | 'all';

const FILTERS: StatusFilter[] = [
  'all',
  LotteryStatus.Open,
  LotteryStatus.Draft,
  LotteryStatus.Closed,
  LotteryStatus.Cancelled,
];

const ctaPrimary = [
  'inline-flex items-center gap-2 px-5 py-2.5 rounded-full',
  'bg-fortuno-gold-intense text-fortuno-black font-bold text-[13px] tracking-wide',
  'shadow-[0_8px_22px_-6px_rgba(212,175,55,0.45),0_1px_0_rgba(255,255,255,0.35)_inset]',
  'transition-all duration-noir-fast',
  'hover:bg-fortuno-gold-soft hover:-translate-y-px',
  'focus-visible:outline-none focus-visible:shadow-gold-focus',
  'min-h-[40px]',
].join(' ');

export const MyLotteriesPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { referralCode, panel, loadPanel } = useReferral();
  const { myLotteries, loading, loadByStore } = useLottery();

  const storeId = Number(import.meta.env.VITE_FORTUNO_STORE_ID || 1);
  const [filter, setFilter] = useState<StatusFilter>(LotteryStatus.Open);

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
    void loadByStore(storeId);
  }, [loadPanel, loadByStore, storeId]);

  const ordered = useMemo(() => {
    const sorted = [...myLotteries].sort((a, b) => {
      if (a.status === LotteryStatus.Open && b.status !== LotteryStatus.Open) return -1;
      if (b.status === LotteryStatus.Open && a.status !== LotteryStatus.Open) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    if (filter === 'all') return sorted;
    return sorted.filter((l) => l.status === filter);
  }, [myLotteries, filter]);

  // MOCK: aguarda `panel.totalPoints` no backend — ver MOCKS.md.
  const totalPoints = Math.max(0, Math.floor(panel?.totalToReceive ?? 0));

  const totalCount = myLotteries.length;
  const isInitialLoading = loading && totalCount === 0;
  const isFullyEmpty = !loading && totalCount === 0;
  const isFilteredEmpty = !loading && totalCount > 0 && ordered.length === 0;

  const pillBase =
    'rounded-full px-4 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:shadow-gold-focus';
  const pillActive =
    'bg-fortuno-gold-intense text-fortuno-black shadow-[0_6px_14px_-6px_rgba(212,175,55,0.5)]';
  const pillIdle =
    'bg-white text-fortuno-black/70 border border-fortuno-black/10 hover:border-fortuno-gold-intense/45 hover:text-fortuno-black';

  return (
    <div className="min-h-screen bg-dash-page text-fortuno-black flex flex-col">
      <DashboardHeader
        user={user}
        referralCode={referralCode}
        totalPoints={totalPoints}
      />

      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 py-8 md:py-10 flex-1">
        <section aria-labelledby="my-lotteries-page-title">
          <header className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row mb-5">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h2
                id="my-lotteries-page-title"
                className="font-display text-fortuno-black text-[clamp(22px,2.4vw,28px)] leading-tight"
              >
                {t('dashboard.myLotteriesPageTitlePrefix')}{' '}
                <span className="italic">
                  {t('dashboard.myLotteriesPageTitleSuffix')}
                </span>
              </h2>
              {totalCount > 0 ? (
                <span className="text-xs text-fortuno-black/50">
                  ·{' '}
                  <strong className="font-semibold text-fortuno-black/80">
                    {totalCount}
                  </strong>{' '}
                  {t('dashboard.myLotteriesCountSuffix')}
                </span>
              ) : null}
            </div>

            <Link to="/meus-sorteios/novo" className={ctaPrimary}>
              <Plus className="w-4 h-4" aria-hidden="true" />
              {t('dashboard.myLotteriesNew')}
            </Link>
          </header>

          {totalCount > 0 ? (
            <div
              className="flex flex-wrap gap-2 mb-5"
              role="group"
              aria-label="Filtro de status"
            >
              {FILTERS.map((status) => {
                const active = filter === status;
                const label =
                  status === 'all' ? t('dashboard.filterAll') : LOTTERY_STATUS_LABEL[status];
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFilter(status)}
                    aria-pressed={active}
                    className={[pillBase, active ? pillActive : pillIdle].join(' ')}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          ) : null}

          {isInitialLoading ? (
            <LoadingSpinner label="Carregando seus sorteios..." />
          ) : isFullyEmpty ? (
            <div
              className={[
                'mt-6 rounded-2xl border border-fortuno-gold-intense/25 bg-white',
                'px-8 py-12 md:py-16 text-center',
                'shadow-[0_8px_30px_-16px_rgba(10,42,32,0.18)]',
              ].join(' ')}
            >
              <div
                className={[
                  'mx-auto w-14 h-14 rounded-full bg-marker-done',
                  'grid place-items-center border border-fortuno-gold-soft/40 mb-5',
                ].join(' ')}
                aria-hidden="true"
              >
                <Sparkles className="w-6 h-6 text-fortuno-gold-intense" />
              </div>
              <h3 className="font-display text-[clamp(20px,2vw,24px)] leading-tight text-fortuno-black">
                {t('dashboard.myLotteriesEmptyTitle')}
              </h3>
              <p className="mt-2 text-sm text-fortuno-black/65 max-w-md mx-auto">
                {t('dashboard.myLotteriesEmptyHint')}
              </p>
              <Link to="/meus-sorteios/novo" className={`${ctaPrimary} mt-6`}>
                <Plus className="w-4 h-4" aria-hidden="true" />
                {t('dashboard.myLotteriesEmptyCta')}
              </Link>
            </div>
          ) : isFilteredEmpty ? (
            <p
              className={[
                'mt-12 text-center font-display italic text-fortuno-gold-intense',
                'text-[clamp(16px,1.6vw,20px)]',
              ].join(' ')}
            >
              {t('dashboard.myLotteriesEmptyFiltered')}
            </p>
          ) : (
            <ul className="flex flex-col gap-2.5" role="list">
              {ordered.map((lottery) => (
                <LotteryRow
                  key={lottery.lotteryId}
                  lottery={lottery}
                  onPublish={handlePublish}
                  onRevertToDraft={handleRevertToDraft}
                  onClose={handleClose}
                  onCancel={openCancel}
                  onDelete={openDelete}
                  busy={busy}
                />
              ))}
            </ul>
          )}
        </section>
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
