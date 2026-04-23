import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

interface AboutStat {
  key: string;
  display: string;
  srValue: string;
  label: string;
}

// MOCK: números institucionais sem endpoint público.
// Registrado em MOCKS.md → "About — Stats institucionais".
const STATS: AboutStat[] = [
  {
    key: 'founded',
    display: '2025',
    srValue: '2025',
    label: 'about.stats.founded',
  },
  {
    key: 'distributed',
    display: 'R$ 12,4M',
    srValue: '12,4 milhões de reais',
    label: 'about.stats.distributed',
  },
  {
    key: 'editions',
    display: '248',
    srValue: '248',
    label: 'about.stats.editions',
  },
  {
    key: 'winners',
    display: '15.3k+',
    srValue: 'mais de 15 mil e 300',
    label: 'about.stats.winners',
  },
];

export const AboutStatsBand = (): JSX.Element => {
  const { t } = useTranslation('fortuno');

  return (
    <section
      className="about-stats relative z-10 py-14 md:py-16"
      aria-labelledby="about-stats-heading"
    >
      <h2 id="about-stats-heading" className="sr-only">
        {t('about.stats.heading')}
      </h2>

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:flex md:gap-0 md:items-center">
          {STATS.map((stat, index) => (
            <Fragment key={stat.key}>
              <div className="text-center md:flex-1 md:px-6">
                <div className="about-stat-num" aria-hidden="true">
                  {stat.display}
                </div>
                <span className="sr-only">{stat.srValue}</span>
                <div className="mt-3 about-stat-label">{t(stat.label)}</div>
              </div>
              {index < STATS.length - 1 && (
                <div className="about-stat-divider hidden md:block" aria-hidden="true" />
              )}
            </Fragment>
          ))}
        </div>

        <p className="mt-10 md:mt-12 text-center text-[12px] uppercase tracking-[0.26em] text-fortuno-black/45">
          {t('about.stats.footnote')}
        </p>
      </div>
    </section>
  );
};
