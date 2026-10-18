import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const site = new URL('https://enterprise-it-fixes.pages.dev/');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = resolve(root, 'public');
const keyFilenamePattern = /^([a-f0-9]{32})\.txt$/;

const keyFile = (await readdir(publicDir)).find((name) => keyFilenamePattern.test(name));
if (!keyFile) throw new Error('Geen IndexNow-sleutelbestand gevonden in public/.');

const key = keyFile.match(keyFilenamePattern)[1];
const keyLocation = new URL(keyFile, site);
const localKey = (await readFile(resolve(publicDir, keyFile), 'utf8')).trim();
if (localKey !== key) throw new Error('De inhoud van het sleutelbestand komt niet overeen met de bestandsnaam.');

const urls = process.argv.slice(2).filter((arg) => arg !== '--');
if (urls.length === 0) {
  throw new Error('Geef minstens één gewijzigde, live URL mee. De sitemap wordt bewust niet automatisch volledig ingestuurd.');
}

const normalized = [...new Set(urls.map((value) => {
  const url = new URL(value);
  if (url.origin !== site.origin || !url.pathname.startsWith('/')) {
    throw new Error(`URL valt buiten deze site: ${value}`);
  }
  return url.href;
}))];

const keyResponse = await fetch(keyLocation);
if (!keyResponse.ok || (await keyResponse.text()).trim() !== key) {
  throw new Error(`De live IndexNow-sleutel kon niet worden geverifieerd (${keyResponse.status}). Is Cloudflare Pages al bijgewerkt?`);
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: site.host,
    key,
    keyLocation: keyLocation.href,
    urlList: normalized,
  }),
});

if (!response.ok) {
  const detail = (await response.text()).trim();
  throw new Error(`IndexNow heeft de aanvraag geweigerd: HTTP ${response.status}${detail ? ` — ${detail}` : ''}`);
}

console.log(`IndexNow heeft ${normalized.length} gewijzigde URL(s) ontvangen (HTTP ${response.status}).`);
console.log('Ontvangst is bevestigd; crawlen of opnemen in zoekresultaten wordt niet gegarandeerd.');
