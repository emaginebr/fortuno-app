import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  IdCard,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  useAuth,
  useUser,
  validateCPF,
  validatePhone,
  formatDocument,
  formatPhone,
} from 'nauth-react';
import { Modal } from '@/components/common/Modal';
import { useCheckout } from '@/hooks/useCheckout';
import type { UseCheckoutWizardReturn } from '@/hooks/useCheckoutWizard';

export interface RegisterStepProps {
  wizard: UseCheckoutWizardReturn;
}

const inputClass =
  'w-full pl-10 pr-3 py-3 rounded-xl border border-fortuno-black/15 bg-white text-fortuno-black placeholder:text-fortuno-black/40 focus:border-fortuno-gold-intense focus:outline-none focus:ring-[3px] focus:ring-fortuno-gold-soft/35 transition-colors';

const labelClass =
  'text-[11px] font-bold uppercase tracking-[0.18em] text-fortuno-black/65';

const slugify = (name: string): string =>
  name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

interface LoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const LoginModal = ({ onClose, onSuccess }: LoginModalProps): JSX.Element => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = email.trim().length > 3 && password.length > 0 && !submitting;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      toast.success('Login realizado com sucesso.');
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose} ariaLabelledBy="login-modal-title">
      <header className="flex items-center justify-between gap-3 px-6 pt-5 pb-4 border-b border-fortuno-black/[0.08]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.26em] text-fortuno-gold-intense font-semibold">
            Acessar sua conta
          </p>
          <h2
            id="login-modal-title"
            className="font-display text-2xl text-fortuno-black mt-0.5"
          >
            Entrar
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="w-9 h-9 rounded-full grid place-items-center text-fortuno-black/55 hover:text-fortuno-black hover:bg-fortuno-black/[0.04] transition-colors focus-visible:outline-none focus-visible:shadow-gold-focus"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </header>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="p-6 space-y-4"
        noValidate
      >
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>E-mail</span>
          <div className="relative">
            <Mail
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fortuno-gold-intense/80"
              aria-hidden="true"
            />
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className={inputClass}
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Senha</span>
          <div className="relative">
            <Lock
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fortuno-gold-intense/80"
              aria-hidden="true"
            />
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              className="w-full pl-10 pr-20 py-3 rounded-xl border border-fortuno-black/15 bg-white text-fortuno-black placeholder:text-fortuno-black/40 focus:border-fortuno-gold-intense focus:outline-none focus:ring-[3px] focus:ring-fortuno-gold-soft/35 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold uppercase tracking-[0.18em] text-fortuno-gold-intense hover:text-fortuno-gold-soft transition-colors"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </label>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-[18px] py-2.5 rounded-full bg-transparent text-fortuno-green-elegant border border-fortuno-green-elegant/25 text-[12px] font-semibold transition-colors hover:bg-fortuno-gold-intense/10 hover:border-fortuno-gold-intense min-h-[40px] focus-visible:outline-none focus-visible:shadow-gold-focus"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            aria-busy={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-fortuno-gold-intense text-fortuno-black font-bold text-[13px] tracking-wide shadow-[0_8px_22px_-6px_rgba(212,175,55,0.45),0_1px_0_rgba(255,255,255,0.35)_inset] transition-all hover:bg-fortuno-gold-soft hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 focus-visible:outline-none focus-visible:shadow-gold-focus min-h-[40px]"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            ) : null}
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const RegisterStep = ({ wizard }: RegisterStepProps): JSX.Element => {
  const { t } = useTranslation();
  const { isAuthenticated, register, login } = useAuth();
  const { user, updateUser } = useUser();
  const checkout = useCheckout();

  const isCompleteProfile =
    isAuthenticated && wizard.registerMode === 'complete-profile';

  // Formulário de cadastro anônimo
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCpf, setRegCpf] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regSubmitting, setRegSubmitting] = useState(false);

  // Formulário complete-profile
  const [cpf, setCpf] = useState<string>(() =>
    user?.idDocument ? formatDocument(user.idDocument) : '',
  );
  const [phone, setPhone] = useState<string>(() => {
    const first = user?.phones?.[0]?.phone;
    return first ? formatPhone(first) : '';
  });
  const [completeErrors, setCompleteErrors] = useState<{
    cpf?: string;
    phone?: string;
  }>({});
  const [completeSaving, setCompleteSaving] = useState(false);

  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    setCpf(user.idDocument ? formatDocument(user.idDocument) : '');
    setPhone(user.phones?.[0]?.phone ? formatPhone(user.phones[0].phone) : '');
  }, [user]);

  const advanceToCart = (): void => {
    checkout.goToStep('numbers');
  };

  const canSubmitRegister = useMemo(
    () =>
      regName.trim().length > 1 &&
      regEmail.trim().length > 3 &&
      validatePhone(regPhone) &&
      validateCPF(regCpf) &&
      regPassword.length >= 6 &&
      regPassword === regConfirm &&
      !regSubmitting,
    [regName, regEmail, regPhone, regCpf, regPassword, regConfirm, regSubmitting],
  );

  const handleRegister = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!canSubmitRegister) {
      if (regPassword !== regConfirm) toast.error('As senhas não coincidem.');
      else if (!validateCPF(regCpf)) toast.error('CPF inválido.');
      else if (!validatePhone(regPhone)) toast.error('Telefone inválido.');
      return;
    }
    setRegSubmitting(true);
    try {
      await register({
        slug: slugify(regName),
        imageUrl: '',
        name: regName.trim(),
        email: regEmail.trim(),
        isAdmin: false,
        idDocument: regCpf.replace(/\D/g, ''),
        pixKey: '',
        password: regPassword,
        roles: [],
        phones: [{ phone: regPhone.replace(/\D/g, '') }],
        addresses: [],
      } as Parameters<typeof register>[0]);
      await login({ email: regEmail.trim(), password: regPassword });
      toast.success('Conta criada com sucesso.');
      // Wizard irá reavaliar — se CPF/tel completos, avança direto p/ cart
      // no próximo ciclo via profileComplete.
      advanceToCart();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Não foi possível criar a conta.',
      );
    } finally {
      setRegSubmitting(false);
    }
  };

  const handleCompleteProfile = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    const nextErrors: { cpf?: string; phone?: string } = {};
    if (!validateCPF(cpf)) nextErrors.cpf = t('checkout.register.errorCpf');
    if (!validatePhone(phone)) nextErrors.phone = t('checkout.register.errorPhone');
    setCompleteErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!user) return;
    setCompleteSaving(true);
    try {
      // Backend exige payload completo do usuário; preservamos tudo e só
      // sobrescrevemos CPF e telefone.
      await updateUser({
        ...user,
        idDocument: cpf.replace(/\D/g, ''),
        phones: [{ phone: phone.replace(/\D/g, '') }],
      });
      toast.success(t('checkout.register.profileSaved'));
      advanceToCart();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setCompleteSaving(false);
    }
  };

  // Modo complete-profile (usuário autenticado sem CPF/telefone)
  if (isCompleteProfile) {
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
            {t('checkout.register.completeTitle')}
          </h2>
          <p className="text-sm text-fortuno-black/70 mt-2">
            {t('checkout.register.completeSub')}
          </p>
        </header>

        <form
          onSubmit={(e) => void handleCompleteProfile(e)}
          className="grid md:grid-cols-2 gap-5"
          noValidate
        >
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>{t('checkout.register.cpfLabel')}</span>
            <div className="relative">
              <IdCard
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fortuno-gold-intense/80"
                aria-hidden="true"
              />
              <input
                type="text"
                inputMode="numeric"
                value={cpf}
                onChange={(e) => setCpf(formatDocument(e.target.value))}
                aria-invalid={!!completeErrors.cpf}
                placeholder="000.000.000-00"
                className={inputClass}
              />
            </div>
            {completeErrors.cpf ? (
              <span className="text-xs text-red-700 font-semibold">
                {completeErrors.cpf}
              </span>
            ) : null}
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>
              {t('checkout.register.phoneLabel')}
            </span>
            <div className="relative">
              <Phone
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fortuno-gold-intense/80"
                aria-hidden="true"
              />
              <input
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                aria-invalid={!!completeErrors.phone}
                placeholder="(11) 90000-0000"
                className={inputClass}
              />
            </div>
            {completeErrors.phone ? (
              <span className="text-xs text-red-700 font-semibold">
                {completeErrors.phone}
              </span>
            ) : null}
          </label>

          <footer className="md:col-span-2 flex items-center justify-between mt-4 pt-6 border-t border-fortuno-gold-intense/15 flex-wrap gap-3">
            <p className="text-[11px] text-fortuno-black/55 inline-flex items-center gap-1.5">
              <ShieldCheck
                className="w-3.5 h-3.5 text-fortuno-gold-intense"
                aria-hidden="true"
              />
              {t('checkout.register.securityNote')}
            </p>
            <button
              type="submit"
              disabled={completeSaving}
              aria-busy={completeSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-fortuno-gold-intense text-fortuno-black font-bold text-[13px] tracking-wide shadow-[0_8px_22px_-6px_rgba(212,175,55,0.45),0_1px_0_rgba(255,255,255,0.35)_inset] transition-all hover:bg-fortuno-gold-soft hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 focus-visible:outline-none focus-visible:shadow-gold-focus min-h-[40px]"
            >
              {completeSaving ? (
                <Loader2
                  className="w-4 h-4 animate-spin motion-reduce:animate-none"
                  aria-hidden="true"
                />
              ) : null}
              {completeSaving
                ? t('common.loading')
                : t('checkout.register.continueToCart')}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </footer>
        </form>
      </section>
    );
  }

  // Modo anônimo — cadastro custom
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
          Crie sua conta
        </h2>
        <p className="text-sm text-fortuno-black/70 mt-2">
          Preencha seus dados para finalizar a compra. É rápido e seguro.
        </p>
      </header>

      <form
        onSubmit={(e) => void handleRegister(e)}
        className="grid md:grid-cols-2 gap-5"
        noValidate
      >
        <label className="md:col-span-2 flex flex-col gap-1.5">
          <span className={labelClass}>Nome completo</span>
          <div className="relative">
            <User
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fortuno-gold-intense/80"
              aria-hidden="true"
            />
            <input
              type="text"
              autoComplete="name"
              required
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="Seu nome completo"
              className={inputClass}
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>E-mail</span>
          <div className="relative">
            <Mail
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fortuno-gold-intense/80"
              aria-hidden="true"
            />
            <input
              type="email"
              autoComplete="email"
              required
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder="seu@email.com"
              className={inputClass}
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Telefone</span>
          <div className="relative">
            <Phone
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fortuno-gold-intense/80"
              aria-hidden="true"
            />
            <input
              type="tel"
              inputMode="tel"
              required
              value={regPhone}
              onChange={(e) => setRegPhone(formatPhone(e.target.value))}
              placeholder="(11) 90000-0000"
              className={inputClass}
            />
          </div>
        </label>

        <label className="md:col-span-2 flex flex-col gap-1.5">
          <span className={labelClass}>CPF</span>
          <div className="relative">
            <IdCard
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fortuno-gold-intense/80"
              aria-hidden="true"
            />
            <input
              type="text"
              inputMode="numeric"
              required
              value={regCpf}
              onChange={(e) => setRegCpf(formatDocument(e.target.value))}
              placeholder="000.000.000-00"
              className={inputClass}
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Senha</span>
          <div className="relative">
            <Lock
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fortuno-gold-intense/80"
              aria-hidden="true"
            />
            <input
              type={regShowPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={6}
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full pl-10 pr-20 py-3 rounded-xl border border-fortuno-black/15 bg-white text-fortuno-black placeholder:text-fortuno-black/40 focus:border-fortuno-gold-intense focus:outline-none focus:ring-[3px] focus:ring-fortuno-gold-soft/35 transition-colors"
            />
            <button
              type="button"
              onClick={() => setRegShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold uppercase tracking-[0.18em] text-fortuno-gold-intense hover:text-fortuno-gold-soft transition-colors"
              aria-label={regShowPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {regShowPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Confirmar senha</span>
          <div className="relative">
            <Lock
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fortuno-gold-intense/80"
              aria-hidden="true"
            />
            <input
              type={regShowPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={6}
              value={regConfirm}
              onChange={(e) => setRegConfirm(e.target.value)}
              placeholder="Repita a senha"
              aria-invalid={
                regConfirm.length > 0 && regPassword !== regConfirm
              }
              className={inputClass}
            />
          </div>
          {regConfirm.length > 0 && regPassword !== regConfirm ? (
            <span className="text-xs text-red-700 font-semibold">
              As senhas não coincidem.
            </span>
          ) : null}
        </label>

        <footer className="md:col-span-2 flex items-center justify-between mt-4 pt-6 border-t border-fortuno-gold-intense/15 flex-wrap gap-3">
          <p className="text-sm text-fortuno-black/70">
            Já tem uma conta?{' '}
            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="font-semibold text-fortuno-gold-intense hover:text-fortuno-gold-soft transition-colors underline-offset-2 hover:underline"
            >
              Entrar
            </button>
          </p>
          <button
            type="submit"
            disabled={!canSubmitRegister}
            aria-busy={regSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-fortuno-gold-intense text-fortuno-black font-bold text-[13px] tracking-wide shadow-[0_8px_22px_-6px_rgba(212,175,55,0.45),0_1px_0_rgba(255,255,255,0.35)_inset] transition-all hover:bg-fortuno-gold-soft hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 focus-visible:outline-none focus-visible:shadow-gold-focus min-h-[40px]"
          >
            {regSubmitting ? (
              <Loader2
                className="w-4 h-4 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : null}
            {regSubmitting ? 'Criando conta...' : 'Criar conta e continuar'}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </footer>

        <p className="md:col-span-2 text-[11px] text-fortuno-black/55 inline-flex items-center gap-1.5">
          <ShieldCheck
            className="w-3.5 h-3.5 text-fortuno-gold-intense"
            aria-hidden="true"
          />
          {t('checkout.register.securityNote')}
        </p>
      </form>

      {loginOpen ? (
        <LoginModal
          onClose={() => setLoginOpen(false)}
          onSuccess={() => {
            setLoginOpen(false);
            // Wizard reavalia: se perfil completo, avança; senão mostra complete-profile.
          }}
        />
      ) : null}
    </section>
  );
};
