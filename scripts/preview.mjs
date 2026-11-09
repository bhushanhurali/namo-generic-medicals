import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';

const root = resolve(
  fileURLToPath(new URL('../dist/namo-generic-medicals/browser/', import.meta.url)),
);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

export function startPreview(port = 4200) {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');
      let file = resolve(root, '.' + decodeURIComponent(url.pathname));
      if (file !== root && !file.startsWith(root + sep)) {
        response.writeHead(403).end();
        return;
      }
      if ((await stat(file)).isDirectory()) {
        if (!url.pathname.endsWith('/')) {
          response.writeHead(302, { Location: url.pathname + '/' + url.search }).end();
          return;
        }
        file = resolve(file, 'index.html');
      }
      const data = await readFile(file);
      response.writeHead(200, {
        'Content-Type': types[extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      response.end(data);
    } catch {
      response.writeHead(404).end('Not found. Build both languages with npm run build first.');
    }
  });
  server.listen(port, '127.0.0.1', () =>
    console.log(`Bilingual preview: http://localhost:${port}/`),
  );
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  startPreview(Number(process.env.PORT || 4200));
}
