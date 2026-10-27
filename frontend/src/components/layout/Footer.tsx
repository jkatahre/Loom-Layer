import { Link } from 'react-router';
import { store } from '../../config/store';
import { categories } from '../../data/categories';
import { quickWhatsAppUrl } from '../../services/enquiryService';
import { HoursTable, OpenStatus } from '../ui/OpenStatus';
import { Icon } from '../ui/Icon';
import { Logo } from './Logo';

const FOOTER_CATEGORIES = ['sheer-curtains', 'blackout-curtains', 'linen-curtains', 'velvet-curtains', 'thermal-curtains', 'kids-curtains', 'custom-made-curtains'];

export function Footer() {
  const { showroom, contact, identity } = store;
  return (
    <footer className="mt-24 bg-ink text-canvas/80">
      <div className="container-page grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.2fr_1fr]">
        <div>
          <Logo inverted />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-canvas/65">{identity.tagline}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-canvas/65">{store.about.intro}</p>
          <ul className="mt-6 flex gap-2" aria-label="Social media">
            {store.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="chip border-canvas/20 bg-transparent text-canvas/80 hover:border-canvas/60">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer categories">
          <h2 className="eyebrow text-festive-gold">Shop</h2>
          <ul className="mt-4 space-y-1 text-sm">
            {categories
              .filter((c) => FOOTER_CATEGORIES.includes(c.slug))
              .map((c) => (
                <li key={c.id}>
                  <Link to={`/catalog?category=${c.slug}`} className="inline-flex min-h-9 items-center hover:text-canvas">
                    {c.name}
                  </Link>
                </li>
              ))}
            <li>
              <Link to="/categories" className="inline-flex min-h-9 items-center font-semibold text-canvas hover:underline">
                All categories →
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow text-festive-gold">Visit the showroom</h2>
          <address className="mt-4 text-sm leading-relaxed not-italic">
            <span className="block font-semibold text-canvas">{showroom.name}</span>
            {showroom.addressLines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </address>
          <OpenStatus className="mt-3 text-canvas" />
          <HoursTable compact className="mt-3 max-w-xs text-canvas/70 [&_tr[aria-current]]:text-canvas" />
        </div>

        <div>
          <h2 className="eyebrow text-festive-gold">Talk to us</h2>
          <ul className="mt-4 space-y-1 text-sm">
            <li>
              <a href={`tel:${contact.phone}`} className="inline-flex min-h-10 items-center gap-2.5 hover:text-canvas">
                <Icon name="phone" size={16} /> {contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={quickWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2.5 hover:text-canvas">
                <Icon name="whatsapp" size={16} /> WhatsApp us
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="inline-flex min-h-10 items-center gap-2.5 hover:text-canvas">
                <Icon name="mail" size={16} /> {contact.email}
              </a>
            </li>
          </ul>
          <ul className="mt-6 space-y-1 text-sm">
            {[
              ['/custom-curtains', 'Measuring guide'],
              ['/fabrics', 'Fabric guide'],
              ['/about', 'Our story'],
              ['/contact#faq', 'FAQs & delivery'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to!} className="inline-flex min-h-9 items-center hover:text-canvas">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-canvas/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-canvas/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {identity.name}. All rights reserved.
          </p>
          <p>Prices, reviews and ratings shown are sample demonstration data.</p>
        </div>
      </div>
    </footer>
  );
}
