import { describe, expect, it } from 'vitest';
import { store } from '../config/store';
import type { QuoteInput } from '../types/quote';
import { formatINR, formatINRCompact, gstIncluded, rupees, toRetailPrice, validDiscountPct } from '../utils/currency';
import { calculateFabricConsumption, calculateQuote, validateQuoteInput, type QuoteContext } from '../utils/pricing';

const rc = store.pricing.rateCard;
const ctx: QuoteContext = {
  rateCard: rc,
  gst: { included: true, ratePercent: 5 },
  allowedHeadings: ['eyelet', 'pinch_pleat'],
  allowedLinings: ['unlined', 'blackout_lining'],
};
const fabric = { rollWidthCm: 140, pricePerMeter: rupees(500), patternRepeatCm: null, railroadable: false };
const base: QuoteInput = {
  productId: 'p',
  variantId: 'v',
  finishedWidth: 2000,
  finishedDrop: 2400,
  displayUnit: 'cm',
  pairs: 1,
  fullnessRatio: 2,
  heading: 'eyelet',
  lining: 'unlined',
  installation: false,
  measurementService: false,
};

describe('currency', () => {
  it('formats with Indian digit grouping', () => {
    expect(formatINR(rupees(124999))).toBe('₹1,24,999');
    expect(formatINR(rupees(4999))).toBe('₹4,999');
    expect(formatINR(12345)).toBe('₹123.45');
  });
  it('formats lakh and crore', () => {
    expect(formatINRCompact(rupees(100000))).toBe('₹1 lakh');
    expect(formatINRCompact(rupees(125000))).toBe('₹1.25 lakh');
    expect(formatINRCompact(rupees(24000000))).toBe('₹2.4 crore');
    expect(formatINRCompact(rupees(9999))).toBe('₹9,999');
  });
  it('rounds to retail ₹…99 price points', () => {
    expect(toRetailPrice(rupees(4951))).toBe(rupees(4999));
    expect(toRetailPrice(rupees(4999))).toBe(rupees(4999));
    expect(toRetailPrice(rupees(5000))).toBe(rupees(5099));
  });
  it('extracts included GST in whole paise', () => {
    expect(gstIncluded(rupees(1050), 5)).toBe(rupees(50));
  });
});

describe('discount validation', () => {
  it('returns a percentage only for genuine discounts', () => {
    expect(validDiscountPct(rupees(5999), rupees(4299))).toBe(28);
    expect(validDiscountPct(rupees(4000), rupees(4000))).toBeNull();
    expect(validDiscountPct(rupees(3000), rupees(4000))).toBeNull();
    expect(validDiscountPct(0, rupees(100))).toBeNull();
    expect(validDiscountPct(null, rupees(100))).toBeNull();
    expect(validDiscountPct(rupees(100), -5)).toBeNull();
    expect(validDiscountPct(10000, 9950)).toBeNull(); // under 1%
  });
});

describe('fabric consumption', () => {
  it('uses whole fabric widths per panel and adds hems + heading to the drop', () => {
    const c = calculateFabricConsumption(base, fabric, rc.allowances);
    // panel = 1000 mm × 2 fullness + 100 side hems = 2100 → 2 widths of 140 cm
    expect(c.flatWidthPerPanel).toBe(2100);
    expect(c.widthsPerPanel).toBe(2);
    expect(c.cutDrop).toBe(2400 + 150 + 150);
    expect(c.totalFabric).toBe(2 * 2 * 2700); // 10.8 m, already a 10 cm multiple
    expect(c.railroaded).toBe(false);
  });

  it('rounds the cut drop up to the pattern repeat', () => {
    const c = calculateFabricConsumption(base, { ...fabric, patternRepeatCm: 64 }, rc.allowances);
    expect(c.cutDrop).toBe(3200); // 2700 → 5 × 640
  });

  it('railroads wide fabrics when the roll is taller than the cut drop', () => {
    const c = calculateFabricConsumption(base, { rollWidthCm: 300, patternRepeatCm: null, railroadable: true }, rc.allowances);
    expect(c.railroaded).toBe(true);
    expect(c.totalFabric).toBe(4200); // 2 panels × 2100 mm
  });

  it('scales with the number of pairs', () => {
    const one = calculateFabricConsumption(base, fabric, rc.allowances).totalFabric;
    const three = calculateFabricConsumption({ ...base, pairs: 3 }, fabric, rc.allowances).totalFabric;
    expect(three).toBe(one * 3);
  });

  it('adds lining only when lined', () => {
    expect(calculateFabricConsumption(base, fabric, rc.allowances).totalLining).toBe(0);
    expect(calculateFabricConsumption({ ...base, lining: 'blackout_lining' }, fabric, rc.allowances).totalLining).toBeGreaterThan(0);
  });
});

describe('custom quote', () => {
  it('produces itemised integer lines that add up to the total', () => {
    const r = calculateQuote({ ...base, lining: 'blackout_lining', installation: true, measurementService: true }, fabric, ctx);
    expect(r.kind).toBe('estimate');
    if (r.kind !== 'estimate') return;
    const added = r.lines.filter((l) => !l.informational).reduce((s, l) => s + l.amount, 0);
    expect(added).toBe(r.total);
    r.lines.forEach((l) => expect(Number.isInteger(l.amount)).toBe(true));
    expect(r.lines.find((l) => l.key === 'fabric')!.amount).toBe(rupees(5400)); // 10.8 m × ₹500
    expect(r.lines.find((l) => l.key === 'stitching')!.amount).toBe(4 * rc.stitchingPerWidth);
    expect(r.lines.find((l) => l.key === 'installation')!.amount).toBe(rc.services.installationPerPair);
    expect(r.ruleVersion).toBe(rc.version);
  });

  it('adds GST on top when prices exclude GST', () => {
    const inc = calculateQuote(base, fabric, ctx);
    const exc = calculateQuote(base, fabric, { ...ctx, gst: { included: false, ratePercent: 5 } });
    if (inc.kind !== 'estimate' || exc.kind !== 'estimate') throw new Error('expected estimates');
    expect(exc.total).toBe(inc.subtotal + Math.round(inc.subtotal * 0.05));
    expect(inc.total).toBe(inc.subtotal);
  });

  it('applies a coupon only above its minimum order', () => {
    const coupon = { code: 'TEST', discount: rupees(2000), minOrder: rupees(15000) };
    const small = calculateQuote(base, fabric, { ...ctx, coupon });
    const big = calculateQuote({ ...base, pairs: 4 }, fabric, { ...ctx, coupon });
    if (small.kind !== 'estimate' || big.kind !== 'estimate') throw new Error('expected estimates');
    expect(small.discount).toBe(0);
    expect(small.notes.some((n) => n.includes('TEST'))).toBe(true);
    expect(big.discount).toBe(rupees(2000));
    expect(big.total).toBe(big.subtotal - rupees(2000));
  });

  it('asks for showroom confirmation instead of inventing consumption', () => {
    expect(calculateQuote(base, { ...fabric, rollWidthCm: null }, ctx).kind).toBe('needs_confirmation');
    expect(calculateQuote(base, { ...fabric, pricePerMeter: null }, ctx).kind).toBe('needs_confirmation');
  });
});

describe('custom quote input validation', () => {
  it('accepts a sensible request', () => {
    expect(validateQuoteInput(base, ctx)).toEqual({});
  });
  it('flags missing, tiny and huge measurements', () => {
    expect(validateQuoteInput({ ...base, finishedWidth: 0 }, ctx).finishedWidth).toBeDefined();
    expect(validateQuoteInput({ ...base, finishedWidth: Number.NaN }, ctx).finishedWidth).toBeDefined();
    expect(validateQuoteInput({ ...base, finishedWidth: 100 }, ctx).finishedWidth).toMatch(/at least/);
    expect(validateQuoteInput({ ...base, finishedDrop: 99999 }, ctx).finishedDrop).toMatch(/site visit/);
  });
  it('flags invalid pairs, fullness, heading and lining', () => {
    expect(validateQuoteInput({ ...base, pairs: 0 }, ctx).pairs).toBeDefined();
    expect(validateQuoteInput({ ...base, pairs: 1.5 }, ctx).pairs).toBeDefined();
    expect(validateQuoteInput({ ...base, pairs: 99 }, ctx).pairs).toBeDefined();
    expect(validateQuoteInput({ ...base, fullnessRatio: 5 }, ctx).fullnessRatio).toBeDefined();
    expect(validateQuoteInput({ ...base, heading: 'rod_pocket' }, ctx).heading).toBeDefined();
    expect(validateQuoteInput({ ...base, lining: 'thermal_lining' }, ctx).lining).toBeDefined();
  });
  it('returns invalid results from the quote engine', () => {
    expect(calculateQuote({ ...base, pairs: 0 }, fabric, ctx).kind).toBe('invalid');
  });
});
