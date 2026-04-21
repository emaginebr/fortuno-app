import { Link } from 'react-router-dom';

export const EasyToPlayBlock = (): JSX.Element => (
  <section className="bg-fortuno-green-deep py-16 text-fortuno-offwhite">
    <div className="mx-auto max-w-4xl px-4 text-center">
      <h2 className="font-display text-4xl text-fortuno-gold-soft">É FÁCIL PARTICIPAR!</h2>
      <p className="mt-4 text-lg text-fortuno-offwhite/80">
        E o melhor de tudo é poder concorrer a esse super prêmio com apenas algumas moedas!
      </p>

      <ul className="mx-auto mt-8 max-w-2xl space-y-3 text-left text-fortuno-offwhite/90">
        <li className="flex gap-3">
          <span className="text-fortuno-gold-intense" aria-hidden="true">
            ▸
          </span>
          Você pode escolher quantos bilhetes quiser! Quanto mais selecionar, mais chances você tem
          de ganhar!
        </li>
        <li className="flex gap-3">
          <span className="text-fortuno-gold-intense" aria-hidden="true">
            ▸
          </span>
          Fácil e seguro! E você pode pagar via PIX.
        </li>
        <li className="flex gap-3">
          <span className="text-fortuno-gold-intense" aria-hidden="true">
            ▸
          </span>
          Agora você já está participando! Consulte o seu bilhete em <strong>Meus Números</strong>.
        </li>
      </ul>

      <Link to="/sorteios" className="btn-primary mt-10 text-lg">
        Compre já
      </Link>
    </div>
  </section>
);
