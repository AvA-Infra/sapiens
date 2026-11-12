"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/auth";
import { classSchema, enrollmentSchema, roleSchema, uuid } from "@/lib/panel-schemas";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/components/panel/ActionForm";

/**
 * Ações do painel. Todo professor é administrador: a ação confere no servidor (requireStaff)
 * e o banco confere de novo pelo RLS.
 */

const first = (e: { issues: { message: string }[] }) => e.issues[0]?.message ?? "Confira os campos.";
const DB_ERROR = "Não foi possível salvar agora. Tente de novo.";
/** O painel inteiro mostra contagens (barra lateral, visão geral, abas do curso): atualiza tudo. */
const refresh = () => revalidatePath("/admin", "layout");

export async function setUserRole(_p: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireStaff();
  const parsed = roleSchema.safeParse({ user_id: fd.get("user_id"), role: fd.get("role") });
  if (!parsed.success) return { error: "Papel inválido." };
  // Evita ficar sem acesso ao painel por engano.
  if (parsed.data.user_id === me.id && parsed.data.role !== "admin") {
    return { error: "Você não pode tirar o seu próprio acesso de professor." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ role: parsed.data.role }).eq("id", parsed.data.user_id);
  if (error) return { error: DB_ERROR };
  refresh();
  return { ok: true, message: parsed.data.role === "admin" ? "Agora é professor." : "Agora é aluno." };
}

export async function createClass(_p: ActionState, fd: FormData): Promise<ActionState> {
  await requireStaff();
  const parsed = classSchema.safeParse({ name: fd.get("name"), description: fd.get("description") ?? "" });
  if (!parsed.success) return { error: first(parsed.error) };
  const supabase = await createClient();
  const { error } = await supabase
    .from("classes")
    .insert({ name: parsed.data.name, description: parsed.data.description || null });
  if (error) return { error: DB_ERROR };
  refresh();
  return { ok: true, message: "Turma criada." };
}

export async function toggleClass(_p: ActionState, fd: FormData): Promise<ActionState> {
  await requireStaff();
  const id = uuid.safeParse(fd.get("id"));
  if (!id.success) return { error: "Turma inválida." };
  const active = fd.get("active") === "true";
  const supabase = await createClient();
  const { error } = await supabase.from("classes").update({ active: !active }).eq("id", id.data);
  if (error) return { error: DB_ERROR };
  refresh();
  return { ok: true, message: active ? "Turma desativada." : "Turma ativada." };
}

/** Libera (ou reativa) o acesso de um aluno a um curso. */
export async function enrollStudent(_p: ActionState, fd: FormData): Promise<ActionState> {
  await requireStaff();
  const parsed = enrollmentSchema.safeParse({
    user_id: fd.get("user_id"),
    course_id: fd.get("course_id"),
    class_id: fd.get("class_id") ?? "",
  });
  if (!parsed.success) return { error: first(parsed.error) };
  const supabase = await createClient();
  const { error } = await supabase.from("enrollments").upsert(
    {
      user_id: parsed.data.user_id,
      course_id: parsed.data.course_id,
      class_id: parsed.data.class_id || null,
      status: "ativa",
    },
    { onConflict: "user_id,course_id" },
  );
  if (error) return { error: DB_ERROR };
  refresh();
  return { ok: true, message: "Acesso liberado." };
}

const statusMessage = { ativa: "Acesso liberado.", pendente: "Marcado como esperando.", cancelada: "Acesso cancelado." };

/** Muda a situação de uma matrícula: liberar, deixar esperando ou cancelar. */
export async function setEnrollmentStatus(_p: ActionState, fd: FormData): Promise<ActionState> {
  await requireStaff();
  const id = uuid.safeParse(fd.get("id"));
  const status = String(fd.get("status")) as keyof typeof statusMessage;
  if (!id.success || !(status in statusMessage)) return { error: "Dados inválidos." };
  const supabase = await createClient();
  const { error } = await supabase.from("enrollments").update({ status }).eq("id", id.data);
  if (error) return { error: DB_ERROR };
  refresh();
  return { ok: true, message: statusMessage[status] };
}
