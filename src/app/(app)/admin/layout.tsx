import type { ReactNode } from "react";
import { RoleGuard } from "@/components/panel/RoleGuard";

export const metadata = { title: "Painel admin", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <RoleGuard roles={["admin"]}>{children}</RoleGuard>;
}
