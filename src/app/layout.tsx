import type { Metadata, Viewport } from "next";
import { Baloo_2, Figtree } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { THEME_STORAGE_KEY } from "@/components/theme/theme";
import { site } from "@/config/site";
import "./globals.css";

// Títulos arredondados e acolhedores (Baloo 2) + texto de leitura limpo (Figtree).
const display = Baloo_2({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const body = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Preparatório em Campos dos Goytacazes`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#050f2c" },
  ],
};

/**
 * Aplica o tema salvo ANTES da primeira pintura (evita o "flash" do tema errado).
 * Padrão: claro. Só lê o localStorage; qualquer erro cai no claro.
 */
const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==="dark")document.documentElement.classList.add("dark");}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: o script acima pode adicionar a classe "dark" antes da hidratação.
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
