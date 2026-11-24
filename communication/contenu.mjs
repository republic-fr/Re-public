// Contenu des documents de présentation (fiche d'une page et présentation courte), en français et en anglais.
// Tout chiffre ou toute règle cité ici doit correspondre au texte de la Constitution et aux pages du site.

export const SITE = 'republic-fr.org';
export const REPO = 'github.com/republic-fr/Re-public';

export const fiche = {
  fr: {
    titreDoc: 'REpublic — Présentation en une page',
    surtitre: 'Avant-projet de Constitution · La République délibérative',
    titre: 'La loi écrite par des citoyens tirés au sort',
    chapeau: 'REpublic est un avant-projet complet de Constitution française. Il n’y a plus de président, de Parlement ni d’élection de représentants : des conventions de 150 citoyens tirés au sort, formés et indemnisés, votent les lois et le budget. Là où la Convention citoyenne pour le climat ne pouvait que proposer, elles décident ; l’administration exécute, sous contrôle permanent.',
    blocs: [
      { titre: 'Ce qui change', items: [
        'Chaque loi est confiée à une convention de 150 citoyens tirés au sort, à l’image du pays (sexe, âge, diplôme, catégorie sociale, territoire) : formation, auditions contradictoires, contre-expertise, vote, puis dissolution.',
        'Une convention fixe le programme pour cinq ans, une autre vote le budget chaque année. Une pétition d’environ 550 000 signatures oblige à examiner l’ouverture d’une convention.',
        'Un collège de ministres, présidé à tour de rôle, exécute la loi sans pouvoir propre. Les ministres sont choisis par une convention tirée au sort, parmi des candidats soumis à un contrôle de compétence et de probité, et sont révocables.',
        'Régions, départements, intercommunalités et communes sont administrés de la même façon, par des conventions territoriales.',
      ] },
      { titre: 'Pourquoi', items: [
        'La Ve République concentre le pouvoir autour du président et permet de contourner le Parlement (pouvoirs exceptionnels de l’article 16, adoption sans vote par le 49.3).',
        'Les mécanismes électoraux représentent mal la diversité sociale ; la participation se réduit à un vote tous les cinq ans.',
        'La Convention citoyenne pour le climat a montré que 150 citoyens tirés au sort délibèrent sérieusement. Restée consultative, elle a vu ses propositions les plus structurantes vidées, retardées ou abandonnées.',
      ] },
      { titre: 'Les garde-fous', items: [
        'Un Conseil constitutionnel de juristes tirés au sort et, en cas de contresens scientifique manifeste, un conseil scientifique peuvent suspendre une loi et la renvoyer à une convention, jamais la réécrire.',
        'Les droits fondamentaux intangibles ne reculent ni en crise ni par révision. En crise, une convention de secours tirée au sort à l’avance se réunit sous 72 heures.',
        'Toute personne peut contester une loi. Toute révision de la Constitution passe par référendum.',
        'Influences déclarées dans un registre public, financement politique étranger interdit, pressions sur un membre lourdement sanctionnées.',
      ] },
      { titre: 'L’objection principale', encadre: true, items: [
        '« Des citoyens ordinaires ne sont pas compétents, et seront manipulés. »',
        'La compétence s’organise : un seul sujet, plusieurs mois, des experts tirés au sort dans des viviers publics, un dossier contradictoire et une contre-expertise publique. C’est le principe du jury d’assises appliqué à la loi. Et un citoyen qui siège quelques mois, sans réélection à gagner, est une cible moins durable qu’un élu de carrière.',
      ] },
    ],
    chiffres: [
      { n: '150', t: 'citoyens tirés au sort pour chaque loi, puis la convention est dissoute' },
      { n: '≈ 1,7 Md€', t: 'par an (1,2 à 2,5), contre ≈ 3,7 Md€ pour la présidence, le Parlement, les élections et les élus locaux' },
      { n: '1 sur 365', t: 'chance d’être tiré au sort une année donnée, surtout au niveau local' },
    ],
    cheminTitre: 'Comment y parvenir',
    chemin: [
      'Aujourd’hui : un avant-projet ouvert aux commentaires',
      'Une loi constitutionnelle ou un référendum, selon les règles de 1958, ouvre le processus',
      '300 citoyens tirés au sort révisent le texte ; 150 autres écrivent la Déclaration des droits',
      'Référendum de ratification, une question par texte',
      'Nouvelles institutions en place en un mois',
    ],
    appel: 'Texte intégral, chiffrage poste par poste et réponses aux principales objections. Questions : republic‑fr.org/contact',
    pied: 'Projet citoyen indépendant, publié de façon anonyme pour que le débat porte sur le texte, non sur ses auteurs. Le texte et l’historique de chaque modification sont publics. Version v26, novembre 2026.',
  },
  en: {
    titreDoc: 'REpublic — One-page overview',
    surtitre: 'Draft Constitution · The Deliberative Republic',
    titre: 'Laws written by citizens chosen by lot',
    chapeau: 'REpublic is a complete draft constitution for France, which has lived under the 1958 Constitution of the Fifth Republic for nearly seventy years. It has no president, no parliament and no elected representatives: conventions of 150 citizens chosen by lot, trained and paid for their time, pass the laws and the budget. Where France’s Citizens’ Convention for Climate could only make recommendations, these conventions decide; the civil service implements, under permanent oversight.',
    blocs: [
      { titre: 'What changes', items: [
        'Each law is entrusted to a convention of 150 citizens chosen by lot to mirror the country (sex, age, education, social class, place): training, adversarial hearings, counter-expertise, a vote, then dissolution.',
        'One convention sets the agenda for five years; another votes the budget each year. A petition of about 550,000 signatures requires the opening of a convention to be considered.',
        'A college of ministers, chaired in rotation, carries out the law without powers of its own. Ministers are chosen by a convention drawn by lot, from candidates vetted for competence and integrity, and can be removed.',
        'Regions, departments, inter-municipal bodies and municipalities are run the same way, by territorial conventions.',
      ] },
      { titre: 'Why', items: [
        'The Fifth Republic concentrates power in the President and lets the executive bypass Parliament (emergency powers under Article 16; Article 49.3 lets a bill pass without a vote).',
        'Elections poorly reflect social diversity; participation is reduced to a vote every five years.',
        'France’s Citizens’ Convention for Climate showed that 150 citizens chosen by lot deliberate seriously. Because it was only advisory, its most far-reaching proposals were watered down, delayed or dropped.',
      ] },
      { titre: 'The safeguards', items: [
        'A Constitutional Council of lawyers chosen by lot and, in case of manifest scientific error, a scientific council may suspend a law and send it back to a convention, never rewrite it.',
        'Inviolable fundamental rights cannot be rolled back, in a crisis or by amendment. In a crisis, an emergency convention drawn by lot in advance meets within 72 hours.',
        'Anyone may challenge a law. Every constitutional amendment goes to a referendum.',
        'Lobbying logged in a public register, foreign political funding banned, pressure on a member severely punished.',
      ] },
      { titre: 'The main objection', encadre: true, items: [
        '“Ordinary citizens aren’t competent, and lobbies will capture them.”',
        'Competence is organised: one subject, several months, experts drawn by lot from public pools, an adversarial briefing file and public counter-expertise: the jury principle applied to law-making. And a citizen who serves a few months, with no re-election to win, is a poorer long-term target than a career politician.',
      ] },
    ],
    chiffres: [
      { n: '150', t: 'citizens chosen by lot for each law; the convention is then dissolved' },
      { n: '≈ €1.7bn', t: 'a year (€1.2–2.5bn), against ≈ €3.7bn for the presidency, Parliament, elections and local councillors' },
      { n: '1 in 365', t: 'chance of being chosen in any given year, mostly at local level' },
    ],
    cheminTitre: 'How to get there',
    chemin: [
      'Today: a draft open to comments',
      'A constitutional law or a referendum, under the 1958 rules, opens the process',
      '300 citizens chosen by lot revise the text; 150 others write the Declaration of Rights',
      'Ratification referendum, one question per text',
      'New institutions in place within one month',
    ],
    appel: 'Full text, item-by-item costing and answers to the main objections to sortition. Questions: republic‑fr.org/en/contact',
    pied: 'An independent citizens’ project, published anonymously so that the debate is about the text, not its authors. The text and the history of every change are public. Version v26, November 2026.',
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
      note: 'Des citoyens bien informés délibèrent sérieusement. Mais une convention seulement consultative ne suffit pas : ses propositions les plus structurantes ont été vidées, retardées ou abandonnées.' },
    { titre: 'L’idée', lead: 'Faire du tirage au sort le mode normal d’exercice de la souveraineté.', items: [
      'Une délibération libre, informée, pluraliste et protégée',
      'Une représentation réelle de la diversité sociale',
      'Une loi qui respecte les droits fondamentaux et les consensus scientifiques',
      'Un pouvoir d’exécution contrôlé en continu et révocable' ] },
    { titre: 'Comment une loi est faite', flux: [
      { t: 'Programme', d: 'Une convention fixe les sujets pour cinq ans ; les pétitions peuvent en ajouter.' },
      { t: 'Convention thématique', d: '150 citoyens, formation, auditions, contre-expertise, vote.' },
      { t: 'Contrôles', d: 'Le Conseil constitutionnel et, en cas de contresens scientifique manifeste, un conseil scientifique peuvent suspendre, jamais réécrire.' },
      { t: 'Application', d: 'L’administration exécute ; une autorité citoyenne contrôle chaque année.' } ] },
    { titre: 'Qui exécute, qui contrôle', items: [
      'Ni président, ni Premier ministre, ni Parlement élu : un collège de ministres, présidé à tour de rôle',
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
      { t: 'Avant-projet', d: 'Publié, commenté article par article, ouvert à la relecture d’experts.' },
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
      note: 'Well-informed citizens deliberate seriously. But a purely consultative convention is not enough: its most far-reaching proposals were watered down, delayed or dropped.' },
    { titre: 'The idea', lead: 'Make sortition the normal way sovereignty is exercised.', items: [
      'Free, informed, pluralist and protected deliberation',
      'Real representation of social diversity',
      'Laws that respect fundamental rights and scientific consensus',
      'Executive power under continuous oversight, and revocable' ] },
    { titre: 'How a law is made', flux: [
      { t: 'Agenda', d: 'A convention sets the subjects for five years; petitions can add more.' },
      { t: 'Thematic convention', d: '150 citizens: training, hearings, counter-expertise, vote.' },
      { t: 'Review', d: 'The Constitutional Council and, in case of manifest scientific error, a scientific council may suspend, never rewrite.' },
      { t: 'Implementation', d: 'The administration carries it out; a citizens’ authority reviews it every year.' } ] },
    { titre: 'Who executes, who oversees', items: [
      'No president, no prime minister, no elected parliament: a college of ministers, chaired in rotation',
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
      { t: 'Draft', d: 'Published, commented on article by article, open to expert review.' },
      { t: 'Opening', d: 'A law or a referendum, under the 1958 rules, creates the constituent convention.' },
      { t: 'Deliberation', d: '300 citizens on the Constitution, 150 on the Declaration of Rights.' },
      { t: 'Referendum', d: 'Then in place within one month.' } ] },
    { type: 'fin', titre: 'The text is open', sous: 'Read it, comment on every article, propose amendments.' },
  ] },
};
