import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fetchCatalog } from '../src/services/catalog.ts';

const imported = JSON.parse(await readFile(new URL('../supabase/internet-products.json', import.meta.url), 'utf8'));
for (const product of imported) {
  const response = await fetch(product.image_url, { method: 'HEAD', signal: AbortSignal.timeout(15000) });
  assert.ok(response.ok && response.headers.get('content-type')?.startsWith('image/'),
    'Imagem indisponível: ' + product.name);
}
console.log(imported.length + ' imagens da fonte verificadas.');
if (process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
  const catalog = await fetchCatalog(process.env.EXPO_PUBLIC_SUPABASE_URL,
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY, ['user-1', 'user-2', 'user-3', 'user-4'],
    AbortSignal.timeout(15000));
  const received = catalog.products.filter(product => imported.some(row => row.id === product.id));
  assert.equal(received.length, imported.length, 'Faltam produtos importados no Supabase.');
  assert.ok(received.every(product => product.image?.uri?.startsWith('https://cdn.dummyjson.com/')));
  console.log(JSON.stringify({ categories: catalog.categories.length, products: catalog.products.length,
    importedWithImages: received.length }, null, 2));
}
