-- SAPIENS: todo professor é administrador (novembro de 2026).
-- Aplique no Supabase: SQL Editor > New query > cole tudo > Run. Pode rodar mais de uma vez.
--
-- O site passa a ter só dois papéis na prática: 'aluno' e 'admin' (mostrado como "Professor").
-- O valor 'professor' continua existindo no banco por compatibilidade, mas vale o mesmo que 'admin'.

-- 1. Quem já era professor vira admin.
update public.profiles set role = 'admin' where role = 'professor';

-- 2. Por segurança, 'professor' passa a ter as mesmas permissões de 'admin' nas policies.
create or replace function public.has_role(r public.app_role)
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((
    select case
      when r = 'admin' then role in ('admin', 'professor')
      else role = r
    end
    from public.profiles where id = auth.uid()
  ), false)
$$;
