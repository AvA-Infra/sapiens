"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Conta de 0 até `to` quando entra na tela. `to = null` mostra o marcador [PREENCHER]. */
export function CountUp({ to, suffix = "" }: { to: number | null; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (to === null || !inView) return;
    const controls = animate(0, to, {
      duration: reduce ? 0 : 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [to, inView, reduce]);

  if (to === null) {
    return <span className="font-sans text-base font-semibold text-sky-400">[PREENCHER]</span>;
  }
  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}
