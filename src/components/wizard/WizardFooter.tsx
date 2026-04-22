import { ArrowLeft, ArrowRight } from 'lucide-react';

interface WizardFooterProps {
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  busy: boolean;
  nextDisabled: boolean;
  nextLabel: string;
  remainingMinutes?: number;
}

export const WizardFooter = ({
  currentIndex,
  total,
  onPrev,
  onNext,
  busy,
  nextDisabled,
  nextLabel,
  remainingMinutes,
}: WizardFooterProps): JSX.Element => {
  const pct = total > 1 ? ((currentIndex + 1) / total) * 100 : 0;

  return (
    <footer
      className="fixed bottom-0 inset-x-0 z-40 backdrop-blur-md bg-[rgba(7,32,26,0.85)] border-t border-fortuno-gold-soft/15"
      role="contentinfo"
    >
      <div className="mx-auto max-w-[1240px] px-4 md:px-8 py-4 flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-3 min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl text-fortuno-gold-soft">{currentIndex + 1}</span>
            <span className="text-fortuno-offwhite/55 text-sm">de {total}</span>
          </div>
          <div
            className="h-1 w-[140px] rounded-full bg-fortuno-offwhite/10 overflow-hidden"
            aria-label="Progresso geral do wizard"
          >
            <span
              className="block h-full bg-gradient-to-r from-fortuno-gold-soft to-fortuno-gold-intense transition-all duration-noir-slow ease-noir-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          {typeof remainingMinutes === 'number' && remainingMinutes > 0 && (
            <span className="text-xs text-fortuno-offwhite/55 hidden md:inline">
              ≈ {remainingMinutes} min restantes
            </span>
          )}
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onPrev}
            disabled={currentIndex === 0 || busy}
            className="cta-ghost text-sm disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:shadow-gold-focus"
            aria-label="Etapa anterior"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Anterior</span>
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled || busy}
            className="cta-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:shadow-gold-focus"
            aria-label={nextLabel}
          >
            <span>{busy ? 'Salvando...' : nextLabel}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
};
