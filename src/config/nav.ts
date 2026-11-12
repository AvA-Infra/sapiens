/** Menu principal (navbar e gaveta do celular). */
export const nav = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/cursos", label: "Cursos" },
  { href: "/planos", label: "Planos" },
  { href: "/estrutura", label: "Estrutura" },
  { href: "/quem-cursa-aprova", label: "Quem cursa, aprova" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
];

/** Rodapé: tudo o que existe no site, em dois grupos. */
export const footerNav = [
  {
    title: "O curso",
    links: [
      { href: "/sobre", label: "Sobre" },
      { href: "/cursos", label: "Cursos" },
      { href: "/planos", label: "Planos" },
      { href: "/estrutura", label: "Estrutura" },
      { href: "/quem-cursa-aprova", label: "Quem cursa, aprova" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { href: "/duvidas", label: "Dúvidas frequentes" },
      { href: "/blog", label: "Blog" },
      { href: "/contato", label: "Contato" },
      { href: "/#agendar-visita", label: "Agendar visita" },
      { href: "/aluno", label: "Área do aluno" },
    ],
  },
];
