#!/usr/bin/env python3
"""Compose les fiches-mémos d'échographie (même gabarit que les fiches ETT :
720 × 1040, bandeau ardoise, encadrés à titre bleu marine) à partir des
schémas de scripts/echo_figures.py, puis les exporte en WebP.

    python3 scripts/echo_figures.py && python3 scripts/echo_posters.py
"""
import asyncio, io, os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIG = os.path.join(ROOT, "assets", "img", "echo", "fig")
OUT = os.path.join(ROOT, "assets", "img", "echo")
F = lambda n: "file://" + os.path.join(FIG, n + ".webp")

CSS = """
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:720px;height:1040px;overflow:hidden}
body{font-family:Inter,'Liberation Sans',sans-serif;background:#e7ecf2;color:#15304d;position:relative}
.hd{background:linear-gradient(180deg,#536d8b,#465f7c);color:#fff;padding:14px 20px 13px}
.hd h1{font-size:39px;font-weight:800;letter-spacing:-.6px;line-height:1.04}
.hd h2{font-size:27px;font-weight:800;line-height:1.1;margin-top:3px;color:#f2f6fb}
.wrap{padding:10px 12px 0;display:flex;flex-direction:column;gap:9px}
.bx{background:#f6f8fb;border:1.5px solid #9db1c7;border-radius:3px;overflow:hidden}
.bh{background:#1f3b60;color:#fff;font-weight:800;font-size:16px;padding:5px 10px;letter-spacing:-.1px}
.bh small{font-weight:600;font-size:13px;color:#cfe0f2;margin-left:6px}
.bb{padding:8px 10px;font-size:13px;line-height:1.36}
.k{color:#1c5fa8;font-weight:700}
.r{color:#c0262d;font-weight:700}
.g{color:#0f7a4a;font-weight:700}
b{font-weight:700;color:#0f2742}
ul{padding-left:15px}
li{margin:1.5px 0}
.row{display:flex;gap:10px;align-items:flex-start}
.col{flex:1;min-width:0}
.us{display:block;width:100%;border-radius:3px;background:#000}
.cap{font-size:11.5px;color:#3b5573;margin-top:3px;text-align:center;font-weight:600}
.warn{color:#c0262d;font-weight:800}
table{border-collapse:collapse;width:100%;font-size:12.2px}
th,td{border:1px solid #b7c6d6;padding:3px 5px;text-align:left;vertical-align:top}
th{background:#dde6f0;font-weight:700}
.c{text-align:center}
.ft{position:absolute;left:12px;right:12px;bottom:7px;display:flex;justify-content:space-between;font-size:10px;color:#6a7f95;font-weight:600}
.chip{display:inline-block;padding:1px 7px;border-radius:9px;font-weight:700;font-size:12px}
.tree{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.node{background:#fff;border:1.5px solid #9db1c7;border-radius:6px;padding:5px 8px;font-size:12.6px;line-height:1.3}
.node b{color:#1f3b60}
.to{display:block;margin-top:3px;font-weight:800}
.dx{display:inline-block;margin-top:3px;padding:2px 8px;border-radius:5px;color:#fff;font-weight:800;font-size:12.4px}
.ep{background:#7a3db8}.pn{background:#c0262d}.oap{background:#1c5fa8}.px{background:#0f7a4a}.bp{background:#5b6b7d}
.step{display:flex;gap:8px;align-items:flex-start;margin:4px 0}
.num{flex:0 0 22px;height:22px;border-radius:11px;background:#1f3b60;color:#fff;font-weight:800;font-size:13px;display:grid;place-items:center}
svg text{font-family:Inter,sans-serif}
"""

FOOT = '<div class="ft"><span>Service de Réanimation Chirurgicale P17 · CHU Ibn Rochd, Casablanca</span><span>Schémas originaux · à valider par l\'équipe</span></div>'


def page(t1, t2, body):
    return f"""<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>{CSS}</style></head>
<body><div class="hd"><h1>{t1}</h1>{f'<h2>{t2}</h2>' if t2 else ''}</div><div class="wrap">{body}</div>{FOOT}</body></html>"""


def box(title, inner, sub=""):
    return f'<div class="bx"><div class="bh">{title}{f"<small>{sub}</small>" if sub else ""}</div><div class="bb">{inner}</div></div>'


def fig(name, cap="", w=None):
    st = f' style="width:{w}px"' if w else ""
    return f'<div{st}><img class="us" src="{F(name)}">{f"<div class=cap>{cap}</div>" if cap else ""}</div>'


# ------------------------------------------------------------------ schémas vectoriels
PROBES = """<svg viewBox="0 0 690 126" width="100%">
 <g transform="translate(20,8)">
  <rect x="18" y="0" width="58" height="62" rx="8" fill="#2a4566"/><rect x="10" y="58" width="74" height="12" rx="3" fill="#7fa3c8"/>
  <rect x="104" y="18" width="60" height="44" fill="#111"/><text x="0" y="96" font-size="15" font-weight="800" fill="#1f3b60">Linéaire</text>
  <text x="0" y="111" font-size="12" fill="#3b5573">7–15 MHz · superficiel</text></g>
 <g transform="translate(250,8)">
  <rect x="20" y="0" width="54" height="56" rx="8" fill="#2a4566"/><path d="M8 62 Q47 46 86 62 L86 70 Q47 56 8 70Z" fill="#7fa3c8"/>
  <path d="M120 20 L150 20 L176 66 L94 66Z" fill="#111"/><text x="0" y="96" font-size="15" font-weight="800" fill="#1f3b60">Convexe</text>
  <text x="0" y="111" font-size="12" fill="#3b5573">2–5 MHz · abdomen, poumon</text></g>
 <g transform="translate(480,8)">
  <rect x="22" y="0" width="44" height="58" rx="8" fill="#2a4566"/><rect x="26" y="56" width="36" height="12" rx="3" fill="#7fa3c8"/>
  <path d="M135 16 L180 68 L90 68Z" fill="#111"/><text x="0" y="96" font-size="15" font-weight="800" fill="#1f3b60">Sectorielle</text>
  <text x="0" y="111" font-size="12" fill="#3b5573">1–5 MHz · cœur, diaphragme</text></g>
</svg>"""

ORIENT = """<svg viewBox="0 0 330 150" width="100%">
 <rect x="18" y="20" width="44" height="78" rx="9" fill="#2a4566"/><rect x="12" y="94" width="56" height="13" rx="3" fill="#7fa3c8"/>
 <rect x="54" y="34" width="10" height="22" rx="2" fill="#2ec4ff"/><text x="2" y="132" font-size="12" font-weight="700" fill="#1f3b60">Repère de la sonde</text>
 <path d="M84 60 L128 60" stroke="#1c5fa8" stroke-width="3" marker-end="url(#a)"/>
 <defs><marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8Z" fill="#1c5fa8"/></marker></defs>
 <rect x="140" y="10" width="180" height="120" rx="6" fill="#111"/><path d="M186 22 L274 22 L304 118 L156 118Z" fill="#3a3f46"/>
 <circle cx="160" cy="26" r="7" fill="#2ec4ff"/><text x="150" y="146" font-size="12" font-weight="700" fill="#1f3b60">Point de repère à l'écran</text>
</svg>"""

TORSO = """<svg viewBox="0 0 690 250" width="100%">
 <g transform="translate(10,6)">
  <text x="130" y="14" font-size="14" font-weight="800" fill="#1f3b60" text-anchor="middle">Face antérieure</text>
  <path d="M60 30 Q130 18 200 30 L232 70 L222 236 L38 236 L28 70Z" fill="#dfe8f2" stroke="#4b6584" stroke-width="2"/>
  <line x1="130" y1="26" x2="130" y2="236" stroke="#4b6584" stroke-width="1.5" stroke-dasharray="4 4"/>
  <line x1="104" y1="26" x2="104" y2="236" stroke="#1c5fa8" stroke-width="2"/><line x1="156" y1="26" x2="156" y2="236" stroke="#1c5fa8" stroke-width="2"/>
  <line x1="52" y1="62" x2="44" y2="236" stroke="#c0262d" stroke-width="2"/><line x1="208" y1="62" x2="216" y2="236" stroke="#c0262d" stroke-width="2"/>
  <line x1="30" y1="132" x2="230" y2="132" stroke="#4b6584" stroke-width="1.5" stroke-dasharray="6 4"/>
  <text x="78" y="100" font-size="15" font-weight="800" fill="#1f3b60" text-anchor="middle">1</text><text x="78" y="186" font-size="15" font-weight="800" fill="#1f3b60" text-anchor="middle">2</text>
  <text x="182" y="100" font-size="15" font-weight="800" fill="#1f3b60" text-anchor="middle">1</text><text x="182" y="186" font-size="15" font-weight="800" fill="#1f3b60" text-anchor="middle">2</text>
  <circle cx="86" cy="80" r="6" fill="#f2a400"/><circle cx="78" cy="160" r="6" fill="#f2a400"/>
 </g>
 <g transform="translate(270,6)">
  <text x="120" y="14" font-size="14" font-weight="800" fill="#1f3b60" text-anchor="middle">Face latérale</text>
  <path d="M70 34 Q120 22 170 34 L190 96 L184 236 L56 236 L50 96Z" fill="#dfe8f2" stroke="#4b6584" stroke-width="2"/>
  <path d="M170 34 Q210 10 228 -2" stroke="#4b6584" stroke-width="10" stroke-linecap="round" fill="none" opacity=".35"/>
  <line x1="84" y1="40" x2="74" y2="236" stroke="#c0262d" stroke-width="2"/><line x1="160" y1="40" x2="168" y2="236" stroke="#7a3db8" stroke-width="2"/>
  <line x1="52" y1="132" x2="188" y2="132" stroke="#4b6584" stroke-width="1.5" stroke-dasharray="6 4"/>
  <text x="120" y="100" font-size="15" font-weight="800" fill="#1f3b60" text-anchor="middle">3</text><text x="120" y="186" font-size="15" font-weight="800" fill="#1f3b60" text-anchor="middle">4</text>
  <text x="182" y="100" font-size="13" font-weight="800" fill="#1f3b60">5</text><text x="182" y="186" font-size="13" font-weight="800" fill="#1f3b60">6</text>
  <circle cx="172" cy="178" r="6" fill="#f2a400"/>
 </g>
 <g transform="translate(500,26)" font-size="12" fill="#15304d">
  <line x1="0" y1="6" x2="22" y2="6" stroke="#1c5fa8" stroke-width="3"/><text x="28" y="10">Ligne parasternale</text>
  <line x1="0" y1="30" x2="22" y2="30" stroke="#c0262d" stroke-width="3"/><text x="28" y="34">Ligne axillaire ant.</text>
  <line x1="0" y1="54" x2="22" y2="54" stroke="#7a3db8" stroke-width="3"/><text x="28" y="58">Ligne axillaire post.</text>
  <line x1="0" y1="78" x2="22" y2="78" stroke="#4b6584" stroke-width="2" stroke-dasharray="6 4"/><text x="28" y="82">Sup. / inf. (mamelon)</text>
  <circle cx="11" cy="102" r="6" fill="#f2a400"/><text x="28" y="106">Points BLUE</text>
  <text x="0" y="132" font-weight="700">1–2 antérieures</text><text x="0" y="150" font-weight="700">3–4 latérales</text><text x="0" y="168" font-weight="700">5–6 postérieures</text>
  <text x="0" y="192">× 2 hémithorax</text><text x="0" y="210" font-weight="800" fill="#1c5fa8">= 12 régions</text>
 </g>
</svg>"""

PUNCTURE = """<svg viewBox="0 0 300 170" width="100%">
 <rect x="0" y="0" width="300" height="34" fill="#f1dcc8"/><text x="8" y="22" font-size="12" font-weight="700" fill="#6b4a2a">Peau et muscles</text>
 <ellipse cx="80" cy="74" rx="62" ry="20" fill="#e9e3d2" stroke="#7d6a4a" stroke-width="2"/><text x="80" y="79" font-size="12" font-weight="700" fill="#5b4a2a" text-anchor="middle">Côte sup.</text>
 <ellipse cx="80" cy="150" rx="62" ry="20" fill="#e9e3d2" stroke="#7d6a4a" stroke-width="2"/><text x="80" y="155" font-size="12" font-weight="700" fill="#5b4a2a" text-anchor="middle">Côte inf.</text>
 <circle cx="112" cy="100" r="5" fill="#2b5fd0"/><circle cx="124" cy="100" r="5" fill="#d0322b"/><circle cx="136" cy="100" r="4" fill="#e8b400"/>
 <text x="148" y="104" font-size="11.5" font-weight="700" fill="#c0262d">V A N sous la côte</text>
 <line x1="290" y1="122" x2="40" y2="124" stroke="#1f3b60" stroke-width="3"/><path d="M40 124 L54 118 L54 130Z" fill="#1f3b60"/>
 <text x="168" y="118" font-size="11.5" font-weight="800" fill="#0f7a4a">Aiguille : bord sup. de la côte inf.</text>
</svg>"""


# ------------------------------------------------------------------ fiches-mémos
POSTERS = {}

POSTERS["base-m1"] = page("Échographie : les bases", "Sondes, réglages, orientation, modes", "".join([
    box("Les sondes", PROBES + '<div style="margin-top:4px"><span class="k">Haute fréquence</span> = meilleure résolution mais faible pénétration ; <span class="k">basse fréquence</span> = exploration profonde, résolution moindre.</div>'),
    box("Réglages essentiels", """<div class="row"><div class="col"><ul>
      <li><b>Preset</b> adapté : cardiaque, abdominal, pulmonaire, vasculaire</li>
      <li><b>Profondeur</b> : structure d'intérêt au centre ou aux 2/3 de l'écran</li>
      <li><b>Gain global</b> et <b>courbe de gain (TGC)</b> : liquide noir, tissus gris homogènes de haut en bas</li></ul></div>
      <div class="col"><ul><li><b>Focale</b> au niveau de la cible</li><li><b>Zoom</b> pour les petites structures et les mesures</li>
      <li><b>Gel</b> de l'image et <b>ciné-boucle</b> avant de mesurer ; mesures au <b>caliper</b></li>
      <li>Désactiver harmonique et filtres pour analyser les <b>artefacts pulmonaires</b></li></ul></div></div>"""),
    box("Orientation de la sonde", f"""<div class="row"><div style="width:300px">{ORIENT}</div><div class="col"><ul>
      <li>Le <b>repère de la sonde</b> (encoche, ligne lumineuse) correspond au <b>point de repère</b> affiché sur l'écran</li>
      <li><b>Coupe longitudinale</b> : repère vers la tête → crâne à gauche de l'écran</li>
      <li><b>Coupe transversale</b> : repère vers la droite du patient → droite du patient à gauche de l'écran</li>
      <li><b>Échocardiographie</b> : convention cardiologique, repère d'écran à droite</li></ul></div></div>
      <div style="margin-top:4px"><span class="k">Mouvements</span> : glisser (translation), basculer, incliner, pivoter (rotation), comprimer.</div>"""),
    box("Les modes", """<table><tr><th>Mode</th><th>Principe</th><th>Utilisation en réanimation</th></tr>
      <tr><td><b>2D (mode B)</b></td><td>Image en coupe en niveaux de gris</td><td>Anatomie, épanchements, condensations, cavités cardiaques</td></tr>
      <tr><td><b>TM (mode M)</b></td><td>Mouvement le long d'une ligne en fonction du temps</td><td>Glissement pleural, course diaphragmatique, TAPSE, VCI</td></tr>
      <tr><td><b>Doppler couleur</b></td><td>Direction et vitesse moyenne des flux codées en couleur</td><td>Vaisseaux, régurgitations, abords vasculaires</td></tr>
      <tr><td><b>Doppler pulsé</b></td><td>Spectre des vitesses en un point précis</td><td>ITV sous-aortique, flux mitral, doppler transcrânien et rénal</td></tr>
      <tr><td><b>Doppler continu</b></td><td>Vitesses élevées, sans localisation</td><td>Sténoses, IT (PAPs) ; <b>tissulaire</b> : S', e'</td></tr>
</table>"""),
]))

POSTERS["base-m2"] = page("Sémiologie échographique", "Échogénicité et artefacts", "".join([
    box("Décrire une image", """<ul><li><b>Siège</b>, <b>taille</b> (deux ou trois axes), <b>forme</b>, <b>contours</b> (nets, flous, irréguliers)</li>
      <li><b>Échostructure</b> (homogène, hétérogène) et <b>échogénicité</b> comparée à un tissu de référence</li>
      <li><b>Vascularisation</b> au Doppler couleur, <b>compressibilité</b>, <b>mobilité</b> avec la respiration</li></ul>"""),
    box("Échogénicité", '<div style="width:480px;margin:0 auto">' + fig("base-echogenicite") + '</div>' + """<ul style="margin-top:6px">
      <li><span class="k">Anéchogène</span> (noir) : liquide pur (vessie, vésicule, vaisseaux, épanchement, kyste)</li>
      <li><span class="k">Hypoéchogène</span> : moins échogène que le tissu de référence (muscle, œdème, hématome récent)</li>
      <li><span class="k">Isoéchogène</span> : même échogénicité que le tissu de référence (foie, rate)</li>
      <li><span class="k">Hyperéchogène</span> (blanc) : interfaces, graisse, fibrose, calcifications, os, air</li>
      <li>Décrire aussi : <b>homogène / hétérogène</b>, contours <b>nets / flous</b>, forme, taille sur deux axes</li></ul>"""),
    box("Artefacts utiles", f"""<div class="row"><div class="col">{fig("base-ombre-renforcement")}</div><div class="col">{fig("base-reverberation")}</div></div>
      <div class="row" style="margin-top:6px"><div class="col"><ul>
      <li><span class="k">Cône d'ombre</span> : arrêt du faisceau derrière un calcul, l'os ou l'air</li>
      <li><span class="k">Renforcement postérieur</span> : derrière un liquide (kyste, vésicule, vessie)</li>
      <li><span class="k">Réverbération</span> : échos répétés entre sonde et interface très réfléchissante (lignes A)</li></ul></div>
      <div class="col"><ul><li><span class="k">Queue de comète</span> : artefact vertical né d'une petite interface (lignes B)</li>
      <li><span class="k">Image en miroir</span> : foie reproduit au-dessus du diaphragme si la base est aérée ; disparaît (rachis visible) en cas d'épanchement</li>
      <li><span class="k">Ombre de bord</span> : sur les contours des structures arrondies</li></ul></div></div>"""),
]))

POSTERS["base-m3"] = page("Doppler", "Principes et pratique au lit", "".join([
    box("Doppler couleur", f"""<div class="row"><div style="width:280px">{fig("base-doppler-couleur")}</div><div class="col"><ul>
      <li>Code <b>BART</b> : <span class="k">B</span>lue <span class="k">A</span>way, <span class="k">R</span>ed <span class="k">T</span>oward (bleu s'éloigne, rouge vient vers la sonde)</li>
      <li>La couleur dépend de la <b>direction</b> du flux, pas du type de vaisseau</li>
      <li><b>Échelle de vitesse (PRF)</b> trop basse : <span class="r">aliasing</span> (mosaïque) ; trop haute : flux lents non vus</li>
      <li>Boîte couleur petite et gain ajusté juste sous l'apparition de bruit</li></ul></div></div>"""),
    box("Doppler pulsé et continu", f"""<div class="row"><div style="width:330px">{fig("base-doppler-pulse")}</div><div class="col"><ul>
      <li><span class="k">Pulsé</span> : vitesses en un point précis (volume d'échantillonnage) ; ITV, Vmax, index de résistance</li>
      <li>Limite de Nyquist = PRF / 2 ; au-delà, aliasing</li>
      <li><span class="k">Continu</span> : vitesses élevées sans localisation (sténose, IT, IA)</li>
      <li><span class="k">Tissulaire</span> : vitesses myocardiques (S', e')</li></ul></div></div>"""),
    box("Angle d'insonation", """<div class="row"><div class="col">Δf = 2 · f₀ · V · cos θ / c<br><b>Aligner le faisceau sur le flux</b> :
      θ &lt; 20° : erreur &lt; 6 % ; <span class="r">θ &gt; 60° : mesure non fiable</span> ; θ = 90° : pas de signal.</div>
      <div class="col">En échocardiographie, pas de correction d'angle : chercher la fenêtre où le flux est parallèle au faisceau.</div></div>"""),
    box("Applications en réanimation", """<table><tr><th>Mesure</th><th>Technique</th><th>Intérêt</th></tr>
      <tr><td><b>ITV sous-aortique</b></td><td>Pulsé, apicale 5 cavités</td><td>Volume d'éjection, débit cardiaque, épreuve de remplissage</td></tr>
      <tr><td><b>Doppler transcrânien</b></td><td>Pulsé, fenêtre temporale, ACM</td><td>Vm, index de pulsatilité, vasospasme</td></tr>
      <tr><td><b>Index de résistance rénal</b></td><td>Pulsé, artères interlobaires</td><td>IR &gt; 0,70 : vasoconstriction rénale</td></tr>
      <tr><td><b>Thrombose veineuse</b></td><td>Compression ± couleur</td><td>Veine incompressible = thrombose</td></tr>
      <tr><td><b>Abords vasculaires</b></td><td>2D + couleur</td><td>Artère pulsatile non compressible ; veine compressible</td></tr></table>"""),
]))

POSTERS["pp-m1"] = page("Échographie pleuro-pulmonaire", "Sémiologie de base (1/2)", "".join([
    box("Le repère : signe de la chauve-souris", f"""<div class="row"><div style="width:260px">{fig("pp-lignes-a")}</div><div class="col"><ul>
      <li>Sonde perpendiculaire aux côtes : <b>deux côtes</b> et leurs <b>cônes d'ombre</b> encadrent la <span class="k">ligne pleurale</span></li>
      <li>Ligne pleurale : environ 0,5 cm sous la ligne costale, hyperéchogène</li>
      <li><span class="k">Lignes A</span> : réverbérations horizontales de la ligne pleurale, à intervalle régulier (= distance peau–plèvre)</li>
      <li>Lignes A + glissement = <b>aération normale</b></li></ul></div></div>"""),
    box("Glissement pleural (mode TM)", f"""<div class="row" style="justify-content:center"><div style="width:300px">{fig("pp-tm-bord-de-mer", "Bord de mer : glissement présent")}</div><div style="width:300px">{fig("pp-tm-code-barres", "Code-barres (stratosphère) : glissement aboli")}</div></div>
      <div style="margin-top:5px">Aboli : <span class="r">pneumothorax</span>, apnée, intubation sélective, symphyse, SDRA sévère. <span class="k">Pouls pulmonaire</span> (battements cardiaques transmis) : poumon au contact, pas de pneumothorax.</div>"""),
    box("Lignes B : syndrome interstitiel", f"""<div class="row"><div style="width:260px">{fig("pp-lignes-b")}</div><div class="col"><b>Critères</b> : artefact en queue de comète
      <ul><li>né de la ligne pleurale</li><li>hyperéchogène, bien défini</li><li>jusqu'au bas de l'écran sans s'atténuer</li><li>efface les lignes A</li><li>mobile avec le glissement</li></ul>
      <span class="k">≥ 3 par espace</span> : syndrome interstitiel (œdème, SDRA, pneumopathie, contusion)</div></div>
      <div class="row" style="margin-top:6px"><div style="width:200px">{fig("pp-poumon-blanc")}</div><div class="col"><span class="k">Lignes B coalescentes</span> (« poumon blanc ») : perte d'aération sévère.
      <ul><li>Diffuses, bilatérales, régulières, avec glissement : <b>œdème hydrostatique</b> (profil B)</li>
      <li>Focales, irrégulières, plèvre épaissie, zones épargnées : <b>SDRA</b>, pneumopathie</li></ul></div></div>"""),
]))

POSTERS["pp-m2"] = page("Échographie pleuro-pulmonaire", "Sémiologie de base (2/2)", "".join([
    box("Condensation alvéolaire", f"""<div class="row"><div style="width:280px">{fig("pp-condensation")}</div><div class="col"><ul>
      <li><span class="k">Aspect tissulaire</span> (hépatisation) sous la ligne pleurale</li>
      <li><span class="k">Shred sign</span> : limite profonde irrégulière avec le poumon aéré</li>
      <li><span class="k">Bronchogramme aérien dynamique</span> (mobile) : pneumonie</li>
      <li>Bronchogramme <b>statique</b> ou absent, perte de volume : atélectasie de résorption</li>
      <li>Condensation déclive et basale du patient couché : atélectasie</li></ul></div></div>"""),
    box("Épanchement pleural", f"""<div class="row"><div style="width:280px">{fig("pp-epanchement")}</div><div class="col"><ul>
      <li>Image <span class="k">anéchogène déclive</span> entre plèvre pariétale, diaphragme et poumon</li>
      <li><span class="k">Signe du quadrilatère</span> : épanchement délimité par la ligne pleurale, les ombres costales et la ligne pulmonaire</li>
      <li>Poumon atélectasié flottant (« méduse »)</li>
      <li>Disparition de l'image en miroir, rachis visible au-dessus du diaphragme</li></ul></div></div>
      <div class="row" style="margin-top:6px"><div style="width:280px">{fig("pp-tm-sinusoide")}</div><div class="col"><span class="k">Signe sinusoïde</span> (TM) : la ligne pulmonaire se rapproche de la plèvre pariétale à l'inspiration. Confirme un épanchement liquidien peu visqueux.</div></div>"""),
    box("Point poumon : pneumothorax", f"""<div class="row"><div style="width:280px">{fig("pp-tm-point-poumon")}</div><div class="col">Alternance, au même endroit, de <b>code-barres</b> (plèvres séparées) et de <b>bord de mer</b> (poumon au contact).
      <span class="k">Spécificité proche de 100 %</span>. Sa position renseigne sur la taille du pneumothorax.</div></div>"""),

]))

POSTERS["pp-m3"] = page("Échographie pleuro-pulmonaire", "Protocole d'examen et score LUS", "".join([
    box("Les 12 régions", '<div style="width:86%;margin:0 auto">' + TORSO + '</div>' + '<div>Patient couché : l\'air monte (régions <b>antérieures</b> : pneumothorax), les liquides et les condensations descendent (régions <b>postérieures et basales</b>). Point PLAPS : ligne axillaire postérieure, au niveau du point BLUE inférieur.</div>'),
    box("Cotation de chaque région", f"""<div class="row">
      <div class="col">{fig("pp-lus-0")}<div class="cap"><b>0</b> · lignes A ou ≤ 2 lignes B</div></div>
      <div class="col">{fig("pp-lus-1")}<div class="cap"><b>1</b> · ≥ 3 lignes B espacées</div></div>
      <div class="col">{fig("pp-lus-2")}<div class="cap"><b>2</b> · lignes B coalescentes</div></div>
      <div class="col">{fig("pp-lus-3")}<div class="cap"><b>3</b> · condensation</div></div></div>
      <div style="margin-top:6px">Score LUS = somme des 12 régions, de <b>0</b> (aération normale) à <b>36</b> (perte d'aération complète). Coter l'aspect <b>le plus péjoratif</b> de chaque région.</div>"""),
    box("Interprétation", """<div class="row"><div class="col"><b>Sevrage ventilatoire</b> (fin d'épreuve de VS, Soummer 2012) :
      <ul><li><span class="g">LUS &lt; 13</span> : risque faible de détresse après extubation</li><li><span class="r">LUS &gt; 17</span> : risque élevé</li></ul></div>
      <div class="col"><b>Suivi</b> : comparer des examens réalisés dans les mêmes conditions (position, PEEP, FiO₂). Utile pour atélectasies, pneumopathie, SDRA, œdème.</div></div>"""),
    box("Score de réaération", """<table><tr><th>Évolution d'une région</th><th class="c">Points</th><th>Perte d'aération</th><th class="c">Points</th></tr>
      <tr><td>B1 → N, B2 → B1, C → B2</td><td class="c">+1</td><td>N → B1, B1 → B2, B2 → C</td><td class="c">−1</td></tr>
      <tr><td>B2 → N, C → B1</td><td class="c">+3</td><td>N → B2, B1 → C</td><td class="c">−3</td></tr>
      <tr><td>C → N</td><td class="c">+5</td><td>N → C</td><td class="c">−5</td></tr></table>
      <div style="margin-top:4px">Somme des 12 régions : quantifie le recrutement après PEEP ou manœuvre (Bouhemad 2011) et la réaération sous antibiothérapie.</div>"""),
]))

POSTERS["pp-m4"] = page("Échographie pleuro-pulmonaire", "Profils diagnostiques (protocole BLUE)", "".join([
    box("Démarche", """<div style="text-align:center;margin-bottom:6px"><span class="node" style="display:inline-block"><b>Glissement pleural antérieur ?</b></span></div>
      <div class="tree"><div>
        <div class="cap" style="text-align:left;font-size:13px;color:#0f7a4a">PRÉSENT</div>
        <div class="node"><b>Profil B</b> : lignes B antérieures bilatérales<span class="to">→ <span class="dx oap">Œdème pulmonaire hydrostatique</span></span></div>
        <div class="node" style="margin-top:6px"><b>Profil A/B</b> (lignes B d'un seul côté) ou <b>profil C</b> (condensation antérieure)<span class="to">→ <span class="dx pn">Pneumonie</span></span></div>
        <div class="node" style="margin-top:6px"><b>Profil A</b> : lignes A antérieures<span class="to">→ thrombose veineuse profonde ?</span>
          <div style="margin-top:4px">Oui → <span class="dx ep">Embolie pulmonaire</span></div>
          <div style="margin-top:4px">Non → PLAPS ? Oui → <span class="dx pn">Pneumonie</span></div>
          <div style="margin-top:4px">Non, pas de PLAPS → <span class="dx bp">BPCO, asthme</span></div></div></div>
      <div>
        <div class="cap" style="text-align:left;font-size:13px;color:#c0262d">ABOLI</div>
        <div class="node"><b>Profil B'</b> : lignes B sans glissement<span class="to">→ <span class="dx pn">Pneumonie</span></span></div>
        <div class="node" style="margin-top:6px"><b>Profil A'</b> : lignes A sans glissement<span class="to">→ point poumon ?</span>
          <div style="margin-top:4px">Oui → <span class="dx px">Pneumothorax</span></div>
          <div style="margin-top:4px">Non → pneumothorax probable si clinique évocatrice ; autre imagerie si doute</div></div>
        <div class="node" style="margin-top:6px"><b>PLAPS</b> (« posterolateral alveolar and/or pleural syndrome ») : condensation et/ou épanchement au point PLAPS</div></div></div>"""),
    box("Points d'examen", """<ul><li>Poser les deux mains du patient sur son thorax, petit doigt sous la clavicule, pouces exclus</li>
      <li><b>Point BLUE supérieur</b> : base du majeur et de l'annulaire de la main supérieure</li>
      <li><b>Point BLUE inférieur</b> : milieu de la paume de la main inférieure</li>
      <li><b>Point PLAPS</b> : à la hauteur du point inférieur, sur la ligne axillaire postérieure (le plus en arrière possible)</li>
      <li><b>Thrombose veineuse</b> : compression des veines fémorale commune et poplitée ; veine incompressible = thrombose</li></ul>"""),
    box("Performances et limites", """<ul><li>Protocole conçu pour l'<b>insuffisance respiratoire aiguë</b> du patient non ventilé : diagnostic correct dans environ 90 % des cas (Lichtenstein 2008)</li>
      <li>Examen court : 3 points par hémithorax + recherche de thrombose veineuse</li>
      <li class="warn">En postopératoire et sous ventilation : atélectasies déclives fréquentes, PLAPS peu spécifique d'une pneumonie</li>
      <li>Toujours associer l'<b>échocardiographie</b> (FEVG, pressions de remplissage, VD) et la clinique</li></ul>"""),
    box("Variante : protocole FALLS (remplissage)", """Choc sans cause évidente : après exclusion d'une tamponnade, d'une dilatation du VD et d'un pneumothorax, le remplissage est poursuivi tant que le profil reste <b>A</b>.
      <span class="r">L'apparition de lignes B</span> signe la limite de tolérance : arrêter l'expansion volémique.""")
]))

POSTERS["pp-m5"] = page("Épanchement pleural", "Diagnostic, quantification, ponction", "".join([
    box("Mesure", f"""<div class="row"><div style="width:270px">{fig("pp-epanchement")}</div><div class="col"><ul>
      <li>Patient en <b>décubitus dorsal</b>, tronc à 15°</li><li>Base, <b>ligne axillaire postérieure</b>, coupe transversale</li>
      <li>En <b>fin d'expiration</b>, sonde perpendiculaire à la paroi</li>
      <li><span class="k">Sep</span> = distance maximale entre plèvre pariétale et plèvre viscérale (poumon)</li></ul></div></div>"""),
    box("Estimation du volume", """<table><tr><th>Méthode</th><th>Position</th><th>Formule</th></tr>
      <tr><td><b>Balik</b> (2006)</td><td>Décubitus, tronc 15°</td><td>V (mL) = 20 × Sep (mm)</td></tr>
      <tr><td><b>Eibenberger</b></td><td>Décubitus dorsal</td><td>V (mL) = 47,6 × distance (mm) − 837</td></tr>
      <tr><td><b>Goecke</b></td><td>Assis</td><td>V (mL) = 70 × (hauteur latérale + sous-pulmonaire, cm)</td></tr>
      <tr><td><b>Remérand</b></td><td>Décubitus</td><td>V (mL) = longueur paravertébrale (cm) × surface (cm²)</td></tr></table>
      <div style="margin-top:4px"><span class="k">Vignon</span> : distance &gt; <b>45 mm à droite</b> ou &gt; <b>50 mm à gauche</b> → volume ≥ 800 mL probable.
      Estimation approximative (± 200 à 400 mL), moins fiable si condensation ou cloisonnement.</div>"""),
    box("Caractérisation", """<table><tr><th>Aspect</th><th>Orientation</th></tr>
      <tr><td><b>Anéchogène</b></td><td>Transsudat ou exsudat</td></tr>
      <tr><td><b>Échogène homogène</b>, échos tourbillonnants (« plancton »)</td><td>Hémothorax, empyème</td></tr>
      <tr><td><b>Cloisonné</b>, fibrineux, logettes</td><td>Exsudat, empyème : drainage difficile, discuter fibrinolyse ou chirurgie</td></tr>
      <tr><td><b>Nodules pleuraux</b>, épaississement &gt; 1 cm</td><td>Origine néoplasique possible</td></tr></table>"""),
    box("Ponction et drainage échoguidés", f"""<div class="row"><div style="width:300px">{PUNCTURE}</div><div class="col"><ul>
      <li>Repérage <b>juste avant le geste</b>, dans la position du geste</li>
      <li>Lame <b>≥ 10–15 mm</b>, sans poumon, foie, rate ni cœur interposé en <b>fin d'inspiration</b></li>
      <li>Ponction au <b>bord supérieur de la côte inférieure</b> ; Doppler couleur pour l'artère intercostale</li>
      <li>Après le geste : vérifier le <b>glissement pleural</b> (pneumothorax)</li></ul></div></div>"""),
]))

POSTERS["pp-m6"] = page("Pneumothorax", "Diagnostic échographique", "".join([
    box("Démarche en 4 étapes", """<div class="step"><span class="num">1</span><div>Sonde sur les <b>régions antérieures</b> (point le plus haut chez le patient couché), entre deux côtes</div></div>
      <div class="step"><span class="num">2</span><div><b>Glissement</b>, <b>lignes B</b> ou <b>pouls pulmonaire</b> présents : <span class="g">pneumothorax éliminé</span> à ce point</div></div>
      <div class="step"><span class="num">3</span><div>Glissement aboli et <b>lignes A seules</b> (profil A') : <span class="r">pneumothorax suspecté</span></div></div>
      <div class="step"><span class="num">4</span><div>Progresser vers les régions latérales à la recherche du <b>point poumon</b> : sa présence <span class="r">confirme</span> le diagnostic</div></div>"""),
    box("Mode TM", f"""<div class="row"><div class="col">{fig("pp-tm-bord-de-mer", "Bord de mer : poumon au contact")}</div><div class="col">{fig("pp-tm-code-barres", "Code-barres : pas de glissement")}</div><div class="col">{fig("pp-tm-point-poumon", "Point poumon : alternance")}</div></div>"""),
    box("Taille et performance", """<div class="row"><div class="col"><ul>
      <li>Point poumon <b>antérieur</b> : pneumothorax de petite taille</li><li><b>Latéral</b> ou <b>postérieur</b> : pneumothorax volumineux</li>
      <li>Absent avec abolition complète du glissement : pneumothorax complet probable</li></ul></div>
      <div class="col"><ul><li>Plus sensible que la radiographie au lit</li><li>Point poumon : spécificité proche de 100 %</li>
      <li>Lignes B : le pneumothorax est exclu à ce point</li></ul></div></div>"""),
    box("Pièges", """<ul><li><b>Glissement aboli sans pneumothorax</b> : apnée, intubation sélective (glissement absent à gauche, <b>pouls pulmonaire présent</b>), symphyse pleurale, SDRA sévère, bulles d'emphysème</li>
      <li><b>Emphysème sous-cutané</b> : examen impossible (lignes E)</li><li>Pneumothorax <b>cloisonné ou postérieur</b> : rechercher dans plusieurs régions ; scanner si doute</li></ul>"""),
]))

POSTERS["pp-m7"] = page("Échographie diaphragmatique", "Course, épaisseur, sevrage", "".join([
    box("Course (excursion)", f"""<div class="row"><div style="width:220px">{fig("dia-sous-costale", "Voie sous-costale droite")}</div><div class="col">{fig("dia-tm-course", "Tracé TM")}</div></div>
      <div class="row" style="margin-top:5px"><div class="col"><ul>
      <li>Sonde convexe ou sectorielle, fenêtre hépatique, faisceau vers le dôme</li>
      <li>TM perpendiculaire à la coupole, 3 cycles, en <b>ventilation spontanée</b></li></ul></div>
      <div class="col"><table><tr><th>Debout (Boussuges)</th><th class="c">H</th><th class="c">F</th></tr>
      <tr><td>Calme</td><td class="c">18 ± 3</td><td class="c">16 ± 3</td></tr><tr><td>Profonde</td><td class="c">70 ± 11</td><td class="c">57 ± 10</td></tr></table>
      <div class="cap" style="text-align:left">mm ; valeurs plus élevées couché</div></div></div>"""),
    box("Épaisseur et fraction d'épaississement", f"""<div class="row"><div style="width:360px">{fig("dia-epaisseur")}</div><div class="col"><ul>
      <li>Sonde <b>linéaire ≥ 10 MHz</b>, zone d'apposition, 8e–10e espace, ligne axillaire moyenne</li>
      <li>Entre le milieu des lignes pleurale et péritonéale</li></ul>
      <b>FE</b> = (Ei − Ee) / Ee × 100<br>Ex. : (2,9 − 2,0) / 2,0 = <b>45 %</b></div></div>"""),
    box("Interprétation", """<table><tr><th>Critère</th><th>Seuil</th><th>Signification</th></tr>
      <tr><td>Course en VS</td><td><span class="r">&lt; 10 mm</span> ou paradoxale</td><td>Dysfonction, échec de sevrage plus fréquent (Kim 2011)</td></tr>
      <tr><td>Fraction d'épaississement</td><td><span class="r">&lt; 20 %</span> · <span class="g">≥ 30 %</span></td><td>Paralysie · extubation probablement réussie (DiNino 2014)</td></tr>
      <tr><td>D-RSBI = FR / course</td><td><span class="r">&gt; 1,3 c/min/mm</span></td><td>Risque d'échec de sevrage (Spadaro 2016)</td></tr>
      <tr><td>FE sous ventilation</td><td>15–30 %</td><td>Activité associée à la ventilation la plus courte (Goligher 2018) ; &lt; 15 % : risque d'atrophie</td></tr></table>
      <div style="margin-top:4px"><b>Situations chirurgicales</b> : bloc interscalénique (parésie phrénique fréquente), chirurgie abdominale haute et thoracique, ventilation prolongée. <b>Paralysie</b> : mouvement paradoxal au sniff test.</div>"""),
]))

POSTERS["pp-m8"] = page("Échographie pulmonaire", "Applications en réanimation chirurgicale", "".join([
    box("Atélectasies postopératoires", f"""<div class="row"><div style="width:200px">{fig("pp-lus-3")}</div><div class="col"><ul>
      <li>Condensations <b>déclives et basales</b>, bronchogramme statique, perte de volume</li>
      <li>Fréquentes après anesthésie générale, chirurgie abdominale haute et thoracique</li>
      <li>Suivi de la <b>réaération</b> après kinésithérapie, CPAP, ventilation non invasive ou manœuvre de recrutement</li></ul></div></div>"""),
    box("Sevrage de la ventilation", """<div class="row"><div class="col"><b>Poumon</b><ul><li>LUS en fin d'épreuve de VS</li><li><span class="g">&lt; 13</span> favorable · <span class="r">&gt; 17</span> défavorable</li></ul></div>
      <div class="col"><b>Diaphragme</b><ul><li>Course ≥ 10 mm</li><li>FE ≥ 30 %</li><li>D-RSBI ≤ 1,3</li></ul></div>
      <div class="col"><b>Cœur</b><ul><li>FEVG, E/e'</li><li>Élévation des pressions de remplissage pendant l'épreuve : échec d'origine cardiaque</li></ul></div></div>"""),
    box("PEEP et recrutement", """<ul><li><b>Score de réaération</b> avant/après PEEP ou manœuvre : +1, +3, +5 selon le gain d'aération de chaque région</li>
      <li>Recrutement surtout des régions <b>postérieures</b> ; la surdistension antérieure n'est pas vue par l'échographie</li></ul>"""),
    box("Pneumonie acquise sous ventilation", """<ul><li>Condensation sous-pleurale avec <b>bronchogramme dynamique</b> : en faveur d'une pneumonie</li>
      <li>Suivi de la <b>réaération</b> sous antibiothérapie ; aggravation : rechercher abcès, empyème, échec du traitement</li></ul>"""),
    box("Remplissage vasculaire", """Profil A antérieur : le poumon tolère le remplissage. <span class="r">Apparition de lignes B diffuses</span> pendant l'expansion volémique : arrêter et réévaluer (protocole FALLS).
      Toujours associer l'évaluation de la précharge-dépendance (ITV, VCI, lever de jambes)."""),
    box("Contrôle après un geste", """<table><tr><th>Geste</th><th>À vérifier</th></tr>
      <tr><td>Cathéter veineux central (sous-clavier, jugulaire)</td><td>Glissement pleural bilatéral : pas de pneumothorax</td></tr>
      <tr><td>Intubation</td><td>Glissement absent à gauche avec pouls pulmonaire : <b>intubation sélective</b></td></tr>
      <tr><td>Drain thoracique, ponction pleurale</td><td>Lame résiduelle, glissement, réexpansion pulmonaire</td></tr></table>"""),
]))


async def render(names):
    from playwright.async_api import async_playwright
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        ctx = await b.new_context(viewport={"width": 720, "height": 1040}, device_scale_factor=1.5)
        p = await ctx.new_page()
        tmp = os.path.join(FIG, "_poster.html")
        for n in names:
            with open(tmp, "w", encoding="utf-8") as f:
                f.write(POSTERS[n])
            await p.goto("file://" + tmp)
            await p.wait_for_timeout(150)
            used = await p.evaluate("Math.max(...[...document.querySelectorAll('.wrap > *')].map(e => e.getBoundingClientRect().bottom))")
            png = await p.screenshot(clip={"x": 0, "y": 0, "width": 720, "height": 1040})
            Image.open(io.BytesIO(png)).convert("RGB").save(os.path.join(OUT, n + ".webp"), "WEBP", quality=80, method=6)
            print(f"{n}: contenu jusqu'à {used:.0f} px / 1022" + ("  ⚠ DÉBORDE" if used > 1022 else ""))
        os.remove(tmp)
        await b.close()


if __name__ == "__main__":
    asyncio.run(render(sys.argv[1:] or list(POSTERS)))
