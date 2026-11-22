---
title: How the system works
tag: How it works
subtag: The system in diagrams
description: How the Deliberative Republic works in seven interactive diagrams: the five-year cycle, law-making, the ministries, justice, Europe, crises and the territories.
---

<p class="lead">Seven diagrams to understand who decides, who implements and who oversees. Hover over or tap each element to read its role and the articles on which it is based.</p>

<ol class="dg-index">
<li><a href="#cycle">Setting up and the five-year cycle</a></li>
<li><a href="#loi">How laws are made</a></li>
<li><a href="#ministeres">The ministries</a></li>
<li><a href="#justice">Justice</a></li>
<li><a href="#europe">Europe</a></li>
<li><a href="#crises">Crises</a></li>
<li><a href="#territoires">The territories</a></li>
</ol>

<h2 id="cycle"><span class="kicker">01</span>Setting up, then the five-year cycle</h2>

Two conventions found the system, once only: the constituent convention, which writes the Constitution, and the fundamental rights convention, which writes the Declaration of Rights. The people ratify them by referendum. After that, public life follows a five-year cycle: one convention sets the course, conventions draw up the laws, the administration implements them and a citizens’ authority oversees the whole every year.

```schema
id: cycle
colonnes: 3
intro: Setting up happens only once; the constituent convention meets again only to amend the Constitution. The cycle, on the other hand, repeats every five years. The citizens drawn by lot change with each convention; it is the institutions that ensure continuity.
noeuds:
  - id: constituante
    ligne: 1
    colonne: 1
    type: citoyens
    nom: Constituent convention
    detail: Once, then at each amendment
    info: >-
      300 citizens drawn by lot deliberate on the Constitution article by article, for three to six months. It meets again
      only to amend the Constitution (Articles [163](#revision-initiative) and [165](#constituante-composition-mandat)).
  - id: droits
    ligne: 1
    colonne: 3
    type: citoyens
    nom: Fundamental rights convention
    detail: Writes the Declaration of Rights
    info: >-
      Citizens drawn by lot draft the Declaration of Fundamental Rights annexed to the Constitution, starting from the Declaration of 1789,
      the Preamble of 1946 and the Charter for the Environment, without being able to reduce rights already recognised (Article [8](#declaration-droits-fondamentaux)).
  - id: referendum
    ligne: 2
    colonne: 2
    type: electeurs
    nom: Referendum
    detail: Ratifies
    info: >-
      The text is adopted if a majority of those voting approve it and if the ‘yes’ votes represent at least one third of the civic body
      (Article [168](#referendum-revision-majorite)).
  - id: petitions
    ligne: 3
    colonne: 1
    type: electeurs
    nom: Petitions
    detail: Open to all, at any time
    info: >-
      All petitions that reach the legal threshold are recorded by the Civic Agenda Authority and passed on to the next agenda-setting
      convention. At one per cent of the civic body, or about 550,000 signatures, the Authority must in addition consider, without delay, opening a dedicated thematic convention
      (Article [33](#seuils-effets-petitions)).
  - id: apc
    ligne: 3
    colonne: 2
    type: citoyens
    nom: Civic Agenda Authority
    detail: 50 citizens, half renewed every six months
    info: >-
      It records petitions and requests from the authorities, passes them on to the agenda-setting convention, then opens the thematic conventions
      set out in the programme. It may also open conventions outside the programme in limited cases: a petition, a request from an oversight authority, a European act,
      a legal deadline (Articles [31](#apc-missions) to [33](#seuils-effets-petitions)).
  - id: agcc
    ligne: 3
    colonne: 3
    type: autorite
    nom: General Authority for Citizens’ Conventions
    detail: Organises all conventions
    info: >-
      It organises sortition and checks representativeness, convenes and protects convention members, and keeps the pools of experts and the public register
      of influence. It never intervenes in the content of deliberations (Articles [27](#agcc-missions) and [28](#agcc-interdictions)).
  - id: programmation
    ligne: 4
    colonne: 2
    type: citoyens
    nom: Agenda-setting convention
    detail: Every five years
    info: >-
      150 citizens choose the thematic conventions to be held over five years and set the main budgetary and tax priorities.
      They examine all the requests received and publicly give reasons for their choices. They do not write the laws (Article [19](#convention-programmation)).
  - id: thematiques
    ligne: 5
    colonne: 1
    type: citoyens
    nom: Thematic conventions
    detail: One subject each, one or more laws
    info: >-
      Each deals with a subject set when it opens and may adopt a series of laws on that subject, after training, hearings and counter-expertise.
      It is dissolved at the end and leaves three rapporteurs who keep its memory (Articles [20](#thematique-formation-objet) to [22](#adoption-loi)).
  - id: annuelle
    ligne: 5
    colonne: 3
    type: citoyens
    nom: Annual ordinary convention
    detail: One session a year, at budget time
    info: >-
      It adopts the budget and the tax laws, ratifies major treaties, re-examines suspended laws and examines contested decrees
      (Article [24](#convention-ordinaire-objet)).
  - id: administration
    ligne: 6
    colonne: 2
    type: administration
    nom: Executive administration
    detail: Ministers and departments
    info: >-
      It implements the laws and the budget, with no political power of its own. There is neither a president nor a prime minister
      (Article [50](#nature-administration-execution)).
  - id: controle
    ligne: 7
    colonne: 2
    type: autorite
    nom: Law Implementation Oversight Authority
    detail: Citizens’ plenary session every year
    info: >-
      A technical service investigates all year round; a session of 150 citizens examines its report every year. It may question any office-holder,
      refer matters to the Court of Public Integrity and ask the Civic Agenda Authority to open corrective conventions
      (Articles [63](#acel-nature) to [65](#session-pleniere-competences)).
liens:
  - constituante -> referendum | Constitution
  - droits -> referendum | Declaration
  - referendum -> apc | in force
  - petitions -> apc | petitions
  - apc -> programmation | passes on requests
  - agcc --> programmation | sortition
  - apc -> thematiques | opens
  - programmation -> thematiques | chooses
  - programmation -> annuelle | budget priorities
  - thematiques -> administration | laws
  - annuelle -> administration | budget
  - administration -> controle | overseen
  - controle -> apc | | droite
```

<h2 id="loi"><span class="kicker">02</span>How laws are made</h2>

A law is written by a convention of citizens drawn by lot, then checked by two independent reviews before it comes into force. If a review suspends it, it is again citizens who have the last word, except on absolute rights.

```schema
id: loi
colonnes: 3
intro: From the request to entry into force, every stage is public. Judges and scientists may suspend a law, never rewrite it.
noeuds:
  - id: petition
    ligne: 1
    colonne: 1
    type: electeurs
    nom: Petition
    detail: 1% of the civic body
    info: >-
      At one per cent of the civic body (about 550,000 signatures), the Civic Agenda Authority must consider opening a convention, by a reasoned decision that may be challenged
      (Article [33](#seuils-effets-petitions)).
  - id: programme
    ligne: 1
    colonne: 2
    type: citoyens
    nom: Agenda-setting convention
    detail: Chooses the conventions to be held
    info: >-
      Every five years, it decides which thematic conventions will be opened and sets the main budgetary priorities. It does not write
      the laws: the thematic conventions draw them up (Article [19](#convention-programmation)).
  - id: demandes
    ligne: 1
    colonne: 3
    type: autorite
    nom: Other requests
    detail: Oversight Authority, European act, deadline…
    info: >-
      The Civic Agenda Authority may also open a convention outside the programme in a closed list of cases, within an annual ceiling
      (Article [32](#apc-interdictions)).
  - id: apc
    ligne: 2
    colonne: 2
    type: citoyens
    nom: Civic Agenda Authority
    detail: Opens the convention and sets its length
    info: It opens the thematic convention and sets its length according to the complexity of the subject (Article [21](#thematique-cycle-deliberatif)).
  - id: jury
    ligne: 3
    colonne: 1
    type: autorite
    nom: Expert panel
    detail: Drawn by lot, prepares the file
    info: >-
      Experts drawn by lot from a pluralist pool prepare a briefing file presenting opposing views and propose hearings. They have no power to steer
      (Article [133](#jury-experts-independants)).
  - id: convention
    ligne: 3
    colonne: 2
    type: citoyens
    nom: Thematic convention
    detail: 150 citizens, a few months
    info: >-
      Training, public hearings, protected deliberation, drafting assistance: the convention writes the law and adopts it by an absolute majority of its members
      (Articles [17](#majorite-qualifiee), [21](#thematique-cycle-deliberatif) and [22](#adoption-loi)).
  - id: contre
    ligne: 3
    colonne: 3
    type: electeurs
    nom: Public counter-expertise
    detail: Anyone may propose hearings
    info: >-
      The file is published. Citizens and organisations may propose other experts; all the main groups of stakeholders must be heard
      (Articles [134](#contre-expertise-publique) and [135](#pluralite-minimale-auditions)).
  - id: adopte
    ligne: 4
    colonne: 2
    type: etape
    nom: Text adopted
    detail: Reviewed before coming into force
  - id: scientifique
    ligne: 5
    colonne: 1
    type: autorite
    nom: Scientific review
    detail: Manifest scientific error only
    info: >-
      A council of scientists drawn by lot may suspend a text only in the event of a manifest scientific error, on which there is consensus, that threatens health,
      the integrity of persons or the environment. It never judges political expediency (Articles [48](#controle-scientifique-champ) and [49](#controle-scientifique-suspension)).
  - id: constitutionnel
    ligne: 5
    colonne: 3
    type: autorite
    nom: Constitutional Council
    detail: Automatic review, within one month
    info: >-
      Every law is referred to it before coming into force. It checks compliance with the Constitution, rights and procedures, and may suspend the text. The two reviews take place in parallel, within one month each, which may be extended to three months at most
      (Articles [39](#controle-prealable-automatique-lois) and [42](#cc-etendue-controle)).
  - id: suspension
    ligne: 6
    colonne: 1
    type: etape
    nom: Suspension
    detail: Each objection is classed as ‘procedural’ or ‘substantive’
    info: The decision specifies the objections and the articles concerned (Article [23](#reexamen-cas-suspension)).
  - id: vigueur
    ligne: 6
    colonne: 3
    type: etape
    nom: Entry into force
    detail: The administration implements it
    info: >-
      The law applies from the date it sets. Once in force, it may still be challenged by any person with an interest in doing so
      (Articles [22](#adoption-loi) and [40](#cc-saisine-posteriori)).
  - id: rapporteurs
    ligne: 7
    colonne: 1
    type: citoyens
    nom: Rapporteurs
    detail: Procedural objection
    info: >-
      The convention’s three rapporteurs may, within one month, withdraw or correct the provisions concerned, without adding anything. The corrected text
      goes back before the Constitutional Council (Article [23](#reexamen-cas-suspension)).
  - id: reexamen
    ligne: 7
    colonne: 2
    type: citoyens
    nom: Annual ordinary convention
    detail: Substantive objection
    info: >-
      It re-examines the text in plenary session, after hearing both sides. It may amend it, abandon it or confirm it by a two-thirds majority.
      Confirmation is impossible for absolute rights, procedure and the organisation of the institutions. Where there is a legal deadline, the emergency convention decides
      (Article [23](#reexamen-cas-suspension)).
liens:
  - petition -> apc | petition
  - programme -> apc | programme
  - demandes -> apc | reasoned request
  - apc -> convention | opens
  - jury --> convention | file
  - contre --> convention | hearings
  - convention -> adopte | absolute majority vote
  - adopte -> scientifique
  - adopte -> constitutionnel
  - scientifique -> suspension | suspends
  - constitutionnel -> suspension | suspends
  - constitutionnel -> vigueur | compliant
  - suspension -> rapporteurs | procedure
  - suspension -> reexamen | substance
  - reexamen -> vigueur | confirmation | droite
```

<h2 id="ministeres"><span class="kicker">03</span>The ministries</h2>

Ministers are not elected and do not govern: they implement the law. Citizens drawn by lot choose them from among vetted candidates, and independent authorities may sanction or dismiss them.

```schema
id: ministeres
colonnes: 3
intro: A collegial administration, with no head, strictly subject to the law and continuously overseen.
noeuds:
  - id: appel
    ligne: 1
    colonne: 2
    type: autorite
    nom: Call for candidates
    detail: Public, open to all
    info: >-
      The General Authority for Citizens’ Conventions organises a public call, open to every citizen
      (Article [54](#procedure-designation-ministres)).
  - id: jury
    ligne: 2
    colonne: 1
    type: autorite
    nom: Technical panel
    detail: Checks skills
    info: >-
      Experts in administration drawn by lot check experience and management ability, never political opinions
      (Article [55](#jury-technique-ministres)).
  - id: probite
    ligne: 2
    colonne: 3
    type: autorite
    nom: Court of Public Integrity
    detail: Prior integrity check
    info: >-
      It checks the candidates’ assets, interests and criminal records, and draws up the list of eligible candidates
      (Articles [54](#procedure-designation-ministres) and [80](#controle-prealable-probite)).
  - id: designation
    ligne: 3
    colonne: 2
    type: citoyens
    nom: Appointments convention
    detail: 50 citizens, half renewed every year
    info: >-
      It holds public hearings of the eligible candidates and appoints the ministers by an absolute majority of its members; after three rounds without a majority, the appointment is resumed after a partial renewal of the convention, and an interim arrangement ensures continuity. It also appoints the external relations
      representatives. If the Oversight Authority finds that a minister is not implementing the laws, it may warn them, then, six months later and by a two-thirds majority, end their term of office (Articles [53](#convention-designation-ministres), [54](#procedure-designation-ministres) and [56](#duree-mandat-ministeriel)).
  - id: ministres
    ligne: 4
    colonne: 2
    type: administration
    nom: Ministers
    detail: Collegial, three-year term
    info: >-
      Each minister heads a field. Disagreements are settled collectively. The college is chaired in rotation, for one year, by one of the ministers, who leads the deliberations, coordinates in a crisis and represents France on the European Council, with no power of their own (Article [52](#structure-collegiale)). The term lasts three years, renewable once
      (Articles [52](#structure-collegiale) and [56](#duree-mandat-ministeriel)).
  - id: decrets
    ligne: 5
    colonne: 1
    type: administration
    nom: Implementing decrees
    detail: Strictly subject to the law
    info: >-
      The law sets the principles; the ministers issue the decrees that implement it, without being able to change its meaning
      (Article [51](#subordination-loi)).
  - id: controle
    ligne: 5
    colonne: 3
    type: autorite
    nom: Oversight Authority
    detail: Investigates and questions continuously
    info: >-
      Its technical service investigates the implementation of laws and may go to court to have a law implemented or an unlawful act annulled
      (Article [68](#service-technique-pouvoirs)).
  - id: evocation
    ligne: 6
    colonne: 1
    type: electeurs
    nom: Call-in
    detail: Within two months
    info: >-
      A contested decree may be put before citizens: by the Civic Agenda Authority, on its own initiative or at the request of the rapporteurs
      or of the Oversight Authority, or automatically on petition (Article [51](#subordination-loi)).
  - id: sanction
    ligne: 6
    colonne: 3
    type: autorite
    nom: Court of Public Integrity
    detail: Judges serious misconduct
    info: >-
      Failure to implement a law, abuse of power, corruption: it may issue a warning, dismiss and declare ineligible
      (Articles [81](#jugement-fautes-graves) and [85](#juridiction-probite-sanctions)).
  - id: convention
    ligne: 7
    colonne: 1
    type: citoyens
    nom: Citizens’ convention
    detail: Approves, amends or annuls
    info: >-
      The next annual convention, or the thematic convention for the field if it is sitting, decides. The decree applies in the meantime
      (Article [51](#subordination-loi)).
liens:
  - appel -> jury | applications
  - appel -> probite | in parallel
  - jury -> designation | skills
  - probite -> designation | eligible
  - designation -> ministres | appoints
  - ministres -> decrets | issue
  - ministres -> controle | overseen
  - decrets -> evocation | challenge
  - evocation -> convention | examination
  - controle -> sanction | serious misconduct
  - sanction -> ministres | dismisses | gauche
```

<h2 id="justice"><span class="kicker">04</span>Justice</h2>

Judges are independent: no authority may give them instructions. Disputes with the administration have their own judge, at last independent of the government. The public prosecution service no longer depends on a minister, and appointments and discipline are the responsibility of a High Council of the Judiciary none of whose members is chosen by a politician.

```schema
id: justice
colonnes: 3
intro: Three routes for every person, a body that guarantees the independence of judges, and checks on the judges themselves.
noeuds:
  - id: personne
    ligne: 1
    colonne: 2
    type: electeurs
    nom: Any person
    detail: Litigant, service user, citizen
    info: >-
      Everyone has the right to an independent judge, a fair trial, a defence and an effective remedy
      (Article [87](#garanties-essentielles)).
  - id: defenseur
    ligne: 2
    colonne: 1
    type: autorite
    nom: Defender of Rights
    detail: In dealings with the administrations
    info: >-
      It handles complaints against public services and discrimination, and may investigate, mediate and refer matters to the courts
      (Articles [71](#defenseur-droits-nature-mission) to [74](#defenseur-droits-pouvoirs)).
  - id: tribunaux
    ligne: 2
    colonne: 2
    type: autorite
    nom: Courts and tribunals
    detail: Civil and criminal justice
    info: >-
      No authority may intervene in a pending case. Members of the judiciary may not be removed from office and must report any pressure
      (Articles [86](#independance-justice) and [88](#statut-magistrats)).
  - id: constitutionnel
    ligne: 3
    colonne: 3
    type: autorite
    nom: Constitutional Council
    detail: Compliance with the Constitution
    info: >-
      Any person, association or company with an interest in doing so may challenge a law in force; in the course of a trial, any party may also ask the court to refer the question to it.
      For acts of the administration, the matter is referred to it by the administrative courts when a question of constitutionality is serious. Its members are drawn by lot from among lawyers
      (Articles [36](#cc-composition), [40](#cc-saisine-posteriori) and [41](#controle-actes-execution)).
  - id: administratif
    ligne: 2
    colonne: 3
    type: autorite
    nom: Administrative courts
    detail: Administrative tribunals, Council of State
    info: >-
      They rule on disputes with the administration and on the lawfulness of decrees. Their judges are independent, appointed and disciplined by the High
      Council of the Judiciary; the Council of State no longer advises the government (Articles [41](#controle-actes-execution) and [86](#independance-justice)).
  - id: parquet
    ligne: 3
    colonne: 1
    type: autorite
    nom: Public prosecution service
    detail: Independent of any minister
    info: >-
      No instruction may be given to prosecutors. Criminal justice policy is set by law, voted in convention
      (Article [89](#independance-parquet)).
  - id: csm
    ligne: 4
    colonne: 2
    type: autorite
    nom: High Council of the Judiciary
    detail: Three sections (judges, prosecutors, administrative courts)
    info: >-
      No member of the judiciary may be appointed without its agreement. It rules on the discipline of members of the judiciary, in a section in which they are in the minority, and any litigant may refer a matter to it
      (Articles [94](#csm-nominations) and [95](#csm-discipline)).
  - id: pairs
    ligne: 5
    colonne: 1
    type: etape
    nom: Elected by their peers
    detail: 8 out of 12, in the minority on discipline
    info: The judicial members are elected by members of the judiciary (Articles [91](#csm-composition) and [92](#csm-designation-membres)).
  - id: tirage
    ligne: 5
    colonne: 3
    type: etape
    nom: Drawn by lot
    detail: Lawyer, academics, public figure
    info: The other members are drawn by lot from open pools (Article [92](#csm-designation-membres)).
  - id: probite
    ligne: 6
    colonne: 1
    type: autorite
    nom: Court of Public Integrity
    detail: Serious misconduct, including by members of the judiciary
    info: >-
      It judges serious misconduct by members of the judiciary, such as corruption or abuse of power. Ordinary discipline remains with the High Council
      (Article [97](#repartition-probite-judiciaire)).
  - id: controle
    ligne: 6
    colonne: 3
    type: citoyens
    nom: Oversight plenary session
    detail: 150 citizens, every year
    info: >-
      It examines the High Council’s annual report, may question it and deals with collective complaints about how the justice system works
      (Article [98](#csm-controle-annuel)).
liens:
  - personne -> defenseur | complaint
  - personne -> tribunaux | goes to court
  - personne -> administratif | dispute with the administration
  - administratif -> constitutionnel | serious question
  - tribunaux -> constitutionnel
  - personne -> constitutionnel | | droite
  - parquet -> tribunaux | prosecutes
  - csm -> tribunaux | appoints, disciplines
  - csm -> parquet | appoints, disciplines
  - pairs -> csm | elect
  - tirage -> csm | complete
  - probite --> csm | mutual referral
  - controle -> csm | oversees
```

<h2 id="europe"><span class="kicker">05</span>Europe</h2>

France remains in the European Union. What changes: the major European choices return to citizens, and the greater a transfer of powers, the more demanding the procedure.

```schema
id: europe
colonnes: 3
intro: The Constitutional Council directs each treaty or transfer of powers to the right procedure. In case of doubt, it chooses the most demanding one.
noeuds:
  - id: ue
    ligne: 1
    colonne: 2
    type: etape
    nom: European Union
    detail: Draft acts, treaties
    info: >-
      Union law takes precedence over statute law, except where it infringes the constitutional identity of the Republic: inviolable rights, sovereignty of the conventions,
      independence of justice (Articles [152](#participation-union-europeenne) and [154](#identite-constitutionnelle-republique)).
  - id: controle
    ligne: 2
    colonne: 1
    type: autorite
    nom: Oversight Authority
    detail: Publishes and monitors drafts
    info: >-
      It receives and publishes all draft European acts, reviews subsidiarity, may bring a case before the Court of Justice of the Union and flag
      important drafts (Article [157](#transmission-actes-europeens)).
  - id: representants
    ligne: 2
    colonne: 3
    type: administration
    nom: External representatives
    detail: Negotiate under a written mandate
    info: >-
      They negotiate on behalf of France on the basis of a written and public mandate from the ministers, and report on every meeting
      (Articles [58](#representants-relations-exterieures), [59](#representants-transparence-abstention) and [146](#traites-negociation-conclusion)).
  - id: apc
    ligne: 3
    colonne: 1
    type: citoyens
    nom: Civic Agenda Authority
    detail: May open a convention
    info: For an important European draft, it may open a thematic convention outside the programme (Article [32](#apc-interdictions)).
  - id: ministres
    ligne: 1
    colonne: 3
    type: administration
    nom: Ministers
    detail: Give the mandate, approve
    info: The competent minister approves the negotiated version before ratification. The minister who chairs the college sits on the European Council, under a written mandate from the college (Articles [52](#structure-collegiale) and [146](#traites-negociation-conclusion)).
  - id: constitutionnel
    ligne: 4
    colonne: 2
    type: autorite
    nom: Constitutional Council
    detail: Checks and chooses the procedure
    info: >-
      With the matter referred to it automatically, it checks compliance with the Constitution and classifies the transfer: minor, intermediate or major
      (Article [155](#transferts-repartition-portee)).
  - id: annuelle
    ligne: 5
    colonne: 1
    type: citoyens
    nom: Annual ordinary convention
    detail: Minor transfers
    info: Technical adjustments and existing cooperation (Article [155](#transferts-repartition-portee)).
  - id: thematique
    ligne: 5
    colonne: 2
    type: citoyens
    nom: Thematic convention
    detail: Intermediate transfers
    info: >-
      Significant simplified revisions, enhanced cooperation, financial mechanisms. A referendum is possible
      (Articles [155](#transferts-repartition-portee) and [156](#referendum-transferts-intermediaires)).
  - id: constituante
    ligne: 5
    colonne: 3
    type: citoyens
    nom: Constituent convention
    detail: Major transfers
    info: New treaties and substantial transfers, followed by a mandatory referendum. The same applies to leaving the Union (Articles [155](#transferts-repartition-portee) and [160](#sortie-union-europeenne)).
  - id: referendum
    ligne: 6
    colonne: 2
    type: electeurs
    nom: Referendum
    detail: Mandatory or on request
    info: >-
      Mandatory for major transfers. For an intermediate transfer, it may be decided by the convention by a two-thirds majority or requested
      by two per cent of the civic body, about 1.1 million signatures (Article [156](#referendum-transferts-intermediaires)).
liens:
  - ue -> controle | draft acts
  - ue -> representants | negotiations
  - controle -> apc | important drafts
  - ministres -> representants | mandate
  - representants -> constitutionnel | negotiated text
  - constitutionnel -> annuelle | minor
  - constitutionnel -> thematique | intermediate
  - constitutionnel -> constituante | major
  - thematique --> referendum | possible
  - constituante -> referendum | mandatory
```

<h2 id="crises"><span class="kicker">06</span>Crises</h2>

In a crisis, the administration provides protection immediately, under the supervision of a judge. Measures that affect freedoms may be authorised only by a convention of citizens drawn by lot in advance, and for a limited period.

```schema
id: crises
colonnes: 3
intro: Act quickly without seizing power. No crisis allows absolute rights to be infringed or power to be given to the army.
noeuds:
  - id: crise
    ligne: 1
    colonne: 2
    type: etape
    nom: Crisis
    detail: Serious and immediate threat
    info: Pandemic, disaster, attack, cyberattack, threat to the institutions (Article [112](#notion-crise)).
  - id: conservatoires
    ligne: 2
    colonne: 1
    type: administration
    nom: Protective measures
    detail: The administration acts without delay
    info: >-
      Emergency relief, evacuation, protection of infrastructure, continuity of services, and for 72 hours at most the closure of borders or restrictions on movement by the police: necessary, proportionate and reversible measures, coordinated by the minister who chairs the college
      (Articles [52](#structure-collegiale), [115](#conservatoires-cadre-autorise) and [117](#conservatoires-validite)).
  - id: interdits
    ligne: 2
    colonne: 3
    type: etape
    nom: Absolute prohibitions
    detail: Even in a crisis
    info: >-
      Prohibited: transferring power to the administration or the army, suspending judicial safeguards, infringing inviolable rights
      (Articles [113](#crise-interdictions-absolues) and [114](#exclusion-regime-militaire-exception)).
  - id: juge
    ligne: 3
    colonne: 1
    type: autorite
    nom: Emergency judge
    detail: Referred within 6 h, decides within 12 h
    info: >-
      Each measure is approved by a judge sitting day and night. If the judge refuses, the measure lapses
      (Article [118](#crise-controle-juridictionnel)).
  - id: secours
    ligne: 3
    colonne: 2
    type: citoyens
    nom: Emergency convention
    detail: 150 citizens on standby, sits within 72 h
    info: >-
      Its members are drawn by lot and trained in advance. It takes up the matter as soon as a measure is approved; failing that, it is automatically convened
      within 24 hours. It may sit remotely or at a fallback seat (Articles [119](#secours-composition-veille) and [120](#secours-saisine)).
  - id: recours
    ligne: 4
    colonne: 1
    type: electeurs
    nom: Citizen appeal
    detail: At any time
    info: Any person affected by a measure may ask the judge to lift or limit it (Article [118](#crise-controle-juridictionnel)).
  - id: exceptionnelles
    ligne: 4
    colonne: 2
    type: etape
    nom: Exceptional measures
    detail: Authorised by a two-thirds majority
    info: >-
      Restrictions on freedoms, deployment of the army on national territory, exceptional tax measures: they require the authorisation of the emergency convention. No armed or police force, apart from their ordinary guard, may enter the institutions or approach them without their consent or that of the convention
      (Articles [116](#conservatoires-cadre-interdit) and [121](#secours-competences)).
  - id: controles
    ligne: 4
    colonne: 3
    type: autorite
    nom: Oversight maintained
    detail: Judges and authorities remain competent
    info: >-
      The Constitutional Council, the Oversight Authority, the Court of Public Integrity and the courts continue to operate during the crisis
      (Article [122](#secours-controles-maintenus)).
  - id: duree
    ligne: 5
    colonne: 2
    type: etape
    nom: Vote every 30 days
    detail: Six months at most
    info: >-
      Without a new vote, the measures lapse. Beyond six months, they pass to a thematic convention, except in the event of armed conflict or major disaster:
      extension for three months by a three-quarters majority (Article [123](#secours-duree-reexamen)).
  - id: fin
    ligne: 6
    colonne: 2
    type: etape
    nom: End of the crisis
    detail: Declared by the convention or the Constitutional Council
    info: The convention stands itself down, or the Constitutional Council finds that the crisis is over (Article [123](#secours-duree-reexamen)).
liens:
  - crise -> conservatoires | acts
  - crise -> secours | referred within 24 h
  - conservatoires -> juge | approval
  - conservatoires -> secours | informs
  - recours -> juge | requests lifting
  - secours -> exceptionnelles | authorises
  - controles -> exceptionnelles | oversee
  - exceptionnelles -> duree
  - duree -> fin
```

<h2 id="territoires"><span class="kicker">07</span>The territories</h2>

The same principle applies locally: the decisions of local authorities are taken by conventions of citizens drawn by lot, who choose and oversee the team responsible for implementing them.

```schema
id: territoires
colonnes: 3
intro: No more local elections or autonomous political executive. Municipalities keep their administration and their local services.
noeuds:
  - id: habitants
    ligne: 1
    colonne: 2
    type: electeurs
    nom: Residents
    detail: Drawn by lot within the territory
    info: Territorial conventions follow the same rules as national conventions (Article [124](#principe-conventionnel-territorial)).
  - id: convention
    ligne: 2
    colonne: 2
    type: citoyens
    nom: Territorial citizens’ convention
    detail: Deliberates on and votes local rules
    info: >-
      Within its fields of competence, it has its own rule-making power and may set local tax rates within the limits set by law
      (Articles [111](#architecture-fiscale-territoriale) and [127](#territoires-repartition-competences)).
  - id: mutualisation
    ligne: 2
    colonne: 3
    type: etape
    nom: Small municipalities
    detail: Inter-municipal convention
    info: >-
      When a municipality is too small for a representative draw, the convention is shared by several municipalities
      (Article [126](#existence-juridique-communes)).
  - id: executif
    ligne: 3
    colonne: 1
    type: administration
    nom: Local implementation team
    detail: Chosen on the basis of a project, may be dismissed
    info: >-
      The convention appoints it from among qualified candidates, on the basis of a publicly presented project, oversees its action and its budgets, and may dismiss it
      (Article [125](#designation-controle-executif-local)).
  - id: communes
    ligne: 3
    colonne: 3
    type: administration
    nom: Municipalities
    detail: Civil registration, everyday services
    info: >-
      Municipalities retain their existence, their local powers and their administration, under the oversight of the convention
      (Article [126](#existence-juridique-communes)).
  - id: loi
    ligne: 4
    colonne: 2
    type: citoyens
    nom: National laws
    detail: Powers and equalisation
    info: >-
      The organic law allocates powers according to local autonomy and subsidiarity; the law organises financial solidarity between territories.
      The Constitutional Council ensures that this allocation is respected (Articles [111](#architecture-fiscale-territoriale), [127](#territoires-repartition-competences) and [42](#cc-etendue-controle)).
  - id: outremer
    ligne: 5
    colonne: 2
    type: etape
    nom: Overseas territories
    detail: Special statuses
    info: >-
      No change of status or territory without the consent of the populations, obtained through a territorial convention
      (Article [128](#collectivites-outre-mer)).
liens:
  - habitants -> convention | sortition
  - mutualisation -> convention | grouping
  - convention -> executif | appoints, oversees
  - convention -> communes | oversees
  - loi -> convention | sets the framework
```
