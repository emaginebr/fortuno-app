import { useId, useState, type FormEvent, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

type ContactSubject = 'duvida' | 'suporte' | 'parceria' | 'sugestao' | 'outro';

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  subject: ContactSubject | '';
  message: string;
  consent: boolean;
}

interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  consent?: string;
}

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

const INITIAL_VALUES: ContactFormValues = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  consent: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s()+\-.]{8,}$/;

interface ContactFormPayload {
  name: string;
  email: string;
  phone: string | null;
  subject: ContactSubject;
  message: string;
  consent: true;
}

/**
 * MOCK: aguarda endpoint POST /contact/messages
 * Registrado em MOCKS.md → "Contato — Envio de mensagem".
 */
const submitContact = async (_payload: ContactFormPayload): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 900));
  if (Math.random() < 0.1) throw new Error('mock-error');
};

export const ContactForm = (): JSX.Element => {
  const { t } = useTranslation('fortuno');
  const formId = useId();

  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [state, setState] = useState<SubmissionState>('idle');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Limpa erro do campo ao editar
    if (errors[name as keyof ContactFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (v: ContactFormValues): ContactFormErrors => {
    const e: ContactFormErrors = {};
    if (v.name.trim().length < 2) e.name = t('contact.form.name.error');
    if (!EMAIL_RE.test(v.email.trim())) e.email = t('contact.form.email.error');
    if (v.phone.trim().length > 0 && !PHONE_RE.test(v.phone.trim()))
      e.phone = t('contact.form.phone.error');
    if (!v.subject) e.subject = t('contact.form.subject.error');
    if (v.message.trim().length < 10) e.message = t('contact.form.message.error');
    if (!v.consent) e.consent = t('contact.form.lgpd.error');
    return e;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const validation = validate(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setState('submitting');
    try {
      await submitContact({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() ? values.phone.trim() : null,
        subject: values.subject as ContactSubject,
        message: values.message.trim(),
        consent: true,
      });
      setState('success');
      toast.success(t('contact.form.successToast'));
      setValues(INITIAL_VALUES);
    } catch {
      setState('error');
      toast.error(t('contact.form.errorToast'));
    }
  };

  const isSubmitting = state === 'submitting';

  // ID helpers
  const id = (field: string): string => `${formId}-${field}`;

  return (
    <section
      id="mensagem"
      className="relative z-10 py-16 md:py-20 scroll-mt-24"
      aria-labelledby="contact-form-title"
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-10 md:mb-12">
          <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-fortuno-gold-intense font-semibold">
            <span
              className="inline-block w-8 h-px bg-fortuno-gold-intense/70"
              aria-hidden="true"
            />
            {t('contact.form.eyebrow')}
            <span
              className="inline-block w-8 h-px bg-fortuno-gold-intense/70"
              aria-hidden="true"
            />
          </span>
          <h2
            id="contact-form-title"
            className="font-display mt-4 text-fortuno-black leading-[1.05]"
            style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', letterSpacing: '-0.02em' }}
          >
            {t('contact.form.titleLine1')}{' '}
            <em className="italic text-fortuno-gold-intense">
              {t('contact.form.titleLine2')}
            </em>
          </h2>
          <p className="mt-4 text-fortuno-black/65 text-[15px] md:text-[16px] max-w-lg mx-auto">
            {t('contact.form.subhead')}
          </p>
        </div>

        <div className="contact-form-card p-8 md:p-12">
          {state === 'success' ? (
            <div className="contact-form-success">
              <CheckCircle2
                className="w-10 h-10 mx-auto text-[color:var(--color-success)]"
                aria-hidden="true"
              />
              <h3
                className="mt-4 font-display italic text-fortuno-black"
                style={{ fontSize: 'clamp(22px, 2.6vw, 28px)' }}
              >
                {t('contact.form.successCardTitle')}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-fortuno-black/72 max-w-lg mx-auto">
                {t('contact.form.successCardBody')}
              </p>
              <button
                type="button"
                onClick={() => setState('idle')}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-[13.5px] tracking-wide text-fortuno-gold-intense border border-fortuno-gold-intense/45 hover:bg-fortuno-gold-intense/10 transition-colors focus-visible:outline-none focus-visible:shadow-gold-focus"
              >
                {t('contact.form.successCardCta')}
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-labelledby="contact-form-title"
              className="relative z-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {/* Nome */}
                <div>
                  <label htmlFor={id('name')} className="contact-form-label">
                    {t('contact.form.name.label')}{' '}
                    <span className="req" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    id={id('name')}
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    maxLength={120}
                    placeholder={t('contact.form.name.placeholder')}
                    className="contact-form-input"
                    aria-required="true"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? id('name-error') : undefined}
                  />
                  {errors.name && (
                    <p id={id('name-error')} role="alert" className="contact-form-error">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* E-mail */}
                <div>
                  <label htmlFor={id('email')} className="contact-form-label">
                    {t('contact.form.email.label')}{' '}
                    <span className="req" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    type="email"
                    id={id('email')}
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    maxLength={160}
                    placeholder={t('contact.form.email.placeholder')}
                    className="contact-form-input"
                    aria-required="true"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? id('email-error') : id('email-help')
                    }
                  />
                  {errors.email ? (
                    <p
                      id={id('email-error')}
                      role="alert"
                      className="contact-form-error"
                    >
                      {errors.email}
                    </p>
                  ) : (
                    <p id={id('email-help')} className="contact-form-help">
                      {t('contact.form.email.help')}
                    </p>
                  )}
                </div>

                {/* Telefone */}
                <div>
                  <label htmlFor={id('phone')} className="contact-form-label">
                    {t('contact.form.phone.label')}
                  </label>
                  <input
                    type="tel"
                    id={id('phone')}
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={32}
                    placeholder={t('contact.form.phone.placeholder')}
                    className="contact-form-input"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? id('phone-error') : undefined}
                  />
                  {errors.phone && (
                    <p
                      id={id('phone-error')}
                      role="alert"
                      className="contact-form-error"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Assunto */}
                <div>
                  <label htmlFor={id('subject')} className="contact-form-label">
                    {t('contact.form.subject.label')}{' '}
                    <span className="req" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <select
                    id={id('subject')}
                    name="subject"
                    value={values.subject}
                    onChange={handleChange}
                    required
                    className="contact-form-select"
                    aria-required="true"
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={errors.subject ? id('subject-error') : undefined}
                  >
                    <option value="" disabled>
                      {t('contact.form.subject.placeholder')}
                    </option>
                    <option value="duvida">{t('contact.form.subject.options.duvida')}</option>
                    <option value="suporte">
                      {t('contact.form.subject.options.suporte')}
                    </option>
                    <option value="parceria">
                      {t('contact.form.subject.options.parceria')}
                    </option>
                    <option value="sugestao">
                      {t('contact.form.subject.options.sugestao')}
                    </option>
                    <option value="outro">{t('contact.form.subject.options.outro')}</option>
                  </select>
                  {errors.subject && (
                    <p
                      id={id('subject-error')}
                      role="alert"
                      className="contact-form-error"
                    >
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Mensagem */}
                <div className="md:col-span-2">
                  <label htmlFor={id('message')} className="contact-form-label">
                    {t('contact.form.message.label')}{' '}
                    <span className="req" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <textarea
                    id={id('message')}
                    name="message"
                    value={values.message}
                    onChange={handleChange}
                    rows={5}
                    required
                    maxLength={2000}
                    placeholder={t('contact.form.message.placeholder')}
                    className="contact-form-textarea"
                    aria-required="true"
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message ? id('message-error') : id('message-help')
                    }
                  />
                  {errors.message ? (
                    <p
                      id={id('message-error')}
                      role="alert"
                      className="contact-form-error"
                    >
                      {errors.message}
                    </p>
                  ) : (
                    <p id={id('message-help')} className="contact-form-help">
                      {t('contact.form.message.help')}
                    </p>
                  )}
                </div>

                {/* LGPD */}
                <div className="md:col-span-2">
                  <label htmlFor={id('consent')} className="contact-checkbox-row">
                    <input
                      type="checkbox"
                      id={id('consent')}
                      name="consent"
                      checked={values.consent}
                      onChange={handleChange}
                      required
                      className="contact-checkbox"
                      aria-required="true"
                      aria-invalid={Boolean(errors.consent)}
                      aria-describedby={
                        errors.consent ? id('consent-error') : undefined
                      }
                    />
                    <span className="text-[13.5px] leading-[1.55] text-fortuno-black/75">
                      {t('contact.form.lgpd.labelPrefix')}{' '}
                      <Link
                        to="/politica-de-privacidade"
                        className="text-fortuno-gold-intense underline underline-offset-2 font-semibold hover:text-[#8a6a25]"
                      >
                        {t('contact.form.lgpd.labelLink')}
                      </Link>{' '}
                      {t('contact.form.lgpd.labelSuffix')}
                    </span>
                  </label>
                  {errors.consent && (
                    <p
                      id={id('consent-error')}
                      role="alert"
                      className="contact-form-error"
                    >
                      {errors.consent}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
                  <p className="text-[12px] uppercase tracking-[0.22em] text-fortuno-black/50">
                    {t('contact.form.disclaimer')}
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cta-primary focus-visible:outline-none focus-visible:shadow-gold-focus"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2
                          className="w-[18px] h-[18px] animate-spin"
                          aria-hidden="true"
                        />
                        {t('contact.form.submitLoading')}
                      </>
                    ) : (
                      <>
                        <Send className="w-[18px] h-[18px]" aria-hidden="true" />
                        {t('contact.form.submit')}
                        <ArrowRight className="w-[18px] h-[18px]" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
