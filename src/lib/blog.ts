import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

/**
 * Blog em arquivos: cada artigo é um .md em content/blog, com um cabeçalho entre linhas "---".
 * Para publicar, basta criar um arquivo novo e dar push (veja content/blog/LEIA-ME.md).
 * Os arquivos são lidos no build; não há banco de dados nem painel.
 */

const dir = path.join(process.cwd(), "content", "blog");

export type Post = {
  slug: string;
  title: string;
  description: string;
  /** Data de publicação, AAAA-MM-DD. */
  date: string;
  /** Rótulo curto do assunto (ex.: "ENEM"). */
  topic: string;
  minutes: number;
  html: string;
};

function parse(file: string): Post | null {
  const raw = fs.readFileSync(path.join(dir, file), "utf8").replace(/\r\n/g, "\n");
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  if (!m) return null;

  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, "$1");
  }
  // Rascunho (rascunho: sim) ou cabeçalho incompleto: não publica.
  if (!meta.titulo || !meta.resumo || !/^\d{4}-\d{2}-\d{2}$/.test(meta.data ?? "") || meta.rascunho === "sim") return null;

  const body = m[2].trim();
  return {
    slug: file.replace(/\.md$/, ""),
    title: meta.titulo,
    description: meta.resumo,
    date: meta.data,
    topic: meta.assunto ?? "Vestibular",
    minutes: Math.max(1, Math.round(body.split(/\s+/).length / 200)),
    // Conteúdo escrito por nós, no repositório: é confiável, por isso vira HTML direto.
    html: marked.parse(body, { async: false }),
  };
}

let cache: Post[] | null = null;

/** Artigos publicados, do mais novo para o mais antigo. */
export function getPosts(): Post[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md") && f !== "LEIA-ME.md") : [];
  cache = files
    .map(parse)
    .filter((p): p is Post => p !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
  return cache;
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

/** "2026-11-11" -> "11 de novembro de 2026" (sem Date, para não depender de fuso). */
export function formatDate(date: string) {
  const [y, mo, d] = date.split("-").map(Number);
  return `${d} de ${months[mo - 1]} de ${y}`;
}
