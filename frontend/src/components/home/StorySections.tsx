import { Link } from 'react-router';
import { store } from '../../config/store';
import { useEnquiry } from '../../contexts/EnquiryContext';
import { useAsync } from '../../hooks/useAsync';
import { getCategoryStats, getReviews, lookup } from '../../services/productService';
import { formatINR } from '../../utils/currency';
import { HoursTable, OpenStatus } from '../ui/OpenStatus';
import { Icon } from '../ui/Icon';
import { SectionHeading } from '../ui/Section';
import { SmartImage } from '../ui/SmartImage';
import { StarRating } from '../ui/StarRating';
import { ErrorState } from '../ui/States';
import { ShowroomMap } from '../ShowroomMap';

export function WhyChooseUs() {
  const { trustBadges, craftsmanship, googleRating } = store.home;
  return (
    <section aria-labelledby="why-title" className="container-page py-16 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <p className="eyebrow mb-3">Why {store.identity.name}</p>
          <h2 id="why-title" className="text-[1.875rem] sm:text-[2.25rem]">
            Fabric knowledge, careful tailoring and honest pricing
          </h2>
          <ul className="mt-6 space-y-3 text-sm">
            {craftsmanship.map((c) => (
              <li key={c} className="flex gap-3">
                <Icon name="check" size={18} className="mt-0.5 shrink-0 text-brand" />
                {c}
              </li>
            ))}
          </ul>
          {googleRating && (
            <a href={googleRating.url} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-4 rounded-2xl border border-line p-4 hover:border-ink/30">
              <span className="font-display text-4xl">{googleRating.rating.toFixed(1)}</span>
              <span className="text-sm">
                <StarRating value={googleRating.rating} />
                <span className="mt-1 block text-muted">
                  {googleRating.count} Google reviews{googleRating.isSample && <span className="ml-1 rounded bg-sand px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted uppercase">Sample</span>}
                </span>
              </span>
            </a>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {trustBadges.map((b) => (
            <div key={b.title} className="rounded-2xl bg-surface p-6">
              <span className="grid size-11 place-items-center rounded-full bg-canvas text-brand shadow-soft">
                <Icon name={b.icon} size={20} />
              </span>
              <h3 className="mt-5 text-lg">{b.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CustomCurtainsSection() {
  const { customSection } = store.home;
  const { openEnquiry } = useEnquiry();
  const stats = useAsync(getCategoryStats, []);
  const from = stats.data?.['custom-made-curtains']?.priceFrom;
  return (
    <section aria-labelledby="custom-title" className="bg-ink py-16 text-canvas lg:py-24">
      <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="eyebrow mb-3 text-festive-gold">Made to measure</p>
          <h2 id="custom-title" className="text-[1.875rem] text-canvas sm:text-[2.5rem]">
            {customSection.title}
          </h2>
          <p className="mt-4 max-w-lg text-canvas/70">{customSection.intro}</p>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2">
            {customSection.steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-canvas/25 font-display text-sm">{i + 1}</span>
                <div>
                  <h3 className="font-sans text-[15px] font-semibold text-canvas">{s.title}</h3>
                  <p className="mt-1 text-sm text-canvas/65">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-canvas/15 py-5 text-sm">
            <div>
              <dt className="text-canvas/60">Starting from</dt>
              <dd className="mt-1 font-display text-2xl">{from ? `${formatINR(from)}` : '—'}<span className="ml-1 font-sans text-xs text-canvas/60">/ pair*</span></dd>
            </div>
            <div>
              <dt className="text-canvas/60">Stitching time</dt>
              <dd className="mt-1 font-display text-2xl">7–12 <span className="font-sans text-xs text-canvas/60">working days</span></dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-canvas/50">*Reference size 54 × 84 in per panel. Your estimate depends on fabric, size, lining and heading.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/custom-curtains" className="btn bg-canvas text-ink hover:bg-brand-soft">
              Get an instant estimate <Icon name="arrowRight" size={16} />
            </Link>
            <button type="button" className="btn btn-whatsapp" onClick={() => openEnquiry({ kind: 'custom_quote' })}>
              <Icon name="whatsapp" /> Ask on WhatsApp
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {customSection.examples.map((img, i) => (
            <SmartImage key={img.src} src={img.src} alt={img.alt} position={img.position} ratio="3 / 4" className={i === 1 ? 'mt-12 rounded-2xl' : 'rounded-2xl'} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ShowroomSection() {
  const { showroom, delivery, policies } = store;
  const { openEnquiry } = useEnquiry();
  return (
    <section aria-labelledby="showroom-title" className="container-page py-16 lg:py-20">
      <SectionHeading id="showroom-title" eyebrow="Visit us" title="Touch every fabric at our showroom" intro={showroom.highlights.join(' · ')} />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid grid-cols-2 gap-3">
          {showroom.photos.slice(0, 3).map((p, i) => (
            <SmartImage key={p.src} src={p.src} alt={p.alt} position={p.position} ratio={i === 0 ? '16 / 9' : '4 / 3'} className={i === 0 ? 'col-span-2 rounded-2xl' : 'rounded-2xl'} />
          ))}
        </div>
        <div className="flex flex-col gap-5 rounded-2xl border border-line p-6">
          <div>
            <h3 className="text-xl">{showroom.name}</h3>
            <address className="mt-2 text-sm leading-relaxed text-muted not-italic">{showroom.addressLines.join(', ')}</address>
            <OpenStatus className="mt-3" />
          </div>
          <HoursTable />
          <ShowroomMap compact />
          <div>
            <h4 className="font-sans text-sm font-semibold">Delivery</h4>
            <ul className="mt-2 space-y-1 text-sm">
              {delivery.areas.slice(0, 3).map((a) => (
                <li key={a.name} className="flex justify-between gap-3">
                  <span className="text-muted">{a.name}</span>
                  <span className="font-medium">{a.fee === 0 ? 'Free delivery' : formatINR(a.fee)}</span>
                </li>
              ))}
            </ul>
            <Link to="/contact#delivery" className="mt-2 inline-block text-xs font-semibold text-brand hover:underline">
              All delivery areas →
            </Link>
          </div>
          <p className="text-sm text-muted">{policies.measurement.body}</p>
          <div className="mt-auto flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary" onClick={() => openEnquiry({ kind: 'showroom_visit' })}>
              Plan a visit
            </button>
            <button type="button" className="btn btn-outline" onClick={() => openEnquiry({ kind: 'measurement' })}>
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
  const list = (data ?? []).filter((r) => r.photo).slice(0, 3).concat((data ?? []).filter((r) => !r.photo && r.rating === 5).slice(0, 3));
  return (
    <section aria-labelledby="reviews-title" className="bg-surface py-16 lg:py-20">
      <div className="container-page">
        <SectionHeading
          id="reviews-title"
          eyebrow="Customer stories"
          title="Homes we have dressed"
          intro={<span>These are demonstration reviews included with the template. Replace them with genuine customer reviews before launch.</span>}
        />
        {error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : loading ? (
          <div className="grid gap-4 md:grid-cols-3">{Array.from({ length: 3 }, (_, i) => <div key={i} className="skeleton h-80 rounded-2xl" />)}</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map((r) => {
              const product = r.product_id ? lookup.product(r.product_id) : null;
              return (
                <figure key={r.id} className="flex flex-col overflow-hidden rounded-2xl bg-canvas shadow-soft">
                  {r.photo && <SmartImage src={r.photo} alt={`Curtains installed in ${r.author}'s home`} ratio="16 / 10" />}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between">
                      <StarRating value={r.rating} />
                      {r.is_demo && <span className="rounded bg-sand px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted uppercase">Demo review</span>}
                    </div>
                    <blockquote className="mt-4 flex-1">
                      <p className="font-display text-lg leading-snug">“{r.title}”</p>
                      <p className="mt-2 text-sm text-muted">{r.body}</p>
                    </blockquote>
                    <figcaption className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4 text-sm">
                      <span>
                        <span className="font-semibold">{r.author}</span>
                        <span className="text-muted"> · {r.city}</span>
                      </span>
                      {product && (
                        <Link to={`/products/${product.slug}`} className="truncate text-xs font-semibold text-brand hover:underline">
                          {product.name}
                        </Link>
                      )}
                    </figcaption>
                  </div>
                </figure>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export function RecentWork() {
  const { recentWork, instagram } = store.home;
  return (
    <section aria-labelledby="work-title" className="container-page py-16 lg:py-20">
      <SectionHeading
        id="work-title"
        eyebrow="Recent work"
        title="From our workroom to their windows"
        link={instagram ? { to: instagram.url, label: `Follow ${instagram.handle}` } : undefined}
      />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {recentWork.map((w, i) => (
          <figure key={w.image.src} className={i === 0 ? 'col-span-2 lg:col-span-1 lg:row-span-2' : ''}>
            <SmartImage src={w.image.src} alt={w.image.alt} position={w.image.position} ratio={i === 0 ? '4 / 5' : '4 / 3'} className="rounded-2xl lg:h-[calc(100%-4.5rem)]" />
            <figcaption className="mt-2.5">
              <p className="text-sm font-semibold">{w.caption}</p>
              <p className="text-xs text-muted">
                {w.room} · {w.fabric} · {w.location}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
      {instagram && (
        <p className="mt-8 text-center text-sm text-muted">
          See more installations on Instagram{' '}
          <a href={instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-ink hover:text-brand">
            <Icon name="instagram" size={16} /> {instagram.handle}
          </a>
        </p>
      )}
    </section>
  );
}
