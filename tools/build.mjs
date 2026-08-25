// 公開用ファイルを dist/ にまとめる（追加インストール不要）
// 使い方:  npm run build   /  npm run check（チェックだけ実行）
import { cp, mkdir, rm, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const CHECK_ONLY = process.argv.includes('--check');
const ENTRIES = ['index.html', 'samples', 'README.md', 'LICENSE'];

const html = await readFile('index.html', 'utf8');
const must = ['<canvas id="cv"', 'function render(', 'function parseCSV(', 'exportMP4Exact'];
const missing = must.filter(m => !html.includes(m));
if (missing.length) {
  console.error('index.html の中身が不正です:', missing.join(', '));
  process.exit(1);
}
console.log(`index.html OK (${(html.length / 1024).toFixed(1)} KB)`);

if (CHECK_ONLY) process.exit(0);

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const e of ENTRIES) if (existsSync(e)) await cp(e, `dist/${e}`, { recursive: true });
console.log('dist/ に公開用ファイルを作成しました');
