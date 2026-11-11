-- Dados de EXEMPLO para testar a área do aluno. Não use em produção com dados reais de alunos.
-- Rode depois de 0001_init.sql e de criar sua conta no site. Troque o e-mail abaixo.

with u as (select id from auth.users where email = 'seu@email.com'),
c as (
  insert into public.courses (slug, title, description, published)
  values ('exemplo-biomedicas', 'Curso de exemplo', 'Curso de teste: apague depois.', true)
  on conflict (slug) do update set title = excluded.title
  returning id
),
m as (
  insert into public.modules (course_id, title, position)
  select id, 'Módulo 1: Introdução', 1 from c
  returning id
),
l as (
  insert into public.lessons (module_id, title, description, position, published)
  select id, 'Aula 1 de exemplo', 'Troque o video_id por um vídeo real do seu provedor.', 1, true from m
  returning id
)
insert into public.enrollments (user_id, course_id, status)
select u.id, c.id, 'ativa' from u, c
on conflict (user_id, course_id) do nothing;
