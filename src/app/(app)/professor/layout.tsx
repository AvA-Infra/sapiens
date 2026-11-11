import type { ReactNode } from "react";
import { RoleGuard } from "@/components/panel/RoleGuard";

export const metadata = { title: "Painel do professor", robots: { index: false, follow: false } };

export default function ProfessorLayout({ children }: { children: ReactNode }) {
  return <RoleGuard roles={["professor", "admin"]}>{children}</RoleGuard>;
}
