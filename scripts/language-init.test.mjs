import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const script = readFileSync(new URL('../public/language-init.js', import.meta.url), 'utf8');
function redirect({
  device = 'en-US',
  saved = null,
  locale = 'en-IN',
  path = '/',
  base = '/',
  blocked = false,
} = {}) {
  let result;
  const url = new URL(path, 'https://example.com');
  runInNewContext(script, {
    URL,
    document: { documentElement: { lang: locale }, baseURI: new URL(base, url).href },
    navigator: { languages: [device], language: device },
    localStorage: {
      getItem() {
        if (blocked) throw Error('Blocked');
        return saved;
      },
    },
    location: {
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      replace(value) {
        result = value;
      },
    },
  });
  return result;
}
test('Kannada device language opens Kannada on a first visit', () => {
  assert.equal(redirect({ device: 'kn-IN' }), 'https://example.com/kn/');
});
test('other device languages default to English', () => {
  assert.equal(redirect({ device: 'de-DE' }), undefined);
});
test('manual English overrides a Kannada device', () => {
  assert.equal(redirect({ device: 'kn', saved: 'en' }), undefined);
});
test('manual Kannada overrides another device language', () => {
  assert.equal(redirect({ saved: 'kn' }), 'https://example.com/kn/');
});
test('explicit Kannada URLs do not redirect or loop', () => {
  assert.equal(redirect({ locale: 'kn', path: '/kn/', base: '/kn/', saved: 'en' }), undefined);
});
test('blocked storage still allows device detection', () => {
  assert.equal(redirect({ device: 'kn', blocked: true }), 'https://example.com/kn/');
});
test('repository base paths, query parameters, and section fragments survive', () => {
  assert.equal(
    redirect({ device: 'kn', base: '/pharmacy/', path: '/pharmacy/?source=link#about' }),
    'https://example.com/pharmacy/kn/?source=link#about',
  );
});
test('invalid preferences fall back to the device', () => {
  assert.equal(redirect({ device: 'kn-IN', saved: 'invalid' }), 'https://example.com/kn/');
});
