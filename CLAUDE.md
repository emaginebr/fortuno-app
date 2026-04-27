# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Auto-generated from feature plans + repo inspection. Last updated: 2026-04-27

## Active Technologies

- React 18 + TypeScript 5 (strict) + Vite 6 — SPA frontend-only
- React Router 6, i18next 25 + react-i18next, Tailwind CSS 3 + `tailwindcss-animate`
- `nauth-react` ^0.2.7 (autenticação ponta-a-ponta — provider/hook/telas)
- Fetch API nativa (HTTP), `sonner` (toasts), `react-markdown` + `remark-gfm`, `keen-slider`, `qrcode.react`, `jspdf`, `lucide-react`
- Vitest 2 + Testing Library + jsdom, MSW 2 (mocks de rede em testes)

Feature ativa: **001-fortuno-frontend** — `specs/001-fortuno-frontend/{plan.md, research.md, data-model.md, contracts/api-endpoints.md, quickstart.md}`.

## Commands

| Ação                      | Comando                                                       |
|---------------------------|---------------------------------------------------------------|
| Dev server (porta 5173)   | `npm run dev`                                                 |
| Build de produção         | `npm run build` (`tsc -b && vite build`)                      |
| Preview do build          | `npm run preview`                                             |
| Typecheck (sem emitir)    | `npm run typecheck`                                           |
| Lint                      | `npm run lint` (ESLint — `src/**/*.{ts,tsx}`)                 |
| Testes (watch)            | `npm test` (vitest)                                           |
| Testes (UI)               | `npm run test:ui`                                             |
| Coverage                  | `npm run test:coverage`                                       |
| Test único (arquivo)      | `npx vitest run src/Services/__tests__/apiHelpers.test.ts`    |
| Test único (filtro nome)  | `npx vitest run -t "nome do teste"`                           |

Não há ESLint config na raiz (sem `eslint.config.*` ou `.eslintrc*`). `npm run lint` precisa de uma config antes de rodar limpo — não criar uma sem solicitação.

`npm test` é watch por padrão; para CI/one-shot, usar `npx vitest run`.

## Project Structure

```text
src/
  Services/         # uppercase S — HTTP clients (1 classe por entidade) + apiHelpers
  Contexts/         # uppercase C — Provider + Context (1 por entidade)
  hooks/            # lowercase — use<Entidade>() consumindo o Context
  types/            # lowercase — interfaces da entidade (Info, InsertInfo, UpdateInfo)
  pages/            # public/, auth/, dashboard/, admin/, checkout/
  components/       # common/, layout/, lottery/, checkout/, dashboard/, wizard/, ...
  i18n/locales/pt/  # única locale ativa (DEFAULT_LOCALE = 'pt-BR')
  styles/           # tokens.css (paleta fortuno.*) + por-página *.css
  App.tsx           # Routes; rotas auth ficam fora do AuthenticatedShell
  main.tsx          # provider chain + NAuthProvider + BrowserRouter
specs/001-fortuno-frontend/   # spec, plan, research, data-model, contracts
.specify/                     # speckit (constitution, templates, scripts)
.claude/{commands,skills}/    # speckit commands + skills locais
MOCKS.md                      # registro vivo de mocks aguardando endpoints reais
```

Alias `@/` → `src/` (configurado em `vite.config.ts`, `vitest.config.ts` e `tsconfig.json`).

## Architecture — big picture

### Provider chain (`main.tsx`, mais externo → mais interno)

```
NAuthProvider → Commission → Referral → Ticket → RaffleAward →
Raffle → LotteryImage → LotteryCombo → Lottery → Checkout
```

Cada entidade segue o mesmo quinteto, gerado pela skill `/react-architecture`:

```
types/<entity>.ts            # interface <Entity>Info / InsertInfo / UpdateInfo
Services/<entity>Service.ts  # class <Entity>Service { listByX, create, update, remove }
Contexts/<Entity>Context.tsx # Provider com loading/error/clearError + toasts sonner
hooks/use<Entity>.ts         # useContext + throw se fora do provider
```

Padrão de Context: cada handler usa `try/catch` → `fail(err, msg)` → `toast.error` + `setError`. Sucesso emite `toast.success` curto. Estado é local ao provider — **não há state manager global** (Redux/Zustand/MobX são proibidos pela constituição).

### Camada HTTP — `src/Services/apiHelpers.ts` (single source of truth)

Toda chamada à API Fortuno DEVE passar por este módulo. Nunca chamar `fetch` direto a partir de um service.

- `getHeaders(authenticated?)` — injeta sempre `X-Tenant-Id: fortuno` (SC-004) + `Content-Type: application/json`. Se `authenticated=true`, lê o token NAuth de `localStorage["fortuno:nauth"]` (com fallbacks: `nauth-auth`, `nauth_session`, `auth:nauth`) e adiciona `Authorization: Bearer <token>`. Sem token → lança `UnauthenticatedError`.
- `safeFetch(input, init)` — wrapper em `fetch` que loga `[api] → METHOD URL` / `[api] ← STATUS …`, e converte erros de rede (`TypeError: Failed to fetch`, CORS, DNS) em `ApiError(status=0)` com mensagem PT-BR amigável. **Sempre usar `safeFetch` — não `fetch`** — para que o `handleError` dos Contexts não caia em fallback genérico.
- `handleResponse<T>(res)` — desempacota o envelope `{ sucesso, mensagem, erros, data }` da API; se `sucesso=false` lança `ApiError(message, status, errors[])`. 401 → `UnauthenticatedError`. Suporta payloads sem wrapper (retorna o body como `T`).
- `apiUrl(path)` — concatena com `VITE_API_URL` normalizando barras.

Erros propagados: `UnauthenticatedError`, `ApiError { status, errors[] }`. Os Contexts traduzem para mensagens via toast.

### Autenticação

- Tudo via `nauth-react` (`NAuthProvider`, `useAuth`, telas de login/cadastro/senha/perfil). **SC-007 proíbe telas custom de auth** — não recriar formulários.
- Storage key canônica do NAuth: `fortuno:nauth` (constante `NAUTH_STORAGE_KEY` em `main.tsx` e `apiHelpers.ts`).
- Header NAuth próprio: `X-Tenant-Id: <VITE_NAUTH_TENANT>` (separado do tenant da API Fortuno em `VITE_FORTUNO_TENANT_ID`).
- Guard de rota: `components/route-guards/ProtectedRoute.tsx` consome `useAuth()` e redireciona para `/login` preservando `state.from`.
- `App.tsx`: rotas autenticadas (dashboard, meus-numeros, meus-pontos, meus-sorteios, conta, wizard admin) ficam dentro de `<ProtectedRoute />` aninhado em `<AuthenticatedShell />`. Rotas de auth (`/login`, `/cadastro`, `/esqueci-senha`, `/recuperar-senha`) ficam **fora do shell** (fundo dark dedicado).

### Tailwind / design system

- Tokens canônicos em `src/styles/tokens.css` (variáveis CSS); `tailwind.config.js` extends usa `var(--…)` para cores `fortuno.{green.deep, green.elegant, gold.intense, gold.soft, black, offwhite}` e dezenas de `boxShadow` / `backgroundImage` / `keyframes` / `animation` customizados.
- Fontes: `Inter` (sans), `Playfair Display` (display).
- `tailwind.config.js > content` inclui `node_modules/nauth-react/dist/**` — necessário para o Tailwind processar as classes da lib.

### i18n

- Apenas `pt-BR` ativa (`src/i18n/index.ts`). Namespace único `fortuno` em `src/i18n/locales/pt/fortuno.json`. `escapeValue: false` (React já escapa).

### Mocks (`MOCKS.md`)

Quando um endpoint não existe ainda no backend, marcar com `// MOCK: aguarda endpoint <path>` no código e registrar entrada em `MOCKS.md` (arquivo, rota esperada, descrição, item de acompanhamento). **Criar mock APENAS durante implementação ao detectar endpoint faltando** — não criar mocks proativos.

## Conventions (constitucionais — `.specify/memory/constitution.md` v1.0.0)

- **Princípio I (não-negociável):** toda nova entidade frontend é scaffoldada via `/react-architecture`. Não reimplementar Types/Service/Context/Hook manualmente.
- **Princípio III (inviolável):** casing de diretórios é literal — `Contexts/` (C maiúsculo), `Services/` (S maiúsculo), `hooks/` e `types/` (minúsculas). Imports devem bater exato (Linux/CI quebra; Windows mascara).
- **Princípio IV:** `interface` (não `type` para objetos), arrow functions, `const` por padrão, PascalCase / camelCase / UPPER_CASE.
- **Princípio VI:** env vars frontend usam prefixo `VITE_` e são lidas via `import.meta.env.VITE_*`. Nunca `REACT_APP_`.
- **Stack fixa:** sem Redux/Zustand/MobX; Context API é o padrão. Novos services HTTP usam Fetch API (Axios fica apenas em legado).
- **Violações justificadas no plan (Complexity Tracking):** Tailwind no lugar de Bootstrap (exigência de `nauth-react`); token NAuth Bearer em vez de `Basic` + chave `"login-with-metamask:auth"`. Amendment constitucional pendente pós-merge.

## Environment

Variáveis em `.env` / `.env.production` (template em `.env.production.example`):

```
VITE_API_URL                    # base da API Fortuno
VITE_FORTUNO_TENANT_ID=fortuno  # injetado em X-Tenant-Id por apiHelpers
VITE_NAUTH_API_URL              # base da API NAuth
VITE_NAUTH_TENANT               # X-Tenant-Id do NAuth (config separada)
VITE_SITE_BASENAME=/            # basename do BrowserRouter
VITE_WHATSAPP_URL               # link do botão WhatsApp
VITE_INSTAGRAM_URL
VITE_CONTACT_EMAIL
```

## Operacional

- **Sem backend neste repo.** API Fortuno fica em `c:\repos\Fortuno\Fortuno`; Bruno collection em `c:\repos\Fortuno\Fortuno\bruno` — consultar contratos lá.
- **Docker NÃO disponível.** Não criar `docker-compose.yml`, não executar `docker` / `docker compose`.
- **Skills locais** (em `.claude/skills/`): `react-architecture`, `react-modal`, `react-alert`, `add-react-i18n`, `frontend-design`, `mermaid-chart`, `doc-manager`, `readme-generator`, `docker-compose-config`. Speckit commands em `.claude/commands/` (`speckit.specify`, `.plan`, `.tasks`, `.implement`, `.analyze`, `.checklist`, `.clarify`, `.constitution`, `.taskstoissues`).

## Recent Changes

- 001-fortuno-frontend: Added TypeScript 5.x + React 18.x (SPA)
