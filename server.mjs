import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 3000);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};
const aliases = {
  '/manus-routes.json': join(root, 'public', 'manus-routes.json')
};

const server = createServer(async (req, res) => {
  const pathname = new URL(req.url || '/', 'http://localhost').pathname;
  const requested = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const candidate = aliases[pathname] || normalize(join(root, requested));
  if (!candidate.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const body = await readFile(candidate);
    res.writeHead(200, {
      'Content-Type': mime[extname(candidate)] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    res.end(body);
  } catch {
    if (pathname !== '/') {
      const fallback = await readFile(join(root, 'index.html'));
      res.writeHead(200, { 'Content-Type': mime['.html'], 'Cache-Control': 'no-cache' });
      res.end(fallback);
      return;
    }
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Purple Insight listening on http://0.0.0.0:${port}`);
});
