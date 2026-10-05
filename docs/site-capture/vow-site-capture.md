# Vacations on Wheels (vacationsonwheels.ca): site text capture

Captured 2026-10-05 with curl (Chrome 130 desktop User-Agent, one request at a time, about 3.5 s apart, no cookies). The site is built on Turnkey Web Solutions; inventory/item pages come from equipmentsearch.com dealer ID 9341.
Raw HTML is in `raw/`. Scripts used: `urls.txt`, `fetch.sh`, `fetch-log.tsv`, `extract.py`, `build.py`, `assemble.py`.

## Key findings

Capture status
- 18 content pages captured (all 15 `main.xml` URLs except `/Home/`, which is a 301 to `/`, plus Privacy, Terms, Accessibility, plus one `/Services/adid/` item detail). 19 sitemap item pages NOT captured (9 Onan generators, 8 service items, 2 blog posts): the firewall began blocking at the 3rd `/page/display/` probe (one 503, then 403 on each of the 21 requests after it; see "Capture log"). Block text: `Your IP Address "174.91.102.143" is temporarily blocked for suspicious behaviour ... Blocking Reason: Cookies are not enabled.` Stopped per instructions; no retries. A later retry should use a cookie jar (`curl -c/-b`) and avoid requesting the dead `/page/display/` links (the 404s may have tripped it).
- `www.` host 301s to the apex `https://vacationsonwheels.ca`. `/sitemap.xml` is 404; robots.txt lists `main.xml`, `inventory.xml`, `parts.xml`, `blogs.xml` and `Crawl-delay: 2`.

New facts (not in the known-facts list)
- Email: vacationsonwheel@gmail.com (note "wheel", singular). Appears only on About Us. No other emails or phones; only 905-738-1253 everywhere.
- Legal name in JSON-LD and item pages: "Vacations on Wheels Inc."; address there is "1841 Hwy 7 W" (page header/footer say "1841 Hwy 7 Concord, ON L4K 1V4"). Site also uses the singular "Vacation on Wheels" (footer heading, Map page, Terms, Privacy).
- Warranty provider: Global Warranty (globalwarranty.com, links to Motorized and Non-Motorized PDFs). Own plans: Platinum and Gold Cargo/Utility Trailer, Commercial Use, Tire & Wheel Protection ($200 flat repair, $2,000 tire aggregate, max 4 wheel replacements). Text reads like the provider's brochure.
- Supplier/brand logos on home: Onan, Winnebago (alt "Winnebaco"), "Vntpstag" (alt text; logo unreadable here), Atlas, Dutchmen, Woodland Park, Northlander, Blue Ox. Parts catalogue link: rvflipbook.com "2026 RV Big Book" labelled "NTP Parts". 9 Onan generators exist in the sitemap (QG 4000/4000i/5500/6500/7000, QD 3200).
- Dometic is NOT mentioned anywhere on the 18 captured pages (nor Thetford, Lippert, etc.). The "Dometic authorized dealer" fact is not supported by this site.
- Service areas: "Proudly Serving Southern Ontario"; About says "across town or across the province"; home copy mentions Canada and the USA (travel, not service area).
- Claims (unsourced): "4.3/5 star average on independent review sites, with thousands of happy RV owners" (About), "insured transport fleet", "certified technicians", "Decades of Expertise", "100 years of combined experience" (home meta), "family owned and operated", "We work with all major insurance companies" (no insurer named), "OEM or high-quality replacement parts", "guarantee all our workmanship", "no hidden fees". No staff names, no testimonials, no prices (service items say "Contact for price"; pick-up mentions "applicable pick-up fees", no amount).
- Delivery: copy says "pickup and delivery" but the only form is a Pick up request (trailer pick-up for service); no delivery form or fee.
- 2 blog posts, both dated 2025-06-01, by "Vacations on Wheels" (excerpts only; full text not captured).
- Pick-up form is the newest build (fields: trailer type, plate, gate code, date, time window, two acknowledgement checkboxes); the others are the generic Turnkey forms.

Copied / placeholder / template text
- Home meta description ("quality RVs and trailers ... buy, sell, trade and consign ... 100 years of combined experience") and welcome copy ("serviced and well-maintained Used RV or Trailer", "Enthusisats", "our our", "RV's") are sales copy for a dealer, not a service shop.
- "'Hold With Deposit' How does it work? Can I get my money back?" FAQ (credit-card deposit to hold a unit) appears on Services, Resources and the item detail page: Turnkey dealer-template text.
- Privacy and Terms are Turnkey dealer boilerplate (vehicle quote requests, e-Catalog orders, credit card and social security number, UPS/FedEx shipping, financing pre-qualification); Terms meta description is the Privacy one; typo "Vacation on Wheelsshall". Accessibility text is generic.
- Item detail template leftovers: "Sale Type: New", colour dropdown "Black", "1 Available", "Buy Now", "Stock num -", "Price: Contact for price", a Google Maps API key in the HTML source.
- Insurance Claim meta description starts "et your RV back" (missing "G"). Typos in Services copy: "Rv", "compomising", "we thrive to complete". Services excerpt for Small Leak is cut mid-character ("Don\xe2\x80...") so it renders a replacement character.
- Search-modal "Helpful Links" (on every page) point to a different site ID: New Inventory, Pre-Owned, Parts Request, Service Request, Contact Us at `/page/display/?siteId=1001637&pageId=7736x/7737x`. The two fetched (Parts Request 77360, Service Request 77361) are 404 pages; the other three were blocked/unverified and are almost certainly dead (no inventory of vehicles exists).

Contradictions and structure
- Hours on site: Mon-Sat 9:00AM-5:00PM, Sun Closed (hours modal and Map & Hours page agree). JSON-LD lists only Sunday 00:00-00:00 (broken). Google's Mon-Fri 9-6 is not corroborated by the site.
- `/Parts/` and `/Service/` (top nav parents) have empty main content; the footer "Parts" goes to `/Parts-Suppliers/` and "Service" to `/Services/`. `/Parts-Suppliers` (no slash) returns 200 duplicate. Only the home page and item detail have an H1; no other page does.
- Facebook/Instagram links in header and footer are `href="#"` and hidden: no social profiles.
- Item canonical URLs (`/items/itemid/ID/Name/`) differ from the URLs the listing pages link to (`/Services/adid/ID/Name-Concord-ON/`, `/Resources/adid/...`); the canonical form was the one blocked.
- Footer "Login" modal posts to `https://equipmentsearch.com/index/login/` (dealer-portal login on a public site).

## Capture log

| Request | Status | Bytes | Saved as |
|---|---|---|---|
| https://www.vacationsonwheels.ca/sitemap.xml | 301 to apex, then 404 on https://vacationsonwheels.ca/sitemap.xml | 248 | not saved |
| https://www.vacationsonwheels.ca/robots.txt | 301 to apex, then 200 | 325 | not saved (content quoted below) |
| https://www.vacationsonwheels.ca/ | 301 to https://vacationsonwheels.ca/ | 237 | - |
| /  (apex) | 200 | 26,437 | raw/index.html |
| /main.xml, /inventory.xml, /parts.xml, /blogs.xml | 200 each | 2284, 2176, 1783, 655 | raw/_sm_main.xml, _sm_inventory.xml, _sm_parts.xml, _sm_blogs.xml |
| /Home/ | 301 to https://vacationsonwheels.ca/ | 0 | (block page discarded) |
| /Parts/ | 200 | 20820 | raw/Parts.html |
| /Parts-Suppliers/ | 200 | 22061 | raw/Parts-Suppliers.html |
| /Parts-Request/ | 200 | 28715 | raw/Parts-Request.html |
| /Service/ | 200 | 21124 | raw/Service.html |
| /Services/ | 200 | 43851 | raw/Services.html |
| /Warranty-Repair/ | 200 | 25902 | raw/Warranty-Repair.html |
| /Service-Request/ | 200 | 29215 | raw/Service-Request.html |
| /Insurance-Claim/ | 200 | 23975 | raw/Insurance-Claim.html |
| /Resources/ | 200 | 30309 | raw/Resources.html |
| /Pick-up/ | 200 | 25399 | raw/Pick-up.html |
| /About-Us/ | 200 | 24139 | raw/About-Us.html |
| /Map-&-Hours/ | 200 | 23487 | raw/Map-and-Hours.html |
| /Contact-Us/ | 200 | 27750 | raw/Contact-Us.html |
| /Privacy/ | 200 | 29843 | raw/Privacy.html |
| /Terms/ | 200 | 25833 | raw/Terms.html |
| /Accessibility/ | 200 | 24743 | raw/Accessibility.html |
| /Parts-Suppliers | 200 | 22061 | raw/Parts-Suppliers-noslash.html |
| /Services/adid/38456665/Preventative-Maintenance-Inspection-Repair-Concord-ON/ | 200 | 42907 | raw/Services-adid-38456665.html |
| /page/display/?siteId=1001637&pageId=77360 | 404 | 19042 | raw/page-display-77360.html |
| /page/display/?siteId=1001637&pageId=77361 | 404 | 19042 | raw/page-display-77361.html |
| /page/display/?siteId=1001637&pageId=77365 | 503 | 349 | (block page discarded) |
| /page/display/?siteId=1001637&pageId=77370 | 403 | 339 | (block page discarded) |
| /page/display/?siteId=1001637&pageId=77371 | 403 | 339 | (block page discarded) |
| /items/itemid/38544231/Onan-QG-4000i-Gasoline-RV-Generator-with-30A-breaker/ | 403 | 339 | (block page discarded) |
| /items/itemid/38544232/Onan-QG-4000i-Gasoline-RV-Generator-with-30A-breaker/ | 403 | 339 | (block page discarded) |
| /items/itemid/38544233/Onan-QG-6500-LP-Vapor-RV-Generator-with-30A-breakers/ | 403 | 339 | (block page discarded) |
| /items/itemid/38544234/Onan-QG-7000-Gasoline-RV-Generator-with-30A-breakers/ | 403 | 339 | (block page discarded) |
| /items/itemid/38544235/Onan-QG-5500-RV-Generator-with-30A-Breakers/ | 403 | 339 | (block page discarded) |
| /items/itemid/38544236/Onan-QG-5500-RV-Generator-with-20A-30A-Breakers/ | 403 | 339 | (block page discarded) |
| /items/itemid/38544237/Onan-QD-3200-RV-Diesel-Generator/ | 403 | 339 | (block page discarded) |
| /items/itemid/38544238/Onan-QG-5500-LP-Vapor-RV-Generator-with-30A-breakers/ | 403 | 339 | (block page discarded) |
| /items/itemid/38544239/Onan-QG-4000-Gasoline-RV-Generator-with-30A-breaker/ | 403 | 339 | (block page discarded) |
| /items/itemid/38456657/Appliance-Repair-Replacement/ | 403 | 339 | (block page discarded) |
| /items/itemid/38456658/Awning-Accessory-Repair-Replacement/ | 403 | 339 | (block page discarded) |
| /items/itemid/38456659/Water-System-Services/ | 403 | 339 | (block page discarded) |
| /items/itemid/38456660/Heating-A-C-Services/ | 403 | 339 | (block page discarded) |
| /items/itemid/38456662/Small-Leak-Detection-Repair/ | 403 | 339 | (block page discarded) |
| /items/itemid/38456663/Winterizing-Services/ | 403 | 339 | (block page discarded) |
| /items/itemid/38456664/Annual-RV-Inspection/ | 403 | 339 | (block page discarded) |
| /items/itemid/38456665/Preventative-Maintenance-Inspection-Repair/ | 403 | 339 | (block page discarded) |
| /items/itemid/38456647/How-to-Prepare-Your-RV-for-a-Safe-and-Enjoyable-Road-Trip/ | 403 | 339 | (block page discarded) |
| /items/itemid/38456650/Common-RV-Problems-and-How-Regular-Maintenance-Can-Help-Avoid-Them/ | 403 | 339 | (block page discarded) |

The 5 `/page/display/` rows are links found in the search modal, not sitemap pages. The 3 non-200/404 ones (503, 403, 403) and all 19 item pages returned the firewall block text above (HTTP 403, 339 bytes; one 503).

robots.txt (apex) as returned:

```text
User-agent: *
Allow: /
Crawl-delay: 2

User-agent: Googlebot
Allow: /

User-agent: Facebookexternalhit/1.1
Crawl-delay: 5
Sitemap: https://vacationsonwheels.ca/main.xml
Sitemap: https://vacationsonwheels.ca/inventory.xml
Sitemap: https://vacationsonwheels.ca/parts.xml
Sitemap: https://vacationsonwheels.ca/blogs.xml
```

Sitemap contents: `main.xml` = `/`, `/Home/`, `/Parts/`, `/Parts-Suppliers/`, `/Parts-Request/`, `/Service/`, `/Services/`, `/Warranty-Repair/`, `/Service-Request/`, `/Insurance-Claim/`, `/Resources/`, `/Pick-up/`, `/About-Us/`, `/Map-&-Hours/`, `/Contact-Us/` (15). `inventory.xml` = the 9 Onan generator items. `parts.xml` = the 8 service items. `blogs.xml` = 2 blog posts. Privacy, Terms and Accessibility are not in any sitemap (found in the footer).

## Site-wide boilerplate (recorded once; identical on every page)

- Top bar: "Opening Hours" (opens modal), address link "1841 Hwy 7 Concord, ON L4K 1V4" to `/Map-&-Hours/`, phone 905-738-1253 (`tel:9057381253` on mobile). Facebook and Instagram icons exist but are hidden with `href="#"`.
- Logo: `/site-uploads/1001676/Images/Vacation_Logo.png?raw=1`, alt "Vacations on Wheels" (links to `/`). Favicon `/site-uploads/1001676/Images/faviconV2.png`. Font: Open Sans (Google Fonts). Font Awesome kit, Bootstrap 3 style, Google Tag Manager/gtag IDs G-7L7K0GD6ZD and G-2RCKJC5BFW, reCAPTCHA v3, Google Maps embed.
- Main nav: Home (`/Home/`) | Parts (`/Parts/`: Parts Suppliers `/Parts-Suppliers/`, Parts Request `/Parts-Request/`) | Service (`/Service/`: Services `/Services/`, Service Request `/Service-Request/`, Pick up `/Pick-up/`) | Warranty Repair `/Warranty-Repair/` | Insurance Claim `/Insurance-Claim/` | Resources `/Resources/` | About Us (`/About-Us/`: About Us, Map & Hours `/Map-&-Hours/`) | Contact Us `/Contact-Us/`.
- Breadcrumb: Home > page name.
- Hours modal: Monday to Saturday 9:00AM-5:00PM, Sunday Closed; image `/site-uploads/1001676/Images/image-7.png` (alt "Image 85").
- Search modal: search box plus "Helpful Links": New Inventory, Pre-Owned, Parts Request, Service Request, Contact Us (the `/page/display/` links above), Map & Hours.
- Footer column "Company Info": 905-738-1253; "Vacations on Wheels" 1841 Hwy 7 Concord, ON L4K 1V4.
- Footer column "About Vacation on Wheels": "Vacations on Wheels is backed by years of industry experience, specializing in RV repairs, servicing, and parts. We provide complete support, including insurance claim handling and convenient pickup and delivery of serviced units. Committed to quality and reliability, we ensure your RV is ready for the road---every time."
- Footer "Quick Links": Home `/`, Parts `/Parts-Suppliers/`, Service `/Services/`, Warranty Repair, Insurance Claim, Resources, About Us. Footer "Connect": Parts Request, Service Request, Contact Us.
- Bottom bar: Privacy | Terms | Accessibility | Login (modal posting to equipmentsearch.com); "(c) 2026 Vacations on Wheels. All Rights Reserved"; "Powered by Turnkey Web Solutions" (logo `/site-uploads/1001087/Images/TurnkeyLogo_2021_WH.png`, link turnkeywebsolutions.com).
- Meta keywords (all pages): "Vacations on Wheels, Ontario RV & Trailer Parts, Service, Warranty and Insurance Claims, Concord Ontario 905-738-1253". Title pattern: "<Page> | Vacations on Wheels, Ontario RV & Trailer Parts, Service, Warranty and Insurance Claims, Concord Ontario 905-738-1253".
- JSON-LD: LocalBusiness "Vacations on Wheels Inc.", telephone +19057381253, 1841 Hwy 7 W, Concord, Ontario L4K 1V4, logo `https://equipmentsearch.com/uploadedimages/9341/logo/9341.jpg`, openingHoursSpecification only for Sunday 00:00-00:00.
- Map embed (Map & Hours): Google Maps place "Vacations On Wheels", about 43.8030 N, 79.4883 W.
- Forms on the site (all submit through Turnkey JavaScript with `onsubmit="return false;"`, no `action` attribute in HTML, reCAPTCHA v3, optional "Send a copy to my Email Address" checkbox): Parts Request, Service Request, Pick up, Contact Us, Accessibility Contact Form, item "Request More Info". No form asks for SIN, DOB or banking.


# Page-by-page capture

## Home (/)

- URL: https://vacationsonwheels.ca/
- HTTP status: 200 
- Title: Home | Vacations on Wheels, Ontario RV & Trailer Parts, Service, Warranty and Insurance Claims, Concord Ontario 905-738-1253
- Meta description: Experience the great outdoors with Vacations on Wheels! We offer quality RVs and trailers for safe, memorable journeys across Canada and the USA. Family owned and operated with 100 years of combined experience with sales, service, buy, sell, trade and consign.
- Canonical: https://vacationsonwheels.ca/
- Headings in main content: H1: Welcome to Vacations on Wheels; H2: Suppliers
- H1 elements on whole page: 1

Main body (text of `#CenterDiv`; `[Hn]` marks headings, `<url>` marks link targets):

```text
-

[img: /site-uploads/1001676/Slider/vow.jpg | alt='vow.jpg']
[img: /images/arrows_l.png | alt='Prev arrow'] [img: /images/arrows_r.png | alt='Next arrow']

PartsRequest Now </Parts-Request/> Seasonal MaintenanceBook Now </Services/adid/38456665/Preventative-Maintenance-Inspection-Repair-Concord-ON/> ServiceBook Now </Services/>

[img: /site-uploads/1001676/Images/image-8.png | alt='Parts']Parts... </Parts-Suppliers>

[img: /site-uploads/1001676/Images/Group_2.png | alt='Warranty']Warranty... </Warranty-Repair/>

[img: /site-uploads/1001676/Images/image_1.png | alt='Insurance Claim']Insurance Claim... </Insurance-Claim/>

[img: /site-uploads/1001676/Images/image-7.png | alt='Welcome to Vacations on Wheels']

**[H1]** Welcome to Vacations on Wheels

We’re here to help fellow Canadians enjoy the beautiful landscapes of Canada and the United States of America safely in a serviced and well-maintained Used RV or Trailer.

There is so much wonder and amazement to see and experience our our beautiful continent and we think there’s no better way to see it all than on the road, watching the landscapes change with those you love the most.

At Vacations on Wheels, we’ve been helping Ontario RV & Trailer Enthusisats find peace of mind on each new adventure by providing quality serviced and well-maintained RV’s, Trailers ready to hit the road on a new adventure with you & your family.

Proudly Serving Southern Ontario.

Read more </About-Us/>

**[H2]** Suppliers

- [img: /site-uploads/1001676/Images/image_40.png | alt='Onan']
- [img: /site-uploads/1001676/Images/image-4.png | alt='Winnebaco']
- [img: /site-uploads/1001676/Images/image-5.png | alt='Vntpstag']
- [img: /site-uploads/1001676/Images/image-6.png | alt='Atlas']
- [img: /site-uploads/1001676/Images/image.png | alt='Dutchmen']
- [img: /site-uploads/1001676/Images/image-1.png | alt='Woodlandpark']
- [img: /site-uploads/1001676/Images/image-2.png | alt='Northlander']
- [img: /site-uploads/1001676/Images/image-3.png | alt='Blue OX']
```

## Parts

- URL: https://vacationsonwheels.ca/Parts/
- HTTP status: 200 
- Title: Parts | Vacations on Wheels, Ontario RV & Trailer Parts, Service, Warranty and Insurance Claims, Concord Ontario 905-738-1253
- Meta description: Vacations on Wheels specializes in RV repairs and parts, offering insurance claim support and convenient pickup/delivery. Get your RV ready for the road today!
- Canonical: https://vacationsonwheels.ca/Parts/
- Headings in main content: (none)
- H1 elements on whole page: 0

Main body (text of `#CenterDiv`; `[Hn]` marks headings, `<url>` marks link targets):

```text
(empty: main content area contains no text or images)
```

## Parts Suppliers

- URL: https://vacationsonwheels.ca/Parts-Suppliers/
- HTTP status: 200 
- Title: Parts Suppliers | Vacations on Wheels, Ontario RV & Trailer Parts, Service, Warranty and Insurance Claims, Concord Ontario 905-738-1253
- Meta description: Find the essential parts you need in-store and conveniently order specific or aftermarket components online, ensuring you get exactly what you want.
- Canonical: https://vacationsonwheels.ca/Parts-Suppliers/
- Headings in main content: H3: CATALOG LINK FOR NTP PARTS
- H1 elements on whole page: 0

Main body (text of `#CenterDiv`; `[Hn]` marks headings, `<url>` marks link targets):

```text
[img: /site-uploads/1001676/Images/via-online-site.jpg | alt='Part'] <https://rvflipbook.com/2026-RV-Big-Book/>

**[H3]** CATALOG LINK FOR NTP PARTS
```

## Parts Request

- URL: https://vacationsonwheels.ca/Parts-Request/
- HTTP status: 200 
- Title: Parts Request | Vacations on Wheels, Ontario RV & Trailer Parts, Service, Warranty and Insurance Claims, Concord Ontario 905-738-1253
- Meta description: We carry a range of essential parts in-store and can promptly order specific or aftermarket components online to meet your needs.
- Canonical: https://vacationsonwheels.ca/Parts-Request/
- Headings in main content: H2: Contact Information; H2: Type of Equipment; H2: Parts Needed
- H1 elements on whole page: 0

Main body (text of `#CenterDiv`; `[Hn]` marks headings, `<url>` marks link targets):

```text
**[H2]** Contact Information

First Name

*

Last Name

*

Home Phone

*

Cell Phone

Email

*

Work Phone

Address

City

Postal Code

*

[Province select: see form fields]

**[H2]** Type of Equipment

Year

*

Kms/Hours

Make

*

Vin#

Model

*

**[H2]** Parts Needed

What kind of parts are needed? :

Do you have a part number?:

Send a copy to my Email Address
```

Form fields:

Form `form_6ac4057f6eed3` — method: none declared; `onsubmit="return false;"` (submitted by Turnkey JS, endpoint not visible in HTML); reCAPTCHA v3 widget present; hidden `form_id`/`comp_id` fields

| Label | Control | name | Required | Notes |
|---|---|---|---|---|
| First Name | input:text | firstName | yes |  |
| Last Name | input:text | lastName | yes |  |
| Home Phone | input:text | homePhone | yes |  |
| Cell Phone | input:text | cellPhone | no |  |
| Email | input:text | email | yes |  |
| Work Phone | input:text | work_phone | no |  |
| Address | input:text | address | no |  |
| City | input:text | City | no |  |
| Postal Code | input:text | Postal-code | yes |  |
| Province | select | Province | no | 66 options: Province, Not Applicable, Alberta, British Columbia ... (Canadian provinces/territories then US states) |
| Year | input:text | Year | yes |  |
| Kms/Hours | input:text | Km_Hours | no |  |
| Make | input:text | Make | yes |  |
| Vin# | input:text | Vin | no |  |
| Model | input:text | Model | yes |  |
| What kind of parts are needed? : | textarea | What_Kind | yes |  |
| Do you have a part number?: | textarea | Do_you_have | yes |  |
| Send a copy to my Email Address | input:checkbox | sendCopy | no |  |
| (hidden) | hidden | form_id | - | value 71 |
| (hidden) | hidden | comp_id | - | value 82843 |


## Service

- URL: https://vacationsonwheels.ca/Service/
- HTTP status: 200 
- Title: Service | Vacations on Wheels, Ontario RV & Trailer Parts, Service, Warranty and Insurance Claims, Concord Ontario 905-738-1253
- Meta description: Keep your RV adventure-ready with Vacations on Wheels! We offer expert repair, maintenance, and diagnostics to ensure your vehicle is in top shape for the road.
- Canonical: https://vacationsonwheels.ca/Service/
- Headings in main content: (none)
- H1 elements on whole page: 0

Main body (text of `#CenterDiv`; `[Hn]` marks headings, `<url>` marks link targets):

```text
(empty: main content area contains no text or images)
```

## Services

- URL: https://vacationsonwheels.ca/Services/
- HTTP status: 200 
- Title: Services | Vacations on Wheels, Ontario RV & Trailer Parts, Service, Warranty and Insurance Claims, Concord Ontario 905-738-1253
- Meta description: Keep your RV adventure-ready with Vacations on Wheels! We offer expert repair, maintenance, and diagnostics to ensure your vehicle is in top shape for the road.
- Canonical: https://vacationsonwheels.ca/Services/
- Headings in main content: H4: Order By:; H2: Appliance Repair & Replacement; H2: Awning & Accessory Repair / Replacement; H2: Water System Services; H2: Heating & A/C Services; H2: Small Leak Detection & Repair; H2: Winterizing Services; H2: Annual RV Inspection; H2: Preventative Maintenance Inspection & Repair; H3: “Hold With Deposit' How does it work? Can I get my money back?; H2: Why choose us for your Rv Service needs?; H2: Book your RV Service Today!
- H1 elements on whole page: 0

Main body (text of `#CenterDiv`; `[Hn]` marks headings, `<url>` marks link targets):

```text
At Vacations on Wheels, we specialize in providing High-Quality Repair, maintenance, and diagnostic services for all types of Recreational Vehicles (RVs). Whether you’re planning your next road trip or need urgent repairs, our experienced team is here to ensure your RV is in top condition, ready for your next adventure.

Filters

**[H4]** Order By:

TitleModelOdometerPriceStock NumberYear

highest to lowestlowest to highest

Show 10Show 20Show 30Show 40Show 50Show 60Show 70Show 80Show 90Show 100

Read More

In Stock
[img: https://equipmentsearch.com/uploadedimages/9341/38456657_1_400x0.jpg | alt='Appliance Repair & Replacement'] </Services/adid/38456657/Appliance-Repair-Replacement-Concord-ON/>

**[H2]** Appliance Repair & Replacement

**[H2]** Appliance Repair & Replacement

,

Stock No.:

Appliance Repair & Replacement We repair and replace essential RV appliances including fridges, stoves, A/C units, furnaces, hot water heaters, and microwaves. Whether you're troubleshooting a broken appliance or upgrading to a new ...

View Details </Services/adid/38456657/Appliance-Repair-Replacement-Concord-ON/>

Read More

In Stock
[img: https://equipmentsearch.com/uploadedimages/9341/38456658_1_400x0.jpg | alt='Awning & Accessory Repair / Replacement'] </Services/adid/38456658/Awning-Accessory-Repair-Replacement-Concord-ON/>

**[H2]** Awning & Accessory Repair / Replacement

**[H2]** Awning & Accessory Repair / Replacement

,

Stock No.:

Awning & Accessory Repair / Replacement From worn-out awnings to broken accessories, we offer expert repair and replacement using high-quality parts and materials. Get back to enjoying the outdoors with a fully functional, reliable ...

View Details </Services/adid/38456658/Awning-Accessory-Repair-Replacement-Concord-ON/>

Read More

In Stock
[img: https://equipmentsearch.com/uploadedimages/9341/38456659_1_400x0.jpg | alt='Water System Services'] </Services/adid/38456659/Water-System-Services-Concord-ON/>

**[H2]** Water System Services

**[H2]** Water System Services

,

Stock No.:

Water System Services We service fresh water, grey water, and black water systems—covering everything from tank replacements to heater and pipe repairs. A well-maintained water system is crucial for your comfort and hygiene while on t...

View Details </Services/adid/38456659/Water-System-Services-Concord-ON/>

Read More

In Stock
[img: https://equipmentsearch.com/uploadedimages/9341/38456660_1_400x0.jpg | alt='Heating & A/C Services'] </Services/adid/38456660/Heating-A-C-Services-Concord-ON/>

**[H2]** Heating & A/C Services

**[H2]** Heating & A/C Services

,

Stock No.:

Heating & A/C Services Stay comfortable year-round with our RV heating and air conditioning services. We repair and replace A/C units, furnaces, and offer protective solutions like A/C covers and roof covers to extend the life of yo...

View Details </Services/adid/38456660/Heating-A-C-Services-Concord-ON/>

Read More

In Stock
[img: https://equipmentsearch.com/uploadedimages/9341/38456662_1_400x0.jpg | alt='Small Leak Detection & Repair'] </Services/adid/38456662/Small-Leak-Detection-Repair-Concord-ON/>

**[H2]** Small Leak Detection & Repair

**[H2]** Small Leak Detection & Repair

,

Stock No.:

Small Leak Detection & Repair Even minor water leaks can cause major damage over time—leading to mold, rot, and costly repairs. Our team will find and fix small leaks, reseal vulnerable areas, and help prevent future issues. Don�...

View Details </Services/adid/38456662/Small-Leak-Detection-Repair-Concord-ON/>

Read More

In Stock
[img: https://equipmentsearch.com/uploadedimages/9341/38456663_1_400x0.jpg | alt='Winterizing Services'] </Services/adid/38456663/Winterizing-Services-Concord-ON/>

**[H2]** Winterizing Services

**[H2]** Winterizing Services

,

Stock No.:

Winterizing Services Before the snow falls, protect your RV with professional winterizing. We'll drain lines, treat water systems, and prep your RV to withstand the cold so it's ready to go when spring rolls around. ...

View Details </Services/adid/38456663/Winterizing-Services-Concord-ON/>

Read More

In Stock
[img: https://equipmentsearch.com/uploadedimages/9341/38456664_1_400x0.jpg | alt='Annual RV Inspection'] </Services/adid/38456664/Annual-RV-Inspection-Concord-ON/>

**[H2]** Annual RV Inspection

**[H2]** Annual RV Inspection

,

Stock No.:

Annual RV Inspection Required in many provinces and states, annual inspections ensure your RV remains safe and roadworthy. Our thorough inspections cover brakes, tires, lights, electrical systems, plumbing, and more—keeping you compli...

View Details </Services/adid/38456664/Annual-RV-Inspection-Concord-ON/>

Read More

In Stock
[img: https://equipmentsearch.com/uploadedimages/9341/38456665_2_400x0.jpg | alt='Preventative Maintenance Inspection & Repair'] </Services/adid/38456665/Preventative-Maintenance-Inspection-Repair-Concord-ON/>

**[H2]** Preventative Maintenance Inspection & Repair

**[H2]** Preventative Maintenance Inspection & Repair

,

Stock No.:

Preventative Maintenance Inspection & Repair Avoid costly repairs with regular preventative maintenance. We inspect and service: Roofs (including resealing) Slide-out seals Window gaskets Caulking and sealing Tires, axles...

View Details </Services/adid/38456665/Preventative-Maintenance-Inspection-Repair-Concord-ON/>

**[H3]** “Hold With Deposit' How does it work? Can I get my money back?

If you're interested in something, we recommend you put a Deposit on it to Hold it. Holds require a refundable deposit which is an authorization on your credit card. If you change your mind, we'll return your money. Please note, in order to make things fair, No Shows or Contact result in no refund. After you place a hold, we will contact you to confirm your interest. At that time, you can schedule an appointment and finalize your commitment. If you don't like what you see, you are NOT COMMITTED to purchase.

Close

**[H2]** Why choose us for your Rv Service needs?

Experienced Technicians: Our certified technicians have years of experience working with all makes and models of RVs.

State-Of-The-Art equipment: We use the latest tools and equipment to ensure your RV is serviced to the highest standards.

Comprehensive Services: Whether you need routine maintenance or major repairs, we offer a full range of services to meet your needs.

Affordable & Transparent pricing: We provide competitive pricing with no hidden fees. You’ll know exactly what to expect before we begin the work.

Fast Turnaround times: We understand that your time is valuable, so we thrive to complete repairs and maintenance efficiently without compomising quality.

**[H2]** Book your RV Service Today!

Your Rv is your home on the road - keep it in excellent condition with our reliable service and maintenance. Contact us today to schedule an appointment or drop by for an inspection. We’ll help ensure your RV is always ready for the next adventure!

Book Now </Contact-Us/>
```

## Warranty Repair

- URL: https://vacationsonwheels.ca/Warranty-Repair/
- HTTP status: 200 
- Title: Warranty Repair | Vacations on Wheels, Ontario RV & Trailer Parts, Service, Warranty and Insurance Claims, Concord Ontario 905-738-1253
- Meta description: Protect your investment with our comprehensive warranty coverage for trailers and commercial vehicles. Enjoy peace of mind while towing for work or play.
- Canonical: https://vacationsonwheels.ca/Warranty-Repair/
- Headings in main content: H2: WARRANTY COVERAGE; H2: GLOBAL WARRANTY; H3: MOTORIZED; H3: NON-MOTORIZED; H2: VACATIONS ON WHEELS WARRANTY; H3: Vacations on Wheels -- Warranty Coverage Options; H3: Platinum Cargo / Utility Trailer Coverage; H3: Gold Cargo / Utility Trailer Coverage (Includes Items 1--5); H4: 1. Brake Systems; H4: 2. Suspension; H4: 3. Frame; H4: 4. Lift Crank System / Tilt Mechanism / Jacks; H4: 5. Electrical System (Factory Installed: 12V / 110V / 220V); H4: 6. Commercial Use Vehicle Coverage (Optional); H2: Tire & Wheel Protection Plan; H4: 1. Flat Tire Repair; H4: 2. Tire Replacement; H4: 3. Wheel Repair / Replacement; H4: 4. Mounting & Balancing; H3: Questions? Ready to Protect Your Trailer?
- H1 elements on whole page: 0

Main body (text of `#CenterDiv`; `[Hn]` marks headings, `<url>` marks link targets):

```text
**[H2]** WARRANTY COVERAGE

We work with most major warranty providers, offering coverage for motorized, non-motorized trailers and commercial use vehicles.

**[H2]** GLOBAL WARRANTY

https://www.globalwarranty.com/ <https://www.globalwarranty.com/>

**[H3]** MOTORIZED

https://assets.globalwarranty.com/media/global-warranty-motorized.pdf <https://assets.globalwarranty.com/media/global-warranty-motorized.pdf>

**[H3]** NON-MOTORIZED

https://assets.globalwarranty.com/media/global-warranty-non-motorized.pdf <https://assets.globalwarranty.com/media/global-warranty-non-motorized.pdf>

**[H2]** VACATIONS ON WHEELS WARRANTY

**[H3]** Vacations on Wheels -- Warranty Coverage Options

We offer comprehensive warranty coverage for Platinum or Gold Cargo/Utility Trailers, Commercial Use Vehicles, and Tire & Wheel Protection Plans. Our goal is to give you peace of mind whether you're towing for work or play.

**[H3]** Platinum Cargo / Utility Trailer Coverage

Enjoy full protection on key mechanical and structural components of your cargo or utility trailer, including:

- Brake System Components -- Electric and hydraulic systems
- Suspension Components
- Frame Components
- Lift Crank System & Jack Components
- Electrical Components
- Ramp, Door, and Window Components
- Converter / Battery Charger Components
- Awning Components -- Manual and electric
- Hydraulic Hoist Components
- Roll-Up Canopy Components
- Marine Trailer Components
- Winch Components -- Manual and electric

**[H3]** Gold Cargo / Utility Trailer Coverage (Includes Items 1--5)

This plan covers essential systems and offers optional commercial use coverage.

**[H4]** 1. Brake Systems

- Backing plates, assemblies, controllers
- Brake lines, hoses, fittings, switches, and magnets
- Calipers, drums, actuators (electrical and hydraulic)
- Master cylinders, solenoid kits, and wiring harnesses

**[H4]** 2. Suspension

- Spindle/hub assemblies and bearings
- Axle/beam assemblies, hanger brackets, leaf springs
- Torsion axles, sliders, and rubberized components

**[H4]** 3. Frame

- Frame mounts, bushings
- Tongue latch assembly and bolt-on trailer tongues

**[H4]** 4. Lift Crank System / Tilt Mechanism / Jacks

- Drop leg posts, jack handles, thrust bearings
- Jack/swivel mechanisms, wheels, and mounting brackets

**[H4]** 5. Electrical System (Factory Installed: 12V / 110V / 220V)

- Interior and exterior lights, power cables
- Switches, outlets, and wiring harnesses

**[H4]** 6. Commercial Use Vehicle Coverage (Optional)

Coverage for mechanical failures on vehicles used for commercial or industrial purposes.

**[H2]** Tire & Wheel Protection Plan

Keep your trailer rolling smoothly with added protection for tires and wheels against road hazards.

**[H4]** 1. Flat Tire Repair

- Reimbursement up to $200 per occurrence for flat tire repair due to road hazards while operating your vehicle legally.

**[H4]** 2. Tire Replacement

- Coverage for replacement of unrepairable tires damaged by a road hazard.
- Replacement provided with a tire of like kind and quality (may include a pro rata adjustment).
- Maximum benefit: $2,000 aggregate for all regular and snow tires.

**[H4]** 3. Wheel Repair / Replacement

- Reimbursement for reasonable repair or replacement costs of wheels damaged due to road hazards.
- Coverage includes bent wheels that prevent proper tire sealing.
- Maximum of 4 wheel replacements for the term of the agreement.

**[H4]** 4. Mounting & Balancing

- Reimbursement for mounting, balancing, valve stems, and tire disposal for tires replaced under this plan.
- Note: Shop supply charges are not covered.

**[H3]** Questions? Ready to Protect Your Trailer?

Contact Vacations on Wheels today to learn more about our warranty options, or to enroll in a plan that keeps you covered---on and off the road.
```

## Service Request

- URL: https://vacationsonwheels.ca/Service-Request/
- HTTP status: 200 
- Title: Service Request | Vacations on Wheels, Ontario RV & Trailer Parts, Service, Warranty and Insurance Claims, Concord Ontario 905-738-1253
- Meta description: Keep your RV adventure-ready with Vacations on Wheels! We offer expert repair, maintenance, and diagnostics to ensure your vehicle is in top shape for the road.
- Canonical: https://vacationsonwheels.ca/Service-Request/
- Headings in main content: H2: Contact Information; H2: What needs to be serviced?; H2: Describe Service Needs; H2: Prior Service History
- H1 elements on whole page: 0

Main body (text of `#CenterDiv`; `[Hn]` marks headings, `<url>` marks link targets):

```text
**[H2]** Contact Information

First Name

*

Last Name

Contact Phone Number

*

Email Address

*

Street Address

*

City

*

Postal Code

[Province select: see form fields]
*

**[H2]** What needs to be serviced?

Make

*

Year

*

Model

*

Vin#

Kms/Hours

**[H2]** Describe Service Needs

What Kind of service do you need done?

When would you like your appointment?

**[H2]** Prior Service History

Have we serviced your equipment before?
Have we serviced your equipment before?YesNo

Last In

Work Done

Send a copy to my Email Address
```

Form fields:

Form `form_6ac4058e8db07` — method: none declared; `onsubmit="return false;"` (submitted by Turnkey JS, endpoint not visible in HTML); reCAPTCHA v3 widget present; hidden `form_id`/`comp_id` fields

| Label | Control | name | Required | Notes |
|---|---|---|---|---|
| First Name | input:text | firstname | yes |  |
| Last Name | input:text | lastname | no |  |
| Contact Phone Number | input:text | cellPhone | yes |  |
| Email Address | input:text | email | yes |  |
| Street Address | input:text | address | yes |  |
| City | input:text | City | yes |  |
| Postal Code | input:text | Postalcode | no |  |
| Province | select | Province | yes | 66 options: Province, Not Applicable, Alberta, British Columbia ... (Canadian provinces/territories then US states) |
| Make | input:text | Make | yes |  |
| Year | input:text | Year | yes |  |
| Model | input:text | Model | yes |  |
| Vin# | input:text | Vin | no |  |
| Kms/Hours | input:text | KmHours | no |  |
| What Kind of service do you need done? | input:text | What-Kind | no |  |
| When would you like your appointment? | input:text | When-would | no |  |
| Have we serviced your equipment before? | select | serviced- | no | 3 options: Have we serviced your equipment before?, Yes, No |
| Last In | input:text | Last-In | no |  |
| Work Done | input:text | Work-Done | no |  |
| Send a copy to my Email Address | input:checkbox | sendCopy | no |  |
| (hidden) | hidden | form_id | - | value 70 |
| (hidden) | hidden | comp_id | - | value 82847 |


## Insurance Claim

- URL: https://vacationsonwheels.ca/Insurance-Claim/
- HTTP status: 200 
- Title: Insurance Claim | Vacations on Wheels, Ontario RV & Trailer Parts, Service, Warranty and Insurance Claims, Concord Ontario 905-738-1253
- Meta description: et your RV back on the road with ease! Vacations on Wheels offers expert insurance claims support to handle RV damage quickly and hassle-free.
- Canonical: https://vacationsonwheels.ca/Insurance-Claim/
- Headings in main content: H2: 🛠️ Insurance Claims Assistance; H3: Making the Repair Process Smooth & Stress-Free; H3: ✔️ We Work with All Major Insurance Companies; H3: 🔍 Full-Service Assessment & Estimates; H3: 🧾 What We Handle:; H3: 🚐 Hassle-Free Repair Process; H3: 🕒 Fast Turnaround Times; H3: 📞 Start Your Claim With Us
- H1 elements on whole page: 0

Main body (text of `#CenterDiv`; `[Hn]` marks headings, `<url>` marks link targets):

```text
**[H2]** 🛠️ Insurance Claims Assistance

**[H3]** Making the Repair Process Smooth & Stress-Free

At Vacations on Wheels, we understand that dealing with RV damage can be overwhelming---especially when it involves an insurance claim. That's why we offer comprehensive insurance claims support to help get your RV back on the road quickly and without hassle.

**[H3]** ✔️ We Work with All Major Insurance Companies

We have experience working with a wide range of insurance providers and are happy to coordinate with your adjuster to streamline the process. Whether it's storm damage, collision, fire, or vandalism, we'll work directly with your insurer to ensure fair and prompt handling of your claim.

**[H3]** 🔍 Full-Service Assessment & Estimates

Our trained technicians will perform a thorough inspection of the damage and provide a detailed, professional repair estimate---complete with photos, part lists, and documentation required by your insurance provider. We advocate on your behalf to ensure all necessary repairs are covered.

**[H3]** 🧾 What We Handle:

- Storm, hail, or water damage
- Collision & structural repairs
- Fire or smoke damage
- Roof & siding repairs
- Interior restoration
- Awning & window replacement
- Electrical & plumbing system repairs
- Appliance and accessory replacements

**[H3]** 🚐 Hassle-Free Repair Process

Once your claim is approved, we'll take care of everything from parts ordering to final quality checks. We use OEM or high-quality replacement parts and guarantee all our workmanship---so you can drive away with confidence.

**[H3]** 🕒 Fast Turnaround Times

We know how important your RV is to your lifestyle. That's why we prioritize insurance claims and work efficiently to minimize downtime. You'll be kept informed throughout the entire process so there are no surprises.

**[H3]** 📞 Start Your Claim With Us

Need help with an insurance claim? Call us or book an appointment online and we'll guide you every step of the way---from the first call to the final repair.

Your RV deserves expert care---especially when it matters most. Let Vacations on Wheels take the stress out of the insurance process.
```

## Resources

- URL: https://vacationsonwheels.ca/Resources/
- HTTP status: 200 
- Title: Resources | Vacations on Wheels, Ontario RV & Trailer Parts, Service, Warranty and Insurance Claims, Concord Ontario 905-738-1253
- Meta description: There’s nothing like the freedom of the open road in your RV—but preparation is key to keeping the adventure stress-free. Whether you're heading out for a weekend getaway or a cross-country expedition, here’s how to get your RV rea...
- Canonical: https://vacationsonwheels.ca/Resources/
- Headings in main content: H4: Order By:; H2: How to Prepare Your RV for a Safe and Enjoyable Road Trip; H2: Common RV Problems and How Regular Maintenance Can Help Avoid Them; H3: “Hold With Deposit' How does it work? Can I get my money back?; H3: 
- H1 elements on whole page: 0

Main body (text of `#CenterDiv`; `[Hn]` marks headings, `<url>` marks link targets):

```text
Filters

**[H4]** Order By:

TitleModelOdometerPriceStock NumberYear

highest to lowestlowest to highest

Show 10Show 20Show 30Show 40Show 50Show 60Show 70Show 80Show 90Show 100

Read More

[img: https://equipmentsearch.com/uploadedimages/9341/38456647_1_400x0.jpg | alt='How to Prepare Your RV for a Safe and Enjoyable Road Trip'] </Resources/adid/38456647/How-to-Prepare-Your-RV-for-a-Safe-and-Enjoyable-Road-Trip-Concord-ON/>

**[H2]** How to Prepare Your RV for a Safe and Enjoyable Road Trip

**[H2]** How to Prepare Your RV for a Safe and Enjoyable Road Trip

2025-06-01, Vacations on Wheels

Stock No.:

There’s nothing like the freedom of the open road in your RV—but preparation is key to keeping the adventure stress-free. Whether you're heading out for a weekend getaway or a cross-country expedition, here’s how to get your RV rea...

View Details </Resources/adid/38456647/How-to-Prepare-Your-RV-for-a-Safe-and-Enjoyable-Road-Trip-Concord-ON/>

Read More

[img: https://equipmentsearch.com/uploadedimages/9341/38456650_1_400x0.jpg | alt='Common RV Problems and How Regular Maintenance Can Help Avoid Them'] </Resources/adid/38456650/Common-RV-Problems-and-How-Regular-Maintenance-Can-Help-Avoid-Them-Concord-ON/>

**[H2]** Common RV Problems and How Regular Maintenance Can Help Avoid Them

**[H2]** Common RV Problems and How Regular Maintenance Can Help Avoid Them

2025-06-01, Vacations on Wheels

Stock No.:

RVs are built for adventure, but like any vehicle, they need regular care to stay in top shape. Here are the most common RV problems—and how ongoing maintenance can save you time, money, and frustration. 1. Roof Leaks Problem: Smal...

View Details </Resources/adid/38456650/Common-RV-Problems-and-How-Regular-Maintenance-Can-Help-Avoid-Them-Concord-ON/>

**[H3]** “Hold With Deposit' How does it work? Can I get my money back?

If you're interested in something, we recommend you put a Deposit on it to Hold it. Holds require a refundable deposit which is an authorization on your credit card. If you change your mind, we'll return your money. Please note, in order to make things fair, No Shows or Contact result in no refund. After you place a hold, we will contact you to confirm your interest. At that time, you can schedule an appointment and finalize your commitment. If you don't like what you see, you are NOT COMMITTED to purchase.

Close

**[H3]**
```

## Pick up

- URL: https://vacationsonwheels.ca/Pick-up/
- HTTP status: 200 
- Title: Pick up | Vacations on Wheels, Ontario RV & Trailer Parts, Service, Warranty and Insurance Claims, Concord Ontario 905-738-1253
- Meta description: Schedule a convenient pick-up for your RV or trailer service today! Fill out our form, and our team will confirm the details for you
- Canonical: https://vacationsonwheels.ca/Pick-up/
- Headings in main content: H2: Need Your Trailer Picked Up for Service? We’ve Got You Covered.
- H1 elements on whole page: 0

Main body (text of `#CenterDiv`; `[Hn]` marks headings, `<url>` marks link targets):

```text
**[H2]** Need Your Trailer Picked Up for Service? We’ve Got You Covered.

Fill out the form below to schedule a convenient pick-up for your RV or trailer. A team member will contact you to confirm the details.

Contact Information
Full Name*

Phone Number*

Email Address*

Trailer Details
Trailer Year, Make & Model*

Type of Trailer*

-- Select Type --Travel TrailerFifth WheelMotorhomeTent TrailerOther

License Plate Number

VIN

Pick-Up Location
Street Address*

City*

Postal Code*

Gate or Access Code

Preferred Pick-Up Date
Select Date

Preferred Time Window

-- Select Time --MorningAfternoonEvening

⚠️ Additional Notes or Special Instructions

✅ Terms & Acknowledgement
I acknowledge that this is a request only and a team member will confirm pick-up details.

I agree to the service terms and any applicable pick-up fees.

Schedule My Pick-Up

Send a copy to my Email Address
```

Form fields:

Form `form_6ac40599d5377` — method: none declared; `onsubmit="return false;"` (submitted by Turnkey JS, endpoint not visible in HTML); reCAPTCHA v3 widget present; hidden `form_id`/`comp_id` fields

| Label | Control | name | Required | Notes |
|---|---|---|---|---|
| Full Name | input:text | Name | yes |  |
| Phone Number | input:tel | phone | yes |  |
| Email Address | input:email | email | yes |  |
| Trailer Year, Make & Model | input:text | trailerDetails | yes |  |
| Type of Trailer | select | trailerType | yes | 6 options: -- Select Type --, Travel Trailer, Fifth Wheel, Motorhome, Tent Trailer, Other |
| License Plate Number | input:text | plate | no |  |
| VIN | input:text | vin | no |  |
| Street Address | input:text | address | yes |  |
| City | input:text | city | yes |  |
| Postal Code | input:text | postal | yes |  |
| Gate or Access Code | input:text | gateCode | no |  |
| Select Date | input:date | pickupDate | yes |  |
| Preferred Time Window | select | pickupTime | yes | 4 options: -- Select Time --, Morning, Afternoon, Evening |
| Additional Notes or Special Instructions | textarea | notes | no |  |
| I acknowledge that this is a request only and a team member will confirm pick-up details. | input:checkbox | acknowledgement | yes |  |
| I agree to the service terms and any applicable pick-up fees. | input:checkbox | agreeTerms | yes |  |
| Send a copy to my Email Address | input:checkbox | sendCopy | no |  |
| (hidden) | hidden | form_id | - | value 387 |
| (hidden) | hidden | comp_id | - | value 83635 |


## About Us

- URL: https://vacationsonwheels.ca/About-Us/
- HTTP status: 200 
- Title: About Us | Vacations on Wheels, Ontario RV & Trailer Parts, Service, Warranty and Insurance Claims, Concord Ontario 905-738-1253
- Meta description: Discover the freedom of the open road with Vacations on Wheels. Trust our family-owned business for expert RV solutions and a customer-first experience.
- Canonical: https://vacationsonwheels.ca/About-Us/
- Headings in main content: H3: Welcome to Vacations on Wheels; H3: Our Mission; H3: What We Do; H3: Why Choose Us; H3: Get in Touch
- H1 elements on whole page: 0

Main body (text of `#CenterDiv`; `[Hn]` marks headings, `<url>` marks link targets):

```text
**[H3]** Welcome to Vacations on Wheels

Over the years, Vacations on Wheels has been the trusted partner of RV enthusiasts everywhere. Born from a passion for adventure and a dedication to quality, our family-owned business combines deep industry knowledge with a customer-first philosophy—so you can focus on the open road, while we handle everything else.

**[H3]** Our Mission

To empower RV owners with worry-free experiences by delivering exceptional repair service, premium parts, and seamless logistics—backed by the integrity and expertise of a team that truly loves what they do.

**[H3]** What We Do

- Comprehensive RV Repairs & Servicing

From engine diagnostics to slide-out maintenance, our certified technicians cover every system under one roof.

- Premium Parts & Accessories

We carry a range of essential parts in-store and can promptly order specific or aftermarket components online to meet your needs.

- Insurance Claim Support

We work directly with all major insurance companies to simplify estimates, paperwork —getting you back on the road without a headache.

- Pickup & Delivery

Whether you’re across town or across the province, our insured transport fleet makes getting your RV to us—and back to you—totally hassle-free.

**[H3]** Why Choose Us

- Decades of Expertise

Our team brings years of combined RV industry experience—from sales and field service to extended insurance coverage.

- End-to-End Convenience

One call handles it all: diagnostics, parts ordering, insurance liaison, and logistics.

- Quality & Transparency

Fair, upfront pricing and detailed service reports mean you always know what we’re doing and why.

- Customer Satisfaction

4.3/5 ★ average on independent review sites, with thousands of happy RV owners recommending us to friends and family.

**[H3]** Get in Touch

Ready to experience the Vacations on Wheels difference?

- Call us: 905-738-1253
- Email: vacationsonwheel@gmail.com
- Visit: 1841 Hwy 7 Concord, L4K 1V4

Vacations on Wheels – Keeping your home on wheels in top condition, so you can turn every trip into a lasting memory.
```

## Map & Hours

- URL: https://vacationsonwheels.ca/Map-&-Hours/
- HTTP status: 200 
- Title: Map & Hours | Vacations on Wheels, Ontario RV & Trailer Parts, Service, Warranty and Insurance Claims, Concord Ontario 905-738-1253
- Meta description: At Vacations on Wheels, we specialize in RV servicing and repairs. Enjoy quality support, including insurance claims and convenient pickup and delivery services.
- Canonical: https://vacationsonwheels.ca/Map-&-Hours/
- Headings in main content: H3: Store Hours; H3: Store Location; H3: Find Us
- H1 elements on whole page: 0

Main body (text of `#CenterDiv`; `[Hn]` marks headings, `<url>` marks link targets):

```text
**[H3]** Store Hours

- Monday9:00AM–5:00PM
- Tuesday9:00AM–5:00PM
- Wednesday9:00AM–5:00PM
- Thursday9:00AM–5:00PM
- Friday9:00AM–5:00PM
- Saturday9:00AM–5:00PM
- SundayClosed

**[H3]** Store Location

- Vacation on Wheels
- 1841 Hwy 7 Concord,

ON L4K 1V4

- Phone: 905-738-1253 <tel:905-738-1253>
- Contact Us </Contact-Us/>

**[H3]** Find Us
```

## Contact Us

- URL: https://vacationsonwheels.ca/Contact-Us/
- HTTP status: 200 
- Title: Contact Us | Vacations on Wheels, Ontario RV & Trailer Parts, Service, Warranty and Insurance Claims, Concord Ontario 905-738-1253
- Meta description: Experience the open road with Vacations on Wheels! We’re a family-owned RV service dedicated to quality and customer care, ensuring your adventures are hassle-free.
- Canonical: https://vacationsonwheels.ca/Contact-Us/
- Headings in main content: (none)
- H1 elements on whole page: 0

Main body (text of `#CenterDiv`; `[Hn]` marks headings, `<url>` marks link targets):

```text
Subject

Message

First Name

*

Last Name

*

Email

*

Phone

*

Day Phone

Fax

Cell Phone

Preferred Contact
Preferred ContactEmailHome PhoneDay PhoneCell PhoneFax

Address

City

*

[Province select: see form fields]
*

Send a copy to my Email Address
```

Form fields:

Form `form_6ac405a51ae9b` — method: none declared; `onsubmit="return false;"` (submitted by Turnkey JS, endpoint not visible in HTML); reCAPTCHA v3 widget present; hidden `form_id`/`comp_id` fields

| Label | Control | name | Required | Notes |
|---|---|---|---|---|
| Subject | input:text | subject | no |  |
| Message | textarea | Message | no |  |
| First Name | input:text | firstName | yes |  |
| Last Name | input:text | lastName | yes |  |
| Email | input:text | email | yes |  |
| Phone | input:text | phone | yes |  |
| Day Phone | input:text | dayPhone | no |  |
| Fax | input:text | Fax | no |  |
| Cell Phone | input:text | cellPhone | no |  |
| Preferred Contact | select | ratepurchase | no | 6 options: Preferred Contact, Email, Home Phone, Day Phone, Cell Phone, Fax |
| Address | input:text | address | no |  |
| City | input:text | City | yes |  |
| Province | select | Province | yes | 66 options: Province, Not Applicable, Alberta, British Columbia ... (Canadian provinces/territories then US states) |
| Send a copy to my Email Address | input:checkbox | sendCopy | no |  |
| (hidden) | hidden | form_id | - | value 41 |
| (hidden) | hidden | comp_id | - | value 82849 |


## Privacy

- URL: https://vacationsonwheels.ca/Privacy/
- HTTP status: 200 
- Title: Privacy | Vacations on Wheels, Ontario RV & Trailer Parts, Service, Warranty and Insurance Claims, Concord Ontario 905-738-1253
- Meta description: Discover how Vacation on Wheels safeguards your information. We prioritize your privacy and never share your data without your consent. Learn more today!
- Canonical: https://vacationsonwheels.ca/Privacy/
- Headings in main content: H3: INFORMATION COLLECTION AND USE:; H3: VEHICLE QUOTE REQUESTS:; H3: ORDERS:; H3: COOKIES:; H3: LOG FILES:; H3: SHARING:; H3: LINKS:; H3: SURVEY AND CONTESTS:; H3: NOTIFICATION OF CHANGES:; H3: SECURITY:; H3: SUPPLEMENTATION OF INFORMATION:; H3: SITE AND SERVICE UPDATES:; H3: CORRECTING / UPDATING PERSONAL INFORMATION:; H3: Accessibility Policy
- H1 elements on whole page: 0

Main body (text of `#CenterDiv`; `[Hn]` marks headings, `<url>` marks link targets):

```text
**[H3]** INFORMATION COLLECTION AND USE:

Turnkey Web Solutions is the sole owner of the information collected on this site. Turnkey Web Solutions and Vacation on Wheels will not sell, share, or rent this information to others in ways different from what is disclosed in this statement. Turnkey Web Solutions Service collect information from our users at several different points on the web site.

**[H3]** VEHICLE QUOTE REQUESTS:

In order to obtain a vehicle price quote, a user must first complete a Quote Request Form. A user is required to give their contact information (such as name, address, telephone number and e-mail address). This information is used to contact the user and provide the quote or other information that they have requested. It is optional for the user to provide financial information, but can be done so that Vacation on Wheels can review and pre-qualify the user for financing if they are interested. All customer information obtained via the quote request form is encrypted for security purposes and stored on a secured server.

**[H3]** ORDERS:

Information is requested from the user on the e-Catalog order form. Here a user must provide contact information (like name and shipping address) and financial information (like credit card number, expiration date). This information is used for billing purposes and to fill customer's orders. If Vacation on Wheels has trouble processing an order, this contact information is used to get in touch with the user. All customer information obtained via the order form is encrypted for security purposes and stored on a secured server.

**[H3]** COOKIES:

A cookie is a piece of data stored on the user's hard drive containing information about the user. Usage of a cookie is in no way linked to any personally identifiable information while on our site. Once the user closes their browser, the cookie simply terminates. For example, a cookie is used to store items during e-Catalog shopping so that a list of what you are ordering is maintained. If a user rejects the cookie, they may still use the site. The only drawback to this is that the user will be limited in some areas of our site. For example, the user, may not be able to use the e-Catalog shopping basket function on the site. Cookies can also enable us to track and target the interests of our users to enhance the experience on the site.

**[H3]** LOG FILES:

We use IP addresses to analyze trends, administer the site, track user's movement, and gather broad demographic and geographic information for aggregate use. IP addresses are not linked to personally identifiable information.

**[H3]** SHARING:

We may share demographic information with our partners and advertisers. This is generally not linked to any personal information that can identify any individual person. However, Turnkey Web Solutions and/or Vacation on Wheels may send E-mails or mail about special offers at the Dealership or other offers or information that may be of interest to the user based on the information we collect. Vacation on Wheels uses an outside company (such as UPS, USPS, Fed Ex. etc.) to ship orders, and a credit card processing company to bill users for goods and services. These companies do not to our knowledge, retain, share, store or use personally identifiable information for any secondary purposes.

We may partner with another party to provide specific services. When the user signs up for these services, we will share names, or other contact information that is necessary for the third party to provide these services. These parties are not allowed to use personally identifiable information except for the purpose of providing these services.

**[H3]** LINKS:

This web site contains links to other sites. Please be aware that , Turnkey Webs Solutions and Vacation on Wheels are not responsible for the privacy practices of such other sites. We encourage our users to read the privacy statements of every web site that collects personally identifiable information. This privacy statement applies solely to information collected by this web site.

**[H3]** SURVEY AND CONTESTS:

From time to time, our site requests information from users via surveys or may offer contests. Participation in these surveys or contests is completely voluntary and the user therefore has a choice whether or not to disclose this information. Information requested may include contact information (such as name and shipping address) and demographic information (such as zip code and age level). Contact information will be used to notify the winners and award prizes. Survey information will be used for purposes of monitoring or improving the use and satisfaction of this site.

**[H3]** NOTIFICATION OF CHANGES:

If we decide to change our privacy policy, we will post those changes here so our users are always aware of what information we collect, how we use it, and under circumstances, if any, we disclose it.

**[H3]** SECURITY:

This web site takes every precaution to protect our users' information. When users submit sensitive information via the web site, their information is protected both online and off-line.

When our quote request or order form asks users to enter sensitive information (such as credit card number and/or social security number), that information is encrypted and is protected with the best encryption software in the industry - SSL. While on a secure page, such as our order form, the lock icon on the bottom of Web browsers such as Netscape Navigator and Microsoft Internet Explorer becomes locked, as opposed to unlocked, or open, when you are just "surfing".

While we use SSL encryption to protect sensitive information online, we also do everything in our power to protect user-information off-line. All of our users' information, not just the sensitive information mentioned above, has restricted access at , Turnkey Web Solutions and at the dealership. Only employees who need the information to perform a specific job (for example, order clerk, sales representative, or a customer service representative) are granted access to personally identifiable information. Access to the information is made via a password-protected site. Each time an employee needs to access information, they must enter their password to gain access to the information. Furthermore, employees are kept up-to-date on our security and privacy practices. Employees are periodically notified and/or reminded about the importance we place on privacy, and what they can do to ensure our customers' information is protected.

**[H3]** SUPPLEMENTATION OF INFORMATION:

In order for this web site to properly fulfill its obligation to our customers, it may be necessary for us to supplement the information we receive with information from third party sources.

For example, to determine if customers qualify for financing, the dealership may use their name and social security number to request a credit report or approval from a lending institution.

**[H3]** SITE AND SERVICE UPDATES:

Turnkey Web Solutions and Vacation on Wheels may send the user site and service announcement updates which contain important information about the service. We communicate with the user to provide requested services and in regard to issues relating to their account via e-mail or phone.

**[H3]** CORRECTING / UPDATING PERSONAL INFORMATION:

If a user's personally identifiable information changes (such as address or E-mail), or if a user no longer desires to receive information from, Turnkey Web Solutions and Vacation on Wheels, we will endeavor to correct, update or remove that user's personal data from our database.

**[H3]** Accessibility Policy

As a business serving the public good, we are committed to providing digital accessibility for people with disabilities. We continue to improve our platform's user experience for everyone while applying relevant accessibility tools and standards.

Our site is built using code that is compliant with W3C standards for HTML and CSS. The site displays correctly in current browsers using standards compliant HTML/CSS code and should continue to display correctly on future browsers.

If you wish to report an accessibility issue, have any questions or need assistance, please call us or contact us.
```

## Terms

- URL: https://vacationsonwheels.ca/Terms/
- HTTP status: 200 
- Title: Terms | Vacations on Wheels, Ontario RV & Trailer Parts, Service, Warranty and Insurance Claims, Concord Ontario 905-738-1253
- Meta description: Discover how Vacation on Wheels safeguards your information. We prioritize your privacy and never share your data without your consent. Learn more today!
- Canonical: https://vacationsonwheels.ca/Terms/
- Headings in main content: H3: Terms & Conditions; H3: LIMITATION OF LIABILITY:; H3: IMAGES, LOGOS, TRADEMARKS & COPYRIGHT:; H3: ACCEPTANCE OF ORDERS:; H3: LINKS TO EXTERNAL SITES:
- H1 elements on whole page: 0

Main body (text of `#CenterDiv`; `[Hn]` marks headings, `<url>` marks link targets):

```text
**[H3]** Terms & Conditions

The information, services, products, and materials contained in this site, including, without limitation, text, graphics, and links, are provided on an "as is" basis with no warranty. To the maximum extent permitted by law, Turnkey Web Solutions and Vacation on Wheels disclaim all representations and warranties, express or implied, with respect to such information, services, products, and materials, including but not limited to warranties of merchantability, fitness for a particular purpose, title, noninfringement, freedom from computer virus, and implied warranties arising from course of dealing or course of performance. In addition, Turnkey Web Solutions and Vacation on Wheels do not represent or warrant that the information accessible via this web site is accurate, complete or current. Price and availability information is subject to change without notice. Due to the large amount of content and information provided, errors can and will occur. By visiting this web site you agreed that Turnkey Web Solutions and Vacation on Wheelsshall be held harmless from all liability and responsibility for any and all errors or omissions in the information provided on this web site. Turnkey Web Solutions nor Vacation on Wheels shall not be required or obligated to honor any price if said price is incorrect or inaccurate, regardless of whether the information was entered by either Turnkey Web Solutions or Vacation on Wheels .

**[H3]** LIMITATION OF LIABILITY:

In no event shall Turnkey Web Solutions or Vacation on Wheels be liable for any direct, indirect, special, punitive, incidental, exemplary or consequential damages, or any damages whatsoever, even if Turnkey Web Solutions or Vacation on Wheels has been previously advised of the possibility of such damages, whether in an action under contract, negligence, or any other theory, arising out of or in connection with the use, inability to use, or performance of the information, services, products, and materials available from this site. These limitations shall apply notwithstanding any failure of essential purpose of any limited remedy. Because some jurisdictions do not allow limitations on how long an implied warranty lasts, or the exclusion or limitation of liability for consequential or incidental damages, the above limitations may not apply to you.

**[H3]** IMAGES, LOGOS, TRADEMARKS & COPYRIGHT:

The images, logos, copy and trademarks contained in this site, including but not limited to the text, images, audio or video, may not be used in any manner, or for any purpose, without Turnkey Web Solutions or Vacation on Wheels express written permission, are believed to be in the public domain or used with permission of the respective trademark or copyright holder. The information and images on this site may not in any way be used in any manner, or for any purpose, without the express written permission, of Turnkey Web Solutions and/or Vacation on Wheels or the official holder of the copyright or trademark. Turnkey Web Solutions is not responsible for the specific content and/or images contained on this site. Please contact Vacation on Wheels if you have questions or concerns about the site content.

**[H3]** ACCEPTANCE OF ORDERS:

The receipt of an e-mail order confirmation does not constitute the acceptance of an order or a confirmation of an offer to sell. Vacation on Wheels reserves the right, without prior notification, to limit the order quantity on any item and/or refuse service to any customer. Verification of information may be required prior to the acceptance of any order. By placing a credit card order, the customer grants the Vacation on Wheels permission to contact their bank to verify name and address.

**[H3]** LINKS TO EXTERNAL SITES:

This site may contain links to other web sites on the Internet that are owned and operated by third party vendors and other third parties (hereafter referred to as "External Sites"). You acknowledge that Turnkey Web Solutions and Vacation on Wheels are not responsible for the availability of, or the content located on or through, any External Site. You should contact the site administrator or Webmaster for those External Sites if you have any concerns regarding such links or the content located on such External Sites.
```

## Accessibility

- URL: https://vacationsonwheels.ca/Accessibility/
- HTTP status: 200 
- Title: Accessibility | Vacations on Wheels, Ontario RV & Trailer Parts, Service, Warranty and Insurance Claims, Concord Ontario 905-738-1253
- Meta description: Discover our commitment to digital accessibility for people with disabilities. We enhance user experience and apply the latest accessibility standards for all.
- Canonical: https://vacationsonwheels.ca/Accessibility/
- Headings in main content: H2: Accessibility Contact Form
- H1 elements on whole page: 0

Main body (text of `#CenterDiv`; `[Hn]` marks headings, `<url>` marks link targets):

```text
As a business serving the public good, we are committed to providing digital accessibility for people with disabilities. We continue to improve our platform's user experience for everyone while applying relevant accessibility tools and standards.

Our site is built using code that is compliant with W3C standards for HTML and CSS. The site displays correctly in current browsers using standards compliant HTML/CSS code and should continue to display correctly on future browsers.

If you wish to report an accessibility issue, have any questions or need assistance, please call us or contact us via the Accessibility Contact Form:

**[H2]** Accessibility Contact Form

Name

*

Email

*

Phone

*

What is the issue you experienced or your suggestion for improvement

Send a copy to my Email Address
```

Form fields:

Form `form_6ac405b05dc6e` — method: none declared; `onsubmit="return false;"` (submitted by Turnkey JS, endpoint not visible in HTML); reCAPTCHA v3 widget present; hidden `form_id`/`comp_id` fields

| Label | Control | name | Required | Notes |
|---|---|---|---|---|
| Name | input:text | Name | yes |  |
| Email | input:text | email | yes |  |
| Phone | input:text | Phone | yes |  |
| What is the issue you experienced or your suggestion for improvement | textarea | Comments | no |  |
| Send a copy to my Email Address | input:checkbox | sendCopy | no |  |
| (hidden) | hidden | form_id | - | value 297 |
| (hidden) | hidden | comp_id | - | value 82861 |


## Service item: Preventative Maintenance Inspection & Repair (as /Services/adid/ detail page)

- URL: https://vacationsonwheels.ca/Services/adid/38456665/Preventative-Maintenance-Inspection-Repair-Concord-ON/
- HTTP status: 200 
- Title: Preventative Maintenance Inspection & Repair | Services | Vacations on Wheels, Ontario RV & Trailer Parts, Service, Warranty and Insurance Claims, Concord Ontario 905-738-1253
- Meta description: Keep your RV adventure-ready with Vacations on Wheels! We offer expert repair, maintenance, and diagnostics to ensure your vehicle is in top shape for the road. Preventative Maintenance Inspection & Repair
- Canonical: https://vacationsonwheels.ca/items/itemid/38456665/Preventative-Maintenance-Inspection-Repair/
- Headings in main content: H1: Preventative Maintenance Inspection & Repair; H3: Preventative Maintenance Inspection & Repair; H3: Contact Information; H4: Vacations on Wheels Inc.; H3: Request More Info; H3: “Hold With Deposit" How does it work? Can I get my money back?; H4: Request More Info; H2: Why choose us for your Rv Service needs?; H2: Book your RV Service Today!
- H1 elements on whole page: 1

Main body (text of `#CenterDiv`; `[Hn]` marks headings, `<url>` marks link targets):

```text
At Vacations on Wheels, we specialize in providing High-Quality Repair, maintenance, and diagnostic services for all types of Recreational Vehicles (RVs). Whether you’re planning your next road trip or need urgent repairs, our experienced team is here to ensure your RV is in top condition, ready for your next adventure.

[img: https://equipmentsearch.com/uploadedimages/9341/38456665_2.jpg | alt='Preventative Maintenance Inspection & Repair']

Back to results

- [img: https://equipmentsearch.com//uploadedimages/9341/38456665_2.jpg | alt='Preventative Maintenance Inspection & Repair']

In Stock

Price:Contact for price

**[H1]** Preventative Maintenance Inspection & Repair

-
ID # 38456665

Price:Contact for price

1 Available

Model

Preventative Maintenance Inspection & Repair

Category Name

Services

Sale Type

New

Request More Info

- Overview <.ad-overview>

Overview <.ad-overview>

**[H3]** Preventative Maintenance Inspection & Repair

Avoid costly repairs with regular preventative maintenance. We inspect and service:

-
Roofs (including resealing)

-
Slide-out seals

-
Window gaskets

-
Caulking and sealing

-
Tires, axles & bearings

-
Brakes

-
Electrical and water systems

-
Appliances

-
Structural integrity

With our detailed inspections and proactive repairs, you can travel with confidence, knowing your RV is in peak condition.

Contact Information <.ad-Contact>

**[H3]** Contact Information

[img: https://equipmentsearch.com/uploadedimages/9341/logo/9341.jpg | alt='Preventative Maintenance Inspection & Repair']

**[H4]** Vacations on Wheels Inc.

1841 Hwy 7 W

Concord Ontario , L4K 1V4

(905) 738-1253

**[H3]** Request More Info

Location <.model-location>

**[H3]** “Hold With Deposit" How does it work? Can I get my money back?

If you're interested in something, we recommend you put a Deposit on it to Hold it. Holds require a refundable deposit which is an authorization on your credit card. If you change your mind, we'll return your money. Please note, in order to make things fair, No Shows or Contact result in no refund. After you place a hold, we will contact you to confirm your interest. At that time, you can schedule an appointment and finalize your commitment. If you don't like what you see, you are NOT COMMITTED to purchase.

Close

×

**[H4]** Request More Info

Location:

Submit

**[H2]** Why choose us for your Rv Service needs?

Experienced Technicians: Our certified technicians have years of experience working with all makes and models of RVs.

State-Of-The-Art equipment: We use the latest tools and equipment to ensure your RV is serviced to the highest standards.

Comprehensive Services: Whether you need routine maintenance or major repairs, we offer a full range of services to meet your needs.

Affordable & Transparent pricing: We provide competitive pricing with no hidden fees. You’ll know exactly what to expect before we begin the work.

Fast Turnaround times: We understand that your time is valuable, so we thrive to complete repairs and maintenance efficiently without compomising quality.

**[H2]** Book your RV Service Today!

Your Rv is your home on the road - keep it in excellent condition with our reliable service and maintenance. Contact us today to schedule an appointment or drop by for an inspection. We’ll help ensure your RV is always ready for the next adventure!

Book Now </Contact-Us/>
```

Form fields:

Form `quote-form` — method: none declared; `onsubmit="return false;"` (submitted by Turnkey JS, endpoint not visible in HTML); reCAPTCHA v3 widget present; hidden `form_id`/`comp_id` fields

| Label | Control | name | Required | Notes |
|---|---|---|---|---|
| First Name | input:text | firstName | yes |  |
| Last Name | input:text | lastName | yes |  |
| Telephone | input:text | phone | yes |  |
| Email | input:text | email | yes |  |
| Comments | textarea | comment | yes |  |
| Location: | input:text | selected_location | no |  |



# Pages NOT captured (firewall 403)

All 19 returned the block page. Names/IDs below come from the sitemaps and the Services/Resources listing pages only; specs, price and photo counts were not captured.

## Onan generator item pages (inventory.xml, 9)

| Item ID | Model (from URL slug) | Specs | Price | Photo count | Status |
|---|---|---|---|---|---|
| 38544231 | Onan QG 4000i Gasoline RV Generator with 30A breaker | not captured | not captured | not captured | 403 |
| 38544232 | Onan QG 4000i Gasoline RV Generator with 30A breaker (same title as 38544231) | not captured | not captured | not captured | 403 |
| 38544233 | Onan QG 6500 LP Vapor RV Generator with 30A breakers | not captured | not captured | not captured | 403 |
| 38544234 | Onan QG 7000 Gasoline RV Generator with 30A breakers | not captured | not captured | not captured | 403 |
| 38544235 | Onan QG 5500 RV Generator with 30A Breakers | not captured | not captured | not captured | 403 |
| 38544236 | Onan QG 5500 RV Generator with 20A/30A Breakers | not captured | not captured | not captured | 403 |
| 38544237 | Onan QD 3200 RV Diesel Generator | not captured | not captured | not captured | 403 |
| 38544238 | Onan QG 5500 LP Vapor RV Generator with 30A breakers | not captured | not captured | not captured | 403 |
| 38544239 | Onan QG 4000 Gasoline RV Generator with 30A breaker | not captured | not captured | not captured | 403 |

URL pattern: `https://vacationsonwheels.ca/items/itemid/<ID>/<slug>/`. The generator items are not linked from any captured page's nav or body (home "Suppliers" strip shows the Onan logo only).

## Service item pages (parts.xml, 8)

URL pattern `https://vacationsonwheels.ca/items/itemid/<ID>/<slug>/` (blocked). The Services listing links them as `/Services/adid/<ID>/<slug>-Concord-ON/`. Excerpts from the Services listing (truncated by the site) are in the Services section above; the full text of item 38456665 is captured above from its `/Services/adid/` URL.

| ID | Title (as listed on /Services/) | Captured |
|---|---|---|
| 38456657 | Appliance Repair & Replacement | excerpt only |
| 38456658 | Awning & Accessory Repair / Replacement | excerpt only |
| 38456659 | Water System Services | excerpt only |
| 38456660 | Heating & A/C Services | excerpt only |
| 38456662 | Small Leak Detection & Repair | excerpt only (ID 38456661 missing from the sequence) |
| 38456663 | Winterizing Services | excerpt only |
| 38456664 | Annual RV Inspection | excerpt only |
| 38456665 | Preventative Maintenance Inspection & Repair | full text |

## Blog posts (blogs.xml, 2)

| ID | Title | Date | Captured |
|---|---|---|---|
| 38456647 | How to Prepare Your RV for a Safe and Enjoyable Road Trip | 2025-06-01 | excerpt only (on /Resources/) |
| 38456650 | Common RV Problems and How Regular Maintenance Can Help Avoid Them | 2025-06-01 | excerpt only (on /Resources/) |

Other URLs not fetched: the three `/page/display/` links (pageId 77365 Contact Us, 77370 New Inventory, 77371 Pre-Owned).

# Index of facts found on the site (for cross-checking)

| Fact | Value | Where |
|---|---|---|
| Phone | 905-738-1253 | every page (also "(905) 738-1253" on item detail) |
| Email | vacationsonwheel@gmail.com | About Us only |
| Address | 1841 Hwy 7 Concord, ON L4K 1V4 (JSON-LD and item contact: 1841 Hwy 7 W) | header, footer, Map & Hours, About Us |
| Hours | Mon-Sat 9:00AM-5:00PM, Sun Closed | hours modal, Map & Hours |
| Legal/trade name | Vacations on Wheels Inc. (JSON-LD, item contact); "Vacation on Wheels" (footer, Map, Terms, Privacy) | |
| Warranty provider | Global Warranty (globalwarranty.com) | Warranty Repair |
| Insurers | none named ("all major insurance companies") | Insurance Claim, About Us |
| Brands/suppliers | Onan, Winnebago, "Vntpstag", Atlas, Dutchmen, Woodland Park, Northlander, Blue Ox; NTP parts catalogue (rvflipbook.com 2026 RV Big Book) | Home, Parts Suppliers |
| Service areas | Southern Ontario; "across the province" | Home, About Us |
| Years/claims | "100 years of combined experience" (home meta), "years of industry experience" (footer), "Decades of Expertise", "4.3/5 average on independent review sites", "thousands of happy RV owners", "insured transport fleet", "certified technicians" | Home meta, footer, About Us, Services |
| Prices | none; warranty benefits $200 flat-tire repair, $2,000 tire aggregate, 4 wheel replacements; service items "Contact for price" | Warranty Repair, item detail |
| Staff names | none | |
| Testimonials | none | |
| Social profiles | none (hidden `#` links) | header/footer |
