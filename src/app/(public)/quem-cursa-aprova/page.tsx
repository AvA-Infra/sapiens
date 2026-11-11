import type { Metadata } from "next";
import { ApprovedWall } from "@/components/ApprovedWall";
import { Button } from "@/components/ui/Button";
import { PageHeader, Pending, Section } from "@/components/ui/Section";
import { approved } from "@/config/content";
import { site, whatsappLink } from "@/config/site";

export const metadata: Metadata = {
  alternates: { canonical: "/quem-cursa-aprova" },
  title: "Quem cursa, aprova",
  description: "Aprovações de alunos da Sapiens em Medicina e em outros cursos, com as publicações originais do Instagram.",
};

export default function QuemCursaAprovaPage() {
  const medicine = approved.filter((a) => a.course === "Medicina").length;
  const universities = new Set(approved.map((a) => a.university)).size;

  return (
    <>
      <PageHeader
        eyebrow="Aprovados"
        title="Quem cursa, aprova."
        intro="Cada aprovação abaixo foi publicada no Instagram da Sapiens. Filtre por área, ano, curso e instituição, e abra a publicação original em cada cartão."
      />

      <Section tone="soft" className="!py-10 sm:!py-12">
        <dl className="grid grid-cols-3 gap-6">
          <div>
            <dd className="font-display text-5xl font-bold text-navy-900 sm:text-6xl">{approved.length}</dd>
            <dt className="text-sm text-ink-soft">aprovações publicadas</dt>
          </div>
          <div>
            <dd className="font-display text-5xl font-bold text-navy-900 sm:text-6xl">{medicine}</dd>
            <dt className="text-sm text-ink-soft">em Medicina</dt>
          </div>
          <div>
            <dd className="font-display text-5xl font-bold text-navy-900 sm:text-6xl">{universities}</dd>
            <dt className="text-sm text-ink-soft">instituições</dt>
          </div>
        </dl>
      </Section>

      <Section>
        {approved.length === 0 ? (
          <Pending>Nenhuma aprovação cadastrada. Veja <code>src/config/approved-data.ts</code>.</Pending>
        ) : (
          <ApprovedWall items={approved} />
        )}
        <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-line pt-10">
          <p className="font-display text-4xl font-bold text-navy-900">Quer ser o próximo da lista?</p>
          <Button href={whatsappLink()}>Falar no WhatsApp</Button>
          <Button href={site.contact.instagram} variant="secondary">
            Ver mais no Instagram
          </Button>
        </div>
      </Section>
    </>
  );
}
