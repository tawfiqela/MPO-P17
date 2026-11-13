/* Anesthésie pour transplantation rénale — rattachée à la spécialité Urologie
   (groupe « Transplantation rénale » de la page Urologie) */
(function () {
  const { S, ul, kv, warn, danger, info, tbl } = P17.h;
  const REF_ABP = "RFE SFAR-SPILF 2024 : Antibioprophylaxie en chirurgie et médecine interventionnelle (adulte)";
  const REF_BEST = "Collins MG et al. Balanced crystalloid solution versus saline in deceased donor kidney transplantation (BEST-Fluids). Lancet 2023";
  const REF_KDIGO = "KDIGO Clinical practice guideline on the evaluation and management of candidates for kidney transplantation. Transplantation 2020";
  const REF_ABM = "Agence de la biomédecine : Recommandations sur le prélèvement de rein sur donneur vivant (2023)";

  window.P17_ANESTH = window.P17_ANESTH || [];
  const TR = ({
    id: "transplantation-renale", title: "Anesthésie pour transplantation rénale", short: "Transplantation rénale",
    desc: "Receveur insuffisant rénal terminal et donneur vivant : préparation, reperfusion, protection du greffon.",
    generalites: {
      subtitle: "Spécificités du patient insuffisant rénal chronique et objectifs pour le greffon",
      tags: ["Kaliémie", "Fistule artérioveineuse", "Cristalloïdes balancés", "Reperfusion"],
      sections: [
        S("Le receveur", [
          ul("Insuffisance rénale terminale dialysée (hémodialyse ou dialyse péritonéale) ou greffe préemptive",
            "Comorbidités : cardiopathie ischémique et hypertrophique, HTA, diabète (gastroparésie), anémie, dysfonction plaquettaire urémique, hyperparathyroïdie",
            "Donneur décédé : intervention semi-urgente, ischémie froide à limiter ; donneur vivant : intervention programmée")
        ]),
        S("Pharmacologie chez l'insuffisant rénal", [
          tbl(["Classe", "Choix préférentiel", "Prudence ou à éviter"], [
            ["Hypnotiques", "Propofol, étomidate (doses titrées)", "Benzodiazépines (accumulation)"],
            ["Morphiniques", "Sufentanil en peropératoire ; oxycodone à faible dose en postopératoire", "Morphine (métabolite actif M6G), tramadol, codéine"],
            ["Curares", "Atracurium, cisatracurium (élimination de Hofmann) ; rocuronium sous monitorage", "Succinylcholine si K⁺ > 5,5 mmol/L ; sugammadex non recommandé si DFG < 30 (à discuter)"],
            ["Analgésiques", "Paracétamol, blocs pariétaux", "AINS (contre-indiqués), néfopam à dose réduite"]
          ])
        ], { wide: true }),
        S("Objectifs pour le greffon", [
          ul("Éviter l'hypotension, surtout à la reperfusion : PAM ≥ 80 mmHg (PAS ≥ 120 mmHg) au déclampage",
            "Normovolémie guidée par objectifs, sans surcharge",
            "Cristalloïdes balancés (moins de retard de reprise de fonction qu'avec le NaCl 0,9 %)",
            "Pas d'hydroxyéthylamidons ; la dopamine « rénale » n'a pas d'intérêt",
            "Mannitol et furosémide : sans bénéfice démontré, selon le protocole chirurgical")
        ]),
        S("Fistule artérioveineuse", [
          danger("Ne jamais poser de brassard, de cathéter ni de garrot sur le bras porteur de la fistule. Vérifier le thrill au réveil."),
          ul("Protéger et caler le bras, le noter sur la feuille d'anesthésie")
        ]),
        S("Antibioprophylaxie", [
          kv(["Molécule", "Céfazoline 2 g IV dans les 60 min avant l'incision"], ["Réinjection", "1 g si durée > 4 h, puis toutes les 4 h"], ["Alternative", "Céfuroxime 1,5 g"], ["Allergie", "Gentamicine 6–7 mg/kg en dose unique (à discuter avec les néphrologues) ou vancomycine 20 mg/kg"])
        ])
      ],
      refs: [REF_KDIGO, REF_BEST, REF_ABP]
    },
    interventions: [
      {
        id: "receveur-preop", title: "Receveur : bilan et préparation", subtitle: "Consultation, dialyse préopératoire, immunosuppression d'induction",
        tags: ["Dialyse < 24 h", "Kaliémie", "Évaluation cardiaque"],
        sections: [
          S("Évaluation", [ul("Cardiaque : capacité fonctionnelle, échocardiographie, recherche d'ischémie selon le risque (diabète, âge, antécédents) — souvent déjà réalisée lors de l'inscription", "Voies aériennes, gastroparésie diabétique (séquence rapide)", "Statut vasculaire (artériopathie iliaque : site d'anastomose)", "Traitements : antiagrégants, anticoagulants, bêtabloquants à poursuivre")]),
          S("Dialyse préopératoire", [ul("Hémodialyse dans les 24 h si nécessaire : objectif K⁺ < 5,5 mmol/L, surcharge corrigée", "Éviter une ultrafiltration excessive (hypovolémie à l'induction, retard de fonction du greffon) : viser le poids sec ou légèrement au-dessus", "Dialyse péritonéale : vidanger la cavité avant le bloc", "Kaliémie de contrôle au plus près de l'induction")]),
          S("Bilan biologique", [ul("Ionogramme (K⁺), bicarbonates, urée, créatinine", "NFS, hémostase, groupe et RAI", "Glycémie, bilan infectieux selon le protocole de greffe")]),
          S("Immunosuppression", [ul("Induction selon le protocole de néphrologie : basiliximab ou globulines antilymphocytaires (thymoglobuline)", "Thymoglobuline : réactions à la perfusion (fièvre, frissons, hypotension, bronchospasme) — prémédication par méthylprednisolone, antihistaminique, paracétamol ; perfusion lente sur voie centrale", "Corticoïdes (méthylprednisolone) avant la reperfusion selon le protocole", "Anticalcineurine (tacrolimus) et mycophénolate débutés selon l'équipe")])
        ],
        refs: [REF_KDIGO]
      },
      {
        id: "receveur-perop", title: "Receveur : période peropératoire", subtitle: "Greffe en fosse iliaque, clampage et reperfusion",
        tags: ["Reperfusion", "PAM ≥ 80 mmHg", "Hyperkaliémie"],
        sections: [
          S("Installation et monitorage", [ul("Cathéter artériel (bras controlatéral à la fistule) selon le terrain", "Voie veineuse centrale jugulaire interne (perfusion de thymoglobuline, vasopresseurs) ; la PVC est un mauvais indice de remplissage", "Monitorage du débit cardiaque ou des indices dynamiques pour guider le remplissage", "Sonde urinaire (vessie remplie au bleu ou au sérum selon le chirurgien), réchauffement")]),
          S("Induction et entretien", [ul("Séquence rapide si gastroparésie : propofol ou étomidate, rocuronium (ou succinylcholine si K⁺ < 5,5 mmol/L)", "Entretien : halogéné ou propofol, sufentanil", "Curarisation par atracurium ou cisatracurium, monitorage quantitatif", "Prophylaxie des NVPO (ondansétron ; dexaméthasone si non redondante avec les corticoïdes du protocole)")]),
          S("Antibioprophylaxie", [kv(["Molécule", "Céfazoline 2 g IV (1 g si > 4 h)"], ["Allergie", "À discuter avec les néphrologues"])]),
          S("Remplissage", [ul("Cristalloïdes balancés (Plasma-Lyte, Ringer lactate) : ne majorent pas la kaliémie de façon cliniquement significative et réduisent le retard de fonction", "Remplissage guidé par objectifs, éviter la surcharge (OAP chez l'anurique)", "Albumine non systématique ; pas d'hydroxyéthylamidon")]),
          S("Clampage et reperfusion", [ul("Avant le déclampage : PAM ≥ 80 mmHg, normovolémie ; noradrénaline à faible dose si besoin plutôt que remplissage excessif", "Corticoïdes, mannitol ou furosémide selon le protocole de l'équipe", "Au déclampage : hypotension (vasodilatation, perte sanguine), hyperkaliémie (liquide de conservation) — kaliémie au gaz du sang", "Diurèse immédiate fréquente (donneur vivant) ; retardée si ischémie froide longue")]),
          S("Points critiques", [warn("Hyperkaliémie peropératoire : gluconate de calcium, insuline-glucose, bicarbonates, hyperventilation modérée ; dialyse postopératoire si persistante."), ul("Saignement (anastomoses vasculaires, dysfonction plaquettaire urémique) : desmopressine 0,3 µg/kg en cas de saignement en nappe", "Hypothermie : réchauffement actif (liquides, couverture)")])
        ],
        refs: [REF_BEST, REF_ABP]
      },
      {
        id: "receveur-postop", title: "Receveur : postopératoire immédiat", subtitle: "SSPI et premières 24–48 heures",
        tags: ["Diurèse horaire", "Doppler du greffon", "Retard de fonction"],
        sections: [
          S("Surveillance", [ul("Diurèse horaire, PA, poids, bilan entrées-sorties", "Ionogramme (K⁺, Na⁺), créatinine, glycémie toutes les 4–6 h au début", "Doppler du greffon en SSPI ou à J0 (perméabilité artérielle et veineuse, index de résistance)", "Thrill de la fistule")]),
          S("Compensation de la diurèse", [ul("Polyurie de levée d'obstacle : compensation selon le protocole de néphrologie (souvent volume de l'heure précédente, en solutés adaptés à l'ionogramme)", "Oligo-anurie : vérifier la sonde (caillots), la volémie, la PA ; doppler en urgence"), danger("Anurie brutale après une reprise de diurèse : thrombose artérielle ou veineuse du greffon jusqu'à preuve du contraire — doppler et appel chirurgical immédiats.")]),
          S("Analgésie", [ul("TAP ou bloc du carré des lombes homolatéral", "Paracétamol ; pas d'AINS", "Oxycodone à faible dose ou morphine prudente selon la fonction du greffon ; néfopam à dose réduite")]),
          S("Autres points", [ul("Retard de reprise de fonction : dialyse selon la kaliémie, la surcharge et l'acidose", "Thromboprophylaxie adaptée à la fonction rénale (HNF ou HBPM à dose réduite)", "Prophylaxies anti-infectieuses (cotrimoxazole, valganciclovir) et immunosuppression selon le protocole de greffe", "Taux résiduels de tacrolimus")])
        ],
        refs: [REF_KDIGO]
      },
      {
        id: "donneur-vivant", title: "Donneur vivant : néphrectomie de prélèvement", subtitle: "Néphrectomie par cœlioscopie (trans- ou rétropéritonéale) ou robot",
        tags: ["Sujet sain", "RAAC", "Rein unique"],
        sections: [
          S("Particularités", [ul("Donneur en bonne santé, bilan exhaustif réalisé par l'équipe de greffe", "Objectif : sécurité absolue du donneur et qualité du greffon", "Information éthique et consentement recueillis selon la réglementation")]),
          S("Peropératoire", [ul("AG, cœlioscopie en décubitus latéral (billot, protections)", "Hydratation libérale avant le clampage (maintenir une diurèse > 1 mL/kg/h), normovolémie", "Mannitol, furosémide ou héparine avant le clampage selon le protocole chirurgical", "Prophylaxie des NVPO, normothermie")]),
          S("Antibioprophylaxie", [kv(["Néphrectomie", "Pas d'antibioprophylaxie systématique (RFE 2024), sauf protocole local"])]),
          S("Analgésie", [ul("TAP, bloc du carré des lombes ou ESP ; infiltration des orifices", "Paracétamol ; AINS évités (rein unique)", "Lever et alimentation précoces (RAAC)")]),
          S("Suivi", [ul("Créatinine, PA, protéinurie à distance (suivi à vie du donneur)", "Douleur chronique de cicatrice, hernie")])
        ],
        refs: [REF_ABM, REF_ABP]
      }
    ]
  });

  const GROUP = "Transplantation rénale";
  const uro = window.P17_ANESTH.find(x => x.id === "urologie");
  if (uro) {
    uro.interventions.push(
      { id: "transplantation-renale", group: GROUP, title: "Transplantation rénale : principes", keywords: "greffe rénale insuffisance rénale terminale", ...TR.generalites },
      ...TR.interventions.map(i => ({ ...i, id: "transplantation-" + i.id, group: GROUP, keywords: `transplantation rénale greffe ${i.keywords || ""}` }))
    );
  } else {
    window.P17_ANESTH.push(TR);
  }
})();
