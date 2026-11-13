/* =====================================================================
   Analgésie postopératoire et SSPI
   ===================================================================== */
(function () {
  const { S, ul, ol, kv, warn, danger, info, ok, tbl } = P17.h;
  const F = window.P17Calc;
  const f = P17.fmt;
  const REF_DOUL = "RFE SFAR : Réactualisation de la recommandation sur la douleur postopératoire (Aubrun F et al., ACCPM 2019)";
  const REF_NVPO = "Gan TJ et al. Fourth consensus guidelines for the management of postoperative nausea and vomiting. Anesth Analg 2020";
  const REF_NVPO_FR = "Conférence d'experts SFAR : Prise en charge des nausées et vomissements postopératoires";
  const REF_CURARE = "RFE SFAR 2018 : Curarisation et décurarisation en anesthésie (Plaud B et al., ACCPM 2020)";
  const REF_DAS = "Difficult Airway Society : Guidelines for the management of tracheal extubation. Anaesthesia 2012";
  const REF_DIAB = "SFAR-SFD 2025 : Prise en charge du patient diabétique en péri-opératoire, fiches simplifiées (Cheisson G et al.)";
  const REF_ALR = "RFE SFAR : Anesthésie locorégionale périnerveuse (ALR-PN)";
  const REF_LAST = "ASRA 2020 : Checklist for treatment of local anesthetic systemic toxicity (Neal JM et al., Reg Anesth Pain Med 2021)";

  const POSTOP = ["Post-opératoire", "#/postop"];
  const ANALGESIE = ["Analgésie postopératoire", "#/analgesie"];
  // parents : fil d'Ariane au-dessus de la fiche ; le dernier est la cible du bouton Retour
  const pageFiche = (parents, accent, path, fiche, extra = "") => {
    const [label, href] = parents[parents.length - 1];
    return `
    <div class="page accent-${accent}">
      <div class="page-head">
        ${P17.backLink(href, label)}
        ${P17.crumbs([...parents, [fiche.title, path]])}
      </div>
      ${P17.fiche({ accent, ...fiche, tool: extra })}
    </div>`;
  };

  /* ============================== ANALGÉSIE ============================== */

  const strategie = {
    kicker: "Analgésie postopératoire", title: "Stratégie d'analgésie sans opioïdes",
    subtitle: "Analgésie multimodale adaptée à la douleur attendue, avec épargne morphinique",
    tags: ["Multimodale", "Sans opioïdes", "Anticipation"],
    sections: [
      S("Principes", [ul("Anticiper : prescrire l'analgésie avant la fin de l'intervention, adaptée à la douleur attendue de la chirurgie", "Associer des analgésiques de mécanismes différents et une technique locorégionale dès que possible", "Évaluer la douleur au repos et à la mobilisation (EN ou EVA de 0 à 10) : objectif ≤ 3 au repos, permettant la toux et le lever", "Réserver les morphiniques au secours, par titration puis PCA")]),
      S("Protocole standard sans opioïdes (adulte)", [
        tbl(["Molécule", "Posologie", "Précautions"], [
          ["Paracétamol", "1 g toutes les 6 h IV ou per os (15 mg/kg si < 50 kg) ; max 4 g/24 h", "3 g/24 h si insuffisance hépatique, dénutrition, alcoolisme, poids < 50 kg"],
          ["Kétoprofène", "50 mg toutes les 6 h ou 100 mg toutes les 12 h IV ; 48–72 h maximum", "Contre-indiqué : insuffisance rénale, hypovolémie, saignement, ulcère, grossesse ≥ 24 SA, AVK ; prudence > 75 ans"],
          ["Néfopam", "20 mg IV lente (30 min) toutes les 4–6 h, ou 80–120 mg/24 h en continu ; max 120 mg/24 h", "Tachycardie, sueurs, rétention urinaire ; contre-indiqué si épilepsie, glaucome à angle fermé, adénome prostatique"],
          ["Dexaméthasone", "8 mg IV dose unique à l'induction", "Prolonge l'analgésie et prévient les NVPO ; hyperglycémie transitoire chez le diabétique"]
        ])
      ], { wide: true }),
      S("Adjuvants peropératoires", [tbl(["Molécule", "Posologie", "Indication"], [
        ["Kétamine", "0,15–0,5 mg/kg à l'induction puis 0,125–0,25 mg/kg/h, arrêt 30 min avant la fin", "Chirurgie douloureuse, patient tolérant aux opioïdes ou douloureux chronique, prévention de la douleur chronique"],
        ["Lidocaïne IV", "1,5 mg/kg (poids idéal) puis 1,5–2 mg/kg/h", "Chirurgie abdominale sans ALR ; contre-indiquée avec un bloc ou une péridurale (cumul d'anesthésiques locaux)"],
        ["Sulfate de magnésium", "30–50 mg/kg en 20 min", "Épargne morphinique ; potentialise les curares"],
        ["Dexmédétomidine", "0,5–1 µg/kg en 10–20 min ou 0,2–0,7 µg/kg/h", "Épargne morphinique ; bradycardie, hypotension, sédation prolongée"]
      ], "Les gabapentinoïdes ne sont pas recommandés en routine (sédation, sans bénéfice net).")], { wide: true }),
      S("Stratification selon la douleur attendue", [tbl(["Douleur attendue", "Exemples", "Stratégie"], [
        ["Faible", "Chirurgie superficielle, endoscopie, ganglion sentinelle", "Paracétamol ± AINS, infiltration"],
        ["Modérée", "Cœlioscopie, hernie, chirurgie du sein, RTUP", "Paracétamol + AINS + néfopam + dexaméthasone + infiltration ou bloc pariétal"],
        ["Forte", "Laparotomie, thoracotomie, arthrodèse, chirurgie osseuse majeure", "Protocole complet + ALR continue (péridurale, paravertébral, cathéter périnerveux) + kétamine ; morphine en PCA de secours"]
      ])], { wide: true }),
      S("Anesthésie sans opioïdes peropératoire", [ul("Possible en associant kétamine, lidocaïne, dexmédétomidine, magnésium et ALR", "Bénéfices : moins de NVPO et de sédation ; intérêt chez l'obèse avec apnées du sommeil", warn("Les fortes doses de dexmédétomidine exposent à des bradycardies sévères et à des réveils prolongés (essai POFA) : préférer des doses modérées."))]),
      S("Si la douleur reste > 3", [ul("Vérifier l'administration du protocole et l'efficacité de l'ALR (cathéter déplacé ?)", "Rechercher une complication chirurgicale (douleur inhabituelle)", "Titration morphinique en SSPI puis PCA")])
    ],
    refs: [REF_DOUL, "Beloeil H et al. Essai POFA : anesthésie sans opioïdes avec dexmédétomidine. Anesthesiology 2021", "Recommandations PROSPECT (ESRA) spécifiques à la procédure"]
  };

  const titrationCalc = P17.calc({
    id: "titration", title: "Titration morphinique : bolus", desc: "Morphine IV, bolus toutes les 5 minutes",
    fields: [{ id: "poids", label: "Poids", unit: "kg" }, { id: "age", label: "Âge", unit: "ans" },
      { id: "rein", label: "Insuffisance rénale (DFG < 30)", type: "check" }],
    compute: v => {
      const t = F.titrationMorphine(v.poids, v.age);
      if (!t) return null;
      const rows = [["Intervalle", "5 min entre deux bolus"], ["Critères d'arrêt", "EN ≤ 3, sédation ≥ 2, FR < 10/min, SpO₂ < 95 %"], ["Réévaluation", "Au-delà de 10–15 mg cumulés : cause chirurgicale ?"]];
      return {
        label: "Bolus", main: `${t.bolus} mg IV`, sub: v.age >= 70 ? "Sujet de 70 ans ou plus : bolus de 2 mg" : v.poids < 60 ? "Poids < 60 kg : 2 mg" : "Poids ≥ 60 kg : 3 mg",
        rows, tone: v.rein ? "warn" : "",
        html: v.rein ? `<p class="out-sub"><strong>Insuffisance rénale :</strong> accumulation du métabolite actif de la morphine — préférer l'oxycodone titrée (1–2 mg) et allonger la surveillance.</p>` : ""
      };
    }
  });

  const titration = {
    kicker: "Analgésie postopératoire", title: "Titration morphinique en SSPI", subtitle: "Protocole infirmier sur prescription médicale",
    tags: ["Morphine IV", "Sédation", "Naloxone"],
    sections: [
      S("Indication", [ul("Douleur EN ou EVA ≥ 4 (ou > 3) malgré l'analgésie de base, chez un patient réveillé", "Avant chaque bolus : évaluer douleur, sédation, fréquence respiratoire et SpO₂")]),
      S("Protocole", [ol("Morphine : 2 mg si poids < 60 kg ou âge ≥ 70 ans, 3 mg si poids ≥ 60 kg, en IV directe", "Réévaluation 5 min après chaque bolus", "Nouveau bolus tant que l'EN est > 3 et en l'absence de critère d'arrêt", "Pas de dose maximale fixe, mais réévaluation médicale au-delà de 10–15 mg", "Relais par PCA (bolus 1 mg, période réfractaire 7 min, sans débit continu) ou morphine sous-cutanée")]),
      S("Échelle de sédation", [tbl(["Score", "État"], [["0", "Éveillé"], ["1", "Somnolent par intermittence, facilement réveillable"], ["2", "Somnolent la plupart du temps, réveillable à la parole"], ["3", "Réveillable uniquement par stimulation tactile, ou non réveillable"]], "Arrêt de la titration si score ≥ 2 : la sédation précède la dépression respiratoire.")]),
      S("Critères d'arrêt", [ul("Douleur contrôlée : EN ≤ 3", "Sédation ≥ 2", "Fréquence respiratoire < 10/min", "SpO₂ < 95 % (ou baisse par rapport à la valeur de base)", "Effets indésirables : nausées, vomissements, hypotension, prurit gênant")], { tone: "key" }),
      S("Surdosage morphinique", [danger("FR < 8/min ou sédation 3 : stimulation, oxygène, ventilation au masque si besoin, appel du médecin."), ul("Naloxone : diluer 0,4 mg dans 10 mL (0,04 mg/mL), injecter 1 mL toutes les 2–3 min jusqu'à FR > 10/min et réveil", "Durée d'action de la naloxone (30–45 min) inférieure à celle de la morphine : relais en perfusion possible et surveillance prolongée")]),
      S("Terrain particulier", [ul("Sujet âgé : bolus de 2 mg, intervalle 5–7 min, surveillance accrue de la sédation", "Insuffisance rénale : préférer l'oxycodone", "Apnées du sommeil : épargne morphinique maximale, surveillance continue de la SpO₂, position demi-assise", "Patient sous opioïdes au long cours : besoins majorés, maintenir le traitement de fond, associer kétamine")])
    ],
    refs: [REF_DOUL, "Aubrun F et al. Postoperative titration of intravenous morphine. Eur J Anaesthesiol 2001"]
  };

  const ANALG = [
    { id: "strategie-sans-opioides", fiche: strategie, desc: "Analgésie multimodale, protocole standard, adjuvants" },
    { id: "titration-morphine", fiche: titration, extra: titrationCalc, desc: "Bolus, échelle de sédation, critères d'arrêt, naloxone" }
  ];

  P17.route("#/analgesie", {
    title: "Analgésie postopératoire",
    render: () => P17.page({
      crumbs: [POSTOP, ANALGESIE], title: "Analgésie postopératoire", accent: "analgesie", icon: "analgesie",
      subtitle: "Stratégie multimodale et titration morphinique en SSPI.",
      body: P17.tiles(ANALG.map(a => ({ href: `#/analgesie/${a.id}`, title: a.fiche.title, desc: a.desc, icon: "analgesie", accent: "analgesie" })))
    })
  });
  P17.index("#/analgesie", "Analgésie postopératoire", "douleur", "Post-opératoire");
  ANALG.forEach(a => {
    const path = `#/analgesie/${a.id}`;
    P17.route(path, { title: a.fiche.title, render: () => pageFiche([POSTOP, ANALGESIE], "analgesie", path, a.fiche, a.extra) });
    P17.index(path, a.fiche.title, a.desc + " " + (a.fiche.tags || []).join(" ") + " douleur paracétamol néfopam kétamine morphine PCA", "Post-opératoire");
  });

  /* ================================ SSPI ================================ */

  const extubCalc = P17.calc({
    id: "extub", title: "Critères d'extubation", desc: "Cocher les critères remplis", kind: "tool",
    fields: [{ id: "c", label: "Critères", type: "checks", options: [
      ["neuro", "Réveillé, ouvre les yeux, répond aux ordres simples"],
      ["tof", "Rapport TOF ≥ 0,9 en monitorage quantitatif (ou décurarisation par sugammadex à la dose adaptée)"],
      ["resp", "Ventilation spontanée régulière : FR 10–30/min, Vt > 5 mL/kg"],
      ["spo2", "SpO₂ ≥ 94 % (ou valeur de base) avec FiO₂ ≤ 0,4"],
      ["toux", "Déglutition et toux efficaces"],
      ["hemo", "Hémodynamique stable, pas de saignement actif"],
      ["temp", "Température ≥ 36 °C"],
      ["vas", "Pas de contre-indication chirurgicale ni d'œdème des voies aériennes (test de fuite si besoin)"]
    ] }],
    compute: v => {
      const n = v.c.length;
      if (!n) return null;
      if (n === 8) return { tone: "ok", label: "Critères", main: "Extubation possible", sub: "Aspiration sous vision, FiO₂ 100 %, extubation en position demi-assise, oxygène ensuite et surveillance rapprochée 30 min." };
      return { tone: "warn", label: "Critères", main: `${n} / 8 critères`, sub: "Ne pas extuber : corriger les critères manquants ou réévaluer." };
    }
  });

  const extubation = {
    kicker: "Post-opératoire", title: "Extubation en SSPI", subtitle: "Critères, décurarisation, extubation à risque",
    tags: ["TOF ≥ 0,9", "Sugammadex", "Extubation à risque"],
    sections: [
      S("Décurarisation", [ul("Rapport du train de quatre ≥ 0,9 mesuré à l'adducteur du pouce avant toute extubation", "Les tests cliniques (lever de tête) ne suffisent pas")]),
      S("Technique d'extubation", [ol("Patient réveillé, critères remplis (outil ci-dessus)", "Préoxygénation FiO₂ 100 %", "Aspiration oropharyngée sous laryngoscopie ou vision directe", "Position demi-assise (obèse, apnées du sommeil)", "Dégonfler le ballonnet et retirer la sonde en fin d'inspiration (pression positive)", "Oxygène au masque, vérifier la liberté des voies aériennes et la ventilation", "Surveillance rapprochée pendant au moins 30 min")]),
      S("Extubation à risque", [ul("Facteurs : intubation difficile, obésité, apnées du sommeil, chirurgie cervicale ou des voies aériennes, œdème facial (Trendelenburg prolongé, décubitus ventral), insuffisance respiratoire, pathologie neuromusculaire", "Stratégies : extubation sur patient parfaitement réveillé, en présence d'un senior, matériel d'intubation difficile prêt", "Test de fuite au ballonnet si œdème : absence de fuite = risque de stridor", "Cathéter d'échange laissé en place, ou différer l'extubation, voire trachéotomie"), warn("En cas de doute, il est plus sûr de différer l'extubation que de réintuber en urgence.")]),
      S("Complications après l'extubation", [ul("Laryngospasme : subluxation, ventilation en pression positive FiO₂ 100 %, propofol 0,5 mg/kg, succinylcholine 0,5–1 mg/kg si persistance", "Stridor post-extubation : aérosol d'adrénaline (1–5 mg), corticoïdes IV, réintubation si épuisement", "Curarisation résiduelle : dyspnée, désaturation, diplopie — mesure du TOF, sugammadex", "Œdème pulmonaire à pression négative (après obstruction) : oxygène, PPC")])
    ],
    refs: [REF_CURARE, REF_DAS, "RFE SFAR-SFMU-SRLF : Intubation et extubation du patient de réanimation (2017)"]
  };

  const glyCalc = P17.calc({
    id: "glySSPI", title: "Glycémie capillaire en SSPI", desc: "Objectif périopératoire 5–10 mmol/L (0,9–1,8 g/L)", kind: "tool",
    fields: [{ id: "u", label: "Unité", type: "seg", options: [["gl", "g/L"], ["mmol", "mmol/L"]] }, { id: "g", label: "Glycémie", placeholder: "ex. 2,1" },
      { id: "dt1", label: "Diabète de type 1", type: "check" }, { id: "conscient", label: "Patient conscient, capable d'avaler", type: "check", value: true }],
    compute: v => {
      const m = F.glyMmol(v.g, v.u);
      if (m === null) return null;
      const gl = m / 5.551;
      const lab = `${f(m, 1)} mmol/L · ${f(gl, 2)} g/L`;
      const t1 = v.dt1 ? `<p class="out-sub"><strong>Type 1 :</strong> ne jamais arrêter l'insuline lente, quelle que soit la glycémie.</p>` : "";
      if (m < 2.2) return { tone: "danger", label: lab, main: "Hypoglycémie sévère", html: `<ul class="rx"><li><strong>G30 % 2 ampoules en IV lente</strong></li><li>Contrôle à 15 min puis à 1 h ; répéter si < 3,3 mmol/L et prévenir le médecin</li><li>Rechercher la cause (insuline, sulfamides, jeûne prolongé)</li></ul>${t1}` };
      if (m < 3.3) return { tone: "danger", label: lab, main: "Hypoglycémie", html: `<ul class="rx"><li>${v.conscient ? "<strong>Resucrage oral</strong> : 3 morceaux de sucre ou 20 cL de jus de fruit" : "<strong>G30 % en IV lente</strong> (patient ne pouvant pas avaler)"}</li><li>Contrôle à 15 min puis à 1 h ; répéter si < 3,3 mmol/L</li></ul>${t1}` };
      if (m < 8) return { tone: "ok", label: lab, main: "Pas de correction", sub: "Dans l'objectif. Contrôle selon le protocole (toutes les 1–2 h en SSPI chez le diabétique)." , html: t1 };
      if (m < 12) return { label: lab, main: "4 UI SC d'analogue rapide", sub: "Contrôle à 2–4 h", html: t1 };
      if (m < 16.5) return { tone: "warn", label: lab, main: "6 UI SC d'analogue rapide", sub: "Contrôle à 2–4 h", html: t1 };
      return { tone: "danger", label: lab, main: "10 UI SC + cétonémie", html: `<ul class="rx"><li>Cétonémie &gt; 1,5 mmol/L (ou cétonurie ≥ 2+) : insuline IV en unité de soins critiques</li><li>Cétonémie 0,5–1,5 mmol/L : rechercher une acidose (gaz du sang)</li><li>Retour à domicile contre-indiqué</li></ul>${t1}` };
    },
    note: "Schéma de correction sous-cutané SFAR-SFD 2025 (analogue rapide). L'insuline IV continue est réservée au bloc et aux unités de soins critiques."
  });

  const apfelCalc = P17.calc({
    id: "apfel", title: "Score d'Apfel", desc: "Risque de NVPO chez l'adulte sous anesthésie générale", kind: "tool",
    fields: [{ id: "r", label: "Facteurs de risque", type: "checks", options: [["f", "Sexe féminin"], ["nf", "Non-fumeur"], ["atcd", "Antécédent de NVPO ou mal des transports"], ["morph", "Morphiniques postopératoires prévus"]] }],
    compute: v => {
      const n = v.r.length; const risk = F.apfel(n);
      const strat = n <= 1 ? "Prophylaxie par 1 agent (ou 2 si chirurgie à risque : cœlioscopie, sein, strabisme…)" : n === 2 ? "Prophylaxie par 2 agents : dexaméthasone + ondansétron" : "Prophylaxie par 3 agents + anesthésie intraveineuse au propofol, épargne morphinique";
      return { label: `Score ${n} / 4`, main: `Risque ≈ ${risk} %`, sub: strat, tone: n >= 3 ? "warn" : "" };
    }
  });

  const aldreteCalc = P17.calc({
    id: "aldrete", title: "Score d'Aldrete modifié", desc: "Sortie de SSPI si score ≥ 9 et check-list complète",
    fields: [
      { id: "activite", label: "Activité motrice", type: "select", options: [["2", "2 — bouge les 4 membres"], ["1", "1 — bouge 2 membres"], ["0", "0 — aucun mouvement"]] },
      { id: "respiration", label: "Respiration", type: "select", options: [["2", "2 — respire profondément et tousse"], ["1", "1 — dyspnée ou respiration limitée"], ["0", "0 — apnée"]] },
      { id: "circulation", label: "Pression artérielle", type: "select", options: [["2", "2 — ± 20 % de la valeur de base"], ["1", "1 — ± 20 à 49 %"], ["0", "0 — ± 50 % ou plus"]] },
      { id: "conscience", label: "Conscience", type: "select", options: [["2", "2 — complètement réveillé"], ["1", "1 — réveillable à l'appel"], ["0", "0 — ne répond pas"]] },
      { id: "saturation", label: "SpO₂", type: "select", options: [["2", "2 — > 92 % à l'air"], ["1", "1 — O₂ nécessaire pour > 90 %"], ["0", "0 — < 90 % malgré l'O₂"]] }
    ],
    compute: v => {
      const s = F.aldrete({ activite: +v.activite, respiration: +v.respiration, circulation: +v.circulation, conscience: +v.conscience, saturation: +v.saturation });
      return { label: "Score", main: `${s} / 10`, sub: s >= 9 ? "Score compatible avec la sortie (vérifier la check-list)" : "Sortie non autorisée : poursuivre la surveillance", tone: s >= 9 ? "ok" : "warn" };
    }
  });

  /* Check-list de sortie : groupes affichés selon la situation du patient.
     [id, libellé, libellé court pour la liste des éléments manquants] */
  const CK = [
    { id: "rev", head: "Réveil, respiration, circulation", items: [
      ["ald", "Score d'Aldrete modifié ≥ 9", "Aldrete ≥ 9"],
      ["resp", "Respiration efficace : FR 10–20/min, SpO₂ ≥ 92 % à l'air ou sous l'oxygène habituel, toux efficace, pas de stridor", "Respiration"],
      ["curare", "Pas de curarisation résiduelle : TOF ≥ 0,9 ou décurarisation documentée", "Curarisation résiduelle"],
      ["hemo", "Hémodynamique stable (± 20 % de la valeur de base), sans vasopresseur", "Hémodynamique"],
      ["temp", "Température ≥ 36 °C, pas de frissons", "Température"]] },
    { id: "dl", head: "Douleur et sédation", items: [
      ["douleur", "Douleur contrôlée : EN ≤ 3 au repos, toux possible", "Douleur"],
      ["sedation", "Sédation ≤ 1 et FR ≥ 10/min, au moins 30 min après le dernier bolus de morphine IV", "Sédation"]] },
    { id: "nv", head: "Nausées et vomissements (NVPO)", items: [
      ["nv1", "Pas de nausées ni de vomissements, ou contrôlés après traitement", "NVPO contrôlées"],
      ["nv2", "Prophylaxie reçue tracée ; si NVPO, cause recherchée (douleur, hypotension, hypoxémie, hypoglycémie, morphiniques, distension gastrique)", "Cause des NVPO"],
      ["nv3", "Antiémétique de secours prescrit pour le service, d'une classe différente de la prophylaxie", "Antiémétique prescrit"]] },
    { id: "gl", head: "Glycémie (patient diabétique)", cond: "diab", items: [
      ["g1", "Dernière glycémie capillaire dans la cible 5–10 mmol/L (0,9–1,8 g/L), ou corrigée selon le schéma", "Glycémie dans la cible"],
      ["g2", "Aucune hypoglycémie non corrigée : si < 3,3 mmol/L (0,6 g/L), resucrage puis contrôle à 15 min", "Hypoglycémie corrigée"],
      ["g3", "Glycémie > 16,5 mmol/L (3 g/L) : cétonémie faite ; si > 1,5 mmol/L, pas de sortie en service standard", "Cétonémie si > 16,5"],
      ["g4", "Insuline sans interruption : relais SC de l'insuline IV ; insuline lente jamais arrêtée chez le type 1", "Relais de l'insuline"],
      ["g5", "Prescrit : surveillance glycémique, schéma de correction, reprise des antidiabétiques selon l'alimentation et le DFG", "Prescriptions glycémie"]] },
    { id: "ch", head: "Site opératoire et diurèse", items: [
      ["saign", "Pansements et drains vérifiés, pas de saignement anormal (débit noté)", "Pansements et drains"],
      ["urine", "Diurèse ou miction vérifiée, pas de globe vésical (échographie vésicale si doute)", "Diurèse, globe"]] },
    { id: "rachi", head: "Rachianesthésie ou péridurale", cond: "rachi", items: [
      ["ra1", "Régression du bloc moteur engagée (Bromage), niveau sensitif stable ou en régression", "Régression du bloc"],
      ["ra2", "Péridurale : produit, débit, surveillance et conduite en cas de bloc moteur prescrits", "Prescription péridurale"]] },
    { id: "bloc", head: "Bloc périphérique", cond: "bloc", items: [
      ["bl1", "Membre insensible protégé ; consignes au premier lever si bloc du quadriceps (risque de chute)", "Membre protégé"],
      ["bl2", "Cathéter : produit, débit, surveillance et numéro d'appel prescrits", "Prescription du cathéter"]] },
    { id: "am", head: "Ambulatoire", cond: "ambu", items: [
      ["am1", "Score PADSS ≥ 9 (aptitude à la rue)", "PADSS ≥ 9"],
      ["am2", "Accompagnant présent pour le retour et la nuit", "Accompagnant"],
      ["am3", "Consignes écrites, ordonnances (antalgiques, antiémétique oral), numéro d'urgence, appel du lendemain", "Consignes et ordonnances"]] },
    { id: "fin", head: "Avant de partir", items: [
      ["bio", "Résultats demandés en SSPI vérifiés (Hb, kaliémie, gaz du sang…)", "Biologie vérifiée"],
      ["presc", "Prescriptions postopératoires : analgésie, antiémétiques, thromboprophylaxie, reprise des traitements", "Prescriptions"],
      ["trans", "Transmissions orales et écrites à l'équipe du service, dossier complet", "Transmissions"],
      ["med", "Sortie validée et signée par le médecin anesthésiste-réanimateur", "Validation médicale"]] }
  ];
  const ckVisible = v => CK.filter(g => !g.cond || (v.ctx || []).includes(g.cond));

  const checklistCalc = P17.calc({
    id: "sortie", title: "Check-list de sortie de SSPI", desc: "Indiquer la situation du patient : les rubriques correspondantes s'ajoutent (glycémie, ALR, ambulatoire)", kind: "tool", wide: true, cls: "calc--checklist",
    empty: "Cocher les éléments au fur et à mesure de leur vérification.",
    fields: [
      { id: "ctx", label: "Situation du patient", type: "checks", full: true, options: [["diab", "Diabétique, ou hyperglycémie sous corticoïdes"], ["rachi", "Rachianesthésie ou péridurale"], ["bloc", "Bloc périphérique ou cathéter"], ["ambu", "Ambulatoire : retour à domicile"]] },
      ...CK.map(g => ({ id: "k_" + g.id, heading: g.head, label: "", type: "checks", full: true, options: g.items.map(it => [it[0], it[1]]), ...(g.cond ? { showIf: v => (v.ctx || []).includes(g.cond) } : {}) }))
    ],
    compute: v => {
      const groups = ckVisible(v);
      const all = groups.flatMap(g => g.items.map(it => ({ g, it, done: (v["k_" + g.id] || []).includes(it[0]) })));
      const n = all.filter(x => x.done).length, tot = all.length;
      if (!n) return null;
      if (n === tot) return { tone: "ok", label: `${n} / ${tot} éléments vérifiés`, main: "Sortie possible", sub: "Tracer l'heure de sortie, le score d'Aldrete et la signature du médecin." };
      const miss = groups.map(g => {
        const m = g.items.filter(it => !(v["k_" + g.id] || []).includes(it[0]));
        return m.length ? `<li><b>${g.head}</b> : ${m.map(it => it[2]).join(", ")}</li>` : "";
      }).join("");
      return { tone: "warn", label: `${n} / ${tot} éléments vérifiés`, main: "Sortie non autorisée", html: `<h4>Reste à vérifier</h4><ul class="rx">${miss}</ul>` };
    }
  });

  const sortie = {
    kicker: "Post-opératoire", title: "Check-list de sortie de SSPI", subtitle: "Critères de sortie, nausées et vomissements, glycémie, score d'Aldrete, transmissions et orientation",
    tags: ["Aldrete ≥ 9", "NVPO", "Glycémie 5–10 mmol/L", "Validation médicale"], toolLabel: "Check-list",
    sections: [
      S("Principes", [ul("La sortie de SSPI est une décision médicale, tracée et signée",
        "La durée minimale dépend de l'intervention et des médicaments reçus (au moins 30 min après le dernier morphinique IV)",
        "Mêmes critères pour la sortie vers le service ou vers l'unité ambulatoire",
        "Les NVPO et la glycémie du diabétique font partie de la check-list : à évaluer à l'arrivée, traiter pendant le séjour et vérifier avant la sortie")]),
      S("Score d'Aldrete modifié", [tbl(["Critère", "2", "1", "0"], [
        ["Activité motrice", "Bouge les 4 membres", "Bouge 2 membres", "Aucun mouvement"],
        ["Respiration", "Respire profondément, tousse", "Dyspnée ou respiration limitée", "Apnée"],
        ["Pression artérielle", "± 20 % de la valeur de base", "± 20 à 49 %", "± 50 % ou plus"],
        ["Conscience", "Complètement réveillé", "Réveillable à l'appel", "Ne répond pas"],
        ["SpO₂", "> 92 % à l'air", "O₂ nécessaire pour > 90 %", "< 90 % malgré l'O₂"]
      ], "Sortie possible si score ≥ 9, sans critère à 0.")], { wide: true, tool: aldreteCalc }),

      S("NVPO : conduite en SSPI", [ol("Évaluer nausées et vomissements à l'arrivée, puis avant la sortie",
        "Rechercher et traiter une cause : douleur, hypotension, hypoxémie, hypoglycémie, distension gastrique, morphiniques, mobilisation brutale",
        "Traiter avec une classe différente de la prophylaxie (la même classe répétée dans les 6 h est inefficace) : ondansétron 4 mg IV si non reçu, dropéridol 0,625 mg IV, propofol 20 mg IV (effet bref, patient surveillé)",
        "Pas de sortie tant que les vomissements persistent ; réévaluer 15–30 min après le traitement",
        "Prescrire pour le service un antiémétique de secours d'une autre classe ; en ambulatoire, un traitement oral"),
        info("Le métoclopramide 10 mg est peu efficace ; la dexaméthasone n'est pas un traitement de secours (délai d'action).")], { tone: "key" }),
      S("NVPO : prophylaxie", [ul("Privilégier l'ALR et l'anesthésie intraveineuse au propofol chez les patients à risque",
        "Éviter le protoxyde d'azote, limiter les halogénés, épargne morphinique",
        "Hydratation correcte, jeûne court (liquides clairs jusqu'à 2 h), sugammadex plutôt que néostigmine si possible"),
        tbl(["Molécule", "Dose adulte", "Moment", "Remarques"], [
          ["Dexaméthasone", "4–8 mg IV", "À l'induction", "Délai d'action ; hyperglycémie transitoire"],
          ["Ondansétron", "4 mg IV", "Fin d'intervention", "Allongement du QT, céphalées"],
          ["Dropéridol", "0,625–1,25 mg IV", "Fin d'intervention", "Allongement du QT ; effets extrapyramidaux rares"],
          ["Aprépitant", "40–80 mg per os", "Avant l'induction", "Si disponible, risque très élevé"],
          ["Scopolamine transdermique", "1 patch", "La veille ou 2 h avant", "Effets anticholinergiques (sujet âgé : confusion)"],
          ["Propofol (AIVOC)", "Entretien", "Peropératoire", "Réduit le risque d'environ 25 %"]
        ], "Nombre d'agents selon le score d'Apfel (outil ci-dessous).")], { wide: true, tool: apfelCalc }),

      S("Glycémie : surveillance et correction", [kv(["Cible", "5–10 mmol/L (0,9–1,8 g/L)"], ["Hypoglycémie", "< 3,3 mmol/L (0,6 g/L)"],
        ["Surveillance", "Glycémie capillaire à l'arrivée puis toutes les 1–2 h ; gaz du sang si instabilité"],
        ["Correction", "Analogue rapide SC selon le schéma (outil ci-dessous) ; contrôle à 2–4 h"],
        ["Au-delà de 16,5 mmol/L (3 g/L)", "Cétonémie ; si > 1,5 mmol/L : insuline IV en soins critiques"])], { tool: glyCalc }),
      S("Glycémie : relais et reprise des traitements", [ul("Insuline IV (bloc, soins critiques) : analogue rapide 1 UI/mL, voie dédiée, avec G10 % 40 mL/h ; kaliémie toutes les 4 h",
        "Arrêt de l'IV si glycémie stable ≤ 10 mmol/L, à la reprise alimentaire ou à la sortie vers une unité standard, avec relais par l'insuline basale SC sans interruption",
        "Ne jamais arrêter l'insuline lente chez le diabétique de type 1",
        "Glycémie ≤ 10 mmol/L et alimentation reprise : traitements habituels aux horaires habituels",
        "Antidiabétiques oraux (type 2) : glycémie < 12 mmol/L depuis 24 h et fonction rénale vérifiée — DFG > 60 : tous ; 30–60 : tous sauf metformine ; < 30 : pas de reprise",
        "Glycémie > 16,5 mmol/L : pas de retour à domicile, hospitalisation pour insuline IV"),
        warn("Situations à risque : dexaméthasone (hyperglycémie transitoire), gliflozines (acidocétose euglycémique : glycémie normale mais acidose et cétonémie élevée).")]),

      S("Orientation en soins critiques", [ul("Instabilité hémodynamique ou besoin persistant de vasopresseurs",
        "Insuffisance respiratoire, besoin de VNI ou d'oxygène à haut débit",
        "Saignement actif ou transfusion importante",
        "Trouble de conscience persistant, complication neurologique",
        "Acidocétose ou insuline IV à poursuivre",
        "Chirurgie ou terrain imposant une surveillance rapprochée (apnées du sommeil sévères sous morphiniques, phéochromocytome…)")], { tone: "alert" }),
      S("Ambulatoire", [ul("Critères d'aptitude à la rue (score PADSS ≥ 9) en plus des critères de sortie de SSPI",
        "PADSS : constantes, déambulation, nausées et vomissements, douleur, saignement chirurgical (chacun coté de 0 à 2)",
        "Accompagnant présent, consignes écrites, ordonnances, numéro d'urgence, appel du lendemain")])
    ],
    refs: ["SFAR : Recommandations concernant la surveillance des patients en période post-interventionnelle", "Aldrete JA. The post-anesthesia recovery score revisited. J Clin Anesth 1995",
      REF_NVPO, REF_NVPO_FR, REF_DIAB, "Chung F et al. A post-anesthetic discharge scoring system for home readiness after ambulatory surgery (PADSS). J Clin Anesth 1995"]
  };

  /* ============================ SAIGNEMENT EN SSPI ============================
     Synthèse : RFE SFAR 2015 (réanimation du choc hémorragique), ESAIC 2022
     (saignement périopératoire sévère), RFE SFMU-SFAR-GIHP 2024 (anticoagulants
     en urgence), HAS 2014 (transfusion de globules rouges). */
  const WARN = `<svg class="al-ico" viewBox="0 0 48 44" aria-hidden="true"><path d="M24 3 2.5 40.5h43Z" fill="#ffd23f" stroke="#7a1410" stroke-width="3" stroke-linejoin="round"/><path d="M24 16v12" stroke="#7a1410" stroke-width="4.5" stroke-linecap="round"/><circle cx="24" cy="34.5" r="2.7" fill="#7a1410"/></svg>`;
  P17.warnIcon = WARN;
  const TREE = `
    <div class="flow">
      <div class="fl-step fl-start"><span class="fl-num">${WARN}</span><div><b>Saignement suspecté en SSPI</b><span>Drain productif, pansement ou hématome qui augmente, tachycardie, hypotension, chute de l'hémoglobine, lactate qui monte</span></div></div>
      <div class="fl-arrow"></div>
      <div class="fl-step"><span class="fl-num">1</span><div><b>Alerter</b><span>Chirurgien et médecin senior prévenus, heure notée</span></div></div>
      <div class="fl-arrow"></div>
      <div class="fl-step"><span class="fl-num">2</span><div><b>Mesurer</b><span>Débit des drains toutes les 15 minutes · pression artérielle, fréquence cardiaque, index de choc (FC/PAS) · hémoglobine capillaire · gaz du sang avec lactate et calcium ionisé</span></div></div>
      <div class="fl-arrow"></div>
      <div class="fl-q">
        <b><span class="fl-num">3</span>Le saignement est-il grave ?</b>
        <span>Un seul critère suffit</span>
        <div class="fl-crit">
          <span><b>Instabilité</b> PAS &lt; 90, baisse ≥ 40 mmHg, PAM &lt; 65, signes de choc</span>
          <span><b>Transfusion</b> nécessaire</span>
          <span><b>Saignement non contrôlé</b></span>
          <span><b>Geste d'hémostase</b> urgent</span>
          <span><b>Localisation menaçante</b> hémothorax, hémopéritoine, hématome compressif, intracrânien</span>
        </div>
      </div>
      <div class="fl-split">
        <section class="fl-branch fl-yes">
          <header>OUI<span>Saignement grave : quatre actions en même temps</span></header>
          <div class="fl-body">
            <div class="fl-acts">
              <div class="fl-act"><h4>Réanimer</h4><ul><li>Deux voies de gros calibre, oxygène</li><li>Remplissage limité</li><li>PAS 80–90 mmHg jusqu'à l'hémostase (PAM ≥ 80 en neurochirurgie)</li><li>Noradrénaline si PAS &lt; 80</li></ul></div>
              <div class="fl-act"><h4>Hémostase médicale</h4><ul><li>Acide tranexamique 1 g en 10 min, puis 1 g sur 8 h</li><li>Fibrinogène 3 g si ≤ 1,5 g/L</li><li>Calcium ionisé &gt; 0,9 mmol/L</li><li>Température &gt; 35 °C</li></ul></div>
              <div class="fl-act"><h4>Transfuser</h4><ul><li>Globules rouges si Hb &lt; 7 g/dL (cible 7–9)</li><li>Plasma précoce, rapport 1:2 à 1:1</li><li>Plaquettes &gt; 50 G/L (&gt; 100 en neurochirurgie)</li><li>Protocole de transfusion massive</li></ul></div>
              <div class="fl-act"><h4>Antagoniser</h4><ul><li>Héparine : protamine</li><li>AVK, anti-Xa : CCP</li><li>Dabigatran : idarucizumab</li><li>Antiagrégant puissant : plaquettes</li></ul></div>
            </div>
            <div class="fl-arrow"></div>
            <div class="fl-q fl-q--in"><b><span class="fl-num">4</span>Origine chirurgicale ?</b><span>C'est la cause la plus fréquente d'un saignement postopératoire précoce</span></div>
            <div class="fl-outs">
              <div class="fl-out fl-out--red"><b>Instabilité persistante</b>Bloc opératoire ou embolisation, sans attendre la correction complète de la coagulation</div>
              <div class="fl-out fl-out--amber"><b>Patient stabilisé</b>Réanimation ou soins continus, poursuite des objectifs</div>
            </div>
          </div>
        </section>
        <section class="fl-branch fl-no">
          <header>NON<span>Saignement non grave</span></header>
          <div class="fl-body">
            <div class="fl-act"><h4>Mesures locales</h4><ul><li>Compression, pansement compressif</li><li>Lavage vésical si hématurie</li></ul></div>
            <div class="fl-act"><h4>Corriger et vérifier</h4><ul><li>Hypothermie, acidose</li><li>Antithrombotiques et héparine peropératoire</li><li>Bilan : NFS, TP, TCA, fibrinogène</li></ul></div>
            <div class="fl-arrow"></div>
            <div class="fl-act fl-act--loop"><h4>Réévaluer toutes les 15 à 30 minutes</h4></div>
            <div class="fl-outs">
              <div class="fl-out fl-out--red"><b>Aggravation</b>Passer à la colonne OUI</div>
              <div class="fl-out fl-out--green"><b>Stabilité</b>Surveillance prolongée en SSPI, avis chirurgical sur une reprise</div>
            </div>
          </div>
        </section>
      </div>
    </div>`;

  const ALERTES = [
    ["Hémodynamique", "Tachycardie, hypotension, index de choc FC/PAS ≥ 1, besoin croissant de vasopresseur, marbrures, oligurie"],
    ["Drains", "Débit élevé ou sang rouge, à mesurer toutes les 15 minutes. Un drain qui ne donne plus peut être bouché par un caillot"],
    ["Site opératoire", "Pansement imbibé, hématome expansif, distension abdominale, hématurie caillotante"],
    ["Biologie", "Chute de l'hémoglobine (attention : retardée), élévation du lactate, acidose"],
    ["Clinique", "Agitation, pâleur, soif, douleur inhabituelle, dyspnée (hémothorax), déficit neurologique (hématome intracrânien ou médullaire)"]
  ];
  const ALERTES_HTML = `<div class="alerts">${ALERTES.map(([t, d]) => `<div class="alert-card">${WARN}<div><b>${t}</b><span>${d}</span></div></div>`).join("")}</div>`;

  const saignement = {
    kicker: "Post-opératoire", title: "Saignement en SSPI", subtitle: "Reconnaître, évaluer la gravité, réanimer, corriger la coagulation et décider de l'hémostase",
    tags: ["Arbre décisionnel", "Signaux d'alerte", "Transfusion", "Antagonisation"],
    sections: [
      S("Arbre décisionnel", [{ html: TREE }], { wide: true }),
      S("Signaux d'alerte", [{ html: ALERTES_HTML }], { wide: true, tone: "alert" }),
      S("Objectifs de réanimation", [tbl(["Paramètre", "Objectif"], [
        ["Pression artérielle", "PAS 80–90 mmHg (PAM 60–65) jusqu'à l'hémostase ; PAM ≥ 80 mmHg si neurochirurgie ou traumatisme crânien"],
        ["Hémoglobine", "Transfusion si Hb < 7 g/dL, cible 7–9 g/dL (9–10 si coronarien ou traumatisme crânien)"],
        ["Plaquettes", "> 50 G/L ; > 100 G/L si neurochirurgie ou saignement persistant"],
        ["Fibrinogène", "> 1,5 g/L : concentré de fibrinogène 3 g si inférieur"],
        ["Calcium ionisé", "> 0,9 mmol/L (normal) pendant la transfusion massive"],
        ["Température", "> 35 °C, réchauffement actif"],
        ["pH, lactate", "Correction de l'hypoperfusion ; lactate en décroissance"]
      ], "D'après les RFE SFAR 2015 sur la réanimation du choc hémorragique et les recommandations ESAIC 2022.")]),
      S("Antagonisation des antithrombotiques", [tbl(["Traitement", "Antagonisation en cas de saignement grave"], [
        ["HNF", "Protamine 1 mg pour 100 UI d'héparine administrée récemment, IV lente (10 min)"],
        ["HBPM", "Protamine selon délai, dose et anti-Xa ; neutralisation partielle ; inutile si anti-Xa < 0,2 UI/mL"],
        ["AVK", "CCP 25 UI/kg (ou selon l'INR) + vitamine K 10 mg ; INR de contrôle à 30 min"],
        ["Dabigatran", "Idarucizumab 5 g IV si concentration > 50 ng/mL (> 30 si intracrânien) ou non disponible"],
        ["Anti-Xa (apixaban, rivaroxaban, edoxaban)", "CCP 50 UI/kg en cas de choc ou d'hémorragie intracrânienne ; 25–50 UI/kg sinon"],
        ["Fondaparinux", "Protamine inefficace ; CCP 25–50 UI/kg à discuter"],
        ["Ticagrélor, prasugrel", "Transfusion de plaquettes si saignement grave"]
      ], "D'après les recommandations SFMU-SFAR-GIHP 2024 sur la gestion des anticoagulants en urgence.")], { wide: true }),
      S("Particularités selon la chirurgie", [tbl(["Chirurgie", "Points spécifiques"], [
        ["Thoracique", "Hémothorax : drain > 200 mL/h pendant 2 à 4 h ou caillotage, opacité radiologique, échographie pleurale : reprise à discuter"],
        ["Viscérale", "Hémopéritoine : distension, sang dans les drains, échographie (FAST) ; hémorragie digestive (anastomose) : endoscopie"],
        ["Urologie", "Hématurie après RTUP ou RTUV : lavage continu, traction sur la sonde ; néphrectomie partielle ou NLPC : embolisation si saignement artériel"],
        ["Neurochirurgie", "Tout trouble de conscience ou déficit nouveau : scanner en urgence ; PAM ≥ 80, plaquettes > 100 G/L"],
        ["Orthopédie, traumatologie", "Hématome, drain, garrot levé ; saignement occulte (bassin, cuisse) ; acide tranexamique"],
        ["Gynécologie, sein", "Hématome de mastectomie : compression puis reprise ; saignement vaginal ou hémopéritoine après hystérectomie"],
        ["Endoscopie digestive", "Hémorragie après polypectomie ou sphinctérotomie : endoscopie d'hémostase"],
        ["Hématome cervical compressif", "Dyspnée, stridor : ouvrir la plaie au lit (agrafes, fils), appel chirurgien, contrôle des voies aériennes"]
      ])], { wide: true }),
      S("Traçabilité et suite", [ul("Noter les volumes, les produits sanguins (traçabilité transfusionnelle), les heures et les décisions",
        "Orientation en réanimation ou soins continus après un saignement grave", "Analyse en revue de morbi-mortalité si événement indésirable grave")])
    ],
    refs: ["Duranteau J et al. Recommandations sur la réanimation du choc hémorragique (SFAR 2015). Anesth Reanim 2015",
      "Kietaibl S et al. Management of severe peri-operative bleeding: guidelines from the ESAIC, second update 2022. Eur J Anaesthesiol 2023",
      "Douillet D et al. Recommandations SFMU-SFAR-GIHP-SFTH sur la gestion de l'anticoagulation dans un contexte d'urgence. Ann Fr Med Urgence 2024",
      "HAS 2014 : Transfusion de globules rouges homologues : produits, indications, alternatives"]
  };

  const SSPI = [
    { id: "extubation", fiche: extubation, extra: extubCalc, desc: "Critères, décurarisation, extubation à risque" },
    { id: "saignement", fiche: saignement, extra: "", desc: "Arbre décisionnel, objectifs, transfusion, antagonisation" },
    { id: "sortie", fiche: sortie, extra: checklistCalc, desc: "Aldrete, NVPO, glycémie, transmissions, orientation",
      kw: "glycémie insuline hypoglycémie diabète cétonémie NVPO nausées vomissements Apfel ondansétron dropéridol PADSS ambulatoire" }
  ];

  // La page « SSPI » est remplacée par la page Post-opératoire (plus de liste en double)
  P17.redirect("#/sspi", "#/postop");
  SSPI.forEach(a => {
    const path = `#/sspi/${a.id}`;
    P17.route(path, { title: a.fiche.title, render: () => pageFiche([POSTOP], "sspi", path, a.fiche, a.extra) });
    P17.index(path, a.fiche.title, a.desc + " " + (a.fiche.tags || []).join(" ") + " SSPI salle de réveil " + (a.kw || ""), "Post-opératoire");
  });
  // Anciennes adresses : NVPO et glycémie sont désormais dans la check-list de sortie
  ["nvpo", "glycemie"].forEach(id => P17.redirect(`#/sspi/${id}`, "#/sspi/sortie"));
})();
