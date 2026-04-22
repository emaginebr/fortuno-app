# Dashboard Page — Component Spec (v2.1 · COMPACT + UserMenu)

Handoff do **ui-ux-designer** para o **frontend-react-developer**.

Direção visual: **Editorial Casino Noir · variante Light Body · COMPACT**. Continuidade direta do wizard vertical e da home; única página com fundo claro no corpo. Ver `design/dashboard/mockup.html` e `design/dashboard/tokens.md`.

Esta spec redesenha **toda a rota `/dashboard`** (`src/pages/dashboard/DashboardPage.tsx`). O conteúdo informacional é preservado — saudação + código de indicação + total de pontos (agora em **inteiro de pontos**, não BRL) + 3 stats linkáveis + lista preview de loterias administradas. **A v2 elimina o hero `PointsVault`, os `QuickLinks`, as `quick pills` do header e o empty state de loterias administradas**, em troca de máxima densidade vertical (meta: caber em 1080px no desktop).

---

## Changelog v2 → v2.1

| Mudança                                                                                          | Tipo        |
|--------------------------------------------------------------------------------------------------|-------------|
| **Restyle do `Header.tsx` global** (`src/components/layout/Header.tsx`) para direção "Editorial Casino Noir" — NÃO cria rota, NÃO cria componente novo de layout; apenas re-skina o que já existe. | Refactor   |
| Novo primitivo **`UserMenu`** (dropdown da conta no topo direito, extraído para `src/components/layout/_primitives/UserMenu.tsx`) substituindo o `<div>` inline dentro do `Header.tsx`. | Aditivo    |
| Mockup do dashboard agora renderiza a topbar global como primeiro elemento (antes do header escuro do dashboard) — reflexo de como a página vive em produção sob o `AuthenticatedShell`. | Visual     |
| Dropdown com 3 itens: **Alterar dados** (`UserCog`), **Trocar senha** (`KeyRound`), **Sair** (`LogOut`). Item "Dashboard" que existia no dropdown atual foi **removido** (navegação para dashboard já acontece clicando no wordmark/logo — um destino único). | Simplificação |
| Topbar adiciona botão hambúrguer mobile (`Menu` Lucide) ocupando o espaço da nav pública em <768px — a nav colapsa em sheet lateral (ver §4.10). | Aditivo    |

> **A lógica de negócio do `Header.tsx` permanece idêntica**: `useAuth` para estado autenticado, `useUser` para `user.name`, `logout()` + `navigate('/')` após sair, `NavLink` do react-router para os itens de navegação pública. O que muda é DOM + classes Tailwind + extração do dropdown para `UserMenu`.

---

## Changelog v1 → v2

| Mudança                                                                                          | Tipo            |
|--------------------------------------------------------------------------------------------------|-----------------|
| `PointsVault` (cofre monumental 120px, em BRL) — **REMOVIDO**                                    | Breaking        |
| Total de pontos agora é **inteiro em pontos** (não BRL) — exibido em `PointsChip` no header     | Semântica       |
| Novo primitivo `HeaderChip` (variantes `referral` e `points`) — substitui `ReferralChip` standalone | Aditivo         |
| `StatGrid` → `LinkedStatGrid` (cada card é um `<Link>` com CTA individual)                       | Refactor        |
| `QuickLinks` (3 cards Meus Números/Pontos/Sorteios) — **REMOVIDO** (duplicava destinos do trio)  | Breaking        |
| Quick pills do header (Meus números/Suporte/etc.) — **REMOVIDAS** (cobertas pelos stats + footer)| Breaking        |
| Empty state de "Loterias que administra" — **REMOVIDO**; seção é condicional                     | Breaking        |
| `DashboardFooterBand` — **COMPACTADA** para 1 linha em desktop (~72px)                           | Refactor        |
| Avatar reduzido de 68px → 52px                                                                   | Refactor        |
| Saudação reduzida de clamp(32-52) → clamp(20-28)                                                 | Refactor        |
| `Divider` art déco entre seções — **REMOVIDO** (`mt-14 mb-10` virou `mt-8 md:mt-10`)             | Refactor        |
| Seção "Loterias que administra" movida para **ÚLTIMA seção do corpo claro**                     | Reorder         |

---

## 1. Escopo e estratégia de substituição

### Arquivos-alvo

**Criar**

- `src/components/layout/_primitives/UserMenu.tsx` **(NOVO v2.1)** *(dropdown da conta no topo direito — extraído do bloco inline atual do `Header.tsx`; aplica direção "Editorial Casino Noir")*
- `src/components/dashboard/DashboardHeader.tsx` *(header escuro compacto: avatar + saudação + 2 chips)*
- `src/components/dashboard/LinkedStatGrid.tsx` *(3 cards linkáveis lado a lado)*
- `src/components/dashboard/MyLotteriesPreview.tsx` *(header com CTAs + lista preview de até 3 lottery-rows + link "Ver todas". **SEM empty state**)*
- `src/components/dashboard/DashboardFooterBand.tsx` *(band escuro compacto, 1 linha em desktop)*
- `src/components/dashboard/_primitives/AvatarFrame.tsx` *(avatar circular 52px com ring conic-gradient ouro pulsando)*
- `src/components/dashboard/_primitives/HeaderChip.tsx` *(chip glass unificado — props decidem se é referral ou points)*
- `src/components/dashboard/_primitives/LinkedStatCard.tsx` *(card individual do `LinkedStatGrid`)*
- `src/components/dashboard/_primitives/LotteryRow.tsx` *(linha individual da lista de loterias administradas)*

**Reutilizar (sem mudança)**

- `src/components/home/_primitives/GoldNumeral.tsx` — usado **apenas** no `LinkedStatCard` (44px). Aceitar prop `variant: 'light' | 'dark'` (ver §4.6) — alternativamente o `LinkedStatCard` pode renderizar a classe `bg-stat-numeral` direto sem invocar o primitivo, simplificando a passagem.
- `src/components/common/CopyableCode.tsx` — fonte da lógica de copy + toast. O `HeaderChip` em variante `referral` pode delegar a ele ou implementar `navigator.clipboard.writeText` + `toast.success` direto (ver §4.3).

**Atualizar**

- `src/components/layout/Header.tsx` **(v2.1 — restyle, não reescrita)** — re-skinar o header global aplicando a direção "Editorial Casino Noir"; extrair o bloco do dropdown inline para o novo `UserMenu.tsx`; trocar a seta ASCII `▾` por `ChevronDown` do Lucide; remover item "Dashboard" do dropdown (logo à esquerda já navega para `/`); adicionar botão hambúrguer mobile (`Menu` Lucide) que abre um sheet lateral com a nav pública em <768px. **NÃO** alterar lógica de `useAuth`, `useUser`, `logout`, `navigate`.
- `src/pages/dashboard/DashboardPage.tsx` — reestruturar composição (ver §3).
- `src/styles/tokens.css` — anexar tokens novos de `design/dashboard/tokens.md §3` + tokens da topbar/UserMenu em `§3.8` **E remover os tokens de v1 listados em `tokens.md §4` (vault, quicklinks, pills, empty-lotteries)**.
- `tailwind.config.js` — merge incremental do `theme.extend` (incluindo `user-menu-open` keyframe + `shadow-dropdown` + `bg-topbar`) + remover entradas órfãs.
- `MOCKS.md` — atualizar entrada do dashboard (ver §8.2).

**Remover** (componentes de v1 que ficaram órfãos)

- `src/components/dashboard/PointsVault.tsx` (se chegou a ser implementado)
- `src/components/dashboard/QuickLinks.tsx` (idem)
- `src/components/dashboard/_primitives/ReferralChip.tsx` standalone — substituído pelo `HeaderChip` unificado
- `src/components/dashboard/_primitives/QuickPill.tsx` (idem)
- `src/components/dashboard/_primitives/Divider.tsx` decorativo (se chegou a ser criado)

> Se a v1 nunca foi implementada (apenas a spec existia), basta seguir a v2 do zero — sem remoção.

---

## 2. Dependências

```bash
npm ls lucide-react react-router-dom nauth-react sonner
```

- `lucide-react` — ícones usados na v2: `Hash`, `Sparkles`, `Copy`, `Check`, `ArrowRight`, `Ticket`, `Trophy`, `Users`, `Plus`, `Settings2`, `Coins`, `Clock`, `Car`, `Gem`, `LifeBuoy`, `Info`, `Mail`. (Removidos da v1: `Vault`, `ArrowDownToLine`, `ArrowUpRight`, `CalendarClock`.)
- **Adicionados em v2.1** (topbar global + UserMenu): `ChevronDown`, `ChevronRight`, `Menu`, `UserCog`, `KeyRound`, `LogOut`.
- `nauth-react` — `useUser` para `user.name`.
- `sonner` — toast de "Copiado".
- `react-router-dom` — `Link` para navegação.

Nenhuma dependência nova.

---

## 3. Nova composição da `DashboardPage.tsx`

```tsx
// src/pages/dashboard/DashboardPage.tsx
import { useEffect, useMemo } from 'react';
import { useUser } from 'nauth-react';
import { useReferral } from '@/hooks/useReferral';
import { useTicket } from '@/hooks/useTicket';
import { useLottery } from '@/hooks/useLottery';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { LinkedStatGrid } from '@/components/dashboard/LinkedStatGrid';
import { MyLotteriesPreview } from '@/components/dashboard/MyLotteriesPreview';
import { DashboardFooterBand } from '@/components/dashboard/DashboardFooterBand';

export const DashboardPage = (): JSX.Element => {
  const { user } = useUser();
  const { referralCode, panel, loadPanel } = useReferral();
  const { tickets, loadMine } = useTicket();
  const { myLotteries } = useLottery();

  useEffect(() => {
    void loadPanel();
    void loadMine();
  }, [loadPanel, loadMine]);

  const lotteryCount = useMemo(
    () => new Set(tickets.map((t) => t.lotteryId)).size,
    [tickets],
  );

  // panel.totalPoints: NOVO contrato (ver §8.2). Fallback para 0 enquanto o backend não expõe.
  const totalPoints = panel?.totalPoints ?? 0;

  return (
    <main className="min-h-screen bg-dash-page text-fortuno-black flex flex-col">
      <DashboardHeader
        user={user}
        referralCode={referralCode}
        totalPoints={totalPoints}
      />

      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 py-8 md:py-10 flex-1">
        <LinkedStatGrid
          ticketsCount={tickets.length}
          lotteriesPlaying={lotteryCount}
          referrals={panel?.totalPurchases ?? 0}
        />

        {myLotteries.length > 0 && (
          <MyLotteriesPreview lotteries={myLotteries} max={3} className="mt-8 md:mt-10" />
        )}
      </div>

      <DashboardFooterBand />
    </main>
  );
};
```

> **Ordem visual da página** (de cima pra baixo):
> 1. `DashboardHeader` (escuro compacto) — saudação + avatar + ReferralChip + PointsChip
> 2. `LinkedStatGrid` (claro) — Bilhetes / Loterias participadas / Indicações
> 3. `MyLotteriesPreview` (claro, **condicional** `myLotteries.length > 0`) — última seção do corpo
> 4. `DashboardFooterBand` (escuro compacto) — ornamento + tagline + 3 links

> **Decisão de design — QuickLinks ELIMINADO**: na v1 havia uma seção "Onde você quer ir agora?" com 3 quicklink-cards (Meus Números, Meus Pontos, Meus Sorteios). Como o `LinkedStatGrid` da v2 já entrega exatamente esses 3 destinos como CTAs individuais nos cards de stats, manter os QuickLinks duplicava o objetivo e custava ~240px de scroll. A decisão é **eliminar QuickLinks** e confiar na descoberta via stats + chip Pontos do header (que aponta para `/meus-pontos`). Isso libera espaço para a página caber em ~1080px no desktop e respeita o princípio HIG `primary-action` (uma única chamada por destino).

---

## 4. Estrutura DOM por seção (classes Tailwind exatas)

### 4.1 `DashboardHeader`

**Conceito**: faixa escura **compacta** (~140-160px de altura no desktop, antes ~320px). Saudação + avatar + 2 chips (ReferralChip e PointsChip), todos em uma linha em desktop ≥1024px. Em tablet/mobile, chips empilham na linha 2.

**Props**:
```ts
import type { User } from 'nauth-react'; // confirmar nome do tipo no pacote

export interface DashboardHeaderProps {
  user: User | null | undefined;
  referralCode?: string;
  totalPoints: number; // inteiro de pontos (não BRL). Fallback 0.
}
```

**DOM**:
```tsx
<header
  className="bg-dash-header text-fortuno-offwhite relative overflow-hidden isolate"
  aria-labelledby="dash-greeting"
>
  <div className="relative z-10 mx-auto max-w-7xl px-6 pt-6 pb-6 md:pt-8 md:pb-8">
    <div className="grid items-center gap-5 grid-cols-[auto_1fr]
                    lg:grid-cols-[auto_1fr_auto_auto]">
      <AvatarFrame initials={getInitials(user?.name)} />

      <div className="min-w-0">
        <span className="text-[10px] font-semibold tracking-[0.26em] uppercase text-fortuno-gold-intense">
          Painel Fortuno
        </span>
        <h1
          id="dash-greeting"
          className="font-display text-fortuno-offwhite leading-tight mt-0.5
                     text-[clamp(20px,2.4vw,28px)] tracking-[-0.01em]"
        >
          Olá,{' '}
          <span className="italic text-fortuno-gold-soft">
            {user?.name ? user.name.split(' ')[0] : 'visitante'}
          </span>
          .
        </h1>
      </div>

      {/* Chips: ocupam linha 2 em mobile/tablet (col-span-2), lado-a-lado em desktop */}
      <div className="col-span-2 lg:col-span-2 lg:contents
                      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-none gap-2.5 lg:gap-3
                      mt-1 lg:mt-0">
        {referralCode && <HeaderChip variant="referral" code={referralCode} />}
        <HeaderChip variant="points" points={totalPoints} />
      </div>
    </div>
  </div>
</header>
```

> **Sem mais**: eyebrow com data, ornamento art déco, quick pills nav. Tudo cortado para densidade.

**Helpers necessários** (em `src/utils/`):
- `getInitials(name?: string): string` — pega 2 iniciais ("Rodrigo Landim" → "RL"; "Ana" → "A"; default → "F" de Fortuno).

### 4.2 `AvatarFrame` (primitive)

**Props**:
```ts
export interface AvatarFrameProps {
  initials: string;        // ex.: "RL"
  size?: 'sm' | 'md';      // 'sm' = 44px, 'md' = 52px (default no header)
  className?: string;
}
```

**DOM**:
```tsx
<div
  className={cn(
    'relative rounded-full isolate',
    size === 'md' ? 'w-[52px] h-[52px]' : 'w-11 h-11',
    "before:content-[''] before:absolute before:-inset-[2px]",
    'before:rounded-full before:bg-avatar-ring before:-z-10',
    'before:animate-avatar-breath',
    className,
  )}
  aria-hidden="true"
>
  <div className="w-full h-full rounded-full bg-gradient-to-br from-fortuno-green-elegant to-fortuno-green-deep
                  border-2 border-fortuno-gold-soft/30 grid place-items-center
                  font-display italic font-bold text-fortuno-gold-soft text-[20px] tracking-tight">
    {initials}
  </div>
</div>
```

> Diferença vs v1: 52px (era 68px), `text-[20px]` (era 26px), ring com opacidade reduzida (0.75 vs 0.85), `inset-[2px]` (era 3px).

### 4.3 `HeaderChip` (primitive UNIFICADO — substitui `ReferralChip` standalone)

**Conceito**: chip glass usado no header escuro. Componente único com **discriminated union** por variant. Ambas as variantes compartilham layout: `[icon-lead 32px] [label uppercase 9px / value Playfair 22px] [action 32px]`.

**Props**:
```ts
type ReferralVariantProps = {
  variant: 'referral';
  code: string;
};

type PointsVariantProps = {
  variant: 'points';
  points: number; // inteiro
};

export type HeaderChipProps = ReferralVariantProps | PointsVariantProps;
```

**DOM (variante `referral`)**:
```tsx
<div
  className="relative inline-flex items-center gap-2.5 pl-[14px] pr-2.5 py-2
             rounded-[14px] bg-chip-glass border border-[color:var(--chip-glass-border)]
             backdrop-blur-md transition-colors duration-noir-base
             hover:border-[color:var(--chip-glass-border-hover)] min-h-[56px]"
  role="group"
  aria-labelledby="ref-label"
>
  <div className="w-8 h-8 rounded-[10px] bg-[color:var(--chip-lead-bg)]
                  border border-[color:var(--chip-lead-border)] text-fortuno-gold-soft
                  grid place-items-center shrink-0"
       aria-hidden="true">
    <Hash className="w-4 h-4" />
  </div>

  <div className="flex flex-col min-w-0">
    <span id="ref-label"
          className="block text-[9px] font-semibold tracking-[0.26em] uppercase
                     text-fortuno-offwhite/65 leading-none">
      Código de indicação
    </span>
    <span className="block font-display font-bold text-[22px] leading-[1.05]
                     text-fortuno-gold-soft tabular-nums mt-[3px]"
          aria-live="polite">
      {code}
    </span>
  </div>

  <button
    type="button"
    onClick={handleCopy}
    className="inline-flex items-center justify-center w-8 h-8 rounded-full
               bg-[color:var(--chip-action-bg)] border border-[color:var(--chip-action-border)]
               text-fortuno-gold-soft transition-all duration-noir-fast
               hover:bg-fortuno-gold-soft hover:text-fortuno-black hover:rotate-[8deg] hover:scale-110
               focus-visible:outline-none focus-visible:shadow-gold-focus shrink-0"
    aria-label={`Copiar código de indicação ${code}`}
  >
    {copied ? <Check className="w-3.5 h-3.5 animate-check-bounce" /> : <Copy className="w-3.5 h-3.5" />}
  </button>
</div>
```

**DOM (variante `points`)**:
```tsx
<div
  className="relative inline-flex items-center gap-2.5 pl-[14px] pr-2.5 py-2
             rounded-[14px] bg-chip-glass border border-[color:var(--chip-glass-border)]
             backdrop-blur-md transition-colors duration-noir-base
             hover:border-[color:var(--chip-glass-border-hover)] min-h-[56px]"
  role="group"
  aria-labelledby="pts-label"
>
  <div className="w-8 h-8 rounded-[10px] bg-[color:var(--chip-lead-bg)]
                  border border-[color:var(--chip-lead-border)] text-fortuno-gold-soft
                  grid place-items-center shrink-0"
       aria-hidden="true">
    <Sparkles className="w-4 h-4" />
  </div>

  <div className="flex flex-col min-w-0">
    <span id="pts-label"
          className="block text-[9px] font-semibold tracking-[0.26em] uppercase
                     text-fortuno-offwhite/65 leading-none">
      Total de pontos
    </span>
    <span className="block font-display font-bold text-[22px] leading-[1.05]
                     text-fortuno-gold-soft tabular-nums mt-[3px]"
          aria-label={`${points.toLocaleString('pt-BR')} pontos acumulados`}>
      {points.toLocaleString('pt-BR')}
      <span className="text-[11px] font-sans font-semibold tracking-[0.12em] uppercase
                       text-fortuno-gold-intense/75 ml-1 not-italic">
        pts
      </span>
    </span>
  </div>

  <Link
    to="/meus-pontos"
    className="inline-flex items-center gap-1 px-2.5 h-8 min-w-[44px] rounded-full
               bg-[color:var(--chip-action-bg)] border border-[color:var(--chip-action-border)]
               text-fortuno-gold-soft text-[11px] font-semibold tracking-wide
               transition-all duration-noir-fast
               hover:bg-fortuno-gold-soft hover:text-fortuno-black hover:-translate-y-px
               focus-visible:outline-none focus-visible:shadow-gold-focus shrink-0"
    aria-label="Ver extrato de pontos"
  >
    Extrato
    <ArrowRight className="w-3 h-3" />
  </Link>
</div>
```

**Lógica de copy (variante `referral`)**:
```ts
const [copied, setCopied] = useState(false);
const { t } = useTranslation();

const handleCopy = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(code);
    toast.success(t('common.copied'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch {
    toast.error(t('common.error'));
  }
};
```

**Acessibilidade**:
- `<div role="group" aria-labelledby="ref-label|pts-label">` agrupa label + valor + action.
- PointsChip valor com `aria-label="1.247 pontos acumulados"` — o separador `.` do pt-BR é lido erraticamente pelos screen readers; o label explícito normaliza.
- Botão copy: `aria-label` dinâmico inclui o código.
- Link "Extrato": `aria-label="Ver extrato de pontos"` (sem o label, "Extrato" sozinho é ambíguo).

### 4.4 `LinkedStatGrid`

**Props**:
```ts
export interface LinkedStatGridProps {
  ticketsCount: number;
  lotteriesPlaying: number;
  referrals: number;
}
```

**DOM**:
```tsx
<section aria-labelledby="stats-title">
  <h2 id="stats-title" className="sr-only">Resumo da sua conta</h2>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <LinkedStatCard
      number="01"
      icon="ticket"
      label="Bilhetes comprados"
      value={ticketsCount}
      ctaLabel="Ver meus números"
      to="/meus-numeros"
    />
    <LinkedStatCard
      number="02"
      icon="trophy"
      label="Loterias participadas"
      value={lotteriesPlaying}
      ctaLabel="Ver meus sorteios"
      to="/meus-sorteios"
    />
    <LinkedStatCard
      number="03"
      icon="users"
      label="Indicações"
      value={referrals}
      ctaLabel="Ver meu extrato de pontos"
      to="/meus-pontos"
    />
  </div>
</section>
```

### 4.5 `LinkedStatCard` (primitive)

**Props**:
```ts
export interface LinkedStatCardProps {
  number: string;       // "01" "02" "03"
  icon: 'ticket' | 'trophy' | 'users';
  label: string;
  value: number;
  ctaLabel: string;
  to: string;
}
```

**DOM**:
```tsx
<Link
  to={to}
  className="group relative flex flex-col gap-2 p-[18px] pb-4
             bg-white border border-[color:var(--card-paper-border)] rounded-2xl
             shadow-paper overflow-hidden no-underline text-inherit
             transition-all duration-noir-base ease-noir-spring
             hover:-translate-y-0.5 hover:border-[color:var(--card-paper-border-hover)]
             hover:shadow-paper-hover
             focus-visible:outline-none focus-visible:shadow-gold-focus
             min-h-[148px]
             before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-px
             before:bg-card-gold-bar before:opacity-80"
  aria-labelledby={`stat-${number}-label stat-${number}-value`}
>
  <div className="flex items-center justify-between gap-3">
    <div className="w-[34px] h-[34px] rounded-[10px]
                    bg-gradient-to-b from-[#faf3e1] to-[#f0e3b8]
                    text-fortuno-gold-intense grid place-items-center
                    border border-fortuno-gold-intense/25 shrink-0"
         aria-hidden="true">
      <Icon name={icon} className="w-[17px] h-[17px]" />
    </div>
    <span className="text-[10px] text-fortuno-black/40 tracking-[0.22em] uppercase">
      {number}
    </span>
  </div>

  <span id={`stat-${number}-label`}
        className="text-[10px] font-semibold tracking-[0.26em] uppercase text-fortuno-black/58">
    {label}
  </span>

  <span id={`stat-${number}-value`}
        className="font-display italic font-extrabold text-[44px] leading-[0.92] tracking-[-0.03em]
                   bg-stat-numeral bg-clip-text text-transparent tabular-nums">
    {value.toLocaleString('pt-BR')}
  </span>

  <div className="h-px bg-gold-divider-soft my-1" aria-hidden="true" />

  <span className="inline-flex items-center gap-1.5 text-xs font-semibold
                   text-fortuno-gold-intense transition-colors duration-noir-base
                   group-hover:text-fortuno-green-elegant">
    {ctaLabel}
    <ArrowRight className="w-[13px] h-[13px] transition-transform duration-noir-base
                           ease-noir-spring group-hover:translate-x-[3px]" />
  </span>
</Link>
```

**Acessibilidade**:
- O `<a>` inteiro é o link único focável — `aria-labelledby="stat-X-label stat-X-value"` faz o screen reader anunciar "Bilhetes comprados, 47, link".
- Seta + número decorativo são `aria-hidden`.

> **Question pendente sobre `/meus-sorteios`**: a rota atual em `src/pages/dashboard/MyLotteriesPage.tsx` (ou equivalente) lista sorteios **administrados** pelo usuário, mas o card "Loterias participadas" do trio aponta para a mesma rota porque o usuário pediu textualmente "Ver meus sorteios" como CTA. A semântica correta seria **uma rota nova `/meus-participacoes`** (ou similar) listando loterias em que o usuário comprou bilhetes — diferente das loterias que ele administra. **Para v2**, mantemos o link para `/meus-sorteios` conforme o pedido do usuário, mas registramos aqui que o roteamento pode precisar de ajuste em uma feature futura: ou `MyLotteriesPage` passa a renderizar duas tabs (Participo / Administro), ou criamos `/meus-participacoes` separado e o CTA do card 02 muda. Sinalizar com o time de produto antes do merge da implementação React.

### 4.6 `MyLotteriesPreview`

**Props**:
```ts
export interface MyLotteriesPreviewProps {
  lotteries: LotteryInfo[];
  max?: number; // default 3
  className?: string;
}
```

**Lógica**:
```ts
const visible = lotteries.slice(0, max);
const hasMore = lotteries.length > max;
// SEM empty state — o componente NÃO renderiza nada quando lotteries.length === 0.
// A condição de renderização vive na DashboardPage (myLotteries.length > 0 && <MyLotteriesPreview .../>).
```

**DOM**:
```tsx
<section aria-labelledby="my-lotteries-title" className={className}>
  <header className="flex items-start md:items-center justify-between gap-3 flex-col md:flex-row mb-4">
    <div className="flex items-baseline gap-3 flex-wrap">
      <h2 id="my-lotteries-title"
          className="font-display text-fortuno-black text-[clamp(20px,2.2vw,26px)] leading-tight">
        Loterias que você <span className="italic">administra</span>
      </h2>
      <span className="text-xs text-fortuno-black/50">
        · <strong className="font-semibold text-fortuno-black/80">{lotteries.length}</strong> ativas
      </span>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <Link to="/meus-sorteios" className="cta-ghost-light">
        Ver todas
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
      <Link to="/meus-sorteios/novo" className="cta-primary">
        <Plus className="w-4 h-4" />
        Novo sorteio
      </Link>
    </div>
  </header>

  <ul className="flex flex-col gap-2.5" role="list">
    {visible.map((lottery) => (
      <LotteryRow key={lottery.lotteryId} lottery={lottery} />
    ))}
  </ul>

  {hasMore && (
    <div className="mt-4 text-center md:text-right">
      <Link
        to="/meus-sorteios"
        className="inline-flex items-center gap-1.5 text-sm text-fortuno-gold-intense
                   hover:text-fortuno-green-elegant font-semibold transition-colors
                   focus-visible:outline-none focus-visible:shadow-gold-focus rounded-full px-2 py-1"
      >
        Ver todas as suas loterias ({lotteries.length})
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )}
</section>
```

> **SEM empty state**. Na v2, se `lotteries.length === 0`, a `DashboardPage` não renderiza este componente (condicional explícita). Não há mais o card "Comece seu primeiro sorteio." Caso o time de produto queira reintroduzir um onboarding para usuários sem loterias administradas, isso vira **outra feature** — não é responsabilidade do dashboard atual.

### 4.7 `LotteryRow` (primitive)

**Props**:
```ts
import type { LotteryInfo } from '@/types/lottery';

export interface LotteryRowProps {
  lottery: LotteryInfo;
}
```

**DOM** (versão compacta v2 — padding e tipografia reduzidos vs v1):
```tsx
<li
  className="grid grid-cols-[40px_1fr_auto] gap-3.5 items-center
             p-3 px-4 rounded-xl bg-white border border-fortuno-black/[0.06]
             transition-all duration-noir-base
             hover:border-fortuno-gold-intense/45 hover:bg-[#fffdf6]
             hover:-translate-y-px hover:shadow-[0_6px_14px_-10px_rgba(10,42,32,0.18)]"
>
  <div
    className="w-10 h-10 rounded-[10px] bg-marker-done text-fortuno-gold-soft
               grid place-items-center border border-fortuno-gold-soft/30"
    aria-hidden="true"
  >
    <Icon name={iconForLotteryName(lottery.name)} className="w-[18px] h-[18px]" />
  </div>

  <div className="min-w-0">
    <p className="font-semibold text-fortuno-black truncate text-sm">
      {lottery.name}
    </p>
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-fortuno-black/60 mt-0.5">
      <span className="inline-flex items-center gap-1">
        <Coins className="w-3 h-3 text-fortuno-gold-intense" />
        {formatBRL(lottery.totalPrizeValue)}
      </span>
      {totalTickets > 0 && (
        <span className="inline-flex items-center gap-1">
          <Ticket className="w-3 h-3 text-fortuno-gold-intense" />
          {soldTickets} / {totalTickets}
        </span>
      )}
      <LotteryStatusInline lottery={lottery} />
    </div>
  </div>

  <Link
    to={`/meus-sorteios/${lottery.lotteryId}/editar`}
    className="cta-ghost-light"
    aria-label={`Gerenciar ${lottery.name}`}
  >
    Gerenciar
    <Settings2 className="w-3.5 h-3.5" />
  </Link>
</li>
```

**Helpers**:
- `iconForLotteryName(name: string): IconKey` — mesma heurística do `LotteryCardPremium` da home (extrair para `src/utils/lotteryIcon.ts`).
- `LotteryStatusInline({ lottery })`: componente local que renderiza "Aberto"/"Agendado · DD/MM"/"Encerrado" com ícone + texto.

> **`soldTickets` mock**: idem v1. Continua dependendo de `/lottery/{id}/ticketStats` (já registrado em `MOCKS.md`).

### 4.8 `DashboardFooterBand` (COMPACTA)

**Props**: nenhuma (conteúdo estático).

**DOM**:
```tsx
<footer className="bg-dash-footer text-fortuno-offwhite relative overflow-hidden py-4 md:py-5
                   before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-px
                   before:bg-gold-divider before:opacity-55"
        aria-labelledby="footer-title">
  <h2 id="footer-title" className="sr-only">Rodapé Fortuno</h2>
  <div className="relative z-10 mx-auto max-w-7xl px-6">
    <div className="grid md:grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-6">

      {/* Ornamento art déco curto + tagline */}
      <div className="flex items-center gap-3">
        <span className="footer-ornament hidden sm:inline-flex" aria-hidden="true">
          <span className="deco-diamond" />
        </span>
        <p className="font-display text-fortuno-offwhite text-sm md:text-base leading-tight">
          Fortuno — <span className="italic text-fortuno-gold-soft">sua sorte é séria.</span>
        </p>
      </div>

      <span aria-hidden="true" className="hidden md:block h-5 w-px bg-fortuno-offwhite/15 justify-self-center" />

      {/* Links de suporte/contato */}
      <nav aria-label="Rodapé — suporte e contato"
           className="flex flex-wrap items-center gap-x-4 gap-y-1 md:justify-end">
        <Link to="/suporte" className="footer-link">
          <LifeBuoy className="w-3.5 h-3.5" />
          Suporte
        </Link>
        <a href="/#como" className="footer-link">
          <Info className="w-3.5 h-3.5" />
          Como funciona
        </a>
        <a href="mailto:contato@fortuno.com.br" className="footer-link">
          <Mail className="w-3.5 h-3.5" />
          contato@fortuno.com.br
        </a>
      </nav>
    </div>
  </div>
</footer>
```

> **Diferenças vs v1**:
> - 1 linha em desktop (~72px) vs band editorial cheia (~280px).
> - Sem h2 visível ("Cada bilhete é um ato de confiança"), sem 2 CTAs grandes ("Falar com o suporte" + "Como funciona"), sem segunda passagem do ornamento, sem CNPJ uppercase.
> - Tipografia: tagline `text-sm md:text-base`, links `text-xs`.
> - Em mobile: vira 2 linhas (tagline em cima, links embaixo) via `grid-cols-1` no breakpoint <md.

> **Footer global do site**: este `DashboardFooterBand` continua sendo um footer **interno** ao dashboard. Se houver um footer institucional global no layout autenticado, ele aparece **abaixo** desta band. Se a v1 tinha planejado este componente substituir o footer global, **revogar** essa decisão — o footer global mantém seu papel.

### 4.9 `UserMenu` (NOVO em v2.1 — primitivo do `Header.tsx` global)

**Conceito**: dropdown da conta no canto direito da topbar global. Trigger é uma pílula com avatar circular pequeno + primeiro nome + chevron. O dropdown é um cartão "papel" off-white com borda ouro, sombra noir, mini-card identitário no topo (avatar 56px com ring + nome completo + e-mail), seguido de 3 ações: Alterar dados, Trocar senha, Sair (esta última em tom cobre queimado, NÃO vermelho berrante).

> **Localização**: `src/components/layout/_primitives/UserMenu.tsx`. **Substitui visualmente** o bloco `<div className="relative">…</div>` que existe hoje dentro de `Header.tsx` (linhas ~53-94). NÃO é uma rota nova; é apenas o restyle (extraído para componente próprio para deixar o `Header.tsx` magro).

**Props**:
```ts
import type { User } from 'nauth-react'; // confirmar nome do tipo no pacote

export interface UserMenuProps {
  user: User | null | undefined;
  onLogout: () => void | Promise<void>;
}
```

**Mapa de ícones Lucide** (UserMenu):
| Item                   | Ícone Lucide        | Variante visual    |
|------------------------|---------------------|--------------------|
| Trigger chevron        | `ChevronDown`       | rotate-180 quando aberto |
| Item "Alterar dados"   | `UserCog`           | item neutro        |
| Item "Trocar senha"    | `KeyRound`          | item neutro        |
| Item "Sair"            | `LogOut`            | item `is-danger` (cobre queimado) |
| Chevron de cada item   | `ChevronRight`      | desloca 3px no hover |

**DOM (resumido — ver mockup `design/dashboard/mockup.html` para classes exatas)**:

```tsx
// Trigger
<div className="relative">
  <button
    type="button"
    ref={triggerRef}
    onClick={() => setOpen((v) => !v)}
    className="user-trigger inline-flex items-center gap-2.5 pl-1.5 pr-3 py-1.5
               bg-[color:var(--user-trigger-bg)] border border-[color:var(--user-trigger-border)]
               rounded-full text-fortuno-offwhite min-h-[44px]
               transition-colors duration-noir-fast
               hover:bg-[color:var(--user-trigger-bg-hover)]
               hover:border-[color:var(--user-trigger-border-hover)]
               focus-visible:outline-none focus-visible:shadow-gold-focus
               aria-expanded:bg-[color:var(--user-trigger-bg-hover)]"
    aria-haspopup="menu"
    aria-expanded={open}
    aria-controls="userMenu"
    aria-label={`Menu da minha conta, ${user?.name ?? ''}`}
  >
    <span className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-fortuno-green-elegant to-fortuno-green-deep
                     border border-fortuno-gold-soft/45 grid place-items-center
                     font-display italic font-bold text-fortuno-gold-soft text-sm tracking-tight"
          aria-hidden="true">
      {getInitials(user?.name)}
    </span>
    <span className="hidden md:inline text-[13px] font-semibold text-fortuno-offwhite tracking-tight max-w-[120px] truncate">
      {user?.name ? user.name.split(' ')[0] : 'Conta'}
    </span>
    <ChevronDown
      className={cn(
        'w-[15px] h-[15px] text-fortuno-gold-soft/75 transition-transform duration-noir-base',
        open && 'rotate-180 text-fortuno-gold-soft',
      )}
      aria-hidden="true"
    />
  </button>

  {open && (
    <div
      id="userMenu"
      ref={menuRef}
      role="menu"
      aria-labelledby="userMenuTrigger"
      className="absolute top-[calc(100%+10px)] right-0 w-64
                 bg-[color:var(--dropdown-bg)] border border-[color:var(--dropdown-border)]
                 rounded-2xl shadow-dropdown overflow-hidden z-50
                 animate-user-menu-open origin-top-right
                 before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-px
                 before:bg-card-gold-bar before:opacity-95"
    >
      {/* Mini-card identitário */}
      <div className="grid grid-cols-[auto_1fr] gap-3.5 items-center px-[18px] pt-[18px] pb-4
                      relative after:content-[''] after:absolute after:left-[18px] after:right-[18px]
                      after:bottom-0 after:h-px after:bg-dropdown-divider">
        <div className="relative w-14 h-14 rounded-full isolate
                        before:content-[''] before:absolute before:-inset-[2px]
                        before:rounded-full before:bg-avatar-ring before:-z-10 before:opacity-90"
             aria-hidden="true">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-fortuno-green-elegant to-fortuno-green-deep
                          border-2 border-fortuno-gold-soft/45 grid place-items-center
                          font-display italic font-bold text-fortuno-gold-soft text-[22px] tracking-tight">
            {getInitials(user?.name)}
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-[9px] font-semibold tracking-[0.26em] uppercase text-fortuno-gold-intense leading-none mb-1">
            Conta Fortuno
          </div>
          <div className="font-display font-bold text-base text-fortuno-black truncate">
            {user?.name ?? 'Visitante'}
          </div>
          <div className="text-[11px] text-fortuno-black/55 truncate mt-0.5">
            {user?.email ?? ''}
          </div>
        </div>
      </div>

      {/* Lista de ações */}
      <div className="flex flex-col p-2">
        <NavLink to="/conta/dados" role="menuitem"
                 className="user-menu-item ..." onClick={onClose}>
          <span className="item-icon"><UserCog className="w-[15px] h-[15px]" /></span>
          <span>Alterar dados</span>
          <ChevronRight className="item-chevron" aria-hidden="true" />
        </NavLink>

        <NavLink to="/conta/alterar-senha" role="menuitem"
                 className="user-menu-item ..." onClick={onClose}>
          <span className="item-icon"><KeyRound className="w-[15px] h-[15px]" /></span>
          <span>Trocar senha</span>
          <ChevronRight className="item-chevron" aria-hidden="true" />
        </NavLink>

        <div className="h-px bg-dropdown-divider mx-2.5 my-1.5" role="separator" aria-hidden="true" />

        <button type="button" role="menuitem" onClick={() => { onClose(); void onLogout(); }}
                className="user-menu-item is-danger ...">
          <span className="item-icon"><LogOut className="w-[15px] h-[15px]" /></span>
          <span>Sair</span>
          <ChevronRight className="item-chevron" aria-hidden="true" />
        </button>
      </div>
    </div>
  )}
</div>
```

**Comportamento (estado e teclado)**:

```ts
const [open, setOpen] = useState(false);
const triggerRef = useRef<HTMLButtonElement>(null);
const menuRef    = useRef<HTMLDivElement>(null);

// Fechar ao clicar fora
useEffect(() => {
  if (!open) return;
  const handler = (e: MouseEvent) => {
    if (menuRef.current?.contains(e.target as Node)) return;
    if (triggerRef.current?.contains(e.target as Node)) return;
    setOpen(false);
  };
  document.addEventListener('mousedown', handler);
  return () => document.removeEventListener('mousedown', handler);
}, [open]);

// Escape fecha + foco volta ao trigger
useEffect(() => {
  if (!open) return;
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };
  document.addEventListener('keydown', handler);
  return () => document.removeEventListener('keydown', handler);
}, [open]);

// Foco vai ao primeiro item ao abrir
useEffect(() => {
  if (!open) return;
  const first = menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
  first?.focus();
}, [open]);

// ArrowDown / ArrowUp navegam entre itens (delegar no container do menu)
const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
  const items = Array.from(
    menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []
  );
  const current = document.activeElement as HTMLElement | null;
  const idx = current ? items.indexOf(current) : -1;
  if (idx === -1) return;
  e.preventDefault();
  const next = e.key === 'ArrowDown'
    ? items[(idx + 1) % items.length]
    : items[(idx - 1 + items.length) % items.length];
  next.focus();
};
```

**Acessibilidade (resumo)**:
- Trigger: `aria-haspopup="menu"`, `aria-expanded={open}`, `aria-controls="userMenu"`, `aria-label` dinâmico inclui o nome do usuário.
- Menu: `role="menu"` no container, `role="menuitem"` em cada linha, `role="separator"` no divisor, `aria-labelledby` apontando para o id do trigger.
- Foco: ao abrir vai ao primeiro item; setas ↑/↓ ciclam; `Escape` fecha e foco volta ao trigger.
- `prefers-reduced-motion`: `animate-user-menu-open` cai a 1ms via regra global do wizard (já cobre).
- Item "Sair" usa cor cobre queimado (`#8a5a2b`) sobre paper — contraste **5.6:1** (AA). Ícone + texto, cor não é único indicador.

### 4.10 `Header.tsx` global — restyle (NÃO reescrita)

**Arquivo**: `src/components/layout/Header.tsx`. O componente continua existindo com a mesma assinatura e roteamento. O que muda:

1. **Cor de fundo**: troca do flat `bg-fortuno-green-deep shadow-md` por `bg-topbar` (gradient sutil) + pseudo-elemento `::after` com a borda inferior ouro (`bg-topbar-border-bottom`).
2. **Wordmark**: opção A — substituir `<img src="/logo-light.png">` por wordmark Playfair "Fortuno" + ponto ouro acima do "i" (mais premium, escala bem). Opção B — manter a imagem, só dar `h-9` ao invés de `h-10`. Decisão fica com produto/design final, mas o mockup ilustra a opção A.
3. **NavLink**: as 4 entradas (Sorteios, Meus Números, Quem Somos, Fale Conosco) trocam para o estilo `site-nav-link` — quando `isActive`, ganham `bg-[color:var(--nav-item-active-bg)]` + borda ouro suave + underline ouro pequeno (2px, 18px de largura, sombra ouro fraca). Quando inativo, texto `offwhite/78` + hover ouro-soft.
4. **Dropdown inline → `UserMenu`**: o bloco `{isAuthenticated ? (<div className="relative">…</div>) : (<NavLink to="/login">…)}` é simplificado para:
   ```tsx
   {isAuthenticated ? (
     <UserMenu user={user} onLogout={() => void handleLogout()} />
   ) : (
     <NavLink to="/login" className="rounded-full bg-fortuno-gold-intense px-4 py-2 text-sm font-bold text-fortuno-black hover:bg-fortuno-gold-soft transition-colors">
       {t('menu.login')}
     </NavLink>
   )}
   ```
5. **Botão hambúrguer mobile**: aparece **somente em <768px** (a nav pública vira `hidden md:flex`). Trigger:
   ```tsx
   <button type="button" onClick={() => setMobileNavOpen(true)}
           className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full
                      border border-[color:var(--user-trigger-border)] bg-[color:var(--user-trigger-bg)]
                      text-fortuno-gold-soft hover:border-[color:var(--user-trigger-border-hover)]
                      hover:bg-[color:var(--user-trigger-bg-hover)] transition-colors"
           aria-label="Abrir menu de navegação"
           aria-expanded={mobileNavOpen}>
     <Menu className="w-5 h-5" />
   </button>
   ```
   Ao abrir, renderizar um sheet/drawer lateral à direita (largura ~80vw, max 320px) com a mesma lista da nav pública em coluna, fundo `bg-topbar`, borda ouro à esquerda, título "Navegar" em Playfair + ornamento. Pode reutilizar o componente `Sheet` (Radix) ou criar inline. Fechamento: clique fora, `Escape`, clique em link. Comportamento de a11y idêntico ao do `UserMenu` (focus trap, foco volta ao botão hambúrguer).

6. **Altura da topbar**: fixar `height: 64px` no container interno (em vez de `py-3`) — garante que ela combine com a altura do `dash-header` logo abaixo sem criar serrilhado de 1-2px no boundary ouro.

7. **i18n**: chaves novas a adicionar em `src/locales/pt-BR.json` (e demais idiomas):
   - `menu.account` → "Conta Fortuno"
   - `menu.editProfile` → "Alterar dados" (já existia; manter)
   - `menu.changePassword` → "Trocar senha" (já existia; manter)
   - `menu.logout` → "Sair" (já existia; manter)
   - `menu.openNav` → "Abrir menu de navegação"
   - `menu.userMenuLabel` → "Menu da minha conta"

**O que NÃO mudar no `Header.tsx`**:
- A importação e uso de `useAuth`, `useUser`, `useTranslation`, `useNavigate`, `NavLink`.
- A lógica de `handleLogout` (await + navigate).
- A condição `isAuthenticated ? UserMenu : LoginButton`.
- O contrato de uso pelo `AuthenticatedShell` ou layouts pai.

> **Item "Dashboard" REMOVIDO do dropdown**: o menu atual lista 4 itens (Dashboard, Editar dados, Alterar senha, Sair). A v2.1 simplifica para 3 (Alterar dados, Trocar senha, Sair). Justificativa: o wordmark à esquerda navega para `/` e o usuário autenticado é redirecionado para `/dashboard` pela lógica de roteamento, então "Dashboard" no dropdown é redundante. Se o time de produto quiser preservar a entrada explícita, basta inserir mais um `<NavLink>` antes de "Alterar dados" usando o ícone `LayoutDashboard` do Lucide.

---

## 5. Comportamento responsivo

| Breakpoint  | Comportamento                                                                                          |
|-------------|--------------------------------------------------------------------------------------------------------|
| `< 640px`   | **Topbar**: wordmark à esquerda, hambúrguer + UserTrigger (só avatar + chevron, SEM nome) à direita; altura 56-60px. Dropdown do UserMenu expande para `calc(100vw - 24px)` (máx 340px), ancorado à direita com respiro de 12px. Dashboard header: avatar+saudação na linha 1, ReferralChip na linha 2, PointsChip na linha 3 (cada um full-width). LinkedStatGrid: 1 coluna empilhada. Lottery row: pode quebrar a CTA "Gerenciar" para baixo (testar; se quebrar, ok, mantém usabilidade). Footer: 2 linhas (tagline em cima, links embaixo). |
| `640-767`   | Topbar idem mobile (hambúrguer visível). Dashboard header: chips na linha 2 em 2 colunas (lado-a-lado). LinkedStatGrid: 3 colunas (sm:grid-cols-3). |
| `md (768)`  | **Topbar**: nav pública aparece (md:flex); hambúrguer some (md:hidden). UserTrigger mostra nome do usuário (`md:inline`). Altura 64px. |
| `lg (1024)` | Dashboard header: 4 colunas em uma linha (avatar / saudação / ReferralChip / PointsChip). Footer: 1 linha. |
| `xl (1280)` | `max-w-7xl` aplicado; sobra margem editorial.                                                         |

**Regras inquebráveis** (priority §5 + §2):
- **Zero horizontal scroll** em 375px.
- Todos os CTAs e elementos principais mantêm `min-h-[40px]` (CTA primary/ghost) ou `min-h-[56px]` (chip wrapper) — touch targets ≥ 44px funcionalmente garantidos.
- Sem nenhum elemento essencial obscurecido por safe areas (mobile sem chrome custom; o app usa o padrão do navegador).

---

## 6. Acessibilidade (WCAG AA mínimo)

Herda contrato do wizard e da home + adições do dashboard v2:

- **Focus visível global**: `focus-visible:shadow-gold-focus` (ring ouro 3px) em CADA elemento interativo (chips, copy button, link "Extrato", linked-stat cards, lottery row CTA, footer links).
- **Hierarquia de headings**:
  - `<h1 id="dash-greeting">Olá, Rodrigo.` (header — única h1).
  - `<h2 id="stats-title" class="sr-only">Resumo da sua conta`.
  - `<h2 id="my-lotteries-title">Loterias que você administra` (condicional).
  - `<h2 id="footer-title" class="sr-only">Rodapé Fortuno`.
- **Contraste** (validar no Lighthouse — meta ≥ 95):
  - Texto preto sobre paper: ≥ 17:1 AAA.
  - Stat-label (black/58) sobre branco: ~8:1 AA+.
  - Numeral 44px gradient (gold-soft → green-elegant): forma da letra grande + bold + anchor verde no fim garantem legibilidade trivial. Para usuários com baixa visão, o `aria-labelledby` no `<a>` faz a leitura via screen reader.
  - Stat-cta (`gold-intense` 12px) sobre branco: 3.6:1 — abaixo de AA para texto normal, mas o CTA é acompanhado de seta (cor não é único indicador), e o conjunto inteiro do card é o link (anúncio assistivo é via `aria-labelledby` cobre label+value, não o cta-text). Documentar no QA: se o time exigir AA estrito para o cta visual, mudar para `text-fortuno-green-elegant` (9.8:1).
  - Header dark: `offwhite` 13.1:1, `gold-soft` 6.8:1, `gold-intense` (chip-value-unit "pts") 4.7:1 AA.
- **Cor não é único indicador**: status de loteria sempre tem ícone + texto; chip-value tem aria-label explícito; numeral monumental tem gradient + tabular-nums.
- **Toast de cópia (sonner)**: `role="status"` por padrão, anuncia "Copiado".
- **Touch targets**: chip wrapper 56px altura, chip-action `min-w-[44px] h-8`, chip-copy 32×32 (mas dentro de chip 56px com padding ~10px ao redor → área tappável real ~44×44). Aceitar tradeoff visual ou aumentar para 40px se QA pedir.
- **`aria-live`**: somente onde necessário (toast sonner; chip-value referral em `polite` para regeneração futura).

---

## 7. Animações — mapa completo

| Animação                  | Elemento                          | Duração         | Trigger                                  |
|---------------------------|-----------------------------------|-----------------|------------------------------------------|
| `animate-avatar-breath`   | Ring ouro do avatar               | 6s infinite     | Automático (sutil)                       |
| `animate-check-bounce`    | Ícone Check do botão copy         | 360ms           | Disparado ao copiar                      |
| `live-pulse` (reuso)      | Dot do "Aberto" nas lottery rows  | 1.8s infinite   | Status `OPEN`                            |
| `hover:-translate-y-0.5`  | LinkedStatCard                    | 240ms ease-spring | Hover/focus                            |
| `hover:translate-y-[-1px]`| Lottery row + link Extrato        | 160ms           | Hover/focus                              |
| `hover:rotate-[8deg] hover:scale-110` | Botão copy do referral | 160ms           | Hover                                    |
| `group-hover:translate-x-[3px]` | Seta do stat-cta             | 240ms ease-spring | Hover do card pai                      |
| `animate-user-menu-open`  | UserMenu dropdown                 | 180ms ease-out    | Abertura do dropdown (fade + scale-from-top-right) |
| `rotate-180` no chevron   | Chevron do UserTrigger            | 240ms ease-out    | `aria-expanded=true`                    |
| `translate-x-[3px]` no chevron-right | Itens do UserMenu no hover | 160ms ease-spring | Hover/focus                             |
| `translate-x-[2px]` no item-icon | Itens do UserMenu no hover  | 160ms ease-spring | Hover/focus                             |

Removidas vs v1: `vault-shimmer` (não há mais cofre).

Todas caem para instantâneo sob `prefers-reduced-motion: reduce`.

---

## 8. Consumo de dados — contratos

### 8.1 Hooks consumidos

| Hook               | Campos usados                                           |
|--------------------|---------------------------------------------------------|
| `useUser()`        | `user.name` (saudação + iniciais do avatar)            |
| `useReferral()`    | `referralCode` (chip), `panel.totalPoints` (NOVO — chip de pontos), `panel.totalPurchases` (stat de indicações), `loadPanel()` |
| `useTicket()`      | `tickets` (array — `tickets.length` e `lotteryCount`), `loadMine()` |
| `useLottery()`     | `myLotteries` (array — `MyLotteriesPreview`)            |

### 8.2 Mocks que precisam virar dados reais

| Mock                                          | Localização                                | Quando remover                                          |
|-----------------------------------------------|--------------------------------------------|---------------------------------------------------------|
| `panel.totalPoints` (NOVO contrato)           | `useReferral` / `usePoints` futuro         | Backend expor `totalPoints: number` em `GET /referral/panel` (ou criar `GET /points/balance` e dedicar um `usePoints`) |
| `soldTickets` no `LotteryRow`                 | `LotteryRow` (mesmo cálculo da home)       | Backend expor `/lottery/{id}/ticketStats` (já em `MOCKS.md`) |
| `lottery.status` (enum `OPEN/CLOSED/SCHEDULED`) | `LotteryStatusInline`                     | Confirmar enum no `LotteryInfo` ou derivar de `scheduledStartAt`/`scheduledEndAt` |
| Lista "Loterias que administra"               | `useLottery().myLotteries`                 | **Já registrado em `MOCKS.md`** — depende de `GET /lotteries/my-owned` |

**Atualizar `MOCKS.md`** (entrada nova substitui `nextCreditInDays`, que era da v1 e foi descartado junto com o `PointsVault`):

```
### Dashboard — `panel.totalPoints` (chip de pontos no header)

- **Arquivo**: `src/components/dashboard/_primitives/HeaderChip.tsx` (variant="points")
- **Rota esperada**: `GET /referral/panel` deve incluir `totalPoints: number` (saldo INTEIRO de pontos do usuário, NÃO em BRL).
- **Descrição**: o chip "Total de pontos" no header escuro do dashboard exibe esse número formatado em pt-BR (ex.: 1.247 pts) e leva o usuário para `/meus-pontos`. Enquanto o backend não expor o campo, o componente recebe `totalPoints={0}` como fallback — o chip continua aparecendo (saldo zero), o que é semanticamente correto.
- **Alternativa**: criar endpoint dedicado `GET /points/balance` retornando `{ totalPoints: number, currency: 'pts' }`, e expor via novo hook `usePoints()`. Decisão fica com o time de backend; o frontend consome o que vier.
- **Item de acompanhamento**: pendente de abertura.
```

> **A entrada de `nextCreditInDays` (v1) deve ser REMOVIDA do `MOCKS.md`** caso tenha sido adicionada — não é mais usada.

### 8.3 Estados de loading

| Componente                | Estado de loading                                                         |
|---------------------------|---------------------------------------------------------------------------|
| `DashboardHeader`         | Saudação renderiza "visitante" se `user?.name` ainda undefined; `HeaderChip variant="referral"` simplesmente não renderiza se `referralCode` undefined; `HeaderChip variant="points"` sempre aparece (saldo 0 como fallback). |
| `LinkedStatGrid`          | Cada card com numeral skeleton `h-11 w-20 rounded-md bg-fortuno-gold-soft/15 animate-pulse` enquanto values undefined; CTA continua visível. |
| `MyLotteriesPreview`      | Lista renderiza 3 skeletons `<li className="lottery-row animate-pulse">` (placeholder ~52px). Quando `loadMyLotteries()` completa e o array está vazio, o componente **não renderiza** (a página simplesmente não mostra a seção). |

### 8.4 Estados de erro

- Falha de `loadPanel`: `totalPoints={0}`; toast.error gerenciado pelos services.
- Falha de `loadMine` (tickets): stats com fallback 0.
- Falha em copy do código: `toast.error(t('common.error'))`.

---

## 9. Roteamento — destinos dos CTAs (v2)

| Origem                                          | Destino                            |
|-------------------------------------------------|------------------------------------|
| `HeaderChip variant="points"` "Extrato"         | `/meus-pontos`                     |
| `LinkedStatCard` Bilhetes comprados             | `/meus-numeros`                    |
| `LinkedStatCard` Loterias participadas          | `/meus-sorteios` *(ver §4.5 nota — semântica pode precisar ajuste futuro)* |
| `LinkedStatCard` Indicações                     | `/meus-pontos`                     |
| `MyLotteriesPreview` "Ver todas"                | `/meus-sorteios`                   |
| `MyLotteriesPreview` "Novo sorteio"             | `/meus-sorteios/novo`              |
| `LotteryRow` "Gerenciar"                        | `/meus-sorteios/{lotteryId}/editar` |
| `MyLotteriesPreview` "Ver todas as suas loterias (N)" (link final) | `/meus-sorteios` |
| `DashboardFooterBand` "Suporte"                 | `/suporte`                         |
| `DashboardFooterBand` "Como funciona"           | `/#como`                           |
| `DashboardFooterBand` "contato@fortuno.com.br"  | `mailto:contato@fortuno.com.br`    |
| **Topbar** wordmark Fortuno                      | `/`                                |
| **Topbar** "Sorteios"                            | `/sorteios`                        |
| **Topbar** "Meus Números"                        | `/meus-numeros`                    |
| **Topbar** "Quem Somos"                          | `/quem-somos`                      |
| **Topbar** "Fale Conosco"                        | `/fale-conosco`                    |
| **UserMenu** "Alterar dados"                     | `/conta/dados`                     |
| **UserMenu** "Trocar senha"                      | `/conta/alterar-senha`             |
| **UserMenu** "Sair"                              | Executa `logout()` + `navigate('/')` (ação, não rota) |

> **Rotas potencialmente inexistentes**: `/suporte`. Se ainda não existir, validar com produto. Fallback razoável: `mailto:suporte@fortuno.com.br` (já temos contato no footer).
>
> **Eliminadas vs v1**: `/indicacoes` (não há mais quick pill nem stat dedicado para essa rota — o card "Indicações" agora aponta para `/meus-pontos` por solicitação do usuário, já que o extrato de pontos consolida indicações).

---

## 10. Atalhos de teclado

| Contexto                  | Atalho            | Ação                              |
|---------------------------|-------------------|-----------------------------------|
| Em qualquer elemento      | `Tab` / `Shift+Tab` | Navega entre interativos        |
| No botão copy do chip     | `Enter` / `Space` | Copia o código                    |
| Em qualquer CTA / Link    | `Enter`           | Ativa (nativo)                    |

Sem custom shortcuts.

---

## 11. Checklist de validação pré-merge

- [ ] Rota `/dashboard` renderiza header (escuro compacto) → trio de stats (claro) → loterias (condicional, claro) → footer band (escuro compacto) sem sobreposição.
- [ ] **Página inteira cabe em viewport 1080px no desktop** (Chrome DevTools 1440×1080) — com lotteries renderizadas. Sem lotteries, deve sobrar espaço.
- [ ] 375px mobile: sem overflow horizontal; chips empilham vertical; trio empilha; footer vira 2 linhas.
- [ ] `HeaderChip variant="points"` exibe valor em **inteiro** com formato pt-BR (ex.: 1.247 pts), NUNCA com prefixo R$.
- [ ] Botão copy do referral mostra check animado por ~2s + dispara toast "Copiado".
- [ ] Cada `LinkedStatCard` é **um único link clickable** (card inteiro), não tem CTA separado focável.
- [ ] Hover em qualquer LinkedStatCard levanta 2px com sombra ouro + a seta translada 3px à direita.
- [ ] `MyLotteriesPreview` exibe **no máximo 3** loterias + link "Ver todas as suas loterias (N)" se houver mais.
- [ ] `MyLotteriesPreview` **NÃO** renderiza nada quando `lotteries.length === 0` (a seção inteira some — sem empty state).
- [ ] Avatar exibe iniciais corretas (1 ou 2 chars) com fallback "F" se `user?.name` ausente.
- [ ] Lottery rows mostram status correto (Aberto/Agendado/Encerrado) com ícone + texto.
- [ ] Footer band: 1 linha em desktop ≥768px (~72px de altura); 2 linhas em mobile.
- [ ] `prefers-reduced-motion: reduce`: avatar para de pulsar, hover translates instantâneos, layout intacto.
- [ ] Focus visível (ring ouro 3px) em TODOS os elementos interativos: chip-copy, chip-action, linked-stat (3x), lottery-row CTA, lottery-row link "Ver todas (N)", footer-links (3x).
- [ ] Lighthouse a11y ≥ 95 em mobile e desktop.
- [ ] `tokens.css` recebe os novos tokens v2 + **remove** os tokens v1 órfãos (vault, pills, empty-lotteries, gold-numeral-light).
- [ ] `tailwind.config.js` recebe merge incremental + remove entradas órfãs.
- [ ] `MOCKS.md` atualizado: nova entrada `panel.totalPoints`, entrada antiga de `nextCreditInDays` removida (se existia).
- [ ] Componentes v1 órfãos (`PointsVault.tsx`, `QuickLinks.tsx`, `Divider.tsx` decorativo) removidos do codebase, se chegaram a ser implementados.
- [ ] **Topbar global (`Header.tsx`)** re-skinada: wordmark Fortuno à esquerda, nav pública com item ativo underline ouro, UserTrigger pílula à direita com avatar 34px + nome + chevron Lucide.
- [ ] **UserMenu** abre com clique no trigger; fecha com: clique fora, `Escape`, clique em item, clique no trigger (toggle).
- [ ] **UserMenu** foco vai ao primeiro item ao abrir; `Escape` fecha e devolve foco ao trigger.
- [ ] **UserMenu** setas ↑/↓ navegam entre os 3 itens (Alterar dados → Trocar senha → Sair → Alterar dados).
- [ ] **UserMenu** ícones Lucide corretos: `UserCog`, `KeyRound`, `LogOut` (sem confundir com `User`, `Lock`).
- [ ] **UserMenu** item "Sair" usa cor cobre (`#8a5a2b`) — NÃO vermelho — e tem ícone + texto (cor não é único indicador).
- [ ] **UserMenu** mini-card identitário mostra avatar 56px com ring ouro + nome completo + e-mail.
- [ ] **Topbar mobile (<768px)**: nav pública some, hambúrguer aparece, UserTrigger mostra só avatar + chevron (sem nome). Dropdown vira ~340px max.
- [ ] **UserMenu** animação `user-menu-open` (180ms fade + scale) cai para 1ms sob `prefers-reduced-motion: reduce`.
- [ ] **UserMenu** `aria-haspopup="menu"`, `aria-expanded` sincronizado, `aria-controls` apontando para o id do menu.
- [ ] Item "Dashboard" REMOVIDO do dropdown (se produto preferir manter, adicionar `LayoutDashboard` + NavLink `/dashboard`).
- [ ] Testes existentes passam (`npm test`).
- [ ] `npm run lint` limpo.
- [ ] `npm run build` produz bundle sem warnings novos.

---

## 12. Out of scope deste spec

- Endpoint `GET /lotteries/my-owned` (já mockado).
- Endpoint `/lottery/{id}/ticketStats` (compartilhado com a home, já em `MOCKS.md`).
- Endpoint para `panel.totalPoints` (registrado em `MOCKS.md`; backend decide entre estender `/referral/panel` ou criar `/points/balance`).
- Reroteamento da rota `/meus-sorteios` para distinguir "loterias que participo" vs "que administro" — **questão registrada em §4.5**, mas sai como feature separada se o time de produto decidir.
- Onboarding/empty state para usuários sem loterias administradas — **propositalmente removido**; se reintroduzir vira feature à parte.
- Internacionalização integral; strings novas continuam hardcoded em pt-BR.
- Notificações in-app, avatar com upload de imagem real, dark mode opt-in.

---

## 13. Referências

- Direção base: `design/wizard-vertical/{tokens.md, spec.md, mockup.html}` e `design/home/{tokens.md, spec.md, mockup.html}`.
- Mockup compacto deste dashboard: `design/dashboard/mockup.html` (preview standalone).
- Tokens v2: `design/dashboard/tokens.md`.
- Página atual a ser substituída: `src/pages/dashboard/DashboardPage.tsx`.
- Convenções do projeto: `CLAUDE.md` (casing, mocks, env vars, regra `X-Tenant-Id`).
- Mocks compartilhados: `MOCKS.md` na raiz.
