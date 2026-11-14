/* =====================================================================
   Échographie : ETT, échographie pleuro-pulmonaire et
   diaphragmatique (fiche + outils : score LUS, volume d'épanchement,
   diaphragme), échographie générale.
   ===================================================================== */
(function () {
  const SEC = "Échographie";
  const FG = n => `assets/img/echo/fig/${n}.webp`;
  // Dimensions des schémas (évite les sauts de mise en page au chargement)
  const DIM = {"base-doppler-couleur":[640,300],"base-doppler-pulse":[640,260],"base-echogenicite":[640,260],"base-miroir":[640,400],"base-ombre-renforcement":[640,360],"base-reverberation":[640,480],"dia-epaisseur":[646,320],"dia-sous-costale":[640,480],"dia-tm-course":[640,320],"pp-condensation":[640,480],"pp-epanchement":[640,480],"pp-lignes-a":[640,480],"pp-lignes-b":[640,480],"pp-lus-0":[320,240],"pp-lus-1":[320,240],"pp-lus-2":[320,240],"pp-lus-3":[320,240],"pp-poumon-blanc":[640,480],"pp-tm-bord-de-mer":[640,300],"pp-tm-code-barres":[640,300],"pp-tm-point-poumon":[640,300],"pp-tm-sinusoide":[640,300]};
  const figs = (list, cols) => ({ figs: list.map(([n, c]) => ({ img: FG(n), caption: c, w: (DIM[n] || [])[0], h: (DIM[n] || [])[1] })), cols });
  const base = [[SEC, "#/echographie"]];
  const { S, ul, ult, kv, tbl, warn, info, ok, danger } = P17.h;
  const F = window.P17Calc;
  const f = P17.fmt;


  /* ---------------- Outil 1 : score LUS (12 régions) ---------------- */
  const ZONES = [
    ["da1", "Antérieure supérieure"], ["da2", "Antérieure inférieure"],
    ["dl1", "Latérale supérieure"], ["dl2", "Latérale inférieure"],
    ["dp1", "Postérieure supérieure"], ["dp2", "Postérieure inférieure"]
  ];
  const COTE = [0, 1, 2, 3].map(n => [String(n), String(n)]);
  const lusFields = [
    { id: "ctx", label: "Contexte", type: "seg", full: true, options: [["sevrage", "Fin d'épreuve de VS"], ["suivi", "Suivi de l'aération"]] },
    ...ZONES.map(([id, l], i) => ({ id, label: l, type: "seg", options: COTE, value: "0", heading: i === 0 ? "Hémithorax droit" : "" })),
    ...ZONES.map(([id, l], i) => ({ id: id.replace(/^d/, "g"), label: l, type: "seg", options: COTE, value: "0", heading: i === 0 ? "Hémithorax gauche" : "" }))
  ];
  const lusTool = P17.calc({
    id: "lus", kind: "tool", cls: "calc--lus", title: "Score d'aération pulmonaire (LUS)",
    desc: "Coter chaque région selon l'aspect le plus péjoratif observé : 0 lignes A (ou ≤ 2 lignes B), 1 lignes B multiples espacées, 2 lignes B coalescentes, 3 condensation.",
    fields: lusFields,
    compute(v) {
      const ids = ZONES.map(z => z[0]);
      const d = ids.map(id => P17.num(v[id]));
      const g = ids.map(id => P17.num(v[id.replace(/^d/, "g")]));
      const all = F.lus([...d, ...g]);
      if (!all) return null;
      const sum = a => a.reduce((x, y) => x + (y || 0), 0);
      const ant = sum([d[0], d[1], g[0], g[1]]), lat = sum([d[2], d[3], g[2], g[3]]), post = sum([d[4], d[5], g[4], g[5]]);
      const cons = [...d.map((x, i) => x === 3 ? `droite ${ZONES[i][1].toLowerCase()}` : null), ...g.map((x, i) => x === 3 ? `gauche ${ZONES[i][1].toLowerCase()}` : null)].filter(Boolean);
      let tone = "ok", sub;
      if (v.ctx === "sevrage") {
        if (all.total < 13) sub = "Score < 13 en fin d'épreuve de ventilation spontanée : risque faible de détresse respiratoire après extubation.";
        else if (all.total <= 17) { tone = "warn"; sub = "Score de 13 à 17 : zone intermédiaire, à confronter à la clinique, à l'échographie cardiaque (E/e') et diaphragmatique."; }
        else { tone = "danger"; sub = "Score > 17 : risque élevé de détresse respiratoire après extubation (Soummer 2012). Rechercher et traiter la cause de la perte d'aération."; }
      } else {
        tone = all.total >= 18 ? "danger" : all.total >= 10 ? "warn" : "ok";
        sub = "Comparer à l'examen précédent dans les mêmes conditions (position, PEEP) : la variation du score suit la perte ou le gain d'aération.";
      }
      return {
        label: "Score LUS", main: `${all.total} / 36`, sub, tone,
        rows: [["Hémithorax droit", `${sum(d)} / 18`], ["Hémithorax gauche", `${sum(g)} / 18`], ["Régions antérieures", `${ant} / 12`], ["Régions latérales", `${lat} / 12`], ["Régions postérieures", `${post} / 12`]],
        html: cons.length ? `<p class="out-sub">Condensations : ${cons.join(", ")}.${post > ant + 3 ? " Perte d'aération à prédominance postérieure et déclive, typique des atélectasies postopératoires." : ""}</p>` : (post > ant + 3 ? `<p class="out-sub">Perte d'aération à prédominance postérieure et déclive.</p>` : "")
      };
    },
    note: "<p>Régions : chaque hémithorax est divisé par les lignes parasternale, axillaire antérieure et axillaire postérieure en zones antérieure, latérale et postérieure, elles-mêmes séparées en partie supérieure et inférieure.</p>"
  });

  /* ---------------- Outil 2 : volume d'épanchement pleural ---------------- */
  const epTool = P17.calc({
    id: "epanchement", title: "Volume d'un épanchement pleural",
    desc: "Estimation au lit ; choisir la méthode correspondant à la position du patient.",
    fields: [
      { id: "m", label: "Méthode", type: "select", full: true, options: [["balik", "Balik — décubitus, tronc à 15°"], ["eibenberger", "Eibenberger — décubitus dorsal"], ["goecke", "Goecke — patient assis"], ["remerand", "Remérand — décubitus (longueur × surface)"]] },
      { id: "cote", label: "Côté", type: "seg", options: [["d", "Droit"], ["g", "Gauche"]], showIf: v => v.m === "balik" || v.m === "eibenberger" },
      { id: "sep", label: "Distance interpleurale maximale", unit: "mm", placeholder: "ex. 40", showIf: v => v.m === "balik" || v.m === "eibenberger" },
      { id: "hl", label: "Hauteur latérale", unit: "cm", placeholder: "ex. 6", showIf: v => v.m === "goecke" },
      { id: "hsp", label: "Hauteur sous-pulmonaire", unit: "cm", placeholder: "ex. 2", showIf: v => v.m === "goecke" },
      { id: "lpv", label: "Longueur paravertébrale", unit: "cm", placeholder: "ex. 12", showIf: v => v.m === "remerand" },
      { id: "surf", label: "Surface de section à mi-hauteur", unit: "cm²", placeholder: "ex. 40", showIf: v => v.m === "remerand" }
    ],
    compute(v) {
      let vol = null, how = "";
      if (v.m === "balik") { vol = F.epanchement("balik", v.sep); how = "V (mL) = 20 × distance (mm)"; }
      if (v.m === "eibenberger") { vol = F.epanchement("eibenberger", v.sep); how = "V (mL) = 47,6 × distance (mm) − 837"; }
      if (v.m === "goecke") { vol = F.epanchement("goecke", v.hl, v.hsp); how = "V (mL) = 70 × (hauteur latérale + sous-pulmonaire en cm)"; }
      if (v.m === "remerand") { vol = F.epanchement("remerand", v.lpv, v.surf); how = "V (mL) = longueur (cm) × surface (cm²)"; }
      if (vol === null) return null;
      const seuil = v.cote === "g" ? 50 : 45;
      const vignon = (v.m === "balik" || v.m === "eibenberger") && v.sep !== null
        ? (v.sep > seuil ? `Distance > ${seuil} mm à ${v.cote === "g" ? "gauche" : "droite"} : volume ≥ 800 mL probable (Vignon 2005).` : `Distance ≤ ${seuil} mm : volume ≥ 800 mL peu probable (Vignon 2005).`)
        : "";
      return {
        label: "Volume estimé", main: `≈ ${f(Math.round(vol / 10) * 10, 0)} mL`, sub: how,
        tone: vol >= 800 ? "warn" : "ok",
        html: `${vignon ? `<p class="out-sub">${vignon}</p>` : ""}${vol >= 800 ? `<p class="out-sub">Épanchement abondant : discuter la ponction ou le drainage selon la tolérance (hypoxémie, besoin de PEEP, hémodynamique).</p>` : ""}`
      };
    },
    note: "<p>Mesure en fin d'expiration, sonde perpendiculaire à la paroi, à la base, sur la ligne axillaire postérieure (décubitus). Estimation approximative (erreur de l'ordre de 200 à 400 mL), moins fiable en cas de condensation sous-jacente, de cloisonnement ou de déformation thoracique.</p>"
  });

  /* ---------------- Outil 3 : diaphragme ---------------- */
  const diaTool = P17.calc({
    id: "diaphragme", title: "Fonction diaphragmatique",
    desc: "Course en mode TM (voie sous-costale droite) et épaisseur dans la zone d'apposition, en ventilation spontanée ou pendant l'épreuve de VS.",
    fields: [
      { id: "exc", label: "Course diaphragmatique (respiration calme)", unit: "mm", placeholder: "ex. 15" },
      { id: "fr", label: "Fréquence respiratoire", unit: "c/min", placeholder: "ex. 22" },
      { id: "ei", label: "Épaisseur en fin d'inspiration", unit: "mm", placeholder: "ex. 2,6" },
      { id: "ee", label: "Épaisseur en fin d'expiration", unit: "mm", placeholder: "ex. 2,0" },
      { id: "ctx", label: "Mode ventilatoire", type: "seg", full: true, options: [["vs", "VS ou épreuve de VS"], ["va", "Ventilation assistée"]] },
      { id: "para", label: "Mouvement paradoxal (ascension inspiratoire)", type: "check", full: true }
    ],
    compute(v) {
      const r = F.diaphragme({ excursion: v.exc, epIns: v.ei, epExp: v.ee, fr: v.fr });
      if (!r && v.exc === null && !v.para) return null;
      const rows = [], notes = [];
      let tone = "ok";
      if (v.para) { tone = "danger"; notes.push("Mouvement paradoxal : paralysie de l'hémi-diaphragme, à confirmer par le sniff test."); }
      if (v.exc !== null) {
        rows.push(["Course", `${f(v.exc, 0)} mm`]);
        if (v.ctx === "vs") {
          if (v.exc < 10) { tone = "danger"; notes.push("Course < 10 mm en ventilation spontanée : dysfonction diaphragmatique, associée à l'échec de sevrage (Kim 2011)."); }
          else if (v.exc < 16) { if (tone === "ok") tone = "warn"; notes.push("Course inférieure aux valeurs habituelles au repos (environ 16 à 18 mm debout ; valeurs plus élevées couché)."); }
        } else notes.push("Sous ventilation assistée, la course reflète surtout l'insufflation : l'interpréter en ventilation spontanée.");
      }
      if (r && r.tf !== undefined) {
        rows.push(["Fraction d'épaississement", `${f(r.tf, 0)} %`]);
        if (v.ctx === "vs") {
          if (r.tf < 20) { tone = "danger"; notes.push("Fraction d'épaississement < 20 % : paralysie ou dysfonction sévère."); }
          else if (r.tf < 30) { if (tone === "ok") tone = "warn"; notes.push("Fraction d'épaississement de 20 à 30 % : zone intermédiaire pour l'extubation."); }
          else notes.push("Fraction d'épaississement ≥ 30 % : en faveur du succès de l'extubation (DiNino 2014).");
        } else {
          if (r.tf < 15) notes.push("Fraction d'épaississement < 15 % sous ventilation : diaphragme peu actif, risque d'atrophie (surassistance ?).");
          else if (r.tf <= 30) notes.push("Fraction d'épaississement de 15 à 30 % sous ventilation : activité associée à la durée de ventilation la plus courte (Goligher 2018).");
          else notes.push("Fraction d'épaississement > 30 % sous ventilation : effort inspiratoire important (sous-assistance ?).");
        }
      }
      if (r && r.drsbi !== undefined) {
        rows.push(["D-RSBI (FR / course)", `${f(r.drsbi, 2)} c/min/mm`]);
        if (v.ctx === "vs") {
          if (r.drsbi > 1.3) { tone = "danger"; notes.push("D-RSBI > 1,3 c/min/mm : risque d'échec de sevrage (Spadaro 2016)."); }
          else notes.push("D-RSBI ≤ 1,3 c/min/mm : en faveur du succès du sevrage.");
        }
      }
      return { label: "Diaphragme", main: rows.length ? rows[0][1] : "—", rows: rows.slice(1), tone, html: notes.map(n => `<p class="out-sub">${n}</p>`).join("") };
    },
    note: "<p>Fraction d'épaississement = (épaisseur en fin d'inspiration − épaisseur en fin d'expiration) / épaisseur en fin d'expiration × 100. Moyenne de trois cycles.</p>"
  });

  /* ---------------- Fiche pleuro-pulmonaire ---------------- */
  const PP = {
    kicker: "Échographie en réanimation chirurgicale",
    title: "Échographie pleuro-pulmonaire et diaphragmatique",
    subtitle: "Sémiologie, profils diagnostiques, quantification de l'aération et des épanchements, évaluation du diaphragme",
    tags: ["Score LUS", "Épanchement", "Pneumothorax", "Diaphragme", "Sevrage"],
    sections: [
      S("Sémiologie de base", [
        { html: '<p>Aspects élémentaires à reconnaître avant toute interprétation : la ligne pleurale et son glissement, les lignes A et B, puis la condensation, l\'épanchement et le point poumon.</p>' },
        figs([["pp-lignes-a", "Signe de la chauve-souris : côtes, ligne pleurale, lignes A"], ["pp-lignes-b", "Lignes B : syndrome interstitiel"], ["pp-poumon-blanc", "Lignes B coalescentes : « poumon blanc »"],
          ["pp-tm-bord-de-mer", "TM « bord de mer » : glissement présent"], ["pp-tm-code-barres", "TM « code-barres » : glissement aboli"], ["pp-tm-point-poumon", "Point poumon : pneumothorax"],
          ["pp-condensation", "Condensation : aspect tissulaire, bronchogramme, shred sign"], ["pp-epanchement", "Épanchement anéchogène et poumon atélectasié"], ["pp-tm-sinusoide", "Signe sinusoïde de l'épanchement"]]),
        tbl(["Signe", "Aspect", "Signification"], [
          ["Glissement pleural", "Scintillement de la ligne pleurale synchrone de la respiration ; « bord de mer » en TM", "Plèvres viscérale et pariétale au contact : élimine un pneumothorax au point examiné"],
          ["Pouls pulmonaire", "Battements cardiaques transmis à la ligne pleurale, sans glissement", "Poumon au contact de la paroi mais non ventilé (apnée, intubation sélective, atélectasie) ; élimine aussi le pneumothorax"],
          ["Lignes A", "Lignes horizontales répétant la ligne pleurale à intervalles réguliers", "Aération normale si glissement présent ; pneumothorax possible si glissement absent"],
          ["Lignes B", "Artefacts verticaux hyperéchogènes nés de la ligne pleurale, jusqu'au bas de l'écran, mobiles avec le glissement, effaçant les lignes A", "Syndrome interstitiel ; pathologique au-delà de 2 par espace intercostal"],
          ["Lignes B coalescentes", "Lignes B confluentes, « poumon blanc »", "Perte d'aération sévère (œdème, SDRA, contusion, pneumonie débutante)"],
          ["Condensation", "Aspect tissulaire (hépatisation), limite profonde irrégulière (« shred sign »)", "Pneumonie, atélectasie, contusion, infarctus pulmonaire"],
          ["Bronchogramme aérien dynamique", "Ponctuations aériques hyperéchogènes mobiles avec la respiration", "En faveur d'une pneumonie (bronchogramme statique ou absent : atélectasie de résorption)"],
          ["Épanchement", "Image anéchogène déclive limitée par la plèvre pariétale, le diaphragme et le poumon ; signe du quadrilatère ; signe sinusoïde en TM", "Épanchement liquidien ; le poumon atélectasié peut flotter dans le liquide (« méduse »)"],
          ["Point poumon", "Alternance au même endroit de glissement et d'absence de glissement", "Pathognomonique du pneumothorax ; sa position renseigne sur son étendue"],
          ["Code-barres (stratosphère)", "Lignes uniquement horizontales en TM", "Absence de glissement (pneumothorax, apnée, adhérences, intubation sélective)"]
        ]),
        { html: '<h4 class="blk-title">Synthèse : signes et diagnostics</h4>' },
        tbl(["Signe", "Poumon normal", "Épanchement", "Pneumothorax", "Syndrome interstitiel", "Pneumonie", "Atélectasie"], [
          ["Lignes A", "+", "−", "+", "−", "−", "−"],
          ["Lignes B", "−", "−", "−", "++", "± (autour)", "−"],
          ["Glissement pleural", "+", "−", "−", "+", "± ", "−"],
          ["Bord de mer (TM)", "+", "−", "−", "+", "−", "−"],
          ["Code-barres (TM)", "−", "−", "+", "−", "−", "−"],
          ["Sinusoïde (TM)", "−", "+", "−", "−", "si épanchement associé", "−"],
          ["Condensation", "−", "poumon comprimé", "−", "−", "+ (bronchogramme dynamique)", "+ (bronchogramme statique, pouls pulmonaire)"]
        ], "Performance au lit : épanchement (Se ≈ 100 %, Sp ≈ 97 %), pneumothorax (Se 95 %, Sp 91 %), syndrome interstitiel (Se 93 %, Sp 93 %), condensation (Se 90 %, Sp 98 %) — Lichtenstein.")
      ], { wide: true }),
      S("Technique, protocole d'examen et score LUS", [
        { html: '<h4 class="blk-title">Matériel et réglages</h4>' },
        kv(["Sonde convexe 2–5 MHz", "Examen global, épanchements, condensations, diaphragme (course)"],
          ["Sonde linéaire 7–15 MHz", "Ligne pleurale, glissement, point poumon, épaisseur diaphragmatique"],
          ["Sonde sectorielle", "Possible pour l'ensemble de l'examen, notamment entre deux côtes"],
          ["Réglages", "Preset « poumon » ; imagerie harmonique et compound désactivés pour voir les artefacts ; focale sur la ligne pleurale ; profondeur 12–16 cm (convexe)"],
          ["Mode TM", "Glissement pleural (bord de mer ou code-barres) et course diaphragmatique"]),
        info("Repère de base : le « signe de la chauve-souris », deux côtes et leur cône d'ombre encadrant la ligne pleurale, environ 0,5 cm sous la ligne costale."),
        { html: '<h4 class="blk-title">Protocole d\'examen</h4>' },
        ul("Patient en décubitus : l'air monte (régions antérieures : pneumothorax), les liquides et les condensations descendent (régions postérieures et basales)",
          "Douze régions, six par hémithorax : zones antérieure, latérale et postérieure délimitées par les lignes parasternale, axillaire antérieure et axillaire postérieure, chacune divisée en partie supérieure et inférieure",
          "Points BLUE : point supérieur, point inférieur et point PLAPS (intersection de l'horizontale passant par le point inférieur et de la ligne axillaire postérieure)",
          "Coter chaque région selon l'aspect le plus péjoratif, dans des conditions reproductibles (position, PEEP, FiO₂) pour comparer les examens"),
        { html: '<h4 class="blk-title">Cotation de chaque région (score LUS)</h4>' },
        figs([["pp-lus-0", "0 · lignes A (ou ≤ 2 lignes B)"], ["pp-lus-1", "1 · lignes B multiples espacées"], ["pp-lus-2", "2 · lignes B coalescentes"], ["pp-lus-3", "3 · condensation"]], 4),
        info("Score LUS = somme des 12 régions (0 à 36). En fin d'épreuve de ventilation spontanée : < 13 risque faible, > 17 risque élevé de détresse après extubation (Soummer 2012). Calcul dans l'outil ci-dessous.")
      ], { tool: lusTool }),
      S("Profils diagnostiques (protocole BLUE)", [
        tbl(["Profil", "Description", "Orientation"], [
          ["A + thrombose veineuse", "Lignes A antérieures avec glissement, thrombose veineuse profonde", "Embolie pulmonaire"],
          ["A sans thrombose, avec PLAPS", "Lignes A antérieures, condensation ou épanchement postéro-latéral", "Pneumonie"],
          ["A sans thrombose, sans PLAPS", "Examen pulmonaire normal (profil nu)", "BPCO ou asthme"],
          ["A' + point poumon", "Lignes A sans glissement", "Pneumothorax"],
          ["B", "Lignes B antérieures bilatérales avec glissement", "Œdème pulmonaire hydrostatique"],
          ["B'", "Lignes B antérieures sans glissement", "Pneumonie"],
          ["A/B", "Lignes B antérieures d'un seul côté", "Pneumonie"],
          ["C", "Condensation antérieure", "Pneumonie"]
        ]),
        figs([["pp-lignes-a", "Profil A : lignes A et glissement"], ["pp-lignes-b", "Profil B : lignes B antérieures"], ["pp-tm-point-poumon", "Profil A' + point poumon : pneumothorax"]]),
        warn("Protocole conçu pour la détresse respiratoire aiguë aux urgences. En postopératoire, les condensations déclives (atélectasies) sont fréquentes et le PLAPS n'est pas spécifique d'une pneumonie.")
      ], { wide: true }),
      S("Épanchement pleural", [
        figs([["pp-epanchement", "Mesure de Sep (distance interpleurale maximale)"], ["pp-tm-sinusoide", "Signe sinusoïde en mode TM"]], 2),
        ult("Détection et caractérisation",
          "Plus sensible que la radiographie au lit ; détection de lames de quelques millilitres",
          "Anéchogène : transsudat ou exsudat ; échogène, cloisonné ou fibrineux : exsudat, empyème",
          "Échos tourbillonnants (« plancton ») : hémothorax ou empyème ; nodules ou épaississement pleural : origine néoplasique possible"),
        ult("Quantification",
          "Balik : V (mL) ≈ 20 × distance interpleurale maximale (mm), en décubitus tronc à 15°, à la base, ligne axillaire postérieure, en fin d'expiration",
          "Vignon : distance > 45 mm à droite ou > 50 mm à gauche, volume ≥ 800 mL probable",
          "Autres méthodes dans l'outil ci-dessous (Eibenberger, Goecke chez le patient assis, Remérand)"),
        ult("Ponction ou drainage échoguidé",
          "Repérage juste avant le geste, dans la position du geste ; marquer le point et la direction",
          "Lame d'au moins 10 à 15 mm sans organe interposé (poumon, foie, rate, cœur) en fin d'inspiration",
          "Ponctionner au bord supérieur de la côte inférieure ; doppler couleur pour repérer l'artère intercostale",
          "Après le geste : vérifier le glissement pleural (pneumothorax) ; le guidage échographique rend ce risque faible, y compris sous ventilation mécanique")
      ], { tool: epTool }),
      S("Pneumothorax", [
        { ol: [
          "Glissement pleural, lignes B ou pouls pulmonaire présents : pneumothorax éliminé au point examiné",
          "Absence de glissement et lignes A seules : pneumothorax suspecté",
          "Rechercher le point poumon en progressant vers les régions latérales : sa présence confirme le diagnostic",
          "Point poumon antérieur : pneumothorax de petite taille ; latéral ou postérieur : volumineux ; absent avec abolition complète du glissement : pneumothorax complet probable"
        ] },
        figs([["pp-tm-bord-de-mer", "Bord de mer : poumon au contact"], ["pp-tm-code-barres", "Code-barres : pas de glissement"], ["pp-tm-point-poumon", "Point poumon : confirme le pneumothorax"]]),
        warn("Pièges : emphysème sous-cutané, bulles d'emphysème, adhérences ou symphyse pleurale, intubation sélective ou apnée (pas de glissement mais pouls pulmonaire présent), SDRA sévère.")
      ]),
      S("Diaphragme", [
        ult("Course (excursion)",
          "Sonde convexe ou sectorielle 2–5 MHz, voie sous-costale droite (fenêtre hépatique) entre lignes médio-claviculaire et axillaire antérieure, faisceau vers le dôme postérieur",
          "Mode TM perpendiculaire au dôme ; moyenne de 3 cycles ; à gauche, fenêtre splénique moins fiable",
          "Valeurs normales debout (Boussuges 2009) : respiration calme 18 ± 3 mm chez l'homme, 16 ± 3 mm chez la femme ; inspiration profonde 70 ± 11 mm (homme), 57 ± 10 mm (femme) ; valeurs plus élevées en décubitus",
          "Dysfonction : course < 10 mm ou mouvement paradoxal en ventilation spontanée (Kim 2011)"),
        ult("Épaisseur et fraction d'épaississement",
          "Sonde linéaire ≥ 10 MHz dans la zone d'apposition, 8e–10e espace intercostal entre lignes axillaires antérieure et moyenne, 0,5 à 2 cm sous le cul-de-sac pleural",
          "Mesure entre le milieu de la ligne pleurale et le milieu de la ligne péritonéale, en fin d'expiration et en fin d'inspiration",
          "Fraction d'épaississement < 20 % : paralysie ; ≥ 30 % : succès d'extubation probable (DiNino 2014)",
          "Sous ventilation mécanique : une diminution de l'épaisseur de plus de 10 % signe une atrophie ; une fraction d'épaississement de 15 à 30 % est associée à la durée de ventilation la plus courte (Goligher 2018)"),
        ult("Situations chirurgicales",
          "Bloc interscalénique : parésie phrénique homolatérale fréquente (volumes réduits et blocs plus distaux la limitent) ; prudence chez l'insuffisant respiratoire",
          "Chirurgie abdominale haute et thoracique : dysfonction diaphragmatique postopératoire transitoire",
          "Ventilation prolongée : dysfonction diaphragmatique acquise, à rechercher devant un échec de sevrage"),
        figs([["dia-sous-costale", "Voie sous-costale droite : coupole et ligne TM"], ["dia-tm-course", "Tracé TM : mesure de la course"], ["dia-epaisseur", "Épaisseur en fin d'expiration et d'inspiration"]])
      ], { tool: diaTool }),
      S("Applications en réanimation chirurgicale", [
        figs([["pp-lus-3", "Atélectasie postopératoire déclive"], ["pp-poumon-blanc", "Perte d'aération diffuse"]], 2),
        ul("Atélectasies postopératoires : condensations déclives et basales ; suivi de la réaération après kinésithérapie, CPAP ou manœuvre de recrutement",
          "PEEP et recrutement : score de réaération (+1 pour un gain d'un niveau, +3 pour deux niveaux, +5 pour une condensation redevenue normale ; pertes cotées négativement), corrélé au volume recruté (Bouhemad 2011)",
          "Pneumonie acquise sous ventilation : condensation sous-pleurale avec bronchogramme dynamique ; suivi de la réaération sous antibiothérapie",
          "Sevrage : score LUS en fin d'épreuve de VS (< 13 risque faible, > 17 risque élevé de détresse après extubation), associé à l'échographie cardiaque (E/e') et diaphragmatique",
          "Remplissage vasculaire : l'apparition de lignes B diffuses pendant l'expansion volémique incite à l'arrêter",
          "Après un geste : cathéter veineux central sous-clavier ou jugulaire, intubation (glissement absent à gauche avec pouls pulmonaire : intubation sélective), drainage thoracique")
      ])
    ],
    refs: [
      "Lichtenstein DA, Mezière GA. Relevance of lung ultrasound in the diagnosis of acute respiratory failure: the BLUE protocol. Chest 2008",
      "Volpicelli G et al. International evidence-based recommendations for point-of-care lung ultrasound. Intensive Care Med 2012",
      "Mojoli F et al. Lung ultrasound for critically ill patients. Am J Respir Crit Care Med 2019",
      "Bouhemad B et al. Bedside ultrasound assessment of positive end-expiratory pressure-induced lung recruitment. Am J Respir Crit Care Med 2011",
      "Soummer A et al. Ultrasound assessment of lung aeration loss during a successful weaning trial predicts postextubation distress. Crit Care Med 2012",
      "Balik M et al. Ultrasound estimation of volume of pleural fluid in mechanically ventilated patients. Intensive Care Med 2006",
      "Vignon P et al. Quantitative assessment of pleural effusion in critically ill patients by means of ultrasonography. Crit Care Med 2005",
      "Boussuges A et al. Diaphragmatic motion studied by M-mode ultrasonography: methods, reproducibility, and normal values. Chest 2009",
      "Kim WY et al. Diaphragm dysfunction assessed by ultrasonography: influence on weaning from mechanical ventilation. Crit Care Med 2011",
      "DiNino E et al. Diaphragm ultrasound as a predictor of successful extubation from mechanical ventilation. Thorax 2014",
      "Spadaro S et al. Can diaphragmatic ultrasonography performed during the T-tube trial predict weaning failure? The role of the diaphragmatic rapid shallow breathing index. Crit Care 2016",
      "Goligher EC et al. Mechanical ventilation-induced diaphragm atrophy strongly impacts clinical outcomes. Am J Respir Crit Care Med 2018"
    ]
  };

  /* ---------------- Bases et sémiologie échographique ---------------- */
  const BASES = {
    kicker: "Échographie : premier chapitre",
    title: "Bases et sémiologie échographique",
    subtitle: "Sondes et réglages, orientation, échogénicité, artefacts, modes TM et Doppler : le vocabulaire commun à toutes les échographies",
    tags: ["Sondes", "Échogénicité", "Artefacts", "TM", "Doppler"],
    sections: [
      S("Échogénicité : décrire ce que l'on voit", [
        figs([["base-echogenicite", "Échelle d'échogénicité, du liquide (anéchogène) à l'os et l'air (hyperéchogènes)"]], 1),
        kv(["Anéchogène", "Noir : liquide pur (vessie, vésicule, vaisseaux, épanchement, kyste)"],
          ["Hypoéchogène", "Moins échogène que le tissu de référence : muscle, œdème, hématome récent, adénopathie"],
          ["Isoéchogène", "Même échogénicité que le tissu de référence (foie, rate, cortex rénal)"],
          ["Hyperéchogène", "Blanc : interfaces, graisse, fibrose, calcifications, os, air"]),
        ult("Décrire une image",
          "Siège, taille (deux ou trois axes), forme, contours (nets, flous, irréguliers)",
          "Échostructure (homogène ou hétérogène) et échogénicité comparée à un tissu de référence",
          "Vascularisation au Doppler couleur, compressibilité, mobilité avec la respiration")
      ]),
      S("Artefacts utiles", [
        figs([["base-ombre-renforcement", "Renforcement postérieur (kyste) et cône d'ombre (calcul)"], ["base-reverberation", "Réverbération (ligne A) et queue de comète (ligne B)"], ["base-miroir", "Image en miroir du foie au-dessus du diaphragme"]]),
        tbl(["Artefact", "Mécanisme", "Intérêt pratique"], [
          ["Cône d'ombre postérieur", "Arrêt du faisceau par une structure très réfléchissante ou absorbante", "Calcul, os (côtes), air digestif ; masque les structures situées derrière"],
          ["Renforcement postérieur", "Faible atténuation du faisceau par un liquide", "Signe de nature liquidienne (kyste, vésicule, vessie)"],
          ["Réverbération", "Échos répétés entre la sonde et une interface très réfléchissante", "Lignes A du poumon aéré"],
          ["Queue de comète", "Réverbérations multiples sur une petite interface", "Lignes B (syndrome interstitiel), corps étrangers"],
          ["Image en miroir", "Le diaphragme réfléchit le faisceau", "Présente si la base pulmonaire est aérée ; disparaît (rachis visible) en cas d'épanchement"],
          ["Ombre de bord", "Réfraction sur les contours d'une structure arrondie", "Ne pas confondre avec un cône d'ombre pathologique"]
        ])
      ], { wide: true }),
      S("Sondes et réglages", [
        tbl(["Sonde", "Fréquence", "Image", "Indications"], [
          ["Linéaire", "7–15 MHz", "Rectangulaire, haute résolution, faible profondeur", "Plèvre, vaisseaux, nerfs (ALR), épaisseur diaphragmatique, ponctions"],
          ["Convexe", "2–5 MHz", "Secteur large", "Abdomen, épanchements, condensations, vessie"],
          ["Sectorielle", "1–5 MHz", "Petit point d'entrée, secteur étroit en surface", "Cœur, fenêtres intercostales, diaphragme, doppler transcrânien"]
        ]),
        ult("Réglages essentiels",
          "Preset adapté à l'examen (cardiaque, abdominal, pulmonaire, vasculaire)",
          "Profondeur : structure d'intérêt au centre ou aux deux tiers de l'écran",
          "Gain global et courbe de gain (TGC) : liquide noir, tissus gris homogènes de haut en bas",
          "Focale au niveau de la cible ; zoom pour les petites structures",
          "Geler l'image et utiliser la ciné-boucle avant de mesurer",
          "Échographie pulmonaire : désactiver imagerie harmonique et filtres pour analyser les artefacts")
      ]),
      S("Orientation de la sonde", [
        ul("Le repère de la sonde (encoche, ligne lumineuse) correspond au point de repère affiché à l'écran",
          "Coupe longitudinale : repère vers la tête, crâne à gauche de l'écran",
          "Coupe transversale : repère vers la droite du patient, droite du patient à gauche de l'écran (comme au scanner)",
          "Échocardiographie : convention cardiologique, repère d'écran à droite",
          "Mouvements élémentaires : glisser, basculer, incliner, pivoter, comprimer ; un seul à la fois, lentement")
      ]),
      S("Les modes : 2D, TM et Doppler", [
        figs([["pp-tm-bord-de-mer", "Mode TM : mouvement le long d'une ligne en fonction du temps"], ["base-doppler-couleur", "Doppler couleur : rouge vers la sonde, bleu s'éloigne"], ["base-doppler-pulse", "Doppler pulsé : spectre vitesse / temps"]]),
        tbl(["Mode", "Principe", "Utilisation en réanimation"], [
          ["2D (mode B)", "Image en coupe en niveaux de gris", "Anatomie, épanchements, condensations, cavités cardiaques"],
          ["TM (mode M)", "Mouvement des structures traversées par une ligne, en fonction du temps", "Glissement pleural, course diaphragmatique, TAPSE, veine cave inférieure"],
          ["Doppler couleur", "Direction et vitesse moyenne des flux codées en couleur (BART : Blue Away, Red Toward)", "Vaisseaux, régurgitations valvulaires, abords vasculaires"],
          ["Doppler pulsé", "Spectre des vitesses en un point précis (volume d'échantillonnage)", "ITV sous-aortique, flux mitral, doppler transcrânien, index de résistance rénal"],
          ["Doppler continu", "Vitesses élevées le long de toute la ligne, sans localisation", "Sténoses, insuffisance tricuspide (PAPs)"],
          ["Doppler tissulaire", "Vitesses basses et amples du myocarde", "Onde S', e' (rapport E/e'), fonction du VD"]
        ]),
        warn("Doppler : aligner le faisceau sur le flux. Angle < 20° : erreur < 6 % ; au-delà de 60°, la mesure n'est pas fiable. Une échelle de vitesse trop basse donne un aliasing (mosaïque de couleurs).")
      ], { wide: true })
    ],
    refs: [
      "Société française d'anesthésie et de réanimation : échographie en anesthésie-réanimation, référentiels de formation",
      "Mayo PH et al. Recommendations for achieving competence in critical care ultrasonography. Chest 2009",
      "Expert Round Table on Ultrasound in ICU. International expert statement on training standards for critical care ultrasonography. Intensive Care Med 2011"
    ]
  };

  /* ---------------- Routes ---------------- */
  P17.route("#/echographie", {
    title: SEC,
    render: () => P17.page({
      crumbs: base, title: SEC, accent: "echographie", icon: "echographie",
      subtitle: "Commencer par les bases et la sémiologie, puis l'échocardiographie, l'échographie pleuro-pulmonaire et diaphragmatique (avec outils de calcul) et l'échographie générale.",
      body: P17.tiles([
        { href: "#/echographie/bases", title: "Bases et sémiologie échographique", desc: "Sondes, réglages, échogénicité, artefacts, TM et Doppler : à lire en premier", icon: "fiche", accent: "echographie" },
        { href: "#/echographie/ett", title: "Échocardiographie transthoracique", desc: "Coupes, débit, précharge, pressions de remplissage, VD, valves", icon: "fiche", accent: "echographie" },
        { href: "#/echographie/pleuro-pulmonaire", title: "Échographie pleuro-pulmonaire et diaphragme", desc: "Sémiologie, score LUS, profils BLUE, épanchement, pneumothorax, diaphragme", icon: "fiche", accent: "echographie" },
        { href: "#/echographie/abords-vasculaires", title: "Abords vasculaires échoguidés", desc: "Voies centrales, périphériques, artérielles", icon: "fiche", accent: "echographie" },
        { href: "#/echographie/doppler-transcranien", title: "Doppler transcrânien", desc: "Artère cérébrale moyenne, seuils d'alerte", icon: "fiche", accent: "echographie" },
        { href: "#/echographie/generale", title: "Échographie générale", desc: "Abdomen, reins", icon: "fiche", accent: "echographie" }
      ])
    })
  });

  P17.route("#/echographie/bases", {
    title: "Bases et sémiologie échographique",
    render: () => `
      <div class="page accent-echographie">
        <div class="page-head">
          ${P17.backLink("#/echographie", SEC)}
          ${P17.crumbs([...base, ["Bases et sémiologie", "#/echographie/bases"]])}
        </div>
        ${P17.fiche({ accent: "echographie", ...BASES })}
      </div>`
  });

  const echoPage = (path, label, fiche) => `
      <div class="page accent-echographie">
        <div class="page-head">
          ${P17.backLink("#/echographie", SEC)}
          ${P17.crumbs([...base, [label, path]])}
        </div>
        ${P17.fiche({ accent: "echographie", kicker: SEC, ...fiche })}
      </div>`;
  /* ---------------- Échocardiographie transthoracique ---------------- */
  const H4 = t => ({ html: `<h4 class="blk-title">${t}</h4>` });
  // Œil de bœuf des 17 segments du VG (AHA), coloré par territoire coronaire
  const bullseye = () => {
    const C = { iva: "#c8323c", cd: "#2f6fb5", cx: "#e3a51d", apex: "#9aa7b2" };
    const ter = { 1: "iva", 2: "iva", 7: "iva", 8: "iva", 13: "iva", 14: "iva", 3: "cd", 4: "cd", 9: "cd", 10: "cd", 15: "cd", 5: "cx", 6: "cx", 11: "cx", 12: "cx", 16: "cx" };
    const P = (r, a) => [100 + r * Math.cos(a), 100 - r * Math.sin(a)];
    const arc = (r1, r2, a1, a2) => { const [x1, y1] = P(r2, a1), [x2, y2] = P(r2, a2), [x3, y3] = P(r1, a2), [x4, y4] = P(r1, a1);
      return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r2} ${r2} 0 0 0 ${x2.toFixed(1)} ${y2.toFixed(1)} L${x3.toFixed(1)} ${y3.toFixed(1)} A${r1} ${r1} 0 0 1 ${x4.toFixed(1)} ${y4.toFixed(1)}Z`; };
    const rad = d => d * Math.PI / 180; let out = "";
    const ring = (first, n, r1, r2) => { for (let i = 0; i < n; i++) {
      const w = 360 / n, mid = 90 + i * w, a1 = rad(mid + w / 2), a2 = rad(mid - w / 2), s = first + i;
      // sens antihoraire : 1 antérieur (haut), 2 antéro-septal, 3 inféro-septal, 4 inférieur, 5 inféro-latéral, 6 antéro-latéral
      const [tx, ty] = P((r1 + r2) / 2, rad(mid));
      out += `<path d="${arc(r1, r2, a2, a1)}" fill="${C[ter[s]]}" stroke="#fff" stroke-width="1.6"/><text x="${tx.toFixed(1)}" y="${(ty + 4).toFixed(1)}">${s}</text>`;
    } };
    ring(1, 6, 70, 96); ring(7, 6, 44, 70);
    for (let i = 0; i < 4; i++) { const mid = 90 + i * 90, s = 13 + i, [tx, ty] = P(31, rad(mid));
      out += `<path d="${arc(20, 44, rad(mid - 45), rad(mid + 45))}" fill="${C[ter[s]]}" stroke="#fff" stroke-width="1.6"/><text x="${tx.toFixed(1)}" y="${(ty + 4).toFixed(1)}">${s}</text>`; }
    out += `<circle cx="100" cy="100" r="20" fill="${C.apex}" stroke="#fff" stroke-width="1.6"/><text x="100" y="104">17</text>`;
    const leg = [["iva", "IVA"], ["cd", "Coronaire droite"], ["cx", "Circonflexe"]].map(([k, l]) => `<span><i style="background:${C[k]}"></i>${l}</span>`).join("");
    return { html: `<div class="bull"><svg viewBox="-16 -16 232 232" role="img" aria-label="Les 17 segments du ventricule gauche"><g font-size="11" font-weight="700" fill="#fff" text-anchor="middle">${out}</g>
      <g font-size="8.5" fill="currentColor" text-anchor="middle" font-weight="600"><text x="100" y="-5">Antérieur</text><text x="100" y="212">Inférieur</text><text x="-6" y="103" transform="rotate(-90 -6 100)">Septal</text><text x="206" y="103" transform="rotate(90 206 100)">Latéral</text></g></svg>
      <div class="bull-leg">${leg}<span><i style="background:${C.apex}"></i>Apex (IVA le plus souvent)</span><p>Anneau externe : segments basaux (1–6) ; anneau moyen : segments médians (7–12) ; anneau interne : segments apicaux (13–16).</p></div></div>` };
  };

  const ETT_FICHE = {
    title: "Échocardiographie transthoracique", subtitle: "Coupes de référence, débit cardiaque, précharge, pressions de remplissage, ventricule droit, péricarde et valves",
    tags: ["ITV sous-aortique", "VCI", "E/e'", "TAPSE"],
    sections: [
      S("Coupes de référence", [
        info("Sonde sectorielle 2–4 MHz, preset cardiaque, repère de l'écran à droite. Patient en décubitus latéral gauche si possible."),
        tbl(["Coupe", "Position de la sonde", "Ce qu'on évalue"], [
          ["Parasternale grand axe", "3e–4e espace intercostal gauche, repère vers l'épaule droite", "Valves aortique et mitrale (IA, IM, obstruction de la chambre de chasse : bourrelet septal, SAM), aorte ascendante (dilatation, flap de dissection), parois antéro-septale et postérieure, diamètre télédiastolique du VG (dilaté si > 70 mm), diamètre de la chambre de chasse"],
          ["Parasternale petit axe", "Rotation de 90° horaire depuis le grand axe", "FEVG et cinétique segmentaire (territoires IVA, Cx, CD), VD (dilatation, septum paradoxal), épanchement péricardique (circonférentiel ou non), valve pulmonaire"],
          ["Apicale 4 cavités", "Choc de pointe, repère vers la gauche", "Cavités gauches : FEVG, cinétique septale, latérale et apicale, IM, IA, pressions de remplissage (E/A, E/e'). Cavités droites : TAPSE, onde S', septum paradoxal, PAPs sur la fuite tricuspide. Foramen ovale (test aux microbulles), épanchement, hématome rétro-auriculaire"],
          ["Apicale 5 cavités", "Depuis l'apicale 4 cavités, bascule antérieure", "ITV sous-aortique et débit cardiaque, obstruction dynamique de la chambre de chasse, IA et RA (Vmax, rapport des ITV)"],
          ["Sous-costale 4 cavités", "Sous l'appendice xiphoïde, faisceau vers l'épaule gauche, abdomen relâché", "Meilleure fenêtre chez le patient ventilé ou emphysémateux ; épanchement péricardique ; paroi libre du VD ; cavités gauches comme en apicale"],
          ["Veine cave inférieure", "Sous-costale, rotation en coupe longitudinale", "Diamètre et variations respiratoires (congestion, précharge-dépendance), reflux systolique dans les veines sus-hépatiques, position d'une canule veineuse d'ECMO"]
        ])
      ], { wide: true }),
      S("Débit cardiaque", [
        { html: "<p>L'ITV sous-aortique est proportionnelle au volume d'éjection systolique. Ses variations suivent celles du débit, qui dépend de l'inotropisme des deux ventricules, des conditions de charge et de la fréquence cardiaque. Elle sert au diagnostic du type de choc et au suivi du traitement (remplissage, inotropes).</p>" },
        kv(["Mesure de l'ITV", "Apicale 5 cavités, Doppler pulsé dans la chambre de chasse, à 1 cm de la valve aortique. Qualité : clic de fermeture aortique visible, flux laminaire au contour net"],
          ["Normale", "18 à 22 cm ; < 14 cm : volume d'éjection abaissé (faible lien avec les besoins du patient)"],
          ["Forme du flux", "Pointue, en « lame de sabre » : hypovolémie ; arrondie et aplatie : baisse de l'inotropisme du VG"],
          ["Diamètre de la chambre de chasse", "Parasternale grand axe, en mésosystole ; 2 cm par défaut si mal visualisé"]),
        info("Débit (mL/min) = FC × ITV (cm) × π × d² / 4 (d : diamètre de la chambre de chasse en cm). À diamètre constant, suivre l'ITV suffit.")
      ]),
      S("Précharge-dépendance", [
        warn("Précharge-dépendant ne veut pas dire « à remplir » : la décision de remplissage tient compte de la tolérance (congestion, poumon, pression) et de l'objectif."),
        H4("Critères statiques : peu fiables isolément"),
        ul("VCI < 10 mm : précharge-dépendance probable",
          "Collapsus télésystolique du VG (« kissing ventricles ») : précharge-dépendance très probable (sensible, peu spécifique)"),
        H4("Critères dynamiques"),
        tbl(["Indice", "Technique", "En faveur d'une précharge-dépendance"], [
          ["Variation respiratoire de l'ITV sous-aortique", "Apicale 5 cavités, Doppler pulsé ; ventilation contrôlée, Vt ≥ 8 mL/kg, rythme sinusal, pas d'effort inspiratoire", "> 12 à 19 % selon les seuils (zone grise) ; > 19 % : très probable"],
          ["Variation du diamètre de la VCI", "Sous-costale, mode TM à 2 cm de l'abouchement dans l'oreillette droite", "Ventilé : distensibilité (Dmax − Dmin) / Dmin > 18 % ; VCI > 20 mm fixe : peu probable. Ventilation spontanée : collapsus > 50 % (ininterprétable si effort respiratoire intense)"],
          ["Occlusion télé-expiratoire", "Pause de 15 s en fin d'expiration, sans effort inspiratoire", "Hausse de l'ITV > 5 %"],
          ["Variation de la veine cave supérieure (ETO)", "Vue basale, mode TM", "Index de collapsibilité (Dmax − Dmin) / Dmax > 36 % ; indépendant des pressions intrathoraciques"]
        ]),
        warn("Variations respiratoires non interprétables : ventilation spontanée, Vt bas, arythmie, défaillance ventriculaire droite, hyperpression abdominale, thorax ouvert."),
        H4("Tests de remplissage : la référence"),
        ul("Épreuve de remplissage : 250 à 500 mL de cristalloïde en 10 à 15 min",
          "Lever de jambes passif : patient demi-assis à 45°, puis tronc à plat et jambes levées à 45° ; mesurer l'ITV dans la minute",
          "Réponse positive : hausse de l'ITV de 10 à 12 % ou plus ; le lever de jambes reste valable en ventilation spontanée et en arythmie")
      ], { wide: true }),
      S("Pressions de remplissage du VG", [
        { html: "<p>Rechercher une élévation des pressions de remplissage (PAPO > 16 mmHg) par des indices diastoliques : diagnostic d'œdème pulmonaire, échec de sevrage ventilatoire, tolérance du remplissage. Non utilisable en cas de valvulopathie mitrale sévère ou de prothèse mitrale.</p>" },
        ul("1re étape, flux mitral : apicale 4 cavités, Doppler pulsé à l'extrémité des feuillets mitraux ; ondes E et A, rapport E/A, temps de décélération de l'onde E",
          "2e étape, Doppler tissulaire à l'anneau mitral (septal ou latéral) : onde e' (protodiastolique), puis rapport E/e'"),
        tbl(["Profil mitral", "E/A", "Décélération de E", "Signification"], [
          ["Normal (sujet jeune)", "> 1", "< 220 ms", "Pressions normales"],
          ["Trouble de la relaxation", "< 1", "> 200 ms", "Sujet âgé, hypertendu ; pressions normales"],
          ["Pseudo-normal", "> 1", "< 150 ms", "Pressions élevées si sujet âgé ou hypertendu"],
          ["Restrictif", "> 1,5 à 2", "< 150 ms", "Pressions élevées (PAPO > 18 mmHg)"]
        ], "Profil dépendant du patient ; ininterprétable en fibrillation atriale ou tachycardie."),
        tbl(["E/e'", "Interprétation"], [
          ["< 8", "Pressions de remplissage non élevées"],
          ["8 à 15", "Zone d'incertitude : s'aider de l'oreillette gauche, de la fuite tricuspide (> 2,8 m/s), du contexte"],
          ["> 15 (moyen > 14)", "Pressions élevées probables (PAPO > 20 mmHg)"]
        ], "Utilisable en arythmie. Renseigne sur les pressions, pas sur la précharge-dépendance. e' < 7 cm/s (septal) ou < 10 cm/s (latéral) : argument supplémentaire si FEVG conservée. Moins fiable si trouble de cinétique basal ou atteinte mitrale.")
      ], { wide: true }),
      S("Cinétique segmentaire du VG", [
        { html: "<p>Le VG est divisé en 17 segments rattachés à un territoire coronaire. Un trouble de cinétique (hypokinésie, akinésie, dyskinésie) systématisé à un territoire est un argument de syndrome coronarien, avec la clinique, l'ECG et la troponine.</p>" },
        bullseye(),
        tbl(["Artère", "Parois", "Dérivations ECG"], [
          ["Interventriculaire antérieure (IVA)", "Antérieure, antéro-septale, apex", "V1–V6 (± DII, DIII, aVF si IVA récurrente)"],
          ["Coronaire droite (CD)", "Inférieure, inféro-septale", "DII, DIII, aVF (± V1, aVR)"],
          ["Circonflexe (Cx)", "Latérale, inféro-latérale", "V5–V6, DI, aVL"]
        ], "Les segments inféro-septaux et apicaux varient selon la dominance coronaire.")
      ], { wide: true }),
      S("Ventricule droit", [
        { html: "<p>VD triangulaire, enroulé autour du VG, à paroi fine (< 5 mm) et compliante ; sa paroi libre dépend de la coronaire droite. Coupes : apicale 4 cavités, sous-costale, parasternale petit axe.</p>" },
        tbl(["Paramètre", "Mesure", "Anormal"], [
          ["Rapport des surfaces VD/VG", "Apicale 4 cavités, en télédiastole", "> 0,6 : dilatation ; > 1 : dilatation sévère"],
          ["Septum paradoxal", "Parasternale petit axe : VG en « D »", "Surcharge de pression (systolique) ou de volume (diastolique) du VD"],
          ["Épaisseur de la paroi libre", "Sous-costale, télédiastole", "> 5 mm : hypertrophie, surcharge chronique"],
          ["TAPSE", "Apicale 4 cavités, mode TM sur l'anneau tricuspide latéral", "< 17 mm : dysfonction systolique"],
          ["Onde S'", "Doppler tissulaire sur l'anneau tricuspide latéral", "< 9,5 cm/s : dysfonction systolique"],
          ["Fraction de raccourcissement de surface", "(Surface télédiastolique − télésystolique) / télédiastolique", "< 35 % : dysfonction systolique"]
        ])
      ], { wide: true }),
      S("Hypertension pulmonaire", [
        tbl(["Type (cathétérisme droit)", "Définition"], [
          ["HTP", "PAPm > 20 mmHg"],
          ["Pré-capillaire", "PAPO ≤ 15 mmHg et résistances vasculaires pulmonaires élevées"],
          ["Post-capillaire", "PAPO > 15 mmHg"]
        ]),
        kv(["PAPs", "4 × Vmax² de l'insuffisance tricuspide + pression de l'oreillette droite (5 à 20 mmHg selon la VCI) ; HTP probable si > 50 mmHg ; sous-estimée si fuite tricuspide massive"],
          ["Flux sous-pulmonaire", "Parasternale petit axe, Doppler pulsé dans la chambre de chasse du VD : encoche mésosystolique ou temps d'accélération court en faveur d'une HTP pré-capillaire"],
          ["PAPm et PAPd", "Doppler continu sur la fuite pulmonaire : PAPm ≈ 4 × Vmax² + POD (protodiastole) ; PAPd ≈ 4 × Vmin² + POD (télédiastole)"],
          ["Retentissement", "Dilatation et hypertrophie du VD, septum paradoxal, dilatation de la VCI"])
      ]),
      S("Tamponnade péricardique", [
        H4("1. Épanchement"),
        ul("Espace anéchogène péricardique, systolo-diastolique (un décollement systolique postérieur < 3 mm est physiologique)",
          "Coupes sous-costale, parasternales et apicale 4 cavités ; bandes fibrineuses ou aspect dense hétérogène : hémopéricarde",
          "Quantification en télédiastole, mode TM en parasternale grand axe : < 10 mm faible, 10 à 20 mm moyen, > 20 mm abondant (cœur « dansant »)",
          "Pièges : franges graisseuses épicardiques antérieures, confusion avec un épanchement pleural, hématome localisé rétro-auriculaire après chirurgie cardiaque"),
        H4("2. Retentissement"),
        ul("Collapsus de l'oreillette droite (précoce, sensible ; grave si > 1/3 de la diastole), collapsus diastolique du VD (plus spécifique)",
          "Septum paradoxal respiratoire : bombe dans le VG à l'inspiration",
          "VCI dilatée, sans variation respiratoire",
          "Variations respiratoires des flux (Doppler pulsé, défilement lent) : baisse > 30 % de l'onde E mitrale, > 25 % de l'ITV sous-aortique"),
        warn("Les signes de compression dépendent de la volémie : majorés par l'hypovolémie, masqués par une hypertension des cavités droites. Un épanchement localisé (postopératoire) peut comprimer une seule cavité.")
      ], { tone: "alert" }),
      S("Valve aortique", [
        ul("Parasternale petit axe : trois cusps (coronaire droite, coronaire gauche, non coronaire) ; parasternale grand axe : deux cusps visibles",
          "Analyse : nombre de cusps, calcifications, ouverture, végétation, aorte ascendante"),
        tbl(["", "Insuffisance aortique", "Rétrécissement aortique"], [
          ["Causes", "Dégénérative, dilatation aortique, bicuspidie, endocardite, dissection, traumatisme", "Calcifications, bicuspidie, rhumatisme"],
          ["Retentissement", "Dilatation du VG (diamètre télédiastolique > 60 mm)", "Hypertrophie concentrique (> 12 mm), bourrelet septal, dilatation de l'OG"],
          ["Sévère si", "Jet jusqu'à mi-VG, vena contracta > 6 mm", "Vmax > 4 m/s, gradient moyen ≥ 40 mmHg, surface < 1 cm², rapport ITV chambre de chasse / ITV aortique ≤ 0,25"]
        ], "Doppler continu à travers la valve, pulsé dans la chambre de chasse.")
      ], { wide: true }),
      S("Valve mitrale", [
        ul("Parasternale grand axe et apicale 4 cavités ; l'ETO reste l'examen de référence",
          "Analyse : épaississement, prolapsus, restriction, rupture de cordage ou de pilier, végétation, calcifications, dilatation de l'anneau, SAM"),
        tbl(["", "Insuffisance mitrale", "Rétrécissement mitral"], [
          ["Description", "Mécanisme (prolapsus, restriction, perforation, dilatation de l'anneau), jet central ou excentré", "Calcifications, épaississement, restriction de mobilité"],
          ["Retentissement", "Dilatation de l'OG, altération de la FEVG, HTP", "Dilatation de l'OG, HTP, dilatation des cavités droites"],
          ["Sévère si", "Vena contracta > 6–7 mm ; ITV mitrale / ITV aortique > 1,4 ; flux triangulaire de Vmax > 5 m/s ; reflux dans les veines pulmonaires (hauteur du jet peu fiable)", "Gradient moyen > 10 mmHg (Doppler continu), dépendant de la fréquence, du débit et d'une fuite associée"]
        ])
      ], { wide: true })
    ],
    refs: [
      "Lang RM et al. Recommendations for cardiac chamber quantification by echocardiography in adults (ASE/EACVI). J Am Soc Echocardiogr 2015",
      "Nagueh SF et al. Recommendations for the evaluation of left ventricular diastolic function by echocardiography (ASE/EACVI). J Am Soc Echocardiogr 2016",
      "Monnet X, Teboul JL. Assessment of fluid responsiveness: recent advances. Curr Opin Crit Care 2018",
      "Vahanian A et al. 2021 ESC/EACTS Guidelines for the management of valvular heart disease. Eur Heart J 2022"
    ]
  };
  P17.route("#/echographie/ett", { title: "ETT", render: () => echoPage("#/echographie/ett", "ETT", ETT_FICHE) });

  P17.route("#/echographie/pleuro-pulmonaire", {
    title: "Échographie pleuro-pulmonaire",
    render: () => `
      <div class="page accent-echographie">
        <div class="page-head">
          ${P17.backLink("#/echographie", SEC)}
          ${P17.crumbs([...base, ["Pleuro-pulmonaire et diaphragme", "#/echographie/pleuro-pulmonaire"]])}
        </div>
        ${P17.fiche({ accent: "echographie", ...PP })}
      </div>`
  });

  const GEN_FICHE = {
    title: "Échographie générale", subtitle: "Reins, péritoine et vessie ; Doppler des artères rénales",
    tags: ["Dilatation pyélocalicielle", "FAST", "Globe vésical", "Index de résistance"],
    sections: [
      S("Échographie abdominale au lit", [
        info("Sonde convexe abdominale 2–5 MHz (à défaut, sonde cardiaque). Trois questions : obstacle urinaire, épanchement péritonéal, globe vésical."),
        tbl(["Recherche", "Indications", "Fenêtres", "Diagnostic positif"], [
          ["Dilatation pyélocalicielle", "Insuffisance rénale aiguë, pyélonéphrite, colique néphrétique", "Flancs droit et gauche, rein en coupe longitudinale", "Bassinet central anéchogène > 10 mm, calices dilatés en poches périphériques, uretère anormalement visible"],
          ["Hémopéritoine (FAST)", "Traumatisme abdominal, polytraumatisé, choc hémorragique postopératoire", "Flanc droit (espace hépato-rénal de Morison), flanc gauche (espace spléno-rénal), sus-pubienne", "Lame anéchogène hépato-rénale, spléno-rénale ou rétro-vésicale (cul-de-sac de Douglas)"],
          ["Globe vésical", "Oligo-anurie, douleur hypogastrique, agitation postopératoire", "Sus-pubienne, coupes transversale et longitudinale", "Vessie anéchogène distendue, arrondie"]
        ]),
        kv(["Volume vésical", "Hauteur × largeur × profondeur (cm) × 0,52 ≈ volume en mL ; ou 4/3 × π × r³ si la vessie est sphérique"],
          ["Seuil usuel", "> 400 à 500 mL avec impossibilité d'uriner : sondage évacuateur"])
      ], { wide: true }),
      S("Doppler des artères rénales", [
        { html: "<p>L'index de résistance des artères interlobaires renseigne sur la perfusion rénale au cours de l'insuffisance rénale aiguë : dépistage précoce, orientation fonctionnelle ou organique, réponse à une hausse de pression artérielle.</p>" },
        kv(["Technique", "Sonde convexe, Doppler couleur pour repérer les artères interlobaires (entre médullaire et corticale), puis Doppler pulsé ; moyenne de plusieurs mesures sur les deux reins"],
          ["Calcul", "IR = (Vitesse systolique maximale − vitesse télédiastolique) / vitesse systolique maximale"],
          ["Normale", "0,6 ± 0,1"]),
        tbl(["Situation", "Interprétation"], [
          ["IR > 0,7 sans insuffisance rénale", "Risque d'insuffisance rénale aiguë dans les jours suivants"],
          ["IR > 0,7 avec insuffisance rénale", "Atteinte plutôt organique et persistante (> 3 jours)"],
          ["Baisse de l'IR quand la PAM monte", "Argument pour un objectif de pression plus élevé"]
        ], "Influencé par l'âge, la fréquence cardiaque, la pression intra-abdominale et la ventilation. Mesure opérateur-dépendante ; aucune stratégie guidée par l'IR n'a prouvé de bénéfice.")
      ])
    ],
    refs: [
      "Rozycki GS et al. Surgeon-performed ultrasound for the assessment of truncal injuries (FAST). Ann Surg 1998",
      "Darmon M et al. Diagnostic accuracy of Doppler renal resistive index for reversibility of acute kidney injury in critically ill patients. Intensive Care Med 2011",
      "Schnell D, Darmon M. Renal Doppler to assess renal perfusion in the critically ill: a reappraisal. Intensive Care Med 2012"
    ]
  };
  const VASC_FICHE = {
    title: "Abords vasculaires échoguidés", subtitle: "Voies veineuses centrales, cathéters de dialyse, cathéters artériels et midlines",
    tags: ["Sonde linéaire", "Petit axe", "Grand axe", "Contrôle du guide"],
    sections: [
      S("Principes communs", [
        ul("Sonde linéaire 7–15 MHz, repérage avant l'asepsie : perméabilité, compressibilité de la veine, rapport avec l'artère, absence de thrombose",
          "Ponction échoguidée en temps réel, sonde sous gaine stérile ; petit axe (hors plan) ou grand axe (dans le plan), extrémité de l'aiguille visible en permanence",
          "Contrôle du guide dans la veine en petit et grand axe avant la dilatation",
          "Position de l'extrémité : échographie sous-costale (microbulles dans l'oreillette droite) ou radiographie ; rechercher un pneumothorax (glissement pleural)")
      ]),
      S("Choix du site", [
        tbl(["Site", "Indication", "Longueur usuelle", "Points clés"], [
          ["Jugulaire interne", "Cathéter veineux central et de dialyse : droite en première intention", "15–16 cm à droite, 20 cm à gauche", "Veine en dehors de la carotide, compressible. Permet la PVC et la ScvO₂. Risques : ponction carotidienne, pneumothorax, embolie gazeuse"],
          ["Sous-clavière", "Si les autres sites sont inaccessibles ; meilleur site pour l'infection et le confort", "15–16 cm à droite, 20 cm à gauche", "Voie sous- ou sus-claviculaire ; plèvre proche : pneumothorax et hémothorax plus fréquents, compression d'une artère impossible"],
          ["Fémorale veineuse", "Deuxième intention (infection, dysfonction) ; utile en instabilité ou trouble de l'hémostase", "20–25 cm", "Veine en dedans de l'artère ; ponctionner à au moins 2 cm sous le pli inguinal"],
          ["Radiale artérielle", "Cathéter artériel en première intention", "—", "L'échographie augmente le succès et réduit les complications ; vérifier la perméabilité des arcades palmaires (test d'Allen ou Doppler)"],
          ["Fémorale artérielle", "Deuxième intention", "—", "Plus de complications que la radiale (faux anévrisme, hématome) ; ponction sous le ligament inguinal"],
          ["Midline (veine basilique ou céphalique)", "Capital veineux difficile, voie périphérique prévue > 6 jours", "15–20 cm", "Ponction en petit axe au bras ; jusqu'à 28 jours. Pas de noradrénaline ni de nutrition parentérale exclusive"]
        ])
      ], { wide: true }),
      S("Complications à rechercher", [
        ul("Ponction artérielle, hématome : compression, sauf sous-clavière",
          "Pneumothorax ou hémothorax : glissement pleural après le geste",
          "Embolie gazeuse : tête basse à la pose et au retrait d'un cathéter cervical",
          "Malposition : contrôle échographique ou radiographique avant utilisation des catécholamines")
      ])
    ],
    refs: [
      "Lamperti M et al. International evidence-based recommendations on ultrasound-guided vascular access. Intensive Care Med 2012",
      "SFAR. Recommandations pour l'utilisation de l'échographie lors de la mise en place des accès vasculaires. 2015",
      "Timsit JF et al. Expert consensus-based clinical practice guidelines management of intravascular catheters in the intensive care unit. Ann Intensive Care 2020"
    ]
  };
  const DTC_FICHE = {
    title: "Doppler transcrânien", subtitle: "Hypertension intracrânienne, hypoperfusion cérébrale et vasospasme",
    tags: ["Artère cérébrale moyenne", "IP", "Lindegaard"],
    sections: [
      S("Technique", [
        kv(["Sonde", "Sectorielle basse fréquence (2 MHz), Doppler couleur puis pulsé"],
          ["Fenêtre", "Temporale, au-dessus de l'arcade zygomatique, en avant du tragus"],
          ["Repères", "Pédoncules cérébraux, aile du sphénoïde, faux du cerveau"],
          ["Artères", "Cérébrale moyenne (45 à 60 mm de profondeur, flux vers la sonde), cérébrales antérieure et postérieure, tronc basilaire (fenêtre occipitale)"],
          ["Indications", "Neurotraumatisé, hémorragie méningée, suspicion d'HTIC, arrêt circulatoire cérébral (flux diastolique inversé, en appui de la mort encéphalique)"])
      ]),
      S("Hypertension intracrânienne et hypoperfusion", [
        kv(["Mesures", "Vitesse systolique (Vs), télédiastolique (Vd) et moyenne (Vm) sur l'artère cérébrale moyenne"],
          ["Index de pulsatilité", "IP = (Vs − Vd) / Vm"]),
        tbl(["Signe", "Seuil d'alerte"], [
          ["Vitesse diastolique", "< 20 à 25 cm/s ; flux diastolique nul puis inversé à un stade ultime"],
          ["Vitesse moyenne", "< 30 à 35 cm/s"],
          ["Index de pulsatilité", "> 1,2 à 1,4"]
        ], "À interpréter avec la PaCO₂, l'hémoglobine, la pression artérielle et le débit cardiaque. Un DTC anormal impose une action rapide : pression de perfusion, osmothérapie, imagerie."),
      ], { tone: "alert" }),
      S("Vasospasme", [
        kv(["Principe", "Accélération des vitesses dans l'artère rétrécie (hémorragie méningée, surtout entre J4 et J14)"],
          ["Index de Lindegaard", "Vm de l'artère cérébrale moyenne / Vm de la carotide interne cervicale"]),
        tbl(["Résultat", "Interprétation"], [
          ["Vm cérébrale moyenne > 120 cm/s", "Accélération significative"],
          ["Lindegaard < 3", "Hyperhémie (débit global élevé)"],
          ["Lindegaard > 3", "Vasospasme ; sévère si > 6 (ou Vm > 200 cm/s)"]
        ])
      ])
    ],
    refs: [
      "Rasulo FA et al. Transcranial Doppler as a screening test to exclude intracranial hypertension in brain-injured patients. Crit Care 2017",
      "Ract C et al. Transcranial Doppler ultrasound goal-directed therapy for the early management of severe traumatic brain injury. Intensive Care Med 2007",
      "Lindegaard KF et al. Cerebral vasospasm diagnosis by means of angiography and blood velocity measurements. Acta Neurochir 1989"
    ]
  };
  P17.route("#/echographie/abords-vasculaires", { title: "Abords vasculaires", render: () => echoPage("#/echographie/abords-vasculaires", "Abords vasculaires", VASC_FICHE) });
  P17.route("#/echographie/doppler-transcranien", { title: "Doppler transcrânien", render: () => echoPage("#/echographie/doppler-transcranien", "Doppler transcrânien", DTC_FICHE) });
  P17.route("#/echographie/generale", { title: "Échographie générale", render: () => echoPage("#/echographie/generale", "Échographie générale", GEN_FICHE) });

  P17.index("#/echographie", SEC, "echo ultrasons", SEC);
  P17.index("#/echographie/bases", "Bases et sémiologie échographique", "sonde linéaire convexe sectorielle réglages gain profondeur échogénicité anéchogène hypoéchogène hyperéchogène artefact cône d'ombre renforcement réverbération miroir doppler couleur pulsé TM orientation", SEC);
  P17.index("#/echographie/ett", "ETT — échocardiographie transthoracique", "coupes parasternale apicale sous-costale débit cardiaque ITV précharge-dépendance VCI lever de jambes pressions de remplissage E/A E/e' cinétique segmentaire 17 segments ventricule droit TAPSE HTP PAPs tamponnade valve aortique mitrale", SEC);
  P17.index("#/echographie/pleuro-pulmonaire", "Échographie pleuro-pulmonaire et diaphragmatique", "poumon LUS score aération lignes B lignes A pneumothorax point poumon épanchement pleural volume Balik Vignon diaphragme course excursion épaississement D-RSBI sevrage BLUE PLAPS atélectasie", SEC);
  P17.index("#/echographie/generale", "Échographie générale : abdomen et reins", "FAST hémopéritoine Morison Douglas dilatation pyélocalicielle globe vésical index de résistance rénal Doppler", SEC);
  P17.index("#/echographie/abords-vasculaires", "Abords vasculaires échoguidés", "voie veineuse centrale jugulaire fémorale cathéter artériel ponction", SEC);
  P17.index("#/echographie/doppler-transcranien", "Doppler transcrânien", "DTC artère cérébrale moyenne index de pulsatilité HTIC vasospasme Lindegaard", SEC);
})();
