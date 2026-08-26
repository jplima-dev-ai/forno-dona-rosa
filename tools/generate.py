"""
Gerador de ilustrações SVG de pizza — estilo flat/geométrico, paleta autoral.
Substitui fotos de banco hotlinkadas por arte vetorial original: zero
requisição de rede, zero risco de link quebrado, consistência total de marca.
"""
import math
import random

# ---------- illustration palette (derived from the brand palette and tuned for food) ----------
CRUST = "#d8a24a"
CRUST_SHADOW = "#b9843a"
CRUST_SPECK = "#8a5a26"
CHEESE_A = "#f0c250"
CHEESE_B = "#e8ad3c"
SAUCE = "#a8341c"
SAUCE_DEEP = "#7c2414"

BASIL = "#5c8a3a"
BASIL_DARK = "#456b2b"
MOZZ = "#fbeedd"
PEPPERONI = "#a1301f"
PEPPERONI_DARK = "#7c2416"
ONION = "#9a6a9e"
ONION_LIGHT = "#c092c4"
HAM = "#e8a6a1"
HAM_DARK = "#d1857f"
EGG_WHITE = "#f7ecd9"
EGG_YOLK = "#e8a93b"
OLIVE = "#2b2018"
PEA = "#7a9b5c"
GORGONZOLA = "#93a8a3"
PROVOLONE = "#eed49a"
NUTELLA = "#4a2c1d"
NUTELLA_SHINE = "#6b432c"
STRAWBERRY = "#c73b3b"
STRAWBERRY_SEED = "#f4ce85"
STRAWBERRY_LEAF = "#5c8a3a"
SUGAR = "#fdfaf3"


def scatter_points(n, r_min, r_max, seed, jitter=8):
    """Distribui n pontos de forma orgânica (não robótica) dentro de um anel."""
    rnd = random.Random(seed)
    points = []
    golden_angle = 137.5
    for i in range(n):
        angle = math.radians(i * golden_angle + rnd.uniform(-10, 10))
        r = rnd.uniform(r_min, r_max)
        x = 100 + r * math.cos(angle) + rnd.uniform(-jitter, jitter)
        y = 100 + r * math.sin(angle) + rnd.uniform(-jitter, jitter)
        points.append((x, y))
    return points


def base_pizza(cx=100, cy=100, r=92, cheese_gaps=True, seed=1, sauce_color=SAUCE):
    """Base reutilizável: crosta + molho + camada de queijo derretido com 'buracos' mostrando molho."""
    rnd = random.Random(seed)
    svg = []
    # crust
    svg.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{CRUST}"/>')
    # baked texture (small char marks along the crust)
    for i in range(18):
        angle = math.radians(i * 20 + rnd.uniform(-6, 6))
        rr = r - rnd.uniform(4, 11)
        x = cx + rr * math.cos(angle)
        y = cy + rr * math.sin(angle)
        rad = rnd.uniform(1.6, 3.2)
        opacity = rnd.uniform(0.25, 0.55)
        svg.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rad:.1f}" fill="{CRUST_SPECK}" opacity="{opacity:.2f}"/>')
    # sauce (visible base beneath the cheese)
    svg.append(f'<circle cx="{cx}" cy="{cy}" r="{r-14}" fill="{sauce_color}"/>')
    # melted-cheese layer (overlapping organic patches with some sauce still visible)
    if cheese_gaps:
        blobs = scatter_points(11, 5, r - 22, seed=seed + 1, jitter=10)
        for i, (x, y) in enumerate(blobs):
            rr = rnd.uniform(16, 26)
            fill = CHEESE_A if i % 2 == 0 else CHEESE_B
            svg.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rr:.1f}" fill="{fill}" opacity="0.94"/>')
    else:
        svg.append(f'<circle cx="{cx}" cy="{cy}" r="{r-16}" fill="{CHEESE_A}"/>')
    return "".join(svg)


def wrap(inner, viewbox="0 0 200 200", shadow=True, filter_id="ps"):
    filt = (
        f'<defs><filter id="{filter_id}" x="-20%" y="-20%" width="140%" height="140%">'
        '<feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#0a0604" flood-opacity="0.4"/>'
        "</filter></defs>"
        if shadow
        else ""
    )
    group_open = f'<g filter="url(#{filter_id})">' if shadow else "<g>"
    return f'<svg viewBox="{viewbox}" xmlns="http://www.w3.org/2000/svg" role="img">{filt}{group_open}{inner}</g></svg>'


# ---------- 1. MARGHERITA ----------
def margherita():
    parts = [base_pizza(seed=11)]
    # buffalo mozzarella — generous blobs with varied radius
    # organically (rnd is created ONCE outside the loop — recreating random.Random(seed)
    # on every iteration would make .uniform() return the same first value,
    # leaving every blob at exactly the same size)
    rnd_mozz = random.Random(12)
    for x, y in scatter_points(6, 8, 62, seed=12, jitter=6):
        rr = rnd_mozz.uniform(13, 19)
        parts.append(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{rr:.1f}" ry="{rr*0.82:.1f}" fill="{MOZZ}" opacity="0.95"/>')
    # basil leaves — deliberately larger so they remain readable at thumbnail size
    rnd = random.Random(13)
    for x, y in scatter_points(6, 20, 74, seed=13, jitter=8):
        rot = rnd.uniform(0, 360)
        parts.append(
            f'<g transform="translate({x:.1f},{y:.1f}) rotate({rot:.0f})">'
            f'<path d="M0,-13 C9,-9 9,9 0,13 C-9,9 -9,-9 0,-13 Z" fill="{BASIL}"/>'
            f'<path d="M0,-11 L0,11" stroke="{BASIL_DARK}" stroke-width="1" opacity="0.65"/>'
            f"</g>"
        )
    return wrap("".join(parts), filter_id="ps-margherita")


# ---------- 2. ARTISAN CALABRESA ----------
def calabresa():
    parts = [base_pizza(seed=21)]
    rnd_calabresa = random.Random(22)
    for x, y in scatter_points(8, 8, 68, seed=22, jitter=8):
        rr = rnd_calabresa.uniform(12, 17)
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rr:.1f}" fill="{PEPPERONI_DARK}"/>')
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rr*0.72:.1f}" fill="{PEPPERONI}"/>')
    # red-onion rings — only 4, kept large and readable
    rnd = random.Random(23)
    for x, y in scatter_points(4, 20, 62, seed=23, jitter=8):
        rx, ry = rnd.uniform(11, 15), rnd.uniform(5, 6.5)
        rot = rnd.uniform(0, 180)
        parts.append(
            f'<g transform="translate({x:.1f},{y:.1f}) rotate({rot:.0f})">'
            f'<ellipse rx="{rx:.1f}" ry="{ry:.1f}" fill="none" stroke="{ONION}" stroke-width="3"/>'
            f'<ellipse rx="{rx*0.55:.1f}" ry="{ry*0.55:.1f}" fill="none" stroke="{ONION_LIGHT}" stroke-width="2"/>'
            f"</g>"
        )
    return wrap("".join(parts), filter_id="ps-calabresa")


# ---------- 3. FOUR CHEESES ----------
def quatro_queijos():
    parts = [base_pizza(seed=31, cheese_gaps=False)]
    # four large, clearly differentiated zones (not confetti-like)
    zones = [
        (CHEESE_A, 55, 40, 34),
        (MOZZ, 145, 55, 30),
        (PROVOLONE, 60, 145, 32),
        (GORGONZOLA, 145, 140, 30),
    ]
    for fill, x, y, r in zones:
        parts.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" opacity="0.95"/>')
    # gorgonzola details remain inside their own zone for readability
    rnd = random.Random(33)
    for _ in range(10):
        x = 145 + rnd.uniform(-24, 24)
        y = 140 + rnd.uniform(-24, 24)
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rnd.uniform(1.6,2.8):.1f}" fill="#4d5f5c" opacity="0.75"/>')
    return wrap("".join(parts), filter_id="ps-quatro-queijos")


# ---------- 4. AMERICAN PEPPERONI ----------
def pepperoni():
    parts = [base_pizza(seed=41, cheese_gaps=False)]
    rnd = random.Random(42)
    for x, y in scatter_points(11, 6, 74, seed=42, jitter=7):
        rr = rnd.uniform(12, 16)
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rr:.1f}" fill="{PEPPERONI_DARK}"/>')
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rr*0.74:.1f}" fill="{PEPPERONI}"/>')
        for a in range(6):
            ang = math.radians(a * 60 + rnd.uniform(-8, 8))
            sx = x + (rr * 0.74) * math.cos(ang)
            sy = y + (rr * 0.74) * math.sin(ang)
            parts.append(f'<circle cx="{sx:.1f}" cy="{sy:.1f}" r="1.4" fill="{PEPPERONI_DARK}" opacity="0.6"/>')
    return wrap("".join(parts), filter_id="ps-pepperoni")


# ---------- 5. HOUSE PORTUGUESE ----------
def portuguesa():
    parts = [base_pizza(seed=51)]
    rnd = random.Random(52)
    pts = scatter_points(11, 10, 72, seed=52, jitter=8)
    for i, (x, y) in enumerate(pts):
        kind = i % 5
        if kind == 0:  # ham — larger piece
            rr = rnd.uniform(13, 17)
            parts.append(f'<path d="M{x-rr},{y} q{rr},{-rr*1.1} {rr*2},0 q{-rr},{rr*1.1} {-rr*2},0 Z" fill="{HAM}" stroke="{HAM_DARK}" stroke-width="0.8"/>')
        elif kind == 1:  # egg
            parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="11" fill="{EGG_WHITE}"/>')
            parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4.6" fill="{EGG_YOLK}"/>')
        elif kind == 2:  # onion
            rx, ry = rnd.uniform(10, 13), rnd.uniform(4.5, 6)
            parts.append(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="none" stroke="{ONION}" stroke-width="2.6"/>')
        elif kind == 3:  # olive
            parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="6.2" fill="{OLIVE}"/>')
            parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="2.2" fill="{SAUCE}"/>')
        else:  # peas grouped together
            for j in range(3):
                ang = math.radians(j * 120)
                px = x + 4.5 * math.cos(ang)
                py = y + 4.5 * math.sin(ang)
                parts.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="3.4" fill="{PEA}"/>')
    return wrap("".join(parts), filter_id="ps-portuguesa")


# ---------- 6. NUTELLA & STRAWBERRY (dessert pizza) ----------
def nutella_morango():
    parts = [base_pizza(seed=61, cheese_gaps=False, sauce_color="#5a3822")]
    # Nutella layer — warm brown tone (not black) with a subtle swirl
    parts.append(f'<circle cx="100" cy="100" r="76" fill="{NUTELLA}"/>')
    rnd = random.Random(62)
    for i in range(5):
        rr = 65 - i * 11
        parts.append(f'<circle cx="100" cy="100" r="{rr}" fill="none" stroke="{NUTELLA_SHINE}" stroke-width="2.2" opacity="0.35"/>')
    # sliced strawberries — intentionally larger and clearly recognizable
    for x, y in scatter_points(6, 18, 66, seed=63, jitter=8):
        rot = rnd.uniform(0, 360)
        parts.append(
            f'<g transform="translate({x:.1f},{y:.1f}) rotate({rot:.0f})">'
            f'<path d="M0,-17 C12,-17 13,10 0,17 C-13,10 -12,-17 0,-17 Z" fill="{STRAWBERRY}"/>'
            f'<path d="M0,-17 L-5,-21 L0,-18 L5,-21 Z" fill="{STRAWBERRY_LEAF}"/>'
        )
        for _ in range(6):
            sx = rnd.uniform(-6, 6)
            sy = rnd.uniform(-11, 11)
            parts.append(f'<circle cx="{sx:.1f}" cy="{sy:.1f}" r="0.9" fill="{STRAWBERRY_SEED}"/>')
        parts.append("</g>")
    # powdered sugar
    for x, y in scatter_points(22, 4, 78, seed=64, jitter=12):
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="1.1" fill="{SUGAR}" opacity="0.9"/>')
    return wrap("".join(parts), filter_id="ps-nutella")


# ---------- HERO: full pizza, editorial composition, with one slice slightly pulled ----------
def hero_pizza():
    cx, cy, r = 105, 105, 92
    parts = []
    parts.append(base_pizza(cx=cx, cy=cy, r=r, seed=1))
    rnd_mozz = random.Random(2)
    for x, y in scatter_points(6, 10, 66, seed=2, jitter=6):
        rr = rnd_mozz.uniform(13, 18)
        parts.append(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{rr:.1f}" ry="{rr*0.82:.1f}" fill="{MOZZ}" opacity="0.95"/>')
    rnd = random.Random(3)
    for x, y in scatter_points(7, 20, 76, seed=3, jitter=8):
        rot = rnd.uniform(0, 360)
        parts.append(
            f'<g transform="translate({x:.1f},{y:.1f}) rotate({rot:.0f})">'
            f'<path d="M0,-13 C9,-9 9,9 0,13 C-9,9 -9,-9 0,-13 Z" fill="{BASIL}"/>'
            f'<path d="M0,-11 L0,11" stroke="{BASIL_DARK}" stroke-width="1" opacity="0.65"/></g>'
        )
    # subtle sliced effect: just the cut line plus a slight highlight, without trying to
    # fully separate the slice (the previous effect became too noisy at final size)
    for ang_deg in (-8, 82):
        ang = math.radians(ang_deg)
        x1, y1 = cx + 14 * math.cos(ang), cy + 14 * math.sin(ang)
        x2, y2 = cx + (r - 6) * math.cos(ang), cy + (r - 6) * math.sin(ang)
        parts.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{SAUCE_DEEP}" stroke-width="1.6" opacity="0.55" stroke-dasharray="1 3.5" stroke-linecap="round"/>')
    # olive-oil sheen (thin golden arcs) — adds an editorial finish
    parts.append(f'<path d="M {cx-40},{cy-50} Q {cx-10},{cy-62} {cx+30},{cy-46}" stroke="#ffe3a3" stroke-width="1.4" fill="none" opacity="0.45" stroke-linecap="round"/>')
    parts.append(f'<path d="M {cx-20},{cy+52} Q {cx+15},{cy+62} {cx+46},{cy+44}" stroke="#ffe3a3" stroke-width="1.2" fill="none" opacity="0.35" stroke-linecap="round"/>')
    return wrap("".join(parts), viewbox="0 0 210 210", filter_id="ps-hero")


VARIANTS = {
    "margherita": margherita,
    "calabresa": calabresa,
    "quatro-queijos": quatro_queijos,
    "pepperoni": pepperoni,
    "portuguesa": portuguesa,
    "nutella-morango": nutella_morango,
    "hero": hero_pizza,
}

if __name__ == "__main__":
    import os

    out_dir = "/home/claude/pizza-art"
    os.makedirs(out_dir, exist_ok=True)
    for name, fn in VARIANTS.items():
        svg = fn()
        with open(os.path.join(out_dir, f"{name}.svg"), "w", encoding="utf-8") as f:
            f.write(svg)
        print(f"gerado: {name}.svg ({len(svg)} bytes)")
