import { ShieldCheck, Banknote, BadgeCheck, Lock, Zap, FileCheck2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Pillar {
  key: string;
  num: string;
  icon: LucideIcon;
  title: string;
  description: string;
  microIcon: LucideIcon;
  microLabel: string;
  featured?: boolean;
}

const PILLARS: Pillar[] = [
  {
    key: 'data',
    num: 'Pilar I',
    icon: ShieldCheck,
    title: 'Segurança de dados',
    description:
      'Criptografia ponta-a-ponta, infraestrutura isolada por tenant e conformidade com LGPD. Seus dados ficam onde devem ficar — com você.',
    microIcon: Lock,
    microLabel: 'TLS 1.3 · AES-256',
  },
  {
    key: 'pix',
    num: 'Pilar II',
    icon: Banknote,
    title: 'Pagamento via PIX',
    description:
      'Confirmação instantânea, rastreabilidade total. Você paga direto do seu app bancário — sem cartão, sem intermediário, sem surpresa.',
    microIcon: Zap,
    microLabel: 'Confirmação em segundos',
    featured: true,
  },
  {
    key: 'audit',
    num: 'Pilar III',
    icon: BadgeCheck,
    title: 'Sorteio auditado',
    description:
      'Cada sorteio é registrado com hash verificável, resultado transparente e reprodutível. Zero opacidade — a sorte é feita sob testemunha.',
    microIcon: FileCheck2,
    microLabel: 'Ata pública de cada edição',
  },
];

export const SecurityPillars = (): JSX.Element => (
  <section
    id="seguranca"
    className="relative py-20 md:py-28"
    aria-labelledby="pilares-title"
  >
    <div className="mx-auto max-w-7xl px-6">
      <div className="text-center mb-16">
        <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-fortuno-gold-soft mb-4">
          <span className="h-px w-8 bg-fortuno-gold-soft" aria-hidden="true" />
          Confiança desenhada
          <span className="h-px w-8 bg-fortuno-gold-soft" aria-hidden="true" />
        </span>
        <h2
          id="pilares-title"
          className="font-display leading-[1.05] text-fortuno-offwhite"
          style={{ fontSize: 'clamp(36px, 5vw, 58px)' }}
        >
          Três pilares que{' '}
          <span className="italic text-fortuno-gold-soft">sustentam</span> sua tranquilidade
        </h2>
        <p className="mt-5 text-fortuno-offwhite/65 max-w-2xl mx-auto">
          Segurança não é slogan — é engenharia, processo e auditoria ininterrupta.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-stretch">
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          const MicroIcon = pillar.microIcon;
          return (
            <article
              key={pillar.key}
              className={`pillar ${pillar.featured ? 'featured md:-mt-4 md:mb-4' : ''}`}
            >
              <div className="flex items-start gap-4 mb-5">
                <div className="icon-box">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="step-num">{pillar.num}</div>
                  <h3 className="font-display text-xl md:text-2xl text-fortuno-offwhite mt-1">
                    {pillar.title}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-fortuno-offwhite/70 leading-relaxed">
                {pillar.description}
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs text-fortuno-gold-soft">
                <MicroIcon className="w-4 h-4" aria-hidden="true" />
                {pillar.microLabel}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);
