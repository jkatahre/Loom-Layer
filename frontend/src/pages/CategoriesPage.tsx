import type React from 'react';
import { Link } from 'react-router';
import { SectionHeading } from '../components/ui/Section';
import { SmartImage } from '../components/ui/SmartImage';
import { ErrorState } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { usePageMeta } from '../hooks/usePageMeta';
import { getCategories, type CategoryWithStats } from '../services/productService';
import { formatINR } from '../utils/currency';

const GROUPS: { title: string; intro: string; slugs: string[] }[] = [
  { title: 'By light control', intro: 'How much daylight and heat the curtain lets through.', slugs: ['sheer-curtains', 'room-darkening-curtains', 'blackout-curtains', 'thermal-curtains'] },
  { title: 'By material', intro: 'The fibre decides drape, feel and care.', slugs: ['linen-curtains', 'cotton-curtains', 'velvet-curtains', 'polyester-curtains'] },
  { title: 'By heading', intro: 'How the curtain hangs from the rod or track.', slugs: ['eyelet-curtains', 'pinch-pleat-curtains', 'pencil-pleat-curtains', 'rod-pocket-curtains'] },
  { title: 'By pattern', intro: 'From quiet plains to bold prints.', slugs: ['solid-colour-curtains', 'textured-curtains', 'floral-curtains', 'geometric-curtains', 'printed-curtains'] },
  { title: 'By room & service', intro: 'Made for particular rooms — or for your exact window.', slugs: ['kids-curtains', 'kitchen-curtains', 'custom-made-curtains'] },
];

export function CategoriesPage() {
  usePageMeta('Curtain categories', 'Browse sheer, blackout, linen, velvet, eyelet, pinch-pleat and custom-made curtains.');
  const { data, error, loading, reload } = useAsync(getCategories, []);
  const bySlug = new Map((data ?? []).map((c) => [c.slug, c]));

  return (
    <div className="container-page py-10">
      <SectionHeading eyebrow="Categories" title="Browse every way to dress a window" intro="Categories overlap — a linen blackout eyelet curtain appears under linen, blackout and eyelet." />
      {error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <div key={i} className="skeleton aspect-[4/5] rounded-2xl" />)}</div>
      ) : (
        <div className="divide-y divide-line border-t border-line">
          {GROUPS.map((g, gi) => {
            const items = g.slugs.map((s) => bySlug.get(s)).filter((c): c is CategoryWithStats => !!c);
            if (!items.length) return null;
            const odd = items.length % 2 === 1;
            // Wider cards get a flatter image so every group's cards are about the same height.
            const ratio = items.length <= 3 ? '4 / 3' : items.length === 4 ? '1 / 1' : '4 / 5';
            return (
              <section key={g.title} aria-labelledby={`g-${gi}`} className="grid gap-6 py-10 xl:grid-cols-[220px_1fr] xl:gap-10">
                <header>
                  <p className="eyebrow mb-2">{String(gi + 1).padStart(2, '0')}</p>
                  <h2 id={`g-${gi}`} className="text-2xl">{g.title}</h2>
                  <p className="mt-1.5 text-sm text-muted">{g.intro}</p>
                </header>
                {/* One column per category from md up, so every row is filled edge to edge. */}
                <div
                  className="grid grid-cols-2 gap-4 md:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
                  style={{ '--cols': items.length } as React.CSSProperties}
                >
                  {items.map((c, i) => {
                    // On phones an odd last card spans both columns in landscape, so no gap is left.
                    const wide = odd && i === items.length - 1;
                    return (
                      <Link key={c.id} to={`/catalog?category=${c.slug}`} className={`group ${wide ? 'col-span-2 md:col-span-1' : ''}`}>
                        <SmartImage
                          src={c.image}
                          alt=""
                          ratio={ratio}
                          position={c.image_position}
                          priority={gi === 0}
                          className={`rounded-2xl ${wide ? 'max-md:!aspect-[16/9]' : 'max-md:!aspect-[4/5]'}`}
                          imgClassName="transition-transform duration-700 group-hover:scale-105"
                        />
                        <h3 className="mt-3 font-sans text-[15px] font-semibold group-hover:text-brand">{c.name}</h3>
                        <p className="text-xs text-muted">{c.count} designs{c.priceFrom ? ` · from ${formatINR(c.priceFrom)} / pair` : ''}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-muted">{c.description}</p>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
