# Spec — Checkout Wizard Horizontal (`/checkout/:lotteryId`)

Handoff para `frontend-react-developer`. Direção visual **Editorial Casino Noir — variante light body**, consistente com `dashboard/`, `lottery-detail/` e `wizard-vertical/`.

**Stack**: React 18 + TS + React Router 6 + Tailwind 3 + tailwindcss-animate + shadcn/ui (onde couber) + lucide-react + `nauth-react` (`LoginForm`, `RegisterForm`, `useAuth`, `useUser`, `useUpdateUser`).

**Princípios inegociáveis** (repetidos para este spec):
- Sem `.tsx` aqui — apenas contratos, DOM, classes Tailwind, tokens e comportamento.
- Rota existente `/checkout/:lotteryId`. Manter URL.
- Nenhum token `#xxxxxx` novo — tudo composto da paleta Fortuno (ver `tokens.md`).
- `prefers-reduced-motion` respeitado via regra global (já definida em tokens do wizard).
- Princípio III de casing: `Contexts/`, `Services/` uppercase; `hooks/`, `types/` lowercase.

---

## 1. Arquitetura de arquivos — o que substitui o quê

Estrutura **atual** (`src/pages/checkout/`):
```
CheckoutPage.tsx           ← switch por currentStep (substituir)
QuantityStep.tsx           ← remover (quantidade agora chega como query/param)
AuthGateStep.tsx           ← substituir por RegisterStepSimple
NumberSelectionStep.tsx    ← substituir por CartStep + ChooseNumberModal
PaymentStep.tsx            ← substituir por PixStep (refatorado)
SuccessStep.tsx            ← substituir (mesmo nome) por versão celebratória
```

Estrutura **nova** proposta:
```
src/pages/checkout/
  CheckoutPage.tsx                        (reescrito — renderiza CheckoutWizardShell)
  CheckoutWizardShell.tsx                 (wrapper + stepper + slot por step)
  steps/
    RegisterStep.tsx                      (ex-AuthGateStep — ampliado)
    CartStep.tsx                          (carrinho: lista + receipt + CTA)
    PixStep.tsx                           (ex-PaymentStep — layout 2 cols)
    SuccessStep.tsx                       (mantém nome, redesign completo)
  components/
    CheckoutStepper.tsx                   (stepper horizontal + mobile compact)
    CartBilletItem.tsx                    (linha de bilhete — agregado ou manual)
    ChooseNumberModal.tsx                 (modal Radix Dialog reaproveitando Modal base)
    TicketMiniCard.tsx                    (card de bilhete gerado — etapa 4)
    CheckoutPrizeThumb.tsx                (reuso da estética "palco compacto")
  hooks/
    useCheckoutWizard.ts                  (orquestra: qual step deve aparecer; skip condicional)
    useConfetti.ts                        (opcional — controla disparo + prefers-reduced-motion)
```

Entrada de quantidade virá do query string `?qty=10&combo=silver` (vindo da lottery-detail). O `QuantityStep` deixa de existir como tela — passa a ser um query param recuperado em `CheckoutWizardShell`.

---

## 2. Componentes novos — contratos

### 2.1 `CheckoutWizardShell`

Wrapper. Responsável por:
- ler `lotteryId` via `useParams()` e query params (`qty`, `combo`, `referral`);
- chamar `checkout.setLotteryId(id)` e `loadById(id)` (mesma lógica atual do `CheckoutPage`);
- rodar `useCheckoutWizard()` para saber qual step renderizar;
- renderizar `CheckoutStepper` no topo (sticky desktop, compacto mobile);
- aplicar `animate-step-slide-in` no container do step atual.

**Props**: nenhuma externa. **Estado**: `useCheckout()`, `useLottery()`, `useUser()`, `useAuth()`.

**DOM**:
```html
<main class="min-h-screen bg-dash-page text-fortuno-black">
  <Header />  <!-- topbar global do dashboard -->

  <div class="mx-auto max-w-[1240px] px-4 md:px-6 py-6 md:py-8">
    <CheckoutStepper current={currentStep} steps={steps} onGoToStep={...} />

    <section class="paper-card rounded-t-none border-t-0 p-6 md:p-10 animate-step-slide-in"
             role="region" aria-labelledby="step-title">
      {renderStep()}
    </section>
  </div>

  <Footer />
</main>
```

**Transições entre steps**: simples — key do `<section>` troca (`key={currentStep}`) e Tailwind re-anima `step-slide-in`. Para saída suave, usar pattern Portal/Transition do shadcn (opcional v2).

---

### 2.2 `CheckoutStepper`

Stepper horizontal responsivo.

**Props**:
```ts
interface CheckoutStepperProps {
  steps: StepDef[];                 // 4 fixos (ver types abaixo)
  currentIndex: number;             // 0..3
  states: StepState[];              // ['skipped' | 'done' | 'active' | 'pending'][]
  onGoToStep?: (index: number) => void;  // quando clicável
}

type StepState = 'skipped' | 'done' | 'active' | 'pending';

interface StepDef {
  id: 'register' | 'cart' | 'pix' | 'success';
  label: string;       // "1. Cadastro"
  sub: string;         // "dados essenciais"
  icon: LucideIcon;    // UserRound / ShoppingCart / QrCode / PartyPopper
}
```

**Lógica de clicabilidade**:
- `active` → botão (sem-op ou toggle de drawer no mobile).
- `done` → botão, volta ao step se backend permitir (no caso do checkout, `register` e `cart` sim; `pix` não retroage; `success` é terminal).
- `skipped` → span, aria-label explicativo.
- `pending` → span com `aria-disabled="true"`.

**Variante**:
- Desktop (`lg:flex`): conforme mockup — 4 colunas + trilha.
- Mobile (`lg:hidden`): barra compacta com 4 dots + label textual "Etapa 2 de 4 · Carrinho".

**Sticky behavior**:
- Desktop: `sticky top-0 z-20` em `CheckoutWizardShell`'s container.
- Mobile: não-sticky (evita competir com CTA sticky bottom da etapa 2).

---

### 2.3 `RegisterStep` (substitui `AuthGateStep`)

3 modos renderizados internamente, decididos por `useCheckoutWizard`:

| Modo | Quando | Comportamento |
|------|--------|---------------|
| `register-new` | `!isAuthenticated` | Formulário completo (Nome, E-mail, Telefone, CPF, Senha, Confirmar) + link "Já tem conta? Entrar" (troca para modo `login-inline`). |
| `login-inline` | usuário clicou em "Já tem conta?" | `<LoginForm>` do nauth-react + link "Criar conta" que volta ao `register-new`. |
| `complete-profile` | `isAuthenticated && (!user.cpf || !user.phone)` | Form reduzido apenas com os campos faltantes + headline "Complete seu cadastro". Usa `useUpdateUser()` do nauth-react. |

**Nunca aparece** quando `isAuthenticated && user.cpf && user.phone` — `useCheckoutWizard` marca step 0 como `skipped` e renderiza `CartStep` diretamente.

**Importante sobre senha**: `RegisterForm` do nauth-react **exige** senha. Mantemos senha + confirmação visíveis. A pedido original ("apenas Nome/E-mail/Telefone/CPF") NÃO é tecnicamente viável sem alterar o nauth-react — documentado aqui. Alternativa futura: gerar senha temporária no backend + enviar por e-mail; até lá, senha é explícita.

**Validações inline** (debounced 300ms):
- E-mail: regex + `onBlur` check de disponibilidade (endpoint `GET /users/check-email?email=` — **MOCK** se ainda não existir).
- CPF: máscara `000.000.000-00` + algoritmo de dígitos verificadores (já existe em `utils/validators`? — confirmar).
- Telefone: máscara `(00) 00000-0000`.

**DOM resumido** (modo `register-new`):
```html
<header class="mb-8">
  <p class="text-[10px] uppercase tracking-[0.26em] text-fortuno-gold-intense font-semibold">Etapa 01</p>
  <h2 id="step-title" class="font-display italic font-bold text-3xl md:text-4xl mt-1">Crie sua conta Fortuno</h2>
  <p class="text-sm text-fortuno-black/60 mt-2">Seus bilhetes ficam protegidos na sua conta — só você acessa.</p>
</header>
<form class="grid md:grid-cols-2 gap-5 max-w-3xl">
  <!-- 6 campos: nome, email, tel, cpf, senha, confirmar -->
  <!-- + checkbox Termos LGPD (span 2) -->
</form>
<footer class="flex items-center justify-between mt-10 pt-6 border-t border-fortuno-gold-intense/15">
  <p class="text-[11px] text-fortuno-black/50"><Lock /> Dados criptografados · LGPD</p>
  <button class="cta-gold" type="submit">Continuar para o carrinho <ArrowRight /></button>
</footer>
```

Prize bar topo (reforço de desejo) só aparece em `register-new` e `login-inline` (no `complete-profile` o foco é finalizar).

---

### 2.4 `CartStep`

Coração da conversão. Layout 2 colunas.

**Props**: nenhuma. Consumo interno:
- `useCheckout()` — `quantity`, `pickedNumbers`, `mode`, `referralCode`, `startPayment()`, `addPickedNumber`, `removePickedNumber`, `clearPickedNumbers`.
- `useLottery()` — `currentLottery` (nome, preço, range, imagens).
- `useLotteryCombo()` — combo ativo (nome, percentual de desconto) vindo da rota anterior (via query `?combo=silver`).

**Cálculo de itens exibidos**:
```ts
const random = quantity - pickedNumbers.length;
const items: CartItem[] = [
  ...(random > 0 ? [{ kind: 'random', count: random, subtotal: random * unitPrice }] : []),
  ...pickedNumbers.map(n => ({ kind: 'manual', number: n, subtotal: unitPrice })),
];
```

**DOM**:
```html
<div class="grid lg:grid-cols-[1.55fr_1fr] gap-8">

  <!-- ESQUERDA -->
  <div>
    <header class="mb-5 flex items-baseline justify-between">
      <div>
        <p class="text-[10px] uppercase tracking-[0.26em] text-fortuno-gold-intense">Etapa 02</p>
        <h2 class="font-display italic font-bold text-3xl md:text-4xl">Seus bilhetes</h2>
      </div>
      <p class="text-xs text-fortuno-black/55">
        <strong>{pickedNumbers.length + random}</strong> de <strong>{quantity}</strong> bilhetes
      </p>
    </header>

    <div role="list" aria-label="Itens do carrinho">
      {random > 0 && <CartBilletItem kind="random" count={random} unitPrice={price} />}
      {pickedNumbers.map(n =>
        <CartBilletItem kind="manual" number={n} unitPrice={price}
                        onRemove={() => removePickedNumber(n)} />
      )}
    </div>

    <div class="mt-5 flex items-center justify-between flex-wrap gap-3">
      <button type="button" class="cta-ghost-gold" onClick={openChooseModal}
              disabled={pickedNumbers.length >= quantity}>
        <Plus /> Escolher um número específico
      </button>
      <p class="text-[11px] text-fortuno-black/50"><Info /> Cada número escolhido reduz 1 aleatório.</p>
    </div>
  </div>

  <!-- DIREITA (sticky) -->
  <aside class="lg:sticky lg:top-[88px] lg:self-start space-y-5">
    <CheckoutPrizeThumb lottery={currentLottery} />
    <Receipt items={items} combo={combo} total={total} />  <!-- reuso lottery-detail -->
    <button class="cta-gold w-full text-[17px] min-h-[56px]" onClick={handleConfirm}>
      <ShieldCheck /> Confirmar compra
    </button>
    <TrustSeals />   <!-- reuso home -->
  </aside>
</div>

<ChooseNumberModal open={...} onClose={...} onConfirm={addPickedNumber} />
```

**`handleConfirm`**: chama `checkout.startPayment()` (já implementado — devolve `qrCode` e avança para `payment`).

---

### 2.5 `CartBilletItem`

Linha de bilhete.

**Props**:
```ts
type CartBilletItemProps =
  | { kind: 'random'; count: number; unitPrice: number }
  | { kind: 'manual'; number: number; unitPrice: number; onRemove: () => void };
```

**Variantes visuais**: ver classes em `tokens.md §4 — Carrinho`. `kind='random'` sem botão remove; `kind='manual'` com.

**Animação de entrada**: ao montar, `animate-billet-slide-in` (320ms). Ao desmontar, apenas fade-out via Tailwind (adicionar `data-leaving="true"` em um wrapper AnimatePresence do shadcn não é necessário — CSS puro é suficiente).

**Formato do número**: usar `formatComposed(n, lottery.numberType)` (já existe em `utils/numberFormat.ts`). Exibido dentro de `<span class="numeral">` com Playfair italic + gradient.

---

### 2.6 `ChooseNumberModal`

**Decisão do designer**: **modal dedicado** (não inline).

**Justificativa**:
1. O range do Fortuno pode ser grande (até 99999 ou mais) — input com validação precisa de respiro.
2. O campo precisa de `inputMode="numeric"` + máscara + feedback inline "Número já comprado/escolhido/fora do intervalo". Inline comprometeria o fluxo visual da lista.
3. Reusa o padrão `Modal` já existente em `lottery-detail` (skill `react-modal` + Radix Dialog) — consistência de sistema.
4. Focus trap + Escape + retorno de foco são "grátis" com o Modal primitivo.
5. Mobile: modal ocupa quase fullscreen sem competir com a sticky summary bar.

**Base técnica**: `Modal` primitivo já criado (presumivelmente em `src/components/common/Modal.tsx`). Se ainda não existir, criar via `/react-modal`.

**Props**:
```ts
interface ChooseNumberModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (n: number) => void;
  lottery: Lottery;
  alreadyPicked: number[];   // checkout.pickedNumbers
  // alreadyBought virá do backend (próx linha)
}
```

**Validações** (ordem):
1. Vazio → botão Adicionar disabled.
2. Formato inválido (não-numérico no modo Int64; dezenas não no formato `XX-XX-XX` no modo composed) → erro inline.
3. Fora do range `[ticketNumIni, ticketNumEnd]` → erro "Fora do intervalo".
4. Já escolhido por você → erro "Você já escolheu este número".
5. Já comprado (endpoint `GET /lotteries/{id}/numbers/{n}/available` — **MOCK**: retornar `true` sempre até o endpoint existir; registrar em `MOCKS.md`) → erro "Número indisponível".

Sucesso: `onConfirm(n)` + fecha modal + `CartBilletItem` novo entra com `billet-slide-in`.

**Acessibilidade**: `aria-live="polite"` no bloco de feedback. `input` mantém foco após erro. Botão Adicionar recebe foco após sucesso de validação (antes do clique).

---

### 2.7 `PixStep` (substitui `PaymentStep`)

Layout 2 colunas desktop (QR esquerda / instruções direita), stack vertical mobile.

**Props**: nenhuma. Consumo:
- `useCheckout()` — `qrCode`, `startPayment`, `setPaymentResult`.
- `useQRCodePolling(invoiceId)` (já existe).
- `ticketService.simulatePayment(invoiceId)` (já existe — só em DEV).

**Lógica preservada** do `PaymentStep.tsx` atual (startPayment no mount, polling, handle de estados). O que muda é exclusivamente o layout + reuso do `CopyableCode` (já existe) + reuso do `CountdownTimer` (renomear usage para `CountdownClock` se componente for o mesmo de `lottery-detail`).

**Novo comportamento**: countdown < 2min entra em modo crítico (`animate-countdown-blink` + `text-[color:var(--countdown-critical)]`). `aria-live="assertive"` anuncia "2 minutos restantes" uma vez.

**Pi Simulator**: `PiSimulatorButton` já existe — mover para bloco separado com eyebrow "Somente em desenvolvimento", oculto por `import.meta.env.DEV`.

**DOM**: ver mockup Estado 3. Valor total renderizado com `GoldNumeral` (reuso home) ou inline com as classes do §4 PIX.

---

### 2.8 `SuccessStep` (refatorado)

Celebratório. Ornamento + confete + grid de bilhetes + CTAs + share + trust.

**Props**: nenhuma. Consumo:
- `useCheckout()` — `tickets` (populado por `setPaymentResult`).
- `useLottery()` — `currentLottery` (nome + `nextRaffleDate`).

**Disparo do confete**: 10 `<span class="confetti-piece">` + `useEffect` de mount que remove depois de 2s. Só dispara se `!prefers-reduced-motion` (via `useMediaQuery('(prefers-reduced-motion: reduce)')`).

**Tickets exibidos**: `.slice(0, 9)` com grid 3×3 desktop. Se houver mais que 9, adicionar card-ghost `"+N bilhetes..."` linkado para `/meus-numeros`.

**Share**: botões WhatsApp (`https://wa.me/?text=`) e "Copiar link" (`navigator.clipboard.writeText`) — usar `sonner` para toast de confirmação.

**DOM**: ver mockup Estado 4.

---

### 2.9 `TicketMiniCard`

Card de bilhete gerado.

**Props**:
```ts
interface TicketMiniCardProps {
  number: number;           // 42
  lotteryName: string;      // "Porsche 911 · #012"
  raffleDate: Date;         // próxima data de sorteio
  kind: 'random' | 'manual';
  numberType: NumberType;   // para formatação
}
```

Renderização: ver classes `tokens.md §4 — Sucesso — Ticket mini`.

---

### 2.10 `CheckoutPrizeThumb`

Wrapper leve sobre o padrão "palco compacto" da `lottery-detail`, em escala reduzida (aspect 16:9 / altura ~180-220px).

**Props**:
```ts
interface CheckoutPrizeThumbProps {
  lottery: Lottery;    // usa lottery.imageUrl e lottery.name
}
```

Reusa todas as classes do `stage-compact-*` de `lottery-detail/tokens.md`, só limitando `max-h-[220px]`.

---

## 3. Hook de orquestração: `useCheckoutWizard`

**Contrato**:
```ts
interface UseCheckoutWizardReturn {
  steps: StepDef[];                   // sempre 4 items
  states: StepState[];                // sempre 4 items, alinhados a steps
  currentIndex: number;               // 0..3
  currentStepId: StepId;              // derivado de currentIndex
  goToStep: (index: number) => void;  // respeita permissões
  canGoTo: (index: number) => boolean;
}
```

**Lógica de `states`** (derivada em cada render):
```ts
// step 0: register
const user = useUser();
const { isAuthenticated } = useAuth();
const profileComplete = isAuthenticated && !!user?.cpf && !!user?.phone;
const registerState: StepState =
  profileComplete ? 'skipped'
  : currentStepId === 'register' ? 'active'
  : /* já passamos por ela */ 'done';

// step 1: cart
const cartState = currentStepId === 'cart' ? 'active'
               : ['pix','success'].includes(currentStepId) ? 'done'
               : !profileComplete && currentStepId === 'register' ? 'pending'
               : /* autenticado completo, mas ainda não clicou confirmar */ 'active';
// (se profileComplete && currentStepId === 'register' — redirecionar automaticamente para 'cart')

// step 2: pix
const pixState = currentStepId === 'pix' ? 'active'
              : currentStepId === 'success' ? 'done'
              : 'pending';

// step 3: success
const successState = currentStepId === 'success' ? 'active' : 'pending';
```

**`goToStep(index)`**: chama `checkout.goToStep(id)` só se `canGoTo(index)`:
- Voltar sempre permitido entre `register` ↔ `cart`.
- Voltar de `pix` → `cart` permitido APENAS se `qrCode` ainda não gerado OU se já expirou.
- Não permitido voltar de `success` (render `cta-ghost-noir` externos como "Ver meus bilhetes" / "Voltar para sorteios").

**Auto-skip de `register`**: `useEffect` que, ao montar com `profileComplete && currentStepId === 'register'`, chama `goToStep(1)` imediatamente.

**Persistência**: `CheckoutContext` já persiste `currentStep` em sessionStorage — reaproveitar. Ao skipar `register`, persistir direto em `cart`.

---

## 4. Contratos de dados externos

Todos já existem no projeto:

| Hook / Service | Uso |
|----------------|-----|
| `useAuth()` (nauth-react) | `isAuthenticated` |
| `useUser()` (nauth-react) | `user.name`, `user.email`, `user.cpf`, `user.phone` |
| `useUpdateUser()` (nauth-react) | modo `complete-profile` — `mutate({ cpf, phone })` |
| `useCheckout()` | state completo do checkout (ver `CheckoutContextType`) |
| `useLottery()` | `currentLottery`, `loadById(id)` |
| `useLotteryCombo()` | combo ativo (se `?combo=silver` vier da URL) |
| `useQRCodePolling(invoiceId)` | poll até `Paid` / `Expired` |
| `useTicket()` | opcional — listar tickets criados como fallback |
| `ticketService.createQrCode` | chamado por `checkout.startPayment()` |
| `ticketService.simulatePayment` | DEV — `PiSimulatorButton` |

**Endpoints inexistentes (candidatos a MOCK)**:
1. `GET /users/check-email?email=` — validação de disponibilidade inline no `RegisterStep` modo `register-new`. Se não existir, **pular** a validação e confiar no erro do submit. Registrar em `MOCKS.md` como `// MOCK: aguarda endpoint /users/check-email`.
2. `GET /lotteries/{id}/numbers/{n}/available` — usado pelo `ChooseNumberModal` para checagem de número já comprado. Se não existir, **assumir disponível** (o backend rejeita no submit). Registrar em `MOCKS.md`.
3. Campo `lottery.nextRaffleDate` no `TicketMiniCard` — confirmar se vem de `useLottery` ou de `useRaffle`. Se não houver, usar `currentLottery.drawDate` ou string fixa "Em breve".

---

## 5. Responsivo & atalhos

### Breakpoints
- `<640px` (mobile): todas as etapas em coluna única. Stepper compacto (dots). CTA confirmar sticky bottom na etapa 2 (usar `--sticky-cta-bg` já existente). QR card reduz a 260×260px na etapa 3. Grid de bilhetes etapa 4 em 1 coluna.
- `640–1023px` (tablet): etapa 1 em 2 colunas. Etapa 2 ainda em 1 coluna (receipt abaixo da lista). Etapa 4 em 2 colunas.
- `≥1024px` (desktop): layouts descritos no mockup.

### Atalhos de teclado
- `Enter` dentro do input do `ChooseNumberModal`: adicionar número (se válido).
- `Escape` em qualquer modal: fechar.
- `Tab`/`Shift+Tab`: navega stepper → conteúdo → footer linearmente.
- Na etapa 2, `Delete`/`Backspace` com foco em `CartBilletItem` manual: aciona `onRemove` (com confirm via toast `sonner` que desfaz em 4s).

### Animações
- `step-slide-in` ao entrar em cada step.
- `hmarker-breath` no marcador ativo.
- `billet-slide-in` em novo bilhete manual.
- `countdown-blink` em modo crítico.
- `confetti-fall` na etapa 4 (somente mount, ~2s).
- Todas desligam com `prefers-reduced-motion`.

---

## 6. Lógica de skip da Etapa 1 (decisão do designer)

| Estado do usuário | Step 0 (register) | Primeira tela renderizada |
|-------------------|-------------------|---------------------------|
| `!isAuthenticated` | `active` (modo `register-new`) | Formulário completo |
| `isAuthenticated && !user.cpf` | `active` (modo `complete-profile`) | Form reduzido (CPF + Phone se faltar) |
| `isAuthenticated && !user.phone && user.cpf` | `active` (modo `complete-profile`) | Form reduzido (Phone) |
| `isAuthenticated && user.cpf && user.phone` | `skipped` | `CartStep` direto |

**Comportamento visual** do step 0 em `skipped`:
- Opacity 38% no marker + label.
- Ícone troca de `UserRound` → `UserCheck` (Lucide).
- `aria-label="Etapa de cadastro pulada — perfil já completo"`.
- Não clicável (usuário não deve editar perfil aqui; isso é no dashboard).

---

## 7. Comportamento de transição entre steps

| De → Para | Gatilho | Comportamento |
|-----------|---------|---------------|
| `register` → `cart` | Submit do form válido | `step-slide-in` + toast `sonner` "Bem-vindo(a)!" |
| `cart` → `pix` | Clique "Confirmar compra" | `startPayment()` → `qrCode` pronto → step 2 marcado `done` + `check-pop` no marker, step 3 active com `hmarker-breath`. CTA vira loading enquanto gera o QR. |
| `pix` → `success` | Polling retorna `Paid` | Marker 3 → `done` com `check-pop`; marker 4 → `active`; disparar confete ao entrar. Toast celebratório ouro "Pagamento confirmado". |
| `pix` → `cart` | Countdown expirou ou usuário clicou "Cancelar compra" | Resetar `qrCode`, voltar para `cart` com toast de aviso. |
| `success` → (externo) | Links `/meus-numeros` ou `/sorteios` | Limpar checkout (`checkout.reset()`) antes de navegar. |

---

## 8. Integração com shadcn/ui

O projeto já usa shadcn/ui (via `tailwindcss-animate`). Composições sugeridas:

| Nosso componente | shadcn composition |
|------------------|---------------------|
| `ChooseNumberModal` | `Dialog` + `DialogContent` + `DialogHeader` + `Input` + `Button` customizados com classes do design |
| Inputs de `RegisterStep` | shadcn `Input` + `Label` + classe `field` customizada (ver `tokens.md`) |
| `CheckoutStepper` | custom — shadcn não tem stepper pronto. Usar `<nav><ol>` + `<button>` nativos (HTML semântico > componente) |
| Toasts (sucesso/erro) | já usa `sonner` (confirmado no projeto) |
| Tooltip "Cada número escolhido reduz 1 aleatório" | shadcn `Tooltip` |
| Feedback de validação CPF/email | inline `<span class="field-error">` — não usar shadcn `FormMessage` pq o form aqui não usa react-hook-form obrigatoriamente (deixar a cargo do dev) |

---

## 9. MOCKs esperados (registrar em `MOCKS.md` da raiz)

```
// MOCK: aguarda endpoint GET /users/check-email?email= — bloqueia validação inline de e-mail no RegisterStep
// MOCK: aguarda endpoint GET /lotteries/{id}/numbers/{n}/available — bloqueia validação de "número já comprado" no ChooseNumberModal
// MOCK: nextRaffleDate inferido de lottery.drawDate — se inexistente, exibir "Em breve" no TicketMiniCard
```

Adicionais (opcional, caso valor do PIX não venha embedded no `qrCode`):
- Valor formatado `formatBRL(lottery.ticketPrice * quantity * (1 - combo.discount))` — calcular client-side enquanto o backend não expuser.

---

## 10. Checklist de handoff (frontend-react-developer)

- [ ] Criar pasta `src/pages/checkout/steps/` e mover/renomear arquivos conforme §1.
- [ ] Criar `src/pages/checkout/components/` com os 5 componentes de apoio.
- [ ] Criar `src/pages/checkout/hooks/useCheckoutWizard.ts` (orquestrador).
- [ ] Anexar blocos CSS de `design/checkout/tokens.md` §2 em `src/styles/tokens.css`.
- [ ] Anexar merge de `tailwind.config.js` de `tokens.md` §3.
- [ ] Remover `QuantityStep.tsx` + referência no `CheckoutContext.CheckoutStep` (tipo vira `'register' | 'cart' | 'pix' | 'success'`).
- [ ] Ajustar `CheckoutContext.initialStep` para `'register'` (alinhar com novo fluxo).
- [ ] Registrar MOCKs em `MOCKS.md`.
- [ ] Validar a11y: Axe no dev tools, contraste, teclado.
- [ ] Validar `prefers-reduced-motion` (forçar em DevTools → Rendering).
- [ ] Validar responsivo em 375px, 768px, 1280px, 1920px.
- [ ] Smoke test: checkout completo fim-a-fim com `simulatePayment` em DEV.

---

## 11. Referências cruzadas

- `design/wizard-vertical/{tokens.md, spec.md, mockup.html}` — base de marcadores/animação/focus ring.
- `design/home/{tokens.md, spec.md, mockup.html}` — `GoldNumeral`, `TrustSeals`, `live-pulse`, ornamento art-déco do FraudCertificate.
- `design/dashboard/{tokens.md, spec.md, mockup.html}` — body claro, cards paper, topbar global, footer band.
- `design/lottery-detail/{tokens.md, spec.md, mockup.html}` — `Receipt`, `Modal` família, `ComboPackCard`, "palco compacto".
- `design/checkout/mockup.html` — preview dos 4 estados + modal still.
- `design/checkout/tokens.md` — tokens novos + class map completo.
