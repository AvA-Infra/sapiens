import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Eyebrow, Section } from "@/components/ui/Section";
import { Syllabus } from "@/components/player/Syllabus";
import { requireUser } from "@/lib/auth";
import { flatLessons, getCompletedMap, getCourse } from "@/lib/courses";

export default async function CursoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireUser(`/aluno/curso/${slug}`);
  const course = await getCourse(slug, user.role !== "aluno");
  if (!course) notFound();

  const done = await getCompletedMap(user.id);
  const lessons = flatLessons(course.modules);
  const doneCount = lessons.filter((l) => done.has(l.id)).length;
  const percent = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0;
  const next = lessons.find((l) => !done.has(l.id));

  return (
    <Section>
      <Link href="/aluno" className="text-sm font-semibold text-sky-600 hover:text-navy-900">
        ← Meus cursos
      </Link>
      <div className="mt-4 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Eyebrow>Curso</Eyebrow>
          <h1 className="text-5xl font-bold text-navy-900 sm:text-6xl">{course.title}</h1>
          {course.description && <p className="mt-4 max-w-xl text-lg text-ink-soft">{course.description}</p>}
          <div className="mt-8 max-w-sm">
            <div className="mb-2 flex justify-between text-sm font-semibold text-navy-900">
              <span>{doneCount} de {lessons.length} aulas</span>
              <span>{percent}%</span>
            </div>
            <ProgressBar value={percent} label={`Progresso em ${course.title}`} />
          </div>
          {next && (
            <Button href={`/aluno/curso/${course.slug}/aula/${next.id}`} className="mt-8">
              {doneCount > 0 ? "Continuar de onde parou" : "Começar o curso"}
            </Button>
          )}
        </div>
        <Syllabus course={course} done={done} />
      </div>
    </Section>
  );
}
