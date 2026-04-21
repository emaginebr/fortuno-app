---
description: "Task list for feature 001-fortuno-frontend"
---

# Tasks: Fortuno — Frontend Público, Autenticado e Administrativo

**Input**: Design documents from `/specs/001-fortuno-frontend/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-endpoints.md, quickstart.md

**Tests**: `spec.md` não requisitou TDD. Tasks de teste unitário foram incluídas na Phase 10 (Polish) apenas para os fluxos críticos identificados em `research.md#R-13`.

**Organization**: Tasks são agrupadas por user story (US1..US5) conforme priorizadas na spec.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências por completar)
- **[Story]**: Qual user story (US1..US5)
- Caminhos absolutos no projeto `C:\repos\Fortuno\fortuno-app\`

## Path Conventions

Projeto SPA frontend-only — repo root é `fortuno-app/`. Todos os caminhos abaixo são relativos a essa raiz (ex.: `src/Contexts/LotteryContext.tsx`). Casing inviolável: `Contexts/`, `Services/` (uppercase); `hooks/`, `types/` (lowercase) — Constituição, Princípio III.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicializar o projeto Vite, instalar dependências, configurar Tailwind + tokens de marca, testes e variáveis de ambiente.

- [X] T001 Bootstrap do projeto Vite + React + TS na raiz `fortuno-app/` com `npm create vite@latest . -- --template react-ts`; limpar boilerplate (remover `src/App.css`, `src/assets/react.svg`, exemplos) preservando `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`.
- [X] T002 Atualizar `package.json` com os scripts definidos em `quickstart.md#Scripts` (`dev`, `build`, `preview`, `test`, `test:ui`, `test:coverage`, `lint`, `typecheck`).
- [X] T003 Instalar dependências runtime: `npm install react-router-dom nauth-react i18next react-i18next sonner react-markdown remark-gfm jspdf keen-slider qrcode.react`.
- [X] T004 Instalar dependências Tailwind: `npm install -D tailwindcss postcss autoprefixer tailwindcss-animate` e rodar `npx tailwindcss init -p` para gerar `tailwind.config.js` e `postcss.config.js`.
- [X] T005 Instalar dependências de testes: `npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event msw jsdom @vitest/coverage-v8`.
- [X] T006 Instalar dev tooling de lint/format: `npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y prettier`.
- [X] T007 [P] Criar `vitest.config.ts` com `environment: 'jsdom'`, `setupFiles: ['./src/test-setup.ts']`, aliases do `vite.config.ts` e coverage v8 exclude para `src/pages/auth/**` (wrappers triviais de nauth-react).
- [X] T008 [P] Criar `src/test-setup.ts` importando `@testing-library/jest-dom` e expondo `beforeAll/afterEach/afterAll` do `msw/node` (server vazio — handlers por suite).
- [X] T009 [P] Criar `.eslintrc.json` habilitando `@typescript-eslint`, `react`, `react-hooks`, `jsx-a11y`, com regras Constitution-aligned (`@typescript-eslint/consistent-type-definitions: ['error', 'interface']`).
- [X] T010 [P] Criar `.prettierrc` com `semi: true, singleQuote: true, trailingComma: 'all', printWidth: 100`.
- [X] T011 Criar `.env.development` e `.env.production.example` com as variáveis listadas em `quickstart.md#Variáveis de ambiente` (`VITE_API_URL`, `VITE_FORTUNO_TENANT_ID`, `VITE_FORTUNO_STORE_ID`, `VITE_NAUTH_API_URL`, `VITE_NAUTH_TENANT`, `VITE_SITE_BASENAME`, `VITE_WHATSAPP_URL`, `VITE_INSTAGRAM_URL`, `VITE_CONTACT_EMAIL`).
- [X] T012 Atualizar `src/vite-env.d.ts` declarando a interface `ImportMetaEnv` com todas as variáveis `VITE_*` acima (TypeScript autocomplete).
- [X] T013 Criar `public/logo-light.png` e `public/logo-dark.png` copiando respectivamente `assets/Fortuno-branca-transparente.png` e `assets/Fortuno-preta-transparente.png` (cp/copy na inicialização do repo).
- [X] T014 [P] Criar `public/favicon.ico` a partir de `assets/Fortuno-preta-transparente.png` (redimensionar para 32×32, 16×16 multi-ícone — ferramenta manual do designer ou script `sharp`).
- [X] T015 Atualizar `index.html`: definir `<title>Fortuno — Loteria Online</title>`, meta description, `<link rel="icon" href="/favicon.ico">`, lang `pt-BR`.
- [X] T016 Criar `MOCKS.md` na raiz com template vazio (seção "Endpoints mocked", "Descrição", "Item de acompanhamento") — arquivo populado sob demanda conforme regra R-15.

**Checkpoint**: projeto roda com `npm run dev` em `http://localhost:5173` mostrando página padrão Vite.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura compartilhada por todas as user stories — design tokens, API helper, i18n, enums, provider chain e layout shell. **Nenhuma user story pode começar antes deste checkpoint.**

### Design tokens e Tailwind

- [X] T017 Criar `src/styles/tokens.css` declarando as 6 cores de marca como CSS variables em `:root`: `--fortuno-green-deep: #0A2A20`, `--fortuno-green-elegant: #134436`, `--fortuno-gold-intense: #B8963F`, `--fortuno-gold-soft: #D4AF37`, `--fortuno-black: #0B0B0B`, `--fortuno-offwhite: #ECE8E1`, conforme `research.md#R-17`.
- [X] T018 Criar `src/styles/index.css` com `@tailwind base; @tailwind components; @tailwind utilities;` e `@import './tokens.css';`; importar em `src/main.tsx` no topo junto com `import 'nauth-react/styles'`.
- [X] T019 Atualizar `tailwind.config.js`: `darkMode: ['class']`, `content: ['./index.html', './src/**/*.{ts,tsx}', './node_modules/nauth-react/dist/**/*.{js,ts,jsx,tsx}']`, `plugins: [require('tailwindcss-animate')]`, `theme.extend.colors.fortuno` mapeando os tokens via `var(--fortuno-*)` (ex.: `green: { deep: 'var(--fortuno-green-deep)', elegant: 'var(--fortuno-green-elegant)' }, gold: { intense: ..., soft: ... }`).

### Enums e types compartilhados

- [X] T020 [P] Criar `src/types/enums.ts` com os enums `LotteryStatus`, `NumberType`, `TicketOrderMode`, `TicketRefundState`, `TicketOrderStatus`, `RaffleStatus` conforme `data-model.md#Enums`.

### API helper (SINGLE SOURCE OF TRUTH do header X-Tenant-Id)

- [X] T021 Criar `src/Services/apiHelpers.ts` exportando: constante `API_BASE_URL = import.meta.env.VITE_API_URL`, função `getHeaders(authenticated = false): HeadersInit` que sempre adiciona `X-Tenant-Id` (de `VITE_FORTUNO_TENANT_ID`) + `Content-Type: application/json` e, quando `authenticated=true`, lê o token NAuth do storage via `readNAuthToken()` e adiciona `Authorization: Bearer ${token}`. Função `readNAuthToken()` localiza a chave usada pelo `NAuthProvider` em `localStorage` (inspecionar `nauth-react` em runtime; fallback para leitura via `useAuth()` quando chamado de hooks). Classe `UnauthenticatedError extends Error`. Função `handleResponse<T>(res: Response): Promise<T>` que extrai `ApiResponseGeneric<T>` (chaves `sucesso`, `mensagem`, `erros`, `data`) e lança ou retorna `data`.
- [X] T022 Criar `src/hooks/useTenantHeader.ts` — hook pequeno que retorna `{ headers: getHeaders(authenticated) }`, usado em components que precisam chamar API em handler async pontual sem criar service.

### i18n

- [X] T023 Criar `src/i18n/index.ts`: instancia i18next, carrega `createNAuthI18nInstance` com `ptTranslations` de `nauth-react`, adiciona namespace `fortuno` com import dinâmico de `./locales/pt/fortuno.json`; idioma padrão `pt-BR`.
- [X] T024 [P] Criar `src/i18n/locales/pt/fortuno.json` com chaves iniciais: `menu.home`, `menu.lotteries`, `menu.myNumbers`, `menu.about`, `menu.contact`, `cta.buyNow`, `cta.buy`, `checkout.generatingQr`, `checkout.chooseNumbers`, `checkout.fillRandomRest`, `dashboard.myReferralCode`, `wizard.step1`..`wizard.step8`, `common.loading`, `common.error`.

### Provider chain e rotas

- [X] T025 Reescrever `src/main.tsx` com a provider chain exata definida em `quickstart.md#Ordem 4`: `React.StrictMode → BrowserRouter(basename=VITE_SITE_BASENAME) → NAuthProvider(config: { apiUrl: VITE_NAUTH_API_URL, tenant: VITE_NAUTH_TENANT }) → <App />`. Providers de entidade ficam vazios aqui — cada entidade adiciona seu Provider conforme seus tasks de US; **ordem documentada como comentário `// Ordem de providers: Commission → Referral → Ticket → RaffleAward → Raffle → LotteryImage → LotteryCombo → Lottery → Checkout`**.
- [X] T026 Reescrever `src/App.tsx`: `<Toaster richColors position="top-right" />` (sonner) + `<Routes>` com rotas vazias stub (elementos `<div>Coming soon</div>`) para **todas** as rotas da tabela `quickstart.md#Rotas`. Usar `<Route element={<AuthenticatedShell />}>` envolvendo rotas protegidas.
- [X] T027 Criar `src/components/route-guards/ProtectedRoute.tsx` usando `useProtectedRoute` do `nauth-react` com `redirectTo: '/login'` e preservação da rota original via `state.from`.
- [X] T028 [P] Criar `src/components/common/LoadingSpinner.tsx` — spinner centralizado, 48×48, cor `text-fortuno-gold-intense`.
- [X] T029 [P] Criar `src/components/common/ConfirmModal.tsx` — Dialog acessível (role=dialog, focus trap, ESC fecha), props `{ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, variant?: 'danger' | 'default' }`.
- [X] T030 [P] Criar `src/components/common/CopyableCode.tsx` — mostra um texto monospace com botão "Copiar" que dispara `toast.success('Código copiado')`; prop `value: string`.
- [X] T031 [P] Criar `src/components/common/CountdownTimer.tsx` — recebe `expiresAt: Date`, renderiza `mm:ss` com `setInterval(1000)`, emite evento `onExpire` ao chegar em 0, atualiza via `useState`+`useEffect`.
- [X] T032 [P] Criar `src/components/common/PiSimulatorButton.tsx` — botão fixed bottom-left 48×48 com símbolo π em SVG, `opacity-15 hover:opacity-50 transition`, prop `onTrigger: () => Promise<void>`; em clique dispara toast info "Simulador de pagamento acionado" + `await onTrigger()`.
- [X] T033 [P] Criar `src/utils/currency.ts` — `formatBRL(value: number): string` usando `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.
- [X] T034 [P] Criar `src/utils/numberFormat.ts` — `formatInt64(n: number): string` (milhar `.`) e `formatComposed(value: string | number, type: NumberType): string` (desagrega de 2 em 2 dígitos ordenado ascendente, separador `-`). Função `computePossibilities(type: NumberType, min: number, max: number, ticketIni?: number, ticketEnd?: number): number` retornando total de combinações (Int64: `end - ini + 1`; Composed*: `C(max - min + 1, composedSize)`).
- [X] T035 [P] Criar `src/utils/validators.ts` — re-exporta `validateEmail, validateCPF, validateCNPJ, validatePhone, validatePasswordStrength` de `nauth-react`; adiciona `validatePickedNumber(n: number, lottery: LotteryInfo): { valid: boolean; reason?: string }` (faixa + tipo).

### Layout shell

- [X] T036 Criar `src/components/layout/Header.tsx` — menu principal com 5 itens (Home/Sorteios/Meus Números/Quem Somos/Fale Conosco) via `<NavLink>`, logomarca (`/logo-dark.png` em fundo off-white, `/logo-light.png` em fundo verde via `className`), botão "Entrar" quando não autenticado (usa `useAuth`) e dropdown "Minha conta" quando autenticado (Dashboard, Meus Números, Meus Pontos, Alterar senha, Meus Dados, Sair).
- [X] T037 Criar `src/components/layout/Footer.tsx` — logo versão branca, links institucionais (Quem Somos, Fale Conosco, Regras Gerais), redes sociais via `VITE_INSTAGRAM_URL` / `VITE_WHATSAPP_URL`, CNPJ placeholder.
- [X] T038 Criar `src/components/layout/AuthenticatedShell.tsx` — wrapper com `<Header />`, `<Outlet />` em container responsivo, `<Footer />`; aplica `ProtectedRoute` implícito via routing.

**Checkpoint**: provider chain carregada, rotas stub acessíveis, layout shell renderiza com logomarca e paleta — nenhuma lógica de domínio ainda.

---

## Phase 3: User Story 1 - Comprar bilhete para sorteio em andamento (Priority: P1) 🎯 MVP

**Goal**: Permitir que um visitante navegue até uma loteria, selecione bilhetes (aleatórios ou manuais), pague via PIX (QR Code + polling) e receba a lista dos bilhetes comprados.

**Independent Test**: acessar `/sorteios`, entrar em uma loteria, clicar "Comprar", escolher 5 bilhetes aleatórios (com login via US2 já ativo), confirmar geração de QR Code, clicar no símbolo π, aguardar polling confirmar pagamento e ver a lista de 5 bilhetes na tela final.

### Types e Services (via skill `/react-architecture` quando possível)

- [X] T039 [P] [US1] Criar `src/types/lottery.ts` com `LotteryInfo`, `LotteryInsertInfo`, `LotteryUpdateInfo`, `LotteryCancelRequest` conforme `data-model.md#Lottery`.
- [X] T040 [P] [US1] Criar `src/types/lotteryCombo.ts` com `LotteryComboInfo`, `LotteryComboInsertInfo`, `LotteryComboUpdateInfo`.
- [X] T041 [P] [US1] Criar `src/types/lotteryImage.ts` com `LotteryImageInfo`, `LotteryImageInsertInfo`, `LotteryImageUpdateInfo`.
- [X] T042 [P] [US1] Criar `src/types/raffle.ts` com `RaffleInfo`, `RaffleInsertInfo`, `RaffleUpdateInfo`, `RaffleWinnersPreviewRequest`, `RaffleWinnerPreviewRow`.
- [X] T043 [P] [US1] Criar `src/types/raffleAward.ts` com `RaffleAwardInfo`, `RaffleAwardInsertInfo`, `RaffleAwardUpdateInfo`.
- [X] T044 [P] [US1] Criar `src/types/ticket.ts` com `TicketInfo`, `TicketOrderRequest`, `TicketQRCodeInfo`, `TicketQRCodeStatusInfo`, `TicketSearchQuery`.
- [X] T045 [P] [US1] Criar `src/Services/lotteryService.ts` (classe + singleton) com métodos `getById`, `getBySlug`, `listByStore`, `listOpen` (FALLBACK: usa `listByStore(VITE_FORTUNO_STORE_ID)` filtrando `status === Open`; registrar `// MOCK: aguarda endpoint público de loterias abertas` e entrada em `MOCKS.md`), `create`, `update`, `publish`, `close`, `cancel` mapeando rotas de `contracts/api-endpoints.md#Lotteries`.
- [X] T046 [P] [US1] Criar `src/Services/lotteryComboService.ts` com `listByLottery`, `create`, `update`, `remove`.
- [X] T047 [P] [US1] Criar `src/Services/lotteryImageService.ts` com `listByLottery`, `create`, `update`, `remove`.
- [X] T048 [P] [US1] Criar `src/Services/raffleService.ts` com `getById`, `listByLottery`, `create`, `close`, `previewWinners`, `confirmWinners`.
- [X] T049 [P] [US1] Criar `src/Services/raffleAwardService.ts` com `listByRaffle`, `create`, `update`, `remove`.
- [X] T050 [P] [US1] Criar `src/Services/ticketService.ts` com `getById`, `listMine(query: TicketSearchQuery)`, `createQrCode(req: TicketOrderRequest)`, `getQrCodeStatus(invoiceId)`, `simulatePayment(invoiceId)` (com MOCK se endpoint não confirmado — `research.md#R-08`).
- [X] T051 [P] [US1] Criar `src/Services/pdfService.ts` com `downloadMarkdownAsPdf(markdown: string, filename: string): void` usando `jsPDF` (converter markdown → HTML simplificado → texto por linha; fontes Helvetica 11pt).

### Contexts e Hooks

- [X] T052 [US1] Criar `src/Contexts/LotteryContext.tsx` + `src/hooks/useLottery.ts` com estado `{ lotteries, currentLottery, openLotteries, loading, error }` e métodos `useCallback` (`loadById`, `loadBySlug`, `loadOpen`, `create`, `update`, `publish`, `close`, `cancel`, `clearError`). Seguir skill `/react-architecture`. Registrar `LotteryProvider` em `main.tsx`.
- [X] T053 [P] [US1] Criar `src/Contexts/LotteryComboContext.tsx` + `src/hooks/useLotteryCombo.ts`. Registrar provider em `main.tsx`.
- [X] T054 [P] [US1] Criar `src/Contexts/LotteryImageContext.tsx` + `src/hooks/useLotteryImage.ts`. Registrar provider em `main.tsx`.
- [X] T055 [P] [US1] Criar `src/Contexts/RaffleContext.tsx` + `src/hooks/useRaffle.ts`. Registrar provider em `main.tsx`.
- [X] T056 [P] [US1] Criar `src/Contexts/RaffleAwardContext.tsx` + `src/hooks/useRaffleAward.ts`. Registrar provider em `main.tsx`.
- [X] T057 [P] [US1] Criar `src/Contexts/TicketContext.tsx` + `src/hooks/useTicket.ts` com métodos `loadMine`, `createQrCode`, `getStatus`. Registrar provider em `main.tsx`.
- [X] T058 [US1] Criar `src/Contexts/CheckoutContext.tsx` + `src/hooks/useCheckout.ts` com estado `CheckoutState` (ver `data-model.md#Estado do checkout`), persistência em `sessionStorage` com chave `fortuno:checkout:{lotteryId}`, métodos `setQuantity`, `setMode`, `addPickedNumber`, `removePickedNumber`, `fillRandomRest`, `startPayment`, `pollStatus`, `reset`. Registrar provider em `main.tsx`.
- [X] T059 [US1] Criar `src/hooks/useQRCodePolling.ts` — recebe `invoiceId`, retorna `{ status, tickets, expired, error }`. Implementação: `setInterval` base 3s com backoff exponencial até 10s, cancela em cleanup, pausa quando `document.visibilityState === 'hidden'` (Page Visibility API), avança para `success` quando `status === TicketOrderStatus.Paid`, termina em erro para `Overdue | Cancelled | Expired`.

### Components

- [X] T060 [P] [US1] Criar `src/components/lottery/MarkdownView.tsx` — `react-markdown` + `remark-gfm`, classes Tailwind prose com paleta Fortuno.
- [X] T061 [P] [US1] Criar `src/components/lottery/LotteryImageCarousel.tsx` usando `keen-slider` com autoplay 5s, dots navegáveis, aria-label.
- [X] T062 [P] [US1] Criar `src/components/lottery/ComboSelector.tsx` — recebe `combos: LotteryComboInfo[]`, `ticketPrice`, `minQty`, `maxQty`; renderiza **3 colunas responsivas** (`grid-cols-1 md:grid-cols-3`); cada coluna é um cartão com combo name, range (`quantityStart–quantityEnd`), discount label e botão "Selecionar"; campo de input numérico para quantidade avulsa; calcula `pickCombo` e `computePrice` em tempo real.
- [X] T063 [P] [US1] Criar `src/components/lottery/RulesPdfButton.tsx` — props `{ title, markdown, filename }`; botão "Baixar PDF" chama `pdfService.downloadMarkdownAsPdf`.
- [X] T064 [P] [US1] Criar `src/components/tickets/TicketCard.tsx` — cartão estilizado como bilhete de loteria: fundo off-white, borda tracejada dourada (`border-dashed border-fortuno-gold-soft`), número grande em preto (tabular-nums), cabeçalho com nome da loteria e data, rodapé com ticket ID.

### Pages — público (Sorteios)

- [X] T065 [P] [US1] Criar `src/pages/public/LotteryListPage.tsx` — chama `useLottery().loadOpen()`, renderiza grid de cards com imagem principal, nome, prêmio total, botão "Ver sorteio" linkando para `/sorteios/:slug`; skeleton loading; mensagem vazia "Nenhum sorteio em andamento".
- [X] T066 [US1] Criar `src/pages/public/LotteryDetailPage.tsx` — route `/sorteios/:slug`. Carrega lottery por slug, renderiza `LotteryImageCarousel`, `MarkdownView(descriptionMd)`, dois `RulesPdfButton` (Regras e Política), `ComboSelector`, botão "Comprar" (`<button className="bg-fortuno-gold-intense text-fortuno-black">`) que atualiza `useCheckout().setQuantity()` e navega para `/checkout/:lotteryId`.

### Pages — Checkout (fluxo US1)

- [X] T067 [US1] Criar `src/pages/checkout/QuantityStep.tsx` — lê `currentStep`; exibe lottery info, seletor de quantidade (slider + input), preço atualizado via `useCheckout`; botão "Continuar" transiciona para `auth` (se não autenticado) ou `numbers` (se quiser escolher) ou `payment` (aleatório direto).
- [X] T068 [US1] Criar `src/pages/checkout/AuthGateStep.tsx` — quando `useAuth().isAuthenticated === false`, exibe `<LoginForm />` do `nauth-react` com callback de sucesso que retoma o checkout; quando autenticado mas perfil incompleto (checar CPF/telefone via `useUser`), exibe `<UserEditForm />` para completar antes de avançar; transiciona para escolha de números ou pagamento.
- [X] T069 [US1] Criar `src/pages/checkout/NumberSelectionStep.tsx` — pergunta "Deseja selecionar os números? Sim / Não". Se Não → `setMode(Random)` e avançar. Se Sim → exibe inputs adequados ao `numberType` (Int64: 1 input numérico; Composed*: N inputs de 2 dígitos), valida cada número com `validatePickedNumber` + chamada à API para conflito, adiciona à lista via `addPickedNumber`, botão "Pagar" habilita quando lista = quantidade, botão "Preencher o restante aleatoriamente" aciona `fillRandomRest`.
- [X] T070 [US1] Criar `src/pages/checkout/PaymentStep.tsx` — na entrada exibe `<LoadingSpinner /> "Gerando QR Code..."` enquanto `startPayment()` resolve; ao ter `qrCode`, renderiza `<img src={brCodeBase64 ?? fallback} alt="QR Code PIX" />`, `brCode` em `<code>` com `<CopyableCode />`, `<CountdownTimer expiresAt={qrCode.expiredAt} onExpire={...} />`, `<PiSimulatorButton onTrigger={() => ticketService.simulatePayment(invoiceId)} />`; conecta `useQRCodePolling(invoiceId)` e navega para `SuccessStep` quando `status=Paid`.
- [X] T071 [US1] Criar `src/pages/checkout/SuccessStep.tsx` — mensagem "Parabéns! Seus bilhetes foram gerados.", lista `TicketCard` para cada ticket de `state.tickets`, botões "Ver em Meus Números" (link) e "Voltar à Home".
- [X] T072 [US1] Criar `src/pages/checkout/CheckoutPage.tsx` (container) — wrapper que lê `useCheckout().currentStep` e renderiza o step correspondente; rota `/checkout/:lotteryId`.

### Home mínima (para US1 funcionar independente)

- [X] T073 [US1] Criar `src/pages/public/HomePage.tsx` STUB — mostra logomarca hero + botão "Ver sorteios" linkando para `/sorteios`. A versão completa (carousel + antifraude + segurança + CTA) vem em US5.

### Rotas e navegação

- [X] T074 [US1] Atualizar `src/App.tsx` conectando `HomePage`, `LotteryListPage`, `LotteryDetailPage`, `CheckoutPage` (com sub-steps internos via `useCheckout`) nas rotas `/`, `/sorteios`, `/sorteios/:slug`, `/checkout/:lotteryId`.

**Checkpoint**: fluxo completo de compra PIX funcional com autenticação via US2; US1 testável independentemente (ver Independent Test acima).

---

## Phase 4: User Story 2 - Autenticar e gerenciar a própria conta (Priority: P1)

**Goal**: oferecer todas as telas de autenticação e gestão de conta usando EXCLUSIVAMENTE os componentes do `nauth-react`.

**Independent Test**: `/cadastro` → preencher → submeter → redirecionado autenticado para `/dashboard`; `/login` → entrar → sessão persiste; `/esqueci-senha` → receber e-mail simulado; `/conta/alterar-senha` → trocar senha; `/conta/dados` → editar nome; em todas as chamadas de API feitas após, header `X-Tenant-Id: fortuno` presente.

### Pages (wrappers finos sobre nauth-react)

- [X] T075 [P] [US2] Criar `src/pages/auth/LoginPage.tsx` — wrapper em `<main className="min-h-screen flex items-center justify-center bg-fortuno-green-deep">` contendo `<LoginForm />` do `nauth-react` com callbacks `onSuccess` (navigate para `state.from || '/dashboard'`) e `onForgotPassword` (navigate para `/esqueci-senha`).
- [X] T076 [P] [US2] Criar `src/pages/auth/RegisterPage.tsx` com `<RegisterForm />`, `onSuccess` navegando para `/dashboard`.
- [X] T077 [P] [US2] Criar `src/pages/auth/ForgotPasswordPage.tsx` com `<ForgotPasswordForm />`.
- [X] T078 [P] [US2] Criar `src/pages/auth/ResetPasswordPage.tsx` com `<ResetPasswordForm />`; leitura do hash da query string `?hash=...`.
- [X] T079 [P] [US2] Criar `src/pages/auth/ChangePasswordPage.tsx` com `<ChangePasswordForm />`, protegida.
- [X] T080 [P] [US2] Criar `src/pages/auth/ProfileEditPage.tsx` com `<UserEditForm />`, protegida.

### Integração ao Header

- [X] T081 [US2] Atualizar `src/components/layout/Header.tsx`: usar `useAuth()` e `useUser()` para renderizar botão "Entrar" vs dropdown "Minha conta"; botão "Sair" chama `nauth-react`'s logout e navega para `/`.

### Ajuste do AuthGateStep do checkout

- [X] T082 [US2] Ajustar `src/pages/checkout/AuthGateStep.tsx` (criado em T068) para usar exatamente os componentes de US2; confirmar transição pós-login/registro para o próximo step do checkout preservando estado em `sessionStorage`.

**Checkpoint**: autenticação completa funcional via `nauth-react`, sem tela de auth custom. SC-007 atendido.

---

## Phase 5: User Story 3 - Dashboard e acompanhamento de participação (Priority: P2)

**Goal**: após login, entregar dashboard com contadores, `referralCode`, "Meus Números" (seletor de loteria, layout de bilhete, paginação, filtro) e "Meus Pontos" (indicações e comissões).

**Independent Test**: logar → `/dashboard` exibe `referralCode` copiável + 3 contadores; `/meus-numeros` permite escolher loteria, filtrar número, paginar; `/meus-pontos` exibe `referralCode`, `totalPurchases`, `totalToReceive` e lista de comissões.

### Types, Services, Contexts

- [X] T083 [P] [US3] Criar `src/types/referral.ts` com `ReferrerEarningsPanel`, `ReferrerLotteryBreakdown`.
- [X] T084 [P] [US3] Criar `src/types/commission.ts` com `LotteryCommissionsPanel`, `ReferrerCommission`.
- [X] T085 [P] [US3] Criar `src/Services/referralService.ts` com `getMyCode(): Promise<{ referralCode: string }>` (GET `/referrals/code/me`) e `getEarningsPanel(): Promise<ReferrerEarningsPanel>` (GET `/referrals/me`).
- [X] T086 [P] [US3] Criar `src/Services/commissionService.ts` com `listByLottery(lotteryId)` (GET `/commissions/lottery/{id}`).
- [X] T087 [US3] Criar `src/Contexts/ReferralContext.tsx` + `src/hooks/useReferral.ts`. Registrar provider em `main.tsx`.
- [X] T088 [US3] Criar `src/Contexts/CommissionContext.tsx` + `src/hooks/useCommission.ts`. Registrar provider em `main.tsx`.

### Pages

- [X] T089 [US3] Criar `src/pages/dashboard/DashboardPage.tsx` — rota `/dashboard`, carrega `referralCode` e painel via `useReferral`, carrega tickets via `useTicket().loadMine()` e loterias via `useLottery().loadOpen()` para calcular contadores. Layout: hero saudação com `CopyableCode(referralCode)`, 3 cards de contador (Tickets / Loterias / Pontos — cor dourada intensa), bloco "Loterias que administro" condicional (renderiza só se `useLottery` expuser `myOwnedLotteries.length > 0` — caso contrário `// MOCK: aguarda endpoint /lotteries/my-owned` e registrar), botão "Crie seu sorteio" (link `/meus-sorteios/novo`), atalhos para "Meus Números" e "Meus Pontos".
- [X] T090 [US3] Criar `src/pages/dashboard/MyNumbersPage.tsx` — rota `/meus-numeros`. Seletor de loteria (`<select>` com loterias do usuário, inferidas de `listMine`), input de busca por número (`ticketValue` LIKE), paginação client-side (page size 12), grid responsiva de `TicketCard`. Scroll-restore por filtro via `useSearchParams`.
- [X] T091 [US3] Criar `src/pages/dashboard/MyPointsPage.tsx` — rota `/meus-pontos`. Top: `CopyableCode(referralCode)`, 2 tiles `totalPurchases` e `formatBRL(totalToReceive)`; abaixo, tabela com a lista de `byLottery` (lottery / purchases / toReceive) e nota do backend (`panel.note`).

**Checkpoint**: painel pessoal completo, três rotas navegáveis, dados reais da API, fallback claro quando lottery list admin não existir.

---

## Phase 6: User Story 4 - Administrar os próprios sorteios via wizard (Priority: P2)

**Goal**: lista de "Meus Sorteios" com filtro por status e wizard de 8 etapas para criar/editar loterias.

**Independent Test**: `/meus-sorteios` → lista com filtro; `/meus-sorteios/novo` → percorrer 8 etapas com dados válidos → Step 8 → status = Open → aparece em `/sorteios`; editar a mesma loteria → wizard carrega com dados preenchidos; cancelar → modal exige motivo.

### MyLotteriesPage

- [X] T092 [US4] Criar `src/pages/dashboard/MyLotteriesPage.tsx` — rota `/meus-sorteios`. Carrega `useLottery().loadByStore(VITE_FORTUNO_STORE_ID)` filtrado por owner (enquanto não houver endpoint `/lotteries/my-owned`, usa store + campo `createdByUserId` se existir, senão `// MOCK`); ordena com `Open` primeiro; filtro por status (tabs); ações por linha: Editar (link), Publicar, Fechar, Cancelar (abre `ConfirmModal` com input `reason` obrigatório → chama `lotteryService.cancel`).

### Wizard shell e steps

- [X] T093 [US4] Criar `src/components/wizard/WizardShell.tsx` — props `{ steps: StepMeta[], currentIndex, onNext, onPrev, onJump, lotteryId? }`; renderiza barra de passos com números e títulos, botões Prev/Next, área do step atual via children, persiste `{ currentIndex, formState }` em `sessionStorage` com chave `fortuno:wizard:{lotteryId|new}`.
- [X] T094 [P] [US4] Criar `src/components/wizard/NumberCalculator.tsx` — props `{ numberType, min, max, ticketIni, ticketEnd }`; exibe em tempo real total de combinações (`computePossibilities`), exemplo de 3 números válidos, aviso quando `<lottery ticket max>` exceder total.
- [X] T095 [P] [US4] Criar `src/components/wizard/PdfUploadField.tsx` — input file aceitando PDF, upload via `lotteryImageService.create` (mesma rota para anexos — se divergir, registrar em `MOCKS.md`).
- [X] T096 [US4] Criar `src/pages/admin/wizard-steps/Step1BasicData.tsx` — form controlado (useState) com `name`, `description`, `ticketPrice`, `totalPrizeValue`, `ticketMin`, `ticketMax`, `referralPercent`. Em "novo", ao clicar Next cria a lottery via `lotteryService.create` (storeId = `VITE_FORTUNO_STORE_ID`), obtém `lotteryId` e passa adiante. Em "editar", `lotteryService.update`.
- [X] T097 [US4] Criar `src/pages/admin/wizard-steps/Step2NumberFormat.tsx` — `<select>` para `numberType`; quando `Int64` mostra `ticketNumIni`/`ticketNumEnd`, ocultando `numberValueMin`/`numberValueMax`; inverso quando `Composed*`. Embuti `<NumberCalculator />` atualizando ao mudar qualquer input.
- [X] T098 [US4] Criar `src/pages/admin/wizard-steps/Step3Descriptions.tsx` — 3 `<textarea>` monospace para `descriptionMd`, `rulesMd`, `privacyPolicyMd` com preview lado-a-lado via `MarkdownView` (tabs em mobile).
- [X] T099 [US4] Criar `src/pages/admin/wizard-steps/Step4Images.tsx` — upload múltiplo com preview, reorder via drag-and-drop leve (HTML5 `draggable`), `lotteryImageService.create/update/remove`.
- [X] T100 [US4] Criar `src/pages/admin/wizard-steps/Step5Combos.tsx` — lista combos (reutilizando `ComboSelector` visual em modo somente-leitura) + form de cadastro com `name`, `quantityStart`, `quantityEnd`, `discountLabel`, `discountValue`; chamadas `lotteryComboService.create/update/remove`.
- [X] T101 [US4] Criar `src/pages/admin/wizard-steps/Step6Raffles.tsx` — lista Raffles ordenada por `raffleDatetime`, form de cadastro `name`, `descriptionMd` (usando `MarkdownView` preview), `raffleDatetime` (input datetime-local), checkbox `includePreviousWinners` **disabled quando `raffles.length === 0`** (FR-056).
- [X] T102 [US4] Criar `src/pages/admin/wizard-steps/Step7Awards.tsx` — lista awards ordenada por `Raffle.raffleDatetime` + `position`; form de cadastro `raffleId` (select), `position`, `description`.
- [X] T103 [US4] Criar `src/pages/admin/wizard-steps/Step8Activate.tsx` — renderiza resumo consolidado (contadores de imagens/combos/raffles/awards, valores, ticket min/max), botão "Ativar sorteio" chama `lotteryService.publish(lotteryId)` e navega para `/meus-sorteios`.
- [X] T104 [US4] Criar `src/pages/admin/LotteryWizardPage.tsx` — rotas `/meus-sorteios/novo` e `/meus-sorteios/:id/editar`; orquestra `WizardShell` com os 8 steps, carrega lottery em "editar" ao montar.

**Checkpoint**: wizard navegável, persistente, com transições de estado coerentes; cancelamento de loteria via modal; publicação move para `Open` e reflete na home.

---

## Phase 7: User Story 5 - Navegação institucional e comunicado antifraude (Priority: P3)

**Goal**: home completa com carousel, comunicado antifraude Fortuno, bloco de segurança, CTA "Compre já" + páginas "Quem Somos" e "Fale Conosco" com canais externos.

**Independent Test**: abrir `/` como visitante → carousel renderiza loterias em andamento, antifraude mostra dados Fortuno, CTA visível; `/quem-somos` e `/fale-conosco` abrem sem erros e os links `wa.me`/`mailto:`/`instagram` abrem nova aba.

### Home components

- [X] T105 [P] [US5] Criar `src/components/home/LotteryCarousel.tsx` — usa `keen-slider`; consome `useLottery().openLotteries`; cada slide exibe imagem, nome, prêmio total e botão "Compre já" linkando para `/sorteios/:slug`; autoplay 6s; 1 slide mobile, 2 tablet, 3 desktop.
- [X] T106 [P] [US5] Criar `src/components/home/FraudWarning.tsx` — bloco `bg-fortuno-green-elegant text-fortuno-offwhite`. Texto fixo (copiado do comunicado da spec, adaptado ao Fortuno): título "COMUNICADO", 5 bullets (vídeo apenas; sem impostos; sem links; consultar site; sem acesso a bancos), subheading "FIQUE LIGADO! 👀" em dourado intenso, bloco identificando recebedor "FORTUNO LTDA" + CNPJ placeholder + instituições "MERCADO PAGO / EFÍ" + redes sociais `VITE_INSTAGRAM_URL`.
- [X] T107 [P] [US5] Criar `src/components/home/SecurityBlock.tsx` — área de garantias: 3 pilares (Segurança de dados, Pagamento via PIX, Sorteio auditado); ícones dourados + textos curtos.
- [X] T108 [P] [US5] Criar `src/components/home/EasyToPlayBlock.tsx` — título "É FÁCIL PARTICIPAR!", parágrafo sobre participar com poucas moedas, 3 bullets (quantos quiser, seguro via PIX, consultar em "Meus números"), botão CTA dourado "Compre já" linkando para `/sorteios`.

### Pages

- [X] T109 [US5] Reescrever `src/pages/public/HomePage.tsx` (substituir stub de T073): hero com logomarca branca sobre `bg-fortuno-green-deep`, `LotteryCarousel`, `FraudWarning`, `SecurityBlock`, `EasyToPlayBlock`, nesta ordem.
- [X] T110 [P] [US5] Criar `src/pages/public/AboutPage.tsx` — rota `/quem-somos`. Layout estático com copy institucional (placeholder): missão, visão, valores, equipe; 2 seções com imagens (assets de marca), tipografia longa-forma legível em off-white.
- [X] T111 [P] [US5] Criar `src/pages/public/ContactPage.tsx` — rota `/fale-conosco`. **Sem formulário** (Q2=A): exibe 3 cards/links — WhatsApp (ícone + texto + link `VITE_WHATSAPP_URL` em `target="_blank" rel="noopener"`), Instagram (`VITE_INSTAGRAM_URL`), E-mail (`mailto:VITE_CONTACT_EMAIL`); bloco com horários de atendimento e endereço placeholder.

**Checkpoint**: site público institucional completo e sem dependências do backend fora de `listOpen`; visitante percebe a identidade de marca.

---

## Phase 8: Integrações cruzadas e refinos

**Purpose**: ajustes que tocam múltiplas stories após todas estarem em pé.

- [X] T112 Garantir que a chain de providers em `src/main.tsx` final esteja na ordem documentada em T025 (Commission → Referral → Ticket → RaffleAward → Raffle → LotteryImage → LotteryCombo → Lottery → Checkout), com todos registrados.
- [X] T113 Conectar `useUser` no AuthenticatedShell para exibir avatar/nome do usuário no Header; esconder menu `Meus Sorteios` quando o usuário não tiver store atribuída (se `VITE_FORTUNO_STORE_ID` existir via ACL futura — enquanto não houver, menu sempre visível).
- [X] T114 Revisar tratamento de erros de rede em todos os services — mensagens de toast via `sonner` com fallback PT-BR; quando `response.status === 401`, limpar sessão via `useAuth().logout()` e redirecionar para `/login`.
- [X] T115 Auditar todos os serviços garantindo `getHeaders()` como ÚNICA fonte de header (grep por `'Content-Type'` e `'Authorization'` fora de `apiHelpers.ts` — zero ocorrências).

---

## Phase 9: Testes unitários (Polish — opcional)

**Purpose**: cobrir fluxos críticos de `research.md#R-13`. Não é gating do MVP.

- [X] T116 [P] Criar `src/Services/__tests__/apiHelpers.test.ts` — cobre: header `X-Tenant-Id: fortuno` sempre presente; `Authorization: Bearer ${token}` quando `authenticated=true`; lança `UnauthenticatedError` quando token ausente + `authenticated=true`; `handleResponse` devolve `data` quando `sucesso=true` e lança com `erros` concatenados quando `sucesso=false`.
- [X] T117 [P] Criar `src/hooks/__tests__/useQRCodePolling.test.tsx` — simula `ticketService.getQrCodeStatus` via `msw`; verifica: polling a cada 3s inicialmente, backoff até 10s, para em `status=Paid` devolvendo `tickets`, termina em erro em `Expired`, pausa quando `document.visibilityState=hidden`, cancela em unmount.
- [X] T118 [P] Criar `src/utils/__tests__/numberFormat.test.ts` — `formatInt64(1234567) === '1.234.567'`; `formatComposed('05-11-28-39-60-07', NumberType.Composed6)` ordena ascendente; `computePossibilities(Int64, 0, 0, 1, 1000) === 1000`; `computePossibilities(Composed6, 1, 60) === C(60,6) === 50063860`.
- [X] T119 [P] Criar `src/components/lottery/__tests__/ComboSelector.test.tsx` — dada combos (1..5→sem desc), (6..10→10%), (11..∞→20%), verifica: quantity=3 → sem combo; quantity=8 → combo "10% OFF" aplicado; quantity=15 → combo "20% OFF" aplicado; cálculo de preço total correto.
- [X] T120 [P] Criar `src/pages/checkout/__tests__/NumberSelectionStep.test.tsx` — cenário Int64: digitar número fora da faixa é rejeitado; digitar número já vendido (mock da API retorna 409) é rejeitado; "Preencher o restante aleatoriamente" com N já escolhidos completa até quantidade; botão "Pagar" só habilita com lista preenchida.

---

## Phase 10: Documentação e deploy (Polish)

- [X] T121 [P] Invocar agente `analyst` para gerar `docs/ARCHITECTURE.md` descrevendo provider chain, fluxo de checkout PIX, wizard e fluxo de auth NAuth (incluir diagrama Mermaid de sequence para o polling PIX).
- [X] T122 [P] Invocar agente `analyst` para atualizar `README.md` na raiz com badges (build, lint, coverage), seção "Como rodar" (duplicando sumário de `quickstart.md`), link para a constituição e para a spec.
- [X] T123 [P] Rodar checklist constitucional em `quickstart.md#Checklist constitucional` em uma PR simulada (grep de casing, `VITE_*`, ausência de Redux/Zustand, ausência de `Basic` no código).
- [X] T124 Abrir PR de **amendment constitucional** (bump MINOR → 1.1.0) atualizando Princípio II (CSS: Tailwind) e Princípio V (token Bearer NAuth + chave gerenciada por `nauth-react`) com Sync Impact Report conforme `plan.md#Complexity Tracking`.
- [X] T125 Rodar o smoke test manual da seção `quickstart.md#Validação rápida` (11 passos) num ambiente `npm run dev` conectado à API Fortuno local ou dev.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: nenhuma dependência; pode começar imediatamente.
- **Foundational (Phase 2)**: depende de Setup completo; **BLOQUEIA todas as user stories**.
- **US1 (Phase 3)**: depende de Foundational; pode rodar em paralelo com US2, mas `CheckoutContext` e o gate em `/checkout` esperam que `nauth-react` esteja configurado (já feito em Foundational T025).
- **US2 (Phase 4)**: depende de Foundational; independente de US1. Pode começar em paralelo com US1 em time multi-dev.
- **US3 (Phase 5)**: depende de Foundational + US2 (precisa de usuário autenticado); **em teste**, compartilha tickets criados em US1 ou pode ser testada com user fixture.
- **US4 (Phase 6)**: depende de Foundational + US2 (proteção de rotas) + US1 (reutiliza `lotteryService`, `ComboSelector`, `MarkdownView`).
- **US5 (Phase 7)**: depende de Foundational + US1 (reutiliza `LotteryCarousel` dados de `useLottery`); pode começar cedo com mock data enquanto US1 está em progresso.
- **Phase 8 (integrações)**: depende de todas as US.
- **Phase 9 (testes)**: pode começar junto com cada US correspondente; não bloqueia MVP.
- **Phase 10 (docs/deploy)**: depende de todas as fases.

### Parallel Opportunities

- T007–T010, T013–T014 em paralelo durante Setup.
- T017, T020 (tokens e enums) em paralelo em Foundational.
- T028–T035 (common components + utils) em paralelo em Foundational.
- T039–T050 (types e services de US1) — 11 arquivos independentes, paralelismo amplo.
- T053–T057 (4 contexts independentes de US1) em paralelo.
- T060–T064 (components de lottery/tickets de US1) em paralelo.
- T075–T080 (6 wrappers nauth-react de US2) totalmente em paralelo.
- T083–T086 (types + services de US3) em paralelo.
- T094–T095 (wizard helpers) em paralelo com os steps.
- T105–T108 (home components) em paralelo em US5.
- T116–T120 (5 suites de teste independentes) em paralelo em Phase 9.

### Parallel Example: US1

```bash
# Types paralelos (T039..T044): 6 tasks simultâneas
Task: "Create src/types/lottery.ts"
Task: "Create src/types/lotteryCombo.ts"
Task: "Create src/types/lotteryImage.ts"
Task: "Create src/types/raffle.ts"
Task: "Create src/types/raffleAward.ts"
Task: "Create src/types/ticket.ts"

# Services paralelos (T045..T051): 7 tasks simultâneas após types
Task: "Create src/Services/lotteryService.ts"
Task: "Create src/Services/lotteryComboService.ts"
Task: "Create src/Services/lotteryImageService.ts"
Task: "Create src/Services/raffleService.ts"
Task: "Create src/Services/raffleAwardService.ts"
Task: "Create src/Services/ticketService.ts"
Task: "Create src/Services/pdfService.ts"
```

---

## Implementation Strategy

### MVP First (US1 + US2 — ambos P1)

Observação: US1 exige login (checkout em `/checkout/:lotteryId` aciona `AuthGateStep`). Por isso o MVP é **US1 + US2 juntos**, não apenas US1.

1. Completar Phase 1 (Setup) — ~25 min
2. Completar Phase 2 (Foundational) — ~2 h
3. **Em paralelo** (2 devs) ou **sequencial** (1 dev):
   - Phase 4 (US2): apenas wrappers de nauth-react + integração no Header — ~1 h
   - Phase 3 (US1): types/services/contexts/hooks + páginas de checkout — ~6 h
4. Validar Independent Test de US1+US2 via smoke test manual.
5. Entregar MVP (deploy em ambiente dev).

### Incremental Delivery

1. MVP (US1+US2) → deploy
2. + US5 (home completa + institucional) → deploy (experiência pública completa)
3. + US3 (dashboard do usuário) → deploy (engajamento pós-compra)
4. + US4 (wizard admin) → deploy (auto-serviço para organizadores)
5. Phase 8–10 (refino, testes, docs, amendment constitucional) — contínuo.

### Parallel Team Strategy

Com 3 devs:

- Dev A: Phase 1 + Phase 2 (Setup + Foundational) → Phase 3 (US1 — checkout + lottery)
- Dev B: após Foundational → Phase 4 (US2) + Phase 5 (US3)
- Dev C: após Foundational → Phase 7 (US5) + Phase 6 (US4)
- `ux-designer` (em paralelo desde o início): tokens derivados + 6 mockups entregues até fim da Phase 2.

---

## Notes

- **[P] só é válido se o arquivo de saída não colide com outro [P]** e se nenhuma dependência declarada estiver incompleta.
- Cada task deve ser commitada isoladamente quando possível (`feat(US1): T045 lotteryService`).
- A skill `/react-architecture` deve ser invocada uma vez por entidade (T052–T058, T087–T088) — ela gera o esqueleto completo; ajustes finos específicos do Fortuno (métodos extras como `publish`, `cancel`, `createQrCode`, `getStatus`) são adicionados logo após.
- **Nenhum mock especulativo** (R-15): se o endpoint não existir na Bruno collection, marcar com `// MOCK: aguarda endpoint <path>` + adicionar entrada em `MOCKS.md`.
- **SC-004 verificação**: após T045–T050 e T085–T086 estarem prontos, executar `grep -n "fetch(" src/Services/*.ts | grep -v "getHeaders"` — deve retornar 0 linhas.
- **SC-007 verificação**: após T075–T080, executar busca por `<form.*password` em `src/` — deve aparecer apenas dentro de `node_modules/nauth-react`.
- **Independência das stories**: US1 assume US2 ativo (fluxo de compra exige login). Em teste isolado de US1 sem US2, usar mock de `useAuth` retornando um user fixture.
