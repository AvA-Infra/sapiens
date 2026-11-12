import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { safeNext } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

/** Destinos aceitos depois do link: a tela de nova senha ou as áreas logadas. */
function destination(next: string | null) {
  return next === "/nova-senha" ? next : safeNext(next);
}

/**
 * Para onde apontam os links dos e-mails do Supabase (senha nova, confirmação de conta).
 * Aceita os dois formatos:
 *  - `token_hash` + `type` (modelo de e-mail recomendado; funciona mesmo abrindo o e-mail em outro aparelho);
 *  - `code` (modelo padrão do Supabase; só funciona no mesmo navegador em que o pedido foi feito).
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const next = destination(url.searchParams.get("next"));
  const fail = NextResponse.redirect(new URL("/esqueci-senha?erro=link", url.origin));
  if (!isSupabaseConfigured) return fail;

  const supabase = await createClient();
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const code = url.searchParams.get("code");

  let ok = false;
  if (tokenHash && type) {
    ok = !(await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error;
  } else if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  }
  return ok ? NextResponse.redirect(new URL(next, url.origin)) : fail;
}
