import { Download, Info, ScrollText, ShieldCheck, X } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { MarkdownView } from '@/components/lottery/MarkdownView';
import { downloadMarkdownAsPdf } from '@/Services/pdfService';

export interface RulesAndPolicyModalProps {
  mode: 'rules' | 'privacy';
  markdown: string;
  /** Nome do arquivo gerado para o PDF (sem extensão). */
  pdfFilename: string;
  /** Nome do sorteio — usado para enriquecer o título do modal. */
  lotteryName?: string;
  onClose: () => void;
}

const TITLE_BY_MODE: Record<RulesAndPolicyModalProps['mode'], string> = {
  rules: 'Regulamento',
  privacy: 'Política de privacidade',
};

const EYEBROW_BY_MODE: Record<RulesAndPolicyModalProps['mode'], string> = {
  rules: 'Documento oficial',
  privacy: 'Documento de privacidade',
};

export const RulesAndPolicyModal = ({
  mode,
  markdown,
  pdfFilename,
  lotteryName,
  onClose,
}: RulesAndPolicyModalProps): JSX.Element => {
  const baseTitle = TITLE_BY_MODE[mode];
  const fullTitle = lotteryName ? `${baseTitle} — ${lotteryName}` : baseTitle;
  const eyebrow = EYEBROW_BY_MODE[mode];
  const Icon = mode === 'rules' ? ScrollText : ShieldCheck;
  const closeAriaLabel =
    mode === 'rules' ? 'Fechar regulamento' : 'Fechar política de privacidade';

  return (
    <Modal onClose={onClose} ariaLabelledBy="rules-modal-title">
      <header className="relative grid grid-cols-[auto_1fr_auto] items-center gap-3.5 px-6 pt-[22px] pb-[18px] after:content-[''] after:absolute after:left-6 after:right-6 after:bottom-0 after:h-px after:bg-modal-divider">
        <span
          className="w-11 h-11 rounded-xl bg-fortuno-gold-intense/[0.12] border border-fortuno-gold-intense/[0.32] text-fortuno-gold-intense grid place-items-center"
          aria-hidden="true"
        >
          <Icon className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <div className="text-[9px] font-semibold tracking-[0.26em] uppercase text-fortuno-gold-intense leading-none mb-1">
            {eyebrow}
          </div>
          <h2
            id="rules-modal-title"
            className="font-display font-bold text-[22px] text-fortuno-black leading-[1.15] tracking-[-0.01em] truncate"
          >
            {fullTitle}
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

      <div className="modal-body markdown-body flex-1 overflow-y-auto px-7 py-[22px]" tabIndex={0}>
        <MarkdownView content={markdown} className="markdown-body max-w-none" />
      </div>

      <footer className="px-6 py-4 flex justify-between items-center gap-3 border-t border-fortuno-gold-intense/20 bg-fortuno-gold-intense/[0.04] flex-wrap">
        <span className="text-[11px] text-fortuno-black/50 inline-flex items-center gap-1.5">
          <Info className="w-3 h-3" aria-hidden="true" />
          Versão integral em PDF disponível para download.
        </span>
        <div className="flex gap-2 ml-auto">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-transparent text-fortuno-green-elegant border border-fortuno-green-elegant/25 text-xs font-semibold transition-colors duration-noir-fast hover:bg-fortuno-gold-intense/10 hover:border-fortuno-gold-intense min-h-[40px] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-fortuno-gold-soft/55"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={() => downloadMarkdownAsPdf(markdown, pdfFilename, fullTitle)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-fortuno-gold-intense text-fortuno-black text-[13px] font-bold tracking-wide shadow-[0_8px_20px_-8px_rgba(212,175,55,0.5),0_1px_0_rgba(255,255,255,0.35)_inset] transition-all duration-noir-fast ease-noir-spring hover:bg-fortuno-gold-soft hover:-translate-y-px focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-fortuno-gold-soft/55 min-h-[40px]"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            Baixar PDF
          </button>
        </div>
      </footer>
    </Modal>
  );
};
