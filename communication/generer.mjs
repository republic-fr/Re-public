// Génère les documents de présentation en PDF : fiche d'une page (A4) et présentation (16:9), en français et en anglais.
// Usage : node communication/generer.mjs   (nécessite Playwright et Chromium)
// Sorties : site/assets/republic-fiche-fr.pdf, -en.pdf, republic-presentation-fr.pdf, -en.pdf
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fiche, deck, SITE, REPO } from './contenu.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ICI = path.dirname(new URL(import.meta.url).pathname);
const SORTIE = path.join(ICI, '..', 'site', 'assets');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const polices = [400, 500, 600, 700].map((w) => `@font-face{font-family:"Hanken Grotesk";font-weight:${w};src:url("file://${ICI}/fonts/hanken-grotesk-latin-${w}-normal.woff2") format("woff2");}`).join('');
const marque = (taille) => `<span class="wm" style="font-size:${taille}"><span class="re">RE</span><span class="pu">PUBLIC</span></span>`;
// Grille de tirage au sort : motif fixe, pour que le document soit identique à chaque génération.
const grille = (n, cell, gap, on = [3, 9, 17, 22, 31, 38, 44, 50, 57, 63, 71, 76, 84, 90, 97, 103]) => {
  let h = `<span class="grid" style="grid-template-columns:repeat(${n},${cell}px);gap:${gap}px">`;
  for (let i = 0; i < n * 4; i++) h += `<i style="width:${cell}px;height:${cell}px"${on.includes(i % 108) ? ' class="on"' : ''}></i>`;
  return h + '</span>';
};
const BASE = `${polices}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:"Hanken Grotesk",Arial,sans-serif;color:#000;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.wm{display:inline-flex;font-weight:600;letter-spacing:-.01em;line-height:1}
.wm span{display:inline-flex;align-items:center;padding:.12em .22em .1em;border:.06em solid #000}
.wm .re{background:#000;color:#fff}.wm .pu{margin-left:-.06em}
.grid{display:inline-grid}.grid i{display:block;border:1px solid #000}.grid i.on{background:#000}
.kicker{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}`;

function htmlFiche(c, lang) {
  const blocs = c.blocs.map((b) => b.encadre
    ? `<section class="encadre"><h2>${esc(b.titre)}</h2><p class="citation">${esc(b.items[0])}</p>${b.items.slice(1).map((i) => `<p>${esc(i)}</p>`).join('')}</section>`
    : `<section><h2>${esc(b.titre)}</h2><ul>${b.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></section>`).join('');
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${esc(c.titreDoc)}</title><style>${BASE}
@page{size:A4;margin:0}
.page{width:210mm;height:297mm;padding:12mm 14mm 11mm;display:flex;flex-direction:column}
header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #000;padding-bottom:5mm}
header .kicker{margin-top:5mm}
h1{font-size:29px;font-weight:700;letter-spacing:-.02em;line-height:1.05;margin-top:1.5mm}
.chapeau{font-size:12.8px;line-height:1.42;margin:3.5mm 0 3.5mm;font-weight:500}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:3.5mm 7mm}
section h2{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border-top:1px solid #000;padding-top:2mm;margin-bottom:1.6mm}
.encadre{background:#f2f2f2;padding:0 3.5mm 3mm;border-top:2px solid #000}.encadre h2{border-top:0}.encadre p+p{margin-top:1.4mm}.encadre p{font-size:10.4px;line-height:1.36}.encadre .citation{font-weight:700;font-size:11.4px;margin-bottom:1.6mm}
ul{list-style:none}li{font-size:10.4px;line-height:1.36;padding-left:3.4mm;position:relative;margin-bottom:1.3mm}
li::before{content:"";position:absolute;left:0;top:1.55mm;width:1.5mm;height:1.5mm;background:#000}
.chiffres{display:grid;grid-template-columns:repeat(3,1fr);margin:4mm 0 4mm;border:1px solid #000}
.chiffres div{padding:2.6mm 3.5mm;border-right:1px solid #000}.chiffres div:last-child{border:0}
.chiffres b{display:block;font-size:24px;font-weight:700;letter-spacing:-.02em}.chiffres span{font-size:10.3px;line-height:1.35;display:block;margin-top:.8mm}
.chemin{margin-bottom:3mm}.chemin h2{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:2mm}
.chemin ol{list-style:none;display:grid;grid-template-columns:repeat(5,1fr);gap:2mm;counter-reset:e}
.chemin li{border:1px solid #000;padding:2mm 2.2mm 2.4mm;font-size:10px;line-height:1.35;margin:0;counter-increment:e}
.chemin li::before{content:counter(e);position:static;display:block;width:auto;height:auto;background:none;font-weight:700;font-size:13px;margin-bottom:.8mm}
footer{margin-top:auto;flex-shrink:0;background:#000;color:#fff;padding:3mm 5mm;display:flex;justify-content:space-between;align-items:center;gap:6mm}
footer p{font-size:10.8px;line-height:1.4}footer .url{font-size:22px;font-weight:700;white-space:nowrap}footer .repo{font-size:10px;opacity:.8;margin-top:1mm}
</style></head><body><div class="page">
<header><div>${marque('20px')}<p class="kicker">${esc(c.surtitre)}</p><h1>${esc(c.titre)}</h1></div>${grille(9, 9, 3)}</header>
<p class="chapeau">${esc(c.chapeau)}</p>
<div class="cols">${blocs}</div>
<div class="chiffres">${c.chiffres.map((x) => `<div><b>${esc(x.n)}</b><span>${esc(x.t)}</span></div>`).join('')}</div>
<div class="chemin"><h2>${esc(c.cheminTitre)}</h2><ol>${c.chemin.map((x) => `<li>${esc(x)}</li>`).join('')}</ol></div>
<footer><div><p>${esc(c.appel)}</p><p class="repo">${esc(c.pied)} · ${REPO}</p></div><div class="url">${SITE}</div></footer>
</div></body></html>`;
}

function htmlDeck(c, lang) {
  const tot = c.slides.length;
  const corps = (s) => {
    if (s.items) return `${s.lead ? `<p class="lead">${esc(s.lead)}</p>` : ''}<ul class="liste">${s.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
    if (s.cols) return `<div class="cols3">${s.cols.map((x) => `<div><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p></div>`).join('')}</div>`;
    if (s.chiffres) return `<div class="chiffres">${s.chiffres.map((x) => `<div><b>${esc(x.n)}</b><span>${esc(x.t)}</span></div>`).join('')}</div>${s.note ? `<p class="note">${esc(s.note)}</p>` : ''}`;
    if (s.flux) return `<ol class="flux">${s.flux.map((x) => `<li><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p></li>`).join('')}</ol>`;
    if (s.grille) return `<div class="grille">${s.grille.map((x) => `<div><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p></div>`).join('')}</div>`;
    return '';
  };
  const slides = c.slides.map((s, i) => {
    if (s.type === 'titre') return `<section class="s titre"><div class="haut">${marque('34px')}</div><div><p class="kicker">${esc(s.surtitre)}</p><h1>${esc(s.titre)}</h1><p class="sous">${esc(s.sous)}</p></div><div class="bas"><span>${SITE}</span>${grille(15, 14, 4)}</div></section>`;
    if (s.type === 'fin') return `<section class="s fin"><div class="haut">${marque('34px')}</div><div><h1>${esc(s.titre)}</h1><p class="sous">${esc(s.sous)}</p><p class="url">${SITE}</p><p class="repo">${REPO}</p></div><div class="bas">${grille(15, 14, 4)}</div></section>`;
    return `<section class="s"><div class="tete"><span class="kicker">${String(i).padStart(2, '0')}</span>${marque('15px')}</div><h2>${esc(s.titre)}</h2><div class="corps">${corps(s)}</div><div class="pied"><span>${SITE}</span><span>${i + 1} / ${tot}</span></div></section>`;
  }).join('');
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${esc(c.titreDoc)}</title><style>${BASE}
@page{size:1280px 720px;margin:0}
.s{width:1280px;height:720px;padding:56px 72px 40px;display:flex;flex-direction:column;page-break-after:always;overflow:hidden;position:relative}
.titre,.fin{background:#000;color:#fff;justify-content:space-between}
.titre .wm span,.fin .wm span{border-color:#fff}.titre .wm .re,.fin .wm .re{background:#fff;color:#000}
.titre .grid i,.fin .grid i{border-color:#fff}.titre .grid i.on,.fin .grid i.on{background:#fff}
.titre h1,.fin h1{font-size:84px;font-weight:700;letter-spacing:-.03em;line-height:1;margin:14px 0 20px}
.titre .kicker{font-size:15px}.sous{font-size:28px;font-weight:500;max-width:900px;line-height:1.3}
.bas{display:flex;justify-content:space-between;align-items:flex-end;font-size:20px;font-weight:600}
.fin .url{font-size:44px;font-weight:700;margin-top:36px}.fin .repo{font-size:18px;opacity:.75;margin-top:8px}.fin .bas{justify-content:flex-end}
.tete{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #000;padding-bottom:14px}
.tete .kicker{font-size:14px}
h2{font-size:50px;font-weight:700;letter-spacing:-.02em;line-height:1.08;margin:28px 0 26px;max-width:1080px}
.corps{flex:1}
.lead{font-size:27px;font-weight:500;line-height:1.4;margin-bottom:22px;max-width:1000px}
.liste{list-style:none}.liste li{font-size:28px;line-height:1.38;padding:14px 0 14px 34px;border-top:1px solid #d9d9d9;position:relative}
.liste li::before{content:"";position:absolute;left:0;top:29px;width:13px;height:13px;background:#000}
.cols3,.grille{display:grid;gap:34px 28px}.cols3{grid-template-columns:repeat(3,1fr)}.grille{grid-template-columns:repeat(3,1fr)}
.cols3 div,.grille div{border-top:2px solid #000;padding-top:14px}
h3{font-size:27px;font-weight:700;margin-bottom:8px;letter-spacing:-.01em}
.cols3 p{font-size:25px;line-height:1.45}.grille p{font-size:21px;line-height:1.42}.grille h3{font-size:27px}
.chiffres{display:grid;grid-template-columns:repeat(3,1fr);border:2px solid #000}
.chiffres div{padding:24px 26px;border-right:2px solid #000}.chiffres div:last-child{border:0}
.chiffres b{display:block;font-size:52px;font-weight:700;letter-spacing:-.03em}.chiffres span{font-size:21px;line-height:1.4;display:block;margin-top:6px}
.note{font-size:24px;line-height:1.45;margin-top:28px;max-width:1080px}
.flux{list-style:none;display:grid;grid-template-columns:repeat(4,1fr);gap:0;counter-reset:f}
.flux li{border:2px solid #000;margin-right:-2px;padding:24px 24px 34px;counter-increment:f;position:relative}
.flux li::before{content:counter(f);display:block;font-size:34px;font-weight:700;margin-bottom:10px}
.flux p{font-size:22px;line-height:1.42}
.pied{display:flex;justify-content:space-between;font-size:14px;color:#6b6b6b;border-top:1px solid #d9d9d9;padding-top:12px}
</style></head><body>${slides}</body></html>`;
}

const navigateur = await chromium.launch();
const page = await navigateur.newPage();
for (const lang of ['fr', 'en']) {
  for (const [nom, html, opts] of [
    [`republic-fiche-${lang}.pdf`, htmlFiche(fiche[lang], lang), { format: 'A4' }],
    [`republic-presentation-${lang}.pdf`, htmlDeck(deck[lang], lang), { width: '1280px', height: '720px' }],
  ]) {
    const tmp = path.join(ICI, `.tmp-${nom}.html`);
    fs.writeFileSync(tmp, html);
    await page.goto(`file://${tmp}`);
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: path.join(SORTIE, nom), printBackground: true, preferCSSPageSize: true, ...opts });
    if (process.argv.includes('--html')) fs.copyFileSync(tmp, path.join(ICI, nom.replace('.pdf', '.html')));
    fs.unlinkSync(tmp);
    console.log(`site/assets/${nom}`);
  }
}
await navigateur.close();
