import { useKeenSlider } from 'keen-slider/react';
import type { LotteryImageInfo } from '@/types/lotteryImage';

interface LotteryImageCarouselProps {
  images: LotteryImageInfo[];
}

export const LotteryImageCarousel = ({ images }: LotteryImageCarouselProps): JSX.Element => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: images.length > 1,
    slides: { perView: 1, spacing: 12 },
  });

  if (images.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-fortuno-green-elegant/10 text-sm text-fortuno-black/50">
        Sem imagens cadastradas.
      </div>
    );
  }

  return (
    <div ref={sliderRef} className="keen-slider overflow-hidden rounded-lg">
      {images.map((image) => (
        <div
          key={image.lotteryImageId}
          className="keen-slider__slide relative aspect-video bg-fortuno-green-deep"
        >
          <img
            src={image.imageUrl}
            alt={image.description || 'Imagem do sorteio'}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {image.description ? (
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-3 text-sm text-fortuno-offwhite">
              {image.description}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};
