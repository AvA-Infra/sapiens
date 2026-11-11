import { ActionForm, inputClass } from "@/components/panel/ActionForm";
import { Eyebrow, Section } from "@/components/ui/Section";
import { getCurrentUser } from "@/lib/auth";
import { setUserRole } from "@/lib/admin-actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type Profile = { id: string; nome: string; role: "aluno" | "professor" | "admin"; created_at: string };

export default async function UsuariosPage() {
  const [me, supabase] = await Promise.all([getCurrentUser(), createClient()]);
  const { data } = await supabase.from("profiles").select("id, nome, role, created_at").order("created_at", { ascending: false });
  const profiles = (data ?? []) as Profile[];

  // E-mails ficam em auth.users, que o RLS não expõe: leitura pelo servidor, só aqui no painel admin.
  const emails = new Map<string, string>();
  try {
    const { data: list } = await createAdminClient().auth.admin.listUsers({ perPage: 200 });
    list?.users.forEach((u) => emails.set(u.id, u.email ?? ""));
  } catch {
    // Sem service_role configurada, a tabela mostra só os nomes.
  }

  return (
    <Section>
      <Eyebrow>Painel admin</Eyebrow>
      <h1 className="text-5xl font-bold text-navy-900 sm:text-6xl">Usuários</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Quem se cadastra no site entra como aluno. Mude o papel para dar acesso ao painel do professor ou ao admin.
      </p>

      <div className="mt-8 overflow-x-auto rounded-card border border-line">
        <table className="w-full min-w-[640px] text-left">
          <thead className="bg-sky-50 text-sm uppercase tracking-wide text-ink-soft">
            <tr>
              <th scope="col" className="p-4">Nome</th>
              <th scope="col" className="p-4">E-mail</th>
              <th scope="col" className="p-4">Papel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {profiles.map((p) => (
              <tr key={p.id}>
                <td className="p-4 font-semibold text-navy-900">
                  {p.nome || "(sem nome)"} {p.id === me?.id && <span className="text-sm font-normal text-ink-soft">(você)</span>}
                </td>
                <td className="p-4 text-ink-soft">{emails.get(p.id) || "—"}</td>
                <td className="p-4">
                  <ActionForm action={setUserRole} submitLabel="Salvar" variant="quiet" className="flex flex-wrap items-center gap-3 space-y-0">
                    <input type="hidden" name="user_id" value={p.id} />
                    <select name="role" defaultValue={p.role} aria-label={`Papel de ${p.nome || "usuário"}`} className={`${inputClass} mt-0 w-auto`}>
                      <option value="aluno">Aluno</option>
                      <option value="professor">Professor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </ActionForm>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
