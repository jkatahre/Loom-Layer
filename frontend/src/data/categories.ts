import type { Category } from '../types/product';
import { products } from './products';

/**
 * Curtain categories. A category's `id` equals its `slug`, so URLs such as
 * `/catalog?category=blackout-curtains` map directly to data.
 *
 * Categories describe different, independent attributes — function, material,
 * construction, pattern and room — and a product appears in every category it
 * qualifies for without being duplicated (see `category_ids` on products).
 */
const cat = (
  sort_order: number,
  slug: string,
  name: string,
  description: string,
  image: string,
  rooms: Category['rooms'],
  showWhenEmpty = false,
): Category => ({ id: slug, slug, name, description, image, rooms, showWhenEmpty, sort_order, image_position: '50% 45%' });

/** Room photo from a design's photo set (see productImages.ts). */
const img = (photo: number) => `/images/curtains/${photo}-1.webp`;

export const categories: Category[] = [
  cat(1, 'sheer-curtains', 'Sheer Curtains', 'Translucent voiles and linens that soften daylight while keeping privacy.', img(2), ['living-room', 'bedroom']),
  cat(2, 'blackout-curtains', 'Blackout Curtains', 'Tested blackout weaves and linings for deep, uninterrupted sleep.', img(22), ['bedroom', 'kids-room', 'hospitality']),
  cat(3, 'room-darkening-curtains', 'Room-Darkening Curtains', 'Dense fabrics that dim a room substantially without total blackout.', img(24), ['bedroom', 'home-office']),
  cat(4, 'linen-curtains', 'Linen Curtains', 'Natural linen and linen blends with an easy, lived-in drape.', img(15), ['living-room', 'dining-room']),
  cat(5, 'cotton-curtains', 'Cotton Curtains', 'Breathable, washable cottons for everyday rooms.', img(20), ['bedroom', 'kitchen', 'kids-room']),
  cat(6, 'velvet-curtains', 'Velvet Curtains', 'Plush velvets that add warmth, depth and quiet.', img(39), ['living-room', 'dining-room']),
  cat(7, 'polyester-curtains', 'Polyester Curtains', 'Durable, fade-resistant performance fabrics.', img(42), ['bedroom', 'hospitality']),
  cat(8, 'eyelet-curtains', 'Eyelet Curtains', 'Ring-top curtains with clean, modern folds that glide on a rod.', img(6), ['living-room', 'bedroom']),
  cat(9, 'pinch-pleat-curtains', 'Pinch-Pleat Curtains', 'Hand-pleated, tailored headings for formal rooms and tracks.', img(41), ['living-room', 'dining-room']),
  cat(10, 'rod-pocket-curtains', 'Rod-Pocket Curtains', 'Soft gathered channels — ideal for sheers and café panels.', img(13), ['kitchen', 'bedroom']),
  cat(11, 'pencil-pleat-curtains', 'Pencil-Pleat Curtains', 'Tape-gathered pencil folds that suit tracks and rods.', img(13), ['bedroom', 'dining-room']),
  cat(12, 'floral-curtains', 'Floral Curtains', 'Botanical prints, block prints and woven florals.', img(34), ['bedroom', 'living-room']),
  cat(13, 'geometric-curtains', 'Geometric Curtains', 'Stripes, checks, trellis and chevrons.', img(36), ['living-room', 'home-office']),
  cat(14, 'solid-colour-curtains', 'Solid-Colour Curtains', 'Plain colours from soft neutrals to deep jewel tones.', img(33), ['living-room', 'bedroom']),
  cat(15, 'textured-curtains', 'Textured Curtains', 'Slubs, weaves and jacquards you can feel.', img(3), ['living-room', 'home-office']),
  cat(16, 'printed-curtains', 'Printed Curtains', 'Hand-block, screen and digital prints.', img(38), ['living-room', 'kids-room']),
  cat(17, 'thermal-curtains', 'Thermal Curtains', 'Insulating fabrics that reduce heat from sun-facing windows.', img(25), ['bedroom', 'living-room']),
  cat(18, 'kids-curtains', "Kids' Curtains", 'Playful prints, many with room-darkening for naps.', img(43), ['kids-room']),
  cat(19, 'kitchen-curtains', 'Kitchen Curtains', 'Short, washable café curtains and panels.', img(20), ['kitchen']),
  cat(20, 'custom-made-curtains', 'Custom-Made Curtains', 'Designs made only to your measurements, with an itemised estimate.', img(17), ['living-room', 'bedroom', 'hospitality']),
];

/** Whether a category has designs to show (or is listed even when empty). Used to keep menus free of dead links. */
export const isCategoryListed = (slug: string) =>
  !!categories.find((c) => c.slug === slug)?.showWhenEmpty || products.some((p) => p.category_ids.includes(slug));
