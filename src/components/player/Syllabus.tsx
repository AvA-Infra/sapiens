import Link from "next/link";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import type { Course } from "@/lib/courses";
import { cn } from "@/lib/cn";

/** Lista de módulos e aulas do curso, com concluídas e a aula atual destacadas. */
export function Syllabus({ course, done, currentId }: { course: Course; done: Set<string>; currentId?: string }) {
  return (
    <nav aria-label={`Conteúdo de ${course.title}`} className="space-y-6">
      {course.modules.map((m) => (
        <section key={m.id}>
          <h3 className="mb-2 text-xl font-bold text-navy-900">{m.title}</h3>
          <ul className="divide-y divide-line rounded-card border border-line">
            {m.lessons.length === 0 && <li className="p-4 text-sm text-ink-soft">Nenhuma aula publicada ainda.</li>}
            {m.lessons.map((l) => {
              const isDone = done.has(l.id);
              const current = l.id === currentId;
              return (
                <li key={l.id}>
                  <Link
                    href={`/aluno/curso/${course.slug}/aula/${l.id}`}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-sky-50",
                      current && "bg-sky-100 font-semibold",
                    )}
                  >
                    {current ? (
                      <PlayCircle className="size-5 shrink-0 text-sky-600" aria-hidden />
                    ) : isDone ? (
                      <CheckCircle2 className="size-5 shrink-0 text-sky-500" aria-hidden />
                    ) : (
                      <Circle className="size-5 shrink-0 text-line" aria-hidden />
                    )}
                    <span className="text-navy-900">{l.title}</span>
                    {!l.published && (
                      <span className="ml-auto rounded-full bg-navy-900 px-2 py-0.5 text-xs font-semibold text-paper">
                        Rascunho
                      </span>
                    )}
                    <span className="sr-only">{isDone ? "(concluída)" : ""}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </nav>
  );
}
