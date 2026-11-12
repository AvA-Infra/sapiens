# Guia de marca: SAPIENS Biomédicas

## Conceito
Um curso acolhedor e sério da área da saúde. A identidade usa a **logo oficial** (cérebro em neon ciano) com um site **branco e limpo**, em que o azul-marinho e o ciano aparecem só como destaque: títulos, botões, ícones e bordas.

## Cores
Branco é a cor dominante (fundo principal). Azul-escuro e azul-claro **nunca** preenchem uma seção inteira.

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `paper` | #ffffff | #050f2c | Fundo principal |
| `navy-900` | #001650 | #f2f8ff | Títulos e botão forte (texto/botão) |
| `navy-700` | #044e95 | #bcdcff | Hover do botão forte |
| `sky-600` | #0a68a8 | #4fd8ff | Links e texto de destaque (AA) |
| `sky-500` | #1b9be0 | #5ac8ff | Ícones, bordas de destaque |
| `sky-400` | #4fd8ff | #4fd8ff | Ciano neon da logo (selos, foco) |
| `sky-100` / `sky-50` | #dff8ff / #f0fcff | #0f2a63 / #0a1f4d | Chips e faixas suaves |
| `ink` / `ink-soft` | #0b1a33 / #425576 | #e6eefc / #a9bde0 | Texto de leitura e secundário |
| `line` | #d3e6f2 | #1c3270 | Bordas |

### Tema claro e escuro
- Padrão: **segue o sistema operacional** (claro ou escuro). O botão sol/lua na navbar e na sidebar fixa uma escolha manual, guardada no `localStorage` (`sapiens-theme`). Tudo é aplicado por um script no `<head>`, antes da primeira pintura (sem "flash").
- O tema escuro é a **mesma paleta com o peso invertido**: `paper` e `navy-900` trocam de lugar. Por isso `bg-paper` + `text-navy-900` e `bg-navy-900` + `text-paper` funcionam nos dois temas sem código extra. Use `dark:` apenas em exceções.
- A classe `dark` fica no `<html>`, posta pelo script conforme o sistema ou a escolha manual.
- **Exceção única ao "azul nunca preenche uma seção":** a faixa de números da home usa azul-marinho (`Section tone="deep"`, tokens `deep` / `on-deep`). Não repita em outras seções.
- Cartões usam `bg-surface` com `shadow-card` (repouso) ou `shadow-pop` (destaque). As sombras são tingidas de azul-marinho, nunca cinza.
- Contraste AA verificado no tema claro (Lighthouse: acessibilidade 100). No escuro, os pares de tokens têm contraste acima de 9:1.

## Tipografia
- **Títulos:** Barlow Condensed (500 a 700). Grotesca estreita, na mesma linha do "SAPIENS" da logo oficial. Sempre em caixa normal, tamanhos grandes e entrelinha curta (1,02). Substituiu a Baloo 2 em novembro de 2026.
- **Rótulos de seção** (`Eyebrow`): caixa normal, com um traço ciano à esquerda. Sem caixa alta com espaçamento largo.
- **Texto:** Figtree. Corpo em 17 px, entrelinha 1,6.
- Via `next/font`: `--font-display-face` e `--font-body`.

## Logo
- Arquivo: `public/marca/cerebro-2x.png` (cérebro com fundo transparente, recortado no tamanho do cérebro), servido em 1x e 2x pelo Next. Fonte original com fundo: `public/marca/logo-sapiens-biomedicas.png`.
- Componentes: `LogoMark` (só o cérebro) e `Logo` (cérebro + "SAPIENS / Curso de Biomédicas" em texto), em `src/components/brand/Logo.tsx`.
- O cérebro tem drop-shadow azul, flutua suavemente e usa uma máscara oval que esmaece as bordas retas do PNG.
- Largura mínima: cérebro 32 px; logo completa 150 px.

## Navegação
- **Antes do login:** navbar flutuante no topo (cantos arredondados, com respiro das bordas). Encolhe ao rolar para baixo e volta ao normal ao rolar para cima ou no topo. Abaixo de 1280 px vira botão de menu com gaveta.
- **Depois do login** (`/aluno`, `/professor`, `/admin`): sidebar fixa colada à esquerda, reta, sempre visível a partir de 1024 px, com os links conforme o papel. Abaixo disso, barra fina com gaveta.

## Botões e movimento
- Botões grandes (mínimo de 48 px), com ícone, e microanimação de hover e clique. O botão principal do hero e dos planos usa o **vidro líquido** (`LiquidButton`); não use em mais lugares (o filtro é pesado).
- Entrada ao rolar em CSS puro (`.reveal`, scroll-driven animations), hover elevando cartões e troca de página com a View Transitions API. Tudo respeita `prefers-reduced-motion`.
- O WhatsApp usa o verde próprio (`bg-whatsapp`) só no botão flutuante e no agendamento de visita.

## Tom de voz
Direto, humano e específico: Medicina, nota de corte, redação, simulado, aprovação. Sem "soluções inovadoras".
- Sim: "A vaga na área da saúde começa em Campos."
- Nunca prometer aprovação nem usar resultados que a escola não possa comprovar.
- A comunidade LGBTQ+ é acolhida de forma natural e discreta (seção Sobre).
- Português do Brasil, sem emojis como ícones.
