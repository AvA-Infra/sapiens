import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type Role = "aluno" | "professor" | "admin";
export type CurrentUser = { id: string; email: string; nome: string; role: Role };

/**
 * Usuário logado, ou null. Valida o JWT (getClaims) e lê o papel em `profiles`.
 * `cache` evita repetir a consulta na mesma requisição.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;

  const { data: profile } = await supabase.from("profiles").select("nome, role").eq("id", claims.sub).single();
  if (!profile) return null;
  return {
    id: claims.sub,
    email: (claims.email as string | undefined) ?? "",
    nome: profile.nome || (claims.email as string | undefined) || "Aluno",
    role: profile.role as Role,
  };
});

/** Exige login. Sem sessão, redireciona para /entrar. */
export async function requireUser(next?: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(next ? `/entrar?next=${encodeURIComponent(next)}` : "/entrar");
  return user;
}

/** Exige um dos papéis. Quem está logado sem permissão volta para a área do aluno. */
export async function requireRole(roles: Role[]): Promise<CurrentUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect("/aluno");
  return user;
}

/**
 * Equipe = professores. Todo professor é administrador: o papel gravado é 'admin'
 * ('professor', de contas antigas, vale o mesmo).
 */
export const isStaff = (role: Role) => role === "admin" || role === "professor";

/** Exige ser da equipe (painel). */
export const requireStaff = () => requireRole(["admin", "professor"]);

/** Aceita só caminhos internos conhecidos, evitando open redirect via ?next=. */
export function safeNext(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/aluno";
  return ["/aluno", "/admin"].some((p) => value === p || value.startsWith(`${p}/`)) ? value : "/aluno";
}
