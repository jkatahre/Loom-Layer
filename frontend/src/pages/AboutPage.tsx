import { Link } from 'react-router';
import { RecentWork } from '../components/home/StorySections';
import { SmartImage } from '../components/ui/SmartImage';
import { store } from '../config/store';
import { usePageMeta } from '../hooks/usePageMeta';

export function AboutPage() {
  usePageMeta('About us', store.about.intro);
  const { about, showroom } = store;
  return (
    <>
      <section className="page-wide grid gap-5 pt-3 pb-3 lg:grid-cols-2 lg:items-center lg:gap-8">
        <div>
          <h1 className="text-[2rem] leading-tight sm:text-[2.5rem]">{about.title}</h1>
          <p className="mt-3 text-muted">{about.intro}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/contact" className="btn btn-primary">Visit the showroom</Link>
            <Link to="/fabrics" className="btn btn-outline">Explore fabrics</Link>
          </div>
        </div>
        <SmartImage src={about.image.src} alt={about.image.alt} position={about.image.position} ratio="1" priority className="rounded-2xl" />
      </section>
      <section aria-label="Our showroom" className="page-wide grid grid-cols-2 gap-2 py-3 sm:gap-3 lg:grid-cols-4">
        {showroom.photos.slice(0, 4).map((p) => <SmartImage key={p.src} src={p.src} alt={p.alt} position={p.position} ratio="1" className="rounded-xl" />)}
      </section>
      <RecentWork />
    </>
  );
}
