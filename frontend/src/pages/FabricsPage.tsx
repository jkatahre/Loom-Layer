import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { FabricFamilyGrid } from '../components/home/ShopSections';
import { SmartImage } from '../components/ui/SmartImage';
import { EmptyState, ErrorState } from '../components/ui/States';
import { store } from '../config/store';
import { useEnquiry } from '../contexts/EnquiryContext';
import { useAsync } from '../hooks/useAsync';
import { usePageMeta } from '../hooks/usePageMeta';
import { getProducts } from '../services/productService';
import type { ColourFamily, Material, Pattern, Texture } from '../types/product';
import { cn } from '../utils/cn';
import { MATERIAL_LABELS, PATTERN_LABELS, TEXTURE_LABELS } from '../utils/labels';

type Dimension = 'material' | 'texture' | 'color' | 'pattern';
const DIMENSIONS: { key: Dimension; label: string }[] = [
  { key: 'material', label: 'Material' },
  { key: 'texture', label: 'Texture' },
  { key: 'color', label: 'Colour' },
  { key: 'pattern', label: 'Pattern' },
];

const swatchLabel = (dim: Dimension, v: string) =>
  dim === 'material'
    ? MATERIAL_LABELS[v as Material]
    : dim === 'texture'
      ? TEXTURE_LABELS[v as Texture]
      : dim === 'pattern'
        ? PATTERN_LABELS[v as Pattern]
        : (store.swatches.find((s) => s.family === (v as ColourFamily))?.label ?? v);

export function FabricsPage() {
  usePageMeta('Fabric library', 'Browse curtain fabrics by material, texture, colour and pattern.');
  const { data, error, loading, reload } = useAsync(getProducts, []);
  const { openEnquiry } = useEnquiry();
  const [dim, setDim] = useState<Dimension>('material');
  const [value, setValue] = useState<string | null>(null);

  const swatches = useMemo(
    () => (data ?? []).flatMap((p) => p.variants.map((v) => ({ v, p }))),
    [data],
  );
  const valueOf = (s: (typeof swatches)[number]) =>
    dim === 'material' ? s.v.material : dim === 'texture' ? s.v.texture : dim === 'color' ? s.v.color : s.v.pattern;
  const values = useMemo(() => {
    const counts = new Map<string, number>();
    swatches.forEach((s) => counts.set(valueOf(s), (counts.get(valueOf(s)) ?? 0) + 1));
    return [...counts].sort((a, b) => b[1] - a[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swatches, dim]);
  const shown = value ? swatches.filter((s) => valueOf(s) === value) : swatches;
  const catalogKey = dim === 'color' ? 'color' : dim;

  return (
    <>
      <section className="container-page pt-3 pb-6">
        <h1 className="mb-3 text-2xl sm:text-[1.75rem]">Fabrics</h1>
        <FabricFamilyGrid />
      </section>

      <section aria-labelledby="lib-title" className="bg-surface py-6">
        <div className="container-page">
          <h2 id="lib-title" className="text-xl">Swatch library</h2>
          <div role="tablist" aria-label="Browse fabrics by" className="mt-3 inline-flex rounded-full bg-sand p-1">
            {DIMENSIONS.map((d) => (
              <button key={d.key} role="tab" type="button" aria-selected={dim === d.key} onClick={() => { setDim(d.key); setValue(null); }} className={cn('min-h-9 rounded-full px-4 text-sm font-semibold', dim === d.key ? 'bg-canvas shadow-soft' : 'text-muted')}>
                {d.label}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="chip" aria-pressed={value === null} onClick={() => setValue(null)}>All ({swatches.length})</button>
            {values.map(([v, n]) => (
              <button key={v} type="button" className="chip" aria-pressed={value === v} onClick={() => setValue(v)}>
                {dim === 'color' && <span className="size-3 rounded-full border border-ink/10" style={{ background: store.swatches.find((s) => s.family === v)?.hex }} />}
                {swatchLabel(dim, v)} ({n})
              </button>
            ))}
          </div>
          {value && (
            <Link to={`/catalog?${catalogKey}=${value}`} className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">
              Shop {swatchLabel(dim, value).toLowerCase()} curtains →
            </Link>
          )}

          {error ? (
            <ErrorState error={error} onRetry={reload} className="mt-6" />
          ) : loading ? (
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">{Array.from({ length: 12 }, (_, i) => <div key={i} className="skeleton aspect-square rounded-xl" />)}</div>
          ) : shown.length === 0 ? (
            <EmptyState title="No fabrics here yet" className="mt-6" />
          ) : (
            <ul className="mt-4 grid grid-cols-3 gap-x-2 gap-y-3 sm:grid-cols-4 lg:grid-cols-6">
              {shown.map(({ v, p }) => (
                <li key={v.id} className="group">
                  <Link to={`/products/${p.slug}`} className="block">
                    <SmartImage src={`/images/fabrics/${v.variant_sku.toLowerCase()}.webp`} alt={`${v.name} ${MATERIAL_LABELS[v.material]} swatch`} ratio="1" className="rounded-xl" imgClassName="transition-transform duration-500 group-hover:scale-110" />
                    <p className="mt-2 truncate text-xs font-semibold">{v.name}</p>
                  </Link>
                  <button
                    type="button"
                    className="text-[11px] font-semibold text-brand hover:underline"
                    onClick={() => openEnquiry({ kind: 'fabric_sample', product: p.name, fabric: `${v.name} (${v.variant_sku})` })}
                  >
                    Request sample
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
