import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { CommentForm, CompleteButton } from "@/components/player/LessonControls";
import { Syllabus } from "@/components/player/Syllabus";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { Section } from "@/components/ui/Section";
import { requireUser } from "@/lib/auth";
import { flatLessons, getCompletedMap, getCourse } from "@/lib/courses";
import { createClient } from "@/lib/supabase/server";
import { getVideoProvider } from "@/lib/video";

type Comment = { id: string; author_name: string; body: string; created_at: string };

export default async function AulaPage({ params }: { params: Promise<{ slug: string; lessonId: string }> }) {
  const { slug, lessonId } = await params;
  const path = `/aluno/curso/${slug}/aula/${lessonId}`;
  const user = await requireUser(path);

  const course = await getCourse(slug, user.role !== "aluno");
  if (!course) notFound();
  const lessons = flatLessons(course.modules);
  const index = lessons.findIndex((l) => l.id === lessonId);
  if (index < 0) notFound();
  const lesson = lessons[index];
  const prev = lessons[index - 1];
  const next = lessons[index + 1];

  const done = await getCompletedMap(user.id);

  // Vídeo: URL de embed assinada e expirável, gerada aqui no servidor. Nunca um link público fixo.
  const provider = getVideoProvider();
  let videoSrc = lesson.video_id && provider ? provider.getEmbedUrl(lesson.video_id) : null;
  if (!videoSrc && lesson.video_url && /^https:\/\//.test(lesson.video_url)) videoSrc = lesson.video_url;

  const supabase = await createClient();
  const [{ data: materialRows }, { data: commentRows }] = await Promise.all([
    supabase.from("materials").select("id, title, file_path").eq("lesson_id", lessonId),
    supabase
      .from("comments")
      .select("id, author_name, body, created_at")
      .eq("lesson_id", lessonId)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  // PDFs ficam em bucket privado: link assinado válido por 1 hora.
  const materials = (
    await Promise.all(
      (materialRows ?? []).map(async (m) => {
        const { data } = await supabase.storage.from("materials").createSignedUrl(m.file_path as string, 3600);
        return data?.signedUrl ? { id: m.id as string, title: m.title as string, url: data.signedUrl } : null;
      }),
    )
  ).filter((m): m is { id: string; title: string; url: string } => m !== null);
  const comments = (commentRows ?? []) as Comment[];

  return (
    <Section className="!py-8 sm:!py-12">
      <Link href={`/aluno/curso/${course.slug}`} className="text-sm font-semibold text-sky-600 hover:text-navy-900">
        ← {course.title}
      </Link>

      <div className="mt-4 grid gap-10 xl:grid-cols-[1.7fr_1fr]">
        <div className="min-w-0">
          <VideoPlayer src={videoSrc} title={lesson.title} />
          <h1 className="mt-6 text-4xl font-bold text-navy-900 sm:text-5xl">{lesson.title}</h1>
          {lesson.description && <p className="mt-3 max-w-2xl text-lg text-ink-soft">{lesson.description}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <CompleteButton lessonId={lesson.id} completed={done.has(lesson.id)} path={path} />
            <div className="flex gap-4 text-sm font-semibold">
              {prev && (
                <Link href={`/aluno/curso/${course.slug}/aula/${prev.id}`} className="text-sky-600 hover:text-navy-900">
                  ← Aula anterior
                </Link>
              )}
              {next && (
                <Link href={`/aluno/curso/${course.slug}/aula/${next.id}`} className="text-sky-600 hover:text-navy-900">
                  Próxima aula →
                </Link>
              )}
            </div>
          </div>

          <section aria-labelledby="materiais" className="mt-10">
            <h2 id="materiais" className="text-3xl font-bold text-navy-900">Materiais de apoio</h2>
            {materials.length === 0 ? (
              <p className="mt-2 text-ink-soft">Nenhum material nesta aula.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {materials.map((m) => (
                  <li key={m.id}>
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 font-semibold text-sky-600 underline underline-offset-2 hover:text-navy-900"
                    >
                      <FileText className="size-5" aria-hidden /> {m.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="duvidas" className="mt-10">
            <h2 id="duvidas" className="text-3xl font-bold text-navy-900">Dúvidas</h2>
            <div className="mt-4 max-w-2xl">
              <CommentForm lessonId={lesson.id} path={path} />
            </div>
            <ul className="mt-8 max-w-2xl space-y-5">
              {comments.length === 0 && <li className="text-ink-soft">Ainda não há dúvidas nesta aula.</li>}
              {comments.map((c) => (
                <li key={c.id} className="border-l-2 border-sky-500 pl-4">
                  <p className="font-semibold text-navy-900">
                    {c.author_name || "Aluno"}{" "}
                    <span className="text-sm font-normal text-ink-soft">
                      · {new Date(c.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </p>
                  <p className="whitespace-pre-wrap">{c.body}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="min-w-0">
          <Syllabus course={course} done={done} currentId={lesson.id} />
        </aside>
      </div>
    </Section>
  );
}
