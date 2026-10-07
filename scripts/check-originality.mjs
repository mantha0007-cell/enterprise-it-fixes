import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(root, 'src', 'content', 'cases');
const overlapWords = 8;
const stopAtSources = /^##\s+(?:Vendor sources|Sources)\s*$/im;

function tokens(text) {
  return text.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
}

function articleText(markdown) {
  const [, , body = ''] = markdown.split(/^---\s*$/m);
  return body
    .split(stopAtSources)[0]
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/^\s*>.*$/gm, ' ');
}

function sourceUrls(markdown) {
  const frontmatter = markdown.split(/^---\s*$/m)[1] ?? '';
  return [...frontmatter.matchAll(/^\s+url:\s*["']?(https?:\/\/[^\s"']+)/gim)]
    .map((match) => match[1]);
}

function extractPageText(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;
  const withoutChrome = main.replace(/<(script|style|nav|footer|header)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ');
  return withoutChrome
    .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)))
    .replace(/&#x([\da-f]+);/gi, (_, value) => String.fromCodePoint(Number.parseInt(value, 16)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/<[^>]+>/g, ' ');
}

function windowsOf(words, size) {
  const result = new Set();
  for (let i = 0; i <= words.length - size; i += 1) {
    result.add(words.slice(i, i + size).join(' '));
  }
  return result;
}

function matchedPhrases(articleWords, sourceWords) {
  const phrases = new Set();
  const sourceWindows = windowsOf(sourceWords, overlapWords);
  for (let i = 0; i <= articleWords.length - overlapWords; i += 1) {
    const phrase = articleWords.slice(i, i + overlapWords).join(' ');
    if (sourceWindows.has(phrase)) phrases.add(phrase);
  }
  return [...phrases];
}

const pageCache = new Map();
const files = (await readdir(contentDir)).filter((name) => name.endsWith('.md') && name !== 'sample-case.md');
const overlaps = [];
const unavailable = [];

for (const filename of files) {
  const markdown = await readFile(path.join(contentDir, filename), 'utf8');
  const articleWords = tokens(articleText(markdown));
  const urls = sourceUrls(markdown);
  if (!urls.length) {
    unavailable.push(`${filename}: no source URLs`);
    continue;
  }

  for (const url of urls) {
    if (!pageCache.has(url)) {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const html = await response.text();
        const words = tokens(extractPageText(html));
        if (words.length < 30) throw new Error('page text could not be extracted');
        pageCache.set(url, words);
      } catch (error) {
        pageCache.set(url, null);
        unavailable.push(`${filename}: ${url} (${error.message})`);
      }
    }

    const sourceWords = pageCache.get(url);
    if (!sourceWords) continue;
    for (const phrase of matchedPhrases(articleWords, sourceWords)) {
      overlaps.push(`${filename}: "${phrase}"`);
    }
  }
}

console.log(`Guides checked: ${files.length}; source pages fetched: ${[...pageCache.values()].filter(Boolean).length}/${pageCache.size}`);
if (overlaps.length) {
  console.log(`Review these exact ${overlapWords}-word overlaps; technical identifiers can be false positives:`);
  for (const match of overlaps) console.log(`- ${match}`);
}
if (unavailable.length) {
  console.error('Manual source comparison is required for:');
  for (const item of unavailable) console.error(`- ${item}`);
}

if (overlaps.length || unavailable.length) process.exitCode = 1;
else console.log('No exact long prose overlaps found. This screening result is not legal clearance.');
