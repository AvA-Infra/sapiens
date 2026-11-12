import { ActionForm, Field, inputClass } from "@/components/panel/ActionForm";
import { CourseHeader } from "@/components/panel/CourseHeader";
import { EnrollmentActions, statusLabel, type EnrollmentStatus } from "@/components/panel/EnrollmentActions";
import { Section } from "@/components/ui/Section";
import { enrollStudent } from "@/lib/admin-actions";
import { formatDate, getCourseHead, getEmails, pick, type One } from "@/lib/panel-data";
import { createClient } from "@/lib/supabase/server";

type Row = {
  id: string;
  user_id: string;
  status: EnrollmentStatus;
  created_at: string;
  profiles: One<{ nome: string }>;
  classes: One<{ name: string }>;
};

const order: EnrollmentStatus[] = ["pendente", "ativa", "cancelada"];

/** Aba "Alunos" do curso: quem tem acesso, quem espera liberação e o formulário para liberar mais alguém. */
export default async function CursoAlunosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourseHead(id);
  const supabase = await createClient();
  const [{ data: enr }, { data: students }, { data: classes }, emails] = await Promise.all([
    supabase
      .from("enrollments")
      .select("id, user_id, status, created_at, profiles(nome), classes(name)")
      .eq("course_id", course.id)
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, nome").eq("role", "aluno").order("nome"),
    supabase.from("classes").select("id, name").eq("active", true).order("name"),
    getEmails(),
  ]);

  const rows = (enr ?? []) as unknown as Row[];
  const withAccess = new Set(rows.filter((r) => r.status === "ativa").map((r) => r.user_id));
  const candidates = ((students ?? []) as { id: string; nome: string }[]).filter((s) => !withAccess.has(s.id));

  return (
    <Section className="max-w-4xl">
      <CourseHeader id={course.id} tab="alunos" />

      <div className="mt-8 rounded-card border border-line bg-sky-50 p-5">
        <h2 className="text-2xl font-bold text-navy-900">Liberar acesso a um aluno</h2>
        <p className="mt-1 text-sm text-ink-soft">
          O aluno precisa ter criado a conta no site antes. Depois de liberar, o curso aparece na hora em &quot;Meus cursos&quot;.
        </p>
        {candidates.length === 0 ? (
          <p className="mt-4 text-ink-soft">Todos os alunos cadastrados já têm acesso a este curso.</p>
        ) : (
          <ActionForm action={enrollStudent} submitLabel="Liberar acesso" pendingLabel="Liberando..." className="mt-4 grid gap-4 space-y-0 sm:grid-cols-[2fr_1fr]">
            <input type="hidden" name="course_id" value={course.id} />
            <Field label="Aluno">
              <select name="user_id" required defaultValue="" className={inputClass}>
                <option value="" disabled>
                  Escolha o aluno
                </option>
                {candidates.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome || "(sem nome)"}
                    {emails.get(s.id) ? ` · ${emails.get(s.id)}` : ""}
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
        )}
      </div>

      {rows.length === 0 ? (
        <p className="mt-10 text-ink-soft">Nenhum aluno neste curso ainda.</p>
      ) : (
        order.map((status) => {
          const group = rows.filter((r) => r.status === status);
          if (group.length === 0) return null;
          return (
            <section key={status} className="mt-10" aria-labelledby={`g-${status}`}>
              <h2 id={`g-${status}`} className="text-2xl font-bold text-navy-900">
                {statusLabel[status]} <span className="font-normal text-ink-soft">({group.length})</span>
              </h2>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {group.map((r) => (
                  <li key={r.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-navy-900">{pick(r.profiles)?.nome || "(sem nome)"}</p>
                      <p className="truncate text-sm text-ink-soft">
                        {emails.get(r.user_id) || "e-mail indisponível"}
                        {pick(r.classes)?.name ? ` · ${pick(r.classes)?.name}` : ""}
                        {` · desde ${formatDate(r.created_at)}`}
                      </p>
                    </div>
                    <EnrollmentActions id={r.id} status={r.status} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}
    </Section>
  );
}
