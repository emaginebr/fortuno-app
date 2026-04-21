import { Link } from 'react-router-dom';
import { useKeenSlider } from 'keen-slider/react';
import type { LotteryInfo } from '@/types/lottery';
import { formatBRL } from '@/utils/currency';

interface LotteryCarouselProps {
  lotteries: LotteryInfo[];
}

export const LotteryCarousel = ({ lotteries }: LotteryCarouselProps): JSX.Element => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: lotteries.length > 1,
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      '(min-width: 768px)': { slides: { perView: 2, spacing: 16 } },
      '(min-width: 1024px)': { slides: { perView: 3, spacing: 24 } },
    },
  });

  if (lotteries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-fortuno-gold-soft/40 p-10 text-center text-fortuno-offwhite/70">
        Nenhum sorteio em andamento no momento. Volte em breve!
      </div>
    );
  }

  return (
    <div ref={sliderRef} className="keen-slider">
      {lotteries.map((lottery) => {
        const cover = lottery.images?.[0]?.imageUrl;
        return (
          <div
            key={lottery.lotteryId}
            className="keen-slider__slide overflow-hidden rounded-xl bg-fortuno-green-elegant shadow-lg"
          >
            <div className="aspect-video bg-fortuno-green-deep">
              {cover ? (
                <img src={cover} alt={lottery.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-5xl text-fortuno-gold-soft">
                  🎟
                </div>
              )}
            </div>
            <div className="p-5 text-fortuno-offwhite">
              <h3 className="font-display text-xl">{lottery.name}</h3>
              <p className="mt-2 text-sm text-fortuno-offwhite/70">
                Prêmio total{' '}
                <strong className="text-fortuno-gold-soft">
                  {formatBRL(lottery.totalPrizeValue)}
                </strong>
              </p>
              <Link
                to={`/sorteios/${lottery.slug}`}
                className="mt-4 inline-flex items-center rounded-md bg-fortuno-gold-intense px-4 py-2 font-semibold text-fortuno-black hover:bg-fortuno-gold-soft"
              >
                Compre já
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};
