import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { store } from '../../config/store';
import { useAsync } from '../../hooks/useAsync';
import { useNow } from '../../hooks/useNow';
import { getCategoryStats } from '../../services/productService';
import { cn } from '../../utils/cn';
import { formatINR } from '../../utils/currency';
import { isFestivalLive } from '../../utils/promotions';
import { Icon } from '../ui/Icon';
import { SmartImage } from '../ui/SmartImage';

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Festival carousel while a promotion is live; otherwise the static editorial hero. */
export function Hero() {
  const now = useNow(30_000);
  const festival = store.festival;
  const live = isFestivalLive(festival, now) && festival.slides.length > 0;
  return live ? <FestivalCarousel /> : <StaticHero />;
}

function StaticHero() {
  const { hero } = store.home;
  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className="container-page grid items-center gap-8 pt-6 pb-12 lg:grid-cols-[1fr_1.15fr] lg:gap-14 lg:pt-12 lg:pb-20">
        <div className="order-2 lg:order-1">
          <p className="eyebrow mb-5">{hero.eyebrow}</p>
          <h1 id="hero-title" className="text-[2.5rem] leading-[1.05] sm:text-[3.25rem] lg:text-[3.75rem]">
            {hero.title}
          </h1>
          <p className="mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-muted">{hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={hero.primaryCta.to} className="btn btn-primary">
              {hero.primaryCta.label} <Icon name="arrowRight" size={16} />
            </Link>
            <Link to={hero.secondaryCta.to} className="btn btn-outline">
              {hero.secondaryCta.label}
            </Link>
          </div>
          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {hero.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2">
                <Icon name="check" size={15} className="text-brand" /> {h}
              </li>
            ))}
          </ul>
        </div>
        <SmartImage src={hero.image.src} alt={hero.image.alt} position={hero.image.position} priority ratio="5 / 4" className="order-1 rounded-[1.75rem] lg:order-2" />
      </div>
    </section>
  );
}

function FestivalCarousel() {
  const slides = store.festival!.slides;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const stats = useAsync(getCategoryStats, []);

  useEffect(() => {
    if (paused || slides.length < 2 || prefersReducedMotion()) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => window.clearInterval(id);
  }, [paused, slides.length]);

  const go = (i: number) => setIndex((i + slides.length) % slides.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={`${store.festival!.name} offers`}
      className="container-page pt-4 pb-10 lg:pt-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-[1.75rem] bg-ink">
        {slides.map((s, i) => {
          const from = stats.data?.[s.categorySlug]?.priceFrom;
          const active = i === index;
          return (
            <div
              key={s.image}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              aria-hidden={!active}
              className={cn('transition-opacity duration-700', active ? 'relative opacity-100' : 'pointer-events-none absolute inset-0 opacity-0')}
            >
              <SmartImage src={s.image} alt={s.alt} position={s.position} priority={i === 0} className="aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent sm:bg-gradient-to-r sm:from-black/70 sm:via-black/35" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-canvas sm:inset-y-0 sm:flex sm:max-w-xl sm:flex-col sm:justify-center sm:p-12 lg:p-16">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-festive px-3 py-1.5 text-xs font-semibold text-festive-gold">
                  <Icon name="sparkle" size={13} /> {s.chip}
                </span>
                {i === 0 ? (
                  <h1 className="mt-4 text-[2rem] leading-[1.08] text-canvas sm:text-[2.75rem] lg:text-[3.25rem]">{s.title}</h1>
                ) : (
                  <h2 className="mt-4 text-[2rem] leading-[1.08] text-canvas sm:text-[2.75rem] lg:text-[3.25rem]">{s.title}</h2>
                )}
                <p className="mt-3 max-w-md text-[15px] text-canvas/85">{s.subtitle}</p>
                <p className="mt-4 text-sm text-canvas/90" aria-live="polite">
                  {from ? (
                    <>
                      From <strong className="font-display text-xl font-medium text-canvas">{formatINR(from)}</strong> / pair
                    </>
                  ) : stats.loading ? (
                    <span className="skeleton inline-block h-5 w-36 opacity-30" />
                  ) : null}
                </p>
                <Link to={s.cta.to} tabIndex={active ? 0 : -1} className="btn mt-6 w-fit bg-canvas text-ink hover:bg-brand-soft">
                  {s.cta.label} <Icon name="arrowRight" size={16} />
                </Link>
              </div>
            </div>
          );
        })}

        {slides.length > 1 && (
          <div className="absolute right-4 bottom-4 flex items-center gap-2 sm:right-6 sm:bottom-6">
            <button type="button" onClick={() => go(index - 1)} className="grid size-11 place-items-center rounded-full bg-canvas/15 text-canvas backdrop-blur hover:bg-canvas/30" aria-label="Previous slide">
              <Icon name="chevronLeft" />
            </button>
            <div className="flex gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.image}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  className="grid h-11 w-6 place-items-center"
                >
                  <span className={cn('block h-1.5 rounded-full transition-all', i === index ? 'w-6 bg-canvas' : 'w-1.5 bg-canvas/50')} />
                </button>
              ))}
            </div>
            <button type="button" onClick={() => go(index + 1)} className="grid size-11 place-items-center rounded-full bg-canvas/15 text-canvas backdrop-blur hover:bg-canvas/30" aria-label="Next slide">
              <Icon name="chevronRight" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
