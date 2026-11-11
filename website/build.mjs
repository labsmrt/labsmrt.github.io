import { copyFile, lstat, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { readManifest, root, output } from './manifest.mjs';

export async function build() {
  const manifest = await readManifest();
  if (path.dirname(output) !== root || path.basename(output) !== 'dist') throw new Error('Unsafe output directory.');
  const previous = await lstat(output).catch(error => { if (error.code !== 'ENOENT') throw error; });
  if (previous?.isSymbolicLink()) throw new Error('Refusing to replace a linked output directory.');
  await rm(output, { recursive: true, force: true });
  for (const [target, source] of Object.entries(manifest.files)) {
    const destination = path.join(output, target);
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(path.join(root, source), destination);
  }
  // Old bookmarks show the same landing page rather than retained legacy content.
  await copyFile(path.join(output, 'index.html'), path.join(output, '404.html'));
  await writeFile(path.join(output, '.nojekyll'), '');
  console.log('Built the single landing page and its public assets in dist/.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.join(root, 'website/build.mjs')) await build();
