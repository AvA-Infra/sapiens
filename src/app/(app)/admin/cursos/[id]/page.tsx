import Link from "next/link";
import { ArrowDown, ArrowUp, Pencil } from "lucide-react";
import { ActionForm, Field, inputClass } from "@/components/panel/ActionForm";
import { CourseHeader } from "@/components/panel/CourseHeader";
import { Section } from "@/components/ui/Section";
import { createLesson, createModule, deleteModule, moveLesson, moveModule, updateModule } from "@/lib/panel-actions";
import { getCourseHead } from "@/lib/panel-data";
import { createClient } from "@/lib/supabase/server";

type Lesson = { id: string; title: string; position: number; published: boolean; video_id: string | null; video_url: string | null };
type Module = { id: string; title: string; position: number; lessons: Lesson[] };

function Mover({ action, id, courseId }: { action: (fd: FormData) => Promise<void>; id: string; courseId: string }) {
  const btn = "grid size-9 place-items-center rounded-[8px] border border-line text-navy-900 hover:border-navy-900 hover:bg-sky-50";
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

/** Aba "Aulas" do curso: módulos e aulas, na ordem em que o aluno vê. */
export default async function CursoAulasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourseHead(id);
  const supabase = await createClient();
  const { data } = await supabase
    .from("modules")
    .select("id, title, position, lessons(id, title, position, published, video_id, video_url)")
    .eq("course_id", course.id);

  const modules = ((data ?? []) as unknown as Module[])
    .sort((a, b) => a.position - b.position)
    .map((m) => ({ ...m, lessons: [...m.lessons].sort((a, b) => a.position - b.position) }));

  return (
    <Section className="max-w-4xl">
      <CourseHeader id={course.id} tab="aulas" />

      <div className="mt-8 space-y-6">
        {modules.length === 0 && (
          <p className="text-ink-soft">Este curso ainda não tem módulos. Comece criando o primeiro abaixo (por exemplo, &quot;Citologia&quot;).</p>
        )}

        {modules.map((m, i) => (
          <div key={m.id} className="rounded-card border border-line">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line p-4">
              <ActionForm action={updateModule} submitLabel="Renomear" variant="quiet" className="flex flex-1 flex-wrap items-end gap-3 space-y-0">
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="course_id" value={course.id} />
                <label className="block min-w-0 flex-1">
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
                      {l.video_id || l.video_url ? "com vídeo" : "sem vídeo"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mover action={moveLesson} id={l.id} courseId={course.id} />
                    <Link
                      href={`/admin/aulas/${l.id}`}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-[8px] bg-navy-900 px-4 text-sm font-semibold text-paper hover:bg-navy-700"
                    >
                      <Pencil className="size-3.5" aria-hidden /> Editar
                    </Link>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-3 border-t border-line bg-sky-50 p-4">
              <ActionForm action={createLesson} submitLabel="Adicionar aula" pendingLabel="Criando..." variant="quiet" className="flex flex-wrap items-end gap-3 space-y-0">
                <input type="hidden" name="module_id" value={m.id} />
                <label className="block min-w-0 flex-1">
                  <span className="text-sm font-semibold text-ink-soft">Nova aula neste módulo</span>
                  <input name="title" required maxLength={140} placeholder="Título da aula" className={inputClass} />
                </label>
              </ActionForm>
              <details>
                <summary className="cursor-pointer text-sm font-semibold text-red-700">Excluir módulo</summary>
                <p className="mt-2 text-sm text-ink-soft">Apaga também as aulas e os materiais deste módulo.</p>
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
              <input name="title" required maxLength={120} placeholder="Ex.: Citologia" className={inputClass} />
            </Field>
          </ActionForm>
        </div>
      </div>
    </Section>
  );
}
