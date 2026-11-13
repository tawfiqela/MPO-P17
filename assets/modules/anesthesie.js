/* =====================================================================
   Anesthésie : spécialités → généralités + fiches par intervention
   Les contenus sont dans assets/modules/anesth/*.js (P17_ANESTH)
   ===================================================================== */
(function () {
  const SEC = "Anesthésie";
  const SPECS = window.P17_ANESTH || [];
  const base = [[SEC, "#/anesthesie"]];

  // Communs à toutes les spécialités : un lien vers chaque rubrique (pas de tuiles répétées)
  const PERIOP = [
    { href: "#/terrains", title: "Selon le terrain", desc: "Cœur, poumon, métabolisme, système nerveux, sang, grossesse, addictions", icon: "terrain", accent: "anesthesie" },
    { href: "#/preop", title: "Gestion pré-opératoire", desc: "Consultation, visite préanesthésique, traitements, anticoagulants", icon: "fiche", accent: "anesthesie" },
    { href: "#/perop", title: "Per-opératoire", desc: "Médicaments, voies aériennes, rachianesthésie, antibioprophylaxie, transfusion", icon: "perop", accent: "anesthesie" },
    { href: "#/postop", title: "Post-opératoire", desc: "Analgésie, blocs, extubation, saignement, sortie de SSPI, thromboprophylaxie", icon: "sspi", accent: "sspi" }
  ];

  P17.route("#/anesthesie", {
    title: SEC,
    render: () => P17.page({
      crumbs: base, title: SEC, accent: "anesthesie", icon: "anesthesie",
      subtitle: "Protocoles par spécialité : principes généraux puis fiche par type d'intervention, d'après les recommandations de la SFAR et les références francophones.",
      body: P17.tiles(SPECS.map(s => ({
        href: `#/anesthesie/${s.id}`, title: s.title, desc: s.desc, icon: "anesthesie", accent: "anesthesie",
        badge: `${s.interventions.length} fiches`
      })))
        + P17.group("Selon le terrain, avant, pendant et après l'intervention", P17.tiles(PERIOP))
    })
  });
  P17.index("#/anesthesie", SEC, "protocoles anesthésie spécialités", SEC);

  /* Plan commun des fiches d'anesthésie : les sections existantes sont rangées sous dix parties,
     dans un ordre fixe ; plusieurs sections d'une même partie sont réunies dans une seule carte. */
  const PLAN = [
    ["Particularités physiopathologiques", /^(Particularités|Pourquoi c'est important|Objectifs physiologiques)$/],
    ["Consultation et évaluation préopératoire", /^(Préopératoire|Préopératoire \(RAAC\)|Évaluation.*|Bilan biologique|Avant le bloc|Masse du médiastin antérieur : évaluation|Myasthénie : préparation|Préparation du phéochromocytome|Dialyse préopératoire|Corticothérapie périopératoire|Sélection et préparation|Chirurgie différée|Le receveur)$/],
    ["Préparation et installation du patient", /^(Installation.*|Antibioprophylaxie.*|Préparation de l'estomac|Fistule artérioveineuse|Laparoscopie et robot : Trendelenburg|Trendelenburg forcé \(robot\)|Lombotomie et décubitus latéral|Garrot pneumatique|Estomac plein)$/],
    ["Choix de la technique anesthésique", /^(Choix de la technique|Technique|Technique anesthésique|Techniques|Technique et analgésie|Anesthésie|Rachianesthésie en endo-urologie|Niveaux de sédation|Agents et doses|Choix du bloc|Masse à haut risque : stratégie)$/],
    ["Induction et entretien", /^(Induction|Induction et entretien|Peropératoire.*|Intubation du rachis cervical instable|Protection des voies aériennes|Ventilation peropératoire|Ventilation unipulmonaire.*|Remplissage|Objectifs hémodynamiques|Objectifs pour le greffon|Stratégie de PVC basse|Détente cérébrale|Compensation de la diurèse|Clampage et reperfusion|Phase de CHIP|Pharmacologie chez l'insuffisant rénal|Myasthénie : curares|Avant la sécurisation de l'anévrisme|Protection médullaire|Immunosuppression|Prévention de la pancréatite|Principes du damage control|Prise en charge initiale|Réanimation initiale|Phase aiguë)$/],
    ["Monitorage spécifique", /^(Monitorage.*|Surveillance)$/],
    ["Complications peropératoires", /^(Complications|Complications peropératoires|Incidents peropératoires|Points critiques|Points de vigilance|Saignement|Hémorragie et transfusion|Transfusion massive|Clampage temporaire et rupture|Embolie graisseuse|Arthroplastie cimentée.*|Syndrome de résection|Antagonisation des antithrombotiques|Autres complications)$/],
    ["Réveil et extubation", /^(Réveil|Fin d'intervention|Réveil et postopératoire)$/],
    ["Analgésie postopératoire", /^(Analgésie.*|Douleur chronique postopératoire|Prévention des NVPO|Cathéters pariétaux : gestion|Sites des blocs|Stratégie selon la chirurgie|Adjuvants et secours|Anesthésiques locaux)$/],
    ["Surveillance en SSPI", /^(Postopératoire.*|Après la chirurgie|Après l'endoscopie|Sortie|Suivi|Thromboprophylaxie|Autres points)$/]
  ];
  const partOf = t => PLAN.findIndex(([, re]) => re.test(t));
  const tidy = f => {
    if (f.group === "Principes et techniques") return f;   // cours transversaux : plan propre
    const secs = (f.sections || []).filter(x => !/^Antibioprophylaxie : vue d'ensemble/.test(x.title));
    const parts = PLAN.map(() => []); const autres = [];
    secs.forEach(x => { const k = partOf(x.title); (k < 0 ? autres : parts[k]).push(x); });
    const out = [];
    parts.forEach((list, k) => {
      if (k > 3 && autres.length) autres.splice(0).forEach(x => out.push(x));
      if (!list.length) return;
      const titre = PLAN[k][0];
      const sub = x => x.title === "Antibioprophylaxie" || /^Antibioprophylaxie/.test(x.title) ? "sub-blk sub-blk--compact" : "sub-blk";
      const blocks = list.length === 1 && list[0].title === titre ? list[0].blocks
        : list.map(x => ({ html: `<div class="${sub(x)}">${list.length > 1 || x.title !== titre ? `<h4 class="sub-t">${P17.esc(x.title)}</h4>` : ""}${P17.blocks(x.blocks)}</div>` }));
      out.push({ title: titre, blocks, wide: list.some(x => x.wide), tone: list.find(x => x.tone === "alert") ? "alert" : list.length === 1 && list[0].tone !== "compact" ? list[0].tone : undefined });
    });
    autres.forEach(x => out.push(x));
    return { ...f, sections: out };
  };

  SPECS.forEach(s => {
    const sBase = [...base, [s.short || s.title, `#/anesthesie/${s.id}`]];
    P17.route(`#/anesthesie/${s.id}`, {
      title: s.title,
      render: () => P17.page({
        crumbs: sBase, title: s.title, subtitle: s.desc, accent: "anesthesie", icon: "anesthesie", back: "#/",
        body: P17.group(princ(s).length ? PRINC : "Principes", P17.tiles([{ href: `#/anesthesie/${s.id}/generalites`, title: "Généralités de la spécialité", desc: s.generalites.subtitle || "", icon: "fiche", accent: "anesthesie" },
            ...princ(s).map(i => ({ href: `#/anesthesie/${s.id}/${i.id}`, title: i.title, desc: i.subtitle || "", icon: i.icon || "fiche", accent: "anesthesie" }))]))
          + groups(s).map(([g, list]) => P17.group(g, P17.tiles(list.map(i => ({ href: `#/anesthesie/${s.id}/${i.id}`, title: i.title, desc: i.subtitle || "", icon: i.icon || "fiche", accent: "anesthesie" }))))).join("")
      })
    });
    P17.index(`#/anesthesie/${s.id}`, s.title, s.desc + " " + s.interventions.map(i => i.title).join(" "), SEC);

    const fichePage = (f, path, label) => `
      <div class="page accent-anesthesie">
        <div class="page-head">
          ${P17.backLink(`#/anesthesie/${s.id}`, s.short || s.title)}
          ${P17.crumbs([...sBase, [label, path]])}
        </div>
        ${P17.fiche({ kicker: s.title, accent: "anesthesie", ...tidy(f) })}
      </div>`;

    P17.route(`#/anesthesie/${s.id}/generalites`, {
      title: `${s.short || s.title} — généralités`,
      render: () => fichePage({ title: `Généralités — ${s.short || s.title}`, ...s.generalites }, `#/anesthesie/${s.id}/generalites`, "Généralités")
    });
    P17.index(`#/anesthesie/${s.id}/generalites`, `${s.title} — généralités`, s.generalites.keywords || "", SEC);

    s.interventions.forEach(i => {
      P17.route(`#/anesthesie/${s.id}/${i.id}`, {
        title: i.title,
        render: () => fichePage(i, `#/anesthesie/${s.id}/${i.id}`, i.title)
      });
      P17.index(`#/anesthesie/${s.id}/${i.id}`, i.id === "techniques-chirurgicales" ? `Temps opératoires — ${s.short || s.title}` : i.title, `${s.title} ${i.subtitle || ""} ${i.keywords || ""} ${(i.tags || []).join(" ")}`, SEC);
    });
  });

  // « Principes et techniques » : regroupés avec les généralités en tête de page
  const PRINC = "Principes et techniques";
  function princ(s) { return s.interventions.filter(i => i.group === PRINC); }

  // Fiches regroupées (ex. Urologie : interventions puis transplantation rénale)
  function groups(s) {
    const out = [];
    s.interventions.filter(i => i.group !== PRINC).forEach(i => {
      const g = i.group || "Fiches par intervention";
      let e = out.find(x => x[0] === g);
      if (!e) out.push(e = [g, []]);
      e[1].push(i);
    });
    return out;
  }


})();
