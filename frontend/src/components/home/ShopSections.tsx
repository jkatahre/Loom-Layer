import { Link } from 'react-router';
import { store } from '../../config/store';
import { useAsync } from '../../hooks/useAsync';
import { getCategories, getRooms } from '../../services/productService';
import type { ProductSummary } from '../../types/product';
import { formatINR } from '../../utils/currency';
import { ProductCard } from '../ProductCard';
import { Icon } from '../ui/Icon';
import { Rail, RailItem, SectionHeading } from '../ui/Section';
import { SmartImage } from '../ui/SmartImage';
import { ErrorState, ProductCardSkeleton } from '../ui/States';

export function CategoryRail() {
  const { data, error, loading, reload } = useAsync(getCategories, []);
  return (
    <section aria-labelledby="cat-title" className="container-page py-16 lg:py-20">
      <SectionHeading id="cat-title" eyebrow="Shop by category" title="Find the right curtain for every window" link={{ to: '/categories', label: 'All categories' }} />
      {error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : (
        <div role="list" aria-label="Categories" className="scrollbar-none -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 xl:-mx-10 xl:px-10">
          {loading || !data
            ? Array.from({ length: 6 }, (_, i) => <div key={i} className="skeleton aspect-[3/4] w-40 shrink-0 rounded-2xl sm:w-48" />)
            : data.map((c) => (
                <Link role="listitem" key={c.id} to={`/catalog?category=${c.slug}`} className="group w-40 shrink-0 snap-start sm:w-48">
                  <SmartImage src={c.image} alt="" position={c.image_position} ratio="3 / 4" className="rounded-2xl" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                  <h3 className="mt-3 font-sans text-sm font-semibold group-hover:text-brand">{c.name}</h3>
                  <p className="text-xs text-muted">
                    {c.count} {c.count === 1 ? 'design' : 'designs'}
                    {c.priceFrom ? ` · from ${formatINR(c.priceFrom)}` : ''}
                  </p>
                </Link>
              ))}
        </div>
      )}
    </section>
  );
}

export function ProductRailSection({
  id,
  eyebrow,
  title,
  intro,
  link,
  state,
  tone = 'plain',
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  link?: { to: string; label: string };
  state: { data: ProductSummary[] | undefined; error: Error | null; loading: boolean; reload: () => void };
  tone?: 'plain' | 'surface';
}) {
  if (!state.loading && !state.error && state.data?.length === 0) return null;
  return (
    <section aria-labelledby={id} className={tone === 'surface' ? 'bg-surface py-16 lg:py-20' : 'py-16 lg:py-20'}>
      <div className="container-page">
        <SectionHeading id={id} eyebrow={eyebrow} title={title} intro={intro} link={link} />
        {state.error ? (
          <ErrorState error={state.error} onRetry={state.reload} />
        ) : (
          <Rail label={title}>
            {state.loading || !state.data
              ? Array.from({ length: 4 }, (_, i) => (
                  <RailItem key={i}>
                    <ProductCardSkeleton />
                  </RailItem>
                ))
              : state.data.map((p) => (
                  <RailItem key={p.id}>
                    <ProductCard product={p} />
                  </RailItem>
                ))}
          </Rail>
        )}
      </div>
    </section>
  );
}

export function RoomGrid() {
  const { data, error, loading, reload } = useAsync(getRooms, []);
  return (
    <section aria-labelledby="room-title" className="container-page py-16 lg:py-20">
      <SectionHeading id="room-title" eyebrow="Shop by room" title="Curtains made for the way each room is used" />
      {error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {loading || !data
            ? Array.from({ length: 7 }, (_, i) => <div key={i} className="skeleton aspect-[4/5] rounded-2xl" />)
            : data.map((r, i) => (
                <Link
                  key={r.slug}
                  to={`/catalog?room=${r.slug}`}
                  className={`group relative overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 row-span-2 md:col-span-2' : ''}`}
                >
                  <SmartImage src={r.image.src} alt={r.image.alt} position={r.image.position} ratio={i === 0 ? '4 / 5' : '4 / 5'} className="h-full" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-canvas sm:p-5">
                    <h3 className={i === 0 ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'}>{r.label}</h3>
                    <p className="mt-0.5 text-xs text-canvas/80 sm:text-sm">{r.description}</p>
                    <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold">
                      {r.count} designs <Icon name="arrowRight" size={13} />
                    </p>
                  </div>
                </Link>
              ))}
        </div>
      )}
    </section>
  );
}

export function FabricExplorer() {
  return (
    <section aria-labelledby="fabric-title" className="bg-sand/60 py-16 lg:py-20">
      <div className="container-page">
        <SectionHeading
          id="fabric-title"
          eyebrow="Explore fabrics"
          title="Start with the fabric — the rest follows"
          intro="Each fabric family drapes, filters light and ages differently. Touch them all at the showroom, or start here."
          link={{ to: '/fabrics', label: 'Fabric guide' }}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {store.fabricFamilies.map((f) => {
            const params = new URLSearchParams();
            if (f.materials.length) params.set('material', f.materials.join(','));
            if (f.textures.length) params.set('texture', f.textures.join(','));
            return (
              <Link key={f.id} to={`/catalog?${params}`} className="group flex gap-4 rounded-2xl bg-canvas p-3 shadow-soft transition-shadow hover:shadow-lift">
                <SmartImage src={f.image.src} alt={f.image.alt} ratio="1" className="w-28 shrink-0 rounded-xl sm:w-32" imgClassName="transition-transform duration-700 group-hover:scale-110" />
                <div className="min-w-0 py-1 pr-2">
                  <h3 className="text-lg group-hover:text-brand">{f.label}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{f.description}</p>
                  <p className="mt-2 text-xs text-muted">
                    <span className="font-semibold text-ink">Best for:</span> {f.bestFor}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
