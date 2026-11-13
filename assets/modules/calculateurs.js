/* =====================================================================
   Calculateurs : ventilation, hémodynamique, métabolique, neurologie,
   scores, perfusions
   ===================================================================== */
(function () {
  const F = window.P17Calc;
  const f = P17.fmt;
  const SEC = "Calculateurs";
  const base = [["Calculateurs", "#/calculateurs"]];

  const sexe = { id: "sexe", label: "Sexe", type: "seg", options: [["H", "Homme"], ["F", "Femme"]] };

  /* ---------------- Ventilation ---------------- */
  const ventilation = [
    P17.calc({
      id: "vt6", title: "Volume courant protecteur", desc: "Poids idéal théorique (Devine) et Vt de 4 à 8 mL/kg",
      fields: [sexe, { id: "taille", label: "Taille", unit: "cm", placeholder: "170" }],
      compute: v => {
        const pit = F.poidsIdeal(v.sexe, v.taille);
        if (pit === null || v.taille < 120) return null;
        return {
          label: "Vt 6 mL/kg PIT", main: `${f(pit * 6, 0)} mL`, sub: `Poids idéal théorique : ${f(pit, 1)} kg`,
          rows: [["4 mL/kg", `${f(pit * 4, 0)} mL`], ["7 mL/kg", `${f(pit * 7, 0)} mL`], ["8 mL/kg", `${f(pit * 8, 0)} mL`]]
        };
      }
    }),
    P17.calc({
      id: "pf", title: "Rapport PaO₂/FiO₂", desc: "Classification de Berlin (sous PEP ≥ 5 cmH₂O)",
      fields: [{ id: "pao2", label: "PaO₂", unit: "mmHg" }, { id: "fio2", label: "FiO₂", unit: "% ou fraction", placeholder: "60" }],
      compute: v => {
        const pf = F.pf(v.pao2, v.fio2);
        if (pf === null) return null;
        return { main: f(pf, 0), sub: F.berlin(pf), tone: pf <= 100 ? "danger" : pf <= 200 ? "warn" : "" };
      }
    }),
    P17.calc({
      id: "mecavent", title: "Pression motrice et compliance", desc: "Mesures en pause télé-inspiratoire",
      fields: [{ id: "vt", label: "Vt", unit: "mL" }, { id: "pplat", label: "Pplat", unit: "cmH₂O" }, { id: "pep", label: "PEP totale", unit: "cmH₂O" }],
      compute: v => {
        const r = F.mecaniqueVentilatoire(v.vt, v.pplat, v.pep);
        if (!r) return null;
        return {
          label: "Driving pressure", main: `${f(r.driving, 0)} cmH₂O`, tone: r.driving >= 15 || v.pplat > 30 ? "warn" : "ok",
          sub: r.driving >= 15 ? "Objectif < 15 cmH₂O : réduire le Vt" : "Dans l'objectif (< 15 cmH₂O)",
          rows: [["Compliance statique", `${f(r.compliance, 0)} mL/cmH₂O`], ["Pplat", `${f(v.pplat, 0)} cmH₂O (objectif ≤ 30)`]]
        };
      }
    }),
    P17.calc({
      id: "em", title: "Espace mort physiologique", desc: "Approximation d'Enghoff (EtCO₂ comme PECO₂)",
      fields: [{ id: "paco2", label: "PaCO₂", unit: "mmHg" }, { id: "etco2", label: "EtCO₂", unit: "mmHg" }, { id: "vt", label: "Vt", unit: "mL" }],
      compute: v => {
        const r = F.espaceMort(v.paco2, v.etco2, v.vt);
        if (!r) return null;
        return { main: `${f(r.volume, 0)} mL`, sub: `VD/VT = ${f(r.fraction * 100, 0)} % (normale ≈ 30 %)`, tone: r.fraction > 0.6 ? "warn" : "" };
      }
    }),
    P17.calc({
      id: "no", title: "Monoxyde d'azote inhalé", desc: "Débit de NO à injecter dans la branche inspiratoire",
      fields: [{ id: "cible", label: "NO souhaité", unit: "ppm", placeholder: "10" }, { id: "bouteille", label: "Bouteille", unit: "ppm", placeholder: "800" }, { id: "ve", label: "Ventilation minute", unit: "L/min" }],
      compute: v => {
        const q = F.debitNO(v.cible, v.bouteille, v.ve);
        if (q === null) return null;
        return { main: `${f(q * 1000, 0)} mL/min`, sub: `soit ${f(q, 3)} L/min — vérifier la concentration délivrée sur l'analyseur` };
      }
    }),
    P17.calc({
      id: "rox", title: "Index ROX", desc: "Prédiction du succès de l'oxygénothérapie à haut débit",
      fields: [{ id: "spo2", label: "SpO₂", unit: "%" }, { id: "fio2", label: "FiO₂", unit: "%" }, { id: "fr", label: "Fréquence respiratoire", unit: "/min" }],
      compute: v => {
        const r = F.rox(v.spo2, v.fio2, v.fr);
        if (r === null) return null;
        return { main: f(r, 2), sub: r >= 4.88 ? "≥ 4,88 : faible risque d'intubation" : r < 3.85 ? "< 3,85 : risque élevé d'échec, discuter l'intubation" : "Zone intermédiaire : réévaluer", tone: r < 3.85 ? "danger" : r < 4.88 ? "warn" : "ok" };
      }
    }),
    P17.calc({
      id: "io", title: "Index d'oxygénation", desc: "IO = FiO₂ (%) × Pmoy / PaO₂",
      fields: [{ id: "fio2", label: "FiO₂", unit: "%" }, { id: "pmoy", label: "Pression moyenne", unit: "cmH₂O" }, { id: "pao2", label: "PaO₂", unit: "mmHg" }],
      compute: v => { const r = F.indexOxygenation(v.fio2, v.pmoy, v.pao2); return r === null ? null : { main: f(r, 1), sub: r > 25 ? "Hypoxémie sévère" : "" , tone: r > 25 ? "warn" : "" }; }
    })
  ];

  /* ---------------- Hémodynamique ---------------- */
  const hemo = [
    P17.calc({
      id: "dcecho", title: "Débit cardiaque échographique", desc: "DC = FC × ITV sous-aortique × π × (d/2)²",
      fields: [{ id: "d", label: "Diamètre CCVG", unit: "mm", placeholder: "20" }, { id: "itv", label: "ITV sous-aortique", unit: "cm" }, { id: "fc", label: "FC", unit: "/min" }, { id: "sc", label: "Surface corporelle", unit: "m² (option)" }],
      compute: v => {
        const r = F.dcEcho(v.d, v.itv, v.fc);
        if (!r) return null;
        const rows = [["VES", `${f(r.ves, 0)} mL`], ["Surface CCVG", `${f(r.surface, 2)} cm²`]];
        if (v.sc) rows.push(["Index cardiaque", `${f(r.dc / v.sc, 2)} L/min/m²`]);
        return { main: `${f(r.dc, 2)} L/min`, rows, sub: v.itv < 14 ? "ITV < 14 cm : VES abaissé" : "" };
      }
    }),
    P17.calc({
      id: "dcth", title: "Débit cardiaque théorique", desc: "SC (Mosteller) × IC normal (3,2 H / 3,0 F L/min/m²)",
      fields: [sexe, { id: "taille", label: "Taille", unit: "cm" }, { id: "poids", label: "Poids", unit: "kg" }],
      compute: v => { const r = F.dcTheorique(v.sexe, v.taille, v.poids); return r ? { main: `${f(r.dc, 2)} L/min`, sub: `Surface corporelle : ${f(r.sc, 2)} m²` } : null; }
    }),
    P17.calc({
      id: "pam", title: "Pression artérielle moyenne", desc: "PAM = (PAS + 2 × PAD) / 3",
      fields: [{ id: "pas", label: "PAS", unit: "mmHg" }, { id: "pad", label: "PAD", unit: "mmHg" }, { id: "fc", label: "FC (option)", unit: "/min" }],
      compute: v => {
        const p = F.pam(v.pas, v.pad); if (p === null) return null;
        const rows = []; if (v.fc) rows.push(["Index de choc (FC/PAS)", f(v.fc / v.pas, 2)]);
        return { main: `${f(p, 0)} mmHg`, rows, tone: p < 65 ? "warn" : "" };
      }
    }),
    P17.calc({
      id: "rvs", title: "Résistances vasculaires systémiques", desc: "RVS = 80 × (PAM − PVC) / DC",
      fields: [{ id: "pam", label: "PAM", unit: "mmHg" }, { id: "pvc", label: "PVC", unit: "mmHg" }, { id: "dc", label: "DC", unit: "L/min" }],
      compute: v => { const r = F.rvs(v.pam, v.pvc, v.dc); return r === null ? null : { main: `${f(r, 0)} dyn·s·cm⁻⁵`, sub: "Normale ≈ 800–1200" }; }
    }),
    P17.calc({
      id: "rvp", title: "Résistances vasculaires pulmonaires", desc: "RVP = (PAPm − PAPO) / DC",
      fields: [{ id: "papm", label: "PAPm", unit: "mmHg" }, { id: "papo", label: "PAPO", unit: "mmHg" }, { id: "dc", label: "DC", unit: "L/min" }],
      compute: v => { const r = F.rvp(v.papm, v.papo, v.dc); return r ? { main: `${f(r.wood, 2)} UW`, sub: `${f(r.dyn, 0)} dyn·s·cm⁻⁵ — HTP pré-capillaire si RVP > 2 UW`, tone: r.wood > 2 ? "warn" : "" } : null; }
    }),
    P17.calc({
      id: "do2", title: "Transport et consommation d'O₂", desc: "CaO₂ = 1,34 × Hb × SaO₂ + 0,003 × PaO₂",
      fields: [{ id: "hb", label: "Hb", unit: "g/dL" }, { id: "sao2", label: "SaO₂", unit: "%" }, { id: "pao2", label: "PaO₂", unit: "mmHg" }, { id: "dc", label: "DC", unit: "L/min" }, { id: "svo2", label: "SvO₂ / ScvO₂ (option)", unit: "%" }],
      compute: v => {
        const r = F.do2(v.hb, v.sao2, v.pao2, v.dc); if (!r) return null;
        const rows = [["CaO₂", `${f(r.cao2, 1)} mL/dL`]];
        if (v.svo2) { const c = F.vo2(v.hb, v.sao2, v.pao2, v.svo2, 40, v.dc); if (c) { rows.push(["VO₂", `${f(c.vo2, 0)} mL/min`]); rows.push(["Extraction O₂", `${f(c.extraction * 100, 0)} %`]); } }
        return { label: "DO₂", main: `${f(r.do2, 0)} mL/min`, rows };
      }
    }),
    P17.calc({
      id: "gapco2", title: "Gap veino-artériel en CO₂", desc: "ΔPCO₂ = PcvCO₂ − PaCO₂ (prélèvements simultanés)",
      fields: [{ id: "pcv", label: "PcvCO₂", unit: "mmHg" }, { id: "pa", label: "PaCO₂", unit: "mmHg" }],
      compute: v => {
        if (v.pcv === null || v.pa === null) return null;
        const g = v.pcv - v.pa;
        return { main: `${f(g, 1)} mmHg`, sub: g > 6 ? "> 6 mmHg : débit cardiaque probablement inadapté" : "≤ 6 mmHg", tone: g > 6 ? "warn" : "ok" };
      }
    })
  ];

  /* ---------------- Métabolique ---------------- */
  const gly = { id: "gu", label: "Unité glycémie", type: "seg", options: [["gl", "g/L"], ["mmol", "mmol/L"]] };
  const meta = [
    P17.calc({
      id: "osm", title: "Osmolarité plasmatique calculée", desc: "2 × Na + glucose + urée (mmol/L)",
      fields: [gly, { id: "na", label: "Na", unit: "mmol/L" }, { id: "gly", label: "Glycémie" }, { id: "uree", label: "Urée", unit: "mmol/L" }, { id: "mes", label: "Osmolalité mesurée (option)", unit: "mOsm/kg" }],
      compute: v => {
        const g = F.glyMmol(v.gly, v.gu); const o = F.osmolarite(v.na, g, v.uree); if (o === null) return null;
        const rows = [["Osmolarité efficace (2Na + G)", `${f(2 * v.na + g, 0)} mOsm/L`]];
        if (v.mes) rows.push(["Trou osmolaire", `${f(v.mes - o, 0)} mOsm (> 10 : toxique ?)`]);
        return { main: `${f(o, 0)} mOsm/L`, rows };
      }
    }),
    P17.calc({
      id: "nacorr", title: "Natrémie corrigée (hyperglycémie)", desc: "Katz : + 1,6 mmol/L par g/L de glucose au-delà de 1 g/L",
      fields: [gly, { id: "na", label: "Na mesurée", unit: "mmol/L" }, { id: "gly", label: "Glycémie" }],
      compute: v => { const r = F.naCorrige(v.na, F.glyGL(v.gly, v.gu)); return r ? { main: `${f(r.katz, 1)} mmol/L`, sub: `Formule de Hillier (× 2,4) : ${f(r.hillier, 1)} mmol/L` } : null; }
    }),
    P17.calc({
      id: "cacorr", title: "Calcémie corrigée", desc: "Ca + 0,02 × (40 − albumine) — préférer le calcium ionisé",
      fields: [{ id: "ca", label: "Ca total", unit: "mmol/L" }, { id: "alb", label: "Albumine", unit: "g/L" }],
      compute: v => { const r = F.caCorrige(v.ca, v.alb); return r === null ? null : { main: `${f(r, 2)} mmol/L`, tone: r > 2.6 || r < 2.2 ? "warn" : "" }; }
    }),
    P17.calc({
      id: "ta", title: "Trou anionique", desc: "Na − (Cl + HCO₃⁻), corrigé par l'albumine",
      fields: [{ id: "na", label: "Na", unit: "mmol/L" }, { id: "cl", label: "Cl", unit: "mmol/L" }, { id: "hco3", label: "HCO₃⁻", unit: "mmol/L" }, { id: "alb", label: "Albumine (option)", unit: "g/L" }],
      compute: v => {
        const r = F.trouAnionique(v.na, v.cl, v.hco3, v.alb); if (!r) return null;
        const t = r.corrige !== null ? r.corrige : r.ta;
        return { main: `${f(r.ta, 0)} mmol/L`, sub: r.corrige !== null ? `Corrigé par l'albumine : ${f(r.corrige, 1)} mmol/L` : "Normale 12 ± 4 (sans K)", tone: t > 16 ? "warn" : "" };
      }
    }),
    P17.calc({
      id: "dvic", title: "Variation du volume intracellulaire", desc: "ΔVIC = 0,4 × poids × (140/Na − 1)",
      fields: [{ id: "poids", label: "Poids", unit: "kg" }, { id: "na", label: "Na", unit: "mmol/L" }],
      compute: v => {
        const r = F.deltaVIC(v.poids, v.na); if (r === null) return null;
        const d = F.deficitEauLibre(v.poids, v.na, 0.6);
        return { main: `${r > 0 ? "+" : ""}${f(r, 1)} L`, sub: r < 0 ? "Déshydratation intracellulaire" : r > 0 ? "Hyperhydratation intracellulaire" : "", rows: v.na > 140 ? [["Déficit en eau libre (0,6 × P)", `${f(d, 1)} L`]] : [] };
      }
    }),
    P17.calc({
      id: "dvec", title: "Variation du volume extracellulaire", desc: "Déficit VEC = 0,2 × poids × (Ht / 0,45 − 1)",
      fields: [{ id: "poids", label: "Poids", unit: "kg" }, { id: "ht", label: "Hématocrite", unit: "%" }],
      compute: v => {
        const r = F.deltaVEC(v.poids, v.ht); if (r === null) return null;
        return { main: `${f(Math.abs(r), 1)} L`, sub: r > 0 ? "Déficit extracellulaire (hémoconcentration)" : r < 0 ? "Excès extracellulaire (hémodilution) — interprétation prudente si anémie" : "", tone: r > 0 ? "warn" : "" };
      },
      note: "Valide uniquement en l'absence d'anémie ou de polyglobulie préexistante."
    }),
    P17.calc({
      id: "dfg", title: "Fonction rénale estimée", desc: "Cockcroft-Gault et CKD-EPI 2021",
      fields: [sexe, { id: "age", label: "Âge", unit: "ans" }, { id: "poids", label: "Poids", unit: "kg" }, { id: "creat", label: "Créatinine", unit: "µmol/L" }],
      compute: v => {
        const cg = F.cockcroft(v.age, v.poids, v.creat, v.sexe); const ck = F.ckdepi2021(v.age, v.creat, v.sexe);
        if (ck === null) return null;
        return { label: "CKD-EPI 2021", main: `${f(ck, 0)} mL/min/1,73 m²`, rows: cg !== null ? [["Cockcroft-Gault", `${f(cg, 0)} mL/min`]] : [], sub: "Non valide si fonction rénale instable (IRA) : préférer la clairance mesurée" };
      }
    }),
    P17.calc({
      id: "clmes", title: "Clairance de la créatinine mesurée", desc: "U × V / P sur recueil des urines",
      fields: [{ id: "u", label: "Créatinine urinaire", unit: "mmol/L" }, { id: "v", label: "Volume urinaire", unit: "mL" }, { id: "h", label: "Durée du recueil", unit: "h", placeholder: "24" }, { id: "p", label: "Créatinine plasmatique", unit: "µmol/L" }],
      compute: v => {
        const h = v.h || 24; if (v.u === null || v.v === null || v.p === null) return null;
        const r = F.clairanceMesuree(v.u, v.v * 24 / h, v.p);
        return r === null ? null : { main: `${f(r, 0)} mL/min` };
      }
    }),
    P17.calc({
      id: "fena", title: "Fractions d'excrétion (Na, urée)", desc: "Orientation insuffisance rénale fonctionnelle / organique",
      fields: [{ id: "una", label: "Na urinaire", unit: "mmol/L" }, { id: "pna", label: "Na plasmatique", unit: "mmol/L" }, { id: "ucr", label: "Créat. urinaire", unit: "mmol/L" }, { id: "pcr", label: "Créat. plasmatique", unit: "µmol/L" }, { id: "uu", label: "Urée urinaire (option)", unit: "mmol/L" }, { id: "pu", label: "Urée plasmatique (option)", unit: "mmol/L" }],
      compute: v => {
        const fe = F.fena(v.una, v.pna, v.ucr, v.pcr); if (fe === null) return null;
        const rows = []; const fu = F.feuree(v.uu, v.pu, v.ucr, v.pcr);
        if (fu !== null) rows.push(["FE urée", `${f(fu, 0)} % (< 35 % : fonctionnelle, utile sous diurétiques)`]);
        return { label: "FE Na", main: `${f(fe, 2)} %`, sub: fe < 1 ? "< 1 % : en faveur d'une IRA fonctionnelle" : "> 1 % : en faveur d'une atteinte organique (ou diurétiques)", rows };
      }
    }),
    P17.calc({
      id: "kdigo", title: "Stade KDIGO de l'insuffisance rénale aiguë", desc: "Critère créatinine et/ou diurèse, le plus sévère retenu",
      fields: [{ id: "creat", label: "Créatinine actuelle", unit: "µmol/L" }, { id: "base", label: "Créatinine de base", unit: "µmol/L" }, { id: "h48", label: "Hausse en 48 h (option)", unit: "µmol/L" },
        { id: "diu", label: "Diurèse", type: "select", options: [["n", "Conservée"], ["s1", "< 0,5 mL/kg/h pendant 6–12 h"], ["s2", "< 0,5 mL/kg/h ≥ 12 h"], ["s3", "< 0,3 mL/kg/h ≥ 24 h ou anurie ≥ 12 h"]] },
        { id: "eer", label: "Épuration extrarénale débutée", type: "check" }],
      compute: v => {
        const r = F.kdigo({ creat: v.creat, creatBase: v.base, hausse48: v.h48, diurese: v.diu, eer: v.eer });
        if (r.ratio === null && v.diu === "n" && !v.eer && !v.h48) return null;
        return { main: r.stade ? `Stade ${r.stade}` : "Pas d'IRA selon KDIGO", sub: r.ratio !== null ? `Rapport créatinine / base : ${f(r.ratio, 2)}` : "", tone: r.stade >= 2 ? "danger" : r.stade === 1 ? "warn" : "ok" };
      }
    })
  ];

  /* ---------------- Neurologie ---------------- */
  const neuro = [
    P17.calc({
      id: "ip", title: "Index de pulsatilité (Gosling)", desc: "IP = (Vs − Vd) / Vm au doppler transcrânien",
      fields: [{ id: "vs", label: "V systolique", unit: "cm/s" }, { id: "vd", label: "V diastolique", unit: "cm/s" }, { id: "vm", label: "V moyenne", unit: "cm/s" }],
      compute: v => { const r = F.indexPulsatilite(v.vs, v.vd, v.vm); return r === null ? null : { main: f(r, 2), sub: r > 1.4 ? "IP > 1,4 : évocateur d'HTIC (ou de baisse de PPC)" : "Normale 0,6–1,1", tone: r > 1.4 ? "warn" : "" }; }
    }),
    P17.calc({
      id: "lin", title: "Index de Lindegaard", desc: "Vm ACM / Vm carotide interne extracrânienne",
      fields: [{ id: "acm", label: "Vm ACM", unit: "cm/s" }, { id: "aci", label: "Vm ACI", unit: "cm/s" }],
      compute: v => { const r = F.lindegaard(v.acm, v.aci); return r === null ? null : { main: f(r, 1), sub: r < 3 ? "< 3 : hyperdébit, pas de vasospasme" : r <= 6 ? "3–6 : vasospasme modéré" : "> 6 : vasospasme sévère", tone: r > 6 ? "danger" : r >= 3 ? "warn" : "ok" }; }
    }),
    P17.calc({
      id: "ppc", title: "Pression de perfusion cérébrale", desc: "PPC = PAM − PIC (capteur de PAM au niveau du tragus)",
      fields: [{ id: "pam", label: "PAM", unit: "mmHg" }, { id: "pic", label: "PIC", unit: "mmHg" }],
      compute: v => { const r = F.ppc(v.pam, v.pic); return r === null ? null : { main: `${f(r, 0)} mmHg`, sub: "Objectif habituel 60–70 mmHg ; PIC < 20–22 mmHg", tone: r < 60 || v.pic > 22 ? "warn" : "ok" }; }
    }),
    P17.calc({
      id: "gcs", title: "Score de Glasgow", desc: "Meilleure réponse obtenue",
      fields: [
        { id: "y", label: "Ouverture des yeux", type: "select", options: [["4", "4 — spontanée"], ["3", "3 — à la demande"], ["2", "2 — à la douleur"], ["1", "1 — aucune"]] },
        { id: "v", label: "Réponse verbale", type: "select", options: [["5", "5 — orientée"], ["4", "4 — confuse"], ["3", "3 — inappropriée"], ["2", "2 — incompréhensible"], ["1", "1 — aucune"]] },
        { id: "m", label: "Réponse motrice", type: "select", options: [["6", "6 — obéit"], ["5", "5 — orientée à la douleur"], ["4", "4 — évitement"], ["3", "3 — décortication"], ["2", "2 — décérébration"], ["1", "1 — aucune"]] }
      ],
      compute: v => { const s = +v.y + +v.v + +v.m; return { main: `${s} / 15`, sub: `Y${v.y} V${v.v} M${v.m}`, tone: s <= 8 ? "danger" : s <= 12 ? "warn" : "" }; }
    })
  ];

  /* ---------------- Scores ---------------- */
  const scores = [
    P17.calc({
      id: "sofa", title: "Score SOFA", desc: "Défaillances d'organes (Vincent 1996) — saisir les pires valeurs des 24 h", wide: true,
      fields: [
        { id: "pf", label: "PaO₂/FiO₂", unit: "mmHg" }, { id: "vent", label: "Sous ventilation mécanique / VNI", type: "check" },
        { id: "plq", label: "Plaquettes", unit: "G/L" }, { id: "bili", label: "Bilirubine", unit: "µmol/L" },
        { id: "cardio", label: "Cardiovasculaire", type: "select", options: [["0", "PAM ≥ 70 mmHg"], ["1", "PAM < 70 mmHg"], ["2", "Dopamine ≤ 5 ou dobutamine"], ["3", "Dopa > 5 ou NAD/adré ≤ 0,1 µg/kg/min"], ["4", "Dopa > 15 ou NAD/adré > 0,1 µg/kg/min"]] },
        { id: "gcs", label: "Glasgow" }, { id: "creat", label: "Créatinine", unit: "µmol/L" }, { id: "diu", label: "Diurèse", unit: "mL/24 h (option)" }
      ],
      compute: v => {
        const r = F.sofa({ pf: v.pf, ventile: v.vent, plaquettes: v.plq, bili: v.bili, cardio: v.cardio === null ? null : +v.cardio, gcs: v.gcs, creat: v.creat, diurese: v.diu });
        if (r.n < 2) return null;
        const lab = { resp: "Respiratoire", coag: "Coagulation", foie: "Hépatique", cardio: "Cardiovasculaire", snc: "Neurologique", rein: "Rénal" };
        return { main: `${r.total} / 24`, sub: `${r.n} organe(s) renseigné(s) sur 6`, rows: Object.entries(r.detail).map(([k, s]) => [lab[k], s]) };
      }
    })
    ,
    P17.calc({
      id: "igs2", title: "IGS II (SAPS II)", desc: "Indice de gravité simplifié (Le Gall 1993) — pires valeurs des 24 premières heures", wide: true,
      fields: [
        { id: "age", label: "Âge", type: "select", options: [["0", "< 40 ans"], ["7", "40–59"], ["12", "60–69"], ["15", "70–74"], ["16", "75–79"], ["18", "≥ 80"]] },
        { id: "fc", label: "Fréquence cardiaque", type: "select", options: [["0", "70–119"], ["2", "40–69"], ["4", "120–159"], ["7", "≥ 160"], ["11", "< 40"]] },
        { id: "pas", label: "PA systolique", type: "select", options: [["0", "100–199"], ["2", "≥ 200"], ["5", "70–99"], ["13", "< 70"]] },
        { id: "t", label: "Température", type: "select", options: [["0", "< 39 °C"], ["3", "≥ 39 °C"]] },
        { id: "pf", label: "PaO₂/FiO₂ (si ventilé ou CPAP)", type: "select", options: [["0", "Non ventilé"], ["6", "≥ 200"], ["9", "100–199"], ["11", "< 100"]] },
        { id: "diu", label: "Diurèse", type: "select", options: [["0", "≥ 1 L/24 h"], ["4", "0,5–0,99 L"], ["11", "< 0,5 L"]] },
        { id: "uree", label: "Urée", type: "select", options: [["0", "< 10 mmol/L"], ["6", "10–29,9"], ["10", "≥ 30"]] },
        { id: "gb", label: "Leucocytes", type: "select", options: [["0", "1–19,9 G/L"], ["3", "≥ 20"], ["12", "< 1"]] },
        { id: "k", label: "Kaliémie", type: "select", options: [["0", "3–4,9 mmol/L"], ["3", "< 3 ou ≥ 5"]] },
        { id: "na", label: "Natrémie", type: "select", options: [["0", "125–144 mmol/L"], ["1", "≥ 145"], ["5", "< 125"]] },
        { id: "hco3", label: "Bicarbonates", type: "select", options: [["0", "≥ 20 mmol/L"], ["3", "15–19"], ["6", "< 15"]] },
        { id: "bili", label: "Bilirubine", type: "select", options: [["0", "< 68,4 µmol/L"], ["4", "68,4–102,5"], ["9", "≥ 102,6"]] },
        { id: "gcs", label: "Glasgow", type: "select", options: [["0", "14–15"], ["5", "11–13"], ["7", "9–10"], ["13", "6–8"], ["26", "< 6"]] },
        { id: "mal", label: "Maladie chronique", type: "select", options: [["0", "Aucune"], ["9", "Cancer métastatique"], ["10", "Hémopathie maligne"], ["17", "SIDA"]] },
        { id: "adm", label: "Type d'admission", type: "select", options: [["0", "Chirurgie programmée"], ["6", "Médicale"], ["8", "Chirurgie non programmée"]] }
      ],
      compute: v => {
        const r = F.igs2(v); if (!r) return null;
        return { label: "IGS II", main: `${r.score} points`, sub: `Mortalité hospitalière prédite ≈ ${f(r.mortalite, 1)} %`, tone: r.mortalite >= 25 ? "warn" : "" };
      },
      note: "Glasgow : avant sédation. Mortalité prédite par l'équation de Le Gall ; à interpréter à l'échelle d'une population, pas d'un patient."
    })
  ];

  /* ---------------- Perfusions ---------------- */
  const unites = [["ugkgmin", "µg/kg/min"], ["ugmin", "µg/min"], ["ugkgh", "µg/kg/h"], ["mgkgh", "mg/kg/h"], ["mgh", "mg/h"], ["uih", "UI/h (conc. en UI/mL)"]];
  const perf = [
    P17.calc({
      id: "pse", title: "Conversion dose ↔ débit (PSE)", desc: "Pour toute seringue : renseigner la concentration réelle de la préparation", wide: true,
      fields: [
        { id: "sens", label: "Calculer", type: "seg", options: [["debit", "Le débit (mL/h)"], ["dose", "La dose"]] },
        { id: "u", label: "Unité de dose", type: "select", options: unites },
        { id: "conc", label: "Concentration", unit: "mg/mL", placeholder: "ex. 0,2" },
        { id: "poids", label: "Poids", unit: "kg" },
        { id: "dose", label: "Dose prescrite", showIf: v => v.sens === "debit" },
        { id: "debit", label: "Débit", unit: "mL/h", showIf: v => v.sens === "dose" }
      ],
      compute: v => {
        const lab = Object.fromEntries(unites);
        if (v.sens === "debit") { const d = F.pseDebit(v.dose, v.u, v.conc, v.poids); return d === null ? null : { main: `${f(d, 1)} mL/h`, sub: `pour ${f(v.dose, 2)} ${lab[v.u]}` }; }
        const d = F.pseDose(v.debit, v.u, v.conc, v.poids); return d === null ? null : { main: `${f(d, 3)} ${lab[v.u].split(" ")[0]}`, sub: `à ${f(v.debit, 1)} mL/h` };
      },
      note: "Exemple : noradrénaline 8 mg dans 40 mL = 0,2 mg/mL. Toujours vérifier la préparation affichée sur la seringue."
    })
  ];

  const PAGES = [
    { id: "ventilation", title: "Ventilation", desc: "Vt protecteur, P/F, driving pressure, espace mort, NO, ROX", cards: ventilation },
    { id: "hemodynamique", title: "Hémodynamique", desc: "Débit cardiaque, PAM, résistances, DO₂/VO₂, gap CO₂", cards: hemo },
    { id: "metabolique", title: "Métabolique et rein", desc: "Osmolarité, Na et Ca corrigés, trou anionique, volumes, DFG, KDIGO", cards: meta },
    { id: "neurologie", title: "Neurologie", desc: "Doppler transcrânien, PPC, Glasgow", cards: neuro },
    { id: "scores", title: "Scores de gravité", desc: "SOFA, IGS II", cards: scores },
    { id: "perfusions", title: "Perfusions", desc: "Conversion dose ↔ débit des seringues électriques", cards: perf }
  ];

  P17.route("#/calculateurs", {
    title: SEC,
    render: () => P17.page({
      crumbs: [[SEC, "#/calculateurs"]], title: SEC, accent: "calculateurs", icon: "calculateurs",
      subtitle: "Calculs fréquents en anesthésie-réanimation. Les résultats s'affichent au fur et à mesure de la saisie.",
      body: P17.tiles(PAGES.map(p => ({ href: `#/calculateurs/${p.id}`, title: p.title, desc: p.desc, icon: "calculateurs", accent: "calculateurs" })))
    })
  });
  P17.index("#/calculateurs", SEC, "formules calculs", SEC);

  PAGES.forEach(p => {
    P17.route(`#/calculateurs/${p.id}`, {
      title: p.title,
      render: () => P17.page({
        crumbs: [...base, [p.title, `#/calculateurs/${p.id}`]], title: p.title, subtitle: p.desc, accent: "calculateurs", icon: "calculateurs",
        body: `<div class="calc-grid accent-calculateurs">${p.cards.join("")}</div>`
      })
    });
    P17.index(`#/calculateurs/${p.id}`, `Calculateurs — ${p.title}`, p.desc, SEC);
  });
})();
