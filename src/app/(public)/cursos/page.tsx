import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { PageHeader, Section } from "@/components/ui/Section";
import { classes } from "@/config/content";
import { whatsappLink } from "@/config/site";

export const metadata: Metadata = {
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
            <li key={c.id} className="flex flex-col rounded-card border border-line p-7">
              <h2 className="text-2xl font-bold text-navy-900">{c.name}</h2>
              <dl className="mt-5 space-y-3">
                <div>
                  <dt className="text-sm font-semibold uppercase tracking-wide text-sky-600">Para quem</dt>
                  <dd>{c.target}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold uppercase tracking-wide text-sky-600">Dias e horários</dt>
                  <dd>{c.schedule}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold uppercase tracking-wide text-sky-600">Investimento</dt>
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
      </Section>
    </>
  );
}
