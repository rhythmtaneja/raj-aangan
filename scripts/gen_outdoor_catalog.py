# Generates lib/menu-builder/generated/outdoor-catalog.ts from the client's
# outdoor catering workbook (docs/menu-source/raw/RAEC Outdoor Catering.xlsx).
#
# One worksheet = one catalog SECTION (a CatalogItem). Every row in a sheet =
# one VARIANT (a box / packet / collection / van), column A being its name and
# column B its comma-separated contents. The sheet's own header row supplies
# the two labels shown in the UI ("Box Category" / "Contents", "Van Category" /
# "Menu / Offerings", …), so the wording stays the client's.
#
# The workbook carries NO prices, categories or copy — those live in
# SECTION_META below and are the placeholders carried over from the previous
# hardcoded catalog. One price per section applies to every variant in it;
# each variant also gets `price: null`, the per-variant override the client
# fills later (in Studio, once the CMS pass lands).
#
# xlsx is read with the stdlib only (zipfile + ElementTree) — no openpyxl, so
# this runs anywhere python3 does, exactly like the other generators here.
#
# Run from the repo root:  python3 scripts/gen_outdoor_catalog.py
import os
import re
import zipfile
from collections import OrderedDict
from xml.etree import ElementTree as ET

SRC = "docs/menu-source/raw/RAEC Outdoor Catering.xlsx"
OUT = "lib/menu-builder/generated/outdoor-catalog.ts"

# ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
# sheet name -> the metadata the workbook doesn't carry. `price` is the single
# placeholder price applied to EVERY variant in that section until the client
# gives per-variant prices. price None + unit "on request" = an enquiry-only
# section (no rupee value, contributes 0 to the quote).
SECTION_META = OrderedDict([
    ("Wedding Favour Boxes", {
        "slug": "wedding-favour-boxes",
        "category": "sweet-box",
        "description": "Assorted mithai in festive wedding packaging",
        "price": 220, "unit": "per box", "image": 5,
    }),
    ("Mix Sweet Boxes", {
        "slug": "mix-sweet-boxes",
        "category": "sweet-box",
        "description": "Mixed mithai, namkeen and dry fruit boxes",
        "price": 220, "unit": "per box", "image": 6,
    }),
    ("Ladoo & Mithai", {
        "slug": "ladoo-and-mithai",
        "category": "bulk-mithai",
        "description": "Bulk ladoo, barfi, peda and traditional mithai",
        "price": 380, "unit": "per kg", "image": 7,
    }),
    ("Corporate Meal Boxes", {
        "slug": "corporate-meal-boxes",
        "category": "meal-box",
        "description": "Boxed meals for offices, conferences and events",
        "price": 260, "unit": "per box", "image": 8,
    }),
    ("Festive Snack Packets", {
        "slug": "festive-snack-packets",
        "category": "snack-packet",
        "description": "Sealed namkeen, kachori and mithai packets",
        "price": 120, "unit": "per packet", "image": 9,
    }),
    ("Packed Breakfast Boxes", {
        "slug": "packed-breakfast-boxes",
        "category": "meal-box",
        "description": "Sealed breakfast boxes with a beverage",
        "price": 180, "unit": "per box", "image": 10,
    }),
    ("Live Food Vans", {
        "slug": "live-food-vans",
        "category": "live-counter-van",
        "description": "Live counters on wheels, served on-site",
        "price": 15000, "unit": "per day", "image": 11,
    }),
    ("Premium Add-ons", {
        "slug": "premium-add-ons",
        "category": "premium-addon",
        "description": "Specialist catering formats — quoted on request",
        "price": None, "unit": "on request", "image": 12,
    }),
])

# Sheets that are an index / contents page rather than a catalog section.
SKIP_SHEETS = {"Catalogue Index"}

# Fallback header wording when a sheet's header cell is blank.
DEFAULT_VARIANT_LABEL = "Box Category"
DEFAULT_CONTENTS_LABEL = "Contents"

# ═══════════════════════════════════════════════════════════════════════════

NS = {
    "m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}


def esc(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')


def read_workbook(path):
    """-> OrderedDict sheet name -> list of rows, each row a list of cells."""
    z = zipfile.ZipFile(path)

    shared = []
    if "xl/sharedStrings.xml" in z.namelist():
        for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", NS):
            shared.append("".join(t.text or "" for t in si.iter("{%s}t" % NS["m"])))

    rels = {}
    for rel in ET.fromstring(z.read("xl/_rels/workbook.xml.rels")):
        target = rel.get("Target").lstrip("/")
        rels[rel.get("Id")] = target if target.startswith("xl/") else "xl/" + target

    def col_idx(ref):
        n = 0
        for c in re.match(r"[A-Z]+", ref).group():
            n = n * 26 + (ord(c) - 64)
        return n - 1

    sheets = OrderedDict()
    wb = ET.fromstring(z.read("xl/workbook.xml"))
    for sh in wb.find("m:sheets", NS):
        name = sh.get("name")
        root = ET.fromstring(z.read(rels[sh.get("{%s}id" % NS["r"])]))
        rows = []
        for row in root.find("m:sheetData", NS).findall("m:row", NS):
            cells = {}
            for c in row.findall("m:c", NS):
                v = c.find("m:v", NS)
                inline = c.find("m:is", NS)
                if c.get("t") == "s" and v is not None:
                    val = shared[int(v.text)]
                elif inline is not None:
                    val = "".join(t.text or "" for t in inline.iter("{%s}t" % NS["m"]))
                elif v is not None:
                    val = v.text
                else:
                    val = ""
                val = (val or "").strip()
                if val:
                    cells[col_idx(c.get("r"))] = val
            if cells:
                rows.append([cells.get(i, "") for i in range(max(cells) + 1)])
        sheets[name] = rows
    return sheets


def split_contents(raw):
    """'Kaju Katli, Motichoor Ladoo' -> ['Kaju Katli', 'Motichoor Ladoo']"""
    return [p.strip() for p in raw.split(",") if p.strip()]


sheets = read_workbook(SRC)

unknown = [n for n in sheets if n not in SECTION_META and n not in SKIP_SHEETS]
if unknown:
    raise SystemExit(
        "Sheet(s) missing from SECTION_META (add price/category/unit for them "
        "before regenerating): " + ", ".join(unknown)
    )

items_ts = []
variant_total = 0

for name, meta in SECTION_META.items():
    rows = sheets.get(name)
    if rows is None:
        raise SystemExit("Sheet %r is in SECTION_META but not in the workbook." % name)

    header = rows[0] if rows else []
    # A blank header cell (Packed Breakfast Boxes ships one) falls back.
    variant_label = (header[0] if len(header) > 0 else "") or DEFAULT_VARIANT_LABEL
    contents_label = (header[1] if len(header) > 1 else "") or DEFAULT_CONTENTS_LABEL
    # Excel stores a numeric-looking header ("0") as a number; not a label.
    if variant_label.isdigit():
        variant_label = DEFAULT_VARIANT_LABEL

    variants_ts = []
    for i, row in enumerate(rows[1:], start=1):
        vname = row[0] if len(row) > 0 else ""
        contents = split_contents(row[1] if len(row) > 1 else "")
        if not vname:
            continue
        variant_total += 1
        contents_ts = ", ".join('"%s"' % esc(c) for c in contents)
        variants_ts.append(
            '      { id: "%s-%d", name: "%s", contents: [%s], price: null }'
            % (meta["slug"], i, esc(vname), contents_ts)
        )

    items_ts.append(
        '''  {
    id: "%s",
    name: "%s",
    description: "%s",
    price: %s,
    unit: "%s",
    image: "/images/mb/placeholder-%d.jpg",
    category: "%s",
    variantLabel: "%s",
    contentsLabel: "%s",
    variants: [
%s,
    ],
  }'''
        % (
            meta["slug"],
            esc(name),
            esc(meta["description"]),
            meta["price"] if meta["price"] is not None else "null",
            esc(meta["unit"]),
            meta["image"],
            meta["category"],
            esc(variant_label),
            esc(contents_label),
            ",\n".join(variants_ts),
        )
    )

header_ts = '''// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/generated/outdoor-catalog.ts
// ══════════════════════════════════════════════════════════════════
// GENERATED FILE — do not edit by hand.
// Source: docs/menu-source/raw/RAEC Outdoor Catering.xlsx — one worksheet per
// section, one row per variant (name + comma-separated contents).
//
// Prices/categories/descriptions are NOT in the workbook; they come from
// SECTION_META in scripts/gen_outdoor_catalog.py and are placeholders. Every
// variant inherits its section's price (variant.price === null) until the
// client supplies per-variant prices.
// Regenerate via scripts/gen_outdoor_catalog.py.
// ═══════════════════════════════════════════════════════════════════════════

import type { CatalogItem } from "../types";

export const OUTDOOR_CATALOG_ITEMS: CatalogItem[] = [
'''

os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, "w").write(header_ts + ",\n".join(items_ts) + ",\n];\n")
print("Wrote %s: %d sections, %d variants" % (OUT, len(items_ts), variant_total))
