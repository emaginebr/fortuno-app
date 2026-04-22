import { Fragment } from 'react';
import { GoldNumeral } from '@/components/common/GoldNumeral';

export interface StatItem {
  key: string;
  label: string;
  /** Valor final (ex.: 12400000). */
  value: number;
  /** Formatação opcional do valor (se ausente, usa toLocaleString pt-BR). */
  format?: (value: number) => string;
  prefix?: string;
  suffix?: string;
}

export interface StatsBandProps {
  stats?: StatItem[];
}

// MOCK: StatsBand — valores hardcoded aguardando endpoint /stats/public.
// Registrado em MOCKS.md.
const DEFAULT_STATS: StatItem[] = [
  {
    key: 'distributed',
    label: 'Distribuídos em prêmios',
    prefix: 'R$ ',
    value: 12_400_000,
  },
  {
    key: 'editions',
    label: 'Sorteios realizados',
    value: 248,
  },
  {
    key: 'winners',
    label: 'Ganhadores premiados',
    suffix: '+',
    value: 15_320,
  },
  {
    key: 'audited',
    label: 'Auditado e transparente',
    suffix: '%',
    value: 100,
  },
];

const defaultFormat = (value: number): string => value.toLocaleString('pt-BR');

/**
 * Banda horizontal de 4 estatísticas, com numerais editoriais em ouro.
 * Mobile: 2x2 grid. Desktop: 4 colunas separadas por divisor vertical ouro.
 */
export const StatsBand = ({ stats = DEFAULT_STATS }: StatsBandProps): JSX.Element => (
  <section className="stats-strip relative z-10 py-14 md:py-16" aria-label="Indicadores Fortuno">
    <div className="mx-auto max-w-7xl px-6">
      <div className="grid grid-cols-2 gap-8 md:flex md:gap-0 md:items-center">
        {stats.map((stat, index) => {
          const formatted = stat.format ? stat.format(stat.value) : defaultFormat(stat.value);
          const display = `${stat.prefix ?? ''}${formatted}${stat.suffix ?? ''}`;
          return (
            <Fragment key={stat.key}>
              <div className="text-center md:flex-1 md:px-6">
                <GoldNumeral as="div" className="stat-num">
                  <span aria-hidden="true">{display}</span>
                </GoldNumeral>
                <span className="sr-only">{display}</span>
                <div className="mt-3 text-[11px] uppercase tracking-[0.26em] text-fortuno-offwhite/60">
                  {stat.label}
                </div>
              </div>
              {index < stats.length - 1 && (
                <div aria-hidden="true" className="stat-divider hidden md:block" />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  </section>
);
