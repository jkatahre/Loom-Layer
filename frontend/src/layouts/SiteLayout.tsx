import { useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router';
import { FloatingWhatsApp, MobileActionBar } from '../components/layout/ActionBars';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { AnnouncementBar, CreditStrip } from '../components/layout/TopBars';

/** Credit strip → announcements → sticky header → page → footer, plus contact bars. */
export function SiteLayout() {
  const { hash, pathname } = useLocation();

  // Scroll to in-page anchors such as /contact#faq after navigation.
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(decodeURIComponent(hash.slice(1)));
    el?.scrollIntoView({ block: 'start' });
  }, [hash, pathname]);

  return (
    <div className="flex min-h-dvh flex-col pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0">
      <a href="#main" className="sr-only z-[90] rounded-full bg-ink px-4 py-2 text-canvas focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <CreditStrip />
      <AnnouncementBar />
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileActionBar />
      <FloatingWhatsApp />
      {/* Keyed by pathname so changing catalogue filters (query string) keeps the scroll position. */}
      <ScrollRestoration getKey={(location) => location.pathname} />
    </div>
  );
}
