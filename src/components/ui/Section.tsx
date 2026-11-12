import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * `light` = branco (padrão, domina o site) · `soft` = faixa azul-clarinha para separar blocos ·
 * `deep` = a única faixa azul-marinho do site (números da home). Não use `deep` em outras seções.
 */
type Tone = "light" | "soft" | "deep";

const tones: Record<Tone, string> = {
  light: "bg-paper text-ink",
  soft: "bg-sky-50 text-ink",
  deep: "bg-deep text-on-deep",
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
    <section id={id} aria-labelledby={labelledBy} className={cn("scroll-mt-24 py-16 sm:py-24", tones[tone])}>
      <div className={cn("mx-auto max-w-6xl px-4 sm:px-6", className)}>{children}</div>
    </section>
  );
}

/** Nome da seção acima do título das páginas internas. Use só onde informa de fato (não em toda seção). */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 font-semibold text-sky-600">{children}</p>
  );
}

/** Título de seção no tamanho padrão do site. */
export function SectionTitle({ id, children, className }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <h2 id={id} className={cn("text-4xl font-bold text-navy-900 sm:text-5xl lg:text-6xl", className)}>
      {children}
    </h2>
  );
}

/** Cabeçalho padrão das páginas internas: nome da seção, título grande e uma frase de apoio. */
export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="border-b border-line bg-paper">
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="max-w-4xl text-5xl font-bold text-navy-900 sm:text-6xl lg:text-7xl">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl text-lg text-ink-soft sm:text-xl">{intro}</p>}
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
