import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLottery } from '@/hooks/useLottery';
import { useCheckout } from '@/hooks/useCheckout';
import { useLotteryImage } from '@/hooks/useLotteryImage';
import { useLotteryCombo } from '@/hooks/useLotteryCombo';
import { useRaffle } from '@/hooks/useRaffle';
import { useRaffleAward } from '@/hooks/useRaffleAward';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Medal, Trophy } from 'lucide-react';
import { LotteryHero } from '@/components/lottery/LotteryHero';
import { LotteryDescription } from '@/components/lottery/LotteryDescription';
import { RaffleTimeline } from '@/components/lottery/RaffleTimeline';
import { PrizesGrid } from '@/components/lottery/PrizesGrid';
import { CheckoutPanel } from '@/components/lottery/CheckoutPanel';
import { StickyBuyBar } from '@/components/lottery/StickyBuyBar';
import { RulesAndPolicyModal } from '@/components/lottery/modals/RulesAndPolicyModal';
import { RaffleDetailModal } from '@/components/lottery/modals/RaffleDetailModal';

interface MedalPalette {
  bg: string;
  border: string;
  fg: string;
  label: string;
}

const medalStyle = (position: number): MedalPalette => {
  if (position === 1) {
    return {
      bg: 'linear-gradient(135deg, #f4d77a 0%, #d4af37 60%, #a37a1a 100%)',
      border: 'rgba(184, 150, 63, 0.55)',
      fg: '#4a330b',
      label: '#8a6a18',
    };
  }
  if (position === 2) {
    return {
      bg: 'linear-gradient(135deg, #eaeaea 0%, #bfc0c2 60%, #7e8284 100%)',
      border: 'rgba(126, 130, 132, 0.5)',
      fg: '#2f3234',
      label: '#5a5e61',
    };
  }
  if (position === 3) {
    return {
      bg: 'linear-gradient(135deg, #d89671 0%, #a85f32 60%, #6e3a1a 100%)',
      border: 'rgba(168, 95, 50, 0.5)',
      fg: '#3c1d0b',
      label: '#7a4220',
    };
  }
  return {
    bg: 'rgba(11, 11, 11, 0.06)',
    border: 'rgba(11, 11, 11, 0.1)',
    fg: 'rgba(11, 11, 11, 0.5)',
    label: 'rgba(11, 11, 11, 0.45)',
  };
};

type ModalState =
  | { type: 'none' }
  | { type: 'rules' }
  | { type: 'privacy' }
  | { type: 'raffle'; raffleId: number };

export const LotteryDetailPage = (): JSX.Element => {
  const { slug } = useParams();
  const { currentLottery, loading, loadBySlug } = useLottery();
  const { images, loadByLottery: loadImages } = useLotteryImage();
  const { combos, loadByLottery: loadCombos } = useLotteryCombo();
  const { raffles, loadByLottery: loadRaffles } = useRaffle();
  const { awards, loadByRaffles: loadAwards } = useRaffleAward();
  const checkout = useCheckout();
  const navigate = useNavigate();

  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [modal, setModal] = useState<ModalState>({ type: 'none' });

  useEffect(() => {
    if (slug) void loadBySlug(slug);
  }, [slug, loadBySlug]);

  useEffect(() => {
    if (!currentLottery?.lotteryId) return;
    void loadImages(currentLottery.lotteryId);
    void loadCombos(currentLottery.lotteryId);
    void loadRaffles(currentLottery.lotteryId);
  }, [currentLottery?.lotteryId, loadImages, loadCombos, loadRaffles]);

  const sortedRaffles = useMemo(
    () =>
      [...raffles].sort(
        (a, b) =>
          new Date(a.raffleDatetime).getTime() -
          new Date(b.raffleDatetime).getTime(),
      ),
    [raffles],
  );

  useEffect(() => {
    const ids = sortedRaffles.map((r) => r.raffleId);
    if (ids.length > 0) void loadAwards(ids);
  }, [sortedRaffles, loadAwards]);

  const raffleById = useMemo(() => {
    const map = new Map<number, (typeof sortedRaffles)[number]>();
    sortedRaffles.forEach((r) => map.set(r.raffleId, r));
    return map;
  }, [sortedRaffles]);

  const prizeList = useMemo(
    () =>
      awards
        .filter((a) => raffleById.has(a.raffleId))
        .sort((a, b) => a.position - b.position),
    [awards, raffleById],
  );

  const awardsCountByRaffleId = useMemo(() => {
    const counts: Record<number, number> = {};
    awards.forEach((a) => {
      counts[a.raffleId] = (counts[a.raffleId] ?? 0) + 1;
    });
    return counts;
  }, [awards]);

  const awardsForActiveRaffle = useMemo(
    () =>
      modal.type === 'raffle'
        ? awards.filter((a) => a.raffleId === modal.raffleId)
        : [],
    [awards, modal],
  );

  const nextRaffle = sortedRaffles[0];

  if (loading || !currentLottery) {
    return <LoadingSpinner label="Carregando sorteio..." />;
  }

  const startCheckout = (): void => {
    checkout.setLotteryId(currentLottery.lotteryId);
    checkout.setQuantity(selectedQuantity);
    const slugOrId = currentLottery.slug ?? currentLottery.lotteryId;
    navigate(`/checkout/${slugOrId}?qty=${selectedQuantity}`);
  };

  const openRaffle = (raffleId: number): void =>
    setModal({ type: 'raffle', raffleId });
  const closeModal = (): void => setModal({ type: 'none' });

  const activeRaffleIndex =
    modal.type === 'raffle'
      ? sortedRaffles.findIndex((r) => r.raffleId === modal.raffleId)
      : -1;
  const activeRaffle =
    activeRaffleIndex >= 0 ? sortedRaffles[activeRaffleIndex] : undefined;

  return (
    <div className="min-h-screen bg-dash-page text-fortuno-black">
      <LotteryHero
        lottery={currentLottery}
        images={images}
        nextRaffleAt={nextRaffle?.raffleDatetime}
        onOpenRules={
          currentLottery.rulesMd ? () => setModal({ type: 'rules' }) : undefined
        }
        onOpenPrivacy={
          currentLottery.privacyPolicyMd
            ? () => setModal({ type: 'privacy' })
            : undefined
        }
      />

      <section className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 pb-12">
        <div className="flex flex-col gap-10">
          {currentLottery.descriptionMd && (
            <LotteryDescription
              markdown={currentLottery.descriptionMd}
              title={currentLottery.name}
            />
          )}

          {sortedRaffles.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr] items-start">
              <RaffleTimeline
                raffles={sortedRaffles}
                awardsCountByRaffleId={awardsCountByRaffleId}
                onOpenRaffle={openRaffle}
              />
              <aside
                aria-labelledby="prizes-sidecard-title"
                className="rounded-[22px] bg-white border border-[color:var(--card-paper-border)] shadow-paper p-5 relative before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-px before:bg-card-gold-bar"
              >
                <header className="flex items-center gap-2 mb-4">
                  <Trophy
                    className="w-4 h-4 text-fortuno-gold-intense"
                    aria-hidden="true"
                  />
                  <h3
                    id="prizes-sidecard-title"
                    className="font-display text-fortuno-black text-[18px] leading-tight"
                  >
                    Prêmios{' '}
                    <span className="text-sm text-fortuno-black/55">
                      ({prizeList.length})
                    </span>
                  </h3>
                </header>
                {prizeList.length === 0 ? (
                  <p className="text-[12px] text-fortuno-black/55">
                    Ainda não há prêmios cadastrados.
                  </p>
                ) : (
                  <ul className="flex flex-col divide-y divide-fortuno-black/[0.06]">
                    {prizeList.map((award) => {
                      const raffle = raffleById.get(award.raffleId);
                      const medal = medalStyle(award.position);
                      return (
                        <li
                          key={award.raffleAwardId}
                          className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                        >
                          <span
                            className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
                            style={{ background: medal.bg, borderColor: medal.border }}
                            aria-hidden="true"
                          >
                            <Medal
                              className="h-4 w-4"
                              style={{ color: medal.fg }}
                            />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p
                              className="text-[10px] font-bold uppercase tracking-wider"
                              style={{ color: medal.label }}
                            >
                              {award.position}º lugar
                            </p>
                            <p className="text-sm font-semibold text-fortuno-black line-clamp-2">
                              {award.description}
                            </p>
                            {raffle && (
                              <p className="mt-0.5 text-[11px] text-fortuno-black/55">
                                {new Date(raffle.raffleDatetime).toLocaleDateString('pt-BR')}
                              </p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </aside>
            </div>
          )}

          <CheckoutPanel
            combos={combos}
            ticketPrice={currentLottery.ticketPrice}
            minQty={currentLottery.ticketMin}
            maxQty={currentLottery.ticketMax}
            initialQuantity={selectedQuantity}
            onChange={setSelectedQuantity}
            onBuy={startCheckout}
          />

          {sortedRaffles.length > 0 && (
            <PrizesGrid raffles={sortedRaffles} onOpenRaffle={openRaffle} />
          )}
        </div>
      </section>

      <StickyBuyBar
        quantity={selectedQuantity}
        ticketPrice={currentLottery.ticketPrice}
        combos={combos}
        onBuy={startCheckout}
      />

      {modal.type === 'rules' && currentLottery.rulesMd && (
        <RulesAndPolicyModal
          mode="rules"
          markdown={currentLottery.rulesMd}
          pdfFilename={`${currentLottery.slug}-regras`}
          lotteryName={currentLottery.name}
          onClose={closeModal}
        />
      )}
      {modal.type === 'privacy' && currentLottery.privacyPolicyMd && (
        <RulesAndPolicyModal
          mode="privacy"
          markdown={currentLottery.privacyPolicyMd}
          pdfFilename={`${currentLottery.slug}-politica`}
          lotteryName={currentLottery.name}
          onClose={closeModal}
        />
      )}
      {modal.type === 'raffle' && activeRaffle && (
        <RaffleDetailModal
          raffle={activeRaffle}
          index={activeRaffleIndex + 1}
          awards={awardsForActiveRaffle}
          onClose={closeModal}
        />
      )}
    </div>
  );
};
