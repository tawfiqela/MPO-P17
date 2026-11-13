/* =====================================================================
   Techniques chirurgicales et temps opératoires, vus par l'anesthésiste.
   Une fiche par spécialité, rangée dans « Principes et techniques ».
   Pour chaque technique : les temps opératoires et ce qu'ils demandent
   à l'anesthésiste.
   ===================================================================== */
(function () {
  const { S } = P17.h;
  const steps = (rows, note) => ({ html: `<ol class="tsteps">${rows.map(([t, a]) =>
    `<li><span class="ts-t">${t}</span><span class="ts-a">${a}</span></li>`).join("")}</ol>${note ? `<p class="tech-voie">${note}</p>` : ""}` });
  const T = (titre, voie, temps) => S(titre, [
    ...(voie ? [{ html: `<p class="tech-voie">${voie}</p>` }] : []),
    steps(temps)
  ], { wide: true });

  const FICHES = {
    visceral: [
      S("Cœlioscopie : ce qui se passe à chaque temps", [steps([
        ["Création du pneumopéritoine (12–15 mmHg)", "Bradycardie vagale, hypotension par baisse du retour veineux ; capnie qui monte : augmenter la ventilation minute"],
        ["Mise en position (Trendelenburg ou proclive)", "Contrôler la sonde (intubation sélective en Trendelenburg), les pressions d'insufflation, les points d'appui"],
        ["Exsufflation", "Retour du CO₂ résorbé : hypercapnie transitoire ; douleur de l'épaule au réveil"]
      ], "Pression d'insufflation à abaisser si l'hémodynamique ou la ventilation se dégradent.")], { wide: true }),
      T("Colectomie, résection rectale", "Cœlioscopie ou laparotomie médiane.", [
        ["Installation, Trendelenburg et roulis", "Points d'appui, sonde gastrique, ventilation protectrice"],
        ["Ligature des vaisseaux mésentériques", "Saignement possible ; analgésie à approfondir"],
        ["Mobilisation de l'angle colique gauche, dissection du rectum", "Temps long ; saignement pelvien pré-sacré possible et brutal"],
        ["Anastomose (agrafeuse circulaire)", "Normovolémie et pression maintenue (perfusion de l'anastomose) ; test d'étanchéité à l'air ou au bleu"],
        ["Fermeture", "Antiémétiques, relais analgésique, décurarisation"]
      ]),
      T("Gastrectomie", "Laparotomie sus-ombilicale ou cœlioscopie.", [
        ["Libération de la grande courbure, curage", "Saignement des vaisseaux courts et de la rate"],
        ["Section duodénale et œsophagienne", "Sonde gastrique retirée ou remontée à la demande du chirurgien"],
        ["Anastomose œso-jéjunale", "Sonde repositionnée sous contrôle chirurgical, jamais à l'aveugle ensuite"]
      ]),
      T("Œsophagectomie (Lewis-Santy)", "Temps abdominal en décubitus dorsal, puis thoracotomie droite en décubitus latéral gauche.", [
        ["Temps abdominal : gastrolyse, tubulisation", "Sonde double lumière ou bloqueur déjà en place"],
        ["Retournement en décubitus latéral", "Vérifier la sonde au fibroscope, points d'appui"],
        ["Temps thoracique : ventilation unipulmonaire gauche", "Hypoxémie possible ; restriction hydrique"],
        ["Anastomose intrathoracique", "Pression et oxygénation maintenues (perfusion de la plastie)"]
      ]),
      T("Duodénopancréatectomie céphalique", "Laparotomie ; intervention longue (5 à 8 h).", [
        ["Décollement duodéno-pancréatique, test de résécabilité", "Exploration : l'intervention peut s'arrêter là"],
        ["Dissection de l'axe mésentérico-porte", "Risque de plaie veineuse et de saignement brutal"],
        ["Section du pancréas, cholécystectomie", "Saignement de la tranche pancréatique"],
        ["Trois anastomoses (pancréatique, biliaire, digestive)", "Temps long : température, glycémie, remplissage restrictif"]
      ]),
      T("Hépatectomie", "Laparotomie sous-costale ou cœlioscopie.", [
        ["Mobilisation du foie", "Compression de la veine cave : hypotension"],
        ["Clampage pédiculaire (Pringle)", "Hausse de la pression ; durée notée, intermittent 15 min / 5 min"],
        ["Section du parenchyme", "PVC basse (< 5 cmH₂O) pour limiter le saignement ; risque d'embolie gazeuse"],
        ["Hémostase, déclampage", "Remplissage pour restaurer la volémie"]
      ]),
      T("Chirurgie de paroi", "Cure de hernie (ouverte ou cœlioscopique), éventration.", [
        ["Réduction du contenu herniaire", "Hernie étranglée : estomac plein, résection intestinale possible"],
        ["Fermeture d'une grande éventration", "Hausse des pressions de ventilation et de la pression abdominale : surveiller le syndrome du compartiment"]
      ])
    ],
    urologie: [
      T("Résection transurétrale de prostate ou de vessie", "Endoscopie en position gynécologique, sous rachianesthésie le plus souvent.", [
        ["Résection à l'anse électrique", "RTUV latérale : réflexe obturateur (adduction brutale) — curarisation ou bloc obturateur"],
        ["Irrigation continue", "Résorption du liquide : syndrome de résection (confusion, hyponatrémie, bradycardie) ; noter les volumes"],
        ["Ouverture capsulaire ou perforation", "Douleur abdominale, hypotension : arrêter, prévenir"]
      ]),
      T("Prostatectomie radicale robot-assistée", "Cœlioscopie robot-assistée, Trendelenburg forcé (25 à 45°).", [
        ["Installation et arrimage du robot", "Plus aucun accès au patient : tout est vérifié avant (voies, sonde, protections)"],
        ["Trendelenburg forcé, pneumopéritoine", "Œdème facial et laryngé, hausse de la pression intraoculaire et intracrânienne, pressions de ventilation élevées"],
        ["Dissection, anastomose urétro-vésicale", "Restriction hydrique jusqu'à l'anastomose, puis compensation"],
        ["Désarrimage", "Remise à plat progressive ; test de fuite avant l'extubation si œdème"]
      ]),
      T("Néphrectomie", "Lombotomie en décubitus latéral, ou cœlioscopie.", [
        ["Installation en décubitus latéral, billot", "Compression de la veine cave, plexus brachial, œil déclive"],
        ["Contrôle du pédicule rénal", "Saignement brutal possible (veine rénale, veine cave)"],
        ["Néphrectomie partielle : clampage de l'artère rénale", "Durée notée ; hydratation, mannitol selon le chirurgien"],
        ["Lombotomie : ouverture de la plèvre", "Pneumothorax : exsufflation en fin d'intervention, radiographie"]
      ]),
      T("Cystectomie avec dérivation", "Laparotomie ou robot ; intervention longue.", [
        ["Exérèse vésicale et curage pelvien", "Saignement pelvien important"],
        ["Dérivation (Bricker, néovessie)", "Pas de diurèse mesurable pendant ce temps"]
      ]),
      T("Néphrolithotomie percutanée", "Décubitus ventral ou dorsal modifié.", [
        ["Ponction des cavités sous fluoroscopie", "Pneumothorax ou hémothorax si ponction haute"],
        ["Dilatation du trajet, fragmentation", "Saignement, résorption du liquide d'irrigation, bactériémie (fièvre, choc)"]
      ])
    ],
    gynecologie: [
      T("Hystérectomie", "Voie basse, cœlioscopie ou laparotomie.", [
        ["Cœlioscopie en Trendelenburg", "Mêmes contraintes que toute cœlioscopie en position déclive"],
        ["Ligature des pédicules utérins", "Saignement ; urètre proche"],
        ["Voie basse", "Position gynécologique : nerfs fibulaires, retour en position lent"]
      ]),
      T("Cytoréduction ovarienne ± CHIP", "Laparotomie xypho-pubienne ; intervention de 6 à 12 h.", [
        ["Péritonectomies, résections digestives", "Saignement et pertes liquidiennes considérables ; ascite évacuée : compenser"],
        ["CHIP (chimiothérapie hyperthermique)", "Hyperthermie (refroidir), hausse de la pression abdominale, troubles hydro-électrolytiques"],
        ["Fin d'intervention", "Souvent réanimation : coagulopathie, hypothermie"]
      ]),
      T("Mastectomie et reconstruction", "Décubitus dorsal, bras en abduction.", [
        ["Mastectomie, curage axillaire", "Abduction du bras inférieure à 90° (plexus brachial)"],
        ["Reconstruction par lambeau libre (DIEP)", "Temps microchirurgical : normothermie, normovolémie, pression maintenue, pas de vasoconstricteur en excès"]
      ])
    ],
    neurochirurgie: [
      T("Craniotomie sus-tentorielle", "Décubitus dorsal ou latéral, têtière à pointes.", [
        ["Pose de la têtière à pointes", "Stimulation intense : approfondir l'anesthésie ou infiltrer"],
        ["Ouverture de la dure-mère", "Cerveau tendu : détente cérébrale (osmothérapie, normocapnie basse, tête surélevée)"],
        ["Exérèse", "Saignement (méningiome) ; stimulation des structures profondes : bradycardie"],
        ["Fermeture", "Réveil calme, sans toux ni hypertension"]
      ]),
      T("Fosse postérieure", "Décubitus ventral ou position assise.", [
        ["Installation en flexion cervicale", "Œdème de la langue, compression jugulaire : deux travers de doigt sous le menton"],
        ["Ouverture des sinus veineux (position assise)", "Embolie gazeuse : EtCO₂, Doppler précordial"],
        ["Dissection près du tronc cérébral", "Bradycardie, arythmies, poussées hypertensives : prévenir le chirurgien"]
      ]),
      T("Anévrisme intracrânien", "Craniotomie ; parfois clampage temporaire.", [
        ["Induction et laryngoscopie", "Éviter toute hausse brutale de pression (risque de resaignement)"],
        ["Clampage temporaire de l'artère porteuse", "Pression artérielle maintenue haute ; protection cérébrale"],
        ["Rupture peropératoire", "Saignement massif : aspiration, clampage, pression contrôlée, adénosine selon l'équipe"]
      ]),
      T("Chirurgie du rachis", "Décubitus ventral.", [
        ["Retournement en décubitus ventral", "Sonde, voies et yeux protégés ; abdomen libre"],
        ["Ostéosynthèse, arthrodèse", "Saignement osseux ; acide tranexamique"],
        ["Potentiels évoqués", "Anesthésie intraveineuse, pas de curare d'entretien"]
      ])
    ],
    traumatologie: [
      T("Prothèse de hanche, fracture du col", "Décubitus latéral ou dorsal.", [
        ["Préparation du fémur, cimentage", "Syndrome d'implantation du ciment : hypoxémie, hypotension, arrêt — FiO₂ augmentée, remplissage, vasopresseur prêt"],
        ["Luxation, réduction", "Stimulation douloureuse"],
        ["Saignement", "Acide tranexamique ; drainage"]
      ]),
      T("Ostéosynthèse et enclouage", "Membre inférieur ou supérieur.", [
        ["Alésage du canal médullaire", "Embolie graisseuse : hypoxémie, hypotension, confusion"],
        ["Garrot", "Hypertension après 60 min ; à la levée : hypotension, hausse de l'EtCO₂ et de la kaliémie ; durée au maximum 2 h"]
      ]),
      T("Polytraumatisé : chirurgie d'hémostase (damage control)", "Laparotomie ou fixation externe en urgence.", [
        ["Ouverture de l'abdomen", "Chute de pression par perte de l'effet de tamponnement : transfusion prête"],
        ["Packing, hémostase rapide", "Transfusion massive, acide tranexamique, calcium, réchauffement"],
        ["Fermeture temporaire", "Réanimation : correction de la triade hypothermie, acidose, coagulopathie"]
      ])
    ],
    thoracique: [
      T("Thoracotomie et résection pulmonaire (lobectomie, pneumonectomie)", "Décubitus latéral, thoracotomie postéro-latérale ou thoracoscopie.", [
        ["Installation en décubitus latéral", "Sonde double lumière vérifiée au fibroscope après le retournement"],
        ["Exclusion pulmonaire", "Hypoxémie possible dans les 20 premières minutes"],
        ["Dissection du hile, ligature des vaisseaux", "Saignement brutal de l'artère pulmonaire ; arythmies"],
        ["Pneumonectomie : clampage de l'artère pulmonaire", "Surcharge du ventricule droit ; restriction hydrique stricte"],
        ["Test d'étanchéité bronchique", "Ventilation manuelle à 20–30 cmH₂O à la demande du chirurgien"],
        ["Réexpansion et drains", "Recrutement doux du poumon exclu ; drains en aspiration, sauf pneumonectomie"]
      ]),
      T("Médiastinoscopie", "Décubitus dorsal, cou en extension.", [
        ["Introduction du médiastinoscope", "Compression du tronc artériel brachiocéphalique : pouls et SpO₂ au bras droit"],
        ["Biopsies", "Plaie vasculaire rare mais grave : sang prêt, voie veineuse au membre inférieur"]
      ])
    ],
    endoscopie: [
      T("FOGD et coloscopie", "Décubitus latéral gauche, sédation.", [
        ["Passage du pharynx (FOGD)", "Stimulation, toux ; apnée sous propofol"],
        ["Insufflation (coloscopie)", "Réflexes vagaux, douleur aux angles coliques"]
      ]),
      T("CPRE", "Décubitus ventral ou latéral.", [
        ["Cathétérisme de la papille, sphinctérotomie", "Douleur, saignement, perforation"],
        ["Insufflation prolongée", "Distension, compression thoracique en décubitus ventral : intubation si risque"]
      ]),
      T("Hémorragie digestive", "Endoscopie en urgence.", [
        ["Avant l'endoscopie", "Estomac plein de sang : intubation en séquence rapide si troubles de conscience ou hématémèse abondante"],
        ["Hémostase endoscopique", "Remplissage et transfusion en parallèle"]
      ])
    ]
  };

  (window.P17_ANESTH || []).forEach(s => {
    const secs = FICHES[s.id]; if (!secs) return;
    s.interventions.unshift({
      id: "techniques-chirurgicales", group: "Principes et techniques", icon: "fiche",
      title: "Techniques chirurgicales et temps opératoires", subtitle: "Ce que chaque temps de l'intervention demande à l'anesthésiste",
      tags: ["Temps opératoires", "Anticiper"],
      sections: secs,
      refs: ["Synthèse du service d'après les ouvrages de référence d'anesthésie par spécialité ; à compléter par les équipes chirurgicales"]
    });
  });
})();
