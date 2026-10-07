const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('pageerror', e => console.log('PAGE ERROR', e.message));
  await page.goto('http://localhost:4173');
  console.log(await page.locator('body').ariaSnapshot());
  await page.screenshot({ path: 'docs/evidencias/debug.png' });
  await browser.close();
})();
