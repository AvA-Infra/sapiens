import { site } from "@/config/site";

/** Dados estruturados: escola + negócio local, com endereço e telefone. */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    name: site.name,
    url: site.url,
    telephone: "+55" + site.contact.whatsappNumber.slice(2),
    sameAs: [site.contact.instagram],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: "BR",
    },
  };
  return (
    <script
      type="application/ld+json"
      // Conteúdo estático controlado por nós; "<" escapado por segurança.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
