import { test, expect, type Page } from '@playwright/test';

const remoteProducts = [
  { id: 'remote-ana', owner_id: 'user-1', name: 'Violão remoto da Ana', description: 'Produto recebido da API',
    category_id: 'remote-category', available_for_trade: true, image_url: null, created_at: '2026-10-07T12:00:00Z', featured: false },
  { id: 'remote-bruno', owner_id: 'user-2', name: 'Teclado remoto do Bruno', description: 'Outro produto recebido da API',
    category_id: 'remote-category', available_for_trade: true, image_url: null, created_at: '2026-10-07T12:00:00Z', featured: true },
];

async function login(page: Page, name = 'Ana') {
  await page.getByRole('textbox', { name: 'E-mail', exact: true }).fill(`${name.toLowerCase()}@trocaja.com`);
  await page.getByLabel('Senha', { exact: true }).fill(`${name}12345`);
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
}

async function api(page: Page, products = remoteProducts, fail = () => false) {
  await page.route('https://catalog-test.supabase.co/rest/v1/**', async route => {
    const url = new URL(route.request().url());
    const isProducts = url.pathname.endsWith('/products');
    const rows = isProducts ? products : [{ id: 'remote-category', name: 'Música remota' }];
    const offset = Number(url.searchParams.get('offset'));
    await route.fulfill({ status: isProducts && fail() ? 403 : 200, contentType: 'application/json',
      body: JSON.stringify(isProducts && fail() ? { message: 'permission denied' } : rows.slice(offset, offset + 100)) });
  });
}

test('produtos remotos alimentam Home, Perfil, proposta, aceite e conversa', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await api(page);
  await page.goto('/');
  await login(page);
  await expect(page.getByRole('button', { name: 'Música remota', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ver PS5', exact: true })).toHaveCount(0);
  await page.getByRole('tab', { name: 'Perfil', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Ver Violão remoto da Ana', exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Trocas', exact: true }).click();
  await expect(page.getByText('Nenhuma proposta ainda. Escolha um produto na Home.')).toBeVisible();
  // Volta pela rota para não depender do rótulo visual da aba Home.
  await page.goto('/');
  await login(page);
  await page.getByRole('button', { name: 'Ver Teclado remoto do Bruno', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Violão remoto da Ana', exact: true }).click();
  await page.getByRole('button', { name: 'Propor negociação (1)' }).click();
  await expect(page.getByText('Proposta enviada! Acompanhe o status na aba Trocas.')).toBeVisible();
  await page.getByRole('tab', { name: 'Trocas', exact: true }).click();
  await expect(page.getByText('Violão remoto da Ana ↔ Teclado remoto do Bruno')).toBeVisible();
  await page.getByRole('tab', { name: 'Perfil', exact: true }).click();
  await page.getByRole('button', { name: 'Sair', exact: true }).click();
  await login(page, 'Bruno');
  await page.getByRole('tab', { name: 'Trocas', exact: true }).click();
  await page.getByRole('button', { name: 'Aceitar proposta', exact: true }).click();
  await page.getByRole('tab', { name: 'Negociações', exact: true }).click();
  await page.getByRole('button', { name: 'Conversar com Ana Costa sobre Violão remoto da Ana', exact: true }).click();
  await expect(page.getByText('Teclado remoto do Bruno', { exact: true }).last()).toBeVisible();
  await expect(page.getByText('Violão remoto da Ana', { exact: true }).last()).toBeVisible();
  await page.getByRole('textbox', { name: 'Mensagem', exact: true }).fill('Produtos recebidos do banco!');
  await page.getByRole('button', { name: 'Enviar mensagem', exact: true }).click();
  await expect(page.getByText('Produtos recebidos do banco!', { exact: true }).last()).toBeVisible();
  expect(errors).toEqual([]);
});

test('catálogo vazio não exibe produtos fictícios', async ({ page }) => {
  await api(page, []);
  await page.goto('/');
  await login(page);
  await expect(page.getByText('Nenhum produto cadastrado. Volte mais tarde para ver novos produtos.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ver PS5', exact: true })).toHaveCount(0);
});

test('erro remoto não exibe mocks e nova tentativa recupera produtos', async ({ page }) => {
  let failed = true;
  await api(page, remoteProducts, () => failed);
  await page.goto('/');
  await login(page);
  await expect(page.getByRole('alert')).toContainText('products (HTTP 403)');
  await expect(page.getByRole('button', { name: 'Ver PS5', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Ver Teclado remoto do Bruno', exact: true })).toHaveCount(0);
  failed = false;
  await page.getByRole('button', { name: 'Tentar novamente', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Ver Teclado remoto do Bruno', exact: true })).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
});
