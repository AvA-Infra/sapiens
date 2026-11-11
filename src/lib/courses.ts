import "server-only";
import { createClient } from "@/lib/supabase/server";

export type Lesson = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  published: boolean;
  video_id: string | null;
  video_url: string | null;
  duration_seconds: number | null;
};
export type Module = { id: string; title: string; position: number; lessons: Lesson[] };
export type Course = { id: string; slug: string; title: string; description: string | null; modules: Module[] };

export type CourseProgress = {
  course: Pick<Course, "id" | "slug" | "title" | "description">;
  total: number;
  done: number;
  percent: number;
  /** Primeira aula ainda não concluída (ordem do curso); null se tudo concluído ou sem aulas. */
  next: { id: string; title: string } | null;
};

const byPosition = <T extends { position: number }>(a: T, b: T) => a.position - b.position;

/** Mapa lessonId -> concluída, para o usuário. */
export async function getCompletedMap(userId: string): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase.from("lesson_progress").select("lesson_id").eq("user_id", userId).eq("completed", true);
  return new Set((data ?? []).map((r) => r.lesson_id as string));
}

function flatLessons(modules: Module[]) {
  return [...modules].sort(byPosition).flatMap((m) => [...m.lessons].sort(byPosition));
}

/** Cursos em que o aluno está matriculado, com progresso e a próxima aula. */
export async function getMyCourses(userId: string): Promise<CourseProgress[]> {
  const supabase = await createClient();
  const { data: enr } = await supabase
    .from("enrollments")
    .select("courses(id, slug, title, description)")
    .eq("user_id", userId)
    .eq("status", "ativa");

  const courses = (enr ?? [])
    .map((e) => (Array.isArray(e.courses) ? e.courses[0] : e.courses))
    .filter(Boolean) as Pick<Course, "id" | "slug" | "title" | "description">[];
  if (courses.length === 0) return [];

  const { data: mods } = await supabase
    .from("modules")
    .select("id, course_id, title, position, lessons(id, title, description, position, published, video_id, video_url, duration_seconds)")
    .in("course_id", courses.map((c) => c.id));
  const done = await getCompletedMap(userId);

  return courses.map((course) => {
    const modules = ((mods ?? []).filter((m) => m.course_id === course.id) as unknown as Module[]).map((m) => ({
      ...m,
      lessons: (m.lessons ?? []).filter((l) => l.published),
    }));
    const lessons = flatLessons(modules);
    const doneCount = lessons.filter((l) => done.has(l.id)).length;
    const next = lessons.find((l) => !done.has(l.id));
    return {
      course,
      total: lessons.length,
      done: doneCount,
      percent: lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0,
      next: next ? { id: next.id, title: next.title } : null,
    };
  });
}

/** Curso por slug com módulos e aulas. O RLS já limita ao que o usuário pode ver. */
export async function getCourse(slug: string, includeUnpublished: boolean): Promise<Course | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select(
      "id, slug, title, description, modules(id, title, position, lessons(id, title, description, position, published, video_id, video_url, duration_seconds))",
    )
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return null;

  const modules = ([...((data.modules as unknown as Module[]) ?? [])].sort(byPosition)).map((m) => ({
    ...m,
    lessons: [...(m.lessons ?? [])].filter((l) => includeUnpublished || l.published).sort(byPosition),
  }));
  return { id: data.id, slug: data.slug, title: data.title, description: data.description, modules };
}

export { flatLessons };
