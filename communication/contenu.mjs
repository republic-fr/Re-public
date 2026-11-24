// Contenu des documents de présentation (fiche d'une page et présentation courte), en français et en anglais.
// Tout chiffre ou toute règle cité ici doit correspondre au texte de la Constitution et aux pages du site.

export const SITE = 'republic-fr.org';
export const REPO = 'github.com/republic-fr/Re-public';

export const fiche = {
  fr: {
    titreDoc: 'REpublic — Présentation en une page',
    surtitre: 'Avant-projet de Constitution',
    titre: 'La République délibérative',
    chapeau: 'Une Constitution où la loi est écrite par des citoyennes et des citoyens tirés au sort, informés et protégés, et où tout pouvoir d’exécution reste contrôlé et révocable.',
    blocs: [
      { titre: 'Le constat', items: [
        'La Ve République concentre le pouvoir autour du président et affaiblit le Parlement (articles 16 et 49.3).',
        'Les élections représentent mal la diversité sociale, et la participation se réduit à un vote tous les cinq ans.',
        'La Convention citoyenne pour le climat l’a montré : 150 citoyens tirés au sort délibèrent sérieusement, mais un dispositif seulement consultatif ne suffit pas.',
      ] },
      { titre: 'La proposition', items: [
        'Des conventions de 150 citoyens tirés au sort écrivent les lois, après formation, auditions et contre-expertise. Chacune traite un sujet, puis est dissoute.',
        'Une convention fixe le programme tous les cinq ans ; une autre vote le budget chaque année.',
        'Ni président ni Premier ministre : des ministres choisis par des citoyens tirés au sort parmi des candidats contrôlés, qui exécutent la loi sans pouvoir propre.',
        'Le même principe s’applique aux régions, départements, intercommunalités et communes.',
      ] },
      { titre: 'Les garde-fous', items: [
        'Le Conseil constitutionnel et un conseil scientifique peuvent suspendre une loi, jamais la réécrire.',
        'Les droits fondamentaux intangibles ne peuvent reculer, même en temps de crise ou par révision.',
        'Toute personne peut contester une loi ; une pétition d’un pour cent du corps civique oblige à examiner l’ouverture d’une convention.',
        'La Constitution ne change que par référendum.',
      ] },
      { titre: 'Pour les citoyens', items: [
        'Siéger est un devoir civique, avec maintien intégral des revenus, emploi protégé, frais et garde d’enfants pris en charge.',
        'Toute personne majeure, française ou résidant en France depuis cinq ans, peut être tirée au sort.',
      ] },
    ],
    chiffres: [
      { n: '179', t: 'articles, en 17 titres' },
      { n: '≈ 1,7 Md€', t: 'par an, contre ≈ 3,7 Md€ pour les institutions qu’elle remplace' },
      { n: '1 sur 365', t: 'chance d’être tiré au sort une année donnée' },
    ],
    cheminTitre: 'Comment y parvenir',
    chemin: [
      'Un avant-projet ouvert aux commentaires',
      'Une loi ou un référendum ouvre le processus',
      '300 citoyens tirés au sort délibèrent sur la Constitution',
      'Référendum de ratification',
      'Mise en place en un mois',
    ],
    appel: 'Lire le texte, le commenter article par article, proposer une modification :',
    pied: 'Projet citoyen indépendant, publié de façon anonyme. Le texte est ouvert : chaque article peut être commenté et amendé.',
  },
  en: {
    titreDoc: 'REpublic — One-page overview',
    surtitre: 'Draft Constitution',
    titre: 'The Deliberative Republic',
    chapeau: 'A Constitution in which laws are written by citizens drawn by lot, informed and protected, and in which every executive power remains under oversight and can be revoked.',
    blocs: [
      { titre: 'The diagnosis', items: [
        'France’s Fifth Republic concentrates power around the President and weakens Parliament (Articles 16 and 49.3 of the 1958 Constitution).',
        'Elections poorly reflect social diversity, and participation is reduced to a vote every five years.',
        'France’s Citizens’ Convention for Climate showed that 150 citizens drawn by lot can deliberate seriously, but that a purely consultative body is not enough.',
      ] },
      { titre: 'The proposal', items: [
        'Conventions of 150 citizens drawn by lot write the laws, after training, hearings and counter-expertise. Each deals with one subject, then is dissolved.',
        'One convention sets the agenda every five years; another votes the budget each year.',
        'No president and no prime minister: ministers are chosen by citizens drawn by lot from vetted candidates, and carry out the law without powers of their own.',
        'The same principle applies to regions, departments, inter-municipal bodies and municipalities.',
      ] },
      { titre: 'The safeguards', items: [
        'The Constitutional Council and a scientific council may suspend a law, never rewrite it.',
        'Inviolable fundamental rights cannot be rolled back, even in a crisis or by amendment.',
        'Anyone may challenge a law; a petition signed by one per cent of the civic body requires the opening of a convention to be considered.',
        'The Constitution can be changed only by referendum.',
      ] },
      { titre: 'For citizens', items: [
        'Serving is a civic duty, with full income maintained, job protection, and expenses and childcare covered.',
        'Any adult who is French, or has lived in France for five years, may be drawn by lot.',
      ] },
    ],
    chiffres: [
      { n: '179', t: 'articles, in 17 titles' },
      { n: '≈ €1.7bn', t: 'a year, against ≈ €3.7bn for the institutions it replaces' },
      { n: '1 in 365', t: 'chance of being drawn by lot in any given year' },
    ],
    cheminTitre: 'How to get there',
    chemin: [
      'A draft open to comments',
      'A law or a referendum opens the process',
      '300 citizens drawn by lot deliberate on the Constitution',
      'Ratification referendum',
      'In place within one month',
    ],
    appel: 'Read the text, comment on it article by article, propose an amendment:',
    pied: 'An independent citizens’ project, published anonymously. The text is open: every article can be commented on and amended.',
  },
};

export const deck = {
  fr: { titreDoc: 'REpublic — Présentation', slides: [
    { type: 'titre', surtitre: 'Avant-projet de Constitution', titre: 'La République délibérative', sous: 'La loi écrite par des citoyens tirés au sort' },
    { titre: 'Le constat', lead: 'La Ve République a assuré la stabilité. Elle a aussi installé un déséquilibre durable.', items: [
      'La concentration du pouvoir autour du président',
      'L’affaiblissement du Parlement (articles 16 et 49.3)',
      'Des élections qui représentent mal la diversité sociale',
      'Une participation réduite à un vote tous les cinq ans' ] },
    { titre: 'Trois transformations depuis 1958', cols: [
      { t: 'Le numérique', d: 'Réseaux sociaux et intelligence artificielle bouleversent la formation de l’opinion.' },
      { t: 'L’effondrement écologique', d: 'Le court-termisme électoral empêche les décisions de long terme.' },
      { t: 'L’autoritarisme par les urnes', d: 'Une démocratie doit pouvoir se protéger contre ses propres dérives.' } ] },
    { titre: 'Un précédent : la Convention citoyenne pour le climat', chiffres: [
      { n: '150', t: 'citoyens tirés au sort' }, { n: '7', t: 'sessions de trois jours' }, { n: '149', t: 'propositions adoptées' } ],
      note: 'Des citoyens bien informés délibèrent sérieusement. Mais une convention seulement consultative ne suffit pas : ses propositions les plus fortes ont été abandonnées.' },
    { titre: 'L’idée', lead: 'Faire du tirage au sort le mode normal d’exercice de la souveraineté.', items: [
      'Une délibération libre, informée, pluraliste et protégée',
      'Une représentation réelle de la diversité sociale',
      'Une loi qui respecte les droits fondamentaux et les consensus scientifiques',
      'Un pouvoir d’exécution contrôlé en continu et révocable' ] },
    { titre: 'Comment une loi est faite', flux: [
      { t: 'Programme', d: 'Une convention fixe les sujets pour cinq ans ; les pétitions peuvent en ajouter.' },
      { t: 'Convention thématique', d: '150 citoyens, formation, auditions, contre-expertise, vote.' },
      { t: 'Contrôles', d: 'Conseil constitutionnel et conseil scientifique peuvent suspendre, jamais réécrire.' },
      { t: 'Application', d: 'L’administration exécute ; une autorité citoyenne contrôle chaque année.' } ] },
    { titre: 'Qui exécute, qui contrôle', items: [
      'Ni président ni Premier ministre : un collège de ministres, présidé à tour de rôle',
      'Des ministres choisis par une convention tirée au sort, parmi des candidats contrôlés',
      'Une autorité citoyenne qui contrôle l’exécution des lois et peut interpeller tout responsable',
      'Une juridiction de probité qui peut révoquer',
      'Une justice indépendante : aucune instruction, aucune nomination politique' ] },
    { titre: 'Ce qui change pour vous', grille: [
      { t: 'Faire la loi', d: 'Tout adulte peut être tiré au sort, revenus et emploi garantis.' },
      { t: 'Mettre un sujet à l’agenda', d: 'Une pétition d’un pour cent du corps civique oblige à examiner l’ouverture d’une convention.' },
      { t: 'Contester', d: 'Toute personne peut contester une loi devant le Conseil constitutionnel.' },
      { t: 'Candidater', d: 'Les fonctions de ministre sont ouvertes à tous, après contrôle.' },
      { t: 'Voter', d: 'Toute révision de la Constitution passe par référendum.' },
      { t: 'Près de chez vous', d: 'Les collectivités sont dirigées par des conventions territoriales.' } ] },
    { titre: 'Les garde-fous', items: [
      'Des droits intangibles, qui ne reculent ni en crise ni par révision',
      'En crise, les mesures qui touchent aux libertés sont autorisées par une convention tirée au sort à l’avance, pour une durée limitée',
      'La France reste dans l’Union européenne ; les grands choix européens reviennent aux citoyens',
      'Le financement politique étranger est interdit ; les manipulations de l’information sont sanctionnées' ] },
    { titre: 'Combien ça coûte, qui siège', chiffres: [
      { n: '≈ 1,7 Md€', t: 'par an, contre ≈ 3,7 Md€ pour les institutions remplacées' },
      { n: '≈ 145 000', t: 'personnes tirées au sort chaque année, surtout au niveau local' },
      { n: '1 sur 365', t: 'chance d’être tiré au sort une année donnée' } ],
      note: 'Chiffrage poste par poste, à partir des lois de finances et des données publiques. Le modèle budgétaire est téléchargeable sur le site.' },
    { titre: 'Comment y parvenir', flux: [
      { t: 'Avant-projet', d: 'Publié, commenté article par article, relu par des experts.' },
      { t: 'Ouverture', d: 'Une loi ou un référendum, selon les règles de 1958, crée la convention constituante.' },
      { t: 'Délibération', d: '300 citoyens sur la Constitution, 150 sur la Déclaration des droits.' },
      { t: 'Référendum', d: 'Puis mise en place en un mois.' } ] },
    { type: 'fin', titre: 'Le texte est ouvert', sous: 'Lisez-le, commentez chaque article, proposez des modifications.' },
  ] },
  en: { titreDoc: 'REpublic — Presentation', slides: [
    { type: 'titre', surtitre: 'Draft Constitution', titre: 'The Deliberative Republic', sous: 'Laws written by citizens drawn by lot' },
    { titre: 'The diagnosis', lead: 'France’s Fifth Republic has delivered stability. It has also created a lasting imbalance.', items: [
      'Power concentrated around the President',
      'A weakened Parliament (Articles 16 and 49.3 of the 1958 Constitution)',
      'Elections that poorly reflect social diversity',
      'Participation reduced to a vote every five years' ] },
    { titre: 'Three transformations since 1958', cols: [
      { t: 'The digital revolution', d: 'Social media and artificial intelligence are upending how opinion is formed.' },
      { t: 'Ecological collapse', d: 'Electoral short-termism blocks long-term decisions.' },
      { t: 'Authoritarianism through the ballot box', d: 'A democracy must be able to protect itself against its own drift.' } ] },
    { titre: 'A precedent: France’s Citizens’ Convention for Climate', chiffres: [
      { n: '150', t: 'citizens drawn by lot' }, { n: '7', t: 'three-day sessions' }, { n: '149', t: 'proposals adopted' } ],
      note: 'Well-informed citizens deliberate seriously. But a purely consultative convention is not enough: its strongest proposals were abandoned.' },
    { titre: 'The idea', lead: 'Make sortition the normal way sovereignty is exercised.', items: [
      'Free, informed, pluralist and protected deliberation',
      'Real representation of social diversity',
      'Laws that respect fundamental rights and scientific consensus',
      'Executive power under continuous oversight, and revocable' ] },
    { titre: 'How a law is made', flux: [
      { t: 'Agenda', d: 'A convention sets the subjects for five years; petitions can add more.' },
      { t: 'Thematic convention', d: '150 citizens: training, hearings, counter-expertise, vote.' },
      { t: 'Review', d: 'The Constitutional Council and a scientific council may suspend, never rewrite.' },
      { t: 'Implementation', d: 'The administration carries it out; a citizens’ authority reviews it every year.' } ] },
    { titre: 'Who executes, who oversees', items: [
      'No president and no prime minister: a college of ministers, chaired in rotation',
      'Ministers chosen by a convention drawn by lot, from vetted candidates',
      'A citizens’ authority that oversees law implementation and can question any office-holder',
      'An integrity court that can remove office-holders',
      'Independent justice: no instructions, no political appointments' ] },
    { titre: 'What changes for you', grille: [
      { t: 'Make the law', d: 'Any adult may be drawn by lot, with income and job guaranteed.' },
      { t: 'Set the agenda', d: 'A petition signed by one per cent of the civic body requires a convention to be considered.' },
      { t: 'Challenge', d: 'Anyone may challenge a law before the Constitutional Council.' },
      { t: 'Apply', d: 'Ministerial posts are open to all, after vetting.' },
      { t: 'Vote', d: 'Every constitutional amendment goes to a referendum.' },
      { t: 'Locally too', d: 'Local authorities are run by territorial conventions.' } ] },
    { titre: 'The safeguards', items: [
      'Inviolable rights that cannot be rolled back, in a crisis or by amendment',
      'In a crisis, measures affecting freedoms are authorised by a convention drawn by lot in advance, for a limited time',
      'France stays in the European Union; major European choices return to citizens',
      'Foreign political funding is banned; information manipulation is penalised' ] },
    { titre: 'What it costs, who serves', chiffres: [
      { n: '≈ €1.7bn', t: 'a year, against ≈ €3.7bn for the institutions it replaces' },
      { n: '≈ 145,000', t: 'people drawn by lot each year, mostly at local level' },
      { n: '1 in 365', t: 'chance of being drawn by lot in any given year' } ],
      note: 'Costed item by item from budget laws and public data. The budget model can be downloaded from the website.' },
    { titre: 'How to get there', flux: [
      { t: 'Draft', d: 'Published, commented article by article, reviewed by experts.' },
      { t: 'Opening', d: 'A law or a referendum, under the 1958 rules, creates the constituent convention.' },
      { t: 'Deliberation', d: '300 citizens on the Constitution, 150 on the Declaration of Rights.' },
      { t: 'Referendum', d: 'Then in place within one month.' } ] },
    { type: 'fin', titre: 'The text is open', sous: 'Read it, comment on every article, propose amendments.' },
  ] },
};
