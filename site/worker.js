// Redirige l'ancienne adresse workers.dev vers le nom de domaine principal.
// Les autres adresses (domaine principal, versions d'essai des pull requests)
// servent directement les fichiers du site.
const ANCIENNE = 're-public.republic-fr.workers.dev';
const DOMAINE = 'https://republic-fr.org';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === ANCIENNE) {
      return Response.redirect(DOMAINE + url.pathname + url.search, 301);
    }
    return env.ASSETS.fetch(request);
  },
};
