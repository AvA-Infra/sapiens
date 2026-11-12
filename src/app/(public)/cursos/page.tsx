import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PageHeader, Section } from "@/components/ui/Section";
import { classes } from "@/config/content";
import { whatsappLink } from "@/config/site";

export const metadata: Metadata = {
  alternates: { canonical: "/cursos" },
  title: "Cursos e turmas",
  description: "Turmas e planos da Sapiens Biomédicas para Medicina, saúde e ENEM em Campos dos Goytacazes.",
};

export default function CursosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Cursos"
        title="Escolha a turma que cabe na sua rotina."
        intro="Ainda não há matrícula online. Fale com a gente pelo WhatsApp e garanta sua vaga."
      />
      <Section>
        <ul className="grid gap-6 md:grid-cols-2">
          {classes.map((c) => (
            <li key={c.id} className="flex flex-col rounded-card border border-line bg-surface p-7 sm:p-9">
              <h2 className="text-4xl font-bold text-navy-900">{c.name}</h2>
              <dl className="mt-6 divide-y divide-line border-y border-line">
                <div className="grid gap-1 py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-4">
                  <dt className="font-semibold text-sky-600">Para quem</dt>
                  <dd>{c.target}</dd>
                </div>
                <div className="grid gap-1 py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-4">
                  <dt className="font-semibold text-sky-600">Dias e horários</dt>
                  <dd>{c.schedule}</dd>
                </div>
                <div className="grid gap-1 py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-4">
                  <dt className="font-semibold text-sky-600">Investimento</dt>
                  <dd>{c.price}</dd>
                </div>
              </dl>
              <Button
                href={whatsappLink(`Olá! Quero me matricular na turma "${c.name}".`)}
                className="mt-8 self-start"
              >
                Quero me matricular
              </Button>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-ink-soft">
          Edite as turmas em <code>src/config/content.ts</code> (lista <code>classes</code>).
        </p>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          <Link href="/#agendar-visita" className="group border-l-2 border-sky-400 pl-6">
            <h2 className="text-3xl font-bold text-navy-900">Prefere conhecer antes?</h2>
            <p className="mt-2 text-ink-soft">Escolha um dia e um período para visitar a unidade.</p>
            <span className="mt-3 inline-block font-semibold text-sky-600 underline decoration-sky-400 decoration-2 underline-offset-4 group-hover:text-navy-900">
              Agendar visita
            </span>
          </Link>
          <Link href="/duvidas" className="group border-l-2 border-sky-400 pl-6">
            <h2 className="text-3xl font-bold text-navy-900">Ainda com dúvidas?</h2>
            <p className="mt-2 text-ink-soft">Matrícula, provas, aulas online e outras perguntas comuns.</p>
            <span className="mt-3 inline-block font-semibold text-sky-600 underline decoration-sky-400 decoration-2 underline-offset-4 group-hover:text-navy-900">
              Ver dúvidas frequentes
            </span>
          </Link>
        </div>
      </Section>
    </>
  );
}
