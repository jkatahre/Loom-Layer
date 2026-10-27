import { Link } from 'react-router';
import { store } from '../config/store';
import { isOnFestivalOffer } from '../services/productService';
import type { ProductSummary } from '../types/product';
import { cn } from '../utils/cn';
import { FUNCTION_LABELS, MATERIAL_LABELS } from '../utils/labels';
import { priceView } from '../utils/priceDisplay';
import { isFestivalLive } from '../utils/promotions';
import { PriceTag } from './ui/PriceTag';
import { SmartImage } from './ui/SmartImage';
import { StarRating } from './ui/StarRating';

/**
 * Catalogue card. Deliberately has no WhatsApp/enquiry buttons — variants,
 * sizes and pricing are chosen on the product page.
 */
export function ProductCard({ product, priority, className }: { product: ProductSummary; priority?: boolean; className?: string }) {
  const view = priceView(product.price_mode, product.priceFrom, product.mrpFrom, product.selling_unit, {
    forceStartingFrom: product.price_mode !== 'on_request' && product.sizeCount > 1,
  });
  const festive = isFestivalLive(store.festival) && store.festival?.badge && isOnFestivalOffer(product);
  const colours = product.variants.slice(0, 5);

  return (
    <article className={cn('group relative', className)}>
      <Link to={`/products/${product.slug}`} className="block rounded-2xl focus-visible:outline-offset-4">
        <div className="relative overflow-hidden rounded-2xl bg-sand">
          <SmartImage
            src={product.primaryImage?.url}
            alt={product.primaryImage?.alt ?? product.name}
            position={product.primaryImage?.position}
            ratio="4 / 5"
            priority={priority}
            imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
          />
          {product.hoverImage && (
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 max-md:hidden" aria-hidden="true">
              <SmartImage src={product.hoverImage.url} alt="" ratio="4 / 5" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
            {view.discountPct && <span className="rounded-full bg-sale px-2.5 py-1 text-[11px] font-semibold text-white">{view.discountPct}% off</span>}
            {festive && <span className="rounded-full bg-festive px-2.5 py-1 text-[11px] font-semibold text-festive-gold">{store.festival!.badge!.label}</span>}
            {product.is_bestseller && <span className="rounded-full bg-canvas/90 px-2.5 py-1 text-[11px] font-semibold text-ink backdrop-blur">Bestseller</span>}
          </div>
          {product.in_showroom && (
            <span className="absolute right-3 bottom-3 rounded-full bg-canvas/90 px-2.5 py-1 text-[11px] font-medium text-ink backdrop-blur">In showroom</span>
          )}
        </div>

        <div className="mt-3.5 px-0.5">
          <div className="flex items-center justify-between gap-3">
            <ul className="flex items-center gap-1" aria-label={`${product.variants.length} colours`}>
              {colours.map((v) => (
                <li key={v.id} className="size-3.5 rounded-full border border-ink/10" style={{ background: v.color_hex }} title={v.name} />
              ))}
              {product.variants.length > colours.length && <li className="text-[11px] text-muted">+{product.variants.length - colours.length}</li>}
            </ul>
            {product.rating && (
              <span className="flex items-center gap-1 text-[11px] text-muted">
                <StarRating value={product.rating.average} size={11} /> {product.rating.count}
              </span>
            )}
          </div>
          <h3 className="mt-2 font-sans text-[15px] leading-snug font-semibold text-ink group-hover:text-brand">{product.name}</h3>
          <p className="mt-1 text-xs text-muted">
            {MATERIAL_LABELS[product.fabric_material]} · {product.functional_types.map((f) => FUNCTION_LABELS[f]).join(', ')}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {product.standard_sizing_enabled && product.sizeLabel
              ? `${product.sizeCount} ${product.sizeCount === 1 ? 'size' : 'sizes'} · from ${product.sizeLabel}${product.custom_sizing_enabled ? ' · custom' : ''}`
              : 'Made to measure'}
          </p>
          <PriceTag view={view} size="sm" showEmi className="mt-2.5" />
        </div>
      </Link>
    </article>
  );
}
