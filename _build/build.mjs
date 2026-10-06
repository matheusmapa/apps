// Gera o site estático da Mapa's.
// Rode da raiz do repositório:  node _build/build.mjs
// Edite os dados em _build/data.mjs e os textos legais em _build/legal/.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL, COMPANY, APPS, PRINCIPLES } from "./data.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const YEAR = new Date().getFullYear();
const pages = []; // para o sitemap

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Caminho relativo até a raiz do site a partir de um arquivo de saída.
const up = (out) => "../".repeat(out.split("/").length - 1) || "./";

const mailto = (subject) =>
  `mailto:${COMPANY.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;

function write(out, html, { sitemap = true } = {}) {
  const file = join(ROOT, out);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  if (sitemap) pages.push(out);
}

function urlFor(out) {
  return SITE_URL + "/" + out.replace(/index\.html$/, "");
}

function head({ out, title, description, ogImage, ogType = "website", jsonLd, noindex = false }) {
  const r = up(out);
  const canonical = urlFor(out);
  const og = ogImage ? SITE_URL + "/" + ogImage : SITE_URL + "/assets/img/og.png";
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">\n' : ""}<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#f4f2ec" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#131311" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="${ogType}">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${esc(COMPANY.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${og}">
<meta name="twitter:card" content="${ogImage && ogImage.endsWith("icon-512.png") ? "summary" : "summary_large_image"}">
<link rel="icon" href="${r}favicon.ico" sizes="32x32">
<link rel="icon" href="${r}assets/img/favicon-48.png" type="image/png" sizes="48x48">
<link rel="apple-touch-icon" href="${r}assets/img/apple-touch-icon.png">
<link rel="preload" href="${r}assets/fonts/bricolage-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${r}assets/css/site.css">
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n` : ""}</head>
<body>
<a class="skip" href="#conteudo">Pular para o conteúdo</a>`;
}

function header(out, current) {
  const r = up(out);
  const link = (href, label, key) =>
    `<a href="${href}"${current === key ? ' aria-current="page"' : ""}>${label}</a>`;
  return `
<header class="site-head">
  <div class="wrap">
    <a class="brand" href="${r}"><img src="${r}assets/img/favicon-48.png" alt="" width="30" height="30">${esc(COMPANY.name)}</a>
    <nav class="site-nav" aria-label="Principal">
      ${link(`${r}#apps`, "Apps", "apps")}
      ${link(`${r}sobre/`, "Sobre", "sobre")}
      ${link(`${r}contato/`, "Contato", "contato")}
    </nav>
  </div>
</header>`;
}

function footer(out) {
  const r = up(out);
  const legal = [COMPANY.legalName, COMPANY.cnpj && `CNPJ ${COMPANY.cnpj}`].filter(Boolean);
  return `
<footer class="site-foot">
  <div class="wrap cols">
    <div>
      <p><strong>${esc(COMPANY.name)}</strong></p>
      ${legal.length ? `<p>${esc(legal.join(" · "))}</p>` : ""}
      <p>${esc(COMPANY.city)}, ${esc(COMPANY.uf)}, Brasil</p>
      <p><a href="${mailto()}">${esc(COMPANY.email)}</a></p>
    </div>
    <div>
      <p class="h">Apps</p>
      <ul>${APPS.map((a) => `<li><a href="${r}${a.slug}/">${esc(a.name)}</a></li>`).join("")}</ul>
    </div>
    <div>
      <p class="h">Empresa</p>
      <ul>
        <li><a href="${r}sobre/">Sobre</a></li>
        <li><a href="${r}contato/">Contato</a></li>
        <li><a href="${r}privacidade/">Privacidade deste site</a></li>
      </ul>
      <p style="margin-top:18px">© ${YEAR} ${esc(COMPANY.name)}</p>
    </div>
  </div>
</footer>
</body>
</html>
`;
}

function statusLine(app) {
  if (app.status === "live") return `<span class="status status-live">Na Google Play</span>`;
  if (app.status === "testing") return `<span class="status">Em teste, chega em breve</span>`;
  return `<span class="status">Em breve</span>`;
}

function playBadge(app, r) {
  return `<a class="badge" href="${app.playUrl}"><img src="${r}assets/img/google-play-badge.png" width="646" height="250" alt="Disponível no Google Play"></a>`;
}

function orgJsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.name,
    url: SITE_URL + "/",
    logo: SITE_URL + "/assets/img/mark-512.png",
    email: COMPANY.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: COMPANY.city,
      addressRegion: COMPANY.uf,
      addressCountry: "BR",
    },
  };
  if (COMPANY.legalName) org.legalName = COMPANY.legalName;
  if (COMPANY.cnpj) org.taxID = COMPANY.cnpj;
  return org;
}

// ---------- Home ----------
function home() {
  const out = "index.html";
  const r = up(out);
  const rows = APPS.map(
    (a) => `
      <li class="app-row" style="--accent:${a.accent}">
        <img class="icon" src="${a.slug}/img/icon-192.webp" width="192" height="192" alt="">
        <div>
          <h3><a href="${a.slug}/">${esc(a.name)}</a></h3>
          <p class="sub">${esc(a.category)}</p>
        </div>
        <p class="pitch">${esc(a.pitch)}</p>
        <div class="side">${statusLine(a)}</div>
      </li>`
  ).join("");

  const principles = PRINCIPLES.map(
    (p) => `
      <li><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`
  ).join("");

  write(
    out,
    head({
      out,
      title: `${COMPANY.name}: apps pequenos, úteis e sem anúncios`,
      description:
        "A Mapa’s é um estúdio independente de Conselheiro Lafaiete, MG, que faz apps Android sem cadastro, sem anúncios e sem coleta de dados.",
      jsonLd: orgJsonLd(),
    }) +
      header(out, "home") +
      `
<main id="conteudo">
  <section class="hero">
    <div class="wrap hero-grid">
      <div class="hero-shots" aria-hidden="true">
        <img src="studz/img/shot-02.webp" width="540" height="960" alt="" loading="lazy">
        <img src="geladeira/img/shot-03.webp" width="540" height="960" alt="" loading="lazy">
        <img src="folga/img/shot-01.webp" width="540" height="960" alt="" loading="lazy">
      </div>
      <div class="hero-text">
      <h1>Apps pequenos, úteis e <span class="hl">caprichados</span> pro dia a dia.</h1>
      <p class="lede">A ${esc(COMPANY.name)} é um estúdio independente de ${esc(COMPANY.city)}, ${esc(COMPANY.uf)}. Cada app resolve uma coisa só e resolve bem. <strong>Sem cadastro, sem anúncios e sem guardar nada seu.</strong></p>
      <div class="hero-links">
        <a class="btn btn-solid" href="#apps">Ver os apps</a>
        <a class="btn" href="${r}contato/">Falar com a gente</a>
      </div>
      </div>
    </div>
  </section>

  <section class="section" id="apps" aria-labelledby="apps-t">
    <div class="wrap">
      <div class="section-head">
        <h2 id="apps-t">Os apps</h2>
        <p>${APPS.length} apps para Android</p>
      </div>
      <ol class="app-list">${rows}
      </ol>
    </div>
  </section>

  <section class="section" aria-labelledby="prin-t">
    <div class="wrap">
      <div class="section-head"><h2 id="prin-t">Como a gente faz</h2></div>
      <ol class="principles">${principles}
      </ol>
    </div>
  </section>

  <section class="section" aria-labelledby="sobre-t">
    <div class="wrap split">
      <h2 id="sobre-t">Quem faz</h2>
      <div>
        <p>A ${esc(COMPANY.name)} é tocada por ${esc(COMPANY.ownerShort)}, em ${esc(COMPANY.city)}. Os apps nascem de problemas pequenos e reais: estudar sem se distrair, segurar uma compra por impulso, saber se amanhã é dia de folga.</p>
        <p>A regra é a mesma pra todos: o app tem que abrir rápido, funcionar sem internet quando dá e não pedir nada que não precisa.</p>
        <p><a href="${r}sobre/">Mais sobre a empresa</a></p>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="contato-t">
    <div class="wrap split">
      <h2 id="contato-t">Contato</h2>
      <div>
        <p>Dúvida, sugestão ou problema em algum app? Escreva pra gente. Quem responde é quem faz o app.</p>
        <p class="big-mail"><a href="${mailto()}">${esc(COMPANY.email)}</a></p>
      </div>
    </div>
  </section>
</main>` +
      footer(out)
  );
}

// ---------- Página de cada app ----------
function appPage(app) {
  const out = `${app.slug}/index.html`;
  const r = up(out);

  let cta;
  if (app.status === "live") {
    cta = playBadge(app, r);
  } else {
    const when = app.status === "testing" ? app.soonText : "O app está nos últimos ajustes antes de ir pra loja.";
    cta = `<p class="soon"><strong>Em breve na Google Play</strong>${esc(when)}</p>`;
  }

  const shots = app.shots.length
    ? `<ul class="shots" aria-label="Telas do ${esc(app.name)}">${app.shots
        .map(
          (alt, i) =>
            `<li><img src="img/shot-${String(i + 1).padStart(2, "0")}.webp" width="540" height="960" alt="${esc(alt)}" loading="${i < 3 ? "eager" : "lazy"}"></li>`
        )
        .join("")}</ul>`
    : `<img class="feature-img" src="img/feature.webp" width="1024" height="500" alt="${esc(app.featureAlt)}">`;

  const highlights = app.highlights
    .map((h) => `<li><h3>${esc(h[0])}</h3><p>${esc(h[1])}</p></li>`)
    .join("");

  const legal = [
    `<li><a href="privacy.html">Política de privacidade</a></li>`,
    `<li><a href="terms.html">Termos de uso</a></li>`,
    `<li><a href="privacy.html#exclusao">Como apagar seus dados</a></li>`,
    `<li><a href="${mailto(app.name)}">Suporte por e-mail</a></li>`,
  ].join("");

  const ld = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.fullName,
    operatingSystem: "Android",
    applicationCategory: app.schemaCategory,
    description: app.pitch,
    image: SITE_URL + `/${app.slug}/img/icon-512.png`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
    publisher: { "@type": "Organization", name: COMPANY.name, url: SITE_URL + "/" },
  };
  if (app.status === "live") ld.downloadUrl = app.playUrl;

  write(
    out,
    head({
      out,
      title: `${app.fullName} · ${COMPANY.name}`,
      description: app.pitch,
      ogImage: `${app.slug}/img/og.png`,
      jsonLd: ld,
    }) +
      header(out, "apps") +
      `
<main id="conteudo" style="--accent:${app.accent}">
  <div class="wrap">
    <p class="crumb"><a href="${r}#apps">Todos os apps</a></p>
    <section class="app-hero">
      <div>
        <img class="icon" src="img/icon-192.webp" width="192" height="192" alt="Ícone do ${esc(app.name)}">
        <h1 style="margin-top:22px">${esc(app.name)}</h1>
        <p class="full-name">${esc(app.fullName)} · ${esc(app.category)}</p>
        <hr class="rule">
        <p class="pitch">${esc(app.pitch)}</p>
        <div class="cta-row">${cta}</div>
        <ul class="facts"><li>Android</li><li>Sem cadastro</li><li>Sem anúncios</li><li>${esc(app.priceShort)}</li></ul>
      </div>
    </section>
  </div>

  <section class="section" aria-label="Telas">
    <div class="wrap">${shots}</div>
  </section>

  <section class="section" aria-labelledby="faz-t">
    <div class="wrap">
      <div class="section-head"><h2 id="faz-t">O que ele faz</h2></div>
      <ul class="highlights">${highlights}</ul>
    </div>
  </section>

  <section class="section" aria-labelledby="preco-t">
    <div class="wrap split">
      <h2 id="preco-t">Quanto custa</h2>
      <div><p>${esc(app.price)}</p></div>
    </div>
  </section>

  <section class="section" aria-labelledby="priv-t">
    <div class="wrap split">
      <h2 id="priv-t">Seus dados</h2>
      <div>
        <p>${esc(app.privacy)}</p>
        <ul class="legal-links">${legal}</ul>
      </div>
    </div>
  </section>
</main>` +
      footer(out)
  );
}

// ---------- Políticas e termos ----------
function legalPage(app, kind) {
  const out = `${app.slug}/${kind}.html`;
  const src = join(ROOT, "_build/legal", `${app.slug}-${kind}.html`);
  if (!existsSync(src)) throw new Error(`Falta ${src}`);
  const body = readFileSync(src, "utf8").trim();
  const isPrivacy = kind === "privacy";
  const title = isPrivacy ? "Política de Privacidade" : "Termos de Uso";
  const updated = app.updated[kind];
  const other = isPrivacy
    ? `<a href="terms.html">Termos de Uso</a>`
    : `<a href="privacy.html">Política de Privacidade</a>`;

  write(
    out,
    head({
      out,
      title: `${title} · ${app.name}`,
      description: isPrivacy
        ? `Como o ${app.name} trata seus dados: tudo fica no seu celular, sem cadastro e sem anúncios.`
        : `Termos de uso do app ${app.name}, da ${COMPANY.name}.`,
      ogImage: `${app.slug}/img/icon-512.png`,
    }) +
      header(out, "apps") +
      `
<main id="conteudo">
  <article class="wrap narrow doc">
    <a class="doc-mark" href="./"><img src="img/icon-192.webp" width="192" height="192" alt="">${esc(app.name)}</a>
    <h1>${title}</h1>
    <p class="meta">${esc(app.name)} · Última atualização: ${esc(updated)}</p>
${body}
    <hr>
    <nav class="doc-nav" aria-label="Documentos do ${esc(app.name)}"><a href="./">Sobre o ${esc(app.name)}</a>${other}<a href="#en">English</a></nav>
  </article>
</main>` +
      footer(out)
  );
}

// ---------- Sobre ----------
function sobre() {
  const out = "sobre/index.html";
  const r = up(out);
  const rows = [
    ["Nome", COMPANY.name],
    COMPANY.legalName && ["Razão social", COMPANY.legalName],
    COMPANY.cnpj && ["CNPJ", COMPANY.cnpj],
    ["Responsável", COMPANY.owner],
    ["Cidade", `${COMPANY.city}, ${COMPANY.uf}, Brasil`],
    ["E-mail", `<a href="${mailto()}">${esc(COMPANY.email)}</a>`, true],
    ["Na Google Play", `Desenvolvedor “${esc(COMPANY.playName)}”`, true],
  ]
    .filter(Boolean)
    .map(([k, v, raw]) => `<dt>${esc(k)}</dt><dd>${raw ? v : esc(v)}</dd>`)
    .join("\n      ");

  write(
    out,
    head({
      out,
      title: `Sobre · ${COMPANY.name}`,
      description: `Quem é a ${COMPANY.name}, estúdio de apps de ${COMPANY.city}, ${COMPANY.uf}.`,
      jsonLd: orgJsonLd(),
    }) +
      header(out, "sobre") +
      `
<main id="conteudo">
  <article class="wrap narrow doc">
    <h1>Sobre a ${esc(COMPANY.name)}</h1>
    <p class="meta">Estúdio independente de apps · ${esc(COMPANY.city)}, ${esc(COMPANY.uf)}</p>
    <p>A ${esc(COMPANY.name)} faz apps pequenos, úteis e <span class="hl">caprichados</span> pro dia a dia. Cada um resolve uma coisa só: estudar com foco, segurar uma compra por impulso, manter um hábito, escrever pro seu eu do futuro, saber quando é dia de folga.</p>
    <p>Os apps são publicados na Google Play com o nome de desenvolvedor “${esc(COMPANY.playName)}”.</p>

    <h2>O que todos os apps têm em comum</h2>
    <ul>
${PRINCIPLES.map((p) => `      <li><strong>${esc(p.title)}</strong> ${esc(p.text)}</li>`).join("\n")}
    </ul>

    <h2>Por que assim</h2>
    <p>App de celular virou sinônimo de cadastro, notificação demais e propaganda entre uma tela e outra. A gente acha que dá pra fazer diferente: um app que abre, faz o que promete e sai do caminho. Sem servidor guardando seus dados, não tem o que vazar.</p>
    <p>O dinheiro vem da versão Pro, que a pessoa compra se quiser e quando quiser. Isso deixa o incentivo no lugar certo: fazer um app bom o bastante pra valer o pagamento.</p>

    <h2>Dados da empresa</h2>
    <dl class="datalist">
      ${rows}
    </dl>

    <h2>Fale com a gente</h2>
    <p>Suporte, imprensa ou parceria: <a href="${mailto()}">${esc(COMPANY.email)}</a>. Também dá pra usar a <a href="${r}contato/">página de contato</a>.</p>
  </article>
</main>` +
      footer(out)
  );
}

// ---------- Contato ----------
function contato() {
  const out = "contato/index.html";
  const options = [`<option value="">Assunto geral</option>`]
    .concat(APPS.map((a) => `<option>${esc(a.name)}</option>`))
    .join("");
  write(
    out,
    head({
      out,
      title: `Contato · ${COMPANY.name}`,
      description: `Fale com a ${COMPANY.name}: suporte dos apps, sugestões e parcerias.`,
    }) +
      header(out, "contato") +
      `
<main id="conteudo">
  <article class="wrap narrow doc">
    <h1>Contato</h1>
    <p class="meta">Suporte dos apps, sugestões, imprensa e parcerias.</p>
    <p class="big-mail"><a href="${mailto()}">${esc(COMPANY.email)}</a></p>
    <p>Se for sobre um app, diga qual é e, se puder, o modelo do celular. Quem responde é quem faz o app.</p>

    <h2>Escrever por aqui</h2>
    <p class="muted">O formulário só monta a mensagem e abre o seu app de e-mail. Nada é enviado por este site.</p>
    <form class="form" id="contato-form">
      <label>Sobre o quê
        <select name="assunto">${options}</select>
      </label>
      <label>Mensagem
        <textarea name="mensagem" required></textarea>
      </label>
      <button class="btn btn-solid" type="submit">Abrir no meu e-mail</button>
    </form>

    <h2>Apagar seus dados</h2>
    <p>Nossos apps guardam tudo no seu celular, então na maioria dos casos basta apagar os dados no próprio app ou desinstalar. Cada política explica o passo a passo:</p>
    <ul>
${APPS.map((a) => `      <li><a href="../${a.slug}/privacy.html#exclusao">${esc(a.name)}</a></li>`).join("\n")}
    </ul>
  </article>
</main>
<script>
document.getElementById("contato-form").addEventListener("submit", function (e) {
  e.preventDefault();
  var f = e.target;
  var app = f.assunto.value;
  var subject = app ? app + " - contato pelo site" : "Contato pelo site";
  location.href = "mailto:${COMPANY.email}?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(f.mensagem.value);
});
</script>` +
      footer(out)
  );
}

// ---------- Privacidade do site ----------
function privacidade() {
  const out = "privacidade/index.html";
  write(
    out,
    head({
      out,
      title: `Privacidade deste site · ${COMPANY.name}`,
      description: `Este site não usa cookies, analytics nem rastreadores.`,
    }) +
      header(out, "") +
      `
<main id="conteudo">
  <article class="wrap narrow doc">
    <h1>Privacidade deste site</h1>
    <p class="meta">Última atualização: ${esc(COMPANY.sitePolicyUpdated)}</p>
    <p>Esta página fala sobre o site. A privacidade de cada app está na página dele.</p>
    <h2>O que este site coleta</h2>
    <p><strong>Nada.</strong> Não usamos cookies, analytics, pixels de publicidade nem nenhum tipo de rastreador. As fontes e as imagens são servidas pelo próprio site, sem chamadas a serviços de terceiros.</p>
    <h2>Hospedagem</h2>
    <p>O site é hospedado no GitHub Pages. Como qualquer servidor, o GitHub pode registrar dados técnicos da visita, como o endereço IP, para segurança e funcionamento do serviço, conforme a <a href="https://docs.github.com/pt/site-policy/privacy-policies/github-general-privacy-statement">declaração de privacidade do GitHub</a>. Nós não temos acesso a esses registros.</p>
    <h2>Formulário de contato</h2>
    <p>O formulário da página de contato não envia nada pela internet. Ele só monta o texto e abre o seu app de e-mail; você decide se manda. Se mandar, usamos seu e-mail apenas para responder.</p>
    <h2>Políticas dos apps</h2>
    <ul>
${APPS.map((a) => `      <li><a href="../${a.slug}/privacy.html">${esc(a.name)}</a></li>`).join("\n")}
    </ul>
    <h2>Contato</h2>
    <p><a href="${mailto("Privacidade")}">${esc(COMPANY.email)}</a></p>
  </article>
</main>` +
      footer(out)
  );
}

// ---------- 404 ----------
function notFound() {
  // Caminhos absolutos: o 404 é servido em qualquer URL.
  const base = new URL(SITE_URL).pathname.replace(/\/$/, "") + "/";
  const out = "404.html";
  let html =
    head({ out, title: `Página não encontrada · ${COMPANY.name}`, description: "Página não encontrada.", noindex: true }) +
    header(out, "") +
    `
<main id="conteudo">
  <article class="wrap narrow doc">
    <h1>Essa página não existe.</h1>
    <p>Talvez o endereço tenha mudado. Comece pela <a href="./">página inicial</a> ou vá direto pra um app:</p>
    <ul>
${APPS.map((a) => `      <li><a href="./${a.slug}/">${esc(a.name)}</a></li>`).join("\n")}
    </ul>
  </article>
</main>` +
    footer(out);
  html = html.replace(/(href|src)="\.\/(?!\/)/g, `$1="${base}`);
  write(out, html, { sitemap: false });
}

function sitemap() {
  const urls = pages.map((p) => `  <url><loc>${urlFor(p)}</loc></url>`).join("\n");
  writeFileSync(
    join(ROOT, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );
  writeFileSync(join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
}

home();
for (const app of APPS) {
  appPage(app);
  legalPage(app, "privacy");
  legalPage(app, "terms");
}
sobre();
contato();
privacidade();
notFound();
sitemap();
console.log(`${pages.length + 1} páginas geradas para ${SITE_URL}`);
