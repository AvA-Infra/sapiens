"use client";

import dynamic from "next/dynamic";

// Canvas carregado só no cliente, depois do primeiro paint do hero.
const Constellation = dynamic(() => import("./Constellation"), { ssr: false });

export function ConstellationLazy({ className }: { className?: string }) {
  return <Constellation className={className} />;
}
