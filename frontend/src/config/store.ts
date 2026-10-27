/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LOOM & LAYER — STORE CONFIGURATION
 *  The single source of truth for everything showroom-specific.
 *
 *  To rebrand for a new showroom, edit this file only. Values marked
 *  `// SAMPLE` are neutral placeholders and MUST be replaced before launch.
 *  Money is written with `rupees(…)`, which stores integer paise.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type { StoreConfig } from '../types/store';
import { rupees } from '../utils/currency';

/** The placeholder WhatsApp number. A dev-mode console warning fires while it is in use. */
export const SAMPLE_WHATSAPP = '910000000000';

export const store: StoreConfig = {
  // ── Identity ──────────────────────────────────────────────────────────────
  identity: {
    name: 'Loom & Layer',
    tagline: 'Curtains & Window Styling · Your City', // SAMPLE city
    logo: null, // e.g. { src: '/images/logo.webp', alt: 'Loom & Layer', width: 160, height: 40 }
    colors: {
      brand: '#76513D',
      brandDark: '#503627',
      brandSoft: '#F3EAE2',
      ink: '#1F1A16',
      surface: '#FAF7F3',
    },
    seo: {
      defaultTitle: 'Loom & Layer — Curtains & Window Styling',
      titleTemplate: '%s · Loom & Layer',
      description:
        'Ready-made and made-to-measure curtains in linen, cotton, velvet and sheer fabrics. Explore fabrics, configure sizes and request a quote on WhatsApp.',
      siteUrl: 'https://loom-and-layer.example.com', // SAMPLE
      ogImage: '/images/banners/hero-static.webp',
    },
  },

  // ── Navigation ────────────────────────────────────────────────────────────
  navigation: {
    headerCategories: [
      { label: 'Sheer', to: '/catalog?category=sheer-curtains' },
      { label: 'Blackout', to: '/catalog?category=blackout-curtains' },
      { label: 'Linen', to: '/catalog?category=linen-curtains' },
      { label: 'Velvet', to: '/catalog?category=velvet-curtains' },
      { label: 'Fabrics', to: '/fabrics' },
      { label: 'Custom-Made', to: '/custom-curtains' },
    ],
    popularSearches: ['blackout', 'linen sheer', 'velvet', 'eyelet', 'floral', 'thermal', 'kids'],
    searchPlaceholder: 'Search fabric, colour, style or SKU…',
  },

  // ── Credit strip (set to `null` to hide) ──────────────────────────────────
  // To show it again: { text: 'Template designed by allaboutw3b.in', href: 'https://allaboutw3b.in', ctaLabel: 'Make this yours', ctaHref: 'https://allaboutw3b.in' }
  credit: null,

  // ── Contact & WhatsApp ────────────────────────────────────────────────────
  contact: {
    phone: '+910000000000', // SAMPLE
    phoneDisplay: '+91 00000 00000', // SAMPLE
    whatsapp: SAMPLE_WHATSAPP, // SAMPLE — digits only, with country code
    email: 'hello@example.com', // SAMPLE
    /**
     * Placeholders: {store} {product} {fabric} {price} {size} {link} {name} {city} {details}
     * A line whose placeholders are all empty is dropped automatically.
     */
    templates: {
      general: 'Hello {store}, I have a question about your curtains.\nName: {name}\nCity: {city}\n{details}',
      product:
        'Hello {store}, I am interested in {product}.\nFabric / colour: {fabric}\nSize: {size}\nPrice shown: {price}\n{details}\nName: {name}\nCity: {city}\nLink: {link}',
      price:
        'Hello {store}, could you share your best price for {product}?\nFabric / colour: {fabric}\nSize: {size}\nListed price: {price}\n{details}\nName: {name}\nCity: {city}\nLink: {link}',
      custom_quote:
        'Hello {store}, I would like a custom curtain quotation.\nDesign: {product}\nFabric / colour: {fabric}\nFinished size: {size}\n{details}\nEstimate on website: {price}\nName: {name}\nCity: {city}\nLink: {link}',
      fabric_sample:
        'Hello {store}, I would like fabric samples of {fabric} ({product}).\n{details}\nName: {name}\nCity: {city}\nLink: {link}',
      measurement:
        'Hello {store}, I would like to book a home measurement visit.\n{details}\nName: {name}\nCity: {city}',
      installation:
        'Hello {store}, I need help with curtain installation.\nProduct: {product}\n{details}\nName: {name}\nCity: {city}',
      showroom_visit:
        'Hello {store}, I would like to visit your showroom.\n{details}\nName: {name}\nCity: {city}',
    },
  },

  // ── Showroom ──────────────────────────────────────────────────────────────
  showroom: {
    name: 'Loom & Layer Fabric Studio',
    addressLines: ['Shop 12, Sample Market Road', 'Near Central Square', 'Your City 000000'], // SAMPLE
    city: 'Your City', // SAMPLE
    mapsQuery: 'Curtain showroom near Central Square, Your City', // SAMPLE
    mapsEmbedUrl: '', // SAMPLE — paste a Google Maps "Embed a map" src URL to show the live map
    timezone: 'Asia/Kolkata',
    hours: {
      mon: { open: '10:30', close: '20:30' },
      tue: { open: '10:30', close: '20:30' },
      wed: { open: '10:30', close: '20:30' },
      thu: { open: '10:30', close: '20:30' },
      fri: { open: '10:30', close: '20:30' },
      sat: { open: '10:30', close: '21:00' },
      sun: { open: '11:00', close: '18:00' },
    },
    highlights: [
      '400+ fabric swatches to touch and compare',
      'Hanging display of every heading style',
      'Same-day sample loan for nearby customers',
      'Dedicated design consultation table',
    ],
    photos: [
      { src: '/images/showroom/showroom-1.webp', alt: 'Fabric wall with rolls of linen and velvet in warm neutrals', position: '50% 50%' },
      { src: '/images/showroom/showroom-2.webp', alt: 'Hanging curtain samples showing pinch-pleat and eyelet headings', position: '50% 40%' },
      { src: '/images/showroom/showroom-3.webp', alt: 'Consultation table with swatch books and a measuring tape', position: '50% 60%' },
      { src: '/images/showroom/showroom-4.webp', alt: 'Showroom window display with layered sheer and blackout curtains', position: '50% 50%' },
    ],
  },

  // ── Delivery ──────────────────────────────────────────────────────────────
  delivery: {
    areas: [
      { name: 'Your City — central', fee: rupees(0), eta: '2–4 days after stitching' }, // SAMPLE
      { name: 'Your City — outer areas', fee: rupees(199), eta: '3–5 days after stitching' }, // SAMPLE
      { name: 'Town A', fee: rupees(349), eta: '4–6 days after stitching' }, // SAMPLE
      { name: 'Town B', fee: rupees(499), eta: '5–7 days after stitching' }, // SAMPLE
      { name: 'Rest of the state (courier)', fee: rupees(699), eta: '6–9 days after stitching' }, // SAMPLE
    ],
    note: 'Ready-made sizes ship from stock. Custom orders ship once stitching is complete. Rods and tracks are delivered with installation orders.',
  },

  // ── Policies ──────────────────────────────────────────────────────────────
  policies: {
    production: {
      title: 'Production & stitching',
      body: 'Ready-made sizes are dispatched in 2–4 working days. Made-to-measure curtains are cut and stitched in our workroom in 7–12 working days after the measurements and fabric are confirmed.',
    },
    customisation: {
      title: 'Customisation',
      body: 'Any design can be made to your exact width and drop, with a choice of eyelet, pinch-pleat, pencil-pleat or rod-pocket heading and cotton, blackout or thermal lining.',
    },
    measurement: {
      title: 'Measurement service',
      body: 'Our fitter visits, measures every window and advises on rod height and stack-back. The visit fee is adjusted against your order.',
    },
    installation: {
      title: 'Installation',
      body: 'We install rods, tracks and curtains, and dress the pleats so they hang evenly. Hardware is quoted separately.',
    },
    returns: {
      title: 'Returns & exchanges',
      body: 'Unused ready-made curtains in original packing can be exchanged within 7 days. Made-to-measure curtains are cut to your size and cannot be returned, but stitching faults are corrected free of charge.',
    },
    care: {
      title: 'Fabric care',
      body: 'Dry-clean velvets, linings and embroidered fabrics. Most cottons and polyesters can be gently machine washed at 30 °C. Iron on the reverse; never tumble dry.',
    },
    showroomAvailability: {
      title: 'See it in the showroom',
      body: 'Designs marked "In showroom" are on display. Others are available as swatches — ask us to keep a sample ready before you visit.',
    },
    fabricSamples: {
      title: 'Fabric samples',
      body: 'Up to 5 swatches free for showroom pickup. We can courier swatches for a small fee that is adjusted against your order.',
    },
  },

  // ── Pricing ───────────────────────────────────────────────────────────────
  pricing: {
    defaultPriceMode: 'fixed',
    bestPrice: {
      enabled: true,
      label: 'Get Best Price',
      helper: 'Buying for several windows? Ask for a bundle price on WhatsApp.',
    },
    gst: {
      included: true,
      ratePercent: 5, // SAMPLE — confirm the applicable rate with your tax adviser
      note: 'Prices include GST. A GST invoice is provided with every order.',
    },
    emi: {
      enabled: true,
      minPrice: rupees(10000),
      months: 6,
      noCostNote: 'No-cost EMI on select credit cards, subject to bank approval.', // SAMPLE
    },
    rateCard: {
      version: '2026.1',
      allowances: {
        sideHemsPerPanelMm: 100,
        headingAllowanceMm: 150,
        bottomHemMm: 150,
        seamAllowanceMm: 30,
        roundUpToMm: 100,
        liningRollWidthMm: 1370,
        railroadStitchSectionMm: 1400,
      },
      stitchingPerWidth: rupees(220),
      headings: {
        eyelet: {
          label: 'Eyelet',
          description: 'Metal rings punched into a stiffened heading. Clean, modern folds that glide on a rod.',
          recommendedFullness: 2,
          chargePerWidth: rupees(140),
        },
        pinch_pleat: {
          label: 'Pinch pleat',
          description: 'Triple pleats hand-stitched at intervals. Tailored and formal; ideal on tracks.',
          recommendedFullness: 2.5,
          chargePerWidth: rupees(260),
        },
        pencil_pleat: {
          label: 'Pencil pleat',
          description: 'Gathered with tape into tight pencil-thin folds. Versatile on tracks or rods with hooks.',
          recommendedFullness: 2.5,
          chargePerWidth: rupees(120),
        },
        rod_pocket: {
          label: 'Rod pocket',
          description: 'A stitched channel that slides over the rod. Soft, casual gathers — best for sheers and fixed panels.',
          recommendedFullness: 2,
          chargePerWidth: rupees(60),
        },
      },
      linings: {
        unlined: {
          label: 'Unlined',
          description: 'Lets the fabric glow with natural light. Best for sheers and airy linens.',
          pricePerMeter: rupees(0),
          stitchingPerWidth: rupees(0),
        },
        cotton_lining: {
          label: 'Cotton lining',
          description: 'Adds body and protects the face fabric from sun fading. Softens light rather than blocking it.',
          pricePerMeter: rupees(180),
          stitchingPerWidth: rupees(90),
        },
        blackout_lining: {
          label: 'Blackout lining',
          description: 'Triple-weave lining that blocks most daylight. Ideal for bedrooms and media rooms.',
          pricePerMeter: rupees(320),
          stitchingPerWidth: rupees(110),
        },
        thermal_lining: {
          label: 'Thermal lining',
          description: 'Coated lining that reduces heat gain from sun-facing windows and adds blackout.',
          pricePerMeter: rupees(390),
          stitchingPerWidth: rupees(110),
        },
      },
      fullnessOptions: [
        { ratio: 1.5, label: 'Relaxed (1.5×)', description: 'Flatter look, uses the least fabric.' },
        { ratio: 2, label: 'Classic (2×)', description: 'Balanced, even folds — our usual recommendation.' },
        { ratio: 2.5, label: 'Luxe (2.5×)', description: 'Deep, generous folds for pleated headings and sheers.' },
      ],
      services: {
        measurementFee: rupees(299),
        measurementNote: 'Visit fee adjusted against your order.',
        installationPerPair: rupees(350),
        installationNote: 'Per pair, labour only. Rods and tracks are quoted separately.',
      },
      limits: {
        minWidthMm: 300,
        maxWidthMm: 12000,
        minDropMm: 300,
        maxDropMm: 4500,
        maxPairs: 20,
      },
    },
  },

  // ── Festival promotion ────────────────────────────────────────────────────
  festival: {
    id: 'diwali-2026',
    name: 'Diwali',
    active: true,
    startsAt: '2026-10-10T00:00:00+05:30', // SAMPLE
    endsAt: '2026-11-15T23:59:59+05:30', // SAMPLE — countdown & offers vanish after this
    coupon: {
      code: 'DIWALI2000',
      description: '₹2,000 off curtain orders of ₹15,000 or more',
      discount: rupees(2000),
      minOrder: rupees(15000),
      eligibleCategories: 'all',
      excludedProductIds: [],
    },
    badge: { label: 'Diwali offer' },
    stripTitle: 'Diwali Home Refresh',
    slides: [
      {
        image: '/images/banners/diwali-1.webp',
        position: '60% 50%',
        alt: 'Living room dressed in deep velvet curtains with warm festive lamp light',
        chip: 'Diwali Home Refresh',
        title: 'Velvet that glows by diya-light',
        subtitle: 'Rich, plush velvets in jewel and earth tones for the festive season.',
        categorySlug: 'velvet-curtains',
        cta: { label: 'Shop velvet', to: '/catalog?category=velvet-curtains' },
      },
      {
        image: '/images/banners/diwali-2.webp',
        position: '40% 50%',
        alt: 'Bright sitting room with layered linen sheer curtains filtering daylight',
        chip: 'Festive edit',
        title: 'Light, airy linens for guests',
        subtitle: 'Linen and linen-blend sheers that soften daylight beautifully.',
        categorySlug: 'linen-curtains',
        cta: { label: 'Shop linen', to: '/catalog?category=linen-curtains' },
      },
      {
        image: '/images/banners/diwali-3.webp',
        position: '50% 50%',
        alt: 'Calm bedroom with floor-length blackout curtains drawn closed',
        chip: 'Use code DIWALI2000',
        title: 'Restful blackout for every bedroom',
        subtitle: 'Blackout and thermal curtains, ready-made or made to measure.',
        categorySlug: 'blackout-curtains',
        cta: { label: 'Shop blackout', to: '/catalog?category=blackout-curtains' },
      },
    ],
  },

  // ── Homepage ──────────────────────────────────────────────────────────────
  home: {
    /**
     * Rotating announcement bar above the header. Empty = hidden.
     * Example: ['Free home measurement in Your City', 'Made-to-measure curtains stitched in 7–12 working days']
     */
    announcements: [],
    hero: {
      eyebrow: 'Curtains & window styling',
      title: 'Beautiful Curtains. Thoughtfully Made for Your Home.',
      subtitle:
        'Discover elegant fabrics, refined textures, and custom-made curtains designed around your windows.',
      image: {
        src: '/images/banners/hero-static.webp',
        alt: 'Sunlit living room with floor-length linen curtains in warm sand tones',
        position: '55% 50%',
      },
      highlights: ['Ready-made & made-to-measure', 'Prices per pair, clearly shown', 'Home measurement available'],
      primaryCta: { label: 'Explore curtains', to: '/catalog' },
      secondaryCta: { label: 'Design custom curtains', to: '/custom-curtains' },
    },
    trustBadges: [
      { title: 'Made to measure', body: 'Cut and stitched to your exact width and drop.', icon: 'ruler' },
      { title: 'In-house workroom', body: 'Hemming, pleating and lining done by our own tailors.', icon: 'scissors' },
      { title: 'Measured & installed', body: 'Optional home measurement and fitting service.', icon: 'home' },
      { title: 'Touch before you buy', body: 'Borrow fabric swatches from the showroom.', icon: 'swatch' },
    ],
    craftsmanship: [
      'Weighted, mitred corners on every lined curtain',
      'Pattern matched across joined fabric widths',
      'Double-turned 15 cm bottom hems for a clean fall',
      'Fullness set to suit the heading, not just the price',
    ],
    googleRating: {
      rating: 4.8, // SAMPLE — replace with your Google Business rating
      count: 210, // SAMPLE
      url: 'https://www.google.com/maps', // SAMPLE
      isSample: true,
    },
    rooms: [
      { slug: 'living-room', label: 'Living Room', description: 'Layered sheers and statement drapes', image: { src: '/images/rooms/living-room.webp', alt: 'Living room with sand linen curtains', position: '50% 50%' }, showWhenEmpty: false },
      { slug: 'bedroom', label: 'Bedroom', description: 'Blackout and thermal for deep sleep', image: { src: '/images/rooms/bedroom.webp', alt: 'Bedroom with charcoal blackout curtains', position: '50% 50%' }, showWhenEmpty: false },
      { slug: 'dining-room', label: 'Dining Room', description: 'Tailored pleats and rich textures', image: { src: '/images/rooms/dining-room.webp', alt: 'Dining room with pinch-pleat curtains', position: '50% 50%' }, showWhenEmpty: false },
      { slug: 'home-office', label: 'Home Office', description: 'Glare control without the gloom', image: { src: '/images/rooms/home-office.webp', alt: 'Home office with light-filtering curtains', position: '50% 50%' }, showWhenEmpty: false },
      { slug: 'kids-room', label: 'Kids Room', description: 'Playful prints with room-darkening', image: { src: '/images/rooms/kids-room.webp', alt: 'Kids room with playful printed curtains', position: '50% 50%' }, showWhenEmpty: false },
      { slug: 'kitchen', label: 'Kitchen', description: 'Short, washable café curtains', image: { src: '/images/rooms/kitchen.webp', alt: 'Kitchen window with short cotton curtains', position: '50% 50%' }, showWhenEmpty: false },
      { slug: 'hospitality', label: 'Hospitality', description: 'Durable drapery for hotels and cafés', image: { src: '/images/rooms/hospitality.webp', alt: 'Hotel room with full-height drapery', position: '50% 50%' }, showWhenEmpty: false },
    ],
    customSection: {
      title: 'Custom-made curtains, cut for your windows',
      intro: 'Every window is different. Choose a fabric, share your measurements and we will stitch curtains that fit perfectly — with a transparent estimate before you commit.',
      steps: [
        { title: 'Choose your fabric', body: 'Browse fabrics online or borrow swatches from the showroom.' },
        { title: 'Share your measurements', body: 'Enter width and drop, or book our home measurement visit.' },
        { title: 'Select lining & heading', body: 'Pick eyelet, pleated or rod-pocket heading and a lining to suit the room.' },
        { title: 'Receive a quotation', body: 'Get an itemised estimate and confirm the final price with the showroom.' },
      ],
      examples: [
        { src: '/images/rooms/project-1.webp', alt: 'Floor-to-ceiling linen curtains on a wide living room window', position: '50% 50%' },
        { src: '/images/rooms/project-3.webp', alt: 'Pinch-pleat velvet curtains in a dining room', position: '50% 50%' },
      ],
    },
    recentWork: [
      { image: { src: '/images/rooms/project-1.webp', alt: 'Wide living room window dressed in sand linen', position: '50% 50%' }, caption: 'Wall-to-wall linen in a sea-facing living room', room: 'Living room', fabric: 'Sandstone linen sheer, eyelet', location: 'Your City' },
      { image: { src: '/images/rooms/project-2.webp', alt: 'Bedroom with blackout curtains in slate', position: '50% 50%' }, caption: 'Blackout for a west-facing bedroom', room: 'Bedroom', fabric: 'Midnight blackout, pinch pleat', location: 'Town A' },
      { image: { src: '/images/rooms/project-3.webp', alt: 'Velvet curtains in a dining room', position: '50% 50%' }, caption: 'Olive velvet with deep pinch pleats', room: 'Dining room', fabric: 'Olive velvet, cotton lining', location: 'Your City' },
      { image: { src: '/images/rooms/project-4.webp', alt: 'Kids bedroom with playful printed curtains', position: '50% 50%' }, caption: 'Room-darkening prints for a nursery', room: 'Kids room', fabric: 'Printed cotton, blackout lining', location: 'Town B' },
      { image: { src: '/images/rooms/project-5.webp', alt: 'Study with light-filtering curtains', position: '50% 50%' }, caption: 'Glare-free light for a home study', room: 'Home office', fabric: 'Oat textured weave, pencil pleat', location: 'Your City' },
      { image: { src: '/images/rooms/project-6.webp', alt: 'Boutique hotel room with full-height drapes', position: '50% 50%' }, caption: 'Twelve rooms for a boutique stay', room: 'Hospitality', fabric: 'Thermal blackout, ripple-look pinch pleat', location: 'Town A' },
    ],
    instagram: { handle: '@loomandlayer', url: 'https://instagram.com/' }, // SAMPLE
  },

  // ── Contact page ──────────────────────────────────────────────────────────
  contactPage: {
    intro: 'Visit the fabric studio, send us your window photos on WhatsApp, or book a measurement visit. We usually reply within working hours.',
    faqs: [
      { q: 'Are your prices per curtain or per pair?', a: 'Every price states its unit. Ready-made curtains are sold as a pair — two panels — unless a product clearly says "per panel". Custom estimates show the total for the number of pairs you choose.' },
      { q: 'How do I measure my window?', a: 'Measure the rod or track width (not just the window glass), then the drop from the rod to where you want the curtain to end. Our Custom Curtains page explains each measurement, or book our measurement visit.' },
      { q: 'Is the online custom price final?', a: 'No. The website shows an itemised estimate. The showroom confirms the final price after checking measurements, fabric availability and pattern matching.' },
      { q: 'How long does stitching take?', a: 'Made-to-measure curtains take 7–12 working days after confirmation. Ready-made sizes dispatch in 2–4 working days.' },
      { q: 'Do you install rods and tracks?', a: 'Yes. Installation is available per pair; rods and tracks are quoted separately depending on length and finish.' },
      { q: 'Can I see fabrics before ordering?', a: 'Yes. Up to 5 swatches are free from the showroom, and we can courier samples for a small fee adjusted against your order.' },
      { q: 'Will a dark colour block light?', a: 'Not necessarily. Light blocking depends on the weave and lining, not the colour. Look for products marked Blackout or Room-darkening, or add a blackout lining.' },
    ],
  },

  // ── About ─────────────────────────────────────────────────────────────────
  about: {
    title: 'A fabric studio for considered homes',
    intro: 'Loom & Layer began with a simple belief: curtains are the largest piece of fabric in most rooms, so they deserve the same care as the furniture.',
    story: [
      'We source linens, cottons, velvets and sheers from mills we know, and hold every colourway in our showroom so you can see how it behaves in real light.',
      'Our workroom tailors cut, join and hem each curtain by hand-guided machine, matching patterns across widths and weighting corners so every pair hangs straight.',
      'Whether you need one pair for a bedroom or drapery for a whole home, we keep pricing transparent — per pair, itemised, and confirmed before we cut.',
    ],
    pillars: [
      { title: 'Fabric first', body: 'Every fabric is chosen for drape, light behaviour and how it ages — not just how it photographs.' },
      { title: 'Made to measure', body: 'Any design can be stitched to your width and drop, with the heading and lining your room needs.' },
      { title: 'Honest estimates', body: 'Line-item estimates that show fabric, stitching, lining and services separately.' },
      { title: 'Service at home', body: 'Measurement visits, installation and pleat dressing by our own team.' },
    ],
    image: { src: '/images/showroom/showroom-2.webp', alt: 'Curtain samples hanging in the Loom & Layer showroom', position: '50% 40%' },
  },

  social: [
    { label: 'Instagram', href: 'https://instagram.com/' }, // SAMPLE
    { label: 'Facebook', href: 'https://facebook.com/' }, // SAMPLE
    { label: 'Pinterest', href: 'https://pinterest.com/' }, // SAMPLE
  ],

  // ── Colour swatches & fabric families (filters) ───────────────────────────
  swatches: [
    { family: 'white', label: 'White', hex: '#F7F5F0' },
    { family: 'ivory', label: 'Ivory', hex: '#EFE6D2' },
    { family: 'beige', label: 'Beige & sand', hex: '#D8C3A5' },
    { family: 'brown', label: 'Brown & rust', hex: '#8A5A3C' },
    { family: 'grey', label: 'Grey', hex: '#A5A29C' },
    { family: 'charcoal', label: 'Charcoal & black', hex: '#3A3734' },
    { family: 'blue', label: 'Blue', hex: '#3E5A78' },
    { family: 'green', label: 'Green', hex: '#5E6B45' },
    { family: 'pink', label: 'Pink & blush', hex: '#D9A5A0' },
    { family: 'red', label: 'Red & maroon', hex: '#7A1F2B' },
    { family: 'yellow', label: 'Mustard & gold', hex: '#C9962F' },
    { family: 'multi', label: 'Multicolour', hex: 'conic-gradient(#C9962F, #5E6B45, #3E5A78, #D9A5A0, #C9962F)' },
  ],
  fabricFamilies: [
    {
      id: 'linen',
      label: 'Linen & linen blends',
      materials: ['linen', 'linen_blend'],
      textures: [],
      description: 'Natural slub and a relaxed, lived-in drape. Linen blends add crease resistance.',
      feel: 'Dry, crisp hand with visible slub',
      bestFor: 'Living rooms, sheers, relaxed eyelets',
      swatchHex: '#D8C3A5',
      image: { src: '/images/fabrics/family-linen.webp', alt: 'Close-up of sand linen weave' },
    },
    {
      id: 'cotton',
      label: 'Cotton & cotton blends',
      materials: ['cotton', 'cotton_blend'],
      textures: [],
      description: 'Breathable, easy to wash and ideal for prints, florals and everyday rooms.',
      feel: 'Soft, matte and breathable',
      bestFor: 'Bedrooms, kitchens, kids rooms',
      swatchHex: '#E9DCC6',
      image: { src: '/images/fabrics/family-cotton.webp', alt: 'Close-up of printed cotton fabric' },
    },
    {
      id: 'velvet',
      label: 'Velvet',
      materials: ['velvet'],
      textures: [],
      description: 'Deep pile that catches light and adds warmth, insulation and quiet.',
      feel: 'Plush, weighty, light-catching',
      bestFor: 'Living and dining rooms, formal spaces',
      swatchHex: '#5E6B45',
      image: { src: '/images/fabrics/family-velvet.webp', alt: 'Close-up of olive velvet pile' },
    },
    {
      id: 'sheer',
      label: 'Sheer & voile',
      materials: [],
      textures: ['voile'],
      description: 'Fine, translucent weaves that diffuse daylight while keeping privacy.',
      feel: 'Light, airy, translucent',
      bestFor: 'Layering behind heavier drapes',
      swatchHex: '#F7F5F0',
      image: { src: '/images/fabrics/family-sheer.webp', alt: 'Close-up of white voile sheer' },
    },
    {
      id: 'jacquard',
      label: 'Jacquard & textured weaves',
      materials: [],
      textures: ['jacquard', 'herringbone', 'basket_weave'],
      description: 'Patterns woven into the cloth rather than printed — depth you can feel.',
      feel: 'Structured with raised pattern',
      bestFor: 'Statement windows, dining rooms',
      swatchHex: '#B8A27C',
      image: { src: '/images/fabrics/family-jacquard.webp', alt: 'Close-up of gold jacquard weave' },
    },
    {
      id: 'polyester',
      label: 'Performance polyester',
      materials: ['polyester', 'poly_viscose'],
      textures: [],
      description: 'Durable, fade-resistant and the base for most blackout and thermal fabrics.',
      feel: 'Smooth, dense, easy-care',
      bestFor: 'Bedrooms, hospitality, sun-facing windows',
      swatchHex: '#3A3734',
      image: { src: '/images/fabrics/family-polyester.webp', alt: 'Close-up of charcoal blackout fabric' },
    },
  ],
};

/** True while the placeholder WhatsApp number is configured. */
export const isSampleWhatsapp = store.contact.whatsapp === SAMPLE_WHATSAPP;
