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
          ["Stent", "Chirurgie programmée différée de 6 mois après une angioplastie programmée, de 12 mois après un syndrome coronarien aigu. Si elle ne peut pas attendre : au moins 1 mois de bithérapie (3 mois après un syndrome coronarien aigu), en gardant l'aspirine"]),
          btns(["#/preop/antithrombotiques", "Antiagrégants : outil d'arrêt et de reprise"], ["#/preop/traitements", "Traitements chroniques"])], { wide: true }),
        S("Au bloc", [ul("Fréquence cardiaque basse, pression artérielle dans les 20 % de la valeur habituelle (moyenne > 65 mmHg)", "Hémoglobine au-dessus de 8 g/dL, normothermie, analgésie efficace", "Surveillance du segment ST en D2 et V5 ; pression artérielle invasive en chirurgie majeure", "Aucune technique d'anesthésie n'est supérieure : c'est la stabilité qui compte")], { tone: "key" }),
        S("Après l'intervention", [ul("Troponine au premier et au deuxième jour : la souffrance myocardique est le plus souvent silencieuse", "Élévation de la troponine : ECG, avis cardiologique, aspirine et statine", "Reprise des antiagrégants dans les 48 heures si l'hémostase le permet", "Oxygène, analgésie, correction de l'anémie")])
      ],
      refs: [REF_ESC, "Lee TH et al. Derivation and prospective validation of a simple index for prediction of cardiac risk of major noncardiac surgery. Circulation 1999", "RFE SFAR-SFC 2011 : Prise en charge du coronarien opéré en chirurgie non cardiaque"] } },
    { id: "insuffisant-cardiaque", court: "Insuffisant cardiaque", desc: "Stabilité, volémie, traitements", fiche: {
      title: "Patient insuffisant cardiaque", subtitle: "Opérer un patient stable, sans surcharge ni hypovolémie",
      tags: ["FEVG", "BNP", "Volémie"],
      sections: [
        S("Évaluer", [ul("Stabilité : une décompensation récente fait différer la chirurgie programmée", "Classe fonctionnelle NYHA, signes congestifs, poids", "Échocardiographie récente : fraction d'éjection, valvulopathie, pressions pulmonaires", "BNP ou NT-proBNP, fonction rénale, kaliémie", "Stimulateur ou défibrillateur : type, dépendance, dernier contrôle")]),
        S("Avant l'intervention", [kv(["Bêtabloquant", "Poursuivi"], ["IEC, ARA2, sacubitril-valsartan", "En règle non pris le matin ; maintien à discuter chez un patient stable"], ["Diurétiques", "Non pris le matin, sauf signes congestifs"], ["Gliflozines", "Dernière prise 3 jours avant"], ["Défibrillateur", "Désactivation des thérapies par aimant ou programmation, défibrillateur externe prêt"]),
          btns(["#/preop/traitements", "Traitements chroniques"])]),
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
        S("Au bloc", [ul("Anesthésie locorégionale quand elle est possible ; éviter le bloc interscalénique (parésie du diaphragme)", "Intuber sous anesthésie profonde ; propofol, kétamine ou sévoflurane ; éviter le desflurane et les médicaments histaminolibérateurs", "Volume courant de 6 à 8 mL/kg de poids idéal, fréquence basse, expiration longue (I/E 1/3)", "Surveiller l'auto-PEP : hypotension inexpliquée, débit expiratoire qui ne revient pas à zéro", "Décurarisation complète avant l'extubation"),
          btns(["#/urgences/bronchospasme", "Bronchospasme : aide au bloc"])], { tone: "key" }),
        S("Après l'intervention", [ul("Analgésie par bloc ou péridurale pour préserver la toux ; épargne morphinique", "Kinésithérapie, spirométrie incitative, lever précoce", "Oxygène titré : SpO₂ de 88 à 92 % chez l'hypercapnique", "Ventilation non invasive en cas d'hypercapnie ou de détresse", "Reprise immédiate des traitements inhalés")])
      ],
      refs: ["Global Initiative for Chronic Obstructive Lung Disease (GOLD) : rapport annuel", "Global Initiative for Asthma (GINA) : rapport annuel", "Canet J et al. Prediction of postoperative pulmonary complications in a population-based surgical cohort (ARISCAT). Anesthesiology 2010"] } },
    { id: "saos", court: "Apnées du sommeil", desc: "STOP-BANG, morphiniques, surveillance", tool: stopTool, fiche: {
      title: "Syndrome d'apnées du sommeil", subtitle: "Dépister, limiter les morphiniques, surveiller la ventilation après l'intervention",
      tags: ["STOP-BANG", "PPC", "Épargne morphinique"],
      sections: [
        S("Évaluer", [ul("Apnées connues : sévérité, appareillage par pression positive continue, observance", "Apnées non explorées : score STOP-BANG", "Comorbidités : obésité, hypertension, hypoventilation (bicarbonates > 27 mmol/L)", "Critères d'intubation et de ventilation au masque difficiles")]),
        S("Avant l'intervention", [ul("Le patient apporte son appareil de pression positive", "Pas de sédatif en prémédication", "Apnées suspectées sans comorbidité déséquilibrée : pas de report, mais précautions renforcées")]),
        S("Au bloc", [ul("Anesthésie locorégionale privilégiée", "Préoxygénation en proclive avec pression positive", "Médicaments de courte durée d'action ; analgésie multimodale sans morphinique quand c'est possible", "Décurarisation complète ; extubation patient réveillé, en position demi-assise"),
          btns(["#/perop/voies-aeriennes", "Voies aériennes"], ["#/analgesie/strategie-sans-opioides", "Analgésie sans opioïdes"])], { tone: "key" }),
        S("Après l'intervention", [ul("Position demi-assise ou latérale, jamais à plat sur le dos", "Pression positive continue reprise dès la SSPI", "SpO₂ en continu tant que des morphiniques sont administrés", "L'oxygène peut masquer les apnées : surveiller aussi la fréquence respiratoire et la sédation", "Désaturations ou apnées répétées en SSPI : surveillance en soins continus", "Ambulatoire possible si les apnées sont traitées, la chirurgie mineure et la douleur contrôlée sans morphinique")])
      ],
      refs: ["Chung F et al. STOP-Bang questionnaire: a practical approach to screen for obstructive sleep apnea. Chest 2016", "American Society of Anesthesiologists. Practice guidelines for the perioperative management of patients with obstructive sleep apnea. Anesthesiology 2014", "Memtsoudis SG et al. Society of Anesthesia and Sleep Medicine guideline on intraoperative management of adult patients with obstructive sleep apnea. Anesth Analg 2018"] } },
    { id: "obese", court: "Obèse", desc: "Position, doses, ventilation", fiche: {
      title: "Patient obèse", subtitle: "Installer en proclive, doser sur le bon poids, ventiler avec une PEP, mobiliser tôt",
      tags: ["Proclive", "Masse maigre", "PEP"],
      sections: [
        S("Évaluer", [ul("IMC, répartition des graisses, tour de cou", "Apnées du sommeil et hypoventilation : STOP-BANG, bicarbonates", "Hypertension, diabète, cardiopathie, reflux", "Voies aériennes, abords veineux ; matériel adapté (table, brassard, aiguilles longues)"), btns([ROOT + "/saos", "Apnées du sommeil"])]),
        S("Au bloc", [ul("Position proclive, tête surélevée : conduit auditif à la hauteur du sternum", "Préoxygénation avec pression positive ou oxygène à haut débit ; vidéolaryngoscope", "Doses : hypnotiques et morphiniques sur la masse maigre, curares sur le poids idéal, succinylcholine et sugammadex sur le poids réel", "Volume courant de 6 à 8 mL/kg de poids idéal, PEP de 8 à 10 cmH₂O, manœuvres de recrutement", "Anesthésie locorégionale sous échographie quand elle est possible", "Extubation patient réveillé et décurarisé, en proclive"),
          btns(["#/perop/medicaments", "Outil des doses d'induction"])], { tone: "key" }),
        S("Après l'intervention", [ul("Position demi-assise, pression positive ou ventilation non invasive", "Épargne morphinique", "Lever précoce", "Thromboprophylaxie à dose adaptée à partir d'un IMC de 40", "Chirurgie longue : surveiller les CPK (rhabdomyolyse des points d'appui)"),
          btns(["#/postop/thromboprophylaxie", "Thromboprophylaxie"])])
      ],
      refs: ["Nightingale CE et al. Peri-operative management of the obese surgical patient 2015 (AAGBI, SOBA). Anaesthesia 2015", "De Jong A et al. How to ventilate obese patients in the ICU. Intensive Care Med 2020"] } },
    { id: "insuffisant-renal", court: "Insuffisant rénal et dialysé", desc: "Kaliémie, dialyse, médicaments", fiche: {
      title: "Insuffisant rénal chronique et dialysé", subtitle: "Kaliémie du matin, dialyse la veille, fistule protégée, médicaments adaptés",
      tags: ["Kaliémie", "Fistule", "Pas d'AINS"],
      sections: [
        S("Évaluer", [ul("DFG, diurèse résiduelle, poids sec", "Kaliémie le matin de l'intervention : inférieure à 5,5 mmol/L pour une chirurgie programmée", "Anémie chronique, hypertension, coronaropathie souvent silencieuse", "Dialyse : rythme, abord, dernière séance")]),
        S("Avant l'intervention", [ul("Hémodialyse la veille, dans les 24 heures qui précèdent", "Fistule artérioveineuse : aucun abord veineux, brassard ni garrot sur ce bras ; vérifier le frémissement", "Dialyse péritonéale : vider l'abdomen avant une chirurgie abdominale")]),
        S("Au bloc", [kv(["Curares", "Atracurium ou cisatracurium ; durée du rocuronium prolongée ; sugammadex déconseillé si le DFG est inférieur à 30 mL/min"], ["Succinylcholine", "Possible si la kaliémie est normale"], ["Morphiniques", "Sufentanil ; la morphine s'accumule"], ["Solutés", "Cristalloïdes balancés en volume limité ; pas d'hydroxyéthylamidon"], ["Pression artérielle", "Éviter l'hypotension : elle menace la fonction rénale résiduelle et la fistule"], ["À proscrire", "AINS, aminosides en dose répétée, produits de contraste sans nécessité"])], { tone: "key" }),
        S("Après l'intervention", [ul("Kaliémie en SSPI, recherche d'une surcharge", "Dialyse à programmer avec le néphrologue, sans héparine en cas de risque hémorragique", "Paracétamol ; morphine titrée à dose réduite ou oxycodone", "HBPM et antibiotiques adaptés au DFG"),
          btns(["#/urgences/hyperkaliemie", "Hyperkaliémie : aide au bloc"], ["#/postop/thromboprophylaxie", "Thromboprophylaxie"])]),
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
        S("Au bloc", [ul("Doses réduites et titrées : propofol 1 à 1,5 mg/kg, morphiniques diminués d'un tiers à la moitié", "Monitorage de la profondeur d'anesthésie : éviter une anesthésie trop profonde", "Pression artérielle dans les 20 % de la valeur habituelle", "Réchauffement actif", "Anesthésie générale ou locorégionale : aucune n'a montré de supériorité sur la mortalité ou la confusion", "Installation prudente : peau et articulations fragiles"),
          btns(["#/perop/medicaments", "Doses d'induction"], ["#/perop/rachianesthesie", "Rachianesthésie"])], { tone: "key" }),
        S("Après l'intervention", [ul("Dépister la confusion chaque jour pendant 5 jours", "Prévenir sans médicament : réorientation, lunettes et appareils, sommeil respecté, lever précoce, hydratation, retrait rapide des sondes", "Chercher une cause : douleur, globe vésical, fécalome, infection, hypoxie, médicament", "Analgésie multimodale ; morphine titrée par bolus de 2 mg ; éviter le néfopam et le tramadol", "Halopéridol à faible dose seulement devant une agitation dangereuse")])
      ],
      refs: ["Aubrun F et al. Anesthésie du sujet âgé : l'exemple de la fracture de l'extrémité supérieure du fémur (RFE SFAR-SFGG). Anesth Reanim 2017", "Aldecoa C et al. Update of the European Society of Anaesthesiology and Intensive Care Medicine evidence-based and consensus-based guideline on postoperative delirium in adult patients. Eur J Anaesthesiol 2024", "Neuman MD et al. Spinal anesthesia or general anesthesia for hip surgery in older adults (REGAIN). N Engl J Med 2021"] } }
  ];

  /* ---------------- Situations à risque, par terrain ---------------- */
  const RISQUES = {
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

  /* ---------------- Routes ---------------- */
  // anciennes adresses (rubrique rangée auparavant dans Gestion pré-opératoire)
  P17.redirect("#/preop/terrains", ROOT);
  TERRAINS.forEach(t => P17.redirect(`#/preop/terrains/${t.id}`, `${ROOT}/${t.id}`));
  P17.route(ROOT, {
    title: SEC,
    render: () => P17.page({ crumbs: [[SEC, ROOT]], title: SEC, accent: "anesthesie", icon: "terrain", back: "#/",
      subtitle: "Pour chaque terrain : d'abord les situations à risque, puis la conduite de l'anesthésie avant, pendant et après l'intervention.",
      body: P17.tiles(TERRAINS.map(t => ({ href: `${ROOT}/${t.id}`, title: t.court, desc: t.desc, icon: "terrain", accent: "anesthesie" }))) })
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
  P17.terrains = TERRAINS.map(t => ({ href: `${ROOT}/${t.id}`, title: t.court, desc: t.desc, icon: "terrain", accent: "anesthesie" }));
})();
