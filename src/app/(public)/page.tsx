import Link from "next/link";
import { ArrowRight, BookOpenCheck, MapPin, MessageCircle, MonitorPlay, Star } from "lucide-react";
import { Hero } from "@/components/hero/Hero";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, Pending, Section } from "@/components/ui/Section";
import { TeacherCard } from "@/components/ui/TeacherCard";
import { approved, teachers, testimonials } from "@/config/content";
import { site, whatsappLink } from "@/config/site";

export default function HomePage() {
  const approvedPreview = approved.slice(0, 4);
  const teachersPreview = teachers.slice(0, 3);

  return (
    <>
      <Hero approvals={approved.length} medicine={approved.filter((a) => a.course === "Medicina").length} />

      {/* Proposta de valor: afirmação à esquerda, fatos verificáveis à direita */}
      <Section labelledBy="proposta">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <Eyebrow>Por que a Sapiens</Eyebrow>
            <h2 id="proposta" className="text-3xl font-bold text-navy-900 sm:text-5xl">
              Curso de Biomédicas num endereço que você já conhece.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="divide-y divide-line">
              <li className="flex gap-5 py-6 first:pt-0">
                <MapPin className="mt-1 size-6 shrink-0 text-sky-500" aria-hidden />
                <div>
                  <h3 className="text-xl font-bold text-navy-900">No Centro, dentro do Shopping Avenida 28</h3>
                  <p className="mt-1 text-ink-soft">
                    {site.address.street}. Você passa, conhece o espaço e conversa pessoalmente antes de decidir.
                  </p>
                </div>
              </li>
              <li className="flex gap-5 py-6">
                <Star className="mt-1 size-6 shrink-0 text-sky-500" aria-hidden />
                <div>
                  <h3 className="text-xl font-bold text-navy-900">Nota {site.googleRating.toFixed(1).replace(".", ",")} no Google</h3>
                  <p className="mt-1 text-ink-soft">A avaliação de quem já estudou aqui está pública para você conferir.</p>
                </div>
              </li>
              <li className="flex gap-5 py-6 last:pb-0">
                <MonitorPlay className="mt-1 size-6 shrink-0 text-sky-500" aria-hidden />
                <div>
                  <h3 className="text-xl font-bold text-navy-900">Plataforma online a caminho</h3>
                  <p className="mt-1 text-ink-soft">
                    Videoaulas, materiais e acompanhamento do seu progresso, no mesmo lugar em que você já estuda.
                  </p>
                </div>
              </li>
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* Destaques do curso */}
      <Section tone="soft" labelledBy="destaques">
        <Reveal>
          <Eyebrow>O curso</Eyebrow>
          <h2 id="destaques" className="max-w-2xl text-3xl font-bold text-navy-900 sm:text-5xl">
            O que você encontra por aqui
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="lift flex h-full flex-col justify-between rounded-card border-2 border-sky-400/60 bg-paper p-8 shadow-lg shadow-sky-500/10 sm:p-10">
              <span className="grid size-14 place-items-center rounded-2xl bg-sky-100 text-sky-600">
                <BookOpenCheck className="size-8" aria-hidden />
              </span>
              <div className="mt-10">
                <h3 className="text-3xl font-bold text-navy-900 sm:text-4xl">Preparação para Medicina, saúde e ENEM</h3>
                <p className="mt-3 max-w-lg text-lg text-ink-soft">
                  Turmas, horários e valores estão na página de cursos. Se preferir, a gente explica tudo pelo WhatsApp.
                </p>
                <Link
                  href="/cursos"
                  className="mt-6 inline-flex min-h-11 items-center gap-2 text-lg font-bold text-sky-600 hover:text-navy-900"
                >
                  Ver turmas <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-card border border-line bg-paper p-8">
              <h3 className="text-xl font-bold text-navy-900">Conheça o espaço</h3>
              <p className="mt-2 text-ink-soft">Salas, ambiente de estudo e como chegar até a gente.</p>
              <Link
                href="/estrutura"
                className="mt-5 inline-flex items-center gap-2 font-semibold text-sky-600 hover:text-navy-900"
              >
                Ver a estrutura <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Prévia de aprovados */}
      <Section labelledBy="aprovados">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Aprovados</Eyebrow>
              <h2 id="aprovados" className="text-3xl font-bold text-navy-900 sm:text-5xl">
                Quem passou
              </h2>
            </div>
            <Link href="/quem-cursa-aprova" className="inline-flex items-center gap-2 font-semibold text-sky-600 hover:text-navy-900">
              Ver mural completo <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
        <div className="mt-10">
          {approvedPreview.length === 0 ? (
            <Pending>Adicione os aprovados reais em <code>src/config/content.ts</code> (nome, curso, universidade, ano).</Pending>
          ) : (
            <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {approvedPreview.map((a) => (
                <li key={a.id} className="border-t-2 border-navy-900 pt-4">
                  <p className="font-display text-xl font-bold text-navy-900">{a.name}</p>
                  <p className="text-ink-soft">{a.course}</p>
                  <p className="text-sm font-semibold text-sky-600">{a.university}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* Prévia de professores */}
      <Section tone="soft" labelledBy="professores">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Equipe</Eyebrow>
              <h2 id="professores" className="text-3xl font-bold text-navy-900 sm:text-5xl">
                Quem dá aula
              </h2>
            </div>
            <Link href="/sobre" className="inline-flex items-center gap-2 font-semibold text-sky-600 hover:text-navy-900">
              Conhecer a equipe <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {teachersPreview.map((t) => (
            <TeacherCard key={t.id} teacher={t} />
          ))}
        </div>
      </Section>

      {/* Depoimentos */}
      <Section labelledBy="depoimentos">
        <Eyebrow>Depoimentos</Eyebrow>
        <h2 id="depoimentos" className="max-w-2xl text-3xl font-bold text-navy-900 sm:text-5xl">
          O que dizem os alunos
        </h2>
        <div className="mt-10">
          {testimonials.length === 0 ? (
            <Pending>Inclua depoimentos reais e autorizados em <code>src/config/content.ts</code>.</Pending>
          ) : (
            <div className="grid gap-10 md:grid-cols-2">
              {testimonials.map((t) => (
                <figure key={t.id}>
                  <blockquote className="font-display text-2xl font-bold leading-snug text-navy-900">“{t.text}”</blockquote>
                  <figcaption className="mt-4 text-ink-soft">
                    {t.author}, {t.role}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* CTA final */}
      <Section tone="soft" labelledBy="cta">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <h2 id="cta" className="max-w-xl text-4xl font-bold text-navy-900 sm:text-5xl">
              Vamos conversar sobre a sua prova?
            </h2>
            <div className="flex flex-wrap gap-3">
              <Button href={whatsappLink()} size="lg">
                <MessageCircle className="size-5" aria-hidden /> Falar no WhatsApp
              </Button>
              <Button href="/contato" variant="secondary" size="lg">
                Outras formas de contato
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
