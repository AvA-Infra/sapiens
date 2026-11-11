import { ActionForm, Field, inputClass } from "@/components/panel/ActionForm";
import { Eyebrow, Section } from "@/components/ui/Section";
import { enrollStudent, setEnrollmentStatus } from "@/lib/admin-actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type One<T> = T | T[] | null;
type Enrollment = {
  id: string;
  status: "ativa" | "pendente" | "cancelada";
  profiles: One<{ nome: string }>;
  courses: One<{ title: string }>;
  classes: One<{ name: string }>;
};
const pick = <T,>(v: One<T>) => (Array.isArray(v) ? v[0] : v) ?? undefined;

export default async function MatriculasPage() {
  const supabase = await createClient();
  const [{ data: enr }, { data: users }, { data: courses }, { data: classes }] = await Promise.all([
    supabase
      .from("enrollments")
      .select("id, status, profiles(nome), courses(title), classes(name)")
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, nome, role").order("nome"),
    supabase.from("courses").select("id, title").order("title"),
    supabase.from("classes").select("id, name").eq("active", true).order("name"),
  ]);

  const emails = new Map<string, string>();
  try {
    const { data: list } = await createAdminClient().auth.admin.listUsers({ perPage: 200 });
    list?.users.forEach((u) => emails.set(u.id, u.email ?? ""));
  } catch {
    // Sem e-mails, o seletor mostra só o nome.
  }

  const enrollments = (enr ?? []) as unknown as Enrollment[];

  return (
    <Section>
      <Eyebrow>Painel admin</Eyebrow>
      <h1 className="text-5xl font-bold text-navy-900 sm:text-6xl">Matrículas</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        O aluno só vê o curso depois de uma matrícula ativa. Cancelar a matrícula tira o acesso, mas guarda o progresso.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <ul className="space-y-3">
          {enrollments.length === 0 && <li className="text-ink-soft">Nenhuma matrícula ainda.</li>}
          {enrollments.map((e) => (
            <li key={e.id} className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-line p-4">
              <div>
                <p className="font-semibold text-navy-900">{pick(e.profiles)?.nome || "(sem nome)"}</p>
                <p className="text-sm text-ink-soft">
                  {pick(e.courses)?.title ?? "Curso removido"}
                  {pick(e.classes)?.name ? ` · ${pick(e.classes)?.name}` : ""}
                </p>
              </div>
              <ActionForm action={setEnrollmentStatus} submitLabel="Salvar" variant="quiet" className="flex flex-wrap items-center gap-3 space-y-0">
                <input type="hidden" name="id" value={e.id} />
                <select name="status" defaultValue={e.status} aria-label="Situação da matrícula" className={`${inputClass} mt-0 w-auto`}>
                  <option value="ativa">Ativa</option>
                  <option value="pendente">Pendente</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </ActionForm>
            </li>
          ))}
        </ul>

        <div className="rounded-card bg-sky-50 p-6">
          <h2 className="text-3xl font-bold text-navy-900">Liberar acesso</h2>
          <ActionForm action={enrollStudent} submitLabel="Liberar" pendingLabel="Liberando..." className="mt-4">
            <Field label="Aluno">
              <select name="user_id" required defaultValue="" className={inputClass}>
                <option value="" disabled>Escolha o aluno</option>
                {(users ?? []).map((u) => (
                  <option key={u.id as string} value={u.id as string}>
                    {(u.nome as string) || "(sem nome)"} {emails.get(u.id as string) ? `· ${emails.get(u.id as string)}` : ""}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Curso">
              <select name="course_id" required defaultValue="" className={inputClass}>
                <option value="" disabled>Escolha o curso</option>
                {(courses ?? []).map((c) => (
                  <option key={c.id as string} value={c.id as string}>{c.title as string}</option>
                ))}
              </select>
            </Field>
            <Field label="Turma" hint="opcional">
              <select name="class_id" defaultValue="" className={inputClass}>
                <option value="">Sem turma</option>
                {(classes ?? []).map((c) => (
                  <option key={c.id as string} value={c.id as string}>{c.name as string}</option>
                ))}
              </select>
            </Field>
          </ActionForm>
        </div>
      </div>
    </Section>
  );
}
