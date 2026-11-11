import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Entrada suave ao rolar, em CSS puro (scroll-driven animation: classe `.reveal` em globals.css).
 * Não envia JavaScript ao navegador. Onde não há suporte, ou com "reduzir movimento" ligado,
 * o conteúdo aparece direto no lugar.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string; delay?: number }) {
  return <div className={cn("reveal", className)}>{children}</div>;
}
