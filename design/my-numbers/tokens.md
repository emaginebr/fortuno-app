# Meus Números — Tokens novos (v2)

> Registro APENAS dos tokens inéditos a adicionar em `src/styles/tokens.css` (camada semântica) e na CSS dedicada desta feature (`src/styles/my-numbers.css`, a criar). Todo o restante é reuso de `tokens.css` + `dashboard.css` + `lottery-list.css` + `lottery-detail.css` + `checkout.css` e NÃO deve ser duplicado.
>
> **Nada vai para `tailwind.config.ts` `theme.extend`** nesta feature — todos os tokens abaixo são CSS variables consumidas por classes utilitárias (`.ticket`, `.voucher-number`, `.filter-pill`, etc.) ou por `bg-[color:var(--x)]`.
>
> **Atualização v2 (pós-feedback do usuário):** o voucher foi reorganizado — **layout vertical** em que o número é o herói central (faixa horizontal), sem canhoto/corpo, sem `lotteryName`. A tipografia do número passou a ser **fluida** via `container-type: inline-size` + `clamp(..., cqi, ...)` com modifiers por `data-length`. Tokens removidos abaixo.

## Reuso total (NÃO redeclarar)

- Cores de marca (`--fortuno-green-deep|elegant`, `--fortuno-gold-intense|soft`, `--fortuno-black`, `--fortuno-offwhite`, `--fortuno-paper`).
- `--dash-header-bg`, `--dash-footer-band-bg`, `--gold-divider`, `--gold-divider-soft`, `--avatar-ring` → `tokens.css` / `dashboard.css`.
- `--chip-glass-bg`, `--chip-glass-border`, `--chip-glass-border-hover` → `dashboard.css`.
- `--page-bg` (claro) → mesma fórmula do dashboard-light-body.
- `--topbar-bg`, `--topbar-border-bottom`, user-trigger/menu → `dashboard.css` (Header global).
- `--pagination-bg|border|shadow`, `--pagination-chip-*` e `.pagination-pill|chip|ellipsis|mobile` → `lottery-list.css`.
- `--modal-overlay|bg|border|shadow` → `lottery-detail.css`.
- `--empty-bg`, `--empty-border` (dashed gold) → `lottery-list.css`.
- `--shadow-gold-focus` → `tokens.css`.
- `--duration-fast|base|slow`, `--easing-out|spring` → `tokens.css`.

## Tokens REMOVIDOS na v2 (eram específicos do canhoto e não existem mais)

| Token / nome                           | Motivo                                                      |
| -------------------------------------- | ----------------------------------------------------------- |
| `--ticket-perforation` (linha tracejada 32%) | Canhoto removido — não há mais divisão vertical.      |
| `.ticket-stub-*` (eyebrow/numeral/chip)      | Canhoto não existe; número virou faixa central.      |
| `.ticket-body-title` e tokens de `title`     | `lotteryName` removido do card por decisão do usuário.|
| `.ticket-body-head`/`body-meta`/`body-foot`  | Estrutura canhoto+corpo substituída por fluxo vertical (`ticket-head`, `voucher-number-band`, `ticket-meta`, `ticket-foot`). |
| Furos `is-top`/`is-bot` (semicirculares verticais) | Substituídos por `is-left`/`is-right` decorativos.    |

## Tokens novos — adicionar em `src/styles/tokens.css` (camada semântica)

```css
:root {
  /* ─── Toolbar editorial (reutilizável por outras listagens) ─── */
  --toolbar-card-bg:
    linear-gradient(180deg,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(247, 243, 236, 0.82) 100%);
  --toolbar-card-border: rgba(184, 150, 63, 0.32);
  --toolbar-card-shadow:
    0 1px 0 rgba(255, 255, 255, 0.85) inset,
    0 12px 28px -18px rgba(10, 42, 32, 0.18),
    0 4px 10px -4px rgba(184, 150, 63, 0.10);

  /* Pílulas de filtro (usadas pela Toolbar) */
  --filter-pill-bg:              rgba(255, 255, 255, 0.65);
  --filter-pill-border:          rgba(184, 150, 63, 0.30);
  --filter-pill-bg-hover:        rgba(212, 175, 55, 0.10);
  --filter-pill-border-hover:    rgba(184, 150, 63, 0.55);
  --filter-pill-bg-active:
    linear-gradient(180deg, rgba(212, 175, 55, 0.18), rgba(184, 150, 63, 0.12));
  --filter-pill-border-active:   rgba(212, 175, 55, 0.65);
}
```

## Tokens novos — exclusivos do ticket (em `src/styles/my-numbers.css`)

> Exclusivos desta feature; não promover para `tokens.css` até surgir um 2º consumidor.

```css
:root {
  /* ─── TICKET PREMIUM — papel do voucher ─── */
  --ticket-paper-bg:
    radial-gradient(120% 100% at 0% 0%,
      rgba(255, 250, 232, 0.95) 0%, transparent 55%),
    radial-gradient(120% 100% at 100% 100%,
      rgba(247, 243, 236, 0.85) 0%, transparent 60%),
    linear-gradient(180deg, #fdfaf0 0%, #f3ecd6 100%);

  /* Frame metálico OPEN (ouro saturado) — default */
  --ticket-frame-bg-open:
    linear-gradient(135deg,
      #d4af37 0%, #b8963f 25%, #f5dc8b 50%, #b8963f 75%, #8a6f2b 100%);

  /* Frame metálico CLOSED (verde envelhecido) */
  --ticket-frame-bg-closed:
    linear-gradient(135deg,
      #2d5d4a 0%, #1a4034 25%, #4a7a68 50%, #1a4034 75%, #0a2a20 100%);

  /* Frame metálico REFUNDED (cobre queimado) */
  --ticket-frame-bg-refunded:
    linear-gradient(135deg,
      #c08a4a 0%, #8a5a2b 25%, #d8a672 50%, #8a5a2b 75%, #4d3216 100%);

  /* Gradients do numeral (Playfair italic) por estado */
  --ticket-numeral-grad-open:
    linear-gradient(180deg, #d4af37 0%, #b8963f 50%, #6e4421 130%);
  --ticket-numeral-grad-closed:
    linear-gradient(180deg, #2d5d4a 0%, #1a4034 60%, #0a2a20 130%);
  --ticket-numeral-grad-refunded:
    linear-gradient(180deg, #c08a4a 0%, #8a5a2b 60%, #4d3216 130%);

  /* ─── NOVO (v2) — tipografia fluida do número ───
     Estratégia: `.ticket` é container `inline-size`, o número usa
     `clamp(min, Xcqi, max)`. Um JS (ou :has() moderno) aplica um modifier
     via `data-length` quando a string é longa. Ver spec.md §3.3. */
  --voucher-number-size:       clamp(34px, 11cqi,  84px);  /* short/medium  */
  --voucher-number-size-long:  clamp(24px, 7.5cqi, 56px);  /* long (≥14c)   */
  --voucher-number-size-xlong: clamp(20px, 6cqi,   44px);  /* xlong (≥17c)  */

  --voucher-number-ls:         -0.03em;
  --voucher-number-ls-long:    -0.02em;
  --voucher-number-ls-xlong:   -0.015em;

  /* Linhas horizontais ouro que "moldura" o número (art-déco) */
  --voucher-rule-line:
    linear-gradient(90deg, transparent, rgba(184, 150, 63, 0.55), transparent);

  /* Watermark FORTUNO ao fundo */
  --ticket-watermark-color: rgba(184, 150, 63, 0.07);

  /* Sombras do voucher */
  --ticket-shadow:
    0 1px 0 rgba(255, 255, 255, 0.85) inset,
    0 18px 32px -18px rgba(10, 42, 32, 0.28),
    0 6px 14px -4px rgba(184, 150, 63, 0.18);
  --ticket-shadow-hover:
    0 1px 0 rgba(255, 255, 255, 0.95) inset,
    0 28px 48px -22px rgba(10, 42, 32, 0.42),
    0 14px 24px -8px rgba(184, 150, 63, 0.40),
    0 0 0 1px rgba(212, 175, 55, 0.25);

  /* Ornamentos art-déco dos cantos */
  --ticket-corner-color: rgba(184, 150, 63, 0.55);

  /* Shimmer ao hover percorrendo a borda */
  --ticket-shimmer-bg:
    linear-gradient(110deg,
      transparent 30%,
      rgba(255, 236, 180, 0.55) 48%,
      rgba(255, 236, 180, 0.85) 50%,
      rgba(255, 236, 180, 0.55) 52%,
      transparent 70%);

  /* Selo "AUTENTICADO" (3 metais) */
  --seal-bg-open:
    radial-gradient(circle at 30% 30%, #f5dc8b 0%, #b8963f 60%, #6e4421 100%);
  --seal-bg-closed:
    radial-gradient(circle at 30% 30%, #6a9684 0%, #2d5d4a 60%, #0a2a20 100%);
  --seal-bg-refunded:
    radial-gradient(circle at 30% 30%, #d8a672 0%, #8a5a2b 60%, #4d3216 100%);
  --seal-border:  rgba(110, 68, 33, 0.55);
  --seal-shadow:
    0 1px 0 rgba(255, 255, 255, 0.50) inset,
    0 4px 8px -4px rgba(110, 68, 33, 0.45);

  /* Status pill — 3 variantes */
  --status-open-bg:       rgba(184, 150, 63, 0.16);
  --status-open-border:   rgba(184, 150, 63, 0.50);
  --status-open-fg:       #6e4421;

  --status-closed-bg:     rgba(19, 68, 54, 0.14);
  --status-closed-border: rgba(19, 68, 54, 0.45);
  --status-closed-fg:     #134436;

  --status-refunded-bg:     rgba(138, 90, 43, 0.12);
  --status-refunded-border: rgba(138, 90, 43, 0.45);
  --status-refunded-fg:     #6e4421;

  /* Skeleton (mesma silhueta vertical v2) */
  --ticket-skel-base:    rgba(184, 150, 63, 0.10);
  --ticket-skel-shimmer:
    linear-gradient(90deg,
      transparent 0%,
      rgba(212, 175, 55, 0.18) 40%,
      rgba(212, 175, 55, 0.32) 50%,
      rgba(212, 175, 55, 0.18) 60%,
      transparent 100%);
}
```

## Classes públicas expostas (mockup v2 → CSS final)

| Classe                        | Responsabilidade                                                                 |
| ----------------------------- | -------------------------------------------------------------------------------- |
| `.tickets-toolbar`            | Container editorial da toolbar (título + pílulas).                               |
| `.toolbar-lottery-context`    | Linha "em [sorteio X]" abaixo do título (substitui o nome que saiu dos cards).   |
| `.filter-pill`                | Pílula ouro genérica. Modificadores: `.is-active`, `.is-search`.                 |
| `.filter-pill .pill-icon`     | Ícone lucide 16px (ouro).                                                        |
| `.filter-pill .pill-label`    | Eyebrow 10px tracking `0.18em`.                                                  |
| `.filter-pill .pill-value`    | Valor semibold; `<select>` nativo recebe `.pill-native-select`.                  |
| `.toolbar-clear-link`         | Link "Limpar filtros" (ghost).                                                   |
| `.ticket`                     | Voucher premium v2. `data-state="open|closed|refunded"`, `data-winner="true"` opcional. **É um container `inline-size`** para o cálculo `cqi` da tipografia fluida. |
| `.ticket-inner`               | Grid `auto 1fr auto` vertical (head / número / meta+foot) com `gap:8px; padding:16px 22px 14px`. |
| `.ticket-head`                | Linha topo: eyebrow "Bilhete" + `#FN-<id>` à esquerda; `.ticket-status` à direita. |
| `.ticket-eyebrow`             | "BILHETE" tracking wide.                                                         |
| `.ticket-id`                  | `#FN-{ticketId}` tabular-nums.                                                   |
| `.voucher-number-band`        | Faixa horizontal central com linhas art-déco laterais.                           |
| `.voucher-number`             | O **herói** — Playfair italic, `font-size: var(--voucher-number-size)`. Ajuste por `data-length="short|medium|long|xlong"`. |
| `.voucher-number-sep`         | Separador `-` estilizado nos composed.                                           |
| `.ticket-meta`                | Linha centralizada: prêmio (verde) + data (ouro).                                |
| `.ticket-foot`                | Linha inferior: data de compra + selo "Autenticado" (com `ShieldCheck`).         |
| `.ticket-status`              | Pill de status; cor via `data-state` OU inline (para `pendingRefund`).           |
| `.ticket-seal`                | Selo circular art-déco no canto inferior direito (metal segue `data-state`).     |
| `.ticket-corner`              | 4 ornamentos de canto (`.is-tl|tr|bl|br`) com micro-diamante.                    |
| `.ticket-hole.is-left|right`  | Furos decorativos laterais.                                                      |
| `.ticket-shimmer`             | Overlay que recebe animação `ticket-shimmer` ao hover.                           |
| `.ticket-skel`                | Skeleton shimmer com a mesma silhueta vertical.                                  |
| `.empty-card`                 | Empty state grande (REUSO `lottery-list.css`).                                   |
| `.empty-filtered`             | Empty state compacto (NOVO).                                                     |
| `.trust-bar`                  | Faixa discreta "Todos os bilhetes são auditados".                                |

## Estratégia de auto-fit do número (resumo técnico)

1. **`container-type: inline-size`** em `.ticket` → o número escala com a **largura real do card**, não com a viewport. Isso garante que 3 cols e 4 cols derivem tamanhos diferentes automaticamente.
2. **`clamp(min, Xcqi, max)`** em `.voucher-number` → cresce proporcional ao card.
3. **Modifier `data-length`** aplicado pelo `TicketCardPremium`:
   - `short`  → `length ≤ 5`  (ex.: `"42"`, `"99999"`, `"12-34"`)
   - `medium` → `6-10` chars (ex.: `"1234567890"`, `"12-34-56-78-90"` tem 14 mas visualmente compacto — veja regra abaixo)
   - `long`   → `≥ 11-16` chars (Composed5-6)
   - `xlong`  → `≥ 17` chars (Composed7/8)

   **Regra de classificação prática (TypeScript):**
   ```ts
   function voucherLengthClass(value: string): 'short' | 'medium' | 'long' | 'xlong' {
     const len = value.length;
     if (len <= 5)  return 'short';
     if (len <= 10) return 'medium';
     if (len <= 16) return 'long';
     return 'xlong';
   }
   ```
4. **`white-space: nowrap; overflow: visible`** — o número NUNCA corta. Se em algum viewport extremo ainda houver risco, o modifier `xlong` garante tamanhos tabulares que cabem sem overflow em `≥ 220px` de largura de card (testado no mockup 4 cols `≥ 1280px` e mobile 1 col).
5. **`font-variant-numeric: tabular-nums`** — todas as cifras ocupam a mesma largura, equalizando visualmente os composed com zero-padding.

## Motion

- Duração/easing: reuso de `--duration-*` e `--easing-out|spring`.
- Animações novas: `ticket-stagger-in` (460ms entrada com delay via `--ticket-index`), `ticket-shimmer` (1.6s infinito no hover), `skel-shimmer` (1.4s linear).
- **Prefers-reduced-motion**: override global (`animation:none;transition-duration:1ms`) + `transform:none` no hover do `.ticket`.
