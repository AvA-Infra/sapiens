import Link from "next/link";
import { MapPin, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/brand/InstagramIcon";
import { Logo } from "@/components/brand/Logo";
import { CookiePreferencesButton } from "@/components/layout/CookieBanner";
import { footerNav } from "@/config/nav";
import { mapsLink, site, whatsappLink } from "@/config/site";

export function Footer() {
  const { address, contact } = site;
  const link = "inline-flex min-h-10 items-center text-ink hover:text-sky-600";
  const heading = "font-display text-xl font-bold text-navy-900";
  const small = "min-h-11 inline-flex items-center hover:text-sky-600";

  return (
    <footer className="tone-deep">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.3fr]">
        <div>
          <Logo size="md" />
          <p className="mt-5 max-w-xs text-ink-soft">
            Curso de Biomédicas no Centro de Campos dos Goytacazes. Preparação para Medicina, saúde e ENEM.
          </p>
        </div>

        {footerNav.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className={heading}>{group.title}</h2>
            <ul className="mt-2">
              {group.links.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} prefetch={i.href === "/aluno" ? false : undefined} className={link}>
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className={heading}>Fale com a gente</h2>
          <ul className="mt-3 space-y-3">
            <li className="flex gap-3">
              <MessageCircle className="mt-1 size-5 shrink-0 text-sky-600" aria-hidden />
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
            <li className="flex gap-3">
              <MapPin className="mt-1 size-5 shrink-0 text-sky-600" aria-hidden />
              <a href={mapsLink()} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-sky-600">
                {address.street}, {address.district}. {address.reference}. {address.city} - {address.state}, {address.zip}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        {/* pb extra no celular: o botão flutuante do WhatsApp não cobre os links */}
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 pb-20 pt-4 text-sm text-ink-soft sm:px-6 sm:pb-4">
          <p>© {site.copyrightYear} SAPIENS Biomédicas</p>
          <p className="flex flex-wrap gap-x-5">
            <Link href="/privacidade" className={small}>Privacidade</Link>
            <Link href="/termos" className={small}>Termos</Link>
            <CookiePreferencesButton className={small} />
          </p>
        </div>
      </div>
    </footer>
  );
}
