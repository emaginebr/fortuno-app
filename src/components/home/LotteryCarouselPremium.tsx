import { type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { useKeenSlider } from 'keen-slider/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { LotteryInfo } from '@/types/lottery';
import { LotteryCardPremium } from '@/components/lottery/LotteryCardPremium';

export interface LotteryCarouselPremiumProps {
  lotteries: LotteryInfo[];
}

const EmptyLotteries = (): JSX.Element => (
  <div className="rounded-3xl border border-dashed border-fortuno-gold-soft/35 bg-[rgba(7,32,26,0.4)] p-12 text-center text-fortuno-offwhite/70">
    <p className="font-display text-2xl text-fortuno-offwhite mb-2">
      Nenhum sorteio em andamento
    </p>
    <p className="text-sm text-fortuno-offwhite/65">
      Volte em breve — estamos preparando a próxima edição.
    </p>
  </div>
);

export const LotteryCarouselPremium = ({
  lotteries,
}: LotteryCarouselPremiumProps): JSX.Element => {
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: lotteries.length > 3,
    slides: { perView: 1, spacing: 16 },
    breakpoints: {
      '(min-width: 768px)': { slides: { perView: 2, spacing: 20 } },
      '(min-width: 1024px)': { slides: { perView: 3, spacing: 24 } },
    },
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      slider.current?.next();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      slider.current?.prev();
    }
  };

  return (
    <section
      id="sorteios"
      className="relative py-20 md:py-28"
      aria-roledescription="carousel"
      aria-label="Sorteios abertos"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div>
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-fortuno-gold-soft mb-4">
              <span className="h-px w-8 bg-fortuno-gold-soft" aria-hidden="true" />
              Abertos agora
            </span>
            <h2
              className="font-display leading-[1.02] text-fortuno-offwhite"
              style={{ fontSize: 'clamp(36px, 5vw, 58px)' }}
            >
              Sorteios <span className="italic text-fortuno-gold-soft">em andamento</span>
            </h2>
            <p className="mt-4 text-fortuno-offwhite/65 max-w-xl">
              Escolha seu sorteio, selecione a quantidade de bilhetes e finalize via PIX.
              Confirmação instantânea.
            </p>
          </div>
          {lotteries.length > 1 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => slider.current?.prev()}
                className="cta-ghost text-sm focus-visible:outline-none focus-visible:shadow-gold-focus"
                aria-label="Sorteio anterior"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => slider.current?.next()}
                className="cta-ghost text-sm focus-visible:outline-none focus-visible:shadow-gold-focus"
                aria-label="Próximo sorteio"
              >
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <Link
                to="/sorteios"
                className="cta-primary text-sm focus-visible:outline-none focus-visible:shadow-gold-focus"
              >
                Ver todos
              </Link>
            </div>
          )}
        </div>

        {lotteries.length === 0 ? (
          <EmptyLotteries />
        ) : (
          <div
            ref={sliderRef}
            className="keen-slider focus-visible:outline-none focus-visible:shadow-gold-focus rounded-xl"
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            {lotteries.map((lottery, index) => (
              <div
                key={lottery.lotteryId}
                className="keen-slider__slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`Sorteio ${index + 1} de ${lotteries.length}`}
              >
                <LotteryCardPremium lottery={lottery} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
