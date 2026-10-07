import type { Category } from '../types';

// A chave publishable é pública. A proteção dos dados fica nas políticas RLS.
export async function fetchCategories(url: string, key: string, signal?: AbortSignal): Promise<Category[]> {
  if (!/^https:\/\/[^/]+\.supabase\.co$/.test(url)) throw new Error('URL do Supabase inválida.');
  const response = await fetch(`${url}/rest/v1/categories?select=id,name&order=id`, {
    headers: { apikey: key }, signal,
  });
  if (!response.ok) throw new Error(`Não foi possível carregar o catálogo (HTTP ${response.status}).`);
  const data: unknown = await response.json();
  if (!Array.isArray(data) || !data.length || !data.every((row: unknown) =>
    typeof row === 'object' && row !== null && 'id' in row && typeof row.id === 'string' &&
    'name' in row && typeof row.name === 'string' && row.name.trim().length > 0)) {
    throw new Error('O catálogo recebido está vazio ou tem formato inválido. Execute o seed do banco.');
  }
  return data as Category[];
}
