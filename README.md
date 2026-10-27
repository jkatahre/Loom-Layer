# Loom & Layer — Premium Curtains & Window Styling Website

A complete, mobile-first website template for Indian curtain showrooms, fabric retailers, interior designers and custom curtain makers. The demo brand is **Loom & Layer**.

Customers can discover designs, compare fabrics and colourways, choose standard sizes or configure made-to-measure curtains, see transparent pair-based pricing and an itemised custom estimate, and send a fully prefilled enquiry on WhatsApp.

The site runs entirely on the frontend with local demo data. All data access goes through one service layer, so a real API can replace it later without rewriting pages.

> **Sample data:** all products, prices, reviews, ratings, addresses and phone numbers are illustrative demonstration content. They are not market data or genuine reviews. Replace them before launch.

---

## 1. Features & routes

| Route | What it does |
| --- | --- |
| `/` | Festival hero carousel (static hero when no promotion is live), coupon strip with live countdown, categories, bestsellers, festival deals, shop by room, fabric families, why choose us, custom-made process, showroom, testimonials, recent work |
| `/catalog` | Search, sort and 14 filter groups, all persisted in the URL; filter chips; result counts; mobile filter drawer with Apply / Reset |
| `/products/:slug` | Gallery, colourway selector, standard-size selector with per-size prices, dimensions diagram, fabric consumption, heading and lining, services, WhatsApp / Call / Enquire / Get Best Price / Buy Now (only with a valid `buy_url`), fabric sample request, custom-size configurator, specs, policies, reviews, related products |
| `/categories` | All 20 categories, grouped by light control, material, heading, pattern and room |
| `/fabrics` | Fabric families plus a swatch library you can browse by material, texture, colour or pattern |
| `/custom-curtains` | Measuring guide, fullness, headings, linings, stitching, lead time, installation, and the guided 5-step quotation |
| `/about` | Showroom story, craftsmanship and service approach |
| `/contact` | Contact details, enquiry form, map, opening hours with open-now status, delivery charges, measurement services, FAQ |
| `/showroom` | Redirects to `/contact` |
| `*` | Custom 404 page |

**Site-wide:**

- Optional credit strip.
- Rotating announcement bar.
- Sticky header with search suggestions and popular searches.
- Mobile menu.
- Footer with address, hours, contact details and categories.
- Mobile Call / WhatsApp / Enquire bar.
- Floating WhatsApp button on desktop.
- One shared enquiry dialog.

## 2. Tech stack

- npm workspaces monorepo
- React 19, TypeScript (strict), Vite 7, React Router 7 (data router)
- Tailwind CSS v4 via `@tailwindcss/vite`, with `@theme` tokens
- Vitest for unit tests
- Express placeholder API in `backend/`
- ImageMagick script to generate the placeholder WebP images
- Vercel deployment with an SPA rewrite

## 3. Folder structure

```text
loom-and-layer/
├── package.json             workspace scripts
├── vercel.json              build + SPA rewrite
├── frontend/
│   ├── index.html           lang="en-IN", SEO + theme colour
│   ├── vite.config.ts       Vite + Tailwind + Vitest config
│   ├── scripts/
│   │   ├── bin.mjs          runs tool binaries directly (see Troubleshooting)
│   │   └── generate-images.ts  renders every placeholder image
│   ├── public/images/{banners,curtains,fabrics,rooms,details,showroom}/
│   └── src/
│       ├── app/             router, theme + hero preload
│       ├── components/      ui/, layout/, home/, product/, shared components
│       ├── config/store.ts  ← the single store configuration file
│       ├── contexts/        EnquiryContext (global enquiry dialog)
│       ├── data/            categories, products, fabricVariants, sizeOptions,
│       │                    variantSizePrices, productImages, reviews
│       ├── hooks/           useAsync, useNow, usePageMeta, useBodyScrollLock
│       ├── layouts/         SiteLayout
│       ├── pages/           one file per route
│       ├── services/        productService, enquiryService
│       ├── types/           product, quote, review, store
│       ├── utils/           currency, units, pricing, promotions, hours,
│       │                    whatsapp, catalogFilters, priceDisplay, labels
│       └── tests/           Vitest suites
└── backend/                 server.js + config/ controllers/ middleware/
                             models/ routes/ services/ utils/
```

## 4. Installation & startup

Requires Node 20.19 or later.

```bash
npm install
npm run dev:frontend     # http://localhost:5173
```

Other scripts (run from the repository root):

| Script | Purpose |
| --- | --- |
| `npm run build` | Typecheck and build to `dist` |
| `npm run preview` | Serve the production build |
| `npm test` | Run the unit tests (units, pricing, discounts, coupons, quote inputs, filters, data integrity, image paths) |
| `npm run typecheck` | TypeScript only |
| `npm run images` | Regenerate missing placeholder images. Add `-- --force` to rebuild all. Requires ImageMagick 7. |
| `npm run dev:backend` | Start the placeholder API on port 4000 (optional) |

To test the error states, add `?demoError=1` to any URL. Every data request will then fail and show its retry UI.

**Troubleshooting:** on Windows, npm's `.cmd` shims break when the project path contains `&` (as in `D:\Loom & Layer`). For that reason the frontend scripts call `node scripts/bin.mjs <tool>`, which runs each tool's JavaScript entry point directly. They work in any path, on any OS.

## 5. Rebranding for a new curtain store

Edit **`frontend/src/config/store.ts`** only. Values marked `// SAMPLE` are placeholders. While the sample WhatsApp number is set, the development console prints a warning and the enquiry form shows a "sample number" notice.

| Setting | Field in `store.ts` |
| --- | --- |
| Store name, tagline | `identity.name`, `identity.tagline` |
| Logo image (text logo when `null`) | `identity.logo` |
| Brand colours (applied as CSS variables at startup) | `identity.colors` |
| Page titles, description, OG image | `identity.seo` |
| Header categories, popular searches, search placeholder | `navigation.*` |
| Template credit strip (`null` hides it) | `credit` |
| Phone, WhatsApp (digits only), email | `contact.phone`, `contact.whatsapp`, `contact.email` |
| WhatsApp message templates | `contact.templates.{general,product,price,custom_quote,fabric_sample,measurement,installation,showroom_visit}` |
| Address, map, hours, highlights, photos | `showroom.*` (`mapsEmbedUrl` enables the embedded map) |
| Delivery areas, fees (0 shows "Free delivery"), ETAs | `delivery.areas`, `delivery.note` |
| Production, customisation, measurement, installation, returns, care, showroom, sample policies | `policies.*` |
| Default price mode, Get Best Price button, GST note and rate, EMI | `pricing.defaultPriceMode`, `pricing.bestPrice`, `pricing.gst`, `pricing.emi` |
| Custom-curtain rate card (allowances, stitching, headings, linings, fullness, services, limits) | `pricing.rateCard` |
| Festival dates, coupon, badge, hero slides (`null` disables) | `festival` |
| Announcements, hero, trust badges, Google rating, rooms, custom section, recent work, Instagram | `home.*` |
| Contact page intro and FAQs | `contactPage` |
| About page | `about` |
| Social links | `social` |
| Colour swatches and fabric-family filters | `swatches`, `fabricFamilies` |

## 6. Product, fabric variant & size data

| File | Contents |
| --- | --- |
| `data/categories.ts` | 20 categories. `id === slug`, plus `rooms[]`, `showWhenEmpty` and `sort_order`. |
| `data/products.ts` | 42 designs, each defined as a compact seed with its colourways. Category membership is derived from independent attributes: function, material, default heading and pattern, plus explicit extras. A product appears in several categories without being duplicated. |
| `data/fabricVariants.ts` | 115 colourways with SKU, colour, roll width, pattern repeat, railroading, `price_per_meter`, stock status and images. |
| `data/sizeOptions.ts` | Standard sizes. Width is **per panel** (`width_basis: 'per_panel'`). |
| `data/variantSizePrices.ts` | One price per variant × size, with MRP, sale price, mode and availability. Colourways and sizes are priced independently. |
| `data/productImages.ts` | Image records (main, lifestyle, fabric_swatch, detail, back) with alt text and focus point. |
| `data/reviews.ts` | Demo reviews. All have `is_demo: true` and are labelled in the UI. |

### Product options reference

| Field | Values | Meaning |
| --- | --- | --- |
| `price_mode` | `fixed` | Exact price for the chosen size |
| | `starting_from` | Lowest price shown with "Starting from"; final price depends on configuration |
| | `best_price` | Price is shown, and "Get Best Price" becomes the primary call to action |
| | `on_request` | No price shown; customer requests a quote |
| `fabric_material` | `linen`, `linen_blend`, `cotton`, `cotton_blend`, `velvet`, `polyester`, `poly_viscose` | Fibre |
| `texture` | `smooth`, `slub`, `voile`, `jacquard`, `plush`, `herringbone`, `basket_weave`, `crushed` | Weave / surface |
| `patterns[]` | `solid`, `floral`, `geometric`, `striped`, `embroidered`, `textured`, `abstract` | Design |
| `functional_types[]` | `sheer`, `light_filtering`, `room_darkening`, `blackout`, `thermal` | Explicit performance claims. These are never inferred from colour or material. |
| `heading_options[]` | `eyelet`, `pinch_pleat`, `pencil_pleat`, `rod_pocket` | Construction. The first entry is the default. |
| `lining_options[]` | `unlined`, `cotton_lining`, `blackout_lining`, `thermal_lining` | Available linings |
| `width`, `drop` | integer millimetres | Reference size (width per panel) |
| `dimension_unit` | `mm` | Canonical storage unit |
| `selling_unit` | `pair`, `panel`, `custom` | What a price buys |
| `panels_per_pair` | `2` | Panels in one pair |

**Money and lengths:** money is stored as integer **paise**, and lengths as integer **millimetres**. Conversion to ₹, cm, inches or feet + inches happens only at the UI boundary.

## 7. Standard & custom measurements

- **Standard sizes** show width × drop in inches and centimetres, for example `Door · 54 × 84 in` (137 × 213 cm). The width is the flat finished width of **one panel**; a pair is two panels. The product page shows each panel, the combined pair width, and the rod width the pair suits.
- **Custom sizes** take the **finished width the closed pair must cover** (normally the rod width plus overlap) and the **finished drop**. Customers can enter them in inches, feet + inches or centimetres. Input is converted to millimetres immediately, and switching units converts the values already entered.
- The measuring guide explains window width, curtain-rod width, finished width and finished drop.

## 8. Pair vs. panel pricing

Every price shows its unit, for example `₹4,299 / pair` or `₹899 / panel`.

- The default selling unit is one **pair**.
- `Rod-Pocket Sheer Café Panel` shows how to sell **per panel**: its `selling_unit` is `panel`, and every label, filter and enquiry message reflects that.
- Price filters and category "from" prices use the lowest valid price **for the product's selling unit**.
- Discounts are shown only when the sale price is strictly below a positive MRP.
- EMI is shown only when the price reaches `pricing.emi.minPrice`.

## 9. Custom quote calculation & limitations

The engine is in `src/utils/pricing.ts`, which documents the full policy. Rates come from `store.pricing.rateCard`, versioned as `rateCard.version`.

1. Flat width per panel = ⌈(finished width ÷ 2) × fullness⌉ + side hems.
2. Cut drop = drop + heading allowance + bottom hem, rounded up to a whole pattern repeat.
3. Fabric widths per panel = the fewest roll widths that cover the flat width, allowing for seams. A railroadable plain fabric whose roll is taller than the cut drop is used sideways instead.
4. Total fabric is rounded up to 10 cm. The lining is computed separately on a 137 cm roll.
5. Line items:
   - fabric
   - stitching (per sewn width)
   - heading (per width)
   - lining (fabric + attaching)
   - measurement visit
   - installation (per pair)
   - coupon (only when the subtotal meets its minimum)
   - GST (extracted when prices include GST, otherwise added)

**Limitations:**

- If a colourway has no roll width or fabric rate (for example *Signature Linen — Indigo*), the engine returns `needs_confirmation`. The customer is asked to request a quote; the site never shows an invented consumption figure.
- Widths or drops outside `rateCard.limits` ask for a site visit.
- Rods, tracks and hardware are excluded.
- Every estimate is labelled **"Estimated price — final confirmation by showroom."**

Demo quotes are stored in memory (`saveQuote` in `productService`) in the `CustomQuote` shape, ready for a `custom_quotes` table.

## 10. WhatsApp enquiry flow

Every enquiry button calls `openEnquiry({...})` from `EnquiryContext`, which opens the single `EnquiryDialog`. The contact page embeds the same `EnquiryForm`.

1. The form collects the customer's name, city (required for price, quote, sample, measurement and installation enquiries), an optional preferred date and an optional message.
2. It shows what will be included and a live preview of the message.
3. `send()` in `services/enquiryService.ts` builds the message from the matching template. The message can include store, product, fabric and colour, price or estimate, dimensions and unit, pairs, heading, lining, services and page link. Lines whose placeholders are empty are removed.
4. `send()` opens an encoded `https://wa.me/<digits>?text=…` link.
5. The confirmation explains that WhatsApp has opened and **the customer must press Send**. Nothing is sent to a server. If the browser blocks the new tab, a link is shown instead.

To also record enquiries, POST the payload inside `send()`. The backend already has `POST /api/enquiries`.

## 11. Images

All images are `.webp` files under `frontend/public/images/`.

**About the bundled images:** they are stylised renders produced by `npm run images`: fabric textures, folded curtain panels and simple room scenes. They are placeholders for real photography.

**Replacing an image:** save your photo with the same file name. No code changes are needed.

| Path | Used for |
| --- | --- |
| `curtains/<variant-sku>.webp` | Front view of the pair (card and gallery main image) |
| `curtains/<variant-sku>-room.webp` | The pair styled in a room (card hover and gallery) |
| `fabrics/<variant-sku>.webp` | Fabric close-up / swatch |
| `fabrics/family-<id>.webp` | Fabric family tiles |
| `details/heading-<style>.webp`, `details/lining.webp` | Construction details, shared by all products |
| `rooms/<room>.webp`, `rooms/project-<n>.webp` | Shop by room, recent work, testimonials |
| `banners/hero-static.webp`, `banners/diwali-<n>.webp` | Static hero and festival slides |
| `showroom/showroom-<n>.webp` | Showroom section, about and contact pages |

**How images behave in the UI:**

- `SmartImage` reserves each image's aspect ratio and applies `object-position` focus points.
- Secondary images lazy-load.
- If an image is missing or fails, a woven-texture fallback is shown.
- The first hero image is preloaded at startup.

The test suite fails if any referenced image file is missing.

## 12. Vercel deployment

Import the repository into Vercel. `vercel.json` already sets:

- install: `npm install`
- build: `npm run build`
- output directory: `dist`
- an SPA rewrite to `index.html`, so deep links such as `/products/...` or `/catalog?category=…` work on refresh
- caching headers for `/images/*`

## 13. Future API integration

- `src/services/productService.ts` is the only module that reads `src/data`. To connect an API, replace the body of each function with a `fetch()` and keep the signatures. These functions include:
  - `getProducts`
  - `getProductBySlug`
  - `getCategories`
  - `getCategoryStats`
  - `getDeals`
  - `getFabricVariants`
  - `getAvailableSizes`
  - `getRelatedProducts`
  - `getReviews`
  - `getCustomisationOptions`
  - `calculateCustomQuote`
- `useAsync` already handles loading, error and retry for every page.
- `backend/` is an Express skeleton with `/api/health`, `/api/products`, `/api/products/:slug`, `/api/categories` and `POST /api/enquiries`. `backend/models/index.js` lists the suggested tables. Money columns are integer paise and lengths integer millimetres, matching `src/types`.
- Keep the quote engine (`utils/pricing.ts`) shared or mirrored on the server, so the price confirmed by the showroom uses the same rule version as the online estimate.
