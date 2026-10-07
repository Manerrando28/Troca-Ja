import type { Category, Product } from '../types';

export type Catalog = { categories: Category[]; products: Product[] };
type Row = Record<string, unknown>;
const text = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const isRow = (value: unknown): value is Row => typeof value === 'object' && value !== null && !Array.isArray(value);

// A chave publishable é pública. A proteção dos dados fica nas políticas RLS.
// Paginação evita perder produtos quando a Data API limita o tamanho da resposta.
async function fetchRows(url: string, key: string, table: string, columns: string, signal?: AbortSignal): Promise<Row[]> {
  const baseUrl = url.trim().replace(/\/$/, '');
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(baseUrl)) throw new Error('URL do Supabase inválida. Confira o arquivo .env.local.');
  if (!key.trim()) throw new Error('Informe a chave pública do Supabase em .env.local.');
  const rows: Row[] = [];
  while (true) {
    const response = await fetch(`${baseUrl}/rest/v1/${table}?select=${columns}&order=id&limit=100&offset=${rows.length}`, {
      headers: { apikey: key.trim() }, signal,
    });
    if (!response.ok) throw new Error(`Não foi possível carregar ${table} (HTTP ${response.status}). Confira as tabelas, a chave e as políticas RLS.`);
    const page: unknown = await response.json();
    if (!Array.isArray(page) || !page.every(isRow)) throw new Error(`A tabela ${table} retornou um formato inválido.`);
    if (page.length === 0) return rows;
    rows.push(...page);
  }
}

export async function fetchCategories(url: string, key: string, signal?: AbortSignal): Promise<Category[]> {
  const rows = await fetchRows(url, key, 'categories', 'id,name', signal);
  if (!rows.every(row => text(row.id) && text(row.name))) throw new Error('Categorias em formato inválido. Confira id e name.');
  return rows.map(row => ({ id: row.id as string, name: row.name as string }));
}

export async function fetchProducts(url: string, key: string, signal?: AbortSignal): Promise<Product[]> {
  const rows = await fetchRows(url, key, 'products',
    'id,owner_id,name,description,category_id,available_for_trade,image_url,created_at,featured', signal);
  return rows.map(row => {
    if (!text(row.id) || !text(row.owner_id) || !text(row.name) || typeof row.description !== 'string' ||
        !text(row.category_id) || typeof row.available_for_trade !== 'boolean' || typeof row.featured !== 'boolean' ||
        !text(row.created_at) || !Number.isFinite(Date.parse(row.created_at)) ||
        !(row.image_url === null || (text(row.image_url) && /^https:\/\/[^\s/]+\/.+/.test(row.image_url)))) {
      throw new Error('Produto em formato inválido. Confira os campos e use uma URL HTTPS para a imagem ou NULL.');
    }
    return {
      id: row.id, ownerId: row.owner_id, name: row.name, description: row.description,
      categoryId: row.category_id, availableForTrade: row.available_for_trade,
      image: row.image_url === null ? null : { uri: row.image_url as string },
      createdAt: row.created_at, featured: row.featured,
    };
  });
}

export async function fetchCatalog(url: string, key: string, ownerIds: string[], signal?: AbortSignal): Promise<Catalog> {
  const [categories, products] = await Promise.all([fetchCategories(url, key, signal), fetchProducts(url, key, signal)]);
  const categoryIds = new Set(categories.map(category => category.id));
  if (products.some(product => !categoryIds.has(product.categoryId))) {
    throw new Error('Há produtos com categorias ausentes. Confira categories e as políticas de leitura.');
  }
  if (products.some(product => !ownerIds.includes(product.ownerId))) {
    throw new Error('Há produtos com proprietário desconhecido. Nesta demonstração, use user-1, user-2, user-3 ou user-4.');
  }
  return { categories, products };
}
