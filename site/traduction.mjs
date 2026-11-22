// Version anglaise : cohérence avec le texte français et alerte quand le français change.
//
// Les traductions sont dans en/constitution/ et en/pages/, avec les mêmes noms de fichiers.
// Chaque article anglais reprend le numéro et les identifiants de l'article français.
// en/sources.json garde l'empreinte du texte français au moment de la traduction :
// si le français change ensuite, l'article (ou la page) est signalé « à retraduire »,
// et le site anglais affiche un avertissement sur cet article.
//
// Usage :
//   node site/traduction.mjs           vérifie (échec si un article manque ou si un renvoi est faux)
//   node site/traduction.mjs --fix     remet à jour les numéros affichés des renvois anglais
//   node site/traduction.mjs --figer   enregistre les empreintes après une traduction relue
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { collect, resolve } from './refs.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const FR = path.join(ROOT, 'constitution');
const EN = path.join(ROOT, 'en', 'constitution');
const FR_PAGES = path.join(ROOT, 'site', 'pages');
const EN_PAGES = path.join(ROOT, 'en', 'pages');
export const SOURCES = path.join(ROOT, 'en', 'sources.json');

const RE_ART = /^###\s+Article\s+(\d+)\s+—\s+(.+?)\s*\{((?:#[^\s}]+\s*)+)\}\s*$/;
const RE_REF = /\[([0-9]{1,3}|[IVX]+)\]\(#([^)\s]*)\)/g;
const empreinte = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 12);

/** Articles d'un dossier : id -> { num, ids, nom, texte, fichier } */
export function articles(dir) {
  const out = new Map();
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md')).sort()) {
    let cur = null;
    const flush = () => { if (cur) { cur.texte = cur.lignes.join('\n').trim(); delete cur.lignes; out.set(cur.ids[0], cur); cur = null; } };
    for (const l of fs.readFileSync(path.join(dir, f), 'utf8').split('\n')) {
      const m = l.match(RE_ART);
      if (m) { flush(); cur = { num: +m[1], nom: m[2], ids: m[3].trim().split(/\s+/).map((x) => x.slice(1)), fichier: f, lignes: [] }; continue; }
      if (/^#{1,3}\s/.test(l)) { flush(); continue; }
      if (cur) cur.lignes.push(l);
    }
    flush();
  }
  return out;
}

const pages = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((x) => x.endsWith('.md')).sort() : []);

/** Empreintes actuelles du français. */
export function empreintes() {
  const a = {};
  for (const [id, x] of articles(FR)) a[id] = empreinte(`${x.nom}\n${x.texte}`);
  const p = {};
  for (const f of pages(FR_PAGES)) p[f] = empreinte(fs.readFileSync(path.join(FR_PAGES, f), 'utf8'));
  const t = {};
  for (const f of fs.readdirSync(FR).filter((x) => x.endsWith('.md'))) t[f] = empreinte(fs.readFileSync(path.join(FR, f), 'utf8').split('\n')[0]);
  return { articles: a, pages: p, titres: t };
}

/** Articles et pages dont le français a changé depuis la traduction. */
export function aRetraduire() {
  if (!fs.existsSync(SOURCES)) return { articles: new Set(), pages: new Set() };
  const old = JSON.parse(fs.readFileSync(SOURCES, 'utf8'));
  const cur = empreintes();
  return {
    articles: new Set(Object.keys(cur.articles).filter((id) => old.articles?.[id] !== cur.articles[id])),
    pages: new Set(Object.keys(cur.pages).filter((f) => old.pages?.[f] !== cur.pages[f])),
  };
}

export function verifier({ fix = false } = {}) {
  const errors = [], warnings = [];
  let fixes = 0;
  const { byId } = collect();
  const fr = articles(FR), en = articles(EN);
  if (!en.size) return { errors, warnings: ['Aucune traduction anglaise.'], fixes };
  for (const [id, a] of fr) {
    const b = en.get(id);
    if (!b) { errors.push(`Article ${a.num} (#${id}) : pas de traduction anglaise.`); continue; }
    if (b.num !== a.num) errors.push(`Article #${id} : numéro ${b.num} en anglais, ${a.num} en français.`);
    if (b.ids.join(' ') !== a.ids.join(' ')) errors.push(`Article ${a.num} : identifiants différents en anglais (${b.ids.join(' ')}).`);
    if (b.fichier !== a.fichier) errors.push(`Article ${a.num} : dans ${b.fichier} en anglais, ${a.fichier} en français.`);
  }
  for (const [id, b] of en) if (!fr.has(id)) errors.push(`Article anglais ${b.num} (#${id}) : n'existe plus en français.`);
  // Renvois des fichiers anglais : identifiants existants, numéros à jour.
  const files = [...pages(EN).map((f) => path.join(EN, f)), ...pages(EN_PAGES).map((f) => path.join(EN_PAGES, f))];
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const out = src.split('\n').map((l, i) => {
      if (/^#/.test(l)) return l;
      return l.replace(RE_REF, (all, label, id) => {
        const e = resolve(byId, id);
        const where = `${path.relative(ROOT, file)}:${i + 1}`;
        if (!e) { errors.push(`${where} : renvoi vers « #${id} », qui n'existe pas.`); return all; }
        if (/^[IVX]+$/.test(label) !== (e.kind === 'titre')) errors.push(`${where} : « ${all} » ne renvoie pas au bon type (article ou titre).`);
        if (label !== e.label) { if (fix) { fixes++; return `[${e.label}](#${id})`; } warnings.push(`${where} : « ${all} » affiche ${label} au lieu de ${e.label} (npm run traduction -- --fix).`); }
        return all;
      });
    }).join('\n');
    if (fix && out !== src) fs.writeFileSync(file, out);
  }
  for (const f of pages(FR_PAGES)) if (!fs.existsSync(path.join(EN_PAGES, f))) warnings.push(`Page ${f} : pas de traduction anglaise.`);
  const r = aRetraduire();
  for (const id of r.articles) if (en.has(id)) warnings.push(`Article ${fr.get(id).num} (#${id}) : le français a changé depuis la traduction, à retraduire.`);
  for (const f of r.pages) if (fs.existsSync(path.join(EN_PAGES, f))) warnings.push(`Page ${f} : le français a changé depuis la traduction, à retraduire.`);
  return { errors, warnings, fixes };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  if (process.argv.includes('--figer')) {
    fs.writeFileSync(SOURCES, JSON.stringify(empreintes(), null, 1) + '\n');
    console.log(`Empreintes du français enregistrées dans ${path.relative(ROOT, SOURCES)}.`);
    process.exit(0);
  }
  const { errors, warnings, fixes } = verifier({ fix: process.argv.includes('--fix') });
  for (const w of warnings) console.warn(`Attention — ${w}`);
  for (const e of errors) console.error(`Erreur — ${e}`);
  if (fixes) console.log(`${fixes} numéro(s) affiché(s) mis à jour.`);
  console.log(errors.length ? `${errors.length} erreur(s) dans la version anglaise.` : 'Version anglaise vérifiée.');
  process.exit(errors.length ? 1 : 0);
}
