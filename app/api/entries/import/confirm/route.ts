import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { resolvePresenter } from "@/lib/presenters";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

async function requireUser(supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Grava os lançamentos revisados pelo admin após a extração por imagem
 * (ver /api/entries/import). Para cada linha, pula registros idênticos
 * já existentes (mesmo presenteador + data + pontos) para não duplicar
 * caso a mesma imagem seja importada mais de uma vez.
 */
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const user = await requireUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const liveDate = body?.live_date;
  const rows = body?.rows;

  if (!liveDate || !DATE_RE.test(liveDate)) {
    return NextResponse.json(
      { error: "live_date é obrigatório e deve estar no formato YYYY-MM-DD" },
      { status: 400 }
    );
  }
  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "Nenhum lançamento para salvar" }, { status: 400 });
  }

  let inserted = 0;
  let skipped = 0;

  try {
    for (const row of rows) {
      const presenterName = typeof row?.presenter_name === "string" ? row.presenter_name.trim() : "";
      const points = Number(row?.points);
      if (!presenterName || !Number.isFinite(points) || points < 0) {
        continue;
      }

      const presenter = await resolvePresenter(supabase, presenterName);

      const { data: existing, error: findError } = await supabase
        .from("live_entries")
        .select("id")
        .eq("presenter_id", presenter.id)
        .eq("live_date", liveDate)
        .eq("points", points)
        .maybeSingle();
      if (findError) throw findError;

      if (existing) {
        skipped += 1;
        continue;
      }

      const { error: insertError } = await supabase.from("live_entries").insert({
        live_date: liveDate,
        presenter_id: presenter.id,
        points,
        created_by: user.id,
      });
      if (insertError) throw insertError;
      inserted += 1;
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Erro ao salvar lançamentos importados", inserted, skipped },
      { status: 400 }
    );
  }

  return NextResponse.json({ inserted, skipped });
}
