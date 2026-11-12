import type { CSSProperties } from "react";
import { GraduationCap, MapPin, MessageCircle, Star } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import type { Approved } from "@/config/content";
import { site, whatsappLink } from "@/config/site";
import { ConstellationLazy } from "./ConstellationLazy";
import { Listao } from "./Listao";

const lines = ["A vaga na área da saúde", "começa em Campos."];

/** Atraso da animação de entrada (CSS), em segundos. */
const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/**
 * Primeira dobra: promessa à esquerda, prova à direita (o listão com as aprovações reais).
 * A ação principal é o WhatsApp, que é por onde a matrícula acontece.
 */
export function Hero({ recent, total }: { recent: Approved[]; total: number }) {
  let wordIndex = 0;
  const rating = site.googleRating.toFixed(1).replace(".", ",");

  return (
    <section className="relative isolate overflow-hidden bg-paper" aria-labelledby="hero-title">
      {/* Rede neural interativa, bem sutil, ao fundo */}
      <ConstellationLazy className="absolute inset-0 -z-10 size-full opacity-50" />
      <div
        aria-hidden
        className="absolute -right-40 top-10 -z-10 size-[38rem] rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-400/10"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:min-h-[calc(100dvh-6rem)] lg:grid-cols-[1.25fr_1fr] lg:gap-14 lg:pb-20">
        <div>
          <p
            className="rise inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-semibold text-sky-600 shadow-card"
            style={delay(0.05)}
          >
            <MapPin className="size-4" aria-hidden /> No Shopping Avenida 28, Centro de Campos
          </p>

          <h1 id="hero-title" className="mt-6 text-[3.4rem] font-bold text-navy-900 sm:text-7xl xl:text-[5.25rem]">
            {lines.map((line) => (
              <span key={line}>
                {line.split(" ").map((word) => {
                  const i = wordIndex++;
                  return (
                    <span key={i} className="mr-[0.2em] inline-block overflow-hidden pb-[0.1em] align-bottom">
                      <span className="rise rise-word inline-block" style={delay(0.12 + i * 0.05)}>
                        {word}
                      </span>
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>

          {/* Parágrafo e botões sem animação de entrada: são o maior elemento visível (LCP) e devem pintar já no primeiro quadro. */}
          <p className="mt-6 max-w-xl text-lg text-ink-soft sm:text-xl">
            Preparação para Medicina, outras carreiras da saúde e ENEM, no Centro de Campos dos Goytacazes. Veja quem já
            passou e escolha sua turma.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <LiquidButton href={whatsappLink()} size="lg">
              <MessageCircle aria-hidden /> Falar no WhatsApp
            </LiquidButton>
            <Button href="/cursos" variant="secondary" size="lg">
              <GraduationCap className="size-5" aria-hidden /> Conheça o curso
            </Button>
          </div>

          <p className="mt-8 flex items-center gap-3 text-ink-soft">
            <span className="flex gap-0.5 text-sky-500" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="size-5 fill-current" />
              ))}
            </span>
            <span>
              <strong className="text-navy-900">Nota {rating}</strong> nas avaliações do Google
            </span>
          </p>
        </div>

        <div className="relative">
          {/* O cérebro da logo, flutuando sobre o canto do listão */}
          <LogoMark float priority className="absolute -top-14 right-2 z-10 h-28 sm:-top-20 sm:h-40" />
          <Listao items={recent} total={total} />
        </div>
      </div>
    </section>
  );
}
