/**
 * Product data service.
 *
 * Every page reads catalogue data through these async functions only. They
 * currently resolve from the local demo data in `src/data`; to connect a real
 * backend, replace each body with a `fetch()` to the matching API route
 * (see README › Future API integration) and keep the signatures.
 */
import { store } from '../config/store';
import { categories } from '../data/categories';
import { fabricVariants, variantById, variantsForProduct } from '../data/fabricVariants';
import { productImages } from '../data/productImages';
import { productById, products } from '../data/products';
import { reviews } from '../data/reviews';
import { sizeById, sizeOptions } from '../data/sizeOptions';
import { variantSizePrices } from '../data/variantSizePrices';
import type {
  Category,
  FabricVariant,
  HeadingStyle,
  LiningOption,
  Paise,
  Product,
  ProductImage,
  ProductSummary,
  RoomSlug,
  SizeOption,
  VariantSizePrice,
} from '../types/product';
import type { CustomQuote, QuoteInput, QuoteResult } from '../types/quote';
import type { Review } from '../types/review';
import type { RoomConfig } from '../types/store';
import { validDiscountPct } from '../utils/currency';
import { calculateQuote } from '../utils/pricing';
import { checkCoupon, isCouponEligible, liveCoupon } from '../utils/promotions';
import { formatFeetCompact } from '../utils/units';

const DEMO_LATENCY_MS = 180;

/** Simulated network round-trip. Add `?demoError=1` to any URL to test error states. */
async function respond<T>(value: T): Promise<T> {
  await new Promise((r) => setTimeout(r, DEMO_LATENCY_MS));
  if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('demoError')) {
    throw new Error('Demo error: the catalogue could not be loaded.');
  }
  return value;
}

const activeProducts = () => products.filter((p) => p.status === 'active');

// ── summaries ────────────────────────────────────────────────────────────────
const pricesByProduct = new Map<string, VariantSizePrice[]>();
for (const price of variantSizePrices) {
  const v = variantById.get(price.variant_id);
  if (!v) continue;
  const list = pricesByProduct.get(v.product_id) ?? [];
  list.push(price);
  pricesByProduct.set(v.product_id, list);
}

/** Standard size ids each product can be bought in (any colourway). */
export const sizeIdsByProduct = new Map<string, string[]>(
  [...pricesByProduct].map(([pid, list]) => [pid, [...new Set(list.filter((x) => x.is_available).map((x) => x.size_option_id))]]),
);

function ratingFor(productId: string) {
  const list = reviews.filter((r) => r.product_id === productId);
  if (!list.length) return null;
  const avg = list.reduce((s, r) => s + r.rating, 0) / list.length;
  return { average: Math.round(avg * 10) / 10, count: list.length };
}

function summarise(p: Product): ProductSummary {
  const variants = variantsForProduct(p.id);
  const imgs = productImages.filter((i) => i.product_id === p.id);
  const first = variants[0];
  const primaryImage = imgs.find((i) => i.variant_id === first?.id && i.type === 'main') ?? null;
  const hoverImage = imgs.find((i) => i.variant_id === first?.id && i.type === 'lifestyle') ?? null;

  let priceFrom: Paise | null = null;
  let mrpFrom: Paise | null = null;
  if (p.price_mode !== 'on_request') {
    const priced = (pricesByProduct.get(p.id) ?? []).filter((x) => x.is_available && x.sale_price != null && x.sale_price > 0);
    if (priced.length) {
      const cheapest = priced.reduce((a, b) => (b.sale_price! < a.sale_price! ? b : a));
      priceFrom = cheapest.sale_price;
      mrpFrom = cheapest.mrp;
    } else if (!p.standard_sizing_enabled && p.sale_price > 0) {
      // Made-to-measure only: the reference-size price is a "starting from" figure.
      priceFrom = p.sale_price;
      mrpFrom = p.base_price;
    }
  }
  const sizeIds = sizeIdsByProduct.get(p.id) ?? [];
  const refSize = sizeOptions.find((s) => sizeIds.includes(s.id) && s.finished_drop === p.drop) ?? sizeById.get(sizeIds[0] ?? '');
  return {
    ...p,
    variants,
    primaryImage,
    hoverImage,
    priceFrom,
    mrpFrom,
    discountPct: validDiscountPct(mrpFrom, priceFrom),
    sizeCount: sizeIds.length,
    sizeLabel: refSize ? formatFeetCompact(refSize.finished_width, refSize.finished_drop) : null,
    rating: ratingFor(p.id),
  };
}

const summaries = activeProducts().map(summarise);
const summaryById = new Map(summaries.map((s) => [s.id, s]));

// ── public API ───────────────────────────────────────────────────────────────
export function getProducts(): Promise<ProductSummary[]> {
  return respond(summaries);
}

export interface ProductDetail {
  product: ProductSummary;
  category: Category | null;
  categories: Category[];
  images: ProductImage[];
  sizes: SizeOption[];
  prices: VariantSizePrice[];
}

export function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const product = summaries.find((p) => p.slug === slug);
  if (!product) return respond(null);
  const prices = pricesByProduct.get(product.id) ?? [];
  const sizeIds = new Set(prices.map((x) => x.size_option_id));
  const sizes = sizeOptions
    .filter((s) => sizeIds.has(s.id))
    .map((s) => (product.selling_unit === 'panel' ? { ...s, selling_unit: 'panel' as const } : s));
  return respond({
    product,
    category: categories.find((c) => c.id === product.category_id) ?? null,
    categories: categories.filter((c) => product.category_ids.includes(c.id)),
    images: productImages.filter((i) => i.product_id === product.id),
    sizes,
    prices,
  });
}

export interface CategoryWithStats extends Category {
  count: number;
  priceFrom: Paise | null;
}

function categoryStats(): CategoryWithStats[] {
  return [...categories]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => {
      const inCat = summaries.filter((p) => p.category_ids.includes(c.id));
      const prices = inCat.map((p) => p.priceFrom).filter((x): x is Paise => x != null && x > 0);
      return { ...c, count: inCat.length, priceFrom: prices.length ? Math.min(...prices) : null };
    });
}

/** Categories to display — empty ones are hidden unless `showWhenEmpty`. */
export function getCategories(): Promise<CategoryWithStats[]> {
  return respond(categoryStats().filter((c) => c.count > 0 || c.showWhenEmpty));
}

/** Count and lowest valid current price per category (used by hero slides). */
export function getCategoryStats(): Promise<Record<string, { count: number; priceFrom: Paise | null }>> {
  return respond(Object.fromEntries(categoryStats().map((c) => [c.slug, { count: c.count, priceFrom: c.priceFrom }])));
}

export interface RoomWithCount extends RoomConfig {
  count: number;
}

export function getRooms(): Promise<RoomWithCount[]> {
  return respond(
    store.home.rooms
      .map((r) => ({ ...r, count: summaries.filter((p) => p.rooms.includes(r.slug as RoomSlug)).length }))
      .filter((r) => r.count > 0 || r.showWhenEmpty),
  );
}

/** Products with the largest genuine discounts. */
export function getDeals(n: number): Promise<ProductSummary[]> {
  const deals = summaries
    .filter((p) => p.discountPct != null && p.price_mode !== 'on_request')
    .sort((a, b) => (b.discountPct ?? 0) - (a.discountPct ?? 0) || a.featured_rank - b.featured_rank)
    .slice(0, n);
  return respond(deals);
}

export function getBestsellers(n: number): Promise<ProductSummary[]> {
  return respond(summaries.filter((p) => p.is_bestseller).sort((a, b) => a.featured_rank - b.featured_rank).slice(0, n));
}

export function getFabricVariants(productId: string): Promise<FabricVariant[]> {
  return respond(variantsForProduct(productId));
}

export interface SizeWithPrice {
  size: SizeOption;
  price: VariantSizePrice;
}

export function availableSizesSync(productId: string, variantId: string): SizeWithPrice[] {
  const product = productById.get(productId);
  return (pricesByProduct.get(productId) ?? [])
    .filter((x) => x.variant_id === variantId)
    .map((price) => {
      const size = sizeById.get(price.size_option_id)!;
      return { size: product?.selling_unit === 'panel' ? { ...size, selling_unit: 'panel' as const } : size, price };
    })
    .sort((a, b) => a.size.finished_drop - b.size.finished_drop || a.size.finished_width - b.size.finished_width);
}

export function getAvailableSizes(productId: string, variantId: string): Promise<SizeWithPrice[]> {
  return respond(availableSizesSync(productId, variantId));
}

export function getRelatedProducts(productId: string, n = 4): Promise<ProductSummary[]> {
  const p = summaryById.get(productId);
  if (!p) return respond([]);
  const scored = summaries
    .filter((x) => x.id !== productId)
    .map((x) => {
      let score = 0;
      score += x.category_ids.filter((c) => p.category_ids.includes(c)).length;
      score += x.rooms.filter((r) => p.rooms.includes(r)).length;
      if (x.fabric_material === p.fabric_material) score += 2;
      if (x.fabric_collection === p.fabric_collection) score += 2;
      return { x, score };
    })
    .sort((a, b) => b.score - a.score || a.x.featured_rank - b.x.featured_rank);
  return respond(scored.slice(0, n).map((s) => s.x));
}

/** Reviews for a product, or showroom-wide reviews (newest first) when no id is given. */
export function getReviews(productId?: string): Promise<Review[]> {
  const list = productId ? reviews.filter((r) => r.product_id === productId) : reviews;
  return respond([...list].sort((a, b) => b.date.localeCompare(a.date)));
}

export interface CustomisationOptions {
  headings: { id: HeadingStyle; label: string; description: string; recommendedFullness: number }[];
  linings: { id: LiningOption; label: string; description: string }[];
  fullness: { ratio: number; label: string; description: string }[];
  services: typeof store.pricing.rateCard.services;
  limits: typeof store.pricing.rateCard.limits;
  customSizing: boolean;
}

export function customisationOptionsSync(productId: string): CustomisationOptions | null {
  const p = productById.get(productId);
  if (!p) return null;
  const rc = store.pricing.rateCard;
  return {
    headings: p.heading_options.map((id) => ({ id, ...rc.headings[id] })),
    linings: p.lining_options.map((id) => ({ id, ...rc.linings[id] })),
    fullness: rc.fullnessOptions,
    services: rc.services,
    limits: rc.limits,
    customSizing: p.custom_sizing_enabled,
  };
}

export function getCustomisationOptions(productId: string): Promise<CustomisationOptions | null> {
  return respond(customisationOptionsSync(productId));
}

/** Synchronous quote — used for live estimates as the customer types. */
export function calculateCustomQuoteSync(input: QuoteInput, now: Date = new Date()): QuoteResult {
  const product = productById.get(input.productId);
  const variant = variantById.get(input.variantId);
  if (!product || !variant || variant.product_id !== product.id) {
    return { kind: 'invalid', errors: { variantId: 'Choose a fabric for this design.' } };
  }
  const coupon = liveCoupon(store.festival, now);
  let couponRule: { code: string; discount: Paise; minOrder: Paise } | null = null;
  let couponNote: string | null = null;
  if (input.couponCode?.trim()) {
    // Check everything except order value here; the engine applies the minimum.
    const check = checkCoupon(input.couponCode, store.festival, product, Number.MAX_SAFE_INTEGER, now);
    if (check.valid && coupon) couponRule = { code: coupon.code, discount: coupon.discount, minOrder: coupon.minOrder };
    else if (!check.valid) couponNote = `Coupon not applied: ${check.reason}`;
  }
  const result = calculateQuote(
    input,
    {
      rollWidthCm: variant.fabric_roll_width_cm,
      pricePerMeter: variant.price_per_meter,
      patternRepeatCm: variant.pattern_repeat_cm,
      railroadable: variant.railroadable,
    },
    {
      rateCard: store.pricing.rateCard,
      gst: store.pricing.gst,
      allowedHeadings: product.heading_options,
      allowedLinings: product.lining_options,
      coupon: couponRule,
    },
  );
  if (couponNote && result.kind === 'estimate') result.notes.unshift(couponNote);
  return result;
}

export function calculateCustomQuote(input: QuoteInput): Promise<QuoteResult> {
  return respond(calculateCustomQuoteSync(input));
}

/** Is a product part of the live festival coupon? */
export function isOnFestivalOffer(product: Pick<Product, 'id' | 'category_ids'>, now: Date = new Date()): boolean {
  const coupon = liveCoupon(store.festival, now);
  return !!coupon && isCouponEligible(coupon, product);
}

// ── demo quote store (frontend state only) ───────────────────────────────────
const savedQuotes: CustomQuote[] = [];

/** Convert an estimate into the persisted `CustomQuote` shape (kept in memory for the demo). */
export function saveQuote(input: QuoteInput, result: QuoteResult): CustomQuote {
  const est = result.kind === 'estimate' ? result : null;
  const amount = (key: string) => est?.lines.find((l) => l.key === key)?.amount ?? null;
  const quote: CustomQuote = {
    id: `q-${Date.now().toString(36)}`,
    product_id: input.productId,
    variant_id: input.variantId,
    finished_width: input.finishedWidth,
    finished_drop: input.finishedDrop,
    dimension_unit: 'mm',
    selling_unit: 'pair',
    panels_per_pair: 2,
    pairs: input.pairs,
    fullness_ratio: input.fullnessRatio,
    lining_option: input.lining,
    heading_option: input.heading,
    installation_required: input.installation,
    measurement_service_required: input.measurementService,
    fabric_consumption: est?.consumption.totalFabric ?? null,
    stitching_charge: amount('stitching'),
    lining_charge: amount('lining'),
    heading_charge: amount('heading'),
    installation_charge: amount('installation'),
    estimated_total: est?.total ?? null,
    currency: 'INR',
    pricing_rule_version: store.pricing.rateCard.version,
    status: result.kind === 'estimate' ? 'estimated' : 'needs_confirmation',
    created_at: new Date().toISOString(),
  };
  savedQuotes.unshift(quote);
  return quote;
}

export const getSavedQuotes = () => [...savedQuotes];

/** Synchronous lookups for components that already hold ids. */
export const lookup = {
  variant: (id: string) => variantById.get(id) ?? null,
  product: (id: string) => summaryById.get(id) ?? null,
  allVariants: () => fabricVariants,
  allProductsSync: () => summaries,
};
