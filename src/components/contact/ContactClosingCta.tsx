import { useTranslation } from 'react-i18next';
import { ArrowUpRight, MessageCircle, PenLine } from 'lucide-react';

/**
 * Closing CTA compacto para a /fale-conosco. Espelha visualmente o
 * AboutClosingCta (mesmo fundo noir + ornamento art-déco final), mas
 * sem refatorar o componente do about — conforme escopo restrito.
 */
export const ContactClosingCta = (): JSX.Element => {
  const { t } = useTranslation('fortuno');
  const whatsapp = import.meta.env.VITE_WHATSAPP_URL;

  return (
    <section
      className="contact-closing relative py-16 md:py-20"
      aria-labelledby="contact-closing-title"
    >
      <div className="mx-auto max-w-3xl px-6 text-center relative z-10">
        <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-fortuno-gold-soft mb-5">
          <span className="h-px w-8 bg-fortuno-gold-soft" aria-hidden="true" />
          {t('contact.closing.eyebrow')}
          <span className="h-px w-8 bg-fortuno-gold-soft" aria-hidden="true" />
        </span>

        <h2
          id="contact-closing-title"
          className="font-display italic leading-[1.02] text-fortuno-offwhite"
          style={{ fontSize: 'clamp(32px, 4.6vw, 56px)', letterSpacing: '-0.02em' }}
        >
          {t('contact.closing.titleLine1')} <br className="hidden md:block" />
          <span className="text-fortuno-gold-soft">
            {t('contact.closing.titleLine2')}
          </span>
        </h2>

        <p className="mt-6 text-fortuno-offwhite/75 text-[16px] md:text-[17px] leading-relaxed max-w-lg mx-auto">
          {t('contact.closing.subhead')}
        </p>

        <div className="mt-8 md:mt-10 flex flex-wrap justify-center gap-4">
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary focus-visible:outline-none focus-visible:shadow-gold-focus"
              style={{ padding: '15px 28px', fontSize: '15px' }}
            >
              <MessageCircle className="w-[18px] h-[18px]" aria-hidden="true" />
              {t('contact.closing.ctaPrimary')}
              <ArrowUpRight className="w-[18px] h-[18px]" aria-hidden="true" />
            </a>
          )}
          <a
            href="#mensagem"
            className="cta-ghost focus-visible:outline-none focus-visible:shadow-gold-focus"
            style={{ padding: '14px 24px', fontSize: '14px' }}
          >
            <PenLine className="w-[18px] h-[18px]" aria-hidden="true" />
            {t('contact.closing.ctaSecondary')}
          </a>
        </div>

        <div
          className="mt-10 flex items-center gap-4 justify-center"
          aria-hidden="true"
        >
          <span className="h-px w-20 bg-gradient-to-r from-transparent to-fortuno-gold-soft/55" />
          <span
            className="w-2 h-2 rotate-45 bg-fortuno-gold-intense"
            style={{ boxShadow: '0 0 12px rgba(212,175,55,0.6)' }}
          />
          <span className="h-px w-20 bg-gradient-to-l from-transparent to-fortuno-gold-soft/55" />
        </div>
        <p
          className="mt-4 font-display italic text-fortuno-gold-soft/85"
          style={{ fontSize: 'clamp(14px, 1.2vw, 16px)' }}
        >
          {t('contact.closing.signature')}
        </p>
      </div>
    </section>
  );
};
