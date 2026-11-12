"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { courseSchema, lessonSchema, moduleSchema, uuid } from "@/lib/panel-schemas";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/components/panel/ActionForm";

/**
 * Ações de conteúdo do painel (cursos, módulos, aulas, materiais). Toda ação confere o papel no servidor (requireStaff) e o banco
 * confere de novo pelo RLS: mesmo que alguém chame a ação na mão, só a equipe escreve.
 */

const staff = requireStaff;
const flag = (fd: FormData, name: string) => fd.get(name) === "on";
const first = (e: { issues: { message: string }[] }) => e.issues[0]?.message ?? "Confira os campos.";
const DB_ERROR = "Não foi possível salvar agora. Tente de novo.";

function slugify(s: string) {
  return (
    s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "curso"
  );
}

// ------------------------------------------------------------------ cursos
export async function createCourse(_p: ActionState, fd: FormData): Promise<ActionState> {
  const user = await staff();
  const parsed = courseSchema.safeParse({
    title: fd.get("title"),
    description: fd.get("description") ?? "",
    published: false,
  });
  if (!parsed.success) return { error: first(parsed.error) };

  const supabase = await createClient();
  const base = slugify(parsed.data.title);
  // Slug único: se já existir, acrescenta um sufixo curto.
  for (let attempt = 0; attempt < 4; attempt++) {
    const slug = attempt === 0 ? base : `${base}-${Math.random().toString(36).slice(2, 6)}`;
    const { data, error } = await supabase
      .from("courses")
      .insert({
        slug,
        title: parsed.data.title,
        description: parsed.data.description || null,
        published: false,
        created_by: user.id,
      })
      .select("id")
      .single();
    if (data) {
      revalidatePath("/admin", "layout");
      redirect(`/admin/cursos/${data.id}`);
    }
    if (error?.code !== "23505") return { error: DB_ERROR };
  }
  return { error: DB_ERROR };
}

export async function updateCourse(_p: ActionState, fd: FormData): Promise<ActionState> {
  await staff();
  const id = uuid.safeParse(fd.get("id"));
  const parsed = courseSchema.safeParse({
    title: fd.get("title"),
    description: fd.get("description") ?? "",
    published: flag(fd, "published"),
  });
  if (!id.success) return { error: "Curso inválido." };
  if (!parsed.success) return { error: first(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase
    .from("courses")
    .update({
      title: parsed.data.title,
      description: parsed.data.description || null,
      published: parsed.data.published,
    })
    .eq("id", id.data);
  if (error) return { error: DB_ERROR };
  revalidatePath(`/admin/cursos/${id.data}`);
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Curso salvo." };
}

/** Apagar um curso apaga módulos, aulas e o progresso dos alunos (a tela pede confirmação). */
export async function deleteCourse(_p: ActionState, fd: FormData): Promise<ActionState> {
  await staff();
  const id = uuid.safeParse(fd.get("id"));
  if (!id.success) return { error: "Curso inválido." };
  const supabase = await createClient();
  const { error } = await supabase.from("courses").delete().eq("id", id.data);
  if (error) return { error: DB_ERROR };
  revalidatePath("/admin", "layout");
  redirect("/admin/cursos");
}

// ------------------------------------------------------------------ módulos
export async function createModule(_p: ActionState, fd: FormData): Promise<ActionState> {
  await staff();
  const courseId = uuid.safeParse(fd.get("course_id"));
  const parsed = moduleSchema.safeParse({ title: fd.get("title") });
  if (!courseId.success) return { error: "Curso inválido." };
  if (!parsed.success) return { error: first(parsed.error) };

  const supabase = await createClient();
  const { data: last } = await supabase
    .from("modules")
    .select("position")
    .eq("course_id", courseId.data)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { error } = await supabase
    .from("modules")
    .insert({ course_id: courseId.data, title: parsed.data.title, position: (last?.position ?? 0) + 1 });
  if (error) return { error: DB_ERROR };
  revalidatePath(`/admin/cursos/${courseId.data}`);
  return { ok: true, message: "Módulo criado." };
}

export async function updateModule(_p: ActionState, fd: FormData): Promise<ActionState> {
  await staff();
  const id = uuid.safeParse(fd.get("id"));
  const courseId = uuid.safeParse(fd.get("course_id"));
  const parsed = moduleSchema.safeParse({ title: fd.get("title") });
  if (!id.success || !courseId.success) return { error: "Módulo inválido." };
  if (!parsed.success) return { error: first(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.from("modules").update({ title: parsed.data.title }).eq("id", id.data);
  if (error) return { error: DB_ERROR };
  revalidatePath(`/admin/cursos/${courseId.data}`);
  return { ok: true, message: "Módulo salvo." };
}

export async function deleteModule(_p: ActionState, fd: FormData): Promise<ActionState> {
  await staff();
  const id = uuid.safeParse(fd.get("id"));
  const courseId = uuid.safeParse(fd.get("course_id"));
  if (!id.success || !courseId.success) return { error: "Módulo inválido." };
  const supabase = await createClient();
  const { error } = await supabase.from("modules").delete().eq("id", id.data);
  if (error) return { error: DB_ERROR };
  revalidatePath(`/admin/cursos/${courseId.data}`);
  return { ok: true, message: "Módulo excluído." };
}

/** Sobe ou desce um módulo/aula trocando a posição com o vizinho. */
async function move(table: "modules" | "lessons", fd: FormData) {
  await staff();
  const id = uuid.safeParse(fd.get("id"));
  const courseId = uuid.safeParse(fd.get("course_id"));
  const dir = fd.get("dir") === "up" ? "up" : "down";
  if (!id.success || !courseId.success) return;

  const supabase = await createClient();
  const parentCol = table === "modules" ? "course_id" : "module_id";
  const { data: me } = await supabase.from(table).select(`id, position, ${parentCol}`).eq("id", id.data).single();
  if (!me) return;
  const parent = (me as unknown as Record<string, string>)[parentCol];

  const { data: neighbor } = await supabase
    .from(table)
    .select("id, position")
    .eq(parentCol, parent)
    [dir === "up" ? "lt" : "gt"]("position", me.position)
    .order("position", { ascending: dir !== "up" })
    .limit(1)
    .maybeSingle();
  if (!neighbor) return;

  await supabase.from(table).update({ position: neighbor.position }).eq("id", me.id);
  await supabase.from(table).update({ position: me.position }).eq("id", neighbor.id);
  revalidatePath(`/admin/cursos/${courseId.data}`);
}
export async function moveModule(fd: FormData) {
  await move("modules", fd);
}
export async function moveLesson(fd: FormData) {
  await move("lessons", fd);
}

// ------------------------------------------------------------------ aulas
export async function createLesson(_p: ActionState, fd: FormData): Promise<ActionState> {
  await staff();
  const moduleId = uuid.safeParse(fd.get("module_id"));
  const parsed = moduleSchema.safeParse({ title: fd.get("title") });
  if (!moduleId.success) return { error: "Módulo inválido." };
  if (!parsed.success) return { error: first(parsed.error) };

  const supabase = await createClient();
  const { data: last } = await supabase
    .from("lessons")
    .select("position")
    .eq("module_id", moduleId.data)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data, error } = await supabase
    .from("lessons")
    .insert({ module_id: moduleId.data, title: parsed.data.title, position: (last?.position ?? 0) + 1, published: false })
    .select("id")
    .single();
  if (error || !data) return { error: DB_ERROR };
  redirect(`/admin/aulas/${data.id}`);
}

export async function updateLesson(_p: ActionState, fd: FormData): Promise<ActionState> {
  await staff();
  const id = uuid.safeParse(fd.get("id"));
  const parsed = lessonSchema.safeParse({
    title: fd.get("title"),
    description: fd.get("description") ?? "",
    video_id: fd.get("video_id") ?? "",
    video_url: fd.get("video_url") ?? "",
    duration_minutes: fd.get("duration_minutes") || undefined,
    published: flag(fd, "published"),
  });
  if (!id.success) return { error: "Aula inválida." };
  if (!parsed.success) return { error: first(parsed.error) };

  const d = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase
    .from("lessons")
    .update({
      title: d.title,
      description: d.description || null,
      video_id: d.video_id || null,
      video_url: d.video_url || null,
      duration_seconds: d.duration_minutes ? d.duration_minutes * 60 : null,
      published: d.published,
    })
    .eq("id", id.data);
  if (error) return { error: DB_ERROR };
  revalidatePath(`/admin/aulas/${id.data}`);
  return { ok: true, message: d.published ? "Aula salva e publicada." : "Aula salva como rascunho." };
}

export async function deleteLesson(_p: ActionState, fd: FormData): Promise<ActionState> {
  await staff();
  const id = uuid.safeParse(fd.get("id"));
  const courseId = uuid.safeParse(fd.get("course_id"));
  if (!id.success || !courseId.success) return { error: "Aula inválida." };
  const supabase = await createClient();
  const { error } = await supabase.from("lessons").delete().eq("id", id.data);
  if (error) return { error: DB_ERROR };
  redirect(`/admin/cursos/${courseId.data}`);
}

// ------------------------------------------------------------------ materiais (PDF)
/**
 * O PDF é enviado direto do navegador para o bucket privado (sem passar pelo limite de corpo das
 * Server Actions). Aqui só registramos o arquivo, depois de conferir que o caminho pertence a esta aula.
 */
export async function addMaterial(lessonId: string, title: string, path: string): Promise<ActionState> {
  await staff();
  const id = uuid.safeParse(lessonId);
  const cleanTitle = title.trim().slice(0, 140);
  if (!id.success || cleanTitle.length < 2) return { error: "Dê um nome ao material." };

  const supabase = await createClient();
  const { data: lesson } = await supabase.from("lessons").select("id, modules(course_id)").eq("id", id.data).single();
  const mod = Array.isArray(lesson?.modules) ? lesson?.modules[0] : lesson?.modules;
  const courseId = (mod as { course_id?: string } | undefined)?.course_id;
  if (!lesson || !courseId) return { error: "Aula não encontrada." };

  const expected = new RegExp(`^${courseId}/${id.data}/[A-Za-z0-9._-]+\\.pdf$`);
  if (!expected.test(path)) return { error: "Arquivo inválido." };

  const { error } = await supabase.from("materials").insert({ lesson_id: id.data, title: cleanTitle, file_path: path });
  if (error) return { error: DB_ERROR };
  revalidatePath(`/admin/aulas/${id.data}`);
  return { ok: true, message: "Material adicionado." };
}

export async function deleteMaterial(_p: ActionState, fd: FormData): Promise<ActionState> {
  await staff();
  const id = uuid.safeParse(fd.get("id"));
  const lessonId = uuid.safeParse(fd.get("lesson_id"));
  if (!id.success || !lessonId.success) return { error: "Material inválido." };

  const supabase = await createClient();
  const { data: mat } = await supabase.from("materials").select("file_path").eq("id", id.data).single();
  if (mat?.file_path) await supabase.storage.from("materials").remove([mat.file_path as string]);
  const { error } = await supabase.from("materials").delete().eq("id", id.data);
  if (error) return { error: DB_ERROR };
  revalidatePath(`/admin/aulas/${lessonId.data}`);
  return { ok: true, message: "Material removido." };
}
