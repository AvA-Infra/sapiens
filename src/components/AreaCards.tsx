import Link from "next/link";
import type { AreaSummary } from "@/lib/approved-stats";

/**
 * Áreas de atuação com os números reais de aprovação de cada uma, em linhas (não em cartões):
 * número, nome e descrição à esquerda; onde mais passaram à direita. Cada linha leva ao mural já filtrado.
 */
export function AreaCards({ areas }: { areas: AreaSummary[] }) {
  return (
    <ul className="border-t-2 border-navy-900">
      {areas.map((area) => {
        const max = Math.max(...area.top.map((t) => t.count), 1);
        return (
          <li key={area.id} className="reveal grid gap-x-12 gap-y-6 border-b border-line py-8 md:grid-cols-[7rem_1fr_1fr] md:py-10">
            <p className="font-display text-7xl font-bold leading-none text-navy-900 tabular-nums">{area.total}</p>

            <div>
              <h3 className="text-3xl font-bold text-navy-900 sm:text-4xl">{area.title}</h3>
              <p className="mt-2 max-w-md text-ink-soft">{area.description}</p>
              <Link
                href={`/quem-cursa-aprova?area=${area.id}`}
                className="mt-4 inline-flex min-h-11 items-center font-semibold text-sky-600 underline decoration-sky-400 decoration-2 underline-offset-4 hover:text-navy-900"
              >
                Ver as {area.total} aprovações
              </Link>
            </div>

            <div>
              <p className="text-sm font-semibold text-navy-900">{area.topLabel}</p>
              <ul className="mt-3 space-y-2.5">
                {area.top.map((t) => (
                  <li key={t.label} className="grid grid-cols-[minmax(0,10rem)_1fr_1.5rem] items-center gap-3 text-sm">
                    <span className="truncate text-ink">{t.label}</span>
                    <span className="h-1.5 bg-sky-100" aria-hidden>
                      <span className="block h-full bg-sky-500" style={{ width: `${(t.count / max) * 100}%` }} />
                    </span>
                    <span className="text-right font-semibold tabular-nums text-navy-900">{t.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
