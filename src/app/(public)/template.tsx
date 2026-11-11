import type { ReactNode } from "react";

/** O template é recriado a cada navegação: dá uma entrada curta e discreta a cada página nova. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-in">{children}</div>;
}
