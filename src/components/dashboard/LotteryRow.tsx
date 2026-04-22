import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Ban, Coins, Rocket, Settings2, StopCircle, Ticket, Trash2, Undo2 } from 'lucide-react';
import type { LotteryInfo } from '@/types/lottery';
import { LotteryStatus, LOTTERY_STATUS_LABEL } from '@/types/enums';
import { formatBRL } from '@/utils/currency';
import { iconForLotteryName } from '@/utils/lotteryIcon';

export interface LotteryRowProps {
  lottery: LotteryInfo;
  onPublish?: (lotteryId: number) => void | Promise<void>;
  onRevertToDraft?: (lotteryId: number) => void | Promise<void>;
  onClose?: (lotteryId: number) => void | Promise<void>;
  onCancel?: (lotteryId: number) => void | Promise<void>;
  onDelete?: (lotteryId: number) => void | Promise<void>;
  busy?: boolean;
}

interface StatusInlineProps {
  status: LotteryStatus;
}

const StatusInline = ({ status }: StatusInlineProps): JSX.Element => {
  const label = LOTTERY_STATUS_LABEL[status];

  if (status === LotteryStatus.Open) {
    return (
      <span className="inline-flex items-center gap-1.5 text-fortuno-green-elegant font-semibold">
        <span
          className="w-1.5 h-1.5 rounded-full bg-fortuno-gold-soft inline-block animate-live-pulse"
          aria-hidden="true"
        />
        {label}
      </span>
    );
  }

  if (status === LotteryStatus.Closed || status === LotteryStatus.Cancelled) {
    return (
      <span className="inline-flex items-center gap-1.5 text-fortuno-black/55">
        <span
          className="w-1.5 h-1.5 rounded-full bg-fortuno-black/30 inline-block"
          aria-hidden="true"
        />
        {label}
      </span>
    );
  }

  // Draft
  return (
    <span className="inline-flex items-center gap-1.5 text-fortuno-gold-intense">
      <span
        className="w-1.5 h-1.5 rounded-full bg-fortuno-gold-intense/60 inline-block"
        aria-hidden="true"
      />
      {label}
    </span>
  );
};

const ctaSolidGold = [
  'inline-flex items-center gap-1.5 px-[18px] py-2.5 rounded-full',
  'bg-fortuno-gold-intense text-fortuno-black font-bold text-[12px] tracking-wide',
  'shadow-[0_8px_22px_-6px_rgba(212,175,55,0.45),0_1px_0_rgba(255,255,255,0.35)_inset]',
  'transition-all duration-noir-fast',
  'hover:bg-fortuno-gold-soft hover:-translate-y-px',
  'focus-visible:outline-none focus-visible:shadow-gold-focus',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0',
  'min-h-[40px]',
].join(' ');

const ctaGhostGreen = [
  'inline-flex items-center gap-1.5 px-[18px] py-2.5 rounded-full',
  'bg-transparent text-fortuno-green-elegant',
  'border border-fortuno-green-elegant/25 font-semibold text-[12px]',
  'transition-colors duration-noir-fast',
  'hover:bg-fortuno-gold-intense/10 hover:border-fortuno-gold-intense',
  'focus-visible:outline-none focus-visible:shadow-gold-focus',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'min-h-[40px]',
].join(' ');

const ctaCopper = [
  'inline-flex items-center gap-1.5 px-[18px] py-2.5 rounded-full',
  'bg-transparent text-[color:#8a5a2b]',
  'border border-[color:#8a5a2b]/35 font-semibold text-[12px]',
  'transition-colors duration-noir-fast',
  'hover:bg-[color:#8a5a2b]/10 hover:border-[color:#8a5a2b]/60 hover:text-[color:#6e4421]',
  'focus-visible:outline-none focus-visible:shadow-gold-focus',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'min-h-[40px]',
].join(' ');

const ctaGhostGold = [
  'inline-flex items-center gap-1.5 px-[18px] py-2.5 rounded-full',
  'bg-transparent text-fortuno-gold-intense',
  'border border-fortuno-gold-intense/35 font-semibold text-[12px]',
  'transition-colors duration-noir-fast',
  'hover:bg-fortuno-gold-intense/10 hover:border-fortuno-gold-intense',
  'focus-visible:outline-none focus-visible:shadow-gold-focus',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'min-h-[40px]',
].join(' ');

/**
 * Linha compacta de loteria administrada. O CTA "Gerenciar" sempre aparece;
 * "Publicar"/"Encerrar"/"Cancelar" são renderizados condicionalmente por status
 * apenas quando os respectivos handlers forem fornecidos.
 */
export const LotteryRow = ({
  lottery,
  onPublish,
  onRevertToDraft,
  onClose,
  onCancel,
  onDelete,
  busy = false,
}: LotteryRowProps): JSX.Element => {
  const { t } = useTranslation();
  const Icon = iconForLotteryName(lottery.name);

  const totalTickets = Math.max(
    0,
    (lottery.ticketNumEnd ?? 0) - (lottery.ticketNumIni ?? 0) + 1,
  );
  // MOCK: aguarda endpoint /lottery/{id}/ticketStats — ver MOCKS.md.
  const soldTickets = 0;

  const canDeleteByStatus =
    lottery.status === LotteryStatus.Draft ||
    lottery.status === LotteryStatus.Cancelled;

  return (
    <li
      className={[
        'grid grid-cols-[40px_1fr_auto] gap-3.5 items-center',
        'p-3 px-4 rounded-xl bg-white border border-fortuno-black/[0.06]',
        'transition-all duration-noir-base',
        'hover:border-fortuno-gold-intense/45 hover:bg-[#fffdf6]',
        'hover:-translate-y-px hover:shadow-[0_6px_14px_-10px_rgba(10,42,32,0.18)]',
      ].join(' ')}
    >
      <div
        className={[
          'w-10 h-10 rounded-[10px] bg-marker-done text-fortuno-gold-soft',
          'grid place-items-center border border-fortuno-gold-soft/30',
        ].join(' ')}
        aria-hidden="true"
      >
        <Icon className="w-[18px] h-[18px]" />
      </div>

      <div className="min-w-0">
        <p className="font-semibold text-fortuno-black truncate text-sm">
          {lottery.name}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-fortuno-black/60 mt-0.5">
          <span className="inline-flex items-center gap-1">
            <Coins className="w-3 h-3 text-fortuno-gold-intense" aria-hidden="true" />
            {formatBRL(lottery.totalPrizeValue)}
          </span>
          {totalTickets > 0 && (
            <span className="inline-flex items-center gap-1">
              <Ticket className="w-3 h-3 text-fortuno-gold-intense" aria-hidden="true" />
              {soldTickets.toLocaleString('pt-BR')} /{' '}
              {totalTickets.toLocaleString('pt-BR')}
            </span>
          )}
          <StatusInline status={lottery.status} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        {lottery.status === LotteryStatus.Draft && onPublish ? (
          <button
            type="button"
            onClick={() => {
              void onPublish(lottery.lotteryId);
            }}
            disabled={busy}
            className={ctaSolidGold}
            aria-label={t('dashboard.publishLotteryAria', { name: lottery.name })}
          >
            {t('dashboard.publishLottery')}
            <Rocket className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        ) : null}

        {lottery.status === LotteryStatus.Open && onClose ? (
          <button
            type="button"
            onClick={() => {
              void onClose(lottery.lotteryId);
            }}
            disabled={busy}
            className={ctaGhostGreen}
            aria-label={t('dashboard.closeLotteryAria', { name: lottery.name })}
          >
            {t('dashboard.closeLottery')}
            <StopCircle className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        ) : null}

        {lottery.status === LotteryStatus.Open && onRevertToDraft ? (
          <button
            type="button"
            onClick={() => {
              void onRevertToDraft(lottery.lotteryId);
            }}
            disabled={busy}
            className={ctaGhostGold}
            aria-label={t('dashboard.revertToDraftAria', { name: lottery.name })}
          >
            {t('dashboard.revertToDraft')}
            <Undo2 className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        ) : null}

        {(lottery.status === LotteryStatus.Draft ||
          lottery.status === LotteryStatus.Open) &&
        onCancel ? (
          <button
            type="button"
            onClick={() => {
              void onCancel(lottery.lotteryId);
            }}
            disabled={busy}
            className={ctaCopper}
            aria-label={t('dashboard.cancelLotteryAria', { name: lottery.name })}
          >
            {t('dashboard.cancelLottery')}
            <Ban className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        ) : null}

        {canDeleteByStatus && onDelete ? (
          <button
            type="button"
            onClick={() => {
              void onDelete(lottery.lotteryId);
            }}
            disabled={busy}
            className={ctaCopper}
            aria-label={t('dashboard.deleteLotteryAria', { name: lottery.name })}
          >
            {t('dashboard.deleteLottery')}
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        ) : null}

        <Link
          to={`/meus-sorteios/${lottery.lotteryId}/editar`}
          className={ctaGhostGreen}
          aria-label={t('dashboard.manageLotteryAria', { name: lottery.name })}
        >
          {t('dashboard.manageLottery')}
          <Settings2 className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </li>
  );
};
