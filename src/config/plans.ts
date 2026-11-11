/**
 * PLANOS DE EXEMPLO. Os planos, valores e benefícios reais ainda não foram definidos pela escola.
 * TODOS os valores e benefícios abaixo são FICTÍCIOS e a página /planos avisa isso (e fica fora do Google: noindex).
 * "Simulados" e "correção de redação" ainda nem existem na plataforma: são só exemplos de benefício.
 *
 * Quando a escola definir: troque os dados abaixo, ponha `plansAreExamples = false` e
 * remova o `robots: { index: false }` de src/app/(public)/planos/page.tsx.
 */
export const plansAreExamples = true;

/** Lista completa de benefícios exibida em todos os cartões; cada plano marca quais inclui. */
export const allBenefits = [
  "Videoaulas liberadas",
  "Material em PDF",
  "Simulados",
  "Correção de redação",
  "Acesso à área do aluno",
] as const;

export type Plan = {
  id: string;
  name: string;
  /** Frase curta sob o nome do plano. */
  tagline: string;
  /** Duração do plano em meses. */
  months: number;
  /** Valor TOTAL do plano, em reais (EXEMPLO). */
  total: number;
  popular?: boolean;
  /** Benefícios incluídos (entre os de `allBenefits`). */
  includes: (typeof allBenefits)[number][];
};

export const plans: Plan[] = [
  {
    id: "mensal",
    name: "Mensal",
    tagline: "Matrícula flexível",
    months: 1,
    total: 450,
    includes: ["Videoaulas liberadas", "Material em PDF", "Acesso à área do aluno"],
  },
  {
    id: "semestral",
    name: "Semestral",
    tagline: "Melhor custo-benefício",
    months: 6,
    total: 2400,
    popular: true,
    includes: ["Videoaulas liberadas", "Material em PDF", "Simulados", "Acesso à área do aluno"],
  },
  {
    id: "anual",
    name: "Anual Reta Final",
    tagline: "Acompanhamento completo até a prova",
    months: 12,
    total: 4200,
    includes: ["Videoaulas liberadas", "Material em PDF", "Simulados", "Correção de redação", "Acesso à área do aluno"],
  },
];
