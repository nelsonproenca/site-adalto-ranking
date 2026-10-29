# Data Model: Site Institucional e Ranking de Presenteadores do Cantor Adalto Arcandes

**Feature**: [spec.md](./spec.md) | **Research**: [research.md](./research.md)

## Entidades

### `presenters` (Presenteador)

Representa uma pessoa que já fez pontos em pelo menos uma live, identificada de forma única pelo nome normalizado (FR-011).

| Campo | Tipo | Regras |
|---|---|---|
| `id` | uuid (PK) | Gerado automaticamente |
| `display_name` | text | Nome exibido publicamente; igual ao último valor digitado pelo admin para esse presenteador |
| `normalized_name` | text | `lower(trim(display_name))`; **único** — garante que o mesmo presenteador nunca seja duplicado no ranking (FR-011) |
| `created_at` | timestamptz | Data de criação do registro do presenteador |
| `updated_at` | timestamptz | Atualizado quando `display_name` muda |

**Regra de criação/atualização**: ao salvar um `live_entry`, o sistema normaliza o nome informado; se já existir um `presenters` com o mesmo `normalized_name`, reutiliza o `id` (e opcionalmente atualiza `display_name` para o valor mais recente digitado); caso contrário, cria um novo registro.

### `live_entries` (Registro de Live / Lançamento Diário)

Representa os pontos feitos por um presenteador em uma data específica (FR-003, FR-004).

| Campo | Tipo | Regras |
|---|---|---|
| `id` | uuid (PK) | Gerado automaticamente |
| `presenter_id` | uuid (FK → `presenters.id`) | Obrigatório |
| `live_date` | date | Obrigatório (FR-003); não há bloqueio técnico de data futura, mas a UI alerta o admin (edge case) |
| `points` | integer | Obrigatório; **≥ 0** (FR-005) |
| `created_by` | uuid (FK → admin do Supabase Auth, opcional) | Auditoria de quem lançou |
| `created_at` | timestamptz | Data/hora do lançamento original |
| `updated_at` | timestamptz | Atualizado a cada edição (FR-013) |

**Regras de negócio**:
- Múltiplos `live_entries` para o mesmo `presenter_id` e mesma `live_date` são permitidos e **somados** na agregação (FR-004, Assumption) — não há constraint de unicidade `(presenter_id, live_date)`.
- Editar um `live_entry` (data, presenteador ou pontos) e excluí-lo são operações suportadas pelo admin a qualquer momento (FR-013); a alteração reflete imediatamente nas views derivadas abaixo.

## Views Derivadas (somente leitura)

### Consulta diária (por `live_date`)

Agrupa `live_entries` por `presenter_id` dentro de uma `live_date`, somando `points` (cobre o caso de múltiplos lançamentos no mesmo dia para o mesmo presenteador) e trazendo o `display_name` do `presenters`.

Campos expostos: `presenter_display_name`, `points_do_dia`, `live_date`.

### Ranking acumulado

Agrupa todos os `live_entries` por `presenter_id` (sem filtro de data), somando `points` de todo o histórico, ordenado de forma decrescente, com posição calculada (`ROW_NUMBER()` ou equivalente) — atende FR-009/FR-010/SC-004.

Campos expostos: `posicao`, `presenter_display_name`, `total_acumulado`.

## Relacionamentos

```text
presenters (1) ──< (N) live_entries
```

Um presenteador pode ter zero ou vários `live_entries`; cada `live_entry` pertence a exatamente um presenteador.

## Validações (resumo, ver Requirements na spec para detalhe)

- `live_entries.points`: inteiro, não negativo (FR-005).
- `live_entries.live_date`, `presenter_id`/nome e `points`: obrigatórios antes de salvar (FR-005).
- `presenters.normalized_name`: único (FR-011).
- Acesso de escrita (`INSERT`/`UPDATE`/`DELETE` em `live_entries` e `presenters`) restrito ao admin autenticado via Row Level Security do Supabase (FR-002); leitura liberada publicamente para as views derivadas (FR-007, FR-009).
