"use client";

import { useActionState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ActionState = { ok?: boolean; error?: string; message?: string };
const initial: ActionState = {};

/**
 * Formulário ligado a uma Server Action, com aviso de sucesso ou erro logo abaixo.
 * A action recebe (estado anterior, FormData) e devolve { ok | error | message }.
 */
export function ActionForm({
  action,
  children,
  className,
  submitLabel,
  pendingLabel = "Salvando...",
  variant = "primary",
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children?: ReactNode;
  className?: string;
  submitLabel: string;
  pendingLabel?: string;
  variant?: "primary" | "danger" | "quiet";
}) {
  const [state, formAction, pending] = useActionState(action, initial);
  const styles = {
    primary: "bg-navy-900 text-paper hover:bg-navy-700",
    danger: "bg-red-700 text-paper hover:bg-red-800",
    quiet: "border border-navy-900/25 text-navy-900 hover:border-navy-900 hover:bg-sky-50",
  }[variant];

  return (
    <form action={formAction} className={cn("space-y-4", className)}>
      {children}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "inline-flex min-h-11 items-center justify-center rounded-[10px] px-5 font-semibold transition-colors disabled:opacity-60",
            styles,
          )}
        >
          {pending ? pendingLabel : submitLabel}
        </button>
        {state.error && (
          <p role="alert" className="text-sm font-medium text-red-700">
            {state.error}
          </p>
        )}
        {state.ok && !state.error && (
          <p role="status" className="text-sm font-medium text-sky-600">
            {state.message ?? "Salvo."}
          </p>
        )}
      </div>
    </form>
  );
}

export const inputClass =
  "mt-1.5 block min-h-11 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-ink focus:border-sky-500";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="font-semibold text-navy-900">
        {label} {hint && <span className="font-normal text-ink-soft">({hint})</span>}
      </span>
      {children}
    </label>
  );
}
