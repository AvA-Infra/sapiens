"use client";

import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { whatsappLink } from "@/config/site";
import { cn } from "@/lib/cn";

const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"] as const;
const periods = ["Manhã", "Tarde", "Noite"] as const;

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-[10px] border px-4 text-[0.95rem] font-semibold transition-colors duration-200",
        active
          ? "border-navy-900 bg-navy-900 text-paper"
          : "border-line bg-surface text-navy-900 hover:border-sky-500",
      )}
    >
      {children}
    </button>
  );
}

/**
 * Agendamento de visita sem sistema externo: a pessoa escolhe dia e período e o pedido
 * segue pronto para o WhatsApp da escola, que confirma o horário na conversa.
 * Nenhum dado é enviado ou guardado pelo site.
 */
export function VisitScheduler() {
  const [name, setName] = useState("");
  const [day, setDay] = useState<string | null>(null);
  const [period, setPeriod] = useState<string | null>(null);

  const ready = day !== null && period !== null;
  const message =
    `Olá! Vim pelo site da Sapiens e quero agendar uma visita` +
    (ready ? ` na ${day.toLowerCase()}, no período da ${period.toLowerCase()}` : "") +
    "." +
    (name.trim() ? ` Meu nome é ${name.trim()}.` : "");

  return (
    <form
      className="rounded-card border border-line bg-surface p-6 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
      }}
    >
      <fieldset>
        <legend className="font-semibold text-navy-900">Qual dia fica melhor?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {days.map((d) => (
            <Choice key={d} active={day === d} onClick={() => setDay(d)}>
              {d}
            </Choice>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="font-semibold text-navy-900">Em qual período?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {periods.map((p) => (
            <Choice key={p} active={period === p} onClick={() => setPeriod(p)}>
              {p}
            </Choice>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <label htmlFor="visita-nome" className="font-semibold text-navy-900">
          Seu nome <span className="font-normal text-ink-soft">(opcional)</span>
        </label>
        <input
          id="visita-nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="given-name"
          maxLength={60}
          className="field mt-1.5 block min-h-12 w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink"
        />
      </div>

      <button
        type="submit"
        disabled={!ready}
        className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[10px] bg-whatsapp px-8 text-lg font-semibold text-white transition-[opacity,filter] duration-200 hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 dark:text-navy-950"
      >
        <CalendarCheck className="size-5" aria-hidden /> Pedir horário pelo WhatsApp
      </button>
      <p className="mt-3 text-sm text-ink-soft" aria-live="polite">
        {ready
          ? `Vamos abrir o WhatsApp com o pedido para ${day.toLowerCase()} à ${period.toLowerCase()}. A escola confirma o horário na conversa.`
          : "Escolha o dia e o período para continuar."}
      </p>
    </form>
  );
}
