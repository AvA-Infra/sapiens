import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetRequestForm } from "@/components/AuthForm";
import { PageHeader, Section } from "@/components/ui/Section";

export const metadata: Metadata = { title: "Esqueci minha senha", robots: { index: false } };

// ?erro=link chega quando o link do e-mail expirou. searchParams é dado de requisição: fica no Suspense.
async function Form({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  return <ResetRequestForm linkError={erro === "link"} />;
}

export default function EsqueciSenhaPage({ searchParams }: PageProps<"/esqueci-senha">) {
  return (
    <>
      <PageHeader eyebrow="Área do aluno" title="Esqueci minha senha" />
      <Section>
        <div className="mx-auto max-w-md">
          <Suspense fallback={<p className="text-ink-soft">Carregando...</p>}>
            <Form searchParams={searchParams as Promise<{ erro?: string }>} />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
