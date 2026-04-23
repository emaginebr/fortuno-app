import { useTranslation } from 'react-i18next';
import { Clock4, MapPin, ShieldCheck, MessagesSquare } from 'lucide-react';

/**
 * Hero institucional COMPACTO da página /fale-conosco.
 * Variante encolhida do AboutHero: mesmo halo ouro lateral e linhas
 * art-déco, sem CTAs primários — apenas trust bar.
 */
export const ContactHero = (): JSX.Element => {
  const { t } = useTranslation('fortuno');

  return (
    <section
      className="contact-hero relative z-10 pt-14 md:pt-20 pb-14 md:pb-20"
      aria-labelledby="contact-hero-title"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-[1.4fr_0.8fr] gap-10 md:gap-14 items-center">
          {/* Coluna texto */}
          <div className="relative">
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-fortuno-gold-intense font-semibold">
              <span
                className="inline-block w-8 h-px bg-fortuno-gold-intense/70"
                aria-hidden="true"
              />
              {t('contact.hero.eyebrow')}
              <span
                className="inline-block w-8 h-px bg-fortuno-gold-intense/70"
                aria-hidden="true"
              />
            </span>

            <h1
              id="contact-hero-title"
              className="font-display mt-5 md:mt-6 text-fortuno-black leading-[1.02]"
              style={{ fontSize: 'clamp(36px, 5vw, 58px)', letterSpacing: '-0.02em' }}
            >
              {t('contact.hero.titleLine1')}{' '}
              <em className="italic text-fortuno-gold-intense">
                {t('contact.hero.titleLine2')}
              </em>
            </h1>

            <p className="mt-5 md:mt-6 text-[16px] md:text-[17px] leading-relaxed text-fortuno-black/70 max-w-lg">
              {t('contact.hero.subheadPart1')}{' '}
              <strong className="text-fortuno-black/85">
                {t('contact.hero.subheadEmphasis')}
              </strong>{' '}
              {t('contact.hero.subheadPart2')}
            </p>

            {/* Trust bar */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-fortuno-black/55">
              <span className="inline-flex items-center gap-2">
                <Clock4
                  className="w-4 h-4 text-fortuno-gold-intense"
                  aria-hidden="true"
                />
                {t('contact.hero.trustHours')}
              </span>
              <span
                className="hidden sm:inline-block w-1 h-1 rounded-full bg-fortuno-gold-intense/40"
                aria-hidden="true"
              />
              <span className="inline-flex items-center gap-2">
                <MapPin
                  className="w-4 h-4 text-fortuno-gold-intense"
                  aria-hidden="true"
                />
                {t('contact.hero.trustRegion')}
              </span>
              <span
                className="hidden sm:inline-block w-1 h-1 rounded-full bg-fortuno-gold-intense/40"
                aria-hidden="true"
              />
              <span className="inline-flex items-center gap-2">
                <ShieldCheck
                  className="w-4 h-4 text-fortuno-gold-intense"
                  aria-hidden="true"
                />
                {t('contact.hero.trustLgpd')}
              </span>
            </div>
          </div>

          {/* Glyph art-déco */}
          <figure
            className="contact-hero-glyph order-first md:order-last"
            aria-hidden="true"
          >
            <MessagesSquare
              className="w-[44%] h-[44%] text-fortuno-gold-intense opacity-90"
              strokeWidth={1.25}
            />
          </figure>
        </div>
      </div>
    </section>
  );
};
