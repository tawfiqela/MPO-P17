/* =====================================================================
   Antibiothérapie — Service de Réanimation Chirurgicale P17
   Outils d'antibiothérapie probabiliste, fiches BMR, durées,
   adaptation rénale, modalités d'administration.
   ===================================================================== */
(function () {
  const { S, ul, ol, kv, warn, danger, info, ok, tbl } = P17.h;
  const SEC = "Antibiothérapie";
  const ROOT = "#/antibiotherapie";
  const base = [[SEC, ROOT]];
  const CFG = P17.cfg;

  /* ---------- Rendu des propositions ---------- */
  const li = t => `<li>${t}</li>`;
  const OU = `<li class="rx-or">ou</li>`;
  function out(blocks) {
    // blocks : [[titre, [lignes]], ...] ; une ligne "|" = séparateur « ou »
    return blocks.filter(b => b && b[1] && b[1].length).map(([t, lines]) =>
      `<h4>${t}</h4><ul class="rx">${lines.map(l => l === "|" ? OU : li(l)).join("")}</ul>`).join("");
  }
  const VERIF = `<p class="out-sub" style="margin-top:10px">Adapter à l'écologie locale, aux colonisations connues, à la fonction rénale (voir Adaptation rénale) et réévaluer à 48–72 h avec les prélèvements.</p>`;
  const AMK = "<strong>Amikacine</strong> 25–30 mg/kg IVL sur 30 min (1 à 3 injections)";
  const GENTA = "<strong>Gentamicine</strong> 5–8 mg/kg IVL sur 30 min (1 à 3 injections)";
  const VANCO = "<strong>Vancomycine</strong> charge 25–30 mg/kg puis 30 mg/kg/24 h IVSE (plateau 20–25 mg/L)";
  const LINE = "<strong>Linézolide</strong> 600 mg ×2/j IV";
  const PTZ = "<strong>Pipéracilline-tazobactam</strong> charge 4 g puis 4 g toutes les 6 h en perfusion de 4 h (ou 16 g/24 h IVSE)";
  const CEFEP = "<strong>Céfépime</strong> charge 2 g puis 2 g toutes les 8 h (ou 6 g/24 h IVSE)";
  const MERO = "<strong>Méropénème</strong> charge 2 g puis 1–2 g toutes les 8 h en perfusion de 3 h";
  const IMI = "<strong>Imipénème</strong> 1 g toutes les 6–8 h";
  const CTX = "<strong>Céfotaxime</strong> 1–2 g toutes les 8 h (ou <strong>ceftriaxone</strong> 1–2 g/24 h)";
  const METRO = "<strong>Métronidazole</strong> 500 mg ×3/j IV ou per os";
  const CASPO = "<strong>Caspofungine</strong> 70 mg J1 puis 50 mg/j (70 mg/j si > 80 kg)";
  const AZT = "<strong>Aztréonam</strong> charge 2 g puis 2 g toutes les 8 h (ou 6–8 g/24 h IVSE)";
  const CIPRO = "<strong>Ciprofloxacine</strong> 400 mg ×3/j IV (ou 750 mg ×2/j per os)";

  /* ---------- Page fiche ATB (en-tête P17) ---------- */
  function atbPage({ path, crumb, kicker, title, subtitle, tags, tool, sections = [], refs = [], parent = ROOT, parentLabel = SEC }) {
    const crumbs = parent === ROOT ? [...base, [crumb || title, path]] : [...base, [parentLabel, parent], [crumb || title, path]];
    return `
      <div class="page accent-antibiotherapie">
        <div class="page-head">
          ${P17.backLink(parent, parentLabel)}
          ${P17.crumbs(crumbs)}
        </div>
        ${P17.fiche({
          kicker: kicker || "Antibiothérapie", title, subtitle, tags: tags || [], tool, sections, refs,
          accent: "antibiotherapie", toolLabel: "Outil de décision",
          meta: `${P17.esc(CFG.serviceLong)} · révision ${P17.esc(CFG.revision)} · À valider par le référent en antibiothérapie du service et à confronter à l'écologie locale`
        })}
      </div>`;
  }


  /* =================== OUTILS PROBABILISTES =================== */
  const T = {};

  /* ---------- Pneumonies ---------- */
  T.pneumonies = {
    title: "Pneumonies", desc: "Communautaires graves, acquises à l'hôpital, sous ventilation mécanique",
    tool: P17.calc({
      id: "atbPneu", title: "Antibiothérapie probabiliste des pneumonies", kind: "tool",
      fields: [
        { id: "ctx", label: "Contexte", type: "seg", options: [["pac", "Communautaire"], ["pah", "Acquise à l'hôpital (non ventilée)"], ["pavm", "Sous ventilation mécanique"]] },
        { id: "tard", label: "Survenue ≥ 5 jours après l'admission", type: "check", showIf: v => v.ctx !== "pac" },
        { id: "fdr", label: "Facteurs de risque", type: "checks", options: [["pyo", "Risque de P. aeruginosa*"], ["blse", "Colonisation ou infection connue à E-BLSE"], ["sarm", "Risque de SARM**"], ["inhal", "Inhalation"], ["necro", "Pneumonie nécrosante ou suspicion de toxine de Panton-Valentine"], ["grippe", "Grippe associée"]] },
        { id: "choc", label: "Choc septique", type: "check" },
        { id: "allergie", label: "Allergie aux bêta-lactamines", type: "seg", options: [["non", "Non"], ["simple", "Non sévère"], ["severe", "Sévère (anaphylaxie, toxidermie grave)"]] }
      ],
      compute: v => {
        const f = new Set(v.fdr); const B = [];
        const add = [], keys = [];
        if (v.ctx === "pac") {
          if (v.allergie === "severe") B.push(["Proposition", [`<strong>Lévofloxacine</strong> 500 mg ×2/j IV${f.has("pyo") ? ` + ${AZT} + ${AMK}` : ""}`]]);
          else if (f.has("pyo")) B.push(["Proposition", [`${PTZ} (ou ${CEFEP})`, `+ ${AMK}`, "+ <strong>Spiramycine</strong> 3 MUI ×3/j (ou lévofloxacine 500 mg ×2/j)"]]);
          else if (f.has("inhal")) B.push(["Proposition", ["<strong>Amoxicilline-clavulanate</strong> 1 g ×3/j IV (2 g ×3/j si poids élevé)", "|", `${CTX} + ${METRO}`]]);
          else B.push(["Proposition", [CTX, "+ <strong>Spiramycine</strong> 3 MUI ×3/j IV (ou lévofloxacine 500 mg ×2/j si contre-indication aux macrolides)"]]);
          if (v.allergie === "simple" && !f.has("pyo")) keys.push("Allergie non sévère : la ceftriaxone est utilisable (réactivité croisée faible).");
          if (f.has("necro")) add.push(`${LINE} (effet antitoxinique) ; alternative : clindamycine 600 mg ×3/j + vancomycine`);
          else if (f.has("sarm")) add.push(`${LINE} ou ${VANCO}`);
          if (f.has("grippe")) add.push("<strong>Oseltamivir</strong> 75 mg ×2/j ; couvrir S. aureus et pneumocoque");
          if (v.choc && !f.has("pyo")) add.push("Choc septique : discuter " + AMK.replace(" (1 à 3 injections)", " (dose unique)"));
          keys.push("PAC grave : hydrocortisone 200 mg/24 h à débuter rapidement (SPILF-SPLF 2025).", "Antigénuries pneumocoque et légionelle, PCR selon le contexte, hémocultures.", "Durée : 7 j en réanimation (3 à 5 j si stabilité précoce, hors réanimation).");
        } else {
          const bmr = v.tard || f.has("pyo") || f.has("blse") || v.choc;
          if (v.allergie === "severe") B.push(["Proposition", [AZT, `+ ${AMK}`, `+ ${VANCO} ou ${LINE} (aztréonam inactif sur les Gram positif)`]]);
          else if (!bmr) B.push(["Proposition (précoce, sans facteur de risque de BMR)", [CTX, "|", "<strong>Amoxicilline-clavulanate</strong> 1 g ×3/j"]]);
          else if (f.has("blse") && v.choc) B.push(["Proposition", [MERO, `+ ${AMK}`]]);
          else {
            B.push(["Proposition", [`${PTZ}`, "|", CEFEP, ...(f.has("blse") ? ["|", `${MERO} (colonisation à E-BLSE)`] : [])]]);
            if (v.choc || f.has("pyo")) add.push(AMK);
          }
          if (f.has("sarm") || f.has("necro")) add.push(`${LINE} (à préférer dans les pneumonies) ou ${VANCO}`);
          keys.push("Prélèvement respiratoire distal quantitatif avant l'antibiothérapie si possible.", "Bithérapie initiale seulement si choc ou BMR probable ; monothérapie dès l'antibiogramme.", "Durée : 7 j, y compris à P. aeruginosa si l'évolution est favorable.");
        }
        if (add.length) B.push(["À associer", add]);
        B.push(["Points clés", keys]);
        return { html: out(B) + VERIF, tone: v.choc ? "danger" : "" };
      }
    }),
    sections: [
      S("Facteurs de risque", [{ ul: ["<strong>* P. aeruginosa :</strong> BPCO sévère, bronchectasies, trachéotomie, antibiothérapie IV < 3 mois, colonisation ou infection antérieure", "<strong>** SARM :</strong> colonisation ou infection connue, prévalence locale élevée, plaie chronique, dialyse chronique", "<strong>E-BLSE :</strong> colonisation ou infection < 3 mois, antibiothérapie < 3 mois, hospitalisation récente, séjour en zone d'endémie"] }]),
      S("Critères de gravité (PAC)", [{ ul: ["Majeurs : choc septique sous vasopresseurs, ventilation mécanique", "Mineurs (≥ 3) : FR ≥ 30/min, PaO₂/FiO₂ ≤ 250, atteinte multilobaire, confusion, leucopénie < 4 G/L, thrombopénie < 100 G/L, T° < 36 °C, hypotension nécessitant un remplissage"] }])
    ],
    refs: ["Dinh A et al. Actualisation des recommandations PAC SPILF-SPLF. Méd Mal Infect Form 2025", "RFE SFAR-SRLF 2017 : Pneumonies associées aux soins de réanimation", "HAS 2025 : Prise en charge du sepsis"]
  };

  /* ---------- Infections urinaires ---------- */
  T["infections-urinaires"] = {
    title: "Infections urinaires", desc: "Pyélonéphrites graves, communautaires et associées aux soins",
    tool: P17.calc({
      id: "atbIU", title: "Antibiothérapie probabiliste des infections urinaires graves", kind: "tool",
      fields: [
        { id: "ctx", label: "Origine", type: "seg", options: [["comm", "Communautaire"], ["soins", "Associée aux soins"]] },
        { id: "grav", label: "Gravité", type: "seg", options: [["0", "Sans signe de gravité"], ["1", "Sepsis ou geste urologique urgent"], ["2", "Choc septique"]] },
        { id: "fdr", label: "Facteurs de risque", type: "checks", options: [["blse6", "Colonisation ou infection à E-BLSE < 6 mois"], ["blseautre", "Autre facteur de risque d'E-BLSE*"], ["obst", "Obstacle sur les voies urinaires"], ["emphy", "Pyélonéphrite emphysémateuse"]] },
        { id: "allergie", label: "Allergie sévère aux bêta-lactamines", type: "check" }
      ],
      compute: v => {
        const f = new Set(v.fdr); const g = +v.grav; const B = []; const keys = [];
        const anyBlse = f.has("blse6") || f.has("blseautre");
        if (v.allergie) B.push(["Proposition", g === 0 && v.ctx === "comm" ? [AMK, "|", AZT] : [AZT, `+ ${AMK}`]]);
        else if (v.ctx === "comm") {
          if (g === 0) B.push(["Proposition", [CTX]]);
          else if (g === 1) B.push(["Proposition", f.has("blse6") ? [`${MERO} (ou ${IMI})`, `+ ${AMK}`] : [CTX, `+ ${AMK}`]]);
          else B.push(["Proposition", anyBlse ? [`${MERO} (ou ${IMI})`, `+ ${AMK}`] : [CTX, `+ ${AMK}`]]);
        } else {
          if (g === 0) B.push(["Proposition", anyBlse ? [PTZ, `+ ${AMK}`, "(éviter les carbapénèmes en probabiliste sans gravité)"] : [PTZ]]);
          else if (g === 1) B.push(["Proposition", f.has("blse6") ? [MERO, `+ ${AMK}`] : [PTZ, `+ ${AMK}`]]);
          else B.push(["Proposition", anyBlse ? [MERO, `+ ${AMK}`] : [PTZ, `+ ${AMK}`]]);
        }
        if (f.has("obst") || f.has("emphy")) B.push(["Geste urgent", ["<strong>Drainage des urines en urgence</strong> (sonde JJ ou néphrostomie) : l'antibiothérapie seule est insuffisante", ...(f.has("emphy") ? ["Pyélonéphrite emphysémateuse (diabète, obstacle) : drainage, voire néphrectomie ; associer systématiquement l'amikacine"] : [])]]);
        keys.push("ECBU et hémocultures avant l'antibiothérapie.", "Échographie ou uroscanner dans les 24 h (dans l'heure si choc ou suspicion d'obstacle).", "Durée : 7 j (PNA simple) à 10–14 j (homme, complication) ; voir Durées.");
        if (!v.allergie && g === 0 && v.ctx === "comm" && anyBlse) keys.unshift("Sans gravité : pas de couverture des E-BLSE en probabiliste même en présence de facteurs de risque.");
        B.push(["Points clés", keys]);
        return { html: out(B) + VERIF, tone: g === 2 ? "danger" : g === 1 ? "warn" : "" };
      }
    }),
    sections: [S("* Facteurs de risque d'E-BLSE", [{ ul: ["Antibiothérapie < 6 mois par pénicilline + inhibiteur, C2G, C3G ou fluoroquinolone", "Voyage récent en zone d'endémie", "Hospitalisation < 3 mois, vie en institution de long séjour"] }])],
    refs: ["SPILF : Diagnostic et antibiothérapie des infections urinaires bactériennes communautaires de l'adulte (mise à jour 2018)", "SPILF 2015 : Infections urinaires associées aux soins"]
  };

  /* ---------- Infections intra-abdominales ---------- */
  T["infections-intra-abdominales"] = {
    title: "Infections intra-abdominales", desc: "Péritonites, infections biliaires, abcès, pancréatite infectée, ascite",
    tool: P17.calc({
      id: "atbIIA", title: "Antibiothérapie probabiliste des infections intra-abdominales", kind: "tool",
      fields: [
        { id: "type", label: "Infection", type: "select", options: [
          ["perit", "Péritonite secondaire (dont appendicite et diverticulite compliquées)"],
          ["bili", "Cholécystite ou angiocholite"],
          ["abces", "Abcès hépatique"],
          ["pancreas", "Infection de nécrose pancréatique"],
          ["ascite", "Infection du liquide d'ascite (cirrhose)"],
          ["oeso", "Perforation œsophagienne (dont Boerhaave)"]] },
        { id: "ctx", label: "Origine", type: "seg", options: [["comm", "Communautaire"], ["soins", "Associée aux soins / postopératoire"]] },
        { id: "grav", label: "Gravité", type: "seg", options: [["0", "Sans sepsis"], ["1", "Sepsis"], ["2", "Choc septique"]] },
        { id: "fdr", label: "Facteurs de risque", type: "checks", options: [["bmr", "Facteurs de risque de BMR (antibiothérapie > 48 h récente, colonisation E-BLSE, hospitalisation prolongée)"], ["faecium", "Risque d'entérocoque résistant à l'amoxicilline (pathologie hépatobiliaire, transplantation hépatique, antibiothérapie en cours, colonisation connue)"], ["prothese", "Prothèse biliaire ou anastomose bilio-digestive"], ["levures", "Levures à l'examen direct du liquide péritonéal"]] },
        { id: "dupont", label: "Critères de Dupont présents (défaillance hémodynamique, sexe féminin, chirurgie sus-mésocolique, antibiothérapie > 48 h)", type: "select", options: [["0", "0 à 2 critères"], ["3", "3 ou 4 critères"]], showIf: v => v.type === "perit" && v.ctx === "soins" },
        { id: "allergie", label: "Allergie sévère aux bêta-lactamines", type: "check" }
      ],
      compute: v => {
        const f = new Set(v.fdr); const g = +v.grav; const B = []; const add = []; const keys = [];
        const nbBmr = f.has("bmr") ? 1 : 0;
        if (v.type === "perit") {
          if (v.ctx === "comm") {
            if (v.allergie) B.push(["Proposition", ["<strong>Lévofloxacine</strong> 500 mg ×2/j + " + METRO + " + " + GENTA, "|", "<strong>Tigécycline</strong> 100 mg puis 50 mg ×2/j"]]);
            else if (g === 0) B.push(["Proposition", ["<strong>Amoxicilline-clavulanate</strong> 1 g ×3/j + " + GENTA, "|", `${CTX} + ${METRO}`]]);
            else B.push(["Proposition", [PTZ, `+ ${GENTA}`]]);
            keys.push("Pas de carbapénème en première intention dans les péritonites communautaires.", "Pas de couverture de l'entérocoque ni antifongique en l'absence de gravité.");
          } else {
            if (v.allergie) B.push(["Proposition", [`${CIPRO} ou ${AZT}`, `+ ${AMK}`, `+ ${METRO}`, `+ ${VANCO}`]]);
            else if (g === 2 || (g === 1 && nbBmr)) B.push(["Proposition", [`${IMI} ou ${MERO} (pas d'ertapénème)`, `+ ${AMK}`]]);
            else B.push(["Proposition", [PTZ, ...(g >= 1 ? [`+ ${AMK}`] : [])]]);
            if (f.has("faecium") && g >= 1) add.push(VANCO + " (entérocoque résistant à l'amoxicilline)");
            if (v.dupont === "3" || f.has("levures")) add.push(`${CASPO} — fluconazole 800 mg J1 puis 400 mg/j si patient stable sans exposition aux azolés`);
            keys.push("Prélèvements peropératoires systématiques (aérobies, anaérobies, levures).", "Désescalade dès l'antibiogramme ; durée 7–8 j si contrôle de la source.");
          }
        } else if (v.type === "bili") {
          if (v.allergie) B.push(["Proposition", [`${CIPRO} ou ${AZT}`, `+ ${METRO}`, ...(g >= 1 || v.ctx === "soins" ? [`+ ${VANCO}`, `+ ${AMK}`] : [])]]);
          else if (v.ctx === "comm" && g === 0) B.push(["Proposition", ["<strong>Ceftriaxone</strong> 1–2 g/24 h" + (f.has("prothese") ? ` + ${METRO}` : " (± métronidazole si anastomose bilio-digestive)")]]);
          else if (v.ctx === "comm") B.push(["Proposition", [PTZ, `+ ${AMK}`]]);
          else B.push(["Proposition", [f.has("bmr") ? IMI : PTZ, ...(g >= 1 ? [`+ ${AMK}`] : [])]]);
          if ((f.has("prothese") || f.has("faecium")) && (v.ctx === "soins" || g >= 1)) add.push(VANCO);
          if (f.has("prothese") && g === 2 && v.ctx === "soins") add.push(CASPO);
          keys.push("Angiocholite : drainage biliaire (CPRE) en urgence si choc ou absence d'amélioration rapide.", "Cholécystite : cholécystectomie précoce ; antibiothérapie courte après l'exérèse si non compliquée.");
        } else if (v.type === "abces") {
          B.push(["Proposition", v.allergie ? [`${CIPRO} + ${METRO}`] : (v.ctx === "comm" ? [`<strong>Ceftriaxone</strong> 1–2 g/24 h + ${METRO}`] : [f.has("bmr") ? IMI : PTZ])]);
          if (g >= 1) add.push(AMK);
          keys.push("Drainage percutané de l'abcès et prélèvements ; sérologie amibienne (le métronidazole couvre l'amibiase).", "Durée : 4 à 6 semaines selon l'évolution.");
        } else if (v.type === "pancreas") {
          B.push(["Proposition", v.allergie ? [`${CIPRO} + ${METRO}`] : [`${IMI} ou ${MERO} (bonne diffusion dans la nécrose)`, "|", `${CIPRO} + ${METRO}`]]);
          if (g === 2) add.push(AMK);
          if (f.has("levures")) add.push(CASPO);
          keys.push("Pas d'antibioprophylaxie dans la pancréatite aiguë nécrosante non infectée.", "Infection suspectée (gaz dans la nécrose, ponction positive) : drainage progressif (step-up).");
        } else if (v.type === "ascite") {
          B.push(["Proposition", v.allergie ? [CIPRO] : (v.ctx === "comm" ? ["<strong>Céfotaxime</strong> 1–2 g ×3/j (ou ceftriaxone 1–2 g/24 h)"] : [f.has("bmr") ? MERO : PTZ])]);
          B.push(["À associer", ["<strong>Albumine</strong> 1,5 g/kg à J1 puis 1 g/kg à J3 (prévention du syndrome hépatorénal)"]]);
          if (g === 2) add.push(AMK + " — prudence (néphrotoxicité chez le cirrhotique)");
          keys.push("Diagnostic : PNN > 250/mm³ dans l'ascite ; paracentèse de contrôle à 48 h (pas de drainage).", "Durée : 5 à 7 j.");
        } else if (v.type === "oeso") {
          B.push(["Proposition", v.allergie ? [`${CIPRO} + ${METRO} + ${VANCO}`] : (v.ctx === "comm" ? [`<strong>Ceftriaxone</strong> 1–2 g/24 h + ${METRO}`] : [PTZ])]);
          if (g === 2) { add.push(v.ctx === "comm" ? GENTA : AMK); add.push(CASPO); }
          keys.push("Médiastinite : drainage chirurgical ou endoscopique en urgence, nutrition entérale par jéjunostomie.");
        }
        if (add.length) B.push(["À associer", add]);
        B.push(["Points clés", keys]);
        return { html: out(B) + VERIF, tone: g === 2 ? "danger" : g === 1 ? "warn" : "" };
      }
    }),
    sections: [
      S("Contrôle de la source", [{ ul: ["Le contrôle de la source (chirurgie, drainage) conditionne le pronostic : ne pas le retarder", "Antibiothérapie débutée dès le diagnostic, dans l'heure si choc septique"] }]),
      S("Durées après contrôle de la source", [{ ul: ["Ulcère opéré < 24 h, plaie pénétrante, perforation iatrogène sous-mésocolique : 24 h", "Péritonite communautaire localisée : 2–3 j ; généralisée : 4–7 j", "Péritonite associée aux soins : 7–8 j (5–15 j selon l'évolution)"] }])
    ],
    refs: ["RFE SFAR-SPILF 2014 : Prise en charge des infections intra-abdominales", "Sawyer RG et al. STOP-IT. N Engl J Med 2015", "EASL Clinical practice guidelines for decompensated cirrhosis. J Hepatol 2018"]
  };

  /* ---------- Parties molles ---------- */
  T["parties-molles"] = {
    title: "Infections des parties molles", desc: "Dermohypodermites, fasciites nécrosantes, choc toxique",
    tool: P17.calc({
      id: "atbPM", title: "Antibiothérapie probabiliste des infections des parties molles", kind: "tool",
      fields: [
        { id: "type", label: "Infection", type: "select", options: [["dhbnn", "Dermohypodermite non nécrosante"], ["toxique", "Suspicion de choc toxique streptococcique ou staphylococcique"], ["necro", "Dermohypodermite nécrosante ou fasciite nécrosante"]] },
        { id: "ctx", label: "Origine", type: "seg", options: [["comm", "Communautaire"], ["soins", "Nosocomiale / postopératoire"]], showIf: v => v.type === "necro" },
        { id: "loc", label: "Localisation", type: "seg", options: [["membres", "Membres"], ["cervico", "Cervico-faciale"], ["perinee", "Abdomino-périnéale"]], showIf: v => v.type === "necro" && v.ctx === "comm" },
        { id: "fdr", label: "Facteurs", type: "checks", options: [["morsure", "Morsure"], ["kt", "Point de départ sur cathéter"], ["diab", "Diabète, artériopathie, plaie chronique ou antibiothérapie récente"], ["blse", "Colonisation à E-BLSE"], ["sarm", "Risque de SARM"]] },
        { id: "choc", label: "Sepsis ou choc septique", type: "check" },
        { id: "allergie", label: "Allergie sévère aux bêta-lactamines", type: "check" }
      ],
      compute: v => {
        const f = new Set(v.fdr); const B = []; const add = []; const keys = [];
        const CLINDA = "<strong>Clindamycine</strong> 600 mg ×3/j IV (effet antitoxinique, 48–72 h)";
        if (v.type === "dhbnn") {
          if (f.has("kt")) B.push(["Proposition", ["<strong>Retrait du cathéter</strong>", v.choc ? `${CEFEP} + ${VANCO} + ${AMK}` : "Pas d'antibiothérapie probabiliste en l'absence de gravité (hémocultures, culture du cathéter)"]]);
          else if (v.allergie) B.push(["Proposition", ["<strong>Pristinamycine</strong> 1 g ×3/j per os", "|", CLINDA.replace(" (effet antitoxinique, 48–72 h)", "")]]);
          else if (f.has("morsure")) B.push(["Proposition", ["<strong>Amoxicilline-clavulanate</strong> 1 g ×3/j (2 g ×3/j si poids > 90 kg)"]]);
          else B.push(["Proposition", ["<strong>Amoxicilline</strong> 50 mg/kg/j en 3 prises (maximum 6 g/j), IV puis per os"]]);
          if (f.has("sarm") && v.choc) add.push(VANCO);
          keys.push("Marquer les limites de l'érythème, surélever le membre, traiter la porte d'entrée.", "Rechercher des signes de nécrose : douleur intense, crépitation, bulles hémorragiques, hypoesthésie, extension rapide.", "Durée : 7 j.");
        } else if (v.type === "toxique") {
          B.push(["Proposition", [(v.allergie || f.has("sarm")) ? `${VANCO} ou ${LINE}` : "<strong>Céfazoline</strong> 2 g ×3/j (ou autre bêta-lactamine anti-streptococcique et anti-staphylococcique)", `+ ${CLINDA}`]]);
          add.push("<strong>Immunoglobulines IV</strong> 1 g/kg à J1 (puis 0,5 g/kg J2–J3) à discuter dans le choc toxique streptococcique");
          keys.push("Choc streptococcique : rechercher une évolution nécrosante nécessitant la chirurgie.", "Choc staphylococcique : rechercher un tampon ou dispositif intravaginal, un abcès.");
        } else {
          const soins = v.ctx === "soins";
          if (v.allergie) B.push(["Proposition", [`${CIPRO} (ou ${AZT})`, `+ ${LINE} (antitoxinique) ou ${VANCO}`, ...(soins || v.loc === "perinee" ? [`+ ${METRO}`] : [])]]);
          else if (soins) B.push(["Proposition", [f.has("blse") ? MERO : PTZ, ...(f.has("sarm") ? [`+ ${VANCO} ou ${LINE}`] : [])]]);
          else if (v.loc === "membres") B.push(["Proposition", [f.has("diab") ? PTZ : "<strong>Amoxicilline-clavulanate</strong> 2 g ×3/j IV", `+ ${CLINDA}`]]);
          else if (v.loc === "cervico") B.push(["Proposition", ["<strong>Amoxicilline-clavulanate</strong> 2 g ×3/j IV", `+ ${CLINDA}`, "|", `${CTX} + ${METRO} + clindamycine`]]);
          else B.push(["Proposition", [f.has("blse") ? MERO : PTZ]]);
          if (!v.allergie && f.has("sarm") && !soins) add.push(`${VANCO} ou ${LINE}`);
          if (v.choc) add.push(AMK);
          B.unshift(["Urgence chirurgicale", ["<strong>Débridement chirurgical en urgence</strong> : l'antibiothérapie ne remplace pas la chirurgie ; réexploration à 24 h"]]);
          keys.push("Prélèvements peropératoires profonds, hémocultures.", "Fournier (périnée) : bilan urologique et digestif, discuter une dérivation.", "Durée : 10 à 15 j après le dernier débridement.");
        }
        if (add.length) B.push(["À associer", add]);
        B.push(["Points clés", keys]);
        return { html: out(B) + VERIF, tone: v.choc || v.type !== "dhbnn" ? "danger" : "" };
      }
    }),
    sections: [S("Signes de nécrose", [{ ul: ["Douleur disproportionnée, œdème dépassant l'érythème, bulles hémorragiques, nécrose cutanée, crépitation, hypoesthésie", "Défaillance d'organe, extension rapide malgré l'antibiothérapie", "L'imagerie ne doit pas retarder l'exploration chirurgicale"] }])],
    refs: ["HAS-SPILF-SFD 2019 : Prise en charge des infections cutanées bactériennes courantes", "Conférence de consensus SPILF-SFD : Érysipèle et fasciite nécrosante"]
  };

  /* ---------- Neuro-méningées ---------- */
  T["neuro-meningees"] = {
    title: "Infections neuro-méningées", desc: "Méningites, méningo-encéphalites, abcès cérébraux, post-neurochirurgie",
    tool: P17.calc({
      id: "atbNeuro", title: "Antibiothérapie probabiliste des infections neuro-méningées", kind: "tool",
      fields: [
        { id: "type", label: "Tableau", type: "select", options: [["men", "Méningite bactérienne communautaire"], ["postop", "Méningite après neurochirurgie ou sur dérivation"], ["me", "Méningo-encéphalite"], ["abces", "Abcès cérébral"]] },
        { id: "edi", label: "Examen direct du LCS", type: "select", options: [["neg", "Négatif ou non disponible"], ["cgp", "Cocci Gram positif"], ["cgn", "Cocci Gram négatif"], ["bgp", "Bacille Gram positif"], ["bgn", "Bacille Gram négatif"]], showIf: v => v.type === "men" },
        { id: "listeria", label: "Arguments pour une listériose (âge > 65 ans, grossesse, immunodépression, cancer, diabète, cirrhose, alcoolisme, rhombencéphalite)", type: "check", showIf: v => v.type === "men" || v.type === "me" },
        { id: "porte", label: "Porte d'entrée", type: "seg", options: [["autre", "ORL, dentaire, indéterminée"], ["postop", "Post-opératoire ou traumatique"]], showIf: v => v.type === "abces" },
        { id: "immuno", label: "Immunodépression (onco-hématologie, transplantation, VIH)", type: "check", showIf: v => v.type === "abces" },
        { id: "allergie", label: "Allergie sévère aux bêta-lactamines", type: "check" }
      ],
      compute: v => {
        const B = []; const add = []; const keys = [];
        const C300 = "<strong>Céfotaxime</strong> 300 mg/kg/j en 4–6 injections ou IVSE après charge (ou <strong>ceftriaxone</strong> 100 mg/kg/j en 1–2 injections)";
        const C200 = "<strong>Céfotaxime</strong> 200 mg/kg/j (ou ceftriaxone 75–100 mg/kg/j)";
        const AMOX = "<strong>Amoxicilline</strong> 200 mg/kg/j en 4–6 injections";
        const DEXA = "<strong>Dexaméthasone</strong> 10 mg toutes les 6 h pendant 4 j, avant ou avec la première dose d'antibiotique";
        if (v.type === "men") {
          if (v.allergie) B.push(["Proposition (allergie sévère : avis infectiologique)", ["Pneumocoque probable : <strong>vancomycine</strong> (charge 25–30 mg/kg puis 40–60 mg/kg/j IVSE) + <strong>rifampicine</strong> 600 mg ×2/j", "Méningocoque ou BGN : ciprofloxacine 400 mg ×3/j ou aztréonam", "Listeria : <strong>cotrimoxazole</strong> TMP 15–20 mg/kg/j"]]);
          else if (v.edi === "cgp") B.push(["Proposition", [C300, `+ ${DEXA}`]]);
          else if (v.edi === "cgn") B.push(["Proposition", [C200, `+ ${DEXA}`]]);
          else if (v.edi === "bgp") B.push(["Proposition (Listeria)", [AMOX, "+ <strong>Gentamicine</strong> 5 mg/kg/j (3 à 5 jours)", "Pas de dexaméthasone ; arrêt si déjà débutée"]]);
          else if (v.edi === "bgn") B.push(["Proposition", [C200, `+ ${DEXA}`]]);
          else B.push(["Proposition", [C300, ...(v.listeria ? [`+ ${AMOX}`, "+ gentamicine 5 mg/kg/j"] : []), `+ ${DEXA}`]]);
          keys.push("Antibiothérapie dans l'heure ; ne pas retarder par l'imagerie (hémocultures d'abord si la PL est différée).", "Scanner avant la PL si signes de localisation, troubles de conscience (Glasgow ≤ 11) ou crises.", "Prophylaxie des contacts si méningocoque (rifampicine ou ciprofloxacine), déclaration obligatoire.");
        } else if (v.type === "postop") {
          B.push(["Proposition", v.allergie ? [VANCO, `+ ${AZT} ou ${CIPRO}`] : [VANCO, `+ ${CEFEP} ou ${MERO} (2 g ×3/j)`]]);
          keys.push("Retirer ou changer le matériel infecté (dérivation) dès que possible.", "Antibiothérapie intraventriculaire à discuter en cas d'échec (avis infectiologique).");
        } else if (v.type === "me") {
          B.push(["Proposition", ["<strong>Aciclovir</strong> 10 mg/kg toutes les 8 h IV (adapter à la fonction rénale)", `+ ${AMOX} (Listeria)`, `± ${C300} si méningite bactérienne non exclue`]]);
          keys.push("Signes de gravité (coma, crises, déficit) : traitement immédiat, scanner puis PL si non contre-indiquée.", "PCR HSV/VZV dans le LCS ; poursuivre l'aciclovir 14–21 j si confirmé.");
        } else {
          if (v.allergie) B.push(["Proposition", [`<strong>Lévofloxacine</strong> 500 mg ×2/j + ${METRO}`, `+ ${VANCO} ou ${LINE}`]]);
          else if (v.porte === "postop") B.push(["Proposition", ["<strong>Méropénème</strong> 2 g ×3/j (ou céfépime)", `+ ${VANCO} ou ${LINE}`]]);
          else B.push(["Proposition", [C300.replace("(ou <strong>ceftriaxone</strong> 100 mg/kg/j en 1–2 injections)", "(ou ceftriaxone 2 g ×2/j)"), `+ ${METRO}`]]);
          if (v.immuno) add.push("<strong>Cotrimoxazole</strong> TMP 15 mg/kg/j (Nocardia) ± <strong>voriconazole</strong> 6 mg/kg ×2 à J1 puis 4 mg/kg ×2/j (Aspergillus) ; toxoplasmose si VIH avec CD4 < 200 (pyriméthamine-sulfadiazine)");
          keys.push("Avis neurochirurgical : ponction ou exérèse à visée diagnostique et thérapeutique.", "Durée : 6 à 8 semaines.");
        }
        if (add.length) B.push(["À associer", add]);
        B.push(["Points clés", keys]);
        return { html: out(B) + VERIF, tone: "danger" };
      }
    }),
    sections: [],
    refs: ["Conférence de consensus SPILF 2008 (actualisée) : Prise en charge des méningites bactériennes aiguës communautaires", "Tunkel AR et al. IDSA guidelines for healthcare-associated ventriculitis and meningitis. Clin Infect Dis 2017"]
  };

  /* ---------- Sepsis sans porte d'entrée ---------- */
  T.sepsis = {
    title: "Sepsis sans porte d'entrée", desc: "Sepsis et choc septique sans foyer identifié",
    tool: P17.calc({
      id: "atbSepsis", title: "Antibiothérapie probabiliste du sepsis sans porte d'entrée", kind: "tool",
      fields: [
        { id: "ctx", label: "Origine", type: "seg", options: [["comm", "Communautaire"], ["soins", "Associée aux soins"]] },
        { id: "neutro", label: "Neutropénie (PNN < 0,5 G/L)", type: "check" },
        { id: "fdr", label: "Facteurs de risque", type: "checks", options: [["blse", "Facteurs de risque d'E-BLSE"], ["sarm", "Risque de SARM ou cathéter suspect"], ["candida", "Haut risque de candidose invasive (colonisation multisite, chirurgie abdominale récidivante, nutrition parentérale)"]] },
        { id: "choc", label: "Choc septique", type: "check" },
        { id: "allergie", label: "Allergie sévère aux bêta-lactamines", type: "check" }
      ],
      compute: v => {
        const f = new Set(v.fdr); const B = []; const add = []; const keys = [];
        if (v.allergie) B.push(["Proposition", [v.ctx === "comm" && !v.neutro ? `<strong>Lévofloxacine</strong> 500 mg ×2/j + ${METRO}` : `${CIPRO} ou ${AZT}`, ...(v.ctx === "soins" || v.neutro ? [`+ ${METRO}`, `+ ${VANCO}`] : [])]]);
        else if (f.has("blse") && (v.choc || v.ctx === "soins" || v.neutro)) B.push(["Proposition", [`${MERO} ou ${IMI}`]]);
        else if (v.neutro || v.ctx === "soins") B.push(["Proposition", [PTZ, "|", `${CEFEP} + ${METRO}`]]);
        else B.push(["Proposition", ["<strong>Céfotaxime</strong> 2 g ×3/j (ou ceftriaxone 2 g/24 h)", "± métronidazole 500 mg ×3/j si foyer digestif possible"]]);
        if (v.choc) add.push(v.ctx === "comm" && !v.neutro ? GENTA : AMK);
        if (f.has("sarm") && !(v.allergie && (v.ctx === "soins" || v.neutro))) add.push(VANCO);
        if (f.has("candida") && (v.choc || v.ctx === "soins")) add.push(CASPO);
        keys.push("Antibiothérapie dans l'heure si choc septique, dans les 3 h si sepsis sans choc.", "Deux hémocultures au minimum avant l'antibiothérapie, sans la retarder.", "Rechercher activement le foyer (imagerie, examen cutané, cathéters).", "Deux molécules seulement si risque élevé de BMR ; réévaluation quotidienne ; durée ≤ 7 j si source contrôlée.", "Penser aux causes non bactériennes et régionales (leptospirose, rickettsiose, brucellose, paludisme au retour de voyage).");
        if (add.length) B.push(["À associer", add]);
        B.push(["Points clés", keys]);
        return { html: out(B) + VERIF, tone: v.choc ? "danger" : "warn" };
      }
    }),
    sections: [],
    refs: ["HAS 2025 : Prise en charge du sepsis du nouveau-né, de l'enfant et de l'adulte (SRLF)", "Surviving Sepsis Campaign 2021"]
  };

  /* ---------- Endocardites ---------- */
  T.endocardites = {
    title: "Endocardites infectieuses", desc: "Valve native ou prothétique, communautaire ou associée aux soins",
    tool: P17.calc({
      id: "atbEI", title: "Antibiothérapie probabiliste des endocardites", kind: "tool",
      fields: [
        { id: "ctx", label: "Origine", type: "seg", options: [["comm", "Communautaire"], ["soins", "Associée aux soins"]] },
        { id: "valve", label: "Valve", type: "seg", options: [["native", "Native"], ["tardive", "Prothèse > 12 mois"], ["precoce", "Prothèse ≤ 12 mois"]] },
        { id: "allergie", label: "Allergie sévère aux bêta-lactamines", type: "check" }
      ],
      compute: v => {
        const B = []; const keys = [];
        const vanco = "<strong>Vancomycine</strong> charge 25–30 mg/kg puis 30–40 mg/kg/24 h IVSE (plateau 20–25 mg/L)";
        const genta = "<strong>Gentamicine</strong> 3 mg/kg/24 h IV en 1 injection (durée courte)";
        const rif = "<strong>Rifampicine</strong> 900–1200 mg/24 h en 2–3 prises, débutée après 3–5 j de traitement efficace (prothèse)";
        if (v.allergie || v.ctx === "soins" || v.valve === "precoce") {
          B.push(["Proposition", [`${vanco} (ou <strong>daptomycine</strong> 10 mg/kg/24 h)`, `+ ${genta}`, ...(v.valve !== "native" ? [`+ ${rif}`] : [])]]);
          if (v.ctx === "soins" && !v.allergie) keys.push("Ajouter une couverture des BGN si contexte nosocomial avec sepsis (céfépime ou pipéracilline-tazobactam).");
        } else {
          B.push(["Proposition", ["<strong>Amoxicilline</strong> 200 mg/kg/j en 6 injections ou IVSE", "+ <strong>Cloxacilline</strong> 150–200 mg/kg/j en 4–6 injections ou IVSE", `± ${genta} selon le protocole du service`, "|", "Amoxicilline 200 mg/kg/j + <strong>ceftriaxone</strong> 2 g ×2/j (+ cloxacilline si S. aureus suspecté)"]]);
        }
        keys.push("Trois paires d'hémocultures avant l'antibiothérapie ; ETT puis ETO.", "Discussion en équipe pluridisciplinaire d'endocardite (indication et délai chirurgical).", "Adapter dès l'identification du germe : durée 4–6 semaines (native) ou 6 semaines (prothèse).");
        B.push(["Points clés", keys]);
        return { html: out(B) + VERIF, tone: "warn" };
      }
    }),
    sections: [],
    refs: ["Delgado V et al. 2023 ESC Guidelines for the management of endocarditis. Eur Heart J 2023"]
  };

  /* ---------- Médiastinite ---------- */
  T.mediastinite = {
    title: "Médiastinites postopératoires", desc: "Après sternotomie",
    tool: P17.calc({
      id: "atbMed", title: "Antibiothérapie probabiliste de la médiastinite postopératoire", kind: "tool",
      fields: [{ id: "choc", label: "Choc septique", type: "check" }, { id: "blse", label: "Colonisation à E-BLSE", type: "check" }, { id: "allergie", label: "Allergie sévère aux bêta-lactamines", type: "check" }],
      compute: v => {
        const B = [];
        B.push(["Anti-Gram positif (dont SARM et staphylocoques à coagulase négative)", [`${VANCO} (ou <strong>daptomycine</strong> 10 mg/kg/24 h)`]]);
        B.push(["Anti-Gram négatif", [v.allergie ? `${AZT} (ou ${CIPRO})` : (v.blse && v.choc ? MERO : `${PTZ}`), ...(!v.allergie && !(v.blse && v.choc) ? ["|", CEFEP] : [])]]);
        if (v.choc) B.push(["À associer", [AMK]]);
        B.push(["Points clés", ["Reprise chirurgicale (débridement, drainage, fermeture différée ou thérapie par pression négative).", "Prélèvements profonds et hémocultures avant l'antibiothérapie.", "Durée : 6 semaines en cas d'ostéite sternale."]]);
        return { html: out(B) + VERIF, tone: v.choc ? "danger" : "warn" };
      }
    }),
    sections: [], refs: ["Abu-Omar Y et al. EACTS expert consensus statement on the prevention and management of mediastinitis. Eur J Cardiothorac Surg 2017"]
  };

  /* ---------- Infection du site opératoire vasculaire ---------- */
  T["iso-vasculaire"] = {
    title: "Infection du site opératoire vasculaire (Scarpa)", desc: "Après abord fémoral, prothèse ou canule",
    tool: P17.calc({
      id: "atbScarpa", title: "Antibiothérapie probabiliste de l'infection du Scarpa", kind: "tool",
      fields: [{ id: "prothese", label: "Prothèse vasculaire ou matériel en place", type: "check" }, { id: "choc", label: "Choc septique", type: "check" }, { id: "allergie", label: "Allergie sévère aux bêta-lactamines", type: "check" }],
      compute: v => {
        const B = [];
        B.push(["Anti-Gram positif", [`${VANCO} (ou <strong>daptomycine</strong> 10 mg/kg/24 h)`]]);
        B.push(["Anti-Gram négatif", [v.allergie ? `${AZT} (ou ${CIPRO})` : PTZ, ...(!v.allergie ? ["|", CEFEP] : [])]]);
        if (v.choc) B.push(["À associer", [AMK]]);
        B.push(["Points clés", ["Exploration chirurgicale, prélèvements profonds, imagerie (échographie, scanner, TEP selon le cas).", v.prothese ? "Infection de prothèse : discussion médico-chirurgicale (explantation, reconstruction in situ) ; durée ≥ 6 semaines." : "Sans matériel : durée 14 j selon l'évolution.", "Hémorragie par lâchage d'anastomose : risque vital, sang disponible."]]);
        return { html: out(B) + VERIF, tone: v.choc ? "danger" : "warn" };
      }
    }),
    sections: [], refs: ["Chakfé N et al. ESVS 2020 Clinical practice guidelines on the management of vascular graft and endograft infections. Eur J Vasc Endovasc Surg 2020"]
  };

  const PROBA = Object.entries(T);

  // Hommage en tête de rubrique : portrait si une photo est fournie dans la configuration
  // Hommage : portrait au trait en filigrane
  // derrière toutes les pages d'antibiothérapie (élément fixe, affiché selon la page ouverte)
  (function mountTrait() {
    const h = CFG.hommage; if (!h || !h.trait) return;
    const put = () => {
      if (document.getElementById("hm-bg")) return;
      const d = document.createElement("div"); d.id = "hm-bg"; d.className = "hm-bg"; d.setAttribute("aria-hidden", "true");
      d.innerHTML = `<img src="${P17.esc(P17.src(h.trait))}" alt="">`;
      document.body.prepend(d);
    };
    if (document.body) put(); else document.addEventListener("DOMContentLoaded", put);
  })();

  /* =================== ROUTES =================== */
  P17.route(ROOT, {
    title: SEC,
    render: () => P17.page({
      crumbs: base, title: "Antibiothérapie en réanimation", accent: "antibiotherapie", icon: "antibiotherapie",
      subtitle: `Fiches révisées pour le ${P17.esc(CFG.serviceLong)}. Outils d'aide à la prescription : toujours confronter à l'écologie locale et aux prélèvements.`,
      body: P17.group("Antibiothérapie probabiliste", P17.tiles(PROBA.map(([id, t]) => ({ href: `${ROOT}/probabiliste/${id}`, title: t.title, desc: t.desc, icon: "tool", accent: "antibiotherapie" }))))
        + P17.group("Outils", P17.tiles([
          { href: `${ROOT}/durees`, title: "Durées d'antibiothérapie", desc: "Par site infectieux", icon: "fiche", accent: "antibiotherapie" },
          { href: `${ROOT}/adaptation-renale`, title: "Adaptation à la fonction rénale", desc: "Insuffisance rénale, hémodialyse, EER continue", icon: "tool", accent: "antibiotherapie" },
          { href: `${ROOT}/modalites`, title: "Modalités d'administration", desc: "Charge, perfusion prolongée ou continue, stabilité", icon: "fiche", accent: "antibiotherapie" }
        ]))
        + P17.group("Antibiorésistances et classifications", P17.tiles([
          { href: `${ROOT}/resistances`, title: "Bactéries multirésistantes", desc: "SARM, E-BLSE, AmpC, EPC, P. aeruginosa, A. baumannii, S. maltophilia, ERV", icon: "fiche", accent: "antibiotherapie" },
          { href: `${ROOT}/sensibles`, title: "Bactéries multisensibles", desc: "Antibiotique de référence par bactérie", icon: "fiche", accent: "antibiotherapie" },
          { href: `${ROOT}/mecanismes`, title: "Mécanismes et phénotypes de résistance", desc: "Bêta-lactamases, entérobactéries, phénotypes habituels", icon: "fiche", accent: "antibiotherapie" },
          { href: `${ROOT}/bacteries`, title: "Classification des bactéries", desc: "Gram, orientation, antibiothérapie de première intention", icon: "fiche", accent: "antibiotherapie" },
          { href: `${ROOT}/antibiotiques`, title: "Familles d'antibiotiques", desc: "Action, PK/PD, spectre, posologies, effets indésirables", icon: "fiche", accent: "antibiotherapie" }
        ]))
    })
  });
  P17.index(ROOT, SEC, "antibiotiques infections", SEC);

  PROBA.forEach(([id, t]) => {
    const path = `${ROOT}/probabiliste/${id}`;
    P17.route(path, { title: t.title, render: () => atbPage({ path, kicker: "Antibiothérapie probabiliste", title: t.title, subtitle: t.desc, tool: t.tool, sections: t.sections, refs: t.refs }) });
    P17.index(path, `${t.title} — antibiothérapie probabiliste`, t.desc, SEC);
  });

  /* ---------- BMR ---------- */
  const BMR = window.P17_BMR || [];
  const PHENO = window.P17_ATB_PHENO || {};
  const phenoTable = key => {
    const P = PHENO[key]; if (!P) return "";
    const cls = c => /^S$|^S /.test(c) ? "S" : /^R$|^R /.test(c) ? "R" : /^I|S\/I|I\/R|S\/I\/R/.test(c) ? "I" : "";
    return `<div class="table-wrap"><table class="tbl tbl--center"><thead><tr>${P[0].map(c => `<th>${P17.esc(c)}</th>`).join("")}</tr></thead>
      <tbody>${P.slice(1).map(r => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${P17.esc(c)}</th>` : `<td class="${cls(c)}">${P17.esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
      <p class="tbl-note">S : sensible ; I : sensible à forte exposition ou variable ; R : résistant. Phénotypes habituels, à confirmer par l'antibiogramme.</p>`;
  };
  P17.route(`${ROOT}/resistances`, {
    title: "Bactéries multirésistantes",
    render: () => P17.page({
      crumbs: [...base, ["Bactéries multirésistantes", `${ROOT}/resistances`]], title: "Bactéries multirésistantes", accent: "antibiotherapie", icon: "antibiotherapie",
      subtitle: "Fiches de synthèse : définition, mécanismes, phénotype, traitement de référence et par site.",
      body: P17.tiles(BMR.map(b => ({ href: `${ROOT}/resistances/${b.id}`, title: b.short, desc: b.title, icon: "fiche", accent: "antibiotherapie" })))
    })
  });
  BMR.forEach(b => {
    const path = `${ROOT}/resistances/${b.id}`;
    P17.route(path, {
      title: b.short,
      render: () => atbPage({
        path, crumb: b.short, parent: `${ROOT}/resistances`, parentLabel: "Bactéries multirésistantes", kicker: "Antibiorésistance", title: b.title,
        sections: [
          S("Définition", [b.definition]),
          S("Mécanismes", [{ ul: b.mecanisme }]),
          S("Épidémiologie", [b.epidemio]),
          ...(b.pheno ? [S("Phénotype habituel", [{ html: phenoTable(b.pheno) }], { wide: true })] : []),
          S("Antibiotiques de référence", [{ table: { head: ["Molécule", "Posologie", "Remarques"], rows: b.ref } }], { wide: true }),
          S("Choix selon le site ou le mécanisme", [{ table: { head: ["Situation", "Première intention", "Alternatives"], rows: b.sites } }], { wide: true }),
          ...(b.choc && b.choc.length ? [S("Choc septique : association", [{ table: { head: ["Molécule", "Posologie", "Remarques"], rows: b.choc } }], { wide: true, tone: "alert" })] : []),
          ...(b.notes && b.notes.length ? [S("À retenir", [{ ul: b.notes }], { tone: "key" })] : [])
        ],
        refs: ["Tamma PD et al. IDSA 2024 Guidance on the treatment of antimicrobial-resistant Gram-negative infections. Clin Infect Dis 2024", "EUCAST : tableaux de concentrations critiques (version en vigueur)", "Données de surveillance : Santé publique France, EARS-Net"]
      })
    });
    P17.index(path, `${b.short} — ${b.title}`, "BMR BHRe résistance " + b.title, SEC);
  });

  /* ---------- Multisensibles ---------- */
  P17.route(`${ROOT}/sensibles`, {
    title: "Bactéries multisensibles",
    render: () => atbPage({
      path: `${ROOT}/sensibles`, crumb: "Bactéries multisensibles", kicker: "Antibiothérapie documentée", title: "Bactéries multisensibles : antibiotique de référence",
      subtitle: "Traitement de première intention des souches sauvages, à adapter au site et à l'antibiogramme",
      sections: [S("Tableau de référence", [{ table: { head: ["Bactérie", "Référence", "Posologie", "Alternatives", "Remarques"], rows: window.P17_ATB_SENSIBLES || [] } }], { wide: true })],
      refs: ["EUCAST : règles d'expertise et résistances naturelles", "CA-SFM / EUCAST (version en vigueur)"]
    })
  });
  P17.index(`${ROOT}/sensibles`, "Bactéries multisensibles — antibiotique de référence", "staphylocoque streptocoque entérocoque listeria", SEC);

  /* ---------- Mécanismes, phénotypes et classifications ---------- */
  const H4 = t => ({ html: `<h4 class="blk-title">${t}</h4>` });
  // Grille de phénotypes : première ligne = en-têtes, cellules S / I / R colorées
  const grid = (P, note) => {
    const cls = c => /^S$|^S /.test(c) ? "S" : /^R$|^R /.test(c) ? "R" : /^I|S\/I|I\/R|S\/I\/R/.test(c) ? "I" : "";
    return { html: `<div class="table-wrap"><table class="tbl tbl--center"><thead><tr>${P[0].map(c => `<th>${c}</th>`).join("")}</tr></thead>
      <tbody>${P.slice(1).map(r => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${c}</th>` : `<td class="${cls(c)}">${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
      <p class="tbl-note">${note ? note + " " : ""}S : sensible ; S/I : habituellement sensible ; I : sensible à forte exposition ; I/R : habituellement résistant ; S/I/R : variable selon la souche ; R : résistant. Toujours confirmer par l'antibiogramme.</p>` };
  };
  // Arbre d'orientation : [libellé, [enfants]]
  const tree = node => {
    const li = ([t, kids]) => `<li><span>${t}</span>${kids && kids.length ? `<ul>${kids.map(li).join("")}</ul>` : ""}</li>`;
    return { html: `<ul class="tree">${li(node)}</ul>` };
  };
  P17.route(`${ROOT}/mecanismes`, {
    title: "Mécanismes de résistance",
    render: () => atbPage({
      path: `${ROOT}/mecanismes`, crumb: "Mécanismes et phénotypes", kicker: "Antibiorésistance", title: "Mécanismes et phénotypes de résistance",
      subtitle: "Bêta-lactamases, groupes naturels des entérobactéries, mécanismes par famille et phénotypes habituels",
      sections: [
      S("Classification des bêta-lactamases (Ambler)", [
        tbl(["", "Classe A", "Classe B", "Classe C", "Classe D"], [
          ["Type d'enzyme", "Sérine-protéase", "Métallo-bêta-lactamase (zinc)", "Sérine-protéase", "Sérine-protéase"],
          ["Enzymes", "Pénicillinases (TEM, SHV) ; BLSE (CTX-M) ; carbapénémase KPC", "Carbapénémases NDM, VIM, IMP", "Céphalosporinases AmpC, CMY", "Carbapénémases OXA-48, OXA-23, OXA-51 ; oxacillinases à spectre étroit (OXA-1)"],
          ["Bactéries", "Entérobactéries, BGN non fermentants", "Entérobactéries, BGN non fermentants", "Entérobactéries du groupe 3 (gène présent mais non exprimé dans le groupe 1)", "Entérobactéries, BGN non fermentants"],
          ["Antibiotiques hydrolysés", "Pénicillinase : pénicillines ; BLSE : + céphalosporines ; KPC : + carbapénèmes", "Toutes les bêta-lactamines sauf l'aztréonam", "Pénicillines, céphalosporines sauf céfépime", "Cloxacilline, céphalosporines, carbapénèmes"]
        ], "Les métallo-enzymes (classe B) ne sont pas inhibées par l'avibactam ; l'aztréonam reste actif sur elles s'il n'y a pas de BLSE associée.")
      ], { wide: true }),
      S("Groupes naturels des entérobactéries", [
        tbl(["Groupe", "Mécanisme naturel", "Bactéries", "Bêta-lactamines hydrolysées"], [
          ["0", "Aucune bêta-lactamase", "<em>Proteus mirabilis</em>, <em>Salmonella</em>", "Aucune"],
          ["1", "Céphalosporinase AmpC non exprimée", "<em>E. coli</em>, <em>Shigella</em>", "Aucune"],
          ["2", "Pénicillinase", "<em>K. pneumoniae</em>, <em>K. oxytoca</em>, <em>Citrobacter koseri</em>", "Pénicillines (sauf associées à un inhibiteur)"],
          ["3", "Céphalosporinase AmpC inductible", "<em>E. cloacae</em>, <em>K. aerogenes</em>, <em>Serratia</em>, <em>Morganella</em>, <em>C. freundii</em>, <em>Hafnia</em>, <em>Providencia</em>", "Pénicillines G et A, C1G, C2G ; C3G en cas d'hyperproduction (céphalosporinase de haut niveau)"],
          ["4", "Pénicillinase et céphalosporinase", "<em>Yersinia</em>", "Pénicillines, C1G, C2G"],
          ["5", "Céfuroximase", "<em>Proteus vulgaris</em>, <em>P. penneri</em>", "Pénicillines, C1G, C2G (sauf inhibiteurs et céfoxitine)"]
        ], "Groupe 3 : éviter les C3G même si l'antibiogramme les donne sensibles dans les infections graves (sélection de mutants hyperproducteurs) ; préférer le céfépime.")
      ], { wide: true }),
      S("Synthèse des mécanismes de résistance", [
        tbl(["Famille", "Inactivation enzymatique", "Modification de la cible", "Imperméabilité, efflux"], [
          ["Bêta-lactamines", "Pénicillinases (<em>blaZ</em> du staphylocoque ; TEM, SHV) ; céphalosporinases AmpC ; BLSE (TEM, SHV, CTX-M) ; carbapénémases (KPC, NDM, VIM, IMP, OXA-48, OXA-23, OXA-51)", "PLP2a (SARM) ; PLP mosaïques (pneumocoque) ; PLP3 (<em>H. influenzae</em>) ; PLP5 (entérocoques)", "Perte de la porine OprD et efflux MexAB-OprM (<em>P. aeruginosa</em>) ; AcrAB-TolC (<em>E. coli</em>)"],
          ["Aminosides", "Enzymes modificatrices : phénotypes K (APH-3'), KT (ANT-4'), KTG (AAC-6') chez le staphylocoque, les entérobactéries, <em>P. aeruginosa</em>", "Méthylases de l'ARN 16S (ArmA, RmtB, RmtC) : haut niveau à tous les aminosides", "MexXY-OprM (<em>P. aeruginosa</em>), AdeABC (<em>A. baumannii</em>), AcrD (<em>E. coli</em>)"],
          ["Fluoroquinolones", "Acétyltransférase AAC(6')-Ib-cr (entérobactéries)", "Mutations de <em>gyrA</em> et <em>parC</em> (topoisomérases) ; protection par Qnr", "Mutations des porines ; efflux QepA"],
          ["Glycopeptides", "—", "VanA, VanB : précurseur de paroi modifié (D-Ala-D-Lac)", "—"],
          ["Lipopeptides (daptomycine)", "—", "Modification de la charge de la membrane", "—"],
          ["Oxazolidinones (linézolide)", "—", "Mutations de l'ARN 23S ; méthylase Cfr ; protection OptrA, PoxtA", "—"],
          ["Macrolides", "Estérases (EreA, EreB), phosphotransférase MphA", "Méthylases Erm de l'ARN 23S (phénotype MLSb) ; mutations", "Efflux Mef (MefA, MefE)"],
          ["Cyclines", "Tet(X)", "Protection du ribosome Tet(M)", "Efflux Tet(K)"]
        ])
      ], { wide: true }),
      S("Cocci à Gram positif : phénotypes habituels", [
        grid([["Antibiotique", "<em>S. aureus</em> sauvage", "<em>S. aureus</em> pénicillinase", "SARM", "<em>S. epidermidis</em>", "<em>S. pneumoniae</em>", "<em>S. pyogenes</em>", "<em>E. faecalis</em>", "<em>E. faecium</em>", "ERV (VanA, VanB)"],
          ["Amoxicilline", "S", "R", "R", "S/I/R", "S/I", "S", "S", "R", "R"],
          ["Oxacilline, cloxacilline", "S", "S", "R", "S/I/R", "R", "R", "R", "R", "R"],
          ["Amoxicilline-clavulanate", "S", "S", "R", "S/I/R", "S", "S", "S", "R", "R"],
          ["Pipéracilline", "S", "R", "R", "S/I/R", "S", "S", "S", "R", "R"],
          ["Pipéracilline-tazobactam", "S", "S", "R", "S/I/R", "S", "S", "S", "R", "R"],
          ["C1G, C2G", "S", "S", "R", "S/I/R", "S", "S", "R", "R", "R"],
          ["C3G, C4G", "S", "S", "R", "S/I/R", "S", "S", "R", "R", "R"],
          ["C5G (ceftaroline, ceftobiprole)", "S", "S", "S", "S/I/R", "S", "S", "S (ceftobiprole)", "R", "R"],
          ["Carbapénèmes", "S", "S", "R", "S/I/R", "S", "S", "S", "R", "R"],
          ["Glycopeptides", "S", "S", "S", "S/I", "S", "S", "S", "S", "R"],
          ["Daptomycine", "S", "S", "S", "S", "S", "S", "S", "S/I", "S/I"],
          ["Linézolide", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
          ["Ofloxacine, ciprofloxacine", "S/I", "S/I", "R", "R", "R", "R", "R", "R", "R"],
          ["Lévofloxacine", "S", "S", "I/R", "S/I/R", "S", "S", "S", "R", "R"],
          ["Cotrimoxazole", "S", "S/I", "S/I", "S/I", "S/I", "S", "I/R", "R", "R"],
          ["Rifampicine", "S", "S/I", "S/I", "I/R", "S", "S", "S", "S", "I/R"],
          ["Tigécycline", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
          ["Macrolides", "S/I", "S/I", "I/R", "R", "S/I", "S/I", "R", "R", "R"]
        ], "Aminosides chez le staphylocoque : selon l'enzyme. Phénotype K (APH-3') : kanamycine et amikacine ; KT (ANT-4') : + tobramycine ; KTG (AAC-6'-APH-2'') : + gentamicine. Entérocoques : résistance naturelle de bas niveau aux aminosides, synergie conservée sauf haut niveau.")
      ], { wide: true }),
      S("Bacilles à Gram négatif sauvages : phénotypes habituels", [
        grid([["Antibiotique", "Entérobactéries groupes 0 et 1", "Entérobactéries groupe 2", "Entérobactéries groupe 3", "<em>P. aeruginosa</em>", "<em>A. baumannii</em>", "<em>S. maltophilia</em>", "<em>H. influenzae</em>", "<em>Legionella</em>"],
          ["Amoxicilline", "S", "R", "R", "R", "R", "R", "S", "R"],
          ["Amoxicilline-clavulanate", "S", "S", "R", "R", "R", "R", "S", "R"],
          ["Pipéracilline", "S", "S/I", "S/I/R", "S", "S", "R", "S", "R"],
          ["Pipéracilline-tazobactam", "S", "S", "S/I/R", "S", "S", "R", "S", "R"],
          ["C1G, C2G", "S", "S", "R", "R", "R", "R", "S/I", "R"],
          ["C3G", "S", "S", "S/I/R", "R (sauf ceftazidime)", "R (sauf ceftazidime)", "R (sauf ceftazidime)", "S", "R"],
          ["Céfépime", "S", "S", "S", "S", "S", "I/R", "S", "R"],
          ["Aztréonam", "S", "S", "S", "S", "R", "R", "S", "R"],
          ["Carbapénèmes", "S", "S", "S (imipénème I chez les Protéeae)", "S (sauf ertapénème)", "S", "I/R", "S", "R"],
          ["Ofloxacine", "S", "S", "S", "S/I", "S", "R", "S", "S"],
          ["Ciprofloxacine", "S", "S", "S", "S", "S", "R", "S", "S"],
          ["Lévofloxacine", "S", "S", "S", "S", "S", "S", "S", "S"],
          ["Amikacine", "S", "S", "S (sauf <em>Serratia</em>)", "S", "S", "R", "S", "R"],
          ["Tobramycine", "S", "S", "S (sauf <em>Serratia</em>)", "S", "S", "R", "S", "R"],
          ["Gentamicine", "S", "S", "S", "S/I", "S/I", "R", "S", "R"],
          ["Cotrimoxazole", "S", "S", "S", "R", "S/I", "S", "S/I", "R"],
          ["Colistine", "S (R : <em>Proteus</em>)", "S", "S (R : <em>Serratia</em>, <em>Morganella</em>)", "S", "S", "S/I", "S", "R"],
          ["Tigécycline", "S (sauf Protéeae)", "S", "S (sauf Protéeae)", "R", "S", "S", "S", "S"],
          ["Macrolides", "R", "R", "R", "R", "R", "R", "I/R", "S"]
        ])
      ], { wide: true }),
      S("Bacilles à Gram négatif producteurs de bêta-lactamases", [
        grid([["Antibiotique", "Pénicillinase bas niveau (TEM, SHV)", "Pénicillinase résistante aux inhibiteurs (TRI)", "AmpC naturelle", "AmpC hyperproduite", "BLSE (TEM, SHV, CTX-M)", "KPC (classe A)", "NDM, VIM, IMP (classe B)", "OXA-48 (classe D)"],
          ["Amoxicilline", "R", "R", "R", "R", "R", "R", "R", "R"],
          ["Amoxicilline-clavulanate", "S", "R", "R", "R", "S/I/R", "I/R", "R", "R"],
          ["Ticarcilline", "R", "R", "S", "R", "R", "R", "R", "R"],
          ["Pipéracilline", "I/R", "I/R", "S", "R", "R", "R", "R", "R"],
          ["Pipéracilline-tazobactam", "S", "I/R", "S", "I/R", "S/I/R", "I/R", "R", "R"],
          ["C1G, C2G", "S", "S", "I/R", "R", "R", "I/R", "R", "S"],
          ["Céfoxitine", "S", "S", "S/I/R", "R", "S", "I/R", "R", "S"],
          ["C3G", "S", "S", "S", "R", "I/R", "I/R", "R", "S"],
          ["Céfépime", "S", "S", "S", "S", "I/R", "I/R", "R", "S"],
          ["Aztréonam", "S", "S", "S/I/R", "R", "R", "I/R", "S", "S"],
          ["Carbapénèmes", "S", "S", "S", "S", "S", "I/R", "R", "S/I/R"],
          ["Témocilline", "S", "S", "S", "S", "S", "S/I/R", "—", "R"],
          ["Ceftazidime-avibactam", "S", "S", "S", "S", "S", "S", "I/R", "S"],
          ["Ceftolozane-tazobactam", "S", "S", "S", "S", "S", "S", "I/R", "S"],
          ["Imipénème-relebactam", "S", "S", "S", "S", "S", "S", "I/R", "S/I/R"],
          ["Céfidérocol", "S", "S", "S", "S", "S", "S", "S", "S"],
          ["Tigécycline", "S", "S", "S", "S", "S", "S", "S", "S"]
        ], "Pénicillinases : entérobactéries du groupe 2 et BGN non fermentants. AmpC : entérobactéries du groupe 3, CMY (<em>C. freundii</em>), DHA (<em>M. morganii</em>), ACC-1 (<em>Hafnia</em>). BLSE et carbapénémases : entérobactéries et BGN non fermentants, gènes plasmidiques (sauf SME de <em>Serratia marcescens</em>)."),
        { html: '<h4 class="blk-title">Entérobactéries productrices de carbapénémases : molécules actives</h4>' },
        grid([["Carbapénémase", "Ceftazidime-avibactam", "Imipénème-relebactam", "Méropénème-vaborbactam", "Céfidérocol", "Tigécycline"],
          ["KPC (classe A)", "S", "S", "S", "S", "S"],
          ["NDM, VIM (classe B)", "S (associé à l'aztréonam)", "R", "R", "S", "S"],
          ["OXA-48 (classe D)", "S", "R", "R", "S", "S"]
        ])
      ], { wide: true }),
      ]
    })
  });
  P17.route(`${ROOT}/bacteries`, {
    title: "Classification des bactéries",
    render: () => atbPage({
      path: `${ROOT}/bacteries`, crumb: "Classification des bactéries", kicker: "Antibiothérapie", title: "Classification des bactéries",
      subtitle: "Orientation au laboratoire, sites infectieux, identification et antibiothérapie de première intention",
      sections: [
      S("Bactéries à Gram positif", [
        H4("Orientation au laboratoire"),
        tree(["<b>Gram positif</b> : paroi épaisse de peptidoglycane, pas de membrane externe", [
          ["<b>Cocci</b>", [
            ["Catalase + : <b>staphylocoques</b>", [["Coagulase + : <em>S. aureus</em>"], ["Coagulase − : staphylocoques blancs (<em>S. epidermidis</em> ; <em>S. saprophyticus</em> résistant à la novobiocine)"]]],
            ["Catalase − : <b>streptocoques et entérocoques</b>", [
              ["Hémolyse α (partielle) : <em>S. pneumoniae</em> (sensible à l'optochine), streptocoques viridans (<em>S. mutans</em>, <em>S. oralis</em>)"],
              ["Hémolyse β (complète) : <em>S. pyogenes</em> (groupe A), <em>S. agalactiae</em> (groupe B)"],
              ["Pas d'hémolyse (γ) : entérocoques (groupe D : <em>E. faecalis</em>, <em>E. faecium</em>), <em>S. gallolyticus</em> (<em>bovis</em>)"]]]]],
          ["<b>Bacilles</b>", [["Aérobies : <em>Listeria</em>, <em>Bacillus</em>, <em>Corynebacterium</em>"], ["Anaérobies : <em>Clostridium</em>, <em>Clostridioides difficile</em>"]]],
          ["<b>Filaments ramifiés</b>", [["Aérobies : <em>Nocardia</em> (faiblement acido-alcoolo-résistant)"], ["Anaérobies : <em>Actinomyces</em>"]]]]]),
        H4("Principales bactéries"),
        tbl(["Bactérie", "Infections", "Identification", "Antibiothérapie"], [
          ["Staphylocoques (<em>S. aureus</em>, staphylocoques blancs)", "Peau, os et articulations, bactériémies, endocardites, site opératoire, matériel ; pneumonies (<em>S. aureus</em>)", "Cocci en amas ; MALDI-TOF ; PCR <em>mecA</em>, toxines (TSST-1, PVL)", "Méti-S : oxacilline, cloxacilline, céfazoline. Méti-R : vancomycine, linézolide, daptomycine, cotrimoxazole, ceftobiprole"],
          ["Streptocoques (<em>S. pyogenes</em>, <em>S. agalactiae</em>, <em>S. pneumoniae</em>)", "<em>S. pyogenes</em> : peau, ORL, dermohypodermites nécrosantes. <em>S. agalactiae</em> : materno-fœtales. <em>S. pneumoniae</em> : pneumonies, ORL, méningites", "Cocci en chaînettes ; MALDI-TOF ; antigène urinaire pneumocoque, test rapide", "Amoxicilline (C3G en probabiliste ; C3G si sensibilité diminuée à l'amoxicilline) ; allergie : lévofloxacine"],
          ["Entérocoques (<em>E. faecalis</em>, <em>E. faecium</em>)", "Urinaires, abdominales, bactériémies, endocardites", "Cocci ovales en courtes chaînettes ; MALDI-TOF", "<em>E. faecalis</em> : amoxicilline. <em>E. faecium</em> : vancomycine, linézolide, daptomycine. Résistance naturelle aux céphalosporines (sauf ceftobiprole)"],
          ["<em>Clostridioides difficile</em>", "Colites pseudo-membraneuses, diarrhées post-antibiotiques", "Antigène GDH et toxines (<em>tcdA</em>, <em>tcdB</em>, toxine binaire)", "Fidaxomicine en première intention ; vancomycine orale"],
          ["<em>Listeria monocytogenes</em>", "Materno-fœtales, méningo-encéphalites, bactériémies", "Bacilles isolés ou en courtes chaînettes ; MALDI-TOF ; PCR", "Amoxicilline + gentamicine ; cotrimoxazole en alternative. Résistance naturelle aux céphalosporines"],
          ["<em>Nocardia</em>", "Pulmonaires (nodules, abcès), cérébrales, cutanées ; immunodéprimés", "Bacilles filamenteux ramifiés ; MALDI-TOF ; PCR ARN 16S, <em>hsp65</em>", "Association de deux molécules parmi imipénème, céfotaxime, amikacine, cotrimoxazole, selon l'espèce"]
        ])
      ], { wide: true }),
      S("Bactéries à Gram négatif", [
        H4("Orientation au laboratoire"),
        tree(["<b>Gram négatif</b> : fine paroi de peptidoglycane entourée d'une membrane externe (porines, efflux)", [
          ["<b>Diplocoques</b> : <em>N. meningitidis</em>, <em>N. gonorrhoeae</em>, <em>Moraxella catarrhalis</em>"],
          ["<b>Coccobacilles</b> : <em>H. influenzae</em>, <em>Bordetella</em>, <em>Pasteurella</em>, <em>Brucella</em>, <em>Francisella</em>"],
          ["<b>Bacilles</b>", [
            ["Fermentant le lactose (entérobactéries) : rapides (<em>E. coli</em>, <em>Klebsiella</em>, <em>Enterobacter</em>) ou lents (<em>Citrobacter</em>, <em>Serratia</em>)"],
            ["Ne fermentant pas le lactose", [
              ["Oxydase + : <em>Pseudomonas</em>"],
              ["Oxydase − : <em>Acinetobacter</em>, <em>Stenotrophomonas</em> ; entérobactéries H₂S + (<em>Salmonella</em>, <em>Proteus</em>) ou H₂S − (<em>Shigella</em>, <em>Yersinia</em>)"]]]]],
          ["<b>Bacilles incurvés</b>, oxydase + : <em>Campylobacter</em> (42 °C), <em>Vibrio</em> (milieu alcalin), <em>Helicobacter</em> (uréase)"]]]),
        H4("Principales bactéries"),
        tbl(["Bactérie", "Infections", "Identification", "Antibiothérapie"], [
          ["Entérobactéries groupes 0 et 1 (<em>E. coli</em>, <em>P. mirabilis</em>, <em>Salmonella</em>)", "Abdominales, urinaires", "Bacilles, oxydase − ; MALDI-TOF ; bêta-lactamase rapide", "Probabiliste : C3G si test de bêta-lactamase négatif, carbapénème s'il est positif. Documenté : amoxicilline si sauvage"],
          ["Entérobactéries groupe 2 (<em>K. pneumoniae</em>, <em>K. oxytoca</em>, <em>C. koseri</em>)", "Bactériémies, pneumonies acquises sous ventilation ; plus rarement peau, méningites nosocomiales", "Idem", "Probabiliste : idem. Documenté : amoxicilline-clavulanate ou C3G si sauvage"],
          ["Entérobactéries groupe 3 (<em>E. cloacae</em>, <em>K. aerogenes</em>, <em>C. freundii</em>, <em>S. marcescens</em>, <em>M. morganii</em>, <em>Hafnia</em>, <em>Providencia</em>)", "Infections nosocomiales de réanimation", "Idem", "Probabiliste : céfépime si test négatif, carbapénème s'il est positif. Documenté : céfépime"],
          ["<em>Pseudomonas aeruginosa</em>", "Pneumonies, bactériémies, urinaires, matériel ; BPCO, mucoviscidose", "Bacille aérobie strict, oxydase +", "Céfépime, ceftazidime ou pipéracilline-tazobactam, puis adaptation à l'antibiogramme"],
          ["<em>Acinetobacter baumannii</em>", "Pneumonies, urinaires, plaies, bactériémies", "Coccobacille, oxydase −", "Imipénème ou méropénème ± amikacine selon l'antibiogramme"],
          ["<em>Stenotrophomonas maltophilia</em>", "Pneumonies, bactériémies sur cathéter", "Bacille, oxydase −", "Cotrimoxazole, associé en probabiliste à la lévofloxacine ou à la ceftazidime"],
          ["<em>Neisseria meningitidis</em>, <em>N. gonorrhoeae</em>", "Méningites, bactériémies ; gonococcies uro-génitales, arthrites", "Diplocoques ; antigènes capsulaires (CNR)", "C3G ; amoxicilline si sensible"],
          ["<em>Moraxella catarrhalis</em>", "ORL, pneumonies", "Diplocoque", "Amoxicilline-clavulanate (pénicillinase dans 95 % des cas)"],
          ["<em>Haemophilus influenzae</em>", "Méningites, pneumonies, bactériémies ; otites, sinusites, bronchites", "Petits coccobacilles", "C3G ; amoxicilline ou amoxicilline-clavulanate selon l'antibiogramme"],
          ["Groupe HACEK", "Endocardites, abcès cérébraux et dentaires", "Croissance lente et difficile", "C3G"],
          ["<em>Legionella pneumophila</em>", "Pneumonies (fièvre de Pontiac : forme pseudo-grippale)", "Antigène urinaire (sérogroupe 1), PCR ; culture difficile", "Lévofloxacine ou macrolide (spiramycine IV, azithromycine)"]
        ])
      ], { wide: true }),
      S("Bactéries atypiques et intracellulaires", [
        tbl(["Bactérie", "Infections", "Diagnostic", "Antibiothérapie"], [
          ["<em>Mycoplasma pneumoniae</em>", "Pneumonies, signes extra-pulmonaires", "PCR (multiplex)", "Macrolides, fluoroquinolones, cyclines. Résistance naturelle aux bêta-lactamines"],
          ["<em>Chlamydia pneumoniae</em>, <em>C. psittaci</em>, <em>C. trachomatis</em>", "Pneumonies interstitielles ; infections génitales (<em>C. trachomatis</em>)", "Sérologie, PCR", "Macrolides, fluoroquinolones, doxycycline"],
          ["<em>Coxiella burnetii</em> (fièvre Q)", "Fièvre, hépatite, pneumonie, endocardite, myocardite, méningite", "Sérologie (PCR peu sensible)", "Doxycycline ± hydroxychloroquine ; fluoroquinolone si atteinte neuro-méningée"],
          ["<em>Rickettsia</em>", "Fièvre, vascularite systémique, fuite capillaire", "Sérologie", "Doxycycline"],
          ["<em>Leptospira interrogans</em>", "Fièvre, atteintes hépatique, rénale, méningée, cardiaque, pulmonaire, hématologique", "PCR, sérologie", "Amoxicilline ou doxycycline ; C3G dans les formes graves"],
          ["<em>Borrelia burgdorferi</em> (Lyme)", "Érythème migrant, puis atteintes cardiaque, neurologique, articulaire", "Sérologie ± PCR", "Amoxicilline ou doxycycline ; C3G si atteinte neurologique ou cardiaque"],
          ["<em>Treponema pallidum</em> (syphilis)", "Chancre, puis formes secondaire et tertiaire", "Sérologie (TPHA, VDRL)", "Benzathine pénicilline G IM"]
        ])
      ], { wide: true }),
      ]
    })
  });
  P17.route(`${ROOT}/antibiotiques`, {
    title: "Familles d'antibiotiques",
    render: () => atbPage({
      path: `${ROOT}/antibiotiques`, crumb: "Familles d'antibiotiques", kicker: "Antibiothérapie", title: "Familles d'antibiotiques",
      subtitle: "Mécanismes d'action, PK/PD, spectre, posologies usuelles et effets indésirables",
      sections: [
      S("Mécanismes d'action", [
        tbl(["Cible", "Familles"], [
          ["Synthèse de la paroi", "Bêta-lactamines, glycopeptides"],
          ["Membrane cytoplasmique", "Polymyxines (colistine), daptomycine"],
          ["Ribosome, sous-unité 30S (ARN 16S)", "Aminosides, cyclines"],
          ["Ribosome, sous-unité 50S (ARN 23S)", "Macrolides et apparentés, oxazolidinones"],
          ["Synthèse de l'ARN", "Rifampicine, fidaxomicine"],
          ["ADN", "Fluoroquinolones (topoisomérases), métronidazole"],
          ["Métabolisme de l'acide folique", "Sulfamides, triméthoprime (cotrimoxazole)"]
        ])
      ]),
      S("Paramètres PK/PD", [
        tbl(["Bactéricidie", "Objectif", "Familles", "Conséquence pratique"], [
          ["Concentration-dépendante", "Cmax / CMI de 8 à 10", "Aminosides, métronidazole, fluoroquinolones (Gram −), daptomycine", "Dose unique journalière forte"],
          ["AUC-dépendante", "AUC / CMI au-dessus d'un seuil", "Vancomycine, fluoroquinolones, daptomycine", "Dose totale adaptée à l'exposition (dosages)"],
          ["Temps-dépendante", "Concentration > 4 × CMI pendant 100 % de l'intervalle", "Bêta-lactamines, fluoroquinolones (Gram +), macrolides, oxazolidinones, cyclines", "Dose de charge puis perfusion prolongée ou continue"]
        ])
      ], { wide: true }),
      S("Bêta-lactamines", [
        tbl(["Classe", "Molécules", "Spectre", "Particularités"], [
          ["Pénicillines G et V", "Pénicilline G, benzathine pénicilline, pénicilline V", "Cocci Gram + (hors pénicillinase), spirochètes", "Syphilis ; prophylaxie du splénectomisé (pénicilline V)"],
          ["Aminopénicillines", "Amoxicilline, ampicilline", "Idem + certains Gram − (entérobactéries du groupe 1, <em>H. influenzae</em>), <em>Listeria</em>, <em>E. faecalis</em>", "—"],
          ["Pénicillines M", "Oxacilline, cloxacilline", "Staphylocoque méti-S", "—"],
          ["Carboxy- et uréidopénicillines", "Pipéracilline, témocilline", "Idem amoxicilline + <em>P. aeruginosa</em> (pas la témocilline)", "Témocilline : stable vis-à-vis des BLSE"],
          ["Associations à un inhibiteur", "Amoxicilline-clavulanate, pipéracilline-tazobactam", "Bactéries productrices de pénicillinase, anaérobies", "Diffusion méningée insuffisante"],
          ["C1G", "Céfazoline", "Streptocoques, staphylocoque méti-S, entérobactéries des groupes 1 et 2", "Antibioprophylaxie chirurgicale"],
          ["C2G", "Céfoxitine, céfuroxime", "Idem + certains anaérobies (céfoxitine)", "Céfoxitine : stable vis-à-vis des BLSE (pas de l'AmpC)"],
          ["C3G", "Céfotaxime, ceftriaxone, ceftazidime (IV) ; céfixime (oral)", "Streptocoques, staphylocoque méti-S (céfotaxime), <em>Neisseria</em>, entérobactéries sauf AmpC hyperproduite et BLSE", "Ceftazidime : active sur <em>P. aeruginosa</em>, faible sur les Gram +"],
          ["C4G", "Céfépime", "Idem C3G + entérobactéries du groupe 3, <em>P. aeruginosa</em>", "Neurotoxicité si insuffisance rénale"],
          ["C5G et nouvelles associations", "Ceftaroline, ceftobiprole ; ceftolozane-tazobactam, ceftazidime-avibactam", "Ceftaroline, ceftobiprole : + SARM. Ceftolozane-tazobactam : <em>P. aeruginosa</em> multirésistant", "Réserver aux BMR documentées"],
          ["Carbapénèmes", "Imipénème, méropénème, ertapénème", "Très large : tous sauf SARM, <em>S. maltophilia</em>, <em>E. faecium</em> ; ertapénème inactif sur <em>P. aeruginosa</em> et <em>Acinetobacter</em>", "Imipénème : épileptogène, effet post-antibiotique sur les BGN. Épargne indispensable"],
          ["Monobactam", "Aztréonam", "BGN uniquement (inactif si BLSE)", "Pas d'allergie croisée avec les pénicillines (sauf ceftazidime)"]
        ], "Effets indésirables communs : allergie (0,3 à 5 % ; croisée pénicilline-céphalosporine < 5 %), neurotoxicité (surdosage, insuffisance rénale), néphrite interstitielle, troubles digestifs, <em>C. difficile</em> ; cytopénies.")
      ], { wide: true }),
      S("Aminosides", [
        tbl(["Molécule", "Posologie (1 injection/j)", "Spectre", "Résiduelle cible"], [
          ["Gentamicine", "3 à 8 mg/kg IV", "Meilleure activité sur les cocci Gram + (staphylocoques, streptocoques, entérocoques en synergie), entérobactéries, <em>Listeria</em>", "< 0,5 mg/L"],
          ["Amikacine", "25 à 30 mg/kg IV", "BGN dont <em>P. aeruginosa</em>, <em>Acinetobacter</em>, <em>Providencia</em> ; résistances plus fréquentes chez les Gram +", "< 2,5 mg/L"],
          ["Tobramycine", "3 à 8 mg/kg IV ; inhalée 300 mg × 2/j", "Idem, meilleure sur <em>P. aeruginosa</em>", "< 0,5 mg/L"]
        ], "Inactifs sur les anaérobies, les bactéries intracellulaires, <em>S. maltophilia</em>, <em>B. cepacia</em>. Toxicité rénale (tubulaire) et cochléo-vestibulaire irréversible : durée courte (1 à 3 jours), pas d'association néphrotoxique, résiduelle avant réinjection.")
      ], { wide: true }),
      S("Fluoroquinolones", [
        tbl(["Molécule", "Posologie (IV ou orale)", "Spectre"], [
          ["Ofloxacine", "200 mg × 2/j", "Entérobactéries, staphylocoque méti-S, intracellulaires"],
          ["Ciprofloxacine", "400 mg × 2 à 3/j IV ; 500 à 750 mg × 2/j per os", "Idem + <em>P. aeruginosa</em> (la plus active)"],
          ["Lévofloxacine", "500 mg × 1 à 2/j", "Idem + pneumocoque, <em>S. maltophilia</em>, <em>Legionella</em>"],
          ["Moxifloxacine", "400 mg/j", "Idem + anaérobies, mycobactéries ; inactive sur <em>P. aeruginosa</em>"],
          ["Délafloxacine", "300 mg × 2/j IV ; 450 mg × 2/j per os", "Idem + SARM"]
        ], "Biodisponibilité orale excellente : relais per os précoce. Effets indésirables : confusion, convulsions, tendinopathies, allongement du QT, photosensibilité, dysglycémies, anévrisme aortique. Sélection rapide de résistances : jamais en monothérapie sur <em>S. aureus</em>.")
      ], { wide: true }),
      S("Macrolides et apparentés", [
        tbl(["Molécule", "Posologie", "Spectre"], [
          ["Spiramycine", "3 MUI × 3/j IV ou per os", "Intracellulaires (<em>Mycoplasma</em>, <em>Chlamydia</em>, <em>Legionella</em>), streptocoques, <em>Campylobacter</em>"],
          ["Azithromycine", "500 mg/j per os ou IV", "Idem"],
          ["Clarithromycine", "500 mg × 2/j per os ou IV", "Idem + <em>Helicobacter pylori</em>"],
          ["Clindamycine (lincosamide)", "600 à 900 mg × 3/j IV ou per os", "Staphylocoques, streptocoques, anaérobies, toxoplasme ; effet anti-toxinique (choc toxique, fasciite)"],
          ["Pristinamycine (synergistine)", "1 g × 3/j per os", "Staphylocoques, streptocoques, anaérobies"]
        ], "Effets indésirables : troubles digestifs, allongement du QT, hépatotoxicité, inhibition enzymatique (CYP3A4, sauf spiramycine et azithromycine) ; <em>C. difficile</em> (clindamycine).")
      ], { wide: true }),
      S("Anti-Gram positif", [
        tbl(["Molécule", "Posologie", "Spectre", "Effets indésirables"], [
          ["Vancomycine", "Charge 25 à 30 mg/kg, puis 30 à 40 mg/kg/j en continu (cible 20–25 mg/L) ; per os 125 mg × 4/j (<em>C. difficile</em>)", "Cocci et bacilles Gram + (hors VanA, VanB)", "Red man syndrome (perfusion rapide), néphrotoxicité, ototoxicité, neutropénie, veinotoxicité"],
          ["Teicoplanine", "Charge 6 à 12 mg/kg × 2/j pendant 3 à 5 injections, puis 6 à 12 mg/kg/j", "Idem (inactive sur VanA)", "Moins néphrotoxique"],
          ["Linézolide", "600 mg × 2/j IV ou per os, sans adaptation rénale", "Tous les Gram + dont SARM et ERV ; effet anti-toxinique", "Thrombopénie et neutropénie (> 10 jours), neuropathie, acidose lactique, syndrome sérotoninergique"],
          ["Daptomycine", "8 à 12 mg/kg/j IV ; toutes les 48 h si DFG < 30 mL/min", "Tous les Gram + ; inactive dans le poumon (inactivée par le surfactant)", "Rhabdomyolyse (CPK hebdomadaires), pneumopathie à éosinophiles"]
        ])
      ], { wide: true }),
      S("Autres antibiotiques", [
        tbl(["Molécule", "Posologie", "Spectre", "Effets indésirables"], [
          ["Métronidazole", "500 mg × 3/j IV ou per os", "Anaérobies stricts, certains protozoaires", "Neurotoxicité (cure longue), effet antabuse, troubles digestifs"],
          ["Cotrimoxazole", "Sulfaméthoxazole 80 à 100 mg/kg/j + triméthoprime 16 à 20 mg/kg/j (IV ou per os), dose maximale 12 à 15 ampoules/j", "Gram + et −, nombreuses résistances acquises. Indications : <em>S. maltophilia</em>, <em>Pneumocystis</em>, <em>Listeria</em>, toxoplasmose", "Agranulocytose, hyperkaliémie, néphrotoxicité, Lyell et Stevens-Johnson, hépatotoxicité"],
          ["Tigécycline", "100 mg puis 50 mg × 2/j IV", "Large, sauf <em>P. aeruginosa</em> et Protéeae (<em>Proteus</em>, <em>Morganella</em>, <em>Providencia</em>) ; faibles concentrations sériques", "Troubles digestifs, hépatotoxicité, photosensibilité, pancréatite"],
          ["Rifampicine", "10 à 30 mg/kg/j selon l'indication, toujours en association", "Gram +, intracellulaires, mycobactéries ; biofilm (matériel)", "Hépatotoxicité, inducteur enzymatique puissant, syndrome pseudo-grippal"],
          ["Colistine", "IV : 9 MUI en charge puis 4,5 MUI × 2/j (adaptée au DFG) ; inhalée 2 MUI × 2 à 3/j", "<em>P. aeruginosa</em>, <em>A. baumannii</em>, entérobactéries (Protéeae, <em>Serratia</em> naturellement résistants)", "Néphrotoxicité, neurotoxicité"]
        ])
      ], { wide: true }),
      ]
    })
  });
  P17.redirect(`${ROOT}/classifications`, `${ROOT}/bacteries`);
  P17.index(`${ROOT}/mecanismes`, "Mécanismes et phénotypes de résistance", "Ambler bêta-lactamases BLSE AmpC céphalosporinase carbapénémases KPC NDM OXA-48 groupes entérobactéries phénotypes efflux porines", SEC);
  P17.index(`${ROOT}/bacteries`, "Classification des bactéries", "Gram positif négatif cocci bacilles staphylocoque streptocoque entérocoque entérobactéries Pseudomonas Acinetobacter Stenotrophomonas Listeria Legionella intracellulaires", SEC);
  P17.index(`${ROOT}/antibiotiques`, "Familles d'antibiotiques", "mécanisme d'action PK/PD bêta-lactamines céphalosporines carbapénèmes aminosides fluoroquinolones macrolides vancomycine linézolide daptomycine métronidazole cotrimoxazole tigécycline colistine", SEC);

  /* ---------- Durées ---------- */
  P17.route(`${ROOT}/durees`, {
    title: "Durées d'antibiothérapie",
    render: () => atbPage({
      path: `${ROOT}/durees`, crumb: "Durées", kicker: "Antibiothérapie", title: "Durées d'antibiothérapie",
      subtitle: "Durées totales usuelles, à partir du début d'un traitement efficace et après contrôle de la source",
      tags: ["Raccourcir dès que possible", "Réévaluation à 48–72 h"],
      sections: (window.P17_ATB_DUREES || []).map(([cat, rows]) => S(cat, [{ table: { head: ["Situation", "Durée", "Remarque"], rows } }], { wide: true })),
      refs: ["SPILF 2021 : Durées d'antibiothérapie dans les infections bactériennes courantes", "HAS : Choix et durées d'antibiothérapies préconisées", "BALANCE Investigators. 7 versus 14 days for bloodstream infections. N Engl J Med 2025", "Delgado V et al. ESC 2023 endocarditis guidelines"]
    })
  });
  P17.index(`${ROOT}/durees`, "Durées d'antibiothérapie", "jours combien de temps arrêt", SEC);

  /* ---------- Adaptation rénale ---------- */
  const R = window.P17_ATB_REIN || {}; const COLS = window.P17_ATB_REIN_COLS || [];
  const molOpts = []; Object.entries(R).forEach(([fam, mols]) => Object.keys(mols).forEach(m => molOpts.push([`${fam}::${m}`, `${m} (${fam})`])));
  const reinTool = P17.calc({
    id: "atbRein", title: "Posologie selon la fonction rénale", kind: "tool",
    fields: [{ id: "mol", label: "Molécule", type: "select", options: molOpts }, { id: "fct", label: "Fonction rénale", type: "select", options: COLS.slice(1), value: "30-120" }],
    compute: v => {
      const [fam, m] = (v.mol || "").split("::"); const d = R[fam] && R[fam][m];
      if (!d) return null;
      const lab = (COLS.find(c => c[0] === v.fct) || [])[1];
      return { label: m, main: d[v.fct] || "—", sub: `${lab} — dose de charge : ${d.charge}`, html: `<p class="out-sub">La dose de charge n'est jamais réduite en cas d'insuffisance rénale. Dosages plasmatiques recommandés si DFG < 30 mL/min ou EER.</p>` };
    }
  });
  P17.route(`${ROOT}/adaptation-renale`, {
    title: "Adaptation rénale",
    render: () => atbPage({
      path: `${ROOT}/adaptation-renale`, crumb: "Adaptation rénale", kicker: "Antibiothérapie", title: "Adaptation des posologies à la fonction rénale",
      subtitle: "Insuffisance rénale, hyperclairance, hémodialyse intermittente et EER continue", tool: reinTool,
      sections: [
        S("Principes", [{ ul: ["Dose de charge pleine dès la première injection, quelle que soit la fonction rénale", "Hyperclairance (DFG > 120–130 mL/min : sujet jeune, traumatisé, brûlé, sepsis) : risque de sous-dosage, perfusion prolongée ou continue des bêta-lactamines", "Insuffisance rénale aiguë instable : réévaluer la posologie chaque jour, éviter les sous-dosages des 48 premières heures", "Suivi thérapeutique pharmacologique dès que disponible"] }]),
        S("Tableau complet", Object.entries(R).map(([fam, mols]) => ({ title: fam, table: { head: COLS.map(c => c[1]).map((h, i) => i === 0 ? "Molécule / charge" : h), rows: Object.entries(mols).map(([m, d]) => [`${m}<br><span class="tbl-note">${d.charge}</span>`, ...COLS.slice(1).map(c => d[c[0]] || "—")]) } })), { wide: true })
      ],
      refs: ["D'après le travail des Drs G. Troche, M. Paul et A. Brizard (bases ANSM, GPR et Dexther), révisé selon les RCP en vigueur", "Guilhaumou R et al. SFPT-SFAR : optimisation du traitement par bêta-lactamines en soins critiques. Crit Care 2019"]
    })
  });
  P17.index(`${ROOT}/adaptation-renale`, "Adaptation des antibiotiques à la fonction rénale", "insuffisance rénale dialyse CVVH posologie DFG", SEC);

  /* ---------- Modalités ---------- */
  P17.route(`${ROOT}/modalites`, {
    title: "Modalités d'administration",
    render: () => atbPage({
      path: `${ROOT}/modalites`, crumb: "Modalités d'administration", kicker: "Antibiothérapie", title: "Modalités d'administration des antibiotiques",
      subtitle: "Dose de charge, perfusion prolongée ou continue, dilution et stabilité",
      tags: ["PK/PD", "Bêta-lactamines temps-dépendantes", "Aminosides concentration-dépendants"],
      sections: [
        S("Principes PK/PD", [{ ul: ["Bêta-lactamines (temps-dépendantes) : dose de charge puis perfusion prolongée (3–4 h) ou continue ; objectif concentration > 4 × CMI pendant 100 % de l'intervalle", "Aminosides (concentration-dépendants) : dose unique journalière forte, pic ≥ 8–10 × CMI, durée courte (1–3 j)", "Glycopeptides : perfusion continue après charge, dosage du plateau", "Vérifier la stabilité avant toute perfusion continue (seringues renouvelées selon la stabilité)"] }], { wide: true }),
        ...(window.P17_ATB_MODA || []).map(([fam, rows]) => S(fam, [{ table: { head: ["Molécule", "Dose de charge", "Entretien", "Solvant", "Stabilité / remarques"], rows } }], { wide: true }))
      ],
      refs: ["Guilhaumou R et al. Optimization of the treatment with beta-lactam antibiotics in critically ill patients — SFPT-SFAR guidelines. Crit Care 2019", "Résumés des caractéristiques du produit (RCP)"]
    })
  });
  P17.index(`${ROOT}/modalites`, "Modalités d'administration des antibiotiques", "perfusion continue prolongée dilution stabilité dose de charge", SEC);
})();
