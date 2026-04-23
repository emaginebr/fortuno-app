import { ContactHero } from '@/components/contact/ContactHero';
import { ContactChannelsGrid } from '@/components/contact/ContactChannelsGrid';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInstitutionalCard } from '@/components/contact/ContactInstitutionalCard';
import { ContactFaq } from '@/components/contact/ContactFaq';
import { ContactClosingCta } from '@/components/contact/ContactClosingCta';

/**
 * Página /fale-conosco — Editorial Casino Noir (variante light body).
 * Estrutura curta e funcional: hero compacto, canais com SLA, formulário
 * de contato com mock de envio, dados institucionais e FAQ. AuthenticatedShell
 * já provê <main> + Header + Footer globais — não envolver com <main> aqui.
 */
export const ContactPage = (): JSX.Element => {
  return (
    <div className="bg-dash-page text-fortuno-black">
      <ContactHero />
      <ContactChannelsGrid />
      <ContactForm />
      <ContactInstitutionalCard />
      <ContactFaq />
      <ContactClosingCta />
    </div>
  );
};
