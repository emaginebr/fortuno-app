import { useTranslation } from 'react-i18next';
import { Briefcase, Ticket, QrCode, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Step {
  key: string;
  ordinal: string;
  icon: LucideIcon;
  chipKey: string;
  titleKey: string;
  descriptionKey: string;
}

const STEPS: Step[] = [
  {
    key: 'step1',
    ordinal: '01',
    icon: Briefcase,
    chipKey: 'about.howItWorks.step1.chip',
    titleKey: 'about.howItWorks.step1.title',
    descriptionKey: 'about.howItWorks.step1.description',
  },
  {
    key: 'step2',
    ordinal: '02',
    icon: Ticket,
    chipKey: 'about.howItWorks.step2.chip',
    titleKey: 'about.howItWorks.step2.title',
    descriptionKey: 'about.howItWorks.step2.description',
  },
  {
    key: 'step3',
    ordinal: '03',
    icon: QrCode,
    chipKey: 'about.howItWorks.step3.chip',
    titleKey: 'about.howItWorks.step3.title',
    descriptionKey: 'about.howItWorks.step3.description',
  },
  {
    key: 'step4',
    ordinal: '04',
    icon: Trophy,
    chipKey: 'about.howItWorks.step4.chip',
    titleKey: 'about.howItWorks.step4.title',
    descriptionKey: 'about.howItWorks.step4.description',
  },
];

export const AboutHowWeWorkTimeline = (): JSX.Element => {
  const { t } = useTranslation('fortuno');

  return (
    <section
      id="como"
      className="relative z-10 py-20 md:py-28"
      aria-labelledby="about-how-title"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <span className="inline-flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.28em] text-fortuno-gold-intense font-semibold">
            <span className="inline-block w-8 h-px bg-fortuno-gold-intense/70" aria-hidden="true" />
            {t('about.howItWorks.eyebrow')}
            <span className="inline-block w-8 h-px bg-fortuno-gold-intense/70" aria-hidden="true" />
          </span>
          <h2
            id="about-how-title"
            className="font-display mt-5 text-fortuno-black leading-[1.05]"
            style={{ fontSize: 'clamp(36px, 4.8vw, 56px)', letterSpacing: '-0.02em' }}
          >
            {t('about.howItWorks.titleLine1')}{' '}
            <em className="italic text-fortuno-gold-intense">
              {t('about.howItWorks.titleLine2')}
            </em>
          </h2>
          <p className="mt-5 text-fortuno-black/65 text-[16px] md:text-[17px] leading-relaxed">
            {t('about.howItWorks.subtitle')}
          </p>
        </div>

        <div className="relative">
          <div className="about-how-rail hidden md:block" aria-hidden="true" />

          <ol
            className="about-how-list relative grid md:grid-cols-4 gap-y-10 md:gap-y-0 md:gap-x-6 lg:gap-x-10"
            aria-label={t('about.howItWorks.listAria')}
          >
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <li key={step.key} className="about-how-step relative z-[1] text-center">
                  <div className="about-how-num" aria-hidden="true">
                    {step.ordinal}
                  </div>
                  <div className="about-how-marker" aria-hidden="true" />
                  <div>
                    <span className="about-how-chip">
                      <Icon className="w-[14px] h-[14px]" aria-hidden="true" />
                      {t(step.chipKey)}
                    </span>
                    <h3 className="font-display text-[20px] leading-[1.2] text-fortuno-black mt-2">
                      {t(step.titleKey)}
                    </h3>
                    <p className="about-how-desc text-[13.5px] leading-[1.6] text-fortuno-black/65 mt-1.5 max-w-[30ch] mx-auto">
                      {t(step.descriptionKey)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};
