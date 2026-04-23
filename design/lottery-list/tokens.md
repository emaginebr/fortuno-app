# Design Tokens — Lottery List (`/sorteios`) "Editorial Casino Noir · light body"

Direção: **Editorial Casino Noir**, variante **light body** (mesmo padrão do `dashboard` e do `lottery-detail`). Esta página **NÃO introduz cores brutas novas** — todas as composições derivam das 6 variáveis mestras já existentes em `src/styles/tokens.css`:

- `--fortuno-green-deep` `#0a2a20`
- `--fortuno-green-elegant` `#134436`
- `--fortuno-gold-intense` `#b8963f`
- `--fortuno-gold-soft` `#d4af37`
- `--fortuno-black` `#0b0b0b`
- `--fortuno-offwhite` `#ece8e1`

Tipografia permanece: **Inter** (UI) + **Playfair Display** (display/numeral).

---

## 1. Tokens reutilizados (ZERO duplicação no projeto)

A página consome, sem redefinir:

| Token                                    | Origem                                  | Uso em `/sorteios`                                      |
|------------------------------------------|-----------------------------------------|---------------------------------------------------------|
| `--dash-bg-page`                         | `design/dashboard/tokens.md`            | Fundo claro do `<main>` (paper gradient)                |
| `--metal-casino-card`                    | `design/home/tokens.md §2`              | Superfície dark do `LotteryCardPremium`                 |
| `--shadow-noir-card` / `-hover`          | `design/home/tokens.md`                 | Elevação e hover dos cards premium                      |
| `--badge-live-bg / -border / -dot`       | `design/home/tokens.md §2`              | Badge "Aberto" pulsante                                 |
| `--rail-fill` + `progress-shimmer`       | `design/wizard-vertical/tokens.md`      | Progress bar de bilhetes dentro do card                 |
| `--gold-divider`                         | `design/wizard-vertical/tokens.md`      | Ornamento art déco do header da listagem                |
| `--shadow-gold-focus`                    | `design/wizard-vertical/tokens.md`      | Focus ring em TODOS os chips/botões de paginação        |
| `--duration-fast / -base`, `--easing-*`  | `design/wizard-vertical/tokens.md`      | Transições de hover, pagination e sort chip             |
| Keyframes `live-pulse`, `progress-shimmer` | `design/home/tokens.md §3`            | Badge + progress bar (sem redeclaração)                 |
| Classes Tailwind já expostas             | `tailwind.config.js` (home/wizard)      | `font-display`, `bg-fortuno-*`, `shadow-noir-card*`, `animate-live-pulse`, `animate-progress-shimmer` |

**Regra**: se um desses tokens já está em `src/styles/tokens.css` por conta da home/wizard/dashboard, o `frontend-react-developer` **não deve redeclarar**. Apenas consumir.

---

## 2. Tokens NOVOS — anexar em `src/styles/tokens.css`

Estes tokens são exclusivos da rota `/sorteios`. Anexar ao final do arquivo, após o bloco do dashboard:

```css
/* ===========================================================
   LOTTERY LIST (/sorteios) — Editorial Casino Noir · light body
   Tokens específicos da lista pública paginada.
   Anexar APÓS o bloco do dashboard (não substituir nada).
   =========================================================== */

/* --- Ornamento art déco do header da página (filete horizontal duplo) --- */
--list-ornament-line: linear-gradient(90deg,
  transparent 0%,
  rgba(184, 150, 63, 0.55) 45%,
  rgba(184, 150, 63, 0.55) 55%,
  transparent 100%);

/* --- Sombras do card premium quando exibido sobre fundo light
       (os cards da /sorteios rodam sobre paper, não sobre noir-page
       como na home — precisam de uma sombra ligeiramente diferente
       pra ler o "dark card sobre paper" sem ficar chato). --- */
--shadow-card-on-paper:
  0 1px 0 rgba(255, 255, 255, 0.06) inset,
  0 22px 44px -22px rgba(10, 42, 32, 0.35),
  0 10px 22px -10px rgba(184, 150, 63, 0.20);
--shadow-card-on-paper-hover:
  0 1px 0 rgba(255, 255, 255, 0.08) inset,
  0 36px 64px -26px rgba(10, 42, 32, 0.50),
  0 18px 32px -12px rgba(184, 150, 63, 0.35);

/* --- Pill de paginação (base glass papel) --- */
--pagination-bg:
  linear-gradient(180deg, rgba(255, 255, 255, 0.90), rgba(247, 243, 236, 0.85));
--pagination-border: rgba(11, 11, 11, 0.10);
--pagination-shadow:
  0 1px 0 rgba(255, 255, 255, 0.80) inset,
  0 8px 22px -14px rgba(10, 42,9, 0.22);

/* --- Chip de página: estados --- */
--pagination-chip-ghost-bg:      transparent;
--pagination-chip-ghost-hover:   rgba(184, 150, 63, 0.10);
--pagination-chip-active-bg:
  linear-gradient(180deg, #d4af37, #b8963f); /* gold-soft → gold-intense */
--pagination-chip-active-fg:     #0a2a20;     /* green-deep (contraste ≥ 7:1) */
--pagination-chip-active-shadow:
  0 1px 0 rgba(255, 255, 255, 0.35) inset,
  0 6px 14px -6px rgba(184, 150, 63, 0.60);
--pagination-chip-disabled-fg:   rgba(11, 11, 11, 0.35);

/* --- Chip "Ordenar" (sort placeholder, client-side) --- */
--sort-chip-bg:     rgba(255, 255, 255, 0.85);
--sort-chip-border: rgba(11, 11, 11, 0.10);
--sort-chip-hover:  rgba(184, 150, 63, 0.35);

/* --- Deadline chip urgente (card, <7 dias) --- */
--deadline-urgent-fg:     #f0d27a;
--deadline-urgent-border: rgba(240, 210, 122, 0.60);
--deadline-urgent-bg:     rgba(0, 0, 0, 0.60);

/* --- Empty state (card dourado tracejado sobre paper) --- */
--empty-bg:
  radial-gradient(420px 220px at 50% 0%, rgba(184, 150, 63, 0.10), transparent 70%),
  linear-gradient(180deg, rgba(255, 255, 255, 0.70), rgba(247, 243, 236, 0.55));
--empty-border: rgba(184, 150, 63, 0.55);
--empty-icon-bg:
  radial-gradient(closest-side, rgba(184, 150, 63, 0.16), transparent 70%),
  rgba(255, 255, 255, 0.75);
--empty-icon-border: rgba(184, 150, 63, 0.35);

/* --- Skeleton shimmer para card de loading --- */
--skeleton-block-bg: rgba(236, 232, 225, 0.06);
--skeleton-shimmer:
  linear-gradient(90deg,
    transparent 0%,
    rgba(212, 175, 55, 0.10) 40%,
    rgba(212, 175, 55, 0.18) 50%,
    rgba(212, 175, 55, 0.10) 60%,
    transparent 100%);
```

---

## 3. Extensão de `tailwind.config.js` (merge — NÃO substituir)

Anexar dentro de `theme.extend` já existente, preservando tudo que wizard/home/dashboard já escreveram:

```js
// tailwind.config.js — theme.extend (merge)
boxShadow: {
  // ...wizard/home/dashboard
  'card-on-paper':       'var(--shadow-card-on-paper)',
  'card-on-paper-hover': 'var(--shadow-card-on-paper-hover)',
  'pagination':          'var(--pagination-shadow)',
  'pagination-chip':     'var(--pagination-chip-active-shadow)',
},
backgroundImage: {
  // ...wizard/home/dashboard
  'list-ornament-line':    'var(--list-ornament-line)',
  'pagination':            'var(--pagination-bg)',
  'pagination-chip-active':'var(--pagination-chip-active-bg)',
  'empty-card':            'var(--empty-bg)',
  'empty-icon':            'var(--empty-icon-bg)',
  'skeleton-shimmer':      'var(--skeleton-shimmer)',
},
keyframes: {
  // ...home (live-pulse, progress-shimmer etc — já existentes; NÃO redeclarar)
  'skeleton-slide': {
    '0%':   { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
},
animation: {
  // ...home
  'skeleton-slide': 'skeleton-slide 1.8s linear infinite',
},
```

> **Importante**: a keyframe `skeleton-slide` é a ÚNICA adição nova nesta página. Todas as outras animações (`live-pulse`, `progress-shimmer`) já existem em `tailwind.config.js` pela home — não redeclarar.

---

## 4. Class map sugerido (componentes da /sorteios)

| Papel                                  | Classes Tailwind                                                                                                        |
|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| Fundo do `<main>` da página            | `relative` (o gradient paper vem do `AuthenticatedShell` → `bg-[image:var(--dash-bg-page)]`)                            |
| Container principal                    | `mx-auto max-w-7xl px-6`                                                                                                |
| Ornamento art déco (flex com linha+diamante) | `flex items-center justify-center gap-3.5` + dois `::before/::after` com `bg-list-ornament-line`                   |
| Diamante central do ornamento          | `w-2 h-2 rotate-45 bg-fortuno-gold-intense shadow-[0_0_10px_rgba(184,150,63,0.55)]`                                    |
| Eyebrow gold                           | `text-[11px] tracking-[0.28em] uppercase text-fortuno-gold-intense font-semibold inline-flex items-center gap-2`       |
| Título da página (H1)                  | `font-display font-bold leading-[1.05] tracking-[-0.02em] text-fortuno-black text-[clamp(34px,4.5vw,56px)]`            |
| Subhead editorial                      | `text-fortuno-black/68 mt-3 text-base md:text-lg max-w-2xl mx-auto`                                                     |
| Sort chip                              | `inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-sort-chip border border-fortuno-black/10 text-sm hover:border-fortuno-gold-intense/55 hover:-translate-y-px transition-all duration-base focus-visible:shadow-gold-focus` |
| Lottery card wrapper                   | `group relative flex flex-col overflow-hidden rounded-[20px] border border-fortuno-gold-soft/32 bg-metal-casino shadow-card-on-paper hover:shadow-card-on-paper-hover hover:-translate-y-1.5 hover:border-fortuno-gold-soft/60 transition-all duration-base ease-noir-spring` |
| Filete ouro interno do card (::before) | `absolute inset-2 rounded-[14px] border border-fortuno-gold-soft/18 pointer-events-none z-[2]`                          |
| Grid de cards                          | `grid gap-6 sm:grid-cols-2 lg:grid-cols-3`                                                                              |
| Image wrapper (aspect-[16/10])         | `relative aspect-[16/10] overflow-hidden rounded-t-[20px]`                                                              |
| Overlay sob imagem                     | `absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent`                                        |
| Badge "Aberto"                         | `badge-live` (reuso direto da home, já existe)                                                                          |
| Deadline chip (>=7d)                   | `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.18em] font-semibold bg-black/55 border border-fortuno-gold-soft/32 text-fortuno-gold-soft backdrop-blur-sm` |
| Deadline chip URGENT (<7d)             | idem + `!text-[color:var(--deadline-urgent-fg)] !border-[color:var(--deadline-urgent-border)] !bg-[color:var(--deadline-urgent-bg)]` + dot pulsante |
| CalendarClock chip (data do raffle)    | `inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] uppercase tracking-[0.18em] bg-fortuno-gold-soft/10 border border-fortuno-gold-soft/30 text-fortuno-gold-soft` |
| Paginação wrapper                      | `inline-flex items-center gap-1.5 p-1.5 rounded-full bg-pagination border border-fortuno-black/10 shadow-pagination backdrop-blur-sm` |
| Chip de página (ghost)                 | `min-w-[40px] h-10 px-3.5 inline-flex items-center justify-center rounded-full text-sm font-semibold text-fortuno-black font-variant-numeric-tabular transition-colors duration-fast hover:bg-fortuno-gold-intense/10 focus-visible:shadow-gold-focus` |
| Chip de página (ativo)                 | `bg-pagination-chip-active text-fortuno-green-deep shadow-pagination-chip`                                              |
| Chip de página (setas)                 | idem ghost + `gap-1.5 font-medium text-[13px] px-3.5`                                                                   |
| Ellipsis                               | `min-w-[28px] text-center text-fortuno-black/45 tracking-wider select-none`                                             |
| Empty state card                       | `relative max-w-2xl mx-auto rounded-3xl p-12 text-center overflow-hidden bg-empty-card border-2 border-dashed border-fortuno-gold-intense/55` |
| Empty state icon wrap                  | `inline-grid place-items-center w-[72px] h-[72px] rounded-full bg-empty-icon border border-fortuno-gold-intense/35 text-fortuno-gold-intense mb-4` |
| Skeleton card wrapper                  | `skeleton-card relative flex flex-col overflow-hidden rounded-[20px] border border-fortuno-gold-soft/22 bg-metal-casino shadow-card-on-paper min-h-[480px]` |
| Skeleton block                         | `relative overflow-hidden rounded-lg bg-skeleton-block after:absolute after:inset-0 after:bg-skeleton-shimmer after:-translate-x-full after:animate-skeleton-slide` |
| Focus ring global                      | `focus-visible:outline-none focus-visible:shadow-gold-focus`                                                            |

> As classes utilitárias usadas acima que referenciam `bg-sort-chip`, `bg-skeleton-block`, `bg-empty-card`, `bg-metal-casino` e similares dependem do `theme.extend` novo e/ou do já existente. Se preferir, o dev pode usar `bg-[color:var(--sort-chip-bg)]` inline em vez de cadastrar utilitário — ambas as formas são aceitas no projeto (o wizard usa inline arbitrário; home usa utilitário nomeado). Mantenha consistência com a abordagem dominante do arquivo onde está implementando.

---

## 5. Acessibilidade — checks específicos

- **Numerais de paginação** usam `font-variant-numeric: tabular-nums` — números não "dançam" ao trocar página.
- **Chip ativo**: gold-soft→gold-intense sobre texto `green-deep` (#0a2a20) → contraste ~10:1 AAA. Sempre ter `aria-current="page"` (cor nunca é o único indicador — o fundo dourado sólido + peso do texto já diferenciam).
- **Chip ghost/hover**: texto `fortuno-black` sobre paper `#f7f3ec` → ~17:1 AAA.
- **Deadline chip urgente**: `#f0d27a` sobre `rgba(0,0,0,0.6)` → ~8:1 AAA. O dot pulsante é SECUNDÁRIO ao texto "Encerra em 2d".
- **Ornamento art déco**: `aria-hidden="true"` — é decoração, screen reader ignora.
- **Empty state**: headline + body + CTA são lidos na ordem natural. O ícone `Sparkles` tem `aria-hidden="true"` (ornamental).
- **Skeleton card**: wrapper com `aria-busy="true"` + `aria-live="polite"` + `aria-label="Carregando sorteio"`. Screen reader anuncia "Carregando sorteio, ocupado".
- **Página anunciada**: `<span class="sr-only" aria-live="polite">Página 3 de 5. Exibindo 9 sorteios.</span>` atualiza ao trocar de página — screen reader fala sem precisar reescanear a página.
- **Contraste de texto sobre card dark**: `offwhite` sobre `metal-casino` → ~13:1 AAA. Textos `offwhite/60` (auxiliares) → ~8:1 AA+.

---

## 6. `prefers-reduced-motion`

A página **respeita a regra global** já em `src/styles/index.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

Efeito sobre `/sorteios`:

- Hover lift dos cards: instantâneo (sem translate-y animado).
- Badge "Aberto" pulsante: para (dot permanece visível).
- Progress shimmer: para (a barra permanece preenchida).
- Skeleton shimmer: para (blocos cinzas ficam estáticos — legível ainda assim).
- Smooth scroll ao trocar de página: trocar `scrollTo({ behavior: 'smooth' })` por `behavior: 'auto'` quando `window.matchMedia('(prefers-reduced-motion: reduce)').matches`. Ver spec §7.

---

## 7. Referências cruzadas

- Home (origem do `LotteryCardPremium`, badge-live, progress-rail, gold-numeral): `design/home/{mockup.html, tokens.md, spec.md}`.
- Dashboard (origem do light body paper gradient): `design/dashboard/tokens.md §1`.
- Lottery Detail (outro consumidor do padrão card dark sobre paper): `design/lottery-detail/`.
- Wizard vertical (focus ring, easings, durations): `design/wizard-vertical/tokens.md §2-3`.
- Mockup desta página: `design/lottery-list/mockup.html`.
- Spec de implementação: `design/lottery-list/spec.md`.
