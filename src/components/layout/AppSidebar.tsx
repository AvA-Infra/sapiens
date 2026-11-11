"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  ClipboardList,
  Globe,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  PenSquare,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { signOut } from "@/lib/auth-actions";
import type { Role } from "@/lib/auth";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; icon: LucideIcon; exact?: boolean };
type Group = { title: string; items: Item[] };

/** Links do painel conforme o papel: o aluno vê o dele; professor e admin acumulam os anteriores. */
function groupsFor(role: Role): Group[] {
  const groups: Group[] = [{ title: "Aluno", items: [{ href: "/aluno", label: "Meus cursos", icon: BookOpen }] }];
  if (role === "professor" || role === "admin") {
    groups.push({ title: "Professor", items: [{ href: "/professor", label: "Cursos e aulas", icon: PenSquare }] });
  }
  if (role === "admin") {
    groups.push({
      title: "Administração",
      items: [
        { href: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true },
        { href: "/admin/usuarios", label: "Usuários", icon: Users },
        { href: "/admin/turmas", label: "Turmas", icon: GraduationCap },
        { href: "/admin/matriculas", label: "Matrículas", icon: ClipboardList },
        { href: "/admin/mensagens", label: "Mensagens", icon: Mail },
      ],
    });
  }
  return groups;
}

const roleLabel: Record<Role, string> = { aluno: "Aluno", professor: "Professor", admin: "Administrador" };

function SidebarContent({ nome, role, onNavigate }: { nome: string; role: Role; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = (it: Item) => (it.exact ? pathname === it.href : pathname === it.href || pathname.startsWith(`${it.href}/`));

  return (
    <div className="flex h-full flex-col">
      <Link href="/" onClick={onNavigate} className="block px-5 pb-4 pt-5">
        <Logo size="sm" />
      </Link>

      <div className="mx-4 rounded-2xl bg-sky-50 px-4 py-3">
        <p className="truncate font-semibold text-navy-900">{nome}</p>
        <p className="text-sm text-ink-soft">{roleLabel[role]}</p>
      </div>

      <nav aria-label="Painel" className="mt-5 flex-1 space-y-5 overflow-y-auto px-3">
        {groupsFor(role).map((g) => (
          <div key={g.title}>
            <p className="px-3 pb-1.5 text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">{g.title}</p>
            <ul className="space-y-1">
              {g.items.map((it) => {
                const on = active(it);
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      onClick={onNavigate}
                      aria-current={on ? "page" : undefined}
                      className={cn(
                        "flex min-h-12 items-center gap-3 rounded-xl px-3 font-semibold transition-colors",
                        on ? "bg-navy-900 text-paper" : "text-ink hover:bg-sky-100 hover:text-navy-900",
                      )}
                    >
                      <it.icon className="size-5 shrink-0" aria-hidden />
                      {it.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t border-line p-3">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex min-h-12 items-center gap-3 rounded-xl px-3 font-semibold text-ink hover:bg-sky-100 hover:text-navy-900"
        >
          <Globe className="size-5 shrink-0" aria-hidden /> Voltar ao site
        </Link>
        <div className="flex items-center gap-2">
          <form action={signOut} className="flex-1">
            <button
              type="submit"
              className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 font-semibold text-ink hover:bg-sky-100 hover:text-navy-900"
            >
              <LogOut className="size-5 shrink-0" aria-hidden /> Sair
            </button>
          </form>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

/**
 * Navegação das áreas logadas: sidebar fixa colada na lateral esquerda (sem cantos arredondados nas
 * bordas externas), sempre visível a partir de 1024 px. Abaixo disso, barra fina no topo com gaveta.
 */
export function AppSidebar({ nome, role }: { nome: string; role: Role }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-paper lg:block">
        <SidebarContent nome={nome} role={role} />
      </aside>

      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-line bg-paper/95 px-4 backdrop-blur lg:hidden">
        <Link href="/" aria-label="Voltar ao site">
          <Logo size="sm" />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label="Abrir menu do painel"
          className="grid size-11 place-items-center rounded-full border border-line text-navy-900 hover:bg-sky-100"
        >
          <Menu className="size-6" aria-hidden />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute inset-0 bg-navy-950/50"
            onClick={() => setOpen(false)}
            tabIndex={-1}
          />
          <div role="dialog" aria-modal="true" aria-label="Menu do painel" className="page-in absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-line bg-paper shadow-2xl">
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full text-navy-900 hover:bg-sky-100"
            >
              <X className="size-6" aria-hidden />
            </button>
            <SidebarContent nome={nome} role={role} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
