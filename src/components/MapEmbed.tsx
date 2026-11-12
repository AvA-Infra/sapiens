"use client";

import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { mapsLink, site } from "@/config/site";
import { useConsent } from "@/lib/consent";
import { cn } from "@/lib/cn";

/**
 * Mapa do Google. Só carrega o iframe (que pode definir cookies do Google) quando a pessoa
 * permitiu conteúdos de terceiros no aviso de cookies ou clicou em "Carregar mapa".
 * Antes disso mostra o endereço e um link direto para o Google Maps.
 */
export function MapEmbed({ className }: { className?: string }) {
  const consent = useConsent();
  const [clicked, setClicked] = useState(false);
  const { address } = site;
  const box = cn("w-full overflow-hidden rounded-card border border-line", className);

  if (consent === "all" || clicked) {
    return (
      <iframe
        title={`Mapa: Sapiens Biomédicas, ${address.street}, ${address.city}`}
        src={`https://maps.google.com/maps?q=${encodeURIComponent(`${address.street}, ${address.city} - ${address.state}`)}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={box}
      />
    );
  }

  return (
    <div className={cn(box, "grid place-items-center bg-sky-50 p-6 text-center")}>
      <div>
        <MapPin className="mx-auto size-10 text-sky-500" aria-hidden />
        <p className="mt-3 font-display text-3xl font-bold text-navy-900">{address.reference}</p>
        <p className="mt-1 text-ink-soft">
          {address.street}, {address.district}, {address.city} - {address.state}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setClicked(true)}
            className="min-h-11 rounded-[10px] bg-navy-900 px-5 font-semibold text-paper hover:bg-navy-700"
          >
            Carregar mapa
          </button>
          <a
            href={mapsLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-[10px] border-2 border-navy-900/30 px-5 font-semibold text-navy-900 hover:border-navy-900"
          >
            <Navigation className="size-4" aria-hidden /> Abrir no Google Maps
          </a>
        </div>
        <p className="mt-4 text-sm text-ink-soft">O mapa é um conteúdo do Google e pode usar cookies próprios.</p>
      </div>
    </div>
  );
}
