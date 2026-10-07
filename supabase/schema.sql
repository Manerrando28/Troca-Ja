-- CP5: catálogo público de categorias. Executar no SQL Editor do projeto Supabase.
begin;
create table if not exists public.categories (
  id text primary key,
  name text not null check (length(trim(name)) > 0)
);
alter table public.categories enable row level security;
revoke all on public.categories from anon, authenticated;
grant select on public.categories to anon, authenticated;
drop policy if exists "Leitura do catálogo público" on public.categories;
create policy "Leitura do catálogo público" on public.categories
  for select to anon, authenticated using (true);
insert into public.categories (id, name) values
  ('cat-1', 'Eletrônicos'), ('cat-2', 'Jogos'), ('cat-3', 'Livros'), ('cat-4', 'Esportes')
on conflict (id) do update set name = excluded.name;
commit;
