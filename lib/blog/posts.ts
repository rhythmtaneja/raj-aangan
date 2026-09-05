// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/blog/posts.ts
// ══════════════════════════════════════════════════════════════════
//
//   ✍️  THIS IS THE FILE YOU EDIT TO WRITE BLOG POSTS.
//
// Each entry below becomes one card on /blog AND its own page at
// /blog/<slug>. Nothing else needs touching — add a post here and it appears
// in both places.
//
// The five posts below were written by the client; their copy came from
// public/images/blog/content.md (kept as the source document).
//
// If the client later starts writing posts in Sanity Studio instead, those
// win automatically and this file goes back to being the fallback. The two
// render identically.
//
// ─── HOW TO WRITE A BODY ───────────────────────────────────────────────────
// `body` is an array of blocks. The seven block types:
//
//   { type: "p",       text: "A paragraph of body copy." }
//   { type: "h2",      text: "A big section heading" }
//   { type: "h3",      text: "A smaller sub-heading" }
//   { type: "quote",   text: "A pulled-out quote, gold rule, italic." }
//   { type: "list",    items: ["First point", "Second point"] }
//   { type: "numbers", items: ["Step one", "Step two"] }
//   { type: "image",   src: "/images/blog/blog-2.jpg", caption: "Optional" }
//
// Put them in the order you want them to read. Photos go in
// `public/images/blog/` and are referenced as "/images/blog/<file>.jpg".
//
// Inside any text you can use **bold**, and a \n starts a new line inside the
// same paragraph. Careful with apostrophes: inside "double quotes" a normal '
// is fine ("India's"). Long dashes / accents are fine too — just type them.
// ═══════════════════════════════════════════════════════════════════════════

import type { LocalBlogPost } from "./types";

export const LOCAL_BLOG_POSTS: LocalBlogPost[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // POST 1 — How to Plan a Luxury Wedding in Jaipur: Complete Guide
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: "how-to-plan-a-luxury-wedding-in-jaipur",
    title: "How to Plan a Luxury Wedding in Jaipur: Complete Guide",
    date: "06.03.2026",
    image: "/images/blog/blog-1.jpg",
    category: "Weddings",
    excerpt: "",
    tags: [],
    body: [
      { type: "p", text: "A wedding in Jaipur has a way of feeling larger than life. From royal architecture and heritage-inspired settings to colourful traditions, exceptional food and warm Rajasthani hospitality, the Pink City offers everything needed to create a celebration that feels both grand and deeply personal." },
      { type: "p", text: "But a truly luxurious wedding is not simply about choosing a beautiful venue or adding more décor. It is about bringing together the right setting, thoughtful hospitality, great food, beautiful design and seamless execution." },
      { type: "p", text: "If you are planning a luxury wedding in Jaipur, here is a practical guide to help you plan every important detail." },

      { type: "h2", text: "Start With Your Wedding Vision" },
      { type: "p", text: "Before booking a venue or speaking to vendors, decide what you want your wedding to feel like." },
      { type: "p", text: "Do you imagine a traditional royal celebration with rich colours, grand floral arrangements and Rajasthani folk performances? Or would you prefer a more contemporary wedding with minimal décor, soft florals and elegant styling?" },
      { type: "p", text: "Your vision should influence everything that follows — the venue, décor, invitations, outfits, entertainment, menu and even the flow of your functions." },
      { type: "p", text: "A clear vision also makes it easier for your planning team to turn ideas into a cohesive celebration instead of having every function look completely different." },

      { type: "h2", text: "Choose the Right Wedding Venue" },
      { type: "p", text: "The venue is one of the most important decisions you will make." },
      { type: "p", text: "When looking at wedding venues in Jaipur, consider more than just how beautiful the property looks in photographs. Think about your guest count, accommodation requirements, indoor and outdoor spaces, parking, dining facilities and how easily different functions can be managed." },
      { type: "p", text: "A good venue should allow your wedding celebrations to flow naturally — from intimate pre-wedding functions to larger gatherings such as the sangeet and wedding ceremony." },
      { type: "p", text: "At Raj Aangan, for example, the venue experience is designed around both hospitality and celebrations, with heritage accommodation, dedicated family spaces, indoor and outdoor event areas and facilities designed to support weddings and events." },

      { type: "h2", text: "Plan Your Functions as One Celebration" },
      { type: "p", text: "A destination wedding is rarely just one event." },
      { type: "p", text: "Mehendi, haldi, sangeet, cocktail evenings, wedding ceremonies, receptions, sundowners and after-parties each have their own personality. The key is to make every function feel special while still maintaining a common story throughout the wedding." },
      { type: "p", text: "You can keep the mehendi intimate and colourful, create a lively atmosphere for the sangeet, introduce traditional Rajasthani elements during the wedding ceremony and finish with a sophisticated reception." },
      { type: "p", text: "Thoughtful planning of the timeline also ensures that guests have enough time to relax, enjoy the food and experience the celebration rather than constantly moving from one event to another." },

      { type: "h2", text: "Give Décor a Clear Direction" },
      { type: "p", text: "Luxury décor does not necessarily mean using more flowers, larger installations or excessive ornamentation." },
      { type: "p", text: "The most memorable wedding décor usually has a clear concept." },
      { type: "p", text: "Think about colour palettes, lighting, floral styling, furniture, table settings, entrance installations and stage design as parts of one visual story." },
      { type: "p", text: "For a Jaipur wedding, traditional elements such as arches, handcrafted details, marigolds, brass accents and Rajasthani motifs can be combined with contemporary floral arrangements and modern lighting to create a setting that feels rooted in Rajasthan without looking dated." },

      { type: "h2", text: "Make Food Part of the Experience" },
      { type: "p", text: "Food is often one of the first things guests remember after a wedding." },
      { type: "p", text: "A luxury wedding menu should offer variety without becoming overwhelming. Alongside familiar favourites, consider introducing regional Rajasthani specialities, live counters, interactive food stations and cuisines that reflect the preferences of your guests." },
      { type: "p", text: "From traditional Rajasthani flavours to Indian and international favourites, the menu should be planned around the guest profile, time of day and style of each function." },
      { type: "p", text: "A relaxed brunch requires a very different menu from a formal wedding dinner or a late-night celebration." },

      { type: "h2", text: "Curate the Guest Experience" },
      { type: "p", text: "Luxury is often noticed in the smallest details." },
      { type: "p", text: "A smooth airport or hotel arrival, thoughtful room arrangements, welcome refreshments, clear event schedules and attentive hospitality can make a significant difference to your guests." },
      { type: "p", text: "For destination weddings especially, guests are travelling to be part of your celebration. Making them feel looked after from the moment they arrive adds another layer to the experience." },

      { type: "h2", text: "Add Entertainment That Feels Personal" },
      { type: "p", text: "Entertainment should complement the celebration rather than simply fill time." },
      { type: "p", text: "Rajasthani folk artists, live musicians, dhol, shehnai, DJs, dance performances, anchors and live bands can all be incorporated depending on the mood of the event." },
      { type: "p", text: "For a Jaipur wedding, traditional performances can be particularly effective when combined with contemporary entertainment. The result is an experience that introduces guests to the culture of Rajasthan while keeping the celebration energetic and modern." },

      { type: "h2", text: "Leave Room for the Unexpected" },
      { type: "p", text: "Even the most carefully planned wedding can face unexpected changes." },
      { type: "p", text: "Weather, guest delays, technical requirements and last-minute changes are all part of live events. Having experienced professionals managing the event on the ground means these situations can be handled quietly without affecting the guest experience." },
      { type: "p", text: "The best wedding planning is often the work guests never notice." },

      { type: "h2", text: "Final Thoughts" },
      { type: "p", text: "Planning a luxury wedding in Jaipur is about much more than creating a beautiful day. It is about creating an experience that your family and guests remember long after the celebrations are over." },
      { type: "p", text: "The right venue, thoughtful design, exceptional catering, personalised entertainment and detailed event coordination come together to create that experience." },
      { type: "p", text: "At Raj Aangan Events & Caterers, we believe every celebration has its own story. From wedding planning and décor to catering, entertainment, hospitality and on-ground coordination, every detail deserves the same level of care." },
      { type: "p", text: "Because when everything comes together seamlessly, you are free to do what your wedding is really about — celebrate." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // POST 2 — Why Jaipur is India's Favorite Destination Wedding City
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: "why-jaipur-is-indias-favorite-destination-wedding-city",
    title: "Why Jaipur is India's Favorite Destination Wedding City",
    date: "06.03.2026",
    image: "/images/blog/blog-2.jpg",
    category: "Destinations",
    excerpt: "",
    tags: [],
    body: [
      { type: "p", text: "There is something undeniably romantic about getting married in Jaipur." },
      { type: "p", text: "The Pink City brings together the grandeur of Rajasthan, beautiful heritage architecture, vibrant traditions, exceptional food and the warmth of Indian hospitality. For couples looking for a destination wedding that feels luxurious yet unmistakably Indian, Jaipur continues to be one of the most compelling choices." },
      { type: "p", text: "But the city's popularity is not only about its royal appearance. Jaipur offers something equally important for a destination wedding — versatility." },

      { type: "h2", text: "A City That Feels Truly Royal" },
      { type: "p", text: "Jaipur's biggest attraction is its heritage." },
      { type: "p", text: "Palaces, havelis, courtyards, arches, traditional craftsmanship and Rajasthani design provide an atmosphere that is difficult to recreate elsewhere. Even a contemporary wedding can incorporate elements of the city's royal character through décor, entertainment, cuisine and styling." },
      { type: "p", text: "For couples dreaming of a wedding that feels like a celebration of Rajasthan, Jaipur provides the perfect backdrop." },

      { type: "h2", text: "The Perfect Balance Between Tradition and Modern Luxury" },
      { type: "p", text: "Today's couples do not necessarily want a completely traditional wedding." },
      { type: "p", text: "They want the rituals, colours and cultural experiences that make an Indian wedding special, but they also want contemporary hospitality, elegant décor, premium dining and modern entertainment." },
      { type: "p", text: "Jaipur makes this combination possible." },
      { type: "p", text: "A wedding can begin with a traditional mehendi, continue with a vibrant sangeet and Rajasthani folk performance, and end with a sophisticated reception featuring modern décor and international cuisine." },
      { type: "p", text: "That ability to combine old and new is one of Jaipur's greatest strengths." },

      { type: "h2", text: "Plenty of Options for Different Wedding Styles" },
      { type: "p", text: "Not every couple imagines the same wedding." },
      { type: "p", text: "Some want a large multi-day celebration with hundreds of guests. Others prefer an intimate gathering surrounded by their closest family and friends." },
      { type: "p", text: "Jaipur's wedding ecosystem offers a wide range of venues and experiences — from grand palace properties and luxury hotels to heritage havelis, resorts and more intimate celebration spaces." },
      { type: "p", text: "This flexibility allows couples to choose a venue based on their guest count, budget, aesthetic and style rather than having to compromise on their vision." },

      { type: "h2", text: "Food That Guests Remember" },
      { type: "p", text: "A destination wedding is also an opportunity to introduce guests to the flavours of the destination." },
      { type: "p", text: "Jaipur is particularly well suited for this." },
      { type: "p", text: "Rajasthani cuisine offers an incredible variety of flavours, from dal baati churma and gatte to traditional sweets and regional specialities. These can be complemented by Indian favourites, international cuisines, live counters and curated menus." },
      { type: "p", text: "For guests travelling from another city or country, food becomes part of the destination experience." },

      { type: "h2", text: "Entertainment With a Sense of Place" },
      { type: "p", text: "One of the easiest ways to make a Jaipur wedding feel different from a wedding anywhere else is through entertainment." },
      { type: "p", text: "Rajasthani folk musicians, traditional dancers, dhol, shehnai and local performers can introduce guests to the cultural character of Rajasthan." },
      { type: "p", text: "At the same time, couples can bring in DJs, live bands, singers, anchors and contemporary performances to keep the celebrations modern." },
      { type: "p", text: "The combination creates a wedding that feels authentic without becoming overly traditional." },

      { type: "h2", text: "A Destination Guests Can Enjoy" },
      { type: "p", text: "A destination wedding is also a holiday for your guests." },
      { type: "p", text: "Jaipur offers plenty to experience beyond the wedding itself — heritage architecture, local markets, traditional crafts, cuisine and the unmistakable atmosphere of Rajasthan." },
      { type: "p", text: "This means couples can build an entire wedding weekend around their guests rather than treating the wedding ceremony as an isolated event." },
      { type: "p", text: "A welcome evening, local experiences, a relaxed brunch or a sundowner can turn the wedding into a memorable journey for everyone attending." },

      { type: "h2", text: "Hospitality Makes the Difference" },
      { type: "p", text: "The success of a destination wedding is ultimately measured by how guests feel." },
      { type: "p", text: "From arrival and accommodation to meals, transportation, event schedules and on-ground assistance, every interaction matters." },
      { type: "p", text: "This is why hospitality and event coordination are just as important as décor and venue selection." },
      { type: "p", text: "At Raj Aangan Events & Caterers, our approach brings together wedding planning, guest hospitality, décor, catering, entertainment and event coordination so that the entire celebration feels connected." },

      { type: "h2", text: "Why Jaipur Continues to Stand Out" },
      { type: "p", text: "There are many beautiful wedding destinations in India, but Jaipur offers a rare combination of royal character, cultural richness, luxury hospitality and flexibility." },
      { type: "p", text: "It can feel grand without losing its warmth." },
      { type: "p", text: "It can be traditional without feeling old-fashioned." },
      { type: "p", text: "And it can be luxurious while still feeling distinctly Indian." },
      { type: "p", text: "That is perhaps why Jaipur continues to hold such a special place in the world of destination weddings." },
      { type: "p", text: "For couples looking for a wedding that feels like more than an event — a celebration, a cultural experience and a collection of unforgettable moments — Jaipur remains an extraordinary choice." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // POST 3 — Wedding Venues in Jaipur Every Couple Should Consider
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: "wedding-venues-in-jaipur-every-couple-should-consider",
    title: "Wedding Venues in Jaipur Every Couple Should Consider",
    date: "06.03.2026",
    image: "/images/blog/blog-3.jpg",
    category: "Venues",
    excerpt: "",
    tags: [],
    body: [
      { type: "p", text: "Choosing a wedding venue is one of the first major decisions a couple makes, and in Jaipur, the choice can be both exciting and overwhelming." },
      { type: "p", text: "The city is home to everything from grand palace properties and heritage hotels to luxury resorts, intimate havelis and contemporary event spaces. The right venue, however, is not necessarily the most famous one. It is the one that fits your guest list, wedding style, functions and expectations." },
      { type: "p", text: "Here are some of the venue styles every couple planning a Jaipur wedding should consider." },

      { type: "h2", text: "1. Heritage Palaces" },
      { type: "p", text: "For couples who have always imagined a royal wedding, a heritage palace is an obvious choice." },
      { type: "p", text: "These properties bring architecture, history and grandeur into the celebration itself. Intricate details, traditional courtyards, gardens and dramatic entrances can reduce the need for excessive décor because the venue already provides a strong visual identity." },
      { type: "p", text: "Heritage properties work particularly well for couples who want their wedding to feel timeless and unmistakably Rajasthani." },

      { type: "h2", text: "2. Luxury Resorts" },
      { type: "p", text: "Luxury resorts offer a different kind of wedding experience." },
      { type: "p", text: "Instead of focusing only on heritage architecture, resorts can provide expansive event spaces, accommodation, dining facilities and amenities that make them suitable for multi-day celebrations." },
      { type: "p", text: "They are particularly useful when several wedding functions are being hosted at the same property." },
      { type: "p", text: "Guests can arrive, stay, dine and attend multiple celebrations without constantly travelling between venues." },

      { type: "h2", text: "3. Heritage Havelis" },
      { type: "p", text: "For a more intimate celebration, heritage havelis can be an excellent option." },
      { type: "p", text: "Their courtyards, traditional architecture and smaller scale create a naturally personal atmosphere. They are ideal for intimate mehendi functions, family gatherings, engagement celebrations and smaller destination weddings." },
      { type: "p", text: "The charm of a haveli lies in its character. Rather than building an elaborate environment from scratch, the architecture becomes part of the celebration." },

      { type: "h2", text: "4. Contemporary Event Venues" },
      { type: "p", text: "Not every couple wants a traditional palace wedding." },
      { type: "p", text: "Some prefer a modern celebration with minimal décor, sophisticated lighting, contemporary furniture and a carefully designed visual identity." },
      { type: "p", text: "Contemporary event venues can provide the flexibility required to create such a wedding while allowing couples to customise the space around their chosen concept." },

      { type: "h2", text: "5. Raj Aangan Resort" },
      { type: "p", text: "For couples looking for a venue in Jaipur that combines heritage character with practical event facilities, Raj Aangan offers a versatile setting for celebrations." },
      { type: "p", text: "The property features 26 luxury heritage rooms, dedicated bridal and family accommodation, an air-cooled banquet hall and both indoor and outdoor event spaces." },
      { type: "p", text: "The indoor space can accommodate approximately 250–300 guests, while the outdoor setting can accommodate larger gatherings of approximately 600–800 guests." },
      { type: "p", text: "Facilities such as dedicated vendor areas, guest seating, fine-dining setups, bridal and mandap seating and traditional Rajasthani welcome elements are designed to support the practical requirements of a wedding." },
      { type: "p", text: "This makes the property suitable for everything from intimate family functions to larger celebrations." },

      { type: "h2", text: "6. Venues With Strong Catering Capabilities" },
      { type: "p", text: "A beautiful venue is important, but food can make or break the guest experience." },
      { type: "p", text: "When shortlisting venues, couples should ask about catering capabilities, menu customisation, live stations, service style and how different menus can be planned across multiple functions." },
      { type: "p", text: "A venue that can bring together the event and culinary experience can make planning significantly easier." },
      { type: "p", text: "At Raj Aangan Events & Caterers, catering is treated as an important part of the celebration, with menus designed around different cuisines, flavours and guest preferences." },

      { type: "h2", text: "7. Venues That Can Host Multiple Functions" },
      { type: "p", text: "A destination wedding becomes much easier when the venue can support multiple functions." },
      { type: "p", text: "Think beyond the wedding ceremony." },
      { type: "p", text: "Can the same property accommodate your mehendi, haldi, sangeet, cocktail, wedding, reception, brunch or sundowner?" },
      { type: "p", text: "Can different spaces create different moods?" },
      { type: "p", text: "Can guests move comfortably between events?" },
      { type: "p", text: "These questions are often more important than the appearance of a venue alone." },

      { type: "h2", text: "What Should You Look for in a Jaipur Wedding Venue?" },
      { type: "p", text: "Before finalising a property, consider:" },
      {
        type: "list",
        items: [
          "Guest capacity",
          "Number and quality of rooms",
          "Indoor and outdoor event spaces",
          "Parking and accessibility",
          "Catering facilities",
          "Vendor policies",
          "Décor flexibility",
          "Guest hospitality",
          "Power and technical arrangements",
          "Weather contingency options",
          "Function-to-function movement",
          "On-ground event support",
        ],
      },
      { type: "p", text: "A venue may look perfect online, but the practical details are what determine how smoothly the wedding actually runs." },

      { type: "h2", text: "The Right Venue Is About More Than a Beautiful Background" },
      { type: "p", text: "Your wedding venue becomes the setting for some of the most important memories of your life." },
      { type: "p", text: "That is why choosing one should be about more than photographs." },
      { type: "p", text: "Look for a property that understands celebrations, can comfortably accommodate your guests and gives you the flexibility to create the wedding you have imagined." },
      { type: "p", text: "Jaipur offers plenty of options. The key is finding the one that feels right for you." },
      { type: "p", text: "At Raj Aangan Events & Caterers, our focus is to bring together the venue, hospitality, catering, décor, entertainment and event execution so couples can enjoy their celebration while our team takes care of the details." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // POST 4 — The Ultimate Luxury Wedding Checklist
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: "the-ultimate-luxury-wedding-checklist",
    title: "The Ultimate Luxury Wedding Checklist",
    date: "06.03.2026",
    image: "/images/blog/blog-4.jpg",
    category: "Planning",
    excerpt: "",
    tags: [],
    body: [
      { type: "p", text: "Planning a luxury wedding is exciting, but it can also become overwhelming very quickly." },
      { type: "p", text: "There are venues to book, guests to manage, outfits to finalise, menus to taste, décor concepts to approve and countless small details that need attention. A good checklist helps turn all of this into a clear plan." },
      { type: "p", text: "Whether you are planning an intimate celebration or a large destination wedding in Jaipur, use this checklist to keep your planning organised." },

      { type: "h2", text: "1. Set Your Wedding Vision" },
      { type: "p", text: "Before making bookings, decide what you want the celebration to feel like." },
      { type: "p", text: "Ask yourselves:" },
      {
        type: "list",
        items: [
          "What is our overall wedding style?",
          "Do we want traditional, contemporary or a combination?",
          "How many guests are we expecting?",
          "How many functions do we want?",
          "What are our must-have experiences?",
          "What are our priorities — food, décor, entertainment, hospitality or venue?",
        ],
      },
      { type: "p", text: "Having these answers early makes every later decision easier." },

      { type: "h2", text: "2. Finalise Your Guest List" },
      { type: "p", text: "Your guest count affects almost everything." },
      { type: "p", text: "It influences your venue, accommodation, catering requirements, seating, transportation and overall event flow." },
      { type: "p", text: "Create a preliminary guest list early and divide it into family, close friends, colleagues and other guests. Keep updating it as plans develop." },

      { type: "h2", text: "3. Choose the Venue" },
      { type: "p", text: "Once you have an approximate guest count, begin looking at venues." },
      { type: "p", text: "Check:" },
      {
        type: "list",
        items: [
          "Capacity",
          "Rooms and accommodation",
          "Indoor and outdoor areas",
          "Parking",
          "Catering facilities",
          "Décor restrictions",
          "Vendor policies",
          "Power and technical facilities",
          "Weather backup",
          "Function timings",
          "Guest movement",
        ],
      },
      { type: "p", text: "Do not choose a venue only because it looks beautiful in photographs. Make sure it can actually support your entire celebration." },

      { type: "h2", text: "4. Build Your Wedding Budget" },
      { type: "p", text: "Luxury does not mean spending without planning." },
      { type: "p", text: "Create separate budget categories for:" },
      {
        type: "list",
        items: [
          "Venue",
          "Accommodation",
          "Catering",
          "Décor",
          "Photography and videography",
          "Entertainment",
          "Bridal and groom styling",
          "Invitations",
          "Transportation",
          "Hospitality",
          "Gifts and favours",
          "Production and technical requirements",
          "Contingency",
        ],
      },
      { type: "p", text: "Keep a contingency amount aside for last-minute requirements." },

      { type: "h2", text: "5. Plan Every Function" },
      { type: "p", text: "Create a basic schedule for every event." },
      { type: "p", text: "For example:" },
      { type: "p", text: "**Day 1:** Guest arrivals, welcome dinner and cocktail\n**Day 2:** Haldi, mehendi and sangeet\n**Day 3:** Wedding ceremony and reception\n**Day 4:** Brunch and departures" },
      { type: "p", text: "Your actual schedule can be shorter or longer, but planning the overall flow early helps avoid unnecessary stress." },

      { type: "h2", text: "6. Finalise Décor & Styling" },
      { type: "p", text: "Create one visual direction for the wedding." },
      { type: "p", text: "Decide on:" },
      {
        type: "list",
        items: [
          "Colour palette",
          "Floral design",
          "Stage",
          "Mandap",
          "Entrance",
          "Table styling",
          "Lighting",
          "Furniture",
          "Signage",
          "Guest seating",
          "Photo opportunities",
        ],
      },
      { type: "p", text: "For a Jaipur wedding, consider incorporating subtle Rajasthani elements rather than relying entirely on obvious traditional décor." },

      { type: "h2", text: "7. Plan the Menu" },
      { type: "p", text: "Food deserves its own planning stage." },
      { type: "p", text: "Consider:" },
      {
        type: "list",
        items: [
          "Welcome drinks",
          "Breakfast",
          "Lunch",
          "High tea",
          "Dinner",
          "Desserts",
          "Live counters",
          "Regional cuisine",
          "Vegetarian and non-vegetarian options",
          "International cuisines",
          "Special dietary requirements",
        ],
      },
      { type: "p", text: "Different functions can have completely different menus. A daytime mehendi, evening cocktail and wedding reception do not need to serve the same food." },

      { type: "h2", text: "8. Book Entertainment" },
      { type: "p", text: "Decide what kind of entertainment suits each function." },
      { type: "p", text: "Options can include:" },
      {
        type: "list",
        items: [
          "DJ",
          "Live singer",
          "Live band",
          "Rajasthani folk artists",
          "Dhol",
          "Shehnai",
          "Cultural dance",
          "Baraat band",
          "Celebrity artist",
          "Anchor or emcee",
        ],
      },
      { type: "p", text: "The best entertainment is matched to the mood of the event." },

      { type: "h2", text: "9. Plan the Guest Experience" },
      { type: "p", text: "For destination weddings, hospitality should begin before the first function." },
      { type: "p", text: "Prepare:" },
      {
        type: "list",
        items: [
          "Arrival assistance",
          "Welcome gifts",
          "Room allocation",
          "Event schedules",
          "Transportation",
          "Special guest requirements",
          "Family assistance",
          "Emergency contacts",
          "Departure arrangements",
        ],
      },
      { type: "p", text: "Small details can make guests feel genuinely cared for." },

      { type: "h2", text: "10. Photography & Videography" },
      { type: "p", text: "Your wedding will last a few days. Your photographs and films will last much longer." },
      { type: "p", text: "Discuss your preferred style with your photographer and videographer." },
      { type: "p", text: "Make sure important moments are planned into the schedule — bridal preparations, family portraits, couple portraits, ceremonies, candid moments and details of the décor." },

      { type: "h2", text: "11. Bridal & Groom Details" },
      { type: "p", text: "Create a separate checklist for:" },
      {
        type: "list",
        items: [
          "Wedding outfits",
          "Jewellery",
          "Footwear",
          "Accessories",
          "Makeup",
          "Hair",
          "Groom styling",
          "Emergency kits",
          "Outfit changes",
          "Family outfits",
        ],
      },
      { type: "p", text: "Do not leave alterations and final fittings until the last minute." },

      { type: "h2", text: "12. Create a Vendor & Contact Sheet" },
      { type: "p", text: "Keep all important information in one place." },
      { type: "p", text: "Include:" },
      {
        type: "list",
        items: [
          "Vendor names",
          "Contact numbers",
          "Arrival times",
          "Setup requirements",
          "Payment status",
          "Deliverables",
          "Event assignment",
        ],
      },
      { type: "p", text: "Your wedding planning team should have access to the same information." },

      { type: "h2", text: "13. Have a Backup Plan" },
      { type: "p", text: "A professional wedding plan should always include contingencies." },
      { type: "p", text: "Think about:" },
      {
        type: "list",
        items: [
          "Rain",
          "Power interruptions",
          "Vendor delays",
          "Guest delays",
          "Technical issues",
          "Last-minute changes",
          "Medical emergencies",
        ],
      },
      { type: "p", text: "The goal is not to expect problems. It is to make sure that if something unexpected happens, your guests never have to worry about it." },

      { type: "h2", text: "14. The Final Week Checklist" },
      { type: "p", text: "One week before the wedding, confirm:" },
      {
        type: "list",
        items: [
          "Final guest count",
          "Room allocation",
          "Menu",
          "Décor",
          "Entertainment",
          "Event timings",
          "Transportation",
          "Vendor arrival times",
          "Family requirements",
          "Special guest requirements",
          "Payments",
          "Emergency contacts",
        ],
      },
      { type: "p", text: "Then let your event team take over." },

      { type: "h2", text: "The Most Important Item on the Checklist: Enjoy Your Wedding" },
      { type: "p", text: "It is easy for couples to become so involved in managing the details that they forget to actually experience their wedding." },
      { type: "p", text: "That is why professional event planning matters." },
      { type: "p", text: "At Raj Aangan Events & Caterers, we believe the couple should be present in the moment while the planning, coordination, hospitality, catering, décor and on-ground execution are handled by an experienced team." },
      { type: "p", text: "A luxury wedding is successful when everything feels effortless to the guests — and when the couple gets to enjoy every moment of it." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // POST 5 — Wedding Trends for 2026: Decor, Fashion & Experiences
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: "wedding-trends-for-2026",
    title: "Wedding Trends for 2026: Decor, Fashion & Experiences",
    date: "06.03.2026",
    image: "/images/blog/blog-5.jpg",
    category: "Trends",
    excerpt: "",
    tags: [],
    body: [
      { type: "p", text: "Wedding celebrations in 2026 are becoming more personal." },
      { type: "p", text: "Couples are moving away from the idea that a luxury wedding has to be defined by sheer scale. Instead, today's celebrations are increasingly about thoughtful design, meaningful experiences, beautiful details and creating an atmosphere that genuinely reflects the couple." },
      { type: "p", text: "In India, this is also creating an interesting balance between heritage and modern luxury — particularly in destinations like Jaipur, where traditional architecture and culture provide a natural foundation for contemporary celebrations." },
      { type: "p", text: "Here are some of the wedding trends shaping 2026." },

      { type: "h2", text: "1. Quiet Luxury is Making Its Way Into Weddings" },
      { type: "p", text: "Luxury is becoming less about excess and more about quality." },
      { type: "p", text: "Instead of filling every space with elaborate installations, couples are choosing carefully considered décor, premium materials, elegant floral arrangements and sophisticated lighting." },
      { type: "p", text: "The result is often a celebration that feels refined rather than overwhelming." },
      { type: "p", text: "For Jaipur weddings, this can mean allowing the natural character of a heritage venue to become part of the décor instead of covering every surface." },

      { type: "h2", text: "2. Personalised Wedding Experiences" },
      { type: "p", text: "One of the biggest trends of 2026 is making the wedding feel unmistakably personal." },
      { type: "p", text: "Couples are incorporating details connected to their story — personalised menus, custom stationery, meaningful music, family traditions and experiences designed specifically for their guests." },
      { type: "p", text: "The question is no longer simply, \"Does it look beautiful?\"" },
      { type: "p", text: "It is also, \"Does it feel like us?\"" },

      { type: "h2", text: "3. Heritage Meets Contemporary Design" },
      { type: "p", text: "Jaipur is particularly well suited to this trend." },
      { type: "p", text: "Traditional Rajasthani architecture can be paired with modern furniture, clean floral arrangements, contemporary lighting and understated colour palettes." },
      { type: "p", text: "A traditional haveli or heritage venue does not need to be transformed into something completely different. Instead, modern design can highlight its existing character." },
      { type: "p", text: "This creates a wedding that feels rooted in Rajasthan while still looking fresh and contemporary." },

      { type: "h2", text: "4. Experiences Over Elaborate Décor" },
      { type: "p", text: "Couples are increasingly investing in experiences that guests can participate in rather than simply look at." },
      { type: "p", text: "This can include:" },
      {
        type: "list",
        items: [
          "Live food stations",
          "Interactive cocktail bars",
          "Cultural performances",
          "Live music",
          "Curated guest activities",
          "Personalised welcome experiences",
          "Sundowners",
          "After-parties",
          "Local cultural experiences",
        ],
      },
      { type: "p", text: "The focus is shifting from creating something impressive for photographs to creating something memorable for people." },

      { type: "h2", text: "5. More Intimate Wedding Functions" },
      { type: "p", text: "Even when the main wedding is large, couples are creating smaller moments around it." },
      { type: "p", text: "An intimate family dinner, private mehendi, close-friends cocktail evening or relaxed morning brunch can provide a different atmosphere from the main celebrations." },
      { type: "p", text: "These smaller gatherings often become some of the most memorable parts of a destination wedding because guests have more time to interact." },

      { type: "h2", text: "6. Destination Weddings Are Becoming More Immersive" },
      { type: "p", text: "A destination wedding is increasingly being treated as a complete experience rather than a single ceremony." },
      { type: "p", text: "Couples are planning welcome events, cultural evenings, local experiences, brunches and farewell celebrations around the main wedding." },
      { type: "p", text: "In Jaipur, this could mean introducing guests to Rajasthani cuisine, folk music, traditional performances or the cultural character of the city." },
      { type: "p", text: "The wedding becomes a journey rather than simply a date on the calendar." },

      { type: "h2", text: "7. Floral Design is Becoming More Intentional" },
      { type: "p", text: "Flowers remain an important part of wedding décor, but the approach is changing." },
      { type: "p", text: "Rather than using flowers everywhere, couples are choosing statement installations and carefully designed floral moments." },
      { type: "p", text: "A beautiful entrance, mandap, dining table or stage can make a stronger impression than covering the entire venue." },
      { type: "p", text: "Colour palettes are also becoming more sophisticated, with couples experimenting beyond the traditional reds, pinks and marigolds." },

      { type: "h2", text: "8. Fashion is More Personal" },
      { type: "p", text: "Bridal fashion in 2026 is increasingly about individuality." },
      { type: "p", text: "Couples are mixing traditional silhouettes with contemporary styling, experimenting with lighter looks for daytime functions and choosing outfits that allow them to move comfortably during long celebrations." },
      { type: "p", text: "The same philosophy applies to the groom's wardrobe." },
      { type: "p", text: "Instead of following one fixed style, couples are choosing outfits that reflect their personalities while still respecting the traditions of the occasion." },

      { type: "h2", text: "9. Lighting is Becoming a Design Element" },
      { type: "p", text: "Good lighting can completely transform a wedding venue." },
      { type: "p", text: "Warm ambient lighting, architectural lighting, candles, statement fixtures and carefully placed illumination can create atmosphere without adding excessive décor." },
      { type: "p", text: "For evening weddings, lighting can become part of the overall visual identity of the celebration." },

      { type: "h2", text: "10. Food is Becoming More Experiential" },
      { type: "p", text: "Wedding menus are becoming more interactive." },
      { type: "p", text: "Instead of simply serving multiple dishes at a buffet, couples are creating experiences around food." },
      { type: "p", text: "Live counters, regional specialities, chef-led stations, dessert experiences and customised menus allow guests to explore different flavours throughout the celebration." },
      { type: "p", text: "For Jaipur weddings, incorporating authentic Rajasthani cuisine alongside contemporary Indian and international options creates an especially interesting culinary experience." },

      { type: "h2", text: "11. Entertainment is Becoming More Diverse" },
      { type: "p", text: "A DJ is no longer the only option for wedding entertainment." },
      { type: "p", text: "Couples are combining live singers, bands, folk performers, cultural dancers, dhol, shehnai, anchors and DJs across different functions." },
      { type: "p", text: "The result is a celebration where every event has its own energy." },

      { type: "h2", text: "12. The Guest Experience Comes First" },
      { type: "p", text: "Perhaps the biggest trend of all is a greater focus on the guest." },
      { type: "p", text: "Comfortable accommodation, thoughtful welcome experiences, smooth event transitions, personalised details and attentive hospitality can have a bigger impact than another large décor installation." },
      { type: "p", text: "After all, a wedding is not only something people see. It is something they experience." },

      { type: "h2", text: "The 2026 Wedding Philosophy" },
      { type: "p", text: "The modern luxury wedding is not necessarily the biggest wedding." },
      { type: "p", text: "It is the one where every element feels intentional." },
      { type: "p", text: "The venue has a purpose.\nThe décor tells a story.\nThe food reflects the couple and their guests.\nThe entertainment creates energy.\nThe hospitality makes everyone feel welcome." },
      { type: "p", text: "And most importantly, the celebration feels authentic." },
      { type: "p", text: "At Raj Aangan Events & Caterers, we bring together wedding planning, décor and styling, catering, entertainment, guest hospitality and on-ground coordination to create celebrations that balance the warmth of Rajasthan with the expectations of modern luxury." },
      { type: "p", text: "Because the best wedding trend is one that makes your celebration feel completely your own." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // TO ADD A SIXTH POST: copy the block below, uncomment it, fill it in.
  // ═══════════════════════════════════════════════════════════════════════
  // {
  //   slug: "my-new-post",
  //   title: "My New Post",
  //   date: "01.04.2026",
  //   image: "/images/blog/blog-6.jpg",
  //   category: "Weddings",
  //   excerpt: "One line that sits under the title on the post's hero.",
  //   tags: ["Jaipur", "Catering"],
  //   body: [
  //     { type: "p", text: "Opening paragraph." },
  //     { type: "h2", text: "A section heading" },
  //     { type: "p", text: "More copy." },
  //     { type: "list", items: ["A point", "Another point"] },
  //     { type: "image", src: "/images/blog/blog-2.jpg", caption: "A caption." },
  //     { type: "quote", text: "Something worth pulling out." },
  //   ],
  // },
];

/** Lookup used by the post page. */
export function getLocalBlogPost(slug: string): LocalBlogPost | undefined {
  return LOCAL_BLOG_POSTS.find((p) => p.slug === slug);
}
