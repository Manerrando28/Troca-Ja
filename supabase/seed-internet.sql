-- Produtos de demonstração consultados em https://dummyjson.com/docs/products em 2026-10-07.
-- Fontes individuais: internet-products.json. Fotos hospedadas no CDN da fonte.
-- Mantém os produtos existentes e não sobrescreve edições ao executar novamente.
begin;
insert into public.products (id, owner_id, name, description, category_id, available_for_trade, image_url, featured)
values
  ('demo-dummyjson-99', 'user-1', 'Amazon Echo Plus', 'Caixa de som inteligente com assistente Alexa e controle por voz. Item de demonstração do catálogo público DummyJSON.', 'cat-1', true, 'https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/1.webp', true),
  ('demo-dummyjson-100', 'user-2', 'Apple AirPods', 'Fones de ouvido sem fio da Apple com estojo de carregamento. Item de demonstração do catálogo público DummyJSON.', 'cat-1', true, 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/1.webp', false),
  ('demo-dummyjson-101', 'user-3', 'AirPods Max prata', 'Headphone da Apple com cancelamento de ruído e acabamento prateado. Item de demonstração do catálogo público DummyJSON.', 'cat-1', true, 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/1.webp', true),
  ('demo-dummyjson-121', 'user-4', 'iPhone 5s', 'Smartphone compacto da Apple, um modelo clássico da linha iPhone. Item de demonstração do catálogo público DummyJSON.', 'cat-1', true, 'https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/1.webp', false),
  ('demo-dummyjson-137', 'user-1', 'Bola de futebol americano', 'Bola para praticar passes e recepções de futebol americano. Item de demonstração do catálogo público DummyJSON.', 'cat-4', true, 'https://cdn.dummyjson.com/product-images/sports-accessories/american-football/1.webp', false),
  ('demo-dummyjson-138', 'user-2', 'Bola de beisebol', 'Bola de beisebol para treinos de arremesso e recepção. Item de demonstração do catálogo público DummyJSON.', 'cat-4', true, 'https://cdn.dummyjson.com/product-images/sports-accessories/baseball-ball/1.webp', false),
  ('demo-dummyjson-139', 'user-3', 'Luva de beisebol', 'Luva esportiva para praticar recepções no beisebol. Item de demonstração do catálogo público DummyJSON.', 'cat-4', true, 'https://cdn.dummyjson.com/product-images/sports-accessories/baseball-glove/1.webp', false),
  ('demo-dummyjson-140', 'user-4', 'Bola de basquete', 'Bola de basquete para treinos e partidas entre amigos. Item de demonstração do catálogo público DummyJSON.', 'cat-4', true, 'https://cdn.dummyjson.com/product-images/sports-accessories/basketball/1.webp', true),
  ('demo-dummyjson-159', 'user-1', 'iPad Mini 2021', 'Tablet compacto da Apple na cor Starlight para estudo e entretenimento. Item de demonstração do catálogo público DummyJSON.', 'cat-1', true, 'https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/1.webp', true),
  ('demo-dummyjson-160', 'user-2', 'Samsung Galaxy Tab S8 Plus', 'Tablet Android da Samsung na cor cinza, com suporte à S Pen. Item de demonstração do catálogo público DummyJSON.', 'cat-1', true, 'https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/1.webp', false),
  ('demo-dummyjson-78', 'user-3', 'MacBook Pro 14 polegadas', 'Notebook da Apple em cinza espacial, com processador M1 Pro. Item de demonstração do catálogo público DummyJSON.', 'cat-1', true, 'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/1.webp', true),
  ('demo-dummyjson-79', 'user-4', 'Asus Zenbook Pro Duo', 'Notebook da Asus com duas telas, voltado a criação e produtividade. Item de demonstração do catálogo público DummyJSON.', 'cat-1', true, 'https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/1.webp', false)
on conflict (id) do nothing;
commit;
