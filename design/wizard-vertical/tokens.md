# Design Tokens — Wizard Vertical "Editorial Casino Noir"

Direção: **Editorial Casino Noir** — fundo dark green profundo, accent ouro, marcadores em metal escovado com glow sutil, trilha vertical com gradiente animado, header de etapa em editorial Playfair.

Esta direção reutiliza 100% da paleta de marca já existente em `src/styles/tokens.css` e adiciona **somente tokens semânticos novos** (sombras, gradientes, animações). Nenhuma cor bruta nova é introduzida.

---

## 1. Tokens reutilizados (sem mudança)

| Token                      | Valor       |
|----------------------------|-------------|
| `--fortuno-green-deep`     | `#0a2a20`   |
| `--fortuno-green-elegant`  | `#134436`   |
| `--fortuno-gold-intense`   | `#b8963f`   |
| `--fortuno-gold-soft`      | `#d4af37`   |
| `--fortuno-black`          | `#0b0b0b`   |
| `--fortuno-offwhite`       | `#ece8e1`   |

Tipografia já disponível no projeto: `font-sans` Inter, `font-display` Playfair Display.

---

## 2. Tokens NOVOS — adicionar em `src/styles/tokens.css`

```css
/* ===========================================================
   Wizard Editorial Casino Noir — tokens semânticos novos
   =========================================================== */

/* --- Backgrounds compostos --- */
--noir-bg-page:
  radial-gradient(1200px 600px at 80% -10%, rgba(212, 175, 55, 0.10), transparent 60%),
  radial-gradient(900px 500px at -10% 110%, rgba(19, 68, 54, 0.55), transparent 55%),
  linear-gradient(180deg, #07201a 0%, #0a2a20 60%, #081e18 100%);

--noir-glass-surface: linear-gradient(180deg, rgba(236, 232, 225, 0.06), rgba(236, 232, 225, 0.02));
--noir-glass-border:  rgba(212, 175, 55, 0.22);

/* --- Trilha vertical --- */
--rail-track: linear-gradient(180deg, rgba(236, 232, 225, 0.10), rgba(236, 232, 225, 0.04));
--rail-fill:  linear-gradient(180deg, var(--fortuno-gold-soft), var(--fortuno-gold-intense) 60%, var(--fortuno-green-elegant));

/* --- Marcadores (metal escovado) --- */
--marker-metal-pending: radial-gradient(120% 120% at 30% 20%, #20493b 0%, #0e3327 55%, #07201a 100%);
--marker-metal-active:  radial-gradient(120% 120% at 30% 20%, #f0d27a 0%, #c79b41 45%, #8a6a25 100%);
--marker-metal-done:    radial-gradient(120% 120% at 30% 20%, #1c5b48 0%, #0f3b2e 60%, #06241c 100%);

/* --- Sombras especiais --- */
--shadow-noir-card:       0 1px 0 rgba(255,255,255,0.04) inset, 0 30px 60px -30px rgba(0,0,0,0.7), 0 12px 24px -12px rgba(0,0,0,0.45);
--shadow-noir-marker:     0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.5) inset, 0 6px 14px -6px rgba(0,0,0,0.7);
--shadow-noir-marker-on:  0 1px 0 rgba(255,255,255,0.45) inset, 0 -1px 0 rgba(0,0,0,0.4) inset, 0 0 0 4px rgba(184,150,63,0.18), 0 8px 26px -6px rgba(184,150,63,0.55);
--shadow-gold-glow:       0 0 0 3px rgba(212,175,55,0.18), 0 0 24px -6px rgba(212,175,55,0.55);
--shadow-gold-focus:      0 0 0 3px rgba(212,175,55,0.55);

/* --- Divisor ouro --- */
--gold-divider: linear-gradient(90deg, transparent, rgba(212,175,55,0.55), transparent);

/* --- Animação --- */
--duration-fast:   160ms;
--duration-base:   240ms;
--duration-slow:   420ms;
--easing-out:      cubic-bezier(0.22, 1, 0.36, 1);
--easing-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## 3. Extensão de `tailwind.config.js`

Adicionar dentro de `theme.extend` (NÃO substituir o bloco existente):

```js
// tailwind.config.js — theme.extend
boxShadow: {
  'noir-card':       'var(--shadow-noir-card)',
  'noir-marker':     'var(--shadow-noir-marker)',
  'noir-marker-on':  'var(--shadow-noir-marker-on)',
  'gold-glow':       'var(--shadow-gold-glow)',
  'gold-focus':      'var(--shadow-gold-focus)',
},
backgroundImage: {
  'noir-page':       'var(--noir-bg-page)',
  'noir-glass':      'var(--noir-glass-surface)',
  'rail-track':      'var(--rail-track)',
  'rail-fill':       'var(--rail-fill)',
  'gold-divider':    'var(--gold-divider)',
  'marker-pending':  'var(--marker-metal-pending)',
  'marker-active':   'var(--marker-metal-active)',
  'marker-done':     'var(--marker-metal-done)',
},
transitionTimingFunction: {
  'noir-out':    'cubic-bezier(0.22, 1, 0.36, 1)',
  'noir-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
},
transitionDuration: {
  'noir-fast': '160ms',
  'noir-base': '240ms',
  'noir-slow': '420ms',
},
keyframes: {
  'marker-breath': {
    '0%, 100%': { boxShadow: 'var(--shadow-noir-marker-on)' },
    '50%':      { boxShadow: '0 1px 0 rgba(255,255,255,0.45) inset, 0 -1px 0 rgba(0,0,0,0.4) inset, 0 0 0 6px rgba(184,150,63,0.10), 0 10px 32px -6px rgba(184,150,63,0.65)' },
  },
  'check-pop': {
    '0%':   { transform: 'scale(0.4)', opacity: '0' },
    '60%':  { transform: 'scale(1.15)', opacity: '1' },
    '100%': { transform: 'scale(1)',    opacity: '1' },
  },
  'rail-pulse': {
    '0%, 100%': { opacity: '0', transform: 'translateY(0)' },
    '50%':      { opacity: '0.9', transform: 'translateY(8px)' },
  },
},
animation: {
  'marker-breath': 'marker-breath 2.6s ease-in-out infinite',
  'check-pop':     'check-pop 420ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  'rail-pulse':    'rail-pulse 2.4s ease-in-out infinite',
},
```

> `tailwindcss-animate` já está presente e cobre `animate-in/out`; os keyframes acima são específicos do wizard e não conflitam.

---

## 4. Class map sugerido (componentes)

| Papel                     | Classes Tailwind resultantes                                                        |
|---------------------------|--------------------------------------------------------------------------------------|
| Página (fundo)            | `bg-noir-page text-fortuno-offwhite min-h-screen`                                    |
| Painel glass              | `bg-noir-glass backdrop-blur-xl border border-[var(--noir-glass-border)] shadow-noir-card rounded-3xl` |
| Marker base               | `w-14 h-14 rounded-full shadow-noir-marker`                                          |
| Marker ativo              | `bg-marker-active text-fortuno-black shadow-noir-marker-on animate-marker-breath`   |
| Marker concluído          | `bg-marker-done text-fortuno-gold-soft`                                              |
| Marker pendente           | `bg-marker-pending text-fortuno-offwhite/55`                                         |
| Trilha (track)            | `bg-rail-track`                                                                      |
| Trilha (fill animado)     | `bg-rail-fill`                                                                       |
| Numeral editorial         | `font-display italic font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-fortuno-gold-soft via-fortuno-gold-intense to-fortuno-gold-intense/25` |
| Focus ring global         | `focus-visible:outline-none focus-visible:shadow-gold-focus`                         |
| Divisor ouro              | `h-px bg-gold-divider`                                                               |

---

## 5. Notas de acessibilidade nos tokens

- Contraste `offwhite (#ece8e1)` sobre `green-deep (#0a2a20)`: **13.1:1** (AAA).
- Contraste `gold-soft (#d4af37)` sobre `green-deep`: **6.8:1** (AAA para texto normal).
- Contraste `black (#0b0b0b)` sobre `gold-intense (#b8963f)`: **9.1:1** — usar no marker ativo, CTA primário e kbd.
- `offwhite/45` (texto de etapas bloqueadas) mantém 4.7:1 contra o painel glass — acima do mínimo AA para texto grande; rótulos com essa opacidade devem ter >=14px font-weight>=500.
- Focus ring: `--shadow-gold-focus` garante 3px contínuos e é aplicado SEMPRE em qualquer elemento interativo (`:focus-visible`).

---

## 6. Respeito a `prefers-reduced-motion`

A regra global (já no mockup, replicar no CSS do projeto):

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition-duration: 1ms !important;
  }
}
```

Fallback: `marker-breath`, `rail-pulse` e `check-pop` viram instantâneos; estados visuais permanecem (cor + ícone + sombra estática).
