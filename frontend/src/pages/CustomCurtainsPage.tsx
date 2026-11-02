import { CustomConfigurator } from '../components/product/CustomConfigurator';
import { DimensionsDiagram, MeasurementGuide } from '../components/product/DimensionsDiagram';
import { Icon } from '../components/ui/Icon';
import { SectionHeading } from '../components/ui/Section';
import { SmartImage } from '../components/ui/SmartImage';
import { store } from '../config/store';
import { useEnquiry } from '../contexts/EnquiryContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { formatINR } from '../utils/currency';
import { headingImage } from '../data/productImages';
import type { HeadingStyle, LiningOption } from '../types/product';

export function CustomCurtainsPage() {
  usePageMeta('Custom-made curtains', 'Made-to-measure curtains with an itemised online estimate. Learn how to measure, choose fullness, heading and lining.');
  const { openEnquiry } = useEnquiry();
  const rc = store.pricing.rateCard;

  return (
    <>
      <section className="container-page grid gap-5 pt-3 pb-6 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-8">
        <div>
          <h1 className="text-[2rem] leading-tight sm:text-[2.5rem]">{store.home.customSection.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href="#configurator" className="btn btn-primary">Start your estimate <Icon name="arrowRight" size={16} /></a>
            <button type="button" className="btn btn-whatsapp" onClick={() => openEnquiry({ kind: 'custom_quote' })}><Icon name="whatsapp" /> Send photos on WhatsApp</button>
            <button type="button" className="btn btn-outline" onClick={() => openEnquiry({ kind: 'measurement' })}>Book a measurement visit</button>
          </div>
        </div>
        <SmartImage src={store.home.customSection.examples[0]?.src} alt={store.home.customSection.examples[0]?.alt ?? ''} ratio="1" priority className="rounded-2xl" />
      </section>

      <section aria-labelledby="measure-title" className="bg-surface py-6">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <div>
            <h2 id="measure-title" className="text-xl">How to measure</h2>
            <MeasurementGuide className="mt-3" />
          </div>
          <div className="rounded-xl bg-canvas p-4">
            <DimensionsDiagram width={null} drop={null} />
            <ol className="mt-4 space-y-2 text-sm text-muted">
              <li><strong className="text-ink">1.</strong> Fix the rod 10–15 cm above the window frame, extending 15–30 cm each side.</li>
              <li><strong className="text-ink">2.</strong> Finished width = rod length (between finials) + 5 cm overlap.</li>
              <li><strong className="text-ink">3.</strong> Finished drop = top of heading to floor, minus 1 cm. Eyelets: measure from the top of the rod plus 2 cm.</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="container-page py-6">
        <SectionHeading title="Fullness" />
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {rc.fullnessOptions.map((f) => (
            <div key={f.ratio} className="rounded-xl border border-line p-3">
              <p className="font-display text-2xl">{f.ratio}×</p>
              <h3 className="font-sans text-sm font-semibold">{f.label.split(' ')[0]}</h3>
              <p className="mt-0.5 text-xs text-muted">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-6">
        <div className="container-page">
          <SectionHeading title="Headings" />
          <div className="grid grid-cols-2 gap-x-2 gap-y-3 sm:gap-x-3 lg:grid-cols-4">
            {(Object.entries(rc.headings) as [HeadingStyle, (typeof rc.headings)[HeadingStyle]][]).map(([id, h]) => (
              <article key={id}>
                <SmartImage src={headingImage(id)} alt={`${h.label} heading close-up`} ratio="1" className="rounded-xl" />
                <h3 className="mt-2 font-sans text-sm font-semibold">{h.label}</h3>
                <p className="text-xs text-muted">{h.recommendedFullness}× fullness · {formatINR(h.chargePerWidth)} per width</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page grid gap-6 py-6 lg:grid-cols-2">
        <div>
          <h2 className="text-xl">Lining</h2>
          <ul className="mt-1 divide-y divide-line">
            {(Object.entries(rc.linings) as [LiningOption, (typeof rc.linings)[LiningOption]][]).map(([id, l]) => (
              <li key={id} className="py-2.5">
                <div className="flex justify-between gap-3">
                  <h3 className="font-sans text-[15px] font-semibold">{l.label}</h3>
                  <span className="text-sm text-muted">{l.pricePerMeter ? `${formatINR(l.pricePerMeter)}/m` : 'No charge'}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{l.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl">Stitching, lead time &amp; installation</h2>
          <dl className="mt-1 divide-y divide-line text-sm">
            <div className="py-2.5"><dt className="font-semibold">Stitching</dt><dd className="mt-1 text-muted">{formatINR(rc.stitchingPerWidth)} per fabric width, plus heading and lining charges. Patterns are matched across joins.</dd></div>
            <div className="py-2.5"><dt className="font-semibold">{store.policies.production.title}</dt><dd className="mt-1 text-muted">{store.policies.production.body}</dd></div>
            <div className="py-2.5"><dt className="font-semibold">{store.policies.measurement.title}</dt><dd className="mt-1 text-muted">{formatINR(rc.services.measurementFee)} — {store.policies.measurement.body}</dd></div>
            <div className="py-2.5"><dt className="font-semibold">{store.policies.installation.title}</dt><dd className="mt-1 text-muted">{formatINR(rc.services.installationPerPair)} per pair. {store.policies.installation.body}</dd></div>
          </dl>
        </div>
      </section>

      <section id="configurator" aria-labelledby="cfg-title" className="scroll-mt-28 border-t border-line bg-canvas py-6">
        <div className="container-page">
          <SectionHeading id="cfg-title" title="Build your custom curtains" intro="The showroom confirms the final price before anything is cut." />
          <CustomConfigurator layout="wide" />
        </div>
      </section>
    </>
  );
}
