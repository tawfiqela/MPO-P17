/* =====================================================================
   Schémas de position : silhouette, repères, sonde et trajet de l'aiguille
   pour chaque bloc (dessins originaux en SVG, adaptés au thème clair ou sombre).
   ===================================================================== */
(function () {
  // Silhouettes (viewBox 0 0 240 300)
  const V = {
    face: { t: "Vue de face", d: `<path class="sk" d="M86 20c0-12 68-12 68 0l2 22c26 6 40 18 44 40l8 72c2 20-2 40-10 60l-8 30c-4 16-12 28-24 36H74c-12-8-20-20-24-36l-8-30c-8-20-12-40-10-60l8-72c4-22 18-34 44-40Z"/>
      <path class="lm" d="M76 46c14 10 74 10 88 0M120 46v118M78 106c14 22 70 22 84 0M64 214c18 18 94 18 112 0M86 228l34 32 34-32"/><circle class="lm" cx="120" cy="170" r="3"/><circle class="pt" cx="70" cy="206" r="3"/><circle class="pt" cx="170" cy="206" r="3"/>` },
    dos: { t: "Vue de dos", d: `<path class="sk" d="M86 20c0-12 68-12 68 0l2 22c26 6 40 18 44 40l8 72c2 20-2 40-10 60l-8 30c-4 16-12 28-24 36H74c-12-8-20-20-24-36l-8-30c-8-20-12-40-10-60l8-72c4-22 18-34 44-40Z"/>
      <path class="lm" d="M120 30v240" stroke-dasharray="3 6"/><path class="lm" d="M80 66c10 30 24 42 30 46M160 66c-10 30-24 42-30 46M60 226c30-14 90-14 120 0"/>` },
    flanc: { t: "Décubitus latéral", d: `<path class="sk" d="M24 110c10-26 40-40 80-42h50c30 0 56 12 66 36l6 40c2 22-6 40-22 50l-30 14H70c-26-2-44-14-50-34Z"/>
      <path class="lm" d="M40 130h190" stroke-dasharray="3 6"/><path class="lm" d="M150 76c-4 30-4 74 4 126M96 76c-6 40-4 86 8 124"/><circle class="pt" cx="186" cy="132" r="3"/>` },
    hanche: { t: "Pli inguinal, vue de face", d: `<path class="sk" d="M40 20h160l4 60c0 30-8 56-20 80l-10 120H66L56 160c-12-24-20-50-20-80Z"/>
      <path class="lm" d="M60 84l60 34 60-34M120 118v160"/><circle class="pt" cx="60" cy="84" r="3.500"/><circle class="pt" cx="180" cy="84" r="3.500"/><path class="vx" d="M140 112v160"/>` },
    cuisse: { t: "Cuisse, face antéro-médiale", d: `<path class="sk" d="M70 14h100c6 60 4 120-6 180l-8 92H86l-10-92c-10-60-12-120-6-180Z"/>
      <path class="lm" d="M86 30c20 70 38 140 48 240"/><ellipse class="lm" cx="122" cy="262" rx="26" ry="16"/>` },
    poplite: { t: "Creux poplité, vue postérieure", d: `<path class="sk" d="M72 10h96c4 60 2 110-4 150l-8 130H86l-10-130c-6-40-8-90-4-150Z"/>
      <path class="lm" d="M80 120c20 20 60 20 80 0M80 170c20-20 60-20 80 0M120 40v100"/><path class="vx" d="M126 40v110"/>` },
    cou: { t: "Cou, tête tournée du côté opposé", d: `<path class="sk" d="M40 40c20-30 70-34 100-14l20 30 50 30c14 10 18 26 10 40l-20 26H40Z"/>
      <path class="lm" d="M80 50l70 96M40 160c50-10 110-14 150-12"/><path class="lm" d="M120 70l40 74" stroke-dasharray="3 5"/><path class="vx" d="M96 64l58 84"/>` },
    aisselle: { t: "Bras à 90° d'abduction", d: `<path class="sk" d="M20 90h150c30 0 50 10 60 24l-4 30c-12 10-30 14-56 14H20Z"/><path class="sk" d="M20 158c30 10 50 40 60 120H20Z"/>
      <path class="lm" d="M40 124h180"/><path class="vx" d="M40 130h176"/>` },
    tete: { t: "Tête", d: `<ellipse class="sk" cx="120" cy="140" rx="80" ry="100"/><path class="lm" d="M80 122c10-8 22-8 30 0M130 122c10-8 22-8 30 0M200 150c10 10 10 30 0 40"/>` }
  };
  // Position de la sonde (x, y, angle) et entrée de l'aiguille (dx, dy relatifs)
  const P = {
    "tap": ["face", 178, 172, 0, [-46, 0], "Ligne axillaire moyenne, entre rebord costal et crête iliaque"],
    "gaine-droits": ["face", 140, 164, 0, [-40, 0], "Paramédiane, au niveau de l'ombilic, des deux côtés"],
    "ilio-inguinal": ["face", 160, 196, -28, [-40, -10], "Sur la ligne épine iliaque antéro-supérieure – ombilic"],
    "carre-lombes": ["flanc", 150, 122, 90, [0, -44], "Flanc, au-dessus de la crête iliaque, en arrière"],
    "esp": ["dos", 140, 96, 90, [0, -46], "Parasagittale, 3 cm de la ligne médiane, en T5 (thorax) ou T7–T8"],
    "paravertebral": ["dos", 136, 104, 90, [0, -46], "Parasagittale paramédiane, entre deux processus transverses"],
    "dentele": ["face", 190, 110, 0, [36, 0], "Ligne axillaire moyenne, 4e–5e côte"],
    "pecs": ["face", 156, 66, -35, [-40, -14], "Sous la clavicule puis vers la 3e–4e côte"],
    "fascia-iliaca": ["hanche", 72, 102, 90, [0, 44], "Parasagittale, en dedans de l'EIAS, au-dessus du ligament inguinal"],
    "peng": ["hanche", 88, 112, 45, [-36, 0], "Sous l'EIAS, tournée de 45° sur la branche iliopubienne"],
    "femoral": ["hanche", 140, 126, 0, [-46, 0], "Transversale au pli inguinal, sur l'artère fémorale"],
    "canal-adducteurs": ["cuisse", 112, 150, 0, [-44, 0], "Transversale, mi-cuisse, face antéro-médiale"],
    "sciatique-poplite": ["poplite", 120, 92, 0, [46, 0], "Transversale, 5 à 10 cm au-dessus du pli poplité"],
    "interscalenique": ["cou", 126, 104, 60, [40, -22], "Transversale au niveau de C6, en dehors du sterno-cléido-mastoïdien"],
    "supraclaviculaire": ["cou", 150, 150, 8, [44, 6], "Fosse supraclaviculaire, parallèle à la clavicule"],
    "axillaire": ["aisselle", 112, 127, 90, [0, -44], "Transversale au creux axillaire"]
  };
  P17.blocSchema = id => {
    const p = P[id]; if (!p) return "";
    const [view, x, y, ang, [dx, dy], txt] = p, v = V[view];
    return `<figure class="bschema">
      <svg viewBox="0 0 240 300" role="img" aria-label="${P17.esc(v.t + " : " + txt)}">
        ${v.d}
        <g transform="translate(${x} ${y})">
          <line class="nd" x1="${dx * 1.4}" y1="${dy * 1.4}" x2="0" y2="0"/>
          <g transform="rotate(${ang})"><rect class="pr" x="-22" y="-7" width="44" height="14" rx="5"/><line class="prl" x1="-16" y1="0" x2="16" y2="0"/></g>
        </g>
      </svg>
      <figcaption><b>${v.t}</b>${txt}<span class="bs-key"><i class="k-pr"></i>Sonde <i class="k-nd"></i>Aiguille</span></figcaption>
    </figure>`;
  };
})();
