import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Host do Supabase (HTTP e WebSocket) para connect-src.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).host : "";

/**
 * Content-Security-Policy estática (sem nonce), para manter as páginas públicas pré-renderizadas.
 * Limitação conhecida: 'unsafe-inline' em script-src (o Next injeta scripts inline de hidratação).
 * Em troca, tudo o mais é restrito: origens de frame, imagem e conexão são listadas uma a uma,
 * sem 'unsafe-eval' em produção, sem plugins, sem <base> externo e sem ser embutido em outros sites.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${supabaseHost ? ` https://${supabaseHost}` : ""}`,
  "font-src 'self' data:",
  `connect-src 'self' https://challenges.cloudflare.com${supabaseHost ? ` https://${supabaseHost} wss://${supabaseHost}` : ""}${isDev ? " ws://localhost:* http://localhost:*" : ""}`,
  // Quem pode ser embutido por nós: Instagram (publicações), Google Maps, Bunny (vídeo) e Turnstile.
  "frame-src https://www.instagram.com https://www.google.com https://maps.google.com https://iframe.mediadelivery.net https://challenges.cloudflare.com",
  "media-src 'self' blob: https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Só vale em HTTPS (Vercel). preload: só envie o domínio à lista depois de testar.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  async redirects() {
    return [{ source: "/aprovados", destination: "/quem-cursa-aprova", permanent: true }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
