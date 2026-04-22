# Home Page — Component Spec

Handoff do **ui-ux-designer** para o **frontend-react-developer**.

Direção visual: **Editorial Casino Noir** (mesma do wizard vertical). Ver `design/home/mockup.html` e `design/home/tokens.md`.

Esta spec redesenha **toda a rota `/`** (`src/pages/public/HomePage.tsx`) e os blocos filhos em `src/components/home/`. O conteúdo informacional atual (hero, carrossel, comunicado de fraude, pilares de segurança, "é fácil participar") é **preservado integralmente**; o que muda é a embalagem visual, a hierarquia e a adição de dois blocos novos (stats band + final CTA).

> **Iteração pós-aprovação (2026-04-21)**: o bloco `HomeHero` (hero institucional de marca) foi **substituído** por `HeroFeaturedLottery` — uma vitrine cinematográfica do sorteio em destaque com imagem wide, countdown, progress bar, scarcity hint, CTAs + faixa de 3 selos de credibilidade. O restante da home (stats band, carousel premium, fraud certificate, security pillars, how-it-works, final CTA, footer) permanece **intocado**.

---

## 1. Escopo e estratégia de substituição

### Arquivos-alvo no handoff

**Criar**
- `src/components/home/HeroFeaturedLottery.tsx` *(vitrine cinematográfica do sorteio em destaque — substitui o conceito anterior `HomeHero`)*
- `src/components/home/StatsBand.tsx` *(NOVO bloco)*
- `src/components/home/LotteryCardPremium.tsx` *(substitui o ticket visual do atual `LotteryCarousel`)*
- `src/components/home/LotteryCarouselPremium.tsx` *(wrapper com keen-slider; substitui `LotteryCarousel.tsx`)*
- `src/components/home/FraudCertificate.tsx` *(substitui `FraudWarning.tsx`)*
- `src/components/home/SecurityPillars.tsx` *(substitui `SecurityBlock.tsx`)*
- `src/components/home/HowItWorksTimeline.tsx` *(substitui `EasyToPlayBlock.tsx`)*
- `src/components/home/FinalCta.tsx` *(NOVO bloco)*
- `src/components/home/_primitives/GoldNumeral.tsx` *(helper de tipografia editorial ouro com shimmer)*
- `src/components/home/_primitives/CountdownClock.tsx` *(presentational — 4 células dd:hh:mm:ss com target via prop)*
- `src/components/home/_primitives/TrustSeals.tsx` *(NOVO — 3 selos glass reutilizáveis: auditado + PIX criptografado + CNPJ verificado; usado no hero e potencialmente no FinalCta)*

**Descartado**
- `HomeHero.tsx` — **não implementar**. O conceito foi reformulado em `HeroFeaturedLottery.tsx`. Se a pasta `src/components/home/HomeHero.tsx` já existir de uma implementação anterior, removê-la e ajustar o import da página.

**Atualizar**
- `src/pages/public/HomePage.tsx` — reestruturar composição (ver §3).
- `src/styles/tokens.css` — anexar tokens novos de `design/home/tokens.md §2`.
- `tailwind.config.js` — merge do `theme.extend` de `design/home/tokens.md §3`.

**Eliminar**
- `src/components/home/LotteryCarousel.tsx`
- `src/components/home/FraudWarning.tsx`
- `src/components/home/SecurityBlock.tsx`
- `src/components/home/EasyToPlayBlock.tsx`

> **Atenção**: antes de deletar, mover eventual copywriting não replicado (ex.: `<strong>` bold em "jamais") para os componentes novos. Nada pode desaparecer — o aviso de fraude tem peso de compliance.

---

## 2. Dependências

```bash
# Já existentes, apenas confirmar
npm ls lucide-react keen-slider tailwindcss-animate
```

- `lucide-react` — **já usado no wizard**. Ícones novos: `Ticket`, `Trophy`, `Car`, `Gem`, `ShieldCheck`, `ShieldAlert`, `Banknote`, `BadgeCheck`, `Lock`, `KeyRound`, `Building2`, `Zap`, `FileCheck2`, `Scale`, `Search`, `QrCode`, `Clock`, `Instagram`, `Globe`, `Mail`, `Eye`, `ArrowRight`, `ArrowLeft`.
- `keen-slider` — **já existente no projeto**. Reutilizar para o carousel premium.
- `tailwindcss-animate` — já presente.

Sem dependência nova. Nenhum Framer Motion, nenhum GSAP (restrição do projeto).

---

## 3. Nova composição da `HomePage.tsx`

```tsx
// src/pages/public/HomePage.tsx
import { useEffect, useMemo } from 'react';
import { useLottery } from '@/hooks/useLottery';
import { HeroFeaturedLottery } from '@/components/home/HeroFeaturedLottery';
import { StatsBand } from '@/components/home/StatsBand';
import { LotteryCarouselPremium } from '@/components/home/LotteryCarouselPremium';
import { FraudCertificate } from '@/components/home/FraudCertificate';
import { SecurityPillars } from '@/components/home/SecurityPillars';
import { HowItWorksTimeline } from '@/components/home/HowItWorksTimeline';
import { FinalCta } from '@/components/home/FinalCta';

export const HomePage = (): JSX.Element => {
  const { openLotteries, loadOpen } = useLottery();

  useEffect(() => {
    void loadOpen();
  }, [loadOpen]);

  // Sorteio em destaque: prefere `isFeatured === true` quando o backend
  // expuser o flag; até lá, escolhe o de maior `totalPrizeValue` dos abertos.
  // Se a lista estiver vazia, passa `undefined` e o hero degrada para o
  // estado fallback (ver §4.1).
  const featuredLottery = useMemo(() => {
    if (openLotteries.length === 0) return undefined;
    const explicit = openLotteries.find(l => l.isFeatured === true);
    if (explicit) return explicit;
    return [...openLotteries].sort(
      (a, b) => (b.totalPrizeValue ?? 0) - (a.totalPrizeValue ?? 0),
    )[0];
  }, [openLotteries]);

  return (
    <main className="bg-noir-page text-fortuno-offwhite min-h-screen">
      <HeroFeaturedLottery featuredLottery={featuredLottery} />
      <StatsBand />
      <LotteryCarouselPremium lotteries={openLotteries} />
      <FraudCertificate />
      <SecurityPillars />
      <HowItWorksTimeline />
      <FinalCta nextRaffleAt={featuredLottery?.raffles?.[0]?.scheduledAt} />
    </main>
  );
};
```

Ordem: hero → stats → carrossel → certificado → pilares → como → final cta → footer (o footer é do layout, já existente).

> **Nota sobre `isFeatured`**: o campo ainda não existe em `LotteryInfo`. Enquanto não existir, o `find(... isFeatured === true)` simplesmente retorna `undefined` e o fallback (maior `totalPrizeValue`) assume. Quando o backend adicionar o flag, basta estender o tipo — sem mudar a página. Registrar em `MOCKS.md` como `// MOCK: aguarda campo isFeatured em GET /lotteries (LotteryInfo.isFeatured: boolean)`.

---

## 4. Estrutura DOM por seção (classes Tailwind exatas)

### 4.1 `HeroFeaturedLottery`

**Conceito**: vitrine cinematográfica — uma fotografia GRANDE em formato wide (16:9 desktop / 21:9 lg / 4:3 mobile) ocupa 60-65% da largura, atuando como "outdoor" do sorteio mais relevante. À direita, painel glass com toda a informação acionável (numeral do prêmio, countdown, progress de bilhetes, CTAs e selos de credibilidade).

**Props**:
```ts
import type { LotteryInfo } from '@/types/lottery';

export interface HeroFeaturedLotteryProps {
  /**
   * Sorteio em destaque já resolvido pela página
   * (ver lógica de seleção em HomePage.tsx).
   * Se `undefined`, o componente renderiza o estado fallback
   * "Próximos sorteios em breve".
   */
  featuredLottery: LotteryInfo | undefined;
}
```

**Sub-componentes privados** (definidos no mesmo arquivo, não exportados):
- `EditorialEyebrow` — `<div>` com filete + texto uppercase tracking-wide.
- `HeroStage` — `<figure>` com a imagem cinematográfica + overlay + caption.
- `HeroPanel` — `<aside>` com numeral, countdown, progress, CTAs, selos.
- `HeroFallback` — quando `featuredLottery === undefined`.

**Componentes externos consumidos**:
- `<GoldNumeral shimmer>` (primitive — §4.9).
- `<CountdownClock targetIso>` (primitive — §4.10).
- `<TrustSeals variant="hero">` (primitive — §4.11).

**DOM (estado normal — `featuredLottery` definido)**:
```tsx
<section className="bg-noir-hero relative overflow-hidden"
         aria-labelledby="hero-featured-title">
  {/* partículas */}
  <div aria-hidden="true" className="hero-particles">
    {Array.from({ length: 8 }).map((_, i) => (
      <span key={i} style={{ '--i': i } as CSSProperties} />
    ))}
  </div>

  <div className="relative z-10 mx-auto max-w-7xl px-6 pt-12 md:pt-20 pb-20 md:pb-28">
    <EditorialEyebrow>Sorteio em destaque</EditorialEyebrow>

    <div className="grid md:grid-cols-[1.7fr_1fr] gap-8 lg:gap-10 items-stretch mt-6 md:mt-8">

      {/* COLUNA PRINCIPAL: imagem wide */}
      <figure className="hero-stage aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] m-0">
        <img
          className="hero-image"
          src={featuredLottery.images?.[0]?.imageUrl ?? FALLBACK_HERO_IMAGE}
          alt={`${featuredLottery.name} — prêmio do sorteio em destaque`}
          loading="eager"
          decoding="async"
        />
        <div className="stage-frame" aria-hidden="true" />

        <figcaption className="stage-caption">
          <span className="badge-live self-start">
            <span className="dot" aria-hidden="true" />
            Sorteio em destaque
          </span>
          <h2 id="hero-featured-title"
              className="font-display text-fortuno-offwhite leading-[1.0]
                         text-[clamp(28px,4.5vw,56px)] tracking-[-0.02em]
                         [text-shadow:0_6px_30px_rgba(0,0,0,0.65)]">
            {featuredLottery.name}
          </h2>
          {featuredLottery.subtitle && (
            <p className="text-fortuno-offwhite/75 text-sm md:text-base max-w-xl
                         [text-shadow:0_2px_12px_rgba(0,0,0,0.85)]">
              {featuredLottery.subtitle}
            </p>
          )}
        </figcaption>
      </figure>

      {/* COLUNA LATERAL: painel info + ação */}
      <aside className="hero-panel flex flex-col">
        {/* Headline editorial: numeral ouro do prêmio */}
        <div>
          <span className="eyebrow-micro">Prêmio total</span>
          <GoldNumeral shimmer size="clamp(40px, 5.5vw, 64px)" className="mt-2">
            {formatBRL(featuredLottery.totalPrizeValue)}
          </GoldNumeral>
          <p className="mt-2 text-xs text-fortuno-offwhite/65">
            Auditado, pago via PIX, transferido em minutos.
          </p>
        </div>

        <Divider className="my-6" />

        <CountdownClock targetIso={featuredLottery.raffles?.[0]?.scheduledAt} />

        <TicketProgress
          sold={soldTickets}
          total={totalTickets}
          showScarcityFrom={80}
          className="mt-7"
        />

        <div className="mt-7 flex flex-col gap-3">
          <Link to={`/sorteios/${featuredLottery.slug}`}
                className="cta-primary justify-center w-full"
                aria-label={`Comprar bilhetes do sorteio ${featuredLottery.name}`}>
            <Ticket /> <span>Compre já</span> <ArrowRight />
          </Link>
          <a href="#como"
             className="cta-ghost justify-center w-full text-sm
                        border-fortuno-gold-soft/45 text-fortuno-gold-soft">
            Como funciona
          </a>
        </div>

        <TrustSeals variant="hero" className="mt-6" />
      </aside>
    </div>
  </div>
</section>
```

**DOM (estado fallback — `featuredLottery === undefined`)**:
```tsx
<section className="bg-noir-hero relative overflow-hidden">
  <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 md:py-32">
    <div className="hero-fallback">
      <EditorialEyebrow centered>Em preparação</EditorialEyebrow>
      <h2 className="font-display text-fortuno-offwhite mt-4
                     text-[clamp(36px,5vw,56px)]">
        Próximos sorteios em <span className="italic text-fortuno-gold-soft">breve</span>.
      </h2>
      <p className="mt-4 text-fortuno-offwhite/70 max-w-md mx-auto">
        Estamos preparando a próxima edição. Cadastre-se para ser avisado quando os bilhetes abrirem.
      </p>
      <div className="mt-8 flex justify-center gap-3 flex-wrap">
        <Link to="/sorteios" className="cta-primary">
          Ver todos os sorteios <ArrowRight />
        </Link>
        <a href="#como" className="cta-ghost">Como funciona</a>
      </div>
    </div>
  </div>
</section>
```

**Constante exportada do componente** (módulo, não prop):
```ts
const FALLBACK_HERO_IMAGE = '/images/hero-fallback.jpg'; // mock até admin subir imagens reais
```

**Cálculo de `soldTickets` / `totalTickets`**:
- `totalTickets = (featuredLottery.ticketNumEnd ?? 0) - (featuredLottery.ticketNumIni ?? 0) + 1`.
- `soldTickets`: **MOCK até `/lottery/{id}/ticketStats` existir** (ver §9). Por ora, usar uma simulação determinística baseada em `lotteryId` (Math.floor(total * 0.87) por padrão para que o scarcity hint apareça e seja testável visualmente). Marcar com `// MOCK: aguarda endpoint /lottery/{id}/ticketStats` e registrar em `MOCKS.md`.

**Critérios de visualização do scarcity hint**:
- Aparece quando `soldTickets / totalTickets >= 0.80`.
- Texto: "Últimos bilhetes" + dot pulsante em `--scarcity-color` (`#f0d27a`, mais quente que o ouro padrão).
- Nunca usar só cor — sempre dot + texto.

**Notas de implementação**:
- A imagem do palco DEVE ter `loading="eager"` (LCP da página). Não preguiçosa.
- Reservar o `aspect-ratio` antes do `<img>` carregar para evitar layout shift (o `aspect-[16/9]` no figure já faz isso).
- Em mobile a coluna principal vai PRIMEIRO (order-1) e o painel embaixo (order-2) — é o comportamento padrão do CSS grid em uma coluna; não precisa de classe extra.
- Selos em mobile: continuam grid `grid-cols-3` — labels em duas linhas (`<br/>`) garantem que mesmo em 320px caibam sem overflow.
- Classes `cta-primary` / `cta-ghost` / `eyebrow-micro` / `Divider` → definir em `src/styles/home.css` (ou reusar `.btn-primary` se já expor equivalente; caso não, adicionar variantes editoriais).

### 4.2 `StatsBand`

**Props**: `{ stats?: StatItem[] }` (default hardcoded — ver §9 sobre mocks).

```tsx
<section className="bg-stats-band border-y border-fortuno-gold-soft/15 relative z-10 py-14 md:py-16">
  <div className="mx-auto max-w-7xl px-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 items-center">
      {stats.map((s, i) => (
        <>
          <StatCell key={s.key} {...s} />
          {i < stats.length - 1 && (
            <div aria-hidden="true" className="w-px self-stretch bg-gold-divider-v hidden md:block" />
          )}
        </>
      ))}
    </div>
  </div>
</section>
```

- Cada `StatCell` usa o numeral editorial com `GoldNumeral`.
- Count-up: CSS `@property --count` + `counter-reset`. Acessível via `<span class="sr-only">{finalValue}</span>`.

### 4.3 `LotteryCarouselPremium`

**Props**: `{ lotteries: LotteryInfo[] }`

- Envolve `keen-slider` com config mantida:
  ```ts
  {
    loop: lotteries.length > 3,
    slides: { perView: 1, spacing: 16 },
    breakpoints: {
      '(min-width: 768px)':  { slides: { perView: 2, spacing: 20 } },
      '(min-width: 1024px)': { slides: { perView: 3, spacing: 24 } },
    },
  }
  ```
- Expor setas externas com `sliderRef.current?.prev()/next()` via hook `useKeenSlider` (`[sliderRef, slider]`).
- Cada slide renderiza `<LotteryCardPremium lottery={lottery} />`.
- Empty state: `<EmptyLotteries />` quando `lotteries.length === 0` (copy "Nenhum sorteio em andamento...").

### 4.4 `LotteryCardPremium`

**Props**:
```ts
export interface LotteryCardPremiumProps {
  lottery: LotteryInfo;
}
```

**DOM base**:
```tsx
<article className="lottery-card group flex flex-col">  {/* classe composta, ver tokens §4 */}
  <div className="relative aspect-[16/10] overflow-hidden rounded-t-[20px]">
    {cover
      ? <img src={cover} alt={lottery.name} className="w-full h-full object-cover" />
      : <FallbackCover type={iconForName(lottery.name)} />}
    <div className="absolute top-4 left-4">
      <LiveBadge />
    </div>
    <div className="absolute top-4 right-4">
      <DeadlineChip days={daysUntilEnd} />
    </div>
  </div>

  <div className="p-6 flex-1 flex flex-col">
    <div className="text-[10px] uppercase tracking-[0.24em] text-fortuno-offwhite/55 mb-1">
      Edição Nº {String(lottery.lotteryId).padStart(3, '0')}
    </div>
    <h3 className="font-display text-2xl text-fortuno-offwhite mb-3">{lottery.name}</h3>

    <div className="mb-4">
      <div className="text-[10px] uppercase tracking-[0.24em] text-fortuno-offwhite/55">Prêmio total</div>
      <GoldNumeral size="34px">{formatBRL(lottery.totalPrizeValue)}</GoldNumeral>
    </div>

    <TicketProgress sold={sold} total={total} priceMin={lottery.ticketPrice} />

    <Link to={`/sorteios/${lottery.slug}`} className="cta-primary w-full justify-center mt-auto">
      Compre já <ArrowRight />
    </Link>
  </div>
</article>
```

- `sold` e `total` vêm do backend se `LotteryInfo` for estendido; enquanto não, **mockar** via `ticketNumEnd - ticketNumIni` para `total` e **0 para `sold` até o endpoint existir** (`// MOCK: aguarda endpoint /lottery/{id}/ticketStats` + registrar em `MOCKS.md` conforme CLAUDE.md).
- `iconForName`: mapeia por heurística (regex) — `/mega/i → Trophy`, `/garage|car/i → Car`, `/diamante|gem/i → Gem`, default `Ticket`.

### 4.5 `FraudCertificate`

**Props**: nenhuma (conteúdo estático, `instagram` vem de `import.meta.env.VITE_INSTAGRAM_URL`).

- Wrapper `<section id="comunicado" className="relative py-12 md:py-16">`.
- Painel principal: `<div className="bg-noir-cert rounded-3xl relative overflow-hidden px-8 md:px-14 py-14 md:py-20">`
- 4 cantos `.deco-corner` (CSS custom declarado em um arquivo utilitário `src/styles/home.css` ou dentro do componente com `<style>` — **preferir `home.css` dedicado**).
- Watermark: `<span aria-hidden="true" className="watermark">Fortuno</span>`.
- Bullets em `<ol>` com numerais romanos: usar `<span className="num">I</span>` hardcoded (I, II, III, IV, V). A numeração romana é decorativa — cada `<li>` tem também um `aria-label` textual ("Item 1 de 5: ...").
- Divisores art déco: `<div className="deco-divider"><span className="deco-diamond"/></div>`.
- Bloco "Fique ligado" mantém `<dl>` semântica (4 pares dt/dd).
- **Não suavizar copy**: "jamais", "não pedimos", "não enviamos" — palavras fortes destacadas com `<strong className="text-fortuno-gold-soft">`.

### 4.6 `SecurityPillars`

**Props**: nenhuma.

- 3 cards grid `md:grid-cols-3`.
- O card do meio (`PIX`) recebe `className="pillar featured md:-mt-4 md:mb-4"` — fica ligeiramente maior/destacado.
- Ícones: `ShieldCheck`, `Banknote`, `BadgeCheck`.
- Cada card tem: step number (`Pilar I/II/III`) + ícone em box metal + título + descrição + micro-trust line ("TLS 1.3 · AES-256" / "Confirmação em segundos" / "Ata pública de cada edição").

### 4.7 `HowItWorksTimeline`

**Props**: nenhuma.

- Seção com background levemente mais escuro: `bg-[rgba(7,32,26,0.35)]` + divisores ouro top/bottom.
- Desktop: `<ol>` horizontal com 4 steps, trilha ouro conectando markers (via `::before` ou elemento absoluto `.timeline-rail`).
- Mobile: mesma `<ol>`, vira coluna com markers à esquerda, rail desaparece (media query `md:hidden` no rail).
- Markers 72×72 (56×56 no mobile), `bg-marker-active` (reutiliza token do wizard), numeral editorial 01–04 no centro.
- CTA final: `Compre já` (mesmo padrão do hero).

### 4.8 `FinalCta`

**Props**:
```ts
export interface FinalCtaProps {
  nextRaffleAt?: string; // ISO; se ausente, oculta o eyebrow do countdown
}
```

- Background `bg-noir-final`.
- Headline com `GoldNumeral shimmer` inserindo a palavra "sorte" no meio do h2 (`"A próxima [sorte] pode ser a sua."`).
- Duas CTAs (primary grande + ghost "Como funciona").
- Trust bar: usar **`<TrustSeals variant="compact" />`** (primitive — §4.11). NÃO duplicar markup; o componente é a fonte única para os 3 selos.

### 4.9 `GoldNumeral` (primitive)

```ts
interface GoldNumeralProps {
  children: ReactNode;
  size?: string;              // token CSS (ex.: '34px', 'clamp(48px,8vw,96px)')
  shimmer?: boolean;          // adiciona ::after shimmer
  as?: 'span' | 'div';        // default 'span'
}
```

Implementa:
- `font-family: 'Playfair Display'; font-style: italic; font-weight: 800;`
- Gradient `from-fortuno-gold-soft via-fortuno-gold-intense to-fortuno-gold-intense/25` via `bg-clip-text text-transparent`.
- Shimmer opcional: clona o texto via `data-text={textContent}` para `::after` (mesma técnica do mockup).
- Usa CSS module ou classes globais em `home.css`.

### 4.10 `CountdownClock` (primitive)

```ts
interface CountdownClockProps {
  targetIso?: string;  // ISO 8601 do próximo sorteio
  compact?: boolean;   // se true, esconde segundos em mobile
}
```

- `useEffect` com `setInterval(1000)` calculando `diff = Math.max(0, new Date(target) - Date.now())`.
- Desmontar o interval no cleanup.
- Se `targetIso` ausente: renderizar `null` (o hero lida graciosamente via condicional).
- 4 células `.countdown-cell` com `.countdown-num` (Playfair) e `.countdown-label` (eyebrow micro).
- Wrapper recebe `role="timer"`, `aria-live="polite"`, `aria-atomic="true"` e um label "Tempo restante até o próximo sorteio".
- Os números visíveis atualizam a cada 1s, mas o anúncio textual via `<span class="sr-only">` (formato "X dias, Y horas, Z minutos e W segundos") deve ter **throttle: re-render do `sr-only` apenas quando o valor de minutos mudar** — evita screen readers falando incessantemente.
- `prefers-reduced-motion`: tudo OK, não há animação.

### 4.11 `TrustSeals` (primitive — NOVO)

Faixa de selos de credibilidade reutilizável: 3 selos lado a lado em grid 3 colunas, micro-bordas ouro + fundo glass + ícone Lucide + label uppercase tracking-wide.

```ts
export interface TrustSealsProps {
  variant?: 'hero' | 'compact'; // 'hero' = padrão usado no painel lateral; 'compact' = versão menor para FinalCta
  className?: string;
}
```

**Selos hardcoded** (alinhar com compliance antes de produção):

| Ícone Lucide  | Label                      |
|---------------|----------------------------|
| `BadgeCheck`  | Sorteio<br/>auditado       |
| `KeyRound`    | PIX<br/>criptografado      |
| `Building2`   | CNPJ<br/>verificado        |

Implementação:
- `<div role="list" aria-label="Selos de credibilidade">` com 3 `<div role="listitem">`.
- Classes: ver `tokens.md §4` linhas "Selo individual" e "Label do selo".
- Hover: levanta 1px + escurece levemente o glass + clareia a borda ouro.
- `variant='compact'`: reduz padding e tamanho do ícone para uso no `FinalCta`.

**Por que primitive e não inline**: o conceito repete no `FinalCta` (§4.8 já lista "Trust bar com 3 ícones"). Centralizar evita drift visual e duplicação de copy.

---

## 5. Comportamento responsivo

| Breakpoint  | Comportamento                                                                                         |
|-------------|--------------------------------------------------------------------------------------------------------|
| `< 640px`   | Hero: grid vira 1 coluna; card featured vai ABAIXO do bloco de texto. Countdown encolhe (seg menor).  |
| `< 768px`   | Stats band: 2×2 grid, divisor vertical some. Carousel: `perView: 1`. Timeline: vira vertical stack.   |
| `md (768)`  | Grid 2 colunas no hero. Carousel: `perView: 2`. Timeline horizontal com trilha.                       |
| `lg (1024)` | Carousel: `perView: 3`. Todos os numerais atingem tamanho máximo.                                     |
| `xl (1280)` | `max-w-7xl` centraliza; sobra margem editorial nas laterais.                                          |

Regras:
- **Zero horizontal scroll** em 375px (verificar numeral do hero — `clamp()` resolve).
- Todos os CTAs mantêm `min-h-[44px]` (touch target).
- Cards de loteria mantêm `min-h-[420px]` para consistência visual no grid.

---

## 6. Acessibilidade (WCAG AA mínimo)

Herda o contrato de `design/wizard-vertical/spec.md §6` + adições:

- **Focus visível global**: todo `a`, `button`, `[tabindex]` recebe `focus-visible:shadow-gold-focus` (ring ouro 3px). Nunca `outline: none` sem substituto.
- **Carousel** (`LotteryCarouselPremium`):
  - `<section aria-roledescription="carousel" aria-label="Sorteios abertos">`.
  - Cada slide: `role="group" aria-roledescription="slide" aria-label="Sorteio X de Y"`.
  - Setas: `aria-label="Sorteio anterior"` / `"Próximo sorteio"`.
  - **Teclado**: `←`/`→` quando o carousel tem foco navegam slides (keen-slider expõe `slider.prev()/next()`; adicionar listener de keydown no wrapper com `tabIndex={0}`).
- **Stats band**: o count-up não é percebido por screen reader — sempre fornecer `<span className="sr-only">{finalFormattedValue}</span>` ao lado do número animado.
- **Certificate**:
  - `<section aria-labelledby="comunicado-title">` com `<h2 id="comunicado-title">`.
  - Bullets em `<ol>` (ordem importa para compliance).
  - Numerais romanos `I, II, III...` são **visuais**; cada `<li>` tem fallback textual.
- **Timeline**:
  - `<ol aria-label="Como participar">`.
  - Steps não são focáveis (são passos descritivos, não ações).
- **Contraste** (checar no Lighthouse):
  - `offwhite` sobre `bg-noir-page`: ≥ 13:1 AAA.
  - `gold-soft` sobre `bg-noir-page`: ≥ 6.8:1 AA.
  - Badge "Aberto" texto sobre `bg-badge-live-bg` dentro do card escuro: ≥ 5:1 AA (grande + bold).
- **Cor não é único indicador**: cada badge tem ícone + texto; pilares têm número do pilar + ícone + título; timeline tem número + título + ícone no eyebrow.

---

## 7. Animações — mapa completo

| Animação             | Elemento                      | Duração        | Trigger                                   |
|----------------------|-------------------------------|----------------|-------------------------------------------|
| `animate-live-pulse` | Dot do badge "Aberto"         | 1.8s infinite  | Automático                                |
| `animate-numeral-shimmer` | Numeral ouro com shimmer  | 4.8s infinite  | `shimmer` prop true no `GoldNumeral`      |
| `animate-particle-float` | Partículas do hero         | 14s infinite   | Automático (8 partículas com delays)      |
| `animate-progress-shimmer` | Reflexo sobre progress bar | 2.4s infinite | Automático em `TicketProgress`            |
| `reveal` (scroll-driven) | Headings das seções        | viewport entry | CSS `@supports (animation-timeline: view())` com fallback estático |
| `hover:-translate-y-1.5` + `hover:shadow-noir-card-hover` | Lottery card | 240ms ease-noir-spring | Hover/focus |
| `hover:-translate-y-1` | Pillar card                 | 240ms          | Hover                                     |
| `hover:translate-y-[-3px]` | Timeline marker         | 240ms          | Hover no step                             |

Todas caem para instantâneo sob `prefers-reduced-motion: reduce` (regra `*` global já em `src/styles/index.css`).

---

## 8. Consumo de dados — contratos

### 8.1 Carousel usa `LotteryInfo[]` (já existente)

De `useLottery().openLotteries`. Campos usados:
- `lotteryId`, `slug`, `name`, `totalPrizeValue`, `ticketPrice`, `ticketNumIni`, `ticketNumEnd`
- `images[0]?.imageUrl` — cover
- `raffles[0]?.scheduledAt` — ISO do próximo sorteio (usado no countdown do hero e no `FinalCta`)

**Assumir ausência graciosamente**: se `raffles` vazio → hero sem countdown (eyebrow + numeral permanecem). Se `images` vazio → `FallbackCover` com ícone Lucide.

### 8.2 Hero featured (HeroFeaturedLottery)

Resolução do `featuredLottery`:
1. Procurar `openLotteries.find(l => l.isFeatured === true)` — campo opcional, ainda não existe no backend.
2. Se não encontrar, escolher o de **maior `totalPrizeValue`** dentre `openLotteries`.
3. Se `openLotteries.length === 0`, `featuredLottery` fica `undefined` e o componente renderiza o **estado fallback** ("Próximos sorteios em breve" + CTA "Ver todos os sorteios").

Campos consumidos do `LotteryInfo`:
- `name`, `slug`, `totalPrizeValue` — sempre.
- `images[0]?.imageUrl` — capa cinematográfica do palco. Se ausente, usar `FALLBACK_HERO_IMAGE` (constante do componente, asset estático em `/public/images/hero-fallback.jpg`).
- `subtitle` (opcional) — descrição abaixo do título no caption do palco. Se ausente, omitir o `<p>` (não substituir por placeholder).
- `raffles[0]?.scheduledAt` — passado direto para `<CountdownClock targetIso>`. Se ausente, o `CountdownClock` retorna `null` e o painel lateral renderiza apenas numeral + progress + CTAs + selos.
- `ticketNumIni`, `ticketNumEnd` — para calcular `totalTickets`. `soldTickets` continua mockado (ver §9).
- `isFeatured` (futuro) — flag opcional.

### 8.3 Stats band — valores

**Por ora, hardcoded** (placeholder de copywriting, alinhar com compliance antes de ir para produção):

```ts
const DEFAULT_STATS: StatItem[] = [
  { key: 'distributed', label: 'Distribuídos em prêmios', prefix: 'R$ ',   value: 12_400_000 },
  { key: 'editions',    label: 'Sorteios realizados',     value: 248 },
  { key: 'winners',     label: 'Ganhadores premiados',    suffix: '+', value: 15_320 },
  { key: 'audited',     label: 'Auditado e transparente', suffix: '%', value: 100 },
];
```

**Ação**: registrar em `MOCKS.md` na raiz:
```
// MOCK: Home StatsBand — valores hardcoded até backend expor /stats/public
```

Quando o endpoint existir, expor via env ou carregá-lo em `StatsBand` com estado local (`useEffect`).

### 8.4 `FinalCta` countdown

Recebe `nextRaffleAt` (ISO). Enquanto não houver sorteio agendado: ocultar a eyebrow "Próximo sorteio em X dias" — o headline e CTAs permanecem.

---

## 9. Mocks que precisam virar dados reais

| Mock                                          | Localização                          | Quando remover                                    |
|-----------------------------------------------|--------------------------------------|---------------------------------------------------|
| Stats (4 valores)                             | `StatsBand.tsx` constante            | Backend expor `/stats/public` (rota ainda não existe) |
| Bilhetes vendidos (`sold`) do card            | `LotteryCardPremium.tsx`             | Backend expor `/lottery/{id}/ticketStats`         |
| Bilhetes vendidos (`sold`) do hero            | `HeroFeaturedLottery.tsx`            | Mesmo endpoint `/lottery/{id}/ticketStats`        |
| Imagem de fallback do hero                    | `/public/images/hero-fallback.jpg`   | Admin cadastrar imagens reais por sorteio (campo `images[0].imageUrl` já existe em `LotteryInfo`) |
| Flag `isFeatured` em `LotteryInfo`            | `HomePage.tsx` `useMemo`             | Backend adicionar campo opcional `isFeatured: boolean` em `GET /lotteries` |
| `subtitle` do sorteio em destaque             | `HeroFeaturedLottery.tsx` figcaption | Backend incluir `subtitle: string \| null` em `LotteryInfo` (opcional, descrição editorial curta) |
| Edição Nº padding                             | `String(lotteryId).padStart(3)`      | Depende de acordo de produto (pode virar campo backend) |
| Instagram URL fallback                        | `import.meta.env.VITE_INSTAGRAM_URL` | Já existe, apenas manter                          |

Registrar em `MOCKS.md` cada um com linha `// MOCK: aguarda endpoint <path>` conforme CLAUDE.md.

---

## 10. Atalhos de teclado

| Contexto          | Atalho          | Ação                             |
|-------------------|-----------------|----------------------------------|
| Carousel focado   | `←` / `→`       | Slide anterior / próximo         |
| Página inteira    | `Alt + H`       | Scroll para hero (opcional)      |
| Em qualquer CTA   | `Enter` / `Space` | Ativar (nativo)                 |

Implementar os do carousel via `onKeyDown` no wrapper. Alt+H é nice-to-have, não bloqueante.

---

## 11. Checklist de validação pré-merge

- [ ] Rota `/` renderiza hero → stats → carousel → certificate → pilares → timeline → final-cta sem sobreposição.
- [ ] 375px: sem overflow horizontal em nenhuma seção (atenção especial à grid `3` dos selos do hero — labels usam `<br/>` para evitar truncamento).
- [ ] Hero: imagem cinematográfica carrega com `loading="eager"` e respeita `aspect-ratio` (sem layout shift).
- [ ] Hero fallback: quando `openLotteries` está vazio, renderiza headline "Próximos sorteios em breve" + CTA "Ver todos" sem quebrar.
- [ ] Hero scarcity hint: só aparece quando `sold/total >= 0.80` (testar mockando 70% e 87%).
- [ ] Imagem do hero tem `alt` descritivo do prêmio (não vazio, não placeholder genérico).
- [ ] Selos do hero: 3 selos visíveis, cada um com ícone + label, contraste ≥ 4.5:1 sobre o fundo glass.
- [ ] Countdown funciona com um sorteio mock (decrementa a cada segundo, para em 0).
- [ ] Carousel navega por toque no mobile e por setas/teclado no desktop.
- [ ] Count-up das stats: valores finais legíveis após animação; screen readers anunciam `sr-only` apenas uma vez.
- [ ] `prefers-reduced-motion: reduce`: partículas somem, shimmer para, pulse para, count-up pula para valor final; layout permanece intacto.
- [ ] Focus visível (ring ouro 3px) em TODOS os CTAs, setas do carousel, cards clicáveis, links do footer.
- [ ] Lighthouse a11y ≥ 95 em mobile e desktop.
- [ ] Componentes antigos (`LotteryCarousel`, `FraudWarning`, `SecurityBlock`, `EasyToPlayBlock`) removidos do repositório + imports quebrados corrigidos.
- [ ] `MOCKS.md` atualizado com as 2 entradas de mock (stats + sold).
- [ ] Testes existentes de `apiHelpers`/`services` continuam passando (`npm test`).
- [ ] `npm run lint` limpo.
- [ ] `npm run build` produz bundle sem warnings novos.

---

## 12. Out of scope deste spec

- Não implementar endpoint `/stats/public` no backend (fora do repo).
- Não refatorar `useLottery` nem `LotteryContext`.
- Não tocar em autenticação (NAuth permanece intocado — home é pública).
- Não adicionar i18n nesta passagem (home é pt-BR hardcoded; se houver demanda de i18n, abrir feature separada).
- Não mudar roteamento — a rota `/` permanece apontando para `HomePage`.
- Não gerar imagens/ilustrações reais para os cards do carousel — o `FallbackCover` com ícone Lucide cobre o caso sem mídia; imagens reais vêm via `images[0].imageUrl` quando o admin cadastrar.

---

## 13. Referências

- Direção base: `design/wizard-vertical/{mockup.html, tokens.md, spec.md}`.
- Mockup desta home: `design/home/mockup.html` (abra em navegador; reflete 100% do layout proposto).
- Tokens novos: `design/home/tokens.md`.
- Arquitetura de componentes do projeto: `CLAUDE.md` (casing, convenções, mocks).
