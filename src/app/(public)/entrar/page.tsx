import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/AuthForm";
import { PageHeader, Pending, Section } from "@/components/ui/Section";
import { safeNext } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Entrar", robots: { index: false } };

// searchParams é dado de requisição: lido dentro de um Suspense (Cache Components).
async function Form({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <LoginForm next={safeNext(next)} />;
}

export default function EntrarPage({ searchParams }: PageProps<"/entrar">) {
  return (
    <>
      <PageHeader eyebrow="Área do aluno" title="Entrar" />
      <Section>
        <div className="mx-auto max-w-md">
          {!isSupabaseConfigured && (
            <div className="mb-6">
              <Pending>
                Login desativado: faltam <code>NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
                <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> no <code>.env.local</code>.
              </Pending>
            </div>
          )}
          <Suspense fallback={<p className="text-ink-soft">Carregando...</p>}>
            <Form searchParams={searchParams as Promise<{ next?: string }>} />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
