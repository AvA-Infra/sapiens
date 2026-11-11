import { Suspense, type ReactNode } from "react";
import { requireRole, type Role } from "@/lib/auth";

async function Guard({ roles, children }: { roles: Role[]; children: ReactNode }) {
  await requireRole(roles);
  return <>{children}</>;
}

/**
 * Exige o papel no servidor, dentro de um Suspense (a sessão é dado de requisição com Cache Components).
 * O banco confere de novo pelo RLS: mesmo que alguém pule esta tela, só o papel certo escreve.
 */
export function RoleGuard({ roles, children }: { roles: Role[]; children: ReactNode }) {
  return (
    <Suspense fallback={<p className="py-24 text-center text-ink-soft">Carregando o painel...</p>}>
      <Guard roles={roles}>{children}</Guard>
    </Suspense>
  );
}
