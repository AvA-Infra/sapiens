import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowUp, Pencil } from "lucide-react";
import { ActionForm, Field, inputClass } from "@/components/panel/ActionForm";
import { Section } from "@/components/ui/Section";
import { getCurrentUser } from "@/lib/auth";
import {
  createLesson,
  createModule,
  deleteCourse,
  deleteModule,
  moveLesson,
  moveModule,
  updateCourse,
  updateModule,
} from "@/lib/panel-actions";
import { createClient } from "@/lib/supabase/server";

type Lesson = { id: string; title: string; position: number; published: boolean; video_id: string | null };
type Module = { id: string; title: string; position: number; lessons: Lesson[] };
type Course = { id: string; slug: string; title: string; description: string | null; published: boolean; modules: Module[] };

function Mover({ action, id, courseId }: { action: (fd: FormData) => Promise<void>; id: string; courseId: string }) {
  const btn = "grid size-9 place-items-center rounded-full border border-line text-navy-900 hover:border-navy-900 hover:bg-sky-50";
  return (
    <div className="flex gap-1">
      {(["up", "down"] as const).map((dir) => (
        <form key={dir} action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="course_id" value={courseId} />
          <input type="hidden" name="dir" value={dir} />
          <button type="submit" className={btn} aria-label={dir === "up" ? "Mover para cima" : "Mover para baixo"}>
            {dir === "up" ? <ArrowUp className="size-4" aria-hidden /> : <ArrowDown className="size-4" aria-hidden />}
          </button>
        </form>
      ))}
    </div>
  );
}

export default async function CursoEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [user, supabase] = await Promise.all([getCurrentUser(), createClient()]);
  const { data } = await supabase
    .from("courses")
    .select("id, slug, title, description, published, modules(id, title, position, lessons(id, title, position, published, video_id))")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  const course = data as unknown as Course;
  const modules = [...course.modules]
    .sort((a, b) => a.position - b.position)
    .map((m) => ({ ...m, lessons: [...m.lessons].sort((a, b) => a.position - b.position) }));

  return (
    <Section>
      <Link href="/professor" className="text-sm font-semibold text-sky-600 hover:text-navy-900">
        ← Cursos
      </Link>
      <h1 className="mt-3 text-5xl font-bold text-navy-900 sm:text-6xl">{course.title}</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1.5fr]">
        <div className="space-y-8">
          <section aria-labelledby="dados" className="rounded-card bg-sky-50 p-6">
            <h2 id="dados" className="text-3xl font-bold text-navy-900">Dados do curso</h2>
            <ActionForm action={updateCourse} submitLabel="Salvar curso" className="mt-4">
              <input type="hidden" name="id" value={course.id} />
              <Field label="Título">
                <input name="title" defaultValue={course.title} required minLength={3} maxLength={120} className={inputClass} />
              </Field>
              <Field label="Descrição" hint="opcional">
                <textarea name="description" rows={4} defaultValue={course.description ?? ""} maxLength={1000} className={inputClass} />
              </Field>
              <label className="flex items-start gap-3">
                <input type="checkbox" name="published" defaultChecked={course.published} className="mt-1.5 size-5 accent-navy-900" />
                <span>
                  <span className="font-semibold text-navy-900">Curso publicado</span>
                  <span className="block text-sm text-ink-soft">
                    Alunos matriculados só veem as aulas publicadas, mesmo com o curso publicado.
                  </span>
                </span>
              </label>
            </ActionForm>
            <p className="mt-4 text-sm">
              <Link href={`/aluno/curso/${course.slug}`} className="font-semibold text-sky-600 underline underline-offset-2">
                Ver como aluno
              </Link>
            </p>
          </section>

          {user?.role === "admin" && (
            <details className="rounded-card border border-red-200 p-5">
              <summary className="cursor-pointer font-semibold text-red-700">Excluir curso</summary>
              <p className="mt-3 text-sm text-ink-soft">
                Apaga o curso, os módulos, as aulas, os materiais e o progresso dos alunos. Não dá para desfazer.
              </p>
              <ActionForm action={deleteCourse} submitLabel="Confirmar exclusão" pendingLabel="Excluindo..." variant="danger" className="mt-3">
                <input type="hidden" name="id" value={course.id} />
              </ActionForm>
            </details>
          )}
        </div>

        <section aria-labelledby="conteudo" className="space-y-6">
          <h2 id="conteudo" className="text-3xl font-bold text-navy-900">Módulos e aulas</h2>

          {modules.length === 0 && <p className="text-ink-soft">Nenhum módulo ainda. Crie o primeiro abaixo.</p>}

          {modules.map((m, i) => (
            <div key={m.id} className="rounded-card border border-line">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line p-4">
                <ActionForm action={updateModule} submitLabel="Renomear" variant="quiet" className="flex-1">
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="course_id" value={course.id} />
                  <label className="block">
                    <span className="text-sm font-semibold text-ink-soft">Módulo {i + 1}</span>
                    <input name="title" defaultValue={m.title} required maxLength={120} className={inputClass} />
                  </label>
                </ActionForm>
                <Mover action={moveModule} id={m.id} courseId={course.id} />
              </div>

              <ul className="divide-y divide-line">
                {m.lessons.length === 0 && <li className="p-4 text-sm text-ink-soft">Sem aulas neste módulo.</li>}
                {m.lessons.map((l) => (
                  <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div>
                      <p className="font-semibold text-navy-900">{l.title}</p>
                      <p className="text-sm text-ink-soft">
                        <span className={l.published ? "font-semibold text-sky-600" : ""}>{l.published ? "Publicada" : "Rascunho"}</span>
                        {" · "}
                        {l.video_id ? "com vídeo" : "sem vídeo"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mover action={moveLesson} id={l.id} courseId={course.id} />
                      <Link
                        href={`/professor/aula/${l.id}`}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-navy-900 px-4 text-sm font-semibold text-paper hover:bg-navy-700"
                      >
                        <Pencil className="size-3.5" aria-hidden /> Editar
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="space-y-3 border-t border-line bg-sky-50 p-4">
                <ActionForm action={createLesson} submitLabel="Adicionar aula" pendingLabel="Criando..." variant="quiet" className="space-y-2">
                  <input type="hidden" name="module_id" value={m.id} />
                  <label className="block">
                    <span className="text-sm font-semibold text-ink-soft">Nova aula neste módulo</span>
                    <input name="title" required maxLength={140} placeholder="Título da aula" className={inputClass} />
                  </label>
                </ActionForm>
                <details>
                  <summary className="cursor-pointer text-sm font-semibold text-red-700">Excluir módulo</summary>
                  <p className="mt-2 text-sm text-ink-soft">Apaga também as aulas e materiais deste módulo.</p>
                  <ActionForm action={deleteModule} submitLabel="Confirmar exclusão" pendingLabel="Excluindo..." variant="danger" className="mt-2">
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="course_id" value={course.id} />
                  </ActionForm>
                </details>
              </div>
            </div>
          ))}

          <div className="rounded-card border border-dashed border-sky-500/60 p-5">
            <ActionForm action={createModule} submitLabel="Criar módulo" pendingLabel="Criando...">
              <input type="hidden" name="course_id" value={course.id} />
              <Field label="Novo módulo">
                <input name="title" required maxLength={120} placeholder="Ex.: Módulo 2: Citologia" className={inputClass} />
              </Field>
            </ActionForm>
          </div>
        </section>
      </div>
    </Section>
  );
}
