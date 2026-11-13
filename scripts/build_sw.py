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
h = hashlib.sha1()
for f in files:
    with open(os.path.join(ROOT, f), "rb") as fh:
        h.update(fh.read())
version = datetime.date.today().strftime("%Y%m%d") + "-" + h.hexdigest()[:8]
sw_path = os.path.join(ROOT, "sw.js")
src = open(sw_path, encoding="utf-8").read()
src = re.sub(r'const VERSION = "[^"]*";', f'const VERSION = "{version}";', src)
lst = ",\n".join(f'  "./{f}"' for f in files)
src = re.sub(r"const PRECACHE = \[[\s\S]*?\];", "const PRECACHE = [\n  \"./\",\n" + lst + "\n];", src)
open(sw_path, "w", encoding="utf-8").write(src)
print(f"{len(files)} fichiers, version {version}")
