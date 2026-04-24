import type { ReactNode } from 'react';

export interface HowToBulletProps {
  /** Ícone Lucide já renderizado (ex.: `<Users />`). Decorativo. */
  icon: ReactNode;
  /** Texto antes do `<strong>` (sem espaço à direita — o JSX adiciona). */
  prefix: string;
  /** Palavra(s) em `<strong>` (destaque). */
  strong: string;
  /** Texto após o `<strong>`. */
  suffix: string;
}

/**
 * Item da lista "Como funcionam os pontos" — grid 26px/auto com ícone
 * em chip dourado + bullet em 12px. Usa concatenação explícita (prefix /
 * strong / suffix) em vez de `dangerouslySetInnerHTML` para evitar XSS
 * através das strings de i18n.
 */
export const HowToBullet = ({
  icon,
  prefix,
  strong,
  suffix,
}: HowToBulletProps): JSX.Element => (
  <li className="hero-howto-item">
    <span className="howto-icon" aria-hidden="true">
      {icon}
    </span>
    <span>
      {prefix} <strong>{strong}</strong> {suffix}
    </span>
  </li>
);
