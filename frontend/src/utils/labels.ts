import { store } from '../config/store';
import type {
  FunctionalType,
  HeadingStyle,
  LiningOption,
  Material,
  Opacity,
  Pattern,
  PriceMode,
  RoomSlug,
  SellingUnit,
  StockStatus,
  Texture,
} from '../types/product';

export const MATERIAL_LABELS: Record<Material, string> = {
  linen: 'Linen',
  linen_blend: 'Linen blend',
  cotton: 'Cotton',
  cotton_blend: 'Cotton blend',
  velvet: 'Velvet',
  polyester: 'Polyester',
  poly_viscose: 'Poly-viscose',
};

export const PATTERN_LABELS: Record<Pattern, string> = {
  solid: 'Solid',
  floral: 'Floral',
  geometric: 'Geometric',
  striped: 'Striped',
  embroidered: 'Embroidered',
  textured: 'Textured',
  abstract: 'Abstract',
};

export const TEXTURE_LABELS: Record<Texture, string> = {
  smooth: 'Smooth',
  slub: 'Slub',
  voile: 'Voile',
  jacquard: 'Jacquard',
  plush: 'Plush pile',
  herringbone: 'Herringbone',
  basket_weave: 'Basket weave',
  crushed: 'Crushed',
};

export const FUNCTION_LABELS: Record<FunctionalType, string> = {
  sheer: 'Sheer',
  light_filtering: 'Light-filtering',
  room_darkening: 'Room-darkening',
  blackout: 'Blackout',
  thermal: 'Thermal',
};

export const OPACITY_LABELS: Record<Opacity, string> = {
  sheer: 'Sheer — lets most light through',
  semi_sheer: 'Semi-sheer',
  light_filtering: 'Light-filtering — softens daylight',
  room_darkening: 'Room-darkening — dims the room substantially',
  blackout: 'Blackout — blocks most daylight',
};

export const PRICE_MODE_LABELS: Record<PriceMode, string> = {
  fixed: 'Fixed price',
  starting_from: 'Starting from',
  best_price: 'Best price on request',
  on_request: 'Price on request',
};

export const STOCK_LABELS: Record<StockStatus, string> = {
  in_stock: 'In stock',
  low_stock: 'Only a few left',
  made_to_order: 'Made to order',
  out_of_stock: 'Out of stock',
};

export const SELLING_UNIT_SUFFIX: Record<SellingUnit, string> = {
  pair: '/ pair',
  panel: '/ panel',
  custom: '/ pair',
};

export const headingLabel = (h: HeadingStyle) => store.pricing.rateCard.headings[h].label;
export const liningLabel = (l: LiningOption) => store.pricing.rateCard.linings[l].label;

export const ROOM_LABELS = Object.fromEntries(store.home.rooms.map((r) => [r.slug, r.label])) as Record<RoomSlug, string>;

export const listLabels = <T extends string>(values: T[], labels: Record<T, string>) => values.map((v) => labels[v]).join(', ');
