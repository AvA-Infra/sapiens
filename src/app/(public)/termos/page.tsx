import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  alternates: { canonical: "/termos" }, title: "Termos de uso" };

export default function TermosPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Termos de uso" />
      <Section>
        <div className="max-w-2xl space-y-5 text-lg">
          <p className="rounded-card border border-dashed border-sky-500/60 bg-sky-50 p-4 text-base">
            <strong className="text-sky-600">[PREENCHER]</strong> Rascunho técnico. Revise com a escola e um advogado antes de publicar.
          </p>
          <h2 className="text-2xl font-bold text-navy-900">Uso da plataforma</h2>
          <p>O acesso às aulas é pessoal e intransferível. Não é permitido compartilhar login, copiar ou redistribuir vídeos e materiais.</p>
          <h2 className="text-2xl font-bold text-navy-900">Conteúdo</h2>
          <p>Aulas e materiais pertencem à Sapiens Biomédicas e seus professores. Resultados individuais variam e não são garantidos.</p>
          <h2 className="text-2xl font-bold text-navy-900">Matrículas e pagamentos</h2>
          <p>Condições, valores e cancelamento são combinados diretamente com a escola no momento da matrícula.</p>
        </div>
      </Section>
    </>
  );
}
