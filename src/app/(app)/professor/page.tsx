import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ActionForm, Field, inputClass } from "@/components/panel/ActionForm";
import { Eyebrow, Section } from "@/components/ui/Section";
import { createCourse } from "@/lib/panel-actions";
import { createClient } from "@/lib/supabase/server";

type Row = { id: string; title: string; published: boolean; modules: { id: string; lessons: { id: string; published: boolean }[] }[] };

export default async function ProfessorPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("id, title, published, modules(id, lessons(id, published))")
    .order("created_at", { ascending: false });
  const courses = (data ?? []) as unknown as Row[];

  return (
    <Section>
      <Eyebrow>Painel do professor</Eyebrow>
      <h1 className="text-5xl font-bold text-navy-900 sm:text-6xl">Cursos</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <ul className="space-y-4">
          {courses.length === 0 && <li className="text-ink-soft">Nenhum curso ainda. Crie o primeiro ao lado.</li>}
          {courses.map((c) => {
            const lessons = c.modules.flatMap((m) => m.lessons);
            return (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-line p-5">
                <div>
                  <p className="font-display text-3xl font-bold text-navy-900">{c.title}</p>
                  <p className="text-sm text-ink-soft">
                    {c.modules.length} módulo(s) · {lessons.length} aula(s) ·{" "}
                    <span className={c.published ? "font-semibold text-sky-600" : "font-semibold text-ink-soft"}>
                      {c.published ? "Publicado" : "Rascunho"}
                    </span>
                  </p>
                </div>
                <Link href={`/professor/curso/${c.id}`} className="inline-flex items-center gap-2 font-semibold text-sky-600 hover:text-navy-900">
                  Editar <ArrowRight className="size-4" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="rounded-card bg-sky-50 p-6">
          <h2 className="text-3xl font-bold text-navy-900">Novo curso</h2>
          <ActionForm action={createCourse} submitLabel="Criar curso" pendingLabel="Criando..." className="mt-4">
            <Field label="Título">
              <input name="title" required minLength={3} maxLength={120} className={inputClass} />
            </Field>
            <Field label="Descrição" hint="opcional">
              <textarea name="description" rows={3} maxLength={1000} className={inputClass} />
            </Field>
          </ActionForm>
          <p className="mt-3 text-sm text-ink-soft">O curso nasce como rascunho. Publique quando estiver pronto.</p>
        </div>
      </div>
    </Section>
  );
}
