# Implementation Plan: Fortuno — Frontend

**Branch**: `001-fortuno-frontend` | **Date**: 2026-04-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-fortuno-frontend/spec.md`

## Summary

Construir o frontend completo do Fortuno (SPA React + TypeScript + Vite) que consome a API REST já existente (`c:\repos\Fortuno\Fortuno`), usa o pacote `nauth-react` para todas as telas de autenticação, injeta o header obrigatório `X-Tenant-Id: fortuno` em todas as requisições, e entrega: site público (home, sorteios, institucional, antifraude), fluxo de compra com PIX (seleção/aleatório + QR Code + polling de status + simulador π), área autenticada (dashboard, meus números, meus pontos, meus sorteios) e wizard administrativo de 8 etapas para criar/editar loteria.

**Abordagem técnica**: seguir a arquitetura padrão descrita pela skill `/react-architecture` (Types → Service → Context → Hook → Provider em `main.tsx`) para cada entidade (Lottery, LotteryCombo, LotteryImage, Raffle, RaffleAward, Ticket, Referral, Commission). UX/layout é responsabilidade do agente `ux-designer` (tokens, mockups dos fluxos distintivos) **partindo da paleta e logomarca canônicas definidas abaixo** — sem propor nova paleta. Implementação é responsabilidade do agente `frontend-react-developer`, com testes de fluxos críticos e uso dos componentes do `nauth-react` sem customização.

**Identidade visual fixa (input do stakeholder)**:
- Logomarcas oficiais em `assets/` na raiz do repo: `Fortuno-branca-transparente.png` (fundos escuros) e `Fortuno-preta-transparente.png` (fundos claros). Copiar para `public/` no bootstrap do Vite.
- Paleta canônica (tokens `fortuno.*` em `tailwind.config.js` + `src/styles/tokens.css`):
  - Verde profundo `#0A2A20` (fundo principal, hero, footer)
  - Verde elegante `#134436` (superfícies escuras secundárias)
  - Dourado intenso `#B8963F` (CTAs primários, destaques)
  - Dourado suave `#D4AF37` (hover, bordas premium, bilhetes)
  - Preto `#0B0B0B` (texto em fundo claro)
  - Off-white `#ECE8E1` (fundo claro, superfície de cartão/bilhete)
- Detalhamento completo em `research.md#R-17`.

## Technical Context

**Language/Version**: TypeScript 5.x + React 18.x (SPA)
**Primary Dependencies**:
- `react-router-dom` 6.x (roteamento + guards)
- `nauth-react` ^0.2.7 (autenticação, componentes de login/cadastro/senha/perfil, i18n interno, `NAuthProvider`, `useAuth`, `useUser`, `useProtectedRoute`)
- `i18next` 25.x + `react-i18next` (i18n pt-BR principal)
- `sonner` (toasts)
- `react-markdown` + `remark-gfm` (render de `description_md`, `rules_md`, `privacy_policy_md`)
- `jspdf` + `html2canvas` ou `@react-pdf/renderer` (geração de PDF de regras/política no cliente quando o backend não expuser)
- `qrcode.react` (fallback para renderização do QR Code; o principal vem do backend como `brCodeBase64`)
- `swiper` ou `keen-slider` (carousel de imagens e de loterias em andamento)
- **Tailwind CSS** + `tailwindcss-animate` (exigido por `nauth-react` — ver Complexity Tracking)
- Fetch API nativo (HTTP client para API Fortuno)

**Storage** (client-side):
- `localStorage` — token NAuth e dados de sessão (gerenciados pelo próprio `nauth-react` via `NAuthProvider`)
- `sessionStorage` — estado em progresso do wizard de loteria (sobreviver a F5) e do carrinho de compra

**Testing**:
- `vitest` para unit tests de services, hooks e utilitários
- `@testing-library/react` para testes de componentes críticos (wizard, seleção de números, polling PIX)
- Smoke-tests manuais via Bruno collection para validar contratos reais

**Target Platform**: Navegadores modernos (Chrome 110+, Edge 110+, Firefox 110+, Safari 16+), mobile-first (375px) e desktop (até 1440px)

**Project Type**: Web application (SPA frontend consumindo API REST separada)

**Performance Goals**:
- LCP < 2.5s em 4G na home pública
- TTI < 3.5s nas rotas autenticadas
- Polling de status PIX a cada 3s com backoff exponencial até 10s; resposta perceptível em até 10s (SC-002)
- Bundle inicial (home + institucional + shell) ≤ 300 KB gzipped; chunks sob demanda para wizard admin e dashboard

**Constraints**:
- Docker NÃO disponível no ambiente local (Constituição, Princípio II)
- Multi-tenant: header `X-Tenant-Id: fortuno` obrigatório em 100% das chamadas à API Fortuno (SC-004)
- Autenticação: 100% via componentes `nauth-react` (SC-007), zero tela custom de auth
- Env vars: prefixo `VITE_` (Constituição, Princípio VI)
- Acessibilidade: WCAG AA nos fluxos de checkout, login e dashboard

**Scale/Scope**:
- ~20 rotas, ~35 páginas/telas (considerando etapas do wizard)
- ~9 entidades de domínio com Types/Service/Context/Hook
- Expectativa inicial: até 10.000 visitantes simultâneos na home; até 500 sessões de compra concorrentes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Princípio | Status | Observação |
|---|-----------|--------|------------|
| I | Skill obrigatória `/react-architecture` para cada entidade nova | ✅ PASS | Todas as 9 entidades serão scaffoldadas via skill |
| II | Stack fixa (React 18 + TS 5 + RR 6 + Vite 6 + Bootstrap 5 + i18next 25) | ⚠ VIOLAÇÃO JUSTIFICADA | Uso de Tailwind CSS em vez de Bootstrap — exigido por `nauth-react`. Ver Complexity Tracking. |
| III | Case sensitivity: `Contexts/`, `Services/`, `hooks/`, `types/` | ✅ PASS | Estrutura descrita em Project Structure respeita o casing |
| IV | Convenções TS/React (interface, arrow functions, PascalCase/camelCase/UPPER_CASE) | ✅ PASS | Serão aplicadas pela skill e pelos lints |
| V | Autenticação: `Authorization: Basic {token}` + `localStorage["login-with-metamask:auth"]` | ⚠ VIOLAÇÃO JUSTIFICADA | `nauth-react` gerencia token próprio (Bearer) e chave própria de storage. Ver Complexity Tracking. |
| VI | Env vars com prefixo `VITE_` via `import.meta.env` | ✅ PASS | Todas as envs usarão `VITE_` |

Violações não-triviais documentadas em **Complexity Tracking** (final deste plan). Recomenda-se amendment constitucional formal após merge.

## Project Structure

### Documentation (this feature)

```text
specs/001-fortuno-frontend/
├── plan.md              # Este arquivo
├── research.md          # Phase 0 — decisões técnicas e trade-offs
├── data-model.md        # Phase 1 — entidades e relacionamentos no frontend
├── quickstart.md        # Phase 1 — como rodar, variáveis de ambiente, fluxo de contribuição
├── contracts/
│   └── api-endpoints.md # Phase 1 — mapeamento completo dos endpoints Fortuno consumidos
├── checklists/
│   └── requirements.md  # (já criado em /speckit.specify)
└── tasks.md             # (criado por /speckit.tasks, NÃO por /speckit.plan)
```

### Source Code (repository root — greenfield)

O projeto `fortuno-app` está vazio (apenas constitution, specs, assets de logo). A estrutura abaixo será criada do zero seguindo a constituição:

```text
fortuno-app/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── Contexts/                      # Provider chain (uppercase C — Princípio III)
│   │   ├── LotteryContext.tsx
│   │   ├── LotteryComboContext.tsx
│   │   ├── LotteryImageContext.tsx
│   │   ├── RaffleContext.tsx
│   │   ├── RaffleAwardContext.tsx
│   │   ├── TicketContext.tsx
│   │   ├── ReferralContext.tsx
│   │   ├── CommissionContext.tsx
│   │   └── CheckoutContext.tsx        # estado do fluxo de compra
│   ├── Services/                      # Classes HTTP (uppercase S — Princípio III)
│   │   ├── apiHelpers.ts              # getHeaders: injeta X-Tenant-Id + Bearer NAuth
│   │   ├── lotteryService.ts
│   │   ├── lotteryComboService.ts
│   │   ├── lotteryImageService.ts
│   │   ├── raffleService.ts
│   │   ├── raffleAwardService.ts
│   │   ├── ticketService.ts
│   │   ├── referralService.ts
│   │   ├── commissionService.ts
│   │   └── pdfService.ts              # gera PDF de Rules/Privacy a partir do markdown
│   ├── hooks/                         # (lowercase h — Princípio III)
│   │   ├── useLottery.ts
│   │   ├── useLotteryCombo.ts
│   │   ├── useLotteryImage.ts
│   │   ├── useRaffle.ts
│   │   ├── useRaffleAward.ts
│   │   ├── useTicket.ts
│   │   ├── useReferral.ts
│   │   ├── useCommission.ts
│   │   ├── useCheckout.ts
│   │   ├── useQRCodePolling.ts        # polling de status PIX
│   │   └── useTenantHeader.ts
│   ├── types/                         # (lowercase t — Princípio III)
│   │   ├── lottery.ts
│   │   ├── lotteryCombo.ts
│   │   ├── lotteryImage.ts
│   │   ├── raffle.ts
│   │   ├── raffleAward.ts
│   │   ├── ticket.ts
│   │   ├── referral.ts
│   │   ├── commission.ts
│   │   └── enums.ts
│   ├── pages/
│   │   ├── public/
│   │   │   ├── HomePage.tsx
│   │   │   ├── LotteryListPage.tsx
│   │   │   ├── LotteryDetailPage.tsx
│   │   │   ├── AboutPage.tsx          # Quem Somos (estática)
│   │   │   └── ContactPage.tsx        # Fale Conosco (canais externos, sem formulário)
│   │   ├── auth/                      # wrappers dos componentes nauth-react
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   ├── ResetPasswordPage.tsx
│   │   │   ├── ChangePasswordPage.tsx
│   │   │   └── ProfileEditPage.tsx
│   │   ├── checkout/
│   │   │   ├── QuantityStep.tsx
│   │   │   ├── AuthGateStep.tsx
│   │   │   ├── NumberSelectionStep.tsx
│   │   │   ├── PaymentStep.tsx        # QR Code + polling + botão π
│   │   │   └── SuccessStep.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── MyNumbersPage.tsx
│   │   │   ├── MyPointsPage.tsx
│   │   │   └── MyLotteriesPage.tsx
│   │   └── admin/
│   │       ├── LotteryWizardPage.tsx
│   │       └── wizard-steps/
│   │           ├── Step1BasicData.tsx
│   │           ├── Step2NumberFormat.tsx
│   │           ├── Step3Descriptions.tsx
│   │           ├── Step4Images.tsx
│   │           ├── Step5Combos.tsx
│   │           ├── Step6Raffles.tsx
│   │           ├── Step7Awards.tsx
│   │           └── Step8Activate.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx             # menu principal com 5 itens
│   │   │   ├── Footer.tsx
│   │   │   └── AuthenticatedShell.tsx
│   │   ├── home/
│   │   │   ├── LotteryCarousel.tsx
│   │   │   ├── FraudWarning.tsx       # comunicado antifraude Fortuno
│   │   │   ├── SecurityBlock.tsx
│   │   │   └── EasyToPlayBlock.tsx
│   │   ├── lottery/
│   │   │   ├── LotteryImageCarousel.tsx
│   │   │   ├── ComboSelector.tsx      # 3 colunas com quantidade
│   │   │   ├── MarkdownView.tsx
│   │   │   └── RulesPdfButton.tsx
│   │   ├── tickets/
│   │   │   └── TicketCard.tsx         # layout estilizado de bilhete
│   │   ├── wizard/
│   │   │   ├── WizardShell.tsx
│   │   │   ├── NumberCalculator.tsx
│   │   │   └── PdfUploadField.tsx
│   │   ├── common/
│   │   │   ├── ConfirmModal.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── CopyableCode.tsx       # para referralCode
│   │   │   ├── CountdownTimer.tsx     # cronômetro PIX
│   │   │   └── PiSimulatorButton.tsx  # ícone π semitransparente
│   │   └── route-guards/
│   │       └── ProtectedRoute.tsx     # usa useProtectedRoute do nauth-react
│   ├── i18n/
│   │   ├── index.ts
│   │   └── locales/pt/fortuno.json
│   ├── styles/
│   │   ├── index.css
│   │   └── tokens.css                 # design tokens do ux-designer
│   ├── utils/
│   │   ├── numberFormat.ts            # Int64 vs Composed*
│   │   ├── currency.ts
│   │   └── validators.ts
│   ├── App.tsx
│   ├── main.tsx                       # ThemeProvider → NAuthProvider → Contexts → Router
│   └── vite-env.d.ts
├── .env.development
├── .env.production.example
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

**Structure Decision**: SPA única (frontend-only) — não há backend neste repo; a API Fortuno vive em `c:\repos\Fortuno\Fortuno`. A decisão respeita os Princípios I, III, IV, VI da Constituição e a solicitação do usuário (frontend-react-developer + ux-designer). Todas as entidades passam pela skill `/react-architecture`.

## Complexity Tracking

> Preenchido porque a Constituição foi violada em 2 pontos. Ambas as violações são justificadas pela dependência externa obrigatória `nauth-react`, solicitada pelo usuário.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| **Tailwind CSS + `tailwindcss-animate` em vez de Bootstrap 5** (viola Princípio II) | `nauth-react` é construído sobre Tailwind; seus componentes (LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm, ChangePasswordForm, UserEditForm) renderizam exclusivamente com classes Tailwind e exigem `tailwindcss-animate`. A spec SC-007 exige 100% das telas de auth via componentes `nauth-react`. | **Bootstrap puro**: componentes da lib ficariam sem estilo. **Reescrever auth**: viola exigência explícita do usuário e SC-007. **Bootstrap + Tailwind juntos**: duplica CSS (~250KB extra), conflito de reset e cascade. Tailwind isolado é o caminho com menor fricção. |
| **Gerenciamento de token via `NAuthProvider`** (viola Princípio V) | `nauth-react` tem seu próprio `NAuthProvider` que armazena o token em localStorage com chave interna (não configurável) e envia `Authorization: Bearer {token}` (padrão NAuth). A chave `"login-with-metamask:auth"` e o esquema `Basic` são do produto anterior (Abipesca/MetaMask). | **Recriar auth manualmente com Basic**: viola SC-007. **Gravar token em chave paralela**: duas fontes de verdade → dessincronização. **Ignorar NAuth**: quebra todas as rotas autenticadas da API Fortuno. |

**Mitigação e follow-up**:
1. Abrir PR de **amendment constitucional** (bump MINOR → 1.1.0) após merge, atualizando Princípio II (stack CSS: Tailwind) e Princípio V (token via `nauth-react`, chave gerenciada pela lib) para refletir a realidade do Fortuno.
2. `apiHelpers.getHeaders()` é ponto único de injeção — todo serviço HTTP passa por ele, garantindo 100% de `X-Tenant-Id: fortuno` + Bearer token NAuth.
3. Centralizar leitura/escrita do token via `useAuth()` do `nauth-react`; nenhum acesso direto a `localStorage` fora desse hook.
