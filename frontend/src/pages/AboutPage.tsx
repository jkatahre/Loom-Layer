import { Link } from 'react-router';
import { RecentWork } from '../components/home/StorySections';
import { Icon } from '../components/ui/Icon';
import { SmartImage } from '../components/ui/SmartImage';
import { store } from '../config/store';
import { usePageMeta } from '../hooks/usePageMeta';

export function AboutPage() {
  usePageMeta('About us', store.about.intro);
  const { about, home } = store;
  return (
    <>
      <section className="container-page grid gap-10 pt-10 pb-14 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow mb-4">Our story</p>
          <h1 className="text-[2.5rem] leading-tight sm:text-[3.25rem]">{about.title}</h1>
          <p className="mt-5 text-lg text-muted">{about.intro}</p>
          <div className="mt-6 space-y-4 text-muted">{about.story.map((p) => <p key={p}>{p}</p>)}</div>
        </div>
        <SmartImage src={about.image.src} alt={about.image.alt} position={about.image.position} ratio="4 / 5" priority className="rounded-[1.75rem]" />
      </section>
      <section className="bg-surface py-14">
        <div className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {about.pillars.map((p) => (
            <div key={p.title} className="rounded-2xl bg-canvas p-6">
              <h2 className="text-xl">{p.title}</h2>
              <p className="mt-2 text-sm text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container-page grid gap-10 py-14 lg:grid-cols-2">
        <div>
          <h2 className="text-[2rem]">Craftsmanship you can see</h2>
          <ul className="mt-5 space-y-3">
            {home.craftsmanship.map((c) => (
              <li key={c} className="flex gap-3 text-sm"><Icon name="check" size={18} className="mt-0.5 shrink-0 text-brand" /> {c}</li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {store.showroom.photos.slice(0, 4).map((p) => <SmartImage key={p.src} src={p.src} alt={p.alt} ratio="4 / 3" className="rounded-2xl" />)}
        </div>
      </section>
      <RecentWork />
      <section className="container-page pb-6 text-center">
        <h2 className="text-[2rem]">Come and see the fabrics</h2>
        <p className="mx-auto mt-2 max-w-lg text-muted">{store.policies.showroomAvailability.body}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/contact" className="btn btn-primary">Visit the showroom</Link>
          <Link to="/fabrics" className="btn btn-outline">Explore fabrics</Link>
        </div>
      </section>
    </>
  );
}
