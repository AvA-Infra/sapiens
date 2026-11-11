import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getPaymentProvider } from "@/lib/payments";
import { clientIp, rateLimit } from "@/lib/ratelimit";

/** STUB: o checkout só funciona depois que um PaymentProvider for implementado (lib/payments). */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para continuar." }, { status: 401 });

  const rl = await rateLimit(`checkout:${user.id}:${clientIp(req)}`, 10, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Muitas tentativas." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  }

  if (!getPaymentProvider()) {
    return NextResponse.json({ error: "Pagamentos ainda não estão ativos. Fale com a escola pelo WhatsApp." }, { status: 501 });
  }
  // TODO ao ativar: validar o produto com Zod, criar o pedido (orders) com a service_role e chamar provider.createCheckout.
  return NextResponse.json({ error: "Não implementado." }, { status: 501 });
}
