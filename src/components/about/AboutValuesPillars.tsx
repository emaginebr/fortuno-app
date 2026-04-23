import { useTranslation } from 'react-i18next';
import {
  Eye,
  BadgeCheck,
  Sparkles,
  ClipboardCheck,
  FileCheck2,
  Lock,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Pillar {
  key: string;
  ordinal: string;
  icon: LucideIcon;
  footnoteIcon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
  footnoteKey: string;
}

const PILLARS: Pillar[] = [
  {
    key: 'transparency',
    ordinal: 'I',
    icon: Eye,
    footnoteIcon: FileCheck2,
    titleKey: 'about.values.transparency.title',
    descriptionKey: 'about.values.transparency.description',
    footnoteKey: 'about.values.transparency.footnote',
  },
  {
    key: 'trust',
    ordinal: 'II',
    icon: BadgeCheck,
    footnoteIcon: Lock,
    titleKey: 'about.values.trust.title',
    descriptionKey: 'about.values.trust.description',
    footnoteKey: 'about.values.trust.footnote',
  },
  {
    key: 'experience',
    ordinal: 'III',
    icon: Sparkles,
    footnoteIcon: Zap,
    titleKey: 'about.values.experience.title',
    descriptionKey: 'about.values.experience.description',
    footnoteKey: 'about.values.experience.footnote',
  },
  {
    key: 'audit',
    ordinal: 'IV',
    icon: ClipboardCheck,
    footnoteIcon: ShieldCheck,
    titleKey: 'about.values.audit.title',
    descriptionKey: 'about.values.audit.description',
    footnoteKey: 'about.values.audit.footnote',
  },
];

export const AboutValuesPillars = (): JSX.Element => {
  const { t } = useTranslation('fortuno');

  return (
    <section
      id="valores"
      className="relative z-10 py-20 md:py-28"
      aria-labelledby="about-values-title"
    >
      <div
        className="absolute inset-x-0 top-0 h-px bg-gold-divider"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px bg-gold-divider"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-14 md:mb-16 max-w-3xl mx-auto">
          <span className="inline-flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.28em] text-fortuno-gold-intense font-semibold">
            <span className="inline-block w-8 h-px bg-fortuno-gold-intense/70" aria-hidden="true" />
            {t('about.values.eyebrow')}
            <span className="inline-block w-8 h-px bg-fortuno-gold-intense/70" aria-hidden="true" />
          </span>
          <h2
            id="about-values-title"
            className="font-display mt-5 text-fortuno-black leading-[1.05]"
            style={{ fontSize: 'clamp(36px, 4.8vw, 56px)', letterSpacing: '-0.02em' }}
          >
            {t('about.values.titleLine1')}{' '}
            <em className="italic text-fortuno-gold-intense">
              {t('about.values.titleLine2')}
            </em>
          </h2>
          <p className="mt-5 text-fortuno-black/65 text-[16px] md:text-[17px] leading-relaxed">
            {t('about.values.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            const FootIcon = pillar.footnoteIcon;
            return (
              <article key={pillar.key} className="about-pillar" tabIndex={0}>
                <div className="flex items-center justify-between">
                  <div className="about-pillar-icon">
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <span
                    className="text-[10px] uppercase tracking-[0.26em] text-fortuno-gold-intense font-semibold"
                    aria-hidden="true"
                  >
                    {pillar.ordinal}
                  </span>
                </div>
                <h3 className="font-display mt-2 text-fortuno-black leading-[1.15] text-[22px]">
                  {t(pillar.titleKey)}
                </h3>
                <p className="text-sm leading-[1.65] text-fortuno-black/70">
                  {t(pillar.descriptionKey)}
                </p>
                <div className="about-pillar-divider" aria-hidden="true" />
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-fortuno-gold-intense font-semibold">
                  <FootIcon className="w-4 h-4" aria-hidden="true" />
                  {t(pillar.footnoteKey)}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
