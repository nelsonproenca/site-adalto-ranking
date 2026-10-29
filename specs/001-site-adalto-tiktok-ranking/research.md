# Research: Site Institucional e Ranking de Presenteadores do Cantor Adalto Arcandes

**Feature**: [spec.md](./spec.md) | **Date**: 2026-10-28

Nenhum item do Technical Context ficou marcado como `NEEDS CLARIFICATION`. Este documento registra as decisões técnicas derivadas das restrições já dadas pelo usuário (Supabase + Vercel) e dos requisitos da spec, com alternativas consideradas.

## 1. Framework de aplicação web

- **Decision**: Next.js 14+ (App Router), TypeScript, implantado na Vercel.
- **Rationale**: A Vercel é a plataforma de hospedagem nativa do Next.js (deploy zero-config, Route Handlers rodando como funções serverless/edge). Permite um único projeto cobrindo páginas públicas, área admin e API, o que é proporcional ao escopo pequeno do site.
- **Alternatives considered**: SPA (Vite/React) + backend separado (Express/Fastify) — rejeitado por adicionar um segundo projeto/deploy sem necessidade, já que a Vercel executa Route Handlers do Next.js nativamente. Remix — também viável, mas Next.js tem integração mais direta e documentada com Supabase e Vercel.

## 2. Banco de dados e acesso a dados

- **Decision**: Supabase Postgres, acessado via `@supabase/supabase-js` no servidor (Route Handlers/Server Components) usando a chave de serviço (service role) apenas em código server-side; o client browser usa a chave anônima apenas para leitura pública, se necessário.
- **Rationale**: Já definido pelo usuário como requisito ("conectar a uma base de dados no Supabase"). Postgres relacional é adequado ao modelo de dados simples (registros diários + agregação por presenteador).
- **Alternatives considered**: Acesso direto ao Postgres via ORM (Prisma/Drizzle) sem passar pelo SDK do Supabase — viável, mas abrimos mão dos recursos de Auth e RLS prontos do Supabase sem ganho real para este escopo; optou-se por usar o SDK oficial.

## 3. Autenticação do admin

- **Decision**: Supabase Auth (e-mail/senha), com uma única conta de admin provisionada manualmente (fora do fluxo de self-signup público). Sessão validada em middleware do Next.js para proteger as rotas `/admin/*` e os Route Handlers de escrita.
- **Rationale**: Atende ao FR-002 (área restrita autenticada) e à suposição de "admin único" documentada na spec, reaproveitando a infraestrutura de auth já incluída no Supabase, sem necessidade de um provedor de identidade adicional.
- **Alternatives considered**: Autenticação própria com hash de senha em tabela customizada — rejeitada por reinventar algo que o Supabase Auth já resolve com segurança (rate limiting, recuperação de senha, etc.).

## 4. Normalização e unicidade de presenteadores

- **Decision**: Tabela `presenters` com `display_name` (como o admin digitou da última vez) e `normalized_name` (lowercase + trim, com índice único). Ao cadastrar um registro, o sistema normaliza o nome informado e reaproveita o presenteador existente (ou cria um novo) — nunca duplica por diferença de maiúsculas/espaços.
- **Rationale**: Implementa diretamente o FR-011 e o edge case de duplicidade por grafia. Mantém o nome "bonito" para exibição (`display_name`) enquanto garante agregação correta no ranking (`normalized_name`).
- **Alternatives considered**: Normalizar apenas na query de agregação do ranking (sem tabela própria) — mais simples, mas dificulta a função de editar/excluir registros com consistência (FR-013) e a exibição de um nome canônico único por presenteador; rejeitado em favor da tabela dedicada.

## 5. Cálculo do ranking acumulado

- **Decision**: Visão (SQL `VIEW`) ou query agregada (`GROUP BY presenter_id`, `SUM(points)`, `ORDER BY total DESC`) sobre a tabela de registros, exposta por um Route Handler público (`/api/public/ranking`) com cache curto (ex.: revalidação a cada poucos minutos).
- **Rationale**: Atende FR-009/FR-010 com precisão (SC-004) sem necessidade de manter um contador redundante; qualquer edição/exclusão de registro (FR-013) se reflete automaticamente no próximo cálculo.
- **Alternatives considered**: Manter um campo `total_points` desnormalizado na tabela `presenters`, atualizado via trigger — ganho de performance desnecessário para o volume de dados esperado (baixo); descartado por adicionar complexidade de sincronização.

## 6. Testes

- **Decision**: Vitest para lógica pura (normalização de nome, ordenação/soma do ranking) e Playwright para os fluxos ponta a ponta descritos nas User Stories (login admin, cadastro, consulta por data, ranking).
- **Rationale**: Cobre tanto unidades críticas de regra de negócio quanto os cenários de aceitação da spec, com ferramentas padrão do ecossistema Next.js/Vercel.
- **Alternatives considered**: Jest — substituído por Vitest por melhor integração com TypeScript/ESM nativo do Next.js moderno.

## Resumo

Todas as incógnitas técnicas foram resolvidas a partir das restrições já fornecidas (Supabase + Vercel) e dos requisitos funcionais da spec. Nenhum `NEEDS CLARIFICATION` permanece no Technical Context.
