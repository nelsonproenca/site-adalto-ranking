alter table presenters enable row level security;
alter table live_entries enable row level security;

-- Leitura pública liberada (consulta por data e ranking são públicos)
create policy "presenters_public_read" on presenters
  for select using (true);

create policy "live_entries_public_read" on live_entries
  for select using (true);

-- Escrita restrita a usuários autenticados (admin)
create policy "presenters_admin_write_insert" on presenters
  for insert to authenticated with check (true);

create policy "presenters_admin_write_update" on presenters
  for update to authenticated using (true) with check (true);

create policy "live_entries_admin_write_insert" on live_entries
  for insert to authenticated with check (true);

create policy "live_entries_admin_write_update" on live_entries
  for update to authenticated using (true) with check (true);

create policy "live_entries_admin_write_delete" on live_entries
  for delete to authenticated using (true);
