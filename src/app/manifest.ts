import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/** Permite "Adicionar à tela inicial" no celular, com nome e cores da marca. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    lang: "pt-BR",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#001650",
    icons: [{ src: "/icon.png", sizes: "any", type: "image/png" }],
  };
}
