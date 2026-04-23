# Design Tokens — Checkout Wizard Horizontal "Editorial Casino Noir"

Direção: **Editorial Casino Noir** — variante **light body** (mesma família que `dashboard` e `lottery-detail`). Stepper horizontal no topo, conteúdo em cards paper sobre fundo `--dash-bg-page`, microinterações ouro coerentes com o wizard vertical.

**Princípio inviolável**: zero cores brutas novas. Tudo é composto a partir de:
`--fortuno-green-deep #0a2a20`, `--fortuno-green-elegant #134436`, `--fortuno-gold-intense #b8963f`, `--fortuno-gold-soft #d4af37`, `--fortuno-black #0b0b0b`, `--fortuno-offwhite #ece8e1`.

---

## 1. Tokens REUTILIZADOS (não duplicar — herdam dos blocos anteriores)

### De `wizard-vertical/tokens.md`
| Token | Uso aqui |
|-------|----------|
| `--shadow-gold-focus` | Focus ring de TODOS os interativos (campos, marcadores, botões) |
| `--gold-divider` | Divisor ouro forte entre seções |
| `--duration-fast` `--duration-base` `--duration-slow` | Transições |
| `--easing-out` `--easing-spring` | Curvas das transições |
| `--metal-marker-active` `--metal-marker-done` | **Marcadores horizontais** ativo/concluído |
| Keyframe `check-pop` | Check do marcador concluído |
| Keyframe lógica `marker-breath` | Reaproveitada como `hmarker-breath` (idêntica) para o marcador horizontal ativo |

### De `home/tokens.md`
| Token | Uso aqui |
|-------|----------|
| `--badge-live-bg` / dot pulsante | Status "Aguardando pagamento..." (etapa 3) |
| Keyframe `live-pulse` | Dot do status |
| Componente `GoldNumeral` (React) | Numeral do total na etapa 3 (R$ 225,00 grande) e no recibo |
| Componente `TrustSeals` (React) | Selos no painel direito (etapa 2) e no rodapé (etapa 4) |

### De `dashboard/tokens.md`
| Token | Uso aqui |
|-------|----------|
| `--dash-bg-page` | Fundo do `<main>` da rota `/checkout/:lotteryId` |
| `--card-paper-bg` `--card-paper-border` `--card-paper-border-hover` | Cards paper (stepper container, conteúdo de cada etapa, modais) |
| `--shadow-paper` `--shadow-paper-hover` | Sombras dos cards |
| `--card-gold-bar` | Linha ouro 1px no topo de cada card |
| `--gold-divider-soft` | Divisor ouro suave dentro do recibo |
| `--topbar-bg` (Header global) | Topbar do checkout (compacta — sem nav central) |

### De `lottery-detail/tokens.md`
| Token | Uso aqui |
|-------|----------|
| `--receipt-bg` `--receipt-border` `--receipt-shadow` `--receipt-divider` | **Componente Receipt 100% reusado** no painel direito do carrinho |
| `--stage-compact-bg` `--shadow-stage-compact` `--stage-compact-overlay` | **Miniatura do prêmio** (`prize-thumb`) no painel direito + topo da etapa 1 |
| `--modal-bg` `--modal-border` `--modal-shadow` `--modal-overlay` | Modal "Escolher número" |
| Keyframes `modal-fade` `modal-pop` | Animação do modal |
| `--prize-badge-bg` `--prize-badge-border` | Ícone do bilhete agregado (gradient suave fundo claro) |
| Classes `.cta-buy` adaptadas em `.cta-gold` | Botão "Confirmar compra" (etapa 2) e "Ver meus bilhetes" (etapa 4) |

> **Política**: se algum token acima for redeclarado em `tokens.css` para o checkout, **abortar**. Drift visual entre dashboard, lottery-detail e checkout descaracteriza o sistema.

---

## 2. Tokens NOVOS — anexar em `src/styles/tokens.css`

```css
/* ===========================================================
   CHECKOUT WIZARD HORIZONTAL — Editorial Casino Noir (light body)
   Anexar APÓS os blocos do wizard, home, dashboard e lottery-detail.
   =========================================================== */

/* --- 2.1 STEPPER HORIZONTAL ---
   Marcadores 56px (mesma medida do wizard vertical para consistência),
   ligados por trilha 3px. Trilha de fundo em ouro mute, fill em gradient
   ouro→verde animado por largura. 4 estados: pending / active / done / skipped. */
--hstep-marker-size: 56px;
--hstep-track-height: 3px;
--hstep-track-bg:    rgba(184, 150, 63, 0.18);
--hstep-track-fill:
  linear-gradient(90deg,
    var(--fortuno-gold-soft)    0%,
    var(--fortuno-gold-intense) 60%,
    var(--fortuno-green-elegant) 100%);
--hstep-skip-opacity: 0.38;

/* Marcador "pendente" no body claro — paleta ouro-pálido (substitui
   o --metal-marker-pending do wizard, que é verde-deep p/ body dark) */
--hmarker-metal-pending:
  radial-gradient(120% 120% at 30% 20%, #eae0c3 0%, #c7b885 55%, #8a7a46 100%);

/* Marcador "skipped" — fundo transparente, borda dashed ouro */
--hmarker-skip-border: rgba(184, 150, 63, 0.45);

/* --- 2.2 BOTÃO GHOST OURO ("Escolher um número") ---
   Pill outline ouro, fundo ouro 8% com borda 45%. No hover sobe ligeiramente,
   borda satura e texto vai para preto. Reutilizado também nos botões de share
   da etapa 4 (WhatsApp / Copiar link). */
--btn-ghost-gold-bg:           rgba(184, 150, 63, 0.08);
--btn-ghost-gold-bg-hover:     rgba(184, 150, 63, 0.18);
--btn-ghost-gold-border:       rgba(184, 150, 63, 0.45);
--btn-ghost-gold-border-hover: var(--fortuno-gold-intense);

/* --- 2.3 NÚMERO DE BILHETE (numeral Playfair sobre fundo claro) ---
   Variante do --stat-numeral-gradient (dashboard) que termina em verde-elegant
   ao invés de ouro fade — necessário para legibilidade quando o número aparece
   inline em uma linha de carrinho (.billet-row .numeral). Também usado no
   ticket-mini (etapa 4) e no valor total da etapa 3. */
--ticket-numeral-gradient:
  linear-gradient(180deg,
    var(--fortuno-gold-soft)     0%,
    var(--fortuno-gold-intense) 55%,
    rgba(19, 68, 54, 0.85)      100%);

/* --- 2.4 CARRINHO — billet row & ícones ---
   Linha de bilhete tem 3 variantes: agregado-aleatório (paper claro com
   tint ouro), manual (mesma base + borda esquerda 3px ouro intensa),
   entrando (animação de slide-in 320ms). */
--billet-row-bg:           #ffffff;
--billet-row-bg-random:    linear-gradient(180deg, #ffffff 0%, #fbf7ee 100%);
--billet-row-border:       rgba(184, 150, 63, 0.22);
--billet-row-accent:       var(--fortuno-gold-intense); /* borda esquerda do manual */
--billet-icon-bg-random:   linear-gradient(180deg, #fff6d6 0%, #f0e3b8 100%);
--billet-icon-bg-manual:
  radial-gradient(120% 120% at 30% 20%, var(--fortuno-gold-soft), var(--fortuno-gold-intense) 80%);

/* --- 2.5 PIX — QR card ---
   Card branco com borda ouro intensa 1.5px e sombra noir profunda. Acentua
   visualmente o QR sem competir com o conteúdo lateral (instruções/copia-cola). */
--qr-card-bg:           #ffffff;
--qr-card-border:       var(--fortuno-gold-intense);
--qr-card-shadow:
  0 1px 0 rgba(255, 255, 255, 0.95) inset,
  0 36px 60px -24px rgba(10, 42, 32, 0.25),
  0 12px 24px -12px rgba(184, 150, 63, 0.35);

/* --- 2.6 COPY-CODE (linha digitável PIX) ---
   Reusa --receipt-border (dashed ouro) com fundo --receipt-bg para coesão
   visual com o recibo. Mono leve, padding generoso, botão copy ouro absoluto. */
--copy-code-bg:     #fbf7ee;
--copy-code-border: var(--receipt-border);

/* --- 2.7 COUNTDOWN crítico (<2 min) ---
   Cor cobre-vermelho usada APENAS no countdown e em mensagens de erro
   inline. Mantém AA contra paper bg (5.4:1). */
--countdown-critical:        #b94a2f;
--countdown-critical-bg:     rgba(185, 74, 47, 0.10);
--countdown-critical-border: rgba(185, 74, 47, 0.35);

/* --- 2.8 ORNAMENTO ART-DÉCO (etapa 4 — Sucesso) ---
   Linha horizontal ouro com losango central (mesma fórmula do
   FraudCertificate da home). É puramente decorativo (aria-hidden). */
--ornament-line:
  linear-gradient(90deg,
    transparent 0%,
    rgba(184, 150, 63, 0.55) 20%,
    rgba(212, 175, 55, 0.85) 50%,
    rgba(184, 150, 63, 0.55) 80%,
    transparent 100%);

/* --- 2.9 CONFETE (etapa 4) ---
   3 cores derivadas da paleta: ouro soft, ouro intense, verde-elegant.
   10 peças CSS-only com delay/translate distintos — sem libs. */
--confetti-gold-a: var(--fortuno-gold-soft);
--confetti-gold-b: var(--fortuno-gold-intense);
--confetti-green:  var(--fortuno-green-elegant);
```

---

## 3. Extensão de `tailwind.config.js` (merge incremental)

Acrescentar dentro do `theme.extend` existente. Tudo abaixo é **adicional** — não substituir o que wizard / home / dashboard / lottery-detail já adicionaram.

```js
// tailwind.config.js — theme.extend (merge)
boxShadow: {
  // ...wizard, home, dashboard, lottery-detail
  'qr-card': 'var(--qr-card-shadow)',
},
backgroundImage: {
  // ...wizard, home, dashboard, lottery-detail
  'hstep-track-fill':       'var(--hstep-track-fill)',
  'hmarker-pending':        'var(--hmarker-metal-pending)',
  'billet-row-random':      'var(--billet-row-bg-random)',
  'billet-icon-random':     'var(--billet-icon-bg-random)',
  'billet-icon-manual':     'var(--billet-icon-bg-manual)',
  'ticket-numeral':         'var(--ticket-numeral-gradient)',
  'ornament-line':          'var(--ornament-line)',
},
keyframes: {
  // ...wizard (marker-breath, check-pop, rail-pulse), lottery-detail (modal-*)
  'hmarker-breath': {
    '0%, 100%': { boxShadow: '0 1px 0 rgba(255,255,255,0.55) inset, 0 -1px 0 rgba(0,0,0,0.35) inset, 0 0 0 4px rgba(184,150,63,0.22), 0 10px 26px -8px rgba(184,150,63,0.55)' },
    '50%':      { boxShadow: '0 1px 0 rgba(255,255,255,0.55) inset, 0 -1px 0 rgba(0,0,0,0.35) inset, 0 0 0 7px rgba(184,150,63,0.10), 0 12px 32px -8px rgba(184,150,63,0.70)' },
  },
  'billet-slide-in': {
    '0%':   { opacity: '0', transform: 'translateX(-8px) scale(0.98)' },
    '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
  },
  'countdown-blink': {
    '0%, 100%': { opacity: '1' },
    '50%':      { opacity: '0.55' },
  },
  'confetti-fall': {
    '0%':   { opacity: '0', transform: 'translate(0, 0) rotate(0deg)' },
    '10%':  { opacity: '1' },
    '100%': { opacity: '0', transform: 'translate(var(--tx, 0), 380px) rotate(var(--rot, 360deg))' },
  },
  'step-slide-in': {
    '0%':   { opacity: '0', transform: 'translateX(24px)' },
    '100%': { opacity: '1', transform: 'translateX(0)' },
  },
  'step-slide-out': {
    '0%':   { opacity: '1', transform: 'translateX(0)' },
    '100%': { opacity: '0', transform: 'translateX(-24px)' },
  },
},
animation: {
  // ...wizard, lottery-detail
  'hmarker-breath':  'hmarker-breath 2.6s ease-in-out infinite',
  'billet-slide-in': 'billet-slide-in 320ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  'countdown-blink': 'countdown-blink 1s ease-in-out infinite',
  'confetti-fall':   'confetti-fall 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
  'step-slide-in':   'step-slide-in 280ms cubic-bezier(0.22, 1, 0.36, 1) both',
  'step-slide-out':  'step-slide-out 200ms cubic-bezier(0.22, 1, 0.36, 1) both',
},
```

---

## 4. Class map sugerido (componentes do checkout)

| Papel | Classes Tailwind / utilitárias |
|-------|--------------------------------|
| `<main>` da rota | `min-h-screen bg-dash-page text-fortuno-black` |
| Wrapper página | `mx-auto max-w-[1240px] px-4 md:px-6 py-6 md:py-8` |
| **Stepper container** | `paper-card rounded-none md:rounded-b-none` (remover `border-radius` no top quando topbar global está logo acima) |
| **Stepper grid** | `relative grid grid-cols-4 gap-0 px-4 pt-7 pb-6` |
| Stepper trilha bg | pseudo `::before` absoluto: `top-[56px] left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-[3px] bg-[color:var(--hstep-track-bg)] rounded-full` |
| Stepper trilha fill | pseudo `::after` absoluto: `top-[56px] left-[calc(12.5%+24px)] h-[3px] bg-hstep-track-fill rounded-full shadow-[0_0_12px_rgba(212,175,55,0.55)] transition-[width] duration-noir-slow ease-noir-out` (largura controlada via `style="--hstep-fill: 33.33%"`) |
| **Marcador base** | `w-14 h-14 rounded-full grid place-items-center bg-hmarker-pending border-[1.5px] border-fortuno-gold-intense/35 text-fortuno-black/55 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_-1px_0_rgba(0,0,0,0.12)_inset,0_6px_14px_-6px_rgba(10,42,32,0.25)] transition-all duration-noir-base ease-noir-spring` |
| Marcador active | adicionar: `bg-marker-active text-fortuno-black border-white/55 shadow-noir-marker-on animate-hmarker-breath` |
| Marcador done | adicionar: `bg-marker-done text-fortuno-gold-soft border-fortuno-gold-soft/55` |
| Marcador skipped | substituir bg por: `bg-transparent border-dashed border-[color:var(--hmarker-skip-border)] text-fortuno-gold-intense shadow-none` + wrapper com `opacity-[var(--hstep-skip-opacity)]` |
| **Step label** | `text-[11px] font-bold uppercase tracking-[0.22em] text-fortuno-black/55 transition-colors duration-noir-base whitespace-nowrap` |
| Step label active | adicionar: `text-fortuno-gold-intense` |
| Step label done | adicionar: `text-fortuno-green-elegant` |
| Step sub | `text-[10px] font-medium text-fortuno-black/45 mt-0.5` |
| **Stepper mobile** | `lg:hidden flex items-center gap-3 px-4 py-3.5 bg-white/78 backdrop-blur-md border-b border-fortuno-gold-intense/20` |
| Mobile dot list | `flex gap-1.5 flex-1` com `<li class="h-1.5 flex-1 rounded-full bg-fortuno-gold-intense/18">` |
| Mobile dot active | `bg-gradient-to-r from-fortuno-gold-soft to-fortuno-gold-intense shadow-[0_0_8px_rgba(212,175,55,0.55)]` |
| Conteúdo da etapa | `paper-card rounded-t-none border-t-0 p-6 md:p-10 animate-step-slide-in` |

### Carrinho

| Papel | Classes |
|-------|---------|
| Layout 2 cols | `grid lg:grid-cols-[1.55fr_1fr] gap-8` |
| **Billet row base** | `grid grid-cols-[auto_1fr_auto_auto] gap-3.5 items-center p-3.5 px-[18px] bg-white border border-[color:var(--billet-row-border)] rounded-[14px] transition-all duration-noir-base ease-noir-spring` |
| Billet row random | adicionar: `bg-billet-row-random` |
| Billet row manual | adicionar: `border-l-[3px] border-l-fortuno-gold-intense` |
| Billet row entering | `animate-billet-slide-in` |
| Billet icon | `w-11 h-11 rounded-xl grid place-items-center border border-fortuno-gold-intense/45` |
| Billet icon random bg | `bg-billet-icon-random text-fortuno-gold-intense` |
| Billet icon manual bg | `bg-billet-icon-manual text-fortuno-black` |
| Billet title | `text-sm font-semibold text-fortuno-black leading-tight` |
| Billet numeral inline | `font-display italic font-extrabold text-[20px] text-transparent bg-clip-text bg-ticket-numeral tabular-nums` |
| Billet sub | `text-[11px] text-fortuno-black/50 mt-0.5` |
| Billet value | `text-sm font-bold text-fortuno-black tabular-nums` |
| Billet remove | `w-[34px] h-[34px] rounded-[10px] border border-fortuno-black/12 bg-fortuno-black/[0.04] text-fortuno-black/55 grid place-items-center cursor-pointer transition-all duration-noir-fast hover:bg-[rgba(185,74,47,0.10)] hover:text-[color:var(--countdown-critical)] hover:border-[rgba(185,74,47,0.35)] focus-visible:outline-none focus-visible:shadow-gold-focus` |
| **Botão escolher número** | `inline-flex items-center gap-2 px-[18px] py-2.5 rounded-full bg-[color:var(--btn-ghost-gold-bg)] text-fortuno-gold-intense border-[1.5px] border-[color:var(--btn-ghost-gold-border)] text-[13px] font-semibold min-h-[40px] transition-all duration-noir-fast ease-noir-spring hover:bg-[color:var(--btn-ghost-gold-bg-hover)] hover:border-[color:var(--btn-ghost-gold-border-hover)] hover:text-fortuno-black hover:-translate-y-px focus-visible:outline-none focus-visible:shadow-gold-focus` |
| Painel direito sticky | `lg:sticky lg:top-[88px] lg:self-start space-y-5` |
| Prize thumb | (reuso lottery-detail — `relative overflow-hidden rounded-2xl aspect-[16/9] bg-[color:var(--stage-compact-bg)] border border-[color:var(--stage-compact-border)] shadow-stage-compact`) |
| Prize thumb caption | `absolute left-3.5 right-3.5 bottom-3 text-fortuno-offwhite [text-shadow:0_6px_30px_rgba(0,0,0,0.65)]` |
| **Receipt** | (100% reuso de `lottery-detail/tokens.md` §4 — linha "Receipt") |
| Combo chip | `inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-full bg-fortuno-gold-intense text-fortuno-black text-[10px] font-bold tracking-[0.08em] uppercase` |
| **CTA confirmar** | (reuso `cta-buy` da lottery-detail; classe `cta-gold` no mockup) |
| Trust seal | `flex items-center gap-2 px-3 py-2 rounded-full bg-fortuno-green-elegant/[0.06] border border-fortuno-green-elegant/[0.12] text-fortuno-green-elegant text-[10px] font-semibold tracking-[0.04em]` |

### PIX

| Papel | Classes |
|-------|---------|
| Layout 2 cols | `grid lg:grid-cols-[auto_1fr] gap-8 lg:gap-12 items-start max-w-5xl mx-auto` |
| Valor numeral grande | `font-display italic font-extrabold text-5xl md:text-6xl tabular-nums bg-clip-text text-transparent bg-ticket-numeral` |
| **QR card** | `bg-white border-[1.5px] border-fortuno-gold-intense rounded-3xl p-5 shadow-qr-card` |
| QR placeholder | (apenas mockup; substituir por `<img>` base64 do backend) |
| Status pill | `inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fortuno-gold-intense/10 border border-fortuno-gold-intense/32 text-xs font-semibold text-fortuno-gold-intense` |
| Live pulse dot | `w-2 h-2 rounded-full bg-fortuno-gold-soft relative` + `::after` border + `animate-live-pulse` (reuso home) |
| Lista de instruções | `space-y-3` com `<li class="flex items-start gap-3">` |
| Numeral instrução | `font-display italic font-extrabold text-xl text-fortuno-gold-intense leading-none mt-0.5 w-7 text-center` |
| **Copy-code** | `font-mono text-xs tracking-[0.02em] text-fortuno-black bg-[color:var(--copy-code-bg)] border border-dashed border-[color:var(--copy-code-border)] rounded-xl p-3 pr-12 break-all leading-relaxed relative` |
| Copy-code button | `absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-[10px] bg-fortuno-gold-intense text-fortuno-black grid place-items-center hover:bg-fortuno-gold-soft transition-colors duration-noir-fast` |
| Countdown card | `flex items-center gap-4 p-4 rounded-2xl bg-fortuno-offwhite/60 border border-fortuno-gold-intense/22` |
| Countdown timer | `font-display italic font-bold text-3xl leading-none tabular-nums text-fortuno-black` |
| Countdown crítico | adicionar: `text-[color:var(--countdown-critical)] animate-countdown-blink` |

### Sucesso (Etapa 4)

| Papel | Classes |
|-------|---------|
| Wrapper | `paper-card rounded-t-none border-t-0 p-8 md:p-14 text-center` |
| Ornamento | `flex items-center gap-3.5 justify-center mx-auto mb-5` |
| Ornamento linha | `flex-1 max-w-[140px] h-px bg-ornament-line` |
| Ornamento losango | `w-3.5 h-3.5 bg-fortuno-gold-intense rotate-45 shadow-[0_0_0_3px_rgba(184,150,63,0.18),0_0_12px_rgba(212,175,55,0.45)]` |
| Confetti wrap | `relative h-0 overflow-visible pointer-events-none` |
| Confetti piece | `absolute top-0 left-1/2 w-2 h-3.5 bg-[color:var(--confetti-gold-a)] opacity-0 rounded-sm animate-confetti-fall` (variantes via `:nth-child` em CSS — não tailwindizar 10x) |
| Headline | `font-display italic font-extrabold text-4xl md:text-6xl leading-[0.95] mt-2 max-w-3xl mx-auto` |
| Sub-headline | `text-base text-fortuno-black/70 mt-4 max-w-xl mx-auto` |
| Grid de bilhetes mini | `mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto` |
| **Ticket mini** | `relative pt-[22px] px-[18px] pb-[18px] bg-gradient-to-b from-white to-fortuno-offwhite/60 border-[1.5px] border-fortuno-gold-intense/35 rounded-[18px] shadow-paper text-center` + `::before` para gold-bar |
| Ticket mini number | `font-display italic font-extrabold text-[40px] leading-none bg-clip-text text-transparent bg-ticket-numeral tabular-nums mb-2.5` |
| Ticket mini label | `text-[11px] font-semibold text-fortuno-black/68` |
| Ticket mini date | `text-[10px] text-fortuno-black/50 tracking-[0.08em] uppercase mt-1.5` |
| Ticket mini chip | `inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-fortuno-green-elegant/[0.08] border border-fortuno-green-elegant/[0.18] text-fortuno-green-elegant text-[9px] font-bold tracking-[0.10em] uppercase mt-2.5` |
| Ticket mini chip manual | substituir por: `bg-fortuno-gold-intense/15 border-fortuno-gold-intense/40 text-fortuno-gold-intense` |

---

## 5. Acessibilidade — checks específicos do checkout

- **Stepper** é `<nav aria-label="Etapas do checkout">` com `<ol>`. Cada step renderiza:
  - Concluído + ativo + pulado: `<button type="button">` clicável (permite voltar).
  - Pendente bloqueado: `<span aria-disabled="true">` (não clicável até liberar).
  - Marcador ativo recebe `aria-current="step"`. Pulado recebe `data-state="skipped"` + `aria-label="Etapa de cadastro pulada — perfil já completo"`.
  - Trilha tem `aria-hidden="true"` (decorativa).
- **Contraste**:
  - Texto preto sobre paper card (`#fff`): 19.7:1 ✅ AAA.
  - Label ouro intense (`#b8963f`) sobre paper: 4.6:1 ✅ AA texto normal — usado APENAS em labels >=12px font-weight>=600.
  - Marker pendente (texto `rgba(11,11,11,0.55)` sobre `#eae0c3`): 5.2:1 ✅ AA.
  - Countdown crítico (`#b94a2f`) sobre offwhite/60: 5.4:1 ✅ AA.
- **Touch targets**: marker 56×56 ✅. Botão "Escolher número" 40px height + 18px horiz padding ≥ 44×44 ✅. CTA confirmar 56px ✅. Billet remove 34×34 — **anotação**: aumentar para 36×36 com tap-area de 44px via `before:absolute before:inset-[-5px]` (compatibilidade WCAG 2.5.5 nível AAA — não bloqueia AA).
- **Focus visible**: `--shadow-gold-focus` em TODOS os interativos. Marker recebe overlay extra do focus ring (3px) sem perder o breath.
- **Modal "Escolher número"**:
  - `role="dialog" aria-modal="true" aria-labelledby="choose-title"`.
  - Focus trap obrigatório, Escape fecha, click no overlay fecha, focus retorna ao botão "Escolher um número".
  - Input `type="text" inputMode="numeric"` (não `type=number` — evita spinner e perda de format).
  - Validação inline com `aria-live="polite"` para "Número disponível" / "Número já comprado" / "Fora do intervalo".
- **Countdown PIX**: `<time aria-live="polite" aria-atomic="true">12:47</time>`; `aria-label` reescreve apenas a cada minuto (evita screen reader falar a cada segundo). Quando entra em modo crítico, anunciar uma vez "Atenção: 2 minutos restantes".
- **Status "Aguardando pagamento"**: `aria-live="polite"`; ao mudar para "Pago" ou "Expirado", mudar para `aria-live="assertive"` e disparar transição.
- **Ornamento + confete (etapa 4)**: ambos `aria-hidden="true"`. O conteúdo informativo é a headline.
- **Cor não é único indicador**:
  - Step skipped: opacity + borda dashed + ícone `user-check` (≠ `user-round`).
  - Billet manual: borda esquerda 3px + ícone `Hash` + label "Escolhido por você" no sub.
  - Combo chip: ícone check + texto "Pacote Prata · 10% off".
- **`prefers-reduced-motion`**:
  - `hmarker-breath`, `billet-slide-in`, `countdown-blink`, `confetti-fall`, `step-slide-in/out`, `live-pulse` desligados.
  - Estados visuais finais permanecem (cor, sombra, posição).
  - Ornamento: ok porque é estático.

---

## 6. Densidade alvo (desktop ≥ 1280px)

| Etapa | Altura aprox. (sem topbar) | Cabe em 1 viewport (1080p)? |
|-------|---------------------------|------------------------------|
| Topbar | 64px | — |
| Stepper container | 152px | — |
| **Etapa 1 — Cadastro** (sem prize bar topo) | ~620px | ✅ 836px / 1080 |
| Etapa 1 (com prize bar topo) | ~760px | ✅ 976px / 1080 |
| **Etapa 2 — Carrinho** (3 itens) | ~640px | ✅ 856px / 1080 |
| Etapa 2 (10 itens individuais expandidos) | ~1100px | scroll natural — esperado |
| **Etapa 3 — PIX** | ~680px | ✅ 896px / 1080 |
| **Etapa 4 — Conclusão** (3 bilhetes) | ~880px | ✅ 1096px / 1080 (limite) |
| Etapa 4 (9 bilhetes 3×3) | ~1100px | scroll natural — esperado |

Stepper fica `sticky top-0` no desktop (topbar não-sticky para liberar viewport). No mobile o stepper colapsa em barra de dots compacta (~52px).

---

## 7. Referências cruzadas

- Wizard vertical: `design/wizard-vertical/{tokens.md, spec.md, mockup.html}` — base de marcadores, focus ring, durações.
- Home: `design/home/{tokens.md, spec.md, mockup.html}` — `GoldNumeral`, `TrustSeals`, `live-pulse` (badge ABERTO), `FraudCertificate` (ornamento art-déco).
- Dashboard: `design/dashboard/{tokens.md, spec.md, mockup.html}` — body claro, cards paper, topbar global.
- Lottery detail: `design/lottery-detail/{tokens.md, spec.md, mockup.html}` — Receipt, Modal família, ComboPackCard, prize thumb (palco compacto).
- Mockup desta página: `design/checkout/mockup.html` (4 estados empilhados com separadores + 1 modal still na etapa 2).
- Spec de implementação: `design/checkout/spec.md`.
