// Génère le site statique dans dist/ à partir de constitution/*.md et site/pages/*.md.
// Usage : node site/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import MarkdownIt from 'markdown-it';
import { check, renderRefs, stripIds, headIds, ROMAN } from './refs.mjs';
import { extractSchemas, injectSchemas } from './schemas.mjs';
import { comparer } from './refonte.mjs';
import { equivalent } from './i18n.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'constitution');
const SITE = path.join(ROOT, 'site');
const OUT = path.join(ROOT, 'dist');
const config = JSON.parse(fs.readFileSync(path.join(SITE, 'config.json'), 'utf8'));
const md = new MarkdownIt({ html: true, typographer: false, linkify: false });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- Vérification des renvois (bloque la publication en cas d'erreur) ----------

const refs = check();
for (const w of refs.warnings) console.warn(`Attention — ${w}`);
if (refs.errors.length) {
  for (const e of refs.errors) console.error(`Erreur — ${e}`);
  console.error(`${refs.errors.length} erreur(s) dans les renvois : site non généré.`);
  process.exit(1);
}

// ---------- Lecture du texte constitutionnel ----------

function stripWorkNotes(text) {
  const cut = text.indexOf('\n---\n\n*Commentaires de travail');
  if (cut >= 0) text = text.slice(0, cut);
  return text.replace(/\[\^c\d+\]/g, '').trim();
}

function parseTitre(file) {
  const raw = stripWorkNotes(fs.readFileSync(path.join(SRC, file), 'utf8'));
  const lines = raw.split('\n');
  const rawHead = lines[0].replace(/^#\s+/, '');
  const head = stripIds(rawHead);
  const m = head.match(/^Titre ([IVX]+) — (.+)$/);
  const titre = m
    ? { roman: m[1], num: ROMAN.indexOf(m[1]) + 1, name: m[2], slug: headIds(rawHead)[0], aliases: headIds(rawHead).slice(1) }
    : { roman: '', num: 0, name: head, slug: 'preambule', aliases: [] };
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
      const ids = headIds(h[2]);
      article = { num: +h[1], name: stripIds(h[2]).trim(), id: ids[0], aliases: ids.slice(1), body: [] };
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
const articleById = new Map(); // identifiant permanent -> { titre, article, section }
const titreById = new Map(titres.map((t) => [t.slug, t]));
for (const t of titres) for (const s of t.sections) for (const a of s.articles) { articleIndex.set(a.num, { t, s, a }); articleById.set(a.id, { t, s, a }); }
const urlTitre = (t) => `/texte/${t.slug}/`;
const urlArticleId = (id) => { const x = articleById.get(id); return x ? `${urlTitre(x.t)}#${id}` : null; };

// Renvois écrits avec l'identifiant permanent : lien et numéro à jour.
const refUrl = (e) => (e.kind === 'titre' ? urlTitre(titreById.get(e.primary)) : urlArticleId(e.primary));
const renderBody = (text) => md.render(renderRefs(text, refs.byId, refUrl));

// ---------- Gabarit ----------

const NAV = [
  ['Texte', '/texte/'],
  ['Fonctionnement', '/fonctionnement/'],
  ['Pourquoi', '/pourquoi/'],
  ['Comment', '/comment/'],
  ['Commenter', '/commenter/'],
  ['FAQ', '/faq/'],
  ['Contact', '/contact/'],
];

const wordmark = (size = '') => `<a class="rp-wordmark" href="/" aria-label="REpublic, accueil"${size ? ` style="font-size:${size}"` : ''}><span class="rp-wordmark__re">RE</span><span class="rp-wordmark__public">PUBLIC</span></a>`;

function layout({ title, description = config.description, current = '', body, bodyClass = '', path = '/', jsonld = [], ogType = 'website', noindex = false }) {
  const url = config.siteUrl + path;
  const ld = jsonld.length ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': jsonld }).replace(/</g, '\\u003c')}</script>` : '';
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
<meta property="og:type" content="${ogType}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="${config.siteName}">
<meta property="og:locale" content="fr_FR">
<meta property="og:image" content="${config.siteUrl}/assets/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="REpublic — Repenser la démocratie par le tirage au sort">
<meta name="twitter:card" content="summary_large_image">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="fr" href="${url}">
<link rel="alternate" hreflang="en" href="${config.siteUrl}${equivalent(path)}">`}
${ld}
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
    <nav id="nav" class="site-nav" aria-label="Navigation principale">${nav}<a class="site-nav__lang" href="${equivalent(path)}" hreflang="en" lang="en">EN</a></nav>
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

// ---------- Données structurées (schema.org) ----------

const ORG = { '@type': 'Organization', '@id': `${config.siteUrl}/#org`, name: config.siteName, url: `${config.siteUrl}/`, logo: `${config.siteUrl}/assets/og.png` };
const SITE_ID = `${config.siteUrl}/#website`;
const LAW_ID = `${config.siteUrl}/texte/#constitution`;
const LAW_NAME = 'Constitution de la République délibérative française (avant-projet)';
const draft = { inLanguage: 'fr', creativeWorkStatus: 'Draft', legislationLegalForce: { '@id': 'https://schema.org/NotInForce' }, publisher: { '@id': ORG['@id'] }, version: config.version };
const crumbs = (items) => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: config.siteUrl + path })) });
const webPage = (path, name, extra = {}) => ({ '@type': 'WebPage', '@id': config.siteUrl + path, url: config.siteUrl + path, name, inLanguage: 'fr', isPartOf: { '@id': SITE_ID }, ...extra });

// ---------- Pages du texte ----------

const articleRange = (t) => {
  const nums = t.sections.flatMap((s) => s.articles.map((a) => a.num));
  return nums.length ? (nums.length > 1 ? `Art. ${nums[0]} à ${nums[nums.length - 1]}` : `Art. ${nums[0]}`) : '';
};

function sideNav(currentSlug) {
  const items = [preambule, ...titres].map((t) => {
    const cur = t.slug === currentSlug;
    const arts = cur ? `<ol class="toc__arts">${t.sections.flatMap((s) => s.articles).map((a) => `<li><a href="#${a.id}"><span>${a.num}</span>${esc(a.name)}</a></li>`).join('')}</ol>` : '';
    return `<li${cur ? ' class="is-current"' : ''}><a href="${urlTitre(t)}"${cur ? ' aria-current="page"' : ''}><span class="toc__n">${t.roman || '—'}</span>${esc(t.roman ? t.name : 'Préambule')}</a>${arts}</li>`;
  }).join('');
  return `<nav class="toc" aria-label="Sommaire de la Constitution"><p class="toc__head">Sommaire</p><ol>${items}</ol></nav>`;
}

function articleHtml(t, s, a) {
  const cat = [t.label, s.heading ? s.heading.split(' — ')[0] : ''].filter(Boolean).join('<br>');
  const aliases = a.aliases.map((x) => `<span id="${x}" class="rp-anchor"></span>`).join('');
  return `${aliases}<article class="rp-article" id="${a.id}">
  <div class="rp-article__cat">${cat}</div>
  <div class="rp-article__main">
    <p class="rp-article__num" aria-hidden="true">${a.num}</p>
    <h3 class="rp-article__title"><span class="sr">Article ${a.num} — </span>${esc(a.name)}</h3>
    <div class="rp-article__body">${renderBody(a.text)}</div>
    <div class="rp-article__foot">
      <button class="rp-btn rp-btn--link js-comment" data-term="${esc(a.id)}" aria-expanded="false">Commenter</button>
      <span aria-hidden="true">·</span>
      <a class="rp-btn rp-btn--link js-permalink" href="#${a.id}">Lien vers l’article</a>
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
  const label = t.roman ? `Titre ${t.roman} — ${t.name}` : 'Préambule';
  const path = urlTitre(t);
  const arts = t.sections.flatMap((s) => s.articles);
  const law = {
    '@type': 'Legislation', '@id': `${config.siteUrl}${path}#titre`, name: `${LAW_NAME} — ${label}`, url: config.siteUrl + path,
    legislationIdentifier: t.roman ? `Titre ${t.roman}` : 'Préambule', isPartOf: { '@id': LAW_ID }, ...draft,
    hasPart: arts.map((a) => ({ '@type': 'Legislation', name: `Article ${a.num} — ${a.name}`, legislationIdentifier: `Article ${a.num}`, url: `${config.siteUrl}${path}#${a.id}`, ...draft })),
  };
  const jsonld = [webPage(path, label, { mainEntity: { '@id': law['@id'] }, breadcrumb: crumbs([['Accueil', '/'], ['Texte', '/texte/'], [label, path]]) }), law];
  return layout({ title: label, current: '/texte/', body, bodyClass: 'page-text', path, jsonld, ogType: 'article' });
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
  <h1 class="rp-display hero__title">Repenser la démocratie <br class="br-wide">par le tirage au sort</h1>
  <div class="hero__grid">
    <p class="hero__lead">Un modèle démocratique prêt à l’emploi pour le XXI<sup>e</sup> siècle : une République où la loi est écrite par des conventions de citoyennes et de citoyens tirés au sort. Le texte est ouvert : <span style="white-space:nowrap">lisez-le</span>, <span style="white-space:nowrap">commentez-le</span> article par article.</p>
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
  <a class="home-more__card" href="/fonctionnement/"><span class="rp-tag rp-tag--solid">Fonctionnement</span><span class="home-more__t">Le système en schémas : la loi, les ministères, la justice, les crises.</span></a>
  <a class="home-more__card" href="/comment/"><span class="rp-tag rp-tag--solid">Comment</span><span class="home-more__t">Les étapes pour y parvenir, le coût, la place des citoyens.</span></a>
  <a class="home-more__card" href="/commenter/"><span class="rp-tag rp-tag--solid">Commenter</span><span class="home-more__t">Proposer une modification ou discuter un article.</span></a>
</section>`;
  const jsonld = [
    ORG,
    { '@type': 'WebSite', '@id': SITE_ID, url: `${config.siteUrl}/`, name: config.siteName, description: config.description, inLanguage: 'fr', publisher: { '@id': ORG['@id'] },
      potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${config.siteUrl}/texte/?q={search_term_string}` }, 'query-input': 'required name=search_term_string' } },
    webPage('/', `${config.siteName} — Repenser la démocratie par le tirage au sort`, { about: { '@id': LAW_ID } }),
  ];
  return layout({ title: '', body, current: '/', bodyClass: 'page-home', path: '/', jsonld });
}

function sommaire() {
  const rows = [preambule, ...titres].map((t) => `<section class="sommaire__titre">
  <h2><a href="${urlTitre(t)}"><span>${t.roman ? `Titre ${t.roman}` : '—'}</span>${esc(t.roman ? t.name : 'Préambule')}</a></h2>
  ${t.sections.map((s) => `${s.heading ? `<h3>${esc(s.heading)}</h3>` : ''}<ol>${s.articles.map((a) => `<li><a href="${urlTitre(t)}#${a.id}"><span>${a.num}</span>${esc(a.name)}</a></li>`).join('')}</ol>`).join('')}
</section>`).join('');
  const body = `<div class="wrap page-head"><div class="rp-tags"><span class="rp-tag rp-tag--solid">Texte</span><span class="rp-tag">${titres.length} titres · ${articleIndex.size} articles</span></div><h1 class="rp-title">Constitution de la République délibérative</h1>${searchBox}</div>
<div class="wrap sommaire">${rows}</div>
<div class="wrap prose"><p class="note"><a href="/texte/concordance/">Table de concordance avec la version 25</a></p></div>`;
  const law = {
    '@type': 'Legislation', '@id': LAW_ID, name: LAW_NAME, alternateName: 'Projet de Constitution délibérative', url: `${config.siteUrl}/texte/`,
    legislationType: 'Constitution', legislationJurisdiction: 'FR', description: config.description, ...draft,
    workTranslation: { '@id': `${config.siteUrl}/en/text/#constitution` },
    hasPart: [preambule, ...titres].map((t) => ({ '@id': `${config.siteUrl}${urlTitre(t)}#titre` })),
  };
  const jsonld = [webPage('/texte/', 'Le texte', { mainEntity: { '@id': LAW_ID }, breadcrumb: crumbs([['Accueil', '/'], ['Texte', '/texte/']]) }), law];
  return layout({ title: 'Le texte', current: '/texte/', body, path: '/texte/', jsonld });
}

// ---------- Concordance avec la v25 ----------

const v25 = JSON.parse(fs.readFileSync(path.join(SITE, 'concordance', 'v25.json'), 'utf8'));
// Anciens numéros : ceux de la v25, complétés par les articles ajoutés ensuite (texte figé avant la refonte).
const anciens = { ...v25.articles };
const avantRefonte = path.join(SITE, 'refonte', 'avant.json');
if (fs.existsSync(avantRefonte)) for (const a of JSON.parse(fs.readFileSync(avantRefonte, 'utf8')).articles) if (!anciens[a.num]) anciens[a.num] = a.id;
const now = (id) => { const e = refs.byId.get(id); return e ? refs.byId.get(e.primary) : null; };
const changes = Object.entries(anciens).map(([n, id]) => ({ n: +n, id, e: now(id) })).filter((r) => !r.e || r.e.label !== String(r.n) || r.e.primary !== r.id);

function concordance() {
  const rows = changes.map((r) => `<tr><td>${r.n}</td><td>${r.e ? `<a href="${urlArticleId(r.e.primary)}">Article ${r.e.label}</a> — ${esc(stripIds(r.e.name))}` : '—'}</td></tr>`).join('');
  const table = changes.length
    ? `<p>Les articles dont le numéro a changé depuis la version 25 sont listés ci-dessous. Les anciens liens vers ces articles redirigent automatiquement vers leur nouvelle place.</p>
<table class="concordance"><thead><tr><th scope="col">Ancien numéro (v25)</th><th scope="col">Aujourd’hui</th></tr></thead><tbody>${rows}</tbody></table>`
    : `<p>La numérotation n’a pas changé depuis la version 25 : chaque article garde son numéro. Si elle change, cette page indiquera la nouvelle place de chaque article, et les anciens liens continueront de fonctionner.</p>`;
  const body = `<div class="wrap page-head"><div class="rp-tags"><span class="rp-tag rp-tag--solid">Texte</span><span class="rp-tag">Concordance</span></div><h1 class="rp-title">Table de concordance</h1></div>
<div class="wrap prose">${table}<p><a href="/texte/">Revenir au sommaire</a></p></div>`;
  return layout({ title: 'Table de concordance', current: '/texte/', body, path: '/texte/concordance/', jsonld: [webPage('/texte/concordance/', 'Table de concordance', { breadcrumb: crumbs([['Accueil', '/'], ['Texte', '/texte/'], ['Concordance', '/texte/concordance/']]) })] });
}

// ---------- Refonte : comparaison « avant / après » (issue #19) ----------

function refontePage(c) {
  const chips = (label, arr, cls) => arr.length ? `<li class="rf-flag ${cls}"><b>${label}</b> ${arr.map(esc).join(', ')}</li>` : '';
  const items = c.resultats.map((r) => {
    const baisses = r.verrous.filter((v) => v.apres < v.avant).map((v) => `« ${v.mot} » ${v.avant} → ${v.apres}`);
    const flags = [
      r.nouveau ? '<li class="rf-flag rf-bad"><b>Nouvel article sans ancien texte</b></li>' : '',
      chips('Nombres disparus :', r.nombres.perdus, 'rf-bad'), chips('Nombres apparus :', r.nombres.ajoutes, 'rf-warn'),
      chips('Majorités disparues :', r.fractions.perdus, 'rf-bad'), chips('Majorités apparues :', r.fractions.ajoutes, 'rf-warn'),
      chips('Institutions plus citées :', r.institutions.perdus, 'rf-bad'), chips('Verrous en baisse :', baisses, 'rf-bad'),
      chips('Renvois retirés :', r.renvois.perdus, 'rf-info'),
    ].join('');
    const old = r.avant.map((o) => `<h4>Ancien article ${o.num} — ${esc(o.nom)}</h4>${renderBody(o.texte)}`).join('') || '<p>—</p>';
    return `<section class="rf-item${r.alerte ? ' rf-item--alerte' : ''}" id="rf-${r.apres.id}">
<h3>Article ${r.apres.num} — ${esc(stripIds(r.apres.nom))} <span class="rf-words">${r.mots.avant} → ${r.mots.apres} mots</span></h3>
${flags ? `<ul class="rf-flags">${flags}</ul>` : '<p class="rf-ok">Aucun nombre, majorité, institution ni verrou perdu.</p>'}
<div class="rf-cols"><div class="rf-col"><p class="rf-label">Avant</p>${old}</div><div class="rf-col"><p class="rf-label">Après</p>${renderBody(r.apres.texte)}</div></div>
</section>`;
  }).join('');
  const pct = Math.round((c.mots.apres / c.mots.avant - 1) * 100);
  const intro = `<p>Cette page compare le texte réécrit au texte figé avant la refonte. Pour chaque article modifié, elle montre l’ancien et le nouveau texte côte à côte, et signale tout nombre, délai, majorité, institution ou mot de garantie (« ne peut », « interdit », « de plein droit »…) qui a disparu. Chaque signalement doit être expliqué : la refonte simplifie l’écriture, elle ne change pas le fond.</p>
<p><b>${c.nbAvant}</b> articles avant, <b>${c.nbApres}</b> après ; <b>${c.mots.avant}</b> mots avant, <b>${c.mots.apres}</b> après (${pct > 0 ? '+' : ''}${pct} %). ${c.resultats.length} article(s) modifié(s), dont ${c.resultats.filter((r) => r.alerte).length} à examiner.</p>`;
  const body = `<div class="wrap page-head"><div class="rp-tags"><span class="rp-tag rp-tag--solid">Texte</span><span class="rp-tag">Refonte</span></div><h1 class="rp-title">Avant / après la refonte</h1></div>
<div class="wrap prose rf">${intro}${items || '<p>Aucun article modifié pour l’instant.</p>'}</div>`;
  return layout({ title: 'Avant / après la refonte', current: '/texte/', body, path: '/texte/refonte/', noindex: true });
}

// ---------- Pages éditoriales ----------

function contentPage(file, href) {
  let raw = fs.readFileSync(path.join(SITE, 'pages', file), 'utf8');
  const fm = {};
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (m) { for (const l of m[1].split('\n')) { const [k, ...v] = l.split(':'); fm[k.trim()] = v.join(':').trim(); } raw = raw.slice(m[0].length); }
  // Adresse jamais écrite en clair dans le HTML : reconstituée par le navigateur (anti-collecte).
  const [mu, mdom] = (config.contactEmail || '').split('@');
  const mailBtn = mu ? `<p><a class="rp-btn rp-btn--primary js-mail" href="#" data-u="${esc([...mu].reverse().join(''))}" data-d="${esc([...mdom].reverse().join(''))}">Écrire à l’équipe</a></p><noscript><p>${esc(mu)} [arobase] ${esc(mdom)}</p></noscript>` : '';
  const form = config.contactFormKey ? `<form class="contact-form" action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value="${esc(config.contactFormKey)}">
  <input type="hidden" name="subject" value="Message depuis le site REpublic">
  <input type="checkbox" name="botcheck" class="sr" tabindex="-1" autocomplete="off">
  <label>Votre nom ou pseudonyme <span>(facultatif)</span><input class="rp-input" name="name" autocomplete="name"></label>
  <label>Votre e-mail, pour vous répondre <span>(facultatif)</span><input class="rp-input" type="email" name="email" autocomplete="email"></label>
  <label>Message<textarea class="rp-input" name="message" rows="7" required></textarea></label>
  <button class="rp-btn rp-btn--primary" type="submit">Envoyer</button>
  <p class="contact-form__status" role="status" aria-live="polite"></p>
</form>${mailBtn ? `<p class="note">Vous préférez écrire directement ?</p>${mailBtn}` : ''}` : '';
  const contactLine = form || mailBtn || `<p><a class="rp-btn rp-btn--primary" href="https://github.com/${config.repo}/issues">Écrire sur GitHub</a></p>`;
  raw = raw.replaceAll('{{contactLine}}', contactLine).replaceAll('{{repo}}', config.repo);
  const { text, schemas } = extractSchemas(raw, `site/pages/${file}`);
  const inline = (t) => md.renderInline(renderRefs(t, refs.byId, refUrl));
  const html = injectSchemas(renderBody(text), schemas, inline);
  const body = `<div class="wrap page-head"><div class="rp-tags"><span class="rp-tag rp-tag--solid">${esc(fm.tag || fm.title)}</span>${fm.subtag ? `<span class="rp-tag">${esc(fm.subtag)}</span>` : ''}</div><h1 class="rp-title">${esc(fm.title)}</h1></div>
<div class="wrap prose${fm.faq === 'true' ? ' faq' : ''}">${html}</div>`;
  const extra = {};
  if (fm.faq === 'true') {
    const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const qa = [...html.matchAll(/<h3>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h[23]>|$)/g)].map((m) => ({ '@type': 'Question', name: strip(m[1]), acceptedAnswer: { '@type': 'Answer', text: strip(m[2]) } }));
    extra['@type'] = ['WebPage', 'FAQPage']; extra.mainEntity = qa;
  }
  const jsonld = [webPage(href, fm.title, { description: fm.description || config.description, publisher: { '@id': ORG['@id'] }, breadcrumb: crumbs([['Accueil', '/'], [fm.title, href]]), ...extra })];
  return layout({ title: fm.title, description: fm.description || config.description, current: href, body, path: href, jsonld });
}

// ---------- Construction ----------

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.cpSync(path.join(SITE, 'assets'), path.join(OUT, 'assets'), { recursive: true });

write('', home());
write('texte', sommaire());
const all = [preambule, ...titres];
all.forEach((t, i) => write(`texte/${t.slug}`, titrePage(t, all[i - 1], all[i + 1])));
write('texte/concordance', concordance());
const refonte = comparer();
if (refonte) {
  if (refonte.erreurs.length) { for (const e of refonte.erreurs) console.error(`Erreur — ${e}`); process.exit(1); }
  write('texte/refonte', refontePage(refonte));
}

// Anciens liens : adresses des titres de la v25 (/texte/titre-03/) et ancres « #article-N ».
const oldTitre = (r) => `/texte/titre-${String(ROMAN.indexOf(r) + 1).padStart(2, '0')}/`;
const redirects = Object.entries(v25.titres).map(([r, id]) => [oldTitre(r), urlTitre(titreById.get(now(id).primary))]);
fs.writeFileSync(path.join(OUT, '_redirects'), redirects.map(([a, b]) => `${a} ${b} 301\n${a.slice(0, -1)} ${b} 301`).join('\n') + '\n');
fs.writeFileSync(path.join(OUT, 'v25.json'), JSON.stringify(Object.fromEntries(Object.entries(anciens).map(([n, id]) => [n, urlArticleId(now(id).primary)]))));
for (const [file, href] of [['pourquoi.md', '/pourquoi/'], ['fonctionnement.md', '/fonctionnement/'], ['comment.md', '/comment/'], ['commenter.md', '/commenter/'], ['faq.md', '/faq/'], ['contact.md', '/contact/']]) {
  write(href.replaceAll('/', ''), contentPage(file, href));
}

// Index de recherche
const plain = (s) => s.replace(/[#*_>`\[\]]/g, '').replace(/\s+/g, ' ').trim();
const searchIndex = [...articleIndex.values()].map(({ t, a }) => ({ n: a.num, t: a.name, g: `Titre ${t.roman}`, u: urlArticleId(a.id), x: plain(a.text) }));
fs.writeFileSync(path.join(OUT, 'search.json'), JSON.stringify(searchIndex));

// Fichiers utilitaires
fs.writeFileSync(path.join(OUT, '404.html'), layout({ title: 'Page introuvable', noindex: true, path: '/404', body: `<div class="wrap page-head"><h1 class="rp-display">404</h1><p>Cette page n’existe pas. <a href="/texte/">Revenir au texte</a>.</p></div>` }));
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${config.siteUrl}/sitemap.xml\n`);
const urls = ['/', '/texte/', ...all.map(urlTitre), '/texte/concordance/', '/pourquoi/', '/fonctionnement/', '/comment/', '/commenter/', '/faq/', '/contact/'];
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((u) => `<url><loc>${config.siteUrl}${u}</loc></url>`).join('')}</urlset>\n`);

console.log(`Site généré : ${all.length} pages de texte, ${articleIndex.size} articles → dist/`);
