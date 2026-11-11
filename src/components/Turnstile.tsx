"use client";

import Script from "next/script";

/**
 * Widget anti-robô do Cloudflare Turnstile (renderização implícita: o script adiciona o campo
 * `cf-turnstile-response` ao formulário). Só aparece se NEXT_PUBLIC_TURNSTILE_SITE_KEY estiver definida.
 */
export function Turnstile() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      <div className="cf-turnstile" data-sitekey={siteKey} data-language="pt-br" />
    </>
  );
}

/** Pede um novo desafio depois de um envio que falhou (o token é de uso único). */
export function resetTurnstile() {
  (window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset();
}
