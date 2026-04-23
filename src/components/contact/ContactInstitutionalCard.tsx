import { useTranslation } from 'react-i18next';
import { Building2, Scale, Clock4, MapPin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface InstItem {
  key: string;
  icon: LucideIcon;
  label: string;
  value: string;
}

/**
 * Card institucional com borda dupla ornamental + cantos art-déco.
 * Reuso do padrão do FraudCertificate, em corpo claro. Usa <dl>/<dt>/<dd>
 * para semântica correta de "lista de definições" (razão social, CNPJ etc.).
 */
export const ContactInstitutionalCard = (): JSX.Element => {
  const { t } = useTranslation('fortuno');

  const company =
    import.meta.env.VITE_COMPANY_NAME ?? t('contact.institutional.fallbackCompany');
  const cnpj =
    import.meta.env.VITE_COMPANY_CNPJ ?? t('contact.institutional.fallbackCnpj');
  const address =
    import.meta.env.VITE_COMPANY_ADDRESS ?? t('contact.institutional.fallbackAddress');
  const hours =
    import.meta.env.VITE_COMPANY_BUSINESS_HOURS ??
    t('contact.institutional.fallbackHours');

  const items: InstItem[] = [
    { key: 'company', icon: Building2, label: t('contact.institutional.labelCompany'), value: company },
    { key: 'cnpj', icon: Scale, label: t('contact.institutional.labelCnpj'), value: cnpj },
    { key: 'hours', icon: Clock4, label: t('contact.institutional.labelHours'), value: hours },
    { key: 'address', icon: MapPin, label: t('contact.institutional.labelAddress'), value: address },
  ];

  return (
    <section
      className="relative z-10 py-16 md:py-20"
      aria-labelledby="contact-institutional-title"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="inst-card">
          <span className="inst-deco-corner tl" aria-hidden="true" />
          <span className="inst-deco-corner tr" aria-hidden="true" />
          <span className="inst-deco-corner bl" aria-hidden="true" />
          <span className="inst-deco-corner br" aria-hidden="true" />

          <div className="relative z-10 text-center">
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-fortuno-gold-intense font-semibold">
              <span
                className="inline-block w-8 h-px bg-fortuno-gold-intense/70"
                aria-hidden="true"
              />
              {t('contact.institutional.eyebrow')}
              <span
                className="inline-block w-8 h-px bg-fortuno-gold-intense/70"
                aria-hidden="true"
              />
            </span>
            <h2
              id="contact-institutional-title"
              className="font-display italic mt-3 text-fortuno-black"
              style={{ fontSize: 'clamp(24px, 3vw, 34px)', letterSpacing: '-0.02em' }}
            >
              {t('contact.institutional.title')}
            </h2>
            <div className="inst-divider" aria-hidden="true">
              <span className="diamond" />
            </div>
          </div>

          <dl className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {items.map(({ key, icon: Icon, label, value }) => (
              <div className="inst-item" key={key}>
                <dt>
                  <Icon className="w-3 h-3" aria-hidden="true" />
                  {label}
                </dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          <div className="relative z-10 mt-8 pt-6 border-t border-fortuno-gold-intense/20 text-center">
            <p className="text-[12px] uppercase tracking-[0.28em] text-fortuno-black/50">
              {t('contact.institutional.footnote')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
