/* =====================================================================
   Neurochirurgie pédiatrique : nouveau-né, nourrisson et jeune enfant.
   Fiches ajoutées à la spécialité « Neurochirurgie », groupe dédié,
   avec un outil de doses et de matériel selon l'âge et le poids.
   ===================================================================== */
(function () {
  const { S, ul, kv, warn, danger, info, tbl } = P17.h;
  const neuro = (window.P17_ANESTH || []).find(x => x.id === "neurochirurgie");
  if (!neuro) return;
  const f = P17.fmt;
  const G = "Neurochirurgie pédiatrique";
  const REF_JEUNE = "Frykholm P et al. Pre-operative fasting in children: a guideline from the European Society of Anaesthesiology and Intensive Care. Eur J Anaesthesiol 2022";
  const REF_TRANSF = "Valentine SL et al. Consensus recommendations for RBC transfusion practice in critically ill children from the Pediatric Critical Care Transfusion and Anemia Expertise Initiative. Pediatr Crit Care Med 2018";
  const REF_LIQ = "Sümpelmann R et al. Perioperative intravenous fluid therapy in children: guidelines from the Association of the Scientific Medical Societies in Germany. Paediatr Anaesth 2017";
  const REF_CRANIO = "Goobie SM et al. Tranexamic acid and perioperative bleeding in children: what do we still need to know? Curr Opin Anaesthesiol 2019";
  const REF_SFAR = "SFAR-ADARPEF : recommandations sur l'anesthésie de l'enfant (jeûne, voies aériennes, analgésie postopératoire)";
  const ABP = kv(["Molécule", "Céfazoline 30 mg/kg IV (max 2 g) dans les 60 min avant l'incision"], ["Réinjection", "15 mg/kg si durée > 4 h"], ["Allergie", "Clindamycine 10 mg/kg IV (max 900 mg)"]);

  /* ---------------- Outil : doses et matériel selon l'âge et le poids ---------------- */
  const pedTool = P17.calc({
    id: "pedNeuro", kind: "tool", title: "Doses et matériel selon l'âge et le poids",
    desc: "Valeurs d'induction et d'entretien usuelles ; titrer selon la clinique.",
    fields: [
      { id: "age", label: "Âge", unit: "mois", placeholder: "ex. 8" },
      { id: "poids", label: "Poids", unit: "kg", placeholder: "ex. 8" },
      { id: "hb", label: "Hb initiale (facultatif)", unit: "g/dL", placeholder: "ex. 11" }
    ],
    compute(v) {
      const P = v.poids, A = v.age;
      if (!P || P <= 0 || A === null || A < 0) return null;
      const ans = A / 12;
      const di = A < 8 ? 3.0 : A < 24 ? 3.5 : Math.round((ans / 4 + 3.5) * 2) / 2;
      const vsm = A < 1 ? 85 : A < 12 ? 80 : 75;   // volume sanguin (mL/kg)
      const vst = P * vsm;
      const ent = P <= 10 ? 4 * P : P <= 20 ? 40 + 2 * (P - 10) : 60 + (P - 20);
      const para = P < 10 ? 7.5 : 15;
      const pasMin = A < 12 ? "≈ 60–70 mmHg" : `≈ ${f(70 + 2 * Math.min(ans, 10), 0)} mmHg`;
      const rows = [
        ["Sonde à ballonnet (diamètre interne)", `${f(di, 1)} ; prévoir ${f(di - 0.5, 1)} et ${f(di + 0.5, 1)}`],
        ["Profondeur orale (repère)", `≈ ${f(3 * di, 0)} cm à la commissure, à vérifier à l'auscultation`],
        ["Volume sanguin total", `≈ ${f(vst, 0)} mL (${vsm} mL/kg)`],
        ["Entretien horaire (4-2-1)", `${f(ent, 0)} mL/h de soluté isotonique glucosé à 1–2,5 %`],
        ["PAS minimale à maintenir", pasMin],
        ["Atropine", `${f(20 * P, 0)} µg (20 µg/kg)`],
        ["Propofol (induction)", `${f(3 * P, 0)} à ${f(4 * P, 0)} mg (3–4 mg/kg ; plus chez le nourrisson)`],
        ["Sufentanil", `${f(0.1 * P, 1)} à ${f(0.3 * P, 1)} µg (0,1–0,3 µg/kg)`],
        ["Rocuronium", `${f(0.6 * P, 1)} mg (0,6 mg/kg) ; ${f(1.2 * P, 1)} mg en séquence rapide`],
        ["Acide tranexamique", `Charge ${f(10 * P, 0)} mg (10 mg/kg) puis ${f(5 * P, 0)} mg/h (5 mg/kg/h), selon le protocole`],
        ["Paracétamol IV", `${f(para * P, 0)} mg toutes les 6 h (${f(para, para % 1 ? 1 : 0)} mg/kg ; max ${P < 10 ? 30 : 60} mg/kg/j)`],
        ["Morphine (titration, > 3 mois)", `${f(0.025 * P, 2)} à ${f(0.05 * P, 2)} mg par bolus (25–50 µg/kg)`],
        ["Ondansétron (> 1 mois)", `${f(Math.min(0.1 * P, 4), 1)} mg (0,1 mg/kg, max 4 mg)`],
        ["Dexaméthasone", `${f(Math.min(0.15 * P, 5), 1)} mg (0,15 mg/kg, max 5 mg), si accord du neurochirurgien`],
        ["Culot globulaire", `${f(4 * P, 0)} mL par g/dL d'Hb à remonter (≈ 4 mL/kg)`],
        ["Plasma, plaquettes", `${f(10 * P, 0)} à ${f(15 * P, 0)} mL (10–15 mL/kg)`],
        ["Fibrinogène", `${f(30 * P, 0)} à ${f(50 * P, 0)} mg (30–50 mg/kg)`]
      ];
      if (v.hb) {
        const perte = vst * (v.hb - 7) / ((v.hb + 7) / 2);
        if (perte > 0) rows.splice(3, 0, ["Pertes admissibles jusqu'à Hb 7 g/dL", `≈ ${f(perte, 0)} mL`]);
      }
      return { label: "Repères pour ce patient", main: `${f(P, 1)} kg · ${A < 24 ? `${f(A, 0)} mois` : `${f(ans, 1)} ans`}`, rows };
    },
    note: "<p>Sonde : 3,0 avant 8 mois, 3,5 de 8 mois à 2 ans, puis âge/4 + 3,5 (sonde à ballonnet, pression ≤ 20 cmH₂O). Atropine sans dose minimale. Le nouveau-né et le prématuré relèvent d'un avis senior systématique.</p>"
  });

  const FICHES = [
    {
      id: "pediatrie-principes", group: G, icon: "tool", title: "Neuro-anesthésie de l'enfant et du nourrisson",
      subtitle: "Principes communs chez le nouveau-né, le nourrisson et le jeune enfant",
      tags: ["Nourrisson", "Volume sanguin", "Hypothermie", "Jeûne"],
      tool: pedTool, toolLabel: "Outil de calcul",
      sections: [
        S("Particularités", [
          tbl(["Particularité", "Conséquence pratique"], [
            ["Débit cardiaque dépendant de la fréquence", "La bradycardie est mal tolérée : traiter tôt (hypoxie, réflexe vagal, atropine)"],
            ["Volume sanguin faible (80–90 mL/kg chez le nouveau-né, 75–80 chez le nourrisson)", "Une perte de quelques dizaines de millilitres est significative : mesurer les pertes, transfuser tôt"],
            ["Fontanelle ouverte et sutures non soudées (jusqu'à 12–18 mois)", "L'HTIC s'installe plus lentement : bombement de la fontanelle, macrocrânie, vomissements ; décompensation brutale ensuite"],
            ["Autorégulation cérébrale à pression plus basse", "Hypotension mal tolérée : maintenir la pression adaptée à l'âge"],
            ["Grande surface cutanée, peu de graisse", "Hypothermie rapide : salle chauffée, couverture chauffante, réchauffeur de solutés, tête couverte"],
            ["Réserves en glycogène faibles", "Hypoglycémie : soluté d'entretien glucosé, glycémie horaire chez le nourrisson"],
            ["Capacité résiduelle fonctionnelle basse, consommation d'O₂ élevée", "Désaturation très rapide à l'apnée"]
          ])
        ], { wide: true }),
        S("Préopératoire", [
          kv(["Jeûne", "Liquides clairs jusqu'à 1 h avant l'induction ; lait maternel 3 h ; lait infantile ou non humain 4 h ; repas léger 6 h"],
            ["Évaluation", "Terme et âge corrigé (prématurité : apnées postopératoires), malformations associées, signes d'HTIC, état d'hydratation (vomissements), infection respiratoire récente"],
            ["Bilan", "Hb, hémostase et groupe-RAI selon la chirurgie ; ionogramme si vomissements ou dérivation"],
            ["Prémédication", "Midazolam 0,3 mg/kg par voie orale (max 15 mg) si anxiété, hors HTIC ; crème anesthésiante pour la ponction veineuse"],
            ["Parents", "Présence à l'induction si possible ; information sur l'anesthésie, la transfusion et la surveillance"])
        ]),
        S("Installation", [
          ul("Table chauffante, tête sur têtière adaptée (têtière à pointes rarement avant 2–3 ans : crâne trop fin)",
            "Protection des yeux, des points d'appui ; décubitus ventral sur billots laissant l'abdomen libre",
            "Accès vasculaires : deux voies veineuses de calibre suffisant ; cathéter artériel si saignement attendu ou chirurgie longue ; voie centrale pour les craniosténoses étendues")
        ]),
        S("Antibioprophylaxie", [ABP]),
        S("Induction et entretien", [
          ul("Induction inhalatoire au sévoflurane chez l'enfant sans voie veineuse et sans HTIC ; induction intraveineuse si HTIC ou estomac plein",
            "Intubation par sonde à ballonnet, fixation soigneuse (accès limité sous les champs) ; vérifier la position après chaque mobilisation de la tête",
            "Entretien : sévoflurane < 1 CAM ou propofol, sufentanil ; pas de protoxyde d'azote",
            "Ventilation : normocapnie (EtCO₂ 35–40 mmHg), Vt 6–8 mL/kg, PEP 5 cmH₂O",
            "Solutés : isotoniques balancés ; entretien glucosé à 1–2,5 % ; pas de soluté hypotonique (hyponatrémie, œdème cérébral)")
        ]),
        S("Monitorage", [
          ul("Scope, SpO₂, capnographie, pression non invasive au brassard adapté, température centrale systématique",
            "Cathéter artériel selon la chirurgie ; glycémie et hémoglobine répétées ; diurèse si chirurgie longue",
            "Mesure des pertes : pesée des compresses, aspirations, champs")
        ]),
        S("Complications", [
          ul("Hémorragie : estimation des pertes admissibles, transfusion précoce (seuil 7 g/dL chez l'enfant stable, plus haut si saignement actif ou instabilité)",
            "Embolie gazeuse : chute d'EtCO₂ et hypotension, surtout tête surélevée",
            "Hypothermie, hypoglycémie, hyperkaliémie transfusionnelle (culots frais, débit contrôlé)",
            "Laryngospasme et bronchospasme à l'induction ou au réveil"),
          danger("Bradycardie chez le nourrisson : hypoxie jusqu'à preuve du contraire. Oxygène pur, atropine 20 µg/kg, massage si FC < 60/min malgré une ventilation efficace.")
        ]),
        S("Réveil", [
          ul("Extubation réveillé, réflexes présents, normothermie et décurarisation complète",
            "Réveil calme ; examen neurologique adapté à l'âge (éveil, motricité, fontanelle, pupilles)",
            "Ancien prématuré de moins de 60 semaines d'âge post-conceptionnel : surveillance des apnées pendant au moins 12 à 24 heures")
        ]),
        S("Analgésie postopératoire", [
          ul("Paracétamol systématique ; infiltration du site ou bloc du scalp chez le grand enfant",
            "Morphine titrée chez le nourrisson de plus de 3 mois, sous surveillance scopée ; nalbuphine 0,2 mg/kg pour les douleurs modérées",
            "Évaluation par une échelle adaptée à l'âge (EVENDOL, FLACC) ; prophylaxie des NVPO (ondansétron, dexaméthasone si accord du neurochirurgien)")
        ]),
        S("Postopératoire", [
          ul("Réanimation ou soins continus pédiatriques après chirurgie majeure, chez le nourrisson et l'ancien prématuré",
            "Natrémie (SIADH, diabète insipide, perte de sel), Hb, glycémie",
            "Surveillance neurologique horaire les premières heures")
        ])
      ],
      refs: [REF_JEUNE, REF_LIQ, REF_TRANSF, REF_SFAR]
    },
    {
      id: "craniostenoses", group: G, title: "Craniosténoses", subtitle: "Remodelage de la voûte crânienne chez le nourrisson (3 à 12 mois)",
      tags: ["Saignement majeur", "Acide tranexamique", "Embolie gazeuse"],
      sections: [
        S("Particularités", [ul("Fermeture prématurée d'une ou plusieurs sutures ; formes syndromiques (Crouzon, Apert) : intubation difficile possible (hypoplasie de l'étage moyen), HTIC, apnées obstructives",
          "Pertes sanguines fréquemment égales à une ou plusieurs masses sanguines, surtout pendant le décollement et les ostéotomies")]),
        S("Préopératoire", [ul("Hb (traiter une carence martiale avant), hémostase, groupe-RAI ; culots, plasma et fibrinogène réservés et disponibles en salle", "Consultation conjointe avec les parents : transfusion très probable")]),
        S("Installation", [ul("Décubitus dorsal ou ventral (sphinx) selon la suture : risque d'embolie gazeuse et de compression oculaire", "Deux voies veineuses de bon calibre, cathéter artériel, voie centrale si possible, sonde urinaire, sonde thermique")]),
        S("Antibioprophylaxie", [ABP]),
        S("Saignement", [
          ul("Acide tranexamique dès l'induction : charge puis entretien jusqu'à la fermeture (schéma faible dose fréquent : 10 mg/kg puis 5 mg/kg/h)",
            "Compensation volume à volume des pertes mesurées ; transfusion anticipée plutôt que tardive",
            "Gaz du sang, Hb, calcium ionisé, lactate, kaliémie et glycémie toutes les 30 à 60 minutes ; hémostase ou test viscoélastique si saignement important",
            "Plasma 10–15 mL/kg et fibrinogène 30–50 mg/kg si les pertes dépassent une masse sanguine ou si le fibrinogène < 1,5 g/L ; calcium si hypocalcémie"),
          danger("Embolie gazeuse (sinus veineux ouverts, tête surélevée) : chute d'EtCO₂, hypotension. Prévenir le chirurgien, inonder le champ, abaisser la tête, oxygène pur, remplissage.")
        ], { tone: "alert" }),
        S("Postopératoire", [ul("Réanimation pédiatrique : saignement postopératoire par les drains (Hb à H6 et J1), natrémie (SIADH ou perte de sel), œdème facial et palpébral", "Analgésie : paracétamol, morphine titrée", "Fièvre fréquente les premiers jours")])
      ],
      refs: [REF_CRANIO, REF_TRANSF, REF_SFAR]
    },
    {
      id: "hydrocephalie-enfant", group: G, title: "Hydrocéphalie de l'enfant : dérivations et ventriculocisternostomie", subtitle: "Pose ou révision de dérivation ventriculo-péritonéale, ventriculocisternostomie endoscopique",
      tags: ["HTIC", "Estomac plein", "Révision de valve"],
      sections: [
        S("Préopératoire", [ul("Signes d'HTIC : fontanelle bombée, regard en coucher de soleil, vomissements, somnolence, bradycardie : chirurgie urgente", "Vomissements : déshydratation et troubles ioniques à corriger ; considérer l'estomac comme plein", "Révision de valve : nombreux antécédents d'anesthésie, allergie au latex à rechercher (spina bifida)")]),
        S("Induction et entretien", [ul("HTIC : induction intraveineuse rapide, éviter la toux et l'hypercapnie ; sévoflurane possible si l'HTIC est modérée", "Normocapnie, PAM adaptée à l'âge", "Tunnelisation sous-cutanée très stimulante : approfondir l'anesthésie")]),
        S("Antibioprophylaxie", [ABP]),
        S("Complications", [ul("Bradycardie et hypertension pendant la ventriculocisternostomie (irrigation, stimulation du plancher du 3e ventricule) : prévenir le neurochirurgien, arrêter l'irrigation", "Hémorragie intraventriculaire, hypothermie par l'irrigation", "Collapsus ventriculaire ou hématome sous-dural si drainage trop rapide")]),
        S("Postopératoire", [ul("Réveil rapide pour l'examen neurologique", "Surveillance des signes de dysfonction de valve : vomissements, somnolence, céphalées, fontanelle tendue", "Antalgie simple ; douleur abdominale fréquente après DVP")])
      ],
      refs: [REF_SFAR, REF_JEUNE]
    },
    {
      id: "fosse-posterieure-enfant", group: G, title: "Tumeurs de la fosse postérieure de l'enfant", subtitle: "Médulloblastome, épendymome, astrocytome pilocytique",
      tags: ["Décubitus ventral", "Tronc cérébral", "Embolie gazeuse"],
      sections: [
        S("Préopératoire", [ul("HTIC par hydrocéphalie obstructive : dérivation ventriculaire externe ou ventriculocisternostomie souvent faite avant l'exérèse", "Vomissements répétés : déshydratation, hypokaliémie ; troubles de déglutition (nerfs mixtes)", "Corticothérapie en cours (dexaméthasone) : glycémie")]),
        S("Installation", [ul("Décubitus ventral, tête fléchie : sonde armée, ballonnet vérifié, deux travers de doigt entre le menton et le sternum (œdème de la langue, compression jugulaire)", "Yeux libres de toute compression, abdomen libre", "Cathéter artériel, deux voies veineuses, sonde urinaire, sonde thermique")]),
        S("Antibioprophylaxie", [ABP]),
        S("Complications", [ul("Bradycardie, arythmies, poussées hypertensives lors de la dissection du plancher du 4e ventricule et du tronc cérébral : prévenir le chirurgien", "Embolie gazeuse (sinus), saignement", "Hypothermie dans les interventions longues"),
          warn("Une modification brutale du rythme ou de la pression signale une souffrance du tronc cérébral : le chirurgien doit être informé immédiatement.")]),
        S("Réveil", [ul("Extubation différée si atteinte des nerfs mixtes, œdème lingual ou intervention longue et difficile", "Mutisme cérébelleux (24–72 h après) : troubles de la parole, de la déglutition et irritabilité ; protection des voies aériennes", "Surveillance en réanimation pédiatrique : natrémie, conscience, fonction de la DVE")])
      ],
      refs: [REF_SFAR, REF_TRANSF]
    },
    {
      id: "myelomeningocele", group: G, title: "Myéloméningocèle et dysraphismes", subtitle: "Fermeture néonatale, détachement de moelle chez l'enfant",
      tags: ["Nouveau-né", "Latex", "Chiari II"],
      sections: [
        S("Particularités", [ul("Fermeture dans les 24 à 72 premières heures de vie (risque infectieux) ; hydrocéphalie associée fréquente", "Malformation de Chiari II : stridor, apnées, troubles de déglutition (atteinte des nerfs mixtes)", "Allergie au latex très fréquente : environnement sans latex dès la naissance")]),
        S("Préopératoire", [ul("Sac protégé par un pansement humide stérile ; décubitus ventral", "Température, glycémie, volémie (pertes par le sac)", "Malformations associées : cardiaques, urinaires, orthopédiques")]),
        S("Induction et entretien", [ul("Intubation en décubitus latéral, ou dorsal avec le sac protégé dans un anneau ; vidéolaryngoscope et matériel néonatal prêts", "Décubitus ventral ensuite ; sévoflurane ou propofol, morphinique à dose réduite (sensibilité aux apnées)", "Salle à 26–28 °C, couverture chauffante, solutés réchauffés ; glycémie horaire")]),
        S("Antibioprophylaxie", [ABP]),
        S("Réveil", [ul("Extubation réveillé ; surveillance prolongée des apnées (Chiari II, morphiniques)", "Réanimation néonatale : surveillance du périmètre crânien et de la fontanelle (hydrocéphalie après fermeture)")])
      ],
      refs: [REF_SFAR, REF_JEUNE]
    }
  ];

  neuro.interventions.push(...FICHES);
})();
