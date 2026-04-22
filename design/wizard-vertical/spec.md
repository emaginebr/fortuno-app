# VerticalWizardShell — Component Spec

Handoff do **ui-ux-designer** para o **frontend-react-developer**.

Direção visual: **Editorial Casino Noir** (ver `mockup.html` e `tokens.md`).
Substituirá o atual `src/components/wizard/WizardShell.tsx` (horizontal) **sem alterar a API pública consumida por `src/pages/admin/LotteryWizardPage.tsx`** — apenas estendendo-a com metadados de ícone/subtítulo.

---

## 1. Escopo e compatibilidade

### Arquivos-alvo no handoff
- **Novo**: `src/components/wizard/VerticalWizardShell.tsx`
- **Novo**: `src/components/wizard/WizardStepper.tsx` (sub-componente da lateral)
- **Novo**: `src/components/wizard/WizardFooter.tsx` (sub-componente do rodapé fixo)
- **Atualizar**: `src/pages/admin/LotteryWizardPage.tsx`
  - Trocar `WizardShell` por `VerticalWizardShell`.
  - Enriquecer o array `STEPS` com `icon` (Lucide) e `subtitle` (ver §7).
- **Atualizar**: `src/styles/tokens.css` → anexar tokens NOVOS listados em `tokens.md`.
- **Atualizar**: `tailwind.config.js` → merge do `theme.extend` sugerido em `tokens.md`.

### Não quebrar
- `currentIndex` continua controlado pelo pai (LotteryWizardPage).
- `onNext`/`onPrev`/`onJump` e `busy` mantêm semântica atual.
- `sessionStorage` de persistência (feito em LotteryWizardPage) permanece intocado.

---

## 2. API — `VerticalWizardShell`

```ts
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface WizardStepMeta {
  index: number;
  key: string;
  title: string;
  /** NOVO — subtítulo descritivo exibido no header editorial */
  subtitle?: string;
  /** NOVO — ícone Lucide temático do marcador */
  icon?: LucideIcon;
  /** NOVO — tempo estimado em minutos (usado no chip e no footer) */
  estimatedMinutes?: number;
}

export interface VerticalWizardShellProps {
  steps: WizardStepMeta[];
  currentIndex: number;

  /** índice máximo liberado; padrão: currentIndex (só o atual + anteriores). */
  maxUnlockedIndex?: number;

  onPrev: () => void;
  onNext: () => void;
  onJump: (index: number) => void;

  children: ReactNode;

  nextLabel?: string;          // default: "Próximo"
  nextDisabled?: boolean;      // default: false
  busy?: boolean;              // default: false

  /** Exibe CTA especial na última etapa. */
  finalLabel?: string;         // default: "Finalizar"

  /** override opcional da cabeçalha (ex.: breadcrumb contextual) */
  breadcrumb?: ReactNode;
}
```

### Contrato de desbloqueio
- Um step é **acessível** se `step.index <= maxUnlockedIndex`.
- Um step é **done** se `step.index < currentIndex` **e** está acessível.
- Um step é **active** se `step.index === currentIndex`.
- Um step é **pending acessível** se é `> currentIndex` e `<= maxUnlockedIndex`.
- Um step é **locked** se `> maxUnlockedIndex` — não tem handler `onJump` nem é focável.

> `LotteryWizardPage` deve passar `maxUnlockedIndex={draft.lotteryId ? 7 : currentIndex}` para liberar etapas 4–8 assim que o Step 1 persiste o sorteio.

---

## 3. Estrutura DOM recomendada (classes Tailwind exatas)

```tsx
<div className="min-h-screen bg-noir-page text-fortuno-offwhite">
  {/* MOBILE bar compacto */}
  <header className="md:hidden sticky top-0 z-30 px-4 py-3
                     backdrop-blur-md bg-[rgba(7,32,26,0.75)]
                     border-b border-fortuno-gold-soft/15">
    {/* ...barra horizontal de segmentos (ol com <li class="h-1.5 flex-1 ...">) */}
  </header>

  <div className="relative mx-auto max-w-[1240px] px-4 md:px-8 py-8 md:py-12">
    <div className="grid md:grid-cols-[300px_1fr] gap-8 lg:gap-12 items-start">

      {/* SIDEBAR VERTICAL */}
      <aside className="hidden md:block sticky top-8 self-start">
        <WizardStepper
          steps={steps}
          currentIndex={currentIndex}
          maxUnlockedIndex={maxUnlockedIndex}
          onJump={onJump}
        />
      </aside>

      {/* CONTEÚDO */}
      <main className="min-w-0">
        <article className="rounded-3xl bg-noir-glass backdrop-blur-xl
                            border border-[color:var(--noir-glass-border)]
                            shadow-noir-card overflow-hidden">

          {/* HEADER EDITORIAL */}
          <header className="relative px-6 md:px-12 pt-10 md:pt-14 pb-8">
            <div className="absolute top-0 inset-x-0 h-px bg-gold-divider" />
            <div className="flex items-start gap-6 md:gap-10">
              <span aria-hidden="true"
                    className="font-display italic font-extrabold text-transparent
                               bg-clip-text bg-gradient-to-b
                               from-fortuno-gold-soft via-fortuno-gold-intense to-fortuno-gold-intense/25
                               leading-[0.85] select-none
                               text-[clamp(96px,14vw,168px)] tracking-[-0.04em]">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>

              <div className="flex-1 pt-2 md:pt-4">
                <span className="inline-flex items-center gap-2 text-[11px] uppercase
                                 tracking-[0.28em] text-fortuno-gold-soft mb-3">
                  <span className="h-px w-6 bg-fortuno-gold-soft" />
                  Etapa ativa
                </span>
                <h1 className="font-display text-4xl md:text-5xl text-fortuno-offwhite
                               leading-[1.05] mb-3">
                  {currentStep.title}
                </h1>
                {currentStep.subtitle && (
                  <p className="text-fortuno-offwhite/65 text-base md:text-lg
                                max-w-prose leading-relaxed">
                    {currentStep.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* META STRIP — tempo, autosave, hint */}
            <MetaStrip estimatedMinutes={currentStep.estimatedMinutes} />
          </header>

          <div className="h-px bg-gold-divider mx-6 md:mx-12" />

          {/* SLOT DE FORM */}
          <section className="px-6 md:px-12 py-10 md:py-12">
            {children}
          </section>
        </article>

        <div className="h-28 md:h-24" aria-hidden="true" />
      </main>
    </div>
  </div>

  {/* FOOTER FIXO */}
  <WizardFooter
    currentIndex={currentIndex}
    total={steps.length}
    onPrev={onPrev}
    onNext={onNext}
    busy={busy}
    nextDisabled={nextDisabled}
    nextLabel={isLast ? finalLabel : nextLabel}
  />
</div>
```

### Mapa dos sub-componentes

#### `WizardStepper` (lateral vertical)
- Wrapper: `<div className="rounded-3xl bg-noir-glass backdrop-blur-xl border border-[color:var(--noir-glass-border)] shadow-noir-card p-6 pr-4">`
- `<ol>` com `position: relative` contendo:
  - Trilha: `<div aria-hidden className="absolute left-[27px] top-7 bottom-7 w-[2px] bg-rail-track rounded-full overflow-hidden">` com filho `<div className="absolute inset-x-0 top-0 bg-rail-fill rounded-full" style={{ height: \`${progressPct}%\` }}>` — onde `progressPct = (currentIndex / (steps.length - 1)) * 100`.
  - Uma `<li>` por etapa. A raiz do item é `<button>` se acessível, `<span>` se locked.
- Cada marker: `className="step-marker ..."` (ver `tokens.md` class map).
- **44×44px+ garantido**: o botão inteiro (não só o círculo) deve ter `min-h-[56px]` de área tocável; o círculo visual é 56×56.

#### `WizardFooter`
- `<footer className="fixed bottom-0 inset-x-0 z-40 backdrop-blur-md bg-[rgba(7,32,26,0.85)] border-t border-fortuno-gold-soft/15">`
- Progress bar: `<div className="h-1 w-[140px] rounded-full bg-fortuno-offwhite/10 overflow-hidden">` com filho `<span className="block h-full bg-gradient-to-r from-fortuno-gold-soft to-fortuno-gold-intense transition-all duration-noir-slow ease-noir-out" style={{ width: \`${pct}%\` }} />`.
- Botões: usam as classes de projeto `btn-secondary` (Anterior) e `btn-primary` (Próximo). Ícones `ArrowLeft` / `ArrowRight` de lucide-react.
- Mostra `≈ X min restantes` calculado como `sum(estimatedMinutes) - sum(donePlusCurrentMinutes)`.

---

## 4. Estados e transições

| Estado     | Visual                                                             | ARIA                                            |
|------------|---------------------------------------------------------------------|-------------------------------------------------|
| `done`     | Marker verde-metal + ícone check (`animate-check-pop` uma vez)      | `aria-label="Etapa N: <title> (concluída)"`    |
| `active`   | Marker ouro-metal + `animate-marker-breath` infinito                | `aria-current="step"`                           |
| `pending`  | Marker verde-dark + ícone temático + `hover:-translate-y-0.5`       | sem ARIA especial                               |
| `locked`   | Marker `opacity-40`, `saturate-50` + ícone `Lock` ao lado           | `aria-disabled="true"`, não é um `<button>`     |

### Transições
- Troca de step: o conteúdo (`<section>` do form) recebe `key={currentIndex}` e aplica `data-[state=open]:animate-in data-[state=open]:fade-in-50 data-[state=open]:slide-in-from-right-2 duration-noir-base` (classes do `tailwindcss-animate`).
- Trilha: `height` do `rail-fill` é animada em `duration-noir-slow ease-noir-out`.
- Marker passa de `pending → active`: usa `transition-all duration-noir-base ease-noir-spring` (o spring dá a sensação de "encaixe").
- Marker passa de `active → done`: swap para `bg-marker-done` + check aparece com `animate-check-pop`.

### `prefers-reduced-motion`
- `marker-breath`, `rail-pulse`, `check-pop` desabilitados globalmente (regra no `index.css`).
- Slide/fade do conteúdo reduz para `duration-1` (instantâneo) — `tailwindcss-animate` respeita automaticamente via utilitário `motion-reduce:transition-none motion-reduce:animate-none`.

---

## 5. Responsividade

| Breakpoint        | Comportamento                                                                 |
|-------------------|------------------------------------------------------------------------------|
| `< 768px` (mobile)| Stepper vertical **oculto**. Mostra barra compacta de 8 segmentos no topo sticky (ver mockup §MOBILE HEADER). Conteúdo usa padding horizontal 16px; numeral editorial encolhe via `clamp(96px,14vw,168px)`. Footer fixo ganha apenas ícones com `sm:hidden` nos labels "Anterior"/"Próximo". |
| `768–1023px` (md) | Grid 300px / 1fr. Sticky sidebar ativa. Numeral `5xl` (≈ 96px).                |
| `>= 1024px` (lg)  | Gap `12` entre colunas. Numeral até 168px.                                    |
| `>= 1440px` (xl)  | `max-w-[1240px]` centraliza; sobra margem lateral para respiro editorial.     |

Regra explícita: **sem horizontal scroll** em qualquer breakpoint (verificar em 375px).

---

## 6. Acessibilidade (WCAG AA mínimo; AAA nos textos principais)

- **Contrastes** (ver `tokens.md`): todos os textos primários > 7:1.
- **Focus visível**: TODO elemento interativo recebe `focus-visible:outline-none focus-visible:shadow-gold-focus` (anel ouro 3px). Nunca usar `outline: none` sem substituto.
- **Navegação por teclado**:
  - `Tab` percorre: barra mobile → cada step acessível da sidebar → conteúdo → botão Anterior → botão Próximo.
  - `Enter`/`Space` em um step chama `onJump(index)` (só se acessível).
  - `Alt + ←` dispara `onPrev()`; `Alt + →` dispara `onNext()` — gerenciar via `useEffect` com `window.addEventListener('keydown')` no `VerticalWizardShell`.
- **Semântica**:
  - Lateral usa `<ol aria-label="Etapas do wizard">`.
  - Step atual tem `aria-current="step"`.
  - Step bloqueado **não é um botão** — é `<span aria-disabled="true">` para que screen readers não anunciem como clicável.
  - Form no slot usa `<fieldset>` quando agrupa inputs (o conteúdo de step é responsabilidade dos Step1–Step8, não deste shell).
- **Reduced motion**: regra CSS global já descrita.
- **Cor não é o único indicador**: cada estado tem ícone (`Check`, `Lock`) + mudança tipográfica (peso/opacidade) + cor. Daltonismo: teste em Protanopia — o gradiente ouro→verde é distinguível pela luminância; check e lock resolvem o restante.
- **Sheet/modal escape**: N/A (wizard é página, não modal). Porém, botão "Anterior" **sempre** acessível exceto no step 0.

---

## 7. Mapeamento para os 8 steps existentes

Atualizar o array `STEPS` em `src/pages/admin/LotteryWizardPage.tsx`:

```ts
import {
  Info, Hash, PenLine, Image as ImageIcon,
  Puzzle, Dices, Trophy, Zap,
} from 'lucide-react';

const STEPS: WizardStepMeta[] = [
  { index: 0, key: 'basic',    title: 'Dados básicos', icon: Info,
    subtitle: 'Nome, loja e período do sorteio. É por aqui que tudo começa.',
    estimatedMinutes: 2 },
  { index: 1, key: 'number',   title: 'Numeração', icon: Hash,
    subtitle: 'Defina como os bilhetes serão numerados — formato, quantidade e dígitos.',
    estimatedMinutes: 2 },
  { index: 2, key: 'desc',     title: 'Descrições', icon: PenLine,
    subtitle: 'Conte a história do prêmio. Copy curta vende, copy rica encanta.',
    estimatedMinutes: 3 },
  { index: 3, key: 'images',   title: 'Imagens', icon: ImageIcon,
    subtitle: 'Capa, galeria e detalhes. Imagem em alta resolução converte mais.',
    estimatedMinutes: 2 },
  { index: 4, key: 'combos',   title: 'Combos', icon: Puzzle,
    subtitle: 'Pacotes promocionais de bilhetes para impulsionar o ticket médio.',
    estimatedMinutes: 2 },
  { index: 5, key: 'raffles',  title: 'Sorteios', icon: Dices,
    subtitle: 'Datas, turnos e mecânica de extração dos números vencedores.',
    estimatedMinutes: 2 },
  { index: 6, key: 'awards',   title: 'Prêmios', icon: Trophy,
    subtitle: 'O que está em jogo. Valor, descrição e regras de entrega.',
    estimatedMinutes: 2 },
  { index: 7, key: 'activate', title: 'Ativar', icon: Zap,
    subtitle: 'Revisão final. Ao publicar, o sorteio fica visível ao público.',
    estimatedMinutes: 1 },
];
```

Total estimado: **16 min**. O footer calcula `≈ X min restantes` somando os `estimatedMinutes` de steps `>= currentIndex`.

---

## 8. Dependências a instalar

```bash
npm install lucide-react
```

- **Não** depende de Framer Motion (restrição do projeto). Todas as animações usam Tailwind + CSS keyframes já declarados em `tokens.md` / `tailwind.config.js`.
- `tailwindcss-animate` já instalado — usado para `animate-in`, `fade-in`, `slide-in-from-right-*` nas transições de conteúdo.

---

## 9. Checklist de validação pré-merge

- [ ] Tab order: mobile-bar → sidebar steps (apenas acessíveis) → form → Anterior → Próximo.
- [ ] `Alt + ←/→` navegam; `Esc` não causa side-effect (página, não modal).
- [ ] `prefers-reduced-motion: reduce` desativa pulse/breath/shimmer sem quebrar layout.
- [ ] 375px: sem overflow horizontal; numeral editorial cabe; footer botões mostram só ícone.
- [ ] Contraste verificado no Lighthouse ≥ AA em todos os textos.
- [ ] Step locked não é tabulável (usa `<span>` + `aria-disabled`).
- [ ] Step ativo tem `aria-current="step"`.
- [ ] `animate-marker-breath` pausa ao perder foco/visibilidade da aba (`@media (prefers-reduced-motion)` resolve; para battery extra, opcional `document.visibilityState` hook — nice-to-have).
- [ ] LotteryWizardPage: após o Step 1 persistir, `maxUnlockedIndex` salta para 7 e a trilha anima até ~100% — verificar suavidade.
- [ ] Verificar que CSS var `--noir-bg-page` renderiza no ambiente (Vite + Tailwind 3 OK; não requer plugin extra).

---

## 10. Out of scope deste spec

- Não reescrever os Step1–Step8 (conteúdo do slot) — permanecem como estão.
- Não alterar o hook `useLottery` nem `useAuth`.
- Não adicionar rota nova — continua `/meus-sorteios/novo`.
- Não tocar em i18n (se houver chaves novas de subtítulos, o frontend-react-developer adiciona junto ao refactor).
