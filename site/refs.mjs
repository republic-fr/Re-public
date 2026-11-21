// Références stables entre articles (issue #26).
//
// Chaque article et chaque titre porte un identifiant permanent, écrit à la fin de son intitulé :
//   ### Article 4 — Séparation des pouvoirs {#separation-pouvoirs}
//   # Titre XII — Des crises et de la convention citoyenne de secours {#crises}
// L'identifiant ne change jamais, même si l'article est renuméroté, déplacé ou renommé.
// Un article qui en absorbe d'autres garde leurs identifiants comme alias :
//   ### Article 109 — Statut des magistrats {#statut-magistrats #statut-magistrats-normes}
//
// Les renvois s'écrivent avec l'identifiant ; le numéro affiché est recalculé :
//   l'article [77](#autorisation-operations-militaires), au Titre [XII](#crises)
//
// Usage :
//   node site/refs.mjs          vérifie les renvois (échec si un renvoi est cassé)
//   node site/refs.mjs --fix    remet à jour les numéros affichés dans les fichiers source
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
export const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'];

const ID = '[a-z0-9]+(?:-[a-z0-9]+)*';
const RE_ARTICLE_HEAD = /^###\s+Article\s+(\d+)\s+—\s+(.+?)\s*\{((?:#[^\s}]+\s*)+)\}\s*$/;
const RE_TITRE_HEAD = /^#\s+Titre\s+([IVX]+)\s+—\s+(.+?)\s*\{((?:#[^\s}]+\s*)+)\}\s*$/;
const RE_REF = /\[([0-9]{1,3}|[IVX]+)\]\(#([^)\s]*)\)/g;
const RE_BARE_ARTICLE = /\barticles?\s+\d{1,3}\b/gi;
const RE_BARE_TITRE = /\bTitres?\s+[IVX]+\b/g;

/** Fichiers où les renvois sont vérifiés. */
export function sourceFiles() {
  const c = (f) => path.join('constitution', f);
  const p = (f) => path.join('site', 'pages', f);
  return [
    ...fs.readdirSync(path.join(ROOT, 'constitution')).filter((f) => f.endsWith('.md')).sort().map(c),
    ...fs.readdirSync(path.join(ROOT, 'site', 'pages')).filter((f) => f.endsWith('.md')).sort().map(p),
  ];
}

const parseIds = (s) => s.trim().split(/\s+/).map((x) => x.replace(/^#/, ''));

/** Lit tous les intitulés et construit l'index des identifiants. */
export function collect(files = sourceFiles()) {
  const byId = new Map(); // id -> { kind, label, name, primary, file, line }
  const errors = [];
  const add = (id, entry) => {
    if (!new RegExp(`^${ID}$`).test(id)) errors.push(`${entry.file}:${entry.line} : identifiant « ${id} » invalide (lettres minuscules sans accent, chiffres et tirets).`);
    const prev = byId.get(id);
    if (prev) errors.push(`${entry.file}:${entry.line} : identifiant « ${id} » déjà utilisé (${prev.file}:${prev.line}).`);
    else byId.set(id, entry);
  };
  for (const file of files) {
    const lines = fs.readFileSync(path.join(ROOT, file), 'utf8').split('\n');
    lines.forEach((l, i) => {
      const line = i + 1;
      let m;
      if ((m = l.match(RE_ARTICLE_HEAD))) {
        const ids = parseIds(m[3]);
        ids.forEach((id, k) => add(id, { kind: 'article', label: m[1], name: m[2], primary: ids[0], alias: k > 0, file, line }));
      } else if ((m = l.match(RE_TITRE_HEAD))) {
        const ids = parseIds(m[3]);
        ids.forEach((id, k) => add(id, { kind: 'titre', label: m[1], name: m[2], primary: ids[0], alias: k > 0, file, line }));
      } else if (/^###\s+Article\s/.test(l) || /^#\s+Titre\s/.test(l)) {
        errors.push(`${file}:${line} : intitulé sans identifiant permanent ({#…}) : « ${l.trim()} ».`);
      }
    });
  }
  // Numérotation : unicité des numéros d'articles et de titres.
  const seen = new Map();
  for (const e of byId.values()) {
    if (e.alias) continue;
    const key = `${e.kind}:${e.label}`;
    if (seen.has(key)) errors.push(`${e.file}:${e.line} : ${e.kind === 'article' ? 'article' : 'titre'} ${e.label} numéroté deux fois (voir ${seen.get(key)}).`);
    else seen.set(key, `${e.file}:${e.line}`);
  }
  return { byId, errors };
}

/** Résout un identifiant (ou un alias) vers son entrée principale. */
export function resolve(byId, id) {
  const e = byId.get(id);
  return e ? byId.get(e.primary) : null;
}

/** Vérifie les renvois de tous les fichiers. Renvoie { errors, warnings, fixes }. */
export function check({ fix = false } = {}) {
  const files = sourceFiles();
  const { byId, errors } = collect(files);
  const warnings = [];
  let fixes = 0;

  // Les identifiants de la v25 doivent rester joignables (comme identifiant ou comme alias).
  const v25 = JSON.parse(fs.readFileSync(path.join(ROOT, 'site', 'concordance', 'v25.json'), 'utf8'));
  for (const [n, id] of Object.entries(v25.articles)) if (!byId.has(id)) errors.push(`Concordance : l'article ${n} de la v25 (« ${id} ») n'existe plus. Ajoutez « #${id} » comme alias de l'article qui le remplace.`);
  for (const [r, id] of Object.entries(v25.titres)) if (!byId.has(id)) errors.push(`Concordance : le titre ${r} de la v25 (« ${id} ») n'existe plus. Ajoutez « #${id} » comme alias du titre qui le remplace.`);

  for (const file of files) {
    const full = path.join(ROOT, file);
    const src = fs.readFileSync(full, 'utf8');
    let changed = false;
    const out = src.split('\n').map((l, i) => {
      const line = i + 1;
      if (/^#/.test(l)) return l;
      const next = l.replace(RE_REF, (all, label, id) => {
        const e = resolve(byId, id);
        if (!e) { errors.push(`${file}:${line} : renvoi vers « #${id} », qui n'existe pas.`); return all; }
        const wantsTitre = /^[IVX]+$/.test(label);
        if (wantsTitre !== (e.kind === 'titre')) errors.push(`${file}:${line} : « ${all} » renvoie à un ${e.kind === 'titre' ? 'titre' : 'article'}, ce que ne dit pas le texte.`);
        if (label !== e.label) {
          if (fix) { fixes++; return `[${e.label}](#${id})`; }
          warnings.push(`${file}:${line} : « ${all} » affiche ${label}, mais c'est aujourd'hui ${e.kind === 'titre' ? 'le titre' : 'l\'article'} ${e.label} (corrigé automatiquement sur le site ; « npm run refs -- --fix » pour corriger la source).`);
        }
        if (e !== byId.get(id)) warnings.push(`${file}:${line} : « #${id} » est un alias ; préférez « #${e.primary} ».`);
        return all;
      });
      if (next !== l) changed = true;
      // Renvois écrits en clair, sans identifiant.
      const bare = next.replace(RE_REF, '');
      for (const m of bare.matchAll(RE_BARE_ARTICLE)) errors.push(`${file}:${line} : « ${m[0]} » est écrit sans identifiant. Écrivez « ${m[0].replace(/\d+$/, (n) => `[${n}](#identifiant)`)} ».`);
      for (const m of bare.matchAll(RE_BARE_TITRE)) errors.push(`${file}:${line} : « ${m[0]} » est écrit sans identifiant. Écrivez « ${m[0].replace(/[IVX]+$/, (r) => `[${r}](#identifiant)`)} ».`);
      // Plages « articles A à B » : B doit suivre A.
      for (const m of next.matchAll(/\[(\d+)\]\(#([^)]+)\)\s+à\s+\[(\d+)\]\(#([^)]+)\)/g)) {
        const a = resolve(byId, m[2]), b = resolve(byId, m[4]);
        if (a && b && +b.label <= +a.label) warnings.push(`${file}:${line} : la plage « ${a.label} à ${b.label} » n'est plus dans l'ordre ; à réécrire.`);
      }
      return next;
    }).join('\n');
    if (fix && changed && out !== src) fs.writeFileSync(full, out);
  }
  return { byId, errors, warnings, fixes };
}

/** Remplace les renvois par des liens HTML vers la position actuelle de l'article ou du titre. */
export function renderRefs(text, byId, url) {
  return text.replace(RE_REF, (all, label, id) => {
    const e = resolve(byId, id);
    return e ? `<a href="${url(e)}">${e.label}</a>` : all;
  });
}

/** Retire l'identifiant d'un intitulé. */
export const stripIds = (s) => s.replace(/\s*\{(?:#[^\s}]+\s*)+\}\s*$/, '');
export const headIds = (s) => { const m = s.match(/\{((?:#[^\s}]+\s*)+)\}\s*$/); return m ? parseIds(m[1]) : []; };

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const fix = process.argv.includes('--fix');
  const { byId, errors, warnings, fixes } = check({ fix });
  const n = [...byId.values()].filter((e) => e.kind === 'article' && !e.alias).length;
  for (const w of warnings) console.warn(`Attention — ${w}`);
  for (const e of errors) console.error(`Erreur — ${e}`);
  if (fix) console.log(`${fixes} numéro(s) affiché(s) mis à jour.`);
  console.log(errors.length ? `${errors.length} erreur(s) dans les renvois.` : `Renvois vérifiés : ${n} articles, aucun renvoi cassé.`);
  process.exit(errors.length ? 1 : 0);
}
