import type { Paise, SizeOption } from '../types/product';
import { adjustByPercent, rupees, toRetailPrice } from '../utils/currency';
import { inchesToMm } from '../utils/units';

/**
 * Standard ready-made sizes.
 *
 * WIDTH BASIS: `finished_width` is the flat finished width of ONE panel
 * (`width_basis: 'per_panel'`). A pair is two such panels, so a 54 in pair
 * has 108 in of fabric width and comfortably dresses a rod of about
 * `recommended_rod_width` with gentle gathers.
 */
const size = (id: string, label: string, use_case: string, widthIn: number, dropIn: number): SizeOption => {
  const finished_width = inchesToMm(widthIn);
  return {
    id,
    label,
    use_case,
    size_type: 'standard',
    width_basis: 'per_panel',
    finished_width,
    finished_drop: inchesToMm(dropIn),
    dimension_unit: 'mm',
    selling_unit: 'pair',
    panels_per_pair: 2,
    // Pair fabric width ÷ 1.8 gathers, rounded to the nearest cm.
    recommended_rod_width: Math.round((finished_width * 2) / 1.8 / 10) * 10,
    is_available: true,
  };
};

export const sizeOptions: SizeOption[] = [
  size('short-4', 'Café · 44 × 48 in', 'Kitchen / small window', 44, 48),
  size('win-5', 'Window · 54 × 60 in', 'Standard window (5 ft drop)', 54, 60),
  size('door-7', 'Door · 54 × 84 in', 'Door or tall window (7 ft drop)', 54, 84),
  size('door-8', 'Long door · 54 × 96 in', 'High door (8 ft drop)', 54, 96),
  size('tall-9', 'Floor-to-ceiling · 54 × 108 in', 'Floor-to-ceiling (9 ft drop)', 54, 108),
  size('wide-9', 'Wide · 90 × 108 in', 'Wide window, floor-to-ceiling', 90, 108),
];

export const sizeById = new Map(sizeOptions.map((s) => [s.id, s]));

/** Relative fabric/making cost of each size, used to derive sample prices. */
export const SIZE_PRICE_FACTORS: Record<string, number> = {
  'short-4': 0.55,
  'win-5': 0.82,
  'door-7': 1,
  'door-8': 1.12,
  'tall-9': 1.25,
  'wide-9': 2,
};

/**
 * Derive a sample price for a size from a reference price. Results are
 * rounded to retail price points (₹…99) so the list looks realistic.
 */
export function derivePrice(referencePrice: Paise, refSizeId: string, sizeId: string, adjustmentPct = 0): Paise {
  const ratio = (SIZE_PRICE_FACTORS[sizeId] ?? 1) / (SIZE_PRICE_FACTORS[refSizeId] ?? 1);
  return toRetailPrice(adjustByPercent(Math.round(referencePrice * ratio), adjustmentPct));
}

export function derivePricePair(mrpRupees: number, saleRupees: number, refSizeId: string, sizeId: string, adjustmentPct = 0) {
  const sale = derivePrice(rupees(saleRupees), refSizeId, sizeId, adjustmentPct);
  const mrp = derivePrice(rupees(mrpRupees), refSizeId, sizeId, adjustmentPct);
  return { sale, mrp: mrp > sale ? mrp : sale };
}
