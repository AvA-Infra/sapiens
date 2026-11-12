import { AssistantWidget } from "@/components/AssistantWidget";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { GlassFilter } from "@/components/ui/liquid-glass-button";

/**
 * Site público (antes do login): barra fixa no topo e rodapé azul-marinho.
 * O `pt-16` deixa espaço para a barra.
 * A sidebar fica só nas áreas logadas, no grupo (app).
 */
export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-paper">
      <a
        href="#conteudo"
        className="sr-only z-[60] rounded-full bg-sky-400 px-4 py-2 font-semibold text-navy-950 focus:not-sr-only focus:fixed focus:left-3 focus:top-20"
      >
        Pular para o conteúdo
      </a>
      {/* Filtro SVG do vidro líquido: uma única vez por página */}
      <GlassFilter />
      <Header />
      <main id="conteudo" className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
      <WhatsAppFab />
      {/* Assistente virtual (IA): só existe quando a chave da API está configurada no servidor. */}
      {process.env.ANTHROPIC_API_KEY ? <AssistantWidget /> : null}
      <CookieBanner />
    </div>
  );
}
