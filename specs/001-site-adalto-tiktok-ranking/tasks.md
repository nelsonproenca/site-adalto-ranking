---
description: "Task list template for feature implementation"
---

# Tasks: Site Institucional e Ranking de Presenteadores do Cantor Adalto Arcandes

**Input**: Design documents from `/specs/001-site-adalto-tiktok-ranking/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/api.md](./contracts/api.md), [quickstart.md](./quickstart.md)

**Tests**: Não solicitados explicitamente na spec — nenhuma tarefa dedicada de teste automatizado foi gerada. A validação funcional é feita via [quickstart.md](./quickstart.md) (Polish phase).

**Organization**: Tarefas agrupadas por user story (spec.md) para permitir implementação e teste independentes de cada uma.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência de tarefa incompleta)
- **[Story]**: User story a que a tarefa pertence (US1, US2, US3, US4)
- Caminhos de arquivo seguem a estrutura definida em [plan.md](./plan.md)

## Path Conventions

Projeto único em Next.js (App Router) na raiz do repositório, conforme `plan.md`:
`app/`, `lib/`, `supabase/migrations/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialização do projeto e ferramentas base

- [X] T001 Inicializar projeto Next.js 14+ (App Router, TypeScript) na raiz do repositório, com a estrutura de pastas `app/`, `lib/`, `supabase/` descrita em [plan.md](./plan.md) — implementado com Next.js 16.4.3 (patch de segurança) + React 19
- [X] T002 [P] Instalar e configurar Tailwind CSS para estilização responsiva em `app/globals.css` e `tailwind.config.ts`
- [X] T003 [P] Configurar ESLint + Prettier para TypeScript/Next.js — ESLint 9 (flat config) por compatibilidade com Next 16
- [X] T004 Instalar `@supabase/supabase-js` e `@supabase/ssr`; criar `.env.local.example` documentando `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (research.md §2)

**Checkpoint**: Projeto Next.js roda localmente (`npm run dev`) sem nenhuma feature implementada ainda.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura central que TODAS as user stories dependem

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase estar completa

- [X] T005 Criar migração SQL em `supabase/migrations/0001_init.sql` com a tabela `presenters` (`id` uuid PK, `display_name` text, `normalized_name` text **único**, `created_at`, `updated_at`) conforme [data-model.md](./data-model.md)
- [X] T006 Adicionar, na mesma migração `supabase/migrations/0001_init.sql`, a tabela `live_entries` (`id` uuid PK, `presenter_id` uuid FK → `presenters.id`, `live_date` date **obrigatório**, `points` integer **obrigatório e ≥ 0**, `created_by` uuid opcional, `created_at`, `updated_at`), sem constraint de unicidade em `(presenter_id, live_date)` (data-model.md)
- [X] T007 Adicionar políticas de Row Level Security em `supabase/migrations/0002_rls.sql`: leitura pública liberada nas views derivadas; escrita (`INSERT`/`UPDATE`/`DELETE`) em `presenters` e `live_entries` restrita ao usuário admin autenticado (FR-002)
- [X] T008 Criar as views SQL `daily_entries_view` e `ranking_view` em `supabase/migrations/0003_views.sql`, conforme a seção "Views Derivadas" de [data-model.md](./data-model.md) (agrupamento por `presenter_id`/`live_date` e agregação acumulada ordenada)
- [X] T009 [P] Criar cliente Supabase para uso no browser em `lib/supabase/client.ts` (chave anônima)
- [X] T010 [P] Criar cliente Supabase para uso em servidor/Route Handlers em `lib/supabase/server.ts` (service role, apenas server-side)
- [X] T011 Criar middleware de proteção de rotas em `lib/supabase/middleware.ts` e `proxy.ts` (raiz) que valida sessão Supabase Auth para qualquer rota sob `/admin` e redireciona para `/admin/login` quando ausente (FR-002) — `middleware.ts` renomeado para `proxy.ts` (convenção do Next.js 16)
- [X] T012 Criar função de normalização e resolução/criação de presenteador em `lib/presenters.ts`: normaliza nome (`lower(trim(nome))`), busca `presenters` existente por `normalized_name` e reutiliza o `id`, ou cria um novo registro (FR-011)
- [X] T013 [P] Criar função de cálculo/consulta do ranking acumulado em `lib/ranking.ts`, lendo de `ranking_view` (FR-009, FR-010)
- [X] T014 [P] Criar layout raiz compartilhado em `app/layout.tsx` (navegação entre Home, Consulta, Ranking) e componente de estado vazio/erro reutilizável — direção visual "vinyl sleeve" estabelecida via skill `impeccable` (ver DESIGN.md)

**Checkpoint**: Base de dados migrada, clientes Supabase e lógica de normalização/ranking prontos — user stories podem começar.

---

## Phase 3: User Story 1 - Conhecer o cantor através do site institucional (Priority: P1) 🎯 MVP

**Goal**: Visitante entende rapidamente quem é Adalto Arcandes e seu estilo musical, sem precisar de login.

**Independent Test**: Publicar apenas esta página (sem nenhuma funcionalidade de ranking) e verificar que o conteúdo institucional é legível e navegável.

### Implementation for User Story 1

- [X] T015 [US1] Criar página institucional em `app/(public)/page.tsx` com apresentação do cantor Adalto Arcandes e seu estilo musical — cover de Raul Seixas e rock das décadas de 70, 80 e 90 (FR-001)
- [X] T016 [US1] Adicionar, na página `app/(public)/page.tsx`, link de navegação visível para a página de ranking das lives (acceptance scenario US1.1)
- [X] T017 [US1] Validar e ajustar o layout de `app/(public)/page.tsx` com Tailwind para exibição legível em mobile, sem necessidade de zoom ou scroll horizontal (acceptance scenario US1.2) — validado via `next build`/Tailwind responsive classes; sem verificação visual em navegador real (ver nota em Polish)

**Checkpoint**: Página institucional publicável e funcional de forma independente.

---

## Phase 4: User Story 2 - Admin registra os pontos da live diária (Priority: P1)

**Goal**: Admin autenticado cadastra, edita e exclui registros diários de pontos por presenteador.

**Independent Test**: Dar acesso apenas à tela de cadastro e verificar que o admin consegue selecionar uma data, informar nome do presenteador e valor de pontos, salvar, ver os registros do dia, editar e excluir.

### Implementation for User Story 2

- [X] T018 [US2] Criar página de login em `app/admin/login/page.tsx` usando Supabase Auth (e-mail/senha) (FR-002)
- [X] T019 [US2] Implementar `GET /api/entries` em `app/api/entries/route.ts`, retornando os registros já cadastrados para uma `live_date` informada via query string, para revisão do admin antes de novos cadastros (FR-012)
- [X] T020 [US2] Implementar `POST /api/entries` em `app/api/entries/route.ts`: validar que `live_date`, `presenter_name` e `points` foram preenchidos e que `points` é número inteiro não negativo (FR-005); usar `lib/presenters.ts` (T012) para resolver/criar o presenteador; permitir múltiplos registros para o mesmo presenteador na mesma data, somando-os na agregação (FR-004) (depende de T012)
- [X] T021 [US2] Implementar `PATCH /api/entries/{id}` em `app/api/entries/[id]/route.ts` para editar data, presenteador ou pontos de um registro existente (FR-013)
- [X] T022 [US2] Implementar `DELETE /api/entries/{id}` em `app/api/entries/[id]/route.ts` para excluir um registro existente (FR-013)
- [X] T023 [US2] Criar página `app/admin/lancamentos/page.tsx` com: seletor de data, campo de nome do presenteador, campo de valor de pontos, botão salvar, e lista dos registros já cadastrados para a data selecionada com ações de editar e excluir (FR-003, FR-012, FR-013) (depende de T019–T022)
- [X] T024 [US2] Exibir mensagens de erro de validação no formulário de `app/admin/lancamentos/page.tsx` quando campos obrigatórios estiverem vazios ou `points` for negativo/não numérico (FR-005, acceptance scenario US2.3)
- [X] T025 [US2] Confirmar que acessar `app/admin/lancamentos/page.tsx` ou `app/admin/login/page.tsx` sem sessão válida redireciona para o login sem exibir o formulário, reutilizando o middleware de T011 (acceptance scenario US2.4) — confirmado via smoke test HTTP (307 para `/admin/lancamentos` sem sessão)

**Checkpoint**: Admin consegue logar, cadastrar, visualizar, editar e excluir registros de live de forma independente.

---

## Phase 5: User Story 3 - Fã consulta os pontos de um dia específico (Priority: P2)

**Goal**: Visitante sem login consulta os valores de pontos de uma data específica.

**Independent Test**: Com ao menos um dia de registros cadastrados (US2), acessar a página pública, escolher a data e conferir que os valores batem com o cadastrado.

### Implementation for User Story 3

- [X] T026 [US3] Implementar `GET /api/public/entries` em `app/api/public/entries/route.ts`, lendo de `daily_entries_view` (T008) filtrando por `live_date` (FR-007)
- [X] T027 [US3] Criar página `app/(public)/consulta/page.tsx` com seletor de data e listagem dos presenteadores e pontos retornados pela API pública (FR-007, acceptance scenario US3.1) (depende de T026)
- [X] T028 [US3] Exibir, em `app/(public)/consulta/page.tsx`, mensagem amigável de "sem dados para esta data" quando a API retornar lista vazia, sem erro técnico (FR-008, acceptance scenario US3.2)

**Checkpoint**: Consulta pública por data funcional de forma independente (assumindo que já existam dados cadastrados via US2).

---

## Phase 6: User Story 4 - Fã consulta o ranking acumulado (Priority: P2)

**Goal**: Visitante sem login vê o ranking geral, somando os pontos de todos os dias por presenteador.

**Independent Test**: Cadastrar registros para o mesmo presenteador em dois ou mais dias (US2) e conferir que o ranking exibe a soma total correta, ordenada do maior para o menor.

### Implementation for User Story 4

- [X] T029 [US4] Implementar `GET /api/public/ranking` em `app/api/public/ranking/route.ts`, lendo de `ranking_view` (T008) via `lib/ranking.ts` (T013) (FR-009, FR-010)
- [X] T030 [US4] Criar página `app/(public)/ranking/page.tsx` listando posição, nome do presenteador e total acumulado, ordenado do maior para o menor valor (FR-009, FR-010, acceptance scenario US4.1, US4.2) (depende de T029)

**Checkpoint**: Todas as 4 user stories funcionam de forma independente.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validação, hospedagem e acabamento que afetam múltiplas user stories

- [~] T031 Executar manualmente todos os cenários de [quickstart.md](./quickstart.md) (US1 a US4) em ambiente local, confirmando os critérios de sucesso SC-001 a SC-005 — parcial: `next build`, `next lint` e smoke test HTTP de todas as rotas passaram com variáveis de ambiente placeholder; os cenários completos (login real, CRUD de dados reais, ranking com múltiplos dias) exigem um projeto Supabase real com as migrações aplicadas, o que não pôde ser feito neste ambiente
- [ ] T032 [P] Configurar projeto na Vercel (variáveis de ambiente de produção `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) e validar o deploy de produção — pendente: requer acesso às contas Vercel/Supabase do usuário
- [X] T033 [P] Revisar mensagens de erro e estados de carregamento em todas as páginas públicas e admin para garantir consistência em pt-BR
- [X] T034 Atualizar `README.md` com instruções de setup local, variáveis de ambiente e passos de deploy

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode começar imediatamente
- **Foundational (Phase 2)**: Depende da conclusão do Setup — BLOQUEIA todas as user stories
- **User Stories (Phase 3–6)**: Todas dependem da conclusão da Fase Foundational
  - US1 (Phase 3) é totalmente independente das demais
  - US3 (Phase 5) e US4 (Phase 6) dependem de haver dados cadastrados via US2 (Phase 4) para serem demonstradas com dados reais, mas suas tarefas de implementação (API + UI) não dependem tecnicamente do código de US2
- **Polish (Phase 7)**: Depende de todas as user stories desejadas estarem completas

### User Story Dependencies

- **User Story 1 (P1)**: Pode começar após a Fase Foundational — sem dependência de outras stories
- **User Story 2 (P1)**: Pode começar após a Fase Foundational — sem dependência de outras stories
- **User Story 3 (P2)**: Pode começar após a Fase Foundational — implementação independente; validação end-to-end se beneficia de dados criados via US2
- **User Story 4 (P2)**: Pode começar após a Fase Foundational — implementação independente; validação end-to-end se beneficia de dados criados via US2

### Dentro de cada User Story

- Rotas de API antes das páginas que as consomem
- Lógica de validação/normalização (Foundational) antes dos endpoints de escrita (US2)
- Story completa antes de avançar para a próxima prioridade (se trabalho sequencial)

### Parallel Opportunities

- Tarefas [P] da Fase 1 (T002, T003) podem rodar em paralelo
- Tarefas [P] da Fase 2 (T009, T010, T013, T014) podem rodar em paralelo entre si (após T005–T008 de migração)
- Após a Fase Foundational, US1, US2, US3 e US4 podem ser trabalhadas em paralelo por desenvolvedores diferentes
- Tarefas [P] da Fase 7 (T032, T033) podem rodar em paralelo

---

## Parallel Example: Fase Foundational

```bash
# Após T005–T008 (migrações) estarem prontos, rodar em paralelo:
Task: "Criar cliente Supabase para uso no browser em lib/supabase/client.ts"
Task: "Criar cliente Supabase para uso em servidor em lib/supabase/server.ts"
Task: "Criar função de cálculo/consulta do ranking acumulado em lib/ranking.ts"
Task: "Criar layout raiz compartilhado em app/layout.tsx"
```

## Parallel Example: Após a Fase Foundational

```bash
# Quatro desenvolvedores podem trabalhar em paralelo:
Task: "User Story 1 completa (T015-T017) — página institucional"
Task: "User Story 2 completa (T018-T025) — cadastro/admin"
Task: "User Story 3 completa (T026-T028) — consulta pública por data"
Task: "User Story 4 completa (T029-T030) — ranking acumulado"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Completar Fase 1: Setup
2. Completar Fase 2: Foundational (CRÍTICO — bloqueia todas as stories)
3. Completar Fase 3: User Story 1 (página institucional)
4. Completar Fase 4: User Story 2 (cadastro do admin) — sem isso não há dados para alimentar US3/US4
5. **PARAR e VALIDAR**: testar US1 e US2 independentemente (quickstart.md)
6. Deploy/demo se pronto

### Incremental Delivery

1. Setup + Foundational → Fundação pronta
2. Adicionar US1 → testar independentemente → Deploy/Demo
3. Adicionar US2 → testar independentemente → Deploy/Demo (agora há dados reais para alimentar US3/US4)
4. Adicionar US3 → testar independentemente (consulta por data) → Deploy/Demo
5. Adicionar US4 → testar independentemente (ranking acumulado) → Deploy/Demo
6. Cada story agrega valor sem quebrar as anteriores

---

## Notes

- [P] tasks = arquivos diferentes, sem dependências entre si
- [Story] label mapeia a tarefa à user story correspondente para rastreabilidade
- Nenhuma tarefa de teste automatizado foi incluída por não ter sido solicitada explicitamente na spec; a validação funcional ocorre via `quickstart.md` (T031)
- Fazer commit após cada tarefa ou grupo lógico de tarefas
- Parar em qualquer checkpoint para validar a story de forma independente
