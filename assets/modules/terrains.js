/* =====================================================================
   Anesthésie selon le terrain : une fiche par terrain, même plan partout
   (situations à risque, puis anesthésie : évaluer, avant, au bloc, après).
   Rangé dans Gestion pré-opératoire.
   ===================================================================== */
(function () {
  const { S, ul, kv, tbl, warn, danger, info } = P17.h;
  const SEC = "Selon le terrain";
  const ROOT = "#/terrains";
  const PREOP = ["Gestion pré-opératoire", "#/preop"];
  const btns = (...l) => ({ html: `<p class="btn-row">${l.map(([h, t]) => `<a class="btn btn--ghost" href="${h}">${t}</a>`).join(" ")}</p>` });
  const REF_ESC = "Halvorsen S et al. 2022 ESC Guidelines on cardiovascular assessment and management of patients undergoing non-cardiac surgery. Eur Heart J 2022";

  // Score à cases : total, puis interprétation
  const score = (id, title, desc, items, read) => P17.calc({
    id, kind: "tool", title, desc,
    fields: [{ id: "c", label: "Critères présents", type: "checks", full: true, options: items }],
    compute: v => read(v.c.length, v.c)
  });

  /* ---------------- Outils ---------------- */
  const leeTool = score("lee", "Score de Lee (risque cardiaque révisé)", "Un point par critère",
    [["chir", "Chirurgie à haut risque (intrapéritonéale, intrathoracique, vasculaire sus-inguinale)"], ["coro", "Cardiopathie ischémique"], ["ic", "Insuffisance cardiaque"], ["avc", "Antécédent d'AVC ou d'accident ischémique transitoire"], ["diab", "Diabète sous insuline"], ["creat", "Créatinine > 177 µmol/L (20 mg/L)"]],
    n => ({ label: `Score ${n} / 6`, main: `Risque ≈ ${["0,4", "0,9", "6,6", "11"][Math.min(n, 3)]} %`, tone: n >= 2 ? "warn" : "ok",
      sub: n >= 2 ? "Événement cardiaque majeur : risque élevé. Capacité à l'effort, troponine et BNP avant et après la chirurgie à risque intermédiaire ou élevé." : "Risque faible d'événement cardiaque majeur." }));

  const stopTool = score("stopbang", "Score STOP-BANG", "Dépistage du syndrome d'apnées du sommeil",
    [["s", "Ronflement sonore"], ["t", "Fatigue ou somnolence dans la journée"], ["o", "Apnées observées par l'entourage"], ["p", "Hypertension artérielle"], ["b", "IMC > 35 kg/m²"], ["a", "Âge > 50 ans"], ["n", "Tour de cou > 40 cm"], ["g", "Sexe masculin"]],
    n => ({ label: `Score ${n} / 8`, main: n >= 5 ? "Risque élevé" : n >= 3 ? "Risque intermédiaire" : "Risque faible", tone: n >= 5 ? "danger" : n >= 3 ? "warn" : "ok",
      sub: n >= 5 ? "Apnées modérées à sévères probables : conduire l'anesthésie comme chez un patient apnéique, surveillance postopératoire renforcée." : n >= 3 ? "Apnées possibles : précautions peropératoires, épargne morphinique." : "Apnées du sommeil peu probables." }));

  const childTool = P17.calc({
    id: "child", kind: "tool", title: "Score de Child-Pugh", desc: "Sévérité de la cirrhose",
    fields: [
      { id: "bili", label: "Bilirubine", type: "select", options: [["1", "< 35 µmol/L"], ["2", "35–50 µmol/L"], ["3", "> 50 µmol/L"]] },
      { id: "alb", label: "Albumine", type: "select", options: [["1", "> 35 g/L"], ["2", "28–35 g/L"], ["3", "< 28 g/L"]] },
      { id: "tp", label: "TP", type: "select", options: [["1", "> 50 %"], ["2", "40–50 %"], ["3", "< 40 %"]] },
      { id: "asc", label: "Ascite", type: "select", options: [["1", "Absente"], ["2", "Modérée"], ["3", "Tendue ou réfractaire"]] },
      { id: "enc", label: "Encéphalopathie", type: "select", options: [["1", "Absente"], ["2", "Grades 1–2"], ["3", "Grades 3–4"]] }
    ],
    compute: v => {
      const n = +v.bili + +v.alb + +v.tp + +v.asc + +v.enc;
      const c = n <= 6 ? "A" : n <= 9 ? "B" : "C";
      return { label: `Score ${n} / 15`, main: `Child-Pugh ${c}`, tone: c === "A" ? "ok" : c === "B" ? "warn" : "danger",
        sub: c === "A" ? "Risque opératoire acceptable après évaluation de l'hypertension portale." : c === "B" ? "Risque augmenté : optimiser avant une chirurgie programmée, discuter l'indication en équipe." : "Chirurgie programmée contre-indiquée hors transplantation ; urgence vitale seulement." };
    }
  });

  /* ---------------- Fiches ---------------- */
  const TERRAINS = [
    { id: "coronarien", court: "Coronarien", desc: "Stents, antiagrégants, ischémie périopératoire", tool: leeTool, fiche: {
      title: "Patient coronarien", subtitle: "Évaluer le risque, garder les traitements protecteurs, éviter tachycardie, hypotension et anémie",
      tags: ["Score de Lee", "Aspirine", "Troponine"],
      sections: [
        S("Évaluer", [ul("Risque de la chirurgie : faible (< 1 %), intermédiaire (1–5 %) ou élevé (> 5 %) d'événement cardiaque", "Capacité à l'effort : monter deux étages sans s'arrêter correspond à 4 équivalents métaboliques", "Symptômes instables, syndrome coronarien de moins de 12 mois, type et date des stents", "ECG avant une chirurgie à risque intermédiaire ou élevé", "Troponine ultrasensible et BNP avant, puis 24 et 48 heures après une chirurgie à risque intermédiaire ou élevé", "Test d'ischémie seulement si son résultat peut changer la prise en charge")]),
        S("Avant l'intervention", [kv(["Bêtabloquant", "Poursuivi ; ne pas en débuter la veille"], ["Statine", "Poursuivie"], ["Aspirine en prévention secondaire", "Poursuivie, sauf chirurgie à très haut risque hémorragique (neurochirurgie intracrânienne, canal médullaire)"], ["IEC, ARA2", "Non pris le matin"],
          ["Stent", "Chirurgie programmée différée de 6 mois après une angioplastie programmée, de 12 mois après un syndrome coronarien aigu. Si elle ne peut pas attendre : au moins 1 mois de bithérapie (3 mois après un syndrome coronarien aigu), en gardant l'aspirine"])], { wide: true }),
        S("Au bloc", [ul("Fréquence cardiaque basse, pression artérielle dans les 20 % de la valeur habituelle (moyenne > 65 mmHg)", "Hémoglobine au-dessus de 8 g/dL, normothermie, analgésie efficace", "Surveillance du segment ST en D2 et V5 ; pression artérielle invasive en chirurgie majeure", "Aucune technique d'anesthésie n'est supérieure : c'est la stabilité qui compte")], { tone: "key" }),
        S("Après l'intervention", [ul("Troponine au premier et au deuxième jour : la souffrance myocardique est le plus souvent silencieuse", "Élévation de la troponine : ECG, avis cardiologique, aspirine et statine", "Reprise des antiagrégants dans les 48 heures si l'hémostase le permet", "Oxygène, analgésie, correction de l'anémie")])
      ],
      refs: [REF_ESC, "Lee TH et al. Derivation and prospective validation of a simple index for prediction of cardiac risk of major noncardiac surgery. Circulation 1999", "RFE SFAR-SFC 2011 : Prise en charge du coronarien opéré en chirurgie non cardiaque"] } },
    { id: "insuffisant-cardiaque", court: "Insuffisant cardiaque", desc: "Stabilité, volémie, traitements", fiche: {
      title: "Patient insuffisant cardiaque", subtitle: "Opérer un patient stable, sans surcharge ni hypovolémie",
      tags: ["FEVG", "BNP", "Volémie"],
      sections: [
        S("Évaluer", [ul("Stabilité : une décompensation récente fait différer la chirurgie programmée", "Classe fonctionnelle NYHA, signes congestifs, poids", "Échocardiographie récente : fraction d'éjection, valvulopathie, pressions pulmonaires", "BNP ou NT-proBNP, fonction rénale, kaliémie", "Stimulateur ou défibrillateur : type, dépendance, dernier contrôle")]),
        S("Avant l'intervention", [kv(["Bêtabloquant", "Poursuivi"], ["IEC, ARA2, sacubitril-valsartan", "En règle non pris le matin ; maintien à discuter chez un patient stable"], ["Diurétiques", "Non pris le matin, sauf signes congestifs"], ["Gliflozines", "Dernière prise 3 jours avant"], ["Défibrillateur", "Désactivation des thérapies par aimant ou programmation, défibrillateur externe prêt"])]),
        S("Au bloc", [ul("Induction titrée : étomidate ou propofol à faible dose", "Remplissage guidé par le volume d'éjection ou l'échographie : ni surcharge ni hypovolémie", "Noradrénaline pour la pression artérielle ; dobutamine en cas de bas débit", "Éviter la tachycardie et le passage en fibrillation atriale rapide", "Pression artérielle invasive en chirurgie majeure", "Bistouri bipolaire, plaque à distance du boîtier")], { tone: "key" }),
        S("Après l'intervention", [ul("Soins continus après une chirurgie majeure si la fraction d'éjection est basse", "Bilan des entrées et des sorties, poids quotidien", "Œdème pulmonaire entre le premier et le troisième jour, lors de la mobilisation des liquides", "Reprise précoce des traitements, contrôle du stimulateur ou du défibrillateur")])
      ],
      refs: [REF_ESC, "McDonagh TA et al. 2021 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J 2021"] } },
    { id: "bpco-asthme", court: "BPCO et asthme", desc: "Bronchospasme, ventilation, suites respiratoires", fiche: {
      title: "BPCO et asthme", subtitle: "Opérer à l'état de base, prévenir le bronchospasme et les complications respiratoires",
      tags: ["Bronchodilatateurs", "Auto-PEP", "VNI"],
      sections: [
        S("Évaluer", [ul("Dyspnée, nombre d'exacerbations par an, expectoration, tabagisme", "SpO₂ en air ; gaz du sang si le VEMS est inférieur à 50 % ou en cas d'hypoxémie", "Exploration fonctionnelle seulement en chirurgie thoracique ou en cas de doute diagnostique", "Asthme : contrôle des symptômes, recours récent aux corticoïdes ou aux urgences")]),
        S("Avant l'intervention", [ul("Exacerbation ou infection : différer la chirurgie programmée jusqu'au retour à l'état de base", "Arrêt du tabac, idéalement 4 à 8 semaines avant ; tout arrêt reste bénéfique", "Bronchodilatateurs et corticoïdes inhalés poursuivis, y compris le matin", "Bêta-2 mimétique inhalé avant l'induction", "Corticothérapie orale prolongée : substitution par hydrocortisone", "Kinésithérapie et préparation à l'effort avant une chirurgie majeure")]),
        S("Au bloc", [ul("Anesthésie locorégionale quand elle est possible ; éviter le bloc interscalénique (parésie du diaphragme)", "Intuber sous anesthésie profonde ; propofol, kétamine ou sévoflurane ; éviter le desflurane et les médicaments histaminolibérateurs", "Volume courant de 6 à 8 mL/kg de poids idéal, fréquence basse, expiration longue (I/E 1/3)", "Surveiller l'auto-PEP : hypotension inexpliquée, débit expiratoire qui ne revient pas à zéro", "Décurarisation complète avant l'extubation")], { tone: "key" }),
        S("Après l'intervention", [ul("Analgésie par bloc ou péridurale pour préserver la toux ; épargne morphinique", "Kinésithérapie, spirométrie incitative, lever précoce", "Oxygène titré : SpO₂ de 88 à 92 % chez l'hypercapnique", "Ventilation non invasive en cas d'hypercapnie ou de détresse", "Reprise immédiate des traitements inhalés")])
      ],
      refs: ["Global Initiative for Chronic Obstructive Lung Disease (GOLD) : rapport annuel", "Global Initiative for Asthma (GINA) : rapport annuel", "Canet J et al. Prediction of postoperative pulmonary complications in a population-based surgical cohort (ARISCAT). Anesthesiology 2010"] } },
    { id: "saos", court: "Apnées du sommeil", desc: "STOP-BANG, morphiniques, surveillance", tool: stopTool, fiche: {
      title: "Syndrome d'apnées du sommeil", subtitle: "Dépister, limiter les morphiniques, surveiller la ventilation après l'intervention",
      tags: ["STOP-BANG", "PPC", "Épargne morphinique"],
      sections: [
        S("Évaluer", [ul("Apnées connues : sévérité, appareillage par pression positive continue, observance", "Apnées non explorées : score STOP-BANG", "Comorbidités : obésité, hypertension, hypoventilation (bicarbonates > 27 mmol/L)", "Critères d'intubation et de ventilation au masque difficiles")]),
        S("Avant l'intervention", [ul("Le patient apporte son appareil de pression positive", "Pas de sédatif en prémédication", "Apnées suspectées sans comorbidité déséquilibrée : pas de report, mais précautions renforcées")]),
        S("Au bloc", [ul("Anesthésie locorégionale privilégiée", "Préoxygénation en proclive avec pression positive", "Médicaments de courte durée d'action ; analgésie multimodale sans morphinique quand c'est possible", "Décurarisation complète ; extubation patient réveillé, en position demi-assise")], { tone: "key" }),
        S("Après l'intervention", [ul("Position demi-assise ou latérale, jamais à plat sur le dos", "Pression positive continue reprise dès la SSPI", "SpO₂ en continu tant que des morphiniques sont administrés", "L'oxygène peut masquer les apnées : surveiller aussi la fréquence respiratoire et la sédation", "Désaturations ou apnées répétées en SSPI : surveillance en soins continus", "Ambulatoire possible si les apnées sont traitées, la chirurgie mineure et la douleur contrôlée sans morphinique")])
      ],
      refs: ["Chung F et al. STOP-Bang questionnaire: a practical approach to screen for obstructive sleep apnea. Chest 2016", "American Society of Anesthesiologists. Practice guidelines for the perioperative management of patients with obstructive sleep apnea. Anesthesiology 2014", "Memtsoudis SG et al. Society of Anesthesia and Sleep Medicine guideline on intraoperative management of adult patients with obstructive sleep apnea. Anesth Analg 2018"] } },
    { id: "obese", court: "Obèse", desc: "Position, doses, ventilation", fiche: {
      title: "Patient obèse", subtitle: "Installer en proclive, doser sur le bon poids, ventiler avec une PEP, mobiliser tôt",
      tags: ["Proclive", "Masse maigre", "PEP"],
      sections: [
        S("Évaluer", [ul("IMC, répartition des graisses, tour de cou", "Apnées du sommeil et hypoventilation : STOP-BANG, bicarbonates", "Hypertension, diabète, cardiopathie, reflux", "Voies aériennes, abords veineux ; matériel adapté (table, brassard, aiguilles longues)")]),
        S("Au bloc", [ul("Position proclive, tête surélevée : conduit auditif à la hauteur du sternum", "Préoxygénation avec pression positive ou oxygène à haut débit ; vidéolaryngoscope", "Doses : hypnotiques et morphiniques sur la masse maigre, curares sur le poids idéal, succinylcholine et sugammadex sur le poids réel", "Volume courant de 6 à 8 mL/kg de poids idéal, PEP de 8 à 10 cmH₂O, manœuvres de recrutement", "Anesthésie locorégionale sous échographie quand elle est possible", "Extubation patient réveillé et décurarisé, en proclive")], { tone: "key" }),
        S("Après l'intervention", [ul("Position demi-assise, pression positive ou ventilation non invasive", "Épargne morphinique", "Lever précoce", "Thromboprophylaxie à dose adaptée à partir d'un IMC de 40", "Chirurgie longue : surveiller les CPK (rhabdomyolyse des points d'appui)")])
      ],
      refs: ["Nightingale CE et al. Peri-operative management of the obese surgical patient 2015 (AAGBI, SOBA). Anaesthesia 2015", "De Jong A et al. How to ventilate obese patients in the ICU. Intensive Care Med 2020"] } },
    { id: "insuffisant-renal", court: "Insuffisant rénal et dialysé", desc: "Kaliémie, dialyse, médicaments", fiche: {
      title: "Insuffisant rénal chronique et dialysé", subtitle: "Kaliémie du matin, dialyse la veille, fistule protégée, médicaments adaptés",
      tags: ["Kaliémie", "Fistule", "Pas d'AINS"],
      sections: [
        S("Évaluer", [ul("DFG, diurèse résiduelle, poids sec", "Kaliémie le matin de l'intervention : inférieure à 5,5 mmol/L pour une chirurgie programmée", "Anémie chronique, hypertension, coronaropathie souvent silencieuse", "Dialyse : rythme, abord, dernière séance")]),
        S("Avant l'intervention", [ul("Hémodialyse la veille, dans les 24 heures qui précèdent", "Fistule artérioveineuse : aucun abord veineux, brassard ni garrot sur ce bras ; vérifier le frémissement", "Dialyse péritonéale : vider l'abdomen avant une chirurgie abdominale")]),
        S("Au bloc", [kv(["Curares", "Atracurium ou cisatracurium ; durée du rocuronium prolongée ; sugammadex déconseillé si le DFG est inférieur à 30 mL/min"], ["Succinylcholine", "Possible si la kaliémie est normale"], ["Morphiniques", "Sufentanil ; la morphine s'accumule"], ["Solutés", "Cristalloïdes balancés en volume limité ; pas d'hydroxyéthylamidon"], ["Pression artérielle", "Éviter l'hypotension : elle menace la fonction rénale résiduelle et la fistule"], ["À proscrire", "AINS, aminosides en dose répétée, produits de contraste sans nécessité"])], { tone: "key" }),
        S("Après l'intervention", [ul("Kaliémie en SSPI, recherche d'une surcharge", "Dialyse à programmer avec le néphrologue, sans héparine en cas de risque hémorragique", "Paracétamol ; morphine titrée à dose réduite ou oxycodone", "HBPM et antibiotiques adaptés au DFG")]),
        S("Insuffisance rénale non dialysée", [ul("Maintenir la volémie et la pression artérielle moyenne", "Aucun médicament néphrotoxique", "Diurèse et créatinine surveillées 48 heures après une chirurgie majeure")])
      ],
      refs: ["Ichai C et al. Insuffisance rénale aiguë en périopératoire et en réanimation (RFE SFAR-SRLF). Anesth Reanim 2016", "KDIGO Clinical Practice Guideline for Acute Kidney Injury. Kidney Int Suppl 2012"] } },
    { id: "cirrhotique", court: "Cirrhotique", desc: "Child-Pugh, hémostase, décompensation", tool: childTool, fiche: {
      title: "Patient cirrhotique", subtitle: "Mesurer la gravité, ne pas corriger l'hémostase à l'aveugle, guetter la décompensation",
      tags: ["Child-Pugh", "MELD", "Ascite"],
      sections: [
        S("Évaluer", [ul("Scores de Child-Pugh et MELD : la mortalité opératoire augmente nettement dès le stade B", "Décompensation : ascite, encéphalopathie, ictère, hémorragie digestive", "Hypertension portale : varices, thrombopénie, splénomégalie", "Fonction rénale, natrémie, albumine, état nutritionnel", "Hépatite alcoolique aiguë : contre-indication à la chirurgie programmée")]),
        S("Avant l'intervention", [ul("Ascite : ponction avec compensation par albumine (8 g par litre au-delà de 5 litres)", "Le TP et l'INR ne prédisent pas le saignement : pas de plasma préventif", "Plaquettes au-dessus de 50 G/L et fibrinogène au-dessus de 1 g/L pour une chirurgie à risque", "Vitamine K en cas de cholestase ; prévention du sevrage alcoolique")]),
        S("Au bloc", [kv(["Hypnotiques", "Propofol titré ; pas de benzodiazépine"], ["Curares", "Atracurium ou cisatracurium"], ["Morphiniques", "Sufentanil ; morphine à dose réduite"], ["Antalgiques", "Paracétamol 2 à 3 g par jour au maximum ; pas d'AINS"], ["Hémodynamique", "Préserver la pression artérielle : le foie tolère mal l'hypotension et l'hypoxie"], ["Estomac", "Ascite tendue : induction en séquence rapide"], ["Saignement", "Correction guidée par la clinique et les tests viscoélastiques"])], { tone: "key" }),
        S("Après l'intervention", [ul("Soins continus pour les stades B et C", "Guetter l'ascite, l'encéphalopathie, l'insuffisance rénale, l'infection et le saignement", "Glycémie, nutrition précoce, lactulose en prévention de l'encéphalopathie", "Sédatifs et morphiniques au minimum")])
      ],
      refs: ["European Association for the Study of the Liver. EASL Clinical Practice Guidelines for the management of patients with decompensated cirrhosis. J Hepatol 2018", "Northup PG et al. AGA Clinical Practice Update: surgical risk assessment and perioperative management in cirrhosis. Clin Gastroenterol Hepatol 2019"] } },
    { id: "sujet-age", court: "Sujet âgé", desc: "Fragilité, doses, confusion postopératoire", fiche: {
      title: "Sujet âgé", subtitle: "Repérer la fragilité, réduire les doses, prévenir la confusion",
      tags: ["Fragilité", "Doses réduites", "Confusion"],
      sections: [
        S("Évaluer", [ul("Fragilité et autonomie dans la vie quotidienne", "Fonctions cognitives : un trouble connu annonce une confusion postopératoire", "État nutritionnel : perte de poids, albumine", "Médicaments : psychotropes, anticholinergiques, antithrombotiques", "Fonction rénale estimée, audition et vision", "Projet de soins et souhaits du patient")]),
        S("Avant l'intervention", [ul("Jeûne court : liquides clairs jusqu'à 2 heures avant", "Pas de benzodiazépine en prémédication", "Lunettes et appareils auditifs gardés jusqu'au bloc et rendus en SSPI", "Fracture du col du fémur : chirurgie dans les 48 heures")]),
        S("Au bloc", [ul("Doses réduites et titrées : propofol 1 à 1,5 mg/kg, morphiniques diminués d'un tiers à la moitié", "Monitorage de la profondeur d'anesthésie : éviter une anesthésie trop profonde", "Pression artérielle dans les 20 % de la valeur habituelle", "Réchauffement actif", "Anesthésie générale ou locorégionale : aucune n'a montré de supériorité sur la mortalité ou la confusion", "Installation prudente : peau et articulations fragiles")], { tone: "key" }),
        S("Après l'intervention", [ul("Dépister la confusion chaque jour pendant 5 jours", "Prévenir sans médicament : réorientation, lunettes et appareils, sommeil respecté, lever précoce, hydratation, retrait rapide des sondes", "Chercher une cause : douleur, globe vésical, fécalome, infection, hypoxie, médicament", "Analgésie multimodale ; morphine titrée par bolus de 2 mg ; éviter le néfopam et le tramadol", "Halopéridol à faible dose seulement devant une agitation dangereuse")])
      ],
      refs: ["Aubrun F et al. Anesthésie du sujet âgé : l'exemple de la fracture de l'extrémité supérieure du fémur (RFE SFAR-SFGG). Anesth Reanim 2017", "Aldecoa C et al. Update of the European Society of Anaesthesiology and Intensive Care Medicine evidence-based and consensus-based guideline on postoperative delirium in adult patients. Eur J Anaesthesiol 2024", "Neuman MD et al. Spinal anesthesia or general anesthesia for hip surgery in older adults (REGAIN). N Engl J Med 2021"] } },
    { id: "enceinte", court: "Femme enceinte", desc: "Chirurgie non obstétricale pendant la grossesse", fiche: {
      title: "Femme enceinte : chirurgie non obstétricale", subtitle: "Protéger la mère d'abord, c'est protéger le fœtus : oxygénation, pression artérielle, utérus dégagé",
      tags: ["Décubitus latéral gauche", "Estomac plein", "Pas d'AINS"],
      sections: [
        S("Évaluer", [ul("Terme exact ; avis obstétrical avant toute intervention", "Chirurgie programmée : reportée après l'accouchement ; chirurgie non différable : de préférence au deuxième trimestre", "Voies aériennes : œdème, muqueuses fragiles, intubation plus difficile", "Risque thromboembolique augmenté")]),
        S("Avant l'intervention", [ul("Prévention de l'inhalation à partir du deuxième trimestre : antiacide (citrate de sodium), anti-H2", "Tocolyse à discuter avec l'obstétricien selon le terme et la chirurgie", "Anesthésie locorégionale privilégiée quand elle est possible")]),
        S("Au bloc", [ul("À partir de 20 semaines : décubitus latéral gauche ou cale sous la fesse droite (compression aorto-cave)", "Préoxygénation soigneuse, séquence rapide, sonde de petit calibre, vidéolaryngoscope prêt", "Pression artérielle maintenue à sa valeur de base : phényléphrine ou noradrénaline", "Normoxie, normocapnie (EtCO₂ autour de 32 mmHg), normothermie", "Cœlioscopie possible : pression d'insufflation de 10 à 15 mmHg", "Rythme cardiaque fœtal avant et après l'intervention à partir de 22–24 semaines"), warn("Les médicaments de l'anesthésie ne sont pas tératogènes aux doses usuelles. Les AINS sont contre-indiqués à partir de 20–24 semaines.")], { tone: "key" }),
        S("Après l'intervention", [ul("Surveillance des contractions et du rythme cardiaque fœtal", "Paracétamol, morphiniques titrés, ALR ; pas d'AINS au troisième trimestre", "Thromboprophylaxie, lever précoce", "Immunoglobulines anti-D si la mère est Rhésus négatif et qu'un traumatisme abdominal est possible")])
      ],
      refs: ["ACOG Committee Opinion 775 : Nonobstetric surgery during pregnancy. Obstet Gynecol 2019", "Haggerty E, Daly J. Anaesthesia and non-obstetric surgery in pregnancy. BJA Educ 2021"] } },
    { id: "myopathe", court: "Myopathe", desc: "Succinylcholine interdite, halogénés, cœur et ventilation", fiche: {
      title: "Patient myopathe", subtitle: "Pas de succinylcholine, prudence avec les halogénés, curares à doses réduites, extubation à risque",
      tags: ["Pas de succinylcholine", "Anesthésie intraveineuse", "Sugammadex"],
      sections: [
        S("Évaluer", [ul("Type de myopathie : dystrophinopathie (Duchenne, Becker), myotonie (Steinert), myopathie congénitale, mitochondriale", "Atteinte cardiaque : cardiomyopathie, troubles de conduction (Steinert) — ECG, échocardiographie", "Atteinte respiratoire : capacité vitale (risque si inférieure à 50 %), toux, déglutition", "Antécédent d'hyperthermie maligne personnel ou familial ; myopathie à central core : risque d'hyperthermie maligne")]),
        S("Avant l'intervention", [ul("Kinésithérapie respiratoire, ventilation non invasive habituelle apportée", "Pas de sédatif en prémédication si la ventilation est limite", "Prévoir une surveillance postopératoire en soins continus")]),
        S("Au bloc", [kv(["Succinylcholine", "Contre-indiquée : hyperkaliémie massive, rhabdomyolyse, arrêt cardiaque"], ["Halogénés", "Évités dans les dystrophinopathies et les myopathies à risque d'hyperthermie maligne : anesthésie intraveineuse au propofol, machine purgée"], ["Curares", "Sensibilité accrue : rocuronium à dose réduite, monitorage quantitatif, sugammadex"], ["Myotonie (Steinert)", "Éviter le froid, les frissons, la néostigmine et la succinylcholine, qui déclenchent la contracture"], ["Anesthésie locorégionale", "Privilégiée quand elle est possible"])], { tone: "key" }),
        S("Après l'intervention", [ul("Extubation sur un patient bien réveillé et complètement décurarisé ; relais par ventilation non invasive si besoin", "Surveillance de la SpO₂ et de la capnie, morphiniques réduits", "Rhabdomyolyse : CPK, myoglobinurie, kaliémie", "Kinésithérapie respiratoire précoce")])
      ],
      refs: ["Racca F et al. Practical approach to respiratory emergencies in neurological diseases. Neurol Sci 2020", "Veyckemans F, Scholtes JL. Myotonic dystrophies type 1 and 2: anesthetic care. Paediatr Anaesth 2013", "Hopkins PM et al. Malignant hyperthermia 2020: guideline from the Association of Anaesthetists. Anaesthesia 2021"] } },
    { id: "trisomie", court: "Trisomie 21", desc: "Rachis cervical, voies aériennes, cœur", fiche: {
      title: "Patient porteur d'une trisomie 21", subtitle: "Rachis cervical instable, voies aériennes étroites, cardiopathie et apnées fréquentes",
      tags: ["Instabilité C1–C2", "Sonde plus petite", "Apnées"],
      sections: [
        S("Évaluer", [ul("Instabilité atlanto-axoïdienne : douleur cervicale, troubles de la marche, signes neurologiques ; imagerie si symptômes", "Cardiopathie congénitale opérée ou non, hypertension pulmonaire : échocardiographie", "Apnées du sommeil, macroglossie, sténose sous-glottique", "Hypothyroïdie, obésité, reflux ; capacité de coopération et présence de l'accompagnant")]),
        S("Avant l'intervention", [ul("Accompagnant présent jusqu'à l'induction et dès le réveil", "Prémédication anxiolytique adaptée, prudente si apnées", "Matériel d'intubation difficile prêt")]),
        S("Au bloc", [ul("Rachis cervical en position neutre, sans hyperextension à la laryngoscopie", "Sonde d'un demi à un numéro en dessous de la taille habituelle (sténose sous-glottique)", "Bradycardie fréquente à l'induction au sévoflurane : atropine prête", "Abords veineux souvent difficiles ; installation prudente (hyperlaxité)")], { tone: "key" }),
        S("Après l'intervention", [ul("Surveillance des apnées et de la SpO₂, position latérale", "Agitation au réveil : présence de l'accompagnant", "Évaluation de la douleur adaptée à la communication du patient")])
      ],
      refs: ["Bull MJ et al. Health supervision for children and adolescents with Down syndrome. Pediatrics 2022", "Lewanda AF et al. Preoperative evaluation and comprehensive risk assessment for children with Down syndrome. Paediatr Anaesth 2016"] } },
    { id: "g6pd", court: "Déficit en G6PD", desc: "Médicaments oxydants, hémolyse", fiche: {
      title: "Déficit en G6PD", subtitle: "Éviter les médicaments et situations oxydants, savoir reconnaître une hémolyse",
      tags: ["Hémolyse", "Bleu de méthylène interdit", "Prilocaïne"],
      sections: [
        S("Évaluer", [ul("Antécédents d'hémolyse, de transfusion, d'ictère néonatal ; activité enzymatique si disponible", "Hémoglobine, bilirubine, haptoglobine de base", "Liste des médicaments à éviter remise au dossier")]),
        S("Avant l'intervention", [ul("Pas de jeûne prolongé ni de déshydratation", "Infection, acidose et hyperglycémie favorisent l'hémolyse : les corriger")]),
        S("Au bloc", [kv(["À éviter", "Bleu de méthylène (aggrave la méthémoglobinémie et l'hémolyse), prilocaïne et crème EMLA, rasburicase, dapsone, sulfamides, nitrofurantoïne, primaquine, quinolones à discuter"], ["Utilisables", "Propofol, halogénés, morphiniques, curares, sugammadex, lidocaïne, bupivacaïne, ropivacaïne, paracétamol aux doses usuelles"], ["Méthémoglobinémie", "Traitement par vitamine C ou exsanguinotransfusion, jamais par bleu de méthylène"])], { tone: "key" }),
        S("Après l'intervention", [ul("Hémolyse 24 à 72 heures après l'exposition : urines foncées, ictère, chute de l'hémoglobine", "Bilan : hémoglobine, bilirubine, LDH, haptoglobine, réticulocytes", "Hydratation, transfusion si anémie mal tolérée")])
      ],
      refs: ["Luzzatto L et al. Glucose-6-phosphate dehydrogenase deficiency. Hematol Oncol Clin North Am 2016", "Elyassi AR, Rowshan HH. Perioperative management of the glucose-6-phosphate dehydrogenase deficient patient. Anesth Prog 2009"] } },
    { id: "drepanocytaire", court: "Drépanocytaire", desc: "Transfusion, hypoxie, syndrome thoracique aigu", fiche: {
      title: "Patient drépanocytaire", subtitle: "Préparer avec l'hématologue, éviter tout ce qui fait falciformer, prévenir le syndrome thoracique aigu",
      tags: ["Hb ≥ 10 g/dL", "Oxygène, hydratation", "Spirométrie incitative"],
      sections: [
        S("Évaluer", [ul("Forme (SS, SC, S-bêta-thalassémie), crises récentes, antécédent de syndrome thoracique aigu, d'AVC", "Hémoglobine de base, pourcentage d'HbS, traitement (hydroxyurée, programme transfusionnel)", "Atteintes d'organes : rein, cœur, hypertension pulmonaire, rétine", "Allo-immunisation : recherche d'agglutinines irrégulières")]),
        S("Avant l'intervention", [ul("Avis de l'hématologue pour toute chirurgie programmée", "Forme SS et chirurgie à risque intermédiaire : transfusion préopératoire pour atteindre 10 g/dL d'hémoglobine (essai TAPS) ; échange transfusionnel si l'hémoglobine est déjà élevée", "Concentrés phénotypés, compatibilisés", "Hydratation intraveineuse dès le début du jeûne")]),
        S("Au bloc", [ul("Éviter l'hypoxémie, l'hypothermie, la déshydratation, l'acidose et la douleur : elles déclenchent la falciformation", "Oxygène, réchauffement actif, remplissage adapté", "Garrot : à discuter, durée la plus courte possible", "Analgésie multimodale et anesthésie locorégionale")], { tone: "key" }),
        S("Après l'intervention", [ul("Syndrome thoracique aigu entre le deuxième et le troisième jour : douleur thoracique, fièvre, désaturation, infiltrat radiologique", "Spirométrie incitative, kinésithérapie, lever précoce, oxygène si SpO₂ inférieure à 95 %", "Analgésie efficace, hydratation, thromboprophylaxie", "Crise vaso-occlusive : protocole d'analgésie du service, avis hématologique")])
      ],
      refs: ["Howard J et al. The Transfusion Alternatives Preoperatively in Sickle Cell Disease (TAPS) study. Lancet 2013", "Chou ST et al. American Society of Hematology 2020 guidelines for sickle cell disease: transfusion support. Blood Adv 2020"] } },
    { id: "denutri", court: "Dénutri", desc: "Dépistage, renutrition, syndrome de renutrition", fiche: {
      title: "Patient dénutri", subtitle: "Dépister, renourrir avant une chirurgie majeure, prévenir le syndrome de renutrition",
      tags: ["NRS 2002", "Renutrition 7 à 14 jours", "Phosphore, thiamine"],
      sections: [
        S("Évaluer", [ul("Perte de poids supérieure à 10 % en 6 mois (ou 5 % en 1 mois), IMC inférieur à 18,5 (21 après 70 ans)", "Albumine inférieure à 30 g/L ; score NRS 2002 supérieur ou égal à 3", "Cause : cancer digestif, alcool, sujet âgé, maladie chronique")]),
        S("Avant l'intervention", [ul("Dénutrition sévère avant chirurgie majeure : renutrition 7 à 14 jours, orale ou entérale, parentérale si le tube digestif est inutilisable", "Immunonutrition orale 5 à 7 jours avant une chirurgie digestive carcinologique", "Jeûne court et boisson sucrée jusqu'à 2 heures avant (sauf contre-indication)")]),
        S("Au bloc", [ul("Doses réduites et titrées : moins de masse musculaire et d'albumine", "Points d'appui et peau fragiles, hypothermie rapide", "Cicatrisation et anastomoses fragiles : normovolémie, normothermie")], { tone: "key" }),
        S("Après l'intervention", [ul("Réalimentation orale ou entérale précoce, dans les 24 heures", "Syndrome de renutrition : phosphore, potassium et magnésium chaque jour la première semaine ; thiamine avant tout apport glucidique ; apport progressif", "Pesée et suivi diététique")])
      ],
      refs: ["Weimann A et al. ESPEN practical guideline: clinical nutrition in surgery. Clin Nutr 2021", "HAS 2019 : Diagnostic de la dénutrition de l'enfant et de l'adulte"] } },
    { id: "dysthyroidie", court: "Dysthyroïdie", desc: "Hyper- ou hypothyroïdie, goitre", fiche: {
      title: "Dysthyroïdie : hyper- et hypothyroïdie", subtitle: "Opérer un patient en euthyroïdie, reconnaître la crise aiguë thyrotoxique et le coma myxœdémateux",
      tags: ["Euthyroïdie", "Bêtabloquant", "Goitre compressif"],
      sections: [
        S("Évaluer", [ul("TSH et T4 libre récentes, symptômes (tachycardie, fibrillation atriale, amaigrissement ; ou bradycardie, frilosité)", "Goitre : dyspnée, dysphagie, déviation ou compression trachéale (scanner cervical)", "Cardiopathie associée")]),
        S("Avant l'intervention", [kv(["Hyperthyroïdie", "Chirurgie programmée seulement en euthyroïdie ; antithyroïdiens et bêtabloquant poursuivis le matin"], ["Hypothyroïdie", "Lévothyroxine poursuivie ; hypothyroïdie sévère : différer la chirurgie programmée"], ["Urgence chez l'hyperthyroïdien", "Bêtabloquant (propranolol), antithyroïdien de synthèse, corticoïdes ; iode une heure après l'antithyroïdien"])]),
        S("Au bloc", [ul("Hyperthyroïdie : éviter kétamine, éphédrine et atropine en excès ; besoins anesthésiques augmentés", "Hypothyroïdie : sensibilité aux hypnotiques et aux morphiniques, hypotension, hypothermie, réveil retardé", "Goitre compressif : stratégie d'intubation difficile, sonde armée, vigile si compression sévère")], { tone: "key" }),
        S("Après l'intervention", [ul("Crise aiguë thyrotoxique (dans les 6 à 18 heures) : fièvre, tachycardie, agitation — propranolol, antithyroïdien, hydrocortisone, refroidissement, réanimation", "Coma myxœdémateux : hypothermie, bradycardie, hyponatrémie, hypoventilation — lévothyroxine IV, hydrocortisone, réanimation", "Après thyroïdectomie : hématome compressif, hypocalcémie, paralysie récurrentielle")])
      ],
      refs: ["Palace MR. Perioperative management of thyroid dysfunction. Health Serv Insights 2017", "Ross DS et al. 2016 American Thyroid Association guidelines for diagnosis and management of hyperthyroidism. Thyroid 2016"] } },
    { id: "epileptique", court: "Épileptique", desc: "Traitement à poursuivre, médicaments proconvulsivants", fiche: {
      title: "Patient épileptique", subtitle: "Ne pas interrompre le traitement, éviter ce qui abaisse le seuil épileptogène",
      tags: ["Antiépileptiques le matin", "Tramadol à éviter", "Benzodiazépine"],
      sections: [
        S("Évaluer", [ul("Type et fréquence des crises, date de la dernière crise, facteurs déclenchants", "Traitement et horaires de prise ; inducteurs enzymatiques (carbamazépine, phénytoïne, phénobarbital)", "Stimulateur du nerf vague : à désactiver selon les consignes du neurologue")]),
        S("Avant l'intervention", [ul("Antiépileptiques poursuivis, y compris le matin de l'intervention", "Jeûne court ; relais intraveineux prévu si la reprise orale est retardée (lévétiracétam, valproate)", "Corriger l'hyponatrémie, l'hypoglycémie et le manque de sommeil")]),
        S("Au bloc", [kv(["À éviter ou limiter", "Tramadol, péthidine, sévoflurane à forte concentration avec hyperventilation, étomidate (myoclonies), surdosage en anesthésique local"], ["Utilisables", "Propofol, thiopental, benzodiazépines, sufentanil, curares (besoins augmentés sous inducteurs enzymatiques)"], ["Pendant l'anesthésie", "Normocapnie, normonatrémie, normoglycémie"])], { tone: "key" }),
        S("Après l'intervention", [ul("Reprise du traitement oral dès que possible, aux horaires habituels", "Crise : protection, oxygène, benzodiazépine (midazolam ou clonazépam), rechercher une cause métabolique", "Crise prolongée au-delà de 5 minutes : protocole d'état de mal")])
      ],
      refs: ["Perks A et al. Anaesthesia and epilepsy. Br J Anaesth 2012", "RFE SFAR-SRLF 2018 : Prise en charge de l'état de mal épileptique en préhospitalier, en structure d'urgence et en réanimation"] } },
    { id: "parkinson", court: "Parkinson", desc: "Lévodopa sans interruption, antiémétiques", fiche: {
      title: "Patient parkinsonien", subtitle: "Ne jamais interrompre la lévodopa, proscrire les antidopaminergiques",
      tags: ["Lévodopa à l'heure", "Pas de dropéridol", "Dysautonomie"],
      sections: [
        S("Évaluer", [ul("Traitement exact et horaires, fluctuations motrices", "Troubles de la déglutition, risque d'inhalation, dysautonomie (hypotension orthostatique)", "Troubles cognitifs, hallucinations ; stimulation cérébrale profonde")]),
        S("Avant l'intervention", [ul("Dernière prise de lévodopa le matin, intervention en début de programme", "Sonde gastrique pour donner le traitement si le jeûne se prolonge ; apomorphine sous-cutanée en relais avec avis neurologique", "Stimulateur cérébral profond : désactivé selon le neurologue, bistouri bipolaire")]),
        S("Au bloc", [kv(["Proscrits", "Métoclopramide, dropéridol, halopéridol, phénothiazines : ils aggravent le syndrome parkinsonien"], ["Antiémétiques", "Ondansétron (sauf sous apomorphine), dexaméthasone, dompéridone"], ["Hémodynamique", "Hypotension à l'induction (dysautonomie) : remplissage, vasopresseur direct"], ["IMAO-B (sélégiline, rasagiline)", "Éviter la péthidine et le tramadol (syndrome sérotoninergique)"])], { tone: "key" }),
        S("Après l'intervention", [ul("Reprise de la lévodopa dès le réveil, aux horaires habituels", "Arrêt brutal : rigidité, fièvre, rhabdomyolyse (syndrome parkinsonien-hyperthermique)", "Dysphagie et inhalation : test de déglutition avant la réalimentation", "Confusion postopératoire : prévention non médicamenteuse")])
      ],
      refs: ["Brennan KA, Genever RW. Managing Parkinson's disease during surgery. BMJ 2010", "Akbar U et al. Perioperative management of Parkinson's disease. Expert Rev Neurother 2017"] } },
    { id: "ethylique", court: "Éthylique", desc: "Sevrage, thiamine, retentissement", fiche: {
      title: "Patient éthylique chronique", subtitle: "Dépister, prévenir le sevrage, donner la thiamine, chercher le retentissement",
      tags: ["Thiamine", "Sevrage", "Cirrhose"],
      sections: [
        S("Évaluer", [ul("Consommation quotidienne, dernier verre, antécédent de sevrage compliqué (convulsions, delirium tremens)", "Retentissement : cirrhose, cardiomyopathie, pancréatite, neuropathie, dénutrition", "Bilan : NFS (macrocytose, thrombopénie), hémostase, bilan hépatique, phosphore, magnésium")]),
        S("Avant l'intervention", [ul("Arrêt de l'alcool 4 à 8 semaines avant une chirurgie programmée : moins de complications", "Thiamine 100 à 300 mg par jour, avant tout apport glucidique", "Prévention du sevrage par benzodiazépine selon le score de Cushman")]),
        S("Au bloc", [ul("Intoxication aiguë : estomac plein, besoins anesthésiques réduits", "Éthylisme chronique sans intoxication : besoins augmentés en hypnotiques", "Cirrhose : voir la fiche du patient cirrhotique")], { tone: "key" }),
        S("Après l'intervention", [ul("Sevrage entre 6 et 72 heures : tremblements, sueurs, agitation, tachycardie — benzodiazépine titrée", "Delirium tremens entre le deuxième et le quatrième jour : réanimation", "Hypoglycémie, hypophosphatémie, hypomagnésémie à corriger", "Encéphalopathie de Gayet-Wernicke : confusion, troubles oculomoteurs, ataxie — thiamine IV à forte dose")])
      ],
      refs: ["Kork F et al. Perioperative management of patients with alcohol, tobacco and drug dependency. Curr Opin Anaesthesiol 2010", "SFA-SFAR : Recommandations pour la pratique clinique sur le sevrage alcoolique"] } },
    { id: "toxicomane", court: "Toxicomane", desc: "Opioïdes, cocaïne, cannabis, substitution", fiche: {
      title: "Patient toxicomane", subtitle: "Poursuivre la substitution, anticiper des besoins analgésiques élevés, reconnaître l'intoxication et le sevrage",
      tags: ["Méthadone, buprénorphine", "Kétamine", "Cocaïne"],
      sections: [
        S("Évaluer", [ul("Produits, voie, dernière prise ; traitement de substitution et dose", "Complications : VIH, hépatites, endocardite, abords veineux difficiles", "Cocaïne récente : douleur thoracique, hypertension, troubles du rythme — ECG")]),
        S("Avant l'intervention", [ul("Méthadone et buprénorphine poursuivies, y compris le matin, à la dose habituelle", "Intoxication aiguë à la cocaïne : différer la chirurgie programmée", "Plan d'analgésie établi avant l'intervention ; anesthésie locorégionale privilégiée")]),
        S("Au bloc", [kv(["Opioïdes", "Besoins nettement augmentés : analgésie multimodale, kétamine, lidocaïne IV, ALR"], ["Naloxone", "À éviter chez le dépendant : sevrage brutal"], ["Cocaïne", "Pas de bêtabloquant seul (vasospasme coronaire) ; hypertension : benzodiazépine, nicardipine"], ["Cannabis", "Voies aériennes réactives, besoins en propofol augmentés"])], { tone: "key" }),
        S("Après l'intervention", [ul("Douleur à évaluer et traiter comme chez tout patient : ne pas sous-traiter", "PCA sans débit continu, morphiniques titrés en plus de la substitution", "Sevrage : agitation, mydriase, sueurs, diarrhée, rhinorrhée — reprendre la substitution", "Avis de l'équipe d'addictologie avant la sortie")])
      ],
      refs: ["Kohan L et al. Buprenorphine management in the perioperative period: educational review and recommendations. Reg Anesth Pain Med 2021", "SFETD : Prise en charge de la douleur chez le patient sous traitement de substitution aux opiacés"] } },
  ];

  /* ---------------- Situations à risque, par terrain ---------------- */
  const RISQUES = {
    "enceinte": ["Premier trimestre : chirurgie programmée reportée après l'accouchement", "Compression aorto-cave à partir de 20 semaines : hypotension en décubitus dorsal", "Estomac plein et intubation difficile à partir du deuxième trimestre", "Après l'intervention : accouchement prématuré, thrombose"],
    "myopathe": ["Succinylcholine : hyperkaliémie et arrêt cardiaque, contre-indiquée", "Halogénés : rhabdomyolyse et hyperthermie maligne dans certaines myopathies", "Atteinte cardiaque : cardiomyopathie, troubles de conduction", "Au réveil : hypoventilation, encombrement, curarisation prolongée"],
    "trisomie": ["Instabilité atlanto-axoïdienne : pas d'hyperextension du cou", "Sténose sous-glottique, macroglossie : intubation et ventilation plus difficiles", "Cardiopathie congénitale, hypertension pulmonaire", "Apnées obstructives au réveil"],
    "g6pd": ["Médicaments oxydants : hémolyse aiguë", "Bleu de méthylène : contre-indiqué", "Infection, acidose, hyperglycémie : favorisent l'hémolyse", "Hémolyse retardée de 24 à 72 heures après l'exposition"],
    "drepanocytaire": ["Hypoxie, hypothermie, déshydratation, acidose : falciformation", "Syndrome thoracique aigu du deuxième au troisième jour", "Crise vaso-occlusive déclenchée par la douleur et le stress", "Allo-immunisation : transfusions difficiles"],
    "denutri": ["Perte de poids supérieure à 10 % ou albumine inférieure à 30 g/L : complications et mortalité augmentées", "Infections, lâchages d'anastomose, escarres", "Syndrome de renutrition : hypophosphatémie, troubles du rythme", "Surdosage médicamenteux : moins de masse musculaire et d'albumine"],
    "dysthyroidie": ["Hyperthyroïdie non contrôlée : crise aiguë thyrotoxique", "Hypothyroïdie sévère : hypotension, hypothermie, réveil retardé", "Goitre compressif : voies aériennes difficiles", "Fibrillation atriale, cardiopathie associée"],
    "epileptique": ["Arrêt du traitement ou jeûne prolongé : crise périopératoire", "Tramadol, péthidine, fortes doses d'anesthésique local : seuil épileptogène abaissé", "Inducteurs enzymatiques : besoins en morphiniques et curares augmentés", "Hyponatrémie, hypoglycémie, manque de sommeil"],
    "parkinson": ["Interruption de la lévodopa : blocage moteur, syndrome hyperthermique", "Antidopaminergiques (métoclopramide, dropéridol, halopéridol) : aggravation", "Dysautonomie : hypotension à l'induction", "Dysphagie : inhalation, confusion postopératoire"],
    "ethylique": ["Sevrage alcoolique : convulsions, delirium tremens", "Carence en thiamine : encéphalopathie de Gayet-Wernicke", "Cirrhose, cardiomyopathie, troubles de l'hémostase", "Hypoglycémie, hypophosphatémie, hypomagnésémie"],
    "toxicomane": ["Arrêt de la substitution : sevrage et douleur mal contrôlée", "Tolérance aux opioïdes : besoins analgésiques élevés", "Cocaïne récente : ischémie myocardique, hypertension, troubles du rythme", "Infections : VIH, hépatites, endocardite"],
    "coronarien": ["Syndrome coronarien de moins de 12 mois ou angor instable : la chirurgie programmée est différée", "Stent récent sous double antiagrégation : ni arrêt sans avis cardiologique, ni chirurgie précipitée", "Au bloc : tachycardie, hypotension, anémie, hypothermie et douleur déclenchent l'ischémie", "Du premier au troisième jour : infarctus postopératoire, le plus souvent sans douleur"],
    "insuffisant-cardiaque": ["Décompensation récente ou signes congestifs : la chirurgie programmée est différée", "Fraction d'éjection très abaissée, hypertension pulmonaire, rétrécissement aortique associé", "À l'induction : collapsus par vasodilatation ; passage en fibrillation atriale rapide", "Du premier au troisième jour : œdème pulmonaire lors de la mobilisation des liquides"],
    "bpco-asthme": ["Exacerbation ou infection en cours, asthme non contrôlé : la chirurgie programmée est différée", "VEMS inférieur à 50 %, hypercapnie, oxygène à domicile", "À l'intubation et à l'extubation : bronchospasme ; pendant la ventilation : hyperinflation et auto-PEP", "Chirurgie thoracique ou abdominale haute : encombrement, atélectasie, pneumopathie"],
    "saos": ["Apnées sévères non appareillées, surtout avec obésité ou hypoventilation", "À l'induction : ventilation au masque et intubation difficiles", "En SSPI et les premières nuits : apnées obstructives sous morphiniques ou sédatifs", "Décubitus dorsal strict, oxygène qui masque les apnées"],
    "obese": ["IMC supérieur à 40, apnées du sommeil ou hypoventilation associées", "À l'induction : désaturation en moins de deux minutes, ventilation au masque difficile", "Surdosage quand les doses sont calculées sur le poids réel", "Après l'intervention : atélectasies, thrombose, rhabdomyolyse des points d'appui"],
    "insuffisant-renal": ["Kaliémie supérieure ou égale à 5,5 mmol/L le matin, surcharge, dialyse non faite la veille", "Hypotension : thrombose de la fistule, perte de la fonction rénale résiduelle", "Accumulation : morphine, curares stéroïdiens, HBPM, antibiotiques", "Saignement favorisé par la thrombopathie urémique"],
    "cirrhotique": ["Child-Pugh C, hépatite alcoolique aiguë ou décompensation en cours : pas de chirurgie programmée", "Chirurgie abdominale avec ouverture du péritoine, chirurgie en urgence", "Hypotension et hypoxie au bloc : le foie les tolère mal", "Après l'intervention : ascite, encéphalopathie, insuffisance rénale, infection, saignement"],
    "sujet-age": ["Fragilité, troubles cognitifs, dénutrition, nombreux médicaments", "À l'induction : hypotension et surdosage aux doses de l'adulte jeune", "Hypothermie, lésions cutanées et articulaires à l'installation", "Après l'intervention : confusion, chute, rétention urinaire, perte d'autonomie"]
  };
  const TITRES = { "Évaluer": "Anesthésie : évaluer", "Avant l'intervention": "Anesthésie : avant l'intervention", "Au bloc": "Anesthésie : au bloc", "Après l'intervention": "Anesthésie : après l'intervention" };
  TERRAINS.forEach(t => {
    t.fiche.sections = [
      S("Situations à risque", [{ html: `<div class="alerts alerts--2">${(RISQUES[t.id] || []).map(r => { const [a, ...b] = r.split(" : "); const d = b.join(" : "); return `<div class="alert-card">${P17.warnIcon || ""}<div><b>${a}</b>${d ? `<span>${d.charAt(0).toUpperCase() + d.slice(1)}</span>` : ""}</div></div>`; }).join("")}</div>` }], { wide: true, tone: "alert" }),
      // le score, quand il existe, accompagne l'évaluation
      ...t.fiche.sections.map(x => ({ ...x, title: TITRES[x.title] || x.title, ...(x.title === "Évaluer" && t.tool ? { tool: t.tool } : {}) }))
    ];
  });

  /* ---------------- Regroupement par famille ---------------- */
  const FAMILLES = [
    ["Cœur et poumon", ["coronarien", "insuffisant-cardiaque", "bpco-asthme", "saos"]],
    ["Métabolisme et organes", ["obese", "denutri", "dysthyroidie", "insuffisant-renal", "cirrhotique"]],
    ["Système nerveux et muscle", ["epileptique", "parkinson", "myopathe"]],
    ["Sang", ["drepanocytaire", "g6pd"]],
    ["Situations particulières", ["enceinte", "sujet-age", "trisomie", "ethylique", "toxicomane"]]
  ];
  const BYID = Object.fromEntries(TERRAINS.map(t => [t.id, t]));
  const ORDRE = FAMILLES.flatMap(([, ids]) => ids).map(id => BYID[id]).filter(Boolean);
  const tileOf = t => ({ href: `${ROOT}/${t.id}`, title: t.court, desc: t.desc, icon: "terrain", accent: "anesthesie" });

  /* ---------------- Routes ---------------- */
  // anciennes adresses (rubrique rangée auparavant dans Gestion pré-opératoire)
  P17.redirect("#/preop/terrains", ROOT);
  TERRAINS.forEach(t => P17.redirect(`#/preop/terrains/${t.id}`, `${ROOT}/${t.id}`));
  P17.route(ROOT, {
    title: SEC,
    render: () => P17.page({ crumbs: [[SEC, ROOT]], title: SEC, accent: "anesthesie", icon: "terrain", back: "#/",
      subtitle: "Pour chaque terrain : d'abord les situations à risque, puis la conduite de l'anesthésie avant, pendant et après l'intervention.",
      body: FAMILLES.map(([f, ids]) => P17.group(f, P17.tiles(ids.map(id => BYID[id]).filter(Boolean).map(tileOf)))).join("") })
  });
  P17.index(ROOT, SEC, "comorbidités terrain patient à risque", SEC);
  TERRAINS.forEach(t => {
    const path = `${ROOT}/${t.id}`;
    P17.route(path, { title: t.court, render: () => `
      <div class="page accent-anesthesie">
        <div class="page-head">${P17.backLink(ROOT, SEC)}${P17.crumbs([[SEC, ROOT], [t.court, path]])}</div>
        ${P17.fiche({ kicker: SEC, accent: "anesthesie", ...t.fiche })}
      </div>` });
    P17.index(path, t.fiche.title, `${t.desc} ${(t.fiche.tags || []).join(" ")} terrain`, SEC);
  });
  // Section principale de l'accueil (volet « Selon le patient »)
  P17.terrains = ORDRE.map(tileOf);
})();
