import { Home } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh flex-1 place-items-center bg-paper px-4 text-center">
      <div>
        <LogoMark float className="mx-auto h-28" />
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-sky-600">Erro 404</p>
        <h1 className="mt-2 text-5xl font-bold text-navy-900 sm:text-6xl">Página não encontrada</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-ink-soft">O endereço pode ter mudado ou nunca ter existido.</p>
        <Button href="/" size="lg" className="mt-8">
          <Home className="size-5" aria-hidden /> Voltar para o início
        </Button>
      </div>
    </main>
  );
}
