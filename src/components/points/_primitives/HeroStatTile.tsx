import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export interface HeroStatTileProps {
  /** Label eyebrow (uppercase, 9px). */
  label: string;
  /** Numeral principal do tile. Aceita string (ex.: "Top 10%") ou número. */
  value: number | string;
  /** Ícone Lucide (já renderizado — ex.: `<Users />`). */
  footIcon: ReactNode;
  /** Texto pequeno ao lado do ícone no footer do tile. */
  footText: string;
  /** Quando true, exibe pill "Mock" no canto superior direito do tile. */
  mock?: boolean;
  /**
   * Quando true, reduz a fonte do numeral (útil para valores textuais longos,
   * ex.: "Top 10%" em vez de um inteiro curto).
   */
  shortNumeral?: boolean;
}

/**
 * Mini-stat do hero de "Meus Pontos" — tile 2×2 com numeral editorial,
 * label uppercase e footer icônico.
 */
export const HeroStatTile = ({
  label,
  value,
  footIcon,
  footText,
  mock = false,
  shortNumeral = false,
}: HeroStatTileProps): JSX.Element => {
  const { t } = useTranslation();
  const formatted = typeof value === 'number' ? value.toLocaleString('pt-BR') : value;

  return (
    <div className="hero-stat">
      {mock ? (
        <span className="stat-mock" title={t('myPoints.mockTooltip')}>
          {t('myPoints.mockTag')}
        </span>
      ) : null}
      <span className="stat-label">{label}</span>
      <span className={shortNumeral ? 'stat-numeral is-short' : 'stat-numeral'}>
        {formatted}
      </span>
      <span className="stat-foot">
        {footIcon}
        {footText}
      </span>
    </div>
  );
};
