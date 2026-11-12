"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Turnstile, resetTurnstile } from "@/components/Turnstile";
import { Button } from "@/components/ui/Button";
import { whatsappLink } from "@/config/site";
import { contactSchema } from "@/lib/schemas";

type Errors = Partial<Record<"name" | "email" | "phone" | "message" | "consent", string>>;
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "ok" } | { kind: "error"; text: string };

const field =
  "field mt-1.5 block min-h-12 w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink " +
  "placeholder:text-ink-soft/70";

export function ContactForm() {
  // Hora em que o formulário apareceu (anti-bot). Lida no navegador, não na pré-renderização.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const candidate = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone") ?? "",
      message: fd.get("message"),
      consent: fd.get("consent") === "on",
      website: fd.get("website") ?? "",
      startedAt: startedAt.current,
      turnstileToken: (fd.get("cf-turnstile-response") as string | null) ?? undefined,
    };
    const parsed = contactSchema.safeParse(candidate);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof Errors;
        next[k] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Erro ao enviar.");
      setStatus({ kind: "ok" });
      e.currentTarget.reset();
    } catch (err) {
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "Erro ao enviar." });
      resetTurnstile();
    }
  }

  if (status.kind === "ok") {
    return (
      <div role="status" className="rounded-card border border-line bg-surface p-8 text-center sm:p-10">
        <span className="success-badge mx-auto grid size-20 place-items-center rounded-full bg-sky-100 text-sky-600">
          <svg viewBox="0 0 24 24" className="size-10" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path className="success-check" d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <p className="mt-6 font-display text-4xl font-bold text-navy-900">Mensagem enviada</p>
        <p className="mx-auto mt-2 max-w-sm text-ink-soft">
          Recebemos seu contato e vamos responder pelo e-mail ou telefone que você informou.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button href={whatsappLink()}>Adiantar pelo WhatsApp</Button>
          <Button variant="secondary" onClick={() => setStatus({ kind: "idle" })}>
            Enviar outra mensagem
          </Button>
        </div>
      </div>
    );
  }

  const err = (id: keyof Errors) =>
    errors[id] ? (
      <p id={`${id}-erro`} className="mt-1.5 text-sm font-semibold text-red-700 dark:text-red-300">
        {errors[id]}
      </p>
    ) : null;
  const aria = (id: keyof Errors) => ({
    "aria-invalid": errors[id] ? true : undefined,
    "aria-describedby": errors[id] ? `${id}-erro` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-card border border-line bg-surface p-6 sm:p-8">
      <div>
        <label htmlFor="name" className="font-semibold text-navy-900">Nome</label>
        <input id="name" name="name" autoComplete="name" required className={field} {...aria("name")} />
        {err("name")}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="font-semibold text-navy-900">E-mail</label>
          <input id="email" name="email" type="email" autoComplete="email" required className={field} {...aria("email")} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="phone" className="font-semibold text-navy-900">
            Telefone <span className="font-normal text-ink-soft">(opcional)</span>
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={field} {...aria("phone")} />
          {err("phone")}
        </div>
      </div>
      <div>
        <label htmlFor="message" className="font-semibold text-navy-900">Mensagem</label>
        <textarea id="message" name="message" rows={5} required className={field} {...aria("message")} />
        {err("message")}
      </div>

      {/* Honeypot: escondido de pessoas e de leitores de tela */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Não preencha</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex items-start gap-3">
          <input type="checkbox" name="consent" className="mt-1.5 size-5 accent-navy-900" {...aria("consent")} />
          <span>
            Concordo com o uso dos meus dados para retorno de contato, conforme a{" "}
            <Link href="/privacidade" className="font-semibold text-sky-600 underline underline-offset-2">
              política de privacidade
            </Link>
            .
          </span>
        </label>
        {err("consent")}
      </div>

      <Turnstile />

      {status.kind === "error" && (
        <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 font-medium text-red-800 dark:border-red-400/40 dark:bg-red-950/40 dark:text-red-200">{status.text}</p>
      )}
      <Button type="submit" size="lg" disabled={status.kind === "sending"} aria-busy={status.kind === "sending"}>
        {status.kind === "sending" && (
          <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {status.kind === "sending" ? "Enviando" : "Enviar mensagem"}
      </Button>
    </form>
  );
}
