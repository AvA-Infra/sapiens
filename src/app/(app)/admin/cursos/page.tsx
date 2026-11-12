import Link from "next/link";
import { ActionForm, Field, inputClass } from "@/components/panel/ActionForm";
import { Eyebrow, Section } from "@/components/ui/Section";
import { createCourse } from "@/lib/panel-actions";
import { createClient } from "@/lib/supabase/server";

type Row = {
  id: string;
  title: string;
  published: boolean;
  modules: { id: string; lessons: { id: string }[] }[];
  enrollments: { status: string }[];
};

export default async function CursosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("id, title, published, modules(id, lessons(id)), enrollments(status)")
    .order("title");
  const courses = (data ?? []) as unknown as Row[];

  return (
    <Section className="max-w-4xl">
      <Eyebrow>Painel</Eyebrow>
      <h1 className="text-4xl font-bold text-navy-900 sm:text-5xl">Cursos</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">Cada curso tem a sua página, com as aulas, os alunos e os dados dele.</p>

      {courses.length === 0 ? (
        <p className="mt-10 text-ink-soft">Nenhum curso ainda. Crie o primeiro abaixo.</p>
      ) : (
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {courses.map((c) => {
            const lessons = c.modules.reduce((n, m) => n + m.lessons.length, 0);
            const active = c.enrollments.filter((e) => e.status === "ativa").length;
            const pending = c.enrollments.filter((e) => e.status === "pendente").length;
            return (
              <li key={c.id} className="py-5">
                <Link href={`/admin/cursos/${c.id}`} className="font-display text-2xl font-bold text-navy-900 underline-offset-4 hover:underline">
                  {c.title}
                </Link>
                <p className="mt-1 text-ink-soft">
                  <span className={c.published ? "font-semibold text-sky-600" : "font-semibold"}>{c.published ? "Publicado" : "Rascunho"}</span>
                  {` · ${lessons} ${lessons === 1 ? "aula" : "aulas"} · ${active} ${active === 1 ? "aluno" : "alunos"} com acesso`}
                  {pending > 0 && (
                    <>
                      {" · "}
                      <Link href={`/admin/cursos/${c.id}/alunos`} className="font-semibold text-navy-900 underline underline-offset-2">
                        {pending} esperando liberação
                      </Link>
                    </>
                  )}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-12 max-w-2xl rounded-card border border-line bg-sky-50 p-6">
        <h2 className="text-2xl font-bold text-navy-900">Novo curso</h2>
        <ActionForm action={createCourse} submitLabel="Criar curso" pendingLabel="Criando..." className="mt-4">
          <Field label="Nome do curso">
            <input name="title" required minLength={3} maxLength={120} className={inputClass} placeholder="Ex.: Biologia para Medicina" />
          </Field>
          <Field label="Descrição" hint="opcional">
            <textarea name="description" rows={3} maxLength={1000} className={inputClass} />
          </Field>
        </ActionForm>
        <p className="mt-3 text-sm text-ink-soft">O curso nasce como rascunho. Publique em &quot;Dados do curso&quot; quando estiver pronto.</p>
      </div>
    </Section>
  );
}
