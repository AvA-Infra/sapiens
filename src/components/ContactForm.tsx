"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Turnstile, resetTurnstile } from "@/components/Turnstile";
import { Button } from "@/components/ui/Button";
import { contactSchema } from "@/lib/schemas";

type Errors = Partial<Record<"name" | "email" | "phone" | "message" | "consent", string>>;
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "ok" } | { kind: "error"; text: string };

const field =
  "mt-1.5 block min-h-12 w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink " +
  "placeholder:text-ink-soft/70 focus:border-sky-500";

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
      <div role="status" className="rounded-card bg-sky-100 p-6 text-navy-900">
        <p className="font-display text-xl font-bold">Mensagem enviada.</p>
        <p className="mt-1">Retornamos assim que possível.</p>
      </div>
    );
  }

  const err = (id: keyof Errors) =>
    errors[id] ? (
      <p id={`${id}-erro`} className="mt-1 text-sm font-medium text-red-700">
        {errors[id]}
      </p>
    ) : null;
  const aria = (id: keyof Errors) => ({
    "aria-invalid": errors[id] ? true : undefined,
    "aria-describedby": errors[id] ? `${id}-erro` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
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
        <p role="alert" className="rounded-xl bg-red-50 p-4 font-medium text-red-800">{status.text}</p>
      )}
      <Button type="submit" disabled={status.kind === "sending"}>
        {status.kind === "sending" ? "Enviando..." : "Enviar mensagem"}
      </Button>
    </form>
  );
}
