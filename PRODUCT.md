# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 14+ (App Router, TypeScript) + Tailwind CSS, Supabase (Postgres + Auth) como backend, hospedado na Vercel. Decidido durante o processo de especificação (`/speckit-plan`), condicionado pelas restrições explícitas do usuário (Supabase + Vercel).

## Users

- **Fã/visitante público** (sem login): chega pelo link na bio do TikTok, quer conhecer o cantor Adalto Arcandes e acompanhar os pontos das lives (do dia e o ranking acumulado).
- **Presenteador**: um fã que enviou presentes/pontos na live; consulta publicamente seu desempenho do dia e sua posição acumulada no ranking.
- **Admin** (autenticado): gestor das lives do cantor (não necessariamente o próprio Adalto); lança diariamente, após cada live, os pontos de cada presenteador; pode revisar, editar e excluir lançamentos.

## Product Purpose

Site institucional para o cantor Adalto Arcandes (cover de Raul Seixas e rock das décadas de 70/80/90) que também serve como ferramenta de engajamento: registra e expõe publicamente, dia a dia, os pontos que cada presenteador fez nas lives do TikTok, e mantém um ranking acumulado de todos os tempos. Sucesso = fãs voltam para conferir seu desempenho e o ranking, reforçando o engajamento nas lives futuras.

## Positioning

Não é apenas uma página de artista — é o "placar oficial" público e persistente das lives do cantor no TikTok, algo que o próprio TikTok não oferece (os dados do app somem/rolam; aqui ficam históricos, acumulados e com página própria de ranking).

## Operating Context

- Rotina diária: live no TikTok → logo depois, o admin acessa a área restrita e lança os pontos de cada presenteador daquele dia.
- Fãs acessam o site depois, fora da live, sem necessidade de conta, para conferir valores do dia e o ranking geral.
- Uso em qualquer dispositivo, mas com peso forte em mobile (tráfego vindo do link na bio do TikTok).

## Capabilities and Constraints

- Área pública: página institucional, consulta de pontos por data, ranking acumulado (soma de todos os dias, ordenado, com posição).
- Área admin (autenticada): cadastrar lançamento (data + nome do presenteador + pontos), listar lançamentos de uma data, editar e excluir qualquer lançamento já salvo.
- Nome do presenteador é normalizado (minúsculas + trim) para evitar duplicidade no ranking; não há cadastro/login prévio de presenteadores.
- Não há integração automática com a API do TikTok — lançamento é sempre manual pelo admin.
- Sem multilíngue: conteúdo e interface só em português (pt-BR).
- Admin é um papel único (uma conta), não múltiplos níveis de permissão nesta versão.

## Brand Commitments

- Nome do artista: **Adalto Arcandes**.
- Referência musical central e inegociável: **cover de Raul Seixas**, além de rock das décadas de **70, 80 e 90**.
- Tom pedido explicitamente pelo usuário: "rock show, mas profissional" — expressivo e com identidade de show de rock clássico, sem parecer amador ou descuidado.

## Evidence on Hand

- Nenhuma foto, logo ou asset visual real do cantor foi fornecido até o momento — o design deve prever placeholders de imagem claramente identificados, sem inventar fotos ou biografia factual além do que está descrito aqui (cover de Raul Seixas, rock 70/80/90).
- Especificação funcional completa em `specs/001-site-adalto-tiktok-ranking/spec.md` (user stories, requisitos, entidades, critérios de sucesso).

## Product Principles

1. O ranking e os valores diários precisam parecer confiáveis e "oficiais" — como um placar real, não uma planilha improvisada.
2. A experiência pública (consulta e ranking) é o motivo de o fã voltar ao site; deve ser rápida e sem fricção (sem login).
3. A área do admin prioriza velocidade de lançamento (rotina diária pós-live) sobre qualquer floreio visual.
4. Identidade visual remete a rock clássico/showbiz (Raul Seixas, 70/80/90) sem virar paródia nem comprometer a legibilidade dos dados.

## Accessibility & Inclusion

Nenhum requisito específico de acessibilidade foi levantado pelo usuário além dos padrões web razoáveis (contraste legível, navegação por teclado nos formulários do admin, layout responsivo sem scroll horizontal).
