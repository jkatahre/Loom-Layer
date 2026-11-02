import { Link } from 'react-router';
import { SmartImage } from '../components/ui/SmartImage';
import { ErrorState } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { usePageMeta } from '../hooks/usePageMeta';
import { getCategories } from '../services/productService';

/** Same spacing as the catalogue. Two or four columns keep all 20 rows full. */
const GRID = 'grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-3 md:grid-cols-4 lg:gap-x-4 lg:gap-y-9';

export function CategoriesPage() {
  usePageMeta('Curtain categories', 'Browse sheer, blackout, linen, velvet, eyelet, pinch-pleat and custom-made curtains.');
  const { data, error, loading, reload } = useAsync(getCategories, []);

  return (
    <div className="px-3 pt-2 sm:px-4 lg:px-8">
      <h1 className="mb-3 text-2xl sm:text-[1.75rem]">Categories</h1>
      {error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : loading || !data ? (
        <div className={GRID}>{Array.from({ length: 20 }, (_, i) => <div key={i} className="skeleton aspect-square rounded-xl" />)}</div>
      ) : (
        <div className={GRID}>
          {data.map((c) => (
            <Link key={c.id} to={`/catalog?category=${c.slug}`} className="group block rounded-xl focus-visible:outline-offset-4">
              <div className="overflow-hidden rounded-xl bg-sand p-1.5 sm:p-2">
                <SmartImage src={c.image} alt="" position={c.image_position} ratio="1" className="rounded-lg" imgClassName="transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
              <h2 className="mt-3 truncate px-1 font-sans text-sm font-semibold text-ink group-hover:text-brand">{c.name}</h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
