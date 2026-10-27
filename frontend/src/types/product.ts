/**
 * Core catalogue types for Loom & Layer.
 *
 * Conventions used throughout the data model:
 * - Money is stored as integer **paise** (`Paise`), never as floating rupees.
 * - Measurements are stored in canonical integer **millimetres** (`Millimetres`)
 *   and converted to cm / inches / feet-inches only at the UI boundary.
 * - The default orderable unit is one **pair** (two panels). Any price that
 *   applies to a single panel uses `selling_unit: 'panel'` explicitly.
 */

/** Integer amount in paise (₹1 = 100 paise). */
export type Paise = number;
/** Integer length in millimetres. */
export type Millimetres = number;
/** ISO-8601 date-time string. */
export type ISODateString = string;

/** Canonical storage unit for every dimension in the data layer. */
export type CanonicalUnit = 'mm';
/** Units a customer can enter or view measurements in. */
export type MeasurementUnit = 'cm' | 'in' | 'ft_in';

export type PriceMode = 'fixed' | 'starting_from' | 'best_price' | 'on_request';
export type SellingUnit = 'pair' | 'panel' | 'custom';
export type RecordStatus = 'active' | 'draft' | 'archived';
export type StockStatus = 'in_stock' | 'low_stock' | 'made_to_order' | 'out_of_stock';

export type Material =
  | 'linen'
  | 'linen_blend'
  | 'cotton'
  | 'cotton_blend'
  | 'velvet'
  | 'polyester'
  | 'poly_viscose';

export type Pattern =
  | 'solid'
  | 'floral'
  | 'geometric'
  | 'striped'
  | 'embroidered'
  | 'textured'
  | 'abstract';

export type Texture =
  | 'smooth'
  | 'slub'
  | 'voile'
  | 'jacquard'
  | 'plush'
  | 'herringbone'
  | 'basket_weave'
  | 'crushed';

/**
 * What the curtain does with light / heat. These are explicit, tested claims
 * set per product — never inferred from colour or material.
 */
export type FunctionalType =
  | 'sheer'
  | 'light_filtering'
  | 'room_darkening'
  | 'blackout'
  | 'thermal';

export type Opacity = 'sheer' | 'semi_sheer' | 'light_filtering' | 'room_darkening' | 'blackout';

/** Construction / heading style. */
export type HeadingStyle = 'eyelet' | 'pinch_pleat' | 'rod_pocket' | 'pencil_pleat';

export type LiningOption = 'unlined' | 'cotton_lining' | 'blackout_lining' | 'thermal_lining';

export type RoomSlug =
  | 'living-room'
  | 'bedroom'
  | 'dining-room'
  | 'home-office'
  | 'kids-room'
  | 'kitchen'
  | 'hospitality';

export type DesignStyle = 'Contemporary' | 'Classic' | 'Minimal' | 'Traditional' | 'Playful' | 'Luxe';

/** Simplified colour families used by filters and swatches. */
export type ColourFamily =
  | 'white'
  | 'ivory'
  | 'beige'
  | 'brown'
  | 'grey'
  | 'charcoal'
  | 'blue'
  | 'green'
  | 'pink'
  | 'red'
  | 'yellow'
  | 'multi';

export interface LeadTime {
  /** Working days for ready-made sizes. */
  ready_made_days: [number, number];
  /** Working days for made-to-measure orders. */
  custom_days: [number, number];
}

export interface Product {
  id: string;
  /** Primary category (used for breadcrumbs). */
  category_id: string;
  /** Every category this product appears in — the product itself is never duplicated. */
  category_ids: string[];
  rooms: RoomSlug[];
  name: string;
  slug: string;
  sku: string;
  description: string;
  /** Reference MRP for the reference size (`width` × `drop`) of the default variant. */
  base_price: Paise;
  /** Reference sale price for the reference size of the default variant. */
  sale_price: Paise;
  price_mode: PriceMode;
  brand: string;
  fabric_material: Material;
  fabric_collection: string;
  colors: ColourFamily[];
  patterns: Pattern[];
  functional_types: FunctionalType[];
  style: DesignStyle;
  opacity: Opacity;
  texture: Texture;
  /** Reference finished width of ONE panel. */
  width: Millimetres;
  /** Reference finished drop. */
  drop: Millimetres;
  dimension_unit: CanonicalUnit;
  selling_unit: SellingUnit;
  panels_per_pair: number;
  lining_options: LiningOption[];
  /** First entry is the default construction. */
  heading_options: HeadingStyle[];
  warranty: string;
  status: RecordStatus;
  custom_sizing_enabled: boolean;
  /** Ready-made standard sizes are offered for this product. */
  standard_sizing_enabled: boolean;
  lead_time: LeadTime;
  in_showroom: boolean;
  /** External checkout link. Buy Now is shown only when this is a valid URL. */
  buy_url: string | null;
  /** Lower number = more prominent in "Featured" sorting. */
  featured_rank: number;
  is_bestseller: boolean;
  care: string[];
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  /** Focus point for `object-position`. */
  image_position?: string;
  rooms: RoomSlug[];
  /** Keep the category visible even when it has no active products. */
  showWhenEmpty: boolean;
  sort_order: number;
}

export interface FabricVariant {
  id: string;
  product_id: string;
  variant_sku: string;
  /** Customer-facing colourway name, e.g. "Sandstone". */
  name: string;
  material: Material;
  color: ColourFamily;
  color_hex: string;
  pattern: Pattern;
  texture: Texture;
  opacity: Opacity;
  /** Usable roll width in centimetres. `null` when not yet confirmed with the mill. */
  fabric_roll_width_cm: number | null;
  /** Vertical pattern repeat in centimetres, `null` for plains. */
  pattern_repeat_cm: number | null;
  /** Fabric can be turned so the roll width becomes the drop (common for wide sheers). */
  railroadable: boolean;
  /**
   * Fabric pricing basis: price per running metre of fabric off the roll,
   * GST treatment per `store.pricing.gst`. `null` = needs showroom confirmation.
   */
  price_per_meter: Paise | null;
  /** Percentage adjustment applied to this colourway's standard-size prices. */
  price_adjustment_pct: number;
  stock_status: StockStatus;
  /** ProductImage ids belonging to this variant, in display order. */
  images: string[];
  status: RecordStatus;
}

export type ProductImageType = 'main' | 'front' | 'lifestyle' | 'detail' | 'fabric_swatch' | 'back';

export interface ProductImage {
  id: string;
  product_id: string;
  variant_id: string | null;
  type: ProductImageType;
  url: string;
  alt: string;
  sort_order: number;
  /** Optional focus point for `object-position`. */
  position?: string;
}

/**
 * Width basis for size options.
 * - `per_panel`: `finished_width` is the flat finished width of ONE panel.
 *   A pair is two such panels.
 * - `pair_combined`: `finished_width` is the combined width of both panels.
 */
export type WidthBasis = 'per_panel' | 'pair_combined';

export interface SizeOption {
  id: string;
  label: string;
  /** Short hint such as "Standard window". */
  use_case: string;
  size_type: 'standard' | 'custom';
  width_basis: WidthBasis;
  finished_width: Millimetres;
  finished_drop: Millimetres;
  dimension_unit: CanonicalUnit;
  selling_unit: SellingUnit;
  panels_per_pair: number;
  /** Suggested curtain-rod width this pair dresses comfortably (with gathers). */
  recommended_rod_width: Millimetres;
  is_available: boolean;
}

export interface VariantSizePrice {
  id: string;
  variant_id: string;
  size_option_id: string;
  mrp: Paise | null;
  sale_price: Paise | null;
  price_mode: PriceMode;
  currency: 'INR';
  is_available: boolean;
}

/** A product joined with its variants and lowest valid price — what lists render. */
export interface ProductSummary extends Product {
  variants: FabricVariant[];
  primaryImage: ProductImage | null;
  hoverImage: ProductImage | null;
  /** Lowest valid sale price across available variant × size combinations. */
  priceFrom: Paise | null;
  /** MRP that belongs to the `priceFrom` combination. */
  mrpFrom: Paise | null;
  /** Discount % for the `priceFrom` combination, only when the discount is valid. */
  discountPct: number | null;
  /** Number of available standard sizes. */
  sizeCount: number;
  /** Representative size label for cards, e.g. "4.5 × 7 ft". */
  sizeLabel: string | null;
  rating: { average: number; count: number } | null;
}
