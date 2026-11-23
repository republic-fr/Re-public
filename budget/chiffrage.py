# Modèle budgétaire de la République délibérative (avant-projet v26).
# Génère site/assets/budget-republique-deliberative.xlsx. Recalculer ensuite les formules
# (LibreOffice, ou ouverture dans un tableur) pour que les valeurs s’affichent.
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

import os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'site', 'assets', 'budget-republique-deliberative.xlsx')
F = 'Arial'
NAVY = 'FF1F4E78'; GREY = 'FF595959'
TITLE = Font(name=F, size=14, bold=True, color=NAVY)
H2 = Font(name=F, size=11, bold=True, color=NAVY)
HEAD = Font(name=F, size=10, bold=True, color='FFFFFFFF')
NOTE = Font(name=F, size=9, italic=True, color=GREY)
BODY = Font(name=F, size=10)
BOLD = Font(name=F, size=10, bold=True)
INPUT = Font(name=F, size=10, color='FF0000FF')
LINK = Font(name=F, size=10, color='FF008000')
FILL_H = PatternFill('solid', fgColor=NAVY)
FILL_S = PatternFill('solid', fgColor='FFD9E1F2')
FILL_IN = PatternFill('solid', fgColor='FFFFFF00')
FILL_T = PatternFill('solid', fgColor='FFF2F2F2')
WRAP = Alignment(wrap_text=True, vertical='top')
thin = Side(style='thin', color='FFBFBFBF')
TOP = Border(top=Side(style='thin', color=NAVY))
EUR = '#,##0;(#,##0);-'
MEUR = '#,##0.0;(#,##0.0);-'
PCT = '0.0%'
DEC = '0.00;(0.00);-'

wb = Workbook()

def sheet(name, title, sub, widths):
    ws = wb.create_sheet(name)
    ws['A1'] = title; ws['A1'].font = TITLE
    ws['A2'] = sub; ws['A2'].font = NOTE
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.sheet_view.showGridLines = False
    return ws

def header(ws, r, labels):
    for i, l in enumerate(labels, 1):
        c = ws.cell(r, i, l); c.font = HEAD; c.fill = FILL_H; c.alignment = Alignment(wrap_text=True, vertical='center')
    ws.row_dimensions[r].height = 30

def section(ws, r, text, ncol):
    ws.cell(r, 1, text).font = H2
    for i in range(1, ncol + 1):
        ws.cell(r, i).fill = FILL_S

def put(ws, r, c, v, fmt=None, kind='calc'):
    cell = ws.cell(r, c, v)
    cell.font = {'in': INPUT, 'calc': BODY, 'link': LINK, 'bold': BOLD}[kind]
    if kind == 'in': cell.fill = FILL_IN
    if fmt: cell.number_format = fmt
    return cell

def note(ws, r, c, text):
    cell = ws.cell(r, c, text); cell.font = NOTE; cell.alignment = WRAP

# ---------------------------------------------------------------- Lecture
ws = wb.active; ws.title = 'Lecture'
ws.column_dimensions['A'].width = 110; ws.sheet_view.showGridLines = False
lines = [
    ('CHIFFRAGE DE LA RÉPUBLIQUE DÉLIBÉRATIVE (avant-projet v26) COMPARÉ AU SYSTÈME ACTUEL', TITLE),
    ('Version de novembre 2026. Coûts annuels de fonctionnement en millions d’euros, hors coûts de transition (chiffrés à part).', NOTE),
    ('', None),
    ('Ce que compare le fichier', H2),
    ('On ne compare que ce que la Constitution change. Ce qui existe dans les deux systèmes n’est pas compté : ministères, administrations, juridictions, Cour des comptes, Défenseur des droits, élections européennes.', BODY),
    ('Côté système actuel : uniquement des montants publiés (projet de loi de finances 2026, rapports parlementaires, Sénat). Une seule ligne est estimée : les indemnités des élus départementaux et régionaux.', BODY),
    ('Côté République délibérative : la Constitution fixe le nombre de membres de chaque convention, mais renvoie souvent la durée à la loi organique. Ces durées sont donc des hypothèses, présentées en trois scénarios.', BODY),
    ('', None),
    ('Les onglets', H2),
    ('1. Hypothèses : coût d’un mois de convention par membre (revenus maintenus, indemnité, frais, organisation), en trois scénarios.', BODY),
    ('2. Système actuel : chaque ligne avec son montant, sa source et son année.', BODY),
    ('3. Conventions nationales : membres fixés par la Constitution × durée × fréquence.', BODY),
    ('4. Conventions territoriales : chaque échelon compté à partir des données officielles (régions, départements, intercommunalités, communes selon le seuil de regroupement), membres × durée, et équipes d’exécution locales.', BODY),
    ('5. Autorités et autres : autorités permanentes, expertise, référendums, et coûts de transition.', BODY),
    ('6. Synthèse : les deux systèmes côte à côte, l’écart, et le nombre de personnes tirées au sort chaque année.', BODY),
    ('7. Sources : liste des documents cités.', BODY),
    ('', None),
    ('Conventions de couleur', H2),
    ('Texte bleu sur fond jaune : hypothèse ou donnée saisie, modifiable. Texte noir : calcul. Texte vert : renvoi vers un autre onglet.', BODY),
    ('Scénario bas : institutions sobres et conventions courtes. Scénario central : hypothèse de référence. Scénario haut : conventions longues et nombreuses, autorités bien dotées.', BODY),
    ('', None),
    ('Limites', H2),
    ('Les coûts indirects ne sont pas comptés : désorganisation des employeurs, temps de formation, effets sur la qualité des lois. Les économies indirectes non plus : fin des campagnes électorales locales financées par les candidats, dépenses des collectivités pour les bureaux de vote.', BODY),
    ('Le montant des indemnités des élus communaux date de 2022 ; il a augmenté depuis. La comparaison est donc prudente pour le système actuel.', BODY),
]
for i, (t, f) in enumerate(lines, 1):
    c = ws.cell(i, 1, t); c.alignment = WRAP
    if f: c.font = f

# ---------------------------------------------------------------- Hypothèses
H = sheet('Hypothèses', 'HYPOTHÈSES COMMUNES', 'Chaque ligne en trois scénarios. Les cellules bleues sur fond jaune sont modifiables.', [58, 13, 13, 13, 12, 70])
header(H, 4, ['Paramètre', 'Bas', 'Central', 'Haut', 'Unité', 'Source ou justification'])
section(H, 5, '1. Un mois de convention nationale, par membre', 6)
rows = [
    (6, 'Part des personnes tirées au sort qui ont un emploi', (0.54, 0.56, 0.58), PCT, '%', 'Environ 30 millions de personnes en emploi pour environ 53 millions d’adultes (INSEE, Emploi et chômage 2024). Les retraités et les chômeurs gardent leurs pensions et allocations : ils ne coûtent rien de plus.'),
    (7, 'Salaire brut moyen mensuel en équivalent temps plein', (3602, 3602, 3602), EUR, '€/mois', 'INSEE Première n° 2079, salaires du secteur privé en 2024 : 3 602 € bruts, 2 733 € nets.'),
    (8, 'Taux de cotisations patronales effectif', (0.25, 0.30, 0.35), PCT, '%', 'Hypothèse : taux effectif après allègements généraux. La Constitution impose le maintien intégral des revenus (art. 14) : l’État rembourse l’employeur.'),
    (9, 'Maintien des revenus, coût moyen par membre', None, EUR, '€/mois', 'Calcul : part en emploi × salaire brut × (1 + cotisations patronales).'),
    (10, 'Indemnité de participation', (1000, 1500, 2000), EUR, '€/mois', 'Hypothèse. L’article 14 prévoit une indemnité versée en plus du maintien des revenus, fixée par la loi organique.'),
    (11, 'Frais de séjour (hébergement, transport, repas, garde d’enfants)', (2000, 2500, 3000), EUR, '€/mois', 'Hypothèse pour un séjour à temps plein loin de chez soi.'),
    (12, 'Organisation (animation, prestataires, salles, communication)', (3000, 4500, 6000), EUR, '€/mois', 'Repère : convention citoyenne sur la fin de vie, 1,3 M€ de prestataires et de communication pour 184 citoyens pendant 9 week-ends, soit environ 5 400 € par membre et par mois de séance (Sénat, rapport PLF 2023).'),
    (13, 'Coût d’un mois de convention nationale, par membre', None, EUR, '€/mois', 'Calcul : somme des lignes 9 à 12.'),
    (14, 'Équivalent annuel à temps plein', None, EUR, '€/an', 'Calcul : ligne 13 × 12.'),
]
for r, lab, vals, fmt, unit, src in rows:
    H.cell(r, 1, lab).font = BODY
    for j, col in enumerate('BCD'):
        if vals: put(H, r, j + 2, vals[j], fmt, 'in')
        elif r == 9: put(H, r, j + 2, f'={col}6*{col}7*(1+{col}8)', fmt)
        elif r == 13: put(H, r, j + 2, f'=SUM({col}9:{col}12)', fmt, 'bold')
        elif r == 14: put(H, r, j + 2, f'={col}13*12', fmt)
    H.cell(r, 5, unit).font = BODY
    note(H, r, 6, src)
section(H, 16, '2. Un mois de convention territoriale, par membre (près de chez soi)', 6)
rows = [
    (17, 'Maintien des revenus', 'link9', EUR, '€/mois', 'Même règle que pour les conventions nationales (art. 14).'),
    (18, 'Indemnité de participation', 'link10', EUR, '€/mois', 'Même indemnité que pour les conventions nationales.'),
    (19, 'Frais locaux (transport, repas, garde d’enfants)', (200, 300, 500), EUR, '€/mois', 'Hypothèse : pas d’hébergement.'),
    (20, 'Organisation locale', (500, 1000, 1500), EUR, '€/mois', 'Hypothèse : salles municipales existantes, animation par l’Autorité générale.'),
    (21, 'Coût d’un mois de convention territoriale, par membre', None, EUR, '€/mois', 'Calcul : somme des lignes 17 à 20.'),
]
for r, lab, vals, fmt, unit, src in rows:
    H.cell(r, 1, lab).font = BODY
    for j, col in enumerate('BCD'):
        if isinstance(vals, tuple): put(H, r, j + 2, vals[j], fmt, 'in')
        elif vals == 'link9': put(H, r, j + 2, f'={col}9', fmt)
        elif vals == 'link10': put(H, r, j + 2, f'={col}10', fmt)
        else: put(H, r, j + 2, f'=SUM({col}17:{col}20)', fmt, 'bold')
    H.cell(r, 5, unit).font = BODY
    note(H, r, 6, src)
section(H, 23, '3. Population', 6)
H.cell(24, 1, 'Corps civique (adultes français et étrangers résidant depuis cinq ans)').font = BODY
for j in range(3): put(H, 24, j + 2, 53_000_000, EUR, 'in')
H.cell(24, 5, 'personnes').font = BODY
note(H, 24, 6, 'Estimation : environ 49 millions d’électeurs inscrits plus les adultes non inscrits et les étrangers résidant depuis au moins cinq ans (art. 13).')
for r in range(6, 25): H.row_dimensions[r].height = 30

# ---------------------------------------------------------------- Système actuel
A = sheet('Système actuel', 'SYSTÈME ACTUEL : CE QUE LA CONSTITUTION SUPPRIME OU REMPLACE', 'Montants annuels en M€. Une seule valeur par ligne : ce sont des dépenses publiées, pas des hypothèses.', [52, 14, 12, 14, 80])
header(A, 4, ['Poste', 'Montant de référence (M€)', 'Années du cycle', 'Coût annuel (M€)', 'Source'])
r = 5
def arow(lab, amount, cycle, src, estimate=False):
    global r
    A.cell(r, 1, lab).font = BODY
    put(A, r, 2, amount, MEUR, 'in')
    if cycle: put(A, r, 3, cycle, '0', 'in')
    put(A, r, 4, f'=B{r}/C{r}' if cycle else f'=B{r}', MEUR)
    note(A, r, 5, src)
    A.row_dimensions[r].height = 30
    r += 1
section(A, r, 'Institutions nationales (crédits 2026)', 5); r += 1
s1 = r
arow('Présidence de la République', 122.56, None, 'Mission « Pouvoirs publics », PLF 2026 (Sénat, L’essentiel, commission des finances).')
arow('Assemblée nationale', 607.65, None, 'Idem.')
arow('Sénat', 353.47, None, 'Idem.')
arow('Chaînes parlementaires (LCP-AN, Public Sénat)', 35.60, None, 'Idem.')
arow('Cour de justice de la République', 0.90, None, 'Idem. Remplacée par la Juridiction de probité.')
arow('Conseil constitutionnel actuel', 20.00, None, 'Idem. Le futur Conseil est chiffré dans l’onglet Autorités.')
arow('Conseil économique, social et environnemental', 34.15, None, 'Programme 126, PAP 2026 « Conseil et contrôle de l’État ». Ses services préfigurent l’Autorité générale (art. 175).')
arow('Haute Autorité pour la transparence de la vie publique', 11.53, None, 'Programme 308, PLF 2026 (Sénat, avis n° 145, tome IX). Missions reprises par la Juridiction de probité.')
arow('Arcom', 50.52, None, 'Idem. Missions reprises par l’Autorité de régulation de la vie démocratique (art. 140).')
arow('Commission nationale des comptes de campagne (CNCCFP)', 8.52, None, 'Programme 232, PLF 2025 (Assemblée nationale, rapport n° 468, annexe 2). Reprise par l’Autorité de régulation.')
arow('Commission nationale de contrôle des techniques de renseignement', 3.80, None, 'Programme 308, PLF 2026. Remplacée par la Commission permanente (art. 69).')
e1 = r - 1
section(A, r, 'Élections nationales et locales (coût pour l’État, ramené à l’année)', 5); r += 1
s2 = r
arow('Élection présidentielle', 233.9, 5, 'Coût prévisionnel 2022 : 233,9 M€ (Assemblée nationale, avis n° 4525, PLF 2022).')
arow('Élections législatives', 171.5, 5, 'Coût estimé des législatives de 2024 : 171,5 M€ (Assemblée nationale, rapport n° 468, annexe 2, PLF 2025).')
arow('Élections municipales', 193.5, 6, 'Coût prévu des municipales de 2026 : 193,5 M€ (Sénat, rapport n° 139, PLF 2026).')
A.cell(r, 1, 'Élections départementales et régionales').font = BODY
put(A, r, 2, f'=356.25-23.08', MEUR, 'in'); put(A, r, 3, 6, '0', 'in'); put(A, r, 4, f'=B{r}/C{r}', MEUR)
note(A, r, 5, 'Crédits 2021 de l’action « Organisation des élections » (356,25 M€, Assemblée nationale, avis n° 3404, PLF 2021) moins le niveau d’une année sans élection (23,08 M€ en 2025).'); A.row_dimensions[r].height = 30; r += 1
arow('Élections sénatoriales', 3.7, 3, 'Coût prévu des sénatoriales de 2026 : 3,7 M€ (Sénat, rapport n° 139, PLF 2026).')
arow('Aide publique aux partis politiques', 68.67, None, 'Programme 232, 2024 à 2026. Calculée sur les résultats des législatives, elle perd sa base. Le scénario haut la maintient (onglet Autorités).')
e2 = r - 1
note(A, r, 1, 'Les élections européennes sont maintenues : elles ne sont comptées d’aucun côté. Les dépenses des communes pour les bureaux de vote ne sont pas comptées.'); r += 1
section(A, r, 'Élus locaux', 5); r += 1
s3 = r
arow('Indemnités des élus communaux et intercommunaux', 2000, None, 'Environ 2 Md€ en 2022, dont près de 1,5 Md€ pour les communes (DGCL, citée par le Sénat, rapport d’information n° 121, 2023-2024).')
arow('Indemnités des élus départementaux et régionaux (estimation)', 180, None, 'Estimation : environ 4 100 conseillers départementaux et 1 900 conseillers régionaux, autour de 2 400 à 2 700 € par mois en moyenne. Pas de total publié.', True)
e3 = r - 1
r += 1
A.cell(r, 1, 'TOTAL SYSTÈME ACTUEL').font = BOLD
put(A, r, 4, f'=SUM(D{s1}:D{e1})+SUM(D{s2}:D{e2})+SUM(D{s3}:D{e3})', MEUR, 'bold')
for c in range(1, 6): A.cell(r, c).border = TOP; A.cell(r, c).fill = FILL_T
TOT_ACTUEL = f"'Système actuel'!D{r}"
A_INST = f"SUM('Système actuel'!D{s1}:D{e1})"; A_ELEC = f"SUM('Système actuel'!D{s2}:D{e2})"; A_LOC = f"SUM('Système actuel'!D{s3}:D{e3})"

# ---------------------------------------------------------------- Conventions nationales
N = sheet('Conventions nationales', 'CONVENTIONS ET MANDATS CITOYENS NATIONAUX', 'Membres-mois par an = membres × durée (mois) × fréquence par an. Coût = membres-mois × coût d’un mois (onglet Hypothèses, ligne 13).', [44, 9, 8, 8, 8, 8, 8, 8, 10, 10, 10, 9, 9, 9, 60])
header(N, 4, ['Organe', 'Membres', 'Durée bas', 'Durée central', 'Durée haut', 'Fréq. bas', 'Fréq. central', 'Fréq. haut', 'Membres-mois bas', 'Membres-mois central', 'Membres-mois haut', 'M€ bas', 'M€ central', 'M€ haut', 'Fondement et hypothèse'])
conv = [
    ('Convention de programmation', 150, (2, 3, 4), (0.2, 0.2, 0.2), 'Art. 19 : 150 membres, tous les cinq ans. Durée : hypothèse.'),
    ('Conventions thématiques', 150, (2, 3, 4), (4, 6, 8), 'Art. 20 et 21 : 150 membres ; durée fixée par l’Autorité de programmation. Nombre par an : hypothèse.'),
    ('Convention ordinaire annuelle (budget, réexamens, décrets évoqués)', 150, (1, 1.5, 2), (1, 1, 1), 'Art. 24 : une session par an au moment du budget, plus les sessions supplémentaires.'),
    ('Autres conventions dédiées (droits fondamentaux, traités, outre-mer…)', 150, (1, 2, 3), (0.5, 1, 1.5), 'Conventions prévues par d’autres titres. Nombre et durée : hypothèse.'),
    ('Convention de désignation (permanente)', 50, (1, 2, 3), (1, 1, 1), 'Art. 53 : 50 membres pour deux ans, au moins une réunion par trimestre. Durée = temps réellement siégé par an.'),
    ('Autorité de programmation civique', 50, (1.1, 1.4, 1.9), (1, 1, 1), 'Art. 29 et 30 : 50 citoyens, mandat d’un an, une séance chaque mois. Hypothèse : 2, 2,5 ou 3 jours par mois, plus des sessions extraordinaires dans le scénario haut ; 21,7 jours ouvrés = 1 mois.'),
    ('Convention de secours (veille et astreinte)', 150, (0.25, 0.5, 1.5), (1, 1, 1), 'Art. 119 : 150 membres formés et placés sous astreinte. Hors réunions de crise.'),
    ('Session plénière de l’Autorité de contrôle de l’exécution des lois', 150, (1, 1.25, 1.5), (1, 1, 1), 'Art. 64 : 150 citoyens, au moins quatre semaines par an.'),
    ('Convention constituante', 300, (3, 4.5, 6), (1 / 15, 0.1, 1 / 7), 'Art. 165 : 300 membres, trois à six mois. Fréquence : une révision tous les 15, 10 ou 7 ans.'),
    ('Rapporteurs des conventions (suivi pendant cinq ans)', 90, (0.5, 1, 1.5), (1, 1, 1), 'Art. 20 : trois rapporteurs par convention pendant cinq ans, environ 90 en activité. Temps partiel.'),
    ('Citoyens de l’Autorité de régulation', 3, (12, 12, 12), (1, 1, 1), 'Art. 140 : trois citoyens tirés au sort pour deux ans.'),
    ('Citoyens du Conseil supérieur de la magistrature (discipline)', 3, (0.1, 0.1, 0.1), (20, 40, 60), 'Art. 91 : trois citoyens tirés au sort pour chaque affaire. Fréquence = affaires par an : hypothèse.'),
]
r0 = 5
for i, (lab, m, d, f, src) in enumerate(conv):
    r = r0 + i
    N.cell(r, 1, lab).font = BODY; N.cell(r, 1).alignment = WRAP
    put(N, r, 2, m, EUR, 'in')
    for j in range(3):
        put(N, r, 3 + j, d[j], DEC, 'in'); put(N, r, 6 + j, f[j], DEC, 'in')
        dc, fc = get_column_letter(3 + j), get_column_letter(6 + j)
        put(N, r, 9 + j, f'=B{r}*{dc}{r}*{fc}{r}', EUR)
        mm = get_column_letter(9 + j); hc = 'BCD'[j]
        put(N, r, 12 + j, f'={mm}{r}*Hypothèses!{hc}$13/1000000', MEUR)
    note(N, r, 15, src); N.row_dimensions[r].height = 30
rN = r0 + len(conv)
N.cell(rN, 1, 'TOTAL CONVENTIONS NATIONALES').font = BOLD
for c in range(9, 15):
    col = get_column_letter(c)
    put(N, rN, c, f'=SUM({col}{r0}:{col}{rN-1})', EUR if c < 12 else MEUR, 'bold')
for c in range(1, 16): N.cell(rN, c).border = TOP; N.cell(rN, c).fill = FILL_T
N_TOT = [f"'Conventions nationales'!{c}{rN}" for c in 'LMN']
N_THEM_ROW = r0 + 1
# personnes tirées par an (renouvellement)
rP = rN + 2
section(N, rP, 'Personnes tirées au sort chaque année (scénario central)', 15)
pers = [
    ('Programmation', f'=B{r0}*G{r0}'), ('Thématiques', f'=B{r0+1}*G{r0+1}'), ('Ordinaire annuelle', f'=B{r0+2}*G{r0+2}'),
    ('Autres conventions dédiées', f'=B{r0+3}*G{r0+3}'), ('Désignation (renouvelée par moitié chaque année)', f'=B{r0+4}/2'),
    ('Programmation civique (renouvelée par moitié tous les six mois)', f'=B{r0+5}'), ('Secours (renouvellement annuel supposé)', f'=B{r0+6}'),
    ('Session plénière', f'=B{r0+7}'), ('Constituante', f'=B{r0+8}*G{r0+8}'), ('Régulation (mandat de deux ans)', f'=B{r0+10}/2'),
    ('Conseil supérieur de la magistrature', f'=B{r0+11}*G{r0+11}'),
]
for i, (lab, fml) in enumerate(pers):
    rr = rP + 1 + i
    N.cell(rr, 1, lab).font = BODY; put(N, rr, 2, fml, EUR)
rPT = rP + 1 + len(pers)
N.cell(rPT, 1, 'Total national').font = BOLD; put(N, rPT, 2, f'=SUM(B{rP+1}:B{rPT-1})', EUR, 'bold')
N_PERS = f"'Conventions nationales'!B{rPT}"

# ---------------------------------------------------------------- Conventions territoriales
T = sheet('Conventions territoriales', 'CONVENTIONS TERRITORIALES ET ÉQUIPES D’EXÉCUTION LOCALES', 'Art. 124 à 126 : chaque collectivité délibère par une convention tirée au sort ; les communes trop petites sont regroupées dans la convention intercommunale, selon un seuil fixé par la loi organique.', [50, 10, 10, 10, 11, 11, 11, 11, 62])
header(T, 4, ['Échelon', 'Nombre bas', 'Nombre central', 'Nombre haut', 'Membres par convention', 'Membres bas', 'Membres central', 'Membres haut', 'Source et hypothèse'])
T.cell(5, 1, 'Seuil de population pour une convention communale propre').font = BOLD
for j, v in enumerate((3500, 3500, 3500)): put(T, 5, j + 2, v, EUR, 'in')
note(T, 5, 9, 'Hypothèse retenue : 3 500 habitants (environ 2 700 adultes, assez pour tirer 25 personnes représentatives sans que tout le monde se connaisse). Avec un seuil à 10 000, il y aurait 2 435 conventions ; à 2 000, 6 896.')
T.row_dimensions[5].height = 45
lv = [
    ('Régions et collectivités uniques (Corse, Martinique, Guyane, Mayotte)', (18, 18, 18), 80, '13 régions métropolitaines (Corse comprise), Guadeloupe, La Réunion, Martinique, Guyane, Mayotte (DGCL, 2025).'),
    ('Départements (Alsace comptée une fois ; hors Paris et collectivités uniques)', (94, 94, 94), 60, '96 départements métropolitains moins Paris, les deux départements corses et un pour la Collectivité européenne d’Alsace, plus Guadeloupe et La Réunion.'),
    ('Collectivités d’outre-mer et Nouvelle-Calédonie (assemblées et provinces)', (9, 9, 9), 40, 'Saint-Pierre-et-Miquelon, Saint-Barthélemy, Saint-Martin, Wallis-et-Futuna, Polynésie française, congrès et trois provinces de Nouvelle-Calédonie (art. 128). Leurs communes ne sont pas comptées.'),
    ('Établissements publics territoriaux du Grand Paris', (11, 11, 11), 40, 'INSEE, EPT au 1er janvier 2025.'),
    ('Intercommunalités de moins de 50 000 habitants', (970, 970, 970), 30, '1 255 intercommunalités au 1er janvier 2025 : 989 communautés de communes, 230 communautés d’agglomération, 14 communautés urbaines, 21 métropoles et la Métropole de Lyon. Leur convention sert aussi de convention mutualisée pour les petites communes.'),
    ('Intercommunalités de 50 000 à 200 000 habitants', (235, 235, 235), 40, 'Idem, réparties selon leur population municipale.'),
    ('Intercommunalités de plus de 200 000 habitants (dont métropoles)', (50, 50, 50), 60, 'Idem.'),
    ('Communes de 2 000 à 3 500 habitants', (0, 0, 0), 25, 'Populations légales INSEE en vigueur au 1er janvier 2025, métropole et départements d’outre-mer. 2 255 communes, regroupées avec un seuil à 3 500.'),
    ('Communes de 3 500 à 10 000 habitants', (2206, 2206, 2206), 25, 'Idem. Comptées si le seuil est à 3 500 ou moins.'),
    ('Communes de 10 000 à 50 000 habitants', (914, 914, 914), 35, 'Idem.'),
    ('Communes de 50 000 à 200 000 habitants', (123, 123, 123), 50, 'Idem.'),
    ('Communes de plus de 200 000 habitants', (11, 11, 11), 75, 'Idem. Paris, ville et département, est comptée ici une seule fois.'),
]
r = 6
for lab, n, m, src in lv:
    T.cell(r, 1, lab).font = BODY; T.cell(r, 1).alignment = WRAP
    for j in range(3): put(T, r, j + 2, n[j], EUR, 'in')
    put(T, r, 5, m, EUR, 'in')
    for j, c in enumerate('BCD'): put(T, r, j + 6, f'={c}{r}*$E{r}', EUR)
    note(T, r, 9, src); T.row_dimensions[r].height = 30; r += 1
rT = r
T.cell(rT, 1, 'TOTAL').font = BOLD
for c in 'BCDFGH': put(T, rT, ' ABCDEFGH'.index(c), f'=SUM({c}6:{c}{rT-1})', EUR, 'bold')
for c in range(1, 10): T.cell(rT, c).border = TOP; T.cell(rT, c).fill = FILL_T
r = rT + 2
section(T, r, 'Coût', 9); r += 1
header(T, r, ['Paramètre', 'Bas', 'Central', 'Haut', 'Unité', '', '', '', 'Source et hypothèse']); r += 1
def trow(lab, vals, fmt, unit, src, formula=None, bold=False):
    global r
    T.cell(r, 1, lab).font = BOLD if bold else BODY; T.cell(r, 1).alignment = WRAP
    for j, c in enumerate('BCD'):
        if vals: put(T, r, j + 2, vals[j], fmt, 'in')
        else: put(T, r, j + 2, formula(c), fmt, 'bold' if bold else 'calc')
    T.cell(r, 5, unit).font = BODY; note(T, r, 9, src); T.row_dimensions[r].height = 30
    r += 1; return r - 1
rM = trow('Durée siégée par an, en équivalent temps plein', (1, 1, 1), DEC, 'mois', 'Hypothèse retenue : un mois par an. Budget annuel et contrôle périodique de l’exécutif local (art. 125), en soirée ou en fin de semaine, ramené à un équivalent temps plein.')
rMM = trow('Membres-mois par an', None, EUR, 'membres-mois', 'Calcul : membres × durée.', lambda c: f'={chr(ord(c)+4)}{rT}*{c}{rM}')
rC = trow('Coût des conventions territoriales', None, MEUR, 'M€/an', 'Calcul : membres-mois × coût d’un mois territorial (Hypothèses, ligne 21).', lambda c: f'={c}{rMM}*Hypothèses!{c}21/1000000')
rP = trow('Personnes par équipe d’exécution locale (moyenne)', (2, 2.5, 3), DEC, 'personnes', 'Art. 125 : équipe désignée par la convention, issue notamment des services administratifs. Hypothèse.')
rS = trow('Surcoût mensuel par membre de l’équipe, cotisations comprises', (1500, 2000, 3000), EUR, '€/mois', 'Hypothèse : prime de responsabilité versée à des agents déjà rémunérés, ou rémunération de cadres recrutés.')
rX = trow('Coût des équipes d’exécution locales', None, MEUR, 'M€/an', 'Calcul : conventions × personnes × surcoût × 12. Remplace les indemnités des maires, adjoints et présidents.', lambda c: f'={c}{rT}*{c}{rP}*{c}{rS}*12/1000000')
rTT = trow('TOTAL TERRITORIAL', None, MEUR, 'M€/an', '', lambda c: f'={c}{rC}+{c}{rX}', True)
for c in range(1, 10): T.cell(rTT, c).border = TOP; T.cell(rTT, c).fill = FILL_T
rPe = trow('Personnes tirées au sort chaque année', None, EUR, 'personnes', 'Calcul : total des membres, renouvellement annuel supposé.', lambda c: f'={chr(ord(c)+4)}{rT}')
T_CONV = [f"'Conventions territoriales'!{c}{rC}" for c in 'BCD']
T_EXEC = [f"'Conventions territoriales'!{c}{rX}" for c in 'BCD']
T_PERS = f"'Conventions territoriales'!C{rPe}"

# ---------------------------------------------------------------- Autorités et autres
O = sheet('Autorités et autres', 'AUTORITÉS PERMANENTES, EXPERTISE, RÉFÉRENDUMS ET TRANSITION', 'Estimations en M€ par an. Le repère indique le coût actuel des organes comparables.', [56, 12, 12, 12, 75])
header(O, 4, ['Poste', 'Bas', 'Central', 'Haut', 'Repère et hypothèse'])
section(O, 5, 'Autorités permanentes', 5)
auth = [
    ('Autorité générale des conventions citoyennes', (80, 130, 200), 'Organise toutes les conventions, nationales et territoriales, le tirage et les registres (art. 25 à 28). Repère : le CESE coûte 34 M€, dont 4 M€ pour la participation citoyenne.'),
    ('Autorité de contrôle de l’exécution des lois (hors session plénière)', (150, 200, 250), 'Service technique permanent, Procureur général des comptes publics, enquêtes et contrôle des secrets (art. 63 à 70). Reprend les fonctions de contrôle du Parlement.'),
    ('Commission permanente de contrôle du renseignement et des forces armées', (5, 7.5, 10), 'Douze membres à temps plein et un service (art. 69). Repère : la CNCTR coûte 3,8 M€.'),
    ('Conseil constitutionnel', (30, 40, 50), 'Contrôle préalable de toutes les lois et contestation ouverte à toute personne (art. 39 et 40). Repère : 20 M€ aujourd’hui.'),
    ('Juridiction de probité et de responsabilité publique', (25, 30, 40), 'Quinze membres, contrôles de probité et révocations (Titre IX). Repère : HATVP 11,5 M€ et Cour de justice de la République 0,9 M€.'),
    ('Autorité de régulation de la vie démocratique', (55, 65, 80), 'Médias, plateformes, financement des partis et campagnes (art. 140). Repère : Arcom 50,5 M€ et CNCCFP 8,5 M€.'),
    ('Présidence du collège des ministres et représentation de l’État', (20, 30, 50), 'Protocole, accueil des chefs d’État, résidences. Repère : la Présidence de la République coûte 122,6 M€.'),
    ('Sièges secondaires et communications de la convention de secours', (5, 10, 20), 'Art. 119 : sièges répartis sur le territoire, maintenus en condition opérationnelle, réseaux indépendants.'),
]
r = 6
for lab, v, src in auth:
    O.cell(r, 1, lab).font = BODY; O.cell(r, 1).alignment = WRAP
    for j in range(3): put(O, r, j + 2, v[j], MEUR, 'in')
    note(O, r, 5, src); O.row_dimensions[r].height = 30; r += 1
eA = r - 1
section(O, r, 'Expertise des conventions', 5); r += 1
O.cell(r, 1, 'Expertise par convention thématique (conseil scientifique, jury, contre-expertise)').font = BODY
for j in range(3): put(O, r, j + 2, (0.5, 1, 1.5)[j], MEUR, 'in')
note(O, r, 5, 'Hypothèse par convention (art. 45 à 49, 132 à 136).'); rx = r; r += 1
O.cell(r, 1, 'Nombre de conventions thématiques par an').font = BODY
for j, c in enumerate('FGH'): put(O, r, j + 2, f"='Conventions nationales'!{c}{N_THEM_ROW}", DEC, 'link')
rn = r; r += 1
O.cell(r, 1, 'Expertise des autres textes (budget, décrets, conventions dédiées)').font = BODY
for j in range(3): put(O, r, j + 2, (2, 4, 6)[j], MEUR, 'in')
note(O, r, 5, 'Hypothèse.'); ro = r; r += 1
O.cell(r, 1, 'Coût de l’expertise').font = BOLD
for j, c in enumerate('BCD'): put(O, r, j + 2, f'={c}{rx}*{c}{rn}+{c}{ro}', MEUR, 'bold')
rE = r; r += 1
section(O, r, 'Référendums et partis', 5); r += 1
O.cell(r, 1, 'Coût d’un référendum national').font = BODY
for j in range(3): put(O, r, j + 2, (120, 150, 180)[j], MEUR, 'in')
note(O, r, 5, 'Repère : 233,9 M€ pour la présidentielle de 2022, dont le remboursement des campagnes des candidats, absent d’un référendum ; 109 M€ pour la seule propagande des législatives de 2022.'); rr1 = r; r += 1
O.cell(r, 1, 'Référendums par an').font = BODY
for j in range(3): put(O, r, j + 2, (0.1, 0.25, 0.5)[j], DEC, 'in')
note(O, r, 5, 'Révisions de la Constitution (art. 167) et ratification des traités majeurs (art. 147) : un tous les 10, 4 ou 2 ans.'); rr2 = r; r += 1
O.cell(r, 1, 'Coût annuel des référendums').font = BOLD
for j, c in enumerate('BCD'): put(O, r, j + 2, f'={c}{rr1}*{c}{rr2}', MEUR, 'bold')
rR = r; r += 1
O.cell(r, 1, 'Aide publique aux partis maintenue').font = BODY
for j in range(3): put(O, r, j + 2, (0, 0, 68.67)[j], MEUR, 'in')
note(O, r, 5, 'La Constitution n’impose pas de financement public (art. 144). Le scénario haut garde le montant actuel.'); rPa = r; r += 2
O.cell(r, 1, 'TOTAL AUTORITÉS ET AUTRES (M€/an)').font = BOLD
for j, c in enumerate('BCD'): put(O, r, j + 2, f'=SUM({c}6:{c}{eA})+{c}{rE}+{c}{rR}+{c}{rPa}', MEUR, 'bold')
for c in range(1, 6): O.cell(r, c).border = TOP; O.cell(r, c).fill = FILL_T
rOT = r; r += 2
O_AUTH = [f"SUM('Autorités et autres'!{c}6:{c}{eA})" for c in 'BCD']
O_EXP = [f"'Autorités et autres'!{c}{rE}" for c in 'BCD']
O_REF = [f"'Autorités et autres'!{c}{rR}+'Autorités et autres'!{c}{rPa}" for c in 'BCD']
section(O, r, 'Coûts de transition (une seule fois, en M€)', 5); r += 1
st = r
trans = [
    ('Référendum de ratification de la Constitution', (120, 150, 180), 'Même repère que les référendums ci-dessus.'),
    ('Systèmes de tirage au sort, registres et vote vérifiable', (20, 50, 100), 'Art. 13 et 17 : tirage public et vérifiable, traçabilité des votes. Hypothèse.'),
    ('Préfiguration et installation des autorités', (30, 60, 100), 'Art. 175 et 176 : Autorité de préfiguration à partir des services du CESE. Hypothèse.'),
    ('Formation initiale des administrations et des premières conventions territoriales', (30, 60, 120), 'Hypothèse.'),
    ('Accompagnement des agents des assemblées et des collectivités', (0, 50, 150), 'Reclassement des personnels des assemblées et des cabinets d’élus. Hypothèse : une partie est reprise par les nouvelles autorités.'),
]
for lab, v, src in trans:
    O.cell(r, 1, lab).font = BODY; O.cell(r, 1).alignment = WRAP
    for j in range(3): put(O, r, j + 2, v[j], MEUR, 'in')
    note(O, r, 5, src); O.row_dimensions[r].height = 30; r += 1
O.cell(r, 1, 'TOTAL TRANSITION (M€, une fois)').font = BOLD
for j, c in enumerate('BCD'): put(O, r, j + 2, f'=SUM({c}{st}:{c}{r-1})', MEUR, 'bold')
for c in range(1, 6): O.cell(r, c).border = TOP; O.cell(r, c).fill = FILL_T
O_TRANS = [f"'Autorités et autres'!{c}{r}" for c in 'BCD']

# ---------------------------------------------------------------- Synthèse
S = sheet('Synthèse', 'SYNTHÈSE : COÛT ANNUEL DES DEUX SYSTÈMES (M€)', 'Le système actuel n’a qu’une valeur, répétée dans les trois colonnes. Les scénarios portent sur la République délibérative.', [60, 14, 14, 14, 60])
header(S, 4, ['Poste', 'Bas', 'Central', 'Haut', 'Commentaire'])
section(S, 5, 'Système actuel', 5)
srows = [
    (6, 'Institutions nationales et autorités remplacées', [A_INST] * 3, 'Présidence, Parlement, CESE, HATVP, Arcom, CNCCFP, CNCTR…'),
    (7, 'Élections et aide aux partis', [A_ELEC] * 3, 'Coût pour l’État, ramené à l’année.'),
    (8, 'Indemnités des élus locaux', [A_LOC] * 3, 'Base 2022 : valeur basse.'),
]
for r, lab, f, c in srows:
    S.cell(r, 1, lab).font = BODY
    for j in range(3): put(S, r, j + 2, '=' + f[j], MEUR, 'link')
    note(S, r, 5, c)
S.cell(9, 1, 'Total système actuel').font = BOLD
for j, c in enumerate('BCD'): put(S, 9, j + 2, f'=SUM({c}6:{c}8)', MEUR, 'bold')
section(S, 11, 'République délibérative', 5)
nrows = [
    (12, 'Conventions et mandats citoyens nationaux', N_TOT, ''),
    (13, 'Conventions territoriales', T_CONV, ''),
    (14, 'Équipes d’exécution locales', T_EXEC, ''),
    (15, 'Autorités permanentes', O_AUTH, ''),
    (16, 'Expertise des conventions', O_EXP, ''),
    (17, 'Référendums et aide aux partis', O_REF, ''),
]
for r, lab, f, c in nrows:
    S.cell(r, 1, lab).font = BODY
    for j in range(3): put(S, r, j + 2, '=' + f[j], MEUR, 'link')
S.cell(18, 1, 'Total République délibérative').font = BOLD
for j, c in enumerate('BCD'): put(S, 18, j + 2, f'=SUM({c}12:{c}17)', MEUR, 'bold')
section(S, 20, 'Comparaison', 5)
S.cell(21, 1, 'Économie annuelle (système actuel − République délibérative)').font = BOLD
for j, c in enumerate('BCD'): put(S, 21, j + 2, f'={c}9-{c}18', MEUR, 'bold')
S.cell(22, 1, 'Coût de la République délibérative, en % du système actuel').font = BODY
for j, c in enumerate('BCD'): put(S, 22, j + 2, f'=IF({c}9=0,0,{c}18/{c}9)', PCT)
S.cell(23, 1, 'Coûts de transition (une fois)').font = BODY
for j in range(3): put(S, 23, j + 2, '=' + O_TRANS[j], MEUR, 'link')
S.cell(24, 1, 'Années d’économies pour couvrir la transition').font = BODY
for j, c in enumerate('BCD'): put(S, 24, j + 2, f'=IF({c}21<=0,"sans objet",{c}23/{c}21)', '0.0')
for rr in (9, 18, 21):
    for c in range(1, 6): S.cell(rr, c).border = TOP; S.cell(rr, c).fill = FILL_T
section(S, 26, 'Mobilisation des citoyens (scénario central)', 5)
S.cell(27, 1, 'Personnes tirées au sort par an, conventions nationales').font = BODY; put(S, 27, 3, '=' + N_PERS, EUR, 'link')
S.cell(28, 1, 'Personnes tirées au sort par an, conventions territoriales').font = BODY; put(S, 28, 3, '=' + T_PERS, EUR, 'link')
S.cell(29, 1, 'Total').font = BOLD; put(S, 29, 3, '=C27+C28', EUR, 'bold')
S.cell(30, 1, 'Une chance sur… d’être tiré au sort une année donnée').font = BODY; put(S, 30, 3, '=IF(C29=0,0,Hypothèses!C24/C29)', EUR)
S.cell(31, 1, 'Coût annuel par habitant, système actuel (€)').font = BODY; put(S, 31, 3, '=C9*1000000/68600000', '0.0')
S.cell(32, 1, 'Coût annuel par habitant, République délibérative (€)').font = BODY; put(S, 32, 3, '=C18*1000000/68600000', '0.0')
note(S, 31, 5, 'Population : 68,6 millions d’habitants (INSEE, 1er janvier 2025).')

# ---------------------------------------------------------------- Sources
R = sheet('Sources', 'SOURCES', 'Documents consultés en novembre 2026.', [70, 100])
header(R, 4, ['Document', 'Adresse'])
src = [
    ('Sénat, commission des finances, « L’essentiel » sur la mission Pouvoirs publics, PLF 2026', 'https://www.senat.fr/fileadmin/cru-1762483659/Commissions/Finances/2025-2026/PLF_2026/Essentiel/Pouvoirs_publics_Essentiel_post-commission_PLF_26.pdf'),
    ('Projet annuel de performances 2026, Conseil et contrôle de l’État (CESE, Cour des comptes)', 'https://www.assemblee-nationale.fr/dyn/contenu/visualisation/1087957/file/PAP2026_BG_Conseil_controle_Etat_CA.pdf'),
    ('Sénat, avis n° 145 (2025-2026), tome IX, autorités administratives indépendantes (programme 308)', 'https://www.senat.fr/rap/a25-145-9/a25-145-9-syn.pdf'),
    ('Jaune budgétaire « Autorités administratives et publiques indépendantes », PLF 2025', 'https://www2.assemblee-nationale.fr/static/17/Annexes-DL/PLF2025-Jaunes/23-Jaune_AAPI.pdf'),
    ('Assemblée nationale, rapport n° 468, annexe 2, programme 232 « Vie politique », PLF 2025', 'https://www.assemblee-nationale.fr/dyn/17/rapports/cion_fin/l17b0468-tiii-a2_rapport-fond.pdf'),
    ('Sénat, rapport n° 139 (2025-2026), programme 232, PLF 2026', 'https://www.senat.fr/rap/l25-139-32/l25-139-32-syn.pdf'),
    ('Assemblée nationale, avis n° 4525, PLF 2022 (coût de la présidentielle et des législatives 2022)', 'https://www.assemblee-nationale.fr/dyn/15/rapports/cion_lois/l15b4525-ti_rapport-avis.pdf'),
    ('Assemblée nationale, avis n° 3404, PLF 2021 (élections départementales et régionales 2021)', 'https://www.assemblee-nationale.fr/dyn/15/rapports/cion_lois/l15b3404-ti_rapport-avis.pdf'),
    ('Sénat, rapport d’information n° 121 (2023-2024), indemnités des élus locaux', 'https://www.senat.fr/rap/r23-121/r23-121_mono.html'),
    ('INSEE, populations légales en vigueur au 1er janvier 2025 et Code officiel géographique, via le jeu de données Etalab « découpage administratif » (version 6.0.0, mars 2026)', 'https://github.com/datagouv/decoupage-administratif'),
    ('DGCL, BIS n° 195, Les structures territoriales au 1er janvier 2025', 'https://www.collectivites-locales.gouv.fr/node/2472'),
    ('DGCL, Les collectivités locales en chiffres 2025, synthèse', 'https://www.collectivites-locales.gouv.fr/files/files/Etudes-et-statistiques/Les%20collectivit%C3%A9s%20locales%20en%20chiffres/Les%20collectivit%C3%A9s%20en%20chiffres/2025/Chapitre%201%20-%20Synth%C3%A8se.pdf'),
    ('Sénat, rapport PLF 2023, mission Conseil et contrôle de l’État (coût des conventions citoyennes)', 'https://www.senat.fr/rap/l22-115-37/l22-115-377.html'),
    ('INSEE Première n° 2079, salaires dans le secteur privé en 2024', 'https://www.insee.fr/fr/statistiques/8657156'),
]
for i, (d, u) in enumerate(src):
    R.cell(5 + i, 1, d).font = BODY; R.cell(5 + i, 1).alignment = WRAP
    c = R.cell(5 + i, 2, u); c.font = Font(name=F, size=9, color='FF0563C1', underline='single'); c.hyperlink = u
    R.row_dimensions[5 + i].height = 30

for w in wb.worksheets:
    w.freeze_panes = 'A5' if w.title != 'Lecture' else None
wb.save(OUT)
print(OUT)
