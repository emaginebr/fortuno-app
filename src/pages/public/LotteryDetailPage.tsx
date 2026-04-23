import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLottery } from '@/hooks/useLottery';
import { useCheckout } from '@/hooks/useCheckout';
import { useLotteryImage } from '@/hooks/useLotteryImage';
import { useLotteryCombo } from '@/hooks/useLotteryCombo';
import { useRaffle } from '@/hooks/useRaffle';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { LotteryHero } from '@/components/lottery/LotteryHero';
import { LotteryDescription } from '@/components/lottery/LotteryDescription';
import { RaffleTimeline } from '@/components/lottery/RaffleTimeline';
import { PrizesGrid } from '@/components/lottery/PrizesGrid';
import { CheckoutPanel } from '@/components/lottery/CheckoutPanel';
import { StickyBuyBar } from '@/components/lottery/StickyBuyBar';
import { RulesAndPolicyModal } from '@/components/lottery/modals/RulesAndPolicyModal';
import { RaffleDetailModal } from '@/components/lottery/modals/RaffleDetailModal';

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

  const nextRaffle = sortedRaffles[0];

  if (loading || !currentLottery) {
    return <LoadingSpinner label="Carregando sorteio..." />;
  }

  const startCheckout = (): void => {
    checkout.setLotteryId(currentLottery.lotteryId);
    checkout.setQuantity(selectedQuantity);
    navigate(`/checkout/${currentLottery.lotteryId}`);
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
            <RaffleTimeline raffles={sortedRaffles} onOpenRaffle={openRaffle} />
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
          onClose={closeModal}
        />
      )}
    </div>
  );
};
