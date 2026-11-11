import type { Metadata } from "next";
import Image from "next/image";
import { Clock, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Pending, PageHeader, Section, Eyebrow } from "@/components/ui/Section";
import { isPlaceholder, spacePhotos } from "@/config/content";
import { mapsLink, site } from "@/config/site";

export const metadata: Metadata = {
  title: "Estrutura e localização",
  description: "Conheça o espaço da Sapiens no Shopping Avenida 28, no Centro de Campos dos Goytacazes, e veja como chegar.",
};

export default function EstruturaPage() {
  const { address, hours } = site;
  const hoursReady = hours.some((h) => !isPlaceholder(h.value));

  return (
    <>
      <PageHeader
        eyebrow="Estrutura"
        title="O espaço onde você vai estudar."
        intro="Dentro do Shopping Avenida 28, no Centro de Campos."
      />

      <Section labelledBy="fotos">
        <h2 id="fotos" className="sr-only">Fotos do espaço</h2>
        {spacePhotos.length === 0 ? (
          <Pending>Adicione fotos das salas e do ambiente em <code>public/estrutura</code> e liste em <code>spacePhotos</code> (src/config/content.ts).</Pending>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spacePhotos.map((p) => (
              <li key={p.src} className="relative aspect-[4/3] overflow-hidden rounded-card">
                <Image src={p.src} alt={p.alt} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section tone="soft" labelledBy="chegar">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <Eyebrow>Como chegar</Eyebrow>
            <h2 id="chegar" className="text-3xl font-bold text-navy-900 sm:text-4xl">Venha conhecer</h2>
            <ul className="mt-8 space-y-6">
              <li className="flex gap-4">
                <MapPin className="mt-1 size-5 shrink-0 text-sky-500" aria-hidden />
                <address className="not-italic">
                  {address.street}, {address.district}
                  <br />
                  {address.reference}
                  <br />
                  {address.city} - {address.state}, {address.zip}
                </address>
              </li>
              <li className="flex gap-4">
                <Clock className="mt-1 size-5 shrink-0 text-sky-500" aria-hidden />
                <div>
                  <p className="font-semibold text-navy-900">Horários</p>
                  {hoursReady ? (
                    <ul>{hours.map((h) => <li key={h.label}>{h.label}: {h.value}</li>)}</ul>
                  ) : (
                    <p className="text-ink-soft"><span className="font-semibold text-sky-600">[PREENCHER]</span> Horário de atendimento. Edite em <code>src/config/site.ts</code>.</p>
                  )}
                </div>
              </li>
            </ul>
            <Button href={mapsLink()} className="mt-8">
              <Navigation className="size-4" aria-hidden /> Traçar rota no Google Maps
            </Button>
          </div>
          <iframe
            title="Mapa: Sapiens Biomédicas, Av. Vinte e Oito de Março, 574, Campos dos Goytacazes"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(`${address.street}, ${address.city} - ${address.state}`)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-80 w-full rounded-card border border-line sm:h-[26rem]"
          />
        </div>
      </Section>
    </>
  );
}
