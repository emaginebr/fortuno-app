import { useMemo } from 'react';
import { Calendar, ShieldCheck, Trophy, Users, X } from 'lucide-react';
import type { RaffleInfo } from '@/types/raffle';
import type { RaffleAwardInfo } from '@/types/raffleAward';
import { Modal } from '@/components/common/Modal';
import { MarkdownView } from '@/components/lottery/MarkdownView';
import { formatDateExtensive, formatTime } from '@/utils/datetime';

export interface RaffleDetailModalProps {
  raffle: RaffleInfo;
  /** Posição do raffle dentro do calendário (1-based) — exibido no eyebrow. */
  index?: number;
  /** Prêmios carregados externamente quando não vêm inline em `raffle.awards`. */
  awards?: RaffleAwardInfo[];
  onClose: () => void;
}

export const RaffleDetailModal = ({
  raffle,
  index = 1,
  awards,
  onClose,
}: RaffleDetailModalProps): JSX.Element => {
  const sortedAwards = useMemo(() => {
    const source = awards && awards.length > 0 ? awards : raffle.awards ?? [];
    return [...source].sort((a, b) => a.position - b.position);
  }, [awards, raffle.awards]);
  const closeAriaLabel = 'Fechar detalhes do sorteio';

  return (
    <Modal onClose={onClose} ariaLabelledBy="raffle-modal-title">
      <header className="relative grid grid-cols-[auto_1fr_auto] items-center gap-3.5 px-6 pt-[22px] pb-[18px] after:content-[''] after:absolute after:left-6 after:right-6 after:bottom-0 after:h-px after:bg-modal-divider">
        <span
          className="w-11 h-11 rounded-xl bg-fortuno-gold-intense/[0.12] border border-fortuno-gold-intense/[0.32] text-fortuno-gold-intense grid place-items-center"
          aria-hidden="true"
        >
          <Trophy className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <div className="text-[9px] font-semibold tracking-[0.26em] uppercase text-fortuno-gold-intense leading-none mb-1">
            Sorteio Nº {String(index).padStart(2, '0')}
          </div>
          <h2
            id="raffle-modal-title"
            className="font-display font-bold text-[22px] text-fortuno-black leading-[1.15] tracking-[-0.01em] truncate"
          >
            {raffle.name}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={closeAriaLabel}
          className="w-9 h-9 rounded-[10px] bg-fortuno-black/[0.06] border border-fortuno-black/10 text-fortuno-black/65 grid place-items-center transition-all duration-noir-fast ease-noir-spring hover:bg-fortuno-gold-intense/[0.18] hover:text-fortuno-black hover:rotate-90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-fortuno-gold-soft/55"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </header>

      <div className="modal-body flex-1 overflow-y-auto px-7 py-[22px]" tabIndex={0}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div className="bg-white border border-[color:var(--card-paper-border)] rounded-xl p-4">
            <div className="text-[9px] font-semibold tracking-[0.26em] uppercase text-fortuno-gold-intense mb-1.5 inline-flex items-center gap-1.5">
              <Calendar className="w-3 h-3" aria-hidden="true" />
              Data
            </div>
            <div className="font-display text-[15px] text-fortuno-black font-semibold leading-snug">
              {formatDateExtensive(raffle.raffleDatetime)}
            </div>
            <div className="text-[11px] text-fortuno-black/55 mt-0.5">
              Apuração às {formatTime(raffle.raffleDatetime)} (Brasília)
            </div>
          </div>

          <div className="bg-white border border-[color:var(--card-paper-border)] rounded-xl p-4">
            <div className="text-[9px] font-semibold tracking-[0.26em] uppercase text-fortuno-gold-intense mb-1.5 inline-flex items-center gap-1.5">
              <Users className="w-3 h-3" aria-hidden="true" />
              Ganhadores anteriores
            </div>
            <div className="font-display text-[15px] text-fortuno-black font-semibold leading-snug">
              {raffle.includePreviousWinners ? 'Concorrem novamente' : 'Não concorrem'}
            </div>
            <div className="text-[11px] text-fortuno-black/55 mt-0.5">
              {raffle.includePreviousWinners
                ? 'Inclui ganhadores de sorteios anteriores.'
                : 'Apenas participantes ainda não sorteados.'}
            </div>
          </div>
        </div>

        {raffle.descriptionMd && (
          <div className="markdown-body mb-2">
            <MarkdownView content={raffle.descriptionMd} className="markdown-body max-w-none" />
          </div>
        )}

        {sortedAwards.length > 0 && (
          <div className="mt-4">
            <div className="text-[10px] uppercase tracking-[0.26em] text-fortuno-gold-intense font-semibold mb-2.5">
              Prêmios deste sorteio
            </div>
            <div className="flex flex-col gap-2">
              {sortedAwards.map((award) => (
                <div
                  key={award.raffleAwardId ?? award.position}
                  className="grid grid-cols-[auto_1fr] items-center gap-3.5 p-3 px-3.5 bg-white border border-[color:var(--card-paper-border)] rounded-xl"
                >
                  <span
                    className="w-9 h-9 rounded-full bg-[radial-gradient(120%_120%_at_30%_20%,var(--fortuno-gold-soft),var(--fortuno-gold-intense)_60%,var(--fortuno-green-elegant)_100%)] border-2 border-white/55 grid place-items-center text-fortuno-black font-display italic font-extrabold text-sm"
                    aria-hidden="true"
                  >
                    {award.position}º
                  </span>
                  <div className="text-sm text-fortuno-black font-semibold leading-snug">
                    {award.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="px-6 py-4 flex justify-between items-center gap-3 border-t border-fortuno-gold-intense/20 bg-fortuno-gold-intense/[0.04] flex-wrap">
        <span className="text-[11px] text-fortuno-black/50 inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3" aria-hidden="true" />
          Apuração auditada por hash SHA-256 público.
        </span>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-transparent text-fortuno-green-elegant border border-fortuno-green-elegant/25 text-xs font-semibold transition-colors duration-noir-fast hover:bg-fortuno-gold-intense/10 hover:border-fortuno-gold-intense min-h-[40px] ml-auto focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-fortuno-gold-soft/55"
        >
          Fechar
        </button>
      </footer>
    </Modal>
  );
};
