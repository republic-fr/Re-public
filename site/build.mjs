// Génère le site statique dans dist/ à partir de constitution/*.md et site/pages/*.md.
// Usage : node site/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import MarkdownIt from 'markdown-it';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'constitution');
const SITE = path.join(ROOT, 'site');
const OUT = path.join(ROOT, 'dist');
const config = JSON.parse(fs.readFileSync(path.join(SITE, 'config.json'), 'utf8'));
const md = new MarkdownIt({ html: true, typographer: false, linkify: false });

const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- Lecture du texte constitutionnel ----------

function stripWorkNotes(text) {
  const cut = text.indexOf('\n---\n\n*Commentaires de travail');
  if (cut >= 0) text = text.slice(0, cut);
  return text.replace(/\[\^c\d+\]/g, '').trim();
}

function parseTitre(file) {
  const raw = stripWorkNotes(fs.readFileSync(path.join(SRC, file), 'utf8'));
  const lines = raw.split('\n');
  const head = lines[0].replace(/^#\s+/, '');
  const m = head.match(/^Titre ([IVX]+) — (.+)$/);
  const titre = m
    ? { roman: m[1], num: ROMAN.indexOf(m[1]) + 1, name: m[2], slug: `titre-${String(ROMAN.indexOf(m[1]) + 1).padStart(2, '0')}` }
    : { roman: '', num: 0, name: head, slug: 'preambule' };
  titre.label = m ? `Titre ${m[1]}` : head;
  titre.intro = [];
  titre.sections = []; // { heading, articles: [] } — heading peut être null
  let section = null, article = null;
  const pushSection = (heading) => { section = { heading, articles: [] }; titre.sections.push(section); };
  for (const line of lines.slice(1)) {
    let h;
    if ((h = line.match(/^##\s+(.+)$/))) { article = null; pushSection(h[1].trim()); continue; }
    if ((h = line.match(/^###\s+Article\s+(\d+)\s+—\s+(.+)$/))) {
      if (!section) pushSection(null);
      article = { num: +h[1], name: h[2].trim(), body: [] };
      section.articles.push(article);
      continue;
    }
    if (article) article.body.push(line); else titre.intro.push(line);
  }
  for (const s of titre.sections) for (const a of s.articles) a.text = a.body.join('\n').trim();
  return titre;
}

const files = fs.readdirSync(SRC).filter((f) => /^titre-\d+.*\.md$/.test(f)).sort();
const preambule = parseTitre('00-preambule.md');
const titres = files.map(parseTitre);
const articleIndex = new Map(); // num -> { titre, article, section }
for (const t of titres) for (const s of t.sections) for (const a of s.articles) articleIndex.set(a.num, { t, s, a });
const titreByRoman = new Map(titres.map((t) => [t.roman, t]));
const urlTitre = (t) => `/texte/${t.slug}/`;
const urlArticle = (n) => { const x = articleIndex.get(n); return x ? `${urlTitre(x.t)}#article-${n}` : null; };

// Liens automatiques vers les articles et les titres cités dans le texte.
function linkify(text) {
  text = text.replace(/\b(articles?)\s+((?:\d{1,3})(?:(?:\s*,\s*|\s+et\s+|\s+à\s+)\d{1,3})*)/gi, (all, word, nums) =>
    `${word} ` + nums.replace(/\d{1,3}/g, (n) => { const u = urlArticle(+n); return u ? `<a href="${u}">${n}</a>` : n; }));
  text = text.replace(/\b(Titres?)\s+([IVX]+)\b(?:\s+et\s+([IVX]+)\b)?/g, (all, word, r1, r2) => {
    const l = (r) => { const t = titreByRoman.get(r); return t ? `<a href="${urlTitre(t)}">${r}</a>` : r; };
    return `${word} ${l(r1)}${r2 ? ` et ${l(r2)}` : ''}`;
  });
  return text;
}
const renderBody = (text) => md.render(linkify(text));

// ---------- Gabarit ----------

const NAV = [
  ['Texte', '/texte/'],
  ['Pourquoi', '/pourquoi/'],
  ['Comment', '/comment/'],
  ['Commenter', '/commenter/'],
  ['Contact', '/contact/'],
];

const wordmark = (size = '') => `<a class="rp-wordmark" href="/" aria-label="REpublic, accueil"${size ? ` style="font-size:${size}"` : ''}><span class="rp-wordmark__re">RE</span><span class="rp-wordmark__public">PUBLIC</span></a>`;

function layout({ title, description = config.description, current = '', body, bodyClass = '' }) {
  const fullTitle = title ? `${title} — ${config.siteName}` : `${config.siteName} — Avant-projet de Constitution délibérative`;
  const nav = NAV.map(([label, href]) => `<a href="${href}"${current === href ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/assets/style.css">
<script>window.REPUBLIC=${JSON.stringify({ giscus: config.giscus, repo: config.repo })};</script>
<script src="/assets/app.js" defer></script>
</head>
<body class="rp ${bodyClass}">
<a class="skip" href="#contenu">Aller au contenu</a>
<header class="site-header">
  <div class="wrap site-header__in">
    ${wordmark('20px')}
    <button class="menu-toggle" aria-expanded="false" aria-controls="nav">Menu</button>
    <nav id="nav" class="site-nav" aria-label="Navigation principale">${nav}</nav>
  </div>
</header>
<main id="contenu">
${body}
</main>
<footer class="site-footer">
  <div class="wrap site-footer__in">
    <div>
      <div class="rp-sortition" data-sortition="12" aria-hidden="true" style="--cell:8px;--gap:3px"></div>
    </div>
    <div class="site-footer__cols">
      <p>${wordmark('16px')}</p>
      <p>${esc(config.version)}. Texte de travail, ouvert aux commentaires.</p>
      <p><a href="https://github.com/${config.repo}">Code source et historique sur GitHub</a></p>
    </div>
  </div>
</footer>
</body>
</html>`;
}

function write(rel, html) {
  const file = path.join(OUT, rel, rel.endsWith('.html') ? '' : 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

// ---------- Pages du texte ----------

const articleRange = (t) => {
  const nums = t.sections.flatMap((s) => s.articles.map((a) => a.num));
  return nums.length ? (nums.length > 1 ? `Art. ${nums[0]} à ${nums[nums.length - 1]}` : `Art. ${nums[0]}`) : '';
};

function sideNav(currentSlug) {
  const items = [preambule, ...titres].map((t) => {
    const cur = t.slug === currentSlug;
    const arts = cur ? `<ol class="toc__arts">${t.sections.flatMap((s) => s.articles).map((a) => `<li><a href="#article-${a.num}"><span>${a.num}</span>${esc(a.name)}</a></li>`).join('')}</ol>` : '';
    return `<li${cur ? ' class="is-current"' : ''}><a href="${urlTitre(t)}"${cur ? ' aria-current="page"' : ''}><span class="toc__n">${t.roman || '—'}</span>${esc(t.roman ? t.name : 'Préambule')}</a>${arts}</li>`;
  }).join('');
  return `<nav class="toc" aria-label="Sommaire de la Constitution"><p class="toc__head">Sommaire</p><ol>${items}</ol></nav>`;
}

function articleHtml(t, s, a) {
  const cat = [t.label, s.heading ? s.heading.split(' — ')[0] : ''].filter(Boolean).join('<br>');
  const term = `Article ${a.num} — ${a.name}`;
  return `<article class="rp-article" id="article-${a.num}">
  <div class="rp-article__cat">${cat}</div>
  <div class="rp-article__main">
    <p class="rp-article__num" aria-hidden="true">${a.num}</p>
    <h3 class="rp-article__title"><span class="sr">Article ${a.num} — </span>${esc(a.name)}</h3>
    <div class="rp-article__body">${renderBody(a.text)}</div>
    <div class="rp-article__foot">
      <button class="rp-btn rp-btn--link js-comment" data-term="${esc(term)}" aria-expanded="false">Commenter</button>
      <span aria-hidden="true">·</span>
      <a class="rp-btn rp-btn--link js-permalink" href="#article-${a.num}">Lien vers l’article</a>
    </div>
    <div class="comments" hidden></div>
  </div>
</article>`;
}

function titrePage(t, prev, next) {
  const sections = t.sections.map((s) => `${s.heading ? `<h2 class="section-title">${esc(s.heading)}</h2>` : ''}${s.articles.map((a) => articleHtml(t, s, a)).join('\n')}`).join('\n');
  const intro = t.intro.join('\n').trim();
  const pager = `<nav class="pager" aria-label="Titres voisins">${prev ? `<a href="${urlTitre(prev)}"><span>Précédent</span>${esc(prev.roman ? `Titre ${prev.roman} — ${prev.name}` : 'Préambule')}</a>` : '<span></span>'}${next ? `<a class="pager__next" href="${urlTitre(next)}"><span>Suivant</span>${esc(`Titre ${next.roman} — ${next.name}`)}</a>` : ''}</nav>`;
  const body = `<div class="wrap text-layout">
  <aside class="text-layout__side">${sideNav(t.slug)}</aside>
  <div class="text-layout__main">
    <header class="titre-head">
      <div class="rp-tags"><span class="rp-tag rp-tag--solid">${esc(t.label)}</span>${articleRange(t) ? `<span class="rp-tag">${articleRange(t)}</span>` : ''}</div>
      <h1 class="titre-head__name">${esc(t.roman ? t.name : 'Préambule')}</h1>
    </header>
    ${intro ? `<div class="preamble">${renderBody(intro)}</div>` : ''}
    ${sections}
    ${pager}
  </div>
</div>`;
  return layout({ title: t.roman ? `Titre ${t.roman} — ${t.name}` : 'Préambule', current: '/texte/', body, bodyClass: 'page-text' });
}

// ---------- Accueil et sommaire ----------

function titreGrid() {
  return `<ol class="titre-grid">${[preambule, ...titres].map((t) => `<li><a href="${urlTitre(t)}"><span class="titre-grid__n">${t.roman || '—'}</span><span class="titre-grid__name">${esc(t.roman ? t.name : 'Préambule')}</span><span class="titre-grid__meta">${articleRange(t) || 'Principes'}</span></a></li>`).join('')}</ol>`;
}

const searchBox = `<form class="search" role="search" action="/texte/" onsubmit="return false">
  <label class="search__label" for="q">Chercher dans la Constitution</label>
  <input class="rp-input search__input" id="q" type="search" placeholder="Un mot, ou un numéro d’article : « pétition », « 17 »…" autocomplete="off">
  <ol class="search__results" aria-live="polite"></ol>
</form>`;

function home() {
  const body = `<section class="hero wrap">
  <div class="rp-tags"><span class="rp-tag rp-tag--solid">Avant-projet</span><span class="rp-tag">de Constitution délibérative</span></div>
  <h1 class="rp-display hero__title">Plus qu’un vote</h1>
  <div class="hero__grid">
    <p class="hero__lead">Une République où la loi est écrite par des conventions de citoyennes et de citoyens tirés au sort, protégées, outillées et contrôlées. Le texte est ouvert : lisez-le, commentez-le article par article.</p>
    <div class="rp-sortition hero__mark" data-sortition="14" aria-hidden="true" style="--cell:12px;--gap:4px"></div>
  </div>
</section>
<section class="wrap home-text" aria-labelledby="sommaire">
  <div class="home-text__head">
    <h2 id="sommaire" class="rp-title">Le texte</h2>
    ${searchBox}
  </div>
  ${titreGrid()}
</section>
<section class="wrap home-more">
  <a class="home-more__card" href="/pourquoi/"><span class="rp-tag rp-tag--solid">Pourquoi</span><span class="home-more__t">Le diagnostic, et ce que la Constitution change pour vous.</span></a>
  <a class="home-more__card" href="/comment/"><span class="rp-tag rp-tag--solid">Comment</span><span class="home-more__t">Les étapes pour y parvenir, le coût, la place des citoyens.</span></a>
  <a class="home-more__card" href="/commenter/"><span class="rp-tag rp-tag--solid">Commenter</span><span class="home-more__t">Proposer une modification ou discuter un article.</span></a>
</section>`;
  return layout({ title: '', body, current: '/', bodyClass: 'page-home' });
}

function sommaire() {
  const rows = [preambule, ...titres].map((t) => `<section class="sommaire__titre">
  <h2><a href="${urlTitre(t)}"><span>${t.roman ? `Titre ${t.roman}` : '—'}</span>${esc(t.roman ? t.name : 'Préambule')}</a></h2>
  ${t.sections.map((s) => `${s.heading ? `<h3>${esc(s.heading)}</h3>` : ''}<ol>${s.articles.map((a) => `<li><a href="${urlTitre(t)}#article-${a.num}"><span>${a.num}</span>${esc(a.name)}</a></li>`).join('')}</ol>`).join('')}
</section>`).join('');
  const body = `<div class="wrap page-head"><div class="rp-tags"><span class="rp-tag rp-tag--solid">Texte</span><span class="rp-tag">${titres.length} titres · ${articleIndex.size} articles</span></div><h1 class="rp-title">Constitution de la République délibérative</h1>${searchBox}</div>
<div class="wrap sommaire">${rows}</div>`;
  return layout({ title: 'Le texte', current: '/texte/', body });
}

// ---------- Pages éditoriales ----------

function contentPage(file, href) {
  let raw = fs.readFileSync(path.join(SITE, 'pages', file), 'utf8');
  const fm = {};
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (m) { for (const l of m[1].split('\n')) { const [k, ...v] = l.split(':'); fm[k.trim()] = v.join(':').trim(); } raw = raw.slice(m[0].length); }
  const contactLine = config.contactEmail
    ? `<p><a class="rp-btn rp-btn--primary" href="mailto:${esc(config.contactEmail)}">${esc(config.contactEmail)}</a></p>`
    : `<p><a class="rp-btn rp-btn--primary" href="https://github.com/${config.repo}/discussions">Écrire sur GitHub</a></p>`;
  raw = raw.replaceAll('{{contactLine}}', contactLine).replaceAll('{{repo}}', config.repo);
  const body = `<div class="wrap page-head"><div class="rp-tags"><span class="rp-tag rp-tag--solid">${esc(fm.tag || fm.title)}</span>${fm.subtag ? `<span class="rp-tag">${esc(fm.subtag)}</span>` : ''}</div><h1 class="rp-title">${esc(fm.title)}</h1></div>
<div class="wrap prose">${md.render(linkify(raw))}</div>`;
  return layout({ title: fm.title, description: fm.description || config.description, current: href, body });
}

// ---------- Construction ----------

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.cpSync(path.join(SITE, 'assets'), path.join(OUT, 'assets'), { recursive: true });

write('', home());
write('texte', sommaire());
const all = [preambule, ...titres];
all.forEach((t, i) => write(`texte/${t.slug}`, titrePage(t, all[i - 1], all[i + 1])));
for (const [file, href] of [['pourquoi.md', '/pourquoi/'], ['comment.md', '/comment/'], ['commenter.md', '/commenter/'], ['contact.md', '/contact/']]) {
  write(href.replaceAll('/', ''), contentPage(file, href));
}

// Index de recherche
const plain = (s) => s.replace(/[#*_>`\[\]]/g, '').replace(/\s+/g, ' ').trim();
const searchIndex = [...articleIndex.values()].map(({ t, a }) => ({ n: a.num, t: a.name, g: `Titre ${t.roman}`, u: urlArticle(a.num), x: plain(a.text) }));
fs.writeFileSync(path.join(OUT, 'search.json'), JSON.stringify(searchIndex));

// Fichiers utilitaires
fs.writeFileSync(path.join(OUT, '404.html'), layout({ title: 'Page introuvable', body: `<div class="wrap page-head"><h1 class="rp-display">404</h1><p>Cette page n’existe pas. <a href="/texte/">Revenir au texte</a>.</p></div>` }));
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${config.siteUrl}/sitemap.xml\n`);
const urls = ['/', '/texte/', ...all.map(urlTitre), '/pourquoi/', '/comment/', '/commenter/', '/contact/'];
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((u) => `<url><loc>${config.siteUrl}${u}</loc></url>`).join('')}</urlset>\n`);

console.log(`Site généré : ${all.length} pages de texte, ${articleIndex.size} articles → dist/`);
