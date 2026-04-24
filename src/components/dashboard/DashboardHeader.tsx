import { useTranslation } from 'react-i18next';
import type { UserInfo } from 'nauth-react';
import { AvatarFrame } from './AvatarFrame';
import { HeaderChip } from './HeaderChip';
import { getInitials } from '@/utils/getInitials';

export interface DashboardHeaderProps {
  user: UserInfo | null | undefined;
  referralCode?: string | null;
  /** Inteiro de pontos acumulados. Fallback 0. */
  totalPoints: number;
  /**
   * Quando true, o chip "pontos" renderiza-se como "Aqui" (aria-current="page")
   * em vez do CTA "Extrato". Usado em /meus-pontos.
   */
  pointsChipCurrentPage?: boolean;
}

/**
 * Faixa escura compacta do dashboard (~140-160px desktop).
 * Contém saudação + avatar + ReferralChip + PointsChip.
 */
export const DashboardHeader = ({
  user,
  referralCode,
  totalPoints,
  pointsChipCurrentPage = false,
}: DashboardHeaderProps): JSX.Element => {
  const { t } = useTranslation();
  const initials = getInitials(user?.name);
  const firstName = user?.name ? user.name.split(' ')[0] : t('dashboard.greetingGuest');

  return (
    <header
      className={[
        'bg-dash-header text-fortuno-offwhite relative overflow-hidden isolate',
        "after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0",
        'after:h-px after:bg-gold-divider after:opacity-65',
      ].join(' ')}
      aria-labelledby="dash-greeting"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-6 pb-6 md:pt-8 md:pb-8">
        <div
          className={[
            'grid items-center gap-5',
            'grid-cols-[auto_1fr]',
            'lg:grid-cols-[auto_1fr_auto_auto]',
          ].join(' ')}
        >
          <AvatarFrame initials={initials} size="md" />

          <div className="min-w-0">
            <span className="text-[10px] font-semibold tracking-[0.26em] uppercase text-fortuno-gold-intense">
              {t('dashboard.eyebrow')}
            </span>
            <h1
              id="dash-greeting"
              className={[
                'font-display text-fortuno-offwhite leading-tight mt-0.5',
                'text-[clamp(20px,2.4vw,28px)] tracking-[-0.01em]',
              ].join(' ')}
            >
              {t('dashboard.greeting')},{' '}
              <span className="italic text-fortuno-gold-soft">{firstName}</span>.
            </h1>
          </div>

          {/* Chips: linha 2 em mobile/tablet (col-span-2), lado a lado em desktop (lg:contents) */}
          <div
            className={[
              'col-span-2 lg:col-span-1 lg:contents',
              'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-none gap-2.5 lg:gap-3',
              'mt-1 lg:mt-0',
            ].join(' ')}
          >
            {referralCode ? (
              <HeaderChip variant="referral" code={referralCode} />
            ) : null}
            <HeaderChip
              variant="points"
              points={totalPoints}
              currentPage={pointsChipCurrentPage}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
