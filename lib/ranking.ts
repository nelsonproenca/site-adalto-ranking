import type { SupabaseClient } from "@supabase/supabase-js";

export type RankingEntry = {
  posicao: number;
  presenter_display_name: string;
  total_acumulado: number;
};

/** Lê o ranking acumulado (FR-009, FR-010) a partir da view ranking_view. */
export async function getRanking(supabase: SupabaseClient): Promise<RankingEntry[]> {
  const { data, error } = await supabase
    .from("ranking_view")
    .select("posicao, presenter_display_name, total_acumulado")
    .order("posicao", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export type DailyEntry = {
  presenter_display_name: string;
  points_do_dia: number;
};

/** Lê a consulta diária (FR-007) a partir da view daily_entries_view. */
export async function getDailyEntries(
  supabase: SupabaseClient,
  liveDate: string
): Promise<DailyEntry[]> {
  const { data, error } = await supabase
    .from("daily_entries_view")
    .select("presenter_display_name, points_do_dia")
    .eq("live_date", liveDate)
    .order("points_do_dia", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
