import Image from "next/image";
import { cn } from "@/lib/utils";

const sizes = {
  sm: { brain: "h-9", name: "text-[1.35rem]", tag: "text-[0.5rem]" },
  md: { brain: "h-12", name: "text-[1.7rem]", tag: "text-[0.58rem]" },
  lg: { brain: "h-16", name: "text-[2.1rem]", tag: "text-[0.64rem]" },
} as const;

/**
 * Só o cérebro (sapiens-cerebro, fundo removido). O arquivo vem recortado no tamanho do cérebro,
 * então o container tem a altura do cérebro e não da imagem toda. `object-contain` + drop-shadow azul.
 * O PNG original tem as bordas laterais e a de baixo cortadas retas; a máscara oval esmaece essas quinas
 * (importante sobre fundo branco). O drop-shadow fica no wrapper, fora da máscara.
 * O Next serve em 1x e 2x (retina) a partir de public/marca/cerebro-2x.png.
 */
export function LogoMark({
  className,
  title,
  float = false,
  priority,
}: {
  className?: string;
  title?: string;
  float?: boolean;
  priority?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-12 shrink-0 drop-shadow-[0_6px_14px_rgb(27_155_224/0.4)] dark:drop-shadow-[0_0_16px_rgb(79_216_255/0.5)]",
        float && "animate-float",
        className,
      )}
    >
      <Image
        src="/marca/cerebro-2x.png"
        alt={title ?? ""}
        aria-hidden={title ? undefined : true}
        width={194}
        height={244}
        priority={priority}
        className="h-full w-auto object-contain [-webkit-mask-image:radial-gradient(ellipse_closest-side,#000_80%,transparent_100%)] [mask-image:radial-gradient(ellipse_closest-side,#000_80%,transparent_100%)]"
      />
    </span>
  );
}

/** Cérebro + wordmark em texto. As cores seguem o tema (títulos em azul-marinho no claro, quase branco no escuro). */
export function Logo({
  className,
  size = "md",
  priority,
}: {
  className?: string;
  size?: keyof typeof sizes;
  priority?: boolean;
}) {
  const s = sizes[size];
  return (
    <span className={cn("inline-flex items-center gap-3 text-navy-900", className)}>
      <LogoMark float priority={priority} className={s.brain} />
      <span className="flex flex-col leading-none">
        <span className={cn("font-display font-bold uppercase tracking-[0.04em]", s.name)}>Sapiens</span>
        <span className={cn("mt-1 font-semibold uppercase tracking-[0.18em] text-sky-600", s.tag)}>
          Curso de Biomédicas
        </span>
      </span>
    </span>
  );
}
