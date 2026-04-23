import { MarkdownView } from './MarkdownView';

export interface LotteryDescriptionProps {
  markdown: string;
  /** Nome do sorteio — usado para o headline editorial. */
  title: string;
}

export const LotteryDescription = ({
  markdown,
  title,
}: LotteryDescriptionProps): JSX.Element => (
  <section aria-labelledby="desc-title">
    <div className="flex items-baseline gap-3 flex-wrap mb-[18px]">
      <span className="text-[10px] font-semibold tracking-[0.26em] uppercase text-fortuno-gold-intense">
        Sobre o sorteio
      </span>
      <h2
        id="desc-title"
        className="font-display font-bold text-fortuno-black leading-[1.1] tracking-[-0.01em] text-[clamp(24px,2.6vw,32px)]"
      >
        O que vem com a{' '}
        <span className="italic text-fortuno-gold-intense">{title}</span>
      </h2>
    </div>

    <article className="editorial relative bg-white border border-[color:var(--card-paper-border)] rounded-[20px] shadow-paper p-[clamp(28px,4vw,48px)] before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-px before:bg-card-gold-bar">
      <MarkdownView
        content={markdown}
        className="markdown-content max-w-none"
      />
    </article>
  </section>
);
