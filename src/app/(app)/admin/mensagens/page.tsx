import { Eyebrow, Section } from "@/components/ui/Section";
import { createClient } from "@/lib/supabase/server";

type Message = { id: string; name: string; email: string; phone: string | null; message: string; created_at: string };

export default async function MensagensPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("id, name, email, phone, message, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  const messages = (data ?? []) as Message[];

  return (
    <Section>
      <Eyebrow>Painel admin</Eyebrow>
      <h1 className="text-5xl font-bold text-navy-900 sm:text-6xl">Mensagens de contato</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">Enviadas pelo formulário do site. Respondemos pelo e-mail ou telefone informado.</p>

      <ul className="mt-8 space-y-4">
        {messages.length === 0 && <li className="text-ink-soft">Nenhuma mensagem ainda.</li>}
        {messages.map((m) => (
          <li key={m.id} className="rounded-card border border-line p-5">
            <p className="font-display text-2xl font-bold text-navy-900">
              {m.name}{" "}
              <span className="text-base font-normal text-ink-soft">
                · {new Date(m.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
              </span>
            </p>
            <p className="text-sm">
              <a href={`mailto:${m.email}`} className="font-semibold text-sky-600 underline underline-offset-2">{m.email}</a>
              {m.phone && <span className="text-ink-soft"> · {m.phone}</span>}
            </p>
            <p className="mt-3 whitespace-pre-wrap">{m.message}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
