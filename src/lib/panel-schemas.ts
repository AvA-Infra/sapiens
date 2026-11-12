import { z } from "zod";

const text = (min: number, max: number, msg: string) => z.string().trim().min(min, msg).max(max, "Texto muito longo");
const optional = (max: number) => z.string().trim().max(max, "Texto muito longo").optional().or(z.literal(""));

export const courseSchema = z.object({
  title: text(3, 120, "Dê um título ao curso (mínimo 3 letras)"),
  description: optional(1000),
  published: z.boolean(),
});

export const moduleSchema = z.object({ title: text(2, 120, "Dê um título ao módulo") });

export const lessonSchema = z.object({
  title: text(2, 140, "Dê um título à aula"),
  description: optional(2000),
  // ID do vídeo no provedor (ex.: GUID do Bunny). Sem espaços nem barras.
  video_id: z.string().trim().max(100).regex(/^[A-Za-z0-9_-]*$/, "ID de vídeo inválido: use só letras, números, - e _").optional().or(z.literal("")),
  video_url: z.string().trim().max(500).url("Link inválido").startsWith("https://", "O link precisa começar com https://").optional().or(z.literal("")),
  duration_minutes: z.coerce.number().int().min(0).max(1000).optional(),
  published: z.boolean(),
});

export const classSchema = z.object({
  name: text(2, 80, "Dê um nome à turma"),
  description: optional(500),
});

export const enrollmentSchema = z.object({
  user_id: z.string().uuid("Escolha o aluno"),
  course_id: z.string().uuid("Escolha o curso"),
  class_id: z.string().uuid().optional().or(z.literal("")),
});

export const roleSchema = z.object({
  user_id: z.string().uuid(),
  // 'admin' aparece no painel como "Professor": todo professor é administrador.
  role: z.enum(["aluno", "admin"]),
});

export const uuid = z.string().uuid();
