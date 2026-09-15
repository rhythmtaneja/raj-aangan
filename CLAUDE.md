@AGENTS.md

# ⏱️ CURRENT STATE — Menu Builder + Phase 8 CMS (read this first)

Menu Builder rework is DONE, and **Phase 8 (Sanity CMS wiring) is DONE and
LIVE** — project `ze6ciec4` / dataset `production` is connected and **seeded
(120 docs + 31 image assets, 2026-07-28)**. Studio at `/studio` is fully
populated; the client can edit real content today. Everything still runs
identically with no Sanity project at all (graceful fallback preserved).

🚨 **All Phase 8 work is UNCOMMITTED** — 34 changed/untracked files, local only.
Last commit is `5086f31`. Push before anything else. See "Remaining work" below.

**Flow.** Step 1 picks a **catering type**: `venue-event` or `outdoor`
(`state.cateringType`). Progress bar is dynamic (`flow.ts/getSteps(state)`).
- **venue-event** (same for every venue — no raj-aangan branching):
  Client → Venue → **Menu** → Presentation → Quote (`STEPS_VENUE_EVENT`, 5 steps).
  - `/menu-builder/menu` (`SetMenuStep`) = the 7 fixed **set menus** for ALL
    venues. A CTA there ("Build a Custom Menu →") sets `menuMode:"custom"` and
    goes to **`/menu-builder/cuisine`** (cuisine cards) → then
    `/menu-builder/custom-menu` (`CustomMenuStep`, à-la-carte accordion).
  - In custom mode the bar becomes **6 steps** (`STEPS_VENUE_EVENT_CUSTOM`,
    Cuisine inserted before Menu; the Menu step's slug is `custom-menu`, so both
    menu screens resolve their index via `flow.ts/menuStepIndex`).
  - The cuisine picks (`state.selectedCuisineCategories`) FILTER the à-la-carte
    sections shown next; de-selecting a cuisine prunes its picked dishes.
  - `menuMode` ("set" | "custom") drives quote/summary display + pricing.
- **outdoor**: Client → Catalog → Packaging → Quote (`STEPS_OUTDOOR`).
  - `/menu-builder/catalog` is the SAME accordion as the menu steps: the 8
    catalog sections are collapsed headings, opening one lists the boxes inside
    it with their **contents** underneath and a `+ Add` that becomes a quantity
    stepper (bulk orders are still priced per box). Cart keys in
    `state.catalogSelections` are now **variant ids**; a bare section id still
    resolves, so older saved carts survive (`catalogSelectionMap` in
    menu-utils.ts).

**Menu DATA (all real, generated).**
- **7 set menus** → `lib/menu-builder/generated/set-menus.ts` (`SET_MENUS`), from
  `scripts/gen_set_menus.py` (image menus inline + `docs/menu-source/set-menus.csv`).
  Breakfast ₹450, Lunch ₹750, Maharani ₹1250, Maharaja ₹1750 (real);
  Signature ₹1450 / Royal Feast ₹2200 / Elite ₹2800 (**PLACEHOLDER prices**).
  UI = accordion (headings collapse; click to expand items) with add-to-cart
  toggles. **Soft "Choose N"**: first N picks (in order) included; extras are
  paid ADD-ONS (`ADDON_PRICE_PER_ITEM=100`/head **placeholder** in pricing.ts).
- **Custom à-la-carte** (1128 items, 55 sections) → `generated/custom-menu.ts`
  (`CUSTOM_MENU_SECTIONS`), from `scripts/gen_custom_menu.py` +
  `docs/menu-source/raw/RAEC_master_menu.csv`. Same accordion design, WITH price
  per item. Item `price` is **null for now** (client fills later); custom
  per-head = sum of selected item prices (`getCustomMenuPerHead`). Grouped by
  section → subsection (blank subsection = flat).
- **Outdoor catalog** (8 sections, 77 boxes/packets/vans) →
  `generated/outdoor-catalog.ts` (`OUTDOOR_CATALOG_ITEMS`, re-exported as
  `CATALOG_ITEMS`), from `scripts/gen_outdoor_catalog.py` +
  `docs/menu-source/raw/RAEC Outdoor Catering.xlsx` (one worksheet per section;
  stdlib-only xlsx reader, no openpyxl). **Prices are NOT in the workbook** —
  they're the old placeholders, one per section (`SECTION_META` in the script),
  inherited by every box (`variant.price === null`). Premium Add-ons is priced
  `null` / "on request": it stays on the quote and contributes ₹0.
- Outdoor packaging = still placeholder in `lib/menu-builder/data.ts`.
- Selections reuse `state.selectedDishes` (ADD_DISH/REMOVE_DISH), keyed by the
  master item id; set-menu picks use `state.setMenuSelections`.

**Regenerate data:** `python3 scripts/gen_set_menus.py` /
`python3 scripts/gen_custom_menu.py` / `python3 scripts/gen_outdoor_catalog.py`
(self-contained; read the CSVs / xlsx directly).

# 🗄️ Phase 8 — CMS (DONE + LIVE + SEEDED)

Everything the builder shows is now Sanity-managed, with the generated/static
data demoted to a fallback. **One rule: UI components never import the data —
they read `useCatalog()`.** Whether a value came from Sanity or the fallback is
decided in `queries.ts` alone.

- **Schemas** (`sanity/schemaTypes/`): `setMenu`, `customMenuSection`,
  `cuisineGroup`, `presentationOption` (5 kinds via a `kind` field),
  `outdoorCatalogItem`, `packagingStyle`, `pricingSettings` (**singleton**:
  GST, add-on price, discount codes, quote heading/terms/validity/deposit/
  contact). Legacy `dish`/`category`/`cuisine`/`presetMenu` are still
  registered but HIDDEN from the desk — nothing reads them.
- **Desk** (`sanity/structure.ts`): one "Menu Builder" folder, presentation
  options split into 5 filtered lists (each with a pre-filled + button, via
  templates in `sanity.config.ts`). `SINGLETONS` now exported from structure.ts.
- **Queries** (`queries.ts`): `getSetMenus`, `getCustomMenuSections`,
  `getCuisineCards(sections)`, `getPresentationCatalog`,
  `getOutdoorCatalogItems`, `getPackagingStyles`, `getPricingSettings` — each
  falls back per-collection (an empty Sanity list keeps the hardcoded one).
  `getCatalog()` fetches all of it in parallel for `app/menu-builder/layout.tsx`.
- **Context** (`catalog.tsx`): provides the catalog PLUS lookups (`getSetMenu`,
  `getCustomItem`, `getCatalogItem`, `getPackaging`, `getCuisineCard`,
  `sectionsForCuisines`, `itemIdsForCuisine`). `catalog-hooks.ts/usePricingData()`
  bundles what `pricing.ts` needs.
- **Pricing** (`pricing.ts`): no constants left — every fn takes
  `(state, data: PricingData)`. Adds real discount codes (`findDiscountCode`)
  applied pre-GST, and per-menu add-on overrides.
- **Shared helpers** (`menu-utils.ts`): counts / filtering used by both the
  fallback (`cuisine-groups.ts`) and the Sanity path.
- **Seed**: `npm run seed-menu-builder` (`scripts/seed-menu-builder.ts`) →
  120 docs (55 sections/1128 dishes, 7 set menus, 15 cuisine cards, 32
  presentation options, 6+4 outdoor, 1 settings) + uploads the `/public` photos
  as assets. Idempotent (deterministic `_id`s + `--replace`); array `_key`s ARE
  the existing app ids, so saved bookings survive. `--dry-run` / `--only=`.
  Runs plain TS through `scripts/ts-loader.mjs` (resolve hook that adds `.ts`
  and maps `@/`) — no new dependency.
  **✅ ALREADY RUN (2026-07-28)** — 120 docs + 31 image assets are in
  `production`. Verified: 7 setMenu / 55 customMenuSection / 15 cuisineGroup /
  32 presentationOption / 6 outdoorCatalogItem / 4 packagingStyle / 1
  pricingSettings. Needs the Sanity CLI logged in (`npx sanity login`), NOT the
  write token (it shells out to `sanity dataset import`).
  ⛔ **DO NOT re-run the whole seed** — it now overwrites the client's Studio
  edits. Use `--only=<type>` to refresh one collection, and say so first.
- **Client docs**: `docs/CMS_GUIDE.md` (field-by-field), `SANITY_SETUP.md` §3.

# 📱 PHONE PASS (2026-09-13)

First round of client phone feedback (`../phone-changes/*.jpeg`). All five are
phone-only unless noted:

1. **Hamburger drawer** — see item 7 under "Remaining work" below.
2. **Glass pill borders thinned** (desktop too, as asked): `border` →
   `border-[0.5px] border-white/55`, and the `inset 0 1px 0` white highlight
   dropped 0.78 → 0.26. Those two lines together read as one ~2px ring; the
   border alone was never the problem. Four call sites: VenueHero,
   VenuePropertiesSection, CollaborationSection, GalleryHero.
3. **Collage cards** (VenueDetailsCollage + EntertainmentCollage) — the 3-column
   stagger collapses to ONE centred column at 78vw on phones, one card per row,
   so they arrive one at a time through the same pinned scroll. Card geometry is
   computed inline, so this is one of the few splits that CANNOT be a media
   query: both files gained a `stripLayout(cards, isPhone)` resolver fed by
   `components/anim/useIsPhone.ts`. `useGSAP` there MUST keep
   `revertOnUpdate: true` or crossing the breakpoint double-pins the section.
   `rowCount` is now derived from the data (it was hardcoded to 7 in
   EntertainmentCollage, which has 6 rows — that bought a blank viewport of
   scroll after the last card).
4. **CircleButton does nothing on touch.** `enter()`/`move()` bail when
   `isPhoneViewport()`. Touch browsers fire a phantom mouseenter before click
   and never the matching mouseleave, so tapping a CTA used to strand the ball
   on top of it. `leave()` is deliberately still live so a resize self-heals.
   ⚠️ While fixing this, `killPending()` was scoped to the properties
   CircleButton actually animates. It used to `killTweensOf(root)` wholesale —
   and on the homepage the root IS `.hero-cta`, whose entrance Hero.tsx owns, so
   hovering during the entrance killed it and left the button invisible forever.
   Keep that property list in step with enter/leave.
5. **Arrival animations sped up** (universal, desktop included): `DUR.reveal`
   0.9 → 0.62, and IntroSection's whole block roughly a third faster. The real
   complaint was the CTA, which is positioned relative to the END of the
   timeline — so it was the 6s tilt, not the button's own timing, that made it
   arrive 5.45s in. Tilt is now 2.2s and the button lands ~1.9s.

`components/anim/anim.config.ts` now exports `PHONE_MAX_WIDTH` /
`isPhoneViewport()` — the ONE JS phone boundary. Do not introduce a second one.

## Phone pass, round 2 (2026-09-13)

6. **Hero typography now matches the reference's phone measure.** New
   phone-only classes in the globals.css override block: `.hero-display`
   (20rem cap), `.hero-tagline` (1.375rem + 19rem cap) and `.hero-stack`
   (pt-65 → 8rem). Both text classes set `text-wrap: balance`, which is what
   actually produces the reference look — the heroes were always
   `items-center text-center`, the problem was the SHAPE of the wrapped lines.
   Applied to About / Catering / Contact / Blog / Venue / Gallery heroes.
   ⚠️ **Never hide a hero `<br>` with `display: none`.** The copy is rendered
   as per-word spans with no whitespace between the two halves, so the words
   either side fuse ("resort forweddings"). Author it as
   `{" "}<br className="hidden md:inline" />` — Hero.tsx's existing pattern.
7. **Round logo, homepage only.** `SiteHeader` takes `hideCenterLogoOnPhone`;
   Hero.tsx renders its own copy above the RAEC wordmark on phones and shifts
   the lockup's `top` up by 4.25rem so the wordmark stays put and still clears
   the headline. `md:hidden` and the header's `hidden md:block` are exact
   complements — exactly one round logo exists at any width. Other pages keep
   it in the header (no wordmark to sit above, and it is the "go home" target).
8. **Homepage AboutSection.** Gold heading is one line on phones via
   `text-[min(6.6vw,2rem)] whitespace-nowrap` — the coefficient is tuned to
   that exact string (fits down to a 299px viewport); re-measure if the copy
   changes. Heading→photo gap was 0px against 48px between the photos; a
   `mt-12` on the phone wrapper makes all three equal.
9. **The "white line above photos" was real.** A ~1px light hairline on each
   photo's top AND bottom edge, appearing only at certain fractional scroll
   offsets — an `overflow-hidden` clip antialiasing against what is behind it.
   Proven by sampling the client's screenshot: background rows 234, photo 80,
   the row between them 240 (brighter than either, so not a blend). Fixed with
   a 1px image bleed (`PHOTO_BLEED`), verified gone by re-sampling a local
   screenshot at the same fractional offset.
10. **Menu-builder padding.** `client` and `quote` were the last two steps
    still on `p-8 md:p-10`; everything else already used `p-5 md:p-10`. Also
    the Step-1 card grids: `gap-10`/`gap-12` are desktop values (the cards are
    a fixed 15.25rem there), but on a phone the gap comes straight out of the
    card width — now `gap-x-3 gap-y-5 md:gap-*`.

## Footer rebuild (2026-09-14)

Rebuilt against the reference footer, which is **two panels with a wave at the
seam** — not one panel with a wave on top:

    ┌─ DARK PANEL ──────────┐  FOOTER_BG       #12414E
    │ pills · columns · social
    ├─ WAVE ────────────────┤  WaveDivider, in flow
    ├─ CLOSING PANEL ───────┤  FOOTER_OUTRO_BG #1C5D6B
    │ CTA · legal row · credit
    └───────────────────────┘

Measured on resortkaskady.com: dark `#194141`, wave, `#296161`. Ours keeps the
site's own ~196° navy-teal rather than their greener teal, both lifted from the
old single `#0f2f3b` (client asked for lighter). **What matters is the step
between the two** — the wave has nothing to divide without it.

- **`WaveTop.tsx` is gone; `WaveDivider.tsx` replaces it.** WaveTop was
  `position: sticky; top: 0` + a scrubbed reveal. On desktop the footer is
  ~one viewport so it pinned and released and looked right; on a phone the
  same content stacks ~3 viewports tall, so it pinned to the top of the SCREEN
  and hung there across the middle of the copy (the band over "More about
  events" in phone-changes/footer.jpeg). A sticky element cannot be the
  boundary between two panels when the panel above it is taller than the
  viewport. The new one is an ordinary block at the seam and keeps the layered
  `gsap.ticker` sine paths. `topColor`/`bottomColor` MUST match the adjacent
  panels or a hairline of the wrong colour shows.
- **No wave above the footer any more.** The page now meets the dark panel
  with a hard edge, which is what the reference does. `overflow-hidden` on the
  footer is safe again (the old warning is obsolete).
- **Phone layout**: one centred column, brand block first, roman numerals
  hidden (a wide-layout ornament — in one centred column they just push the
  labels off-centre), social icons centred instead of right-aligned.
- **Content**: link list is now Weddings / Events / Catering / Venue / Gallery
  / About Us / Investor Relations. Socials are Instagram / Facebook / WhatsApp
  (YouTube dropped). Legal row + copyright match
  phone-changes/terms-social accounts.jpeg. Credit links to the LinkedIn in
  `SITE_CREDIT`.
- **`lib/site-info.ts`** gained `SITE_SOCIALS`, `SITE_LEGAL`, `SITE_CREDIT`.

### Laptop pin restored (2026-09-14)

The in-flow rebuild above dropped the desktop motion the client had signed off:
the dark panel holds still once it covers the screen while the wave + closing
panel ride up over it. It is back, as a **computed sticky offset** on the dark
panel (`darkRef` effect in FooterSection):

    top = -(panelHeight - viewportHeight)     // -155px at 1440x819

so it pins the instant its last row reaches the bottom of the screen. Verified:
`darkTop` freezes at -155 from 155px into the footer while `riderTop` keeps
climbing 819 → 382.

⚠️ **`position: sticky; bottom: 0` is NOT the primitive for this** — tried it,
measured it failing with a probe element on the live page. Sticky-bottom pulls
an element UP into view *early* and releases once you scroll past; only
sticky-TOP holds. Don't "simplify" the effect back to a CSS class.

Phone opts out via `md:sticky` (static below 768px) and the effect clears the
inline `top` there — the panel is ~3 viewports tall on a phone, so a pin would
park most of it off-screen.

Also: the footer's round logo is now `absolute left-1/2 -translate-x-1/2`.
`justify-between` equalises GAPS, so unequal pill widths (136 vs 156) pushed it
~10px off-centre, and since the pill labels are `clamp(…,vw,…)` that offset
drifted with zoom.

📌 **Worth knowing:** the reference site does NOT pin anything — measured, its
footer moves exactly −300px per +300px of scroll. The pin is our own flourish,
kept because the client asked for it specifically. Our panel proportions do
match the reference closely (dark 974 / wave 100 / outro 437 vs their
1032 / 123 / 328).

🚨 **Placeholders that must be filled before launch** (all render as live links):
  - `SITE_SOCIALS` Instagram + Facebook hrefs are `"#"`. WhatsApp is real —
    derived from `SITE_PHONE`.
  - `SITE_LEGAL` Privacy + Terms are `"#"`; `app/privacy/` and `app/terms/`
    do not exist.
  - "Investor Relations" has no page; it points at `/contact`.

✅ **`sm:` is GONE (2026-09-15).** It used to appear in ~13 places —
menu-builder grids, PackagesOverviewSection, WeddingPackagesSection,
EventsHero, ExpertiseSection, SetMenuStep — and 640px fires INSIDE the
browser-zoom range, so the page reflowed at ~175% zoom in violation of the
md:-only rule. All of it is now `md:`, except PackagesOverviewSection, whose
`sm:grid-cols-2` was simply DROPPED (it sat alongside an `md:grid-cols-3/4`,
and two `md:grid-cols-*` on one element is undefined). Net effect: 640-767px
now renders the phone layout, which is what the rule says it should.
`grep -rn '\bsm:' app components lib` must stay empty.

**Responsiveness (done this cycle):** all `clamp(min,Xvw,max)` font ceilings
were **capped to their 1440px value** (`scripts/*` one-off; the vw coeff stays,
only the ceiling dropped) so laptops ≥1440px render identically and the client's
wider screens no longer diverge from the ~1440 Mac. Mobile fixes: BuilderLayout
sidebar stacks below content (no inline grid override; two-col only lg+),
ProgressBar has a compact "Step X of N" bar on mobile, card padding p-5 md:p-10,
SiteHeader nav wraps on phones.

## Booking page + phone nav pass (2026-09-15)

**`/booking` is new** — the destination of every "Booking" pill on the site
(SiteHeader phone AND desktop, BuilderLayout, FooterSection). Hero photograph
→ a CTA → the guest's saved quotations.

- **`lib/menu-builder/booking-history.ts`** is the store: `SavedBooking[]` in
  `localStorage`, plus `useBookingHistory()`. Each entry holds the whole
  `QuoteDoc`, so a saved booking renders exactly the quote the guest saw and
  cannot be rewritten by a later price change.
- **One entry per WIZARD RUN, not per visit to /quote.** The run's id lives in
  `raec-active-booking-id` and is cleared only by Start Over, so editing guest
  count on the Quote screen updates the entry instead of duplicating it.
  `clearActiveBookingId()` in `startOver()` is load-bearing — drop it and the
  history holds exactly one booking forever.
- **The save is automatic.** Reaching /quote IS "completed all the steps", so
  `useAutoSaveBooking` upserts there, guarded on an actual menu / cart so a
  deep-linked empty wizard writes nothing. "Save Booking" re-saves by hand.
- **Empty history renders NOTHING** (the section returns null) and the hero's
  CTA becomes "Start Your Booking" → the wizard. That is the client's literal
  requirement and also the only SSR-safe shape: localStorage is unreadable on
  the server, so the first client render must match "nothing yet".
- ⚠️ Still localStorage. See §D.14 — this is not lead capture.

**Menu Builder moved into the phone drawer.** `MOBILE_NAV_LINKS` in
SiteHeader splices a "Menu Builder" entry into NAV_LINKS after EVENTS, for the
drawer only — NAV_LINKS also feeds the desktop inline row, which already has
its own Menu Builder pill and cannot take a ninth word without wrapping.

**The header's phone centre logo is an in-flow flex child now**, not
`absolute left-1/2 top-1/2`. Absolute centring put it on the SCREEN's centre
while the two pills are different widths ("Menu" vs "Booking"), so the gaps
either side were visibly unequal, and `top-1/2` of the row's padding box sits
2px above the pills' own centre line. Three items in a `justify-between` row
have equal gaps by construction. `md:absolute` restores the signed-off desktop
pinning exactly. Size 2.05rem → 2.75rem — **keep MobileNavDrawer's panel logo
in sync** or the mark jumps as the drawer slides over the header.

**Investors page typography.** The hero eyebrow ("INVESTOR RELATIONS") is full
white / semibold with a text-shadow — at 70% white over a photo it was
invisible. All the step numbers now share `NUMERAL_STEP` in
`components/sections/investors/theme.ts` (Strategy, Why, Business); the
Roadmap's worded "Phase 01" keeps its own size and takes `lining-nums` only.
🔑 **`lining-nums` is the fix, not the font-size.** Cormorant Garamond ships
OLD-STYLE figures, so "01" renders at x-height and reads as tiny however large
you set it. `uppercase` does nothing to digits. Anywhere a numeral looks small
on this site, check for lining figures first.

## 📱 THE BREAKPOINT MOVED: 768px → 1024px (2026-09-16)

**iPads now get the PHONE design.** The client reported the site "looking
different" on iPad; measured, iPad portrait was being handed the DESKTOP
design at a 9px root font:

    viewport   root     nav link   header pill   form field
    768px      8.53px   6.9px      28px tall     —
    820px      9.11px   7.4px      30px tall     25px tall, 8px text
    1024px     11.38px  9.2px      37px tall     —
    1440px     16px     13px       52px tall     44px tall

Nothing was broken — it was a mathematically perfect 57% scale of a design
meant for a mouse. But an iPad is a TOUCH device and Apple's minimum tap
target is 44px, so it was unusable in practice. This is precisely the
trade-off globals.css always named ("a genuinely narrow DESKTOP window renders
at a 10px root"); an iPad is that case and cannot resize out of it.

**Three literals moved together** (a media query cannot read a CSS variable,
so the number is written out three times — keep them in sync):

  1. `--breakpoint-md: 1024px` in the new `@theme` block at the top of
     globals.css. This moves EVERY `md:` in the app at once.
  2. The root font-size floor, `clamp(8.5333px, …)` → `clamp(11.3778px, …)`.
     **The floor MUST equal `breakpoint / 90`** or the layout enters the state
     where rem freezes while vw/vh keep shrinking — the "design came apart"
     failure. 1024/90 = 11.3778.
  3. Both `@media (max-width: 767px)` blocks in globals.css → `1023px`, and
     `PHONE_MAX_WIDTH` in `components/anim/anim.config.ts` → `1023`.

Also moved, because they are the same boundary expressed in JS:
ServicesSection's `matchMedia("(min-width: 768px)")` hover gate, and
FooterSection's `innerWidth < 768` sticky-pin opt-out. `useIsPhone` derives
from `PHONE_MAX_WIDTH` and needed no edit.

**sm/lg/xl/2xl are now `initial`** — deleted from the theme, not merely
unused. A stray `lg:` now generates NO CSS instead of silently reflowing the
page at 125% zoom. The built stylesheet contains exactly one media query:
`@media (min-width:1024px)`. That is the invariant to check after any Tailwind
change: `grep -rho "@media (min-width:[^)]*)" .next/static/chunks/*.css | sort -u`.

**COST:** a desktop window 768–1023px wide gets the phone design, and browser
zoom crosses into the phone design at ~140% instead of ~190%. The desktop
composition is still pixel-identical from 1024px to 1800px.

**TEXT MEASURES ARE `min(rem, vw)` NOW.** The phone band runs to 1023px, so a
cap tuned for a 390px phone rendered as a 320px ribbon down the middle of an
820px iPad. The fix is one continuous expression, NOT a second media query:

    max-width: min(34rem, 82vw)     /* 82vw @390px == 20rem, to the pixel */

The vw term reproduces the signed-off phone value exactly at 390px; the rem
term is the tablet ceiling. Applied to `.hero-display` / `.hero-tagline` in
globals.css and to Hero, InvestorHero, SectionHeading and
BookingHistorySection. Equivalences: 19rem≡78vw, 20rem≡82vw, 21rem≡86vw,
22rem≡90vw (all at 390px).

# 📐 ZOOM-PROOF LAYOUT — THE ONE RULE (2026-08-03)

> ⚠️ **Numbers updated 2026-09-16** — the breakpoint and floor moved from
> 768px/8.5333px to 1024px/11.3778px. See the section directly above. The
> RULE below is unchanged and still governs; only the two constants differ.

The desktop design is a **single-scalar uniform scale**. `globals.css` sets
`html { font-size: clamp(11.3778px, 100vw/90, 20px) }` — 16px at the 1440px
reference — and EVERY length in the app is a `rem` multiple of it. Between
**1024px and 1800px the page is a pure proportional scale of itself**: nothing
can drift, no line-wrap point can flip. Browser zoom divides the CSS viewport
(a 1440 window reports 1152 @125%, 960 @150%, 823 @175%, 720 @200%), so this
gives an identical composition from 100% through ~187% zoom, and 200% lands
below 768px → the phone design. Verified: 0 of 451 elements on `/` shift
position by >0.6% of viewport width across that whole range.

**Three rules follow. Breaking any one re-breaks zoom:**
1. **Never size anything in px.** Not `style={{width: 320}}`, not `<svg
   width="24">` without a rem class, not `width={110}` on `next/image`
   without a rem className. A px value freezes while everything around it
   shrinks — it silently doubles in relative size across the zoom range.
   1px hairlines/borders are the ONLY exception (they scale under real zoom).
2. **Desktop layout switches on `md:` (now 1024px) ONLY.** `sm:`/`lg:`/`xl:`/
   `2xl:` no longer exist — they are set to `initial` in the `@theme` block,
   so using one generates no CSS at all. Media-query breakpoints resolve
   against the browser's initial 16px, not the fluid root, so any second
   breakpoint would fire *inside* the zoom range and reflow the page.
3. **Marquee/carousel loop distances must be MEASURED from the DOM and
   rebuilt in a `ResizeObserver`**, never computed from constants and never
   via a lazy `x: () => -measure()` (a function-based value is resolved on
   the tween's first rendered frame — if that lands before layout settles it
   caches 0 and the marquee animates 0→0 forever). Pattern: eager `build()`
   + `new ResizeObserver(build)`. See CuisineSection / EventsHero /
   DecorStylingCarousel. For a `gap`-only track the advance is
   `(scrollWidth + gap)/2`; with `paddingLeft: gap` it is `scrollWidth/2`.

The `clamp(min, Xvw, max)` font sizes are CORRECT and must stay: inside the
band the vw term equals the rem ceiling, so they resolve proportionally; below
768px the root reverts to a fixed 16px and the clamp's `min`/vw term becomes
the phone sizing. Don't "simplify" them to plain rem — that breaks mobile.

TRADE-OFF: a genuinely narrow *desktop window* (~768–1000px at 100% zoom) now
renders the full desktop design at a 8.5–11px root, i.e. small text. Under
zoom the physical size is unchanged, so this only affects deliberately narrow
windows. Raise the clamp MIN in `globals.css` if that ever matters more.

# ✅ REMAINING WORK (as of 2026-07-28)

## A. Ours — blocking, do in this order
1. **Commit + push the 34 uncommitted files.** The entire Phase 8 CMS (all
   `sanity/schemaTypes/*`, `scripts/seed-menu-builder.ts`, `scripts/ts-loader*`,
   `lib/menu-builder/{queries,catalog,catalog-hooks,menu-utils,pricing}`,
   `docs/CMS_GUIDE.md`) is local-only. Suggested split: schemas / queries+context
   / seed script / docs. `npx tsc --noEmit` is green.
2. **Deploy on Vercel.** Root directory MUST be `raj-aangan/` (Next app is a
   subdir). Env vars needed: `NEXT_PUBLIC_SANITY_PROJECT_ID=ze6ciec4`,
   `NEXT_PUBLIC_SANITY_DATASET=production`, `SANITY_REVALIDATE_SECRET=<random>`.
3. **Publish webhook** (SANITY_SETUP.md §4). Code already exists at
   `app/api/revalidate/route.ts`; what's missing is `SANITY_REVALIDATE_SECRET`
   (empty in `.env.local`) + registering the hook on sanity.io/manage.
   Without it, Studio edits take up to **30s** to appear (`REVALIDATE = 30` in
   `queries.ts`, `useCdn: true` in `client.ts`). Only works once deployed —
   Sanity cannot call `localhost`.
   ⚠️ Do NOT let the client start entering prices before this exists; they'll
   hit the 30s delay and think the CMS is broken.
4. **Decide `/studio` vs `/admin`.** Studio is a normal route
   (`app/studio/[[...tool]]/page.tsx`) that ships with the site — no separate
   deploy, lands at `<domain>/studio`. To truly move it: rename the folder AND
   change `basePath` in `sanity.config.ts:25`. Both must match. A plain
   `next.config.ts` redirect works too but the URL bar still shows `/studio`.

## B. Ours — code work, not data entry
5. **Presentation step per-live-counter mapping** (which counter → which
   cutlery / presentation / stall options). Selecting any counter currently
   reveals ALL options — TODO in `app/menu-builder/presentation/page.tsx`.
   Not in the CMS at all yet; needs schema work.
6. **Outdoor catalog → CMS (agreed next step, 2026-08-12).** The catalog step
   now runs off `generated/outdoor-catalog.ts`; the `outdoorCatalogItem` schema
   has no `variants` / `variantLabel` / `contentsLabel` fields yet, so
   `getOutdoorCatalogItems()` deliberately **ignores Sanity until at least one
   doc carries variants** (the 6 seeded docs are stale placeholders). To finish:
   add the fields to the schema, extend `outdoorDocs()` in the seed script
   (also make `price` nullable there — Premium Add-ons is "on request"), then
   `npm run seed-menu-builder -- --only=outdoorCatalogItem`. Sanity then wins
   automatically, no app change.
- ~~Mobile: header nav WRAPS; hamburger drawer?~~ — DONE 2026-09-13. The seven
   nav links moved into `components/ui/MobileNavDrawer.tsx`, opened by the
   header's left pill on phones only. **The two header pills now mean
   different things per breakpoint** (SiteHeader.tsx documents the split):
   desktop left = "Menu Builder" → `/menu-builder`, right = "Booking" →
   `/booking`, inline nav row unchanged; phone left = "Menu" → drawer, right =
   "Booking" → `/booking`, inline nav row hidden. **Superseded in part by the
   Booking page pass below** — the phone Booking pill used to go to
   `/menu-builder`, and the desktop Booking pill used to be an inert
   `<button>`.
- ~~Responsiveness calibration~~ — DONE 2026-08-03, see "ZOOM-PROOF LAYOUT"
   above. Reference width 1440 confirmed; the fluid-root floor was moved from
   12px (which bit at 1080px, mid-zoom-range) down to 768/90, all lg:/xl:
   desktop variants moved to md:, and every fixed-px element (header + footer
   logos, 26 inline SVG icons, ProgressBar step circles, Cuisine/Decor carousel
   cards, the nav hover indicator) converted to rem.

## C. Client's — data entry in Studio, no code change
8. Real per-person prices for Signature (₹1450) / Royal Feast (₹2200) /
   Elite (₹2800) — all PLACEHOLDERS → Set Menus → Pricing.
9. Real add-on surcharge (₹100/head placeholder) → Pricing & Quote Settings,
   or the per-menu override.
10. Prices for the 1128 à-la-carte items, currently all null → À-la-carte Menu.
    (Alternative: refill the `price` column in `RAEC_master_menu.csv`,
    regenerate, then re-seed with `--only=customMenuSection`.)
11. Photo for the "Salads & Wellness Bowls" cuisine card (uses
    `mb-placeholder.jpg`) → Cuisine Cards.

## D. Handover — must not be forgotten
12. **Transfer the Sanity project to the client's account** (or invite their
    team as Editor at sanity.io/manage → Members). It currently sits under
    `rhythm1501taneja@gmail.com` — if the engagement ends they lose their CMS.
13. Point the client at `docs/CMS_GUIDE.md` (field-by-field walkthrough).
14. 🚨 **Bookings are saved NOWHERE *RAEC CAN SEE*.** A finished quote is now
    written to the guest's own Booking History, but that is still
    `localStorage` (see the Booking page notes above) — this browser only, no
    server record, no email, no lead capture. /booking makes the gap LESS
    visible to the guest and no smaller for the client, so it must still be
    flagged IN WRITING before handover. Workstream 4 (CRM) is the fix;
    `upsertBooking()` in `lib/menu-builder/booking-history.ts` is the single
    place to also POST.

# 📌 Live CMS facts
- Sanity project `ze6ciec4`, dataset `production` (public read).
- Studio: `/studio` locally and on any deploy. Desk = `sanity/structure.ts`.
- Sanity IS the database — nothing else to provision. No Postgres, no separate
  host. Free tier (~100k API req/month) is plenty for this site.
- `.env.local` has the project id/dataset set; `SANITY_API_READ_TOKEN`,
  `SANITY_API_WRITE_TOKEN` and `SANITY_REVALIDATE_SECRET` are all still EMPTY.
  Read/write tokens aren't needed yet (dataset is public; seed uses CLI auth).

Reference designs: `docs/reference/screens/`. Data sources: `docs/menu-source/`.

# Raj Aangan — project guide

Next.js 16 (App Router) + TypeScript + Tailwind v4 + GSAP, deployed on Vercel
(repo `rhythmtaneja/raj-aangan`). The public marketing site is complete. The
current phase adds a **Sanity CMS admin platform** for the client's team plus a
CRM integration, all landing in one embedded Sanity Studio at `/studio`.

> **Important:** the Next.js app lives in this `raj-aangan/` subdirectory — that
> subdir is the git repo root. Run all `npm`/`next`/`sanity` commands from here.

## Golden rule: graceful fallback

Everything is built to **build and run with or without a live Sanity project**.
When `NEXT_PUBLIC_SANITY_PROJECT_ID` is unset, `sanity/env.ts` exports
`isSanityConfigured = false` and every query returns hardcoded fallback data, so
the site never breaks during migration. Do not add code paths that throw when
Sanity is absent — always coalesce to a fallback.

## Architecture map

### Sanity foundation (`sanity/`)
- `env.ts` — connection values from env; `isSanityConfigured`, `studioProjectId`
  (a valid placeholder when unset so clients/builders never throw at module load).
- `client.ts` — server-only read client. Never import into a `"use client"` file.
- `image.ts` — `urlFor()` / `imageUrl()` CDN helpers (returns fallback on miss).
- `schemaTypes/` — Menu Builder (Phase 8): `setMenu`, `customMenuSection`,
  `cuisineGroup`, `presentationOption`, `outdoorCatalogItem`, `packagingStyle`,
  `pricingSettings` (singleton), plus `venue`, `occasion`. Legacy WS1 types
  (`dish`, `category`, `cuisine`, `presetMenu`) stay registered but hidden.
  `siteImages` singleton (WS2); `blogPost`, `author` (WS3).
- `structure.ts` — desk (Menu Builder folder first) + exported `SINGLETONS`
  (`siteImages`, `pricingSettings`).
- `sanity.config.ts` / `sanity.cli.ts` — Studio + CLI config (root of repo).

### Studio route (`app/studio/[[...tool]]/`)
- `page.tsx` (server) guards on `isSanityConfigured`, else renders a setup notice.
- `Studio.tsx` (**client**) holds the `sanity.config` + `NextStudio` import.
  **Critical:** the config must only be imported from a client component —
  importing it into an RSC pulls Sanity's `swr` dependency into the server graph,
  whose `react-server` build has no default export, and the build fails.

### Menu Builder — `lib/menu-builder/` + `app/menu-builder/` (see CURRENT STATE above)
- `types.ts` — all domain types + `BookingState` + step-sets (`STEPS_VENUE_EVENT`,
  `STEPS_OUTDOOR`) + `MB_COLORS` + `CATERING_TYPES`. `menuMode` field lives here.
- `context.tsx` — `useBooking()` reducer (SET_FIELD, ADD_DISH/REMOVE_DISH,
  SET_SET_MENU, TOGGLE_SET_MENU_DISH [soft cap, no block], presentation actions,
  outdoor actions, RESET_WIZARD). Persists to localStorage.
- `queries.ts` — **the only Sanity door.** Per-collection fetch + fallback;
  `getCatalog()` runs them in parallel for the wizard layout.
- `catalog.tsx` — `useCatalog()`: the fetched catalog + lookups. UI reads this,
  never the raw data. `catalog-hooks.ts` — `usePricingData()`.
- `pricing.ts` — settings-driven math: `(state, PricingData)` everywhere, GST +
  discount codes (`findDiscountCode`, pre-GST) + per-menu add-on override.
- FALLBACK data (only used when Sanity is unset/empty/unreachable):
  `data.ts` (outdoor + packaging), `generated/set-menus.ts`,
  `generated/custom-menu.ts` (GENERATED — see scripts), `cuisine-groups.ts`
  (the card → section mapping, all 55 sections mapped exactly once),
  `config.ts` (presentation options + `DEFAULT_PRICING_SETTINGS`),
  `fallback.ts` (venues/occasions + legacy WS1 arrays).
- `menu-utils.ts` — pure helpers shared by the fallback and the Sanity path
  (`withCuisineCounts`, `sectionsForCuisines`, `itemIdsForCuisine`, maps).
- `flow.ts` — `getSteps(state)` (6 steps in custom mode), `stepIndexOf`,
  `menuStepIndex`, `venueKindOf` (pricing labels only).
- Shared components (`components/menu-builder/`): `BuilderLayout` (shell + nav +
  sidebar, responsive), `ProgressBar` (dynamic, mobile-compact), `NavFooter`,
  `BookingSummary` (3 variants), `SetMenuStep`, `CustomMenuStep`.
- Routes (`app/menu-builder/`): `client`, `venue`, `menu`, `cuisine`,
  `custom-menu`, `presentation`, `catalog`, `packaging`, `quote`
  (+ `layout.tsx` fetches the whole catalog once, `loading.tsx` skeleton). Each
  page guards its prerequisites and redirects to Step 1 / Venue / Cuisine if
  deep-linked.

### Blog (WS3) — `lib/blog/` + `app/blog/`
- `queries.ts` — `getAllBlogPosts`, `getBlogSlugs`, `getBlogPostBySlug` (fallback
  = the original placeholder cards).
- `app/blog/page.tsx` — server-fetched grid, layout unchanged.
- `app/blog/[slug]/page.tsx` — SSG (`generateStaticParams`) + `generateMetadata`
  (async `params`), luxury-styled post page.
- `components/blog/PortableTextRenderer.tsx` — Cormorant h2/h3, blockquotes,
  inline captioned images, links.
- `app/blog/rss.xml/route.ts` — RSS 2.0 feed.

### Site Photos (WS2) — `lib/site-images/`
- `queries.ts` — `getSiteImages()` resolves the `siteImages` singleton to URLs
  (nulls / empty arrays when unset → consumers use their `/public` fallbacks).
- Wired so far: every page hero + video poster + gallery grids. Consumers take an
  optional `bgImage?`/`poster?` prop and coalesce `?? FALLBACK_CONST`.

### CRM (WS4) — DEFERRED
Not started (per client's "4th task later"). Env placeholders are in
`.env.local.example`. Booking schema, `/api/booking/submit`, Cronberry adapter
stub, and Step-5 wiring remain.

## Next.js 16 gotchas (this repo)
- `params` in pages/layouts/routes is **async** — always `await props.params`.
- `revalidateTag(tag, profile)` requires the **second arg** (we use `"max"`).
- Turbopack is default; `next.config.ts` whitelists `cdn.sanity.io` remote images.
- Read `node_modules/next/dist/docs/` before using unfamiliar APIs (per AGENTS.md).

## Common commands
```bash
npm run dev            # site :3000, Studio :3000
npm run build          # production build (SANITY_TELEMETRY_DISABLED=1 to quiet)
npx tsc --noEmit       # typecheck
npm run seed-menu-builder                      # push menu data + photos to Sanity
npm run seed-menu-builder -- --dry-run         # ...write the NDJSON only
npm run import-menu -- ./data/menu-data.json   # legacy (pre-rework types)
```

## Setup & activation
See `SANITY_SETUP.md` for the three-command Sanity connect (login → init → dev),
the publish webhook, Vercel env vars, client access, and the menu import flow.

## Known environment issue
`npm install` here can fail with `ENOTEMPTY` on npm's rename step. Fix: remove
stale staging dirs first —
`find node_modules -maxdepth 2 -type d -name '.*-*' ! -name '.bin' ! -name '.cache' ! -name '.package-lock*' -prune -exec rm -rf {} +`
— then reinstall.
