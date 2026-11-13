/* =====================================================================
   Formules de calcul (fonctions pures, testées dans tests/calc.test.js)
   Unités : indiquées dans le nom des paramètres et dans l'interface.
   ===================================================================== */
(function (root) {
  "use strict";
  const ok = (...xs) => xs.every(x => typeof x === "number" && Number.isFinite(x));

  const F = {
    /* ---------- Anthropométrie ---------- */
    poidsIdeal(sexe, tailleCm) { // Devine (PIT)
      if (!ok(tailleCm)) return null;
      return (sexe === "F" ? 45.5 : 50) + 0.91 * (tailleCm - 152.4);
    },
    poidsAjuste(sexe, tailleCm, poidsKg) { // PIT + 0,4 × (PR − PIT) si PR > PIT
      const pit = F.poidsIdeal(sexe, tailleCm);
      if (!ok(pit, poidsKg)) return null;
      return poidsKg > pit ? pit + 0.4 * (poidsKg - pit) : poidsKg;
    },
    surfaceCorporelle(tailleCm, poidsKg) { // Mosteller (m²)
      if (!ok(tailleCm, poidsKg) || tailleCm <= 0 || poidsKg <= 0) return null;
      return Math.sqrt(tailleCm * poidsKg / 3600);
    },
    imc(tailleCm, poidsKg) {
      if (!ok(tailleCm, poidsKg) || tailleCm <= 0) return null;
      return poidsKg / Math.pow(tailleCm / 100, 2);
    },

    /* ---------- Ventilation ---------- */
    espaceMort(paco2, etco2, vt) { // Enghoff modifié
      if (!ok(paco2, etco2, vt) || paco2 <= 0) return null;
      const f = (paco2 - etco2) / paco2;
      return { fraction: f, volume: f * vt };
    },
    debitNO(cibleppm, bouteilleppm, veLmin) { // débit à injecter dans la branche inspiratoire
      if (!ok(cibleppm, bouteilleppm, veLmin) || bouteilleppm <= cibleppm) return null;
      return cibleppm * veLmin / (bouteilleppm - cibleppm);
    },
    pf(pao2, fio2) { // FiO2 en % ou en fraction
      if (!ok(pao2, fio2) || fio2 <= 0) return null;
      const f = fio2 > 1 ? fio2 / 100 : fio2;
      return pao2 / f;
    },
    berlin(pf) {
      if (!ok(pf)) return null;
      if (pf > 300) return "Pas de SDRA (P/F > 300)";
      if (pf > 200) return "SDRA léger (200 < P/F ≤ 300)";
      if (pf > 100) return "SDRA modéré (100 < P/F ≤ 200)";
      return "SDRA sévère (P/F ≤ 100)";
    },
    mecaniqueVentilatoire(vt, pplat, pep) {
      if (!ok(vt, pplat, pep) || pplat <= pep) return null;
      const dp = pplat - pep;
      return { driving: dp, compliance: vt / dp };
    },
    indexOxygenation(fio2, pmoy, pao2) {
      if (!ok(fio2, pmoy, pao2) || pao2 <= 0) return null;
      const f = fio2 > 1 ? fio2 : fio2 * 100;
      return f * pmoy / pao2;
    },
    rox(spo2, fio2, fr) {
      if (!ok(spo2, fio2, fr) || fr <= 0 || fio2 <= 0) return null;
      const f = fio2 > 1 ? fio2 / 100 : fio2;
      return (spo2 / f) / fr;
    },

    /* ---------- Hémodynamique ---------- */
    pam(pas, pad) { return ok(pas, pad) ? (pas + 2 * pad) / 3 : null; },
    dcEcho(diamMm, itvCm, fc) {
      if (!ok(diamMm, itvCm, fc) || diamMm <= 0) return null;
      const r = diamMm / 20; // rayon en cm
      const surf = Math.PI * r * r; // cm²
      const ves = surf * itvCm; // mL
      return { surface: surf, ves, dc: ves * fc / 1000 };
    },
    dcTheorique(sexe, tailleCm, poidsKg) {
      const sc = F.surfaceCorporelle(tailleCm, poidsKg);
      if (sc === null) return null;
      const ic = sexe === "F" ? 3.0 : 3.2;
      return { sc, ic, dc: sc * ic };
    },
    rvs(pam, pvc, dc) {
      if (!ok(pam, pvc, dc) || dc <= 0) return null;
      return 80 * (pam - pvc) / dc;
    },
    rvp(papm, papo, dc) {
      if (!ok(papm, papo, dc) || dc <= 0 || papm <= papo) return null;
      const w = (papm - papo) / dc;
      return { wood: w, dyn: w * 80 };
    },
    contenuO2(hb, sat, po2) { // sat en % ou fraction
      if (!ok(hb, sat, po2)) return null;
      const s = sat > 1 ? sat / 100 : sat;
      return 1.34 * hb * s + 0.003 * po2;
    },
    do2(hb, sao2, pao2, dc) {
      const ca = F.contenuO2(hb, sao2, pao2);
      if (ca === null || !ok(dc)) return null;
      return { cao2: ca, do2: dc * ca * 10 };
    },
    vo2(hb, sao2, pao2, svo2, pvo2, dc) {
      const ca = F.contenuO2(hb, sao2, pao2);
      const cv = F.contenuO2(hb, svo2, ok(pvo2) ? pvo2 : 40);
      if (ca === null || cv === null || !ok(dc)) return null;
      return { vo2: dc * (ca - cv) * 10, extraction: (ca - cv) / ca };
    },

    /* ---------- Métabolique / rein ---------- */
    glyMmol(gly, unite) { if (!ok(gly)) return null; return unite === "mmol" ? gly : gly * 5.551; },
    glyGL(gly, unite) { if (!ok(gly)) return null; return unite === "mmol" ? gly / 5.551 : gly; },
    osmolarite(na, glyMmolL, ureeMmolL) {
      if (!ok(na, glyMmolL, ureeMmolL)) return null;
      return 2 * na + glyMmolL + ureeMmolL;
    },
    naCorrige(na, glyGL) { // Katz : +1,6 mmol/L par g/L au-delà de 1 g/L ; Hillier : +2,4
      if (!ok(na, glyGL)) return null;
      const d = Math.max(0, glyGL - 1);
      return { katz: na + 1.6 * d, hillier: na + 2.4 * d };
    },
    caCorrige(ca, albGL) { // Payne : Ca + 0,02 × (40 − albumine g/L)
      if (!ok(ca, albGL)) return null;
      return ca + 0.02 * (40 - albGL);
    },
    trouAnionique(na, cl, hco3, albGL, k) {
      if (!ok(na, cl, hco3)) return null;
      const ta = na + (ok(k) ? k : 0) - cl - hco3;
      return { ta, corrige: ok(albGL) ? ta + 0.25 * (40 - albGL) : null };
    },
    deltaVIC(poids, na) { // variation du volume intracellulaire (L) ; < 0 = déshydratation IC
      if (!ok(poids, na) || na <= 0) return null;
      return 0.4 * poids * (140 / na - 1);
    },
    deficitEauLibre(poids, na, coef) { // hypernatrémie : coef 0,6 (H) / 0,5 (F, sujet âgé)
      if (!ok(poids, na)) return null;
      return (ok(coef) ? coef : 0.6) * poids * (na / 140 - 1);
    },
    deltaVEC(poids, htPct) { // > 0 = déficit extracellulaire (hémoconcentration)
      if (!ok(poids, htPct)) return null;
      return 0.2 * poids * ((htPct / 100) / 0.45 - 1);
    },
    clairanceMesuree(ucrMmol, v24Ml, pcrUmol) { // mL/min
      if (!ok(ucrMmol, v24Ml, pcrUmol) || pcrUmol <= 0) return null;
      return ucrMmol * 1000 * v24Ml / (pcrUmol * 1440);
    },
    cockcroft(age, poids, creatUmol, sexe) { // mL/min
      if (!ok(age, poids, creatUmol) || creatUmol <= 0) return null;
      return (140 - age) * poids * (sexe === "F" ? 1.04 : 1.23) / creatUmol;
    },
    ckdepi2021(age, creatUmol, sexe) { // mL/min/1,73 m² (équation sans coefficient ethnique)
      if (!ok(age, creatUmol) || creatUmol <= 0) return null;
      const scr = creatUmol / 88.4;
      const f = sexe === "F";
      const k = f ? 0.7 : 0.9;
      const a = f ? -0.241 : -0.302;
      return 142 * Math.pow(Math.min(scr / k, 1), a) * Math.pow(Math.max(scr / k, 1), -1.2) * Math.pow(0.9938, age) * (f ? 1.012 : 1);
    },
    fena(una, pna, ucrMmol, pcrUmol) { // %
      if (!ok(una, pna, ucrMmol, pcrUmol) || pna <= 0 || ucrMmol <= 0) return null;
      return 100 * (una * (pcrUmol / 1000)) / (pna * ucrMmol);
    },
    feuree(uurea, purea, ucrMmol, pcrUmol) { // %
      if (!ok(uurea, purea, ucrMmol, pcrUmol) || purea <= 0 || ucrMmol <= 0) return null;
      return 100 * (uurea * (pcrUmol / 1000)) / (purea * ucrMmol);
    },
    kdigo({ creat, creatBase, hausse48, diurese, eer }) {
      // diurese : "n" normale | "s1" < 0,5 mL/kg/h 6–12 h | "s2" < 0,5 ≥ 12 h | "s3" < 0,3 ≥ 24 h ou anurie ≥ 12 h
      let stade = 0;
      const ratio = ok(creat, creatBase) && creatBase > 0 ? creat / creatBase : null;
      if (ratio !== null) {
        if (ratio >= 3) stade = 3; else if (ratio >= 2) stade = 2; else if (ratio >= 1.5) stade = 1;
      }
      if (ok(creat) && creat >= 353.6 && ratio !== null && ratio >= 1.5) stade = Math.max(stade, 3);
      if (ok(hausse48) && hausse48 >= 26.5) stade = Math.max(stade, 1);
      const d = { n: 0, s1: 1, s2: 2, s3: 3 }[diurese] || 0;
      stade = Math.max(stade, d);
      if (eer) stade = 3;
      return { stade, ratio };
    },

    /* ---------- Neurologie ---------- */
    indexPulsatilite(vs, vd, vm) { return ok(vs, vd, vm) && vm > 0 ? (vs - vd) / vm : null; },
    lindegaard(vmAcm, vmAci) { return ok(vmAcm, vmAci) && vmAci > 0 ? vmAcm / vmAci : null; },
    ppc(pam, pic) { return ok(pam, pic) ? pam - pic : null; },

    /* ---------- EER ---------- */
    fractionFiltration(qsMlMin, qpreMlH, qpostMlH, perteMlH, htPct) {
      if (!ok(qsMlMin, qpreMlH, qpostMlH, perteMlH)) return null;
      const quf = qpreMlH + qpostMlH + perteMlH;
      const qsH = qsMlMin * 60;
      const ffSang = quf / (qsH + qpreMlH);
      const ffPlasma = ok(htPct) ? quf / (qsH * (1 - htPct / 100) + qpreMlH) : null;
      return { ffSang, ffPlasma };
    },
    doseEER(qsMlMin, qpreMlH, qpostMlH, qdialMlH, perteMlH, poids, htPct) {
      if (!ok(qsMlMin, qpreMlH, qpostMlH, qdialMlH, perteMlH, poids) || poids <= 0) return null;
      const eff = qpreMlH + qpostMlH + qdialMlH + perteMlH;
      const brute = eff / poids;
      const qp = qsMlMin * 60 * (1 - (ok(htPct) ? htPct : 30) / 100);
      const corr = qpreMlH > 0 ? brute * qp / (qp + qpreMlH) : brute;
      return { brute, corrigee: corr };
    },
    // Paliers débit sang / réinjection selon le poids corrigé (protocole CVVH repris de l'outil d'origine)
    cvvhPalier(poidsCorrige) {
      const p = poidsCorrige;
      if (!ok(p) || p < 40) return null;
      const t = [[50, 110, 1000], [60, 120, 1000], [70, 130, 1000], [80, 140, 1300], [90, 150, 1500], [100, 160, 1700], [110, 170, 1800], [120, 180, 2000]];
      for (const [lim, qs, rein] of t) if (p < lim) return { qs, reinj: rein };
      return { qs: 190, reinj: 2200 };
    },
    volumePlasmatique(poids, htPct) { // mL ; ≈ 70 mL/kg × (1 − Ht)
      if (!ok(poids, htPct)) return null;
      return 70 * poids * (1 - htPct / 100);
    },
    echangePlasmatique(poids, htPct, type, tp) {
      const vp = F.volumePlasmatique(poids, htPct);
      if (vp === null) return null;
      const coef = type === "curatif" ? 1.5 : 1.3;
      const vol = vp * coef;
      let fa = 1 / 3, fp = 2 / 3;
      if (type === "curatif" && ok(tp) && tp > 50) { fa = 0.5; fp = 0.5; }
      return { vp, coef, vol, albumine: vol * fa, pfc: vol * fp, fa, fp };
    },

    /* ---------- Perfusions (PSE) ---------- */
    pseDebit(dose, unite, concMgMl, poids) { // dose → débit mL/h
      if (!ok(dose, concMgMl) || concMgMl <= 0) return null;
      const P = ok(poids) ? poids : null;
      let mgH;
      switch (unite) {
        case "ugkgmin": if (P === null) return null; mgH = dose * P * 60 / 1000; break;
        case "ugmin": mgH = dose * 60 / 1000; break;
        case "mgkgh": if (P === null) return null; mgH = dose * P; break;
        case "ugkgh": if (P === null) return null; mgH = dose * P / 1000; break;
        case "mgh": mgH = dose; break;
        case "uih": mgH = dose; break; // UI/h avec concentration en UI/mL
        default: return null;
      }
      return mgH / concMgMl;
    },
    pseDose(debitMlH, unite, concMgMl, poids) { // débit → dose
      if (!ok(debitMlH, concMgMl)) return null;
      const mgH = debitMlH * concMgMl;
      const P = ok(poids) ? poids : null;
      switch (unite) {
        case "ugkgmin": return P ? mgH * 1000 / (P * 60) : null;
        case "ugmin": return mgH * 1000 / 60;
        case "mgkgh": return P ? mgH / P : null;
        case "ugkgh": return P ? mgH * 1000 / P : null;
        case "mgh": case "uih": return mgH;
        default: return null;
      }
    },

    /* ---------- Scores ---------- */
    sofa(v) {
      // v : pf, ventile, plaquettes (G/L), bili (µmol/L), cardio (0–4), gcs, creat (µmol/L), diurese (mL/24h)
      const s = {};
      if (ok(v.pf)) {
        s.resp = v.pf >= 400 ? 0 : v.pf >= 300 ? 1 : v.pf >= 200 ? 2 : (v.ventile ? (v.pf >= 100 ? 3 : 4) : 2);
      }
      if (ok(v.plaquettes)) s.coag = v.plaquettes >= 150 ? 0 : v.plaquettes >= 100 ? 1 : v.plaquettes >= 50 ? 2 : v.plaquettes >= 20 ? 3 : 4;
      if (ok(v.bili)) s.foie = v.bili < 20 ? 0 : v.bili < 33 ? 1 : v.bili < 102 ? 2 : v.bili < 205 ? 3 : 4;
      if (ok(v.cardio)) s.cardio = v.cardio;
      if (ok(v.gcs)) s.snc = v.gcs >= 15 ? 0 : v.gcs >= 13 ? 1 : v.gcs >= 10 ? 2 : v.gcs >= 6 ? 3 : 4;
      let r = null;
      if (ok(v.creat)) r = v.creat < 110 ? 0 : v.creat < 171 ? 1 : v.creat < 300 ? 2 : v.creat <= 440 ? 3 : 4;
      if (ok(v.diurese)) { const d = v.diurese < 200 ? 4 : v.diurese < 500 ? 3 : 0; r = r === null ? d : Math.max(r, d); }
      if (r !== null) s.rein = r;
      const total = Object.values(s).reduce((a, b) => a + b, 0);
      return { detail: s, total, n: Object.keys(s).length };
    },
    apfel(n) { // nombre de facteurs (0–4) → risque NVPO
      return [10, 21, 39, 61, 79][Math.max(0, Math.min(4, n))];
    },
    aldrete(v) { return ["activite", "respiration", "circulation", "conscience", "saturation"].reduce((a, k) => a + (ok(v[k]) ? v[k] : 0), 0); },

    /* ---------- Anesthésiques locaux ---------- */
    doseMaxAL(molecule, poids, adrenaline) { // mg ; poids idéal conseillé chez l'obèse
      const T = {
        ropivacaine: { mgkg: 3, max: 225 },
        bupivacaine: { mgkg: 2, max: 150 },
        levobupivacaine: { mgkg: 2, max: 150 },
        lidocaine: { mgkg: adrenaline ? 7 : 4.5, max: adrenaline ? 500 : 300 },
        mepivacaine: { mgkg: 4.4, max: 400 }
      };
      const t = T[molecule];
      if (!t || !ok(poids)) return null;
      return { mg: Math.min(t.mgkg * poids, t.max), mgkg: t.mgkg, plafond: t.max };
    },
    intralipide(poids) { // émulsion lipidique 20 % (ASRA 2020)
      // > 70 kg : bolus 100 mL puis 200–250 mL sur 15–20 min ; ≤ 70 kg : 1,5 mL/kg puis 0,25 mL/kg/min (poids idéal)
      if (!ok(poids) || poids <= 0) return null;
      if (poids > 70) return { bolus: 100, perf: "200–250 mL sur 15–20 min", max: 12 * poids };
      return { bolus: 1.5 * poids, perf: `${(0.25 * poids).toFixed(1).replace(".", ",")} mL/min (0,25 mL/kg/min)`, max: 12 * poids };
    },

    /* ---------- Échographie pleuro-pulmonaire et diaphragmatique ---------- */
    lus(scores) { // 12 régions cotées 0 à 3 (0 : lignes A ; 1 : ≥ 3 lignes B espacées ; 2 : lignes B coalescentes ; 3 : condensation)
      const v = (scores || []).filter(x => ok(x));
      if (!v.length) return null;
      return { total: v.reduce((a, b) => a + b, 0), n: v.length, max: 3 * v.length };
    },
    epanchement(methode, a, b) { // volume en mL
      if (methode === "balik") return ok(a) ? 20 * a : null;                 // Sep (mm), décubitus dorsal tronc à 15°
      if (methode === "eibenberger") return ok(a) ? Math.max(0, 47.6 * a - 837) : null; // distance (mm), décubitus dorsal
      if (methode === "goecke") return ok(a) && ok(b) ? (a + b) * 70 : null; // hauteur latérale + sous-pulmonaire (cm), assis
      if (methode === "remerand") return ok(a) && ok(b) ? a * b : null;      // longueur paravertébrale (cm) × surface (cm²)
      return null;
    },
    diaphragme({ excursion, epIns, epExp, fr }) { // excursion en mm, épaisseurs en mm, FR en c/min
      const r = {};
      if (ok(epIns) && ok(epExp) && epExp > 0) r.tf = (epIns - epExp) / epExp * 100;
      if (ok(fr) && ok(excursion) && excursion > 0) r.drsbi = fr / excursion;
      return Object.keys(r).length ? r : null;
    },

    /* ---------- Antithrombotiques avant une procédure programmée ----------
       Anticoagulants : RFE GIHP-SFAR 2026. Antiagrégants : propositions GIHP-GFHT 2018.
       risque : "f" faible, "e" élevé, "te" très élevé (neurochirurgie intracrânienne, neuraxial).
       Retour : { action, jour (J-n, négatif), cible, notes[] } */
    arretAnticoagulant(mol, risque, dfg) {
      const AOD_XA = ["apixaban", "rivaroxaban", "edoxaban"];
      const AVK = { warfarine: -6, fluindione: -5, acenocoumarol: -4, phenprocoumone: -8 };
      const notes = [];
      const d = ok(dfg) ? dfg : null;
      if (AOD_XA.includes(mol) || mol === "dabigatran") {
        if (risque === "f") return { action: "saut", jour: null, notes: ["Pas de prise la veille au soir ni le matin de la procédure, quel que soit le schéma (1 ou 2 prises par jour)"] };
        if (mol === "dabigatran" && d !== null && d < 30) return { action: "avis", jour: null, notes: ["Dabigatran non recommandé si DFGe < 30 mL/min : avis spécialisé et dosage de la concentration"] };
        let j = -3;
        if (risque === "te") j = -5;
        if (mol === "dabigatran" && d !== null && d < 50) j = -5;
        if (mol !== "dabigatran" && d !== null && d < 30) j = -5;
        if (d !== null && d < 30 && mol !== "dabigatran") notes.push("IRC sévère ou terminale : vérifier que la posologie est adaptée au DFG" + (d < 15 ? " (utilisation hors AMM)" : ""));
        if (risque === "te" && d !== null && d < 50) notes.push("IRC et procédure à très haut risque : dosage de la concentration d'AOD conseillé (seuil < 30 ng/mL)");
        return { action: "arret", jour: j, notes };
      }
      if (AVK[mol] !== undefined) {
        if (risque === "f") return { action: "poursuite", jour: null, cible: null, notes: ["Poursuivre l'AVK ; INR dans la semaine précédant la procédure (absence de surdosage)"] };
        return { action: "arret", jour: AVK[mol], cible: risque === "te" ? 1.2 : 1.5, notes };
      }
      const H = { hbpm_cur: "24 h", hnf_sc: "24 h", hnf_ivse: "6 h", fonda_cur: "J-4", hbpm_prev: "12 h" };
      if (H[mol]) {
        if (mol === "fonda_cur") return { action: "arret", jour: -4, notes: d !== null && d < 50 ? ["Adapter le délai à la fonction rénale (allonger)"] : [] };
        if (mol === "hbpm_prev") return { action: risque === "f" ? "poursuite" : "arret_h", heures: 12, notes: [] };
        if (mol === "hbpm_cur" && d !== null && d < 30) notes.push("DFGe < 30 : HBPM en une injection par jour (tinzaparine 175 UI/kg ou énoxaparine 100 UI/kg), dernière injection le soir de J-2");
        return { action: risque === "f" ? "poursuite" : "arret_h", heures: parseInt(H[mol], 10), notes };
      }
      return null;
    },
    arretAntiagregant(mol, risqueAP) {
      // risqueAP : "faible" (faisable sous bithérapie), "inter" (sous aspirine seule), "eleve" (sans antiplaquettaire)
      const J = { aspirine: -3, clopidogrel: -5, ticagrelor: -5, prasugrel: -7 };
      if (J[mol] === undefined) return null;
      if (risqueAP === "faible") return { action: "poursuite", jour: null };
      if (mol === "aspirine") return risqueAP === "eleve" ? { action: "arret", jour: J.aspirine } : { action: "poursuite", jour: null };
      return { action: "arret", jour: J[mol] };
    },

    /* ---------- Sonde double lumière ----------
       Taille selon le sexe et la taille (Slinger) ; profondeur d'insertion
       aux arcades = 12 + taille/10 cm (Brodsky) ; choix selon le diamètre
       de la bronche souche gauche : diamètre externe bronchique ≤ diamètre − 1 mm. */
    dltTaille(sexe, taille) {
      if (!ok(taille)) return null;
      if (sexe === "F") return taille < 152 ? 32 : taille < 160 ? 35 : 37;
      return taille < 160 ? 37 : taille < 170 ? 39 : 41;
    },
    dltProfondeur(taille) { return ok(taille) ? 12 + taille / 10 : null; },
    dltDepuisBronche(diam, fab) {
      const OD = {
        covidien: [[41, 10.8], [39, 10.2], [37, 9.9], [35, 9.5]],
        parker: [[41, 12.0], [39, 11.5], [37, 11.5], [35, 10.5], [32, 8.5]]
      }[fab || "covidien"];
      if (!ok(diam) || !OD) return null;
      const fit = OD.find(([, od]) => od <= diam - 1);
      return fit ? { fr: fit[0], od: fit[1] } : { fr: null };
    },

    /* ---------- Anesthésie : poids de calcul des doses ---------- */
    poidsMaigre(sexe, tailleCm, poidsKg) { // masse maigre, Janmahasatian 2005
      const imc = F.imc(tailleCm, poidsKg);
      if (imc === null) return null;
      return sexe === "F" ? 9270 * poidsKg / (8780 + 244 * imc) : 9270 * poidsKg / (6680 + 216 * imc);
    },
    /* Poids à utiliser selon le médicament : poids réel si IMC < 30 ; chez l'obèse,
       masse maigre (hypnotiques, morphiniques), poids idéal (curares non dépolarisants),
       poids réel (succinylcholine, sugammadex). */
    poidsDose(sexe, tailleCm, poidsKg) {
      const imc = F.imc(tailleCm, poidsKg);
      if (imc === null) return ok(poidsKg) ? { reel: poidsKg, maigre: poidsKg, ideal: poidsKg, imc: null, obese: false } : null;
      const obese = imc >= 30;
      const pit = F.poidsIdeal(sexe, tailleCm);
      return { reel: poidsKg, imc, obese, maigre: obese ? F.poidsMaigre(sexe, tailleCm, poidsKg) : poidsKg, ideal: obese ? Math.min(pit, poidsKg) : poidsKg };
    },

    /* ---------- Urgences ---------- */
    dantrolene(poids) { // 2,5 mg/kg par bolus, flacons de 20 mg à reconstituer dans 60 mL d'eau stérile, jusqu'à 10 mg/kg
      if (!ok(poids) || poids <= 0) return null;
      const dose = 2.5 * poids, flacons = Math.ceil(dose / 20);
      return { dose, flacons, eau: flacons * 60, max: 10 * poids, flaconsMax: Math.ceil(10 * poids / 20) };
    },
    debitPSE(doseUgKgMin, poids, concUgMl) { // mL/h
      if (!ok(doseUgKgMin, poids, concUgMl) || concUgMl <= 0) return null;
      return doseUgKgMin * poids * 60 / concUgMl;
    },

    /* ---------- Transfusion ---------- */
    pertesAdmissibles(sexe, poids, hbInit, hbSeuil) { // Gross : VST × (Hb i − Hb s) / Hb moyenne
      if (!ok(poids, hbInit, hbSeuil) || hbInit <= 0 || hbSeuil <= 0) return null;
      const vst = (sexe === "F" ? 65 : 70) * poids;
      const pertes = hbInit > hbSeuil ? vst * (hbInit - hbSeuil) / ((hbInit + hbSeuil) / 2) : 0;
      return { vst, pertes };
    },

    /* ---------- Antibioprophylaxie : heures de réinjection ---------- */
    heuresReinjection(hhmm, intervalleH, dureeH) {
      const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm || "");
      if (!m || !ok(intervalleH) || intervalleH <= 0) return null;
      const t0 = (+m[1]) * 60 + (+m[2]);
      const n = ok(dureeH) && dureeH > 0 ? Math.floor((dureeH * 60 - 1) / (intervalleH * 60)) : 2;
      const out = [];
      for (let i = 1; i <= Math.min(n, 6); i++) {
        const t = (t0 + i * intervalleH * 60) % 1440;
        out.push(String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0"));
      }
      return out;
    },

    /* ---------- Thromboprophylaxie (RFE GIHP-SFAR 2024) ---------- */
    thromboDose({ poids, imc, dfg }) {
      if (ok(dfg) && dfg < 15) return { mol: "Héparine calcique (HNF)", dose: "5 000 UI × 2/j SC", motif: "DFG < 15 mL/min : HBPM et AOD contre-indiqués" };
      if (ok(dfg) && dfg < 30) return { mol: "Énoxaparine", dose: "2 000 UI × 1/j SC", motif: "DFG 15–30 mL/min : dose réduite" };
      if (ok(imc) && imc >= 40) return ok(poids) && poids > 150
        ? { mol: "Énoxaparine", dose: "6 000 UI × 2/j SC", motif: "IMC ≥ 40 et poids > 150 kg" }
        : { mol: "Énoxaparine", dose: "4 000 UI × 2/j SC", motif: "IMC ≥ 40 kg/m² (6 000 UI × 1/j envisageable)" };
      if (ok(poids) && poids < 45) return { mol: "Énoxaparine", dose: "2 000 UI × 1/j SC", motif: "Poids < 45 kg : dose réduite" };
      return { mol: "Énoxaparine", dose: "4 000 UI × 1/j SC", motif: "Schéma standard" };
    },

    /* ---------- IGS II (Le Gall 1993) ---------- */
    igs2(v) {   // v : points déjà attribués par variable (sélecteurs) ; renvoie total et mortalité prédite
      const pts = Object.values(v).map(Number).filter(x => !isNaN(x));
      if (!pts.length) return null;
      const score = pts.reduce((a, b) => a + b, 0);
      const logit = -7.7631 + 0.0737 * score + 0.9971 * Math.log(score + 1);
      return { score, mortalite: 100 * Math.exp(logit) / (1 + Math.exp(logit)) };
    },

    /* ---------- Morphine ---------- */
    titrationMorphine(poids, age) {
      if (!ok(poids)) return null;
      let bolus = poids < 60 ? 2 : 3;
      if (ok(age) && age >= 70) bolus = 2;
      return { bolus, intervalle: 5 };
    }
  };

  root.P17Calc = F;
  if (typeof module !== "undefined" && module.exports) module.exports = F;
})(typeof window !== "undefined" ? window : globalThis);
