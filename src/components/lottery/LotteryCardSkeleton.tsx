import { useTranslation } from 'react-i18next';

interface SkeletonBlockProps {
  className?: string;
  style?: React.CSSProperties;
}

const SkeletonBlock = ({ className = '', style }: SkeletonBlockProps): JSX.Element => (
  <div className={`skeleton-block ${className}`.trim()} style={style} aria-hidden="true" />
);

/**
 * Skeleton com shape equivalente ao LotteryCardPremium — garante
 * altura estável durante o primeiro load, evitando CLS.
 * Respeita `prefers-reduced-motion` via regra global e `.skeleton-block`.
 */
export const LotteryCardSkeleton = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <article
      aria-busy="true"
      aria-live="polite"
      aria-label={t('lotteryList.skeletonAria')}
      className="skeleton-card flex flex-col"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-[20px]">
        <SkeletonBlock className="absolute inset-0 !rounded-none" />
        <SkeletonBlock
          className="absolute top-4 left-4 z-[3] !rounded-full"
          style={{ width: 80, height: 22 }}
        />
        <SkeletonBlock
          className="absolute top-4 right-4 z-[3] !rounded-full"
          style={{ width: 100, height: 22 }}
        />
      </div>

      <div className="relative p-6 flex-1 flex flex-col gap-4 z-[3]">
        <SkeletonBlock style={{ width: 70, height: 10 }} />
        <SkeletonBlock style={{ width: '70%', height: 24 }} />

        <div className="flex flex-col gap-2 mt-1">
          <SkeletonBlock style={{ width: 80, height: 10 }} />
          <SkeletonBlock style={{ width: '60%', height: 34 }} />
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center justify-between">
            <SkeletonBlock style={{ width: 55, height: 10 }} />
            <SkeletonBlock style={{ width: 90, height: 10 }} />
          </div>
          <SkeletonBlock
            className="!rounded-full"
            style={{ width: '100%', height: 5 }}
          />
          <SkeletonBlock style={{ width: '65%', height: 10 }} />
        </div>

        <SkeletonBlock
          className="mt-auto"
          style={{ width: '100%', height: 44, borderRadius: 12 }}
        />
      </div>
    </article>
  );
};
