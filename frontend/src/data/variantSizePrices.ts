import type { VariantSizePrice } from '../types/product';
import { fabricVariants } from './fabricVariants';
import { refSizeOf, seedById, STANDARD_SIZES } from './products';
import { derivePricePair } from './sizeOptions';

/**
 * Price list joining each fabric variant to each standard size it is offered
 * in. Different colourways and sizes carry different prices — never assume
 * one price fits all. SAMPLE prices for demonstration only.
 */
export const variantSizePrices: VariantSizePrice[] = fabricVariants.flatMap((variant) => {
  const seed = seedById.get(variant.product_id);
  if (!seed || seed.standard === false) return [];
  const sizes = seed.sizes ?? STANDARD_SIZES;
  const colourway = seed.colourways.find(([code]) => `${seed.id}-${code.toLowerCase()}` === variant.id);
  const unavailable = new Set(colourway?.[4]?.unavailable ?? []);
  const outOfStock = variant.stock_status === 'out_of_stock';
  const onRequest = seed.mode === 'on_request';

  return sizes.map((sizeId): VariantSizePrice => {
    const prices = onRequest
      ? { mrp: null, sale: null }
      : derivePricePair(seed.mrp, seed.sale, refSizeOf(seed), sizeId, variant.price_adjustment_pct);
    return {
      id: `${variant.id}-${sizeId}`,
      variant_id: variant.id,
      size_option_id: sizeId,
      mrp: prices.mrp,
      sale_price: prices.sale,
      price_mode: seed.mode ?? 'fixed',
      currency: 'INR',
      is_available: !outOfStock && !unavailable.has(sizeId),
    };
  });
});
