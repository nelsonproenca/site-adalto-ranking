# Feature Specification: Site Institucional e Ranking de Presenteadores do Cantor Adalto Arcandes

**Feature Branch**: `001-site-adalto-tiktok-ranking`

**Created**: 2026-10-28

**Status**: Draft

**Input**: User description: "preciso criar um site que vai se conectar a uma base de dados no supabase, ficara hospedado na vercel, seria um site para o cantor Adalto Arcandes, cover do Raul Seixas, tambem canta musicas de rock dos anos 70,80,90. para este site deve ter um pequeno institucional. sobre o cantor, deve ter uma ferramente onde um admin ira cadastrar diariamente os valores de cada presentador que participou de sua live no TikToc, deve ter a opção de selecionar uma data, colocar o nome do presenteador e o valor de pontos feitos na live. deve ter uma pagina publica para consultar o valor de cada dia e um ranking que vai acumulando o valor de todos os dias."

## Clarifications

### Session 2026-10-28

- Q: Se o admin cadastrar um registro com erro (data, nome ou valor errado), ele precisa conseguir corrigir ou excluir esse registro depois, ou isso fica fora do escopo desta primeira versão? → A: Admin pode editar e excluir qualquer registro já cadastrado, a qualquer momento.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Conhecer o cantor através do site institucional (Priority: P1)

Um visitante chega ao site pela primeira vez (por exemplo, através de um link compartilhado na bio do TikTok) e quer entender rapidamente quem é Adalto Arcandes, que tipo de show ele faz (cover de Raul Seixas e rock das décadas de 70, 80 e 90) e como acompanhar suas lives.

**Why this priority**: É a porta de entrada do site e a primeira impressão para novos fãs; sem essa página, o site não cumpre a função institucional básica que foi solicitada.

**Independent Test**: Pode ser testado publicando apenas a página institucional (sem nenhuma funcionalidade de ranking) e verificando que um visitante consegue ler as informações sobre o cantor sem precisar de login.

**Acceptance Scenarios**:

1. **Given** um visitante acessa a URL principal do site, **When** a página carrega, **Then** ele vê uma apresentação do cantor Adalto Arcandes, seu estilo musical (cover de Raul Seixas e rock 70/80/90) e um link para a página de ranking das lives.
2. **Given** um visitante está em um dispositivo móvel, **When** ele acessa o site institucional, **Then** o conteúdo é exibido de forma legível e navegável sem necessidade de zoom horizontal.

---

### User Story 2 - Admin registra os pontos da live diária (Priority: P1)

Diariamente, após o término da live no TikTok, o administrador do cantor acessa uma área restrita do site para registrar, para a data da live, o nome de cada presenteador (pessoa que enviou presentes/pontos durante a transmissão) e a quantidade de pontos que ela fez naquele dia.

**Why this priority**: É a funcionalidade central solicitada — sem o cadastro dos dados pelo admin, não existe conteúdo para alimentar a consulta pública nem o ranking acumulado. É tão crítica quanto a página institucional porque é o motivo de existir da ferramenta.

**Independent Test**: Pode ser testado de forma isolada dando acesso ao admin apenas à tela de cadastro e verificando que ele consegue selecionar uma data, informar nome do presenteador e valor de pontos, e salvar o registro com sucesso.

**Acceptance Scenarios**:

1. **Given** o admin está autenticado na área restrita, **When** ele seleciona uma data, informa o nome de um presenteador e um valor de pontos, e confirma, **Then** o sistema salva o registro e ele passa a aparecer na consulta pública daquele dia.
2. **Given** o admin já cadastrou presenteadores para o dia atual, **When** ele adiciona mais um presenteador para a mesma data, **Then** o novo registro é somado aos registros existentes do dia sem sobrescrever os anteriores.
3. **Given** o admin tenta salvar um registro sem preencher a data, o nome do presenteador ou o valor de pontos, **When** ele confirma o formulário, **Then** o sistema impede o salvamento e indica quais campos estão faltando.
4. **Given** um visitante não autenticado tenta acessar a área de cadastro, **When** ele navega até a URL do admin, **Then** o sistema solicita autenticação e não exibe o formulário de cadastro.
5. **Given** o admin percebe que cadastrou um registro com data, nome ou valor incorretos, **When** ele localiza esse registro na área restrita e o edita ou exclui, **Then** o sistema aplica a alteração (ou remoção) e os valores exibidos na consulta pública e no ranking acumulado refletem imediatamente a correção.

---

### User Story 3 - Fã consulta os pontos de um dia específico (Priority: P2)

Um fã ou um presenteador quer saber quanto cada pessoa pontuou na live de uma data específica, para acompanhar o próprio desempenho ou o dos amigos.

**Why this priority**: Depende dos dados cadastrados pelo admin (User Story 2), mas entrega valor direto ao público antes mesmo de existir o ranking acumulado total.

**Independent Test**: Pode ser testado assim que houver ao menos um dia com registros cadastrados, acessando a página pública, escolhendo a data e conferindo que os valores exibidos batem com o que o admin cadastrou.

**Acceptance Scenarios**:

1. **Given** existem registros cadastrados para uma data específica, **When** um visitante seleciona essa data na página pública, **Then** ele vê a lista de presenteadores daquele dia com os respectivos valores de pontos.
2. **Given** uma data não possui nenhum registro cadastrado, **When** um visitante seleciona essa data, **Then** o sistema informa que não há dados para o dia escolhido, sem gerar erro.

---

### User Story 4 - Fã consulta o ranking acumulado (Priority: P2)

Um fã quer ver o ranking geral de presenteadores, somando os pontos de todos os dias já cadastrados, para saber quem são os maiores apoiadores das lives ao longo do tempo.

**Why this priority**: É o diferencial de engajamento mencionado no pedido original (um ranking que "vai acumulando"), mas só faz sentido depois que existem múltiplos dias de dados — por isso vem depois da consulta diária.

**Independent Test**: Pode ser testado cadastrando registros para o mesmo presenteador em dois ou mais dias diferentes e conferindo que o ranking exibe a soma total correta, ordenada do maior para o menor valor acumulado.

**Acceptance Scenarios**:

1. **Given** um presenteador tem registros em múltiplos dias, **When** um visitante acessa a página de ranking, **Then** o valor exibido para esse presenteador é a soma de todos os pontos já cadastrados em seu nome.
2. **Given** vários presenteadores têm valores acumulados diferentes, **When** a página de ranking é exibida, **Then** a lista aparece ordenada do maior para o menor valor acumulado, com a posição (1º, 2º, 3º...) de cada presenteador.

---

### Edge Cases

- O que acontece quando o admin cadastra o mesmo nome de presenteador com grafia diferente (ex.: "João" vs "joao" vs "João "), gerando duplicidade no ranking acumulado?
- Como o sistema se comporta se o admin tentar cadastrar um valor de pontos negativo ou não numérico?
- O que acontece se o admin cadastrar um registro para uma data futura por engano?
- Como o sistema se comporta quando a conexão com o banco de dados (Supabase) está indisponível no momento em que um visitante tenta consultar a página pública?
- O que acontece se dois registros forem cadastrados para o mesmo presenteador na mesma data (deve somar ou é tratado como erro de duplicidade)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O site DEVE exibir uma página institucional pública com informações sobre o cantor Adalto Arcandes, incluindo seu estilo musical (cover de Raul Seixas e rock das décadas de 70, 80 e 90).
- **FR-002**: O sistema DEVE fornecer uma área administrativa protegida por autenticação, acessível apenas a usuários autorizados (admin).
- **FR-003**: O admin DEVE poder cadastrar um registro diário de live contendo: data da live, nome do presenteador e valor de pontos feitos por ele naquele dia.
- **FR-004**: O sistema DEVE permitir que o admin cadastre múltiplos presenteadores para a mesma data, sem sobrescrever registros já existentes daquele dia.
- **FR-005**: O sistema DEVE validar que data, nome do presenteador e valor de pontos foram preenchidos e que o valor de pontos é um número não negativo antes de salvar um registro.
- **FR-006**: O sistema DEVE persistir os registros cadastrados de forma durável (base de dados), de modo que fiquem disponíveis para consulta pública a qualquer momento após o cadastro.
- **FR-007**: O sistema DEVE fornecer uma página pública onde qualquer visitante, sem necessidade de login, possa selecionar uma data e visualizar os presenteadores e respectivos valores de pontos daquele dia.
- **FR-008**: O sistema DEVE informar de forma clara quando uma data consultada não possui nenhum registro, sem apresentar erro técnico ao visitante.
- **FR-009**: O sistema DEVE fornecer uma página pública de ranking geral, exibindo cada presenteador com o valor total acumulado de pontos somando todos os dias já cadastrados.
- **FR-010**: O ranking geral DEVE ser ordenado do maior para o menor valor acumulado, exibindo a posição de cada presenteador.
- **FR-011**: O sistema DEVE tratar o nome de cada presenteador de forma consistente (ex.: ignorando diferenças de maiúsculas/minúsculas e espaços nas extremidades) para que o mesmo presenteador seja somado corretamente no ranking acumulado, mesmo que o admin digite o nome de formas ligeiramente diferentes em dias distintos.
- **FR-012**: O admin DEVE poder visualizar, em sua área restrita, os registros já cadastrados para uma data, antes de adicionar novos.
- **FR-013**: O admin DEVE poder editar ou excluir qualquer registro de live já cadastrado, a qualquer momento, e essas alterações DEVEM refletir imediatamente na página pública de consulta e no ranking acumulado.

### Key Entities

- **Presenteador**: Pessoa que participou de uma live do cantor enviando presentes/pontos no TikTok. Atributos principais: nome (identificador usado para agrupar/ranquear). Pode acumular pontos em múltiplos dias ao longo do tempo.
- **Registro de Live (Lançamento Diário)**: Representa os pontos feitos por um presenteador em uma data específica. Atributos principais: data da live, nome do presenteador associado, valor de pontos daquele dia.
- **Ranking Acumulado**: Visão derivada que agrupa os Registros de Live por presenteador e soma o valor de pontos de todos os dias, ordenada do maior para o menor total.
- **Admin**: Usuário autorizado a cadastrar e visualizar os Registros de Live através da área restrita. Não é necessariamente o próprio cantor.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O admin consegue cadastrar os pontos de um presenteador para uma live em menos de 30 segundos, do início ao salvamento do registro.
- **SC-002**: 100% dos registros cadastrados pelo admin para uma data aparecem corretamente na página pública de consulta daquele mesmo dia, sem perda de dados.
- **SC-003**: Um visitante consegue encontrar e visualizar o ranking acumulado completo em até 2 cliques a partir da página inicial do site.
- **SC-004**: O valor total acumulado de cada presenteador no ranking corresponde exatamente à soma de todos os seus registros diários cadastrados, com 100% de precisão.
- **SC-005**: A página institucional e a página pública de consulta carregam e exibem conteúdo em até 3 segundos em uma conexão de internet padrão.

## Assumptions

- O "admin" é um papel único (gestor das lives do cantor, podendo ou não ser o próprio Adalto), autenticado com usuário e senha; não há, por ora, necessidade de múltiplos níveis de permissão ou múltiplos admins com papéis diferentes.
- Cada presenteador é identificado apenas pelo nome informado pelo admin (não há cadastro prévio de presenteadores nem login para eles); por isso o sistema deve normalizar o nome (ex.: ignorar maiúsculas/minúsculas e espaços) para evitar duplicidade no ranking.
- Quando o admin cadastra mais de um registro para o mesmo presenteador na mesma data, os valores são somados. O admin pode, a qualquer momento, editar ou excluir qualquer registro já cadastrado (ver seção Clarifications), inclusive para corrigir duplicidades criadas por engano.
- O ranking acumulado considera todo o histórico de registros desde o início do uso do sistema, sem janela de tempo limitada (ex.: não é apenas "último mês").
- O site é bilíngue não é necessário; todo o conteúdo e a interface serão em português, público-alvo brasileiro.
- Não há integração automática com a API do TikTok nesta versão — os valores de pontos são informados manualmente pelo admin após o encerramento de cada live.
- Não há necessidade de emitir notificações (e-mail, push) para presenteadores sobre sua posição no ranking nesta versão inicial.
