import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { build } from './build.mjs';
import { output } from './manifest.mjs';

await build();
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let target = path.resolve(output, '.' + pathname);
    const relative = path.relative(output, target);
    if (relative.startsWith('..') || path.isAbsolute(relative)) { res.writeHead(403); res.end(); return; }
    if ((await stat(target).catch(() => null))?.isDirectory()) target = path.join(target, 'index.html');
    let status = 200;
    if (!(await stat(target).catch(() => null))?.isFile()) { target = path.join(output, '404.html'); status = 404; }
    const body = await readFile(target);
    res.writeHead(status, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch { res.writeHead(400); res.end('Bad request'); }
});
server.listen(Number(process.env.PORT || 4175), '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${server.address().port}/`));
