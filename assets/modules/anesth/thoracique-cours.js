/* =====================================================================
   Chirurgie thoracique : cours et techniques (VATS, wedge, ventilation
   unipulmonaire, sonde double lumière, bloqueurs bronchiques, péridurale
   thoracique) et analgésie après chirurgie thoracique.
   Rattaché à la spécialité « thoracique » (groupes de la page spécialité).
   ===================================================================== */
(function () {
  const { S, ul, ult, ol, kv, tbl, warn, danger, info, ok } = P17.h;
  const F = window.P17Calc;
  const f = P17.fmt;
  const G_COURS = "Principes et techniques";
  const G_ANALG = "Analgésie";
  const REF_ERAS = "Batchelor TJP et al. ERAS Society and ESTS guidelines for enhanced recovery after lung surgery. Eur J Cardiothorac Surg 2019";
  const REF_PROSPECT = "Feray S et al. PROSPECT guideline for video-assisted thoracoscopic surgery. Anaesthesia 2022";
  const REF_SLINGER = "Slinger P (ed.). Principles and Practice of Anesthesia for Thoracic Surgery, 2nd ed. Springer 2019";
  const REF_LOHSER = "Lohser J, Slinger P. Lung injury after one-lung ventilation. Anesth Analg 2015";
  const REF_CAMPOS = "Campos JH. Lung isolation techniques for patients with difficult airway. Curr Opin Anaesthesiol 2010 ; Campos JH et al. Anesthesiology 2006 (comparaison DLT et bloqueurs)";
  const REF_ESAIC = "Kietaibl S et al. Regional anaesthesia in patients on antithrombotic drugs: joint ESAIC/ESRA guidelines. Eur J Anaesthesiol 2022";
  const REF_GIHP26 = "RFE GIHP-SFAR 2026 : Gestion des anticoagulants pour une procédure invasive programmée";
  const REF_SFAR_DOUL = "RFE SFAR 2016 : Réactualisation de la recommandation sur la douleur postopératoire";
  const REF_JCOG = "Saji H et al. Segmentectomy versus lobectomy in small-sized peripheral NSCLC (JCOG0802). Lancet 2022 ; Altorki N et al. Lobar or sublobar resection for peripheral stage IA NSCLC (CALGB 140503). N Engl J Med 2023";
  const fig = (svg, cap) => ({ html: `<figure class="anat">${svg}${cap ? `<figcaption>${cap}</figcaption>` : ""}</figure>` });

  /* ---------------- Illustrations (SVG, couleurs du thème) ---------------- */
  const AIRWAY = (extra = "", w = 1) => `
    <g class="aw">
      <path d="M240 0 L240 180" class="aw-o" stroke-width="${64 * w}"/><path d="M240 0 L240 180" class="aw-i" stroke-width="${50 * w}"/>
      <path d="M240 180 L172 288 L156 350" class="aw-o" stroke-width="${44 * w}"/><path d="M240 180 L172 288 L156 350" class="aw-i" stroke-width="${32 * w}"/>
      <path d="M204 236 L122 210" class="aw-o" stroke-width="${30 * w}"/><path d="M204 236 L122 210" class="aw-i" stroke-width="${20 * w}"/>
      <path d="M240 180 Q300 204 360 240" class="aw-o" stroke-width="${44 * w}"/><path d="M240 180 Q300 204 360 240" class="aw-i" stroke-width="${32 * w}"/>
      <path d="M360 240 L440 198" class="aw-o" stroke-width="${30 * w}"/><path d="M360 240 L440 198" class="aw-i" stroke-width="${20 * w}"/>
      <path d="M360 240 L420 346" class="aw-o" stroke-width="${30 * w}"/><path d="M360 240 L420 346" class="aw-i" stroke-width="${20 * w}"/>
      ${[24, 52, 80, 108, 136].map(y => `<path d="M212 ${y} Q240 ${y + 8} 268 ${y}" class="aw-ring"/>`).join("")}
      ${extra}
    </g>`;

  const SVG_DLT = `<svg viewBox="0 0 900 390" role="img" aria-label="Position d'une sonde double lumière gauche et vues fibroscopiques">
    ${AIRWAY(`
      <path d="M240 -10 L240 150" class="tube-o" stroke-width="34"/><path d="M240 -10 L240 150" class="tube-i" stroke-width="28"/>
      <ellipse cx="240" cy="92" rx="33" ry="15" class="cuff-t"/>
      <rect x="226" y="148" width="28" height="9" rx="3" class="port"/>
      <path d="M248 150 Q268 190 302 212 Q322 225 338 233" class="tube-o" stroke-width="22"/><path d="M248 150 Q268 190 302 212 Q322 225 338 233" class="tube-i" stroke-width="16"/>
      <ellipse cx="304" cy="214" rx="20" ry="13" transform="rotate(30 304 214)" class="cuff-b"/>`)}
    <g class="lab">
      <line x1="275" y1="92" x2="330" y2="70"/><text x="334" y="66">Ballonnet trachéal</text><text x="334" y="82" class="sm">(gonflé jusqu'à l'étanchéité)</text>
      <line x1="255" y1="153" x2="330" y2="128"/><text x="334" y="124">Orifice de la lumière trachéale</text><text x="334" y="140" class="sm">au-dessus de la carène</text>
      <line x1="320" y1="214" x2="440" y2="250"/><text x="444" y="246">Ballonnet bronchique bleu</text><text x="444" y="262" class="sm">5 à 10 mm sous la carène,</text><text x="444" y="276" class="sm">dans la bronche souche gauche</text>
      <line x1="240" y1="186" x2="180" y2="150"/><text x="54" y="140">Carène</text>
      <line x1="140" y1="214" x2="90" y2="250"/><text x="10" y="266">Bronche lobaire</text><text x="10" y="282">supérieure droite</text><text x="10" y="298" class="sm">(≈ 2 cm de la carène)</text>
      <text x="200" y="372" class="sm">D (patient)</text><text x="380" y="372" class="sm">G (patient)</text>
    </g>
    <g transform="translate(800,112)">
      <circle r="74" class="scope"/><path d="M-6 -60 Q0 0 -6 60" class="ridge"/>
      <ellipse cx="-38" cy="6" rx="26" ry="34" class="hole"/><ellipse cx="34" cy="6" rx="28" ry="36" class="hole"/>
      <path d="M10 -22 Q34 -36 58 -20" class="blue-edge"/>
      <text y="-84" class="cap" text-anchor="middle">Par la lumière trachéale</text>
      <text x="-38" y="58" class="sm-w" text-anchor="middle">BSD</text><text x="34" y="58" class="sm-w" text-anchor="middle">BSG</text>
      <text y="92" class="sm" text-anchor="middle">bord bleu à peine visible</text>
    </g>
    <g transform="translate(800,300)">
      <circle r="70" class="scope"/><path d="M0 -50 Q4 0 0 50" class="ridge"/>
      <ellipse cx="-28" cy="0" rx="22" ry="30" class="hole"/><ellipse cx="28" cy="4" rx="22" ry="28" class="hole"/>
      <text y="-80" class="cap" text-anchor="middle">Par la lumière bronchique</text>
      <text x="-28" y="46" class="sm-w" text-anchor="middle">LSG</text><text x="28" y="46" class="sm-w" text-anchor="middle">LIG</text>
    </g>
  </svg>`;

  const SVG_BB = `<svg viewBox="0 0 790 360" role="img" aria-label="Bloqueurs bronchiques : position gauche, droite et bloqueur bifide">
    ${[0, 1, 2].map(k => `<g transform="translate(${k * 265 - 34},26) scale(0.6)">${AIRWAY(k === 0 ? `
      <path d="M240 -10 L240 120" class="tube-o" stroke-width="34"/><path d="M240 -10 L240 120" class="tube-i" stroke-width="28"/><ellipse cx="240" cy="80" rx="33" ry="14" class="cuff-t"/>
      <path d="M232 -10 L232 130 Q238 170 268 196 Q300 214 322 226" class="bb"/><circle cx="318" cy="224" r="17" class="balloon"/>
      <path d="M250 -10 L250 132" class="fob"/><circle cx="250" cy="134" r="4" class="fob-tip"/>` : k === 1 ? `
      <path d="M240 -10 L240 120" class="tube-o" stroke-width="34"/><path d="M240 -10 L240 120" class="tube-i" stroke-width="28"/><ellipse cx="240" cy="80" rx="33" ry="14" class="cuff-t"/>
      <path d="M244 -10 L244 130 Q236 176 214 214" class="bb"/><circle cx="214" cy="214" r="16" class="balloon"/>
      <circle cx="198" cy="236" r="15" class="warn-ring"/>` : `
      <path d="M240 -10 L240 120" class="tube-o" stroke-width="34"/><path d="M240 -10 L240 120" class="tube-i" stroke-width="28"/><ellipse cx="240" cy="80" rx="33" ry="14" class="cuff-t"/>
      <path d="M240 -10 L240 176 Q226 196 212 222 M240 176 Q270 196 296 212" class="bb"/>
      <circle cx="296" cy="212" r="15" class="balloon"/><circle cx="212" cy="222" r="7" class="balloon-off"/>`)}</g>`).join("")}
    <g class="lab">
      ${[["1. Bronche souche gauche", "Bloqueur à boucle (type Arndt)", "guidé par le fibroscope"], ["2. Bronche souche droite", "Ballonnet juste sous la carène :", "lobaire supérieure droite proche (cercle)"], ["3. Bloqueur bifide (type EZ-Blocker)", "Branches à cheval sur la carène,", "un seul ballonnet gonflé"]].map(([t, a, b], k) => `
        <text x="${k * 265 + 20}" y="${290}" class="cap">${t}</text><text x="${k * 265 + 20}" y="${308}" class="sm">${a}</text><text x="${k * 265 + 20}" y="${324}" class="sm">${b}</text>`).join("")}
      <text x="20" y="350" class="sm">Orange : bloqueur · noir : fibroscope · bleu : ballonnet gonflé</text>
    </g>
  </svg>`;

  const SVG_OLV = `<svg viewBox="0 0 700 270" role="img" aria-label="Physiologie de la ventilation unipulmonaire en décubitus latéral">
    <rect x="20" y="20" width="300" height="230" rx="18" class="box"/>
    <path d="M70 70 Q170 38 270 70 Q292 100 270 118 Q170 132 70 118 Q48 96 70 70Z" class="lung-off"/>
    <text x="170" y="96" text-anchor="middle" class="cap">Poumon opéré, non ventilé</text>
    <text x="170" y="112" text-anchor="middle" class="sm">vasoconstriction pulmonaire hypoxique</text>
    <path d="M60 150 Q170 128 280 150 Q306 190 280 222 Q170 244 60 222 Q34 190 60 150Z" class="lung-on"/>
    <text x="170" y="186" text-anchor="middle" class="cap">Poumon dépendant ventilé</text>
    <text x="170" y="202" text-anchor="middle" class="sm">reçoit l'essentiel du débit (gravité + VPH)</text>
    <text x="170" y="266" text-anchor="middle" class="sm">Décubitus latéral : table opératoire</text>
    <g class="lab">
      <path d="M360 70 h60" class="flow" marker-end="url(#ar)"/><text x="430" y="66" class="cap">≈ 20–30 % du débit</text><text x="430" y="82" class="sm">= shunt vrai (sang non oxygéné)</text>
      <path d="M360 190 h110" class="flow2" marker-end="url(#ar2)"/><text x="490" y="186" class="cap">≈ 70–80 % du débit</text><text x="490" y="202" class="sm">échanges gazeux</text>
      <text x="360" y="236" class="sm">Hypoxémie (SpO₂ &lt; 90 %) : environ 5 à 10 % des cas,</text><text x="360" y="252" class="sm">maximale 20 à 30 min après le début de l'unipulmonaire</text>
    </g>
    <defs><marker id="ar" markerUnits="userSpaceOnUse" markerWidth="16" markerHeight="16" refX="12" refY="8" orient="auto"><path d="M0,0 L16,8 L0,16Z" class="mk"/></marker>
      <marker id="ar2" markerUnits="userSpaceOnUse" markerWidth="22" markerHeight="22" refX="16" refY="11" orient="auto"><path d="M0,0 L22,11 L0,22Z" class="mk2"/></marker></defs>
  </svg>`;

  const SVG_PAROI = `<svg viewBox="0 0 720 360" role="img" aria-label="Coupe transversale de la paroi thoracique et sites des blocs">
    <path d="M0 360 L0 300 Q120 120 360 40 L720 40 L720 360Z" class="skin"/>
    <path d="M40 320 Q150 160 360 82 L720 82 L720 360 L60 360Z" class="muscle"/>
    <text x="560" y="66" class="sm">Trapèze, rhomboïdes</text>
    <path d="M300 150 Q420 96 540 110 Q600 118 610 150 Q560 186 460 176 Q360 168 300 150Z" class="erector"/>
    <text x="450" y="146" text-anchor="middle" class="cap">Muscles érecteurs du rachis</text>
    <rect x="560" y="196" width="120" height="96" rx="40" class="bone"/><text x="620" y="250" text-anchor="middle" class="sm">Corps vertébral</text>
    <path d="M520 176 L600 196" class="bone-l" stroke-width="20"/>
    <circle cx="640" cy="170" r="22" class="canal"/><circle cx="640" cy="170" r="11" class="cord"/>
    <path d="M520 190 Q360 200 210 262 Q120 300 70 350" class="rib" stroke-width="16"/><text x="210" y="248" class="sm">Côte</text>
    <path d="M560 300 Q430 236 240 292 Q140 322 110 360" class="pleura"/><text x="300" y="300" class="sm">Plèvre pariétale</text>
    <path d="M110 360 Q140 330 240 304 Q430 252 560 312 L560 360Z" class="lung-on"/><text x="380" y="344" class="cap">Poumon</text>
    <path d="M60 330 Q120 240 220 196" class="serratus" stroke-width="16"/><text x="34" y="222" class="sm">Dentelé antérieur</text>
    <g class="pts">
      <circle cx="640" cy="148" r="11"/><text x="640" y="152">1</text>
      <circle cx="548" cy="222" r="11"/><text x="548" y="226">2</text>
      <circle cx="532" cy="160" r="11"/><text x="532" y="164">3</text>
      <circle cx="250" cy="258" r="11"/><text x="250" y="262">4</text>
      <circle cx="150" cy="232" r="11"/><text x="150" y="236">5</text>
    </g>
    <g class="lab"><line x1="560" y1="186" x2="610" y2="118"/><text x="560" y="112" class="sm">Processus transverse</text>
      <text x="10" y="20" class="cap">1 Péridurale · 2 Paravertébral · 3 Plan des érecteurs (ESP) · 4 Intercostal · 5 Plan du dentelé antérieur</text>
    </g>
  </svg>`;

  const SVG_VATS = `<svg viewBox="0 0 700 280" role="img" aria-label="Voies d'abord de la thoracoscopie">
    <path d="M60 220 Q60 130 160 106 L520 96 Q620 96 640 150 Q650 210 600 226 L120 236 Q64 232 60 210Z" class="skin"/>
    <path d="M520 86 Q560 40 640 24" class="arm" stroke-width="34"/>
    ${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${200 + i * 52} 98 Q${226 + i * 52} 170 ${190 + i * 52} 230" class="ribline"/>`).join("")}
    <text x="80" y="262" class="sm">Patient en décubitus latéral, bras surélevé (vue du côté opéré)</text>
    <g class="pts">
      <circle cx="330" cy="140" r="11"/><text x="330" y="144">U</text>
      <circle cx="430" cy="196" r="10"/><text x="430" y="200">C</text>
      <circle cx="282" cy="150" r="10"/><text x="282" y="154">A</text>
      <circle cx="520" cy="170" r="10"/><text x="520" y="174">P</text>
    </g>
    <g class="lab">
      <text x="20" y="22" class="cap">U : uniportal, 4e–5e espace, ligne axillaire antérieure (incision 3–4 cm)</text>
      <text x="20" y="40" class="sm">Triportal : C caméra 7e–8e espace, ligne axillaire moyenne ; A port antérieur 4e–5e espace ;</text><text x="20" y="56" class="sm">P port postérieur 7e espace (pointe de la scapula)</text>
    </g>
  </svg>`;

  const SVG_WEDGE = `<svg viewBox="0 0 640 260" role="img" aria-label="Résection atypique d'un nodule périphérique">
    <path d="M80 220 Q40 120 120 60 Q220 0 360 24 Q520 52 560 150 Q580 210 520 236 Q300 262 80 220Z" class="lung-on"/>
    <path d="M410 40 L330 150 L560 170" class="staple"/>
    <circle cx="470" cy="112" r="20" class="nodule"/>
    <path d="M478 130 L500 186" class="lab-l"/><text x="420" y="204" class="cap">Nodule périphérique</text>
    <path d="M444 106 L392 122" class="margin"/><text x="140" y="78" class="sm">marge ≥ 2 cm ou ≥ taille du nodule</text>
    <text x="120" y="150" class="cap">Lobe pulmonaire</text>
    <text x="120" y="236" class="sm">Ligne d'agrafage en V (agrafeuse endoscopique)</text>
    <path d="M330 150 L280 222" class="lab-l"/>
  </svg>`;

  const SVG_PERI = `<svg viewBox="0 0 800 290" role="img" aria-label="Abord péridural thoracique médian et paramédian">
    ${[0, 1, 2].map(i => `<g transform="translate(${i * 190},0)">
      <rect x="40" y="170" width="120" height="70" rx="16" class="bone"/>
      <path d="M100 150 L190 70 L206 84 L120 168Z" class="bone"/>
    </g>`).join("")}
    <path d="M10 156 L690 156" class="dura"/><path d="M10 136 L690 136" class="dura"/>
    <rect x="10" y="138" width="680" height="16" class="cord"/>
    <text x="16" y="130" class="sm">Espace péridural</text><text x="16" y="270" class="sm">Corps vertébraux</text>
    <path d="M420 10 L332 128" class="needle"/><text x="300" y="20" class="cap">Médian : angulation céphalique 45–60°</text>
    <path d="M560 30 L480 130" class="needle needle2"/><text x="566" y="44" class="sm">Paramédian : 1 cm latéral,</text><text x="566" y="60" class="sm">contact de la lame</text><text x="566" y="76" class="sm">puis « marche » vers le haut</text>
    <text x="60" y="58" class="sm">Processus épineux très obliques (T4–T9)</text>
  </svg>`;

  /* ---------------- Outil : sonde double lumière ---------------- */
  const dltTool = P17.calc({
    id: "dlt", kind: "tool", title: "Taille et profondeur de la sonde double lumière",
    desc: "Taille selon le sexe et la taille ; si un scanner est disponible, la mesure de la bronche souche gauche est plus précise.",
    fields: [
      { id: "sexe", label: "Sexe", type: "seg", options: [["H", "Homme"], ["F", "Femme"]] },
      { id: "taille", label: "Taille", unit: "cm", placeholder: "ex. 172" },
      { id: "cote", label: "Sonde", type: "seg", options: [["G", "Gauche (référence)"], ["D", "Droite"]] },
      { id: "bsg", label: "Diamètre de la bronche souche gauche (scanner, facultatif)", unit: "mm", placeholder: "ex. 12", full: true },
      { id: "fab", label: "Fabricant", type: "select", full: true, options: [["covidien", "Mallinckrodt Broncho-Cath (Covidien, Shiley)"], ["parker", "Parker"]], showIf: v => v.bsg !== null }
    ],
    compute(v) {
      const t = F.dltTaille(v.sexe, v.taille);
      if (!t) return null;
      const depth = F.dltProfondeur(v.taille);
      const rows = [["Selon sexe et taille", `${t} Fr`], ["Profondeur aux arcades", `≈ ${f(depth, 0)} cm${v.cote === "D" ? " (sonde droite : environ 1 cm de moins)" : ""}`]];
      let main = `${t} Fr`;
      const notes = [];
      if (v.bsg !== null) {
        const b = F.dltDepuisBronche(v.bsg, v.fab);
        if (b && b.fr) { rows.push(["Selon la bronche souche gauche", `${b.fr} Fr (Ø externe bronchique ${f(b.od, 1)} mm)`]); if (b.fr !== t) { main = `${Math.min(b.fr, t)}–${Math.max(b.fr, t)} Fr`; notes.push("Discordance entre les deux méthodes : préférer la mesure au scanner, et disposer de la taille inférieure en salle."); } }
        else if (b) { rows.push(["Selon la bronche souche gauche", "Bronche trop étroite pour 35 Fr"]); notes.push("Bronche < 10,5 mm : envisager une sonde 32 ou 28 Fr ou un bloqueur bronchique."); }
      }
      if (v.cote === "D") notes.push("Sonde droite : alignement de l'œil latéral avec l'orifice de la bronche lobaire supérieure droite, à vérifier au fibroscope ; réservée aux contre-indications de la sonde gauche (pneumonectomie gauche, lésion de la bronche souche gauche).");
      notes.push("Toujours vérifier la position au fibroscope après l'intubation et après la mise en décubitus latéral.");
      return { label: "Sonde double lumière", main, rows, html: notes.map(n => `<p class="out-sub">${n}</p>`).join(""), tone: "ok" };
    },
    note: "<p>Repères : femme &lt; 152 cm 32 Fr, 152–160 cm 35 Fr, ≥ 160 cm 37 Fr ; homme &lt; 160 cm 37 Fr, 160–170 cm 39 Fr, ≥ 170 cm 41 Fr. Profondeur ≈ 12 + taille/10 cm (29 cm pour 170 cm). Choisir un diamètre externe bronchique inférieur d'au moins 1 mm au diamètre de la bronche ; les diamètres varient selon le fabricant.</p>"
  });

  /* ---------------- Outil : plan d'analgésie ---------------- */
  const analgTool = P17.calc({
    id: "thoranalg", kind: "tool", title: "Plan d'analgésie après chirurgie thoracique",
    fields: [
      { id: "chir", label: "Chirurgie", type: "select", full: true, options: [["vats", "Thoracoscopie (VATS, robot) : wedge, segmentectomie, lobectomie"], ["thoraco", "Thoracotomie : lobectomie, pneumonectomie, décortication"], ["pleuro", "Chirurgie pleurale par thoracoscopie (talcage, bullectomie)"], ["drain", "Drain thoracique, pleuroscopie diagnostique"]] },
      { id: "poids", label: "Poids", unit: "kg", placeholder: "ex. 70" },
      { id: "ci", label: "Contre-indications", type: "checks", full: true, options: [["anticoag", "Anticoagulant ou antiagrégant non interrompu, coagulopathie"], ["ains", "AINS contre-indiqués (insuffisance rénale, ulcère, saignement)"], ["refus", "Refus ou échec de l'ALR"], ["opio", "Opioïdes au long cours, douleur chronique"]] }
    ],
    compute(v) {
      const ci = v.ci || [];
      const base = ["<b>Paracétamol</b> 1 g toutes les 6 h", ci.includes("ains") ? "<b>AINS</b> contre-indiqués : néfopam 20 mg toutes les 6 h (ou 80–120 mg/24 h)" : "<b>AINS</b> : kétoprofène 50 mg toutes les 6 h (48–72 h) si pas de contre-indication", "<b>Dexaméthasone</b> 8 mg à l'induction"];
      let bloc = "";
      if (ci.includes("refus")) bloc = "Pas d'ALR : infiltration des orifices par le chirurgien, kétamine 0,15–0,3 mg/kg puis 0,1 mg/kg/h peropératoire, morphine en PCA";
      else if (v.chir === "thoraco") bloc = ci.includes("anticoag") ? "Bloc paravertébral posé par le chirurgien sous contrôle de la vue ou ESP continu (moins de contraintes que la péridurale) ; péridurale contre-indiquée" : "<b>Bloc paravertébral continu</b> (référence) ou <b>péridurale thoracique</b> T5–T6 ; alternative : ESP continu";
      else if (v.chir === "vats") bloc = "<b>Bloc paravertébral</b> ou <b>ESP</b> en injection unique (± cathéter) ; à défaut <b>bloc du plan du dentelé antérieur</b> ; la péridurale n'est pas recommandée";
      else if (v.chir === "pleuro") bloc = "<b>Bloc paravertébral</b>, ESP ou dentelé antérieur ; talcage très douloureux : renforcer l'analgésie";
      else bloc = "Infiltration du point de ponction ; bloc du dentelé antérieur si drain prolongé";
      const rows = [];
      if (v.poids !== null && v.poids > 0 && !ci.includes("refus")) {
        const m = F.doseMaxAL("ropivacaine", v.poids);
        rows.push(["Ropivacaïne : dose maximale", `${f(m.mg, 0)} mg (3 mg/kg, plafond 225 mg)`]);
        rows.push(["Exemple bolus (0,375 %)", `${f(Math.min(m.mg, 0.3 * v.poids * 3.75) / 3.75, 0)} mL ≈ 0,3 mL/kg`]);
      }
      const rescue = ci.includes("opio") ? "Poursuivre le traitement de fond ; kétamine peropératoire et postopératoire ; morphine en PCA avec bolus adaptés" : "Morphine de secours : titration en SSPI puis PCA (bolus 1 mg, période réfractaire 7 min)";
      return {
        label: "Plan proposé", tone: "ok",
        html: `<div class="out-label">Plan proposé</div><h4>Socle multimodal</h4><ul class="rx">${base.map(x => `<li>${x}</li>`).join("")}</ul>
          <h4>Anesthésie locorégionale</h4><ul class="rx"><li>${bloc}</li></ul>
          ${rows.length ? `<dl class="out-rows">${rows.map(([k, x]) => `<div><dt>${k}</dt><dd>${x}</dd></div>`).join("")}</dl>` : ""}
          <h4>Secours et surveillance</h4><ul class="rx"><li>${rescue}</li><li>EN au repos et à la toux toutes les 4 h, objectif ≤ 3 ; spirométrie incitative, kinésithérapie, lever précoce</li></ul>`
      };
    }
  });

  /* ---------------- Fiches ---------------- */
  const FICHES = [
    {
      id: "vats", group: G_COURS, icon: "fiche", title: "Thoracoscopie (VATS)",
      subtitle: "Voies d'abord, exigences d'exposition, implications pour l'anesthésie, conversion",
      tags: ["VATS", "Uniportal", "Robot (RATS)", "RAAC"],
      sections: [
        S("Principes", [ul("Chirurgie thoracique vidéo-assistée : optique et instruments introduits par 1 à 3 incisions, sans écartement costal",
          "Indications : résections pulmonaires (wedge, segmentectomie, lobectomie), biopsies, chirurgie pleurale, médiastin, sympathectomie",
          "Bénéfices par rapport à la thoracotomie : moins de douleur, moins de complications respiratoires, durée de séjour plus courte, réhabilitation plus rapide",
          "Chirurgie robot-assistée (RATS) : mêmes principes, accès au patient limité, durée plus longue")]),
        S("Voies d'abord", [fig(SVG_VATS, "Positions habituelles des incisions en décubitus latéral"),
          tbl(["Technique", "Incisions", "Particularités"], [
            ["Uniportal", "Une incision de 3–4 cm, 4e–5e espace, ligne axillaire antérieure", "Douleur dans un seul dermatome"],
            ["Biportal", "Incision opératoire + port caméra (7e–8e espace)", "Compromis ergonomique"],
            ["Triportal", "Caméra 7e–8e espace axillaire moyen, ports antérieur et postérieur", "Approche historique"],
            ["Robot (RATS)", "3–4 trocarts + trocart d'assistance, insufflation de CO₂ fréquente", "Désamarrage d'urgence à anticiper"]
          ])], { wide: true }),
        S("Ce que l'anesthésie doit apporter", [ul("<b>Exclusion pulmonaire parfaite et rapide</b> : la visibilité dépend de l'affaissement du poumon opéré (sonde double lumière ou bloqueur bien placé, contrôle au fibroscope)",
          "Accélérer l'affaissement : FiO₂ 1 quelques minutes avant l'exclusion (dénitrogénation), ouverture de la lumière exclue à l'air, aspiration douce",
          "Décubitus latéral : protection des points d'appui, du plexus brachial (billot axillaire), des yeux et des oreilles",
          "Insufflation de CO₂ (robot) : hypercapnie, baisse du retour veineux, surveiller la pression d'insufflation (≤ 8–10 mmHg)",
          "Remplissage restrictif, analgésie par bloc pariétal, extubation en salle dans la grande majorité des cas")]),
        S("Conversion en thoracotomie", [danger("Hémorragie (plaie de l'artère pulmonaire) : compression immédiate par le chirurgien, appel à l'aide, deux voies veineuses de gros calibre, sang disponible, accélérateur-réchauffeur, conversion urgente."),
          ul("Autres causes : adhérences, exposition insuffisante, difficulté carcinologique", "Prévoir dès le départ un cathéter artériel pour les résections anatomiques et un groupe-RAI à jour", "Adapter l'analgésie après conversion : paravertébral ou péridurale continus")]),
        S("Postopératoire", [ul("Drain unique, souvent retiré à J1–J2 en l'absence de bullage", "Fuites aériennes prolongées : principale cause d'allongement du séjour", "Lever et kinésithérapie dès J0, alimentation précoce (RAAC)")])
      ],
      refs: [REF_ERAS, REF_PROSPECT, REF_SLINGER]
    },
    {
      id: "wedge", group: G_COURS, icon: "fiche", title: "Résection atypique (wedge)",
      subtitle: "Exérèse non anatomique d'un nodule périphérique",
      tags: ["Wedge", "Nodule", "Repérage", "Examen extemporané"],
      sections: [
        S("Principe", [fig(SVG_WEDGE, "Résection en V d'un nodule périphérique par agrafage"),
          ul("Résection non anatomique d'une portion de parenchyme périphérique par agrafage, sans dissection hilaire",
            "Le plus souvent par thoracoscopie, intervention courte (30 à 90 min)",
            "Marge saine visée ≥ 2 cm ou au moins égale à la taille du nodule")], { wide: true }),
        S("Indications", [ul("Diagnostic d'un nodule indéterminé périphérique (avec examen extemporané)", "Métastases pulmonaires périphériques", "Cancer de petite taille (≤ 2 cm) périphérique chez un patient fragile ou à réserve respiratoire limitée", "Bullectomie, pneumothorax récidivant, biopsie de pneumopathie interstitielle"),
          info("Pour un cancer bronchique périphérique ≤ 2 cm, les résections infralobaires sont non inférieures à la lobectomie en survie (JCOG0802 pour la segmentectomie, CALGB 140503 pour les résections infralobaires).")]),
        S("Repérage du nodule", [ul("Palpation (difficile en thoracoscopie)", "Harpon ou marquage préopératoire sous scanner (risque de pneumothorax et de déplacement : délai court entre repérage et chirurgie)", "Marquage par colorant, vert d'indocyanine ou navigation bronchoscopique", "Nodule profond ou en verre dépoli : discuter une segmentectomie")]),
        S("Implications pour l'anesthésie", [ul("Ventilation unipulmonaire de bonne qualité, souvent courte", "<b>Examen extemporané</b> : en cas de malignité, poursuite possible par une lobectomie avec curage ganglionnaire — prévoir la durée, le cathéter artériel et l'analgésie en conséquence",
          "Analgésie : bloc paravertébral ou ESP en injection unique, paracétamol, AINS, dexaméthasone", "Patient fragile ou BPCO sévère : extubation en salle, CPAP ou VNI selon le terrain"),
          warn("Pneumopathie interstitielle (biopsie) : risque d'exacerbation aiguë après chirurgie ; ventilation protectrice stricte et FiO₂ la plus basse possible.")]),
        S("Postopératoire", [ul("Séjour court (24 à 48 h), parfois ambulatoire dans des équipes entraînées", "Surveillance du bullage et du drain ; radiographie de contrôle", "Douleur généralement modérée")])
      ],
      refs: [REF_JCOG, REF_ERAS, REF_PROSPECT]
    },
    {
      id: "ventilation-unipulmonaire", group: G_COURS, icon: "fiche", title: "Ventilation unipulmonaire",
      subtitle: "Physiologie, réglages protecteurs, prévention et traitement de l'hypoxémie, reprise bipulmonaire",
      tags: ["Shunt", "VPH", "Vt 4–6 mL/kg", "CPAP"],
      sections: [
        S("Physiologie", [fig(SVG_OLV, "Répartition du débit sanguin pendant la ventilation unipulmonaire"),
          ul("Le poumon non ventilé reste perfusé : <b>shunt</b> responsable de l'hypoxémie",
            "La <b>vasoconstriction pulmonaire hypoxique</b> (VPH) réduit ce shunt de moitié environ ; elle est maximale en 15 à 30 min",
            "La gravité (décubitus latéral) dirige le débit vers le poumon dépendant ventilé",
            "Le poumon ventilé subit un volotraumatisme et une inflammation ; le poumon exclu subit l'ischémie-reperfusion : risque de lésion pulmonaire aiguë")], { wide: true }),
        S("Facteurs favorisant ou limitant la VPH", [tbl(["Diminuent la VPH (aggravent l'hypoxémie)", "Préservent la VPH"], [
          ["Halogénés > 1 CAM, vasodilatateurs (nitrés, inhibiteurs calciques, dobutamine)", "Propofol, halogénés ≤ 1 CAM"],
          ["Alcalose, hypocapnie, hypothermie", "Normocapnie, normothermie"],
          ["PEP excessive sur le poumon ventilé (refoule le sang vers le poumon exclu)", "PEP modérée et individualisée"],
          ["Bas débit cardiaque (baisse de la PvO₂)", "Débit cardiaque et hémoglobine maintenus"]
        ])], { wide: true }),
        S("Réglages protecteurs", [kv(["Volume courant", "4–6 mL/kg de poids idéal sur le poumon ventilé"], ["PEP", "5 cmH₂O, à individualiser (pression motrice la plus basse)"],
          ["Pressions", "Pression de plateau < 25 cmH₂O, pression motrice < 15 cmH₂O"], ["FiO₂", "La plus basse permettant une SpO₂ ≥ 92 % ; FiO₂ 1 seulement pour l'exclusion et en cas d'hypoxémie"],
          ["Fréquence", "Normocapnie ; hypercapnie permissive modérée acceptée (PaCO₂ < 60 mmHg, pH > 7,20) en l'absence d'HTIC ou d'HTAP"],
          ["Recrutement", "Manœuvre de recrutement du poumon ventilé après l'exclusion et en cas d'hypoxémie, si l'hémodynamique le permet"],
          ["Remplissage", "Restrictif, guidé par objectifs ; vasopresseur pour l'hypotension"])]),
        S("Conduite à tenir devant une hypoxémie", [{ ol: [
          "FiO₂ 1 ; vérifier les pressions, la capnographie, l'hémodynamique",
          "Contrôler la position de la sonde ou du bloqueur au <b>fibroscope</b> ; aspirer les sécrétions",
          "Recrutement du poumon ventilé puis ajustement de la PEP",
          "Prévenir le chirurgien : <b>CPAP 2–5 cmH₂O d'O₂</b> ou insufflation d'O₂ sur le poumon exclu (après recrutement de celui-ci), si l'exposition le permet",
          "Réexpansion intermittente du poumon opéré",
          "Optimiser le débit cardiaque et l'hémoglobine",
          "Hypoxémie sévère ou persistante : retour en ventilation bipulmonaire ; clampage de l'artère pulmonaire par le chirurgien si pneumonectomie"
        ] }], { tone: "key" }),
        S("Facteurs prédictifs d'hypoxémie", [ul("Chirurgie du côté droit (poumon droit plus volumineux)", "PaO₂ basse en ventilation bipulmonaire, en décubitus latéral", "VEMS normal ou élevé (paradoxe : les obstructifs tolèrent mieux)", "Chirurgie en décubitus dorsal (sternotomie, chirurgie bilatérale)", "Perfusion préférentielle du poumon opéré à la scintigraphie")]),
        S("Fin de l'unipulmonaire", [ul("Aspiration des deux lumières, réexpansion progressive du poumon opéré sous contrôle de la vue (pressions ≤ 30 cmH₂O)", "Test d'étanchéité des agrafes à la demande du chirurgien", "Pneumonectomie : pas de recrutement du côté opéré, drain non aspiratif ou clampé selon le chirurgien, éviter l'hyperinflation du poumon restant")])
      ],
      refs: [REF_LOHSER, REF_SLINGER, REF_ERAS]
    },
    {
      id: "sonde-double-lumiere", group: G_COURS, icon: "tool", title: "Sonde double lumière",
      subtitle: "Calcul de la taille, profondeur d'insertion, technique d'intubation et contrôle fibroscopique",
      tags: ["Outil de calcul", "Fibroscopie", "Robertshaw"],
      tool: dltTool, toolLabel: "Outil de calcul",
      sections: [
        S("Position correcte", [fig(SVG_DLT, "Sonde double lumière gauche : ballonnet bronchique bleu dans la bronche souche gauche, juste sous la carène"),
          ul("Par la lumière trachéale : carène visible, bord supérieur du ballonnet bleu à peine visible dans la bronche souche gauche", "Par la lumière bronchique : division lobaire gauche (lobes supérieur et inférieur) libre", "Sonde gauche préférée même pour une chirurgie gauche : la bronche souche gauche est longue (4–5 cm) ; à droite, la bronche lobaire supérieure naît à environ 2 cm de la carène")], { wide: true }),
        S("Technique d'intubation", [{ ol: [
          "Vérifier les deux ballonnets ; lubrifier ; mandrin courbé selon la sonde",
          "Laryngoscopie (ou vidéolaryngoscope) : extrémité bronchique concave vers l'avant pour passer les cordes",
          "Après les cordes, retirer le mandrin et tourner de 90° vers la gauche (pour une sonde gauche)",
          "Avancer jusqu'à la profondeur prévue ou jusqu'à une légère résistance",
          "Gonfler le ballonnet trachéal (étanchéité), puis le ballonnet bronchique (1–3 mL, pression ≤ 25–30 cmH₂O)",
          "Test clinique : clamper chaque lumière et ausculter ; confirmer au <b>fibroscope</b>",
          "Recontrôler au fibroscope après la mise en décubitus latéral (déplacements fréquents)"
        ] }]),
        S("Problèmes fréquents", [tbl(["Problème", "Cause probable", "Correction"], [
          ["Pressions élevées, mauvaise exclusion", "Sonde trop enfoncée (lumière bronchique dans une bronche lobaire)", "Dégonfler, retirer de 1–2 cm sous fibroscope"],
          ["Ballonnet bleu herniant sur la carène", "Sonde pas assez enfoncée", "Avancer de 0,5–1 cm sous fibroscope"],
          ["Ventilation du mauvais poumon", "Sonde dans la bronche souche droite", "Retirer dans la trachée, réorienter sous fibroscope"],
          ["Fuite persistante", "Ballonnet bronchique insuffisant ou sonde trop petite", "Regonfler prudemment ; sinon changer de taille"],
          ["Désaturation après décubitus latéral", "Déplacement de la sonde", "Contrôle fibroscopique, repositionnement"]
        ])], { wide: true }),
        S("Contre-indications relatives", [ul("Intubation difficile prévue : préférer une intubation vigile par sonde simple puis bloqueur bronchique", "Sténose ou compression trachéale ou bronchique, lésion endobronchique gauche", "Patient déjà intubé ou nécessité de ventilation postopératoire : bloqueur, ou échange de sonde sur guide en fin d'intervention")]),
        S("En fin d'intervention", [ul("Ventilation postopératoire prévue : changer pour une sonde simple sur guide échangeur (mandrin creux), sous vidéolaryngoscope", "Œdème des voies aériennes après décubitus latéral prolongé : vérifier la fuite au ballonnet avant l'extubation")])
      ],
      refs: [REF_SLINGER, "Brodsky JB et al. Depth of placement of left double-lumen endobronchial tubes. Anesth Analg 1991", "Brodsky JB et al. Tracheal diameter predicts double-lumen tube size. Anesth Analg 1996", REF_CAMPOS]
    },
    {
      id: "bloqueurs-bronchiques", group: G_COURS, icon: "fiche", title: "Bloqueurs bronchiques",
      subtitle: "Indications, modèles, mise en place pas à pas et pièges",
      tags: ["Arndt", "EZ-Blocker", "Uniblocker", "Intubation difficile"],
      sections: [
        S("Principe", [fig(SVG_BB, "Positions du bloqueur : bronche souche gauche, droite, bloqueur bifide"),
          ul("Cathéter à ballonnet introduit dans une <b>sonde d'intubation simple</b> (souvent par un raccord multiport) et gonflé dans la bronche à exclure",
            "Le poumon distal se vide par résorption ou par le petit canal central (aspiration douce)",
            "Mise en place et contrôle sous fibroscope, sonde d'intubation 2–3 cm au-dessus de la carène")], { wide: true }),
        S("Indications préférentielles", [ul("Intubation difficile prévue ou découverte : intubation vigile par sonde simple, puis bloqueur",
          "Patient déjà intubé ou trachéotomisé ; intubation nasotrachéale", "Ventilation postopératoire prévue (pas d'échange de sonde)",
          "Exclusion sélective d'un lobe (hypoxémie, chirurgie itérative)", "Anatomie défavorable à la sonde double lumière (bronche étroite, déformation)")]),
        S("Modèles", [tbl(["Bloqueur", "Taille", "Sonde simple minimale", "Mise en place", "Ballonnet"], [
          ["Arndt (Cook)", "7 et 9 Fr", "7 Fr : 7,5 · 9 Fr : 8,0", "Boucle couplée au fibroscope qui sert de guide ; boucle retirée ensuite", "Sphérique, 4–8 mL"],
          ["Cohen (Cook)", "9 Fr", "8,0", "Molette défléchissant l'extrémité vers la bronche choisie", "Sphérique, 4–8 mL"],
          ["Uniblocker (Fuji)", "9 Fr (adulte)", "Selon fabricant", "Extrémité en crosse orientée par rotation", "Silicone, ≤ 6 mL"],
          ["EZ-Blocker (Teleflex)", "7 Fr", "7,5–8,0", "Extrémité bifide à cheval sur la carène ; sonde ≥ 4 cm au-dessus", "Deux ballonnets colorés, un seul gonflé"]
        ], "Diamètres internes en mm ; vérifier la compatibilité avec le fibroscope utilisé (notice du fabricant).")], { wide: true }),
        S("Mise en place pas à pas (bloqueur à boucle)", [{ ol: [
          "Intuber avec une sonde simple de 7,5 à 8,5 mm ; raccord multiport (ventilation, bloqueur, fibroscope)",
          "Lubrifier le bloqueur et le fibroscope ; passer le fibroscope dans la boucle du bloqueur",
          "Descendre l'ensemble ; engager le fibroscope dans la bronche à exclure, faire glisser le bloqueur",
          "Reculer le fibroscope dans la trachée ; sous la vue, gonfler le ballonnet juste sous la carène (gauche) ou juste sous la carène sans recouvrir la lobaire supérieure (droite)",
          "Dégonfler pendant le décubitus latéral ; repositionner et regonfler au début de l'exclusion",
          "Retirer la boucle (Arndt) pour accéder au canal central si besoin d'aspiration ou d'O₂"
        ] }]),
        S("Pièges et sécurité", [ul("<b>Déplacement</b> fréquent (surtout à droite) : le ballonnet peut obstruer la trachée — désaturation brutale et pressions élevées : dégonfler immédiatement",
            "Affaissement plus lent qu'avec une sonde double lumière : FiO₂ 1 avant l'exclusion, aspiration douce",
            "Aspiration et fibroscopie du poumon exclu limitées", "Agrafage accidentel du bloqueur lors d'une résection : informer le chirurgien de sa position",
            "Retirer le bloqueur avant toute manipulation de la sonde ; toujours dégonfler avant de le mobiliser"),
          warn("Désaturation ou chute du volume courant au cours d'une manipulation chirurgicale : penser au ballonnet remonté dans la trachée.")])
      ],
      refs: [REF_CAMPOS, REF_SLINGER, "OpenAnesthesia : Bronchial blockers for one-lung ventilation (2024)"]
    },
    {
      id: "peridurale-thoracique", group: G_COURS, icon: "fiche", title: "Péridurale thoracique",
      subtitle: "Indications, technique, protocoles, surveillance, complications et anticoagulants",
      tags: ["T5–T6", "Ropivacaïne", "PCEA", "Hématome"],
      sections: [
        S("Indications et place", [ul("Thoracotomie (lobectomie, pneumonectomie, décortication), œsophagectomie, chirurgie abdominale sus-mésocolique ouverte",
          "Après thoracotomie : efficacité comparable au <b>bloc paravertébral continu</b>, qui a moins d'effets indésirables (hypotension, rétention urinaire) ; le choix dépend de l'équipe et du terrain",
          "Thoracoscopie : non recommandée en première intention (PROSPECT 2022)"),
          tbl(["Contre-indications", ""], [["Absolues", "Refus, infection au point de ponction, troubles de l'hémostase ou anticoagulation non interrompue, hypovolémie non corrigée, allergie aux anesthésiques locaux"], ["Relatives", "Sepsis, déformation rachidienne, pathologie neurologique évolutive, HTIC"]])]),
        S("Technique", [fig(SVG_PERI, "Thoracique moyen : processus épineux très obliques, abord médian ou paramédian"),
          ul("Patient assis ou en décubitus latéral, monitorage standard, voie veineuse ; idéalement chez le patient éveillé avant l'induction",
            "Niveau : <b>T5–T6</b> pour une thoracotomie (centre de l'incision), T7–T9 pour la chirurgie abdominale haute",
            "Abord médian (forte angulation céphalique) ou <b>paramédian</b> (plus facile en thoracique) ; perte de résistance au sérum",
            "Cathéter introduit de 4 à 5 cm dans l'espace péridural ; aspiration négative",
            "Dose test : lidocaïne adrénalinée 1 % 3 mL (injection intravasculaire : tachycardie)",
            "Vérifier le bloc sensitif (froid) avant l'incision ; fixer solidement le cathéter")], { wide: true }),
        S("Protocoles", [tbl(["Temps", "Proposition", "Remarques"], [
          ["Peropératoire", "Ropivacaïne 0,2 % 4–6 mL, puis 4–6 mL/h", "Débuter après la stabilisation hémodynamique ; vasopresseur à disposition"],
          ["Postopératoire continu", "Ropivacaïne 0,1–0,2 % ± sufentanil 0,25–0,5 µg/mL, 4–8 mL/h", "Adapter au niveau sensitif et à l'EN"],
          ["PCEA", "Débit de base 4–6 mL/h + bolus 2–3 mL, période réfractaire 20–30 min", "Maximum horaire selon protocole"],
          ["Durée", "48 à 72 h, relais par analgésie orale multimodale", "Retrait selon les règles des anticoagulants"]
        ], "Doses indicatives à adapter au protocole du service, à l'âge et au poids.")], { wide: true }),
        S("Surveillance (toutes les 4 h)", [kv(["Douleur", "EN au repos et à la toux (objectif ≤ 3)"], ["Hémodynamique", "PA, FC ; hypotension : remplissage prudent, vasopresseur, baisser le débit"],
          ["Respiration et sédation", "FR, SpO₂, échelle de sédation (opioïde péridural)"], ["Bloc sensitif", "Niveau au froid, symétrie"],
          ["Bloc moteur", "Score de Bromage des membres inférieurs : un bloc moteur en thoracique est anormal"], ["Point de ponction", "Rougeur, écoulement, déplacement du cathéter"]),
          danger("Déficit moteur ou sensitif nouveau ou progressif des membres inférieurs, douleur rachidienne : arrêter la perfusion, IRM médullaire en urgence, avis neurochirurgical (décompression dans les 8 heures).")]),
        S("Problèmes et solutions", [tbl(["Problème", "Conduite"], [
          ["Analgésie insuffisante", "Vérifier le niveau ; bolus de 3–5 mL ; retrait du cathéter de 1 cm si unilatéral ; repose ou alternative (paravertébral, PCA)"],
          ["Hypotension", "Baisser le débit, vasopresseur, rechercher une hypovolémie ou un saignement"],
          ["Prurit, nausées", "Réduire ou arrêter le morphinique ; naloxone à faible dose"],
          ["Rétention urinaire", "Sondage, surtout si morphinique associé"],
          ["Déplacement ou fuite", "Contrôle du point de ponction et de la fixation"]
        ])], { wide: true }),
        S("Anticoagulants et cathéter", [tbl(["Molécule", "Avant la ponction ou le retrait", "Après le retrait"], [
          ["HBPM préventive", "12 h après la dernière injection", "4 h"],
          ["HBPM curative", "24 h ; pas de dose curative avec un cathéter en place", "Curative ≥ 24 h après le retrait"],
          ["HNF IV curative", "Arrêt 4–6 h, TCA normalisé", "1 h"],
          ["AOD (anti-Xa, dabigatran)", "Dernière prise J-5 (RFE 2026, procédure neuraxiale)", "Curatif ≥ 24 h après le retrait"],
          ["AVK", "INR ≤ 1,2", "Après le retrait"],
          ["Aspirine seule", "Pas d'arrêt", "—"],
          ["Clopidogrel, ticagrélor / prasugrel", "5 jours / 7 jours", "Après le retrait"]
        ], "Délais d'après les RFE GIHP-SFAR 2026 (anticoagulants curatifs, procédures neuraxiales) et les recommandations ESAIC/ESRA 2022 (doses préventives, antiagrégants). Voir l'outil « Antiagrégants et anticoagulants ».")], { wide: true })
      ],
      refs: [REF_GIHP26, REF_ESAIC, REF_SFAR_DOUL, REF_PROSPECT, "Yeung JH et al. Paravertebral block versus thoracic epidural for patients undergoing thoracotomy. Cochrane Database Syst Rev 2016"]
    },
    {
      id: "analgesie-thoracique", group: G_ANALG, icon: "analgesie", title: "Analgésie après chirurgie thoracique",
      subtitle: "Stratégie selon l'abord, blocs de paroi et cathéters, multimodal, douleur chronique",
      tags: ["Paravertébral", "ESP", "Dentelé antérieur", "Cathéters", "PROSPECT"],
      tool: analgTool, toolLabel: "Plan d'analgésie",
      sections: [
        S("Pourquoi c'est important", [ul("La thoracotomie est l'une des incisions les plus douloureuses ; la thoracoscopie reste douloureuse (drain, espaces intercostaux)",
          "Douleur = toux inefficace, atélectasies, pneumopathie : l'analgésie conditionne les complications respiratoires",
          "<b>Douleur chronique postopératoire</b> fréquente après thoracotomie (jusqu'à 25–50 %) : la prévenir par une analgésie efficace dès le peropératoire",
          "Douleur de l'épaule homolatérale (irritation diaphragmatique, drain) : AINS, paracétamol ; ne répond pas au bloc pariétal")]),
        S("Sites des blocs", [fig(SVG_PAROI, "Coupe transversale de la paroi thoracique : sites d'injection"),
          tbl(["Technique", "Cible", "Volume indicatif", "Points clés"], [
            ["<b>Paravertébral</b>", "Espace paravertébral (nerfs spinaux et chaîne sympathique)", "0,3 mL/kg (≈ 20 mL) ropivacaïne 0,375 % ; cathéter 0,1 mL/kg/h de 0,2 %", "Référence ; échoguidé ou posé par le chirurgien sous la vue (extrapleural)"],
            ["<b>ESP</b> (plan des érecteurs)", "Sous les érecteurs, sur le processus transverse", "20–30 mL de ropivacaïne 0,375–0,5 %", "Simple, sûr, peu de complications ; cathéter possible"],
            ["<b>Dentelé antérieur</b> (SAPB)", "Plan superficiel ou profond du dentelé, ligne axillaire moyenne", "20–30 mL de ropivacaïne 0,375 %", "Alternative si paravertébral ou ESP impossible ; branches latérales seulement"],
            ["<b>Intercostal</b>", "Nerfs intercostaux (sous la côte), 2 espaces au-dessus et au-dessous", "3–5 mL par espace", "Par le chirurgien sous la vue ; durée courte, absorption systémique élevée"],
            ["<b>Péridurale thoracique</b>", "Espace péridural T5–T6", "Voir fiche dédiée", "Thoracotomie ; plus d'hypotension et de rétention urinaire"]
          ])], { wide: true }),
        S("Stratégie selon la chirurgie", [tbl(["Chirurgie", "Proposition", "Alternative"], [
          ["Thoracoscopie, robot", "Paracétamol + AINS + dexaméthasone + <b>paravertébral ou ESP</b>", "Dentelé antérieur ; infiltration des orifices et intercostal"],
          ["Thoracotomie", "Paracétamol + AINS + dexaméthasone + <b>paravertébral continu ou péridurale</b>", "ESP continu, cathéter intercostal ou extrapleural chirurgical"],
          ["Pneumonectomie", "Comme la thoracotomie ; AINS avec prudence (rein)", "—"],
          ["Talcage, décortication", "Bloc + multimodal renforcé (douleur intense)", "Kétamine"]
        ], "PROSPECT 2022 (VATS) : la péridurale n'est pas recommandée pour la thoracoscopie ; la gabapentine et la prégabaline ne sont pas recommandées en routine.")], { wide: true }),
        S("Cathéters pariétaux : gestion", [ul("Cathéter paravertébral ou extrapleural posé par le chirurgien sous contrôle de la vue avant la fermeture : simple et fiable",
          "Perfusion continue de ropivacaïne 0,2 % (0,1 mL/kg/h, environ 5–8 mL/h) ou bolus programmés ; durée 48–72 h",
          "Vérifier la <b>dose totale d'anesthésique local</b> (bolus peropératoire + perfusion + infiltrations du chirurgien) : risque de toxicité systémique",
          "Surveillance de la toxicité (goût métallique, acouphènes, troubles du rythme) ; émulsion lipidique disponible",
          "Retrait du cathéter selon les règles des antithrombotiques ; ESP et paravertébral : risque hémorragique « élevé » pour le paravertébral (bloc profond)"),
          info("Doses maximales et émulsion lipidique : voir Analgésie → Blocs en SSPI (calculateurs de dose maximale et d'Intralipide).")]),
        S("Adjuvants et secours", [ul("Kétamine 0,15–0,3 mg/kg à l'induction puis 0,1–0,2 mg/kg/h peropératoire (opioïdes au long cours, thoracotomie)",
          "Lidocaïne IV : pas en association avec un bloc continu (toxicité additive)",
          "Morphine : titration en SSPI puis PCA si nécessaire ; oxycodone orale en relais",
          "Kinésithérapie respiratoire, spirométrie incitative, lever précoce : effet maximal si la douleur est contrôlée")])
      ],
      refs: [REF_PROSPECT, REF_ERAS, REF_SFAR_DOUL, "Feray S et al. PROSPECT : thoracotomy (actualisation en cours) ; Yeung JH, Cochrane 2016", REF_ESAIC]
    }
  ];

  const thor = (window.P17_ANESTH || []).find(x => x.id === "thoracique");
  if (thor) thor.interventions.push(...FICHES);
})();
