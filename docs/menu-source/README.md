# Menu data — source of truth

> **Status (2026-07-25):** All 7 **set menus** are imported and live — 4 from
> the raw photos (Breakfast ₹450, Lunch ₹750, Maharani ₹1250, Maharaja ₹1750)
> and 3 from `set-menus.csv` (Signature/Royal/Elite, **prices are placeholders**).
> Generated to `lib/menu-builder/generated/set-menus.ts` via
> `scripts/gen_set_menus.py`. **Still needed:** (1) real per-person prices for
> Signature/Royal/Elite; (2) the add-on surcharge rule (currently a ₹100/head
> placeholder per extra dish); (3) a clean source for the **custom builder**
> master list — `RAEC FINAL MENU.pdf` does not OCR reliably (dish names and
> descriptions are split across columns), so a CSV like the one below is needed.

---


Put the menu data here as **CSV** (export from Google Sheets / Excel). Two files,
two shapes. A converter script will read these and generate the app's data now,
and the same files feed the Sanity import later — one source of truth, no retyping.

Drop raw source material (menu photos, the master PDF) in `docs/menu-source/raw/`
if you'd like it transcribed for you.

---

## File 1 — `set-menus.csv` (the fixed packages)

One row per **selectable dish** inside a section inside a package. Prices and
choose-counts repeat on every row of the same package/section (that's fine).

| column             | meaning                                             | example                     |
|--------------------|-----------------------------------------------------|-----------------------------|
| `menu`             | package name                                        | `Maharani Dinner Menu`      |
| `price_per_person` | ₹ per head for the package (number, no symbol)      | `1250`                      |
| `section`          | course / category shown as a header                 | `Snacks`                    |
| `choose_count`     | how many the guest picks from this section          | `4`                         |
| `dish`             | the selectable dish name                            | `French Fries`              |
| `dish_subtitle`    | optional small line under the dish (may be blank)   | `with mint chutney`         |

```csv
menu,price_per_person,section,choose_count,dish,dish_subtitle
Maharani Dinner Menu,1250,Snacks,4,French Fries,
Maharani Dinner Menu,1250,Snacks,4,Paneer Malai Tikka,
Maharani Dinner Menu,1250,Soups,1,Cream of Tomato,
Signature Dining Menu,1450,Starters,4,Placeholder Starter,
```

Covers all 7 packages: Breakfast, Lunch, Maharani, Maharaja, Signature Dining,
Royal Feast, Elite Experience.

---

## File 2 — `custom-dishes.csv` (the à-la-carte master list)

One row per **dish** available in the custom menu builder (from the master PDF).

| column     | meaning                                                        | example                       |
|------------|----------------------------------------------------------------|-------------------------------|
| `dish`     | dish name                                                      | `Royal Aloo Bukhara Elixir`   |
| `subtitle` | optional small line (may be blank)                             | `Aloo Bukhara / Plum Juice`   |
| `cuisine`  | which cuisine category it belongs to (drives the cuisine grid) | `Drinks`                      |
| `section`  | grouping header shown in the dish list                         | `Signature Welcome Elixirs`   |
| `price`    | ₹ per plate (number) — used for custom per-head pricing        | `499`                         |
| `dietary`  | pipe-separated tags: Veg / Jain / Satvik / Starter / Main / Dessert / Beverage | `Veg\|Beverage` |

```csv
dish,subtitle,cuisine,section,price,dietary
Royal Aloo Bukhara Elixir,Aloo Bukhara / Plum Juice,Drinks,Signature Welcome Elixirs,499,Veg|Beverage
Malai Paneer Tikka Royale,Paneer Starter,Tandoor,Welcome Snacks,499,Veg|Starter
```

---

## File 3 — `raw/RAEC Outdoor Catering.xlsx` (the outdoor / bulk catalog)

The client's own workbook, read as-is — **one worksheet per catalog section**
(Wedding Favour Boxes, Mix Sweet Boxes, Ladoo & Mithai, Corporate Meal Boxes,
Festive Snack Packets, Packed Breakfast Boxes, Live Food Vans, Premium Add-ons)
plus a `Catalogue Index` sheet that is skipped.

Each sheet is two columns, and the header row supplies the wording shown in the
UI:

| column A                                  | column B                              |
|-------------------------------------------|---------------------------------------|
| `Box Category` / `Packet Category` / `Collection` / `Van Category` | `Contents` / `Items` / `Menu / Offerings` / `Offerings` |
| `Classic Snack Packet`                    | `Aloo Bhujia, Salted Peanuts, Mini Mathri, Soan Papdi` |

Generated to `lib/menu-builder/generated/outdoor-catalog.ts` via
`python3 scripts/gen_outdoor_catalog.py` (8 sections, 77 boxes).

**The workbook carries no prices.** Price, unit, category and the one-line
description live in `SECTION_META` at the top of the generator — one placeholder
price per section, inherited by every box in it. To add a sheet, add its
`SECTION_META` entry first; the generator refuses to run on an unknown sheet
rather than silently dropping it.

---

## Notes

- Keep the column headers exactly as above (lowercase, underscores).
- `cuisine` values should be consistent — reused values become the category tiles.
- Blank optional cells are fine; don't delete the column.
- Don't worry about ids — the converter generates stable slugs from the names.
