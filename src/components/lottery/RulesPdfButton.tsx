import { downloadMarkdownAsPdf } from '@/Services/pdfService';
import { useTranslation } from 'react-i18next';

interface RulesPdfButtonProps {
  title: string;
  markdown: string;
  filename: string;
}

export const RulesPdfButton = ({
  title,
  markdown,
  filename,
}: RulesPdfButtonProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => downloadMarkdownAsPdf(markdown, filename, title)}
      className="inline-flex items-center gap-2 rounded-md border border-fortuno-gold-intense bg-transparent px-4 py-2 text-sm font-semibold text-fortuno-gold-intense hover:bg-fortuno-gold-intense hover:text-fortuno-black transition"
    >
      📄 {t('cta.downloadPdf')} — {title}
    </button>
  );
};
