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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const user = await requireUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (body?.live_date !== undefined) {
    if (!DATE_RE.test(body.live_date)) {
      return NextResponse.json({ error: "live_date inválida" }, { status: 400 });
    }
    update.live_date = body.live_date;
  }

  if (body?.points !== undefined) {
    if (typeof body.points !== "number" || !Number.isFinite(body.points) || body.points < 0) {
      return NextResponse.json(
        { error: "points deve ser um número não negativo" },
        { status: 400 }
      );
    }
    update.points = body.points;
  }

  try {
    if (body?.presenter_name !== undefined) {
      if (!body.presenter_name.trim()) {
        return NextResponse.json({ error: "presenter_name não pode ser vazio" }, { status: 400 });
      }
      const presenter = await resolvePresenter(supabase, body.presenter_name);
      update.presenter_id = presenter.id;
    }

    const { data, error } = await supabase
      .from("live_entries")
      .update(update)
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "Registro não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ id: data.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Erro ao editar registro" }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const user = await requireUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("live_entries")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (!data) {
    return NextResponse.json({ error: "Registro não encontrado" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
