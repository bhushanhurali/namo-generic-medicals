import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Check the actual Pages artifact, including repo-prefixed paths in both locales.
const root = fileURLToPath(new URL('../dist/namo-generic-medicals/browser/', import.meta.url));
const basePath = process.argv[2];
assert(
  basePath?.startsWith('/') && basePath.endsWith('/'),
  'Supply a base path such as /namo-generic-medicals/ or /.',
);
assert(!basePath.includes('..') && !basePath.includes('//'), 'Invalid Pages base path.');

for (const [directory, language] of [
  ['', 'en-IN'],
  ['kn', 'kn'],
]) {
  const localeDirectory = resolve(root, directory);
  const html = await readFile(resolve(localeDirectory, 'index.html'), 'utf8');
  const expectedBase = `${basePath}${directory ? `${directory}/` : ''}`;
  const actualBase = html.match(/<base\s+href="([^"]+)"/i)?.[1];
  assert.equal(actualBase, expectedBase, `${language}: incorrect base href`);
  assert(html.includes(`lang="${language}"`), `${language}: incorrect document language`);

  const baseUrl = new URL(expectedBase, 'https://pages.example');
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const source = match[1];
    if (/^(?:data:|https?:|#)/i.test(source) || source === actualBase) continue;
    const url = new URL(source, baseUrl);
    assert(url.pathname.startsWith(basePath), `${language}: asset escapes the hosting base`);
    const file = resolve(root, decodeURIComponent(url.pathname.slice(basePath.length)));
    const localPath = relative(resolve(root), file);
    assert(!localPath.startsWith(`..${sep}`) && localPath !== '..', 'Asset escapes build output');
    assert((await stat(file)).isFile(), `${language}: missing asset ${source}`);
  }

  assert((await stat(resolve(localeDirectory, 'language-init.js'))).isFile());
  const images = await readdir(resolve(localeDirectory, 'assets/images'));
  assert(images.length > 0, `${language}: missing gallery images`);
  console.log(
    `Verified ${language} at ${expectedBase}, including startup assets and ${images.length} gallery files.`,
  );
}
