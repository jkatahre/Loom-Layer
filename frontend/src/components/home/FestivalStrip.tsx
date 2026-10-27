import { Link } from 'react-router';
import { store } from '../../config/store';
import { useNow } from '../../hooks/useNow';
import { formatINR } from '../../utils/currency';
import { isFestivalLive } from '../../utils/promotions';
import { CopyButton, Countdown } from '../ui/Countdown';

/** Coupon, eligibility and live countdown. Renders nothing once the offer has expired. */
export function FestivalStrip() {
  const now = useNow(1000);
  const festival = store.festival;
  if (!isFestivalLive(festival, now) || !festival.coupon) return null;
  const c = festival.coupon;
  const eligibility = c.eligibleCategories === 'all' ? 'all curtains' : `${c.eligibleCategories.length} categories`;

  return (
    <section aria-label={`${festival.name} offer`} className="container-page">
      <div className="relative overflow-hidden rounded-2xl bg-festive px-5 py-6 text-canvas sm:px-8 lg:flex lg:items-center lg:justify-between lg:gap-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 12% 30%, #F2B233 0 2px, transparent 3px), radial-gradient(circle at 70% 70%, #F2B233 0 2px, transparent 3px)', backgroundSize: '48px 48px, 64px 64px' }}
        />
        <div className="relative">
          <p className="eyebrow text-festive-gold">{festival.stripTitle}</p>
          <p className="mt-2 font-display text-2xl leading-tight sm:text-[1.75rem]">{c.description}</p>
          <p className="mt-1.5 text-sm text-canvas/75">
            Valid on {eligibility} for orders of {formatINR(c.minOrder)} or more · ends{' '}
            {new Date(festival.endsAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="relative mt-5 flex flex-wrap items-center gap-4 lg:mt-0 lg:shrink-0">
          <Countdown endsAt={festival.endsAt} now={now} />
          <div className="flex items-center gap-2 rounded-full border border-dashed border-festive-gold/70 py-1 pr-1 pl-4">
            <span className="font-mono text-sm font-semibold tracking-wider text-festive-gold">{c.code}</span>
            <CopyButton text={c.code} className="bg-festive-gold text-ink hover:bg-[#ffc24d]" />
          </div>
          <Link to="/catalog?sort=price-desc" className="text-sm font-semibold text-canvas underline-offset-4 hover:underline">
            Shop the offer →
          </Link>
        </div>
      </div>
    </section>
  );
}
