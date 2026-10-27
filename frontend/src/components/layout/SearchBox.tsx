import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { store } from '../../config/store';
import { lookup } from '../../services/productService';
import { matchesSearch } from '../../utils/catalogFilters';
import { cn } from '../../utils/cn';
import { Icon } from '../ui/Icon';
import { SmartImage } from '../ui/SmartImage';

/** Header search with popular searches and instant product suggestions. */
export function SearchBox({ className, autoFocus, onNavigate }: { className?: string; autoFocus?: boolean; onNavigate?: () => void }) {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => setQ(params.get('q') ?? ''), [params]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const suggestions = useMemo(
    () => (q.trim().length >= 2 ? lookup.allProductsSync().filter((p) => matchesSearch(p, q)).slice(0, 5) : []),
    [q],
  );

  const go = (term: string) => {
    setOpen(false);
    onNavigate?.();
    navigate(term.trim() ? `/catalog?q=${encodeURIComponent(term.trim())}` : '/catalog');
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    go(q);
  };

  return (
    <div ref={wrapRef} className={cn('relative', className)} onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
      <form role="search" onSubmit={submit}>
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search curtains
        </label>
        <div className="relative">
          <Icon name="search" size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
          <input
            id={`${listId}-input`}
            type="search"
            autoFocus={autoFocus}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={store.navigation.searchPlaceholder}
            className="field rounded-full bg-surface pl-10 text-sm"
            aria-controls={listId}
            aria-expanded={open}
            autoComplete="off"
          />
        </div>
      </form>
      {open && (
        <div id={listId} className="absolute inset-x-0 top-full z-50 mt-2 animate-slide-up rounded-2xl border border-line bg-canvas p-3 shadow-lift">
          {suggestions.length > 0 && (
            <ul className="mb-2 border-b border-line pb-2" aria-label="Matching products">
              {suggestions.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/products/${p.slug}`}
                    onClick={() => {
                      setOpen(false);
                      onNavigate?.();
                    }}
                    className="flex items-center gap-3 rounded-xl p-2 hover:bg-surface"
                  >
                    <SmartImage src={p.primaryImage?.url} alt="" ratio="1" className="w-11 shrink-0 rounded-lg" />
                    <span className="min-w-0 text-sm">
                      <span className="block truncate font-medium">{p.name}</span>
                      <span className="block truncate text-xs text-muted">{p.variants.map((v) => v.name).join(' · ')}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <p className="eyebrow px-2 pt-1 pb-2 text-[10px]">Popular searches</p>
          <div className="flex flex-wrap gap-2 px-1">
            {store.navigation.popularSearches.map((term) => (
              <button key={term} type="button" className="chip" onClick={() => go(term)}>
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
