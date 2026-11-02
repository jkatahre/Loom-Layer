import { Link } from 'react-router';
import { store } from '../../config/store';
import { useAsync } from '../../hooks/useAsync';
import { getCategories, getRooms } from '../../services/productService';
import type { ProductSummary } from '../../types/product';
import { ProductCard } from '../ProductCard';
import { ImageTile } from '../ui/ImageTile';
import { Rail, RailItem, SectionHeading } from '../ui/Section';
import { SmartImage } from '../ui/SmartImage';
import { ErrorState, ProductCardSkeleton } from '../ui/States';

export function CategoryRail() {
  const { data, error, loading, reload } = useAsync(getCategories, []);
  return (
    <section aria-labelledby="cat-title" className="page-wide py-7 lg:py-10">
      <SectionHeading id="cat-title" title="Shop by category" link={{ to: '/categories', label: 'All categories' }} />
      {error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : (
        <div className="grid grid-cols-3 gap-x-2 gap-y-4 sm:gap-x-3 lg:grid-cols-6 lg:gap-x-4">
          {loading || !data
            ? Array.from({ length: 6 }, (_, i) => <div key={i} className="skeleton aspect-square rounded-xl" />)
            : data.slice(0, 6).map((c) => (
                <Link key={c.id} to={`/catalog?category=${c.slug}`} className="group block rounded-xl">
                  <div className="overflow-hidden rounded-xl bg-sand p-1 sm:p-2">
                    <SmartImage src={c.image} alt="" position={c.image_position} ratio="1" className="rounded-lg" imgClassName="transition-transform duration-700 group-hover:scale-[1.03]" />
                  </div>
                  <h3 className="mt-2 truncate px-1 font-sans text-sm font-semibold group-hover:text-brand">{c.name.replace(/ Curtains$/, '')}</h3>
                </Link>
              ))}
        </div>
      )}
    </section>
  );
}

export function ProductRailSection({
  id,
  title,
  link,
  state,
  tone = 'plain',
}: {
  id: string;
  title: string;
  link?: { to: string; label: string };
  state: { data: ProductSummary[] | undefined; error: Error | null; loading: boolean; reload: () => void };
  tone?: 'plain' | 'surface';
}) {
  if (!state.loading && !state.error && state.data?.length === 0) return null;
  return (
    <section aria-labelledby={id} className={tone === 'surface' ? 'bg-surface py-7 lg:py-10' : 'py-7 lg:py-10'}>
      <div className="page-wide">
        <SectionHeading id={id} title={title} link={link} />
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
    <section aria-labelledby="room-title" className="page-wide py-7 lg:py-10">
      <SectionHeading id="room-title" title="Shop by room" />
      {error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-5 lg:gap-4">
          {loading || !data
            ? Array.from({ length: 7 }, (_, i) => <div key={i} className={`skeleton aspect-square rounded-xl ${i === 0 ? 'col-span-2 row-span-2' : ''}`} />)
            : data.map((r, i) => (
                <ImageTile key={r.slug} to={`/catalog?room=${r.slug}`} src={r.image.src} alt={r.image.alt} position={r.image.position} label={r.label} large={i === 0} className={i === 0 ? 'col-span-2 row-span-2' : ''} />
              ))}
        </div>
      )}
    </section>
  );
}

/** One square tile per fabric family, shared by the homepage and the fabrics page. */
export function FabricFamilyGrid() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:gap-4 xl:grid-cols-6">
      {store.fabricFamilies.map((f) => {
        const params = new URLSearchParams();
        if (f.materials.length) params.set('material', f.materials.join(','));
        if (f.textures.length) params.set('texture', f.textures.join(','));
        return <ImageTile key={f.id} to={`/catalog?${params}`} src={f.image.src} alt={f.image.alt} label={f.label} />;
      })}
    </div>
  );
}

export function FabricExplorer() {
  return (
    <section aria-labelledby="fabric-title" className="page-wide py-7 lg:py-10">
      <SectionHeading id="fabric-title" title="Shop by fabric" link={{ to: '/fabrics', label: 'Fabric guide' }} />
      <FabricFamilyGrid />
    </section>
  );
}
