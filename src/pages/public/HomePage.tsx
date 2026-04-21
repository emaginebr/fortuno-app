import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLottery } from '@/hooks/useLottery';
import { LotteryCarousel } from '@/components/home/LotteryCarousel';
import { FraudWarning } from '@/components/home/FraudWarning';
import { SecurityBlock } from '@/components/home/SecurityBlock';
import { EasyToPlayBlock } from '@/components/home/EasyToPlayBlock';

export const HomePage = (): JSX.Element => {
  const { openLotteries, loadOpen } = useLottery();

  useEffect(() => {
    void loadOpen();
  }, [loadOpen]);

  return (
    <>
      <section className="bg-fortuno-green-deep pt-16 text-fortuno-offwhite">
        <div className="mx-auto max-w-7xl px-4 pb-16">
          <div className="mb-10 text-center">
            <img src="/logo-light.png" alt="Fortuno" className="mx-auto h-20" />
            <h1 className="mt-8 font-display text-4xl md:text-5xl">A sorte está próxima.</h1>
            <p className="mt-4 text-fortuno-offwhite/80">
              Participe dos sorteios Fortuno e concorra a prêmios todos os dias.
            </p>
            <Link to="/sorteios" className="btn-primary mt-8">
              Ver sorteios
            </Link>
          </div>

          <LotteryCarousel lotteries={openLotteries} />
        </div>
      </section>

      <FraudWarning />
      <SecurityBlock />
      <EasyToPlayBlock />
    </>
  );
};
