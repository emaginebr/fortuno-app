import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from 'nauth-react';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface LocationState {
  from?: string;
}

export const LoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const from = state?.from ?? '/dashboard';
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !submitting;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível entrar.');
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
          <span>Acessar sua conta</span>
          <span className="h-px w-8 bg-fortuno-gold-soft" aria-hidden="true" />
        </div>

        <div className="rounded-3xl bg-noir-glass backdrop-blur-xl border border-[color:var(--noir-glass-border)] shadow-noir-card p-7 md:p-9">
          <div className="mb-6 text-center">
            <img src="/logo-light.png" alt="Fortuno" className="mx-auto h-12" />
            <h1 className="mt-4 font-display text-2xl text-fortuno-offwhite">
              Bem-vindo de volta
            </h1>
            <p className="mt-1 text-sm text-fortuno-offwhite/65">
              Entre para acompanhar seus bilhetes.
            </p>
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4" noValidate>
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
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

            <button
              type="submit"
              disabled={!canSubmit}
              aria-busy={submitting}
              className="cta-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:shadow-gold-focus"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
              ) : null}
              {submitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm">
            <Link
              to="/esqueci-senha"
              className="text-fortuno-gold-soft hover:text-fortuno-gold-intense transition-colors"
            >
              Esqueci minha senha
            </Link>
            <Link
              to="/cadastro"
              className="text-fortuno-gold-soft hover:text-fortuno-gold-intense transition-colors"
            >
              Criar conta
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-[11px] text-fortuno-offwhite/45">
          Ao entrar você concorda com os termos de uso e política de privacidade da Fortuno.
        </p>
      </div>
    </main>
  );
};
