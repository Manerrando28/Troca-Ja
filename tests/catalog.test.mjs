import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchCategories } from '../src/services/catalog.ts';

test('consulta REST usa chave pública e valida resposta do catálogo', async t => {
  const rows = [{ id: 'cat-1', name: 'Eletrônicos' }];
  const mock = t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://example.supabase.co/rest/v1/categories?select=id,name&order=id');
    assert.equal(options.headers.apikey, 'public-test-key');
    return new Response(JSON.stringify(rows));
  });
  assert.deepEqual(await fetchCategories('https://example.supabase.co', 'public-test-key'), rows);
  assert.equal(mock.mock.callCount(), 1);
});
test('falhas HTTP, formato inválido e lista vazia não simulam conexão bem-sucedida', async t => {
  const mock = t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 403 }));
  await assert.rejects(fetchCategories('https://example.supabase.co', 'test'), /HTTP 403/);
  for (const payload of [[], {}, [{ id: 123, name: 'Jogos' }], [{ id: 'cat-1', name: '' }]]) {
    mock.mock.mockImplementation(async () => new Response(JSON.stringify(payload)));
    await assert.rejects(fetchCategories('https://example.supabase.co', 'test'), /formato inválido/);
  }
  await assert.rejects(fetchCategories('https://wrong.example', 'test'), /URL/);
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
