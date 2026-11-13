#!/usr/bin/env python3
"""Construit une version « fichier unique » de la plateforme (HTML autonome) :
styles, scripts, images et bibliographie intégrés. Elle s'ouvre directement
dans un navigateur, sans serveur ni dézippage.

    python3 scripts/build_single.py [dossier_de_sortie]

Produit rea-chir-p17.html (document complet) et rea-chir-p17-apercu.html
(même contenu, sans balises html/head/body, pour un aperçu intégré)."""
import base64, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "dist")
os.makedirs(OUT, exist_ok=True)

def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as f:
        return f.read()

html = read("index.html")

# Images en data URI
imgs = {}
for base, _, names in os.walk(os.path.join(ROOT, "assets", "img")):
    for n in sorted(names):
        if not n.lower().endswith((".webp", ".png", ".jpg", ".jpeg")):
            continue
        p = os.path.join(base, n)
        rel = os.path.relpath(p, ROOT).replace(os.sep, "/")
        mime = "image/webp" if n.endswith(".webp") else "image/png" if n.endswith(".png") else "image/jpeg"
        with open(p, "rb") as f:
            imgs[rel] = f"data:{mime};base64," + base64.b64encode(f.read()).decode()


def inline_script(m):
    src = m.group(1).split("?")[0]
    code = read(src).replace("</script", "<\\/script")
    extra = ""
    if src.endswith("config.js"):
        extra = "\nwindow.P17_CONFIG.noServiceWorker = true;"
    return f"<script>/* {src} */\n{code}{extra}\n</script>"

html = re.sub(r'<script src="([^"]+)"></script>', inline_script, html)
css = read("assets/app.css")
html = re.sub(r'<link rel="stylesheet" href="assets/app\.css[^"]*">', f"<style>\n{css}\n</style>", html)
html = re.sub(r'\s*<link rel="manifest"[^>]*>', "", html)
icon = "data:image/png;base64," + base64.b64encode(open(os.path.join(ROOT, "icons", "icon-192.png"), "rb").read()).decode()
html = re.sub(r'href="icons/[^"]+\.png"', f'href="{icon}"', html)
data_script = "<script>window.P17_IMG = " + json.dumps(imgs) + ";</script>\n  "
html = html.replace("<script>/* assets/config.js */", data_script + "<script>/* assets/config.js */", 1)

full = os.path.join(OUT, "rea-chir-p17.html")
with open(full, "w", encoding="utf-8") as f:
    f.write(html)

# Variante d'aperçu (sans document englobant)
frag = re.sub(r"<!doctype html>\s*", "", html, flags=re.I)
frag = re.sub(r"</?html[^>]*>|</?head>|</?body>", "", frag)
frag = re.sub(r'\s*<meta charset="utf-8">', "", frag)
frag = re.sub(r'\s*<meta name="viewport"[^>]*>', "", frag)
frag = frag.replace("<title>Réa Chir P17</title>", '<title>Réa Chir P17</title>\n<meta name="claude:viewport-fit-sides" content="cover">', 1).lstrip()
with open(os.path.join(OUT, "rea-chir-p17-apercu.html"), "w", encoding="utf-8") as f:
    f.write(frag)

print(f"{len(imgs)} images intégrées — {os.path.getsize(full) / 1e6:.1f} Mo → {full}")
