# Meus Pontos — Handoff para `frontend-react-developer`

Direção visual: **Editorial Casino Noir · Light Body**. Continuidade direta de `design/dashboard/`, `design/my-numbers/`, `design/lottery-detail/`. A página `/meus-pontos` (rota `MyPointsPage`) é o **extrato premium do programa de indicação** — o equivalente a um "extrato bancário de cassino" para os pontos do usuário.

Estrutura visível (de cima para baixo):

```
[ TOPBAR GLOBAL · src/components/layout/Header.tsx ]   ← REUSO
[ DASHBOARD HEADER (escuro · DashboardHeader)      ]   ← REUSO (chip points em estado is-current)
─── corpo claro `bg-dash-page` ───
[ MyPointsToolbar (eyebrow + título + filtros + CTA "Indicar") ]
[ PointsBalanceHero — wow moment, 3 zonas ouro ]
[ PointsBreakdownTable (desktop) + PointsBreakdownCards (mobile) ]
[ PointsDisclaimerCard (institucional, ornamental) ]
[ FOOTER BAND ]
```

Mockup standalone: `design/my-points/mockup.html`. Tokens novos: `design/my-points/tokens.md`.

A página atual (`src/pages/dashboard/MyPointsPage.tsx`, 88 linhas) é **substituída integralmente** pela composição abaixo (~120 linhas).

---

## 1. Arquivos-alvo

### Criar

- `src/components/points/MyPointsToolbar.tsx` *(eyebrow + título + counter + subhead + 3 filter-pills + CTA "Indicar amigos")*
- `src/components/points/PointsBalanceHero.tsx` *(o hero — 3 zonas: numeral GIGANTE, mini-stats 2×2, "Como funcionam")*
- `src/components/points/PointsBreakdownTable.tsx` *(tabela editorial premium · desktop ≥768px)*
- `src/components/points/PointsBreakdownCards.tsx` *(cards verticais · mobile <768px)*
- `src/components/points/PointsBreakdownDetailModal.tsx` *(detalhe por sorteio — opens via "Detalhes" da linha)*
- `src/components/points/ShareReferralModal.tsx` *(NOVO — CTA "Indicar amigos" + WhatsApp / Copiar link / Copiar código)*
- `src/components/points/PointsDisclaimerCard.tsx` *(card ornamental do `panel.note`)*
- `src/components/points/PointsEmptyState.tsx` *(quando `panel.byLottery.length === 0`)*
- `src/components/points/_primitives/HeroStatTile.tsx` *(tile interno do hero — numeral 36px + label + sub)*
- `src/components/points/_primitives/HowToBullet.tsx` *(item da lista "Como funcionam")*
- `src/styles/my-points.css` *(tokens + classes da página, importado em `src/styles/index.css`)*

### Reutilizar (sem mudança)

- `src/components/dashboard/DashboardHeader.tsx` — header escuro idêntico ao do `/dashboard` e `/meus-numeros`. Recebe `user`, `referralCode`, `totalPoints`.
- `src/components/dashboard/HeaderChip.tsx` — **MUDANÇA NECESSÁRIA mínima** descrita em §4.
- `src/components/common/Modal.tsx` — primitive de modal acessível (focus trap, ESC, click-outside, portal). Usado por ambos `PointsBreakdownDetailModal` e `ShareReferralModal`.
- `src/components/common/CopyableCode.tsx` — opcional (a lógica já está embutida no chip referral; se o `ShareReferralModal` quiser exibir o código copiável de forma destacada).
- `src/components/common/LoadingSpinner.tsx` — fallback de loading inicial (a página agora tem skeletons próprios; o spinner pode ficar como fallback de erro).
- `src/utils/lotteryIcon.ts` (`iconForLotteryName`) — heurística de ícone por nome.
- `src/utils/currency.ts` (`formatBRL`) — para o chip de equivalência "≈ R$ X" no hero.
- `src/utils/getInitials.ts` — repassado ao `DashboardHeader`.

### Atualizar

- `src/components/dashboard/HeaderChip.tsx` — adicionar prop opcional `currentPage?: boolean` à variante `points`. Quando `true`, renderiza um span (não `<Link>`) com `aria-current="page"`, classe `chip-action.is-current` e label "Aqui" + ícone `Check`. Sem isso, o usuário em `/meus-pontos` clicaria num link que recarrega a mesma rota — quebra de heurística HIG (não navegar para si mesmo).
- `src/pages/dashboard/MyPointsPage.tsx` — reescrita conforme §3.
- `src/styles/index.css` — adicionar `@import './my-points.css';`.
- `src/styles/tokens.css` — anexar tokens novos de `tokens.md §2`.
- `tailwind.config.js` — merge incremental do `theme.extend` (ver `tokens.md §3`).
- `MOCKS.md` — registrar 5 entradas novas (ver §8).
- `src/i18n/locales/pt/fortuno.json` (e demais locales) — adicionar chaves `myPoints.*` (ver §7).

### Não alterar

- `src/hooks/useReferral.ts` e `src/Services/referralService.ts`. A página continua consumindo `panel.referralCode | totalPurchases | totalToReceive | byLottery | note` exatamente como existem hoje. As "novas" estatísticas (Maior indicação única, Ranking, Equivalência BRL, Período) são derivações ou MOCKs explícitos.

---

## 2. Dependências

```bash
npm ls lucide-react react-router-dom nauth-react sonner react-i18next
```

- `lucide-react`: ícones usados — `Hash`, `Sparkles`, `Copy`, `Check`, `ArrowRight`, `ArrowUpRight`, `Share2`, `Trophy`, `Users`, `Gift`, `CalendarRange`, `ArrowDownUp`, `ChevronDown`, `ChevronRight`, `Coins`, `TrendingUp`, `Award`, `Car`, `Gem`, `Watch`, `Building2`, `MessageCircle`, `Link` (link icon), `Info`, `ShieldCheck`, `LifeBuoy`, `Mail`, `X`.
- `nauth-react`: `useUser` para `user.name`.
- `sonner`: toasts ("Código copiado", "Link copiado").
- `react-i18next`: `useTranslation` em todos os componentes — sem hard-code PT-BR.

Nenhuma dependência nova.

---

## 3. Composição da `MyPointsPage.tsx`

```tsx
// src/pages/dashboard/MyPointsPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { useUser } from 'nauth-react';
import { useReferral } from '@/hooks/useReferral';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MyPointsToolbar } from '@/components/points/MyPointsToolbar';
import { PointsBalanceHero } from '@/components/points/PointsBalanceHero';
import { PointsBreakdownTable } from '@/components/points/PointsBreakdownTable';
import { PointsBreakdownCards } from '@/components/points/PointsBreakdownCards';
import { PointsBreakdownDetailModal } from '@/components/points/PointsBreakdownDetailModal';
import { ShareReferralModal } from '@/components/points/ShareReferralModal';
import { PointsDisclaimerCard } from '@/components/points/PointsDisclaimerCard';
import { PointsEmptyState } from '@/components/points/PointsEmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import type { ReferrerLotteryBreakdown } from '@/types/referral';

export const MyPointsPage = (): JSX.Element => {
  const { user } = useUser();
  const { panel, loading, loadPanel } = useReferral();

  const [shareOpen, setShareOpen] = useState(false);
  const [detailRow, setDetailRow] = useState<ReferrerLotteryBreakdown | null>(null);

  // Filtros locais (período + sorteio + ordenação)
  const [lotteryFilter, setLotteryFilter] = useState<number | 'all'>('all');
  const [periodFilter, setPeriodFilter] = useState<'all' | '30' | '90' | 'year'>('all');
  const [sort, setSort] = useState<'points' | 'purchases' | 'recent'>('points');

  useEffect(() => {
    void loadPanel();
  }, [loadPanel]);

  // MOCK — pontos derivados de totalToReceive (idem dashboard).
  // Documentado em MOCKS.md → "Dashboard — panel.totalPoints".
  const totalPoints = useMemo(
    () => Math.max(0, Math.floor(panel?.totalToReceive ?? 0)),
    [panel?.totalToReceive],
  );

  const filteredRows = useMemo(() => {
    if (!panel) return [];
    let out = panel.byLottery;
    if (lotteryFilter !== 'all') out = out.filter((r) => r.lotteryId === lotteryFilter);
    // periodFilter: MOCK até endpoint expor data por linha. Sem efeito por enquanto.
    if (sort === 'points')    out = [...out].sort((a, b) => b.toReceive - a.toReceive);
    if (sort === 'purchases') out = [...out].sort((a, b) => b.purchases - a.purchases);
    // sort === 'recent' depende de ordem do backend; por hora == 'points'.
    return out;
  }, [panel, lotteryFilter, sort]);

  if (loading && !panel) {
    return (
      <main className="min-h-screen bg-dash-page text-fortuno-black flex flex-col">
        <DashboardHeader user={user} referralCode={undefined} totalPoints={0} />
        <div className="flex-1 grid place-items-center">
          <LoadingSpinner label="Carregando seu extrato..." />
        </div>
      </main>
    );
  }
  if (!panel) {
    return (
      <main className="min-h-screen bg-dash-page text-fortuno-black flex flex-col">
        <DashboardHeader user={user} referralCode={undefined} totalPoints={0} />
        <PointsEmptyState onShare={() => setShareOpen(true)} className="mx-auto max-w-7xl w-full px-6 py-10" />
        <ShareReferralModal open={shareOpen} onClose={() => setShareOpen(false)} referralCode="" />
      </main>
    );
  }

  const hasRows = filteredRows.length > 0;
  const noReferralsAtAll = panel.byLottery.length === 0;

  return (
    <main className="min-h-screen bg-dash-page text-fortuno-black flex flex-col">
      <DashboardHeader
        user={user}
        referralCode={panel.referralCode}
        totalPoints={totalPoints}
        // NOVO — sinaliza ao HeaderChip variante points que estamos na própria página
        pointsChipCurrentPage
      />

      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 py-8 md:py-10 flex-1
                      flex flex-col gap-8 md:gap-10">
        <MyPointsToolbar
          totalPurchases={panel.totalPurchases}
          totalPoints={totalPoints}
          lotteries={panel.byLottery}
          lotteryFilter={lotteryFilter}
          periodFilter={periodFilter}
          sort={sort}
          onChangeLottery={setLotteryFilter}
          onChangePeriod={setPeriodFilter}
          onChangeSort={setSort}
          onShare={() => setShareOpen(true)}
        />

        {noReferralsAtAll ? (
          <PointsEmptyState onShare={() => setShareOpen(true)} />
        ) : (
          <>
            <PointsBalanceHero
              totalPoints={totalPoints}
              totalPurchases={panel.totalPurchases}
              lotteriesReached={panel.byLottery.length}
              biggestPurchaseInOne={Math.max(...panel.byLottery.map((r) => r.purchases))}
              biggestLotteryName={
                panel.byLottery.reduce<ReferrerLotteryBreakdown | undefined>(
                  (acc, r) => (!acc || r.purchases > acc.purchases ? r : acc),
                  undefined,
                )?.lotteryName
              }
              estimatedBRL={panel.totalToReceive}
            />

            <section aria-labelledby="breakdown-title" className="flex flex-col">
              {/* heading editorial */}
              {/* ... (ver mockup §2.3) ... */}
              <div className="hidden md:block">
                <PointsBreakdownTable rows={filteredRows} onOpenDetail={setDetailRow} />
              </div>
              <div className="md:hidden">
                <PointsBreakdownCards rows={filteredRows} onOpenDetail={setDetailRow} />
              </div>
            </section>
          </>
        )}

        <PointsDisclaimerCard note={panel.note} />
      </div>

      <ShareReferralModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        referralCode={panel.referralCode}
      />
      <PointsBreakdownDetailModal
        row={detailRow}
        onClose={() => setDetailRow(null)}
      />
    </main>
  );
};
```

> Footer band global: provida pelo `AuthenticatedShell`. Não declarada aqui.

---

## 4. `HeaderChip` — atualização mínima (variante `points` em "página atual")

**Por quê**: o usuário já está em `/meus-pontos`. O CTA "Extrato → /meus-pontos" da v2 vira um auto-loop indesejado (heurística HIG: nunca navegar para si mesmo). Solução: novo prop opcional sinalizado pela página.

**Diff conceitual** (`src/components/dashboard/HeaderChip.tsx`):

```ts
type PointsVariantProps = {
  variant: 'points';
  points: number;
  /** Quando true, renderiza um span "Aqui" (com aria-current="page") em vez de <Link>. */
  currentPage?: boolean;
};
```

```tsx
{currentPage ? (
  <span
    className="chip-action is-current"
    aria-current="page"
    aria-label={t('myPoints.chipCurrent')}   // "Você está no extrato de pontos"
  >
    <Check className="w-3 h-3" />
    {t('myPoints.chipCurrentLabel')}          // "Aqui"
  </span>
) : (
  <Link to="/meus-pontos" /* ... */>{t('dashboard.headerChip.points.cta')}</Link>
)}
```

E `DashboardHeader` ganha prop opcional `pointsChipCurrentPage?: boolean` que passa adiante para o chip.

CSS (em `src/styles/my-points.css` — para não inflar tokens.css global):

```css
.chip-action.is-current {
  background: rgba(236,232,225,0.06);
  border-color: rgba(212,175,55,0.20);
  color: rgba(212,175,55,0.55);
  cursor: default;
  gap: 5px;
}
.chip-action.is-current:hover {
  background: rgba(236,232,225,0.06);
  color: rgba(212,175,55,0.55);
}
.chip-action.is-current i { color: rgba(212,175,55,0.55); }
```

**Decisão de design (registrada para o backlog)**: o chip continua **exibindo o número de pontos** porque ele é informação útil mesmo aqui ("você tem 1.247 pts" reforça o saldo já visível no hero). O que muda é só o CTA — vira um chip estático "você está aqui".

Alternativas consideradas e descartadas:

- **Esconder o chip**: quebra simetria visual com outras páginas autenticadas; o usuário perde referência.
- **Desabilitar como `<button disabled>`**: button disabled em chip glass de header escuro é difícil de comunicar como "página atual" (parece bug); preferimos um span explícito com `aria-current`.

---

## 5. Componentes — DOM + Tailwind exato

### 5.1 `MyPointsToolbar`

**Props**:

```ts
import type { ReferrerLotteryBreakdown } from '@/types/referral';

export interface MyPointsToolbarProps {
  totalPurchases: number;
  totalPoints: number;
  lotteries: ReferrerLotteryBreakdown[];
  lotteryFilter: number | 'all';
  periodFilter: 'all' | '30' | '90' | 'year';
  sort: 'points' | 'purchases' | 'recent';
  onChangeLottery: (id: number | 'all') => void;
  onChangePeriod: (p: 'all' | '30' | '90' | 'year') => void;
  onChangeSort: (s: 'points' | 'purchases' | 'recent') => void;
  onShare: () => void;
}
```

**DOM** (compactado — variante 1:1 do mockup `§2.1`):

```tsx
<section aria-labelledby="my-points-title">
  <div className="points-toolbar">
    <div className="flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row">
      <div className="min-w-0">
        <span className="eyebrow gold">{t('myPoints.eyebrow')}</span>
        <h2 id="my-points-title" className="toolbar-title mt-1">
          {t('myPoints.titleStart')} <span className="italic">{t('myPoints.titleEnd')}</span>
          <span className="toolbar-counter">
            {' · '}<strong>{totalPurchases}</strong> {t('myPoints.referralsLabel')}
            {' · '}<strong>{totalPoints.toLocaleString('pt-BR')}</strong> pts
          </span>
        </h2>
        <p className="toolbar-subhead">
          {t('myPoints.subhead')} <em>{t('myPoints.subheadEm')}</em>
        </p>
      </div>
      <button
        type="button"
        onClick={onShare}
        className="cta-primary self-start lg:self-auto"
        aria-label={t('myPoints.shareCta')}
      >
        <Share2 className="w-[15px] h-[15px]" /> {t('myPoints.shareCta')}
      </button>
    </div>

    <div className="filter-pills filter-pills-scroll mt-5">
      {/* SORTEIO */}
      <label className={cn('filter-pill', lotteryFilter !== 'all' && 'is-active')} htmlFor="filter-lottery">
        <Trophy className="pill-icon" />
        <span className="flex flex-col leading-tight">
          <span className="pill-label">{t('myPoints.filters.lottery')}</span>
          <select id="filter-lottery" className="pill-native-select"
                  value={String(lotteryFilter)}
                  onChange={(e) => onChangeLottery(e.target.value === 'all' ? 'all' : Number(e.target.value))}>
            <option value="all">{t('myPoints.filters.allLotteries')}</option>
            {lotteries.map((l) => (
              <option key={l.lotteryId} value={l.lotteryId}>{l.lotteryName}</option>
            ))}
          </select>
        </span>
        <ChevronDown className="pill-chevron" />
      </label>

      {/* PERÍODO — MOCK até o backend expor data por compra */}
      <label className="filter-pill" htmlFor="filter-period">
        <CalendarRange className="pill-icon" />
        <span className="flex flex-col leading-tight">
          <span className="pill-label">
            {t('myPoints.filters.period')}
            <span className="toolbar-mock-tag" title={t('myPoints.mockTooltip')}>Mock</span>
          </span>
          <select id="filter-period" className="pill-native-select"
                  value={periodFilter}
                  onChange={(e) => onChangePeriod(e.target.value as any)}>
            <option value="all">{t('myPoints.filters.periodAll')}</option>
            <option value="30">{t('myPoints.filters.period30')}</option>
            <option value="90">{t('myPoints.filters.period90')}</option>
            <option value="year">{t('myPoints.filters.periodYear')}</option>
          </select>
        </span>
        <ChevronDown className="pill-chevron" />
      </label>

      {/* ORDENAR */}
      <label className="filter-pill" htmlFor="filter-sort">
        <ArrowDownUp className="pill-icon" />
        <span className="flex flex-col leading-tight">
          <span className="pill-label">{t('myPoints.filters.sort')}</span>
          <select id="filter-sort" className="pill-native-select"
                  value={sort}
                  onChange={(e) => onChangeSort(e.target.value as any)}>
            <option value="points">{t('myPoints.filters.sortPoints')}</option>
            <option value="purchases">{t('myPoints.filters.sortPurchases')}</option>
            <option value="recent">{t('myPoints.filters.sortRecent')}</option>
          </select>
        </span>
        <ChevronDown className="pill-chevron" />
      </label>
    </div>
  </div>
</section>
```

### 5.2 `PointsBalanceHero` (wow moment)

**Props**:

```ts
export interface PointsBalanceHeroProps {
  totalPoints: number;
  totalPurchases: number;
  lotteriesReached: number;
  /** MOCK derivado: max(byLottery[].purchases). */
  biggestPurchaseInOne?: number;
  biggestLotteryName?: string;
  /** BRL bruto (panel.totalToReceive) usado APENAS para a equivalência estimada. */
  estimatedBRL: number;
}
```

**Cálculo da equivalência BRL** (placeholder):

```ts
// MOCK: por enquanto a equivalência é o próprio totalToReceive (semântica da v1).
// Quando a fórmula real existir (ex.: 1 pt = R$ 0,10), substituir.
const estimated = formatBRL(estimatedBRL);
```

**DOM** — exatamente o `§2.2` do mockup. Estrutura essencial:

```tsx
<section aria-labelledby="balance-hero-title">
  <h2 id="balance-hero-title" className="sr-only">{t('myPoints.balanceHeroSr')}</h2>
  <div className="balance-hero">
    <div className="balance-hero-inner">
      <span className="hero-corner is-tl" /> {/* + tr / bl / br */}

      {/* ZONA ESQUERDA */}
      <div className="hero-zone-balance">
        <span className="balance-eyebrow">{t('myPoints.hero.eyebrow')}</span>
        <div className="hero-points-numeral"
             aria-label={t('myPoints.hero.numeralAria', { count: totalPoints })}>
          {totalPoints.toLocaleString('pt-BR')}
        </div>
        <span className="hero-points-sublabel">
          <strong>{t('myPoints.hero.sublabelStrong')}</strong> {t('myPoints.hero.sublabelRest')}
        </span>
        {estimatedBRL > 0 && (
          <span className="hero-equivalent-chip">
            <Coins className="w-[13px] h-[13px]" />
            ≈ <strong>{formatBRL(estimatedBRL)}</strong> {t('myPoints.hero.equivalentSuffix')}<sup>*</sup>
          </span>
        )}
      </div>

      {/* ZONA CENTRAL — 2×2 mini-stats */}
      <div className="hero-zone-stats" role="group" aria-label={t('myPoints.hero.statsAria')}>
        <HeroStatTile label={t('myPoints.hero.statTotalRefs')}
                      value={totalPurchases}
                      footIcon={<Users />} footText={t('myPoints.hero.statTotalRefsFoot')} />
        <HeroStatTile label={t('myPoints.hero.statLotteries')}
                      value={lotteriesReached}
                      footIcon={<Trophy />} footText={t('myPoints.hero.statLotteriesFoot')} />
        <HeroStatTile label={t('myPoints.hero.statBiggest')}
                      value={biggestPurchaseInOne ?? 0}
                      footIcon={<TrendingUp />}
                      footText={biggestLotteryName ? t('myPoints.hero.statBiggestFootIn', { name: biggestLotteryName }) : '—'}
                      mock />
        <HeroStatTile label={t('myPoints.hero.statRanking')}
                      value="Top 10%"
                      footIcon={<Award />} footText={t('myPoints.hero.statRankingFoot')}
                      mock />
      </div>

      {/* ZONA DIREITA — Como funcionam */}
      <div className="hero-zone-howto">
        <div className="hero-howto-title">
          <span className="eyebrow-mini">{t('myPoints.howTo.eyebrow')}</span>
        </div>
        <div className="hero-howto-title" style={{ fontSize: '17px' }}>
          {t('myPoints.howTo.titleStart')} <span style={{ color: 'var(--fortuno-gold-intense)' }}>{t('myPoints.howTo.titleEnd')}</span>
        </div>
        <ul className="hero-howto-list">
          <HowToBullet icon={<Users />}    html={t('myPoints.howTo.b1')} />
          <HowToBullet icon={<Gift />}     html={t('myPoints.howTo.b2')} />
          <HowToBullet icon={<Sparkles />} html={t('myPoints.howTo.b3')} />
        </ul>
        <a href="#disclaimer" className="hero-howto-cta">
          {t('myPoints.howTo.cta')} <ArrowRight className="w-[11px] h-[11px]" />
        </a>
      </div>
    </div>
  </div>
</section>
```

### 5.3 `HeroStatTile` (primitive)

```ts
export interface HeroStatTileProps {
  label: string;
  value: number | string;
  footIcon: ReactNode;
  footText: string;
  mock?: boolean;
}
```

DOM idêntico ao `.hero-stat` do mockup. `mock` adiciona o pill `Mock` no canto superior direito do tile.

### 5.4 `PointsBreakdownTable` (desktop)

**Props**:

```ts
export interface PointsBreakdownTableProps {
  rows: ReferrerLotteryBreakdown[];
  onOpenDetail: (row: ReferrerLotteryBreakdown) => void;
  /** Para o `tfoot` total — opcional, a tabela soma por padrão. */
  totalPointsOverride?: number;
}
```

**Heurísticas**:

- Ícone da linha: `iconForLotteryName(row.lotteryName)` (Lucide). Fallback: `Trophy`.
- `pts` da linha: `Math.max(0, Math.floor(row.toReceive))` — mesma fórmula do total.
- `name-sub` ("Sorteio em DD/MM/AAAA"): **MOCK** — `byLottery` não devolve `drawDate`. Renderizar `' '` (nbsp) ou esconder até endpoint expor. Marcado como MOCK em §8.
- `aria-label` por linha:
  ```
  {row.lotteryName}, {row.purchases} indicações, {points} pontos
  ```
- `tfoot`: soma de `Math.floor(row.toReceive)` se `totalPointsOverride` não for passado.

**DOM**: exatamente como em mockup `§2.3 desktop`.

### 5.5 `PointsBreakdownCards` (mobile)

Mesmas props. DOM idêntico ao mockup `§2.3 mobile`. Cada card é um `<article>` clicável (Tab/Enter), mas o botão "Ver detalhes" é o único interativo focável dentro dele.

### 5.6 `PointsBreakdownDetailModal`

```ts
export interface PointsBreakdownDetailModalProps {
  row: ReferrerLotteryBreakdown | null;
  onClose: () => void;
}
```

Estrutura interna usando `<Modal ariaLabelledBy="breakdown-detail-title" onClose={...}>`:

1. Header: ícone do sorteio (`iconForLotteryName(row.lotteryName)`) + eyebrow "Detalhamento" + título Playfair italic com `row.lotteryName`.
2. Sumário: 3 mini-pills horizontais (Indicações, Pontos, Sorteio em).
3. **Lista de indicações individuais** — **MOCK** (endpoint inexistente). Renderizar 3-5 linhas com placeholder pattern:
   - Avatar circular ouro com inicial
   - "Indicação confirmada" + "Comprador anonimizado #ABC"
   - Data, valor pago, pontos gerados
   - Skeleton states quando não houver dados
4. CTA secundário: "Ver sorteio" → `<Link to={`/sorteios/${row.lotteryId}`} />`.
5. Disclaimer compacto ("Lista detalhada disponível em breve.").

A Lista detalhada vive marcada como MOCK em §8 — produzir o componente com a estrutura visual pronta, alimentado por dado fake até o backend existir.

### 5.7 `ShareReferralModal`

```ts
export interface ShareReferralModalProps {
  open: boolean;
  onClose: () => void;
  referralCode: string;
}
```

Quando `!open`, retorna `null` — `Modal` não monta. Quando `open`:

```tsx
<Modal onClose={onClose} ariaLabelledBy="share-modal-title">
  <header className="modal-header">
    <span className="modal-icon-frame"><Share2 /></span>
    <div className="modal-titleblock">
      <span className="modal-eyebrow">{t('myPoints.share.eyebrow')}</span>
      <h3 id="share-modal-title" className="modal-title">{t('myPoints.share.title')}</h3>
    </div>
    <button type="button" onClick={onClose} className="modal-close" aria-label={t('common.close')}>
      <X />
    </button>
  </header>
  <div className="modal-body">
    <p className="text-[13px] text-fortuno-black/65 leading-[1.55]">
      {t('myPoints.share.description')}
    </p>

    <div className="share-message-block mt-4">
      <span className="msg-eyebrow">{t('myPoints.share.messageEyebrow')}</span>
      <textarea
        aria-label={t('myPoints.share.messageAria')}
        defaultValue={defaultMessage(referralCode)}
        ref={textareaRef}
      />
    </div>

    <div className="share-channels">
      <a href={whatsappHref(textareaRef.current?.value ?? defaultMessage(referralCode))}
         className="share-channel is-whatsapp"
         aria-label={t('myPoints.share.whatsapp')}>
        <MessageCircle /> {t('myPoints.share.whatsapp')}
      </a>
      <button type="button" onClick={() => copyLink(referralCode)} className="share-channel"
              aria-label={t('myPoints.share.copyLink')}>
        <Link className="w-[15px] h-[15px]" /> {t('myPoints.share.copyLink')}
      </button>
      <button type="button" onClick={() => copyCode(referralCode)} className="share-channel"
              aria-label={t('myPoints.share.copyCode')}>
        <Copy /> {t('myPoints.share.copyCode')}
      </button>
    </div>

    <div className="modal-divider" />
    <p className="text-[11px] text-fortuno-black/55 leading-[1.5] flex items-start gap-2">
      <ShieldCheck className="w-[13px] h-[13px] mt-[1px] shrink-0 text-fortuno-gold-intense" />
      {t('myPoints.share.disclaimer')}
    </p>
  </div>
</Modal>
```

Helpers (em `src/utils/share.ts`):

```ts
const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://fortuno.com.br';

export const defaultMessage = (code: string): string =>
  `Olá! Estou participando do Fortuno e te convido a entrar também. Use meu código ${code} ou acesse: ${SITE_URL}/?ref=${code}`;

export const whatsappHref = (text: string): string =>
  `https://wa.me/?text=${encodeURIComponent(text)}`;

export const copyLink = async (code: string): Promise<void> => {
  await navigator.clipboard.writeText(`${SITE_URL}/?ref=${code}`);
  toast.success(t('myPoints.share.copiedLink'));
};
export const copyCode = async (code: string): Promise<void> => {
  await navigator.clipboard.writeText(code);
  toast.success(t('myPoints.share.copiedCode'));
};
```

Adicionar `VITE_SITE_URL` ao `.env.example` e ao README/quickstart.

### 5.8 `PointsDisclaimerCard`

```ts
export interface PointsDisclaimerCardProps {
  note: string;       // panel.note (institucional)
  className?: string;
}
```

DOM: `.disclaimer-ornament` do mockup `§2.4`. Usa `note` no `<p className="disclaimer-text">{note}</p>`.

### 5.9 `PointsEmptyState`

```ts
export interface PointsEmptyStateProps {
  onShare: () => void;
  className?: string;
}
```

DOM exato do mockup `§2.6`.

### 5.10 `HowToBullet` (primitive)

```ts
export interface HowToBulletProps {
  icon: ReactNode;
  html: string; // i18n string com <strong> permitido
}
```

Renderiza `dangerouslySetInnerHTML={{ __html: html }}` para permitir `<strong>` vindo do i18n. **Sanitizar** caso a infra de i18n não garanta — no nosso caso, `react-i18next` faz escape por padrão; usar interpolação com `<Trans>` se preferir.

---

## 6. Densidade da página em desktop (estimativa)

| Bloco                                  | Altura aprox.   |
|----------------------------------------|-----------------|
| Topbar global                          | 64 px           |
| DashboardHeader                        | 144 px          |
| Toolbar                                | 168 px          |
| Hero saldo (3 zonas)                   | 224 px          |
| Heading "Detalhamento"                 | 64 px           |
| Tabela (5 linhas + thead + tfoot)      | 360 px          |
| Disclaimer ornamental                  | 88 px           |
| Footer band                            | 72 px           |
| Gaps verticais (3 × 32px)              | 96 px           |
| Padding do main (py-10)                | 80 px           |
| **Total estimado**                     | **≈ 1360 px**   |

A página NÃO é projetada para caber em 1080px (foi pedida com densidade editorial relaxada). Na faixa de 1440px de viewport útil, o usuário vê hero + início da tabela; rolagem revela o resto. O hero é o anchor.

---

## 7. i18n — chaves novas (`pt/fortuno.json`)

```json
{
  "myPoints": {
    "eyebrow": "Extrato",
    "titleStart": "Meus",
    "titleEnd": "Pontos",
    "referralsLabel": "indicações",
    "subhead": "Acompanhe suas indicações e o saldo acumulado por sorteio. Cada compra confirmada",
    "subheadEm": "vira pontos que se acumulam sem expirar.",
    "shareCta": "Indicar amigos",
    "chipCurrent": "Você está no extrato de pontos",
    "chipCurrentLabel": "Aqui",
    "balanceHeroSr": "Saldo atual de pontos",
    "filters": {
      "lottery": "Sorteio",
      "allLotteries": "Todos os sorteios",
      "period": "Período",
      "periodAll": "Todo o histórico",
      "period30": "Últimos 30 dias",
      "period90": "Últimos 90 dias",
      "periodYear": "Este ano",
      "sort": "Ordenar",
      "sortPoints": "Mais pontos",
      "sortPurchases": "Mais indicações",
      "sortRecent": "Mais recente"
    },
    "mockTooltip": "Endpoint pendente — o filtro está visível para validação de design.",
    "hero": {
      "eyebrow": "Saldo atual",
      "numeralAria": "{{count}} pontos acumulados",
      "sublabelStrong": "pontos",
      "sublabelRest": "acumulados",
      "equivalentSuffix": "em valor estimado",
      "statsAria": "Resumo das indicações",
      "statTotalRefs": "Total de indicações",
      "statTotalRefsFoot": "amigos compraram",
      "statLotteries": "Sorteios alcançados",
      "statLotteriesFoot": "com indicações ativas",
      "statBiggest": "Maior indicação única",
      "statBiggestFootIn": "em {{name}}",
      "statRanking": "Ranking estimado",
      "statRankingFoot": "entre indicantes"
    },
    "howTo": {
      "eyebrow": "Como funcionam",
      "titleStart": "os",
      "titleEnd": "pontos",
      "b1": "Cada indicação que <strong>efetua compra</strong> gera pontos automaticamente.",
      "b2": "Pontos podem virar <strong>prêmios e descontos</strong> em sorteios futuros.",
      "b3": "Saldo <strong>acumula sem expirar</strong> e cresce a cada novo sorteio.",
      "cta": "Saiba mais"
    },
    "breakdown": {
      "title": "Pontos por sorteio",
      "subtitle": "Veja onde suas indicações geraram resultado. Clique em qualquer linha para ver as compras que somaram pontos.",
      "thSorteio": "Sorteio",
      "thIndicacoes": "Indicações",
      "thPontos": "Pontos",
      "tfTotal": "Total acumulado",
      "rowAria": "{{name}}, {{purchases}} indicações, {{points}} pontos",
      "detail": "Detalhes",
      "detailAria": "Ver detalhes das indicações em {{name}}"
    },
    "share": {
      "eyebrow": "Programa de indicação",
      "title": "Indique e acumule pontos",
      "description": "Compartilhe seu código com amigos. A cada compra confirmada, você ganha pontos automaticamente.",
      "messageEyebrow": "Mensagem (editável)",
      "messageAria": "Mensagem de convite editável",
      "whatsapp": "Compartilhar no WhatsApp",
      "copyLink": "Copiar link",
      "copyCode": "Copiar código",
      "copiedLink": "Link copiado!",
      "copiedCode": "Código copiado!",
      "disclaimer": "Seu código é único e rastreado por compra. Pontos são creditados após confirmação de pagamento."
    },
    "empty": {
      "title": "Comece a indicar e veja seus pontos crescerem",
      "description": "Compartilhe seu código de indicação com amigos. A cada compra confirmada, você acumula pontos automaticamente — sem expiração, sem complicação.",
      "cta": "Compartilhar código"
    },
    "disclaimer": {
      "eyebrow": "Importante saber"
    }
  }
}
```

---

## 8. MOCKs novos a registrar em `MOCKS.md`

```md
### Meus Pontos — Equivalência em BRL no hero

- **Arquivo**: `src/components/points/PointsBalanceHero.tsx`
- **Rota esperada**: `GET /referral/points/conversion-rate` (taxa atual de conversão pts → BRL)
- **Descrição**: o chip "≈ R$ X,XX em valor estimado" do hero é renderizado a partir de `panel.totalToReceive` (semântica do v1, BRL bruto). Quando a fórmula real existir, derivar de `totalPoints * rate`.
- **Item de acompanhamento**: pendente.

### Meus Pontos — Maior indicação única (mini-stat)

- **Arquivo**: `src/components/points/PointsBalanceHero.tsx`
- **Rota esperada**: derivado client-side de `panel.byLottery` (max por `purchases`). Sem endpoint dedicado.
- **Descrição**: o tile "Maior indicação única" mostra o `purchases` máximo entre as linhas e qual sorteio. Marcado como `mock` no UI até o backend explicitar a métrica como campo dedicado, evitando ambiguidade ("compras de um amigo? indicações em um sorteio?").
- **Item de acompanhamento**: pendente.

### Meus Pontos — Ranking estimado (mini-stat)

- **Arquivo**: `src/components/points/PointsBalanceHero.tsx`
- **Rota esperada**: `GET /referral/ranking/me` (`{ percentile: number }`)
- **Descrição**: tile "Ranking estimado" exibe "Top 10%" como placeholder estático; deve consumir o percentile real quando o backend expor. Marcado como `mock` no UI.
- **Item de acompanhamento**: pendente.

### Meus Pontos — Detalhes por indicação (modal)

- **Arquivo**: `src/components/points/PointsBreakdownDetailModal.tsx`
- **Rota esperada**: `GET /referral/breakdown/{lotteryId}/details` (`Array<{ purchaserAlias, paidValue, points, paidAt }>`)
- **Descrição**: o modal "Detalhes" por sorteio renderiza dados fake (3-5 linhas placeholder) até o endpoint existir. A estrutura visual está pronta. Marcar todo item da lista com classe `is-mock` até dado real chegar.
- **Item de acompanhamento**: pendente.

### Meus Pontos — Filtro de período

- **Arquivo**: `src/components/points/MyPointsToolbar.tsx`
- **Rota esperada**: `GET /referral/panel?since=ISO&until=ISO` ou data por compra em `byLottery[]`
- **Descrição**: a pílula "Período" está visível e exibe um pill "Mock" próximo ao label até o backend suportar filtro temporal. Por enquanto não filtra nada (o `useMemo` ignora `periodFilter`).
- **Item de acompanhamento**: pendente.
```

---

## 9. Acessibilidade

- **Contraste**: numeral do hero (gradient ouro→verde) sobre papel `#fdfaf0` testado ≥ 4.5:1 nos tons sólidos visíveis (final do gradient = `#134436` sobre `#f3ecd6`). Todos os labels e foots da página em `rgba(11,11,11,0.55–0.72)` sobre branco ≥ 4.5:1.
- **`aria-label` no numeral gigante**: `"1.247 pontos acumulados"` — o screen reader não pronuncia bem o `.` do pt-BR; o aria normaliza.
- **`aria-label` por linha da tabela**: `"{lotteryName}, {purchases} indicações, {points} pontos"`.
- **Mini-stats**: agrupados em `<div role="group" aria-label="Resumo das indicações">`.
- **Filtros**: `<select>` nativos dentro do label da pílula → o screen reader anuncia label + valor selecionado.
- **Modal `Share`**: usa `Modal` primitive (focus trap, ESC, click-outside, role=dialog, aria-modal=true, aria-labelledby).
- **Modal `Detail`**: idem.
- **Botões "Detalhes"** da tabela: `aria-label` específico por linha (`"Ver detalhes das indicações em {nome}"`) — sem isso, o usuário ouviria "Detalhes" 5 vezes seguidas.
- **`aria-current="page"`** no chip points em estado is-current.
- **Touch target**: ≥ 44×44px em todos os controles (CTAs, filter-pills, share-channels, detail-btn, modal-close, copy buttons, footer-link).
- **Focus ring ouro** (`--shadow-gold-focus`) em **todos** os interativos.
- **Nunca apenas-cor**: status visual sempre acompanhado de label + ícone (mock pill, equivalência chip, footer-band link).
- **`prefers-reduced-motion`**: desativa `points-count-in`, `hero-rise`, `skel-shimmer`, hover-translates. Já coberto pelo bloco global do mockup.

---

## 10. Responsividade

| Breakpoint            | Hero           | Tabela / Cards         | Toolbar                  |
|-----------------------|----------------|------------------------|--------------------------|
| `< 560px`             | Coluna única, numeral 64px, mini-stats 2×2 30px, howto stack | Cards (md:hidden / hidden quando dt) | Pílulas em scroll horizontal, CTA full-width |
| `560–767px`           | Coluna única, numeral 80px | Cards | Pílulas wrap |
| `768–1023px`          | Coluna única, numeral 96px | **Tabela** | Pílulas wrap |
| `1024–1279px`         | 3 zonas inline (1.15 / 1 / 0.9), numeral 110px | Tabela | Inline 1 linha |
| `≥ 1280px`            | 3 zonas inline, numeral 120px | Tabela | Inline 1 linha |

A regra de troca tabela ↔ cards é em `md` (768px) — controlada pelas classes `hidden md:block` / `md:hidden` em `MyPointsPage.tsx`.

---

## 11. Animações

| Elemento                              | Animação                | Duração     | Condição                          |
|---------------------------------------|-------------------------|-------------|-----------------------------------|
| `.balance-hero`                       | `hero-rise`             | 520ms       | mount                             |
| `.hero-points-numeral`                | `points-count-in`       | 720ms       | mount                             |
| `.breakdown-table tbody tr`           | hover bg                | 160ms       | hover                             |
| `.breakdown-detail-btn`               | bg + border             | 160ms       | hover/focus                       |
| `.cta-primary`                        | translateY(-1px)        | 160ms       | hover                             |
| `.skel-block::before`                 | `skel-shimmer`          | 1.4s loop   | loading                           |
| Modal `share` / `detail`              | `modal-pop`             | 220ms       | open                              |
| Avatar ring                           | `avatar-breath`         | 6s loop     | sempre (já no DashboardHeader)    |

> Não há count-up "animado" do número (de 0 → 1.247). Optei por uma entrada com `letter-spacing` e `translateY` (`points-count-in`) — efeito visualmente "respira" sem custo de RAF e respeitando reduced-motion. Se o time quiser count-up real, adicionar lib leve em PR separado (não é responsabilidade desta entrega).

---

## 12. Checklist de implementação

- [ ] Anexar tokens novos de `tokens.md §2` em `src/styles/tokens.css`.
- [ ] Merge incremental do `theme.extend` em `tailwind.config.js` (ver `tokens.md §3`).
- [ ] Criar `src/styles/my-points.css` com classes específicas da página + override do `chip-action.is-current`. Importar em `src/styles/index.css`.
- [ ] Atualizar `src/components/dashboard/HeaderChip.tsx` para aceitar `currentPage?: boolean` na variante `points` (renderiza span em vez de Link).
- [ ] Atualizar `src/components/dashboard/DashboardHeader.tsx` para repassar nova prop `pointsChipCurrentPage?: boolean`.
- [ ] Criar componentes em `src/components/points/`:
  - [ ] `MyPointsToolbar.tsx`
  - [ ] `PointsBalanceHero.tsx`
  - [ ] `PointsBreakdownTable.tsx`
  - [ ] `PointsBreakdownCards.tsx`
  - [ ] `PointsBreakdownDetailModal.tsx`
  - [ ] `ShareReferralModal.tsx`
  - [ ] `PointsDisclaimerCard.tsx`
  - [ ] `PointsEmptyState.tsx`
  - [ ] `_primitives/HeroStatTile.tsx`
  - [ ] `_primitives/HowToBullet.tsx`
- [ ] Criar `src/utils/share.ts` (`defaultMessage`, `whatsappHref`, `copyLink`, `copyCode`).
- [ ] Adicionar `VITE_SITE_URL` em `.env.example` e documentar em `quickstart.md`.
- [ ] Reescrever `src/pages/dashboard/MyPointsPage.tsx` conforme §3 (≈120 linhas).
- [ ] i18n: adicionar todas as chaves `myPoints.*` (ver §7) em **todos** os locales — nunca hard-code PT-BR.
- [ ] `MOCKS.md`: adicionar 5 entradas novas (ver §8).
- [ ] Testes:
  - [ ] (a) renderiza com `panel.byLottery.length === 0` → mostra `PointsEmptyState`, esconde hero + tabela.
  - [ ] (b) render do hero com `totalPoints = 0` → numeral exibe `"0"`, sem chip de equivalência (condicional `estimatedBRL > 0`).
  - [ ] (c) ordenação por pontos / indicações altera a ordem das linhas.
  - [ ] (d) filtro por sorteio reduz a tabela a 1 linha quando aplicado.
  - [ ] (e) `pointsChipCurrentPage` faz o chip points renderizar `<span aria-current="page">` em vez de `<Link>`.
  - [ ] (f) `ShareReferralModal` abre/fecha via `open`, gera href WhatsApp correto com encodeURIComponent, dispara toast de copiado.
- [ ] QA visual: hero em 360px / 768px / 1024px / 1440px; modal de compartilhar em mobile; tabela com 1 / 5 / 12 linhas (scroll vertical natural).
- [ ] A11y smoke: Tab pelo header → toolbar → hero (links) → linhas (botões) → modais (focus trap).

---

## 13. Fora de escopo

- Endpoint dedicado para `points` (decisão fica com o backend; o frontend continua derivando do `totalToReceive` por enquanto).
- Conversão real pts → BRL (ver MOCK §8).
- Endpoint de ranking real (ver MOCK §8).
- Endpoint de detalhe por indicação (ver MOCK §8).
- Filtro de período por backend (ver MOCK §8).
- Animação de count-up real (CSS `@property` + RAF) — pode entrar em iteração futura.
- Botão "Exportar extrato" (PDF/CSV) — não pedido nesta v1; quando vier, ancorar ao tfoot da tabela.

---

## 14. O "wow moment" da página

O usuário entra em `/meus-pontos` e a primeira coisa que sequestra o olhar é **um numeral gigante em Playfair italic ouro→verde** anunciando "1.247" pontos, dentro de uma moldura ornamental dourada com 4 cantos art-déco e a watermark "FORTUNO · EXTRATO" translúcida ao fundo. À direita do numeral, mini-estatísticas ("17 indicações", "5 sorteios", "Top 10%") narram o desempenho como um boletim premium. Mais à direita ainda, a coluna "Como funcionam" educa em 3 bullets de 12px sem desviar a atenção. Abaixo, a tabela editorial com pontos por sorteio respira como um extrato bancário noir — Playfair italic nos pontos, Inter nos labels, hover dourado discreto. E quando o usuário clica em "Indicar amigos", um modal artesanal abre com mensagem editável + botão WhatsApp em verde sólido. **A página inteira é a sua sorte tornada saldo, e o saldo tornado peça de coleção.**
