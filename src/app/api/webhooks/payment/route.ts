import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";

/**
 * STUB do webhook de pagamento. Já faz o que não pode faltar: ler o corpo CRU e deixar o provedor
 * validar a assinatura antes de confiar em qualquer dado. Sem assinatura válida, nada é processado.
 */
export async function POST(req: Request) {
  const provider = getPaymentProvider();
  if (!provider) return NextResponse.json({ error: "Pagamentos não ativos." }, { status: 501 });

  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook não configurado." }, { status: 503 });

  const raw = await req.text();
  let event;
  try {
    event = provider.parseWebhook(raw, req.headers, secret);
  } catch {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
  }
  if (!event) return NextResponse.json({ ok: true });

  // TODO ao ativar: com a service_role, atualizar orders.status por provider_ref e, se "paid",
  // criar/ativar a matrícula (enrollments). Tornar idempotente (o provedor reenvia eventos).
  return NextResponse.json({ ok: true });
}
