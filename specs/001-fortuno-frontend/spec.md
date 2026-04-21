# Feature Specification: Fortuno — Frontend Público, Autenticado e Administrativo

**Feature Branch**: `001-fortuno-frontend`
**Created**: 2026-04-20
**Status**: Draft
**Input**: User description: "Frontend completo do sistema Fortuno — loteria online com venda de bilhetes, pagamento via PIX, dashboard do usuário, área administrativa com wizard de criação de sorteios, autenticação NAuth e páginas institucionais."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Comprar bilhete para sorteio em andamento (Priority: P1)

Um visitante chega à plataforma Fortuno atraído por um prêmio em destaque, escolhe o sorteio desejado, seleciona a quantidade de bilhetes (ou monta um combo com desconto), autentica-se ou cadastra-se se ainda não tiver conta, confirma números (aleatórios ou manuais), efetua o pagamento via PIX (QR Code + linha digitável) e recebe a lista de bilhetes comprados após a confirmação do pagamento.

**Why this priority**: Este é o fluxo monetizador central — sem ele, o produto não gera receita nem entrega a proposta de valor da plataforma (participação em sorteios). É o percurso de maior volume e o primeiro a ser validado em produção.

**Independent Test**: Pode ser totalmente testado abrindo a home, clicando em "Compre já" de uma loteria, escolhendo 5 bilhetes, completando o cadastro, optando por números aleatórios, simulando o pagamento via o ícone π e verificando que a tela final exibe os 5 bilhetes atribuídos — entregando o valor completo de participação no sorteio.

**Acceptance Scenarios**:

1. **Given** a home exibe um carousel com loterias em andamento, **When** o visitante clica em "Compre já" de uma loteria, **Then** é levado para a página de detalhe da loteria com descrição, imagens, regras, política de privacidade, lista de combos em 3 colunas e seletor de quantidade.
2. **Given** o visitante não está autenticado e clica em "Comprar", **When** o sistema detecta ausência de sessão, **Then** exibe telas de login/cadastro NAuth; após autenticar com dados incompletos, solicita completá-los antes de prosseguir.
3. **Given** o usuário autenticado escolheu 10 bilhetes e optou por "selecionar números", **When** digita um número já vendido, **Then** o sistema indica o conflito e não adiciona à lista; ao clicar em "Preencher o restante aleatoriamente", o sistema completa até 10 e habilita "Pagar".
4. **Given** o usuário clicou em pagar, **When** o QR Code PIX é gerado, **Then** a tela exibe QR Code, linha digitável copiável e cronômetro em tempo real, consultando o status periodicamente até confirmar o pagamento.
5. **Given** o pagamento foi confirmado, **When** o backend processa os bilhetes, **Then** o usuário vê uma tela de parabéns com a lista completa dos bilhetes comprados (número, loteria, data).
6. **Given** a tela de pagamento PIX está aberta, **When** o usuário clica no símbolo π semitransparente no canto inferior esquerdo, **Then** um simulador de pagamento é acionado e um toast confirma o disparo.

---

### User Story 2 - Autenticar e gerenciar a própria conta (Priority: P1)

Um usuário novo ou existente realiza cadastro, login, troca de senha, recuperação de senha e edição dos próprios dados de perfil por meio dos componentes do pacote `nauth-react`, incluindo os campos adicionais exigidos pela plataforma (CPF, endereço para premiação, etc).

**Why this priority**: Autenticação é pré-requisito para comprar bilhetes, acessar o dashboard, ver "Meus Números", "Meus Pontos" e administrar sorteios. Sem P2 funcional, P1 e as demais histórias não podem ser completadas.

**Independent Test**: Pode ser testado isoladamente abrindo `/login`, cadastrando um novo usuário, efetuando logout, fazendo login novamente, solicitando recuperação de senha por e-mail e alterando o cadastro pela tela de perfil — sem sair das rotas de conta.

**Acceptance Scenarios**:

1. **Given** um visitante acessa `/cadastro`, **When** preenche os campos obrigatórios e submete, **Then** o NAuth cria o usuário e o redireciona autenticado para o dashboard.
2. **Given** o usuário esqueceu a senha, **When** acessa "Recuperar senha" e informa o e-mail, **Then** recebe instruções e consegue definir nova senha via link recebido.
3. **Given** o usuário autenticado acessa "Alterar senha" no menu de conta, **When** informa senha atual e nova senha, **Then** a senha é atualizada e a sessão continua válida.
4. **Given** o usuário autenticado acessa "Meus dados", **When** edita nome, telefone ou endereço e salva, **Then** os dados persistem e são usados nos fluxos de compra e pagamento de comissões.
5. **Given** qualquer requisição autenticada à API do Fortuno, **When** enviada ao backend, **Then** inclui obrigatoriamente o header `X-Tenant-Id: fortuno` e o token emitido pelo NAuth.

---

### User Story 3 - Dashboard e acompanhamento de participação (Priority: P2)

Um usuário autenticado acessa seu dashboard pessoal logo após o login, vê contadores de tickets, loterias em que participa e pontos acumulados, obtém seu código de referência (`referralCode`) para compartilhar, acessa "Meus Números" (com seletor de loteria, layout estilo bilhete de loteria, paginação e busca), "Meus Pontos" (indicações com `totalPurchases` e `totalToReceive`) e, se for dono de alguma loteria, a lista de loterias que administra com botão "Crie seu sorteio".

**Why this priority**: É o valor pós-compra — engaja o usuário para novas compras (referência) e garante transparência sobre seus bilhetes/ganhos. Depende de P1 (tickets comprados) e P2 (login), mas entrega valor autônomo após a primeira compra.

**Independent Test**: Após login, o usuário acessa `/dashboard`, confere os contadores, copia o `referralCode`, entra em "Meus Números", seleciona uma loteria no seletor, filtra um número específico e pagina a lista — tudo sem precisar comprar nenhum bilhete durante o teste (usando dados pré-existentes).

**Acceptance Scenarios**:

1. **Given** o usuário fez login, **When** a página dashboard carrega, **Then** exibe `referralCode` copiável, contadores de tickets/loterias/pontos e os blocos "Meus Números" e "Meus Pontos" com atalho.
2. **Given** o usuário é dono de ao menos uma loteria, **When** o dashboard carrega, **Then** exibe o bloco "Loterias que administro" com atalho para gerenciar cada uma; caso contrário, o bloco não aparece.
3. **Given** o usuário acessa "Meus Números", **When** seleciona uma loteria no seletor, **Then** a lista é filtrada, cada ticket aparece estilizado como bilhete de loteria, a lista é paginada e há busca por número específico.
4. **Given** o usuário acessa "Meus Pontos", **When** a página carrega, **Then** exibe `referralCode`, `totalPurchases` e `totalToReceive`, mais a lista de comissões ganhas por indicação.

---

### User Story 4 - Administrar os próprios sorteios via wizard (Priority: P2)

Um usuário organizador cria ou edita uma loteria através de um wizard multi-etapas (Dados Básicos → Formato da Numeração → Descrições → Imagens → Combos → Sorteios → Prêmios → Ativação), gerencia cada uma na lista "Meus Sorteios" (filtro por status, destaque para abertos) e consegue mudar o status (cancelar, fechar, publicar) com modal quando houver campos obrigatórios adicionais.

**Why this priority**: Sem organizadores cadastrando loterias, não há oferta para os compradores. Entretanto, em MVP é possível popular loterias pelo backend; por isso vem após P1 e P2.

**Independent Test**: O usuário acessa "Novo Sorteio", percorre as 8 etapas do wizard preenchendo dados válidos, ativa a loteria e, em "Meus Sorteios", filtra por "Aberto" e vê a loteria recém-ativada, mudando seu status para "Fechado" via modal — sem depender da compra por outros usuários.

**Acceptance Scenarios**:

1. **Given** o usuário clica em "Crie seu sorteio", **When** o wizard abre, **Then** percorre 8 etapas nomeadas e numeradas; só avança quando a etapa atual for válida; pode voltar sem perder dados já preenchidos.
2. **Given** a etapa "Formato da Numeração" está ativa, **When** o organizador escolhe `Int64`, **Then** exibe `ticket_num_ini` e `ticket_num_end` e oculta `number_value_min`/`number_value_max`; para tipos `Composed*` o comportamento é inverso. Em ambos os casos, exibe cálculo e exemplos de possibilidades totais de bilhetes.
3. **Given** a etapa "Sorteios" (Raffles) tem pelo menos um sorteio cadastrado, **When** o organizador adiciona um segundo, **Then** o campo `include_previous_winners` fica habilitado.
4. **Given** a loteria está salva mas inativa, **When** o organizador chega à etapa final "Ativar o Sorteio" e confirma, **Then** o status muda para `Open` e a loteria aparece no carousel da home.
5. **Given** uma loteria já publicada, **When** o organizador abre a edição, **Then** entra no mesmo wizard com os dados preenchidos e pode atualizar nos limites permitidos pelo backend.
6. **Given** o organizador está em "Meus Sorteios" e clica em "Cancelar" em uma loteria aberta, **When** o sistema exige justificativa, **Then** abre um modal com o campo obrigatório e só executa após confirmação.

---

### User Story 5 - Navegação institucional e comunicado antifraude (Priority: P3)

Qualquer visitante acessa na home um carousel das loterias em andamento, uma área destacando o comunicado antifraude (texto adaptado ao Fortuno) e uma área de segurança/garantias com chamada para "Compre já", além de acessar "Quem Somos" e "Fale Conosco" pelo menu principal.

**Why this priority**: Reforça confiança e institucional, importante para conversão mas não bloqueante para a transação.

**Independent Test**: Abrir a home sem estar autenticado e verificar: carousel funcional, bloco antifraude com os dados Fortuno corretos, bloco "É fácil participar", CTA "Compre já" e links de menu levando a "Quem Somos" e "Fale Conosco" com conteúdo renderizado.

**Acceptance Scenarios**:

1. **Given** o visitante abre a home, **When** a página renderiza, **Then** exibe o carousel com as loterias em andamento (Status `Open`), o comunicado antifraude adaptado ao Fortuno, a área de segurança, o CTA "Compre já" e o texto "É fácil participar".
2. **Given** o visitante clica em "Quem Somos" ou "Fale Conosco" no menu, **When** a rota carrega, **Then** exibe a página institucional correspondente.

---

### Edge Cases

- **Números selecionados manualmente excedem a quantidade**: o sistema impede adicionar mais números do que a quantidade escolhida.
- **Número inválido para o `NumberType`**: para `Int64`, o número fora da faixa `[ticket_num_ini, ticket_num_end]` é rejeitado; para `Composed*`, números com componentes duplicados ou fora de `[number_value_min, number_value_max]` são rejeitados.
- **Cronômetro de PIX expira sem pagamento**: a tela exibe mensagem de expiração, oferece "Gerar novo QR Code" e libera a reserva dos números.
- **Usuário fecha o navegador durante o pagamento**: ao reabrir, consegue retomar o pagamento em aberto a partir do dashboard ou mensagens pendentes.
- **Conexão intermitente durante a seleção de números**: a verificação de disponibilidade é novamente executada antes do checkout para evitar inconsistências.
- **Menu "Meus Números" clicado por visitante não autenticado**: redireciona para login com retorno automático para "Meus Números" após autenticar.
- **Loteria em `Draft` ou `Closed`**: não aparece no carousel da home nem na listagem pública de sorteios, mas aparece em "Meus Sorteios" para o dono.
- **Edição de loteria com bilhetes vendidos**: o wizard bloqueia alteração de campos estruturais (preço, `NumberType`, faixa de números) e permite somente campos descritivos.
- **Carousel vazio**: se nenhuma loteria em andamento, a home exibe uma mensagem informativa e mantém os demais blocos (comunicado, segurança, "É fácil participar").
- **Download de PDF (regras / política)**: se o backend não expuser PDF, o frontend gera o PDF a partir do markdown no navegador.

## Requirements *(mandatory)*

### Funcionais — Navegação e institucional

- **FR-001**: O sistema DEVE exibir um menu principal com os itens: Home, Sorteios, Meus Números, Quem Somos, Fale Conosco.
- **FR-002**: O sistema DEVE exibir na home um carousel de loterias em andamento (Status `Open`), um bloco de comunicado antifraude com os dados do Fortuno, um bloco de segurança/garantias e um CTA "Compre já" com o texto "É fácil participar".
- **FR-003**: O sistema DEVE disponibilizar páginas institucionais "Quem Somos" e "Fale Conosco" acessíveis pelo menu principal. "Fale Conosco" DEVE listar canais de atendimento (WhatsApp, e-mail, redes sociais) com links externos (`wa.me`, `mailto:`, URLs), sem formulário nem chamada à API.

### Funcionais — Autenticação e conta (NAuth)

- **FR-010**: O sistema DEVE usar `nauth-react` para todas as telas e fluxos de autenticação e conta, cobrindo no mínimo: login, cadastro, troca de senha, recuperação de senha, alteração de dados de perfil, logout.
- **FR-011**: O sistema DEVE incluir o header `X-Tenant-Id: fortuno` em todas as requisições à API Fortuno, além do bearer token emitido pelo NAuth quando o usuário estiver autenticado.
- **FR-012**: Se o usuário iniciar uma compra sem estar autenticado, o sistema DEVE oferecer login ou cadastro e, após autenticação, exigir o preenchimento dos campos de perfil obrigatórios para a compra (como CPF e contato) antes de prosseguir.
- **FR-013**: O sistema DEVE proteger as rotas "Dashboard", "Meus Números", "Meus Pontos", "Meus Sorteios", "Novo Sorteio" e "Editar Sorteio", redirecionando o visitante para login com retorno automático à rota original.

### Funcionais — Sorteios (visão pública)

- **FR-020**: O sistema DEVE exibir a lista de sorteios disponíveis (`Open`), com filtro por ordem cronológica/prêmio/nome.
- **FR-021**: A página de detalhe da loteria DEVE conter carousel de imagens, descrição em markdown renderizada, links para "Regras" e "Política de Privacidade" com opção de download em PDF, lista de combos (`LotteryCombos`) em 3 colunas com seletor/entrada de quantidade que calcula valor, desconto e pacote aplicado, e botão "Comprar".
- **FR-022**: A validação do combo aplicado DEVE seguir `quantity_start` e `quantity_end` do combo e refletir o `discount_label` e `discount_value` em tempo real.

### Funcionais — Processo de compra e pagamento PIX

- **FR-030**: O botão "Comprar" DEVE iniciar o fluxo permitindo selecionar/escrever a quantidade de bilhetes dentro do intervalo `[ticketMin, ticketMax]` da loteria.
- **FR-031**: Após autenticação e preenchimento de perfil, o sistema DEVE perguntar "Deseja selecionar os números?" com opções Sim/Não.
- **FR-032**: Quando o usuário escolher "Sim", o sistema DEVE exibir campos de entrada adequados ao `NumberType` (para `Int64`, número inteiro; para `Composed*`, os N componentes), validar disponibilidade de cada número via API antes de adicionar à lista e oferecer botões "Pagar" e "Preencher o restante aleatoriamente".
- **FR-033**: Quando o usuário escolher "Não", o sistema DEVE enviar um pedido com `mode = Random` e seguir direto para o pagamento.
- **FR-034**: Ao iniciar o pagamento, o sistema DEVE exibir "Gerando QR Code", depois mostrar QR Code, linha digitável copiável e cronômetro regressivo sincronizado com a validade do PIX.
- **FR-035**: O sistema DEVE consultar periodicamente o status do pagamento e, ao confirmar, avançar para a tela de parabéns com a lista dos bilhetes comprados (número, loteria, data).
- **FR-036**: O sistema DEVE exibir um símbolo π semitransparente no canto inferior esquerdo da tela de pagamento; ao ser clicado, DEVE acionar o simulador de pagamento e exibir um toast informativo.

### Funcionais — Dashboard e áreas autenticadas

- **FR-040**: Ao logar, o usuário DEVE ser redirecionado ao dashboard, que DEVE exibir `referralCode` copiável, contadores de (quantidade de tickets, quantidade de loterias nas quais participa, pontos acumulados).
- **FR-041**: O dashboard DEVE exibir o bloco "Loterias que administro" apenas quando o usuário for dono de ao menos uma loteria, com atalho de gerenciamento; DEVE sempre exibir o botão "Crie seu sorteio" e atalhos para "Meus Números" e "Meus Pontos".
- **FR-042**: "Meus Números" DEVE exibir seletor de loteria, lista paginada com layout estilizado de bilhete de loteria e filtro por número específico.
- **FR-043**: "Meus Pontos" DEVE exibir `referralCode`, `totalPurchases`, `totalToReceive` e a lista de comissões ganhas por indicação (uma linha por venda gerada por indicação).
- **FR-044**: "Meus Sorteios" DEVE listar todos os sorteios do usuário ordenados com `Open` primeiro, com filtro por status, e permitir ao dono mudar o status (cancelar, fechar, publicar), abrindo modal com campos obrigatórios quando a operação exigir (p.ex., motivo do cancelamento).

### Funcionais — Wizard de Loteria (criação e edição)

- **FR-050**: O sistema DEVE implementar um wizard multi-etapas idêntico para criação e edição, com as 8 etapas: (1) Dados Básicos, (2) Formato da Numeração, (3) Descrições, (4) Imagens, (5) Combos, (6) Sorteios, (7) Prêmios, (8) Ativar o Sorteio; permitindo navegar entre etapas sem perda de dados já preenchidos/salvos.
- **FR-051**: Na etapa "Dados Básicos", o wizard DEVE coletar: `name`, `description`, `ticket_price`, `total_prize_value`, `ticket_min`, `ticket_max`, `referral_percent`.
- **FR-052**: Na etapa "Formato da Numeração", o wizard DEVE coletar `number_type`; quando `Int64`, DEVE exibir `ticket_num_ini` e `ticket_num_end`; quando `Composed*`, DEVE exibir `number_value_min` e `number_value_max`; em ambos os casos, DEVE mostrar em tempo real o cálculo e exemplos do total de possibilidades de bilhetes.
- **FR-053**: Na etapa "Descrições", o wizard DEVE subdividir em três campos markdown editáveis: `description_md`, `rules_md`, `privacy_policy_md`.
- **FR-054**: Na etapa "Imagens" (`LotteryImages`), o wizard DEVE permitir adicionar, remover e reordenar imagens.
- **FR-055**: Na etapa "Combos" (`LotteryCombos`), o wizard DEVE exibir a lista de combos no mesmo formato usado na venda e permitir cadastrar `name`, `quantity_start`, `quantity_end`, `discount_label`, `discount_value`.
- **FR-056**: Na etapa "Sorteios" (`Raffles`), o wizard DEVE exibir a lista ordenada por data e permitir cadastrar `name`, `description_md`, `raffle_datetime`, `include_previous_winners`; o campo `include_previous_winners` DEVE ficar habilitado a partir do segundo sorteio cadastrado.
- **FR-057**: Na etapa "Prêmios" (`RaffleAwards`), o wizard DEVE exibir a lista ordenada por sorteio e data do sorteio e permitir cadastrar `Sorteio (Raffle)`, `position`, `description`.
- **FR-058**: Na etapa "Ativar o Sorteio", o wizard DEVE exibir um resumo consolidado e um botão de ativação que move o status para `Open`.

### Funcionais — Resiliência e qualidade

- **FR-060**: O sistema DEVE exibir feedbacks consistentes via toast para ações assíncronas (sucesso, erro, aviso) e mensagens de erro amigáveis para falhas de rede/API.
- **FR-061**: O sistema DEVE ser responsivo (mobile-first) para as rotas públicas e de checkout; as áreas administrativas podem priorizar desktop, mas DEVEM permanecer usáveis em tablets.
- **FR-062**: O sistema DEVE implementar placeholders de layout (skeleton/mocked) **apenas quando uma lacuna for identificada durante a implementação** (funcionalidade sem endpoint na coleção Bruno). Cada mock DEVE ser marcado explicitamente no código (ex.: comentário `// MOCK: aguarda endpoint`) e registrado em um item de acompanhamento para reconexão quando o backend expuser a rota correspondente.

### Key Entities *(include if feature involves data)*

- **Lottery**: representa um sorteio/loteria. Atributos: `lotteryId`, `name`, `slug`, `descriptionMd`, `rulesMd`, `privacyPolicyMd`, `ticketPrice`, `totalPrizeValue`, `ticketMin`, `ticketMax`, `ticketNumIni`, `ticketNumEnd`, `numberType` (`Int64`, `Composed3..Composed8`), `numberValueMin`, `numberValueMax`, `referralPercent`, `status` (`Draft`, `Open`, `Closed`, `Cancelled`), imagens, combos, sorteios (Raffles).
- **LotteryCombo**: pacote de desconto aplicado automaticamente conforme a quantidade comprada. Atributos: `name`, `quantity_start`, `quantity_end`, `discount_label`, `discount_value`.
- **LotteryImage**: imagem anexada a uma loteria, usada no carousel público.
- **Raffle**: sorteio específico dentro de uma loteria. Atributos: `name`, `description_md`, `raffle_datetime`, `include_previous_winners`, status.
- **RaffleAward**: prêmio associado a um Raffle. Atributos: `position`, `description`, vínculo com o Raffle.
- **Ticket**: bilhete comprado. Atributos: `ticketId`, `lotteryId`, `userId`, `invoiceId`, `ticketNumber`, `ticketValue` (representação textual conforme `numberType`), `refundState`, `createdAt`.
- **TicketOrder**: pedido de compra. Atributos: `lotteryId`, `quantity`, `mode` (Aleatório | Manual), `pickedNumbers`, `referralCode`.
- **Invoice / PIX**: cobrança gerada para uma ordem; contém QR Code, linha digitável, validade/tempo restante e status em polling.
- **User (NAuth)**: identidade autenticada no tenant `fortuno`; usuário carrega também dados de perfil específicos do Fortuno (CPF, contato, endereço) necessários para a compra/comissão.
- **Referrer / Commission**: programa de indicação; cada usuário tem `referralCode`; comissões agregadas em `totalPurchases` e `totalToReceive`, detalhadas por venda gerada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um visitante não autenticado consegue completar o fluxo "escolher loteria → comprar 5 bilhetes → pagar via PIX → ver bilhetes" em menos de 5 minutos em conexão 4G.
- **SC-002**: 95% das consultas de status de pagamento PIX retornam um resultado perceptível ao usuário (confirmado, pendente ou expirado) em até 10 segundos após a confirmação no provedor.
- **SC-003**: Um organizador consegue concluir a criação completa de uma loteria (todas as 8 etapas do wizard) em até 10 minutos, e consegue editá-la posteriormente em até 3 minutos.
- **SC-004**: 100% das requisições autenticadas à API Fortuno são entregues com o header `X-Tenant-Id: fortuno`; 0 regressões permitidas após entrega.
- **SC-005**: O fluxo de cadastro + primeira compra converte em menos de 8 minutos para um usuário novo em seu primeiro acesso (medido em testes de usabilidade controlados).
- **SC-006**: A home carrega e exibe o carousel, o comunicado antifraude e o CTA de compra em menos de 3 segundos em conexões 4G padrão.
- **SC-007**: 100% das telas de autenticação (login, cadastro, troca, recuperação, edição) são fornecidas pelos componentes `nauth-react` — 0 telas de autenticação customizadas permitidas fora desse pacote.
- **SC-008**: Ao menos 90% dos usuários em testes de usabilidade conseguem localizar seu `referralCode` e copiar o link de indicação sem orientação externa.

## Assumptions

- **Backend já disponível**: todos os endpoints necessários estão na coleção Bruno em `c:\repos\Fortuno\Fortuno\bruno` (Lotteries, LotteryCombos, LotteryImages, Raffles, RaffleAwards, Tickets, Commissions, Referrals, Refunds). Campos faltantes ou ainda não expostos serão implementados em layout com placeholder até ficarem disponíveis.
- **Pagamento**: apenas PIX é suportado no MVP (QR Code + linha digitável). O ícone π dispara um endpoint de simulação já existente no backend para desenvolvimento.
- **Multi-tenant**: o Fortuno NÃO é multi-tenant; porém consome APIs multi-tenant (p.ex. NAuth, possivelmente ProxyPay), por isso o header `X-Tenant-Id: fortuno` é obrigatório em todas as requisições ao backend Fortuno e serviços consumidos.
- **Autenticação**: uso exclusivo do pacote `nauth-react`, incluindo todos os componentes já prontos para login, cadastro, troca/recuperação de senha, edição de perfil e logout; campos específicos do Fortuno (CPF, endereço, telefone) são completados através do mecanismo de atributos customizados já suportado pelo NAuth ou por tela complementar que só aparece quando necessário.
- **Internacionalização**: idioma padrão pt-BR; estrutura de i18n preparada para futura adição de outras línguas, sem priorização no MVP.
- **Layout e identidade visual**: logomarca e paleta canônicas são **inputs fixos do stakeholder** e NÃO serão repropostos pelo designer. As logomarcas oficiais estão em `assets/` na raiz do repo (`Fortuno-branca-transparente.png` para fundos escuros, `Fortuno-preta-transparente.png` para fundos claros) e a paleta canônica é: verde profundo `#0A2A20`, verde elegante `#134436`, dourado intenso `#B8963F`, dourado suave `#D4AF37`, preto `#0B0B0B`, off-white `#ECE8E1`. O agente `ux-designer` deriva tokens semânticos (background, surface, primary, secondary, success/warning/error), tipografia, raios, sombras e mockups a partir dessa base, garantindo contraste WCAG AA. Estilo sugerido: loteria/sorte com aura de segurança (confiança > excesso de cores festivas). Detalhamento em `plan.md` (Summary) e `research.md#R-17`.
- **Download PDF**: se o backend não expuser um endpoint para PDF das regras/política, o frontend gerará o PDF localmente a partir do markdown.
- **Acessibilidade**: conformidade mínima WCAG AA nos fluxos de checkout, login e dashboard.
- **Stack técnica**: React + TypeScript (implementado pelo agente `frontend-react-developer`), seguindo a arquitetura existente do projeto (types/service/context/hook/provider), i18n e uso dos componentes distintivos do design system.
- **Conteúdo das páginas institucionais**: "Quem Somos" e "Fale Conosco" serão páginas estáticas no MVP. "Fale Conosco" NÃO terá formulário — apenas listará canais de atendimento (WhatsApp via `wa.me`, e-mail via `mailto:`, Instagram/redes sociais via links externos), sem chamadas à API de contato.
