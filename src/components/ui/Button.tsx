import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "accent";
type Size = "default" | "sm" | "lg";

// Botões grandes por padrão (alvo de toque de 48 px) e com microanimação de clique.
const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold " +
  "transition-[background-color,color,box-shadow,transform,border-color] duration-200 ease-out " +
  "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const sizes: Record<Size, string> = {
  sm: "min-h-11 px-5 text-[0.95rem]",
  default: "min-h-12 px-6 text-base",
  lg: "min-h-14 px-8 text-lg",
};

// `bg-navy-900 text-paper` e `bg-paper text-navy-900` trocam de lugar sozinhos no tema escuro.
const variants: Record<Variant, string> = {
  primary: "bg-navy-900 text-paper shadow-md shadow-navy-900/15 hover:bg-navy-700",
  secondary: "border-2 border-navy-900/30 text-navy-900 hover:border-navy-900 hover:bg-sky-50",
  ghost: "text-navy-900 hover:bg-sky-100",
  // Ciano da marca: destaque pontual (ex.: "Continuar" no painel). Texto sempre escuro para manter o contraste.
  accent: "bg-sky-400 text-navy-950 shadow-md shadow-sky-500/20 hover:bg-sky-200",
};

type Props = { variant?: Variant; size?: Size } & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "href">)
  | ({ href?: undefined } & ComponentProps<"button">)
);

export function Button({ variant = "primary", size = "default", className, ...rest }: Props) {
  const classes = cn(base, sizes[size], variants[variant], className);
  if (rest.href !== undefined) {
    const { href, ...linkProps } = rest;
    const external = /^https?:/.test(href);
    return (
      <Link
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...linkProps}
      />
    );
  }
  return <button type="button" className={classes} {...(rest as ComponentProps<"button">)} />;
}
