import { Link } from 'react-router';
import { store } from '../../config/store';
import { useEnquiry } from '../../contexts/EnquiryContext';
import { useAsync } from '../../hooks/useAsync';
import { getReviews } from '../../services/productService';
import { OpenStatus } from '../ui/OpenStatus';
import { Icon } from '../ui/Icon';
import { SectionHeading } from '../ui/Section';
import { SmartImage } from '../ui/SmartImage';
import { StarRating } from '../ui/StarRating';
import { ErrorState } from '../ui/States';

export function WhyChooseUs() {
  return (
    <section aria-label={`Why ${store.identity.name}`} className="page-wide pt-3">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-surface p-4 lg:grid-cols-4">
        {store.home.trustBadges.map((b) => (
          <li key={b.title} className="flex items-center gap-2.5 text-sm font-semibold">
            <Icon name={b.icon} size={20} className="shrink-0 text-brand" /> {b.title}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CustomCurtainsSection() {
  const { customSection } = store.home;
  const { openEnquiry } = useEnquiry();
  return (
    <section aria-labelledby="custom-title" className="bg-ink py-7 lg:py-10 text-canvas">
      <div className="page-wide grid gap-5 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-8">
        <div>
          <h2 id="custom-title" className="text-[1.75rem] text-canvas sm:text-[2.25rem]">
            {customSection.title}
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/custom-curtains" className="btn bg-canvas text-ink hover:bg-brand-soft">
              Get an instant estimate <Icon name="arrowRight" size={16} />
            </Link>
            <button type="button" className="btn btn-whatsapp" onClick={() => openEnquiry({ kind: 'custom_quote' })}>
              <Icon name="whatsapp" /> Ask on WhatsApp
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {customSection.examples.map((img) => (
            <SmartImage key={img.src} src={img.src} alt={img.alt} position={img.position} ratio="1" className="rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ShowroomSection() {
  const { showroom } = store;
  const { openEnquiry } = useEnquiry();
  return (
    <section aria-labelledby="showroom-title" className="page-wide py-7 lg:py-10">
      <SectionHeading id="showroom-title" title="Visit our showroom" link={{ to: '/contact', label: 'Hours & delivery' }} />
      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-4 lg:gap-4">
        {showroom.photos.slice(0, 3).map((p) => (
          <SmartImage key={p.src} src={p.src} alt={p.alt} position={p.position} ratio="1" className="rounded-xl" />
        ))}
        <div className="col-span-3 flex flex-col gap-2 rounded-xl border border-line p-4 lg:col-span-1">
          <h3 className="text-lg">{showroom.name}</h3>
          <address className="text-sm text-muted not-italic">{showroom.addressLines.join(', ')}</address>
          <OpenStatus />
          <div className="mt-auto flex flex-wrap gap-2 pt-1">
            <button type="button" className="btn btn-primary btn-sm" onClick={() => openEnquiry({ kind: 'showroom_visit' })}>
              Plan a visit
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => openEnquiry({ kind: 'measurement' })}>
              Book measurement
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const { data, error, loading, reload } = useAsync(() => getReviews(), []);
  const list = (data ?? []).filter((r) => r.photo).slice(0, 3);
  if (!loading && !error && list.length === 0) return null;
  return (
    <section aria-labelledby="reviews-title" className="bg-surface py-7 lg:py-10">
      <div className="page-wide">
        <SectionHeading id="reviews-title" title="Homes we have dressed" />
        {error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : loading ? (
          <div className="grid gap-2 sm:grid-cols-3 sm:gap-3 lg:gap-4">{Array.from({ length: 3 }, (_, i) => <div key={i} className="skeleton aspect-square rounded-xl" />)}</div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-3 sm:gap-3 lg:gap-4">
            {list.map((r) => (
              <figure key={r.id} className="relative overflow-hidden rounded-xl">
                <SmartImage src={r.photo} alt={`Curtains installed in ${r.author}'s home`} ratio="1" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                {r.is_demo && <span className="absolute top-2 left-2 rounded bg-sand px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted uppercase">Demo review</span>}
                <figcaption className="absolute inset-x-0 bottom-0 p-3 text-canvas sm:p-4">
                  <StarRating value={r.rating} />
                  <p className="mt-1 line-clamp-2 font-display text-lg leading-snug">“{r.title}”</p>
                  <p className="mt-0.5 text-xs text-canvas/80">{r.author} · {r.city}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function RecentWork() {
  const { recentWork, instagram } = store.home;
  return (
    <section aria-labelledby="work-title" className="page-wide py-7 lg:py-10">
      <SectionHeading id="work-title" title="Recent work" link={instagram ? { to: instagram.url, label: instagram.handle } : undefined} />
      <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-3 lg:grid-cols-4 lg:gap-x-4">
        {recentWork.slice(0, 4).map((w) => (
          <figure key={w.image.src}>
            <SmartImage src={w.image.src} alt={w.image.alt} position={w.image.position} ratio="1" className="rounded-xl" />
            <figcaption className="mt-2 px-1 text-sm font-semibold">{w.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
