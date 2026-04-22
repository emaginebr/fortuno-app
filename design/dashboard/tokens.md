# Design Tokens — Dashboard "Editorial Casino Noir · Light Body · COMPACT v2"

Direção: **Editorial Casino Noir** (continuidade direta do wizard vertical e da home), em **variante de superfície clara** para o painel autenticado, **iterada em v2 para densidade máxima** — a página inteira deve caber em um viewport de 1080px no desktop.

> O dashboard é o único território com **fundo claro no corpo** (off-white / paper). Faixas escuras (`fortuno-green-deep`) são reservadas a **header** e **footer band**.
>
> **Mudanças estruturais da v2** em relação à v1:
>
> 1. **`PointsVault` removido**. Os pontos acumulados viraram **chip compacto no header**, semanticamente em **pontos inteiros** (não em BRL).
> 2. Novo componente unificado **`HeaderChip`**, com duas variantes: `referral` e `points`.
> 3. `StatGrid` foi substituído por **`LinkedStatGrid`** — cada card é um `<Link>` inteiro com CTA individual.
> 4. `QuickLinks` **eliminado** (duplicava os destinos dos stats linkáveis).
> 5. Empty state de "Loterias que administra" **removido** — a seção é **condicional** (`myLotteries.length > 0`).
> 6. `DashboardFooterBand` **compactada** para linha única em desktop (~72px).
> 7. Tokens órfãos removidos: `--vault-bg`, `--vault-border*`, `--vault-shadow*`, `--vault-shimmer`, `--gold-numeral-light`, `--pill-*`, `--empty-lotteries-*`.

**Princípio inviolável (idem wizard/home)**: nenhuma cor bruta nova — todas as composições derivam da paleta de marca:

- `--fortuno-green-deep` `#0a2a20`
- `--fortuno-green-elegant` `#134436`
- `--fortuno-gold-intense` `#b8963f`
- `--fortuno-gold-soft` `#d4af37`
- `--fortuno-black` `#0b0b0b`
- `--fortuno-offwhite` `#ece8e1`
- `#f7f3ec` (paper — variação levemente mais clara/quente do `--fortuno-offwhite`)

---

## 1. Tokens reutilizados — wizard

Referência: `design/wizard-vertical/tokens.md §2 e §3`. O dashboard consome integralmente:

| Token / classe                                | Uso no dashboard                                              |
|-----------------------------------------------|---------------------------------------------------------------|
| `--fortuno-*` (paleta completa)               | Toda cor da página                                            |
| `--shadow-gold-focus`                          | Focus ring global de TODOS os elementos interativos           |
| `--gold-divider`                               | Divisores horizontais (header base, footer band top)          |
| `--marker-metal-active` / `-done`              | Lottery row-icon (mantido)                                    |
| `--duration-fast` / `-base` / `-slow`          | Transições                                                    |
| `--easing-out` / `--easing-spring`             | Transições                                                    |
| Tailwind: `font-display`, `shadow-gold-focus`, `bg-gold-divider` | Tudo já configurado pelo wizard      |

---

## 2. Tokens reutilizados — home

Referência: `design/home/tokens.md §2`. O dashboard consome:

| Token / classe                | Uso no dashboard                                                  |
|-------------------------------|-------------------------------------------------------------------|
| `--noir-bg-hero` (variante)   | Base do `--dash-header-bg` — o header escuro herda os radial gradients do hero |
| `--badge-live-bg/border/dot`   | Badge "Aberto" das linhas de "Loterias que administra"            |
| Keyframe `live-pulse`          | Dot pulsante das linhas de loteria + chip de status              |
| Classe `cta-primary`           | CTA dourado pílula (lotteries header — "Novo sorteio")            |
| Primitivo `GoldNumeral`        | **Reutilizar como componente React** no `LinkedStatCard` (numeral 44px) |

> **Reuso do `GoldNumeral`**: agora só é usado no `LinkedStatCard` (44px), não mais no "cofre" (que foi removido). Gradient termina em verde-elegant para legibilidade sobre branco.

---

## 3. Tokens NOVOS — anexar em `src/styles/tokens.css`

```css
/* ===========================================================
   DASHBOARD v2 — Editorial Casino Noir (variante light body · COMPACT)
   Anexar APÓS os blocos do wizard e da home (não substituir).
   =========================================================== */

/* --- 3.1 Superfície base do corpo do dashboard (CLARA) --- */
--dash-bg-page:
  radial-gradient(1000px 500px at 80% -10%, rgba(184, 150, 63, 0.06), transparent 65%),
  radial-gradient(800px 500px at -10% 110%, rgba(19, 68, 54, 0.04), transparent 55%),
  linear-gradient(180deg, #f7f3ec 0%, #f1ece3 60%, #ece8e1 100%);

/* --- 3.2 Header escuro (topo do dashboard) --- */
--dash-header-bg:
  radial-gradient(900px 300px at 85% 0%, rgba(212, 175, 55, 0.14), transparent 60%),
  radial-gradient(700px 400px at 15% 110%, rgba(184, 150, 63, 0.10), transparent 65%),
  linear-gradient(180deg, #061d17 0%, #0a2a20 55%, #07201a 100%);

/* --- 3.3 Footer band COMPACTA (1 linha em desktop) --- */
--dash-footer-band-bg:
  linear-gradient(180deg, #0a2a20 0%, #0f3a2d 100%);

/* --- 3.4 Cards "papel" sobre fundo claro (sombras reduzidas em ~20% vs v1) --- */
--card-paper-bg:           #ffffff;
--card-paper-border:       rgba(11, 11, 11, 0.08);
--card-paper-border-hover: rgba(184, 150, 63, 0.45);
--shadow-paper:
  0 1px 0 rgba(255, 255, 255, 0.8) inset,
  0 10px 20px -16px rgba(10, 42, 32, 0.18),
  0 3px 6px -3px rgba(184, 150, 63, 0.08);
--shadow-paper-hover:
  0 1px 0 rgba(255, 255, 255, 0.9) inset,
  0 18px 34px -20px rgba(10, 42, 32, 0.26),
  0 6px 12px -4px rgba(184, 150, 63, 0.28);

/* Linha ouro 1px no topo de cada card */
--card-gold-bar: linear-gradient(90deg,
  rgba(212, 175, 55, 0) 0%,
  rgba(212, 175, 55, 0.85) 30%,
  rgba(19, 68, 54, 0.85) 70%,
  rgba(212, 175, 55, 0) 100%);

/* Divisor ouro suave (entre numeral e CTA dentro do LinkedStatCard) */
--gold-divider-soft: linear-gradient(90deg,
  transparent, rgba(184, 150, 63, 0.28), transparent);

/* --- 3.5 HeaderChip unificado (ReferralChip + PointsChip) ---
   Forma base: pílula arredondada glass com borda ouro sutil.
   Estrutura interna: [icon lead 32px] + [label uppercase 9px / value Playfair 22px] + [action 32px]. */
--chip-glass-bg:
  linear-gradient(180deg, rgba(236, 232, 225, 0.10), rgba(236, 232, 225, 0.04));
--chip-glass-border:       rgba(212, 175, 55, 0.32);
--chip-glass-border-hover: rgba(212, 175, 55, 0.55);

/* Ícone leading (quadrado 32px) dentro do chip — visual de "selo" */
--chip-lead-bg:     rgba(212, 175, 55, 0.12);
--chip-lead-border: rgba(212, 175, 55, 0.32);

/* Botão de ação do chip (copy para referral; link "Extrato" para points) */
--chip-action-bg:        rgba(212, 175, 55, 0.12);
--chip-action-border:    rgba(212, 175, 55, 0.40);
--chip-action-bg-hover:  var(--fortuno-gold-soft);
--chip-action-fg-hover:  var(--fortuno-black);

/* --- 3.6 Avatar ring (conic-gradient ouro animado) ---
   Avatar reduzido em v2: 52px (era 68px). Ring ligeiramente mais sutil. */
--avatar-ring: conic-gradient(from 220deg,
  rgba(212, 175, 55, 0)   0deg,
  rgba(212, 175, 55, 0.75) 120deg,
  rgba(184, 150, 63, 0.6)  220deg,
  rgba(212, 175, 55, 0)   360deg);

/* --- 3.7 Stat numeral (light bg) — gradient com anchor verde --- */
--stat-numeral-gradient:
  linear-gradient(180deg,
    var(--fortuno-gold-soft) 0%,
    var(--fortuno-gold-intense) 55%,
    var(--fortuno-green-elegant) 130%);

/* ============================================================
   3.8 TOPBAR GLOBAL + USER MENU DROPDOWN (v2.1)
   Tokens do componente src/components/layout/Header.tsx (global)
   e do novo UserMenu dropdown. A topbar é GLOBAL (todas as rotas
   autenticadas), não é exclusiva do dashboard — mas como o restyle
   veio com o dashboard, os tokens são declarados aqui.
   ============================================================ */

/* Topbar base — faixa escura sticky acima de tudo */
--topbar-bg:
  linear-gradient(180deg, #061d17 0%, #0a2a20 100%);

/* Divisor ouro inferior (separa topbar do dash-header sem empastelar) */
--topbar-border-bottom: linear-gradient(90deg,
  transparent 0%,
  rgba(212, 175, 55, 0.55) 20%,
  rgba(212, 175, 55, 0.75) 50%,
  rgba(212, 175, 55, 0.55) 80%,
  transparent 100%);

/* Nav item ativo (Sorteios / Meus Números / Quem Somos / Fale Conosco) */
--nav-item-active-bg:     rgba(212, 175, 55, 0.10);
--nav-item-active-border: rgba(212, 175, 55, 0.35);

/* Botão trigger do UserMenu (pílula com avatar + nome + chevron) */
--user-trigger-bg:           rgba(236, 232, 225, 0.04);
--user-trigger-bg-hover:     rgba(212, 175, 55, 0.10);
--user-trigger-border:       rgba(212, 175, 55, 0.28);
--user-trigger-border-hover: rgba(212, 175, 55, 0.55);

/* ---- Dropdown do UserMenu (papel claro, borda ouro, sombra noir) ---- */
--dropdown-bg:      #fbf7ee;                  /* paper levemente mais claro que offwhite */
--dropdown-border:  rgba(184, 150, 63, 0.45);
--dropdown-shadow:
  0 2px 0 rgba(255, 255, 255, 0.6) inset,
  0 30px 60px -20px rgba(10, 42, 32, 0.35),
  0 12px 24px -8px rgba(184, 150, 63, 0.22),
  0 0 0 1px rgba(184, 150, 63, 0.08);

/* Divisor interno do dropdown (entre identity e lista, e entre ações e logout) */
--dropdown-divider: linear-gradient(90deg,
  transparent,
  rgba(184, 150, 63, 0.35) 15%,
  rgba(184, 150, 63, 0.55) 50%,
  rgba(184, 150, 63, 0.35) 85%,
  transparent);

/* Itens do dropdown */
--dropdown-item-bg-hover: rgba(184, 150, 63, 0.10);
--dropdown-item-fg:       rgba(11, 11, 11, 0.88);
--dropdown-item-fg-hover: #0b0b0b;

/* Item "Sair" — perigo sutil em ouro-cobre queimado (NÃO vermelho berrante) */
--dropdown-danger-fg:       #8a5a2b;
--dropdown-danger-fg-hover: #6e4421;
--dropdown-danger-bg-hover: rgba(138, 90, 43, 0.08);
```

### 3.8.1 Extensão de `tailwind.config.js` para os tokens da topbar/UserMenu

```js
// tailwind.config.js — theme.extend (merge incremental da v2.1)
backgroundImage: {
  // ...dashboard v2
  'topbar':               'var(--topbar-bg)',
  'topbar-border-bottom': 'var(--topbar-border-bottom)',
  'dropdown-divider':     'var(--dropdown-divider)',
},
boxShadow: {
  // ...dashboard v2
  'dropdown': 'var(--dropdown-shadow)',
},
keyframes: {
  // ...dashboard v2
  'user-menu-open': {
    '0%':   { opacity: '0', transform: 'scale(0.96) translateY(-6px)' },
    '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
  },
},
animation: {
  // ...dashboard v2
  'user-menu-open': 'user-menu-open 180ms cubic-bezier(0.22, 1, 0.36, 1) both',
},
```

> **Nota sobre escopo**: embora a topbar (`Header.tsx`) seja **global** (renderizada em todas as rotas autenticadas via `AuthenticatedShell`), mantemos seus tokens dentro de `design/dashboard/tokens.md` porque o restyle foi pedido junto com a entrega do dashboard e o dashboard é a primeira página onde a nova topbar aparece. Se outro spec/território criar um `tokens.md` de "shell global" no futuro, migrar estes tokens para lá.

---

## 4. Extensão de `tailwind.config.js` (merge, NÃO substituir)

Acrescentar dentro do `theme.extend` existente. Tudo abaixo é incremental.

```js
// tailwind.config.js — theme.extend (merge)
boxShadow: {
  // ...wizard, ...home
  'paper':       'var(--shadow-paper)',
  'paper-hover': 'var(--shadow-paper-hover)',
},
backgroundImage: {
  // ...wizard, ...home
  'dash-page':         'var(--dash-bg-page)',
  'dash-header':       'var(--dash-header-bg)',
  'dash-footer':       'var(--dash-footer-band-bg)',
  'card-gold-bar':     'var(--card-gold-bar)',
  'gold-divider-soft': 'var(--gold-divider-soft)',
  'chip-glass':        'var(--chip-glass-bg)',
  'avatar-ring':       'var(--avatar-ring)',
  'stat-numeral':      'var(--stat-numeral-gradient)',
},
keyframes: {
  // ...wizard, ...home
  'avatar-breath': {
    '0%, 100%': { transform: 'rotate(0deg) scale(1)',    opacity: '0.75' },
    '50%':      { transform: 'rotate(180deg) scale(1.03)', opacity: '0.95' },
  },
  'check-bounce': {
    '0%':   { transform: 'scale(0.5)', opacity: '0' },
    '60%':  { transform: 'scale(1.2)', opacity: '1' },
    '100%': { transform: 'scale(1)',   opacity: '1' },
  },
},
animation: {
  // ...wizard, ...home
  'avatar-breath': 'avatar-breath 6s ease-in-out infinite',
  'check-bounce':  'check-bounce 360ms cubic-bezier(0.34, 1.56, 0.64, 1)',
},
```

> **Tokens removidos em v2** (eram definidos em v1 e foram descartados ao eliminar `PointsVault`, `QuickLinks` e as quick pills do header):
> - `--vault-bg`, `--vault-border`, `--vault-border-hover`, `--vault-shadow`, `--vault-shadow-hover`
> - `--gold-numeral-light` (substituído por `--stat-numeral-gradient`, nome mais explícito)
> - `--pill-bg`, `--pill-bg-hover`, `--pill-border`, `--pill-border-hover`, `--pill-bg-featured`, `--pill-border-featured`
> - `--empty-lotteries-bg`, `--empty-lotteries-border`
> - Keyframes `vault-shimmer`
> - BackgroundImage Tailwind: `vault`, `gold-numeral-light`, `empty-lotteries`
> - BoxShadow Tailwind: `vault`, `vault-hover`
>
> Se já tiverem sido merged em `src/styles/tokens.css` e `tailwind.config.js` na implementação da v1, **remover na mesma passagem** para não deixar lixo.

---

## 5. Class map sugerido (componentes do dashboard v2)

| Papel                                    | Classes Tailwind sugeridas                                                                                                            |
|------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| Body (nível `<main>` da rota)            | `min-h-screen bg-dash-page text-fortuno-black`                                                                                        |
| Header escuro                            | `bg-dash-header text-fortuno-offwhite relative overflow-hidden isolate`                                                               |
| Header container interno                 | `relative z-10 mx-auto max-w-7xl px-6 pt-6 pb-6 md:pt-8 md:pb-8` (antes: `pt-12 pb-20 md:pt-16 md:pb-24` — densidade ~2,5x)           |
| Header grid (desktop)                    | `grid lg:grid-cols-[auto_1fr_auto_auto] items-center gap-5`                                                                           |
| Header grid (tablet/mobile)              | `grid-cols-[auto_1fr]` + chips ocupam linha 2 em `grid-cols-2` (tablet) ou `grid-cols-1` (mobile)                                     |
| Avatar wrapper                           | `relative w-[52px] h-[52px] rounded-full isolate before:content-[''] before:absolute before:-inset-[2px] before:rounded-full before:bg-avatar-ring before:-z-10 before:animate-avatar-breath` |
| Avatar core                              | `w-full h-full rounded-full bg-gradient-to-br from-fortuno-green-elegant to-fortuno-green-deep border-2 border-fortuno-gold-soft/30 grid place-items-center font-display italic font-bold text-fortuno-gold-soft text-[20px] tracking-tight` |
| HeaderChip base (unificado)              | `relative inline-flex items-center gap-2.5 pl-[14px] pr-2.5 py-2 rounded-[14px] bg-chip-glass border border-[color:var(--chip-glass-border)] backdrop-blur-md transition-colors duration-noir-base hover:border-[color:var(--chip-glass-border-hover)] min-h-[56px]` |
| HeaderChip lead icon                     | `w-8 h-8 rounded-[10px] bg-[color:var(--chip-lead-bg)] border border-[color:var(--chip-lead-border)] text-fortuno-gold-soft grid place-items-center shrink-0` |
| HeaderChip label                         | `block text-[9px] font-semibold tracking-[0.26em] uppercase text-fortuno-offwhite/65 leading-none`                                    |
| HeaderChip value (numeral Playfair)      | `block font-display font-bold text-[22px] leading-[1.05] text-fortuno-gold-soft tabular-nums mt-[3px]`                                |
| HeaderChip value-unit ("pts")            | `text-[11px] font-sans font-semibold tracking-[0.12em] uppercase text-fortuno-gold-intense/75 ml-1`                                   |
| HeaderChip action pill (text CTA)        | `inline-flex items-center gap-1 px-2.5 h-8 min-w-[44px] rounded-full bg-[color:var(--chip-action-bg)] border border-[color:var(--chip-action-border)] text-fortuno-gold-soft text-[11px] font-semibold tracking-wide transition-all duration-noir-fast hover:bg-fortuno-gold-soft hover:text-fortuno-black hover:-translate-y-px focus-visible:outline-none focus-visible:shadow-gold-focus shrink-0` |
| HeaderChip copy button (icon-only)       | `inline-flex items-center justify-center w-8 h-8 rounded-full bg-[color:var(--chip-action-bg)] border border-[color:var(--chip-action-border)] text-fortuno-gold-soft transition-all duration-noir-fast hover:bg-fortuno-gold-soft hover:text-fortuno-black hover:rotate-[8deg] hover:scale-110 focus-visible:outline-none focus-visible:shadow-gold-focus shrink-0` |
| LinkedStatCard                           | `relative flex flex-col gap-2 p-[18px] pb-4 bg-white border border-[color:var(--card-paper-border)] rounded-2xl shadow-paper overflow-hidden no-underline text-inherit transition-all duration-noir-base ease-noir-spring hover:-translate-y-0.5 hover:border-[color:var(--card-paper-border-hover)] hover:shadow-paper-hover focus-visible:outline-none focus-visible:shadow-gold-focus min-h-[148px] before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-px before:bg-card-gold-bar before:opacity-80` |
| LinkedStatCard stat-icon                 | `w-[34px] h-[34px] rounded-[10px] bg-gradient-to-b from-[#faf3e1] to-[#f0e3b8] text-fortuno-gold-intense grid place-items-center border border-fortuno-gold-intense/25 shrink-0` |
| LinkedStatCard numeral (Playfair 44px)   | `font-display italic font-extrabold text-[44px] leading-[0.92] tracking-[-0.03em] bg-stat-numeral bg-clip-text text-transparent tabular-nums` |
| LinkedStatCard stat-divider              | `h-px bg-gold-divider-soft my-1`                                                                                                       |
| LinkedStatCard stat-cta                  | `inline-flex items-center gap-1.5 text-xs font-semibold text-fortuno-gold-intense transition-colors duration-noir-base group-hover:text-fortuno-green-elegant` (usar `group` no `<a>` do card) |
| Lottery row                              | `grid grid-cols-[40px_1fr_auto] gap-3.5 items-center p-3 px-4 rounded-xl bg-white border border-fortuno-black/[0.06] transition-all duration-noir-base hover:border-fortuno-gold-intense/45 hover:bg-[#fffdf6] hover:-translate-y-px hover:shadow-[0_6px_14px_-10px_rgba(10,42,32,0.18)]` |
| Lottery row icon                         | `w-10 h-10 rounded-[10px] bg-marker-done text-fortuno-gold-soft grid place-items-center border border-fortuno-gold-soft/30`            |
| CTA primary (compact)                    | `inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-fortuno-gold-intense text-fortuno-black font-bold text-[13px] tracking-wide shadow-[0_8px_22px_-6px_rgba(212,175,55,0.45),0_1px_0_rgba(255,255,255,0.35)_inset] transition-all duration-noir-fast hover:bg-fortuno-gold-soft hover:-translate-y-px focus-visible:outline-none focus-visible:shadow-gold-focus min-h-[40px]` |
| CTA ghost-light (compact)                | `inline-flex items-center gap-1.5 px-[18px] py-2.5 rounded-full bg-transparent text-fortuno-green-elegant border border-fortuno-green-elegant/25 font-semibold text-[12px] transition-colors duration-noir-fast hover:bg-fortuno-gold-intense/10 hover:border-fortuno-gold-intense focus-visible:outline-none focus-visible:shadow-gold-focus min-h-[40px]` |
| Footer band                              | `bg-dash-footer text-fortuno-offwhite relative overflow-hidden py-4 md:py-5 before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gold-divider before:opacity-55` |
| Footer grid                              | `grid md:grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-6`                                                                        |
| Footer tagline                           | `font-display text-fortuno-offwhite text-sm md:text-base leading-tight`                                                                |
| Footer ornament                          | `inline-flex items-center gap-1.5 text-fortuno-gold-soft/55 before:content-[''] before:w-[18px] before:h-px before:bg-fortuno-gold-soft/35 after:content-[''] after:w-[18px] after:h-px after:bg-fortuno-gold-soft/35` (esconder em mobile) |
| Footer link                              | `text-fortuno-offwhite/70 text-xs font-medium inline-flex items-center gap-1.5 px-1.5 py-1 rounded-md transition-colors duration-noir-fast hover:text-fortuno-gold-soft focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(212,175,55,0.55)]` |
| Eyebrow (light bg)                       | `text-[10px] font-semibold tracking-[0.26em] uppercase text-fortuno-black/55`                                                         |
| Eyebrow (dark bg)                        | `text-[10px] font-semibold tracking-[0.26em] uppercase text-fortuno-offwhite/60`                                                      |
| Eyebrow gold accent                      | `text-fortuno-gold-intense`                                                                                                           |
| Focus ring global                        | `focus-visible:outline-none focus-visible:shadow-gold-focus` (idêntico wizard/home)                                                   |

---

## 6. Acessibilidade — checks específicos do dashboard v2

- **Contraste corpo (light)**:
  - `fortuno-black (#0b0b0b)` sobre `#f7f3ec`: **17.4:1** AAA.
  - `fortuno-black/58` sobre `#ffffff` (stat-label): **~8:1** AA+.
  - `fortuno-gold-intense (#b8963f)` sobre `#ffffff`: **3.6:1** — usado apenas em **ícones** e em **CTAs `stat-cta`** que são `font-semibold text-xs (12px)` + acompanhados de seta (ícone). Para um stat-cta, o accessible name é composto pelo conjunto (label + numeral + cta) via `aria-labelledby`, garantindo que screen readers anunciem todo o card. O texto da seta ouro em 12px cumpre o papel de "chamada" — mas a leitura real acontece pelo `aria-labelledby` no `<a>`, não pelo texto visual. Se usuário de baixa visão depender apenas do contraste visual, o numeral 44px em gradient ouro→verde tem **forma de letra** fortemente legível e a cor verde-elegant do anchor do gradient garante contraste 9.8:1 na parte inferior do número.
  - `fortuno-green-elegant (#134436)` sobre `#ffffff`: **9.8:1** AAA — usado no hover do stat-cta e em CTAs ghost-light.

- **Contraste header (dark)** (idêntico ao wizard/home):
  - `offwhite` sobre `green-deep`: 13.1:1 AAA.
  - `gold-soft` sobre `green-deep`: 6.8:1 AAA — usado nos chip-values (numeral Playfair 22px).
  - `gold-intense (#b8963f)` sobre `green-deep`: 4.7:1 AA — usado só no "pts" uppercase 11px (letra bold + tracking amplo = legível).

- **HeaderChip (ReferralChip + PointsChip)**:
  - `<div role="group" aria-labelledby="ref-label">` (ou `pts-label`) envolve label + valor + action.
  - O `<span>` com o código referral tem `aria-live="polite"` (eventual regeneração futura).
  - O `chip-value` do PointsChip tem `aria-label="1.247 pontos acumulados"` (anúncio completo; o separador `.` do pt-BR pode ser lido de forma irregular pelos screen readers sem o label explícito).
  - Botão copy: `aria-label="Copiar código de indicação FORT-XXXX"` (label dinâmico com o valor).
  - Link "Extrato": `aria-label="Ver extrato de pontos"` (o texto visível "Extrato" sozinho é ambíguo sem contexto).
  - **Touch target**: tanto `chip-copy` quanto `chip-action` têm 32×32px visuais + `min-width: 44px` no action (e `min-h-[56px]` no chip inteiro garante região tappável extendida ao redor via padding). Para strict compliance HIG, aceitar trade-off visual ou aumentar o action para 40px altura se o time preferir — documentar no QA.

- **LinkedStatCard (trio de stats)**:
  - Cada card é um `<a>` único com `aria-labelledby="stat-X-label stat-X-value"` — screen reader anuncia "Bilhetes comprados, 47, link" em uma única unidade.
  - A seta decorativa é `aria-hidden="true"`.
  - Hover e focus são **equivalentes**: translate-Y -2px + border ouro + sombra elevada. Teclado tem a mesma experiência de mouse.
  - Altura mínima `min-h-[148px]` (mobile `min-h-[132px]`) para consistência visual entre cards — não interfere com touch targets porque o card inteiro é clickable (≫ 44×44).

- **Lottery row**:
  - Ícone + texto de status (sempre combinados) — cor não é único indicador.
  - O `<a>` "Gerenciar" é o único elemento focável da row — evita conflito.

- **Avatar com ring rotativo**:
  - Wrapper `aria-hidden="true"` (decorativo); a saudação textual já comunica.
  - `prefers-reduced-motion` desliga a rotação (regra global cobre).

- **Footer band compacta**:
  - `<footer aria-labelledby="footer-title">` com `<h2 id="footer-title" class="sr-only">`.
  - `<nav aria-label="Rodapé — suporte e contato">` em volta dos links.
  - Footer-link tem área tappável visual ~24×24 mas `padding: 4px 6px` + espaçamento gap-x-4 garante separação ≥ 8px entre links. Em mobile, links empilham (grid-cols-1) — cada linha tem área completa para toque (~44px de largura útil).

---

## 7. Respeito a `prefers-reduced-motion`

A regra global do wizard (`*` em `src/styles/index.css`) cobre:

- `avatar-breath` → ring fica estático.
- `check-bounce` → check aparece direto.
- `live-pulse` (dot do "Aberto") → dot fica estático em ouro.
- Hovers de translate-Y → desligados (`transition-duration: 1ms`).

Nenhuma animação "cinematográfica" adicional foi introduzida na v2 — o ritmo é operacional.

---

## 8. Diferenças de tom em relação à home e à v1 do dashboard

| Aspecto              | Home (público)                              | Dashboard v1 (Editorial rich)                              | Dashboard v2 (Editorial compact)                          |
|----------------------|---------------------------------------------|------------------------------------------------------------|------------------------------------------------------------|
| Body bg              | `bg-noir-page` (escuro radical)             | `bg-dash-page` (papel claro)                               | Idem v1                                                    |
| Header               | Hero editorial cinematográfico              | Header grande + saudação 52px + quick pills                | Header compacto + saudação 28px + 2 chips (ref + points)  |
| Hero do painel       | Vitrine wide com countdown                  | `PointsVault` monumental (numeral 120px em ouro)           | **Sem hero** — pontos viram chip 22px no header            |
| Cards                | "Casino card" verde-deep                    | Paper card + vault card + quicklink card + stat paper      | **Paper card unificado** (LinkedStat) + lottery row        |
| Numerais             | `gold-numeral` com fade transparent         | `gold-numeral-light` (cofre 120px, stats 44px)             | **Só stat-numeral 44px** (cofre removido)                  |
| Particles            | Sim (hero)                                  | Não (shimmer só no vault hover)                            | Não (nenhum shimmer)                                       |
| Densidade            | Editorial-show (empilhamento longo)         | Operacional-elegante (3-4 seções)                          | **Operacional-máxima** (~1080px cabe em 1 viewport)        |
| Altura total desktop | ~3500-4200px                                | ~2400-2800px                                               | **~900-1080px** (sem lotteries ~700-780px)                 |

---

## 9. Referências cruzadas

- Wizard: `design/wizard-vertical/{tokens.md, spec.md, mockup.html}` — base de tokens.
- Home: `design/home/{tokens.md, spec.md, mockup.html}` — primitivo `GoldNumeral` reutilizado.
- Mockup compacto do dashboard: `design/dashboard/mockup.html`.
- Spec de implementação: `design/dashboard/spec.md`.
