"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Approved } from "@/config/content";
import { cn } from "@/lib/cn";

const PAGE = 12;

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors",
        active ? "border-navy-900 bg-navy-900 text-paper" : "border-line text-navy-900 hover:border-navy-900",
      )}
    >
      {children}
    </button>
  );
}

const select =
  "min-h-11 rounded-xl border border-line bg-paper px-3 text-navy-900 focus:border-sky-500";

/** Contagem por valor, do mais frequente ao menos. */
function tally(values: string[]) {
  const m = new Map<string, number>();
  for (const v of values) m.set(v, (m.get(v) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

/**
 * A mídia (foto ou vídeo) vem do embed oficial do Instagram e aparece sozinha. Para não abrir
 * dezenas de iframes de uma vez, cada um só é montado quando chega perto da área visível.
 */
function InstagramEmbed({ a }: { a: Approved }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const ig = a.instagram;

  useEffect(() => {
    const el = ref.current;
    if (!el || mounted) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "700px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  if (!ig) return null;
  return (
    <div ref={ref} className="mt-4 h-[560px] overflow-hidden rounded-card border border-line bg-sky-50">
      {mounted ? (
        <iframe
          title={`Publicação da aprovação de ${a.name} em ${a.course}, ${a.university}${ig.type === "reel" ? " (vídeo)" : ""}`}
          src={`https://www.instagram.com/${ig.type}/${ig.id}/embed/`}
          loading="lazy"
          allowFullScreen
          className="size-full bg-paper"
        />
      ) : (
        <div className="grid size-full place-items-center text-sm text-ink-soft" aria-hidden>
          Carregando publicação...
        </div>
      )}
    </div>
  );
}

function ApprovedCard({ a }: { a: Approved }) {
  return (
    <li className="flex flex-col border-t-2 border-navy-900 pt-5">
      <div className="flex gap-4">
        {a.photo && (
          <Image src={a.photo} alt={`Foto de ${a.name}`} width={72} height={72} className="size-[72px] rounded-full object-cover" />
        )}
        <div>
          <p className="font-display text-3xl font-bold leading-tight text-navy-900">{a.name}</p>
          <p className="mt-1 text-ink">{a.course}</p>
          <p className="text-sm font-semibold text-sky-600">
            {a.university}
            {a.year ? ` · ${a.year}` : ""}
          </p>
        </div>
      </div>
      {a.quote && <p className="mt-3 italic">“{a.quote}”</p>}
      <InstagramEmbed a={a} />
    </li>
  );
}

export function ApprovedWall({ items }: { items: Approved[] }) {
  const [year, setYear] = useState<number | null>(null);
  const [uni, setUni] = useState("");
  const [course, setCourse] = useState("");
  const [limit, setLimit] = useState(PAGE);

  const years = useMemo(
    () => [...new Set(items.map((i) => i.year).filter((y): y is number => y !== null))].sort((a, b) => b - a),
    [items],
  );
  const unis = useMemo(() => tally(items.map((i) => i.university)), [items]);
  const courses = useMemo(() => tally(items.map((i) => i.course)), [items]);

  const shown = items.filter(
    (i) => (year === null || i.year === year) && (!uni || i.university === uni) && (!course || i.course === course),
  );
  // Mais recentes primeiro
  const sorted = useMemo(() => [...shown].sort((a, b) => (b.year ?? 0) - (a.year ?? 0)), [shown]);

  const reset = () => setLimit(PAGE);

  return (
    <div>
      <div className="space-y-5">
        <div role="group" aria-label="Filtrar por ano" className="flex flex-wrap gap-2">
          <Chip active={year === null} onClick={() => { setYear(null); reset(); }}>Todos os anos</Chip>
          {years.map((y) => (
            <Chip key={y} active={year === y} onClick={() => { setYear(y); reset(); }}>{y}</Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-navy-900">
            Curso
            <select value={course} onChange={(e) => { setCourse(e.target.value); reset(); }} className={select}>
              <option value="">Todos os cursos</option>
              {courses.map(([c, n]) => (
                <option key={c} value={c}>{c} ({n})</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-navy-900">
            Instituição
            <select value={uni} onChange={(e) => { setUni(e.target.value); reset(); }} className={select}>
              <option value="">Todas as instituições</option>
              {unis.map(([u, n]) => (
                <option key={u} value={u}>{u} ({n})</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <p className="mt-8 text-sm text-ink-soft" aria-live="polite">
        {sorted.length} aprovação(ões)
      </p>
      <ul className="mt-4 grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
        {sorted.slice(0, limit).map((a) => (
          <ApprovedCard key={a.id} a={a} />
        ))}
      </ul>

      {sorted.length > limit && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setLimit((l) => l + PAGE)}
            className="min-h-12 rounded-full border border-navy-900/25 px-8 font-semibold text-navy-900 hover:border-navy-900 hover:bg-sky-50"
          >
            Mostrar mais ({sorted.length - limit})
          </button>
        </div>
      )}
    </div>
  );
}
