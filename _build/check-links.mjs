// Confere links internos (arquivos e âncoras) de todas as páginas geradas.
// node _build/check-links.mjs
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL } from "./data.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = new URL(SITE_URL).pathname.replace(/\/$/, "");

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    if (n.startsWith(".") || n.startsWith("_")) return [];
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
  });
}

const ids = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
let errors = 0;
let checked = 0;

for (const file of walk(ROOT)) {
  const html = readFileSync(file, "utf8");
  for (const [, url] of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|data:)/.test(url)) continue;
    checked++;
    const [path, hash] = url.split("#");
    let target;
    if (path === "") target = file;
    else if (path.startsWith("/")) target = join(ROOT, path.slice(BASE.length));
    else target = resolve(dirname(file), path);
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, "index.html");
    const where = relative(ROOT, file);
    if (!existsSync(target)) {
      console.log(`✗ ${where}: ${url} (arquivo não existe)`);
      errors++;
      continue;
    }
    if (hash && target.endsWith(".html") && !ids(readFileSync(target, "utf8")).has(hash)) {
      console.log(`✗ ${where}: ${url} (âncora #${hash} não existe)`);
      errors++;
    }
  }
}
console.log(errors ? `${errors} link(s) quebrado(s)` : `ok: ${checked} links internos conferidos`);
process.exit(errors ? 1 : 0);
