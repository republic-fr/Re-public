---
title: Comment fonctionne le système
tag: Fonctionnement
subtag: Le système en schémas
description: Le fonctionnement de la République délibérative en sept schémas interactifs : le cycle de cinq ans, la loi, les ministères, la justice, l'Europe, les crises et les territoires.
---

<p class="lead">Sept schémas pour comprendre qui décide, qui exécute et qui contrôle. Survolez ou touchez chaque élément pour lire son rôle et les articles qui le fondent.</p>

<ol class="dg-index">
<li><a href="#cycle">Le cycle de cinq ans</a></li>
<li><a href="#loi">La fabrique de la loi</a></li>
<li><a href="#ministeres">Les ministères</a></li>
<li><a href="#justice">La justice</a></li>
<li><a href="#europe">L’Europe</a></li>
<li><a href="#crises">Les crises</a></li>
<li><a href="#territoires">Les territoires</a></li>
</ol>

<h2 id="cycle"><span class="kicker">01</span>Le cycle de cinq ans</h2>

Tout part de la convention constituante, qui adopte la Constitution. Ensuite, la vie publique suit un cycle de cinq ans : une convention fixe le cap, des conventions forment les lois, l’administration les applique et une autorité citoyenne contrôle le tout chaque année.

```schema
id: cycle
colonnes: 3
intro: Le cycle se répète tous les cinq ans. Les citoyens tirés au sort changent à chaque convention ; ce sont les institutions qui assurent la continuité.
noeuds:
  - id: constituante
    ligne: 1
    colonne: 2
    type: citoyens
    nom: Convention constituante
    detail: 300 citoyens tirés au sort
    info: >-
      Elle délibère sur la Constitution article par article, pendant trois à six mois. Elle est réunie pour adopter la Constitution, puis pour chaque révision
      (article [210](#constituante-composition-mandat)).
  - id: referendum
    ligne: 2
    colonne: 2
    type: electeurs
    nom: Référendum
    detail: Ratifie la Constitution
    info: >-
      Le texte est adopté si la majorité des votants l’approuve et si les « oui » représentent au moins un tiers des inscrits
      (article [215](#referendum-revision-majorite)).
  - id: programmation
    ligne: 3
    colonne: 2
    type: citoyens
    nom: Convention de programmation
    detail: Tous les cinq ans
    info: >-
      150 citoyens fixent les priorités de la période, le programme des lois à préparer et les grandes orientations budgétaires et fiscales.
      Elle examine toutes les demandes reçues et motive publiquement ses choix (articles [19](#convention-programmation) et [20](#programmation-saisines)).
  - id: apc
    ligne: 4
    colonne: 1
    type: citoyens
    nom: Autorité de programmation civique
    detail: 50 citoyens, renouvelés par moitié tous les six mois
    info: >-
      Elle met en œuvre le programme en ouvrant les conventions thématiques, répertorie les demandes et veille au pluralisme des experts.
      Elle peut ouvrir une convention hors programme dans des cas limités : pétition, demande d’une autorité de contrôle, acte européen, échéance juridique
      (articles [32](#apc-nature-composition) à [35](#apc-interdictions)).
  - id: petitions
    ligne: 3
    colonne: 3
    type: electeurs
    nom: Pétitions
    detail: Ouvertes à tous
    info: >-
      Toute pétition qui atteint le seuil légal est transmise à la convention de programmation. À cinq cent mille signatures,
      l’Autorité de programmation civique doit examiner l’ouverture d’une convention dédiée (article [36](#seuils-effets-petitions)).
  - id: thematiques
    ligne: 5
    colonne: 1
    type: citoyens
    nom: Conventions thématiques
    detail: Une par loi, 150 citoyens, quelques mois
    info: >-
      Chacune forme une loi sur un objet précis, après formation, auditions et contre-expertise. Elle est dissoute à la fin
      et laisse trois rapporteurs qui gardent sa mémoire (articles [21](#thematique-formation-objet) à [24](#adoption-loi)).
  - id: annuelle
    ligne: 5
    colonne: 3
    type: citoyens
    nom: Convention ordinaire annuelle
    detail: Une session par an, au moment du budget
    info: >-
      Elle adopte le budget et les lois fiscales, ratifie les traités majeurs, réexamine les lois suspendues et examine les décrets contestés
      (article [26](#convention-ordinaire-objet)).
  - id: administration
    ligne: 6
    colonne: 2
    type: administration
    nom: Administration d’exécution
    detail: Ministres et services
    info: >-
      Elle applique les lois et le budget, sans pouvoir politique propre. Il n’y a ni président ni Premier ministre
      (article [58](#nature-administration-execution)).
  - id: controle
    ligne: 7
    colonne: 2
    type: autorite
    nom: Autorité de contrôle de l’exécution des lois
    detail: Session plénière citoyenne chaque année
    info: >-
      Un service technique enquête toute l’année ; une session de 150 citoyens examine chaque année son rapport. Elle peut interpeller tout responsable,
      saisir la Juridiction de probité et demander des conventions correctives (articles [79](#acel-nature) à [82](#session-pleniere-competences)).
liens:
  - constituante -> referendum | texte adopté
  - referendum -> programmation | Constitution en vigueur
  - programmation -> apc | programme
  - petitions -> apc | demandes
  - programmation -> annuelle | orientations budgétaires
  - apc -> thematiques | ouvre
  - thematiques -> administration | lois
  - annuelle -> administration | budget
  - administration -> controle | contrôlée
  - controle -> programmation | | gauche
```

<h2 id="loi"><span class="kicker">02</span>La fabrique de la loi</h2>

Une loi est écrite par une convention de citoyens tirés au sort, puis vérifiée par deux contrôles indépendants avant d’entrer en vigueur. Si un contrôle la suspend, ce sont encore des citoyens qui ont le dernier mot, sauf sur les droits absolus.

```schema
id: loi
colonnes: 3
intro: De la demande à l’entrée en vigueur, chaque étape est publique. Les juges et les scientifiques peuvent suspendre une loi, jamais la réécrire.
noeuds:
  - id: petition
    ligne: 1
    colonne: 1
    type: electeurs
    nom: Pétition
    detail: 500 000 signatures
    info: >-
      À ce seuil, l’Autorité de programmation civique doit examiner l’ouverture d’une convention, par une décision motivée et contestable
      (article [36](#seuils-effets-petitions)).
  - id: programme
    ligne: 1
    colonne: 2
    type: citoyens
    nom: Convention de programmation
    detail: Programme sur cinq ans
    info: La plupart des lois viennent du programme fixé tous les cinq ans (article [19](#convention-programmation)).
  - id: demandes
    ligne: 1
    colonne: 3
    type: autorite
    nom: Autres demandes
    detail: Autorité de contrôle, acte européen, échéance…
    info: >-
      L’Autorité de programmation civique peut aussi ouvrir une convention hors programme dans une liste fermée de cas, dans la limite d’un plafond annuel
      (article [35](#apc-interdictions)).
  - id: apc
    ligne: 2
    colonne: 2
    type: citoyens
    nom: Autorité de programmation civique
    detail: Ouvre la convention et fixe sa durée
    info: Elle ouvre la convention thématique et fixe sa durée selon la complexité du sujet (article [23](#thematique-duree)).
  - id: jury
    ligne: 3
    colonne: 1
    type: autorite
    nom: Jury d’experts
    detail: Tiré au sort, prépare le dossier
    info: >-
      Des experts tirés au sort dans un vivier pluraliste préparent un dossier contradictoire et proposent des auditions. Ils n’ont aucun pouvoir d’orientation
      (articles [171](#jury-experts-independants) et [172](#jury-experts-mission)).
  - id: convention
    ligne: 3
    colonne: 2
    type: citoyens
    nom: Convention thématique
    detail: 150 citoyens, quelques mois
    info: >-
      Formation, auditions publiques, délibération protégée, aide à la rédaction : la convention écrit la loi et l’adopte aux deux tiers
      (articles [22](#thematique-cycle-deliberatif) et [24](#adoption-loi)).
  - id: contre
    ligne: 3
    colonne: 3
    type: electeurs
    nom: Contre-expertise publique
    detail: Chacun peut proposer des auditions
    info: >-
      Le dossier est publié. Citoyens et organisations peuvent proposer d’autres experts ; toutes les grandes familles d’acteurs doivent être entendues
      (articles [174](#contre-expertise-publique) et [175](#pluralite-minimale-auditions)).
  - id: adopte
    ligne: 4
    colonne: 2
    type: etape
    nom: Texte adopté
    detail: Contrôlé avant d’entrer en vigueur
  - id: scientifique
    ligne: 5
    colonne: 1
    type: autorite
    nom: Contrôle scientifique
    detail: Contresens manifeste seulement
    info: >-
      Un conseil de scientifiques tirés au sort ne peut suspendre un texte qu’en cas de contresens scientifique manifeste, faisant consensus, qui menace la santé,
      l’intégrité des personnes ou l’environnement. Il ne juge jamais l’opportunité politique (articles [55](#controle-scientifique-champ) et [56](#controle-scientifique-suspension)).
  - id: constitutionnel
    ligne: 5
    colonne: 3
    type: autorite
    nom: Conseil constitutionnel
    detail: Contrôle automatique
    info: >-
      Chaque loi lui est soumise avant d’entrer en vigueur. Il vérifie le respect de la Constitution, des droits et des procédures, et peut suspendre le texte
      (articles [42](#controle-prealable-automatique-lois) et [46](#cc-etendue-controle)).
  - id: suspension
    ligne: 6
    colonne: 1
    type: etape
    nom: Suspension
    detail: Chaque grief est dit « de forme » ou « de fond »
    info: La décision précise les griefs et les articles en cause (article [25](#reexamen-cas-suspension)).
  - id: vigueur
    ligne: 6
    colonne: 3
    type: etape
    nom: Entrée en vigueur
    detail: L’administration l’applique
    info: >-
      La loi s’applique à la date qu’elle fixe. Une fois en vigueur, elle peut encore être contestée par toute personne qui y a intérêt
      (articles [24](#adoption-loi) et [44](#cc-saisine-posteriori)).
  - id: rapporteurs
    ligne: 7
    colonne: 1
    type: citoyens
    nom: Rapporteurs
    detail: Grief de forme
    info: >-
      Les trois rapporteurs de la convention peuvent, en un mois, retirer ou rectifier les dispositions visées, sans rien ajouter. Le texte rectifié
      repasse devant le Conseil constitutionnel (article [25](#reexamen-cas-suspension)).
  - id: reexamen
    ligne: 7
    colonne: 2
    type: citoyens
    nom: Convention ordinaire annuelle
    detail: Grief de fond
    info: >-
      Elle réexamine le texte en séance plénière, après avoir entendu les deux parties. Elle peut le corriger, l’abandonner ou le confirmer aux deux tiers.
      La confirmation est impossible pour les droits absolus, la procédure et l’organisation des institutions. En cas d’échéance juridique, la convention de secours statue
      (article [25](#reexamen-cas-suspension)).
liens:
  - petition -> apc | pétition
  - programme -> apc | programme
  - demandes -> apc | demande motivée
  - apc -> convention | ouvre
  - jury --> convention | dossier
  - contre --> convention | auditions
  - convention -> adopte | vote aux 2/3
  - adopte -> scientifique
  - adopte -> constitutionnel
  - scientifique -> suspension | suspend
  - constitutionnel -> suspension | suspend
  - constitutionnel -> vigueur | conforme
  - suspension -> rapporteurs | forme
  - suspension -> reexamen | fond
  - reexamen -> vigueur | confirmation | droite
```

<h2 id="ministeres"><span class="kicker">03</span>Les ministères</h2>

Les ministres ne sont pas élus et ne gouvernent pas : ils exécutent la loi. Des citoyens tirés au sort les choisissent parmi des candidats contrôlés, et des autorités indépendantes peuvent les sanctionner ou les révoquer.

```schema
id: ministeres
colonnes: 3
intro: Une administration collégiale, sans chef, strictement soumise à la loi et contrôlée en continu.
noeuds:
  - id: appel
    ligne: 1
    colonne: 2
    type: autorite
    nom: Appel à candidatures
    detail: Public, ouvert à tous
    info: >-
      L’Autorité générale des conventions citoyennes organise un appel public, ouvert à toute citoyenne et tout citoyen
      (article [62](#procedure-designation-ministres)).
  - id: jury
    ligne: 2
    colonne: 1
    type: autorite
    nom: Jury technique
    detail: Vérifie les compétences
    info: >-
      Des experts en administration tirés au sort vérifient l’expérience et la capacité de direction, jamais les opinions politiques
      (article [63](#jury-technique-ministres)).
  - id: probite
    ligne: 2
    colonne: 3
    type: autorite
    nom: Juridiction de probité
    detail: Contrôle d’intégrité préalable
    info: >-
      Elle vérifie le patrimoine, les intérêts et le casier des candidats, et dresse la liste des candidats recevables
      (articles [64](#ministres-controle-probite) et [99](#controle-prealable-probite)).
  - id: designation
    ligne: 3
    colonne: 2
    type: citoyens
    nom: Convention de désignation
    detail: Permanente, membres renouvelés tous les deux ans
    info: >-
      Elle auditionne publiquement les candidats recevables et désigne les ministres aux deux tiers. Elle désigne aussi les représentants
      aux relations extérieures (articles [61](#convention-designation-ministres) et [62](#procedure-designation-ministres)).
  - id: ministres
    ligne: 4
    colonne: 2
    type: administration
    nom: Ministres
    detail: Collégiaux, mandat de trois ans
    info: >-
      Chaque ministre dirige un domaine. Les désaccords se règlent collectivement. Le mandat dure trois ans, renouvelable une fois
      (articles [60](#structure-collegiale) et [65](#duree-mandat-ministeriel)).
  - id: decrets
    ligne: 5
    colonne: 1
    type: administration
    nom: Décrets d’application
    detail: Strictement soumis à la loi
    info: >-
      La loi fixe les principes ; les ministres prennent les décrets qui l’appliquent, sans pouvoir en changer le sens
      (article [59](#subordination-loi)).
  - id: controle
    ligne: 5
    colonne: 3
    type: autorite
    nom: Autorité de contrôle
    detail: Enquête et interpelle en continu
    info: >-
      Son service technique enquête sur l’application des lois et peut saisir le juge pour faire exécuter une loi ou annuler un acte illégal
      (article [86](#service-technique-pouvoirs)).
  - id: evocation
    ligne: 6
    colonne: 1
    type: electeurs
    nom: Évocation
    detail: Dans les deux mois
    info: >-
      Un décret contesté peut être soumis aux citoyens : par l’Autorité de programmation civique, d’office ou à la demande des rapporteurs
      ou de l’Autorité de contrôle, ou de plein droit sur pétition (article [59](#subordination-loi)).
  - id: sanction
    ligne: 6
    colonne: 3
    type: autorite
    nom: Juridiction de probité
    detail: Juge les fautes graves
    info: >-
      Non-exécution d’une loi, abus de pouvoir, corruption : elle peut avertir, révoquer et déclarer inéligible
      (articles [101](#jugement-fautes-graves) et [105](#juridiction-probite-sanctions)).
  - id: convention
    ligne: 7
    colonne: 1
    type: citoyens
    nom: Convention citoyenne
    detail: Approuve, modifie ou annule
    info: >-
      La convention annuelle suivante, ou la convention thématique du domaine si elle siège, tranche. Le décret s’applique en attendant
      (article [59](#subordination-loi)).
liens:
  - appel -> jury | candidatures
  - appel -> probite | en parallèle
  - jury -> designation | compétences
  - probite -> designation | recevables
  - designation -> ministres | désigne aux 2/3
  - ministres -> decrets | prennent
  - ministres -> controle | contrôlés
  - decrets -> evocation | contestation
  - evocation -> convention | examen
  - controle -> sanction | faute grave
  - sanction -> ministres | révoque | gauche
```

<h2 id="justice"><span class="kicker">04</span>La justice</h2>

Les juges sont indépendants : aucune autorité ne peut leur donner d’instruction. Le parquet ne dépend plus d’un ministre, et les nominations comme la discipline relèvent d’un Conseil supérieur de la magistrature dont aucun membre n’est choisi par un responsable politique.

```schema
id: justice
colonnes: 3
intro: Trois voies pour toute personne, un organe qui garantit l’indépendance des juges, et des contrôles sur les juges eux-mêmes.
noeuds:
  - id: personne
    ligne: 1
    colonne: 2
    type: electeurs
    nom: Toute personne
    detail: Justiciable, usager, citoyen
    info: >-
      Chacun a droit à un juge indépendant, à un procès équitable, à la défense et à un recours effectif
      (article [108](#garanties-essentielles)).
  - id: defenseur
    ligne: 2
    colonne: 1
    type: autorite
    nom: Défenseur des droits
    detail: Face aux administrations
    info: >-
      Il traite les réclamations contre les services publics et les discriminations, peut enquêter, faire une médiation et saisir le juge
      (articles [89](#defenseur-droits-nature-mission) à [92](#defenseur-droits-pouvoirs)).
  - id: tribunaux
    ligne: 2
    colonne: 2
    type: autorite
    nom: Tribunaux et cours
    detail: Juges indépendants et inamovibles
    info: >-
      Aucune autorité ne peut intervenir dans une affaire en cours. Les magistrats sont inamovibles et doivent signaler toute pression
      (articles [107](#independance-justice) et [109](#statut-magistrats)).
  - id: constitutionnel
    ligne: 2
    colonne: 3
    type: autorite
    nom: Conseil constitutionnel
    detail: Recours contre une loi
    info: >-
      Toute personne qui y a intérêt peut contester une loi en vigueur ou un acte d’exécution. Ses membres sont tirés au sort parmi des juristes
      (articles [39](#cc-composition) et [44](#cc-saisine-posteriori)).
  - id: parquet
    ligne: 3
    colonne: 1
    type: autorite
    nom: Parquet
    detail: Indépendant de tout ministre
    info: >-
      Aucune instruction ne peut être donnée aux procureurs. La politique pénale est fixée par la loi, votée en convention
      (article [106](#independance-parquet)).
  - id: csm
    ligne: 4
    colonne: 2
    type: autorite
    nom: Conseil supérieur de la magistrature
    detail: Nominations, discipline, déontologie
    info: >-
      Aucune nomination de magistrat ne peut se faire sans son accord. Il juge la discipline des magistrats et peut être saisi par tout justiciable
      (articles [116](#csm-nominations) à [120](#csm-saisine-justiciables)).
  - id: pairs
    ligne: 5
    colonne: 1
    type: etape
    nom: Élus par leurs pairs
    detail: 8 magistrats sur 12
    info: Les magistrats membres sont élus par les magistrats (articles [112](#csm-composition) et [113](#csm-designation-membres)).
  - id: tirage
    ligne: 5
    colonne: 3
    type: etape
    nom: Tirés au sort
    detail: Avocat, universitaires, personnalité
    info: Les autres membres sont tirés au sort dans des viviers ouverts (article [113](#csm-designation-membres)).
  - id: probite
    ligne: 6
    colonne: 1
    type: autorite
    nom: Juridiction de probité
    detail: Fautes graves, y compris des magistrats
    info: >-
      Elle juge les fautes graves des magistrats, comme la corruption ou l’abus de pouvoir. La discipline ordinaire reste au Conseil supérieur
      (article [121](#repartition-probite-judiciaire)).
  - id: controle
    ligne: 6
    colonne: 3
    type: citoyens
    nom: Session plénière de contrôle
    detail: 150 citoyens, chaque année
    info: >-
      Elle examine le rapport annuel du Conseil supérieur, peut l’interpeller et traite les plaintes collectives sur le fonctionnement de la justice
      (article [122](#csm-controle-annuel)).
liens:
  - personne -> defenseur | réclamation
  - personne -> tribunaux | saisit un juge
  - personne -> constitutionnel | conteste une loi
  - parquet -> tribunaux | poursuit
  - csm -> tribunaux | nomme, sanctionne
  - csm -> parquet | nomme, sanctionne
  - pairs -> csm | élisent
  - tirage -> csm | complètent
  - probite --> csm | saisine mutuelle
  - controle -> csm | contrôle
```

<h2 id="europe"><span class="kicker">05</span>L’Europe</h2>

La France reste dans l’Union européenne. Ce qui change : les grands choix européens reviennent aux citoyens, et plus un transfert de compétences est important, plus la procédure est exigeante.

```schema
id: europe
colonnes: 3
intro: Le Conseil constitutionnel aiguille chaque traité ou transfert de compétences vers la bonne procédure. En cas de doute, il choisit la plus exigeante.
noeuds:
  - id: ue
    ligne: 1
    colonne: 2
    type: etape
    nom: Union européenne
    detail: Projets d’actes, traités
    info: >-
      Le droit de l’Union prime sur la loi, sauf atteinte à l’identité constitutionnelle de la République : droits intangibles, souveraineté des conventions,
      indépendance de la justice (articles [194](#primaute-droit-union) et [196](#identite-constitutionnelle-republique)).
  - id: controle
    ligne: 2
    colonne: 1
    type: autorite
    nom: Autorité de contrôle
    detail: Publie et surveille les projets
    info: >-
      Elle reçoit et publie tous les projets d’actes européens, contrôle la subsidiarité, peut saisir la Cour de justice de l’Union et signaler
      les projets importants (articles [200](#transmission-actes-europeens) et [201](#controle-principe-subsidiarite)).
  - id: representants
    ligne: 2
    colonne: 3
    type: administration
    nom: Représentants extérieurs
    detail: Négocient sur mandat écrit
    info: >-
      Ils négocient au nom de la France sur la base d’un mandat écrit et public des ministres, et rendent compte de chaque entretien
      (articles [68](#representants-relations-exterieures) à [71](#negociations-preparatoires)).
  - id: apc
    ligne: 3
    colonne: 1
    type: citoyens
    nom: Autorité de programmation civique
    detail: Peut ouvrir une convention
    info: Pour un projet européen important, elle peut ouvrir une convention thématique hors programme (article [35](#apc-interdictions)).
  - id: ministres
    ligne: 1
    colonne: 3
    type: administration
    nom: Ministres
    detail: Donnent le mandat, valident
    info: Le ministre compétent valide la version négociée avant ratification (article [71](#negociations-preparatoires)).
  - id: constitutionnel
    ligne: 4
    colonne: 2
    type: autorite
    nom: Conseil constitutionnel
    detail: Vérifie et choisit la procédure
    info: >-
      Saisi de plein droit, il vérifie la conformité à la Constitution et classe le transfert : mineur, intermédiaire ou majeur
      (articles [197](#transferts-repartition-portee) et [198](#transferts-procedure-applicable)).
  - id: annuelle
    ligne: 5
    colonne: 1
    type: citoyens
    nom: Convention ordinaire annuelle
    detail: Transferts mineurs
    info: Ajustements techniques et coopérations existantes (article [197](#transferts-repartition-portee)).
  - id: thematique
    ligne: 5
    colonne: 2
    type: citoyens
    nom: Convention thématique
    detail: Transferts intermédiaires
    info: >-
      Révisions simplifiées importantes, coopérations renforcées, mécanismes financiers. Un référendum est possible
      (articles [197](#transferts-repartition-portee) et [199](#referendum-transferts-intermediaires)).
  - id: constituante
    ligne: 5
    colonne: 3
    type: citoyens
    nom: Convention constituante
    detail: Transferts majeurs
    info: Nouveaux traités et transferts substantiels, puis référendum obligatoire. Il en va de même pour une sortie de l’Union (articles [197](#transferts-repartition-portee) et [205](#sortie-union-europeenne)).
  - id: referendum
    ligne: 6
    colonne: 2
    type: electeurs
    nom: Référendum
    detail: Obligatoire ou à la demande
    info: >-
      Obligatoire pour les transferts majeurs. Pour un transfert intermédiaire, il peut être décidé par la convention aux deux tiers ou demandé
      par un million de signatures (article [199](#referendum-transferts-intermediaires)).
liens:
  - ue -> controle | projets d’actes
  - ue -> representants | négociations
  - controle -> apc | projets importants
  - ministres -> representants | mandat
  - representants -> constitutionnel | texte négocié
  - constitutionnel -> annuelle | mineur
  - constitutionnel -> thematique | intermédiaire
  - constitutionnel -> constituante | majeur
  - thematique --> referendum | possible
  - constituante -> referendum | obligatoire
```

<h2 id="crises"><span class="kicker">06</span>Les crises</h2>

En cas de crise, l’administration protège immédiatement, sous le contrôle d’un juge. Les mesures qui touchent aux libertés ne peuvent être autorisées que par une convention de citoyens tirés au sort à l’avance, et pour une durée limitée.

```schema
id: crises
colonnes: 3
intro: Agir vite sans confisquer le pouvoir. Aucune crise ne permet de toucher aux droits absolus ni de donner le pouvoir à l’armée.
noeuds:
  - id: crise
    ligne: 1
    colonne: 2
    type: etape
    nom: Crise
    detail: Menace grave et immédiate
    info: Pandémie, catastrophe, attaque, cyberattaque, menace contre les institutions (article [142](#notion-crise)).
  - id: conservatoires
    ligne: 2
    colonne: 1
    type: administration
    nom: Mesures conservatoires
    detail: L’administration agit sans délai
    info: >-
      Secours, évacuation, protection des infrastructures, continuité des services : des mesures nécessaires, proportionnées et réversibles
      (articles [146](#conservatoires-cadre-autorise) et [148](#conservatoires-validite)).
  - id: interdits
    ligne: 2
    colonne: 3
    type: etape
    nom: Interdictions absolues
    detail: Même en crise
    info: >-
      Interdits : transférer le pouvoir à l’administration ou à l’armée, suspendre les garanties judiciaires, porter atteinte aux droits intangibles
      (articles [144](#crise-interdictions-absolues) et [145](#exclusion-regime-militaire-exception)).
  - id: juge
    ligne: 3
    colonne: 1
    type: autorite
    nom: Juge de l’urgence
    detail: Saisi en 6 h, décide en 12 h
    info: >-
      Chaque mesure est validée par un juge siégeant jour et nuit. S’il refuse, la mesure tombe
      (article [149](#crise-controle-juridictionnel)).
  - id: secours
    ligne: 3
    colonne: 2
    type: citoyens
    nom: Convention de secours
    detail: 150 citoyens en veille, siège sous 72 h
    info: >-
      Ses membres sont tirés au sort et formés à l’avance. Elle se saisit dès qu’une mesure est validée ; à défaut, elle est convoquée de plein droit
      sous 24 heures. Elle peut siéger à distance ou dans un siège de repli (articles [151](#secours-composition-veille) à [153](#secours-delai-siege)).
  - id: recours
    ligne: 4
    colonne: 1
    type: electeurs
    nom: Recours citoyen
    detail: À tout moment
    info: Toute personne touchée par une mesure peut demander au juge de la lever ou de la limiter (article [150](#crise-recours-citoyen)).
  - id: exceptionnelles
    ligne: 4
    colonne: 2
    type: etape
    nom: Mesures exceptionnelles
    detail: Autorisées aux deux tiers
    info: >-
      Restriction de libertés, armée sur le territoire, mesures fiscales exceptionnelles : elles exigent l’autorisation de la convention de secours
      (articles [147](#conservatoires-cadre-interdit) et [154](#secours-competences)).
  - id: controles
    ligne: 4
    colonne: 3
    type: autorite
    nom: Contrôles maintenus
    detail: Juges et autorités restent compétents
    info: >-
      Le Conseil constitutionnel, l’Autorité de contrôle, la Juridiction de probité et les tribunaux continuent de fonctionner pendant la crise
      (article [155](#secours-controles-maintenus)).
  - id: duree
    ligne: 5
    colonne: 2
    type: etape
    nom: Vote tous les 30 jours
    detail: Six mois au plus
    info: >-
      Sans nouveau vote, les mesures tombent. Au-delà de six mois, elles passent à une convention ordinaire, sauf conflit armé ou catastrophe majeure :
      prorogation de trois mois aux trois quarts (article [157](#secours-duree-reexamen)).
  - id: fin
    ligne: 6
    colonne: 2
    type: etape
    nom: Fin de la crise
    detail: Constatée par la convention ou le Conseil constitutionnel
    info: La convention se désactive elle-même, ou le Conseil constitutionnel constate que la crise est terminée (article [158](#secours-desactivation)).
liens:
  - crise -> conservatoires | agit
  - crise -> secours | saisie sous 24 h
  - conservatoires -> juge | validation
  - conservatoires -> secours | informe
  - recours -> juge | demande la levée
  - secours -> exceptionnelles | autorise
  - controles -> exceptionnelles | contrôlent
  - exceptionnelles -> duree
  - duree -> fin
```

<h2 id="territoires"><span class="kicker">07</span>Les territoires</h2>

Le même principe s’applique localement : les décisions des collectivités sont prises par des conventions de citoyens tirés au sort, qui choisissent et contrôlent l’équipe chargée de les exécuter.

```schema
id: territoires
colonnes: 3
intro: Plus d’élections locales ni d’exécutif politique autonome. Les communes gardent leur administration et leurs services de proximité.
noeuds:
  - id: habitants
    ligne: 1
    colonne: 2
    type: electeurs
    nom: Habitants
    detail: Tirés au sort sur le territoire
    info: Les conventions territoriales suivent les mêmes règles que les conventions nationales (article [159](#principe-conventionnel-territorial)).
  - id: convention
    ligne: 2
    colonne: 2
    type: citoyens
    nom: Convention citoyenne territoriale
    detail: Délibère et vote les règles locales
    info: >-
      Dans ses domaines de compétence, elle dispose d’un pouvoir normatif propre et peut fixer les taux des impôts locaux dans les limites de la loi
      (articles [140](#architecture-fiscale-territoriale) et [163](#territoires-repartition-competences)).
  - id: mutualisation
    ligne: 2
    colonne: 3
    type: etape
    nom: Petites communes
    detail: Convention intercommunale
    info: >-
      Quand une commune est trop petite pour un tirage représentatif, la convention est commune à plusieurs communes
      (article [162](#mutualisation-communes)).
  - id: executif
    ligne: 3
    colonne: 1
    type: administration
    nom: Équipe d’exécution locale
    detail: Choisie sur projet, révocable
    info: >-
      La convention la désigne parmi des candidats qualifiés, sur un projet présenté publiquement, contrôle son action et ses budgets, et peut la révoquer
      (article [160](#designation-controle-executif-local)).
  - id: communes
    ligne: 3
    colonne: 3
    type: administration
    nom: Communes
    detail: État civil, services du quotidien
    info: >-
      Les communes gardent leur existence, leurs compétences de proximité et leur administration, sous le contrôle de la convention
      (article [161](#existence-juridique-communes)).
  - id: loi
    ligne: 4
    colonne: 2
    type: citoyens
    nom: Lois nationales
    detail: Compétences et péréquation
    info: >-
      La loi organique répartit les compétences selon l’autonomie locale et la subsidiarité ; la loi organise la solidarité financière entre territoires.
      Le Conseil constitutionnel veille au respect de cette répartition (articles [141](#perequation), [164](#territoires-principes-directeurs) et [46](#cc-etendue-controle)).
  - id: outremer
    ligne: 5
    colonne: 2
    type: etape
    nom: Outre-mer
    detail: Statuts particuliers
    info: >-
      Aucun changement de statut ni de territoire sans le consentement des populations, recueilli par une convention territoriale
      (article [165](#collectivites-outre-mer)).
liens:
  - habitants -> convention | tirage au sort
  - mutualisation -> convention | regroupement
  - convention -> executif | désigne, contrôle
  - convention -> communes | contrôle
  - loi -> convention | fixe le cadre
```
