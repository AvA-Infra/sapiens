import type { CSSProperties } from "react";
import { GraduationCap, MapPin, MessageCircle } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { site, whatsappLink } from "@/config/site";
import { ConstellationLazy } from "./ConstellationLazy";
import { CountUp } from "./CountUp";

const lines = ["A vaga na área da saúde", "começa em Campos."];

/** Atraso da animação de entrada (CSS), em segundos. */
const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export function Hero({ approvals, medicine }: { approvals: number; medicine: number }) {
  const stats = [
    { label: "anos de curso", value: site.stats.yearsOfCourse },
    { label: "aprovações publicadas", value: approvals },
    { label: "delas em Medicina", value: medicine },
  ];

  let wordIndex = 0;

  return (
    <section className="relative isolate overflow-hidden bg-paper" aria-labelledby="hero-title">
      {/* Rede neural interativa, bem sutil, ao fundo */}
      <ConstellationLazy className="absolute inset-0 -z-10 size-full opacity-60" />

      <div className="mx-auto grid min-h-[calc(100dvh-6rem)] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <p
            className="rise inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-sm font-bold text-sky-600"
            style={delay(0.05)}
          >
            <MapPin className="size-4" aria-hidden /> Curso de Biomédicas · Shopping Avenida 28
          </p>

          <h1 id="hero-title" className="mt-6 text-5xl font-bold text-navy-900 sm:text-6xl xl:text-7xl">
            {lines.map((line, li) => (
              <span key={line} className={li === 1 ? "block text-sky-600" : "block"}>
                {line.split(" ").map((word) => {
                  const i = wordIndex++;
                  return (
                    <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
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
            <LiquidButton href="/cursos" size="lg">
              <GraduationCap aria-hidden /> Conheça o curso
            </LiquidButton>
            <Button href={whatsappLink()} variant="secondary" size="lg">
              <MessageCircle className="size-5" aria-hidden /> Falar no WhatsApp
            </Button>
          </div>
        </div>

        {/* Cérebro flutuando: container do tamanho do cérebro, com brilho azul suave atrás */}
        <div className="relative mx-auto grid place-items-center py-6" aria-hidden>
          <div className="absolute size-[85%] rounded-full bg-sky-400/25 blur-3xl dark:bg-sky-400/15" />
          <LogoMark float priority className="relative h-72 sm:h-96 xl:h-[28rem]" />
        </div>
      </div>

      <div className="border-t border-line bg-sky-50">
        <dl className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-7 sm:grid-cols-3 sm:px-6">
          {stats.map((s) => (
            <div key={s.label}>
              <dd className="font-display text-5xl font-bold text-navy-900">
                <CountUp to={s.value} />
              </dd>
              <dt className="mt-1 text-sm font-medium text-ink-soft">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
