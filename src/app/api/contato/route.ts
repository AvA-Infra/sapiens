import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/ratelimit";
import { contactSchema } from "@/lib/schemas";
import { verifyTurnstile } from "@/lib/turnstile";

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = await rateLimit(`contato:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente de novo em alguns minutos." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Confira os campos do formulário." }, { status: 400 });
  }
  const data = parsed.data;

  // Anti-spam: honeypot preenchido ou envio rápido demais. Responde "ok" para não ensinar o bot.
  if (data.website || Date.now() - data.startedAt < 3000) {
    return NextResponse.json({ ok: true });
  }

  if (!(await verifyTurnstile(data.turnstileToken, ip))) {
    return NextResponse.json({ error: "Não foi possível confirmar que você não é um robô. Tente de novo." }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    // Não finge que enviou: a mensagem se perderia.
    return NextResponse.json(
      { error: "Envio por formulário indisponível no momento. Fale com a gente pelo WhatsApp." },
      { status: 503 },
    );
  }

  // service_role só aqui, no servidor, para gravar na tabela que o RLS fecha para o navegador.
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from("contact_messages").insert({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    message: data.message,
    consent_at: new Date().toISOString(),
  });
  if (error) {
    return NextResponse.json({ error: "Não foi possível enviar agora. Tente pelo WhatsApp." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
