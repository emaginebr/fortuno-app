import { ShieldAlert, Eye, Instagram, Globe } from 'lucide-react';

interface Bullet {
  roman: string;
  content: JSX.Element;
  textual: string;
}

const BULLETS: Bullet[] = [
  {
    roman: 'I',
    textual:
      'Nossas comunicações são feitas apenas por vídeo, nunca por chamada de voz.',
    content: (
      <>
        Nossas comunicações são feitas{' '}
        <strong className="text-fortuno-gold-soft">apenas por vídeo</strong>, nunca por chamada
        de voz.
      </>
    ),
  },
  {
    roman: 'II',
    textual:
      'Não pedimos nenhum valor referente a impostos para entrega de prêmios.',
    content: (
      <>
        <strong className="text-fortuno-gold-soft">Não pedimos</strong> nenhum valor referente a
        impostos para entrega de prêmios.
      </>
    ),
  },
  {
    roman: 'III',
    textual: 'Não enviamos links para confirmar premiação.',
    content: (
      <>
        <strong className="text-fortuno-gold-soft">Não enviamos links</strong> para confirmar
        premiação.
      </>
    ),
  },
  {
    roman: 'IV',
    textual: 'Em caso de dúvidas, consulte sempre nosso site oficial.',
    content: (
      <>
        Em caso de dúvidas, consulte sempre nosso{' '}
        <strong className="text-fortuno-gold-soft">site oficial</strong>.
      </>
    ),
  },
  {
    roman: 'V',
    textual:
      'Jamais solicitamos que você acesse ou compartilhe dados de aplicativos bancários.',
    content: (
      <>
        <strong className="text-fortuno-gold-soft">Jamais</strong> solicitamos que você acesse
        ou compartilhe dados de aplicativos bancários.
      </>
    ),
  },
];

export const FraudCertificate = (): JSX.Element => {
  const instagram = import.meta.env.VITE_INSTAGRAM_URL;

  return (
    <section
      id="comunicado"
      className="relative py-12 md:py-16"
      aria-labelledby="comunicado-title"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="certificate px-8 md:px-14 py-14 md:py-20 relative">
          <div className="deco-corner tl" aria-hidden="true" />
          <div className="deco-corner tr" aria-hidden="true" />
          <div className="deco-corner bl" aria-hidden="true" />
          <div className="deco-corner br" aria-hidden="true" />

          <span className="watermark" aria-hidden="true">
            Fortuno
          </span>

          <div className="relative z-10 text-center">
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-fortuno-gold-soft">
              <ShieldAlert className="w-4 h-4" aria-hidden="true" />
              Comunicado oficial
            </span>
            <div className="deco-divider" aria-hidden="true">
              <span className="deco-diamond" />
            </div>
            <h2
              id="comunicado-title"
              className="font-display text-fortuno-offwhite italic"
              style={{ fontSize: 'clamp(32px, 4.4vw, 52px)', letterSpacing: '-0.02em' }}
            >
              Sua sorte é séria.
            </h2>
            <p className="mt-4 text-fortuno-offwhite/70 max-w-2xl mx-auto">
              Alertamos sobre tentativas de fraude em nosso nome. Leia atentamente antes de
              qualquer contato.
            </p>
          </div>

          <ol className="relative z-10 mt-12 grid md:grid-cols-2 gap-4 md:gap-5">
            {BULLETS.map((bullet, index) => (
              <li
                key={bullet.roman}
                className={`seal-bullet ${
                  index === BULLETS.length - 1 ? 'md:col-span-2' : ''
                }`}
                aria-label={`Item ${index + 1} de ${BULLETS.length}: ${bullet.textual}`}
              >
                <span className="num" aria-hidden="true">
                  {bullet.roman}
                </span>
                <p className="text-sm text-fortuno-offwhite/90 leading-relaxed">
                  {bullet.content}
                </p>
              </li>
            ))}
          </ol>

          <div className="deco-divider relative z-10" aria-hidden="true">
            <span className="deco-diamond" />
          </div>

          <div className="relative z-10 mt-2">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-fortuno-gold-soft">
                <Eye className="w-4 h-4" aria-hidden="true" />
                Fique ligado
              </span>
              <h3 className="mt-3 font-display text-2xl md:text-3xl text-fortuno-offwhite">
                Confirme sempre os dados oficiais
              </h3>
            </div>

            <dl className="grid gap-4 md:grid-cols-2 text-sm">
              <div className="seal-bullet flex-col !items-start gap-2">
                <dt className="text-[10px] uppercase tracking-[0.24em] text-fortuno-offwhite/55">
                  Nome do recebedor
                </dt>
                <dd className="font-semibold text-fortuno-offwhite">
                  FORTUNO SORTEIOS E PREMIAÇÕES LTDA
                </dd>
              </div>
              <div className="seal-bullet flex-col !items-start gap-2">
                <dt className="text-[10px] uppercase tracking-[0.24em] text-fortuno-offwhite/55">
                  CNPJ do recebedor
                </dt>
                <dd className="font-semibold text-fortuno-offwhite">00.000.000/0001-00</dd>
              </div>
              <div className="seal-bullet flex-col !items-start gap-2">
                <dt className="text-[10px] uppercase tracking-[0.24em] text-fortuno-offwhite/55">
                  Instituições autorizadas
                </dt>
                <dd className="font-semibold text-fortuno-offwhite">
                  MERCADO PAGO · EFÍ · GERENCIANET
                </dd>
              </div>
              <div className="seal-bullet flex-col !items-start gap-2">
                <dt className="text-[10px] uppercase tracking-[0.24em] text-fortuno-offwhite/55">
                  Canais oficiais
                </dt>
                <dd className="font-semibold text-fortuno-offwhite">
                  {instagram ? (
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-fortuno-gold-soft transition-colors focus-visible:outline-none focus-visible:shadow-gold-focus rounded"
                    >
                      <Instagram className="w-4 h-4" aria-hidden="true" />
                      @fortuno
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <Instagram className="w-4 h-4" aria-hidden="true" />
                      @fortuno
                    </span>
                  )}
                  <span className="text-fortuno-offwhite/40"> · </span>
                  <span className="inline-flex items-center gap-1">
                    <Globe className="w-4 h-4" aria-hidden="true" />
                    fortuno.com.br
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="relative z-10 mt-12 text-center">
            <div className="deco-divider" aria-hidden="true">
              <span className="deco-diamond" />
            </div>
            <p
              className="font-display italic text-fortuno-gold-soft"
              style={{ fontSize: 'clamp(20px, 2.2vw, 28px)' }}
            >
              Fortuno — sua sorte é séria.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
