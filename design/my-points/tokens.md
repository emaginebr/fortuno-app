# Design Tokens — Meus Pontos (Editorial Casino Noir · Extrato Premium)

Direção: continuidade direta de `design/dashboard/`, `design/my-numbers/` e `design/lottery-detail/`. **Reuso máximo** — apenas tokens *genuinamente novos* da página de Meus Pontos estão declarados aqui. O restante (paleta, page-bg, dash-header-bg, topbar, footer-band, chip glass, avatar ring, toolbar editorial, filter-pills, modal frame, empty state, skeleton, easing) vive em `design/dashboard/tokens.md` e `design/my-numbers/tokens.md` e DEVE ser anexado em `src/styles/tokens.css` antes da implementação React.

> **Princípio inviolável**: nenhuma cor bruta nova. Toda composição abaixo deriva da paleta de marca:
> `--fortuno-green-deep`, `--fortuno-green-elegant`, `--fortuno-gold-intense`, `--fortuno-gold-soft`, `--fortuno-black`, `--fortuno-offwhite`, `#f7f3ec` (paper), `#fbf7ee` / `#fdfaf0` (paper-light já catalogados).

---

## 1. Tokens reusados (sem duplicação aqui)

| Token / classe                                           | Origem                                  | Uso em Meus Pontos                                          |
|----------------------------------------------------------|-----------------------------------------|-------------------------------------------------------------|
| `--page-bg`                                              | `dashboard/tokens.md` (`--dash-bg-page`)| Corpo claro                                                 |
| `--dash-header-bg`                                       | `dashboard/tokens.md`                   | Header escuro (DashboardHeader idêntico)                    |
| `--topbar-bg` / `--topbar-border-bottom`                 | `dashboard/tokens.md §3.8`              | Topbar global (AuthenticatedShell)                          |
| `--dash-footer-band-bg`                                  | `dashboard/tokens.md`                   | Footer band                                                 |
| `--gold-divider` / `--gold-divider-soft`                 | wizard / dashboard                       | Filetes ouro                                                |
| `--chip-glass-bg` / `--chip-glass-border*`               | `dashboard/tokens.md`                   | HeaderChip referral + points (idêntico)                     |
| `--chip-action-bg` / `--chip-action-border` / hover      | `dashboard/tokens.md`                   | Botões dentro do chip                                       |
| `--avatar-ring`                                          | `dashboard/tokens.md`                   | Avatar 52px                                                 |
| `--shadow-gold-focus`                                    | wizard / global                          | Focus ring de TODOS os interativos                          |
| `--toolbar-card-bg/border/shadow`                        | `my-numbers/tokens.md`                  | `MyPointsToolbar` (mesma família visual)                    |
| `--filter-pill-*`                                        | `my-numbers/tokens.md`                  | Pílulas de filtro (sorteio / período / ordenar)             |
| `--card-paper-bg/border/shadow*` + `--card-gold-bar`     | `dashboard/tokens.md`                   | Cards genéricos (mini-stats, hero stats internos)           |
| `--stat-numeral-gradient`                                | `dashboard/tokens.md`                   | Reaproveitado nos mini-stats da zona central do hero        |
| `--modal-overlay/bg/border/shadow`                       | `lottery-detail/tokens.md`              | `ShareReferralModal` + `PointsBreakdownDetailModal`         |
| `--empty-bg/border`                                      | `my-numbers/tokens.md`                  | `PointsEmptyState`                                          |
| `--skeleton-base/shimmer`                                | `my-numbers/tokens.md`                  | Skeletons de hero e tabela                                  |
| `--duration-fast/base/slow` + `--easing-out/spring`      | wizard                                   | Animações                                                   |

---

## 2. Tokens NOVOS desta página

Anexar APÓS os blocos do dashboard / my-numbers em `src/styles/tokens.css`. Nomes prefixados por escopo (`--balance-hero-*`, `--hero-stat-*`, `--breakdown-*`, `--disclaimer-*`, `--share-*`) para evitar colisão.

```css
/* ============================================================
   MEUS PONTOS — tokens novos
   ============================================================ */

/* --- 2.1 BalanceHero (extrato premium, frame metálico, 3 zonas) --- */

/* Frame externo dourado (mesma família do ticket OPEN do my-numbers, mas
   aqui aplicado ao hero e não a um voucher individual). */
--balance-hero-frame:
  linear-gradient(135deg,
    #d4af37 0%, #b8963f 25%, #f5dc8b 50%, #b8963f 75%, #8a6f2b 100%);

/* Papel interno (off-white quente, levemente mais frio que o ticket). */
--balance-hero-paper:
  radial-gradient(110% 80% at 0% 0%, rgba(255,250,232,0.85) 0%, transparent 55%),
  radial-gradient(120% 100% at 100% 100%, rgba(247,243,236,0.85) 0%, transparent 60%),
  linear-gradient(180deg, #fdfaf0 0%, #f3ecd6 100%);

--balance-hero-shadow:
  0 1px 0 rgba(255,255,255,0.85) inset,
  0 24px 48px -22px rgba(10,42,32,0.32),
  0 8px 18px -8px rgba(184,150,63,0.22);

/* Watermark "FORTUNO · EXTRATO" ao fundo */
--balance-hero-watermark: rgba(184,150,63,0.06);

/* Numeral GIGANTE de pontos (clamp 64–120px, Playfair italic). */
--balance-hero-numeral-grad:
  linear-gradient(180deg,
    #f5dc8b 0%, #d4af37 30%, #b8963f 60%, #134436 130%);

/* Filete vertical entre as 3 zonas (apenas em desktop ≥ 1024px). */
--balance-hero-divider:
  linear-gradient(180deg,
    transparent 0%, rgba(184,150,63,0.45) 50%, transparent 100%);

/* --- 2.2 Hero stats (zona central, mini-cards 2×2) --- */

--hero-stat-bg:        rgba(255,255,255,0.55);
--hero-stat-border:    rgba(184,150,63,0.18);

/* Numeral menor (32–40px) — mesma assinatura do --stat-numeral-gradient
   do dashboard mas declarado por escopo para permitir tuning específico
   se um dia o time quiser diferenciar. */
--hero-stat-numeral-grad:
  linear-gradient(180deg,
    var(--fortuno-gold-soft) 0%,
    var(--fortuno-gold-intense) 60%,
    var(--fortuno-green-elegant) 130%);

/* --- 2.3 Hero "Como funcionam" (zona direita) --- */

--hero-howto-bg:
  linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(247,243,236,0.78) 100%);
--hero-howto-border: rgba(19,68,54,0.18);

/* --- 2.4 BreakdownTable (extrato editorial premium · desktop) --- */

--breakdown-card-bg:     #ffffff;
--breakdown-card-border: rgba(184,150,63,0.30);
--breakdown-card-shadow:
  0 1px 0 rgba(255,255,255,0.85) inset,
  0 14px 30px -22px rgba(10,42,32,0.22),
  0 4px 10px -4px rgba(184,150,63,0.10);

/* Header da tabela (Playfair italic ouro-verde) */
--breakdown-thead-bg:
  linear-gradient(180deg, rgba(247,243,236,0.85) 0%, rgba(255,255,255,0.92) 100%);

/* Zebra subtilíssima (3% gold) */
--breakdown-row-zebra:   rgba(212,175,55,0.03);
--breakdown-row-hover:   rgba(212,175,55,0.08);
--breakdown-row-divider: rgba(11,11,11,0.06);

/* Numeral de pontos da linha (gradient ouro→ouro-intenso, mais "metálico"
   para diferenciar do verde dos sub-numbers de indicações). */
--breakdown-points-grad:
  linear-gradient(180deg, var(--fortuno-gold-soft), var(--fortuno-gold-intense));

/* --- 2.5 DisclaimerOrnament (institucional, "recibo perfumado") --- */

--disclaimer-bg:
  linear-gradient(180deg, rgba(255,250,232,0.55) 0%, rgba(247,243,236,0.45) 100%);
--disclaimer-border:      rgba(184,150,63,0.42);
--disclaimer-icon-bg:     rgba(184,150,63,0.10);
--disclaimer-icon-border: rgba(184,150,63,0.40);

/* --- 2.6 ShareReferralModal (botões de canal de compartilhamento) --- */

--share-channel-bg:        rgba(255,255,255,0.78);
--share-channel-border:    rgba(184,150,63,0.30);
--share-channel-bg-hover:  rgba(212,175,55,0.10);

/* WhatsApp — única exceção colorida da página (verde marca WhatsApp).
   Mantida porque é signifier universal e já está no ecossistema (o ícone
   por si só não basta — usuários esperam o verde do botão). */
--share-whatsapp-bg:
  linear-gradient(180deg, #25d366 0%, #128c7e 100%);
--share-whatsapp-fg: #ffffff;
```

---

## 3. Extensão de `tailwind.config.js` (`theme.extend`)

Apenas o que é genuinamente novo. Os tokens das outras seções já foram cadastrados nas extensões do dashboard / my-numbers.

```js
// tailwind.config.js — incremento Meus Pontos
module.exports = {
  theme: {
    extend: {
      backgroundImage: {
        // Hero
        'balance-hero-frame':       'var(--balance-hero-frame)',
        'balance-hero-paper':       'var(--balance-hero-paper)',
        'balance-hero-numeral':     'var(--balance-hero-numeral-grad)',
        'balance-hero-divider':     'var(--balance-hero-divider)',
        'hero-howto':               'var(--hero-howto-bg)',
        'hero-stat-numeral':        'var(--hero-stat-numeral-grad)',

        // Breakdown
        'breakdown-thead':          'var(--breakdown-thead-bg)',
        'breakdown-points':         'var(--breakdown-points-grad)',

        // Disclaimer
        'disclaimer':               'var(--disclaimer-bg)',

        // Share modal
        'share-whatsapp':           'var(--share-whatsapp-bg)',
      },
      boxShadow: {
        'balance-hero':             'var(--balance-hero-shadow)',
        'breakdown-card':           'var(--breakdown-card-shadow)',
      },
      borderColor: {
        'breakdown-card':           'var(--breakdown-card-border)',
        'disclaimer':               'var(--disclaimer-border)',
        'share-channel':            'var(--share-channel-border)',
        'hero-howto':               'var(--hero-howto-border)',
      },
      keyframes: {
        'points-count-in': {
          '0%':   { opacity: '0', transform: 'translateY(6px)', letterSpacing: '-0.06em' },
          '100%': { opacity: '1', transform: 'translateY(0)',   letterSpacing: '-0.035em' },
        },
        'hero-rise': {
          '0%':   { opacity: '0', transform: 'translateY(10px) scale(0.992)' },
          '100%': { opacity: '1', transform: 'translateY(0)    scale(1)' },
        },
      },
      animation: {
        'points-count-in': 'points-count-in 720ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'hero-rise':       'hero-rise 520ms cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
};
```

> Tailwind utility examples derivados:
>
> - `bg-balance-hero-frame` → frame metálico do `PointsBalanceHero`
> - `bg-balance-hero-paper` → papel interno
> - `[background:var(--balance-hero-numeral-grad)]` aplicado a `.bg-clip-text text-transparent` para o numeral gigante
> - `shadow-balance-hero` para a sombra do hero
> - `bg-breakdown-thead` para o `<thead>` da tabela
> - `bg-disclaimer` para o card ornamental de disclaimer

---

## 4. Tokens explicitamente NÃO criados aqui (e por quê)

| Item                                  | Motivo                                                                       |
|---------------------------------------|------------------------------------------------------------------------------|
| Cor "danger" para algum estado        | Esta página não tem ações destrutivas. Reuso `--dropdown-danger-*` se preciso. |
| Numeral próprio do BalanceHero como reuso global | O gradient `--balance-hero-numeral-grad` é específico da identidade do extrato (mais ouro+verde, vs o `--stat-numeral-gradient` mais frio do dashboard). Mantido isolado para não enfraquecer a hierarquia visual. |
| Tokens próprios para os 3 ícones do "Como funcionam" | Reaproveitam `--card-gold-bar` e tons já existentes. |
| Token de cor do WhatsApp em variável central | Confinado a `--share-whatsapp-*` porque é o único uso na marca; promover para token global apenas quando aparecer numa segunda tela. |

---

## 5. Densidade tipográfica desta página

| Camada                                 | Família        | Tamanho             | Peso/Estilo                   |
|----------------------------------------|----------------|---------------------|-------------------------------|
| `BalanceHero` numeral (1.247)          | Playfair       | clamp(64px, 9vw, 120px) | 800 italic, ls -0.035em      |
| `BalanceHero` mini-stats numeral       | Playfair       | 36px (28 mobile)    | 800 italic, ls -0.025em       |
| `BreakdownTable` `breakdown-points`    | Playfair       | 22px                | 800 italic, ls -0.02em        |
| `BreakdownTable` `breakdown-num`       | Playfair       | 18px                | 700 italic, ls -0.01em        |
| `tfoot` total                          | Playfair       | 22px                | 700 italic                    |
| `MyPointsToolbar` título               | Playfair       | clamp(24px, 2.6vw, 32px) | 700                       |
| `Disclaimer` corpo                     | Playfair       | 14px                | 500 italic                    |
| `Section heading` H2                   | Playfair       | clamp(20px, 2.2vw, 26px) | 700                       |
| Eyebrows                               | Inter          | 9–10px              | 600/700 ls 0.26–0.30em uppercase |
| Corpo geral                            | Inter          | 12–14px             | 500/600                       |

Inter para tudo informativo + de UI; Playfair italic exclusivo para numerais e títulos editoriais — como em todas as outras páginas Casino Noir.
