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
      <section className="container-page grid gap-8 pt-10 pb-14 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow mb-4">Made to measure</p>
          <h1 className="text-[2.5rem] leading-tight sm:text-[3.25rem]">{store.home.customSection.title}</h1>
          <p className="mt-4 max-w-lg text-muted">{store.home.customSection.intro}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#configurator" className="btn btn-primary">Start your estimate <Icon name="arrowRight" size={16} /></a>
            <button type="button" className="btn btn-whatsapp" onClick={() => openEnquiry({ kind: 'custom_quote' })}><Icon name="whatsapp" /> Send photos on WhatsApp</button>
            <button type="button" className="btn btn-outline" onClick={() => openEnquiry({ kind: 'measurement' })}>Book a measurement visit</button>
          </div>
        </div>
        <SmartImage src={store.home.customSection.examples[0]?.src} alt={store.home.customSection.examples[0]?.alt ?? ''} ratio="4 / 3" priority className="rounded-[1.75rem]" />
      </section>

      <section aria-labelledby="measure-title" className="bg-surface py-14">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <h2 id="measure-title" className="text-[2rem]">How to measure</h2>
            <p className="mt-2 text-muted">Use a steel tape and measure each window separately — walls are rarely perfectly square.</p>
            <MeasurementGuide className="mt-4" />
          </div>
          <div className="rounded-2xl bg-canvas p-6">
            <DimensionsDiagram width={null} drop={null} />
            <ol className="mt-4 space-y-2 text-sm text-muted">
              <li><strong className="text-ink">1.</strong> Fix the rod 10–15 cm above the window frame, extending 15–30 cm each side.</li>
              <li><strong className="text-ink">2.</strong> Finished width = rod length (between finials) + 5 cm overlap.</li>
              <li><strong className="text-ink">3.</strong> Finished drop = top of heading to floor, minus 1 cm. Eyelets: measure from the top of the rod plus 2 cm.</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <SectionHeading eyebrow="Fullness" title="Why curtains are wider than the window" intro="Fullness is how much fabric is gathered into the finished width. More fullness = deeper, richer folds and more fabric." />
        <div className="grid gap-4 md:grid-cols-3">
          {rc.fullnessOptions.map((f) => (
            <div key={f.ratio} className="rounded-2xl border border-line p-6">
              <p className="font-display text-3xl">{f.ratio}×</p>
              <h3 className="mt-2 font-sans text-base font-semibold">{f.label}</h3>
              <p className="mt-1 text-sm text-muted">{f.description}</p>
              <p className="mt-3 text-xs text-muted">A 150 cm wide pair uses {150 * f.ratio} cm of fabric width.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-14">
        <div className="container-page">
          <SectionHeading eyebrow="Headings" title="Choose how your curtains hang" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.entries(rc.headings) as [HeadingStyle, (typeof rc.headings)[HeadingStyle]][]).map(([id, h]) => (
              <article key={id} className="overflow-hidden rounded-2xl bg-canvas">
                <SmartImage src={headingImage(id)} alt={`${h.label} heading close-up`} ratio="1" />
                <div className="p-5">
                  <h3 className="text-lg">{h.label}</h3>
                  <p className="mt-1 text-sm text-muted">{h.description}</p>
                  <p className="mt-3 text-xs text-muted">Recommended fullness {h.recommendedFullness}× · {formatINR(h.chargePerWidth)} per fabric width</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page grid gap-10 py-14 lg:grid-cols-2">
        <div>
          <h2 className="text-[2rem]">Lining</h2>
          <ul className="mt-5 divide-y divide-line">
            {(Object.entries(rc.linings) as [LiningOption, (typeof rc.linings)[LiningOption]][]).map(([id, l]) => (
              <li key={id} className="py-4">
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
          <h2 className="text-[2rem]">Stitching, lead time &amp; installation</h2>
          <dl className="mt-5 divide-y divide-line text-sm">
            <div className="py-4"><dt className="font-semibold">Stitching</dt><dd className="mt-1 text-muted">{formatINR(rc.stitchingPerWidth)} per fabric width, plus heading and lining charges. Patterns are matched across joins.</dd></div>
            <div className="py-4"><dt className="font-semibold">{store.policies.production.title}</dt><dd className="mt-1 text-muted">{store.policies.production.body}</dd></div>
            <div className="py-4"><dt className="font-semibold">{store.policies.measurement.title}</dt><dd className="mt-1 text-muted">{formatINR(rc.services.measurementFee)} — {store.policies.measurement.body}</dd></div>
            <div className="py-4"><dt className="font-semibold">{store.policies.installation.title}</dt><dd className="mt-1 text-muted">{formatINR(rc.services.installationPerPair)} per pair. {store.policies.installation.body}</dd></div>
          </dl>
        </div>
      </section>

      <section id="configurator" aria-labelledby="cfg-title" className="scroll-mt-28 border-t border-line bg-canvas py-14">
        <div className="container-page">
          <SectionHeading id="cfg-title" eyebrow="Guided quotation" title="Build your custom curtains" intro="Get an itemised estimate in five steps. The showroom confirms the final price before anything is cut." />
          <CustomConfigurator layout="wide" />
        </div>
      </section>
    </>
  );
}
