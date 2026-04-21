import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface CopyableCodeProps {
  value: string;
  label?: string;
  className?: string;
}

export const CopyableCode = ({ value, label, className }: CopyableCodeProps): JSX.Element => {
  const { t } = useTranslation();

  const onCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(t('common.copied'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <div
      className={
        className ??
        'flex items-center gap-2 rounded-lg border border-fortuno-gold-intense/30 bg-fortuno-offwhite px-4 py-3'
      }
    >
      {label ? (
        <span className="text-xs font-semibold uppercase tracking-wide text-fortuno-black/60">
          {label}
        </span>
      ) : null}
      <code className="flex-1 select-all break-all font-mono text-sm text-fortuno-black">
        {value}
      </code>
      <button
        type="button"
        onClick={() => void onCopy()}
        className="rounded-md bg-fortuno-gold-intense px-3 py-1 text-xs font-semibold text-fortuno-black hover:bg-fortuno-gold-soft"
        aria-label={`${t('common.copy')} ${label ?? ''}`}
      >
        {t('common.copy')}
      </button>
    </div>
  );
};
