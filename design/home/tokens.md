# Design Tokens — Home "Editorial Casino Noir"

Direção: **Editorial Casino Noir** — mesma direção visual do wizard vertical. A home estende os tokens já definidos em `design/wizard-vertical/tokens.md` e adiciona **somente o que é novo** para os elementos específicos desta página (hero cinematográfico, lottery cards premium, stats band, fraud certificate, how-it-works, final cta).

**Princípio inviolável**: nenhuma cor bruta nova. Todas as composições derivam de:

- `--fortuno-green-deep` `#0a2a20`
- `--fortuno-green-elegant` `#134436`
- `--fortuno-gold-intense` `#b8963f`
- `--fortuno-gold-soft` `#d4af37`
- `--fortuno-black` `#0b0b0b`
- `--fortuno-offwhite` `#ece8e1`

---

## 1. Tokens reutilizados do wizard (sem mudança)

Referência: `design/wizard-vertical/tokens.md §2` e `§3`. A home consome na íntegra:

| Token                         | Uso na home                                                |
|-------------------------------|------------------------------------------------------------|
| `--noir-bg-page`              | Fundo dark-first da página inteira                         |
| `--noir-glass-surface`        | Pilares de segurança (cards glass)                         |
| `--noir-glass-border`         | Bordas dos pilares                                         |
| `--shadow-noir-card`          | Sombra base dos cards de loteria                           |
| `--shadow-gold-focus`         | Focus ring global de TODOS os elementos interativos        |
| `--gold-divider`              | Divisores horizontais (seções, dentro do certificate)     |
| `--rail-fill`                 | Hero: barra de progresso interna dos cards                 |
| `--marker-metal-active`       | Markers da timeline "Como participar"                      |
| `--marker-metal-done`         | Ícone-box dos pilares não-featured                         |
| `--duration-fast/base/slow`   | Transições                                                  |
| `--easing-out` / `-spring`    | Transições                                                  |
| Classes Tailwind já sugeridas | `font-display`, `bg-noir-page`, `bg-noir-glass`, `shadow-noir-card`, `bg-gold-divider`, `shadow-gold-focus` |

> **Nada disso deve ser duplicado no projeto.** Se o handoff do wizard já foi implementado, a home só consome.

---

## 2. Tokens NOVOS — anexar em `src/styles/tokens.css`

```css
/* ===========================================================
   HOME — Editorial Casino Noir (tokens semânticos adicionais)
   Anexar APÓS o bloco do wizard (não substituir nada).
   =========================================================== */

/* --- Fundo cinematográfico do hero --- */
--noir-bg-hero:
  radial-gradient(800px 400px at 50% 100%, rgba(184, 150, 63, 0.18), transparent 65%),
  radial-gradient(1400px 800px at 80% 0%, rgba(212, 175, 55, 0.08), transparent 60%),
  linear-gradient(180deg, #061d17 0%, #0a2a20 55%, #07201a 100%);

/* --- Superfície "passe de cassino" (cards de loteria) --- */
--metal-casino-card:
  radial-gradient(140% 120% at 20% 0%, rgba(184, 150, 63, 0.14) 0%, transparent 45%),
  linear-gradient(180deg, rgba(19, 68, 54, 0.75) 0%, rgba(7, 32, 26, 0.85) 100%);

/* --- Sombra "card elevado" (hover do lottery card) --- */
--shadow-noir-card-hover:
  0 1px 0 rgba(255, 255, 255, 0.06) inset,
  0 40px 80px -30px rgba(0, 0, 0, 0.85),
  0 18px 36px -12px rgba(184, 150, 63, 0.35);

/* --- Divisor ouro vertical (stats band) --- */
--gold-divider-v: linear-gradient(180deg, transparent, rgba(212, 175, 55, 0.55), transparent);

/* --- Fundo do "fraud certificate" (selo oficial) --- */
--noir-certificate-bg:
  radial-gradient(1000px 400px at 50% 0%, rgba(184, 150, 63, 0.10), transparent 60%),
  linear-gradient(180deg, #0a2a20 0%, #134436 100%);

/* --- Bordas ornamentais art déco do certificate --- */
--certificate-border-outer: rgba(212, 175, 55, 0.45);
--certificate-border-inner: rgba(212, 175, 55, 0.15);

/* --- Fundo do final CTA --- */
--noir-bg-final-cta:
  radial-gradient(700px 400px at 50% 100%, rgba(212, 175, 55, 0.14), transparent 70%),
  radial-gradient(900px 500px at 20% 0%, rgba(19, 68, 54, 0.7), transparent 60%),
  linear-gradient(180deg, #07201a 0%, #0a2a20 100%);

/* --- Stats band --- */
--stats-band-bg:
  linear-gradient(180deg, rgba(11, 11, 11, 0.2), rgba(11, 11, 11, 0)),
  linear-gradient(90deg, rgba(212, 175, 55, 0.05), rgba(212, 175, 55, 0.10) 50%, rgba(212, 175, 55, 0.05));

/* --- Badge "ABERTO" live --- */
--badge-live-bg:     rgba(212, 175, 55, 0.12);
--badge-live-border: rgba(212, 175, 55, 0.45);
--badge-live-dot:    #e7c05c;

/* ===========================================================
   HERO FEATURED LOTTERY — vitrine cinematográfica do sorteio
   (tokens específicos do HeroFeaturedLottery, refator pós-aprovação)
   =========================================================== */

/* --- Palco (wrapper da imagem wide): border + sombra + base dark --- */
--hero-stage-bg:       #050f0c;
--hero-stage-border:   rgba(212, 175, 55, 0.32);
--hero-stage-frame:    rgba(212, 175, 55, 0.22);
--shadow-hero-stage:
  0 1px 0 rgba(255, 255, 255, 0.05) inset,
  0 50px 100px -40px rgba(0, 0, 0, 0.85),
  0 24px 48px -18px rgba(0, 0, 0, 0.6);

/* --- Tratamento cinematográfico: gradient bottom-up + vinheta --- */
--hero-stage-overlay:
  linear-gradient(180deg,
    rgba(7, 32, 26, 0.10) 0%,
    rgba(6, 21, 17, 0.05) 35%,
    rgba(6, 21, 17, 0.55) 70%,
    rgba(5, 15, 12, 0.92) 100%),
  radial-gradient(120% 90% at 50% 50%,
    transparent 50%,
    rgba(0, 0, 0, 0.55) 100%);

/* --- Grão fino editorial sobre a imagem --- */
--hero-stage-grain:
  radial-gradient(rgba(236, 232, 225, 0.6) 1px, transparent 1px);

/* --- Painel lateral de informação/ação --- */
--hero-panel-bg:
  linear-gradient(180deg, rgba(19, 68, 54, 0.55), rgba(7, 32, 26, 0.65)),
  radial-gradient(120% 100% at 0% 0%, rgba(212, 175, 55, 0.08), transparent 55%);
--hero-panel-border: rgba(212, 175, 55, 0.28);
--shadow-hero-panel:
  0 1px 0 rgba(255, 255, 255, 0.05) inset,
  0 30px 60px -30px rgba(0, 0, 0, 0.7);

/* --- Selos de credibilidade (glass micro-bordas ouro) --- */
--hero-seal-bg:
  linear-gradient(180deg, rgba(7, 32, 26, 0.55), rgba(7, 32, 26, 0.30));
--hero-seal-bg-hover:
  linear-gradient(180deg, rgba(7, 32, 26, 0.70), rgba(7, 32, 26, 0.45));
--hero-seal-border:       rgba(212, 175, 55, 0.28);
--hero-seal-border-hover: rgba(212, 175, 55, 0.55);

/* --- Scarcity hint (pulsa em ouro claro quando >= 80% vendido) --- */
--scarcity-color:     #f0d27a;
--scarcity-pulse-rgb: 240, 210, 122;

/* --- Fallback hero (quando não há sorteio em destaque) --- */
--hero-fallback-bg:
  radial-gradient(600px 300px at 50% 100%, rgba(212, 175, 55, 0.12), transparent 70%),
  linear-gradient(180deg, rgba(19, 68, 54, 0.6), rgba(7, 32, 26, 0.85));
--hero-fallback-border: rgba(212, 175, 55, 0.35);
```

---

## 3. Extensão de `tailwind.config.js` (merge, NÃO substituir)

Adicionar dentro do `theme.extend` existente (o wizard já adicionou `boxShadow`, `backgroundImage`, `keyframes`, `animation` — apenas acrescente as chaves novas abaixo):

```js
// tailwind.config.js — theme.extend (merge com o que o wizard já adicionou)
boxShadow: {
  // ...wizard
  'noir-card-hover': 'var(--shadow-noir-card-hover)',
  'hero-stage':      'var(--shadow-hero-stage)',
  'hero-panel':      'var(--shadow-hero-panel)',
},
backgroundImage: {
  // ...wizard
  'noir-hero':       'var(--noir-bg-hero)',
  'noir-final':      'var(--noir-bg-final-cta)',
  'noir-cert':       'var(--noir-certificate-bg)',
  'stats-band':      'var(--stats-band-bg)',
  'metal-casino':    'var(--metal-casino-card)',
  'gold-divider-v':  'var(--gold-divider-v)',
  'hero-overlay':    'var(--hero-stage-overlay)',
  'hero-grain':      'var(--hero-stage-grain)',
  'hero-panel':      'var(--hero-panel-bg)',
  'hero-seal':       'var(--hero-seal-bg)',
  'hero-seal-hover': 'var(--hero-seal-bg-hover)',
  'hero-fallback':   'var(--hero-fallback-bg)',
},
keyframes: {
  // ...wizard
  'live-pulse': {
    '0%':   { boxShadow: '0 0 0 0 rgba(212,175,55,0.65)' },
    '70%':  { boxShadow: '0 0 0 8px rgba(212,175,55,0)' },
    '100%': { boxShadow: '0 0 0 0 rgba(212,175,55,0)' },
  },
  'progress-shimmer': {
    '0%':   { left: '-40%' },
    '100%': { left: '110%' },
  },
  'numeral-shimmer': {
    '0%, 20%': { backgroundPosition: '-200% 0', opacity: '0' },
    '40%':     { opacity: '0.9' },
    '65%':     { opacity: '0.6' },
    '100%':    { backgroundPosition: '200% 0', opacity: '0' },
  },
  'particle-float': {
    '0%':   { transform: 'translateY(0) scale(1)', opacity: '0' },
    '10%':  { opacity: '0.7' },
    '70%':  { opacity: '0.5' },
    '100%': { transform: 'translateY(-120vh) scale(0.4)', opacity: '0' },
  },
},
animation: {
  // ...wizard
  'live-pulse':       'live-pulse 1.8s ease-in-out infinite',
  'progress-shimmer': 'progress-shimmer 2.4s ease-in-out infinite',
  'numeral-shimmer':  'numeral-shimmer 4.8s ease-in-out infinite',
  'particle-float':   'particle-float 14s linear infinite',
},
```

`tailwindcss-animate` continua suficiente para `animate-in/fade-in/slide-in-from-*`. Os keyframes acima são exclusivos da home e não conflitam com os do wizard.

---

## 4. Class map sugerido (componentes da home)

| Papel                          | Classes Tailwind                                                                                            |
|--------------------------------|-------------------------------------------------------------------------------------------------------------|
| Fundo da home                  | `bg-noir-page text-fortuno-offwhite min-h-screen`                                                          |
| Fundo do hero                  | `bg-noir-hero relative overflow-hidden`                                                                     |
| Palco wide (imagem)            | `relative overflow-hidden rounded-3xl border border-[color:var(--hero-stage-border)] shadow-hero-stage bg-[color:var(--hero-stage-bg)] aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9]` |
| Overlay cinematográfico        | `absolute inset-0 bg-hero-overlay pointer-events-none z-[1]`                                               |
| Grão editorial                 | `absolute inset-0 bg-hero-grain [background-size:3px_3px] mix-blend-overlay opacity-[0.08] pointer-events-none z-[2]` |
| Filete ouro interno do palco   | `absolute inset-[10px] rounded-[18px] border border-[color:var(--hero-stage-frame)] pointer-events-none z-[3]` |
| Caption sobre a imagem         | `absolute inset-x-0 bottom-0 p-7 md:p-11 z-[4] flex flex-col gap-2.5 [text-shadow:0_6px_30px_rgba(0,0,0,0.65)]` |
| Painel lateral info/ação       | `bg-hero-panel border border-[color:var(--hero-panel-border)] rounded-[22px] p-7 md:p-9 backdrop-blur-md shadow-hero-panel flex flex-col` |
| Grid selos (3 col)             | `grid grid-cols-3 gap-2.5`                                                                                 |
| Selo individual                | `flex flex-col items-center justify-center text-center gap-2 py-3 px-2 rounded-xl bg-hero-seal border border-[color:var(--hero-seal-border)] backdrop-blur-md transition-all duration-noir-base hover:bg-hero-seal-hover hover:border-[color:var(--hero-seal-border-hover)] hover:-translate-y-px` |
| Label do selo                  | `text-[10px] font-semibold tracking-[0.16em] uppercase text-fortuno-offwhite/80 leading-[1.25]`            |
| Scarcity hint (>=80%)          | `inline-flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase text-[color:var(--scarcity-color)] font-bold` |
| Scarcity dot pulsante          | `w-1.5 h-1.5 rounded-full bg-[color:var(--scarcity-color)] animate-live-pulse`                             |
| Fallback hero (sem destaque)   | `bg-hero-fallback border border-dashed border-[color:var(--hero-fallback-border)] rounded-3xl p-16 text-center` |
| Fundo do final CTA             | `bg-noir-final relative overflow-hidden border-y border-fortuno-gold-soft/20`                               |
| Certificate (fraud)            | `bg-noir-cert rounded-3xl relative overflow-hidden`                                                         |
| Stats band                     | `bg-stats-band border-y border-fortuno-gold-soft/15`                                                        |
| Lottery card (wrapper)         | `bg-metal-casino border border-fortuno-gold-soft/30 rounded-[20px] overflow-hidden shadow-noir-card hover:shadow-noir-card-hover hover:-translate-y-1.5 transition-all duration-noir-base ease-noir-spring` |
| Badge "ABERTO"                 | `inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.22em] bg-[var(--badge-live-bg)] border border-[var(--badge-live-border)] text-fortuno-gold-soft` |
| Dot pulsante do badge          | `w-1.5 h-1.5 rounded-full bg-[var(--badge-live-dot)] animate-live-pulse`                                   |
| Numeral editorial ouro         | `font-display italic font-extrabold leading-[0.88] bg-gradient-to-b from-fortuno-gold-soft via-fortuno-gold-intense to-fortuno-gold-intense/25 bg-clip-text text-transparent` |
| Stat num (band)                | Idem acima + `text-[clamp(36px,5.5vw,64px)] font-variant-numeric-tabular`                                  |
| Divisor vertical entre stats   | `w-px self-stretch bg-gold-divider-v hidden md:block`                                                      |
| Progress rail                  | `h-1.5 w-full rounded-full bg-fortuno-offwhite/10 overflow-hidden relative`                                |
| Progress fill                  | `h-full bg-gradient-to-r from-fortuno-gold-soft to-fortuno-gold-intense shadow-[0_0_10px_rgba(212,175,55,0.45)] relative` |
| Timeline marker                | `w-18 h-18 rounded-full bg-marker-active text-fortuno-black border border-white/35 shadow-noir-marker-on grid place-items-center` |
| Focus ring global              | `focus-visible:outline-none focus-visible:shadow-gold-focus`                                                |

---

## 5. Acessibilidade — checks específicos da home

- **Imagem cinematográfica do hero**: `alt` descritivo do prêmio (ex.: "Porsche 911 prateado em ângulo dramático, prêmio do sorteio em destaque"). Nunca usar `alt=""` — é conteúdo semântico (vitrine do prêmio), não decoração.
- **Texto sobre imagem** (caption do palco): título + descrição têm `text-shadow: 0 6px 30px rgba(0,0,0,0.65)` combinado com gradient overlay bottom-up que chega a 92% de opacidade na base, garantindo contraste `offwhite` ≥ 7:1 mesmo sobre zonas claras da foto. Teste obrigatório: substituir a imagem por uma completamente branca e verificar legibilidade — o overlay deve manter o texto legível.
- **Countdown** (`role="timer"` + `aria-live="polite"` + `aria-atomic="true"`): anuncia apenas o valor final descritivo via `<span class="sr-only">` ("2 dias, 14 horas, 36 minutos e 52 segundos"). Os números visuais atualizam a cada 1s, mas screen readers recebem **throttle por minuto** na implementação React — evita fala incessante.
- **Progress bar** (`role="progressbar"` + `aria-valuenow/min/max` + `aria-label`): porcentagem comunicada numericamente. Scarcity hint "Últimos bilhetes" tem ícone + texto — nunca só cor.
- **Selos de credibilidade**: cada selo tem `role="listitem"` dentro de `role="list"`; label textual em `<span>` legível (não só ícone). Contraste `offwhite/0.78` sobre superfície glass `rgba(7,32,26,0.55)` → > 9:1.
- **Gold-soft sobre gradients escuros do hero**: contraste mínimo 6.8:1, OK para heading e microcopy a partir de 14px semibold.
- **Badge "ABERTO"**: `gold-soft` sobre superfície glass `rgba(212,175,55,0.12)` → contraste limpo com body background (calculado > 7:1). Nunca depender SÓ do dot pulsante; o texto "Aberto" é o indicador primário.
- **Stats numerais**: usar `font-variant-numeric: tabular-nums` para números não "dançarem" entre breakpoints.
- **Count-up**: é puramente visual (CSS `@property`). Screen readers recebem o valor final via `<span class="sr-only">` (ver mockup). Isso evita ler "0, 1, 2, 3..." para usuários assistivos.
- **Particles do hero**: `aria-hidden="true"` + desligadas sob `prefers-reduced-motion`.
- **Certificate watermark**: `aria-hidden="true"`; é decoração pura.
- **Timeline horizontal**: no mobile vira vertical (markers à esquerda do texto); o `<ol>` semântico permanece.

---

## 6. Respeito a `prefers-reduced-motion`

Idem regra global do wizard (já em `index.css`). A home adiciona:

```css
@media (prefers-reduced-motion: reduce) {
  .hero-particles { display: none; }
  /* Count-up do stats band: pula direto para o valor final via `counter-reset: num <target>` no `@media` */
}
```

Shimmer do numeral, live-pulse do badge, progress-shimmer, numeral-shimmer, particle-float → todos desligados automaticamente pela regra `*` global já declarada.

Estados visuais preservados: badges continuam legíveis, progress bars continuam preenchidas, numerais continuam visíveis (só perdem o "pisca" decorativo).

---

## 7. Referências cruzadas

- Wizard: `design/wizard-vertical/tokens.md` (tokens base) e `design/wizard-vertical/spec.md` (contratos de acessibilidade já estabelecidos).
- Mockup desta home: `design/home/mockup.html` (preview standalone, reutiliza os mesmos CSS vars via bloco `<style>` local).
- Spec de implementação: `design/home/spec.md`.
