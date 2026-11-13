/* =====================================================================
   Échographie : ETT (fiches-mémos), échographie pleuro-pulmonaire et
   diaphragmatique (fiche + outils : score LUS, volume d'épanchement,
   diaphragme), échographie générale.
   ===================================================================== */
(function () {
  const SEC = "Échographie";
  const I = n => `assets/img/echo/${n}.webp`;
  const FG = n => `assets/img/echo/fig/${n}.webp`;
  // Dimensions des schémas (évite les sauts de mise en page au chargement)
  const DIM = {"base-doppler-couleur":[640,300],"base-doppler-pulse":[640,260],"base-echogenicite":[640,260],"base-miroir":[640,400],"base-ombre-renforcement":[640,360],"base-reverberation":[640,480],"dia-epaisseur":[646,320],"dia-sous-costale":[640,480],"dia-tm-course":[640,320],"pp-condensation":[640,480],"pp-epanchement":[640,480],"pp-lignes-a":[640,480],"pp-lignes-b":[640,480],"pp-lus-0":[320,240],"pp-lus-1":[320,240],"pp-lus-2":[320,240],"pp-lus-3":[320,240],"pp-poumon-blanc":[640,480],"pp-tm-bord-de-mer":[640,300],"pp-tm-code-barres":[640,300],"pp-tm-point-poumon":[640,300],"pp-tm-sinusoide":[640,300]};
  const figs = (list, cols) => ({ figs: list.map(([n, c]) => ({ img: FG(n), caption: c, w: (DIM[n] || [])[0], h: (DIM[n] || [])[1] })), cols });
  const memos = list => ({ html: P17.gallery(list.map(([n, t]) => ({ src: I(n), title: t }))) });
  const MEMO_PP = [["pp-m1", "Sémiologie de base (1/2)"], ["pp-m2", "Sémiologie de base (2/2)"], ["pp-m3", "Protocole d'examen et score LUS"], ["pp-m4", "Profils diagnostiques (BLUE)"],
    ["pp-m5", "Épanchement pleural"], ["pp-m6", "Pneumothorax"], ["pp-m7", "Échographie diaphragmatique"], ["pp-m8", "Applications en réanimation chirurgicale"], ["echopoumon", "Synthèse pleuro-pulmonaire"], ["echodiaph", "Synthèse diaphragme"]];
  const MEMO_BASE = [["base-m1", "Sondes, réglages, orientation, modes"], ["base-m2", "Échogénicité et artefacts"], ["base-m3", "Doppler : principes et pratique"]];
  const base = [[SEC, "#/echographie"]];
  const { S, ul, ult, kv, tbl, warn, info, ok, danger } = P17.h;
  const F = window.P17Calc;
  const f = P17.fmt;

  const ETT = [
    ["Principales coupes (1/2)", "ett1"], ["Principales coupes (2/2)", "ett2"],
    ["Estimation du débit cardiaque", "ettDC"], ["Évaluation d'une HTP", "ettHTAP"],
    ["Précharge-dépendance", "ettPC"], ["Tamponnade péricardique", "ettpericarde"],
    ["Pressions de remplissage du VG", "ettptdvg"], ["Cinétique segmentaire du VG", "ettseg"],
    ["Valve aortique", "ettVA"], ["Fonction ventriculaire droite", "ettVD"], ["Valve mitrale", "ettVM"]
  ];
  const GEN = [
    ["Échographie abdominale", "echoabdo"], ["Doppler transcrânien", "echodtc"],
    ["Doppler des artères rénales", "echorein"], ["Abords vasculaires échoguidés", "echovascu"]
  ];

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
        ])
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
      ]),
      S("Fiches-mémos", [memos(MEMO_PP)], { wide: true })
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
      ], { wide: true }),
      S("Fiches-mémos", [memos(MEMO_BASE)], { wide: true })
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
        { href: "#/echographie/bases", title: "Bases et sémiologie échographique", desc: "Sondes, réglages, échogénicité, artefacts, TM et Doppler : à lire en premier", img: I("base-m2"), accent: "echographie" },
        { href: "#/echographie/ett", title: "Échocardiographie transthoracique", desc: "Coupes, débit, précharge, pressions de remplissage, VD, valves", img: I("ett1"), accent: "echographie" },
        { href: "#/echographie/pleuro-pulmonaire", title: "Échographie pleuro-pulmonaire et diaphragme", desc: "Sémiologie, score LUS, profils BLUE, épanchement, pneumothorax, diaphragme", img: I("pp-m1"), accent: "echographie" },
        { href: "#/echographie/abords-vasculaires", title: "Abords vasculaires échoguidés", desc: "Voies centrales, périphériques, artérielles", img: I("echovascu"), accent: "echographie" },
        { href: "#/echographie/doppler-transcranien", title: "Doppler transcrânien", desc: "Artère cérébrale moyenne, seuils d'alerte", img: I("echodtc"), accent: "echographie" },
        { href: "#/echographie/generale", title: "Échographie générale", desc: "Abdomen, reins", img: I("echoabdo"), accent: "echographie" }
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

  // Planches (fiches-mémos) présentées comme les autres fiches : une partie par thème
  const planche = (n, t) => ({ figs: [{ img: I(n), caption: t }], cols: 1 });
  const planches = list => ({ figs: list.map(([n, t]) => ({ img: I(n), caption: t })), cols: 2 });
  const echoPage = (path, label, fiche) => `
      <div class="page accent-echographie">
        <div class="page-head">
          ${P17.backLink("#/echographie", SEC)}
          ${P17.crumbs([...base, [label, path]])}
        </div>
        ${P17.fiche({ accent: "echographie", kicker: SEC, ...fiche })}
      </div>`;
  const ETT_FICHE = {
    title: "Échocardiographie transthoracique", subtitle: "Coupes de référence, débit cardiaque, précharge, pressions de remplissage, ventricule droit, péricarde et valves",
    tags: ["ITV sous-aortique", "VCI", "E/e'", "TAPSE"],
    sections: [
      S("Coupes de référence", [ul("Parasternale grand axe et petit axe, apicale 4 et 5 cavités, sous-costale, veine cave inférieure", "Sonde sectorielle 2–4 MHz ; repère à droite de l'écran en mode cardiaque"), planches([["ett1", "Principales coupes (1/2)"], ["ett2", "Principales coupes (2/2)"]])], { wide: true }),
      S("Débit cardiaque", [kv(["Formule", "Débit = ITV sous-aortique × surface de la chambre de chasse × FC"], ["ITV sous-aortique", "Normale 18–22 cm ; < 14 cm : bas débit probable"], ["Suivi", "À diamètre constant, la variation de l'ITV reflète celle du volume d'éjection"]), planche("ettDC", "Estimation du débit cardiaque")]),
      S("Précharge-dépendance", [ul("Variation respiratoire de l'ITV ou de la Vmax sous-aortique > 12 % (ventilation contrôlée, Vt ≥ 8 mL/kg, rythme sinusal)", "Lever de jambes passif : hausse de l'ITV ≥ 10 % (valable en ventilation spontanée)", "Veine cave inférieure : petite et collabée en faveur d'une hypovolémie ; dilatée et fixe contre le remplissage"), planche("ettPC", "Précharge-dépendance")]),
      S("Pressions de remplissage du VG", [kv(["E/A", "< 0,8 avec E < 50 cm/s : pressions basses ; > 2 : pressions élevées"], ["E/e' moyen", "> 14 : pressions de remplissage élevées"], ["Autres signes", "Oreillette gauche dilatée, vitesse de l'insuffisance tricuspide > 2,8 m/s"]), planche("ettptdvg", "Pressions de remplissage du VG")]),
      S("Cinétique segmentaire du VG", [ul("17 segments, cotés de la normokinésie à l'akinésie et à la dyskinésie", "Un trouble segmentaire dans un territoire coronaire oriente vers une ischémie"), planche("ettseg", "Cinétique segmentaire du VG")]),
      S("Ventricule droit et hypertension pulmonaire", [kv(["Dilatation", "Rapport des surfaces VD/VG > 0,6 ; > 1 : dilatation sévère"], ["Fonction systolique", "TAPSE < 17 mm ou onde S' < 9,5 cm/s : dysfonction"], ["Septum paradoxal", "Surcharge de pression du VD (cœur pulmonaire aigu)"], ["PAPs", "4 × Vmax² de l'insuffisance tricuspide + pression de l'oreillette droite"]), planches([["ettVD", "Fonction ventriculaire droite"], ["ettHTAP", "Évaluation d'une HTP"]])], { wide: true }),
      S("Tamponnade péricardique", [ul("Épanchement péricardique avec collapsus diastolique des cavités droites", "Veine cave inférieure dilatée, peu compliante", "Variations respiratoires exagérées des flux mitral (> 25 %) et tricuspide"), planche("ettpericarde", "Tamponnade péricardique")], { tone: "alert" }),
      S("Valves", [ul("Rétrécissement aortique serré : Vmax > 4 m/s, gradient moyen > 40 mmHg, surface < 1 cm²", "Insuffisances aortique et mitrale : mécanisme, extension du jet, retentissement sur les cavités"), planches([["ettVA", "Valve aortique"], ["ettVM", "Valve mitrale"]])], { wide: true })
    ],
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
    title: "Échographie générale", subtitle: "Abdomen et reins : épanchement, globe, obstacle, perfusion rénale",
    tags: ["FAST", "Globe vésical", "Index de résistance"],
    sections: [
      S("Échographie abdominale", [ul("Recherche d'un épanchement (FAST) : espace de Morrison, espace spléno-rénal, cul-de-sac de Douglas", "Globe vésical, dilatation des cavités pyélocalicielles, vésicule biliaire"), planche("echoabdo", "Échographie abdominale")]),
      S("Doppler des artères rénales", [kv(["Index de résistance", "(Vs − Vd) / Vs sur les artères interlobaires"], ["Interprétation", "Normal < 0,70 ; élevé en cas d'atteinte rénale ou de congestion"]), planche("echorein", "Doppler des artères rénales")])
    ]
  };
  const VASC_FICHE = {
    title: "Abords vasculaires échoguidés", subtitle: "Voies veineuses centrales et périphériques, cathéter artériel",
    tags: ["Sonde linéaire", "Dans le plan", "Contrôle du guide"],
    sections: [
      S("Repérage", [ul("Sonde linéaire, repérage avant l'asepsie : perméabilité, compressibilité de la veine, rapports avec l'artère", "Veine jugulaire interne : en dehors de la carotide, compressible ; fémorale : en dedans de l'artère")]),
      S("Ponction", [ul("Ponction dans le plan ou hors plan, extrémité de l'aiguille visible en permanence", "Contrôle du guide dans la veine, en petit et grand axe, avant la dilatation", "Position de l'extrémité du cathéter : échographie sous-costale (test aux microbulles) ou radiographie")]),
      S("Planche", [planche("echovascu", "Abords vasculaires échoguidés")], { wide: true })
    ]
  };
  const DTC_FICHE = {
    title: "Doppler transcrânien", subtitle: "Dépister une hypoperfusion cérébrale",
    tags: ["Artère cérébrale moyenne", "Vd < 20 cm/s", "IP > 1,4"],
    sections: [
      S("Technique", [kv(["Sonde", "Sectorielle basse fréquence, mode Doppler pulsé"], ["Fenêtre", "Temporale, au-dessus de l'arcade zygomatique"], ["Vaisseau", "Artère cérébrale moyenne, à 45–60 mm de profondeur"])]),
      S("Interprétation", [kv(["Seuils d'alerte", "Vitesse diastolique < 20 cm/s, index de pulsatilité > 1,4"], ["Intérêt", "Traumatisme crânien, hypertension intracrânienne : dépistage d'une hypoperfusion"])]),
      S("Planche", [planche("echodtc", "Doppler transcrânien")], { wide: true })
    ]
  };
  P17.route("#/echographie/abords-vasculaires", { title: "Abords vasculaires", render: () => echoPage("#/echographie/abords-vasculaires", "Abords vasculaires", VASC_FICHE) });
  P17.route("#/echographie/doppler-transcranien", { title: "Doppler transcrânien", render: () => echoPage("#/echographie/doppler-transcranien", "Doppler transcrânien", DTC_FICHE) });
  P17.route("#/echographie/generale", { title: "Échographie générale", render: () => echoPage("#/echographie/generale", "Échographie générale", GEN_FICHE) });

  P17.index("#/echographie", SEC, "echo ultrasons", SEC);
  P17.index("#/echographie/bases", "Bases et sémiologie échographique", "sonde linéaire convexe sectorielle réglages gain profondeur échogénicité anéchogène hypoéchogène hyperéchogène artefact cône d'ombre renforcement réverbération miroir doppler couleur pulsé TM orientation", SEC);
  P17.index("#/echographie/ett", "ETT — échocardiographie transthoracique", ETT.map(x => x[0]).join(" "), SEC);
  P17.index("#/echographie/pleuro-pulmonaire", "Échographie pleuro-pulmonaire et diaphragmatique", "poumon LUS score aération lignes B lignes A pneumothorax point poumon épanchement pleural volume Balik Vignon diaphragme course excursion épaississement D-RSBI sevrage BLUE PLAPS atélectasie", SEC);
  P17.index("#/echographie/generale", "Échographie générale : abdomen et reins", "FAST épanchement globe vésical index de résistance rénal", SEC);
  P17.index("#/echographie/abords-vasculaires", "Abords vasculaires échoguidés", "voie veineuse centrale jugulaire fémorale cathéter artériel ponction", SEC);
  P17.index("#/echographie/doppler-transcranien", "Doppler transcrânien", "DTC artère cérébrale moyenne index de pulsatilité HTIC", SEC);
})();
