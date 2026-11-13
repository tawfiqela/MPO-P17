/* =====================================================================
   Configuration de la plateforme — modifier ici le nom du service,
   de l'établissement, la photo de bannière, etc.
   ===================================================================== */
window.P17_CONFIG = {
  appName: "Réa Chir P17",
  etablissement: "CHU Ibn Rochd",
  etablissementAr: "المركز الاستشفائي الجامعي ابن رشد",
  ville: "Casablanca",
  service: "Réanimation Chirurgicale P17",
  serviceBanniere: "Réanimation Chirurgicale",
  pavillon: "Pavillon 17",
  serviceLong: "Service de Réanimation Chirurgicale P17",
  sousTitre: "Protocoles d'anesthésie-réanimation",

  // Photo de l'hôpital pour la bannière d'accueil (optionnel).
  // Déposer le fichier dans assets/img/ puis indiquer son chemin, par ex. :
  // photo: "assets/img/banniere-chu.jpg"
  banniere: { photo: null },

  // Logo officiel du CHU (optionnel) : déposer le fichier fourni par le CHU
  // dans assets/img/ puis indiquer son chemin, par ex. "assets/img/logo-chu.png".
  // Il remplace alors le sigle « CHU » de la barre du haut et de l'accueil.
  logo: null,

  // Annuaire des enseignants et seniors (bouton « Annuaire » de la barre du haut).
  // Une ligne par personne. Retirer « exemple: true » en saisissant les vrais contacts.
  annuaire: [
    { nom: "NOM", prenom: "Prénom", fonction: "Professeur", tel: "06 00 00 00 00", mail: "prenom.nom@exemple.ma", exemple: true },
    { nom: "NOM", prenom: "Prénom", fonction: "Senior", tel: "06 00 00 00 00", mail: "prenom.nom@exemple.ma", exemple: true }
  ],

  // Hommage affiché en tête de la rubrique Antibiothérapie.
  // trait : portrait dessiné, affiché en filigrane derrière toutes les pages d'antibiothérapie.
  hommage: { nom: "Pr Lahoucine Barrou", legende: "ancien chef du service", trait: "assets/img/hommage-trait.webp" },

  // Date de révision affichée sur les fiches (antibiothérapie, anesthésie)
  revision: "novembre 2026",
  version: "1.0.0"
};
