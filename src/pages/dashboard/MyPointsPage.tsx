import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from 'nauth-react';
import { useReferral } from '@/hooks/useReferral';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MyPointsToolbar } from '@/components/points/MyPointsToolbar';
import type {
  LotteryFilter,
  PeriodFilter,
  SortOption,
} from '@/components/points/MyPointsToolbar';
import { PointsBalanceHero } from '@/components/points/PointsBalanceHero';
import { PointsBreakdownTable } from '@/components/points/PointsBreakdownTable';
import { PointsBreakdownCards } from '@/components/points/PointsBreakdownCards';
import { PointsBreakdownDetailModal } from '@/components/points/PointsBreakdownDetailModal';
import { ShareReferralModal } from '@/components/points/ShareReferralModal';
import { PointsDisclaimerCard } from '@/components/points/PointsDisclaimerCard';
import { PointsEmptyState } from '@/components/points/PointsEmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import type { ReferrerLotteryBreakdown } from '@/types/referral';

export const MyPointsPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { panel, loading, loadPanel } = useReferral();

  const [shareOpen, setShareOpen] = useState<boolean>(false);
  const [detailRow, setDetailRow] = useState<ReferrerLotteryBreakdown | null>(null);

  const [lotteryFilter, setLotteryFilter] = useState<LotteryFilter>('all');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
  const [sort, setSort] = useState<SortOption>('points');

  useEffect(() => {
    void loadPanel();
  }, [loadPanel]);

  // MOCK — `panel.totalPoints` ainda não existe no backend. Derivamos de
  // `totalToReceive` (idem dashboard). Registro: MOCKS.md → "Dashboard —
  // panel.totalPoints".
  const totalPoints = useMemo<number>(
    () => Math.max(0, Math.floor(panel?.totalToReceive ?? 0)),
    [panel?.totalToReceive],
  );

  const filteredRows = useMemo<ReferrerLotteryBreakdown[]>(() => {
    if (!panel) return [];
    let out = panel.byLottery;
    if (lotteryFilter !== 'all') {
      out = out.filter((r) => r.lotteryId === lotteryFilter);
    }
    // periodFilter: MOCK até o backend expor data por linha. Sem efeito por enquanto.
    if (sort === 'points') {
      out = [...out].sort((a, b) => b.toReceive - a.toReceive);
    } else if (sort === 'purchases') {
      out = [...out].sort((a, b) => b.purchases - a.purchases);
    }
    // sort === 'recent' depende de ordem do backend; por hora == ordem natural.
    return out;
  }, [panel, lotteryFilter, sort]);

  const biggestRow = useMemo<ReferrerLotteryBreakdown | undefined>(() => {
    if (!panel || panel.byLottery.length === 0) return undefined;
    return panel.byLottery.reduce<ReferrerLotteryBreakdown | undefined>(
      (acc, r) => (!acc || r.purchases > acc.purchases ? r : acc),
      undefined,
    );
  }, [panel]);

  if (loading && !panel) {
    return (
      <main className="min-h-screen bg-dash-page text-fortuno-black flex flex-col">
        <DashboardHeader
          user={user}
          referralCode={undefined}
          totalPoints={0}
          pointsChipCurrentPage
        />
        <div className="flex-1 grid place-items-center">
          <LoadingSpinner label={t('myPoints.loadingLabel')} />
        </div>
      </main>
    );
  }

  if (!panel) {
    return (
      <main className="min-h-screen bg-dash-page text-fortuno-black flex flex-col">
        <DashboardHeader
          user={user}
          referralCode={undefined}
          totalPoints={0}
          pointsChipCurrentPage
        />
        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 py-10 flex-1">
          <PointsEmptyState onShare={() => setShareOpen(true)} />
        </div>
        <ShareReferralModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          referralCode=""
        />
      </main>
    );
  }

  const hasReferrals = panel.byLottery.length > 0;

  return (
    <main className="min-h-screen bg-dash-page text-fortuno-black flex flex-col">
      <DashboardHeader
        user={user}
        referralCode={panel.referralCode}
        totalPoints={totalPoints}
        pointsChipCurrentPage
      />

      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 py-8 md:py-10 flex-1 flex flex-col gap-8 md:gap-10">
        <MyPointsToolbar
          totalPurchases={panel.totalPurchases}
          totalPoints={totalPoints}
          lotteries={panel.byLottery}
          lotteryFilter={lotteryFilter}
          periodFilter={periodFilter}
          sort={sort}
          onChangeLottery={setLotteryFilter}
          onChangePeriod={setPeriodFilter}
          onChangeSort={setSort}
          onShare={() => setShareOpen(true)}
        />

        {hasReferrals ? (
          <>
            <PointsBalanceHero
              totalPoints={totalPoints}
              totalPurchases={panel.totalPurchases}
              lotteriesReached={panel.byLottery.length}
              biggestPurchaseInOne={biggestRow?.purchases}
              biggestLotteryName={biggestRow?.lotteryName}
              estimatedBRL={panel.totalToReceive}
            />

            <section aria-labelledby="mp-breakdown-title">
              <div className="mp-section-heading">
                <span className="section-eyebrow">
                  {t('myPoints.breakdown.eyebrow')}
                </span>
                <h2 id="mp-breakdown-title">
                  {t('myPoints.breakdown.titleStart')}{' '}
                  <span className="italic-gold">
                    {t('myPoints.breakdown.titleEnd')}
                  </span>
                </h2>
                <p>{t('myPoints.breakdown.subtitle')}</p>
              </div>

              <div className="hidden md:block">
                <PointsBreakdownTable
                  rows={filteredRows}
                  onOpenDetail={setDetailRow}
                  totalPointsOverride={totalPoints}
                />
              </div>
              <div className="md:hidden">
                <PointsBreakdownCards rows={filteredRows} onOpenDetail={setDetailRow} />
              </div>
            </section>
          </>
        ) : (
          <PointsEmptyState onShare={() => setShareOpen(true)} />
        )}

        <PointsDisclaimerCard note={panel.note} />
      </div>

      <ShareReferralModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        referralCode={panel.referralCode}
      />
      <PointsBreakdownDetailModal
        row={detailRow}
        onClose={() => setDetailRow(null)}
      />
    </main>
  );
};
