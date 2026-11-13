/* =====================================================================
   Urgences au bloc : aides cognitives accessibles depuis une bulle
   présente sur toutes les pages. Une page par situation, même format :
   reconnaître, agir (étapes numérotées), doses, ensuite.
   ===================================================================== */
(function () {
  const { S, ul, kv, tbl, warn, danger, info } = P17.h;
  const F = window.P17Calc;
  const f = P17.fmt;
  const SEC = "Urgences au bloc";
  const ROOT = "#/urgences";
  const r0 = x => f(Math.round(x), 0);

  // Étapes numérotées, lisibles d'un coup d'œil
  const steps = (...items) => ({ html: `<ol class="crisis">${items.map(([t, d]) => `<li><b>${t}</b>${d ? `<span>${d}</span>` : ""}</li>`).join("")}</ol>` });
  // Outil « doses selon le poids »
  const doses = (id, rows, extra = [], note = "") => P17.calc({
    id, kind: "tool", title: "Doses selon le poids", desc: "Saisir le poids : les doses s'affichent",
    fields: [{ id: "poids", label: "Poids", unit: "kg", placeholder: "ex. 70" }, ...extra],
    compute: v => {
      if (!v.poids || v.poids <= 0) return null;
      return { html: `<dl class="out-rows out-rows--doses">${rows(v.poids, v).map(([k, val]) => `<div><dt>${k}</dt><dd>${val}</dd></div>`).join("")}</dl>` };
    },
    note
  });

  const REF_ERC = "Lott C et al. European Resuscitation Council Guidelines 2021: cardiac arrest in special circumstances. Resuscitation 2021";

  /* ------------------------------------------------------------------ */
  const URG = [
    {
      id: "anaphylaxie", title: "Anaphylaxie peropératoire", court: "Anaphylaxie", hint: "Adrénaline titrée selon le grade, remplissage",
      tool: doses("urgAna", (P, v) => [
        ["Adrénaline IV, bolus toutes les 1–2 min", v.grade === "2" ? "10–20 µg" : v.grade === "3" ? "100–200 µg" : "1 mg + massage cardiaque"],
        ["Dilution", "1 mg dans 10 mL = 100 µg/mL ; 1 mL de cette solution dans 10 mL = 10 µg/mL"],
        ["Remplissage, cristalloïdes", `${r0(20 * P)} à ${r0(30 * P)} mL (20–30 mL/kg)`],
        ["Adrénaline en continu (1 mg dans 50 mL)", `${f(F.debitPSE(0.05, P, 20), 1)} à ${f(F.debitPSE(0.1, P, 20), 1)} mL/h (0,05–0,1 µg/kg/min)`],
        ["Sans voie veineuse", "Adrénaline IM 0,5 mg, face externe de la cuisse"]
      ], [{ id: "grade", label: "Grade", type: "seg", options: [["2", "II"], ["3", "III"], ["4", "IV"]], value: "3" }]),
      fiche: {
        subtitle: "Collapsus, bronchospasme ou signes cutanés dans les minutes qui suivent une injection",
        tags: ["Adrénaline", "Remplissage", "Tryptase"],
        sections: [
          S("Reconnaître : grades de Ring et Messmer", [tbl(["Grade", "Signes", "Adrénaline"], [
            ["I", "Signes cutanéomuqueux isolés : érythème, urticaire, œdème", "Non"],
            ["II", "Atteinte multiviscérale modérée : hypotension, tachycardie, toux, dyspnée", "Bolus de 10–20 µg"],
            ["III", "Atteinte sévère : collapsus, troubles du rythme, bronchospasme", "Bolus de 100–200 µg"],
            ["IV", "Arrêt circulatoire", "1 mg et réanimation de l'arrêt cardiaque"]
          ], "Les signes cutanés peuvent manquer. Une hypotension avec chute de l'EtCO₂ et tachycardie inexpliquées doit faire évoquer le diagnostic.")], { wide: true }),
          S("Agir immédiatement", [steps(
            ["Arrêter l'allergène suspecté, appeler à l'aide", "Curare, antibiotique, latex, chlorhexidine, colorant, colloïde ; prévenir le chirurgien pour abréger ou interrompre le geste"],
            ["Oxygène 100 %, contrôle des voies aériennes", "Alléger l'anesthésie si collapsus, surélever les jambes"],
            ["Adrénaline IV titrée selon le grade", "À répéter toutes les 1 à 2 minutes ; relais en continu si les bolus se répètent"],
            ["Remplissage rapide par cristalloïdes", "20 à 30 mL/kg, à renouveler selon la réponse"],
            ["Bronchospasme", "Salbutamol inhalé dans le circuit ; si sévère, adrénaline et salbutamol IV"]
          )], { wide: true, tone: "alert" }),
          S("Si le choc persiste après 10 minutes", [ul("Noradrénaline à partir de 0,1 µg/kg/min", "Patient sous bêtabloquant : glucagon 1 à 2 mg IV toutes les 5 minutes", "Bleu de méthylène 1,5 à 3 mg/kg en cas de vasoplégie réfractaire", "Rocuronium suspecté : sugammadex discuté au cas par cas", "Assistance circulatoire si elle est disponible")]),
          S("Ensuite", [ul("Tryptase 30 minutes à 2 heures après le début, puis tryptase de base après 24 heures ; histamine dans les 30 premières minutes si le dosage est disponible",
            "Hydrocortisone 200 mg IV : prévention de la rechute, pas un traitement d'urgence",
            "Surveillance en soins continus pendant 24 heures à partir du grade II",
            "Consigner les produits et les horaires ; consultation d'allergo-anesthésie 4 à 6 semaines plus tard ; information écrite du patient ; déclaration de pharmacovigilance")])
        ],
        refs: ["RFE SFAR-SFA 2011 : Prévention du risque allergique peranesthésique", "Garvey LH et al. Management of suspected immediate perioperative allergic reactions: an international overview and consensus recommendations. Br J Anaesth 2019"]
      }
    },
    {
      id: "hyperthermie-maligne", title: "Hyperthermie maligne", court: "Hyperthermie maligne", hint: "Arrêt des halogénés, dantrolène 2,5 mg/kg",
      tool: doses("urgHM", P => {
        const d = F.dantrolene(P);
        return [["Dantrolène, premier bolus (2,5 mg/kg)", `${r0(d.dose)} mg = ${d.flacons} flacons de 20 mg`],
          ["Eau stérile pour reconstituer", `${d.eau} mL (60 mL par flacon)`],
          ["Bolus suivants", `${r0(d.dose)} mg toutes les 5 à 10 min jusqu'au contrôle des signes`],
          ["Dose cumulée de 10 mg/kg", `${r0(d.max)} mg (${d.flaconsMax} flacons) : au-delà, remettre en cause le diagnostic`]];
      }, [], "Dantrolène : flacon de 20 mg à dissoudre dans 60 mL d'eau pour préparation injectable. Mobiliser plusieurs personnes pour la préparation."),
      fiche: {
        subtitle: "Crise hypermétabolique déclenchée par les halogénés ou la succinylcholine",
        tags: ["Dantrolène", "EtCO₂ qui monte", "Refroidir"],
        sections: [
          S("Reconnaître", [ul("Hausse inexpliquée de l'EtCO₂ malgré l'augmentation de la ventilation : signe le plus précoce", "Tachycardie, troubles du rythme, rigidité musculaire (spasme des masséters après succinylcholine)", "Hyperthermie rapide mais souvent tardive", "Acidose mixte, hyperkaliémie, rhabdomyolyse avec urines foncées")]),
          S("Agir immédiatement", [steps(
            ["Arrêter les halogénés, appeler à l'aide", "Demander le dantrolène ; prévenir le chirurgien pour terminer ou interrompre"],
            ["Hyperventiler en oxygène pur à haut débit", "Débit de gaz frais supérieur à 10 L/min ; relais par anesthésie intraveineuse (propofol)"],
            ["Dantrolène 2,5 mg/kg IV", "À répéter jusqu'à la baisse de l'EtCO₂, de la fréquence cardiaque et de la température"],
            ["Refroidir", "Sérum salé froid IV, glace sur les axes vasculaires, lavages ; arrêt du refroidissement sous 38,5 °C"],
            ["Traiter les conséquences", "Hyperkaliémie (calcium, insuline et glucose), acidose (bicarbonate si pH < 7,2), troubles du rythme (amiodarone ; jamais d'inhibiteur calcique), diurèse supérieure à 2 mL/kg/h"]
          )], { wide: true, tone: "alert" }),
          S("Surveiller", [ul("Température centrale, capnie, gaz du sang, kaliémie, CPK, myoglobine, hémostase (risque de CIVD)", "Réanimation pendant 24 à 48 heures : une récidive survient dans environ un quart des cas, et fait reprendre le dantrolène")]),
          S("Ensuite", [ul("Information du patient et de sa famille, document écrit", "Adresser à un centre de référence : tests de contracture sur biopsie musculaire, génétique", "Anesthésies ultérieures sans halogéné ni succinylcholine, sur une machine préparée")])
        ],
        refs: ["Hopkins PM et al. Malignant hyperthermia 2020: guideline from the Association of Anaesthetists. Anaesthesia 2021", "Glahn KPE et al. Recognizing and managing a malignant hyperthermia crisis: guidelines from the European Malignant Hyperthermia Group. Br J Anaesth 2010", "RFE SFAR 2013 : Prise en charge de l'hyperthermie maligne"]
      }
    },
    {
      id: "intubation-difficile", title: "Intubation difficile imprévue", court: "Intubation difficile imprévue", hint: "Oxygéner avant tout, deux essais, dispositif supraglottique, cricothyrotomie",
      fiche: {
        subtitle: "La priorité est l'oxygénation, pas l'intubation",
        tags: ["Appel à l'aide", "2 essais", "Cricothyrotomie"],
        sections: [
          S("Arbre décisionnel", [{ html: `
            <div class="flow">
              <div class="fl-step fl-start"><span class="fl-num">${P17.warnIcon || ""}</span><div><b>Échec de l'intubation</b><span>Appel à l'aide, chariot d'intubation difficile, oxygène pur ; maintenir une anesthésie et une curarisation profondes</span></div></div>
              <div class="fl-arrow"></div>
              <div class="fl-q"><b><span class="fl-num">?</span>La ventilation au masque est-elle possible ?</b><span>Canule oropharyngée, ventilation à quatre mains ; juger sur la capnographie et la SpO₂</span></div>
              <div class="fl-split fl-split--even">
                <section class="fl-branch fl-no">
                  <header>OUI<span>Le patient est oxygéné : on a le temps</span></header>
                  <div class="fl-body">
                    <div class="fl-act"><h4>Deux essais optimisés au maximum</h4><ul><li>Position amendée, pression laryngée externe</li><li>Mandrin long béquillé, vidéolaryngoscope</li><li>Oxygéner entre chaque essai</li></ul></div>
                    <div class="fl-arrow"></div>
                    <div class="fl-act"><h4>Échec : dispositif supraglottique</h4><ul><li>Masque laryngé permettant l'intubation</li><li>Intubation guidée par fibroscope à travers le masque</li></ul></div>
                    <div class="fl-outs"><div class="fl-out fl-out--green"><b>Oxygénation assurée</b>Poursuivre sous masque laryngé, intuber par le masque ou réveiller le patient</div></div>
                  </div>
                </section>
                <section class="fl-branch fl-yes">
                  <header>NON<span>Urgence vitale : chaque minute compte</span></header>
                  <div class="fl-body">
                    <div class="fl-act"><h4>Dispositif supraglottique sans délai</h4><ul><li>Un ou deux essais</li><li>Vérifier que le patient est curarisé</li></ul></div>
                    <div class="fl-arrow"></div>
                    <div class="fl-outs"><div class="fl-out fl-out--red"><b>Ni intubation ni oxygénation possibles</b>Cricothyrotomie immédiate : bistouri, mandrin long béquillé, sonde de 6 mm à ballonnet</div></div>
                  </div>
                </section>
              </div>
            </div>` }], { wide: true }),
          S("Règles de sécurité", [ul("Annoncer à voix haute « intubation difficile » et désigner un leader", "Limiter le nombre d'essais : chaque laryngoscopie aggrave l'œdème et le saignement", "Surveiller la SpO₂ et la capnographie ; une SpO₂ qui chute fait passer à l'étape suivante", "Le réveil reste une option tant que l'oxygénation est assurée")], { tone: "key" }),
          S("Médicaments", [kv(["Sugammadex", "16 mg/kg : réversion immédiate du rocuronium pour réveiller le patient"], ["Succinylcholine", "1 mg/kg si le patient n'est pas curarisé et que la ventilation est impossible"])]),
          S("Ensuite", [ul("Surveillance de l'extubation comme une extubation à risque", "Compte rendu détaillé dans le dossier, carte remise au patient, information écrite")])
        ],
        refs: ["RFE SFAR 2017 : Intubation difficile et extubation en anesthésie chez l'adulte (Langeron O et al., Anesth Reanim 2017)", "Frerk C et al. Difficult Airway Society 2015 guidelines for management of unanticipated difficult intubation in adults. Br J Anaesth 2015"]
      }
    },
    {
      id: "bronchospasme", title: "Bronchospasme et laryngospasme", court: "Bronchospasme, laryngospasme", hint: "Oxygène pur, approfondir l'anesthésie, salbutamol",
      tool: doses("urgBr", P => [["Propofol (laryngospasme, approfondissement)", `${r0(0.5 * P)} mg (0,5 mg/kg)`], ["Succinylcholine si le laryngospasme persiste", `${r0(0.5 * P)} à ${r0(P)} mg IV (0,5–1 mg/kg)`],
        ["Kétamine (bronchospasme)", `${r0(0.5 * P)} à ${r0(P)} mg (0,5–1 mg/kg)`], ["Méthylprednisolone", `${r0(P)} mg (1 mg/kg)`], ["Sulfate de magnésium", "2 g en 20 minutes"], ["Adrénaline si bronchospasme sévère", "10 à 50 µg IV, titrée"]]),
      fiche: {
        subtitle: "Désaturation, pressions élevées, capnogramme en pente ou absent",
        tags: ["O₂ 100 %", "Salbutamol", "Écarter l'anaphylaxie"],
        sections: [
          S("Laryngospasme", [steps(
            ["Oxygène pur, arrêt de toute stimulation", "Aspirer les sécrétions ou le sang"],
            ["Subluxation de la mandibule et pression positive continue", "Masque étanche, ballon en pression, sans insuffler de force"],
            ["Approfondir l'anesthésie", "Propofol 0,5 mg/kg IV"],
            ["Persistance ou désaturation", "Succinylcholine 0,5 à 1 mg/kg IV, avec atropine en cas de bradycardie ; intubation si nécessaire"]
          ), info("Après la levée du spasme, surveiller un œdème pulmonaire à pression négative.")], { wide: true, tone: "alert" }),
          S("Bronchospasme", [steps(
            ["Oxygène pur, ventilation manuelle", "Apprécier la compliance ; prévenir le chirurgien et arrêter la stimulation"],
            ["Éliminer une autre cause", "Sonde coudée, bouchée ou sélective, anaphylaxie, inhalation, pneumothorax, œdème pulmonaire"],
            ["Approfondir l'anesthésie", "Sévoflurane, propofol ou kétamine"],
            ["Salbutamol", "8 à 10 bouffées dans le circuit, à répéter, ou nébulisation de 5 mg ; ipratropium 0,5 mg"],
            ["Forme sévère", "Adrénaline titrée, sulfate de magnésium, corticoïde"]
          )], { wide: true, tone: "alert" }),
          S("Régler le ventilateur", [kv(["Volume courant", "6 mL/kg de poids idéal"], ["Fréquence", "Basse, 10 à 12 par minute"], ["Rapport I/E", "1/3 à 1/4 pour allonger l'expiration"], ["Capnie", "Hypercapnie tolérée"], ["Surveillance", "Auto-PEP et hyperinflation : débrancher brièvement si collapsus"])])
        ],
        refs: ["Dewachter P et al. Case scenario: bronchospasm during anesthetic induction. Anesthesiology 2011", "Gavel G, Walker RWM. Laryngospasm in anaesthesia. Contin Educ Anaesth Crit Care Pain 2014"]
      }
    },
    {
      id: "arret-cardiaque", title: "Arrêt cardiaque peropératoire", court: "Arrêt cardiaque", hint: "Massage, adrénaline, cause propre au bloc",
      fiche: {
        subtitle: "Le plus souvent une cause réversible : la chercher pendant le massage",
        tags: ["Massage 100–120/min", "Adrénaline", "EtCO₂"],
        sections: [
          S("Agir immédiatement", [steps(
            ["Annoncer l'arrêt, noter l'heure, appeler à l'aide", "Défibrillateur dans la salle ; le chirurgien arrête son geste, remet le patient à plat et comprime un saignement"],
            ["Massage cardiaque externe", "100 à 120 par minute ; en décubitus ventral, masser dans le dos si le retournement prend du temps"],
            ["Oxygène pur, arrêt des agents anesthésiques", "Ventilation à 10 par minute, vérifier la sonde et le circuit"],
            ["Analyser le rythme toutes les 2 minutes", "Fibrillation ou tachycardie ventriculaire : choc de 150 à 200 J biphasique, puis reprise immédiate du massage"],
            ["Adrénaline", "1 mg toutes les 3 à 5 minutes ; rythme choquable : après le troisième choc, avec amiodarone 300 mg"]
          ), info("Arrêt devant témoin, sous monitorage : l'adrénaline peut être débutée par bolus de 50 à 100 µg avant la dose de 1 mg. Un EtCO₂ supérieur à 20 mmHg témoigne d'un massage efficace.")], { wide: true, tone: "alert" }),
          S("Causes à chercher au bloc", [tbl(["Cause", "Geste"], [
            ["Hémorragie, hypovolémie", "Remplissage, transfusion, compression ou clampage par le chirurgien"],
            ["Hypoxie", "Sonde déplacée ou bouchée, circuit, pneumothorax"],
            ["Anaphylaxie", "Adrénaline, remplissage"],
            ["Embolie gazeuse, pulmonaire, de ciment", "Inonder le champ, arrêter l'insufflation, soutien du ventricule droit"],
            ["Toxicité des anesthésiques locaux", "Émulsion lipidique 20 %"],
            ["Hyperkaliémie", "Calcium, bicarbonate, insuline et glucose"],
            ["Rachianesthésie haute, réflexe vagal", "Atropine, puis adrénaline précoce"],
            ["Pneumothorax compressif, tamponnade", "Exsufflation, drainage"],
            ["Surdosage anesthésique, hyperthermie maligne", "Arrêt des agents, dantrolène"]
          ])], { wide: true }),
          S("Doses", [kv(["Adrénaline", "1 mg IV toutes les 3 à 5 minutes"], ["Amiodarone", "300 mg après le 3e choc, 150 mg après le 5e"], ["Choc", "150 à 200 J biphasique, puis énergie maximale"], ["Chlorure de calcium 10 %", "10 mL si hyperkaliémie ou hypocalcémie"], ["Bicarbonate 8,4 %", "1 mL/kg si hyperkaliémie ou intoxication aux stabilisants de membrane"])]),
          S("Après la reprise d'activité", [ul("Pression artérielle moyenne supérieure à 65 mmHg, normoxie, normocapnie, contrôle de la température", "Échocardiographie, ECG, gaz du sang, ionogramme", "Décider avec le chirurgien : terminer, abréger ou différer", "Assistance circulatoire si l'arrêt est réfractaire et qu'elle est disponible", "Débriefing d'équipe et information de la famille")])
        ],
        refs: [REF_ERC, "Soar J et al. European Resuscitation Council Guidelines 2021: adult advanced life support. Resuscitation 2021"]
      }
    },
    {
      id: "hemorragie-massive", title: "Hémorragie massive", court: "Hémorragie massive", hint: "Transfusion massive, acide tranexamique, fibrinogène, calcium",
      tool: doses("urgHem", P => [["Volume sanguin estimé", `${r0(70 * P)} mL (70 mL/kg)`], ["Acide tranexamique", "1 g en 10 minutes, puis 1 g sur 8 heures"],
        ["Fibrinogène si ≤ 1,5 g/L", `${f(Math.round(25 * P / 500) / 2, 1)} à ${f(Math.round(50 * P / 500) / 2, 1)} g (25–50 mg/kg)`],
        ["Plasma frais congelé", `${r0(15 * P)} mL (15 mL/kg), puis selon le ratio`], ["CCP si AVK", `${r0(25 * P)} UI (25 UI/kg) + vitamine K 10 mg`], ["Chlorure de calcium 10 %", "10 mL, à renouveler selon le calcium ionisé"]]),
      fiche: {
        subtitle: "Saignement non contrôlé avec instabilité : réanimer et corriger la coagulation pendant que le chirurgien contrôle la source",
        tags: ["Ratio 1:1 à 1:2", "Acide tranexamique", "Calcium"],
        sections: [
          S("Agir immédiatement", [steps(
            ["Annoncer l'hémorragie, appeler à l'aide", "Le chirurgien comprime, clampe ou réalise un tamponnement"],
            ["Deux voies de gros calibre, réchauffeur-accélérateur", "Voie artérielle dès que possible"],
            ["Déclencher la transfusion massive", "Prévenir le centre de transfusion ; plasma et globules rouges dans un rapport de 1 pour 1 à 1 pour 2, plaquettes précoces"],
            ["Acide tranexamique 1 g", "Puis 1 g sur 8 heures"],
            ["Noradrénaline précoce", "Pression systolique de 80 à 90 mmHg jusqu'à l'hémostase ; pression moyenne d'au moins 80 mmHg en cas de traumatisme crânien"],
            ["Corriger ce qui entretient le saignement", "Fibrinogène si ≤ 1,5 g/L, calcium ionisé supérieur à 0,9 mmol/L, température supérieure à 36 °C, pH supérieur à 7,2"]
          )], { wide: true, tone: "alert" }),
          S("Objectifs", [kv(["Hémoglobine", "7 à 9 g/dL"], ["Plaquettes", "Plus de 50 G/L ; plus de 100 G/L en neurochirurgie ou si le saignement persiste"], ["Fibrinogène", "Plus de 1,5 g/L"], ["TP", "Plus de 40 %"], ["Bilans", "Hémoglobine, lactate, calcium ionisé, hémostase toutes les 30 à 60 minutes"])]),
          S("Penser à", [ul("Antagoniser un anticoagulant : protamine, CCP, idarucizumab", "Récupération du sang épanché si elle est possible", "Hyperkaliémie et hypocalcémie de la transfusion massive", "Embolisation en radiologie interventionnelle selon la source")])
        ],
        refs: ["Duranteau J et al. Recommandations sur la réanimation du choc hémorragique (SFAR 2015). Anesth Reanim 2015", "Kietaibl S et al. Management of severe peri-operative bleeding: guidelines from the ESAIC, second update 2022. Eur J Anaesthesiol 2023"]
      }
    },
    {
      id: "hyperkaliemie", title: "Hyperkaliémie menaçante", court: "Hyperkaliémie", hint: "Calcium, insuline et glucose, salbutamol",
      fiche: {
        subtitle: "Kaliémie supérieure à 6,5 mmol/L ou signes électriques",
        tags: ["Calcium d'abord", "Insuline-glucose", "Pas de succinylcholine"],
        sections: [
          S("Reconnaître", [ul("Ondes T amples et pointues, allongement du PR, disparition de l'onde P, élargissement du QRS, bradycardie, puis fibrillation ventriculaire ou asystolie", "Contextes au bloc : transfusion massive, rhabdomyolyse, levée de garrot ou de clampage, reperfusion d'un greffon, insuffisance rénale, succinylcholine chez un patient brûlé, alité ou dénervé, hyperthermie maligne")]),
          S("Agir immédiatement", [steps(
            ["Protéger le myocarde", "Gluconate de calcium 10 % 30 mL, ou chlorure de calcium 10 % 10 mL, en IV lente ; à répéter après 5 minutes si l'ECG ne se corrige pas"],
            ["Faire entrer le potassium dans les cellules", "Insuline rapide 10 UI avec 25 g de glucose (50 mL de G50 %, ou 250 mL de G10 %) en 15 à 30 minutes ; glycémie toutes les heures pendant 6 heures"],
            ["Salbutamol", "10 à 20 mg en nébulisation, ou dans le circuit"],
            ["Acidose métabolique", "Bicarbonate de sodium 8,4 % 1 mL/kg ; hyperventilation modérée"],
            ["Éliminer le potassium", "Furosémide si la diurèse est conservée ; épuration extrarénale en urgence si la kaliémie reste menaçante"]
          ), warn("Le calcium corrige l'ECG en quelques minutes mais ne fait pas baisser la kaliémie. Arrêter tout apport de potassium et contrôler la kaliémie toutes les 30 à 60 minutes.")], { wide: true, tone: "alert" }),
          S("Doses", [kv(["Gluconate de calcium 10 %", "30 mL IV en 5 à 10 minutes"], ["Chlorure de calcium 10 %", "10 mL IV, de préférence sur voie centrale"], ["Insuline rapide", "10 UI avec 25 g de glucose"], ["Salbutamol", "10 à 20 mg nébulisés"], ["Bicarbonate 8,4 %", "1 mL/kg (1 mmol/kg)"])])
        ],
        refs: [REF_ERC, "Lindner G et al. Acute hyperkalemia in the emergency department: a summary from a KDIGO conference. Eur J Emerg Med 2020"]
      }
    },
    {
      id: "toxicite-anesthesiques-locaux", title: "Toxicité systémique des anesthésiques locaux", court: "Toxicité des anesthésiques locaux", hint: "Arrêt de l'injection, émulsion lipidique 20 %",
      tool: doses("urgAL", P => {
        const r = F.intralipide(P);
        return [["Émulsion lipidique 20 %, bolus", `${r0(r.bolus)} mL en 2 à 3 minutes`], ["Puis perfusion", r.perf], ["Dose cumulée maximale", `≈ ${r0(r.max)} mL (12 mL/kg)`], ["Midazolam si convulsions", "2 à 5 mg IV"], ["Adrénaline si arrêt cardiaque", `Petites doses, au plus ${r0(P)} µg par bolus (≤ 1 µg/kg)`]];
      }),
      fiche: {
        subtitle: "Signes neurologiques ou cardiaques pendant ou après une injection d'anesthésique local",
        tags: ["Émulsion lipidique", "Convulsions", "Réanimation prolongée"],
        sections: [
          S("Reconnaître", [ul("Goût métallique, acouphènes, paresthésies péribuccales, agitation, troubles de la parole", "Convulsions, coma", "Troubles de la conduction, élargissement du QRS, arythmies ventriculaires, collapsus, arrêt cardiaque", "Délai de quelques secondes (injection intravasculaire) à plus de 30 minutes (résorption)")]),
          S("Agir immédiatement", [steps(
            ["Arrêter l'injection, appeler à l'aide", "Demander l'émulsion lipidique"],
            ["Oxygène pur, contrôle des voies aériennes", "L'hypoxie et l'acidose aggravent la toxicité"],
            ["Convulsions", "Benzodiazépine ; propofol seulement à très faible dose"],
            ["Émulsion lipidique 20 %", "Bolus puis perfusion, dès les premiers signes graves"],
            ["Arrêt cardiaque", "Réanimation prolongée, adrénaline à petites doses, amiodarone en cas d'arythmie ventriculaire ; assistance circulatoire si elle est disponible"]
          ), danger("Pas de lidocaïne, d'inhibiteur calcique ni de bêtabloquant. Éviter la vasopressine.")], { wide: true, tone: "alert" }),
          S("Ensuite", [ul("Surveillance monitorée au moins 4 à 6 heures après un épisode grave, 2 heures après des signes neurologiques isolés", "Ne pas dépasser la dose maximale d'émulsion lipidique ; surveiller pancréatite et hypertriglycéridémie")])
        ],
        refs: ["Neal JM et al. ASRA checklist for treatment of local anesthetic systemic toxicity: 2020 version. Reg Anesth Pain Med 2021"]
      }
    },
    {
      id: "embolie-gazeuse", title: "Embolie gazeuse", court: "Embolie gazeuse", hint: "Inonder le champ, oxygène pur, soutien du ventricule droit",
      fiche: {
        subtitle: "Chute brutale de l'EtCO₂ avec hypotension pendant une chirurgie à risque",
        tags: ["EtCO₂ qui chute", "Inonder le champ", "O₂ 100 %"],
        sections: [
          S("Reconnaître", [ul("Chirurgies à risque : neurochirurgie en position assise, cœlioscopie (à l'insufflation), chirurgie hépatique, rachis, pose de voie centrale", "Chute brutale de l'EtCO₂, hypotension, désaturation, tachycardie ou bradycardie, souffle cardiaque dit « en roue de moulin »", "Collapsus ou arrêt cardiaque par défaillance du ventricule droit ; signes neurologiques au réveil en cas d'embolie paradoxale")]),
          S("Agir immédiatement", [steps(
            ["Prévenir le chirurgien", "Inonder le champ de sérum, cire sur les tranches osseuses, hémostase des veines ouvertes ; arrêter l'insufflation et exsuffler le pneumopéritoine"],
            ["Oxygène pur", "Arrêter le protoxyde d'azote"],
            ["Abaisser le site opératoire sous le niveau du cœur", "Décubitus latéral gauche tête basse si la chirurgie le permet ; compression des veines jugulaires en neurochirurgie"],
            ["Aspirer l'air par un cathéter central en place", "Sans retarder les autres mesures"],
            ["Soutenir la circulation", "Remplissage, noradrénaline, inotrope en cas de défaillance droite ; massage cardiaque si arrêt"]
          )], { wide: true, tone: "alert" }),
          S("Ensuite", [ul("Échocardiographie : air dans les cavités droites, foramen ovale perméable", "Signes neurologiques ou embolie paradoxale : discuter l'oxygénothérapie hyperbare", "Surveillance en soins critiques")])
        ],
        refs: ["Mirski MA et al. Diagnosis and treatment of vascular air embolism. Anesthesiology 2007"]
      }
    }
  ];

  /* ---------------- Pages ---------------- */
  const ICON = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12Z"/></svg>';

  P17.route(ROOT, {
    title: SEC,
    render: () => P17.page({
      crumbs: [[SEC, ROOT]], title: SEC, accent: "urgence", icon: "urgence", back: "#/",
      subtitle: "Aides cognitives à lire à voix haute pendant la prise en charge. Elles restent accessibles depuis la bulle rouge, sur toutes les pages.",
      body: P17.tiles(URG.map(u => ({ href: `${ROOT}/${u.id}`, title: u.court, desc: u.hint, icon: "urgence", accent: "urgence" })))
    })
  });
  P17.index(ROOT, SEC, "urgence crise aide cognitive check-list", SEC);

  URG.forEach(u => {
    const path = `${ROOT}/${u.id}`;
    P17.route(path, {
      title: u.court,
      render: () => `
        <div class="page accent-urgence">
          <div class="page-head">${P17.backLink(ROOT, SEC)}${P17.crumbs([[SEC, ROOT], [u.court, path]])}</div>
          ${P17.fiche({ kicker: "Urgence au bloc", accent: "urgence", title: u.title, tool: u.tool || "", toolLabel: "Doses selon le poids", ...u.fiche })}
        </div>`
    });
    P17.index(path, u.title, `${u.hint} ${(u.fiche.tags || []).join(" ")} urgence`, SEC);
  });

  /* ---------------- Bulle flottante, présente sur toutes les pages ---------------- */
  function mount() {
    if (document.getElementById("urg-fab")) return;
    const wrap = document.createElement("div");
    wrap.className = "urg";
    wrap.innerHTML = `
      <div class="urg-scrim" hidden></div>
      <aside class="urg-panel" id="urg-panel" role="dialog" aria-modal="true" aria-label="${SEC}" hidden>
        <header class="urg-head"><span class="urg-title">${ICON}${SEC}</span><button class="urg-close" type="button" aria-label="Fermer">${P17.icon("close")}</button></header>
        <nav class="urg-list">
          ${URG.map(u => `<a href="${ROOT}/${u.id}"><b>${u.court}</b><span>${u.hint}</span></a>`).join("")}
        </nav>
        <a class="urg-all" href="${ROOT}">Toutes les aides</a>
      </aside>
      <button class="urg-fab" id="urg-fab" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="urg-panel">${ICON}<span>Urgences</span></button>`;
    document.body.appendChild(wrap);
    const fab = wrap.querySelector(".urg-fab"), panel = wrap.querySelector(".urg-panel"), scrim = wrap.querySelector(".urg-scrim");
    const set = open => {
      panel.hidden = scrim.hidden = !open;
      fab.setAttribute("aria-expanded", String(open));
      wrap.classList.toggle("is-open", open);
      if (open) { const a = panel.querySelector("a"); if (a) a.focus({ preventScroll: true }); }
    };
    fab.addEventListener("click", () => set(panel.hidden));
    scrim.addEventListener("click", () => set(false));
    wrap.querySelector(".urg-close").addEventListener("click", () => { set(false); fab.focus(); });
    panel.addEventListener("click", e => { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !panel.hidden) { set(false); fab.focus(); } });
  }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
