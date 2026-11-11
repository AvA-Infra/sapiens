import type { ReactNode } from "react";

export const metadata = { title: "Área do aluno", robots: { index: false, follow: false } };

export default function AlunoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
