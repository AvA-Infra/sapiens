import type { ReactNode } from "react";

/** Entrada curta e discreta a cada página nova das áreas logadas. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-in">{children}</div>;
}
