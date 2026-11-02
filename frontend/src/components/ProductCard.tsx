import { Link } from 'react-router';
import type { ProductSummary } from '../types/product';
import { cn } from '../utils/cn';
import { priceView } from '../utils/priceDisplay';
import { PriceTag } from './ui/PriceTag';
import { SmartImage } from './ui/SmartImage';

/**
 * Catalogue card. Deliberately has no WhatsApp/enquiry buttons — variants,
 * sizes and pricing are chosen on the product page.
 */
export function ProductCard({ product, priority, className }: { product: ProductSummary; priority?: boolean; className?: string }) {
  const view = priceView(product.price_mode, product.priceFrom, product.mrpFrom, product.selling_unit, {
    forceStartingFrom: product.price_mode !== 'on_request' && product.sizeCount > 1,
  });

  return (
    <article className={cn('group relative', className)}>
      <Link to={`/products/${product.slug}`} className="block rounded-xl focus-visible:outline-offset-4">
        <div className="relative overflow-hidden rounded-xl bg-sand p-1.5 sm:p-2">
          <SmartImage
            src={product.primaryImage?.url}
            alt={product.primaryImage?.alt ?? product.name}
            position={product.primaryImage?.position}
            ratio="1"
            priority={priority}
            className="rounded-lg"
            imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
          />
          {product.hoverImage && (
            <div className="absolute inset-1.5 opacity-0 transition-opacity sm:inset-2 duration-500 group-hover:opacity-100 max-md:hidden" aria-hidden="true">
              <SmartImage src={product.hoverImage.url} alt="" ratio="1" className="rounded-lg" />
            </div>
          )}
          {product.is_bestseller && <span className="absolute top-2 left-2 rounded-full bg-canvas/90 px-2.5 py-1 text-[11px] font-semibold text-ink backdrop-blur">Bestseller</span>}
        </div>

        <h3 className="mt-3 truncate px-1 font-sans text-sm font-semibold text-ink group-hover:text-brand">{product.name}</h3>
        <PriceTag view={view} size="sm" className="mt-1.5 px-1" />
      </Link>
    </article>
  );
}
