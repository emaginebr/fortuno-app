import { useState, type FormEvent } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  LoginForm,
  RegisterForm,
  useAuth,
  useUser,
  validateCPF,
  validatePhone,
  formatDocument,
  formatPhone,
} from 'nauth-react';
import { useCheckout } from '@/hooks/useCheckout';
import type { UseCheckoutWizardReturn } from '@/hooks/useCheckoutWizard';

export interface RegisterStepProps {
  wizard: UseCheckoutWizardReturn;
}

type AnonMode = 'register-new' | 'login-inline';

/**
 * Etapa 1 — Cadastro. 3 modos:
 *  - register-new: <RegisterForm> do nauth-react, com link para trocar para login
 *  - login-inline: <LoginForm> do nauth-react, com link para voltar ao cadastro
 *  - complete-profile: usuário autenticado sem CPF/telefone — formulário CUSTOM
 *    (é perfil, não auth) via useUser().updateUser().
 *
 * SC-007: nada de auth custom. Os dois primeiros modos usam exclusivamente
 * os componentes do nauth-react.
 */
export const RegisterStep = ({ wizard }: RegisterStepProps): JSX.Element => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { user, updateUser } = useUser();
  const checkout = useCheckout();

  const [anonMode, setAnonMode] = useState<AnonMode>('register-new');

  const [cpf, setCpf] = useState<string>(() =>
    user?.idDocument ? formatDocument(user.idDocument) : '',
  );
  const [phone, setPhone] = useState<string>(() => {
    const first = user?.phones?.[0]?.phone;
    return first ? formatPhone(first) : '';
  });
  const [errors, setErrors] = useState<{ cpf?: string; phone?: string }>({});
  const [saving, setSaving] = useState(false);

  const advanceToCart = (): void => {
    checkout.goToStep('numbers');
  };

  const handleAuthSuccess = (): void => {
    toast.success(t('checkout.register.welcomeToast'));
    // O wizard irá reavaliar perfil e, se CPF/telefone faltarem, permanece em
    // 'register' no modo complete-profile.
  };

  const handleCompleteProfile = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const nextErrors: { cpf?: string; phone?: string } = {};
    if (!validateCPF(cpf)) nextErrors.cpf = t('checkout.register.errorCpf');
    if (!validatePhone(phone)) nextErrors.phone = t('checkout.register.errorPhone');
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      await updateUser({
        idDocument: cpf.replace(/\D/g, ''),
        phones: [{ phone: phone.replace(/\D/g, '') }],
      });
      toast.success(t('checkout.register.profileSaved'));
      advanceToCart();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  // Modo complete-profile (usuário autenticado sem CPF/telefone)
  if (isAuthenticated && wizard.registerMode === 'complete-profile') {
    return (
      <section aria-labelledby="register-step-title" className="max-w-3xl">
        <header className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.26em] text-fortuno-gold-intense font-semibold">
            {t('checkout.register.eyebrow')}
          </p>
          <h2
            id="register-step-title"
            className="font-display italic font-bold text-3xl md:text-4xl text-fortuno-black mt-1"
          >
            {t('checkout.register.completeTitle')}
          </h2>
          <p className="text-sm text-fortuno-black/70 mt-2">
            {t('checkout.register.completeSub')}
          </p>
        </header>

        <form onSubmit={(e) => void handleCompleteProfile(e)} className="grid md:grid-cols-2 gap-5" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="profile-cpf" className="text-xs font-semibold text-fortuno-black/75 uppercase tracking-[0.1em]">
              {t('checkout.register.cpfLabel')}
            </label>
            <input
              id="profile-cpf"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={cpf}
              onChange={(e) => setCpf(formatDocument(e.target.value))}
              aria-invalid={!!errors.cpf}
              aria-describedby="profile-cpf-error"
              className="w-full px-4 py-3 rounded-xl border-[1.5px] border-[color:var(--card-paper-border)] bg-white text-fortuno-black font-mono text-sm tracking-wide focus:border-fortuno-gold-intense focus:outline-none focus-visible:shadow-gold-focus transition-colors"
              placeholder="000.000.000-00"
            />
            {errors.cpf ? (
              <p id="profile-cpf-error" className="text-xs text-[color:var(--countdown-critical)] font-semibold">
                {errors.cpf}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="profile-phone" className="text-xs font-semibold text-fortuno-black/75 uppercase tracking-[0.1em]">
              {t('checkout.register.phoneLabel')}
            </label>
            <input
              id="profile-phone"
              type="text"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              aria-invalid={!!errors.phone}
              aria-describedby="profile-phone-error"
              className="w-full px-4 py-3 rounded-xl border-[1.5px] border-[color:var(--card-paper-border)] bg-white text-fortuno-black font-mono text-sm tracking-wide focus:border-fortuno-gold-intense focus:outline-none focus-visible:shadow-gold-focus transition-colors"
              placeholder="(00) 00000-0000"
            />
            {errors.phone ? (
              <p id="profile-phone-error" className="text-xs text-[color:var(--countdown-critical)] font-semibold">
                {errors.phone}
              </p>
            ) : null}
          </div>

          <footer className="md:col-span-2 flex items-center justify-between mt-4 pt-6 border-t border-fortuno-gold-intense/15 flex-wrap gap-3">
            <p className="text-[11px] text-fortuno-black/55 inline-flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-fortuno-gold-intense" aria-hidden="true" />
              {t('checkout.register.securityNote')}
            </p>
            <button type="submit" disabled={saving} className="cta-gold focus-visible:outline-none focus-visible:shadow-gold-focus">
              {saving ? t('common.loading') : t('checkout.register.continueToCart')}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </footer>
        </form>
      </section>
    );
  }

  // Modos anônimos — renderizam forms do nauth-react
  return (
    <section aria-labelledby="register-step-title" className="max-w-3xl">
      <header className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.26em] text-fortuno-gold-intense font-semibold">
          {t('checkout.register.eyebrow')}
        </p>
        <h2
          id="register-step-title"
          className="font-display italic font-bold text-3xl md:text-4xl text-fortuno-black mt-1"
        >
          {anonMode === 'register-new'
            ? t('checkout.register.createTitle')
            : t('checkout.register.loginTitle')}
        </h2>
        <p className="text-sm text-fortuno-black/70 mt-2">
          {anonMode === 'register-new'
            ? t('checkout.register.createSub')
            : t('checkout.register.loginSub')}
        </p>
      </header>

      {/* Tabs pequenas: Entrar / Criar conta */}
      <div role="tablist" aria-label={t('checkout.register.tablistAria')} className="mb-6 inline-flex gap-1 rounded-full border border-fortuno-gold-intense/25 bg-white p-1">
        <button
          role="tab"
          aria-selected={anonMode === 'register-new'}
          type="button"
          onClick={() => setAnonMode('register-new')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:shadow-gold-focus ${
            anonMode === 'register-new'
              ? 'bg-fortuno-gold-intense text-fortuno-black'
              : 'text-fortuno-black/60 hover:text-fortuno-black'
          }`}
        >
          {t('checkout.register.tabRegister')}
        </button>
        <button
          role="tab"
          aria-selected={anonMode === 'login-inline'}
          type="button"
          onClick={() => setAnonMode('login-inline')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:shadow-gold-focus ${
            anonMode === 'login-inline'
              ? 'bg-fortuno-gold-intense text-fortuno-black'
              : 'text-fortuno-black/60 hover:text-fortuno-black'
          }`}
        >
          {t('checkout.register.tabLogin')}
        </button>
      </div>

      <div className="rounded-2xl border border-fortuno-gold-intense/25 bg-white p-6 md:p-8 shadow-paper">
        {anonMode === 'register-new' ? (
          <RegisterForm onSuccess={handleAuthSuccess} />
        ) : (
          <LoginForm onSuccess={handleAuthSuccess} />
        )}
      </div>

      <footer className="mt-6 flex items-center gap-2 text-[11px] text-fortuno-black/55">
        <Lock className="w-3.5 h-3.5 text-fortuno-gold-intense" aria-hidden="true" />
        <span>{t('checkout.register.securityNote')}</span>
      </footer>
    </section>
  );
};
