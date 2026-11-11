import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/brand/InstagramIcon";
import { Logo } from "@/components/brand/Logo";
import { nav } from "@/config/nav";
import { mapsLink, site, whatsappLink } from "@/config/site";

export function Footer() {
  const { address, contact } = site;
  const link = "inline-flex min-h-9 items-center text-ink hover:text-sky-600";
  return (
    <footer className="mt-16 border-t border-line bg-sky-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1.3fr]">
        <div>
          <Logo size="md" />
          <p className="mt-5 max-w-xs text-ink-soft">
            Curso de Biomédicas no Centro de Campos dos Goytacazes. Preparação para Medicina, saúde e ENEM.
          </p>
        </div>

        <nav aria-label="Rodapé">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">Navegue</h2>
          <ul className="mt-3 space-y-0.5">
            {[...nav, { href: "/aluno", label: "Área do aluno" }].map((i) => (
              <li key={i.href}>
                <Link href={i.href} prefetch={i.href === "/aluno" ? false : undefined} className={link}>
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">Fale com a gente</h2>
          <ul className="mt-3 space-y-3">
            <li className="flex gap-3">
              <MapPin className="mt-1 size-5 shrink-0 text-sky-600" aria-hidden />
              <a href={mapsLink()} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-sky-600">
                {address.street}, {address.district}. {address.reference}. {address.city} - {address.state}, {address.zip}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-1 size-5 shrink-0 text-sky-600" aria-hidden />
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-sky-600">
                {contact.phoneDisplay} (WhatsApp)
              </a>
            </li>
            <li className="flex gap-3">
              <InstagramIcon className="mt-1 size-5 shrink-0 text-sky-600" />
              <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-sky-600">
                @sapiensvestibulares
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-sm text-ink-soft sm:px-6">
          <p>© {site.copyrightYear} SAPIENS Biomédicas</p>
          <p className="flex gap-5">
            <Link href="/privacidade" className="hover:text-sky-600">Privacidade</Link>
            <Link href="/termos" className="hover:text-sky-600">Termos</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
