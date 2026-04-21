import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from 'nauth-react';
import { useTranslation } from 'react-i18next';

const NavItem = ({ to, label }: { to: string; label: string }): JSX.Element => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `rounded-md px-3 py-2 text-sm font-medium transition ${
        isActive
          ? 'bg-fortuno-gold-intense text-fortuno-black'
          : 'text-fortuno-offwhite hover:text-fortuno-gold-soft'
      }`
    }
  >
    {label}
  </NavLink>
);

export const Header = (): JSX.Element => {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async (): Promise<void> => {
    try {
      await logout?.();
    } finally {
      setMenuOpen(false);
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-fortuno-green-deep shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="flex items-center gap-3">
          <img src="/logo-light.png" alt="Fortuno" className="h-10 w-auto" />
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Menu principal">
          <NavItem to="/" label={t('menu.home')} />
          <NavItem to="/sorteios" label={t('menu.lotteries')} />
          <NavItem to="/meus-numeros" label={t('menu.myNumbers')} />
          <NavItem to="/quem-somos" label={t('menu.about')} />
          <NavItem to="/fale-conosco" label={t('menu.contact')} />
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-md bg-fortuno-green-elegant px-3 py-2 text-sm font-medium text-fortuno-offwhite hover:bg-fortuno-green-elegant/70"
                aria-haspopup="true"
                aria-expanded={menuOpen}
              >
                <span className="hidden md:inline">{user?.name ?? 'Minha conta'}</span>
                <span aria-hidden="true">▾</span>
              </button>
              {menuOpen ? (
                <div
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-md bg-white shadow-lg"
                  role="menu"
                >
                  {[
                    { to: '/dashboard', label: t('menu.dashboard') },
                    { to: '/meus-numeros', label: t('menu.myNumbers') },
                    { to: '/meus-pontos', label: t('menu.myPoints') },
                    { to: '/meus-sorteios', label: t('menu.myLotteries') },
                    { to: '/conta/dados', label: t('menu.editProfile') },
                    { to: '/conta/alterar-senha', label: t('menu.changePassword') },
                  ].map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-fortuno-black hover:bg-fortuno-offwhite"
                      role="menuitem"
                    >
                      {item.label}
                    </NavLink>
                  ))}
                  <button
                    type="button"
                    onClick={() => void handleLogout()}
                    className="w-full border-t border-fortuno-black/10 px-4 py-2 text-left text-sm text-red-700 hover:bg-fortuno-offwhite"
                    role="menuitem"
                  >
                    {t('menu.logout')}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <NavLink
              to="/login"
              className="rounded-md bg-fortuno-gold-intense px-4 py-2 text-sm font-semibold text-fortuno-black hover:bg-fortuno-gold-soft"
            >
              {t('menu.login')}
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};
