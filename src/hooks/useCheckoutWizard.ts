import { useCallback, useEffect, useMemo } from 'react';
import { useAuth, useUser } from 'nauth-react';
import { useCheckout } from '@/hooks/useCheckout';
import { TicketOrderStatus } from '@/types/enums';
import type { CheckoutStep } from '@/Contexts/CheckoutContext';

/**
 * IDs semânticos das 4 etapas do wizard horizontal. O `CheckoutContext`
 * interno ainda usa `'quantity' | 'auth' | 'numbers' | 'payment' | 'success'`;
 * este hook traduz para os IDs do redesign sem mutar o tipo do contexto
 * (scope: não alterar contextos/tipos).
 */
export type WizardStepId = 'register' | 'cart' | 'pix' | 'success';

export type WizardStepState = 'skipped' | 'done' | 'active' | 'pending';

export interface WizardStepDef {
  id: WizardStepId;
  index: 0 | 1 | 2 | 3;
}

export interface UseCheckoutWizardReturn {
  steps: WizardStepDef[];
  states: WizardStepState[];
  currentIndex: 0 | 1 | 2 | 3;
  currentStepId: WizardStepId;
  /** Indica se o perfil do usuário já cobre CPF + telefone. */
  profileComplete: boolean;
  /** Modo sugerido para a etapa 1 quando ela é ativa. */
  registerMode: 'register-new' | 'login-inline' | 'complete-profile';
  goToStep: (index: 0 | 1 | 2 | 3) => void;
  canGoTo: (index: 0 | 1 | 2 | 3) => boolean;
  /** Fração 0..100 para o fill da trilha do stepper. */
  trackFill: number;
}

const STEPS: WizardStepDef[] = [
  { id: 'register', index: 0 },
  { id: 'cart', index: 1 },
  { id: 'pix', index: 2 },
  { id: 'success', index: 3 },
];

const CONTEXT_STEP_BY_WIZARD: Record<WizardStepId, CheckoutStep> = {
  register: 'auth',
  cart: 'numbers',
  pix: 'payment',
  success: 'success',
};

const hasDocument = (value: string | undefined | null): boolean =>
  typeof value === 'string' && value.replace(/\D/g, '').length >= 11;

const hasAnyPhone = (phones: Array<{ phone: string }> | undefined): boolean =>
  Array.isArray(phones) &&
  phones.some((p) => typeof p?.phone === 'string' && p.phone.replace(/\D/g, '').length >= 10);

export const useCheckoutWizard = (): UseCheckoutWizardReturn => {
  const { isAuthenticated } = useAuth();
  const { user } = useUser();
  const checkout = useCheckout();

  const profileComplete = useMemo<boolean>(() => {
    if (!isAuthenticated || !user) return false;
    return hasDocument(user.idDocument) && hasAnyPhone(user.phones);
  }, [isAuthenticated, user]);

  const registerMode: 'register-new' | 'login-inline' | 'complete-profile' = useMemo(() => {
    if (!isAuthenticated) return 'register-new';
    if (!profileComplete) return 'complete-profile';
    return 'register-new';
  }, [isAuthenticated, profileComplete]);

  const currentStepId = useMemo<WizardStepId>(() => {
    // Terminal
    if (checkout.lastStatus === TicketOrderStatus.Paid || checkout.currentStep === 'success') {
      return 'success';
    }
    if (checkout.qrCode && checkout.currentStep === 'payment') {
      return 'pix';
    }
    // Sem perfil completo → register
    if (!profileComplete) {
      return 'register';
    }
    // Perfil completo → cart (a menos que o usuário já tenha avançado)
    if (checkout.currentStep === 'payment') return 'pix';
    return 'cart';
  }, [checkout.currentStep, checkout.qrCode, checkout.lastStatus, profileComplete]);

  const currentIndex = useMemo<0 | 1 | 2 | 3>(() => {
    switch (currentStepId) {
      case 'register':
        return 0;
      case 'cart':
        return 1;
      case 'pix':
        return 2;
      case 'success':
        return 3;
    }
  }, [currentStepId]);

  const states = useMemo<WizardStepState[]>(() => {
    const registerState: WizardStepState = profileComplete
      ? 'skipped'
      : currentStepId === 'register'
        ? 'active'
        : 'done';

    const cartState: WizardStepState =
      currentStepId === 'cart'
        ? 'active'
        : currentStepId === 'pix' || currentStepId === 'success'
          ? 'done'
          : 'pending';

    const pixState: WizardStepState =
      currentStepId === 'pix' ? 'active' : currentStepId === 'success' ? 'done' : 'pending';

    const successState: WizardStepState =
      currentStepId === 'success' ? 'active' : 'pending';

    return [registerState, cartState, pixState, successState];
  }, [currentStepId, profileComplete]);

  const trackFill = useMemo<number>(() => {
    // Fill vai de 0 → 100. Aproximadamente: etapa 1 = 0, etapa 2 = 33, etapa 3 = 66, etapa 4 = 100.
    const map: Record<WizardStepId, number> = {
      register: 0,
      cart: 33.33,
      pix: 66.66,
      success: 100,
    };
    return map[currentStepId];
  }, [currentStepId]);

  const canGoTo = useCallback(
    (index: 0 | 1 | 2 | 3): boolean => {
      if (index === currentIndex) return true;
      // Success é terminal.
      if (currentStepId === 'success') return false;
      // Voltar para register só se estivermos no cart. Senão (pix/success), trava.
      if (index === 0) {
        if (profileComplete) return false;
        return currentStepId === 'cart';
      }
      // Cart: permitido voltar a partir de pix (se QR ainda não existe) — mas por segurança, só se estivermos no cart.
      if (index === 1) {
        return currentStepId === 'cart' || currentStepId === 'register';
      }
      // Pix: só avança programaticamente (via startPayment); clique no marker não.
      if (index === 2) {
        return currentStepId === 'pix';
      }
      return false;
    },
    [currentIndex, currentStepId, profileComplete],
  );

  const goToStep = useCallback(
    (index: 0 | 1 | 2 | 3): void => {
      if (!canGoTo(index)) return;
      const target = STEPS[index];
      checkout.goToStep(CONTEXT_STEP_BY_WIZARD[target.id]);
    },
    [canGoTo, checkout],
  );

  // Auto-skip da etapa 1 quando perfil está completo e ainda estamos em auth/quantity.
  useEffect(() => {
    if (!profileComplete) return;
    if (checkout.currentStep === 'auth' || checkout.currentStep === 'quantity') {
      checkout.goToStep('numbers');
    }
  }, [profileComplete, checkout]);

  return {
    steps: STEPS,
    states,
    currentIndex,
    currentStepId,
    profileComplete,
    registerMode,
    goToStep,
    canGoTo,
    trackFill,
  };
};
