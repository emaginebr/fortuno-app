<!--
SYNC IMPACT REPORT
==================
Version change: (template) → 1.0.0 (INITIAL RATIFICATION)
Bump rationale: Primeira adoção formal da constituição do projeto — MAJOR 1.0.0.

Modified principles:
  - [PRINCIPLE_1_NAME] → I. Skill Obrigatória para Arquitetura Frontend (NÃO-NEGOCIÁVEL)
  - [PRINCIPLE_2_NAME] → II. Stack Técnica Fixa
  - [PRINCIPLE_3_NAME] → III. Case Sensitivity de Diretórios (INVIOLÁVEL)
  - [PRINCIPLE_4_NAME] → IV. Convenções de Código TypeScript/React
  - [PRINCIPLE_5_NAME] → V. Autenticação e Segurança
  - (novo)             → VI. Variáveis de Ambiente (prefixo VITE_)

Added sections:
  - Princípio VI adicionado (além dos 5 do template base)
  - "Fluxo de Desenvolvimento & Quality Gates" (Section 2)
  - "Checklist para Novos Contribuidores" (Section 3)

Removed sections: nenhuma.

Templates requiring updates:
  - ✅ .specify/memory/constitution.md (este arquivo)
  - ⚠ .specify/templates/plan-template.md — pendente: seção "Constitution Check"
    ainda genérica; gates derivados destes princípios devem ser adicionados em
    próxima amendment se o time quiser automatizar validação por PR.
  - ⚠ .specify/templates/spec-template.md — sem alterações necessárias agora
    (constituição não introduz nova seção obrigatória no spec).
  - ⚠ .specify/templates/tasks-template.md — sem alterações necessárias agora
    (constituição não introduz nova categoria de tarefa cross-cutting).
  - N/A .specify/templates/commands/ — diretório inexistente neste projeto;
    comandos ficam em .claude/commands/ e não referenciam princípios específicos.
  - ⚠ README.md — atualmente mínimo; considerar linkar esta constituição em
    amendment futura se o projeto crescer.

Follow-up TODOs: nenhum placeholder diferido.
-->

# Fortuno App Constitution

## Core Principles

### I. Skill Obrigatória para Arquitetura Frontend (NÃO-NEGOCIÁVEL)

Toda nova entidade, feature module ou domínio criado no frontend **DEVE** ser
implementado via a skill `react-architecture` (invocação `/react-architecture`).
Essa skill é a fonte única para geração de Types, Service, Context, Hook e
registro do Provider em `main.tsx`, e cobre os padrões obrigatórios de
tratamento de erros (`handleError`, `clearError`) e `loading state`.

**Regras derivadas (MUST):**
- MUST invocar `/react-architecture` ao criar um novo módulo de domínio.
- MUST NOT reimplementar manualmente os padrões de Types/Service/Context/Hook.
- MUST NOT divergir do provider chain definido pela skill.

**Rationale:** uniformidade arquitetural e prevenção de divergência entre
módulos. Reimplementar manualmente produz drift silencioso que degrada o padrão.

### II. Stack Técnica Fixa

A stack abaixo é canônica. Adições, trocas ou remoções exigem amendment formal
desta constituição.

| Tecnologia    | Versão   | Finalidade                              |
|---------------|----------|-----------------------------------------|
| React         | 18.x     | Framework UI                            |
| TypeScript    | 5.x      | Tipagem estática                        |
| React Router  | 6.x      | Roteamento SPA                          |
| Vite          | 6.x      | Build toolchain                         |
| Bootstrap     | 5.x      | Sistema de grid e componentes base      |
| i18next       | 25.x     | Internacionalização                     |
| Axios         | 1.x      | HTTP client (legado)                    |
| Fetch API     | Nativo   | HTTP client (novos serviços)            |

**Regras (MUST / MUST NOT):**
- MUST usar Vite como bundler. MUST NOT usar CRA, Webpack manual ou outros.
- MUST NOT introduzir bibliotecas de state management global (Redux, Zustand,
  MobX). Context API é o padrão.
- MUST NOT executar `docker` ou `docker compose` no ambiente local — Docker não
  está disponível.
- Novos serviços HTTP MUST usar Fetch API; Axios fica apenas em código legado.

**Rationale:** estabilidade do ecossistema, menor superfície de manutenção e
previsibilidade de onboarding.

### III. Case Sensitivity de Diretórios (INVIOLÁVEL)

| Diretório    | Casing      | Motivo                            |
|--------------|-------------|-----------------------------------|
| `Contexts/`  | Uppercase C | Compatibilidade Docker/Linux      |
| `Services/`  | Uppercase S | Compatibilidade Docker/Linux      |
| `hooks/`     | Lowercase h | Convenção React                   |
| `types/`     | Lowercase t | Convenção TypeScript              |

**Regra (MUST):** todos os imports MUST corresponder exatamente ao casing no
disco.

**Rationale:** Windows é case-insensitive no filesystem, mas builds Linux e
containers não são. Divergência de casing passa localmente e quebra em CI/prod.

### IV. Convenções de Código TypeScript/React

| Elemento             | Convenção               | Exemplo                        |
|----------------------|-------------------------|--------------------------------|
| Componentes          | PascalCase              | `LoginPage`, `CampaignCard`    |
| Interfaces           | PascalCase              | `CampaignContextType`          |
| Variáveis / Funções  | camelCase               | `getHeaders`, `loadCampaigns`  |
| Constantes           | UPPER_CASE              | `AUTH_STORAGE_KEY`             |
| Tipos                | `interface` (não `type`)| `interface CampaignInfo {}`    |
| Funções              | Arrow functions         | `const fn = () => {}`          |
| Variáveis            | `const` por padrão      | `const campaigns = []`         |

**Regras (MUST):**
- MUST usar `interface` em vez de `type` para tipos de objeto.
- MUST declarar funções como arrow functions.
- MUST usar `const` por padrão; `let` apenas quando reatribuição é necessária.

**Rationale:** consistência tipográfica e ergonomia de leitura em todo o
codebase; facilita revisão, busca e refactor.

### V. Autenticação e Segurança

| Aspecto  | Padrão                                                   |
|----------|----------------------------------------------------------|
| Header   | `Authorization: Basic {token}`                           |
| Storage  | localStorage, chave `"login-with-metamask:auth"`         |

**Regras (MUST NOT):**
- MUST NOT armazenar tokens em cookies — usar localStorage.
- MUST NOT expor connection strings, chaves privadas ou outros secrets no
  código frontend ou em bundles.

**Rationale:** alinhamento com o fluxo de autenticação existente (login with
MetaMask) e separação estrita entre segredos server-side e código entregue ao
navegador.

### VI. Variáveis de Ambiente (prefixo VITE_)

| Variável              | Obrigatória | Descrição                       |
|-----------------------|-------------|---------------------------------|
| `VITE_API_URL`        | Sim         | URL base da API backend         |
| `VITE_SITE_BASENAME`  | Não         | Base path do React Router       |

**Regras (MUST):**
- MUST usar o prefixo `VITE_` para toda variável de ambiente exposta ao
  frontend.
- MUST acessar via `import.meta.env.VITE_*`.
- MUST NOT usar o prefixo `REACT_APP_` (padrão CRA, incompatível com Vite).

**Rationale:** Vite só expõe ao bundle client-side variáveis prefixadas com
`VITE_`; qualquer outro prefixo resulta em `undefined` em runtime.

## Fluxo de Desenvolvimento & Quality Gates

Toda contribuição ao frontend MUST satisfazer os gates abaixo antes de merge:

1. **Gate de Arquitetura:** novas entidades foram criadas via
   `/react-architecture` (Princípio I).
2. **Gate de Stack:** nenhuma dependência fora da stack do Princípio II foi
   adicionada sem amendment constitucional.
3. **Gate de Casing:** imports batem exatamente com o casing em disco
   (Princípio III) — verificar em ambiente Linux/CI, não apenas Windows.
4. **Gate de Convenções:** código segue as convenções do Princípio IV.
5. **Gate de Segurança:** nenhum secret em bundle; tokens apenas em
   localStorage com a chave canônica (Princípio V).
6. **Gate de Env Vars:** toda nova variável de ambiente frontend usa prefixo
   `VITE_` (Princípio VI).

Violações devem ser justificadas na seção "Complexity Tracking" do plan
correspondente antes de serem aceitas.

## Checklist para Novos Contribuidores

Antes de submeter qualquer código frontend, verifique:

- [ ] Utilizou a skill `react-architecture` para novas entidades frontend.
- [ ] Imports respeitam o casing exato dos diretórios
      (`Contexts/`, `Services/`, `hooks/`, `types/`).
- [ ] Variáveis de ambiente frontend usam prefixo `VITE_` e são acessadas via
      `import.meta.env.VITE_*`.
- [ ] Nenhuma biblioteca de state management global foi introduzida.
- [ ] Tokens de autenticação são armazenados apenas em localStorage com a
      chave `"login-with-metamask:auth"`.
- [ ] Nenhum secret foi incluído no bundle frontend.

## Governance

Esta constituição supersede quaisquer convenções informais, padrões ad-hoc ou
decisões isoladas de PRs anteriores. Todo código mergeado no `main` MUST estar
em conformidade com os princípios acima.

**Amendment procedure:**
1. Proponente abre PR alterando `.specify/memory/constitution.md` com a
   mudança e um Sync Impact Report atualizado.
2. Versão MUST ser incrementada conforme política abaixo.
3. Templates dependentes (`.specify/templates/*.md`) MUST ser revisados e
   sincronizados no mesmo PR.
4. Aprovação requer revisão explícita do responsável técnico pelo frontend.

**Versioning policy (SemVer):**
- **MAJOR:** remoção ou redefinição incompatível de princípio/governança.
- **MINOR:** adição de novo princípio ou expansão material de guidance.
- **PATCH:** clarificações, correção de redação, refinamentos não-semânticos.

**Compliance review:** toda PR MUST checar os gates descritos na seção
"Fluxo de Desenvolvimento & Quality Gates". Violações não-justificadas
bloqueiam o merge. Guidance operacional em tempo de desenvolvimento reside nos
templates em `.specify/templates/` e nas skills registradas em
`.claude/skills/`.

**Version**: 1.0.0 | **Ratified**: 2026-04-02 | **Last Amended**: 2026-04-06
