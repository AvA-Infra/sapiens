"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

// Canvas carregado só no cliente, depois do primeiro paint do hero.
const Constellation = dynamic(() => import("./Constellation"), { ssr: false });

// A rede reage ao mouse: só faz sentido (e só compensa o custo) em tela grande com cursor.
const QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** No celular não carrega nada: a página fica mais leve e economiza bateria. */
export function ConstellationLazy({ className }: { className?: string }) {
  const enabled = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
  return enabled ? <Constellation className={className} /> : null;
}
