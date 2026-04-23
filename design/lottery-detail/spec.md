# Lottery Detail Page — Component Spec

Handoff do **ui-ux-designer** para o **frontend-react-developer**.

Direção visual: **Editorial Casino Noir** (continuidade direta do wizard, home, dashboard e MyLotteries). Body claro (`--dash-bg-page`). Topbar e footer band globais permanecem intocados — esta página redesenha apenas o conteúdo do `<main>` da rota `/sorteios/:slug`.

Mockup: `design/lottery-detail/mockup.html` (abrir no navegador; renderiza com 2 modais abertos sobre o conteúdo para visualização do design).
Tokens novos: `design/lottery-detail/tokens.md`.

---

## 1. Escopo e estratégia de substituição

### Arquivo-alvo principal

- `src/pages/public/LotteryDetailPage.tsx` — **reestruturado** para compor os blocos novos. A lógica de `useLottery / useLotteryImage / useLotteryCombo / useRaffle / useCheckout` permanece; muda apenas a árvore JSX e os filhos.

### Componentes novos (criar)

| Caminho sugerido | Função |
|------------------|--------|
| `src/components/lottery/LotteryHero.tsx` | Palco compacto (16:9 / 21:9) com imagem, badge ABERTO, countdown, numeral do prêmio, CTAs Regras/Política. |
| `src/components/lottery/LotteryDescription.tsx` | Wrapper editorial do `MarkdownView` aplicando capitular, divisores ouro, cabeçalho de seção. |
| `src/components/lottery/RaffleTimeline.tsx` | Lista de cards-raffles clicáveis (cada um abre `RaffleDetailModal`). |
| `src/components/lottery/RaffleCard.tsx` | Card individual de um raffle (numeral medalha + nome + meta + open arrow). |
| `src/components/lottery/PrizesGrid.tsx` | Grid cross-raffle de prêmios (achata `raffles[].awards[]` ordenando por data + posição). |
| `src/components/lottery/PrizeCard.tsx` | Card individual de um prêmio (badge posição + descrição + chip do raffle). Clica → abre `RaffleDetailModal` do raffle correspondente. |
| `src/components/lottery/CheckoutPanel.tsx` | Wrapper sticky (desktop) com combos + qty selector + recibo + CTA "Comprar". |
| `src/components/lottery/ComboPackCard.tsx` | Card individual Bronze/Prata/Ouro (refator do botão atual interno do `ComboSelector`). |
| `src/components/lottery/Receipt.tsx` | Componente "ticket perfurado" mostrando subtotal/desconto/total. |
| `src/components/lottery/StickyBuyBar.tsx` | Footer sticky mobile com CTA "Comprar X bilhetes · R$ Y". |
| `src/components/lottery/RulesAndPolicyModal.tsx` | Modal único com `mode: 'rules' | 'privacy'` — markdown scroll + botão "Baixar PDF". |
| `src/components/lottery/RaffleDetailModal.tsx` | Modal de detalhes de um raffle (data extensa + lista de prêmios numerada + transmissão URL). |
| `src/components/lottery/_primitives/Modal.tsx` (opcional, ver §6) | Primitive base de modal — overlay + container + focus trap + ESC + click outside. |

### Componentes existentes — destino

| Componente atual | Destino |
|------------------|---------|
| `src/components/lottery/LotteryImageCarousel.tsx` | **Manter como está**. Pode ser reusado dentro de `LotteryHero` se houver mais de 1 imagem (ver §4.1) — cabe em swap futuro, não bloqueia esta passagem. |
| `src/components/lottery/MarkdownView.tsx` | **Manter** — é envolvido por `LotteryDescription` (que aplica o tratamento editorial via classe `.editorial` e por `RulesAndPolicyModal` (que aplica `.markdown-body`). Sem alteração de API. |
| `src/components/lottery/ComboSelector.tsx` | **Refatorar** para delegar a renderização visual dos cards a `ComboPackCard` e a renderização do recibo a `Receipt`. As funções utilitárias `pickCombo` e `computePrice` permanecem (são puras e já exportadas — manter). |
| `src/components/lottery/RulesPdfButton.tsx` | **Esvaziar visualmente, manter a função de geração**. Opção A: extrair a lógica de download em um helper `src/utils/downloadRulesPdf.ts` (uma linha — `downloadMarkdownAsPdf`) e deletar o componente. Opção B (mais conservadora): manter o componente, mas usar apenas dentro do `RulesAndPolicyModal` como botão do footer do modal (sem o botão isolado na página). Recomendo **Opção A** — o componente atual só envelopa uma chamada do `pdfService`, não há ganho em mantê-lo. |

### Arquivos a atualizar

- `src/pages/public/LotteryDetailPage.tsx` — reestruturar composição (§3).
- `src/styles/tokens.css` — anexar tokens novos de `tokens.md §2`.
- `tailwind.config.js` — merge do `theme.extend` de `tokens.md §3`.
- `src/styles/lottery-detail.css` (NOVO, opcional) — abrigar a regra `.editorial` (capitular, divisores), `.markdown-body` (modal markdown render), e os estilos do `qty-slider` (`::-webkit-slider-thumb`/`::-moz-range-thumb`) que são difíceis de expressar em utilitários Tailwind. Importar em `src/styles/index.css`.

---

## 2. Dependências

```bash
# Já existentes — confirmar
npm ls lucide-react keen-slider tailwindcss-animate jspdf
```

- `lucide-react` — ícones novos: `Ticket`, `Trophy`, `Award`, `Calendar`, `CalendarCheck`, `Radio`, `Youtube`, `ScrollText`, `ShieldCheck`, `BadgePercent`, `Lock`, `LifeBuoy`, `Info`, `Mail`, `Download`, `X`, `ArrowRight`, `ArrowUpRight`, `Check`.
- `keen-slider` — já existente, usado em `LotteryImageCarousel`. Mantém.
- `tailwindcss-animate` — já presente.
- Geração de PDF — usa `src/Services/pdfService.ts → downloadMarkdownAsPdf` (já existente, importado por `RulesPdfButton`). **Não criar nova dependência**.

Sem Framer Motion, sem GSAP, sem Headless UI obrigatório (decisão sobre primitive de modal abaixo em §6).

---

## 3. Nova composição da `LotteryDetailPage.tsx`

```tsx
// src/pages/public/LotteryDetailPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLottery } from '@/hooks/useLottery';
import { useCheckout } from '@/hooks/useCheckout';
import { useLotteryImage } from '@/hooks/useLotteryImage';
import { useLotteryCombo } from '@/hooks/useLotteryCombo';
import { useRaffle } from '@/hooks/useRaffle';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { LotteryHero } from '@/components/lottery/LotteryHero';
import { LotteryDescription } from '@/components/lottery/LotteryDescription';
import { RaffleTimeline } from '@/components/lottery/RaffleTimeline';
import { PrizesGrid } from '@/components/lottery/PrizesGrid';
import { CheckoutPanel } from '@/components/lottery/CheckoutPanel';
import { StickyBuyBar } from '@/components/lottery/StickyBuyBar';
import { RulesAndPolicyModal } from '@/components/lottery/RulesAndPolicyModal';
import { RaffleDetailModal } from '@/components/lottery/RaffleDetailModal';
import type { RaffleInfo } from '@/types/raffle';

type ModalState =
  | { type: 'none' }
  | { type: 'rules' }
  | { type: 'privacy' }
  | { type: 'raffle'; raffleId: number };

export const LotteryDetailPage = (): JSX.Element => {
  const { slug } = useParams();
  const { currentLottery, loading, loadBySlug } = useLottery();
  const { images, loadByLottery: loadImages } = useLotteryImage();
  const { combos, loadByLottery: loadCombos } = useLotteryCombo();
  const { raffles, loadByLottery: loadRaffles } = useRaffle();
  const checkout = useCheckout();
  const navigate = useNavigate();

  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [modal, setModal] = useState<ModalState>({ type: 'none' });

  useEffect(() => {
    if (slug) void loadBySlug(slug);
  }, [slug, loadBySlug]);

  useEffect(() => {
    if (!currentLottery?.lotteryId) return;
    void loadImages(currentLottery.lotteryId);
    void loadCombos(currentLottery.lotteryId);
    void loadRaffles(currentLottery.lotteryId);
  }, [currentLottery?.lotteryId, loadImages, loadCombos, loadRaffles]);

  const sortedRaffles = useMemo(
    () => [...raffles].sort(
      (a, b) => new Date(a.raffleDatetime).getTime() - new Date(b.raffleDatetime).getTime(),
    ),
    [raffles],
  );

  const nextRaffle = sortedRaffles[0];

  if (loading || !currentLottery) {
    return <LoadingSpinner label="Carregando sorteio..." />;
  }

  const startCheckout = (): void => {
    checkout.setLotteryId(currentLottery.lotteryId);
    checkout.setQuantity(selectedQuantity);
    navigate(`/checkout/${currentLottery.lotteryId}`);
  };

  const openRaffle = (raffleId: number): void => setModal({ type: 'raffle', raffleId });
  const closeModal = (): void => setModal({ type: 'none' });

  const activeRaffle: RaffleInfo | undefined =
    modal.type === 'raffle' ? sortedRaffles.find(r => r.raffleId === modal.raffleId) : undefined;

  return (
    <main className="min-h-screen bg-dash-page text-fortuno-black">

      <LotteryHero
        lottery={currentLottery}
        images={images}
        nextRaffleAt={nextRaffle?.raffleDatetime}
        onOpenRules={currentLottery.rulesMd ? () => setModal({ type: 'rules' }) : undefined}
        onOpenPrivacy={currentLottery.privacyPolicyMd ? () => setModal({ type: 'privacy' }) : undefined}
      />

      <section className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 pb-12">
        <div className="grid lg:grid-cols-[1.55fr_1fr] gap-7">

          <div className="flex flex-col gap-10">
            {currentLottery.descriptionMd && (
              <LotteryDescription markdown={currentLottery.descriptionMd} />
            )}

            {sortedRaffles.length > 0 && (
              <RaffleTimeline raffles={sortedRaffles} onOpenRaffle={openRaffle} />
            )}

            {sortedRaffles.length > 0 && (
              <PrizesGrid raffles={sortedRaffles} onOpenRaffle={openRaffle} />
            )}
          </div>

          <CheckoutPanel
            combos={combos}
            ticketPrice={currentLottery.ticketPrice}
            minQty={currentLottery.ticketMin}
            maxQty={currentLottery.ticketMax}
            initialQuantity={selectedQuantity}
            onChange={setSelectedQuantity}
            onBuy={startCheckout}
            className="lg:sticky lg:top-[88px] lg:self-start"
          />
        </div>
      </section>

      <StickyBuyBar
        quantity={selectedQuantity}
        ticketPrice={currentLottery.ticketPrice}
        combos={combos}
        onBuy={startCheckout}
      />

      {/* MODAIS — controlados pela página */}
      {modal.type === 'rules' && currentLottery.rulesMd && (
        <RulesAndPolicyModal
          mode="rules"
          markdown={currentLottery.rulesMd}
          pdfFilename={`${currentLottery.slug}-regras`}
          onClose={closeModal}
        />
      )}
      {modal.type === 'privacy' && currentLottery.privacyPolicyMd && (
        <RulesAndPolicyModal
          mode="privacy"
          markdown={currentLottery.privacyPolicyMd}
          pdfFilename={`${currentLottery.slug}-politica`}
          onClose={closeModal}
        />
      )}
      {modal.type === 'raffle' && activeRaffle && (
        <RaffleDetailModal raffle={activeRaffle} onClose={closeModal} />
      )}
    </main>
  );
};
```

Ordem visual: hero → grid (descrição + sorteios + prêmios | checkout sticky) → sticky bar mobile → modais.

---

## 4. Estrutura DOM por componente (classes Tailwind exatas)

> Para todas as classes Tailwind detalhadas, ver `tokens.md §4`. Aqui descrevo apenas a **árvore** e as **props**.

### 4.1 `LotteryHero`

**Props**:
```ts
import type { LotteryInfo } from '@/types/lottery';
import type { LotteryImageInfo } from '@/types/lotteryImage';

export interface LotteryHeroProps {
  lottery: LotteryInfo;
  images: LotteryImageInfo[];                // de useLotteryImage()
  nextRaffleAt?: string;                     // ISO do próximo raffle (sortedRaffles[0]?.raffleDatetime)
  onOpenRules?: () => void;                  // undefined => esconde a pílula Regras
  onOpenPrivacy?: () => void;                // undefined => esconde a pílula Política
}
```

**Sub-componentes privados** (mesmo arquivo, não exportados):
- `Stage` — `<figure>` com a imagem cinematográfica + overlay + grain + frame.
- `CountdownClock` — **REUSAR** o primitive da home (`src/components/home/_primitives/CountdownClock.tsx`). Mesma API (`targetIso`).

**DOM (estado normal)**:
```tsx
<section className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 pt-8 md:pt-10 pb-8"
         aria-labelledby="lottery-title">

  <div className="flex items-center gap-2 mb-5 flex-wrap">
    <span className="eyebrow gold">Sorteio aberto</span>
    <span className="text-fortuno-black/30">·</span>
    <Link to="/sorteios" className="text-[11px] uppercase tracking-[0.18em] text-fortuno-black/55 hover:text-fortuno-gold-intense">
      Voltar para a vitrine
    </Link>
  </div>

  <figure className="hero-stage-compact aspect-[16/9] lg:aspect-[21/9] m-0">
    <img className="stage-image"
         src={primaryImage?.imageUrl ?? FALLBACK_IMAGE}
         alt={`${lottery.name} — prêmio do sorteio em destaque`}
         loading="eager" decoding="async" />
    <div className="stage-overlay" aria-hidden="true" />
    <div className="stage-grain" aria-hidden="true" />
    <div className="stage-frame" aria-hidden="true" />

    {/* Top row: badge ABERTO + countdown */}
    <div className="stage-toprow">
      <span className="badge-live">
        <span className="dot" aria-hidden="true" />
        Aberto
      </span>
      {nextRaffleAt && <CountdownClock targetIso={nextRaffleAt} compact />}
    </div>

    {/* Caption: edição + nome + numeral + CTAs */}
    <figcaption className="stage-caption">
      <span className="text-[10px] uppercase tracking-[0.26em] text-fortuno-gold-soft/85 font-semibold">
        Edição Nº {String(lottery.lotteryId).padStart(3, '0')}
      </span>
      <h1 id="lottery-title" className="font-display text-fortuno-offwhite leading-[1.05] mt-1
                                        text-[clamp(28px,4.5vw,52px)] tracking-[-0.02em]">
        {lottery.name}
      </h1>

      <div className="flex flex-wrap items-end gap-x-8 gap-y-3 mt-3">
        <div>
          <span className="text-[10px] uppercase tracking-[0.26em] text-fortuno-offwhite/75 font-semibold block mb-1">
            Prêmio total
          </span>
          <span className="prize-numeral">{formatBRL(lottery.totalPrizeValue)}</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {onOpenRules && (
            <button type="button" className="pill-outline" aria-haspopup="dialog" onClick={onOpenRules}>
              <ScrollText aria-hidden="true" /> Regulamento
            </button>
          )}
          {onOpenPrivacy && (
            <button type="button" className="pill-outline" aria-haspopup="dialog" onClick={onOpenPrivacy}>
              <ShieldCheck aria-hidden="true" /> Política de privacidade
            </button>
          )}
        </div>
      </div>
    </figcaption>
  </figure>
</section>
```

**Notas**:
- `primaryImage` = `images[0]` (mais simples) — quando houver mais de 1 imagem (futuro), avaliar embed do `LotteryImageCarousel` dentro do palco. **Esta passagem assume 1 imagem**; o fallback `FALLBACK_IMAGE = '/images/hero-fallback.jpg'` (mesmo asset do hero da home) cobre quando `images` está vazio.
- `loading="eager"` no `<img>` (LCP da página).
- O caption tem `text-shadow` + overlay 92% bottom — testar com imagem branca pura.

### 4.2 `LotteryDescription`

**Props**:
```ts
export interface LotteryDescriptionProps {
  markdown: string;
}
```

**DOM**:
```tsx
<section aria-labelledby="desc-title">
  <div className="section-title">
    <span className="eyebrow gold">Sobre o sorteio</span>
    <h2 id="desc-title" className="h2-display">
      O que vem com a <span className="accent">{title}</span>
    </h2>
  </div>
  <article className="editorial">
    <MarkdownView content={markdown} />
  </article>
</section>
```

A classe `.editorial` (definida em `lottery-detail.css`) aplica:
- `&::first-letter` no primeiro parágrafo via seletor `:first-child` — capitular dourada (4.6em float-left, gradient ouro).
- Headings `h2/h3` em Playfair com hierarquia.
- `<hr>` virando divisor ouro com losango central (`.editorial-divider`).
- `ul li::before` virando losango ouro.

> **Importante**: o `MarkdownView` atual provavelmente envolve o output com classes próprias. Validar que o seletor `.editorial > .markdown-content > p:first-of-type::first-letter` (ou equivalente baseado na estrutura real do `MarkdownView`) atinge o primeiro `<p>`. Se necessário, ajustar a classe na `.editorial.css`.

### 4.3 `RaffleTimeline`

**Props**:
```ts
import type { RaffleInfo } from '@/types/raffle';

export interface RaffleTimelineProps {
  raffles: RaffleInfo[];                     // já ordenados por data
  onOpenRaffle: (raffleId: number) => void;
}
```

**DOM**:
```tsx
<section aria-labelledby="raffles-title">
  <div className="section-title">
    <span className="eyebrow gold">Calendário</span>
    <h2 id="raffles-title" className="h2-display">
      Os <span className="accent">{raffles.length} sorteios</span> desta edição
    </h2>
    <span className="text-xs text-fortuno-black/55 ml-auto">Toque em um sorteio para ver os prêmios</span>
  </div>

  <ul className="flex flex-col gap-3" role="list">
    {raffles.map((raffle, idx) => (
      <li key={raffle.raffleId}>
        <RaffleCard
          index={idx + 1}
          raffle={raffle}
          onOpen={() => onOpenRaffle(raffle.raffleId)}
        />
      </li>
    ))}
  </ul>
</section>
```

### 4.4 `RaffleCard`

**Props**:
```ts
export interface RaffleCardProps {
  index: number;                             // 1-based, exibido no marker
  raffle: RaffleInfo;
  onOpen: () => void;
}
```

**DOM**:
```tsx
<button type="button" onClick={onOpen} aria-haspopup="dialog"
        className="raffle-card group">
  <span className="raffle-marker" aria-hidden="true">
    {String(index).padStart(2, '0')}
  </span>
  <div className="min-w-0">
    <div className="raffle-name">{raffle.name}</div>
    <div className="raffle-meta">
      <span><Calendar aria-hidden="true" />{formatDateExtensive(raffle.raffleDatetime)}</span>
      <span><Trophy aria-hidden="true" />{raffle.awards.length} prêmios</span>
      {raffle.videoUrl && (
        <span><Radio aria-hidden="true" />Ao vivo no YouTube</span>
      )}
    </div>
  </div>
  <span className="open-arrow" aria-hidden="true"><ArrowUpRight /></span>
</button>
```

`formatDateExtensive(iso)` → `"Sábado, 17 de maio · 20h00"` (helper novo em `src/utils/datetime.ts`).

### 4.5 `PrizesGrid` + `PrizeCard`

**`PrizesGrid` props**:
```ts
export interface PrizesGridProps {
  raffles: RaffleInfo[];                     // ordenados por data
  onOpenRaffle: (raffleId: number) => void;  // mesmo callback do timeline
}
```

**Lógica interna**: achatar `raffles[].awards[]` em uma lista plana ordenada por data do raffle + `position` do prêmio:

```ts
const flatPrizes = useMemo(() => {
  return raffles.flatMap(r =>
    [...r.awards]
      .sort((a, b) => a.position - b.position)
      .map(award => ({
        raffleId: r.raffleId,
        raffleName: r.name,
        raffleDate: r.raffleDatetime,
        position: award.position,
        description: award.description,
      })),
  );
}, [raffles]);
```

> Se `RaffleInfo.awards` não tem `position` ainda, usar índice do `map`. Confirmar com o tipo gerado por `useRaffle`.

**DOM**:
```tsx
<section aria-labelledby="prizes-title">
  <div className="section-title">
    <span className="eyebrow gold">Premiação completa</span>
    <h2 id="prizes-title" className="h2-display">
      <span className="accent">{flatPrizes.length} prêmios</span> · todos garantidos
    </h2>
  </div>
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {flatPrizes.map((prize, i) => (
      <PrizeCard key={`${prize.raffleId}-${prize.position}-${i}`}
                 prize={prize}
                 onOpen={() => onOpenRaffle(prize.raffleId)} />
    ))}
  </div>
</section>
```

**`PrizeCard` props**:
```ts
export interface PrizeCardProps {
  prize: {
    raffleId: number;
    raffleName: string;
    raffleDate: string;
    position: number;
    description: string;
  };
  onOpen: () => void;
}
```

**DOM**:
```tsx
<button type="button" onClick={onOpen} aria-haspopup="dialog" className="prize-card">
  <span className="prize-position">
    <span className="ord">{prize.position}º</span> Lugar
  </span>
  <span className="prize-description">{prize.description}</span>
  <span className="prize-source">
    <CalendarCheck aria-hidden="true" />
    {prize.raffleName} · {formatDateShort(prize.raffleDate)}
  </span>
</button>
```

### 4.6 `CheckoutPanel`

**Props**:
```ts
import type { LotteryComboInfo } from '@/types/lotteryCombo';

export interface CheckoutPanelProps {
  combos: LotteryComboInfo[];
  ticketPrice: number;
  minQty: number;
  maxQty: number;                          // 0 ou negativo → ilimitado
  initialQuantity?: number;
  onChange: (quantity: number) => void;   // bubbles up para a página
  onBuy: () => void;
  className?: string;                      // permite "lg:sticky lg:top-[88px]"
}
```

Internamente reusa `pickCombo` e `computePrice` de `ComboSelector.tsx` (manter exports).

**DOM** (estrutura):
```tsx
<aside className={cn("checkout-panel-wrapper", className)} aria-labelledby="checkout-title">
  <div className="checkout-panel">
    <div className="flex items-baseline gap-2 mb-4">
      <span className="eyebrow gold">Compre seus bilhetes</span>
    </div>
    <h2 id="checkout-title" className="font-display text-fortuno-black text-[24px] leading-tight mb-1">
      Escolha seu <span className="italic text-fortuno-gold-intense">passe</span>.
    </h2>
    <p className="text-[12px] text-fortuno-black/60 mb-5">
      Cada bilhete custa <strong>{formatBRL(ticketPrice)}</strong> · mín. {minQty} ·
      máx. {maxQty > 0 ? maxQty : 'sem limite'} por compra.
    </p>

    <div className="flex flex-col gap-3 mb-6" role="radiogroup" aria-label="Pacotes de bilhetes">
      {sortedCombos.map((combo, i) => (
        <ComboPackCard key={combo.lotteryComboId}
                       combo={combo}
                       tier={tierFor(i, sortedCombos.length)}  /* 'bronze' | 'silver' | 'gold' */
                       active={currentCombo?.lotteryComboId === combo.lotteryComboId}
                       onSelect={() => handleChange(combo.quantityStart)} />
      ))}
    </div>

    <div className="qty-row">
      <input type="number" inputMode="numeric" min={minQty} max={effectiveMax}
             value={quantity}
             onChange={e => handleChange(Number(e.target.value))}
             className="qty-input"
             aria-label="Quantidade de bilhetes" />
      <input type="range" min={minQty} max={sliderMax} value={quantity}
             onChange={e => handleChange(Number(e.target.value))}
             className="qty-slider"
             aria-label="Ajuste a quantidade de bilhetes"
             aria-valuetext={`${quantity} bilhetes${currentCombo ? ` — pacote ${currentCombo.name} aplicado` : ''}`} />
    </div>

    <Receipt subtotal={pricing.subtotal}
             discount={pricing.discount}
             total={pricing.total}
             quantity={quantity}
             ticketPrice={ticketPrice}
             comboName={currentCombo?.name} />

    <button type="button" onClick={onBuy} className="cta-buy mt-5">
      <Ticket aria-hidden="true" />
      Comprar {quantity} {quantity === 1 ? 'bilhete' : 'bilhetes'}
      <ArrowRight aria-hidden="true" />
    </button>

    <p className="text-center mt-3 text-[11px] text-fortuno-black/55 inline-flex items-center justify-center gap-1.5 w-full">
      <Lock className="w-3 h-3 text-fortuno-gold-intense" aria-hidden="true" />
      Pagamento via PIX criptografado · confirmação em segundos
    </p>
  </div>
</aside>
```

**`tierFor(index, total)`** — heurística para mapear a posição do combo na lista para uma medalha visual: índice 0 → `bronze`, índice 1 → `silver`, índice ≥ 2 → `gold`. Independente do nome literal do combo (o backend pode chamar de "Pacote A/B/C"). Se houver apenas 1 combo, `gold`.

### 4.7 `ComboPackCard`

**Props**:
```ts
export interface ComboPackCardProps {
  combo: LotteryComboInfo;
  tier: 'bronze' | 'silver' | 'gold';
  active: boolean;
  onSelect: () => void;
}
```

**DOM**:
```tsx
<button type="button"
        role="radio"
        aria-checked={active}
        onClick={onSelect}
        className={cn('combo-card', active && 'is-active')}>
  <span className="check-stamp" aria-hidden="true" data-active={active}>
    <Check className="w-3.5 h-3.5" />
  </span>
  <div className="flex items-center gap-3">
    <span className={cn('combo-medal', tier === 'bronze' && 'is-bronze', tier === 'silver' && 'is-silver')}
          aria-hidden="true">
      <Award className="w-4 h-4" />
    </span>
    <div>
      <div className="combo-name">{combo.name}</div>
      <div className="combo-range">
        {combo.quantityEnd === 0
          ? `A partir de ${combo.quantityStart} bilhetes`
          : `De ${combo.quantityStart} a ${combo.quantityEnd} bilhetes`}
      </div>
    </div>
  </div>
  <span className="combo-discount-badge">{combo.discountLabel}</span>
</button>
```

### 4.8 `Receipt`

**Props**:
```ts
export interface ReceiptProps {
  quantity: number;
  ticketPrice: number;
  subtotal: number;
  discount: number;
  total: number;
  comboName?: string;
}
```

**DOM** (estrutura semântica + visual ticket):
```tsx
<div className="receipt" aria-labelledby="receipt-title">
  <div className="text-[10px] uppercase tracking-[0.26em] text-fortuno-gold-intense font-semibold mb-3"
       id="receipt-title">
    Recibo da compra
  </div>

  <div className="receipt-row">
    <span className="label-with-icon"><Ticket />{quantity} bilhetes × {formatBRL(ticketPrice)}</span>
    <span className="font-semibold tabular-nums">{formatBRL(subtotal)}</span>
  </div>
  {discount > 0 && (
    <>
      <div className="receipt-divider" aria-hidden="true" />
      <div className="receipt-row">
        <span className="label-with-icon"><BadgePercent />Desconto{comboName ? ` · pacote ${comboName}` : ''}</span>
        <span className="discount-value tabular-nums">− {formatBRL(discount)}</span>
      </div>
    </>
  )}
  <div className="receipt-divider is-strong" aria-hidden="true" />
  <div className="receipt-row is-total">
    <span>Total</span>
    <span className="tabular-nums">{formatBRL(total)}</span>
  </div>
</div>
```

### 4.9 `StickyBuyBar`

**Props**:
```ts
export interface StickyBuyBarProps {
  quantity: number;
  ticketPrice: number;
  combos: LotteryComboInfo[];
  onBuy: () => void;
}
```

Calcula o total internamente via `pickCombo` + `computePrice`. Visível apenas em `<lg`.

**DOM**:
```tsx
<div className="lg:hidden sticky bottom-0 z-30 bg-sticky-cta border-t border-[color:var(--sticky-cta-border)]
                backdrop-blur-md px-4 py-3 [padding-bottom:calc(env(safe-area-inset-bottom,12px)+12px)]
                shadow-[0_-10px_24px_-16px_rgba(10,42,32,0.25)]">
  <button type="button" onClick={onBuy} className="cta-buy">
    <Ticket aria-hidden="true" />
    Comprar {quantity} {quantity === 1 ? 'bilhete' : 'bilhetes'} · {formatBRL(total)}
  </button>
</div>
```

### 4.10 `RulesAndPolicyModal`

**Props**:
```ts
export interface RulesAndPolicyModalProps {
  mode: 'rules' | 'privacy';
  markdown: string;
  pdfFilename: string;                       // ex.: 'porsche-012-regras'
  onClose: () => void;
  /** Trigger element para devolver foco. Se omitido, devolve ao body. */
  triggerRef?: React.RefObject<HTMLElement>;
}
```

**Conteúdo (varia por `mode`)**:
- Eyebrow: `mode === 'rules' ? 'Documento oficial' : 'Documento de privacidade'`.
- Título: `mode === 'rules' ? 'Regulamento' : 'Política de privacidade'` (concatenar com o nome do sorteio se quiser dar contexto, ex.: `'Regulamento — Porsche Mega Edição #012'`).
- Ícone (Lucide): `mode === 'rules' ? <ScrollText/> : <ShieldCheck/>`.
- Footer: botão "Fechar" (ghost) + botão "Baixar PDF" (primary). O "Baixar PDF" chama `downloadMarkdownAsPdf(markdown, pdfFilename, title)` (helper do `pdfService` já existente).

**DOM** (encapsulado pelo primitive `Modal` — ver §6):
```tsx
<Modal onClose={onClose} ariaLabelledBy="rules-modal-title">
  <ModalHeader icon={mode === 'rules' ? <ScrollText/> : <ShieldCheck/>}
               eyebrow={mode === 'rules' ? 'Documento oficial' : 'Documento de privacidade'}
               title={modeTitle}
               onClose={onClose} />
  <div className="modal-body markdown-body" tabIndex={0}>
    <MarkdownView content={markdown} />
  </div>
  <footer className="modal-footer">
    <span className="text-[11px] text-fortuno-black/50 inline-flex items-center gap-1.5">
      <Info className="w-3 h-3" aria-hidden="true" />
      Versão integral em PDF disponível para download.
    </span>
    <div className="flex gap-2 ml-auto">
      <button type="button" onClick={onClose} className="modal-btn-ghost">Fechar</button>
      <button type="button"
              onClick={() => downloadMarkdownAsPdf(markdown, pdfFilename, modeTitle)}
              className="modal-btn-primary">
        <Download aria-hidden="true" />
        Baixar PDF
      </button>
    </div>
  </footer>
</Modal>
```

### 4.11 `RaffleDetailModal`

**Props**:
```ts
export interface RaffleDetailModalProps {
  raffle: RaffleInfo;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
}
```

**DOM**:
```tsx
<Modal onClose={onClose} ariaLabelledBy="raffle-modal-title">
  <ModalHeader icon={<Trophy/>}
               eyebrow={`Sorteio Nº ${String(raffle.position ?? 1).padStart(2, '0')}`}
               title={raffle.name}
               onClose={onClose} />
  <div className="modal-body" tabIndex={0}>
    {/* Meta: data + transmissão */}
    <div className="grid grid-cols-2 gap-3 mb-5">
      <MetaCard label="Data" primary={formatDateExtensive(raffle.raffleDatetime)}
                secondary={`Apuração às ${formatTime(raffle.raffleDatetime)} (Brasília)`} />
      <MetaCard label="Transmissão" primary={raffle.videoUrl ? 'YouTube' : 'A definir'}
                secondary={raffle.videoUrl
                  ? <a href={raffle.videoUrl} className="...">Abrir transmissão →</a>
                  : 'Link disponibilizado em breve.'} />
    </div>

    {raffle.descriptionMd && (
      <div className="markdown-body mb-2">
        <MarkdownView content={raffle.descriptionMd} />
      </div>
    )}

    {/* Lista de prêmios */}
    {raffle.awards.length > 0 && (
      <div className="mt-4">
        <div className="text-[10px] uppercase tracking-[0.26em] text-fortuno-gold-intense font-semibold mb-2">
          Prêmios deste sorteio
        </div>
        <div className="raffle-detail-prizes">
          {sortedAwards.map(award => (
            <div key={award.position} className="raffle-detail-prize-row">
              <span className="pos-medal" aria-hidden="true">{award.position}º</span>
              <div className="desc">{award.description}</div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
  <footer className="modal-footer">
    <span className="text-[11px] text-fortuno-black/50 inline-flex items-center gap-1.5">
      <ShieldCheck className="w-3 h-3" aria-hidden="true" />
      Apuração auditada por hash SHA-256 público.
    </span>
    <button type="button" onClick={onClose} className="modal-btn-ghost ml-auto">Fechar</button>
  </footer>
</Modal>
```

---

## 5. Comportamento responsivo

| Breakpoint | Comportamento |
|------------|---------------|
| `< 640px` (mobile) | Hero: aspect 16:9 (mais alto que 21:9 para o numeral caber). Countdown encolhe (segundos opcional). Coluna principal e checkout EMPILHAM (1 col). `StickyBuyBar` aparece. Combo cards: 1 por linha. Raffle cards: 2 colunas (marker + texto), open-arrow some. Prize grid: 1 col. |
| `< 768px` (sm) | Idem mobile. Prize grid: 2 col. |
| `md` (768px) | Hero: aspect 16:9. Coluna principal continua full-width (checkout ainda empilhado). Prize grid: 2 col. |
| `lg` (1024px) | Hero: aspect 21:9. Grid 2 col `1.55fr_1fr` ativo. Checkout fica `sticky top-[88px]`. `StickyBuyBar` esconde. Prize grid: 3 col. |
| `xl` (1280px) | `max-w-7xl` centraliza, sobra margem editorial. |

Regras inegociáveis:
- Zero overflow horizontal em 375px (`prize-numeral` clamp 40-72px resolve).
- Touch target ≥ 44px em TODOS os botões/cards/CTAs.
- Cards de raffle / prize / combo `min-h-[148px]+` para consistência tátil.

---

## 6. Decisão sobre primitive de Modal

Você tem 2 opções equivalentes; recomendo **Opção B**.

**Opção A — Reusar `react-modal` skill do projeto** (`/react-modal`): se existir um componente `<Modal>` shadcn/Radix Dialog já implementado, reusar. A `RulesAndPolicyModal` e `RaffleDetailModal` viram shells finos sobre ele. **Vantagem**: focus trap, ESC, click outside, scroll lock, já testado. **Desvantagem**: precisa garantir que o estilo Radix Dialog aceita os tokens `--modal-bg/border/shadow` sem conflito.

**Opção B — Criar `src/components/lottery/_primitives/Modal.tsx`** (recomendada se não houver primitive shadcn pronto):
- Wrapper que renderiza overlay + container.
- `onClose` callback (chamado por: ESC, click no overlay, click no botão X).
- Focus trap via `react-focus-lock` ou implementação manual:
  ```ts
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const focusable = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable[0]?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      previousFocus?.focus();
    };
  }, []);
  ```
- ESC handler:
  ```ts
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [onClose]);
  ```
- Click no overlay (mas NÃO dentro do container) fecha:
  ```tsx
  <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="modal" onClick={e => e.stopPropagation()}>{children}</div>
  </div>
  ```
- Render via portal: `createPortal(content, document.body)`.

> **Decisão final**: confira se o projeto já tem `src/components/common/Modal.tsx` ou similar (procurar por `react-modal` ou `Dialog` em `src/components/`). Se sim, reusar (Opção A). Se não, criar (Opção B). Ambas as opções satisfazem os requisitos de a11y abaixo.

---

## 7. Acessibilidade (WCAG AA mínimo)

Aplica todos os contratos do wizard / home / dashboard + adições específicas:

- **Hero**:
  - `<h1 id="lottery-title">` único na página (a página é roteada, não tem outro h1).
  - Imagem com `alt` semântico (não vazio).
  - Pílulas Regras/Política com `aria-haspopup="dialog"`.
  - Countdown reusa o contrato do primitive existente (timer / aria-live / sr-only com texto completo).
- **Raffle cards / Prize cards**: `<button>` focáveis, `aria-haspopup="dialog"`. Hover === focus visualmente. Texto inteiro do card é o accessible name (combinação natural de marker + name + meta).
- **Combo cards**: `role="radiogroup" aria-label="Pacotes de bilhetes"` no wrapper, `role="radio" aria-checked={...}` em cada card. Setas ←/→/↑/↓ navegam (implementação opcional via `useRovingTabindex`); Enter/Space confirma. Cor do ring NÃO é único indicador — o `Check` stamp e o `aria-checked` cobrem.
- **Qty input/slider**: ambos têm `aria-label`. O slider tem `aria-valuetext` dinâmico anunciando "X bilhetes — pacote Y aplicado".
- **Recibo**: estrutura visível em telas, mas screen readers anunciam todos os pares label/valor sem repetição confusa. `tabular-nums` evita "dança" de dígitos.
- **CTA Comprar**: foco ouro 4px (mais forte). Texto sempre completo: "Comprar X bilhetes" (X numérico + plural correto).
- **Sticky bar mobile**: NÃO obstrui foco do conteúdo principal (z-index 30, overlay nem precisa porque não bloqueia interação subjacente — só ocupa o rodapé). Quando teclado virtual abre em iOS/Android, o sticky pode ser empurrado — aceitável (comportamento nativo).
- **Modais**:
  - `role="dialog" aria-modal="true" aria-labelledby="<id do title>"`.
  - **Focus trap obrigatório** — Tab/Shift+Tab circulam apenas dentro do modal.
  - **ESC fecha** — keydown global enquanto o modal está aberto.
  - **Click no overlay fecha** — só quando o target é o overlay, não filhos.
  - **Foco devolvido ao trigger** — o componente que abriu o modal recebe foco quando ele fecha (passar `triggerRef` ou rastrear `previousActiveElement`).
  - **Body scroll lock** — `document.body.style.overflow = 'hidden'` enquanto aberto.
  - **Modal body com `tabindex="0"`** para receber rolagem por teclado.
  - **Botão Fechar** com `aria-label` específico (não só `aria-label="Fechar"` — usar `"Fechar regulamento"` / `"Fechar detalhes do sorteio"`).

### Contraste

- `fortuno-black` sobre `dash-page` (paper): 17.4:1 AAA.
- `fortuno-black/78` sobre branco (corpo da descrição): ~9:1 AA+.
- `fortuno-gold-intense` sobre branco: 3.6:1 — usado APENAS em **ícones** e **eyebrows uppercase 10px bold tracking ampla** (legíveis pela forma e pelo contexto). NUNCA em corpo de texto longo.
- `fortuno-green-elegant` sobre branco: 9.8:1 AAA — usado nos números do recibo e CTAs ghost.
- `fortuno-offwhite` sobre overlay 92% bottom da imagem: > 7:1 garantido.
- `fortuno-gold-soft` sobre `green-deep` (badge ABERTO no palco): 6.8:1 AAA.

---

## 8. Animações — mapa completo

| Animação | Elemento | Duração | Trigger |
|----------|----------|---------|---------|
| `live-pulse` | Dot do badge "Aberto" no palco | 1.8s infinite | Auto |
| `combo-ring-pulse` | Ring ouro do combo card ativo | 2.4s infinite | `is-active` |
| `modal-fade` | Overlay do modal | 200ms | Mount |
| `modal-pop` | Container do modal | 220ms spring | Mount |
| Hover translate-Y -2px + shadow elevada | Raffle card / Prize card / Combo card | 240ms spring | Hover/Focus |
| Hover rotate -45° na open-arrow | RaffleCard | 160ms spring | Hover do card (via `group-hover`) |
| Hover translate-Y -1px no pill outline | Pílulas Regras/Política | 160ms | Hover |
| Modal close hover rotate 90° | Botão X | 160ms spring | Hover |
| Check stamp scale 0.6→1 | Combo card ativo | 240ms spring | `is-active` toggle |

`prefers-reduced-motion: reduce` desliga todas (regra global em `src/styles/index.css` cobre — o `live-pulse`, `combo-ring-pulse`, `modal-fade`, `modal-pop` somem; cards mantêm estado final visualmente).

---

## 9. Consumo de dados — contratos

### `useLottery().currentLottery: LotteryInfo`

Campos consumidos:
- `lotteryId`, `slug`, `name`, `totalPrizeValue`, `ticketPrice`, `ticketMin`, `ticketMax`
- `descriptionMd?: string` — passado para `LotteryDescription`
- `rulesMd?: string` — controla pílula "Regulamento" no hero + `RulesAndPolicyModal mode="rules"`
- `privacyPolicyMd?: string` — controla pílula "Política de privacidade" + `RulesAndPolicyModal mode="privacy"`

### `useLotteryImage().images: LotteryImageInfo[]`

- `images[0].imageUrl` — capa do palco. Fallback `/images/hero-fallback.jpg` (mesmo asset usado pelo hero da home — registrar em `MOCKS.md` se ainda não estiver lá; já está conforme inspeção).

### `useRaffle().raffles: RaffleInfo[]`

Campos consumidos:
- `raffleId`, `name`, `raffleDatetime` (ISO), `videoUrl?`, `awards: RaffleAwardInfo[]`, `descriptionMd?`
- Cada `award`: `position: number`, `description: string`

> Validar com `src/types/raffle.ts` se `awards` vem populado em `GET /raffles?lotteryId=X`. Se vier separado (`GET /raffles/{id}/awards`), o `useRaffle` precisa carregar awards no mesmo loop. **Esta página assume awards já populados**; se não vierem, abrir issue de integração.

### `useLotteryCombo().combos: LotteryComboInfo[]`

Mantém o contrato atual usado por `ComboSelector`.

### `useCheckout()`

Inalterado: `setLotteryId(id)`, `setQuantity(q)`, navegação para `/checkout/{id}`.

### Mocks adicionais

Esta passagem **não cria mocks novos**. O fallback de imagem do hero (`/images/hero-fallback.jpg`) já está registrado em `MOCKS.md` na entrada "Home — Imagem de fallback do hero" — reutilizar a mesma entrada aplica aqui também (acrescentar nota).

Se o `progress bar de bilhetes vendidos` (mencionado no pedido como mock) for incluído no hero ou no checkout, **registrar nova entrada** em `MOCKS.md`:
```
### Lottery Detail — Bilhetes vendidos do sorteio em foco

- **Arquivo**: `src/components/lottery/LotteryHero.tsx` (e/ou CheckoutPanel)
- **Rota esperada**: `GET /lottery/{id}/ticketStats` (mesma do hero/cards da home)
- **Descrição**: barra de progresso visual mostra "X de Y bilhetes vendidos" com selo "Últimos bilhetes" quando >= 80%. Hoje exibe valor mockado determinístico baseado em `lotteryId` (ex.: floor(total * 0.65)).
```

> **Decisão de produto pendente**: o pedido menciona "barra de progresso de bilhetes vendidos (mock — `MOCKS.md` já tem entrada)". O mockup atual NÃO inclui progress bar para evitar acumulação visual com countdown + numeral. Se for prioritário, posicionar como linha sutil abaixo dos CTAs do hero (mesma técnica do `LotteryCardPremium` da home). Confirmar com produto antes de implementar.

---

## 10. Atalhos de teclado

| Contexto | Atalho | Ação |
|----------|--------|------|
| Página inteira | `Tab` / `Shift+Tab` | Navegar elementos focáveis |
| Em um raffle/prize/combo card | `Enter` / `Space` | Ativa (abre modal / seleciona pacote) |
| Combo radiogroup | `←` `→` `↑` `↓` | Move entre combo cards (opcional via roving tabindex) |
| Modal aberto | `ESC` | Fecha |
| Modal aberto | `Tab` / `Shift+Tab` | Circula focáveis dentro do modal (focus trap) |
| Body do modal | `↑` `↓` `PageUp` `PageDown` `Home` `End` | Scroll do conteúdo |

---

## 11. Checklist de validação pré-merge

- [ ] Rota `/sorteios/:slug` renderiza topbar → hero → grid (descrição/sorteios/prêmios + checkout sticky) → footer band → sticky bar mobile.
- [ ] 375px: sem overflow horizontal em nenhuma seção (atenção ao numeral do hero — `clamp` resolve, validar visualmente).
- [ ] Hero: imagem carrega com `loading="eager"` e respeita `aspect-ratio` (sem layout shift ao trocar de slug).
- [ ] Hero fallback: quando `images` está vazio, renderiza `/images/hero-fallback.jpg` sem quebrar layout.
- [ ] Pílulas Regras/Política: aparecem APENAS quando `rulesMd`/`privacyPolicyMd` existem; abrem modal correspondente; modal abre com foco no botão Fechar (ou primeiro elemento focável).
- [ ] Modais: ESC fecha, click no overlay fecha, click no container NÃO fecha, focus retorna ao trigger.
- [ ] Modal de regras: botão "Baixar PDF" gera o arquivo via `downloadMarkdownAsPdf` (mesmo helper do `RulesPdfButton` antigo). Markdown rola dentro do modal.
- [ ] Raffle cards e prize cards são focáveis via Tab; Enter/Space abre o `RaffleDetailModal` correto (raffle correspondente).
- [ ] PrizesGrid achata `awards` corretamente (ordenação: data do raffle → posição do prêmio).
- [ ] Combo cards funcionam como radiogroup; alterar a quantidade pelo input/slider sincroniza visualmente o card ativo.
- [ ] Recibo recalcula em tempo real ao alterar quantidade ou combo; total tem `tabular-nums`.
- [ ] CTA "Comprar X bilhetes" (desktop e sticky mobile) leva para `/checkout/{lotteryId}` com `quantity` propagado via `useCheckout`.
- [ ] Checkout panel é `sticky top-[88px]` em `lg+` e empilha em `<lg`.
- [ ] Sticky bar mobile esconde em `lg+` e aparece em `<lg`; respeita `safe-area-inset-bottom`.
- [ ] `prefers-reduced-motion: reduce`: nenhum pulse/shimmer/spring; layout permanece intacto.
- [ ] Focus visível (ring ouro 3px+) em TODOS os interativos: pílulas, raffle/prize/combo cards, qty input/slider, CTA Comprar, modal close, modal-btn-ghost, modal-btn-primary.
- [ ] Lighthouse a11y ≥ 95 em mobile e desktop.
- [ ] `npm test` continua passando (apiHelpers/services intocados).
- [ ] `npm run lint` limpo.
- [ ] `npm run build` produz bundle sem warnings novos.
- [ ] Componente antigo `RulesPdfButton` **removido** (Opção A) ou **só usado dentro do modal** (Opção B). Imports quebrados corrigidos.
- [ ] `ComboSelector` refatorado — funções `pickCombo` e `computePrice` mantêm exports e seus testes (`__tests__/ComboSelector.test.ts` se existir) continuam passando.

---

## 12. Out of scope desta passagem

- Não modificar `useLottery`, `useLotteryImage`, `useLotteryCombo`, `useRaffle`, `useCheckout`, nem os respectivos services/contexts.
- Não tocar no `Header.tsx` global nem no `Footer.tsx` global (são compartilhados com o resto do app — mudanças neles devem vir em spec dedicado).
- Não implementar lazy-loading da segunda imagem do palco (assume 1 imagem inicialmente; se houver mais, swap futuro para incluir o `LotteryImageCarousel` dentro do palco).
- Não implementar real-time de bilhetes vendidos (depende de endpoint que não existe — ver §9).
- Não tocar em rotas — `/sorteios/:slug` permanece apontando para `LotteryDetailPage`.
- Não adicionar i18n nesta passagem (a página é pt-BR; se houver demanda, abrir feature separada que cubra também home e dashboard).
- Não criar PDF "preview" embedado (o pedido era markdown render no modal + botão de download — preserva o mesmo fluxo do `RulesPdfButton` original).

---

## 13. Referências

- Direção base: `design/wizard-vertical/{tokens.md, spec.md}`.
- Hero cinematográfico de referência: `design/home/{tokens.md, spec.md, mockup.html}` — `HeroFeaturedLottery`, `LotteryCardPremium`, `GoldNumeral`, `CountdownClock` (primitive reusado).
- Body claro + topbar + footer + dropdown UserMenu (família visual dos modais): `design/dashboard/{tokens.md, spec.md, mockup.html}`.
- Mockup desta página: `design/lottery-detail/mockup.html`.
- Tokens novos: `design/lottery-detail/tokens.md`.
- Arquitetura de componentes do projeto: `CLAUDE.md` (casing, convenções, mocks).
- Helper PDF: `src/Services/pdfService.ts → downloadMarkdownAsPdf`.
