/**
 * Contrato para plugar um provedor de pagamento (Mercado Pago, Stripe, Kiwify...) sem mexer no resto do site.
 * Para ativar: implemente esta interface em um arquivo novo, registre em ./index.ts e defina
 * PAYMENT_PROVIDER e PAYMENT_WEBHOOK_SECRET no .env. As tabelas products/orders já existem no banco.
 */
export type CheckoutInput = {
  orderId: string;
  productName: string;
  amountCents: number;
  buyer: { id: string; email: string; nome: string };
  successUrl: string;
  cancelUrl: string;
};

export type CheckoutSession = { url: string; providerRef: string };

export type PaymentEvent = {
  type: "paid" | "failed" | "refunded";
  /** Identificador da cobrança no provedor (orders.provider_ref). */
  providerRef: string;
};

export interface PaymentProvider {
  name: string;
  createCheckout(input: CheckoutInput): Promise<CheckoutSession>;
  /**
   * Valida a assinatura do webhook sobre o corpo CRU e devolve o evento.
   * Deve lançar erro se a assinatura for inválida (a rota responde 401).
   */
  parseWebhook(rawBody: string, headers: Headers, secret: string): PaymentEvent | null;
}
