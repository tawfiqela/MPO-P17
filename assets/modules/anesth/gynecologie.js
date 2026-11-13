/* Anesthésie en gynécologie (sein et cancérologie, hors obstétrique) */
(function () {
  const { S, ul, kv, warn, danger, info, tbl } = P17.h;
  const REF_ABP = "RFE SFAR-SPILF 2024 : Antibioprophylaxie en chirurgie et médecine interventionnelle (adulte)";
  const REF_ERAS = "Nelson G et al. ERAS Society guidelines for gynecologic/oncology surgery : 2019 update. Int J Gynecol Cancer 2019";
  const REF_SEIN = "Jacobs A et al. PROSPECT : oncological breast surgery. Anaesthesia 2020";
  const REF_NVPO = "Gan TJ et al. Fourth consensus guidelines for the management of postoperative nausea and vomiting. Anesth Analg 2020";

  window.P17_ANESTH = window.P17_ANESTH || [];
  window.P17_ANESTH.push({
    id: "gynecologie", title: "Anesthésie en gynécologie", short: "Gynécologie",
    desc: "Chirurgie du sein et cancérologie gynécologique (hors obstétrique).",
    generalites: {
      subtitle: "Chirurgie mammaire et gynécologique carcinologique",
      tags: ["NVPO à haut risque", "Trendelenburg", "Thromboprophylaxie prolongée", "RAAC"],
      sections: [
        S("Particularités", [
          ul("Population féminine, souvent non fumeuse : risque élevé de NVPO (score d'Apfel ≥ 2 fréquent)",
            "Chimiothérapie néoadjuvante : cardiotoxicité (anthracyclines → échocardiographie), neuropathie, chambre implantable",
            "Cancer : état d'hypercoagulabilité, anémie, dénutrition",
            "Lymphœdème ou curage axillaire antérieur : pas de brassard ni de voie veineuse du côté opéré")
        ]),
        S("Prévention des NVPO", [
          ul("Double prophylaxie systématique : dexaméthasone 4–8 mg à l'induction + ondansétron 4 mg en fin d'intervention",
            "Score d'Apfel ≥ 3 : ajouter un troisième agent (dropéridol 0,625–1,25 mg) et privilégier l'anesthésie intraveineuse au propofol",
            "Épargne morphinique, hydratation correcte, pas de protoxyde d'azote")
        ]),
        S("Douleur chronique postopératoire", [
          ul("Fréquente après mastectomie (20–30 %) : facteurs de risque = douleur préopératoire, anxiété, curage axillaire, radiothérapie, jeune âge",
            "Prévention : ALR (bloc paravertébral, PECS, ESP), kétamine peropératoire, analgésie multimodale efficace")
        ]),
        S("Laparoscopie et robot : Trendelenburg", [
          ul("Trendelenburg prononcé (25–30°) + pneumopéritoine : baisse de la compliance, hausse des pressions de ventilation, œdème facial et laryngé, hausse de la PIC et de la PIO",
            "Ventilation protectrice, PEP 5–8 cmH₂O, surveiller la pression motrice",
            "Installation : matelas anti-glissement, épaules libres (pas d'appuis claviculaires), protection des yeux, bras le long du corps protégés",
            "Durée prolongée : limiter les apports hydriques, contrôler le test de fuite au ballonnet avant l'extubation")
        ]),
        S("Thromboprophylaxie", [
          ul("HBPM débutée en postopératoire, prolongée 4 semaines après chirurgie carcinologique pelvienne ou abdominale",
            "Contention mécanique associée")
        ]),
        S("Antibioprophylaxie : vue d'ensemble", [
          tbl(["Intervention", "Antibioprophylaxie"], [
            ["Tumorectomie sans curage ou avec ganglion sentinelle", "Aucune"],
            ["Tumorectomie avec curage axillaire, mastectomie ± reconstruction", "Céfazoline 2 g IV (céfuroxime 1,5 g)"],
            ["Hystérectomie totale (voie haute, cœlioscopie, robot) ± annexectomie", "Céfoxitine 2 g IV (1 g si > 2 h)"],
            ["Hystérectomie subtotale, myomectomie", "Céfazoline 2 g IV"],
            ["Annexectomie, lymphadénectomie pelvienne ou lombo-aortique, omentectomie", "Céfazoline 2 g IV"],
            ["Colpectomie", "Céfoxitine 2 g IV"],
            ["Chirurgie vulvaire ou périnéale majeure", "Céfazoline 2 g IV"],
            ["Conisation, hystéroscopie, gestes vaginaux simples", "Aucune"]
          ], "Allergie : céfazoline → clindamycine 900 mg IV ; céfoxitine → clindamycine 900 mg + gentamicine 6–7 mg/kg IV.")
        ], { wide: true })
      ],
      refs: [REF_ERAS, REF_SEIN, REF_NVPO, REF_ABP]
    },
    interventions: [
      {
        id: "tumorectomie", title: "Tumorectomie et ganglion sentinelle", subtitle: "Chirurgie conservatrice du sein",
        tags: ["Ambulatoire", "NVPO", "Bleu patenté"],
        sections: [
          S("Particularités", [ul("Chirurgie courte, ambulatoire dans la majorité des cas", "Repérage préalable (harpon, radio-isotope)", "Bleu patenté ou vert d'indocyanine pour le ganglion sentinelle : désaturation factice à l'oxymètre, rares réactions anaphylactiques (parfois retardées de 30 min)")]),
          S("Technique", [ul("AG avec masque laryngé (ou sédation + ALR)", "Bloc PECS I ou infiltration par le chirurgien ; ESP ou paravertébral si curage", "Double prophylaxie des NVPO")]),
          S("Antibioprophylaxie", [kv(["Sans curage / ganglion sentinelle", "Aucune"], ["Avec curage axillaire", "Céfazoline 2 g IV ; allergie : clindamycine 900 mg"])]),
          S("Sortie", [ul("Critères d'ambulatoire, analgésie orale (paracétamol, AINS)", "Prévenir la patiente de la coloration bleue des urines et de la peau")])
        ],
        refs: [REF_SEIN, REF_ABP]
      },
      {
        id: "mastectomie", title: "Mastectomie et reconstruction mammaire", subtitle: "Mastectomie ± curage, reconstruction immédiate (prothèse, grand dorsal, DIEP)",
        tags: ["PECS / paravertébral", "Lambeau libre", "Douleur chronique"],
        sections: [
          S("Analgésie régionale", [tbl(["Chirurgie", "Bloc"], [
            ["Mastectomie simple", "PECS I + II (ou bloc du dentelé antérieur)"],
            ["Mastectomie avec curage axillaire", "Paravertébral T2–T4 ou ESP ; PECS II"],
            ["Reconstruction par grand dorsal", "ESP ou paravertébral, infiltration du site donneur"],
            ["Lambeau abdominal (DIEP)", "TAP ou bloc de la gaine des droits + bloc thoracique"]
          ]), ul("Kétamine 0,15–0,5 mg/kg puis 0,125–0,25 mg/kg/h si facteurs de risque de douleur chronique", "Paracétamol, AINS, dexaméthasone")]),
          S("Antibioprophylaxie", [kv(["Molécule", "Céfazoline 2 g IV (céfuroxime 1,5 g)"], ["Réinjection", "1 g si > 4 h, puis toutes les 4 h"], ["Allergie", "Clindamycine 900 mg IV"])]),
          S("Lambeau libre (DIEP) : microchirurgie", [ul("Chirurgie longue (6–8 h) : normothermie stricte, normovolémie guidée par objectifs, PAM ≥ 65–70 mmHg", "Les vasopresseurs à dose modérée ne compromettent pas le lambeau ; éviter l'hypovolémie et l'hypothermie", "Hb > 8–9 g/dL, éviter l'excès de cristalloïdes (œdème du lambeau)", "Réveil calme sans frissons ni HTA, analgésie efficace (vasoconstriction douloureuse)")]),
          S("Postopératoire", [ul("Surveillance horaire du lambeau (couleur, chaleur, recoloration, doppler)", "Thromboprophylaxie, lever précoce", "Prévention des NVPO, alimentation précoce"), warn("Toute anomalie du lambeau = appel immédiat du chirurgien : la reprise précoce conditionne le sauvetage.")])
        ],
        refs: [REF_SEIN, "Temple-Oberle C et al. ERAS Society consensus for breast reconstruction. Plast Reconstr Surg 2017", REF_ABP]
      },
      {
        id: "hysterectomie", title: "Hystérectomie", subtitle: "Voie cœlioscopique, robot-assistée ou laparotomie (bénin et cancer de l'endomètre)",
        tags: ["Trendelenburg", "Céfoxitine", "RAAC"],
        sections: [
          S("Particularités", [ul("Cœlioscopie ou robot : Trendelenburg et pneumopéritoine (voir généralités)", "Cancer de l'endomètre : patientes souvent obèses, diabétiques, hypertendues (syndrome métabolique)", "Saignement modéré (fibromes volumineux : plus important)")]),
          S("Antibioprophylaxie", [kv(["Hystérectomie totale", "Céfoxitine 2 g IV, 1 g si > 2 h puis /2 h"], ["Subtotale", "Céfazoline 2 g IV"], ["Allergie", "Clindamycine 900 mg + gentamicine 6–7 mg/kg IV"])]),
          S("Technique", [ul("AG avec intubation ; curarisation profonde utile en cœlioscopie", "Obésité : préoxygénation en proclive, vidéolaryngoscope, ventilation protectrice sur le poids idéal", "Prophylaxie des NVPO multimodale")]),
          S("Analgésie", [ul("Cœlioscopie : paracétamol, AINS, dexaméthasone, infiltration ; TAP à discuter", "Laparotomie : TAP ou carré des lombes, morphine intrathécale (100 µg) ou péridurale selon l'étendue", "Lidocaïne IV en l'absence d'ALR")]),
          S("Postopératoire", [ul("RAAC : alimentation et lever à J0, sonde urinaire retirée à J0–J1", "Thromboprophylaxie prolongée si cancer", "Rétention urinaire, lésion urétérale (douleur lombaire, fièvre)")])
        ],
        refs: [REF_ERAS, "Lirk P et al. PROSPECT : laparoscopic hysterectomy. Reg Anesth Pain Med 2019", REF_ABP]
      },
      {
        id: "cytoreduction-ovaire", title: "Cytoréduction ovarienne ± CHIP", subtitle: "Chirurgie de debulking, chimiohyperthermie intrapéritonéale",
        tags: ["Chirurgie longue", "Ascite", "Hyperthermie", "Réanimation"],
        sections: [
          S("Préopératoire", [ul("Carcinose péritonéale : ascite (drainage partiel préalable discuté), dénutrition, hypoalbuminémie", "Épanchement pleural, thrombose veineuse fréquente", "Fonction rénale (cisplatine néphrotoxique), cardiaque (anthracyclines)")]),
          S("Antibioprophylaxie", [kv(["Sans résection digestive", "Céfoxitine 2 g IV (1 g si > 2 h)"], ["Avec résection colorectale", "Céfoxitine 2 g IV ± préparation orale selon le chirurgien"], ["Allergie", "Clindamycine 900 mg + gentamicine 6–7 mg/kg IV"])]),
          S("Technique", [ul("AG + péridurale thoracique (T8–T10) si hémostase normale", "Cathéter artériel, voie veineuse centrale, sonde urinaire, sonde thermique", "Remplissage guidé par objectifs : pertes considérables (ascite, exsudation, saignement 1–2 L)", "Albumine si hypoalbuminémie sévère, produits sanguins disponibles, acide tranexamique")]),
          S("Phase de CHIP", [ul("Hyperthermie (perfusat à 41–43 °C) : température centrale jusqu'à 39–40 °C — refroidissement actif (perfusions froides, couverture), objectif < 39 °C", "Hausse de la consommation d'O₂, de l'EtCO₂ et de la FC ; acidose métabolique", "Cisplatine : maintenir une diurèse ≥ 1 mL/kg/h, éviter AINS et autres néphrotoxiques", "Oxaliplatine en soluté glucosé : hyperglycémie et hyponatrémie — glycémie et natrémie horaires", "Protection du personnel (cytotoxiques)")]),
          S("Postopératoire", [ul("Réanimation ou soins continus 24–48 h", "Pertes protidiques et hydriques importantes, troubles de l'hémostase", "Thromboprophylaxie prolongée 4 semaines", "Complications : fistule digestive, insuffisance rénale, pancytopénie (chimiothérapie)")])
        ],
        refs: [REF_ERAS, "Hübner M et al. ERAS guidelines for cytoreductive surgery and HIPEC. Eur J Surg Oncol 2020", REF_ABP]
      },
      {
        id: "wertheim", title: "Hystérectomie élargie et lymphadénectomies", subtitle: "Colpohystérectomie élargie (Wertheim), curages pelviens et lombo-aortiques",
        tags: ["Cancer du col", "Saignement", "Uretères"],
        sections: [
          S("Particularités", [ul("Cancer du col (souvent après radiochimiothérapie) ou de l'endomètre de haut grade", "Lymphadénectomie lombo-aortique : risque de plaie vasculaire (veine cave, aorte, veine rénale gauche)", "Durée prolongée, saignement 500–1500 mL")]),
          S("Antibioprophylaxie", [kv(["Colpohystérectomie élargie", "Céfoxitine 2 g IV (1 g si > 2 h)"], ["Lymphadénectomie seule", "Céfazoline 2 g IV"], ["Allergie", "Clindamycine 900 mg + gentamicine 6–7 mg/kg IV"])]),
          S("Technique", [ul("AG ; cathéter artériel si laparotomie ou saignement attendu", "Deux voies veineuses de bon calibre, sang compatible", "Analgésie : péridurale thoracique basse ou TAP/carré des lombes en laparotomie ; multimodale en cœlioscopie", "Remplissage guidé, normothermie, prophylaxie des NVPO")]),
          S("Postopératoire", [ul("Dysfonction vésicale (dénervation) : autosondages possibles", "Lymphocèle, lymphœdème des membres inférieurs", "Fistule urétérale ou vésicale", "Thromboprophylaxie prolongée 4 semaines")])
        ],
        refs: [REF_ERAS, REF_ABP]
      },
      {
        id: "vulvectomie", title: "Vulvectomie et chirurgie périnéale carcinologique", subtitle: "Vulvectomie ± curage inguinal, lambeaux de reconstruction",
        tags: ["Sujet âgé", "Position gynécologique", "Douleur"],
        sections: [
          S("Particularités", [ul("Patientes souvent âgées, comorbides", "Position gynécologique prolongée : complications neurologiques (nerf fibulaire commun, fémoral) et syndrome des loges — limiter la durée, protéger les appuis", "Curage inguinal bilatéral : lymphocèle, infection")]),
          S("Antibioprophylaxie", [kv(["Chirurgie vulvaire ou périnéale majeure", "Céfazoline 2 g IV (1 g si > 4 h)"], ["Allergie", "Clindamycine 900 mg IV"])]),
          S("Technique", [ul("AG ou rachianesthésie (± péridurale combinée si chirurgie longue)", "Analgésie : morphine intrathécale ou péridurale, infiltrations, paracétamol, AINS selon la fonction rénale")]),
          S("Postopératoire", [ul("Soins locaux, prévention des escarres, lever progressif", "Thromboprophylaxie prolongée", "Sonde urinaire selon la chirurgie")])
        ],
        refs: [REF_ABP]
      }
    ]
  });
})();
