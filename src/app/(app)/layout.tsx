import { Suspense, type ReactNode } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { isStaff, requireUser } from "@/lib/auth";
import { getSidebarData } from "@/lib/panel-data";

export const metadata = { robots: { index: false, follow: false } };

/**
 * Áreas logadas (/aluno e /admin): sidebar fixa colada à esquerda.
 * A sessão é lida dentro do Suspense (Cache Components); quem não está logado vai para /entrar.
 */
async function Shell({ children }: { children: ReactNode }) {
  const user = await requireUser();
  const panel = isStaff(user.role) ? await getSidebarData() : undefined;
  return (
    <div className="min-h-dvh bg-paper">
      <AppSidebar nome={user.nome} role={user.role} panel={panel} />
      <div className="lg:pl-64">
        <main id="conteudo" className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p className="grid min-h-dvh place-items-center text-ink-soft">Carregando sua área...</p>}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}
