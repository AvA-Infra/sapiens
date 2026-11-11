/**
 * Conteúdo editável do site. Tudo com [PREENCHER] precisa ser informado pela Sapiens.
 * Não inventar nomes, resultados, fotos ou depoimentos.
 */

import { instagramApproved } from "./approved-data";

export type Teacher = {
  id: string;
  name: string;
  subject: string;
  bio: string;
  /** Caminho em /public (ex.: "/equipe/maria.jpg"). null = mostra iniciais. */
  photo: string | null;
};

export const teachers: Teacher[] = [
  { id: "prof-1", name: "[PREENCHER]", subject: "[PREENCHER matéria]", bio: "[PREENCHER mini bio]", photo: null },
  { id: "prof-2", name: "[PREENCHER]", subject: "[PREENCHER matéria]", bio: "[PREENCHER mini bio]", photo: null },
  { id: "prof-3", name: "[PREENCHER]", subject: "[PREENCHER matéria]", bio: "[PREENCHER mini bio]", photo: null },
];

export type Approved = {
  id: string;
  name: string;
  course: string;
  university: string;
  year: number | null;
  photo: string | null;
  quote: string | null;
  /** Publicação original no Instagram da escola (embed oficial). */
  instagram?: { id: string; type: "p" | "reel" };
};

/** Aprovados publicados no Instagram da escola (src/config/approved-data.ts). Adicione outros aqui. */
export const approved: Approved[] = instagramApproved.map((a) => ({
  id: a.id,
  name: a.name,
  course: a.course,
  university: a.university,
  year: a.year,
  photo: null,
  quote: null,
  instagram: { id: a.id, type: a.type },
}));

export type Testimonial = { id: string; author: string; role: string; text: string };

/** Só depoimentos reais e autorizados. */
export const testimonials: Testimonial[] = [
  // { id: "t1", author: "Nome", role: "Aluna, turma 2026", text: "..." },
];

export type CourseClass = {
  id: string;
  name: string;
  target: string;
  schedule: string;
  price: string;
};

export const classes: CourseClass[] = [
  { id: "turma-1", name: "[PREENCHER nome da turma]", target: "[PREENCHER público]", schedule: "[PREENCHER]", price: "[PREENCHER]" },
  { id: "turma-2", name: "[PREENCHER nome da turma]", target: "[PREENCHER público]", schedule: "[PREENCHER]", price: "[PREENCHER]" },
];

export type Photo = { src: string; alt: string };

/** Fotos do espaço físico. Coloque os arquivos em /public/estrutura. */
export const spacePhotos: Photo[] = [];

export const isPlaceholder = (s: string) => s.includes("[PREENCHER");
