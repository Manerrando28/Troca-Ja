import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchCategories, fetchProducts, fetchCatalog } from '../src/services/catalog.ts';

const url = 'https://example.supabase.co';
const row = { id: 'remote-1', owner_id: 'user-2', name: 'Produto remoto', description: 'Descrição',
  category_id: 'cat-1', available_for_trade: true, image_url: null, created_at: '2026-10-07T12:00:00Z', featured: false };
function mockPages(t, tables) {
  return t.mock.method(globalThis, 'fetch', async input => {
    const request = new URL(input);
    const rows = tables[request.pathname.split('/').at(-1)] ?? [];
    const offset = Number(request.searchParams.get('offset'));
    return new Response(JSON.stringify(rows.slice(offset, offset + 2)));
  });
}

test('consulta REST usa chave pública e valida resposta do catálogo', async t => {
  const rows = [{ id: 'cat-1', name: 'Eletrônicos' }];
  const mock = t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.match(url, /^https:\/\/example.supabase.co\/rest\/v1\/categories\?select=id,name&order=id&limit=100&offset=/);
    assert.equal(options.headers.apikey, 'public-test-key');
    return new Response(JSON.stringify(url.endsWith('offset=0') ? rows : []));
  });
  assert.deepEqual(await fetchCategories('https://example.supabase.co', 'public-test-key'), rows);
  assert.equal(mock.mock.callCount(), 2);
});
test('falhas HTTP e formato inválido são propagados; lista vazia é válida', async t => {
  const mock = t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 403 }));
  await assert.rejects(fetchCategories('https://example.supabase.co', 'test'), /HTTP 403/);
  for (const payload of [{}, [null], [{ id: 123, name: 'Jogos' }], [{ id: 'cat-1', name: '' }]]) {
    mock.mock.mockImplementation(async input => new Response(JSON.stringify(input.endsWith('offset=0') ? payload : [])));
    await assert.rejects(fetchCategories('https://example.supabase.co', 'test'), /formato inválido/);
  }
  await assert.rejects(fetchCategories('https://wrong.example', 'test'), /URL/);
  mock.mock.mockImplementation(async () => new Response('[]'));
  assert.deepEqual(await fetchCategories(url, 'test'), []);
  await assert.rejects(fetchCategories(url, ''), /chave pública/);
});

test('mapeia campos remotos, fotos, disponibilidade e produtos novos sem depender dos mocks', async t => {
  mockPages(t, { products: [row, { ...row, id: 'remote-2', available_for_trade: false,
    image_url: 'https://example.supabase.co/storage/v1/object/public/product-images/foto.jpg' }] });
  const products = await fetchProducts(`${url}/`, 'test');
  assert.deepEqual(products[0], { id: 'remote-1', ownerId: 'user-2', name: 'Produto remoto', description: 'Descrição',
    categoryId: 'cat-1', availableForTrade: true, image: null, createdAt: row.created_at, featured: false });
  assert.equal(products[1].availableForTrade, false);
  assert.equal(products[1].image.uri, 'https://example.supabase.co/storage/v1/object/public/product-images/foto.jpg');
});

test('busca todas as páginas mesmo se o limite do servidor for menor', async t => {
  const rows = Array.from({ length: 5 }, (_, index) => ({ ...row, id: `remote-${index}` }));
  const mock = mockPages(t, { products: rows });
  assert.equal((await fetchProducts(url, 'test')).length, 5);
  assert.deepEqual(mock.mock.calls.map(call => new URL(call.arguments[0]).searchParams.get('offset')), ['0', '2', '4', '5']);
});

test('rejeita campos inválidos em produtos antes de entregar às telas', async t => {
  const mock = mockPages(t, {});
  for (const invalid of [{ id: '' }, { owner_id: null }, { name: ' ' }, { category_id: '' }, { description: null },
    { available_for_trade: 'true' }, { featured: 1 }, { created_at: 'ontem' },
    { image_url: 'C:/foto.jpg' }, { image_url: '' }, { image_url: undefined }]) {
    mock.mock.mockImplementation(async input => new Response(JSON.stringify(input.endsWith('offset=0') ? [{ ...row, ...invalid }] : [])));
    await assert.rejects(fetchProducts(url, 'test'), /formato inválido/);
  }
});

test('catálogo valida relacionamentos e aceita banco vazio sem inserir mocks', async t => {
  const tables = { categories: [{ id: 'cat-1', name: 'Eletrônicos' }], products: [row] };
  mockPages(t, tables);
  assert.equal((await fetchCatalog(url, 'test', ['user-2'])).products[0].id, 'remote-1');
  await assert.rejects(fetchCatalog(url, 'test', ['user-1']), /proprietário desconhecido/);
  tables.categories = [];
  await assert.rejects(fetchCatalog(url, 'test', ['user-2']), /categorias ausentes/);
  tables.products = [];
  assert.deepEqual(await fetchCatalog(url, 'test', ['user-2']), { categories: [], products: [] });
});

test('falha em products impede sucesso parcial só com categories', async t => {
  t.mock.method(globalThis, 'fetch', async input => new Response(input.includes('/products?') ? '' : '[]', {
    status: input.includes('/products?') ? 403 : 200,
  }));
  await assert.rejects(fetchCatalog(url, 'test', ['user-2']), /products \(HTTP 403\)/);
});
test('falha de rede é propagada para o estado de erro', async t => {
  t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('offline'); });
  await assert.rejects(fetchCategories('https://example.supabase.co', 'test'), /offline/);
});

test('repassa AbortSignal à consulta para permitir timeout e desmontagem', async t => {
  const controller = new AbortController();
  controller.abort();
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    assert.equal(options.signal, controller.signal);
    options.signal.throwIfAborted();
  });
  await assert.rejects(fetchCategories('https://example.supabase.co', 'test', controller.signal), { name: 'AbortError' });
});
