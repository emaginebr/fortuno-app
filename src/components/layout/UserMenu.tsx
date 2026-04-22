import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { UserInfo } from 'nauth-react';
import {
  ChevronDown,
  ChevronRight,
  KeyRound,
  LayoutDashboard,
  LogOut,
  UserCog,
} from 'lucide-react';
import { getInitials } from '@/utils/getInitials';

export interface UserMenuProps {
  user: UserInfo | null | undefined;
  onLogout: () => void | Promise<void>;
}

/**
 * Dropdown da conta no canto direito da topbar global.
 * - Trigger: pílula com avatar 34px + primeiro nome + chevron que rotaciona.
 * - Menu: paper off-white + mini-card identitário 56px (ring conic) + 3 ações.
 * - A11y: role=menu/menuitem, arrow keys, Escape fecha, focus volta ao trigger.
 */
export const UserMenu = ({ user, onLogout }: UserMenuProps): JSX.Element => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = getInitials(user?.name);
  const firstName = user?.name ? user.name.split(' ')[0] : t('menu.accountFallback');

  const closeMenu = (): void => setOpen(false);

  // Fechar ao clicar fora
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent): void => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Escape fecha + foco volta ao trigger
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  // Ao abrir, foco vai ao primeiro item
  useEffect(() => {
    if (!open) return;
    const first = menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
    first?.focus();
  }, [open]);

  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );
    if (items.length === 0) return;
    const current = document.activeElement as HTMLElement | null;
    const idx = current ? items.indexOf(current) : -1;
    if (idx === -1) {
      items[0].focus();
      e.preventDefault();
      return;
    }
    e.preventDefault();
    const next =
      e.key === 'ArrowDown'
        ? items[(idx + 1) % items.length]
        : items[(idx - 1 + items.length) % items.length];
    next.focus();
  };

  const handleLogoutClick = (): void => {
    closeMenu();
    void onLogout();
  };

  return (
    <div className="relative">
      <button
        type="button"
        ref={triggerRef}
        id="userMenuTrigger"
        onClick={() => setOpen((v) => !v)}
        className="user-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="userMenu"
        aria-label={t('menu.userMenuLabel', { name: user?.name ?? '' })}
      >
        <span className="user-avatar" aria-hidden="true">
          {initials}
        </span>
        <span className="user-name-label">{firstName}</span>
        <ChevronDown className="user-chevron" aria-hidden="true" />
      </button>

      {open && (
        <div
          id="userMenu"
          ref={menuRef}
          role="menu"
          aria-labelledby="userMenuTrigger"
          onKeyDown={onMenuKeyDown}
          className={[
            'absolute top-[calc(100%+10px)] right-0 w-64',
            'bg-[color:var(--dropdown-bg)] border border-[color:var(--dropdown-border)]',
            'rounded-2xl shadow-dropdown overflow-hidden z-50',
            'origin-top-right animate-user-menu-open',
            "before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-px",
            'before:bg-card-gold-bar before:opacity-95',
            'max-sm:w-[calc(100vw-24px)] max-sm:max-w-[340px]',
          ].join(' ')}
        >
          {/* Mini-card identitário */}
          <div
            className={[
              'grid grid-cols-[auto_1fr] gap-3.5 items-center',
              'px-[18px] pt-[18px] pb-4 relative',
              "after:content-[''] after:absolute after:left-[18px] after:right-[18px]",
              'after:bottom-0 after:h-px after:bg-dropdown-divider',
            ].join(' ')}
          >
            <div className="avatar-frame avatar-lg" aria-hidden="true">
              <div className="avatar-core">{initials}</div>
            </div>
            <div className="min-w-0">
              <div
                className={[
                  'text-[9px] font-semibold tracking-[0.26em] uppercase',
                  'text-fortuno-gold-intense leading-none mb-1',
                ].join(' ')}
              >
                {t('menu.account')}
              </div>
              <div className="font-display font-bold text-base text-fortuno-black truncate">
                {user?.name ?? t('menu.accountFallback')}
              </div>
              {user?.email ? (
                <div className="text-[11px] text-fortuno-black/55 truncate mt-0.5">
                  {user.email}
                </div>
              ) : null}
            </div>
          </div>

          {/* Lista de ações */}
          <div className="flex flex-col p-2">
            <NavLink
              to="/dashboard"
              role="menuitem"
              className="user-menu-item"
              onClick={closeMenu}
            >
              <span className="item-icon" aria-hidden="true">
                <LayoutDashboard className="w-[15px] h-[15px]" />
              </span>
              <span>{t('menu.dashboard')}</span>
              <ChevronRight className="item-chevron" aria-hidden="true" />
            </NavLink>

            <NavLink
              to="/conta/dados"
              role="menuitem"
              className="user-menu-item"
              onClick={closeMenu}
            >
              <span className="item-icon" aria-hidden="true">
                <UserCog className="w-[15px] h-[15px]" />
              </span>
              <span>{t('menu.editProfile')}</span>
              <ChevronRight className="item-chevron" aria-hidden="true" />
            </NavLink>

            <NavLink
              to="/conta/alterar-senha"
              role="menuitem"
              className="user-menu-item"
              onClick={closeMenu}
            >
              <span className="item-icon" aria-hidden="true">
                <KeyRound className="w-[15px] h-[15px]" />
              </span>
              <span>{t('menu.changePassword')}</span>
              <ChevronRight className="item-chevron" aria-hidden="true" />
            </NavLink>

            <div
              className="h-px bg-dropdown-divider mx-2.5 my-1.5"
              role="separator"
              aria-hidden="true"
            />

            <button
              type="button"
              role="menuitem"
              onClick={handleLogoutClick}
              className="user-menu-item is-danger"
            >
              <span className="item-icon" aria-hidden="true">
                <LogOut className="w-[15px] h-[15px]" />
              </span>
              <span>{t('menu.logout')}</span>
              <ChevronRight className="item-chevron" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
