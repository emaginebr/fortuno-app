export const ContactPage = (): JSX.Element => {
  const whatsapp = import.meta.env.VITE_WHATSAPP_URL;
  const instagram = import.meta.env.VITE_INSTAGRAM_URL;
  const email = import.meta.env.VITE_CONTACT_EMAIL;

  const channels = [
    {
      icon: '💬',
      label: 'WhatsApp',
      description: 'Atendimento rápido de segunda a sexta, das 9h às 18h.',
      href: whatsapp,
      cta: 'Abrir WhatsApp',
    },
    {
      icon: '📷',
      label: 'Instagram',
      description: 'Acompanhe novidades e sorteios no nosso perfil oficial.',
      href: instagram,
      cta: 'Abrir Instagram',
    },
    {
      icon: '✉️',
      label: 'E-mail',
      description: 'Para demandas formais, envie uma mensagem para o nosso e-mail oficial.',
      href: email ? `mailto:${email}` : undefined,
      cta: email ?? 'Enviar e-mail',
    },
  ].filter((c) => Boolean(c.href));

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <header className="text-center">
        <h1 className="font-display text-4xl text-fortuno-black">Fale Conosco</h1>
        <p className="mt-3 text-fortuno-black/70">
          Escolha o canal que preferir. Respondemos em até 1 dia útil.
        </p>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {channels.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-fortuno-black/10 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-5xl" aria-hidden="true">
              {c.icon}
            </div>
            <h2 className="mt-3 font-display text-xl text-fortuno-gold-intense">{c.label}</h2>
            <p className="mt-2 text-sm text-fortuno-black/70">{c.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 font-semibold text-fortuno-black">
              {c.cta} →
            </span>
          </a>
        ))}
      </div>

      <div className="mt-12 rounded-xl bg-fortuno-offwhite p-6 text-sm text-fortuno-black/70">
        <p>
          <strong>Horário de atendimento:</strong> segunda a sexta, das 9h às 18h (horário de
          Brasília). Aos finais de semana, responderemos no próximo dia útil.
        </p>
        <p className="mt-2">
          <strong>Endereço:</strong> a definir.
        </p>
      </div>
    </main>
  );
};
