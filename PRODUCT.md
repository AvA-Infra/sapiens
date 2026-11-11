# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router) + TypeScript, Tailwind CSS v4, Framer Motion, Supabase (Auth, Postgres, Storage), Zod. Deploy na Vercel.

## Users

- Estudantes de ensino médio e pré-vestibular em Campos dos Goytacazes - RJ e região, e seus responsáveis, que decidem matrícula.
- Alunos matriculados (área logada: aulas, progresso, materiais).
- Professores e administração da Sapiens (painéis de conteúdo e gestão).

## Product Purpose

SAPIENS é o Curso de Biomédicas: preparatório presencial para Medicina, carreiras da saúde e ENEM (Av. Vinte e Oito de Março, 574, Centro, dentro do Shopping Avenida 28) que ganha uma plataforma digital: site institucional para atrair matrículas e área do aluno com videoaulas e acompanhamento. Sucesso = mais contatos/matrículas pelo WhatsApp e alunos que realmente usam as aulas online.

## Positioning

Curso local e acolhedor, agora também online. Empresa de empreendedoras que acolhe a comunidade LGBTQ+ de forma natural, sem transformar isso em bandeira de marketing. Avaliação 5,0 no Google.

## Operating Context

Público chega pelo celular (Instagram, Google). Conversão principal: WhatsApp (22) 99792-5771. Área logada usada de forma recorrente por alunos e professores pouco técnicos.

## Capabilities and Constraints

- Pagamentos fora do escopo inicial; arquitetura preparada (products/orders/enrollments, interface PaymentProvider).
- Vídeos privados via URL assinada; provedor abstraído (Bunny, Mux ou Cloudflare Stream).
- RBAC (admin, professor, aluno) no servidor e com RLS no Supabase. LGPD aplicável.
- Horários, números, fotos, professores, aprovados e depoimentos ainda não foram fornecidos.

## Evidence on Hand

Endereço, telefone, Instagram, nota 5,0 no Google, a logo oficial (public/marca) e 181 aprovações publicadas no Instagram da escola (src/config/approved-data.ts). Nada de resultados de aprovação, depoimentos, nomes ou números pode ser inventado: usar `[PREENCHER]` até a escola informar.

## Product Principles

- Nunca inventar dados reais, aprovados ou depoimentos.
- Copy direta e específica de vestibular; nada de jargão genérico de "inovação".
- Mobile first, acessível (AA) e rápido.
- Identidade derivada da logo (cérebro neon, DNA, azul profundo e ciano); ver `docs/brand.md`.
