"use client";

import NumberFlow from "@number-flow/react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Check, Minus } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { allBenefits, plans, plansAreExamples } from "@/config/plans";
import { whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";

/* ATENÇÃO: todos os planos, valores e benefícios vêm de src/config/plans.ts e são FICTÍCIOS (exemplo). */

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

type Mode = "total" | "mes";

/** Alterna entre o valor total do plano e o equivalente por mês (conta direta sobre os valores de exemplo). */
function PricingSwitch({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const options: { value: Mode; label: string }[] = [
    { value: "total", label: "Valor total" },
    { value: "mes", label: "Por mês" },
  ];
  return (
    <div className="flex justify-center">
      <div role="group" aria-label="Como mostrar os preços" className="relative z-10 flex w-fit rounded-full border border-line bg-paper p-1 shadow-sm">
        {options.map((o) => {
          const active = mode === o.value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={cn(
                "relative h-12 rounded-full px-7 text-base font-bold transition-colors",
                active ? "text-paper" : "text-ink-soft hover:text-navy-900",
              )}
            >
              {active && (
                <motion.span
                  layoutId="pricing-switch"
                  className="absolute inset-0 rounded-full bg-navy-900 shadow-md shadow-navy-900/30"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const revealVariants: Variants = {
  hidden: { filter: "blur(10px)", y: -20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { delay: i * 0.25, duration: 0.5 },
  }),
};

export default function PricingSection() {
  const [mode, setMode] = useState<Mode>("total");
  const base = plans[0].total / plans[0].months;

  return (
    <div className="relative isolate overflow-hidden bg-paper px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      {/* Brilho azul bem suave no topo (o fundo continua branco) */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[28rem]"
        style={{ backgroundImage: "radial-gradient(60% 100% at 50% 0%, var(--sky-100) 0%, transparent 100%)" }}
      />

      <div className="mx-auto mb-8 max-w-3xl text-center">
        <TimelineContent as="h1" animationNum={0} customVariants={revealVariants} className="text-4xl font-bold text-navy-900 sm:text-5xl md:text-6xl">
          Planos para cada fase da sua{" "}
          <TimelineContent
            as="span"
            animationNum={1}
            customVariants={revealVariants}
            className="inline-block rounded-2xl border-2 border-dashed border-sky-500 bg-sky-100 px-3 py-0.5 text-sky-600"
          >
            preparação
          </TimelineContent>
        </TimelineContent>

        <TimelineContent as="p" animationNum={2} customVariants={revealVariants} className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
          Escolha o tempo que cabe na sua rotina. A matrícula e o pagamento, por enquanto, são combinados direto com a escola pelo WhatsApp.
        </TimelineContent>

        {plansAreExamples && (
          <TimelineContent as="p" animationNum={3} customVariants={revealVariants} className="mx-auto mt-6 max-w-xl rounded-card border-2 border-dashed border-sky-500/70 bg-sky-50 p-4 text-left text-base text-ink-soft">
            <strong className="mr-1.5 text-sky-600">[EXEMPLO]</strong>
            Os planos, valores e benefícios abaixo são fictícios, só para mostrar como a página vai ficar. A escola ainda vai definir os reais.
          </TimelineContent>
        )}
      </div>

      <TimelineContent as="div" animationNum={4} customVariants={revealVariants}>
        <PricingSwitch mode={mode} onChange={setMode} />
      </TimelineContent>

      <ul className="mx-auto grid max-w-6xl list-none gap-5 py-8 md:grid-cols-3">
        {plans.map((plan, index) => {
          const perMonth = Math.round(plan.total / plan.months);
          const value = mode === "total" ? plan.total : perMonth;
          const saving = plan.months > 1 ? Math.round((1 - plan.total / plan.months / base) * 100) : 0;
          const cta = `Olá! Vi o plano ${plan.name} no site e gostaria de saber mais sobre a matrícula.`;

          return (
            <li key={plan.id} className="flex">
              <TimelineContent as="div" animationNum={5 + index} customVariants={revealVariants} className="flex w-full">
                <Card
                  className={cn(
                    "lift relative flex w-full flex-col text-ink",
                    plan.popular
                      ? "border-sky-500 bg-sky-50 shadow-xl shadow-sky-500/15 ring-2 ring-sky-500"
                      : "border-line bg-paper",
                  )}
                >
                  <CardHeader className="text-left">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-display text-3xl font-bold leading-none text-navy-900">{plan.name}</h2>
                      {plan.popular && (
                        <span className="rounded-full bg-navy-900 px-3 py-1 text-sm font-bold text-paper">Mais escolhido</span>
                      )}
                    </div>
                    <p className="font-semibold text-sky-600">{plan.tagline}</p>

                    <div className="flex flex-wrap items-baseline gap-x-2 pt-3">
                      <NumberFlow
                        value={value}
                        locales="pt-BR"
                        format={{ style: "currency", currency: "BRL", maximumFractionDigits: 0 }}
                        className="font-display text-5xl font-bold leading-none text-navy-900"
                      />
                      <span className="font-medium text-ink-soft">
                        {mode === "mes" ? "/mês" : plan.months === 1 ? "por 1 mês" : `por ${plan.months} meses`}
                      </span>
                    </div>
                    <p className="text-sm text-ink-soft">
                      {mode === "total"
                        ? plan.months > 1
                          ? `Equivale a ${brl.format(perMonth)} por mês`
                          : "Pagamento mensal"
                        : plan.months > 1
                          ? `Total de ${brl.format(plan.total)} por ${plan.months} meses`
                          : "Sem fidelidade"}
                      {saving > 0 && ` · ${saving}% menos por mês que o Mensal`}
                    </p>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col pt-0">
                    <div className="mb-6">
                      <LiquidButton href={whatsappLink(cta)} size="lg" className="w-full">
                        Quero esse plano <ArrowRight aria-hidden />
                      </LiquidButton>
                    </div>

                    <ul className="space-y-3 border-t border-line pt-5">
                      {allBenefits.map((b) => {
                        const included = (plan.includes as readonly string[]).includes(b);
                        return (
                          <li key={b} className="flex items-center gap-3">
                            <span
                              className={cn(
                                "grid size-7 shrink-0 place-content-center rounded-full",
                                included ? "bg-sky-100 text-sky-600" : "bg-sky-50 text-ink-soft/60",
                              )}
                            >
                              {included ? <Check className="size-4" aria-hidden /> : <Minus className="size-4" aria-hidden />}
                            </span>
                            <span className={cn("font-medium", included ? "text-ink" : "text-ink-soft/70 line-through")}>
                              {b}
                              <span className="sr-only">{included ? " (incluído)" : " (não incluído)"}</span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    {plansAreExamples && (
                      <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-sky-600">Plano de exemplo</p>
                    )}
                  </CardContent>
                </Card>
              </TimelineContent>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
