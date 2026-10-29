# Quickstart: Site Institucional e Ranking de Presenteadores do Cantor Adalto Arcandes

**Feature**: [spec.md](./spec.md) | **Contracts**: [contracts/api.md](./contracts/api.md) | **Data Model**: [data-model.md](./data-model.md)

Guia para validar, de ponta a ponta, que a feature funciona conforme as User Stories da spec.

## Pré-requisitos

- Projeto Supabase criado, com as tabelas `presenters` e `live_entries` migradas (ver [data-model.md](./data-model.md)) e Row Level Security habilitado (escrita só para admin autenticado; leitura das views públicas liberada).
- Uma conta de admin provisionada no Supabase Auth (e-mail/senha).
- Variáveis de ambiente configuradas localmente e na Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- Node.js 20+ instalado.

## Setup local

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Validação por cenário (mapeado às User Stories)

### US1 — Página institucional (P1)

1. Acesse `/` sem estar autenticado.
2. **Esperado**: ver apresentação do cantor Adalto Arcandes, estilo musical (cover Raul Seixas + rock 70/80/90) e link para a página de ranking.
3. Redimensione para largura mobile (ou use DevTools) e confirme que não há scroll horizontal.

### US2 — Admin registra pontos da live (P1)

1. Acesse `/admin/login` e autentique-se com a conta de admin.
2. Em `/admin/lancamentos`, selecione uma data, informe um nome de presenteador e um valor de pontos, e salve.
3. **Esperado**: resposta de sucesso e o registro aparece na listagem de registros daquela data (FR-012).
4. Repita o passo 2 para um segundo presenteador na mesma data.
5. **Esperado**: ambos os registros coexistem (FR-004), nenhum sobrescreve o outro.
6. Tente salvar com um campo vazio ou pontos negativos.
7. **Esperado**: erro de validação, nada é salvo (FR-005).
8. Edite um dos registros cadastrados (mude o valor de pontos) e, em seguida, exclua o outro.
9. **Esperado**: a edição e a exclusão são aplicadas e refletem imediatamente na consulta pública e no ranking (FR-013).
10. Acesse `/admin/lancamentos` em uma aba anônima (sem login).
11. **Esperado**: redirecionado para login; formulário de cadastro não é exibido (FR-002).

### US3 — Consulta pública por data (P2)

1. Acesse `/consulta` (sem login) e selecione a data usada no cenário US2.
2. **Esperado**: lista de presenteadores e pontos daquele dia, batendo com o que foi cadastrado.
3. Selecione uma data sem nenhum registro.
4. **Esperado**: mensagem informando que não há dados para o dia, sem erro técnico (FR-008).

### US4 — Ranking acumulado (P2)

1. Cadastre registros para o mesmo presenteador em pelo menos dois dias diferentes (reutilizando o fluxo de US2), incluindo uma variação de maiúsculas/espaços no nome (ex.: "joão silva " vs "João Silva").
2. Acesse `/ranking` (sem login).
3. **Esperado**: o presenteador aparece uma única vez (sem duplicidade — FR-011), com o total somado de todos os dias cadastrados (FR-009), e a lista está ordenada do maior para o menor valor, com posição numerada (FR-010).

## Critérios de aceite de performance (SC-001, SC-005)

- Medir o tempo entre abrir o formulário de cadastro e a confirmação de salvo: deve ficar abaixo de 30s de interação humana.
- Medir o tempo de carregamento de `/` e `/consulta` em uma conexão de internet padrão: deve ficar abaixo de 3s.
