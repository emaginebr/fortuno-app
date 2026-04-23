import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { NumberType, composedSize } from '@/types/enums';
import { formatComposed } from '@/utils/numberFormat';
import { validatePickedNumber } from '@/utils/validators';
import type { LotteryInfo } from '@/types/lottery';

export interface ChooseNumberModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (n: number) => void;
  lottery: LotteryInfo;
  alreadyPicked: number[];
}

/** Normaliza o input do usuário em número inteiro (concatenando dezenas se composto). */
const normalize = (raw: string, type: NumberType): number => {
  if (type === NumberType.Int64) {
    return Number(raw.replace(/\D/g, ''));
  }
  const formatted = formatComposed(raw, type);
  return Number(formatted.replace(/-/g, ''));
};

export const ChooseNumberModal = (props: ChooseNumberModalProps): JSX.Element | null => {
  const { open, onClose, onConfirm, lottery, alreadyPicked } = props;
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<{ kind: 'error' | 'success'; msg: string } | null>(
    null,
  );

  const isComposed = lottery.numberType !== NumberType.Int64;
  const size = composedSize(lottery.numberType);

  const placeholder = useMemo(() => {
    if (!isComposed) {
      return t('checkout.modal.placeholderInt', {
        min: lottery.ticketNumIni,
        max: lottery.ticketNumEnd,
      });
    }
    return t('checkout.modal.placeholderComposed', { size });
  }, [isComposed, lottery.ticketNumIni, lottery.ticketNumEnd, size, t]);

  if (!open) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
    if (feedback) setFeedback(null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!input.trim()) return;

    const check = validatePickedNumber(input, lottery);
    if (!check.valid) {
      setFeedback({ kind: 'error', msg: check.reason ?? t('checkout.modal.errorInvalid') });
      return;
    }

    const normalized = normalize(input, lottery.numberType);
    if (alreadyPicked.includes(normalized)) {
      setFeedback({ kind: 'error', msg: t('checkout.modal.errorAlreadyPicked') });
      return;
    }

    // MOCK: aguarda endpoint GET /lotteries/{id}/numbers/{n}/available para validar
    // se o número já foi comprado por outro usuário. Por enquanto apenas segue.
    onConfirm(normalized);
    setInput('');
    setFeedback(null);
    onClose();
  };

  return (
    <Modal onClose={onClose} ariaLabelledBy="choose-number-title">
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.26em] text-fortuno-gold-intense font-semibold">
              {t('checkout.modal.eyebrow')}
            </p>
            <h2
              id="choose-number-title"
              className="font-display italic font-bold text-2xl md:text-3xl text-fortuno-black mt-1"
            >
              {t('checkout.modal.title')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.cancel')}
            className="w-9 h-9 rounded-full grid place-items-center text-fortuno-black/55 hover:text-fortuno-black hover:bg-fortuno-black/[0.04] transition-colors focus-visible:outline-none focus-visible:shadow-gold-focus"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </header>

        <div>
          <label
            htmlFor="choose-number-input"
            className="block text-[11px] font-bold uppercase tracking-[0.18em] text-fortuno-black/65 mb-2"
          >
            {t('checkout.modal.inputLabel')}
          </label>
          <input
            id="choose-number-input"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={input}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full px-4 py-3.5 rounded-xl border-[1.5px] border-[color:var(--card-paper-border)] bg-white text-fortuno-black font-mono text-base tracking-wide focus:border-fortuno-gold-intense focus:outline-none focus-visible:shadow-gold-focus transition-colors"
            aria-describedby="choose-number-feedback"
            aria-invalid={feedback?.kind === 'error'}
          />
          <p
            id="choose-number-feedback"
            role="status"
            aria-live="polite"
            className={`mt-2 text-xs min-h-[1.25rem] ${
              feedback?.kind === 'error'
                ? 'text-[color:var(--countdown-critical)] font-semibold'
                : 'text-fortuno-black/55'
            }`}
          >
            {feedback?.msg ?? t('checkout.modal.hint')}
          </p>
        </div>

        <footer className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="cta-ghost-noir focus-visible:outline-none focus-visible:shadow-gold-focus"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={!input.trim()}
            className="cta-gold focus-visible:outline-none focus-visible:shadow-gold-focus"
          >
            {t('checkout.modal.add')}
          </button>
        </footer>
      </form>
    </Modal>
  );
};
