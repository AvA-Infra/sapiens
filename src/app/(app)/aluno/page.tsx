import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Eyebrow, Section } from "@/components/ui/Section";
import { whatsappLink } from "@/config/site";
import { requireUser } from "@/lib/auth";
import { getMyCourses } from "@/lib/courses";

export default async function AlunoPage() {
  const user = await requireUser("/aluno");
  const courses = await getMyCourses(user.id);
  const resume = courses.find((c) => c.next && c.done > 0) ?? courses.find((c) => c.next);

  return (
    <Section>
      <Eyebrow>Área do aluno</Eyebrow>
      <h1 className="text-5xl font-bold text-navy-900 sm:text-6xl">Meus cursos</h1>

      {courses.length === 0 ? (
        <div className="mt-10 max-w-xl rounded-card border border-line p-8">
          <p className="font-display text-3xl font-bold text-navy-900">Você ainda não tem cursos liberados.</p>
          <p className="mt-2 text-ink-soft">
            O acesso é liberado pela escola depois da matrícula. Se você já se matriculou, fale com a gente que
            conferimos.
          </p>
          <Button href={whatsappLink("Olá! Criei minha conta no site e gostaria de liberar o acesso ao curso.")} className="mt-6">
            Falar no WhatsApp
          </Button>
        </div>
      ) : (
        <>
          {resume?.next && (
            <div className="mt-10 flex flex-wrap items-center justify-between gap-5 rounded-card border-2 border-sky-400/60 bg-sky-50 p-7">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-600">Continue de onde parou</p>
                <p className="mt-1 font-display text-3xl font-bold text-navy-900">{resume.next.title}</p>
                <p className="text-ink-soft">{resume.course.title}</p>
              </div>
              <Button size="lg" href={`/aluno/curso/${resume.course.slug}/aula/${resume.next.id}`}>
                <PlayCircle className="size-5" aria-hidden /> Continuar
              </Button>
            </div>
          )}

          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {courses.map(({ course, total, done, percent, next }) => (
              <li key={course.id} className="flex flex-col rounded-card border border-line p-7">
                <h2 className="text-3xl font-bold text-navy-900">{course.title}</h2>
                {course.description && <p className="mt-2 text-ink-soft">{course.description}</p>}
                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-sm font-semibold text-navy-900">
                    <span>{done} de {total} aulas</span>
                    <span>{percent}%</span>
                  </div>
                  <ProgressBar value={percent} label={`Progresso em ${course.title}`} />
                </div>
                <Link
                  href={next ? `/aluno/curso/${course.slug}/aula/${next.id}` : `/aluno/curso/${course.slug}`}
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-sky-600 hover:text-navy-900"
                >
                  {next ? (done > 0 ? "Continuar" : "Começar") : "Rever o curso"} <ArrowRight className="size-4" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </Section>
  );
}
