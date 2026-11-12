import { site, whatsappLink } from "@/config/site";

/** Logo do WhatsApp (traço oficial simplificado). */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm.01 1.67c2.2 0 4.27.86 5.82 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24Zm-3.52 4.2c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.13.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.07-.1-.23-.16-.48-.29-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23a7.5 7.5 0 0 1-1.38-1.72c-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43l-.48-.01Z" />
    </svg>
  );
}

/**
 * Botão flutuante de WhatsApp: a conversão principal do site, sempre à mão no celular.
 * Fica acima do aviso de cookies (z menor que o da gaveta do menu) e respeita a área segura do iPhone.
 */
export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Falar com a Sapiens no WhatsApp: ${site.contact.phoneDisplay}`}
      className="group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex h-14 items-center gap-0 rounded-full bg-whatsapp pl-4 pr-4 text-white shadow-pop transition-[transform,filter,gap,padding] duration-300 ease-out hover:-translate-y-0.5 hover:gap-2 hover:brightness-110 active:scale-95 sm:right-6 dark:text-navy-950"
    >
      <WhatsAppIcon className="size-7 shrink-0" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap font-semibold transition-[max-width] duration-300 ease-out group-hover:max-w-40 group-focus-visible:max-w-40">
        Falar no WhatsApp
      </span>
    </a>
  );
}
