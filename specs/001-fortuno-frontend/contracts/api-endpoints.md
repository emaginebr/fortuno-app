# API Contracts — Fortuno Frontend

**Feature**: 001-fortuno-frontend
**Phase**: 1 (Design)
**Date**: 2026-04-20

Mapeamento completo dos endpoints da API Fortuno consumidos pelo frontend. A fonte canônica é a coleção Bruno em `c:\repos\Fortuno\Fortuno\bruno`.

**Regra global (SC-004, FR-011)**: todas as requisições abaixo DEVEM incluir o header `X-Tenant-Id: fortuno`. Requisições autenticadas DEVEM também incluir `Authorization: Bearer {nauthToken}`.

Base URL: `import.meta.env.VITE_API_URL`

---

## Lotteries

| Método | Path                                       | Auth  | DTO                          | Service method                          | Consumido em                                |
|--------|--------------------------------------------|-------|------------------------------|------------------------------------------|---------------------------------------------|
| GET    | `/lotteries/{lotteryId}`                   | Não   | `LotteryInfo`                | `lotteryService.getById`                | LotteryDetail, Checkout, Wizard (edit)      |
| GET    | `/lotteries/slug/{slug}`                   | Não   | `LotteryInfo`                | `lotteryService.getBySlug`              | LotteryDetail (SEO-friendly URLs)           |
| GET    | `/lotteries/store/{storeId}`               | Sim   | `LotteryInfo[]`              | `lotteryService.listByStore`            | MyLotteries, LotteryList (Open)             |
| POST   | `/lotteries`                               | Sim   | `LotteryInsertInfo` → `LotteryInfo` | `lotteryService.create`          | Wizard Step 1 (new)                         |
| PUT    | `/lotteries/{lotteryId}`                   | Sim   | `LotteryUpdateInfo` → `LotteryInfo` | `lotteryService.update`          | Wizard Step 1–2 (edit)                      |
| POST   | `/lotteries/{lotteryId}/publish`           | Sim   | —                            | `lotteryService.publish`                | Wizard Step 8                               |
| POST   | `/lotteries/{lotteryId}/close`             | Sim   | —                            | `lotteryService.close`                  | MyLotteries → modal status                  |
| POST   | `/lotteries/{lotteryId}/cancel`            | Sim   | `LotteryCancelRequest`       | `lotteryService.cancel`                 | MyLotteries → modal cancel (reason)         |

**Listagem pública de loterias em andamento (home + `/sorteios`)**:
A coleção Bruno não contém um endpoint público `GET /lotteries?status=Open` explícito — o único listagem disponível é `list-by-store` (autenticado). O frontend chamará `list-by-store` quando o usuário estiver autenticado OU tentará chamada pública se o backend expuser algo do tipo `GET /lotteries/open`. Até confirmação:
- `// MOCK: aguarda endpoint público de loterias abertas` em `lotteryService.listOpen()`, caindo em `list-by-store` com storeId do Fortuno quando a env `VITE_FORTUNO_STORE_ID` estiver definida.

---

## LotteryCombos

| Método | Path                                         | Auth  | DTO                                      | Service method                        |
|--------|----------------------------------------------|-------|------------------------------------------|----------------------------------------|
| GET    | `/lottery-combos/lottery/{lotteryId}`        | Não   | `LotteryComboInfo[]`                     | `lotteryComboService.listByLottery`   |
| POST   | `/lottery-combos`                            | Sim   | `LotteryComboInsertInfo` → `LotteryComboInfo` | `lotteryComboService.create`      |
| PUT    | `/lottery-combos/{id}`                       | Sim   | `LotteryComboUpdateInfo` → `LotteryComboInfo` | `lotteryComboService.update`      |
| DELETE | `/lottery-combos/{id}`                       | Sim   | —                                        | `lotteryComboService.remove`          |

Consumido em: LotteryDetail (ComboSelector, 3 colunas), Wizard Step 5.

---

## LotteryImages

| Método | Path                                         | Auth  | DTO                                         | Service method                        |
|--------|----------------------------------------------|-------|---------------------------------------------|----------------------------------------|
| GET    | `/lottery-images/lottery/{lotteryId}`        | Não   | `LotteryImageInfo[]`                        | `lotteryImageService.listByLottery`   |
| POST   | `/lottery-images`                            | Sim   | `LotteryImageInsertInfo` → `LotteryImageInfo` | `lotteryImageService.create`        |
| PUT    | `/lottery-images/{id}`                       | Sim   | `LotteryImageUpdateInfo` → `LotteryImageInfo` | `lotteryImageService.update`        |
| DELETE | `/lottery-images/{id}`                       | Sim   | —                                           | `lotteryImageService.remove`          |

Consumido em: LotteryImageCarousel, LotteryCarousel (home), Wizard Step 4.

---

## Raffles

| Método | Path                                             | Auth  | DTO                                   | Service method                       |
|--------|--------------------------------------------------|-------|---------------------------------------|---------------------------------------|
| GET    | `/raffles/{raffleId}`                            | Não   | `RaffleInfo`                          | `raffleService.getById`              |
| GET    | `/raffles/lottery/{lotteryId}`                   | Não   | `RaffleInfo[]`                        | `raffleService.listByLottery`        |
| POST   | `/raffles`                                       | Sim   | `RaffleInsertInfo` → `RaffleInfo`     | `raffleService.create`               |
| POST   | `/raffles/{raffleId}/close`                      | Sim   | —                                     | `raffleService.close`                |
| POST   | `/raffles/{raffleId}/winners/preview`            | Sim   | `RaffleWinnersPreviewRequest` → `RaffleWinnerPreviewRow[]` | `raffleService.previewWinners` |
| POST   | `/raffles/{raffleId}/winners/confirm`            | Sim   | `RaffleWinnersPreviewRequest` → void  | `raffleService.confirmWinners`       |

Consumido em: Wizard Step 6, LotteryDetail (exibe Raffles agendados), admin flow de encerramento.

---

## RaffleAwards

| Método | Path                                             | Auth  | DTO                                        | Service method                          |
|--------|--------------------------------------------------|-------|--------------------------------------------|------------------------------------------|
| GET    | `/raffle-awards?raffleId={raffleId}`             | Não   | `RaffleAwardInfo[]`                        | `raffleAwardService.listByRaffle`       |
| POST   | `/raffle-awards`                                 | Sim   | `RaffleAwardInsertInfo` → `RaffleAwardInfo`| `raffleAwardService.create`             |
| PUT    | `/raffle-awards/{id}`                            | Sim   | `RaffleAwardUpdateInfo` → `RaffleAwardInfo`| `raffleAwardService.update`             |
| DELETE | `/raffle-awards/{id}`                            | Sim   | —                                          | `raffleAwardService.remove`             |

Consumido em: Wizard Step 7, LotteryDetail (prêmios exibidos abaixo de cada Raffle).

---

## Tickets

| Método | Path                                               | Auth  | DTO                                             | Service method                  |
|--------|----------------------------------------------------|-------|-------------------------------------------------|----------------------------------|
| GET    | `/tickets/{ticketId}`                              | Sim   | `TicketInfo`                                    | `ticketService.getById`         |
| GET    | `/tickets/mine?lotteryId={id}&number=&fromDate=&toDate=` | Sim | `TicketInfo[]`                             | `ticketService.listMine`        |
| POST   | `/tickets/qrcode`                                  | Sim   | `TicketOrderRequest` → `TicketQRCodeInfo`       | `ticketService.createQrCode`    |
| GET    | `/tickets/qrcode/{invoiceId}/status`               | Sim   | `TicketQRCodeStatusInfo`                        | `ticketService.getQrCodeStatus` |
| **?**  | **simulador π** (a confirmar na API)               | Sim   | —                                               | `ticketService.simulatePayment` (MOCK inicial) |

Consumido em: MyNumbers, Checkout (QuantityStep → payment → success), Dashboard (contador de tickets).

**Status codes do polling** (enum `TicketOrderStatus`):
- `1 Pending` → continuar polling
- `2 Sent` → continuar polling
- `3 Paid` → sucesso, avançar para SuccessStep, usar `tickets` da resposta
- `4 Overdue` → erro, toast e voltar para QuantityStep
- `5 Cancelled` → erro, toast
- `6 Expired` → erro, toast "QR Code expirou", opção de gerar novo

---

## Referrals

| Método | Path                       | Auth  | DTO                              | Service method                     |
|--------|----------------------------|-------|----------------------------------|-------------------------------------|
| GET    | `/referrals/code/me`       | Sim   | `{ referralCode: string }`       | `referralService.getMyCode`        |
| GET    | `/referrals/me`            | Sim   | `ReferrerEarningsPanel`          | `referralService.getEarningsPanel` |

Consumido em: Dashboard (header com referralCode), MyPointsPage (todos os números da comissão).

---

## Commissions

| Método | Path                                       | Auth  | DTO                              | Service method                         |
|--------|--------------------------------------------|-------|----------------------------------|-----------------------------------------|
| GET    | `/commissions/lottery/{lotteryId}`         | Sim   | `LotteryCommissionsPanel`        | `commissionService.listByLottery`      |

Consumido em: MyLotteries → detalhes de comissões pagas de cada lottery que o usuário administra.

---

## Refunds (admin)

| Método | Path                                           | Auth  | DTO                                 | Service method                        |
|--------|------------------------------------------------|-------|-------------------------------------|----------------------------------------|
| GET    | `/refunds/pending/{lotteryId}`                 | Sim   | `TicketInfo[]` (pendentes)          | `refundService.listPending`            |
| POST   | `/refunds/mark-refunded`                       | Sim   | `{ ticketIds: number[] }`           | `refundService.markRefunded`           |

Consumido em: MyLotteries (admin flow de reembolso após cancelamento) — fora do MVP inicial, porém mapeado para scaffolding futuro.

---

## Autenticação (NAuth)

**Não roteada pelos serviços Fortuno acima**. Todas as chamadas do fluxo de auth (login, cadastro, recuperar senha, trocar senha, editar perfil, logout) são feitas pela classe `NAuthAPI` exportada por `nauth-react`, para `VITE_NAUTH_API_URL`, com o tenant `VITE_NAUTH_TENANT`. O frontend Fortuno **não** precisa construir essas requisições.

O token resultante é lido via `useAuth()` e injetado pelo `apiHelpers.getHeaders(true)` nas chamadas à API Fortuno.

---

## Convenções do `apiHelpers`

Todo service instancia `apiHelpers.getHeaders(authenticated)` e usa Fetch API:

```ts
// Services/apiHelpers.ts (conceitual)
export const getHeaders = (authenticated = false): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Tenant-Id': import.meta.env.VITE_FORTUNO_TENANT_ID ?? 'fortuno',
  };
  if (authenticated) {
    const token = readNAuthToken();
    if (!token) throw new UnauthenticatedError();
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};
```

**Respostas**: quando o backend retorna `ApiResponseGeneric<T>` com `{ sucesso, mensagem, erros, data }`, os services unwrap para `T | null` e exibem toast em `erros`. A skill `/react-architecture` já implementa esse padrão.
