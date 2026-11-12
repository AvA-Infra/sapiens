import { approved, type Approved } from "@/config/content";
import { areaOf, type AreaId } from "./areas";

/**
 * Números e agrupamentos calculados a partir das aprovações reais (src/config/approved-data.ts).
 * Nada aqui é digitado à mão: se a lista mudar, a home e o mural mudam junto.
 */

function tally(values: string[]) {
  const m = new Map<string, number>();
  for (const v of values) m.set(v, (m.get(v) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export type AreaSummary = {
  id: AreaId;
  title: string;
  description: string;
  total: number;
  /** Itens mais frequentes: instituições (Medicina) ou cursos (demais áreas). */
  top: { label: string; count: number }[];
  topLabel: string;
};

function summarize(id: AreaId, title: string, description: string, by: keyof Pick<Approved, "university" | "course">): AreaSummary {
  const items = approved.filter((a) => areaOf(a.course) === id);
  return {
    id,
    title,
    description,
    total: items.length,
    top: tally(items.map((a) => a[by])).slice(0, 4).map(([label, count]) => ({ label, count })),
    topLabel: by === "university" ? "Onde mais passaram" : "Cursos com mais aprovações",
  };
}

export const areas: AreaSummary[] = [
  summarize(
    "medicina",
    "Medicina",
    "O foco da casa: a maior parte das aprovações publicadas é em Medicina, em faculdades públicas e particulares.",
    "university",
  ),
  summarize(
    "saude",
    "Outras carreiras da saúde",
    "Odontologia, Enfermagem, Farmácia, Biomedicina, Veterinária e outros cursos da área.",
    "course",
  ),
  summarize(
    "outros",
    "ENEM e demais cursos",
    "A mesma preparação serve para quem vai de ENEM para Engenharia, Direito, Arquitetura e outras áreas.",
    "course",
  ),
];

export const totals = {
  approvals: approved.length,
  medicine: approved.filter((a) => a.course === "Medicina").length,
  institutions: new Set(approved.map((a) => a.university)).size,
};

/** Aprovações mais recentes primeiro (a lista de origem já vem do post mais novo para o mais antigo). */
export const recentApproved = [...approved].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
