#!/usr/bin/env python3
"""Régénère la liste des fichiers mis en cache hors-ligne dans sw.js.
À lancer après tout ajout ou suppression de fichier : python3 scripts/build_sw.py"""
import os, re, hashlib, datetime
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INCLUDE = ("index.html", "manifest.webmanifest")
DIRS = ("assets", "icons", "data")
files = list(INCLUDE)
for d in DIRS:
    for base, _, names in os.walk(os.path.join(ROOT, d)):
        for n in sorted(names):
            if n.startswith("."):
                continue
            files.append(os.path.relpath(os.path.join(base, n), ROOT).replace(os.sep, "/"))
files = sorted(set(files))
MAJ = re.compile(r'(<time id="footer-maj" datetime=")([^"]*)(">)([^<]*)(</time>)')
def content(f):
    data = open(os.path.join(ROOT, f), "rb").read()
    if f == "index.html":  # la date affichée n'entre pas dans l'empreinte
        data = MAJ.sub(lambda m: m.group(1) + m.group(3) + m.group(5), data.decode("utf-8")).encode("utf-8")
    return data
h = hashlib.sha1()
for f in files:
    h.update(content(f))
digest = h.hexdigest()[:8]
sw_path = os.path.join(ROOT, "sw.js")
src = open(sw_path, encoding="utf-8").read()
old = re.search(r'const VERSION = "(\d{8})-([0-9a-f]+)";', src)
# date de mise à jour : inchangée si le contenu n'a pas bougé depuis la dernière construction
if old and old.group(2) == digest:
    day = datetime.datetime.strptime(old.group(1), "%Y%m%d").date()
else:
    day = datetime.date.today()
version = day.strftime("%Y%m%d") + "-" + digest
MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
idx_path = os.path.join(ROOT, "index.html")
idx = open(idx_path, encoding="utf-8").read()
idx = MAJ.sub(lambda m: f"{m.group(1)}{day.isoformat()}{m.group(3)}{day.day} {MOIS[day.month - 1]} {day.year}{m.group(5)}", idx)
open(idx_path, "w", encoding="utf-8").write(idx)
src = re.sub(r'const VERSION = "[^"]*";', f'const VERSION = "{version}";', src)
lst = ",\n".join(f'  "./{f}"' for f in files)
src = re.sub(r"const PRECACHE = \[[\s\S]*?\];", "const PRECACHE = [\n  \"./\",\n" + lst + "\n];", src)
open(sw_path, "w", encoding="utf-8").write(src)
print(f"{len(files)} fichiers, version {version}, mise à jour du {day.isoformat()}")
