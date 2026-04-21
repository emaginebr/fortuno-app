import type { ReactNode } from 'react';

export interface WizardStepMeta {
  index: number;
  key: string;
  title: string;
}

interface WizardShellProps {
  steps: WizardStepMeta[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onJump: (index: number) => void;
  children: ReactNode;
  nextLabel?: string;
  nextDisabled?: boolean;
  busy?: boolean;
}

export const WizardShell = ({
  steps,
  currentIndex,
  onPrev,
  onNext,
  onJump,
  children,
  nextLabel = 'Próximo',
  nextDisabled = false,
  busy = false,
}: WizardShellProps): JSX.Element => {
  const current = steps[currentIndex];
  const total = steps.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <ol
        className="flex flex-wrap gap-2 overflow-x-auto pb-2 text-sm"
        aria-label="Etapas do wizard"
      >
        {steps.map((step) => {
          const done = step.index < currentIndex;
          const active = step.index === currentIndex;
          return (
            <li key={step.key} className="flex-shrink-0">
              <button
                type="button"
                onClick={() => onJump(step.index)}
                className={`flex items-center gap-2 rounded-full px-3 py-1 transition ${
                  active
                    ? 'bg-fortuno-gold-intense text-fortuno-black'
                    : done
                      ? 'bg-fortuno-green-elegant text-fortuno-offwhite'
                      : 'bg-white text-fortuno-black/60'
                }`}
              >
                <span className="font-mono">{step.index + 1}</span>
                <span>{step.title}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-display text-2xl text-fortuno-black">
          Etapa {currentIndex + 1} de {total} · {current?.title}
        </h2>
        <div className="mt-6">{children}</div>
      </section>

      <footer className="mt-6 flex justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex === 0 || busy}
          className="btn-secondary disabled:opacity-40"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled || busy}
          className="btn-primary disabled:opacity-40"
        >
          {busy ? 'Salvando...' : currentIndex === total - 1 ? 'Finalizar' : nextLabel}
        </button>
      </footer>
    </div>
  );
};
