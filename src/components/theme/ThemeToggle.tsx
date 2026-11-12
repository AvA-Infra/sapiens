"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { THEME_STORAGE_KEY } from "./theme";

/** O tema vive na classe "dark" do <html>; esta função escuta as mudanças dela. */
function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => obs.disconnect();
}
const isDark = () => document.documentElement.classList.contains("dark");

/** Botão sol/lua. Alterna a classe no <html> e salva a escolha no localStorage. */
export function ThemeToggle({ className, withLabel = false }: { className?: string; withLabel?: boolean }) {
  // No servidor o tema é "claro" (padrão); o script do <head> corrige antes da pintura.
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  const toggle = () => {
    const next = !isDark();
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Sem localStorage (modo privado): vale só nesta visita.
    }
  };

  const label = dark ? "Mudar para o tema claro" : "Mudar para o tema escuro";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-line px-3 text-navy-900 transition-colors hover:bg-sky-100",
        !withLabel && "size-11 px-0",
        className,
      )}
    >
      {dark ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />}
      {withLabel && <span className="text-sm font-semibold">{dark ? "Tema claro" : "Tema escuro"}</span>}
    </button>
  );
}
