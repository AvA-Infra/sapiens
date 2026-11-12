/** Agrupamento dos cursos em áreas. Arquivo pequeno de propósito: é importado também no navegador. */
export type AreaId = "medicina" | "saude" | "outros";

/** Cursos da área da saúde além de Medicina (como aparecem nas publicações da escola). */
const healthCourses = new Set([
  "Odontologia",
  "Enfermagem",
  "Enfermagem e Obstetrícia",
  "Farmácia",
  "Biomedicina",
  "Medicina Veterinária",
  "Educação Física",
  "Psicologia",
  "Nutrição",
]);

export function areaOf(course: string): AreaId {
  if (course === "Medicina") return "medicina";
  return healthCourses.has(course) ? "saude" : "outros";
}
