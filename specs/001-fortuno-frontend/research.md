# Research — Fortuno Frontend

**Feature**: 001-fortuno-frontend
**Phase**: 0 (Outline & Research)
**Date**: 2026-04-20

Este documento consolida decisões técnicas e trade-offs considerados para viabilizar a spec com o menor desvio possível da Constituição.

---

## R-01 — Biblioteca de autenticação

- **Decisão**: usar `nauth-react@^0.2.7` sem customização visual nem substituição de telas.
- **Rationale**: exigência explícita do usuário ("Use todos os componentes do nauth-react"); a spec SC-007 proíbe telas de auth customizadas. O pacote já expõe `LoginForm`, `RegisterForm`, `ForgotPasswordForm`, `ResetPasswordForm`, `ChangePasswordForm`, `UserEditForm`, `SearchForm`, além de `NAuthProvider`, `useAuth`, `useUser`, `useProtectedRoute`, i18n pt-BR nativo e fingerprint de device.
- **Alternatives considered**: custom auth com Basic + MetaMask (Constituição atual) — rejeitado por violar a exigência do usuário e a spec; Auth0 / Clerk — rejeitado, projeto já tem NAuth como IdP canônico.
- **Impacto constitucional**: força Tailwind CSS e chave de storage própria — violações documentadas no plan (Complexity Tracking) e mitigadas.

## R-02 — Framework CSS

- **Decisão**: Tailwind CSS + `tailwindcss-animate`, com design tokens CSS do `ux-designer` em `src/styles/tokens.css`.
- **Rationale**: `nauth-react` só renderiza corretamente sob Tailwind (componentes usam classes utility como `flex`, `grid`, `text-*`, `space-*`, `animate-*`). Adotar Bootstrap obrigaria maintenance dual-stack.
- **Alternatives considered**: Bootstrap 5 (Constituição) — rejeitado por incompatibilidade; CSS Modules puros — rejeitado, gera retrabalho e perde o benefício da lib.
- **Follow-up**: amendment da Constituição (Princípio II) após merge.

## R-03 — Roteamento

- **Decisão**: `react-router-dom` 6.x com rotas declarativas em `App.tsx`, `ProtectedRoute` usando `useProtectedRoute` do `nauth-react`.
- **Rationale**: alinhado à Constituição (Princípio II) e já é peer-dependency recomendada do `nauth-react`.
- **Alternatives considered**: TanStack Router — rejeitado por adicionar superfície de stack; React Router 7 — não ratificado pela constituição.

## R-04 — Internacionalização

- **Decisão**: `i18next` 25.x + `react-i18next`. Para as telas do `nauth-react`, usar `createNAuthI18nInstance` (instância dedicada do NAuth) com as traduções `ptTranslations` exportadas pela lib; para o resto da aplicação, instância padrão com namespaces Fortuno em `src/i18n/locales/pt/fortuno.json`.
- **Rationale**: Constituição fixa i18next 25; o `nauth-react` integra-se transparentemente via `createNAuthI18nInstance`.
- **Alternatives considered**: FormatJS — rejeitado pela Constituição.
- **Assumption da spec**: pt-BR padrão; estrutura pronta para outras línguas no futuro.

## R-05 — Injeção do header `X-Tenant-Id: fortuno`

- **Decisão**: função central `apiHelpers.getHeaders(authenticated: boolean)` que sempre adiciona `X-Tenant-Id: fortuno` e, quando `authenticated = true`, adiciona `Authorization: Bearer {token}` lido via `useAuth()` do `nauth-react` (ou um leitor sincrônico do storage NAuth para uso em services não-hooks).
- **Rationale**: single source of truth para SC-004. Testes unitários cobrem o helper garantindo 100% de cobertura.
- **Alternatives considered**: interceptor Axios — Axios é legacy na Constituição; interceptor via Fetch wrapper per-service — multiplica pontos de erro.
- **Integração com `nauth-react`**: a própria `NAuthAPI` exportada pela lib faz chamadas ao NAuth (separado); **o helper Fortuno atinge apenas `VITE_API_URL`** (API Fortuno). Nenhuma chamada ao NAuth precisa de `X-Tenant-Id: fortuno` — NAuth roteia pelo próprio tenant config do `NAuthProvider`.

## R-06 — Estado global

- **Decisão**: Context API (uma Context por entidade) + `sessionStorage` para o wizard e o carrinho.
- **Rationale**: Constituição proíbe Redux/Zustand/MobX (Princípio II). A skill `/react-architecture` gera exatamente esse padrão.
- **Alternatives considered**: Zustand — rejeitado. React Query — avaliado, mas a skill já cobre loading/error/data manualmente com `useState`+`useCallback`; introduzir React Query criaria duplicação de padrão.

## R-07 — QR Code PIX e polling

- **Decisão**: usar `brCodeBase64` vindo do backend (`TicketQRCodeInfo`) para renderizar `<img>` direto (zero dependência). Manter `qrcode.react` opcional como fallback a partir de `brCode` (raw) caso o base64 venha vazio. Polling em `useQRCodePolling` com `setInterval` a cada 3s + backoff exponencial até 10s, cancelamento em `useEffect` cleanup, pausa quando aba está `hidden` (Page Visibility API), confirmação via status `3=Paid` (enum `TicketOrderStatus`).
- **Rationale**: atende SC-002 (resposta em ≤10s) sem sobrecarregar a API. `TicketQRCodeStatusInfo` já retorna a lista final `tickets` quando `status=3`, dispensando chamada adicional.
- **Alternatives considered**: Server-Sent Events / WebSocket — backend atual não expõe endpoint de stream, ficaria como débito. Polling constante de 2s — esgota backend em cenários de fila.

## R-08 — Simulador π (PI)

- **Decisão**: ícone "π" semitransparente (`opacity: 0.15`, tamanho 48×48, canto inferior esquerdo, `z-index` alto) visível apenas na `PaymentStep`. No click, chamar endpoint de simulação (a confirmar na Bruno collection — provavelmente `POST /tickets/qrcode/{invoiceId}/pay-simulate` ou equivalente; caso não exista, MOCK com `// MOCK: aguarda endpoint do backend — simulador PIX`) e emitir `toast.info("Simulador de pagamento acionado")`.
- **Rationale**: atende FR-036 sem chamar atenção do usuário final; visível apenas para quem souber procurar.
- **Open question**: localizar no backend (`Fortuno.API/Controllers/TicketsController.cs`) o endpoint do simulador. Anotar no `contracts/api-endpoints.md` ao confirmar.

## R-09 — Geração de PDF de Rules / Privacy

- **Decisão**: gerar PDF client-side com `jspdf` a partir do markdown já renderizado em HTML. Implementar em `Services/pdfService.ts`.
- **Rationale**: não há endpoint de PDF no backend hoje; gerar no cliente dispensa ciclo de dependência e evita tráfego extra.
- **Alternatives considered**: `@react-pdf/renderer` — maior bundle (100KB+) e API paralela; `pdfmake` — API verbosa.
- **Follow-up**: se o backend expuser PDF, trocar implementação mantendo interface do `pdfService.downloadRules(lotteryId)`.

## R-10 — Carousel

- **Decisão**: `keen-slider` para o carousel de loterias em andamento (home) e para as imagens da loteria na página de detalhe.
- **Rationale**: leve (~15KB), API imperativa, suporta touch, zero dependências, acessível com teclado.
- **Alternatives considered**: Swiper — maior (30KB+); Embla — mais novo, menor ecossistema.

## R-11 — Wizard de Loteria

- **Decisão**: casca `WizardShell` em `src/components/wizard/` com barra de passos, navegação Prev/Next, persistência parcial em `sessionStorage` por `lotteryId` (ou `draft` quando novo). Cada passo é um componente `StepX*.tsx` com `react-hook-form` (opt-in, fora da Constituição — ver decisão abaixo) ou controle nativo via `useState`.
- **Sub-decisão — forms**: **NÃO** adicionar `react-hook-form` no MVP. Usar `useState` + validação custom com `validators.ts`. Princípio II não veta libs de formulário, mas manter o Princípio da mínima superfície é preferível.
- **Persistência**: ao entrar no wizard com `lotteryId` existente, carregar dados do backend; quando `new`, criar a Lottery em rascunho (`status=Draft`) já no Step 1 para obter `lotteryId` e permitir upload de imagens/combos/raffles/awards (que exigem FK).
- **Rationale**: `LotteryCombos`, `LotteryImages`, `Raffles`, `RaffleAwards` precisam de `lotteryId` válido para serem criados — forçar persistência progressiva evita estado transitório gigante em memória.
- **Ativação**: Step 8 chama `POST /lotteries/{id}/publish` movendo status para `Open`.

## R-12 — Número e formatação

- **Decisão**: `utils/numberFormat.ts` com duas funções — `formatInt64(n)` (milhar separado por `.`) e `formatComposed(n, type)` (desagrega de 2 em 2 dígitos ordenado ascendente, conforme descrito no DTO `TicketInfo.TicketValue`).
- **Rationale**: o backend já persiste `ticketValue` textual, então a formatação é principalmente de exibição do input manual e do cálculo de possibilidades no wizard (C(N, k) para Composed*).

## R-13 — Testes

- **Decisão**: Vitest + `@testing-library/react` + `msw` (Mock Service Worker) para mockar a API em testes de componente.
- **Rationale**: stack padrão Vite; `msw` permite testar services sem tocar endpoints reais.
- **Cobertura prioritária**:
  1. `apiHelpers.getHeaders` (garante SC-004)
  2. `useQRCodePolling` (garante SC-002)
  3. Step 2 do wizard — cálculo de possibilidades para `Int64` e `Composed*`
  4. `NumberSelectionStep` — adicionar número, detectar conflito, completar aleatório
  5. `ComboSelector` — cálculo de desconto

## R-14 — Variáveis de ambiente

- **Decisão**: variáveis com prefixo `VITE_` (Constituição, Princípio VI):
  - `VITE_API_URL` — URL da API Fortuno (ex.: `https://dev.api.fortuno.example`)
  - `VITE_NAUTH_API_URL` — URL do NAuth (passada ao `NAuthProvider`)
  - `VITE_NAUTH_TENANT` — tenant NAuth (ex.: `fortuno` ou `fortuna` conforme env)
  - `VITE_SITE_BASENAME` — base path do React Router
  - `VITE_FORTUNO_TENANT_ID` — valor do header `X-Tenant-Id` (padrão: `fortuno`)
  - `VITE_WHATSAPP_URL`, `VITE_INSTAGRAM_URL`, `VITE_CONTACT_EMAIL` — canais da página "Fale Conosco" (Q2 = opção A)
- **Rationale**: Fortuno não é multi-tenant, mas a infraestrutura NAuth é; deixar `VITE_NAUTH_TENANT` configurável por env protege contra mudanças futuras.

## R-15 — Mocks e placeholders

- **Decisão** (conforme Q1 = opção C): criar mocks **apenas** quando lacuna for detectada durante implementação. Cada mock é marcado com `// MOCK: aguarda endpoint <path>` e registrado em `MOCKS.md` na raiz de `fortuno-app` (criado na primeira ocorrência). Nenhum mock especulativo.
- **Rationale**: evita reconexão desnecessária no futuro e mantém a base enxuta.

## R-16 — Responsividade e design

- **Decisão**: breakpoints Tailwind padrão (`sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`). Mobile-first. O `ux-designer` produzirá tokens (cores, tipografia, raios, sombras) e mockups das telas distintivas: Home (hero+carousel), LotteryDetail, checkout PIX, TicketCard, Dashboard, Wizard (shell e Step 2).
- **Rationale**: tokens do designer ficam em CSS vars; Tailwind lê via `theme.extend.colors` + `theme.extend.fontFamily`.
- **Follow-up**: antes do `/speckit.tasks`, o `ux-designer` entrega tokens + 6 mockups HTML/CSS.

## R-17 — Identidade visual (logomarca e paleta canônica)

- **Decisão**: usar as logomarcas oficiais já disponíveis em `assets/` na raiz do repositório e a paleta de cores canônica do Fortuno como tokens base; o `ux-designer` NÃO propõe nova paleta — apenas estende essa base (hover/active, estados de erro/sucesso, neutros adicionais).
- **Assets de logomarca** (em `C:\repos\Fortuno\fortuno-app\assets\`):
  - `Fortuno-branca-transparente.png` — para fundos escuros (header dark, hero sobre verde profundo, footer)
  - `Fortuno-preta-transparente.png` — para fundos claros (off-white, cartões)
  - Ambas devem ser copiadas para `public/` no bootstrap do Vite (ex.: `public/logo-light.png`, `public/logo-dark.png`) e referenciadas via `/logo-light.png` nos componentes `Header`/`Footer`/`LoginForm`.
- **Paleta canônica** (a ser declarada em `src/styles/tokens.css` e mapeada em `tailwind.config.js` sob `theme.extend.colors.fortuno`):

  | Token                    | Hex       | Uso sugerido                                         |
  |--------------------------|-----------|------------------------------------------------------|
  | `fortuno.green.deep`     | `#0A2A20` | Fundo principal de áreas escuras, hero, footer       |
  | `fortuno.green.elegant`  | `#134436` | Superfícies escuras secundárias, cards sobre verde   |
  | `fortuno.gold.intense`   | `#B8963F` | CTAs primários (Compre já, Pagar), destaques         |
  | `fortuno.gold.soft`      | `#D4AF37` | Hover dos CTAs dourados, bordas premium, bilhetes    |
  | `fortuno.black`          | `#0B0B0B` | Texto principal em fundo claro, stroke forte         |
  | `fortuno.offwhite`       | `#ECE8E1` | Fundo claro principal, superfície de cartão/bilhete  |

- **Guidance de aplicação** (para o `ux-designer`):
  - Combinação canônica: verde profundo + dourado intenso como par hero; off-white + preto para corpo de texto e leitura longa (descrições, regras, política).
  - Bilhete de loteria (`TicketCard`): fundo off-white, borda tracejada em dourado suave, número em preto com tamanho grande e tabular numbers.
  - Comunicado antifraude: background verde elegante, tipografia off-white, bloco "FIQUE LIGADO" em dourado intenso.
  - CTAs de compra: fundo dourado intenso → hover dourado suave; texto sempre preto para contraste AA.
  - Modo escuro: verde profundo como superfície primária, cards em verde elegante, CTAs em dourado intenso; logomarca branca.

- **Rationale**: fixar a paleta antecipadamente evita ciclos de ida-e-volta com o `ux-designer` sobre cores e mantém coerência com a marca já definida pelo stakeholder.
- **Follow-up**: `ux-designer` deriva tokens semânticos (background, surface, primary, secondary, success/warning/error) a partir desses 6 tokens de marca, garantindo contraste WCAG AA para todos os pares texto/fundo usados.

---

## NEEDS CLARIFICATION remaining

Nenhum marcador `NEEDS CLARIFICATION` restante. As 2 clarificações (Q1 e Q2) foram resolvidas na fase `/speckit.specify`. Open questions técnicas (R-08) são de escopo de implementação e não bloqueiam o plan.
