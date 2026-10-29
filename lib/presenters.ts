import type { SupabaseClient } from "@supabase/supabase-js";

/** Normaliza um nome de presenteador para agrupamento/ranking (FR-011). */
export function normalizePresenterName(name: string): string {
  return name.trim().toLowerCase();
}

/**
 * Resolve o presenteador pelo nome normalizado, reaproveitando o registro
 * existente (e atualizando o display_name mais recente) ou criando um novo.
 */
export async function resolvePresenter(
  supabase: SupabaseClient,
  rawName: string
): Promise<{ id: string; display_name: string }> {
  const displayName = rawName.trim();
  const normalizedName = normalizePresenterName(rawName);

  if (!displayName) {
    throw new Error("Nome do presenteador é obrigatório");
  }

  const { data: existing, error: findError } = await supabase
    .from("presenters")
    .select("id, display_name")
    .eq("normalized_name", normalizedName)
    .maybeSingle();

  if (findError) throw findError;

  if (existing) {
    if (existing.display_name !== displayName) {
      const { error: updateError } = await supabase
        .from("presenters")
        .update({ display_name: displayName, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
      if (updateError) throw updateError;
    }
    return { id: existing.id, display_name: displayName };
  }

  const { data: created, error: insertError } = await supabase
    .from("presenters")
    .insert({ display_name: displayName, normalized_name: normalizedName })
    .select("id, display_name")
    .single();

  if (insertError) throw insertError;

  return created;
}
