// Schémas fonctionnels interactifs (page « Fonctionnement »).
//
// Un schéma s'écrit dans une page, dans un bloc de code « schema » au format YAML :
//
//   ```schema
//   id: loi
//   colonnes: 3
//   intro: Texte affiché avant tout survol.
//   noeuds:
//     - id: apc
//       ligne: 2
//       colonne: 2
//       type: citoyens        # citoyens, electeurs, autorite, administration, etape
//       nom: Autorité de programmation civique
//       detail: 50 citoyens tirés au sort
//       info: Explication affichée au survol, avec renvois : article [35](#apc-interdictions).
//   liens:
//     - apc -> convention | ouvre          # flèche pleine, avec étiquette
//     - jury --> convention | dossier      # flèche en pointillé
//     - recours -> constitutionnel | saisit | droite   # contournement par la droite (ou gauche)
//   ```
//
// Les renvois aux articles suivent la syntaxe du texte et sont vérifiés par « npm run refs ».
import yaml from 'js-yaml';

export const TYPES = {
  citoyens: 'Citoyens tirés au sort',
  electeurs: 'Électeurs et habitants',
  autorite: 'Autorités et juridictions',
  administration: 'Administration',
  etape: 'Étape',
};

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function parseLink(s, ids, where) {
  const m = String(s).match(/^\s*([\w-]+)\s*(-->|->)\s*([\w-]+)\s*(?:\|\s*([^|]*?)\s*)?(?:\|\s*(droite|gauche)\s*)?$/);
  if (!m) throw new Error(`${where} : lien illisible « ${s} » (attendu : « a -> b | étiquette »).`);
  const [, from, arrow, to, label = '', via = ''] = m;
  for (const id of [from, to]) if (!ids.has(id)) throw new Error(`${where} : le lien « ${s} » cite un nœud inconnu « ${id} ».`);
  return { from, to, label, dashed: arrow === '-->', via };
}

/** Lit un bloc YAML et vérifie sa structure. */
export function parseSchema(src, where) {
  const d = yaml.load(src);
  if (!d || !d.id || !Array.isArray(d.noeuds)) throw new Error(`${where} : un schéma doit avoir un « id » et des « noeuds ».`);
  const ids = new Set();
  for (const n of d.noeuds) {
    if (!n.id || !n.nom || !n.ligne || !n.colonne) throw new Error(`${where} : chaque nœud doit avoir id, nom, ligne et colonne (${JSON.stringify(n)}).`);
    if (ids.has(n.id)) throw new Error(`${where} : nœud « ${n.id} » défini deux fois.`);
    if (!TYPES[n.type || 'autorite']) throw new Error(`${where} : type inconnu « ${n.type} » (${Object.keys(TYPES).join(', ')}).`);
    ids.add(n.id);
  }
  const liens = (d.liens || []).map((l) => parseLink(l, ids, `${where}, schéma « ${d.id} »`));
  return { ...d, colonnes: d.colonnes || 3, liens };
}

/**
 * Produit le HTML d'un schéma.
 * @param inline fonction qui transforme un texte court (renvois, gras) en HTML.
 */
export function renderSchema(s, inline) {
  const nodes = [...s.noeuds].sort((a, b) => a.ligne - b.ligne || a.colonne - b.colonne);
  const name = Object.fromEntries(nodes.map((n) => [n.id, n.nom]));
  const rows = Math.max(...nodes.map((n) => n.ligne));
  const used = new Set(nodes.map((n) => n.type || 'autorite'));
  const panelId = `dg-${s.id}-panel`;

  const outs = (id) => s.liens.filter((l) => l.from === id);
  const nodeHtml = nodes.map((n) => {
    const type = n.type || 'autorite';
    const span = n.largeur ? ` / span ${n.largeur}` : '';
    const out = outs(n.id).map((l) => `<li>${l.label ? `${esc(l.label)} → ` : '→ '}${esc(name[l.to])}</li>`).join('');
    return `<button type="button" class="dg-node dg-node--${type}" data-node="${esc(n.id)}" aria-controls="${panelId}" aria-pressed="false" style="grid-row:${n.ligne};grid-column:${n.colonne}${span}">`
      + `<span class="dg-node__name">${esc(n.nom)}</span>${n.detail ? `<span class="dg-node__detail">${esc(n.detail)}</span>` : ''}`
      + `${out ? `<ul class="dg-node__out" aria-hidden="true">${out}</ul>` : ''}</button>`;
  }).join('');

  const templates = nodes.map((n) => `<template data-node="${esc(n.id)}"><p class="dg__kicker">${esc(TYPES[n.type || 'autorite'])}</p><h3>${esc(n.nom)}</h3>${n.info ? `<p>${inline(n.info)}</p>` : ''}</template>`).join('');
  const intro = `<p class="dg__kicker">Survolez ou touchez un élément du schéma</p>${s.intro ? `<p>${inline(s.intro)}</p>` : ''}`;
  const legend = Object.entries(TYPES).filter(([k]) => used.has(k) && k !== 'etape')
    .map(([k, v]) => `<li><i class="dg-swatch dg-node--${k}"></i>${esc(v)}</li>`).join('');
  const text = nodes.map((n) => {
    const out = outs(n.id).map((l) => `${l.label ? `${esc(l.label)} : ` : ''}${esc(name[l.to])}`).join(' ; ');
    return `<dt>${esc(n.nom)}${n.detail ? ` — ${esc(n.detail)}` : ''}</dt><dd>${n.info ? inline(n.info) : ''}${out ? ` <span class="dg__next">Ensuite : ${out}.</span>` : ''}</dd>`;
  }).join('');
  const links = JSON.stringify(s.liens.map(({ from, to, label, dashed, via }) => ({ from, to, label, dashed, via })));

  return `<figure class="dg" id="schema-${esc(s.id)}" data-dg>
<div class="dg__body">
<div class="dg__canvas" style="--cols:${s.colonnes};--rows:${rows}" data-links="${esc(links)}"><svg class="dg__links" aria-hidden="true" focusable="false"></svg>${nodeHtml}</div>
<aside class="dg__panel" id="${panelId}" aria-live="polite"><div class="dg__panel-in" data-intro>${intro}</div></aside>
</div>
${templates}
<ul class="dg__legend">${legend}</ul>
<details class="dg__text"><summary>Lire ce schéma sous forme de texte</summary><dl>${text}</dl></details>
</figure>`;
}

/** Remplace les blocs ```schema d'une page par des marqueurs, rendus après le Markdown. */
export function extractSchemas(raw, where) {
  const found = [];
  const text = raw.replace(/^```schema\n([\s\S]*?)^```\s*$/gm, (all, src) => {
    found.push(parseSchema(src, where));
    return `\n<div data-schema-slot="${found.length - 1}"></div>\n`;
  });
  return { text, schemas: found };
}

export function injectSchemas(html, schemas, inline) {
  return html.replace(/<div data-schema-slot="(\d+)"><\/div>/g, (all, i) => renderSchema(schemas[+i], inline));
}
