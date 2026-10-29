import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function requireUser(supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Envia um print do ranking "Principais espectadores" do TikTok para o
 * workflow n8n que usa visão por IA (Google Gemini) para extrair nome +
 * moedas de cada presenteador. Retorna as linhas extraídas para revisão do
 * admin antes de qualquer gravação no banco (ver /api/entries/import/confirm).
 */
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const user = await requireUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const webhookUrl = process.env.N8N_OCR_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_OCR_WEBHOOK_SECRET;
  if (!webhookUrl || !webhookSecret) {
    return NextResponse.json(
      { error: "Importação por imagem não está configurada no servidor." },
      { status: 503 }
    );
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("image");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Envie um arquivo de imagem." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "O arquivo enviado não é uma imagem." }, { status: 400 });
  }

  const forwardForm = new FormData();
  forwardForm.append("data", file, file.name || "print.jpg");

  let n8nResponse: Response;
  try {
    n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "X-Ranking-Secret": webhookSecret },
      body: forwardForm,
    });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível contatar o serviço de extração. Tente novamente." },
      { status: 502 }
    );
  }

  const payload = await n8nResponse.json().catch(() => null);
  if (!n8nResponse.ok || !payload) {
    return NextResponse.json(
      { error: payload?.message ?? "Falha ao extrair dados da imagem." },
      { status: 502 }
    );
  }

  const rows = Array.isArray(payload.rows) ? payload.rows : [];
  const parsedRows = rows
    .map((row: any) => ({
      presenter_name: typeof row?.name === "string" ? row.name.trim() : "",
      points: Number(row?.points),
    }))
    .filter((row: any) => row.presenter_name && Number.isFinite(row.points) && row.points >= 0);

  if (parsedRows.length === 0) {
    return NextResponse.json(
      { error: "Nenhum presenteador foi reconhecido nessa imagem." },
      { status: 422 }
    );
  }

  return NextResponse.json({ rows: parsedRows });
}
