# Generates lib/menu-builder/generated/custom-menu.ts from the master à-la-carte
# CSV (docs/menu-source/raw/RAEC_master_menu.csv). Group by section, then by
# subsection (blank subsection => a single flat group). Prices are intentionally
# empty for now (null) — the client fills them later.
#
# Run from the repo root:  python3 scripts/gen_custom_menu.py
import csv, re, os
from collections import OrderedDict

SRC = "docs/menu-source/raw/RAEC_master_menu.csv"
OUT = "lib/menu-builder/generated/custom-menu.ts"

def slug(s):
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s.lower())).strip('-')

def esc(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')

rows = list(csv.DictReader(open(SRC, newline='')))

# section -> subsection -> [items]   (preserve CSV order everywhere)
sections = OrderedDict()
for r in rows:
    sec = (r.get("section") or "").strip()
    if not sec:
        continue
    sub = (r.get("subsection") or "").strip()
    name = (r.get("name") or "").strip()
    if not name:
        continue
    trad = (r.get("traditional_name") or "").strip()
    desc = (r.get("description") or "").strip()
    price_raw = (r.get("price") or "").strip()
    price = None
    if price_raw:
        m = re.search(r'[0-9]+(?:\.[0-9]+)?', price_raw.replace(",", ""))
        price = float(m.group(0)) if m else None
        if price is not None and price == int(price):
            price = int(price)
    sections.setdefault(sec, OrderedDict()).setdefault(sub, []).append(
        {"name": name, "trad": trad, "desc": desc, "price": price}
    )

def item_ts(iid, it):
    parts = [f'id: "{iid}"', f'name: "{esc(it["name"])}"']
    if it["trad"]:
        parts.append(f'traditionalName: "{esc(it["trad"])}"')
    if it["desc"]:
        parts.append(f'description: "{esc(it["desc"])}"')
    parts.append(f'price: {it["price"] if it["price"] is not None else "null"}')
    return "{ " + ", ".join(parts) + " }"

out_sections = []
item_count = 0
for sec, subs in sections.items():
    sslug = slug(sec)
    idx = 0
    sub_ts = []
    for sublabel, items in subs.items():
        rows_ts = []
        for it in items:
            idx += 1
            item_count += 1
            rows_ts.append("          " + item_ts(f"{sslug}-{idx}", it))
        items_joined = ",\n".join(rows_ts)
        sub_ts.append(f'''      {{
        label: "{esc(sublabel)}",
        items: [
{items_joined},
        ],
      }}''')
    subs_joined = ",\n".join(sub_ts)
    out_sections.append(f'''  {{
    id: "{sslug}",
    label: "{esc(sec)}",
    subsections: [
{subs_joined},
    ],
  }}''')

header = '''// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/generated/custom-menu.ts
// ══════════════════════════════════════════════════════════════════
// GENERATED FILE — do not edit by hand.
// Source: docs/menu-source/raw/RAEC_master_menu.csv (the full à-la-carte master
// menu). Grouped by section, then subsection (label "" = a flat section).
// Prices are intentionally null for now — the client fills real values later.
// Regenerate via scripts/gen_custom_menu.py.
// ═══════════════════════════════════════════════════════════════════════════

import type { CustomMenuSection } from "../types";

export const CUSTOM_MENU_SECTIONS: CustomMenuSection[] = [
'''

os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, "w").write(header + ",\n".join(out_sections) + ",\n];\n")
print(f"Wrote {OUT}: {len(out_sections)} sections, {item_count} items")
