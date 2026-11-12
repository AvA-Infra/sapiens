import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { FaqList } from "@/components/FaqList";
import { FaqJsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/Button";
import { PageHeader, Section } from "@/components/ui/Section";
import { faqs } from "@/config/faq";
import { whatsappLink } from "@/config/site";

export const metadata: Metadata = {
  title: "Dúvidas frequentes",
  description:
    "Onde fica a Sapiens, para quais provas o curso prepara, como fazer a matrícula e outras perguntas de quem está escolhendo um preparatório em Campos.",
  alternates: { canonical: "/duvidas" },
};

export default function DuvidasPage() {
  return (
    <>
      <FaqJsonLd />
      <PageHeader
        eyebrow="Dúvidas"
        title="Perguntas de quem está escolhendo o curso."
        intro="Se a sua não estiver aqui, pergunte pelo WhatsApp. A gente responde."
      />
      <Section>
        <div className="max-w-3xl">
          <FaqList items={faqs} />
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <p className="font-display text-3xl font-bold text-navy-900">Ficou alguma dúvida?</p>
            <Button href={whatsappLink("Olá! Vim pelo site da Sapiens e tenho uma dúvida.")}>
              <MessageCircle className="size-5" aria-hidden /> Perguntar no WhatsApp
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
