import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export const MarkdownView = ({ content, className }: MarkdownViewProps): JSX.Element => (
  <div
    className={
      className ??
      'prose prose-neutral max-w-none prose-headings:font-display prose-headings:text-fortuno-black prose-a:text-fortuno-gold-intense hover:prose-a:text-fortuno-gold-soft prose-strong:text-fortuno-black'
    }
  >
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
  </div>
);
