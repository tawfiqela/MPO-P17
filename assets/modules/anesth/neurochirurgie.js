/* Anesthésie en neurochirurgie */
(function () {
  const { S, ul, kv, warn, danger, info, tbl } = P17.h;
  const REF_ABP = "RFE SFAR-SPILF 2024 : Antibioprophylaxie en chirurgie et médecine interventionnelle (adulte)";
  const REF_TC = "RFE SFAR 2018 : Prise en charge des traumatisés crâniens graves à la phase précoce (Geeraerts T et al., ACCPM)";
  const REF_HSA = "Hoh BL et al. 2023 AHA/ASA Guideline for the management of patients with aneurysmal subarachnoid hemorrhage. Stroke 2023";
  const ABP = kv(["Molécule", "Céfazoline 2 g IV dans les 60 min avant l'incision"], ["Réinjection", "1 g si durée > 4 h, puis toutes les 4 h"], ["Allergie", "Clindamycine 900 mg IV"]);

  window.P17_ANESTH = window.P17_ANESTH || [];
  window.P17_ANESTH.push({
    id: "neurochirurgie", title: "Anesthésie en neurochirurgie", short: "Neurochirurgie",
    desc: "Pression de perfusion cérébrale, détente cérébrale, réveil rapide et neurologique.",
    generalites: {
      subtitle: "Principes de neuro-anesthésie communs aux interventions intracrâniennes et rachidiennes",
      tags: ["PPC", "Normocapnie", "Détente cérébrale", "Réveil précoce"],
      sections: [
        S("Objectifs physiologiques", [
          kv(["PAM / PPC", "Maintenir la PAM à ± 20 % de la valeur de base ; PPC ≥ 60 mmHg si HTIC"], ["PaCO₂", "35–40 mmHg ; hypocapnie modérée (30–35) transitoire uniquement pour la détente cérébrale"], ["Oxygénation", "SpO₂ ≥ 95 %, PaO₂ > 80 mmHg, éviter l'hyperoxie prolongée"], ["Glycémie", "1,0–1,8 g/L (éviter hypo et hyperglycémie)"], ["Natrémie", "135–145 mmol/L ; solutés isotoniques, pas de soluté hypotonique ni de glucosé pur"], ["Température", "Normothermie, traiter toute hyperthermie"])
        ]),
        S("Technique anesthésique", [
          ul("Anesthésie intraveineuse (propofol AIVOC 3–5 µg/mL + sufentanil) ou halogéné < 1 CAM",
            "Pas de protoxyde d'azote (hausse du DSC, pneumocéphalie)",
            "Tête surélevée de 15–30°, pas de compression jugulaire (flexion, rotation, liens de sonde)",
            "Curarisation monitorée ; pas de curare d'entretien si monitorage des potentiels évoqués moteurs",
            "Cathéter artériel (capteur au niveau du tragus), deux voies veineuses, sonde urinaire si chirurgie longue ou osmothérapie")
        ]),
        S("Détente cérébrale", [
          ul("Vérifier l'absence de cause mécanique : position, compression jugulaire, PEP excessive, hypercapnie",
            "Osmothérapie : mannitol 20 % 0,5–1 g/kg en 20 min, ou sérum salé hypertonique (ex. NaCl 7,5 % 100 mL ou NaCl 20 % 40 mL sur voie centrale, ≈ 250 mOsm)",
            "Approfondir l'anesthésie au propofol, hypocapnie modérée transitoire",
            "Drainage du LCS si dérivation ventriculaire en place")
        ]),
        S("Réveil", [
          ul("Objectif : réveil rapide, calme, sans toux ni poussée hypertensive, permettant l'examen neurologique",
            "PAS < 160 mmHg (ou selon la consigne neurochirurgicale) : urapidil, labétalol, nicardipine",
            "Lidocaïne IV avant l'extubation pour limiter la toux",
            "Retard de réveil : éliminer une cause chirurgicale (hématome, pneumocéphalie compressive, œdème) — scanner"),
          danger("Toute dégradation neurologique au réveil impose un scanner cérébral en urgence.")
        ]),
        S("Analgésie et NVPO", [
          ul("Bloc du scalp (ropivacaïne 0,375–0,5 %, 20–30 mL au total) ou infiltration du site : réduit la douleur et la réaction hémodynamique",
            "Paracétamol, néfopam ; AINS à discuter avec le neurochirurgien ; morphine titrée à faible dose",
            "Prophylaxie NVPO : ondansétron ; dexaméthasone si prescrite par le neurochirurgien (souvent déjà en cours pour les tumeurs)")
        ]),
        S("Antibioprophylaxie : vue d'ensemble", [
          tbl(["Intervention", "Antibioprophylaxie"], [
            ["Craniotomie, ventriculoscopie, voie transsphénoïdale ou translabyrinthique", "Céfazoline 2 g IV (1 g si > 4 h)"],
            ["Dérivation ventriculo-péritonéale ou atriale, neurostimulateur, pompe", "Céfazoline 2 g IV"],
            ["Rachis instrumenté (y compris percutané)", "Céfazoline 2 g IV"],
            ["Dérivation ventriculaire externe, biopsie cérébrale, rachis sans matériel", "Aucune"],
            ["Plaie craniocérébrale pénétrante", "Amoxicilline-acide clavulanique 2 g IV (1 g si > 2 h)"],
            ["Fracture de la base du crâne", "Aucune"]
          ], "Allergie : céfazoline → clindamycine 900 mg IV ; amoxicilline-acide clavulanique → cotrimoxazole 160/800 mg IV.")
        ], { wide: true })
      ],
      refs: [REF_TC, REF_HSA, REF_ABP]
    },
    interventions: [
      {
        id: "craniotomie-sus-tentorielle", title: "Craniotomie sus-tentorielle", subtitle: "Tumeur cérébrale (gliome, méningiome, métastase)",
        tags: ["Œdème péritumoral", "Épilepsie", "Saignement"],
        sections: [
          S("Préopératoire", [ul("Signes d'HTIC (céphalées, vomissements, troubles de conscience) : prudence avec la prémédication", "Corticoïdes et antiépileptiques prescrits par le neurochirurgien : à poursuivre", "Méningiome volumineux : risque hémorragique (embolisation préalable possible)")]),
          S("Antibioprophylaxie", [ABP]),
          S("Technique", [ul("Induction douce : propofol + sufentanil, curare non dépolarisant", "Pose de la têtière à pointes : réaction hémodynamique majeure — bolus de sufentanil ou de propofol, ou infiltration des points", "Entretien en AIVOC, normocapnie, détente cérébrale si besoin", "Deux voies veineuses, cathéter artériel, sang disponible pour les méningiomes")]),
          S("Points critiques", [ul("Saignement (sinus veineux, méningiome) : embolie gazeuse possible si la tête est surélevée", "Crise convulsive peropératoire (stimulation corticale) : sérum froid sur le cortex, bolus de propofol", "Œdème cérébral : osmothérapie, approfondissement")]),
          S("Postopératoire", [ul("Surveillance en SSPI prolongée ou soins continus : Glasgow, pupilles, déficit moteur horaires", "Scanner de contrôle selon le neurochirurgien", "Reprise des antiépileptiques, prévention thromboembolique mécanique puis HBPM à 24 h si le scanner est rassurant")])
        ],
        refs: [REF_ABP, "Recommandations PROSPECT (ESRA) : craniotomie"]
      },
      {
        id: "fosse-posterieure", title: "Chirurgie de la fosse postérieure", subtitle: "Tumeurs, conflits vasculonerveux, malformation de Chiari",
        tags: ["Position assise", "Embolie gazeuse", "Tronc cérébral"],
        sections: [
          S("Installation", [ul("Décubitus ventral, latéral (« park-bench ») ou position assise", "Position assise : bonne exposition mais risque d'embolie gazeuse veineuse (jusqu'à 40 %) — contre-indication relative si foramen ovale perméable (ETT avec épreuve de contraste)", "Flexion cervicale : contrôler l'espace menton-sternum (≥ 2 travers de doigt), risque d'œdème lingual")]),
          S("Monitorage spécifique (position assise)", [ul("ETO ou doppler précordial pour détecter l'embolie gazeuse", "Cathéter veineux central multiperforé à la jonction OD-VCS (aspiration de l'air)", "EtCO₂ : chute brutale = signe d'embolie", "PAM mesurée au niveau du conduit auditif externe")]),
          S("Antibioprophylaxie", [ABP]),
          S("Points critiques", [danger("Embolie gazeuse : prévenir le chirurgien (irrigation, cire), FiO₂ 100 %, compression jugulaire bilatérale, aspiration par le cathéter central, vasopresseurs, mise en Trendelenburg et décubitus latéral gauche si collapsus."), ul("Manipulation du tronc cérébral et des nerfs crâniens : bradycardie, arythmies, poussée hypertensive — prévenir le chirurgien, atropine", "Monitorage des potentiels évoqués et des nerfs crâniens : anesthésie intraveineuse")]),
          S("Réveil et postopératoire", [ul("Atteinte des nerfs mixtes (IX, X) : troubles de déglutition, risque d'inhalation — extubation prudente, parfois différée", "Hydrocéphalie aiguë, hématome de la fosse postérieure : dégradation rapide de la conscience", "Pneumocéphalie après position assise")])
        ],
        refs: [REF_ABP]
      },
      {
        id: "craniotomie-eveillee", title: "Craniotomie éveillée", subtitle: "Exérèse tumorale en zone fonctionnelle avec cartographie peropératoire",
        tags: ["Bloc du scalp", "Sédation", "Coopération"],
        sections: [
          S("Sélection et préparation", [ul("Patient informé, motivé, capable de coopérer ; exclure anxiété majeure, troubles cognitifs, apnées du sommeil sévères, obésité, toux chronique", "Consultation avec l'orthophoniste et l'équipe ; visite de la salle si possible", "Installation confortable pour plusieurs heures, accès aux voies aériennes, champs dégageant le visage")]),
          S("Techniques", [ul("Sommeil-éveil-sommeil : AG avec masque laryngé pour l'ouverture, réveil pour la cartographie, puis AG pour la fermeture", "Sédation consciente (« monitored anesthesia care ») : propofol à faible dose, ou dexmédétomidine 0,2–0,7 µg/kg/h, arrêtés avant les tests", "Bloc du scalp complet : nerfs supra-orbitaire, supratrochléaire, zygomaticotemporal, auriculotemporal, grand et petit occipitaux (ropivacaïne 0,375–0,5 %, en respectant la dose maximale), infiltration de la têtière")]),
          S("Antibioprophylaxie", [ABP]),
          S("Incidents peropératoires", [ul("Crise convulsive lors de la stimulation : sérum physiologique glacé sur le cortex, propofol 10–20 mg, puis benzodiazépine si persistance", "Obstruction des voies aériennes, désaturation : subluxation, canule nasale, masque laryngé", "Agitation, douleur (dure-mère, muscle temporal) : infiltration complémentaire", "Nausées : ondansétron prophylactique")]),
          S("Postopératoire", [ul("Surveillance neurologique rapprochée", "Analgésie souvent faible grâce au bloc : paracétamol, néfopam")])
        ],
        refs: [REF_ABP, "Stevanovic A et al. Anaesthesia management for awake craniotomy: systematic review and meta-analysis. PLoS One 2016"]
      },
      {
        id: "hypophyse", title: "Chirurgie hypophysaire transsphénoïdale", subtitle: "Adénomes hypophysaires (acromégalie, Cushing, non sécrétants)",
        tags: ["Intubation difficile", "Corticothérapie", "Diabète insipide"],
        sections: [
          S("Évaluation endocrinienne", [ul("Acromégalie : intubation et ventilation difficiles (macroglossie, épaississement laryngé), apnées du sommeil, cardiomyopathie", "Maladie de Cushing : HTA, diabète, obésité, fragilité cutanée et veineuse", "Insuffisance corticotrope ou thyréotrope : substitution avant la chirurgie", "Bilan visuel (compression du chiasma)")]),
          S("Corticothérapie périopératoire", [ul("Hydrocortisone selon le protocole endocrinologique du service (ex. 50–100 mg IV à l'induction puis relais) si insuffisance corticotrope connue ou chirurgie de Cushing", "Sinon, dosage du cortisol à J1–J2 avant toute substitution, selon l'équipe")]),
          S("Antibioprophylaxie", [ABP]),
          S("Technique", [ul("Intubation : vidéolaryngoscope et matériel d'intubation difficile prêts (acromégalie)", "Sonde armée fixée à gauche, packing pharyngé selon l'équipe", "Infiltration adrénalinée de la muqueuse nasale : HTA, arythmies", "Lésion de la carotide interne : hémorragie massive, rare mais grave")]),
          S("Réveil et postopératoire", [warn("Pas de ventilation au masque ni de PPC après l'extubation (méchage nasal, risque de pneumocéphalie et de méningite) : extubation sur patient bien réveillé."), ul("Diabète insipide (J0–J2) : polyurie > 250–300 mL/h pendant 2 h, densité urinaire < 1,005, natrémie croissante — desmopressine selon l'endocrinologue", "Hyponatrémie retardée (SIADH) J5–J10", "Rhinorrhée claire : fuite de LCS")])
        ],
        refs: [REF_ABP, "Woodmansee WW et al. AACE/ACE Disease state clinical review: postoperative management following pituitary surgery. Endocr Pract 2015"]
      },
      {
        id: "anevrisme", title: "Anévrisme intracrânien : clippage chirurgical", subtitle: "Hémorragie méningée anévrismale ou anévrisme non rompu",
        tags: ["Risque de rupture", "Clampage temporaire", "Vasospasme"],
        sections: [
          S("Avant la sécurisation de l'anévrisme", [ul("Éviter toute poussée hypertensive : PAS < 160 mmHg (seuil à adapter avec le neurochirurgien)", "Éviter l'hypotension (ischémie cérébrale) : maintenir la PAM", "Nimodipine 60 mg toutes les 4 h per os pendant 21 jours (adapter si hypotension)", "Dérivation ventriculaire externe en place : drainage prudent avant l'ouverture durale (risque de resaignement)")]),
          S("Induction", [ul("Induction profonde avant la laryngoscopie : propofol + sufentanil, bolus d'esmolol ou de lidocaïne", "Cathéter artériel posé avant l'induction", "Pose de la têtière : bolus préventif")]),
          S("Antibioprophylaxie", [ABP]),
          S("Clampage temporaire et rupture", [ul("Clampage temporaire : maintenir ou augmenter la PAM de 10–20 %, normocapnie ; noter les heures de clampage", "Rupture peropératoire : baisse transitoire de la PAM pour permettre la mise en place d'un clip, aspiration, transfusion", "Disponibilité de produits sanguins")]),
          S("Postopératoire et vasospasme", [ul("Normovolémie, natrémie normale (surveiller la perte de sel), PAM normale à haute", "Doppler transcrânien quotidien (vasospasme entre J4 et J14 : index de Lindegaard > 3)", "Hyponatrémie : ne pas restreindre les apports (syndrome de perte de sel), NaCl hypertonique ± fludrocortisone"), info("Calcul de l'index de Lindegaard et de la PPC dans Calculateurs > Neurologie.")])
        ],
        refs: [REF_HSA, REF_ABP]
      },
      {
        id: "hematomes", title: "Hématomes intracrâniens en urgence", subtitle: "Hématome extradural, sous-dural aigu ou chronique, contusion",
        tags: ["Urgence", "HTIC", "Antagonisation"],
        sections: [
          S("Avant le bloc", [ul("Glasgow, pupilles, signes d'engagement ; scanner", "Antagoniser les antithrombotiques sans délai (voir tableau)", "Engagement : osmothérapie (mannitol 20 % 1 g/kg ou sérum salé hypertonique) et transfert immédiat au bloc", "TC léger à modéré : acide tranexamique 1 g en 10 min puis 1 g sur 8 h dans les 3 h (CRASH-3)")]),
          S("Antagonisation des antithrombotiques", [tbl(["Traitement", "Antagonisation"], [
            ["AVK", "Concentré de complexe prothrombinique 25–50 UI/kg selon l'INR + vitamine K 10 mg IV"],
            ["Dabigatran", "Idarucizumab 5 g IV"],
            ["Anti-Xa oraux (apixaban, rivaroxaban…)", "CCP 50 UI/kg (ou andexanet alfa selon disponibilité)"],
            ["Antiagrégants", "Transfusion plaquettaire si chirurgie et thrombopénie ; pas de transfusion systématique sous aspirine seule"],
            ["Héparine non fractionnée", "Protamine 1 mg pour 100 UI reçues dans les 2–3 h"]
          ])], { wide: true }),
          S("Anesthésie", [ul("Séquence rapide (estomac plein), induction préservant la PAM (étomidate ou kétamine, propofol à dose réduite)", "Objectifs : PAM ≥ 80 mmHg, PaCO₂ 35–40 mmHg, SpO₂ > 95 %, normothermie, Hb > 7–9 g/dL, plaquettes > 100 G/L", "Décompression : chute brutale de la PIC et parfois collapsus — anticiper")]),
          S("Hématome sous-dural chronique", [ul("Sujet âgé, souvent sous antithrombotiques", "Anesthésie locale avec sédation légère ou AG courte", "Risque de récidive, d'épilepsie, de pneumocéphalie")]),
          S("Postopératoire", [ul("Réanimation si TC grave : protocole de neuroprotection (voir RFE TC grave)", "Scanner de contrôle, reprise des antithrombotiques discutée en équipe")])
        ],
        refs: [REF_TC, "CRASH-3 trial collaborators. Lancet 2019", "Propositions du GIHP sur la gestion des anticoagulants oraux directs en chirurgie urgente"]
      },
      {
        id: "rachis", title: "Chirurgie du rachis programmée", subtitle: "Discectomie, laminectomie, arthrodèse lombaire ou cervicale",
        tags: ["Décubitus ventral", "Potentiels évoqués", "Saignement"],
        sections: [
          S("Installation en décubitus ventral", [ul("Têtière adaptée, yeux sans aucune pression (contrôle régulier) : risque de neuropathie optique ischémique (chirurgie longue, hypotension, anémie, remplissage massif)", "Abdomen libre (réduit la pression veineuse épidurale et le saignement)", "Points d'appui protégés : seins, organes génitaux, genoux, plexus brachial (bras < 90°)")]),
          S("Antibioprophylaxie", [kv(["Instrumentée", "Céfazoline 2 g IV (1 g si > 4 h)"], ["Sans matériel", "Aucune"], ["Allergie", "Clindamycine 900 mg IV"])]),
          S("Technique", [ul("Monitorage des potentiels évoqués (scolioses, myélopathies) : propofol + sufentanil, pas de curare d'entretien", "Arthrodèse étendue : cathéter artériel, acide tranexamique (ex. 15 mg/kg puis 1 mg/kg/h), récupération de sang", "Rachis cervical : intubation selon la stabilité et la myélopathie (vidéolaryngoscope, fibroscope)")]),
          S("Analgésie", [ul("Kétamine (0,5 mg/kg puis 0,25 mg/kg/h) chez le patient douloureux chronique ou sous opioïdes", "Bloc du plan des muscles érecteurs du rachis (ESP) bilatéral ou morphine intrathécale (100–200 µg) pour les arthrodèses", "Paracétamol, AINS courts si l'équipe l'accepte, lidocaïne IV")]),
          S("Postopératoire", [ul("Examen neurologique des membres au réveil (hématome épidural compressif = urgence)", "Lever précoce selon le protocole RAAC rachis", "Chirurgie cervicale antérieure : hématome cervical compressif, dysphagie, œdème laryngé")])
        ],
        refs: ["Waelkens P et al. PROSPECT : lumbar spinal fusion. Eur J Anaesthesiol 2021", "Debono B et al. Consensus statement for perioperative care in lumbar spinal fusion: ERAS Society recommendations. Spine J 2021", REF_ABP]
      },
      {
        id: "derivations", title: "Dérivations du LCS", subtitle: "Dérivation ventriculaire externe, ventriculo-péritonéale, ventriculocisternostomie",
        tags: ["Hydrocéphalie", "HTIC", "Ventriculoscopie"],
        sections: [
          S("Dérivation ventriculaire externe", [ul("Hydrocéphalie aiguë, mesure de la PIC : geste urgent", "Séquence rapide si troubles de conscience, maintien de la PPC", "Pas d'antibioprophylaxie ; asepsie stricte, fixation et système clos")]),
          S("Dérivation ventriculo-péritonéale ou atriale", [ul("Céfazoline 2 g IV (1 g si > 4 h)", "Tunnellisation sous-cutanée douloureuse : bolus d'opioïde avant le passage", "Hydrocéphalie chronique de l'adulte : sujet âgé, troubles cognitifs")]),
          S("Ventriculocisternostomie endoscopique", [ul("Céfazoline 2 g IV", "Irrigation intraventriculaire : bradycardie, HTA (réaction de Cushing), arythmies — prévenir le chirurgien et arrêter l'irrigation", "Lésion de l'artère basilaire : rare, catastrophique")]),
          S("Postopératoire", [ul("Surveillance neurologique, niveau de drainage prescrit (DVE)", "Hyperdrainage : céphalées posturales, hématome sous-dural", "Infection de dérivation : fièvre, troubles de conscience, LCS trouble")])
        ],
        refs: [REF_ABP]
      }
    ]
  });
})();
