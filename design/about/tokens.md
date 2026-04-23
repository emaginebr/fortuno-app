# Design Tokens — About "Editorial Casino Noir"

Direção: **Editorial Casino Noir** — mesma do wizard/home/dashboard. A página
`/quem-somos` **reutiliza integralmente** os tokens já definidos em:

- `design/wizard-vertical/tokens.md` (tokens base)
- `design/home/tokens.md` (hero cinematográfico, stats band dark, fraud certificate, closing CTA, security pillars, how-it-works timeline)
- `design/dashboard/tokens.md` (variante LIGHT BODY: `--dash-bg-page`, `--card-paper-border`, `--shadow-paper`, `--shadow-paper-hover`, `--card-gold-bar`, `--gold-divider-soft`)

Apenas 3 blocos são **novos** nesta página institucional e estão documentados
abaixo. Todo o resto consome o que já foi publicado.

---

## 1. Tokens reutilizados (referência rápida)

| Token / Classe                          | Origem                           | Uso em `/quem-somos`                                         |
|-----------------------------------------|----------------------------------|--------------------------------------------------------------|
| `--dash-bg-page`                        | `dashboard/tokens.md`            | Fundo claro da página inteira (corpo institucional)          |
| `--card-paper-border`, `--shadow-paper` | `dashboard/tokens.md`            | `ValuesPillars` (cards brancos)                               |
| `--card-gold-bar`                       | `dashboard/tokens.md`            | Linha ouro 1px no topo dos pilares                           |
| `--gold-divider`, `--gold-divider-v`    | `home/tokens.md` + wizard        | Divisores ornamentais de seção e entre stats                  |
| `--gold-divider-soft`                   | `dashboard/tokens.md`            | Divisor interno dos pilares e faixa inferior                  |
| `--noir-certificate-bg`                 | `home/tokens.md`                 | Reuso 100% do `FraudCertificate` (seção 6)                   |
| `--noir-bg-final-cta`                   | `home/tokens.md`                 | Fundo do `AboutClosingCta` (renomeado como `--noir-closing-bg` localmente, mesmo valor) |
| `--topbar-bg`                           | `dashboard/tokens.md`            | Topbar global (Header.tsx do AuthenticatedShell)             |
| `--duration-*`, `--easing-*`            | wizard                           | Transições                                                    |
| `cta-primary`, `cta-ghost`              | home                             | CTAs globais (hero + closing)                                 |

> Nada disso deve ser redeclarado em `src/styles/tokens.css`. Se já foi definido
> para home/dashboard, a página about **consome direto** via Tailwind arbitrary
> values ou classes utilitárias já mapeadas.

---

## 2. Tokens NOVOS — anexar em `src/styles/tokens.css`

```css
/* ===========================================================
   ABOUT — Editorial Casino Noir (tokens exclusivos)
   Anexar APÓS os blocos do wizard, home e dashboard.
   =========================================================== */

/* --- Hero about: halo ouro lateral sutil sobre corpo claro --- */
--about-hero-halo:
  radial-gradient(650px 350px at 88% 45%, rgba(184, 150, 63, 0.12), transparent 65%),
  radial-gradient(900px 500px at 10% 110%, rgba(19, 68, 54, 0.05), transparent 55%);

/* --- Drop cap (capitular editorial — seção Missão) --- */
--dropcap-font-size: 5.4em;
--dropcap-line-height: 0.82;
--dropcap-fg: var(--fortuno-gold-intense);
--dropcap-gradient: linear-gradient(
  180deg,
  var(--fortuno-gold-soft) 0%,
  var(--fortuno-gold-intense) 60%,
  var(--fortuno-green-elegant) 140%
);

/* --- Quote ornamental editorial (missão) --- */
/* Cobre queimado: não vermelho, não ouro pleno — tom institucional "newspaper" */
--quote-copper:        #8a5a2b;
--quote-border:        rgba(184, 150, 63, 0.35);
--quote-mark-opacity:  0.38;
--quote-mark-size:     88px;

/* --- Timeline horizontal institucional (variante LIGHT) --- */
/* Trilha ouro com nuance verde no centro (diferente do rail dark da home) */
--timeline-rail-light: linear-gradient(
  90deg,
  transparent,
  rgba(184, 150, 63, 0.55),
  rgba(19, 68, 54, 0.55),
  rgba(184, 150, 63, 0.55),
  transparent
);
--timeline-marker-size: 18px;
--timeline-marker-bg:
  radial-gradient(120% 120% at 30% 20%, #f0d27a 0%, #c79b41 45%, #8a6a25 100%);
--timeline-marker-ring: 0 0 0 1px rgba(184, 150, 63, 0.45),
                        0 4px 10px -2px rgba(184, 150, 63, 0.55);
```

---

## 3. Extensão de `tailwind.config.js` (merge, NÃO substituir)

Adicionar dentro do `theme.extend` existente — apenas as chaves novas:

```js
// tailwind.config.js — theme.extend (merge com wizard + home + dashboard)
backgroundImage: {
  // ...wizard + home + dashboard
  'about-hero-halo':   'var(--about-hero-halo)',
  'timeline-rail-light': 'var(--timeline-rail-light)',
  'timeline-marker':   'var(--timeline-marker-bg)',
},
```

Nenhum `keyframes` ou `animation` novo é necessário — a página reaproveita o
`count-up` do stats band (home), as transições padrão e o scroll-driven
`@supports (animation-timeline: view())` já documentados.

---

## 4. Class map sugerido (apenas componentes da página about)

| Papel                                     | Classes Tailwind                                                                                 |
|-------------------------------------------|--------------------------------------------------------------------------------------------------|
| Fundo da página                           | `bg-[color:var(--dash-bg-page)] text-fortuno-black min-h-screen`                                 |
| Hero (banda)                              | `relative bg-about-hero-halo py-16 md:py-24`                                                     |
| Hero eyebrow                              | `inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-fortuno-gold-intense font-semibold` |
| Hero title                                | `font-display leading-[1.02] text-fortuno-black` + `clamp(40px, 6vw, 72px)`                      |
| Hero art (wrapper SVG cofre)              | `relative aspect-[4/5] rounded-[22px] border border-fortuno-gold-intense/28 bg-[linear-gradient(180deg,#faf5e8,#ece8e1)] shadow-paper` |
| Stats band wrapper                        | `relative border-y border-fortuno-gold-intense/18`                                               |
| Stats numeral (light)                     | `font-display italic font-bold leading-none bg-gradient-to-b from-fortuno-gold-soft via-fortuno-gold-intense to-fortuno-green-elegant bg-clip-text text-transparent tabular-nums` |
| Stats label                               | `text-[11px] uppercase tracking-[0.26em] text-fortuno-black/55 font-semibold`                    |
| Stat divider vertical (light)             | `w-px self-stretch bg-gradient-to-b from-transparent via-fortuno-gold-intense/40 to-transparent hidden md:block` |
| Mission body                              | `text-[17px] md:text-[18px] leading-[1.75] text-fortuno-black/82 max-w-[62ch]`                    |
| Mission drop cap                          | `first-letter:font-display first-letter:italic first-letter:text-[5.4em] first-letter:leading-[0.82] first-letter:float-left first-letter:mr-2 first-letter:bg-gradient-to-b first-letter:from-fortuno-gold-soft first-letter:via-fortuno-gold-intense first-letter:to-fortuno-green-elegant first-letter:bg-clip-text first-letter:text-transparent` |
| Mission quote                             | `relative border-l-2 border-fortuno-gold-intense/35 pl-14 pr-6 py-6 my-8 font-display italic text-[clamp(20px,2vw,26px)] leading-[1.45] text-[color:var(--quote-copper)] max-w-[60ch]` + pseudo `::before` para aspa |
| Value pillar (paper card)                 | `relative flex flex-col gap-3.5 p-7 bg-white border border-fortuno-black/[0.08] rounded-[18px] shadow-paper transition hover:-translate-y-1 hover:shadow-paper-hover hover:border-fortuno-gold-intense/45` |
| Value icon chip                           | `w-14 h-14 rounded-[14px] grid place-items-center bg-gradient-to-b from-[#faf3e1] to-[#f0e3b8] text-fortuno-gold-intense border border-fortuno-gold-intense/32 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_6px_14px_-6px_rgba(184,150,63,0.35)]` |
| Value title                               | `font-display text-[22px] leading-[1.15] text-fortuno-black`                                     |
| Value desc                                | `text-sm leading-[1.65] text-fortuno-black/68`                                                   |
| Timeline horizontal rail                  | `absolute inset-x-0 top-14 h-px bg-timeline-rail-light hidden md:block`                          |
| Timeline step numeral                     | `font-display italic font-extrabold leading-[0.85] bg-gradient-to-b from-fortuno-gold-soft via-fortuno-gold-intense to-fortuno-green-elegant bg-clip-text text-transparent text-[clamp(56px,6.5vw,84px)]` |
| Timeline marker dot                       | `w-[18px] h-[18px] rounded-full bg-timeline-marker border-2 border-white shadow-[0_0_0_1px_rgba(184,150,63,0.45),0_4px_10px_-2px_rgba(184,150,63,0.55)]` |
| Timeline icon chip                        | `inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.24em] text-fortuno-gold-intense font-semibold` |
| Closing CTA wrapper                       | `bg-noir-final relative overflow-hidden border-y border-fortuno-gold-soft/20 text-fortuno-offwhite` (reuso `home`) |

---

## 5. Acessibilidade — checks específicos

- **Drop cap**: `::first-letter` é puramente visual; screen readers leem a letra
  normalmente dentro do fluxo do parágrafo. Manter a primeira palavra natural
  (ex.: "O" de "O Fortuno") para não distorcer a semântica.
- **Quote ornamental**: `<blockquote>` com `<cite>` interna. Aspa tipográfica `\201C`
  é `::before` decorativa (`aria-hidden` implícito). Contraste `#8a5a2b` sobre
  corpo `#f1ece3` → 5.2:1, aprovado para itálico ≥ 18px.
- **Stats numerais**: `font-variant-numeric: tabular-nums`. `<span class="sr-only">`
  contém o valor final por extenso para evitar leitura do count-up.
- **Timeline horizontal**: usar `<ol>` com `aria-label="Etapas do fluxo Fortuno"`.
  Cada step é `<li>` com heading `<h3>` próprio. No mobile, o rail some e os
  markers-dot são escondidos — a numeração Playfair mantém o indicador visual
  primário.
- **Hero SVG do cofre**: `aria-hidden="true"` no `<figure>`, pois é ilustração
  decorativa complementar ao copy. O H1 textual é o conteúdo semântico.
- **Focus ring ouro**: todos os CTAs, links do nav, value-pillars (`tabindex="0"`
  para exposição como cards focáveis) usam `focus-visible:shadow-gold-focus`.

---

## 6. Respeito a `prefers-reduced-motion`

A página herda a regra global do `index.css`. Especificamente nesta página:

```css
@media (prefers-reduced-motion: reduce) {
  .stat-count { animation: none !important; }
  /* Valores finais exibidos direto (evita cells vazias) */
  .stat-count[data-target="2025"]::after  { content: '2025'; }
  .stat-count[data-target="48"]::after    { content: '48'; }
  .stat-count[data-target="15320"]::after { content: '15320'; }
  .stat-count[data-target="12400"]::after { content: '12400'; }
}
```

Hover lift dos `value-pillar` é preservado estaticamente (sem transição), mas o
estado visual final permanece alcançável via foco/hover.

---

## 7. Referências cruzadas

- Wizard:    `design/wizard-vertical/tokens.md`
- Home:      `design/home/tokens.md`
- Dashboard: `design/dashboard/tokens.md`
- Mockup:    `design/about/mockup.html`
- Spec:      `design/about/spec.md`
