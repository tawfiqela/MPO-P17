/* =====================================================================
   Blocs analgésiques : outil chirurgie → intervention → bloc recommandé,
   et une fiche par bloc avec vue échographique annotée (schémas originaux,
   scripts/bloc_figures.py). Recommandations : PROSPECT (ESRA), ERAS, SFAR.
   ===================================================================== */
(function () {
  const { S, ul, kv, tbl, warn, danger, info, ok } = P17.h;
  const F = window.P17Calc;
  const f = P17.fmt;
  const SEC = "Blocs analgésiques";
  const ROOT = "#/blocs";
  const POSTOP = ["Post-opératoire", "#/postop"];
  const IMG = id => `assets/img/blocs/${id}.webp`;
  const NYSORA = `<a href="https://www.nysora.com" target="_blank" rel="noopener">NYSORA</a>`;
  const REF_PROSPECT = "PROSPECT (ESRA) : recommandations d'analgésie spécifiques de chaque intervention, www.esraeurope.org/prospect";
  const REF_SFAR = "RFE SFAR 2016 : Réactualisation de la recommandation sur la douleur postopératoire ; RFE SFAR : Anesthésie locorégionale périnerveuse";
  const REF_ESAIC = "Kietaibl S et al. Regional anaesthesia in patients on antithrombotic drugs: joint ESAIC/ESRA guidelines. Eur J Anaesthesiol 2022";
  const REF_NYSORA = "NYSORA : techniques d'anesthésie locorégionale échoguidée (www.nysora.com)";

  /* ---------------- Les blocs ---------------- */
  const BLOCS = [
    { id: "tap", nom: "TAP (plan du transverse de l'abdomen)", court: "TAP", region: "Paroi abdominale", risque: "superficiel", vol: 20, bilat: true,
      indications: ["Cœlioscopie (cholécystectomie, colectomie, hystérectomie, prostatectomie robot)", "Incision sous-ombilicale latérale, appendicectomie, greffe rénale (côté de l'incision)", "Approche sous-costale : incisions sus-ombilicales, chirurgie hépatobiliaire"],
      cible: "Nerfs thoraco-abdominaux T7–L1 dans le plan entre l'oblique interne et le transverse de l'abdomen. Approche latérale : T10–T12 ; sous-costale : T6–T9.",
      installation: "Décubitus dorsal. Sonde linéaire (convexe si obèse) transversale sur la ligne axillaire moyenne, entre rebord costal et crête iliaque ; sous-costale : parallèle au rebord costal.",
      technique: ["Identifier de haut en bas : oblique externe, oblique interne, transverse, puis péritoine et anses mobiles", "Aiguille dans le plan, de médial vers latéral (ou d'avant en arrière)", "Hydrodissection pour confirmer le plan, puis injection : lentille anéchogène entre oblique interne et transverse"],
      volume: "15–20 mL par côté de ropivacaïne 0,2–0,375 % ; bilatéral si incision médiane ou cœlioscopie", duree: "6 à 12 h",
      complications: ["Analgésie pariétale seulement, pas viscérale", "Ponction péritonéale ou viscérale, hépatique à droite (approche sous-costale)", "Toxicité systémique en bilatéral : calculer la dose totale"] },
    { id: "gaine-droits", nom: "Bloc de la gaine des droits", court: "Gaine des droits", region: "Paroi abdominale", risque: "superficiel", vol: 15, bilat: true,
      indications: ["Laparotomie médiane, incision ombilicale, cure d'éventration", "Cathéters bilatéraux en alternative à la péridurale"],
      cible: "Branches antérieures des nerfs T7–T11 entre le muscle droit de l'abdomen et le feuillet postérieur de sa gaine.",
      installation: "Décubitus dorsal. Sonde linéaire transversale, paramédiane, au-dessus ou au niveau de l'ombilic.",
      technique: ["Repérer le muscle droit, ovale, et le feuillet postérieur hyperéchogène en dessous", "Repérer l'artère épigastrique au Doppler pour l'éviter", "Aiguille dans le plan, injection entre muscle et feuillet postérieur"],
      volume: "10–15 mL par côté, toujours bilatéral pour une incision médiane", duree: "6 à 10 h ; cathéters 48–72 h",
      complications: ["Ponction de l'artère épigastrique, hématome de paroi", "Ponction péritonéale sous l'arcade de Douglas (feuillet postérieur absent)"] },
    { id: "ilio-inguinal", nom: "Bloc ilio-inguinal et ilio-hypogastrique", court: "Ilio-inguinal", region: "Paroi abdominale", risque: "superficiel", vol: 10, bilat: false,
      indications: ["Cure de hernie inguinale", "Incision de Pfannenstiel, chirurgie inguinale et scrotale"],
      cible: "Nerfs ilio-inguinal et ilio-hypogastrique entre l'oblique interne et le transverse, en dedans de l'épine iliaque antéro-supérieure.",
      installation: "Décubitus dorsal. Sonde linéaire sur la ligne EIAS–ombilic, bord latéral sur l'EIAS.",
      technique: ["Repérer l'EIAS (os avec cône d'ombre) et les trois couches musculaires", "Les deux nerfs apparaissent comme deux petits ovales entre oblique interne et transverse, souvent près de l'artère circonflexe iliaque profonde", "Injection dans ce plan autour des nerfs"],
      volume: "10 mL de ropivacaïne 0,375 %", duree: "6 à 10 h",
      complications: ["Bloc fémoral transitoire (faiblesse du quadriceps) : prudence au premier lever", "Ponction digestive si trop profond"] },
    { id: "carre-lombes", nom: "Bloc du carré des lombes (QL)", court: "Carré des lombes", region: "Paroi abdominale", risque: "profond", vol: 25, bilat: false,
      indications: ["Néphrectomie, lombotomie, NLPC", "Chirurgie abdominale haute ou basse, cytoréduction (bilatéral)", "Hanche (approche antérieure)"],
      cible: "Fascia thoracolombaire autour du carré des lombes ; diffusion paravertébrale variable (T7–L1).",
      installation: "Décubitus latéral. Sonde convexe transversale au flanc, au-dessus de la crête iliaque, glissée en arrière jusqu'au « trèfle » : psoas en avant, érecteurs en arrière, carré des lombes en dehors du processus transverse de L4.",
      technique: ["QL2 (postérieur) : injection à la face postérieure du carré des lombes", "QL3 (antérieur, transmusculaire) : aiguille à travers le carré des lombes, injection entre carré des lombes et psoas", "Diffusion en lentille le long du fascia"],
      volume: "20–30 mL par côté de ropivacaïne 0,2–0,375 %", duree: "12 à 24 h",
      complications: ["Bloc profond : hématome rétropéritonéal, ponction rénale", "Faiblesse du quadriceps (diffusion au plexus lombaire, surtout QL3)", "Hypotension en bilatéral"] },
    { id: "esp", nom: "Bloc du plan des érecteurs du rachis (ESP)", court: "ESP", region: "Tronc et thorax", risque: "superficiel", vol: 25, bilat: false,
      indications: ["Thoracoscopie, thoracotomie, fractures de côtes", "Chirurgie du sein", "Chirurgie du rachis (bilatéral), lombotomie, néphrectomie", "Chirurgie abdominale haute (T7–T8, bilatéral)"],
      cible: "Plan entre les muscles érecteurs du rachis et les processus transverses ; diffusion craniocaudale sur plusieurs niveaux et vers l'espace paravertébral.",
      installation: "Assis, en décubitus latéral ou ventral. Sonde linéaire parasagittale à 3 cm de la ligne médiane, au niveau choisi (T5 pour le thorax, T7–T8 pour l'abdomen haut, L1–L3 pour le rachis lombaire).",
      technique: ["Distinguer les processus transverses (lignes plates et carrées) des côtes (arrondies, plèvre visible entre elles)", "Aiguille dans le plan, de haut en bas, jusqu'au contact osseux du processus transverse", "L'anesthésique local décolle les érecteurs de l'os sur plusieurs centimètres"],
      volume: "20–30 mL de ropivacaïne 0,375 % par côté ; cathéter possible (0,2 %, 6–8 mL/h ou bolus programmés)", duree: "12 à 24 h",
      complications: ["Technique simple et sûre, à distance de la plèvre et des vaisseaux", "Efficacité variable selon la diffusion", "Toxicité systémique si bilatéral avec gros volumes"] },
    { id: "paravertebral", nom: "Bloc paravertébral thoracique", court: "Paravertébral", region: "Tronc et thorax", risque: "profond", vol: 20, bilat: false,
      indications: ["Thoracotomie (cathéter), thoracoscopie", "Mastectomie, curage axillaire", "Fractures de côtes unilatérales, néphrectomie"],
      cible: "Espace paravertébral : nerfs spinaux et chaîne sympathique, entre plèvre pariétale, ligament costotransversaire supérieur et corps vertébral.",
      installation: "Assis ou en décubitus latéral. Sonde linéaire parasagittale paramédiane (entre deux processus transverses) ou transversale entre deux côtes.",
      technique: ["Repérer deux processus transverses, le ligament costotransversaire et la plèvre entre eux", "Aiguille dans le plan à travers le ligament", "Injection : abaissement visible de la plèvre (signe d'une bonne position)"],
      volume: "15–20 mL (0,3 mL/kg) de ropivacaïne 0,375 % à un niveau, ou 5 mL sur plusieurs niveaux ; cathéter : ropivacaïne 0,2 % 0,1 mL/kg/h", duree: "12 à 24 h ; cathéter 48–72 h",
      complications: ["Pneumothorax (rare, < 1 %), ponction vasculaire", "Diffusion péridurale, hypotension", "Bloc profond : respecter les délais des antithrombotiques"] },
    { id: "dentele", nom: "Bloc du plan du dentelé antérieur", court: "Dentelé antérieur", region: "Tronc et thorax", risque: "superficiel", vol: 25, bilat: false,
      indications: ["Thoracoscopie, drains thoraciques", "Fractures de côtes antérolatérales", "Chirurgie du sein (partie latérale)"],
      cible: "Branches cutanées latérales des nerfs intercostaux T2–T9, dans le plan superficiel (entre grand dorsal et dentelé) ou profond (entre dentelé et côte).",
      installation: "Décubitus dorsal ou latéral, bras en abduction. Sonde linéaire sur la ligne axillaire moyenne, au niveau de la 4e–5e côte.",
      technique: ["Repérer grand dorsal, dentelé antérieur, côtes et plèvre", "Aiguille dans le plan, injection au-dessus (superficiel) ou en dessous (profond) du dentelé"],
      volume: "20–30 mL de ropivacaïne 0,2–0,375 %", duree: "8 à 12 h",
      complications: ["Pas de bloc des branches antérieures ni postérieures : analgésie incomplète des incisions antérieures", "Pneumothorax si l'aiguille franchit l'espace intercostal"] },
    { id: "pecs", nom: "Blocs pectoraux (PECS I et II)", court: "PECS", region: "Tronc et thorax", risque: "superficiel", vol: 30, bilat: false,
      indications: ["Mastectomie, curage axillaire, ganglion sentinelle (PECS II)", "Prothèse mammaire, chirurgie du muscle pectoral (PECS I)", "Chambre implantable, pacemaker"],
      cible: "PECS I : nerfs pectoraux médial et latéral entre grand et petit pectoral. PECS II : en plus, branches latérales T2–T6 et nerf intercostobrachial entre petit pectoral et dentelé.",
      installation: "Décubitus dorsal, bras en abduction. Sonde linéaire sous la clavicule (repérer l'artère thoraco-acromiale) puis glissée latéralement jusqu'à la 3e–4e côte.",
      technique: ["PECS I : 10 mL entre grand et petit pectoral, près de la branche pectorale de l'artère thoraco-acromiale", "PECS II : 20 mL entre petit pectoral et dentelé antérieur, au niveau de la 3e–4e côte"],
      volume: "10 mL (PECS I) + 20 mL (PECS II) de ropivacaïne 0,2–0,375 %", duree: "8 à 12 h",
      complications: ["Ponction vasculaire (artère thoraco-acromiale)", "Pneumothorax exceptionnel", "N'anesthésie pas la partie interne du sein (branches antérieures) : compléter par une infiltration"] },
    { id: "fascia-iliaca", nom: "Bloc ilio-fascial supra-inguinal (fascia iliaca)", court: "Fascia iliaca", region: "Membre inférieur", risque: "superficiel", vol: 40, bilat: false,
      indications: ["Fracture du col du fémur (avant et après la chirurgie)", "Prothèse de hanche, fracture du fémur proximal"],
      cible: "Nerfs fémoral et cutané latéral de la cuisse (± obturateur) sous le fascia iliaca, au-dessus du ligament inguinal.",
      installation: "Décubitus dorsal. Sonde linéaire parasagittale médiale à l'EIAS, au-dessus du ligament inguinal : aspect en « nœud papillon » (oblique interne et sartorius).",
      technique: ["Repérer le muscle iliaque, le fascia iliaca hyperéchogène et l'artère circonflexe iliaque profonde", "Aiguille dans le plan, de bas en haut", "Injection sous le fascia iliaca, qui se décolle en direction céphalique"],
      volume: "30–40 mL de ropivacaïne 0,2 %", duree: "8 à 12 h",
      complications: ["Faiblesse du quadriceps : risque de chute au lever", "Gros volume : calculer la dose totale chez le sujet âgé de petit poids"] },
    { id: "peng", nom: "Bloc PENG (groupe nerveux péricapsulaire)", court: "PENG", region: "Membre inférieur", risque: "superficiel", vol: 20, bilat: false,
      indications: ["Fracture de hanche", "Prothèse totale de hanche (analgésie avec préservation motrice)"],
      cible: "Branches articulaires antérieures de la hanche (nerfs fémoral, obturateur accessoire) entre le tendon du psoas et la branche iliopubienne.",
      installation: "Décubitus dorsal. Sonde convexe transversale sous l'EIAS, tournée de 45° pour s'aligner sur la branche iliopubienne.",
      technique: ["Repérer l'épine iliaque antéro-inférieure, l'éminence iliopubienne, le tendon du psoas et l'artère fémorale en dedans", "Aiguille dans le plan, de latéral vers médial, jusqu'au contact osseux sous le tendon du psoas", "Injection : le tendon se soulève"],
      volume: "20 mL de ropivacaïne 0,375–0,5 %", duree: "12 à 24 h",
      complications: ["Bloc moteur rare mais possible à fort volume", "Ponction de l'artère fémorale si trop médial"] },
    { id: "femoral", nom: "Bloc fémoral", court: "Fémoral", region: "Membre inférieur", risque: "superficiel", vol: 15, bilat: false,
      indications: ["Fracture du fémur, chirurgie de la cuisse et du genou (si canal des adducteurs impossible)"],
      cible: "Nerf fémoral, latéral à l'artère fémorale, sous le fascia iliaca.",
      installation: "Décubitus dorsal. Sonde linéaire transversale au pli inguinal.",
      technique: ["Repérer artère et veine fémorales, le fascia lata et le fascia iliaca", "Le nerf est un triangle hyperéchogène en dehors de l'artère, sous le fascia iliaca", "Injection sous le fascia iliaca, autour du nerf"],
      volume: "10–20 mL de ropivacaïne 0,2–0,375 %", duree: "8 à 16 h",
      complications: ["Bloc moteur du quadriceps : chute au lever", "Ponction vasculaire"] },
    { id: "canal-adducteurs", nom: "Bloc du canal des adducteurs", court: "Canal des adducteurs", region: "Membre inférieur", risque: "superficiel", vol: 15, bilat: false,
      indications: ["Prothèse totale de genou (avec infiltration périarticulaire)", "Ligamentoplastie, arthroscopie du genou", "Chirurgie de la face médiale de la jambe (nerf saphène)"],
      cible: "Nerf saphène et branches pour le genou, avec l'artère fémorale superficielle sous le sartorius.",
      installation: "Décubitus dorsal, cuisse en rotation externe. Sonde linéaire transversale à mi-cuisse, face antéromédiale.",
      technique: ["Repérer le sartorius (trapèze), l'artère fémorale superficielle en dessous, le vaste médial et le long adducteur", "Aiguille dans le plan, injection autour de l'artère, sous le sartorius"],
      volume: "15–20 mL de ropivacaïne 0,2–0,375 %", duree: "12 à 24 h",
      complications: ["Préserve en grande partie le quadriceps", "Ponction artérielle"] },
    { id: "sciatique-poplite", nom: "Bloc sciatique poplité", court: "Sciatique poplité", region: "Membre inférieur", risque: "superficiel", vol: 20, bilat: false,
      indications: ["Chirurgie du pied et de la cheville, fractures de la jambe distale", "Associer un bloc saphène pour la face médiale"],
      cible: "Nerf sciatique à sa bifurcation en nerfs tibial et fibulaire commun, sous le paraneurium commun.",
      installation: "Décubitus latéral, ventral, ou dorsal jambe surélevée. Sonde linéaire transversale au creux poplité.",
      technique: ["Repérer l'artère poplitée, puis le nerf tibial superficiel à l'artère", "Remonter jusqu'à la bifurcation (5 à 10 cm au-dessus du pli)", "Aiguille dans le plan, de latéral vers médial, injection sous le paraneurium entre les deux nerfs"],
      volume: "20 mL de ropivacaïne 0,375 %", duree: "12 à 24 h",
      complications: ["Masque un syndrome des loges : surveillance clinique dans les fractures de jambe", "Protéger le membre insensible"] },
    { id: "interscalenique", nom: "Bloc interscalénique", court: "Interscalénique", region: "Membre supérieur", risque: "superficiel", vol: 12, bilat: false,
      indications: ["Chirurgie de l'épaule, fracture de l'humérus proximal", "Chirurgie de la clavicule (associé au plexus cervical superficiel)"],
      cible: "Racines C5–C7 entre les scalènes antérieur et moyen (« feu tricolore »).",
      installation: "Décubitus dorsal tête tournée, ou semi-assis. Sonde linéaire transversale au niveau de C6, en dehors du sterno-cléido-mastoïdien.",
      technique: ["Repérer carotide et veine jugulaire interne, puis glisser latéralement jusqu'aux racines entre les scalènes", "Aiguille dans le plan, de latéral vers médial", "Injection autour des racines, en dehors du paraneurium"],
      volume: "10–15 mL de ropivacaïne 0,375–0,5 % (volumes réduits pour limiter la parésie phrénique)", duree: "12 à 18 h",
      complications: ["Parésie phrénique homolatérale quasi constante : contre-indiqué si insuffisance respiratoire ou paralysie diaphragmatique controlatérale", "Syndrome de Claude Bernard-Horner, voix rauque", "Alternative préservant le diaphragme : bloc suprascapulaire + nerf axillaire, ou bloc du tronc supérieur"] },
    { id: "supraclaviculaire", nom: "Bloc supraclaviculaire", court: "Supraclaviculaire", region: "Membre supérieur", risque: "superficiel", vol: 25, bilat: false,
      indications: ["Chirurgie du bras, du coude, de l'avant-bras et de la main", "Fracture de l'humérus distal"],
      cible: "Troncs et divisions du plexus brachial, en dehors de l'artère sous-clavière, au-dessus de la première côte.",
      installation: "Décubitus dorsal, tête tournée. Sonde linéaire dans la fosse supraclaviculaire, parallèle à la clavicule.",
      technique: ["Repérer l'artère sous-clavière, la première côte et la plèvre", "Plexus en « grappe de raisin » en dehors et au-dessus de l'artère", "Aiguille dans le plan, de latéral vers médial ; injection d'abord au « coin » (artère–première côte) puis dans le plexus"],
      volume: "20–30 mL de ropivacaïne 0,375 %", duree: "10 à 16 h",
      complications: ["Pneumothorax (aiguille toujours visible, au-dessus de la côte)", "Parésie phrénique (moins fréquente qu'en interscalénique)", "Ponction artérielle"] },
    { id: "axillaire", nom: "Bloc axillaire", court: "Axillaire", region: "Membre supérieur", risque: "superficiel", vol: 20, bilat: false,
      indications: ["Chirurgie de la main, du poignet et de l'avant-bras"],
      cible: "Nerfs médian, ulnaire et radial autour de l'artère axillaire ; nerf musculocutané dans le coracobrachial.",
      installation: "Décubitus dorsal, bras à 90° d'abduction. Sonde linéaire transversale au creux axillaire.",
      technique: ["Repérer l'artère axillaire (veines compressibles autour) et le tendon conjoint en profondeur", "Injecter 5 mL autour de chaque nerf : radial (souvent sous l'artère), ulnaire, médian", "Musculocutané : 3–5 mL dans le coracobrachial"],
      volume: "15–25 mL de ropivacaïne ou lidocaïne (5 mL par nerf)", duree: "Selon la molécule : 2 à 4 h (lidocaïne) à 12 h (ropivacaïne)",
      complications: ["Ponction vasculaire (site compressible)", "Site superficiel et compressible : risque hémorragique faible"] },
    { id: "scalp", nom: "Bloc du scalp", court: "Scalp", region: "Tête", risque: "superficiel", vol: 20, bilat: true, noimg: true,
      indications: ["Craniotomie (dont craniotomie éveillée)", "Pose de têtière à pointes : limite la réponse hémodynamique", "Analgésie postopératoire de la craniotomie"],
      cible: "Six nerfs de chaque côté : supraorbitaire, supratrochléaire, zygomaticotemporal, auriculotemporal, grand et petit occipitaux.",
      installation: "Repères anatomiques (sans échographie), avant la pose de la têtière ou en fin d'intervention.",
      technique: ["Supraorbitaire et supratrochléaire : au-dessus du sourcil, à l'échancrure supraorbitaire", "Zygomaticotemporal : bord latéral de l'orbite", "Auriculotemporal : 1–1,5 cm en avant du tragus, en arrière de l'artère temporale superficielle (aspiration)", "Grand et petit occipitaux : le long de la ligne nucale supérieure, entre protubérance occipitale et mastoïde"],
      volume: "2–5 mL par site, ropivacaïne 0,375–0,5 % (± adrénaline) ; 20–30 mL au total", duree: "6 à 12 h",
      complications: ["Injection intra-artérielle (artère temporale superficielle, occipitale)", "Paralysie faciale transitoire (auriculotemporal trop profond)", "Calculer la dose totale bilatérale"] }
  ];
  const BY = Object.fromEntries(BLOCS.map(b => [b.id, b]));
  const link = id => `<a href="${ROOT}/${id}">${BY[id] ? BY[id].court : id}</a>`;

  /* ---------------- Interventions → blocs ---------------- */
  // p : bloc(s) de première intention ; alt : alternatives ; bil : bilatéral ; txt : autres options (sans fiche)
  const CHIR = {
    visc: { label: "Chirurgie viscérale", items: [
      ["chole", "Cholécystectomie par cœlioscopie", { p: ["tap"], bil: true, txt: "Infiltration des orifices de trocart (recommandée par PROSPECT) ; TAP sous-costal bilatéral si infiltration impossible" }],
      ["colo-c", "Colectomie, rectum par cœlioscopie", { p: ["tap"], alt: ["gaine-droits"], bil: true, txt: "Alternative sans bloc : lidocaïne IV (ERAS) ; morphine intrathécale possible" }],
      ["laparo", "Laparotomie médiane (côlon, estomac, pancréas)", { p: ["gaine-droits"], alt: ["esp", "carre-lombes"], bil: true, txt: "<a href=\"#/anesthesie/thoracique/peridurale-thoracique\">Péridurale thoracique</a> T7–T10 (référence) ou cathéters de gaine des droits ou de cicatrice" }],
      ["hepato", "Hépatectomie, incision sous-costale", { p: ["tap"], alt: ["esp"], bil: true, txt: "TAP sous-costal ; péridurale thoracique selon l'hémostase (risque de coagulopathie postopératoire)" }],
      ["hernie", "Hernie inguinale", { p: ["ilio-inguinal"], alt: ["tap"], txt: "Infiltration par le chirurgien" }],
      ["paroi", "Éventration, paroi abdominale", { p: ["gaine-droits"], alt: ["tap"], bil: true }],
      ["bari", "Chirurgie bariatrique par cœlioscopie", { p: ["tap"], alt: ["esp"], bil: true, txt: "Infiltration des orifices ; épargne morphinique stricte (SAOS)" }]
    ] },
    uro: { label: "Urologie", items: [
      ["prosta", "Prostatectomie robot-assistée", { p: ["tap"], bil: true, txt: "Infiltration des orifices" }],
      ["nephrec", "Néphrectomie (lombotomie, cœlioscopie)", { p: ["esp"], alt: ["carre-lombes", "paravertebral"], txt: "Cœlioscopie : TAP homolatéral possible" }],
      ["cysto", "Cystectomie avec dérivation", { p: ["esp"], alt: ["gaine-droits", "carre-lombes"], bil: true, txt: "Péridurale thoracique selon l'équipe" }],
      ["nlpc", "Néphrolithotomie percutanée", { p: ["esp"], alt: ["paravertebral", "carre-lombes"] }],
      ["greffe", "Transplantation rénale", { p: ["tap"], alt: ["carre-lombes"], txt: "Bloc du côté de l'incision ; éviter AINS et morphine à doses élevées" }],
      ["rtu", "RTUP, RTUV, urétéroscopie", { p: [], txt: "Pas de bloc postopératoire utile : rachianesthésie ou AG ; bloc obturateur peropératoire pour une RTUV latérale" }]
    ] },
    gyn: { label: "Gynécologie et sein", items: [
      ["tumo", "Tumorectomie, ganglion sentinelle", { p: ["pecs"], alt: ["esp"], txt: "PECS I ou PECS II selon l'abord ; infiltration de la cicatrice" }],
      ["mast", "Mastectomie ± curage axillaire", { p: ["pecs", "paravertebral"], alt: ["esp", "dentele"], txt: "PROSPECT : PECS II ou paravertébral" }],
      ["hyst-c", "Hystérectomie par cœlioscopie", { p: ["tap"], bil: true, txt: "Infiltration des orifices" }],
      ["hyst-l", "Hystérectomie par laparotomie", { p: ["tap"], alt: ["ilio-inguinal"], bil: true, txt: "Morphine intrathécale possible" }],
      ["cyto", "Cytoréduction, laparotomie xypho-pubienne", { p: ["esp"], alt: ["gaine-droits", "carre-lombes"], bil: true, txt: "Péridurale thoracique (référence)" }],
      ["vulve", "Vulvectomie", { p: [], txt: "Infiltration, bloc pudendal (hors fiche) ; analgésie multimodale" }]
    ] },
    thor: { label: "Chirurgie thoracique", items: [
      ["vats", "Thoracoscopie (VATS, robot)", { p: ["paravertebral", "esp"], alt: ["dentele"], txt: "La péridurale n'est pas recommandée en thoracoscopie (PROSPECT 2022)" }],
      ["thoraco", "Thoracotomie", { p: ["paravertebral"], alt: ["esp"], txt: "Paravertébral continu ou péridurale thoracique T5–T6" }],
      ["drain", "Drain thoracique, fractures de côtes", { p: ["dentele"], alt: ["esp", "paravertebral"] }],
      ["sterno", "Sternotomie, médiastin", { p: [], txt: "Blocs parasternaux (plan du transverse du thorax) et infiltration ; ESP bilatéral en alternative" }]
    ] },
    neuro: { label: "Neurochirurgie", items: [
      ["crane", "Craniotomie", { p: ["scalp"], bil: true, txt: "Ou infiltration du site opératoire par le chirurgien" }],
      ["rachis", "Chirurgie du rachis lombaire", { p: ["esp"], bil: true, txt: "Infiltration ; méthadone ou kétamine peropératoire en chirurgie lourde" }]
    ] },
    ortho: { label: "Traumatologie et orthopédie", items: [
      ["col", "Fracture du col du fémur", { p: ["fascia-iliaca"], alt: ["peng", "femoral"], txt: "Bloc dès l'arrivée aux urgences puis avant l'installation" }],
      ["pth", "Prothèse totale de hanche", { p: ["peng"], alt: ["fascia-iliaca"], txt: "Infiltration périarticulaire par le chirurgien" }],
      ["femur", "Fémur (diaphyse)", { p: ["fascia-iliaca"], alt: ["femoral"] }],
      ["genou", "Prothèse de genou, ligamentoplastie", { p: ["canal-adducteurs"], alt: ["femoral"], txt: "Associer l'infiltration périarticulaire (± bloc IPACK)" }],
      ["pied", "Jambe distale, cheville, pied", { p: ["sciatique-poplite"], alt: ["canal-adducteurs"], txt: "Ajouter le saphène (canal des adducteurs) pour la face médiale" }],
      ["epaule", "Épaule, humérus proximal", { p: ["interscalenique"], alt: ["supraclaviculaire"], txt: "Insuffisance respiratoire : bloc suprascapulaire + nerf axillaire" }],
      ["mb-sup", "Coude, avant-bras, main", { p: ["supraclaviculaire", "axillaire"] }],
      ["bassin", "Bassin, acétabulum", { p: ["fascia-iliaca"], alt: ["carre-lombes", "esp"] }],
      ["rachis-o", "Rachis (arthrodèse)", { p: ["esp"], bil: true }]
    ] },
    endo: { label: "Endoscopie digestive", items: [
      ["endo", "Endoscopie diagnostique ou interventionnelle", { p: [], txt: "Sédation : pas de bloc indiqué" }]
    ] }
  };

  const fieldsSpec = Object.entries(CHIR).map(([k, sp]) => ({ id: "i_" + k, label: "Intervention", type: "select", full: true, options: sp.items.map(it => [it[0], it[1]]), showIf: v => v.spec === k }));
  const tool = P17.calc({
    id: "blocs", kind: "tool", title: "Quel bloc pour quelle intervention ?",
    desc: "Choisir la chirurgie et l'intervention ; le poids permet de vérifier la dose d'anesthésique local.",
    fields: [
      { id: "spec", label: "Chirurgie", type: "select", full: true, options: Object.entries(CHIR).map(([k, sp]) => [k, sp.label]) },
      ...fieldsSpec,
      { id: "poids", label: "Poids (idéal si obèse)", unit: "kg", placeholder: "ex. 70" },
      { id: "conc", label: "Ropivacaïne", type: "seg", options: [["0.2", "0,2 %"], ["0.375", "0,375 %"], ["0.5", "0,5 %"]], value: "0.375" },
      { id: "at", label: "Antithrombotique en cours ou coagulopathie", type: "check", full: true }
    ],
    compute(v) {
      const sp = CHIR[v.spec]; if (!sp) return null;
      const it = sp.items.find(x => x[0] === v["i_" + v.spec]) || sp.items[0];
      const r = it[2];
      const prim = (r.p || []).map(id => BY[id]).filter(Boolean);
      const alt = (r.alt || []).map(id => BY[id]).filter(Boolean);
      const lines = [];
      prim.forEach(b => {
        const bil = r.bil && b.bilat !== false ? 2 : 1;
        lines.push(`<li><b><a href="${ROOT}/${b.id}">${b.nom}</a></b>${bil === 2 ? " · <b>bilatéral</b>" : ""}<br><span class="out-sub" style="display:inline">${b.volume}</span>${v.at ? (b.risque === "profond" ? `<br><span class="risk risk--e">Bloc profond</span> <span class="out-sub" style="display:inline">respecter les délais des antithrombotiques ; préférer un bloc superficiel</span>` : `<br><span class="risk risk--f">Bloc superficiel</span> <span class="out-sub" style="display:inline">site compressible, risque hémorragique faible : possible après évaluation bénéfice-risque</span>`) : ""}</li>`);
      });
      let dose = "";
      const P = v.poids;
      if (P && prim.length) {
        const m = F.doseMaxAL("ropivacaine", P);
        const c = parseFloat(v.conc || "0.375");
        const b = prim[0];
        const bil = r.bil && b.bilat !== false ? 2 : 1;
        const mg = b.vol * bil * c * 10;
        const okDose = mg <= m.mg;
        dose = `<dl class="out-rows"><div><dt>Dose maximale (ropivacaïne 3 mg/kg)</dt><dd>${f(m.mg, 0)} mg</dd></div>
          <div><dt>${b.court} : ${b.vol} mL${bil === 2 ? " × 2" : ""} à ${String(c).replace(".", ",")} %</dt><dd>${f(mg, 0)} mg</dd></div></dl>
          <p class="out-sub">${okDose ? "Dose compatible ; additionner les infiltrations du chirurgien." : `<b>Dose excessive</b> : réduire la concentration ou le volume (volume maximal à ${String(c).replace(".", ",")} % : ${f(m.mg / (c * 10), 0)} mL au total).`}</p>`;
      }
      return {
        tone: prim.length ? "ok" : "warn",
        html: `<div class="out-label">${P17.esc(it[1])}</div>
          <div class="out-main" style="margin-top:4px">${prim.length ? prim.map(b => b.court).join(" ou ") : "Pas de bloc spécifique"}</div>
          ${lines.length ? `<h4>Bloc recommandé</h4><ul class="rx">${lines.join("")}</ul>` : ""}
          ${alt.length ? `<h4>Alternatives</h4><ul class="rx"><li>${alt.map(b => `<a href="${ROOT}/${b.id}">${b.nom}</a>`).join(" · ")}</li></ul>` : ""}
          ${r.txt ? `<h4>À savoir</h4><ul class="rx"><li>${r.txt}</li></ul>` : ""}
          ${dose}
          <h4>Toujours</h4><ul class="rx"><li>Socle multimodal : paracétamol, AINS si possible, dexaméthasone ; morphine de secours</li></ul>`
      };
    },
    note: "<p>Propositions d'après PROSPECT (ESRA), ERAS et la SFAR ; à adapter au patient, au chirurgien et à l'expérience de l'équipe.</p>"
  });

  /* ---------------- Dose maximale et toxicité systémique ---------------- */
  const alCalc = P17.calc({
    id: "alMax", title: "Dose maximale d'anesthésique local", desc: "Utiliser le poids idéal chez l'obèse ; cumuler toutes les injections (bloc, infiltration, lidocaïne IV)",
    fields: [{ id: "mol", label: "Molécule", type: "select", options: [["ropivacaine", "Ropivacaïne"], ["bupivacaine", "Bupivacaïne"], ["levobupivacaine", "Lévobupivacaïne"], ["lidocaine", "Lidocaïne"], ["mepivacaine", "Mépivacaïne"]] },
      { id: "adre", label: "Avec adrénaline (lidocaïne)", type: "check", showIf: v => v.mol === "lidocaine" },
      { id: "poids", label: "Poids", unit: "kg" }, { id: "conc", label: "Concentration", unit: "%", placeholder: "0,375" }],
    compute: v => {
      const r = F.doseMaxAL(v.mol, v.poids, v.adre);
      if (!r) return null;
      const rows = [["Base de calcul", `${f(r.mgkg, 1)} mg/kg, plafond ${r.plafond} mg`]];
      if (v.conc) rows.push(["Volume maximal", `${f(r.mg / (v.conc * 10), 0)} mL à ${f(v.conc, 3)} %`]);
      return { label: "Dose maximale", main: `${f(r.mg, 0)} mg`, rows };
    },
    note: "Doses indicatives en injection unique ; réduire chez le sujet âgé, l'insuffisant cardiaque ou hépatique, et pour les sites très vasculaires (intercostal, ESP bilatéral)."
  });
  const lipCalc = P17.calc({
    id: "lipid", title: "Émulsion lipidique 20 % (toxicité systémique)", desc: "Dès les premiers signes neurologiques ou cardiovasculaires graves",
    fields: [{ id: "poids", label: "Poids", unit: "kg" }],
    compute: v => {
      const r = F.intralipide(v.poids); if (!r) return null;
      return { label: "Bolus", main: `${f(r.bolus, 0)} mL en 2–3 min`, rows: [["Puis perfusion", r.perf], ["Dose cumulée maximale", `≈ ${f(r.max, 0)} mL (12 mL/kg)`]], tone: "danger", sub: "Répéter le bolus (1 à 2 fois) si instabilité persistante ; doubler le débit si besoin" };
    }
  });
  const REF_LAST = "ASRA 2020 : Checklist for treatment of local anesthetic systemic toxicity (Neal JM et al., Reg Anesth Pain Med 2021)";

  /* ---------------- Pages ---------------- */
  const blocTile = b => ({ href: `${ROOT}/${b.id}`, title: b.court, desc: b.region + (b.risque === "profond" ? " · bloc profond" : ""), img: b.noimg ? null : IMG(b.id), icon: "analgesie", accent: "analgesie" });
  const regions = [...new Set(BLOCS.map(b => b.region))];

  const hub = () => `
      <div class="page accent-analgesie">
        <div class="page-head">${P17.backLink("#/postop", "Post-opératoire")}${P17.crumbs([POSTOP, [SEC, ROOT]])}</div>
        ${P17.fiche({
          kicker: "Post-opératoire", accent: "analgesie", title: "Blocs analgésiques",
          subtitle: "Choisir le bloc selon l'intervention, puis la fiche technique de chaque bloc avec sa vue échographique",
          tags: ["Échoguidage", "PROSPECT", "Dose maximale", "Toxicité systémique"],
          tool, toolLabel: "Outil de choix",
          sections: [
            ...regions.map(rg => S(rg, [{ html: P17.tiles(BLOCS.filter(b => b.region === rg).map(blocTile)) }], { wide: true })),
            S("Avant tout bloc (bloc opératoire ou SSPI)", [ul("Consentement oral tracé ; en SSPI : patient réveillé, coopérant, analgésie de secours ou complémentaire",
              "Monitorage (ECG, PA, SpO₂), voie veineuse, oxygène, émulsion lipidique 20 % et matériel de réanimation à proximité",
              "Pause « Stop before you block » : vérifier le côté juste avant la ponction",
              "Échoguidage, asepsie chirurgicale, aiguille visible en permanence, aspiration et injection lente et fractionnée",
              "Dose totale d'anesthésique local calculée : bloc + infiltrations du chirurgien + lidocaïne IV éventuelle",
              "Dexaméthasone 4–8 mg IV : prolonge la durée des blocs"),
              info(`Antithrombotiques : les blocs superficiels restent possibles ; les blocs profonds (paravertébral, carré des lombes, plexus lombaire, infraclaviculaire) suivent les délais des procédures à risque élevé — <a href="#/preop/antithrombotiques">outil Antiagrégants et anticoagulants</a>. Images échographiques réelles : ${NYSORA}.`)]),
            S("Dose maximale d'anesthésique local", [kv(["Ropivacaïne", "3 mg/kg, plafond 225 mg"], ["Bupivacaïne, lévobupivacaïne", "2 mg/kg, plafond 150 mg"], ["Lidocaïne", "4,5 mg/kg (7 mg/kg avec adrénaline)"], ["Mépivacaïne", "4,4 mg/kg"])], { tool: alCalc }),
            S("Toxicité systémique des anesthésiques locaux", [danger("Signes : goût métallique, acouphènes, paresthésies péribuccales, agitation, convulsions, troubles du rythme, collapsus, arrêt cardiaque."),
              { ol: ["Arrêter l'injection, appeler à l'aide", "Oxygène 100 %, contrôle des voies aériennes, éviter l'hypoxie et l'acidose", "Convulsions : benzodiazépine (midazolam 2–5 mg) ou propofol à faible dose", "Émulsion lipidique 20 % (outil ci-dessous)", "Arrêt cardiaque : RCP prolongée, adrénaline à petites doses (≤ 1 µg/kg), amiodarone si arythmie ventriculaire, ECMO si disponible", "Pas de lidocaïne, d'inhibiteurs calciques ni de bêtabloquants"] }], { wide: true, tone: "alert", tool: lipCalc })
          ],
          refs: [REF_PROSPECT, REF_SFAR, REF_ESAIC, REF_LAST, REF_NYSORA]
        })}
      </div>`;
  P17.route(ROOT, { title: SEC, render: hub });
  P17.redirect("#/analgesie/blocs-sspi", ROOT); // ancienne adresse
  P17.index(ROOT, "Blocs analgésiques : quel bloc pour quelle intervention", "ALR bloc échoguidé SSPI TAP ESP PECS paravertébral fascia iliaca PENG canal des adducteurs poplité interscalénique axillaire scalp dose maximale anesthésique local toxicité émulsion lipidique intralipide", "Post-opératoire");

  BLOCS.forEach((b, i) => {
    const path = `${ROOT}/${b.id}`;
    const prev = BLOCS[i - 1], next = BLOCS[i + 1];
    const fiche = {
      kicker: `Bloc analgésique · ${b.region}`, accent: "analgesie", title: b.nom,
      subtitle: b.cible,
      tags: [b.risque === "profond" ? "Bloc profond" : "Bloc superficiel", b.duree, b.region],
      sections: [
        ...(b.noimg ? [] : [S("Vue échographique", [{ figs: [{ img: IMG(b.id), caption: `${b.court} : repères échographiques (schéma). AL : anesthésique local.`, w: 640, h: 420 }], cols: 1 },
          { html: `<p class="tbl-note">Schéma original à but pédagogique. Pour des images réelles et des vidéos : ${NYSORA}.</p>` }], { wide: true })]),
        S("Indications", [ul(...b.indications)]),
        S("Installation et repérage", [{ html: `<p>${b.installation}</p>` }]),
        S("Technique", [{ ol: b.technique }]),
        S("Volume et produit", [kv(["Volume", b.volume], ["Durée d'action", b.duree], ["Risque hémorragique", b.risque === "profond" ? "Bloc profond : délais des antithrombotiques comme pour une procédure à risque élevé" : "Bloc superficiel, site compressible : risque hémorragique faible, possible sous antithrombotiques après évaluation bénéfice-risque"])]),
        S("Complications et précautions", [ul(...b.complications)], { tone: "alert" })
      ],
      refs: [REF_PROSPECT, REF_NYSORA, REF_ESAIC]
    };
    P17.route(path, {
      title: b.court,
      render: () => `
        <div class="page accent-analgesie">
          <div class="page-head">${P17.backLink(ROOT, SEC)}${P17.crumbs([POSTOP, [SEC, ROOT], [b.court, path]])}</div>
          ${P17.fiche(fiche)}
          <nav class="fiche-nav">
            ${prev ? `<a class="tile" href="${ROOT}/${prev.id}"><span class="tile-ico">${P17.icon("back")}</span><span class="tile-body"><span class="tile-desc">Précédent</span><span class="tile-title">${prev.court}</span></span></a>` : "<span></span>"}
            ${next ? `<a class="tile" href="${ROOT}/${next.id}"><span class="tile-body"><span class="tile-desc">Suivant</span><span class="tile-title">${next.court}</span></span><span class="tile-ico">${P17.icon("arrow")}</span></a>` : ""}
          </nav>
        </div>`
    });
    P17.index(path, `Bloc ${b.court}`, `${b.nom} ${b.region} ${b.indications.join(" ")}`, SEC);
  });
})();
