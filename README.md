# Réa Chir P17 — Plateforme de protocoles

Plateforme web installable (PWA) du **Service de Réanimation Chirurgicale P17 — CHU Ibn Rochd, Casablanca** : protocoles d'anesthésie par spécialité, gestion pré-opératoire, per-opératoire et post-opératoire, urgences au bloc, échographie, calculateurs, EER et échanges plasmatiques, antibiothérapie, enseignement et recherche.

Le site fonctionne sans serveur ni base de données : il suffit de l'héberger gratuitement sur GitHub Pages. Une fois ouvert une première fois, il reste utilisable hors connexion.

---

## 1. Mettre le site en ligne (GitHub Pages)

1. Créer un compte sur <https://github.com> (gratuit).
2. Cliquer sur **New repository**, nommer le dépôt par exemple `rea-chir-p17`, le laisser **Public**, puis **Create repository**.
3. Sur la page du dépôt vide, cliquer sur **uploading an existing file**, puis glisser **le contenu** du dossier décompressé (les fichiers `index.html`, `manifest.webmanifest`, `sw.js`, `README.md`, `.nojekyll` et les dossiers `assets`, `icons`, `scripts`, `tests`, `.github`). Valider avec **Commit changes**.
   - Le dossier `.github` est masqué sur certains ordinateurs : l'afficher (macOS : `Cmd + Maj + .` ; Windows : Affichage > Éléments masqués). S'il ne passe pas par le navigateur, créer le fichier à la main : **Add file > Create new file**, nom `.github/workflows/deploy.yml`, et coller son contenu.
4. Aller dans **Settings > Pages**, et choisir **Source : GitHub Actions**.
5. Aller dans **Actions**, ouvrir « Mise en ligne » et cliquer sur **Run workflow** (la première fois seulement).
6. Après 1 à 2 minutes, le site est disponible à l'adresse `https://<votre-identifiant>.github.io/rea-chir-p17/`.

### Installer l'application sur un téléphone

- **Android (Chrome)** : ouvrir l'adresse, menu ⋮ > **Installer l'application**.
- **iPhone (Safari)** : ouvrir l'adresse, bouton **Partager** > **Sur l'écran d'accueil**.

---

## 2. Bibliographie

La rubrique est vide pour le moment. Pour ajouter une référence, compléter la liste `REFS` de `assets/modules/bibliographie.js` (titre, source, année, lien). Le site ne dépend d'aucune source externe.

---

## 3. Modifier le contenu

Toutes les modifications peuvent se faire directement sur GitHub (bouton ✏️ sur un fichier), le site est republié automatiquement.

| Je veux modifier… | Fichier |
|---|---|
| Nom du service, de l'hôpital, date de révision, photo de bannière, **annuaire** (liste `annuaire`), portrait d'hommage de la rubrique Antibiothérapie (`hommage.photo`) | `assets/config.js` |
| Fiches d'anesthésie | `assets/modules/anesth/<spécialité>.js` (la transplantation rénale, dans `transplantation-renale.js`, s'affiche dans Urologie) |
| Post-opératoire : analgésie, extubation, saignement (arbre décisionnel), check-list de sortie de SSPI avec NVPO et glycémie | `assets/modules/periop.js` (page `#/postop` et liste `P17.postop` dans `assets/modules/commun.js`) |
| Blocs analgésiques : outil chirurgie → intervention → bloc, une fiche par bloc, dose maximale et toxicité des anesthésiques locaux | `assets/modules/blocs.js` |
| Sections de l'accueil (gestion pré-opératoire, per-opératoire, post-opératoire, outils, divers) | `assets/modules/accueil.js` |
| Urgences au bloc : bulle rouge présente sur toutes les pages et aides cognitives (liste `URG`) | `assets/modules/urgences.js` |
| Per-opératoire : médicaments, voies aériennes et estomac plein, rachianesthésie, antibioprophylaxie (outil qui lit les fiches des interventions), transfusion ; thromboprophylaxie postopératoire | `assets/modules/perop.js` |
| Anesthésie selon le terrain (section de l'accueil) : situations à risque puis conduite (coronarien, insuffisant cardiaque, BPCO, apnées, obèse, insuffisant rénal, cirrhotique, sujet âgé) | `assets/modules/terrains.js` |
| Gestion pré-opératoire : consultation, visite préanesthésique, traitements chroniques, antiagrégants et anticoagulants (outil GIHP-SFAR 2026) | `assets/modules/commun.js` (règles de calcul dans `assets/calc.js`) |
| Cours de chirurgie thoracique (VATS, wedge, unipulmonaire, sonde double lumière, bloqueurs, péridurale, analgésie) | `assets/modules/anesth/thoracique-cours.js` |
| Antibiothérapie (BMR, durées, rein, administration) | `assets/modules/atb-data.js` |
| Outils d'antibiothérapie probabiliste | `assets/modules/antibiotherapie.js` |
| Calculateurs (formules) | `assets/calc.js` (formules) et `assets/modules/calculateurs.js` (affichage) |
| Échographie (ETT, pleuro-pulmonaire et diaphragme avec leurs outils) | `assets/modules/echographie.js`, formules dans `assets/calc.js`, images dans `assets/img/echo/` |
| Schémas échographiques et fiches-mémos (bases, pleuro-pulmonaire, diaphragme) | `scripts/echo_figures.py` puis `scripts/echo_posters.py` (régénèrent `assets/img/echo/fig/` et `assets/img/echo/base-m*.webp`, `pp-m*.webp`) |
| Vues échographiques schématiques des blocs | `scripts/bloc_figures.py` (régénère `assets/img/blocs/*.webp`) |
| Scènes de bloc et de réanimation en filigrane, selon la rubrique | `assets/modules/decor.js` (liste `MAP`), images dans `assets/img/decor/` |
| Couleurs, typographie | `assets/app.css` (variables en tête de fichier) |

### Photo de l'hôpital dans la bannière

Déposer la photo (format paysage, ≥ 1600 px de large) dans `assets/img/`, par exemple `assets/img/banniere-chu.jpg`, puis dans `assets/config.js` :

```js
banniere: { photo: "assets/img/banniere-chu.jpg" },
```

L'illustration reste superposée avec un voile sombre pour garder le texte lisible.

### Logo officiel du CHU

Par défaut, la barre du haut et la pièce centrale de l'accueil affichent le sigle « CHU » et le nom « IBN ROCHD · Casablanca » dans les couleurs du logo. Pour afficher le logo officiel à la place, déposer le fichier fourni par le CHU (PNG ou SVG, fond blanc ou transparent) dans `assets/img/`, puis dans `assets/config.js` :

```js
logo: "assets/img/logo-chu.png",
```

### Format d'une fiche

Chaque fiche est un objet avec un titre, des étiquettes, des sections et des références :

```js
{
  id: "ma-fiche",                       // identifiant dans l'adresse
  title: "Titre de la fiche",
  subtitle: "Sous-titre",
  tags: ["Mot-clé 1", "Mot-clé 2"],
  sections: [
    S("Particularités", [ul("Point 1", "Point 2")]),
    S("Antibioprophylaxie", [kv(["Molécule", "Céfazoline 2 g IV"], ["Allergie", "Clindamycine 900 mg IV"])]),
    S("Points critiques", [warn("Texte d'alerte"), ul("…")]),
    S("Tableau", [tbl(["Colonne 1", "Colonne 2"], [["a", "b"], ["c", "d"]])], { wide: true })
  ],
  refs: ["Référence 1", "Référence 2"]
}
```

`S` crée une carte, `ul` une liste, `kv` des paires clé/valeur, `tbl` un tableau, `warn`, `danger`, `info`, `ok` des encadrés colorés. Ajouter `{ wide: true }` pour une carte pleine largeur.

### Après l'ajout ou la suppression de fichiers

La liste des fichiers disponibles hors connexion est régénérée automatiquement à chaque publication. En local : `python3 scripts/build_sw.py`.

---

## 4. Version en un seul fichier

`python3 scripts/build_single.py` produit `dist/rea-chir-p17.html` : toute la plateforme (images comprises) dans un seul fichier HTML, qui s'ouvre directement dans un navigateur, sans connexion ni installation. Pratique pour la partager par message ou la consulter sur un poste sans accès à Internet.

## 5. Vérifier les calculs

```bash
node tests/calc.test.js
```

Les formules (poids idéal, P/F, débit cardiaque, osmolarité, CKD-EPI 2021, KDIGO, SOFA, PSE, doses d'anesthésiques locaux…) sont testées sur des valeurs de référence.

---

## 6. Origine des contenus

- Les fiches d'anesthésie, d'analgésie, de SSPI et d'antibiothérapie ont été rédigées d'après les recommandations de la SFAR, de la SPILF, de la HAS et d'autres références francophones et internationales citées en bas de chaque fiche. **Elles doivent être relues et validées par l'équipe médicale du service** avant usage clinique, et confrontées à l'écologie bactérienne locale.
- Les fiches-mémos d'échographie et certaines planches d'antibiothérapie (classifications, mécanismes de résistance), et le tableau d'adaptation rénale proviennent de la plateforme dont ce site s'inspire ; le dépôt d'origine ne précisant pas de licence, obtenir l'accord de son auteur avant diffusion.

Outil d'aide à la décision : il ne remplace pas le jugement clinique.
