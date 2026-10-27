import type { HeadingStyle, LiningOption, Paise } from '../types/product';
import type { FabricConsumption, QuoteField, QuoteInput, QuoteLine, QuoteResult } from '../types/quote';
import type { QuoteRateCard } from '../types/store';
import { formatINR, gstIncluded, gstOnTop, pricePerMetreTimes } from './currency';
import { formatMetres } from './units';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CUSTOM CURTAIN ESTIMATE — CALCULATION POLICY
 *
 *  All lengths are integer millimetres; all money is integer paise.
 *  Rates come from `store.pricing.rateCard` (versioned as `rateCard.version`).
 *
 *  1. `finishedWidth` is the total width the PAIR covers when closed.
 *     Each panel covers half of it.
 *  2. Flat width per panel  = ⌈panel width × fullness⌉ + side hems.
 *  3. Cut drop               = finished drop + heading allowance + bottom hem,
 *                              rounded UP to a whole pattern repeat if the fabric has one.
 *  4. Fabric widths / panel  = the fewest roll widths that, joined with seams
 *                              (each seam loses `seamAllowanceMm`), cover the flat width.
 *     Railroading: if the fabric is railroadable and its roll is at least as
 *     tall as the cut drop, one continuous length = flat width is used instead.
 *  5. Total fabric           = widths × cut drop × panels × pairs, rounded up
 *                              to `roundUpToMm` (or flat width × panels × pairs when railroaded).
 *  6. Stitching, heading and lining-attachment charges are per sewn fabric width
 *     (railroaded fabric: per `railroadStitchSectionMm` of flat width).
 *  7. Lining is never railroaded; it is cut on `liningRollWidthMm` rolls with a
 *     cut drop of finished drop + heading allowance.
 *  8. Measurement visit: flat fee. Installation: per pair, labour only.
 *  9. A coupon is deducted when the subtotal meets its minimum order value.
 * 10. GST is either extracted (prices include GST — shown for information) or
 *     added on top, depending on `store.pricing.gst.included`.
 *
 *  If the fabric's roll width or per-metre price is unknown the engine returns
 *  `needs_confirmation` rather than inventing a consumption figure.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface QuoteFabricSpec {
  rollWidthCm: number | null;
  pricePerMeter: Paise | null;
  patternRepeatCm: number | null;
  railroadable: boolean;
}

export interface QuoteContext {
  rateCard: QuoteRateCard;
  gst: { included: boolean; ratePercent: number };
  /** Headings and linings this product can be made with. */
  allowedHeadings: HeadingStyle[];
  allowedLinings: LiningOption[];
  /** A coupon that has already been validated for this product and date. */
  coupon?: { code: string; discount: Paise; minOrder: Paise } | null;
}

export const PANELS_PER_PAIR = 2;

const ceilDiv = (a: number, b: number) => Math.ceil(a / b);
const roundUpTo = (value: number, step: number) => (step > 0 ? Math.ceil(value / step) * step : value);

/** Validate a quote request. Returns an empty object when everything is fine. */
export function validateQuoteInput(
  input: Pick<QuoteInput, 'finishedWidth' | 'finishedDrop' | 'pairs' | 'fullnessRatio' | 'heading' | 'lining' | 'variantId'>,
  ctx: Pick<QuoteContext, 'rateCard' | 'allowedHeadings' | 'allowedLinings'>,
): Partial<Record<QuoteField, string>> {
  const { limits } = ctx.rateCard;
  const errors: Partial<Record<QuoteField, string>> = {};
  const isLength = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && n > 0;

  if (!input.variantId) errors.variantId = 'Choose a fabric colour.';

  if (!isLength(input.finishedWidth)) errors.finishedWidth = 'Enter the finished width.';
  else if (input.finishedWidth < limits.minWidthMm) errors.finishedWidth = `Width must be at least ${limits.minWidthMm / 10} cm.`;
  else if (input.finishedWidth > limits.maxWidthMm)
    errors.finishedWidth = `Widths over ${limits.maxWidthMm / 10} cm need a site visit — please request a quote.`;

  if (!isLength(input.finishedDrop)) errors.finishedDrop = 'Enter the finished drop.';
  else if (input.finishedDrop < limits.minDropMm) errors.finishedDrop = `Drop must be at least ${limits.minDropMm / 10} cm.`;
  else if (input.finishedDrop > limits.maxDropMm)
    errors.finishedDrop = `Drops over ${limits.maxDropMm / 10} cm need a site visit — please request a quote.`;

  if (!Number.isInteger(input.pairs) || input.pairs < 1) errors.pairs = 'Choose at least one pair.';
  else if (input.pairs > limits.maxPairs) errors.pairs = `For more than ${limits.maxPairs} pairs, request a project quote.`;

  if (!(input.fullnessRatio >= 1 && input.fullnessRatio <= 3)) errors.fullnessRatio = 'Fullness must be between 1× and 3×.';
  if (!ctx.allowedHeadings.includes(input.heading)) errors.heading = 'This heading is not available for this design.';
  if (!ctx.allowedLinings.includes(input.lining)) errors.lining = 'This lining is not available for this design.';
  return errors;
}

/** Fabric and lining consumption for the whole order. Requires a known roll width. */
export function calculateFabricConsumption(
  input: Pick<QuoteInput, 'finishedWidth' | 'finishedDrop' | 'pairs' | 'fullnessRatio' | 'lining'>,
  fabric: { rollWidthCm: number; patternRepeatCm: number | null; railroadable: boolean },
  allowances: QuoteRateCard['allowances'],
): FabricConsumption & { stitchUnitsPerPanel: number } {
  const panels = PANELS_PER_PAIR * input.pairs;
  const panelFinishedWidth = ceilDiv(input.finishedWidth, PANELS_PER_PAIR);
  // Fullness may be fractional (1.5×); scale by 10 to keep integer maths.
  const flatWidthPerPanel =
    ceilDiv(panelFinishedWidth * Math.round(input.fullnessRatio * 10), 10) + allowances.sideHemsPerPanelMm;

  const baseCutDrop = input.finishedDrop + allowances.headingAllowanceMm + allowances.bottomHemMm;
  const repeatMm = fabric.patternRepeatCm ? Math.round(fabric.patternRepeatCm * 10) : 0;
  const rollMm = Math.round(fabric.rollWidthCm * 10);

  const railroaded = fabric.railroadable && !repeatMm && rollMm >= baseCutDrop;

  let widthsPerPanel: number;
  let cutDrop: number;
  let fabricPerPanel: number;
  let stitchUnitsPerPanel: number;

  if (railroaded) {
    widthsPerPanel = 1;
    cutDrop = baseCutDrop;
    fabricPerPanel = flatWidthPerPanel;
    stitchUnitsPerPanel = ceilDiv(flatWidthPerPanel, allowances.railroadStitchSectionMm);
  } else {
    cutDrop = repeatMm ? roundUpTo(baseCutDrop, repeatMm) : baseCutDrop;
    const usable = rollMm - allowances.seamAllowanceMm;
    widthsPerPanel =
      flatWidthPerPanel <= rollMm ? 1 : Math.max(1, ceilDiv(flatWidthPerPanel - allowances.seamAllowanceMm, usable));
    fabricPerPanel = widthsPerPanel * cutDrop;
    stitchUnitsPerPanel = widthsPerPanel;
  }

  const totalFabric = roundUpTo(fabricPerPanel * panels, allowances.roundUpToMm);

  let totalLining = 0;
  if (input.lining !== 'unlined') {
    const liningUsable = allowances.liningRollWidthMm - allowances.seamAllowanceMm;
    const liningWidths =
      flatWidthPerPanel <= allowances.liningRollWidthMm
        ? 1
        : Math.max(1, ceilDiv(flatWidthPerPanel - allowances.seamAllowanceMm, liningUsable));
    const liningDrop = input.finishedDrop + allowances.headingAllowanceMm;
    totalLining = roundUpTo(liningWidths * liningDrop * panels, allowances.roundUpToMm);
  }

  return {
    panels,
    widthsPerPanel,
    cutDrop,
    railroaded,
    totalFabric,
    totalLining,
    flatWidthPerPanel,
    stitchUnitsPerPanel,
  };
}

/** Build an itemised, clearly-labelled estimate for a made-to-measure order. */
export function calculateQuote(input: QuoteInput, fabric: QuoteFabricSpec, ctx: QuoteContext): QuoteResult {
  const { rateCard } = ctx;
  const errors = validateQuoteInput(input, ctx);
  if (Object.keys(errors).length > 0) return { kind: 'invalid', errors };

  const reasons: string[] = [];
  if (!fabric.rollWidthCm || fabric.rollWidthCm <= 0) reasons.push('The roll width of this fabric is still being confirmed.');
  if (fabric.pricePerMeter == null || fabric.pricePerMeter <= 0) reasons.push('The fabric rate for this colourway is set by the showroom.');
  if (reasons.length > 0 || !fabric.rollWidthCm || fabric.pricePerMeter == null) {
    return { kind: 'needs_confirmation', reasons, ruleVersion: rateCard.version };
  }

  const c = calculateFabricConsumption(input, { ...fabric, rollWidthCm: fabric.rollWidthCm }, rateCard.allowances);
  const stitchUnits = c.stitchUnitsPerPanel * c.panels;
  const heading = rateCard.headings[input.heading];
  const lining = rateCard.linings[input.lining];
  const unitWord = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

  const lines: QuoteLine[] = [];
  lines.push({
    key: 'fabric',
    label: 'Fabric',
    detail: `${formatMetres(c.totalFabric)} × ${formatINR(fabric.pricePerMeter)}/m${c.railroaded ? ' (railroaded)' : ''}`,
    amount: pricePerMetreTimes(fabric.pricePerMeter, c.totalFabric),
  });
  lines.push({
    key: 'stitching',
    label: 'Stitching',
    detail: `${unitWord(stitchUnits, 'width')} × ${formatINR(rateCard.stitchingPerWidth)}`,
    amount: stitchUnits * rateCard.stitchingPerWidth,
  });
  if (heading.chargePerWidth > 0) {
    lines.push({
      key: 'heading',
      label: `${heading.label} heading`,
      detail: `${unitWord(stitchUnits, 'width')} × ${formatINR(heading.chargePerWidth)}`,
      amount: stitchUnits * heading.chargePerWidth,
    });
  }
  if (input.lining !== 'unlined') {
    lines.push({
      key: 'lining',
      label: lining.label,
      detail: `${formatMetres(c.totalLining)} × ${formatINR(lining.pricePerMeter)}/m + attaching`,
      amount: pricePerMetreTimes(lining.pricePerMeter, c.totalLining) + stitchUnits * lining.stitchingPerWidth,
    });
  }
  if (input.measurementService) {
    lines.push({
      key: 'measurement',
      label: 'Home measurement visit',
      detail: rateCard.services.measurementNote,
      amount: rateCard.services.measurementFee,
    });
  }
  if (input.installation) {
    lines.push({
      key: 'installation',
      label: 'Installation',
      detail: `${unitWord(input.pairs, 'pair')} × ${formatINR(rateCard.services.installationPerPair)}`,
      amount: input.pairs * rateCard.services.installationPerPair,
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);
  const notes: string[] = [];

  let discount = 0;
  if (ctx.coupon) {
    if (subtotal >= ctx.coupon.minOrder) {
      discount = Math.min(ctx.coupon.discount, subtotal);
      lines.push({ key: 'discount', label: `Coupon ${ctx.coupon.code}`, detail: 'Festival offer', amount: -discount });
    } else {
      notes.push(`Add ${formatINR(ctx.coupon.minOrder - subtotal)} more to use ${ctx.coupon.code}.`);
    }
  }

  const taxable = subtotal - discount;
  let gst: number;
  let total: number;
  if (ctx.gst.included) {
    gst = gstIncluded(taxable, ctx.gst.ratePercent);
    total = taxable;
    lines.push({ key: 'gst', label: `GST ${ctx.gst.ratePercent}% (included)`, detail: 'Included in the prices above', amount: gst, informational: true });
  } else {
    gst = gstOnTop(taxable, ctx.gst.ratePercent);
    total = taxable + gst;
    lines.push({ key: 'gst', label: `GST ${ctx.gst.ratePercent}%`, detail: 'Added to the estimate', amount: gst });
  }

  if (fabric.patternRepeatCm) notes.push(`Includes extra fabric to match the ${fabric.patternRepeatCm} cm pattern repeat.`);
  notes.push('Rods, tracks and brackets are not included.');

  return {
    kind: 'estimate',
    consumption: c,
    lines,
    subtotal,
    discount,
    gst,
    total,
    perPair: Math.round(total / input.pairs),
    ruleVersion: rateCard.version,
    notes,
  };
}
