import { FestivalStrip } from '../components/home/FestivalStrip';
import { Hero } from '../components/home/Hero';
import { CategoryRail, FabricExplorer, ProductRailSection, RoomGrid } from '../components/home/ShopSections';
import { CustomCurtainsSection, RecentWork, ShowroomSection, Testimonials, WhyChooseUs } from '../components/home/StorySections';
import { store } from '../config/store';
import { useAsync } from '../hooks/useAsync';
import { usePageMeta } from '../hooks/usePageMeta';
import { getBestsellers, getDeals } from '../services/productService';
import { isFestivalLive } from '../utils/promotions';

export function HomePage() {
  usePageMeta();
  const bestsellers = useAsync(() => getBestsellers(8), []);
  const deals = useAsync(() => getDeals(4), []);
  const festive = isFestivalLive(store.festival);

  return (
    <>
      <Hero />
      <FestivalStrip />
      <CategoryRail />
      <ProductRailSection
        id="best-title"
        eyebrow="Bestselling curtains"
        title="Loved in homes across the city"
        intro="Prices are per pair (two panels) unless marked per panel."
        link={{ to: '/catalog', label: 'Shop all curtains' }}
        state={bestsellers}
        tone="surface"
      />
      <ProductRailSection
        id="deals-title"
        eyebrow={festive ? `${store.festival!.name} deals` : 'Offers'}
        title={festive ? 'The biggest festive savings' : 'Our best current offers'}
        intro="Ranked by genuine discount from MRP."
        link={{ to: '/catalog?sort=price-asc', label: 'See all prices' }}
        state={deals}
      />
      <RoomGrid />
      <FabricExplorer />
      <WhyChooseUs />
      <CustomCurtainsSection />
      <ShowroomSection />
      <Testimonials />
      <RecentWork />
    </>
  );
}
