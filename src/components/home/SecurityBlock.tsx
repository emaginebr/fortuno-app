const pillars = [
  {
    icon: '🔒',
    title: 'Segurança de dados',
    text: 'Criptografia em toda a plataforma e proteção total dos seus dados pessoais.',
  },
  {
    icon: '💸',
    title: 'Pagamento via PIX',
    text: 'Confirmação instantânea e rastreabilidade total — você paga direto do seu app bancário.',
  },
  {
    icon: '✅',
    title: 'Sorteio auditado',
    text: 'Cada sorteio é registrado e auditável, com resultado transparente para todos.',
  },
];

export const SecurityBlock = (): JSX.Element => (
  <section className="bg-fortuno-offwhite py-16">
    <div className="mx-auto max-w-6xl px-4">
      <h2 className="text-center font-display text-3xl text-fortuno-black">
        Segurança em primeiro lugar
      </h2>
      <p className="mt-2 text-center text-fortuno-black/70">
        Três pilares que garantem uma experiência confiável do início ao fim.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="rounded-xl border border-fortuno-black/10 bg-white p-6 text-center shadow-sm"
          >
            <div className="text-4xl">{p.icon}</div>
            <h3 className="mt-3 font-display text-xl text-fortuno-gold-intense">{p.title}</h3>
            <p className="mt-2 text-sm text-fortuno-black/70">{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
