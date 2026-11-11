"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { rateLimit } from "@/lib/ratelimit";
import { commentSchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const idSchema = z.string().uuid();

/** Marca ou desmarca a aula como concluída. O RLS garante que só vale para aulas que o aluno pode ver. */
export async function setLessonCompleted(lessonId: string, completed: boolean, path: string) {
  const user = await requireUser();
  if (!idSchema.safeParse(lessonId).success) return { ok: false as const, error: "Aula inválida." };

  const supabase = await createClient();
  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" },
  );
  if (error) return { ok: false as const, error: "Não foi possível salvar agora." };

  revalidatePath(path.startsWith("/aluno/") ? path : "/aluno");
  revalidatePath("/aluno");
  return { ok: true as const };
}

export type CommentState = { error?: string; ok?: boolean };

export async function postComment(_prev: CommentState, formData: FormData): Promise<CommentState> {
  const user = await requireUser();
  const parsed = commentSchema.safeParse({ lessonId: formData.get("lessonId"), body: formData.get("body") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Confira o texto." };

  if (!(await rateLimit(`comment:${user.id}`, 10, 10 * 60 * 1000)).ok) {
    return { error: "Muitos comentários em pouco tempo. Aguarde um pouco." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("comments").insert({
    lesson_id: parsed.data.lessonId,
    user_id: user.id,
    author_name: user.nome,
    body: parsed.data.body,
  });
  if (error) return { error: "Não foi possível enviar sua dúvida agora." };

  // Só revalida páginas da área do aluno (o caminho vem do formulário).
  const path = String(formData.get("path") ?? "");
  revalidatePath(path.startsWith("/aluno/") ? path : "/aluno");
  return { ok: true };
}
