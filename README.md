# SAPIENS Biomédicas

Site e plataforma de aulas do curso SAPIENS (Campos dos Goytacazes - RJ): páginas públicas, área do aluno com player de aulas, painel do professor e painel admin.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · Framer Motion · Supabase (Auth, Postgres, Storage) · Zod · Lucide.

## Rodar localmente

Requer [Node 20+](https://nodejs.org) e [Git](https://git-scm.com).

```bash
git clone <link-do-repositório>
cd <pasta-do-repositório>
npm install
cp .env.example .env.local   # no PowerShell: Copy-Item .env.example .env.local
npm run dev                  # http://localhost:3000
```

Depois de copiar, preencha o `.env.local` (tabela abaixo). Os valores **não ficam no repositório**: peça ao sócio por um canal seguro (gerenciador de senhas, nunca por e-mail ou chat aberto) ou copie do painel do Supabase em **Project Settings > API**. Para só ver o site público rodando bastam as três variáveis `NEXT_PUBLIC_*` do início do arquivo.

### Fluxo de trabalho a dois

```bash
git pull                     # antes de começar, traga o que o outro fez
# ...edite...
git add -A
git commit -m "descreva a mudança"
git push
```

Antes de dar push, rode `npm run lint` e `npm run typecheck`.

Scripts: `npm run dev` · `npm run build` · `npm start` · `npm run lint` · `npm run typecheck`.

> Se o CSS ou o layout parecerem desatualizados em desenvolvimento, pare o servidor, apague a pasta `.next` e rode `npm run dev` de novo.

## Variáveis de ambiente (`.env.local`)

Nunca commite o `.env.local`. O `.env.example` fica **sem valores**.

| Variável | Onde | Para quê |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | público | Endereço do site (SEO, e-mails de confirmação) |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | público | Conexão com o Supabase (a chave anon é pública por desenho; quem protege é o RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | **só servidor** | Grava mensagens de contato e lista e-mails no admin. Ignora o RLS: nunca exponha |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | só servidor | Limite de tentativas compartilhado. Sem elas usa memória local (só serve em desenvolvimento) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | público / servidor | Anti-robô do formulário de contato (opcional; sem elas só o honeypot e o tempo mínimo agem) |
| `VIDEO_PROVIDER`, `BUNNY_STREAM_LIBRARY_ID`, `BUNNY_STREAM_TOKEN_KEY` | só servidor | URLs assinadas e expiráveis do Bunny Stream |
| `PAYMENT_PROVIDER`, `PAYMENT_WEBHOOK_SECRET` | só servidor | Pagamentos (ainda não ativos) |

## Conteúdo editável

Tudo que falta informar está marcado com `[PREENCHER]`.

- `src/config/site.ts`: telefone, endereço, **horários**, e-mail, anos de curso.
- `src/config/content.ts`: professores, turmas, depoimentos, fotos do espaço.
- `src/config/plans.ts`: planos e preços da aba **Planos** (hoje são **exemplos fictícios**; a página fica `noindex` até a escola definir os reais).
- `src/config/approved-data.ts`: aprovações (geradas do Instagram da escola; revise antes de publicar).
- `docs/brand.md`: identidade visual (cores, tema claro/escuro, fontes, logo, navegação, tom de voz).

## Banco de dados (Supabase)

1. Crie um projeto no [Supabase](https://supabase.com).
2. No **SQL Editor**, rode `supabase/migrations/0001_init.sql`. Isso cria as tabelas, o RLS e o bucket privado `materials`.
3. Crie sua conta em `/cadastrar` e torne-se admin (troque o e-mail):
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'seu@email.com');
   ```
4. Em **Authentication > URL Configuration**, defina o *Site URL* e os *Redirect URLs* com o domínio final.
5. (Opcional) `supabase/seed.sql` cria um curso de exemplo.

### Papéis e acesso

`aluno` (padrão ao cadastrar) · `professor` (painel de conteúdo) · `admin` (usuários, turmas, matrículas).

- O papel é checado **no servidor** (`requireRole`, em `src/lib/auth.ts`) e **no banco** (RLS). Ninguém se promove pelo navegador: a policy de `profiles` trava a coluna `role`.
- O aluno só vê aulas **publicadas** de cursos em que tem **matrícula ativa**. Isso vale para vídeos, materiais e dúvidas.
- `/aluno`, `/professor` e `/admin` exigem login (`src/proxy.ts`).

## Vídeos

O banco guarda só o `video_id`. A página da aula gera, no servidor, uma URL de embed **assinada e com validade de 4 horas** (`src/lib/video`). Não existe link público fixo.

Bunny Stream: ative *Embed view token authentication* na biblioteca e copie o *Token authentication key*. Para outro provedor (Mux, Cloudflare Stream), implemente `VideoProvider` em `src/lib/video/index.ts`.

## Materiais (PDF)

Enviados pelo painel do professor, direto do navegador para o bucket privado `materials` (até 25 MB). Os alunos recebem um link assinado válido por 1 hora.

## Pagamentos (preparado, não ativo)

As tabelas `products` e `orders` existem. A interface `PaymentProvider` (`src/lib/payments/types.ts`) e as rotas `/api/checkout` e `/api/webhooks/payment` são stubs: o webhook já lê o corpo cru e exige assinatura válida. Para ativar, implemente um provedor, registre-o em `src/lib/payments/index.ts` e defina `PAYMENT_PROVIDER` e `PAYMENT_WEBHOOK_SECRET`.

## Segurança

- **Cabeçalhos** (em `next.config.ts`): CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`.
  - *Limitação da CSP:* usa `'unsafe-inline'` em `script-src`, porque o Next injeta scripts inline e CSP com nonce forçaria todas as páginas a serem renderizadas a cada acesso (perdendo o desempenho estático). Todo o resto é restrito (frames, imagens e conexões por origem; sem `eval` em produção).
  - Ao adicionar um serviço externo (outro vídeo, analytics), inclua a origem na CSP.
- **Validação:** Zod em todos os formulários, rotas e ações do servidor.
- **Limite de tentativas:** login, cadastro, contato, comentários e checkout (`src/lib/ratelimit.ts`; Upstash em produção).
- **Anti-spam:** honeypot, tempo mínimo de preenchimento e Cloudflare Turnstile (opcional).
- **LGPD:** páginas de privacidade e termos (**rascunhos para revisão jurídica**), aviso de cookies e consentimento nos formulários.
- Mensagens de erro de login não revelam se o e-mail existe; `?next=` só aceita caminhos internos.

## Deploy na Vercel

1. Suba o projeto para um repositório e importe na Vercel (framework: Next.js).
2. Cadastre as variáveis de ambiente (Production e Preview). `SUPABASE_SERVICE_ROLE_KEY` e demais segredos só como variáveis do servidor.
3. Defina `NEXT_PUBLIC_SITE_URL` com o domínio final e configure o domínio.
4. No Supabase, ajuste *Site URL* e *Redirect URLs*.
5. Crie a conta da Upstash (plano gratuito basta) e defina `UPSTASH_REDIS_REST_*`.
6. Antes de publicar: preencha os `[PREENCHER]`, revise privacidade/termos com um advogado e confirme a autorização para exibir nomes e fotos de alunos aprovados.

## Estrutura

```
src/
  app/(public)/         site público: navbar flutuante no topo, fundo branco, rodapé
  app/(app)/            áreas logadas (aluno, professor, admin): sidebar fixa à esquerda
  app/api/              contato, checkout (stub), webhooks/payment (stub)
  components/           brand, hero, layout, player, panel, ui
  config/               site, content, approved-data, nav
  lib/                  auth, supabase, video, payments, ratelimit, schemas, ações do servidor
  proxy.ts              sessão e proteção de rotas
supabase/               migrations e seed
docs/brand.md           guia de marca
```
