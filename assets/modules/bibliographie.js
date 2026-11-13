/* =====================================================================
   Bibliographie : rubrique laissée vide pour le moment.
   Les références du service seront ajoutées ici (liste RECOS ci-dessous).
   ===================================================================== */
(function () {
  const SEC = "Bibliographie";
  // Pour ajouter une référence : { titre, source, annee, lien }
  const REFS = [];
  P17.route("#/bibliographie", {
    title: SEC,
    render: () => P17.page({
      crumbs: [[SEC, "#/bibliographie"]], title: SEC, accent: "bibliographie", icon: "bibliographie",
      subtitle: "Recommandations et articles de référence du service.",
      body: REFS.length
        ? `<div class="biblio-list accent-bibliographie">${REFS.map(r => `<a class="bib" href="${P17.esc(r.lien || "#")}" target="_blank" rel="noopener noreferrer"><div><div class="bib-top"><span>${P17.esc(r.source || "")}</span><span>${P17.esc(String(r.annee || ""))}</span></div><p class="bib-title">${P17.esc(r.titre || "")}</p></div></a>`).join("")}</div>`
        : `<div class="empty-state accent-bibliographie"><h3>Rubrique à venir</h3><p>Les références bibliographiques du service seront ajoutées ici. En attendant, chaque fiche cite ses sources en bas de page.</p></div>`
    })
  });
  P17.index("#/bibliographie", SEC, "articles recommandations références", SEC);
})();
