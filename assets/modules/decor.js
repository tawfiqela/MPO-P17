/* =====================================================================
   Décor : scènes de bloc et de réanimation dessinées au trait, en filigrane
   derrière le contenu, selon la rubrique ouverte (images dans assets/img/decor/).
   ===================================================================== */
(function () {
  // préfixe d'adresse → scène (le premier préfixe qui correspond l'emporte)
  const MAP = [
    // une scène par spécialité (pages de la spécialité et toutes ses fiches)
    ...["visceral", "traumatologie", "gynecologie", "urologie", "neurochirurgie"].map(s => [`#/anesthesie/${s}`, `spe-${s}`]),
    ["#/anesthesie", "bloc-anesthesie"], ["#/perop", "bloc-anesthesie"],
    ["#/preop", "bloc-salle"], ["#/terrains", "bloc-salle"], ["#/urgences", "bloc-salle"], ["#/blocs", "bloc-salle"],
    ["#/postop", "rea-ventilation"], ["#/sspi", "rea-ventilation"], ["#/analgesie", "rea-ventilation"],
    ["#/calculateurs", "rea-soins"], ["#/eer", "rea-soins"], ["#/echographie", "rea-soins"], ["#/enseignement", "rea-soins"], ["#/bibliographie", "rea-soins"]
  ];
  let el = null, cur = "";
  const ensure = () => {
    if (el) return el;
    el = document.createElement("div"); el.className = "decor"; el.setAttribute("aria-hidden", "true");
    el.innerHTML = '<img alt="">';
    document.body.prepend(el);
    return el;
  };
  P17.after((root, path) => {
    const hit = MAP.find(([p]) => path === p || path.startsWith(p + "/"));
    const scene = hit ? hit[1] : "";
    document.body.classList.toggle("has-decor", !!scene);
    if (!scene || scene === cur) return;
    cur = scene;
    ensure().querySelector("img").src = P17.src(`assets/img/decor/${scene}.webp`);
  });
})();
