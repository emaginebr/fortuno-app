# Data Model — Fortuno Frontend

**Feature**: 001-fortuno-frontend
**Phase**: 1 (Design)
**Date**: 2026-04-20

Modelo das entidades consumidas pelo frontend. Os tipos refletem os DTOs do backend em `Fortuno.DTO` (confirmados via leitura dos arquivos `.cs`), com `JsonPropertyName` mapeado para as chaves TypeScript em camelCase.

---

## Enums

### LotteryStatus (em `types/enums.ts`)

```ts
export enum LotteryStatus {
  Draft = 1,
  Open = 2,
  Closed = 3,
  Cancelled = 4,
}
```

### NumberType

```ts
export enum NumberType {
  Int64 = 1,
  Composed3 = 3,
  Composed4 = 4,
  Composed5 = 5,
  Composed6 = 6,
  Composed7 = 7,
  Composed8 = 8,
}
```

### TicketOrderMode

```ts
export enum TicketOrderMode {
  Random = 1,
  Manual = 2,
}
```

### TicketRefundState

```ts
export enum TicketRefundState {
  None = 0,
  Pending = 1,
  Refunded = 2,
}
```

### TicketOrderStatus (status do polling PIX)

```ts
export enum TicketOrderStatus {
  Pending = 1,
  Sent = 2,
  Paid = 3,
  Overdue = 4,
  Cancelled = 5,
  Expired = 6,
}
```

### RaffleStatus

```ts
export enum RaffleStatus {
  Scheduled = 1,
  InProgress = 2,
  Closed = 3,
  Cancelled = 4,
}
```

---

## Entidades

### Lottery — `types/lottery.ts`

```ts
export interface LotteryInfo {
  lotteryId: number;
  storeId: number;
  name: string;
  slug: string;
  descriptionMd: string;
  rulesMd: string;
  privacyPolicyMd: string;
  ticketPrice: number;
  totalPrizeValue: number;
  ticketMin: number;
  ticketMax: number;
  ticketNumIni: number;
  ticketNumEnd: number;
  numberType: NumberType;
  numberValueMin: number;
  numberValueMax: number;
  referralPercent: number;
  status: LotteryStatus;
  createdAt: string;   // ISO
  updatedAt: string;
  images: LotteryImageInfo[];
  combos: LotteryComboInfo[];
  raffles: RaffleInfo[];
}

export interface LotteryInsertInfo {
  storeId: number;
  name: string;
  descriptionMd: string;
  rulesMd: string;
  privacyPolicyMd: string;
  ticketPrice: number;
  totalPrizeValue: number;
  ticketMin: number;
  ticketMax: number;
  ticketNumIni: number;
  ticketNumEnd: number;
  numberType: NumberType;
  numberValueMin: number;
  numberValueMax: number;
  referralPercent: number;
}

export interface LotteryUpdateInfo extends LotteryInsertInfo {
  lotteryId: number;
}

export interface LotteryCancelRequest {
  reason: string;
}
```

**Validation rules** (derivadas de FR-022, FR-050..058, edge cases):
- `ticketMin <= ticketMax`
- Se `numberType === Int64`: `ticketNumIni < ticketNumEnd`
- Se `numberType !== Int64`: `numberValueMin < numberValueMax`; componentes de 2 dígitos ordenados ascendente
- `referralPercent` ∈ `[0, 100]`

**State transitions** (status):
- `Draft → Open` (publish / Step 8 do wizard)
- `Open → Closed` (close)
- `Open | Draft → Cancelled` (cancel, com `reason` obrigatório)
- `Closed`/`Cancelled` são terminais

---

### LotteryImage — `types/lotteryImage.ts`

```ts
export interface LotteryImageInfo {
  lotteryImageId: number;
  lotteryId: number;
  imageUrl: string;
  description: string;
  order: number;
}
```

Operações: add / remove / reorder — mutações disparam recarga da Lottery para manter a lista em sincronia.

---

### LotteryCombo — `types/lotteryCombo.ts`

```ts
export interface LotteryComboInfo {
  lotteryComboId: number;
  lotteryId: number;
  name: string;
  quantityStart: number;
  quantityEnd: number;
  discountLabel: string;
  discountValue: number;
}
```

**Regras**:
- Intervalos não podem se sobrepor na mesma Lottery
- `quantityStart <= quantityEnd`
- `discountValue` é percentual (0–100) ou valor absoluto — comportamento determinado pelo `discountLabel` exibido ao usuário

Computação client-side usada por `ComboSelector` e `useCheckout`:
```ts
pickCombo(quantity: number, combos: LotteryComboInfo[]): LotteryComboInfo | null
computePrice(quantity: number, combo, ticketPrice): { subtotal, discount, total }
```

---

### Raffle — `types/raffle.ts`

```ts
export interface RaffleInfo {
  raffleId: number;
  lotteryId: number;
  name: string;
  descriptionMd: string;
  raffleDatetime: string;          // ISO
  includePreviousWinners: boolean;
  status: RaffleStatus;
  createdAt: string;
  updatedAt: string;
  awards: RaffleAwardInfo[];
}

export interface RaffleInsertInfo {
  lotteryId: number;
  name: string;
  descriptionMd: string;
  raffleDatetime: string;
  includePreviousWinners: boolean;
}
```

**Regras**:
- `includePreviousWinners` só é editável a partir do **segundo** Raffle criado para a mesma Lottery (FR-056)
- `raffleDatetime` deve ser futuro na criação

---

### RaffleAward — `types/raffleAward.ts`

```ts
export interface RaffleAwardInfo {
  raffleAwardId: number;
  raffleId: number;
  position: number;
  description: string;
}
```

**Regras**: `position` único por Raffle; ordenação na listagem: Raffle (por `raffleDatetime`) → `position` ascendente.

---

### Ticket — `types/ticket.ts`

```ts
export interface TicketInfo {
  ticketId: number;
  lotteryId: number;
  userId: number;
  invoiceId: number;
  ticketNumber: number;
  ticketValue: string;             // "05-11-28-39-60" ou "123"
  refundState: TicketRefundState;
  createdAt: string;
}

export interface TicketOrderRequest {
  lotteryId: number;
  quantity: number;
  mode: TicketOrderMode;
  pickedNumbers?: number[];
  referralCode?: string;
}

export interface TicketQRCodeInfo {
  invoiceId: number;
  invoiceNumber: string;
  brCode: string;                  // EMV string (linha digitável)
  brCodeBase64: string;            // Imagem QR em base64
  expiredAt: string;
}

export interface TicketQRCodeStatusInfo {
  status: TicketOrderStatus | null;
  invoiceId: number;
  invoiceNumber?: string;
  expiredAt?: string;
  brCode?: string;
  brCodeBase64?: string;
  tickets?: TicketInfo[];          // preenchido quando status=Paid
}

export interface TicketSearchQuery {
  lotteryId?: number;
  number?: string;                 // busca textual
  fromDate?: string;
  toDate?: string;
}
```

**Regras**:
- `pickedNumbers.length <= quantity`. Quando menor que `quantity`, o backend completa aleatoriamente apenas se `mode = Random` **ou** frontend chamar "Preencher o restante aleatoriamente" antes de enviar.
- Exibição do ticket: formatada por `formatInt64`/`formatComposed` sempre a partir de `ticketValue` (string já canônica).

---

### Referral — `types/referral.ts`

```ts
export interface ReferrerEarningsPanel {
  referralCode: string;
  totalPurchases: number;
  totalToReceive: number;
  byLottery: ReferrerLotteryBreakdown[];
  note: string;
}

export interface ReferrerLotteryBreakdown {
  lotteryId: number;
  lotteryName: string;
  purchases: number;
  toReceive: number;
}
```

---

### Commission — `types/commission.ts`

```ts
export interface LotteryCommissionsPanel {
  lotteryId: number;
  commissions: ReferrerCommission[];
  // campos adicionais serão mapeados quando o frontend consumir
}

export interface ReferrerCommission {
  ticketId: number;
  lotteryId: number;
  buyerName: string;
  amount: number;
  createdAt: string;
}
```

(Campos exatos serão confirmados ao scaffoldar via skill — fonte: `Fortuno.DTO/Commission/ReferrerCommission.cs`.)

---

## Estado do checkout — `CheckoutContext`

Estado não persistido no backend (apenas client). Guardado em `sessionStorage` com chave `fortuno:checkout:{lotteryId}`.

```ts
export interface CheckoutState {
  lotteryId: number;
  quantity: number;
  mode: TicketOrderMode;
  pickedNumbers: number[];
  referralCode?: string;
  currentStep: 'quantity' | 'auth' | 'numbers' | 'payment' | 'success';
  qrCode?: TicketQRCodeInfo;
  lastStatus?: TicketOrderStatus;
  tickets?: TicketInfo[];          // após confirmação
}
```

**Transições**:
- `quantity → auth` (se usuário não autenticado ou perfil incompleto)
- `quantity | auth → numbers` (se escolher "Selecionar números")
- `quantity | auth | numbers → payment`
- `payment → success` (quando `status=Paid`)
- `payment → quantity` (se `status=Expired|Cancelled`, com toast de erro)

---

## Relacionamentos

```
Lottery 1 ─── n LotteryImage
Lottery 1 ─── n LotteryCombo
Lottery 1 ─── n Raffle 1 ─── n RaffleAward
Lottery 1 ─── n Ticket (via TicketOrder/Invoice)
User    1 ─── 1 Referral (referralCode)
User    1 ─── n Ticket
Raffle  1 ─── n RaffleWinner (não exposto no MVP do frontend)
```
