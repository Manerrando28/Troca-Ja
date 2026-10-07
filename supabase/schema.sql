-- Catálogo público: executar no SQL Editor antes de seed.sql.
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
on conflict (id) do nothing;

create table if not exists public.products (
  id text primary key default gen_random_uuid()::text,
  -- As contas ainda são locais. Migrar para auth.users quando houver autenticação real.
  owner_id text not null check (owner_id in ('user-1', 'user-2', 'user-3', 'user-4')),
  name text not null check (length(trim(name)) > 0),
  description text not null default '',
  category_id text not null references public.categories(id),
  available_for_trade boolean not null default true,
  image_url text check (image_url is null or image_url ~ '^https://[^[:space:]/]+/.+'),
  created_at timestamptz not null default now(),
  featured boolean not null default false
);
create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_owner_id_idx on public.products(owner_id);
alter table public.products enable row level security;
revoke all on public.products from anon, authenticated;
grant select on public.products to anon, authenticated;
drop policy if exists "Leitura de produtos públicos" on public.products;
create policy "Leitura de produtos públicos" on public.products
  for select to anon, authenticated using (true);
commit;
