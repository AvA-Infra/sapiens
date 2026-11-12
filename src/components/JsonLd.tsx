import { answeredFaqs } from "@/config/faq";
import { isPlaceholder } from "@/config/content";
import { mapsLink, site } from "@/config/site";

/** Conteúdo estático controlado por nós; "<" escapado por segurança. */
function Ld({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const orgId = `${site.url}/#escola`;

/**
 * Dados estruturados da escola (schema.org): é o que alimenta o painel do Google com endereço,
 * telefone e redes. Só entra o que é real: e-mail e horários ficam de fora enquanto forem [PREENCHER].
 * A nota do Google NÃO vai aqui de propósito: o Google proíbe marcar como avaliação própria
 * uma nota que vem de outra plataforma.
 */
export function JsonLd() {
  const email = isPlaceholder(site.contact.email) ? undefined : site.contact.email;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["EducationalOrganization", "LocalBusiness"],
        "@id": orgId,
        name: site.name,
        alternateName: "Sapiens Vestibulares",
        description: site.description,
        url: site.url,
        logo: `${site.url}/marca/logo-sapiens-biomedicas.png`,
        image: `${site.url}/marca/logo-sapiens-biomedicas.png`,
        telephone: "+" + site.contact.whatsappNumber,
        email,
        sameAs: [site.contact.instagram],
        hasMap: mapsLink(),
        areaServed: { "@type": "City", name: site.address.city },
        knowsAbout: ["Vestibular de Medicina", "ENEM", "Pré-vestibular", "Carreiras da saúde"],
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          addressLocality: site.address.city,
          addressRegion: site.address.state,
          postalCode: site.address.zip,
          addressCountry: "BR",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Matrículas e informações",
          telephone: "+" + site.contact.whatsappNumber,
          availableLanguage: "Portuguese",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#site`,
        url: site.url,
        name: site.name,
        inLanguage: "pt-BR",
        publisher: { "@id": orgId },
      },
    ],
  };
  return <Ld data={data} />;
}

/** Perguntas frequentes já respondidas pela escola (as pendentes ficam de fora). */
export function FaqJsonLd() {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: answeredFaqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }}
    />
  );
}

/** Trilha de navegação (Início > Página). */
export function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [{ name: "Início", path: "/" }, ...items].map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          item: `${site.url}${it.path}`,
        })),
      }}
    />
  );
}

/** Artigo do blog. */
export function ArticleJsonLd({ title, description, path, date }: { title: string; description: string; path: string; date: string }) {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        datePublished: date,
        dateModified: date,
        inLanguage: "pt-BR",
        mainEntityOfPage: `${site.url}${path}`,
        author: { "@id": orgId },
        publisher: { "@id": orgId },
      }}
    />
  );
}
