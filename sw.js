/* Service worker : fonctionnement hors connexion de la plateforme Réa Chir P17.
   La liste PRECACHE et la VERSION sont régénérées par scripts/build_sw.py. */
const VERSION = "20261113-c060b69c";
const CACHE = "p17-" + VERSION;
const PRECACHE = [
  "./",
  "./assets/app.css",
  "./assets/calc.js",
  "./assets/config.js",
  "./assets/core.js",
  "./assets/img/atb/Acinetobacter-baumanii.webp",
  "./assets/img/atb/Bacilles-Gram-negatifs.webp",
  "./assets/img/atb/Beta-lactamases.webp",
  "./assets/img/atb/Carbapenemases.webp",
  "./assets/img/atb/Cocci-Gram-positifs.webp",
  "./assets/img/atb/Pseudomonas-aeruginosa.webp",
  "./assets/img/atb/antibio1.webp",
  "./assets/img/atb/antibio2.webp",
  "./assets/img/atb/antibio3.webp",
  "./assets/img/atb/antibio4.webp",
  "./assets/img/atb/antibio5.webp",
  "./assets/img/atb/antibio6.webp",
  "./assets/img/atb/antibio7.webp",
  "./assets/img/atb/antibio8.webp",
  "./assets/img/atb/bactautres.webp",
  "./assets/img/atb/gramneg1.webp",
  "./assets/img/atb/gramneg2.webp",
  "./assets/img/atb/gramneg3.webp",
  "./assets/img/atb/gramneg4.webp",
  "./assets/img/atb/grampos1.webp",
  "./assets/img/atb/grampos2.webp",
  "./assets/img/atb/grampos3.webp",
  "./assets/img/atb/resistance1.webp",
  "./assets/img/atb/resistance2.webp",
  "./assets/img/atb/resistance3.webp",
  "./assets/img/blocs/axillaire.webp",
  "./assets/img/blocs/canal-adducteurs.webp",
  "./assets/img/blocs/carre-lombes.webp",
  "./assets/img/blocs/dentele.webp",
  "./assets/img/blocs/esp.webp",
  "./assets/img/blocs/fascia-iliaca.webp",
  "./assets/img/blocs/femoral.webp",
  "./assets/img/blocs/gaine-droits.webp",
  "./assets/img/blocs/ilio-inguinal.webp",
  "./assets/img/blocs/interscalenique.webp",
  "./assets/img/blocs/paravertebral.webp",
  "./assets/img/blocs/pecs.webp",
  "./assets/img/blocs/peng.webp",
  "./assets/img/blocs/sciatique-poplite.webp",
  "./assets/img/blocs/supraclaviculaire.webp",
  "./assets/img/blocs/tap.webp",
  "./assets/img/decor/bloc-anesthesie.webp",
  "./assets/img/decor/bloc-salle.webp",
  "./assets/img/decor/rea-soins.webp",
  "./assets/img/decor/rea-ventilation.webp",
  "./assets/img/echo/base-m1.webp",
  "./assets/img/echo/base-m2.webp",
  "./assets/img/echo/base-m3.webp",
  "./assets/img/echo/echoabdo.webp",
  "./assets/img/echo/echodiaph.webp",
  "./assets/img/echo/echodtc.webp",
  "./assets/img/echo/echopoumon.webp",
  "./assets/img/echo/echorein.webp",
  "./assets/img/echo/echovascu.webp",
  "./assets/img/echo/ett1.webp",
  "./assets/img/echo/ett2.webp",
  "./assets/img/echo/ettDC.webp",
  "./assets/img/echo/ettHTAP.webp",
  "./assets/img/echo/ettPC.webp",
  "./assets/img/echo/ettVA.webp",
  "./assets/img/echo/ettVD.webp",
  "./assets/img/echo/ettVM.webp",
  "./assets/img/echo/ettpericarde.webp",
  "./assets/img/echo/ettptdvg.webp",
  "./assets/img/echo/ettseg.webp",
  "./assets/img/echo/fig/base-doppler-couleur.webp",
  "./assets/img/echo/fig/base-doppler-pulse.webp",
  "./assets/img/echo/fig/base-echogenicite.webp",
  "./assets/img/echo/fig/base-miroir.webp",
  "./assets/img/echo/fig/base-ombre-renforcement.webp",
  "./assets/img/echo/fig/base-reverberation.webp",
  "./assets/img/echo/fig/dia-epaisseur.webp",
  "./assets/img/echo/fig/dia-sous-costale.webp",
  "./assets/img/echo/fig/dia-tm-course.webp",
  "./assets/img/echo/fig/pp-condensation.webp",
  "./assets/img/echo/fig/pp-epanchement.webp",
  "./assets/img/echo/fig/pp-lignes-a.webp",
  "./assets/img/echo/fig/pp-lignes-b.webp",
  "./assets/img/echo/fig/pp-lus-0.webp",
  "./assets/img/echo/fig/pp-lus-1.webp",
  "./assets/img/echo/fig/pp-lus-2.webp",
  "./assets/img/echo/fig/pp-lus-3.webp",
  "./assets/img/echo/fig/pp-poumon-blanc.webp",
  "./assets/img/echo/fig/pp-tm-bord-de-mer.webp",
  "./assets/img/echo/fig/pp-tm-code-barres.webp",
  "./assets/img/echo/fig/pp-tm-point-poumon.webp",
  "./assets/img/echo/fig/pp-tm-sinusoide.webp",
  "./assets/img/echo/pp-m1.webp",
  "./assets/img/echo/pp-m2.webp",
  "./assets/img/echo/pp-m3.webp",
  "./assets/img/echo/pp-m4.webp",
  "./assets/img/echo/pp-m5.webp",
  "./assets/img/echo/pp-m6.webp",
  "./assets/img/echo/pp-m7.webp",
  "./assets/img/echo/pp-m8.webp",
  "./assets/img/eer/eerecmo.webp",
  "./assets/img/hommage-trait.webp",
  "./assets/modules/accueil.js",
  "./assets/modules/anesth/endoscopie.js",
  "./assets/modules/anesth/gynecologie.js",
  "./assets/modules/anesth/neurochirurgie.js",
  "./assets/modules/anesth/thoracique-cours.js",
  "./assets/modules/anesth/thoracique.js",
  "./assets/modules/anesth/transplantation-renale.js",
  "./assets/modules/anesth/traumatologie.js",
  "./assets/modules/anesth/urologie.js",
  "./assets/modules/anesth/visceral.js",
  "./assets/modules/anesthesie.js",
  "./assets/modules/annuaire.js",
  "./assets/modules/antibiotherapie.js",
  "./assets/modules/atb-data.js",
  "./assets/modules/atb-pheno.js",
  "./assets/modules/bibliographie.js",
  "./assets/modules/blocs.js",
  "./assets/modules/calculateurs.js",
  "./assets/modules/commun.js",
  "./assets/modules/decor.js",
  "./assets/modules/echographie.js",
  "./assets/modules/eer.js",
  "./assets/modules/enseignement.js",
  "./assets/modules/periop.js",
  "./assets/modules/perop.js",
  "./assets/modules/terrains.js",
  "./assets/modules/urgences.js",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512-maskable.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./index.html",
  "./manifest.webmanifest"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("p17-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Bibliographie : réseau d'abord (contenu mis à jour chaque jour), cache en secours
  if (url.pathname.endsWith("/publications.json") || url.pathname.endsWith("/recommandations.json")) {
    event.respondWith(
      fetch(req).then(res => {
        if (res.ok && url.origin === location.origin) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req, { ignoreSearch: true }))
    );
    return;
  }

  // Polices Google : cache au premier passage
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; }))
    );
    return;
  }

  if (url.origin !== location.origin) return;

  // Application : cache d'abord, mise à jour en arrière-plan
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      const net = fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
