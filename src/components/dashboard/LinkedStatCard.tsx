import { Link } from 'react-router-dom';
import { ArrowRight, Ticket, Trophy, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type LinkedStatIcon = 'ticket' | 'trophy' | 'users';

export interface LinkedStatCardProps {
  /** Numeral ordinal decorativo ("01", "02", "03"). */
  number: string;
  icon: LinkedStatIcon;
  label: string;
  value: number;
  ctaLabel: string;
  to: string;
}

const ICON_MAP: Record<LinkedStatIcon, LucideIcon> = {
  ticket: Ticket,
  trophy: Trophy,
  users: Users,
};

/**
 * Card inteiro clickable (um único <a> focável) com numeral ouro 44px,
 * divisor ouro fino e CTA com seta que translada no hover do card.
 * Anúncio assistivo via `aria-labelledby` (label + value).
 */
export const LinkedStatCard = ({
  number,
  icon,
  label,
  value,
  ctaLabel,
  to,
}: LinkedStatCardProps): JSX.Element => {
  const Icon = ICON_MAP[icon];
  const labelId = `stat-${number}-label`;
  const valueId = `stat-${number}-value`;

  return (
    <Link
      to={to}
      className={[
        'group relative flex flex-col gap-2 p-[18px] pb-4',
        'bg-white border rounded-2xl shadow-paper overflow-hidden',
        'no-underline text-inherit',
        'border-[color:var(--card-paper-border)]',
        'transition-all duration-noir-base ease-noir-spring',
        'hover:-translate-y-0.5 hover:shadow-paper-hover',
        'hover:border-[color:var(--card-paper-border-hover)]',
        'focus-visible:outline-none focus-visible:shadow-gold-focus',
        'min-h-[132px] sm:min-h-[148px]',
        "before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-px",
        'before:bg-card-gold-bar before:opacity-80',
      ].join(' ')}
      aria-labelledby={`${labelId} ${valueId}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div
          className={[
            'w-[34px] h-[34px] rounded-[10px] shrink-0',
            'bg-gradient-to-b from-[#faf3e1] to-[#f0e3b8]',
            'text-fortuno-gold-intense grid place-items-center',
            'border border-fortuno-gold-intense/25',
          ].join(' ')}
          aria-hidden="true"
        >
          <Icon className="w-[17px] h-[17px]" />
        </div>
        <span className="text-[10px] text-fortuno-black/40 tracking-[0.22em] uppercase">
          {number}
        </span>
      </div>

      <span
        id={labelId}
        className="text-[10px] font-semibold tracking-[0.26em] uppercase text-fortuno-black/60"
      >
        {label}
      </span>

      <span
        id={valueId}
        className={[
          'font-display italic font-extrabold text-[44px] leading-[0.92]',
          'tracking-[-0.03em] bg-stat-numeral bg-clip-text text-transparent tabular-nums',
        ].join(' ')}
      >
        {value.toLocaleString('pt-BR')}
      </span>

      <div className="h-px bg-gold-divider-soft my-1" aria-hidden="true" />

      <span
        className={[
          'inline-flex items-center gap-1.5 text-xs font-semibold',
          'text-fortuno-gold-intense transition-colors duration-noir-base',
          'group-hover:text-fortuno-green-elegant',
        ].join(' ')}
      >
        {ctaLabel}
        <ArrowRight
          className={[
            'w-[13px] h-[13px] transition-transform duration-noir-base ease-noir-spring',
            'group-hover:translate-x-[3px]',
          ].join(' ')}
          aria-hidden="true"
        />
      </span>
    </Link>
  );
};
