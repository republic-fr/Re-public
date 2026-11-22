// Génère la version anglaise du site dans dist/en/, à partir de en/constitution/*.md et en/pages/*.md.
// À lancer après site/build.mjs (qui vide dist/). Usage : node site/build-en.mjs
import fs from 'node:fs';
import path from 'node:path';
import MarkdownIt from 'markdown-it';
import { check, renderRefs, stripIds, headIds, ROMAN } from './refs.mjs';
import { extractSchemas, injectSchemas } from './schemas.mjs';
import { equivalent } from './i18n.mjs';
import { verifier, aRetraduire } from './traduction.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'en', 'constitution');
const PAGES = path.join(ROOT, 'en', 'pages');
const SITE = path.join(ROOT, 'site');
const OUT = path.join(ROOT, 'dist');
const config = JSON.parse(fs.readFileSync(path.join(SITE, 'config.json'), 'utf8'));
const md = new MarkdownIt({ html: true, typographer: false, linkify: false });
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

if (!fs.existsSync(SRC)) { console.log('Pas de version anglaise.'); process.exit(0); }
const v = verifier();
for (const w of v.warnings) console.warn(`Attention (EN) — ${w}`);
if (v.errors.length) { for (const e of v.errors) console.error(`Erreur (EN) — ${e}`); console.error('Version anglaise non générée.'); process.exit(1); }
const stale = aRetraduire();
const refs = check();
const VERSION = config.version.replace('Avant-projet', 'Draft');

// ---------- Lecture du texte ----------

function parseTitre(file) {
  const lines = fs.readFileSync(path.join(SRC, file), 'utf8').trim().split('\n');
  const rawHead = lines[0].replace(/^#\s+/, '');
  const head = stripIds(rawHead);
  const m = head.match(/^Title ([IVX]+) — (.+)$/);
  const t = m
    ? { roman: m[1], name: m[2], slug: headIds(rawHead)[0] }
    : { roman: '', name: head, slug: file.includes('preambule') ? 'preambule' : 'avertissement' };
  t.label = m ? `Title ${m[1]}` : head;
  t.intro = []; t.sections = [];
  let section = null, article = null;
  const push = (heading) => { section = { heading, articles: [] }; t.sections.push(section); };
  for (const line of lines.slice(1)) {
    let h;
    if ((h = line.match(/^##\s+(.+)$/))) { article = null; push(h[1].trim()); continue; }
    if ((h = line.match(/^###\s+Article\s+(\d+)\s+—\s+(.+)$/))) {
      if (!section) push(null);
      const ids = headIds(h[2]);
      article = { num: +h[1], name: stripIds(h[2]).trim(), id: ids[0], aliases: ids.slice(1), body: [] };
      section.articles.push(article);
      continue;
    }
    if (article) article.body.push(line); else t.intro.push(line);
  }
  for (const s of t.sections) for (const a of s.articles) a.text = a.body.join('\n').trim();
  return t;
}

const files = fs.readdirSync(SRC).filter((f) => /^titre-\d+.*\.md$/.test(f)).sort();
const preambule = parseTitre('00-preambule.md');
const titres = files.map(parseTitre);
const articleById = new Map();
for (const t of titres) for (const s of t.sections) for (const a of s.articles) articleById.set(a.id, { t, a });
const titreById = new Map(titres.map((t) => [t.slug, t]));
const urlTitre = (t) => `/en/text/${t.slug}/`;
const urlArticleId = (id) => { const x = articleById.get(id); return x ? `${urlTitre(x.t)}#${id}` : null; };
const refUrl = (e) => (e.kind === 'titre' ? urlTitre(titreById.get(e.primary)) : urlArticleId(e.primary));
const renderBody = (text) => md.render(renderRefs(text, refs.byId, refUrl));
const all = [preambule, ...titres];

// ---------- Gabarit ----------

const NAV = [['Text', '/en/text/'], ['How it works', '/en/how-it-works/'], ['Why', '/en/why/'], ['How', '/en/how/'], ['Comment', '/en/comment/'], ['FAQ', '/en/faq/'], ['Contact', '/en/contact/']];
const DESCRIPTION = 'Draft Constitution for a deliberative French Republic: laws made by citizens’ conventions drawn by lot.';
const wordmark = (size = '') => `<a class="rp-wordmark" href="/en/" aria-label="REpublic, home"${size ? ` style="font-size:${size}"` : ''}><span class="rp-wordmark__re">RE</span><span class="rp-wordmark__public">PUBLIC</span></a>`;

// ---------- Données structurées (schema.org), reliées à la version française ----------

const ORG_ID = `${config.siteUrl}/#org`;
const SITE_ID = `${config.siteUrl}/en/#website`;
const LAW_ID = `${config.siteUrl}/en/text/#constitution`;
const LAW_FR = `${config.siteUrl}/texte/#constitution`;
const LAW_NAME = 'Constitution of the Deliberative French Republic (draft)';
const draft = { inLanguage: 'en', creativeWorkStatus: 'Draft', legislationLegalForce: { '@id': 'https://schema.org/NotInForce' }, publisher: { '@id': ORG_ID }, version: VERSION };
const crumbs = (items) => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: config.siteUrl + p })) });
const webPage = (p, name, extra = {}) => ({ '@type': 'WebPage', '@id': config.siteUrl + p, url: config.siteUrl + p, name, inLanguage: 'en', isPartOf: { '@id': SITE_ID }, translationOfWork: { '@id': config.siteUrl + equivalent(p) }, ...extra });

function layout({ title, description = DESCRIPTION, current = '', body, bodyClass = '', path: p = '/en/', noindex = false, ogType = 'website', jsonld = [] }) {
  const ld = jsonld.length ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': jsonld }).replace(/</g, '\\u003c')}</script>` : '';
  const url = config.siteUrl + p;
  const full = title ? `${title} — ${config.siteName}` : `${config.siteName} — Draft deliberative Constitution`;
  const nav = NAV.map(([label, href]) => `<a href="${href}"${current === href ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="${ogType}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="${config.siteName}">
<meta property="og:locale" content="en_GB">
<meta property="og:image" content="${config.siteUrl}/assets/og.png">
<meta name="twitter:card" content="summary_large_image">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="en" href="${url}">
<link rel="alternate" hreflang="fr" href="${config.siteUrl}${equivalent(p)}">`}
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/assets/style.css">
<script>window.REPUBLIC=${JSON.stringify({ giscus: config.giscus, repo: config.repo })};</script>
<script src="/assets/app.js" defer></script>
${ld}
</head>
<body class="rp ${bodyClass}">
<a class="skip" href="#content">Skip to content</a>
<header class="site-header">
  <div class="wrap site-header__in">
    ${wordmark('20px')}
    <button class="menu-toggle" aria-expanded="false" aria-controls="nav">Menu</button>
    <nav id="nav" class="site-nav" aria-label="Main navigation">${nav}<a class="site-nav__lang" href="${equivalent(p)}" hreflang="fr" lang="fr">FR</a></nav>
  </div>
</header>
<main id="content">
${body}
</main>
<footer class="site-footer">
  <div class="wrap site-footer__in">
    <div><div class="rp-sortition" data-sortition="12" aria-hidden="true" style="--cell:8px;--gap:3px"></div></div>
    <div class="site-footer__cols">
      <p>${wordmark('16px')}</p>
      <p>${esc(VERSION)}. Working draft, open to comments. English translation; the French text prevails.</p>
      <p><a href="https://github.com/${config.repo}">Source code and history on GitHub</a></p>
    </div>
  </div>
</footer>
</body>
</html>`;
}

function write(rel, html) {
  const file = path.join(OUT, 'en', rel, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

// ---------- Texte ----------

const range = (t) => { const n = t.sections.flatMap((s) => s.articles.map((a) => a.num)); return n.length ? (n.length > 1 ? `Art. ${n[0]} to ${n[n.length - 1]}` : `Art. ${n[0]}`) : ''; };
const nameOf = (t) => (t.roman ? t.name : 'Preamble');

function sideNav(slug) {
  const items = all.map((t) => {
    const cur = t.slug === slug;
    const arts = cur ? `<ol class="toc__arts">${t.sections.flatMap((s) => s.articles).map((a) => `<li><a href="#${a.id}"><span>${a.num}</span>${esc(a.name)}</a></li>`).join('')}</ol>` : '';
    return `<li${cur ? ' class="is-current"' : ''}><a href="${urlTitre(t)}"${cur ? ' aria-current="page"' : ''}><span class="toc__n">${t.roman || '—'}</span>${esc(nameOf(t))}</a>${arts}</li>`;
  }).join('');
  return `<nav class="toc" aria-label="Table of contents"><p class="toc__head">Contents</p><ol>${items}</ol></nav>`;
}

function articleHtml(t, s, a) {
  const cat = [t.label, s.heading ? s.heading.split(' — ')[0] : ''].filter(Boolean).join('<br>');
  const aliases = a.aliases.map((x) => `<span id="${x}" class="rp-anchor"></span>`).join('');
  const note = stale.articles.has(a.id) ? `<p class="translation-note">The French text of this article has changed since it was translated. <a href="/texte/${t.slug}/#${a.id}" lang="fr">Read the French version</a>, which prevails.</p>` : '';
  return `${aliases}<article class="rp-article" id="${a.id}">
  <div class="rp-article__cat">${cat}</div>
  <div class="rp-article__main">
    <p class="rp-article__num" aria-hidden="true">${a.num}</p>
    <h3 class="rp-article__title"><span class="sr">Article ${a.num} — </span>${esc(a.name)}</h3>
    ${note}<div class="rp-article__body">${renderBody(a.text)}</div>
    <div class="rp-article__foot">
      <button class="rp-btn rp-btn--link js-comment" data-term="${esc(a.id)}" aria-expanded="false">Comment</button>
      <span aria-hidden="true">·</span>
      <a class="rp-btn rp-btn--link js-permalink" href="#${a.id}">Link to this article</a>
    </div>
    <div class="comments" hidden></div>
  </div>
</article>`;
}

function titrePage(t, prev, next) {
  const sections = t.sections.map((s) => `${s.heading ? `<h2 class="section-title">${esc(s.heading)}</h2>` : ''}${s.articles.map((a) => articleHtml(t, s, a)).join('\n')}`).join('\n');
  const intro = t.intro.join('\n').trim();
  const label = (x) => (x.roman ? `Title ${x.roman} — ${x.name}` : 'Preamble');
  const pager = `<nav class="pager" aria-label="Adjacent titles">${prev ? `<a href="${urlTitre(prev)}"><span>Previous</span>${esc(label(prev))}</a>` : '<span></span>'}${next ? `<a class="pager__next" href="${urlTitre(next)}"><span>Next</span>${esc(label(next))}</a>` : ''}</nav>`;
  const body = `<div class="wrap text-layout">
  <aside class="text-layout__side">${sideNav(t.slug)}</aside>
  <div class="text-layout__main">
    <header class="titre-head">
      <div class="rp-tags"><span class="rp-tag rp-tag--solid">${esc(t.label)}</span>${range(t) ? `<span class="rp-tag">${range(t)}</span>` : ''}</div>
      <h1 class="titre-head__name">${esc(nameOf(t))}</h1>
    </header>
    ${intro ? `<div class="preamble">${renderBody(intro)}</div>` : ''}
    ${sections}
    ${pager}
  </div>
</div>`;
  const p = urlTitre(t);
  const arts = t.sections.flatMap((s) => s.articles);
  const id = t.roman ? `Title ${t.roman}` : 'Preamble';
  const law = {
    '@type': 'Legislation', '@id': `${config.siteUrl}${p}#titre`, name: `${LAW_NAME} — ${label(t)}`, url: config.siteUrl + p,
    legislationIdentifier: id, isPartOf: { '@id': LAW_ID }, translationOfWork: { '@id': `${config.siteUrl}/texte/${t.slug}/#titre` }, ...draft,
    hasPart: arts.map((a) => ({ '@type': 'Legislation', name: `Article ${a.num} — ${a.name}`, legislationIdentifier: `Article ${a.num}`, url: `${config.siteUrl}${p}#${a.id}`, translationOfWork: { '@id': `${config.siteUrl}/texte/${t.slug}/#${a.id}` }, ...draft })),
  };
  const jsonld = [webPage(p, label(t), { mainEntity: { '@id': law['@id'] }, breadcrumb: crumbs([['Home', '/en/'], ['Text', '/en/text/'], [label(t), p]]) }), law];
  return layout({ title: label(t), current: '/en/text/', body, bodyClass: 'page-text', path: p, ogType: 'article', jsonld });
}

const searchBox = `<form class="search" role="search" action="/en/text/" onsubmit="return false">
  <label class="search__label" for="q">Search the Constitution</label>
  <input class="rp-input search__input" id="q" type="search" placeholder="A word, or an article number: “petition”, “17”…" autocomplete="off">
  <ol class="search__results" aria-live="polite"></ol>
</form>`;

function sommaire() {
  const rows = all.map((t) => `<section class="sommaire__titre">
  <h2><a href="${urlTitre(t)}"><span>${t.roman ? `Title ${t.roman}` : '—'}</span>${esc(nameOf(t))}</a></h2>
  ${t.sections.map((s) => `${s.heading ? `<h3>${esc(s.heading)}</h3>` : ''}<ol>${s.articles.map((a) => `<li><a href="${urlTitre(t)}#${a.id}"><span>${a.num}</span>${esc(a.name)}</a></li>`).join('')}</ol>`).join('')}
</section>`).join('');
  const body = `<div class="wrap page-head"><div class="rp-tags"><span class="rp-tag rp-tag--solid">Text</span><span class="rp-tag">${titres.length} titles · ${articleById.size} articles</span></div><h1 class="rp-title">Constitution of the Deliberative Republic</h1>${searchBox}</div>
<div class="wrap prose"><p class="note">This is an English translation of a French draft. The <a href="/texte/" lang="fr">French text</a> prevails.</p></div>
<div class="wrap sommaire">${rows}</div>`;
  const law = {
    '@type': 'Legislation', '@id': LAW_ID, name: LAW_NAME, url: `${config.siteUrl}/en/text/`, legislationType: 'Constitution', legislationJurisdiction: 'FR',
    description: DESCRIPTION, translationOfWork: { '@id': LAW_FR }, ...draft, hasPart: all.map((t) => ({ '@id': `${config.siteUrl}${urlTitre(t)}#titre` })),
  };
  const jsonld = [webPage('/en/text/', 'The text', { mainEntity: { '@id': LAW_ID }, breadcrumb: crumbs([['Home', '/en/'], ['Text', '/en/text/']]) }), law];
  return layout({ title: 'The text', current: '/en/text/', body, path: '/en/text/', jsonld });
}

function home() {
  const grid = `<ol class="titre-grid">${all.map((t) => `<li><a href="${urlTitre(t)}"><span class="titre-grid__n">${t.roman || '—'}</span><span class="titre-grid__name">${esc(nameOf(t))}</span><span class="titre-grid__meta">${range(t) || 'Principles'}</span></a></li>`).join('')}</ol>`;
  const body = `<section class="hero wrap">
  <div class="rp-tags"><span class="rp-tag rp-tag--solid">Draft</span><span class="rp-tag">deliberative Constitution</span></div>
  <h1 class="rp-display hero__title">Rethinking democracy <br class="br-wide">through sortition</h1>
  <div class="hero__grid">
    <p class="hero__lead">A ready-to-use democratic model for the twenty-first century: a Republic where laws are written by conventions of citizens drawn by lot. The text is open: <span style="white-space:nowrap">read it</span>, <span style="white-space:nowrap">comment on it</span> article by article.</p>
    <div class="rp-sortition hero__mark" data-sortition="14" aria-hidden="true" style="--cell:12px;--gap:4px"></div>
  </div>
</section>
<section class="wrap home-text" aria-labelledby="contents">
  <div class="home-text__head">
    <h2 id="contents" class="rp-title">The text</h2>
    ${searchBox}
  </div>
  ${grid}
</section>
<section class="wrap home-more">
  <a class="home-more__card" href="/en/why/"><span class="rp-tag rp-tag--solid">Why</span><span class="home-more__t">The diagnosis, and what the Constitution changes for you.</span></a>
  <a class="home-more__card" href="/en/how-it-works/"><span class="rp-tag rp-tag--solid">How it works</span><span class="home-more__t">The system in diagrams: laws, ministries, justice, crises.</span></a>
  <a class="home-more__card" href="/en/how/"><span class="rp-tag rp-tag--solid">How</span><span class="home-more__t">The steps to get there, the cost, the role of citizens.</span></a>
  <a class="home-more__card" href="/en/comment/"><span class="rp-tag rp-tag--solid">Comment</span><span class="home-more__t">Suggest a change or discuss an article.</span></a>
</section>`;
  const jsonld = [
    { '@type': 'Organization', '@id': ORG_ID, name: config.siteName, url: `${config.siteUrl}/`, logo: `${config.siteUrl}/assets/og.png` },
    { '@type': 'WebSite', '@id': SITE_ID, url: `${config.siteUrl}/en/`, name: config.siteName, description: DESCRIPTION, inLanguage: 'en', publisher: { '@id': ORG_ID },
      potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${config.siteUrl}/en/text/?q={search_term_string}` }, 'query-input': 'required name=search_term_string' } },
    webPage('/en/', `${config.siteName} — Rethinking democracy through sortition`, { about: { '@id': LAW_ID } }),
  ];
  return layout({ title: '', body, current: '/en/', bodyClass: 'page-home', path: '/en/', jsonld });
}

// ---------- Pages éditoriales ----------

function contentPage(file, href, frHref) {
  let raw = fs.readFileSync(path.join(PAGES, file), 'utf8');
  const fm = {};
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (m) { for (const l of m[1].split('\n')) { const [k, ...vv] = l.split(':'); fm[k.trim()] = vv.join(':').trim(); } raw = raw.slice(m[0].length); }
  const [mu, mdom] = (config.contactEmail || '').split('@');
  const mailBtn = mu ? `<p><a class="rp-btn rp-btn--primary js-mail" href="#" data-u="${esc([...mu].reverse().join(''))}" data-d="${esc([...mdom].reverse().join(''))}">Write to the team</a></p><noscript><p>${esc(mu)} [at] ${esc(mdom)}</p></noscript>` : '';
  const form = config.contactFormKey ? `<form class="contact-form" action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value="${esc(config.contactFormKey)}">
  <input type="hidden" name="subject" value="Message from the REpublic website (English)">
  <input type="checkbox" name="botcheck" class="sr" tabindex="-1" autocomplete="off">
  <label>Your name or pseudonym <span>(optional)</span><input class="rp-input" name="name" autocomplete="name"></label>
  <label>Your email, so we can reply <span>(optional)</span><input class="rp-input" type="email" name="email" autocomplete="email"></label>
  <label>Message<textarea class="rp-input" name="message" rows="7" required></textarea></label>
  <button class="rp-btn rp-btn--primary" type="submit">Send</button>
  <p class="contact-form__status" role="status" aria-live="polite"></p>
</form>${mailBtn ? `<p class="note">Prefer to write directly?</p>${mailBtn}` : ''}` : '';
  raw = raw.replaceAll('{{contactLine}}', form || mailBtn).replaceAll('{{repo}}', config.repo);
  const { text, schemas } = extractSchemas(raw, `en/pages/${file}`);
  const inline = (t) => md.renderInline(renderRefs(t, refs.byId, refUrl));
  const html = injectSchemas(renderBody(text), schemas, inline, 'en');
  const note = stale.pages.has(file) ? `<p class="translation-note">The French version of this page has changed since it was translated. <a href="${frHref}" lang="fr">Read the French version</a>.</p>` : '';
  const body = `<div class="wrap page-head"><div class="rp-tags"><span class="rp-tag rp-tag--solid">${esc(fm.tag || fm.title)}</span>${fm.subtag ? `<span class="rp-tag">${esc(fm.subtag)}</span>` : ''}</div><h1 class="rp-title">${esc(fm.title)}</h1></div>
<div class="wrap prose${fm.faq === 'true' ? ' faq' : ''}">${note}${html}</div>`;
  const extra = {};
  if (fm.faq === 'true') {
    const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const qa = [...html.matchAll(/<h3>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h[23]>|$)/g)].map((x) => ({ '@type': 'Question', name: strip(x[1]), acceptedAnswer: { '@type': 'Answer', text: strip(x[2]) } }));
    extra['@type'] = ['WebPage', 'FAQPage']; extra.mainEntity = qa;
  }
  const jsonld = [webPage(href, fm.title, { description: fm.description || DESCRIPTION, publisher: { '@id': ORG_ID }, breadcrumb: crumbs([['Home', '/en/'], [fm.title, href]]), ...extra })];
  return layout({ title: fm.title, description: fm.description || DESCRIPTION, current: href, body, path: href, jsonld });
}

// ---------- Construction ----------

write('', home());
write('text', sommaire());
all.forEach((t, i) => write(`text/${t.slug}`, titrePage(t, all[i - 1], all[i + 1])));
const pagesEn = [['pourquoi.md', '/en/why/', '/pourquoi/'], ['fonctionnement.md', '/en/how-it-works/', '/fonctionnement/'], ['comment.md', '/en/how/', '/comment/'], ['commenter.md', '/en/comment/', '/commenter/'], ['faq.md', '/en/faq/', '/faq/'], ['contact.md', '/en/contact/', '/contact/']];
for (const [file, href, fr] of pagesEn) if (fs.existsSync(path.join(PAGES, file))) write(href.replace(/^\/en\//, '').replace(/\/$/, ''), contentPage(file, href, fr));

const plain = (s) => s.replace(/[#*_>`\[\]]/g, '').replace(/\s+/g, ' ').trim();
const index = [...articleById.values()].map(({ t, a }) => ({ n: a.num, t: a.name, g: `Title ${t.roman}`, u: urlArticleId(a.id), x: plain(a.text) }));
fs.writeFileSync(path.join(OUT, 'en', 'search.json'), JSON.stringify(index));

// Plan du site : ajout des adresses anglaises.
const sitemap = path.join(OUT, 'sitemap.xml');
if (fs.existsSync(sitemap)) {
  const urls = ['/en/', '/en/text/', ...all.map(urlTitre), ...pagesEn.filter(([f]) => fs.existsSync(path.join(PAGES, f))).map(([, h]) => h)];
  fs.writeFileSync(sitemap, fs.readFileSync(sitemap, 'utf8').replace('</urlset>', `${urls.map((u) => `<url><loc>${config.siteUrl}${u}</loc></url>`).join('')}</urlset>`));
}
console.log(`Version anglaise : ${all.length} pages de texte, ${articleById.size} articles → dist/en/`);
