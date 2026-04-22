import { useEffect, useMemo } from 'react';
import { useLottery } from '@/hooks/useLottery';
import { HeroFeaturedLottery } from '@/components/home/HeroFeaturedLottery';
import { StatsBand } from '@/components/home/StatsBand';
import { LotteryCarouselPremium } from '@/components/home/LotteryCarouselPremium';
import { FraudCertificate } from '@/components/home/FraudCertificate';
import { SecurityPillars } from '@/components/home/SecurityPillars';
import { HowItWorksTimeline } from '@/components/home/HowItWorksTimeline';
import { FinalCta } from '@/components/home/FinalCta';

export const HomePage = (): JSX.Element => {
  const { openLotteries, loadOpen } = useLottery();

  useEffect(() => {
    void loadOpen();
  }, [loadOpen]);

  // Sorteio em destaque: hoje escolhe o de maior totalPrizeValue.
  // Quando backend expuser `isFeatured` em LotteryInfo, o find abaixo pega
  // explicitamente — ver MOCKS.md.
  const featuredLottery = useMemo(() => {
    if (openLotteries.length === 0) return undefined;
    return [...openLotteries].sort(
      (a, b) => (b.totalPrizeValue ?? 0) - (a.totalPrizeValue ?? 0),
    )[0];
  }, [openLotteries]);

  const nextRaffleAt = featuredLottery?.raffles?.[0]?.raffleDatetime;

  return (
    <main className="bg-noir-page text-fortuno-offwhite min-h-screen">
      <HeroFeaturedLottery featuredLottery={featuredLottery} />
      <StatsBand />
      <LotteryCarouselPremium lotteries={openLotteries} />
      <FraudCertificate />
      <SecurityPillars />
      <HowItWorksTimeline />
      <FinalCta nextRaffleAt={nextRaffleAt} />
    </main>
  );
};
