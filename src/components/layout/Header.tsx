"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LogIn, Menu, MessageCircle, X } from "lucide-react";
import { InstagramIcon } from "@/components/brand/InstagramIcon";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { nav } from "@/config/nav";
import { site, whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname !== "" && pathname.startsWith(href);

/** Links horizontais da navbar. `pathname` vazio = sem destaque (usado no fallback do Suspense). */
function BarLinks({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Principal" className="hidden items-center gap-0.5 xl:flex">
      {nav.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-3 py-2 text-[0.95rem] font-semibold transition-colors",
              active ? "bg-sky-100 text-navy-900" : "text-ink hover:bg-sky-50 hover:text-navy-900",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function CurrentBarLinks() {
  return <BarLinks pathname={usePathname()} />;
}

/** Lista vertical (gaveta do celular). */
function DrawerLinks({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return (
    <nav aria-label="Menu">
      <ul>
        {nav.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href} className="border-b border-line">
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 items-center justify-between font-display text-2xl font-semibold",
                  active ? "text-sky-600" : "text-navy-900",
                )}
              >
                {item.label}
                {active && <span aria-hidden className="size-2.5 rounded-full bg-sky-500" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function CurrentDrawerLinks({ onNavigate }: { onNavigate: () => void }) {
  return <DrawerLinks pathname={usePathname()} onNavigate={onNavigate} />;
}

/**
 * Navbar flutuante (antes do login): topo, cantos arredondados, com respiro das bordas.
 * Ao rolar PARA BAIXO encolhe (menos altura e fundo mais translúcido); ao rolar para cima ou no topo, volta ao normal.
 */
export function Header() {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const openerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  // Encolhe ao rolar para baixo; volta ao normal ao rolar para cima ou ao chegar no topo.
  // O "last" só avança quando o movimento passa de 6 px, então rolagens lentas também são detectadas.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 24) {
        setCompact(false);
        last = y;
        return;
      }
      const delta = y - last;
      if (Math.abs(delta) < 6) return;
      setCompact(delta > 0);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Gaveta aberta: Esc fecha, Tab fica preso dentro dela, a página não rola e o foco vai para o botão de fechar.
  useEffect(() => {
    if (!open) return;
    const opener = openerRef.current;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab" || !drawerRef.current) return;
      const items = drawerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      opener?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4">
        <div
          className={cn(
            "pointer-events-auto flex w-full max-w-[78rem] items-center justify-between gap-3 rounded-full border border-line backdrop-blur-xl",
            "transition-[height,padding,background-color,box-shadow] duration-300 ease-out",
            compact
              ? "h-12 bg-paper/70 pl-3 pr-2 shadow-md shadow-navy-900/10"
              : "h-[4.25rem] bg-paper/95 pl-5 pr-3 shadow-lg shadow-navy-900/10",
          )}
        >
          <Link
            href="/"
            className={cn("origin-left transition-transform duration-300", compact ? "scale-[0.82]" : "scale-100")}
          >
            <Logo size="sm" priority />
          </Link>

          <Suspense fallback={<BarLinks pathname="" />}>
            <CurrentBarLinks />
          </Suspense>

          <div className="flex items-center gap-2">
            <ThemeToggle className={cn("transition-all duration-300", compact && "size-9 min-h-9")} />
            <Button href="/aluno" prefetch={false} size="sm" className="hidden sm:inline-flex">
              <LogIn className="size-4" aria-hidden /> Área do aluno
            </Button>
            <button
              ref={openerRef}
              type="button"
              className="grid size-11 place-items-center rounded-full border border-line text-navy-900 hover:bg-sky-100 xl:hidden"
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls="menu-lateral"
              aria-label="Abrir menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-6" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {/* Gaveta do celular, fora do <header> (o backdrop-blur dele prenderia o position:fixed). */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[70] xl:hidden">
            <motion.div
              aria-hidden
              className="absolute inset-0 bg-navy-950/50 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.25 }}
              onClick={close}
            />
            <motion.aside
              ref={drawerRef}
              id="menu-lateral"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="absolute inset-y-3 right-3 flex w-[min(88vw,22rem)] flex-col overflow-y-auto rounded-[2rem] border border-line bg-paper text-ink shadow-2xl"
              initial={reduce ? { opacity: 0 } : { x: "105%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "105%" }}
              transition={{ duration: reduce ? 0 : 0.4, ease }}
            >
              <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-line pl-6 pr-4">
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">Menu</span>
                <button
                  ref={closeRef}
                  type="button"
                  className="grid size-11 place-items-center rounded-full text-navy-900 hover:bg-sky-100"
                  aria-label="Fechar menu"
                  onClick={close}
                >
                  <X className="size-6" aria-hidden />
                </button>
              </div>
              <div className="px-6 pt-2">
                <Suspense fallback={<DrawerLinks pathname="" onNavigate={close} />}>
                  <CurrentDrawerLinks onNavigate={close} />
                </Suspense>
              </div>
              <div className="mt-auto space-y-4 px-6 pb-7 pt-7">
                <Button href="/aluno" prefetch={false} onClick={close} className="w-full">
                  <LogIn className="size-5" aria-hidden /> Área do aluno
                </Button>
                <Button href={whatsappLink()} onClick={close} variant="secondary" className="w-full">
                  <MessageCircle className="size-5" aria-hidden /> Falar no WhatsApp
                </Button>
                <div className="flex items-center justify-between gap-3">
                  <a
                    href={site.contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center gap-2 font-semibold text-ink hover:text-navy-900"
                  >
                    <InstagramIcon className="size-5 text-sky-600" />
                    @sapiensvestibulares
                  </a>
                  <ThemeToggle />
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
