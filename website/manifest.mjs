import { readFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const output = path.join(root, 'dist');

export async function readManifest() {
  const manifest = JSON.parse(await readFile(path.join(root, 'public-content/publish.json'), 'utf8'));
  if (manifest.audience !== 'public' || manifest.public_approved !== true) {
    throw new Error('Public publication approval is required.');
  }
  if (manifest.destination !== 'https://xbtinchina.github.io/SMRTLab-everything/') {
    throw new Error('Unexpected destination URL.');
  }
  for (const [target, source] of Object.entries(manifest.files)) {
    if (!/^(?:index\.html|assets\/[\w./-]+)$/.test(target) || target.includes('..')) {
      throw new Error(`Invalid output path: ${target}`);
    }
    if (!/^(?:website\/index\.html|website\/assets\/[\w./-]+|public-content\/assets\/[\w./-]+)$/.test(source) || source.includes('..')) {
      throw new Error(`Source is outside public assets: ${source}`);
    }
    const actual = await realpath(path.join(root, source));
    const rel = path.relative(await realpath(root), actual);
    if (rel.startsWith('..') || path.isAbsolute(rel)) throw new Error('Source escaped the checkout.');
  }
  return manifest;
}
