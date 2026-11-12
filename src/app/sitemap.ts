import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getPosts } from "@/lib/blog";

// /planos fica de fora enquanto os planos forem de exemplo (a página está com noindex).
const pages = [
  { path: "", priority: 1 },
  { path: "/cursos", priority: 0.9 },
  { path: "/quem-cursa-aprova", priority: 0.9 },
  { path: "/sobre", priority: 0.7 },
  { path: "/estrutura", priority: 0.7 },
  { path: "/contato", priority: 0.7 },
  { path: "/duvidas", priority: 0.7 },
  { path: "/blog", priority: 0.7 },
  { path: "/privacidade", priority: 0.2 },
  { path: "/termos", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((p) => ({ url: `${site.url}${p.path}`, changeFrequency: "monthly" as const, priority: p.priority })),
    ...getPosts().map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: p.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
