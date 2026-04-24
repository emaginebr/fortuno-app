import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNAuth } from 'nauth-react';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const ForgotPasswordPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { sendRecoveryEmail } = useNAuth();

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const canSubmit = email.trim().length > 3 && !submitting;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await sendRecoveryEmail(email.trim());
      setSent(true);
      toast.success('E-mail de recuperação enviado.');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Não foi possível enviar o e-mail.',
      );
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
          <span>Recuperar acesso</span>
          <span className="h-px w-8 bg-fortuno-gold-soft" aria-hidden="true" />
        </div>

        <div className="rounded-3xl bg-noir-glass backdrop-blur-xl border border-[color:var(--noir-glass-border)] shadow-noir-card p-7 md:p-9">
          <div className="mb-6 text-center">
            <img src="/logo-light.png" alt="Fortuno" className="mx-auto h-12" />
            <h1 className="mt-4 font-display text-2xl text-fortuno-offwhite">
              Esqueci minha senha
            </h1>
            <p className="mt-1 text-sm text-fortuno-offwhite/65">
              Informe seu e-mail. Enviaremos um link para você redefinir a senha.
            </p>
          </div>

          {sent ? (
            <div
              role="status"
              className="rounded-xl border border-emerald-400/35 bg-emerald-400/10 px-5 py-5 text-sm text-emerald-100 flex flex-col items-center text-center gap-2"
            >
              <CheckCircle2 className="w-6 h-6 text-emerald-300" aria-hidden="true" />
              <p className="font-semibold">E-mail enviado com sucesso.</p>
              <p className="text-[13px] text-emerald-100/80">
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                Se não receber em alguns minutos, confira a pasta de spam.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="cta-primary mt-3 justify-center focus-visible:outline-none focus-visible:shadow-gold-focus"
              >
                Voltar para o login
              </button>
            </div>
          ) : (
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

              <button
                type="submit"
                disabled={!canSubmit}
                aria-busy={submitting}
                className="cta-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:shadow-gold-focus"
              >
                {submitting ? (
                  <Loader2
                    className="w-4 h-4 animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                ) : null}
                {submitting ? 'Enviando...' : 'Enviar link de recuperação'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-fortuno-gold-soft hover:text-fortuno-gold-intense transition-colors font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Voltar para o login
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-[11px] text-fortuno-offwhite/45">
          Precisa de ajuda? Fale com nosso suporte através da página Fale Conosco.
        </p>
      </div>
    </main>
  );
};
