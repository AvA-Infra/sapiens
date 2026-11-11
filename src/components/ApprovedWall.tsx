"use client";

import Image from "next/image";
import { useMemo, useState, useSyncExternalStore } from "react";
import { Play } from "lucide-react";
import { InstagramIcon } from "@/components/brand/InstagramIcon";
import type { Approved } from "@/config/content";
import { areaOf, type AreaId } from "@/lib/areas";
import { cn } from "@/lib/cn";

const PAGE = 18;

const areaLabels: { id: AreaId | null; label: string }[] = [
  { id: null, label: "Todas as áreas" },
  { id: "medicina", label: "Medicina" },
  { id: "saude", label: "Outras da saúde" },
  { id: "outros", label: "Demais cursos" },
];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-full border px-4 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-200 active:scale-95",
        active ? "border-navy-900 bg-navy-900 text-paper" : "border-line bg-surface text-navy-900 hover:border-sky-500",
      )}
    >
      {children}
    </button>
  );
}

const select = "field min-h-11 rounded-xl border border-line bg-surface px-3 text-navy-900";

/** Contagem por valor, do mais frequente ao menos. */
function tally(values: string[]) {
  const m = new Map<string, number>();
  for (const v of values) m.set(v, (m.get(v) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

/**
 * Cartão leve: nome, curso e instituição em texto. A publicação original do Instagram (foto ou vídeo)
 * só é carregada quando a pessoa pede. Assim a página abre rápido no celular e nenhum cookie
 * do Instagram é definido sem uma ação de quem visita.
 */
function ApprovedCard({ a }: { a: Approved }) {
  const [open, setOpen] = useState(false);
  const ig = a.instagram;

  return (
    <li className="flex flex-col rounded-card border border-line bg-surface p-5 shadow-card">
      <div className="flex gap-4">
        {a.photo && (
          <Image src={a.photo} alt={`Foto de ${a.name}`} width={64} height={64} className="size-16 rounded-full object-cover" />
        )}
        <div className="min-w-0">
          <p className="font-display text-3xl font-bold leading-none text-navy-900">{a.name}</p>
          <p className="mt-2 text-ink">{a.course}</p>
          <p className="text-sm font-semibold text-sky-600">
            {a.university}
            {a.year ? `, ${a.year}` : ""}
          </p>
        </div>
      </div>
      {a.quote && <p className="mt-3 italic">“{a.quote}”</p>}

      {ig &&
        (open ? (
          <div className="mt-4 h-[540px] overflow-hidden rounded-xl border border-line bg-sky-50">
            <iframe
              title={`Publicação da aprovação de ${a.name} em ${a.course}, ${a.university}${ig.type === "reel" ? " (vídeo)" : ""}`}
              src={`https://www.instagram.com/${ig.type}/${ig.id}/embed/`}
              allowFullScreen
              className="size-full bg-paper"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-4 text-sm font-semibold text-sky-600 hover:text-navy-900"
          >
            {ig.type === "reel" ? <Play className="size-4" aria-hidden /> : <InstagramIcon className="size-4" />}
            Ver a publicação
            <span className="sr-only">
              {" "}
              da aprovação de {a.name} em {a.course}
            </span>
          </button>
        ))}
    </li>
  );
}

const noSubscribe = () => () => {};
function areaFromUrl(): AreaId | null {
  const a = new URLSearchParams(window.location.search).get("area");
  return a === "medicina" || a === "saude" || a === "outros" ? a : null;
}

export function ApprovedWall({ items }: { items: Approved[] }) {
  // Os cartões de área da home chegam aqui com ?area=medicina|saude|outros. Vale até a pessoa escolher outro filtro.
  const urlArea = useSyncExternalStore(noSubscribe, areaFromUrl, () => null);
  const [pickedArea, setArea] = useState<AreaId | null | undefined>(undefined);
  const area = pickedArea === undefined ? urlArea : pickedArea;
  const [year, setYear] = useState<number | null>(null);
  const [uni, setUni] = useState("");
  const [course, setCourse] = useState("");
  const [limit, setLimit] = useState(PAGE);

  const inArea = useMemo(() => items.filter((i) => area === null || areaOf(i.course) === area), [items, area]);
  const years = useMemo(
    () => [...new Set(items.map((i) => i.year).filter((y): y is number => y !== null))].sort((a, b) => b - a),
    [items],
  );
  const unis = useMemo(() => tally(inArea.map((i) => i.university)), [inArea]);
  const courses = useMemo(() => tally(inArea.map((i) => i.course)), [inArea]);

  const shown = inArea.filter(
    (i) => (year === null || i.year === year) && (!uni || i.university === uni) && (!course || i.course === course),
  );
  // Mais recentes primeiro
  const sorted = useMemo(() => [...shown].sort((a, b) => (b.year ?? 0) - (a.year ?? 0)), [shown]);

  const reset = () => setLimit(PAGE);
  const hasFilter = area !== null || year !== null || uni !== "" || course !== "";

  return (
    <div>
      <div className="space-y-4">
        <div role="group" aria-label="Filtrar por área" className="flex flex-wrap gap-2">
          {areaLabels.map((a) => (
            <Chip
              key={a.label}
              active={area === a.id}
              onClick={() => {
                setArea(a.id);
                setCourse("");
                setUni("");
                reset();
              }}
            >
              {a.label}
            </Chip>
          ))}
        </div>
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

      <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1 text-ink-soft" aria-live="polite">
        <span>
          <strong className="text-navy-900">{sorted.length}</strong> {sorted.length === 1 ? "aprovação" : "aprovações"}
        </span>
        {hasFilter && (
          <button
            type="button"
            onClick={() => { setArea(null); setYear(null); setUni(""); setCourse(""); reset(); }}
            className="min-h-11 font-semibold text-sky-600 underline underline-offset-4 hover:text-navy-900"
          >
            Limpar filtros
          </button>
        )}
      </p>

      {sorted.length === 0 ? (
        <p className="mt-6 rounded-card border border-line bg-sky-50 p-6 text-ink-soft">
          Nenhuma aprovação com esses filtros. Tente outro ano ou limpe os filtros.
        </p>
      ) : (
        <ul className="mt-4 grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.slice(0, limit).map((a) => (
            <ApprovedCard key={a.id} a={a} />
          ))}
        </ul>
      )}

      {sorted.length > limit && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setLimit((l) => l + PAGE)}
            className="min-h-12 rounded-full border-2 border-navy-900/30 px-8 font-semibold text-navy-900 transition-transform duration-200 hover:-translate-y-0.5 hover:border-navy-900 active:scale-95"
          >
            Mostrar mais ({sorted.length - limit})
          </button>
        </div>
      )}
    </div>
  );
}
