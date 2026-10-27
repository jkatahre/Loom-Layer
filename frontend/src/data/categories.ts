import type { Category } from '../types/product';

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

const img = (sku: string, kind: 'room' | 'main' = 'room') =>
  `/images/curtains/${sku.toLowerCase()}${kind === 'room' ? '-room' : ''}.webp`;

export const categories: Category[] = [
  cat(1, 'sheer-curtains', 'Sheer Curtains', 'Translucent voiles and linens that soften daylight while keeping privacy.', img('LL-SHR-001-SAN'), ['living-room', 'bedroom']),
  cat(2, 'blackout-curtains', 'Blackout Curtains', 'Tested blackout weaves and linings for deep, uninterrupted sleep.', img('LL-BLK-002-MID'), ['bedroom', 'kids-room', 'hospitality']),
  cat(3, 'room-darkening-curtains', 'Room-Darkening Curtains', 'Dense fabrics that dim a room substantially without total blackout.', img('LL-RDK-011-CHA'), ['bedroom', 'home-office']),
  cat(4, 'linen-curtains', 'Linen Curtains', 'Natural linen and linen blends with an easy, lived-in drape.', img('LL-LIN-027-FLX'), ['living-room', 'dining-room']),
  cat(5, 'cotton-curtains', 'Cotton Curtains', 'Breathable, washable cottons for everyday rooms.', img('LL-COT-021-SAG'), ['bedroom', 'kitchen', 'kids-room']),
  cat(6, 'velvet-curtains', 'Velvet Curtains', 'Plush velvets that add warmth, depth and quiet.', img('LL-VEL-005-OLV'), ['living-room', 'dining-room']),
  cat(7, 'polyester-curtains', 'Polyester Curtains', 'Durable, fade-resistant performance fabrics.', img('LL-THM-022-GRA'), ['bedroom', 'hospitality']),
  cat(8, 'eyelet-curtains', 'Eyelet Curtains', 'Ring-top curtains with clean, modern folds that glide on a rod.', img('LL-TXT-003-IVO'), ['living-room', 'bedroom']),
  cat(9, 'pinch-pleat-curtains', 'Pinch-Pleat Curtains', 'Hand-pleated, tailored headings for formal rooms and tracks.', img('LL-JAQ-020-MAR'), ['living-room', 'dining-room']),
  cat(10, 'rod-pocket-curtains', 'Rod-Pocket Curtains', 'Soft gathered channels — ideal for sheers and café panels.', img('LL-VOI-009-WHT'), ['kitchen', 'bedroom']),
  cat(11, 'pencil-pleat-curtains', 'Pencil-Pleat Curtains', 'Tape-gathered pencil folds that suit tracks and rods.', img('LL-PCL-023-CRM'), ['bedroom', 'dining-room']),
  cat(12, 'floral-curtains', 'Floral Curtains', 'Botanical prints, block prints and woven florals.', img('LL-FLR-004-SAG'), ['bedroom', 'living-room']),
  cat(13, 'geometric-curtains', 'Geometric Curtains', 'Stripes, checks, trellis and chevrons.', img('LL-GEO-026-GRY'), ['living-room', 'home-office']),
  cat(14, 'solid-colour-curtains', 'Solid-Colour Curtains', 'Plain colours from soft neutrals to deep jewel tones.', img('LL-COT-021-ROS'), ['living-room', 'bedroom']),
  cat(15, 'textured-curtains', 'Textured Curtains', 'Slubs, weaves and jacquards you can feel.', img('LL-HRB-010-OAT'), ['living-room', 'home-office']),
  cat(16, 'printed-curtains', 'Printed Curtains', 'Hand-block, screen and digital prints.', img('LL-BLP-016-TER'), ['living-room', 'kids-room']),
  cat(17, 'thermal-curtains', 'Thermal Curtains', 'Insulating fabrics that reduce heat from sun-facing windows.', img('LL-THM-006-BEI'), ['bedroom', 'living-room']),
  cat(18, 'kids-curtains', "Kids' Curtains", 'Playful prints, many with room-darkening for naps.', img('LL-KID-012-NAV'), ['kids-room']),
  cat(19, 'kitchen-curtains', 'Kitchen Curtains', 'Short, washable café curtains and panels.', img('LL-KIT-014-OLV'), ['kitchen']),
  cat(20, 'custom-made-curtains', 'Custom-Made Curtains', 'Designs made only to your measurements, with an itemised estimate.', img('LL-CUS-033-FLX'), ['living-room', 'bedroom', 'hospitality'], true),
];
