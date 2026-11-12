import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { ActionForm, Field, inputClass } from "@/components/panel/ActionForm";
import { MaterialUploader } from "@/components/panel/MaterialUploader";
import { Section } from "@/components/ui/Section";
import { deleteLesson, deleteMaterial, updateLesson } from "@/lib/panel-actions";
import { createClient } from "@/lib/supabase/server";

type LessonRow = {
  id: string;
  title: string;
  description: string | null;
  video_id: string | null;
  video_url: string | null;
  duration_seconds: number | null;
  published: boolean;
  modules: { course_id: string; courses: { id: string; slug: string; title: string } | { id: string; slug: string; title: string }[] };
};

export default async function AulaEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("lessons")
    .select("id, title, description, video_id, video_url, duration_seconds, published, modules(course_id, courses(id, slug, title))")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  const lesson = data as unknown as LessonRow;
  const mod = Array.isArray(lesson.modules) ? lesson.modules[0] : lesson.modules;
  const course = Array.isArray(mod.courses) ? mod.courses[0] : mod.courses;

  const { data: materials } = await supabase.from("materials").select("id, title").eq("lesson_id", id).order("title");

  return (
    <Section>
      <Link href={`/admin/cursos/${course.id}`} className="text-sm font-semibold text-sky-600 underline underline-offset-2 hover:text-navy-900">
        {course.title}
      </Link>
      <h1 className="mt-3 text-4xl font-bold text-navy-900 sm:text-5xl">{lesson.title}</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        <section aria-labelledby="aula" className="rounded-card bg-sky-50 p-6">
          <h2 id="aula" className="text-3xl font-bold text-navy-900">Dados da aula</h2>
          <ActionForm action={updateLesson} submitLabel="Salvar aula" className="mt-4">
            <input type="hidden" name="id" value={lesson.id} />
            <Field label="Título">
              <input name="title" defaultValue={lesson.title} required maxLength={140} className={inputClass} />
            </Field>
            <Field label="Descrição" hint="opcional">
              <textarea name="description" rows={4} defaultValue={lesson.description ?? ""} maxLength={2000} className={inputClass} />
            </Field>
            <Field label="ID do vídeo" hint="código do vídeo no Bunny Stream">
              <input
                name="video_id"
                defaultValue={lesson.video_id ?? ""}
                maxLength={100}
                placeholder="Ex.: 3f2a9c1e-0b7d-4c5e-9a1f-2d6b8e4c7a10"
                className={inputClass}
              />
            </Field>
            <Field label="Link do vídeo" hint="opcional, só se não usar o Bunny; precisa começar com https://">
              <input name="video_url" type="url" defaultValue={lesson.video_url ?? ""} maxLength={500} className={inputClass} />
            </Field>
            <Field label="Duração em minutos" hint="opcional">
              <input
                name="duration_minutes"
                type="number"
                min={0}
                max={1000}
                defaultValue={lesson.duration_seconds ? Math.round(lesson.duration_seconds / 60) : ""}
                className={inputClass}
              />
            </Field>
            <label className="flex items-start gap-3">
              <input type="checkbox" name="published" defaultChecked={lesson.published} className="mt-1.5 size-5 accent-navy-900" />
              <span>
                <span className="font-semibold text-navy-900">Aula publicada</span>
                <span className="block text-sm text-ink-soft">Desmarcada, a aula fica como rascunho e os alunos não veem.</span>
              </span>
            </label>
          </ActionForm>
          <p className="mt-4 text-sm">
            <Link href={`/aluno/curso/${course.slug}/aula/${lesson.id}`} className="font-semibold text-sky-600 underline underline-offset-2">
              Ver como aluno
            </Link>
          </p>

          <details className="mt-6 border-t border-line pt-4">
            <summary className="cursor-pointer text-sm font-semibold text-red-700">Excluir aula</summary>
            <p className="mt-2 text-sm text-ink-soft">Apaga também os materiais e o progresso dos alunos nesta aula.</p>
            <ActionForm action={deleteLesson} submitLabel="Confirmar exclusão" pendingLabel="Excluindo..." variant="danger" className="mt-2">
              <input type="hidden" name="id" value={lesson.id} />
              <input type="hidden" name="course_id" value={course.id} />
            </ActionForm>
          </details>
        </section>

        <section aria-labelledby="materiais" className="space-y-5">
          <h2 id="materiais" className="text-3xl font-bold text-navy-900">Materiais de apoio</h2>
          <ul className="space-y-2">
            {(materials ?? []).length === 0 && <li className="text-ink-soft">Nenhum material nesta aula.</li>}
            {(materials ?? []).map((m) => (
              <li key={m.id as string} className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line p-3">
                <span className="inline-flex items-center gap-2 font-semibold text-navy-900">
                  <FileText className="size-5 text-sky-500" aria-hidden /> {m.title as string}
                </span>
                <ActionForm action={deleteMaterial} submitLabel="Remover" pendingLabel="Removendo..." variant="quiet" className="space-y-0">
                  <input type="hidden" name="id" value={m.id as string} />
                  <input type="hidden" name="lesson_id" value={lesson.id} />
                </ActionForm>
              </li>
            ))}
          </ul>
          <MaterialUploader lessonId={lesson.id} courseId={course.id} />
        </section>
      </div>
    </Section>
  );
}
