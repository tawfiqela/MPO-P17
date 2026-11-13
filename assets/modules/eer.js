/* =====================================================================
   EER et échanges plasmatiques
   ===================================================================== */
(function () {
  const F = window.P17Calc;
  const f = P17.fmt;
  const SEC = "EER et échanges plasmatiques";
  const base = [[SEC, "#/eer"]];

  P17.route("#/eer", {
    title: SEC,
    render: () => P17.page({
      crumbs: base, title: SEC, accent: "eer", icon: "eer",
      subtitle: "Indications, abord, prescription de l'EER continue et calcul des volumes d'échange plasmatique.",
      body: P17.tiles([
        { href: "#/eer/cvvh", title: "EER continue (CVVH / CVVHDF)", desc: "Indications, cathéter, anticoagulation, calcul des débits", icon: "eer", accent: "eer" },
        { href: "#/eer/echanges-plasmatiques", title: "Échanges plasmatiques", desc: "Volume à échanger, liquides de substitution, paramétrage", icon: "eer", accent: "eer" },
        { href: "#/antibiotherapie/adaptation-renale", title: "Antibiotiques sous EER", desc: "Adaptation posologique (CVVH, CVVHD, HDI)", icon: "antibiotherapie", accent: "antibiotherapie" }
      ])
    })
  });

  /* ---------------- EER continue ---------------- */
  const cvvhCalc = P17.calc({
    id: "cvvhpresc", title: "Prescription CVVH en post-dilution", desc: "Débits selon le poids corrigé (poids idéal, puis poids ajusté si obésité)",
    fields: [{ id: "sexe", label: "Sexe", type: "seg", options: [["H", "Homme"], ["F", "Femme"]] }, { id: "poids", label: "Poids réel", unit: "kg" }, { id: "taille", label: "Taille", unit: "cm" }],
    compute: v => {
      const pc = F.poidsAjuste(v.sexe, v.taille, v.poids);
      if (pc === null || v.taille < 130) return null;
      const p = F.cvvhPalier(pc);
      if (!p) return { main: `Poids corrigé ${f(pc, 1)} kg`, sub: "Hors des paliers (< 40 kg) : prescription individuelle", tone: "warn" };
      return {
        label: "Débits proposés", main: `Qs ${p.qs} mL/min · Réinjection ${p.reinj} mL/h`,
        sub: `Poids corrigé : ${f(pc, 1)} kg — dose de réinjection ≈ ${f(p.reinj / pc, 0)} mL/kg/h`,
        rows: [["Mode", "Post-dilution"], ["Anticoagulation", "Citrate régional si pas de contre-indication"], ["Perte patient", "0 à 250 mL/h selon le bilan"]]
      };
    },
    note: "Paliers 40–50 kg : 110/1000 · 50–60 : 120/1000 · 60–70 : 130/1000 · 70–80 : 140/1300 · 80–90 : 150/1500 · 90–100 : 160/1700 · 100–110 : 170/1800 · 110–120 : 180/2000 · > 120 kg : 190/2200 (Qs mL/min / réinjection mL/h). Dose citrate, compensation calcique et fraction de filtration à régler selon le générateur et le protocole du service."
  });
  const ffCalc = P17.calc({
    id: "ff", title: "Fraction de filtration", desc: "Objectif < 25 % (post-dilution) pour limiter la coagulation du filtre",
    fields: [{ id: "qs", label: "Débit sang", unit: "mL/min" }, { id: "qpre", label: "Réinjection pré", unit: "mL/h", value: "0" }, { id: "qpost", label: "Réinjection post", unit: "mL/h" }, { id: "perte", label: "Perte patient", unit: "mL/h", value: "0" }, { id: "ht", label: "Hématocrite (option)", unit: "%" }],
    compute: v => {
      const r = F.fractionFiltration(v.qs, v.qpre, v.qpost, v.perte, v.ht);
      if (!r) return null;
      const ff = r.ffPlasma ?? r.ffSang;
      return { main: `${f(r.ffSang * 100, 1)} %`, sub: "rapportée au débit sanguin", rows: r.ffPlasma !== null ? [["FF plasmatique", `${f(r.ffPlasma * 100, 1)} %`]] : [], tone: ff > 0.25 ? "warn" : "ok" };
    }
  });
  const doseCalc = P17.calc({
    id: "doseeer", title: "Dose d'EER délivrée", desc: "Objectif : 25 mL/kg/h délivrés (prescrire 25–30 mL/kg/h)",
    fields: [{ id: "qs", label: "Débit sang", unit: "mL/min" }, { id: "qpre", label: "Réinjection pré", unit: "mL/h", value: "0" }, { id: "qpost", label: "Réinjection post", unit: "mL/h", value: "0" }, { id: "qd", label: "Dialysat", unit: "mL/h", value: "0" }, { id: "perte", label: "Perte patient", unit: "mL/h", value: "0" }, { id: "poids", label: "Poids", unit: "kg" }, { id: "ht", label: "Hématocrite", unit: "%", placeholder: "30" }],
    compute: v => {
      const r = F.doseEER(v.qs, v.qpre, v.qpost, v.qd, v.perte, v.poids, v.ht);
      if (!r || !(v.qpre + v.qpost + v.qd > 0)) return null;
      return { label: "Dose d'effluent", main: `${f(r.brute, 1)} mL/kg/h`, rows: v.qpre > 0 ? [["Corrigée pour la prédilution", `${f(r.corrigee, 1)} mL/kg/h`]] : [], tone: r.corrigee < 20 ? "warn" : "ok" };
    }
  });

  const { S, ul, kv, warn, info } = P17.h;
  const eerPage = (path, label, fiche) => `
    <div class="page accent-eer">
      <div class="page-head">${P17.backLink("#/eer", SEC)}${P17.crumbs([...base, [label, path]])}</div>
      ${P17.fiche({ accent: "eer", kicker: SEC, ...fiche })}
    </div>`;

  const CVVH = {
    title: "Épuration extrarénale continue", subtitle: "Indications, abord vasculaire, anticoagulation du circuit, prescription et surveillance",
    tags: ["CVVH", "Citrate", "Dose 25–30 mL/kg/h"], tool: cvvhCalc + ffCalc + doseCalc, toolLabel: "Outils de prescription",
    sections: [
      S("Indications en urgence", [ul("Hyperkaliémie ≥ 6,5 mmol/L ou avec signes ECG, réfractaire au traitement médical", "Acidose métabolique sévère (pH < 7,15–7,20) non contrôlée", "Œdème pulmonaire par surcharge, oligo-anurique, résistant aux diurétiques", "Urée > 40 mmol/L ou complications urémiques (péricardite, encéphalopathie)", "Oligo-anurie > 72 h", "Intoxication dialysable"),
        info("En l'absence de critère d'urgence, une stratégie d'attente sous surveillance est recommandée : une EER « précoce » systématique n'améliore pas la survie (AKIKI, IDEAL-ICU, STARRT-AKI).")]),
      S("Abord vasculaire", [kv(["1er choix", "Jugulaire interne droite (cathéter 15–16 cm)"], ["2e choix", "Fémorale (20–25 cm), surtout si IMC normal"], ["3e choix", "Jugulaire interne gauche (20 cm)"], ["À éviter", "Sous-clavière (risque de sténose, compromet une future FAV)"]),
        "Cathéter double lumière 12–14 Fr, pose échoguidée, extrémité à la jonction cave-atriale en jugulaire.",
        warn("Sous ECMO VA : branchement possible sur le circuit entre la pompe centrifuge et l'oxygénateur — ne jamais restituer la totalité du volume (risque d'embolie gazeuse)."),
        { img: "assets/img/eer/eerecmo.webp", caption: "Schéma : EER branchée sur un circuit d'ECMO" }]),
      S("Anticoagulation du circuit", [ul("<strong>Citrate régional</strong> en première intention en l'absence de contre-indication (insuffisance hépatocellulaire sévère, choc avec hyperlactatémie > 4 mmol/L) : surveillance Ca ionisé patient (cible 1,0–1,2 mmol/L) et post-filtre (0,25–0,35 mmol/L), rapport Ca total/Ca ionisé (accumulation si > 2,5)", "<strong>Héparine non fractionnée</strong> si contre-indication au citrate : objectif anti-Xa 0,2–0,4 UI/mL ou TCA 1,5 fois le témoin", "Sans anticoagulation si risque hémorragique majeur : privilégier la prédilution et un débit sang élevé")]),
      S("Prescription et surveillance", [ul("Dose délivrée ≥ 25 mL/kg/h (prescrire 25–30 mL/kg/h pour compenser les arrêts)", "Fraction de filtration < 25 % en post-dilution", "Perte nette adaptée au bilan entrées-sorties et à l'état hémodynamique", "Ionogramme, phosphore, Mg, Ca ionisé toutes les 6–8 h au début", "Adapter les antibiotiques (doses souvent sous-estimées sous EER continue)")])
    ]
  };
  P17.route("#/eer/cvvh", { title: "EER continue", render: () => eerPage("#/eer/cvvh", "EER continue", CVVH) });

  /* ---------------- Échanges plasmatiques ---------------- */
  const epCalc = P17.calc({
    id: "ep", title: "Volume à échanger", desc: "Volume plasmatique estimé VP = 70 mL/kg × poids × (1 − Ht)", wide: true,
    fields: [{ id: "poids", label: "Poids", unit: "kg" }, { id: "ht", label: "Hématocrite", unit: "%" },
      { id: "type", label: "Type d'échange", type: "seg", options: [["preventif", "Préventif (1,3 × VP)"], ["curatif", "Curatif (1,5 × VP)"]] },
      { id: "tp", label: "TP", unit: "% (si curatif)" }],
    compute: v => {
      const r = F.echangePlasmatique(v.poids, v.ht, v.type, v.tp);
      if (!r || v.ht < 10 || v.ht > 65) return null;
      return {
        label: "Volume à échanger", main: `${f(r.vol / 1000, 2)} L`, sub: `Volume plasmatique estimé : ${f(r.vp / 1000, 2)} L (× ${f(r.coef, 1)})`,
        rows: [["Albumine 5 %", `${f(r.albumine / 1000, 2)} L (${Math.round(r.fa * 100)} %)`], ["Plasma frais congelé", `${f(r.pfc / 1000, 2)} L (${Math.round(r.fp * 100)} %)`]]
      };
    },
    note: "Répartition : 1/3 albumine 5 % – 2/3 PFC ; si échange curatif et TP > 50 % : 1/2 – 1/2. La part de PFC est à adapter à l'indication (exclusivement PFC dans le purpura thrombotique thrombocytopénique, albumine seule possible hors trouble de l'hémostase)."
  });

  const EP = {
    title: "Échanges plasmatiques", subtitle: "Volume à échanger, paramétrage, bilans et complications",
    tags: ["1,3 à 1,5 volume plasmatique", "Albumine", "PFC"], tool: epCalc, toolLabel: "Volume à échanger",
    sections: [
      S("Paramétrage habituel", [ul("Débit sang : 100–200 mL/min en échange membranaire, sur cathéter de dialyse", "Débit d'extraction plasmatique et de réinjection ajustés pour garder une fraction de filtration < 30 % et un hématocrite post-filtre < 55 %", "Pré-pompe sang : 0 mL/h", "Perte patient : 0 mL/h (échange isolé)", "Anticoagulation : citrate ou héparine selon le générateur et le risque hémorragique")]),
      S("Bilans biologiques", [ul("Ionogramme sanguin avec Ca ionisé et Mg avant et après chaque séance", "Hémostase (TP, fibrinogène) avant et après chaque séance, en particulier si substitution par albumine seule", "Dosage du marqueur de la maladie selon l'indication (anticorps spécifiques, ADAMTS13…) au terme de la série", "Prélever les dosages médicamenteux avant la séance : de nombreux médicaments liés aux protéines sont épurés")]),
      S("Complications à surveiller", [ul("Hypocalcémie (citrate du PFC ou de l'anticoagulation) : paresthésies, troubles du rythme — supplémenter en calcium", "Hypotension (hypovolémie, réaction au PFC, IEC associés)", "Réactions allergiques au PFC, TRALI", "Troubles de l'hémostase après substitution par albumine")], { tone: "alert" })
    ]
  };
  P17.route("#/eer/echanges-plasmatiques", { title: "Échanges plasmatiques", render: () => eerPage("#/eer/echanges-plasmatiques", "Échanges plasmatiques", EP) });

  P17.index("#/eer", SEC, "EER dialyse hémodialyse hémofiltration CVVH échanges plasmatiques", SEC);
  P17.index("#/eer/cvvh", "EER continue — CVVH, prescription, anticoagulation citrate", "dialyse hémofiltration CVVHDF Prismaflex dose fraction de filtration cathéter", SEC);
  P17.index("#/eer/echanges-plasmatiques", "Échanges plasmatiques — volume à échanger", "EP plasmaphérèse albumine PFC", SEC);
})();
