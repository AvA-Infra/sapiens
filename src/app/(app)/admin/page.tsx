import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow, Section } from "@/components/ui/Section";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const count = async (table: string) => {
    const { count: c } = await supabase.from(table).select("*", { count: "exact", head: true });
    return c ?? 0;
  };

  const [users, courses, enrollments, messages] = await Promise.all([
    count("profiles"),
    count("courses"),
    count("enrollments"),
    count("contact_messages"),
  ]);

  const cards = [
    { href: "/admin/usuarios", label: "Usuários", value: users, text: "Papéis: aluno, professor e admin" },
    { href: "/admin/matriculas", label: "Matrículas", value: enrollments, text: "Liberar e cancelar acesso aos cursos" },
    { href: "/admin/turmas", label: "Turmas", value: null, text: "Criar e ativar turmas" },
    { href: "/admin/mensagens", label: "Mensagens de contato", value: messages, text: "Enviadas pelo formulário do site" },
    { href: "/professor", label: "Cursos", value: courses, text: "Módulos, aulas e materiais" },
  ];

  return (
    <Section>
      <Eyebrow>Painel admin</Eyebrow>
      <h1 className="text-5xl font-bold text-navy-900 sm:text-6xl">Visão geral</h1>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <li key={c.href}>
            <Link href={c.href} className="flex h-full flex-col justify-between rounded-card border border-line p-6 transition-colors hover:border-navy-900 hover:bg-sky-50">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">{c.label}</p>
                {c.value !== null && <p className="mt-2 font-display text-6xl font-bold text-navy-900">{c.value}</p>}
                <p className="mt-2 text-ink-soft">{c.text}</p>
              </div>
              <span className="mt-5 inline-flex items-center gap-2 font-semibold text-navy-900">
                Abrir <ArrowRight className="size-4" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
