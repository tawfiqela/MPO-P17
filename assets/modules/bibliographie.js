/* =====================================================================
   Bibliographie : sélection d'articles et de recommandations à lire.
   Chaque jour, trois lectures de thèmes différents sont proposées
   (rotation déterministe selon la date, identique pour tous, hors ligne).
   Pour ajouter une lecture : [auteurs, titre, revue, année, à retenir]
   dans le thème voulu ; le lien PubMed est construit à partir du titre.
   ===================================================================== */
(function () {
  const SEC = "Bibliographie";
  const LECTURES = {
    "Ventilation et poumon": [
      ["ARDS Network", "Ventilation with lower tidal volumes as compared with traditional tidal volumes for acute lung injury and the acute respiratory distress syndrome", "N Engl J Med", 2000, "Vt 6 mL/kg de poids prédit et Pplat ≤ 30 cmH₂O réduisent la mortalité du SDRA : la base de la ventilation protectrice."],
      ["Guérin C et al.", "Prone positioning in severe acute respiratory distress syndrome", "N Engl J Med", 2013, "PROSEVA : décubitus ventral précoce et prolongé (≥ 16 h) si P/F < 150, baisse nette de la mortalité."],
      ["Amato MBP et al.", "Driving pressure and survival in the acute respiratory distress syndrome", "N Engl J Med", 2015, "La pression motrice (Pplat − PEP) est la variable ventilatoire la plus liée à la survie."],
      ["Futier E et al.", "A trial of intraoperative low-tidal-volume ventilation in abdominal surgery", "N Engl J Med", 2013, "IMPROVE : ventilation protectrice au bloc (Vt bas, PEP, recrutement) et moins de complications postopératoires."],
      ["PROVHILO Investigators", "High versus low positive end-expiratory pressure during general anaesthesia for open abdominal surgery", "Lancet", 2014, "Une PEP élevée systématique au bloc n'apporte pas de bénéfice et expose à l'hypotension."],
      ["Frat JP et al.", "High-flow oxygen through nasal cannula in acute hypoxemic respiratory failure", "N Engl J Med", 2015, "FLORALI : l'oxygénothérapie à haut débit dans l'insuffisance respiratoire aiguë hypoxémique."],
      ["Combes A et al.", "Extracorporeal membrane oxygenation for severe acute respiratory distress syndrome", "N Engl J Med", 2018, "EOLIA : place de l'ECMO veino-veineuse dans le SDRA très sévère."],
      ["Schjørring OL et al.", "Lower or higher oxygenation targets for acute hypoxemic respiratory failure", "N Engl J Med", 2021, "HOT-ICU : une cible de PaO₂ autour de 60 mmHg n'est pas inférieure à 90 mmHg."]
    ],
    "Sepsis et hémodynamique": [
      ["Singer M et al.", "The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3)", "JAMA", 2016, "Définitions actuelles : dysfonction d'organe (SOFA ≥ 2) et choc septique (vasopresseur + lactate > 2)."],
      ["Evans L et al.", "Surviving Sepsis Campaign: international guidelines for management of sepsis and septic shock 2021", "Intensive Care Med", 2021, "Les recommandations internationales de référence pour le sepsis."],
      ["Asfar P et al.", "High versus low blood-pressure target in patients with septic shock", "N Engl J Med", 2014, "SEPSISPAM : PAM 65–70 mmHg suffit ; viser plus haut chez l'hypertendu chronique limite l'EER."],
      ["Annane D et al.", "Hydrocortisone plus fludrocortisone for adults with septic shock", "N Engl J Med", 2018, "APROCCHSS : l'association hydrocortisone-fludrocortisone réduit la mortalité du choc septique."],
      ["Hernández G et al.", "Effect of a resuscitation strategy targeting peripheral perfusion status vs serum lactate levels on 28-day mortality among patients with septic shock", "JAMA", 2019, "ANDROMEDA-SHOCK : guider la réanimation sur le temps de recoloration capillaire."],
      ["Russell JA et al.", "Vasopressin versus norepinephrine infusion in patients with septic shock", "N Engl J Med", 2008, "VASST : la vasopressine en épargne de noradrénaline, sans gain de mortalité global."],
      ["Semler MW et al.", "Balanced crystalloids versus saline in critically ill adults", "N Engl J Med", 2018, "SMART : moins d'événements rénaux majeurs avec les cristalloïdes balancés qu'avec le NaCl 0,9 %."],
      ["Finfer S et al.", "Balanced multielectrolyte solution versus saline in critically ill adults", "N Engl J Med", 2022, "PLUS : pas de différence de mortalité ; à lire avec SMART et BaSICS."]
    ],
    "Anesthésie et périopératoire": [
      ["Halvorsen S et al.", "2022 ESC Guidelines on cardiovascular assessment and management of patients undergoing non-cardiac surgery", "Eur Heart J", 2022, "Évaluation cardiaque préopératoire, troponine, gestion des traitements : la référence actuelle."],
      ["Futier E et al.", "Effect of individualized vs standard blood pressure management strategies on postoperative organ dysfunction among high-risk patients undergoing major surgery", "JAMA", 2017, "INPRESS : maintenir la pression proche de la valeur de base réduit les dysfonctions d'organe."],
      ["Myles PS et al.", "Restrictive versus liberal fluid therapy for major abdominal surgery", "N Engl J Med", 2018, "RELIEF : un remplissage trop restrictif augmente l'insuffisance rénale aiguë."],
      ["Writing Committee for the VISION Study Investigators", "Association of postoperative high-sensitivity troponin levels with myocardial injury and 30-day mortality among patients undergoing noncardiac surgery", "JAMA", 2017, "Le dosage systématique de la troponine révèle des lésions myocardiques silencieuses et pronostiques."],
      ["Devereaux PJ et al.", "Effects of extended-release metoprolol succinate in patients undergoing non-cardiac surgery (POISE trial)", "Lancet", 2008, "POISE : débuter un bêtabloquant juste avant la chirurgie augmente les AVC et la mortalité."],
      ["Gustafsson UO et al.", "Guidelines for perioperative care in elective colorectal surgery: Enhanced Recovery After Surgery (ERAS) Society recommendations: 2018", "World J Surg", 2019, "Le socle de la réhabilitation améliorée après chirurgie colorectale."],
      ["Neuman MD et al.", "Spinal anesthesia or general anesthesia for hip surgery in older adults", "N Engl J Med", 2021, "REGAIN : rachianesthésie et anesthésie générale équivalentes sur la marche et le délire après fracture de hanche."]
    ],
    "Voies aériennes": [
      ["Frerk C et al.", "Difficult Airway Society 2015 guidelines for management of unanticipated difficult intubation in adults", "Br J Anaesth", 2015, "Les algorithmes plans A à D, jusqu'à l'abord cervical."],
      ["Apfelbaum JL et al.", "2022 American Society of Anesthesiologists Practice Guidelines for Management of the Difficult Airway", "Anesthesiology", 2022, "Recommandations ASA actualisées sur l'intubation difficile prévue et imprévue."],
      ["Russotto V et al.", "Intubation practices and adverse peri-intubation events in critically ill patients from 29 countries", "JAMA", 2021, "INTUBE : 45 % d'événements graves à l'intubation en réanimation, surtout l'instabilité hémodynamique."],
      ["Casey JD et al.", "Bag-mask ventilation during tracheal intubation of critically ill adults", "N Engl J Med", 2019, "PreVent : la ventilation au masque pendant l'induction réduit les hypoxémies sévères."],
      ["Prekker ME et al.", "Video versus direct laryngoscopy for tracheal intubation of critically ill adults", "N Engl J Med", 2023, "DEVICE : plus de succès au premier essai avec le vidéolaryngoscope."]
    ],
    "Transfusion et hémostase": [
      ["Hébert PC et al.", "A multicenter, randomized, controlled clinical trial of transfusion requirements in critical care", "N Engl J Med", 1999, "TRICC : un seuil transfusionnel à 7 g/dL est aussi sûr qu'à 10 g/dL."],
      ["Holst LB et al.", "Lower versus higher hemoglobin threshold for transfusion in septic shock", "N Engl J Med", 2014, "TRISS : seuil à 7 g/dL dans le choc septique, avec moitié moins de transfusions."],
      ["Holcomb JB et al.", "Transfusion of plasma, platelets, and red blood cells in a 1:1:1 vs a 1:1:2 ratio and mortality in patients with severe trauma", "JAMA", 2015, "PROPPR : le ratio 1:1:1 améliore l'hémostase et réduit les décès par exsanguination."],
      ["CRASH-2 trial collaborators", "Effects of tranexamic acid on death, vascular occlusive events, and blood transfusion in trauma patients with significant haemorrhage", "Lancet", 2010, "Acide tranexamique dans les 3 heures après un traumatisme hémorragique."],
      ["Devereaux PJ et al.", "Tranexamic acid in patients undergoing noncardiac surgery", "N Engl J Med", 2022, "POISE-3 : l'acide tranexamique réduit les saignements graves en chirurgie non cardiaque."],
      ["Rossaint R et al.", "The European guideline on management of major bleeding and coagulopathy following trauma: sixth edition", "Crit Care", 2023, "Les recommandations européennes sur l'hémorragie massive du traumatisé."]
    ],
    "Curares, réveil et SSPI": [
      ["Thilen SR et al.", "2023 American Society of Anesthesiologists Practice Guidelines for Monitoring and Antagonism of Neuromuscular Blockade", "Anesthesiology", 2023, "Monitorage quantitatif obligatoire, TOF ≥ 0,9 avant extubation, sugammadex pour le bloc profond."],
      ["Kirmeier E et al.", "Post-anaesthesia pulmonary complications after use of muscle relaxants (POPULAR): a multicentre, prospective observational study", "Lancet Respir Med", 2019, "Les curares sont associés aux complications pulmonaires postopératoires."],
      ["Gan TJ et al.", "Fourth consensus guidelines for the management of postoperative nausea and vomiting", "Anesth Analg", 2020, "Facteurs de risque, prophylaxie multimodale et traitement des NVPO."],
      ["Apfel CC et al.", "A factorial trial of six interventions for the prevention of postoperative nausea and vomiting", "N Engl J Med", 2004, "IMPACT : chaque antiémétique réduit le risque d'environ un quart, et leurs effets s'additionnent."],
      ["Corcoran TB et al.", "Dexamethasone and surgical-site infection", "N Engl J Med", 2021, "PADDI : la dexaméthasone 8 mg n'augmente pas les infections du site opératoire."]
    ],
    "Anesthésie locorégionale": [
      ["Neal JM et al.", "The Third American Society of Regional Anesthesia and Pain Medicine Practice Advisory on Local Anesthetic Systemic Toxicity: Executive Summary 2017", "Reg Anesth Pain Med", 2018, "Prévention, reconnaissance et traitement de la toxicité systémique des anesthésiques locaux."],
      ["Horlocker TT et al.", "Regional Anesthesia in the Patient Receiving Antithrombotic or Thrombolytic Therapy: American Society of Regional Anesthesia and Pain Medicine Evidence-Based Guidelines (Fourth Edition)", "Reg Anesth Pain Med", 2018, "Délais entre anticoagulants et gestes périmédullaires ou profonds."]
    ],
    "Neurologie, sédation et délire": [
      ["Devlin JW et al.", "Clinical Practice Guidelines for the Prevention and Management of Pain, Agitation/Sedation, Delirium, Immobility, and Sleep Disruption in Adult Patients in the ICU", "Crit Care Med", 2018, "PADIS : douleur, sédation légère, délire, mobilisation et sommeil."],
      ["Girard TD et al.", "Efficacy and safety of a paired sedation and ventilator weaning protocol for mechanically ventilated patients in intensive care (Awakening and Breathing Controlled trial)", "Lancet", 2008, "Coupler fenêtre de sédation et épreuve de ventilation spontanée réduit la mortalité."],
      ["Shehabi Y et al.", "Early sedation with dexmedetomidine in critically ill patients", "N Engl J Med", 2019, "SPICE III : la dexmédétomidine précoce ne réduit pas la mortalité."],
      ["Andersen-Ranberg NC et al.", "Haloperidol for the treatment of delirium in ICU patients", "N Engl J Med", 2022, "AID-ICU : l'halopéridol ne raccourcit pas le délire mais n'est pas délétère."],
      ["Carney N et al.", "Guidelines for the Management of Severe Traumatic Brain Injury, Fourth Edition", "Neurosurgery", 2017, "Recommandations de la Brain Trauma Foundation : PIC, PPC, osmothérapie."],
      ["Evered L et al.", "Recommendations for the nomenclature of cognitive change associated with anaesthesia and surgery-2018", "Br J Anaesth", 2018, "Délire postopératoire et troubles neurocognitifs périopératoires : la nomenclature commune."]
    ],
    "Rein et métabolisme": [
      ["Gaudry S et al.", "Initiation strategies for renal-replacement therapy in the intensive care unit", "N Engl J Med", 2016, "AKIKI : attendre un critère d'urgence évite l'EER chez près de la moitié des patients."],
      ["STARRT-AKI Investigators", "Timing of initiation of renal-replacement therapy in acute kidney injury", "N Engl J Med", 2020, "Une EER accélérée ne réduit pas la mortalité et augmente la dépendance à la dialyse."],
      ["NICE-SUGAR Study Investigators", "Intensive versus conventional glucose control in critically ill patients", "N Engl J Med", 2009, "Une cible glycémique stricte (0,8–1,1 g/L) augmente la mortalité : viser < 1,8 g/L."],
      ["Singer P et al.", "ESPEN guideline on clinical nutrition in the intensive care unit", "Clin Nutr", 2019, "Nutrition entérale précoce et progressive, apports protéiques."],
      ["Reignier J et al.", "Enteral versus parenteral early nutrition in ventilated adults with shock: a randomised, controlled, multicentre, open-label, parallel-group study (NUTRIREA-2)", "Lancet", 2018, "Pas de bénéfice de l'entérale précoce dans le choc, plus de complications digestives."]
    ],
    "Infection et antibiothérapie": [
      ["Harris PNA et al.", "Effect of Piperacillin-Tazobactam vs Meropenem on 30-Day Mortality for Patients With E coli or Klebsiella pneumoniae Bloodstream Infection and Ceftriaxone Resistance", "JAMA", 2018, "MERINO : le méropénème reste la référence des bactériémies à entérobactérie BLSE."],
      ["Paul M et al.", "European Society of Clinical Microbiology and Infectious Diseases (ESCMID) guidelines for the treatment of infections caused by multidrug-resistant Gram-negative bacilli", "Clin Microbiol Infect", 2022, "Recommandations européennes sur les BGN multirésistants."],
      ["Bouadma L et al.", "Use of procalcitonin to reduce patients' exposure to antibiotics in intensive care units (PRORATA trial)", "Lancet", 2010, "La procalcitonine guide la désescalade et raccourcit l'antibiothérapie."],
      ["Kalil AC et al.", "Management of Adults With Hospital-acquired and Ventilator-associated Pneumonia: 2016 Clinical Practice Guidelines by the Infectious Diseases Society of America and the American Thoracic Society", "Clin Infect Dis", 2016, "Diagnostic et traitement des pneumonies nosocomiales, durée de 7 jours."]
    ],
    "Arrêt cardiaque et urgences": [
      ["Dankiewicz J et al.", "Hypothermia versus Normothermia after Out-of-Hospital Cardiac Arrest", "N Engl J Med", 2021, "TTM2 : prévenir la fièvre suffit, l'hypothermie à 33 °C n'apporte rien."],
      ["Nolan JP et al.", "European Resuscitation Council and European Society of Intensive Care Medicine guidelines 2021: post-resuscitation care", "Intensive Care Med", 2021, "La prise en charge après le retour à une circulation spontanée."],
      ["Lichtenstein DA, Mezière GA", "Relevance of lung ultrasound in the diagnosis of acute respiratory failure: the BLUE protocol", "Chest", 2008, "Le protocole d'échographie pulmonaire face à une détresse respiratoire."]
    ]
  };

  // Nouveautés hebdomadaires (biblio-nouveautes.js) : rangées dans leur thème, en tête
  const NEWS = (window.P17_BIBLIO_NEWS || []).filter(w => w && Array.isArray(w.lectures) && w.lectures.length);
  NEWS.slice().reverse().forEach(w => w.lectures.forEach(([th, aut, titre, revue, an, ret, lien]) => {
    const t = LECTURES[th] ? th : "Anesthésie et périopératoire";
    if (!LECTURES[t].some(a => a[1] === titre)) LECTURES[t].unshift([aut, titre, revue, an, ret, lien]);
  }));

  // Liste aplatie en alternant les thèmes : deux lectures voisines n'ont jamais le même thème
  const THEMES = Object.keys(LECTURES);
  const ALL = [];
  for (let i = 0, more = true; more; i++) {
    more = false;
    THEMES.forEach(t => { const a = LECTURES[t][i]; if (a) { ALL.push({ theme: t, a }); more = true; } });
  }
  const jour = () => { const d = new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000); };
  const duJour = (n = 3) => { const start = (jour() * n) % ALL.length; return Array.from({ length: n }, (_, k) => ALL[(start + k) % ALL.length]); };
  const pubmed = t => `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(t)}`;
  const carte = ({ theme, a: [aut, titre, revue, an, retenir, lien] }, big) => `
    <article class="lec${big ? " lec--day" : ""}">
      ${big ? `<span class="lec-theme">${P17.esc(theme)}</span>` : ""}
      <h3 class="lec-title"><a href="${P17.esc(lien && /^https:\/\//.test(lien) ? lien : pubmed(titre))}" target="_blank" rel="noopener noreferrer">${P17.esc(titre)}</a></h3>
      <p class="lec-src">${P17.esc(aut)} · <em>${P17.esc(revue)}</em> ${an}</p>
      <p class="lec-ret">${P17.esc(retenir)}</p>
    </article>`;
  const dateFr = () => new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  P17.route("#/bibliographie", {
    title: SEC,
    render: () => P17.page({
      crumbs: [[SEC, "#/bibliographie"]], title: SEC, accent: "bibliographie", icon: "bibliographie",
      subtitle: "Chaque lundi, une sélection de nouveautés ; chaque jour, trois lectures de référence sur des thèmes différents.",
      body: `
        ${NEWS.length ? `<section class="lec-day lec-news accent-bibliographie">
          <h2 class="lec-h">Nouveautés de la semaine du ${P17.esc(new Date(NEWS[0].semaine + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }))}</h2>
          <div class="lec-grid">${NEWS[0].lectures.map(([th, aut, titre, revue, an, ret, lien]) => carte({ theme: th, a: [aut, titre, revue, an, ret, lien] }, true)).join("")}</div>
        </section>` : ""}
        <section class="lec-day accent-bibliographie">
          <h2 class="lec-h">Sélection du ${P17.esc(dateFr())}</h2>
          <div class="lec-grid">${duJour().map(x => carte(x, true)).join("")}</div>
        </section>
        <h2 class="lec-h lec-h--all">Toute la sélection (${ALL.length} lectures)</h2>
        ${P17.accordion("biblio", THEMES.map((t, i) => ({ id: "t" + i, icon: "bibliographie", title: t, n: LECTURES[t].length, html: `<div class="lec-list">${LECTURES[t].map(a => carte({ theme: t, a })).join("")}</div>` })))}`
    })
  });
  P17.index("#/bibliographie", "Bibliographie : lectures recommandées", "articles recommandations références lecture du jour essais SDRA sepsis transfusion intubation curares NVPO délire EER antibiotiques arrêt cardiaque", SEC);
})();
