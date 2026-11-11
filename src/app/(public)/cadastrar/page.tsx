import type { Metadata } from "next";
import { SignupForm } from "@/components/AuthForm";
import { PageHeader, Pending, Section } from "@/components/ui/Section";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Criar conta", robots: { index: false } };

export default function CadastrarPage() {
  return (
    <>
      <PageHeader
        eyebrow="Área do aluno"
        title="Criar conta"
        intro="O acesso às aulas é liberado pela escola depois da matrícula."
      />
      <Section>
        <div className="mx-auto max-w-md">
          {!isSupabaseConfigured && (
            <div className="mb-6">
              <Pending>
                Cadastro desativado até o Supabase ser configurado no <code>.env.local</code>.
              </Pending>
            </div>
          )}
          <SignupForm />
        </div>
      </Section>
    </>
  );
}
