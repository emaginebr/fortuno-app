import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from 'nauth-react';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const RegisterPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    name.trim().length > 1 &&
    email.trim().length > 3 &&
    password.length >= 6 &&
    password === confirmPassword &&
    !submitting;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!canSubmit) {
      if (password !== confirmPassword) toast.error('As senhas não coincidem.');
      return;
    }
    setSubmitting(true);
    try {
      const slug = name
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      await register({
        slug,
        imageUrl: '',
        name: name.trim(),
        email: email.trim(),
        isAdmin: false,
        idDocument: '',
        pixKey: '',
        password,
        roles: [],
        phones: [],
        addresses: [],
      } as Parameters<typeof register>[0]);
      await login({ email: email.trim(), password });
      toast.success('Conta criada com sucesso.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível criar a conta.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-noir-page text-fortuno-offwhite flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="hero-particles" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-5 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.28em] text-fortuno-gold-soft">
          <span className="h-px w-8 bg-fortuno-gold-soft" aria-hidden="true" />
          <span>Criar sua conta</span>
          <span className="h-px w-8 bg-fortuno-gold-soft" aria-hidden="true" />
        </div>

        <div className="rounded-3xl bg-noir-glass backdrop-blur-xl border border-[color:var(--noir-glass-border)] shadow-noir-card p-7 md:p-9">
          <div className="mb-6 text-center">
            <img src="/logo-light.png" alt="Fortuno" className="mx-auto h-12" />
            <h1 className="mt-4 font-display text-2xl text-fortuno-offwhite">
              Crie sua conta
            </h1>
            <p className="mt-1 text-sm text-fortuno-offwhite/65">
              Cadastre-se para comprar bilhetes e acompanhar sorteios.
            </p>
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4" noValidate>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-fortuno-offwhite/70">
                Nome completo
              </span>
              <div className="relative">
                <User
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fortuno-gold-soft/70"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border !border-[rgba(236,232,225,0.15)] !bg-[rgba(7,32,26,0.55)] !text-fortuno-offwhite placeholder:!text-[rgba(236,232,225,0.35)] focus:!border-fortuno-gold-soft focus:outline-none focus:ring-[3px] focus:ring-fortuno-gold-soft/30 transition-colors"
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-fortuno-offwhite/70">
                E-mail
              </span>
              <div className="relative">
                <Mail
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fortuno-gold-soft/70"
                  aria-hidden="true"
                />
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border !border-[rgba(236,232,225,0.15)] !bg-[rgba(7,32,26,0.55)] !text-fortuno-offwhite placeholder:!text-[rgba(236,232,225,0.35)] focus:!border-fortuno-gold-soft focus:outline-none focus:ring-[3px] focus:ring-fortuno-gold-soft/30 transition-colors"
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-fortuno-offwhite/70">
                Senha
              </span>
              <div className="relative">
                <Lock
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fortuno-gold-soft/70"
                  aria-hidden="true"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-10 pr-20 py-3 rounded-xl border !border-[rgba(236,232,225,0.15)] !bg-[rgba(7,32,26,0.55)] !text-fortuno-offwhite placeholder:!text-[rgba(236,232,225,0.35)] focus:!border-fortuno-gold-soft focus:outline-none focus:ring-[3px] focus:ring-fortuno-gold-soft/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold uppercase tracking-wider text-fortuno-gold-soft/80 hover:text-fortuno-gold-soft transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-fortuno-offwhite/70">
                Confirmar senha
              </span>
              <div className="relative">
                <Lock
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fortuno-gold-soft/70"
                  aria-hidden="true"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                  aria-invalid={
                    confirmPassword.length > 0 && password !== confirmPassword
                  }
                  className="w-full pl-10 pr-3 py-3 rounded-xl border !border-[rgba(236,232,225,0.15)] !bg-[rgba(7,32,26,0.55)] !text-fortuno-offwhite placeholder:!text-[rgba(236,232,225,0.35)] focus:!border-fortuno-gold-soft focus:outline-none focus:ring-[3px] focus:ring-fortuno-gold-soft/30 transition-colors"
                />
              </div>
              {confirmPassword.length > 0 && password !== confirmPassword ? (
                <span className="text-[11px] text-red-300">As senhas não coincidem.</span>
              ) : null}
            </label>

            <button
              type="submit"
              disabled={!canSubmit}
              aria-busy={submitting}
              className="cta-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:shadow-gold-focus"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
              ) : null}
              {submitting ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-fortuno-offwhite/65">Já tem uma conta? </span>
            <Link
              to="/login"
              className="text-fortuno-gold-soft hover:text-fortuno-gold-intense transition-colors font-semibold"
            >
              Entrar
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-[11px] text-fortuno-offwhite/45">
          Ao criar uma conta você concorda com os termos de uso e política de privacidade da Fortuno.
        </p>
      </div>
    </main>
  );
};
