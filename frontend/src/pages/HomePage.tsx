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
  const bestsellers = useAsync(() => getBestsellers(4), []);
  const deals = useAsync(() => getDeals(4), []);
  const festive = isFestivalLive(store.festival);

  return (
    <>
      <Hero />
      <FestivalStrip />
      <WhyChooseUs />
      <CategoryRail />
      <ProductRailSection
        id="best-title"
        title="Bestsellers"
        link={{ to: '/catalog', label: 'Shop all curtains' }}
        state={bestsellers}
        tone="surface"
      />
      <ProductRailSection
        id="deals-title"
        title={festive ? `${store.festival!.name} deals` : 'Offers'}
        link={{ to: '/catalog?sort=price-asc', label: 'See all prices' }}
        state={deals}
      />
      <RoomGrid />
      <FabricExplorer />
      <CustomCurtainsSection />
      <ShowroomSection />
      <Testimonials />
      <RecentWork />
    </>
  );
}
