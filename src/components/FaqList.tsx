import { MessageCircle, Plus } from "lucide-react";
import type { Faq } from "@/config/faq";
import { whatsappLink } from "@/config/site";

/**
 * Sanfona de perguntas frequentes com <details> nativo: funciona sem JavaScript e pelo teclado.
 * Pergunta sem resposta oficial (answer: null) leva a pessoa direto para o WhatsApp com a pergunta pronta.
 */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.id} name="faq" className="faq group">
          <summary className="flex min-h-16 items-center justify-between gap-6 py-4 text-left">
            <h3 className="text-2xl font-semibold text-navy-900 sm:text-[1.7rem]">{f.question}</h3>
            <span
              aria-hidden
              className="faq-icon grid size-10 shrink-0 place-items-center rounded-full border border-line text-sky-600"
            >
              <Plus className="size-5" />
            </span>
          </summary>
          <div className="pb-6 pr-12 text-lg text-ink-soft">
            {f.answer ?? (
              <>
                <p>Essa a gente responde na conversa, porque muda de turma para turma.</p>
                <a
                  href={whatsappLink(`Olá! Vim pelo site da Sapiens. ${f.question}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-sky-600 underline underline-offset-4 hover:text-navy-900"
                >
                  <MessageCircle className="size-5" aria-hidden /> Perguntar no WhatsApp
                </a>
              </>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
