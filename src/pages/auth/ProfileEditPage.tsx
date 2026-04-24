import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNAuth, useUser, formatDocument, formatPhone } from 'nauth-react';
import { User, Mail, IdCard, Phone, Key, Calendar, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useReferral } from '@/hooks/useReferral';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export const ProfileEditPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { updateUser } = useNAuth();
  const { referralCode, panel, loadPanel } = useReferral();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [idDocument, setIdDocument] = useState('');
  const [phone, setPhone] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void loadPanel();
  }, [loadPanel]);

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? '');
    setEmail(user.email ?? '');
    setBirthDate(user.birthDate ? user.birthDate.slice(0, 10) : '');
    setIdDocument(user.idDocument ? formatDocument(user.idDocument) : '');
    setPhone(user.phones?.[0]?.phone ? formatPhone(user.phones[0].phone) : '');
    setPixKey(user.pixKey ?? '');
  }, [user]);

  const totalPoints = Math.max(0, Math.floor(panel?.totalToReceive ?? 0));

  const canSubmit = name.trim().length > 1 && email.trim().length > 3 && !submitting;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!canSubmit || !user) return;
    setSubmitting(true);
    try {
      await updateUser({
        ...user,
        name: name.trim(),
        email: email.trim(),
        birthDate: birthDate || user.birthDate,
        idDocument: idDocument.trim(),
        pixKey: pixKey.trim(),
        phones: phone.trim() ? [{ phone: phone.trim() }] : [],
      });
      toast.success('Dados atualizados com sucesso.');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Não foi possível atualizar os dados.',
      );
    } finally {
      setSubmitting(false);
    }
  };

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
            Meus dados
          </h1>
          <p className="text-sm text-fortuno-black/60 mt-1">
            Atualize suas informações de cadastro. O e-mail é usado para login e
            comunicações importantes.
          </p>
        </header>

        <section className="paper-card p-6 md:p-8">
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-fortuno-black/65">
                  Nome completo
                </span>
                <div className="relative">
                  <User
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fortuno-gold-intense/80"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-fortuno-black/15 bg-white text-fortuno-black placeholder:text-fortuno-black/40 focus:border-fortuno-gold-intense focus:outline-none focus:ring-[3px] focus:ring-fortuno-gold-soft/35 transition-colors"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-fortuno-black/65">
                  E-mail
                </span>
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
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-fortuno-black/15 bg-white text-fortuno-black placeholder:text-fortuno-black/40 focus:border-fortuno-gold-intense focus:outline-none focus:ring-[3px] focus:ring-fortuno-gold-soft/35 transition-colors"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-fortuno-black/65">
                  CPF
                </span>
                <div className="relative">
                  <IdCard
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fortuno-gold-intense/80"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={idDocument}
                    onChange={(e) => setIdDocument(formatDocument(e.target.value))}
                    placeholder="000.000.000-00"
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-fortuno-black/15 bg-white text-fortuno-black placeholder:text-fortuno-black/40 focus:border-fortuno-gold-intense focus:outline-none focus:ring-[3px] focus:ring-fortuno-gold-soft/35 transition-colors"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-fortuno-black/65">
                  Data de nascimento
                </span>
                <div className="relative">
                  <Calendar
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fortuno-gold-intense/80"
                    aria-hidden="true"
                  />
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-fortuno-black/15 bg-white text-fortuno-black placeholder:text-fortuno-black/40 focus:border-fortuno-gold-intense focus:outline-none focus:ring-[3px] focus:ring-fortuno-gold-soft/35 transition-colors"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-fortuno-black/65">
                  Telefone
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
                    placeholder="(11) 90000-0000"
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-fortuno-black/15 bg-white text-fortuno-black placeholder:text-fortuno-black/40 focus:border-fortuno-gold-intense focus:outline-none focus:ring-[3px] focus:ring-fortuno-gold-soft/35 transition-colors"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-fortuno-black/65">
                  Chave PIX
                </span>
                <div className="relative">
                  <Key
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fortuno-gold-intense/80"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    placeholder="CPF, e-mail, telefone ou aleatória"
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-fortuno-black/15 bg-white text-fortuno-black placeholder:text-fortuno-black/40 focus:border-fortuno-gold-intense focus:outline-none focus:ring-[3px] focus:ring-fortuno-gold-soft/35 transition-colors"
                  />
                </div>
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
                  <Save className="w-4 h-4" aria-hidden="true" />
                )}
                {submitting ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};
