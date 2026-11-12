import Link from "next/link";
import { ActionForm, Field, inputClass } from "@/components/panel/ActionForm";
import { EnrollmentActions, statusLabel, type EnrollmentStatus } from "@/components/panel/EnrollmentActions";
import { Eyebrow, Section } from "@/components/ui/Section";
import { enrollStudent } from "@/lib/admin-actions";
import { formatDate, getEmails, pick, type One } from "@/lib/panel-data";
import { createClient } from "@/lib/supabase/server";

type Enrollment = {
  id: string;
  user_id: string;
  status: EnrollmentStatus;
  created_at: string;
  profiles: One<{ nome: string }>;
  courses: One<{ id: string; title: string }>;
  classes: One<{ name: string }>;
};

const order: EnrollmentStatus[] = ["pendente", "ativa", "cancelada"];

/** Todos os acessos, de todos os cursos, num lugar só. Os pedidos esperando ficam no topo. */
export default async function MatriculasPage() {
  const supabase = await createClient();
  const [{ data: enr }, { data: users }, { data: courses }, { data: classes }, emails] = await Promise.all([
    supabase
      .from("enrollments")
      .select("id, user_id, status, created_at, profiles(nome), courses(id, title), classes(name)")
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, nome").eq("role", "aluno").order("nome"),
    supabase.from("courses").select("id, title").order("title"),
    supabase.from("classes").select("id, name").eq("active", true).order("name"),
    getEmails(),
  ]);
  const enrollments = (enr ?? []) as unknown as Enrollment[];

  return (
    <Section className="max-w-4xl">
      <Eyebrow>Painel</Eyebrow>
      <h1 className="text-4xl font-bold text-navy-900 sm:text-5xl">Liberar acesso</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        O aluno só vê um curso depois que o acesso é liberado. Cancelar tira o acesso, mas guarda o progresso dele.
      </p>

      <div className="mt-8 rounded-card border border-line bg-sky-50 p-5">
        <h2 className="text-2xl font-bold text-navy-900">Liberar um curso para um aluno</h2>
        <ActionForm action={enrollStudent} submitLabel="Liberar acesso" pendingLabel="Liberando..." className="mt-4 grid gap-4 space-y-0 sm:grid-cols-3">
          <Field label="Aluno">
            <select name="user_id" required defaultValue="" className={inputClass}>
              <option value="" disabled>
                Escolha o aluno
              </option>
              {(users ?? []).map((u) => (
                <option key={u.id as string} value={u.id as string}>
                  {(u.nome as string) || "(sem nome)"}
                  {emails.get(u.id as string) ? ` · ${emails.get(u.id as string)}` : ""}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Curso">
            <select name="course_id" required defaultValue="" className={inputClass}>
              <option value="" disabled>
                Escolha o curso
              </option>
              {(courses ?? []).map((c) => (
                <option key={c.id as string} value={c.id as string}>
                  {c.title as string}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Turma" hint="opcional">
            <select name="class_id" defaultValue="" className={inputClass}>
              <option value="">Sem turma</option>
              {(classes ?? []).map((c) => (
                <option key={c.id as string} value={c.id as string}>
                  {c.name as string}
                </option>
              ))}
            </select>
          </Field>
        </ActionForm>
      </div>

      {enrollments.length === 0 ? (
        <p className="mt-10 text-ink-soft">Nenhum acesso liberado ainda.</p>
      ) : (
        order.map((status) => {
          const group = enrollments.filter((e) => e.status === status);
          if (group.length === 0) return null;
          return (
            <section key={status} className="mt-10" aria-labelledby={`g-${status}`}>
              <h2 id={`g-${status}`} className="text-2xl font-bold text-navy-900">
                {statusLabel[status]} <span className="font-normal text-ink-soft">({group.length})</span>
              </h2>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {group.map((e) => {
                  const course = pick(e.courses);
                  return (
                    <li key={e.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-navy-900">{pick(e.profiles)?.nome || "(sem nome)"}</p>
                        <p className="truncate text-sm text-ink-soft">
                          {course ? (
                            <Link href={`/admin/cursos/${course.id}/alunos`} className="underline underline-offset-2 hover:text-navy-900">
                              {course.title}
                            </Link>
                          ) : (
                            "Curso removido"
                          )}
                          {pick(e.classes)?.name ? ` · ${pick(e.classes)?.name}` : ""}
                          {emails.get(e.user_id) ? ` · ${emails.get(e.user_id)}` : ""}
                          {` · ${formatDate(e.created_at)}`}
                        </p>
                      </div>
                      <EnrollmentActions id={e.id} status={e.status} />
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })
      )}
    </Section>
  );
}
