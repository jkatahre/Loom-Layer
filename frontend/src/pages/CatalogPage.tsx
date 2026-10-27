import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ProductCard } from '../components/ProductCard';
import { Dialog } from '../components/ui/Dialog';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorState, GridSkeleton } from '../components/ui/States';
import { store } from '../config/store';
import { categories } from '../data/categories';
import { sizeOptions } from '../data/sizeOptions';
import { useAsync } from '../hooks/useAsync';
import { usePageMeta } from '../hooks/usePageMeta';
import { getProducts, sizeIdsByProduct } from '../services/productService';
import type { ProductSummary } from '../types/product';
import {
  activeFilterCount,
  applyCatalog,
  facetCount,
  FILTER_KEYS,
  parseCatalogParams,
  PRICE_BANDS,
  SORT_OPTIONS,
  toCatalogParams,
  type CatalogState,
  type FilterKey,
  type SortKey,
} from '../utils/catalogFilters';
import { cn } from '../utils/cn';
import {
  FUNCTION_LABELS,
  headingLabel,
  liningLabel,
  MATERIAL_LABELS,
  PATTERN_LABELS,
  PRICE_MODE_LABELS,
  ROOM_LABELS,
  TEXTURE_LABELS,
} from '../utils/labels';

interface FacetOption {
  value: string;
  label: string;
  swatch?: string;
}

/** Filter groups and their options, built from the catalogue so nothing is offered that cannot match. */
function buildFacets(products: ProductSummary[]): { key: FilterKey; label: string; options: FacetOption[]; note?: string }[] {
  const uniq = <T,>(xs: T[]) => [...new Set(xs)];
  const all = <K extends keyof ProductSummary>(k: K) => uniq(products.flatMap((p) => p[k] as unknown as string[]));
  return [
    { key: 'room', label: 'Room', options: store.home.rooms.filter((r) => all('rooms').includes(r.slug)).map((r) => ({ value: r.slug, label: r.label })) },
    { key: 'category', label: 'Category', options: [...categories].sort((a, b) => a.sort_order - b.sort_order).map((c) => ({ value: c.slug, label: c.name })) },
    { key: 'price', label: 'Price', note: 'Lowest price per pair (or per panel where stated).', options: PRICE_BANDS.map((b) => ({ value: b.value, label: b.label })) },
    { key: 'material', label: 'Material', options: uniq(products.map((p) => p.fabric_material)).map((m) => ({ value: m, label: MATERIAL_LABELS[m] })) },
    { key: 'color', label: 'Colour', options: store.swatches.filter((s) => all('colors').includes(s.family)).map((s) => ({ value: s.family, label: s.label, swatch: s.hex })) },
    { key: 'pattern', label: 'Pattern', options: all('patterns').map((p) => ({ value: p, label: PATTERN_LABELS[p as keyof typeof PATTERN_LABELS] })) },
    { key: 'texture', label: 'Texture', options: uniq(products.map((p) => p.texture)).map((t) => ({ value: t, label: TEXTURE_LABELS[t] })) },
    { key: 'function', label: 'Light control', options: (['sheer', 'light_filtering', 'room_darkening', 'blackout', 'thermal'] as const).map((f) => ({ value: f, label: FUNCTION_LABELS[f] })) },
    { key: 'heading', label: 'Heading style', options: (['eyelet', 'pinch_pleat', 'pencil_pleat', 'rod_pocket'] as const).map((h) => ({ value: h, label: headingLabel(h) })) },
    { key: 'lining', label: 'Lining available', options: (['unlined', 'cotton_lining', 'blackout_lining', 'thermal_lining'] as const).map((l) => ({ value: l, label: liningLabel(l) })) },
    { key: 'sizing', label: 'Sizing', options: [{ value: 'standard', label: 'Ready-made sizes' }, { value: 'custom', label: 'Made to measure' }] },
    { key: 'size', label: 'Size & drop', options: sizeOptions.map((s) => ({ value: s.id, label: s.label })) },
    { key: 'availability', label: 'Availability', options: [{ value: 'in_stock', label: 'In stock' }, { value: 'made_to_order', label: 'Made to order' }, { value: 'in_showroom', label: 'On display in showroom' }] },
    { key: 'mode', label: 'Price type', options: (['fixed', 'starting_from', 'best_price', 'on_request'] as const).map((m) => ({ value: m, label: PRICE_MODE_LABELS[m] })) },
  ];
}

const labelFor = (facets: ReturnType<typeof buildFacets>, key: FilterKey, value: string) =>
  facets.find((f) => f.key === key)?.options.find((o) => o.value === value)?.label ?? value;

export function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const state = useMemo(() => parseCatalogParams(params), [params]);
  const { data, error, loading, reload } = useAsync(getProducts, []);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState<CatalogState>(state);
  const [qInput, setQInput] = useState(state.q);

  useEffect(() => setQInput(state.q), [state.q]);

  const facets = useMemo(() => buildFacets(data ?? []), [data]);
  const results = useMemo(() => (data ? applyCatalog(data, state, sizeIdsByProduct) : []), [data, state]);

  const singleCategory = state.filters.category.length === 1 ? categories.find((c) => c.slug === state.filters.category[0]) : null;
  const heading = state.q ? `Results for “${state.q}”` : singleCategory?.name ?? (state.filters.room.length === 1 ? `${ROOM_LABELS[state.filters.room[0] as keyof typeof ROOM_LABELS]} curtains` : 'All curtains');
  usePageMeta(heading, singleCategory?.description);

  const commit = (next: CatalogState) => setParams(toCatalogParams(next), { replace: true });
  const toggle = (s: CatalogState, key: FilterKey, value: string): CatalogState => {
    const cur = s.filters[key];
    return { ...s, filters: { ...s.filters, [key]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] } };
  };
  const clearAll = (s: CatalogState): CatalogState => ({ ...s, q: '', filters: Object.fromEntries(FILTER_KEYS.map((k) => [k, []])) as unknown as CatalogState['filters'] });

  const chips = FILTER_KEYS.flatMap((k) => state.filters[k].map((v) => ({ key: k, value: v, label: labelFor(facets, k, v) })));
  const count = activeFilterCount(state);

  const openDrawer = () => {
    setDraft(state);
    setDrawerOpen(true);
  };

  return (
    <div className="container-page pt-8 pb-10">
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <Link to="/" className="hover:text-ink">Home</Link> <span aria-hidden="true">/</span> <span className="text-ink">Curtains</span>
      </nav>
      <header className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[2.25rem] sm:text-[2.75rem]">{heading}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            {singleCategory?.description ?? 'Every price shows its selling unit — normally one pair (two panels).'}
          </p>
        </div>
        <form
          role="search"
          className="relative w-full md:w-80"
          onSubmit={(e) => {
            e.preventDefault();
            commit({ ...state, q: qInput.trim() });
          }}
        >
          <label htmlFor="catalog-q" className="sr-only">Search the catalogue</label>
          <Icon name="search" size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
          <input id="catalog-q" type="search" className="field rounded-full pl-10" placeholder="Name, fabric, colour, SKU…" value={qInput} onChange={(e) => setQInput(e.target.value)} onBlur={() => qInput.trim() !== state.q && commit({ ...state, q: qInput.trim() })} />
        </form>
      </header>

      <div className="sticky top-16 z-20 -mx-4 mt-6 flex items-center justify-between gap-3 border-y border-line bg-canvas/95 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-x-0 lg:bg-transparent lg:px-0">
        <button type="button" className="btn btn-outline btn-sm lg:hidden" onClick={openDrawer}>
          <Icon name="filter" size={16} /> Filters{count ? ` (${count})` : ''}
        </button>
        <p className="hidden text-sm text-muted lg:block" aria-live="polite">
          {loading ? 'Loading…' : `${results.length} ${results.length === 1 ? 'design' : 'designs'}`}
        </p>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted max-sm:sr-only">Sort by</span>
          <select className="field min-h-9 w-auto rounded-full py-1.5 pr-8 text-sm" value={state.sort} onChange={(e) => commit({ ...state, sort: e.target.value as SortKey })}>
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>
      </div>

      {(chips.length > 0 || state.q) && (
        <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
          {state.q && (
            <button type="button" className="chip" onClick={() => commit({ ...state, q: '' })} aria-label={`Remove search ${state.q}`}>
              “{state.q}” <Icon name="close" size={14} />
            </button>
          )}
          {chips.map((c) => (
            <button key={`${c.key}-${c.value}`} type="button" className="chip" onClick={() => commit(toggle(state, c.key, c.value))} aria-label={`Remove filter ${c.label}`}>
              {c.label} <Icon name="close" size={14} />
            </button>
          ))}
          <button type="button" className="ml-1 text-sm font-semibold text-brand hover:underline" onClick={() => commit(clearAll(state))}>Clear all</button>
        </div>
      )}

      <div className="mt-6 grid gap-10 lg:grid-cols-[250px_1fr]">
        {/* Sticky below the header with its own scroll, so only the product grid moves with the page. */}
        <aside
          aria-label="Filters"
          className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100dvh-7.5rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:pr-3 [scrollbar-width:thin]"
        >
          {data && <FilterPanel facets={facets} state={state} products={data} onToggle={(k, v) => commit(toggle(state, k, v))} />}
        </aside>

        <section aria-label="Products" className="lg:min-h-[calc(100dvh-7.5rem)]">
          <p className="mb-4 text-sm text-muted lg:hidden" aria-live="polite">{loading ? 'Loading…' : `${results.length} designs`}</p>
          {error ? (
            <ErrorState error={error} onRetry={reload} />
          ) : loading ? (
            <GridSkeleton count={9} className="md:grid-cols-3 lg:grid-cols-3" />
          ) : results.length === 0 ? (
            <EmptyState
              title="No curtains match these filters"
              body="Try removing a filter, or ask us — most designs can be made to measure in other fabrics."
              action={<button type="button" className="btn btn-primary" onClick={() => commit(clearAll(state))}>Clear all filters</button>}
            />
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
              {results.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 3} />)}
            </div>
          )}
        </section>
      </div>

      <Dialog
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Filters"
        variant="sheet"
        footer={
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className="btn btn-outline" onClick={() => setDraft(clearAll(draft))}>Reset</button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                commit(draft);
                setDrawerOpen(false);
              }}
            >
              Show {data ? applyCatalog(data, draft, sizeIdsByProduct).length : ''} results
            </button>
          </div>
        }
      >
        {data && <FilterPanel facets={facets} state={draft} products={data} onToggle={(k, v) => setDraft(toggle(draft, k, v))} />}
      </Dialog>
    </div>
  );
}

function FilterPanel({
  facets,
  state,
  products,
  onToggle,
}: {
  facets: ReturnType<typeof buildFacets>;
  state: CatalogState;
  products: ProductSummary[];
  onToggle: (key: FilterKey, value: string) => void;
}) {
  return (
    <div className="divide-y divide-line">
      {facets.map((f, i) => (
        <FilterGroup key={f.key} title={f.label} count={state.filters[f.key].length} defaultOpen={i < 4 || state.filters[f.key].length > 0}>
          {f.note && <p className="mb-2 text-xs text-muted">{f.note}</p>}
          {f.key === 'color' ? (
            <div className="grid grid-cols-4 gap-2">
              {f.options.map((o) => {
                const on = state.filters.color.includes(o.value);
                return (
                  <button key={o.value} type="button" aria-pressed={on} onClick={() => onToggle('color', o.value)} className="flex flex-col items-center gap-1 text-[10px] text-muted" title={o.label}>
                    <span className={cn('size-8 rounded-full border border-ink/10 ring-offset-2', on && 'ring-2 ring-ink')} style={{ background: o.swatch }} />
                    <span className="line-clamp-1">{o.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <ul className="space-y-0.5">
              {f.options.map((o) => {
                const n = facetCount(products, state, f.key, o.value, sizeIdsByProduct);
                const on = state.filters[f.key].includes(o.value);
                return (
                  <li key={o.value}>
                    <label className={cn('flex min-h-9 cursor-pointer items-center gap-2.5 text-sm', n === 0 && !on && 'opacity-45')}>
                      <input type="checkbox" checked={on} onChange={() => onToggle(f.key, o.value)} className="size-4 accent-[var(--color-ink)]" />
                      <span className="flex-1">{o.label}</span>
                      <span className="text-xs text-muted tabular-nums">{n}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </FilterGroup>
      ))}
    </div>
  );
}

function FilterGroup({ title, count, defaultOpen, children }: { title: string; count: number; defaultOpen?: boolean; children: ReactNode }) {
  return (
    <details className="group py-2" open={defaultOpen}>
      <summary className="flex min-h-10 items-center justify-between text-sm font-semibold">
        <span>{title}{count > 0 && <span className="ml-1.5 rounded-full bg-ink px-1.5 py-0.5 text-[10px] text-canvas">{count}</span>}</span>
        <Icon name="chevronDown" size={16} className="transition-transform group-open:rotate-180" />
      </summary>
      <div className="pt-1 pb-2">{children}</div>
    </details>
  );
}
