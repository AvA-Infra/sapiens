"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, MessagesSquare, Send, X } from "lucide-react";
import { whatsappLink } from "@/config/site";
import { cn } from "@/lib/cn";

type Msg = { role: "user" | "assistant"; content: string };

const suggestions = ["Onde fica a Sapiens?", "Como faço a matrícula?", "Para quais provas o curso prepara?"];
const MAX_TURNS = 6; // 6 perguntas por conversa (o servidor aceita até 12 mensagens)

/**
 * Assistente virtual (IA). Só é renderizado quando o servidor tem a chave da API configurada.
 * A conversa fica apenas na memória desta aba: nada é salvo no navegador nem no banco.
 */
export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  const turns = messages.filter((m) => m.role === "user").length;
  const limitReached = turns >= MAX_TURNS;

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const opener = openerRef.current;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  async function ask(text: string) {
    const question = text.trim().slice(0, 600);
    if (!question || busy || limitReached) return;
    const history: Msg[] = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    const setAnswer = (content: string) => setMessages([...history, { role: "assistant", content }]);
    try {
      const res = await fetch("/api/assistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setAnswer(data.error ?? "Não consegui responder agora. Chame a gente no WhatsApp.");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setAnswer(answer);
      }
    } catch {
      setAnswer("Não consegui responder agora. Chame a gente no WhatsApp.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="assistente"
        aria-label={open ? "Fechar o assistente virtual" : "Abrir o assistente virtual"}
        className="fixed bottom-[calc(max(1rem,env(safe-area-inset-bottom))+4.25rem)] right-4 z-40 grid size-14 place-items-center rounded-full border border-line bg-surface text-navy-900 shadow-pop transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 sm:right-6"
      >
        {open ? <X className="size-6" aria-hidden /> : <MessagesSquare className="size-6" aria-hidden />}
      </button>

      {open && (
        <section
          id="assistente"
          role="dialog"
          aria-label="Assistente virtual da Sapiens"
          className="page-in fixed inset-x-3 bottom-[calc(max(1rem,env(safe-area-inset-bottom))+8.5rem)] z-[46] flex max-h-[min(34rem,calc(100dvh-13rem))] flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-pop sm:inset-x-auto sm:right-6 sm:w-[24rem]"
        >
          <header className="border-b border-line bg-sky-50 px-5 py-3.5">
            <p className="font-display text-2xl font-bold leading-tight text-navy-900">Tire uma dúvida</p>
            <p className="text-sm text-ink-soft">
              Assistente de inteligência artificial. Pode errar: para matrícula e valores, fale com a equipe.
            </p>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-ink-soft">Pergunte sobre o curso, a localização ou o vestibular.</p>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => ask(s)}
                    className="block min-h-11 w-full rounded-2xl border border-line px-4 text-left font-semibold text-navy-900 transition-colors hover:border-sky-500 hover:bg-sky-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <p
                key={i}
                className={cn(
                  "w-fit max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-2.5",
                  m.role === "user" ? "ml-auto bg-navy-900 text-paper" : "bg-sky-50 text-ink",
                )}
              >
                {m.content || (
                  <span className="inline-flex gap-1" aria-label="Escrevendo">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="size-1.5 animate-pulse rounded-full bg-sky-500" style={{ animationDelay: `${d * 0.15}s` }} />
                    ))}
                  </span>
                )}
              </p>
            ))}
            {limitReached && !busy && (
              <p className="text-sm text-ink-soft">Para continuar a conversa, chame a equipe no WhatsApp.</p>
            )}
          </div>

          <div className="border-t border-line p-3">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
            >
              <label htmlFor="assistente-pergunta" className="sr-only">
                Sua pergunta
              </label>
              <input
                ref={inputRef}
                id="assistente-pergunta"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={600}
                disabled={limitReached}
                placeholder="Escreva sua pergunta"
                autoComplete="off"
                className="field min-h-12 min-w-0 flex-1 rounded-full border border-line bg-paper px-4 text-ink placeholder:text-ink-soft/70 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={busy || limitReached || !input.trim()}
                aria-label="Enviar pergunta"
                className="grid size-12 shrink-0 place-items-center rounded-full bg-navy-900 text-paper transition-transform duration-200 active:scale-90 disabled:opacity-40"
              >
                <Send className="size-5" aria-hidden />
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between gap-3 px-1 text-sm">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-sky-600 hover:text-navy-900"
              >
                <MessageCircle className="size-4" aria-hidden /> Falar com a equipe
              </a>
              <Link href="/privacidade" className="inline-flex min-h-11 items-center text-ink-soft underline underline-offset-2">
                Privacidade
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
