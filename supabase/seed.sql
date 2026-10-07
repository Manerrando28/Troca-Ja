-- Importa os oito produtos existentes. Execute DEPOIS de schema.sql.
-- Pode executar novamente: IDs existentes são preservados, sem sobrescrever suas edições.
-- As fotos são enviadas separadamente ao Storage; veja docs/SUPABASE.md.
begin;
insert into public.products
  (id, owner_id, name, description, category_id, available_for_trade, image_url, created_at, featured)
values
  ('prod-1', 'user-1', 'Nintendo Switch', 'Console em ótimo estado, acompanha dois jogos.',
    'cat-2', true, null, '2026-08-28T08:00:00.000Z', true),
  ('prod-2', 'user-1', 'Câmera Fujifilm X-T30', 'Câmera mirrorless, pouco uso, com carregador.',
    'cat-1', true, null, '2026-08-27T14:00:00.000Z', false),
  ('prod-3', 'user-4', 'Livros de Clean Code', 'Clean Code + The Pragmatic Programmer, ambos em inglês.',
    'cat-3', true, null, '2026-08-25T10:00:00.000Z', false),
  ('prod-4', 'user-2', 'PS5', 'PlayStation 5 com dois controles e 3 jogos.',
    'cat-2', true, null, now(), true),
  ('prod-5', 'user-2', 'Headset Sony WH-1000XM5', 'Fone com cancelamento de ruído, usado por 6 meses.',
    'cat-1', true, null, '2026-08-26T16:00:00.000Z', true),
  ('prod-6', 'user-3', 'Bike Speed Trek', 'Bicicleta speed aro 700, tamanho M, 11 marchas.',
    'cat-4', true, null, now(), false),
  ('prod-7', 'user-3', 'iPad Pro 11"', 'iPad Pro 11 polegadas com Apple Pencil 2ª geração.',
    'cat-1', true, null, '2026-08-27T18:00:00.000Z', true),
  ('prod-8', 'user-3', 'Tênis de Corrida Nike', 'Nike Air Zoom Pegasus 40, tamanho 41, usado 3x.',
    'cat-4', false, null, '2026-08-24T12:00:00.000Z', false)
on conflict (id) do nothing;
commit;
