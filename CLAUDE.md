# fortuno-app Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-20

## Active Technologies

- TypeScript 5.x + React 18.x (SPA) (001-fortuno-frontend)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test; npm run lint

## Code Style

TypeScript 5.x + React 18.x (SPA): Follow standard conventions

## Recent Changes

- 001-fortuno-frontend: Added TypeScript 5.x + React 18.x (SPA)

<!-- MANUAL ADDITIONS START -->

## Fortuno Frontend — contexto operacional

- **Tipo**: SPA frontend-only (sem backend neste repo). API em `c:\repos\Fortuno\Fortuno`; Bruno collection em `c:\repos\Fortuno\Fortuno\bruno`.
- **Stack ativa**: React 18, TypeScript 5, Vite 6, React Router 6, i18next 25, **Tailwind CSS + tailwindcss-animate** (exigido por `nauth-react`), Fetch API.
- **Autenticação**: exclusivamente via `nauth-react` (`NAuthProvider`, `useAuth`, `useProtectedRoute`). SC-007 proíbe telas custom de auth.
- **Regra absoluta**: toda chamada à API Fortuno DEVE passar por `Services/apiHelpers.ts → getHeaders()` que injeta `X-Tenant-Id: fortuno` (SC-004) + Bearer token NAuth.
- **Arquitetura de entidade**: usar `/react-architecture` para TODA nova entidade. Gera `types/`, `Services/`, `Contexts/`, `hooks/` e registra provider em `main.tsx`.
- **Casing inviolável** (Princípio III): `Contexts/`, `Services/` (uppercase); `hooks/`, `types/` (lowercase).
- **Convenções**: `interface` (não `type`), arrow functions, `const` por padrão, PascalCase/camelCase/UPPER_CASE.
- **Env vars**: prefixo `VITE_` obrigatório (ex.: `VITE_API_URL`, `VITE_NAUTH_API_URL`, `VITE_NAUTH_TENANT`, `VITE_FORTUNO_TENANT_ID`).
- **Docker NÃO disponível**: não criar `docker-compose.yml`, não executar `docker`/`docker compose`.
- **Mocks**: criar APENAS quando detectar endpoint faltando durante implementação; marcar com `// MOCK: aguarda endpoint <path>` e registrar em `MOCKS.md` na raiz.
- **Feature ativa**: 001-fortuno-frontend — ver `specs/001-fortuno-frontend/{plan.md, research.md, data-model.md, contracts/api-endpoints.md, quickstart.md}`.
- **Violações constitucionais justificadas** (Complexity Tracking do plan): Tailwind em vez de Bootstrap (Princípio II); token NAuth Bearer em vez de `Basic` + chave `"login-with-metamask:auth"` (Princípio V). Amendment constitucional pendente pós-merge.

<!-- MANUAL ADDITIONS END -->
