import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/** Leituras usadas em várias telas do painel. Só chame depois de conferir que é da equipe. */

export type One<T> = T | T[] | null;
export const pick = <T,>(v: One<T>) => (Array.isArray(v) ? v[0] : v) ?? undefined;

/** E-mails ficam em auth.users, que o RLS não expõe: leitura com a service_role, só no painel. */
export const getEmails = cache(async (): Promise<Map<string, string>> => {
  const emails = new Map<string, string>();
  try {
    const { data } = await createAdminClient().auth.admin.listUsers({ perPage: 1000 });
    data?.users.forEach((u) => emails.set(u.id, u.email ?? ""));
  } catch {
    // Sem service_role configurada, as telas mostram só os nomes.
  }
  return emails;
});

/** Cursos e quantos pedidos esperam liberação, para a barra lateral. */
export const getSidebarData = cache(async () => {
  const supabase = await createClient();
  const [{ data: courses }, { count: pending }] = await Promise.all([
    supabase.from("courses").select("id, title").order("title"),
    supabase.from("enrollments").select("id", { count: "exact", head: true }).eq("status", "pendente"),
  ]);
  return {
    courses: (courses ?? []) as { id: string; title: string }[],
    pending: pending ?? 0,
  };
});

export type CourseHead = { id: string; slug: string; title: string; description: string | null; published: boolean };

/** Dados básicos do curso para o cabeçalho e as abas. 404 se não existir. */
export const getCourseHead = cache(async (id: string): Promise<CourseHead> => {
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const supabase = await createClient();
  const { data } = await supabase.from("courses").select("id, slug, title, description, published").eq("id", id).maybeSingle();
  if (!data) notFound();
  return data as CourseHead;
});

/** Alunos de um curso, contados por situação. */
export async function getEnrollmentCounts(courseId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("enrollments").select("status").eq("course_id", courseId);
  const counts = { ativa: 0, pendente: 0, cancelada: 0 };
  (data ?? []).forEach((r) => {
    counts[r.status as keyof typeof counts] += 1;
  });
  return counts;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}
