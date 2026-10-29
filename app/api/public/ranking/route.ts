import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getRanking } from "@/lib/ranking";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const ranking = await getRanking(supabase);

  return NextResponse.json({
    ranking: ranking.map((r) => ({
      position: r.posicao,
      presenter_name: r.presenter_display_name,
      total_points: r.total_acumulado,
    })),
  });
}
