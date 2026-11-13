/* Anesthésie en chirurgie thoracique */
(function () {
  const { S, ul, ol, kv, warn, danger, info, tbl } = P17.h;
  const REF_ABP = "RFE SFAR-SPILF 2024 : Antibioprophylaxie en chirurgie et médecine interventionnelle (adulte)";
  const REF_ERAS = "Batchelor TJP et al. ERAS Society and ESTS guidelines for enhanced recovery after lung surgery. Eur J Cardiothorac Surg 2019";
  const REF_PROSPECT = "Feray S et al. PROSPECT : video-assisted thoracoscopic surgery. Anaesthesia 2022";
  const ABP_POUMON = kv(["Molécule", "Amoxicilline-acide clavulanique 2 g IV, ou céfazoline 2 g, ou céfuroxime 1,5 g"], ["Réinjection", "Amoxicilline-clavulanate 1 g ou céfuroxime 0,75 g si > 2 h puis /2 h ; céfazoline 1 g si > 4 h puis /4 h"], ["Remarque", "Préférer l'amoxicilline-clavulanate chez le BPCO ou si l'incidence locale des pneumopathies est élevée (jusqu'à 48 h)"], ["Allergie", "Vancomycine 20 mg/kg ou teicoplanine 12 mg/kg IV"]);
  const ABP_CEFAZ = kv(["Molécule", "Céfazoline 2 g IV (alternative : céfuroxime 1,5 g)"], ["Réinjection", "1 g si > 4 h, puis toutes les 4 h"], ["Allergie", "Vancomycine 20 mg/kg ou teicoplanine 12 mg/kg IV"]);

  window.P17_ANESTH = window.P17_ANESTH || [];
  window.P17_ANESTH.push({
    id: "thoracique", title: "Anesthésie en chirurgie thoracique", short: "Chirurgie thoracique",
    desc: "Ventilation unipulmonaire, évaluation du risque respiratoire, analgésie de la paroi thoracique.",
    generalites: {
      subtitle: "Évaluation préopératoire, ventilation unipulmonaire et analgésie",
      tags: ["Sonde double lumière", "Ventilation unipulmonaire", "Restriction hydrique", "ALR thoracique"],
      sections: [
        S("Évaluation du risque respiratoire", [
          ul("VEMS et DLCO postopératoires prédits (ppo) : risque faible si les deux > 60 % ; épreuve d'effort (VO₂ max) si l'un est < 60 %",
            "VO₂ max < 10 mL/kg/min : résection majeure à haut risque ; > 20 mL/kg/min : risque faible",
            "Test de montée d'escaliers ou navette (shuttle test) comme dépistage",
            "Évaluation cardiaque selon les recommandations de chirurgie non cardiaque ; sevrage tabagique, kinésithérapie (préhabilitation)")
        ]),
        S("Ventilation unipulmonaire", [
          kv(["Exclusion", "Sonde double lumière gauche de référence ; bloqueur bronchique si intubation difficile ou trachéotomie"],
            ["Contrôle", "Fibroscope après l'intubation, puis après la mise en décubitus latéral"],
            ["Ventilation", "Protectrice sur un seul poumon : petit volume courant, PEP, FiO₂ la plus basse possible"])
        ]),
        S("Remplissage", [
          ul("Stratégie restrictive guidée par objectifs : bilan positif < 1,5 L ou 20 mL/kg sur les 24 premières heures après pneumonectomie",
            "Hypotension : vasopresseur plutôt que remplissage excessif (œdème pulmonaire lésionnel)",
            "Cristalloïdes balancés")
        ]),
        S("Analgésie", [
          ul("Thoracotomie : bloc paravertébral continu ou péridurale thoracique", "Thoracoscopie : bloc paravertébral ou ESP en injection unique", "Toujours avec paracétamol, AINS si possible et dexaméthasone")
        ]),
        S("Antibioprophylaxie : vue d'ensemble", [
          tbl(["Intervention", "Antibioprophylaxie"], [
            ["Résection pulmonaire (lobectomie, segmentectomie, pneumonectomie)", "Amoxicilline-clavulanate 2 g, céfazoline 2 g ou céfuroxime 1,5 g IV"],
            ["Médiastin, plèvre, paroi thoracique (y compris par thoracoscopie)", "Céfazoline 2 g IV"],
            ["Chirurgie trachéale ou bronchique", "Céfazoline 2 g IV"],
            ["Médiastinoscopie, thoracoscopie diagnostique, drain thoracique, trachéotomie percutanée, bronchoscopie", "Aucune"]
          ], "Allergie aux bêta-lactamines : vancomycine 20 mg/kg ou teicoplanine 12 mg/kg IV.")
        ], { wide: true })
      ],
      refs: [REF_ERAS, REF_PROSPECT, REF_ABP, "Brunelli A et al. Physiologic evaluation of the patient with lung cancer being considered for resectional surgery (ACCP). Chest 2013"]
    },
    interventions: [
      {
        id: "resection-pulmonaire", title: "Lobectomie et segmentectomie", subtitle: "Par thoracoscopie (VATS), robot ou thoracotomie",
        tags: ["Ventilation unipulmonaire", "Décubitus latéral", "RAAC"],
        sections: [
          S("Préopératoire", [ul("Évaluation fonctionnelle (VEMS ppo, DLCO ppo, VO₂ max si besoin)", "Préhabilitation, sevrage tabagique, kinésithérapie", "Bilan d'extension et de comorbidités (cardiopathie ischémique, BPCO)")]),
          S("Antibioprophylaxie", [ABP_POUMON]),
          S("Technique", [ul("Sonde double lumière gauche contrôlée au fibroscope", "Cathéter artériel (radiale du côté déclive de préférence) ; voie centrale non systématique en VATS", "Décubitus latéral : billot, protection du plexus brachial et des points d'appui, coussin axillaire", "Ventilation unipulmonaire protectrice, remplissage restrictif")]),
          S("Analgésie", [ul("VATS : bloc paravertébral ou ESP en injection unique + paracétamol, AINS, dexaméthasone", "Thoracotomie : paravertébral continu ou péridurale thoracique 48–72 h", "Kétamine si douleur chronique préexistante")]),
          S("Points critiques", [ul("Hypoxémie en unipulmonaire : algorithme dans les généralités", "Saignement par plaie de l'artère pulmonaire : conversion en thoracotomie, sang disponible", "Fuite aérienne au test d'étanchéité (pression 20–25 cmH₂O) en fin de résection")]),
          S("Postopératoire", [ul("Extubation en salle, lever et kinésithérapie dès J0–J1", "Radiographie de thorax, drainage selon le chirurgien", "Fibrillation atriale (10–20 %) : contrôle de fréquence, kaliémie et magnésémie", "Thromboprophylaxie HBPM")])
        ],
        refs: [REF_ERAS, REF_PROSPECT, REF_ABP]
      },
      {
        id: "pneumonectomie", title: "Pneumonectomie", subtitle: "Exérèse d'un poumon entier, extra- ou intrapéricardique",
        tags: ["Œdème post-pneumonectomie", "Restriction hydrique", "Haut risque"],
        sections: [
          S("Particularités", [ul("Mortalité plus élevée (pneumonectomie droite surtout)", "Évaluation fonctionnelle complète obligatoire", "Voie veineuse centrale et cathéter artériel")]),
          S("Antibioprophylaxie", [ABP_POUMON]),
          S("Peropératoire", [ul("Clampage test de l'artère pulmonaire : surveiller la tolérance du VD (PA, PAPs si cathéter, ETO)", "Ventilation unipulmonaire très protectrice (Vt 4–5 mL/kg, Pplat < 25 cmH₂O), FiO₂ minimale", "Remplissage restrictif : bilan positif < 20 mL/kg sur 24 h ; noradrénaline si hypotension", "Test d'étanchéité du moignon bronchique")]),
          S("Points critiques", [danger("Œdème pulmonaire post-pneumonectomie (J1–J3) : SDRA du poumon restant, mortalité élevée — prévenir par la restriction hydrique et la ventilation protectrice."), ul("Hernie cardiaque (ouverture péricardique) : collapsus brutal aux changements de position — éviter de coucher le patient sur le côté opéré", "Drain thoracique non mis en aspiration (déplacement médiastinal), système de drainage équilibré selon le chirurgien")]),
          S("Postopératoire", [ul("Surveillance en soins continus ou réanimation", "Fibrillation atriale fréquente", "Fistule du moignon bronchique (J7–J15) : toux, expectoration abondante, niveau hydro-aérique — urgence", "Analgésie péridurale ou paravertébrale continue")])
        ],
        refs: [REF_ERAS, REF_ABP]
      },
      {
        id: "mediastin", title: "Médiastin : thymectomie et masses médiastinales", subtitle: "Thymome, myasthénie, masses du médiastin antérieur",
        tags: ["Myasthénie", "Collapsus à l'induction", "Curares"],
        sections: [
          S("Masse du médiastin antérieur : évaluation", [ul("Symptômes positionnels (orthopnée, toux couchée, syncope), syndrome cave supérieur", "Scanner : compression trachéobronchique (> 50 % = haut risque), compression vasculaire", "Échocardiographie : épanchement péricardique, compression des cavités droites ou de l'artère pulmonaire", "Privilégier une biopsie sous anesthésie locale si possible")]),
          S("Masse à haut risque : stratégie", [danger("Risque de collapsus cardiorespiratoire à l'induction par perte du tonus et de la ventilation spontanée."), ul("Induction en position demi-assise, maintien de la ventilation spontanée (sévoflurane ou kétamine titrée), éviter les curares jusqu'au contrôle des voies aériennes", "Bronchoscope rigide et chirurgien prêts, changement de position (latéral, ventral) comme manœuvre de sauvetage", "Syndrome cave supérieur : voies veineuses aux membres inférieurs", "Très haut risque : canules fémorales posées sous anesthésie locale et ECMO prête avant l'induction")]),
          S("Myasthénie : préparation", [ul("Poursuivre la pyridostigmine (dernière prise le matin) ; IgIV ou échanges plasmatiques préopératoires si forme sévère ou bulbaire", "Éviter les médicaments aggravants : aminosides, fluoroquinolones, magnésium IV, bêtabloquants à forte dose", "Facteurs de risque de ventilation prolongée : maladie > 6 ans, pyridostigmine > 750 mg/j, capacité vitale < 2,9 L, BPCO")]),
          S("Myasthénie : curares", [ul("Sensibilité accrue aux curares non dépolarisants : éviter si possible, sinon rocuronium à dose réduite (0,1–0,2 mg/kg) sous monitorage quantitatif", "Antagonisation par sugammadex (la néostigmine est moins fiable sous anticholinestérasiques)", "Résistance à la succinylcholine (dose 1,5–2 mg/kg si séquence rapide)", "Extubation uniquement si TOF ≥ 0,9 et force musculaire clinique satisfaisante")]),
          S("Antibioprophylaxie", [ABP_CEFAZ]),
          S("Postopératoire", [ul("Surveillance en soins continus : capacité vitale, déglutition, toux", "Crise myasthénique versus crise cholinergique : avis neurologique, IgIV ou échanges plasmatiques", "Sternotomie : analgésie par blocs parasternaux ou ESP")])
        ],
        refs: ["Erdös G, Tzanova I. Perioperative anaesthetic management of mediastinal mass in adults. Eur J Anaesthesiol 2009", REF_ABP]
      },
      {
        id: "plevre", title: "Chirurgie pleurale", subtitle: "Décortication, empyème, pneumothorax, talcage, bullectomie",
        tags: ["Pneumothorax", "Sepsis", "Saignement"],
        sections: [
          S("Pneumothorax et bullectomie", [ul("Pneumothorax non drainé : drain thoracique avant la ventilation en pression positive si possible", "Protoxyde d'azote contre-indiqué", "Ventilation à basses pressions (bulles d'emphysème, risque de pneumothorax controlatéral)", "Sujet jeune, douleur intense après pleurectomie ou abrasion : ALR thoracique")]),
          S("Empyème et décortication", [ul("Patient septique sous antibiothérapie curative ; état nutritionnel souvent altéré", "Saignement parfois important (décortication de la coque) : cathéter artériel, sang disponible", "Ventilation unipulmonaire ; fuite aérienne prolongée possible")]),
          S("Talcage", [ul("Réaction inflammatoire : fièvre, hypoxémie, rarement SDRA", "Douleur importante : analgésie multimodale ± ALR")]),
          S("Antibioprophylaxie", [ABP_CEFAZ, info("Thoracoscopie diagnostique ou pose de drain seule : pas d'antibioprophylaxie. Empyème : antibiothérapie curative en cours, à poursuivre.")]),
          S("Analgésie", [ul("Bloc paravertébral, ESP ou bloc du dentelé antérieur", "Paracétamol, AINS, morphine de secours")])
        ],
        refs: [REF_PROSPECT, REF_ABP]
      },
      {
        id: "trachee", title: "Chirurgie trachéale", subtitle: "Résection-anastomose, sténoses trachéales",
        tags: ["Voies aériennes partagées", "Jet ventilation", "Extubation"],
        sections: [
          S("Évaluation", [ul("Siège, longueur et diamètre de la sténose (scanner, endoscopie)", "Dyspnée de repos, stridor : sténose serrée (< 5 mm) — induction à très haut risque", "Plan des voies aériennes partagé avec le chirurgien")]),
          S("Induction", [ul("Ventilation spontanée préservée (sévoflurane ou propofol titré) jusqu'au contrôle des voies aériennes", "Bronchoscope rigide disponible pour dilater ou franchir la sténose", "Sondes de petit calibre, sondes armées stériles")]),
          S("Ventilation peropératoire", [ul("Ventilation à travers le champ : sonde stérile introduite dans la trachée distale par le chirurgien", "Ou jet ventilation à haute fréquence par cathéter", "Anesthésie intraveineuse totale (les halogénés ne sont pas délivrés de façon fiable)")]),
          S("Antibioprophylaxie", [ABP_CEFAZ]),
          S("Fin d'intervention", [warn("Point de Grillo : flexion cervicale maintenue 7 jours pour protéger l'anastomose."), ul("Extubation précoce en salle souhaitée (éviter la pression du ballonnet sur l'anastomose)", "Réintubation éventuelle par fibroscopie, sans extension du cou", "Œdème laryngé : corticoïdes, adrénaline en aérosol, héliox")])
        ],
        refs: [REF_ABP]
      },
      {
        id: "mediastinoscopie", title: "Médiastinoscopie", subtitle: "Exploration et biopsies ganglionnaires médiastinales",
        tags: ["Hémorragie", "Tronc artériel brachiocéphalique", "Ambulatoire"],
        sections: [
          S("Installation et monitorage", [ul("Oxymètre de pouls (ou cathéter artériel) au bras droit : détecte la compression du tronc artériel brachiocéphalique par le médiastinoscope", "Pression non invasive au bras gauche", "Voie veineuse de bon calibre, si possible au membre inférieur (risque de plaie de la veine cave supérieure)", "Sang compatible disponible")]),
          S("Antibioprophylaxie", [kv(["Médiastinoscopie", "Aucune antibioprophylaxie"])]),
          S("Complications", [danger("Hémorragie massive (aorte, artère pulmonaire, veine azygos) : compression, sternotomie ou thoracotomie en urgence."), ul("Pneumothorax", "Lésion du nerf récurrent gauche (dysphonie)", "Compression du tronc artériel brachiocéphalique : perte du signal de l'oxymètre droit — prévenir le chirurgien (ischémie cérébrale droite)")]),
          S("Postopératoire", [ul("Radiographie de thorax", "Ambulatoire possible si simple")])
        ],
        refs: [REF_ABP]
      }
    ]
  });
})();
