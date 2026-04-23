import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from 'nauth-react';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import { UserMenu } from './UserMenu';

interface NavItemDef {
  to: string;
  labelKey: string;
}

const NAV_ITEMS: NavItemDef[] = [
  { to: '/', labelKey: 'menu.home' },
  { to: '/sorteios', labelKey: 'menu.lotteries' },
  { to: '/meus-numeros', labelKey: 'menu.myNumbers' },
  { to: '/quem-somos', labelKey: 'menu.about' },
  { to: '/fale-conosco', labelKey: 'menu.contact' },
];

const SiteWordmark = (): JSX.Element => (
  <NavLink to="/" className="site-logo-link" aria-label="Fortuno">
    <span className="site-logo" aria-hidden="true" />
  </NavLink>
);

export const Header = (): JSX.Element => {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const mobileBtnRef = useRef<HTMLButtonElement>(null);
  const mobileSheetRef = useRef<HTMLDivElement>(null);

  const handleLogout = async (): Promise<void> => {
    try {
      await logout?.();
    } finally {
      navigate('/');
    }
  };

  // Escape fecha o drawer mobile
  useEffect(() => {
    if (!mobileNavOpen) return;
    const handler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMobileNavOpen(false);
        mobileBtnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mobileNavOpen]);

  // Foco inicial no primeiro link ao abrir sheet
  useEffect(() => {
    if (!mobileNavOpen) return;
    const first = mobileSheetRef.current?.querySelector<HTMLElement>('a, button');
    first?.focus();
  }, [mobileNavOpen]);

  const closeMobile = (): void => setMobileNavOpen(false);

  return (
    <header
      className={[
        'bg-topbar text-fortuno-offwhite sticky top-0 z-40 isolate',
        "after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:h-px",
        'after:bg-topbar-border-bottom after:opacity-85',
      ].join(' ')}
    >
      <div
        className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-6"
        style={{ height: '64px' }}
      >
        <SiteWordmark />

        {/* Nav pública desktop */}
        <nav className="hidden md:flex items-center gap-1" aria-label={t('menu.mainNavAria')}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                ['site-nav-link', isActive ? 'is-active' : ''].filter(Boolean).join(' ')
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Hambúrguer mobile */}
          <button
            type="button"
            ref={mobileBtnRef}
            onClick={() => setMobileNavOpen((v) => !v)}
            className={[
              'md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full',
              'border border-[color:var(--user-trigger-border)]',
              'bg-[color:var(--user-trigger-bg)]',
              'text-fortuno-gold-soft transition-colors',
              'hover:border-[color:var(--user-trigger-border-hover)]',
              'hover:bg-[color:var(--user-trigger-bg-hover)]',
              'focus-visible:outline-none focus-visible:shadow-gold-focus',
            ].join(' ')}
            aria-label={t('menu.openNav')}
            aria-expanded={mobileNavOpen}
            aria-controls="mobileNavSheet"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {isAuthenticated ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <NavLink
              to="/login"
              className={[
                'rounded-full bg-fortuno-gold-intense px-4 py-2 text-sm font-bold',
                'text-fortuno-black hover:bg-fortuno-gold-soft transition-colors',
                'focus-visible:outline-none focus-visible:shadow-gold-focus',
              ].join(' ')}
            >
              {t('menu.login')}
            </NavLink>
          )}
        </div>
      </div>

      {/* Mobile nav sheet */}
      {mobileNavOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-fortuno-black/55 z-40 animate-in fade-in"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <div
            id="mobileNavSheet"
            ref={mobileSheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('menu.mainNavAria')}
            className={[
              'md:hidden fixed top-0 right-0 bottom-0 z-50',
              'w-[80vw] max-w-[320px] bg-topbar text-fortuno-offwhite',
              'border-l border-fortuno-gold-soft/35 shadow-2xl',
              'flex flex-col animate-user-menu-open origin-top-right',
            ].join(' ')}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-fortuno-offwhite/10">
              <span className="font-display text-lg text-fortuno-gold-soft italic">
                {t('menu.navigateTitle')}
              </span>
              <button
                type="button"
                onClick={closeMobile}
                className={[
                  'inline-flex items-center justify-center w-9 h-9 rounded-full',
                  'text-fortuno-offwhite/80 hover:text-fortuno-gold-soft',
                  'focus-visible:outline-none focus-visible:shadow-gold-focus',
                ].join(' ')}
                aria-label={t('menu.closeNav')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col p-3 gap-1" aria-label={t('menu.mainNavAria')}>
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    [
                      'site-nav-link !block !w-full',
                      isActive ? 'is-active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')
                  }
                >
                  {t(item.labelKey)}
                </NavLink>
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  );
};
