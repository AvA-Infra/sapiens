import Link from "next/link";
import { EnrollmentActions } from "@/components/panel/EnrollmentActions";
import { Eyebrow, Section } from "@/components/ui/Section";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, getEmails, pick, type One } from "@/lib/panel-data";
import { createClient } from "@/lib/supabase/server";

type Pending = {
  id: string;
  user_id: string;
  created_at: string;
  profiles: One<{ nome: string }>;
  courses: One<{ id: string; title: string }>;
};

/** Primeira tela do painel: o que precisa de ação agora (pedidos esperando liberação) e um resumo em frase. */
export default async function AdminPage() {
  const supabase = await createClient();
  const count = async (table: string, filter?: [string, string]) => {
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    const { count: c } = await q;
    return c ?? 0;
  };

  const [me, students, teachers, courses, active, messages, { data: pend }, emails] = await Promise.all([
    getCurrentUser(),
    count("profiles", ["role", "aluno"]),
    count("profiles", ["role", "admin"]),
    count("courses"),
    count("enrollments", ["status", "ativa"]),
    count("contact_messages"),
    supabase
      .from("enrollments")
      .select("id, user_id, created_at, profiles(nome), courses(id, title)")
      .eq("status", "pendente")
      .order("created_at"),
    getEmails(),
  ]);
  const pending = (pend ?? []) as unknown as Pending[];
  const firstName = me?.nome.split(" ")[0];

  return (
    <Section className="max-w-4xl">
      <Eyebrow>Painel</Eyebrow>
      <h1 className="text-4xl font-bold text-navy-900 sm:text-5xl">{firstName ? `Olá, ${firstName}` : "Visão geral"}</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">
        {students} {students === 1 ? "aluno cadastrado" : "alunos cadastrados"}, {active}{" "}
        {active === 1 ? "acesso liberado" : "acessos liberados"} em {courses} {courses === 1 ? "curso" : "cursos"} e {teachers}{" "}
        {teachers === 1 ? "professor" : "professores"} na equipe.{" "}
        {messages > 0 && (
          <Link href="/admin/mensagens" className="text-navy-900 underline underline-offset-2">
            {messages} {messages === 1 ? "mensagem" : "mensagens"} de contato
          </Link>
        )}
      </p>

      <section aria-labelledby="esperando" className="mt-12">
        <h2 id="esperando" className="text-2xl font-bold text-navy-900">
          Esperando liberação {pending.length > 0 && <span className="font-normal text-ink-soft">({pending.length})</span>}
        </h2>
        {pending.length === 0 ? (
          <p className="mt-3 text-ink-soft">
            Nenhum pedido esperando. Para dar acesso a alguém, abra o curso na barra lateral e vá em &quot;Alunos&quot;.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {pending.map((p) => {
              const course = pick(p.courses);
              return (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-navy-900">{pick(p.profiles)?.nome || "(sem nome)"}</p>
                    <p className="truncate text-sm text-ink-soft">
                      {course ? (
                        <Link href={`/admin/cursos/${course.id}/alunos`} className="underline underline-offset-2 hover:text-navy-900">
                          {course.title}
                        </Link>
                      ) : (
                        "Curso removido"
                      )}
                      {emails.get(p.user_id) ? ` · ${emails.get(p.user_id)}` : ""}
                      {` · pedido em ${formatDate(p.created_at)}`}
                    </p>
                  </div>
                  <EnrollmentActions id={p.id} status="pendente" />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </Section>
  );
}
