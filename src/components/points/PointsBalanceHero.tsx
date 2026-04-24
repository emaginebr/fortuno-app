import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Award,
  Coins,
  Gift,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react';
import { HeroStatTile } from './_primitives/HeroStatTile';
import { HowToBullet } from './_primitives/HowToBullet';
import { formatBRL } from '@/utils/currency';

export interface PointsBalanceHeroProps {
  totalPoints: number;
  totalPurchases: number;
  lotteriesReached: number;
  /** MOCK derivado client-side: max(byLottery[].purchases). */
  biggestPurchaseInOne?: number;
  biggestLotteryName?: string;
  /** BRL bruto (panel.totalToReceive) usado APENAS para o chip de equivalência. */
  estimatedBRL: number;
}

/**
 * Hero editorial do extrato de pontos — 3 zonas (saldo gigante · mini-stats 2×2 ·
 * "Como funcionam"). Wow moment da página `/meus-pontos`.
 */
export const PointsBalanceHero = ({
  totalPoints,
  totalPurchases,
  lotteriesReached,
  biggestPurchaseInOne,
  biggestLotteryName,
  estimatedBRL,
}: PointsBalanceHeroProps): JSX.Element => {
  const { t } = useTranslation();
  const formattedPoints = totalPoints.toLocaleString('pt-BR');
  const biggestFoot =
    biggestLotteryName && biggestPurchaseInOne !== undefined && biggestPurchaseInOne > 0
      ? t('myPoints.hero.statBiggestFootIn', { name: biggestLotteryName })
      : t('myPoints.hero.statBiggestFootEmpty');

  return (
    <section aria-labelledby="balance-hero-title">
      <h2 id="balance-hero-title" className="sr-only">
        {t('myPoints.balanceHeroSr')}
      </h2>
      <div className="balance-hero">
        <div className="balance-hero-inner">
          <span className="hero-corner is-tl" aria-hidden="true" />
          <span className="hero-corner is-tr" aria-hidden="true" />
          <span className="hero-corner is-bl" aria-hidden="true" />
          <span className="hero-corner is-br" aria-hidden="true" />

          {/* ZONA ESQUERDA — saldo gigante */}
          <div className="hero-zone-balance">
            <span className="balance-eyebrow">{t('myPoints.hero.eyebrow')}</span>
            <div
              className="hero-points-numeral"
              aria-label={t('myPoints.hero.numeralAria', { count: totalPoints })}
            >
              {formattedPoints}
            </div>
            <span className="hero-points-sublabel">
              <strong>{t('myPoints.hero.sublabelStrong')}</strong>{' '}
              {t('myPoints.hero.sublabelRest')}
            </span>
            {estimatedBRL > 0 ? (
              <span className="hero-equivalent-chip">
                <Coins />≈ <strong>{formatBRL(estimatedBRL)}</strong>{' '}
                {t('myPoints.hero.equivalentSuffix')}
                <sup>*</sup>
              </span>
            ) : null}
          </div>

          {/* ZONA CENTRAL — mini-stats 2x2 */}
          <div
            className="hero-zone-stats"
            role="group"
            aria-label={t('myPoints.hero.statsAria')}
          >
            <HeroStatTile
              label={t('myPoints.hero.statTotalRefs')}
              value={totalPurchases}
              footIcon={<Users />}
              footText={t('myPoints.hero.statTotalRefsFoot')}
            />
            <HeroStatTile
              label={t('myPoints.hero.statLotteries')}
              value={lotteriesReached}
              footIcon={<Trophy />}
              footText={t('myPoints.hero.statLotteriesFoot')}
            />
            <HeroStatTile
              label={t('myPoints.hero.statBiggest')}
              value={biggestPurchaseInOne ?? 0}
              footIcon={<TrendingUp />}
              footText={biggestFoot}
              mock
            />
            <HeroStatTile
              label={t('myPoints.hero.statRanking')}
              value={t('myPoints.hero.statRankingValue')}
              footIcon={<Award />}
              footText={t('myPoints.hero.statRankingFoot')}
              mock
              shortNumeral
            />
          </div>

          {/* ZONA DIREITA — Como funcionam */}
          <div className="hero-zone-howto">
            <span className="hero-howto-eyebrow">{t('myPoints.howTo.eyebrow')}</span>
            <div className="hero-howto-title">
              {t('myPoints.howTo.titleStart')}{' '}
              <span className="accent">{t('myPoints.howTo.titleEnd')}</span>
            </div>
            <ul className="hero-howto-list">
              <HowToBullet
                icon={<Users />}
                prefix={t('myPoints.howTo.b1Prefix')}
                strong={t('myPoints.howTo.b1Strong')}
                suffix={t('myPoints.howTo.b1Suffix')}
              />
              <HowToBullet
                icon={<Gift />}
                prefix={t('myPoints.howTo.b2Prefix')}
                strong={t('myPoints.howTo.b2Strong')}
                suffix={t('myPoints.howTo.b2Suffix')}
              />
              <HowToBullet
                icon={<Sparkles />}
                prefix={t('myPoints.howTo.b3Prefix')}
                strong={t('myPoints.howTo.b3Strong')}
                suffix={t('myPoints.howTo.b3Suffix')}
              />
            </ul>
            <a href="#disclaimer" className="hero-howto-cta">
              {t('myPoints.howTo.cta')}
              <ArrowRight />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
