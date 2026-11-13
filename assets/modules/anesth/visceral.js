/* Anesthésie en chirurgie viscérale */
(function () {
  const { S, ul, kv, warn, danger, info, tbl } = P17.h;
  const REF_ABP = "RFE SFAR-SPILF 2024 : Antibioprophylaxie en chirurgie et médecine interventionnelle (adulte)";
  const REF_RAAC = "Alfonsi P et al. Guidelines for enhanced recovery after elective colorectal surgery (SFAR-SFCD). ACCPM 2016";
  const REF_DOUL = "RFE SFAR : Réactualisation de la recommandation sur la douleur postopératoire (Aubrun F et al., ACCPM 2019)";
  const REF_PROSPECT = "Recommandations PROSPECT (ESRA) spécifiques à la procédure";
  const ABP_CEFOX = kv(["Molécule", "Céfoxitine 2 g IV dans les 60 min avant l'incision"], ["Réinjection", "1 g si durée > 2 h, puis toutes les 2 h"], ["Allergie", "Gentamicine 6–7 mg/kg + métronidazole 1 g IV"]);
  const ABP_CEFAZ = kv(["Molécule", "Céfazoline 2 g IV (alternative : céfuroxime 1,5 g)"], ["Réinjection", "1 g si durée > 4 h, puis toutes les 4 h"], ["Allergie", "Vancomycine 20 mg/kg ou teicoplanine 12 mg/kg IV"]);
  const LIDO = "Lidocaïne IV si pas d'ALR : 1,5 mg/kg (poids idéal) en bolus puis 1,5–2 mg/kg/h, arrêtée en fin d'intervention ou poursuivie ≤ 24 h sous surveillance scopée";

  window.P17_ANESTH = window.P17_ANESTH || [];
  window.P17_ANESTH.push({
    id: "visceral", title: "Anesthésie en chirurgie viscérale", short: "Chirurgie viscérale",
    desc: "Réhabilitation améliorée, chirurgie carcinologique majeure, urgences abdominales.",
    generalites: {
      subtitle: "Réhabilitation améliorée après chirurgie (RAAC) et principes communs",
      tags: ["RAAC", "Remplissage guidé", "Épargne morphinique", "NVPO"],
      sections: [
        S("Préopératoire (RAAC)", [
          ul("Information et adhésion du patient, arrêt du tabac et de l'alcool ≥ 4 semaines",
            "Dépistage et correction de la dénutrition (albumine, perte de poids) et de l'anémie (fer IV)",
            "Jeûne : solides jusqu'à 6 h, liquides clairs jusqu'à 2 h ; boisson glucidique la veille et 2 h avant (sauf diabétique déséquilibré)",
            "Pas de prémédication anxiolytique systématique (éviter les benzodiazépines de longue durée)",
            "Préparation colique selon le type de chirurgie (avec antibiotiques oraux en colorectal programmé)")
        ]),
        S("Peropératoire", [
          ul("Ventilation protectrice : Vt 6–8 mL/kg de poids idéal, PEP 5 cmH₂O, manœuvres de recrutement si besoin",
            "Remplissage guidé par objectifs chez les patients à risque (VES, variation de pression pulsée) ; éviter la surcharge (bilan ≤ +1,5 L) et l'hypovolémie",
            "Cristalloïdes balancés plutôt que NaCl 0,9 %",
            "Maintien de la PAM ≥ 65 mmHg et ≥ 80 % de la valeur de base (noradrénaline au besoin)",
            "Normothermie (réchauffement actif), contrôle glycémique",
            "Prophylaxie des NVPO multimodale, curarisation monitorée et antagonisée (TOF ≥ 0,9)")
        ]),
        S("Analgésie multimodale", [
          ul("Paracétamol + AINS (si pas de contre-indication) + dexaméthasone 8 mg à l'induction",
            "Laparotomie : péridurale thoracique ou blocs pariétaux (TAP, carré des lombes, gaine des droits) ou infiltration continue de la plaie",
            "Cœlioscopie : infiltration des orifices, TAP ; pas de péridurale",
            LIDO,
            "Kétamine 0,15–0,5 mg/kg puis 0,125–0,25 mg/kg/h si chirurgie majeure ou patient tolérant aux opioïdes")
        ]),
        S("Postopératoire (RAAC)", [
          ul("Ablation de la sonde gastrique en fin d'intervention, alimentation orale dès J0–J1",
            "Lever précoce J0–J1, retrait précoce de la sonde urinaire (J1)",
            "Prévention de l'iléus : épargne morphinique, mastication de gomme, éviter la surcharge hydrosodée",
            "Thromboprophylaxie HBPM ; prolongée 4 semaines après chirurgie carcinologique abdominopelvienne")
        ]),
        S("Antibioprophylaxie : vue d'ensemble", [
          tbl(["Chirurgie", "Molécule", "Réinjection"], [
            ["Colorectale programmée", "Tobramycine 200 mg + métronidazole 1 g per os la veille, puis céfoxitine 2 g IV", "1 g toutes les 2 h"],
            ["Œsophage, estomac (non bariatrique)", "Céfazoline 2 g IV", "1 g toutes les 4 h"],
            ["Intestin grêle, appendicectomie programmée", "Céfoxitine 2 g IV", "1 g toutes les 2 h"],
            ["Cholécystectomie à haut risque", "Céfazoline 2 g IV", "1 g toutes les 4 h"],
            ["Cholécystectomie à bas risque", "Aucune", "—"],
            ["Duodénopancréatectomie céphalique", "Céfoxitine 2 g IV (pipéracilline-tazobactam 4 g si drainage biliaire préalable)", "Selon la molécule"],
            ["Hépatectomie", "Céfazoline 2 g IV", "1 g toutes les 4 h"],
            ["Hernie avec prothèse", "Céfazoline 2 g IV", "1 g toutes les 4 h"],
            ["Proctologie", "Métronidazole 1 g IV dose unique", "—"]
          ], "Allergie : céfazoline → vancomycine 20 mg/kg ou teicoplanine 12 mg/kg ; céfoxitine → gentamicine 6–7 mg/kg + métronidazole 1 g IV.")
        ], { wide: true })
      ],
      refs: [REF_RAAC, REF_DOUL, REF_ABP, "Gustafsson UO et al. ERAS Society guidelines for elective colorectal surgery. World J Surg 2019"]
    },
    interventions: [
      {
        id: "colorectale", title: "Chirurgie colorectale", subtitle: "Colectomie, résection rectale, amputation abdominopérinéale (cœlioscopie ou laparotomie)",
        tags: ["RAAC", "Céfoxitine", "Épargne morphinique"],
        sections: [
          S("Particularités", [ul("Programme de RAAC complet : impact majeur sur la durée de séjour et les complications", "Cœlioscopie en Trendelenburg prolongé pour le rectum : pressions de ventilation, œdème facial", "Risque de fistule anastomotique : éviter hypotension et surcharge, PAM maintenue")]),
          S("Antibioprophylaxie", [ABP_CEFOX, info("Associée à la préparation orale la veille : tobramycine 200 mg + métronidazole 1 g per os (si préparation colique).")]),
          S("Technique", [ul("AG ± ALR ; intubation standard (séquence rapide si occlusion)", "Remplissage guidé par objectifs, cristalloïdes balancés", "Prophylaxie NVPO : dexaméthasone 8 mg à l'induction + ondansétron 4 mg en fin d'intervention ; TIVA si score d'Apfel ≥ 3")]),
          S("Analgésie", [ul("Cœlioscopie : paracétamol, AINS, dexaméthasone, TAP ou infiltration ; lidocaïne IV possible", "Laparotomie : péridurale thoracique basse (T9–T11) 48–72 h ou blocs pariétaux continus", "Amputation abdominopérinéale : douleur périnéale importante — infiltration, morphine en PCA")]),
          S("Postopératoire", [ul("Boissons à J0, alimentation à J1, lever J0–J1", "Sonde urinaire retirée à J1 (J3 si rectum bas)", "Thromboprophylaxie prolongée 4 semaines si cancer", "Surveillance de la fistule : fièvre, CRP à J3–J4, douleur, iléus prolongé")])
        ],
        refs: [REF_RAAC, REF_ABP, REF_PROSPECT]
      },
      {
        id: "oesophagectomie", title: "Œsophagectomie", subtitle: "Intervention de Lewis-Santy, œsophagectomie transhiatale ou à trois voies",
        tags: ["Ventilation unipulmonaire", "Péridurale thoracique", "Restriction hydrique"],
        sections: [
          S("Particularités", [ul("Chirurgie majeure, morbidité respiratoire élevée (pneumopathie 20–30 %)", "Temps abdominal (laparotomie ou cœlioscopie) puis thoracique droit en décubitus latéral gauche avec ventilation unipulmonaire", "Patients souvent dénutris, tabagiques, alcooliques, après radiochimiothérapie")]),
          S("Préopératoire", [ul("Préhabilitation : nutrition (immunonutrition 5–7 j), kinésithérapie respiratoire, sevrage tabagique", "EFR et gaz du sang ; évaluation cardiaque selon la capacité fonctionnelle", "Risque d'inhalation : achalasie, sténose — séquence rapide, aspiration")]),
          S("Antibioprophylaxie", [ABP_CEFAZ]),
          S("Technique", [ul("Sonde double lumière gauche (ou bloqueur bronchique) contrôlée au fibroscope", "Cathéter artériel, voie veineuse centrale (jugulaire gauche, l'anastomose cervicale étant souvent à gauche : en discuter avec le chirurgien)", "Ventilation unipulmonaire protectrice (voir chirurgie thoracique)", "Remplissage restrictif guidé par objectifs, noradrénaline pour maintenir la PAM (perfusion du transplant gastrique)", "Péridurale thoracique (T6–T8) posée avant l'induction")]),
          S("Points critiques", [warn("L'hypotension et la surcharge hydrique compromettent la vascularisation de la plastie gastrique : objectif PAM ≥ 70 mmHg, bilan hydrique proche de zéro."), ul("Hypoxémie en unipulmonaire, lésion trachéobronchique, lésion du nerf récurrent", "Arythmies (FA) à la manipulation médiastinale")]),
          S("Postopératoire", [ul("Extubation en salle si possible, surveillance en réanimation ou unité de soins continus", "Position demi-assise, pas de sonde gastrique en aveugle (ne pas la remobiliser)", "Kinésithérapie, analgésie péridurale 3–5 jours", "Alimentation entérale précoce par jéjunostomie", "Complications : fistule anastomotique, chylothorax, FA, pneumopathie d'inhalation")])
        ],
        refs: ["Low DE et al. ERAS Society guidelines for perioperative care in esophagectomy. World J Surg 2019", REF_ABP]
      },
      {
        id: "gastrectomie", title: "Gastrectomie", subtitle: "Gastrectomie totale ou partielle carcinologique",
        tags: ["Laparotomie sus-mésocolique", "Nutrition", "Péridurale"],
        sections: [
          S("Particularités", [ul("Laparotomie sus-ombilicale ou cœlioscopie ; risque respiratoire postopératoire (incision haute)", "Dénutrition fréquente, anémie (saignement tumoral)", "Estomac plein si sténose antropylorique : séquence rapide après aspiration gastrique")]),
          S("Antibioprophylaxie", [ABP_CEFAZ]),
          S("Technique et analgésie", [ul("AG + péridurale thoracique (T6–T8) ou blocs pariétaux (gaine des droits, TAP sous-costal) en laparotomie", "Cœlioscopie : infiltration, TAP, lidocaïne IV", "Remplissage guidé par objectifs, normothermie, prophylaxie des NVPO")]),
          S("Postopératoire", [ul("Alimentation orale progressive selon le chirurgien, jéjunostomie possible", "Supplémentation (vitamine B12 à vie après gastrectomie totale)", "Complications : fistule du moignon duodénal ou de l'anastomose, pancréatite, pneumopathie")])
        ],
        refs: ["Mortensen K et al. ERAS Society guidelines for gastrectomy. Br J Surg 2014", REF_ABP]
      },
      {
        id: "dpc", title: "Duodénopancréatectomie céphalique", subtitle: "Intervention de Whipple et pancréatectomies",
        tags: ["Chirurgie longue", "Ictère", "Fistule pancréatique"],
        sections: [
          S("Particularités", [ul("Durée 5–8 h, saignement potentiellement important (contact veine porte et mésentérique)", "Ictère obstructif : troubles de l'hémostase (vitamine K 10 mg IV), insuffisance rénale (éviter AINS, aminosides, produits de contraste rapprochés)", "Diabète fréquent (pancréatique), dénutrition")]),
          S("Antibioprophylaxie", [kv(["Sans drainage biliaire préalable", "Céfoxitine 2 g IV, 1 g si > 2 h puis /2 h"], ["Prothèse biliaire, sphinctérotomie, ampullome", "Pipéracilline-tazobactam 4 g IV, renouvelé après 4 h"], ["Pancréatectomie gauche ou totale", "Céfazoline 2 g IV"]), info("Adapter à l'écologie de la bile si un prélèvement biliaire est disponible (prothèse colonisée).")]),
          S("Technique", [ul("Cathéter artériel, VVC ou deux voies périphériques de bon calibre", "Péridurale thoracique (T7–T9) si hémostase normale, sinon blocs pariétaux continus + lidocaïne IV", "Remplissage guidé par objectifs, contrôle glycémique (objectif 1–1,8 g/L)", "Acide tranexamique à discuter selon le risque hémorragique")]),
          S("Points critiques", [warn("Une hypotension sous péridurale doit être corrigée par vasopresseur plutôt que par remplissage excessif (œdème anastomotique)."), ul("Clampage ou lésion vasculaire (veine porte) : saignement brutal — produits sanguins disponibles")]),
          S("Postopératoire", [ul("Surveillance en soins continus, dosage des amylases/lipases dans les drains", "Fistule pancréatique, hémorragie secondaire (« sentinel bleed »), gastroparésie", "Insuline selon protocole, extraits pancréatiques à la reprise alimentaire")])
        ],
        refs: ["Melloul E et al. ERAS Society guidelines for pancreatoduodenectomy. World J Surg 2020", REF_ABP]
      },
      {
        id: "hepatectomie", title: "Hépatectomie", subtitle: "Résections hépatiques majeures et mineures",
        tags: ["PVC basse", "Pringle", "Insuffisance hépatique"],
        sections: [
          S("Particularités", [ul("Évaluer le foie restant (volumétrie, cirrhose, chimiothérapie préalable)", "Saignement lors de la transsection : stratégie de pression veineuse centrale basse", "Clampage pédiculaire (manœuvre de Pringle) : à-coups hémodynamiques, ischémie-reperfusion")]),
          S("Antibioprophylaxie", [ABP_CEFAZ]),
          S("Stratégie de PVC basse", [ul("Restriction des apports avant et pendant la transsection (PVC < 5 cmH₂O)", "Position en léger Trendelenburg inversé (risque d'embolie gazeuse : éviter la PVC négative), PEP minimale", "Noradrénaline pour maintenir la PAM", "Restitution volémique après l'hémostase de la tranche"), warn("Embolie gazeuse possible par les veines sus-hépatiques : chute brutale de l'EtCO₂ — FiO₂ 100 %, Trendelenburg, compression du site.")]),
          S("Analgésie", [ul("Péridurale thoracique controversée : coagulopathie postopératoire fréquente (pic INR J2–J3) ; à réserver aux résections mineures sur foie sain", "Alternatives : morphine intrathécale (100–200 µg), cathéter d'infiltration pariétale, blocs pariétaux continus", "Paracétamol à dose réduite (3 g/24 h max) après hépatectomie majeure ; éviter les AINS si cirrhose")]),
          S("Postopératoire", [ul("Surveillance : lactate, bilirubine, TP/facteur V, glycémie, phosphorémie (supplémenter)", "Insuffisance hépatique post-hépatectomie (critères 50-50 à J5 : TP < 50 % et bilirubine > 50 µmol/L)", "Fistule biliaire, ascite, hémorragie")])
        ],
        refs: ["HAS : Prise en charge péri-opératoire du patient adulte lors d'une résection hépatique", "Joliat GR et al. ERAS Society guidelines for liver surgery. World J Surg 2023", REF_ABP]
      },
      {
        id: "cholecystectomie", title: "Cholécystectomie par cœlioscopie", subtitle: "Programmée ou pour cholécystite aiguë",
        tags: ["Cœlioscopie", "Ambulatoire", "NVPO"],
        sections: [
          S("Particularités", [ul("Pneumopéritoine (10–12 mmHg) et proclive : baisse du retour veineux, hypercapnie", "Éligible à l'ambulatoire si programmée", "Cholécystite aiguë : antibiothérapie curative en cours, estomac plein possible")]),
          S("Antibioprophylaxie", [kv(["Patient à bas risque", "Aucune antibioprophylaxie"], ["Haut risque (cholécystite, âge > 70 ans, obésité, diabète, conversion, ictère, cholangiographie, grossesse…)", "Céfazoline 2 g IV (1 g si > 4 h)"], ["Allergie", "Vancomycine 20 mg/kg ou teicoplanine 12 mg/kg"])]),
          S("Technique", [ul("AG avec intubation (ou masque laryngé de 2e génération chez un patient sélectionné)", "Curarisation adaptée au pneumopéritoine, antagonisée en fin d'intervention", "Ventilation : adapter la ventilation minute à l'EtCO₂")]),
          S("Analgésie et NVPO", [ul("Paracétamol + AINS + dexaméthasone 8 mg ; infiltration des orifices (ropivacaïne)", "Douleur scapulaire : exsufflation complète du CO₂ en fin d'intervention", "Risque élevé de NVPO : double prophylaxie (dexaméthasone + ondansétron), TIVA si Apfel ≥ 3")]),
          S("Sortie", [ul("Ambulatoire : critères PADSS, analgésie orale prescrite, appel du lendemain", "Signes d'alerte : fièvre, ictère, douleur intense (fuite biliaire)")])
        ],
        refs: ["Barazanchi AWH et al. PROSPECT : laparoscopic cholecystectomy. Br J Anaesth 2018", REF_ABP]
      },
      {
        id: "urgences-abdominales", title: "Urgences abdominales : péritonite et occlusion", subtitle: "Laparotomie ou cœlioscopie en urgence",
        tags: ["Estomac plein", "Sepsis", "Choc septique"],
        sections: [
          S("Avant le bloc", [ul("Antibiothérapie probabiliste dès le diagnostic (dans l'heure si choc septique) : voir Antibiothérapie > Infections intra-abdominales", "Hémocultures, prélèvements peropératoires systématiques", "Correction de l'hypovolémie, noradrénaline si PAM < 65 mmHg malgré le remplissage", "Occlusion : sonde gastrique en aspiration avant l'induction, ionogramme (hypokaliémie, insuffisance rénale)")]),
          S("Induction", [ul("Séquence rapide : kétamine 1–2 mg/kg ou étomidate 0,3 mg/kg (propofol à dose réduite si stable)", "Rocuronium 1,2 mg/kg ou succinylcholine 1 mg/kg (attention à l'hyperkaliémie)", "Noradrénaline prête, cathéter artériel si choc", "Protoxyde d'azote contre-indiqué (distension intestinale)")]),
          S("Peropératoire", [ul("Remplissage guidé par objectifs, cristalloïdes balancés", "Lactate et gaz du sang répétés", "Corticoïdes (hydrocortisone 200 mg/24 h) si choc septique nécessitant ≥ 0,25 µg/kg/min de noradrénaline", "Péridurale contre-indiquée si sepsis sévère ou troubles de l'hémostase")]),
          S("Postopératoire", [ul("Réanimation si choc, défaillance d'organes ou chirurgie de damage control", "Réévaluation de l'antibiothérapie à 48–72 h selon les prélèvements", "Durée : voir Antibiothérapie > Durées (souvent 4–8 jours si contrôle de la source)", "Syndrome du compartiment abdominal : pression vésicale si laparotomie difficile à fermer")])
        ],
        refs: ["RFE SFAR-SPILF 2014 : Prise en charge des infections intra-abdominales", "HAS 2025 : Prise en charge du sepsis de l'adulte (SRLF)"]
      },
      {
        id: "paroi", title: "Chirurgie de paroi : hernies et éventrations", subtitle: "Cure de hernie inguinale, ombilicale, éventration",
        tags: ["Ambulatoire", "Blocs pariétaux", "Prothèse"],
        sections: [
          S("Hernie inguinale", [ul("AG, rachianesthésie (dose réduite, risque de rétention urinaire) ou anesthésie locale (cure ouverte)", "Analgésie : bloc ilio-inguinal/ilio-hypogastrique ou TAP, infiltration, paracétamol, AINS", "Ambulatoire de principe")]),
          S("Éventration volumineuse", [ul("Réintégration de viscères : hausse de la pression intra-abdominale et des pressions de ventilation, compression cave", "Préparation possible : toxine botulique dans les muscles larges, pneumopéritoine progressif", "Analgésie : péridurale thoracique ou blocs pariétaux continus (TAP, carré des lombes)", "Surveillance postopératoire de la pression vésicale si fermeture sous tension")]),
          S("Antibioprophylaxie", [kv(["Avec prothèse", "Céfazoline 2 g IV (1 g si > 4 h)"], ["Sans prothèse", "Aucune"], ["Allergie", "Vancomycine 20 mg/kg ou teicoplanine 12 mg/kg"])]),
          S("Postopératoire", [ul("Rétention urinaire : échographie vésicale avant la sortie", "Ceinture abdominale selon le chirurgien", "Thromboprophylaxie selon le risque individuel")])
        ],
        refs: [REF_ABP, REF_PROSPECT]
      }
    ]
  });
})();
