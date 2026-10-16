// Servidor local sem dependências: lê o .env e serve o front com a URL da API injetada.
const fs = require('fs'), path = require('path'), http = require('http');

const env = {};
try {
  for (const l of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([\w.]+)\s*=\s*(.*?)\s*$/);
    if (m && !l.trim().startsWith('#')) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch { console.warn('Arquivo .env não encontrado. Copie o .env.example para .env.'); }

const API_URL = process.env.API_URL || env.API_URL || '';
const PORT = process.env.PORT || env.PORT || 3000;

http.createServer((req, res) => {
  if (req.url === '/' || req.url.startsWith('/?') || req.url === '/app-restaurante.html') {
    const html = fs.readFileSync(path.join(__dirname, 'app-restaurante.html'), 'utf8')
      .replace('<head>', `<head>\n<script>window.__API_URL__=${JSON.stringify(API_URL)};</script>`);
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    return res.end(html);
  }
  res.writeHead(404); res.end('Não encontrado');
}).listen(PORT, () => console.log(`Front em http://localhost:${PORT}  (API: ${API_URL || 'NÃO CONFIGURADA'})`));
