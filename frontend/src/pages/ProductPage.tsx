import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import { CustomConfigurator } from '../components/product/CustomConfigurator';
import { DimensionsDiagram } from '../components/product/DimensionsDiagram';
import { ProductCard } from '../components/ProductCard';
import { Icon } from '../components/ui/Icon';
import { PriceTag } from '../components/ui/PriceTag';
import { Rail, RailItem, SectionHeading } from '../components/ui/Section';
import { SmartImage } from '../components/ui/SmartImage';
import { StarRating } from '../components/ui/StarRating';
import { EmptyState, ErrorState } from '../components/ui/States';
import { store } from '../config/store';
import { useEnquiry, type EnquiryRequest } from '../contexts/EnquiryContext';
import { useAsync } from '../hooks/useAsync';
import { usePageMeta } from '../hooks/usePageMeta';
import { availableSizesSync, getProductBySlug, getRelatedProducts, getReviews, isOnFestivalOffer, type ProductDetail } from '../services/productService';
import type { HeadingStyle, LiningOption, ProductImage } from '../types/product';
import { cn } from '../utils/cn';
import { formatINR } from '../utils/currency';
import {
  FUNCTION_LABELS,
  headingLabel,
  liningLabel,
  listLabels,
  MATERIAL_LABELS,
  OPACITY_LABELS,
  PATTERN_LABELS,
  ROOM_LABELS,
  STOCK_LABELS,
  TEXTURE_LABELS,
} from '../utils/labels';
import { calculateFabricConsumption } from '../utils/pricing';
import { priceView } from '../utils/priceDisplay';
import { isFestivalLive } from '../utils/promotions';
import { formatDual, formatFeetCompact, formatMetres } from '../utils/units';

const isValidUrl = (u: string | null) => {
  if (!u) return false;
  try {
    return ['https:', 'http:'].includes(new URL(u).protocol);
  } catch {
    return false;
  }
};

export function ProductPage() {
  const { slug = '' } = useParams();
  const { data, error, loading, reload } = useAsync(() => getProductBySlug(slug), [slug]);
  usePageMeta(data?.product.name ?? (loading ? undefined : 'Curtain not found'), data?.product.description);

  if (error) return <div className="container-page py-16"><ErrorState error={error} onRetry={reload} /></div>;
  if (loading) return <ProductSkeleton />;
  if (!data) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="We couldn’t find that curtain"
          body="It may have been renamed or retired. Browse the full collection instead."
          action={<Link to="/catalog" className="btn btn-primary">Browse curtains</Link>}
        />
      </div>
    );
  }
  return <ProductView key={data.product.id} detail={data} />;
}

function ProductSkeleton() {
  return (
    <div className="container-page grid gap-10 py-8 lg:grid-cols-2" role="status" aria-label="Loading product">
      <div className="skeleton aspect-[4/5] rounded-2xl" />
      <div className="space-y-4">
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton h-10 w-3/4" />
        <div className="skeleton h-6 w-1/2" />
        <div className="skeleton h-40 w-full" />
      </div>
    </div>
  );
}

function ProductView({ detail }: { detail: ProductDetail }) {
  const { product, category, categories, images } = detail;
  const { openEnquiry } = useEnquiry();
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? '');
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0]!;
  const sizes = useMemo(() => availableSizesSync(product.id, variant.id), [product.id, variant.id]);
  const firstAvailable = sizes.find((s) => s.price.is_available);
  const [sizeId, setSizeId] = useState(firstAvailable?.size.id ?? '');
  const [mode, setMode] = useState<'standard' | 'custom'>(product.standard_sizing_enabled && sizes.length ? 'standard' : 'custom');
  const [heading, setHeading] = useState<HeadingStyle>(product.heading_options[0] ?? 'eyelet');
  const [lining, setLining] = useState<LiningOption>(product.lining_options[0] ?? 'unlined');
  const [qty, setQty] = useState(1);
  const [measurement, setMeasurement] = useState(false);
  const [installation, setInstallation] = useState(false);

  // Keep a valid size selected when the colourway changes.
  useEffect(() => {
    if (!sizes.some((s) => s.size.id === sizeId && s.price.is_available)) setSizeId(firstAvailable?.size.id ?? '');
  }, [sizes, sizeId, firstAvailable]);

  const selected = sizes.find((s) => s.size.id === sizeId);
  const view =
    mode === 'standard' && selected?.price.is_available
      ? priceView(selected.price.price_mode, selected.price.sale_price, selected.price.mrp, product.selling_unit)
      : priceView(product.price_mode, product.priceFrom, product.mrpFrom, product.selling_unit, { forceStartingFrom: product.price_mode !== 'on_request' });
  const unitWord = product.selling_unit === 'panel' ? 'panel' : 'pair';

  const gallery: ProductImage[] = images
    .filter((i) => i.variant_id === null || i.variant_id === variant.id)
    .sort((a, b) => a.sort_order - b.sort_order);

  const consumption = useMemo(() => {
    if (!selected || !variant.fabric_roll_width_cm) return null;
    const panels = product.selling_unit === 'panel' ? 1 : 2;
    return calculateFabricConsumption(
      { finishedWidth: selected.size.finished_width * 2, finishedDrop: selected.size.finished_drop, pairs: 1, fullnessRatio: 1, lining: 'unlined' },
      { rollWidthCm: variant.fabric_roll_width_cm, patternRepeatCm: variant.pattern_repeat_cm, railroadable: variant.railroadable },
      store.pricing.rateCard.allowances,
    ).totalFabric / (2 / panels);
  }, [selected, variant, product.selling_unit]);

  const festive = isFestivalLive(store.festival) && isOnFestivalOffer(product) ? store.festival!.coupon : null;
  const sizeText = selected ? `${selected.size.label} (${formatDual(selected.size.finished_width)} × ${formatDual(selected.size.finished_drop)} per panel)` : undefined;
  const baseRequest = (kind: EnquiryRequest['kind']): EnquiryRequest => ({
    kind,
    product: `${product.name} (${product.sku})`,
    fabric: `${variant.name} · ${MATERIAL_LABELS[variant.material]}`,
    size: mode === 'standard' ? sizeText : 'Custom size',
    price: mode === 'standard' && view.amount ? `${view.text}${qty > 1 ? ` × ${qty}` : ''}` : view.text,
    details: [
      ...(mode === 'standard' ? [`Quantity: ${qty} ${unitWord}${qty > 1 ? 's' : ''}`] : []),
      `Heading: ${headingLabel(heading)}`,
      `Lining: ${liningLabel(lining)}`,
      ...(measurement ? ['Measurement visit: Yes'] : []),
      ...(installation ? ['Installation: Yes'] : []),
    ],
  });

  const reviews = useAsync(() => getReviews(product.id), [product.id]);
  const related = useAsync(() => getRelatedProducts(product.id), [product.id]);

  return (
    <>
      <nav aria-label="Breadcrumb" className="container-page pt-5 text-xs text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link to="/" className="hover:text-ink">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/catalog" className="hover:text-ink">Curtains</Link></li>
          {category && (
            <>
              <li aria-hidden="true">/</li>
              <li><Link to={`/catalog?category=${category.slug}`} className="hover:text-ink">{category.name}</Link></li>
            </>
          )}
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">{product.name}</li>
        </ol>
      </nav>

      <div className="container-page grid gap-8 pt-5 pb-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <Gallery images={gallery} key={variant.id} />

        <div className="min-w-0">
          <p className="eyebrow">{product.fabric_collection}</p>
          <h1 className="mt-2 text-[2rem] leading-tight sm:text-[2.5rem]">{product.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <span>SKU {variant.variant_sku}</span>
            {product.rating && (
              <a href="#reviews" className="inline-flex items-center gap-1.5 hover:text-ink">
                <StarRating value={product.rating.average} /> {product.rating.average} ({product.rating.count})
              </a>
            )}
            {product.in_showroom && <span className="inline-flex items-center gap-1"><Icon name="pin" size={14} /> On display in showroom</span>}
          </div>

          <div className="mt-6 rounded-2xl bg-surface p-5">
            <PriceTag view={view} size="lg" showEmi />
            <p className="mt-2 text-xs text-muted">
              {view.amount ? `Price for one ${unitWord}${product.selling_unit === 'pair' ? ' (two panels)' : ''}${mode === 'standard' && selected ? `, ${selected.size.label.split(' · ')[1] ?? ''} per panel` : ''}. ` : ''}
              {store.pricing.gst.note}
            </p>
            {product.price_mode === 'best_price' && <p className="mt-2 text-sm font-medium text-brand-dark">Best price available on request — ask us for project or multi-window pricing.</p>}
            {festive && (
              <p className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-lg bg-festive px-3 py-1.5 text-xs font-semibold text-festive-gold">
                <Icon name="sparkle" size={13} /> Use {festive.code}: {formatINR(festive.discount)} off orders above {formatINR(festive.minOrder)}
              </p>
            )}
            {store.pricing.emi?.enabled && view.emi && <p className="mt-2 text-xs text-muted">{store.pricing.emi.noCostNote}</p>}
          </div>

          {/* Colourway */}
          <fieldset className="mt-6">
            <legend className="text-sm font-semibold">
              Colour: <span className="font-normal text-muted">{variant.name}</span>
              <span className={cn('ml-2 text-xs font-medium', variant.stock_status === 'out_of_stock' ? 'text-sale' : 'text-muted')}>· {STOCK_LABELS[variant.stock_status]}</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {product.variants.map((v) => (
                <label key={v.id} className="cursor-pointer" title={v.name}>
                  <input type="radio" name="variant" className="peer sr-only" checked={v.id === variant.id} onChange={() => setVariantId(v.id)} />
                  <span
                    className="block size-11 rounded-full border-2 border-canvas ring-1 ring-line transition peer-checked:ring-2 peer-checked:ring-ink peer-focus-visible:ring-2 peer-focus-visible:ring-brand"
                    style={{ background: v.color_hex }}
                  />
                  <span className="sr-only">{v.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Size mode */}
          {product.standard_sizing_enabled && sizes.length > 0 && product.custom_sizing_enabled && (
            <div role="tablist" aria-label="Sizing" className="mt-6 grid grid-cols-2 rounded-full bg-sand p-1">
              {(['standard', 'custom'] as const).map((m) => (
                <button
                  key={m}
                  role="tab"
                  type="button"
                  aria-selected={mode === m}
                  onClick={() => setMode(m)}
                  className={cn('min-h-10 rounded-full text-sm font-semibold', mode === m ? 'bg-canvas shadow-soft' : 'text-muted')}
                >
                  {m === 'standard' ? 'Ready-made size' : 'Custom size'}
                </button>
              ))}
            </div>
          )}

          {mode === 'standard' && sizes.length > 0 ? (
            <div className="mt-6 space-y-6">
              <fieldset>
                <legend className="text-sm font-semibold">Size <span className="font-normal text-muted">— width is per panel; a pair is two panels</span></legend>
                <div className="mt-3 grid gap-2">
                  {sizes.map(({ size, price }) => (
                    <label
                      key={size.id}
                      className={cn(
                        'flex items-center justify-between gap-3 rounded-xl border p-3 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand',
                        !price.is_available ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                        sizeId === size.id ? 'border-ink bg-surface' : 'border-line',
                      )}
                    >
                      <input type="radio" name="size" className="sr-only" disabled={!price.is_available} checked={sizeId === size.id} onChange={() => setSizeId(size.id)} />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium">{size.label}</span>
                        <span className="block text-xs text-muted">
                          {formatFeetCompact(size.finished_width, size.finished_drop)} · {Math.round(size.finished_width / 10)} × {Math.round(size.finished_drop / 10)} cm · {size.use_case}
                        </span>
                      </span>
                      <span className="text-right text-sm font-semibold tabular-nums">
                        {!price.is_available ? 'Unavailable' : price.sale_price ? formatINR(price.sale_price) : 'On request'}
                        {price.is_available && price.sale_price ? <span className="block text-[11px] font-normal text-muted">/ {unitWord}</span> : null}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {selected && (
                <div className="grid items-center gap-4 rounded-2xl border border-line p-4 sm:grid-cols-[1fr_1.1fr]">
                  <DimensionsDiagram
                    width={product.selling_unit === 'panel' ? selected.size.finished_width : selected.size.finished_width * 2}
                    drop={selected.size.finished_drop}
                    panelWidth={product.selling_unit === 'panel' ? undefined : selected.size.finished_width}
                    rodWidth={product.selling_unit === 'panel' ? undefined : selected.size.recommended_rod_width}
                  />
                  <ul className="space-y-1.5 text-xs text-muted">
                    <li><strong className="text-ink">Each panel:</strong> {formatDual(selected.size.finished_width)} wide × {formatDual(selected.size.finished_drop)} drop</li>
                    {product.selling_unit === 'pair' && <li><strong className="text-ink">Pair suits a rod of about</strong> {formatDual(selected.size.recommended_rod_width)}</li>}
                    {consumption && <li><strong className="text-ink">Fabric used:</strong> ≈ {formatMetres(consumption)} per {unitWord}</li>}
                    <li>Need a different size? Switch to <button type="button" className="font-semibold text-brand underline" onClick={() => setMode('custom')} disabled={!product.custom_sizing_enabled}>custom size</button>.</li>
                  </ul>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField label="Heading style" value={heading} onChange={(v) => setHeading(v as HeadingStyle)} options={product.heading_options.map((h) => [h, headingLabel(h)])} hint={product.heading_options.length > 1 ? 'Ready stock ships with the first option; others are made to order.' : undefined} />
                <SelectField label="Lining" value={lining} onChange={(v) => setLining(v as LiningOption)} options={product.lining_options.map((l) => [l, liningLabel(l)])} hint={lining !== product.lining_options[0] ? 'Lining is added to order — the showroom confirms the price.' : undefined} />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center rounded-full border border-line" role="group" aria-label="Quantity">
                  <button type="button" className="grid size-11 place-items-center rounded-full hover:bg-sand" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label={`Fewer ${unitWord}s`}><Icon name="minus" size={16} /></button>
                  <span className="min-w-14 text-center text-sm font-semibold tabular-nums" aria-live="polite">{qty} {unitWord}{qty > 1 ? 's' : ''}</span>
                  <button type="button" className="grid size-11 place-items-center rounded-full hover:bg-sand" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label={`More ${unitWord}s`}><Icon name="plus" size={16} /></button>
                </div>
                {selected?.price.sale_price && qty > 1 && <p className="text-sm text-muted">Subtotal <strong className="text-ink">{formatINR(selected.price.sale_price * qty)}</strong></p>}
              </div>

              <fieldset className="space-y-2">
                <legend className="mb-2 text-sm font-semibold">Optional services</legend>
                <ServiceCheck checked={measurement} onChange={setMeasurement} label={`Home measurement · ${formatINR(store.pricing.rateCard.services.measurementFee)}`} note={store.pricing.rateCard.services.measurementNote} />
                <ServiceCheck checked={installation} onChange={setInstallation} label={`Installation · ${formatINR(store.pricing.rateCard.services.installationPerPair)} per pair`} note={store.pricing.rateCard.services.installationNote} />
              </fieldset>

              <ActionButtons
                buyUrl={isValidUrl(product.buy_url) ? product.buy_url : null}
                onWhatsApp={() => openEnquiry(baseRequest('product'))}
                onEnquire={() => openEnquiry(baseRequest('product'))}
                onBestPrice={store.pricing.bestPrice.enabled ? () => openEnquiry(baseRequest('price')) : undefined}
                onSample={() => openEnquiry({ ...baseRequest('fabric_sample'), size: undefined, price: undefined, details: [] })}
                highlightBestPrice={product.price_mode === 'best_price' || product.price_mode === 'on_request'}
              />
            </div>
          ) : product.custom_sizing_enabled ? (
            <div className="mt-6">
              <CustomConfigurator productId={product.id} variantId={variant.id} onVariantChange={setVariantId} initialWidth={product.width * 2} initialDrop={product.drop} />
              <div className="mt-6 flex flex-wrap gap-2">
                <button type="button" className="btn btn-outline" onClick={() => openEnquiry({ ...baseRequest('fabric_sample'), size: undefined, price: undefined, details: [] })}>
                  <Icon name="swatch" size={17} /> Request fabric sample
                </button>
                <a href={`tel:${store.contact.phone}`} className="btn btn-ghost"><Icon name="phone" size={17} /> Call</a>
              </div>
            </div>
          ) : (
            <ActionButtons
              buyUrl={null}
              onWhatsApp={() => openEnquiry(baseRequest('product'))}
              onEnquire={() => openEnquiry(baseRequest('product'))}
              onBestPrice={() => openEnquiry(baseRequest('price'))}
              onSample={() => openEnquiry({ ...baseRequest('fabric_sample'), details: [] })}
              highlightBestPrice
            />
          )}

          <p className="mt-6 text-sm text-muted">{product.description}</p>
        </div>
      </div>

      {/* Specifications & policies */}
      <section aria-labelledby="spec-title" className="bg-surface py-14">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <h2 id="spec-title" className="text-2xl">Specifications</h2>
            <dl className="mt-5 divide-y divide-line rounded-2xl bg-canvas text-sm">
              {[
                ['Material', MATERIAL_LABELS[variant.material]],
                ['Colour', `${variant.name}`],
                ['Pattern', listLabels(product.patterns, PATTERN_LABELS)],
                ['Texture', TEXTURE_LABELS[product.texture]],
                ['Function', listLabels(product.functional_types, FUNCTION_LABELS)],
                ['Light control', OPACITY_LABELS[product.opacity]],
                ['Headings', product.heading_options.map(headingLabel).join(', ')],
                ['Linings', product.lining_options.map(liningLabel).join(', ')],
                ['Roll width', variant.fabric_roll_width_cm ? `${variant.fabric_roll_width_cm} cm${variant.railroadable ? ' (can be railroaded)' : ''}` : 'To be confirmed'],
                ['Pattern repeat', variant.pattern_repeat_cm ? `${variant.pattern_repeat_cm} cm` : 'None'],
                ['Sold as', product.selling_unit === 'panel' ? 'Single panel' : 'Pair (two panels)'],
                ['Style', product.style],
                ['Rooms', product.rooms.map((r) => ROOM_LABELS[r]).join(', ')],
                ['Categories', categories.map((c) => c.name).join(', ')],
                ['Warranty', product.warranty],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[8rem_1fr] gap-3 px-4 py-3">
                  <dt className="text-muted">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="text-2xl">Delivery, care &amp; service</h2>
            <div className="mt-5 divide-y divide-line rounded-2xl bg-canvas">
              <Policy title="Lead time" open>
                Ready-made: {product.lead_time.ready_made_days.join('–')} working days. Made to measure: {product.lead_time.custom_days.join('–')} working days after confirmation.
              </Policy>
              <Policy title="Delivery">
                <ul className="space-y-1">
                  {store.delivery.areas.map((a) => (
                    <li key={a.name} className="flex justify-between gap-3"><span>{a.name}</span><span className="font-medium text-ink">{a.fee === 0 ? 'Free delivery' : formatINR(a.fee)} · {a.eta}</span></li>
                  ))}
                </ul>
                <p className="mt-2">{store.delivery.note}</p>
              </Policy>
              <Policy title={store.policies.installation.title}>{store.policies.installation.body}</Policy>
              <Policy title={store.policies.customisation.title}>{store.policies.customisation.body}</Policy>
              <Policy title={store.policies.returns.title}>{store.policies.returns.body}</Policy>
              <Policy title="Care">
                <ul className="list-disc space-y-1 pl-5">{product.care.map((c) => <li key={c}>{c}</li>)}</ul>
              </Policy>
              <Policy title="Warranty">{product.warranty}</Policy>
              <Policy title={store.policies.showroomAvailability.title}>
                {product.in_showroom ? 'This design is on display at our showroom. ' : 'This design is available to view as a swatch. '}
                {store.policies.showroomAvailability.body}
              </Policy>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" aria-labelledby="rev-title" className="container-page py-14">
        <SectionHeading id="rev-title" eyebrow="Reviews" title={product.rating ? `${product.rating.average} out of 5 · ${product.rating.count} reviews` : 'Reviews'} intro="Demonstration reviews included with the template." />
        {reviews.error ? (
          <ErrorState error={reviews.error} onRetry={reviews.reload} />
        ) : reviews.loading ? (
          <div className="skeleton h-32 rounded-2xl" />
        ) : reviews.data?.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.data.map((r) => (
              <article key={r.id} className="rounded-2xl border border-line p-5">
                <div className="flex items-center justify-between">
                  <StarRating value={r.rating} />
                  {r.is_demo && <span className="rounded bg-sand px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted uppercase">Demo review</span>}
                </div>
                <h3 className="mt-3 text-lg">{r.title}</h3>
                <p className="mt-1 text-sm text-muted">{r.body}</p>
                <p className="mt-3 text-xs text-muted">{r.author} · {r.city} · {new Date(r.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No reviews yet" body="Bought this design? Send us a photo of your window on WhatsApp." icon="star" />
        )}
      </section>

      {related.data && related.data.length > 0 && (
        <section aria-labelledby="rel-title" className="container-page pb-6">
          <SectionHeading id="rel-title" eyebrow="You may also like" title="Related curtains" />
          <Rail label="Related curtains">
            {related.data.map((p) => (
              <RailItem key={p.id}><ProductCard product={p} /></RailItem>
            ))}
          </Rail>
        </section>
      )}
    </>
  );
}

function Gallery({ images }: { images: ProductImage[] }) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];
  const go = (d: number) => setIndex((i) => (i + d + images.length) % images.length);
  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <div
        className="relative overflow-hidden rounded-2xl"
        tabIndex={0}
        aria-roledescription="image gallery"
        aria-label={`Image ${index + 1} of ${images.length}: ${current?.alt ?? ''}`}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(1);
          if (e.key === 'ArrowLeft') go(-1);
        }}
      >
        <SmartImage key={current?.id} src={current?.url} alt={current?.alt ?? ''} position={current?.position} ratio="4 / 5" priority className="animate-fade-in" />
        {images.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-canvas/85 shadow-soft backdrop-blur hover:bg-canvas" aria-label="Previous image"><Icon name="chevronLeft" /></button>
            <button type="button" onClick={() => go(1)} className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-canvas/85 shadow-soft backdrop-blur hover:bg-canvas" aria-label="Next image"><Icon name="chevronRight" /></button>
          </>
        )}
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {images.map((img, i) => (
          <button key={img.id} type="button" onClick={() => setIndex(i)} aria-label={`Show image ${i + 1}: ${img.alt}`} aria-current={i === index} className={cn('overflow-hidden rounded-lg ring-offset-2', i === index ? 'ring-2 ring-ink' : 'opacity-75 hover:opacity-100')}>
            <SmartImage src={img.url} alt="" ratio="1" position={img.position} />
          </button>
        ))}
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options, hint }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][]; hint?: string }) {
  const id = `sel-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label}</label>
      <select id={id} className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function ServiceCheck({ checked, onChange, label, note }: { checked: boolean; onChange: (v: boolean) => void; label: string; note: string }) {
  return (
    <label className="flex cursor-pointer gap-3 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 size-4 accent-[var(--color-brand)]" />
      <span><span className="font-medium">{label}</span><span className="block text-xs text-muted">{note}</span></span>
    </label>
  );
}

function ActionButtons({
  buyUrl,
  onWhatsApp,
  onEnquire,
  onBestPrice,
  onSample,
  highlightBestPrice,
}: {
  buyUrl: string | null;
  onWhatsApp: () => void;
  onEnquire: () => void;
  onBestPrice?: () => void;
  onSample: () => void;
  highlightBestPrice?: boolean;
}) {
  return (
    <div className="mt-6 space-y-2">
      <div className="grid gap-2 sm:grid-cols-2">
        {buyUrl && (
          <a href={buyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-dark sm:col-span-2">Buy now <Icon name="external" size={16} /></a>
        )}
        <button type="button" className="btn btn-whatsapp" onClick={onWhatsApp}><Icon name="whatsapp" /> WhatsApp</button>
        {onBestPrice && (
          <button type="button" className={cn('btn', highlightBestPrice ? 'btn-primary' : 'btn-outline')} onClick={onBestPrice}>
            {store.pricing.bestPrice.label}
          </button>
        )}
        <button type="button" className="btn btn-outline" onClick={onEnquire}><Icon name="chat" size={17} /> Enquire</button>
        <a href={`tel:${store.contact.phone}`} className="btn btn-outline"><Icon name="phone" size={17} /> Call</a>
      </div>
      <button type="button" className="btn btn-ghost w-full" onClick={onSample}><Icon name="swatch" size={17} /> Request a fabric sample</button>
      {onBestPrice && <p className="text-center text-xs text-muted">{store.pricing.bestPrice.helper}</p>}
    </div>
  );
}

function Policy({ title, children, open }: { title: string; children: ReactNode; open?: boolean }) {
  return (
    <details className="group px-4" open={open}>
      <summary className="flex min-h-12 items-center justify-between text-sm font-semibold">
        {title}
        <Icon name="chevronDown" size={16} className="transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-4 text-sm text-muted">{children}</div>
    </details>
  );
}
