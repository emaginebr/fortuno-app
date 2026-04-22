import { Link } from 'react-router-dom';
import { Search, Ticket, QrCode, Trophy, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface TimelineStep {
  num: string;
  eyebrow: string;
  eyebrowIcon: LucideIcon;
  title: string;
  description: string;
}

const STEPS: TimelineStep[] = [
  {
    num: '01',
    eyebrow: 'Escolha',
    eyebrowIcon: Search,
    title: 'Escolha o sorteio',
    description: 'Explore as edições abertas e descubra a que melhor combina com você.',
  },
  {
    num: '02',
    eyebrow: 'Selecione',
    eyebrowIcon: Ticket,
    title: 'Selecione bilhetes',
    description:
      'Quanto mais bilhetes, mais chances. Combos turbinam sua sorte e seu ticket médio.',
  },
  {
    num: '03',
    eyebrow: 'Pague',
    eyebrowIcon: QrCode,
    title: 'Pague via PIX',
    description: 'Confirmação em segundos. Do seu app bancário direto para seu bilhete.',
  },
  {
    num: '04',
    eyebrow: 'Acompanhe',
    eyebrowIcon: Trophy,
    title: 'Acompanhe e ganhe',
    description:
      'Veja o resultado auditado em tempo real e confira seus números em Meus Números.',
  },
];

export const HowItWorksTimeline = (): JSX.Element => (
  <section
    id="como"
    className="relative py-20 md:py-28 bg-[rgba(7,32,26,0.35)]"
    aria-labelledby="como-title"
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
      <div className="text-center mb-20">
        <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-fortuno-gold-soft mb-4">
          <span className="h-px w-8 bg-fortuno-gold-soft" aria-hidden="true" />
          Quatro passos
          <span className="h-px w-8 bg-fortuno-gold-soft" aria-hidden="true" />
        </span>
        <h2
          id="como-title"
          className="font-display leading-[1.05] text-fortuno-offwhite"
          style={{ fontSize: 'clamp(36px, 5vw, 58px)' }}
        >
          É <span className="italic text-fortuno-gold-soft">fácil</span> participar
        </h2>
        <p className="mt-5 text-fortuno-offwhite/65 max-w-2xl mx-auto">
          Do primeiro clique ao resultado transparente — sem cadastro longo, sem fricção.
        </p>
      </div>

      <div className="relative">
        <div className="timeline-rail hidden md:block" aria-hidden="true">
          <div className="fill" />
        </div>

        <ol
          className="timeline-horizontal grid md:grid-cols-4 gap-10 md:gap-8"
          aria-label="Como participar"
        >
          {STEPS.map((step) => {
            const EyebrowIcon = step.eyebrowIcon;
            return (
              <li key={step.num} className="timeline-step">
                <div className="timeline-marker">
                  <span className="num">{step.num}</span>
                </div>
                <div className="md:mt-8">
                  <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-fortuno-gold-soft mb-2">
                    <EyebrowIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    {step.eyebrow}
                  </div>
                  <h3 className="font-display text-xl text-fortuno-offwhite mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-fortuno-offwhite/65 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="text-center mt-16">
        <Link
          to="/sorteios"
          className="cta-primary text-base focus-visible:outline-none focus-visible:shadow-gold-focus"
        >
          <Ticket className="w-4 h-4" aria-hidden="true" />
          Compre já
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  </section>
);
