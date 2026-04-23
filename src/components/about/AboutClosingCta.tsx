import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Ticket, ArrowRight, MessageCircle } from 'lucide-react';

export const AboutClosingCta = (): JSX.Element => {
  const { t } = useTranslation('fortuno');

  return (
    <section
      className="about-closing relative py-20 md:py-28"
      aria-labelledby="about-closing-title"
    >
      <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
        <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-fortuno-gold-soft mb-6">
          <span className="h-px w-8 bg-fortuno-gold-soft" aria-hidden="true" />
          {t('about.closing.eyebrow')}
          <span className="h-px w-8 bg-fortuno-gold-soft" aria-hidden="true" />
        </span>

        <h2
          id="about-closing-title"
          className="font-display italic leading-[1.02] text-fortuno-offwhite"
          style={{ fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '-0.02em' }}
        >
          {t('about.closing.titleLine1')} <br className="hidden md:block" />
          <span className="text-fortuno-gold-soft">{t('about.closing.titleLine2')}</span>
        </h2>

        <p className="mt-7 text-fortuno-offwhite/75 text-[17px] md:text-[18px] leading-relaxed max-w-xl mx-auto">
          {t('about.closing.subhead')}
        </p>

        <div className="mt-10 md:mt-12 flex flex-wrap justify-center gap-4">
          <Link
            to="/sorteios"
            className="cta-primary focus-visible:outline-none focus-visible:shadow-gold-focus"
            style={{ padding: '17px 32px', fontSize: '16px' }}
          >
            <Ticket className="w-[18px] h-[18px]" aria-hidden="true" />
            {t('about.closing.ctaPrimary')}
            <ArrowRight className="w-[18px] h-[18px]" aria-hidden="true" />
          </Link>
          <Link
            to="/fale-conosco"
            className="cta-ghost focus-visible:outline-none focus-visible:shadow-gold-focus"
            style={{ padding: '16px 28px', fontSize: '15px' }}
          >
            <MessageCircle className="w-[18px] h-[18px]" aria-hidden="true" />
            {t('about.closing.ctaSecondary')}
          </Link>
        </div>

        <div className="mt-14 flex items-center gap-4 justify-center" aria-hidden="true">
          <span className="h-px w-24 bg-gradient-to-r from-transparent to-fortuno-gold-soft/55" />
          <span
            className="w-2.5 h-2.5 rotate-45 bg-fortuno-gold-intense"
            style={{ boxShadow: '0 0 12px rgba(212,175,55,0.6)' }}
          />
          <span className="h-px w-24 bg-gradient-to-l from-transparent to-fortuno-gold-soft/55" />
        </div>
        <p
          className="mt-5 font-display italic text-fortuno-gold-soft/85"
          style={{ fontSize: 'clamp(15px, 1.4vw, 18px)' }}
        >
          {t('about.closing.signature')}
        </p>
      </div>
    </section>
  );
};
