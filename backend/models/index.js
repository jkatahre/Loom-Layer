/**
 * Data model reference. These mirror the TypeScript types in
 * frontend/src/types/*.ts — keep them in sync when you add a database.
 *
 * Suggested tables:
 *   categories(id, name, slug, description, image, rooms[], show_when_empty, sort_order)
 *   products(id, category_id, name, slug, sku, description, base_price, sale_price, price_mode, … , created_at, updated_at)
 *   product_categories(product_id, category_id)
 *   fabric_variants(id, product_id, variant_sku, name, material, color, color_hex, pattern, texture, opacity,
 *                   fabric_roll_width_cm, pattern_repeat_cm, railroadable, price_per_meter, stock_status, status)
 *   product_images(id, product_id, variant_id, type, url, alt, sort_order)
 *   size_options(id, label, size_type, width_basis, finished_width, finished_drop, dimension_unit, selling_unit, panels_per_pair)
 *   variant_size_prices(id, variant_id, size_option_id, mrp, sale_price, price_mode, currency, is_available)
 *   custom_quotes(id, product_id, variant_id, finished_width, finished_drop, … , estimated_total, pricing_rule_version, status)
 *   enquiries(id, kind, name, city, payload jsonb, created_at)
 *
 * Money columns are integer paise; length columns are integer millimetres.
 */
export const MODELS = ['categories', 'products', 'fabric_variants', 'product_images', 'size_options', 'variant_size_prices', 'custom_quotes', 'enquiries'];
