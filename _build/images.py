"""Gera as imagens do site a partir dos assets de cada app.

Rode da raiz do repositório:  python _build/images.py
Lê de D:\\Novo Projeto\\<pasta>\\assets e escreve em <slug>/img e assets/img.
"""
from pathlib import Path
import shutil

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PROJECTS = ROOT.parent
FONT = ROOT / "assets/fonts/bricolage-latin.woff2"
BODY_FONT = ROOT / "assets/fonts/dmsans-latin.woff2"

PAPER = (244, 242, 236)
INK = (23, 22, 20)
MUTED = (103, 99, 91)
LIME = (210, 243, 76)

# slug do site -> pasta do projeto
APPS = {
    "studz": "studyflow",
    "geladeira": "geladeira",
    "constante": "constante",
    "lacre": "lacre",
    "folga": "folga",
}


def font(size, weight=800, path=FONT):
    f = ImageFont.truetype(str(path), size)
    try:
        axes = f.get_variation_axes()
        values = []
        for a in axes:
            name = a["name"]
            if name in (b"Weight", "Weight"):
                values.append(weight)
            elif name in (b"Optical size", "Optical size"):
                values.append(min(a["maximum"], max(a["minimum"], size)))
            else:
                values.append(a["default"])
        f.set_variation_by_axes(values)
    except Exception:
        pass
    return f


def rounded(im, radius_ratio=0.22):
    im = im.convert("RGBA")
    w, h = im.size
    mask = Image.new("L", (w * 4, h * 4), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w * 4, h * 4), radius=int(w * 4 * radius_ratio), fill=255)
    mask = mask.resize((w, h), Image.LANCZOS)
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    out.paste(im, (0, 0), mask)
    return out


def app_images():
    for slug, folder in APPS.items():
        src = PROJECTS / folder / "assets"
        out = ROOT / slug / "img"
        out.mkdir(parents=True, exist_ok=True)

        icon = Image.open(src / "icon.png").convert("RGBA")
        rounded(icon.resize((512, 512), Image.LANCZOS)).save(out / "icon-512.png", optimize=True)
        r = rounded(icon.resize((192, 192), Image.LANCZOS))
        r.save(out / "icon-192.png", optimize=True)
        r.save(out / "icon-192.webp", quality=90, method=6)

        fg = Image.open(src / "brand/play-feature-graphic.png").convert("RGB")
        fg.save(out / "feature.webp", quality=86, method=6)
        fg.save(out / "og.png", optimize=True)

        shots = sorted((src / "brand/store-screenshots").glob("*.png"))
        for old in out.glob("shot-*.webp"):
            old.unlink()
        for i, p in enumerate(shots, 1):
            im = Image.open(p).convert("RGB").resize((540, 960), Image.LANCZOS)
            im.save(out / f"shot-{i:02d}.webp", quality=80, method=6)
        print(slug, "icon ok,", len(shots), "screenshots")


def company_images():
    out = ROOT / "assets/img"
    out.mkdir(parents=True, exist_ok=True)

    # Marca: "m'" em papel sobre tinta, com o apóstrofo no verde-limão do marca-texto.
    def mark(size):
        s = size * 4
        im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        d.rounded_rectangle((0, 0, s, s), radius=int(s * 0.24), fill=INK)
        f = font(int(s * 0.70), 800)
        m_box = d.textbbox((0, 0), "m", font=f)
        a_box = d.textbbox((0, 0), "\u2019", font=f)
        m_w = m_box[2] - m_box[0]
        a_w = a_box[2] - a_box[0]
        gap = int(s * 0.02)
        total = m_w + gap + a_w
        x = (s - total) // 2 - m_box[0]
        m_h = m_box[3] - m_box[1]
        y = (s - m_h) // 2 - m_box[1] + int(s * 0.02)
        d.text((x, y), "m", font=f, fill=PAPER)
        d.text((x + m_w + gap - a_box[0] + m_box[0], y), "\u2019", font=f, fill=LIME)
        return im.resize((size, size), Image.LANCZOS)

    mark(512).save(out / "mark-512.png", optimize=True)
    mark(180).save(out / "apple-touch-icon.png", optimize=True)
    mark(48).save(out / "favicon-48.png", optimize=True)
    mark(32).save(ROOT / "favicon.ico", sizes=[(32, 32)])

    # Imagem de compartilhamento (Open Graph) da empresa.
    W, H = 1200, 630
    og = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(og)
    pad = 80
    m = mark(96)
    og.paste(m, (pad, pad), m)
    title = font(92, 800)
    line1, line2 = "Apps pequenos, úteis", "e caprichados."
    y = 250
    d.text((pad, y), line1, font=title, fill=INK)
    bb = d.textbbox((pad, y + 104), line2, font=title)
    d.rectangle((bb[0] - 6, bb[1] + (bb[3] - bb[1]) * 0.45, bb[2] + 6, bb[3] + 10), fill=LIME)
    d.text((pad, y + 104), line2, font=title, fill=INK)
    d.text((pad + 124, pad + 22), "Mapa’s", font=font(48, 800), fill=INK)
    d.text((pad, H - pad - 30), "Sem cadastro. Sem anúncios. Tudo no seu celular.", font=font(30, 500, BODY_FONT), fill=MUTED)
    # ícones dos apps no canto
    x = W - pad - 5 * 72 - 4 * 14
    for slug in APPS:
        ic = Image.open(ROOT / slug / "img/icon-192.png").resize((72, 72), Image.LANCZOS)
        og.paste(ic, (x, pad + 12), ic)
        x += 86
    og.save(out / "og.png", optimize=True)

    shutil.copy(ROOT / "_build/badge-pt.png", out / "google-play-badge.png")
    print("company images ok")


if __name__ == "__main__":
    app_images()
    company_images()
