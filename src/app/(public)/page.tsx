import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { AreaCards } from "@/components/AreaCards";
import { FaqList } from "@/components/FaqList";
import { Hero } from "@/components/hero/Hero";
import { VisitScheduler } from "@/components/VisitScheduler";
import { Button } from "@/components/ui/Button";
import { Pending, Section, SectionTitle } from "@/components/ui/Section";
import { TeacherCard } from "@/components/ui/TeacherCard";
import { teachers, testimonials } from "@/config/content";
import { faqs } from "@/config/faq";
import { site, whatsappLink } from "@/config/site";
import { areas, recentApproved, totals } from "@/lib/approved-stats";

const textLink =
  "inline-flex min-h-11 items-center font-semibold text-sky-600 underline decoration-sky-400 decoration-2 underline-offset-4 hover:text-navy-900";

export default function HomePage() {
  const approvedPreview = recentApproved.slice(0, 12);
  const teachersPreview = teachers.slice(0, 3);
  const rating = site.googleRating.toFixed(1).replace(".", ",");
  const years = site.stats.yearsOfCourse;

  return (
    <>
      <Hero recent={recentApproved.slice(0, 40)} total={totals.approvals} />

      {/* Números em uma frase, sobre azul-marinho */}
      <section className="tone-deep" aria-labelledby="numeros">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <h2 id="numeros" className="max-w-4xl text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
            {totals.approvals} aprovações publicadas, {totals.medicine} delas em Medicina, em {totals.institutions}{" "}
            instituições diferentes.
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            Cada uma está no Instagram da escola, com nome, curso e faculdade. Nota {rating} nas avaliações do Google.
            {years === null && (
              <>
                {" "}
                <span className="font-semibold text-sky-600">[PREENCHER]</span> anos de curso.
              </>
            )}
            {years !== null && <> São {years} anos de curso.</>}
          </p>
          <Link href="/quem-cursa-aprova" className={`${textLink} mt-4`}>
            Ver o mural completo
          </Link>
        </div>
      </section>

      {/* Proposta de valor: afirmação à esquerda, fatos verificáveis à direita */}
      <Section labelledBy="proposta">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <SectionTitle id="proposta">Curso de Biomédicas num endereço que você já conhece.</SectionTitle>
          <dl className="divide-y divide-line border-y border-line">
            <div className="py-6">
              <dt className="font-display text-2xl font-bold text-navy-900">No Centro, dentro do Shopping Avenida 28</dt>
              <dd className="mt-1 text-ink-soft">
                {site.address.street}. Você passa, conhece o espaço e conversa pessoalmente antes de decidir.
              </dd>
            </div>
            <div className="py-6">
              <dt className="font-display text-2xl font-bold text-navy-900">Nota {rating} no Google</dt>
              <dd className="mt-1 text-ink-soft">A avaliação de quem já estudou aqui está pública para você conferir.</dd>
            </div>
            <div className="py-6">
              <dt className="font-display text-2xl font-bold text-navy-900">Plataforma online a caminho</dt>
              <dd className="mt-1 text-ink-soft">
                Videoaulas, materiais e acompanhamento do seu progresso, no mesmo lugar em que você já estuda.
              </dd>
            </div>
          </dl>
        </div>
      </Section>

      {/* Áreas de atuação, com os números reais de cada uma */}
      <Section tone="soft" labelledBy="areas">
        <SectionTitle id="areas" className="max-w-3xl">
          Medicina na frente, e espaço para toda a área da saúde.
        </SectionTitle>
        <div className="mt-10">
          <AreaCards areas={areas} />
        </div>
      </Section>

      {/* O curso */}
      <Section labelledBy="destaques">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div>
            <SectionTitle id="destaques">Preparação para Medicina, saúde e ENEM</SectionTitle>
            <p className="mt-5 max-w-lg text-lg text-ink-soft">
              Turmas, horários e valores estão na página de cursos. Se preferir, a gente explica tudo pelo WhatsApp.
            </p>
            <Link href="/cursos" className={`${textLink} mt-4 text-lg`}>
              Ver turmas
            </Link>
          </div>
          <div className="border-l-2 border-sky-400 pl-6 lg:mt-3">
            <h3 className="text-3xl font-bold text-navy-900">Conheça o espaço</h3>
            <p className="mt-2 text-ink-soft">Salas, ambiente de estudo e como chegar até a gente.</p>
            <Link href="/estrutura" className={`${textLink} mt-3`}>
              Ver a estrutura
            </Link>
          </div>
        </div>
      </Section>

      {/* Prévia de aprovados */}
      <Section tone="soft" labelledBy="aprovados">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
          <SectionTitle id="aprovados">Quem passou</SectionTitle>
          <Link href="/quem-cursa-aprova" className={textLink}>
            Ver mural completo
          </Link>
        </div>
        <div className="mt-10">
          {approvedPreview.length === 0 ? (
            <Pending>Adicione os aprovados reais em <code>src/config/content.ts</code> (nome, curso, universidade, ano).</Pending>
          ) : (
            <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {approvedPreview.map((a) => (
                <li key={a.id} className="flex items-baseline justify-between gap-4 border-t border-line py-3.5">
                  <span>
                    <span className="font-display text-2xl font-bold text-navy-900">{a.name}</span>
                    <span className="ml-2 text-ink-soft">{a.course}</span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-sky-600">
                    {a.university}
                    {a.year ? ` ${a.year}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* Prévia de professores */}
      <Section labelledBy="professores">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
          <SectionTitle id="professores">Quem dá aula</SectionTitle>
          <Link href="/sobre" className={textLink}>
            Conhecer a equipe
          </Link>
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          {teachersPreview.map((t) => (
            <TeacherCard key={t.id} teacher={t} />
          ))}
        </div>
      </Section>

      {/* Depoimentos */}
      <Section tone="soft" labelledBy="depoimentos">
        <SectionTitle id="depoimentos" className="max-w-2xl">
          O que dizem os alunos
        </SectionTitle>
        <div className="mt-10">
          {testimonials.length === 0 ? (
            <Pending>Inclua depoimentos reais e autorizados em <code>src/config/content.ts</code>.</Pending>
          ) : (
            <div className="grid gap-x-16 gap-y-12 md:grid-cols-2">
              {testimonials.map((t) => (
                <figure key={t.id} className="border-l-2 border-sky-400 pl-6">
                  <blockquote className="font-display text-3xl font-semibold leading-tight text-navy-900">“{t.text}”</blockquote>
                  <figcaption className="mt-4 text-ink-soft">
                    <strong className="text-navy-900">{t.author}</strong>, {t.role}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Perguntas frequentes */}
      <Section labelledBy="duvidas">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div>
            <SectionTitle id="duvidas">O que mais perguntam para a gente</SectionTitle>
            <Link href="/duvidas" className={`${textLink} mt-4`}>
              Ver todas as perguntas
            </Link>
          </div>
          <FaqList items={faqs.slice(0, 6)} />
        </div>
      </Section>

      {/* Agendar visita + contato */}
      <Section tone="soft" labelledBy="visita" id="agendar-visita">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <SectionTitle id="visita">Vamos conversar sobre a sua prova?</SectionTitle>
            <p className="mt-5 max-w-md text-lg text-ink-soft">
              Escolha um dia para conhecer o espaço e tirar suas dúvidas pessoalmente. Se preferir, chame direto no WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={whatsappLink()} size="lg">
                <MessageCircle className="size-5" aria-hidden /> Falar no WhatsApp
              </Button>
              <Button href="/contato" variant="secondary" size="lg">
                Outras formas de contato
              </Button>
            </div>
          </div>
          <VisitScheduler />
        </div>
      </Section>
    </>
  );
}
