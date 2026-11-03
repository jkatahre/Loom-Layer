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
 * CATALOGUE — one design per photo set (photos N-0 … N-3, see productImages.ts).
 * Names, materials and prices are SAMPLE values written from the photos.
 * Check and replace them with your real details before launch.
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
  /** Photo set number: images N-0 … N-3 (see productImages.ts). */
  photo: number;
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

const CARE = {
  wash: ['Gentle machine wash at 30 °C', 'Line dry in shade', 'Warm iron on reverse'],
  dry: ['Dry clean only', 'Vacuum gently with a soft brush', 'Steam to release creases'],
  sheer: ['Hand wash or delicate cycle, cold', 'Hang while damp to drop creases', 'Do not wring'],
  blackout: ['Gentle machine wash, cold', 'Do not tumble dry', 'Cool iron on the fabric side only'],
};

export const productSeeds: ProductSeed[] = [
  {
    // Photos 2-0 … 2-3
    id: 'p-002', sku: 'LL-SHR-002', photo: 2, name: 'Sage Green Linen Sheer Curtains',
    description: 'A sage green slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4499, sale: 3399, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true, bestseller: true, showroom: true,
    created: '2026-04-11', care: CARE.sheer,
    colourways: [['SAG', 'Sage Green', 'green', '#898472']],
  },
  {
    // Photos 3-0 … 3-3
    id: 'p-003', sku: 'LL-WVN-003', photo: 3, name: 'Moss Herringbone Linen Sheer Curtains',
    description: 'A moss-green sheer with a fine herringbone weave that shows as the light passes through it.',
    mrp: 4599, sale: 3499, material: 'linen_blend', collection: 'Woven Sheers', texture: 'herringbone', patterns: ['solid', 'textured'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom'], primary: 'sheer-curtains', ppm: 720, roll: 280, railroad: true,
    created: '2026-05-16', care: CARE.sheer,
    colourways: [['MOS', 'Moss Herringbone', 'green', '#817D6A']],
  },
  {
    // Photos 4-0 … 4-3
    id: 'p-004', sku: 'LL-SHR-004', photo: 4, name: 'Ash Grey Linen Sheer Curtains',
    description: 'A ash grey slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 3999, sale: 2999, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'home-office'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true,
    created: '2026-06-21', care: CARE.sheer,
    colourways: [['ASH', 'Ash Grey', 'grey', '#999690']],
  },
  {
    // Photos 5-0 … 5-3
    id: 'p-005', sku: 'LL-SHR-005', photo: 5, name: 'Khaki Linen Sheer Curtains',
    description: 'A khaki slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4899, sale: 3699, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'kitchen'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true,
    created: '2026-07-26', care: CARE.sheer,
    colourways: [['KHA', 'Khaki', 'beige', '#847D6A']],
  },
  {
    // Photos 6-0 … 6-3
    id: 'p-006', sku: 'LL-SHR-006', photo: 6, name: 'Denim Blue Linen Sheer Curtains',
    description: 'A denim blue slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4599, sale: 3499, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'home-office'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true, bestseller: true,
    created: '2026-08-04', care: CARE.sheer,
    colourways: [['DEN', 'Denim Blue', 'blue', '#6A6D72']],
  },
  {
    // Photos 7-0 … 7-3
    id: 'p-007', sku: 'LL-WVN-007', photo: 7, name: 'Chambray Blue Woven Sheer Curtains',
    description: 'A chambray-blue sheer with a crosshatch weave, light and airy with a quiet texture.',
    mrp: 4799, sale: 3599, material: 'linen_blend', collection: 'Woven Sheers', texture: 'basket_weave', patterns: ['solid', 'textured'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'home-office'], primary: 'sheer-curtains', ppm: 720, roll: 280, railroad: true,
    created: '2026-09-09', care: CARE.sheer,
    colourways: [['CHA', 'Chambray Blue', 'blue', '#6B7073']],
  },
  {
    // Photos 8-0 … 8-3
    id: 'p-008', sku: 'LL-SHR-008', photo: 8, name: 'Taupe Linen Sheer Curtains',
    description: 'A taupe slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4099, sale: 3099, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'dining-room'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true,
    created: '2026-10-14', care: CARE.sheer,
    colourways: [['TAU', 'Taupe', 'brown', '#73665D']],
  },
  {
    // Photos 9-0 … 9-3
    id: 'p-009', sku: 'LL-SHR-009', photo: 9, name: 'Mocha Linen Sheer Curtains',
    description: 'A mocha slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 3799, sale: 2899, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true,
    created: '2026-04-19', care: CARE.sheer,
    colourways: [['MOC', 'Mocha', 'brown', '#7B6F63']],
  },
  {
    // Photos 10-0 … 10-3
    id: 'p-010', sku: 'LL-SHR-010', photo: 10, name: 'Rust Linen Sheer Curtains',
    description: 'A rust slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4799, sale: 3599, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'dining-room'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true, showroom: true,
    created: '2026-05-24', care: CARE.sheer,
    colourways: [['RUS', 'Rust', 'brown', '#904E33']],
  },
  {
    // Photos 11-0 … 11-3
    id: 'p-011', sku: 'LL-SHR-011', photo: 11, name: 'Driftwood Linen Sheer Curtains',
    description: 'A driftwood slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4499, sale: 3399, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'home-office'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true,
    created: '2026-06-02', care: CARE.sheer,
    colourways: [['DRI', 'Driftwood', 'grey', '#6E635B']],
  },
  {
    // Photos 12-0 … 12-3
    id: 'p-012', sku: 'LL-SHR-012', photo: 12, name: 'Terracotta Linen Sheer Curtains',
    description: 'A terracotta slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4199, sale: 3199, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'dining-room'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true,
    created: '2026-07-07', care: CARE.sheer,
    colourways: [['TER', 'Terracotta', 'brown', '#914E33']],
  },
  {
    // Photos 13-0 … 13-3
    id: 'p-013', sku: 'LL-SHR-013', photo: 13, name: 'Pale Sage Linen Sheer Curtains',
    description: 'A pale sage slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 3999, sale: 2999, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'kitchen'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true,
    created: '2026-08-12', care: CARE.sheer,
    colourways: [['PAL', 'Pale Sage', 'green', '#8D8773']],
  },
  {
    // Photos 14-0 … 14-3
    id: 'p-014', sku: 'LL-WVN-014', photo: 14, name: 'Navy Check Linen Sheer Curtains',
    description: 'A navy linen sheer with a woven windowpane check — relaxed, tailored and easy to live with.',
    mrp: 5399, sale: 4099, material: 'linen_blend', collection: 'Woven Sheers', texture: 'slub', patterns: ['geometric'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'home-office'], primary: 'sheer-curtains', ppm: 720, roll: 280, railroad: true,
    created: '2026-09-17', care: CARE.sheer,
    colourways: [['NAV', 'Navy Check', 'blue', '#353A47']],
  },
  {
    // Photos 15-0 … 15-3
    id: 'p-015', sku: 'LL-SHR-015', photo: 15, name: 'Natural Flax Linen Sheer Curtains',
    description: 'A natural flax slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4599, sale: 3499, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'kitchen'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true,
    created: '2026-10-22', care: CARE.sheer,
    colourways: [['NAT', 'Natural Flax', 'beige', '#998C78']],
  },
  {
    // Photos 16-0 … 16-3
    id: 'p-016', sku: 'LL-SHR-016', photo: 16, name: 'Graphite Linen Sheer Curtains',
    description: 'A graphite slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4399, sale: 3299, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'home-office'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true,
    created: '2026-04-27', care: CARE.sheer,
    colourways: [['GRA', 'Graphite', 'charcoal', '#56514D']],
  },
  {
    // Photos 17-0 … 17-3
    id: 'p-017', sku: 'LL-SHR-017', photo: 17, name: 'Ochre Linen Sheer Curtains',
    description: 'A ochre slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4099, sale: 3099, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'dining-room'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true, bestseller: true,
    created: '2026-05-05', care: CARE.sheer,
    colourways: [['OCH', 'Ochre', 'yellow', '#8C6540']],
  },
  {
    // Photos 18-0 … 18-3
    id: 'p-018', sku: 'LL-SHR-018', photo: 18, name: 'Olive Linen Sheer Curtains',
    description: 'A olive slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 3799, sale: 2899, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true,
    created: '2026-06-10', care: CARE.sheer,
    colourways: [['OLI', 'Olive', 'green', '#545647']],
  },
  {
    // Photos 19-0 … 19-3
    id: 'p-019', sku: 'LL-SHR-019', photo: 19, name: 'Indigo Linen Sheer Curtains',
    description: 'A indigo slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4799, sale: 3599, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'semi_sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true,
    created: '2026-07-15', care: CARE.sheer,
    colourways: [['IND', 'Indigo', 'blue', '#292D3C']],
  },
  {
    // Photos 20-0 … 20-3
    id: 'p-020', sku: 'LL-SHR-020', photo: 20, name: 'Ivory Linen Sheer Curtains',
    description: 'A ivory slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4499, sale: 3399, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'kitchen'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true, bestseller: true, showroom: true,
    created: '2026-08-20', care: CARE.sheer,
    colourways: [['IVO', 'Ivory', 'ivory', '#B5A592']],
  },
  {
    // Photos 21-0 … 21-3
    id: 'p-021', sku: 'LL-SHR-021', photo: 21, name: 'Forest Green Linen Sheer Curtains',
    description: 'A forest green slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4199, sale: 3199, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'semi_sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true,
    created: '2026-09-25', care: CARE.sheer,
    colourways: [['FOR', 'Forest Green', 'green', '#333126']],
  },
  {
    // Photos 22-0 … 22-3
    id: 'p-022', sku: 'LL-SHR-022', photo: 22, name: 'Charcoal Linen Sheer Curtains',
    description: 'A charcoal slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 3999, sale: 2999, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'semi_sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'hospitality'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true, showroom: true,
    created: '2026-10-03', care: CARE.sheer,
    colourways: [['CHA', 'Charcoal', 'charcoal', '#363434']],
  },
  {
    // Photos 23-0 … 23-3
    id: 'p-023', sku: 'LL-SHR-023', photo: 23, name: 'Espresso Linen Sheer Curtains',
    description: 'A espresso slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4899, sale: 3699, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'semi_sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true,
    created: '2026-04-08', care: CARE.sheer,
    colourways: [['ESP', 'Espresso', 'brown', '#2F2520']],
  },
  {
    // Photos 24-0 … 24-3
    id: 'p-024', sku: 'LL-SHR-024', photo: 24, name: 'Slate Linen Sheer Curtains',
    description: 'A slate slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4599, sale: 3499, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'semi_sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'home-office', 'hospitality'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true,
    created: '2026-05-13', care: CARE.sheer,
    colourways: [['SLA', 'Slate', 'charcoal', '#37393E']],
  },
  {
    // Photos 25-0 … 25-3
    id: 'p-025', sku: 'LL-SHR-025', photo: 25, name: 'Midnight Navy Linen Sheer Curtains',
    description: 'A midnight navy slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4399, sale: 3299, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'semi_sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'hospitality'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true,
    created: '2026-06-18', care: CARE.sheer,
    colourways: [['MID', 'Midnight Navy', 'blue', '#303239']],
  },
  {
    // Photos 26-0 … 26-3
    id: 'p-026', sku: 'LL-SHR-026', photo: 26, name: 'Steel Blue Linen Sheer Curtains',
    description: 'A steel blue slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4099, sale: 3099, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'home-office'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true,
    created: '2026-07-23', care: CARE.sheer,
    colourways: [['STE', 'Steel Blue', 'blue', '#5B636D']],
  },
  {
    // Photos 27-0 … 27-3
    id: 'p-027', sku: 'LL-SHR-027', photo: 27, name: 'Mustard Linen Sheer Curtains',
    description: 'A mustard slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 3799, sale: 2899, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'dining-room'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true,
    created: '2026-08-01', care: CARE.sheer,
    colourways: [['MUS', 'Mustard', 'yellow', '#A46E35']],
  },
  {
    // Photos 28-0 … 28-3
    id: 'p-028', sku: 'LL-SHR-028', photo: 28, name: 'Teal Linen Sheer Curtains',
    description: 'A teal slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4799, sale: 3599, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'kids-room'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true, bestseller: true,
    created: '2026-09-06', care: CARE.sheer,
    colourways: [['TEA', 'Teal', 'blue', '#2A646F']],
  },
  {
    // Photos 29-0 … 29-3
    id: 'p-029', sku: 'LL-SHR-029', photo: 29, name: 'Lavender Grey Linen Sheer Curtains',
    description: 'A lavender grey slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4499, sale: 3399, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true,
    created: '2026-10-11', care: CARE.sheer,
    colourways: [['LAV', 'Lavender Grey', 'grey', '#867584']],
  },
  {
    // Photos 30-0 … 30-3
    id: 'p-030', sku: 'LL-SHR-030', photo: 30, name: 'Coral Linen Sheer Curtains',
    description: 'A coral slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4199, sale: 3199, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'kitchen', 'kids-room'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true,
    created: '2026-04-16', care: CARE.sheer,
    colourways: [['COR', 'Coral', 'pink', '#C4604C']],
  },
  {
    // Photos 31-0 … 31-3
    id: 'p-031', sku: 'LL-SHR-031', photo: 31, name: 'Honey Gold Linen Sheer Curtains',
    description: 'A honey gold slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 3999, sale: 2999, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'dining-room'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true,
    created: '2026-05-21', care: CARE.sheer,
    colourways: [['HON', 'Honey Gold', 'yellow', '#A17746']],
  },
  {
    // Photos 32-0 … 32-3
    id: 'p-032', sku: 'LL-SHR-032', photo: 32, name: 'Royal Blue Linen Sheer Curtains',
    description: 'A royal blue slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4899, sale: 3699, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'kids-room'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true,
    created: '2026-06-26', care: CARE.sheer,
    colourways: [['ROY', 'Royal Blue', 'blue', '#1C3667']],
  },
  {
    // Photos 33-0 … 33-3
    id: 'p-033', sku: 'LL-SHR-033', photo: 33, name: 'Dusty Rose Linen Sheer Curtains',
    description: 'A dusty rose slub-weave linen sheer with a soft, natural texture. It filters daylight into a gentle glow while keeping your view.',
    mrp: 4599, sale: 3499, material: 'linen_blend', collection: 'Slub Linen Sheers', texture: 'slub', patterns: ['solid'],
    functional: ['sheer'], opacity: 'sheer', style: 'Minimal', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'dining-room'], primary: 'sheer-curtains', ppm: 640, roll: 280, railroad: true, bestseller: true, showroom: true,
    created: '2026-07-04', care: CARE.sheer,
    colourways: [['DUS', 'Dusty Rose', 'pink', '#885C5C']],
  },
  {
    // Photos 34-0 … 34-3
    id: 'p-034', sku: 'LL-PRT-034', photo: 34, name: 'Botanical Block Print Sheer Curtains',
    description: 'Botanical Block Print printed on a light slub-linen sheer. It softens daylight and brings colour and pattern to the window.',
    mrp: 4999, sale: 3799, material: 'linen_blend', collection: 'Printed Linen Sheers', texture: 'slub', patterns: ['floral'],
    functional: ['sheer'], opacity: 'sheer', style: 'Traditional', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom'], primary: 'printed-curtains', extraCategories: ['printed-curtains'], ppm: 780, roll: 280, railroad: true, bestseller: true,
    created: '2026-08-09', care: CARE.sheer,
    colourways: [['BOT', 'Botanical Block Print', 'multi', '#9B8F83']],
  },
  {
    // Photos 35-0 … 35-3
    id: 'p-035', sku: 'LL-PRT-035', photo: 35, name: 'Willow Leaf Floral Sheer Curtains',
    description: 'Willow Leaf Floral printed on a light slub-linen sheer. It softens daylight and brings colour and pattern to the window.',
    mrp: 4799, sale: 3599, material: 'linen_blend', collection: 'Printed Linen Sheers', texture: 'slub', patterns: ['floral'],
    functional: ['sheer'], opacity: 'sheer', style: 'Contemporary', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom'], primary: 'printed-curtains', extraCategories: ['printed-curtains'], ppm: 780, roll: 280, railroad: true,
    created: '2026-09-14', care: CARE.sheer,
    colourways: [['WIL', 'Willow Leaf Floral', 'multi', '#A69E93']],
  },
  {
    // Photos 36-0 … 36-3
    id: 'p-036', sku: 'LL-PRT-036', photo: 36, name: 'Indigo Shibori Check Sheer Curtains',
    description: 'Indigo Shibori Check printed on a light slub-linen sheer. It softens daylight and brings colour and pattern to the window.',
    mrp: 4499, sale: 3399, material: 'linen_blend', collection: 'Printed Linen Sheers', texture: 'slub', patterns: ['geometric'],
    functional: ['sheer'], opacity: 'sheer', style: 'Contemporary', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom'], primary: 'printed-curtains', extraCategories: ['printed-curtains'], ppm: 780, roll: 280, railroad: true,
    created: '2026-10-19', care: CARE.sheer,
    colourways: [['IND', 'Indigo Shibori Check', 'blue', '#5D5B5D']],
  },
  {
    // Photos 37-0 … 37-3
    id: 'p-037', sku: 'LL-PRT-037', photo: 37, name: 'Terracotta Paisley Sheer Curtains',
    description: 'Terracotta Paisley printed on a light slub-linen sheer. It softens daylight and brings colour and pattern to the window.',
    mrp: 5399, sale: 4099, material: 'linen_blend', collection: 'Printed Linen Sheers', texture: 'slub', patterns: ['floral'],
    functional: ['sheer'], opacity: 'sheer', style: 'Traditional', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'dining-room'], primary: 'printed-curtains', extraCategories: ['printed-curtains'], ppm: 780, roll: 280, railroad: true,
    created: '2026-04-24', care: CARE.sheer,
    colourways: [['TER', 'Terracotta Paisley', 'multi', '#A28A7A']],
  },
  {
    // Photos 38-0 … 38-3
    id: 'p-038', sku: 'LL-PRT-038', photo: 38, name: 'Tropical Leaf Sheer Curtains',
    description: 'Tropical Leaf printed on a light slub-linen sheer. It softens daylight and brings colour and pattern to the window.',
    mrp: 5099, sale: 3899, material: 'linen_blend', collection: 'Printed Linen Sheers', texture: 'slub', patterns: ['floral'],
    functional: ['sheer'], opacity: 'sheer', style: 'Contemporary', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'kids-room'], primary: 'printed-curtains', extraCategories: ['printed-curtains'], ppm: 780, roll: 280, railroad: true,
    created: '2026-05-02', care: CARE.sheer,
    colourways: [['TRO', 'Tropical Leaf', 'multi', '#A3907C']],
  },
  {
    // Photos 39-0 … 39-3
    id: 'p-039', sku: 'LL-VEL-039', photo: 39, name: 'Emerald Crushed Velvet Curtains',
    description: 'Deep emerald crushed velvet with a soft sheen that catches the light. A heavy, generous drape with tailored pinch pleats.',
    mrp: 7699, sale: 5799, material: 'velvet', collection: 'Velvet', texture: 'crushed', patterns: ['solid'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Luxe', headings: ['pinch_pleat', 'eyelet'], linings: ['unlined', 'cotton_lining', 'blackout_lining'],
    rooms: ['living-room', 'bedroom', 'dining-room', 'hospitality'], primary: 'velvet-curtains', ppm: 1150, roll: 140, railroad: false, bestseller: true, showroom: true,
    created: '2026-06-07', care: CARE.dry,
    colourways: [['EME', 'Emerald', 'green', '#132B21']],
  },
  {
    // Photos 40-0 … 40-3
    id: 'p-040', sku: 'LL-PRT-040', photo: 40, name: 'Ikat Diamond Sheer Curtains',
    description: 'Ikat Diamond printed on a light slub-linen sheer. It softens daylight and brings colour and pattern to the window.',
    mrp: 4599, sale: 3499, material: 'linen_blend', collection: 'Printed Linen Sheers', texture: 'slub', patterns: ['geometric'],
    functional: ['sheer'], opacity: 'sheer', style: 'Traditional', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'dining-room'], primary: 'printed-curtains', extraCategories: ['printed-curtains'], ppm: 780, roll: 280, railroad: true,
    created: '2026-07-12', care: CARE.sheer,
    colourways: [['IKA', 'Ikat Diamond', 'multi', '#94897C']],
  },
  {
    // Photos 41-0 … 41-3
    id: 'p-041', sku: 'LL-BCL-041', photo: 41, name: 'Ivory Boucle Curtains',
    description: 'A ivory boucle weave with a soft, looped texture you can feel. Hangs in full, even folds from tailored pinch pleats.',
    mrp: 6999, sale: 5299, material: 'poly_viscose', collection: 'Boucle Weaves', texture: 'basket_weave', patterns: ['solid', 'textured'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Contemporary', headings: ['pinch_pleat', 'eyelet'], linings: ['unlined', 'cotton_lining'],
    rooms: ['living-room', 'bedroom', 'hospitality'], primary: 'textured-curtains', ppm: 920, roll: 140, railroad: false, showroom: true,
    created: '2026-08-17', care: CARE.dry,
    colourways: [['IVO', 'Ivory', 'ivory', '#B5A692']],
  },
  {
    // Photos 42-0 … 42-3
    id: 'p-042', sku: 'LL-BCL-042', photo: 42, name: 'Charcoal Boucle Curtains',
    description: 'A charcoal boucle weave with a soft, looped texture you can feel. Hangs in full, even folds from tailored pinch pleats.',
    mrp: 6699, sale: 5099, material: 'poly_viscose', collection: 'Boucle Weaves', texture: 'basket_weave', patterns: ['solid', 'textured'],
    functional: ['light_filtering'], opacity: 'light_filtering', style: 'Contemporary', headings: ['pinch_pleat', 'eyelet'], linings: ['unlined', 'cotton_lining'],
    rooms: ['living-room', 'bedroom', 'hospitality'], primary: 'textured-curtains', ppm: 920, roll: 140, railroad: false,
    created: '2026-09-22', care: CARE.dry,
    colourways: [['CHA', 'Charcoal', 'charcoal', '#373635', { ppm: null }]],
  },
  {
    // Photos 43-0 … 43-3
    id: 'p-043', sku: 'LL-PRT-043', photo: 43, name: 'Peach Blossom Floral Sheer Curtains',
    description: 'Peach Blossom Floral printed on a light slub-linen sheer. It softens daylight and brings colour and pattern to the window.',
    mrp: 4999, sale: 3799, material: 'linen_blend', collection: 'Printed Linen Sheers', texture: 'slub', patterns: ['floral'],
    functional: ['sheer'], opacity: 'sheer', style: 'Contemporary', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom', 'kids-room'], primary: 'printed-curtains', extraCategories: ['printed-curtains'], ppm: 780, roll: 280, railroad: true,
    created: '2026-10-27', care: CARE.sheer,
    colourways: [['PEA', 'Peach Blossom Floral', 'multi', '#B7AA9F']],
  },
  {
    // Photos 44-0 … 44-3
    id: 'p-044', sku: 'LL-PRT-044', photo: 44, name: 'Indigo Brushstroke Sheer Curtains',
    description: 'Indigo Brushstroke printed on a light slub-linen sheer. It softens daylight and brings colour and pattern to the window.',
    mrp: 4799, sale: 3599, material: 'linen_blend', collection: 'Printed Linen Sheers', texture: 'slub', patterns: ['abstract'],
    functional: ['sheer'], opacity: 'sheer', style: 'Contemporary', headings: ['eyelet', 'pinch_pleat'], linings: ['unlined'],
    rooms: ['living-room', 'bedroom'], primary: 'printed-curtains', extraCategories: ['printed-curtains'], ppm: 780, roll: 280, railroad: true,
    created: '2026-04-05', care: CARE.sheer,
    colourways: [['IND', 'Indigo Brushstroke', 'blue', '#8C8581']],
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
