import type { Metadata } from "next";
import PricingSection from "@/components/ui/pricing-section";

export const metadata: Metadata = {
  title: "Planos",
  description: "Planos da Sapiens Biomédicas: Mensal, Semestral e Anual Reta Final.",
  // Planos de EXEMPLO: fora do Google até a escola definir os reais (veja src/config/plans.ts).
  robots: { index: false, follow: false },
};

export default function PlanosPage() {
  return <PricingSection />;
}
