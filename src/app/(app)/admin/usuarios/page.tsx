import { ActionForm, inputClass } from "@/components/panel/ActionForm";
import { Eyebrow, Section } from "@/components/ui/Section";
import { getCurrentUser, isStaff, type Role } from "@/lib/auth";
import { setUserRole } from "@/lib/admin-actions";
import { formatDate, getEmails } from "@/lib/panel-data";
import { createClient } from "@/lib/supabase/server";

type Profile = { id: string; nome: string; role: Role; created_at: string };

/** Pessoas cadastradas. Todo professor é administrador: aqui se decide quem é aluno e quem é professor. */
export default async function UsuariosPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const [me, supabase, emails] = await Promise.all([getCurrentUser(), createClient(), getEmails()]);
  const { data } = await supabase.from("profiles").select("id, nome, role, created_at").order("nome");

  const term = q.trim().toLowerCase();
  const all = ((data ?? []) as Profile[]).filter(
    (p) => !term || p.nome.toLowerCase().includes(term) || (emails.get(p.id) ?? "").toLowerCase().includes(term),
  );
  const teachers = all.filter((p) => isStaff(p.role));
  const students = all.filter((p) => !isStaff(p.role));

  const Row = ({ p }: { p: Profile }) => (
    <li className="flex flex-wrap items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="font-semibold text-navy-900">
          {p.nome || "(sem nome)"} {p.id === me?.id && <span className="text-sm font-normal text-ink-soft">(você)</span>}
        </p>
        <p className="truncate text-sm text-ink-soft">
          {emails.get(p.id) || "e-mail indisponível"} · cadastro em {formatDate(p.created_at)}
        </p>
      </div>
      <ActionForm action={setUserRole} submitLabel="Salvar" variant="quiet" className="flex flex-wrap items-center gap-3 space-y-0">
        <input type="hidden" name="user_id" value={p.id} />
        <select
          name="role"
          defaultValue={isStaff(p.role) ? "admin" : "aluno"}
          aria-label={`Papel de ${p.nome || "usuário"}`}
          className={`${inputClass} mt-0 w-auto`}
        >
          <option value="aluno">Aluno</option>
          <option value="admin">Professor</option>
        </select>
      </ActionForm>
    </li>
  );

  return (
    <Section className="max-w-4xl">
      <Eyebrow>Painel</Eyebrow>
      <h1 className="text-4xl font-bold text-navy-900 sm:text-5xl">Alunos e professores</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Quem cria conta no site entra como aluno. Para tornar alguém professor, escolha &quot;Professor&quot; e salve: todo professor
        tem acesso completo ao painel e a todos os cursos.
      </p>

      <form className="mt-8 flex max-w-xl gap-3" role="search">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nome ou e-mail"
          aria-label="Buscar por nome ou e-mail"
          className={`${inputClass} mt-0`}
        />
        <button type="submit" className="min-h-11 rounded-[10px] bg-navy-900 px-5 font-semibold text-paper hover:bg-navy-700">
          Buscar
        </button>
      </form>

      <section aria-labelledby="professores" className="mt-10">
        <h2 id="professores" className="text-2xl font-bold text-navy-900">
          Professores <span className="font-normal text-ink-soft">({teachers.length})</span>
        </h2>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {teachers.length === 0 && <li className="py-4 text-ink-soft">Ninguém encontrado.</li>}
          {teachers.map((p) => (
            <Row key={p.id} p={p} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="alunos" className="mt-10">
        <h2 id="alunos" className="text-2xl font-bold text-navy-900">
          Alunos <span className="font-normal text-ink-soft">({students.length})</span>
        </h2>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {students.length === 0 && <li className="py-4 text-ink-soft">Ninguém encontrado.</li>}
          {students.map((p) => (
            <Row key={p.id} p={p} />
          ))}
        </ul>
      </section>
    </Section>
  );
}
