import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

interface FaqEntry {
  id: 'premio' | 'pagamento' | 'cancelar' | 'sorteado';
}

const FAQS: FaqEntry[] = [
  { id: 'premio' },
  { id: 'pagamento' },
  { id: 'cancelar' },
  { id: 'sorteado' },
];

/**
 * Acordeão FAQ usando <details>/<summary> nativos.
 * Sem dependência externa: a semântica nativa basta, é acessível por
 * padrão e respeita prefers-reduced-motion (sobrescrito no contact.css).
 * @radix-ui/react-accordion não está instalado e não vamos adicionar.
 */
export const ContactFaq = (): JSX.Element => {
  const { t } = useTranslation('fortuno');

  return (
    <section
      className="relative z-10 py-16 md:py-20"
      aria-labelledby="contact-faq-title"
    >
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-10 md:mb-12">
          <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-fortuno-gold-intense font-semibold">
            <span
              className="inline-block w-8 h-px bg-fortuno-gold-intense/70"
              aria-hidden="true"
            />
            {t('contact.faq.eyebrow')}
            <span
              className="inline-block w-8 h-px bg-fortuno-gold-intense/70"
              aria-hidden="true"
            />
          </span>
          <h2
            id="contact-faq-title"
            className="font-display mt-4 text-fortuno-black leading-[1.05]"
            style={{ fontSize: 'clamp(28px, 3.6vw, 40px)', letterSpacing: '-0.02em' }}
          >
            {t('contact.faq.titleLine1')}{' '}
            <em className="italic text-fortuno-gold-intense">
              {t('contact.faq.titleLine2')}
            </em>
          </h2>
          <p className="mt-4 text-fortuno-black/65 text-[15px]">
            {t('contact.faq.subtitle')}
          </p>
        </div>

        <div className="faq-list">
          {FAQS.map((faq, index) => (
            <details
              key={faq.id}
              className="faq-item"
              open={index === 0}
            >
              <summary className="faq-summary">
                <span className="faq-summary-text">
                  {t(`contact.faq.items.${faq.id}.question`)}
                </span>
                <span className="faq-chevron" aria-hidden="true">
                  <ChevronDown className="w-4 h-4" />
                </span>
              </summary>
              <div className="faq-body">
                {t(`contact.faq.items.${faq.id}.answer`)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
