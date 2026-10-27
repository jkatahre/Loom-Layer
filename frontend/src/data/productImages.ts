import type { HeadingStyle, ProductImage } from '../types/product';
import { fabricVariants } from './fabricVariants';
import { productById } from './products';

/**
 * Image records. File names follow the variant SKU so a showroom can replace
 * the generated placeholders with real photography without touching code:
 *
 *   /images/curtains/<variant-sku>.webp        front view of the pair
 *   /images/curtains/<variant-sku>-room.webp   the pair styled in a room
 *   /images/fabrics/<variant-sku>.webp         fabric close-up / swatch
 *   /images/details/heading-<heading>.webp     construction detail (shared)
 *   /images/details/lining.webp                lining / reverse (shared)
 */
export const headingImage = (h: HeadingStyle) => `/images/details/heading-${h.replace('_', '-')}.webp`;

const HEADING_ALT: Record<HeadingStyle, string> = {
  eyelet: 'Close-up of an eyelet heading with brushed metal rings',
  pinch_pleat: 'Close-up of hand-stitched triple pinch pleats',
  rod_pocket: 'Close-up of a rod-pocket heading gathered on a rod',
  pencil_pleat: 'Close-up of tightly gathered pencil-pleat heading',
};

export const productImages: ProductImage[] = [
  ...fabricVariants.flatMap((v): ProductImage[] => {
    const product = productById.get(v.product_id);
    const name = product?.name ?? 'Curtains';
    const sku = v.variant_sku.toLowerCase();
    return [
      { id: `${v.id}-main`, product_id: v.product_id, variant_id: v.id, type: 'main', url: `/images/curtains/${sku}.webp`, alt: `${name} in ${v.name}, front view of the pair on a rod`, sort_order: 1, position: '50% 40%' },
      { id: `${v.id}-room`, product_id: v.product_id, variant_id: v.id, type: 'lifestyle', url: `/images/curtains/${sku}-room.webp`, alt: `${name} in ${v.name} styled in a room`, sort_order: 2, position: '50% 50%' },
      { id: `${v.id}-swatch`, product_id: v.product_id, variant_id: v.id, type: 'fabric_swatch', url: `/images/fabrics/${sku}.webp`, alt: `Fabric close-up of ${v.name} showing the ${v.texture.replace('_', ' ')} texture`, sort_order: 3 },
    ];
  }),
  ...[...productById.values()].flatMap((p): ProductImage[] => {
    const heading = p.heading_options[0] ?? 'eyelet';
    const imgs: ProductImage[] = [
      { id: `${p.id}-detail`, product_id: p.id, variant_id: null, type: 'detail', url: headingImage(heading), alt: HEADING_ALT[heading], sort_order: 4 },
    ];
    if (p.lining_options.some((l) => l !== 'unlined')) {
      imgs.push({ id: `${p.id}-back`, product_id: p.id, variant_id: null, type: 'back', url: '/images/details/lining.webp', alt: 'Reverse of a lined curtain showing mitred corners and lining', sort_order: 5 });
    }
    return imgs;
  }),
];

/** Gallery for a product + selected variant: variant images first, then shared details. */
export function galleryFor(productId: string, variantId: string | null): ProductImage[] {
  return productImages
    .filter((img) => img.product_id === productId && (img.variant_id === null || img.variant_id === variantId))
    .sort((a, b) => a.sort_order - b.sort_order);
}
