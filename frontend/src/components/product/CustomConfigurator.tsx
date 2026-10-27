import { useEffect, useId, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { store } from '../../config/store';
import { useEnquiry } from '../../contexts/EnquiryContext';
import { calculateCustomQuoteSync, customisationOptionsSync, lookup, saveQuote } from '../../services/productService';
import type { HeadingStyle, LiningOption, MeasurementUnit, Millimetres } from '../../types/product';
import type { QuoteInput } from '../../types/quote';
import { cn } from '../../utils/cn';
import { formatINR } from '../../utils/currency';
import { headingLabel, liningLabel, MATERIAL_LABELS, PATTERN_LABELS, STOCK_LABELS } from '../../utils/labels';
import { validateQuoteInput } from '../../utils/pricing';
import { isFestivalLive } from '../../utils/promotions';
import { formatDual, formatMetres, formatSize, parseMeasurement, toMeasurementInput, type MeasurementInput } from '../../utils/units';
import { Icon } from '../ui/Icon';
import { SmartImage } from '../ui/SmartImage';
import { DimensionsDiagram, MeasurementGuide } from './DimensionsDiagram';
import { MeasurementField, UnitToggle } from './MeasurementField';
import { ESTIMATE_LABEL, QuoteBreakdown } from './QuoteBreakdown';

const STEPS = ['Fabric', 'Measurements', 'Configure', 'Estimate', 'Enquire'] as const;

interface Props {
  /** Lock to one design (product page). Omit to let the customer pick a design. */
  productId?: string;
  /** Selected colourway, kept in sync with the product gallery. */
  variantId?: string;
  onVariantChange?: (id: string) => void;
  initialWidth?: Millimetres;
  initialDrop?: Millimetres;
  layout?: 'stacked' | 'wide';
}

/** Guided made-to-measure configurator: fabric → measurements → options → estimate → enquiry. */
export function CustomConfigurator({ productId: lockedProductId, variantId: controlledVariant, onVariantChange, initialWidth, initialDrop, layout = 'stacked' }: Props) {
  const uid = useId();
  const { openEnquiry } = useEnquiry();
  const customProducts = useMemo(
    () => lookup.allProductsSync().filter((p) => p.custom_sizing_enabled).sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  const [productId, setProductId] = useState(lockedProductId ?? customProducts[0]?.id ?? '');
  const product = lookup.product(lockedProductId ?? productId);
  const options = product ? customisationOptionsSync(product.id) : null;

  const [localVariant, setLocalVariant] = useState(controlledVariant ?? product?.variants[0]?.id ?? '');
  const variantId = controlledVariant ?? localVariant;
  const variant = product?.variants.find((v) => v.id === variantId) ?? product?.variants[0] ?? null;
  const setVariant = (id: string) => {
    setLocalVariant(id);
    onVariantChange?.(id);
  };

  const [step, setStep] = useState(0);
  const [unit, setUnit] = useState<MeasurementUnit>('in');
  const [width, setWidth] = useState<MeasurementInput>(initialWidth ? toMeasurementInput(initialWidth, 'in') : { unit: 'in', value: '' });
  const [drop, setDrop] = useState<MeasurementInput>(initialDrop ? toMeasurementInput(initialDrop, 'in') : { unit: 'in', value: '' });
  const [pairs, setPairs] = useState(1);
  const [heading, setHeading] = useState<HeadingStyle>(product?.heading_options[0] ?? 'eyelet');
  const [fullness, setFullness] = useState(store.pricing.rateCard.headings[heading].recommendedFullness);
  const [fullnessTouched, setFullnessTouched] = useState(false);
  const [lining, setLining] = useState<LiningOption>(product?.lining_options[0] ?? 'unlined');
  const [installation, setInstallation] = useState(false);
  const [measurementService, setMeasurementService] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  // Reset design-specific choices when the design changes.
  useEffect(() => {
    if (!product) return;
    if (!product.variants.some((v) => v.id === variantId)) setVariant(product.variants[0]?.id ?? '');
    if (!product.heading_options.includes(heading)) setHeading(product.heading_options[0] ?? 'eyelet');
    if (!product.lining_options.includes(lining)) setLining(product.lining_options[0] ?? 'unlined');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  useEffect(() => {
    if (!fullnessTouched) setFullness(store.pricing.rateCard.headings[heading].recommendedFullness);
  }, [heading, fullnessTouched]);

  const changeUnit = (u: MeasurementUnit) => {
    const w = parseMeasurement(width);
    const d = parseMeasurement(drop);
    setWidth(w ? toMeasurementInput(w, u) : { unit: u, value: '', feet: '', inches: '' });
    setDrop(d ? toMeasurementInput(d, u) : { unit: u, value: '', feet: '', inches: '' });
    setUnit(u);
  };

  const widthMm = parseMeasurement(width);
  const dropMm = parseMeasurement(drop);

  const input: QuoteInput | null =
    product && variant
      ? {
          productId: product.id,
          variantId: variant.id,
          finishedWidth: widthMm ?? 0,
          finishedDrop: dropMm ?? 0,
          displayUnit: unit,
          pairs,
          fullnessRatio: fullness,
          heading,
          lining,
          installation,
          measurementService,
          couponCode: coupon || undefined,
        }
      : null;

  const errors = input && options
    ? validateQuoteInput(input, { rateCard: store.pricing.rateCard, allowedHeadings: product!.heading_options, allowedLinings: product!.lining_options })
    : {};
  const result = useMemo(() => (input ? calculateCustomQuoteSync(input) : null), [JSON.stringify(input)]); // eslint-disable-line react-hooks/exhaustive-deps

  const stepValid = [
    !!variant,
    !errors.finishedWidth && !errors.finishedDrop && !errors.pairs,
    !errors.heading && !errors.lining && !errors.fullnessRatio,
    true,
    true,
  ];
  const canVisit = (i: number) => stepValid.slice(0, i).every(Boolean);
  const next = () => {
    if (!stepValid[step]) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  if (!product || !options) {
    return <p className="text-sm text-muted">Custom sizing is not available for this design.</p>;
  }

  const sizeText = widthMm && dropMm ? `${formatSize(widthMm, dropMm, unit)} (${formatDual(widthMm)} × ${formatDual(dropMm)}) per pair` : undefined;
  const estimate = result?.kind === 'estimate' ? result : null;

  const enquire = () => {
    if (!input || !result || !variant) return;
    saveQuote(input, result);
    const rc = store.pricing.rateCard;
    openEnquiry({
      kind: 'custom_quote',
      product: product.name,
      fabric: `${variant.name} · ${MATERIAL_LABELS[variant.material]} (${variant.variant_sku})`,
      size: sizeText,
      price: estimate ? `${formatINR(estimate.total)} estimate for ${pairs} ${pairs === 1 ? 'pair' : 'pairs'} (to be confirmed)` : 'Needs showroom confirmation',
      details: [
        `Pairs: ${pairs} (${pairs * 2} panels)`,
        `Heading: ${headingLabel(heading)}`,
        `Lining: ${liningLabel(lining)}`,
        `Fullness: ${rc.fullnessOptions.find((f) => f.ratio === fullness)?.label ?? `${fullness}×`}`,
        `Measurement visit: ${measurementService ? 'Yes' : 'No'}`,
        `Installation: ${installation ? 'Yes' : 'No'}`,
        ...(estimate ? [`Fabric estimate: ${formatMetres(estimate.consumption.totalFabric)}`] : []),
        ...(estimate?.discount ? [`Coupon: ${coupon.toUpperCase()}`] : []),
      ],
    });
  };

  const stepBody = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-5">
            {!lockedProductId && (
              <div>
                <label htmlFor={`${uid}-product`} className="mb-1.5 block text-sm font-semibold">
                  Design
                </label>
                <select id={`${uid}-product`} className="field" value={product.id} onChange={(e) => setProductId(e.target.value)}>
                  {customProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <fieldset>
              <legend className="mb-2 text-sm font-semibold">
                Fabric colour: <span className="font-normal text-muted">{variant?.name}</span>
              </legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {product.variants.map((v) => (
                  <label
                    key={v.id}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-xl border p-2 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand',
                      v.id === variant?.id ? 'border-ink bg-surface' : 'border-line hover:border-ink/40',
                    )}
                  >
                    <input type="radio" name={`${uid}-variant`} className="sr-only" checked={v.id === variant?.id} onChange={() => setVariant(v.id)} />
                    <SmartImage src={`/images/fabrics/${v.variant_sku.toLowerCase()}.webp`} alt="" ratio="1" className="w-11 shrink-0 rounded-lg" />
                    <span className="min-w-0 text-xs">
                      <span className="block truncate text-sm font-medium text-ink">{v.name}</span>
                      <span className="text-muted">{STOCK_LABELS[v.stock_status]}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            {variant && (
              <p className="text-sm text-muted">
                {MATERIAL_LABELS[variant.material]} · {PATTERN_LABELS[variant.pattern]}
                {variant.fabric_roll_width_cm ? ` · ${variant.fabric_roll_width_cm} cm roll` : ' · roll width to be confirmed'}
                {variant.pattern_repeat_cm ? ` · ${variant.pattern_repeat_cm} cm pattern repeat` : ''}
              </p>
            )}
          </div>
        );
      case 1:
        return (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold">Measure in</p>
              <UnitToggle value={unit} onChange={changeUnit} />
            </div>
            <div className={cn('grid gap-5', layout === 'wide' ? 'lg:grid-cols-[1fr_1fr]' : '')}>
              <div className="space-y-4">
                <MeasurementField
                  label="Finished width (whole pair)"
                  hint="The width both panels together should cover when closed — usually your rod width."
                  value={width}
                  onChange={setWidth}
                  error={showErrors ? errors.finishedWidth : null}
                />
                <MeasurementField
                  label="Finished drop"
                  hint="From the top of the heading to where the hem should end."
                  value={drop}
                  onChange={setDrop}
                  error={showErrors ? errors.finishedDrop : null}
                />
                <div>
                  <p id={`${uid}-pairs`} className="mb-1.5 text-sm font-semibold">
                    Number of pairs
                  </p>
                  <div className="inline-flex items-center rounded-full border border-line" role="group" aria-labelledby={`${uid}-pairs`}>
                    <button type="button" className="grid size-11 place-items-center rounded-full hover:bg-sand" onClick={() => setPairs((p) => Math.max(1, p - 1))} aria-label="Fewer pairs">
                      <Icon name="minus" size={16} />
                    </button>
                    <span className="min-w-10 text-center font-semibold tabular-nums" aria-live="polite">
                      {pairs}
                    </span>
                    <button
                      type="button"
                      className="grid size-11 place-items-center rounded-full hover:bg-sand"
                      onClick={() => setPairs((p) => Math.min(options.limits.maxPairs, p + 1))}
                      aria-label="More pairs"
                    >
                      <Icon name="plus" size={16} />
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs text-muted">One pair = two panels. Same size for every pair.</p>
                </div>
                <button type="button" className="text-left text-sm font-semibold text-brand hover:underline" onClick={() => openEnquiry({ kind: 'measurement', product: product.name })}>
                  Not sure? Book a home measurement visit →
                </button>
              </div>
              <div className="rounded-2xl bg-surface p-4">
                <DimensionsDiagram width={widthMm} drop={dropMm} />
                <MeasurementGuide className="mt-2" />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <OptionGroup
              legend="Heading style"
              name={`${uid}-heading`}
              value={heading}
              onChange={(v) => setHeading(v as HeadingStyle)}
              items={options.headings.map((h) => ({ value: h.id, label: h.label, description: h.description }))}
            />
            <OptionGroup
              legend="Fullness"
              name={`${uid}-fullness`}
              value={String(fullness)}
              onChange={(v) => {
                setFullness(Number(v));
                setFullnessTouched(true);
              }}
              items={options.fullness.map((f) => ({
                value: String(f.ratio),
                label: f.label,
                description: `${f.description}${f.ratio === store.pricing.rateCard.headings[heading].recommendedFullness ? ' Recommended for this heading.' : ''}`,
              }))}
            />
            <OptionGroup
              legend="Lining"
              name={`${uid}-lining`}
              value={lining}
              onChange={(v) => setLining(v as LiningOption)}
              items={options.linings.map((l) => ({ value: l.id, label: l.label, description: l.description }))}
            />
            <fieldset>
              <legend className="mb-2 text-sm font-semibold">Optional services</legend>
              <div className="space-y-2">
                <Check checked={measurementService} onChange={setMeasurementService} label={`Home measurement visit · ${formatINR(options.services.measurementFee)}`} note={options.services.measurementNote} />
                <Check checked={installation} onChange={setInstallation} label={`Installation · ${formatINR(options.services.installationPerPair)} per pair`} note={options.services.installationNote} />
              </div>
            </fieldset>
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
            {result?.kind === 'estimate' && <QuoteBreakdown result={result} pairs={pairs} />}
            {result?.kind === 'needs_confirmation' && (
              <div className="rounded-2xl border border-line bg-surface p-5">
                <p className="font-semibold">This fabric needs a showroom quotation</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                  {result.reasons.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-muted">We will not guess the fabric quantity. Send your configuration and we will confirm the price on WhatsApp.</p>
              </div>
            )}
            {result?.kind === 'invalid' && (
              <p className="text-sm text-sale">Please check your measurements: {Object.values(result.errors).join(' ')}</p>
            )}
            {isFestivalLive(store.festival) && store.festival.coupon && result?.kind === 'estimate' && (
              <div>
                <label htmlFor={`${uid}-coupon`} className="mb-1.5 block text-sm font-semibold">
                  Coupon code
                </label>
                <input
                  id={`${uid}-coupon`}
                  className="field max-w-xs uppercase"
                  placeholder={store.festival.coupon.code}
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <p className="mt-1.5 text-xs text-muted">{store.festival.coupon.description}.</p>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              Send this configuration to the showroom on WhatsApp. We will check your measurements and fabric availability, then confirm the final price before anything is cut.
            </p>
            <button type="button" className="btn btn-whatsapp w-full sm:w-auto" onClick={enquire}>
              <Icon name="whatsapp" /> Send my configuration
            </button>
            <p className="text-xs text-muted">{ESTIMATE_LABEL}</p>
          </div>
        );
    }
  };

  const summary = (
    <aside aria-label="Your configuration" className="rounded-2xl border border-line p-5">
      <h3 className="font-sans text-sm font-semibold tracking-wide text-muted uppercase">Your curtains</h3>
      <div className="mt-3 flex items-center gap-3">
        {variant && <SmartImage src={`/images/fabrics/${variant.variant_sku.toLowerCase()}.webp`} alt="" ratio="1" className="w-14 shrink-0 rounded-lg" />}
        <div className="min-w-0 text-sm">
          <p className="truncate font-semibold">{product.name}</p>
          <p className="text-muted">{variant?.name}</p>
        </div>
      </div>
      <dl className="mt-4 space-y-1.5 text-sm">
        <SummaryRow k="Size" v={widthMm && dropMm ? formatSize(widthMm, dropMm, unit) : '—'} />
        <SummaryRow k="Pairs" v={`${pairs} (${pairs * 2} panels)`} />
        <SummaryRow k="Heading" v={headingLabel(heading)} />
        <SummaryRow k="Lining" v={liningLabel(lining)} />
        <SummaryRow k="Fullness" v={`${fullness}×`} />
        <SummaryRow k="Services" v={[measurementService && 'Measurement', installation && 'Installation'].filter(Boolean).join(', ') || 'None'} />
      </dl>
      <div className="mt-4 border-t border-line pt-4">
        <p className="text-xs text-muted">Estimated total</p>
        <p className="font-display text-2xl tabular-nums" aria-live="polite">
          {estimate ? formatINR(estimate.total) : result?.kind === 'needs_confirmation' ? 'On request' : '—'}
        </p>
        <p className="mt-1 text-xs text-muted">{ESTIMATE_LABEL}</p>
      </div>
    </aside>
  );

  return (
    <div className={cn(layout === 'wide' && 'grid gap-8 lg:grid-cols-[1fr_320px]')}>
      <div>
        <ol className="mb-6 flex gap-1.5 overflow-x-auto scrollbar-none" aria-label="Steps">
          {STEPS.map((s, i) => (
            <li key={s} className="flex-1">
              <button
                type="button"
                onClick={() => canVisit(i) && setStep(i)}
                disabled={!canVisit(i)}
                aria-current={i === step ? 'step' : undefined}
                className="group w-full min-w-16 text-left disabled:opacity-50"
              >
                <span className={cn('block h-1 rounded-full', i <= step ? 'bg-brand' : 'bg-line')} />
                <span className={cn('mt-2 block text-[11px] font-semibold tracking-wide uppercase', i === step ? 'text-ink' : 'text-muted')}>
                  {i + 1}. {s}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <h3 className="mb-4 text-xl">
          Step {step + 1}: {['Select fabric', 'Enter measurements', 'Configure your curtains', 'Review the estimate', 'Enquire'][step]}
        </h3>
        <div key={step} className="animate-fade-in">
          {stepBody()}
        </div>
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5">
          <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <Icon name="chevronLeft" size={16} /> Back
          </button>
          {step < STEPS.length - 1 && (
            <button type="button" className="btn btn-primary" onClick={next}>
              {step === 2 ? 'See estimate' : step === 3 ? 'Continue' : 'Next'} <Icon name="chevronRight" size={16} />
            </button>
          )}
        </div>
        {!lockedProductId && (
          <p className="mt-4 text-xs text-muted">
            Prefer to browse first? <Link to="/catalog?sizing=custom" className="font-semibold text-brand hover:underline">See all made-to-measure designs</Link>.
          </p>
        )}
      </div>
      <div className={cn(layout === 'wide' ? 'lg:sticky lg:top-24 lg:self-start' : 'mt-6')}>{summary}</div>
    </div>
  );
}

function SummaryRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}

function OptionGroup({
  legend,
  name,
  value,
  onChange,
  items,
}: {
  legend: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  items: { value: string; label: string; description: string }[];
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((it) => (
          <label
            key={it.value}
            className={cn(
              'flex cursor-pointer gap-3 rounded-xl border p-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand',
              value === it.value ? 'border-ink bg-surface' : 'border-line hover:border-ink/40',
            )}
          >
            <input type="radio" name={name} value={it.value} checked={value === it.value} onChange={() => onChange(it.value)} className="mt-1 accent-[var(--color-brand)]" />
            <span>
              <span className="block text-sm font-medium">{it.label}</span>
              <span className="block text-xs text-muted">{it.description}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Check({ checked, onChange, label, note }: { checked: boolean; onChange: (v: boolean) => void; label: string; note: string }) {
  return (
    <label className={cn('flex cursor-pointer gap-3 rounded-xl border p-3', checked ? 'border-ink bg-surface' : 'border-line')}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 size-4 accent-[var(--color-brand)]" />
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted">{note}</span>
      </span>
    </label>
  );
}
