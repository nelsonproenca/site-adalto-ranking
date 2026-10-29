# Implementation Plan: Site Institucional e Ranking de Presenteadores do Cantor Adalto Arcandes

**Branch**: `001-site-adalto-tiktok-ranking` | **Date**: 2026-10-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-site-adalto-tiktok-ranking/spec.md`

## Summary

Site com uma página institucional pública sobre o cantor Adalto Arcandes e uma ferramenta de bastidores onde um admin autenticado lança, por data, os pontos feitos por cada presenteador na live do TikTok. O público consulta, sem login, os valores de um dia específico e um ranking acumulado (soma de todos os dias) por presenteador. Abordagem técnica: aplicação web única em Next.js (App Router) hospedada na Vercel, com Supabase como banco de dados Postgres e provedor de autenticação do admin. Nomes de presenteadores são normalizados (lowercase + trim) para evitar duplicidade no ranking acumulado; o admin pode editar/excluir qualquer registro já lançado.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20 (runtime da Vercel)

**Primary Dependencies**: Next.js 14+ (App Router, Server Actions/Route Handlers), `@supabase/supabase-js` + `@supabase/ssr` (client Supabase e sessão de auth), Tailwind CSS (estilização responsiva)

**Storage**: Supabase (Postgres gerenciado), com Row Level Security habilitado

**Testing**: Vitest (unidade — normalização de nome, cálculo de ranking), Playwright (E2E — fluxo de login do admin, cadastro de registro, consulta pública, ranking)

**Target Platform**: Web responsivo (desktop e mobile), hospedado na Vercel

**Project Type**: Aplicação web única (Next.js), sem necessidade de projetos/backends separados

**Performance Goals**: Páginas institucional e de consulta pública exibindo conteúdo em até 3s em conexão padrão (SC-005); cadastro de um registro pelo admin concluído em menos de 30s de interação (SC-001)

**Constraints**: Área administrativa protegida por autenticação (FR-002); páginas públicas sem exigir login (FR-007); layout responsivo sem scroll horizontal; idioma único pt-BR

**Scale/Scope**: Uso de um único artista/admin; dezenas de presenteadores distintos; um lançamento diário (podendo ter múltiplos presenteadores por dia); volume de dados baixo (centenas a poucos milhares de registros ao longo de anos) — sem necessidade de otimizações de escala

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

O arquivo `.specify/memory/constitution.md` ainda está no estado de template (placeholders não preenchidos, sem princípios ratificados para este projeto). Não há, portanto, gates de constituição aplicáveis a verificar nesta etapa. Nenhuma violação a registrar em Complexity Tracking.

**Re-check pós-Fase 1 (design)**: `research.md`, `data-model.md`, `contracts/api.md` e `quickstart.md` foram gerados sem introduzir dependências externas, serviços adicionais ou complexidade fora do já previsto (Next.js + Supabase + Vercel, projeto único). Como não há princípios ratificados na constituição, o gate permanece **PASS** sem exceções a justificar.

## Project Structure

### Documentation (this feature)

```text
specs/001-site-adalto-tiktok-ranking/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
app/
├── (public)/
│   ├── page.tsx                 # Página institucional (Home)
│   ├── consulta/page.tsx        # Consulta pública por data
│   └── ranking/page.tsx         # Ranking acumulado
├── admin/
│   ├── login/page.tsx           # Login do admin
│   └── lancamentos/page.tsx     # Cadastro/edição/exclusão de registros diários
└── api/
    ├── entries/route.ts         # Route handlers: criar/editar/excluir registros (admin)
    └── public/
        ├── entries/route.ts     # Leitura pública por data
        └── ranking/route.ts     # Leitura pública do ranking acumulado

lib/
├── supabase/
│   ├── client.ts                # Cliente Supabase (browser)
│   ├── server.ts                # Cliente Supabase (server/route handlers, com service role quando necessário)
│   └── middleware.ts            # Proteção de rotas /admin via sessão Supabase Auth
├── presenters.ts                 # Normalização de nome (lowercase + trim) e resolução/criação de presenteador
└── ranking.ts                    # Cálculo/consulta do ranking acumulado

supabase/
└── migrations/                   # Migrações SQL (tabelas, índices únicos, RLS policies)

tests/
├── unit/                         # Normalização de nomes, cálculo de ranking
├── integration/                  # Route handlers (criar/editar/excluir registro, leitura pública)
└── e2e/                          # Playwright: login admin, cadastro, consulta, ranking
```

**Structure Decision**: Aplicação web única em Next.js (App Router), combinando frontend e backend no mesmo projeto via Route Handlers — adequado ao escopo pequeno (um site + uma API simples) e à hospedagem na Vercel. Não há necessidade de projetos/repos separados para frontend e backend.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
