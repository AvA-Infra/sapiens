import Link from "next/link";
import { ArrowRight, BookOpenCheck, MapPin, MessageCircle, MonitorPlay, Star } from "lucide-react";
import { AreaCards } from "@/components/AreaCards";
import { FaqList } from "@/components/FaqList";
import { CountUp } from "@/components/hero/CountUp";
import { Hero } from "@/components/hero/Hero";
import { VisitScheduler } from "@/components/VisitScheduler";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, Pending, Section, SectionTitle } from "@/components/ui/Section";
import { TeacherCard } from "@/components/ui/TeacherCard";
import { teachers, testimonials } from "@/config/content";
import { faqs } from "@/config/faq";
import { site, whatsappLink } from "@/config/site";
import { areas, recentApproved, totals } from "@/lib/approved-stats";

const arrowLink = "group inline-flex min-h-11 items-center gap-2 font-semibold text-sky-600 hover:text-navy-900";

export default function HomePage() {
  const approvedPreview = recentApproved.slice(0, 8);
  const teachersPreview = teachers.slice(0, 3);
  const rating = site.googleRating.toFixed(1).replace(".", ",");

  const stats = [
    { label: "aprovações publicadas", value: totals.approvals },
    { label: "delas em Medicina", value: totals.medicine },
    { label: "instituições diferentes", value: totals.institutions },
    { label: "anos de curso", value: site.stats.yearsOfCourse },
  ];

  return (
    <>
      <Hero recent={recentApproved.slice(0, 40)} total={totals.approvals} />

      {/* Números: a única faixa azul-marinho do site */}
      <Section tone="deep" className="!max-w-6xl" labelledBy="numeros">
        <h2 id="numeros" className="sr-only">
          A Sapiens em números
        </h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label}>
              <dd className="font-display text-6xl font-bold leading-none text-on-deep sm:text-7xl">
                <CountUp to={s.value} />
              </dd>
              <dt className="mt-2 text-on-deep-soft">{s.label}</dt>
            </div>
          ))}
          <div className="col-span-2 lg:col-span-1">
            <dd className="flex items-baseline gap-2 font-display text-6xl font-bold leading-none text-on-deep sm:text-7xl">
              {rating}
              <Star className="size-8 fill-sky-400 text-sky-400" aria-hidden />
            </dd>
            <dt className="mt-2 text-on-deep-soft">nota nas avaliações do Google</dt>
          </div>
        </dl>
      </Section>

      {/* Proposta de valor: afirmação à esquerda, fatos verificáveis à direita */}
      <Section labelledBy="proposta">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <Eyebrow>Por que a Sapiens</Eyebrow>
            <SectionTitle id="proposta">Curso de Biomédicas num endereço que você já conhece.</SectionTitle>
          </Reveal>
          <Reveal>
            <ul className="divide-y divide-line">
              <li className="flex gap-5 py-6 first:pt-0">
                <MapPin className="mt-1 size-6 shrink-0 text-sky-500" aria-hidden />
                <div>
                  <h3 className="text-2xl font-bold text-navy-900">No Centro, dentro do Shopping Avenida 28</h3>
                  <p className="mt-1 text-ink-soft">
                    {site.address.street}. Você passa, conhece o espaço e conversa pessoalmente antes de decidir.
                  </p>
                </div>
              </li>
              <li className="flex gap-5 py-6">
                <Star className="mt-1 size-6 shrink-0 text-sky-500" aria-hidden />
                <div>
                  <h3 className="text-2xl font-bold text-navy-900">Nota {rating} no Google</h3>
                  <p className="mt-1 text-ink-soft">A avaliação de quem já estudou aqui está pública para você conferir.</p>
                </div>
              </li>
              <li className="flex gap-5 py-6 last:pb-0">
                <MonitorPlay className="mt-1 size-6 shrink-0 text-sky-500" aria-hidden />
                <div>
                  <h3 className="text-2xl font-bold text-navy-900">Plataforma online a caminho</h3>
                  <p className="mt-1 text-ink-soft">
                    Videoaulas, materiais e acompanhamento do seu progresso, no mesmo lugar em que você já estuda.
                  </p>
                </div>
              </li>
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* Áreas de atuação, com os números reais de cada uma */}
      <Section tone="soft" labelledBy="areas">
        <Reveal>
          <Eyebrow>Para onde nossos alunos vão</Eyebrow>
          <SectionTitle id="areas" className="max-w-3xl">
            Medicina na frente, e espaço para toda a área da saúde.
          </SectionTitle>
        </Reveal>
        <div className="mt-12">
          <AreaCards areas={areas} />
        </div>
      </Section>

      {/* Destaques do curso */}
      <Section labelledBy="destaques">
        <Reveal>
          <Eyebrow>O curso</Eyebrow>
          <SectionTitle id="destaques" className="max-w-2xl">
            O que você encontra por aqui
          </SectionTitle>
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="lift flex h-full flex-col justify-between rounded-card border border-sky-400/70 bg-surface p-8 shadow-pop sm:p-10">
              <span className="grid size-14 place-items-center rounded-2xl bg-sky-100 text-sky-600">
                <BookOpenCheck className="size-8" aria-hidden />
              </span>
              <div className="mt-10">
                <h3 className="text-4xl font-bold text-navy-900 sm:text-5xl">Preparação para Medicina, saúde e ENEM</h3>
                <p className="mt-3 max-w-lg text-lg text-ink-soft">
                  Turmas, horários e valores estão na página de cursos. Se preferir, a gente explica tudo pelo WhatsApp.
                </p>
                <Link href="/cursos" className={`${arrowLink} mt-6 text-lg`}>
                  Ver turmas <ArrowRight className="nudge size-4" aria-hidden />
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div className="lift flex h-full flex-col rounded-card border border-line bg-surface p-8 shadow-card">
              <h3 className="text-3xl font-bold text-navy-900">Conheça o espaço</h3>
              <p className="mt-2 text-ink-soft">Salas, ambiente de estudo e como chegar até a gente.</p>
              <Link href="/estrutura" className={`${arrowLink} mt-auto pt-6`}>
                Ver a estrutura <ArrowRight className="nudge size-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Prévia de aprovados */}
      <Section tone="soft" labelledBy="aprovados">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Aprovados</Eyebrow>
              <SectionTitle id="aprovados">Quem passou</SectionTitle>
            </div>
            <Link href="/quem-cursa-aprova" className={arrowLink}>
              Ver mural completo <ArrowRight className="nudge size-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
        <div className="mt-10">
          {approvedPreview.length === 0 ? (
            <Pending>Adicione os aprovados reais em <code>src/config/content.ts</code> (nome, curso, universidade, ano).</Pending>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {approvedPreview.map((a) => (
                <li key={a.id} className="reveal rounded-card border border-line bg-surface p-5 shadow-card">
                  <p className="font-display text-3xl font-bold leading-none text-navy-900">{a.name}</p>
                  <p className="mt-2 text-ink">{a.course}</p>
                  <p className="text-sm font-semibold text-sky-600">
                    {a.university}
                    {a.year ? `, ${a.year}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* Prévia de professores */}
      <Section labelledBy="professores">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Equipe</Eyebrow>
              <SectionTitle id="professores">Quem dá aula</SectionTitle>
            </div>
            <Link href="/sobre" className={arrowLink}>
              Conhecer a equipe <ArrowRight className="nudge size-4" aria-hidden />
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
      <Section tone="soft" labelledBy="depoimentos">
        <Eyebrow>Depoimentos</Eyebrow>
        <SectionTitle id="depoimentos" className="max-w-2xl">
          O que dizem os alunos
        </SectionTitle>
        <div className="mt-10">
          {testimonials.length === 0 ? (
            <Pending>Inclua depoimentos reais e autorizados em <code>src/config/content.ts</code>.</Pending>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {testimonials.map((t) => (
                <figure key={t.id} className="reveal rounded-card border border-line bg-surface p-7 shadow-card sm:p-8">
                  <blockquote className="font-display text-3xl font-semibold leading-tight text-navy-900">“{t.text}”</blockquote>
                  <figcaption className="mt-5 text-ink-soft">
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
          <Reveal>
            <Eyebrow>Dúvidas</Eyebrow>
            <SectionTitle id="duvidas">O que mais perguntam para a gente</SectionTitle>
            <Link href="/duvidas" className={`${arrowLink} mt-6`}>
              Ver todas as perguntas <ArrowRight className="nudge size-4" aria-hidden />
            </Link>
          </Reveal>
          <FaqList items={faqs.slice(0, 6)} />
        </div>
      </Section>

      {/* Agendar visita + contato */}
      <Section tone="soft" labelledBy="visita" id="agendar-visita">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <Eyebrow>Venha conhecer</Eyebrow>
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
          </Reveal>
          <VisitScheduler />
        </div>
      </Section>
    </>
  );
}
