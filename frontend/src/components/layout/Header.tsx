import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { store } from '../../config/store';
import { useEnquiry } from '../../contexts/EnquiryContext';
import { categories } from '../../data/categories';
import { cn } from '../../utils/cn';
import { Dialog } from '../ui/Dialog';
import { Icon } from '../ui/Icon';
import { SmartImage } from '../ui/SmartImage';
import { Logo } from './Logo';
import { SearchBox } from './SearchBox';

const catName = new Map(categories.map((c) => [c.slug, c.name.replace(/ Curtains$/, '')]));

/** Columns of the "Shop" mega menu. */
const MENU_GROUPS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Light control',
    links: ['sheer-curtains', 'room-darkening-curtains', 'blackout-curtains', 'thermal-curtains'].map((s) => ({ label: catName.get(s) ?? s, to: `/catalog?category=${s}` })),
  },
  {
    title: 'Fabric',
    links: ['linen-curtains', 'cotton-curtains', 'velvet-curtains', 'polyester-curtains', 'textured-curtains'].map((s) => ({ label: catName.get(s) ?? s, to: `/catalog?category=${s}` })),
  },
  {
    title: 'Heading & pattern',
    links: ['eyelet-curtains', 'pinch-pleat-curtains', 'pencil-pleat-curtains', 'floral-curtains', 'geometric-curtains'].map((s) => ({ label: catName.get(s) ?? s, to: `/catalog?category=${s}` })),
  },
  {
    title: 'Room',
    links: store.home.rooms.map((r) => ({ label: r.label, to: `/catalog?room=${r.slug}` })),
  },
];

const NAV_LINK = 'relative inline-flex h-10 items-center text-[12px] font-semibold tracking-[0.14em] uppercase transition-colors hover:text-brand after:absolute after:inset-x-0 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const { openEnquiry } = useEnquiry();
  const location = useLocation();
  const megaId = useId();
  const closeTimer = useRef<number | undefined>(undefined);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setMegaOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape or a click outside closes the mega menu / search panel.
  useEffect(() => {
    if (!megaOpen && !searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMegaOpen(false);
        setSearchOpen(false);
      }
    };
    const onDown = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) {
        setMegaOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [megaOpen, searchOpen]);

  const openMega = () => {
    window.clearTimeout(closeTimer.current);
    setSearchOpen(false);
    setMegaOpen(true);
  };
  const closeMegaSoon = () => {
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 160);
  };

  const shopActive = location.pathname === '/catalog' || location.pathname === '/categories' || location.pathname.startsWith('/products');

  return (
    <header ref={headerRef} className={cn('sticky top-0 z-40 border-b bg-canvas/95 backdrop-blur transition-shadow', compact || megaOpen || searchOpen ? 'border-line shadow-soft' : 'border-transparent')}>
      <div className={cn('container-page grid grid-cols-[1fr_auto_1fr] items-center transition-[height] duration-300', compact ? 'h-16' : 'h-16 lg:h-20')}>
        {/* Left: navigation */}
        <div className="flex items-center">
          <button type="button" className="btn btn-ghost -ml-2 size-11 rounded-full p-0 lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Icon name="menu" size={22} />
          </button>
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              <li onMouseEnter={openMega} onMouseLeave={closeMegaSoon}>
                <button
                  type="button"
                  className={cn(NAV_LINK, 'gap-1.5', (shopActive || megaOpen) && 'text-brand after:scale-x-100')}
                  aria-expanded={megaOpen}
                  aria-controls={megaId}
                  onClick={() => (megaOpen ? setMegaOpen(false) : openMega())}
                >
                  Shop
                  <Icon name="chevronDown" size={14} className={cn('transition-transform', megaOpen && 'rotate-180')} />
                </button>
              </li>
              {[
                { to: '/fabrics', label: 'Fabrics' },
                { to: '/custom-curtains', label: 'Made to measure' },
                { to: '/contact', label: 'Showroom' },
              ].map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} className={({ isActive }) => cn(NAV_LINK, isActive && 'text-brand after:scale-x-100')}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Centre: wordmark */}
        <Logo variant="wordmark" compact={compact} />

        {/* Right: actions */}
        <div className="flex items-center justify-end gap-1 lg:gap-2">
          <button
            type="button"
            className={cn('btn btn-ghost size-11 rounded-full p-0', searchOpen && 'bg-sand')}
            onClick={() => {
              setMegaOpen(false);
              setSearchOpen((o) => !o);
            }}
            aria-label={searchOpen ? 'Close search' : 'Search'}
            aria-expanded={searchOpen}
          >
            <Icon name={searchOpen ? 'close' : 'search'} size={20} />
          </button>
          <a href={`tel:${store.contact.phone}`} className="btn btn-ghost hidden size-11 rounded-full p-0 lg:inline-flex" aria-label={`Call ${store.contact.phoneDisplay}`} title={store.contact.phoneDisplay}>
            <Icon name="phone" size={19} />
          </a>
          <button type="button" className="btn btn-dark btn-sm ml-1 hidden lg:inline-flex" onClick={() => openEnquiry({ kind: 'general' })}>
            Enquire
          </button>
        </div>
      </div>

      {/* Mega menu */}
      {megaOpen && (
        <div id={megaId} className="absolute inset-x-0 top-full hidden animate-fade-in border-t border-line bg-canvas shadow-lift lg:block" onMouseEnter={openMega} onMouseLeave={closeMegaSoon}>
          <div className="container-page grid grid-cols-[repeat(4,minmax(0,1fr))_280px] gap-8 py-9">
            {MENU_GROUPS.map((g) => (
              <div key={g.title}>
                <p className="eyebrow mb-4">{g.title}</p>
                <ul className="space-y-0.5">
                  {g.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="inline-flex min-h-9 items-center font-display text-[17px] text-ink transition-colors hover:text-brand">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Link to="/custom-curtains" className="group relative overflow-hidden rounded-2xl">
              <SmartImage src={store.home.customSection.examples[0]?.src} alt="" ratio="4 / 5" className="h-full" imgClassName="transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-5 text-canvas">
                <span className="eyebrow text-festive-gold">Made to measure</span>
                <span className="mt-1 block font-display text-xl leading-tight">Get an instant estimate for your windows</span>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold">Start now <Icon name="arrowRight" size={13} /></span>
              </span>
            </Link>
          </div>
          <div className="border-t border-line bg-surface">
            <div className="container-page flex h-12 items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted">Popular:</span>
                {store.navigation.headerCategories.slice(0, 4).map((c) => (
                  <Link key={c.to} to={c.to} className="rounded-full px-2.5 py-1 font-medium hover:bg-sand">
                    {c.label}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-6 font-semibold">
                <Link to="/categories" className="hover:text-brand">All categories</Link>
                <Link to="/catalog" className="inline-flex items-center gap-1.5 hover:text-brand">Shop all curtains <Icon name="arrowRight" size={14} /></Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search panel */}
      {searchOpen && (
        <div className="absolute inset-x-0 top-full animate-fade-in border-t border-line bg-canvas shadow-lift">
          <div className="container-page py-5 lg:py-7">
            <SearchBox autoFocus className="mx-auto max-w-2xl" onNavigate={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      <Dialog open={menuOpen} onClose={() => setMenuOpen(false)} title={<Logo />} variant="sheet" side="left">
        <nav aria-label="Mobile">
          <Link to="/catalog" className="mb-4 flex min-h-12 items-center justify-between rounded-xl bg-ink px-4 text-sm font-semibold text-canvas">
            Shop all curtains <Icon name="arrowRight" size={16} />
          </Link>
          <div className="divide-y divide-line border-y border-line">
            {MENU_GROUPS.map((g) => (
              <details key={g.title} className="group">
                <summary className="flex min-h-12 items-center justify-between text-[15px] font-medium">
                  {g.title}
                  <Icon name="plus" size={16} className="text-muted transition-transform group-open:rotate-45" />
                </summary>
                <ul className="grid grid-cols-2 gap-1 pb-3">
                  {g.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="flex min-h-10 items-center rounded-lg px-2 text-sm text-muted hover:bg-surface hover:text-ink">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
            {[
              { to: '/categories', label: 'All categories' },
              { to: '/fabrics', label: 'Fabrics' },
              { to: '/custom-curtains', label: 'Made to measure' },
              { to: '/about', label: 'About us' },
              { to: '/contact', label: 'Showroom & contact' },
            ].map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => cn('flex min-h-12 items-center justify-between text-[15px] font-medium', isActive && 'text-brand')}>
                {l.label}
                <Icon name="chevronRight" size={16} className="text-muted" />
              </NavLink>
            ))}
          </div>
        </nav>
        <div className="mt-6 space-y-1 text-sm">
          <a href={`tel:${store.contact.phone}`} className="flex min-h-11 items-center gap-3">
            <Icon name="phone" size={18} /> {store.contact.phoneDisplay}
          </a>
          <a href={`mailto:${store.contact.email}`} className="flex min-h-11 items-center gap-3">
            <Icon name="mail" size={18} /> {store.contact.email}
          </a>
        </div>
      </Dialog>
    </header>
  );
}
