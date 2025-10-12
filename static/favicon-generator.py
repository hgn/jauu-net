#!/usr/bin/env python3
"""
favicon-generator.py
Generate favicons from images/header.png, preserving the left→right gradient.

Outputs (in the SAME FOLDER as this script):
  - favicon-16x16.png
  - favicon-32x32.png
  - favicon.ico   (multi-size: 16 & 32)

Behavior:
- The header image typically has a colorful stripe at the top and black below.
- We detect the bright stripe, collapse it vertically (so all colors contribute),
  and resample to a square while preserving left→right color mapping.

Dependencies:
  pip install pillow numpy
"""

from __future__ import annotations
import sys
from pathlib import Path
import numpy as np
from PIL import Image

# ---- Config (minimal) -------------------------------------------------------

INPUT_PATH = Path("images/header.png")
SIZES = (16, 32)

# ---- Helpers ----------------------------------------------------------------

def _script_dir() -> Path:
    return Path(__file__).resolve().parent

def detect_color_stripe(img: Image.Image) -> Image.Image:
    """
    Detect the colorful stripe at the top (exclude the black area below).
    If detection fails, return the original image.
    """
    arr = np.asarray(img.convert("RGB"), dtype=np.uint8)
    # Brightness per row (simple average of RGB)
    row_brightness = arr.mean(axis=(1, 2))

    # Dynamic threshold: treat rows clearly brighter than very dark/black as stripe
    # This is conservative and works for "bright stripe on black" headers.
    thr = max(5.0, row_brightness.mean() * 0.5)
    mask = row_brightness > thr

    if not mask.any():
        return img  # fallback

    # Take the first contiguous bright run from the top
    bright_idx = np.where(mask)[0]
    start = int(bright_idx[0])
    end = start
    for i in range(start, len(mask)):
        if mask[i]:
            end = i
        else:
            break

    # pad a couple rows to avoid a hard boundary
    start = max(0, start - 2)
    end = min(img.height - 1, end + 2)
    return img.crop((0, start, img.width, end + 1))

def collapse_vertically_keep_lr_gradient(stripe: Image.Image) -> Image.Image:
    """
    Collapse vertical info while preserving left→right gradient:
    - Convert stripe to 1-row image via vertical averaging (area/BOX).
    - Then scale to target square later.
    Returns a 1px tall image with full width.
    """
    w, h = stripe.size
    # Resize height to 1 using BOX filter: this averages rows and keeps LR colors
    one_row = stripe.resize((w, 1), Image.Resampling.BOX)
    return one_row

def make_square_from_row(one_row: Image.Image, size: int) -> Image.Image:
    """
    Map the 1-row gradient to a square:
    - Resize width to 'size' (BOX for good downsampling).
    - Tile the single row vertically to 'size' so the gradient reads cleanly.
      (Alternatives: stretch with BILINEAR; tiling stays crisp.)
    """
    row_resized = one_row.resize((size, 1), Image.Resampling.BOX)
    # Tile vertically
    sq = Image.new("RGBA", (size, size))
    # Repeat the row to fill the square
    for y in range(size):
        sq.paste(row_resized, (0, y))
    return sq

# ---- Main -------------------------------------------------------------------

def main() -> int:
    src = INPUT_PATH
    if not src.exists():
        print(f"ERROR: Input not found: {src}", file=sys.stderr)
        return 1

    img = Image.open(src).convert("RGBA")

    # 1) Detect colorful top stripe (ignore black area)
    stripe = detect_color_stripe(img)

    # 2) Collapse vertically but keep left→right axis intact
    row = collapse_vertically_keep_lr_gradient(stripe)

    # 3) Generate icons in the script directory
    out_dir = _script_dir()
    png_paths = []
    for sz in SIZES:
        icon = make_square_from_row(row, sz)
        p = out_dir / f"favicon-{sz}x{sz}.png"
        icon.save(p)
        png_paths.append(p)

    # 4) ICO (multi-size)
    #   Build from the larger image and embed both sizes
    largest = max(SIZES)
    base_for_ico = make_square_from_row(row, largest)
    ico_path = out_dir / "favicon.ico"
    base_for_ico.save(ico_path, sizes=[(s, s) for s in sorted(SIZES)])

    print("Generated favicons:")
    for p in png_paths:
        print(f" - {p.name}")
    print(f" - {ico_path.name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

