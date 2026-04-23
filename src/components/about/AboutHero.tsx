import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Ticket, ArrowRight, ArrowDown, ShieldCheck, Lock, Scale } from 'lucide-react';

/**
 * SVG inline — cofre art-déco vetorial usado como ilustração lateral do hero.
 * Decorativo (aria-hidden no figure que o contém).
 */
const VaultArtDeco = (): JSX.Element => (
  <svg
    viewBox="0 0 400 500"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
    className="w-full h-full block"
  >
    <defs>
      <radialGradient id="about-vault-glow" cx="50%" cy="45%" r="60%">
        <stop offset="0%" stopColor="#d4af37" stopOpacity="0.18" />
        <stop offset="60%" stopColor="#d4af37" stopOpacity="0.03" />
        <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="about-vault-gold-line" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#8a6a25" />
      </linearGradient>
      <linearGradient id="about-vault-safe-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#faf3e1" />
        <stop offset="100%" stopColor="#ece8e1" />
      </linearGradient>
    </defs>

    <rect x="0" y="0" width="400" height="500" fill="url(#about-vault-glow)" />

    {/* Moldura art-déco externa */}
    <rect
      x="48"
      y="40"
      width="304"
      height="420"
      fill="none"
      stroke="url(#about-vault-gold-line)"
      strokeWidth="1"
      opacity="0.45"
    />
    <rect
      x="60"
      y="52"
      width="280"
      height="396"
      fill="none"
      stroke="url(#about-vault-gold-line)"
      strokeWidth="1"
      opacity="0.25"
    />

    {/* Losangos nos 4 cantos */}
    <g fill="#b8963f">
      <rect x="56" y="48" width="8" height="8" transform="rotate(45 60 52)" />
      <rect x="336" y="48" width="8" height="8" transform="rotate(45 340 52)" />
      <rect x="56" y="444" width="8" height="8" transform="rotate(45 60 448)" />
      <rect x="336" y="444" width="8" height="8" transform="rotate(45 340 448)" />
    </g>

    {/* Cofre estilizado */}
    <g transform="translate(100 120)">
      <rect
        x="0"
        y="0"
        width="200"
        height="240"
        rx="12"
        fill="url(#about-vault-safe-fill)"
        stroke="#b8963f"
        strokeWidth="1.5"
      />
      <rect
        x="14"
        y="14"
        width="172"
        height="212"
        rx="6"
        fill="none"
        stroke="#b8963f"
        strokeWidth="1"
        opacity="0.35"
      />
      <rect
        x="30"
        y="30"
        width="140"
        height="180"
        rx="4"
        fill="none"
        stroke="#b8963f"
        strokeWidth="1"
        opacity="0.25"
      />

      {/* Roda central (mandala) */}
      <g transform="translate(100 120)">
        <circle r="48" fill="none" stroke="#b8963f" strokeWidth="1.5" />
        <circle r="38" fill="none" stroke="#b8963f" strokeWidth="0.8" opacity="0.55" />
        <circle r="26" fill="none" stroke="#b8963f" strokeWidth="1" opacity="0.75" />
        <circle r="6" fill="#b8963f" />
        <g stroke="#b8963f" strokeWidth="1.2" strokeLinecap="round">
          <line x1="0" y1="-46" x2="0" y2="-30" />
          <line x1="0" y1="46" x2="0" y2="30" />
          <line x1="-46" y1="0" x2="-30" y2="0" />
          <line x1="46" y1="0" x2="30" y2="0" />
          <line x1="-32" y1="-32" x2="-22" y2="-22" />
          <line x1="32" y1="32" x2="22" y2="22" />
          <line x1="-32" y1="32" x2="-22" y2="22" />
          <line x1="32" y1="-32" x2="22" y2="-22" />
        </g>
        <g fill="#b8963f">
          <rect x="-3" y="-54" width="6" height="6" transform="rotate(45 0 -51)" />
          <rect x="-3" y="48" width="6" height="6" transform="rotate(45 0 51)" />
          <rect x="-54" y="-3" width="6" height="6" transform="rotate(45 -51 0)" />
          <rect x="48" y="-3" width="6" height="6" transform="rotate(45 51 0)" />
        </g>
      </g>

      {/* "F" Playfair acima da roda */}
      <text
        x="100"
        y="58"
        textAnchor="middle"
        fontFamily="Playfair Display, Georgia, serif"
        fontStyle="italic"
        fontWeight="700"
        fontSize="22"
        fill="#b8963f"
      >
        F
      </text>

      {/* Pés do cofre */}
      <rect x="14" y="238" width="20" height="8" fill="#b8963f" opacity="0.75" />
      <rect x="166" y="238" width="20" height="8" fill="#b8963f" opacity="0.75" />
    </g>

    {/* Faixa inferior "Editio Aurea" */}
    <g transform="translate(200 400)">
      <line x1="-70" y1="0" x2="-12" y2="0" stroke="#b8963f" strokeWidth="1" opacity="0.6" />
      <line x1="12" y1="0" x2="70" y2="0" stroke="#b8963f" strokeWidth="1" opacity="0.6" />
      <rect x="-4" y="-4" width="8" height="8" transform="rotate(45 0 0)" fill="#b8963f" />
      <text
        x="0"
        y="24"
        textAnchor="middle"
        fontFamily="Playfair Display, Georgia, serif"
        fontStyle="italic"
        fontWeight="700"
        fontSize="14"
        fill="#8a6a25"
        letterSpacing="2"
      >
        EDITIO AUREA
      </text>
    </g>
  </svg>
);

export const AboutHero = (): JSX.Element => {
  const { t } = useTranslation('fortuno');

  return (
    <section
      className="about-hero relative z-10 pt-16 md:pt-24 pb-16 md:pb-24"
      aria-labelledby="about-hero-title"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-[1.35fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Coluna texto */}
          <div className="relative">
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-fortuno-gold-intense font-semibold">
              <span className="inline-block w-8 h-px bg-fortuno-gold-intense/70" aria-hidden="true" />
              {t('about.hero.eyebrow')}
              <span className="inline-block w-8 h-px bg-fortuno-gold-intense/70" aria-hidden="true" />
            </span>

            <h1
              id="about-hero-title"
              className="font-display mt-6 md:mt-8 text-fortuno-black leading-[1.02]"
              style={{ fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '-0.02em' }}
            >
              {t('about.hero.titleLine1')} <br className="hidden md:block" />
              <em className="italic text-fortuno-gold-intense">{t('about.hero.titleLine2')}</em>
            </h1>

            <p className="mt-6 md:mt-7 text-[17px] md:text-[18px] leading-relaxed text-fortuno-black/70 max-w-xl">
              {t('about.hero.subhead')}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/sorteios"
                className="cta-primary focus-visible:outline-none focus-visible:shadow-gold-focus"
              >
                <Ticket className="w-[18px] h-[18px]" aria-hidden="true" />
                {t('about.hero.ctaPrimary')}
                <ArrowRight className="w-[18px] h-[18px]" aria-hidden="true" />
              </Link>
              <a
                href="#missao"
                className="cta-ghost-light focus-visible:outline-none focus-visible:shadow-gold-focus"
              >
                {t('about.hero.ctaSecondary')}
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>

            {/* Mini trust bar */}
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-fortuno-black/55">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-fortuno-gold-intense" aria-hidden="true" />
                {t('about.hero.trustAudit')}
              </span>
              <span
                className="hidden md:inline-block w-1 h-1 rounded-full bg-fortuno-gold-intense/40"
                aria-hidden="true"
              />
              <span className="inline-flex items-center gap-2">
                <Lock className="w-4 h-4 text-fortuno-gold-intense" aria-hidden="true" />
                {t('about.hero.trustEncryption')}
              </span>
              <span
                className="hidden md:inline-block w-1 h-1 rounded-full bg-fortuno-gold-intense/40"
                aria-hidden="true"
              />
              <span className="inline-flex items-center gap-2">
                <Scale className="w-4 h-4 text-fortuno-gold-intense" aria-hidden="true" />
                {t('about.hero.trustCnpj')}
              </span>
            </div>
          </div>

          {/* Coluna arte — cofre art-déco vetorial */}
          <figure
            className="relative aspect-[4/5] rounded-[22px] border border-fortuno-gold-intense/30 bg-about-vault-paper shadow-paper overflow-hidden order-first md:order-last"
            aria-hidden="true"
          >
            <span
              className="absolute inset-[12px] border border-fortuno-gold-intense/25 rounded-[14px] pointer-events-none"
              aria-hidden="true"
            />
            <VaultArtDeco />
          </figure>
        </div>
      </div>
    </section>
  );
};
