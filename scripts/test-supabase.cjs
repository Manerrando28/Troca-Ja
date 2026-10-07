// Configuração fictícia, isolada do .env.local. Todas as chamadas são interceptadas no teste.
const { spawnSync } = require('node:child_process');
const env = { ...process.env, EXPO_NO_DOTENV: '1',
  EXPO_PUBLIC_SUPABASE_URL: 'https://catalog-test.supabase.co',
  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test_only' };
for (const args of [
  ['node_modules/expo/bin/cli', 'export', '--platform', 'web', '--clear', '--output-dir', 'dist-supabase'],
  ['node_modules/@playwright/test/cli.js', 'test', '--config', 'playwright.supabase.config.ts'],
]) {
  const result = spawnSync(process.execPath, args, { env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
