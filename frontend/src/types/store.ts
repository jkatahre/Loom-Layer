import type {
  ColourFamily,
  HeadingStyle,
  LiningOption,
  Material,
  Paise,
  PriceMode,
  RoomSlug,
  Texture,
} from './product';

export type EnquiryKind =
  | 'general'
  | 'product'
  | 'price'
  | 'custom_quote'
  | 'fabric_sample'
  | 'measurement'
  | 'installation'
  | 'showroom_visit';

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface ImageRef {
  src: string;
  alt: string;
  /** CSS `object-position` focus point, e.g. "50% 30%". */
  position?: string;
}

export interface BrandColors {
  brand: string;
  brandDark: string;
  brandSoft: string;
  ink: string;
  surface: string;
}

export interface HeadingRate {
  label: string;
  description: string;
  /** Fullness that suits this heading; used as the default in the configurator. */
  recommendedFullness: number;
  /** Extra making charge per fabric width (rings, tape, pleating). */
  chargePerWidth: Paise;
}

export interface LiningRate {
  label: string;
  description: string;
  /** Lining fabric price per running metre. */
  pricePerMeter: Paise;
  /** Extra stitching per fabric width for attaching the lining. */
  stitchingPerWidth: Paise;
}

/**
 * The showroom's custom-curtain rate card. Every number used by the quote
 * engine lives here so a showroom can change its pricing without touching code.
 */
export interface QuoteRateCard {
  version: string;
  allowances: {
    /** Side hems for ONE panel, both edges combined. */
    sideHemsPerPanelMm: number;
    /** Fabric taken up by the heading at the top of each drop. */
    headingAllowanceMm: number;
    /** Double bottom hem. */
    bottomHemMm: number;
    /** Lost to each vertical seam when two fabric widths are joined. */
    seamAllowanceMm: number;
    /** Total fabric is rounded up to this step (mills cut in 10 cm steps). */
    roundUpToMm: number;
    /** Roll width of lining fabric. Linings are never railroaded. */
    liningRollWidthMm: number;
    /** For railroaded fabric, stitching is charged per this much flat width. */
    railroadStitchSectionMm: number;
  };
  /** Base stitching charge per fabric width (per drop sewn). */
  stitchingPerWidth: Paise;
  headings: Record<HeadingStyle, HeadingRate>;
  linings: Record<LiningOption, LiningRate>;
  fullnessOptions: { ratio: number; label: string; description: string }[];
  services: {
    measurementFee: Paise;
    measurementNote: string;
    installationPerPair: Paise;
    installationNote: string;
  };
  limits: {
    minWidthMm: number;
    maxWidthMm: number;
    minDropMm: number;
    maxDropMm: number;
    maxPairs: number;
  };
}

export interface FestivalSlide {
  image: string;
  position?: string;
  alt: string;
  chip: string;
  title: string;
  subtitle: string;
  /** Category whose live lowest price is shown as "from ₹…". */
  categorySlug: string;
  cta: { label: string; to: string };
}

export interface CouponConfig {
  code: string;
  description: string;
  /** Flat discount on the order. */
  discount: Paise;
  /** Minimum order value the discount applies to. */
  minOrder: Paise;
  /** Category slugs that qualify; `'all'` means the whole catalogue. */
  eligibleCategories: string[] | 'all';
  /** Product ids excluded from the offer. */
  excludedProductIds: string[];
}

export interface FestivalConfig {
  id: string;
  name: string;
  active: boolean;
  startsAt: string;
  endsAt: string;
  coupon: CouponConfig | null;
  badge: { label: string } | null;
  stripTitle: string;
  slides: FestivalSlide[];
}

export interface RoomConfig {
  slug: RoomSlug;
  label: string;
  description: string;
  image: ImageRef;
  showWhenEmpty: boolean;
}

export interface FabricFamily {
  id: string;
  label: string;
  /** A product matches the family when its material OR texture is listed. */
  materials: Material[];
  textures: Texture[];
  description: string;
  feel: string;
  bestFor: string;
  swatchHex: string;
  image: ImageRef;
}

export interface Faq {
  q: string;
  a: string;
}

export interface PolicyBlock {
  title: string;
  body: string;
}

export interface StoreConfig {
  identity: {
    name: string;
    tagline: string;
    logo: { src: string; alt: string; width: number; height: number } | null;
    colors: BrandColors;
    seo: {
      defaultTitle: string;
      titleTemplate: string;
      description: string;
      siteUrl: string;
      ogImage: string;
    };
  };
  navigation: {
    headerCategories: { label: string; to: string }[];
    popularSearches: string[];
    searchPlaceholder: string;
  };
  credit: { text: string; href: string; ctaLabel: string; ctaHref: string } | null;
  contact: {
    phone: string;
    phoneDisplay: string;
    /** Digits only, including country code — e.g. "919800000000". */
    whatsapp: string;
    email: string;
    templates: Record<EnquiryKind, string>;
  };
  showroom: {
    name: string;
    addressLines: string[];
    city: string;
    mapsQuery: string;
    mapsEmbedUrl: string;
    timezone: string;
    hours: Record<Weekday, { open: string; close: string } | null>;
    highlights: string[];
    photos: ImageRef[];
  };
  delivery: {
    areas: { name: string; fee: Paise; eta: string }[];
    note: string;
  };
  policies: {
    production: PolicyBlock;
    customisation: PolicyBlock;
    measurement: PolicyBlock;
    installation: PolicyBlock;
    returns: PolicyBlock;
    care: PolicyBlock;
    showroomAvailability: PolicyBlock;
    fabricSamples: PolicyBlock;
  };
  pricing: {
    defaultPriceMode: PriceMode;
    bestPrice: { enabled: boolean; label: string; helper: string };
    gst: { included: boolean; ratePercent: number; note: string };
    emi: { enabled: boolean; minPrice: Paise; months: number; noCostNote: string } | null;
    rateCard: QuoteRateCard;
  };
  festival: FestivalConfig | null;
  home: {
    announcements: string[];
    hero: {
      eyebrow: string;
      title: string;
      subtitle: string;
      image: ImageRef;
      highlights: string[];
      primaryCta: { label: string; to: string };
      secondaryCta: { label: string; to: string };
    };
    trustBadges: { title: string; body: string; icon: 'ruler' | 'scissors' | 'truck' | 'swatch' | 'home' | 'shield' }[];
    craftsmanship: string[];
    googleRating: { rating: number; count: number; url: string; isSample: boolean } | null;
    rooms: RoomConfig[];
    customSection: {
      title: string;
      intro: string;
      steps: { title: string; body: string }[];
      examples: ImageRef[];
    };
    recentWork: { image: ImageRef; caption: string; room: string; fabric: string; location: string }[];
    instagram: { handle: string; url: string } | null;
  };
  contactPage: { intro: string; faqs: Faq[] };
  about: {
    title: string;
    intro: string;
    story: string[];
    pillars: { title: string; body: string }[];
    image: ImageRef;
  };
  social: { label: string; href: string }[];
  swatches: { family: ColourFamily; label: string; hex: string }[];
  fabricFamilies: FabricFamily[];
}
