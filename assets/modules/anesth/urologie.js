/* Anesthésie en urologie */
(function () {
  const { S, ul, kv, warn, danger, info, tbl } = P17.h;
  const REF_ABP = "RFE SFAR-SPILF 2024 : Antibioprophylaxie en chirurgie et médecine interventionnelle (adulte)";
  const REF_AFU = "Recommandations du CIAFU (Association française d'urologie) sur les infections urinaires et l'endo-urologie";
  const ECBU = info("ECBU préopératoire stérile obligatoire avant tout geste endo-urologique ; s'il est positif, traiter l'infection avant l'intervention (antibiothérapie adaptée débutée 48 h avant au minimum).");

  window.P17_ANESTH = window.P17_ANESTH || [];
  window.P17_ANESTH.push({
    id: "urologie", title: "Anesthésie en urologie", short: "Urologie",
    desc: "Endo-urologie, chirurgie robot-assistée en Trendelenburg, chirurgie rénale et surrénalienne, transplantation rénale.",
    generalites: {
      subtitle: "Sujet âgé, endo-urologie, positions extrêmes et chirurgie carcinologique",
      tags: ["ECBU stérile", "Rachianesthésie", "Trendelenburg", "Position"],
      sections: [
        S("Particularités", [
          ul("Population souvent âgée : cardiopathie, insuffisance rénale, antithrombotiques",
            "Endo-urologie : bactériémie et sepsis d'origine urinaire, irrigation (absorption, hypothermie)",
            "Positions : gynécologique (lithotomie), lombotomie, décubitus ventral, Trendelenburg forcé")
        ]),
        S("Antibioprophylaxie : vue d'ensemble", [
          tbl(["Intervention", "Antibioprophylaxie"], [
            ["RTUP, adénomectomie, chirurgie laser de la prostate", "Céfazoline 2 g IV (1 g si > 4 h)"],
            ["Urétéroscopie, NLPC, sonde JJ, néphrostomie, chirurgie urétrale", "Céfazoline 2 g IV"],
            ["Cystectomie", "Céfoxitine 2 g IV (1 g si > 2 h)"],
            ["Prothèse pénienne ou testiculaire", "Céfazoline 2 g IV"],
            ["Cure de prolapsus", "Céfazoline 2 g IV"],
            ["Transplantation rénale", "Céfazoline 2 g IV"],
            ["Prostatectomie totale, néphrectomie, surrénalectomie, cystoscopie, RTUV, lithotripsie extracorporelle", "Aucune"],
            ["Biopsie prostatique transrectale", "Fosfomycine-trométamol 3 g per os 2–4 h avant (transpérinéale : aucune)"]
          ], "Allergie : gentamicine 6–7 mg/kg IV (+ métronidazole 1 g si la céfoxitine était indiquée ; + clindamycine 900 mg pour les prothèses)."),
          ECBU
        ], { wide: true }),
        S("Rachianesthésie en endo-urologie", [
          ul("Bupivacaïne hyperbare 7,5–10 mg ± sufentanil 2,5–5 µg (niveau T10 pour vessie et prostate)",
            "Permet de dépister précocement le syndrome de résection et la perforation vésicale (patient conscient)",
            "Vérifier les délais d'arrêt des anticoagulants et des antiagrégants (P2Y12)")
        ]),
        S("Trendelenburg forcé (robot)", [
          ul("Inclinaison 25–45° pendant plusieurs heures : œdème facial, laryngé et cérébral, hausse de la PIO (risque de neuropathie optique), compression thoracique",
            "Contre-indications relatives : glaucome à angle fermé, HTIC, anévrisme cérébral, insuffisance respiratoire sévère",
            "Ventilation protectrice avec PEP, surveiller la pression motrice et l'EtCO₂",
            "Restriction hydrique peropératoire jusqu'à l'anastomose (limiter la diurèse dans le champ), puis compensation",
            "Test de fuite au ballonnet avant l'extubation si œdème facial important")
        ]),
        S("Lombotomie et décubitus latéral", [
          ul("Billot sous le flanc : compression cave, hypotension ; libérer le billot avant la fermeture",
            "Risque de pneumothorax (incision haute, résection costale)",
            "Protection du plexus brachial, de l'œil et de l'oreille déclives")
        ])
      ],
      refs: [REF_ABP, REF_AFU]
    },
    interventions: [
      {
        id: "rtup", title: "Résection transurétrale de prostate (RTUP)", subtitle: "Résection monopolaire ou bipolaire, énucléation laser",
        tags: ["Syndrome de résection", "Rachianesthésie", "Saignement"],
        sections: [
          S("Technique", [ul("Rachianesthésie de choix (niveau T10) ou AG", "Antiagrégants : aspirine souvent poursuivie ; P2Y12 arrêtés selon l'urologue", "Irrigation réchauffée, prévention de l'hypothermie")]),
          S("Antibioprophylaxie", [kv(["Molécule", "Céfazoline 2 g IV (céfuroxime 1,5 g)"], ["Allergie", "Gentamicine 6–7 mg/kg IV"]), ECBU]),
          S("Syndrome de résection", [danger("Absorption du liquide d'irrigation hypotonique (glycocolle) : hyponatrémie, surcharge, troubles visuels, confusion, convulsions, bradycardie."), ul("Facteurs de risque : résection monopolaire, durée > 60 min, hauteur de la poche > 60 cm, perforation capsulaire", "Prévention : résection bipolaire au sérum physiologique, durée limitée", "Conduite : arrêt de l'intervention, natrémie, furosémide si surcharge, NaCl hypertonique si hyponatrémie symptomatique (correction ≤ 10 mmol/L/24 h)")]),
          S("Autres complications", [ul("Perforation vésicale ou capsulaire : douleur abdominale ou scapulaire sous rachianesthésie, distension abdominale", "Saignement : lavage vésical continu, transfusion rare", "Bactériémie : frissons, fièvre, hypotension en SSPI — hémocultures, antibiothérapie")]),
          S("Postopératoire", [ul("Lavage vésical continu, surveiller la couleur et les caillots", "Natrémie en SSPI si résection longue ou monopolaire")])
        ],
        refs: [REF_ABP, REF_AFU]
      },
      {
        id: "rtuv", title: "Résection transurétrale de vessie (RTUV)", subtitle: "Tumeurs vésicales",
        tags: ["Réflexe obturateur", "Perforation"],
        sections: [
          S("Particularités", [ul("Patients fumeurs (BPCO, coronaropathie)", "Tumeur de la paroi latérale : stimulation du nerf obturateur par le courant → adduction brutale de la cuisse, risque de perforation vésicale")]),
          S("Technique", [ul("Rachianesthésie ou AG", "Tumeur latérale : AG avec curarisation, ou bloc du nerf obturateur échoguidé associé à la rachianesthésie", "Résection bipolaire")]),
          S("Antibioprophylaxie", [kv(["RTUV", "Aucune antibioprophylaxie"]), ECBU]),
          S("Postopératoire", [ul("Instillation endovésicale de chimiothérapie possible en SSPI (mitomycine) : précautions cytotoxiques", "Perforation : douleur, distension, défaut de récupération du liquide")])
        ],
        refs: [REF_ABP]
      },
      {
        id: "prostatectomie", title: "Prostatectomie radicale robot-assistée", subtitle: "Cancer de prostate localisé",
        tags: ["Trendelenburg forcé", "Restriction hydrique", "RAAC"],
        sections: [
          S("Préopératoire", [ul("Rechercher un glaucome à angle fermé, des antécédents neurovasculaires, une insuffisance respiratoire", "Ambulatoire ou séjour court possible")]),
          S("Antibioprophylaxie", [kv(["Prostatectomie totale", "Aucune antibioprophylaxie (RFE 2024)"])]),
          S("Technique", [ul("AG avec intubation, curarisation profonde utile (pneumopéritoine, immobilité stricte pendant le robot)", "Deux voies veineuses longues (bras le long du corps, inaccessibles), cathéter artériel selon le terrain", "Trendelenburg forcé : voir généralités ; protection oculaire, installation rigoureuse", "Restriction hydrique jusqu'à l'anastomose urétro-vésicale (≈ 1–2 mL/kg/h), puis compensation")]),
          S("Analgésie", [ul("Paracétamol, AINS, dexaméthasone, infiltration des orifices", "TAP ou morphine intrathécale à faible dose selon l'équipe", "Douleur souvent modérée")]),
          S("Postopératoire", [ul("Œdème facial et conjonctival transitoire ; vérifier la vision", "Rhabdomyolyse si durée très longue (obèse) : CPK", "Lever et alimentation J0, sonde urinaire 5–10 jours")])
        ],
        refs: ["Lemoine A et al. PROSPECT : radical prostatectomy. Eur J Anaesthesiol 2021", REF_ABP]
      },
      {
        id: "cystectomie", title: "Cystectomie totale", subtitle: "Avec dérivation urinaire (Bricker, néovessie)",
        tags: ["Chirurgie majeure", "Céfoxitine", "RAAC"],
        sections: [
          S("Préopératoire", [ul("Patients âgés, fumeurs, souvent dénutris, insuffisance rénale (obstruction urétérale)", "Préhabilitation, immunonutrition, correction de l'anémie", "Pas de préparation colique mécanique (RAAC)")]),
          S("Antibioprophylaxie", [kv(["Molécule", "Céfoxitine 2 g IV, 1 g si > 2 h puis /2 h"], ["Allergie", "Gentamicine 6–7 mg/kg + métronidazole 1 g IV"]), ECBU]),
          S("Technique", [ul("AG + péridurale thoracique (T10–T11) ou blocs pariétaux ± morphine intrathécale", "Cathéter artériel, deux voies veineuses de bon calibre ; voie centrale selon le terrain", "Remplissage guidé par objectifs ; mesure de la diurèse impossible après section urétérale", "Saignement 500–1500 mL (plexus de Santorini) : sang disponible, acide tranexamique selon l'équipe")]),
          S("Postopératoire", [ul("Programme RAAC (alimentation J1, lever J1, ablation précoce de la sonde gastrique)", "Iléus fréquent : épargne morphinique, chewing-gum", "Acidose hyperchlorémique (néovessie iléale)", "Thromboprophylaxie prolongée 4 semaines")])
        ],
        refs: ["Cerantola Y et al. ERAS Society guidelines for radical cystectomy. Clin Nutr 2013", REF_ABP]
      },
      {
        id: "nephrectomie", title: "Néphrectomie totale et partielle", subtitle: "Lombotomie, laparotomie, cœlioscopie ou robot",
        tags: ["Clampage", "Thrombus cave", "Pneumothorax"],
        sections: [
          S("Particularités", [ul("Néphrectomie partielle : clampage de l'artère rénale (ischémie chaude < 25 min), risque hémorragique au déclampage", "Cancer avec thrombus de la veine rénale ou cave : risque d'embolie tumorale et de saignement majeur — ETO, circulation extracorporelle à discuter si thrombus atrial", "Évaluer la fonction rénale résiduelle (rein unique, néphrectomie élargie)")]),
          S("Antibioprophylaxie", [kv(["Néphrectomie, surrénalectomie", "Aucune antibioprophylaxie"])]),
          S("Technique", [ul("AG ; cathéter artériel si laparotomie, thrombus ou rein unique", "Deux voies veineuses de gros calibre, sang compatible disponible", "Néphroprotection : normovolémie, PAM ≥ 65–70 mmHg, pas de néphrotoxiques ; le mannitol n'a pas montré de bénéfice", "Lombotomie : billot (hypotension), pneumothorax si incision costale")]),
          S("Analgésie", [ul("Lombotomie : péridurale thoracique, paravertébral, ESP ou carré des lombes", "Cœlioscopie : TAP, infiltration, paracétamol ; éviter les AINS si rein unique ou fonction altérée", "Morphine en PCA (prudence si DFG < 30)")]),
          S("Postopératoire", [ul("Créatininémie et diurèse, kaliémie", "Saignement de la tranche de néphrectomie partielle (J0–J10) : hématurie, chute d'Hb", "Fistule urinaire après néphrectomie partielle")])
        ],
        refs: [REF_ABP, "Recommandations PROSPECT (ESRA) spécifiques à la procédure"]
      },
      {
        id: "nlpc", title: "Néphrolithotomie percutanée (NLPC)", subtitle: "Calculs rénaux volumineux ou coralliformes",
        tags: ["Décubitus ventral", "Sepsis", "Hydrothorax"],
        sections: [
          S("Installation", [ul("Décubitus ventral (ou dorsal modifié) : têtière, yeux, appuis, abdomen libre", "Intubation, installation en position lithotomique pour la montée de sonde puis retournement")]),
          S("Antibioprophylaxie", [kv(["Molécule", "Céfazoline 2 g IV (1 g si > 4 h)"], ["Allergie", "Gentamicine 6–7 mg/kg IV"]), ECBU, warn("Calcul infecté : antibiothérapie adaptée à l'ECBU débutée avant l'intervention.")]),
          S("Complications peropératoires", [ul("Sepsis et choc septique (urines infectées, pression d'irrigation) : frissons, hypotension, hyperthermie — hémocultures, antibiothérapie probabiliste d'IU grave, remplissage, noradrénaline", "Hydrothorax ou pneumothorax (ponction sus-costale) : désaturation, hausse des pressions", "Saignement (lésion vasculaire rénale) : embolisation", "Absorption du liquide d'irrigation, hypothermie (irrigation réchauffée au sérum physiologique)")]),
          S("Analgésie", [ul("Paravertébral, ESP ou bloc du carré des lombes", "Paracétamol, néfopam ; AINS selon la fonction rénale")]),
          S("Postopératoire", [ul("Néphrostomie : surveiller la diurèse et l'hématurie", "Radiographie de thorax si accès sus-costal", "Fièvre : hémocultures, rechercher un obstacle")])
        ],
        refs: [REF_ABP, REF_AFU]
      },
      {
        id: "ureteroscopie", title: "Urétéroscopie souple et rigide", subtitle: "Lithiase urinaire, tumeurs de la voie excrétrice",
        tags: ["Ambulatoire", "Pression d'irrigation", "Sepsis"],
        sections: [
          S("Technique", [ul("AG (masque laryngé ou intubation) ou rachianesthésie", "Apnée ou faibles volumes demandés lors de la fragmentation laser (mobilité rénale respiratoire)", "Ambulatoire souvent possible")]),
          S("Antibioprophylaxie", [kv(["Molécule", "Céfazoline 2 g IV (1 g si > 4 h)"], ["Allergie", "Gentamicine 6–7 mg/kg IV"]), ECBU]),
          S("Complications", [ul("Sepsis postopératoire (pression intrarénale élevée, durée > 90 min) : surveillance de la température et de l'hémodynamique en SSPI", "Perforation urétérale (rare)", "Douleur de colique sur sonde JJ : AINS si fonction rénale correcte, alphabloquant")])
        ],
        refs: [REF_ABP, REF_AFU]
      },
      {
        id: "surrenalectomie", title: "Surrénalectomie et phéochromocytome", subtitle: "Phéochromocytome, syndrome de Cushing, hyperaldostéronisme primaire",
        tags: ["Alphabloquants", "Pics hypertensifs", "Hypotension post-exérèse"],
        sections: [
          S("Préparation du phéochromocytome", [ul("Alphabloquant 10–14 jours avant (doxazosine ou prazosine progressivement croissante) ; inhibiteur calcique en complément ou en alternative", "Bêtabloquant uniquement après l'alpha-blocage si tachycardie (jamais en premier)", "Régime normo- ou hypersodé et hydratation pour corriger l'hypovolémie", "Objectifs : PA < 130/80 assis, hypotension orthostatique modérée, FC 60–70/min", "Échocardiographie (cardiomyopathie catécholaminergique), glycémie")]),
          S("Peropératoire (phéochromocytome)", [ul("Cathéter artériel posé avant l'induction, voie veineuse centrale", "Induction profonde, éviter les médicaments histamino-libérateurs et le dropéridol", "Pics hypertensifs (induction, pneumopéritoine, manipulation tumorale) : nicardipine, urapidil, nitroprussiate ; esmolol si tachycardie ; sulfate de magnésium possible", "Après ligature de la veine surrénale : chute brutale de la PA — remplissage, noradrénaline", "Hypoglycémie après exérèse (rebond insulinique) : glycémie horaire pendant 24 h")]),
          S("Cushing et hyperaldostéronisme", [ul("Cushing : HTA, diabète, obésité, fragilité cutanée et osseuse ; hydrocortisone en peropératoire et postopératoire (insuffisance surrénale après exérèse)", "Hyperaldostéronisme (Conn) : correction de l'hypokaliémie avant l'intervention, contrôle tensionnel")]),
          S("Antibioprophylaxie", [kv(["Surrénalectomie", "Aucune antibioprophylaxie"])]),
          S("Postopératoire", [ul("Surveillance en soins continus 24 h (phéochromocytome) : PA, glycémie", "Insuffisance surrénale (exérèse bilatérale, Cushing) : substitution par hydrocortisone", "Hyperkaliémie transitoire après Conn")])
        ],
        refs: ["Lenders JWM et al. Pheochromocytoma and paraganglioma : an Endocrine Society clinical practice guideline. J Clin Endocrinol Metab 2014", REF_ABP]
      }
    ]
  });
})();
