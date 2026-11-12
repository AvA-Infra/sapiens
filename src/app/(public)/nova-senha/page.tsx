import type { Metadata } from "next";
import { NewPasswordForm } from "@/components/AuthForm";
import { PageHeader, Section } from "@/components/ui/Section";

export const metadata: Metadata = { title: "Nova senha", robots: { index: false } };

/** Aberta pelo link do e-mail de "Esqueci minha senha". A sessão é conferida na hora de salvar. */
export default function NovaSenhaPage() {
  return (
    <>
      <PageHeader eyebrow="Área do aluno" title="Crie uma senha nova" />
      <Section>
        <div className="mx-auto max-w-md">
          <NewPasswordForm />
        </div>
      </Section>
    </>
  );
}
