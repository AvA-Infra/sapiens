/**
 * Configuração central do site. Edite aqui: contato, endereço, horários e números.
 * Tudo marcado com [PREENCHER] precisa ser informado pela Sapiens. Nada aqui é inventado.
 */
// Endereço do site: o domínio definitivo (NEXT_PUBLIC_SITE_URL), senão o endereço que a Vercel dá ao projeto,
// senão o computador local.
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");

export const site = {
  name: "SAPIENS Biomédicas",
  // Fixo de propósito: new Date() quebra a pré-renderização (Cache Components). Atualize a cada ano.
  copyrightYear: 2026,
  shortName: "SAPIENS",
  description:
    "Curso de Biomédicas no Centro de Campos dos Goytacazes, dentro do Shopping Avenida 28. Preparação para Medicina, áreas da saúde e ENEM.",
  // [PREENCHER] trocar pelo domínio definitivo antes de publicar
  url: siteUrl,
  // O Google só pode indexar o domínio definitivo. Enquanto NEXT_PUBLIC_SITE_URL não for definido
  // (endereço provisório *.vercel.app ou localhost), o site inteiro fica com noindex.
  indexable: Boolean(process.env.NEXT_PUBLIC_SITE_URL) && !siteUrl.includes("localhost"),

  contact: {
    phoneDisplay: "(22) 99792-5771",
    whatsappNumber: "5522997925771",
    instagram: "https://www.instagram.com/sapiensvestibulares/",
    // [PREENCHER] e-mail oficial da escola
    email: "[PREENCHER]",
  },

  address: {
    street: "Av. Vinte e Oito de Março, 574",
    district: "Centro",
    city: "Campos dos Goytacazes",
    state: "RJ",
    zip: "28020-740",
    reference: "Dentro do Shopping Avenida 28",
  },

  // [PREENCHER] horários reais. Não publicar até serem informados.
  hours: [{ label: "[PREENCHER]", value: "[PREENCHER]" }],

  // Avaliação informada pela escola (Google)
  googleRating: 5.0,

  // [PREENCHER] anos de curso. Os totais de aprovações vêm de src/config/approved-data.ts (Instagram).
  stats: {
    yearsOfCourse: null as number | null,
  },
} as const;

export function whatsappLink(message = "Olá! Vim pelo site da Sapiens e gostaria de saber mais sobre o curso.") {
  return `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function mapsLink() {
  const { street, district, city, state } = site.address;
  const q = encodeURIComponent(`${street}, ${district}, ${city} - ${state}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}
