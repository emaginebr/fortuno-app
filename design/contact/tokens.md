# Design Tokens — Contact "Editorial Casino Noir"

Direção: **Editorial Casino Noir** (mesma do wizard/home/dashboard/about). A
página `/fale-conosco` é a mais **curta e funcional** do site — foco em
clareza, resposta rápida e confiança institucional. Ela **reutiliza
integralmente** os tokens já publicados e adiciona apenas 4 blocos
específicos: SLA chip nos canais, campos de formulário, acordeão FAQ e
bloco institucional de borda dupla.

Tokens base consumidos (referência, sem redeclarar):

- `design/wizard-vertical/tokens.md` — tokens base
- `design/home/tokens.md` — `--noir-closing-bg`, `cta-primary`, `cta-ghost`, `--gold-divider`
- `design/dashboard/tokens.md` — `--dash-bg-page`, `--card-paper-border`, `--shadow-paper`, `--shadow-paper-hover`, `--card-gold-bar`, `--gold-divider-soft`, `--topbar-bg`
- `design/about/tokens.md` — `--contact-hero-halo` usa a mesma fórmula do `--about-hero-halo`, apenas com raios menores (hero compacto)

---

## 1. Tokens reutilizados (sem redeclarar)

| Token / Classe                               | Origem                      | Uso em `/fale-conosco`                                       |
|----------------------------------------------|-----------------------------|--------------------------------------------------------------|
| `--dash-bg-page`                             | `dashboard/tokens.md`       | Fundo claro do body                                          |
| `--topbar-bg`                                | `dashboard/tokens.md`       | Topbar global (Header do AuthenticatedShell)                 |
| `--card-paper-border`, `--shadow-paper`      | `dashboard/tokens.md`       | Channel cards, form card (`.channel-card`, `.form-card`)    |
| `--shadow-paper-hover`                       | `dashboard/tokens.md`       | Hover lift dos channel cards                                 |
| `--card-gold-bar`                            | `dashboard/tokens.md`       | Linha ouro 1px no topo do channel card e do form card        |
| `--gold-divider`, `--gold-divider-soft`      | `home/tokens.md` + wizard   | Linhas ornamentais (hero, inst-divider, footer)              |
| `--noir-closing-bg`                          | `home/tokens.md`            | Closing CTA (reuso integral)                                 |
| `.cta-primary`, `.cta-ghost`                 | `home/tokens.md`            | Botões globais (submit do form, abrir WhatsApp)              |
| `--duration-*`, `--easing-*`                 | `wizard-vertical/tokens.md` | Transições                                                   |
| `.eyebrow`, `.eyebrow .rule`                 | compartilhado               | Eyebrows de seção                                            |
| `.font-display`                              | compartilhado               | Playfair Display                                             |
| Foco global (`:focus-visible` ouro)          | compartilhado               | Inputs, CTAs, channel cards, acordeão                        |

> **Nenhum dos itens acima é redeclarado** em `src/styles/tokens.css`. A
> página contact consome direto via Tailwind arbitrary values e classes
> utilitárias já mapeadas.

---

## 2. Tokens NOVOS — anexar em `src/styles/tokens.css`

```css
/* ===========================================================
   CONTACT — Editorial Casino Noir (tokens exclusivos)
   Anexar APÓS os blocos do wizard, home, dashboard e about.
   =========================================================== */

/* --- Hero compacto: halo ouro (raios menores que o about) --- */
--contact-hero-halo:
  radial-gradient(500px 260px at 88% 50%, rgba(184, 150, 63, 0.12), transparent 65%),
  radial-gradient(700px 380px at 10% 110%, rgba(19, 68, 54, 0.05), transparent 55%);

/* --- SLA chip (badge de tempo de resposta nos channel cards) --- */
--sla-chip-bg:     rgba(184, 150, 63, 0.10);
--sla-chip-border: rgba(184, 150, 63, 0.38);
--sla-chip-fg:     #7a5f20;                /* cobre queimado escuro */
--sla-chip-dot-bg: var(--fortuno-gold-intense);
--sla-chip-dot-ring: rgba(184, 150, 63, 0.18);

/* --- Form inputs (base, hover, focus) --- */
--input-bg:           #ffffff;
--input-border:       rgba(11, 11, 11, 0.14);
--input-border-hover: rgba(184, 150, 63, 0.50);
--input-border-focus: rgba(184, 150, 63, 0.75);
--input-shadow-focus: 0 0 0 3px rgba(212, 175, 55, 0.25);
--input-placeholder:  rgba(11, 11, 11, 0.38);

/* --- Institutional card — borda dupla ornamentada (paralela ao
       FraudCertificate, mas em corpo claro) --- */
--inst-border-outer: rgba(184, 150, 63, 0.38);
--inst-border-inner: rgba(184, 150, 63, 0.20);
--inst-halo:         radial-gradient(600px 260px at 50% 0%, rgba(184, 150, 63, 0.08), transparent 70%);

/* --- FAQ accordion --- */
--faq-border:        rgba(184, 150, 63, 0.28);
--faq-border-hover:  rgba(184, 150, 63, 0.55);
--faq-bg-open:       #ffffff;
--faq-shadow-open:
  0 1px 0 rgba(255, 255, 255, 0.85) inset,
  0 12px 24px -16px rgba(10, 42, 32, 0.18),
  0 4px 10px -4px rgba(184, 150, 63, 0.18);
```

### Decisão de nomenclatura

- `--contact-hero-halo` segue o mesmo padrão de nomes da página about.
  Em produção, **compartilhar com `--about-hero-halo`** via um único
  `--editorial-hero-halo` pode fazer sentido em refactor futuro, mas por
  ora mantém-se isolado para cada página poder calibrar a intensidade.
- `--sla-chip-*` é genérico suficiente para ser reaproveitado em outros
  lugares que precisem de "chip com dot + label em tracking-wider" (ex.:
  statuses de loteria). Mover para `src/styles/tokens.css` como token
  global desde o primeiro uso.
- `--input-*` é a **base do design system de formulários** do Fortuno. O
  wizard hoje usa inline styles; esses tokens devem ser promovidos para
  cobrir também `wizard-vertical` em refactor.
- `--inst-*` é um padrão novo: cartão claro com borda dupla + cantos
  art-déco. Pode virar um componente shared `<OrnamentedCard variant="light" />`.
- `--faq-*` cobre especificamente o acordeão nativo `<details>`. Se
  outros locais no app precisarem de acordeão, esses tokens já estão
  prontos.

---

## 3. Extensão de `tailwind.config.js` (merge, NÃO substituir)

Adicionar dentro do `theme.extend` existente — apenas as chaves novas:

```js
// tailwind.config.js — theme.extend (merge com wizard + home + dashboard + about)
backgroundImage: {
  // ...entradas anteriores
  'contact-hero-halo': 'var(--contact-hero-halo)',
  'inst-halo':         'var(--inst-halo)',
},
boxShadow: {
  // ...entradas anteriores
  'input-focus':       'var(--input-shadow-focus)',
  'faq-open':          'var(--faq-shadow-open)',
},
```

Nenhum `keyframes` ou `animation` novo é necessário. O acordeão usa
`<details>` nativo (expansão sem animação de height por padrão — o
spring visual vem do chevron rotacionando). Se quiser smooth-expand em
produção, documentar no spec o uso de `@starting-style` ou fallback
via Radix Accordion.

---

## 4. Class map sugerido (componentes da página contact)

| Papel                                        | Classes Tailwind / CSS                                                                                          |
|----------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| Fundo da página                              | `bg-[color:var(--dash-bg-page)] text-fortuno-black min-h-screen`                                                |
| Hero (banda compacta)                        | `relative bg-contact-hero-halo pt-14 md:pt-20 pb-14 md:pb-20`                                                   |
| Hero eyebrow                                 | `.eyebrow` (reuso)                                                                                              |
| Hero title                                   | `font-display leading-[1.02] text-fortuno-black` + `clamp(36px, 5vw, 58px)`                                     |
| Hero glyph (ícone decorativo)                | `relative aspect-square grid place-items-center rounded-[24px] border border-fortuno-gold-intense/24 bg-[linear-gradient(180deg,#faf5e8,#ece8e1)] shadow-paper` |
| Channel card                                 | `relative flex flex-col gap-4 p-7 bg-white border border-fortuno-black/[0.08] rounded-[20px] shadow-paper transition hover:-translate-y-1 hover:shadow-paper-hover hover:border-fortuno-gold-intense/45 no-underline text-fortuno-black` |
| Channel icon (círculo ouro translúcido)      | `w-16 h-16 rounded-full grid place-items-center bg-gradient-to-b from-[#faf3e1] to-[#f0e3b8] text-fortuno-gold-intense border border-fortuno-gold-intense/32 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_6px_14px_-6px_rgba(184,150,63,0.35)]` |
| Channel label                                | `font-display italic font-bold text-[24px] leading-[1.1] text-fortuno-black`                                    |
| Channel desc                                 | `text-sm leading-[1.65] text-fortuno-black/68`                                                                  |
| Channel CTA (link row)                       | `inline-flex items-center gap-1.5 mt-auto pt-2.5 font-semibold text-[13.5px] tracking-wide text-fortuno-gold-intense border-t border-fortuno-gold-intense/22` |
| SLA chip                                     | `absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase text-[color:var(--sla-chip-fg)] bg-[color:var(--sla-chip-bg)] border border-[color:var(--sla-chip-border)] rounded-full` |
| Form card                                    | `relative bg-[linear-gradient(180deg,#ffffff_0%,#fbf7ef_100%)] border border-fortuno-gold-intense/28 rounded-[22px] shadow-paper overflow-hidden p-8 md:p-12` |
| Form label                                   | `block text-[11px] font-semibold tracking-[0.22em] uppercase text-fortuno-black/62 mb-2`                        |
| Form input / select / textarea               | `w-full px-3.5 py-3 text-[15px] text-fortuno-black bg-white border border-fortuno-black/14 rounded-[10px] transition-[border-color,box-shadow] hover:border-fortuno-gold-intense/50 focus:outline-none focus:border-fortuno-gold-intense/75 focus:shadow-input-focus placeholder:text-fortuno-black/38` |
| Form textarea                                | `+ resize-y min-h-[120px] leading-[1.55]`                                                                       |
| Form select                                  | `+ appearance-none pr-9 bg-no-repeat` (chevron via inline `background-image`, ver CSS do mockup)                |
| Form help                                    | `mt-1.5 text-xs text-fortuno-black/55`                                                                          |
| Checkbox row (LGPD)                          | `flex items-start gap-3 p-3.5 bg-fortuno-gold-intense/6 border border-dashed border-fortuno-gold-intense/32 rounded-[10px] cursor-pointer` |
| Checkbox custom                              | `appearance-none w-5 h-5 mt-0.5 bg-white border-[1.5px] border-fortuno-gold-intense/55 rounded-[5px] cursor-pointer relative transition-colors hover:border-fortuno-gold-intense checked:bg-gradient-to-b checked:from-[#f0d27a] checked:via-[#c79b41] checked:to-[#8a6a25] checked:border-fortuno-gold-intense focus-visible:outline-none focus-visible:shadow-input-focus` + checkmark via `::after` |
| Institutional card                           | `relative bg-white border border-[color:var(--inst-border-outer)] rounded-[22px] p-11 overflow-hidden` + pseudo `::before` filete ouro + pseudo `::after` halo |
| Institutional corners (4×)                   | `absolute w-[22px] h-[22px] border-[1.5px] border-fortuno-gold-intense opacity-75` (variantes `.tl/.tr/.bl/.br`)|
| Institutional divider (diamante ouro)        | `flex items-center gap-3.5 justify-center my-4 my-6` + rulers `h-px bg-[image:var(--gold-divider-soft)] flex-1 max-w-[100px]` |
| Institutional item                           | `<dt>` `inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.26em] uppercase text-fortuno-gold-intense mb-1.5` · `<dd>` `text-[15px] font-semibold text-fortuno-black leading-[1.45] tabular-nums` |
| FAQ item                                     | `bg-white border border-[color:var(--faq-border)] rounded-[14px] overflow-hidden transition-[border-color,box-shadow] hover:border-fortuno-gold-intense/55` |
| FAQ item (open state)                        | `open:border-fortuno-gold-intense/55 open:bg-white open:shadow-faq-open`                                        |
| FAQ summary                                  | `flex items-center justify-between gap-4 px-5.5 py-4.5 cursor-pointer list-none font-semibold text-[15px] text-fortuno-black select-none hover:text-fortuno-gold-intense` + `::-webkit-details-marker:hidden` |
| FAQ chevron                                  | `grid place-items-center w-8 h-8 rounded-full bg-fortuno-gold-intense/8 border border-fortuno-gold-intense/32 text-fortuno-gold-intense transition-transform group-open:rotate-180` |
| FAQ body                                     | `px-5.5 pb-5 pt-4 text-[14.5px] leading-[1.7] text-fortuno-black/72 border-t border-fortuno-gold-intense/18`    |
| Closing CTA wrapper                          | `relative bg-[image:var(--noir-closing-bg)] border-y border-fortuno-gold-soft/20 text-fortuno-offwhite overflow-hidden py-16 md:py-20` (reuso about) |

---

## 5. Acessibilidade — checks específicos

- **SLA chip**: o dot colorido é puramente decorativo (`aria-hidden`). O
  texto do chip ("Resposta em 4h") já comunica o SLA. `aria-label` no
  próprio chip pode expandir o contexto (ex.: "Tempo médio de resposta:
  menos de 4 horas") para leitores de tela.
- **Channel card como link**: o card inteiro é um `<a>`. O CTA
  ("Abrir WhatsApp →") é visual — a acessibilidade do link vem do
  `aria-label` no `<a>` e do fluxo natural do conteúdo. Externa → abre
  em nova aba com `rel="noopener noreferrer"` + ícone `ArrowUpRight`
  (indicador visual de "sai do site").
- **Form inputs**: cada `<input>`/`<select>`/`<textarea>` tem um
  `<label>` com `for=` explícito (não confiar em placeholder). Campos
  obrigatórios marcados com `required` + `aria-required="true"` + `*` ouro
  visível. Textos de ajuda via `aria-describedby`.
- **Checkbox LGPD**: o `<input>` custom mantém `appearance: none` mas
  preserva `:focus-visible` com shadow ouro (3:1). O label é clicável
  (envolve o input). Link para Política de Privacidade com
  `text-underline-offset` visível.
- **Form select chevron**: desenhado via `background-image` CSS (não
  SVG inline), mas não é interativo — a seta nativa do `<select>` é
  substituída pela customizada. `appearance: none` remove a UI
  plataforma; voltar a aparência via CSS garante que fica acessível.
- **FAQ**: `<details>/<summary>` nativo é acessível por padrão. Estado
  expandido anunciado automaticamente. Chevron rotaciona via CSS; não
  precisa de JS. Focus ring ouro chega ao `<summary>` com
  `box-shadow: inset 0 0 0 3px rgba(212,175,55,0.55)`.
- **Institutional card**: usar `<dl>` com `<dt>` + `<dd>` expressa
  semanticamente "lista de definições" (razão social, CNPJ, etc.).
  Ícones nos `<dt>` são `aria-hidden`.
- **CTA primary (submit)**: `<button type="submit">` com texto claro
  ("Enviar mensagem") + ícone `Send`. Estado `disabled` durante o
  envio (documentado no spec).
- **Contraste**:
  - `--sla-chip-fg` (#7a5f20) sobre `#ffffff` → 6.4:1 (AAA para texto normal).
  - `--input-placeholder` (rgba(11,11,11,0.38)) sobre #ffffff → ~5.2:1 (AA).
  - Texto channel-desc sobre #ffffff → ~5.8:1 (AA+).
  - Texto FAQ body sobre #ffffff → ~6.2:1 (AA+).

---

## 6. Respeito a `prefers-reduced-motion`

A página herda a regra global do `index.css`. Especificamente nesta
página o único movimento não-trivial é:

- Hover lift dos channel cards (`translateY(-4px)`) — suprimido sob
  `reduce`. Estado final alcançável via focus-visible (ring ouro).
- Rotação do chevron do FAQ ao abrir — suprimida sob `reduce`. A mudança
  de estado do `<details>` continua funcional (open/close).

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition-duration: 1ms !important;
  }
  .channel-card:hover { transform: none; }
  .cta-primary:hover  { transform: none; }
}
```

---

## 7. Referências cruzadas

- Wizard:     `design/wizard-vertical/tokens.md`
- Home:       `design/home/tokens.md`
- Dashboard:  `design/dashboard/tokens.md`
- About:      `design/about/tokens.md`
- Mockup:     `design/contact/mockup.html`
- Spec:       `design/contact/spec.md`
