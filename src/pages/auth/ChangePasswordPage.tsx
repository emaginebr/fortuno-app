import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNAuth, useUser } from 'nauth-react';
import { Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useReferral } from '@/hooks/useReferral';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export const ChangePasswordPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { changePassword } = useNAuth();
  const { referralCode, panel } = useReferral();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const totalPoints = Math.max(0, Math.floor(panel?.totalToReceive ?? 0));

  const canSubmit =
    oldPassword.length > 0 &&
    newPassword.length >= 6 &&
    newPassword === confirmPassword &&
    !submitting;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!canSubmit) {
      if (newPassword !== confirmPassword) {
        toast.error('A confirmação não coincide com a nova senha.');
      }
      return;
    }
    setSubmitting(true);
    try {
      await changePassword({ oldPassword, newPassword });
      toast.success('Senha alterada com sucesso.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Não foi possível alterar a senha.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full pl-10 pr-20 py-3 rounded-xl border border-fortuno-black/15 bg-white text-fortuno-black placeholder:text-fortuno-black/40 focus:border-fortuno-gold-intense focus:outline-none focus:ring-[3px] focus:ring-fortuno-gold-soft/35 transition-colors';

  return (
    <div className="min-h-screen bg-dash-page text-fortuno-black flex flex-col">
      <DashboardHeader
        user={user}
        referralCode={referralCode}
        totalPoints={totalPoints}
      />

      <div className="relative z-10 mx-auto max-w-3xl w-full px-6 py-8 md:py-10 flex-1">
        <header className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.26em] text-fortuno-gold-intense font-semibold">
            Minha conta
          </p>
          <h1 className="font-display text-[clamp(22px,2.4vw,28px)] leading-tight text-fortuno-black">
            Alterar senha
          </h1>
          <p className="text-sm text-fortuno-black/60 mt-1">
            Crie uma senha forte com pelo menos 6 caracteres. Mantenha sua conta segura.
          </p>
        </header>

        <section className="paper-card p-6 md:p-8">
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5" noValidate>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-fortuno-black/65">
                Senha atual
              </span>
              <div className="relative">
                <Lock
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fortuno-gold-intense/80"
                  aria-hidden="true"
                />
                <input
                  type={showOld ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Digite sua senha atual"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowOld((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold uppercase tracking-[0.18em] text-fortuno-gold-intense hover:text-fortuno-gold-soft transition-colors"
                  aria-label={showOld ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showOld ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-fortuno-black/65">
                  Nova senha
                </span>
                <div className="relative">
                  <Lock
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fortuno-gold-intense/80"
                    aria-hidden="true"
                  />
                  <input
                    type={showNew ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold uppercase tracking-[0.18em] text-fortuno-gold-intense hover:text-fortuno-gold-soft transition-colors"
                    aria-label={showNew ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showNew ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-fortuno-black/65">
                  Confirmar nova senha
                </span>
                <div className="relative">
                  <Lock
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fortuno-gold-intense/80"
                    aria-hidden="true"
                  />
                  <input
                    type={showNew ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    aria-invalid={
                      confirmPassword.length > 0 && newPassword !== confirmPassword
                    }
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-fortuno-black/15 bg-white text-fortuno-black placeholder:text-fortuno-black/40 focus:border-fortuno-gold-intense focus:outline-none focus:ring-[3px] focus:ring-fortuno-gold-soft/35 transition-colors"
                  />
                </div>
                {confirmPassword.length > 0 && newPassword !== confirmPassword ? (
                  <span className="text-[11px] text-red-700">
                    As senhas não coincidem.
                  </span>
                ) : null}
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-fortuno-black/[0.08]">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
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
                  <Loader2
                    className="w-4 h-4 animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                ) : (
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                )}
                {submitting ? 'Alterando...' : 'Alterar senha'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};
