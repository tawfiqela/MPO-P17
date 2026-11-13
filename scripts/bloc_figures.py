#!/usr/bin/env python3
"""Vues échographiques schématiques (originales) des blocs analgésiques.
Chaque scène est décrite par des couches (tissus, fascias, os, vaisseaux,
nerfs, aiguille, anesthésique local) puis rendue avec une texture de speckle.

    python3 scripts/bloc_figures.py   → assets/img/blocs/*.webp
"""
import importlib.util, math, os
import numpy as np
from scipy import ndimage as ndi
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location("ef", os.path.join(ROOT, "scripts", "echo_figures.py"))
ef = importlib.util.module_from_spec(spec); spec.loader.exec_module(ef)
OUT = os.path.join(ROOT, "assets", "img", "blocs")
os.makedirs(OUT, exist_ok=True)
W, H = 640, 420
YEL, CYA, WHT, GRN = ef.YEL, ef.CYA, ef.WHT, (120, 235, 150)


def mask_poly(pts, blur=1.2):
    im = Image.new("L", (W, H), 0)
    ImageDraw.Draw(im).polygon([tuple(p) for p in pts], fill=255)
    return ndi.gaussian_filter(np.asarray(im, float) / 255, blur)


def mask_ellipse(cx, cy, rx, ry, blur=1.0):
    yy, xx = np.mgrid[0:H, 0:W]
    m = (((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2 <= 1).astype(float)
    return ndi.gaussian_filter(m, blur)


def band(ytop, ybot, x0=0, x1=W):
    """Bande entre deux courbes (fonctions de x ou constantes)."""
    xs = np.linspace(x0, x1, 60)
    ft = ytop if callable(ytop) else (lambda x, v=ytop: v + 0 * x)
    fb = ybot if callable(ybot) else (lambda x, v=ybot: v + 0 * x)
    pts = [(x, ft(x)) for x in xs] + [(x, fb(x)) for x in xs[::-1]]
    return mask_poly(pts)


class Scene:
    def __init__(self, seed, fan=None):
        self.E = np.zeros((H, W))
        self.add = np.zeros((H, W))
        self.shadow = np.ones((H, W))
        self.seed = seed
        self.fan = fan
        self.S_fine = ef.speckle(H, W, 0.9, 1.8, seed)
        self.S_fib = ef.speckle(H, W, 0.8, 7, seed + 1)
        self.S_coarse = ef.speckle(H, W, 1.4, 2.4, seed + 2)
        self.E = 0.3 * self.S_coarse          # tissu de fond (évite les zones vides)
        self.labels = []
        yy, xx = np.mgrid[0:H, 0:W]
        self.yy, self.xx = yy, xx

    def paint(self, m, level, tex="fine"):
        T = {"fine": self.S_fine, "fib": self.S_fib, "coarse": self.S_coarse}[tex]
        self.E = self.E * (1 - m) + m * level * T

    def skin(self, y=10):
        self.paint(band(0, y), 0.9, "fine")

    def fat(self, y0, y1, level=0.2):
        m = band(y0, y1)
        self.paint(m, level, "coarse")
        rng = np.random.default_rng(self.seed + 7)
        for _ in range(6):
            yv = rng.uniform(y0 if not callable(y0) else 20, y1 if not callable(y1) else 60)
            self.add += 0.35 * ef.gauss(self.yy - yv - 4 * np.sin(self.xx / 40 + rng.random() * 6), 1.2) * m

    def muscle(self, m, level=0.42):
        self.paint(m, level * (0.85 + 0.25 * np.sin(self.yy / 3.1)), "fib")

    def fascia(self, f, x0=0, x1=W, inten=1.3, w=1.8):
        xs = np.arange(W)
        yv = np.array([f(x) if callable(f) else f for x in xs], float)
        on = ((xs >= x0) & (xs <= x1)).astype(float)
        self.add += inten * ef.gauss(self.yy - yv[None, :], w) * on[None, :]

    def bone(self, f, x0=0, x1=W, inten=2.0):
        xs = np.arange(W)
        yv = np.array([f(x) if callable(f) else f for x in xs], float)
        on = (xs >= x0) & (xs <= x1)
        self.add += inten * ef.gauss(self.yy - yv[None, :], 2.6) * on[None, :]
        sh = (self.yy > yv[None, :] + 3) & on[None, :]
        self.shadow *= np.where(ndi.gaussian_filter(sh.astype(float), (0, 2)) > 0.5, 0.04, 1)

    def pleura(self, f, x0=0, x1=W):
        self.fascia(f, x0, x1, 1.4, 2.0)
        xs = np.arange(W)
        yv = np.array([f(x) if callable(f) else f for x in xs], float)
        on = ((xs >= x0) & (xs <= x1))[None, :]
        below = (self.yy > yv[None, :] + 3) & on
        self.E = np.where(below, 0.1 * self.S_fine, self.E)
        self.add += 0.5 * ef.gauss(self.yy - 2 * yv[None, :] + 4, 2.5) * on

    def peritoneum(self, f):
        self.fascia(f, inten=1.1)
        xs = np.arange(W)
        yv = np.array([f(x) if callable(f) else f for x in xs], float)
        below = self.yy > yv[None, :] + 3
        gas = ef.speckle(H, W, 2.5, 9, self.seed + 5)
        self.E = np.where(below, 0.22 * gas, self.E)

    def vessel(self, cx, cy, rx, ry=None, label=None, color=CYA):
        ry = ry or rx
        m = mask_ellipse(cx, cy, rx, ry, 1.0)
        self.E = self.E * (1 - m) + m * 0.01
        self.add += 0.5 * ef.gauss(np.hypot((self.xx - cx) / rx, (self.yy - cy) / ry) - 1, 0.08)
        # renforcement postérieur
        post = (np.abs(self.xx - cx) < rx * 0.8) & (self.yy > cy + ry)
        self.shadow *= np.where(post, 1.35, 1)
        if label:
            self.labels.append((cx, cy - 6, label, color, "mm"))

    def nerve(self, cx, cy, rx, ry=None, fascicles=6):
        ry = ry or rx
        m = mask_ellipse(cx, cy, rx, ry, 0.8)
        self.E = self.E * (1 - m) + m * 0.9 * self.S_fine
        rng = np.random.default_rng(int(cx * 7 + cy))
        for _ in range(fascicles):
            a, r = rng.random() * 6.28, rng.random() ** 0.5 * 0.6
            fx, fy = cx + r * rx * math.cos(a), cy + r * ry * math.sin(a)
            fm = mask_ellipse(fx, fy, rx * 0.22, ry * 0.22, 0.6)
            self.E = self.E * (1 - fm) + fm * 0.05

    def ring(self, cx, cy, rx, ry, inten=1.1):
        self.add += inten * ef.gauss(np.hypot((self.xx - cx) / rx, (self.yy - cy) / ry) - 1, 0.035)

    def outline(self, pts, inten=1.1):
        im = Image.new("L", (W, H), 0)
        ImageDraw.Draw(im).line([tuple(p) for p in pts] + [tuple(pts[0])], fill=255, width=3)
        self.add += inten * ndi.gaussian_filter(np.asarray(im, float) / 255, 1.0)

    def la(self, pts):
        m = mask_poly(pts, 2.0)
        self.E = self.E * (1 - m) + m * 0.008

    def needle(self, p0, p1):
        self.needle_pts = (p0, p1)

    def label(self, x, y, t, color=YEL, anchor="la", size=16):
        self.labels.append((x, y, t, color, anchor, size))

    def render(self, name, depth_cm=4):
        I = (self.E + self.add) * self.shadow
        I *= np.exp(-self.yy / 1600)
        mask = None
        if self.fan:
            apex_y, R0, half, depth = self.fan
            _, _, _, _, mask = ef.fan(W, H, apex_y, R0, half, depth)
        im = ef.to_img(I, mask)
        d = ef.chrome(im, None if self.fan else depth_cm)
        if hasattr(self, "needle_pts"):
            (x0, y0), (x1, y1) = self.needle_pts
            d.line([(x0, y0), (x1, y1)], fill=(235, 235, 235), width=4)
            d.line([(x0, y0), (x1, y1)], fill=(255, 255, 255), width=2)
        for lab in self.labels:
            x, y, t, c = lab[:4]
            anchor = lab[4] if len(lab) > 4 else "la"
            size = lab[5] if len(lab) > 5 else (14 if anchor == "mm" else 16)
            ef.label(d, (x, y), t, color=c, size=size, anchor=anchor if anchor != "mm" else "mm")
        im.save(os.path.join(OUT, name + ".webp"), "WEBP", quality=82, method=6)


def wave(base, amp, per, ph=0):
    return lambda x: base + amp * math.sin(x / per + ph)


# ------------------------------------------------------------------ scènes
def tap():
    s = Scene(201)
    s.skin(); s.fat(10, 70)
    s.fascia(72); s.muscle(band(74, 130)); s.fascia(132)
    s.muscle(band(134, 215), 0.38); s.fascia(217)
    s.muscle(band(219, 250), 0.3); s.peritoneum(wave(258, 4, 60))
    s.la([(250, 217), (330, 212), (430, 218), (330, 236)])
    s.needle((40, 40), (300, 218))
    s.label(560, 98, "OE"); s.label(560, 168, "OI"); s.label(560, 228, "TA")
    s.label(470, 290, "Péritoine, anses", CYA, size=14); s.label(340, 186, "AL", GRN)
    s.label(80, 26, "Aiguille", WHT, size=14)
    s.render("tap")


def gaine():
    s = Scene(202)
    s.skin(); s.fat(10, 50)
    s.fascia(52, inten=1.5)
    s.muscle(mask_ellipse(330, 140, 270, 80), 0.42)
    s.fascia(lambda x: 140 + 80 * math.sqrt(max(0, 1 - ((x - 330) / 270) ** 2)) + 3, 70, 590, 1.5)
    s.peritoneum(wave(250, 3, 70))
    s.vessel(470, 200, 9, 7)
    s.label(490, 188, "a. épigastrique", CYA, size=12)
    s.la([(220, 222), (330, 218), (440, 226), (330, 240)])
    s.needle((60, 30), (300, 228))
    s.label(320, 120, "Muscle droit de l'abdomen", YEL, "ma")
    s.label(150, 262, "Feuillet postérieur de la gaine", CYA, size=14)
    s.label(250, 236, "AL", GRN)
    s.render("gaine-droits")


def ilio():
    s = Scene(203)
    s.skin(); s.fat(10, 40)
    s.muscle(band(42, 80), 0.35); s.fascia(82)
    s.muscle(band(84, 150), 0.4); s.fascia(152)
    s.muscle(band(154, 200), 0.32)
    s.paint(band(202, H), 0.25, "coarse")
    s.bone(lambda x: 40 + 0.004 * (x - 70) ** 2 if x < 170 else 99, 0, 170)
    s.nerve(250, 168, 10, 8, 4); s.nerve(285, 172, 9, 7, 3)
    s.vessel(330, 170, 6, 6)
    s.la([(225, 152), (300, 150), (340, 160), (280, 178)])
    s.needle((620, 30), (300, 160))
    s.label(80, 20, "EIAS", YEL); s.label(560, 62, "OE"); s.label(560, 120, "OI"); s.label(560, 180, "TA")
    s.label(220, 196, "n. II et IH", CYA, size=14); s.label(352, 150, "AL", GRN)
    s.render("ilio-inguinal")


def carre():
    s = Scene(204, fan=(-200, 210, 36, 420))
    s.skin(); s.fat(10, 40)
    s.muscle(band(42, lambda x: 120 - 0.1 * (x - 320)), 0.4)
    s.muscle(mask_ellipse(330, 210, 95, 55), 0.45); s.ring(330, 210, 95, 55)     # carré des lombes
    s.muscle(mask_ellipse(470, 300, 90, 70), 0.42); s.ring(470, 300, 90, 70)     # psoas
    s.muscle(mask_ellipse(160, 230, 90, 75), 0.48); s.ring(160, 230, 90, 75)     # érecteurs
    s.bone(lambda x: 300 - 0.0 * x, 250, 420)                         # processus transverse
    s.fascia(lambda x: 210 + 55 * math.sqrt(max(0, 1 - ((x - 330) / 95) ** 2)) + 3, 240, 420, 1.3)
    s.la([(300, 262), (360, 262), (400, 272), (330, 280)])
    s.needle((560, 40), (360, 262))
    s.label(330, 200, "Carré des lombes", YEL, "ma"); s.label(470, 300, "Psoas", YEL, "ma"); s.label(160, 230, "Érecteurs", YEL, "ma")
    s.label(330, 320, "Processus transverse L4", CYA, "ma", 14); s.label(420, 255, "AL", GRN)
    s.label(320, 380, "Signe du trèfle (shamrock)", WHT, "ma", 14)
    s.render("carre-lombes")


def esp():
    s = Scene(205)
    s.skin(); s.fat(10, 36)
    s.muscle(band(38, 80), 0.36); s.fascia(82)
    s.muscle(band(84, 120), 0.36); s.fascia(122)
    s.muscle(band(124, 230), 0.45)
    for cx in (110, 320, 530):
        s.bone(lambda x, c=cx: 238 if abs(x - c) < 70 else 400, cx - 70, cx + 70)
    s.la([(150, 234), (320, 228), (480, 236), (320, 232)])
    s.needle((40, 20), (300, 232))
    s.label(600, 54, "Trapèze", YEL, "ra"); s.label(600, 96, "Rhomboïde", YEL, "ra"); s.label(600, 170, "Érecteurs du rachis", YEL, "ra")
    s.label(320, 268, "Processus transverses", CYA, "ma", 14); s.label(400, 206, "AL", GRN)
    s.render("esp")


def paravertebral():
    s = Scene(206)
    s.skin(); s.fat(10, 36); s.muscle(band(38, 150), 0.45)
    for cx in (90, 550):
        s.bone(lambda x, c=cx: 160 - 0.003 * (x - c) ** 2 if abs(x - c) < 80 else 400, cx - 80, cx + 80)
    s.fascia(lambda x: 200 + 0.0006 * (x - 320) ** 2, 170, 470, 1.6)             # ligament costotransversaire
    s.pleura(lambda x: 262 + 0.0008 * (x - 320) ** 2, 170, 470)
    s.la([(220, 218), (320, 206), (420, 218), (320, 252)])
    s.needle((620, 40), (360, 222))
    s.label(90, 120, "Processus transverse", CYA, "ma", 14); s.label(550, 120, "Processus transverse", CYA, "ma", 14)
    s.label(180, 186, "Lig. costotransversaire", YEL, size=14); s.label(200, 300, "Plèvre", YEL)
    s.label(330, 232, "AL", GRN)
    s.render("paravertebral")


def dentele():
    s = Scene(207)
    s.skin(); s.fat(10, 50)
    s.muscle(band(52, 110), 0.4); s.fascia(112)
    s.muscle(band(114, 190), 0.42); s.fascia(192)
    for cx in (150, 480):
        s.bone(lambda x, c=cx: 214 - 0.004 * (x - c) ** 2 if abs(x - c) < 90 else 400, cx - 90, cx + 90)
    s.pleura(lambda x: 250, 245, 385)
    s.la([(220, 112), (320, 108), (420, 114), (320, 124)])
    s.needle((620, 30), (380, 112))
    s.label(40, 82, "Grand dorsal"); s.label(40, 150, "Dentelé antérieur"); s.label(130, 180, "Côte", CYA, size=14)
    s.label(330, 270, "Plèvre", YEL, "ma", 14); s.label(430, 92, "AL (plan superficiel)", GRN, size=14)
    s.render("dentele")


def pecs():
    s = Scene(208)
    s.skin(); s.fat(10, 40)
    s.muscle(band(42, 120), 0.42); s.fascia(122)
    s.muscle(band(124, 180), 0.4); s.fascia(182)
    s.muscle(band(184, 230), 0.38)
    for cx in (140, 470):
        s.bone(lambda x, c=cx: 250 - 0.004 * (x - c) ** 2 if abs(x - c) < 90 else 400, cx - 90, cx + 90)
    s.pleura(lambda x: 290, 235, 375)
    s.vessel(250, 122, 7, 6)
    s.la([(260, 122), (340, 118), (420, 124), (340, 132)])
    s.la([(260, 182), (340, 178), (440, 184), (340, 194)])
    s.needle((40, 30), (330, 182))
    s.label(520, 70, "Grand pectoral"); s.label(520, 150, "Petit pectoral"); s.label(520, 210, "Dentelé")
    s.label(380, 100, "PECS I", GRN, size=14); s.label(380, 160, "PECS II", GRN, size=14)
    s.label(250, 100, "a. thoraco-acromiale", CYA, "ma", 12); s.label(140, 236, "Côte", CYA, "ma", 14)
    s.render("pecs")


def fascia_iliaca():
    s = Scene(209)
    s.skin(); s.fat(10, 50)
    s.muscle(band(52, lambda x: 150 - 0.15 * x if x < 320 else 102), 0.38)
    s.muscle(band(lambda x: 150 - 0.15 * x if x < 320 else 102, 160), 0.36)
    s.fascia(lambda x: 162, 0, W, 1.6)
    s.muscle(band(164, 300), 0.46)
    s.bone(lambda x: 300 + 0.0015 * (x - 320) ** 2, 0, W)
    s.vessel(250, 180, 8, 6, None)
    s.la([(220, 162), (360, 158), (520, 164), (380, 178)])
    s.needle((620, 40), (420, 164))
    s.label(40, 70, "Oblique interne"); s.label(40, 140, "Sartorius", size=14); s.label(40, 186, "Fascia iliaca", CYA, size=14)
    s.label(300, 240, "Muscle iliaque", YEL, "ma"); s.label(320, 330, "Ilium", CYA, "ma", 14)
    s.label(250, 196, "a. circonflexe iliaque profonde", CYA, size=12); s.label(470, 142, "AL", GRN)
    s.label(140, 112, "« nœud papillon »", WHT, size=13)
    s.render("fascia-iliaca")


def peng():
    s = Scene(210, fan=(-200, 210, 36, 420))
    s.skin(); s.fat(10, 40)
    s.muscle(band(42, 220), 0.44)
    s.bone(lambda x: 250 - 60 * math.exp(-((x - 240) / 70) ** 2) + 0.0004 * (x - 320) ** 2, 60, 580)
    s.add += 1.4 * ef.gauss(np.hypot((s.xx - 360) / 40, (s.yy - 200) / 14) - 1, 0.25)   # tendon du psoas
    s.vessel(480, 150, 16, 13, "AF")
    s.la([(330, 228), (390, 224), (430, 236), (370, 244)])
    s.needle((80, 60), (360, 232))
    s.label(240, 160, "EIAI", CYA, "ma", 14); s.label(380, 278, "Éminence iliopubienne", CYA, "ma", 14)
    s.label(360, 180, "Tendon du psoas", YEL, "ma", 14); s.label(440, 222, "AL", GRN)
    s.render("peng")


def femoral():
    s = Scene(211)
    s.skin(); s.fat(10, 60); s.fascia(62, inten=1.3)
    s.paint(band(64, 140), 0.2, "coarse")
    s.fascia(lambda x: 140 if x < 330 else 175, 0, W, 1.5)
    s.muscle(band(lambda x: 142 if x < 330 else 177, 330), 0.44)
    s.vessel(380, 150, 26, 22, "Artère"); s.vessel(470, 155, 30, 18, "Veine")
    s.la([(244, 136), (300, 130), (346, 140), (300, 168)])
    s.nerve(290, 150, 26, 10, 7)
    s.needle((40, 40), (275, 150))
    s.label(200, 110, "Nerf fémoral", YEL, size=15); s.label(120, 250, "Muscle iliopsoas", YEL)
    s.label(40, 82, "Fascia lata", CYA, size=13); s.label(40, 160, "Fascia iliaca", CYA, size=13); s.label(310, 120, "AL", GRN)
    s.render("femoral")


def adducteurs():
    s = Scene(212)
    s.skin(); s.fat(10, 50)
    s.muscle(mask_poly([(180, 60), (460, 60), (420, 160), (220, 160)]), 0.4); s.outline([(180, 60), (460, 60), (420, 160), (220, 160)])
    s.muscle(band(60, 330, 0, 200), 0.42); s.muscle(band(60, 330, 440, W), 0.4)
    s.muscle(band(170, 330, 200, 440), 0.44)
    s.vessel(320, 190, 18, 16, "AFS")
    s.nerve(280, 180, 9, 7, 3)
    s.la([(260, 168), (330, 165), (370, 180), (310, 210)])
    s.needle((40, 40), (290, 178))
    s.label(320, 100, "Sartorius", YEL, "ma"); s.label(60, 220, "Vaste médial"); s.label(480, 220, "Long adducteur")
    s.label(230, 200, "n. saphène", CYA, size=13); s.label(380, 160, "AL", GRN)
    s.render("canal-adducteurs")


def poplite():
    s = Scene(213)
    s.skin(); s.fat(10, 60)
    s.muscle(mask_ellipse(70, 170, 170, 115, 2.0), 0.42); s.ring(70, 170, 170, 115)       # semi-membraneux
    s.muscle(mask_ellipse(585, 165, 165, 110, 2.0), 0.42); s.ring(585, 165, 165, 110)     # biceps fémoral
    s.la([(228, 120), (320, 100), (408, 110), (402, 146), (320, 160), (236, 150)])
    s.nerve(270, 130, 30, 20, 9); s.nerve(370, 125, 22, 15, 6)
    s.vessel(330, 230, 16, 14, "Artère poplitée")
    s.needle((620, 40), (395, 130))
    s.label(20, 160, "Semi-membraneux"); s.label(620, 160, "Biceps fémoral", YEL, "ra")
    s.label(270, 168, "n. tibial", YEL, "ma", 14); s.label(370, 82, "n. fibulaire commun", YEL, "ma", 13); s.label(212, 100, "AL", GRN)
    s.render("sciatique-poplite")


def interscalenique():
    s = Scene(214)
    s.skin(); s.fat(10, 36)
    s.muscle(mask_poly([(0, 40), (330, 40), (300, 100), (0, 110)]), 0.4); s.outline([(0, 40), (330, 40), (300, 100), (0, 110)])       # SCM
    s.muscle(mask_ellipse(228, 192, 78, 62), 0.42); s.ring(228, 192, 78, 62)     # scalène antérieur
    s.muscle(mask_ellipse(468, 198, 100, 74), 0.42); s.ring(468, 198, 100, 74)   # scalène moyen
    s.vessel(70, 170, 30, 30, "Carotide"); s.vessel(110, 110, 34, 18, "VJI")
    for cy in (150, 190, 232):
        m = mask_ellipse(340, cy, 16, 14, 0.8); s.E = s.E * (1 - m) + m * 0.03
        s.add += 0.6 * ef.gauss(np.hypot((s.xx - 340) / 16, (s.yy - cy) / 14) - 1, 0.12)
    s.la([(310, 120), (350, 112), (380, 130), (360, 150)])
    s.needle((620, 40), (360, 140))
    s.label(150, 70, "SCM", YEL, size=15); s.label(215, 268, "Scalène ant.", YEL, "ma", 14); s.label(480, 284, "Scalène moyen", YEL, "ma", 14)
    s.label(345, 250, "Racines C5–C7", CYA, "ma", 13); s.label(392, 112, "AL", GRN)
    s.render("interscalenique")


def supraclav():
    s = Scene(215)
    s.skin(); s.fat(10, 60); s.muscle(band(62, 120), 0.36)
    s.paint(band(122, 300), 0.24, "coarse")
    s.vessel(260, 220, 34, 30, "a. sous-clavière")
    for (cx, cy) in [(350, 170), (380, 150), (400, 182), (370, 200), (420, 160), (345, 140)]:
        m = mask_ellipse(cx, cy, 13, 11, 0.8); s.E = s.E * (1 - m) + m * 0.03
        s.add += 0.6 * ef.gauss(np.hypot((s.xx - cx) / 13, (s.yy - cy) / 11) - 1, 0.12)
    s.bone(lambda x: 268 - 0.002 * (x - 300) ** 2, 160, 470)
    s.pleura(lambda x: 300, 0, 150); s.pleura(lambda x: 300, 470, W)
    s.la([(300, 236), (340, 226), (370, 240), (330, 250)])
    s.needle((620, 40), (340, 236))
    s.label(390, 110, "Plexus brachial", YEL, "ma", 14); s.label(320, 294, "1re côte", CYA, "ma", 14)
    s.label(60, 330, "Plèvre", CYA, size=14); s.label(560, 330, "Plèvre", CYA, size=14); s.label(380, 250, "AL (coin)", GRN, size=14)
    s.render("supraclaviculaire")


def axillaire():
    s = Scene(216)
    s.skin(); s.fat(10, 50)
    s.muscle(band(52, 110, 0, 420), 0.4)
    s.muscle(mask_ellipse(120, 200, 110, 60), 0.42); s.ring(120, 200, 110, 60)   # coracobrachial
    s.paint(band(112, 330, 230, W), 0.22, "coarse")
    s.vessel(380, 190, 22, 20, "Artère")
    s.vessel(450, 160, 18, 10, None)
    s.nerve(360, 150, 14, 11, 5); s.nerve(420, 230, 12, 10, 4); s.nerve(330, 230, 13, 10, 4)
    s.nerve(170, 190, 10, 8, 3)
    s.add += 1.3 * ef.gauss(s.yy - 290, 2.2) * ((s.xx > 250) & (s.xx < 560))      # tendon conjoint
    s.needle((40, 40), (340, 230))
    s.label(360, 120, "Médian", YEL, "ma", 13); s.label(430, 252, "Ulnaire", YEL, size=13); s.label(260, 252, "Radial", YEL, size=13)
    s.label(170, 166, "Musculocutané", CYA, "ma", 13); s.label(120, 240, "Coracobrachial", YEL, "ma", 13); s.label(400, 300, "Tendon conjoint", CYA, "ma", 13)
    s.label(460, 140, "Veine", CYA, size=12)
    s.render("axillaire")


if __name__ == "__main__":
    for f in (tap, gaine, ilio, carre, esp, paravertebral, dentele, pecs, fascia_iliaca, peng, femoral, adducteurs, poplite, interscalenique, supraclav, axillaire):
        f()
    print("\n".join(sorted(os.listdir(OUT))))
