import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { store } from '../../config/store';
import { useNow } from '../../hooks/useNow';
import { cn } from '../../utils/cn';
import { isFestivalLive } from '../../utils/promotions';
import { Icon } from '../ui/Icon';
import { SmartImage } from '../ui/SmartImage';

const BANNER = 'aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]';
const BANNER_SHADE = 'absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent sm:bg-gradient-to-r sm:from-black/60 sm:via-black/20';
const BANNER_TEXT = 'absolute inset-x-0 bottom-0 p-4 text-canvas sm:inset-y-0 sm:flex sm:max-w-xl sm:flex-col sm:justify-center sm:p-10 lg:p-14';
const BANNER_TITLE = 'text-[1.5rem] leading-[1.1] sm:text-[2.5rem] lg:text-[3rem]';

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
    <section aria-labelledby="hero-title" className="page-wide pt-3 pb-3">
      <div className="relative overflow-hidden rounded-2xl bg-ink">
        <SmartImage src={hero.image.src} alt={hero.image.alt} position={hero.image.position} priority className={BANNER} />
        <div className={BANNER_SHADE} />
        <div className={BANNER_TEXT}>
          <h1 id="hero-title" className={cn(BANNER_TITLE, 'text-canvas')}>{hero.title}</h1>
          <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
            <Link to={hero.primaryCta.to} className="btn max-sm:btn-sm max-sm:px-3 max-sm:text-xs bg-canvas text-ink hover:bg-brand-soft">
              {hero.primaryCta.label} <Icon name="arrowRight" size={16} className="max-sm:hidden" />
            </Link>
            <Link to={hero.secondaryCta.to} className="btn max-sm:btn-sm max-sm:px-3 max-sm:text-xs border-canvas/60 bg-black/25 text-canvas backdrop-blur-sm hover:border-canvas">
              {hero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FestivalCarousel() {
  const slides = store.festival!.slides;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

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
      className="page-wide pt-3 pb-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-ink">
        {slides.map((s, i) => {
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
              <SmartImage src={s.image} alt={s.alt} position={s.position} priority={i === 0} className={BANNER} />
              <div className={BANNER_SHADE} />
              <div className={BANNER_TEXT}>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-festive px-3 py-1.5 text-xs font-semibold text-festive-gold">
                  <Icon name="sparkle" size={13} /> {s.chip}
                </span>
                {i === 0 ? (
                  <h1 className={cn(BANNER_TITLE, 'mt-3 text-canvas')}>{s.title}</h1>
                ) : (
                  <h2 className={cn(BANNER_TITLE, 'mt-3 text-canvas')}>{s.title}</h2>
                )}
                <Link to={s.cta.to} tabIndex={active ? 0 : -1} className="btn max-sm:btn-sm mt-3 w-fit sm:mt-4 bg-canvas text-ink hover:bg-brand-soft">
                  {s.cta.label} <Icon name="arrowRight" size={16} />
                </Link>
              </div>
            </div>
          );
        })}

        {slides.length > 1 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 sm:top-auto sm:right-6 sm:bottom-6 sm:gap-2">
            <button type="button" onClick={() => go(index - 1)} className="grid size-9 place-items-center sm:size-11 rounded-full bg-canvas/15 text-canvas backdrop-blur hover:bg-canvas/30" aria-label="Previous slide">
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
            <button type="button" onClick={() => go(index + 1)} className="grid size-9 place-items-center sm:size-11 rounded-full bg-canvas/15 text-canvas backdrop-blur hover:bg-canvas/30" aria-label="Next slide">
              <Icon name="chevronRight" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
