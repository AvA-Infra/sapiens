import type { MetadataRoute } from "next";
import { site } from "@/config/site";

const paths = ["", "/sobre", "/cursos", "/estrutura", "/quem-cursa-aprova", "/contato", "/privacidade", "/termos"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "monthly", priority: p === "" ? 1 : 0.7 }));
}
