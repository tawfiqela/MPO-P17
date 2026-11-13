/* Sédation et anesthésie en endoscopie digestive */
(function () {
  const { S, ul, kv, warn, danger, info, tbl } = P17.h;
  const REF_ESA = "Hinkelbein J et al. ESA/ESGE guideline : sedation and anaesthesia in GI endoscopy. Eur J Anaesthesiol 2018";
  const REF_ABP = "RFE SFAR-SPILF 2024 : Antibioprophylaxie en chirurgie et médecine interventionnelle (adulte) — volet endoscopie digestive";
  const REF_SFED = "SFED 2024 : Recommandations sur les critères de qualité en endoscopie digestive";

  window.P17_ANESTH = window.P17_ANESTH || [];
  window.P17_ANESTH.push({
    id: "endoscopie", title: "Sédation en endoscopie digestive", short: "Endoscopie digestive",
    desc: "Sédation au propofol, voies aériennes partagées, endoscopie interventionnelle et hémorragique.",
    generalites: {
      subtitle: "Niveaux de sédation, agents, surveillance et critères de sortie",
      tags: ["Propofol", "Capnographie", "Voies aériennes partagées", "Ambulatoire"],
      sections: [
        S("Niveaux de sédation", [
          tbl(["Niveau", "Réponse", "Ventilation"], [
            ["Sédation légère (anxiolyse)", "Normale à la parole", "Non affectée"],
            ["Sédation modérée", "Réponse adaptée à la parole ou au toucher", "Spontanée, suffisante"],
            ["Sédation profonde", "Réponse à une stimulation répétée ou douloureuse", "Peut devenir insuffisante"],
            ["Anesthésie générale", "Aucune réponse", "Assistance souvent nécessaire"]
          ], "Le passage d'un niveau à l'autre est un continuum : l'équipe doit savoir prendre en charge le niveau supérieur à celui visé.")
        ], { wide: true }),
        S("Évaluation préalable", [
          ul("Consultation d'anesthésie : ASA, voies aériennes, apnées du sommeil, obésité, insuffisance cardiaque ou respiratoire",
            "Jeûne : solides 6 h, liquides clairs 2 h (y compris après la préparation colique)",
            "Risque d'inhalation : achalasie, sténose, gastroparésie, occlusion, hémorragie digestive — intubation",
            "Agonistes du GLP-1 : vidange gastrique ralentie — échographie gastrique ou séquence rapide selon le contexte",
            "Antithrombotiques : selon le risque hémorragique du geste (avis de l'endoscopiste)")
        ]),
        S("Agents et doses", [
          tbl(["Agent", "Dose indicative", "Remarques"], [
            ["Propofol", "Bolus 0,5–1 mg/kg puis 10–20 mg à la demande, ou AIVOC 1,5–3 µg/mL", "Agent de référence ; réduire chez le sujet âgé"],
            ["Sufentanil", "2,5–5 µg", "En complément pour les gestes douloureux"],
            ["Kétamine", "0,25–0,5 mg/kg", "Préserve la ventilation ; utile en association"],
            ["Midazolam", "1–2 mg", "Sédation légère ; prudence chez le sujet âgé"],
            ["Lidocaïne spray", "Pharynx (FOGD)", "Améliore la tolérance de l'intubation œsophagienne"]
          ])
        ], { wide: true }),
        S("Surveillance", [
          ul("SpO₂, ECG, pression non invasive (toutes les 3–5 min)",
            "Capnographie recommandée en sédation profonde : détecte l'apnée avant la désaturation",
            "Oxygène nasal systématique ; oxygénothérapie nasale à haut débit chez les patients à risque d'hypoxémie (obésité, apnées du sommeil, gestes longs)",
            "Matériel de ventilation et d'intubation, aspiration, antagonistes, équipe formée")
        ]),
        S("Complications", [
          ul("Hypoxémie et apnée : stimulation, subluxation, arrêt de l'injection, ventilation au masque, canule de Guedel",
            "Laryngospasme (FOGD) : arrêt du geste, ventilation en pression positive, approfondir, succinylcholine si persistant",
            "Inhalation : position latérale, aspiration, intubation si besoin",
            "Hypotension (propofol, préparation colique) : remplissage, éphédrine")
        ]),
        S("Sortie", [
          ul("Score d'Aldrete ≥ 9 en salle de réveil, puis critères d'aptitude à la rue (PADSS ≥ 9) pour l'ambulatoire",
            "Accompagnant obligatoire, pas de conduite ni de décision importante pendant 24 h",
            "Consignes écrites et numéro à appeler (douleur, fièvre, saignement)")
        ])
      ],
      refs: [REF_ESA, REF_SFED, REF_ABP]
    },
    interventions: [
      {
        id: "fogd-coloscopie", title: "FOGD et coloscopie", subtitle: "Endoscopies diagnostiques et thérapeutiques simples",
        tags: ["Propofol", "Ambulatoire", "Position latérale"],
        sections: [
          S("Technique", [ul("Décubitus latéral gauche ; FOGD : cale-dents, lidocaïne pharyngée", "Propofol titré ± kétamine à faible dose", "Coloscopie : sédation souvent plus légère ; changements de position et compression abdominale fréquents")]),
          S("Antibioprophylaxie", [kv(["Endoscopie diagnostique ou thérapeutique (polypectomie, dilatation…)", "Aucune antibioprophylaxie"])]),
          S("Points de vigilance", [ul("Préparation colique : déshydratation, hypokaliémie chez le sujet âgé", "Stase gastrique, achalasie : intubation en séquence rapide", "Perforation après polypectomie ou dilatation : douleur, distension, emphysème")]),
          S("Sortie", [ul("Ambulatoire selon les critères de sortie", "Reprise alimentaire selon l'endoscopiste")])
        ],
        refs: [REF_ESA, REF_ABP]
      },
      {
        id: "cpre", title: "CPRE (cholangiopancréatographie rétrograde)", subtitle: "Sphinctérotomie, extraction de calculs, prothèses biliaires",
        tags: ["Décubitus ventral", "AG fréquente", "Pancréatite post-CPRE"],
        sections: [
          S("Particularités", [ul("Décubitus ventral ou semi-ventral : accès difficile aux voies aériennes", "Durée variable, gestes douloureux (dilatation papillaire)", "Patients souvent fragiles : angiocholite, sepsis, ictère, sujet âgé")]),
          S("Technique", [ul("Sédation profonde au propofol sous capnographie chez le patient stable", "AG avec intubation si risque d'inhalation (occlusion, sepsis, obésité), geste long, instabilité", "Relaxation duodénale : butylscopolamine (tachycardie) ou glucagon")]),
          S("Antibioprophylaxie", [kv(["Drainage biliaire complet attendu", "Aucune antibioprophylaxie"], ["Drainage incomplet, cholangioscopie, lithotripsie", "Céfoxitine 2 g IV en dose unique"]), info("Angiocholite : antibiothérapie curative (voir Antibiothérapie > Infections intra-abdominales).")]),
          S("Prévention de la pancréatite", [ul("AINS par voie rectale (indométacine ou diclofénac 100 mg) en l'absence de contre-indication", "Hydratation par Ringer lactate", "Prothèse pancréatique selon l'endoscopiste chez les patients à haut risque")]),
          S("Complications", [ul("Perforation (pneumopéritoine, pneumomédiastin) : insufflation au CO₂ préférable", "Hémorragie après sphinctérotomie", "Embolie gazeuse (rare, grave) : collapsus brutal, chute d'EtCO₂")])
        ],
        refs: [REF_ESA, "Dumonceau JM et al. ESGE guideline : ERCP-related adverse events. Endoscopy 2020", REF_ABP]
      },
      {
        id: "echoendoscopie", title: "Écho-endoscopie", subtitle: "Diagnostique, ponctions, drainages et anastomoses guidés",
        tags: ["Sédation profonde", "Ponctions"],
        sections: [
          S("Technique", [ul("Sédation profonde au propofol, décubitus latéral gauche", "Durée plus longue et besoin d'immobilité pour les ponctions", "Intubation pour les gestes interventionnels longs (drainage de collection, anastomose gastro-jéjunale)")]),
          S("Antibioprophylaxie", [kv(["Ponction de lésion kystique avec facteurs de risque, anastomose gastro-jéjunale écho-guidée", "Céfoxitine 2 g IV en dose unique"], ["Autres ponctions", "Aucune antibioprophylaxie en règle"])]),
          S("Complications", [ul("Pancréatite, hémorragie, perforation, infection d'une collection drainée", "Pneumopéritoine après drainage transmural")])
        ],
        refs: [REF_ESA, REF_ABP]
      },
      {
        id: "gastrostomie", title: "Gastrostomie endoscopique (GPE)", subtitle: "Nutrition entérale prolongée",
        tags: ["Patient fragile", "Céfazoline", "Voies aériennes"],
        sections: [
          S("Particularités", [ul("Patients neurologiques (SLA, AVC), cancers ORL (voies aériennes difficiles, sténose), dénutris", "SLA : insuffisance respiratoire restrictive — sédation minimale, VNI pendant le geste si besoin", "Cancer ORL : obstruction possible, intubation difficile — plan des voies aériennes préalable")]),
          S("Technique", [ul("Sédation légère à modérée (propofol à faibles doses, kétamine), anesthésie locale pariétale", "Position demi-assise si risque d'inhalation")]),
          S("Antibioprophylaxie", [kv(["Molécule", "Céfazoline 2 g IV en dose unique"], ["Allergie", "Clindamycine 900 mg IV"])]),
          S("Postopératoire", [ul("Douleur pariétale : paracétamol", "Infection de l'orifice, péritonite (fuite), hémorragie")])
        ],
        refs: [REF_ABP, REF_ESA]
      },
      {
        id: "hemorragie-digestive", title: "Hémorragie digestive : endoscopie en urgence", subtitle: "Ulcère, varices œsophagiennes, autres causes",
        tags: ["Estomac plein", "Transfusion restrictive", "Cirrhose"],
        sections: [
          S("Réanimation initiale", [ul("Deux voies veineuses de bon calibre, groupe et RAI", "Transfusion restrictive : Hb cible 7–8 g/dL (8–9 g/dL si coronaropathie)", "Hémorragie ulcéreuse : IPP IV forte dose avant l'endoscopie", "Hypertension portale : terlipressine (ou somatostatine) dès la suspicion, sans attendre l'endoscopie"), warn("L'acide tranexamique n'est pas recommandé dans l'hémorragie digestive (essai HALT-IT).")]),
          S("Préparation de l'estomac", [ul("Érythromycine 250 mg IV 30–120 min avant l'endoscopie (vidange gastrique), en l'absence d'allongement du QT")]),
          S("Protection des voies aériennes", [ul("Intubation en séquence rapide si hématémèse massive, troubles de conscience, encéphalopathie, agitation ou instabilité", "Induction préservant l'hémodynamique : kétamine ou étomidate, rocuronium ou succinylcholine", "Aspiration de gros calibre prête ; sonde gastrique avant l'induction à discuter"), danger("Pas de sédation profonde sans intubation en cas d'hémorragie haute abondante.")]),
          S("Antibioprophylaxie (cirrhose)", [kv(["Hémorragie variqueuse", "Ciprofloxacine 400 mg IV ×2/j puis per os, 7 jours"], ["Cirrhose avancée, hospitalisation prolongée ou prophylaxie par quinolone en cours", "Ceftriaxone 1 g/24 h IV"])]),
          S("Après l'endoscopie", [ul("Surveillance en soins continus ou réanimation", "Récidive hémorragique : nouvelle endoscopie, embolisation radiologique ou chirurgie", "Cirrhose : prévention de l'encéphalopathie, discussion d'un TIPS précoce")])
        ],
        refs: ["Gralnek IM et al. ESGE guideline : nonvariceal upper GI hemorrhage. Endoscopy 2021", "de Franchis R et al. Baveno VII : renewing consensus in portal hypertension. J Hepatol 2022", REF_ABP]
      },
      {
        id: "dissection-sous-muqueuse", title: "Dissection sous-muqueuse et endoscopie interventionnelle longue", subtitle: "ESD, POEM, mucosectomies étendues",
        tags: ["AG", "Insufflation CO₂", "Pneumopéritoine"],
        sections: [
          S("Technique", [ul("Gestes longs (1–4 h) exigeant l'immobilité : AG avec intubation pour l'œsophage et l'estomac ; sédation profonde possible pour le côlon", "Insufflation au CO₂ (résorption plus rapide), surveillance de l'EtCO₂", "POEM (myotomie de l'achalasie) : risque majeur d'inhalation — aspiration œsophagienne préalable, séquence rapide")]),
          S("Antibioprophylaxie", [kv(["Endoscopie thérapeutique", "Aucune en règle ; selon l'endoscopiste pour la POEM (protocole local)"])]),
          S("Complications", [ul("Pneumopéritoine sous tension : distension, hausse des pressions de ventilation, hypotension — exsufflation à l'aiguille", "Pneumomédiastin, emphysème sous-cutané, pneumothorax (œsophage)", "Hémorragie différée", "Perforation : traitement endoscopique (clips) ou chirurgical")]),
          S("Postopératoire", [ul("Douleur : paracétamol, néfopam ; morphine titrée si besoin", "Hospitalisation courte avec reprise alimentaire progressive")])
        ],
        refs: [REF_ESA, REF_ABP]
      }
    ]
  });
})();
