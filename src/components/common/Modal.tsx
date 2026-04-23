import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  /** Callback invocado por: ESC, click no overlay, click no botão de fechar do header. */
  onClose: () => void;
  /** ID do título do modal, referenciado por `aria-labelledby`. */
  ariaLabelledBy: string;
  /** Conteúdo do modal — header / body / footer. */
  children: ReactNode;
  /** Classes extras para o container (paper). */
  className?: string;
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Primitive de modal acessível com:
 * - Render via React Portal em document.body
 * - Overlay fade + paper pop (animações via Tailwind)
 * - ESC fecha
 * - Click no overlay fecha (click no paper NÃO fecha)
 * - Focus trap manual (Tab / Shift+Tab circulam apenas no modal)
 * - Foco inicial no primeiro elemento focável dentro do paper
 * - Foco devolvido ao trigger ao fechar
 * - Body scroll lock enquanto aberto
 * - role="dialog" aria-modal="true" aria-labelledby
 * - Respeita prefers-reduced-motion via regra global em index.css
 */
export const Modal = ({
  onClose,
  ariaLabelledBy,
  children,
  className,
}: ModalProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusFirst = (): void => {
      const node = containerRef.current;
      if (!node) return;
      const focusables = node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        node.focus();
      }
    };

    const t = window.setTimeout(focusFirst, 0);

    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const node = containerRef.current;
        if (!node) return;
        const focusables = Array.from(
          node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        );
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || !node.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [onClose]);

  const overlayClass =
    'fixed inset-0 z-[80] bg-[color:var(--modal-overlay)] backdrop-blur-[4px] grid place-items-center p-4 sm:p-6 animate-modal-fade';

  const paperClass = [
    'relative w-full max-w-[640px] max-h-[min(86vh,760px)] bg-[color:var(--modal-bg)]',
    'border border-[color:var(--modal-border)] rounded-[20px] shadow-modal',
    'overflow-hidden flex flex-col animate-modal-pop',
    "before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-px before:bg-card-gold-bar before:opacity-95",
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const node = (
    <div
      className={overlayClass}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        tabIndex={-1}
        className={paperClass}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(node, document.body);
};
