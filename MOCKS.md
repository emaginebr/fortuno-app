# Mocks aguardando endpoints reais

Registro vivo dos endpoints que o frontend consome em modo MOCK até que o backend exponha a rota correspondente. Cada entrada deve ter: arquivo que contém o MOCK, rota esperada, descrição curta, e item de acompanhamento (issue/PR).

## Formato

```
### <nome>

- **Arquivo**: `src/Services/xyz.ts`
- **Rota esperada**: `GET /caminho`
- **Descrição**: por que está mockado, o que retorna hoje.
- **Item de acompanhamento**: issue #N ou PR #M
```

---

## Lista ativa

### `ticketService.simulatePayment`

- **Arquivo**: `src/Services/ticketService.ts`
- **Rota esperada**: `POST /tickets/qrcode/{invoiceId}/pay-simulate` (ou equivalente no backend)
- **Descrição**: botão π na tela de pagamento deve disparar um simulador de pagamento PIX. Endpoint exato ainda não confirmado na Bruno collection — o service chama a rota acima e, em caso de 404, apenas emite toast info.
- **Item de acompanhamento**: pendente de abertura.

### Dashboard — "Loterias que administro"

- **Arquivo**: `src/pages/dashboard/DashboardPage.tsx`
- **Rota esperada**: `GET /lotteries/my-owned` (lista de loterias do usuário logado como dono)
- **Descrição**: não há endpoint explícito para filtrar loterias por `createdByUserId` na Bruno collection. Enquanto não houver, o bloco "Loterias que administro" é oculto (condição baseada em lista vazia). Na v2 do dashboard, a seção é totalmente condicional: quando `myLotteries.length === 0`, NÃO renderiza nada (sem empty state).
- **Item de acompanhamento**: pendente de abertura.

### Dashboard — `panel.totalPoints` (chip de pontos no header)

- **Arquivo**: `src/pages/dashboard/DashboardPage.tsx` (cálculo do `totalPoints` passado ao `HeaderChip variant="points"` em `src/components/dashboard/HeaderChip.tsx`) — referência em `design/dashboard/spec.md §4.3` e `§8.2`.
- **Rota esperada**: `GET /referral/panel` deve incluir `totalPoints: number` (saldo INTEIRO de pontos do usuário, NÃO em BRL). Alternativa: criar endpoint dedicado `GET /points/balance` retornando `{ totalPoints: number, currency: 'pts' }` e expor via novo hook `usePoints()`. Decisão fica com o time de backend; o frontend consome o que vier.
- **Descrição**: o chip "Total de pontos" no header escuro do dashboard exibe esse número formatado em pt-BR (ex.: 1.247 pts) e leva o usuário para `/meus-pontos` via CTA "Extrato". Enquanto o backend não expor o campo, a página trunca `panel.totalToReceive` (BRL) para um inteiro >= 0 como fallback determinístico — o chip continua aparecendo, com semântica equivalente à v1 sem mudar o `useReferral`/`referralService`.
- **Item de acompanhamento**: pendente de abertura.

### Home — `StatsBand` (indicadores da plataforma)

- **Arquivo**: `src/components/home/StatsBand.tsx` (constante `DEFAULT_STATS`)
- **Rota esperada**: `GET /stats/public` (distribuído em prêmios, sorteios realizados, ganhadores, % auditoria)
- **Descrição**: banda de 4 números da home hoje exibe valores hardcoded (`R$ 12.400.000`, `248`, `15.320+`, `100%`). Quando o endpoint existir, alimentar via `useEffect` + estado local no componente.
- **Item de acompanhamento**: pendente de abertura.

### Home — Bilhetes vendidos (Hero + LotteryCardPremium)

- **Arquivo**: `src/components/home/HeroFeaturedLottery.tsx`, `src/components/home/LotteryCardPremium.tsx`
- **Rota esperada**: `GET /lottery/{id}/ticketStats` (contagem de bilhetes vendidos por loteria)
- **Descrição**: `totalTickets` deriva do range `ticketNumEnd - ticketNumIni + 1` (já disponível), mas `soldTickets` não existe. No hero, usamos uma estimativa determinística `floor(total * 0.87)` para exibir o scarcity hint. Nos cards premium, `soldTickets = 0` até o endpoint chegar.
- **Item de acompanhamento**: pendente de abertura.

### Home — Sorteio em destaque (`isFeatured`)

- **Arquivo**: `src/pages/public/HomePage.tsx` (`useMemo` de `featuredLottery`)
- **Rota esperada**: `GET /lotteries` passar a expor `isFeatured: boolean` em `LotteryInfo`
- **Descrição**: hoje a home escolhe o sorteio com maior `totalPrizeValue` dos `openLotteries` como destaque. Quando o backend expuser o flag, o `useMemo` passará a priorizar `openLotteries.find(l => l.isFeatured === true)`.
- **Item de acompanhamento**: pendente de abertura.

### Home — `subtitle` curto do sorteio em destaque

- **Arquivo**: `src/components/home/HeroFeaturedLottery.tsx`
- **Rota esperada**: backend incluir `subtitle: string | null` em `LotteryInfo` (descrição editorial curta, separada da `descriptionMd` markdown).
- **Descrição**: enquanto não existir, derivamos um excerpt dos primeiros 140 caracteres de `descriptionMd`. Substituir por `featuredLottery.subtitle ?? excerpt` quando o campo chegar.
- **Item de acompanhamento**: pendente de abertura.

### Checkout — validação de número já comprado

- **Arquivo**: `src/components/checkout/ChooseNumberModal.tsx`
- **Rota esperada**: `GET /lotteries/{id}/numbers/{n}/available`
- **Descrição**: o modal de "escolher número específico" valida localmente apenas duplicidade na lista do usuário (`alreadyPicked`). Enquanto o endpoint não existir, assume-se que qualquer número no range é disponível; o backend rejeita no `createQrCode` se estiver tomado.
- **Item de acompanhamento**: pendente de abertura.

### Checkout — expiração do QR PIX

- **Arquivo**: `src/components/checkout/PixStep.tsx`
- **Rota esperada**: campo `expiredAt` em `TicketQRCodeInfo` (já existe em `types/ticket.ts`). Se o backend não retornar um ISO válido, o step aplica fallback de 15 min.
- **Descrição**: o countdown usa `qrCode.expiredAt` quando presente e válido; caso contrário, aplica `Date.now() + 15min`. Remover fallback quando o backend garantir `expiredAt`.
- **Item de acompanhamento**: pendente de abertura.

### Checkout — data do próximo sorteio no TicketMiniCard

- **Arquivo**: `src/components/checkout/SuccessStep.tsx`
- **Rota esperada**: `LotteryInfo.nextRaffleDate` (ou equivalente dedicado). Hoje o step deriva a próxima `raffle.startDate` futura de `currentLottery.raffles`.
- **Descrição**: enquanto não houver um campo dedicado, extraímos a próxima raffle com `startDate > now`. Se nenhuma existir, exibimos "Em breve".
- **Item de acompanhamento**: pendente de abertura.

### MyNumbers — Ticket vencedor (`isWinner`)

- **Arquivo**: `src/pages/dashboard/MyNumbersPage.tsx`
- **Rota esperada**: `GET /raffles/{lotteryId}/winners` retornando, no mínimo, `{ ticketId: number }[]` para marcar bilhetes vencedores.
- **Descrição**: o voucher premium exibe a variante "vencedor" (metal ouro + chip `Crown` + selo "Champ") quando `isWinner === true`. Enquanto o backend não expõe vencedores por sorteio, a página passa `isWinner={false}` para todos os bilhetes. Ao chegar o endpoint, alimentar um `Map<lotteryId, ticketId[]>` via `useRaffleAward` e calcular por bilhete.
- **Item de acompanhamento**: pendente de abertura.

### MyNumbers — Download do bilhete como imagem

- **Arquivo**: `src/components/tickets/TicketDetailModal.tsx`
- **Rota esperada**: n/a — feature client-side dependente de `html2canvas` ou equivalente.
- **Descrição**: o modal de detalhes do bilhete mostra um botão "Baixar como imagem" que hoje fica desabilitado com tooltip "em breve". `html2canvas` não está no `package.json` e a política do repo proíbe instalar libs nessa PR. Decisões possíveis: (a) serializar o voucher em SVG puro programaticamente e fazer download via Blob + `<a download>`; (b) adicionar `html2canvas` em PR separado.
- **Item de acompanhamento**: pendente de abertura.

### About — Stats institucionais (`AboutStatsBand`)

- **Arquivo**: `src/components/about/AboutStatsBand.tsx` (constante `STATS`)
- **Rota esperada**: `GET /stats/public` — mesmo endpoint aguardado pelo `StatsBand` da home. Deve expor: ano de fundação, total distribuído em prêmios (BRL), total de sorteios realizados, total de ganhadores atendidos.
- **Descrição**: a página institucional `/quem-somos` exibe 4 numerais editoriais com valores hardcoded (`2025`, `R$ 12,4M`, `248`, `15.3k+`). Quando o endpoint existir, alimentar via `useEffect` + estado local e manter os labels i18n em `about.stats.*`.
- **Item de acompanhamento**: pendente de abertura.

### Home — Imagem de fallback do hero

- **Arquivo**: `public/images/hero-fallback.jpg` (asset estático pendente)
- **Arquivo(s) consumidor(es)**: `src/components/home/HeroFeaturedLottery.tsx`, `src/components/lottery/LotteryHero.tsx` (palco compacto da página `/sorteios/:slug`).
- **Rota esperada**: admin cadastrar imagens reais por sorteio (campo `images[0].imageUrl` já existe em `LotteryInfo`).
- **Descrição**: quando um sorteio (em destaque ou em detalhe) não tem imagem, o componente aponta para `/images/hero-fallback.jpg`. O asset deve ser fornecido pelo time de design — enquanto não existir, uma URL quebrada fica como placeholder.
- **Item de acompanhamento**: pendente de abertura.
