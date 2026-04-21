# Quickstart — Fortuno Frontend

**Feature**: 001-fortuno-frontend
**Phase**: 1 (Design)
**Date**: 2026-04-20

---

## Pré-requisitos

- Node.js 20+ e npm 10+ (ou pnpm 9 equivalente)
- API Fortuno rodando (local em `https://localhost:5001` ou remoto `VITE_API_URL`)
- NAuth API acessível (`VITE_NAUTH_API_URL`) com o tenant NAuth configurado
- **Docker NÃO é utilizado** neste projeto (Constituição, Princípio II)

---

## Setup inicial (greenfield)

```bash
# 1. Scaffold do projeto Vite + React + TypeScript
npm create vite@latest . -- --template react-ts

# 2. Instalar dependências core
npm install react-router-dom nauth-react i18next react-i18next sonner \
  react-markdown remark-gfm jspdf keen-slider qrcode.react

# 3. Instalar Tailwind (exigido por nauth-react)
npm install -D tailwindcss postcss autoprefixer tailwindcss-animate
npx tailwindcss init -p

# 4. Instalar dev tooling
npm install -D vitest @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event msw jsdom
```

## Variáveis de ambiente

Criar `.env.development`:

```env
VITE_API_URL=https://localhost:5001
VITE_FORTUNO_TENANT_ID=fortuno
VITE_FORTUNO_STORE_ID=1
VITE_NAUTH_API_URL=https://auth.fortuno.example
VITE_NAUTH_TENANT=fortuna
VITE_SITE_BASENAME=/
VITE_WHATSAPP_URL=https://wa.me/5511999999999
VITE_INSTAGRAM_URL=https://instagram.com/fortuno
VITE_CONTACT_EMAIL=contato@fortuno.example
```

`.env.production.example` documenta as mesmas chaves com valores vazios/exemplo para CI/CD.

## Scripts (package.json)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src --ext .ts,.tsx",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## Ordem de execução sugerida pelo `frontend-react-developer`

1. **Boot** — scaffold Vite, instalar deps, configurar Tailwind e tokens base do `ux-designer`.
2. **i18n** — criar `src/i18n/index.ts` com instância i18next + `createNAuthI18nInstance` para os componentes do `nauth-react`; adicionar `pt/fortuno.json`.
3. **API helper** — `src/Services/apiHelpers.ts` com `getHeaders`, incluindo teste unitário que verifica SC-004 (header `X-Tenant-Id: fortuno` sempre presente).
4. **Provider chain em `main.tsx`** — ordem obrigatória:
   ```
   React.StrictMode
     └─ BrowserRouter (basename=VITE_SITE_BASENAME)
        └─ NAuthProvider (config do nauth-react)
           └─ CommissionProvider
              └─ ReferralProvider
                 └─ TicketProvider
                    └─ RaffleAwardProvider
                       └─ RaffleProvider
                          └─ LotteryImageProvider
                             └─ LotteryComboProvider
                                └─ LotteryProvider
                                   └─ CheckoutProvider
                                      └─ <App />
   ```
5. **Entidades via skill `/react-architecture`** — invocar 8 vezes, uma por entidade (Lottery, LotteryCombo, LotteryImage, Raffle, RaffleAward, Ticket, Referral, Commission). Para cada uma, a skill gera `types/`, `Services/`, `Contexts/`, `hooks/` e registra o provider em `main.tsx`.
6. **Rotas e layout** — `App.tsx` com `<Routes>`, `Header` com 5 itens do menu, `ProtectedRoute` usando `useProtectedRoute` do `nauth-react`.
7. **Home pública** — `HomePage` + `LotteryCarousel` + `FraudWarning` + `SecurityBlock` + `EasyToPlayBlock`.
8. **Sorteios (público)** — `LotteryListPage` + `LotteryDetailPage` (ComboSelector, MarkdownView, RulesPdfButton).
9. **Checkout** — `QuantityStep` → `AuthGateStep` → `NumberSelectionStep` → `PaymentStep` (com `useQRCodePolling` + `PiSimulatorButton` + `CountdownTimer`) → `SuccessStep`.
10. **Auth pages** — wrappers finos em torno dos componentes `nauth-react`; a maioria é `<LoginForm />`, `<RegisterForm />`, etc. Nenhuma customização visual.
11. **Dashboard autenticado** — Dashboard, MyNumbers, MyPoints, MyLotteries.
12. **Wizard administrativo** — `WizardShell` + 8 steps. Step 1 cria a Lottery em `Draft` para obter `lotteryId` antes dos próximos steps.
13. **Institucional** — About, Contact.
14. **Testes prioritários** — ver `research.md#R-13`.
15. **Docs** — `docs/ARCHITECTURE.md` e `README.md` de uso/contribuição via `analyst` agent.

---

## Rotas do frontend

| Rota                                | Auth | Componente                          | User Story |
|-------------------------------------|------|-------------------------------------|------------|
| `/`                                 | —    | HomePage                            | US5        |
| `/sorteios`                         | —    | LotteryListPage                     | US1        |
| `/sorteios/:slug`                   | —    | LotteryDetailPage                   | US1        |
| `/quem-somos`                       | —    | AboutPage                           | US5        |
| `/fale-conosco`                     | —    | ContactPage                         | US5        |
| `/login`                            | —    | LoginPage (nauth-react)             | US2        |
| `/cadastro`                         | —    | RegisterPage (nauth-react)          | US2        |
| `/esqueci-senha`                    | —    | ForgotPasswordPage (nauth-react)    | US2        |
| `/recuperar-senha`                  | —    | ResetPasswordPage (nauth-react)     | US2        |
| `/conta/alterar-senha`              | ✅   | ChangePasswordPage (nauth-react)    | US2        |
| `/conta/dados`                      | ✅   | ProfileEditPage (nauth-react)       | US2        |
| `/dashboard`                        | ✅   | DashboardPage                       | US3        |
| `/meus-numeros`                     | ✅   | MyNumbersPage                       | US3        |
| `/meus-pontos`                      | ✅   | MyPointsPage                        | US3        |
| `/meus-sorteios`                    | ✅   | MyLotteriesPage                     | US4        |
| `/meus-sorteios/novo`               | ✅   | LotteryWizardPage (create)          | US4        |
| `/meus-sorteios/:id/editar`         | ✅   | LotteryWizardPage (edit)            | US4        |
| `/checkout/:lotteryId`              | —    | Checkout flow (auth-gated interno)  | US1        |

---

## Validação rápida (smoke tests)

1. `npm run dev` → abrir `http://localhost:5173`
2. Home deve carregar em <3s, carousel visível, antifraude renderizado
3. Clicar em "Compre já" → redirect para `/sorteios/:slug`
4. Clicar em "Comprar" → wizard de checkout abre
5. Sem login, clicar em "Comprar" → redireciona para `/login`
6. Fazer login → volta para checkout
7. Selecionar "Números aleatórios" → backend gera QR Code
8. Clicar no símbolo π → toast "Simulador acionado"
9. Aguardar polling → status=Paid → tela de parabéns com tickets listados
10. `/dashboard` carrega contadores + `referralCode` copiável
11. `/meus-sorteios/novo` → wizard de 8 etapas navegável

---

## Checklist constitucional (antes de cada PR)

- [ ] Nova entidade criada via `/react-architecture`? (Princípio I)
- [ ] Casing de `Contexts/`, `Services/`, `hooks/`, `types/` exato? (Princípio III)
- [ ] `interface` em vez de `type`, arrow functions, `const` por padrão? (Princípio IV)
- [ ] Toda variável de ambiente com prefixo `VITE_`? (Princípio VI)
- [ ] Nenhuma lib de state global adicionada? (Princípio II)
- [ ] Nenhum secret no bundle? (Princípio V)
- [ ] Todo service passa por `apiHelpers.getHeaders()` (garante `X-Tenant-Id: fortuno`)? (SC-004)
- [ ] Telas de autenticação são exclusivamente componentes do `nauth-react`? (SC-007)

---

## Next steps após `/speckit.plan`

- `/speckit.tasks` — gera `tasks.md` com a lista ordenada e dependente de tarefas implementáveis.
- `ux-designer` — produzir tokens (cores, tipografia, raios, sombras) + mockups das 6 telas distintivas (Home, LotteryDetail, PaymentStep, TicketCard, Dashboard, WizardShell+Step2).
- `frontend-react-developer` — executar as tarefas do `tasks.md` respeitando a arquitetura deste plan.
