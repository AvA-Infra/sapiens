"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { classSchema, enrollmentSchema, roleSchema, uuid } from "@/lib/panel-schemas";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/components/panel/ActionForm";

/** Ações do painel admin. Só admin (conferido aqui e no RLS). */

const admin = () => requireRole(["admin"]);
const first = (e: { issues: { message: string }[] }) => e.issues[0]?.message ?? "Confira os campos.";
const DB_ERROR = "Não foi possível salvar agora. Tente de novo.";

export async function setUserRole(_p: ActionState, fd: FormData): Promise<ActionState> {
  const me = await admin();
  const parsed = roleSchema.safeParse({ user_id: fd.get("user_id"), role: fd.get("role") });
  if (!parsed.success) return { error: "Papel inválido." };
  // Evita ficar sem nenhum admin por engano.
  if (parsed.data.user_id === me.id && parsed.data.role !== "admin") {
    return { error: "Você não pode tirar o seu próprio acesso de admin." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ role: parsed.data.role }).eq("id", parsed.data.user_id);
  if (error) return { error: DB_ERROR };
  revalidatePath("/admin/usuarios");
  return { ok: true, message: "Papel atualizado." };
}

export async function createClass(_p: ActionState, fd: FormData): Promise<ActionState> {
  await admin();
  const parsed = classSchema.safeParse({ name: fd.get("name"), description: fd.get("description") ?? "" });
  if (!parsed.success) return { error: first(parsed.error) };
  const supabase = await createClient();
  const { error } = await supabase
    .from("classes")
    .insert({ name: parsed.data.name, description: parsed.data.description || null });
  if (error) return { error: DB_ERROR };
  revalidatePath("/admin/turmas");
  return { ok: true, message: "Turma criada." };
}

export async function toggleClass(_p: ActionState, fd: FormData): Promise<ActionState> {
  await admin();
  const id = uuid.safeParse(fd.get("id"));
  if (!id.success) return { error: "Turma inválida." };
  const active = fd.get("active") === "true";
  const supabase = await createClient();
  const { error } = await supabase.from("classes").update({ active: !active }).eq("id", id.data);
  if (error) return { error: DB_ERROR };
  revalidatePath("/admin/turmas");
  return { ok: true, message: active ? "Turma desativada." : "Turma ativada." };
}

export async function enrollStudent(_p: ActionState, fd: FormData): Promise<ActionState> {
  await admin();
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
  revalidatePath("/admin/matriculas");
  return { ok: true, message: "Matrícula liberada." };
}

export async function setEnrollmentStatus(_p: ActionState, fd: FormData): Promise<ActionState> {
  await admin();
  const id = uuid.safeParse(fd.get("id"));
  const status = fd.get("status");
  if (!id.success || !["ativa", "pendente", "cancelada"].includes(String(status))) return { error: "Dados inválidos." };
  const supabase = await createClient();
  const { error } = await supabase.from("enrollments").update({ status }).eq("id", id.data);
  if (error) return { error: DB_ERROR };
  revalidatePath("/admin/matriculas");
  return { ok: true, message: "Matrícula atualizada." };
}
