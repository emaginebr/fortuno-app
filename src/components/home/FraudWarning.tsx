export const FraudWarning = (): JSX.Element => {
  const instagram = import.meta.env.VITE_INSTAGRAM_URL;
  const website = 'fortuno.com.br';

  return (
    <section className="bg-fortuno-green-elegant text-fortuno-offwhite">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="font-display text-3xl text-fortuno-gold-soft">COMUNICADO</h2>
        <ul className="mt-6 space-y-3 text-sm leading-relaxed">
          <li>
            Nossas comunicações são feitas apenas por vídeo, nunca por chamada de voz.
          </li>
          <li>
            Não pedimos nenhum valor referente a impostos para entrega de prêmios.
          </li>
          <li>Também não enviamos links para confirmar a premiação.</li>
          <li>
            Se tiver dúvidas sobre um contato, consulte nosso site oficial.
          </li>
          <li>
            E reforçando: <strong>jamais</strong> solicitamos que você acesse ou compartilhe
            dados de aplicativos bancários.
          </li>
        </ul>

        <div className="mt-10 rounded-lg border border-fortuno-gold-intense/40 bg-fortuno-green-deep/50 p-6">
          <h3 className="font-display text-2xl text-fortuno-gold-intense">FIQUE LIGADO! 👀</h3>
          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <div>
              <dt className="text-fortuno-offwhite/60">Nome do recebedor</dt>
              <dd className="font-semibold">FORTUNO SORTEIOS E PREMIAÇÕES LTDA</dd>
            </div>
            <div>
              <dt className="text-fortuno-offwhite/60">CNPJ do recebedor</dt>
              <dd className="font-semibold">00.000.000/0001-00</dd>
            </div>
            <div>
              <dt className="text-fortuno-offwhite/60">Instituições</dt>
              <dd className="font-semibold">MERCADO PAGO · EFÍ · GERENCIANET</dd>
            </div>
            <div>
              <dt className="text-fortuno-offwhite/60">Canais oficiais</dt>
              <dd className="font-semibold">
                {instagram ? (
                  <a href={instagram} target="_blank" rel="noopener noreferrer">
                    📷 @fortuno
                  </a>
                ) : (
                  '📷 @fortuno'
                )}{' '}
                · 🌐 {website}
              </dd>
            </div>
          </dl>
        </div>

        <p className="mt-6 text-center font-display text-xl text-fortuno-gold-soft">
          Fortuno — sua sorte é séria.
        </p>
      </div>
    </section>
  );
};
