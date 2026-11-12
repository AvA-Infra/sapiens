import type { ReactNode } from "react";
import { RoleGuard } from "@/components/panel/RoleGuard";

export const metadata = { title: "Painel", robots: { index: false, follow: false } };

/** Painel da equipe. Todo professor é administrador ('professor' de contas antigas vale o mesmo). */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <RoleGuard roles={["admin", "professor"]}>{children}</RoleGuard>;
}
