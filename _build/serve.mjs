// Servidor local que imita o GitHub Pages: o site responde em /apps/.
// node _build/serve.mjs  →  http://localhost:4173/apps/
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL } from "./data.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = new URL(SITE_URL).pathname.replace(/\/$/, "");
const PORT = Number(process.env.PORT) || 4173;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".png": "image/png", ".webp": "image/webp", ".ico": "image/x-icon", ".woff2": "font/woff2",
  ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml",
};

createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (path === "/" || path === BASE) { res.writeHead(301, { Location: BASE + "/" }); return res.end(); }
  if (!path.startsWith(BASE + "/")) return notFound(res);
  path = normalize(path.slice(BASE.length)).replace(/\\/g, "/");
  if (path.split("/").some((p) => p.startsWith("_") || p.startsWith("."))) return notFound(res);
  let file = join(ROOT, path);
  try {
    const s = await stat(file);
    if (s.isDirectory()) {
      if (!path.endsWith("/")) { res.writeHead(301, { Location: BASE + path + "/" }); return res.end(); }
      file = join(file, "index.html");
    }
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    notFound(res);
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}${BASE}/`));

async function notFound(res) {
  res.writeHead(404, { "Content-Type": TYPES[".html"] });
  res.end(await readFile(join(ROOT, "404.html")));
}
