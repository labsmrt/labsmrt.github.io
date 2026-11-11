import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { readManifest, root, output } from './manifest.mjs';

const manifest = await readManifest();
const built = process.argv.includes('--built');
const read = target => readFile(built ? path.join(output, target) : path.join(root, manifest.files[target]), 'utf8');
const html = await read('index.html');
assert.match(html, /<html\s+lang="en"/);
assert.match(html, /name="viewport"/);
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert.doesNotMatch(html, /<(?:nav|form)\b/);
assert.ok(html.includes('Learn to act,') && html.includes('act to learn.'));
assert.ok(html.includes('Visit our new website'));
assert.ok(html.includes(`href="${manifest.destination}"`));
for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  if (url.startsWith('#') || url === manifest.destination || url.startsWith('https://labsmrt.github.io/')) continue;
  assert.ok(url.startsWith('/'), `Local URL must work from old bookmarks: ${url}`);
  assert.ok(manifest.files[url.slice(1)], `Unlisted HTML asset: ${url}`);
}
const css = await read('assets/site.css');
for (const [, url] of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
  const target = url.startsWith('/') ? url.slice(1) : path.posix.normalize(path.posix.join('assets', url));
  assert.ok(manifest.files[target], `Unlisted CSS asset: ${url}`);
}
assert.match(css, /focus-visible/);
assert.match(css, /@media/);
if (built) {
  async function files(dir, prefix = '') {
    const entries = await readdir(dir, { withFileTypes: true });
    return (await Promise.all(entries.map(entry => entry.isDirectory()
      ? files(path.join(dir, entry.name), `${prefix}${entry.name}/`)
      : `${prefix}${entry.name}`))).flat();
  }
  assert.deepEqual((await files(output)).sort(), [...Object.keys(manifest.files), '404.html', '.nojekyll'].sort());
  assert.equal(await readFile(path.join(output, '404.html'), 'utf8'), html);
}
console.log(built ? 'Output verified: only the landing page, fallback, and approved assets.' : 'Source verified: destination, public manifest, links, and assets.');
