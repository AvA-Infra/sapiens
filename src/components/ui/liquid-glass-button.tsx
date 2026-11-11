"use client";

import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Botão "vidro líquido", adaptado do componente original para o projeto:
 *  - Funciona como <button> ou, com `href`, como link (next/link). O `asChild`/Slot original não
 *    servia aqui: o botão tem camadas internas e o Slot só aceita um único filho.
 *  - Variantes de superfície sem depender do modo escuro do sistema:
 *      brand → vidro azul-marinho (tema claro) / ciano (tema escuro). É o botão principal.
 *      glass → vidro transparente, para fundos escuros ou imagens.
 *  - O filtro SVG (GlassFilter) é renderizado UMA vez no layout, não em cada botão (evita ids duplicados).
 *  - Estrutura com <span> (div dentro de button é HTML inválido).
 * Uso: só nos botões principais (CTA do hero e dos planos), porque o filtro de distorção é pesado.
 */
export const liquidbuttonVariants = cva(
  "relative isolate inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold text-white " +
    "outline-none transition-[transform,box-shadow] duration-300 hover:scale-105 active:scale-95 " +
    "focus-visible:ring-[3px] focus-visible:ring-sky-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-paper " +
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Só a sombra externa fica no botão; a cor do corpo vai numa camada ACIMA do filtro (veja `tint`).
        brand: "shadow-lg shadow-[#001650]/30 dark:shadow-sky-400/10",
        glass: "",
      },
      size: {
        sm: "h-11 px-5 text-[0.95rem]",
        default: "h-12 px-6 text-base",
        lg: "h-14 px-8 text-lg",
        xl: "h-16 px-10 text-lg",
      },
    },
    defaultVariants: { variant: "brand", size: "lg" },
  },
);

// Cor do corpo do botão. Fica numa camada acima do filtro de distorção, que sobre fundo branco
// puxava manchas brancas para as bordas. Azul-marinho no tema claro; vidro ciano no escuro.
const tint = {
  brand: "bg-[#001650]/95 dark:bg-sky-400/25",
  glass: "bg-white/5",
} as const;

// Realces de borda e brilho interno do vidro (claros: o corpo do botão é sempre escuro/translúcido).
const glassShadow =
  "shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]";

type Base = VariantProps<typeof liquidbuttonVariants>;
type Props = Base &
  (
    | ({ href: string } & Omit<React.ComponentProps<typeof Link>, "href">)
    | ({ href?: undefined } & React.ComponentProps<"button">)
  );

export function LiquidButton({ className, variant, size, children, ...rest }: Props) {
  const tintClass = tint[variant ?? "brand"];
  const classes = cn(liquidbuttonVariants({ variant, size }), className);
  const layers = (
    <>
      <span aria-hidden className={cn("absolute inset-0 z-0 rounded-full transition-all", tintClass, glassShadow)} />
      {/* Camada que distorce o que está atrás (Chrome/Edge); Safari/Firefox usam só o desfoque de .glass-blur */}
      <span
        aria-hidden
        className="glass-blur absolute inset-0 -z-10 overflow-hidden rounded-full"
        style={{ backdropFilter: 'url("#container-glass")' }}
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );

  if (rest.href !== undefined) {
    const { href, ...linkProps } = rest;
    const external = /^https?:/.test(href);
    return (
      <Link
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...linkProps}
      >
        {layers}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} {...(rest as React.ComponentProps<"button">)}>
      {layers}
    </button>
  );
}

/** Filtro de distorção do vidro. Renderize UMA vez por página (está no layout público). */
export function GlassFilter() {
  return (
    <svg aria-hidden focusable="false" className="pointer-events-none absolute size-0">
      <defs>
        <filter id="container-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}
