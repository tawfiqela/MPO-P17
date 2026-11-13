/* Tests des formules : node tests/calc.test.js */
const assert = require("assert");
const F = require("../assets/calc.js");
const near = (a, b, tol = 0.01, msg = "") => assert.ok(Math.abs(a - b) <= tol, `${msg} attendu ${b}, obtenu ${a}`);

// Poids idéal (Devine) : homme 180 cm ≈ 75,2 kg ; femme 165 cm ≈ 57,0 kg
near(F.poidsIdeal("H", 180), 75.1, 0.1, "PIT homme");
near(F.poidsIdeal("F", 165), 56.97, 0.1, "PIT femme");
// Poids ajusté : 120 kg, 175 cm homme → PIT 70,6 ; ajusté 70,6 + 0,4 × 49,4 = 90,4
near(F.poidsAjuste("H", 175, 120), 90.4, 0.2, "poids ajusté");
near(F.surfaceCorporelle(170, 70), 1.818, 0.005, "SC Mosteller");

// Ventilation
near(F.pf(80, 40), 200, 0.001, "P/F en %");
near(F.pf(80, 0.4), 200, 0.001, "P/F en fraction");
assert.ok(F.berlin(150).includes("modéré"));
assert.deepStrictEqual(F.mecaniqueVentilatoire(420, 28, 10), { driving: 18, compliance: 420 / 18 });
near(F.espaceMort(50, 30, 500).fraction, 0.4, 1e-9, "VD/VT");
near(F.debitNO(20, 800, 8), 20 * 8 / 780, 1e-9, "NO");
near(F.rox(92, 50, 30), (92 / 0.5) / 30, 1e-9, "ROX");

// Hémodynamique : d = 20 mm, ITV 20 cm, FC 80 → surface 3,14 cm², VES 62,8 mL, DC 5,03 L/min
const dc = F.dcEcho(20, 20, 80);
near(dc.surface, 3.1416, 0.001, "surface CCVG"); near(dc.ves, 62.83, 0.01, "VES"); near(dc.dc, 5.027, 0.001, "DC écho");
near(F.pam(120, 60), 80, 1e-9, "PAM");
near(F.rvs(80, 8, 5), 1152, 1e-9, "RVS");
near(F.rvp(30, 10, 5).wood, 4, 1e-9, "RVP");
near(F.do2(12, 98, 100, 5).do2, 5 * (1.34 * 12 * 0.98 + 0.3) * 10, 1e-6, "DO2");

// Métabolique
near(F.glyMmol(1, "gl"), 5.551, 0.001, "conversion glycémie");
near(F.osmolarite(140, 5.5, 5), 290.5, 1e-9, "osmolarité");
near(F.naCorrige(130, 5).katz, 136.4, 1e-9, "Na corrigé Katz"); // 130 + 1,6 × (5 − 1)
near(F.caCorrige(2.0, 30), 2.2, 1e-9, "Ca corrigé");
near(F.trouAnionique(140, 104, 24).ta, 12, 1e-9, "TA");
near(F.trouAnionique(140, 104, 24, 20).corrige, 17, 1e-9, "TA corrigé");
near(F.deltaVIC(70, 150), 0.4 * 70 * (140 / 150 - 1), 1e-9, "ΔVIC");
assert.ok(F.deltaVIC(70, 150) < 0, "hypernatrémie = déshydratation IC (négatif)");
assert.ok(F.deltaVEC(70, 55) > 0, "hémoconcentration = déficit VEC (positif)");
near(F.deltaVEC(70, 55), 0.2 * 70 * (0.55 / 0.45 - 1), 1e-9, "ΔVEC");
near(F.clairanceMesuree(8, 1440, 100), 80, 1e-9, "clairance mesurée");
near(F.cockcroft(60, 70, 100, "H"), 68.88, 0.01, "Cockcroft H");
// CKD-EPI 2021 : homme 60 ans, créatinine 1,0 mg/dL (88,4 µmol/L) ≈ 86 mL/min/1,73 m²
near(F.ckdepi2021(60, 88.4, "H"), 86.3, 0.6, "CKD-EPI 2021 homme");
// femme 50 ans, créatinine 0,7 mg/dL → 142 × 0,9938^50 × 1,012 ≈ 105
near(F.ckdepi2021(50, 0.7 * 88.4, "F"), 105.3, 0.6, "CKD-EPI 2021 femme");
near(F.fena(20, 140, 10, 200), 100 * (20 * 0.2) / (140 * 10), 1e-9, "FENa");
assert.strictEqual(F.kdigo({ creat: 200, creatBase: 100, diurese: "n" }).stade, 2);
assert.strictEqual(F.kdigo({ creat: 120, creatBase: 100, hausse48: 30, diurese: "n" }).stade, 1);
assert.strictEqual(F.kdigo({ creat: 100, creatBase: 100, diurese: "s3" }).stade, 3);
assert.strictEqual(F.kdigo({ creat: 400, creatBase: 200, diurese: "n" }).stade, 3);
assert.strictEqual(F.kdigo({ creat: 110, creatBase: 100, diurese: "n", eer: true }).stade, 3);

// Neurologie
near(F.indexPulsatilite(100, 40, 60), 1, 1e-9, "IP");
near(F.lindegaard(150, 40), 3.75, 1e-9, "Lindegaard");

// EER
const ff = F.fractionFiltration(150, 0, 1500, 100, 30);
near(ff.ffSang, 1600 / 9000, 1e-9, "FF sang");
near(ff.ffPlasma, 1600 / (9000 * 0.7), 1e-9, "FF plasma");
assert.deepStrictEqual(F.cvvhPalier(75), { qs: 140, reinj: 1300 });
assert.deepStrictEqual(F.cvvhPalier(125), { qs: 190, reinj: 2200 });
assert.strictEqual(F.cvvhPalier(35), null);
const ep = F.echangePlasmatique(70, 40, "curatif", 60);
near(ep.vp, 2940, 1e-9, "VP"); near(ep.vol, 4410, 1e-9, "volume EP"); near(ep.albumine, 2205, 1e-9, "albumine 1/2");

// PSE : noradrénaline 0,2 mg/mL, 70 kg, 0,1 µg/kg/min → 0,42 mg/h → 2,1 mL/h
near(F.pseDebit(0.1, "ugkgmin", 0.2, 70), 2.1, 1e-9, "PSE débit");
near(F.pseDose(2.1, "ugkgmin", 0.2, 70), 0.1, 1e-9, "PSE dose");
near(F.pseDebit(10, "ugmin", 0.2, null), 3, 1e-9, "PSE µg/min");

// Scores
const sofa = F.sofa({ pf: 150, ventile: true, plaquettes: 80, bili: 40, cardio: 3, gcs: 14, creat: 200 });
assert.strictEqual(sofa.total, 3 + 2 + 2 + 3 + 1 + 2);
assert.strictEqual(F.sofa({ pf: 150, ventile: false }).detail.resp, 2, "P/F < 200 sans ventilation = 2");
assert.strictEqual(F.apfel(2), 39);
assert.strictEqual(F.aldrete({ activite: 2, respiration: 2, circulation: 2, conscience: 1, saturation: 2 }), 9);

// Anesthésiques locaux
assert.strictEqual(F.doseMaxAL("ropivacaine", 70).mg, 210);
assert.strictEqual(F.doseMaxAL("ropivacaine", 100).mg, 225);
assert.strictEqual(F.doseMaxAL("lidocaine", 70, true).mg, 490);
assert.strictEqual(F.intralipide(60).bolus, 90);
assert.strictEqual(F.intralipide(90).bolus, 100);
assert.strictEqual(F.titrationMorphine(55, 40).bolus, 2);
assert.strictEqual(F.titrationMorphine(80, 40).bolus, 3);
assert.strictEqual(F.titrationMorphine(80, 75).bolus, 2);

// Échographie pleuro-pulmonaire et diaphragme
assert.strictEqual(F.lus([0, 1, 2, 3, 0, 0, 1, 1, 2, 2, 3, 0]).total, 15);
assert.strictEqual(F.epanchement("balik", 40), 800);
near(F.epanchement("eibenberger", 30), 591, 1e-9, "Eibenberger");
assert.strictEqual(F.epanchement("goecke", 5, 3), 560);
assert.strictEqual(F.epanchement("remerand", 12, 50), 600);
near(F.diaphragme({ epIns: 2.6, epExp: 2 }).tf, 30, 1e-9, "fraction d'épaississement");
near(F.diaphragme({ excursion: 15, fr: 24 }).drsbi, 1.6, 1e-9, "D-RSBI");

// Antithrombotiques (GIHP-SFAR 2026, GIHP 2018)
assert.strictEqual(F.arretAnticoagulant("apixaban", "e", 80).jour, -3);
assert.strictEqual(F.arretAnticoagulant("apixaban", "e", 25).jour, -5);
assert.strictEqual(F.arretAnticoagulant("rivaroxaban", "te", 90).jour, -5);
assert.strictEqual(F.arretAnticoagulant("dabigatran", "e", 40).jour, -5);
assert.strictEqual(F.arretAnticoagulant("dabigatran", "e", 25).action, "avis");
assert.strictEqual(F.arretAnticoagulant("edoxaban", "f", 60).action, "saut");
assert.strictEqual(F.arretAnticoagulant("warfarine", "e").jour, -6);
assert.strictEqual(F.arretAnticoagulant("fluindione", "te").cible, 1.2);
assert.strictEqual(F.arretAnticoagulant("acenocoumarol", "f").action, "poursuite");
assert.strictEqual(F.arretAnticoagulant("hnf_ivse", "e").heures, 6);
assert.strictEqual(F.arretAntiagregant("aspirine", "inter").action, "poursuite");
assert.strictEqual(F.arretAntiagregant("aspirine", "eleve").jour, -3);
assert.strictEqual(F.arretAntiagregant("prasugrel", "inter").jour, -7);
assert.strictEqual(F.arretAntiagregant("clopidogrel", "faible").action, "poursuite");

// Sonde double lumière
assert.strictEqual(F.dltTaille("F", 158), 35);
assert.strictEqual(F.dltTaille("F", 165), 37);
assert.strictEqual(F.dltTaille("H", 175), 41);
assert.strictEqual(F.dltTaille("H", 165), 39);
assert.strictEqual(F.dltProfondeur(170), 29);
assert.strictEqual(F.dltDepuisBronche(11.5, "covidien").fr, 39);
assert.strictEqual(F.dltDepuisBronche(11, "covidien").fr, 37);
assert.strictEqual(F.dltDepuisBronche(13, "parker").fr, 41);
assert.strictEqual(F.dltDepuisBronche(9, "covidien").fr, null);

// Poids de calcul des doses
near(F.poidsMaigre("H", 175, 120), 9270 * 120 / (6680 + 216 * (120 / 1.75 ** 2)), 0.01);
assert.strictEqual(F.poidsDose("H", 175, 70).maigre, 70);
assert.ok(F.poidsDose("F", 160, 110).obese);
assert.ok(F.poidsDose("F", 160, 110).maigre < 70 && F.poidsDose("F", 160, 110).maigre > 50);
near(F.poidsDose("F", 160, 110).ideal, 45.5 + 0.91 * (160 - 152.4), 0.01);
// Dantrolène
assert.deepStrictEqual(F.dantrolene(70), { dose: 175, flacons: 9, eau: 540, max: 700, flaconsMax: 35 });
// Débit de seringue : 0,1 µg/kg/min, 70 kg, 20 µg/mL → 21 mL/h
near(F.debitPSE(0.1, 70, 20), 21, 0.001);
// Pertes sanguines admissibles : homme 70 kg, 14 → 8 g/dL : 4900 × 6 / 11
near(F.pertesAdmissibles("H", 70, 14, 8).pertes, 4900 * 6 / 11, 0.5);
assert.strictEqual(F.pertesAdmissibles("F", 60, 9, 10).pertes, 0);
// Réinjections
assert.deepStrictEqual(F.heuresReinjection("08:30", 4, 9), ["12:30", "16:30"]);
assert.deepStrictEqual(F.heuresReinjection("23:00", 2, 5), ["01:00", "03:00"]);
assert.deepStrictEqual(F.heuresReinjection("08:00", 4, 4), []);
assert.strictEqual(F.heuresReinjection("8h", 4, 6), null);
// Thromboprophylaxie
assert.ok(F.thromboDose({ poids: 70, imc: 24, dfg: 80 }).dose.startsWith("4 000 UI × 1"));
assert.ok(F.thromboDose({ poids: 70, imc: 24, dfg: 22 }).dose.startsWith("2 000"));
assert.ok(F.thromboDose({ poids: 70, imc: 24, dfg: 10 }).mol.includes("HNF"));
assert.ok(F.thromboDose({ poids: 130, imc: 44, dfg: 80 }).dose.startsWith("4 000 UI × 2"));
assert.ok(F.thromboDose({ poids: 160, imc: 52, dfg: 80 }).dose.startsWith("6 000 UI × 2"));
assert.ok(F.thromboDose({ poids: 42, imc: 17, dfg: 80 }).dose.startsWith("2 000"));

console.log("Tous les tests de calcul sont passés.");
