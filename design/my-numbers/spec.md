# Meus Números — Handoff para `frontend-react-developer` (v2)

Direção visual: **Editorial Casino Noir** (já consolidada em `wizard-vertical/`, `dashboard/`, `lottery-detail/`, `lottery-list/`, `checkout/`). Página autenticada — estrutura `Header global → DashboardHeader escuro → body claro → Pagination → FooterBand`.

**Decisão criativa (ticket):** mantida a **Proposta A — Vintage Casino Voucher** com 3 variantes de "metal" mapeadas a `TicketRefundState`. **Atualização v2 (pós-feedback do usuário):** o voucher foi **reorganizado verticalmente** — o número do bilhete virou o **herói central** em uma faixa horizontal, e o **nome do sorteio foi removido do card**. Motivação: o número (`ticket.ticketValue`) tem formato variável (Int64 até Composed8, 2–23 chars) e estava estourando + competindo com o título do sorteio em todos os breakpoints.

Arquivo visual standalone: `design/my-numbers/mockup.html`.
Tokens novos: `design/my-numbers/tokens.md`.

---

## 1. Árvore de componentes

```
src/pages/dashboard/MyNumbersPage.tsx            ← reescrita
├── <DashboardHeader />                          ← REUSO
├── <TicketsToolbar />                           ← NOVO
│   ├── LotteryContext strong text               ← NOVO — "em <Sorteio X>" abaixo do título
│   ├── <FilterPill kind="lottery" />
│   ├── <FilterPill kind="number-search" />
│   ├── <FilterPill kind="status" />
│   └── <FilterPill kind="sort" />
├── [loading]  → grid de 6× <TicketCardSkeleton />
├── [empty]    → <TicketEmptyState variant="no-tickets|no-match" />
├── [populated]
│   ├── <TicketsGrid>
│   │   └── <TicketCardPremium ticket={...} />   ← SUBSTITUI TicketCard.tsx
│   ├── <Pagination />                           ← REUSO
│   └── <TrustSeal compact />                    ← opcional
└── <TicketDetailModal /> (bônus)
```

### Migração de `TicketCard.tsx`

- `src/components/tickets/TicketCard.tsx` fica **deprecated** e é removido; seus consumidores (apenas `MyNumbersPage`) passam a usar `TicketCardPremium`.
- `ticket-mini` do passo de sucesso do checkout (`design/checkout/mockup.html`) é **outro componente** — segue independente.

---

## 2. Estilos CSS

Criar `src/styles/my-numbers.css` seguindo o padrão das features existentes. Importar em `src/styles/index.css`.
Tokens novos em `src/styles/tokens.css` (semânticos) e no próprio `my-numbers.css` (específicos): ver `tokens.md`.

---

## 3. DOM por seção — Tailwind + classes semânticas

### 3.1 Página

```tsx
<>
  <DashboardHeader user={user} referralCode={referralCode} totalPoints={totalPoints} />

  <main className="relative z-10 mx-auto max-w-7xl px-6 py-8 md:py-10">
    <TicketsToolbar
      {...toolbarProps}
      lotteryContextName={selectedLotteryName} // novo — para a linha "em <sorteio>"
    />

    {loading ? (
      <TicketsGrid.Skeleton count={6} />
    ) : filtered.length === 0 ? (
      <TicketEmptyState
        variant={hasActiveFilters ? 'no-match' : 'no-tickets'}
        onClearFilters={handleClearFilters}
      />
    ) : (
      <>
        <TicketsGrid>
          {paginated.map((t, i) => (
            <TicketCardPremium
              key={t.ticketId}
              ticket={t}
              lotteryPrize={prizeByLotteryId.get(t.lotteryId)}
              drawDate={drawDateByLotteryId.get(t.lotteryId)}
              lotteryClosed={lotteryClosedById.get(t.lotteryId)}
              isWinner={winnerTicketIdByLotteryId.get(t.lotteryId) === t.ticketId}
              index={i}
              onOpenDetail={() => setSelectedTicket(t)}
            />
          ))}
        </TicketsGrid>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="mt-10"
        />

        <div className="mt-8 flex justify-center">
          <span className="trust-bar">
            <ShieldCheck className="w-[13px] h-[13px]" aria-hidden="true" />
            Todos os bilhetes são auditados e imutáveis
          </span>
        </div>
      </>
    )}
  </main>

  <TicketDetailModal
    ticket={selectedTicket}
    lotteryName={selectedTicket ? lotteryNameById.get(selectedTicket.lotteryId) : undefined}
    onClose={() => setSelectedTicket(null)}
  />
</>
```

Computação de `totalPoints` e `referralCode` — idêntica à `DashboardPage`:

```ts
const { user } = useUser();
const { referralCode, panel, loadPanel } = useReferral();
useEffect(() => { void loadPanel(); }, [loadPanel]);
const totalPoints = Math.max(0, Math.floor(panel?.totalToReceive ?? 0));
```

### 3.2 `<TicketsToolbar />`

```tsx
<section aria-labelledby="my-numbers-title">
  <div className="tickets-toolbar">
    <div className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
      <div className="min-w-0">
        <span className="eyebrow gold">Coleção pessoal</span>
        <h2 id="my-numbers-title" className="toolbar-title mt-1">
          Meus <span className="italic">Números</span>
          <span className="toolbar-counter"> · <strong>{totalCount}</strong> bilhetes</span>
        </h2>

        {/* NOVO — substitui o nome do sorteio que saiu dos cards */}
        {lotteryContextName && (
          <span className="toolbar-lottery-context">
            <Trophy className="w-[13px] h-[13px]" aria-hidden="true" />
            em <strong>{lotteryContextName}</strong>
          </span>
        )}
      </div>
      <a href="/sorteios" className="cta-primary self-start md:self-auto">
        <TicketPlus className="w-[15px] h-[15px]" /> Comprar mais bilhetes
      </a>
    </div>

    <div className="filter-pills filter-pills-scroll mt-5">
      {/* pills: sorteio, número, status, ordenação, limpar (idem v1) */}
    </div>
  </div>
</section>
```

### 3.3 `<TicketCardPremium />` — estrutura v2

**Regras absolutas**:
- `<h3 lotteryName>` **NÃO existe** no card. Ponto final.
- O número (`ticket.ticketValue`) é renderizado em `.voucher-number` com `data-length` calculado pelo componente.
- `.ticket` é um **container `inline-size`** — a tipografia fluida do número escala com a largura do card, não da viewport.
- `data-state="open" | "closed" | "refunded"` controla cor do frame, numeral, seal, status pill.
- `data-winner="true"` opcional — re-aplica metal ouro + status "Vencedor".
- `style={{ '--ticket-index': index }}` — stagger-in.
- `tabindex={0}` + `role="button"` se clicável.

**Props**:

```ts
interface TicketCardPremiumProps {
  ticket: TicketInfo;
  lotteryPrize?: string;            // "R$ 720.000"
  drawDate?: string;                // "12 mai 2026"
  lotteryClosed?: boolean;          // → variante 'closed'
  isWinner?: boolean;               // marca vencedor
  index?: number;                   // stagger-in
  onOpenDetail?: (ticket: TicketInfo) => void;
}
```

**Auto-fit por comprimento** (helper interno):

```ts
function voucherLengthClass(value: string): 'short' | 'medium' | 'long' | 'xlong' {
  const len = value.length;
  if (len <= 5)  return 'short';   // "42", "99999", "12-34"
  if (len <= 10) return 'medium';  // "1234567890", "12-34-56"
  if (len <= 16) return 'long';    // Composed5–6 com padding
  return 'xlong';                  // Composed7/8 (17–23 chars)
}
```

> Threshold principal para reduzir fonte: `length > 14` → cai para `long`; `length > 16` → cai para `xlong`. A CSS aplica tamanhos distintos (ver tokens `--voucher-number-size*`).

**Render dos separadores** (composed): quebrar a string no `-` e wrappear cada separador em `<span className="voucher-number-sep">-</span>` — assim o "-" herda estilos próprios (opacidade, weight), deixando os dígitos como protagonistas.

```ts
function renderTicketValue(value: string) {
  const parts = value.split('-');
  if (parts.length === 1) return value; // Int64 — sem separadores
  return parts.flatMap((p, i) => (
    i === 0 ? [p] : [<span key={`s-${i}`} className="voucher-number-sep">-</span>, p]
  ));
}
```

**DOM do voucher (TSX)**:

```tsx
const state = ticket.refundState === TicketRefundState.Refunded
  ? 'refunded'
  : (lotteryClosed ? 'closed' : 'open');
const isPendingRefund = ticket.refundState === TicketRefundState.Pending;
const lengthClass = voucherLengthClass(ticket.ticketValue);

return (
  <article
    className="ticket"
    data-state={state}
    data-winner={isWinner ? 'true' : undefined}
    style={{ '--ticket-index': index } as CSSProperties}
    role={onOpenDetail ? 'button' : undefined}
    tabIndex={onOpenDetail ? 0 : undefined}
    aria-label={t('myNumbers.ticketAria', {
      number: ticket.ticketValue,
      status: statusLabel(state, isPendingRefund, isWinner),
      drawDate: drawDate ?? '',
    })}
    onClick={onOpenDetail ? () => onOpenDetail(ticket) : undefined}
    onKeyDown={(e) => {
      if (!onOpenDetail) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onOpenDetail(ticket);
      }
    }}
  >
    <div className="ticket-shimmer" aria-hidden="true" />
    <div className="ticket-inner">
      {/* ornamentos */}
      <span className="ticket-corner is-tl" aria-hidden="true" />
      <span className="ticket-corner is-tr" aria-hidden="true" />
      <span className="ticket-corner is-bl" aria-hidden="true" />
      <span className="ticket-corner is-br" aria-hidden="true" />
      <span className="ticket-hole is-left"  aria-hidden="true" />
      <span className="ticket-hole is-right" aria-hidden="true" />

      {/* HEAD — eyebrow + #id  |  status pill */}
      <div className="ticket-head">
        <div className="ticket-head-left">
          <span className="ticket-eyebrow">{t('myNumbers.ticketEyebrow')}</span>
          <span className="ticket-eyebrow-sep" aria-hidden="true" />
          <span className="ticket-id">#FN-{ticket.ticketId}</span>
        </div>
        <TicketStatusPill state={state} pendingRefund={isPendingRefund} winner={isWinner} />
      </div>

      {/* NÚMERO — o herói central */}
      <div className="voucher-number-band">
        <span className="voucher-number" data-length={lengthClass} aria-label={`Número ${ticket.ticketValue}`}>
          {renderTicketValue(ticket.ticketValue)}
        </span>
      </div>

      {/* META — prêmio + data (centralizados) */}
      <div className="ticket-meta">
        {lotteryPrize && (
          <span className="meta-item is-prize">
            <Coins /> {lotteryPrize}
          </span>
        )}
        {drawDate && (
          <span className="meta-item">
            <CalendarClock /> {drawDate}
          </span>
        )}
      </div>

      {/* FOOT — data de compra + selo "autenticado" */}
      <div className="ticket-foot">
        <span className="ticket-purchase-date">
          {t('myNumbers.purchasePrefix')} · {formatDate(ticket.createdAt)}
        </span>
        <span className="ticket-foot-auth" aria-hidden="true">
          <ShieldCheck /> {t('myNumbers.authentic')}
        </span>
      </div>

      {/* SELO circular art-déco */}
      <div className="ticket-seal" aria-hidden="true">
        <div className="ticket-seal-inner">
          <span className="ticket-seal-text">
            {sealEyebrow(state, isWinner)}<strong>{sealYear}</strong>
          </span>
        </div>
      </div>
    </div>
  </article>
);
```

`sealEyebrow`: `'Auth'` (open), `'Final'` (closed), `'Void'` (refunded), `'Champ'` (winner).

### 3.4 `<TicketCardSkeleton />`

Silhueta idêntica ao ticket v2 (vertical): grid `auto 1fr auto`, 3 linhas (head / numeral / meta). Shimmer CSS. 6 unidades padrão.

### 3.5 `<TicketEmptyState variant="no-tickets" | "no-match" />`

Mantém idem v1.

### 3.6 `<TicketDetailModal />` (bônus — RECOMENDADO)

Abre ao clicar no card. Estrutura:

1. Eyebrow ouro "Bilhete autenticado" + close.
2. `<TicketCardPremium />` ampliado (mesmo componente v2 — a faixa do número se expande automaticamente porque o container cresceu; `clamp(..., cqi, ...)` se ajusta).
3. Divider ouro.
4. Grid 2 colunas de detalhes — **aqui SIM** aparece o campo `Sorteio` com o `lotteryName`, junto com prêmio / data / status / ID / compra. É a vitrine detalhada; o card da página manteve-se limpo.
5. QR code à direita (lib `qrcode.react`).
6. Actions: "Baixar como imagem" + "Ver detalhes do sorteio".

Sobre **Baixar como imagem**: `html2canvas` **não** está no `package.json`. Duas opções:
- (a) **Recomendada** — serializar o card em **SVG** programaticamente, download via Blob + `<a download>`.
- (b) Adicionar `html2canvas` em PR separado.

O botão existe no mockup; handler disabled + tooltip "em breve" também é aceitável para escopar depois.

### 3.7 `<TicketStatusPill />` (interna)

| state / flag                       | Label              | Icon                  | Cor            |
| ---------------------------------- | ------------------ | --------------------- | -------------- |
| `state=open`                       | Em andamento       | `·` dot ouro          | ouro           |
| `state=open` + `pendingRefund`     | Reembolso pendente | `Hourglass`           | cobre (inline) |
| `state=closed`                     | Sorteado           | `CheckCircle2`        | verde          |
| `state=closed` + `winner=true`     | Vencedor           | `Crown`               | ouro sólido    |
| `state=refunded`                   | Reembolsado        | `Undo2`               | cobre          |

A cor-base herda de `data-state`. `pendingRefund` usa style inline cobre.

---

## 4. Direção v2 — Vintage Casino Voucher (reorganizado)

### Por que o canhoto saiu

- O canhoto foi herdado do ingresso físico e fazia sentido quando o card tinha **nome do sorteio + número** competindo. Removido o nome do card, o canhoto deixa de ter papel estrutural — o número já é, por si só, o elemento central.
- A divisão 32%/68% também reduzia a largura útil do número. Em 4 cols apertado (≤ 280px de card), um número Composed8 (`"12-34-56-78-90-11-22-33"`, 23 chars) sobrava para fora.
- No novo layout, o número ocupa praticamente a largura inteira menos `22px` de padding lateral. Com `container-type: inline-size` + `clamp(min, Xcqi, max)`, escala graciosamente em qualquer breakpoint.

### Estrutura do voucher v2 (top → bottom)

```
┌──── frame metálico (1.5px gradient) ───────────┐
│  ┌─ [BILHETE · #FN-2842]     [  Em andamento ] │  ← head row
│  │  ─────────────                ────────────  │
│  │                                              │
│  │                  42                           │  ← número (clamp, cqi)
│  │              (ou 12-34-56-78-90-11-22-33)    │
│  │  ─────────────                ────────────  │
│  │                                              │
│  │       💰 R$ 720k · ⌚ 12 mai 2026           │  ← meta
│  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│  │  Compra · 03/04/2026          🛡 Autenticado │  ← foot
│  └──────────────────────────────────────────── │
│                          FORTUNO (watermark)    │
└────────────────────────────────────────────────┘
```

Aspect ratio `1.9 / 1` (mais horizontal que v1 — deu mais espaço para o número).

### Estratégia de auto-fit (a prova do pudim)

1. `.ticket { container-type: inline-size; }` → habilita `cqi` (1cqi = 1% da largura do container).
2. `.voucher-number { font-size: clamp(34px, 11cqi, 84px); white-space: nowrap; overflow: visible; }` → escala com o card.
3. `.voucher-number[data-length="long"]` → `clamp(24px, 7.5cqi, 56px)`.
4. `.voucher-number[data-length="xlong"]` → `clamp(20px, 6cqi, 44px)` + `letter-spacing: -0.015em` + `font-weight: 700`.
5. `font-variant-numeric: tabular-nums` aplicado sempre.

Testado no mockup com os 8 formatos cobrindo Int64 curto (`42`), médio (`99999`), longo (`1234567890`), Composed3/5/7/8, e Composed3 com zero-padding (`05-17-42`). Em todos os casos, o número aparece em **uma linha** sem clipping em:
- 1 col (mobile ≥ 380px)
- 2 cols (sm/md)
- 3 cols (lg)
- 4 cols (xl, apertado)

---

## 5. Contratos / hooks

### Hooks consumidos

```ts
const { user }                                   = useUser();
const { referralCode, panel, loadPanel }         = useReferral();
const { tickets, loading, loadMine }             = useTicket();
const { openLotteries, loadOpen }                = useLottery();
```

### Fluxo de efeitos

```ts
useEffect(() => { void loadPanel(); }, [loadPanel]);
useEffect(() => {
  void loadOpen();
  void loadMine();
}, [loadOpen, loadMine]);

useEffect(() => {
  void loadMine(lotteryFilter ? { lotteryId: lotteryFilter } : undefined);
}, [lotteryFilter, loadMine]);

const filtered = useMemo(() => {
  let out = tickets;
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    out = out.filter(t =>
      t.ticketValue.toLowerCase().includes(q) ||
      String(t.ticketNumber).includes(q),
    );
  }
  if (statusFilter !== 'all') {
    out = out.filter(t => mapTicketStatus(t, lotteryById) === statusFilter);
  }
  if (sort === 'newest')    out = [...out].sort((a,b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  if (sort === 'oldest')    out = [...out].sort((a,b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  if (sort === 'numberAsc') out = [...out].sort((a,b) => a.ticketNumber - b.ticketNumber);
  return out;
}, [tickets, search, statusFilter, sort, lotteryById]);
```

### Dados de enriquecimento por ticket (simplificação v2)

Como o **nome do sorteio saiu do card**, a necessidade de "nome por ticket" caiu — agora só precisamos de `lotteryPrize`, `drawDate` e `lotteryClosed` (flags por `lotteryId`). A única tela que ainda **precisa** do `lotteryName` por ticket é o modal de detalhes (e mesmo assim mostra só na grade de detalhes, não no card ampliado).

Recomendação:
1. **Incremental (default)**: usar `useLottery.openLotteries` para preencher `prizeByLotteryId`, `drawDateByLotteryId`, `lotteryClosedById`. Para loterias não abertas, placeholder (`—` ou `undefined`, renderização condicional).
2. Estender `useLottery` com `loadByIds(ids)` numa PR follow-up se/quando o backend expor endpoint; marcar como `// MOCK` até lá.

### Paginação

Idem v1 — `PAGE_SIZE = 12` (múltiplo de 3 e 4).

---

## 6. Responsividade

| Breakpoint        | Grid | Toolbar                                     | Card                                          |
| ----------------- | ---- | ------------------------------------------- | --------------------------------------------- |
| `< 640px`         | 1    | Pílulas em scroll horizontal. CTA full-width. | Número em `clamp`, ~44–84px. Seal 40px.    |
| `640-1023px`      | 2    | Pílulas wrap.                               | Número ~40–72px.                              |
| `1024-1279px`     | 3    | Tudo inline em 1 linha.                     | Número ~36–64px.                              |
| `≥ 1280px`        | 4    | Idem.                                       | Número ~32–56px em short/medium; xlong cai para ~28–44px. |
| `< 380px`         | 1    | Idem 640.                                   | Card aspect-ratio cai para `1.7 / 1`.         |

`container-type: inline-size` torna o comportamento do número **automático** — a tabela acima é consequência, não configuração.

---

## 7. Acessibilidade

- **`aria-label` do ticket**: `"Bilhete {ticketValue}, {statusLabel}, sorteio em {drawDate}"` — `lotteryName` removido do aria porque ele aparece no **contexto da toolbar** (ex.: "Meus Números em [Sorteio X]"). O contexto é lido pelo TTS antes de iterar os bilhetes.
- **`aria-label` interno do número**: o `<span.voucher-number>` recebe `aria-label={`Número ${ticket.ticketValue}`}` para que leitores de tela pronunciem o valor mesmo quando os separadores estão em spans decorados.
- **Click → modal**: `role="button"` + `tabIndex={0}` + Enter/Space.
- **Focus ring ouro**: `:focus-visible { box-shadow: var(--shadow-gold-focus) }`.
- **Reduced motion**: global override + `transform:none` no hover + shimmers desativados.
- **Contraste**: número em Playfair italic sobre papel amarelado passa ≥ 4.5:1 em todos os tamanhos testados; `status pill` e `meta-item` usam cor ≥ `rgba(11,11,11,0.60)`.
- **Nunca apenas-cor**: status sempre tem label + ícone.
- **Touch target**: pills/CTAs/pagination ≥ 40–44px; ticket inteiro é clicável.
- **`prefers-reduced-motion`**: respeitado.

---

## 8. Animações

| Elemento      | Animação              | Duração     | Condição                          |
| ------------- | --------------------- | ----------- | --------------------------------- |
| `.ticket`     | `ticket-stagger-in`   | 460ms       | load; delay `index * 60ms`        |
| `.ticket:hover` | translate + rotate + shimmer | 240ms / 1.6s loop | hover/focus visible |
| `.ticket-skel` | `skel-shimmer`        | 1.4s loop   | loading                           |
| Pills         | background/border     | 160ms       | hover/active                      |
| Modal         | `modal-pop`           | 220ms       | open                              |

Todos respeitam `prefers-reduced-motion`.

---

## 9. Checklist de implementação (atualizado v2)

- [ ] Criar `src/styles/my-numbers.css` com tokens e classes v2 do mockup.
- [ ] Importar `my-numbers.css` em `src/styles/index.css`.
- [ ] Adicionar tokens semânticos (toolbar + filter-pill) em `src/styles/tokens.css`.
- [ ] Criar `src/components/tickets/TicketCardPremium.tsx`:
  - Sem `<h3 lotteryName>`.
  - Helper `voucherLengthClass(value)` aplicado a `data-length`.
  - Helper `renderTicketValue(value)` para quebrar por `-` em `<span.voucher-number-sep>`.
  - `style={{ '--ticket-index': index }}`.
- [ ] Criar `src/components/tickets/TicketsToolbar.tsx` com linha `toolbar-lottery-context`.
- [ ] Criar `src/components/tickets/TicketsGrid.tsx` (+ subcomponente `.Skeleton`).
- [ ] Criar `src/components/tickets/TicketEmptyState.tsx` (variant).
- [ ] (Bônus) Criar `src/components/tickets/TicketDetailModal.tsx` reusando `Modal` + `QRCodeSVG`.
- [ ] Reescrever `src/pages/dashboard/MyNumbersPage.tsx` usando o fluxo da seção 3.1.
- [ ] Remover `src/components/tickets/TicketCard.tsx`.
- [ ] i18n: adicionar chaves `myNumbers.*`:
  - `title`, `counter`, `lotteryContext` (`em {lottery}`), `ticketEyebrow` (`Bilhete`), `authentic` (`Autenticado`), `purchasePrefix` (`Compra`), `filterLabels.*`, `statusLabels.*`, `emptyNoTickets.*`, `emptyNoMatch.*`, `ticketAria`, `sealLabels.*`. **Nunca** hard-code PT-BR.
- [ ] Testes: cobrir (a) empty sem filtros, (b) empty filtrado limpa filtros, (c) paginação, (d) filtro por número reduz a lista, (e) **novo** render de cada `data-length` em `TicketCardPremium.test.tsx` com exemplos Int64 e Composed3/5/7/8.
- [ ] QA visual: confirmar os 3 metais (open/closed/refunded) + winner em 3 e 4 cols; testar strings de 2, 5, 10, 8, 14, 20, 23 chars.
- [ ] A11y smoke: Tab, Enter, Esc.

---

## 10. Fora de escopo

- Endpoint novo para `lotteryClosed/prize/drawDate` por ticket → follow-up.
- `html2canvas` → decisão do time.
- Confetti ao abrir ticket vencedor → fora do escopo.
- Ordenação server-side → segue client-side.

---

## 11. O "wow moment" v2

O usuário abre `/meus-numeros` e vê a toolbar anunciando "Meus **Números** · 47 bilhetes — em **Porsche 911 Mega Edição #012**". Logo abaixo, uma coleção de vouchers autenticados — cada um com o **número gigante** em Playfair italic ouro **em uma única linha**, moldurado por duas linhas ouro art-déco, com selo circular, watermark FORTUNO e ornamentos de canto. Os bilhetes **mudam de metal** conforme o destino (ouro = em jogo, verde = sorteado, cobre = reembolsado; ouro saturado + coroa = vencedor). O número respira — seja um `42` gigante ou um `12-34-56-78-90-11-22-33` que se ajusta sozinho. Ao passar o mouse, shimmer percorre a borda. É uma peça que pede foto, e agora **sempre cabe**.
