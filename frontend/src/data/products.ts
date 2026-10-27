import type {
  ColourFamily,
  DesignStyle,
  FunctionalType,
  HeadingStyle,
  LiningOption,
  Material,
  Opacity,
  Pattern,
  PriceMode,
  Product,
  RoomSlug,
  SellingUnit,
  StockStatus,
  Texture,
} from '../types/product';
import { derivePricePair, sizeById } from './sizeOptions';

/**
 * SAMPLE CATALOGUE — illustrative designs and INR prices for demonstration.
 * Prices are not market data. Replace with your own range before launch.
 *
 * Each seed describes one curtain design plus its colourways. `mrp` / `sale`
 * are rupee prices for ONE PAIR (or one panel when `sellingUnit: 'panel'`)
 * in the reference size `refSize`, for the first colourway. Prices for other
 * sizes and colourways are derived in `sizeOptions.ts`.
 */

export interface ColourwayOptions {
  /** % price adjustment for this colourway. */
  adj?: number;
  stock?: StockStatus;
  /** Override the design's fabric rate (rupees / metre); `null` = showroom to confirm. */
  ppm?: number | null;
  /** Override roll width (cm); `null` = unconfirmed. */
  roll?: number | null;
  /** Standard size ids NOT available in this colourway. */
  unavailable?: string[];
}

export type Colourway = [code: string, name: string, family: ColourFamily, hex: string, opts?: ColourwayOptions];

export interface ProductSeed {
  id: string;
  sku: string;
  name: string;
  description: string;
  mrp: number;
  sale: number;
  mode?: PriceMode;
  refSize?: string;
  sizes?: string[];
  sellingUnit?: SellingUnit;
  material: Material;
  collection: string;
  texture: Texture;
  patterns: Pattern[];
  functional: FunctionalType[];
  opacity: Opacity;
  style: DesignStyle;
  headings: HeadingStyle[];
  linings: LiningOption[];
  rooms: RoomSlug[];
  primary: string;
  extraCategories?: string[];
  custom?: boolean;
  standard?: boolean;
  /** Fabric rate in rupees per running metre (GST inclusive). */
  ppm: number | null;
  /** Roll width in cm. */
  roll: number | null;
  repeat?: number | null;
  railroad?: boolean;
  lead?: 'standard' | 'luxe';
  showroom?: boolean;
  bestseller?: boolean;
  created: string;
  buyUrl?: string;
  care?: string[];
  warranty?: string;
  colourways: Colourway[];
}

export const STANDARD_SIZES = ['win-5', 'door-7', 'door-8', 'tall-9'];
const KITCHEN_SIZES = ['short-4', 'win-5'];
const HOSPITALITY_SIZES = ['door-8', 'tall-9', 'wide-9'];

const CARE = {
  wash: ['Gentle machine wash at 30 °C', 'Line dry in shade', 'Warm iron on reverse'],
  dry: ['Dry clean only', 'Vacuum gently with a soft brush', 'Steam to release creases'],
  sheer: ['Hand wash or delicate cycle, cold', 'Hang while damp to drop creases', 'Do not wring'],
  blackout: ['Gentle machine wash, cold', 'Do not tumble dry', 'Cool iron on the fabric side only'],
};

export const productSeeds: ProductSeed[] = [
  {
    id: 'p-001', sku: 'LL-SHR-001', name: 'Sandstone Linen Sheer Curtains',
    description: 'An airy linen-blend sheer with a soft natural slub. It filters harsh daylight into a warm glow while keeping the view — lovely on its own or layered behind a heavier drape.',
    mrp: 4499, sale: 3499, material: 'linen_blend', collection: 'Coastline Linens', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'rod_pocket', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom'], primary: 'sheer-curtains', ppm: 690, roll: 280, railroad: true, showroom: true, bestseller: true,
    created: '2026-08-14', care: CARE.sheer,
    colourways: [['SAN', 'Sandstone', 'beige', '#D8C3A5'], ['IVO', 'Ivory', 'ivory', '#EFE6D2'], ['MST', 'Mist Grey', 'grey', '#C9C6BF', { adj: 3 }]],
  },
  {
    id: 'p-002', sku: 'LL-BLK-002', name: 'Midnight Blackout Curtains',
    description: 'A triple-weave blackout fabric with a soft matte face. The dense black core blocks most daylight, so the colour you choose is purely about style — even the lighter shades darken the room.',
    mrp: 5999, sale: 4299, material: 'polyester', collection: 'Deep Sleep', texture: 'smooth', patterns: ['solid'],
    functional: ['blackout'], opacity: 'blackout', style: 'Contemporary', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['bedroom', 'kids-room', 'hospitality'], primary: 'blackout-curtains', ppm: 590, roll: 280, railroad: true, bestseller: true, showroom: true,
    created: '2026-06-02', care: CARE.blackout,
    colourways: [
      ['MID', 'Midnight Navy', 'blue', '#1F2A44'], ['CHA', 'Charcoal', 'charcoal', '#3A3734'],
      ['TAU', 'Taupe', 'brown', '#8C7B6B', { adj: -2 }], ['STN', 'Stone', 'grey', '#B9B1A6', { adj: -2, stock: 'low_stock' }],
    ],
  },
  {
    id: 'p-003', sku: 'LL-TXT-003', name: 'Ivory Textured Eyelet Curtains',
    description: 'A tactile basket-weave in poly-viscose that softens bright light without making a room dim. Brushed-nickel eyelets give clean, even folds that glide easily on a rod.',
    mrp: 4999, sale: 3799, material: 'poly_viscose', collection: 'Weaver’s Edit', texture: 'basket_weave', patterns: ['textured'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Contemporary', headings: ['eyelet'], linings: ['unlined', 'cotton_lining', 'blackout_lining'],
    rooms: ['living-room', 'home-office'], primary: 'eyelet-curtains', ppm: 640, roll: 140, bestseller: true, showroom: true,
    created: '2026-05-20', care: CARE.wash,
    colourways: [['IVO', 'Ivory', 'ivory', '#EFE6D2'], ['OAT', 'Oat', 'beige', '#D9CBB3'], ['PEB', 'Pebble', 'grey', '#B5ADA2', { adj: 2 }]],
  },
  {
    id: 'p-004', sku: 'LL-FLR-004', name: 'Botanical Floral Cotton Curtains',
    description: 'Hand-drawn leaves and blooms printed on soft, breathable cotton. Add a cotton or blackout lining for bedrooms, or hang unlined for a lighter cottage feel.',
    mrp: 5499, sale: 4199, material: 'cotton', collection: 'Garden Room', texture: 'smooth', patterns: ['floral'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Classic', headings: ['eyelet', 'pencil_pleat'], linings: ['unlined', 'cotton_lining', 'blackout_lining'],
    rooms: ['bedroom', 'living-room'], primary: 'floral-curtains', extraCategories: ['printed-curtains'], ppm: 520, roll: 140, repeat: 64, bestseller: true,
    created: '2026-07-11', care: CARE.wash,
    colourways: [['SAG', 'Sage Garden', 'green', '#9AA88A'], ['BLU', 'Blush Garden', 'pink', '#D9A5A0'], ['IND', 'Indigo Garden', 'blue', '#3E5A78', { adj: 4 }]],
  },
  {
    id: 'p-005', sku: 'LL-VEL-005', name: 'Olive Velvet Living Room Curtains',
    description: 'A dense cotton-feel velvet with a soft lustre that changes with the light. Its heavy pile dims the room, muffles sound and drapes in deep, sculptural folds.',
    mrp: 11999, sale: 8999, material: 'velvet', collection: 'Salon Velvets', texture: 'plush', patterns: ['solid'],
    functional: ['room_darkening'], opacity: 'room_darkening', style: 'Luxe', headings: ['pinch_pleat', 'eyelet'], linings: ['cotton_lining', 'blackout_lining', 'thermal_lining'],
    rooms: ['living-room', 'dining-room', 'hospitality'], primary: 'velvet-curtains', ppm: 1150, roll: 140, lead: 'luxe', showroom: true, bestseller: true,
    created: '2026-09-05', care: CARE.dry,
    colourways: [
      ['OLV', 'Olive', 'green', '#5E6B45'], ['EMR', 'Emerald', 'green', '#1F5A4A', { adj: 3 }], ['RST', 'Rust', 'brown', '#9A4A2A'],
      ['MDN', 'Midnight', 'blue', '#1F2A44'], ['CHP', 'Champagne', 'beige', '#CDB891', { adj: 5, unavailable: ['tall-9'] }],
    ],
  },
  {
    id: 'p-006', sku: 'LL-THM-006', name: 'Beige Thermal Bedroom Curtains',
    description: 'A three-pass coated thermal fabric that blocks most light and helps reduce heat gain on sun-facing windows. The soft beige face suits calm, neutral bedrooms.',
    mrp: 6499, sale: 4799, material: 'polyester', collection: 'Deep Sleep', texture: 'smooth', patterns: ['solid'],
    functional: ['thermal', 'blackout'], opacity: 'blackout', style: 'Contemporary', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['bedroom', 'home-office'], primary: 'thermal-curtains', ppm: 650, roll: 280, railroad: true, bestseller: true,
    created: '2026-04-18', care: CARE.blackout,
    colourways: [['BEI', 'Beige', 'beige', '#D8C3A5'], ['DOV', 'Dove Grey', 'grey', '#A5A29C'], ['MOC', 'Mocha', 'brown', '#7A5C48', { adj: 2 }]],
  },
  {
    id: 'p-007', sku: 'LL-STR-007', name: 'Minimal Stripe Custom Curtains',
    description: 'A crisp yarn-dyed stripe in a cotton blend, made only to your measurements. The vertical stripe visually lifts the ceiling — ideal for studies and modern living rooms.',
    mrp: 7999, sale: 6499, mode: 'starting_from', material: 'cotton_blend', collection: 'Atelier Made-to-Measure', texture: 'smooth', patterns: ['striped'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Minimal', headings: ['pencil_pleat', 'pinch_pleat', 'eyelet'],
    linings: ['unlined', 'cotton_lining', 'blackout_lining', 'thermal_lining'], rooms: ['living-room', 'home-office'], primary: 'custom-made-curtains',
    extraCategories: ['geometric-curtains'], standard: false, ppm: 610, roll: 140,
    created: '2026-09-28', care: CARE.wash,
    colourways: [['NAV', 'Navy Stripe', 'blue', '#3E5A78'], ['CHS', 'Charcoal Stripe', 'charcoal', '#3A3734'], ['SND', 'Sand Stripe', 'beige', '#D8C3A5']],
  },
  {
    id: 'p-008', sku: 'LL-JAQ-008', name: 'Aurelia Gold Jacquard Curtains',
    description: 'A woven jacquard with an Art-Deco fan motif that catches lamplight. The weight of the weave dims the room and gives formal, structured folds.',
    mrp: 9999, sale: 7499, material: 'polyester', collection: 'Heritage Weaves', texture: 'jacquard', patterns: ['geometric'],
    functional: ['room_darkening'], opacity: 'room_darkening', style: 'Luxe', headings: ['pinch_pleat', 'eyelet'], linings: ['cotton_lining', 'blackout_lining'],
    rooms: ['living-room', 'dining-room', 'hospitality'], primary: 'textured-curtains', ppm: 890, roll: 140, repeat: 34, lead: 'luxe', showroom: true,
    created: '2026-08-30', care: CARE.dry,
    colourways: [['GLD', 'Antique Gold', 'yellow', '#B8A27C'], ['SSG', 'Silver Sage', 'green', '#A8AE9C'], ['WIN', 'Wine', 'red', '#6B2232', { adj: 3 }]],
  },
  {
    id: 'p-009', sku: 'LL-VOI-009', name: 'Cloud White Voile Sheer Curtains',
    description: 'A fine, floaty voile that diffuses sunlight and gives daytime privacy. Wide-width fabric means seamless panels even on tall windows.',
    mrp: 2999, sale: 1999, material: 'polyester', collection: 'Everyday Sheers', texture: 'voile', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['rod_pocket', 'eyelet', 'pencil_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'kitchen', 'hospitality'], primary: 'sheer-curtains', ppm: 290, roll: 300, railroad: true, bestseller: true,
    created: '2026-03-12', care: CARE.sheer, buyUrl: 'https://example.com/buy/cloud-white-voile', // SAMPLE external checkout
    colourways: [['WHT', 'Cloud White', 'white', '#F7F5F0'], ['IVO', 'Ivory', 'ivory', '#EFE6D2']],
  },
  {
    id: 'p-010', sku: 'LL-HRB-010', name: 'Herringbone Linen Blend Curtains',
    description: 'A subtle herringbone woven in a linen blend, with enough body to hang beautifully in pinch pleats. Light filters gently through the weave.',
    mrp: 7999, sale: 6299, material: 'linen_blend', collection: 'Coastline Linens', texture: 'herringbone', patterns: ['textured'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Classic', headings: ['pinch_pleat', 'eyelet'], linings: ['unlined', 'cotton_lining', 'blackout_lining'],
    rooms: ['living-room', 'dining-room', 'home-office'], primary: 'textured-curtains', extraCategories: ['geometric-curtains'], ppm: 820, roll: 140, showroom: true,
    created: '2026-07-24', care: CARE.dry,
    colourways: [['OAT', 'Oat', 'beige', '#D9CBB3'], ['SLT', 'Slate', 'grey', '#6B6F73'], ['TER', 'Terracotta', 'brown', '#A85B3E', { adj: 3 }]],
  },
  {
    id: 'p-011', sku: 'LL-RDK-011', name: 'Charcoal Room-Darkening Linen-Look Curtains',
    description: 'The relaxed look of linen in a dense poly-viscose that dims bright rooms substantially. A good choice for studies and bedrooms where full blackout is not needed.',
    mrp: 5999, sale: 4499, material: 'poly_viscose', collection: 'Weaver’s Edit', texture: 'slub', patterns: ['solid'],
    functional: ['room_darkening'], opacity: 'room_darkening', style: 'Contemporary', headings: ['eyelet'], linings: ['unlined', 'blackout_lining'],
    rooms: ['bedroom', 'home-office'], primary: 'room-darkening-curtains', ppm: 610, roll: 140,
    created: '2026-02-08', care: CARE.wash,
    colourways: [['CHA', 'Charcoal', 'charcoal', '#3A3734'], ['ASH', 'Ash', 'grey', '#8E8B86'], ['WAL', 'Walnut', 'brown', '#5A4033']],
  },
  {
    id: 'p-012', sku: 'LL-KID-012', name: "Kids' Starry Night Blackout Curtains",
    description: 'A sprinkle of printed stars on a full blackout fabric for better daytime naps. Wipe-friendly finish and soft, child-safe eyelets.',
    mrp: 4499, sale: 3299, material: 'polyester', collection: 'Little Rooms', texture: 'smooth', patterns: ['abstract'],
    functional: ['blackout'], opacity: 'blackout', style: 'Playful', headings: ['eyelet'], linings: ['unlined'],
    rooms: ['kids-room'], primary: 'kids-curtains', extraCategories: ['printed-curtains'], ppm: 560, roll: 280, railroad: false,
    created: '2026-06-21', care: CARE.blackout,
    colourways: [['NAV', 'Navy Stars', 'blue', '#1F2A44'], ['BLS', 'Blush Stars', 'pink', '#D9A5A0'], ['MNT', 'Mint Stars', 'green', '#A8C5B5']],
  },
  {
    id: 'p-013', sku: 'LL-KID-013', name: 'Little Explorer Printed Cotton Curtains',
    description: 'Cheerful hand-drawn triangles and hills on pure cotton. Add a blackout lining for nap time or keep them unlined for a sunny playroom.',
    mrp: 3999, sale: 2999, material: 'cotton', collection: 'Little Rooms', texture: 'smooth', patterns: ['geometric'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Playful', headings: ['eyelet', 'rod_pocket'], linings: ['unlined', 'blackout_lining'],
    rooms: ['kids-room'], primary: 'kids-curtains', extraCategories: ['printed-curtains'], ppm: 480, roll: 140, repeat: 32,
    created: '2026-05-02', care: CARE.wash,
    colourways: [['SUN', 'Sunshine', 'yellow', '#E3B448'], ['SKY', 'Sky', 'blue', '#8BB0CF']],
  },
  {
    id: 'p-014', sku: 'LL-KIT-014', name: 'Café Gingham Kitchen Curtains',
    description: 'A classic woven gingham in easy-wash cotton, sized for kitchen and utility windows. The rod-pocket heading slips straight onto a tension rod.',
    mrp: 1999, sale: 1399, refSize: 'short-4', sizes: KITCHEN_SIZES, material: 'cotton', collection: 'Kitchen & Utility', texture: 'smooth', patterns: ['geometric'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Classic', headings: ['rod_pocket'], linings: ['unlined'],
    rooms: ['kitchen'], primary: 'kitchen-curtains', ppm: 380, roll: 140, repeat: 6,
    created: '2026-01-15', care: CARE.wash,
    colourways: [['OLV', 'Olive Check', 'green', '#6E7B4F'], ['RED', 'Red Check', 'red', '#A8323A'], ['BLU', 'Blue Check', 'blue', '#3E5A78']],
  },
  {
    id: 'p-015', sku: 'LL-KIT-015', name: 'Lemon Grove Café Curtains',
    description: 'A sunny citrus print on crisp cotton for breakfast nooks and kitchen windows. Short sizes ship ready to hang.',
    mrp: 1799, sale: 1299, refSize: 'short-4', sizes: KITCHEN_SIZES, material: 'cotton', collection: 'Kitchen & Utility', texture: 'smooth', patterns: ['floral'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Playful', headings: ['rod_pocket'], linings: ['unlined'],
    rooms: ['kitchen'], primary: 'kitchen-curtains', extraCategories: ['printed-curtains'], ppm: 400, roll: 140, repeat: 27,
    created: '2026-04-03', care: CARE.wash,
    colourways: [['LEM', 'Lemon', 'yellow', '#E3C25A'], ['SAG', 'Sage', 'green', '#9AA88A']],
  },
  {
    id: 'p-016', sku: 'LL-BLP-016', name: 'Terracotta Block-Print Cotton Curtains',
    description: 'A traditional floral buti, hand-block printed on mul-soft cotton. Each panel carries the small variations that mark genuine hand printing.',
    mrp: 4999, sale: 3699, material: 'cotton', collection: 'Hand-Block Studio', texture: 'smooth', patterns: ['floral'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Traditional', headings: ['eyelet', 'rod_pocket'], linings: ['unlined', 'cotton_lining'],
    rooms: ['living-room', 'dining-room'], primary: 'printed-curtains', ppm: 560, roll: 112, repeat: 24, showroom: true,
    created: '2026-09-14', care: CARE.wash,
    colourways: [['TER', 'Terracotta', 'brown', '#A85B3E'], ['IND', 'Indigo', 'blue', '#2F4A6B']],
  },
  {
    id: 'p-017', sku: 'LL-IKT-017', name: 'Ikat Weave Cotton Curtains',
    description: 'A soft-edged ikat motif with the gentle blur of resist-dyed yarns. Bold enough to anchor a room, calm enough to live with.',
    mrp: 5299, sale: 3999, material: 'cotton', collection: 'Hand-Block Studio', texture: 'smooth', patterns: ['geometric'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Traditional', headings: ['eyelet'], linings: ['unlined', 'cotton_lining', 'blackout_lining'],
    rooms: ['living-room', 'bedroom'], primary: 'geometric-curtains', extraCategories: ['printed-curtains'], ppm: 590, roll: 140, repeat: 36,
    created: '2026-03-27', care: CARE.wash,
    colourways: [['IND', 'Indigo Ikat', 'blue', '#2F4A6B'], ['RST', 'Rust Ikat', 'brown', '#9A4A2A']],
  },
  {
    id: 'p-018', sku: 'LL-EMB-018', name: 'Embroidered Ivory Sheer Curtains',
    description: 'Delicate vine embroidery on a fine sheer voile, finished with a weighted hem. It brings quiet ornament to formal living and dining rooms.',
    mrp: 5999, sale: 4599, material: 'polyester', collection: 'Heirloom Sheers', texture: 'voile', patterns: ['embroidered'],
    functional: ['sheer'], opacity: 'sheer', style: 'Classic', headings: ['pinch_pleat', 'rod_pocket'], linings: ['unlined'],
    rooms: ['living-room', 'dining-room'], primary: 'sheer-curtains', ppm: 720, roll: 280, repeat: 30, showroom: true,
    created: '2026-08-08', care: CARE.sheer,
    colourways: [['IVG', 'Ivory & Gold', 'ivory', '#EFE6D2'], ['WSL', 'White & Silver', 'white', '#F7F5F0']],
  },
  {
    id: 'p-019', sku: 'LL-CRV-019', name: 'Crushed Velvet Luxe Curtains',
    description: 'A crushed-pile velvet with a shimmering, liquid surface. Made for statement windows and hospitality spaces that need drama.',
    mrp: 13999, sale: 10999, mode: 'best_price', material: 'velvet', collection: 'Salon Velvets', texture: 'crushed', patterns: ['solid'],
    functional: ['room_darkening'], opacity: 'room_darkening', style: 'Luxe', headings: ['pinch_pleat'], linings: ['cotton_lining', 'blackout_lining'],
    rooms: ['living-room', 'hospitality'], primary: 'velvet-curtains', ppm: 1290, roll: 140, lead: 'luxe',
    created: '2026-10-02', care: CARE.dry,
    colourways: [['CHP', 'Champagne', 'beige', '#CDB891'], ['BUR', 'Burgundy', 'red', '#6B2232'], ['TEA', 'Teal', 'blue', '#2B5B5E', { stock: 'made_to_order' }]],
  },
  {
    id: 'p-020', sku: 'LL-JAQ-020', name: 'Heritage Damask Pinch-Pleat Curtains',
    description: 'A traditional damask woven in a two-tone jacquard. Hand-stitched triple pinch pleats give it the tailored presence of heirloom drapery.',
    mrp: 12499, sale: 9499, material: 'poly_viscose', collection: 'Heritage Weaves', texture: 'jacquard', patterns: ['floral'],
    functional: ['room_darkening'], opacity: 'room_darkening', style: 'Traditional', headings: ['pinch_pleat'], linings: ['cotton_lining', 'blackout_lining'],
    rooms: ['dining-room', 'living-room'], primary: 'pinch-pleat-curtains', ppm: 980, roll: 140, repeat: 64, lead: 'luxe', showroom: true,
    created: '2026-07-01', care: CARE.dry,
    colourways: [['MAR', 'Maroon & Gold', 'red', '#7A1F2B'], ['IVG', 'Ivory & Gold', 'ivory', '#E9DCC6']],
  },
  {
    id: 'p-021', sku: 'LL-COT-021', name: 'Pure Cotton Solid Eyelet Curtains',
    description: 'An honest, everyday cotton in soft garment-dyed shades. Breathable, washable and easy to pair with patterned cushions and rugs.',
    mrp: 3999, sale: 2799, material: 'cotton', collection: 'Everyday Cottons', texture: 'smooth', patterns: ['solid'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Minimal', headings: ['eyelet'], linings: ['unlined', 'cotton_lining', 'blackout_lining'],
    rooms: ['bedroom', 'living-room', 'kids-room'], primary: 'cotton-curtains', ppm: 420, roll: 140, bestseller: true,
    created: '2026-02-20', care: CARE.wash,
    colourways: [
      ['CHK', 'Chalk', 'white', '#F2EEE6'], ['ROS', 'Dusty Rose', 'pink', '#C99A93'],
      ['SAG', 'Sage', 'green', '#9AA88A'], ['MUS', 'Mustard', 'yellow', '#C9962F', { stock: 'low_stock' }],
    ],
  },
  {
    id: 'p-022', sku: 'LL-THM-022', name: 'Thermal Linen-Look Blackout Curtains',
    description: 'The texture of linen with a coated thermal back that blocks light and reduces heat from west-facing windows. Hangs softly despite its performance core.',
    mrp: 7499, sale: 5499, material: 'polyester', collection: 'Deep Sleep', texture: 'slub', patterns: ['solid'],
    functional: ['blackout', 'thermal'], opacity: 'blackout', style: 'Contemporary', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['bedroom', 'living-room', 'home-office', 'hospitality'], primary: 'thermal-curtains', ppm: 760, roll: 280, railroad: true, bestseller: true,
    created: '2026-09-18', care: CARE.blackout,
    colourways: [['NAT', 'Natural', 'beige', '#CDBFA8'], ['GRA', 'Graphite', 'charcoal', '#4A4846'], ['NAV', 'Navy', 'blue', '#2A3550']],
  },
  {
    id: 'p-023', sku: 'LL-PCL-023', name: 'Classic Lined Pencil-Pleat Curtains',
    description: 'A soft cotton blend lined in cotton sateen and gathered with a deep pencil-pleat tape. A timeless, versatile curtain for tracks or rods with hooks.',
    mrp: 6999, sale: 5299, material: 'cotton_blend', collection: 'Everyday Cottons', texture: 'smooth', patterns: ['solid'],
    functional: ['room_darkening'], opacity: 'room_darkening', style: 'Classic', headings: ['pencil_pleat'], linings: ['cotton_lining', 'blackout_lining'],
    rooms: ['bedroom', 'dining-room'], primary: 'pencil-pleat-curtains', ppm: 540, roll: 140,
    created: '2026-01-29', care: CARE.dry,
    colourways: [['CRM', 'Cream', 'ivory', '#EDE3CF'], ['DUK', 'Duck Egg', 'blue', '#A9BFBF'], ['HEA', 'Heather', 'grey', '#9B8A9A']],
  },
  {
    id: 'p-024', sku: 'LL-CAF-024', name: 'Rod-Pocket Sheer Café Panel',
    description: 'A single sheer panel for small windows, cabinet doors and kitchen sashes. Sold per panel so you can buy exactly as many as you need.',
    mrp: 1299, sale: 899, refSize: 'short-4', sizes: KITCHEN_SIZES, sellingUnit: 'panel', material: 'polyester', collection: 'Kitchen & Utility', texture: 'voile', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['rod_pocket'], linings: ['unlined'],
    rooms: ['kitchen', 'home-office'], primary: 'kitchen-curtains', ppm: 290, roll: 300, railroad: true, custom: false,
    created: '2026-05-30', care: CARE.sheer,
    colourways: [['WHT', 'White', 'white', '#F7F5F0'], ['LIN', 'Linen', 'beige', '#E3D8C4']],
  },
  {
    id: 'p-025', sku: 'LL-BSK-025', name: 'Natural Basket Weave Curtains',
    description: 'A chunky cotton-blend basket weave with an artisanal hand. It filters light softly and brings warmth to minimal interiors.',
    mrp: 5499, sale: 4199, material: 'cotton_blend', collection: 'Weaver’s Edit', texture: 'basket_weave', patterns: ['textured'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Minimal', headings: ['eyelet', 'rod_pocket'], linings: ['unlined', 'cotton_lining'],
    rooms: ['living-room', 'home-office'], primary: 'textured-curtains', ppm: 600, roll: 140,
    created: '2026-06-10', care: CARE.wash,
    colourways: [['NAT', 'Natural', 'beige', '#D6C7AE'], ['CHA', 'Charcoal', 'charcoal', '#46423E']],
  },
  {
    id: 'p-026', sku: 'LL-GEO-026', name: 'Moroccan Trellis Geometric Curtains',
    description: 'A printed trellis on a dense, room-darkening weave. A crisp geometric that works in modern and traditional rooms alike.',
    mrp: 4999, sale: 3599, material: 'polyester', collection: 'Modern Prints', texture: 'smooth', patterns: ['geometric'],
    functional: ['room_darkening'], opacity: 'room_darkening', style: 'Contemporary', headings: ['eyelet'], linings: ['unlined', 'blackout_lining'],
    rooms: ['living-room', 'bedroom'], primary: 'geometric-curtains', extraCategories: ['printed-curtains'], ppm: 520, roll: 140, repeat: 32,
    created: '2026-04-25', care: CARE.wash,
    colourways: [['GRY', 'Grey Trellis', 'grey', '#8E8B86'], ['TEA', 'Teal Trellis', 'blue', '#2B5B5E'], ['BEI', 'Beige Trellis', 'beige', '#D8C3A5']],
  },
  {
    id: 'p-027', sku: 'LL-LIN-027', name: 'Pure Linen Pinch-Pleat Drapes',
    description: 'A heavyweight pure linen woven for drapery, with a dry hand and beautiful natural slub. It softens with every season and suits generous, floor-pooling lengths.',
    mrp: 14999, sale: 11999, mode: 'best_price', material: 'linen', collection: 'Coastline Linens', texture: 'slub', patterns: ['solid'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Luxe', headings: ['pinch_pleat', 'pencil_pleat'],
    linings: ['unlined', 'cotton_lining', 'blackout_lining', 'thermal_lining'], rooms: ['living-room', 'dining-room', 'hospitality'], primary: 'linen-curtains',
    ppm: 1450, roll: 300, railroad: true, lead: 'luxe', showroom: true, bestseller: true,
    created: '2026-10-08', care: CARE.dry,
    colourways: [['FLX', 'Flax', 'beige', '#C8B79A'], ['CHK', 'Chalk', 'white', '#F2EEE6'], ['CHR', 'Charcoal', 'charcoal', '#3F3C39', { adj: 4 }]],
  },
  {
    id: 'p-028', sku: 'LL-DUP-028', name: 'Silk-Touch Dupion Curtains',
    description: 'A faux dupion with the irregular slub and sheen of raw silk, minus the fragility. Lined, it gives rich colour and a crisp, formal fall.',
    mrp: 8999, sale: 6799, material: 'polyester', collection: 'Salon Velvets', texture: 'slub', patterns: ['solid'],
    functional: ['room_darkening'], opacity: 'room_darkening', style: 'Luxe', headings: ['pinch_pleat'], linings: ['cotton_lining', 'blackout_lining'],
    rooms: ['dining-room', 'living-room'], primary: 'pinch-pleat-curtains', ppm: 780, roll: 140,
    created: '2026-08-19', care: CARE.dry,
    colourways: [['CHP', 'Champagne', 'beige', '#D8C59E'], ['TEA', 'Teal', 'blue', '#2B5B5E'], ['RSG', 'Rose Gold', 'pink', '#C99A7E']],
  },
  {
    id: 'p-029', sku: 'LL-ABS-029', name: 'Abstract Brushstroke Printed Curtains',
    description: 'Loose, painterly brushstrokes digitally printed on a cotton blend. An easy way to add art-gallery energy to a neutral room.',
    mrp: 5999, sale: 4399, material: 'cotton_blend', collection: 'Modern Prints', texture: 'smooth', patterns: ['abstract'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Contemporary', headings: ['eyelet'], linings: ['unlined', 'cotton_lining'],
    rooms: ['living-room', 'home-office'], primary: 'printed-curtains', ppm: 640, roll: 140, repeat: 70,
    created: '2026-10-12', care: CARE.wash,
    colourways: [['INK', 'Ink Blue', 'blue', '#2F4A6B'], ['OCH', 'Ochre', 'yellow', '#C9962F']],
  },
  {
    id: 'p-030', sku: 'LL-KID-030', name: "Chevron Kids' Room-Darkening Curtains",
    description: 'A soft chevron printed on a dense weave that dims daylight for naps without full blackout. Easy-care and fade-resistant.',
    mrp: 3999, sale: 2899, material: 'polyester', collection: 'Little Rooms', texture: 'smooth', patterns: ['geometric'],
    functional: ['room_darkening'], opacity: 'room_darkening', style: 'Playful', headings: ['eyelet'], linings: ['unlined'],
    rooms: ['kids-room'], primary: 'kids-curtains', extraCategories: ['printed-curtains'], ppm: 470, roll: 140, repeat: 20,
    created: '2026-03-05', care: CARE.wash,
    colourways: [['GRY', 'Grey Chevron', 'grey', '#A5A29C'], ['PNK', 'Pink Chevron', 'pink', '#E2B4B0']],
  },
  {
    id: 'p-031', sku: 'LL-HOT-031', name: 'Hotel Wide-Width Blackout Drapery',
    description: 'Commercial-grade blackout drapery for hotels, serviced apartments and cafés. Quoted per project to your room count, track lengths and fire-safety needs.',
    mrp: 0, sale: 0, mode: 'on_request', refSize: 'wide-9', sizes: HOSPITALITY_SIZES, material: 'polyester', collection: 'Hospitality', texture: 'smooth', patterns: ['solid'],
    functional: ['blackout', 'thermal'], opacity: 'blackout', style: 'Contemporary', headings: ['pinch_pleat'], linings: ['unlined'],
    rooms: ['hospitality'], primary: 'blackout-curtains', extraCategories: ['custom-made-curtains'], ppm: null, roll: 300, lead: 'luxe',
    created: '2026-02-14', care: CARE.blackout, warranty: 'Project warranty as per contract',
    colourways: [['CHA', 'Charcoal', 'charcoal', '#3A3734'], ['TAU', 'Taupe', 'brown', '#8C7B6B'], ['SND', 'Sand', 'beige', '#D8C3A5']],
  },
  {
    id: 'p-032', sku: 'LL-SST-032', name: 'Sheer Stripe Linen Voile Curtains',
    description: 'A linen-blend voile with fine woven stripes that catch the light. Hang alone for breezy rooms or layer under blackout for flexible light control.',
    mrp: 4299, sale: 3199, material: 'linen_blend', collection: 'Everyday Sheers', texture: 'voile', patterns: ['striped'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['rod_pocket', 'eyelet'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom'], primary: 'sheer-curtains', extraCategories: ['geometric-curtains'], ppm: 560, roll: 280, railroad: true,
    created: '2026-07-16', care: CARE.sheer,
    colourways: [['NST', 'Natural Stripe', 'beige', '#E3D8C4'], ['WST', 'White Stripe', 'white', '#F7F5F0']],
  },
  {
    id: 'p-033', sku: 'LL-CUS-033', name: 'Signature Made-to-Measure Linen Curtains',
    description: 'Our signature linen, cut and stitched only to your measurements with the heading and lining of your choice. Book a measurement visit or enter your sizes for an instant estimate.',
    mrp: 10999, sale: 8999, mode: 'starting_from', material: 'linen', collection: 'Atelier Made-to-Measure', texture: 'slub', patterns: ['solid'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Luxe', headings: ['pinch_pleat', 'pencil_pleat', 'eyelet', 'rod_pocket'],
    linings: ['unlined', 'cotton_lining', 'blackout_lining', 'thermal_lining'], rooms: ['living-room', 'bedroom', 'dining-room'], primary: 'custom-made-curtains',
    extraCategories: ['linen-curtains'], standard: false, ppm: 1250, roll: 140, lead: 'luxe', showroom: true,
    created: '2026-10-20', care: CARE.dry,
    colourways: [
      ['FLX', 'Flax', 'beige', '#C8B79A'], ['IVO', 'Ivory', 'ivory', '#EFE6D2'], ['OLV', 'Olive', 'green', '#6E7B4F', { adj: 3 }],
      ['IND', 'Indigo (new arrival)', 'blue', '#2F4A6B', { ppm: null, roll: null, stock: 'made_to_order' }],
    ],
  },
  {
    id: 'p-034', sku: 'LL-PLM-034', name: 'Tropical Palm Printed Curtains',
    description: 'Oversized palm fronds printed on breathable cotton. Brings a relaxed, resort feel to living rooms and sunrooms.',
    mrp: 4799, sale: 3499, material: 'cotton', collection: 'Garden Room', texture: 'smooth', patterns: ['floral'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Contemporary', headings: ['eyelet'], linings: ['unlined', 'cotton_lining', 'blackout_lining'],
    rooms: ['living-room', 'bedroom'], primary: 'floral-curtains', extraCategories: ['printed-curtains'], ppm: 520, roll: 140, repeat: 68,
    created: '2026-05-14', care: CARE.wash,
    colourways: [['PLM', 'Palm Green', 'green', '#4F6B4A'], ['MON', 'Monochrome', 'charcoal', '#3A3734']],
  },
  {
    id: 'p-035', sku: 'LL-KID-035', name: 'Pastel Gingham Kids Curtains',
    description: 'A soft pastel check in washable cotton. Pair with a blackout lining for nap-time or keep it light for playrooms.',
    mrp: 3299, sale: 2399, material: 'cotton', collection: 'Little Rooms', texture: 'smooth', patterns: ['geometric'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Playful', headings: ['rod_pocket', 'eyelet'], linings: ['unlined', 'blackout_lining'],
    rooms: ['kids-room'], primary: 'kids-curtains', ppm: 400, roll: 140, repeat: 6,
    created: '2026-01-08', care: CARE.wash,
    colourways: [['BLU', 'Powder Blue', 'blue', '#AFC4D9'], ['PNK', 'Blush Pink', 'pink', '#E8C1BD'], ['YEL', 'Butter Yellow', 'yellow', '#EBD592']],
  },
  {
    id: 'p-036', sku: 'LL-PPB-036', name: 'Charcoal Pinch-Pleat Blackout Curtains',
    description: 'Tailored triple pinch pleats on a dense blackout weave — the go-to for master bedrooms and hotel rooms that need total darkness with a formal finish.',
    mrp: 7999, sale: 5999, material: 'polyester', collection: 'Deep Sleep', texture: 'smooth', patterns: ['solid'],
    functional: ['blackout'], opacity: 'blackout', style: 'Classic', headings: ['pinch_pleat'], linings: ['unlined'],
    rooms: ['bedroom', 'hospitality'], primary: 'blackout-curtains', ppm: 620, roll: 280, railroad: true,
    created: '2026-06-28', care: CARE.blackout,
    colourways: [['CHA', 'Charcoal', 'charcoal', '#3A3734'], ['INK', 'Ink', 'blue', '#1F2A44'], ['MSH', 'Mushroom', 'brown', '#9C8E80', { stock: 'out_of_stock' }]],
  },
  {
    id: 'p-037', sku: 'LL-MUG-037', name: 'Mughal Floral Embroidered Curtains',
    description: 'Mughal-inspired florals embroidered in tonal thread on a cotton-blend base. A heritage piece for formal living and dining rooms.',
    mrp: 10999, sale: 8499, material: 'cotton_blend', collection: 'Heirloom Sheers', texture: 'smooth', patterns: ['embroidered', 'floral'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Traditional', headings: ['pinch_pleat', 'eyelet'], linings: ['cotton_lining', 'blackout_lining'],
    rooms: ['living-room', 'dining-room'], primary: 'floral-curtains', ppm: 1120, roll: 140, repeat: 45, lead: 'luxe', showroom: true,
    created: '2026-09-09', care: CARE.dry,
    colourways: [['IVO', 'Ivory', 'ivory', '#EFE6D2'], ['MAR', 'Maroon', 'red', '#7A1F2B', { adj: 3 }]],
  },
  {
    id: 'p-038', sku: 'LL-WAF-038', name: 'Waffle Texture Thermal Curtains',
    description: 'A cosy waffle-weave face bonded to a thermal back. It cuts glare and heat while keeping a soft, textured look.',
    mrp: 5999, sale: 4499, material: 'polyester', collection: 'Deep Sleep', texture: 'basket_weave', patterns: ['textured'],
    functional: ['thermal', 'room_darkening'], opacity: 'room_darkening', style: 'Contemporary', headings: ['eyelet'], linings: ['unlined'],
    rooms: ['bedroom', 'living-room'], primary: 'thermal-curtains', ppm: 640, roll: 140,
    created: '2026-04-09', care: CARE.blackout,
    colourways: [['OAT', 'Oat', 'beige', '#D9CBB3'], ['GRY', 'Grey', 'grey', '#A5A29C'], ['OLV', 'Olive', 'green', '#6E7B4F']],
  },
  {
    id: 'p-039', sku: 'LL-SLB-039', name: 'Rust Cotton Slub Curtains',
    description: 'A slubbed cotton in warm, earthy tones. Relaxed and breathable, with a hand-woven character that suits Indian modern homes.',
    mrp: 4499, sale: 3399, material: 'cotton', collection: 'Everyday Cottons', texture: 'slub', patterns: ['solid'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Contemporary', headings: ['eyelet', 'pencil_pleat'], linings: ['unlined', 'cotton_lining', 'blackout_lining'],
    rooms: ['living-room', 'dining-room', 'home-office'], primary: 'cotton-curtains', ppm: 470, roll: 140,
    created: '2026-08-02', care: CARE.wash,
    colourways: [['RST', 'Rust', 'brown', '#9A4A2A'], ['SND', 'Sand', 'beige', '#D8C3A5'], ['MOS', 'Moss', 'green', '#6E7B4F']],
  },
  {
    id: 'p-040', sku: 'LL-OMB-040', name: 'Dusk Ombre Sheer Curtains',
    description: 'A sheer voile that fades from deep colour at the hem to near-white at the top — like the sky at dusk.',
    mrp: 3999, sale: 2999, material: 'polyester', collection: 'Everyday Sheers', texture: 'voile', patterns: ['abstract'],
    functional: ['sheer'], opacity: 'sheer', style: 'Contemporary', headings: ['rod_pocket', 'eyelet'], linings: ['unlined'],
    rooms: ['bedroom', 'living-room'], primary: 'sheer-curtains', extraCategories: ['printed-curtains'], ppm: 420, roll: 280,
    created: '2026-06-15', care: CARE.sheer,
    colourways: [['DSK', 'Dusk Blue', 'blue', '#6E87A6'], ['ROS', 'Rose', 'pink', '#D9A5A0']],
  },
  {
    id: 'p-041', sku: 'LL-GRD-041', name: 'Grid Check Linen-Blend Curtains',
    description: 'A fine windowpane check woven into a linen blend. Quietly tailored — at home in studies, libraries and modern living rooms.',
    mrp: 6499, sale: 4999, material: 'linen_blend', collection: 'Coastline Linens', texture: 'slub', patterns: ['geometric'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Classic', headings: ['pinch_pleat', 'eyelet'], linings: ['unlined', 'cotton_lining', 'blackout_lining'],
    rooms: ['home-office', 'living-room'], primary: 'geometric-curtains', ppm: 780, roll: 140, repeat: 18,
    created: '2026-03-19', care: CARE.dry,
    colourways: [['GRY', 'Grey Grid', 'grey', '#A5A29C'], ['SND', 'Sand Grid', 'beige', '#D8C3A5']],
  },
  {
    id: 'p-042', sku: 'LL-VBL-042', name: 'Lined Velvet Blackout Curtains',
    description: 'Plush velvet bonded to a blackout lining — the blackout performance comes from the lining, so every shade darkens the room equally well.',
    mrp: 14999, sale: 11499, material: 'velvet', collection: 'Salon Velvets', texture: 'plush', patterns: ['solid'],
    functional: ['blackout'], opacity: 'blackout', style: 'Luxe', headings: ['pinch_pleat', 'eyelet'], linings: ['blackout_lining'],
    rooms: ['bedroom', 'hospitality', 'living-room'], primary: 'velvet-curtains', ppm: 1180, roll: 140, lead: 'luxe',
    created: '2026-10-15', care: CARE.dry,
    colourways: [['NAV', 'Navy', 'blue', '#22304F'], ['BOT', 'Bottle Green', 'green', '#1F4A3A'], ['PLM', 'Plum', 'red', '#5B3550']],
  },
];

const HEADING_CATEGORY: Record<HeadingStyle, string> = {
  eyelet: 'eyelet-curtains',
  pinch_pleat: 'pinch-pleat-curtains',
  rod_pocket: 'rod-pocket-curtains',
  pencil_pleat: 'pencil-pleat-curtains',
};

/**
 * Derive every category a product belongs to from its independent attributes.
 * Function → function category, material → material category, default
 * heading → construction category, pattern → pattern category.
 */
export function deriveCategoryIds(seed: ProductSeed): string[] {
  const ids = new Set<string>([seed.primary, ...(seed.extraCategories ?? [])]);
  const fn = new Set(seed.functional);
  if (fn.has('sheer')) ids.add('sheer-curtains');
  if (fn.has('blackout')) ids.add('blackout-curtains');
  if (fn.has('room_darkening')) ids.add('room-darkening-curtains');
  if (fn.has('thermal')) ids.add('thermal-curtains');

  if (seed.material === 'linen' || seed.material === 'linen_blend') ids.add('linen-curtains');
  if (seed.material === 'cotton' || seed.material === 'cotton_blend') ids.add('cotton-curtains');
  if (seed.material === 'velvet') ids.add('velvet-curtains');
  if (seed.material === 'polyester' || seed.material === 'poly_viscose') ids.add('polyester-curtains');

  const heading = seed.headings[0];
  if (heading) ids.add(HEADING_CATEGORY[heading]);

  const p = new Set(seed.patterns);
  if (p.has('floral')) ids.add('floral-curtains');
  if (p.has('geometric') || p.has('striped')) ids.add('geometric-curtains');
  if (p.has('solid')) ids.add('solid-colour-curtains');
  if (p.has('textured') || ['jacquard', 'herringbone', 'basket_weave', 'slub', 'crushed'].includes(seed.texture)) ids.add('textured-curtains');

  if (seed.standard === false) ids.add('custom-made-curtains');
  return [...ids];
}

const LEAD_TIMES = {
  standard: { ready_made_days: [2, 4] as [number, number], custom_days: [7, 12] as [number, number] },
  luxe: { ready_made_days: [3, 5] as [number, number], custom_days: [10, 15] as [number, number] },
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/['’]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Build a product record. Prices and size references are filled in by `sizeOptions.ts`. */
export function buildProduct(seed: ProductSeed, index: number): Omit<Product, 'base_price' | 'sale_price' | 'width' | 'drop'> {
  const families = [...new Set(seed.colourways.map((c) => c[2]))];
  return {
    id: seed.id,
    category_id: seed.primary,
    category_ids: deriveCategoryIds(seed),
    rooms: seed.rooms,
    name: seed.name,
    slug: slugify(seed.name),
    sku: seed.sku,
    description: seed.description,
    price_mode: seed.mode ?? 'fixed',
    brand: 'Loom & Layer',
    fabric_material: seed.material,
    fabric_collection: seed.collection,
    colors: families,
    patterns: seed.patterns,
    functional_types: seed.functional,
    style: seed.style,
    opacity: seed.opacity,
    texture: seed.texture,
    dimension_unit: 'mm',
    selling_unit: seed.sellingUnit ?? (seed.standard === false ? 'custom' : 'pair'),
    panels_per_pair: 2,
    lining_options: seed.linings,
    heading_options: seed.headings,
    warranty: seed.warranty ?? '1-year stitching warranty',
    status: 'active',
    custom_sizing_enabled: seed.custom ?? true,
    standard_sizing_enabled: seed.standard ?? true,
    lead_time: LEAD_TIMES[seed.lead ?? 'standard'],
    in_showroom: seed.showroom ?? false,
    buy_url: seed.buyUrl ?? null,
    featured_rank: (seed.bestseller ? 0 : 100) + index,
    is_bestseller: seed.bestseller ?? false,
    care: seed.care ?? CARE.wash,
    created_at: `${seed.created}T10:00:00+05:30`,
    updated_at: `${seed.created}T10:00:00+05:30`,
  };
}

/** Reference size used for `base_price` / `sale_price`, `width` and `drop`. */
export const refSizeOf = (seed: ProductSeed) => seed.refSize ?? 'door-7';

/** Active products with reference prices for their default colourway. */
export const products: Product[] = productSeeds.map((seed, i) => {
  const ref = sizeById.get(refSizeOf(seed))!;
  const onRequest = seed.mode === 'on_request';
  const { mrp, sale } = onRequest ? { mrp: 0, sale: 0 } : derivePricePair(seed.mrp, seed.sale, refSizeOf(seed), refSizeOf(seed));
  return {
    ...buildProduct(seed, i),
    base_price: mrp,
    sale_price: sale,
    width: ref.finished_width,
    drop: ref.finished_drop,
  };
});

export const productById = new Map(products.map((p) => [p.id, p]));
export const seedById = new Map(productSeeds.map((s) => [s.id, s]));
