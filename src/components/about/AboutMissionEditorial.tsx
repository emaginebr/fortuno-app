import { useTranslation } from 'react-i18next';

export const AboutMissionEditorial = (): JSX.Element => {
  const { t } = useTranslation('fortuno');

  return (
    <section
      id="missao"
      className="relative z-10 py-20 md:py-28"
      aria-labelledby="about-mission-title"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-start">
          {/* Coluna esquerda: título editorial */}
          <div className="md:sticky md:top-24">
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-fortuno-gold-intense font-semibold">
              <span className="inline-block w-8 h-px bg-fortuno-gold-intense/70" aria-hidden="true" />
              {t('about.mission.eyebrow')}
            </span>

            <h2
              id="about-mission-title"
              className="font-display mt-5 text-fortuno-black leading-[1.0]"
              style={{ fontSize: 'clamp(44px, 5.4vw, 68px)', letterSpacing: '-0.02em' }}
            >
              {t('about.mission.titleLine1')} <br />
              <em className="italic text-fortuno-gold-intense">
                {t('about.mission.titleLine2')}
              </em>
            </h2>

            <div className="about-deco-divider mt-[18px]" aria-hidden="true">
              <span className="about-diamond" />
            </div>

            <p className="mt-5 text-[13px] uppercase tracking-[0.22em] text-fortuno-black/50 font-semibold">
              {t('about.mission.tagline')}
            </p>
          </div>

          {/* Coluna direita: corpo editorial com drop cap + quote */}
          <div>
            <div className="about-mission-body">
              <p className="about-drop-cap">{t('about.mission.lead')}</p>

              <blockquote className="about-quote">
                {t('about.mission.quote')}
                <cite>{t('about.mission.quoteCite')}</cite>
              </blockquote>

              <p>{t('about.mission.paragraph2')}</p>
              <p>{t('about.mission.paragraph3')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
