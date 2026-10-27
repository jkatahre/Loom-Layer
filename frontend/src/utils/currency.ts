import type { Paise } from '../types/product';

/**
 * Money helpers. All amounts are integer paise so totals never suffer from
 * floating-point drift; rupee formatting happens only for display.
 */

/** Convert a rupee amount (as written in config/data) to integer paise. */
export function rupees(amount: number): Paise {
  return Math.round(amount * 100);
}

const wholeRupeeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const paiseFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

/** `₹1,24,999` — Indian digit grouping. Shows paise only when present. */
export function formatINR(amount: Paise): string {
  const whole = amount % 100 === 0;
  return (whole ? wholeRupeeFormatter : paiseFormatter).format(amount / 100);
}

/** `₹1 lakh`, `₹1.25 lakh`, `₹2.4 crore`; falls back to `formatINR` below one lakh. */
export function formatINRCompact(amount: Paise): string {
  const r = amount / 100;
  const trim = (n: number) => String(Number(n.toFixed(2)));
  if (r >= 1_00_00_000) return `₹${trim(r / 1_00_00_000)} crore`;
  if (r >= 1_00_000) return `₹${trim(r / 1_00_000)} lakh`;
  return formatINR(amount);
}

/**
 * Discount percentage, but only when the discount is genuine: both prices
 * positive and the sale price strictly below MRP. Returns `null` otherwise.
 */
export function validDiscountPct(mrp: Paise | null | undefined, sale: Paise | null | undefined): number | null {
  if (mrp == null || sale == null) return null;
  if (!Number.isInteger(mrp) || !Number.isInteger(sale)) return null;
  if (mrp <= 0 || sale <= 0 || sale >= mrp) return null;
  const pct = Math.floor(((mrp - sale) * 100) / mrp);
  return pct >= 1 ? pct : null;
}

/** Increase / decrease by a percentage, rounded to the nearest paisa. */
export function adjustByPercent(amount: Paise, pct: number): Paise {
  return Math.round((amount * (100 + pct)) / 100);
}

/**
 * Round to a retail price ending in 99 rupees (e.g. ₹4,951 → ₹4,999).
 * Used only when generating sample price lists.
 */
export function toRetailPrice(amount: Paise): Paise {
  const r = Math.max(1, Math.round(amount / 100));
  const hundreds = Math.ceil((r + 1) / 100);
  return (hundreds * 100 - 1) * 100;
}

/** Monthly EMI rounded up to the next rupee (no interest — illustration only). */
export function emiPerMonth(amount: Paise, months: number): Paise {
  if (months <= 0) return amount;
  return Math.ceil(amount / months / 100) * 100;
}

/** GST contained within a GST-inclusive amount. */
export function gstIncluded(inclusiveAmount: Paise, ratePercent: number): Paise {
  return Math.round((inclusiveAmount * ratePercent) / (100 + ratePercent));
}

/** GST to add on top of a GST-exclusive amount. */
export function gstOnTop(exclusiveAmount: Paise, ratePercent: number): Paise {
  return Math.round((exclusiveAmount * ratePercent) / 100);
}

/** Multiply a per-metre price by a length in millimetres, rounded to the paisa. */
export function pricePerMetreTimes(pricePerMeter: Paise, lengthMm: number): Paise {
  return Math.round((pricePerMeter * lengthMm) / 1000);
}
