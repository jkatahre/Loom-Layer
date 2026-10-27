import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { store } from '../config/store';
import { categories } from '../data/categories';
import { fabricVariants } from '../data/fabricVariants';
import { productImages } from '../data/productImages';
import { products } from '../data/products';
import { reviews } from '../data/reviews';
import { variantSizePrices } from '../data/variantSizePrices';
import { applyCatalog, parseCatalogParams, toCatalogParams } from '../utils/catalogFilters';
import { validDiscountPct } from '../utils/currency';
import { calculateCustomQuoteSync, lookup, sizeIdsByProduct } from '../services/productService';
import { buildEnquiryMessage } from '../services/enquiryService';

const PUBLIC = path.resolve(__dirname, '../../public');
const exists = (url: string) => existsSync(path.join(PUBLIC, url));

describe('catalogue integrity', () => {
  it('has a realistic number of product × variant combinations', () => {
    expect(fabricVariants.length).toBeGreaterThanOrEqual(100);
    expect(fabricVariants.length).toBeLessThanOrEqual(160);
  });

  it('uses unique ids, slugs and SKUs', () => {
    const uniq = (xs: string[]) => new Set(xs).size === xs.length;
    expect(uniq(products.map((p) => p.id))).toBe(true);
    expect(uniq(products.map((p) => p.slug))).toBe(true);
    expect(uniq(products.map((p) => p.sku))).toBe(true);
    expect(uniq(fabricVariants.map((v) => v.variant_sku))).toBe(true);
    expect(categories).toHaveLength(20);
  });

  it('only references existing categories and rooms', () => {
    const ids = new Set(categories.map((c) => c.id));
    const rooms = new Set(store.home.rooms.map((r) => r.slug));
    for (const p of products) {
      expect(ids.has(p.category_id)).toBe(true);
      p.category_ids.forEach((c) => expect(ids.has(c), `${p.id} → ${c}`).toBe(true));
      p.rooms.forEach((r) => expect(rooms.has(r)).toBe(true));
    }
  });

  it('keeps MRP ≥ sale price and prices as integer paise', () => {
    for (const vsp of variantSizePrices) {
      if (vsp.sale_price == null) continue;
      expect(Number.isInteger(vsp.sale_price)).toBe(true);
      expect(vsp.mrp!).toBeGreaterThanOrEqual(vsp.sale_price);
    }
    for (const p of products.filter((x) => x.price_mode !== 'on_request')) {
      expect(p.base_price).toBeGreaterThanOrEqual(p.sale_price);
      expect(validDiscountPct(p.base_price, p.sale_price)).not.toBeNull();
    }
  });

  it('prices colourways and sizes differently where configured', () => {
    const prices = new Set(variantSizePrices.map((v) => v.sale_price));
    expect(prices.size).toBeGreaterThan(50);
  });

  it('only lists blackout performance that is explicitly declared', () => {
    for (const p of products.filter((x) => x.functional_types.includes('blackout'))) {
      expect(p.opacity === 'blackout' || p.lining_options.includes('blackout_lining')).toBe(true);
    }
  });

  it('flags every review as demo content', () => {
    expect(reviews.every((r) => r.is_demo)).toBe(true);
  });
});

describe('image paths', () => {
  const urls = new Set<string>([
    ...productImages.map((i) => i.url),
    ...categories.map((c) => c.image),
    ...store.home.rooms.map((r) => r.image.src),
    ...store.home.recentWork.map((w) => w.image.src),
    ...store.home.customSection.examples.map((e) => e.src),
    ...store.showroom.photos.map((p) => p.src),
    ...store.fabricFamilies.map((f) => f.image.src),
    ...(store.festival?.slides.map((s) => s.image) ?? []),
    store.home.hero.image.src,
    store.about.image.src,
    ...reviews.flatMap((r) => (r.photo ? [r.photo] : [])),
  ]);
  it.each([...urls])('%s exists', (url) => {
    expect(url.endsWith('.webp')).toBe(true);
    expect(exists(url)).toBe(true);
  });
});

describe('catalogue filters & URL state', () => {
  const all = lookup.allProductsSync();
  it('round-trips state through the query string', () => {
    const qs = 'category=blackout-curtains,linen-curtains&material=linen&sort=price-asc';
    const state = parseCatalogParams(new URLSearchParams(qs));
    expect(state.filters.category).toEqual(['blackout-curtains', 'linen-curtains']);
    expect(toCatalogParams(state).toString()).toBe(new URLSearchParams(qs).toString());
  });
  it('ignores an unknown sort', () => {
    expect(parseCatalogParams(new URLSearchParams('sort=bogus')).sort).toBe('featured');
  });
  it('filters by category, price band and search', () => {
    const blackout = applyCatalog(all, parseCatalogParams(new URLSearchParams('category=blackout-curtains')), sizeIdsByProduct);
    expect(blackout.length).toBeGreaterThan(0);
    expect(blackout.every((p) => p.category_ids.includes('blackout-curtains'))).toBe(true);

    const cheap = applyCatalog(all, parseCatalogParams(new URLSearchParams('price=under-2500')), sizeIdsByProduct);
    expect(cheap.every((p) => p.priceFrom! < 250000)).toBe(true);

    const bySku = applyCatalog(all, parseCatalogParams(new URLSearchParams('q=LL-VEL-005')), sizeIdsByProduct);
    expect(bySku.map((p) => p.id)).toEqual(['p-005']);
  });
  it('sorts by price ascending', () => {
    const sorted = applyCatalog(all, parseCatalogParams(new URLSearchParams('sort=price-asc')), sizeIdsByProduct).filter((p) => p.priceFrom != null);
    for (let i = 1; i < sorted.length; i++) expect(sorted[i]!.priceFrom!).toBeGreaterThanOrEqual(sorted[i - 1]!.priceFrom!);
  });
});

describe('service quote & enquiry', () => {
  it('estimates a real catalogue product', () => {
    const r = calculateCustomQuoteSync({
      productId: 'p-005', variantId: 'p-005-olv', finishedWidth: 2400, finishedDrop: 2600, displayUnit: 'in',
      pairs: 2, fullnessRatio: 2.5, heading: 'pinch_pleat', lining: 'blackout_lining', installation: true, measurementService: false,
      couponCode: 'DIWALI2000',
    }, new Date('2026-10-26T12:00:00+05:30'));
    expect(r.kind).toBe('estimate');
    if (r.kind === 'estimate') expect(r.discount).toBe(200000);
  });
  it('needs confirmation for a colourway without fabric specs', () => {
    const r = calculateCustomQuoteSync({
      productId: 'p-033', variantId: 'p-033-ind', finishedWidth: 2000, finishedDrop: 2400, displayUnit: 'cm',
      pairs: 1, fullnessRatio: 2, heading: 'pinch_pleat', lining: 'unlined', installation: false, measurementService: false,
    });
    expect(r.kind).toBe('needs_confirmation');
  });
  it('builds a WhatsApp message with all configuration details', () => {
    const msg = buildEnquiryMessage({
      kind: 'custom_quote', name: 'Asha', city: 'Town A', product: 'Olive Velvet', fabric: 'Olive', size: '94 × 102 in',
      price: '₹40,000 estimate', details: ['Pairs: 2', 'Lining: Blackout lining'], link: 'https://x.test/p',
    });
    expect(msg).toContain('Loom & Layer');
    expect(msg).toContain('• Pairs: 2');
    expect(msg).toContain('Name: Asha');
    expect(msg).toContain('Link: https://x.test/p');
  });
});
