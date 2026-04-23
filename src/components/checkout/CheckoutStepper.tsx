import { Check, PartyPopper, QrCode, ShoppingCart, UserCheck, UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { LucideIcon } from 'lucide-react';
import type { WizardStepState } from '@/hooks/useCheckoutWizard';

type StepId = 'register' | 'cart' | 'pix' | 'success';

interface StepDef {
  id: StepId;
  labelKey: string;
  subKey: string;
  icon: LucideIcon;
}

const STEPS: StepDef[] = [
  { id: 'register', labelKey: 'checkout.steps.register.label', subKey: 'checkout.steps.register.sub', icon: UserRound },
  { id: 'cart', labelKey: 'checkout.steps.cart.label', subKey: 'checkout.steps.cart.sub', icon: ShoppingCart },
  { id: 'pix', labelKey: 'checkout.steps.pix.label', subKey: 'checkout.steps.pix.sub', icon: QrCode },
  { id: 'success', labelKey: 'checkout.steps.success.label', subKey: 'checkout.steps.success.sub', icon: PartyPopper },
];

export interface CheckoutStepperProps {
  currentIndex: 0 | 1 | 2 | 3;
  states: WizardStepState[];
  trackFill: number;
  onGoToStep: (index: 0 | 1 | 2 | 3) => void;
  canGoTo: (index: 0 | 1 | 2 | 3) => boolean;
}

export const CheckoutStepper = ({
  currentIndex,
  states,
  trackFill,
  onGoToStep,
  canGoTo,
}: CheckoutStepperProps): JSX.Element => {
  const { t } = useTranslation();
  const currentLabel = t(STEPS[currentIndex].labelKey);

  return (
    <>
      {/* Mobile: barra compacta */}
      <div
        className="hstep-mobile lg:hidden"
        role="status"
        aria-label={t('checkout.stepOfTotal', {
          current: currentIndex + 1,
          total: STEPS.length,
          name: currentLabel,
        })}
      >
        <ol className="hstep-mobile-dots" aria-hidden="true">
          {STEPS.map((s, i) => (
            <li key={s.id} data-state={states[i]} />
          ))}
        </ol>
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-fortuno-gold-intense whitespace-nowrap">
          {t('checkout.stepOfTotal', {
            current: currentIndex + 1,
            total: STEPS.length,
            name: currentLabel,
          })}
        </span>
      </div>

      {/* Desktop */}
      <nav aria-label={t('checkout.navAria')} className="hidden lg:block">
        <ol
          className="hstep-wrap grid grid-cols-4"
          style={{ ['--hstep-fill' as string]: `${trackFill}` }}
        >
          {STEPS.map((s, i) => {
            const state = states[i];
            const clickable = canGoTo(i as 0 | 1 | 2 | 3);
            const Icon = state === 'skipped' ? UserCheck : s.icon;
            const ariaCurrent = state === 'active' ? 'step' : undefined;
            const inner = (
              <>
                <span
                  className={[
                    'hstep-marker',
                    state === 'active' ? 'animate-hmarker-breath' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  data-state={state}
                  aria-hidden="true"
                >
                  {state === 'done' ? (
                    <Check className="w-5 h-5 animate-check-pop" strokeWidth={3} />
                  ) : (
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  )}
                </span>
                <span className="hstep-label">{t(s.labelKey)}</span>
                <span className="hstep-sub">{t(s.subKey)}</span>
              </>
            );

            if (clickable) {
              return (
                <li key={s.id} className="hstep-col" data-state={state}>
                  <button
                    type="button"
                    onClick={() => onGoToStep(i as 0 | 1 | 2 | 3)}
                    aria-current={ariaCurrent}
                    aria-label={t(s.labelKey)}
                    className="flex flex-col items-center gap-2.5 focus-visible:outline-none focus-visible:shadow-gold-focus rounded-full"
                  >
                    {inner}
                  </button>
                </li>
              );
            }

            return (
              <li
                key={s.id}
                className="hstep-col"
                data-state={state}
                aria-current={ariaCurrent}
                aria-disabled={state === 'pending' || state === 'skipped'}
                aria-label={
                  state === 'skipped'
                    ? t('checkout.stepSkippedAria', { name: t(s.labelKey) })
                    : undefined
                }
              >
                {inner}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export { STEPS as CHECKOUT_STEPS };
