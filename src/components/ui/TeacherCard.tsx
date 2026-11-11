import Image from "next/image";
import type { Teacher } from "@/config/content";
import { isPlaceholder } from "@/config/content";

function initials(name: string) {
  if (isPlaceholder(name)) return "?";
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

export function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <article className="flex gap-5">
      <div className="relative size-24 shrink-0 overflow-hidden rounded-full bg-sky-100 sm:size-28">
        {teacher.photo ? (
          <Image src={teacher.photo} alt={`Foto de ${teacher.name}`} fill sizes="112px" className="object-cover" />
        ) : (
          <span className="grid size-full place-items-center font-display text-3xl font-bold text-sky-600" aria-hidden>
            {initials(teacher.name)}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-xl font-bold text-navy-900">{teacher.name}</h3>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">{teacher.subject}</p>
        <p className="mt-2 text-ink-soft">{teacher.bio}</p>
      </div>
    </article>
  );
}
