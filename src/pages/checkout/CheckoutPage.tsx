import { CheckoutWizardShell } from '@/components/checkout/CheckoutWizardShell';

/**
 * Rota `/checkout/:lotteryId` — delega todo o fluxo (auth/carrinho/pix/sucesso)
 * para `CheckoutWizardShell`. A arquitetura do wizard vive em
 * `src/components/checkout/`.
 */
export const CheckoutPage = (): JSX.Element => <CheckoutWizardShell />;
