# API Contracts: Site Institucional e Ranking de Presenteadores do Cantor Adalto Arcandes

**Feature**: [spec.md](../spec.md) | **Data Model**: [data-model.md](../data-model.md)

Todos os endpoints abaixo são Route Handlers do Next.js, servidos como funções na Vercel. Respostas em JSON. Datas no formato `YYYY-MM-DD`.

## Endpoints Administrativos (requerem sessão de admin autenticada)

### `POST /api/entries`

Cria um novo registro de live (FR-003, FR-004).

**Request body**:
```json
{
  "live_date": "2026-10-28",
  "presenter_name": "João Silva",
  "points": 150
}
```

**Responses**:
- `201 Created` → `{ "id": "uuid", "live_date": "...", "presenter_name": "...", "points": 150 }`
- `400 Bad Request` → campo ausente ou `points` negativo/não numérico (FR-005): `{ "error": "points deve ser um número não negativo" }`
- `401 Unauthorized` → sessão ausente/expirada

### `PATCH /api/entries/{id}`

Edita um registro existente (FR-013).

**Request body** (campos parciais permitidos): `{ "live_date"?, "presenter_name"?, "points"? }`

**Responses**:
- `200 OK` → registro atualizado
- `400 Bad Request` → validação falhou
- `401 Unauthorized`
- `404 Not Found` → `id` inexistente

### `DELETE /api/entries/{id}`

Exclui um registro existente (FR-013).

**Responses**:
- `204 No Content`
- `401 Unauthorized`
- `404 Not Found`

### `GET /api/entries?live_date=YYYY-MM-DD`

Lista os registros já cadastrados para uma data, para o admin revisar antes de adicionar novos (FR-012).

**Responses**:
- `200 OK` → `{ "live_date": "...", "entries": [ { "id", "presenter_name", "points" }, ... ] }`
- `401 Unauthorized`

## Endpoints Públicos (sem autenticação)

### `GET /api/public/entries?live_date=YYYY-MM-DD`

Consulta os valores de um dia específico (FR-007, FR-008).

**Responses**:
- `200 OK` com dados: `{ "live_date": "2026-10-28", "entries": [ { "presenter_name": "João Silva", "points": 150 }, ... ] }`
- `200 OK` sem dados: `{ "live_date": "2026-10-28", "entries": [] }` (o frontend exibe mensagem de "sem dados", não é erro — FR-008)
- `400 Bad Request` → `live_date` ausente ou em formato inválido

### `GET /api/public/ranking`

Consulta o ranking acumulado (FR-009, FR-010).

**Responses**:
- `200 OK` → `{ "ranking": [ { "position": 1, "presenter_name": "João Silva", "total_points": 980 }, { "position": 2, ... } ] }`

## Notas de contrato

- Nenhum endpoint público expõe `id`s internos de `presenters`/`live_entries` além do necessário para a UI do admin.
- Erros seguem o formato `{ "error": "mensagem amigável em pt-BR" }`.
- A normalização de `presenter_name` (lowercase + trim para agrupamento) acontece no servidor; o cliente sempre envia/recebe o nome como digitado (`display_name`).
