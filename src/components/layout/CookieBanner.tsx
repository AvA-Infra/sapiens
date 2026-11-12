"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { setConsent, useConsent } from "@/lib/consent";

/**
 * Aviso de cookies conforme a LGPD: recusar é tão fácil quanto aceitar, e nada de terceiros
 * carrega antes da resposta. A escolha pode ser revista em "Preferências de cookies", no rodapé.
 */
export function CookieBanner() {
  const consent = useConsent();
  if (consent !== null) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="page-in fixed inset-x-3 bottom-3 z-[45] mx-auto max-w-3xl rounded-card border border-line bg-surface p-5 text-[0.95rem] text-ink shadow-pop sm:flex sm:items-center sm:gap-6"
    >
      <p>
        Usamos só cookies essenciais (login da área do aluno). O mapa do Google e as publicações do Instagram são
        conteúdos de terceiros e podem usar cookies próprios: eles só carregam se você permitir.{" "}
        <Link href="/privacidade" className="font-semibold text-sky-600 underline underline-offset-2">
          Política de privacidade
        </Link>
      </p>
      <div className="mt-4 flex shrink-0 flex-wrap gap-2 sm:mt-0 sm:flex-col">
        <Button onClick={() => setConsent("all")} size="sm" className="flex-1">
          Permitir tudo
        </Button>
        <Button onClick={() => setConsent("essential")} size="sm" variant="secondary" className="flex-1">
          Só o essencial
        </Button>
      </div>
    </div>
  );
}

/** Link do rodapé para rever a escolha: limpa a resposta e o aviso volta a aparecer. */
export function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => setConsent(null)} className={className}>
      Preferências de cookies
    </button>
  );
}
