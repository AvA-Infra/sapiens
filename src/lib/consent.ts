"use client";

import { useSyncExternalStore } from "react";

/**
 * Consentimento de cookies (LGPD), guardado só no navegador da pessoa.
 *  - "all": aceita conteúdos de terceiros (mapa do Google) carregarem sozinhos.
 *  - "essential": só o essencial. Mapas e publicações do Instagram só carregam se a pessoa clicar.
 *  - null: ainda não respondeu (o aviso aparece e nada de terceiros carrega).
 * Publicações do Instagram SEMPRE carregam só com clique, por desempenho.
 */
export type Consent = "all" | "essential" | null;

const KEY = "sapiens-consent";
const listeners = new Set<() => void>();

function read(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "all" || v === "essential" ? v : null;
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

export function setConsent(value: Consent) {
  try {
    if (value) localStorage.setItem(KEY, value);
    else localStorage.removeItem(KEY);
  } catch {
    // Sem localStorage (modo privado): a escolha vale só até recarregar.
  }
  listeners.forEach((l) => l());
}

/**
 * No servidor devolve "pending": nem mostra o aviso nem carrega terceiros,
 * evitando flash e erro de hidratação. O valor real chega logo após a hidratação.
 */
export function useConsent(): Consent | "pending" {
  return useSyncExternalStore(subscribe, read, () => "pending" as const);
}
