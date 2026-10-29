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

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const user = await requireUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const liveDate = request.nextUrl.searchParams.get("live_date");
  if (!liveDate || !DATE_RE.test(liveDate)) {
    return NextResponse.json(
      { error: "live_date é obrigatório e deve estar no formato YYYY-MM-DD" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("live_entries")
    .select("id, live_date, points, presenters(display_name)")
    .eq("live_date", liveDate)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    live_date: liveDate,
    entries: (data ?? []).map((row: any) => ({
      id: row.id,
      presenter_name: row.presenters?.display_name ?? "",
      points: row.points,
    })),
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const user = await requireUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const liveDate = body?.live_date;
  const presenterName = body?.presenter_name;
  const points = body?.points;

  if (!liveDate || !DATE_RE.test(liveDate)) {
    return NextResponse.json(
      { error: "live_date é obrigatório e deve estar no formato YYYY-MM-DD" },
      { status: 400 }
    );
  }
  if (!presenterName || typeof presenterName !== "string" || !presenterName.trim()) {
    return NextResponse.json({ error: "presenter_name é obrigatório" }, { status: 400 });
  }
  if (typeof points !== "number" || !Number.isFinite(points) || points < 0) {
    return NextResponse.json(
      { error: "points deve ser um número não negativo" },
      { status: 400 }
    );
  }

  try {
    const presenter = await resolvePresenter(supabase, presenterName);

    const { data, error } = await supabase
      .from("live_entries")
      .insert({
        live_date: liveDate,
        presenter_id: presenter.id,
        points,
        created_by: user.id,
      })
      .select("id, live_date, points")
      .single();

    if (error) throw error;

    return NextResponse.json(
      { id: data.id, live_date: data.live_date, presenter_name: presenter.display_name, points: data.points },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Erro ao salvar registro" }, { status: 400 });
  }
}
