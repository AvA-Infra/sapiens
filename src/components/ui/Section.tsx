import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** `light` = branco (padrão, domina o site) · `soft` = faixa azul-clarinha para separar blocos. Sem seções em azul-escuro. */
type Tone = "light" | "soft";

const tones: Record<Tone, string> = {
  light: "bg-paper text-ink",
  soft: "bg-sky-50 text-ink",
};

export function Section({
  tone = "light",
  className,
  children,
  id,
  labelledBy,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("py-14 sm:py-20", tones[tone])}>
      <div className={cn("mx-auto max-w-6xl px-4 sm:px-6", className)}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-sky-600">{children}</p>;
}

/** Cabeçalho padrão das páginas internas: branco, título em azul-marinho e uma linha de destaque. */
export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="border-b border-line bg-paper">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-12">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="max-w-3xl text-4xl font-bold text-navy-900 sm:text-5xl lg:text-6xl">{title}</h1>
        <div aria-hidden className="mt-5 h-1.5 w-20 rounded-full bg-sky-400" />
        {intro && <p className="mt-5 max-w-2xl text-lg text-ink-soft">{intro}</p>}
      </div>
    </div>
  );
}

/** Aviso visível de conteúdo que a escola ainda precisa fornecer. */
export function Pending({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-card border border-dashed border-sky-500/60 bg-sky-50 p-5 text-ink-soft">
      <span className="mr-2 font-semibold text-sky-600">[PREENCHER]</span>
      {children}
    </p>
  );
}
