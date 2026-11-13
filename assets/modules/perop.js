/* =====================================================================
   Per-opératoire : médicaments d'anesthésie, voies aériennes et estomac
   plein, rachianesthésie, antibioprophylaxie (outil), transfusion et
   épargne sanguine. Et thromboprophylaxie, rangée dans Post-opératoire.
   ===================================================================== */
(function () {
  const { S, ul, ol, kv, tbl, warn, danger, info } = P17.h;
  const F = window.P17Calc;
  const f = P17.fmt;
  const SEC = "Per-opératoire";
  const ROOT = "#/perop";
  const r0 = x => f(Math.round(x), 0);
  const r5 = x => f(Math.round(x / 5) * 5, 0);
  const rows = list => `<dl class="out-rows out-rows--doses">${list.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>`;
  const btns = (...l) => ({ html: `<p class="btn-row">${l.map(([h, t]) => `<a class="btn btn--ghost" href="${h}">${t}</a>`).join(" ")}</p>` });

  /* ============================ MÉDICAMENTS ============================ */
  const medTool = P17.calc({
    id: "medInduction", kind: "tool", title: "Doses d'induction", desc: "Chez l'obèse, chaque médicament est calculé sur le poids qui lui convient",
    fields: [
      { id: "sexe", label: "Sexe", type: "seg", options: [["H", "Homme"], ["F", "Femme"]] },
      { id: "poids", label: "Poids", unit: "kg", placeholder: "ex. 70" },
      { id: "taille", label: "Taille", unit: "cm", placeholder: "ex. 170" },
      { id: "age", label: "Âge", unit: "ans", placeholder: "ex. 55" }
    ],
    compute: v => {
      const p = F.poidsDose(v.sexe, v.taille, v.poids);
      if (!p) return null;
      const old = v.age >= 65;
      const M = p.maigre, I = p.ideal, R = p.reel;
      const head = p.imc === null ? "Taille non renseignée : calcul sur le poids réel"
        : p.obese ? `IMC ${f(p.imc, 1)} : masse maigre ${r0(M)} kg, poids idéal ${r0(I)} kg` : `IMC ${f(p.imc, 1)} : calcul sur le poids réel`;
      return { html: `<div class="out-label">${head}${old ? " · 65 ans ou plus : doses réduites" : ""}</div>` + rows([
        ["Propofol", old ? `${r5(M)} à ${r5(1.5 * M)} mg (1–1,5 mg/kg)` : `${r5(1.5 * M)} à ${r5(2.5 * M)} mg (1,5–2,5 mg/kg)`],
        ["Étomidate", `${r0(0.2 * M)} à ${r0(0.3 * M)} mg (0,2–0,3 mg/kg)`],
        ["Kétamine", `${r5(M)} à ${r5(2 * M)} mg (1–2 mg/kg)`],
        ["Sufentanil", old ? `${r0(0.1 * M)} à ${r0(0.2 * M)} µg (0,1–0,2 µg/kg)` : `${r0(0.2 * M)} à ${r0(0.3 * M)} µg (0,2–0,3 µg/kg)`],
        ["Rocuronium", `${r5(0.6 * I)} mg (0,6 mg/kg) ; séquence rapide ${r5(I)} à ${r5(1.2 * I)} mg`],
        ["Atracurium", `${r5(0.5 * I)} mg (0,5 mg/kg)`],
        ["Cisatracurium", `${r0(0.15 * I)} mg (0,15 mg/kg)`],
        ["Succinylcholine (poids réel)", `${r5(R)} mg (1 mg/kg)`],
        ["Sugammadex (poids réel)", `${r0(2 * R)} mg si TOF ≥ 2 réponses ; ${r0(4 * R)} mg si bloc profond ; ${r0(16 * R)} mg en urgence`],
        ["Néostigmine + atropine", `${f(Math.min(0.04 * R, 5), 1)} mg + ${f(Math.min(0.015 * R, 1.2), 1)} mg (TOF à 4 réponses)`]
      ]) };
    },
    note: "Obèse (IMC ≥ 30) : hypnotiques et morphiniques sur la masse maigre, curares non dépolarisants sur le poids idéal, succinylcholine et sugammadex sur le poids réel. Titrer selon l'effet et le terrain."
  });

  const MEDS = {
    title: "Médicaments d'anesthésie", subtitle: "Doses usuelles chez l'adulte, dilutions et antagonistes",
    tags: ["Induction", "Curares", "Antagonistes", "Vasopresseurs"], tool: medTool, toolLabel: "Doses d'induction",
    sections: [
      S("Hypnotiques", [tbl(["Médicament", "Dose", "À savoir"], [
        ["Propofol", "1,5–2,5 mg/kg ; 1–1,5 mg/kg après 65 ans ou si ASA ≥ 3. Entretien 4–10 mg/kg/h ou cible 3–6 µg/mL", "Hypotension, douleur à l'injection ; effet antiémétique"],
        ["Étomidate", "0,2–0,3 mg/kg", "État hémodynamique précaire ; myoclonies ; inhibition surrénalienne transitoire"],
        ["Kétamine", "1–2 mg/kg IV", "Choc, asthme ; préserve la ventilation ; effets psychodysleptiques"],
        ["Thiopental", "3–5 mg/kg", "Séquence rapide ; hypotension ; contre-indiqué en cas de porphyrie"],
        ["Midazolam", "1–2 mg titrés (0,02–0,05 mg/kg)", "Anxiolyse, sédation ; prudence chez le sujet âgé"]
      ])], { wide: true }),
      S("Morphiniques", [tbl(["Médicament", "Dose", "À savoir"], [
        ["Sufentanil", "0,2–0,3 µg/kg à l'induction, puis 5–10 µg selon la stimulation", "Dernière injection 30 à 45 minutes avant la fin"],
        ["Fentanyl", "2–3 µg/kg", "Accumulation en cas de doses répétées"],
        ["Alfentanil", "10–20 µg/kg", "Gestes courts"],
        ["Morphine", "0,1 mg/kg IV, 30 à 45 minutes avant la fin", "Relais analgésique ; réduire chez le sujet âgé et l'insuffisant rénal"]
      ])], { wide: true }),
      S("Curares", [tbl(["Médicament", "Dose d'intubation", "Durée", "À savoir"], [
        ["Succinylcholine", "1 mg/kg (poids réel)", "5–10 min", "Contre-indiquée : hyperkaliémie, brûlure ou dénervation de plus de 24 h, alitement prolongé, myopathie, antécédent d'hyperthermie maligne"],
        ["Rocuronium", "0,6 mg/kg ; 1–1,2 mg/kg en séquence rapide", "30–60 min", "Antagonisé par le sugammadex à tous les niveaux de bloc"],
        ["Atracurium", "0,5 mg/kg", "30–40 min", "Histaminolibération ; élimination indépendante du rein et du foie"],
        ["Cisatracurium", "0,15 mg/kg", "40–60 min", "Insuffisance rénale ou hépatique"]
      ], "Monitorage quantitatif à l'adducteur du pouce pour toute curarisation. Extubation si le rapport du train de quatre est ≥ 0,9.")], { wide: true }),
      S("Antagonistes", [tbl(["Médicament", "Dose", "Indication"], [
        ["Sugammadex", "2 mg/kg ; 4 mg/kg ; 16 mg/kg", "Rocuronium : TOF ≥ 2 réponses ; bloc profond (1–2 réponses au compte post-tétanique) ; réversion immédiate"],
        ["Néostigmine + atropine", "40 µg/kg + 15–20 µg/kg", "Curares non dépolarisants, seulement avec 4 réponses au train de quatre ; délai de 10 à 20 minutes"],
        ["Naloxone", "0,04 mg toutes les 2–3 minutes (0,4 mg dans 10 mL)", "Dépression respiratoire morphinique ; durée d'action plus courte que la morphine"],
        ["Flumazénil", "0,2 mg, puis 0,1 mg par minute, 1 mg au maximum", "Surdosage en benzodiazépine ; risque de convulsions"]
      ])], { wide: true }),
      S("Vasopresseurs et médicaments de l'hémodynamique", [tbl(["Médicament", "Dilution usuelle", "Dose"], [
        ["Éphédrine", "30 mg dans 10 mL : 3 mg/mL", "3–9 mg ; efficacité décroissante après 30 mg"],
        ["Phényléphrine", "50 à 100 µg/mL", "50–100 µg ; bradycardie réflexe"],
        ["Noradrénaline", "10 µg/mL pour les bolus", "5–10 µg en bolus ; 0,05–0,5 µg/kg/min en continu"],
        ["Atropine", "0,5 ou 1 mg par ampoule", "10–20 µg/kg (0,5–1 mg)"],
        ["Adrénaline", "1 mg dans 10 mL : 100 µg/mL, puis au dixième : 10 µg/mL", "10–100 µg titrés selon la gravité ; 1 mg dans l'arrêt cardiaque"],
        ["Nicardipine", "1 mg/mL", "0,5–1 mg en bolus, puis 1–4 mg/h"],
        ["Urapidil", "5 mg/mL", "10–25 mg en bolus"],
        ["Esmolol", "10 mg/mL", "0,5 mg/kg en bolus"]
      ])], { wide: true }),
      S("Agents inhalés", [kv(["Sévoflurane", "CAM 2 % à 40 ans"], ["Desflurane", "CAM 6 % ; irritant, pas d'induction au masque"], ["Isoflurane", "CAM 1,15 %"], ["Âge", "La CAM baisse d'environ 6 % par décennie"], ["Contre-indication", "Antécédent personnel ou familial d'hyperthermie maligne"])])
    ],
    refs: ["RFE SFAR 2018 : Curarisation et décurarisation en anesthésie (Plaud B et al., Anaesth Crit Care Pain Med 2020)", "Nightingale CE et al. Peri-operative management of the obese surgical patient 2015. Anaesthesia 2015", "Janmahasatian S et al. Quantification of lean bodyweight. Clin Pharmacokinet 2005", "Résumés des caractéristiques des produits (base de données publique des médicaments)"]
  };

  /* ====================== VOIES AÉRIENNES, ESTOMAC PLEIN ====================== */
  const VAS = {
    title: "Voies aériennes et estomac plein", subtitle: "Dépister la difficulté, préoxygéner, choisir la stratégie, induire en séquence rapide",
    tags: ["Préoxygénation", "Vidéolaryngoscope", "Séquence rapide", "Échographie gastrique"],
    sections: [
      S("Dépister la difficulté", [tbl(["Risque", "Critères"], [
        ["Intubation difficile", "Antécédent d'intubation difficile, Mallampati 3 ou 4, ouverture de bouche < 35 mm, distance thyro-mentonnière < 65 mm, mobilité cervicale réduite, rétrognathie"],
        ["Ventilation au masque difficile", "Au moins deux critères : âge > 55 ans, IMC > 26, barbe, édentation, ronflement ; limitation de la protrusion mandibulaire"],
        ["Désaturation rapide", "Obésité, grossesse, hypoxémie, sepsis, occlusion"]
      ])], { wide: true }),
      S("Préoxygéner", [ul("Masque étanche, oxygène pur pendant 3 minutes à volume courant, ou 8 inspirations profondes en 1 minute", "Objectif : fraction expirée d'oxygène supérieure à 90 %", "Position proclive de 25 à 30° chez l'obèse", "Patient hypoxémique ou obèse : ventilation non invasive (aide inspiratoire et pression expiratoire positive) ou oxygène à haut débit", "Poursuivre l'apport d'oxygène pendant l'apnée")]),
      S("Choisir la stratégie", [tbl(["Situation", "Stratégie"], [
        ["Aucun critère de difficulté", "Laryngoscopie directe ou vidéolaryngoscope, mandrin long béquillé disponible"],
        ["Intubation difficile prévue, ventilation possible", "Vidéolaryngoscope d'emblée, curarisation, dispositif supraglottique prêt"],
        ["Intubation et ventilation difficiles prévues", "Intubation vigile sous fibroscope, en ventilation spontanée"],
        ["Dans tous les cas", "Annoncer à l'équipe le plan en cas d'échec avant d'induire"]
      ])], { wide: true }),
      S("Reconnaître l'estomac plein", [ul("Urgence, jeûne non respecté, occlusion, hémorragie digestive, vomissements", "Reflux sévère, hernie hiatale, gastroparésie diabétique, traitement par agoniste du GLP-1", "Douleur intense, morphiniques, traumatisme récent", "Grossesse à partir du deuxième trimestre"),
        kv(["Échographie de l'antre gastrique", "Antre vide : estomac vide. Liquide clair de moins de 1,5 mL/kg : risque faible. Contenu solide ou volume supérieur à 1,5 mL/kg : estomac plein"])]),
      S("Induction en séquence rapide", [ol("Vidange gastrique par sonde en cas d'occlusion ; aspiration prête, patient en proclive", "Préoxygénation rigoureuse", "Hypnotique d'action rapide : propofol 2–2,5 mg/kg, étomidate 0,3 mg/kg ou kétamine 2–3 mg/kg selon l'hémodynamique", "Curare d'action rapide : succinylcholine 1 mg/kg ou rocuronium 1–1,2 mg/kg, avec sugammadex disponible", "Pas de ventilation au masque avant l'intubation, sauf hypoxémie : insufflations douces à moins de 15 cmH₂O", "Intubation orotrachéale, ballonnet gonflé avant toute ventilation ; contrôle par capnographie", "Extubation patient réveillé, réflexes récupérés"),
        info("La pression cricoïdienne n'est plus systématique : elle n'a pas montré de bénéfice et peut gêner la laryngoscopie (essai IRIS). Si elle est appliquée, la relâcher en cas de difficulté.")], { wide: true, tone: "key" }),
      S("En cas d'inhalation", [ul("Tête basse et latérale, aspiration du pharynx, intubation, aspiration trachéale avant de ventiler", "Fibroscopie bronchique si des particules solides sont inhalées", "Ni antibiotique ni corticoïde systématiques", "Surveillance de la SpO₂ ; patient asymptomatique après 2 heures : pas de surveillance prolongée")], { tone: "alert" })
    ],
    refs: ["RFE SFAR 2017 : Intubation difficile et extubation en anesthésie chez l'adulte (Langeron O et al., Anesth Reanim 2017)", "Birenbaum A et al. Effect of cricoid pressure compared with a sham procedure in the rapid sequence induction of anesthesia (IRIS). JAMA Surg 2019", "Van de Putte P, Perlas A. Ultrasound assessment of gastric content and volume. Br J Anaesth 2014", "Langeron O et al. Prediction of difficult mask ventilation. Anesthesiology 2000"]
  };

  /* ============================ RACHIANESTHÉSIE ============================ */
  const RACHI = {
    title: "Rachianesthésie", subtitle: "Indications, technique, doses selon la chirurgie, hypotension et complications",
    tags: ["Bupivacaïne hyperbare", "Niveau sensitif", "Hypotension"],
    sections: [
      S("Indications et contre-indications", [kv(["Indications", "Chirurgie sous-ombilicale : membre inférieur, hanche, urologie endoscopique, périnée, paroi abdominale basse"],
        ["Contre-indications", "Refus du patient, infection au point de ponction, hypovolémie non corrigée, trouble de l'hémostase ou antithrombotique non arrêté, hypertension intracrânienne, allergie aux anesthésiques locaux"],
        ["Prudence", "Rétrécissement aortique serré, cardiopathie obstructive, sepsis, maladie neurologique évolutive"])]),
      S("Technique", [ul("Monitorage, voie veineuse, vasopresseur prêt dans une seringue", "Asepsie chirurgicale ; patient assis ou en décubitus latéral", "Ponction en L3–L4 ou L4–L5 (la ligne des crêtes iliaques croise L4) ; jamais au-dessus de L2", "Aiguille à pointe crayon de 25 ou 27 G avec introducteur", "Reflux de liquide cérébrospinal clair avant une injection lente", "Repérage échographique si les repères sont difficiles (obésité, scoliose)")]),
      S("Doses de bupivacaïne hyperbare 0,5 %", [tbl(["Chirurgie", "Niveau visé", "Dose"], [
        ["Périnée, proctologie (bloc en selle)", "S2–S5", "5–7,5 mg"],
        ["Membre inférieur, fracture du col du fémur", "T12–L1", "7,5–10 mg ; doses basses chez le sujet âgé"],
        ["Hanche, urologie endoscopique", "T10", "10–12,5 mg"],
        ["Hernie inguinale, paroi abdominale basse", "T6–T8", "12,5–15 mg"]
      ], "Chirurgie ambulatoire courte : prilocaïne hyperbare 2 % ou chloroprocaïne selon la durée."),
        kv(["Sufentanil", "2,5–5 µg : améliore la qualité du bloc ; prurit"], ["Morphine", "100 µg : analgésie de 12 à 24 heures ; surveillance respiratoire pendant 24 heures"])], { wide: true }),
      S("Hypotension et bradycardie", [ul("Prévenir : remplissage par cristalloïdes au moment de l'injection, vasopresseur dès la baisse de la pression", "Traiter : éphédrine 6–9 mg ou phényléphrine 50–100 µg, à répéter", "Bradycardie : atropine 0,5 mg ; ne pas attendre devant une bradycardie avec hypotension", "Arrêt cardiaque vagal : adrénaline précoce et massage cardiaque"),
        danger("Rachianesthésie haute ou totale : dyspnée, faiblesse des mains, voix éteinte, hypotension et bradycardie sévères, perte de conscience. Oxygène, ventilation et intubation, vasopresseurs, atropine.")], { tone: "alert" }),
      S("Complications secondaires", [tbl(["Complication", "Conduite"], [
        ["Céphalées après brèche durale", "Posturales, dans les 5 jours : hydratation, antalgiques, caféine ; patch sanguin péridural si elles restent invalidantes après 24 à 48 heures"],
        ["Rétention urinaire", "Échographie vésicale avant la sortie de SSPI, sondage évacuateur"],
        ["Déficit moteur qui persiste ou réapparaît", "Hématome ou abcès péridural : IRM en urgence, avis neurochirurgical"],
        ["Douleurs radiculaires transitoires", "Surtout avec la lidocaïne : antalgiques, régression en quelques jours"]
      ])], { wide: true })
    ],
    refs: ["RPC SFAR 2006 : Les blocs périmédullaires chez l'adulte", "Kietaibl S et al. Regional anaesthesia in patients on antithrombotic drugs: joint ESAIC/ESRA guidelines. Eur J Anaesthesiol 2022", "Uppal V et al. Consensus practice guidelines on postdural puncture headache. Reg Anesth Pain Med 2023"]
  };

  /* ============================ ANTIBIOPROPHYLAXIE ============================ */
  // Les schémas par intervention sont lus dans les fiches d'anesthésie : une seule source
  const abpOf = i => (i.sections || []).find(x => /^Antibioprophylaxie/.test(x.title));
  const SPECS = (window.P17_ANESTH || []).map(s => ({ s, list: s.interventions.filter(abpOf) })).filter(x => x.list.length);
  const MOLS = [
    [/c[ée]fazoline/i, "Céfazoline", 4, "1 g"], [/c[ée]foxitine/i, "Céfoxitine", 2, "1 g"], [/c[ée]furoxime/i, "Céfuroxime", 2, "0,75 g"],
    [/amoxicilline/i, "Amoxicilline-acide clavulanique", 2, "1 g"], [/clindamycine/i, "Clindamycine", 4, "450 mg"], [/vancomycine/i, "Vancomycine", 8, "10 mg/kg"]
  ];
  const abpTool = P17.calc({
    id: "abp", kind: "tool", title: "Quelle antibioprophylaxie pour quelle intervention ?", desc: "Le schéma est celui de la fiche de l'intervention ; l'heure d'injection donne les heures de réinjection",
    fields: [
      { id: "spec", label: "Chirurgie", type: "select", full: true, options: SPECS.map(x => [x.s.id, x.s.short || x.s.title]) },
      ...SPECS.map(x => ({ id: "i_" + x.s.id, label: "Intervention", type: "select", full: true, options: x.list.map(i => [i.id, i.title]), showIf: v => v.spec === x.s.id })),
      { id: "heure", label: "Heure d'injection", type: "time" },
      { id: "duree", label: "Durée prévue", unit: "h", placeholder: "ex. 5" },
      { id: "allergie", label: "Allergie vraie aux bêta-lactamines", type: "check", full: true }
    ],
    compute: v => {
      const x = SPECS.find(y => y.s.id === v.spec); if (!x) return null;
      const it = x.list.find(i => i.id === v["i_" + x.s.id]) || x.list[0];
      const sec = abpOf(it);
      const txt = JSON.stringify(sec.blocks);
      const al = (sec.blocks.flatMap(b => b.kv || []).find(p => /^Allergie/.test(p[0])) || [])[1] || "";
      const src = v.allergie && al ? al : txt;
      const mol = MOLS.find(m => m[0].test(src));
      let re = "";
      if (!mol && v.allergie && /gentamicine|m[ée]tronidazole|teicoplanine/i.test(al)) re = `<h4>Heures de réinjection</h4><ul class="rx"><li>Pas de réinjection peropératoire pour ces molécules</li></ul>`;
      if (mol) {
        const h = F.heuresReinjection(v.heure, mol[2], v.duree);
        re = `<h4>Heures de réinjection</h4><ul class="rx"><li><b>${mol[1]}</b> : ${mol[3]} toutes les ${mol[2]} heures tant que l'intervention dure${h ? (h.length ? `<br>Injection à ${v.heure} : réinjection à <b>${h.join(", ")}</b>` : `<br>Injection à ${v.heure} : pas de réinjection pour la durée prévue`) : ""}</li></ul>`;
      }
      return { html: `<div class="out-label">${P17.esc(x.s.short || x.s.title)}</div><div class="out-main" style="margin-top:4px">${it.title}</div>
        ${v.allergie ? `<h4>Allergie aux bêta-lactamines</h4><ul class="rx"><li>${al || "Pas d'alternative indiquée dans la fiche : avis de l'infectiologue ou du référent antibiotique"}</li></ul>` : ""}
        <h4>Schéma de la fiche</h4><div class="abp-blocks">${P17.blocks(sec.blocks)}</div>${re}` };
    },
    note: "<p>D'après les RFE SFAR-SPILF 2024. Une intervention absente de la liste n'a pas de schéma dans les fiches.</p>"
  });
  const ABP = {
    title: "Antibioprophylaxie", subtitle: "Schéma par intervention et règles générales d'administration",
    tags: ["RFE SFAR-SPILF 2024", "60 minutes avant l'incision", "Réinjection"], tool: abpTool, toolLabel: "Outil par intervention",
    sections: [
      S("Règles d'administration", [ul("Injection IV dans les 60 minutes qui précèdent l'incision, au plus tard avant l'incision ; de préférence avant l'induction", "Vancomycine : perfusion de 60 minutes, débutée 60 à 30 minutes avant l'incision", "Une dose unique suffit le plus souvent", "Pas de poursuite après la fin de l'intervention, sauf exception précisée pour la chirurgie concernée ; jamais au-delà de 48 heures", "Saignement important ou forte variation volémique : discuter une réinjection anticipée")], { tone: "key" }),
      S("Réinjections peropératoires", [tbl(["Molécule", "Dose de réinjection", "Intervalle"], [
        ["Céfazoline", "1 g", "Toutes les 4 heures"], ["Céfoxitine", "1 g", "Toutes les 2 heures"], ["Céfuroxime", "0,75 g", "Toutes les 2 heures"],
        ["Amoxicilline-acide clavulanique", "1 g", "Toutes les 2 heures"], ["Clindamycine", "450 mg", "Toutes les 4 heures"], ["Vancomycine", "10 mg/kg", "Toutes les 8 heures"],
        ["Gentamicine, métronidazole, teicoplanine", "Aucune", "Pas de réinjection"]
      ], "Demi-dose, toutes les deux demi-vies environ.")]),
      S("Situations particulières", [kv(["Obésité", "Pas d'augmentation systématique de la dose de céphalosporine ; à discuter si l'IMC dépasse 50 kg/m²"],
        ["Allergie aux bêta-lactamines", "Seule une allergie vraie fait changer de molécule : clindamycine 900 mg, vancomycine 20 mg/kg ou gentamicine 6–7 mg/kg selon la chirurgie"],
        ["Portage de SARM", "Vancomycine lorsque la chirurgie le justifie"], ["Antibiothérapie curative en cours", "Elle tient lieu de prophylaxie si son spectre convient ; réinjecter si la dernière dose est ancienne"])])
    ],
    refs: ["RFE SFAR-SPILF 2024 : Antibioprophylaxie en chirurgie et médecine interventionnelle (patients adultes)"]
  };

  /* ============================ TRANSFUSION ============================ */
  const psaTool = P17.calc({
    id: "psa", kind: "tool", title: "Pertes sanguines admissibles", desc: "Volume de pertes avant d'atteindre le seuil transfusionnel, en normovolémie",
    fields: [{ id: "sexe", label: "Sexe", type: "seg", options: [["H", "Homme"], ["F", "Femme"]] }, { id: "poids", label: "Poids", unit: "kg", placeholder: "ex. 70" },
      { id: "hb", label: "Hémoglobine de départ", unit: "g/dL", placeholder: "ex. 13,5" },
      { id: "seuil", label: "Seuil transfusionnel", type: "seg", options: [["7", "7 g/dL"], ["8", "8 g/dL"], ["9", "9 g/dL"], ["10", "10 g/dL"]] }],
    compute: v => {
      const r = F.pertesAdmissibles(v.sexe, v.poids, v.hb, +v.seuil);
      if (!r) return null;
      if (!r.pertes) return { tone: "warn", main: "Seuil déjà atteint", sub: `Hémoglobine de départ inférieure ou égale à ${v.seuil} g/dL` };
      return { label: "Pertes admissibles", main: `≈ ${f(Math.round(r.pertes / 50) * 50, 0)} mL`, tone: r.pertes < 750 ? "warn" : "",
        rows: [["Volume sanguin estimé", `${r0(r.vst)} mL (${v.sexe === "F" ? 65 : 70} mL/kg)`], ["Part du volume sanguin", `${r0(100 * r.pertes / r.vst)} %`]],
        sub: r.pertes < 750 ? "Marge faible : commande de sang et stratégie d'épargne à anticiper" : "" };
    },
    note: "Formule de Gross : volume sanguin × (Hb de départ − Hb seuil) / moyenne des deux. Estimation valable si la volémie est maintenue."
  });
  const TRANSF = {
    title: "Transfusion et épargne sanguine", subtitle: "Préparer le patient, limiter les pertes, transfuser au bon seuil",
    tags: ["Seuils", "Acide tranexamique", "Fer", "Sécurité transfusionnelle"], tool: psaTool, toolLabel: "Pertes admissibles",
    sections: [
      S("Avant l'intervention", [ul("Dépister l'anémie (hémoglobine < 13 g/dL) au moins 4 semaines avant une chirurgie hémorragique", "Carence martiale (ferritine < 100 µg/L, ou < 300 µg/L avec un coefficient de saturation < 20 %) : fer intraveineux", "Érythropoïétine en chirurgie orthopédique majeure si l'hémoglobine est entre 10 et 13 g/dL", "Gérer les antithrombotiques ; groupe sanguin et recherche d'agglutinines irrégulières selon le risque")]),
      S("Pendant l'intervention", [ul("Acide tranexamique 1 g à l'incision en chirurgie hémorragique (prothèse, rachis, traumatologie) ; prudence en cas d'antécédent de convulsions", "Normothermie, normocalcémie, pH normal", "Récupération du sang épanché si les pertes prévues dépassent 500 mL", "Hémostase chirurgicale soigneuse, garrot quand il est possible", "Stratégie transfusionnelle restrictive, un concentré à la fois hors hémorragie active")]),
      S("Seuils transfusionnels", [tbl(["Produit", "Seuil", "Dose"], [
        ["Globules rouges", "7 g/dL sans antécédent ; 8–9 g/dL si antécédent cardiovasculaire ; 10 g/dL si mauvaise tolérance, syndrome coronarien aigu ou insuffisance cardiaque", "Un concentré élève l'hémoglobine d'environ 1 g/dL"],
        ["Plaquettes", "50 G/L pour une chirurgie ; 100 G/L en neurochirurgie", "Un concentré d'aphérèse ou un mélange"],
        ["Plasma", "Saignement avec TP < 40 %", "15 mL/kg"],
        ["Fibrinogène", "≤ 1,5 g/L avec saignement", "25–50 mg/kg, soit 3 g chez l'adulte"],
        ["Concentré de complexe prothrombinique", "Saignement sous AVK", "25 UI/kg avec vitamine K 10 mg"]
      ])], { wide: true }),
      S("Sécurité transfusionnelle", [ol("Prescription nominative, deux déterminations de groupe, agglutinines irrégulières de moins de 72 heures", "Contrôle ultime au lit du patient : identité, concordance des documents, compatibilité ABO sur carte", "Surveillance rapprochée pendant les 15 premières minutes, puis régulière", "Traçabilité de chaque produit dans le dossier"),
        warn("Devant une réaction : arrêter la transfusion, garder la voie, prévenir le médecin et le centre de transfusion. Penser à la surcharge, au TRALI, à l'incompatibilité ABO, à l'hyperkaliémie et à l'hypocalcémie des transfusions rapides.")])
    ],
    refs: ["HAS 2014 : Transfusion de globules rouges homologues : produits, indications, alternatives", "HAS 2022 : Gestion du capital sanguin en pré, per et post-opératoire et en obstétrique", "Kietaibl S et al. Management of severe peri-operative bleeding: guidelines from the ESAIC, second update 2022. Eur J Anaesthesiol 2023"]
  };

  /* ============================ Routes Per-opératoire ============================ */
  const PAGES = [
    { id: "medicaments", fiche: MEDS, court: "Médicaments d'anesthésie", desc: "Doses d'induction, curares, antagonistes, vasopresseurs", icon: "perop", kw: "propofol sufentanil rocuronium sugammadex éphédrine noradrénaline dilution poids idéal obèse" },
    { id: "voies-aeriennes", fiche: VAS, court: "Voies aériennes et estomac plein", desc: "Préoxygénation, stratégie d'intubation, séquence rapide", icon: "perop", kw: "intubation difficile crush induction Sellick inhalation jeûne" },
    { id: "rachianesthesie", fiche: RACHI, court: "Rachianesthésie", desc: "Technique, doses selon la chirurgie, complications", icon: "perop", kw: "bupivacaïne hyperbare brèche céphalées blood patch bloc périmédullaire" },
    { id: "antibioprophylaxie", fiche: ABP, court: "Antibioprophylaxie", desc: "Outil par intervention, réinjections, allergie", icon: "antibiotherapie", kw: "céfazoline céfoxitine réinjection allergie SFAR SPILF 2024" },
    { id: "transfusion", fiche: TRANSF, court: "Transfusion et épargne sanguine", desc: "Seuils, acide tranexamique, pertes admissibles", icon: "eer", kw: "CGR plaquettes plasma fibrinogène anémie fer cell saver" }
  ];
  const base = [[SEC, ROOT]];
  P17.perop = PAGES.map(p => ({ href: `${ROOT}/${p.id}`, title: p.court, desc: p.desc, icon: p.icon, accent: "anesthesie" }));
  P17.route(ROOT, {
    title: SEC,
    render: () => P17.page({ crumbs: base, title: SEC, accent: "anesthesie", icon: "perop", back: "#/",
      subtitle: "Au bloc opératoire : médicaments, voies aériennes, rachianesthésie, antibioprophylaxie et transfusion.", body: P17.tiles(P17.perop) })
  });
  P17.index(ROOT, SEC, "bloc opératoire peropératoire", SEC);
  PAGES.forEach(p => {
    const path = `${ROOT}/${p.id}`;
    P17.route(path, { title: p.court, render: () => `
      <div class="page accent-anesthesie">
        <div class="page-head">${P17.backLink(ROOT, SEC)}${P17.crumbs([...base, [p.court, path]])}</div>
        ${P17.fiche({ kicker: SEC, accent: "anesthesie", ...p.fiche })}
      </div>` });
    P17.index(path, p.fiche.title, `${p.desc} ${p.kw} ${(p.fiche.tags || []).join(" ")}`, SEC);
  });

  /* ============================ THROMBOPROPHYLAXIE (Post-opératoire) ============================ */
  // niveau : "sys" = prophylaxie d'emblée ; "fr" = seulement si facteurs de risque
  const CHIR = [
    ["pth", "Prothèse totale de hanche", "sys", "35 jours", "AOD possible : apixaban 2,5 mg × 2 (12 à 24 h après) ou rivaroxaban 10 mg (6 à 8 h après). Parcours optimisé sans facteur de risque majeur : 5 jours d'anticoagulant puis aspirine 75–100 mg jusqu'au 35e jour."],
    ["ptg", "Prothèse totale de genou", "sys", "14 jours", "AOD possible aux mêmes doses. Parcours optimisé sans facteur de risque majeur : 5 jours d'anticoagulant puis aspirine jusqu'au 14e jour."],
    ["fesf", "Fracture de l'extrémité supérieure du fémur", "sys", "4 semaines", "HBPM ou fondaparinux. Débuter avant l'intervention si elle est différée de plus de 12 heures (dernière injection 12 heures avant le bloc). L'aspirine n'est pas recommandée."],
    ["trauma", "Traumatologie du membre inférieur (fémur, plateau tibial, tibia, cheville, tendon d'Achille)", "sys", "Jusqu'à l'appui avec déroulé du pas, 7 jours au minimum", "AOD anti-Xa ou HBPM."],
    ["arthro", "Arthroscopie, ligamentoplastie, ablation de matériel, avant-pied", "fr", "7 jours au minimum si elle est indiquée", ""],
    ["abdoH", "Chirurgie abdomino-pelvienne à risque élevé (carcinologique majeure digestive, urologique, gynécologique)", "sys", "4 semaines", "Y compris par cœlioscopie ou en réhabilitation améliorée.", true],
    ["abdoI", "Chirurgie abdomino-pelvienne à risque intermédiaire", "sys", "7 jours au minimum", ""],
    ["abdoF", "Chirurgie abdomino-pelvienne à faible risque (paroi, appendicectomie, cholécystectomie, proctologie, endo-urologie)", "fr", "7 jours au minimum si elle est indiquée", ""],
    ["bari", "Chirurgie bariatrique", "sys", "10 jours au minimum", "HBPM ou fondaparinux, débutés après l'intervention ; les AOD sont évités dans les suites précoces.", true],
    ["thor", "Résection pulmonaire", "sys", "Non établie : au moins 7 jours, jusqu'à 4 semaines en cas de cancer selon les équipes", ""],
    ["sein", "Chirurgie du sein", "fr", "7 jours au minimum si elle est indiquée", "Tumorectomie ambulatoire : pas de prophylaxie. Chirurgie complexe, chimiothérapie ou tamoxifène : à discuter."],
    ["carc", "Chirurgie carcinologique majeure hors abdomen et pelvis", "sys", "7 jours au minimum", "", true],
    ["neuro", "Craniotomie", "sys", "Jusqu'à la reprise de la marche", "Compression pneumatique intermittente dès le bloc ; HBPM à partir de 24 heures si l'hémostase et l'imagerie le permettent (ESAIC 2018)."],
    ["rachis", "Chirurgie du rachis", "fr", "Jusqu'à la reprise de la marche si elle est indiquée", "Lever précoce et compression pneumatique ; HBPM à partir de 24 heures en cas de chirurgie majeure ou de facteurs de risque (ESAIC 2018)."]
  ];
  const MAJ = [["mtev", "Antécédent de maladie thromboembolique veineuse"], ["thrombo", "Thrombophilie majeure"], ["cancer", "Cancer actif (traité dans les 6 mois)"], ["imc40", "IMC ≥ 40 kg/m²"]];
  const MIN = [["age", "Âge ≥ 75 ans"], ["ic", "Insuffisance cardiaque ou respiratoire, BPCO"], ["dfg", "DFG < 30 mL/min"], ["inflam", "Maladie inflammatoire digestive ou rhumatismale"], ["oestro", "Œstrogènes, grossesse ou post-partum"], ["imc30", "IMC entre 30 et 40"], ["alite", "Alitement prolongé récent, déficit neurologique de moins d'un mois, immobilisation"]];
  const tpTool = P17.calc({
    id: "thrombo", kind: "tool", title: "Thromboprophylaxie : indication, dose et durée", desc: "Selon la chirurgie, les facteurs de risque du patient, le poids et la fonction rénale",
    fields: [
      { id: "chir", label: "Chirurgie", type: "select", full: true, options: CHIR.map(c => [c[0], c[1]]) },
      { id: "maj", label: "Facteurs de risque majeurs", type: "checks", full: true, options: MAJ },
      { id: "min", label: "Facteurs de risque mineurs", type: "checks", full: true, options: MIN },
      { id: "poids", label: "Poids", unit: "kg", placeholder: "ex. 70" }, { id: "taille", label: "Taille", unit: "cm", placeholder: "ex. 170" },
      { id: "dfg", label: "DFG", unit: "mL/min", placeholder: "ex. 80" },
      { id: "ci", label: "Anticoagulant contre-indiqué (saignement, hémostase non acquise)", type: "check", full: true }
    ],
    compute: v => {
      const c = CHIR.find(x => x[0] === v.chir) || CHIR[0];
      const maj = v.maj.length > 0, nmin = v.min.length;
      const imc = F.imc(v.taille, v.poids) ?? (v.maj.includes("imc40") ? 40 : null);
      const dfg = v.dfg ?? (v.min.includes("dfg") ? 29 : null);
      const indique = c[2] === "sys" || maj || nmin >= 2;
      if (!indique) return { tone: "ok", html: `<div class="out-label">${c[1]}</div><div class="out-main" style="margin-top:4px">Pas de prophylaxie médicamenteuse systématique</div>
        <ul class="rx"><li>Lever et marche précoces, hydratation</li><li>${nmin === 1 ? "Un facteur de risque mineur isolé : à discuter au cas par cas" : "À réévaluer en cas de chirurgie prolongée, de complication ou d'alitement"}</li></ul>${c[4] ? `<p class="out-sub">${c[4]}</p>` : ""}` };
      const d = F.thromboDose({ poids: v.poids, imc, dfg });
      const cpi = v.ci || (maj && c[5]);
      return { tone: v.ci ? "warn" : "", html: `<div class="out-label">${c[1]}</div>
        <div class="out-main" style="margin-top:4px">${v.ci ? "Compression pneumatique intermittente" : `${d.mol} ${d.dose}`}</div>
        ${rows([...(v.ci ? [["Anticoagulant", "Dès que le risque hémorragique le permet"]] : [["Motif de la dose", d.motif]]),
          ["Durée", c[3]], ["Première injection", "Après l'intervention, 6 à 12 heures après la fin si l'hémostase est satisfaisante ; jamais entre 2 heures avant et 4 heures après"],
          ...(cpi && !v.ci ? [["Compression pneumatique", "À associer : facteur de risque majeur et chirurgie à risque élevé"]] : [])])}
        ${c[2] === "fr" ? `<p class="out-sub">Indiquée ici par ${maj ? "un facteur de risque majeur" : "plusieurs facteurs de risque mineurs"}.</p>` : ""}
        ${c[4] ? `<p class="out-sub">${c[4]}</p>` : ""}` };
    },
    note: "<p>D'après les recommandations GIHP-SFAR 2024. La craniotomie et le rachis suivent les recommandations européennes ESAIC 2018.</p>"
  });
  const TP = {
    kicker: "Post-opératoire", title: "Thromboprophylaxie postopératoire", subtitle: "Qui traiter, avec quelle dose et pendant combien de temps",
    tags: ["GIHP-SFAR 2024", "Énoxaparine 4 000 UI", "Durée selon la chirurgie"], tool: tpTool, toolLabel: "Outil",
    sections: [
      S("Principes", [ul("Le risque dépend de la chirurgie et du patient : les deux s'additionnent", "Lever précoce et réhabilitation améliorée réduisent le risque, sans remplacer la prophylaxie chez un patient à risque", "Début après l'intervention ; une injection entre 2 heures avant et 4 heures après la chirurgie augmente les saignements majeurs", "L'acide tranexamique ne modifie pas la prophylaxie", "Bas de contention : non recommandés")], { tone: "key" }),
      S("Facteurs de risque liés au patient", [kv(["Majeurs", MAJ.map(x => x[1]).join(" ; ")], ["Mineurs", MIN.map(x => x[1]).join(" ; ")]),
        info("Chirurgie à faible risque : prophylaxie seulement en présence d'un facteur majeur ou de plusieurs facteurs mineurs, pendant 7 jours au minimum.")]),
      S("Indication et durée selon la chirurgie", [tbl(["Chirurgie", "Prophylaxie", "Durée"], CHIR.map(c => [c[1], c[2] === "sys" ? "Systématique" : "Si facteurs de risque", c[3]]))], { wide: true }),
      S("Molécules et adaptation des doses", [tbl(["Situation", "Schéma"], [
        ["Standard", "Énoxaparine 4 000 UI × 1/j (ou daltéparine 5 000 UI, tinzaparine 4 500 UI)"],
        ["IMC ≥ 40 kg/m²", "Énoxaparine 4 000 UI × 2/j ; 6 000 UI × 2/j au-delà de 150 kg"],
        ["Poids < 45 kg", "Énoxaparine 2 000 UI × 1/j"],
        ["DFG entre 15 et 30 mL/min", "Énoxaparine 2 000 UI × 1/j"],
        ["DFG < 15 mL/min", "Héparine calcique 5 000 UI × 2/j ; HBPM et AOD contre-indiqués"],
        ["Fondaparinux", "2,5 mg × 1/j, au moins 8 heures après la chirurgie ; contre-indiqué si le DFG est < 50 mL/min, déconseillé sous 50 kg"],
        ["AOD (prothèse de hanche ou de genou)", "Apixaban 2,5 mg × 2/j ; rivaroxaban 10 mg × 1/j"]
      ])], { wide: true }),
      S("Moyens mécaniques et surveillance", [ul("Compression pneumatique intermittente : lorsque les anticoagulants sont contre-indiqués ; en association en cas de risque très élevé ; elle ne doit pas retarder la marche", "Plaquettes : à l'instauration, puis une à deux fois par semaine du 4e au 14e jour sous HBPM (deux à trois fois sous héparine non fractionnée)", "Pas de dosage de l'activité anti-Xa en routine, y compris aux poids extrêmes et dans l'insuffisance rénale", "Cathéter périmédullaire : retrait au moins 12 heures après une HBPM préventive")])
    ],
    refs: ["Godier A, Lasne D, Pernod G et al. Prévention de la maladie thromboembolique veineuse péri-opératoire : actualisation des recommandations (GIHP, SFAR, SFTH, SFMV), 2024", "Afshari A et al. European guidelines on perioperative venous thromboembolism prophylaxis. Eur J Anaesthesiol 2018"]
  };
  const TP_PATH = "#/postop/thromboprophylaxie";
  const POSTOP = ["Post-opératoire", "#/postop"];
  P17.route(TP_PATH, { title: "Thromboprophylaxie", render: () => `
    <div class="page accent-sspi">
      <div class="page-head">${P17.backLink(POSTOP[1], POSTOP[0])}${P17.crumbs([POSTOP, ["Thromboprophylaxie", TP_PATH]])}</div>
      ${P17.fiche({ accent: "sspi", ...TP })}
    </div>` });
  P17.index(TP_PATH, TP.title, "HBPM énoxaparine Lovenox phlébite embolie pulmonaire durée prothèse hanche genou AOD apixaban rivaroxaban compression pneumatique", "Post-opératoire");
  if (P17.postop) P17.postop.push({ href: TP_PATH, title: "Thromboprophylaxie", desc: "Indication, dose et durée selon la chirurgie", icon: "thrombo", accent: "sspi" });
})();
