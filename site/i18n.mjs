// Correspondance des adresses entre la version française et la version anglaise du site.
export const PAGES = [
  ['/', '/en/'],
  ['/texte/', '/en/text/'],
  ['/fonctionnement/', '/en/how-it-works/'],
  ['/pourquoi/', '/en/why/'],
  ['/comment/', '/en/how/'],
  ['/commenter/', '/en/comment/'],
  ['/faq/', '/en/faq/'],
  ['/contact/', '/en/contact/'],
];

/** Adresse équivalente dans l'autre langue (texte : /texte/<slug>/ <-> /en/text/<slug>/). */
export function equivalent(p) {
  for (const [fr, en] of PAGES) { if (p === fr) return en; if (p === en) return fr; }
  let m;
  if ((m = p.match(/^\/texte\/([^/]+)\/$/))) return m[1] === 'concordance' || m[1] === 'refonte' ? '/en/text/' : `/en/text/${m[1]}/`;
  if ((m = p.match(/^\/en\/text\/([^/]+)\/$/))) return `/texte/${m[1]}/`;
  return p.startsWith('/en/') ? '/' : '/en/';
}
