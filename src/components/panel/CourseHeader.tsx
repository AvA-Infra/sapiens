import Link from "next/link";
import { getCourseHead, getEnrollmentCounts } from "@/lib/panel-data";
import { cn } from "@/lib/cn";

type Tab = "aulas" | "alunos" | "dados";

/**
 * Topo de cada curso no painel: nome, situação e as três abas (Aulas, Alunos, Dados do curso).
 * Cada curso fica separado, com tudo dele num lugar só.
 */
export async function CourseHeader({ id, tab }: { id: string; tab: Tab }) {
  const [course, counts] = await Promise.all([getCourseHead(id), getEnrollmentCounts(id)]);
  const tabs: { key: Tab; href: string; label: string }[] = [
    { key: "aulas", href: `/admin/cursos/${id}`, label: "Aulas" },
    {
      key: "alunos",
      href: `/admin/cursos/${id}/alunos`,
      label: counts.pendente > 0 ? `Alunos (${counts.ativa}) · ${counts.pendente} esperando` : `Alunos (${counts.ativa})`,
    },
    { key: "dados", href: `/admin/cursos/${id}/dados`, label: "Dados do curso" },
  ];

  return (
    <header>
      <Link href="/admin/cursos" className="text-sm font-semibold text-sky-600 underline underline-offset-2 hover:text-navy-900">
        Todos os cursos
      </Link>
      <h1 className="mt-3 text-4xl font-bold text-navy-900 sm:text-5xl">{course.title}</h1>
      <p className="mt-2 text-ink-soft">
        <span className={course.published ? "font-semibold text-sky-600" : "font-semibold"}>
          {course.published ? "Publicado" : "Rascunho"}
        </span>
        {" · "}
        <Link href={`/aluno/curso/${course.slug}`} className="underline underline-offset-2 hover:text-navy-900">
          ver como aluno
        </Link>
      </p>

      <nav aria-label="Seções do curso" className="mt-8 flex gap-6 overflow-x-auto border-b border-line">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            aria-current={t.key === tab ? "page" : undefined}
            className={cn(
              "-mb-px whitespace-nowrap border-b-2 pb-3 font-semibold transition-colors",
              t.key === tab ? "border-navy-900 text-navy-900" : "border-transparent text-ink-soft hover:text-navy-900",
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
