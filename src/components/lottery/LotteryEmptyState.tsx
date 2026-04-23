import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Empty state exibido quando `openLotteries.length === 0 && !loading`.
 * Card dourado tracejado com glow ouro, headline Playfair italic e CTA ghost
 * para voltar à home. A11y: h2 semântico; ícone Sparkles é decorativo.
 */
export const LotteryEmptyState = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className="empty-card max-w-2xl mx-auto">
      <span className="icon-wrap" aria-hidden="true">
        <Sparkles className="w-8 h-8" />
      </span>

      <h2 className="font-display font-bold text-[clamp(28px,3.5vw,40px)] leading-[1.05] text-fortuno-black">
        {t('lotteryList.emptyTitlePrefix')}{' '}
        <em className="italic text-fortuno-green-elegant">
          {t('lotteryList.emptyTitleEmphasis')}
        </em>
      </h2>

      <p className="mt-3 text-fortuno-black/65 max-w-md mx-auto">
        {t('lotteryList.emptySubtitle')}
      </p>

      <div className="mt-7 flex items-center justify-center gap-3 flex-wrap">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-fortuno-gold-intense/55 text-fortuno-gold-intense font-medium text-sm hover:bg-fortuno-gold-intense/10 hover:border-fortuno-gold-intense/85 transition-colors focus-visible:outline-none focus-visible:shadow-gold-focus"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {t('lotteryList.emptyCta')}
        </Link>
      </div>
    </div>
  );
};
