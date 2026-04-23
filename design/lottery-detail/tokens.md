# Design Tokens — Lottery Detail "Editorial Casino Noir"

Direção: **Editorial Casino Noir**, em **variante de superfície clara** (mesma família do dashboard). Esta página é pública, de conversão — visitante chega aqui e decide se compra. O fundo do conteúdo é claro (`--dash-bg-page`), com cards brancos, acentos ouro e modais paper.

**Princípio inviolável**: nenhuma cor bruta nova. Todas as composições derivam de:

- `--fortuno-green-deep` `#0a2a20`
- `--fortuno-green-elegant` `#134436`
- `--fortuno-gold-intense` `#b8963f`
- `--fortuno-gold-soft` `#d4af37`
- `--fortuno-black` `#0b0b0b`
- `--fortuno-offwhite` `#ece8e1`

---

## 1. Tokens REUTILIZADOS — não duplicar

Esta página NÃO redeclara nada do que já está em `wizard-vertical/tokens.md`, `home/tokens.md` e `dashboard/tokens.md`. Os blocos abaixo só anexam **o que é novo**. Reuso direto:

### Do wizard

| Token | Uso aqui |
|-------|----------|
| `--shadow-gold-focus` | Focus ring global de TODOS os interativos |
| `--gold-divider` | Divisor ouro horizontal (footer band) |
| `--duration-fast` / `-base` / `-slow` | Transições |
| `--easing-out` / `--easing-spring` | Transições |
| Classes Tailwind: `font-display`, `shadow-gold-focus` | Tudo já configurado |

### Da home

| Token | Uso aqui |
|-------|----------|
| `--badge-live-bg` / `--badge-live-border` / `--badge-live-dot` | Badge "ABERTO" no palco do hero |
| Keyframe `live-pulse` | Dot pulsante do badge |
| Primitivo `GoldNumeral` (componente React) | **Reutilizar** dentro do `LotteryHero` para o numeral do prêmio (gradient termina opaco, não fade — é body claro) |

### Do dashboard (light body)

| Token | Uso aqui |
|-------|----------|
| `--dash-bg-page` | Fundo do `<main>` da rota `/sorteios/:slug` |
| `--card-paper-bg`, `--card-paper-border`, `--card-paper-border-hover` | Cards brancos sobre paper (descrição editorial, raffle cards, prize cards, checkout panel) |
| `--shadow-paper`, `--shadow-paper-hover` | Sombras dos cards |
| `--card-gold-bar` | Linha ouro 1px no topo de cada card paper |
| `--gold-divider-soft` | Divisor ouro suave dentro dos cards |
| `--stat-numeral-gradient` | Numeral do total no recibo (anchor verde-elegant para legibilidade sobre paper) |
| `--topbar-bg`, `--topbar-border-bottom`, `--nav-item-active-*`, `--user-trigger-*` | Topbar global (`Header.tsx`) — não tocar, é o mesmo do dashboard |
| `--dash-footer-band-bg` | Footer band (`Footer.tsx` global) |
| `--dropdown-bg`, `--dropdown-border`, `--dropdown-shadow`, `--dropdown-divider` | **Base visual herdada** pelos modais (paper claro, borda ouro, sombra noir) |
| Keyframe `user-menu-open` | **NÃO** reusar para modais — substituído por `modal-pop` (escala maior, transform diferente). User-menu permanece para o dropdown. |
| Classe `cta-primary` (compact) | Botão "Baixar PDF" do modal (mesma pílula ouro) |

> **Política de reuso**: se for tentado redeclarar qualquer token acima em `tokens.css` para a lottery-detail, **abortar**. A direção visual depende da continuidade — drift visual entre dashboard e lottery-detail descaracteriza o sistema.

---

## 2. Tokens NOVOS — anexar em `src/styles/tokens.css`

```css
/* ===========================================================
   LOTTERY DETAIL — Editorial Casino Noir (variante light body)
   Anexar APÓS os blocos do wizard, home e dashboard.
   =========================================================== */

/* --- 2.1 PALCO COMPACTO (hero da página de detalhe) ---
   Variação compacta do --hero-stage-* da home: aspect-ratio 16:9 / 21:9,
   sombra reduzida ~25%, filete interno mais sutil. Reusa overlay e grain
   da home (mesma fórmula), mas com tokens próprios para permitir
   evolução sem mexer no hero da home. */
--stage-compact-bg:       #050f0c;
--stage-compact-border:   rgba(212, 175, 55, 0.30);
--stage-compact-frame:    rgba(212, 175, 55, 0.18);
--shadow-stage-compact:
  0 1px 0 rgba(255, 255, 255, 0.05) inset,
  0 36px 76px -32px rgba(0, 0, 0, 0.78),
  0 18px 36px -16px rgba(0, 0, 0, 0.55);
--stage-compact-overlay:
  linear-gradient(180deg,
    rgba(7, 32, 26, 0.10) 0%,
    rgba(6, 21, 17, 0.05) 35%,
    rgba(6, 21, 17, 0.55) 70%,
    rgba(5, 15, 12, 0.92) 100%),
  radial-gradient(120% 90% at 50% 50%,
    transparent 50%,
    rgba(0, 0, 0, 0.55) 100%);
--stage-compact-grain:
  radial-gradient(rgba(236, 232, 225, 0.6) 1px, transparent 1px);

/* --- 2.2 PÍLULA OURO OUTLINE (CTAs Regras / Política sobre o palco) --- */
--pill-outline-bg:           rgba(7, 32, 26, 0.55);
--pill-outline-bg-hover:     rgba(7, 32, 26, 0.75);
--pill-outline-border:       rgba(212, 175, 55, 0.45);
--pill-outline-border-hover: rgba(212, 175, 55, 0.75);

/* --- 2.3 RECIBO (dentro do CheckoutPanel) ---
   Superfície papel quente + borda dashed ouro + furos laterais
   simulando ticket perfurado (ornamental; pseudo-elementos do componente). */
--receipt-bg:       #fbf7ee;
--receipt-border:   rgba(184, 150, 63, 0.40);
--receipt-shadow:
  0 1px 0 rgba(255, 255, 255, 0.85) inset,
  0 14px 28px -18px rgba(10, 42, 32, 0.22),
  0 5px 10px -4px rgba(184, 150, 63, 0.18);
--receipt-divider:
  repeating-linear-gradient(90deg,
    rgba(184, 150, 63, 0.55) 0 5px,
    transparent 5px 9px);
--receipt-corner: rgba(184, 150, 63, 0.55);

/* --- 2.4 COMBO PACK CARD (Bronze / Prata / Ouro) ---
   Variação clara do "metal-casino" da home: gradient suave branco→paper,
   medalha radial-gradient, ring ouro pulsante quando ativo. */
--combo-card-bg:
  linear-gradient(180deg, #ffffff 0%, #fbf7ee 100%);
--combo-card-border:        rgba(184, 150, 63, 0.30);
--combo-card-border-active: var(--fortuno-gold-intense);
--combo-card-shadow:
  0 1px 0 rgba(255, 255, 255, 0.9) inset,
  0 8px 18px -14px rgba(10, 42, 32, 0.20),
  0 2px 6px -2px rgba(184, 150, 63, 0.10);
--combo-card-shadow-hover:
  0 1px 0 rgba(255, 255, 255, 0.95) inset,
  0 16px 30px -18px rgba(10, 42, 32, 0.30),
  0 6px 12px -4px rgba(184, 150, 63, 0.30);
--combo-active-ring: 0 0 0 3px rgba(212, 175, 55, 0.45);

/* --- 2.5 PRIZE BADGE (numeral de posição "1º LUGAR") --- */
--prize-badge-bg:
  linear-gradient(180deg, #fff6d6 0%, #f0e3b8 100%);
--prize-badge-border: rgba(184, 150, 63, 0.55);

/* --- 2.6 MODAL — paper + borda ouro + sombra noir ---
   Mesma família visual do dropdown UserMenu, escalada (sombra maior,
   borda 1px mais clara, max-width 640px). */
--modal-bg:      #fbf7ee;
--modal-border:  rgba(184, 150, 63, 0.45);
--modal-shadow:
  0 2px 0 rgba(255, 255, 255, 0.6) inset,
  0 50px 100px -30px rgba(10, 42, 32, 0.55),
  0 24px 40px -12px rgba(184, 150, 63, 0.28),
  0 0 0 1px rgba(184, 150, 63, 0.10);
--modal-overlay: rgba(5, 15, 12, 0.62);
--modal-divider: linear-gradient(90deg,
  transparent,
  rgba(184, 150, 63, 0.35) 15%,
  rgba(184, 150, 63, 0.55) 50%,
  rgba(184, 150, 63, 0.35) 85%,
  transparent);

/* --- 2.7 STICKY CTA mobile (rodapé do checkout em mobile) --- */
--sticky-cta-bg:
  linear-gradient(180deg, rgba(251, 247, 238, 0.92), rgba(251, 247, 238, 0.98));
--sticky-cta-border: rgba(184, 150, 63, 0.35);
```

---

## 3. Extensão de `tailwind.config.js` (merge incremental)

Acrescentar dentro do `theme.extend` existente. Tudo abaixo é **adicional** — não substituir o que wizard/home/dashboard já adicionaram.

```js
// tailwind.config.js — theme.extend (merge)
boxShadow: {
  // ...wizard, ...home, ...dashboard
  'stage-compact':     'var(--shadow-stage-compact)',
  'receipt':           'var(--receipt-shadow)',
  'combo-card':        'var(--combo-card-shadow)',
  'combo-card-hover':  'var(--combo-card-shadow-hover)',
  'modal':             'var(--modal-shadow)',
},
backgroundImage: {
  // ...wizard, ...home, ...dashboard
  'stage-compact-overlay': 'var(--stage-compact-overlay)',
  'stage-compact-grain':   'var(--stage-compact-grain)',
  'combo-card':            'var(--combo-card-bg)',
  'prize-badge':           'var(--prize-badge-bg)',
  'modal-divider':         'var(--modal-divider)',
  'receipt-divider':       'var(--receipt-divider)',
  'sticky-cta':            'var(--sticky-cta-bg)',
},
keyframes: {
  // ...wizard, ...home, ...dashboard
  'modal-fade': {
    '0%':   { opacity: '0' },
    '100%': { opacity: '1' },
  },
  'modal-pop': {
    '0%':   { opacity: '0', transform: 'scale(0.96) translateY(8px)' },
    '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
  },
  'combo-ring-pulse': {
    '0%, 100%': { boxShadow: 'var(--combo-card-shadow-hover), 0 0 0 3px rgba(212,175,55,0.45)' },
    '50%':      { boxShadow: 'var(--combo-card-shadow-hover), 0 0 0 5px rgba(212,175,55,0.20)' },
  },
},
animation: {
  // ...wizard, ...home, ...dashboard
  'modal-fade':       'modal-fade 200ms cubic-bezier(0.22, 1, 0.36, 1)',
  'modal-pop':        'modal-pop 220ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
  'combo-ring-pulse': 'combo-ring-pulse 2.4s ease-in-out infinite',
},
```

`live-pulse` (badge ABERTO) já vem do bloco da home — não redeclarar.

---

## 4. Class map sugerido (componentes da lottery-detail)

| Papel | Classes Tailwind |
|-------|------------------|
| `<main>` da rota | `min-h-screen bg-dash-page text-fortuno-black` |
| Hero wrapper | `relative z-10 mx-auto max-w-7xl px-4 md:px-6 pt-8 md:pt-10 pb-8` |
| Palco compacto (figure) | `relative overflow-hidden rounded-[22px] border border-[color:var(--stage-compact-border)] bg-[color:var(--stage-compact-bg)] shadow-stage-compact aspect-[16/9] lg:aspect-[21/9]` |
| Stage image | `absolute inset-0 w-full h-full object-cover z-0` |
| Stage overlay | `absolute inset-0 bg-stage-compact-overlay pointer-events-none z-[1]` |
| Stage grain | `absolute inset-0 bg-stage-compact-grain [background-size:3px_3px] mix-blend-overlay opacity-[0.08] pointer-events-none z-[2]` |
| Stage frame interno | `absolute inset-[10px] rounded-2xl border border-[color:var(--stage-compact-frame)] pointer-events-none z-[3]` |
| Stage caption | `absolute inset-x-0 bottom-0 z-[4] flex flex-col gap-3 p-[clamp(20px,4vw,40px)] [text-shadow:0_6px_30px_rgba(0,0,0,0.65)] text-fortuno-offwhite` |
| Stage top row (badge + countdown) | `absolute top-4 left-4 right-4 z-[4] flex justify-between items-start gap-3 flex-wrap` |
| Pílula ouro outline | `inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[color:var(--pill-outline-bg)] border border-[color:var(--pill-outline-border)] text-fortuno-gold-soft text-xs font-semibold tracking-wide backdrop-blur-md transition-all duration-noir-fast hover:bg-[color:var(--pill-outline-bg-hover)] hover:border-[color:var(--pill-outline-border-hover)] hover:-translate-y-px focus-visible:outline-none focus-visible:shadow-gold-focus min-h-[44px]` |
| Numeral do prêmio (hero) | `font-display italic font-extrabold leading-[0.92] tracking-[-0.03em] bg-gradient-to-b from-fortuno-gold-soft via-fortuno-gold-intense to-fortuno-gold-intense/40 bg-clip-text text-transparent text-[clamp(40px,6vw,72px)] tabular-nums` |
| Countdown wrapper | `inline-flex items-stretch gap-2 px-3 py-2 rounded-xl bg-[rgba(7,32,26,0.55)] border border-fortuno-gold-soft/30 backdrop-blur-md` |
| Countdown num | `font-display italic font-bold text-[22px] leading-none text-fortuno-gold-soft tabular-nums` |
| Countdown label | `text-[8px] font-semibold tracking-[0.20em] uppercase text-fortuno-offwhite/65 mt-1` |
| Layout grid (desktop 2 col) | `grid lg:grid-cols-[1.55fr_1fr] gap-7` |
| Editorial wrapper (descrição) | `relative bg-white border border-[color:var(--card-paper-border)] rounded-[20px] shadow-paper p-[clamp(28px,4vw,48px)] before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-px before:bg-card-gold-bar` |
| Editorial lede (capitular) | `text-[15px] leading-[1.75] text-fortuno-black/78 [&::first-letter]:font-display [&::first-letter]:font-extrabold [&::first-letter]:italic [&::first-letter]:text-[4.6em] [&::first-letter]:float-left [&::first-letter]:leading-[0.85] [&::first-letter]:py-1 [&::first-letter]:pr-3 [&::first-letter]:bg-gradient-to-b [&::first-letter]:from-fortuno-gold-soft [&::first-letter]:to-fortuno-gold-intense [&::first-letter]:bg-clip-text [&::first-letter]:text-transparent` (alternativa: usar utilitário do `tailwindcss/typography` ou classe global `.editorial`) |
| Section title (eyebrow + h2) | `flex items-baseline gap-3 flex-wrap mb-[18px]` |
| H2 display | `font-display font-bold text-fortuno-black leading-[1.1] tracking-[-0.01em] text-[clamp(24px,2.6vw,32px)]` |
| Eyebrow gold | `text-[10px] font-semibold tracking-[0.26em] uppercase text-fortuno-gold-intense` |
| Eyebrow base | `text-[10px] font-semibold tracking-[0.26em] uppercase text-fortuno-black/55` |
| Raffle card (button) | `relative grid grid-cols-[auto_1fr_auto] items-center gap-[18px] p-[18px_22px] bg-white border border-[color:var(--card-paper-border)] rounded-2xl shadow-paper w-full text-left transition-all duration-noir-base ease-noir-spring hover:-translate-y-0.5 hover:border-[color:var(--card-paper-border-hover)] hover:shadow-paper-hover focus-visible:outline-none focus-visible:shadow-paper-hover focus-visible:ring-[3px] focus-visible:ring-fortuno-gold-soft/55 before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-px before:bg-card-gold-bar before:opacity-70` |
| Raffle marker (numeral medalha) | `relative w-14 h-14 rounded-full bg-[radial-gradient(120%_120%_at_30%_20%,rgba(212,175,55,0.95),rgba(184,150,63,0.55)_60%,rgba(7,32,26,0.55)_100%)] border-2 border-white/55 shadow-[0_0_0_1px_rgba(184,150,63,0.45),0_6px_14px_-4px_rgba(184,150,63,0.45),inset_0_1px_0_rgba(255,255,255,0.5)] grid place-items-center font-display italic font-extrabold text-lg text-fortuno-black tracking-[-0.01em]` |
| Raffle name | `font-display font-bold text-lg text-fortuno-black leading-tight tracking-[-0.01em]` |
| Raffle meta row | `flex flex-wrap gap-x-3.5 gap-y-1 text-xs text-fortuno-black/62 mt-1 items-center` |
| Open arrow (raffle card) | `w-9 h-9 rounded-full border border-fortuno-gold-intense/35 bg-fortuno-gold-intense/8 grid place-items-center text-fortuno-gold-intense transition-all duration-noir-fast ease-noir-spring group-hover:bg-fortuno-gold-soft group-hover:text-fortuno-black group-hover:-rotate-45 shrink-0` (envolver o card num `group`) |
| Prize card (button) | `relative flex flex-col gap-3 p-[18px] bg-white border border-[color:var(--card-paper-border)] rounded-2xl shadow-paper w-full text-left min-h-[168px] transition-all duration-noir-base ease-noir-spring hover:-translate-y-0.5 hover:border-[color:var(--card-paper-border-hover)] hover:shadow-paper-hover focus-visible:outline-none focus-visible:shadow-paper-hover focus-visible:ring-[3px] focus-visible:ring-fortuno-gold-soft/55 before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-px before:bg-card-gold-bar before:opacity-70` |
| Prize position badge | `inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-prize-badge border border-[color:var(--prize-badge-border)] self-start font-display italic font-extrabold text-xs leading-none tracking-wide text-fortuno-green-deep` |
| Prize position ord (1º/2º/...) | `text-base bg-gradient-to-b from-fortuno-gold-soft to-fortuno-gold-intense bg-clip-text text-transparent` |
| Prize description | `text-sm leading-snug text-fortuno-black font-semibold flex-1` |
| Prize source chip | `inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-fortuno-green-elegant/[0.06] border border-fortuno-green-elegant/[0.12] text-[10px] text-fortuno-green-elegant font-semibold tracking-wide self-start` |
| Combo card | `relative flex flex-col gap-3 p-[22px] bg-combo-card border-[1.5px] border-[color:var(--combo-card-border)] rounded-[18px] shadow-combo-card text-left transition-all duration-noir-base ease-noir-spring hover:-translate-y-0.5 hover:shadow-combo-card-hover focus-visible:outline-none focus-visible:shadow-combo-card-hover focus-visible:ring-[3px] focus-visible:ring-fortuno-gold-soft/55 cursor-pointer overflow-hidden` |
| Combo card active | adicionar: `border-[color:var(--combo-card-border-active)] shadow-combo-card-hover animate-combo-ring-pulse` |
| Combo medal (gold) | `inline-flex items-center justify-center w-9 h-9 rounded-full bg-[radial-gradient(120%_120%_at_30%_20%,rgba(212,175,55,0.95),rgba(184,150,63,0.55)_60%,rgba(7,32,26,0.55)_100%)] border-2 border-white/55 shadow-[0_0_0_1px_rgba(184,150,63,0.45),inset_0_1px_0_rgba(255,255,255,0.5)] text-fortuno-black` |
| Combo medal (bronze) | substituir background por `bg-[radial-gradient(120%_120%_at_30%_20%,#d59a6a,#a96f3f_60%,#4d3017_100%)]` |
| Combo medal (silver) | substituir background por `bg-[radial-gradient(120%_120%_at_30%_20%,#f0f0f0,#b8b8b8_60%,#5a5a5a_100%)]` |
| Combo discount badge | `inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-fortuno-gold-intense text-fortuno-black text-xs font-bold tracking-wide self-start shadow-[0_4px_10px_-4px_rgba(184,150,63,0.55)]` (active: `bg-fortuno-gold-soft`) |
| Check stamp (combo active) | `absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-fortuno-gold-soft text-fortuno-black grid place-items-center transition-all duration-noir-base ease-noir-spring opacity-0 scale-[0.6] data-[active=true]:opacity-100 data-[active=true]:scale-100` |
| Checkout panel | `relative bg-white border border-[color:var(--card-paper-border)] rounded-[22px] shadow-paper p-6 before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-px before:bg-card-gold-bar` |
| Qty row | `grid grid-cols-[auto_1fr] gap-3.5 items-center p-4 bg-fortuno-gold-intense/[0.06] border border-fortuno-gold-intense/[0.18] rounded-[14px] mb-[18px]` |
| Qty input | `w-[88px] h-12 text-center font-display italic font-bold text-[22px] text-fortuno-black bg-white border-[1.5px] border-fortuno-gold-intense/35 rounded-[10px] tabular-nums focus-visible:outline-none focus-visible:border-fortuno-gold-intense focus-visible:ring-[3px] focus-visible:ring-fortuno-gold-soft/35` |
| Qty slider | utilizar `class="qty-slider"` global (CSS custom para `::-webkit-slider-thumb` — definir em `src/styles/lottery-detail.css` com fórmula do mockup) |
| Receipt | `relative bg-receipt-bg border border-dashed border-[color:var(--receipt-border)] rounded-[14px] p-[20px_22px] shadow-receipt before:content-[''] before:absolute before:top-1/2 before:left-[-8px] before:-translate-y-1/2 before:w-3.5 before:h-3.5 before:rounded-full before:bg-dash-page before:border before:border-dashed before:border-[color:var(--receipt-border)] after:content-[''] after:absolute after:top-1/2 after:right-[-8px] after:-translate-y-1/2 after:w-3.5 after:h-3.5 after:rounded-full after:bg-dash-page after:border after:border-dashed after:border-[color:var(--receipt-border)]` |
| Receipt row | `flex items-center justify-between py-2.5 text-[13px] text-fortuno-black/78` |
| Receipt row total | `font-display italic font-bold text-2xl text-fortuno-black leading-none tracking-[-0.01em]` |
| Receipt divider (dashed) | `h-px bg-receipt-divider [background-size:9px_1px] my-1.5` |
| Receipt divider (strong) | `h-px bg-gold-divider-soft my-3` |
| CTA buy (botão principal) | `w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-[radial-gradient(120%_120%_at_30%_20%,var(--fortuno-gold-soft),var(--fortuno-gold-intense)_80%)] text-fortuno-black font-display italic font-extrabold text-[17px] tracking-[-0.01em] shadow-[0_12px_28px_-8px_rgba(212,175,55,0.55),0_1px_0_rgba(255,255,255,0.45)_inset] transition-all duration-noir-fast ease-noir-spring hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-[4px] focus-visible:ring-fortuno-gold-soft/55 min-h-[56px]` |
| Sticky CTA mobile | `lg:hidden sticky bottom-0 z-30 bg-sticky-cta border-t border-[color:var(--sticky-cta-border)] backdrop-blur-md px-4 py-3 [padding-bottom:calc(env(safe-area-inset-bottom,12px)+12px)] shadow-[0_-10px_24px_-16px_rgba(10,42,32,0.25)]` |

### Modais

| Papel | Classes Tailwind |
|-------|------------------|
| Overlay | `fixed inset-0 z-[80] bg-modal-overlay backdrop-blur-[4px] grid place-items-center p-6 animate-modal-fade` |
| Modal container | `relative w-full max-w-[640px] max-h-[min(86vh,760px)] bg-modal-bg border border-[color:var(--modal-border)] rounded-[20px] shadow-modal overflow-hidden flex flex-col animate-modal-pop before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-px before:bg-card-gold-bar before:opacity-95` |
| Modal header | `relative grid grid-cols-[auto_1fr_auto] items-center gap-3.5 px-6 pt-[22px] pb-[18px] after:content-[''] after:absolute after:left-6 after:right-6 after:bottom-0 after:h-px after:bg-modal-divider` |
| Modal icon (gold square) | `w-11 h-11 rounded-xl bg-fortuno-gold-intense/[0.12] border border-fortuno-gold-intense/[0.32] text-fortuno-gold-intense grid place-items-center` |
| Modal eyebrow | `text-[9px] font-semibold tracking-[0.26em] uppercase text-fortuno-gold-intense leading-none mb-1` |
| Modal title | `font-display font-bold text-[22px] text-fortuno-black leading-[1.15] tracking-[-0.01em]` |
| Modal close | `w-9 h-9 rounded-[10px] bg-fortuno-black/[0.06] border border-fortuno-black/10 text-fortuno-black/65 grid place-items-center transition-all duration-noir-fast ease-noir-spring hover:bg-fortuno-gold-intense/[0.18] hover:text-fortuno-black hover:rotate-90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-fortuno-gold-soft/55` |
| Modal body | `flex-1 overflow-y-auto px-7 py-[22px] [scrollbar-width:thin] [scrollbar-color:rgba(184,150,63,0.45)_transparent]` |
| Modal body markdown | aplicar `.markdown-body` (CSS global — paragrafação, h2, ol, ul, strong) |
| Modal footer | `px-6 py-4 flex justify-between items-center gap-3 border-t border-fortuno-gold-intense/20 bg-fortuno-gold-intense/[0.04] flex-wrap` |
| Modal btn primary | `inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-fortuno-gold-intense text-fortuno-black text-[13px] font-bold tracking-wide shadow-[0_8px_20px_-8px_rgba(212,175,55,0.5),0_1px_0_rgba(255,255,255,0.35)_inset] transition-all duration-noir-fast ease-noir-spring hover:bg-fortuno-gold-soft hover:-translate-y-px focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-fortuno-gold-soft/55 min-h-[40px]` |
| Modal btn ghost | `inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full bg-transparent text-fortuno-green-elegant border border-fortuno-green-elegant/25 text-xs font-semibold transition-colors duration-noir-fast hover:bg-fortuno-gold-intense/10 hover:border-fortuno-gold-intense min-h-[40px]` |
| Raffle detail prize row | `grid grid-cols-[auto_1fr] items-center gap-3.5 p-3 px-3.5 bg-white border border-[color:var(--card-paper-border)] rounded-xl` |
| Raffle detail pos medal | `w-9 h-9 rounded-full bg-[radial-gradient(120%_120%_at_30%_20%,var(--fortuno-gold-soft),var(--fortuno-gold-intense)_60%,var(--fortuno-green-elegant)_100%)] border-2 border-white/55 grid place-items-center text-fortuno-black font-display italic font-extrabold text-sm` |

---

## 5. Acessibilidade — checks específicos da lottery-detail

- **Contraste numeral hero** (gradient ouro sobre imagem escurecida): garantido pelo overlay bottom-up que chega a 92% de opacidade na base + `text-shadow: 0 6px 30px rgba(0,0,0,0.65)`. Mesma técnica do hero da home — auditada lá. Teste obrigatório: substituir a imagem por uma branca pura e validar legibilidade.
- **Imagem do palco**: `alt` descritivo do prêmio principal (ex.: "Porsche 911 prateado em ângulo dramático — prêmio do sorteio Porsche Mega Edição #012"). NUNCA `alt=""` — é vitrine semântica, não decoração.
- **Countdown** (`role="timer"` + `aria-live="polite"` + `aria-atomic="true"` + `aria-label` com valor textual completo). Os números visuais atualizam a cada 1s mas o `aria-label` é re-renderizado **apenas quando o minuto muda** — evita screen reader falando incessantemente.
- **Pílulas Regras / Política** (CTAs no palco): `<button type="button">` com `aria-haspopup="dialog"` + texto descritivo. Foco visível ouro 3px (reuso `--shadow-gold-focus`). Touch target 44px de altura mínima.
- **Raffle cards / Prize cards**: cada um é `<button type="button">` (não `<div>`), focável por Tab, ativável por Enter/Space, com `aria-haspopup="dialog"`. Hover e focus produzem o mesmo retorno visual (translate -2px + ring ouro).
- **Combo cards**: dentro de `role="radiogroup" aria-label="Pacotes de bilhetes"`, cada card `role="radio" aria-checked={true|false}`. Setas ←/↑ → movem entre cards, Enter/Space confirma.
- **Qty input + slider**: ambos sincronizados via mesmo state, ambos com `aria-label` distintos ("Quantidade de bilhetes" / "Ajuste a quantidade de bilhetes"). Input `inputMode="numeric"`. Slider `aria-valuetext` para anunciar "50 bilhetes — Pacote Ouro aplicado".
- **Recibo**: estrutura semântica `<dl>` ou tabela acessível. `aria-labelledby="receipt-title"`. Número total tem `tabular-nums` para evitar dança de dígitos durante recálculo.
- **CTA Comprar**: foco ouro 4px (mais forte que o padrão 3px porque é a ação primária da página).
- **Modais**: `role="dialog" aria-modal="true" aria-labelledby="..."`, focus trap obrigatório, Escape fecha, click no overlay fecha, focus retorna ao elemento que abriu (`triggerRef`). Body do modal `tabindex="0"` para receber rolagem por teclado quando o conteúdo extrapola. Botão Fechar tem `aria-label` explícito ("Fechar regulamento" / "Fechar detalhes do sorteio").
- **Cor não é único indicador**: badge "ABERTO" tem dot + texto; combo ativo tem ring + check stamp + `aria-checked`; raffle row tem ícone + texto da data.
- **`prefers-reduced-motion`**: regra global cobre. `combo-ring-pulse`, `live-pulse`, `modal-fade`, `modal-pop` desligados; cards mantêm estado visual final (border + shadow + check stamp visível).

---

## 6. Densidade alvo (desktop ≥ 1280px)

| Bloco | Altura aprox. |
|-------|---------------|
| Topbar global | 64px |
| Hero compacto (21:9 dentro de max-w-7xl com pt-10 pb-8) | ~640px |
| Descrição editorial | ~520px |
| Sorteios (3 cards) | ~280px |
| Prêmios grid (3×3 = 9) | ~580px |
| Footer band | ~72px |
| **Coluna principal total** | **~2090px** (scroll natural) |
| **Coluna checkout sticky** | ~720px (visível enquanto rola coluna principal) |

A coluna checkout fica `sticky top-[88px]` (64 topbar + 24 respiro), garantindo que o CTA "Comprar" permaneça visível durante toda a leitura. Em mobile o sticky vira footer sticky com CTA gigante.

---

## 7. Referências cruzadas

- Wizard: `design/wizard-vertical/{tokens.md, spec.md}` — base de tokens, focus ring, durações.
- Home: `design/home/{tokens.md, spec.md, mockup.html}` — `HeroFeaturedLottery` (palco wide), `LotteryCardPremium` (linguagem de "passe de cassino"), `GoldNumeral`, badge ABERTO + `live-pulse`.
- Dashboard: `design/dashboard/{tokens.md, spec.md, mockup.html}` — body claro, cards paper, topbar global, footer band, dropdown UserMenu (família visual herdada pelos modais).
- Mockup desta página: `design/lottery-detail/mockup.html` (preview standalone com 2 modais abertos sobre o conteúdo).
- Spec de implementação: `design/lottery-detail/spec.md`.
