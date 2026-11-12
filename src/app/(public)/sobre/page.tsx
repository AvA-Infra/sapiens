import type { Metadata } from "next";
import { Pending, PageHeader, Section, Eyebrow } from "@/components/ui/Section";
import { TeacherCard } from "@/components/ui/TeacherCard";
import { teachers } from "@/config/content";

export const metadata: Metadata = {
  alternates: { canonical: "/sobre" },
  title: "Sobre e equipe",
  description: "A história da Sapiens Biomédicas, nossos valores e os professores que dão aula no Centro de Campos.",
};

export default function SobrePage() {
  return (
    <>
      <PageHeader
        eyebrow="Sobre"
        title="Um curso feito por empreendedoras, para quem quer entrar na área da saúde."
      />

      <Section labelledBy="historia">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <Eyebrow>História</Eyebrow>
            <h2 id="historia" className="text-4xl font-bold text-navy-900 sm:text-5xl">
              Do presencial ao digital
            </h2>
          </div>
          <div className="space-y-5 text-lg">
            <p>
              A Sapiens nasceu como curso de Biomédicas presencial no Centro de Campos dos Goytacazes, dentro do
              Shopping Avenida 28. Agora ganha uma plataforma digital para que o aluno estude também fora da sala.
            </p>
            <Pending>
              Conte a história real da escola: quando começou, quem fundou, o que motivou. Edite em{" "}
              <code>src/app/(public)/sobre/page.tsx</code>.
            </Pending>
          </div>
        </div>
      </Section>

      <Section tone="soft" labelledBy="missao">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 id="missao" className="text-4xl font-bold text-navy-900">Missão</h2>
            <div className="mt-3">
              <Pending>Texto da missão, nas palavras da escola.</Pending>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-navy-900">Valores</h2>
            <p className="mt-3 text-lg">
              Somos uma empresa de empreendedoras e todo estudante é bem-vindo aqui, incluindo a comunidade LGBTQ+.
              Estudar para o vestibular já pesa o bastante; o ambiente não precisa pesar junto.
            </p>
          </div>
        </div>
      </Section>

      <Section labelledBy="equipe">
        <Eyebrow>Equipe</Eyebrow>
        <h2 id="equipe" className="text-4xl font-bold text-navy-900 sm:text-5xl">Professores</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {teachers.map((t) => (
            <TeacherCard key={t.id} teacher={t} />
          ))}
        </div>
        <p className="mt-10 text-sm text-ink-soft">
          Edite nomes, matérias, bios e fotos em <code>src/config/content.ts</code>. Fotos ficam em <code>public/equipe</code>.
        </p>
      </Section>
    </>
  );
}
