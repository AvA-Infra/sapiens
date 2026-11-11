import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const colors = [
  { name: "navy-950", hex: "#000d33", use: "Fundos mais profundos, rodapé" },
  { name: "navy-900", hex: "#001650", use: "Cor base da logo: fundos, títulos, botão primário" },
  { name: "navy-800", hex: "#032a6b", use: "Superfícies sobre navy" },
  { name: "navy-700", hex: "#044e95", use: "Azul médio da logo; hover do botão primário" },
  { name: "sky-600", hex: "#0a68a8", use: "Links e texto de destaque sobre branco (AA)" },
  { name: "sky-500", hex: "#1b9be0", use: "Ícones, foco, elementos de UI" },
  { name: "sky-400", hex: "#4fd8ff", use: "Ciano neon: destaque sobre navy, botão onDark" },
  { name: "sky-200", hex: "#b5f3ff", use: "Texto secundário sobre navy" },
  { name: "sky-100", hex: "#dff8ff", use: "Fundos de seção suaves" },
  { name: "sky-50", hex: "#f0fcff", use: "Hover e áreas de apoio" },
  { name: "ink", hex: "#0b1a33", use: "Texto principal" },
  { name: "ink-soft", hex: "#425576", use: "Texto secundário" },
  { name: "line", hex: "#d3e6f2", use: "Bordas e divisórias" },
];

export default function DesignSystemPage() {
  // Página interna de referência: não existe em produção.
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
      <header className="mb-14 border-b border-line pb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">Interno</p>
        <h1 className="mt-2 text-5xl font-bold text-navy-900 sm:text-6xl">Design system SAPIENS Biomédicas</h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Referência viva dos tokens e componentes. Regras completas em <code>docs/brand.md</code>.
        </p>
      </header>

      <section aria-labelledby="logo" className="mb-16">
        <h2 id="logo" className="mb-6 text-3xl font-bold text-navy-900">Logo</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid place-items-center rounded-card bg-navy-900 p-10">
            <Logo size="lg" />
          </div>
          <div className="grid place-items-center rounded-card border border-line p-10">
            <LogoMark float className="h-28" title="Símbolo SAPIENS, cérebro" />
          </div>
        </div>
      </section>

      <section aria-labelledby="cores" className="mb-16">
        <h2 id="cores" className="mb-6 text-2xl font-bold text-navy-900">Cores</h2>
        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {colors.map((c) => (
            <li key={c.name} className="flex items-center gap-4 border-b border-line pb-3">
              <span
                className="size-11 shrink-0 rounded-lg border border-line"
                style={{ background: c.hex }}
                aria-hidden
              />
              <span>
                <span className="block font-semibold text-navy-900">
                  {c.name} <span className="font-normal text-ink-soft">{c.hex}</span>
                </span>
                <span className="block text-sm text-ink-soft">{c.use}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tipo" className="mb-16">
        <h2 id="tipo" className="mb-6 text-2xl font-bold text-navy-900">Tipografia</h2>
        <p className="text-sm text-ink-soft">Display: Barlow Condensed (caixa alta nos títulos de destaque)</p>
        <p className="font-display text-6xl font-bold text-navy-900">A VAGA NA ÁREA DA SAÚDE COMEÇA AQUI.</p>
        <p className="mt-6 text-sm text-ink-soft">Texto: Source Sans 3</p>
        <p className="max-w-prose">
          Texto de leitura em 17 px, entrelinha 1,6, até 65 caracteres por linha.
        </p>
      </section>

      <section aria-labelledby="botoes">
        <h2 id="botoes" className="mb-6 text-2xl font-bold text-navy-900">Botões</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 rounded-card bg-navy-900 p-6">
          <Button variant="accent">Sobre navy</Button>
        </div>
      </section>
    </main>
  );
}
