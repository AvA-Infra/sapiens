import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { z } from "zod";
import { buildSystemPrompt } from "@/lib/assistant/knowledge";
import { clientIp, rateLimit } from "@/lib/ratelimit";

/**
 * Assistente virtual do site (API do Claude). Só funciona com ANTHROPIC_API_KEY configurada;
 * sem a chave o botão do assistente nem aparece no site.
 *
 * Proteções de custo e abuso:
 *  - limite de mensagens por IP (20 a cada 10 minutos);
 *  - conversa curta: no máximo 12 mensagens de até 600 caracteres;
 *  - resposta limitada em tamanho e esforço baixo (as perguntas são simples).
 * A chave fica só no servidor e nunca chega ao navegador.
 */

// Modelo padrão: Claude Opus 5.5. Para reduzir custo, defina ASSISTANT_MODEL=claude-haiku-5-5 (veja o README).
const MODEL = process.env.ASSISTANT_MODEL || "claude-opus-5-5";
// Modelos em que a API oferece troca automática de modelo quando um pedido é recusado por segurança.
const SUPPORTS_FALLBACK = ["claude-opus-5-5", "claude-sonnet-5-5", "claude-fable-5-2"].includes(MODEL);

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(600),
      }),
    )
    .min(1)
    .max(12),
});

const system = buildSystemPrompt();

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Assistente indisponível. Fale com a gente pelo WhatsApp." }, { status: 503 });
  }

  const rl = await rateLimit(`assistente:${clientIp(req)}`, 20, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Muitas mensagens em pouco tempo. Tente de novo em alguns minutos ou chame no WhatsApp." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success || parsed.data.messages.at(-1)?.role !== "user" || parsed.data.messages[0].role !== "user") {
    return NextResponse.json({ error: "Mensagem inválida." }, { status: 400 });
  }

  const client = new Anthropic();
  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 2000,
    output_config: { effort: "low" },
    // O texto de instruções é igual em todos os pedidos: o cache reduz o custo da parte repetida.
    cache_control: { type: "ephemeral" },
    system,
    messages: parsed.data.messages,
    ...(SUPPORTS_FALLBACK ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sentText = false;
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            sentText = true;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal" || !sentText) {
          controller.enqueue(encoder.encode("Não consigo ajudar com isso por aqui. Para falar com a equipe, chame no WhatsApp."));
        }
      } catch (error) {
        // Erros da API não vão para o visitante: ele recebe o caminho do WhatsApp.
        if (error instanceof Anthropic.RateLimitError) console.warn("assistente: limite da API atingido");
        else if (error instanceof Anthropic.APIError) console.error(`assistente: erro ${error.status} da API`);
        else console.error("assistente: falha inesperada");
        if (!sentText) {
          controller.enqueue(encoder.encode("O assistente está fora do ar agora. Chame a gente no WhatsApp que respondemos por lá."));
        }
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
  });
}
