import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Copy, Link as LinkIcon, MessageCircle, Share2, ShieldCheck, X } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import {
  copyToClipboard,
  getReferralLink,
  whatsappShareHref,
} from '@/utils/share';

export interface ShareReferralModalProps {
  open: boolean;
  onClose: () => void;
  referralCode: string;
}

export const ShareReferralModal = ({
  open,
  onClose,
  referralCode,
}: ShareReferralModalProps): JSX.Element | null => {
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const defaultMsg = t('myPoints.share.defaultMessage', {
    code: referralCode,
    url: getReferralLink(referralCode),
  });
  const [message, setMessage] = useState<string>(defaultMsg);

  // Ressincroniza a mensagem sempre que o modal reabrir com outro código.
  useEffect(() => {
    if (open) setMessage(defaultMsg);
  }, [open, defaultMsg]);

  if (!open) return null;

  const handleCopyLink = async (): Promise<void> => {
    try {
      await copyToClipboard(getReferralLink(referralCode));
      toast.success(t('myPoints.share.copiedLink'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleCopyCode = async (): Promise<void> => {
    try {
      await copyToClipboard(referralCode);
      toast.success(t('myPoints.share.copiedCode'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <Modal onClose={onClose} ariaLabelledBy="mp-share-title">
      <header className="mp-modal-header">
        <span className="mp-modal-icon-frame" aria-hidden="true">
          <Share2 />
        </span>
        <div className="mp-modal-titleblock">
          <span className="mp-modal-eyebrow">{t('myPoints.share.eyebrow')}</span>
          <h3 id="mp-share-title" className="mp-modal-title">
            {t('myPoints.share.title')}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mp-modal-close"
          aria-label={t('myPoints.share.closeAria')}
        >
          <X />
        </button>
      </header>

      <div className="mp-modal-body">
        <p className="text-[13px] text-fortuno-black/65 leading-[1.55]">
          {t('myPoints.share.description')}
        </p>

        <div className="share-message-block mt-4">
          <span className="msg-eyebrow">{t('myPoints.share.messageEyebrow')}</span>
          <textarea
            ref={textareaRef}
            aria-label={t('myPoints.share.messageAria')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="share-channels">
          <a
            href={whatsappShareHref(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="share-channel is-whatsapp"
            aria-label={t('myPoints.share.whatsappAria')}
          >
            <MessageCircle />
            {t('myPoints.share.whatsapp')}
          </a>
          <button
            type="button"
            onClick={() => void handleCopyLink()}
            className="share-channel"
            aria-label={t('myPoints.share.copyLinkAria')}
          >
            <LinkIcon />
            {t('myPoints.share.copyLink')}
          </button>
          <button
            type="button"
            onClick={() => void handleCopyCode()}
            className="share-channel"
            aria-label={t('myPoints.share.copyCodeAria')}
          >
            <Copy />
            {t('myPoints.share.copyCode')}
          </button>
        </div>

        <div className="mp-modal-divider" />

        <p className="text-[11px] text-fortuno-black/55 leading-[1.5] flex items-start gap-2">
          <ShieldCheck className="w-[13px] h-[13px] mt-[1px] shrink-0 text-fortuno-gold-intense" />
          {t('myPoints.share.disclaimer')}
        </p>
      </div>
    </Modal>
  );
};
