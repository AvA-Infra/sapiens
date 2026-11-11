import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Figtree } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { JsonLd } from "@/components/JsonLd";
import { themeScript } from "@/components/theme/theme";
import { site } from "@/config/site";
import "./globals.css";

// Títulos em Barlow Condensed: grotesca estreita, na mesma linha do "SAPIENS" da logo oficial.
// Texto de leitura em Figtree.
const display = Barlow_Condensed({
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
  applicationName: site.name,
  keywords: [
    "pré-vestibular Campos dos Goytacazes",
    "curso preparatório Medicina Campos",
    "cursinho ENEM Campos dos Goytacazes",
    "Sapiens Biomédicas",
    "curso de Biomédicas",
  ],
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    url: "/",
  },
  // Prévia grande ao compartilhar (WhatsApp, LinkedIn, X). A imagem vem de src/app/opengraph-image.jpg.
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#050f2c" },
  ],
};

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
        {/* Estatísticas de visita sem cookies e sem identificar a pessoa. Só existe no deploy da Vercel. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
