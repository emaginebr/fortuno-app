import { useTranslation } from 'react-i18next';
import { MessageCircle, Instagram, Mail } from 'lucide-react';

import { ContactChannelCard, type ContactChannelData } from './ContactChannelCard';

/**
 * Grid 3 colunas de canais oficiais (WhatsApp, Instagram, E-mail).
 * Filtra automaticamente canais sem URL (env vars vazias) e ajusta o
 * layout para 1, 2 ou 3 colunas conforme a quantidade renderizada.
 */
export const ContactChannelsGrid = (): JSX.Element | null => {
  const { t } = useTranslation('fortuno');

  const whatsapp = import.meta.env.VITE_WHATSAPP_URL;
  const instagram = import.meta.env.VITE_INSTAGRAM_URL;
  const email = import.meta.env.VITE_CONTACT_EMAIL;

  const channels: ContactChannelData[] = [
    {
      key: 'whatsapp',
      icon: MessageCircle,
      label: t('contact.channels.whatsapp.label'),
      description: t('contact.channels.whatsapp.description'),
      href: whatsapp,
      external: true,
      ctaLabel: t('contact.channels.whatsapp.cta'),
      ctaAria: t('contact.channels.whatsapp.ariaCta'),
      slaLabel: t('contact.channels.whatsapp.slaLabel'),
      slaAria: t('contact.channels.whatsapp.slaAria'),
    },
    {
      key: 'instagram',
      icon: Instagram,
      label: t('contact.channels.instagram.label'),
      description: t('contact.channels.instagram.description'),
      href: instagram,
      external: true,
      ctaLabel: t('contact.channels.instagram.cta'),
      ctaAria: t('contact.channels.instagram.ariaCta'),
      slaLabel: t('contact.channels.instagram.slaLabel'),
      slaAria: t('contact.channels.instagram.slaAria'),
    },
    {
      key: 'email',
      icon: Mail,
      label: t('contact.channels.email.label'),
      description: t('contact.channels.email.description'),
      href: email ? `mailto:${email}` : '',
      external: false,
      ctaLabel: email ?? '',
      ctaAria: t('contact.channels.email.ariaCta'),
      slaLabel: t('contact.channels.email.slaLabel'),
      slaAria: t('contact.channels.email.slaAria'),
    },
  ].filter((c): c is ContactChannelData => Boolean(c.href));

  if (channels.length === 0) return null;

  // Ajuste responsivo: se < 3 canais, centraliza com largura limitada.
  const gridCols =
    channels.length === 3
      ? 'md:grid-cols-3'
      : channels.length === 2
        ? 'md:grid-cols-2 max-w-3xl mx-auto'
        : 'max-w-sm mx-auto';

  return (
    <section
      className="relative z-10 py-16 md:py-20"
      aria-labelledby="contact-channels-title"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mb-10 md:mb-12">
          <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-fortuno-gold-intense font-semibold">
            <span
              className="inline-block w-8 h-px bg-fortuno-gold-intense/70"
              aria-hidden="true"
            />
            {t('contact.channels.eyebrow')}
          </span>
          <h2
            id="contact-channels-title"
            className="font-display mt-4 text-fortuno-black leading-[1.05]"
            style={{ fontSize: 'clamp(28px, 3.6vw, 40px)', letterSpacing: '-0.02em' }}
          >
            {t('contact.channels.titleLine1')}{' '}
            <em className="italic text-fortuno-gold-intense">
              {t('contact.channels.titleLine2')}
            </em>
          </h2>
        </div>

        <div className={`grid grid-cols-1 ${gridCols} gap-5 md:gap-6`}>
          {channels.map((channel) => (
            <ContactChannelCard key={channel.key} channel={channel} />
          ))}
        </div>
      </div>
    </section>
  );
};
