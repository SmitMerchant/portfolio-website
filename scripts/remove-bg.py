"""
Key out the baked-in checkerboard background from the hero portrait and
write a true-transparent PNG cutout.

The source file (public/hero-portrait.png) is actually a JPEG whose
"transparent" areas are an opaque light/grey checkerboard. We detect the
background as bright + low-saturation pixels that are connected to the image
border, fill interior holes, feather the edge, then save RGBA.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

SRC = "public/hero-portrait.png"
OUT = "public/hero-cutout.png"

# Tunables
BRIGHT_MIN = 170   # checkerboard squares are light
SAT_MAX = 34       # ...and almost colourless
ERODE_PX = 1       # shave off the light fringe left by JPEG edges
FEATHER_PX = 1.1   # soft alpha edge so it blends into the backdrop


def main():
    img = Image.open(SRC).convert("RGB")
    arr = np.asarray(img).astype(np.int16)
    h, w = arr.shape[:2]
    print(f"source {w}x{h}")

    mx = arr.max(axis=2)
    mn = arr.min(axis=2)
    sat = mx - mn
    bright = mx

    bg_cand = (bright >= BRIGHT_MIN) & (sat <= SAT_MAX)

    # Treat every sizeable light/colourless region as background — this covers
    # the outer checkerboard AND enclosed gaps (e.g. between arm and torso).
    # Tiny bg specks inside the subject (stray highlights) are kept as subject.
    MIN_BG_AREA = 220
    bg_labels, _ = ndimage.label(bg_cand)
    sizes = np.bincount(bg_labels.ravel())
    keep = np.zeros(sizes.shape, dtype=bool)
    keep[1:] = sizes[1:] >= MIN_BG_AREA
    bg = keep[bg_labels]

    foreground = ~bg
    # Drop small floating foreground specks (JPEG noise in the background).
    MIN_FG_AREA = 600
    fg_labels, _ = ndimage.label(foreground)
    fsizes = np.bincount(fg_labels.ravel())
    fkeep = np.zeros(fsizes.shape, dtype=bool)
    fkeep[1:] = fsizes[1:] >= MIN_FG_AREA
    foreground = fkeep[fg_labels]
    # Trim the bright halo ring left where subject meets checkerboard.
    if ERODE_PX > 0:
        foreground = ndimage.binary_erosion(foreground, iterations=ERODE_PX)

    alpha = (foreground * 255).astype(np.uint8)
    alpha_img = Image.fromarray(alpha, mode="L")
    if FEATHER_PX > 0:
        alpha_img = alpha_img.filter(ImageFilter.GaussianBlur(FEATHER_PX))

    out = img.convert("RGBA")
    out.putalpha(alpha_img)

    # Crop to the subject's bounding box (+ small padding) so the component can
    # place it precisely without big empty margins.
    bbox = Image.fromarray(alpha).getbbox()
    if bbox:
        pad = 8
        l, t, r, b = bbox
        l = max(0, l - pad); t = max(0, t - pad)
        r = min(w, r + pad); b = min(h, b + pad)
        out = out.crop((l, t, r, b))
        print(f"cropped to {out.width}x{out.height}")

    out.save(OUT)
    fg_pct = 100 * foreground.mean()
    print(f"foreground coverage {fg_pct:.1f}%  ->  {OUT}")


if __name__ == "__main__":
    main()
