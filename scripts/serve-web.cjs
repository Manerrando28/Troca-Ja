// Servidor local do bundle exportado; fallback de SPA para as rotas do Expo Router.
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '../dist');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.ttf': 'font/ttf', '.json': 'application/json' };
http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = path.resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    try { if (!(await fs.stat(file)).isFile()) file = path.join(root, 'index.html'); }
    catch { file = path.join(root, 'index.html'); }
    const body = await fs.readFile(file);
    response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    response.end(body);
  } catch { response.writeHead(500).end('Execute npm run export:web antes de iniciar o preview.'); }
}).listen(4173, '127.0.0.1', () => console.log('Preview local: http://localhost:4173'));
