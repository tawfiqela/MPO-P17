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

  // Allègement à l'affichage : l'antibioprophylaxie tient en une ligne dans chaque fiche d'intervention,
  // et le tableau récapitulatif des généralités est remplacé par un lien vers l'outil (une seule source).
  const ABP_LINK = { title: "Antibioprophylaxie", blocks: [{ html: `<p>Le schéma figure dans chaque fiche d'intervention.</p><p class="btn-row"><a class="btn btn--ghost" href="#/perop/antibioprophylaxie">Outil d'antibioprophylaxie par intervention</a></p>` }] };
  const tidy = f => ({ ...f, sections: (f.sections || []).map(x =>
    /^Antibioprophylaxie : vue d'ensemble/.test(x.title) ? ABP_LINK
      : x.title === "Antibioprophylaxie" && !x.tone ? { ...x, tone: "compact", wide: true } : x) });

  SPECS.forEach(s => {
    const sBase = [...base, [s.short || s.title, `#/anesthesie/${s.id}`]];
    P17.route(`#/anesthesie/${s.id}`, {
      title: s.title,
      render: () => P17.page({
        crumbs: sBase, title: s.title, subtitle: s.desc, accent: "anesthesie", icon: "anesthesie", back: "#/",
        body: P17.group(princ(s).length ? PRINC : "Principes", P17.tiles([{ href: `#/anesthesie/${s.id}/generalites`, title: "Généralités de la spécialité", desc: s.generalites.subtitle || "", icon: "fiche", accent: "anesthesie" },
            ...princ(s).map(i => ({ href: `#/anesthesie/${s.id}/${i.id}`, title: i.title, desc: i.subtitle || "", icon: i.icon || "fiche", accent: "anesthesie" }))]))
          + groups(s).map(([g, list]) => P17.group(g, P17.tiles(list.map(i => ({ href: `#/anesthesie/${s.id}/${i.id}`, title: i.title, desc: i.subtitle || "", icon: i.icon || "fiche", accent: "anesthesie" }))))).join("")
          + P17.group("Selon le terrain, avant, pendant et après l'intervention", P17.tiles(PERIOP))
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
        ${nav(f, s)}
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
      P17.index(`#/anesthesie/${s.id}/${i.id}`, i.title, `${s.title} ${i.subtitle || ""} ${i.keywords || ""} ${(i.tags || []).join(" ")}`, SEC);
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

  function nav(f, s) {
    const list = [{ id: "generalites", title: "Généralités" }, ...princ(s), ...s.interventions.filter(i => i.group !== PRINC)];
    const idx = list.findIndex(x => (x.title === f.title) || (f.title || "").startsWith("Généralités") && x.id === "generalites");
    const prev = idx > 0 ? list[idx - 1] : null;
    const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
    if (!prev && !next) return "";
    return `<nav class="fiche-nav">
      ${prev ? `<a class="tile" href="#/anesthesie/${s.id}/${prev.id}"><span class="tile-ico">${P17.icon("back")}</span><span class="tile-body"><span class="tile-desc">Précédent</span><span class="tile-title">${prev.title}</span></span></a>` : "<span></span>"}
      ${next ? `<a class="tile" href="#/anesthesie/${s.id}/${next.id}"><span class="tile-body"><span class="tile-desc">Suivant</span><span class="tile-title">${next.title}</span></span><span class="tile-ico">${P17.icon("arrow")}</span></a>` : ""}
    </nav>`;
  }
})();
