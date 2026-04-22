import { useEffect, useMemo, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Clock, Save, Lightbulb } from 'lucide-react';
import { WizardStepper } from './WizardStepper';
import { WizardFooter } from './WizardFooter';

export interface WizardStepMeta {
  index: number;
  key: string;
  title: string;
  /** NOVO — subtítulo descritivo exibido no header editorial */
  subtitle?: string;
  /** NOVO — ícone Lucide temático do marcador */
  icon?: LucideIcon;
  /** NOVO — tempo estimado em minutos (usado no chip e no footer) */
  estimatedMinutes?: number;
}

export interface VerticalWizardShellProps {
  steps: WizardStepMeta[];
  currentIndex: number;
  /** índice máximo liberado; padrão: currentIndex (só o atual + anteriores). */
  maxUnlockedIndex?: number;
  onPrev: () => void;
  onNext: () => void;
  onJump: (index: number) => void;
  children: ReactNode;
  nextLabel?: string;
  nextDisabled?: boolean;
  busy?: boolean;
  /** Exibe CTA especial na última etapa. */
  finalLabel?: string;
  /** override opcional da cabeçalha (ex.: breadcrumb contextual) */
  breadcrumb?: ReactNode;
}

const DEFAULT_BREADCRUMB = (
  <>
    <span className="text-xs uppercase tracking-[0.32em] text-fortuno-gold-soft/80">
      Fortuno · Painel
    </span>
    <span className="h-px w-12 bg-fortuno-gold-soft/40" aria-hidden="true" />
    <span className="text-xs uppercase tracking-[0.2em] text-fortuno-offwhite/55">
      Meus sorteios / Novo
    </span>
  </>
);

export const VerticalWizardShell = ({
  steps,
  currentIndex,
  maxUnlockedIndex,
  onPrev,
  onNext,
  onJump,
  children,
  nextLabel = 'Próximo',
  nextDisabled = false,
  busy = false,
  finalLabel = 'Finalizar',
  breadcrumb,
}: VerticalWizardShellProps): JSX.Element => {
  const total = steps.length;
  const currentStep = steps[currentIndex];
  const effectiveMaxUnlocked = maxUnlockedIndex ?? currentIndex;
  const isLast = currentIndex === total - 1;

  const remainingMinutes = useMemo(
    () =>
      steps
        .filter((s) => s.index >= currentIndex)
        .reduce((sum, s) => sum + (s.estimatedMinutes ?? 0), 0),
    [steps, currentIndex],
  );

  // Atalhos: Alt+← / Alt+→
  useEffect(() => {
    const handler = (event: KeyboardEvent): void => {
      if (!event.altKey) return;
      if (event.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          event.preventDefault();
          onPrev();
        }
      } else if (event.key === 'ArrowRight') {
        if (!nextDisabled && !busy) {
          event.preventDefault();
          onNext();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentIndex, nextDisabled, busy, onPrev, onNext]);

  if (!currentStep) {
    return <></>;
  }

  // Barra compacta mobile: segmentos representando cada etapa
  const mobileSegmentClass = (stepIndex: number): string => {
    if (stepIndex < currentIndex) return 'h-1.5 flex-1 rounded-full bg-fortuno-gold-intense';
    if (stepIndex === currentIndex)
      return 'h-1.5 flex-1 rounded-full bg-fortuno-gold-soft animate-pulse';
    return 'h-1.5 flex-1 rounded-full bg-fortuno-offwhite/15';
  };

  return (
    <div className="min-h-screen bg-noir-page text-fortuno-offwhite">
      {/* MOBILE: barra compacta */}
      <header
        className="md:hidden sticky top-0 z-30 px-4 py-3 backdrop-blur-md bg-[rgba(7,32,26,0.75)] border-b border-fortuno-gold-soft/15"
        aria-label="Progresso do wizard (compacto)"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-[0.2em] text-fortuno-offwhite/60">
            Sorteio
          </span>
          <span className="text-xs font-mono text-fortuno-gold-soft">
            {currentIndex + 1} / {total}
          </span>
        </div>
        <ol className="flex gap-1.5" aria-label="Etapas do wizard (compacto)">
          {steps.map((step) => (
            <li
              key={step.key}
              className={mobileSegmentClass(step.index)}
              aria-current={step.index === currentIndex ? 'step' : undefined}
              aria-label={
                step.index < currentIndex
                  ? 'Concluída'
                  : step.index === currentIndex
                    ? 'Atual'
                    : 'Pendente'
              }
            />
          ))}
        </ol>
      </header>

      <div className="relative mx-auto max-w-[1240px] px-4 md:px-8 py-8 md:py-12">
        <div className="hidden md:flex items-center gap-3 mb-8">
          {breadcrumb ?? DEFAULT_BREADCRUMB}
        </div>

        <div className="grid md:grid-cols-[300px_1fr] gap-8 lg:gap-12 items-start">
          <aside className="hidden md:block sticky top-8 self-start">
            <WizardStepper
              steps={steps}
              currentIndex={currentIndex}
              maxUnlockedIndex={effectiveMaxUnlocked}
              onJump={onJump}
            />
          </aside>

          <main className="min-w-0">
            <article className="rounded-3xl bg-noir-glass backdrop-blur-xl border border-[color:var(--noir-glass-border)] shadow-noir-card overflow-hidden">
              <header className="relative px-6 md:px-12 pt-10 md:pt-14 pb-8">
                <div
                  className="absolute top-0 inset-x-0 h-px bg-gold-divider"
                  aria-hidden="true"
                />
                <div className="flex items-start gap-6 md:gap-10">
                  <span
                    aria-hidden="true"
                    className="font-display italic font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-fortuno-gold-soft via-fortuno-gold-intense to-fortuno-gold-intense/25 leading-[0.85] select-none tracking-[-0.04em]"
                    style={{ fontSize: 'clamp(96px, 14vw, 168px)' }}
                  >
                    {String(currentIndex + 1).padStart(2, '0')}
                  </span>

                  <div className="flex-1 pt-2 md:pt-4 min-w-0">
                    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-fortuno-gold-soft mb-3">
                      <span className="h-px w-6 bg-fortuno-gold-soft" aria-hidden="true" />
                      Etapa ativa
                    </span>
                    <h1 className="font-display text-4xl md:text-5xl text-fortuno-offwhite leading-[1.05] mb-3">
                      {currentStep.title}
                    </h1>
                    {currentStep.subtitle && (
                      <p className="text-fortuno-offwhite/65 text-base md:text-lg max-w-prose leading-relaxed">
                        {currentStep.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  {typeof currentStep.estimatedMinutes === 'number' && (
                    <span className="inline-flex items-center gap-2 text-fortuno-offwhite/65">
                      <Clock className="w-4 h-4 text-fortuno-gold-soft" aria-hidden="true" />
                      <span>≈ {currentStep.estimatedMinutes} min</span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2 text-fortuno-offwhite/65">
                    <Save className="w-4 h-4 text-fortuno-gold-soft" aria-hidden="true" />
                    <span>Salvo automaticamente</span>
                  </span>
                  <span className="inline-flex items-center gap-2 text-fortuno-offwhite/65">
                    <Lightbulb className="w-4 h-4 text-fortuno-gold-soft" aria-hidden="true" />
                    <span>Você poderá rever antes de ativar</span>
                  </span>
                </div>
              </header>

              <div className="h-px bg-gold-divider mx-6 md:mx-12" aria-hidden="true" />

              <section
                key={currentIndex}
                className="wz-form px-6 md:px-12 py-10 md:py-12 motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-right-2 motion-safe:duration-300 motion-reduce:animate-none motion-reduce:transition-none"
              >
                {children}
              </section>
            </article>

            <div className="h-28 md:h-24" aria-hidden="true" />
          </main>
        </div>
      </div>

      <WizardFooter
        currentIndex={currentIndex}
        total={total}
        onPrev={onPrev}
        onNext={onNext}
        busy={busy}
        nextDisabled={nextDisabled}
        nextLabel={isLast ? finalLabel : nextLabel}
        remainingMinutes={remainingMinutes}
      />
    </div>
  );
};
