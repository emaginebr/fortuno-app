import type { ReactNode } from 'react';
import { Children } from 'react';

export interface GoldNumeralProps {
  children: ReactNode;
  /** Token CSS de tamanho (ex.: '34px', 'clamp(48px,8vw,96px)'). */
  size?: string;
  /** Se true, adiciona efeito shimmer (texto clone via ::after). */
  shimmer?: boolean;
  /** Tag semântica — default 'span'. */
  as?: 'span' | 'div';
  className?: string;
}

/**
 * Primitivo tipográfico editorial — texto ouro com gradient e shimmer
 * opcional. Usado em stats, hero, cards premium e Final CTA.
 */
export const GoldNumeral = ({
  children,
  size,
  shimmer = false,
  as = 'span',
  className,
}: GoldNumeralProps): JSX.Element => {
  const Tag = as;
  // Para shimmer, precisamos do texto em data-text para ::after clonar
  const textFragments = Children.toArray(children);
  const plainText = textFragments
    .map((c) => (typeof c === 'string' || typeof c === 'number' ? String(c) : ''))
    .join('');

  const classes = ['gold-numeral', shimmer ? 'shimmer' : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      className={classes}
      style={size ? { fontSize: size } : undefined}
      data-text={shimmer ? plainText : undefined}
    >
      {children}
    </Tag>
  );
};
