import type { CSSProperties } from "react";
import type { Approved } from "@/config/content";

/**
 * "Listão" de aprovados: a lista de nomes que todo vestibulando procura no dia do resultado.
 * Rola sozinha (CSS), pausa com o mouse ou o foco e vira uma lista comum com "reduzir movimento".
 * A segunda cópia existe só para a rolagem fechar o ciclo e fica escondida de leitores de tela.
 */
export function Listao({ items, total }: { items: Approved[]; total: number }) {
  const rows = (hidden: boolean) =>
    items.map((a) => (
      <li
        key={(hidden ? "b-" : "a-") + a.id}
        className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-b border-line/70 px-5 py-2.5"
      >
        <span className="truncate font-display text-[1.35rem] font-semibold leading-tight text-navy-900">{a.name}</span>
        <span className="text-right text-sm font-semibold text-sky-600">{a.university}</span>
        <span className="truncate text-sm text-ink-soft">{a.course}</span>
        <span className="text-right text-sm tabular-nums text-ink-soft">{a.year ?? ""}</span>
      </li>
    ));

  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
      <div className="border-b-2 border-navy-900 px-5 py-3.5">
        <p className="font-display text-2xl font-bold leading-tight text-navy-900">Lista de aprovados</p>
        <p className="text-sm font-semibold text-ink-soft">{total} aprovações publicadas</p>
      </div>
      <div
        className="listao relative h-[19rem] overflow-hidden sm:h-[24rem]"
        tabIndex={0}
        role="group"
        aria-label={`Aprovações mais recentes, de um total de ${total}`}
        style={{ "--listao-duration": `${items.length * 2.2}s` } as CSSProperties}
      >
        <div className="listao-track will-change-transform">
          <ul>{rows(false)}</ul>
          <ul aria-hidden>{rows(true)}</ul>
        </div>
        {/* Esmaece o fim da lista. Um degradê por cima custa menos que uma máscara sobre conteúdo animado. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent" />
      </div>
    </div>
  );
}
