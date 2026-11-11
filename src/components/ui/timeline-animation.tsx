"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode, RefObject } from "react";
import { cn } from "@/lib/utils";

/**
 * Equivalente do `TimelineContent` usado no componente de preços (o arquivo original não veio no pacote).
 * Cada bloco entra em sequência (`animationNum` define a ordem) quando aparece na tela.
 * Os estados iniciais são iguais no servidor e no navegador; com prefers-reduced-motion as durações caem a zero.
 */
const tags = { div: motion.div, h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p, span: motion.span, section: motion.section } as const;

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: -20, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.4, duration: 0.5 },
  }),
};

export function TimelineContent({
  as = "div",
  animationNum = 0,
  customVariants,
  className,
  children,
}: {
  as?: keyof typeof tags;
  animationNum?: number;
  /** Mantido pela compatibilidade com o componente original (a área observada é o próprio bloco). */
  timelineRef?: RefObject<HTMLElement | null>;
  customVariants?: Variants;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const Tag = tags[as];
  // Estado inicial idêntico no servidor e no navegador. Com movimento reduzido, só o destino muda:
  // chega ao estado final na hora (sem atraso nem duração), já sem desfoque nem deslocamento.
  const base = customVariants ?? defaultVariants;
  const variants: Variants = reduce
    ? { hidden: base.hidden, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0, delay: 0 } } }
    : base;

  return (
    <Tag
      className={cn(className)}
      custom={animationNum}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-8% 0px" }}
    >
      {children}
    </Tag>
  );
}
