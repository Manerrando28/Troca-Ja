import { defineConfig } from '@playwright/test';
import base from './playwright.config';

export default defineConfig({
  ...base,
  testIgnore: [],
  testMatch: '**/supabase.spec.ts',
  use: { ...base.use, baseURL: 'http://localhost:4174' },
  webServer: {
    command: 'node scripts/serve-web.cjs',
    env: { PREVIEW_DIR: 'dist-supabase', PORT: '4174' },
    url: 'http://localhost:4174',
    reuseExistingServer: false,
    timeout: 120000,
  },
});
