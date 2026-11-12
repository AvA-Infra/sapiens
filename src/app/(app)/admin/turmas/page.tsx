import { ActionForm, Field, inputClass } from "@/components/panel/ActionForm";
import { Eyebrow, Section } from "@/components/ui/Section";
import { createClass, toggleClass } from "@/lib/admin-actions";
import { createClient } from "@/lib/supabase/server";

type Klass = { id: string; name: string; description: string | null; active: boolean };

export default async function TurmasPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("classes").select("id, name, description, active").order("created_at", { ascending: false });
  const classes = (data ?? []) as Klass[];

  return (
    <Section>
      <Eyebrow>Painel</Eyebrow>
      <h1 className="text-4xl font-bold text-navy-900 sm:text-5xl">Turmas</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <ul className="space-y-4">
          {classes.length === 0 && <li className="text-ink-soft">Nenhuma turma ainda.</li>}
          {classes.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-line p-5">
              <div>
                <p className="font-display text-3xl font-bold text-navy-900">{c.name}</p>
                {c.description && <p className="text-ink-soft">{c.description}</p>}
                <p className={`text-sm font-semibold ${c.active ? "text-sky-600" : "text-ink-soft"}`}>{c.active ? "Ativa" : "Inativa"}</p>
              </div>
              <ActionForm action={toggleClass} submitLabel={c.active ? "Desativar" : "Ativar"} variant="quiet" className="space-y-0">
                <input type="hidden" name="id" value={c.id} />
                <input type="hidden" name="active" value={String(c.active)} />
              </ActionForm>
            </li>
          ))}
        </ul>

        <div className="rounded-card bg-sky-50 p-6">
          <h2 className="text-3xl font-bold text-navy-900">Nova turma</h2>
          <ActionForm action={createClass} submitLabel="Criar turma" pendingLabel="Criando..." className="mt-4">
            <Field label="Nome">
              <input name="name" required maxLength={80} className={inputClass} placeholder="Ex.: Medicina 2027, manhã" />
            </Field>
            <Field label="Descrição" hint="opcional">
              <textarea name="description" rows={3} maxLength={500} className={inputClass} />
            </Field>
          </ActionForm>
        </div>
      </div>
    </Section>
  );
}
