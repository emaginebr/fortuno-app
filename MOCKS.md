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

### `lotteryService.listOpen`

- **Arquivo**: `src/Services/lotteryService.ts`
- **Rota esperada**: `GET /lotteries/open` (lista pública de loterias em status `Open`)
- **Descrição**: a Bruno collection atual só expõe `GET /lotteries/store/{storeId}` (autenticado). Enquanto o endpoint público não existir, o frontend chama `list-by-store` passando `VITE_FORTUNO_STORE_ID` e filtra por `status === LotteryStatus.Open` no cliente.
- **Item de acompanhamento**: pendente de abertura.

### `ticketService.simulatePayment`

- **Arquivo**: `src/Services/ticketService.ts`
- **Rota esperada**: `POST /tickets/qrcode/{invoiceId}/pay-simulate` (ou equivalente no backend)
- **Descrição**: botão π na tela de pagamento deve disparar um simulador de pagamento PIX. Endpoint exato ainda não confirmado na Bruno collection — o service chama a rota acima e, em caso de 404, apenas emite toast info.
- **Item de acompanhamento**: pendente de abertura.

### Dashboard — "Loterias que administro"

- **Arquivo**: `src/pages/dashboard/DashboardPage.tsx`
- **Rota esperada**: `GET /lotteries/my-owned` (lista de loterias do usuário logado como dono)
- **Descrição**: não há endpoint explícito para filtrar loterias por `createdByUserId` na Bruno collection. Enquanto não houver, o bloco "Loterias que administro" é oculto (condição baseada em lista vazia).
- **Item de acompanhamento**: pendente de abertura.
