# Generates lib/menu-builder/generated/set-menus.ts from:
#  - IMAGE_MENUS (transcribed from raw menu photos, below)
#  - csv_menus.json (parsed from set-menus.csv: Signature/Royal/Elite)
import json, re, os
import csv as _csv
def _load_csv_menus():
    SRC="docs/menu-source/set-menus.csv"
    M={1:"Signature Dining Menu",2:"Royal Feast",3:"Elite Experience"}
    HDR=re.compile(r'(?:choose\s*any|choice\s*of)\s*(\d+)',re.I)
    def sp(cell):
        cell=cell.strip(); m=re.match(r'^(.*)\(([^()]*)\)\s*$',cell)
        return (m.group(1).strip(),m.group(2).strip()) if m else (cell,"")
    rows=list(_csv.reader(open(SRC,newline='')))
    out={str(c):{"name":M[c],"sections":[]} for c in M}; cur={c:None for c in M}
    for r in rows:
        r=(r+["","","",""])[:4]; c0=r[0].strip()
        ih=bool(c0) and any(HDR.search(r[c]) or r[c].strip().upper()=="N/A" for c in M)
        if ih:
            for c in M:
                mm=HDR.search(r[c])
                if mm:
                    sec={"label":c0,"chooseCount":int(mm.group(1)),"dishes":[]}
                    out[str(c)]["sections"].append(sec); cur[c]=sec
                else: cur[c]=None
            continue
        if c0=="RAJ AANGAN EVENTS & CATERERS" or c0 in M.values(): continue
        if c0=="" and any(r[c].strip() for c in M):
            for c in M:
                cell=r[c].strip()
                if cell and cur[c] is not None:
                    nm,sub=sp(cell); cur[c]["dishes"].append({"name":nm,"subtitle":sub})
    return out


OUT = "lib/menu-builder/generated/set-menus.ts"

def slug(s):
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s.lower())).strip('-')

# section = (label, chooseCount, [dish or (dish, subtitle)])
def S(label, n, dishes): return (label, n, dishes)

IMAGE_MENUS = [
 ("breakfast-menu", "Breakfast Menu", 450, ["Breakfast","Brunch"],
  "RO water and 200ml bottles are included in the package.", [
   S("Light Food",4,["Poha + Namkeen","Aloo Koffa","Bread Bada","Idli Sambhar","Dal Ki Kachori","Pyaz Ki Kachori","Aalu Batata","Mirchi Wada","Fried Idli","Upma","Sambhar Vada","Dal Pakwaan","Khaman Dhokla","Vegetable Sandwich","Grilled Sandwich","Bread Butter","Butter Toast","Milk Corn Flakes","Aloo Pyaz Parantha With Dahi","Pyaaz Parantha With Dahi","Gobhi Parantha With Dahi","Methi Parantha With Dahi","Palak Parantha With Dahi","Khandwi","Sabutdana Khichdi","Maska Bun","Chole Bhature","Bedwa Poori With Aloo Ki Sabji","Fresh Fruits"]),
   S("Beverages",2,["Tea","Coffee (Espresso)","Dahi Lassi","Hot Milk","Packed Juice"]),
   S("Sweets",1,["Jalebi","Suji Ka Halwa","Moong Dal Ka Halwa","Rasgulla","Shrikhand","Lauki Ka Halwa","Mawa Kachori"]),
   S("Additionals",3,["Sprouts","Aachar","Papad"]),
  ]),
 ("lunch-menu", "Lunch Menu", 750, ["Lunch","Brunch"],
  "RO water and 200ml bottles are included in the package.", [
   S("Beverages",1,["Jal Jeera","Soda Shikanji","Cold Drink","Masala Chachh","Aam Panna (Seasonal)","Sweet Lime Juice"]),
   S("Sweets",1,["Moong Dal Ka Halwa","Gajar Ka Halwa (Seasonal)","Gond Pak","Garam Misri Mawa (Badam)","Rabdi Ke Malpua","Baked Bundi","Pantua Gulab Jamun","Gulab Jamun","Raj Bhog","Rasgulla","Sweet Rice (Yellow)","Sooji Ka Halwa","Chana Toast"]),
   S("Desserts",1,["Pudding","Pastry","Ice Cream","Vanilla","Butter Scotch","Strawberry"]),
   S("Rice",1,["Zeera Pulao","Matar Pulao","Pineapple Anar Pulao","Kashmiri Pulao"]),
   S("Dal Counter",1,["Dal Fry - With Garlic Onion","Dal Fry - Without Garlic Onion","Dal Makhani","Dal Tadka","Dal Dhaba","Dal Rajma","Dal Punjabi (Spicy)"]),
   S("Paneer Preparation",1,["Paneer Lababdar","Kadhi Paneer","Ginger Paneer","Matar Paneer","Butter Paneer Masala","Aachari Paneer"]),
   S("Salad Counter",1,["Green Salad","Sprouts","Russian Salad","Macaroni Salad","Pudina Aloo","Lahsun Ki Chatni","Onion Lachha","Kachumber Salad","Gulkand","Rai Ki Mirchi","Lazeez Potato Salad","Japanese Potato Salad","Cheese Salad","Creamy Kachumber Salad","Steam Kachumber Salad","Spicy Cream Kachumber Salad","Vegetable Volvo Salad","Sirka Onion Salad","Laccha Masala Salad","Thai Papaya Salad","Stuff Cucumber Salad","Dry Fruit Salad","Spanish Potato Salad","Tiranga Laccha Salad"]),
   S("Bread Preparation",2,["Tandoori Sada","Butter Naan","Missi Roti","Stuff Naan","Poori","Lacha Paratha"]),
   S("Veg Preparation",1,["Veg Kofta Curry","Kadhi Pakoda","Stuff Tinda (Seasonal)","Dum Aloo","Chana Masala","Govind Gatta","Kela Sangri","Achari Aloo","Corn Palak","Aloo Choza","Jodhpuri Gatta Curry","Jodhpuri Bhindi (Seasonal)","Bhindi Do Pyaza (Seasonal)","Gobhi Masala (Seasonal)","Pandi Chana","Jeera Aloo","Kashmiri Dum Aloo","Matar Gobhi","Aloo Pyaz Ki Sabzi","Aloo Gobhi Seasonal"]),
   S("Dahi Preparation",1,["Dahi Vada","Shekhawati Dahi Vada","Vegetable Raita","Pineapple Raita","Bundi Ka Raita","Vegetable Fruit Raita (Anar)","Bathua Raita","Pudina Raita"]),
  ]),
 ("maharani-dinner-menu", "Maharani Dinner Menu", 1250, ["Dinner","Cocktail"],
  "RO water and 200ml bottles are included in the package.", [
   S("Snacks",4,["French Fries","Crispy Paneer","P P Samosa","Nachos With Salsa","Spring Roll","Stick Burfi","Baby Corn Mushroom Pakoda","Cheese Corn Ball","Hariyali Kebab","Shezwan Samosa","Chinese Cigar","Tacos With Salsa","Veg Cutlet"]),
   S("Mocktails",2,["Virgin Mojito","Blue Angel","Black Magic","Electric Blue","Ice Lemon Tea","Dark Surprise"]),
   S("Soups",1,["Tomato Soup (Cream)","Tamatar Dhaniya Shorma","Mix Veg Soup","Lemon Coriander Soup","Hot And Sour Soup","Almond Soup","Veg Manchow Soup","Sweet Corn Soup"]),
   S("Juices",1,["Orange Juice","Pineapple Juice","Mix Fruit Juice","Sweet Lime Juice","Fresh Watermelon Juice"]),
   S("Shakes",1,["Pineapple Shake","Vanilla Shake","Strawberry Shake","Kesar Badam Shake","Shahi Gulab Shake","Mirinda Shake","Butter Scotch Shake","Choco Shake","Jo Gul Ki Rabdi Shake","Oreo Shake"]),
   S("Stalls & Khomcha",1,[
     ("North Indian Stall","Paneer Chilla, Pav Bhaji, Chole Bhature, Vada Pav, Bhelpuri, Aloo Papdi Chat, Lachha Tikkiya, Bombay Sandwich, Jalebi Kesariya, Dudh, Mini Mawa Kachori, Gol Gappe, Sweet Corn, Raj Kachori, Sweet Potato Chat"),
     ("Italian Treats","Pizza, White Sauce Pasta, Red Sauce Pasta, Garlic Bread"),
     ("Chinese Treats","Chinese Bhel, Fried Rice Manchurian, Gravy Manchurian, Honey Chilly Potato, Hakka Noodles, Chowmien"),
     ("South Indian","Idli Sambhar, Mini Uttapam, Fried Idli, Kanji Bada, Hyderabadi Chilla, Sambhar Wada"),
   ]),
   S("Sweets",3,["Moong Badam Halwa","Moong Dal Ka Halwa","Gajar Ka Halwa (Seasonal)","Akhrot Ka Halwa","Garam Misti Mawa (Badam)","Loki Ka Halwa","Baked Rabdi Ke Malpua","Baked Bundi","Pantua Gulab Jamun","Gulab Jamun","Kaju Katli","Rasmalai","Raj Bhog","Rasgulla","Dudh Ke Laddu","Gulab Laddu"]),
   S("Vegetable Preparation",2,["Banarasi Jalfrezi","Aloo Matar Malai (Seasonal)","French Palak","Gatta Masala","Mix Veg","Stuff Tinda (Seasonal)","Dum Aloo","Chana Masala","Govind Gatta","Achari Aloo","Veg Taka Tak","Corn Palak","Aloo Chola","Stuff Tomato","Jodhpuri Gatta Curry","Kashmiri Dum Aalu","Stuffed Capsicum","Aalu Gobhi (Seasonal)","Kadha Pakoda","Jodhpuri Bhindi","Bundi Do Pyaza (Seasonal)","Pindi Channa"]),
   S("Paneer Preparation",1,["Paneer Lababdar","Paneer Taka Tak","Paneer Continental","Kaju Paneer","Ginger Paneer","Paneer Bhurji","Matar Paneer","Paneer Tikka Masala","Stuff Paneer","Butter Paneer"]),
   S("Dahi Preparation",1,["Dahi Vada","Shekhawati Dahi Vada","Vegetable Raita","Pineapple Raita","Bundi Ka Raita","Dahi Gujiya","Vegetable Fruit Raita (Anar)","Plain Dahi Kond","Bathua Raita","Kaddu Raita"]),
   S("Breads Preparation",3,["Tawa Chapati Sada","Tandoori Sada","Butter Naan","Missi Roti","Lachha Paratha","Stuff Naan"]),
   S("Namkeen Preparation",1,["Malka Masoor","Lachha Dry Fruits","Mix Pakoda","Dal Moth","Moong Mogar","Channa Dal","Khatti Meethi","Malka Masoor (Dry Fruits)","Moongfali Dan","Gathiya (Besan Ki)","Ratlami Sev","Bikaneri Namkeen","Mix Namkeen","Lalstan Namkeen","Pudina Namkeen"]),
   S("Desserts",1,["Vanilla Ice Cream","Butter Scotch Ice Cream","Strawberry Ice Cream"]),
   S("Rice Preparation",1,["Peas Pulao","Zeera Pulao","Matar Pulao","Pineapple Anar Pulao","Kashmiri Pulao","Kabuli Pulao"]),
   S("Dal Counter",1,["Dal Fry with Garlic Onion","Dal Fry without Garlic Onion","Dal Makhni","Dal Tadka","Dal Dhaba","Dal Panchratan","Dal Rajma","Dal Punjabi (Spicy)"]),
   S("Salad Counter",10,["Green Salad","Sprouts","Russian Salad","Macaroni Salad","Pudina Aloo","Lahsun Ki Chatni","Onion Lachha","Kachumber Salad","Gulkand","Rai Ki Mirchi","Lazeez Potato Salad","Japanese Potato Salad","Cheese Salad","Cream Kachumber Salad","Steam Kachumber Salad","Spicy Cream Kachumber Salad","Vegetable Volvo Salad","Sinka Onion Salad","Laccha Masala Salad","Aloo Chana Chat Salad","Vegetable Roasted Salad","Fruit Cream Salad","Green Wings Salad","Thai Papaya Salad","Stuff Cucumber Salad","Dry Fruit Salad","Potato Spanish Salad","Tiranga Laccha Salad"]),
  ]),
 ("maharaja-vyanjan", "Maharaja Vyanjan", 1750, ["Dinner","Cocktail"],
  "Mineral water & RO water is inclusive in the package.", [
   S("Snacks",5,["Peri Peri Potato Fries","Cottage Cheese Crisp Bites","Mexican Nacho Salsa Platter","Sweet Chilli Paneer Candy","Oriental Vegetable Spring Rolls","Fiery Cottage Cheese 65","Baby Corn & Wild Mushroom Fritters","Golden Cheese Corn Croquettes","Hariyali Shahi Kebabs","Chargrilled Broccoli Tikka","Royal Paneer Tikka Skewers","Crispy Chinese Cigar Rolls","Heritage Vegetable Cutlets","Cajun Spiced Potato Wedges","Corn & Spinach Cigars","Smoky Tandoori Soya Chaap","Cheese Stuffed Jalapeno Poppers","Thai Chilli Baby Corn","Crispy Lotus Stem Honey Chilli","Mediterranean Herb Garlic Bread Bites"]),
   S("Soups",2,["Tamatar Dhaniya Shorma","Mix Veg Soup","Tomato Soup (Cream)","Lemon Coriander Soup","Hot And Sour Soup","Veg Manchow Soup","Sweet Corn Soup","Brocolli Soup"]),
   S("Welcome Juices",1,["Valencia Orange Bliss","Tropical Pineapple Splash","Summer Melon Refresher","Citrus Sweet Lime Cooler","Exotic Fruit Fusion","Alpine Apple Elixir","Mango Royale","Ruby Pomegranate Crush","Pink Guava Delight","Lychee Pearl Refresher","Cranberry Velvet Cooler","Kiwi Mint Infusion","Vineyard Grape Splash","Lemon Mint Zest","Strawberry Silk Cooler"]),
   S("Welcome Mocktails",2,["Sapphire Lagoon Elixir","Havana Mint Royale","Tropical Sunset Symphony","Kiwi Emerald Sparkler","Crimson Cranberry Twist","Pink Guava Velvet Fizz","Citrus Zest Infusion","Green Apple Frost Cooler","Summer Melon Mint Elixir","Lychee Pearl Breeze"]),
   S("Shakes",1,["Classic Sparkling Beverages","Tropical Pineapple Delight","Royal Aam Panna Cooler","Vanilla Velvet Shake","Strawberry Bliss Shake","Khus Royale Elixir","Kaju Anjeer Majesty Shake","Saffron Almond Supreme","Shahi Gulab Indulgence","Citrus Mirinda Frost","Butterscotch Royale Shake","Belgian Choco Fantasy Shake","Gulli Style Rabdi Delight","Himalayan Ice Tea Infusion","Heritage Sugarcane Chai","Oreo Creme Supreme Shake"]),
   S("Stalls & Khomcha",7,["Royal Paneer Chilla Station","Mumbai Street Paav Bhaji","Amritsari Chole Bhature Darbar","Bombay Vada Paav Bites","Peshawari Smoky Paneer Tikka","Aloo Papadi Chaat Royale","Lachha Aloo Tikki Indulgence","Amritsari Kulcha Khazana","Garden Fresh Vegetable Sandwiches","Dahi Sonth Rajbhos Delight","Kesariya Jalebi","Warm Milk Ritual","Rabdi Imarti Majesty","Mini Mawa Kachori Royale","Gol Gappa Experience - Four Signature Waters","Moong Delight Fusion Counter","Butter Tossed Sweet Corn Cups","Purani Delhi Khomcha Bazaar","Paan Patta Chaat Fusion","Kishori Dahi Bhalla Delight","Matar Kulcha Street Feast","Raj Kachori Maharaja Style","Italian: Red Sauce Pasta","Italian: White Sauce Pasta","Italian: Pink Sauce Pasta","Italian: Masala Pasta","Italian: Cheesy Corn Pasta","Italian: Penne Arrabiata","Italian: Veg Macaroni","Italian: Margherita Pizza","Italian: Corn Capsicum Pizza","Italian: Cheese Burst Pizza","Italian: Tandoori Veg Pizza","Italian: Onion Tomato Pizza","Italian: Garlic Bread","Italian: Cheese Garlic Bread Crispy","Chinese: Chinese Bhel","Chinese: Barbeques","Chinese: Fried Rice Manchurian","Chinese: Fried Manchurian","Chinese: Gravy Manchurian","Chinese: Chilly Paneer","Chinese: Honey Chilly Potato","Chinese: Noodles","Chinese: Chowmien","South Indian: Idli Sambhar","South Indian: Mini Uttapam","South Indian: Fried Idli","South Indian: Plain Dosa","South Indian: Masala Dosa","South Indian: Kanji Bada","South Indian: Hyderabadi Chilla","South Indian: Vada"]),
   S("Sweets",4,["Moong Badam Halwa","Moong Daal Ka Halwa","Gajar Ka Halwa","Gond Paak","Akhroth Ka Halwa","Garam Misri Mawa (Badam)","Badam Ka Halwa","Baked Gulab Jamun","Baked Rabdi Ke Malpua","Gulab Jamun (Stuffed)","Kesar Kalakand","Mini Ghevar","Dariya Barfi","Saffron Almond","Makhan Ke Tarbooz","Coconut Rose Laddu","Malai Sandwich","Kaju Katli","Kaju Sangam","Kaju Kesar Katli","Kaju Badam Pista Sandwich","Badam Katli","Dry Fruit Tile","Amrit Bhog","Dry Fruit Kalangi","Special Diamond Cake","Anjeer Coin","Malai Gauri","Indrani","Rasmalai","Chana Roll","Laccha Rabdi","Strawberry Chana Pai","Raj Bhog","Rasgulla","Butter Scotch Laddu","Dilzaani","Dudh Ke Laddu","Gulab Laddu"]),
   S("Desserts",2,["Pudding","Pastry","Vanilla Ice Cream","Butter Scotch Ice Cream","Strawberry Ice Cream","Tan Tan Kulfi","Matka Kulfi","Brownie With Vanilla Ice-Cream","Burf Ka Gola"]),
   S("Rice Preparation",2,["Zeera Pulao","Matar Pulao","Pineapple Anar Pulao","Kashmiri Pulao","Vegetable Biryani","Hyderabadi Biryani","Kabuli Pulao"]),
   S("Dal Counter",2,["Daal Fry - with Garlic Onion","Daal Fry - without Garlic Onion","Dal Makhani","Dal Tadka","Dal Dhaba","Dal Panchratan","Dal Rajma","Dal Punjabi (Spicy)"]),
   S("Paneer Preparation",2,["Paneer Lababdar","Paneer Taka Tak","Paneer Continental","Kadhi Paneer","Paneer Pasanda","Ginger Paneer","Paneer Bhurji","Matar Paneer","Paneer Tikka Masala","Stuff Paneer","Butter Paneer","23 Achari Paneer"]),
   S("Dahi Preparation",6,["Dahi Vada","Shekhawati Dahi Vada","Vegetable Raita","Pineapple Raita","Bundi Ka Raita","Podine Ka Ghole","Dahi Gunjiya","Vegetable Fruit Raita (Anar)","Plain Dhai Kund","Bathua Raita","Kaddu Raita"]),
   S("Breads Preparation",4,["Tawa Chapati Koyala","Tawa Chapati Machine","Tandoori Sada","Butter Naan","Missi Roti","Lachha Paratha","Hariyali Naan","Garlic Naan","Biscuit Naan","Kandhari Naan","Ajwain / Zeera Naan","Stuff Naan","Bajre Ki Roti","Makka Roti","Bejhad Ki Roti"]),
   S("Namkeen Preparation",6,["Malka Mashoor","Laccha Dry Fruits","Khasta Hing Kachori","Mix Pakoda","Dal Moth","Moong Mogar","Channa Dal","Khatti Mithi","Malka Masoor Dry Fruit","Moongfali Dan","Gathiya (Besan Ka)","Ratlami Sev","Bikaneri Namkeen","Mix Namkeen","Lehsun Namkeen","Podhina Namkeen"]),
   S("Salad Counter",10,["Green Salad","Sprouts","Russian Salad","Macroni Salad","Pudina Aloo","Lahsun Ki Chatni","Onion Lachha","Kachumber Salad","Gulkand","Rai Ki Mirchi","Lazeez Potato Salad","Japanese Potato Salad","Cheeze Salad","Cream Kachumber Salad","Steam Kachumber Salad","Spicy Cream Kachumber Salad","Vegetable Volvo Salad","Sirka Onion Salad","Laccha Masala Salad","Aloo Chana Chat Salad","Vegetable Roasted Salad","Fruit Cream Salad","Green Wings Salad","Thai Papaya Salad","Stuff Cucumber Salad","Dry Fruit Salad","Potato Spanish Salad","Tiranga Laccha Salad"]),
   S("Vegetable Preparation",3,["Bombay Jalfrezi","Matar Malai Sweet Corn","Makhmali Kofta","Methi Malai Matar (Seasonal)","Stuff Lichi White Gravy","French Palak","Sweet Corn","Gatta Masala","Matar Mushroom","Chakki Ki Sabji","Mix Veg","Gobhi Muglai (Seasonal)","Stuff Tinda (Seasonal)","Mint Potato","Dum Aloo","Baby Corn Palak","Chana Masala","Matar Masala","Aloo Pyaaz (Fried Paneer)","Govind Gatta","Sarson Ka Saag","Keir Sangri","Achaari Aloo","Corn Palak","Aloo Chola","Corn Gatta Palak","Stuff Tomato","Veg Taka Tak","Green Peas Masala","Veg Kofta Curry","Jodhpuri Gutta Curry","Kashmiri Dum Aaloo","Aloo Pyaaz Ki Sabzi","Stuff Capsicum","Aloo Gobhi Seasonal","Jodhpuri Bhindi (Seasonal)","Bhindi Do Pyaza (Seasonal)","Gobhi Masala (Seasonal)","Pindi Chana","Kadhi Pakoda","Jeera Aaloo"]),
  ]),
]

# ---- CSV menus (Signature / Royal / Elite): prices are PLACEHOLDER ----
CSV_PRICES = {"Signature Dining Menu": 1450, "Royal Feast": 2200, "Elite Experience": 2800}
CSV_DESC = "RO water and 200ml bottles are included in the package."
CSV_SLUG = {"Signature Dining Menu":"signature-dining-menu","Royal Feast":"royal-feast","Elite Experience":"elite-experience"}

csv_data = _load_csv_menus()

COVERS = [1,2,3,4,5,6,7]

def esc(s): return s.replace("\\","\\\\").replace('"','\\"')

def dish_ts(secid, i, name, subtitle):
    did = f"{secid}-{i+1}"
    if subtitle:
        return f'{{ id: "{did}", name: "{esc(name)}", subtitle: "{esc(subtitle)}" }}'
    return f'{{ id: "{did}", name: "{esc(name)}" }}'

menus_ts = []
ci = 0
def build_menu(mid, name, price, fits, desc, sections, price_placeholder=False):
    global ci
    cover = f"/images/mb/placeholder-{COVERS[ci % len(COVERS)]}.jpg"; ci += 1
    fits_ts = ", ".join(f'"{f}"' for f in fits)
    secs_ts = []
    for si, sec in enumerate(sections):
        label, n, dishes = sec
        secid = f"{mid}-{slug(label)}"
        seen = set(); opts = []
        for d in dishes:
            if isinstance(d, tuple): nm, sub = d
            else: nm, sub = d, ""
            key = nm.lower()
            if key in seen: continue
            seen.add(key)
            opts.append((nm, sub))
        opts_ts = ",\n          ".join(dish_ts(secid, i, nm, sub) for i,(nm,sub) in enumerate(opts))
        secs_ts.append(f'''      {{
        id: "{secid}",
        label: "{esc(label)}",
        chooseCount: {n},
        dishOptions: [
          {opts_ts},
        ],
      }}''')
    secs_joined = ",\n".join(secs_ts)
    pl = "  // PLACEHOLDER price — confirm with client" if price_placeholder else ""
    return f'''  {{
    id: "{mid}",
    name: "{esc(name)}",
    slug: "{mid}",
    perPersonPrice: {price},{pl}
    coverImage: "{cover}",
    description: "{esc(desc)}",
    mealTypeFit: [{fits_ts}],
    sections: [
{secs_joined},
    ],
  }}'''

for mid, name, price, fits, desc, sections in IMAGE_MENUS:
    menus_ts.append(build_menu(mid, name, price, fits, desc, sections))

for col in ("1","2","3"):
    m = csv_data[col]; name = m["name"]
    secs = [(s["label"], s["chooseCount"], [(d["name"], d["subtitle"]) for d in s["dishes"]]) for s in m["sections"]]
    menus_ts.append(build_menu(CSV_SLUG[name], name, CSV_PRICES[name], ["Dinner","Cocktail"], CSV_DESC, secs, price_placeholder=True))

header = '''// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/generated/set-menus.ts
// ══════════════════════════════════════════════════════════════════
// GENERATED FILE — do not edit by hand.
// Source: docs/menu-source/set-menus.csv (Signature/Royal/Elite) +
//         docs/menu-source/raw/ menu photos (Breakfast/Lunch/Maharani/Maharaja).
// Regenerate via scripts/gen_set_menus.py. Signature/Royal/Elite per-person
// prices are PLACEHOLDERS pending client confirmation.
// ═══════════════════════════════════════════════════════════════════════════

import type { SetMenu } from "../types";

export const SET_MENUS: SetMenu[] = [
'''
os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT,"w").write(header + ",\n".join(menus_ts) + ",\n];\n")

# summary
tot=0
for m in menus_ts: pass
print("Wrote", OUT)
print("Menus:", len(menus_ts))
PY_DONE = True
