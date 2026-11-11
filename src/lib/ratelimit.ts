/**
 * Limite de tentativas (janela fixa).
 *  - Com UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN: usa o Redis da Upstash, compartilhado entre
 *    todas as instâncias (necessário na Vercel, onde cada requisição pode cair numa instância diferente).
 *  - Sem elas, ou se o Redis falhar: usa memória local. Serve para desenvolvimento e instância única.
 * Fala com a API REST da Upstash por fetch, sem dependência extra.
 */
const memory = new Map<string, number[]>();

function memoryLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (memory.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    memory.set(key, recent);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - recent[0])) / 1000) };
  }
  recent.push(now);
  memory.set(key, recent);
  if (memory.size > 5000) {
    for (const [k, v] of memory) if (v.every((t) => now - t >= windowMs)) memory.delete(k);
  }
  return { ok: true, retryAfter: 0 };
}

async function redisLimit(key: string, limit: number, windowMs: number) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const k = `rl:${key}`;
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    // INCR conta; PEXPIRE NX só define a validade na primeira batida da janela; PTTL devolve o que falta.
    body: JSON.stringify([["INCR", k], ["PEXPIRE", k, String(windowMs), "NX"], ["PTTL", k]]),
    cache: "no-store",
    signal: AbortSignal.timeout(1500),
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}`);
  const out = (await res.json()) as { result: number }[];
  const count = Number(out[0]?.result ?? 0);
  const pttl = Number(out[2]?.result ?? windowMs);
  return { ok: count <= limit, retryAfter: count <= limit ? 0 : Math.max(1, Math.ceil(pttl / 1000)) };
}

export async function rateLimit(key: string, limit: number, windowMs: number) {
  try {
    const viaRedis = await redisLimit(key, limit, windowMs);
    if (viaRedis) return viaRedis;
  } catch {
    // Redis fora do ar: cai para a memória em vez de derrubar o login.
  }
  return memoryLimit(key, limit, windowMs);
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/** Versão para Server Actions, que recebem os headers de `headers()` em vez de um Request. */
export function ipFromHeaders(h: Headers) {
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
