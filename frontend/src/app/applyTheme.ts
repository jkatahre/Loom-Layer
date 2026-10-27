import { isSampleWhatsapp, store } from '../config/store';
import { isFestivalLive } from '../utils/promotions';

/** Map store colours onto the Tailwind theme variables declared in index.css. */
export function applyTheme() {
  const root = document.documentElement;
  const c = store.identity.colors;
  root.style.setProperty('--color-brand', c.brand);
  root.style.setProperty('--color-brand-dark', c.brandDark);
  root.style.setProperty('--color-brand-soft', c.brandSoft);
  root.style.setProperty('--color-ink', c.ink);
  root.style.setProperty('--color-surface', c.surface);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', c.brand);
}

/** Preload whichever hero image the homepage will show first. */
export function preloadHeroImage() {
  if (window.location.pathname !== '/') return;
  const src = isFestivalLive(store.festival) && store.festival.slides[0] ? store.festival.slides[0].image : store.home.hero.image.src;
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  link.setAttribute('fetchpriority', 'high');
  document.head.appendChild(link);
}

export function devReminders() {
  if (!import.meta.env.DEV) return;
  if (isSampleWhatsapp) {
    console.warn(
      `[${store.identity.name}] A SAMPLE WhatsApp number (${store.contact.whatsapp}) is configured. ` +
        'Set store.contact.whatsapp in src/config/store.ts before launch — enquiries will not reach anyone until you do.',
    );
  }
}
