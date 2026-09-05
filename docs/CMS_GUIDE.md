# Raj Aangan CMS — what you can change and where

Everything the Menu Builder and the Blog show is editable at
**https://&lt;your-domain&gt;/studio** → **Menu Builder**. Sign in with the Sanity
account you were invited with. No code, no deploys: hit **Publish** and the
site picks the change up within about 30 seconds.

A quick rule that applies everywhere: **Slug** is the internal id. Set it once
when you create something and leave it alone — changing it later disconnects
the item from bookings guests have already started.

---

## 1. Set Menus

*The 7 fixed packages on the "Choose Your Menu" step (Breakfast, Lunch,
Maharani, Maharaja, Signature, Royal Feast, Elite).*

| Tab | What you control |
| --- | --- |
| **Menu** | Name, cover photo, description (the small print under the menu), which meal types it suits, sort order, and a **Show in the Menu Builder** switch to hide a package without deleting it |
| **Pricing** | **Price Per Person (₹)** — the package rate before GST; an optional price note; and **Add-on Price Per Extra Dish**, which overrides the global add-on price just for this menu |
| **Courses & Dishes** | Each course: its name, **Choose How Many** dishes are included, an optional note, and the list of dishes (name + optional second line) |

**How "Choose How Many" works:** if a course says 4, the guest's first four
picks are included in the package price. Anything beyond that is charged as an
add-on at the per-head add-on price. Set it to 0 to include everything.

To add a package: **+ Create** → fill the three tabs → **Publish**.

---

## 2. À-la-carte Menu

*The full master menu behind "Build a Custom Menu" — 55 sections, 1,128 dishes.*

Each document is one section (e.g. *The Soup Atelier*). Inside:

- **Groups** — optional sub-headings. Leave a group's name blank and its
  dishes render as a plain list.
- **Dishes** — for every dish: name, traditional name, description,
  **Price (₹ per plate)** and an **Available** switch.

**Prices:** these are the numbers the custom-menu quote adds up. A dish with no
price counts as ₹0, so the estimate stays honest until you fill them in.

**Order:** *Sort Order* keeps the menu in course order (drinks → starters →
mains → desserts). Lower numbers come first; the seeded values are spaced by 10
so you can slot a new section in between (e.g. 45).

Hiding things: switch **Show in the Menu Builder** off to hide a whole section,
or **Available** off to hide a single dish.

---

## 3. Cuisine Cards

*The picture cards on the Cuisine step (Drinks, Chaat, Thai, Indian Mains, …).*

Each card has a name, a photo, and — the important part — the list of
**À-la-carte Sections** it unlocks. Whatever a guest ticks here is exactly what
they see on the next step. A section can sit under more than one card.

The dish count printed on the card is counted automatically from the sections
you link, so there is nothing to keep in sync.

---

## 4. Presentation Options

Five lists, each edited the same way (name, photo, order, show/hide):

- **Cutlery** — base table cutlery tiles
- **Presentation Styles**
- **Stall Themes**
- **Live Counters** — the photo tiles
- **Live Counter Designs** — the pill list (no photo needed)

The **Extra Cost Per Head** field is there for later; it is not added to the
quote yet.

---

## 5. Outdoor Catering

- **Catalog Items** — bulk/delivery products: name, category, description,
  **price**, unit ("per box", "per kg", …) and photo.
- **Packaging Styles** — the packaging choices on the outdoor flow.

---

## 6. Venues & Occasions

- **Venues** — name, photo, indoor/outdoor, capacity, short descriptor, the
  pricing note guests read, and **Logistics Per Head (₹)**, which is added to
  the per-head rate for that venue.
- **Occasions** — the tiles on the first step.

---

## 7. Pricing & Quote Settings

One page (**Menu Builder → Pricing & Quote Settings**) with three tabs.

**Taxes & Charges**
- **GST (%)** — applied to every estimate.
- **Add-on Price Per Extra Dish (₹ per head)** — the default surcharge when a
  guest exceeds a course's "choose N". Any single set menu can override it.
- **Minimum Guests** — guidance shown on the client step; 0 = no minimum.

**Discounts**
- **Show the Discount Code Box** — turn the whole feature off if you don't want
  codes on the quote.
- **Discount Codes** — add as many as you like. Each has a code, **Percent
  Off**, an optional **Minimum Guests**, an optional **Expires On** date and an
  **Active** switch. Codes are case-insensitive for guests, and the discount
  comes off the subtotal *before* GST.
- **Message for an Invalid Code** — what a guest sees when a code doesn't apply.

**Quote Page**
- Heading and sub-heading.
- **Quote Valid For (days)** and **Booking Deposit (%)** — each prints a line on
  the quote; set to 0 to hide it.
- **Terms & Notes** — bullet points under the estimate (inclusions,
  exclusions, payment terms — anything you want in writing).
- **Contact Phone / Email** — printed under the terms.

---

## How the quote is calculated

```
Set menu:     per-person price
              + (extra dishes beyond "choose N" × add-on price)
Custom menu:  sum of the à-la-carte prices of the dishes chosen

              + venue logistics per head
              × guests × days
              − discount code, if one applies
              + GST
              = estimated total
```

Every number in that chain comes from Studio: the package price and its
courses, the à-la-carte prices, the venue's logistics figure, the add-on price,
the discount codes and the GST rate.

---

## 8. Blog

**Studio → Blog → Posts.** All five posts are already in here. Everything a
reader sees is editable, and there is nothing to install or deploy — edit,
press **Publish**, and the live site updates within about 30 seconds.

Open any post and you get two tabs, **Content** and **SEO**.

### Content tab

| Field | What it controls |
| --- | --- |
| **Title** | The headline — on the card in the blog list AND at the top of the post. |
| **Slug** | The web address: `raec.in/blog/<slug>`. **Leave this alone on existing posts** — changing it breaks any link already shared or indexed by Google. |
| **Cover Image** | One photo doing two jobs: the thumbnail on the blog list, and the large photo at the top of the post. Upload, then use the crop/hotspot tool to choose what stays visible. Landscape shots work best. |
| **Excerpt** | One or two lines under the title on the post's header. Currently empty on all five posts — filling it in is a nice touch and also feeds Google. Leave blank to show nothing. |
| **Published Date** | Shown as DD.MM.YYYY on the card and the post, **and** it sets the order of the blog list — newest first. To move a post to the top, give it a later date. |
| **Author** | Optional. Adds a name and photo under the title, plus a short bio at the foot. Create authors under Blog → Authors first. |
| **Category** | The small label above the title, e.g. "Weddings". |
| **Tags** | Pills at the very bottom of the post. Optional. |
| **Featured** | Not used by the design yet. Ignore it. |
| **Body** | The article itself — see below. |

### Writing the body

The Body field is a proper editor. Type normally; a blank line starts a new
paragraph. The style dropdown on the left of the toolbar gives you:

- **Normal** — body copy.
- **Heading 2** — a section heading (the big ones in the current posts).
- **Heading 3** — a smaller sub-heading under an H2.
- **Quote** — a pulled-out quote, italic with a gold rule down the left.

The toolbar also has **bullet** and **numbered** lists, **bold**, *italic*, and
a link button. Press **Shift+Enter** for a line break inside the same paragraph
(as opposed to Enter, which starts a new paragraph).

To drop a photo into the middle of an article, use the **+** at the end of the
editor and choose **Image**. Each one takes optional **Alt text** (describes the
photo for screen readers and Google) and a **Caption** (printed under it).

### SEO tab

All three are optional and fall back sensibly: **SEO Title** falls back to the
post title, **SEO Description** to the excerpt, **SEO / Social Image** to the
cover image. Worth filling in for posts you plan to share on WhatsApp or
Facebook, since that is the image and text those apps will show.

### Adding a new post

Blog → Posts → the **+** button. Fill in Title, Slug (Studio generates one from
the title — click *Generate*), Cover Image, Published Date and Body, then
**Publish**. It appears on `/blog` automatically; there is nothing else to do.

To take a post down, delete it — the list closes up on its own.

---

## Things to know

- **Publish is what counts.** Drafts are invisible to the site.
- **Changes appear in ~30 seconds.** If something looks stale, wait a moment
  and refresh.
- **Nothing can break the site.** If a field is empty — or Sanity is briefly
  unreachable — the builder falls back to the content it shipped with.
- **Photos:** every photo on this site that lives in Studio can be swapped
  here, and the change is live in ~30 seconds — no developer needed. The
  cuisine cards are designed for 293 × 299 px (anything roughly square works);
  blog covers look best landscape. Always use the crop/hotspot tool after
  uploading so the important part of the photo survives being cropped to
  different shapes.
- **Deleting vs hiding:** prefer the **Show in the Menu Builder** switch.
  Deleting a section that a cuisine card points at leaves that card short.
