import { EnquiryForm } from '../components/EnquiryForm';
import { ShowroomMap, mapsLink } from '../components/ShowroomMap';
import { Icon } from '../components/ui/Icon';
import { HoursTable, OpenStatus } from '../components/ui/OpenStatus';
import { SmartImage } from '../components/ui/SmartImage';
import { store } from '../config/store';
import { usePageMeta } from '../hooks/usePageMeta';
import { quickWhatsAppUrl } from '../services/enquiryService';
import { formatINR } from '../utils/currency';

export function ContactPage() {
  usePageMeta('Visit & contact', store.contactPage.intro);
  const { showroom, contact, delivery, policies, contactPage } = store;
  return (
    <>
      <section className="container-page pt-10 pb-14">
        <p className="eyebrow mb-4">Showroom &amp; contact</p>
        <h1 className="text-[2.5rem] sm:text-[3.25rem]">Visit, call or WhatsApp us</h1>
        <p className="mt-3 max-w-2xl text-muted">{contactPage.intro}</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-line p-6">
              <h2 className="text-xl">{showroom.name}</h2>
              <address className="mt-2 text-sm text-muted not-italic">
                {showroom.addressLines.map((l) => <span key={l} className="block">{l}</span>)}
              </address>
              <OpenStatus className="mt-3" />
              <HoursTable className="mt-4" />
              <div className="mt-5 flex flex-wrap gap-2">
                <a href={`tel:${contact.phone}`} className="btn btn-outline btn-sm"><Icon name="phone" size={16} /> {contact.phoneDisplay}</a>
                <a href={quickWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm"><Icon name="whatsapp" size={16} /> WhatsApp</a>
                <a href={`mailto:${contact.email}`} className="btn btn-outline btn-sm"><Icon name="mail" size={16} /> Email</a>
                <a href={mapsLink()} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm"><Icon name="pin" size={16} /> Directions</a>
              </div>
            </div>
            <ShowroomMap />
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {showroom.highlights.map((h) => <li key={h} className="flex gap-2 rounded-xl bg-surface p-3"><Icon name="check" size={16} className="mt-0.5 shrink-0 text-brand" />{h}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl bg-surface p-6 sm:p-8">
            <h2 className="text-2xl">Send an enquiry</h2>
            <p className="mt-1 mb-6 text-sm text-muted">We reply on WhatsApp during opening hours.</p>
            <EnquiryForm request={{ kind: 'general', link: typeof window !== 'undefined' ? window.location.href : undefined }} allowKindChange />
          </div>
        </div>
      </section>

      <section className="bg-surface py-14">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div id="delivery" className="scroll-mt-28">
            <h2 className="text-[2rem]">Delivery charges</h2>
            <table className="mt-5 w-full text-sm">
              <caption className="sr-only">Delivery areas, fees and times</caption>
              <thead><tr className="border-b border-line text-left text-xs text-muted"><th className="py-2 font-medium">Area</th><th className="py-2 font-medium">Fee</th><th className="py-2 font-medium">Estimated time</th></tr></thead>
              <tbody>
                {delivery.areas.map((a) => (
                  <tr key={a.name} className="border-b border-line">
                    <td className="py-3 pr-3">{a.name}</td>
                    <td className="py-3 pr-3 font-semibold">{a.fee === 0 ? 'Free delivery' : formatINR(a.fee)}</td>
                    <td className="py-3 text-muted">{a.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-sm text-muted">{delivery.note}</p>
          </div>
          <div>
            <h2 className="text-[2rem]">Measurement &amp; installation</h2>
            <div className="mt-5 space-y-4 text-sm">
              {[policies.measurement, policies.installation, policies.fabricSamples].map((p) => (
                <div key={p.title} className="rounded-2xl bg-canvas p-5">
                  <h3 className="font-sans font-semibold">{p.title}</h3>
                  <p className="mt-1 text-muted">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-title" className="container-page scroll-mt-28 py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 id="faq-title" className="text-[2rem]">Frequently asked questions</h2>
            <SmartImage src={showroom.photos[2]?.src} alt={showroom.photos[2]?.alt ?? ''} ratio="4 / 3" className="mt-6 hidden rounded-2xl lg:block" />
          </div>
          <div className="divide-y divide-line border-y border-line">
            {contactPage.faqs.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex min-h-14 items-center justify-between gap-4 py-3 text-[15px] font-semibold">
                  {f.q}
                  <Icon name="plus" size={18} className="shrink-0 transition-transform group-open:rotate-45" />
                </summary>
                <p className="pb-5 text-sm text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
