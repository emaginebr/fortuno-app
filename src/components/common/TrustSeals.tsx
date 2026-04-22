import { BadgeCheck, KeyRound, Building2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface TrustSealsProps {
  /** 'hero' = padrão do painel lateral; 'compact' = versão menor para FinalCta */
  variant?: 'hero' | 'compact';
  className?: string;
}

interface Seal {
  icon: LucideIcon;
  /** Linha 1 (antes da quebra) */
  line1: string;
  /** Linha 2 (depois da quebra) */
  line2: string;
}

const SEALS: Seal[] = [
  { icon: BadgeCheck, line1: 'Sorteio', line2: 'auditado' },
  { icon: KeyRound, line1: 'PIX', line2: 'criptografado' },
  { icon: Building2, line1: 'CNPJ', line2: 'verificado' },
];

/**
 * Faixa reutilizável de 3 selos de credibilidade (glass + micro-bordas ouro).
 * Usado no painel lateral do hero e no FinalCta.
 */
export const TrustSeals = ({
  variant = 'hero',
  className,
}: TrustSealsProps): JSX.Element => {
  const wrapperClass = [
    'hero-seals',
    variant === 'compact' ? 'compact' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const iconSize = variant === 'compact' ? 'w-4 h-4' : 'w-[18px] h-[18px]';

  return (
    <div role="list" aria-label="Selos de credibilidade" className={wrapperClass}>
      {SEALS.map((seal) => {
        const Icon = seal.icon;
        return (
          <div
            key={`${seal.line1}-${seal.line2}`}
            role="listitem"
            className="hero-seal focus-visible:outline-none focus-visible:shadow-gold-focus"
          >
            <Icon
              className={`${iconSize} text-fortuno-gold-soft flex-shrink-0`}
              aria-hidden="true"
            />
            <span className="seal-label">
              {seal.line1}
              <br />
              {seal.line2}
            </span>
          </div>
        );
      })}
    </div>
  );
};
