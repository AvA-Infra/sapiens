import { ActionForm, Field, inputClass } from "@/components/panel/ActionForm";
import { CourseHeader } from "@/components/panel/CourseHeader";
import { Section } from "@/components/ui/Section";
import { deleteCourse, updateCourse } from "@/lib/panel-actions";
import { getCourseHead } from "@/lib/panel-data";

/** Aba "Dados do curso": nome, descrição, publicar e excluir. */
export default async function CursoDadosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourseHead(id);

  return (
    <Section className="max-w-4xl">
      <CourseHeader id={course.id} tab="dados" />

      <div className="mt-8 max-w-2xl space-y-10">
        <ActionForm action={updateCourse} submitLabel="Salvar curso">
          <input type="hidden" name="id" value={course.id} />
          <Field label="Nome do curso">
            <input name="title" defaultValue={course.title} required minLength={3} maxLength={120} className={inputClass} />
          </Field>
          <Field label="Descrição" hint="opcional, aparece para o aluno">
            <textarea name="description" rows={4} defaultValue={course.description ?? ""} maxLength={1000} className={inputClass} />
          </Field>
          <label className="flex items-start gap-3">
            <input type="checkbox" name="published" defaultChecked={course.published} className="mt-1.5 size-5 accent-navy-900" />
            <span>
              <span className="font-semibold text-navy-900">Curso publicado</span>
              <span className="block text-sm text-ink-soft">
                Mesmo publicado, o aluno só vê o curso depois que o acesso dele for liberado, e só as aulas publicadas.
              </span>
            </span>
          </label>
        </ActionForm>

        <details className="rounded-card border border-red-200 p-5">
          <summary className="cursor-pointer font-semibold text-red-700">Excluir curso</summary>
          <p className="mt-3 text-sm text-ink-soft">
            Apaga o curso, os módulos, as aulas, os materiais, as matrículas e o progresso dos alunos. Não dá para desfazer.
          </p>
          <ActionForm action={deleteCourse} submitLabel="Confirmar exclusão" pendingLabel="Excluindo..." variant="danger" className="mt-3">
            <input type="hidden" name="id" value={course.id} />
          </ActionForm>
        </details>
      </div>
    </Section>
  );
}
