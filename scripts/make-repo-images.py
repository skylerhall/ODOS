"""Builds the README logo and the GitHub social preview from assets/icon.png into docs/images/.
Run from the repo root after `npm install` (it uses the bundled Geist fonts):
python3 scripts/make-repo-images.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'docs' / 'images'
GEIST = ROOT / 'node_modules' / '@expo-google-fonts' / 'geist'
# Geist has no Greek letters.
GREEK = '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'

BG = (16, 19, 23, 255)
ORANGE = (255, 143, 77)


def geist(weight, size):
    name = {500: '500Medium', 600: '600SemiBold', 800: '800ExtraBold'}[weight]
    return ImageFont.truetype(str(GEIST / name / f'Geist_{name}.ttf'), size)


def rounded(im, radius):
    mask = Image.new('L', im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, im.size[0] - 1, im.size[1] - 1], radius, fill=255)
    out = im.copy()
    out.putalpha(mask)
    return out


def logo(icon):
    rounded(icon.resize((256, 256), Image.LANCZOS), 56).save(OUT / 'logo.png', optimize=True)


def social_preview(icon):
    w, h = 1280, 640
    im = Image.new('RGBA', (w, h), BG)
    glow = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse([60, 110, 500, 550], fill=(244, 90, 12, 60))
    im.alpha_composite(glow.filter(ImageFilter.GaussianBlur(90)))
    im.alpha_composite(rounded(icon.resize((380, 380), Image.LANCZOS), 84), (90, 130))

    d = ImageDraw.Draw(im)
    x = 540
    d.text((x - 6, 145), 'ODOS', font=geist(800, 140), fill=(255, 255, 255))
    greek = ImageFont.truetype(GREEK, 30)
    d.text((x, 312), 'ὁδός', font=greek, fill=ORANGE)
    d.text((x + d.textlength('ὁδός', font=greek) + 12, 312), '·  Greek for "the road"', font=geist(500, 30), fill=ORANGE)
    d.text((x, 385), 'Open-source road-trip GPS for Android', font=geist(600, 34), fill=(232, 236, 241))
    d.text((x, 437), 'Live traffic · fuel planning · offline trail navigation', font=geist(500, 30), fill=(154, 166, 182))
    d.text((x, 520), 'github.com/skylerhall/odos', font=geist(600, 24), fill=(110, 122, 138))
    im.convert('RGB').save(OUT / 'social-preview.png', optimize=True)


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    source = Image.open(ROOT / 'assets' / 'icon.png').convert('RGBA')
    logo(source)
    social_preview(source)
    print('wrote', sorted(p.name for p in OUT.iterdir()))
