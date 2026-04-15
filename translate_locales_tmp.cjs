const fs = require('fs');

const srcPath = 'src/lang/en-us/index.js';
const locales = [
  { file: 'src/lang/ja-jp/index.js', tl: 'ja' },
  { file: 'src/lang/ko-kr/index.js', tl: 'ko' },
  { file: 'src/lang/fr-fr/index.js', tl: 'fr' }
];

const lines = fs.readFileSync(srcPath, 'utf8').split(/\r?\n/);
const entries = [];
for (const line of lines) {
  let m = line.match(/^\s*'([^']+)'\s*:\s*"([^"]*)"\s*,?\s*$/);
  if (!m) m = line.match(/^\s*'([^']+)'\s*:\s*'([^']*)'\s*,?\s*$/);
  if (m) entries.push([m[1], m[2]]);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function translateText(text, tl) {
  if (!text || !text.trim()) return text;
  const url =
    'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=' +
    encodeURIComponent(tl) +
    '&dt=t&q=' +
    encodeURIComponent(text);
  let lastErr;
  for (let i = 0; i < 8; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      return (data[0] || []).map((x) => x[0]).join('');
    } catch (e) {
      lastErr = e;
      await sleep(300 * (i + 1));
    }
  }
  throw lastErr;
}

async function writeLocale(file, tl) {
  const out = ['export default {'];
  for (let i = 0; i < entries.length; i++) {
    const [key, val] = entries[i];
    const t = (await translateText(val, tl))
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"');
    const comma = i === entries.length - 1 ? '' : ',';
    out.push(`  '${key}':"${t}"${comma}`);
    if ((i + 1) % 50 === 0) {
      console.log(`${tl}: ${i + 1}/${entries.length}`);
    }
    await sleep(80);
  }
  out.push('}');
  fs.writeFileSync(file, out.join('\n'), 'utf8');
}

async function main() {
  for (const item of locales) {
    console.log(`start ${item.tl}`);
    await writeLocale(item.file, item.tl);
    console.log(`done ${item.tl}`);
  }
  console.log(`Generated locales with ${entries.length} entries each.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
