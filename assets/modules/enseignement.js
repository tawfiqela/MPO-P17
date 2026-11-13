/* =====================================================================
   Enseignement et recherche (rubrique vierge, à alimenter par le service)
   ===================================================================== */
(function () {
  const SEC = "Enseignement et recherche";
  P17.route("#/enseignement", {
    title: SEC,
    render: () => P17.page({
      crumbs: [[SEC, "#/enseignement"]], title: SEC, accent: "enseignement", icon: "enseignement",
      subtitle: "Espace réservé aux cours, staffs et travaux de recherche du service.",
      body: `
        <section class="group accent-enseignement">
          <h2 class="group-title">Enseignement</h2>
          <div class="empty-state"><h3>Aucun contenu pour le moment</h3><p>Les cours, présentations de staff et supports de formation des résidents seront ajoutés ici.</p></div>
        </section>
        <section class="group accent-enseignement">
          <h2 class="group-title">Recherche</h2>
          <div class="empty-state"><h3>Aucun contenu pour le moment</h3><p>Les protocoles d'études, thèses et publications du service seront ajoutés ici.</p></div>
        </section>`
    })
  });
  P17.index("#/enseignement", SEC, "cours staff formation résidents thèses recherche", SEC);
})();
