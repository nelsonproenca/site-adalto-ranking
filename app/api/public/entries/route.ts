import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getDailyEntries } from "@/lib/ranking";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: NextRequest) {
  const liveDate = request.nextUrl.searchParams.get("live_date");

  if (!liveDate || !DATE_RE.test(liveDate)) {
    return NextResponse.json(
      { error: "live_date é obrigatório e deve estar no formato YYYY-MM-DD" },
      { status: 400 }
    );
  }

  const supabase = await createServerSupabaseClient();
  const entries = await getDailyEntries(supabase, liveDate);

  return NextResponse.json({
    live_date: liveDate,
    entries: entries.map((e) => ({
      presenter_name: e.presenter_display_name,
      points: e.points_do_dia,
    })),
  });
}
