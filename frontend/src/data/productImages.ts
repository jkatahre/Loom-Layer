import type { HeadingStyle, ProductImage } from '../types/product';
import { fabricVariants } from './fabricVariants';
import { productById, seedById } from './products';

/**
 * Each design has a numbered photo set (`photo` on its catalogue entry):
 *
 *   /images/curtains/<N>-1.webp   styled in a room   (catalogue card, first gallery image)
 *   /images/details/<N>-0.webp    front view          (card hover, gallery)
 *   /images/fabrics/<N>-2.webp    fabric close-up     (gallery, fabric swatch)
 *   /images/details/<N>-3.webp    heading close-up    (gallery)
 *
 * To change a photo, save the new one over the file with the same name.
 */
export const productPhotos = (n: number) => ({
  room: `/images/curtains/${n}-1.webp`,
  front: `/images/details/${n}-0.webp`,
  fabric: `/images/fabrics/${n}-2.webp`,
  heading: `/images/details/${n}-3.webp`,
});

const photosOf = (productId: string) => productPhotos(seedById.get(productId)?.photo ?? 0);

/** Fabric close-up for a colourway's swatch. */
export const swatchImage = (variant: { product_id: string }) => photosOf(variant.product_id).fabric;

/** Heading close-ups from the showroom's photos; styles without one show no picture. */
const HEADING_PHOTO: Partial<Record<HeadingStyle, string>> = {
  eyelet: productPhotos(2).heading,
  pinch_pleat: productPhotos(41).heading,
};
export const headingImage = (h: HeadingStyle): string | null => HEADING_PHOTO[h] ?? null;

export const productImages: ProductImage[] = fabricVariants.flatMap((v): ProductImage[] => {
  const name = productById.get(v.product_id)?.name ?? 'Curtains';
  const photos = photosOf(v.product_id);
  const base = { product_id: v.product_id, variant_id: v.id };
  return [
    { ...base, id: `${v.id}-main`, type: 'main', url: photos.room, alt: `${name} in ${v.name}, styled in a living room`, sort_order: 1 },
    { ...base, id: `${v.id}-room`, type: 'lifestyle', url: photos.front, alt: `${name} in ${v.name}, front view of the pair on a rod`, sort_order: 2 },
    { ...base, id: `${v.id}-swatch`, type: 'fabric_swatch', url: photos.fabric, alt: `Fabric close-up of ${v.name}`, sort_order: 3 },
    { ...base, id: `${v.id}-detail`, type: 'detail', url: photos.heading, alt: `Heading close-up of ${name}`, sort_order: 4 },
  ];
});

/** Gallery for a product + selected variant. */
export function galleryFor(productId: string, variantId: string | null): ProductImage[] {
  return productImages
    .filter((img) => img.product_id === productId && (img.variant_id === null || img.variant_id === variantId))
    .sort((a, b) => a.sort_order - b.sort_order);
}
