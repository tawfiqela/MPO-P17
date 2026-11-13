/* =====================================================================
   Commun à toutes les spécialités : consultation d'anesthésie,
   traitements chroniques, antiagrégants et anticoagulants.
   Anticoagulants : RFE GIHP-SFAR 2026 « Gestion des anticoagulants pour
   une procédure invasive programmée » (version du 20 avril 2026).
   Antiagrégants : propositions GIHP-GFHT 2018 (Godier et al.).
   ===================================================================== */
(function () {
  const { S, ul, ult, ol, kv, tbl, warn, danger, info, ok } = P17.h;
  const F = window.P17Calc;
  const SEC = "Gestion pré-opératoire";
  const ROOT = "#/preop";
  const base = [[SEC, ROOT]];
  const REF_GIHP26 = "RFE GIHP-SFAR 2026 : Gestion des anticoagulants pour une procédure invasive programmée (version du 20 avril 2026)";
  const REF_GIHP18 = "Godier A et al. Gestion des agents antiplaquettaires pour une procédure invasive programmée. Propositions actualisées du GIHP et du GFHT. Anesth Reanim 2018";
  const REF_ESAIC = "Kietaibl S et al. Regional anaesthesia in patients on antithrombotic drugs: joint ESAIC/ESRA guidelines. Eur J Anaesthesiol 2022";
  const REF_HAS26 = "HAS 2026 : Solutions pour la sécurité du patient — Gestion périopératoire des patients sous antithrombotiques";
  const REF_ESC = "Halvorsen S et al. 2022 ESC Guidelines on cardiovascular assessment and management of patients undergoing non-cardiac surgery. Eur Heart J 2022";

  /* ------------------------------------------------------------------
     Classement des procédures (annexes RFE 2026) :
     ac : risque pour les anticoagulants (f faible, e élevé, te très élevé)
     ap : risque pour les antiagrégants (faible : sous bithérapie ;
          inter : sous aspirine seule ; eleve : sans antiplaquettaire)
     ------------------------------------------------------------------ */
  const PROC = {
    visc: { label: "Chirurgie viscérale", items: [
      ["colo", "Chirurgie colorectale", "e", "inter"], ["oeso", "Chirurgie œsogastrique", "e", "inter"],
      ["hbp", "Hépatectomie, pancréatectomie", "e", "inter"], ["chole", "Cholécystectomie", "e", "inter"],
      ["bari", "Chirurgie bariatrique", "e", "inter"], ["hernie", "Hernie, éventration", "e", "inter", "Reprise curative différée : après H48 si risque thrombotique élevé (valve mécanique), à H72 sinon ; plus tard si grands décollements"],
      ["hemo", "Chirurgie hémorroïdaire, exérèse transanale", "e", "inter", "Risque exceptionnel (SNFCP) : reprise de l'anticoagulation curative après H72"],
      ["procto", "Fissurectomie, fistule anale", "e", "inter"]
    ] },
    uro: { label: "Urologie", items: [
      ["sond", "Sondage, sonde JJ, cystostomie, urétrocystoscopie", "f", "faible"],
      ["rtup", "RTUP, énucléation, photovaporisation", "e", "inter", "Pas de reprise curative à H48–72 si hématurie persistante (lavages)"],
      ["rtuv", "RTUV, injection intradétrusorienne", "e", "inter", "Pas de reprise curative à H48–72 si hématurie persistante"],
      ["abdo", "Prostatectomie, néphrectomie, cystectomie (ouverte, cœlio, robot)", "e", "inter", "Néphrectomie partielle complexe (RENAL ≥ 7) : reprise à discuter au cas par cas"],
      ["greffe", "Transplantation rénale", "e", "inter"],
      ["nlpc", "NLPC, néphrostomie percutanée", "e", "inter", "NLPC avec ponctions multiples ou hématurie persistante : reprise différée"],
      ["urs", "Urétéroscopie, lithotritie extracorporelle", "e", "inter"],
      ["biopsie", "Biopsie prostatique ou rénale", "e", "inter"],
      ["scrot", "Chirurgie scrotale, inguinale, périnéale, vaginale", "e", "inter"]
    ] },
    gyn: { label: "Gynécologie et sénologie", items: [
      ["biop", "Biopsie (sein, col, endomètre, vulve), hystéroscopie diagnostique", "f", "faible"],
      ["cip", "Chambre implantable percutanée", "f", "faible"],
      ["sein", "Tumorectomie, mastectomie, ganglion sentinelle, curage", "e", "inter"],
      ["hyst", "Hystérectomie (toutes voies), cœlioscopie opératoire", "e", "inter"],
      ["onco", "Laparotomie, cytoréduction, chirurgie de Wertheim", "e", "inter"],
      ["vulve", "Chirurgie vulvaire et vaginale", "e", "inter"]
    ] },
    thor: { label: "Chirurgie thoracique", items: [
      ["exer", "Lobectomie, segmentectomie, wedge, pneumonectomie", "e", "inter"],
      ["med", "Médiastin, plèvre, trachée, médiastinoscopie", "e", "inter"],
      ["drain", "Drain thoracique, pleuroscopie", "e", "inter"]
    ] },
    neuro: { label: "Neurochirurgie", items: [
      ["crane", "Chirurgie crânienne (tumeur, anévrisme, hématome)", "te", "eleve", "Reprise de l'anticoagulation curative le plus souvent vers J10"],
      ["dvp", "Dérivation ventriculo-péritonéale, électrodes de SEEG", "te", "eleve"],
      ["rachis_d", "Rachis avec ouverture durale", "te", "eleve", "Reprise curative entre J3 et J7 selon le risque, par HBPM ; surveillance neurologique"],
      ["rachis", "Rachis sans ouverture durale", "e", "inter", "Reprise curative entre J3 et J7 selon le risque, par HBPM ; surveillance neurologique"]
    ] },
    ortho: { label: "Traumatologie et orthopédie", items: [
      ["hanche", "Hanche, genou, fémur (prothèse, ostéosynthèse)", "e", "inter"],
      ["osteo", "Autres ostéosynthèses, bassin", "e", "inter"],
      ["rachis_o", "Rachis : arthrodèse, libération canalaire, cimentoplastie", "e", "inter", "Reprise curative entre J3 et J7, par HBPM"],
      ["arthro_r", "Arthroscopie avec réparation (coiffe, ligamentoplastie)", "e", "inter"],
      ["arthro_d", "Arthroscopie diagnostique, méniscectomie simple", "f", "faible"],
      ["main", "Main : canal carpien, chirurgie digitale", "f", "faible", "AVK : préférer un INR ≤ 2"],
      ["tumeur", "Résection tumorale, biopsie à ciel ouvert", "e", "inter"]
    ] },
    endo: { label: "Endoscopie digestive", items: [
      ["diag", "Endoscopie diagnostique ± biopsies, écho-endoscopie diagnostique", "f", "faible", "Toute coloscopie doit être envisagée comme susceptible de nécessiter une polypectomie"],
      ["stent", "Prothèse biliaire ou pancréatique, stent digestif", "f", "faible"],
      ["poly", "Polypectomie, mucosectomie, dissection sous-muqueuse", "e", "inter"],
      ["cpre", "CPRE avec sphinctérotomie", "e", "inter"],
      ["ampul", "Ampullectomie", "e", "eleve", "Seul geste endoscopique non réalisable sous aspirine"],
      ["eus", "Écho-endoscopie avec biopsie ou thérapeutique", "e", "inter"],
      ["gastro", "Gastrostomie, dilatation, traitement des varices", "e", "inter"]
    ] },
    autre: { label: "Autres gestes", items: [
      ["kt", "Pose ou retrait de chambre implantable, cathéter tunnelisé", "f", "faible"],
      ["pl", "Ponction lombaire", "te", "inter"],
      ["biop_prof", "Biopsie profonde percutanée (foie, rein, poumon)", "e", "inter"]
    ] }
  };
  const ANESTH = { ag: ["Anesthésie générale ou bloc superficiel", "f"], profond: ["Bloc profond (paravertébral, infraclaviculaire, plexus lombaire)", "e"], neurax: ["Rachianesthésie, péridurale, périrachi combinée", "te"] };
  const RANK = { f: 0, e: 1, te: 2 };
  const RISK_LABEL = { f: "Faible", e: "Élevé", te: "Très élevé" };
  const APRANK = { faible: 0, inter: 1, eleve: 2 };

  const MOLS = [
    ["apixaban", "Apixaban (Eliquis®)"], ["rivaroxaban", "Rivaroxaban (Xarelto®)"], ["edoxaban", "Edoxaban (Lixiana®)"], ["dabigatran", "Dabigatran (Pradaxa®)"],
    ["warfarine", "Warfarine (Coumadine®)"], ["fluindione", "Fluindione (Préviscan®)"], ["acenocoumarol", "Acénocoumarol (Sintrom®)"],
    ["hbpm_cur", "HBPM à dose curative"], ["hnf_sc", "HNF sous-cutanée à dose curative"], ["hnf_ivse", "HNF IV continue (IVSE)"], ["fonda_cur", "Fondaparinux à dose curative"],
    ["aspirine", "Aspirine (faible dose)"], ["clopidogrel", "Clopidogrel (Plavix®)"], ["ticagrelor", "Ticagrélor (Brilique®)"], ["prasugrel", "Prasugrel (Efient®)"], ["dapt", "Bithérapie aspirine + anti-P2Y12"]
  ];
  const isAOD = m => ["apixaban", "rivaroxaban", "edoxaban", "dabigatran"].includes(m);
  const isAVK = m => ["warfarine", "fluindione", "acenocoumarol"].includes(m);
  const isHep = m => ["hbpm_cur", "hnf_sc", "hnf_ivse", "fonda_cur"].includes(m);
  const isAP = m => ["aspirine", "clopidogrel", "ticagrelor", "prasugrel", "dapt"].includes(m);
  const MOLNAME = Object.fromEntries(MOLS);

  // Dates (J0 = jour de la procédure)
  const day = (iso, n) => { if (!iso) return null; const d = new Date(iso + "T12:00:00"); if (isNaN(d)) return null; d.setDate(d.getDate() + n); return d; };
  const fdate = d => d ? d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : "";
  const J = (iso, n) => { const d = day(iso, n); const lab = n === 0 ? "J0" : (n > 0 ? `J+${n}` : `J${n}`); return d ? `${lab} (${fdate(d)})` : lab; };
  const chip = r => `<span class="risk risk--${r}">${RISK_LABEL[r]}</span>`;

  const specFields = Object.entries(PROC).map(([k, sp]) => ({
    id: "p_" + k, label: "Intervention", type: "select", full: true,
    options: sp.items.map(it => [it[0], it[1]]), showIf: v => v.spec === k
  }));

  const tool = P17.calc({
    id: "antithrombo", kind: "tool", title: "Arrêt et reprise des antithrombotiques",
    desc: "Choisir la molécule, l'intervention et l'anesthésie prévue : délai de dernière prise, contrôle biologique, relais et reprise selon les recommandations.",
    fields: [
      { id: "mol", label: "Molécule", type: "select", full: true, options: MOLS },
      { id: "spec", label: "Spécialité", type: "select", full: true, options: Object.entries(PROC).map(([k, sp]) => [k, sp.label]) },
      ...specFields,
      { id: "anesth", label: "Anesthésie prévue", type: "select", full: true, options: Object.entries(ANESTH).map(([k, a]) => [k, a[0]]) },
      { id: "dfg", label: "DFG estimé (CKD-EPI)", unit: "mL/min/1,73 m²", placeholder: "ex. 75", showIf: v => isAOD(v.mol) || isHep(v.mol) },
      { id: "date", label: "Date de l'intervention", type: "date" },
      { id: "ind", label: "Indication de l'anticoagulant", type: "select", full: true, showIf: v => isAOD(v.mol) || isAVK(v.mol) || isHep(v.mol),
        options: [["fa", "Fibrillation atriale sans antécédent d'AVC, d'AIT ni d'embolie"], ["fa_avc", "Fibrillation atriale avec antécédent d'AVC, d'AIT ou d'embolie systémique"],
          ["valve", "Valve mécanique (mitrale, ou aortique avec facteur de risque)"], ["valve_ao", "Valve aortique mécanique à double ailette, rythme sinusal, sans antécédent de thrombose"],
          ["mtev1", "EP ou TVP proximale de moins d'un mois"], ["mtev3", "EP ou TVP proximale de 1 à 3 mois"], ["mtev", "MTEV de plus de 3 mois (risque modéré)"],
          ["complexe", "Cas complexe : SAPL, HTP-TEC, déficit en antithrombine, TIH, récidive sous traitement"]] },
      { id: "avc3", label: "AVC ischémique de moins de 3 mois", type: "check", full: true, showIf: v => (isAOD(v.mol) || isAVK(v.mol)) && v.ind === "fa_avc" },
      { id: "indap", label: "Indication de l'antiagrégant", type: "select", full: true, showIf: v => isAP(v.mol),
        options: [["sec", "Prévention secondaire : coronaropathie stable, AOMI, AVC"], ["prim", "Prévention primaire"],
          ["stent", "Stent coronaire récent : < 6 mois (angioplastie programmée) ou < 12 mois (syndrome coronarien aigu)"], ["stent_anc", "Stent coronaire plus ancien"]] }
    ],
    compute(v) {
      const sp = PROC[v.spec]; if (!sp || !v.mol) return null;
      const it = sp.items.find(x => x[0] === v["p_" + v.spec]) || sp.items[0];
      const an = ANESTH[v.anesth] || ANESTH.ag;
      const acRisk = RANK[an[1]] > RANK[it[2]] ? an[1] : it[2];
      const iso = v.date;
      const before = [], after = [], alerts = [];
      let main = "", label = "", tone = "ok";

      /* ---------------- Antiagrégants ---------------- */
      if (isAP(v.mol)) {
        let apRisk = it[3];
        if ((v.anesth === "neurax" || v.anesth === "profond") && APRANK[apRisk] < 1) apRisk = "inter";
        const apLab = { faible: "Faible : réalisable sous bithérapie", inter: "Intermédiaire : réalisable sous aspirine seule", eleve: "Élevé : nécessite l'arrêt de tout antiplaquettaire" }[apRisk];
        label = "Risque hémorragique (antiagrégants)";
        const parts = v.mol === "dapt" ? ["aspirine", "clopidogrel"] : [v.mol];
        const res = parts.map(m => [m, F.arretAntiagregant(m, apRisk)]);
        if (v.mol === "dapt") {
          const asp = res[0][1];
          main = apRisk === "faible" ? "Poursuivre la bithérapie" : apRisk === "inter" ? "Poursuivre l'aspirine, arrêter l'anti-P2Y12" : "Arrêt des deux antiagrégants";
          before.push(`Aspirine : ${asp.action === "poursuite" ? "poursuivre" : "dernière prise " + J(iso, asp.jour)}`);
          if (apRisk !== "faible") before.push(`Anti-P2Y12 : dernière prise clopidogrel ou ticagrélor ${J(iso, -5)}, prasugrel ${J(iso, -7)}`);
        } else {
          const r = res[0][1];
          main = r.action === "poursuite" ? "Poursuivre" : `Dernière prise ${J(iso, r.jour)}`;
          if (r.action === "arret" && v.mol !== "aspirine" && apRisk === "inter" && v.indap !== "prim") before.push("Remplacer par de l'aspirine (75–100 mg/j) pendant l'interruption, sauf contre-indication");
          if (r.action === "arret" && v.mol === "aspirine") before.push("Interruption à limiter au strict nécessaire");
        }
        if (v.anesth === "neurax") before.push("Neuraxial : aspirine seule autorisée ; clopidogrel et ticagrélor arrêtés 5 jours, prasugrel 7 jours avant (ESAIC/ESRA 2022)");
        if (v.indap === "stent") { tone = "danger"; alerts.push("Stent récent : différer la chirurgie programmée (≥ 6 mois après angioplastie programmée, ≥ 12 mois après SCA). Si elle ne peut pas l'être : avis du cardiologue, maintien de l'aspirine, chirurgie dans un centre avec cardiologie interventionnelle."); }
        else if (apRisk !== "faible") tone = "warn";
        if (v.indap === "prim" && apRisk !== "faible") before.push("Prévention primaire : l'arrêt peut se discuter sans relais");
        after.push("Reprise dès que le risque hémorragique le permet, en général dans les 24 à 72 h, à la dose habituelle (sans dose de charge sauf avis cardiologique)");
        if (it[4]) after.push(it[4]);
        return render({ label, main, tone, it, an, apLab, before, after, alerts, refs: [REF_GIHP18, REF_ESAIC, REF_ESC] });
      }

      /* ---------------- Anticoagulants ---------------- */
      const r = F.arretAnticoagulant(v.mol, acRisk, v.dfg);
      if (!r) return null;
      label = "Risque hémorragique (anticoagulants)";
      if (v.ind === "complexe") { tone = "danger"; alerts.push("Cas complexe de MTEV : contacter le médecin référent pour une stratégie personnalisée (relais pré- et/ou post-procédural)."); }
      if (v.ind === "mtev1") { tone = "danger"; alerts.push("EP ou TVP proximale < 1 mois : différer la procédure au-delà du 1er mois (idéalement du 3e) ; sinon stratégie multidisciplinaire et discussion d'un filtre cave optionnel."); }
      if (v.avc3) { tone = "danger"; alerts.push("AVC ischémique < 3 mois : différer la procédure au-delà du 3e mois si cela ne génère pas de risque vital ou fonctionnel majeur."); }

      if (isAOD(v.mol)) {
        if (r.action === "saut") { main = "Pas de prise la veille au soir ni le matin"; before.push(`Dernière prise le matin de ${J(iso, -1)} (prise unique le matin ou deux prises par jour) ou le soir de ${J(iso, -2)} (prise unique le soir)`); after.push(`Reprise à la dose habituelle au moins 6 h après la fin du geste`); }
        else if (r.action === "avis") { main = "Avis spécialisé"; tone = "danger"; }
        else {
          main = `Dernière prise ${J(iso, r.jour)}`;
          before.push("Pas de relais par héparine avant la procédure", "Pas de dosage systématique ; dosage de la concentration (seuil < 30 ng/mL) en cas de doute ou d'insuffisance rénale avec procédure à très haut risque");
          after.push(`Reprise de l'AOD à la dose habituelle idéalement entre ${J(iso, 2)} et ${J(iso, 3)} (48 à 72 h), sans relais par héparine curative`,
            "Dans l'attente : thromboprophylaxie veineuse selon les indications habituelles (débutée entre H12 et H24, ou H6–H12 si antécédent de MTEV, IMC ≥ 40, cancer actif ou thrombophilie majeure)",
            "Si l'AOD ne peut pas être repris : héparine à dose curative (HBPM de préférence) entre H48 et H72");
        }
        if (r.action !== "saut") r.notes.forEach(n => before.push(n));
      } else if (isAVK(v.mol)) {
        if (r.action === "poursuite") { main = "Poursuivre l'AVK"; before.push(...r.notes); after.push("Reprise à l'heure et à la dose habituelles"); }
        else {
          main = `Dernière prise ${J(iso, r.jour)}`;
          before.push(`INR la veille, ${J(iso, -1)} : objectif ≤ ${String(r.cible).replace(".", ",")}`, "Si INR au-dessus du seuil : vitamine K 2 à 5 mg per os la veille et nouveau contrôle de l'INR le lendemain (1 mg est insuffisant)");
          const bridge = ["fa_avc", "valve", "valve_ao", "mtev3"].includes(v.ind);
          if (bridge) before.push(`Relais par HBPM à dose curative${v.ind.startsWith("valve") ? " en deux injections par jour" : ""} : première injection le soir de ${J(iso, -3)}, dernière au plus tard le matin de ${J(iso, -1)} ; pas de contrôle anti-Xa le jour de l'intervention${v.dfg !== null && v.dfg < 30 ? " (DFGe < 30 : HNF ou HBPM en une injection, dernière le soir de J-2)" : ""}`);
          else if (v.ind === "fa" || v.ind === "mtev") before.push("Pas de relais par héparine avant la procédure");
          if (v.ind && v.ind.startsWith("valve")) before.push("Programmer l'intervention le matin pour raccourcir l'interruption");
          after.push(`Reprise de l'AVK dans les 24 premières heures (${J(iso, 0)} au soir ou ${J(iso, 1)}), à la dose habituelle, sans dose de charge`);
          if (v.ind === "valve" || v.ind === "mtev3") after.push(`Relais par HBPM à dose curative débuté idéalement entre ${J(iso, 2)} et ${J(iso, 3)}, arrêté dès le premier INR ≥ 2`);
          else if (v.ind === "valve_ao") after.push("Valve aortique à double ailette en rythme sinusal : pas d'héparine curative si l'AVK est repris dans les 24 h");
          else after.push("Pas de relais par héparine curative ; si l'AVK ne peut pas être repris dans les 24 h : héparine curative entre H48 et H72");
          after.push("Thromboprophylaxie veineuse selon les indications habituelles en attendant l'anticoagulation efficace");
        }
      } else {
        if (r.action === "poursuite") main = "Peut être poursuivi (geste à faible risque)";
        else if (r.jour) main = `Dernière injection ${J(iso, r.jour)}`;
        else main = `Dernière injection ${r.heures} h avant la procédure`;
        before.push(...r.notes);
        after.push("Reprise à dose curative idéalement entre H48 et H72 après une procédure à risque élevé ; thromboprophylaxie en attendant");
      }
      if (v.anesth === "neurax") {
        alerts.push("Neuraxial : pas de reprise d'une anticoagulation curative avec un cathéter de péridurale en place ; reprise au moins 24 h après son retrait.");
        if (tone === "ok") tone = "warn";
      }
      if (acRisk !== "f" && tone === "ok") tone = "warn";
      if (it[4]) after.push(it[4]);
      return render({ label, main, tone, it, an, acRisk, before, after, alerts, refs: [REF_GIHP26] });
    },
    note: "<p>Outil d'aide à la décision : à confronter au protocole du service et aux particularités du patient (antiplaquettaire associé, coagulopathie, poids extrême). Classement des procédures d'après les annexes des RFE GIHP-SFAR 2026.</p>"
  });

  function render({ label, main, tone, it, an, acRisk, apLab, before, after, alerts }) {
    const risk = acRisk ? `${chip(acRisk)} <span class="out-sub" style="display:inline">${P17.esc(it[1])} · ${P17.esc(an[0])}</span>` : `<span class="out-sub" style="display:inline">${apLab}</span>`;
    return {
      tone, html: `
        <div class="out-label">${label}</div>
        <p class="out-sub" style="margin-top:4px">${risk}</p>
        <div class="out-main" style="margin-top:8px">${main}</div>
        ${alerts.length ? `<div class="callout callout--danger" style="margin-top:10px">${P17.icon("warn")}<div>${alerts.join("<br>")}</div></div>` : ""}
        ${before.length ? `<h4>Avant la procédure</h4><ul class="rx">${before.map(x => `<li>${x}</li>`).join("")}</ul>` : ""}
        ${after.length ? `<h4>Après la procédure</h4><ul class="rx">${after.map(x => `<li>${x}</li>`).join("")}</ul>` : ""}`
    };
  }

  /* ---------------- Tableaux de synthèse ---------------- */
  const procTable = Object.values(PROC).map(sp => [
    `<b>${sp.label}</b>`,
    sp.items.filter(x => x[2] === "f").map(x => x[1]).join(" ; ") || "—",
    sp.items.filter(x => x[2] === "e").map(x => x[1]).join(" ; ") || "—",
    sp.items.filter(x => x[2] === "te").map(x => x[1]).join(" ; ") || "—"
  ]);

  const ANTITHROMBO = {
    kicker: "Gestion pré-opératoire",
    title: "Antiagrégants et anticoagulants avant une chirurgie programmée",
    subtitle: "Délais d'arrêt, relais et reprise selon la molécule, l'intervention, l'anesthésie et la fonction rénale",
    tags: ["RFE GIHP-SFAR 2026", "GIHP 2018", "AOD", "AVK", "Antiplaquettaires"],
    tool, toolLabel: "Outil de décision",
    sections: [
      S("Les quatre questions à se poser", [
        { html: `<div class="steps4">${["Faut-il arrêter ? (risque hémorragique de la procédure)", "Quand arrêter ? (molécule, fonction rénale)", "Faut-il un relais ? (risque thrombotique)", "Quand reprendre ? (hémostase, risque thrombotique)"].map((t, i) => `<div class="step4"><span class="num4">${i + 1}</span><span>${t}</span></div>`).join("")}</div>` },
        info("Prescrire en clair « dernière prise le … » et « reprise le … » ; vérifier à l'admission que le plan a été suivi (INR, DFG) ; décider de la reprise ensemble, chirurgien et anesthésiste, à l'étape 3 de la check-list (HAS 2026).")
      ]),
      S("Anticoagulants : dernière administration avant une procédure à risque élevé", [
        tbl(["Anticoagulant", "Dernière administration (J0 = procédure)", "Contrôle"], [
          ["Warfarine (Coumadine®)", "J-6", "INR la veille ≤ 1,5 (≤ 1,2 si très haut risque)"],
          ["Fluindione (Préviscan®)", "J-5", "INR la veille ≤ 1,5 (≤ 1,2)"],
          ["Acénocoumarol (Sintrom®)", "J-4", "INR la veille ≤ 1,5 (≤ 1,2)"],
          ["Apixaban, rivaroxaban, edoxaban", "J-3 · <b>J-5</b> si très haut risque ou DFGe &lt; 30", "Pas de dosage systématique"],
          ["Dabigatran", "J-3 si DFGe ≥ 50 · <b>J-5</b> si 30–49 ou très haut risque", "Non recommandé si DFGe &lt; 30"],
          ["HBPM à dose curative", "24 h avant", "Adapter à la fonction rénale"],
          ["HNF sous-cutanée curative", "24 h avant", "Demi-vie de l'héparine calcique : environ 4 h"],
          ["HNF IV continue", "6 h avant", "—"],
          ["Fondaparinux curatif", "J-4", "Adapter à la fonction rénale"]
        ], "Très haut risque : neurochirurgie intracrânienne, rachis avec ouverture durale, procédures neuraxiales. Procédure à faible risque : AVK poursuivi (INR dans la semaine) ; AOD : pas de prise la veille au soir ni le matin, reprise ≥ 6 h après le geste.")
      ], { wide: true }),
      S("AOD selon la fonction rénale (procédure à risque élevé)", [
        tbl(["DFGe (CKD-EPI)", "Apixaban, rivaroxaban, edoxaban", "Dabigatran"], [
          ["≥ 50 mL/min", "Dernière prise J-3", "Dernière prise J-3"],
          ["30 à 49 mL/min", "Dernière prise J-3", "Dernière prise J-5"],
          ["15 à 29 mL/min", "Dernière prise J-5 (avis d'experts)", "Non recommandé"],
          ["&lt; 15 mL/min", "Dernière prise J-5 (hors AMM)", "Non recommandé"]
        ], "Vérifier que l'AOD est prescrit à la posologie adaptée au DFG. Pas de relais, pas de dosage systématique. Après la procédure, l'insuffisance rénale ne modifie pas la reprise des AOD.")
      ]),
      S("Antiagrégants plaquettaires", [
        tbl(["Molécule", "Si arrêt nécessaire : dernière prise", "Neuraxial et blocs profonds"], [
          ["Aspirine", "J-3 (arrêt seulement si la procédure ne peut pas être réalisée sous aspirine)", "Poursuivie"],
          ["Clopidogrel", "J-5", "Arrêt 5 jours avant"],
          ["Ticagrélor", "J-5", "Arrêt 5 jours avant"],
          ["Prasugrel", "J-7", "Arrêt 7 jours avant"]
        ]),
        tbl(["Risque hémorragique de la procédure", "Conduite"], [
          ["<span class='risk risk--f'>Faible</span> réalisable sous bithérapie", "Poursuivre les antiagrégants"],
          ["<span class='risk risk--e'>Intermédiaire</span> réalisable sous aspirine seule", "Poursuivre l'aspirine ; arrêter l'anti-P2Y12 (relais par aspirine si monothérapie en prévention secondaire)"],
          ["<span class='risk risk--te'>Élevé</span> nécessite l'arrêt de tout antiplaquettaire", "Arrêter tous les antiagrégants (neurochirurgie intracrânienne, ampullectomie…)"]
        ]),
        warn("Stent coronaire récent : différer la chirurgie programmée au moins 6 mois après une angioplastie programmée et 12 mois après un syndrome coronarien aigu (ESC 2022). Sinon, décision avec le cardiologue, maintien de l'aspirine.")
      ], { wide: true }),
      S("Indications des relais par héparine (AVK)", [
        tbl(["Situation", "Avant la procédure", "Après la procédure"], [
          ["FA sans antécédent d'AVC, d'AIT ni d'embolie", "Pas de relais", "AVK dans les 24 h, sans héparine curative"],
          ["FA avec antécédent d'AVC, d'AIT ou d'embolie", "HBPM curative : soir de J-3 → matin de J-1", "AVK dans les 24 h, sans héparine curative"],
          ["Valve mécanique", "HBPM curative en 2 injections : soir de J-3 → matin de J-1", "HBPM curative à H48–H72 jusqu'à INR ≥ 2 (sauf valve aortique double ailette en rythme sinusal)"],
          ["EP ou TVP proximale de 1 à 3 mois", "HBPM curative : soir de J-3 → matin de J-1", "HBPM curative à H48–H72 jusqu'à INR ≥ 2"],
          ["MTEV de plus de 3 mois", "Pas de relais", "AVK dans les 24 h"],
          ["EP ou TVP < 1 mois, cas complexe", "Stratégie multidisciplinaire ; différer ; discuter un filtre cave", "Stratégie personnalisée"]
        ], "AOD : jamais de relais par héparine, quelle que soit l'indication. Patient ≥ 100 kg : HBPM curative sans surveillance (ex. énoxaparine 10 000 UI × 2/j)."),
        ult("Reprise après une procédure à risque élevé",
          "AVK : dans les 24 premières heures, dose habituelle, sans dose de charge",
          "AOD : idéalement entre 48 et 72 h, dose habituelle, sans relais",
          "Thromboprophylaxie veineuse en attendant : H12–H24 (H6–H12 si antécédent de MTEV, IMC ≥ 40, cancer actif, thrombophilie majeure)",
          "Compression pneumatique intermittente si risque thromboembolique veineux élevé ; pas de bas de contention",
          "Neurochirurgie intracrânienne : reprise vers J10 ; rachis : entre J3 et J7 ; péridurale : au moins 24 h après le retrait du cathéter")
      ], { wide: true }),
      S("Classement des interventions de nos spécialités", [
        tbl(["Spécialité", "Risque faible", "Risque élevé", "Risque très élevé"], procTable,
          "D'après les annexes des RFE GIHP-SFAR 2026 (sociétés savantes de chaque spécialité). Chirurgie viscérale et chirurgie thoracique : aucune intervention à faible risque. Ce classement peut être adapté localement.")
      ], { wide: true })
    ],
    refs: [REF_GIHP26, REF_GIHP18, REF_HAS26, REF_ESAIC, REF_ESC]
  };

  /* ------------------------------------------------------------------
     Consultation d'anesthésie
     ------------------------------------------------------------------ */
  const CHECK = [
    ["id", "Identité, intervention prévue, date, chirurgien, mode d'hospitalisation (ambulatoire ou conventionnel)"],
    ["atcd", "Antécédents médicaux, chirurgicaux et anesthésiques (incidents, NVPO, intubation difficile)"],
    ["allergie", "Allergies (curares, latex, antibiotiques, chlorhexidine, iode) et hyperthermie maligne familiale"],
    ["ttt", "Traitements en cours avec posologies, dont antithrombotiques et automédication"],
    ["fonction", "Capacité fonctionnelle (≥ 4 MET : monter 2 étages sans s'arrêter), dyspnée, angor"],
    ["habitus", "Tabac, alcool, autres toxiques ; SAOS (STOP-Bang) ; fragilité chez le sujet âgé"],
    ["examen", "Examen clinique : poids, taille, IMC, PA, FC, SpO₂, auscultation, état veineux, rachis si ALR"],
    ["va", "Voies aériennes : Mallampati, ouverture de bouche, distance thyromentonnière, mobilité cervicale, dentition, critères de ventilation au masque difficile"],
    ["scores", "Scores : ASA, Lee (RCRI), Apfel, risque hémorragique et thromboembolique"],
    ["examens", "Examens complémentaires prescrits selon le terrain et la chirurgie (non systématiques)"],
    ["plan", "Technique proposée (AG, ALR, sédation), stratégie d'analgésie, transfusion prévue ou non"],
    ["consignes", "Consignes : jeûne, traitements à poursuivre ou arrêter (dates), douche, ambulatoire (accompagnant)"],
    ["info", "Information du patient sur les bénéfices et risques, document remis, consentement tracé"],
    ["trace", "Compte rendu dans le dossier ; visite préanesthésique prévue dans les heures précédant l'intervention"]
  ];
  const checkTool = P17.calc({
    id: "cpa", kind: "tool", title: "Check-list de la consultation",
    desc: "Cocher les éléments renseignés : la liste des éléments manquants s'affiche à droite.",
    fields: [{ id: "c", label: "Éléments de la consultation", type: "checks", options: CHECK, full: true }],
    compute(v) {
      const done = v.c || [];
      const miss = CHECK.filter(([k]) => !done.includes(k));
      const n = CHECK.length - miss.length;
      return {
        label: "Consultation", main: `${n} / ${CHECK.length} éléments`, tone: miss.length ? (n >= CHECK.length - 3 ? "warn" : "danger") : "ok",
        html: miss.length ? `<h4 style="margin-top:10px">À compléter</h4><ul class="rx">${miss.map(([, t]) => `<li>${t}</li>`).join("")}</ul>` : `<p class="out-sub">Consultation complète.</p>`
      };
    }
  });

  const CONSULT = {
    kicker: "Gestion pré-opératoire",
    title: "Consultation d'anesthésie",
    subtitle: "Éléments obligatoires, évaluation du risque, examens complémentaires, optimisation et information du patient",
    tags: ["Décret du 5 décembre 1994", "ASA", "Voies aériennes", "Jeûne", "Information"],
    tool: checkTool, toolLabel: "Check-list",
    sections: [
      S("Cadre réglementaire", [
        ul("Consultation obligatoire avant toute intervention programmée, réalisée par un médecin anesthésiste-réanimateur <b>plusieurs jours avant</b> l'intervention",
          "<b>Visite préanesthésique</b> dans les heures précédant l'intervention : vérification des données, des résultats, des consignes, et du consentement",
          "Compte rendu écrit intégré au dossier du patient, accessible à l'équipe le jour de l'intervention",
          "Information claire sur l'anesthésie, ses alternatives et ses risques ; le patient peut poser ses questions et refuser")
      ]),
      S("Interrogatoire", [
        kv(["Antécédents", "Cardiovasculaires, respiratoires (asthme, BPCO, SAOS), neurologiques, rénaux, hépatiques, endocriniens (diabète, thyroïde), hématologiques (saignement, thrombose)"],
          ["Anesthésies antérieures", "Intubation ou ventilation difficile, NVPO, réveil prolongé, réaction allergique, hyperthermie maligne personnelle ou familiale"],
          ["Allergies", "Curares, latex, antibiotiques, chlorhexidine, produits iodés ; préciser le type de réaction et les bilans réalisés"],
          ["Traitements", "Liste complète avec posologies, antithrombotiques, antidiabétiques, automédication et phytothérapie"],
          ["Capacité fonctionnelle", "≥ 4 MET (monter deux étages, marcher vite, jardiner) : risque cardiaque faible ; < 4 MET ou inconnue : évaluation complémentaire selon la chirurgie"],
          ["Habitudes", "Tabac (paquets-années), alcool, cannabis et autres toxiques"],
          ["Terrain", "Grossesse possible, fragilité (Clinical Frailty Scale), troubles cognitifs, dénutrition (perte de poids, IMC, albumine)"])
      ]),
      S("Examen clinique et voies aériennes", [
        ult("Examen général", "Poids, taille, IMC ; PA, FC, SpO₂ en air ambiant", "Auscultation cardiaque (souffle) et pulmonaire ; signes d'insuffisance cardiaque", "Capital veineux ; examen du rachis et du site de ponction si ALR"),
        tbl(["Critère", "Prédictif de difficulté"], [
          ["Mallampati", "Classe III ou IV"],
          ["Ouverture de bouche", "< 35 mm"],
          ["Distance thyromentonnière", "< 65 mm"],
          ["Mobilité cervicale", "Extension limitée (< 35°), rachis cervical raide"],
          ["Mandibule", "Rétrognathie, test de morsure de la lèvre supérieure impossible"],
          ["Ventilation au masque difficile", "Barbe, IMC > 30, âge > 55 ans, ronflement ou SAOS, édentation"],
          ["Autres", "Tumeur ou irradiation cervicale, sténose trachéale, macroglossie, grossesse"]
        ], "En cas de critères : prévoir le plan de prise en charge des voies aériennes (vidéolaryngoscope, intubation vigile sous fibroscopie) selon les RFE SFAR sur l'intubation difficile."),
      ], { wide: true }),
      S("Évaluation du risque", [
        tbl(["Score", "Utilisation"], [
          ["ASA (I à VI)", "État physique global ; corrélé à la morbidité postopératoire"],
          ["Lee (RCRI)", "Risque cardiaque : chirurgie à haut risque, coronaropathie, insuffisance cardiaque, AVC, diabète insulinotraité, créatinine > 177 µmol/L"],
          ["STOP-Bang", "SAOS : ≥ 3 risque intermédiaire, ≥ 5 risque élevé"],
          ["Apfel", "Risque de NVPO : prophylaxie adaptée (voir SSPI)"],
          ["Caprini ou équivalent", "Risque thromboembolique veineux : thromboprophylaxie postopératoire"],
          ["Questionnaire hémorragique", "Saignements personnels ou familiaux anormaux : bilan d'hémostase ciblé"]
        ]),
        info("Avant une chirurgie à risque intermédiaire ou élevé, chez les patients de plus de 65 ans ou avec facteurs de risque cardiovasculaire : ECG, et dosage du BNP ou NT-proBNP et de la troponine de référence (ESC 2022).")
      ]),
      S("Examens complémentaires", [
        { html: "<p>Aucun examen n'est systématique : ils sont prescrits selon l'interrogatoire, l'examen clinique, le terrain et la chirurgie.</p>" },
        tbl(["Examen", "Indications principales"], [
          ["Hémogramme", "Chirurgie à risque hémorragique, anémie suspectée, insuffisance rénale, cancer"],
          ["Hémostase (TP, TCA)", "Anamnèse hémorragique positive, hépatopathie, anticoagulant, ALR médullaire selon le contexte"],
          ["Groupe sanguin, RAI", "Chirurgie à risque transfusionnel ; validité des RAI selon le règlement local"],
          ["Créatinine, ionogramme", "Insuffisance rénale, diabète, diurétiques, IEC ou ARA2, chirurgie majeure, AOD"],
          ["Glycémie, HbA1c", "Diabète connu ou suspecté"],
          ["ECG", "Facteurs de risque cardiovasculaire, symptômes, chirurgie à risque intermédiaire ou élevé"],
          ["Échocardiographie", "Souffle, insuffisance cardiaque, dyspnée inexpliquée, avant chirurgie à haut risque"],
          ["EFR, gazométrie", "Chirurgie thoracique (VEMS, DLCO), insuffisance respiratoire"],
          ["Test de grossesse", "Femme en âge de procréer, selon le contexte"]
        ])
      ], { wide: true }),
      S("Optimisation préopératoire", [
        ul("<b>Anémie</b> (Hb < 13 g/dL) : bilan martial ; fer IV si carence, idéalement 3 à 4 semaines avant",
          "<b>Tabac</b> : arrêt idéalement 6 à 8 semaines avant ; bénéfique quel que soit le délai",
          "<b>Alcool</b> : arrêt 4 semaines avant si consommation excessive ; prévention du sevrage",
          "<b>Diabète</b> : HbA1c élevée (> 8–9 %) : discuter le report d'une chirurgie programmée",
          "<b>HTA</b> : PA ≥ 180/110 mmHg : discuter le report pour équilibration",
          "<b>Dénutrition</b> : renutrition orale 7 à 14 jours avant une chirurgie majeure",
          "<b>Préhabilitation</b> : activité physique, kinésithérapie respiratoire (chirurgie thoracique et abdominale majeure)")
      ]),
      S("Consignes au patient", [
        kv(["Jeûne", "Solides : 6 heures ; liquides clairs (eau, thé, café sans lait, jus sans pulpe) : jusqu'à 2 heures avant l'induction"],
          ["Traitements", "Liste écrite des traitements à prendre le matin et à arrêter, avec les dates (voir fiche dédiée)"],
          ["Hygiène", "Douche préopératoire selon le protocole du service ; retrait des bijoux, piercings, vernis"],
          ["Ambulatoire", "Accompagnant pour le retour, ne pas conduire, ne pas rester seul la première nuit"],
          ["Douleur", "Explication de la stratégie d'analgésie et de l'évaluation de la douleur"]),
        info("Les agonistes du GLP-1 ralentissent la vidange gastrique : interroger sur la phase d'escalade et les symptômes digestifs ; échographie gastrique et/ou séquence rapide en cas de doute.")
      ]),
      S("Information et traçabilité", [
        ul("Information orale et document écrit : techniques proposées (AG, ALR, sédation), alternatives, risques fréquents et graves",
          "Information sur la transfusion si elle est possible, et traçabilité",
          "Consentement éclairé tracé dans le dossier ; refus éventuel respecté et tracé",
          "Compte rendu complet : terrain, scores, plan d'anesthésie et d'analgésie, examens, consignes, traitements",
          "Visite préanesthésique le jour de l'intervention : modifications intercurrentes, résultats, jeûne, prise des traitements")
      ])
    ],
    refs: ["Décret n° 94-1050 du 5 décembre 1994 relatif aux conditions techniques de fonctionnement des établissements de santé en ce qui concerne la pratique de l'anesthésie",
      "SFAR 2012 : Examens préinterventionnels systématiques",
      REF_ESC,
      "Joshi GP et al. 2023 American Society of Anesthesiologists practice guidance on preoperative management of patients on GLP-1 receptor agonists",
      "ESAIC 2022 : Pre-operative fasting in adults and children (Joshi/Smith et al.)",
      "SFAR 2017 : Intubation difficile et extubation en anesthésie chez l'adulte (RFE)"]
  };

  /* ------------------------------------------------------------------
     Traitements chroniques
     ------------------------------------------------------------------ */
  const TTT = [
    ["Bêtabloquants", "Poursuivre", "Ne pas les introduire juste avant une chirurgie ; ne jamais les arrêter brutalement (rebond)"],
    ["IEC et ARA2", "Arrêt 24 h avant (pas de prise le matin)", "Hypotension à l'induction ; à poursuivre en cas d'insuffisance cardiaque à fraction d'éjection réduite selon le contexte"],
    ["Diurétiques", "Pas de prise le matin", "Sauf insuffisance cardiaque décompensée ; contrôle de la kaliémie"],
    ["Inhibiteurs calciques, dérivés nitrés, amiodarone, statines", "Poursuivre", "Statines : reprise précoce"],
    ["Antiagrégants, anticoagulants", "Voir l'outil dédié", "RFE GIHP-SFAR 2026 et GIHP 2018"],
    ["Metformine", "Pas de prise le jour de l'intervention", "Reprise dès l'alimentation et une fonction rénale stable ; 48 h après injection de produit de contraste"],
    ["Inhibiteurs de SGLT2 (gliflozines)", "Dernière prise 3 jours avant", "Risque d'acidocétose euglycémique ; reprise à l'alimentation normale"],
    ["Agonistes du GLP-1", "Évaluer au cas par cas", "Vidange gastrique ralentie : estomac plein en cas de symptômes ou d'escalade de dose ; échographie gastrique"],
    ["Sulfamides, glinides", "Pas de prise le matin", "Risque d'hypoglycémie à jeun"],
    ["Insulines", "Poursuivre l'insuline basale (dose adaptée)", "Arrêt de l'insuline rapide à jeun ; protocole glycémie (voir SSPI)"],
    ["Corticothérapie au long cours", "Poursuivre", "≥ 5 mg/j de prednisone plus de 4 semaines : supplémentation par hydrocortisone (ex. 100 mg à l'induction puis 200 mg/24 h en chirurgie majeure)"],
    ["Lévothyroxine, antithyroïdiens", "Poursuivre", "—"],
    ["Antiépileptiques, antiparkinsoniens (L-dopa)", "Poursuivre, prise du matin", "Éviter métoclopramide, dropéridol et halopéridol chez le parkinsonien"],
    ["Antidépresseurs (ISRS, IRSN, tricycliques)", "Poursuivre", "Risque de syndrome sérotoninergique (tramadol, néfopam à prudence) ; ISRS : saignement modérément majoré"],
    ["IMAO", "Avis spécialisé", "Interactions graves : éviter éphédrine et péthidine ; IMAO sélectifs récents moins à risque"],
    ["Lithium", "Arrêt 24 à 72 h avant une chirurgie majeure", "Surveillance de la lithémie et de la natrémie ; reprise dès l'alimentation"],
    ["Benzodiazépines, antipsychotiques", "Poursuivre", "Risque de sevrage ; allongement du QT"],
    ["Opioïdes au long cours, buprénorphine, méthadone", "Poursuivre", "Analgésie multimodale renforcée, kétamine ; ne pas sevrer en périopératoire"],
    ["Œstroprogestatifs, traitement hormonal de la ménopause", "Discuter l'arrêt 4 à 6 semaines avant une chirurgie à haut risque thromboembolique", "Sinon thromboprophylaxie renforcée"],
    ["Méthotrexate, immunosuppresseurs", "Poursuivre le plus souvent", "Avis du prescripteur ; biothérapies : programmer la chirurgie en fin d'intervalle entre deux injections"],
    ["Phytothérapie (ginkgo, ail, millepertuis)", "Arrêt 7 jours avant", "Risque hémorragique, interactions enzymatiques"]
  ];
  const tttTool = P17.calc({
    id: "ttt", kind: "tool", title: "Que faire de ce traitement ?",
    fields: [{ id: "c", label: "Classe thérapeutique", type: "select", full: true, options: TTT.map((t, i) => [String(i), t[0]]) }],
    compute(v) {
      const t = TTT[+v.c]; if (!t) return null;
      return { label: t[0], main: t[1], sub: t[2], tone: /Arr|Pas de prise|Dernière/.test(t[1]) ? "warn" : /Avis|cas par cas|Voir/.test(t[1]) ? "danger" : "ok" };
    }
  });
  const TRAIT = {
    kicker: "Gestion pré-opératoire",
    title: "Gestion des traitements chroniques en périopératoire",
    subtitle: "Traitements à poursuivre, à suspendre et à reprendre, avec les points de vigilance",
    tags: ["Cardiovasculaire", "Antidiabétiques", "Psychotropes", "Corticoïdes"],
    tool: tttTool, toolLabel: "Outil",
    sections: [
      S("Principes", [ul("Par défaut, <b>poursuivre</b> les traitements chroniques, y compris le matin de l'intervention avec une gorgée d'eau",
        "Arrêter seulement si le risque de la poursuite dépasse celui de l'arrêt (hypotension, hypoglycémie, saignement, acidocétose)",
        "Prescription écrite avec les dates d'arrêt et de reprise, remise au patient et transmise au service",
        "Reprise dès que possible, en vérifiant la voie d'administration (jeûne, iléus) et la fonction rénale")]),
      S("Tableau par classe thérapeutique", [tbl(["Classe", "Conduite", "Remarques"], TTT)], { wide: true })
    ],
    refs: [REF_ESC, "SFAR-SFD 2025 : prise en charge du patient diabétique en périopératoire", "Woodcock T et al. Guidelines for the management of glucocorticoids during the peri-operative period. Anaesthesia 2020", "Multisociety clinical practice guidance on GLP-1 receptor agonists and elective procedures (ASA, AGA, ASMBS, ISPCOP, SAGES), 2024", REF_GIHP26]
  };

  /* ------------------------------------------------------------------
     Visite préanesthésique (VPA)
     ------------------------------------------------------------------ */
  const VPA_CHECK = [
    ["identite", "Identité vérifiée (bracelet), intervention, côté et site confirmés avec le patient"],
    ["cpa", "Consultation d'anesthésie présente et lue ; consentement et information tracés"],
    ["changement", "Pas d'événement nouveau depuis la consultation (infection, fièvre, douleur thoracique, chute, nouveau traitement)"],
    ["jeune", "Jeûne vérifié : heure du dernier repas (≥ 6 h) et des derniers liquides clairs (≥ 2 h)"],
    ["ttt", "Traitements pris ou arrêtés selon les consignes (prise du matin, antidiabétiques, IEC)"],
    ["at", "Antithrombotiques : date de dernière prise conforme, INR de la veille ou relais vérifiés"],
    ["bio", "Résultats des examens prescrits vus (Hb, kaliémie, créatinine, glycémie, hémostase, ECG)"],
    ["groupe", "Groupe sanguin et RAI valides si risque transfusionnel ; produits sanguins disponibles si prévu"],
    ["constantes", "Constantes : PA, FC, SpO₂, température, glycémie capillaire chez le diabétique"],
    ["va", "Voies aériennes réévaluées ; matériel d'intubation difficile prévu si besoin"],
    ["allergie", "Allergies rappelées et signalées dans le dossier et sur le bracelet"],
    ["prep", "Prothèses dentaires et auditives, bijoux, lentilles retirés ; préparation cutanée faite"],
    ["plan", "Plan d'anesthésie et d'analgésie confirmé (ALR, cathéter), antibioprophylaxie prévue"],
    ["lit", "Orientation postopératoire prévue (SSPI, soins continus, réanimation) ; lit disponible si nécessaire"],
    ["premed", "Prémédication éventuelle prescrite et administrée"]
  ];
  const vpaTool = P17.calc({
    id: "vpa", kind: "tool", title: "Check-list de la visite préanesthésique",
    desc: "Cocher les éléments vérifiés ; les éléments manquants s'affichent à droite.",
    fields: [{ id: "c", label: "Éléments vérifiés", type: "checks", options: VPA_CHECK, full: true },
      { id: "report", label: "Motif de report présent (voir liste ci-dessous)", type: "check", full: true }],
    compute(v) {
      const done = v.c || [];
      const miss = VPA_CHECK.filter(([k]) => !done.includes(k));
      if (v.report) return { label: "Visite préanesthésique", main: "Discuter le report", tone: "danger", html: `<p class="out-sub">Prévenir le chirurgien et tracer la décision dans le dossier.</p>` };
      const n = VPA_CHECK.length - miss.length;
      return {
        label: "Visite préanesthésique", main: miss.length ? `${n} / ${VPA_CHECK.length} vérifiés` : "Patient prêt pour le bloc", tone: miss.length ? "warn" : "ok",
        html: miss.length ? `<h4 style="margin-top:10px">Reste à vérifier</h4><ul class="rx">${miss.map(([, t]) => `<li>${t}</li>`).join("")}</ul>` : `<p class="out-sub">Poursuivre avec la check-list « Sécurité du patient au bloc opératoire ».</p>`
      };
    }
  });
  const VPA = {
    kicker: "Gestion pré-opératoire",
    title: "Visite préanesthésique (VPA)",
    subtitle: "Principes, éléments à vérifier dans les heures qui précèdent l'intervention et motifs de report",
    tags: ["Décret du 5 décembre 1994", "Jeûne", "Antithrombotiques", "Check-list"],
    tool: vpaTool, toolLabel: "Check-list",
    sections: [
      S("Principes", [ul("Obligatoire avant toute anesthésie programmée, <b>dans les heures précédant l'intervention</b> (le plus souvent la veille au soir ou le matin)",
        "Réalisée par un médecin anesthésiste-réanimateur, pas forcément celui de la consultation ni celui qui fera l'anesthésie",
        "Objectifs : vérifier que les conclusions de la consultation restent valables, que les consignes ont été suivies et que les résultats sont disponibles ; dépister un événement nouveau",
        "Tracée dans le dossier : date, heure, nom du médecin, éléments vérifiés et décision"),
        info("La visite ne remplace pas la consultation : en cas d'élément nouveau important, le patient est réévalué et l'intervention peut être reportée.")]),
      S("Éléments à vérifier", [tbl(["Domaine", "À vérifier"], [
        ["Identité et intervention", "Identité, intervention, côté et site ; consentement chirurgical et anesthésique"],
        ["État clinique", "Événement nouveau : infection respiratoire, fièvre, douleur thoracique, dyspnée, déshydratation ; constantes (PA, FC, SpO₂, température)"],
        ["Jeûne", "Solides ≥ 6 h ; liquides clairs autorisés jusqu'à 2 h ; nausées, vomissements, occlusion (estomac plein)"],
        ["Traitements", "Prise du matin faite (bêtabloquant, antiépileptique…), arrêts respectés (IEC, metformine, gliflozines, sulfamides)"],
        ["Antithrombotiques", "Date de dernière prise conforme au plan ; INR de la veille (AVK) ; relais par HBPM : dernière injection au plus tard le matin de J-1"],
        ["Biologie et examens", "Hb, plaquettes, hémostase, ionogramme (kaliémie), créatinine, glycémie ; ECG et examens demandés à la consultation"],
        ["Transfusion", "Groupe sanguin et RAI valides ; réservation de produits sanguins ou récupération peropératoire si prévue"],
        ["Diabète", "Glycémie capillaire, insuline basale adaptée, absence de cétose (gliflozine)"],
        ["Voies aériennes", "Réévaluation ; matériel adapté (vidéolaryngoscope, fibroscope) si critères"],
        ["Organisation", "Plan d'anesthésie, d'ALR et d'analgésie ; antibioprophylaxie ; lit de soins continus ou de réanimation si prévu"]
      ])], { wide: true }),
      S("Motifs de report à discuter", [tbl(["Situation", "Repère"], [
        ["Infection respiratoire aiguë fébrile", "Report de 2 à 4 semaines pour une chirurgie programmée"],
        ["HTA non contrôlée", "PA ≥ 180/110 mmHg persistante"],
        ["Déséquilibre glycémique", "Hyperglycémie majeure avec cétose ou acidose ; hypoglycémie"],
        ["Dyskaliémie", "Kaliémie < 3 ou > 6 mmol/L"],
        ["Antithrombotique non interrompu", "INR > 1,5 (> 1,2 si neurochirurgie ou neuraxial) ; AOD pris la veille pour une procédure à risque élevé"],
        ["Jeûne non respecté", "Solides < 6 h : différer, ou séquence rapide si l'intervention ne peut pas attendre"],
        ["Événement cardiovasculaire récent", "Syndrome coronarien, insuffisance cardiaque décompensée, trouble du rythme mal toléré"],
        ["Consentement absent", "Patient non informé, refus, incapacité sans représentant"]
      ], "Tout report est décidé avec le chirurgien et tracé dans le dossier.")], { wide: true }),
      S("Après la visite", [ul("Prescriptions de la veille et du matin (prémédication, traitements, douche)", "Transmission à l'équipe du bloc ; inscription au programme confirmée",
        "Check-list HAS « Sécurité du patient au bloc opératoire » à l'arrivée en salle")])
    ],
    refs: ["Décret n° 94-1050 du 5 décembre 1994 relatif à la pratique de l'anesthésie (consultation et visite préanesthésiques)",
      "SFAR : Recommandations concernant la période préanesthésique",
      "HAS : Check-list « Sécurité du patient au bloc opératoire » (version en vigueur)",
      "ESAIC 2022 : Pre-operative fasting in adults and children", REF_GIHP26]
  };

  /* ---------------- Routes ---------------- */
  const page = (path, crumb, fiche) => `
    <div class="page accent-anesthesie">
      <div class="page-head">
        ${P17.backLink(ROOT, SEC)}
        ${P17.crumbs([...base, [crumb, path]])}
      </div>
      ${P17.fiche({ accent: "anesthesie", ...fiche })}
    </div>`;

  P17.preop = [
    { href: `${ROOT}/consultation`, title: "Consultation d'anesthésie", desc: "Éléments obligatoires, voies aériennes, examens, information", icon: "fiche", accent: "anesthesie" },
    { href: `${ROOT}/vpa`, title: "Visite préanesthésique", desc: "Éléments à vérifier avant le bloc, motifs de report", icon: "fiche", accent: "anesthesie" },
    { href: `${ROOT}/traitements`, title: "Traitements chroniques", desc: "À poursuivre, suspendre, reprendre", icon: "fiche", accent: "anesthesie" },
    { href: `${ROOT}/antithrombotiques`, title: "Antiagrégants et anticoagulants", desc: "Outil : arrêt, relais, reprise (GIHP-SFAR 2026)", icon: "tool", accent: "anesthesie" }
  ];
  P17.postop = [
    { href: "#/analgesie", title: "Analgésie postopératoire", desc: "Stratégie sans opioïdes, titration morphinique", icon: "analgesie", accent: "analgesie" },
    { href: "#/blocs", title: "Blocs analgésiques", desc: "Quel bloc pour quelle intervention, fiches échoguidées", icon: "analgesie", accent: "analgesie" },
    { href: "#/sspi/extubation", title: "Extubation en SSPI", desc: "Critères, décurarisation, extubation à risque", icon: "sspi", accent: "sspi" },
    { href: "#/sspi/saignement", title: "Saignement en SSPI", desc: "Arbre décisionnel, transfusion, antagonisation", icon: "sspi", accent: "reanimation" },
    { href: "#/sspi/sortie", title: "Check-list de sortie de SSPI", desc: "Aldrete, NVPO, glycémie, transmissions", icon: "sspi", accent: "sspi" }
  ];

  P17.route(ROOT, {
    title: SEC,
    render: () => P17.page({ crumbs: base, title: SEC, accent: "anesthesie", icon: "fiche", back: "#/",
      subtitle: "Avant toute intervention : consultation d'anesthésie, visite préanesthésique, traitements chroniques et antithrombotiques.",
      body: P17.tiles(P17.preop) })
  });
  P17.route("#/postop", {
    title: "Post-opératoire",
    render: () => P17.page({ crumbs: [["Post-opératoire", "#/postop"]], title: "Post-opératoire", accent: "sspi", icon: "sspi", back: "#/",
      subtitle: "De la fin de l'intervention à la sortie de SSPI : analgésie, blocs, extubation, saignement et check-list de sortie.",
      body: P17.tiles(P17.postop) })
  });
  P17.index("#/postop", "Post-opératoire", "SSPI salle de réveil analgésie blocs extubation saignement sortie", "Post-opératoire");
  P17.route(`${ROOT}/consultation`, { title: "Consultation d'anesthésie", render: () => page(`${ROOT}/consultation`, "Consultation d'anesthésie", CONSULT) });
  P17.route(`${ROOT}/vpa`, { title: "Visite préanesthésique", render: () => page(`${ROOT}/vpa`, "Visite préanesthésique", VPA) });
  P17.route(`${ROOT}/traitements`, { title: "Traitements chroniques", render: () => page(`${ROOT}/traitements`, "Traitements chroniques", TRAIT) });
  P17.route(`${ROOT}/antithrombotiques`, { title: "Antiagrégants et anticoagulants", render: () => page(`${ROOT}/antithrombotiques`, "Antiagrégants et anticoagulants", ANTITHROMBO) });

  P17.index(ROOT, SEC, "préopératoire consultation visite traitements antithrombotiques", "Anesthésie");
  P17.index(`${ROOT}/vpa`, "Visite préanesthésique (VPA)", "VPA veille jeûne report check-list bloc", "Anesthésie");
  P17.index(`${ROOT}/consultation`, "Consultation d'anesthésie", "CPA préanesthésique ASA Mallampati intubation difficile jeûne examens complémentaires information consentement", "Anesthésie");
  P17.index(`${ROOT}/traitements`, "Gestion des traitements chroniques", "arrêt médicaments IEC ARA2 metformine gliflozine GLP-1 corticoïdes lithium IMAO", "Anesthésie");
  P17.index(`${ROOT}/antithrombotiques`, "Antiagrégants et anticoagulants : arrêt et reprise", "AOD apixaban rivaroxaban edoxaban dabigatran AVK warfarine fluindione Préviscan héparine relais aspirine clopidogrel ticagrélor prasugrel GIHP 2026", "Anesthésie");
})();
