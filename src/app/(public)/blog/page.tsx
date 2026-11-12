import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { PageHeader, Pending, Section } from "@/components/ui/Section";
import { formatDate, getPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artigos da Sapiens sobre ENEM, redação e preparação para Medicina: como a prova funciona e como organizar os estudos.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getPosts();
  const [first, ...rest] = posts;

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Blog", path: "/blog" }]} />
      <PageHeader
        eyebrow="Blog"
        title="Para estudar sabendo como a prova funciona."
        intro="Guias diretos sobre ENEM, redação e a rotina de quem quer Medicina."
      />
      <Section>
        {!first ? (
          <Pending>
            Nenhum artigo publicado. Crie um arquivo <code>.md</code> em <code>content/blog</code> (veja o LEIA-ME da pasta).
          </Pending>
        ) : (
          <>
            <Link
              href={`/blog/${first.slug}`}
              className="group grid gap-6 border-t-2 border-navy-900 py-8 lg:grid-cols-[1.4fr_1fr] lg:items-end"
            >
              <div>
                <p className="text-sm font-semibold text-sky-600">
                  {first.topic}, {formatDate(first.date)}
                </p>
                <h2 className="mt-3 text-4xl font-bold text-navy-900 group-hover:text-sky-600 sm:text-6xl">{first.title}</h2>
              </div>
              <div>
                <p className="text-lg text-ink-soft">{first.description}</p>
                <span className="mt-4 inline-block text-sm text-ink-soft">Leitura de {first.minutes} min</span>
              </div>
            </Link>

            {rest.length > 0 && (
              <ul className="grid gap-x-12 md:grid-cols-2">
                {rest.map((p) => (
                  <li key={p.slug} className="border-t border-line">
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group flex h-full flex-col py-8"
                    >
                      <p className="text-sm font-semibold text-sky-600">
                        {p.topic}, {formatDate(p.date)}
                      </p>
                      <h2 className="mt-3 text-3xl font-bold text-navy-900 group-hover:text-sky-600 sm:text-4xl">{p.title}</h2>
                      <p className="mt-3 text-ink-soft">{p.description}</p>
                      <span className="mt-auto pt-4 text-sm text-ink-soft">Leitura de {p.minutes} min</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </Section>
    </>
  );
}
