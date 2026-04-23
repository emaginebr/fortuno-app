import type { LotteryInfo } from '@/types/lottery';

export interface CheckoutPrizeThumbProps {
  lottery: LotteryInfo;
}

/**
 * Miniatura do prêmio — versão reduzida do "palco compacto" da lottery-detail.
 * 16:9, gradient overlay, nome sobreposto.
 */
export const CheckoutPrizeThumb = ({ lottery }: CheckoutPrizeThumbProps): JSX.Element => {
  const firstImage = lottery.images?.[0]?.imageUrl;
  const fallback = '/images/hero-fallback.jpg';
  const src = firstImage || fallback;

  return (
    <div
      className="relative overflow-hidden rounded-2xl aspect-[16/9] bg-[color:var(--stage-compact-bg)] border border-[color:var(--stage-compact-border)] shadow-stage-compact max-h-[220px]"
    >
      <img
        src={src}
        alt={lottery.name}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div
        className="absolute inset-0 bg-stage-compact-overlay pointer-events-none"
        aria-hidden="true"
      />
      <div className="absolute inset-x-3.5 bottom-3 text-fortuno-offwhite">
        <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-fortuno-gold-soft/90 [text-shadow:0_2px_10px_rgba(0,0,0,0.75)]">
          Prêmio
        </p>
        <p className="font-display italic font-bold text-lg md:text-xl leading-tight [text-shadow:0_6px_30px_rgba(0,0,0,0.75)]">
          {lottery.name}
        </p>
      </div>
    </div>
  );
};
