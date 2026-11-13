/* =====================================================================
   Per-opératoire : pharmacologie et thérapeutique, monitorage, gestes
   (voies aériennes, rachianesthésie, transfusion). Épargne sanguine rangée
   dans Gestion pré-opératoire, thromboprophylaxie dans Post-opératoire.
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
    title: "Hypnotiques, morphiniques, curares", subtitle: "Doses usuelles chez l'adulte et poids de calcul chez l'obèse",
    tags: ["Induction", "Entretien", "Curares"], tool: medTool, toolLabel: "Doses d'induction",
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
  /* ======================= VASOPRESSEURS ET INOTROPES ======================= */
  const VASO = {
    title: "Vasopresseurs et inotropes", subtitle: "Choisir la molécule selon le mécanisme de l'hypotension ou du bas débit",
    tags: ["Bolus", "Débit continu", "Antihypertenseurs"],
    sections: [
      S("Choisir", [tbl(["Situation", "Premier choix"], [
        ["Hypotension de l'induction, vasodilatation", "Phényléphrine ou noradrénaline en bolus ; éphédrine si bradycardie associée"],
        ["Hypotension persistante, choc vasoplégique", "Noradrénaline en continu"],
        ["Bas débit cardiaque, dysfonction ventriculaire", "Dobutamine ; adrénaline si choc cardiogénique avec hypotension"],
        ["Dysfonction du ventricule droit, hypertension pulmonaire", "Noradrénaline pour la pression, dobutamine ou milrinone, NO inhalé"],
        ["Anaphylaxie, arrêt cardiaque", "Adrénaline"],
        ["Vasoplégie réfractaire", "Ajouter vasopressine ; bleu de méthylène en dernier recours"]
      ])], { wide: true }),
      S("Vasopresseurs", [tbl(["Médicament", "Préparation", "Bolus", "Continu"], [
        ["Éphédrine", "30 mg dans 10 mL : 3 mg/mL", "3–9 mg ; tachyphylaxie après 30 mg", "—"],
        ["Phényléphrine", "50 à 100 µg/mL", "50–100 µg ; bradycardie réflexe", "0,5–1,5 µg/kg/min"],
        ["Noradrénaline", "Bolus 10 µg/mL ; seringue 8 mg dans 40 mL : 0,2 mg/mL", "5–10 µg", "0,05–0,5 µg/kg/min ; voie périphérique possible pour une courte durée, à faible concentration"],
        ["Adrénaline", "1 mg dans 10 mL : 100 µg/mL, puis au dixième : 10 µg/mL", "10–100 µg selon la gravité ; 1 mg dans l'arrêt cardiaque", "0,05–0,5 µg/kg/min"],
        ["Vasopressine", "20 UI dans 20 mL", "—", "0,01–0,04 UI/min"]
      ])], { wide: true }),
      S("Inotropes", [tbl(["Médicament", "Dose", "À savoir"], [
        ["Dobutamine", "2,5–20 µg/kg/min", "Tachycardie, arythmies, vasodilatation"],
        ["Adrénaline", "0,05–0,5 µg/kg/min", "Hyperlactatémie, tachycardie"],
        ["Milrinone", "0,375–0,75 µg/kg/min, sans dose de charge", "Vasodilatation : associer la noradrénaline ; réduire si insuffisance rénale"],
        ["Lévosimendan", "0,1 µg/kg/min pendant 24 h", "Hypotension ; effet prolongé plusieurs jours"]
      ])], { wide: true }),
      S("Antihypertenseurs et contrôle de la fréquence", [tbl(["Médicament", "Préparation", "Dose"], [
        ["Nicardipine", "1 mg/mL", "0,5–1 mg en bolus, puis 1–4 mg/h"],
        ["Urapidil", "5 mg/mL", "10–25 mg en bolus, puis 9–30 mg/h"],
        ["Esmolol", "10 mg/mL", "0,5 mg/kg en bolus, puis 50–300 µg/kg/min"],
        ["Labétalol", "5 mg/mL", "5–20 mg en bolus"],
        ["Clonidine", "150 µg/mL", "75–150 µg en IV lente"]
      ])], { wide: true })
    ],
    refs: ["Résumés des caractéristiques des produits (base de données publique des médicaments)", "RFE SFAR-SRLF 2014 : Prise en charge du choc cardiogénique (Levy B et al.)"]
  };

  /* ======================= ANTAGONISATION DES CURARES ======================= */
  const ANTAG = {
    title: "Antagonisation des curares", subtitle: "Le monitorage quantitatif décide : antagoniser jusqu'à un rapport du train de quatre ≥ 0,9",
    tags: ["TOF ≥ 0,9", "Sugammadex", "Néostigmine"],
    sections: [
      S("Selon la profondeur du bloc", [tbl(["Profondeur (adducteur du pouce)", "Rocuronium", "Atracurium, cisatracurium"], [
        ["Profond : TOF 0, compte post-tétanique 1–2", "Sugammadex 4 mg/kg", "Attendre ; la néostigmine est inefficace"],
        ["Modéré : TOF 1 à 3 réponses", "Sugammadex 2 mg/kg", "Attendre 4 réponses"],
        ["Léger : 4 réponses, rapport < 0,4", "Sugammadex 2 mg/kg", "Néostigmine 40–50 µg/kg + atropine 15–20 µg/kg"],
        ["Rapport 0,4 à 0,9", "Sugammadex 2 mg/kg ou néostigmine 20–30 µg/kg", "Néostigmine 20–30 µg/kg + atropine"],
        ["Rapport ≥ 0,9", "Pas d'antagonisation", "Pas d'antagonisation"],
        ["Réversion immédiate après 1,2 mg/kg", "Sugammadex 16 mg/kg", "—"]
      ], "Sugammadex sur le poids réel ; néostigmine 5 mg au maximum, délai d'action de 10 minutes.")], { wide: true }),
      S("Pièges", [ul("Les tests cliniques (lever de tête, serrer la main) ne détectent pas une curarisation résiduelle", "Mesurer à l'adducteur du pouce : les muscles de la face récupèrent plus vite", "Hypothermie, magnésium, aminosides et halogénés prolongent le bloc", "Insuffisance rénale sévère : le sugammadex est déconseillé si le DFG est inférieur à 30 mL/min", "Sugammadex : réduit l'efficacité des contraceptifs hormonaux pendant 7 jours ; rares anaphylaxies")])
    ],
    refs: ["RFE SFAR 2018 : Curarisation et décurarisation en anesthésie (Plaud B et al., Anaesth Crit Care Pain Med 2020)", "Thilen SR et al. 2023 American Society of Anesthesiologists practice guidelines for monitoring and antagonism of neuromuscular blockade. Anesthesiology 2023"]
  };

  /* ======================= ANESTHÉSIQUES LOCAUX ======================= */
  const alCalc = P17.calc({
    id: "alMax", title: "Dose maximale d'anesthésique local", desc: "Poids idéal chez l'obèse ; additionner toutes les injections (bloc, infiltration, lidocaïne IV)",
    fields: [{ id: "mol", label: "Molécule", type: "select", options: [["ropivacaine", "Ropivacaïne"], ["bupivacaine", "Bupivacaïne"], ["levobupivacaine", "Lévobupivacaïne"], ["lidocaine", "Lidocaïne"], ["mepivacaine", "Mépivacaïne"]] },
      { id: "adre", label: "Avec adrénaline (lidocaïne)", type: "check", showIf: v => v.mol === "lidocaine" },
      { id: "poids", label: "Poids", unit: "kg" }, { id: "conc", label: "Concentration", unit: "%", placeholder: "0,375" }],
    compute: v => {
      const r = F.doseMaxAL(v.mol, v.poids, v.adre);
      if (!r) return null;
      const out = [["Base de calcul", `${f(r.mgkg, 1)} mg/kg, plafond ${r.plafond} mg`]];
      if (v.conc) out.push(["Volume maximal", `${f(r.mg / (v.conc * 10), 0)} mL à ${f(v.conc, 3)} %`]);
      return { label: "Dose maximale", main: `${f(r.mg, 0)} mg`, rows: out };
    },
    note: "Doses indicatives en injection unique ; réduire chez le sujet âgé, l'insuffisant cardiaque ou hépatique, et pour les sites très vasculaires (intercostal, ESP bilatéral)."
  });
  const AL = {
    title: "Anesthésiques locaux", subtitle: "Doses maximales, délais, durées et adjuvants",
    tags: ["Ropivacaïne", "Lidocaïne", "Dose maximale"], tool: alCalc, toolLabel: "Dose maximale",
    sections: [
      S("Molécules", [tbl(["Molécule", "Dose maximale", "Délai", "Durée (bloc périphérique)"], [
        ["Lidocaïne", "4,5 mg/kg ; 7 mg/kg avec adrénaline", "Rapide", "1 à 3 h"],
        ["Mépivacaïne", "4,4 mg/kg", "Rapide", "2 à 4 h"],
        ["Ropivacaïne", "3 mg/kg, plafond 225 mg", "Intermédiaire", "6 à 12 h ; bloc moteur moindre"],
        ["Bupivacaïne, lévobupivacaïne", "2 mg/kg, plafond 150 mg", "Lent", "8 à 16 h ; cardiotoxicité plus marquée"],
        ["Prilocaïne, chloroprocaïne (rachianesthésie)", "Selon l'indication", "Rapide", "Courte : chirurgie ambulatoire"]
      ])], { wide: true }),
      S("Adjuvants", [kv(["Dexaméthasone", "4–8 mg IV : prolonge la durée des blocs périphériques"], ["Adrénaline", "5 µg/mL : marqueur d'injection intravasculaire, réduit la résorption"], ["Clonidine", "1 µg/kg en périnerveux : prolongation modeste, hypotension et sédation"])]),
      S("Prévenir la toxicité", [ul("Échoguidage, aspiration, injection lente et fractionnée par 5 mL", "Cumuler les doses de toutes les injections de la journée", "Réduire les doses chez le sujet âgé, l'insuffisant cardiaque ou hépatique, la femme enceinte", "Émulsion lipidique 20 % disponible partout où l'on injecte")], { tone: "key" })
    ],
    refs: ["RFE SFAR : Anesthésie locorégionale périnerveuse (ALR-PN)", "Neal JM et al. ASRA checklist for treatment of local anesthetic systemic toxicity: 2020 version. Reg Anesth Pain Med 2021"]
  };

  /* ======================= DILUTIONS ET SERINGUES ÉLECTRIQUES ======================= */
  const DIL = {
    title: "Dilutions et seringues électriques", subtitle: "Préparations standard du bloc et calcul du débit",
    tags: ["Seringue de 50 mL", "µg/kg/min", "Étiquetage"],
    toolFn: () => (P17.toolHTML ? P17.toolHTML.pse + P17.toolHTML.dilution : ""), toolLabel: "Calcul du débit et de la dilution",
    sections: [
      S("Préparations usuelles", [tbl(["Médicament", "Préparation", "Concentration", "Débit habituel"], [
        ["Noradrénaline", "8 mg dans 40 mL", "0,2 mg/mL", "0,05–0,5 µg/kg/min"],
        ["Adrénaline", "5 mg dans 50 mL", "0,1 mg/mL", "0,05–0,5 µg/kg/min"],
        ["Dobutamine", "250 mg dans 50 mL", "5 mg/mL", "2,5–20 µg/kg/min"],
        ["Phényléphrine", "5 mg dans 50 mL", "100 µg/mL", "0,5–1,5 µg/kg/min"],
        ["Nicardipine", "50 mg dans 50 mL", "1 mg/mL", "1–4 mg/h"],
        ["Propofol 1 %", "Pur", "10 mg/mL", "4–10 mg/kg/h"],
        ["Sufentanil", "250 µg dans 50 mL", "5 µg/mL", "0,1–0,5 µg/kg/h"],
        ["Kétamine (analgésie)", "50 mg dans 50 mL", "1 mg/mL", "0,125–0,25 mg/kg/h"],
        ["Lidocaïne IV", "1 000 mg dans 50 mL", "20 mg/mL", "1,5–2 mg/kg/h (poids idéal)"],
        ["Insuline", "50 UI dans 50 mL", "1 UI/mL", "Selon le protocole"],
        ["Héparine", "25 000 UI dans 50 mL", "500 UI/mL", "Selon l'anti-Xa ou le TCA"]
      ], "Préparations à harmoniser avec la pharmacie du CHU. Seringue étiquetée : molécule, concentration, date, heure.")], { wide: true }),
      S("Sécurité", [ul("Une ligne dédiée pour les catécholamines, sans bolus sur la même voie", "Relais de seringue anticipé : nouvelle seringue branchée avant la fin de la précédente", "Purge de la ligne avant le branchement ; débit vérifié à voix haute à deux")])
    ],
    refs: ["Recommandations de la SFAR et de la SFPC sur la préparation des médicaments injectables en anesthésie"]
  };

  /* ======================= ASSISTANT DE POSOLOGIE ======================= */
  // [id, nom, classe, dose (texte avec {P}), mg/kg bas, haut, unité, poids, max, voie, rein [[seuil DFG, consigne]], note]
  const MOLS_P = [
    ["propofol", "Propofol", "Hypnotique", 1.5, 2.5, "mg", "maigre", null, "IV, induction", [], "1–1,5 mg/kg après 65 ans ou ASA ≥ 3"],
    ["etomidate", "Étomidate", "Hypnotique", 0.2, 0.3, "mg", "maigre", null, "IV, induction", [], "Inhibition surrénalienne transitoire"],
    ["ketamine", "Kétamine (induction)", "Hypnotique", 1, 2, "mg", "maigre", null, "IV", [], "Analgésie : 0,15–0,5 mg/kg"],
    ["midazolam", "Midazolam", "Benzodiazépine", 0.02, 0.05, "mg", "maigre", 5, "IV, titré", [[30, "Accumulation : réduire et espacer"]], "Sujet âgé : 0,5–1 mg titré"],
    ["sufentanil", "Sufentanil", "Morphinique", 0.2, 0.3, "µg", "maigre", null, "IV, induction", [], ""],
    ["fentanyl", "Fentanyl", "Morphinique", 2, 3, "µg", "maigre", null, "IV, induction", [], ""],
    ["morphine", "Morphine", "Morphinique", 0.1, 0.1, "mg", "maigre", 10, "IV, en fin d'intervention", [[30, "DFG < 30 : éviter (métabolite actif), préférer l'oxycodone titrée"], [60, "DFG 30–60 : réduire la dose de moitié"]], "Titration en SSPI : 2 à 3 mg toutes les 5 min"],
    ["rocuronium", "Rocuronium", "Curare", 0.6, 0.6, "mg", "ideal", null, "IV", [[30, "Durée d'action prolongée : monitorage, sugammadex déconseillé"]], "Séquence rapide : 1–1,2 mg/kg"],
    ["atracurium", "Atracurium", "Curare", 0.5, 0.5, "mg", "ideal", null, "IV", [], "Élimination indépendante du rein et du foie"],
    ["cisatracurium", "Cisatracurium", "Curare", 0.15, 0.15, "mg", "ideal", null, "IV", [], "Insuffisance rénale ou hépatique"],
    ["succinylcholine", "Succinylcholine", "Curare", 1, 1, "mg", "reel", 150, "IV", [], "Contre-indiquée si hyperkaliémie, brûlure, myopathie"],
    ["sugammadex", "Sugammadex", "Antagoniste", 2, 4, "mg", "reel", null, "IV", [[30, "DFG < 30 : déconseillé"]], "16 mg/kg en réversion immédiate"],
    ["neostigmine", "Néostigmine", "Antagoniste", 0.04, 0.05, "mg", "reel", 5, "IV, avec atropine 15–20 µg/kg", [], "Seulement avec 4 réponses au train de quatre"],
    ["naloxone", "Naloxone", "Antagoniste", 0.001, 0.001, "mg", "reel", 0.4, "IV, titré (0,04 mg toutes les 2 min)", [], "Durée d'action courte : surveiller"],
    ["paracetamol", "Paracétamol", "Antalgique", 15, 15, "mg", "reel", 1000, "IV ou per os, toutes les 6 h", [[30, "DFG < 30 : intervalle de 8 h, 3 g/24 h au maximum"]], "1 g si > 50 kg ; 3 g/24 h si dénutrition ou insuffisance hépatique"],
    ["ketoprofene", "Kétoprofène", "AINS", 1, 1, "mg", "reel", 100, "IV, toutes les 12 h", [[30, "DFG < 30 : contre-indiqué"], [60, "DFG 30–60 : prudence, durée courte"]], "48 à 72 h au maximum"],
    ["nefopam", "Néfopam", "Antalgique", 0.3, 0.3, "mg", "reel", 20, "IV lente (30 min), toutes les 4 à 6 h", [[30, "Réduire : 60 mg/24 h au maximum"]], "120 mg/24 h au maximum"],
    ["tramadol", "Tramadol", "Antalgique", 1, 1.5, "mg", "reel", 100, "IV ou per os, toutes les 6 h", [[30, "DFG < 30 : toutes les 12 h, 200 mg/24 h au maximum"]], "Abaisse le seuil épileptogène"],
    ["lidocaineiv", "Lidocaïne IV (analgésie)", "Adjuvant", 1.5, 1.5, "mg", "ideal", 100, "IV en bolus, puis 1,5–2 mg/kg/h", [], "Pas d'association avec un bloc ou une péridurale"],
    ["dexamethasone", "Dexaméthasone", "Antiémétique", 0.1, 0.1, "mg", "reel", 8, "IV à l'induction", [], "4–8 mg ; hyperglycémie transitoire"],
    ["ondansetron", "Ondansétron", "Antiémétique", 0.05, 0.05, "mg", "reel", 4, "IV en fin d'intervention", [], "Allongement du QT"],
    ["droperidol", "Dropéridol", "Antiémétique", 0.01, 0.01, "mg", "reel", 1.25, "IV", [], "0,625–1,25 mg ; contre-indiqué dans la maladie de Parkinson"],
    ["atx", "Acide tranexamique", "Hémostatique", 15, 15, "mg", "reel", 1000, "IV en 10 min", [[30, "Créatinine 250–500 µmol/L : 10 mg/kg toutes les 24 h ; au-delà : 5 mg/kg"], [60, "Créatinine 120–250 µmol/L : dose d'entretien réduite de moitié"]], "Prudence si antécédent de convulsions"],
    ["cefazoline", "Céfazoline", "Antibioprophylaxie", 30, 30, "mg", "reel", 2000, "IV, 60 min avant l'incision", [[35, "Réinjection espacée : 1 g toutes les 8 h si DFG < 35"]], "2 g ; réinjection 1 g toutes les 4 h"],
    ["vancomycine", "Vancomycine", "Antibioprophylaxie", 20, 20, "mg", "reel", null, "IV sur 60 min, débutée 60 à 30 min avant l'incision", [], "Dose unique en prophylaxie, quel que soit le DFG"],
    ["gentamicine", "Gentamicine", "Antibioprophylaxie", 5, 7, "mg", "ideal", null, "IV, dose unique", [[30, "Dose unique possible ; pas de réinjection, dosages si répétée"]], "Poids ajusté chez l'obèse"],
    ["magnesium", "Sulfate de magnésium", "Adjuvant", 30, 50, "mg", "reel", 4000, "IV en 20 min", [[30, "DFG < 30 : réduire, surveiller la magnésémie"]], "Potentialise les curares"],
    ["enoxaparine", "Énoxaparine (prévention)", "Anticoagulant", null, null, "", "reel", null, "SC", [[15, "DFG < 15 : contre-indiquée, héparine calcique 5 000 UI × 2"], [30, "DFG 15–30 : 2 000 UI × 1/j"]], "4 000 UI × 1/j ; IMC ≥ 40 : 4 000 UI × 2/j"],
    ["atropine", "Atropine", "Anticholinergique", 0.01, 0.02, "mg", "reel", 1, "IV", [], "0,5 mg en bradycardie de l'adulte"],
    ["ephedrine", "Éphédrine", "Vasopresseur", null, null, "", "reel", null, "IV, bolus de 3 à 9 mg", [], "Tachyphylaxie au-delà de 30 mg"]
  ];
  const posoTool = P17.calc({
    id: "poso", kind: "tool", title: "Assistant de posologie", desc: "Choisir la molécule et saisir le poids ; le DFG s'affiche pour les molécules à adapter",
    fields: [
      { id: "mol", label: "Molécule", type: "select", full: true, options: MOLS_P.map(m => [m[0], `${m[1]} — ${m[2]}`]) },
      { id: "poids", label: "Poids", unit: "kg", placeholder: "ex. 70" },
      { id: "taille", label: "Taille (si obèse)", unit: "cm", placeholder: "ex. 170" },
      { id: "sexe", label: "Sexe", type: "seg", options: [["H", "Homme"], ["F", "Femme"]] },
      { id: "dfg", label: "DFG", unit: "mL/min", placeholder: "ex. 45", showIf: v => { const m = MOLS_P.find(x => x[0] === v.mol); return !!(m && m[9].length); } }
    ],
    compute: v => {
      const m = MOLS_P.find(x => x[0] === v.mol); if (!m) return null;
      const [, nom, cls, lo, hi, u, base, max, voie, rein, note] = m;
      const p = v.poids ? F.poidsDose(v.sexe, v.taille, v.poids) : null;
      const W = p ? (base === "maigre" ? p.maigre : base === "ideal" ? p.ideal : p.reel) : null;
      const fmt = x => f(x, x < 1 ? 2 : x < 10 ? 1 : 0);
      let main = "", sub = "";
      if (lo !== null && W) {
        let a = lo * W, b = hi * W; if (max) { a = Math.min(a, max); b = Math.min(b, max); }
        main = a === b ? `${fmt(a)} ${u}` : `${fmt(a)} à ${fmt(b)} ${u}`;
        const k = x => String(x).replace(".", ",");
        const wl = p.obese && base !== "reel" ? (base === "maigre" ? "poids maigre" : "poids idéal") : "poids réel";
        sub = `${k(lo)}${hi !== lo ? "–" + k(hi) : ""} ${u}/kg · ${wl} : ${fmt(W)} kg${max ? ` · plafond ${fmt(max)} ${u}` : ""}`;
      } else if (lo === null) { main = note.split(" ; ")[0]; sub = ""; }
      else return { html: `<div class="out-label">${nom}</div><p class="out-sub">Saisir le poids pour calculer la dose.</p>` };
      const r = rein.length && v.dfg !== null && v.dfg !== undefined ? rein.slice().sort((x, y) => x[0] - y[0]).find(x => v.dfg < x[0]) : null;
      return { tone: r ? "warn" : "", html: `<div class="out-label">${nom} · ${cls}</div><div class="out-main" style="margin-top:4px">${main}</div>${sub ? `<p class="out-sub">${sub}</p>` : ""}
        <dl class="out-rows out-rows--doses"><div><dt>Voie, moment</dt><dd>${voie}</dd></div>${note && lo !== null ? `<div><dt>À savoir</dt><dd>${note}</dd></div>` : ""}
        ${rein.length ? `<div><dt>Fonction rénale</dt><dd>${r ? `<b>${r[1]}</b>` : v.dfg ? "Pas d'adaptation à ce DFG" : "Saisir le DFG"}</dd></div>` : ""}</dl>` };
    },
    note: "Doses indicatives de l'adulte, à titrer selon l'effet et le terrain. Chez l'obèse (IMC ≥ 30), la taille permet le calcul sur le poids maigre ou idéal."
  });
  const POSO = {
    title: "Assistant de posologie", subtitle: "Dose selon la molécule et le poids, adaptée à la fonction rénale quand il le faut",
    tags: ["Poids maigre ou idéal", "DFG", "Adulte"], tool: posoTool, toolLabel: "Assistant",
    sections: [S("Poids de calcul", [kv(["Poids réel", "Succinylcholine, sugammadex, antibiotiques (hors aminosides), paracétamol"], ["Poids maigre", "Hypnotiques et morphiniques chez l'obèse"], ["Poids idéal", "Curares non dépolarisants, lidocaïne IV ; poids ajusté pour les aminosides"])])],
    refs: ["Résumés des caractéristiques des produits (base de données publique des médicaments)", "Nightingale CE et al. Peri-operative management of the obese surgical patient 2015. Anaesthesia 2015", "GPR (Guide de prescription et rein)"]
  };

  /* ============================== MONITORAGE ============================== */
  const MON = [
    { id: "standard", court: "Monitorage standard", desc: "ECG, SpO₂, pression non invasive, capnographie, gaz, température", fiche: {
      title: "Monitorage standard", subtitle: "Le minimum obligatoire pour toute anesthésie",
      tags: ["ECG", "SpO₂", "EtCO₂"],
      sections: [
        S("Obligatoire", [ul("ECG continu (DII et V5)", "SpO₂ continue avec alarmes actives", "Pression artérielle non invasive toutes les 3 à 5 minutes", "Capnographie dès qu'il y a intubation ou masque laryngé", "Fractions inspirée et expirée d'oxygène et des halogénés", "Pressions et volumes ventilatoires", "Température si l'anesthésie dépasse 30 minutes")]),
        S("Lire la capnographie", [tbl(["Aspect", "Cause"], [
          ["Absence de courbe", "Intubation œsophagienne, débranchement, arrêt circulatoire"],
          ["Chute brutale", "Embolie (gazeuse, pulmonaire), collapsus, débranchement partiel"],
          ["Plateau ascendant (aileron de requin)", "Bronchospasme, obstruction expiratoire"],
          ["Hausse progressive", "Hypoventilation, insufflation de CO₂, hyperthermie maligne"],
          ["Ligne de base qui ne revient pas à zéro", "Réinhalation : chaux sodée épuisée, valve défectueuse"]
        ])], { wide: true })
      ],
      refs: ["SFAR : Recommandations concernant la surveillance des patients en cours d'anesthésie"] } },
    { id: "pression-invasive", court: "Pression artérielle invasive", desc: "Cathéter artériel : pose, mise à zéro, amortissement", fiche: {
      title: "Pression artérielle invasive (cathéter artériel)", subtitle: "Mesure battement par battement et prélèvements répétés",
      tags: ["Mise à zéro", "Test de flush", "VPP"],
      sections: [
        S("Indications", [ul("Instabilité attendue ou présente, vasopresseurs", "Chirurgie hémorragique, clampages, neurochirurgie", "Cardiopathie sévère, prélèvements répétés (gaz du sang)", "Pose avant l'induction si l'hémodynamique est précaire")]),
        S("Technique", [ul("Artère radiale (test d'Allen peu fiable), fémorale ou humérale ; échoguidage", "Capteur à hauteur de l'oreillette droite (4e espace intercostal, ligne axillaire moyenne) ; au tragus en neurochirurgie assise", "Mise à zéro à l'air ambiant, ligne rigide et courte, poche de pression à 300 mmHg")]),
        S("Interpréter", [kv(["Test de flush", "Une à deux oscillations puis retour : courbe fiable. Aucune : sur-amortie (bulle, caillot, coudure), PAS sous-estimée. Nombreuses : sous-amortie, PAS surestimée"], ["Pression moyenne", "La plus fiable, peu sensible à l'amortissement"], ["Variation de pression pulsée", "> 13 % : précharge-dépendance probable, si ventilation contrôlée à 8 mL/kg, rythme sinusal, thorax fermé"])])
      ],
      refs: ["Saugel B et al. Arterial blood pressure monitoring in the perioperative period. Br J Anaesth 2020"] } },
    { id: "curarimetre", court: "Curarimètre", desc: "Train de quatre, compte post-tétanique", fiche: {
      title: "Monitorage de la curarisation", subtitle: "Monitorage quantitatif à l'adducteur du pouce, du début à la fin",
      tags: ["TOF", "Compte post-tétanique", "Rapport ≥ 0,9"],
      sections: [
        S("Principe", [ul("Stimulation du nerf ulnaire au poignet, réponse de l'adducteur du pouce", "Accéléromyographie ou électromyographie : mesure objective du rapport T4/T1", "Calibrer avant le curare, bras immobile, main libre")]),
        S("Modes", [kv(["Train de quatre (TOF)", "4 stimulations à 2 Hz : nombre de réponses et rapport T4/T1"], ["Compte post-tétanique (PTC)", "Si TOF à 0 : profondeur du bloc profond ; PTC 1–2 = sugammadex 4 mg/kg"], ["Double burst", "Détection visuelle meilleure que le TOF, mais toujours qualitative"])]),
        S("Interpréter", [tbl(["Résultat", "Bloc"], [["PTC 0", "Intense"], ["TOF 0, PTC ≥ 1", "Profond"], ["TOF 1 à 3", "Modéré : chirurgie"], ["TOF 4, rapport < 0,9", "Léger : curarisation résiduelle"], ["Rapport ≥ 0,9", "Extubation possible"]], "Le muscle orbiculaire de l'œil récupère avant le pouce : il surestime la récupération.")])
      ],
      refs: ["RFE SFAR 2018 : Curarisation et décurarisation en anesthésie", "Thilen SR et al. ASA practice guidelines for monitoring and antagonism of neuromuscular blockade. Anesthesiology 2023"] } },
    { id: "bis", court: "Index bispectral (BIS)", desc: "Profondeur d'anesthésie par l'EEG", fiche: {
      title: "Index bispectral (BIS)", subtitle: "EEG frontal traité : un chiffre de 0 à 100 pour la profondeur de l'hypnose",
      tags: ["40–60", "Rapport de suppression", "Sujet âgé"],
      sections: [
        S("Principe", [ul("Électrodes frontales, EEG analysé en temps réel (fréquences, synchronisation, périodes isoélectriques)", "Valeur de 0 (EEG plat) à 100 (éveil), avec l'indice de qualité du signal et l'électromyogramme")]),
        S("Interpréter", [tbl(["Valeur", "Signification"], [["> 60", "Hypnose insuffisante : risque de mémorisation"], ["40–60", "Anesthésie générale adaptée"], ["< 40", "Trop profonde ; rapport de suppression > 0 : bouffées-suppressions"]], ""),
          ul("Intérêt : anesthésie intraveineuse avec curares (prévention de la mémorisation), sujet âgé (moins de surdosage), titration du propofol", "Limites : kétamine et protoxyde d'azote élèvent le BIS, électromyogramme, bistouri électrique, hypothermie", "Ne mesure pas l'analgésie")])
      ],
      refs: ["Punjasawadwong Y et al. Processed electroencephalogram and evoked potential techniques for amelioration of postoperative delirium. Cochrane 2018", "Aldecoa C et al. ESAIC guideline on postoperative delirium. Eur J Anaesthesiol 2024"] } },
    { id: "nirs", court: "Oxymétrie cérébrale (NIRS)", desc: "Saturation régionale en oxygène du cortex frontal", fiche: {
      title: "Oxymétrie cérébrale (NIRS)", subtitle: "Saturation régionale en oxygène : surveiller la tendance par rapport à la valeur de base",
      tags: ["rSO₂", "Baisse > 20 %", "Tendance"],
      sections: [
        S("Principe", [ul("Lumière proche infrarouge à travers le crâne : rapport oxy- et désoxyhémoglobine, surtout veineuse", "Électrodes frontales, valeur de base mesurée avant l'induction, à l'air")]),
        S("Interpréter", [kv(["Valeurs", "Normale 60–80 % ; la valeur absolue varie d'un patient à l'autre"], ["Alerte", "Baisse de plus de 20 % de la valeur de base, ou valeur absolue < 50 %"], ["Indications", "Chirurgie cardiaque et carotidienne, position assise ou beach-chair, sujets à risque d'hypoperfusion cérébrale"])]),
        S("Conduite devant une baisse", [ol("Vérifier la position de la tête et des capteurs", "Remonter la pression artérielle moyenne", "Normocapnie (l'hypocapnie diminue le débit cérébral)", "Augmenter la FiO₂", "Corriger l'anémie, optimiser le débit cardiaque", "Approfondir l'anesthésie si nécessaire")], { tone: "key" })
      ],
      refs: ["Denault A et al. A proposed algorithm for the intraoperative use of cerebral near-infrared spectroscopy. Semin Cardiothorac Vasc Anesth 2007"] } },
    { id: "swan-ganz", court: "Cathéter artériel pulmonaire (Swan-Ganz)", desc: "Pressions droites, PAPO, débit, SvO₂", fiche: {
      title: "Cathéter artériel pulmonaire (Swan-Ganz)", subtitle: "Pressions de l'oreillette droite à l'artère pulmonaire, débit par thermodilution et SvO₂",
      tags: ["PAPO", "Thermodilution", "SvO₂"],
      sections: [
        S("Indications", [ul("Hypertension pulmonaire sévère, dysfonction du ventricule droit", "Choc complexe ne répondant pas au traitement, transplantation hépatique ou cardiaque", "L'échocardiographie l'a remplacé dans la plupart des situations")]),
        S("Mise en place", [ul("Introducteur jugulaire interne, ballonnet gonflé, progression en suivant les courbes", "Oreillette droite vers 20 cm, ventricule droit vers 30 cm (passage : arythmies), artère pulmonaire vers 40 cm, position bloquée vers 45–50 cm", "Ballonnet dégonflé en dehors des mesures")]),
        S("Valeurs", [tbl(["Paramètre", "Normale"], [["Pression de l'oreillette droite", "2–8 mmHg"], ["Pression du ventricule droit", "15–30 / 2–8 mmHg"], ["Pression artérielle pulmonaire", "15–30 / 8–15 mmHg, moyenne < 20"], ["Pression artérielle pulmonaire d'occlusion (PAPO)", "6–12 mmHg, lue en fin d'expiration"], ["Index cardiaque", "2,5–4 L/min/m²"], ["SvO₂", "65–75 %"]])], { wide: true }),
        S("Complications", [ul("Arythmies au passage du ventricule droit", "Rupture de l'artère pulmonaire (ballonnet gonflé trop longtemps ou en position distale)", "Infarctus pulmonaire, infection, thrombose")], { tone: "alert" })
      ],
      refs: ["Rajaram SS et al. Pulmonary artery catheters for adult patients in intensive care. Cochrane 2013"] } },
    { id: "debit-cardiaque", court: "Débit cardiaque mini-invasif", desc: "Analyse du contour de l'onde de pouls, thermodilution transpulmonaire", fiche: {
      title: "Débit cardiaque mini-invasif", subtitle: "Optimiser le remplissage et les catécholamines en chirurgie à risque",
      tags: ["VES", "Thermodilution transpulmonaire", "Remplissage guidé"],
      sections: [
        S("Techniques", [tbl(["Technique", "Principe", "À savoir"], [
          ["Analyse du contour de l'onde de pouls", "Débit estimé à partir de la courbe de pression artérielle", "Simple ; peu fiable si vasoplégie importante ou arythmie"],
          ["Thermodilution transpulmonaire (PiCCO)", "Injection froide sur voie centrale, thermistance artérielle fémorale", "Débit de référence, eau pulmonaire extravasculaire, volume télédiastolique global"],
          ["Doppler œsophagien", "Vitesse du flux dans l'aorte descendante", "Patient intubé, sonde à repositionner"],
          ["Échocardiographie", "ITV sous-aortique", "Ponctuelle, opérateur-dépendante"]
        ])], { wide: true }),
        S("Utilisation", [ul("Remplissage guidé : bolus de 250 mL, à répéter tant que le volume d'éjection augmente de plus de 10 %", "Indications : chirurgie majeure, patient à haut risque, choc"), info("Les techniques de calcul (VES, index cardiaque, résistances) figurent dans les calculateurs d'hémodynamique.")])
      ],
      refs: ["Vallet B et al. Guidelines for perioperative haemodynamic optimization (SFAR). Ann Fr Anesth Reanim 2013"] } },
    { id: "nociception", court: "Monitorage de la nociception", desc: "ANI, pupillométrie", fiche: {
      title: "Monitorage de la nociception", subtitle: "Estimer l'équilibre nociception–analgésie pendant l'anesthésie",
      tags: ["ANI", "Pupillométrie", "Épargne morphinique"],
      sections: [
        S("Techniques", [kv(["ANI (variabilité de la fréquence cardiaque)", "0 à 100 ; < 50 : nociception insuffisamment contrôlée. Faussé par les arythmies, l'atropine, les bêtabloquants"], ["Pupillométrie", "Réflexe de dilatation pupillaire à un stimulus : intérêt pour titrer les morphiniques"], ["Signes cliniques", "Tachycardie, hypertension, larmoiement : tardifs et peu spécifiques"])]),
        S("Intérêt", [ul("Titration des morphiniques, épargne morphinique", "Le niveau de preuve reste limité : à interpréter avec la clinique")])
      ],
      refs: ["Ledowski T. Objective monitoring of nociception: a review of current commercial solutions. Br J Anaesth 2019"] } },
    { id: "temperature", court: "Température", desc: "Mesure centrale, prévention de l'hypothermie", fiche: {
      title: "Température", subtitle: "Mesurer au centre, prévenir l'hypothermie dès l'induction",
      tags: ["> 36 °C", "Réchauffement actif", "Sondes centrales"],
      sections: [
        S("Mesurer", [kv(["Sites centraux", "Œsophage (tiers inférieur), vessie, nasopharynx, artère pulmonaire"], ["Sites périphériques", "Tympan, peau : moins fiables"], ["Quand", "Toute anesthésie de plus de 30 minutes"])]),
        S("Prévenir l'hypothermie", [ul("Réchauffement actif par air pulsé dès l'arrivée au bloc, et avant l'induction si possible", "Solutés et produits sanguins réchauffés au-delà de 500 mL/h", "Objectif : température centrale au-dessus de 36 °C"), warn("L'hypothermie augmente le saignement, les infections du site opératoire, les complications cardiaques et allonge l'action des curares.")])
      ],
      refs: ["RFE SFAR 2018 : Prévention de l'hypothermie peropératoire accidentelle"] } }
  ];

  /* ======================= TRANSFUSION ======================= */
  const seuilTool = P17.calc({
    id: "seuils", kind: "tool", title: "Seuil transfusionnel selon le patient", desc: "Choisir le produit puis le contexte : le seuil et la dose s'adaptent",
    fields: [
      { id: "prod", label: "Produit", type: "seg", full: true, options: [["cgr", "Globules rouges"], ["plq", "Plaquettes"], ["pfc", "Plasma"], ["fib", "Fibrinogène"]] },
      { id: "poids", label: "Poids", unit: "kg", placeholder: "ex. 70" },
      { id: "age", label: "Âge", unit: "ans", placeholder: "ex. 60", showIf: v => v.prod === "cgr" },
      { id: "cgr", label: "Contexte", type: "checks", full: true, showIf: v => v.prod === "cgr", options: [["cardio", "Antécédent cardiovasculaire (coronarien, insuffisance cardiaque, AVC)"], ["sca", "Syndrome coronarien aigu ou insuffisance cardiaque décompensée"], ["intol", "Mauvaise tolérance : tachycardie, hypotension, ischémie à l'ECG, lactate élevé"], ["neuro", "Traumatisme crânien ou lésion cérébrale"], ["saign", "Hémorragie active"]] },
      { id: "plq", label: "Situation", type: "select", full: true, showIf: v => v.prod === "plq", options: [["chir", "Chirurgie ou geste invasif"], ["neuro", "Neurochirurgie, chirurgie ophtalmologique du segment postérieur"], ["neuraxe", "Rachianesthésie, péridurale ou retrait de cathéter"], ["saign", "Hémorragie active ou massive"], ["aap", "Hémorragie sous antiagrégant puissant"], ["prev", "Prévention, sans geste ni saignement"]] },
      { id: "pfc", label: "Situation", type: "select", full: true, showIf: v => v.prod === "pfc", options: [["massive", "Hémorragie massive"], ["saign", "Saignement avec TP < 40 % ou TCA > 1,5 × témoin"], ["avk", "Saignement sous AVK sans CCP disponible"], ["sans", "Pas de saignement"]] },
      { id: "fib", label: "Fibrinogène mesuré", unit: "g/L", placeholder: "ex. 1,2", showIf: v => v.prod === "fib" }
    ],
    compute: v => {
      const P = v.poids;
      if (v.prod === "cgr") {
        const c = v.cgr || [];
        let seuil = 7, why = "Patient sans antécédent";
        if (c.includes("cardio") || (v.age >= 75)) { seuil = 8; why = c.includes("cardio") ? "Antécédent cardiovasculaire" : "Âge ≥ 75 ans"; }
        if (c.includes("neuro")) { seuil = Math.max(seuil, 9); why = "Lésion cérébrale"; }
        if (c.includes("sca") || c.includes("intol")) { seuil = 10; why = c.includes("sca") ? "Syndrome coronarien aigu ou insuffisance cardiaque" : "Mauvaise tolérance de l'anémie"; }
        const sa = c.includes("saign");
        return { label: "Globules rouges", main: `Transfuser si Hb < ${seuil} g/dL`, sub: `${why}${sa ? " ; en hémorragie active, la transfusion suit le débit du saignement, sans attendre l'hémoglobine" : ""}`,
          rows: [["Dose", "Un concentré à la fois hors hémorragie, puis contrôle"], ["Effet attendu", "≈ + 1 g/dL par concentré chez l'adulte"], ...(sa ? [["Hémorragie active", "Cible 7–9 g/dL ; plasma et plaquettes associés"]] : [])], tone: seuil >= 9 ? "warn" : "" };
      }
      if (v.prod === "plq") {
        const T = { chir: [50, "Chirurgie ou geste invasif"], neuro: [100, "Neurochirurgie, ophtalmologie postérieure"], neuraxe: [80, "Rachianesthésie : 50 G/L ; péridurale ou retrait de cathéter : 80 G/L"], saign: [50, "Hémorragie : 50 G/L ; 100 G/L si saignement persistant ou traumatisme crânien"], aap: [null, "Transfusion à discuter quel que soit le chiffre"], prev: [10, "Prévention isolée"] }[v.plq || "chir"];
        return { label: "Plaquettes", main: T[0] ? `Transfuser si < ${T[0]} G/L` : "Selon le saignement", sub: T[1], rows: [["Dose", P ? `${f(0.5 * P / 10, 1)} × 10¹¹ plaquettes (0,5 × 10¹¹ pour 10 kg)` : "0,5 × 10¹¹ pour 10 kg"]] };
      }
      if (v.prod === "pfc") {
        const T = { massive: ["Précoce, ratio plasma/CGR 1:2 à 1:1", "Sans attendre le bilan"], saign: ["TP < 40 % ou TCA > 1,5 × témoin", "Avec saignement"], avk: ["CCP en premier", "Plasma seulement si CCP indisponible"], sans: ["Pas d'indication", "Pas de plasma préventif sur un bilan perturbé sans saignement"] }[v.pfc || "massive"];
        return { label: "Plasma", main: T[0], sub: T[1], rows: [["Dose", P ? `${f(15 * P, 0)} mL (15 mL/kg)` : "10–15 mL/kg"]] };
      }
      if (v.prod === "fib") {
        const low = v.fib !== null && v.fib !== undefined && v.fib <= 1.5;
        return { label: "Fibrinogène", main: v.fib == null ? "Seuil : 1,5 g/L avec saignement" : low ? "Concentré de fibrinogène indiqué" : "Pas d'indication", sub: "Hémorragie : seuil de 1,5 g/L (2 g/L en obstétrique)", rows: [["Dose", P ? `${f(Math.round(25 * P / 500) / 2, 1)} à ${f(Math.round(50 * P / 500) / 2, 1)} g (25–50 mg/kg), soit 3 g en règle` : "25–50 mg/kg, soit 3 g chez l'adulte"]], tone: low ? "warn" : "" };
      }
      return null;
    },
    note: "D'après HAS 2014 (globules rouges) et ESAIC 2022 (saignement périopératoire). Le seuil est un repère : la tolérance clinique décide."
  });
  const CROSS = `<figure class="cross">
    <svg viewBox="0 0 560 220" role="img" aria-label="Carte de contrôle ultime : patient et concentré de groupe A, compatibles">
      <rect class="c-card" x="10" y="10" width="540" height="200" rx="14"/>
      <text class="c-h" x="150" y="40" text-anchor="middle">Patient</text><text class="c-h" x="410" y="40" text-anchor="middle">Concentré (CGR)</text>
      <line class="c-sep" x1="280" y1="24" x2="280" y2="196"/>
      ${[[90, "Anti-A", 1], [210, "Anti-B", 0], [350, "Anti-A", 1], [470, "Anti-B", 0]].map(([x, t, agg]) => `
        <circle class="c-well" cx="${x}" cy="118" r="44"/>
        ${agg ? Array.from({ length: 14 }, (_, k) => { const a = k * 2.4, r = 10 + (k % 3) * 9; return `<circle class="c-agg" cx="${(x + r * Math.cos(a)).toFixed(1)}" cy="${(118 + r * Math.sin(a)).toFixed(1)}" r="${4 + (k % 3)}"/>`; }).join("") : `<circle class="c-hom" cx="${x}" cy="118" r="34"/>`}
        <text class="c-t" x="${x}" y="186" text-anchor="middle">${t}</text>`).join("")}
    </svg>
    <figcaption><b>Exemple : patient du groupe A, concentré du groupe A : compatible.</b> Agglutination (grains) avec l'anti-A, aspect homogène avec l'anti-B, de façon identique pour le patient et la poche. Toute discordance : ne pas transfuser, prévenir le médecin et le centre de transfusion.</figcaption>
  </figure>`;
  const TRANSF2 = {
    title: "Transfusion", subtitle: "Seuils transfusionnels, adaptation au patient et sécurité au lit",
    tags: ["Seuils", "Contrôle ultime", "Hémovigilance"],
    sections: [
      S("Seuils transfusionnels", [tbl(["Produit", "Seuil", "Dose"], [
        ["Globules rouges", "7 g/dL sans antécédent ; 8–9 g/dL si antécédent cardiovasculaire ; 10 g/dL si mauvaise tolérance, syndrome coronarien aigu ou insuffisance cardiaque", "Un concentré élève l'hémoglobine d'environ 1 g/dL"],
        ["Plaquettes", "50 G/L pour une chirurgie ; 100 G/L en neurochirurgie", "0,5 × 10¹¹ pour 10 kg"],
        ["Plasma", "Saignement avec TP < 40 %", "15 mL/kg"],
        ["Fibrinogène", "≤ 1,5 g/L avec saignement", "25–50 mg/kg, soit 3 g chez l'adulte"],
        ["Concentré de complexe prothrombinique", "Saignement sous AVK", "25 UI/kg avec vitamine K 10 mg"]
      ])], { wide: true, tool: seuilTool }),
      S("Sécurité transfusionnelle", [ol("Prescription nominative, deux déterminations de groupe, agglutinines irrégulières de moins de 72 heures", "Contrôle ultime au lit du patient : identité, concordance des documents, compatibilité ABO sur carte", "Surveillance rapprochée pendant les 15 premières minutes, puis régulière", "Traçabilité de chaque produit dans le dossier")]),
      S("Contrôle ultime au lit : la carte", [{ html: CROSS }], { wide: true }),
      S("Réaction transfusionnelle", [ul("Arrêter la transfusion, garder la voie veineuse, prévenir le médecin et le centre de transfusion", "Penser à l'incompatibilité ABO, à la surcharge, au TRALI, à la contamination bactérienne, à l'anaphylaxie", "Transfusion rapide ou massive : hyperkaliémie, hypocalcémie, hypothermie")], { tone: "alert" })
    ],
    refs: ["HAS 2014 : Transfusion de globules rouges homologues : produits, indications, alternatives", "ANSM : Transfusion de plaquettes et de plasma, recommandations", "Kietaibl S et al. Management of severe peri-operative bleeding: guidelines from the ESAIC, second update 2022. Eur J Anaesthesiol 2023"]
  };

  /* ======================= ÉPARGNE SANGUINE (pré-opératoire) ======================= */
  const PBM = {
    title: "Épargne sanguine (Patient Blood Management)", subtitle: "Trois piliers : optimiser les globules rouges, limiter les pertes, tolérer l'anémie",
    tags: ["Fer IV", "Acide tranexamique", "Récupération du sang"], tool: psaTool, toolLabel: "Pertes admissibles",
    sections: [
      S("1. Optimiser avant l'intervention", [ul("Dépister l'anémie (hémoglobine < 13 g/dL) au moins 4 semaines avant une chirurgie hémorragique", "Carence martiale (ferritine < 100 µg/L, ou < 300 µg/L avec un coefficient de saturation < 20 %) : fer intraveineux", "Érythropoïétine en chirurgie orthopédique majeure si l'hémoglobine est entre 10 et 13 g/dL", "Gérer les antithrombotiques ; groupe sanguin et agglutinines irrégulières selon le risque hémorragique")]),
      S("2. Limiter les pertes pendant l'intervention", [ul("Acide tranexamique 1 g à l'incision en chirurgie hémorragique (prothèse, rachis, traumatologie) ; prudence en cas d'antécédent de convulsions", "Normothermie, normocalcémie, pH normal", "Récupération du sang épanché si les pertes prévues dépassent 500 mL", "Hémostase chirurgicale soigneuse, garrot quand il est possible", "Limiter les prélèvements sanguins")]),
      S("3. Tolérer l'anémie", [ul("Stratégie transfusionnelle restrictive, un concentré à la fois hors hémorragie active", "Oxygénation, débit cardiaque et volémie optimisés", "Fer intraveineux après l'intervention si l'anémie persiste")])
    ],
    refs: ["HAS 2022 : Gestion du capital sanguin en pré, per et post-opératoire et en obstétrique", "Shander A et al. Recommendations from the International Consensus Conference on Anemia Management in Surgical Patients. Ann Surg 2023"]
  };

  /* ============================ Routes Per-opératoire ============================ */
  const base = [[SEC, ROOT]];
  const GROUPES = [
    { id: "pharmacologie", titre: "Pharmacologie et thérapeutique", step: "Médicaments", icon: "perop", items: [
      { id: "hypnotiques-morphiniques-curares", fiche: MEDS, court: "Hypnotiques, morphiniques, curares", desc: "Doses d'induction et d'entretien", kw: "propofol sufentanil rocuronium étomidate kétamine poids idéal obèse" },
      { id: "vasopresseurs-inotropes", fiche: VASO, court: "Vasopresseurs et inotropes", desc: "Choix, bolus, débits continus", kw: "noradrénaline éphédrine phényléphrine adrénaline dobutamine milrinone nicardipine" },
      { id: "antibioprophylaxie", fiche: ABP, court: "Antibioprophylaxie", desc: "Outil par intervention, réinjections", kw: "céfazoline céfoxitine réinjection allergie SFAR SPILF 2024" },
      { id: "antagonisation-curares", fiche: ANTAG, court: "Antagonisation des curares", desc: "Sugammadex, néostigmine", kw: "décurarisation sugammadex néostigmine TOF" },
      { id: "anesthesiques-locaux", fiche: AL, court: "Anesthésiques locaux", desc: "Doses maximales, adjuvants", kw: "ropivacaïne bupivacaïne lidocaïne dose maximale" },
      { id: "dilutions-seringues", fiche: DIL, court: "Dilutions et seringues électriques", desc: "Préparations standard, débits", kw: "PSE seringue électrique dilution mg/h µg/kg/min" },
      { id: "assistant-posologie", fiche: POSO, court: "Assistant de posologie", desc: "Dose selon le poids et le DFG", kw: "posologie dose poids DFG insuffisance rénale" }
    ] },
    { id: "monitorage", titre: "Monitorage", step: "Surveiller", icon: "sspi", items: MON.map(m => ({ ...m, kw: m.desc })) },
    { id: "gestes", titre: "Gestes et techniques", step: "Faire", icon: "fiche", items: [
      { id: "voies-aeriennes", fiche: VAS, court: "Voies aériennes et estomac plein", desc: "Préoxygénation, stratégie, séquence rapide", kw: "intubation difficile crush induction Sellick inhalation jeûne", top: true },
      { id: "rachianesthesie", fiche: RACHI, court: "Rachianesthésie", desc: "Technique, doses, complications", kw: "bupivacaïne hyperbare brèche céphalées blood patch", top: true },
      { id: "transfusion", fiche: TRANSF2, court: "Transfusion", desc: "Seuils selon le patient, contrôle ultime", kw: "CGR plaquettes plasma fibrinogène seuil cross-match", top: true }
    ] }
  ];
  const pathOf = (g, it) => it.top ? `${ROOT}/${it.id}` : `${ROOT}/${g.id}/${it.id}`;
  const tileOf = (g, it) => ({ href: pathOf(g, it), title: it.court, desc: it.desc, icon: g.icon, accent: "anesthesie" });
  // Accueil, volet Per-opératoire : une tuile par groupe (pharmacologie, monitorage) puis les gestes
  P17.perop = [
    ...GROUPES.filter(g => g.id !== "gestes").map(g => ({ href: `${ROOT}/${g.id}`, title: g.titre, desc: g.items.map(i => i.court).slice(0, 3).join(", ") + "…", icon: g.icon, accent: "anesthesie" })),
    ...GROUPES[2].items.map(it => tileOf(GROUPES[2], it))
  ];
  P17.route(ROOT, {
    title: SEC,
    render: () => P17.page({ crumbs: base, title: SEC, accent: "anesthesie", icon: "perop", back: "#/",
      subtitle: "Pharmacologie, monitorage, gestes et transfusion. Toucher une rubrique pour la déplier.",
      body: P17.accordion("perop", GROUPES.map(g => ({ id: g.id, title: g.titre, step: g.step, icon: g.icon, n: g.items.length, html: P17.tiles(g.items.map(it => tileOf(g, it))) }))) })
  });
  P17.index(ROOT, SEC, "bloc opératoire peropératoire", SEC);
  GROUPES.filter(g => g.id !== "gestes").forEach(g => {
    P17.route(`${ROOT}/${g.id}`, { title: g.titre, render: () => P17.page({ crumbs: [...base, [g.titre, `${ROOT}/${g.id}`]], title: g.titre, accent: "anesthesie", icon: g.icon, body: P17.tiles(g.items.map(it => tileOf(g, it))) }) });
    P17.index(`${ROOT}/${g.id}`, g.titre, g.items.map(i => i.court).join(" "), SEC);
  });
  GROUPES.forEach(g => g.items.forEach(p => {
    const path = pathOf(g, p);
    const parents = p.top ? base : [...base, [g.titre, `${ROOT}/${g.id}`]];
    P17.route(path, { title: p.court, render: () => {
      const fi = { ...p.fiche }; if (fi.toolFn) { fi.tool = fi.toolFn(); delete fi.toolFn; }
      const back = parents[parents.length - 1];
      return `
      <div class="page accent-anesthesie">
        <div class="page-head">${P17.backLink(back[1], back[0])}${P17.crumbs([...parents, [p.court, path]])}</div>
        ${P17.fiche({ kicker: g.titre, accent: "anesthesie", ...fi })}
      </div>`; } });
    P17.index(path, p.fiche.title, `${p.desc} ${p.kw || ""} ${(p.fiche.tags || []).join(" ")}`, SEC);
  }));
  // anciennes adresses
  P17.redirect(`${ROOT}/medicaments`, `${ROOT}/pharmacologie/hypnotiques-morphiniques-curares`);
  P17.redirect(`${ROOT}/antibioprophylaxie`, `${ROOT}/pharmacologie/antibioprophylaxie`);

  // Épargne sanguine : Gestion pré-opératoire
  const PBM_PATH = "#/preop/epargne-sanguine";
  P17.route(PBM_PATH, { title: "Épargne sanguine", render: () => `
    <div class="page accent-anesthesie">
      <div class="page-head">${P17.backLink("#/preop", "Gestion pré-opératoire")}${P17.crumbs([["Gestion pré-opératoire", "#/preop"], ["Épargne sanguine", PBM_PATH]])}</div>
      ${P17.fiche({ kicker: "Gestion pré-opératoire", accent: "anesthesie", ...PBM })}
    </div>` });
  P17.index(PBM_PATH, PBM.title, "patient blood management fer ferritine anémie EPO acide tranexamique cell saver pertes admissibles", "Gestion pré-opératoire");
  if (P17.preop) P17.preop.push({ href: PBM_PATH, title: "Épargne sanguine", desc: "Anémie, fer, acide tranexamique, pertes admissibles", icon: "eer", accent: "anesthesie" });

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
