import type { ProductSummary } from '../types/product';
import { FUNCTION_LABELS, MATERIAL_LABELS, PATTERN_LABELS, TEXTURE_LABELS } from './labels';

/**
 * Catalogue filter state ⇄ URL query string. Every filter is a comma-separated
 * list so URLs stay short and shareable:
 *   /catalog?category=blackout-curtains,linen-curtains&material=linen&sort=price-asc
 */

export const FILTER_KEYS = [
  'room',
  'category',
  'price',
  'material',
  'color',
  'pattern',
  'texture',
  'function',
  'heading',
  'lining',
  'sizing',
  'size',
  'availability',
  'mode',
] as const;
export type FilterKey = (typeof FILTER_KEYS)[number];

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name-asc';
export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name-asc', label: 'Name: A–Z' },
];

/** Price bands in rupees, applied to the product's lowest price for its selling unit (normally one pair). */
export const PRICE_BANDS = [
  { value: 'under-2500', label: 'Under ₹2,500', min: 0, max: 2500 },
  { value: '2500-5000', label: '₹2,500 – ₹5,000', min: 2500, max: 5000 },
  { value: '5000-10000', label: '₹5,000 – ₹10,000', min: 5000, max: 10000 },
  { value: 'above-10000', label: 'Above ₹10,000', min: 10000, max: Infinity },
] as const;

export interface CatalogState {
  q: string;
  sort: SortKey;
  filters: Record<FilterKey, string[]>;
}

const emptyFilters = (): Record<FilterKey, string[]> =>
  Object.fromEntries(FILTER_KEYS.map((k) => [k, [] as string[]])) as unknown as Record<FilterKey, string[]>;

export function parseCatalogParams(params: URLSearchParams): CatalogState {
  const filters = emptyFilters();
  for (const key of FILTER_KEYS) {
    const raw = params.get(key);
    if (raw) filters[key] = [...new Set(raw.split(',').map((s) => s.trim()).filter(Boolean))];
  }
  const sort = params.get('sort') as SortKey | null;
  return {
    q: params.get('q')?.trim() ?? '',
    sort: sort && SORT_OPTIONS.some((o) => o.value === sort) ? sort : 'featured',
    filters,
  };
}

export function toCatalogParams(state: CatalogState): URLSearchParams {
  const p = new URLSearchParams();
  if (state.q) p.set('q', state.q);
  for (const key of FILTER_KEYS) if (state.filters[key].length) p.set(key, state.filters[key].join(','));
  if (state.sort !== 'featured') p.set('sort', state.sort);
  return p;
}

export const activeFilterCount = (s: CatalogState) => FILTER_KEYS.reduce((n, k) => n + s.filters[k].length, 0);

/** Text every search token is matched against. */
export function searchHaystack(p: ProductSummary): string {
  return [
    p.name,
    p.sku,
    p.fabric_collection,
    MATERIAL_LABELS[p.fabric_material],
    p.fabric_material,
    TEXTURE_LABELS[p.texture],
    ...p.patterns.map((x) => PATTERN_LABELS[x]),
    ...p.functional_types.map((x) => FUNCTION_LABELS[x]),
    ...p.colors,
    ...p.variants.flatMap((v) => [v.name, v.variant_sku]),
    ...p.rooms,
    p.style,
  ]
    .join(' ')
    .toLowerCase()
    .replace(/[-_]/g, ' ');
}

export function matchesSearch(p: ProductSummary, q: string): boolean {
  const tokens = q.toLowerCase().replace(/[-_]/g, ' ').split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const hay = searchHaystack(p);
  return tokens.every((t) => hay.includes(t));
}

const any = (selected: string[], values: readonly string[]) => selected.length === 0 || selected.some((s) => values.includes(s));

/** Does a product pass one filter group? Exported for facet counts. */
export function passesFilter(p: ProductSummary, key: FilterKey, selected: string[], sizeIdsByProduct: Map<string, string[]>): boolean {
  if (selected.length === 0) return true;
  switch (key) {
    case 'room':
      return any(selected, p.rooms);
    case 'category':
      return any(selected, p.category_ids);
    case 'price': {
      if (p.priceFrom == null) return false;
      const r = p.priceFrom / 100;
      return selected.some((v) => {
        const band = PRICE_BANDS.find((b) => b.value === v);
        return band ? r >= band.min && r < band.max : false;
      });
    }
    case 'material':
      return any(selected, [p.fabric_material]);
    case 'color':
      return any(selected, p.colors);
    case 'pattern':
      return any(selected, p.patterns);
    case 'texture':
      return any(selected, [p.texture]);
    case 'function':
      return any(selected, p.functional_types);
    case 'heading':
      return any(selected, p.heading_options);
    case 'lining':
      return any(selected, p.lining_options);
    case 'sizing':
      return selected.some((v) => (v === 'standard' ? p.standard_sizing_enabled : v === 'custom' ? p.custom_sizing_enabled : false));
    case 'size':
      return any(selected, sizeIdsByProduct.get(p.id) ?? []);
    case 'availability':
      return selected.some((v) =>
        v === 'in_showroom'
          ? p.in_showroom
          : p.variants.some((variant) => variant.stock_status === v || (v === 'in_stock' && variant.stock_status === 'low_stock')),
      );
    case 'mode':
      return any(selected, [p.price_mode]);
  }
}

export function sortProducts(list: ProductSummary[], sort: SortKey): ProductSummary[] {
  const out = [...list];
  const price = (p: ProductSummary, missing: number) => p.priceFrom ?? missing;
  switch (sort) {
    case 'newest':
      return out.sort((a, b) => b.created_at.localeCompare(a.created_at));
    case 'price-asc':
      return out.sort((a, b) => price(a, Infinity) - price(b, Infinity));
    case 'price-desc':
      return out.sort((a, b) => price(b, -Infinity) - price(a, -Infinity));
    case 'name-asc':
      return out.sort((a, b) => a.name.localeCompare(b.name, 'en-IN'));
    default:
      return out.sort((a, b) => a.featured_rank - b.featured_rank);
  }
}

export function applyCatalog(list: ProductSummary[], state: CatalogState, sizeIdsByProduct: Map<string, string[]>): ProductSummary[] {
  const filtered = list.filter(
    (p) => matchesSearch(p, state.q) && FILTER_KEYS.every((k) => passesFilter(p, k, state.filters[k], sizeIdsByProduct)),
  );
  return sortProducts(filtered, state.sort);
}

/** Count matches for each facet value given every OTHER active filter. */
export function facetCount(
  list: ProductSummary[],
  state: CatalogState,
  key: FilterKey,
  value: string,
  sizeIdsByProduct: Map<string, string[]>,
): number {
  return list.filter(
    (p) =>
      matchesSearch(p, state.q) &&
      FILTER_KEYS.every((k) => (k === key ? passesFilter(p, k, [value], sizeIdsByProduct) : passesFilter(p, k, state.filters[k], sizeIdsByProduct))),
  ).length;
}
