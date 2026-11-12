import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { AreaSummary } from "@/lib/approved-stats";

/**
 * Áreas de atuação com os números reais de aprovação de cada uma. Cada cartão leva ao mural já filtrado.
 * As barras mostram a proporção de cada instituição/curso dentro da área.
 */
export function AreaCards({ areas }: { areas: AreaSummary[] }) {
  return (
    <ul className="grid gap-5 lg:grid-cols-[1.25fr_1fr_1fr]">
      {areas.map((area) => {
        const max = Math.max(...area.top.map((t) => t.count), 1);
        return (
          <li key={area.id} className="reveal">
            <Link
              href={`/quem-cursa-aprova?area=${area.id}`}
              className="lift group flex h-full flex-col rounded-card border border-line bg-surface p-7 shadow-card hover:border-sky-500 sm:p-8"
            >
              <p className="font-display text-7xl font-bold leading-none text-navy-900 tabular-nums">{area.total}</p>
              <p className="mt-1 text-sm font-semibold text-ink-soft">
                {area.total === 1 ? "aprovação publicada" : "aprovações publicadas"}
              </p>
              <h3 className="mt-6 text-3xl font-bold text-navy-900">{area.title}</h3>
              <p className="mt-2 text-ink-soft">{area.description}</p>

              <div className="mt-7">
                <p className="text-sm font-semibold text-navy-900">{area.topLabel}</p>
                <ul className="mt-3 space-y-2.5">
                  {area.top.map((t) => (
                    <li key={t.label} className="grid grid-cols-[minmax(0,9rem)_1fr_auto] items-center gap-3 text-sm">
                      <span className="truncate text-ink">{t.label}</span>
                      <span className="h-1.5 overflow-hidden rounded-full bg-sky-100" aria-hidden>
                        <span
                          className="block h-full rounded-full bg-sky-500"
                          style={{ width: `${(t.count / max) * 100}%` }}
                        />
                      </span>
                      <span className="font-semibold tabular-nums text-navy-900">{t.count}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <span className="mt-auto inline-flex items-center gap-2 pt-8 font-semibold text-sky-600 group-hover:text-navy-900">
                Ver quem passou <ArrowRight className="nudge size-4" aria-hidden />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
