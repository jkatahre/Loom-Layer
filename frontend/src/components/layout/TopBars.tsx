import { useEffect, useState } from 'react';
import { store } from '../../config/store';
import { Icon } from '../ui/Icon';

/** Template credit. Set `store.credit` to `null` to remove it. */
export function CreditStrip() {
  const credit = store.credit;
  if (!credit) return null;
  return (
    <div className="bg-ink text-[11px] text-canvas/75">
      <div className="container-page flex min-h-8 items-center justify-center gap-3 py-1">
        <a href={credit.href} target="_blank" rel="noopener noreferrer" className="hover:text-canvas">
          {credit.text}
        </a>
        <span aria-hidden="true" className="text-canvas/30">·</span>
        <a href={credit.ctaHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-festive-gold hover:underline">
          {credit.ctaLabel}
        </a>
      </div>
    </div>
  );
}

/** Rotating announcement bar; pauses on hover/focus. */
export function AnnouncementBar() {
  const items = store.home.announcements;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % items.length), 4500);
    return () => window.clearInterval(id);
  }, [paused, items.length]);

  if (!items.length) return null;
  const go = (d: number) => setIndex((i) => (i + d + items.length) % items.length);

  return (
    <div
      className="bg-brand-dark text-canvas"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container-page flex min-h-9 items-center justify-between gap-2 text-xs">
        {items.length > 1 ? (
          <button type="button" className="grid size-8 place-items-center rounded-full text-canvas/70 hover:text-canvas" onClick={() => go(-1)} aria-label="Previous announcement">
            <Icon name="chevronLeft" size={14} />
          </button>
        ) : <span />}
        <p key={index} className="animate-fade-in truncate text-center font-medium tracking-wide" aria-live="polite">
          {items[index]}
        </p>
        {items.length > 1 ? (
          <button type="button" className="grid size-8 place-items-center rounded-full text-canvas/70 hover:text-canvas" onClick={() => go(1)} aria-label="Next announcement">
            <Icon name="chevronRight" size={14} />
          </button>
        ) : <span />}
      </div>
    </div>
  );
}
