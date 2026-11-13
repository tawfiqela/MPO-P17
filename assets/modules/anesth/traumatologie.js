/* Anesthésie en traumatologie */
(function () {
  const { S, ul, ult, kv, warn, danger, info, tbl } = P17.h;
  const ABP_FERMEE = kv(["Molécule", "Céfazoline 2 g IV dans les 60 min avant l'incision"], ["Réinjection", "1 g si durée > 4 h, puis toutes les 4 h"], ["Allergie", "Clindamycine 900 mg IV"], ["Durée", "Limitée à la période opératoire"]);
  const REF_ABP = "RFE SFAR-SPILF 2024 : Antibioprophylaxie en chirurgie et médecine interventionnelle (adulte)";
  const REF_MEMBRE = "SFAR 2021 : Guidelines for the acute care of severe limb trauma patients (Anaesth Crit Care Pain Med)";
  const REF_HEMO = "Rossaint R et al. European guideline on management of major bleeding and coagulopathy following trauma, 6e éd. Crit Care 2023";
  const REF_CURARE = "RFE SFAR 2018 : Curarisation et décurarisation en anesthésie (Plaud B et al., ACCPM 2020)";
  const REF_DOUL = "RFE SFAR : Réactualisation de la recommandation sur la douleur postopératoire (Aubrun F et al., ACCPM 2019)";

  window.P17_ANESTH = window.P17_ANESTH || [];
  window.P17_ANESTH.push({
    id: "traumatologie", title: "Anesthésie en traumatologie", short: "Traumatologie",
    desc: "Fractures, polytraumatisé, rachis : estomac plein, hémorragie, ALR et gestion du garrot.",
    generalites: {
      subtitle: "Principes communs à la chirurgie traumatologique urgente et différée",
      tags: ["Estomac plein", "Hémorragie", "ALR", "Thromboprophylaxie"],
      sections: [
        S("Évaluation à l'admission", [
          ul("Mécanisme et bilan lésionnel complet (traumatisé grave : approche ABCDE, FAST, body-scanner)",
            "Heure du dernier repas et de l'accident : la vidange gastrique est arrêtée par la douleur et les morphiniques",
            "Traitements antithrombotiques : AVK, AOD (dosage spécifique si urgence), antiagrégants",
            "Terrain : sujet âgé, cardiopathie, insuffisance respiratoire, alcool, toxiques",
            "Bilan : NFS, hémostase, groupe ABO-RhD et RAI, ionogramme, créatinine, lactate si choc")
        ]),
        S("Estomac plein", [
          ul("Considérer comme estomac plein tout traumatisé opéré dans les 6–8 h, sous morphiniques ou douloureux",
            "Échographie gastrique utile en cas de doute (antre > 1,5 mL/kg ou contenu solide)",
            "Induction en séquence rapide : préoxygénation (FeO₂ > 90 %), hypnotique puis curare d'action rapide sans ventilation au masque, intubation dans la minute",
            "Rocuronium 1–1,2 mg/kg (sugammadex 16 mg/kg disponible) ou succinylcholine 1 mg/kg")
        ]),
        S("Choix de la technique", [
          ul("ALR seule ou associée à l'AG dès que possible : analgésie de qualité, épargne morphinique, moins de confusion chez le sujet âgé",
            "Rachianesthésie : vérifier l'hémostase et les délais d'arrêt des antithrombotiques",
            "Blocs périphériques échoguidés : réalisables malgré un traitement antithrombotique pour les sites compressibles",
            "Syndrome des loges (jambe, avant-bras) : un bloc analgésique de longue durée peut masquer les signes — surveillance clinique rapprochée, voire mesure des pressions des loges")
        ]),
        S("Hémorragie et transfusion", [
          ul("Acide tranexamique 1 g IV en 10 min puis 1 g sur 8 h, dans les 3 premières heures du traumatisme (CRASH-2)",
            "Chirurgie orthopédique hémorragique : acide tranexamique 1 g (ou 15 mg/kg) à l'incision, éventuellement renouvelé à la fermeture",
            "Seuil transfusionnel : Hb 7 g/dL (8 g/dL si coronaropathie ou sujet âgé), sauf hémorragie active",
            "Récupération peropératoire de sang si saignement attendu > 500 mL (rachis, bassin) hors foyer septique")
        ]),
        S("Garrot pneumatique", [
          ul("Pression : PAS + 100 mmHg (membre inférieur), PAS + 50–75 mmHg (membre supérieur)",
            "Durée maximale conseillée : 2 h ; si dépassement, lever 15–20 min avant regonflage",
            "Douleur de garrot au-delà de 45–60 min malgré l'ALR",
            "Lâcher : hypotension, acidose, hyperkaliémie, hausse de l'EtCO₂ ; anticiper le remplissage"),
          danger("Le garrot est contre-indiqué en cas d'artériopathie sévère, de pontage ou de fracture ouverte avec lésion vasculaire.")
        ]),
        S("Thromboprophylaxie", [
          ul("Membre inférieur immobilisé ou chirurgie de la hanche : HBPM (énoxaparine 4000 UI/j) débutée 12 h après la chirurgie, ou 6–8 h après selon le risque hémorragique",
            "Polytraumatisé : contention pneumatique intermittente d'emblée, HBPM dès que le risque hémorragique est contrôlé (souvent 24–48 h)",
            "Adapter à la fonction rénale (DFG < 30 : HNF)")
        ]),
        S("Analgésie postopératoire", [
          ul("Paracétamol 1 g/6 h + AINS si pas de contre-indication (éviter chez le sujet âgé, l'insuffisant rénal, l'hémorragique)",
            "Néfopam 20 mg/4–6 h IV lente (max 120 mg/24 h)",
            "Cathéter périnerveux pour les fractures très douloureuses (fémur, épaule, calcanéum)",
            "Kétamine 0,15–0,5 mg/kg puis 0,125–0,25 mg/kg/h si douleur sévère attendue ou patient tolérant aux opioïdes")
        ], { wide: true })
      ],
      refs: [REF_MEMBRE, REF_HEMO, REF_CURARE, REF_DOUL, REF_ABP]
    },
    interventions: [
      {
        id: "fesf", title: "Fracture de l'extrémité proximale du fémur", subtitle: "Sujet âgé : col, trochanter — ostéosynthèse ou arthroplastie",
        tags: ["Sujet âgé", "Chirurgie < 48 h", "Bloc fascia iliaca", "Ciment"],
        sections: [
          S("Particularités", [
            ul("Patient âgé, polypathologique, souvent dénutri, sous antithrombotiques ; mortalité à 1 an de 20–30 %",
              "Opérer dans les 24–48 h : tout retard augmente la mortalité et les complications",
              "Ne pas retarder l'intervention pour un antiagrégant plaquettaire ; AOD : délai selon la molécule, la fonction rénale ou le dosage spécifique",
              "Évaluer : cognition (délirium préexistant), état nutritionnel, chutes, échocardiographie seulement si souffle non exploré avec signes cliniques")
          ]),
          S("Analgésie dès l'admission", [
            ul("Bloc ilio-fascial (fascia iliaca) échoguidé dès les urgences : ropivacaïne 0,2–0,375 %, 30–40 mL (respecter 3 mg/kg)",
              "Alternative : bloc PENG pour l'analgésie et la mobilisation",
              "Paracétamol ; éviter AINS et tramadol chez le sujet âgé fragile ; morphine titrée à doses réduites si nécessaire"),
            info("Le bloc réduit la consommation de morphine et l'incidence du délirium.")
          ]),
          S("Technique anesthésique", [
            ul("Rachianesthésie ou anesthésie générale : pas de différence de mortalité ni de délirium (essai REGAIN)",
              "Rachianesthésie : bupivacaïne hyperbare 7,5–10 mg ± sufentanil 2,5 µg, après installation en décubitus latéral sur le côté fracturé (bloc ilio-fascial préalable)",
              "AG : doses réduites (propofol 0,5–1 mg/kg ou étomidate), monitorage de la profondeur d'anesthésie, éviter les benzodiazépines",
              "Prévenir l'hypotension : noradrénaline en débit continu (ou éphédrine/phényléphrine) ; objectif PAM > 65 mmHg et ≥ 80 % de la valeur de base")
          ]),
          S("Antibioprophylaxie", [ABP_FERMEE]),
          S("Arthroplastie cimentée : syndrome d'implantation du ciment", [
            ul("Hypoxémie, hypotension, arrêt cardiaque au moment du cimentage ou de la réduction",
              "Facteurs de risque : ASA III–IV, HTAP, dysfonction VD, ostéoporose sévère",
              "Prévention : FiO₂ augmentée, normovolémie, lavage et aspiration du fût fémoral, prévenir le chirurgien",
              "Traitement : FiO₂ 100 %, vasopresseurs (noradrénaline, adrénaline en bolus si collapsus), soutien du VD"),
            danger("Patients à haut risque : discuter une prothèse non cimentée avec le chirurgien.")
          ]),
          S("Saignement", [ul("Pertes 300–800 mL (davantage pour les fractures trochantériennes enclouées)", "Acide tranexamique 1 g à l'incision (± 1 g à la fermeture) en l'absence de contre-indication", "Seuil transfusionnel : Hb 8 g/dL ou symptômes (FOCUS)")]),
          S("Postopératoire", [
            ul("Lever et appui dès J1, kinésithérapie précoce",
              "Prévention du délirium : lunettes, appareils auditifs, orientation, éviter la contention, limiter les psychotropes",
              "Thromboprophylaxie HBPM 35 jours",
              "Surveillance : globe vésical, constipation, escarres, natrémie, fonction rénale",
              "Orthogériatrie dès l'admission si possible")
          ], { wide: true })
        ],
        refs: ["HAS : Chirurgie des fractures de l'extrémité proximale du fémur chez les patients âgés", "RFE SFAR : Anesthésie du sujet âgé", "Neuman MD et al. REGAIN. N Engl J Med 2021", REF_ABP]
      },
      {
        id: "diaphyses", title: "Fractures diaphysaires du fémur et du tibia", subtitle: "Enclouage centromédullaire, plaque, fixateur externe",
        tags: ["Embolie graisseuse", "Saignement", "Loges"],
        sections: [
          S("Particularités", [
            ul("Sujet jeune, souvent polytraumatisé ; fracture du fémur : pertes 1–1,5 L avant toute chirurgie",
              "Fixation précoce (< 24 h) si le patient est stable ; fixateur externe (damage control orthopédique) si instable",
              "Rechercher un syndrome des loges (jambe) avant et après l'intervention")
          ]),
          S("Technique anesthésique", [
            ul("AG en séquence rapide si estomac plein, ou rachianesthésie pour le tibia isolé",
              "ALR analgésique : bloc fémoral ou ilio-fascial (fémur), bloc sciatique poplité ± saphène (tibia)",
              "Fracture de jambe : éviter les blocs denses et prolongés si risque de syndrome des loges, ou surveillance renforcée (pression des loges)",
              "Deux voies veineuses de bon calibre ; artère si polytraumatisé")
          ]),
          S("Antibioprophylaxie", [ABP_FERMEE, info("Fracture ouverte : voir la fiche dédiée.")]),
          S("Embolie graisseuse", [
            ul("Survient lors de l'alésage ou dans les 24–72 h : hypoxémie, confusion, pétéchies (aisselles, conjonctives)",
              "Peropératoire : chute de SpO₂ et d'EtCO₂, hypotension, défaillance VD",
              "Traitement symptomatique : oxygénation, ventilation protectrice, soutien du VD ; pas de traitement spécifique"),
            warn("Différer l'alésage chez un patient instable ou avec contusion pulmonaire sévère.")
          ]),
          S("Saignement", [ul("Acide tranexamique 1 g à l'incision", "Bilan de coagulation si transfusion massive : ratio PFC/CGR 1:1 à 1:2, fibrinogène > 1,5 g/L, Ca ionisé > 1,1 mmol/L")]),
          S("Postopératoire", [ul("Cathéter périnerveux à discuter (fémur)", "Thromboprophylaxie HBPM tant que l'appui n'est pas repris", "Surveillance neurovasculaire et des loges toutes les heures pendant 24 h (jambe)")])
        ],
        refs: [REF_MEMBRE, REF_HEMO, REF_ABP]
      },
      {
        id: "membre-superieur", title: "Membre supérieur et main", subtitle: "Épaule, humérus, coude, avant-bras, poignet, main",
        tags: ["ALR plexique", "Garrot", "Ambulatoire"],
        sections: [
          S("Choix du bloc", [
            tbl(["Chirurgie", "Bloc de choix", "Remarques"], [
              ["Épaule, humérus proximal", "Interscalénique", "Paralysie phrénique quasi constante : contre-indiqué si insuffisance respiratoire ; alternative : bloc supraclaviculaire à bas volume ou bloc suprascapulaire + axillaire"],
              ["Humérus distal, coude", "Supraclaviculaire ou infraclaviculaire", "Paralysie phrénique moins fréquente qu'en interscalénique"],
              ["Avant-bras, poignet, main", "Axillaire ou infraclaviculaire", "Bloc axillaire : quatre nerfs échoguidés ; peu de complications"],
              ["Main, doigts (court)", "Blocs tronculaires au coude ou au poignet, ou WALANT", "Anesthésie locale avec adrénaline sans garrot pour les gestes simples"]
            ])
          ]),
          S("Anesthésiques locaux", [
            ul("Chirurgie : ropivacaïne 0,5–0,75 % ou mépivacaïne 1,5 % (courte durée, ambulatoire), 15–30 mL",
              "Analgésie prolongée : ropivacaïne 0,2 % sur cathéter, 5–8 mL/h ± bolus",
              "Dexaméthasone 4–8 mg IV prolonge la durée du bloc",
              "Respecter les doses maximales (voir le calculateur des anesthésiques locaux)")
          ]),
          S("Antibioprophylaxie", [ABP_FERMEE, info("Plaie articulaire : céfazoline 2 g. Plaie contaminée ou morsure : amoxicilline-acide clavulanique 2 g IV.")]),
          S("Points de vigilance", [
            ul("Position assise (« beach chair ») pour l'épaule : hypotension, bradycardie (réflexe de Bezold-Jarisch) ; mesurer la PA au niveau du cerveau, maintenir la PAM",
              "Garrot : pression PAS + 50–75 mmHg, tolérance limitée sans bloc complet",
              "Surveillance de la toxicité systémique : injection fractionnée, aspiration, échoguidage, émulsion lipidique disponible")
          ]),
          S("Postopératoire", [ul("Protéger le membre insensible (attelle, écharpe)", "Prévoir le relais analgésique avant la levée du bloc (paracétamol, AINS, ± palier 2)", "Ambulatoire possible : consignes écrites, appel du lendemain")])
        ],
        refs: ["RFE SFAR : Anesthésie locorégionale périnerveuse", "Recommandations PROSPECT (ESRA) spécifiques à la procédure", REF_ABP]
      },
      {
        id: "bassin", title: "Fractures du bassin et du cotyle", subtitle: "Ostéosynthèse en urgence différée, damage control",
        tags: ["Hémorragie", "Damage control", "Transfusion massive"],
        sections: [
          S("Phase aiguë", [
            ul("Fracture instable avec choc hémorragique : ceinture pelvienne, artério-embolisation et/ou packing extrapéritonéal",
              "Objectif PAS 80–90 mmHg (PAM 60–65) sans traumatisme crânien, PAM ≥ 80 mmHg si traumatisme crânien grave",
              "Noradrénaline précoce si l'expansion volémique ne suffit pas",
              "Protocole de transfusion massive : PFC/CGR 1:1 à 1:2, fibrinogène 3 g si < 1,5 g/L, plaquettes > 50 G/L (100 G/L si TC)",
              "Acide tranexamique 1 g + 1 g/8 h ; calcium (Ca ionisé > 1,1 mmol/L) ; normothermie")
          ], { wide: true }),
          S("Chirurgie différée", [
            ul("Ostéosynthèse définitive à J5–J10 quand l'état physiologique le permet",
              "Saignement important (1–2 L) : deux voies de gros calibre, cathéter artériel, récupération de sang, acide tranexamique",
              "Position en décubitus ventral pour les abords postérieurs : protection des yeux et des appuis")
          ]),
          S("Analgésie", [ul("Péridurale lombaire si hémostase normale et pas de lésion rachidienne", "Sinon kétamine + morphine en PCA + paracétamol", "Bloc du plan des érecteurs ou du carré des lombes selon l'abord")]),
          S("Antibioprophylaxie", [ABP_FERMEE]),
          S("Complications", [ul("Lésions urétrales et vésicales (pas de sonde avant l'avis urologique si urétrorragie)", "Maladie thromboembolique très fréquente : prophylaxie mécanique puis HBPM dès que possible", "Lésions nerveuses (sciatique) : examen neurologique documenté avant l'anesthésie")])
        ],
        refs: [REF_HEMO, "SFAR 2020 : Early management of severe abdominal trauma (ACCPM)", REF_ABP]
      },
      {
        id: "rachis-traumatique", title: "Rachis traumatique", subtitle: "Fracture et luxation vertébrale, lésion médullaire",
        tags: ["Rachis cervical", "Moelle", "Décubitus ventral"],
        sections: [
          S("Intubation du rachis cervical instable", [
            ul("Séquence rapide avec stabilisation manuelle dans l'axe (ouvrir le collier, garder la stabilisation)",
              "Vidéolaryngoscope en première intention ; fibroscopie vigile si intubation difficile prévue chez un patient coopérant",
              "Succinylcholine utilisable dans les 24–48 premières heures ; contre-indiquée ensuite (hyperkaliémie sur dénervation)",
              "Examen neurologique documenté avant l'induction")
          ]),
          S("Protection médullaire", [
            ul("Éviter toute hypotension : objectif PAM ≥ 80 mmHg (souvent 85–90 mmHg) dans les premiers jours d'une lésion médullaire",
              "Normoxie, normocapnie, normoglycémie, normothermie",
              "Pas de corticoïdes à forte dose (méthylprednisolone) en routine",
              "Lésion haute (au-dessus de T6) : choc spinal (bradycardie, vasoplégie), dysautonomie ; atropine et noradrénaline à disposition")
          ]),
          S("Peropératoire", [
            ul("Décubitus ventral : têtière adaptée, yeux libres de toute pression (risque de cécité postopératoire), abdomen libre",
              "Monitorage des potentiels évoqués : anesthésie intraveineuse (propofol + sufentanil), pas de curare d'entretien si PEM",
              "Saignement : acide tranexamique, récupération de sang ; pertes importantes sur arthrodèse étendue")
          ]),
          S("Antibioprophylaxie", [kv(["Rachis instrumenté", "Céfazoline 2 g IV, 1 g si > 4 h puis /4 h"], ["Sans matériel", "Pas d'antibioprophylaxie"], ["Allergie", "Clindamycine 900 mg IV"])]),
          S("Postopératoire", [ul("Tétraplégie haute : risque d'insuffisance respiratoire secondaire (épuisement, encombrement) — surveillance en réanimation, capacité vitale", "Kinésithérapie respiratoire, prévention des escarres et de la thrombose", "Analgésie : kétamine, paracétamol, morphine en PCA ; ESP bilatéral possible")])
        ],
        refs: ["RFE SFAR 2018 : Prise en charge des traumatisés crâniens graves à la phase précoce (Geeraerts T et al., ACCPM)", REF_CURARE, REF_ABP]
      },
      {
        id: "polytraumatise", title: "Polytraumatisé : chirurgie d'hémostase", subtitle: "Damage control surgery et resuscitation",
        tags: ["Choc hémorragique", "Triade létale", "Transfusion massive"],
        sections: [
          S("Principes du damage control", [
            ul("Chirurgie écourtée (< 90 min) : hémostase, contrôle de la contamination, fermeture temporaire",
              "Réanimation : correction de la triade létale (hypothermie, acidose, coagulopathie) et de l'hypocalcémie",
              "Chirurgie définitive différée à 24–72 h")
          ], { wide: true }),
          S("Induction", [
            ul("Séquence rapide : kétamine 1–2 mg/kg ou étomidate 0,2–0,3 mg/kg, doses réduites si choc profond",
              "Rocuronium 1,2 mg/kg ou succinylcholine 1 mg/kg",
              "Noradrénaline prête avant l'induction ; induction au bloc, champ préparé, chirurgien prêt",
              "Ventilation : éviter l'hyperventilation et la PEP élevée qui aggravent l'hypotension")
          ]),
          S("Objectifs hémodynamiques", [
            kv(["Sans traumatisme crânien", "PAS 80–90 mmHg (PAM 60–65) jusqu'au contrôle de l'hémorragie"], ["Traumatisme crânien grave", "PAM ≥ 80 mmHg"], ["Hémoglobine", "7–9 g/dL"], ["Température", "> 35 °C (réchauffeur de perfusion, couverture chauffante)"], ["Ca ionisé", "> 1,1 mmol/L"])
          ]),
          S("Transfusion massive", [
            ul("Déclencher le protocole dès le choc hémorragique (score ABC ≥ 2, Shock Index > 1)",
              "PFC/CGR 1:1 à 1:2 ; plaquettes si < 50 G/L (100 G/L si TC) ; fibrinogène 3 g si < 1,5 g/L ou A5 EXTEM < 7 mm",
              "Acide tranexamique 1 g en 10 min puis 1 g sur 8 h (< 3 h du traumatisme)",
              "Tests viscoélastiques (ROTEM/TEG) si disponibles pour guider les apports",
              "Calcium : 1 g de chlorure de calcium par 3–4 CGR, guidé par le Ca ionisé")
          ]),
          S("Points critiques", [
            danger("Traumatisme crânien associé : l'hypotension permissive est contre-indiquée."),
            ul("Arrêt cardiaque traumatique : traiter les causes réversibles (hypovolémie, pneumothorax compressif, tamponnade, hypoxie)",
              "Anticiper la ventilation difficile (contusion pulmonaire, pneumothorax sous ventilation : drain)",
              "Syndrome du compartiment abdominal après packing : mesure de la pression vésicale")
          ]),
          S("Après la chirurgie", [ul("Transfert en réanimation intubé, réchauffement actif", "Bilans répétés : lactate, hémostase, fibrinogène, Ca ionisé", "Prévention thromboembolique mécanique immédiate, HBPM dès le contrôle de l'hémorragie")])
        ],
        refs: [REF_HEMO, "SFAR 2020 : Early management of severe abdominal trauma (ACCPM)", "CRASH-2 Collaborators. Lancet 2010"]
      },
      {
        id: "fractures-ouvertes", title: "Fractures ouvertes et plaies traumatiques", subtitle: "Parage, ostéosynthèse, fixateur externe",
        tags: ["Gustilo", "Antibioprophylaxie", "Tétanos"],
        sections: [
          S("Prise en charge initiale", [
            ul("Antibioprophylaxie le plus tôt possible (idéalement < 1 h après l'admission)",
              "Vérifier la vaccination antitétanique : sérum et vaccin selon le statut",
              "Parage chirurgical dans les 24 h (en urgence si contamination massive ou lésion vasculaire)",
              "Photographier la plaie, pansement stérile, ne pas réintégrer les fragments")
          ]),
          S("Antibioprophylaxie (RFE 2024)", [
            tbl(["Situation", "Molécule et dose", "Réinjection"], [
              ["Gustilo I", "Céfazoline 2 g IV", "1 g si > 4 h, puis toutes les 4 h"],
              ["Gustilo II et III", "Amoxicilline-acide clavulanique 2 g IV", "1 g si > 2 h, puis toutes les 2 h"],
              ["Allergie aux bêta-lactamines", "Clindamycine 900 mg IV + gentamicine 6–7 mg/kg IV", "Clindamycine 450 mg toutes les 4 h"],
              ["Plaie articulaire", "Céfazoline 2 g IV", "1 g si > 4 h"],
              ["Plaie des parties molles contaminée, morsure", "Amoxicilline-acide clavulanique 2 g IV", "1 g si > 2 h"]
            ])
          ], { wide: true }),
          S("Anesthésie", [ul("Estomac plein le plus souvent : séquence rapide", "ALR possible pour les membres si hémostase normale et pas de risque de syndrome des loges", "Gentamicine : dose unique, attention à l'association avec les curares (potentialisation)")]),
          S("Points de vigilance", [ul("Lésion vasculaire associée : garrot contre-indiqué, chirurgien vasculaire", "Amputation traumatique : contrôle de l'hémorragie, prévention de la douleur du membre fantôme (ALR périnerveuse continue, kétamine)", "Rhabdomyolyse des écrasements : diurèse, CPK, kaliémie")])
        ],
        refs: [REF_ABP, REF_MEMBRE]
      }
    ]
  });
})();
