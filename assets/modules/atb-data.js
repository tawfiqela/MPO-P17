/* =====================================================================
   Antibiothérapie — données révisées pour le Service de Réanimation
   Chirurgicale P17. Doses : adulte, fonction rénale normale.
   ===================================================================== */
(function () {
  const AMIKA = ["Amikacine", "25–30 mg/kg IVL sur 30 min (poids ajusté si obésité) ; pic 60–80 mg/L, résiduelle < 2,5 mg/L avant toute réinjection", "Néphrotoxicité, ototoxicité (irréversible)"];
  const GENTA = ["Gentamicine (Serratia, ou souche sensible)", "5–8 mg/kg IVL sur 30 min ; résiduelle < 0,5 mg/L", "Néphrotoxicité, ototoxicité"];
  const COLI = "Colistine : charge 9 MUI puis 4,5 MUI ×2/j IV (adapter à la fonction rénale), toujours en association";

  /* ---------------- Fiches BMR ---------------- */
  window.P17_BMR = [
    {
      id: "sarm", title: "Staphylococcus aureus résistant à la méticilline (SARM)", short: "SARM",
      definition: "Souches de <em>S. aureus</em> résistantes aux pénicillines M (oxacilline, cloxacilline), traitement de référence des infections à <em>S. aureus</em> sensible.",
      mecanisme: ["Pénicillinase (gène <em>blaZ</em>) chez environ 90 % des souches de <em>S. aureus</em>", "Modification de la cible : PLP2a codée par le gène <em>mecA</em> (spécifique du SARM), conférant une résistance à toutes les bêta-lactamines sauf la ceftaroline et le ceftobiprole"],
      epidemio: "≈ 11 % des souches invasives de <em>S. aureus</em> en France (2023). Écologie du service : à compléter avec les données du laboratoire du CHU.",
      ref: [["Vancomycine", "Charge 25–30 mg/kg IVL en 1–2 h, puis 30 mg/kg/24 h IVSE ; plateau 20–25 mg/L", "Néphrotoxicité, red man syndrome, veinotoxicité (VVC ou midline si > 5 mg/mL)"],
        ["Daptomycine", "8–12 mg/kg/24 h (≥ 10 mg/kg dans les bactériémies) ; inactivée par le surfactant (pas de pneumonie)", "Rhabdomyolyse (CPK hebdomadaires), pneumopathie à éosinophiles"],
        ["Linézolide", "600 mg ×2/j IV ou per os (biodisponibilité 100 %)", "Thrombopénie et anémie après 10–14 j, neuropathies, syndrome sérotoninergique, acidose lactique"]],
      sites: [["Pneumonie", "Linézolide 600 mg ×2/j (+ clindamycine 600 mg ×3/j si toxine de Panton-Valentine)", "Vancomycine ; ceftaroline ou ceftobiprole"],
        ["Bactériémie, endocardite", "Vancomycine ou daptomycine ≥ 10 mg/kg/j", "Association avec fosfomycine ou rifampicine sur avis infectiologique"],
        ["Infection intra-abdominale", "Vancomycine (associée à la couverture des BGN et anaérobies)", "Linézolide, tigécycline"],
        ["Infection urinaire", "Vancomycine", "Linézolide, cotrimoxazole si sensible"],
        ["Peau et tissus mous", "Vancomycine (+ clindamycine si infection grave)", "Linézolide, cotrimoxazole, tigécycline"]],
      choc: [["Gentamicine (si sensible)", "5–8 mg/kg IVL sur 30 min, dose unique ou courte durée", "Néphrotoxicité ; bénéfice incertain"]],
      notes: ["Décolonisation (mupirocine nasale, toilette à la chlorhexidine) selon le protocole d'hygiène", "Isolement contact"]
    },
    {
      id: "blse", title: "Entérobactéries productrices de BLSE", short: "E-BLSE",
      definition: "Bêta-lactamases d'origine plasmidique (résistance acquise) hydrolysant les pénicillines, les céphalosporines (dont C4G) et l'aztréonam. Céphamycines (céfoxitine), témocilline et carbapénèmes ne sont pas hydrolysés ; inhibées par l'acide clavulanique et le tazobactam.",
      mecanisme: ["Transmission plasmidique entre entérobactéries", "Enzymes de type CTX-M très majoritaires depuis les années 2000 ; dérivés de TEM et SHV minoritaires", "Corésistances fréquentes : fluoroquinolones, cotrimoxazole, aminosides"],
      epidemio: "La résistance aux C3G des entérobactéries est due à une BLSE dans environ 3/4 des cas. Données européennes 2023 : ≈ 8 % des <em>E. coli</em> et ≈ 25 % des <em>K. pneumoniae</em> cliniques. Écologie du service : à compléter.",
      pheno: "BLSE",
      ref: [["Méropénème", "Charge 2 g sur 30 min puis 1–2 g/8 h en perfusion prolongée de 3 h", "Neurotoxicité (moindre que l'imipénème), allergie"],
        ["Imipénème", "1 g/6–8 h IVL sur 30–60 min", "Convulsions (insuffisance rénale), nausées"],
        ["Témocilline (infections non graves, urinaires)", "Charge 2 g puis 4–6 g/24 h IVSE ou 2 g ×2–3/j", "Inactive sur les anaérobies et P. aeruginosa"]],
      sites: [["Pneumonie", "Méropénème", "Selon l'antibiogramme : témocilline (formes non graves), fluoroquinolone"],
        ["Bactériémie", "Méropénème ou imipénème", "Relais selon l'antibiogramme (fluoroquinolone, cotrimoxazole) après contrôle"],
        ["Péritonite", "Imipénème ou méropénème", "Ertapénème 1 g/24 h si non grave"],
        ["Infection biliaire", "Imipénème ou méropénème", "Pipéracilline-tazobactam si CMI basse et infection non grave drainée"],
        ["Infection urinaire", "Méropénème si grave ; sinon témocilline, pipéracilline-tazobactam ou céfoxitine (E. coli) selon la CMI", "Fluoroquinolone, cotrimoxazole, aminoside selon l'antibiogramme"],
        ["Peau et tissus mous", "Méropénème", "Tigécycline (association, formes sévères)"]],
      choc: [AMIKA, GENTA],
      notes: ["La pipéracilline-tazobactam est moins efficace que le méropénème dans les bactériémies à E-BLSE (essai MERINO) : réservée aux infections non graves à point de départ urinaire ou biliaire contrôlé", "Épargne des carbapénèmes dès que l'antibiogramme le permet"]
    },
    {
      id: "ampc", title: "Entérobactéries productrices de céphalosporinase AmpC", short: "AmpC",
      definition: "Céphalosporinase hydrolysant les C1G, C2G et, lorsqu'elle est hyperproduite, les C3G ; le céfépime reste actif.",
      mecanisme: ["AmpC chromosomique naturelle des entérobactéries du groupe 3 (Enterobacter, K. aerogenes, C. freundii, Serratia, Morganella, Providencia, Hafnia)", "Hyperproduction par induction (sélection sous C3G ou pipéracilline-tazobactam) ou dérépression (mutation)", "AmpC plasmidique possible chez E. coli et K. pneumoniae"],
      epidemio: "Environ 1/4 des résistances aux C3G des entérobactéries. Écologie du service : à compléter.",
      pheno: "ampC",
      ref: [["Céfépime", "Charge 2 g puis 4–6 g/24 h IVSE ou 2 g/8 h ; CMI ≤ 1 mg/L requise", "Neurotoxicité (encéphalopathie, surtout si insuffisance rénale) : dosages"]],
      sites: [["Pneumonie", "Céfépime", "Ciprofloxacine 400 mg ×2–3/j IV, cotrimoxazole, carbapénème"],
        ["Bactériémie", "Céfépime", "Ciprofloxacine, carbapénème si CMI du céfépime élevée"],
        ["Infection intra-abdominale", "Céfépime + métronidazole 500 mg ×3/j", "Carbapénème ; tigécycline (formes sévères)"],
        ["Infection urinaire", "Céfépime puis relais fluoroquinolone ou cotrimoxazole", "Aminoside"],
        ["Peau et tissus mous", "Céfépime", "Ciprofloxacine, cotrimoxazole"]],
      choc: [AMIKA, GENTA],
      notes: ["Groupe 3 (Enterobacter, K. aerogenes, C. freundii) : éviter les C3G et la pipéracilline-tazobactam même si la souche paraît sensible (sélection de mutants hyperproducteurs)"]
    },
    {
      id: "carba", title: "Entérobactéries productrices de carbapénémases (EPC)", short: "EPC",
      definition: "Carbapénémases d'origine plasmidique hydrolysant la quasi-totalité des bêta-lactamines. Bactéries hautement résistantes émergentes : isolement et dépistage des contacts.",
      mecanisme: ["KPC (classe A, sérine)", "NDM, VIM, IMP (classe B, métallo-bêta-lactamases, non inhibées par l'avibactam)", "OXA-48 et apparentées (classe D)"],
      epidemio: "Klebsiella, Enterobacter, E. coli, Citrobacter. Mécanismes en France : OXA-48 majoritaires, puis NDM, VIM, KPC. Écologie locale : à compléter (OXA-48 et NDM fréquentes au Maghreb).",
      pheno: "carba",
      ref: [["Ceftazidime-avibactam", "2 g/0,5 g toutes les 8 h en perfusion de 2 h (prolongée possible)", "Actif sur KPC et OXA-48 ; inactif seul sur NDM/VIM"],
        ["Aztréonam (avec ceftazidime-avibactam)", "2 g toutes les 8 h, perfusés en même temps que la ceftazidime-avibactam", "Association de référence des métallo-bêta-lactamases (NDM, VIM)"],
        ["Méropénème-vaborbactam", "2 g/2 g toutes les 8 h sur 3 h", "KPC"],
        ["Imipénème-relebactam", "500 mg/500 mg/250 mg toutes les 6 h", "KPC"],
        ["Céfidérocol", "2 g toutes les 8 h sur 3 h", "Toutes classes ; alternative pour NDM/VIM"]],
      sites: [["KPC (classe A)", "Ceftazidime-avibactam, méropénème-vaborbactam ou imipénème-relebactam", "Céfidérocol"],
        ["OXA-48 (classe D)", "Ceftazidime-avibactam", "Céfidérocol"],
        ["NDM, VIM, IMP (classe B)", "Ceftazidime-avibactam + aztréonam", "Céfidérocol"],
        ["Infection urinaire non grave", "Selon l'antibiogramme : aminoside, fosfomycine IV, cotrimoxazole", "—"]],
      choc: [AMIKA],
      atlas: "assets/img/atb/Carbapenemases.webp",
      notes: ["Avis infectiologique systématique", "Tigécycline et colistine : options de recours, en association", "Signalement à l'équipe d'hygiène, dépistage des patients contacts"]
    },
    {
      id: "pyo", title: "Pseudomonas aeruginosa multirésistant (MDR, XDR, DTR)", short: "P. aeruginosa R",
      definition: "MDR : résistance à au moins 3 familles ; XDR : sensibilité à 2 familles au plus ; DTR (« difficult-to-treat ») : résistance à toutes les bêta-lactamines classiques (pipéracilline-tazobactam, ceftazidime, céfépime, aztréonam, carbapénèmes) et aux fluoroquinolones.",
      mecanisme: ["Bêta-lactamines : hyperproduction d'AmpC, perte de la porine OprD (imipénème), pompes d'efflux (MexAB-OprM, MexXY-OprM), BLSE, carbapénémases (VIM, IMP…)", "Aminosides : enzymes AAC(6'), méthylases, efflux MexXY", "Fluoroquinolones : mutations gyrA/parC, efflux"],
      epidemio: "Souches invasives en France (2021) : ≈ 12 % résistantes aux carbapénèmes, 6 % MDR, 4 % XDR. Écologie du service : à compléter.",
      pheno: "pyo",
      ref: [["Ceftolozane-tazobactam", "2 g/1 g toutes les 8 h (pneumonies) ; 1 g/0,5 g toutes les 8 h (autres sites), perfusion de 1 h ou prolongée", "Inactif si carbapénémase"],
        ["Ceftazidime-avibactam", "2 g/0,5 g toutes les 8 h sur 2 h", "Inactif sur les métallo-bêta-lactamases"],
        ["Imipénème-relebactam", "500 mg/500 mg/250 mg toutes les 6 h", "Inactif sur les métallo-bêta-lactamases"],
        ["Céfidérocol", "2 g toutes les 8 h sur 3 h", "Métallo-bêta-lactamases (VIM)"]],
      sites: [["Tous sites (DTR sans carbapénémase)", "Ceftolozane-tazobactam", "Ceftazidime-avibactam, imipénème-relebactam"],
        ["Carbapénémase de type VIM/IMP", "Céfidérocol", "Ceftazidime-avibactam + aztréonam si l'aztréonam est actif"],
        ["Recours", COLI, "Associer une autre molécule active ; aérosols de colistine ou d'amikacine discutés dans les pneumonies"]],
      choc: [AMIKA],
      notes: ["Choisir selon l'antibiogramme et la caractérisation du mécanisme (test de carbapénémase)", "Perfusions prolongées des bêta-lactamines et dosages plasmatiques"]
    },
    {
      id: "acineto", title: "Acinetobacter baumannii résistant aux carbapénèmes (ABRI)", short: "ABRI",
      definition: "Bacille à Gram négatif non fermentant de l'environnement hospitalier, capable d'acquérir de nombreuses résistances, notamment aux carbapénèmes (oxacillinases OXA-23, OXA-24, OXA-58).",
      mecanisme: ["Oxacillinases acquises (OXA-23 majoritaire), métallo-bêta-lactamases plus rares", "Céphalosporinase ADC, efflux AdeABC, perte de porines", "Enzymes modificatrices des aminosides"],
      epidemio: "≈ 15 % des souches invasives de <em>A. baumannii</em> résistantes à l'imipénème en France (2021), beaucoup plus au Maghreb et au Moyen-Orient. Écologie du service : à compléter.",
      pheno: "acineto",
      ref: [["Ampicilline-sulbactam à forte dose", "Sulbactam 9 g/24 h (ex. ampicilline 6 g/sulbactam 3 g toutes les 8 h en perfusion de 4 h)", "Toujours en association"],
        ["Sulbactam-durlobactam (si disponible)", "1 g/1 g toutes les 6 h sur 3 h, associé à l'imipénème ou au méropénème", "Option de référence lorsqu'elle est disponible"],
        ["Colistine", "Charge 9 MUI puis 4,5 MUI ×2/j IV", "Néphrotoxicité, neurotoxicité"],
        ["Céfidérocol", "2 g toutes les 8 h sur 3 h", "Recours, en association"]],
      sites: [["Pneumonie", "Ampicilline-sulbactam forte dose + colistine (ou tigécycline forte dose)", "Céfidérocol en association ; aérosols de colistine discutés"],
        ["Bactériémie", "Ampicilline-sulbactam forte dose + colistine", "Céfidérocol en association"],
        ["Infection intra-abdominale, peau et tissus mous", "Ampicilline-sulbactam forte dose + tigécycline (100 mg puis 50 mg ×2/j ; 200 puis 100 mg ×2/j si grave)", "Colistine"],
        ["Infection urinaire", "Selon l'antibiogramme (aminoside, colistine)", "—"]],
      choc: [["Amikacine (si sensible, hors bithérapie)", "25–30 mg/kg IVL sur 30 min", "Néphrotoxicité"]],
      notes: ["Avis infectiologique systématique, bithérapie de règle", "Hygiène renforcée (réservoirs environnementaux)"]
    },
    {
      id: "steno", title: "Stenotrophomonas maltophilia", short: "S. maltophilia",
      definition: "Bacille à Gram négatif non fermentant de l'environnement, pathogène opportuniste en réanimation (ventilation prolongée, carbapénèmes antérieurs, immunodépression), avec de nombreuses résistances naturelles.",
      mecanisme: ["Métallo-bêta-lactamase L1 (hydrolyse les carbapénèmes) et céphalosporinase L2", "Résistance naturelle aux aminosides", "Efflux (fluoroquinolones)"],
      epidemio: "Sensibilité au cotrimoxazole ≈ 96 %, à la lévofloxacine ≈ 80 %. Distinguer colonisation et infection (prélèvements respiratoires).",
      pheno: "steno",
      ref: [["Cotrimoxazole", "TMP 10–15 mg/kg/j (SMX 50–75 mg/kg/j) IV en 3–4 prises", "Hyperkaliémie, cytopénies, néphrotoxicité, toxidermies graves"]],
      sites: [["Infection grave (pneumonie, bactériémie)", "Cotrimoxazole + lévofloxacine 750 mg/j (ou minocycline, ou céfidérocol)", "Ceftazidime-avibactam + aztréonam"],
        ["Infection non grave", "Cotrimoxazole en monothérapie", "Lévofloxacine, minocycline"]],
      choc: [["Aminosides", "Inactifs (résistance naturelle)", "—"]],
      notes: ["La ceftazidime n'est plus recommandée (bêta-lactamase L1)", "Retirer les dispositifs colonisés (cathéters)"]
    },
    {
      id: "erv", title: "Entérocoques résistants aux glycopeptides (ERG/ERV)", short: "ERV",
      definition: "Souches d'<em>E. faecium</em> (plus rarement <em>E. faecalis</em>) résistantes à la vancomycine (gènes <em>vanA</em>, <em>vanB</em>). Bactéries hautement résistantes émergentes.",
      mecanisme: ["Modification de la cible des glycopeptides (D-Ala-D-Lac) par les opérons <em>vanA</em> (vancomycine et teicoplanine) ou <em>vanB</em> (vancomycine)", "E. faecium : résistance à l'amoxicilline dans ≈ 80 % des cas"],
      epidemio: "Rare en France (≈ 0,1 % des E. faecium cliniques). Isolement et dépistage des contacts.",
      pheno: "erv",
      ref: [["Linézolide", "600 mg ×2/j IV ou per os", "Cytopénies, neuropathies"],
        ["Daptomycine", "10–12 mg/kg/24 h (bactériémie, endocardite), associée à l'ampicilline si sensible", "Rhabdomyolyse"],
        ["Tigécycline", "100 mg puis 50 mg ×2/j", "Infections abdominales et des tissus mous uniquement (pas de bactériémie)"]],
      sites: [["Bactériémie, endocardite", "Daptomycine 10–12 mg/kg/j", "Linézolide"],
        ["Infection intra-abdominale", "Linézolide ou tigécycline", "Daptomycine"],
        ["Infection urinaire", "Linézolide", "Fosfomycine, nitrofurantoïne (cystite)"],
        ["Peau et tissus mous", "Linézolide", "Tigécycline, daptomycine"]],
      choc: [],
      notes: ["Signalement à l'équipe d'hygiène, dépistage des contacts"]
    }
  ];

  /* ---------------- Bactéries multisensibles ---------------- */
  window.P17_ATB_SENSIBLES = [
    ["Staphylococcus aureus sensible", "Cloxacilline", "100–200 mg/kg/j (perfusion continue après charge de 2 g)", "Céfazoline (80–100 mg/kg/j), cotrimoxazole, fluoroquinolone", "Céfazoline aussi efficace et mieux tolérée ; amoxicilline si souche sans pénicillinase"],
    ["Staphylocoques à coagulase négative", "Vancomycine", "Charge 25–30 mg/kg puis 30 mg/kg/24 h IVSE (plateau 20–25 mg/L)", "Linézolide, daptomycine", "Résistance à la méticilline dans 70–90 % des cas ; souvent contaminants (2 hémocultures positives)"],
    ["Streptococcus pneumoniae", "Amoxicilline", "50–100 mg/kg/j (méningite : 200 mg/kg/j)", "C3G, lévofloxacine, spiramycine", "Méningite : C3G à forte dose en probabiliste, relais selon la CMI"],
    ["Streptocoques A, B, C, G", "Amoxicilline", "50–100 mg/kg/j", "Céfazoline, clindamycine (toxine), vancomycine", "Clindamycine associée si choc toxique ou nécrose"],
    ["Enterococcus faecalis", "Amoxicilline", "100–200 mg/kg/j", "Vancomycine, linézolide, daptomycine", "Résistance naturelle aux céphalosporines ; endocardite : amoxicilline + ceftriaxone"],
    ["Enterococcus faecium", "Vancomycine", "30 mg/kg/24 h IVSE après charge", "Linézolide, daptomycine, tigécycline", "Résistant à l'amoxicilline dans ≈ 80 % des cas ; résistance naturelle aux céphalosporines"],
    ["Neisseria meningitidis", "Céfotaxime ou ceftriaxone (probabiliste), puis amoxicilline si sensible", "Céfotaxime 200 mg/kg/j ; ceftriaxone 75–100 mg/kg/j ; amoxicilline 200 mg/kg/j", "Fluoroquinolone, rifampicine (prophylaxie des contacts)", "Résistance naturelle au cotrimoxazole"],
    ["Haemophilus influenzae", "Amoxicilline (ou C3G en probabiliste)", "50–100 mg/kg/j", "Amoxicilline-clavulanate, fluoroquinolone, cotrimoxazole", "Pénicillinase ≈ 20 % ; résistance par modification de PLP3 ≈ 7 %"],
    ["Moraxella catarrhalis", "Amoxicilline-clavulanate", "1 g ×3/j", "C3G, macrolide", "Pénicillinase dans 95 % des cas"],
    ["Listeria monocytogenes", "Amoxicilline + gentamicine (5–8 mg/kg, 3–5 j)", "Amoxicilline 200 mg/kg/j si atteinte neuroméningée", "Cotrimoxazole, linézolide, moxifloxacine", "Résistance naturelle aux céphalosporines"],
    ["Clostridioides difficile", "Fidaxomicine", "200 mg ×2/j per os, 10 jours", "Vancomycine 125 mg ×4/j per os, 10 jours", "Moins de récidives sous fidaxomicine ; formes fulminantes : vancomycine PO 500 mg ×4/j + métronidazole IV"],
    ["Entérobactéries du groupe 0 et 1 (E. coli, P. mirabilis, Salmonella, Shigella)", "Amoxicilline si sensible", "100 mg/kg/j", "C3G, aztréonam, ciprofloxacine, cotrimoxazole", "Résistance aux C3G : BLSE (CTX-M) surtout"],
    ["Entérobactéries du groupe 2 (K. pneumoniae, K. oxytoca, C. koseri)", "Amoxicilline-clavulanate ou C3G", "Amoxicilline-clavulanate 1 g ×3/j ; céfotaxime 1–2 g ×3/j", "Aztréonam, ciprofloxacine, cotrimoxazole", "Pénicillinase naturelle (résistance à l'amoxicilline)"],
    ["Entérobactéries du groupe 3 (Enterobacter, K. aerogenes, C. freundii, Serratia, Morganella, Providencia, Hafnia)", "Céfépime", "Charge 2 g puis 4–6 g/24 h", "Ciprofloxacine, cotrimoxazole, carbapénème", "Pas de C3G ni de pipéracilline-tazobactam (AmpC inductible) ; Serratia naturellement résistant à l'amikacine (gentamicine active)"],
    ["Pseudomonas aeruginosa (sauvage)", "Ceftazidime, céfépime ou pipéracilline-tazobactam", "Ceftazidime : charge 2 g puis 6 g/24 h ; pipéracilline-tazobactam 4 g ×4/j ou 16 g/24 h", "Aztréonam, ciprofloxacine, méropénème, amikacine", "Résistance naturelle à l'ertapénème, à la tigécycline, aux C3G non anti-pyocyaniques"],
    ["Acinetobacter baumannii (sauvage)", "Ampicilline-sulbactam ou méropénème selon l'antibiogramme", "Méropénème 2 g/8 h", "Ciprofloxacine, cotrimoxazole, amikacine", "Résistance naturelle à l'ertapénème et à l'aztréonam"],
    ["Stenotrophomonas maltophilia", "Cotrimoxazole", "TMP 10–15 mg/kg/j en 3–4 prises", "Lévofloxacine, minocycline, céfidérocol", "Résistance naturelle aux carbapénèmes et aux aminosides"],
    ["Legionella pneumophila", "Lévofloxacine", "500 mg ×1–2/j IV/PO", "Spiramycine, azithromycine", "Durée 14 jours (21 si immunodépression) ; surveiller le QTc"],
    ["Mycoplasma pneumoniae", "Spiramycine", "3 MUI ×3/j IV", "Lévofloxacine, doxycycline", "Résistance aux macrolides rare en France"],
    ["Nocardia spp.", "Cotrimoxazole IV, en association (imipénème, linézolide ou amikacine) si forme grave", "TMP 15 mg/kg/j", "Linézolide, amikacine, imipénème", "Durée prolongée (6–12 mois) ; atteinte cérébrale à rechercher"]
  ];

  /* ---------------- Durées ---------------- */
  window.P17_ATB_DUREES = [
    ["Pneumonies", [
      ["Pneumonie communautaire", "3 j si critères de stabilité à J3 ; 5 j si stabilité entre J3 et J5 ; 7 j sinon", "SPILF-SPLF 2025"],
      ["Pneumonie communautaire grave (réanimation)", "7 j", "Hors légionellose, abcès, empyème"],
      ["Légionellose", "14 j (21 j si immunodépression)", ""],
      ["Pneumonie acquise sous ventilation mécanique", "7 j, y compris à P. aeruginosa si l'évolution est favorable", "SFAR-SRLF 2017"],
      ["Abcès pulmonaire, empyème", "3 à 6 semaines selon le drainage et l'évolution", ""]
    ]],
    ["Infections urinaires", [
      ["Pyélonéphrite simple", "7 j (fluoroquinolone ou bêta-lactamine parentérale)", ""],
      ["Pyélonéphrite à risque de complication", "10 j", ""],
      ["Infection urinaire masculine", "14 j (7 j possible si apyrexie rapide sous fluoroquinolone, sur avis)", ""],
      ["Infection urinaire associée aux soins / sur sonde", "7 j (changement de la sonde) ; 10–14 j si évolution lente", ""]
    ]],
    ["Infections intra-abdominales", [
      ["Ulcère perforé opéré < 24 h, plaie pénétrante, perforation iatrogène sous-mésocolique", "24 h", "RFE 2014"],
      ["Appendicite ou cholécystite non compliquée opérée", "0 à 24 h", ""],
      ["Péritonite communautaire localisée", "2 à 3 j", ""],
      ["Péritonite communautaire généralisée", "4 à 7 j après contrôle de la source", "STOP-IT : 4 j"],
      ["Péritonite associée aux soins / postopératoire", "7 à 8 j (5 à 15 j selon l'évolution)", ""],
      ["Angiocholite drainée", "4 à 7 j (14 j si bactériémie à entérocoque ou streptocoque)", ""],
      ["Abcès hépatique", "4 à 6 semaines selon le drainage", ""]
    ]],
    ["Bactériémies", [
      ["Bactériémie non compliquée (hors S. aureus), source contrôlée", "7 j", "BALANCE 2025"],
      ["S. aureus non compliquée", "14 j IV à partir de la première hémoculture négative", "ETO, hémocultures de contrôle"],
      ["S. aureus compliquée", "4 à 6 semaines", ""],
      ["Bactériémie sur cathéter à staphylocoque à coagulase négative", "5 à 7 j après le retrait du cathéter", ""],
      ["Candidémie", "14 j après la première hémoculture négative", "Fond d'œil, ETT/ETO"]
    ]],
    ["Système nerveux central", [
      ["Méningite à méningocoque", "5 à 7 j", ""],
      ["Méningite à pneumocoque", "10 à 14 j", ""],
      ["Méningite à Listeria", "21 j", ""],
      ["Méningite à BGN, post-neurochirurgicale", "10 à 21 j selon le germe et l'évolution", ""],
      ["Abcès cérébral", "6 à 8 semaines", ""]
    ]],
    ["Peau, tissus mous, os", [
      ["Dermohypodermite non nécrosante", "7 j", ""],
      ["Dermohypodermite nécrosante, fasciite", "10 à 15 j après le dernier débridement", ""],
      ["Infection du site opératoire superficielle", "5 à 7 j", ""],
      ["Médiastinite postopératoire", "6 semaines (ostéite sternale)", ""],
      ["Infection de prothèse vasculaire", "≥ 6 semaines, 3–6 mois si prothèse conservée", ""]
    ]],
    ["Cœur", [
      ["Endocardite sur valve native", "4 à 6 semaines (2 semaines dans certaines endocardites à streptocoque sensible)", "ESC 2023"],
      ["Endocardite sur prothèse", "6 semaines", "ESC 2023"]
    ]],
    ["Sepsis", [
      ["Sepsis ou choc septique, source contrôlée", "≤ 7 j sauf justification", "HAS 2025"],
      ["Arrêt guidé par la procalcitonine", "Possible si la durée optimale est incertaine", ""]
    ]]
  ];

  /* ---------------- Adaptation à la fonction rénale ----------------
     Colonnes : charge | >120 | 30-120 | 10-30 | <10 | HDI | CVVH | CVVHD */
  window.P17_ATB_REIN_COLS = [["charge", "Dose de charge"], [">120", "DFG > 120 (hyperclairance)"], ["30-120", "DFG 30–120"], ["30-10", "DFG 10–30"], ["<10", "DFG < 10"], ["hd", "Hémodialyse intermittente"], ["cvvh", "CVVH 30–35 mL/kg/h"], ["cvvhd", "CVVHD 30–35 mL/kg/h"]];
  window.P17_ATB_REIN = {
    "Bêta-lactamines": {
      "Amoxicilline": { charge: "2 g sur 30 min", ">120": "2 g /4–6 h", "30-120": "1–2 g /4–8 h", "30-10": "1 g /12 h", "<10": "1 g /24 h", hd: "Jours sans dialyse : 1 g /12–24 h ; jours de dialyse : 1 g après la séance", cvvh: "1 g /8 h", cvvhd: "1 g /6–8 h" },
      "Cloxacilline": { charge: "2 g sur 30 min", ">120": "2 g /4–6 h", "30-120": "1–2 g /4–6 h", "30-10": "1 g /6–8 h", "<10": "1 g /6–8 h", hd: "1 g /6–8 h, dose après la séance", cvvh: "1 g /6 h", cvvhd: "1 g /4–6 h" },
      "Amoxicilline-clavulanate": { charge: "2 g/0,2 g sur 30 min", ">120": "2 g/0,2 g /6 h", "30-120": "1 g/0,2 g /6–8 h", "30-10": "1 g/0,2 g /12 h", "<10": "1 g/0,2 g /24 h", hd: "1 g/0,2 g /24 h, dose après la séance", cvvh: "1 g/0,2 g /8 h", cvvhd: "1 g/0,2 g /6–8 h" },
      "Pipéracilline-tazobactam": { charge: "4 g/0,5 g sur 30 min", ">120": "4 g/0,5 g /6 h ou 16 g/24 h IVSE", "30-120": "4 g/0,5 g /6 h", "30-10": "4 g/0,5 g /8 h", "<10": "4 g/0,5 g /12 h", hd: "4 g/0,5 g /12–24 h, dose après la séance", cvvh: "4 g/0,5 g /8 h", cvvhd: "4 g/0,5 g /6–8 h" },
      "Céfazoline": { charge: "2 g sur 30 min", ">120": "8 g/24 h IVSE", "30-120": "6–8 g/24 h IVSE", "30-10": "1 g /12 h", "<10": "1 g /24 h", hd: "1 g /12–24 h, dose après la séance", cvvh: "2 g /12 h", cvvhd: "2 g /8–12 h" },
      "Céfotaxime": { charge: "2 g sur 30 min", ">120": "2 g /6 h", "30-120": "1–2 g /6–8 h", "30-10": "1 g /12 h", "<10": "1 g /24 h", hd: "1–2 g /24 h, dose après la séance", cvvh: "2 g /8 h", cvvhd: "2 g /6–8 h" },
      "Ceftriaxone": { charge: "2 g sur 30 min", ">120": "1–2 g /12–24 h", "30-120": "1–2 g /24 h", "30-10": "1–2 g /24 h", "<10": "1 g /24 h", hd: "1–2 g /24 h (peu dialysable)", cvvh: "2 g /24 h", cvvhd: "2 g /24 h" },
      "Ceftazidime": { charge: "2 g sur 30 min", ">120": "6 g/24 h IVSE ou 2 g /8 h", "30-120": "2 g /8 h (DFG > 50) ; 1–2 g /12 h (31–50)", "30-10": "1 g /12–24 h", "<10": "0,5–1 g /24 h", hd: "1 g après chaque séance", cvvh: "2 g /12 h", cvvhd: "2 g /8–12 h" },
      "Céfépime": { charge: "2 g sur 30 min", ">120": "2 g /8 h ou 6 g/24 h IVSE", "30-120": "2 g /8 h (DFG > 60) ; 2 g /12 h (30–60)", "30-10": "1–2 g /24 h", "<10": "0,5–1 g /24 h", hd: "1 g J1 puis 0,5–1 g /24 h, dose après la séance", cvvh: "2 g /12 h", cvvhd: "2 g /8–12 h" },
      "Ceftobiprole": { charge: "500 mg sur 2 h", ">120": "500 mg /8 h (sur 2 h)", "30-120": "500 mg /8–12 h", "30-10": "250 mg /12 h", "<10": "250 mg /24 h", hd: "250 mg /24 h, après la séance", cvvh: "Avis pharmacien", cvvhd: "Avis pharmacien" },
      "Ceftaroline": { charge: "—", ">120": "600 mg /8 h", "30-120": "600 mg /12 h (8 h si infection grave) ; 400 mg /12 h si DFG 30–50", "30-10": "300 mg /12 h", "<10": "200 mg /12 h", hd: "200 mg /12 h, après la séance", cvvh: "Avis pharmacien", cvvhd: "Avis pharmacien" },
      "Ceftazidime-avibactam": { charge: "—", ">120": "2 g/0,5 g /8 h", "30-120": "2 g/0,5 g /8 h (DFG > 50) ; 1 g/0,25 g /8 h (31–50)", "30-10": "0,75 g/0,1875 g /12 h", "<10": "0,75 g/0,1875 g /24–48 h", hd: "Dose après la séance", cvvh: "1,25 g /8 h (avis pharmacien)", cvvhd: "1,25 g /8 h (avis pharmacien)" },
      "Ceftolozane-tazobactam": { charge: "—", ">120": "1 g/0,5 g /8 h (2 g/1 g si pneumonie)", "30-120": "1 g/0,5 g /8 h (DFG > 50) ; 0,5 g/0,25 g /8 h (30–50) — doubler si pneumonie", "30-10": "250 mg/125 mg /8 h (doubler si pneumonie)", "<10": "Avis pharmacien", hd: "Charge puis 100 mg/50 mg /8 h", cvvh: "1 g/0,5 g /8 h", cvvhd: "1 g/0,5 g /8 h" },
      "Céfidérocol": { charge: "2 g sur 3 h", ">120": "2 g /6 h", "30-120": "2 g /8 h (DFG ≥ 60) ; 1,5 g /8 h (30–59)", "30-10": "1 g /8 h", "<10": "0,75 g /12 h", hd: "0,75 g /12 h, dose après la séance", cvvh: "1,5–2 g /8–12 h selon l'effluent", cvvhd: "1,5–2 g /8–12 h selon l'effluent" },
      "Imipénème": { charge: "—", ">120": "1 g /6 h", "30-120": "1 g /6–8 h", "30-10": "500 mg /8–12 h", "<10": "500 mg /12 h", hd: "500 mg /12 h, dose après la séance", cvvh: "1 g /8 h", cvvhd: "1 g /8 h" },
      "Méropénème": { charge: "2 g sur 30 min", ">120": "2 g /8 h (perfusion de 3 h)", "30-120": "1–2 g /8 h (DFG > 50) ; 1–2 g /12 h (26–50)", "30-10": "0,5–1 g /12 h", "<10": "0,5–1 g /24 h", hd: "1 g /24 h, dose après la séance", cvvh: "1 g /8 h", cvvhd: "1 g /8 h" },
      "Ertapénème": { charge: "1 g", ">120": "1 g /12 h (à discuter)", "30-120": "1 g /24 h", "30-10": "500 mg /24 h", "<10": "500 mg /24 h (à éviter)", hd: "500 mg après la séance", cvvh: "À éviter", cvvhd: "À éviter" },
      "Imipénème-relebactam": { charge: "—", ">120": "500/500/250 mg /6 h", "30-120": "500/500/250 mg /6 h (DFG ≥ 90) ; 400/400/200 mg (60–89) ; 300/300/150 mg (30–59), toutes les 6 h", "30-10": "200/200/100 mg /6 h (15–29)", "<10": "Non recommandé hors hémodialyse", hd: "200/200/100 mg /6 h, après la séance", cvvh: "Avis pharmacien", cvvhd: "Avis pharmacien" },
      "Méropénème-vaborbactam": { charge: "—", ">120": "2 g/2 g /8 h sur 3 h", "30-120": "2 g/2 g /8 h (DFG ≥ 40) ; 1 g/1 g /8 h (20–39)", "30-10": "1 g/1 g /8 h (20–30) ; 1 g/1 g /12 h (10–19)", "<10": "0,5 g/0,5 g /12 h", hd: "0,5 g/0,5 g /12 h, après la séance", cvvh: "Avis pharmacien", cvvhd: "Avis pharmacien" },
      "Aztréonam": { charge: "2 g sur 30 min", ">120": "2 g /6–8 h ou 6–8 g/24 h IVSE", "30-120": "2 g /8 h", "30-10": "1 g /8 h", "<10": "500 mg /8 h", hd: "500 mg /8 h + dose après la séance", cvvh: "2 g /8 h", cvvhd: "2 g /8 h" },
      "Témocilline": { charge: "2 g sur 30 min", ">120": "6 g/24 h IVSE", "30-120": "4–6 g/24 h IVSE (DFG > 60) ; 1–2 g /12 h (30–60)", "30-10": "1 g /24 h", "<10": "1 g /48 h", hd: "1 g /48 h, dose après la séance", cvvh: "2 g /12 h", cvvhd: "2 g /8–12 h" }
    },
    "Aminosides": {
      "Amikacine": { charge: "25–30 mg/kg sur 30 min", ">120": "Pas d'entretien en règle (1 à 3 doses)", "30-120": "Nouvelle dose si résiduelle < 2,5 mg/L", "30-10": "Nouvelle dose si résiduelle < 2,5 mg/L", "<10": "Nouvelle dose si résiduelle < 2,5 mg/L", hd: "Dose avant la séance si résiduelle < 2,5 mg/L", cvvh: "Selon les dosages", cvvhd: "Selon les dosages" },
      "Gentamicine": { charge: "5–8 mg/kg sur 30 min", ">120": "Pas d'entretien en règle", "30-120": "Nouvelle dose si résiduelle < 0,5 mg/L", "30-10": "Nouvelle dose si résiduelle < 0,5 mg/L", "<10": "Nouvelle dose si résiduelle < 0,5 mg/L", hd: "Si résiduelle < 0,5 mg/L", cvvh: "Selon les dosages", cvvhd: "Selon les dosages" },
      "Tobramycine": { charge: "5–8 mg/kg sur 30 min", ">120": "Pas d'entretien en règle", "30-120": "Nouvelle dose si résiduelle < 0,5 mg/L", "30-10": "Nouvelle dose si résiduelle < 0,5 mg/L", "<10": "Nouvelle dose si résiduelle < 0,5 mg/L", hd: "Si résiduelle < 0,5 mg/L", cvvh: "Selon les dosages", cvvhd: "Selon les dosages" }
    },
    "Fluoroquinolones": {
      "Ofloxacine": { charge: "400 mg", ">120": "200–400 mg /12 h", "30-120": "200–400 mg /12 h", "30-10": "200 mg /24 h", "<10": "100–200 mg /24 h", hd: "200 mg /24 h", cvvh: "400 mg /24 h", cvvhd: "400 mg /24 h" },
      "Ciprofloxacine": { charge: "400 mg IV", ">120": "400 mg /8 h", "30-120": "400 mg /8–12 h", "30-10": "400 mg /24 h", "<10": "400 mg /24 h", hd: "400 mg /24 h, après la séance", cvvh: "400 mg /12 h", cvvhd: "400 mg /12 h" },
      "Lévofloxacine": { charge: "500 mg", ">120": "500 mg /12 h", "30-120": "500 mg /12 h (DFG ≥ 50) ; 250 mg /12 h (20–49)", "30-10": "250 mg /12 h (20–30) ; 125 mg /12 h (10–19)", "<10": "125 mg /24 h", hd: "125 mg /24 h, après la séance", cvvh: "500 mg /24 h", cvvhd: "500 mg /24 h" },
      "Moxifloxacine": { charge: "400 mg", ">120": "400 mg /24 h", "30-120": "400 mg /24 h", "30-10": "400 mg /24 h", "<10": "400 mg /24 h", hd: "400 mg /24 h", cvvh: "400 mg /24 h", cvvhd: "400 mg /24 h" }
    },
    "Anti-Gram positif": {
      "Vancomycine": { charge: "25–30 mg/kg sur 1–2 h", ">120": "30–40 mg/kg/24 h IVSE (plateau 20–25 mg/L)", "30-120": "30 mg/kg/24 h IVSE (plateau 20–25 mg/L)", "30-10": "10–15 mg/kg/24 h IVSE selon les dosages", "<10": "Réinjection selon les dosages", hd: "10 mg/kg après la séance (résiduelle 20–25 mg/L)", cvvh: "15–20 mg/kg/24 h IVSE selon les dosages", cvvhd: "15–20 mg/kg/24 h IVSE selon les dosages" },
      "Teicoplanine": { charge: "12 mg/kg /12 h, 3 à 5 doses", ">120": "12 mg/kg /24 h", "30-120": "6–12 mg/kg /24 h (résiduelle 20–30 mg/L)", "30-10": "4 mg/kg /24 h (selon les dosages)", "<10": "4 mg/kg /24 h (selon les dosages)", hd: "4 mg/kg /24 h", cvvh: "6–8 mg/kg /24 h", cvvhd: "6–8 mg/kg /24 h" },
      "Linézolide": { charge: "600 mg", ">120": "600 mg /12 h", "30-120": "600 mg /12 h", "30-10": "600 mg /12 h", "<10": "600 mg /12 h (cytopénies plus fréquentes)", hd: "600 mg /12 h, dose après la séance", cvvh: "600 mg /12 h", cvvhd: "600 mg /12 h" },
      "Daptomycine": { charge: "10 mg/kg", ">120": "10–12 mg/kg /24 h", "30-120": "10 mg/kg /24 h", "30-10": "10 mg/kg /48 h", "<10": "10 mg/kg /48 h", hd: "10 mg/kg /48 h, après la séance", cvvh: "8–10 mg/kg /24 h", cvvhd: "8–10 mg/kg /24 h" },
      "Clindamycine": { charge: "600–900 mg", ">120": "600–900 mg /8 h", "30-120": "600–900 mg /8 h", "30-10": "600–900 mg /8 h", "<10": "600 mg /8 h", hd: "600 mg /8 h", cvvh: "600 mg /8 h", cvvhd: "600 mg /8 h" }
    },
    "Autres": {
      "Colistine": { charge: "9 MUI sur 1 h", ">120": "4,5 MUI /12 h", "30-120": "4,5 MUI /12 h (DFG ≥ 50) ; 2,75–3,75 MUI /12 h (30–50)", "30-10": "2,25–2,75 MUI /12 h", "<10": "1,75 MUI /12 h", hd: "1,75 MUI /12 h + supplément après la séance", cvvh: "Avis pharmacien (doses élevées)", cvvhd: "Avis pharmacien (doses élevées)" },
      "Cotrimoxazole (pneumocystose, Stenotrophomonas)": { charge: "Dose habituelle", ">120": "TMP 15–20 mg/kg/j en 3–4 prises", "30-120": "TMP 15–20 mg/kg/j", "30-10": "TMP 7,5–10 mg/kg/j", "<10": "TMP 5 mg/kg/j (à éviter)", hd: "TMP 5–7,5 mg/kg/j, après la séance", cvvh: "TMP 10–15 mg/kg/j", cvvhd: "TMP 10–15 mg/kg/j" },
      "Cotrimoxazole (autres indications)": { charge: "800/160 mg", ">120": "800/160 mg /8–12 h", "30-120": "800/160 mg /12 h", "30-10": "400/80 mg /12 h", "<10": "À éviter", hd: "400/80 mg /24 h après la séance", cvvh: "800/160 mg /12 h", cvvhd: "800/160 mg /12 h" },
      "Doxycycline": { charge: "200 mg", ">120": "100 mg /12 h", "30-120": "100 mg /12 h", "30-10": "100 mg /12 h", "<10": "100 mg /12 h", hd: "100 mg /12 h", cvvh: "100 mg /12 h", cvvhd: "100 mg /12 h" },
      "Fidaxomicine": { charge: "—", ">120": "200 mg /12 h PO", "30-120": "200 mg /12 h PO", "30-10": "200 mg /12 h PO", "<10": "200 mg /12 h PO", hd: "200 mg /12 h PO", cvvh: "200 mg /12 h PO", cvvhd: "200 mg /12 h PO" },
      "Métronidazole": { charge: "500 mg", ">120": "500 mg /8 h", "30-120": "500 mg /8 h", "30-10": "500 mg /8 h", "<10": "500 mg /8–12 h", hd: "500 mg /8 h, dose après la séance", cvvh: "500 mg /8 h", cvvhd: "500 mg /8 h" },
      "Rifampicine": { charge: "10 mg/kg", ">120": "10 mg/kg /12 h (max 600 mg/dose)", "30-120": "10 mg/kg /12 h", "30-10": "10 mg/kg /12 h", "<10": "10 mg/kg /12–24 h", hd: "10 mg/kg /24 h", cvvh: "10 mg/kg /12 h", cvvhd: "10 mg/kg /12 h" },
      "Spiramycine": { charge: "3 MUI", ">120": "3 MUI /8 h", "30-120": "3 MUI /8 h", "30-10": "3 MUI /8 h", "<10": "3 MUI /8 h", hd: "3 MUI /8 h", cvvh: "3 MUI /8 h", cvvhd: "3 MUI /8 h" },
      "Tigécycline": { charge: "100 mg (200 mg si infection grave)", ">120": "50 mg /12 h (100 mg /12 h si grave)", "30-120": "50 mg /12 h", "30-10": "50 mg /12 h", "<10": "50 mg /12 h", hd: "50 mg /12 h", cvvh: "50 mg /12 h", cvvhd: "50 mg /12 h" }
    }
  };

  /* ---------------- Modalités d'administration ---------------- */
  window.P17_ATB_MODA = [
    ["Bêta-lactamines", [
      ["Amoxicilline", "2 g sur 30 min", "1–2 g toutes les 4–6 h, perfusion de 30–60 min", "NaCl 0,9 % ou EPPI (instable en glucosé)", "≈ 6–8 h dans le NaCl"],
      ["Amoxicilline-clavulanate", "2 g sur 30 min", "1 g toutes les 6–8 h, perfusion de 30 min", "EPPI ou NaCl 0,9 %", "Courte (1–2 h) : pas de perfusion prolongée"],
      ["Cloxacilline", "2 g sur 30 min", "Perfusion continue 100–200 mg/kg/24 h (ex. 2 g sur 6 h ×4)", "NaCl 0,9 % ou G5 %", "24 h"],
      ["Pipéracilline-tazobactam", "4 g sur 30 min", "4 g toutes les 6 h en perfusion de 4 h, ou 16 g/24 h en continu", "NaCl 0,9 % ou G5 %", "24 h"],
      ["Céfazoline", "2 g sur 30 min", "6–8 g/24 h en continu (ex. 3 g dans 50 mL sur 12 h)", "NaCl 0,9 % ou G5 %", "24 h"],
      ["Céfotaxime", "2 g sur 30 min", "1–2 g toutes les 6–8 h en 30 min, ou continu avec seringues renouvelées toutes les 6 h", "EPPI, NaCl 0,9 %", "≈ 6 h"],
      ["Ceftriaxone", "—", "1–2 g toutes les 24 h (2 g ×2/j si méningite) en 30 min", "EPPI, NaCl 0,9 %", "—"],
      ["Ceftazidime", "2 g sur 30 min", "6 g/24 h en continu, seringues renouvelées toutes les 8 h", "G5 % ou NaCl 0,9 %", "8 h"],
      ["Céfépime", "2 g sur 30 min", "4–6 g/24 h en continu (seringues /12 h) ou 2 g/8 h sur 3–4 h", "G5 % ou NaCl 0,9 %", "12 h à température ambiante"],
      ["Ceftazidime-avibactam", "—", "2,5 g toutes les 8 h en perfusion de 2 h (prolongée jusqu'à 4 h possible)", "NaCl 0,9 % ou G5 %", "12 h"],
      ["Ceftolozane-tazobactam", "—", "1,5 g ou 3 g toutes les 8 h en 1 h (prolongée possible)", "NaCl 0,9 % ou G5 %", "24 h"],
      ["Céfidérocol", "—", "2 g toutes les 8 h en perfusion de 3 h", "NaCl 0,9 % ou G5 %", "6 h"],
      ["Imipénème", "—", "1 g toutes les 6–8 h en 30–60 min", "NaCl 0,9 %", "Courte (≈ 3–4 h) : pas de perfusion continue"],
      ["Méropénème", "2 g sur 30 min", "1–2 g toutes les 8 h en perfusion prolongée de 3 h", "NaCl 0,9 %", "≈ 4–6 h : pas de seringue sur 24 h"],
      ["Ertapénème", "—", "1 g toutes les 24 h en 30 min", "NaCl 0,9 % (pas de glucosé)", "6 h"],
      ["Aztréonam", "2 g sur 30 min", "6–8 g/24 h en continu ou 2 g toutes les 6–8 h", "NaCl 0,9 % ou G5 %", "24 h"],
      ["Témocilline", "2 g sur 30 min", "4–6 g/24 h en continu", "NaCl 0,9 % ou G5 %", "24 h"]
    ]],
    ["Aminosides", [
      ["Amikacine", "25–30 mg/kg dans 100–250 mL en 30 min", "Pas d'entretien systématique : réinjection si résiduelle < 2,5 mg/L", "NaCl 0,9 % ou G5 %", "Dosage du pic à 30 min après la fin (cible 60–80 mg/L)"],
      ["Gentamicine, tobramycine", "5–8 mg/kg en 30 min", "Réinjection si résiduelle < 0,5 mg/L", "NaCl 0,9 % ou G5 %", "Pic cible 30–40 mg/L"]
    ]],
    ["Glycopeptides et anti-Gram positif", [
      ["Vancomycine", "25–30 mg/kg en 1–2 h (max 3 g)", "30 mg/kg/24 h en continu, plateau 20–25 mg/L", "G5 % ou NaCl 0,9 % ; ≤ 5 mg/mL en périphérique, sinon VVC ou midline", "24 h"],
      ["Teicoplanine", "12 mg/kg toutes les 12 h, 3 à 5 doses", "12 mg/kg/24 h (résiduelle 20–30 mg/L)", "NaCl 0,9 % ou G5 %", "24 h"],
      ["Daptomycine", "—", "8–12 mg/kg/24 h en 30 min (ou IV directe 2 min)", "NaCl 0,9 % (pas de glucosé)", "Utiliser rapidement"],
      ["Linézolide", "—", "600 mg toutes les 12 h en 30–120 min, ou per os", "Prêt à l'emploi", "—"],
      ["Clindamycine", "—", "600–900 mg toutes les 8 h en 30–60 min", "NaCl 0,9 % ou G5 %", "24 h"]
    ]],
    ["Autres", [
      ["Ciprofloxacine", "—", "400 mg toutes les 8–12 h en 60 min, ou 750 mg ×2/j per os", "Prêt à l'emploi", "Biodisponibilité orale élevée"],
      ["Lévofloxacine", "—", "500 mg toutes les 12–24 h en 60 min, ou per os", "Prêt à l'emploi", "Biodisponibilité 100 %"],
      ["Métronidazole", "—", "500 mg toutes les 8 h en 30 min, ou per os", "Prêt à l'emploi", "Biodisponibilité 100 %"],
      ["Cotrimoxazole", "—", "800/160 mg toutes les 8–12 h ; forte dose TMP 15–20 mg/kg/j en 3–4 perfusions de 60 min", "G5 % (1 ampoule dans 125 mL minimum)", "6 h"],
      ["Spiramycine", "—", "3 MUI toutes les 8 h en 60 min", "G5 % (100 mL minimum, veinotoxique)", "12 h"],
      ["Colistine", "9 MUI en 60 min", "4,5 MUI toutes les 12 h en 60 min (adapter au DFG)", "NaCl 0,9 %", "24 h"],
      ["Tigécycline", "100 mg (200 mg si grave)", "50 mg toutes les 12 h (100 mg si grave) en 30–60 min", "NaCl 0,9 % ou G5 %", "6 h"],
      ["Rifampicine", "—", "10 mg/kg toutes les 12 h en 60 min, ou per os", "G5 %", "6 h"]
    ]]
  ];
})();
