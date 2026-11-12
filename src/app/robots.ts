import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Endereço provisório (sem domínio definitivo): bloqueia tudo para não aparecer no Google.
  if (!site.indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/aluno/", "/professor/", "/admin/", "/auth/", "/nova-senha", "/design-system"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
