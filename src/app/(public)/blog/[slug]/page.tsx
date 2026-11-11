import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/Button";
import { whatsappLink } from "@/config/site";
import { formatDate, getPost, getPosts } from "@/lib/blog";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.description, publishedTime: post.date },
  };
}

/**
 * O endereço (slug) é lido dentro do <Suspense>: assim a moldura da página é a mesma para todos os
 * artigos e a navegação a partir do blog é instantânea, com o texto entrando logo em seguida.
 */
export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6" aria-busy="true">
          <div className="h-5 w-32 rounded-full bg-sky-100" />
          <div className="mt-8 h-14 w-full rounded-xl bg-sky-100" />
          <div className="mt-3 h-14 w-2/3 rounded-xl bg-sky-100" />
          <div className="mt-8 h-5 w-full rounded-full bg-sky-50" />
          <div className="mt-3 h-5 w-5/6 rounded-full bg-sky-50" />
        </div>
      }
    >
      <PostContent params={params} />
    </Suspense>
  );
}

async function PostContent({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = getPosts().filter((p) => p.slug !== post.slug).slice(0, 2);
  const path = `/blog/${post.slug}`;

  return (
    <article>
      <ArticleJsonLd title={post.title} description={post.description} path={path} date={post.date} />
      <BreadcrumbJsonLd items={[{ name: "Blog", path: "/blog" }, { name: post.title, path }]} />

      {/* Barra de progresso de leitura: animação ligada à rolagem, em CSS puro */}
      <div aria-hidden className="read-progress fixed inset-x-0 top-0 z-[55] h-1 bg-sky-400" />

      <header className="border-b border-line">
        <div className="mx-auto max-w-3xl px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-12">
          <Link href="/blog" className="group inline-flex min-h-11 items-center gap-2 font-semibold text-sky-600 hover:text-navy-900">
            <ArrowLeft className="size-4" aria-hidden /> Todos os artigos
          </Link>
          <p className="mt-6 text-sm font-semibold text-sky-600">{post.topic}</p>
          <h1 className="mt-2 text-5xl font-bold text-navy-900 sm:text-6xl lg:text-7xl">{post.title}</h1>
          <p className="mt-5 text-xl text-ink-soft">{post.description}</p>
          <p className="mt-6 text-sm text-ink-soft">
            Equipe Sapiens, <time dateTime={post.date}>{formatDate(post.date)}</time>. Leitura de {post.minutes} min.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

        <aside className="mt-14 rounded-card border border-line bg-sky-50 p-7 sm:p-9">
          <p className="font-display text-4xl font-bold text-navy-900">Quer estudar com a gente?</p>
          <p className="mt-2 max-w-md text-ink-soft">
            A Sapiens fica no Shopping Avenida 28, no Centro de Campos. Chame no WhatsApp e a gente explica as turmas.
          </p>
          <Button href={whatsappLink(`Olá! Li o artigo "${post.title}" no site da Sapiens e quero saber mais sobre o curso.`)} className="mt-6">
            <MessageCircle className="size-5" aria-hidden /> Falar no WhatsApp
          </Button>
        </aside>

        {others.length > 0 && (
          <nav aria-label="Outros artigos" className="mt-14">
            <h2 className="text-3xl font-bold text-navy-900">Continue lendo</h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="group block py-5">
                    <p className="font-display text-2xl font-semibold text-navy-900 group-hover:text-sky-600">{p.title}</p>
                    <p className="mt-1 text-ink-soft">{p.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </article>
  );
}
