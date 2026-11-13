#!/usr/bin/env python3
"""Génère les images échographiques schématiques (originales) de la rubrique
Échographie : bases et sémiologie, échographie pleuro-pulmonaire et
diaphragmatique. Textures obtenues par speckle de Rayleigh simulé.

    python3 scripts/echo_figures.py   → assets/img/echo/fig/*.webp
"""
import math, os
import numpy as np
from scipy import ndimage as ndi
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "img", "echo", "fig")
os.makedirs(OUT, exist_ok=True)
FONT = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"
FONT_B = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"
YEL = (255, 214, 72)
CYA = (110, 220, 255)
WHT = (240, 244, 248)


def font(size, bold=False):
    try:
        return ImageFont.truetype(FONT_B if bold else FONT, size)
    except OSError:
        return ImageFont.load_default()


# ---------------------------------------------------------------- speckle
def speckle(h, w, sy=0.9, sx=2.0, seed=0, looks=2):
    """Speckle de Rayleigh ; « looks » > 1 : moyenne de plusieurs tirages (imagerie composée)."""
    r = np.random.default_rng(seed)
    acc = np.zeros((h, w))
    for _ in range(looks):
        a = ndi.gaussian_filter(r.standard_normal((h, w)), (sy, sx))
        b = ndi.gaussian_filter(r.standard_normal((h, w)), (sy, sx))
        acc += np.sqrt(a * a + b * b)
    return acc / acc.mean()


def to_img(I, mask=None):
    I = np.clip(I, 0, None)
    I = np.log1p(6 * I) / np.log1p(6 * 1.6)
    I = np.clip(I, 0, 1) ** 1.05
    if mask is not None:
        I = I * mask
    a = (I * 255).astype(np.uint8)
    return Image.fromarray(a, "L").convert("RGB")


def grid(h, w):
    return np.mgrid[0:h, 0:w].astype(float)


def gauss(d, t):
    return np.exp(-(d / t) ** 2)


def smooth1d(n, sigma, seed):
    r = np.random.default_rng(seed)
    v = ndi.gaussian_filter1d(r.standard_normal(n), sigma)
    return v / (np.abs(v).max() + 1e-9)


# ---------------------------------------------------------------- annotations
def label(d, xy, text, color=YEL, size=17, anchor="la", bold=False):
    d.text(xy, text, fill=color, font=font(size, bold), anchor=anchor, stroke_width=3, stroke_fill=(0, 0, 0))


def arrow(d, p0, p1, color=YEL, w=3, head=11):
    d.line([p0, p1], fill=color, width=w)
    ang = math.atan2(p1[1] - p0[1], p1[0] - p0[0])
    a1, a2 = ang + math.radians(152), ang - math.radians(152)
    d.polygon([p1, (p1[0] + head * math.cos(a1), p1[1] + head * math.sin(a1)), (p1[0] + head * math.cos(a2), p1[1] + head * math.sin(a2))], fill=color)


def darrow(d, p0, p1, color=YEL, w=3):
    arrow(d, p0, p1, color, w); arrow(d, p1, p0, color, w)


def dashed(d, p0, p1, color=YEL, w=2, dash=8):
    x0, y0 = p0; x1, y1 = p1
    L = math.hypot(x1 - x0, y1 - y0); n = max(1, int(L / dash))
    for i in range(0, n, 2):
        a, b = i / n, min(1, (i + 1) / n)
        d.line([(x0 + (x1 - x0) * a, y0 + (y1 - y0) * a), (x0 + (x1 - x0) * b, y0 + (y1 - y0) * b)], fill=color, width=w)


def chrome(img, depth_cm=None, marker=True):
    """Repère de sonde et échelle de profondeur, comme sur un écran d'échographe."""
    d = ImageDraw.Draw(img)
    W, H = img.size
    if marker:
        d.ellipse([10, 10, 22, 22], fill=(80, 200, 255))
    if depth_cm:
        step = H / depth_cm
        for i in range(depth_cm + 1):
            y = min(H - 2, i * step)
            d.line([(W - 14, y), (W - 4, y)], fill=(200, 210, 220), width=2)
            for j in range(1, 5):
                yy = y + j * step / 5
                if yy < H:
                    d.line([(W - 9, yy), (W - 4, yy)], fill=(150, 160, 170), width=1)
    return d


def save(img, name, q=82):
    img.save(os.path.join(OUT, name + ".webp"), "WEBP", quality=q, method=6)


# ================================================================ poumon (sonde linéaire / microconvexe)
def lung_linear(W=640, H=480, alines=1.0, blines=(), coalescent=False, seed=1, ribs=True, pleura_y=None):
    s = W / 640
    yy, xx = grid(H, W)
    py = pleura_y or 150 * s
    E = np.zeros((H, W))
    # paroi : peau, sous-cutané, muscle, fascias
    E += np.where(yy < 8 * s, 0.9, 0)
    E += np.where((yy >= 8 * s) & (yy < 55 * s), 0.30, 0)
    musc = (yy >= 55 * s) & (yy < py - 12 * s)
    E += np.where(musc, 0.42 + 0.10 * np.sin(yy / (3.2 * s)), 0)
    for fy, fi in [(55, .6), (95, .35), (py / s - 14, .7)]:
        E += fi * gauss(yy - fy * s, 2.2 * s)
    tissue = E * speckle(H, W, 0.9, 2.6, seed)
    # poumon aéré sous la ligne pleurale : bruit granuleux de faible intensité
    below = yy > py + 2 * s
    lung = np.where(below, 0.13 * np.exp(-(yy - py) / (260 * s)), 0) * speckle(H, W, 1.0, 1.6, seed + 1)
    # lignes A (réverbérations à intervalle = distance peau–plèvre)
    A = np.zeros((H, W))
    for k, ia in [(2, 0.85), (3, 0.45), (4, 0.22)]:
        A += ia * alines * gauss(yy - k * py, 3.2 * s)
    A *= (0.75 + 0.25 * speckle(H, W, 2, 18, seed + 2))
    # ligne pleurale (spéculaire)
    P = 1.5 * gauss(yy - py, 2.4 * s) * (0.8 + 0.2 * speckle(H, W, 1, 10, seed + 3))
    I = tissue + lung + A + P
    # lignes B
    B = np.zeros((H, W))
    rng = np.random.default_rng(seed + 9)
    bl = list(blines)
    if coalescent:
        bl = [(x, 1.0) for x in np.linspace(190 * s, 450 * s, 16)]
    for item in bl:
        x0, ib = item if isinstance(item, tuple) else (item, 1.0)
        x0 = x0 * (1 if coalescent else s)
        w = (4.5 + rng.random() * 2.5) * s + (yy - py) * 0.012
        B += ib * 1.05 * gauss(xx - x0, w) * below * (0.92 + 0.08 * speckle(H, W, 6, 1, seed + 4))
    if coalescent:
        streak = 0.5 + 0.5 * smooth1d(W, 3 * s, seed + 5)[None, :]
        B = np.maximum(B * 0.85, 0.55 * below * (0.6 + 0.4 * streak))
    if len(bl):
        I = I * (1 - 0.65 * np.clip(B, 0, 1)) + B          # les lignes B effacent les lignes A
    # côtes et cônes d'ombre
    if ribs:
        for cx in (95 * s, W - 95 * s):
            hw = 78 * s
            top = 112 * s + ((xx - cx) / hw) ** 2 * 14 * s
            inside = np.abs(xx - cx) < hw
            shadow = inside & (yy > top + 3 * s)
            edge = ndi.gaussian_filter(shadow.astype(float), (0, 3 * s))
            I = I * (1 - 0.995 * edge)
            I += 1.6 * gauss(yy - top, 3.2 * s) * inside
    I *= np.exp(-yy / (1400 * s))
    return to_img(I)


def lung_figures():
    # Ligne pleurale, côtes, lignes A (signe de la chauve-souris)
    im = lung_linear(seed=3); d = chrome(im, 6)
    label(d, (95, 82), "Côte", anchor="ma"); label(d, (545, 82), "Côte", anchor="ma")
    label(d, (95, 300), "Cône d'ombre", anchor="ma", color=CYA, size=15)
    arrow(d, (330, 116), (330, 144)); label(d, (338, 96), "Ligne pleurale")
    arrow(d, (420, 272), (420, 296)); label(d, (428, 250), "Ligne A")
    arrow(d, (420, 424), (420, 446)); label(d, (428, 402), "Ligne A")
    save(im, "pp-lignes-a")

    im = lung_linear(alines=0.25, blines=[(250, 1), (330, 1), (405, 1)], seed=5); d = chrome(im, 6)
    label(d, (330, 96), "Ligne pleurale", anchor="ma")
    for x in (250, 330, 405):
        arrow(d, (x, 470), (x, 440))
    label(d, (330, 410), "Lignes B", anchor="ma")
    label(d, (95, 82), "Côte", anchor="ma"); label(d, (545, 82), "Côte", anchor="ma")
    save(im, "pp-lignes-b")

    im = lung_linear(alines=0.1, coalescent=True, seed=7); d = chrome(im, 6)
    label(d, (320, 96), "Ligne pleurale", anchor="ma")
    label(d, (320, 300), "Lignes B coalescentes", anchor="ma")
    label(d, (320, 324), "« poumon blanc »", anchor="ma", color=CYA, size=15)
    save(im, "pp-poumon-blanc")

    # Vignettes du score LUS (0 à 3)
    for name, kw in [("lus-0", dict(alines=1.0, seed=11)), ("lus-1", dict(alines=0.5, blines=[(235, 1), (345, 1), (430, 1)], seed=12)),
                     ("lus-2", dict(alines=0.1, coalescent=True, seed=13))]:
        save(lung_linear(320, 240, **kw), "pp-" + name, q=80)
    save(consolidation(320, 240, seed=14, labels=False), "pp-lus-3", q=80)


# ================================================================ secteur (convexe)
def fan(W, H, apex_y, R0, half_deg, depth):
    yy, xx = grid(H, W)
    cx = W / 2
    r = np.hypot(xx - cx, yy - apex_y)
    th = np.arctan2(xx - cx, yy - apex_y)
    m = (r >= R0) & (r <= R0 + depth) & (np.abs(th) <= math.radians(half_deg))
    m = ndi.gaussian_filter(m.astype(float), 0.8)
    return yy, xx, r - R0, th, m


def consolidation(W=640, H=480, seed=21, labels=True):
    s = W / 640
    yy, xx, d, th, m = fan(W, H, -260 * s, 262 * s, 34, 470 * s)
    E = np.zeros((H, W))
    E += np.where(d < 70 * s, 0.38 + 0.08 * np.sin(d / (3 * s)), 0)
    E += 0.7 * gauss(d - 40 * s, 2 * s)
    pleura = 1.3 * gauss(d - 74 * s, 2.4 * s)
    rough = np.interp(th, np.linspace(-0.7, 0.7, 400), smooth1d(400, 4, seed + 7)) * 22 + np.interp(th, np.linspace(-0.7, 0.7, 400), smooth1d(400, 1.2, seed + 8)) * 9
    bord = (300 + 24 * np.sin(th * 7 + 1) + rough) * s
    cons = (d > 76 * s) & (d < bord)
    E += np.where(cons, 0.56, 0)
    I = E * speckle(H, W, 1.2, 1.8, seed)
    I += pleura
    I += 1.0 * gauss(d - bord, 3 * s) * (0.6 + 0.4 * speckle(H, W, 2, 2, seed + 1))
    air = d > bord
    I += np.where(air, 0.16 * np.exp(-(d - bord) / (150 * s)), 0) * speckle(H, W, 1.5, 6, seed + 2)
    # bronchogramme aérien : petits segments hyperéchogènes ramifiés
    br = Image.new("L", (W, H), 0); bd = ImageDraw.Draw(br)
    rng = np.random.default_rng(seed + 3)
    for k in range(4):
        x0 = W / 2 + (k - 1.5) * 70 * s; y0 = 140 * s
        pts = [(x0, y0)]
        for j in range(5):
            x0 += rng.normal(0, 10) * s; y0 += (18 + rng.random() * 10) * s
            pts.append((x0, y0))
        bd.line(pts, fill=230, width=max(2, int(5 * s)))
        for p in pts[1:4]:
            bd.ellipse([p[0] - 3 * s, p[1] - 3 * s, p[0] + 3 * s, p[1] + 3 * s], fill=255)
    B = ndi.gaussian_filter(np.asarray(br, float) / 255, 1.2 * s) * cons
    I += 1.2 * B
    I *= np.exp(-d / (1500 * s))
    im = to_img(I, m)
    if labels:
        dr = chrome(im, None)
        label(dr, (W / 2, 34), "Ligne pleurale", anchor="ma", size=16)
        label(dr, (120, 190), "Aspect tissulaire", color=YEL)
        label(dr, (120, 212), "(hépatisation)", color=CYA, size=15)
        arrow(dr, (470, 175), (395, 205)); label(dr, (440, 150), "Bronchogramme")
        label(dr, (440, 170), "aérien", size=17)
        arrow(dr, (520, 400), (452, 270)); label(dr, (450, 405), "Limite irrégulière", size=16)
        label(dr, (450, 425), "(shred sign)", color=CYA, size=15)
    return im


def effusion(W=640, H=480, seed=31):
    yy, xx, d, th, m = fan(W, H, -260, 262, 34, 470)
    E = np.zeros((H, W))
    wall = d < 70
    E += np.where(wall, 0.38 + 0.08 * np.sin(d / 3), 0)
    lung_poly = Image.new("L", (W, H), 0)
    ImageDraw.Draw(lung_poly).polygon([(0, 195), (180, 262), (300, 318), (330, 336), (300, 356), (170, 395), (0, 440)], fill=255)
    lung = ndi.gaussian_filter(np.asarray(lung_poly, float) / 255, 7) > 0.5
    rr = np.hypot(xx - 720, yy - 600)
    liver = rr < 330
    diaph = gauss(rr - 330, 4)
    eff = (~wall) & (~lung) & (~liver) & (d > 73)
    E += np.where(lung, 0.62, 0) + np.where(liver, 0.5, 0) + np.where(eff, 0.008, 0)
    I = E * speckle(H, W, 1.1, 2.0, seed)
    I += 1.25 * gauss(d - 73, 2.3)
    I += 1.5 * diaph * (np.abs(th) < math.radians(34))
    edge = ndi.gaussian_filter(lung.astype(float), 1.5)
    I += 0.6 * np.clip(np.abs(np.gradient(edge)[0]) + np.abs(np.gradient(edge)[1]), 0, 1) * 3
    I *= np.exp(-d / 1600)
    # renforcement postérieur sous l'épanchement
    im = to_img(I, m)
    dr = chrome(im, None)
    label(dr, (W / 2, 30), "Paroi thoracique", anchor="ma", size=16)
    label(dr, (380, 150), "Épanchement", color=YEL, size=18, bold=True)
    label(dr, (380, 172), "anéchogène", color=CYA, size=15)
    label(dr, (60, 300), "Poumon", size=16); label(dr, (60, 320), "atélectasié", size=16)
    label(dr, (510, 300), "Diaphragme", size=16)
    label(dr, (530, 400), "Foie", size=16)
    darrow(dr, (200, 64), (200, 268), YEL, 3)
    label(dr, (212, 170), "Sep", size=18, bold=True)
    return im


# ================================================================ mode TM
def mmode(kind, W=640, H=300, seed=41, pleura=120):
    yy, xx = grid(H, W)
    prof = 0.35 + 0.25 * smooth1d(H, 2.5, seed)
    prof[:6] = 0.9
    wall = yy < pleura - 3
    I = np.where(wall, np.clip(prof, 0.05, 1)[:, None], 0) * speckle(H, W, 0.8, 40, seed + 1)
    I += 1.6 * gauss(yy - pleura, 2.2)
    below = yy > pleura + 3
    sand = 0.55 * np.exp(-(yy - pleura) / 260) * speckle(H, W, 1.0, 1.0, seed + 2)
    strat = (0.25 + 0.2 * np.abs(smooth1d(H, 1.8, seed + 3)))[:, None] * speckle(H, W, 0.8, 45, seed + 4)
    Aline = 0.7 * gauss(yy - 2 * pleura, 3)
    if kind == "seashore":
        I += below * sand
    elif kind == "barcode":
        I += below * (strat + Aline)
    elif kind == "lungpoint":
        seg = np.zeros(W, bool)
        for a, b in [(150, 255), (420, 520)]:
            seg[a:b] = True
        segm = ndi.gaussian_filter1d(seg.astype(float), 2)[None, :]
        I += below * (segm * sand + (1 - segm) * (strat + Aline))
    return to_img(I)


def mmode_figures():
    im = mmode("seashore"); d = chrome(im, None, False)
    label(d, (16, 30), "Paroi (immobile) : lignes horizontales", size=15, color=CYA)
    arrow(d, (470, 96), (470, 116)); label(d, (478, 76), "Ligne pleurale", size=15)
    label(d, (16, 250), "« Sable » : glissement pleural présent", size=16)
    save(im, "pp-tm-bord-de-mer")

    im = mmode("barcode", seed=43); d = chrome(im, None, False)
    arrow(d, (470, 96), (470, 116)); label(d, (478, 76), "Ligne pleurale", size=15)
    label(d, (16, 250), "Lignes horizontales : absence de glissement", size=16)
    save(im, "pp-tm-code-barres")

    im = mmode("lungpoint", seed=45); d = chrome(im, None, False)
    for x in (150, 420):
        arrow(d, (x, 22), (x, 102), YEL, 3)
    label(d, (155, 4), "Point poumon", size=15); label(d, (425, 4), "Point poumon", size=15)
    label(d, (16, 270), "Alternance code-barres / bord de mer au même endroit", size=15, color=CYA)
    save(im, "pp-tm-point-poumon")

    # signe sinusoïde (épanchement)
    W, H = 640, 300
    yy, xx = grid(H, W)
    prof = 0.35 + 0.25 * smooth1d(H, 2.5, 51); prof[:6] = 0.9
    I = np.where(yy < 92, np.clip(prof, 0.05, 1)[:, None], 0) * speckle(H, W, 0.8, 40, 52)
    I += 1.5 * gauss(yy - 95, 2.2)
    yl = 196 - 38 * np.sin(2 * np.pi * xx / 215)
    I += np.where(yy > yl + 3, 0.55, 0) * speckle(H, W, 1, 1.5, 53) + 1.4 * gauss(yy - yl, 2.6)
    I += np.where((yy > 98) & (yy < yl - 2), 0.01, 0)
    im = to_img(I); d = chrome(im, None, False)
    label(d, (16, 60), "Plèvre pariétale", size=15, color=CYA)
    label(d, (250, 112), "Épanchement", size=16)
    label(d, (16, 270), "Signe sinusoïde : le poumon se rapproche à l'inspiration", size=15)
    save(im, "pp-tm-sinusoide")


# ================================================================ diaphragme
def diaphragm_figures():
    # Voie sous-costale : foie et coupole, ligne TM
    W, H = 640, 480
    yy, xx, d, th, m = fan(W, H, -60, 64, 42, 470)
    cy = 560; cr = 290
    rr = np.hypot(xx - 320, yy - (cy - 600))
    dome = 150 + 0.0022 * (xx - 320) ** 2 + 180      # coupole : plus profonde au centre
    dome = 330 - 0.0035 * (xx - 320) ** 2 + 60
    liver = (yy < dome) & (d > 6)
    E = np.where(liver, 0.5, 0) + np.where(yy > dome, 0.28, 0)
    I = E * speckle(H, W, 1.1, 1.9, 61)
    I += 1.8 * gauss(yy - dome, 4.5)
    vc = np.hypot((xx - 250) / 34, (yy - 210) / 20) < 1
    I *= np.where(vc, 0.05, 1)
    I *= np.exp(-d / 1500)
    im = to_img(I, m); dr = chrome(im, None)
    dashed(dr, (320, 4), (320, 470), YEL, 2, 9)
    label(dr, (332, 30), "Ligne TM", size=15)
    label(dr, (120, 140), "Foie", size=18, bold=True)
    label(dr, (380, 330), "Coupole droite", size=16)
    label(dr, (380, 352), "(hyperéchogène)", size=15, color=CYA)
    label(dr, (190, 240), "Veine cave", size=14, color=CYA)
    save(im, "dia-sous-costale")

    # Tracé TM de la course diaphragmatique
    W, H = 640, 320
    yy, xx = grid(H, W)
    P = 212
    t = (xx % P) / P
    resp = np.where(t < 0.4, np.sin(np.pi / 2 * t / 0.4), np.where(t < 0.8, np.cos(np.pi / 2 * (t - 0.4) / 0.4), 0))
    base = 236; A = 60
    yd = base - A * resp
    shift = (A * resp) * np.clip(yy / base, 0, 1)
    liverE = 0.45 + 0.15 * smooth1d(H + 200, 3, 71)
    idx = np.clip((yy + shift).astype(int), 0, H + 199)
    I = np.where(yy < yd - 4, liverE[idx], 0) * speckle(H, W, 0.8, 22, 72)
    I += 1.9 * gauss(yy - yd, 5) + np.where(yy > yd + 6, 0.2, 0) * speckle(H, W, 1, 6, 73)
    im = to_img(I); dr = chrome(im, None, False)
    x0 = int(P * 0.4) + P
    dashed(dr, (P - 10, base), (P * 2 + 70, base), CYA, 2)
    dashed(dr, (x0 - 60, base - A), (x0 + 60, base - A), CYA, 2)
    darrow(dr, (x0 + 40, base - A + 2), (x0 + 40, base - 2), YEL, 3)
    label(dr, (x0 + 52, base - A / 2 - 10), "Course", size=17, bold=True)
    label(dr, (x0 + 52, base - A / 2 + 10), "= 18 mm", size=17)
    label(dr, (18, 14), "Foie", size=16)
    label(dr, (18, 292), "Inspiration : la coupole se rapproche de la sonde", size=15, color=CYA)
    dr.line([(560, 300), (560 + P / 2.2, 300)], fill=WHT, width=3); label(dr, (560, 278), "1 s", size=14, color=WHT)
    save(im, "dia-tm-course")

    # Épaisseur dans la zone d'apposition : fin d'expiration / fin d'inspiration
    panels = []
    for k, (th_px, lab, val) in enumerate([(24, "Fin d'expiration", "Ee = 2,0 mm"), (35, "Fin d'inspiration", "Ei = 2,9 mm")]):
        W, H = 320, 320
        yy, xx = grid(H, W)
        py = 128
        E = np.where(yy < 8, 0.9, 0) + np.where((yy >= 8) & (yy < 40), 0.3, 0) + np.where((yy >= 40) & (yy < py - 6), 0.42 + 0.1 * np.sin(yy / 3), 0)
        musc = (yy > py + 2) & (yy < py + th_px - 2)
        E += np.where(musc, 0.12, 0) + np.where(yy > py + th_px + 2, 0.5, 0)
        I = E * speckle(H, W, 0.9, 2.4, 80 + k)
        I += 1.5 * gauss(yy - py, 2.2) + 1.4 * gauss(yy - (py + th_px), 2.2) + 0.6 * gauss(yy - (py + th_px / 2), 1.2)
        im = to_img(I); dr = ImageDraw.Draw(im)
        for y in (py, py + th_px):
            dr.line([(150, y), (170, y)], fill=YEL, width=2); dr.line([(160, y - 8), (160, y + 8)], fill=YEL, width=2)
        dr.line([(160, py + 4), (160, py + th_px - 4)], fill=YEL, width=1)
        label(dr, (12, 10), lab, size=16, bold=True, color=WHT)
        label(dr, (180, py + th_px / 2 - 10), val, size=16)
        label(dr, (12, py - 30), "Plèvre", size=14, color=CYA)
        label(dr, (12, py + th_px + 6), "Péritoine", size=14, color=CYA)
        label(dr, (12, 270), "Foie", size=15)
        panels.append(im)
    out = Image.new("RGB", (646, 320), (0, 0, 0)); out.paste(panels[0], (0, 0)); out.paste(panels[1], (326, 0))
    save(out, "dia-epaisseur")


# ================================================================ bases : échogénicité, artefacts, sondes, Doppler
def basics_figures():
    # Échelle d'échogénicité
    W, H = 640, 260
    yy, xx = grid(H, W)
    S = speckle(H, W, 1.0, 2.0, 91)
    levels = [0.01, 0.18, 0.5, 1.2]
    I = np.zeros((H, W))
    for i, lv in enumerate(levels):
        I += np.where((xx >= i * 160) & (xx < (i + 1) * 160), lv, 0)
    I = I * S
    im = to_img(I); d = ImageDraw.Draw(im)
    for i, (t, sub) in enumerate([("Anéchogène", "liquide pur"), ("Hypoéchogène", "muscle, œdème"), ("Isoéchogène", "foie, rate"), ("Hyperéchogène", "graisse, fibrose, os")]):
        label(d, (i * 160 + 80, 92), t, anchor="ma", size=17, bold=True, color=YEL if i else (255, 230, 120))
        label(d, (i * 160 + 80, 120), sub, anchor="ma", size=12, color=CYA)
    save(im, "base-echogenicite")

    # Artefacts : cône d'ombre (calcul) et renforcement postérieur (kyste)
    W, H = 640, 360
    yy, xx = grid(H, W)
    E = np.full((H, W), 0.45)
    cyst = np.hypot((xx - 170) / 70, (yy - 120) / 55) < 1
    calc = np.hypot((xx - 470) / 40, (yy - 120) / 22) < 1
    E = np.where(cyst, 0.005, E)
    I = E * speckle(H, W, 1, 2, 92)
    behind_c = (np.abs(xx - 170) < 62) & (yy > 175)
    I *= np.where(behind_c, 1.9, 1)
    rimc = gauss(np.hypot((xx - 470) / 40, (yy - 120) / 22) - 1, 0.18) * (yy < 125)
    I += 2.2 * rimc
    shadow = (np.abs(xx - 470) < 38) & (yy > 130)
    I *= np.where(ndi.gaussian_filter(shadow.astype(float), 3) > 0.5, 0.04, 1)
    im = to_img(I); d = ImageDraw.Draw(im)
    label(d, (170, 110), "Kyste", anchor="ma", size=16, color=CYA)
    label(d, (170, 300), "Renforcement", anchor="ma", size=16); label(d, (170, 322), "postérieur", anchor="ma", size=16)
    label(d, (470, 70), "Calcul", anchor="ma", size=16, color=CYA)
    label(d, (470, 300), "Cône d'ombre", anchor="ma", size=16); label(d, (470, 322), "postérieur", anchor="ma", size=16)
    save(im, "base-ombre-renforcement")

    # Artefacts : réverbération (lignes A) et queue de comète
    im = lung_linear(alines=1.1, blines=[(330, 1)], seed=95); d = chrome(im, 6)
    arrow(d, (440, 275), (440, 298)); label(d, (448, 252), "Réverbération (ligne A)", size=15)
    arrow(d, (330, 470), (330, 430)); label(d, (346, 410), "Queue de comète (ligne B)", size=15)
    save(im, "base-reverberation")

    # Image en miroir (foie au-delà du diaphragme)
    W, H = 640, 400
    yy, xx, dd, th, m = fan(W, H, -60, 64, 42, 400)
    dome = 250 - 0.003 * (xx - 320) ** 2
    S1 = speckle(H, W, 1.1, 1.9, 96)
    mir = np.flipud(S1)
    I = np.where(yy < dome, 0.5 * S1, 0.38 * np.roll(mir, int(-2 * 250 + H), axis=0))
    I += 1.8 * gauss(yy - dome, 4)
    im = to_img(I, m); d = chrome(im, None)
    label(d, (120, 120), "Foie", size=17, bold=True)
    label(d, (400, 236), "Diaphragme", size=15)
    label(d, (230, 330), "Image en miroir du foie", size=16)
    label(d, (230, 352), "(poumon aéré normal)", size=14, color=CYA)
    save(im, "base-miroir")

    # Doppler couleur : vaisseau, BART
    W, H = 640, 300
    yy, xx = grid(H, W)
    E = np.full((H, W), 0.42)
    v1 = np.abs(yy - (110 + 0.12 * (xx - 320))) < 26
    v2 = np.abs(yy - (215 - 0.05 * (xx - 320))) < 20
    E = np.where(v1 | v2, 0.004, E)
    I = E * speckle(H, W, 1, 2, 97)
    im = to_img(I).convert("RGB")
    a = np.asarray(im).astype(float)
    prof1 = np.clip(1 - (np.abs(yy - (110 + 0.12 * (xx - 320))) / 26) ** 2, 0, 1)
    prof2 = np.clip(1 - (np.abs(yy - (215 - 0.05 * (xx - 320))) / 20) ** 2, 0, 1)
    box = (xx > 150) & (xx < 500)
    red = np.stack([230 * (0.5 + 0.5 * prof1), 40 + 140 * prof1 ** 3, 30 * prof1], -1)
    blue = np.stack([30 * prof2, 50 + 90 * prof2 ** 3, 210 * (0.55 + 0.45 * prof2)], -1)
    a = np.where((v1 & box)[..., None], red, a)
    a = np.where((v2 & box)[..., None], blue, a)
    im = Image.fromarray(a.clip(0, 255).astype(np.uint8)); d = ImageDraw.Draw(im)
    d.rectangle([150, 40, 500, 280], outline=(230, 230, 230), width=2)
    d.rectangle([560, 40, 584, 120], fill=(220, 50, 40)); d.rectangle([560, 160, 584, 240], fill=(40, 110, 230))
    label(d, (520, 20), "Vers la sonde", size=13, color=WHT); label(d, (512, 250), "S'éloigne", size=13, color=WHT)
    label(d, (12, 12), "Doppler couleur", size=16, bold=True, color=WHT)
    save(im, "base-doppler-couleur")

    # Doppler pulsé : spectre
    W, H = 640, 260
    img = Image.new("RGB", (W, H), (0, 0, 0)); d = ImageDraw.Draw(img)
    base = 190
    d.line([(0, base), (W, base)], fill=(120, 130, 140), width=1)
    rng = np.random.default_rng(98)
    for x in range(W):
        t = (x % 160) / 160
        v = 120 * math.exp(-((t - 0.16) / 0.07) ** 2) + 30 * math.exp(-((t - 0.45) / 0.12) ** 2) + 12
        for y in range(int(base - v), base):
            c = int(150 + 100 * rng.random())
            if rng.random() < 0.75:
                img.putpixel((x, y), (c, c, c))
    label(d, (12, 12), "Doppler pulsé : spectre vitesse / temps", size=16, bold=True, color=WHT)
    arrow(d, (60, 228), (60, 205), CYA); label(d, (70, 222), "Ligne de base", size=13, color=CYA)
    darrow(d, (30, base - 6), (30, base - 128), YEL); label(d, (36, 58), "Vmax", size=14)
    dr = d; dr.line([(500, 240), (580, 240)], fill=WHT, width=3); label(dr, (520, 218), "0,5 s", size=13, color=WHT)
    save(img, "base-doppler-pulse")


if __name__ == "__main__":
    lung_figures()
    save(consolidation(), "pp-condensation")
    save(effusion(), "pp-epanchement")
    mmode_figures()
    diaphragm_figures()
    basics_figures()
    print("\n".join(sorted(os.listdir(OUT))))
