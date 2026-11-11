import "server-only";

/** Verifica o token do Cloudflare Turnstile. Sem TURNSTILE_SECRET_KEY o recurso fica desligado (retorna true). */
export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    // Se a verificação não responde, bloqueia: é melhor pedir para tentar de novo do que deixar passar bot.
    return false;
  }
}
