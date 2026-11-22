// Vérification de la refonte (issue #19) : le texte réécrit ne doit pas trahir le texte d'avant.
//
// 1. On fige le texte d'avant la refonte :
//      node site/refonte.mjs --figer        → site/refonte/avant.json
// 2. Pendant la refonte, chaque article réécrit garde, comme identifiant ou comme alias, les
//    identifiants des articles qu'il remplace (voir site/refs.mjs).
// 3. La vérification compare, pour chaque nouvel article, son texte avec celui des anciens
//    articles qu'il absorbe :
//      node site/refonte.mjs                → rapport dans la console (échec si un ancien article est perdu)
//    Elle relève :
//      - les nombres, délais et effectifs (« soixante-douze heures », « 150 citoyens ») ;
//      - les fractions et majorités (« deux tiers », « majorité absolue ») ;
//      - les mots qui portent une garantie (« ne peut », « interdit », « de plein droit »…) ;
//      - les institutions citées et les renvois.
//    Toute différence doit être expliquée dans la PR. Le site publie la comparaison
//    « avant / après » sur /texte/refonte/.
import fs from 'node:fs';
import path from 'node:path';
import { collect, resolve } from './refs.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
export const AVANT = path.join(ROOT, 'site', 'refonte', 'avant.json');

const RE_ARTICLE = /^###\s+Article\s+(\d+)\s+—\s+(.+?)\s*\{((?:#[^\s}]+\s*)+)\}\s*$/;
const RE_TITRE = /^#\s+Titre\s+([IVX]+)\s+—\s+(.+?)\s*\{((?:#[^\s}]+\s*)+)\}\s*$/;

/** Lit tous les articles du texte actuel. */
export function lireArticles() {
  const dir = path.join(ROOT, 'constitution');
  const out = [];
  let titre = null;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md')).sort()) {
    let cur = null;
    const flush = () => { if (cur) { cur.texte = cur.lignes.join('\n').trim(); delete cur.lignes; out.push(cur); cur = null; } };
    for (const l of fs.readFileSync(path.join(dir, f), 'utf8').split('\n')) {
      let m;
      if ((m = l.match(RE_TITRE))) { flush(); titre = { roman: m[1], nom: m[2] }; continue; }
      if ((m = l.match(RE_ARTICLE))) {
        flush();
        const ids = m[3].trim().split(/\s+/).map((x) => x.replace(/^#/, ''));
        cur = { num: +m[1], id: ids[0], alias: ids.slice(1), nom: m[2], titre: titre && titre.roman, lignes: [] };
        continue;
      }
      if (/^#{1,3}\s/.test(l)) { flush(); continue; }
      if (cur) cur.lignes.push(l);
    }
    flush();
  }
  return out;
}

// ---------- Extraction des éléments à comparer ----------

const UNITES = { 0: 0, un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9, dix: 10, onze: 11, douze: 12, treize: 13, quatorze: 14, quinze: 15, seize: 16, vingt: 20, trente: 30, quarante: 40, cinquante: 50, soixante: 60 };
const MOT_NOMBRE = '(?:\\d[\\d\\u00a0\\u202f ]*|un|une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize|quatorze|quinze|seize|vingts?|trente|quarante|cinquante|soixante|cents?|mille|et)';
const UNITE = {
  'heures?': 'heures', 'jours?': 'jours', 'semaines?': 'semaines', 'mois': 'mois', '(?:ans?|années?)': 'ans',
  '(?:pour cent|%)': '%', '(?:membres|citoyens|citoyennes|personnes|magistrates|magistrats|universitaires)': 'personnes',
  'signatures': 'signatures', 'épisodes': 'épisodes', 'ministres': 'ministres',
};
const RE_NOMBRE = new RegExp(`(?<![\\p{L}\\d])(${MOT_NOMBRE}(?:[- ]${MOT_NOMBRE})*)\\s+(${Object.keys(UNITE).join('|')})(?![\\p{L}])`, 'giu');

function valeur(phrase) {
  let total = 0, cur = 0;
  for (const w of phrase.toLowerCase().split(/[- ]+/)) {
    if (!w || w === 'et') continue;
    if (/^\d/.test(w)) cur += +w.replace(/\D/g, '');
    else if (w.startsWith('cent')) cur = (cur || 1) * 100;
    else if (w === 'mille') { total += (cur || 1) * 1000; cur = 0; }
    else if (w.startsWith('vingt') && cur % 100 === 4) cur += 76; // quatre-vingt
    else if (w in UNITES) cur += UNITES[w];
  }
  return total + cur;
}

const FRACTIONS = [['deux tiers', '2/3'], ['trois quarts', '3/4'], ['moitié', '1/2'], ['tiers', '1/3'], ['quart', '1/4'], ['cinquième', '1/5'], ['dixième', '1/10']];
const MAJORITES = /majorité (absolue|qualifiée|simple|relative)/gi;
export const VERROUS = ['ne peut', 'ne peuvent', 'interdit', 'interdite', 'interdits', 'interdites', 'jamais', 'aucun', 'aucune', 'nul', 'nulle', 'de plein droit', 'exclusivement', 'seul', 'seule', 'seuls', 'seules', 'au plus', 'au moins', 'sauf', 'sous réserve', 'obligatoire', 'tenu', 'tenue', 'doit', 'doivent', 'sans délai', 'non renouvelable', 'absolument', 'strictement'];
export const INSTITUTIONS = [
  'convention constituante', 'convention de programmation', 'convention thématique', 'convention ordinaire annuelle', 'convention de désignation', 'convention de secours', 'convention citoyenne territoriale', 'convention des droits fondamentaux',
  'Autorité générale des conventions citoyennes', 'Autorité de programmation civique', 'Conseil constitutionnel', 'Conseil scientifique', 'jury technique', "Autorité de contrôle de l'exécution des lois", 'session plénière', 'service technique', 'Procureur général des comptes publics', 'Commission permanente', 'Défenseur des droits',
  'Juridiction de probité', 'Conseil supérieur de la magistrature', 'Cour des comptes', 'Conseil d\'État', 'Cour de cassation', 'juridiction administrative', 'juge', 'collège des ministres', 'ministre', 'représentant', 'Autorité de régulation', 'loi organique', 'référendum', 'pétition', 'Union européenne',
];

const norm = (s) => s.replace(/[  ]/g, ' ').replace(/’/g, "'");

/** Éléments comparables d'un texte. */
export function elements(texte) {
  const renvois = [...texte.matchAll(/\]\(#([^)]+)\)/g)].map((m) => m[1]);
  let t = norm(texte.replace(/\[([^\]]+)\]\(#[^)]+\)/g, '$1'));
  const nombres = [];
  for (const m of t.matchAll(RE_NOMBRE)) {
    const unite = Object.entries(UNITE).find(([re]) => new RegExp(`^${re}$`, 'i').test(m[2]));
    const v = valeur(m[1]);
    if (v) nombres.push(`${v} ${unite ? unite[1] : m[2]}`);
  }
  const fractions = [];
  let reste = t.toLowerCase();
  for (const [mot, f] of FRACTIONS) {
    const re = new RegExp(`(?<![\\p{L}])${mot}(?![\\p{L}])`, 'gu');
    for (const _ of reste.matchAll(re)) fractions.push(f);
    reste = reste.replace(re, ' ');
  }
  const majorites = [...t.matchAll(MAJORITES)].map((m) => `majorité ${m[1].toLowerCase()}`);
  const lower = t.toLowerCase();
  const verrous = {};
  for (const v of VERROUS) {
    const n = (lower.match(new RegExp(`(?<![\\p{L}])${v}(?![\\p{L}])`, 'gu')) || []).length;
    if (n) verrous[v] = n;
  }
  const institutions = INSTITUTIONS.filter((i) => lower.includes(i.toLowerCase()));
  return { nombres, fractions: [...fractions, ...majorites], verrous, institutions, renvois };
}

const compte = (arr) => arr.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map());
function ecart(avant, apres) {
  const a = compte(avant), b = compte(apres), perdus = [], ajoutes = [];
  for (const [k, n] of a) for (let i = 0; i < n - (b.get(k) || 0); i++) perdus.push(k);
  for (const [k, n] of b) for (let i = 0; i < n - (a.get(k) || 0); i++) ajoutes.push(k);
  return { perdus, ajoutes };
}
const somme = (objs) => objs.reduce((m, o) => { for (const [k, n] of Object.entries(o)) m[k] = (m[k] || 0) + n; return m; }, {});

/** Compare le texte figé et le texte actuel. */
export function comparer() {
  if (!fs.existsSync(AVANT)) return null;
  const avant = JSON.parse(fs.readFileSync(AVANT, 'utf8')).articles;
  const apres = lireArticles();
  const { byId } = collect();
  const erreurs = [];
  const groupes = new Map(apres.map((a) => [a.id, { apres: a, avant: [] }]));
  for (const old of avant) {
    const e = resolve(byId, old.id);
    if (!e || e.kind !== 'article') { erreurs.push(`L'ancien article ${old.num} (« ${old.nom} », #${old.id}) n'a plus de destination : ajoutez « #${old.id} » comme alias de l'article qui le remplace.`); continue; }
    groupes.get(e.primary).avant.push(old);
  }
  const resultats = [];
  for (const g of groupes.values()) {
    const ancien = g.avant.map((o) => o.texte).join('\n\n');
    const identique = g.avant.length === 1 && g.avant[0].texte === g.apres.texte && g.avant[0].num === g.apres.num && g.avant[0].nom === g.apres.nom;
    if (identique) continue;
    const A = elements(ancien), B = elements(g.apres.texte);
    const va = somme(g.avant.map((o) => elements(o.texte).verrous)), vb = B.verrous;
    const verrous = [...new Set([...Object.keys(va), ...Object.keys(vb)])]
      .filter((k) => (va[k] || 0) !== (vb[k] || 0)).map((k) => ({ mot: k, avant: va[k] || 0, apres: vb[k] || 0 }));
    const r = {
      apres: g.apres, avant: g.avant, nouveau: g.avant.length === 0,
      nombres: ecart(A.nombres, B.nombres), fractions: ecart(A.fractions, B.fractions),
      institutions: ecart([...new Set(A.institutions)], B.institutions), renvois: ecart([...new Set(A.renvois)], [...new Set(B.renvois)]),
      verrous, mots: { avant: ancien.split(/\s+/).length, apres: g.apres.texte.split(/\s+/).length },
    };
    r.alerte = r.nouveau || r.nombres.perdus.length || r.nombres.ajoutes.length || r.fractions.perdus.length || r.fractions.ajoutes.length
      || r.institutions.perdus.length || verrous.some((v) => v.apres < v.avant);
    resultats.push(r);
  }
  // Bilan global : un nombre « perdu » ici et « ajouté » ailleurs a seulement été déplacé.
  const tout = (arts, k) => arts.flatMap((a) => elements(a.texte)[k]);
  const global = { nombres: ecart(tout(avant, 'nombres'), tout(apres, 'nombres')), fractions: ecart(tout(avant, 'fractions'), tout(apres, 'fractions')) };
  const mots = { avant: avant.reduce((n, a) => n + a.texte.split(/\s+/).length, 0), apres: apres.reduce((n, a) => n + a.texte.split(/\s+/).length, 0) };
  return { erreurs, resultats, global, mots, nbAvant: avant.length, nbApres: apres.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  if (process.argv.includes('--figer')) {
    fs.mkdirSync(path.dirname(AVANT), { recursive: true });
    const articles = lireArticles();
    fs.writeFileSync(AVANT, JSON.stringify({ version: 'avant-refonte', articles }, null, 1) + '\n');
    console.log(`Texte figé : ${articles.length} articles → ${path.relative(ROOT, AVANT)}`);
    process.exit(0);
  }
  const c = comparer();
  if (!c) { console.log('Aucun texte figé (node site/refonte.mjs --figer).'); process.exit(0); }
  const liste = (x) => x.join(', ');
  for (const r of c.resultats.filter((x) => x.alerte)) {
    console.log(`\nArticle ${r.apres.num} — ${r.apres.nom}  ←  ${r.avant.map((o) => o.num).join(', ') || 'nouveau'}`);
    if (r.nombres.perdus.length) console.log(`  nombres disparus : ${liste(r.nombres.perdus)}`);
    if (r.nombres.ajoutes.length) console.log(`  nombres apparus : ${liste(r.nombres.ajoutes)}`);
    if (r.fractions.perdus.length) console.log(`  majorités disparues : ${liste(r.fractions.perdus)}`);
    if (r.fractions.ajoutes.length) console.log(`  majorités apparues : ${liste(r.fractions.ajoutes)}`);
    if (r.institutions.perdus.length) console.log(`  institutions plus citées : ${liste(r.institutions.perdus)}`);
    const baisses = r.verrous.filter((v) => v.apres < v.avant);
    if (baisses.length) console.log(`  verrous en baisse : ${baisses.map((v) => `« ${v.mot} » ${v.avant}→${v.apres}`).join(', ')}`);
  }
  console.log(`\n${c.nbAvant} articles avant, ${c.nbApres} après ; ${c.mots.avant} mots avant, ${c.mots.apres} après (${Math.round((c.mots.apres / c.mots.avant - 1) * 100)} %).`);
  console.log(`${c.resultats.length} article(s) modifié(s), ${c.resultats.filter((x) => x.alerte).length} à examiner.`);
  if (c.global.nombres.perdus.length || c.global.fractions.perdus.length) console.log(`Sur l'ensemble du texte, disparus : ${liste([...c.global.nombres.perdus, ...c.global.fractions.perdus])}`);
  for (const e of c.erreurs) console.error(`Erreur — ${e}`);
  process.exit(c.erreurs.length ? 1 : 0);
}
