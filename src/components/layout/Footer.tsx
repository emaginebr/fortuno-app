import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Footer = (): JSX.Element => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const whatsapp = import.meta.env.VITE_WHATSAPP_URL;
  const instagram = import.meta.env.VITE_INSTAGRAM_URL;
  const email = import.meta.env.VITE_CONTACT_EMAIL;

  return (
    <footer className="bg-fortuno-green-deep text-fortuno-offwhite">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <img src="/logo-light.png" alt="Fortuno" className="h-12 w-auto" />
          <p className="mt-4 text-sm text-fortuno-offwhite/80">
            Sorteios transparentes, pagamento via PIX e a sua sorte em um clique.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-fortuno-gold-soft">
            Institucional
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/quem-somos" className="hover:text-fortuno-gold-soft">
                {t('menu.about')}
              </Link>
            </li>
            <li>
              <Link to="/fale-conosco" className="hover:text-fortuno-gold-soft">
                {t('menu.contact')}
              </Link>
            </li>
            <li>
              <Link to="/sorteios" className="hover:text-fortuno-gold-soft">
                {t('menu.lotteries')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-fortuno-gold-soft">
            Contato
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {whatsapp ? (
              <li>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            ) : null}
            {instagram ? (
              <li>
                <a href={instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
            ) : null}
            {email ? (
              <li>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
      <div className="border-t border-fortuno-offwhite/10 py-4 text-center text-xs text-fortuno-offwhite/60">
        © {year} Fortuno · CNPJ a definir · Todos os direitos reservados
      </div>
    </footer>
  );
};
