"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

const KEY = "sapiens-cookies-ok";
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function accepted() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/** Aviso enxuto de cookies. O login usa cookie essencial; Instagram e Google Maps podem definir os próprios. */
export function CookieBanner() {
  // No servidor assume "já aceito" (não renderiza), evitando flash e erro de hidratação.
  const ok = useSyncExternalStore(subscribe, accepted, () => true);
  if (ok) return null;

  const accept = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    listeners.forEach((l) => l());
  };

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="page-in fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-2xl flex-col gap-3 rounded-3xl border border-line bg-paper p-4 text-sm text-ink shadow-2xl shadow-navy-900/20 sm:flex-row sm:items-center"
    >
      <p>
        Usamos cookies essenciais para o login. Algumas páginas incorporam o Instagram e o Google Maps, que podem definir
        os próprios cookies.{" "}
        <Link href="/privacidade" className="font-semibold text-sky-600 underline underline-offset-2">
          Saiba mais
        </Link>
        .
      </p>
      <Button onClick={accept} size="sm" className="shrink-0">
        <Check className="size-4" aria-hidden /> Entendi
      </Button>
    </div>
  );
}
