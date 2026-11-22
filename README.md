# Re-public

Avant-projet de **Constitution de la République délibérative française** : une République où la loi est formée par des conventions citoyennes tirées au sort.

> Projet de travail, non stabilisé. Version de référence : v26 (novembre 2026), refonte de la v25 en 179 articles ; la table de concordance du site donne la correspondance des numéros.

## Organisation du dépôt

| Dossier | Contenu |
|---|---|
| `constitution/` | Le texte, un fichier par titre (Markdown). C'est la version de travail. |
| `site/` | Le site web : pages éditoriales (`site/pages/`), styles et scripts (`site/assets/`), générateur (`site/build.mjs`), réglages (`site/config.json`). |

Les points de fond encore ouverts sont suivis en *issues* (une par décision à prendre).

## Sommaire

- [Avertissement](constitution/00-avertissement.md)
- [Préambule](constitution/00-preambule.md)
- [Titre I — Des principes fondamentaux](constitution/titre-01-principes-fondamentaux.md)
- [Titre II — Des droits fondamentaux](constitution/titre-02-droits-fondamentaux.md)
- [Titre III — Des conventions citoyennes](constitution/titre-03-conventions-citoyennes.md)
- [Titre IV — Des autorités d'organisation délibérative](constitution/titre-04-autorites-organisation-deliberative.md)
- [Titre V — Du Conseil constitutionnel](constitution/titre-05-conseil-constitutionnel.md)
- [Titre VI — Du contrôle scientifique](constitution/titre-06-controle-scientifique.md)
- [Titre VII — De l'exécution des lois](constitution/titre-07-execution-lois.md)
- [Titre VIII — De l'Autorité de contrôle de l'exécution des lois](constitution/titre-08-autorite-controle-execution-lois.md)
- [Titre IX — De la Juridiction de probité et de responsabilité publique](constitution/titre-09-juridiction-probite-responsabilite-publique.md)
- [Titre X — De l'autorité judiciaire](constitution/titre-10-autorite-judiciaire.md)
- [Titre XI — Des finances publiques](constitution/titre-11-finances-publiques.md)
- [Titre XII — Des crises et de la convention citoyenne de secours](constitution/titre-12-crises-convention-citoyenne-secours.md)
- [Titre XIII — De l'organisation territoriale](constitution/titre-13-organisation-territoriale.md)
- [Titre XIV — De la probité délibérative et de la prévention des manipulations](constitution/titre-14-probite-deliberative-prevention-manipulations.md)
- [Titre XV — Des traités internationaux et des relations avec l'Union européenne](constitution/titre-15-traites-union-europeenne.md)
- [Titre XVI — De la révision constitutionnelle](constitution/titre-16-revision-constitutionnelle.md)

## Contribuer

- **Proposer une modification** : modifier le fichier concerné et ouvrir une *pull request* (possible directement depuis l'interface web de GitHub, bouton crayon).
- **Discuter un point de fond** : ouvrir une *issue*.

## Renvois entre articles

Chaque article et chaque titre porte un **identifiant permanent**, écrit à la fin de son intitulé. Il ne change jamais, même si l'article est renuméroté, déplacé ou renommé :

```markdown
### Article 4 — Séparation des pouvoirs {#separation-pouvoirs}
# Titre XII — Des crises et de la convention citoyenne de secours {#crises}
```

Les renvois s'écrivent avec cet identifiant. Le numéro entre crochets est indicatif : le site affiche toujours le numéro à jour.

```markdown
dans les conditions prévues à l'article [77](#autorisation-operations-militaires) et au Titre [XII](#crises)
```

- **Nouvel article** : choisir un identifiant court (minuscules sans accents, chiffres, tirets), qui n'a jamais servi.
- **Fusion** : l'article qui en absorbe un autre garde l'identifiant de celui-ci comme alias : `{#statut-magistrats #statut-magistrats-normes}`.
- **Vérifier** : `npm run refs` signale les renvois cassés, les renvois écrits sans identifiant et les numéros affichés périmés ; `npm run refs -- --fix` met ces numéros à jour dans les fichiers. La construction du site échoue tant qu'un renvoi est cassé.
- **Anciens liens** : `site/concordance/v25.json` fige la numérotation de la v25. Les anciens liens (`/texte/titre-03/#article-19`) redirigent vers la place actuelle de l'article, et la page « Table de concordance » du site liste les changements de numéro.
- Les commentaires du site sont rattachés à l'identifiant, pas au numéro.

## Schémas de la page « Fonctionnement »

Les schémas de `site/pages/fonctionnement.md` s'écrivent dans des blocs ```` ```schema ```` au format YAML : des nœuds placés sur une grille (`ligne`, `colonne`), avec un `type` (`citoyens`, `electeurs`, `autorite`, `administration`, `etape`), un `nom`, un `detail` court et une `info` affichée au survol. Les liens s'écrivent `a -> b | étiquette` (pointillé : `-->`, contournement : `| droite` ou `| gauche`). Les renvois aux articles suivent la syntaxe ci-dessus et sont vérifiés. Le mode d'emploi complet est en tête de `site/schemas.mjs`.

## Vérifier la refonte

Pendant la refonte du texte (issue #19), le texte d'avant est figé dans `site/refonte/avant.json`. Chaque article réécrit garde, comme identifiant ou comme alias, les identifiants des articles qu'il remplace. `npm run refonte` compare alors chaque nouvel article aux anciens qu'il absorbe et signale tout nombre, délai, majorité, institution ou mot de garantie (« ne peut », « interdit », « de plein droit »…) qui a disparu ; la vérification échoue si un ancien article n'a plus de destination. La page `/texte/refonte/` du site montre la comparaison « avant / après ».

## Le site web

Le site est généré à partir des fichiers de `constitution/` : toute modification du texte fusionnée dans `main` met le site à jour.

- Générer en local : `npm install` puis `npm run build` (résultat dans `dist/`), ou `npm run serve` pour le voir sur http://localhost:4173.
- Hébergement : Cloudflare Pages, relié à ce dépôt. Commande de build `npm run build`, dossier de sortie `dist`.
- Commentaires : Giscus, sur GitHub Discussions, un fil par article. Les identifiants se règlent dans `site/config.json` (`giscus.categoryId`).
