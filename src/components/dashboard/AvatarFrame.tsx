export interface AvatarFrameProps {
  /** Iniciais do usuário (1 ou 2 chars — ex.: "RL"). */
  initials: string;
  /** 'sm' = 44px, 'md' = 52px (default), 'lg' = 56px (dropdown identity). */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Avatar circular compacto com ring conic-gradient ouro pulsante (breath).
 * Decorativo: sempre `aria-hidden` — a saudação textual carrega a identidade.
 */
export const AvatarFrame = ({
  initials,
  size = 'md',
  className,
}: AvatarFrameProps): JSX.Element => {
  const sizeClass =
    size === 'sm' ? 'avatar-sm' : size === 'lg' ? 'avatar-lg' : 'avatar-md';
  const wrapperClass = ['avatar-frame', sizeClass, className].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass} aria-hidden="true">
      <div className="avatar-core">{initials}</div>
    </div>
  );
};
