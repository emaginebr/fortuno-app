import { Check, Lock, Circle } from 'lucide-react';
import type { WizardStepMeta } from './VerticalWizardShell';

interface WizardStepperProps {
  steps: WizardStepMeta[];
  currentIndex: number;
  maxUnlockedIndex: number;
  onJump: (index: number) => void;
}

const getState = (
  index: number,
  currentIndex: number,
  maxUnlockedIndex: number,
): 'done' | 'active' | 'pending' | 'locked' => {
  if (index > maxUnlockedIndex) return 'locked';
  if (index === currentIndex) return 'active';
  if (index < currentIndex) return 'done';
  return 'pending';
};

export const WizardStepper = ({
  steps,
  currentIndex,
  maxUnlockedIndex,
  onJump,
}: WizardStepperProps): JSX.Element => {
  const total = steps.length;
  const progressPct = total > 1 ? (currentIndex / (total - 1)) * 100 : 0;

  return (
    <div className="rounded-3xl bg-noir-glass backdrop-blur-xl border border-[color:var(--noir-glass-border)] shadow-noir-card p-6 pr-4">
      <h2 className="font-display text-2xl text-fortuno-offwhite mb-1">
        Composição do sorteio
      </h2>
      <p className="text-xs text-fortuno-offwhite/55 mb-6">Cada etapa libera a próxima.</p>

      <div className="relative">
        <div className="wizard-rail-track" aria-hidden="true">
          <div className="wizard-rail-fill" style={{ height: `${progressPct}%` }} />
        </div>

        <ol className="flex flex-col gap-5" aria-label="Etapas do wizard">
          {steps.map((step) => {
            const state = getState(step.index, currentIndex, maxUnlockedIndex);
            const Icon = step.icon ?? Circle;
            const indexLabel = String(step.index + 1).padStart(2, '0');
            const ariaLabel =
              state === 'done'
                ? `Etapa ${step.index + 1}: ${step.title} (concluída). Voltar para esta etapa.`
                : state === 'active'
                  ? `Etapa ${step.index + 1}: ${step.title} (atual).`
                  : state === 'pending'
                    ? `Etapa ${step.index + 1}: ${step.title} (pendente).`
                    : `Etapa ${step.index + 1}: ${step.title} (bloqueada). Conclua a anterior.`;

            const commonClasses =
              'wizard-step-item w-full flex items-center gap-4 text-left min-h-[56px]';

            const inner = (
              <>
                <span className="wizard-step-marker">
                  {state === 'done' ? (
                    <Check className="check-icon w-6 h-6" aria-hidden="true" />
                  ) : (
                    <Icon
                      className={state === 'active' ? 'w-6 h-6' : 'w-5 h-5'}
                      aria-hidden="true"
                    />
                  )}
                </span>
                <span className="flex-1 min-w-0 flex items-center gap-2">
                  <span className="flex-1 min-w-0">
                    <span
                      className={`block text-[10px] uppercase tracking-[0.22em] ${
                        state === 'active'
                          ? 'text-fortuno-gold-soft'
                          : state === 'done'
                            ? 'text-fortuno-gold-soft/80'
                            : state === 'pending'
                              ? 'text-fortuno-offwhite/45'
                              : 'text-fortuno-offwhite/30'
                      }`}
                    >
                      Etapa {indexLabel}
                      {state === 'active' ? ' · agora' : ''}
                    </span>
                    <span
                      className={`wizard-step-label block text-[15px] ${
                        state === 'locked'
                          ? 'font-medium text-fortuno-offwhite/45'
                          : state === 'pending'
                            ? 'font-medium text-fortuno-offwhite/75'
                            : 'font-semibold text-fortuno-offwhite'
                      }`}
                    >
                      {step.title}
                    </span>
                  </span>
                  {state === 'locked' && (
                    <Lock
                      className="w-3.5 h-3.5 text-fortuno-offwhite/35 flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </>
            );

            return (
              <li key={step.key}>
                {state === 'locked' ? (
                  <span
                    className={commonClasses}
                    data-state={state}
                    aria-disabled="true"
                    aria-label={ariaLabel}
                  >
                    {inner}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onJump(step.index)}
                    className={`${commonClasses} focus-visible:outline-none focus-visible:shadow-gold-focus rounded-md`}
                    data-state={state}
                    aria-current={state === 'active' ? 'step' : undefined}
                    aria-label={ariaLabel}
                  >
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-6 pt-5 border-t border-fortuno-gold-soft/15">
        <p className="text-[11px] text-fortuno-offwhite/45 leading-relaxed">
          <span className="text-fortuno-gold-soft/80">Atalhos:</span>{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-fortuno-offwhite/85 text-[10px] font-mono">
            Alt
          </kbd>{' '}
          +{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-fortuno-offwhite/85 text-[10px] font-mono">
            ←
          </kbd>{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-fortuno-offwhite/85 text-[10px] font-mono">
            →
          </kbd>{' '}
          navegar etapas
        </p>
      </div>
    </div>
  );
};
