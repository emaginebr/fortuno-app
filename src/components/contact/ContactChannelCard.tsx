import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

export interface ContactChannelData {
  key: 'whatsapp' | 'instagram' | 'email';
  icon: LucideIcon;
  label: string;
  description: string;
  href: string;
  external: boolean;
  ctaLabel: string;
  ctaAria: string;
  slaLabel: string;
  slaAria: string;
}

interface ContactChannelCardProps {
  channel: ContactChannelData;
}

/**
 * Card individual de canal (WhatsApp, Instagram, E-mail).
 * O card inteiro é um <a>; o CTA inferior é apenas visual.
 */
export const ContactChannelCard = ({ channel }: ContactChannelCardProps): JSX.Element => {
  const { icon: Icon, label, description, href, external, ctaLabel, ctaAria, slaLabel, slaAria } =
    channel;

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="channel-card"
      aria-label={ctaAria}
    >
      <span className="sla-chip" aria-label={slaAria}>
        <span className="sla-dot" aria-hidden="true" />
        {slaLabel}
      </span>

      <div className="channel-icon-circle" aria-hidden="true">
        <Icon className="w-7 h-7" />
      </div>

      <div>
        <h3 className="font-display italic font-bold text-[24px] leading-[1.1] text-fortuno-black tracking-[-0.01em]">
          {label}
        </h3>
        <p className="mt-2 text-sm leading-[1.65] text-fortuno-black/70">{description}</p>
      </div>

      <span className="inline-flex items-center gap-1.5 mt-auto pt-2.5 font-semibold text-[13.5px] tracking-wide text-fortuno-gold-intense border-t border-fortuno-gold-intense/20">
        {ctaLabel}
        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
      </span>
    </a>
  );
};
