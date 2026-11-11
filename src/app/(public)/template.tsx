import { ViewTransition, type ReactNode } from "react";

/**
 * O template é recriado a cada navegação. O <ViewTransition> usa a View Transitions API do navegador
 * para trocar a página antiga pela nova com um fade curto (classe `.page` em globals.css).
 * Sem suporte no navegador, a troca é instantânea.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
