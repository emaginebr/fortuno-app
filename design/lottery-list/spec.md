# Lottery List Page (`/sorteios`) — Component Spec

Handoff do **ui-ux-designer** para o **frontend-react-developer**.

Direção visual: **Editorial Casino Noir · light body** (mesma variante do `dashboard` e do `lottery-detail`). Esta spec redesenha **inteiramente** a rota `/sorteios` (`src/pages/public/LotteryListPage.tsx`), reusa o `LotteryCardPremium` da home e adiciona controles de **paginação client-side**, **empty state editorial** e **skeleton de loading**.

Ver também:
- `design/lottery-list/mockup.html` (preview standalone — abrir em navegador, rode `npx serve` se preferir servir local).
- `design/lottery-list/tokens.md` (tokens novos + extensão do tailwind).
- `design/home/spec.md §4.4` (definição original do `LotteryCardPremium`).

---

## 1. Escopo e estratégia de substituição

### 1.1 Arquivos-alvo

**Atualizar**
- `src/pages/public/LotteryListPage.tsx` — reescrever toda a página conforme §3. Remove o grid genérico atual e passa a consumir: `LotteryListHeader` + `LotteryCardPremium[]` + `Pagination` + estados de loading/empty.
- `src/styles/tokens.css` — anexar bloco de tokens novos de `design/lottery-list/tokens.md §2`.
- `tailwind.config.js` — merge do `theme.extend` de `design/lottery-list/tokens.md §3`.

**Criar**
- `src/components/lottery/LotteryCardPremium.tsx` **(ver §2.1 — decisão de arquitetura sobre onde o card deve viver)**.
- `src/components/lottery/LotteryListHeader.tsx` — header da página com ornamento + title + subhead + sort chip.
- `src/components/lottery/LotteryCardSkeleton.tsx` — card skeleton com shimmer (usado no loading grid).
- `src/components/lottery/LotteryEmptyState.tsx` — card dourado tracejado + ícone Sparkles + CTA "Voltar para Home".
- `src/components/common/Pagination.tsx` — **componente genérico e reutilizável** para outras listagens futuras (MyLotteries, MyNumbers, extratos, histórico de sorteios).

**Remover**
- Nada. O arquivo atual é apenas reescrito.

### 1.2 O que NÃO está no escopo

- Paginação server-side: **não implementar**. O backend `GET /lotteries/open` hoje retorna tudo. Paginamos client-side o array `openLotteries`. Quando o backend expor paginação, o componente `Pagination` já estará pronto — bastará substituir o slice client por parâmetros `?page=&size=` na chamada (ver §8.2).
- Filtros (por categoria de prêmio, range de ticket price etc.): fora do escopo desta passagem. Só ordenação client-side placeholder.
- Busca textual: fora do escopo.
- Mudar o `LotteryContext` / `useLottery` / `lotteryService`: não tocar.

---

## 2. Decisão arquitetural crítica — onde vive o `LotteryCardPremium`?

### 2.1 Recomendação: **extrair para `src/components/lottery/LotteryCardPremium.tsx`** (Opção B do briefing)

**Prós da extração**:
1. **Três consumidores hoje ou muito em breve**: `HomePage` (carousel), `LotteryListPage` (grid paginado) e potencialmente `MyLotteriesPage` / `MyNumbersPage` (autenticadas). Manter em `src/components/home/` cria acoplamento semântico falso — o card não é "da home", é uma vitrine de `LotteryInfo`.
2. **Evita drift**: se o card vive em 2 árvores (home e lottery-list), qualquer ajuste de badge/progress/chip precisa ser feito em dois lugares. Já vimos isso acontecer com `FraudWarning` vs `FraudCertificate`.
3. **Casing inviolável do projeto** (CLAUDE.md — Princípio III): `components/lottery/` é lowercase — segue a convenção já adotada em `components/checkout/`, `components/dashboard/`, `components/home/` etc.
4. **Baixo custo de refactor**: o arquivo atual é `src/components/home/LotteryCardPremium.tsx` (141 linhas). Move-se para `src/components/lottery/LotteryCardPremium.tsx` e atualizam-se **apenas dois imports** (`HomePage.tsx` via `LotteryCarouselPremium.tsx`).

**Contra**:
- Precisa atualizar o import em `src/components/home/LotteryCarouselPremium.tsx` (1 linha).

**Recomendação formalizada**:

1. Mover `src/components/home/LotteryCardPremium.tsx` → `src/components/lottery/LotteryCardPremium.tsx`. Manter a assinatura `LotteryCardPremiumProps` idêntica (já contratada em `design/home/spec.md §4.4`).
2. Atualizar o import em `LotteryCarouselPremium.tsx`:
   ```diff
   - import { LotteryCardPremium } from '@/components/home/LotteryCardPremium';
   + import { LotteryCardPremium } from '@/components/lottery/LotteryCardPremium';
   ```
3. A `LotteryListPage` consome do mesmo path `@/components/lottery/LotteryCardPremium` — zero drift visual.
4. Se o refactor do carousel parecer "fora do escopo" para esta PR, aceitar Opção A temporariamente (reusar via `@/components/home/LotteryCardPremium`) e abrir tarefa técnica para extrair — mas **fazer junto é sempre preferível**: evita o limbo "home dono de algo que não é só da home".

### 2.2 Se algum ajuste visual for necessário

O card em `/sorteios` é **idêntico** ao da home visualmente, porém com dois pontos de refinamento opcionais que podem virar **props do próprio `LotteryCardPremium`** (não forks):

- `variant?: 'carousel' | 'grid'` — default `'carousel'`. Quando `'grid'`, adicionar a sombra ligeiramente mais pesada (`shadow-card-on-paper`) porque o card roda sobre paper/light body em vez de `noir-page`. Se for preferido evitar a complexidade, simplesmente aplicar `className="shadow-card-on-paper"` no wrapper do consumidor é suficiente — o card em si já tem `shadow-noir-card` por default e ambas as sombras são aditivas/sobrepostas.
- `showCalendarChip?: boolean` — default `false`. Se `true` (como em `/sorteios`), exibir o mini chip `<CalendarClock>` com a data/hora da próxima `raffles[0].raffleDatetime`.

Ambas são **aditivas** (não quebram o consumidor atual — home continua funcionando sem mudar props).

---

## 3. Nova composição da `LotteryListPage.tsx`

```tsx
// src/pages/public/LotteryListPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { useLottery } from '@/hooks/useLottery';
import { LotteryListHeader } from '@/components/lottery/LotteryListHeader';
import { LotteryCardPremium } from '@/components/lottery/LotteryCardPremium';
import { LotteryCardSkeleton } from '@/components/lottery/LotteryCardSkeleton';
import { LotteryEmptyState } from '@/components/lottery/LotteryEmptyState';
import { Pagination } from '@/components/common/Pagination';
import type { LotteryInfo } from '@/types/lottery';

const PAGE_SIZE = 9;            // 3x3 em desktop, 2 col tablet, 1 col mobile
const SKELETON_COUNT = 6;       // exibidos durante o primeiro load

type SortKey = 'prize-desc' | 'ending-soon';

export const LotteryListPage = (): JSX.Element => {
  const { openLotteries, loading, loadOpen } = useLottery();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortKey>('prize-desc');

  useEffect(() => {
    void loadOpen();
  }, [loadOpen]);

  // Quando a lista muda de tamanho (ex.: depois do load), clampar page
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(openLotteries.length / PAGE_SIZE));
    if (page > totalPages) setPage(totalPages);
  }, [openLotteries.length, page]);

  // Estatísticas reais derivadas do array (sem rede extra)
  const stats = useMemo(() => ({
    total: openLotteries.length,
    prizeSum: openLotteries.reduce((acc, l) => acc + (l.totalPrizeValue ?? 0), 0),
  }), [openLotteries]);

  // Ordenação client-side
  const sorted = useMemo<LotteryInfo[]>(() => {
    const arr = [...openLotteries];
    if (sort === 'prize-desc') {
      arr.sort((a, b) => (b.totalPrizeValue ?? 0) - (a.totalPrizeValue ?? 0));
    } else if (sort === 'ending-soon') {
      // Ordena por próxima raffle ascendente (as mais próximas primeiro)
      arr.sort((a, b) => {
        const aTs = a.raffles?.[0]?.raffleDatetime
          ? new Date(a.raffles[0].raffleDatetime).getTime()
          : Number.POSITIVE_INFINITY;
        const bTs = b.raffles?.[0]?.raffleDatetime
          ? new Date(b.raffles[0].raffleDatetime).getTime()
          : Number.POSITIVE_INFINITY;
        return aTs - bTs;
      });
    }
    return arr;
  }, [openLotteries, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageSlice = useMemo<LotteryInfo[]>(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);

  const handlePageChange = (next: number): void => {
    setPage(next);
    // Scroll suave ao trocar de página, respeitando reduced-motion.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  const firstLoad = loading && openLotteries.length === 0;

  return (
    <main className="relative min-h-screen">
      <LotteryListHeader
        totalActive={stats.total}
        prizeSum={stats.prizeSum}
        shownCount={pageSlice.length}
        sort={sort}
        onSortChange={setSort}
      />

      {firstLoad ? (
        <section
          aria-label="Carregando sorteios"
          className="mx-auto max-w-7xl px-6 pt-8 pb-12"
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <LotteryCardSkeleton key={i} />
            ))}
          </div>
        </section>
      ) : openLotteries.length === 0 ? (
        <section className="mx-auto max-w-7xl px-6 pt-8 pb-16">
          <LotteryEmptyState />
        </section>
      ) : (
        <>
          <section
            aria-label="Lista de sorteios abertos"
            className="mx-auto max-w-7xl px-6 pt-8 pb-12"
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageSlice.map((lottery) => (
                <LotteryCardPremium
                  key={lottery.lotteryId}
                  lottery={lottery}
                  showCalendarChip
                />
              ))}
            </div>
          </section>

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={handlePageChange}
            pageSize={PAGE_SIZE}
            totalItems={sorted.length}
            ariaLabel="Paginação da lista de sorteios"
          />
        </>
      )}
    </main>
  );
};
```

**Observações**:

- `main` NÃO precisa aplicar `bg-fortuno-offwhite` — isso vem do `AuthenticatedShell` (que já pinta o body claro via `--dash-bg-page`). Se no código atual o `AuthenticatedShell` envolve apenas rotas autenticadas e `/sorteios` for pública, o shell público precisa aplicar a mesma cor base. **Verificar** em `src/App.tsx` / `src/components/layout/` antes de implementar — se a rota pública tiver shell próprio, adicionar `className="min-h-screen bg-fortuno-paper"` no shell ou direto no `main`.
- A ordenação é **client-side** e puramente estado local da página. Zero rede extra. Quando o backend expuser `?sort=`, basta reencaminhar via `loadOpen(sort)`.
- O `useEffect` que clampa `page` cobre o caso: usuário está na página 3, depois aplica um filtro que deixa apenas 5 sorteios → `totalPages = 1` → cai para 1 sem travar.

---

## 4. Componentes — contratos detalhados

### 4.1 `LotteryListHeader`

**Localização**: `src/components/lottery/LotteryListHeader.tsx`.

**Props**:
```ts
export type LotteryListSort = 'prize-desc' | 'ending-soon';

export interface LotteryListHeaderProps {
  totalActive: number;            // stats.total (nº de sorteios abertos)
  prizeSum: number;               // soma de totalPrizeValue (BRL)
  shownCount: number;             // tamanho do slice atual (para "Exibindo N de X")
  sort: LotteryListSort;
  onSortChange: (next: LotteryListSort) => void;
}
```

**DOM**:
```tsx
<section
  aria-labelledby="list-title"
  className="mx-auto max-w-7xl px-6 pt-10 md:pt-16 pb-4"
>
  <div
    aria-hidden="true"
    className="flex items-center justify-center gap-3.5 mb-4"
  >
    <span className="flex-1 max-w-[120px] h-px bg-list-ornament-line" />
    <span className="w-2 h-2 rotate-45 bg-fortuno-gold-intense shadow-[0_0_10px_rgba(184,150,63,0.55)]" />
    <span className="flex-1 max-w-[120px] h-px bg-list-ornament-line" />
  </div>

  <div className="text-center">
    <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase text-fortuno-gold-intense font-semibold mb-3">
      <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
      Vitrine de sorteios
    </span>

    <h1
      id="list-title"
      className="font-display font-bold leading-[1.05] tracking-[-0.02em] text-fortuno-black text-[clamp(34px,4.5vw,56px)]"
    >
      Sorteios em andamento
    </h1>

    <p className="text-fortuno-black/70 mt-3 text-base md:text-lg max-w-2xl mx-auto">
      <strong className="text-fortuno-green-elegant font-semibold">
        {totalActive} {totalActive === 1 ? 'sorteio ativo' : 'sorteios ativos'}
      </strong>
      {' · prêmios somando '}
      <strong className="text-fortuno-green-elegant font-semibold">
        {formatBRL(prizeSum)}
      </strong>
      . Escolha a sua próxima sorte.
    </p>

    <span
      className="sr-only"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Atualizado a cada troca de página/ordenação pelo componente pai via key */}
      Exibindo {shownCount} sorteios.
    </span>
  </div>

  <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">
    <div className="text-sm text-fortuno-black/60">
      Exibindo{' '}
      <strong className="text-fortuno-green-elegant font-semibold">
        {shownCount} de {totalActive}
      </strong>{' '}
      sorteios
    </div>

    <SortChip value={sort} onChange={onSortChange} />
  </div>
</section>
```

**`SortChip` inline**:
```tsx
const SORT_OPTIONS: Array<{ value: LotteryListSort; label: string }> = [
  { value: 'prize-desc',  label: 'Prêmio maior' },
  { value: 'ending-soon', label: 'Terminando em breve' },
];

// Implementar como <button> que abre um <ul role="listbox"> via Radix DropdownMenu
// (já presente? verificar package.json; caso contrário, um <select> estilizado serve).
```

**Recomendação**: usar **`<select>` nativo estilizado** — acessível out-of-the-box, zero dependência, toque/teclado funcionais. Se futuramente houver > 3 opções ou filtros aninhados, migrar para Radix DropdownMenu.

### 4.2 `LotteryCardPremium` (extraído da home)

Ver §2.1 para a decisão de mover. Props (extensão):

```ts
export interface LotteryCardPremiumProps {
  lottery: LotteryInfo;
  /** default 'carousel' — quando 'grid', aplica sombra mais pesada para
   *  contraste sobre light body. */
  variant?: 'carousel' | 'grid';
  /** exibe chip `CalendarClock` com a data/hora da próxima raffle.
   *  default false (home não mostra, lista mostra). */
  showCalendarChip?: boolean;
}
```

Quando `showCalendarChip` for `true`, inserir abaixo do `<h3>` (antes do bloco "Prêmio total"):

```tsx
{lottery.raffles?.[0]?.raffleDatetime && (
  <div className="mb-4 flex items-center gap-3 flex-wrap">
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] uppercase tracking-[0.18em] bg-fortuno-gold-soft/10 border border-fortuno-gold-soft/30 text-fortuno-gold-soft">
      <CalendarClock className="w-3 h-3" aria-hidden="true" />
      {formatShortDateTime(lottery.raffles[0].raffleDatetime)}
    </span>
  </div>
)}
```

Deadline chip (canto superior direito):
- Calcular `daysUntil = Math.ceil((new Date(raffleDatetime) - Date.now()) / 86400000)`.
- Se `daysUntil <= 7`, aplicar variante **urgent** (`--deadline-urgent-*`) + `<span class="pulse">` dot pulsante.
- Copy: `Encerra em Xd` (ou `Encerra hoje` quando `daysUntil === 0`).

### 4.3 `LotteryCardSkeleton`

**Props**: nenhuma. Componente de apresentação puro.

**DOM** (espelha a estrutura do card real para manter a altura):

```tsx
<article
  aria-busy="true"
  aria-live="polite"
  aria-label="Carregando sorteio"
  className="relative flex flex-col overflow-hidden rounded-[20px] border border-fortuno-gold-soft/22 bg-metal-casino shadow-card-on-paper min-h-[480px]"
>
  <div
    aria-hidden="true"
    className="absolute inset-2 rounded-[14px] border border-fortuno-gold-soft/12 pointer-events-none z-[2]"
  />

  {/* imagem */}
  <div className="relative aspect-[16/10] overflow-hidden rounded-t-[20px]">
    <SkeletonBlock className="absolute inset-0 !rounded-none" />
    <SkeletonBlock className="absolute top-4 left-4 z-[3] w-20 h-[22px] rounded-full" />
    <SkeletonBlock className="absolute top-4 right-4 z-[3] w-24 h-[22px] rounded-full" />
  </div>

  {/* body */}
  <div className="relative p-6 flex-1 flex flex-col gap-4 z-[3]">
    <SkeletonBlock className="w-[70px] h-2.5" />
    <SkeletonBlock className="w-[70%] h-6" />

    <div className="flex flex-col gap-2 mt-1">
      <SkeletonBlock className="w-20 h-2.5" />
      <SkeletonBlock className="w-3/5 h-[34px]" />
    </div>

    <div className="flex flex-col gap-2 mt-2">
      <div className="flex items-center justify-between">
        <SkeletonBlock className="w-14 h-2.5" />
        <SkeletonBlock className="w-24 h-2.5" />
      </div>
      <SkeletonBlock className="w-full h-1.5 rounded-full" />
      <SkeletonBlock className="w-[65%] h-2.5" />
    </div>

    <SkeletonBlock className="mt-auto w-full h-11 rounded-xl" />
  </div>
</article>
```

**`SkeletonBlock`** — helper local ao arquivo:
```tsx
const SkeletonBlock = ({ className = '' }: { className?: string }): JSX.Element => (
  <div
    className={`relative overflow-hidden rounded-lg bg-skeleton-block
      after:absolute after:inset-0 after:bg-skeleton-shimmer after:-translate-x-full
      after:animate-skeleton-slide ${className}`}
  />
);
```

> A animação `skeleton-slide` respeita a regra global de `prefers-reduced-motion: reduce` — o shimmer para; os blocos ficam estáticos porém continuam legíveis (via `bg-skeleton-block`).

### 4.4 `LotteryEmptyState`

**Props**: nenhuma.

**DOM**:
```tsx
<div className="relative max-w-2xl mx-auto rounded-3xl p-12 text-center overflow-hidden
                bg-empty-card border-2 border-dashed border-fortuno-gold-intense/55">
  <div
    aria-hidden="true"
    className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-20
               bg-[radial-gradient(closest-side,rgba(184,150,63,0.25),transparent_70%)]
               pointer-events-none"
  />

  <span
    aria-hidden="true"
    className="inline-grid place-items-center w-[72px] h-[72px] rounded-full
               bg-empty-icon border border-fortuno-gold-intense/35
               text-fortuno-gold-intense mb-4"
  >
    <Sparkles className="w-8 h-8" />
  </span>

  <h2 className="font-display font-bold text-[clamp(28px,3.5vw,40px)] leading-[1.05] text-fortuno-black">
    Novos sorteios em{' '}
    <em className="italic text-fortuno-green-elegant">breve</em>
  </h2>

  <p className="mt-3 text-fortuno-black/65 max-w-md mx-auto">
    Não há sorteios ativos no momento. Fique atento — logo aparecem novas edições com prêmios maiores.
  </p>

  <div className="mt-7 flex items-center justify-center gap-3 flex-wrap">
    <Link
      to="/"
      className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl
                 border border-fortuno-gold-intense/55 text-fortuno-gold-intense
                 font-medium text-sm hover:bg-fortuno-gold-intense/8
                 hover:border-fortuno-gold-intense/85 transition-colors duration-base
                 focus-visible:outline-none focus-visible:shadow-gold-focus"
    >
      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
      Voltar para Home
    </Link>
  </div>
</div>
```

### 4.5 `Pagination` — reutilizável

**Localização**: `src/components/common/Pagination.tsx` (genérico — serve para MyLotteries, MyNumbers, extratos, histórico de sorteios — **não amarrar a lottery**).

**Props**:
```ts
export interface PaginationProps {
  /** página atual, 1-indexed */
  page: number;
  /** total de páginas (>= 1) */
  totalPages: number;
  /** handler que recebe a próxima página */
  onChange: (next: number) => void;
  /** usado apenas na legenda "X itens por página" abaixo do controle */
  pageSize?: number;
  totalItems?: number;
  /** aria-label do <nav> pai */
  ariaLabel?: string;
  /** sibling count para algoritmo de janela — default 1 */
  siblingCount?: number;
  className?: string;
}
```

**Algoritmo de páginas visíveis** (clássico, com ellipsis):
- Sempre mostra: `1`, `totalPages`, `page - siblingCount .. page + siblingCount`.
- Se houver "gap" (>= 2 páginas puladas) entre blocos, insere `…` (ellipsis, `<span aria-hidden="true">`).
- Exemplo com `page=3`, `total=12`, `siblingCount=1`: `1 2 3 4 … 12`.
- Exemplo com `page=7`, `total=12`: `1 … 6 7 8 … 12`.
- Exemplo com `total <= 7`: mostra todas (sem ellipsis).

Implementação sugerida (puro, sem lib):
```ts
const getPagesToShow = (
  page: number,
  totalPages: number,
  siblingCount = 1,
): Array<number | 'ellipsis'> => {
  const totalPageNumbers = siblingCount * 2 + 5; // first + last + current + 2*sibling + 2 ellipsis
  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const pages: Array<number | 'ellipsis'> = [1];
  if (showLeftEllipsis) pages.push('ellipsis');
  for (let i = leftSibling; i <= rightSibling; i++) {
    if (i !== 1 && i !== totalPages) pages.push(i);
  }
  if (showRightEllipsis) pages.push('ellipsis');
  if (totalPages > 1) pages.push(totalPages);
  return pages;
};
```

**DOM**:
```tsx
<nav
  aria-label={ariaLabel ?? 'Paginação'}
  className="mx-auto max-w-7xl px-6 pt-4 pb-16 flex flex-col items-center gap-4"
>
  {/* Desktop / tablet */}
  <div
    className="hidden sm:inline-flex items-center gap-1.5 p-1.5 rounded-full
               bg-pagination border border-fortuno-black/10 shadow-pagination
               backdrop-blur-sm"
    role="group"
    aria-label="Selecionar página"
  >
    <PageChip
      arrow
      disabled={page === 1}
      onClick={() => onChange(page - 1)}
      aria-label="Página anterior"
    >
      <ChevronLeft className="w-4 h-4" aria-hidden="true" />
      <span>Anterior</span>
    </PageChip>

    {getPagesToShow(page, totalPages, siblingCount).map((p, idx) =>
      p === 'ellipsis' ? (
        <span
          key={`ellipsis-${idx}`}
          aria-hidden="true"
          className="min-w-[28px] text-center text-fortuno-black/45 tracking-wider select-none"
        >
          …
        </span>
      ) : (
        <PageChip
          key={p}
          active={p === page}
          onClick={() => onChange(p)}
          aria-label={p === page ? `Página ${p} (atual)` : `Ir para página ${p}`}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </PageChip>
      ),
    )}

    <PageChip
      arrow
      disabled={page === totalPages}
      onClick={() => onChange(page + 1)}
      aria-label="Próxima página"
    >
      <span>Próxima</span>
      <ChevronRight className="w-4 h-4" aria-hidden="true" />
    </PageChip>
  </div>

  {/* Mobile */}
  <div className="sm:hidden flex items-center gap-3 flex-wrap justify-center">
    <button
      type="button"
      disabled={page === 1}
      onClick={() => onChange(page - 1)}
      aria-label="Página anterior"
      className="/* igual ao PageChip arrow, só que isolado */"
    >
      <ChevronLeft className="w-4 h-4" />
    </button>

    <div
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full
                 bg-pagination border border-fortuno-black/10 shadow-pagination
                 text-sm text-fortuno-black font-variant-numeric-tabular"
    >
      Página{' '}
      <span className="font-semibold text-fortuno-green-elegant">{page}</span>{' '}
      de{' '}
      <span className="font-semibold text-fortuno-green-elegant">{totalPages}</span>
    </div>

    <button
      type="button"
      disabled={page === totalPages}
      onClick={() => onChange(page + 1)}
      aria-label="Próxima página"
      className="/* igual ao PageChip arrow */"
    >
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>

  {pageSize !== undefined && totalItems !== undefined && (
    <p className="text-xs text-fortuno-black/50">
      Exibindo {pageSize} sorteios por página · {totalPages} páginas no total
    </p>
  )}
</nav>
```

**`PageChip`** — sub-componente privado do arquivo:
```tsx
interface PageChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  arrow?: boolean;
}

const PageChip = ({
  active = false,
  arrow = false,
  children,
  className = '',
  ...rest
}: PageChipProps): JSX.Element => (
  <button
    type="button"
    className={`
      min-w-[40px] h-10 px-3.5 inline-flex items-center justify-center rounded-full
      text-sm font-semibold text-fortuno-black font-variant-numeric-tabular
      transition-colors duration-fast
      focus-visible:outline-none focus-visible:shadow-gold-focus
      disabled:text-fortuno-black/35 disabled:cursor-not-allowed
      ${active
        ? 'bg-pagination-chip-active text-fortuno-green-deep shadow-pagination-chip'
        : 'hover:bg-fortuno-gold-intense/10'}
      ${arrow ? 'gap-1.5 font-medium text-[13px]' : ''}
      ${className}
    `}
    {...rest}
  >
    {children}
  </button>
);
```

**Teclado**:
- `Tab` navega entre os chips (nativo — são `<button>`).
- `Enter` / `Space` ativa (nativo).
- Seta esquerda/direita enquanto foco está no `<nav>` — **opcional, não obrigatório**. Se quiser implementar, adicionar `onKeyDown` no wrapper: `ArrowLeft → onChange(page-1)`, `ArrowRight → onChange(page+1)`. Não bloqueante para merge.

---

## 5. Responsivo

| Breakpoint  | Grid de cards       | Paginação                                              | Header                    |
|-------------|---------------------|--------------------------------------------------------|---------------------------|
| `< 640px`   | 1 coluna            | Versão mobile: `<` "Página X de Y" `>`                 | Stack vertical, sort full-width |
| `sm 640px`  | 2 colunas           | Versão desktop (números) aparece                        | Sort chip à direita       |
| `md 768px`  | 2 colunas           | idem                                                   | Font size do title cresce |
| `lg 1024px` | **3 colunas**       | idem                                                   | Espaçamento vertical maior |
| `xl 1280px` | 3 colunas `max-w-7xl` | idem                                                 | Idem                      |

Regras:
- Grid `gap-6` (24px) consistente com a home.
- Cards mantêm `min-h-[480px]` (ou herdado do `LotteryCardPremium`) para alinhamento visual em 3-col com alturas variáveis do nome/descrição.
- Zero scroll horizontal em 375px — a paginação mobile resolve o problema de 10+ chips apertados.

---

## 6. Acessibilidade (WCAG AA mínimo)

Além das regras globais do projeto:

- **H1 único** na página: "Sorteios em andamento" (`id="list-title"`). Não duplicar no shell.
- **`aria-live="polite"`** no `<span className="sr-only">` sob o subhead que anuncia quantos sorteios estão visíveis. Atualiza ao trocar ordenação/página.
- **`aria-current="page"`** obrigatório no chip ativo da paginação.
- **Contraste**:
  - Chip ativo: `#0a2a20` sobre gradient gold-soft→gold-intense → ~10:1 AAA.
  - Chip ghost: `#0b0b0b` sobre paper `#f7f3ec` → ~17:1 AAA.
  - Texto secundário (`text-fortuno-black/60`): ~4.8:1 AA em 14px regular.
- **Sem "só cor" para transmitir info**: chip ativo tem fundo sólido dourado (não só texto colorido); deadline chip urgente tem dot + texto "Encerra em 2d"; progress bar tem `aria-valuenow` numérico.
- **Skeleton**: cada card tem `aria-busy="true"` + `aria-label="Carregando sorteio"`. Screen reader anuncia uma vez por card.
- **Empty state**: `<h2>` semântico, não apenas visual. Ícone Sparkles com `aria-hidden="true"`.
- **Ornamento art déco**: todo `aria-hidden="true"`.
- **Foco visível em TUDO que é focável**: ring ouro 3px (`focus-visible:shadow-gold-focus`) — chips de paginação, sort chip, CTAs dos cards, link "Voltar para Home".
- **Imagens dos cards**: `alt` descritivo do prêmio (ex.: "Ferrari vermelha em estúdio — prêmio do sorteio Mega Fortuno Ouro"). Nunca `alt=""` exceto para o overlay escuro decorativo (que não tem `<img>`, é CSS).
- **Ordem de tab**: Header (sort chip) → primeiro card → segundo card → ... → paginação (anterior → chips → próxima). Seguir a ordem visual.

---

## 7. Animações — mapa completo

| Animação                        | Elemento                          | Duração       | Respeita `reduced-motion`? |
|---------------------------------|-----------------------------------|---------------|----------------------------|
| `animate-live-pulse`            | Dot do badge "Aberto" em cada card | 1.8s infinite | Sim (global)               |
| `animate-progress-shimmer`      | Progress bar dos cards             | 2.4s infinite | Sim (global)               |
| `animate-skeleton-slide` **(novo)** | Shimmer do skeleton            | 1.8s linear   | Sim (global)               |
| `hover:-translate-y-1.5`        | Lift dos lottery cards             | 240ms spring  | Sim (global `transition-duration: 0.001ms`) |
| `hover:-translate-y-px`         | Sort chip hover                    | 240ms         | Sim (global)               |
| `scrollTo({ behavior: 'smooth' })` | Scroll ao topo na troca de página | browser nativo | **Sim, explícito** — ver `handlePageChange` em §3 (troca para `'auto'`) |

---

## 8. Consumo de dados — contratos

### 8.1 Hooks consumidos

- `useLottery()` → `{ openLotteries: LotteryInfo[], loading: boolean, loadOpen: () => Promise<void> }`. **Já existe**, não tocar.

### 8.2 Campos de `LotteryInfo` consumidos

| Campo                         | Uso                                                                |
|-------------------------------|--------------------------------------------------------------------|
| `lotteryId`                   | `key` + "Edição Nº 048" (pad 3)                                    |
| `slug`                        | `Link to={`/sorteios/${slug}`}`                                    |
| `name`                        | Título do card + `alt` da imagem                                   |
| `totalPrizeValue`             | Numeral ouro "Prêmio total" + soma do subhead                      |
| `ticketPrice`                 | "bilhete a partir de R$ X" no bloco de progresso                   |
| `ticketNumIni`, `ticketNumEnd`| `totalTickets = end - ini + 1`                                     |
| `images[0].imageUrl`          | Cover do card; fallback via `FallbackCover` (já existente)         |
| `raffles[0].raffleDatetime`   | Deadline chip + CalendarClock chip + ordenação `ending-soon`       |

### 8.3 Estatísticas do header

**Totalmente derivadas** de `openLotteries` (sem rede extra):
```ts
const stats = {
  total: openLotteries.length,
  prizeSum: openLotteries.reduce((acc, l) => acc + (l.totalPrizeValue ?? 0), 0),
};
```

Se no futuro `openLotteries` vier paginado pelo backend e `total` ≠ `openLotteries.length`, a spec deve ser revisada (o server vai precisar expor `totalCount` e `totalPrizeSum` em headers ou payload).

### 8.4 Paginação server-side (futuro — fora do escopo)

Quando o backend expuser `GET /lotteries/open?page=&size=`:
1. Mover o estado `page` para query param (`useSearchParams`).
2. `loadOpen(page, size)` em vez do `loadOpen()` atual.
3. `totalPages` vem da response, não mais de `Math.ceil(array.length / size)`.
4. O componente `Pagination` **não muda** — já é agnóstico de fonte.

---

## 9. Mocks que precisam virar dados reais

Registrar em `MOCKS.md` (raiz do projeto) as seguintes novas entradas:

### 9.1 Ordenação client-side da lista

- **Arquivo**: `src/pages/public/LotteryListPage.tsx` (constante `SortKey` + `useMemo` de `sorted`).
- **Rota esperada**: `GET /lotteries/open?sort=prize-desc|ending-soon` (ou equivalente). Quando o backend aceitar o parâmetro, mover a ordenação para `loadOpen(sort)`.
- **Descrição**: hoje a ordenação é feita em memória no cliente a partir de `openLotteries`. Se a paginação virar server-side no futuro (ver §8.4), a ordenação **obrigatoriamente** precisa ir junto para o backend para não paginar um array pré-ordenado só parcialmente.
- **Item de acompanhamento**: pendente de abertura.

### 9.2 Progress bar de bilhetes vendidos (já registrado)

Os cards da `/sorteios` consomem o mesmo `LotteryCardPremium` da home — o mock `GET /lottery/{id}/ticketStats` **já está registrado** em `MOCKS.md § Home — Bilhetes vendidos`. Apenas **adicionar `src/pages/public/LotteryListPage.tsx`** à lista de arquivos consumidores daquele mesmo item (não criar entrada nova).

### 9.3 Paginação server-side (futuro)

- **Arquivo**: `src/pages/public/LotteryListPage.tsx` (paginação via `slice` client-side).
- **Rota esperada**: `GET /lotteries/open?page=&size=` retornando `{ items: LotteryInfo[], totalCount: number, totalPrizeSum?: number }`.
- **Descrição**: paginamos client-side enquanto o endpoint não aceita `page/size`. Ao migrar, usar `useSearchParams` para persistir a página na URL (deep-link friendly).
- **Item de acompanhamento**: pendente de abertura.

---

## 10. Atalhos de teclado

| Contexto                | Atalho            | Ação                                                |
|-------------------------|-------------------|-----------------------------------------------------|
| Sort chip focado        | `Enter` / `Space` | Abre listbox / select nativo                        |
| Chip de paginação focado| `Enter` / `Space` | Troca página                                        |
| Dentro da paginação     | `←` / `→`         | Página anterior / próxima (**opcional**, nice-to-have)|
| Card focado             | `Enter`           | Navega para `/sorteios/:slug` (nativo do `<Link>`) |

---

## 11. Checklist de validação pré-merge

- [ ] Rota `/sorteios` renderiza: header → grid (9 cards) → paginação, sem sobreposição.
- [ ] Paginação client-side funciona: page 1 → 2 → 3 → 12 sem travar; botão "Anterior" desabilitado em page=1; "Próxima" desabilitado em page=totalPages.
- [ ] Algoritmo de ellipsis exibe `1 2 3 4 … 12` em page=3, `1 … 6 7 8 … 12` em page=7.
- [ ] Page size default = 9 (conferir constante `PAGE_SIZE = 9`).
- [ ] Scroll suave ao topo ao trocar página; troca para `behavior: 'auto'` quando `prefers-reduced-motion`.
- [ ] Ordenação "Prêmio maior" e "Terminando em breve" reordenam a lista inteira e resetam `page = 1`? Verificar: ao trocar sort, o `useEffect` que clampa `page` cobre, **mas** é uma boa prática fazer `onSortChange(next) => { setSort(next); setPage(1); }` explicitamente.
- [ ] Empty state: quando `openLotteries.length === 0` e `loading === false`, renderiza o card dourado tracejado com CTA "Voltar para Home" (que leva para `/`).
- [ ] Loading state: primeiro load exibe 6 skeletons em grid responsivo. Carregamentos subsequentes (trocar página/sort) **NÃO** exibem skeleton — o layout permanece estável.
- [ ] Card premium idêntico ao do carousel da home (mesmo badge pulsante, mesmo numeral ouro, mesmo CTA "Compre já").
- [ ] `showCalendarChip` aparece nos cards da `/sorteios` (e não aparece no carousel da home).
- [ ] Deadline chip urgente (<7d) aparece com dot pulsante em `#f0d27a`.
- [ ] `aria-current="page"` no chip ativo; `aria-live="polite"` anuncia "Página X de Y" ao mudar.
- [ ] Focus ring ouro 3px em TODOS os chips, sort chip, botões de paginação, CTAs dos cards.
- [ ] 375px: sem scroll horizontal; paginação mobile ("Página X de Y" + 2 setas) aparece; grid vira 1 coluna.
- [ ] `prefers-reduced-motion: reduce`: skeleton para, badge pulse para, progress shimmer para, hover lift instantâneo. Layout permanece intacto.
- [ ] `MOCKS.md` atualizado: ordenação client-side + paginação server-side (futuro) + adicionar `LotteryListPage.tsx` como consumidor do mock `ticketStats` já existente.
- [ ] Testes existentes continuam passando (`npm test`).
- [ ] `npm run lint` limpo.
- [ ] `npm run build` sem warnings novos.

---

## 12. Out of scope desta spec

- **Filtros por categoria de prêmio / range de ticket price / busca textual** — feature separada.
- **Paginação server-side** — aguarda backend expor `?page=&size=`. Ver §8.4 e §9.3.
- **i18n** — a página é pt-BR hardcoded. Se houver demanda, abrir feature separada (mesma regra da home).
- **Refatoração do `LotteryContext` / `useLottery` / `lotteryService`** — não tocar.
- **Autenticação / NAuth** — rota permanece pública.

---

## 13. Referências

- Direção base: `design/wizard-vertical/{mockup.html, tokens.md, spec.md}`.
- Home (origem do `LotteryCardPremium`): `design/home/spec.md §4.4` e `design/home/mockup.html` linhas 1142-1263.
- Dashboard (padrão light body): `design/dashboard/tokens.md §1`.
- Lottery Detail (outro consumidor do card dark sobre paper): `design/lottery-detail/`.
- Mockup desta página: `design/lottery-list/mockup.html`.
- Tokens novos: `design/lottery-list/tokens.md`.
