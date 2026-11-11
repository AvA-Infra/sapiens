-- SAPIENS Biomédicas: schema inicial (Fase 3).
-- Aplique no Supabase: SQL Editor > New query > cole tudo > Run. (Ou `supabase db push`.)
--
-- Princípios (mesmos do GabaritaHub):
--  * RLS ligado em TODAS as tabelas. Sem policy = ninguém acessa pelo navegador.
--  * Papéis (aluno/professor/admin) só mudam por admin ou direto no painel do Supabase.
--    Ninguém consegue se promover pelo navegador, mesmo chamando a API diretamente.
--  * Escritas sensíveis (mensagens de contato, pedidos) só pela service_role, no servidor.
--
-- Para virar o primeiro admin, depois de criar sua conta no site, rode (troque o e-mail):
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'seu@email.com');

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- tipos
do $$ begin
  create type public.app_role as enum ('aluno', 'professor', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.enrollment_status as enum ('pendente', 'ativa', 'cancelada');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------- perfis
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null default '',
  role public.app_role not null default 'aluno',
  created_at timestamptz not null default now()
);

-- Funções auxiliares. SECURITY DEFINER para consultar profiles sem recursão de RLS.
create or replace function public.current_user_role()
returns public.app_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.has_role(r public.app_role)
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select role = r from public.profiles where id = auth.uid()), false)
$$;

create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('professor', 'admin') from public.profiles where id = auth.uid()), false)
$$;

-- Cria o perfil automaticamente quando alguém se cadastra. Sempre como 'aluno'.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nome, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nome', ''), 'aluno');
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

create policy "profiles: ler o próprio ou staff"
  on public.profiles for select
  using (id = auth.uid() or public.is_staff());

-- Pode editar o próprio nome, mas NÃO o papel (with check trava o role no valor atual).
create policy "profiles: atualizar o próprio sem mudar papel"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = public.current_user_role());

create policy "profiles: admin atualiza qualquer um"
  on public.profiles for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

-- ---------------------------------------------------------------- turmas e cursos
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  thumbnail_url text,
  published boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  position int not null default 0
);
create index if not exists modules_course_idx on public.modules (course_id, position);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  title text not null,
  description text,
  position int not null default 0,
  -- Vídeo: guarde só o ID do provedor (Bunny/Mux/Cloudflare). A URL assinada é gerada no servidor.
  video_id text,
  video_url text,
  duration_seconds int,
  published boolean not null default false
);
create index if not exists lessons_module_idx on public.lessons (module_id, position);

create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  title text not null,
  -- Caminho no bucket privado "materials" (ex.: "curso-x/aula-1.pdf")
  file_path text not null
);
create index if not exists materials_lesson_idx on public.materials (lesson_id);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  class_id uuid references public.classes (id) on delete set null,
  status public.enrollment_status not null default 'ativa',
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create table if not exists public.lesson_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  last_position_seconds int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  parent_id uuid references public.comments (id) on delete cascade,
  -- Nome do autor gravado no envio (alunos não leem profiles uns dos outros pelo RLS).
  author_name text not null default '',
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists comments_lesson_idx on public.comments (lesson_id, created_at);

-- ---------------------------------------------------------------- acesso
create or replace function public.is_enrolled(course uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.enrollments
    where user_id = auth.uid() and course_id = course and status = 'ativa'
  )
$$;

-- Pode ver a aula: staff, ou aluno matriculado em aula publicada.
create or replace function public.can_view_lesson(lesson uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_staff() or exists (
    select 1
    from public.lessons l
    join public.modules m on m.id = l.module_id
    where l.id = lesson and l.published and public.is_enrolled(m.course_id)
  )
$$;

alter table public.classes enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.materials enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.comments enable row level security;

-- classes: staff vê; só admin altera
create policy "classes: staff lê" on public.classes for select using (public.is_staff());
create policy "classes: admin altera" on public.classes for all
  using (public.has_role('admin')) with check (public.has_role('admin'));

-- courses: staff vê/edita; aluno vê os cursos em que está matriculado
create policy "courses: ver" on public.courses for select
  using (public.is_staff() or public.is_enrolled(id));
create policy "courses: staff altera" on public.courses for all
  using (public.is_staff()) with check (public.is_staff());

create policy "modules: ver" on public.modules for select
  using (public.is_staff() or public.is_enrolled(course_id));
create policy "modules: staff altera" on public.modules for all
  using (public.is_staff()) with check (public.is_staff());

create policy "lessons: ver" on public.lessons for select
  using (
    public.is_staff()
    or (published and public.is_enrolled((select course_id from public.modules m where m.id = module_id)))
  );
create policy "lessons: staff altera" on public.lessons for all
  using (public.is_staff()) with check (public.is_staff());

create policy "materials: ver" on public.materials for select using (public.can_view_lesson(lesson_id));
create policy "materials: staff altera" on public.materials for all
  using (public.is_staff()) with check (public.is_staff());

-- enrollments: aluno vê as próprias; só admin cria/altera (painel admin, Fase 4)
create policy "enrollments: ver as próprias ou staff" on public.enrollments for select
  using (user_id = auth.uid() or public.is_staff());
create policy "enrollments: admin altera" on public.enrollments for all
  using (public.has_role('admin')) with check (public.has_role('admin'));

-- progresso: cada aluno só mexe no próprio, e só em aula que pode ver
create policy "progress: ver o próprio ou staff" on public.lesson_progress for select
  using (user_id = auth.uid() or public.is_staff());
create policy "progress: inserir o próprio" on public.lesson_progress for insert
  with check (user_id = auth.uid() and public.can_view_lesson(lesson_id));
create policy "progress: atualizar o próprio" on public.lesson_progress for update
  using (user_id = auth.uid()) with check (user_id = auth.uid() and public.can_view_lesson(lesson_id));

-- comentários: quem vê a aula lê e comenta; autor ou staff apaga
create policy "comments: ver" on public.comments for select using (public.can_view_lesson(lesson_id));
create policy "comments: inserir como si mesmo" on public.comments for insert
  with check (user_id = auth.uid() and public.can_view_lesson(lesson_id));
create policy "comments: apagar o próprio ou staff" on public.comments for delete
  using (user_id = auth.uid() or public.is_staff());

-- ---------------------------------------------------------------- contato e interesse
-- Sem policy de insert: só a service_role (rota /api/contato no servidor) grava.
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  consent_at timestamptz not null,
  created_at timestamptz not null default now()
);
create table if not exists public.interest_list (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  class_id uuid references public.classes (id) on delete set null,
  consent_at timestamptz not null,
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
alter table public.interest_list enable row level security;
create policy "contato: admin lê" on public.contact_messages for select using (public.has_role('admin'));
create policy "interesse: admin lê" on public.interest_list for select using (public.has_role('admin'));

-- ---------------------------------------------------------------- pagamentos (estrutura, sem integração)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses (id) on delete set null,
  name text not null,
  price_cents int not null check (price_cents >= 0),
  active boolean not null default true
);
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete restrict,
  product_id uuid not null references public.products (id) on delete restrict,
  status text not null default 'pendente',
  provider text,
  provider_ref text,
  amount_cents int not null,
  created_at timestamptz not null default now()
);
alter table public.products enable row level security;
alter table public.orders enable row level security;
create policy "products: ver ativos" on public.products for select using (active or public.has_role('admin'));
create policy "products: admin altera" on public.products for all
  using (public.has_role('admin')) with check (public.has_role('admin'));
create policy "orders: ver os próprios ou admin" on public.orders for select
  using (user_id = auth.uid() or public.has_role('admin'));
-- Pedidos só são criados/atualizados pela service_role (checkout e webhook no servidor).

-- ---------------------------------------------------------------- storage (materiais em PDF)
insert into storage.buckets (id, name, public)
values ('materials', 'materials', false)
on conflict (id) do nothing;

create policy "materials storage: aluno matriculado lê"
  on storage.objects for select
  using (
    bucket_id = 'materials'
    and exists (
      select 1 from public.materials mt
      where mt.file_path = storage.objects.name and public.can_view_lesson(mt.lesson_id)
    )
  );
create policy "materials storage: staff envia"
  on storage.objects for insert
  with check (bucket_id = 'materials' and public.is_staff());
create policy "materials storage: staff altera"
  on storage.objects for update
  using (bucket_id = 'materials' and public.is_staff());
create policy "materials storage: staff apaga"
  on storage.objects for delete
  using (bucket_id = 'materials' and public.is_staff());
