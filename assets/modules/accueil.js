/* =====================================================================
   Accueil : pièce centrale « Réanimation Chirurgicale · Pavillon 17 »
   entourée des spécialités, puis les autres rubriques.

   Disposition (grand écran, 3 × 3) :
     Gynécologie   | SSPI        | Neurochirurgie
     Urologie      | ◆ CENTRE ◆  | Chirurgie viscérale
     Thoracique    | Endoscopie  | Traumatologie
   ===================================================================== */
(function () {
  const C = P17.cfg;

  // Icônes propres aux spécialités
  const SVG = {
    traumatologie: '<path d="M8.5 8.5l7 7"/><circle cx="6.8" cy="5.2" r="2"/><circle cx="5.2" cy="6.8" r="2"/><circle cx="18.8" cy="17.2" r="2"/><circle cx="17.2" cy="18.8" r="2"/>',
    visceral: '<path d="M9 3v3.5A3.5 3.5 0 0 0 12.5 10h1a4 4 0 0 1 0 8H9.5a2.5 2.5 0 0 1 0-5H14"/>',
    neurochirurgie: '<path d="M12 5.5a3 3 0 0 0-5.6 1.2A3 3 0 0 0 4.8 12a3 3 0 0 0 2 5 3 3 0 0 0 5.2.8Z"/><path d="M12 5.5a3 3 0 0 1 5.6 1.2A3 3 0 0 1 19.2 12a3 3 0 0 1-2 5 3 3 0 0 1-5.2.8"/><path d="M12 5.5v13"/>',
    thoracique: '<path d="M12 3.5v8"/><path d="M12 11.5c-1-1.2-2.4-1.2-3.5-.5M12 11.5c1-1.2 2.4-1.2 3.5-.5"/><path d="M8.2 6.5C5.6 7.6 4 12 4 16.5c0 2 1.8 3.2 3.6 2.3l1.9-1V8.4c0-1.2-.6-2.1-1.3-1.9Z"/><path d="M15.8 6.5c2.6 1.1 4.2 5.5 4.2 10 0 2-1.8 3.2-3.6 2.3l-1.9-1V8.4c0-1.2.6-2.1 1.3-1.9Z"/>',
    gynecologie: '<path d="M12 3.2a3.3 3.3 0 0 0-3.3 3.3c0 2.4 3.3 5.8 3.3 5.8s3.3-3.4 3.3-5.8A3.3 3.3 0 0 0 12 3.2Z"/><path d="M9.6 9.8 6.2 19.5l2.9-1.3 1.4 2.4 1.5-8.3"/><path d="M14.4 9.8l3.4 9.7-2.9-1.3-1.4 2.4-1.5-8.3"/>',
    urologie: '<path d="M9.5 4C6.4 4 4.5 7.4 4.5 12s1.9 8 5 8c2 0 3-1.4 3-3.2 0-1.5-1.8-2.4-1.8-4.8s1.8-3.3 1.8-4.8C12.5 5.4 11.4 4 9.5 4Z"/><path d="M12.5 12h3a2 2 0 0 1 2 2v6"/>',
    endoscopie: '<path d="M3.5 19.5c3.5 0 3.5-6 7.5-6s4-6.5 7.5-6.5"/><circle cx="19.5" cy="6.5" r="2"/><path d="M3.5 19.5v-3"/>',
    "transplantation-renale": '<path d="M9.5 4C6.4 4 4.5 7.4 4.5 12s1.9 8 5 8c2 0 3-1.4 3-3.2 0-1.5-1.8-2.4-1.8-4.8s1.8-3.3 1.8-4.8C12.5 5.4 11.4 4 9.5 4Z"/><path d="M17.5 8v6M14.5 11h6"/>',
    sspi: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M6 11h3l1.5-3 2 6 1.5-3H18"/><path d="M9 20h6M12 16v4"/>'
  };
  const ico = id => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${SVG[id] || ""}</svg>`;

  // Satellites autour de la pièce centrale
  const SAT = [
    { area: "gyn", spec: "gynecologie", title: "Gynécologie", kicker: "Anesthésie", desc: "Sein et cancérologie" },
    { area: "neuro", spec: "neurochirurgie", title: "Neurochirurgie", kicker: "Anesthésie", desc: "Crâne, hypophyse, rachis" },
    { area: "uro", spec: "urologie", title: "Urologie", kicker: "Anesthésie", desc: "Endo-urologie, robot, greffe rénale" },
    { area: "visc", spec: "visceral", title: "Chirurgie viscérale", kicker: "Anesthésie", desc: "RAAC, carcinologie, urgences" },
    { area: "thor", spec: "thoracique", title: "Chirurgie thoracique", kicker: "Anesthésie", desc: "Unipulmonaire, VATS, analgésie" },
    { area: "endo", spec: "endoscopie", title: "Endoscopie digestive", kicker: "Sédation", desc: "FOGD, CPRE, hémorragie" },
    { area: "trauma", spec: "traumatologie", title: "Traumatologie", kicker: "Anesthésie", desc: "Fractures, polytraumatisé" }
  ];

  // Rubriques sous la pièce centrale : avant, pendant, après l'intervention, outils, divers
  const OUTILS = [
    { id: "calculateurs", href: "#/calculateurs", title: "Calculateurs", desc: "Ventilation, hémodynamique, métabolique, scores", icon: "calculateurs" },
    { id: "eer", href: "#/eer", title: "EER et échanges plasmatiques", desc: "Prescription, volumes d'échange", icon: "eer" },
    { id: "antibiotherapie", href: "#/antibiotherapie", title: "Antibiothérapie", desc: "Probabiliste, BMR, durées, rein", icon: "antibiotherapie" },
    { id: "echographie", href: "#/echographie", title: "Échographie", desc: "Bases, ETT, pleuro-pulmonaire, diaphragme", icon: "echographie" }
  ];
  const DIVERS = [
    { id: "bibliographie", href: "#/bibliographie", title: "Bibliographie", desc: "Références du service (à venir)", icon: "bibliographie" },
    { id: "enseignement", href: "#/enseignement", title: "Enseignement et recherche", desc: "Cours, staffs, travaux", icon: "enseignement" }
  ];
  const MENU = [...OUTILS, ...DIVERS];
  P17.menu = MENU;

  // Sigle du CHU (lettrage du logo) ou logo officiel s'il est fourni dans la configuration
  function lockup() {
    const chu = C.logo
      ? `<span class="lk-logo"><img src="${P17.esc(P17.src(C.logo))}" alt="${P17.esc(C.etablissement)}"></span>`
      : `<span class="lk-chu">CHU</span>`;
    return `
      <span class="hub-lockup">
        ${chu}
        <span class="lk-names">
          <span class="lk-row"><span class="lk-fr">IBN ROCHD</span><span class="lk-ar" lang="ar" dir="rtl">ابن رشد</span></span>
          <span class="lk-row"><span class="lk-fr lk-fr--city">${P17.esc(C.ville || "Casablanca")}</span><span class="lk-ar" lang="ar" dir="rtl">الدار البيضاء</span></span>
        </span>
      </span>`;
  }

  function satellite(s, specs) {
    const sp = s.spec ? specs.find(x => x.id === s.spec) : null;
    const href = s.href || `#/anesthesie/${s.spec}`;
    const n = s.count || (sp ? sp.interventions.length : 0);
    return `
      <a class="sat sat--${s.area} accent-${s.id === "sspi" ? "sspi" : "anesthesie"}" href="${href}" data-sat>
        <span class="sat-top">
          <span class="sat-ico">${ico(s.spec || s.id)}</span>
        </span>
        <span class="sat-title">${s.title}</span>
        <span class="sat-desc">${s.desc}</span>
        <span class="sat-meta">${n} fiche${n > 1 ? "s" : ""} ${P17.icon("arrow")}</span>
      </a>`;
  }

  // Tracé des axes entre la pièce centrale et chaque satellite
  function drawAxes(root) {
    const hub = root.querySelector(".hub");
    const svg = root.querySelector(".hub-axes");
    const core = root.querySelector(".hub-core");
    if (!hub || !svg || !core) return;
    const draw = () => {
      const visible = window.matchMedia("(min-width: 760px)").matches;
      svg.innerHTML = "";
      if (!visible) return;
      const H = hub.getBoundingClientRect();
      const c = core.getBoundingClientRect();
      const cx = c.left + c.width / 2 - H.left, cy = c.top + c.height / 2 - H.top;
      svg.setAttribute("viewBox", `0 0 ${H.width} ${H.height}`);
      hub.querySelectorAll("[data-sat]").forEach(el => {
        const r = el.getBoundingClientRect();
        const x = r.left + r.width / 2 - H.left, y = r.top + r.height / 2 - H.top;
        svg.insertAdjacentHTML("beforeend", `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/><circle cx="${x}" cy="${y}" r="3"/>`);
      });
    };
    draw();
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(draw);
      ro.observe(hub);
      P17._hubObserver && P17._hubObserver.disconnect();
      P17._hubObserver = ro;
    } else {
      window.addEventListener("resize", draw);
    }
  }

  let OPEN = "";   // volet ouvert sur l'accueil (pré-, per- ou post-opératoire)
  const tiles = list => `<div class="tiles tiles--more">${list.map(m => `
              <a class="tile accent-${m.accent || m.id}" href="${m.href}">
                <span class="tile-ico">${m.iconSvg ? ico(m.iconSvg) : P17.icon(m.icon)}</span>
                <span class="tile-body">
                  <span class="tile-title">${m.title}</span>
                  <span class="tile-desc">${m.desc}</span>
                </span>
                <span class="tile-go">${P17.icon("arrow")}</span>
              </a>`).join("")}</div>`;

  P17.route("#/", {
    title: "Accueil",
    render() {
      const specs = window.P17_ANESTH || [];
      const photo = C.banniere && C.banniere.photo ? `style="--hub-photo: url('${P17.esc(P17.src(C.banniere.photo))}')"` : "";
      return `
        <section class="hub" aria-label="${P17.esc(C.serviceLong || "")}">
          <svg class="hub-axes" aria-hidden="true"></svg>
          ${SAT.map(s => satellite(s, specs)).join("")}
          <div class="hub-core ${photo ? "hub-core--photo" : ""}" ${photo}>
            ${P17.star("hub-star")}
            <svg class="hub-rod" viewBox="0 0 120 300" aria-hidden="true">
              <path class="rod" d="M60 20v270"/><circle class="rod" cx="60" cy="13" r="7"/>
              <path class="snake" d="M92 54c-8-8-22-8-32 2-34 8-34 36 0 46s34 38 0 46-32 36 0 44 28 30 6 40"/>
              <ellipse class="snake" cx="95" cy="55" rx="7" ry="4.500" transform="rotate(18 95 55)"/>
            </svg>
            <div class="hub-frame">
              <span class="hub-flag" title="Royaume du Maroc">${P17.flag()}</span>
              ${lockup()}
              <span class="hub-rule" aria-hidden="true"></span>
              <h1 class="hub-title">${P17.esc(C.serviceBanniere || "Réanimation Chirurgicale")}</h1>
              <span class="hub-pav">${P17.esc(C.pavillon || "Pavillon 17")}</span>
              <span class="hub-ar" lang="ar" dir="rtl">${P17.esc(C.etablissementAr || "")}</span>
              <span class="hub-sub">${P17.esc(C.sousTitre || "")}</span>
            </div>
          </div>
        </section>

        <section class="acc-group" aria-label="Avant, pendant et après l'intervention">
          ${[["preop", "Gestion pré-opératoire", "Avant", P17.preop || [], "fiche"], ["perop", "Per-opératoire", "Pendant", P17.perop || [], "perop"], ["postop", "Post-opératoire", "Après", P17.postop || [], "sspi"], ["terrain", "Anesthésie selon le terrain", "Selon le patient", P17.terrains || [], "terrain"]].map(([id, t, step, list, icon]) => `
          <div class="acc ${OPEN === id ? "is-open" : ""}" data-acc="${id}">
            <button class="acc-head" type="button" aria-expanded="${OPEN === id}" aria-controls="acc-${id}">
              <span class="acc-ico">${P17.icon(icon)}</span>
              <span class="acc-t"><span class="acc-step">${step}</span><b>${t}</b><em>${list.map(m => m.title).join(" · ")}</em></span>
              <span class="acc-n">${list.length}</span>
              <span class="acc-chev" aria-hidden="true">${P17.icon("arrow")}</span>
            </button>
            <div class="acc-panel" id="acc-${id}" ${OPEN === id ? "" : "inert"}>
              <div class="acc-inner">${tiles(list)}</div>
            </div>
          </div>`).join("")}
        </section>

        ${[["Outils", OUTILS], ["Divers", DIVERS]].map(([t, list]) => `
        <section class="group home-more">
          <h2 class="group-title">${t}</h2>
          ${tiles(list)}
        </section>`).join("")}
        <p class="home-meta">
          <span>Version ${P17.esc(C.version || "")}</span>
          <span>Révision des contenus : ${P17.esc(C.revision || "")}</span>
          <span>Installable sur téléphone et utilisable hors connexion</span>
        </p>`;
    },
    after(root) {
      drawAxes(root);
      // Un seul volet ouvert à la fois ; le volet ouvert est retrouvé au retour sur l'accueil
      root.querySelectorAll("[data-acc]").forEach(acc => {
        acc.querySelector(".acc-head").addEventListener("click", () => {
          const open = !acc.classList.contains("is-open");
          root.querySelectorAll("[data-acc]").forEach(o => {
            const on = o === acc && open;
            o.classList.toggle("is-open", on);
            o.querySelector(".acc-head").setAttribute("aria-expanded", String(on));
            o.querySelector(".acc-panel").toggleAttribute("inert", !on);
          });
          OPEN = open ? acc.dataset.acc : "";
        });
      });
    }
  });

  P17.redirect("#/reanimation", "#/");   // rubrique retirée : l'application couvre l'anesthésie
  // Les rubriques sont indexées par leur propre module : pas de second résultat de recherche pour la même page
})();
