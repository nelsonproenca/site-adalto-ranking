-- Consulta diária: soma de pontos por presenteador dentro de cada data
create or replace view daily_entries_view as
select
  le.live_date,
  p.id as presenter_id,
  p.display_name as presenter_display_name,
  sum(le.points)::integer as points_do_dia
from live_entries le
join presenters p on p.id = le.presenter_id
group by le.live_date, p.id, p.display_name;

-- Ranking acumulado: soma de pontos por presenteador em todo o histórico, ordenado
create or replace view ranking_view as
select
  row_number() over (order by sum(le.points) desc) as posicao,
  p.id as presenter_id,
  p.display_name as presenter_display_name,
  sum(le.points)::integer as total_acumulado
from live_entries le
join presenters p on p.id = le.presenter_id
group by p.id, p.display_name
order by total_acumulado desc;
