import type { FabricVariant } from '../types/product';
import { adjustByPercent, rupees } from '../utils/currency';
import { productSeeds } from './products';

/**
 * Fabric variants (colourways). Each product design has one or more variants;
 * a variant carries its own colour, stock, fabric specification and images.
 *
 * `price_per_meter` is the SAMPLE fabric rate per running metre used by the
 * custom-quote engine. `null` means the showroom must confirm the rate.
 */
export const variantImageIds = (variantId: string) => [`${variantId}-main`, `${variantId}-room`, `${variantId}-swatch`];

export const fabricVariants: FabricVariant[] = productSeeds.flatMap((seed) =>
  seed.colourways.map(([code, name, family, hex, opts = {}]): FabricVariant => {
    const id = `${seed.id}-${code.toLowerCase()}`;
    const adj = opts.adj ?? 0;
    const basePpm = opts.ppm === undefined ? seed.ppm : opts.ppm;
    return {
      id,
      product_id: seed.id,
      variant_sku: `${seed.sku}-${code}`,
      name,
      material: seed.material,
      color: family,
      color_hex: hex,
      pattern: seed.patterns[0] ?? 'solid',
      texture: seed.texture,
      opacity: seed.opacity,
      fabric_roll_width_cm: opts.roll === undefined ? seed.roll : opts.roll,
      pattern_repeat_cm: seed.repeat ?? null,
      railroadable: seed.railroad ?? false,
      price_per_meter: basePpm == null ? null : adjustByPercent(rupees(basePpm), adj),
      price_adjustment_pct: adj,
      stock_status: opts.stock ?? (seed.standard === false || seed.mode === 'on_request' ? 'made_to_order' : 'in_stock'),
      images: variantImageIds(id),
      status: 'active',
    };
  }),
);

export const variantById = new Map(fabricVariants.map((v) => [v.id, v]));

export function variantsForProduct(productId: string): FabricVariant[] {
  return fabricVariants.filter((v) => v.product_id === productId && v.status === 'active');
}
