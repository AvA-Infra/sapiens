import type { Metadata } from "next";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/brand/InstagramIcon";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader, Section } from "@/components/ui/Section";
import { mapsLink, site, whatsappLink } from "@/config/site";

export const metadata: Metadata = {
  title: "Contato e localização",
  description: "Fale com a Sapiens por WhatsApp, telefone, Instagram ou formulário. Av. Vinte e Oito de Março, 574, Campos dos Goytacazes.",
};

export default function ContatoPage() {
  const { address, contact } = site;
  const link = "inline-flex items-center gap-3 font-semibold text-navy-900 hover:text-sky-600";

  return (
    <>
      <PageHeader eyebrow="Contato" title="Fale com a gente." intro="O jeito mais rápido é o WhatsApp. Se preferir, mande uma mensagem pelo formulário." />
      <Section>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={link}>
              <MessageCircle className="size-5 text-sky-500" aria-hidden /> WhatsApp {contact.phoneDisplay}
            </a>
            <div>
              <a href={`tel:+${site.contact.whatsappNumber}`} className={link}>
                <Phone className="size-5 text-sky-500" aria-hidden /> Ligar {contact.phoneDisplay}
              </a>
            </div>
            <div>
              <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className={link}>
                <InstagramIcon className="size-5 text-sky-500" /> @sapiensvestibulares
              </a>
            </div>
            <div className="flex gap-3">
              <MapPin className="mt-1 size-5 shrink-0 text-sky-500" aria-hidden />
              <address className="not-italic">
                {address.street}, {address.district}
                <br />
                {address.reference}
                <br />
                {address.city} - {address.state}, {address.zip}
                <br />
                <a href={mapsLink()} target="_blank" rel="noopener noreferrer" className="font-semibold text-sky-600 underline underline-offset-2">
                  Abrir no Google Maps
                </a>
              </address>
            </div>
          </div>
          <ContactForm />
        </div>

        <iframe
          title="Mapa: Sapiens Biomédicas"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(`${address.street}, ${address.city} - ${address.state}`)}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="mt-16 h-80 w-full rounded-card border border-line sm:h-96"
        />
      </Section>
    </>
  );
}
