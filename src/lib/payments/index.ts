import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { PaymentProvider } from "./types";

/** Provedores disponíveis, por nome (valor de PAYMENT_PROVIDER). Vazio por enquanto: pagamentos ainda não estão ativos. */
const providers: Record<string, PaymentProvider> = {};

export function getPaymentProvider(): PaymentProvider | null {
  return providers[process.env.PAYMENT_PROVIDER ?? ""] ?? null;
}

/** HMAC-SHA256 com comparação em tempo constante. Útil para validar webhooks que assinam o corpo cru. */
export function verifyHmacSha256(rawBody: string, signatureHex: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(rawBody).digest();
  let given: Buffer;
  try {
    given = Buffer.from(signatureHex, "hex");
  } catch {
    return false;
  }
  return given.length === expected.length && timingSafeEqual(given, expected);
}
