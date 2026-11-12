import { MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Approved } from "@/config/content";
import { site, whatsappLink } from "@/config/site";
import { Listao } from "./Listao";

/**
 * Primeira dobra: promessa à esquerda, prova à direita (o listão com as aprovações reais).
 * Sem efeitos de fundo nem animação de entrada: o que chama atenção é a lista de nomes.
 * A ação principal é o WhatsApp, que é por onde a matrícula acontece.
 */
export function Hero({ recent, total }: { recent: Approved[]; total: number }) {
  const rating = site.googleRating.toFixed(1).replace(".", ",");

  return (
    <section className="border-b border-line bg-paper" aria-labelledby="hero-title">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-14 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[1.25fr_1fr] lg:gap-16 lg:pb-20 lg:pt-20">
        <div>
          <p className="font-semibold text-sky-600">
            Curso de Biomédicas no Shopping Avenida 28, Centro de Campos
          </p>

          <h1 id="hero-title" className="mt-4 text-[3.4rem] font-bold text-navy-900 sm:text-7xl xl:text-[5.25rem]">
            A vaga na área da saúde começa em Campos.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-ink-soft sm:text-xl">
            Preparação para Medicina, outras carreiras da saúde e ENEM, no Centro de Campos dos Goytacazes. Veja quem já
            passou e escolha sua turma.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={whatsappLink()} size="lg">
              <MessageCircle className="size-5" aria-hidden /> Falar no WhatsApp
            </Button>
            <Button href="/cursos" variant="secondary" size="lg">
              Conheça o curso
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

        <Listao items={recent} total={total} />
      </div>
    </section>
  );
}
